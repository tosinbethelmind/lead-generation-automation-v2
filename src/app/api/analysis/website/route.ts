import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/analysis/website
 * Body: { url: string }
 * Returns JSON with extracted title, metaDescription, and dominantColor (hex) if found.
 */
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'Missing url in request body' }, { status: 400 });
    }
    // Simple fetch, no rendering, just get raw HTML
    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${resp.status}` }, { status: 502 });
    }
    const html = await resp.text();
    // Extract <title>
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    // Extract meta description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']\s*\/?>/i);
    const metaDescription = descMatch ? descMatch[1].trim() : '';
    // Extract theme-color meta (dominant color) or fallback to first hex color found in style
    let dominantColor = '';
    const themeMatch = html.match(/<meta\s+name=["']theme-color["']\s+content=["'](#?[0-9a-fA-F]{3,6})["']\s*\/?>/i);
    if (themeMatch) {
      dominantColor = themeMatch[1].startsWith('#') ? themeMatch[1] : `#${themeMatch[1]}`;
    } else {
      const hexMatch = html.match(/#([0-9a-fA-F]{3,6})/);
      if (hexMatch) {
        dominantColor = `#${hexMatch[1]}`;
      }
    }
    return NextResponse.json({ title, metaDescription, dominantColor });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
