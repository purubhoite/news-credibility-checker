import axios from 'axios';
import crypto from 'node:crypto';
import { cache } from './cache.js';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type VerdictType = 'true' | 'false' | 'partial' | 'unverified';

export interface SourceItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  snippet: string;
  reliabilityScore: number;
}

export interface ApiResponse {
  id: string;
  originalClaim: string;
  cleanedClaim: string;
  verdict: VerdictType;
  confidence: number; // 0-100
  summary: string;
  sources: SourceItem[];
  checkedAt: string; // ISO
}

const prisma = new PrismaClient();

function cleanClaim(text: string): string {
  return text
    .replace(/\?+$/, '?')
    .replace(/!+$/, '')
    .trim()
    .replace(/\s+/g, ' ');
}

function extractUrls(input: string): string[] {
  const urlRegex = /(https?:\/\/[\w.-]+(?:\/[\w\-.~:?#@!$&'()*+,;=%]*)?)/gi;
  const matches = input.match(urlRegex) || [];
  return Array.from(new Set(matches));
}

function buildPerplexityPrompt(userClaim: string): { system: string; user: string } {
  const system = `You are NewsCheck, a professional fact-checking assistant. Your job is to investigate the claim using current, reputable sources and provide a concise, well-evidenced analysis with citations. Prefer authoritative outlets, scientific/official sources, and well-established fact-checkers. Avoid speculation.`;

  const user = `Fact-check the following claim.\n\nClaim:\n"""\n${userClaim}\n"""\n\nInstructions:\n- Search current, reputable sources.\n- Provide a concise assessment.\n- List 5-8 top sources with titles and URLs and short snippets with dates.\n- Include a brief rationale.\n- Keep output readable. DO NOT fabricate links.`;

  return { system, user };
}

async function callPerplexity(userClaim: string): Promise<string> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) throw new Error('Missing PERPLEXITY_API_KEY');

  const { system, user } = buildPerplexityPrompt(userClaim);

  // Allow explicit model override via env
  const envModel = process.env.PERPLEXITY_MODEL?.trim();
  const candidateModels = envModel && envModel.length > 0
    ? [envModel]
    : [
        // Prefer general 'sonar' alias by default; then safe instruct fallback
        'sonar',
      ];

  let lastError: any;
  for (const model of candidateModels) {
    try {
      const resp = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30_000,
        },
      );

      const text = resp.data?.choices?.[0]?.message?.content;
      if (!text || typeof text !== 'string') {
        throw new Error('Perplexity returned no content');
      }
      return text;
    } catch (err: any) {
      lastError = err;
      const status = err?.response?.status;
      const data = err?.response?.data;
      const type = data?.error?.type || '';
      if (status === 400 && String(type).includes('invalid_model')) {
        // Try next model
        continue;
      }
      break;
    }
  }

  const status = lastError?.response?.status;
  const data = lastError?.response?.data;
  const detail = typeof data === 'string' ? data : JSON.stringify(data);
  throw new Error(
    `Perplexity API error ${status || ''}: ${detail || lastError?.message}. ` +
    `Set PERPLEXITY_MODEL in backend/.env to a permitted model per https://docs.perplexity.ai/getting-started/models`
  );
}

function buildGeminiPrompt(perplexityText: string, originalClaim: string): string {
  return `You are a JSON formatter. Transform the following fact-check analysis into EXACT JSON with this TypeScript shape:\n\nTypeScript:\n type VerdictType = 'true' | 'false' | 'partial' | 'unverified';\n interface Source { title: string; source: string; url: string; publishedAt: string; snippet: string; reliabilityScore: number; }\n interface Result { cleanedClaim: string; verdict: VerdictType; confidence: number; summary: string; sources: Source[] }\n\nRules:\n- Output ONLY valid JSON for Result. No markdown.\n- cleanedClaim: cleaned version of the original claim.\n- verdict: one of 'true' | 'false' | 'partial' | 'unverified'.\n- confidence: integer 0-100 reflecting certainty.\n- summary: 2-4 sentences summarizing findings.\n- sources: derive 4-8 items by extracting real URLs from the analysis below; include a human-readable source name, title, short snippet and ISO date if present. reliabilityScore: 0-100 (higher for authoritative sources).\n- If URLs are missing, keep sources empty array.\n\nOriginal Claim:\n${originalClaim}\n\nAnalysis:\n${perplexityText}`;
}

function parseJsonFlexible(text: string): any {
  // Remove markdown code fences if present
  const cleaned = text
    .replace(/^```[a-zA-Z]*\n/m, '')
    .replace(/\n```\s*$/m, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract the first JSON object
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const candidate = cleaned.slice(start, end + 1);
      return JSON.parse(candidate);
    }
    throw new Error('Malformed JSON from Gemini');
  }
}

async function callGemini(perplexityText: string, originalClaim: string): Promise<{
  cleanedClaim: string;
  verdict: VerdictType;
  confidence: number;
  summary: string;
  sources: SourceItem[];
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModelName = (process.env.GEMINI_MODEL || '').trim() || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: geminiModelName });
    const prompt = buildGeminiPrompt(perplexityText, originalClaim);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }]}],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });
    const text = result.response.text();

    const parsed = parseJsonFlexible(text);
    return {
      cleanedClaim: typeof parsed.cleanedClaim === 'string' ? parsed.cleanedClaim : cleanClaim(originalClaim),
      verdict: (['true', 'false', 'partial', 'unverified'] as VerdictType[]).includes(parsed.verdict) ? parsed.verdict : 'unverified',
      confidence: Number.isInteger(parsed.confidence) ? Math.max(0, Math.min(100, parsed.confidence)) : 50,
      summary: typeof parsed.summary === 'string' ? parsed.summary : 'Unable to summarize the claim with high confidence.',
      sources: Array.isArray(parsed.sources)
        ? parsed.sources.map((s: any): SourceItem => ({
            title: String(s.title || 'Source'),
            source: String(s.source || 'Unknown'),
            url: String(s.url || ''),
            publishedAt: String(s.publishedAt || new Date().toISOString().split('T')[0]),
            snippet: String(s.snippet || ''),
            reliabilityScore: Number.isFinite(Number(s.reliabilityScore)) ? Math.max(0, Math.min(100, Number(s.reliabilityScore))) : 60,
          }))
        : [],
    };
  } catch (err: any) {
    const msg = err?.message || 'Gemini error';
    throw new Error(`Gemini API error: ${msg}. Fallback will be used.`);
  }
}

function cacheKeyForClaim(claim: string): string {
  const hash = crypto.createHash('sha256').update(claim).digest('hex');
  return `check:v1:${hash}`;
}

export async function verifyClaim(userClaim: string, userId: string): Promise<ApiResponse> {
  const key = cacheKeyForClaim(userClaim);
  const cached = await cache.get<ApiResponse>(key);
  if (cached) return cached;

  const perplexityText = await callPerplexity(userClaim);
  const structured = await callGemini(perplexityText, userClaim);

  const result: ApiResponse = {
    id: crypto.randomUUID(),
    originalClaim: userClaim,
    cleanedClaim: structured.cleanedClaim,
    verdict: structured.verdict,
    confidence: structured.confidence,
    summary: structured.summary,
    sources: structured.sources,
    checkedAt: new Date().toISOString(),
  };

  // Save to DB (best-effort)
  try {
    await prisma.check.create({
      data: {
        id: result.id,
        userId,
        originalClaim: result.originalClaim,
        cleanedClaim: result.cleanedClaim,
        verdict: result.verdict,
        confidence: result.confidence,
        summary: result.summary,
        checkedAt: new Date(result.checkedAt),
        sources: {
          create: result.sources.map((s) => ({
            title: s.title,
            source: s.source,
            url: s.url,
            publishedAt: s.publishedAt,
            snippet: s.snippet,
            reliabilityScore: s.reliabilityScore,
          })),
        },
      },
      include: { sources: true },
    });
  } catch (e) {
    // Non-fatal; continue
    console.warn('Failed to persist check:', (e as Error).message);
  }

  // Cache for 24h
  await cache.set(key, result, 60 * 60 * 24);
  return result;
}


