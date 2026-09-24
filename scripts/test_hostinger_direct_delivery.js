const nodemailer = require('nodemailer');
const fs = require('fs');

async function testHostinger() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: 'tosin@bethelmindanalytics.com',
      pass: 'Bethelmind@2026'
    },
    tls: { rejectUnauthorized: false }
  });

  try {
    const info = await transporter.sendMail({
      from: '"Tosin Oyelakin | Bethelmind Analytics Lagos Desk" <tosin@bethelmindanalytics.com>',
      replyTo: 'bethelmindrecruit@gmail.com',
      to: 'bethelmindrecruit@gmail.com',
      subject: 'Hostinger Direct SMTP Delivery Test (Voice Note Attached)',
      text: 'Testing direct delivery from tosin@bethelmindanalytics.com via Hostinger SMTP Port 587',
      attachments: [{
        filename: 'voice_note_briefing.mp3',
        path: './public/sample_voice_ng.mp3'
      }]
    });
    console.log('✅ Hostinger Direct SMTP Delivered! MessageId:', info.messageId, '| Response:', info.response);
  } catch (err) {
    console.error('❌ Hostinger Direct SMTP Error:', err.message);
  }
}

testHostinger();
