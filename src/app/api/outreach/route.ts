import { NextRequest, NextResponse } from 'next/server';
import { getLeads, addLog, updateLeadStatus, isPhoneOnDnc } from '@/lib/googleSheets';
import { getRuntimeConfig, RuntimeConfig } from '@/lib/localConfig';

// ============================================================================
// Outreach Service Layer
// ============================================================================

class OutreachService {
  /**
   * Orchestrates the campaign launch for a list of leads, managing DNC compliance,
   * daily message caps, and Meta API routing.
   */
  async launchCampaign(leadIds: string[], dryRunOverride?: boolean) {
    const config = getRuntimeConfig();
    const isDryRun = dryRunOverride !== undefined ? dryRunOverride : config.dryRun;
    
    await addLog('WhatsApp Outreach', 'START', `Starting outreach campaign for ${leadIds.length} target leads. (Dry Run Mode: ${isDryRun})`);
    
    // 1. Load active leads in sheet/local database
    const leads = await getLeads();
    const leadMap = new Map(leads.map(l => [l.lead_id, l]));
    
    // 2. Perform daily cap calculations
    const todayStr = new Date().toISOString().substring(0, 10);
    const contactedToday = leads.filter(l => l.last_contacted_at && l.last_contacted_at.startsWith(todayStr)).length;
    
    if (contactedToday >= config.whatsappDailyCap) {
      const capWarn = `WhatsApp campaign aborted: Daily limit of ${config.whatsappDailyCap} reached. (${contactedToday} contacted today)`;
      await addLog('WhatsApp Outreach', 'WARN', capWarn);
      throw new Error(capWarn);
    }
    
    let sentCount = 0;
    const results = [];
    
    for (const leadId of leadIds) {
      const lead = leadMap.get(leadId);
      if (!lead) continue;
      
      // Verify cap dynamically on each loop cycle
      if (contactedToday + sentCount >= config.whatsappDailyCap) {
        const limitReached = `Campaign pipeline paused mid-run: Hit daily cap threshold of ${config.whatsappDailyCap} leads.`;
        await addLog('WhatsApp Outreach', 'WARN', limitReached);
        results.push({ leadId, status: 'ERROR', details: 'Skipped: Daily message cap hit' });
        continue;
      }
      
      const phone = lead.phone_e164;
      if (!phone || phone === '+' || phone.length < 10) {
        await updateLeadStatus(leadId, 'ERROR', 'Skipped: Invalid E164 phone number pattern');
        results.push({ leadId, status: 'ERROR', details: 'Invalid phone structure' });
        continue;
      }
      
      // Watertight Compliance check: verify DNC list
      const onDnc = await isPhoneOnDnc(phone);
      if (onDnc) {
        await updateLeadStatus(leadId, 'DO_NOT_CONTACT', 'Skipped: On Do-Not-Contact compliance opt-out list');
        results.push({ leadId, status: 'DO_NOT_CONTACT', details: 'DNC Compliance Opt-out' });
        continue;
      }
      
      if (isDryRun) {
        const timestamp = new Date().toISOString();
        await updateLeadStatus(leadId, 'CONTACTED', '[DRY RUN] Simulated message sent successfully', timestamp);
        results.push({ leadId, status: 'CONTACTED', details: '[DRY RUN] Simulated successfully' });
        sentCount++;
      } else {
        try {
          const msgId = await this.sendWhatsAppMessage(lead, config);
          const timestamp = new Date().toISOString();
          await updateLeadStatus(leadId, 'CONTACTED', `Sent WhatsApp msg ID: ${msgId}`, timestamp);
          results.push({ leadId, status: 'CONTACTED', details: `Sent msg: ${msgId}` });
          sentCount++;
          
          // Polite Meta API dispatch delay
          await new Promise(resolve => setTimeout(resolve, 800));
        } catch (err: any) {
          await updateLeadStatus(leadId, 'ERROR', `Meta Graph API Failure: ${err.message}`);
          results.push({ leadId, status: 'ERROR', details: err.message });
        }
      }
    }
    
    await addLog('WhatsApp Outreach', 'SUCCESS', `Finished outreach run. Contacted: ${sentCount}, Total targeted: ${leadIds.length}`);
    return results;
  }

  private async sendWhatsAppMessage(lead: any, config: RuntimeConfig): Promise<string> {
    const url = `https://graph.facebook.com/v19.0/${config.whatsappPhoneNumberId}/messages`;
    const token = config.whatsappAccessToken;
    
    if (!token) throw new Error("Missing WhatsApp Access Token. Set it in Settings.");
    if (!config.whatsappPhoneNumberId) throw new Error("Missing WhatsApp Phone Number ID.");
    
    const payload = {
      messaging_product: "whatsapp",
      to: lead.phone_e164,
      type: "template",
      template: {
        name: config.whatsappTemplateName,
        language: { code: config.whatsappTemplateLanguageCode },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: lead.name || "Business Owner" },
              { type: "text", text: lead.category || "Business" },
              { type: "text", text: lead.area || "Lagos" },
              { type: "text", text: lead.business_summary || "" },
              { type: "text", text: config.businessSignature }
            ]
          }
        ]
      }
    };
    
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const content = await resp.json();
    if (resp.status === 200 && content.messages && content.messages[0]) {
      return content.messages[0].id;
    } else {
      throw new Error(content.error?.message || JSON.stringify(content));
    }
  }
}

export const outreachService = new OutreachService();

// ============================================================================
// Next.js Route Orchestration Layer
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadIds, dryRunOverride } = body;
    
    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: "Missing or empty leadIds parameter." }, { status: 400 });
    }
    
    const results = await outreachService.launchCampaign(leadIds, dryRunOverride);
    return NextResponse.json({ success: true, results });
    
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
