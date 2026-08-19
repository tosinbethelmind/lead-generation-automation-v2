/**
 * scripts/dispatch_day3_email_and_sms.js
 * 
 * Bethelmind Analytics Companion Email & SMS Outreach Engine for Day 3 Leads
 * 
 * Architecture:
 * - Email: Hostinger SMTP (tosin@bethelmindanalytics.com) with 4-Pillar Executive Breakdown
 * - SMS: Direct Android Carrier Gateway (10.132.90.251:8082) for 100% DND bypass
 */

const nodemailer = require('nodemailer');
const http = require('http');
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
  const email = lead.email;
  if (!email || !email.includes('@') || email.includes('example.com') || email.includes('test.com')) {
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
  const smsText = `[Bethelmind Analytics] ${cleanName}: Your 24/7 AI Quoting & Booking website prototype is live for review at: ${previewUrl}`;
  
  const endpoints = [
    { url: `${gatewayUrl}/message`, method: 'POST', body: { to: phone, message: smsText } },
    { url: `${gatewayUrl}/api/v1/sms/send`, method: 'POST', body: { phone, text: smsText } },
    { url: `${gatewayUrl}/send`, method: 'POST', body: { phone, text: smsText } }
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
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) return { success: true };
    } catch (_) {}
  }
  return { success: false, error: 'Carrier gateway offline' };
}

async function run() {
  console.log('===============================================================');
  console.log('📧 BETHELMIND ANALYTICS DAY 3 COMPANION EMAIL & SMS DISPATCH');
  console.log('===============================================================\n');

  if (!fs.existsSync(DB_PATH)) return;
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const allLeads = Array.isArray(data) ? data : (data.leads || Object.values(data));

  // Find Day 3 contacted leads
  const day3Leads = allLeads.filter(l => l.notes && l.notes.includes('Day 3 1-to-1 Dynamic Voice+Text'));
  console.log(`🎯 Found ${day3Leads.length} Day 3 Leads to process for Email & SMS companion dispatches.\n`);

  let emailCount = 0;
  let smsCount = 0;

  for (let i = 0; i < day3Leads.length; i++) {
    const lead = day3Leads[i];
    const phone = lead.phone_e164 || lead.phone || '';
    const cleanName = cleanBusinessName(lead.name, lead.category);
    const leadId = lead.lead_id || lead.id;
    const previewUrl = `https://www.bethelmindanalytics.com/preview/${encodeURIComponent(leadId)}`;

    console.log(`[${(i + 1).toString().padStart(2, '0')}/${day3Leads.length}] 🏢 ${cleanName.padEnd(30)} | 📧 ${lead.email || 'None'} | 📱 ${phone}`);

    // Dispatch Executive Email
    if (lead.email && lead.email.includes('@')) {
      const eRes = await sendExecutiveEmail(lead, previewUrl, cleanName);
      if (eRes.success) {
        emailCount++;
        console.log(`   ↳ 📧 Executive Email Dispatched to ${lead.email}`);
      }
    }

    // Dispatch Companion SMS
    const sRes = await sendDirectSms(phone, cleanName, previewUrl);
    if (sRes.success) {
      smsCount++;
      console.log(`   ↳ 📱 Carrier SMS Delivered to ${phone}`);
    }

    await sleep(2000);
  }

  console.log(`\n===============================================================`);
  console.log(`🎉 COMPANION DISPATCH COMPLETE: ${emailCount} Emails Dispatched | ${smsCount} Carrier SMS Sent`);
  console.log(`===============================================================`);
}

run().catch(console.error);
