/**
 * @file scripts/show_whatsapp_qr.js
 * Generates terminal QR Code for scanning with WhatsApp camera
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function startQrCodeSession() {
  console.log(`\n==================================================`);
  console.log(`📲 GENERATING LIVE WHATSAPP SCAN QR CODE`);
  console.log(`==================================================\n`);

  const authDir = path.join(__dirname, '../local_db/baileys_auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: true,
    browser: ['Ubuntu', 'Chrome', '20.0.04']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, qr } = update;
    if (qr) {
      console.log(`\n📌 SCAN THIS QR CODE WITH YOUR WHATSAPP CAMERA:\n`);
      qrcodeTerminal.generate(qr, { small: true });
      console.log(`\nSteps on your phone:`);
      console.log(`1. Open WhatsApp`);
      console.log(`2. Tap Settings (or 3 dots) → Linked Devices`);
      console.log(`3. Tap "Link a Device" and point your phone camera at the QR code above!\n`);
    }

    if (connection === 'open') {
      console.log(`\n🎉 WHATSAPP SUCCESSFULLY CONNECTED & LINKED! ✅\n`);
    }
  });
}

startQrCodeSession().catch(console.error);
