const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

async function testEmailDelivery() {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || 'tosin@bethelmindanalytics.com';
  const pass = process.env.SMTP_PASS;

  console.log(`Connecting to ${host}:${port} as ${user}...`);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  const mailOptions = {
    from: `"Tosin Oyelakin | Bethelmind Digital Solutions" <${user}>`,
    to: 'bethelmindrecruit@gmail.com', // Admin inbox
    subject: `[SYSTEM VERIFICATION] Live Outreach Email Pipeline Test - ${new Date().toLocaleTimeString()}`,
    text: `Hello Tosin,\n\nThis is an automated confirmation that your Hostinger Direct SMTP email pipeline is 100% operational.\n\nTime: ${new Date().toISOString()}\nHost: ${host}\nCorporate Desk: Bethelmind Digital Solutions (CAC: 9912717)\nSettlement: Moniepoint MFB 6805375225\n\nAll outbound B2B executive emails are delivering directly to recipient inboxes.`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ TEST EMAIL DELIVERED SUCCESSFULLY!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (err) {
    console.error('❌ Failed to deliver email:', err.message);
  }
}

testEmailDelivery();
