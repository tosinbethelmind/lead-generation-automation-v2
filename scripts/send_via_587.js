const nodemailer = require('nodemailer');

async function sendVia587() {
  console.log('Sending live email via smtp.hostinger.com:587 to bethelmindrecruit@gmail.com...');

  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false, // STARTTLS
    requireTLS: true,
    auth: {
      user: 'tosin@bethelmindanalytics.com',
      pass: 'Bethelmind@2026',
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: '"Oyelakin Tosin | Bethelmind Analytics" <tosin@bethelmindanalytics.com>',
    to: 'bethelmindrecruit@gmail.com',
    replyTo: 'tosin@bethelmindanalytics.com',
    subject: '🧪 [LIVE TEST] Lagos 10K Multi-Sector Outreach Engine (Aug 15 – Aug 21, 2026)',
    text: `Hello Tosin,

This is your official live test dispatch for the Lagos 10K Multi-Sector Blended Outreach Engine sent directly to your real personal email: bethelmindrecruit@gmail.com.

Campaign: Lagos 10K Multi-Sector Blended Outreach Engine (Aug 15 – Aug 21, 2026)
Personal Admin Email: bethelmindrecruit@gmail.com
WhatsApp Line: +2348022791227

Sample Interactive Demo Portal URL:
👉 https://www.bethelmindanalytics.com/preview/eko-luxury-suites?src=10k_lagos

Best regards,
Bethelmind Analytics Lagos Hub`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #3b82f6;">
      <h2 style="color: #60a5fa; margin-top: 0;">🚀 Lagos 10K Multi-Sector Blended Outreach Engine</h2>
      <p style="color: #cbd5e1; font-size: 14px;"><strong>Sprint Window:</strong> Aug 15 – Aug 21, 2026</p>
      
      <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid rgba(255,255,255,0.1);">
        <p style="margin: 4px 0; color: #34d399;"><strong>✓ Delivery Status:</strong> 100% Operational & Verified</p>
        <p style="margin: 4px 0;"><strong>Recipient:</strong> bethelmindrecruit@gmail.com</p>
        <p style="margin: 4px 0;"><strong>Admin Phone:</strong> +2348022791227</p>
      </div>

      <p style="color: #e2e8f0; font-size: 14px;">
        Sample interactive 2-minute live demo portal generated for Lagos commercial enterprises:
      </p>

      <a href="https://www.bethelmindanalytics.com/preview/eko-luxury-suites?src=10k_lagos" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 10px;">
        👉 Open Live Demo Preview
      </a>

      <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
        Bethelmind Analytics & Strategy • Victoria Island / Ikeja Lagos • +234 802 279 1227
      </p>
    </div>`
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('🎉 SUCCESS! Message delivered to bethelmindrecruit@gmail.com');
  console.log('Message ID:', info.messageId);
  console.log('Accepted recipients:', info.accepted);
}

sendVia587().then(() => process.exit(0)).catch(e => { console.error('Error:', e); process.exit(1); });
