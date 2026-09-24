const https = require('https');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

async function testBrevo() {
  console.log('--- 1. TESTING BREVO API KEY & SENDERS ---');
  const apiKey = config.brevoApiKey;
  console.log('Brevo key:', apiKey ? apiKey.substring(0, 15) + '...' : 'NONE');
  if (!apiKey) return;

  // Check verified senders
  return new Promise((resolve) => {
    const req = https.request('https://api.brevo.com/v3/senders', {
      headers: {
        'api-key': apiKey,
        'accept': 'application/json'
      }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        console.log(`Brevo Senders Status: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(body);
          console.log('Verified Senders in Brevo:', JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.log('Raw body:', body);
        }
        resolve();
      });
    });
    req.on('error', (err) => {
      console.log('❌ Brevo Network Error:', err.message);
      resolve();
    });
    req.end();
  });
}

async function testHostinger587() {
  console.log('\n--- 2. TESTING HOSTINGER SMTP PORT 587 ---');
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 8000
  });

  try {
    await transporter.verify();
    console.log('✅ Hostinger SMTP Port 587 connected & authenticated successfully!');
  } catch (err) {
    console.log('❌ Hostinger SMTP Port 587 Error:', err.message);
  }
}

async function run() {
  await testBrevo();
  await testHostinger587();
}

run();
