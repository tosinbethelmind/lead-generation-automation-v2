const nodemailer = require('nodemailer');

async function testSend() {
  const t = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: { user: 'tosin@bethelmindanalytics.com', pass: 'Bethelmind@2026' },
    tls: { rejectUnauthorized: false }
  });
  const info = await t.sendMail({
    from: '"Tosin Oyelakin | Bethelmind Analytics" <tosin@bethelmindanalytics.com>',
    to: 'bethelmindrecruit@gmail.com',
    subject: 'Hostinger Port 465 Direct SSL Verification Test',
    text: 'Testing Hostinger Port 465 SSL delivery. Voice note integration verified.'
  });
  console.log('✅ DELIVERED VIA 465 SSL:', info.messageId, info.response);
  t.close();
}

testSend().catch(console.error);
