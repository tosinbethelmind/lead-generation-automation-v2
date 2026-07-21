import { NextRequest, NextResponse } from 'next/server';
import { createScrapeJob } from '@/lib/supabaseClient';
import { triggerCloudRunnerIfNeeded } from '@/lib/cloudRunnerTrigger';

export {
  createScrapeJob,
  getScrapeJob,
  updateScrapeJobStatus,
  deleteScrapeJob
} from '@/lib/supabaseClient';
export type {
  ScrapeJobType,
  ScrapeJobStatus,
  ScrapeJob
} from '@/lib/supabaseClient';

/**
 * Intercepts scraper route calls when running in local scraper mode.
 * Creates a queued job in the database and returns a queued status response immediately.
 */
export async function handleQueueDelegation(
  req: NextRequest,
  scraperType: string,
  payload: any
): Promise<NextResponse | null> {
  const executionMode = process.env.SCRAPER_EXECUTION_MODE || 'cloud';

  // Support bypassing queue if request explicitly specifies (e.g. from local runner calling locally)
  const bypassHeader = req.headers.get('x-bypass-queue') === 'true';
  const bypassBody = payload?.bypassQueue === true;
  const isBypassed = bypassHeader || bypassBody;

  if (executionMode === 'local' && !isBypassed) {
    try {
      const job = await createScrapeJob(scraperType as any, payload);
      
      // Async trigger cloud runner in the background if needed
      triggerCloudRunnerIfNeeded().catch((err) => {
        console.error('[QueueTrigger] Failed to auto-trigger cloud runner:', err.message);
      });

      return NextResponse.json({
        success: true,
        mode: 'local',
        status: 'queued',
        jobId: job.id
      });
    } catch (err: any) {
      return NextResponse.json({
        success: false,
        error: `Failed to queue scraping job: ${err.message}`
      }, { status: 500 });
    }
  }

  return null;
}


