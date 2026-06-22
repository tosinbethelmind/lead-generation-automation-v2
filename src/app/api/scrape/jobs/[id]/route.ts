import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

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

  const { data: job, error } = await supabase
    .from('scrape_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) {
    console.error('Failed to fetch job', error);
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    source: job.source,
    status: job.status,
    created_at: job.created_at,
    started_at: job.started_at ?? null,
    completed_at: job.completed_at ?? null,
    result: job.result ?? null,
  });
}
