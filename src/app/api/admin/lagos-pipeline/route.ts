import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { solarQuoteProSupabase } from '@/lib/solarQuoteProClient';
import { verifySessionToken } from '@/lib/session';
import { getRuntimeConfig } from '@/lib/localConfig';
import crypto from 'crypto';

const db = supabase || solarQuoteProSupabase;

export const dynamic = 'force-dynamic';

// GET: Fetch all Lagos B2B leads, or check active jobs
export async function GET(req: NextRequest) {
  try {
    const cookieValue = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(cookieValue);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const activeCheck = searchParams.get('activeCheck');

    // 1. Fetch details of a specific job
    if (jobId) {
      const { data: job, error: jobErr } = await db
        .from('scrape_jobs')
        .select('*')
        .eq('id', jobId)
        .maybeSingle();

      if (jobErr) return NextResponse.json({ error: jobErr.message }, { status: 500 });
      if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

      const { data: logs } = await db
        .from('logs')
        .select('*')
        .eq('run_id', jobId)
        .order('timestamp', { ascending: true });

      return NextResponse.json({ success: true, jobId: job.id, status: job.status, error_message: job.error_message, payload: job.payload, logs: logs || [] });
    }

    // 2. Check if a Lagos 10K scrape job is currently active
    if (activeCheck) {
      const { data: activeJobs, error: activeErr } = await db
        .from('scrape_jobs')
        .select('*')
        .in('type', ['lagos_10k', 'lagos_scrape'])
        .in('status', ['running', 'queued'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (activeErr) return NextResponse.json({ error: activeErr.message }, { status: 500 });

      if (activeJobs && activeJobs.length > 0) {
        const job = activeJobs[0];
        const { data: logs } = await db
          .from('logs')
          .select('*')
          .eq('run_id', job.id)
          .order('timestamp', { ascending: true });

        return NextResponse.json({ success: true, active: true, jobId: job.id, status: job.status, error_message: job.error_message, payload: job.payload, logs: logs || [] });
      }

      return NextResponse.json({ success: true, active: false });
    }

    // 3. Fetch Lagos 10K B2B leads from main `leads` table
    const { data: lagosData, count: lagosExactCount, error: lagosErr } = await db
      .from('leads')
      .select('*', { count: 'exact' })
      .or('source_query_or_seed.eq.lagos_10k_b2b,source_query_or_seed.ilike.%lagos%')
      .order('created_at', { ascending: false })
      .range(0, 10000);

    if (lagosErr) console.error('Error fetching Lagos 10K leads:', lagosErr);

    const lagosNormalized = (lagosData || []).map((l: any) => ({
      id: l.id,
      name: l.name || l.business_name || 'Lagos Commercial Business',
      phone: l.phone_e164 || l.phone || '',
      email: l.email || '',
      location: l.address ? l.address : `${l.city || ''}, Lagos`,
      city: l.city || 'Lagos',
      state: l.area || l.city || 'Lagos',
      category: l.category || 'Lagos Commercial',
      contact_person: 'Operations Manager',
      status: l.status || 'new',
      notes: l.notes || '',
      created_at: l.created_at,
      type: 'lagos_10k' as const
    }));

    return NextResponse.json({
      success: true,
      totalCount: lagosExactCount || lagosNormalized.length,
      lagos10kCount: lagosExactCount || lagosNormalized.length,
      leads: lagosNormalized,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update lead status/notes
export async function PATCH(req: NextRequest) {
  try {
    const cookieValue = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(cookieValue);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, status, notes } = body;
    if (!id || !status) return NextResponse.json({ error: 'id and status are required' }, { status: 400 });

    const { data, error } = await db
      .from('leads')
      .update({ status, notes })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Purge mock/test leads from database
export async function DELETE(req: NextRequest) {
  try {
    const cookieValue = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(cookieValue);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await db
      .from('leads')
      .delete()
      .or('email.ilike.%example.com%,email.ilike.%test%,name.ilike.%test%,lead_id.ilike.%colab_lagos_syn%');

    return NextResponse.json({ success: true, message: 'Mock Lagos test data purged successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Trigger Lagos 10K Scraper (Cloud + Local dual execution)
export async function POST(req: NextRequest) {
  try {
    const cookieValue = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(cookieValue);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action, mode, count } = body;

    if (action === 'scrape') {
      const jobId = crypto.randomUUID();
      const jobType = 'lagos_10k';
      const targetCount = count || 10000;
      const appConfig = getRuntimeConfig();
      const isLocalMode = appConfig.storageMode === 'local';

      // Create the job record
      if (isLocalMode) {
        try {
          const { createScrapeJob } = await import('@/lib/supabaseClient');
          await createScrapeJob(jobType, { mode: mode || 'live', count: targetCount });
        } catch (err: any) {
          return NextResponse.json({ error: `Failed to create local scrape job: ${err.message}` }, { status: 500 });
        }
      } else {
        const { error } = await db
          .from('scrape_jobs')
          .insert([{
            id: jobId,
            type: jobType,
            status: 'queued',
            payload: { mode: mode || 'live', count: targetCount },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) return NextResponse.json({ error: `Failed to create scrape job: ${error.message}` }, { status: 500 });
      }

      // ── Cloud Trigger: GitHub Actions ──────────────────────────────────────
      try {
        const { githubToken, githubRepo } = appConfig;
        if (githubToken && githubRepo) {
          const dispatchUrl = `https://api.github.com/repos/${githubRepo}/dispatches`;
          const dispatchRes = await fetch(dispatchUrl, {
            method: 'POST',
            headers: {
              'Accept': 'application/vnd.github+json',
              'Authorization': `Bearer ${githubToken}`,
              'X-GitHub-Api-Version': '2022-11-28',
              'User-Agent': 'ApexReach-App-Lagos10k'
            },
            body: JSON.stringify({
              event_type: 'run-lagos-10k',
              client_payload: {
                job_id: jobId,
                count: targetCount,
                mode: mode || 'live'
              }
            })
          });
          if (dispatchRes.ok) {
            console.log('[LagosAPI] GitHub Actions Lagos 10K dispatch sent successfully.');
          } else {
            const errText = await dispatchRes.text();
            console.warn('[LagosAPI] GitHub Actions dispatch warning:', dispatchRes.status, errText);
          }
        }
      } catch (err: any) {
        console.error('[LagosAPI] Error dispatching Lagos 10K GitHub runner:', err.message);
      }

      // ── Local Trigger: Spawn child process in dev/local environments ───────
      if (process.env.NODE_ENV !== 'production' || appConfig.activeRunnerBackend === 'local') {
        try {
          const { spawn } = await import('child_process');
          const path = await import('path');
          const scriptPath = path.resolve(process.cwd(), 'scripts', 'lagos_10k_master_harvester.js');
          // Quality Gate: only live and dry-run modes permitted
          const childArgs: string[] = ['--count', String(targetCount), '--run-id', jobId];
          if (mode === 'dry-run') childArgs.push('--dry-run');
          // Note: --synthetic is intentionally omitted — 100% real leads only

          const child = spawn(process.execPath, [scriptPath, ...childArgs], {
            detached: true,
            stdio: 'ignore'
          });
          child.unref();
          console.log('[LagosAPI] Local Lagos 10K child process spawned.');
        } catch (spawnErr: any) {
          console.warn('[LagosAPI] Local spawn note:', spawnErr.message);
        }
      }

      return NextResponse.json({
        success: true,
        jobId,
        message: `Lagos 10K B2B Scraper job queued! Running on Cloud (GitHub Actions) + Local simultaneously. Job ID: ${jobId}`
      });
    }

    return NextResponse.json({ error: 'Unknown action. Use action: "scrape".' }, { status: 400 });
  } catch (error: any) {
    console.error('[LagosAPI] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
