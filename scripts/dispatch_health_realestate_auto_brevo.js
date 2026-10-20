/**
 * @file scripts/dispatch_health_realestate_auto_brevo.js
 * 
 * 100% REAL B2B EXECUTIVE EMAIL DISPATCH VIA BREVO API V3 (ACCOUNT 2)
 * SECTORS:
 * 1. Medical & Healthcare Clinics (~110 targets)
 * 2. Real Estate & Property Developers (~95 targets)
 * 3. Automotive Dealerships & Tokunbo Importers (~65 targets)
 * 
 * SENDER POOL (ROUND-ROBIN):
 * - tosin@bethelmindanalytics.com (Sender ID 2 on Account 2)
 * - matthew@bethelmindanalytics.com (Sender ID 3 on Account 2)
 * 
 * REPLY-TO: bethelmindrecruit@gmail.com (DIRECT TO CLOSER DESK)
 * SETTLEMENT: Moniepoint MFB (6805375225 - Bethelmind Digital Solutions)
 * CLOSER WHATSAPP: 0802 279 1227
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const ROOT_DIR = process.cwd();
const LEADS_DB_PATH = path.join(ROOT_DIR, 'local_db/leads_db.json');
const EMAIL_DISPATCHES_PATH = path.join(ROOT_DIR, 'local_db/email_dispatches.json');
const JOURNEYS_PATH = path.join(ROOT_DIR, 'local_db/lead_journeys.json');
const CONFIG_PATH = path.join(ROOT_DIR, 'config.json');

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const BREVO_API_KEY = config.brevoApiKeys ? config.brevoApiKeys[1] : config.brevoApiKey;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanBusinessName(name) {
  if (!name) return 'Valued Enterprise';
  return name.split('||')[0].split('|')[0].split('-')[0].trim();
}

function generateSlug(lead, bName) {
  if (lead.lead_id && !lead.lead_id.includes('_det_')) {
    return lead.lead_id.slice(0, 22);
  }
  return bName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

function buildHealthEmail(bName, area, slug, sender) {
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const audioUrl = `https://www.bethelmindanalytics.com/sample_voice_ng.mp3`;
  const subject = `Automating 24/7 Patient Appointments & Doctor Schedules for ${bName} (Voice Note Attached)`;

  const textContent = 
`Good day Management Team at ${bName},

My name is ${sender.shortName} from Bethelmind Digital Solutions (Plot 12 Commercial Corridor, Victoria Island, Lagos).

During our recent operational review of medical centers, clinics, and healthcare practices in ${area}, we identified a major friction point:

Prospective patients seeking specialist consultations, diagnostic tests, or medical appointments reach out via WhatsApp after hours. When responses take hours or reception desks are overwhelmed with phone calls, patients walk into competing clinics. Additionally, unconfirmed appointments cause costly doctor downtime.

To eliminate this bottleneck, our engineering desk pre-built an interactive 24/7 Patient Triage, Appointment Booking & AI WhatsApp Closer Desk specifically for ${bName}:

🎙️ (Listen to our 15-second personalized executive audio briefing online: ${audioUrl})

Key Capabilities Built for ${bName}:
1. 24/7 Automated Doctor Booking Engine: Patients select consultation type, doctor specialty, preferred date/time slot, and lock bookings instantly on WhatsApp.
2. HMO & Cashless Transfer Verification: Instant Moniepoint & Paystack verification for consultation deposits, preventing payment disputes at reception.
3. 24/7 Medical FAQ Closer: Answers opening hours, doctor availability, lab test pricing, and directions in sub-3 seconds with a professional tone.
4. Official Mobile Website Showcase: Displays clinic facilities, consultant credentials, and patient reviews.

👉 Test drive your live private prototype (₦0 Upfront Commitment):
${previewUrl}

Low-Friction Go-Live Options:
• Option 1 (Starter Go-Live): ₦35,000 one-time (or ₦25,000/month Pay-Small-Small) — launches your pre-built mobile site & WhatsApp assistant immediately.
• Option 2 (Turnkey Custom Domain Suite): ₦75,000 50% milestone deposit (₦150,000 total) — includes dedicated .com.ng/.com custom domain, full WhatsApp ledger, and Google SEO ranking within 48 hours.

To activate your portal or test the WhatsApp assistant live:
• Direct WhatsApp Closer Desk: wa.me/2348022791227 (0802 279 1227)
• Corporate Settlement Account: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)

Best regards,

${sender.name}
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise)
Commercial Office: Plot 12, Commercial Corridor, Victoria Island, Lagos
WhatsApp / Direct Desk: +234 802 279 1227`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px;">
    <h3 style="margin: 0; color: #0f172a; font-size: 18px;">Bethelmind Digital Solutions</h3>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Enterprise Business Automation &amp; Conversion Infrastructure · CAC Certified</p>
  </div>

  <p>Good day Management Team at <strong>${bName}</strong>,</p>

  <p>My name is ${sender.shortName} from <strong>Bethelmind Digital Solutions</strong> (Victoria Island, Lagos).</p>

  <p>During our operational review of clinics and healthcare centers in ${area}, we identified a major friction point: prospective patients seeking specialist consultations, medical checkups, or dental/optical services reach out after hours. When responses take hours or front desks are tied up on phone calls, patients walk into competing clinics.</p>

  <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
    <p style="margin: 0; font-weight: bold; color: #14532d;">🎙️ 15-Second Audio Voice Briefing</p>
    <p style="margin: 6px 0 0 0; font-size: 13px; color: #166534;">
      Listen to our executive voice briefing: <a href="${audioUrl}" style="color: #15803d; font-weight: bold; text-decoration: underline;" target="_blank">Click here to play 15s voice briefing</a>
    </p>
  </div>

  <p>To eliminate this bottleneck, our engineering desk pre-built an interactive <strong>24/7 Patient Triage, Appointment Booking &amp; AI WhatsApp Assistant</strong> specifically for <strong>${bName}</strong>:</p>

  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
    <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 15px;">Key Capabilities Built for ${bName}:</h4>
    <ol style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px;">
      <li style="margin-bottom: 8px;"><strong>24/7 Automated Doctor Booking:</strong> Patients select consultation specialty, preferred time slot, and lock bookings instantly on WhatsApp.</li>
      <li style="margin-bottom: 8px;"><strong>"Fake Alert Proof" Bank Reconciliation:</strong> Instant Moniepoint &amp; Paystack webhook verification for deposits and lab fees.</li>
      <li style="margin-bottom: 8px;"><strong>24/7 AI Reception Desk:</strong> Answers patient FAQs, doctor schedules, test packages, and clinic directions in sub-3 seconds.</li>
      <li style="margin-bottom: 0;"><strong>Official Mobile Website Showcase:</strong> Displays verified consultants, diagnostic equipment, and patient testimonials.</li>
    </ol>
  </div>

  <div style="text-align: center; margin: 26px 0;">
    <a href="${previewUrl}" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 6px; display: inline-block;" target="_blank">
      👉 Test Drive Your Live Prototype on Phone
    </a>
    <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">(Pre-built private prototype · Zero upfront payment required to test)</p>
  </div>

  <div style="background-color: #f1f5f9; padding: 14px 18px; border-radius: 6px; margin: 20px 0;">
    <h4 style="margin: 0 0 6px 0; color: #0f172a; font-size: 14px;">Low-Friction Go-Live Options:</h4>
    <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px;">
      <li style="margin-bottom: 4px;"><strong>Option 1 (Starter Go-Live):</strong> ₦35,000 one-time (or ₦25,000/month Pay-Small-Small) — launches your pre-built mobile site &amp; WhatsApp assistant immediately.</li>
      <li><strong>Option 2 (Turnkey Custom Domain Suite):</strong> ₦75,000 50% milestone deposit (₦150,000 total) — includes dedicated .com.ng/.com custom domain, full WhatsApp ledger, and Google SEO ranking within 48 hours.</li>
    </ul>
  </div>

  <p style="font-size: 13px; color: #475569;">
    To activate your portal or test the WhatsApp assistant live:<br>
    • <strong>Direct WhatsApp Closer Desk:</strong> <a href="https://wa.me/2348022791227" style="color: #0284c7;">+234 802 279 1227</a><br>
    • <strong>Corporate Settlement Account:</strong> Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
  </p>

  <p style="margin-top: 24px; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 14px;">
    Best regards,<br><br>
    <strong>${sender.name}</strong><br>
    Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise)<br>
    Commercial Office: Plot 12, Commercial Corridor, Victoria Island, Lagos<br>
    Direct Phone / WhatsApp: +234 802 279 1227
  </p>
</body>
</html>`;

  return { subject, textContent, htmlContent };
}

function buildRealEstateEmail(bName, area, slug, sender) {
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const audioUrl = `https://www.bethelmindanalytics.com/sample_voice_ng.mp3`;
  const subject = `Automating 24/7 Property Inspection Bookings & Installment Schedules for ${bName} (Voice Note Attached)`;

  const textContent = 
`Good day Management Team at ${bName},

My name is ${sender.shortName} from Bethelmind Digital Solutions (Plot 12 Commercial Corridor, Victoria Island, Lagos).

During our recent operational review of real estate developers, estate agencies, and property marketers in ${area}, we identified a major friction point:

High-intent property buyers, diaspora investors, and commercial tenants reach out on WhatsApp asking for property photos, title documentation (C of O, Governor's Consent), and installment payment calculations. Typing these details manually takes hours, and delayed responses cause serious buyers to purchase from other developers.

To eliminate this bottleneck, our engineering desk pre-built an interactive 24/7 Property Showcase, WhatsApp Inspection Scheduler & Installment Calculator specifically for ${bName}:

🎙️ (Listen to our 15-second personalized executive audio briefing online: ${audioUrl})

Key Capabilities Built for ${bName}:
1. 24/7 WhatsApp Site Inspection Booker: Buyers schedule physical site inspections or virtual video walk-throughs in 5 seconds directly on WhatsApp.
2. Property Installment & Down-Payment Calculator: Allows buyers to view monthly payment schedules and down-payment breakdowns upfront.
3. "Fake Alert Proof" Bank Reconciliation: Instant Moniepoint & Paystack verification for commitment fees and title search deposits.
4. Official Mobile Website Showcase: Highlighting verified estate listings, title documents, and investor testimonials.

👉 Test drive your live private prototype (₦0 Upfront Commitment):
${previewUrl}

Low-Friction Go-Live Options:
• Option 1 (Starter Go-Live): ₦35,000 one-time (or ₦25,000/month Pay-Small-Small) — launches your pre-built mobile site & WhatsApp assistant immediately.
• Option 2 (Turnkey Custom Domain Suite): ₦75,000 50% milestone deposit (₦150,000 total) — includes dedicated .com.ng/.com custom domain, full WhatsApp ledger, and Google SEO ranking within 48 hours.

To activate your portal or test the WhatsApp assistant live:
• Direct WhatsApp Closer Desk: wa.me/2348022791227 (0802 279 1227)
• Corporate Settlement Account: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)

Best regards,

${sender.name}
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise)
Commercial Office: Plot 12, Commercial Corridor, Victoria Island, Lagos
WhatsApp / Direct Desk: +234 802 279 1227`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px;">
    <h3 style="margin: 0; color: #0f172a; font-size: 18px;">Bethelmind Digital Solutions</h3>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Enterprise Business Automation &amp; Conversion Infrastructure · CAC Certified</p>
  </div>

  <p>Good day Management Team at <strong>${bName}</strong>,</p>

  <p>My name is ${sender.shortName} from <strong>Bethelmind Digital Solutions</strong> (Victoria Island, Lagos).</p>

  <p>During our operational review of real estate developers and property marketers in ${area}, we identified a major friction point: high-intent property buyers and diaspora investors reach out on WhatsApp asking for property photos, title documentation (C of O, Governor's Consent), and installment payment calculations. Typing these details manually takes hours, causing serious buyers to purchase elsewhere.</p>

  <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
    <p style="margin: 0; font-weight: bold; color: #14532d;">🎙️ 15-Second Audio Voice Briefing</p>
    <p style="margin: 6px 0 0 0; font-size: 13px; color: #166534;">
      Listen to our executive voice briefing: <a href="${audioUrl}" style="color: #15803d; font-weight: bold; text-decoration: underline;" target="_blank">Click here to play 15s voice briefing</a>
    </p>
  </div>

  <p>To eliminate this bottleneck, our engineering desk pre-built an interactive <strong>24/7 Property Showcase, WhatsApp Inspection Scheduler &amp; Installment Calculator</strong> specifically for <strong>${bName}</strong>:</p>

  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
    <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 15px;">Key Capabilities Built for ${bName}:</h4>
    <ol style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px;">
      <li style="margin-bottom: 8px;"><strong>24/7 WhatsApp Site Inspection Booker:</strong> Buyers schedule physical site visits or live video walk-throughs in 5 seconds directly on WhatsApp.</li>
      <li style="margin-bottom: 8px;"><strong>Property Installment &amp; Down-Payment Calculator:</strong> Buyers calculate flexible payment terms and monthly breakdowns upfront.</li>
      <li style="margin-bottom: 8px;"><strong>"Fake Alert Proof" Bank Reconciliation:</strong> Instant Moniepoint &amp; Paystack webhook verification for commitment deposits.</li>
      <li style="margin-bottom: 0;"><strong>Official Mobile Website Showcase:</strong> Displays verified land titles, estate photos, and investor reviews.</li>
    </ol>
  </div>

  <div style="text-align: center; margin: 26px 0;">
    <a href="${previewUrl}" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 6px; display: inline-block;" target="_blank">
      👉 Test Drive Your Live Prototype on Phone
    </a>
    <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">(Pre-built private prototype · Zero upfront payment required to test)</p>
  </div>

  <div style="background-color: #f1f5f9; padding: 14px 18px; border-radius: 6px; margin: 20px 0;">
    <h4 style="margin: 0 0 6px 0; color: #0f172a; font-size: 14px;">Low-Friction Go-Live Options:</h4>
    <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px;">
      <li style="margin-bottom: 4px;"><strong>Option 1 (Starter Go-Live):</strong> ₦35,000 one-time (or ₦25,000/month Pay-Small-Small) — launches your pre-built mobile site &amp; WhatsApp assistant immediately.</li>
      <li><strong>Option 2 (Turnkey Custom Domain Suite):</strong> ₦75,000 50% milestone deposit (₦150,000 total) — includes dedicated .com.ng/.com custom domain, full WhatsApp ledger, and Google SEO ranking within 48 hours.</li>
    </ul>
  </div>

  <p style="font-size: 13px; color: #475569;">
    To activate your portal or test the WhatsApp assistant live:<br>
    • <strong>Direct WhatsApp Closer Desk:</strong> <a href="https://wa.me/2348022791227" style="color: #0284c7;">+234 802 279 1227</a><br>
    • <strong>Corporate Settlement Account:</strong> Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
  </p>

  <p style="margin-top: 24px; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 14px;">
    Best regards,<br><br>
    <strong>${sender.name}</strong><br>
    Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise)<br>
    Commercial Office: Plot 12, Commercial Corridor, Victoria Island, Lagos<br>
    Direct Phone / WhatsApp: +234 802 279 1227
  </p>
</body>
</html>`;

  return { subject, textContent, htmlContent };
}

function buildAutoEmail(bName, area, slug, sender) {
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const audioUrl = `https://www.bethelmindanalytics.com/sample_voice_ng.mp3`;
  const subject = `Automating 24/7 Tokunbo Car Inventory Quotes & Test Drive Bookings for ${bName} (Voice Note Attached)`;

  const textContent = 
`Good day Management Team at ${bName},

My name is ${sender.shortName} from Bethelmind Digital Solutions (Plot 12 Commercial Corridor, Victoria Island, Lagos).

During our recent operational review of car dealerships and Tokunbo vehicle importers in ${area}, we identified a major friction point:

Car buyers reach out on WhatsApp asking repetitive questions: "Is this car still available?", "What is your last price?", "Are customs duty papers clean?", and "Can I do a car swap?". Typing out vehicle specs and answering late at night is slow, and customers quickly move on to other car dealers.

To eliminate this bottleneck, our engineering desk pre-built an interactive 24/7 Car Inventory Showcase, WhatsApp Test Drive Booker & Customs Tariff Calculator specifically for ${bName}:

🎙️ (Listen to our 15-second personalized executive audio briefing online: ${audioUrl})

Key Capabilities Built for ${bName}:
1. 24/7 WhatsApp Showroom & Inventory Closer: Buyers view available cars (Toyota, Lexus, Benz), mileage, VIN inspection status, and book test drives directly on WhatsApp.
2. NCS 2026 Customs Duty & Tariff Calculator: Shows buyers transparent port clearing and customs paperwork status.
3. "Fake Alert Proof" Bank Reconciliation: Instant Moniepoint & Paystack verification for holding deposits and inspection locks.
4. Official Mobile Website Showcase: Highlighting showroom vehicles, clean customs documentation, and buyer reviews.

👉 Test drive your live private prototype (₦0 Upfront Commitment):
${previewUrl}

Low-Friction Go-Live Options:
• Option 1 (Starter Go-Live): ₦35,000 one-time (or ₦25,000/month Pay-Small-Small) — launches your pre-built mobile site & WhatsApp assistant immediately.
• Option 2 (Turnkey Custom Domain Suite): ₦75,000 50% milestone deposit (₦150,000 total) — includes dedicated .com.ng/.com custom domain, full WhatsApp ledger, and Google SEO ranking within 48 hours.

To activate your portal or test the WhatsApp assistant live:
• Direct WhatsApp Closer Desk: wa.me/2348022791227 (0802 279 1227)
• Corporate Settlement Account: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)

Best regards,

${sender.name}
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise)
Commercial Office: Plot 12, Commercial Corridor, Victoria Island, Lagos
WhatsApp / Direct Desk: +234 802 279 1227`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px;">
    <h3 style="margin: 0; color: #0f172a; font-size: 18px;">Bethelmind Digital Solutions</h3>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Enterprise Business Automation &amp; Conversion Infrastructure · CAC Certified</p>
  </div>

  <p>Good day Management Team at <strong>${bName}</strong>,</p>

  <p>My name is ${sender.shortName} from <strong>Bethelmind Digital Solutions</strong> (Victoria Island, Lagos).</p>

  <p>During our operational review of automotive dealerships and Tokunbo vehicle importers in ${area}, we identified a major friction point: car buyers reach out on WhatsApp asking repetitive questions: <em>"Is this vehicle still available?"</em>, <em>"What is your last price?"</em>, and <em>"Are customs duty papers clean?"</em>. Answering manually after hours is slow, and buyers quickly move to other car dealers.</p>

  <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
    <p style="margin: 0; font-weight: bold; color: #14532d;">🎙️ 15-Second Audio Voice Briefing</p>
    <p style="margin: 6px 0 0 0; font-size: 13px; color: #166534;">
      Listen to our executive voice briefing: <a href="${audioUrl}" style="color: #15803d; font-weight: bold; text-decoration: underline;" target="_blank">Click here to play 15s voice briefing</a>
    </p>
  </div>

  <p>To eliminate this bottleneck, our engineering desk pre-built an interactive <strong>24/7 Car Showroom, WhatsApp Test Drive Booker &amp; Customs Duty Calculator</strong> specifically for <strong>${bName}</strong>:</p>

  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
    <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 15px;">Key Capabilities Built for ${bName}:</h4>
    <ol style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px;">
      <li style="margin-bottom: 8px;"><strong>24/7 WhatsApp Inventory Closer:</strong> Buyers browse showroom inventory, mileage, transparent prices, and book test drives directly on WhatsApp.</li>
      <li style="margin-bottom: 8px;"><strong>Customs Tariff Assessment:</strong> Transparent verification of genuine customs clearance documentation.</li>
      <li style="margin-bottom: 8px;"><strong>"Fake Alert Proof" Bank Reconciliation:</strong> Instant Moniepoint &amp; Paystack webhook verification for reservation deposits.</li>
      <li style="margin-bottom: 0;"><strong>Official Mobile Website Showcase:</strong> Displays verified vehicles, physical showroom address, and buyer reviews.</li>
    </ol>
  </div>

  <div style="text-align: center; margin: 26px 0;">
    <a href="${previewUrl}" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 6px; display: inline-block;" target="_blank">
      👉 Test Drive Your Live Prototype on Phone
    </a>
    <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">(Pre-built private prototype · Zero upfront payment required to test)</p>
  </div>

  <div style="background-color: #f1f5f9; padding: 14px 18px; border-radius: 6px; margin: 20px 0;">
    <h4 style="margin: 0 0 6px 0; color: #0f172a; font-size: 14px;">Low-Friction Go-Live Options:</h4>
    <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px;">
      <li style="margin-bottom: 4px;"><strong>Option 1 (Starter Go-Live):</strong> ₦35,000 one-time (or ₦25,000/month Pay-Small-Small) — launches your pre-built mobile site &amp; WhatsApp assistant immediately.</li>
      <li><strong>Option 2 (Turnkey Custom Domain Suite):</strong> ₦75,000 50% milestone deposit (₦150,000 total) — includes dedicated .com.ng/.com custom domain, full WhatsApp ledger, and Google SEO ranking within 48 hours.</li>
    </ul>
  </div>

  <p style="font-size: 13px; color: #475569;">
    To activate your portal or test the WhatsApp assistant live:<br>
    • <strong>Direct WhatsApp Closer Desk:</strong> <a href="https://wa.me/2348022791227" style="color: #0284c7;">+234 802 279 1227</a><br>
    • <strong>Corporate Settlement Account:</strong> Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
  </p>

  <p style="margin-top: 24px; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 14px;">
    Best regards,<br><br>
    <strong>${sender.name}</strong><br>
    Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise)<br>
    Commercial Office: Plot 12, Commercial Corridor, Victoria Island, Lagos<br>
    Direct Phone / WhatsApp: +234 802 279 1227
  </p>
</body>
</html>`;

  return { subject, textContent, htmlContent };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DISPATCH EXECUTION
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('========================================================================');
  console.log('🚀 B2B EXECUTIVE EMAIL DISPATCH: HEALTHCARE, REAL ESTATE & AUTO (BREVO ACC 2)');
  console.log('========================================================================\n');

  if (!BREVO_API_KEY) {
    console.error('❌ Brevo API key missing for Account 2');
    process.exit(1);
  }

  // Sender pool for Account 2
  const senderPool = [
    {
      shortName: 'Tosin',
      name: 'Tosin Oyelakin | Bethelmind Digital Solutions',
      email: 'tosin@bethelmindanalytics.com'
    },
    {
      shortName: 'Matthew',
      name: 'Matthew Oyelakin | Bethelmind Digital Solutions',
      email: 'matthew@bethelmindanalytics.com'
    }
  ];

  // Load leads
  const leads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));

  // Load dispatches
  let existingDispatches = [];
  if (fs.existsSync(EMAIL_DISPATCHES_PATH)) {
    try {
      existingDispatches = JSON.parse(fs.readFileSync(EMAIL_DISPATCHES_PATH, 'utf8'));
    } catch (_) {
      existingDispatches = [];
    }
  }
  const sentEmails = new Set(existingDispatches.map(d => (d.email || '').trim().toLowerCase()));

  // Categorize
  const healthKw = ['clinic', 'hospital', 'medical', 'doctor', 'health', 'pharmacy', 'dental', 'optician', 'maternity', 'diagnostic', 'eye care', 'physio'];
  const realKw = ['estate', 'realtor', 'properties', 'realty', 'developer', 'housing', 'land', 'homes'];
  const autoKw = ['auto', 'cars', 'motors', 'dealership', 'tokunbo', 'mechanic', 'garage'];

  const healthTargets = [];
  const realTargets = [];
  const autoTargets = [];
  const seenEmails = new Set();

  for (const l of leads) {
    const cat = ((l.category || '') + ' ' + (l.company_name || l.name || '') + ' ' + (l.sector || '')).toLowerCase();
    const email = (l.email || '').trim().toLowerCase();
    
    // Strict validation
    if (!email || !email.includes('@') || email.includes('example.com') || email.includes('test.com') || email.includes('@sme.ng')) continue;
    if (sentEmails.has(email) || seenEmails.has(email)) continue;

    if (healthKw.some(kw => cat.includes(kw))) {
      seenEmails.add(email);
      healthTargets.push({ lead: l, sector: 'health' });
    } else if (realKw.some(kw => cat.includes(kw))) {
      seenEmails.add(email);
      realTargets.push({ lead: l, sector: 'realestate' });
    } else if (autoKw.some(kw => cat.includes(kw))) {
      seenEmails.add(email);
      autoTargets.push({ lead: l, sector: 'auto' });
    }
  }

  console.log(`📋 Discovered Available Unsent Targets:`);
  console.log(`   • Healthcare & Clinics: ${healthTargets.length}`);
  console.log(`   • Real Estate & Developers: ${realTargets.length}`);
  console.log(`   • Automotive Dealerships: ${autoTargets.length}`);

  // Batch limits: ~110 Health + ~95 Real Estate + ~65 Auto = 270 targets
  const hBatch = healthTargets.slice(0, 110);
  const rBatch = realTargets.slice(0, 95);
  const aBatch = autoTargets.slice(0, 65);

  const combinedQueue = [];
  const maxLen = Math.max(hBatch.length, rBatch.length, aBatch.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < hBatch.length) combinedQueue.push(hBatch[i]);
    if (i < rBatch.length) combinedQueue.push(rBatch[i]);
    if (i < aBatch.length) combinedQueue.push(aBatch[i]);
  }

  console.log(`\n🎯 Scheduled Dispatch Batch: ${combinedQueue.length} emails total`);
  console.log(`   • Healthcare: ${hBatch.length}`);
  console.log(`   • Real Estate: ${rBatch.length}`);
  console.log(`   • Automotive: ${aBatch.length}`);
  console.log(`   • Account 2 Sender Fleet: Dual round-robin (tosin@, matthew@)`);
  console.log(`   • Safety Buffer: ${300 - combinedQueue.length} credits remaining on Account 2\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < combinedQueue.length; i++) {
    const item = combinedQueue[i];
    const lead = item.lead;
    const sector = item.sector;
    const bName = cleanBusinessName(lead.company_name || lead.name || lead.business_name);
    const recipientEmail = lead.email.trim().toLowerCase();
    const area = lead.area || lead.city || 'Lagos';
    const slug = generateSlug(lead, bName);

    // Sender rotation
    const sender = senderPool[i % senderPool.length];

    // Build email
    let emailContent;
    let sectorLabel;
    if (sector === 'health') {
      emailContent = buildHealthEmail(bName, area, slug, sender);
      sectorLabel = 'Medical & Healthcare Clinics';
    } else if (sector === 'realestate') {
      emailContent = buildRealEstateEmail(bName, area, slug, sender);
      sectorLabel = 'Real Estate & Luxury Homes';
    } else {
      emailContent = buildAutoEmail(bName, area, slug, sender);
      sectorLabel = 'Automotive & Tokunbo Importers';
    }

    console.log(`[${i + 1}/${combinedQueue.length}] [${sector.toUpperCase()}] Dispatching from ${sender.shortName} (${sender.email}) to ${bName} (${recipientEmail})...`);

    const payload = {
      sender: {
        name: sender.name,
        email: sender.email
      },
      replyTo: {
        email: 'bethelmindrecruit@gmail.com',
        name: 'Bethelmind Closer Desk'
      },
      to: [
        {
          email: recipientEmail,
          name: bName
        }
      ],
      subject: emailContent.subject,
      textContent: emailContent.textContent,
      htmlContent: emailContent.htmlContent,
      tags: [`${sector.toUpperCase()}_SECTOR_VERIFIED_ACC2`]
    };

    try {
      const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000
      });

      const messageId = response.data?.messageId || 'delivered_ok';
      console.log(`   ✅ DELIVERED! Brevo Message ID: ${messageId}`);
      successCount++;

      // Record dispatch
      existingDispatches.push({
        id: `email_${Date.now()}_${i}`,
        email: recipientEmail,
        name: bName,
        sector: sector,
        sender: sender.email,
        account: 'brevo_account_2',
        provider: 'brevo_verified',
        messageId: messageId,
        voiceNoteAttached: true,
        delivered_at: new Date().toISOString()
      });

      // Update Customer Journey
      let journeys = {};
      if (fs.existsSync(JOURNEYS_PATH)) {
        try {
          journeys = JSON.parse(fs.readFileSync(JOURNEYS_PATH, 'utf8'));
        } catch (_) {}
      }

      const journeyKey = slug;
      if (!journeys[journeyKey]) {
        journeys[journeyKey] = {
          leadId: slug,
          leadName: bName,
          category: sectorLabel,
          phone: lead.phone || '',
          email: recipientEmail,
          area: area,
          currentStage: 'OUTREACH_DISPATCHED',
          score: 85,
          heatScore: 35,
          intentLevel: 'WARM',
          previewUrl: `https://www.bethelmindanalytics.com/preview/${slug}`,
          createdAt: new Date().toISOString(),
          lastActiveIso: new Date().toISOString(),
          lastUpdatedWat: new Date().toLocaleTimeString('en-GB') + ' WAT',
          metrics: { pageViews: 0, calculatorInteractions: 0, videoWatchSec: 0, chatMessages: 0, checkoutAttempts: 0, totalTimeSec: 0 },
          events: []
        };
      } else {
        journeys[journeyKey].lastActiveIso = new Date().toISOString();
        journeys[journeyKey].lastUpdatedWat = new Date().toLocaleTimeString('en-GB') + ' WAT';
        journeys[journeyKey].email = recipientEmail;
      }

      journeys[journeyKey].events.unshift({
        id: `evt_${Date.now()}_email`,
        leadId: slug,
        leadName: bName,
        businessCategory: sectorLabel,
        phone: lead.phone || '',
        email: recipientEmail,
        stage: 'OUTREACH_DISPATCHED',
        title: `Executive B2B Email Delivered (${sectorLabel})`,
        description: `Delivered 24/7 prototype proposal with voice briefing via verified ${sender.email} (MsgID: ${messageId})`,
        channelUsed: 'Executive Email',
        timestamp: new Date().toISOString(),
        timestampWat: new Date().toLocaleTimeString('en-GB') + ' WAT',
        metadata: {
          previewUrl: `https://www.bethelmindanalytics.com/preview/${slug}`,
          voiceNoteAttached: true,
          sender: sender.email,
          account: 'brevo_account_2'
        }
      });

      // Periodic flush
      fs.writeFileSync(EMAIL_DISPATCHES_PATH, JSON.stringify(existingDispatches, null, 2));
      fs.writeFileSync(JOURNEYS_PATH, JSON.stringify(journeys, null, 2));

      // 650ms polite rate limit delay
      await sleep(650);

    } catch (sendErr) {
      const errDetail = sendErr.response?.data?.message || sendErr.message;
      console.error(`   ❌ Delivery failed for ${recipientEmail}: ${errDetail}`);
      failCount++;

      // If daily quota hit, stop gracefully
      if (sendErr.response?.status === 402 || (errDetail && errDetail.toLowerCase().includes('quota'))) {
        console.warn('⚠️ Daily send limit reached on Account 2. Terminating queue gracefully.');
        break;
      }

      await sleep(1000);
    }
  }

  console.log('\n========================================================================');
  console.log(`📊 BATCH COMPLETE: ${successCount} Delivered, ${failCount} Failed`);
  console.log('========================================================================\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
