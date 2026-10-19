require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const axios = require('axios');

async function sendBrevo() {
  const apiKey = process.env.BREVO_API_KEY_1 || process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('No Brevo API key found in environment.');
    return;
  }
  const magicMobileLink = 'https://www.bethelmindanalytics.com/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile';
  const magicFullLink = 'https://www.bethelmindanalytics.com/api/admin/login?token=bethelmind_admin_2026&redirect=/admin';

  const payload = {
    sender: { name: 'Bethelmind Digital Solutions', email: 'tosin@bethelmindanalytics.com' },
    to: [{ email: 'bethelmindrecruit@gmail.com', name: 'Boss Admin' }],
    subject: '📱 Bethelmind Admin Control Link for Your Phone',
    htmlContent: `
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
    const res = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Brevo Email Dispatched! Message ID:', res.data.messageId);
  } catch (err) {
    console.error('Brevo Error:', err.response ? err.response.data : err.message);
  }
}

sendBrevo();
