const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function sendActionReportToAdmin() {
  console.log('========================================================================');
  console.log('🚀 SENDING ACTION REQUIRED REPORT TO ADMIN WHATSAPP (+2348022791227)');
  console.log('========================================================================\n');

  const adminPhone = '+2348022791227';
  const adminJid = '2348022791227@s.whatsapp.net';

  const reportText = `🎯 *[BETHELMIND 3-HOUR ACTION REPORT: TOP 3 DEALS]*
🕒 ${new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos' })} WAT

Here are the Top Genuine Importer Deals Ready to Lock:

*1. Jacio International Company Ltd*
• Location: ASPAMDA Trade Fair Complex, Lagos
• Volume: $65,000 USDT (Container Supplier Clearance)
• Quoted Rate: ₦1,520/$ (15-Min Guaranteed Lock)
• Spread Profit: ₦25/$ -> *+₦1,625,000 NGN*
• Client Phone: 0818 558 7222
👉 1-Click WhatsApp Handshake:
https://wa.me/2348185587222?text=Good%20day%20Jacio%20International%20team!%20Bethelmind%20Analytics%20has%20locked%20your%20%2465%2C000%20USD%20supplier%20clearance%20rate%20at%20%E2%82%A61%2C520%2F%24%20with%20instant%20escrow.

*2. Maldini Granites & Marble Imports*
• Location: Surulere, Lagos
• Volume: $65,000 USDT (Freight Wire)
• Quoted Rate: ₦1,520/$ (15-Min Guaranteed Lock)
• Spread Profit: ₦25/$ -> *+₦1,625,000 NGN*
• Client Phone: 0803 307 9719
👉 1-Click WhatsApp Handshake:
https://wa.me/2348033079719?text=Good%20day%20Maldini%20Imports%20team!%20Bethelmind%20Analytics%20has%20locked%20your%20%2465%2C000%20USD%20supplier%20clearance%20rate%20at%20%E2%82%A61%2C520%2F%24%20with%20instant%20escrow.

*3. COHBS International*
• Location: Ikeja, Lagos
• Volume: $35,000 USDT (Hardware Invoices)
• Quoted Rate: ₦1,520/$ (15-Min Guaranteed Lock)
• Spread Profit: ₦25/$ -> *+₦875,000 NGN*
• Client Phone: 0817 041 7114
👉 1-Click WhatsApp Handshake:
https://wa.me/2348170417114?text=Good%20day%20COHBS%20International!%20Bethelmind%20Analytics%20has%20locked%20your%20%2435%2C000%20USD%20supplier%20clearance%20rate%20at%20%E2%82%A61%2C520%2F%24%20with%20instant%20escrow.

🏦 *All Spreads Settle Direct to OPay:*
OPay: 7034297995 (Oyelakin Tosin Matthew)`;

  const candidateDirs = [
    path.join(__dirname, '../local_db/baileys_auth_permanent_master'),
    path.join(__dirname, '../local_db/baileys_auth_line1'),
    path.join(__dirname, '../local_db/baileys_auth_outreach1'),
    path.join(__dirname, '../local_db/baileys_auth')
  ];

  for (const authDir of candidateDirs) {
    if (!fs.existsSync(path.join(authDir, 'creds.json'))) continue;

    console.log(`Trying WhatsApp auth session: ${path.basename(authDir)}...`);
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

      const delivered = await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          try { sock.end(undefined); } catch (_) {}
          resolve(false);
        }, 12000);

        sock.ev.on('connection.update', async (update) => {
          const { connection, lastDisconnect } = update;
          if (connection === 'open') {
            console.log(`🎉 WhatsApp connected as +${sock.user?.id?.split(':')[0]}! Dispatching to ${adminPhone}...`);
            try {
              const sent = await sock.sendMessage(adminJid, { text: reportText });
              console.log(`✅ DISPATCHED TO ADMIN WHATSAPP! Msg ID: ${sent?.key?.id}`);
              clearTimeout(timeout);
              setTimeout(() => {
                try { sock.end(undefined); } catch (_) {}
                resolve(true);
              }, 2000);
            } catch (err) {
              console.error('Send error:', err.message);
              clearTimeout(timeout);
              try { sock.end(undefined); } catch (_) {}
              resolve(false);
            }
          }
        });
      });

      if (delivered) {
        console.log('🚀 Action Report successfully delivered to your WhatsApp!');
        return;
      }
    } catch (e) {
      console.warn(`Auth session ${path.basename(authDir)} error:`, e.message);
    }
  }

  console.log('Notice: Baileys sessions did not deliver immediately.');
}

sendActionReportToAdmin().catch(console.error);
