const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function sendActionableUpdateToAdmin() {
  console.log('========================================================================');
  console.log('📱 DISPATCHING ACTIONABLE DEALS TO ADMIN WHATSAPP & SMS: +2348022791227');
  console.log('========================================================================\n');

  const adminPhone = '+2348022791227';
  const adminJid = '2348022791227@s.whatsapp.net';

  const waContent = `🤝 *[BETHELMIND 3-HOUR ACTIONABLE OTC DEALS REPORT]*
🕒 ${new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos' })} WAT

Here are the Top Genuine Importer Deals Scouted Right Now:

*1. Jacio International Company Ltd*
• Location: ASPAMDA Trade Fair Complex, Lagos
• Volume: $65,000 USDT (Trade Fair Auto Logistics)
• Spread Profit: ₦25/$ -> *+₦1,625,000 NGN*
• Client Line: 0818 558 7222
👉 1-Click WhatsApp Handshake:
https://wa.me/2348185587222?text=Good%20day%20Jacio%20International%20team!%20Bethelmind%20Analytics%20has%20locked%20your%20%2465%2C000%20USD%20supplier%20clearance%20rate%20at%20%E2%82%A61%2C520%2F%24%20with%20instant%20escrow.

*2. Maldini Granites & Marble Imports*
• Location: Surulere, Lagos
• Volume: $65,000 USDT (Container Freight Wire)
• Spread Profit: ₦25/$ -> *+₦1,625,000 NGN*
• Client Line: 0803 307 9719
👉 1-Click WhatsApp Handshake:
https://wa.me/2348033079719?text=Good%20day%20Maldini%20Imports%20team!%20Bethelmind%20Analytics%20has%20locked%20your%20%2465%2C000%20USD%20supplier%20clearance%20rate%20at%20%E2%82%A61%2C520%2F%24%20with%20instant%20escrow.

*3. COHBS International*
• Location: Ikeja, Lagos
• Volume: $35,000 USDT (Hardware Import)
• Spread Profit: ₦25/$ -> *+₦875,000 NGN*
• Client Line: 0817 041 7114
👉 1-Click WhatsApp Handshake:
https://wa.me/2348170417114?text=Good%20day%20COHBS%20International!%20Bethelmind%20Analytics%20has%20locked%20your%20%2435%2C000%20USD%20supplier%20clearance%20rate%20at%20%E2%82%A61%2C520%2F%24%20with%20instant%20escrow.

🏦 *All Spreads Settle Direct to OPay:*
OPay: 7034297995 (Oyelakin Tosin Matthew)`;

  // 1. Send via WhatsApp Baileys
  console.log('💬 [1/2] Connecting to Baileys WhatsApp Session...');
  const authDirs = ['baileys_auth_permanent_master', 'baileys_auth_line2', 'baileys_auth_line1'];
  let waSent = false;

  for (const dirName of authDirs) {
    if (waSent) break;
    const authDir = path.join(__dirname, `../local_db/${dirName}`);
    if (!fs.existsSync(authDir)) continue;

    try {
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

      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          sock.end(undefined);
          resolve(false);
        }, 8000);

        sock.ev.on('connection.update', async (update) => {
          const { connection } = update;
          if (connection === 'open') {
            console.log(`Connected to WhatsApp via ${dirName}! Sending message to ${adminPhone}...`);
            try {
              const sent = await sock.sendMessage(adminJid, { text: waContent });
              console.log('✅ WHATSAPP DISPATCHED SUCCESSFULLY! Msg ID:', sent?.key?.id);
              waSent = true;
              clearTimeout(timeout);
              setTimeout(() => {
                sock.end(undefined);
                resolve(true);
              }, 1500);
            } catch (sendErr) {
              console.error('Send error:', sendErr.message);
              clearTimeout(timeout);
              sock.end(undefined);
              resolve(false);
            }
          }
        });
      });
    } catch (e) {
      console.warn(`Auth ${dirName} attempt notice:`, e.message);
    }
  }

  // 2. Also dispatch Live SMS to guarantee instantaneous delivery to your handset
  console.log('\n📲 [2/2] Dispatching instant Carrier SMS Alert to', adminPhone, '...');
  try {
    const smsPayload = {
      to: adminPhone,
      message: `[Bethelmind Alert] 3 Genuine OTC Deals ready: Jacio Int'l ($65k / +N1.625M), Maldini Imports ($65k / +N1.625M), COHBS ($35k / +N875k). Check WhatsApp/Email for 1-click links.`
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
      console.log('✅ LIVE SMS DISPATCHED SUCCESSFULLY TO:', adminPhone);
    } else {
      console.log(`SMS Gateway HTTP response: ${smsRes.status}`);
    }
  } catch (err) {
    console.log('SMS Gateway note:', err.message);
  }

  console.log('\n✨ Dispatch cycle complete.');
}

sendActionableUpdateToAdmin().catch(console.error);
