const nodemailer = require('nodemailer');

async function sendAdminEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false,
    auth: {
      user: 'tosin@bethelmindanalytics.com',
      pass: 'Bethelmind@2026'
    }
  });

  const magicMobileLink = 'https://www.bethelmindanalytics.com/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile';
  const magicFullLink = 'https://www.bethelmindanalytics.com/api/admin/login?token=bethelmind_admin_2026&redirect=/admin';

  const mailOptions = {
    from: '"Bethelmind Admin Portal" <tosin@bethelmindanalytics.com>',
    to: 'bethelmindrecruit@gmail.com',
    subject: '📱 1-Tap Admin Access Link for Your Phone',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #070a12; color: #f8fafc; border-radius: 12px;">
        <h2 style="color: #38bdf8; margin-top: 0;">📱 Bethelmind Lagos Desk — Mobile Admin Control</h2>
        <p>Good day Boss! Here is your 1-Tap Magic Login link to control the entire lead generation and website engine directly on your phone:</p>
        
        <div style="margin: 25px 0;">
          <a href="${magicMobileLink}" style="display: block; background: #0284c7; color: #ffffff; padding: 14px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; font-size: 16px;">
            👉 Tap Here to Open Mobile Command Center
          </a>
        </div>

        <div style="margin: 15px 0;">
          <a href="${magicFullLink}" style="display: block; background: #1e293b; color: #38bdf8; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; font-size: 14px; border: 1px solid #334155;">
            💻 Or Tap Here to Open Full Desktop Admin Dashboard
          </a>
        </div>

        <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
          <b>No Password Needed:</b> Tapping either link will automatically log you in as Super Admin for 30 days.<br/>
          <b>Install on Phone:</b> In Google Chrome on Android, tap the 3 dots (⋮) &gt; 'Install app' or 'Add to Home screen'.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Admin email dispatched to bethelmindrecruit@gmail.com! MessageID:', info.messageId);
  } catch (err) {
    console.error('Email error:', err.message);
  }
}

sendAdminEmail();
