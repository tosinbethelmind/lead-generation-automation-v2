import { NextRequest, NextResponse } from 'next/server';
import { getLeads, addLog } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { OutreachManager } from '@/lib/outreachManager';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * POST /api/outreach/multichannel
 * Body: { leadIds: string[], dryRunOverride?: boolean }
 *
 * Sequentially dispatches outreach campaigns for each qualified lead using
 * the unified OutreachManager retry & cascade fallback routing logic.
 */
export async function POST(req: NextRequest) {
  try {
    const { leadIds, dryRunOverride } = await req.json();
    const origin = new URL(req.url).origin;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: 'Missing or empty leadIds parameter.' }, { status: 400 });
    }

    const config = getRuntimeConfig();
    const isDryRun = dryRunOverride !== undefined ? dryRunOverride : config.dryRun;

    await addLog(
      'Multichannel Outreach',
      'START',
      `Launching multichannel cascade campaign for ${leadIds.length} leads. (Dry Run: ${isDryRun})`
    );

    const leads = await getLeads();
    const leadMap = new Map(leads.map(l => [l.lead_id, l]));

    const results: any[] = [];
    let sentEmailCount = 0;
    let sentWhatsAppCount = 0;
    let sentSmsCount = 0;
    let sentJijiCount = 0;

    for (let i = 0; i < leadIds.length; i++) {
      const leadId = leadIds[i];
      const lead = leadMap.get(leadId);
      if (!lead) continue;

      // Rate limit throttle delay between prospects (randomized 10 to 25 seconds to mimic human behavior)
      if (i > 0 && !isDryRun) {
        const delay = Math.floor(Math.random() * 15000) + 10000;
        console.log(`[Multichannel Outreach] Sleeping for ${delay / 1000}s to mimic human behavior...`);
        await sleep(delay);
      }

      // Execute outreach cascade via OutreachManager
      const cascadeResult = await OutreachManager.dispatchWithFallback(lead as any, origin, {
        isDryRun
      });

      if (cascadeResult.success) {
        // Find which channel succeeded
        const successful = cascadeResult.channelResults.find(r => r.status === 'success');
        if (successful) {
          if (successful.channel === 'email') sentEmailCount++;
          else if (successful.channel === 'whatsapp') sentWhatsAppCount++;
          else if (successful.channel === 'sms') sentSmsCount++;
          else if (successful.channel === 'jiji') sentJijiCount++;
        }
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

    await addLog(
      'Multichannel Outreach',
      'SUCCESS',
      `Multichannel campaign finished. Email: ${sentEmailCount}, WhatsApp: ${sentWhatsAppCount}, SMS: ${sentSmsCount}, Jiji Chat: ${sentJijiCount}`
    );

    return NextResponse.json({
      success: true,
      counts: { email: sentEmailCount, whatsapp: sentWhatsAppCount, sms: sentSmsCount, jiji: sentJijiCount },
      results
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
