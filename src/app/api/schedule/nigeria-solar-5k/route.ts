import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getRuntimeConfig } from '@/lib/localConfig';

export async function GET() {
  try {
    const config = getRuntimeConfig();
    
    let recentJobs: any[] = [];
    if (supabase) {
      const { data } = await supabase
        .from('scrape_jobs')
        .select('*')
        .eq('type', 'solar_nigeria_5k')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) recentJobs = data;
    }

    return NextResponse.json({
      success: true,
      pipeline: 'solar_nigeria_5k',
      targetDailyQuota: config.nigeriaSolarDailyTarget || 5000,
      leadSourceTag: 'solar_nigeria_5k',
      regionsCovered: 'All 36 States of Nigeria + FCT Abuja',
      activeRunnerBackend: config.activeRunnerBackend || 'github_actions',
      recentJobs
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, mode, count } = body;

    const targetCount = count || 5000;
    const targetMode = mode || 'live-solar';
    const jobId = `solar_5k_${Date.now()}`;

    if (action === 'trigger-5k' || action === 'queue') {
      if (supabase) {
        const { data, error } = await supabase
          .from('scrape_jobs')
          .insert([
            {
              id: jobId,
              type: 'solar_nigeria_5k',
              status: 'queued',
              payload: {
                mode: targetMode,
                count: targetCount,
                region: 'Nigeria-Nationwide'
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to queue 5K Solar job: ${error.message}`);
        }

        // Trigger GitHub Actions workflow dispatch if GitHub active
        const config = getRuntimeConfig();
        if (config.activeRunnerBackend === 'github_actions' && config.githubToken && config.githubRepo) {
          try {
            const dispatchUrl = `https://api.github.com/repos/${config.githubRepo}/dispatches`;
            await fetch(dispatchUrl, {
              method: 'POST',
              headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${config.githubToken}`,
                'X-GitHub-Api-Version': '2022-11-28',
                'User-Agent': 'ApexReach-App-Solar5k'
              },
              body: JSON.stringify({ event_type: 'run-queue' })
            });
          } catch (ghErr: any) {
            console.warn('GitHub dispatch trigger note:', ghErr.message);
          }
        }

        return NextResponse.json({
          success: true,
          message: `Queued 5K Nigeria Solar Pipeline job (${jobId})`,
          job: data
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Supabase client unavailable'
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Supported actions: trigger-5k, queue'
    }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
