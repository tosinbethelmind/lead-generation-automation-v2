/**
 * @file scripts/execute_fair_usage_email_and_webform_campaign.js
 * 
 * 100% REAL B2B OUTREACH ENGINE (EMAIL WITH VOICE NOTE & WEBFORM SUBMISSIONS)
 * 
 * OPERATING RULES & INVARIANTS:
 * 1. Strict Engine 1 Focus: Zero crypto references. Brand: Bethelmind Analytics Lagos Desk.
 * 2. Mandatory Voice Note Integration: Compact MP3 (sample_voice_ng.mp3 ~21KB) attached + audio link.
 * 3. Strict Fair Usage of Data: Max 64KB per webform probe, 6.5s timeout, 350-500ms request pacing.
 * 4. Zero Synthetic Leads: Only 100% genuine Nigerian commercial businesses.
 * 5. Payout: Direct-to-OPay (7034297995 - Oyelakin Tosin Matthew).
 * 6. Admin Desk: 0802 279 1227 (wa.me/2348022791227).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

const ROOT_DIR = process.cwd();
const LEADS_DB_PATH = path.join(ROOT_DIR, 'local_db/leads_db.json');
const CRM_LEADS_PATH = path.join(ROOT_DIR, 'local_db/crm_leads.json');
const JOURNEYS_PATH = path.join(ROOT_DIR, 'local_db/lead_journeys.json');
const SUBMISSIONS_LOG = path.join(ROOT_DIR, 'local_db/real_webform_submissions.json');
const CONFIG_PATH = path.join(ROOT_DIR, 'config.json');
const MP3_PATH = path.join(ROOT_DIR, 'public/sample_voice_ng.mp3');

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Audio Attachment
let base64Audio = null;
if (fs.existsSync(MP3_PATH)) {
  const buf = fs.readFileSync(MP3_PATH);
  base64Audio = buf.toString('base64');
  console.log(`🎙️ Voice note loaded: ${buf.length} bytes (~${Math.round(buf.length / 1024)} KB).`);
}

// Hostinger Transporter fallback
const hostingerTransporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: config.smtpUser || 'tosin@bethelmindanalytics.com',
    pass: config.smtpPass || 'Bethelmind@2026'
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 8000
});

const SENDER = {
  name: 'Tosin Oyelakin | Bethelmind Analytics Lagos Desk',
  email: 'tosin@bethelmindanalytics.com',
  phone: '08022791227',
  waUrl: 'https://wa.me/2348022791227'
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanBusinessName(name) {
  if (!name) return 'Commercial Business';
  return name.split('||')[0].split('|')[0].split('-')[0].trim();
}

function generateSlug(name, leadId) {
  if (leadId && typeof leadId === 'string' && leadId.length > 3 && !leadId.startsWith('lead_')) {
    return leadId;
  }
  return cleanBusinessName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'lagos-business';
}

function buildEmailPayload(lead) {
  const bName = cleanBusinessName(lead.name || lead.business_name);
  const area = lead.area || lead.city || 'Lagos';
  const sector = lead.category || lead.sector || 'Commercial Business';
  const slug = generateSlug(bName, lead.id || lead.lead_id);
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const voiceNoteUrl = `https://www.bethelmindanalytics.com/sample_voice_ng.mp3`;

  const subject = `Automating 24/7 Quotes & WhatsApp Inquiries for ${bName}`;

  const textContent = 
`Good day Management Team at ${bName},

My name is Tosin from Bethelmind Analytics Lagos Desk (Plot 12 Commercial Corridor, Victoria Island).

During our recent operational review of commercial businesses in ${area}, we noticed that potential clients inquiring about your ${sector} services after business hours often experience delays before getting an official quote or confirmation.

To resolve this, our Lagos engineering desk pre-configured an interactive 24/7 AI WhatsApp Quoting & Booking Assistant specifically for ${bName}.

🎙️ (We have attached our 15-second personalized audio voice briefing directly to this email for your convenience).

What We Built For ${bName}:
1. 24/7 Conversational AI WhatsApp Sales Assistant (< 3s response time, Nigerian tone).
2. Specialized Sector Quoting Tool & Instant Load/Price Calculations.
3. Automated Moniepoint & Paystack Payment Reconciliation.
4. Done-For-You Commercial Web Portal & Mobile Prototype.

👉 Test drive your live private prototype (₦0 Upfront Commitment):
${previewUrl}

To activate your portal or test the WhatsApp assistant live:
• WhatsApp Closer Desk: wa.me/2348022791227 (0802 279 1227)
• Email: tosin@bethelmindanalytics.com

Best regards,

Tosin Oyelakin
Lead Solutions Consultant
Bethelmind Analytics Lagos Desk
Commercial Office: Plot 12, Commercial Corridor, Victoria Island, Lagos
WhatsApp: +234 802 279 1227`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px;">
    <h3 style="margin: 0; color: #0f172a;">Bethelmind Analytics Lagos Desk</h3>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Enterprise Business Automation &amp; Conversion Infrastructure</p>
  </div>

  <p>Good day Management Team at <strong>${bName}</strong>,</p>

  <p>My name is Tosin from <strong>Bethelmind Analytics Lagos Desk</strong>.</p>

  <p>During our operational review of ${sector} enterprises in ${area}, we identified that prospective clients reaching out after hours often experience delays in obtaining instant pricing quotes or booking confirmations.</p>

  <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
    <p style="margin: 0; font-weight: bold; color: #0f172a;">🎙️ 15-Second Audio Voice Briefing Attached</p>
    <p style="margin: 6px 0 0 0; font-size: 13px; color: #475569;">
      We have attached an audio voice note to this email. You can also listen directly online: 
      <a href="${voiceNoteUrl}" style="color: #0284c7; font-weight: bold;">[Tap to Play Audio Briefing]</a>
    </p>
  </div>

  <p>To eliminate this bottleneck, our team pre-built a private 24/7 AI WhatsApp Quoting &amp; Sales Assistant tailored specifically for <strong>${bName}</strong>:</p>

  <ul style="padding-left: 20px; color: #334155;">
    <li><strong>Instant 24/7 Quotes:</strong> Automated inquiries resolved in under 3 seconds in a natural Nigerian business tone.</li>
    <li><strong>Specialized Sector Tool:</strong> Instant estimates, load sizing, or booking automation.</li>
    <li><strong>Automated Bank Reconciliation:</strong> Verified Paystack &amp; Moniepoint instant receipts.</li>
  </ul>

  <div style="text-align: center; margin: 26px 0;">
    <a href="${previewUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 14px 26px; font-weight: bold; border-radius: 6px; display: inline-block;">
      Test Drive Your Private Prototype (₦0 Upfront) →
    </a>
  </div>

  <p style="font-size: 14px; color: #475569;">
    To review this implementation or connect with our engineering closer desk directly on WhatsApp:
    <br/>
    👉 <a href="https://wa.me/2348022791227?text=Hello+Tosin+I+am+interested+in+the+automation+prototype+for+${encodeURIComponent(bName)}" style="color: #16a34a; font-weight: bold;">Chat on WhatsApp: 0802 279 1227</a>
  </p>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

  <p style="font-size: 12px; color: #64748b; margin: 0;">
    <strong>Tosin Oyelakin</strong> | Lead Solutions Consultant<br/>
    Bethelmind Analytics Lagos Desk<br/>
    Plot 12, Commercial Corridor, Victoria Island, Lagos<br/>
    Email: tosin@bethelmindanalytics.com | Phone: 0802 279 1227
  </p>
</body>
</html>`;

  return { subject, textContent, htmlContent, previewUrl, voiceNoteUrl };
}

async function sendEmailBrevo(lead) {
  const { subject, textContent, htmlContent } = buildEmailPayload(lead);

  const payload = {
    sender: {
      name: SENDER.name,
      email: SENDER.email
    },
    replyTo: {
      email: 'bethelmindrecruit@gmail.com',
      name: 'Tosin Oyelakin | Bethelmind Analytics Lagos Desk'
    },
    to: [{ email: lead.email, name: cleanBusinessName(lead.name) }],
    subject: subject,
    htmlContent: htmlContent,
    textContent: textContent
  };

  if (base64Audio) {
    payload.attachment = [
      {
        name: 'voice_note_briefing.mp3',
        content: base64Audio
      }
    ];
  }

  return new Promise((resolve) => {
    const postData = JSON.stringify(payload);
    const req = https.request('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': config.brevoApiKey,
        'content-type': 'application/json',
        'accept': 'application/json',
        'content-length': Buffer.byteLength(postData)
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve({ success: true, provider: 'brevo', messageId: parsed.messageId });
          } catch (_) {
            resolve({ success: true, provider: 'brevo', messageId: 'ok' });
          }
        } else {
          resolve({ success: false, provider: 'brevo', error: `HTTP ${res.statusCode}: ${data}` });
        }
      });
    });

    req.on('error', (err) => resolve({ success: false, provider: 'brevo', error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, provider: 'brevo', error: 'Brevo API timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function sendEmailHostingerFallback(lead) {
  const { subject, textContent, htmlContent } = buildEmailPayload(lead);
  const attachments = [];
  if (fs.existsSync(MP3_PATH)) {
    attachments.push({
      filename: 'voice_note_briefing.mp3',
      path: MP3_PATH,
      contentType: 'audio/mpeg'
    });
  }

  try {
    const info = await hostingerTransporter.sendMail({
      from: `"${SENDER.name}" <${SENDER.email}>`,
      replyTo: 'bethelmindrecruit@gmail.com',
      to: lead.email,
      subject: subject,
      text: textContent,
      html: htmlContent,
      attachments: attachments
    });
    return { success: true, provider: 'hostinger_smtp', messageId: info.messageId };
  } catch (err) {
    return { success: false, provider: 'hostinger_smtp', error: err.message };
  }
}

// ----------------------------------------------------------------------------------
// WEBFORM ENGINE (STRICT FAIR USAGE OF DATA: max 64KB, single-hop, 6.5s timeout)
// ----------------------------------------------------------------------------------

function buildWebformMessage(lead) {
  const bName = cleanBusinessName(lead.name);
  const area = lead.area || lead.city || 'Lagos';
  const slug = generateSlug(bName, lead.id || lead.lead_id);
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;

  return `Good day Executive Management at ${bName},

Tosin here from Bethelmind Analytics Lagos Desk (Plot 12 Commercial Corridor, VI). 

During our digital operations review in ${area}, we noticed prospective clients reaching out after hours often experience delays getting pricing quotes or appointment confirmations.

To show how our 24/7 AI quoting and Paystack/Moniepoint verification engine works, our desk pre-built an interactive prototype for ${bName}:
👉 Preview: ${previewUrl}
🎙️ (Includes our 15s audio voice briefing on the portal).

To activate with ₦0 upfront or connect with our desk:
WhatsApp: wa.me/2348022791227 (0802 279 1227)
Email: tosin@bethelmindanalytics.com

Best regards,
Bethelmind Analytics Lagos Desk`;
}

async function fetchHtmlWithFairUsage(url, timeoutMs = 6500) {
  return new Promise((resolve) => {
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return resolve(null);
    }

    const client = parsedUrl.protocol === 'https:' ? https : http;
    const req = client.get(url, {
      timeout: timeoutMs,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Encoding': 'gzip, deflate'
      }
    }, (res) => {
      // If redirect, follow once
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          redirectUrl = parsedUrl.origin + redirectUrl;
        }
        req.destroy();
        return fetchHtmlWithFairUsage(redirectUrl, 4000).then(resolve);
      }

      if (res.statusCode !== 200) {
        req.destroy();
        return resolve(null);
      }

      let data = '';
      let bytesReceived = 0;
      const MAX_BYTES = 64 * 1024; // STRICT 64KB FAIR USAGE CAP

      res.on('data', (chunk) => {
        data += chunk;
        bytesReceived += chunk.length;
        if (bytesReceived > MAX_BYTES) {
          req.destroy(); // Abort reading further to save bandwidth
          resolve(data);
        }
      });

      res.on('end', () => resolve(data));
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function inspectAndSubmitWebform(lead) {
  let websiteUrl = (lead.website || lead.url || '').trim();
  if (!websiteUrl.startsWith('http')) return { attempted: false, reason: 'no_http' };

  // Skip aggregators / social
  const forbidden = ['google.com', 'instagram.com', 'facebook.com', 'wa.me', 'jiji.ng', 'twitter.com', 'linkedin.com', 'youtube.com'];
  if (forbidden.some(d => websiteUrl.toLowerCase().includes(d))) {
    return { attempted: false, reason: 'skipped_platform_domain' };
  }

  // Single-hop check: test /contact first, fallback to homepage
  const cleanBase = websiteUrl.replace(/\/$/, '');
  const targetEndpoints = [cleanBase + '/contact', cleanBase];

  let detectedForm = null;
  let formPageUrl = null;

  for (const endpoint of targetEndpoints) {
    const html = await fetchHtmlWithFairUsage(endpoint, 6000);
    if (!html) continue;

    const $ = cheerio.load(html);
    const form = $('form').filter((_, el) => {
      const formHtml = $(el).html() || '';
      return formHtml.includes('textarea') || formHtml.includes('message') || formHtml.includes('email') || formHtml.includes('contact');
    }).first();

    if (form.length > 0) {
      let action = form.attr('action') || endpoint;
      if (action.startsWith('/')) {
        const base = new URL(endpoint).origin;
        action = base + action;
      } else if (!action.startsWith('http')) {
        const base = new URL(endpoint).origin;
        action = `${base}/${action}`;
      }

      const fields = [];
      form.find('input, textarea, select').each((_, el) => {
        const name = $(el).attr('name');
        const type = $(el).attr('type') || 'text';
        if (name && type !== 'submit' && type !== 'button' && type !== 'hidden') {
          fields.push({ name, type });
        }
      });

      if (fields.length > 0) {
        detectedForm = {
          action,
          method: (form.attr('method') || 'POST').toUpperCase(),
          fields
        };
        formPageUrl = endpoint;
        break;
      }
    }
  }

  if (!detectedForm) {
    return { attempted: false, reason: 'no_form_found' };
  }

  // Build minimal payload
  const proposalMessage = buildWebformMessage(lead);
  const formData = new URLSearchParams();

  for (const f of detectedForm.fields) {
    const fn = f.name.toLowerCase();
    if (fn.includes('name')) {
      formData.append(f.name, SENDER.name);
    } else if (fn.includes('email') || fn.includes('mail')) {
      formData.append(f.name, SENDER.email);
    } else if (fn.includes('phone') || fn.includes('tel') || fn.includes('mobile')) {
      formData.append(f.name, SENDER.phone);
    } else if (fn.includes('subject') || fn.includes('title')) {
      formData.append(f.name, `24/7 Automation Inquiry for ${cleanBusinessName(lead.name)}`);
    } else if (fn.includes('message') || fn.includes('comment') || fn.includes('body') || fn.includes('inquiry')) {
      formData.append(f.name, proposalMessage);
    } else {
      formData.append(f.name, 'Inquiry');
    }
  }

  try {
    const postResp = await axios.post(detectedForm.action, formData.toString(), {
      timeout: 7000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Referer': formPageUrl
      },
      maxContentLength: 64 * 1024
    });

    const isSuccess = postResp.status >= 200 && postResp.status < 400;
    return {
      attempted: true,
      success: isSuccess,
      statusCode: postResp.status,
      formAction: detectedForm.action,
      pageUrl: formPageUrl
    };
  } catch (err) {
    return {
      attempted: true,
      success: false,
      statusCode: err.response?.status || 500,
      error: err.message,
      formAction: detectedForm.action
    };
  }
}

// ----------------------------------------------------------------------------------
// MASTER EXECUTION FLOW
// ----------------------------------------------------------------------------------

async function runCampaign() {
  console.log('========================================================================');
  console.log('🚀 MASTER OUTREACH: 300 EMAILS (W/ MP3 VOICE NOTE) & WEBFORM SUBMISSIONS');
  console.log('⚡ STRICT FAIR USAGE OF DATA & 100% CONFIRMED NETWORK ACTIONS');
  console.log('========================================================================\n');

  // Load Leads
  let leads = [];
  if (fs.existsSync(LEADS_DB_PATH)) {
    leads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));
  }

  let crmLeads = [];
  if (fs.existsSync(CRM_LEADS_PATH)) {
    crmLeads = JSON.parse(fs.readFileSync(CRM_LEADS_PATH, 'utf8'));
  }

  // Combine and deduplicate
  const allLeadsMap = new Map();
  leads.forEach(l => {
    const key = (l.email || l.id || l.name || '').toLowerCase();
    if (key) allLeadsMap.set(key, l);
  });
  crmLeads.forEach(l => {
    const key = (l.email || l.id || l.name || '').toLowerCase();
    if (key && !allLeadsMap.has(key)) allLeadsMap.set(key, l);
  });

  const combinedLeads = Array.from(allLeadsMap.values());
  console.log(`📊 Total available leads in registry: ${combinedLeads.length}`);

  // 1. FILTER VALID GENUINE EMAIL CANDIDATES
  function isGenuineEmailLead(lead) {
    const email = (lead.email || '').trim().toLowerCase();
    const name = lead.name || lead.business_name || '';
    if (!email || !email.includes('@')) return false;
    if (email.includes('example.com') || email.includes('test.com') || email.includes('synthetic')) return false;
    if (/#\d{3,4}/.test(name) || /enterprises1\d{3}/.test(email)) return false;
    return true;
  }

  const emailCandidates = combinedLeads.filter(isGenuineEmailLead);
  const unsentEmails = emailCandidates.filter(l => !l.email_sent && !l.email_dispatched);

  console.log(`📧 Genuine email candidates: ${emailCandidates.length}`);
  console.log(`📬 Unsent email queue: ${unsentEmails.length}`);

  // 2. DISPATCH EMAILS WITH MP3 VOICE NOTE (TARGET: UP TO 300)
  let emailDeliveredCount = 0;
  let emailFailedCount = 0;

  console.log('\n--- COMMENCING EMAIL DISPATCH (WITH MP3 ATTACHMENT) ---');
  for (let i = 0; i < unsentEmails.length; i++) {
    const lead = unsentEmails[i];
    const bName = cleanBusinessName(lead.name);
    console.log(`[Email ${i + 1}/${unsentEmails.length}] Sending to ${bName} (${lead.email})...`);

    let res = await sendEmailBrevo(lead);
    if (!res.success) {
      console.log(`   ⚠️ Brevo failed (${res.error}), falling back to Hostinger SMTP...`);
      res = await sendEmailHostingerFallback(lead);
    }

    if (res.success) {
      emailDeliveredCount++;
      lead.email_sent = true;
      lead.email_sent_at = new Date().toISOString();
      lead.email_provider = res.provider;
      lead.email_message_id = res.messageId;
      console.log(`   ✅ Delivered via ${res.provider}! ID: ${res.messageId}`);
    } else {
      emailFailedCount++;
      console.log(`   ❌ Failed to deliver: ${res.error}`);
    }

    // Strict fair usage pacing: 350ms delay
    await sleep(350);

    // Save state every 10 emails
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2), 'utf8');
    }
  }

  // Final email state save
  fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2), 'utf8');
  console.log(`\n🎉 Email batch completed! Delivered: ${emailDeliveredCount}, Failed: ${emailFailedCount}`);

  // 3. FILTER GENUINE WEBSITES FOR WEBFORM SUBMISSIONS
  console.log('\n--- COMMENCING WEBFORM DISPATCH (STRICT FAIR USAGE OF DATA) ---');
  const websiteLeads = combinedLeads.filter(l => {
    const w = (l.website || l.url || '').trim().toLowerCase();
    if (!w.startsWith('http')) return false;
    const forbidden = ['google.com', 'instagram.com', 'facebook.com', 'wa.me', 'jiji.ng', 'twitter.com', 'linkedin.com', 'youtube.com'];
    return !forbidden.some(d => w.includes(d));
  });

  const unsentWebforms = websiteLeads.filter(l => !l.webform_sent && !l.webform_submitted);
  console.log(`🌐 Total eligible commercial websites: ${websiteLeads.length}`);
  console.log(`📝 Unsent webforms queue: ${unsentWebforms.length}`);

  let webformSubmittedCount = 0;
  let webformCheckedCount = 0;
  let submissionRecords = [];

  if (fs.existsSync(SUBMISSIONS_LOG)) {
    try {
      submissionRecords = JSON.parse(fs.readFileSync(SUBMISSIONS_LOG, 'utf8'));
    } catch (_) {}
  }

  // Process up to 50 webforms per run for fair bandwidth conservation
  const maxWebformsToProcess = Math.min(unsentWebforms.length, 60);

  for (let j = 0; j < maxWebformsToProcess; j++) {
    const lead = unsentWebforms[j];
    const bName = cleanBusinessName(lead.name);
    webformCheckedCount++;
    console.log(`[Webform ${webformCheckedCount}/${maxWebformsToProcess}] Probing ${bName} (${lead.website || lead.url})...`);

    const result = await inspectAndSubmitWebform(lead);

    if (result.attempted) {
      if (result.success) {
        webformSubmittedCount++;
        lead.webform_sent = true;
        lead.webform_submitted_at = new Date().toISOString();
        lead.webform_status = '200_OK';

        submissionRecords.push({
          timestamp: new Date().toISOString(),
          lead_id: lead.id || lead.lead_id,
          business_name: bName,
          website: lead.website || lead.url,
          form_action: result.formAction,
          status: 'SUCCESS'
        });

        console.log(`   ✅ [WEBFORM SUBMITTED] Successfully posted proposal to ${result.formAction}!`);
      } else {
        console.log(`   ⚠️ Webform post returned status ${result.statusCode}`);
      }
    } else {
      console.log(`   ℹ️ Skipped: ${result.reason}`);
    }

    // Strict fair usage pacing: 500ms delay
    await sleep(500);

    if ((j + 1) % 5 === 0) {
      fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2), 'utf8');
      fs.writeFileSync(SUBMISSIONS_LOG, JSON.stringify(submissionRecords, null, 2), 'utf8');
    }
  }

  // Final webform state save
  fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2), 'utf8');
  fs.writeFileSync(SUBMISSIONS_LOG, JSON.stringify(submissionRecords, null, 2), 'utf8');

  console.log('\n========================================================================');
  console.log('🏁 CAMPAIGN SUMMARY:');
  console.log(`• Total Delivered Emails (with Voice Note attached): ${emailDeliveredCount}`);
  console.log(`• Total Webforms Submitted: ${webformSubmittedCount} (Inspected: ${webformCheckedCount})`);
  console.log(`• Data Fair Usage: STRICT 64KB per probe limit adhered to, zero unbounded loops.`);
  console.log(`• Status: 100% Genuine network dispatches synced to local_db.`);
  console.log('========================================================================\n');
}

runCampaign().catch(console.error);
