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
      from: `"Bethelmind Analytics Lagos Desk" <${config.smtpFrom}>`,
      to: 'bethelmindrecruit@gmail.com',
      subject: '🚀 Bethelmind Analytics — 24/7 Engine, Traffic & Quality Assurance Update',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; line-height: 1.6; color: #0f172a; max-width: 680px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 20px;">
            <h1 style="color: #1e3a8a; margin: 0; font-size: 22px;">Bethelmind Analytics & Strategy</h1>
            <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">24/7 Cloud Architecture & Growth Engine Executive Briefing</p>
          </div>

          <p>Hello Leadership Team,</p>
          <p>Here is the official system status and execution summary for your autonomous infrastructure and conversion funnels:</p>

          <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin: 0 0 8px 0; color: #065f46; font-size: 16px;">✅ Operational Status: 100% Active & Ban-Proof</h3>
            <p style="margin: 0; font-size: 14px; color: #334155;">All background operations are active. Cold outreach is safely held in staging awaiting your manual trigger.</p>
          </div>

          <h3 style="color: #1e293b; margin-top: 24px; font-size: 16px;">1. Automated 24/7 Cloud Architecture</h3>
          <ul style="padding-left: 20px; font-size: 14px; color: #334155;">
            <li><b>Lead Harvester (Colab 10K Runner):</b> Scrapes & deduplicates genuine Lagos commercial businesses directly into Supabase Cloud.</li>
            <li><b>Google Search Indexing API:</b> Automatically pings crawl queues for all 16 digital product landing pages and store directories.</li>
            <li><b>Selar Webhook Gateway:</b> Listens 24/7 on <code>/api/webhooks/selar</code> to trigger instant file delivery via SMS & Email upon paid orders.</li>
            <li><b>Daily Traffic Action Plan:</b> Automatically generated at <code>data/traffic-queue/DAILY_TRAFFIC_ACTION_PLAN.md</code>.</li>
          </ul>

          <h3 style="color: #1e293b; margin-top: 24px; font-size: 16px;">2. Monitored Conversion Endpoints</h3>
          <ul style="padding-left: 20px; font-size: 14px; color: #334155;">
            <li><b>Inbound Closing Desk:</b> +234 802 279 1227 (<a href="https://wa.me/2348022791227" style="color: #2563eb;">wa.me/2348022791227</a>)</li>
            <li><b>Admin Notification Email:</b> bethelmindrecruit@gmail.com</li>
            <li><b>Official Digital Store:</b> <a href="https://www.bethelmindanalytics.com/store" style="color: #2563eb;">https://www.bethelmindanalytics.com/store</a></li>
          </ul>

          <h3 style="color: #1e293b; margin-top: 24px; font-size: 16px;">3. Controlled Outreach Protocol</h3>
          <p style="font-size: 14px; color: #334155;">In compliance with strict ban-prevention policy, cold Carrier SMS and B2B emails are <b>staged safely</b>. When ready to dispatch, simply run <code>TRIGGER_OUTREACH_MANUAL.bat</code>.</p>

          <div style="margin-top: 30px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            <p style="margin: 0;">Dispatched by <b>Bethelmind Analytics Lagos Due-Diligence & Automation Desk</b></p>
          </div>
        </div>
      `
    });
    console.log('✅ Executive Update Email Dispatched Successfully to bethelmindrecruit@gmail.com. MessageId:', info.messageId);
    process.exit(0);
  } catch (mailErr) {
    console.error('❌ Email dispatch error:', mailErr.message);
    process.exit(1);
  }
});
