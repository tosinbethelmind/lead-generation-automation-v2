/**
 * @file scripts/dispatch_pure_b2b_sample_to_admin.js
 * 
 * Dispatches the exact B2B Commercial Email (with MP3 voice note attachment)
 * and Carrier GSM SMS sample directly to the Admin for final review.
 * 
 * Admin Targets:
 * - Email: bethelmindrecruit@gmail.com
 * - SMS Phone: +2348022791227
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ADMIN_EMAIL = 'bethelmindrecruit@gmail.com';
const ADMIN_PHONE = '+2348022791227';
const SMS_GATEWAY_URL = 'http://10.176.20.103:8082/message';
const SMS_AUTH_TOKEN = 'f34af5ea-f657-41b1-b83e-4a59eb786e57';

async function sendSampleSms() {
  const sampleSmsText = `Good day Macmed Integrated! Stop wasting 40 mins typing manual solar/project quotes. We pre-built an automated BOQ load sizer for your Lagos business. Test free: https://www.bethelmindanalytics.com/preview/macmed-integrated-farms (08022791227)`;
  
  const payload = JSON.stringify({
    to: ADMIN_PHONE,
    message: sampleSmsText
  });

  return new Promise((resolve) => {
    try {
      const urlObj = new URL(SMS_GATEWAY_URL);
      const req = http.request({
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': SMS_AUTH_TOKEN,
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 8000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ success: res.statusCode === 200 || res.statusCode === 201, status: res.statusCode, text: sampleSmsText }));
      });
      req.on('error', (e) => resolve({ success: false, error: e.message, text: sampleSmsText }));
      req.on('timeout', () => { req.destroy(); resolve({ success: false, error: 'Gateway timeout', text: sampleSmsText }); });
      req.write(payload);
      req.end();
    } catch (err) {
      resolve({ success: false, error: err.message, text: sampleSmsText });
    }
  });
}

const dns = require('dns');
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (_) {}

async function sendSampleEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'tosin@bethelmindanalytics.com',
      pass: 'Bethelmind@2026'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mp3Path = path.join(process.cwd(), 'public/assets/audio/vn_macmed_integrated_farms.mp3');
  const previewUrl = 'https://www.bethelmindanalytics.com/preview/macmed-integrated-farms';
  const businessName = 'Macmed Integrated Commercial';
  const area = 'Lekki & Lagos Corridor';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Automating 24/7 AI Quotes & Client Booking</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #0b1329; font-family: 'Segoe UI', Arial, sans-serif; color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 24px; text-align: center;">
      <div style="color: #e0f2fe; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">⚡ Bethelmind Analytics Lagos Desk</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">24/7 AI Quoting & WhatsApp Booking Portal</h1>
      <p style="color: #bae6fd; margin: 6px 0 0 0; font-size: 13px;">Pre-built private prototype prepared for <strong>${businessName}</strong></p>
    </div>

    <!-- Main Body Content -->
    <div style="padding: 28px;">
      <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6; margin-top: 0;">
        Good day Lead Engineering & Management Team at <strong>${businessName}</strong>,
      </p>

      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
        My name is Tosin from Bethelmind Analytics Lagos Desk. We recently conducted a digital operations review for your commercial operations in ${area}.
      </p>

      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
        We noticed that prospective commercial clients inquiring about your pricing, equipment, and installations after business hours often experience delays before receiving manual quotes on WhatsApp.
      </p>

      <!-- Glowing Voice Note Card -->
      <div style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(14, 165, 233, 0.15) 100%); border: 1px solid #0284c7; border-radius: 10px; padding: 18px; margin: 24px 0; text-align: center;">
        <div style="font-size: 12px; color: #38bdf8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
          🎙️ 15-Second Personalized Audio Voice Note Attached
        </div>
        <p style="font-size: 13px; color: #94a3b8; margin: 0 0 12px 0;">
          (We have attached our audio briefing to this email so you can listen directly on your phone)
        </p>
        <a href="${previewUrl}" style="display: inline-block; background: #0284c7; color: #ffffff; padding: 10px 22px; border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 13px;">
          🔊 Play Voice Note & Open Sizer
        </a>
      </div>

      <!-- Features Box -->
      <div style="background: #1e293b; border-left: 4px solid #38bdf8; border-radius: 0 8px 8px 0; padding: 16px; margin: 20px 0;">
        <div style="font-size: 14px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">⚡ What We Custom-Built For ${businessName}:</div>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #cbd5e1; line-height: 1.8;">
          <li><strong>24/7 AI WhatsApp Closer:</strong> Answers pricing & technical questions in &lt; 3s with a natural Nigerian business tone.</li>
          <li><strong>Interactive BOQ Load Sizer:</strong> Clients calculate KVA power requirements and receive instant WhatsApp PDF quotes.</li>
          <li><strong>Automated Bank Transfer Matching:</strong> Instant Paystack & Moniepoint transfer verification.</li>
          <li><strong>Executive Google Sheets CRM:</strong> Pushes lead notifications instantly to your phone.</li>
        </ul>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0 20px 0;">
        <a href="${previewUrl}" style="display: inline-block; background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
          👉 Test Drive Your Live Prototype Online
        </a>
        <div style="font-size: 12px; color: #64748b; margin-top: 8px;">(100% Free ₦0 Upfront Review on your phone)</div>
      </div>

      <!-- Closer Desk Contact -->
      <div style="border-top: 1px solid #1e293b; padding-top: 18px; margin-top: 20px; font-size: 13px; color: #94a3b8; line-height: 1.6;">
        To activate or customize your portal, chat directly with our Lagos desk:<br>
        📱 <strong>WhatsApp Desk:</strong> <a href="https://wa.me/2348022791227" style="color: #38bdf8; text-decoration: none; font-weight: 700;">+234 802 279 1227</a> (0802 279 1227)<br>
        📧 <strong>Email:</strong> <a href="mailto:tosin@bethelmindanalytics.com" style="color: #38bdf8; text-decoration: none;">tosin@bethelmindanalytics.com</a><br><br>
        <strong>Tosin Oyelakin</strong><br>
        Lead Solutions Strategist · <em>Bethelmind Analytics Lagos Desk</em>
      </div>

    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: '"Tosin | Bethelmind Analytics Lagos Desk" <tosin@bethelmindanalytics.com>',
    to: ADMIN_EMAIL,
    subject: `Automating 24/7 AI Quotes & Client Booking for ${businessName} (Voice Note Attached)`,
    html: htmlContent,
    attachments: fs.existsSync(mp3Path) ? [
      {
        filename: `VoiceNote_${businessName.replace(/[^a-zA-Z0-9]/g, '')}_Bethelmind.mp3`,
        path: mp3Path,
        contentType: 'audio/mpeg'
      }
    ] : []
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId, hasAudio: fs.existsSync(mp3Path) };
}

async function main() {
  console.log('========================================================================');
  console.log('📧 DISPATCHING FULL B2B COMMERCIAL SAMPLE (EMAIL + MP3 + SMS)');
  console.log(`• Target Email: ${ADMIN_EMAIL}`);
  console.log(`• Target Phone: ${ADMIN_PHONE}`);
  console.log('========================================================================\n');

  console.log('1️⃣ Sending Carrier GSM SMS Sample...');
  const smsRes = await sendSampleSms();
  if (smsRes.success) {
    console.log('   ✅ SMS Successfully Dispatched via Gateway!');
  } else {
    console.log(`   ℹ️ Gateway Notice: ${smsRes.error || 'HTTP ' + smsRes.status} (Text formatted below)`);
  }
  console.log(`   📄 SMS Text: "${smsRes.text}"\n`);

  console.log('2️⃣ Sending Executive B2B HTML Email with MP3 Voice Note Attachment...');
  try {
    const emailRes = await sendSampleEmail();
    console.log(`   ✅ Email Delivered to ${ADMIN_EMAIL}! (ID: ${emailRes.messageId})`);
    console.log(`   🎙️ MP3 Voice Note Attachment Included: ${emailRes.hasAudio ? 'YES' : 'NO'}`);
  } catch (err) {
    console.error(`   ❌ Email dispatch failed: ${err.message}`);
  }

  console.log('\n========================================================================');
  console.log('🎉 SAMPLE DISPATCH SEQUENCE COMPLETE!');
  console.log('========================================================================');
}

main().catch(console.error);
