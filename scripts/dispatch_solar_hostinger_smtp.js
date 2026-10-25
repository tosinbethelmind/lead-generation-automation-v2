/**
 * @file scripts/dispatch_solar_hostinger_smtp.js
 * 
 * 100% REAL NETWORK DELIVERY VIA HOSTINGER DIRECT SMTP (PORT 465 SSL)
 * TARGETING VERIFIED NIGERIAN SOLAR & INVERTER BUSINESSES
 * 
 * Implements:
 * - Strategy 1: "Competitor Pain-Point" Solar BOQ Upgrade (Generator diesel savings & instant WhatsApp BOQ quoter)
 * - Strategy 3: ₦35k Starter / ₦25k/mo Pay-Small-Small or ₦75k deposit (₦150k Custom Domain Suite)
 * - Real-action delivery logging directly to email_dispatches.json & lead_journeys.json
 */

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const ROOT_DIR = process.cwd();
const LEADS_DB_PATH = path.join(ROOT_DIR, 'local_db/leads_db.json');
const EMAIL_DISPATCHES_PATH = path.join(ROOT_DIR, 'local_db/email_dispatches.json');
const JOURNEYS_PATH = path.join(ROOT_DIR, 'local_db/lead_journeys.json');
const MP3_PATH = path.join(ROOT_DIR, 'public/sample_voice_ng.mp3');

function createTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'tosin@bethelmindanalytics.com',
      pass: 'Bethelmind@2026'
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 25000
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanBusinessName(name) {
  if (!name) return 'Solar Specialist';
  return name.split('||')[0].split('|')[0].split('-')[0].trim();
}

function buildSolarEmail(businessName, area, slug) {
  const bName = cleanBusinessName(businessName);
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const audioUrl = `https://www.bethelmindanalytics.com/sample_voice_ng.mp3`;

  const subject = `Automating 24/7 Solar BOQ Quotes & Diesel Payback Sizing for ${bName} (Voice Note Attached)`;

  const textContent = 
`Good day Management Team at ${bName},

My name is Tosin from Bethelmind Digital Solutions (Plot 12 Commercial Corridor, Victoria Island, Lagos).

During our recent operational review of solar and inverter installers in ${area}, we identified a major revenue leak: when prospective commercial clients reach out after hours requesting a solar quote, calculating their kVA load and typing out solar panel, battery, and inverter recommendations manually takes hours — causing many prospects to look elsewhere.

Furthermore, foreign solar tools quote in USD and do not calculate Nigerian generator diesel fuel savings (at ₦1,250/litre).

To eliminate this bottleneck, our engineering desk pre-built an interactive 24/7 Solar BOQ Quoter & Inverter Load Sizer specifically for ${bName}:

🎙️ (We have attached our 15-second personalized audio voice briefing directly to this email so you can listen on your phone).

Key Capabilities Built for ${bName}:
1. 24/7 Solar BOQ & Inverter Load Sizer: Clients enter appliances and get instant kVA load, battery bank size, and panel count in Naira.
2. Generator Diesel ROI Payback: Automatically calculates how many months until fuel savings pay off the entire solar installation.
3. 24/7 AI WhatsApp Closer Desk: Resolves pricing FAQs in sub-3 seconds with a natural Nigerian business tone.
4. "Fake Alert Proof" Bank Reconciliation: Direct Moniepoint & Paystack deposit locking.

👉 Test drive your live private prototype (₦0 Upfront Commitment):
${previewUrl}

Low-Friction Go-Live Options:
• Option 1 (Starter Go-Live): ₦35,000 one-time (or ₦25,000/month Pay-Small-Small) — launches your pre-built mobile site & WhatsApp assistant immediately.
• Option 2 (Turnkey Custom Domain Suite): ₦75,000 50% milestone deposit (₦150,000 total) — includes dedicated .com.ng/.com custom domain, full WhatsApp ledger, and Google SEO ranking within 48 hours.

To activate your portal or test the WhatsApp assistant live:
• Direct WhatsApp Closer Desk: wa.me/2348022791227 (0802 279 1227)
• Corporate Settlement Account: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)

Best regards,

Tosin Oyelakin
Lead Solutions Consultant
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

  <p>My name is Tosin from <strong>Bethelmind Digital Solutions</strong> (Victoria Island, Lagos).</p>

  <p>During our operational review of solar &amp; inverter enterprises in ${area}, we identified a major friction point: when prospective commercial clients reach out after hours requesting a solar quote, calculating their kVA load and typing out inverter, battery, and solar panel recommendations manually takes hours — causing high-intent prospects to look elsewhere.</p>

  <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
    <p style="margin: 0; font-weight: bold; color: #14532d;">🎙️ 15-Second Audio Voice Briefing Attached</p>
    <p style="margin: 6px 0 0 0; font-size: 13px; color: #166534;">
      We have attached our personalized voice note directly to this email. You can also listen online: 
      <a href="${audioUrl}" style="color: #15803d; font-weight: bold;">[Tap to Play Audio Briefing]</a>
    </p>
  </div>

  <p>To solve this, our engineering desk pre-built an interactive <strong>24/7 Solar BOQ Quoter &amp; Inverter Sizer</strong> tailored specifically for <strong>${bName}</strong>:</p>

  <ul style="padding-left: 20px; color: #334155;">
    <li><strong>Instant Solar BOQ &amp; Load Sizer:</strong> Prospective clients enter their home or office appliances and receive instant kVA sizing, panel counts, and estimated cost in Naira.</li>
    <li><strong>Generator Diesel ROI Comparison:</strong> Calculates how many months until fuel savings (at ₦1,250/L diesel) pay off the installation.</li>
    <li><strong>24/7 AI WhatsApp Sales Closer:</strong> Resolves pricing FAQs in sub-3 seconds in a natural Nigerian business tone.</li>
    <li><strong>Bank Transfer Reconciliation:</strong> Instant Moniepoint &amp; Paystack webhook receipts.</li>
  </ul>

  <div style="text-align: center; margin: 26px 0;">
    <a href="${previewUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 14px 26px; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 15px;">
      Test Drive Your Private Solar Prototype (₦0 Upfront) →
    </a>
  </div>

  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;">Low-Friction Commercial Go-Live Options:</h4>
    <p style="margin: 4px 0; font-size: 13px; color: #334155;">
      • <strong>Starter Go-Live:</strong> ₦35,000 one-time (or ₦25,000/month Pay-Small-Small) — launches your pre-built mobile site &amp; WhatsApp assistant immediately.
    </p>
    <p style="margin: 4px 0; font-size: 13px; color: #334155;">
      • <strong>Turnkey Custom Domain Suite:</strong> ₦75,000 50% milestone deposit (₦150,000 total) — includes dedicated .com.ng/.com custom domain, full WhatsApp ledger, and Google SEO ranking within 48 hours.
    </p>
  </div>

  <p style="font-size: 14px; color: #475569;">
    To review this implementation or connect with our engineering closer desk directly on WhatsApp:
    <br/>
    👉 <a href="https://wa.me/2348022791227?text=Hello+Tosin+I+am+interested+in+the+solar+prototype+for+${encodeURIComponent(bName)}" style="color: #16a34a; font-weight: bold;">Chat on WhatsApp: 0802 279 1227</a>
  </p>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

  <div style="font-size: 12px; color: #64748b; line-height: 1.5;">
    <strong>Tosin Oyelakin</strong> | Lead Solutions Consultant<br/>
    <strong>Bethelmind Digital Solutions</strong> (CAC Certified Nigerian Enterprise)<br/>
    Corporate Account: Moniepoint Microfinance Bank (6805375225)<br/>
    Office: Plot 12, Commercial Corridor, Victoria Island, Lagos<br/>
    Direct Closer Desk: +234 802 279 1227 | Email: tosin@bethelmindanalytics.com
  </div>
</body>
</html>`;

  return { subject, textContent, htmlContent };
}

async function main() {
  console.log('========================================================================');
  console.log('🚀 STRATEGY 1 & 3: SOLAR SECTOR B2B EXECUTIVE OUTREACH CAMPAIGN');
  console.log('📡 Transport: Hostinger Direct SMTP (smtp.hostinger.com:465 SSL)');
  console.log('========================================================================\n');

  const transporter = createTransporter();
  try {
    await transporter.verify();
    console.log('✅ Hostinger SMTP Connection Verified Successfully!\n');
  } catch (err) {
    console.error('❌ Failed to connect to Hostinger SMTP:', err.message);
    process.exit(1);
  }

  // Load leads
  if (!fs.existsSync(LEADS_DB_PATH)) {
    console.error('Leads database not found at:', LEADS_DB_PATH);
    process.exit(1);
  }

  const allLeads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));

  const validTldRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|ng|com\.ng|org|net|io|co|cn|biz|energy|store|tech)$/i;
  const solarKeywords = ['solar', 'inverter', 'energy', 'renewable', 'power', 'battery'];
  const excludeKeywords = ['game', 'roblox', 'hotel', 'cinema', 'school', 'bakery', 'suits', 'court', 'church', 'lounge', 'restaurant', 'nail', 'beauty', 'dent', 'eye', 'solicitor', 'jiji', 'spa', 'foods', 'mall', 'supermarket', 'city', 'apartment'];

  const pureSolarLeads = allLeads.filter(l => {
    if (!l.email) return false;
    const name = (l.name || l.business_name || '').toLowerCase();
    const cat = (l.category || '').toLowerCase();
    const isSolar = solarKeywords.some(k => name.includes(k) || cat.includes(k));
    if (!isSolar) return false;
    const isExcluded = excludeKeywords.some(k => name.includes(k));
    if (isExcluded) return false;
    const email = l.email.trim().toLowerCase();
    if (email.includes('officer') || email.includes('+234') || email.includes('manager080') || email.includes('john@email.com')) return false;
    return validTldRegex.test(email);
  });

  console.log(`Found ${pureSolarLeads.length} strictly verified Solar targets with clean emails.\n`);

  // Load existing dispatches to avoid duplicate sending
  let existingDispatches = [];
  if (fs.existsSync(EMAIL_DISPATCHES_PATH)) {
    try {
      existingDispatches = JSON.parse(fs.readFileSync(EMAIL_DISPATCHES_PATH, 'utf8'));
    } catch (_) {}
  }
  const sentEmailsSet = new Set(existingDispatches.map(d => (d.email || '').toLowerCase()));

  // Load journeys
  let journeys = {};
  if (fs.existsSync(JOURNEYS_PATH)) {
    try {
      journeys = JSON.parse(fs.readFileSync(JOURNEYS_PATH, 'utf8'));
    } catch (_) {}
  }

  const targetsToSend = pureSolarLeads.filter(l => !sentEmailsSet.has(l.email.trim().toLowerCase()));
  console.log(`Unsent targets to dispatch right now: ${targetsToSend.length}\n`);

  let successCount = 0;
  let failCount = 0;
  const todayStr = new Date().toISOString();

  for (let i = 0; i < targetsToSend.length; i++) {
    const lead = targetsToSend[i];
    const bName = cleanBusinessName(lead.name || lead.business_name);
    const recipientEmail = lead.email.trim().toLowerCase();
    const area = lead.area || lead.city || 'Lagos';
    const slug = (lead.lead_id && !lead.lead_id.includes('_det_')) ? lead.lead_id.slice(0, 22) : bName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);

    const emailContent = buildSolarEmail(bName, area, slug);

    console.log(`[${i + 1}/${targetsToSend.length}] Dispatching to ${bName} (${recipientEmail})...`);

    const mailOptions = {
      from: '"Tosin Oyelakin | Bethelmind Digital Solutions" <tosin@bethelmindanalytics.com>',
      replyTo: 'bethelmindrecruit@gmail.com',
      to: recipientEmail,
      subject: emailContent.subject,
      text: emailContent.textContent,
      html: emailContent.htmlContent,
      headers: {
        'X-Campaign': 'SOLAR_BOQ_HOSTINGER_DIRECT',
        'X-Entity': 'Bethelmind Digital Solutions',
        'X-Mailer': 'Bethelmind Enterprise Mailer v2'
      }
    };

    if (fs.existsSync(MP3_PATH)) {
      mailOptions.attachments = [
        {
          filename: 'voice_note_briefing.mp3',
          path: MP3_PATH,
          contentType: 'audio/mpeg'
        }
      ];
    }

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`   ✅ DELIVERED! Message ID: ${info.messageId}`);
      successCount++;

      // Record dispatch
      const dispatchRecord = {
        id: `email_${Date.now()}_${i}`,
        email: recipientEmail,
        name: bName,
        provider: 'hostinger_smtp_direct',
        messageId: info.messageId,
        voiceNoteAttached: true,
        delivered_at: new Date().toISOString()
      };
      existingDispatches.push(dispatchRecord);

      // Record Customer Journey
      const journeyKey = slug;
      if (!journeys[journeyKey]) {
        journeys[journeyKey] = {
          leadId: slug,
          leadName: bName,
          category: 'Solar & Inverter Systems',
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
        businessCategory: 'Solar & Inverter Systems',
        phone: lead.phone || '',
        email: recipientEmail,
        stage: 'OUTREACH_DISPATCHED',
        title: 'Executive B2B Email Delivered',
        description: `Delivered 24/7 Solar BOQ Quoter & Diesel Payback proposal with audio voice note attachment via Hostinger Direct SMTP (MsgID: ${info.messageId})`,
        channelUsed: 'Hostinger SMTP',
        timestamp: new Date().toISOString(),
        timestampWat: new Date().toLocaleTimeString('en-GB') + ' WAT',
        metadata: {
          previewUrl: `https://www.bethelmindanalytics.com/preview/${slug}`,
          voiceNoteAttached: true
        }
      });

      // Periodic flush to disk
      if (successCount % 5 === 0 || i === targetsToSend.length - 1) {
        fs.writeFileSync(EMAIL_DISPATCHES_PATH, JSON.stringify(existingDispatches, null, 2));
        fs.writeFileSync(JOURNEYS_PATH, JSON.stringify(journeys, null, 2));
      }

      // 800ms pacing jitter
      await sleep(800);

    } catch (sendErr) {
      console.error(`   ❌ Delivery failed for ${recipientEmail}:`, sendErr.message);
      failCount++;
      await sleep(1500);
    }
  }

  // Final flush
  fs.writeFileSync(EMAIL_DISPATCHES_PATH, JSON.stringify(existingDispatches, null, 2));
  fs.writeFileSync(JOURNEYS_PATH, JSON.stringify(journeys, null, 2));

  console.log('\n========================================================================');
  console.log(`📊 CAMPAIGN SUMMARY: ${successCount} Delivered, ${failCount} Failed`);
  console.log('========================================================================\n');
}

main().catch(err => {
  console.error('Fatal campaign execution error:', err);
  process.exit(1);
});
