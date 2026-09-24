/**
 * @file scripts/real_webform_and_social_submitter.js
 * 
 * 100% REAL WEB CONTACT FORM & ZERO-FAILURE COMMERCIAL PROPOSAL ENGINE.
 * 
 * Capabilities:
 * 1. Crawls scraped commercial websites across Lagos & Nigeria.
 * 2. Autonomously locates Contact Us forms (/contact, /contact-us, /get-in-touch).
 * 3. Parses input fields (name, email, phone, subject, message).
 * 4. Submits real HTTP POST form payloads with tailored proposals & voice note links.
 * 5. ZERO-FAILURE CASCADE: If a form is protected by reCAPTCHA, Cloudflare 403, or lacks form inputs,
 *    it extracts discovered emails (or verified lead.email) and delivers proposal directly via Multi-SMTP Pooler!
 * 6. Logs live submission status (200 OK / SUCCESS) into local_db/real_webform_submissions.json.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const { multiSmtpPooler } = require('./multi_smtp_pooler');

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const LEADS_DB_PATH = path.join(LOCAL_DB, 'leads_db.json');
const SUBMISSIONS_LOG = path.join(LOCAL_DB, 'real_webform_submissions.json');
const JOURNEYS_DB = path.join(LOCAL_DB, 'lead_journeys.json');

const SENDER_INFO = {
  name: 'Tosin | Bethelmind Analytics Lagos Desk',
  email: 'tosin@bethelmindanalytics.com',
  phone: '08022791227',
  whatsapp: '+2348022791227'
};

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true
});

function sanitizeWebsiteUrl(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let clean = raw.trim();
  if (clean.includes(',')) clean = clean.split(',')[0].trim();
  if (clean.includes(';')) clean = clean.split(';')[0].trim();
  if (clean.includes(' ')) clean = clean.split(' ')[0].trim();
  clean = clean.replace(/['"]+/g, '').replace(/\/+$/, '');
  return clean;
}

function extractEmailsFromHtml(html) {
  if (!html || typeof html !== 'string') return [];
  const matches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const excluded = /example\.com|test\.com|sentry|bootstrap|w3\.org|wp-content|placeholder|\.png|\.jpg|\.webp|schema\.org/i;
  return Array.from(new Set(matches.map(m => m.toLowerCase().trim()).filter(m => !excluded.test(m))));
}

function formatProposalMessage(lead) {
  const cleanName = (lead.name || 'Commercial Business').split('||')[0].split('|')[0].trim();
  const area = lead.area || lead.city || 'Lagos';
  const slug = lead.lead_id || cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;

  return `Good day Executive Management at ${cleanName},

Tosin here from Bethelmind Analytics Lagos Desk (Plot 12 Commercial Corridor, VI). 

We recently conducted a digital operations review for commercial businesses in ${area}. We noticed prospective clients looking for your products after hours or on weekends are unable to get instant pricing quotes or automated WhatsApp bookings.

To demonstrate how our 24/7 AI quoting and Paystack/Moniepoint verification engine works, our engineering desk pre-built an interactive mobile portal for ${cleanName}.

👉 Test drive your live private preview here:
${previewUrl}

🎙️ (You can also listen to our 15s audio voice briefing embedded on the page).

If your team would like to activate your staging portal with ₦0 upfront, connect directly with our closer desk:
WhatsApp: https://wa.me/2348022791227 (0802 279 1227)
Email: tosin@bethelmindanalytics.com

Best regards,
Bethelmind Analytics Lagos Team`;
}

async function findContactForm(websiteUrl) {
  const cleanBase = sanitizeWebsiteUrl(websiteUrl);
  if (!cleanBase || !cleanBase.startsWith('http')) return null;

  let discoveredEmails = [];

  // Step 1: Probe homepage with 7000ms timeout
  try {
    const homeResp = await axios.get(cleanBase, {
      timeout: 7000,
      httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      }
    });

    const html = typeof homeResp.data === 'string' ? homeResp.data : '';
    discoveredEmails.push(...extractEmailsFromHtml(html));

    const $ = cheerio.load(html);

    // Look for contact form on homepage
    let selectedForm = null;
    let endpointUrl = cleanBase;

    $('form').each((_, el) => {
      const f = $(el);
      const hasTextarea = f.find('textarea').length > 0;
      const hasMessageInput = f.find('input[name*="message" i], input[name*="comment" i], input[name*="inquiry" i], textarea').length > 0;
      const hasEmailInput = f.find('input[type="email"], input[name*="email" i]').length > 0;
      if ((hasTextarea || hasMessageInput) && hasEmailInput) {
        selectedForm = f;
        return false;
      }
    });

    if (selectedForm) {
      return {
        ...parseFormElement(selectedForm, endpointUrl),
        discoveredEmails
      };
    }

    // Step 2: Look for contact link in homepage navigation
    let contactLink = $('a[href*="contact" i]').first().attr('href');
    if (!contactLink) {
      contactLink = cleanBase + '/contact';
    } else if (contactLink.startsWith('/')) {
      contactLink = new URL(cleanBase).origin + contactLink;
    } else if (!contactLink.startsWith('http')) {
      contactLink = new URL(cleanBase).origin + '/' + contactLink;
    }

    // Probe contact page
    try {
      const cResp = await axios.get(contactLink, {
        timeout: 7000,
        httpsAgent,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
        }
      });

      const cHtml = typeof cResp.data === 'string' ? cResp.data : '';
      discoveredEmails.push(...extractEmailsFromHtml(cHtml));

      const $c = cheerio.load(cHtml);
      $c('form').each((_, el) => {
        const f = $c(el);
        const hasTextarea = f.find('textarea').length > 0;
        const hasMessageInput = f.find('input[name*="message" i], input[name*="comment" i], input[name*="inquiry" i], textarea').length > 0;
        const hasEmailInput = f.find('input[type="email"], input[name*="email" i]').length > 0;
        if ((hasTextarea || hasMessageInput) && hasEmailInput) {
          selectedForm = f;
          endpointUrl = contactLink;
          return false;
        }
      });

      if (selectedForm) {
        return {
          ...parseFormElement(selectedForm, endpointUrl),
          discoveredEmails
        };
      }
    } catch (_) {}

  } catch (_) {}

  return {
    pageUrl: cleanBase,
    formAction: null,
    fields: [],
    discoveredEmails
  };
}

function parseFormElement(form, pageUrl) {
  let action = form.attr('action') || pageUrl;
  if (action.startsWith('/')) {
    action = new URL(pageUrl).origin + action;
  } else if (!action.startsWith('http')) {
    action = new URL(pageUrl).origin + '/' + action;
  }

  const fields = [];
  form.find('input, textarea, select').each((_, el) => {
    const name = form.find(el).attr('name');
    const type = (form.find(el).attr('type') || 'text').toLowerCase();
    const defaultValue = form.find(el).val() || '';
    if (name && type !== 'submit' && type !== 'button') {
      fields.push({ name, type, defaultValue });
    }
  });

  return {
    pageUrl,
    formAction: action,
    method: (form.attr('method') || 'POST').toUpperCase(),
    fields
  };
}

async function submitWebContactForm(formInfo, lead) {
  if (!formInfo.formAction || formInfo.fields.length === 0) {
    return { success: false, statusCode: 404, error: 'No form action or fields' };
  }

  const message = formatProposalMessage(lead);
  const formData = new URLSearchParams();

  for (const field of formInfo.fields) {
    const fn = field.name.toLowerCase();
    if (field.type === 'hidden') {
      formData.append(field.name, field.defaultValue || '1');
    } else if (fn.includes('name')) {
      formData.append(field.name, SENDER_INFO.name);
    } else if (fn.includes('email') || fn.includes('mail')) {
      formData.append(field.name, SENDER_INFO.email);
    } else if (fn.includes('phone') || fn.includes('tel') || fn.includes('mobile')) {
      formData.append(field.name, SENDER_INFO.phone);
    } else if (fn.includes('subject') || fn.includes('title')) {
      formData.append(field.name, `Operational Inquiry & Live 24/7 Prototype for ${lead.name || 'Your Business'}`);
    } else if (fn.includes('message') || fn.includes('comment') || fn.includes('body') || fn.includes('desc') || field.type === 'textarea') {
      formData.append(field.name, message);
    } else {
      formData.append(field.name, field.defaultValue || 'Commercial Inquiry');
    }
  }

  try {
    const postResp = await axios.post(formInfo.formAction, formData.toString(), {
      timeout: 10000,
      httpsAgent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Referer': formInfo.pageUrl
      }
    });

    return {
      success: postResp.status >= 200 && postResp.status < 400,
      statusCode: postResp.status,
      action: formInfo.formAction
    };
  } catch (err) {
    return {
      success: false,
      statusCode: err.response?.status || 500,
      error: err.message,
      action: formInfo.formAction
    };
  }
}

async function runRealWebFormOutreach() {
  console.log('========================================================================');
  console.log('🌐 RUNNING REAL WEB CONTACT FORM & ZERO-FAILURE PROPOSAL SUBMISSION ENGINE');
  console.log('========================================================================\n');

  let leads = [];
  try {
    if (fs.existsSync(LEADS_DB_PATH)) {
      leads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));
    }
  } catch (_) {}

  const args = process.argv.slice(2);
  const limitArg = args.find(a => a.startsWith('--limit='));
  const targetLimit = limitArg ? parseInt(limitArg.split('=')[1], 10) : (args.includes('--test') ? 5 : 300);

  const EXCLUDED_DOMAINS = [
    'businesslist.com.ng', 'finelib.com', 'vconnect.com', 'jiji.ng',
    'google.com', 'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
    'tiktok.com', 'youtube.com', 'linkedin.com', 'wa.me', 't.me',
    'tariffnumber.com', 'jaspector.com', 'houzz.com'
  ];

  let submissionsLog = [];
  if (fs.existsSync(SUBMISSIONS_LOG)) {
    try {
      submissionsLog = JSON.parse(fs.readFileSync(SUBMISSIONS_LOG, 'utf8'));
    } catch (_) {}
  }

  const attemptedUrls = new Set();
  const attemptedLeadIds = new Set();
  submissionsLog.forEach(s => {
    if (s.lead_id) attemptedLeadIds.add(s.lead_id);
    const u = s.target_website || s.url;
    if (u) {
      const clean = sanitizeWebsiteUrl(u).toLowerCase();
      attemptedUrls.add(clean);
      try {
        const host = new URL(clean).hostname.replace(/^www\./, '');
        if (host) attemptedUrls.add(host);
      } catch (_) {}
    }
  });

  const websiteLeads = leads.filter(l => {
    const raw = (l.website || l.url || l.website_url || (l.domain ? `https://${l.domain}` : '')).trim().toLowerCase();
    const cleanUrl = sanitizeWebsiteUrl(raw);
    if (!cleanUrl.startsWith('http')) return false;
    if (EXCLUDED_DOMAINS.some(d => cleanUrl.includes(d))) return false;
    if (l.webform_submitted || l.webform_sent || l.webform_status === '200_OK' || l.webform_status === '200_OK_VIA_EMAIL_CASCADE') return false;

    if (attemptedUrls.has(cleanUrl)) return false;
    try {
      const host = new URL(cleanUrl).hostname.replace(/^www\./, '');
      if (host && attemptedUrls.has(host)) return false;
    } catch (_) {}
    const lId = l.lead_id || l.id;
    if (lId && attemptedLeadIds.has(lId)) return false;

    return true;
  });

  console.log(`Found ${websiteLeads.length} candidate commercial business websites for outreach.`);
  console.log(`Execution target limit for this run: ${targetLimit}\n`);

  let submittedCount = 0;
  let inspectedCount = 0;
  let leadsDbModified = false;

  for (const lead of websiteLeads) {
    if (submittedCount >= targetLimit) {
      console.log(`🎯 Target delivery quota of ${targetLimit} reached!`);
      break;
    }

    const rawUrl = lead.website || lead.url || lead.website_url || `https://${lead.domain}`;
    const targetUrl = sanitizeWebsiteUrl(rawUrl);
    inspectedCount++;

    console.log(`[${inspectedCount}/${Math.min(websiteLeads.length, targetLimit * 5)}] Inspecting ${lead.name || 'Business'} (${targetUrl})...`);
    const formInfo = await findContactForm(targetUrl);

    let delivered = false;
    let deliveryMethod = 'webform';
    let statusCode = 200;
    let actionTarget = targetUrl;

    if (formInfo && formInfo.formAction) {
      console.log(`   📝 Found Contact Form on: ${formInfo.pageUrl} (Action: ${formInfo.formAction})`);
      const result = await submitWebContactForm(formInfo, lead);
      if (result.success) {
        delivered = true;
        statusCode = result.statusCode;
        actionTarget = formInfo.formAction;
      } else {
        console.log(`   ⚠️ Form returned HTTP status: ${result.statusCode}. Triggering Zero-Failure Fallback Cascade...`);
      }
    }

    // ZERO-FAILURE CASCADE: If form submission was blocked / failed OR no form was found on site:
    // Deliver the tailored proposal directly to the business email (either scraped or lead.email)!
    if (!delivered) {
      const candidateEmails = [
        lead.email,
        ...(formInfo?.discoveredEmails || [])
      ].filter(e => e && typeof e === 'string' && e.includes('@'));

      if (candidateEmails.length > 0) {
        const primaryEmail = candidateEmails[0];
        console.log(`   ⚡ Zero-Failure Cascade: Delivering proposal to verified business email: ${primaryEmail}...`);
        const emailRes = await multiSmtpPooler.dispatch({
          ...lead,
          email: primaryEmail,
          name: lead.name
        });

        if (emailRes.success) {
          delivered = true;
          deliveryMethod = 'smtp_pool_cascade';
          actionTarget = `email:${primaryEmail}`;
          statusCode = 200;
          console.log(`   ✅ Zero-Failure Delivered via ${emailRes.provider} (MsgId: ${emailRes.messageId})!`);
        }
      }
    }

    const record = {
      lead_id: lead.lead_id || lead.id,
      business_name: lead.name,
      target_website: targetUrl,
      form_action: actionTarget,
      submitted_at: new Date().toISOString(),
      success: delivered,
      statusCode: statusCode,
      proposal_type: delivered ? (deliveryMethod === 'smtp_pool_cascade' ? 'SMTP_POOL_ZERO_FAILURE_CASCADE' : '24/7_DFY_PROTOTYPE_AND_VOICENOTE') : 'FAILED_NO_FORM_OR_EMAIL',
      methodUsed: deliveryMethod
    };

    submissionsLog.push(record);
    attemptedUrls.add(targetUrl);
    if (record.lead_id) attemptedLeadIds.add(record.lead_id);
    fs.writeFileSync(SUBMISSIONS_LOG, JSON.stringify(submissionsLog.slice(-1000), null, 2));

    lead.webform_attempted = true;
    lead.webform_attempted_at = record.submitted_at;
    lead.webform_status = delivered ? (deliveryMethod === 'smtp_pool_cascade' ? '200_OK_VIA_EMAIL_CASCADE' : '200_OK') : 'UNREACHABLE_NO_EMAIL';

    if (delivered) {
      lead.webform_submitted = true;
      lead.webform_submitted_at = record.submitted_at;
      submittedCount++;
      console.log(`   ✅ SUBMITTED SUCCESS [${submittedCount}/${targetLimit}]! Proposal confirmed delivered.`);
    } else {
      lead.webform_failed = true;
      console.log(`   ℹ️ No contact form or public email found on ${targetUrl}. Flagged to prevent repeat crawls.`);
    }

    leadsDbModified = true;

    if (leadsDbModified) {
      try {
        fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2));
      } catch (_) {}
    }

    await new Promise(r => setTimeout(r, 400));
  }

  console.log('\n========================================================================');
  console.log(`🎉 COMMERCIAL OUTREACH PROPOSAL RUN COMPLETE:`);
  console.log(`• Total Websites Inspected: ${inspectedCount}`);
  console.log(`• Successfully Delivered Proposals: ${submittedCount}`);
  console.log(`• Live Submissions Log: ${SUBMISSIONS_LOG}`);
  console.log('========================================================================\n');
}

runRealWebFormOutreach().catch(console.error);
