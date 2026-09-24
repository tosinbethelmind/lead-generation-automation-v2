/**
 * @file scripts/harvest_and_dispatch_real_emails.js
 * 
 * High-Velocity B2B Email Harvester, DNS MX Validator & Outreach Dispatcher
 * Bethelmind Analytics Lagos Desk
 */

const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

const envLocal = dotenv.parse(fs.readFileSync('.env.local', 'utf8'));

const BREVO_API_KEY = envLocal.BREVO_API_KEY;
const SMTP_HOST = envLocal.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = parseInt(envLocal.SMTP_PORT || '587', 10);
const SMTP_USER = envLocal.SMTP_USER || 'tosin@bethelmindanalytics.com';
const SMTP_PASS = envLocal.SMTP_PASS || 'Bethelmind@2026';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
if (!fs.existsSync(LOCAL_DB)) fs.mkdirSync(LOCAL_DB, { recursive: true });

const LEADS_DB_PATH = path.join(LOCAL_DB, 'leads_db.json');
const ACTIVITIES_PATH = path.join(LOCAL_DB, 'activities.json');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 10000
});

async function verifyMxRecord(email) {
  try {
    const domain = email.split('@')[1];
    if (!domain || domain.includes('example.com') || domain.includes('test.com')) return false;
    const mx = await dns.resolveMx(domain);
    return mx && mx.length > 0;
  } catch (e) {
    return false;
  }
}

async function sendEmailViaBrevo(toEmail, toName, subject, htmlContent, textContent) {
  const url = 'https://api.brevo.com/v3/smtp/email';
  const payload = {
    sender: { name: 'Bethelmind Analytics Lagos Desk', email: 'tosin@bethelmindanalytics.com' },
    to: [{ email: toEmail, name: toName }],
    subject: subject,
    htmlContent: htmlContent,
    textContent: textContent,
    tags: ['B2B_EXECUTIVE_OUTREACH']
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo error (${res.status}): ${err}`);
  }

  return res.json();
}

async function sendEmailViaHostinger(toEmail, toName, subject, htmlContent, textContent) {
  return transporter.sendMail({
    from: '"Bethelmind Analytics Lagos Desk" <tosin@bethelmindanalytics.com>',
    to: `"${toName}" <${toEmail}>`,
    subject: subject,
    text: textContent,
    html: htmlContent
  });
}

function generateEmailContent(name, category, area, previewUrl) {
  const cleanName = name || 'Business Owner';
  const cleanCategory = category || 'Commercial Enterprise';
  const cleanArea = area || 'Lagos';

  const subject = `24/7 AI Sales & Instant Quoting Portal for ${cleanName}`;
  const textContent = `Good day Team at ${cleanName},

My name is Tosin Oyelakin from Bethelmind Analytics Lagos Desk.

We recently reviewed commercial operations in ${cleanArea} and noticed that potential customers reaching out after business hours often experience response delays before receiving formal quotes or pricing.

To solve this, our engineering desk has built a private 24/7 AI WhatsApp Sales & Quoting Prototype custom-configured for ${cleanName}:
${previewUrl}

Pre-installed Capabilities:
- 24/7 AI WhatsApp Sales Assistant (< 3s response time in professional Nigerian business tone)
- Automated Sector Quoting Engine (Instant Price Calculations & BOQ estimates)
- Instant Bank Transfer Verification (Paystack & Moniepoint automated payment reconciliation)

You can test drive the working prototype on your mobile phone for ₦0 upfront preview here:
${previewUrl}

To activate or discuss custom modifications for your workflow:
WhatsApp Desk: +234 802 279 1227 (Direct Link: https://wa.me/2348022791227)
Email: tosin@bethelmindanalytics.com

Best regards,
Tosin Oyelakin
Lead Solutions Strategist · Bethelmind Analytics Lagos Desk`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:20px; background-color:#0b1329; font-family:'Segoe UI', Arial, sans-serif; color:#f8fafc;">
  <div style="max-width:600px; margin:0 auto; background:#0f172a; border:1px solid #1e293b; border-radius:12px; overflow:hidden;">
    <div style="background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding:24px; text-align:center;">
      <div style="color:#e0f2fe; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">⚡ Bethelmind Analytics Lagos Desk</div>
      <h1 style="color:#ffffff; margin:0; font-size:20px; font-weight:800;">24/7 AI Quoting & Sales Portal</h1>
      <p style="color:#bae6fd; margin:6px 0 0 0; font-size:13px;">Custom Pre-Built Prototype for <strong>${cleanName}</strong></p>
    </div>
    <div style="padding:28px;">
      <p style="font-size:15px; color:#cbd5e1; line-height:1.6; margin-top:0;">Good day Team at <strong>${cleanName}</strong>,</p>
      <p style="font-size:14px; color:#cbd5e1; line-height:1.6;">We prepared a 24/7 automated WhatsApp sales & instant quoting prototype custom-configured for ${cleanName} in ${cleanArea}.</p>
      
      <div style="background:#1e293b; border-radius:8px; padding:16px; margin:20px 0;">
        <div style="font-size:13px; font-weight:700; color:#38bdf8; margin-bottom:8px;">🚀 Pre-Installed Features:</div>
        <ul style="margin:0; padding-left:20px; font-size:13px; color:#94a3b8; line-height:1.6;">
          <li>24/7 Instant AI WhatsApp Closer (&lt; 3s response in Nigerian tone)</li>
          <li>Custom Sector Quoting Engine with Instant PDF Estimates</li>
          <li>Automated Bank Transfer Verification (Paystack &amp; Moniepoint)</li>
        </ul>
      </div>

      <div style="text-align:center; margin:28px 0;">
        <a href="${previewUrl}" style="display:inline-block; background:linear-gradient(135deg, #0284c7, #2563eb); color:#ffffff; padding:14px 32px; border-radius:8px; font-weight:800; font-size:15px; text-decoration:none;">👉 Test Drive Your Live Prototype Online</a>
        <div style="font-size:12px; color:#64748b; margin-top:8px;">(100% Free ₦0 Upfront Review on your phone)</div>
      </div>
      <div style="border-top:1px solid #1e293b; padding-top:18px; margin-top:20px; font-size:13px; color:#94a3b8; line-height:1.6;">
        📱 <strong>WhatsApp Desk:</strong> <a href="https://wa.me/2348022791227" style="color:#38bdf8; text-decoration:none; font-weight:700;">+234 802 279 1227</a><br>
        📧 <strong>Email:</strong> <a href="mailto:tosin@bethelmindanalytics.com" style="color:#38bdf8; text-decoration:none;">tosin@bethelmindanalytics.com</a><br><br>
        <strong>Tosin Oyelakin</strong> · <em>Bethelmind Analytics Lagos Desk</em>
      </div>
    </div>
  </div>
</body>
</html>`;

  return { subject, textContent, htmlContent };
}

async function run() {
  console.log('========================================================================');
  console.log('🚀 BETHELMIND ANALYTICS: VALIDATING & DISPATCHING GENUINE B2B EMAILS');
  console.log('========================================================================\n');

  // Load existing leads
  let leads = [];
  try { leads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8')); } catch (_) {}
  const leadsList = Array.isArray(leads) ? leads : Object.values(leads);

  let activities = [];
  try { activities = JSON.parse(fs.readFileSync(ACTIVITIES_PATH, 'utf8')); } catch (_) {}

  // 1. Filter genuine uncontacted email leads
  const validCandidates = [];
  const seenEmails = new Set();

  for (const l of leadsList) {
    const em = (l.email || l.email_address || '').trim().toLowerCase();
    const name = (l.name || l.business_name || '').trim();
    if (em && em.includes('@') && !seenEmails.has(em) && !l.email_sent) {
      const isPattern = /freightimporter\d+|commercialsme\d+|solarcontractor\d+|buildingmaterials\d+|example\.com|test\.com|mock_/i.test(em) ||
                        /Hub #\d+|Premium (Salon|Dental|Auto|Restaurant|Real|Clinic) \d+/i.test(name);
      if (!isPattern) {
        seenEmails.add(em);
        validCandidates.push({
          id: l.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,
          name: name || 'Business Owner',
          email: em,
          category: l.category || 'Commercial Enterprise',
          area: l.area || l.city || 'Lagos',
          phone: l.phone || '08022791227',
          leadRef: l
        });
      }
    }
  }

  console.log(`📋 Found ${validCandidates.length} genuine uncontacted email candidates.`);

  // 2. DNS MX Record Verification & Safe Dispatching
  let sentCount = 0;
  let skippedMx = 0;
  const targetQuota = Math.min(300, validCandidates.length);

  for (let i = 0; i < validCandidates.length && sentCount < targetQuota; i++) {
    const candidate = validCandidates[i];

    const hasMx = await verifyMxRecord(candidate.email);
    if (!hasMx) {
      console.log(`[${i + 1}/${validCandidates.length}] ⚠️ Inactive MX for: ${candidate.email} (${candidate.name}). Skipped.`);
      skippedMx++;
      continue;
    }

    console.log(`[${i + 1}/${validCandidates.length}] 🚀 Sending to verified MX: ${candidate.email} (${candidate.name})...`);

    const slug = candidate.id || candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 25);
    const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
    const content = generateEmailContent(candidate.name, candidate.category, candidate.area, previewUrl);

    let delivered = false;
    let providerUsed = '';
    let messageId = '';

    // Primary: Brevo API v3
    try {
      const res = await sendEmailViaBrevo(candidate.email, candidate.name, content.subject, content.htmlContent, content.textContent);
      delivered = true;
      providerUsed = 'BREVO_API_V3';
      messageId = res.messageId || `brevo_${Date.now()}`;
      console.log(`   ✅ DELIVERED via Brevo API: ${candidate.email}`);
    } catch (brevoErr) {
      console.log(`   ⚠️ Brevo note (${brevoErr.message}). Attempting Hostinger SMTP fallback...`);
      try {
        const smtpRes = await sendEmailViaHostinger(candidate.email, candidate.name, content.subject, content.htmlContent, content.textContent);
        delivered = true;
        providerUsed = 'HOSTINGER_SMTP';
        messageId = smtpRes.messageId || `hostinger_${Date.now()}`;
        console.log(`   ✅ DELIVERED via Hostinger SMTP: ${candidate.email}`);
      } catch (smtpErr) {
        console.log(`   ❌ SMTP Failed: ${smtpErr.message}`);
      }
    }

    if (delivered) {
      sentCount++;
      if (candidate.leadRef) {
        candidate.leadRef.email_sent = true;
        candidate.leadRef.email_sent_at = new Date().toISOString();
        candidate.leadRef.email_provider = providerUsed;
      }
      candidate.email_sent = true;
      candidate.email_sent_at = new Date().toISOString();

      activities.push({
        id: `act_email_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        lead_id: candidate.id,
        channel: 'email',
        type: 'B2B_EMAIL_DISPATCH',
        details: content.subject,
        message_id: messageId,
        provider: providerUsed,
        recipient: candidate.email,
        verified: true,
        timestamp: new Date().toISOString()
      });

      // Save progressive updates
      if (sentCount % 5 === 0) {
        fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leadsList, null, 2), 'utf8');
        fs.writeFileSync(ACTIVITIES_PATH, JSON.stringify(activities, null, 2), 'utf8');
      }
    }

    // Deliverability throttle: 1 second per dispatch
    await new Promise(r => setTimeout(r, 1000));
  }

  // Final persistence
  fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leadsList, null, 2), 'utf8');
  fs.writeFileSync(ACTIVITIES_PATH, JSON.stringify(activities, null, 2), 'utf8');

  console.log('\n========================================================================');
  console.log('🎉 B2B EMAIL DISPATCH CYCLE COMPLETE');
  console.log(`• Total Emails Delivered : ${sentCount}`);
  console.log(`• Inactive MX Filtered   : ${skippedMx}`);
  console.log(`• Total Activities Logged: ${activities.length}`);
  console.log('========================================================================\n');

  try { transporter.close(); } catch (_) {}
}

run().catch(console.error);
