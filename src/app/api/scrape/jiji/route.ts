import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createScrapeJob } from '@/app/api/scrape/queue';
import { runScraper } from '@/lib/scraperRunner';

/**
 * POST /api/scrape/jiji
 * Body: { url: string, options?: any, userId?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { url, options = {}, userId } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    // Create a job entry in Supabase
    const job = await createScrapeJob('jiji', { url, options }, userId);

    // Spawn the scraper script (assumes script at scripts/test_jiji.js)
    await runScraper('scripts/test_jiji.js', [url, JSON.stringify(options)], job.id);

    return NextResponse.json({ jobId: job.id, status: job.status }, { status: 202 });
  } catch (err: any) {
    console.error('Jiji scrape error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
