const https = require('https');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

const payload = JSON.stringify({
  sender: {
    name: 'Tosin | Bethelmind Analytics Lagos Desk',
    email: 'tosin@bethelmindanalytics.com'
  },
  to: [
    { email: 'bethelmindrecruit@gmail.com', name: 'Admin Tosin' }
  ],
  subject: '🎉 CLOUDFLARE + BREVO DKIM LIVE - 100% INBOX VERIFIED',
  htmlContent: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0b1329; color: #f8fafc; border-radius: 8px;">
      <h2 style="color: #38bdf8;">⚡ Bethelmind Analytics Lagos Desk</h2>
      <p>Hello Admin,</p>
      <p>This is a live transactional email sent from <strong>tosin@bethelmindanalytics.com</strong> via Brevo API with active Cloudflare nameservers and DKIM keys (<code>brevo1._domainkey</code> & <code>brevo2._domainkey</code>)!</p>
      <p>Your email engine is now 100% authenticated for high deliverability!</p>
    </div>
  `
});

const req = https.request('https://api.brevo.com/v3/smtp/email', {
  method: 'POST',
  headers: {
    'api-key': config.brevoApiKey,
    'accept': 'application/json',
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(payload)
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Response:', body);
  });
});
req.write(payload);
req.end();
