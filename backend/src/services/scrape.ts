import { JSDOM } from 'jsdom';
import { fetch } from 'undici';

export interface ArticleData {
  title: string;
  text: string;
}

function isProbablyMainContent(node: Element): boolean {
  const classes = (node.getAttribute('class') || '').toLowerCase();
  const id = (node.getAttribute('id') || '').toLowerCase();
  const hints = ['article', 'content', 'post', 'main', 'story', 'entry'];
  return hints.some((h) => classes.includes(h) || id.includes(h));
}

export async function extractArticleFromUrl(url: string): Promise<ArticleData | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'NewsCheckBot/1.0' },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const title = (doc.querySelector('meta[property="og:title"]')?.getAttribute('content')
      || doc.querySelector('title')?.textContent
      || '').trim();

    // Try to find main article container
let container = doc.querySelector('article');
if (!container) {
  const nodes = Array.from(doc.querySelectorAll('div, main, section')) as Element[];
  const candidates = nodes.filter((el: Element) => isProbablyMainContent(el));
  container = candidates.sort(
    (a: Element, b: Element) => (b.textContent?.length || 0) - (a.textContent?.length || 0)
  )[0] as Element | undefined;
}

    const bodyText = (container?.textContent || doc.body.textContent || '').replace(/\s+/g, ' ').trim();
    if (!bodyText) return null;

    return { title, text: bodyText.slice(0, 20000) };
  } finally {
    clearTimeout(timer);
  }
}


