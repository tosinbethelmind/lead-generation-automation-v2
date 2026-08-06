import { NextResponse } from 'next/server';
import { executeHybridScrape } from '@/lib/scraping/crawlee_engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, timeoutMs } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Missing valid url parameter in request body.' },
        { status: 400 }
      );
    }

    console.log(`[API /api/scrape] Processing hybrid scrape request for: ${url}`);
    const result = await executeHybridScrape({
      url,
      timeoutMs: timeoutMs || 15000
    });

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Hybrid scraper completed but yielded no extraction results.',
          url
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    console.error('[API /api/scrape] Internal error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error during scraping.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({
      service: 'ApexReach Hybrid Scraper API',
      status: 'online',
      usage: 'POST /api/scrape with JSON body { "url": "https://example.com" } or GET /api/scrape?url=https://example.com'
    });
  }

  const result = await executeHybridScrape({ url: targetUrl });
  if (!result) {
    return NextResponse.json({ success: false, message: 'No data extracted.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: result });
}
