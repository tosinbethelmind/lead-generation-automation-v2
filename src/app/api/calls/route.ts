import { NextRequest, NextResponse } from 'next/server';
import { getLeads, addLog, updateLeadStatus } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { initiateColdCall } from '@/lib/twilio';

/**
 * POST /api/calls
 * Body: { leadIds: string[], dryRunOverride?: boolean }
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

    // Ensure Twilio is configured (only if not dry run)
    if (!isDryRun && (!config.twilioAccountSid || !config.twilioAuthToken || !config.twilioFromNumber)) {
      return NextResponse.json({ error: 'Twilio outreach is not fully configured.' }, { status: 403 });
    }

    await addLog('Cold Call Outreach', 'START', `Launching cold‑call outreach for ${leadIds.length} leads (Dry Run: ${isDryRun}).`);

    const leads = await getLeads();
    const leadMap = new Map(leads.map(l => [l.lead_id, l]));

    const results: any[] = [];
    let calledCount = 0;

    for (const leadId of leadIds) {
      const lead = leadMap.get(leadId);
      if (!lead) continue;

      const phone = lead.phone_e164 || lead.phone_raw;
      if (!phone) {
        await updateLeadStatus(leadId, 'ERROR', 'Skipped: Missing phone number');
        results.push({ leadId, status: 'ERROR', details: 'Missing phone number' });
        continue;
      }

      const previewUrl = `${origin}/preview/${leadId}`;

      if (isDryRun) {
        const messageTemplate = customMessage || config.twilioCallMessageTemplate || 'Hello {{lead.name}}, this is a call from {{businessSignature}}. Please check {{previewUrl}} for more details.';
        const spokenMessage = messageTemplate
          .replace(/{{\s*lead\.name\s*}}/g, lead.name || '')
          .replace(/{{\s*previewUrl\s*}}/g, previewUrl)
          .replace(/{{\s*businessSignature\s*}}/g, config.businessSignature || '')
          .replace(/{{\s*signature\s*}}/g, config.businessSignature || '');

        await updateLeadStatus(leadId, 'CONTACTED', `[DRY RUN] Simulated cold‑call to ${phone}. Script spoken: ${spokenMessage}`);
        results.push({ leadId, status: 'CONTACTED', details: `[DRY RUN] Simulated to: ${phone}` });
        calledCount++;
      } else {
        try {
          await initiateColdCall(lead, previewUrl, origin, customMessage);
          await updateLeadStatus(leadId, 'CONTACTED', `Cold‑call placed to ${phone}`);
          results.push({ leadId, status: 'CONTACTED', details: `Cold‑call placed to ${phone}` });
          calledCount++;
        } catch (err: any) {
          console.error(`Cold‑call failure for ${phone}:`, err);
          await updateLeadStatus(leadId, 'ERROR', `Twilio API Failure: ${err.message}`);
          results.push({ leadId, status: 'ERROR', details: err.message });
        }
      }
    }

    await addLog('Cold Call Outreach', 'SUCCESS', `Finished cold‑call outreach. Calls placed: ${calledCount}`);
    return NextResponse.json({ success: true, results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
