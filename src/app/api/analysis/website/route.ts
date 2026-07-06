import { NextRequest, NextResponse } from 'next/server';
import { detectCMS, resolveUpgradeStrategy } from '@/lib/websiteAnalysis';

/**
 * POST /api/analysis/website
 * Body: { url: string }
 *
 * Fetches the raw HTML of a website and performs:
 * 1. Basic metadata extraction (title, metaDescription, dominantColor)
 * 2. CMS fingerprinting (WordPress, Shopify, Wix, Squarespace, Webflow, etc.)
 * 3. Upgrade strategy resolution (plugin | script_embed | full_rebuild)
 */
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'Missing url in request body' }, { status: 400 });
    }

    let html = '';
    let responseHeaders: Record<string, string> = {};

    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LeadBot/1.0)' },
        signal: AbortSignal.timeout(8000),
      });

      if (!resp.ok) {
        return NextResponse.json({ error: `Failed to fetch URL: ${resp.status}` }, { status: 502 });
      }

      html = await resp.text();
      resp.headers.forEach((value, key) => { responseHeaders[key] = value; });
    } catch (fetchErr: any) {
      return NextResponse.json({ error: `Could not reach website: ${fetchErr.message}` }, { status: 502 });
    }

    // ── Basic metadata ────────────────────────────────────────────────────────
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']\s*\/?>/i);
    const metaDescription = descMatch ? descMatch[1].trim() : '';

    let dominantColor = '';
    const themeMatch = html.match(/<meta\s+name=["']theme-color["']\s+content=["'](#?[0-9a-fA-F]{3,6})["']\s*\/?>/i);
    if (themeMatch) {
      dominantColor = themeMatch[1].startsWith('#') ? themeMatch[1] : `#${themeMatch[1]}`;
    } else {
      const hexMatch = html.match(/#([0-9a-fA-F]{6})/);
      if (hexMatch) dominantColor = `#${hexMatch[1]}`;
    }

    // ── CMS Fingerprinting ────────────────────────────────────────────────────
    const { cms, confidence } = detectCMS(html, responseHeaders, url);
    const { upgradeStrategy, pluginSuggestions, embedNote } = resolveUpgradeStrategy(cms);

    return NextResponse.json({
      title,
      metaDescription,
      dominantColor,
      cms,
      confidence,
      upgradeStrategy,
      pluginSuggestions,
      embedNote,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

