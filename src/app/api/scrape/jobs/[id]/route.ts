import { NextRequest, NextResponse } from 'next/server';
import { getScrapeJob } from '@/lib/supabaseClient';

/**
 * GET /api/scrape/jobs/:id
 * Retrieves the status and result of a scrape job.
 */
export async function GET(request: NextRequest, context: any) {
  const resolvedParams = typeof context?.params?.then === 'function'
    ? await context.params
    : context?.params;
  const jobId = resolvedParams?.id;

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID missing' }, { status: 400 });
  }

  const job = await getScrapeJob(jobId);

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    source: job.type || (job as any).source || 'unknown',
    status: job.status,
    created_at: job.created_at,
    started_at: (job as any).started_at || job.created_at,
    completed_at: (job as any).completed_at || job.updated_at,
    result: job.result ?? null,
    error_message: job.error_message ?? null,
  });
}
