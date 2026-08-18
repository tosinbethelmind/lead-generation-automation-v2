/**
 * scripts/pair_line2_qr.js
 * 
 * Clean, Standard Baileys QR & Pairing Code for Line 2 (+234 904 605 0469)
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const AUTH_DIR = path.join(__dirname, '../local_db/baileys_auth_line2');

async function start() {
  console.log('========================================================================');
  console.log('📱 WHATSAPP LINE 2 LINKING HUB (+234 904 605 0469)');
  console.log('========================================================================\n');

  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ['Bethelmind Analytics', 'Chrome', '124.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n📸 --- SCAN THIS QR CODE WITH WHATSAPP ON +234 904 605 0469 ---');
      qrcodeTerminal.generate(qr, { small: true });
      console.log('\n(Open WhatsApp ➔ Linked Devices ➔ Link a Device ➔ Scan above)\n');
    }

    if (connection === 'open') {
      console.log('\n🎉 ================================================================');
      console.log('✅ WHATSAPP LINE 2 (+234 904 605 0469) IS NOW FULLY LINKED & ONLINE!');
      console.log('💾 Authentication saved permanently in local_db/baileys_auth_line2');
      console.log('================================================================\n');
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        setTimeout(start, 3000);
      }
    }
  });
}

start().catch(console.error);
