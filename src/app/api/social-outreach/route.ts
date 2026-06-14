import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';

// Helper to format message templates
function formatMessage(template: string, lead: any, previewUrl: string, signature: string, platform: string): string {
  let msg = template;
  if (!msg) {
    if (platform === 'INSTAGRAM') {
      msg = "Hi {{lead.name}},\n\nI found your amazing e-commerce profile on Instagram! Since you don't have a standalone website for checkout, I built a personalized landing page preview for you: {{previewUrl}}\n\nLet me know if you would like to launch this!\n\nBest regards,\n{{signature}}";
    } else if (platform === 'FACEBOOK') {
      msg = "Hello {{lead.name}},\n\nI saw your store page on Facebook. I put together a custom checkout website preview to help you capture more sales: {{previewUrl}}\n\nCheck it out and let me know your thoughts!\n\nBest,\n{{signature}}";
    } else if (platform === 'TIKTOK') {
      msg = "Hey {{lead.name}},\n\nI saw your product videos on TikTok. I created a custom web store preview for your business link-in-bio: {{previewUrl}}\n\nClick the link above to check it out!\n\nCheers,\n{{signature}}";
    } else {
      msg = "Hello {{lead.name}} Team,\n\nI came across your business profile on LinkedIn. Since many premium brands benefit from dedicated web ordering, I created a custom website checkout preview for your brand: {{previewUrl}}\n\nI'd love to get your thoughts on this preview. Would you be open to a quick chat?\n\nWarm regards,\n{{signature}}";
    }
  }
  
  msg = msg.replace(/\{\{lead\.name\}\}/g, lead.name || 'Business Owner');
  msg = msg.replace(/\{\{lead\.rating\}\}/g, String(lead.rating || '4.5'));
  msg = msg.replace(/\{\{lead\.reviews_count\}\}/g, String(lead.reviews_count || '0'));
  msg = msg.replace(/\{\{previewUrl\}\}/g, previewUrl);
  msg = msg.replace(/\{\{signature\}\}/g, signature);
  return msg;
}

// Helper to construct profile-based chat redirects
function getDirectChatLink(platform: string, profileUrl: string): string {
  if (!profileUrl) return '';
  try {
    if (platform === 'INSTAGRAM') {
      // Instagram direct inbox link or profile
      return profileUrl.endsWith('/') ? `${profileUrl}direct/` : `${profileUrl}/direct/`;
    } else if (platform === 'FACEBOOK') {
      // Extract page slug or ID for messenger link
      const parts = profileUrl.split('facebook.com/');
      if (parts.length > 1) {
        const slug = parts[1].split('/')[0]?.split('?')[0];
        if (slug) return `https://m.me/${slug}`;
      }
      return 'https://www.facebook.com/messages/';
    } else if (platform === 'TIKTOK') {
      // TikTok messaging center link
      return 'https://www.tiktok.com/messages';
    } else if (platform === 'LINKEDIN') {
      // LinkedIn messages link
      return 'https://www.linkedin.com/messaging/';
    }
  } catch (err) {
    console.error("Error formatting chat link:", err);
  }
  return profileUrl;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadIds, dryRun = false, customMessage } = body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: "Missing or invalid leadIds array." }, { status: 400 });
    }

    const config = getRuntimeConfig();
    const repo = getActiveLeadRepository();
    const leads = await repo.getLeads();
    
    // Filter target leads
    const targetLeads = leads.filter(l => leadIds.includes(l.lead_id));
    if (targetLeads.length === 0) {
      return NextResponse.json({ error: "No matching leads found in the database." }, { status: 404 });
    }

    const origin = req.nextUrl.origin;
    const signature = config.businessSignature || 'Bethelmind Analytics';
    const isSimulation = config.dryRun || dryRun;

    const results: any[] = [];

    if (isSimulation) {
      await addLog('Social Outreach', 'START', `Starting simulated social outreach campaign for ${targetLeads.length} leads.`);

      for (const lead of targetLeads) {
        if (!['INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'LINKEDIN'].includes(lead.source)) {
          results.push({
            leadId: lead.lead_id,
            name: lead.name,
            status: 'SKIPPED',
            error: "Lead source is not Instagram, Facebook, TikTok, or LinkedIn."
          });
          continue;
        }

        const previewUrl = `${origin}/preview/${lead.lead_id}`;
        
        // Pick platform template or custom message
        let template = customMessage || '';
        if (!template) {
          if (lead.source === 'INSTAGRAM') template = config.instagramMessageTemplate || '';
          else if (lead.source === 'FACEBOOK') template = config.facebookMessageTemplate || '';
          else if (lead.source === 'TIKTOK') template = config.tiktokMessageTemplate || '';
          else if (lead.source === 'LINKEDIN') template = config.linkedinMessageTemplate || '';
        }

        const finalMessage = formatMessage(template, lead, previewUrl, signature, lead.source);
        const directChatUrl = getDirectChatLink(lead.source, lead.profile_url || '');

        // Update lead state to contacted
        await repo.updateLeadStatus(
          lead.lead_id, 
          'CONTACTED', 
          (lead.notes || '') + `\n[${new Date().toISOString()}] Outreach sent via simulated ${lead.source} campaign. Link: ${previewUrl}`,
          new Date().toISOString()
        );

        results.push({
          leadId: lead.lead_id,
          name: lead.name,
          status: 'SUCCESS',
          messageSent: finalMessage,
          directChatUrl
        });

        await addLog('Social Outreach', 'SUCCESS', `[Simulation] Sent ${lead.source} outreach to ${lead.name} (${lead.profile_url})`);
      }

      return NextResponse.json({
        success: true,
        mode: 'simulation',
        results
      });
    }

    // Live Outreach Semi-Automated Redirect Mode
    await addLog('Social Outreach', 'START', `Triggering live social outreach redirects for ${targetLeads.length} leads.`);
    
    for (const lead of targetLeads) {
      if (!['INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'LINKEDIN'].includes(lead.source)) {
        results.push({
          leadId: lead.lead_id,
          name: lead.name,
          status: 'SKIPPED',
          error: "Lead source is not Instagram, Facebook, TikTok, or LinkedIn."
        });
        continue;
      }

      const previewUrl = `${origin}/preview/${lead.lead_id}`;
      
      let template = customMessage || '';
      if (!template) {
        if (lead.source === 'INSTAGRAM') template = config.instagramMessageTemplate || '';
        else if (lead.source === 'FACEBOOK') template = config.facebookMessageTemplate || '';
        else if (lead.source === 'TIKTOK') template = config.tiktokMessageTemplate || '';
        else if (lead.source === 'LINKEDIN') template = config.linkedinMessageTemplate || '';
      }

      const finalMessage = formatMessage(template, lead, previewUrl, signature, lead.source);
      const directChatUrl = getDirectChatLink(lead.source, lead.profile_url || '');

      // In live mode, we flag status as contacted and provide the copying/messaging payloads
      await repo.updateLeadStatus(
        lead.lead_id, 
        'CONTACTED', 
        (lead.notes || '') + `\n[${new Date().toISOString()}] Redirected to live social chat: ${directChatUrl}. Message preview: ${previewUrl}`,
        new Date().toISOString()
      );

      results.push({
        leadId: lead.lead_id,
        name: lead.name,
        status: 'SUCCESS',
        messageSent: finalMessage,
        directChatUrl
      });
      
      await addLog('Social Outreach', 'SUCCESS', `Prepared redirect for ${lead.source} vendor: ${lead.name} (${directChatUrl})`);
    }

    return NextResponse.json({
      success: true,
      mode: 'live',
      results
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
