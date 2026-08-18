const nodemailer = require('nodemailer');
const fs = require('fs');
const dns = require('dns');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

dns.lookup(config.smtpHost || 'smtp.hostinger.com', { family: 4 }, async (err, address) => {
  if (err) {
    console.error('DNS Lookup Error:', err.message);
    return;
  }
  console.log(`Resolved ${config.smtpHost} to IPv4: ${address}`);

  const transporter = nodemailer.createTransport({
    host: address,
    port: 587,
    secure: false,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    },
    tls: {
      servername: config.smtpHost || 'smtp.hostinger.com',
      rejectUnauthorized: false
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `ApexReach Admin <${config.smtpFrom}>`,
      to: 'bethelmindrecruit@gmail.com',
      subject: '✅ ApexReach Lagos Engine — Admin Notification Preferences Updated',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #0f172a;">ApexReach Lagos B2B Engine Update</h2>
          <p>Hello Admin,</p>
          <p>Your notification preferences have been saved:</p>
          <ul>
            <li><b>Outreach Cycle:</b> Monday, August 17 – Sunday, August 23, 2026</li>
            <li><b>Admin Updates:</b> WhatsApp (0802 279 1227) & Email (bethelmindrecruit@gmail.com)</li>
            <li><b>SMS Delivery:</b> Restricted strictly to lead outreach (Zero Admin SMS consumption)</li>
          </ul>
          <p><b>Access your live Dashboard here:</b><br/>
          <a href="https://www.bethelmindanalytics.com/dashboard" style="display: inline-block; margin-top: 10px; background: #2563eb; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold;">Open Live Dashboard</a>
          </p>
        </div>
      `
    });
    console.log('Email Sent Successfully to bethelmindrecruit@gmail.com:', info.messageId);
  } catch (mailErr) {
    console.error('Email error:', mailErr.message);
  }
});
