import { NextRequest, NextResponse } from 'next/server';
import { getLeads, addLog, updateLeadStatus } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

/**
 * POST /api/whatsapp
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

    if (!config.whatsappEnabled) {
      return NextResponse.json({ error: 'WhatsApp outreach is disabled in configuration.' }, { status: 403 });
    }

    await addLog('WhatsApp Outreach', 'START', `Launching WhatsApp outreach for ${leadIds.length} leads (Dry Run: ${isDryRun}).`);

    const leads = await getLeads();
    const leadMap = new Map(leads.map(l => [l.lead_id, l]));

    const results: any[] = [];
    let sentCount = 0;

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
        const defaultTemplate = `Hi {{lead.name}},\n\nWe generated a custom landing page for your business. Check it out: {{previewUrl}}\n\nBest, {{businessSignature}}`;
        const template = customMessage || config.whatsappMessageTemplate || defaultTemplate;
        const msg = template
          .replace(/{{\s*lead\.name\s*}}/g, lead.name)
          .replace(/{{\s*previewUrl\s*}}/g, previewUrl)
          .replace(/{{\s*businessSignature\s*}}/g, config.businessSignature || '')
          .replace(/{{\s*signature\s*}}/g, config.businessSignature || '');

        await updateLeadStatus(leadId, 'CONTACTED', `[DRY RUN] Simulated WhatsApp sent to ${phone}. Message: ${msg}`);
        results.push({ leadId, status: 'CONTACTED', details: `[DRY RUN] Simulated to: ${phone}` });
        sentCount++;
      } else {
        try {
          await sendWhatsAppMessage(lead, previewUrl, origin, customMessage);
          results.push({ leadId, status: 'CONTACTED', details: `WhatsApp sent to ${phone}` });
          sentCount++;
        } catch (err: any) {
          console.error(`WhatsApp outreach failure for ${phone}:`, err);
          await updateLeadStatus(leadId, 'ERROR', `WhatsApp API Failure: ${err.message}`);
          results.push({ leadId, status: 'ERROR', details: err.message });
        }
      }
    }

    await addLog('WhatsApp Outreach', 'SUCCESS', `Finished WhatsApp outreach. Sent: ${sentCount}`);
    return NextResponse.json({ success: true, results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
