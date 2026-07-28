import { NextResponse } from 'next/server';
import { harvestLiveSolarLeads, harvestLiveLagosLeads } from '@/lib/liveLeadHarvester';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60s timeout for Vercel / serverless

export async function POST() {
  try {
    const startTime = Date.now();
    console.log('[TurboCharge] ⚡ Turbo Charge triggered via UI! Running max concurrency harvest...');

    // Run both Solar & Lagos Harvester in parallel
    const [solarRes, lagosRes] = await Promise.allSettled([
      harvestLiveSolarLeads(),
      harvestLiveLagosLeads()
    ]);

    const solar = solarRes.status === 'fulfilled' ? solarRes.value : { added: 0, totalSolar: 0 };
    const lagos = lagosRes.status === 'fulfilled' ? lagosRes.value : { added: 0, totalLagos: 0 };

    const totalAdded = solar.added + lagos.added;
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    return NextResponse.json({
      success: true,
      message: `⚡ Turbo Charge Cycle Completed in ${duration}s! Added +${totalAdded} new leads (+${solar.added} Solar, +${lagos.added} Lagos B2B).`,
      added: totalAdded,
      solarAdded: solar.added,
      lagosAdded: lagos.added,
      durationSeconds: duration
    });
  } catch (error: any) {
    console.error('[TurboCharge] Error:', error.message);
    return NextResponse.json({
      success: false,
      error: error.message || 'Turbo Charge execution failed'
    }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
