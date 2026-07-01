import { NextRequest, NextResponse } from 'next/server';
import { getLeads, addLog, updateLeadStatus, getActiveLeadRepository } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { sendNotificationEmail } from '@/lib/email';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { sendSmsMessage } from '@/lib/sms';
import { getPitchDetails } from '@/lib/pitchHelper';
import { verifyEmailAddress } from '@/lib/leadEnricher';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * POST /api/outreach/multichannel
 * Body: { leadIds: string[], dryRunOverride?: boolean }
 *
 * Simultaneously dispatches Email, WhatsApp, and SMS outreach campaigns
 * for each qualified lead, utilizing category-specific visual pitches.
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
    const signature = config.businessSignature || 'ApexReach';

    await addLog(
      'Multichannel Outreach',
      'START',
      `Launching simultaneous multichannel blast (Email + WhatsApp + SMS) for ${leadIds.length} leads. (Dry Run: ${isDryRun})`
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

      const previewUrl = `${origin}/preview/${leadId}`;
      const pitch = getPitchDetails(lead as any, origin, signature);

      const email = lead.email;
      const phone = lead.phone_e164 || lead.phone_raw;

      const leadDispatched: string[] = [];
      const leadErrors: string[] = [];

      // Rate limit throttle delay between prospects
      if (i > 0 && !isDryRun) {
        await sleep(1500);
      }

      const isJijiLead = lead.source === 'JIJI';

      // ── Cohesive Copywriting Templates ──
      const leadName = lead.name || 'Owner';
      
      // WhatsApp message formatting
      let waMessage = '';
      if (isJijiLead) {
        waMessage = `Hello ${leadName}! I checked out your listing on Jiji and put together a custom website preview for your business: ${previewUrl}\n\n(Note: If the link is not clickable, reply 'ok' or save this contact to activate it)`;
      } else if (email && email.includes('@')) {
        waMessage = `Hello ${leadName}! I checked out your local presence on Google Maps and put together a site preview. I've sent a detailed proposal to your email (${email}), but sharing the quick link here for convenience: ${previewUrl}\n\n(Note: If the link is not clickable, reply 'ok' or save this contact to activate it)`;
      } else {
        waMessage = `Hello ${leadName}! I checked out your local presence on Google Maps and put together a custom website preview: ${previewUrl}\n\n(Note: If the link is not clickable, reply 'ok' or save this contact to activate it)`;
      }

      // SMS message formatting
      let smsMessage = '';
      if (email && email.includes('@')) {
        smsMessage = `Hi ${leadName}, I just sent a custom website mockup to your email. You can view the live link on your phone here: ${previewUrl}`;
      } else {
        smsMessage = `Hi ${leadName}, I designed a custom website preview for your business. View the live mockup on your phone here: ${previewUrl}`;
      }

      // ── 1. EMAIL OUTREACH ──
      if (isJijiLead) {
        leadErrors.push('Bypassed Email for Jiji lead');
      } else {
        const isValid = email ? verifyEmailAddress(email) : false;
        
        // Persist verification status in database
        const repo = getActiveLeadRepository();
        await repo.updateLeadFields(leadId, { email_verified: isValid });

        if (isValid) {
          try {
            if (isDryRun) {
              leadDispatched.push(`Email (Dry Run: ${email})`);
              sentEmailCount++;
            } else {
              const success = await sendNotificationEmail(email, pitch.emailSubject, pitch.emailBody);
              if (success) {
                leadDispatched.push('Email');
                sentEmailCount++;
              } else {
                leadErrors.push('Email API skipped or failed');
              }
            }
          } catch (err: any) {
            leadErrors.push(`Email: ${err.message}`);
          }
        } else {
          leadErrors.push(email ? 'Skipped Email (Unverified address)' : 'Skipped Email (Missing address)');
        }
      }

      // ── 2. WHATSAPP OUTREACH ──
      if (phone) {
        try {
          if (isDryRun) {
            leadDispatched.push(`WhatsApp (Dry Run: ${phone})`);
            sentWhatsAppCount++;
          } else {
            await sendWhatsAppMessage(lead as any, previewUrl, origin, waMessage);
            leadDispatched.push('WhatsApp');
            sentWhatsAppCount++;
          }
        } catch (err: any) {
          leadErrors.push(`WhatsApp: ${err.message}`);
        }
      } else {
        leadErrors.push('Skipped WhatsApp (Missing phone)');
      }

      // ── 3. SMS OUTREACH ──
      if (isJijiLead) {
        leadErrors.push('Bypassed SMS for Jiji lead');
      } else if (phone) {
        try {
          if (isDryRun) {
            leadDispatched.push(`SMS (Dry Run: ${phone})`);
            sentSmsCount++;
          } else {
            const resultMsg = await sendSmsMessage(lead as any, previewUrl, smsMessage);
            leadDispatched.push('SMS');
            sentSmsCount++;
          }
        } catch (err: any) {
          leadErrors.push(`SMS: ${err.message}`);
        }
      } else {
        leadErrors.push('Skipped SMS (Missing phone)');
      }

      // ── 4. JIJI CHAT OUTREACH ──
      if (isJijiLead) {
        try {
          if (isDryRun) {
            leadDispatched.push(`Jiji Chat (Dry Run: ${lead.profile_url || 'No URL'})`);
            sentJijiCount++;
          } else {
            const jijiResp = await fetch(`${origin}/api/jiji`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                leadIds: [leadId],
                dryRun: false
              })
            });
            const jijiData = await jijiResp.json();
            if (jijiResp.ok && jijiData.success) {
              const resObj = jijiData.results?.find((r: any) => r.leadId === leadId);
              if (resObj && resObj.status === 'SUCCESS') {
                leadDispatched.push('Jiji Chat');
                sentJijiCount++;
              } else {
                leadErrors.push(`Jiji Chat: ${resObj?.error || 'Unknown error'}`);
              }
            } else {
              leadErrors.push(`Jiji Chat API failed: ${jijiData.error || 'Server error'}`);
            }
          }
        } catch (err: any) {
          leadErrors.push(`Jiji Chat: ${err.message}`);
        }
      }

      // ── 5. LEAD STATUS & NOTE UPDATE ──
      const timestamp = new Date().toISOString();
      if (leadDispatched.length > 0) {
        const successMsg = `Multichannel sent: [${leadDispatched.join(', ')}].` + 
          (leadErrors.length > 0 ? ` Non-critical warnings: [${leadErrors.join(', ')}]` : '');
        
        await updateLeadStatus(leadId, 'CONTACTED', successMsg, timestamp);
        results.push({ leadId, name: lead.name, status: 'CONTACTED', details: successMsg });
      } else {
        const failMsg = `Failed multichannel: [${leadErrors.join(', ')}]`;
        await updateLeadStatus(leadId, 'ERROR', failMsg, timestamp);
        results.push({ leadId, name: lead.name, status: 'ERROR', details: failMsg });
      }
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
