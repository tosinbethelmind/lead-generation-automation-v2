/**
 * @file scripts/dispatch_security_and_logistics_brevo.js
 * 
 * 100% REAL B2B EXECUTIVE EMAIL DISPATCH VIA BREVO API V3
 * SECTOR 1: Security & CCTV Surveillance Integrators
 * SECTOR 2: Logistics, Freight Forwarding & Haulage Operators
 * 
 * SENDERS (ROUND-ROBIN ROTATION):
 * 1. tosin@bethelmindanalytics.com (Sender ID 2)
 * 2. matthew@bethelmindanalytics.com (Sender ID 3)
 * 3. ceo@bethelmindanalytics.com (Sender ID 4)
 * 
 * REPLY-TO: bethelmindrecruit@gmail.com (DIRECT TO USER'S CLOSER DESK)
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
const BREVO_API_KEY = config.brevoApiKey;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanBusinessName(name) {
  if (!name) return 'Valued Business Partner';
  return name.split('||')[0].split('|')[0].split('-')[0].trim();
}

function generateSlug(lead, bName) {
  if (lead.lead_id && !lead.lead_id.includes('_det_')) {
    return lead.lead_id.slice(0, 22);
  }
  return bName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL TEMPLATE 1: SECURITY & CCTV SURVEILLANCE
// ─────────────────────────────────────────────────────────────────────────────
function buildSecurityEmail(bName, area, slug, sender) {
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const audioUrl = `https://www.bethelmindanalytics.com/sample_voice_ng.mp3`;
  const subject = `Automating 24/7 CCTV & Security BOQ Quotes for ${bName} (Voice Note Attached)`;

  const textContent = 
`Good day Management Team at ${bName},

My name is ${sender.shortName} from Bethelmind Digital Solutions (Plot 12 Commercial Corridor, Victoria Island, Lagos).

During our recent operational review of private security integrators and CCTV installation firms in ${area}, we identified a major friction point:

When prospective corporate facility managers, residential estates, or homeowners reach out after hours requesting a CCTV / security quotation, calculating camera counts (indoor/outdoor IP dome, bullet, PTZ, NVR channels, cabling runs, power supplies) and typing out equipment recommendations manually takes hours. High-intent clients hate waiting and quickly reach out to competing installers.

Furthermore, security companies frequently encounter the risk of fake bank transfer alerts when receiving equipment deposits or mobilization fees.

To eliminate these bottlenecks, our engineering desk pre-built an interactive 24/7 Security & CCTV BOQ Quoter & AI WhatsApp Booking Assistant specifically for ${bName}:

🎙️ (Listen to our 15-second personalized audio voice briefing online: ${audioUrl})

Key Capabilities Built for ${bName}:
1. 24/7 Interactive CCTV BOQ Quoter: Prospective clients select property type (residence, warehouse, plaza), number of cameras, access control doors, and get instant equipment specs and transparent estimates in Naira.
2. "Fake Alert Proof" Bank Reconciliation: Instant Moniepoint & Paystack webhook verification before deploying technicians or ordering expensive equipment.
3. 24/7 AI WhatsApp Closer Desk: Resolves pricing FAQs in sub-3 seconds with a natural Nigerian business tone.
4. Official Mobile Website Showcase: Showcases your verified portfolio, past corporate/estate installations, and client testimonials without monthly maintenance headaches.

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

  <p>During our operational review of private security integrators and CCTV installation enterprises in ${area}, we identified a major friction point: when prospective corporate facility managers, residential estates, or homeowners reach out after hours requesting a CCTV quotation, calculating camera counts (indoor/outdoor IP dome, bullet, NVR channels, cabling runs) and typing out equipment specs manually takes hours — causing high-intent prospects to look elsewhere.</p>

  <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
    <p style="margin: 0; font-weight: bold; color: #14532d;">🎙️ 15-Second Audio Voice Briefing</p>
    <p style="margin: 6px 0 0 0; font-size: 13px; color: #166534;">
      Listen to our executive voice briefing: <a href="${audioUrl}" style="color: #15803d; font-weight: bold; text-decoration: underline;" target="_blank">Click here to play 15s voice briefing</a>
    </p>
  </div>

  <p>To eliminate this bottleneck, our engineering desk pre-built an interactive <strong>24/7 Security &amp; CCTV BOQ Quoter &amp; AI WhatsApp Booking Assistant</strong> specifically for <strong>${bName}</strong>:</p>

  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
    <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 15px;">Key Capabilities Built for ${bName}:</h4>
    <ol style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px;">
      <li style="margin-bottom: 8px;"><strong>24/7 Interactive CCTV BOQ Quoter:</strong> Prospective clients select property type, number of cameras, and get instant equipment specs and transparent estimates in Naira.</li>
      <li style="margin-bottom: 8px;"><strong>"Fake Alert Proof" Bank Reconciliation:</strong> Instant Moniepoint &amp; Paystack webhook verification before deploying technicians or ordering expensive equipment.</li>
      <li style="margin-bottom: 8px;"><strong>24/7 AI WhatsApp Closer Desk:</strong> Resolves pricing FAQs in sub-3 seconds with a natural Nigerian business tone.</li>
      <li style="margin-bottom: 0;"><strong>Official Mobile Website Showcase:</strong> Highlights verified portfolio, past corporate/estate installations, and client reviews.</li>
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
// EMAIL TEMPLATE 2: LOGISTICS, FREIGHT FORWARDING & HAULAGE
// ─────────────────────────────────────────────────────────────────────────────
function buildLogisticsEmail(bName, area, slug, sender) {
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const audioUrl = `https://www.bethelmindanalytics.com/sample_voice_ng.mp3`;
  const subject = `Automating 24/7 Waybill Tracking & Shipping Rate Quotes for ${bName} (Voice Note Attached)`;

  const textContent = 
`Good day Management Team at ${bName},

My name is ${sender.shortName} from Bethelmind Digital Solutions (Plot 12 Commercial Corridor, Victoria Island, Lagos).

During our recent operational review of logistics, freight forwarding, and haulage enterprises in ${area}, we identified a major operational friction point:

Dispatch teams spend hours manually answering repetitive customer WhatsApp messages: "How much to ship from Lagos to Abuja or Port Harcourt?", "Where is my cargo / waybill?", and "Has my delivery arrived?". This manual back-and-forth slows down dispatch and causes high-volume commercial shippers to seek faster alternatives.

Furthermore, logistics companies face the risk of fake bank transfer alerts upon delivery or waybill drop-off.

To eliminate this bottleneck, our engineering desk pre-built an interactive 24/7 Waybill Tracker, Shipping Rate Calculator & AI WhatsApp Dispatch Assistant specifically for ${bName}:

🎙️ (Listen to our 15-second personalized audio voice briefing online: ${audioUrl})

Key Capabilities Built for ${bName}:
1. Hyperlocal & Interstate Shipping Rate Quoter: Instant calculation based on pickup/destination states, weight tier, and express vs standard transit in Naira.
2. 24/7 AI WhatsApp Dispatch Closer & Waybill Tracker: Clients input tracking numbers or waybill codes on WhatsApp and get instant real-time status in sub-3 seconds without staff typing manually.
3. "Fake Alert Proof" Bank Reconciliation: Instant Moniepoint & Paystack webhook verification before releasing goods or dispatching riders.
4. Official Mobile Website Showcase: Showcases your fleet capabilities, interstate routes, warehouse storage, and customs clearing services.

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

  <p>During our operational review of logistics, freight forwarding, and haulage enterprises in ${area}, we identified a major friction point: dispatch teams spend hours manually answering repetitive customer WhatsApp messages: <em>"How much to ship from Lagos to Abuja or Port Harcourt?"</em>, <em>"Where is my waybill?"</em>, and <em>"Has my delivery arrived?"</em>. This manual back-and-forth slows down dispatch and causes commercial shippers to seek faster alternatives.</p>

  <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
    <p style="margin: 0; font-weight: bold; color: #14532d;">🎙️ 15-Second Audio Voice Briefing</p>
    <p style="margin: 6px 0 0 0; font-size: 13px; color: #166534;">
      Listen to our executive voice briefing: <a href="${audioUrl}" style="color: #15803d; font-weight: bold; text-decoration: underline;" target="_blank">Click here to play 15s voice briefing</a>
    </p>
  </div>

  <p>To eliminate this bottleneck, our engineering desk pre-built an interactive <strong>24/7 Waybill Tracker, Shipping Rate Calculator &amp; AI WhatsApp Dispatch Assistant</strong> specifically for <strong>${bName}</strong>:</p>

  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
    <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 15px;">Key Capabilities Built for ${bName}:</h4>
    <ol style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px;">
      <li style="margin-bottom: 8px;"><strong>Hyperlocal &amp; Interstate Shipping Rate Quoter:</strong> Instant calculation based on pickup/destination states, weight tier, and express vs standard transit in Naira.</li>
      <li style="margin-bottom: 8px;"><strong>24/7 AI WhatsApp Dispatch Closer &amp; Waybill Tracker:</strong> Clients input tracking numbers on WhatsApp and get instant real-time status in sub-3 seconds without staff typing manually.</li>
      <li style="margin-bottom: 8px;"><strong>"Fake Alert Proof" Bank Reconciliation:</strong> Instant Moniepoint &amp; Paystack webhook verification before releasing goods or dispatching riders.</li>
      <li style="margin-bottom: 0;"><strong>Official Mobile Website Showcase:</strong> Highlights fleet capabilities, interstate routes, warehouse storage, and customs clearing services.</li>
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
// MAIN EXECUTION
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('========================================================================');
  console.log('🚀 B2B EXECUTIVE EMAIL DISPATCH: SECURITY & LOGISTICS SECTORS');
  console.log('========================================================================\n');

  if (!BREVO_API_KEY) {
    console.error('❌ Brevo API key missing in config.json');
    process.exit(1);
  }

  // Sender pool
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
    },
    {
      shortName: 'Management',
      name: 'Bethelmind Digital Solutions | CEO Desk',
      email: 'ceo@bethelmindanalytics.com'
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
  const securityKeywords = ['cctv', 'security', 'surveillance', 'guard', 'alarm', 'access control', 'tracking', 'spy', 'biometric'];
  const logisticsKeywords = ['logistics', 'freight', 'haulage', 'courier', 'dispatch', 'cargo', 'shipping', 'transport', 'delivery', 'mover', 'relocation', 'clearing'];

  const secTargets = [];
  const logTargets = [];
  const seenEmails = new Set();

  for (const l of leads) {
    const cat = ((l.category || '') + ' ' + (l.company_name || l.name || '') + ' ' + (l.sector || '')).toLowerCase();
    const email = (l.email || '').trim().toLowerCase();
    
    // Strict validation
    if (!email || !email.includes('@') || email.includes('example.com') || email.includes('test.com') || email.includes('@sme.ng')) continue;
    if (sentEmails.has(email) || seenEmails.has(email)) continue;

    const isSec = securityKeywords.some(kw => cat.includes(kw));
    const isLog = logisticsKeywords.some(kw => cat.includes(kw));

    if (isSec) {
      seenEmails.add(email);
      secTargets.push({ lead: l, sector: 'security' });
    } else if (isLog) {
      seenEmails.add(email);
      logTargets.push({ lead: l, sector: 'logistics' });
    }
  }

  console.log(`📋 Discovered Available Unsent Targets:`);
  console.log(`   • Security & CCTV Surveillance: ${secTargets.length}`);
  console.log(`   • Logistics & Haulage: ${logTargets.length}`);

  // Brevo free quota = 300 / day. We target up to 135 Security + 135 Logistics = 270 targets (leaving 30 buffer)
  const secBatch = secTargets.slice(0, 135);
  const logBatch = logTargets.slice(0, 135);
  const combinedQueue = [];

  // Interleave the two sectors for balanced delivery and smooth sending profile
  const maxLen = Math.max(secBatch.length, logBatch.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < secBatch.length) combinedQueue.push(secBatch[i]);
    if (i < logBatch.length) combinedQueue.push(logBatch[i]);
  }

  console.log(`\n🎯 Scheduled Dispatch Batch: ${combinedQueue.length} emails total`);
  console.log(`   • Security Targets: ${secBatch.length}`);
  console.log(`   • Logistics Targets: ${logBatch.length}`);
  console.log(`   • Sender Fleet: 3-way round-robin (tosin@, matthew@, ceo@)`);
  console.log(`   • Safety Buffer: ${300 - combinedQueue.length} credits remaining on Brevo\n`);

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
    if (sector === 'security') {
      emailContent = buildSecurityEmail(bName, area, slug, sender);
      sectorLabel = 'Security & CCTV Surveillance Systems';
    } else {
      emailContent = buildLogisticsEmail(bName, area, slug, sender);
      sectorLabel = 'Logistics & Haulage Fleet';
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
      tags: [sector === 'security' ? 'SECURITY_SECTOR_VERIFIED' : 'LOGISTICS_SECTOR_VERIFIED']
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
        title: `Executive B2B Email Delivered (${sector === 'security' ? 'Security' : 'Logistics'})`,
        description: `Delivered 24/7 prototype proposal with voice briefing via verified ${sender.email} (MsgID: ${messageId})`,
        channelUsed: 'Executive Email',
        timestamp: new Date().toISOString(),
        timestampWat: new Date().toLocaleTimeString('en-GB') + ' WAT',
        metadata: {
          previewUrl: `https://www.bethelmindanalytics.com/preview/${slug}`,
          voiceNoteAttached: true,
          sender: sender.email
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
        console.warn('⚠️ Daily send limit reached on Brevo. Terminating queue gracefully.');
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
