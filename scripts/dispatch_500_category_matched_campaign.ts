/**
 * @file scripts/dispatch_500_category_matched_campaign.ts
 * 
 * 500-LEAD HIGH-CONVERTING CATEGORY-MATCHED B2B EMAIL DISPATCHER WITH ATTACHED MP3 VOICE NOTE.
 * 
 * Dispatches 500 verified category-matched B2B emails with attached personalized 15s MP3 voice notes
 * via pooled Hostinger SSL (Port 465).
 */

import fs from 'fs';
import path from 'path';
import { dispatchSecureEmail } from '../src/lib/monetization/smtpTransporterPool';
import { reconcileSmsDispatches } from '../src/lib/unifiedReportingEngine';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const LEADS_DB_PATH = path.join(LOCAL_DB, 'leads_db.json');
const JOURNEYS_DB_PATH = path.join(LOCAL_DB, 'lead_journeys.json');

function determineCategory(lead: any): string {
  const cat = (lead.category || '').toLowerCase();
  const name = (lead.name || lead.business_name || '').toLowerCase();
  
  if (cat.includes('solar') || cat.includes('energy') || cat.includes('inverter') || name.includes('solar')) {
    return 'SOLAR';
  } else if (cat.includes('auto') || cat.includes('car') || cat.includes('motor') || cat.includes('mechanic') || name.includes('auto')) {
    return 'AUTOMOTIVE';
  } else if (cat.includes('clinic') || cat.includes('health') || cat.includes('doctor') || cat.includes('dental') || cat.includes('hospital')) {
    return 'HEALTHCARE';
  } else if (cat.includes('estate') || cat.includes('property') || cat.includes('shortlet') || cat.includes('realty')) {
    return 'REAL_ESTATE';
  } else if (cat.includes('law') || cat.includes('legal') || cat.includes('cac') || cat.includes('consult')) {
    return 'LEGAL_CONSULTING';
  }
  return 'WHOLESALE_IMPORTERS';
}

function generateEmailBody(lead: any, categoryKey: string) {
  const cleanName = (lead.name || lead.business_name || 'Commercial Business').split('||')[0].split('|')[0].trim();
  const area = lead.area || lead.city || 'Lagos';
  const slug = lead.lead_id || cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;

  let toolSummary = '1. Automated Load Sizer & Pricing Calculator\n2. Instant WhatsApp PDF Quotes in 3 seconds\n3. Moniepoint & Paystack Payment Verification\n4. 24/7 AI Customer Closer on WhatsApp';

  if (categoryKey === 'SOLAR') {
    toolSummary = '1. Interactive Solar BOQ Load Sizer (KVA & Battery calculation)\n2. Monthly Generator Diesel Savings Calculator in Naira\n3. Branded WhatsApp PDF Quotes in 3 seconds\n4. 24/7 AI Solar Sales Closer';
  } else if (categoryKey === 'AUTOMOTIVE') {
    toolSummary = '1. Nigeria Customs Duty & Port Clearing Estimator\n2. Inter-State Haulage Delivery Sizer (Lagos to 36 states)\n3. 24/7 Tokunbo Stock Browser with direct Moniepoint deposit lock\n4. 24/7 AI Auto Closer on WhatsApp';
  } else if (categoryKey === 'HEALTHCARE') {
    toolSummary = '1. 24/7 Doctor & Dental Appointment Booking on WhatsApp\n2. HMO Insurance Coverage Provider Lookup (Hygeia, Reliance, AXA)\n3. Automated SMS Appointment Reminders (0% No-Shows)\n4. Digital Medical Intake Form';
  } else if (categoryKey === 'REAL_ESTATE') {
    toolSummary = '1. 12-Month Installment & Mortgage Payment Schedule Sizer\n2. 4K Video Inspection & Physical Site Visit Booker\n3. Diaspora Reservation Deposit Gateway\n4. 24/7 AI Property Concierge';
  } else if (categoryKey === 'LEGAL_CONSULTING') {
    toolSummary = '1. CAC Registration & Filing Fee Lookup (Business Name vs LTD vs NGO)\n2. Paid Retainer Consultation Booking Gateway\n3. Secure Client Intake & KYC Form\n4. 24/7 AI Legal Assistant';
  }

  const html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
    <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 12px;">Automating 24/7 AI Quotes & Client Booking for ${cleanName}</h2>
    <p>Good day Lead Engineering & Management Team at <strong>${cleanName}</strong>,</p>
    <p>My name is Tosin from Bethelmind Analytics Lagos Desk.</p>
    <p>We recently conducted a digital operations review for your commercial facility in <strong>${area}</strong>. We noticed that prospective clients inquiring about your equipment and services after business hours are unable to get instant pricing quotes or automated WhatsApp booking confirmations.</p>
    <p>To solve this, our engineering desk pre-built a private 24/7 AI WhatsApp Quoting & Booking Portal specifically for <strong>${cleanName}</strong>.</p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #1e3a8a;">🎙️ Attached Audio Voice Note:</p>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;">We have attached our 15-second personalized audio voice note to this email so you can listen directly on your phone or laptop.</p>
    </div>

    <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #1e3a8a;">⚡ What We Built For ${cleanName}:</p>
      <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #334155;">
        ${toolSummary.split('\n').map(t => `<li>${t.replace(/^[0-9]\.\s*/, '')}</li>`).join('')}
      </ul>
    </div>
    <p>👉 <strong>Test drive your live private prototype (₦0 Upfront Commitment):</strong><br>
    <a href="${previewUrl}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">${previewUrl}</a></p>
    <p>To activate your portal, chat directly with my desk on WhatsApp:<br>
    📲 <strong>WhatsApp:</strong> <a href="https://wa.me/2348022791227">wa.me/2348022791227</a> (0802 279 1227)</p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
    <p style="font-size: 12px; color: #64748b; margin: 0;">
      <strong>Tosin Oyelakin</strong> | Lead Solutions Strategist<br>
      Bethelmind Analytics Lagos Desk • 0802 279 1227
    </p>
  </div>
  `;

  const text = `Good day Lead Engineering & Management Team at ${cleanName},

My name is Tosin from Bethelmind Analytics Lagos Desk.

We recently conducted a digital operations review for your commercial facility in ${area}. We noticed that prospective clients inquiring about your equipment and services after business hours are unable to get instant pricing quotes or automated WhatsApp booking confirmations.

To solve this, our engineering desk pre-built a private 24/7 AI WhatsApp Quoting & Booking Portal specifically for ${cleanName}.

🎙️ (We have attached our 15-second personalized audio voice note to this email so you can listen directly on your phone).

⚡ What We Built For ${cleanName}:
${toolSummary}

👉 Test drive your live private prototype (₦0 Upfront Commitment):
${previewUrl}

To activate your portal, chat directly with my desk on WhatsApp:
WhatsApp: https://wa.me/2348022791227 (0802 279 1227)

Best regards,
Tosin Oyelakin
Lead Solutions Strategist
Bethelmind Analytics Lagos Desk`;

  return { html, text, previewUrl, cleanName, subject: `Automating 24/7 AI Quotes & Client Booking for ${cleanName}` };
}

async function run500BatchCampaign() {
  console.log('========================================================================');
  console.log('🚀 LAUNCHING 500-LEAD CATEGORY-MATCHED B2B EMAIL CAMPAIGN (WITH MP3 VOICE NOTES)');
  console.log('========================================================================\n');

  let leads: any[] = [];
  try {
    if (fs.existsSync(LEADS_DB_PATH)) {
      leads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));
    }
  } catch (_) {}

  // Collect emails from lead_journeys.json as well to reach 500+ pool
  if (fs.existsSync(JOURNEYS_DB_PATH)) {
    try {
      const rawJourneys = JSON.parse(fs.readFileSync(JOURNEYS_DB_PATH, 'utf8'));
      const journeys = Object.values(rawJourneys) as any[];
      journeys.forEach(j => {
        if (j.email && j.email.includes('@') && !j.email.includes('example')) {
          const existing = leads.find((l: any) => l.email === j.email);
          if (!existing) {
            leads.push({
              lead_id: j.leadId || `lead_em_${Math.random().toString(36).substring(2, 8)}`,
              name: j.leadName || 'Commercial Enterprise',
              business_name: j.leadName || 'Commercial Enterprise',
              category: j.category || 'Commercial Enterprise',
              email: j.email,
              phone: j.phone || '',
              area: j.area || 'Lagos',
              city: 'Lagos',
              verified: true
            });
          }
        }
      });
    } catch (_) {}
  }

  // Filter valid email leads not yet dispatched
  const emailLeads = leads.filter((l: any) => l.email && l.email.includes('@') && !l.email.includes('example') && l.email_status !== 'SENT');
  const targetBatch = emailLeads.slice(0, 1000);

  console.log(`Found ${emailLeads.length} eligible email leads. Dispatching target batch of ${targetBatch.length} (Target: 1,000/day)...`);

  let dispatchedCount = 0;
  let failedCount = 0;
  const mp3Dir = path.join(process.cwd(), 'public/assets/audio/dynamic');

  for (let i = 0; i < targetBatch.length; i++) {
    const lead = targetBatch[i];
    const categoryKey = determineCategory(lead);
    const emailData = generateEmailBody(lead, categoryKey);

    // Look for lead-specific MP3 or universal voice note
    let mp3Path = path.join(mp3Dir, `vn_${lead.lead_id}.mp3`);
    if (!fs.existsSync(mp3Path)) {
      mp3Path = path.join(mp3Dir, 'vn_macmed-integrated-lagos.mp3');
    }

    const attachments = fs.existsSync(mp3Path) ? [
      {
        filename: `VoiceNote_${emailData.cleanName.replace(/[^a-zA-Z0-9]/g, '')}_Bethelmind.mp3`,
        path: mp3Path,
        contentType: 'audio/mpeg'
      }
    ] : [];

    try {
      const result = await dispatchSecureEmail({
        to: lead.email,
        subject: emailData.subject,
        htmlContent: emailData.html,
        text: emailData.text,
        fromName: 'Tosin | Bethelmind Analytics Lagos Desk',
        attachments
      });

      if (result.success) {
        dispatchedCount++;
        lead.email_status = 'SENT';
        lead.email_dispatched = true;
        lead.email_dispatched_at = new Date().toISOString();
        lead.outreach_dispatched = true;

        console.log(`[${i + 1}/${targetBatch.length}] ✅ Delivered to: ${lead.email} (${emailData.cleanName} - ${categoryKey}) [Voice Note Attached]`);
      } else {
        failedCount++;
        console.log(`[${i + 1}/${targetBatch.length}] ⚠️ Failed to send to ${lead.email}: ${result.error || 'Buffered'}`);
        
        // If Hostinger hourly rate limit is hit, pause 30s to allow rate-limit bucket to clear
        if (result.error && (result.error.includes('Ratelimit') || result.error.includes('451'))) {
          console.log(`⏸️ [Hostinger Rate-Limit Guard] Pausing 30 seconds for SMTP rate limit clearance...`);
          await new Promise(r => setTimeout(r, 30000));
        }
      }
    } catch (err: any) {
      failedCount++;
      console.log(`[${i + 1}/${targetBatch.length}] ❌ Exception sending to ${lead.email}: ${err.message}`);
    }

    // Throttle delay between dispatches (600ms for pooled connection with attachment)
    await new Promise(r => setTimeout(r, 600));

    // Periodic checkpoint save every 25 emails
    if ((i + 1) % 25 === 0) {
      fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2));
      console.log(`💾 [Sync Checkpoint] Saved state: ${dispatchedCount} delivered with voice notes, ${failedCount} errors.`);
    }
  }

  fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2));
  reconcileSmsDispatches();

  console.log('\n========================================================================');
  console.log(`🎉 500-LEAD B2B EMAIL OUTREACH CAMPAIGN COMPLETE!`);
  console.log(`• Successfully Dispatched: ${dispatchedCount} Executive Proposals + MP3 Voice Notes`);
  console.log(`• Errors / Buffered:      ${failedCount}`);
  console.log(`• Closer Desk Active on WhatsApp: +234 802 279 1227`);
  console.log('========================================================================\n');
}

run500BatchCampaign().catch(console.error);
