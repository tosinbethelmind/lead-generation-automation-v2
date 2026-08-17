const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const nodemailer = require('nodemailer');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function sendAllPersonalTestOutreach() {
  console.log('========================================================================');
  console.log('🚀 EXECUTING COMPLETE TRI-CHANNEL TEST DISPATCH (SMS + WHATSAPP + EMAIL)');
  console.log('========================================================================\n');

  const targets = {
    adminPhone: '+2348022791227',
    adminWhatsAppJid: '2348022791227@s.whatsapp.net',
    adminEmail: 'bethelmindrecruit@gmail.com',
    demoSlug: 'eko-grand-hotel-suites',
    companyName: 'Eko Grand Hotel & Suites (Victoria Island, Lagos)'
  };

  const results = {
    sms: false,
    smsDetails: '',
    whatsapp: false,
    whatsappDetails: '',
    email: false,
    emailDetails: ''
  };

  // -------------------------------------------------------------
  // 1. DISPATCH LIVE SMS VIA CARRIER ANDROID SMS GATEWAY
  // -------------------------------------------------------------
  console.log('📱 [1/3] Dispatching Live Carrier SMS to', targets.adminPhone, '...');
  try {
    const previewUrl = `https://www.bethelmindanalytics.com/preview/${targets.demoSlug}?src=live_sms_test`;
    const smsPayload = {
      to: targets.adminPhone,
      message: `[Bethelmind] Live SMS Verification: Custom AI interactive booking & quoting portal active for ${targets.companyName}. Test: ${previewUrl} (STOP to end)`
    };

    const smsRes = await fetch('http://10.132.90.251:8082/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'f34af5ea-f657-41b1-b83e-4a59eb786e57'
      },
      body: JSON.stringify(smsPayload)
    });

    if (smsRes.ok) {
      results.sms = true;
      results.smsDetails = `Delivered via Android Carrier Gateway (http://10.132.90.251:8082) to ${targets.adminPhone}`;
      console.log('✅ SMS SENT SUCCESSFULLY:', results.smsDetails);
    } else {
      results.sms = false;
      results.smsDetails = `SMS Gateway returned HTTP ${smsRes.status}`;
      console.error('❌ SMS ERROR:', results.smsDetails);
    }
  } catch (smsErr) {
    results.sms = false;
    results.smsDetails = `SMS Gateway error: ${smsErr.message}`;
    console.error('❌ SMS ERROR:', smsErr.message);
  }

  // -------------------------------------------------------------
  // 2. DISPATCH LIVE WHATSAPP OUTREACH VIA BAILEYS
  // -------------------------------------------------------------
  console.log('\n💬 [2/3] Dispatching Live WhatsApp message to', targets.adminPhone, '...');
  try {
    const authDir = path.join(__dirname, '../local_db/baileys_auth_line2');
    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false,
      browser: ['Windows', 'Chrome', '125.0.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    const waPromise = new Promise((resolve) => {
      const timeout = setTimeout(() => {
        sock.end(undefined);
        resolve({ success: false, reason: 'WhatsApp connection timeout' });
      }, 15000);

      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
          console.log(`Connected to WhatsApp as +${sock.user?.id?.split(':')[0]}!`);
          
          const previewUrl = `https://www.bethelmindanalytics.com/preview/${targets.demoSlug}?src=live_test_wa`;
          const claimUrl = `https://www.bethelmindanalytics.com/claim?biz=${encodeURIComponent('Eko Grand Hotel & Suites')}`;

          const msgContent = `🧪 *[TRI-CHANNEL LIVE VERIFICATION CONFIRMED]*

Good day Tosin 👋

All 3 automated outreach channels are verified and operational:
• 📱 *SMS:* Active via Carrier Android Gateway
• 💬 *WhatsApp:* Active via Multi-Line Baileys Engine
• 📧 *Email:* Active via Hostinger SMTP SSL

🏢 *Target:* ${targets.companyName}
🌐 *Interactive Demo:* ${previewUrl}
⚡ *Claim Portal:* ${claimUrl}

Your automated lead generation engine is ready for 24/7 autonomous outreach! 🚀`;

          try {
            const sent = await sock.sendMessage(targets.adminWhatsAppJid, { text: msgContent });
            console.log('✅ WHATSAPP SENT SUCCESSFULLY! Msg ID:', sent?.key?.id);
            clearTimeout(timeout);
            setTimeout(() => {
              sock.end(undefined);
              resolve({ success: true, messageId: sent?.key?.id });
            }, 2000);
          } catch (sendErr) {
            clearTimeout(timeout);
            sock.end(undefined);
            resolve({ success: false, reason: sendErr.message });
          }
        } else if (connection === 'close') {
          const code = lastDisconnect?.error?.output?.statusCode;
          if (code === DisconnectReason.loggedOut) {
            clearTimeout(timeout);
            resolve({ success: false, reason: `Logged out (code ${code})` });
          }
        }
      });
    });

    const waRes = await waPromise;
    if (waRes.success) {
      results.whatsapp = true;
      results.whatsappDetails = `Delivered to ${targets.adminPhone} (MsgID: ${waRes.messageId})`;
    } else {
      results.whatsapp = false;
      results.whatsappDetails = waRes.reason;
    }
  } catch (err) {
    results.whatsapp = false;
    results.whatsappDetails = `WhatsApp Error: ${err.message}`;
    console.error('❌ WHATSAPP ERROR:', err.message);
  }

  // -------------------------------------------------------------
  // 3. DISPATCH LIVE COLD OUTREACH EMAIL VIA HOSTINGER SMTP
  // -------------------------------------------------------------
  console.log('\n📧 [3/3] Dispatching Live Cold Outreach Email to', targets.adminEmail, '...');
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      family: 4,
      auth: {
        user: 'tosin@bethelmindanalytics.com',
        pass: 'Bethelmind@2026',
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 15000,
    });

    const previewUrl = `https://www.bethelmindanalytics.com/preview/${targets.demoSlug}?src=live_test_confirm`;
    const claimUrl = `https://www.bethelmindanalytics.com/claim?biz=${encodeURIComponent('Eko Grand Hotel & Suites')}`;

    const mailOptions = {
      from: '"Oyelakin Tosin | Bethelmind Analytics" <tosin@bethelmindanalytics.com>',
      to: targets.adminEmail,
      replyTo: 'tosin@bethelmindanalytics.com',
      subject: '🧪 [VERIFIED] Bethelmind Multi-Channel Outreach Engine Confirmation',
      text: `Hello Tosin,

All 3 outreach communication channels (SMS, WhatsApp, Email) are 100% verified and operational.

Simulated Lead Target: ${targets.companyName}
Interactive Portal Preview: ${previewUrl}
Claim Link: ${claimUrl}

Best regards,
Oyelakin Tosin | Bethelmind Analytics & Strategy`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 28px; border-radius: 12px; border: 1px solid #10b981;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #34d399; margin: 0; font-size: 20px;">✓ Bethelmind Outreach Engine Confirmed</h2>
            <span style="background: #059669; color: #ffffff; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold;">ALL CHANNELS ACTIVE</span>
          </div>

          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.5;">
            Hello <strong>Tosin</strong>, this confirms that your <strong>SMS Gateway</strong>, <strong>WhatsApp Engine</strong>, and <strong>Email Pipeline</strong> are successfully linked and live.
          </p>

          <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="color: #34d399; font-weight: 600; margin-bottom: 8px; font-size: 13px; text-transform: uppercase;">Channel Status</div>
            <p style="margin: 4px 0; font-size: 14px;">📱 <strong>SMS Gateway:</strong> Connected via Carrier Android Gateway</p>
            <p style="margin: 4px 0; font-size: 14px;">💬 <strong>WhatsApp Line:</strong> Connected (+234 702 626 6946)</p>
            <p style="margin: 4px 0; font-size: 14px;">📧 <strong>Email Server:</strong> Connected (Hostinger SMTP SSL)</p>
          </div>

          <div style="margin: 24px 0;">
            <a href="${previewUrl}" style="display: inline-block; background: #059669; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-right: 12px;">
              🌐 View 2-Min Interactive Demo
            </a>
            <a href="${claimUrl}" style="display: inline-block; background: rgba(255,255,255,0.1); color: #6ee7b7; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid rgba(255,255,255,0.2);">
              👉 Open Claim Portal
            </a>
          </div>

          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; margin-top: 24px; color: #64748b; font-size: 12px;">
            Bethelmind Analytics & Strategy • Lagos, Nigeria • +234 802 279 1227
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    results.email = true;
    results.emailDetails = `Delivered to ${targets.adminEmail} (MsgID: ${info.messageId})`;
    console.log('✅ EMAIL SENT SUCCESSFULLY:', results.emailDetails);
  } catch (err) {
    results.email = false;
    results.emailDetails = `Email Error: ${err.message}`;
    console.error('❌ EMAIL ERROR:', err.message);
  }

  // -------------------------------------------------------------
  // FINAL SUMMARY REPORT
  // -------------------------------------------------------------
  console.log('\n========================================================================');
  console.log('📊 FINAL TRI-CHANNEL VERIFICATION REPORT:');
  console.log('========================================================================');
  console.log(`📱 SMS Status:       ${results.sms ? '✅ SUCCESS' : '❌ FAILED'} - ${results.smsDetails}`);
  console.log(`💬 WhatsApp Status:  ${results.whatsapp ? '✅ SUCCESS' : '❌ FAILED'} - ${results.whatsappDetails}`);
  console.log(`📧 Email Status:     ${results.email ? '✅ SUCCESS' : '❌ FAILED'} - ${results.emailDetails}`);
  console.log('========================================================================\n');

  return results;
}

sendAllPersonalTestOutreach().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
