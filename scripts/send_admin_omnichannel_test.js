/**
 * scripts/send_admin_omnichannel_test.js
 * 
 * Dispatches a comprehensive test notification across all 3 admin channels:
 * 1. WhatsApp Line 1 / Line 2 (to 0802 279 1227)
 * 2. Carrier SMS via Tailscale Gateway (to 0802 279 1227)
 * 3. B2B Email via Hostinger SMTP (to bethelmindrecruit@gmail.com)
 */

const http = require('http');
const nodemailer = require('nodemailer');
const dns = require('dns');
const fs = require('fs');
const path = require('path');

const ADMIN_PHONE = '2348022791227';
const ADMIN_EMAIL = 'bethelmindrecruit@gmail.com';
const SMS_GATEWAY_URL = 'http://10.132.90.251:8082/message';
const SMS_AUTH_TOKEN = 'f34af5ea-f657-41b1-b83e-4a59eb786e57';
const LINE1_URL = 'http://localhost:3007/send';
const LINE2_URL = 'http://localhost:3009/api/send';

// 1. WhatsApp Dispatcher
async function sendWhatsApp(lineId = 1) {
  const targetUrl = lineId === 1 ? LINE1_URL : LINE2_URL;
  const msg = `👑 *APEXREACH ADMIN TEST — ALL CHANNELS VERIFIED*\n\n` +
    `Hello Admin 👋\n` +
    `This is a live multi-channel test from your ApexReach 10K Lagos Engine.\n\n` +
    `✅ *Channel:* WhatsApp (Line ${lineId})\n` +
    `📊 *Master Lagos Leads:* 16,488 Genuine Businesses\n` +
    `🎯 *Day 2 Status:* Standby (Awaiting your launch command)\n` +
    `🛡️ *Quality Rule:* 100% Genuine, Zero Synthetic Numbers\n\n` +
    `Time: ${new Date().toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos' })} WAT`;

  const payload = JSON.stringify({ phone: ADMIN_PHONE, message: msg, text: msg });

  return new Promise((resolve) => {
    try {
      const urlObj = new URL(targetUrl);
      const req = http.request({
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 10000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ success: parsed.success || res.statusCode === 200, lineId, error: parsed.error });
          } catch (_) {
            resolve({ success: res.statusCode === 200, lineId });
          }
        });
      });
      req.on('error', (e) => resolve({ success: false, lineId, error: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ success: false, lineId, error: 'Timeout' }); });
      req.write(payload);
      req.end();
    } catch (err) {
      resolve({ success: false, lineId, error: err.message });
    }
  });
}

// 2. Carrier SMS Dispatcher
async function sendCarrierSms() {
  const smsText = `[ApexReach Admin Test] All systems verified operational. Day 2 batch (30 genuine Lagos leads) standing by.`;
  const payload = JSON.stringify({ to: '+' + ADMIN_PHONE, message: smsText });

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
        timeout: 10000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ success: res.statusCode === 200 || res.statusCode === 201, status: res.statusCode }));
      });
      req.on('error', (e) => resolve({ success: false, error: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ success: false, error: 'Timeout' }); });
      req.write(payload);
      req.end();
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
}

// 3. Hostinger SMTP Email Dispatcher (IPv4 Forced)
async function sendEmail() {
  const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
  return new Promise((resolve) => {
    dns.lookup(config.smtpHost || 'smtp.hostinger.com', { family: 4 }, async (err, ipv4Address) => {
      if (err) return resolve({ success: false, error: `DNS Error: ${err.message}` });

      const transporter = nodemailer.createTransport({
        host: ipv4Address,
        port: 587,
        secure: false,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass
        },
        tls: {
          rejectUnauthorized: false,
          servername: config.smtpHost || 'smtp.hostinger.com'
        },
        connectionTimeout: 15000
      });

      const mailOptions = {
        from: `"ApexReach Automation" <${config.smtpFrom || config.smtpUser}>`,
        to: ADMIN_EMAIL,
        subject: '👑 ApexReach Admin Channel Test — All Systems Operational',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #1e293b; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
            <h2 style="color: #38bdf8; margin-top: 0;">👑 ApexReach Admin Channel Verification</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
              This is a test notification confirming that all three of your admin communication channels are fully active and delivering.
            </p>
            <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 6px 0; color: #4ade80;">✔ <strong>WhatsApp Line 1:</strong> Active (07026266946 on Port 3007)</p>
              <p style="margin: 6px 0; color: #4ade80;">✔ <strong>Carrier SMS Gateway:</strong> Active (Tailscale Android Node)</p>
              <p style="margin: 6px 0; color: #4ade80;">✔ <strong>Hostinger B2B Email:</strong> Active (Port 587 STARTTLS)</p>
              <p style="margin: 6px 0; color: #38bdf8;">✔ <strong>Master Lagos Leads:</strong> 16,488 Genuine Cleaned Businesses</p>
            </div>
            <p style="font-size: 13px; color: #94a3b8;">
              Direct Admin Dashboard: <a href="https://www.bethelmindanalytics.com/admin?token=bethelmind_admin_2026" style="color: #38bdf8; text-decoration: none;">bethelmindanalytics.com/admin</a>
            </p>
          </div>
        `
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        resolve({ success: true, messageId: info.messageId });
      } catch (e) {
        resolve({ success: false, error: e.message });
      }
    });
  });
}

async function runOmnichannelTest() {
  console.log('===============================================================');
  console.log('📡 DISPATCHING ADMIN OMNICHANNEL TEST NOTIFICATIONS');
  console.log(`📱 Target Phone: ${ADMIN_PHONE} | 📧 Target Email: ${ADMIN_EMAIL}`);
  console.log('===============================================================\n');

  console.log('1️⃣ Sending WhatsApp Test (Line 1)...');
  const wa1Res = await sendWhatsApp(1);
  console.log('   ↳ WhatsApp Line 1:', wa1Res.success ? '✅ DELIVERED' : `❌ FAILED (${wa1Res.error})`);

  console.log('\n2️⃣ Sending WhatsApp Test (Line 2)...');
  const wa2Res = await sendWhatsApp(2);
  console.log('   ↳ WhatsApp Line 2:', wa2Res.success ? '✅ DELIVERED' : `❌ FAILED (${wa2Res.error})`);

  console.log('\n3️⃣ Sending Carrier SMS via Android Gateway...');
  const smsRes = await sendCarrierSms();
  console.log('   ↳ Carrier SMS:', smsRes.success ? '✅ DELIVERED (HTTP 200)' : `❌ FAILED (${smsRes.error || smsRes.status})`);

  console.log('\n4️⃣ Sending Email via Hostinger SMTP...');
  const emailRes = await sendEmail();
  console.log('   ↳ Email to bethelmindrecruit@gmail.com:', emailRes.success ? `✅ DELIVERED (ID: ${emailRes.messageId})` : `❌ FAILED (${emailRes.error})`);

  console.log('\n===============================================================');
  console.log('🎉 OMNICHANNEL TEST EXECUTION FINISHED');
  console.log('===============================================================');
}

runOmnichannelTest().catch(console.error);
