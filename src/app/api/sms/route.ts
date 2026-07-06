import { NextRequest, NextResponse } from 'next/server';
import { getLeads, addLog } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { OutreachManager } from '@/lib/outreachManager';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * POST /api/sms
 * Body: { leadIds: string[], dryRunOverride?: boolean, customMessage?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { leadIds, dryRunOverride, customMessage } = await req.json();
    const origin = new URL(req.url).origin;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: 'Missing or empty leadIds parameter.' }, { status: 400 });
    }

    const config = getRuntimeConfig();
    const isDryRun = dryRunOverride !== undefined ? dryRunOverride : config.dryRun;

    await addLog('SMS Outreach', 'START', `Launching SMS outreach for ${leadIds.length} leads (Dry Run: ${isDryRun}).`);

    const leads = await getLeads();
    const leadMap = new Map(leads.map(l => [l.lead_id, l]));

    const results: any[] = [];
    let sentCount = 0;

    for (let i = 0; i < leadIds.length; i++) {
      const leadId = leadIds[i];
      const lead = leadMap.get(leadId);
      if (!lead) continue;

      if (i > 0 && !isDryRun) {
        await sleep(1000); // 1s throttle delay for SMS
      }

      const cascadeResult = await OutreachManager.dispatchWithFallback(lead as any, origin, {
        isDryRun,
        customMessage,
        channelsOverride: ['sms']
      });

      if (cascadeResult.success) {
        sentCount++;
      }

      results.push({
        leadId,
        name: lead.name,
        status: cascadeResult.finalStatus,
        details: cascadeResult.logs[cascadeResult.logs.length - 1],
        logs: cascadeResult.logs,
        channelResults: cascadeResult.channelResults
      });
    }

    await addLog('SMS Outreach', 'SUCCESS', `Finished SMS outreach. Sent: ${sentCount}`);
    return NextResponse.json({ success: true, results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
