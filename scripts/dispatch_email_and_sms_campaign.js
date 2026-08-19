/**
 * scripts/dispatch_email_and_sms_campaign.js
 * 
 * Bethelmind Analytics B2B Executive Email & Carrier SMS Outreach Engine
 * 
 * Infrastructure:
 * - Email: Hostinger SMTP (tosin@bethelmindanalytics.com / Port 587)
 * - SMS: Dedicated Carrier Android Gateway (http://10.132.90.251:8082)
 * - Cloud: Supabase + Local Activity Logging
 */

const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse environment variables
const envPath = path.join(__dirname, '../.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      envVars[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const url = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.SUPABASE_URL;
const key = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (url && key) ? createClient(url, key) : null;

const DB_PATH = path.join(__dirname, '../local_db/leads_db.json');
const ACTIVITIES_PATH = path.join(__dirname, '../local_db/activities.json');

const transporter = nodemailer.createTransport({
  host: envVars.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(envVars.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: envVars.SMTP_USER || 'tosin@bethelmindanalytics.com',
    pass: envVars.SMTP_PASS || 'Bethelmind@2026'
  },
  tls: { rejectUnauthorized: false }
});

const gatewayUrl = 'http://10.132.90.251:8082';
const smsToken = 'f34af5ea-f657-41b1-b83e-4a59eb786e57';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function normalizeToInternational(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('234')) return digits;
  if (digits.startsWith('0') && digits.length === 11) return '234' + digits.slice(1);
  if (digits.length === 10 && ['7', '8', '9'].includes(digits[0])) return '234' + digits;
  return digits;
}

function cleanBusinessName(rawName, category = '') {
  let name = (rawName || '')
    .replace(/\|\|.*$/, '')
    .replace(/\|.*$/, '')
    .replace(/ - .*$/, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!name || /^(lagos_det_|lead_|mock_|test)/i.test(name)) {
    name = category ? (category.charAt(0).toUpperCase() + category.slice(1) + ' Enterprise') : 'Commercial Enterprise';
  }
  return name;
}

async function sendExecutiveEmail(lead, previewUrl, cleanName) {
  const email = (lead.email || '').trim();
  if (!email || !email.includes('@') || email.includes('example.com') || email.includes('test.com') || email.includes('placeholder')) {
    return { success: false, reason: 'No valid corporate email' };
  }

  const subject = `Automating 24/7 Inquiries & Online Bookings for ${cleanName}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
      <div style="background: #0f172a; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="color: #38bdf8; margin: 0; font-size: 20px;">Bethelmind Analytics Lagos</h2>
        <p style="color: #94a3b8; margin: 4px 0 0; font-size: 13px;">B2B Online Deployment & Automated Booking Engines</p>
      </div>

      <div style="padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <p>Dear Management Team at <strong>${cleanName}</strong>,</p>
        
        <p>We recently reviewed your customer touchpoints in Lagos and observed that prospective clients looking for your services during evening hours or peak traffic periods often experience delays before receiving manual quotes.</p>

        <p>Our engineering desk pre-built a private, live interactive website and automated booking portal tailored for <strong>${cleanName}</strong>.</p>

        <div style="background: #f8fafc; border-left: 4px solid #38bdf8; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <h4 style="margin: 0 0 10px; color: #0f172a;">⚡ What We Built for Your Company:</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
            <li><strong>24/7 AI WhatsApp Closer:</strong> Answers pricing & service inquiries in &lt; 3s with a natural Nigerian business tone.</li>
            <li><strong>Dynamic Quoting Engine:</strong> Allows clients to calculate custom price estimates and receive branded PDF quotes automatically.</li>
            <li><strong>Instant Bank Transfer Matching:</strong> Automated Paystack & Moniepoint transfer verification.</li>
            <li><strong>Executive CRM Sync:</strong> Automatically logs every prospect into your Google Sheets and sends instant alerts to your desk.</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${previewUrl}" style="background: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 15px;">
            👉 Test Drive Your Live Prototype Online
          </a>
          <p style="font-size: 12px; color: #64748b; margin-top: 8px;">(100% Free ₦0 Upfront Review on your phone)</p>
        </div>

        <p style="font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          Best regards,<br>
          <strong>Tosin Bethel</strong><br>
          <em>Head of B2B Solutions | Bethelmind Analytics Lagos</em><br>
          📱 WhatsApp Desk: +234 802 279 1227 | 🌐 bethelmindanalytics.com
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Tosin | Bethelmind Analytics" <${envVars.SMTP_USER || 'tosin@bethelmindanalytics.com'}>`,
      to: email,
      subject,
      html: htmlContent
    });
    return { success: true, email };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function sendDirectSms(phone, cleanName, previewUrl) {
  const intlPhone = normalizeToInternational(phone);
  const formattedPhone = '+' + intlPhone;
  const smsText = `[Bethelmind Analytics] ${cleanName}: Your 24/7 AI Quoting & Booking website prototype is live for review at: ${previewUrl}`;
  
  const endpoints = [
    { url: `${gatewayUrl}/message`, method: 'POST', body: { to: formattedPhone, message: smsText } },
    { url: `${gatewayUrl}/api/v1/sms/send`, method: 'POST', body: { phone: formattedPhone, text: smsText } },
    { url: `${gatewayUrl}/send`, method: 'POST', body: { phone: formattedPhone, text: smsText } }
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: ep.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': smsToken,
          'X-API-Token': smsToken
        },
        body: JSON.stringify(ep.body),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) return { success: true };
    } catch (_) {}
  }
  return { success: false, error: 'Carrier gateway offline' };
}

function recordActivity(activity) {
  try {
    let activities = [];
    if (fs.existsSync(ACTIVITIES_PATH)) {
      activities = JSON.parse(fs.readFileSync(ACTIVITIES_PATH, 'utf8') || '[]');
    }
    activities.push({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...activity,
      created_at: new Date().toISOString()
    });
    fs.writeFileSync(ACTIVITIES_PATH, JSON.stringify(activities, null, 2), 'utf8');
  } catch (e) {
    console.warn('[Activity Warn]', e.message);
  }
}

async function run() {
  console.log('===============================================================');
  console.log('📧 BETHELMIND ANALYTICS MULTI-CHANNEL EMAIL & SMS OUTREACH');
  console.log(`📅 Date: ${new Date().toLocaleDateString('en-NG')} | Hostinger SMTP + Tailscale SMS`);
  console.log('===============================================================\n');

  if (!fs.existsSync(DB_PATH)) {
    console.error('Database not found at:', DB_PATH);
    return;
  }

  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const allLeads = Array.isArray(data) ? data : (data.leads || Object.values(data));

  // Find 45 commercial leads for Email and SMS outreach
  const targetLeads = allLeads.filter(l => {
    const hasEmail = l.email && l.email.includes('@') && !l.email.includes('example.com');
    const hasPhone = l.phone && l.phone.length >= 10;
    return hasEmail || hasPhone;
  }).slice(0, 45);

  console.log(`🎯 Found ${targetLeads.length} Commercial Leads to process for Email & SMS.\n`);

  let emailSentCount = 0;
  let smsSentCount = 0;
  const nowIso = new Date().toISOString();

  for (let i = 0; i < targetLeads.length; i++) {
    const lead = targetLeads[i];
    const phone = lead.phone_e164 || lead.phone || '';
    const cleanName = cleanBusinessName(lead.name, lead.category);
    const leadId = lead.lead_id || lead.id;
    const previewUrl = `https://www.bethelmindanalytics.com/preview/${encodeURIComponent(leadId)}`;

    console.log(`[${(i + 1).toString().padStart(2, '0')}/${targetLeads.length}] 🏢 ${cleanName.slice(0, 30).padEnd(30)} | 📧 ${(lead.email || 'None').padEnd(25)} | 📱 ${phone}`);

    // 1. Send Executive Email
    if (lead.email && lead.email.includes('@')) {
      const emailRes = await sendExecutiveEmail(lead, previewUrl, cleanName);
      if (emailRes.success) {
        emailSentCount++;
        console.log(`   ↳ 📧 Executive Proposal Sent to ${lead.email}`);
        recordActivity({
          type: 'email_outreach_sent',
          lead_id: leadId,
          deal_id: '',
          description: `4-Pillar Executive Email dispatched to ${cleanName} (${lead.email})`,
          metadata: JSON.stringify({ previewUrl, email: lead.email }),
          channel: 'email',
          actor: 'system'
        });
      } else {
        console.log(`   ↳ ⚠️ Email skip/error: ${emailRes.error || emailRes.reason}`);
      }
    }

    // 2. Send Carrier SMS Alert
    if (phone && phone.length >= 10) {
      const smsRes = await sendDirectSms(phone, cleanName, previewUrl);
      if (smsRes.success) {
        smsSentCount++;
        console.log(`   ↳ 📱 Carrier SMS Delivered to ${phone}`);
        recordActivity({
          type: 'sms_outreach_sent',
          lead_id: leadId,
          deal_id: '',
          description: `Carrier SMS alert dispatched to ${cleanName} (${phone})`,
          metadata: JSON.stringify({ previewUrl, phone }),
          channel: 'sms',
          actor: 'system'
        });
      } else {
        console.log(`   ↳ ℹ️ SMS note: ${smsRes.error}`);
      }
    }

    lead.last_contacted_at = nowIso;
    lead.notes = (lead.notes || '') + ` | Email/SMS Multi-Channel Outreach Dispatched (${nowIso.slice(0, 10)})`;

    // 2-second safe delay between email/SMS dispatches
    await sleep(2000);
  }

  // Save database updates locally
  fs.writeFileSync(DB_PATH, JSON.stringify(allLeads, null, 2), 'utf8');
  console.log(`\n💾 Saved updated records to local_db/leads_db.json`);

  if (supabase) {
    console.log('🔄 Syncing updated notes to Supabase Cloud...');
    try {
      for (const lead of targetLeads) {
        await supabase.from('leads').update({
          notes: lead.notes,
          last_contacted_at: nowIso
        }).eq('lead_id', lead.lead_id || lead.id);
      }
      console.log('✔ Supabase Cloud Synced.');
    } catch (sErr) {
      console.warn('Supabase sync warning:', sErr.message);
    }
  }

  console.log(`\n===============================================================`);
  console.log(`🎉 MULTI-CHANNEL CAMPAIGN COMPLETE: ${emailSentCount} Emails Dispatched | ${smsSentCount} SMS Dispatched`);
  console.log(`===============================================================`);
}

run().catch(console.error);
