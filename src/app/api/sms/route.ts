import { NextRequest, NextResponse } from 'next/server';
import { getLeads, addLog, updateLeadStatus } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { sendSmsMessage, replaceSmsPlaceholders, cleanPhoneNumber } from '@/lib/sms';

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
    const provider = config.smsProvider || 'gateway';

    await addLog('SMS Outreach', 'START', `Launching SMS outreach (${provider}) for ${leadIds.length} leads (Dry Run: ${isDryRun}).`);

    const leads = await getLeads();
    const leadMap = new Map(leads.map(l => [l.lead_id, l]));

    const results: any[] = [];
    let sentCount = 0;

    for (let i = 0; i < leadIds.length; i++) {
      const leadId = leadIds[i];
      const lead = leadMap.get(leadId);
      if (!lead) continue;

      const rawPhone = lead.phone_e164 || lead.phone_raw;
      if (!rawPhone) {
        await updateLeadStatus(leadId, 'ERROR', 'Skipped: Missing phone number');
        results.push({ leadId, status: 'ERROR', details: 'Missing phone number' });
        continue;
      }

      const phone = cleanPhoneNumber(rawPhone);
      const previewUrl = `${origin}/preview/${leadId}`;

      // Rate limit throttling for real carrier gateways/APIs: wait 1 second between dispatches
      if (i > 0 && !isDryRun) {
        await sleep(1000);
      }

      if (isDryRun) {
        const defaultTemplate = 'Hello {{lead.name}}, please check {{previewUrl}} for details. {{signature}}';
        const template = customMessage || config.smsMessageTemplate || defaultTemplate;
        const msg = replaceSmsPlaceholders(template, lead, previewUrl);

        await updateLeadStatus(leadId, 'CONTACTED', `[DRY RUN] Simulated SMS (${provider}) sent to ${phone}. Message: ${msg}`);
        results.push({ leadId, status: 'CONTACTED', details: `[DRY RUN] Simulated to: ${phone}` });
        sentCount++;
      } else {
        try {
          const sendDetails = await sendSmsMessage(lead, previewUrl, customMessage);
          await updateLeadStatus(leadId, 'CONTACTED', `SMS sent via ${provider} to ${phone}`);
          results.push({ leadId, status: 'CONTACTED', details: sendDetails });
          sentCount++;
        } catch (err: any) {
          console.error(`SMS outreach failure for ${phone}:`, err);
          await updateLeadStatus(leadId, 'ERROR', `SMS API Failure (${provider}): ${err.message}`);
          results.push({ leadId, status: 'ERROR', details: err.message });
        }
      }
    }

    await addLog('SMS Outreach', 'SUCCESS', `Finished SMS outreach. Sent: ${sentCount}`);
    return NextResponse.json({ success: true, results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
