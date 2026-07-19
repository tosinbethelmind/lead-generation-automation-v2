import { NextRequest, NextResponse } from 'next/server';
import { getLeads, addLog } from '@/lib/googleSheets';
import { getRuntimeConfig, getOutreachOrigin } from '@/lib/localConfig';
import { OutreachManager } from '@/lib/outreachManager';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * POST /api/outreach
 * Body: { leadIds: string[], dryRunOverride?: boolean, customMessage?: string, customSubject?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadIds, dryRunOverride, customMessage, customSubject } = body;
    const origin = getOutreachOrigin(req.url);
    
    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: "Missing or empty leadIds parameter." }, { status: 400 });
    }
    
    const config = getRuntimeConfig();
    const isDryRun = dryRunOverride !== undefined ? dryRunOverride : config.dryRun;
    const provider = config.emailProvider || 'gmail';

    await addLog('Email Outreach', 'START', `Starting email outreach campaign for ${leadIds.length} leads via ${provider.toUpperCase()} (Dry Run: ${isDryRun}).`);

    const leads = await getLeads();
    const leadMap = new Map(leads.map(l => [l.lead_id, l]));

    const results: any[] = [];
    let sentCount = 0;

    for (let i = 0; i < leadIds.length; i++) {
      const leadId = leadIds[i];
      const lead = leadMap.get(leadId);
      if (!lead) continue;

      if (sentCount > 0 && !isDryRun) {
        await sleep(800); // 800ms rate limit delay for email
      }

      const cascadeResult = await OutreachManager.dispatchWithFallback(lead as any, origin, {
        isDryRun,
        customMessage,
        customSubject,
        channelsOverride: ['email']
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

    await addLog('Email Outreach', 'SUCCESS', `Finished ${provider.toUpperCase()} outreach campaign. Total successfully sent: ${sentCount}`);
    return NextResponse.json({ success: true, results });
    
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
