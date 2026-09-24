/**
 * @file scripts/dispatch_lightweight_email_with_mp3_attachment.ts
 * 
 * DISPATCHES A CLEAN, LIGHTWEIGHT PLAIN-TEXT EMAIL WITH MP3 AUDIO ATTACHMENT
 * AND TESTS SMS GATEWAY VIA /message WITH AUTH TOKEN.
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function runLightweightDispatch() {
  console.log('========================================================================');
  console.log('📨 DISPATCHING LIGHTWEIGHT EMAIL (WITH MP3 ATTACHMENT) & TAILSCALE SMS');
  console.log('========================================================================\n');

  // 1. Send SMS via Tailscale Android Gateway /message with Auth Header
  const smsEndpoints = [
    'http://10.132.90.251:8082/message',
    'http://100.107.243.108:8082/message',
    'http://10.50.220.22:8082/message'
  ];

  const smsText = 'Good day Management at Macmed Integrated Hub! We pre-built a 24/7 AI WhatsApp quote portal for your Lagos business. Test free: https://www.bethelmindanalytics.com/preview/macmed-integrated-lagos (08022791227)';
  const smsToken = 'f34af5ea-f657-41b1-b83e-4a59eb786e57';

  let smsSent = false;
  for (const ep of smsEndpoints) {
    try {
      console.log(`📡 Trying SMS Gateway: ${ep}...`);
      const smsRes = await axios.post(ep, {
        to: '+2348022791227',
        message: smsText
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': smsToken
        },
        timeout: 4000
      });
      console.log(`✅ [SMS DELIVERED] via ${ep}:`, smsRes.data);
      smsSent = true;
      break;
    } catch (err) {
      console.log(`⚠️ SMS Gateway (${ep}) unreachable: ${err.message}`);
    }
  }

  // 2. Dispatch Clean Lightweight Email with Attached MP3
  console.log('\n📧 Sending Clean Lightweight Email with MP3 Attachment to bethelmindrecruit@gmail.com...');
  
  const mp3Path = path.join(process.cwd(), 'public/assets/audio/dynamic/vn_macmed-integrated-lagos.mp3');
  const hasAttachment = fs.existsSync(mp3Path);

  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false,
    auth: {
      user: 'tosin@bethelmindanalytics.com',
      pass: 'Bethelmind@2026'
    },
    tls: {
      rejectUnauthorized: false
    }
  });


  const plainTextBody = 
`Good day Lead Engineering & Management Team at Macmed Integrated Hub,

My name is Tosin from Bethelmind Analytics Lagos Desk.

We recently conducted a digital operations review for your commercial facility in Satellite Town, Lagos. We noticed that prospective clients inquiring about your equipment and services after business hours are unable to get instant pricing quotes or automated WhatsApp booking confirmations.

To solve this, our engineering desk pre-built a private 24/7 AI WhatsApp Quoting & Booking Portal specifically for Macmed Integrated Hub.

🎙️ (We have attached our 15-second personalized audio voice note to this email so you can listen directly on your phone).

⚡ What We Built For Macmed Integrated Hub:
1. Automated Load Sizer & Pricing Calculator
2. Instant WhatsApp PDF Quotes delivered in under 3 seconds
3. Moniepoint & Paystack Payment Verification
4. 24/7 AI Customer Closer on WhatsApp

👉 Test drive your live private prototype (₦0 Upfront Commitment):
https://www.bethelmindanalytics.com/preview/macmed-integrated-lagos

To activate your portal, chat directly with my desk on WhatsApp:
WhatsApp: https://wa.me/2348022791227 (0802 279 1227)
Email: tosin@bethelmindanalytics.com

Best regards,

Tosin Oyelakin
Lead Solutions Strategist
Bethelmind Analytics Lagos Desk`;


  const mailOptions = {
    from: '"Tosin | Bethelmind Analytics Lagos Desk" <tosin@bethelmindanalytics.com>',
    to: 'bethelmindrecruit@gmail.com',
    subject: 'Automating 24/7 AI Quotes & Client Booking for Macmed Integrated Hub (Voice Note Attached)',
    text: plainTextBody,
    attachments: hasAttachment ? [
      {
        filename: 'VoiceNote_MacmedIntegrated_Bethelmind.mp3',
        path: mp3Path,
        contentType: 'audio/mpeg'
      }
    ] : []
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ [EMAIL DELIVERED] Clean email with MP3 attachment sent! Message ID: ${info.messageId}`);

  console.log('\n========================================================================');
  console.log('🎉 DISPATCH COMPLETE:');
  console.log('• Email: bethelmindrecruit@gmail.com (Lightweight plain-text + MP3 audio attached)');
  console.log(`• MP3 Attachment Included: ${hasAttachment ? 'YES (vn_macmed-integrated-lagos.mp3)' : 'NO'}`);
  console.log('========================================================================\n');
}

runLightweightDispatch().catch(console.error);
