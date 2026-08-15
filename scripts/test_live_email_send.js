const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

async function sendLiveTestEmail() {
  console.log('Connecting to Hostinger SMTP: smtp.hostinger.com (Port 465)...');

  const transporter = nodemailer.createTransport({
    host: config.smtpHost || 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: config.smtpUser || 'tosin@bethelmindanalytics.com',
      pass: config.smtpPass || 'Bethelmind@2026',
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const targetEmail = 'bethelminrecruit@gmail.com';
  const previewUrl = 'https://www.bethelmindanalytics.com/preview/eko-luxury-suites?src=10k_lagos';

  const mailOptions = {
    from: `"Tosin | Bethelmind Analytics" <${config.smtpUser}>`,
    to: targetEmail,
    subject: '🧪 [LIVE TEST] Lagos 10K Multi-Sector Blended Outreach Engine (Aug 15 – Aug 21, 2026)',
    text: `Hello Tosin,

This is a LIVE test dispatch from your Lagos 10K Multi-Sector Blended Outreach Engine.

Campaign: Lagos 10K Multi-Sector Blended Outreach Engine
Sprint Window: Aug 15 – Aug 21, 2026 (7-Day Sprint)
Status: Live & Configured
Personal Admin Email: ${targetEmail}
Target Phone / WhatsApp: +2348022791227

Sample Interactive Demo Portal URL:
👉 ${previewUrl}

If you received this email, your Hostinger SMTP delivery pipeline is 100% OPERATIONAL!

Warm regards,
Bethelmind Analytics Lagos Hub
https://www.bethelmindanalytics.com`,
    html: `<div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 24px; border-radius: 12px;">
      <h2 style="color: #38bdf8; margin-top: 0;">🧪 Lagos 10K Multi-Sector Blended Outreach Engine</h2>
      <p style="color: #94a3b8; font-size: 14px;"><strong>Sprint Window:</strong> Aug 15 – Aug 21, 2026 (7-Day Sprint)</p>
      <div style="background-color: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin: 16px 0;">
        <p style="margin: 4px 0;">✅ <strong>Delivery Status:</strong> 100% Operational</p>
        <p style="margin: 4px 0;">📧 <strong>Recipient:</strong> ${targetEmail}</p>
        <p style="margin: 4px 0;">📱 <strong>Admin WhatsApp:</strong> +2348022791227</p>
      </div>
      <p>Test interactive 2-minute live demo portal:</p>
      <a href="${previewUrl}" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold;">👉 Open Demo Portal</a>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Bethelmind Analytics & Strategy • Lagos State</p>
    </div>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ EMAIL SENT SUCCESSFULLY OVER THE WIRE!');
    console.log('Message ID:', info.messageId);
    console.log('Accepted by SMTP:', info.accepted);
  } catch (err) {
    console.error('❌ SMTP Error:', err);
  }
}

sendLiveTestEmail();
