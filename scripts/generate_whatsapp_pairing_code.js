/**
 * @file scripts/generate_whatsapp_pairing_code.js
 * Generates an 8-character WhatsApp pairing code for linking phone numbers via WhatsApp Code
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function requestPairingCode(phoneNumber = '2348022791227') {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  console.log(`\n==================================================`);
  console.log(`📲 REQUESTING WHATSAPP PAIRING CODE FOR: +${cleanPhone}`);
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
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04']
  });

  sock.ev.on('creds.update', saveCreds);

  if (!sock.authState.creds.registered) {
    setTimeout(async () => {
      try {
        console.log(`⏳ Connecting to WhatsApp servers...`);
        const code = await sock.requestPairingCode(cleanPhone);
        const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;
        console.log(`\n🎉 YOUR 8-DIGIT WHATSAPP PAIRING CODE IS:\n`);
        console.log(`\x1b[32m\x1b[1m   ╔══════════════════════╗\x1b[0m`);
        console.log(`\x1b[32m\x1b[1m   ║     ${formattedCode}      ║\x1b[0m`);
        console.log(`\x1b[32m\x1b[1m   ╚══════════════════════╝\x1b[0m\n`);
        console.log(`📌 HOW TO USE ON YOUR PHONE:`);
        console.log(`1. Open WhatsApp on your phone`);
        console.log(`2. Tap Settings (or 3 dots top right) → Linked Devices`);
        console.log(`3. Tap "Link a Device" → "Link with phone number instead"`);
        console.log(`4. Enter code: ${formattedCode}`);
      } catch (err) {
        console.error(`❌ Error requesting pairing code:`, err.message);
      }
    }, 3000);
  } else {
    console.log(`✅ Device is ALREADY linked and active!`);
  }
}

const targetPhone = process.argv[2] || '2348022791227';
requestPairingCode(targetPhone).catch(console.error);
