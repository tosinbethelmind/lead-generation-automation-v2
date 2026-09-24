const nodemailer = require('nodemailer');

async function test() {
  console.log('Testing 465 (SSL)...');
  try {
    const t2 = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: { user: 'tosin@bethelmindanalytics.com', pass: 'Bethelmind@2026' },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000
    });
    await t2.verify();
    console.log('✅ 465 SSL VERIFIED SUCCESS!');
  } catch(e) {
    console.log('❌ 465 error:', e.message);
  }

  console.log('Testing 587 (STARTTLS)...');
  try {
    const t1 = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false,
      auth: { user: 'tosin@bethelmindanalytics.com', pass: 'Bethelmind@2026' },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000
    });
    await t1.verify();
    console.log('✅ 587 STARTTLS VERIFIED SUCCESS!');
  } catch(e) {
    console.log('❌ 587 error:', e.message);
  }
}

test();
