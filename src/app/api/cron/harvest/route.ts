import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { harvestLiveLagosLeads, harvestLiveSolarLeads } from '@/lib/liveLeadHarvester';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

const supabase = getSupabaseClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  
  // Optional simple auth key protection if secret provided
  const cronSecret = process.env.CRON_SECRET || 'apexreach_cron_secret_2026';
  if (key && key !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized cron invocation' }, { status: 401 });
  }

  const startTime = Date.now();
  console.log('[CloudCron] Triggering 24/7 multi-pipeline harvest pass...');

  // Trigger parallel harvest cycles
  const [lagosRes, solarRes] = await Promise.allSettled([
    harvestLiveLagosLeads(),
    harvestLiveSolarLeads()
  ]);

  const lagosData = lagosRes.status === 'fulfilled' ? lagosRes.value : { added: 0, totalLagos: 0 };
  const solarData = solarRes.status === 'fulfilled' ? solarRes.value : { added: 0, totalSolar: 0 };

  const durationMs = Date.now() - startTime;

  // Log heartbeat to Supabase
  try {
    await (supabase as any).from('logs').insert([{
      run_id: `cron_${Date.now()}`,
      step: 'CLOUD_CRON_PING',
      status: 'SUCCESS',
      message: `⚡ [24/7 CLOUD CRON] Executed non-stop harvest pass in ${durationMs}ms — Lagos: +${lagosData.added} (Total: ${lagosData.totalLagos}), Solar: +${solarData.added} (Total: ${solarData.totalSolar})`,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    }]);
  } catch (_) {}

  return NextResponse.json({
    success: true,
    message: '24/7 Cloud Cron Harvest Pass Executed Successfully',
    durationMs,
    timestamp: new Date().toISOString(),
    results: {
      lagos: lagosData,
      solar: solarData
    }
  });
}
