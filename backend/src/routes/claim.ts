import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { verifyClaim } from '../services/factChecker.js';
import { extractArticleFromUrl } from '../services/scrape.js';

const router = Router();

// Zod schema for validating the incoming request body
const checkClaimBodySchema = z.object({
  claim: z
    .string({ required_error: 'claim is required' })
    .min(1, 'claim cannot be empty')
    .max(2000, 'claim exceeds maximum length of 2000 characters'),
});

// Sample mock response matching frontend ClaimAnalysis
function buildMockResponse(originalClaim: string) {
  const cleanedClaim = originalClaim
    .replace(/\?+$/, '?')
    .replace(/!+$/, '')
    .trim()
    .replace(/\s+/g, ' ');

  // Simple deterministic data for now
  return {
    id: `check-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    originalClaim,
    cleanedClaim,
    verdict: 'unverified',
    confidence: 50,
    summary:
      "This is a mocked response. Replace with AI pipeline in Phase 2.",
    sources: [
      {
        title: 'Example Source',
        source: 'Generic News',
        url: 'https://example.com/generic',
        publishedAt: new Date().toISOString().split('T')[0],
        snippet: 'Placeholder source for development.',
        reliabilityScore: 70,
      },
    ],
    checkedAt: new Date().toISOString(),
  };
}

router.post('/check-claim', async (req: Request, res: Response) => {
  const parseResult = checkClaimBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parseResult.error.format(),
    });
  }

  const { claim } = parseResult.data;
  const userId = (req.header('x-user-id') || 'demo-user').toString();

  // URL detection
  let processedClaim = claim;
  try {
    const u = new URL(claim);
    if (u.protocol === 'http:' || u.protocol === 'https:') {
      const article = await extractArticleFromUrl(claim);
      if (article) {
        processedClaim = `Fact-check the main assertions in this article and summarize truthfully.\nURL: ${claim}\nTITLE: ${article.title}\nCONTENT: ${article.text}`;
      }
    }
  } catch { /* not a URL */ }

  try {
    const result = await verifyClaim(processedClaim, userId);
    // Preserve what user typed as originalClaim for UI
    const response = { ...result, originalClaim: claim };
    return res.json(response);
  } catch (e) {
    console.error('check-claim error:', (e as Error).message);
    // Fallback to a mock payload to keep UX flowing
    await new Promise((r) => setTimeout(r, 2000));
    return res.json(buildMockResponse(claim));
  }
});

export default router;

