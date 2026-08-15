/**
 * @file scripts/generate_whatsapp_pairing_code.js
 * Generates an 8-character WhatsApp pairing code for linking phone numbers via WhatsApp Code.
 * Supports isolated auth directories for all 3 lines.
 * 
 * Usage:
 *   node scripts/generate_whatsapp_pairing_code.js 1 <phone_number>   # Links Line 1
 *   node scripts/generate_whatsapp_pairing_code.js 2 <phone_number>   # Links Line 2
 *   node scripts/generate_whatsapp_pairing_code.js 3 <phone_number>   # Links Line 3
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const LINES_CONFIG = {
  '1': { name: 'Admin Tier 2 Line', defaultPhone: '2348022791227', dir: 'baileys_auth_line1' },
  '2': { name: 'Outreach Line 1', defaultPhone: '2347026266946', dir: 'baileys_auth_line2' },
  '3': { name: 'Outreach Line 2', defaultPhone: '2349046050469', dir: 'baileys_auth_line3' },
};

async function requestPairingCode() {
  const lineArg = process.argv[2] || '1';
  const phoneArg = process.argv[3];

  let selectedLineKey = '1';
  let targetPhone = '';

  if (LINES_CONFIG[lineArg]) {
    selectedLineKey = lineArg;
    targetPhone = phoneArg || LINES_CONFIG[lineArg].defaultPhone;
  } else {
    // If user passed phone directly as first argument
    targetPhone = lineArg.replace(/[^0-9]/g, '');
  }

  const lineConfig = LINES_CONFIG[selectedLineKey] || LINES_CONFIG['1'];
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');

  console.log(`\n==================================================`);
  console.log(`📲 REQUESTING PAIRING CODE FOR LINE ${selectedLineKey}: ${lineConfig.name}`);
  console.log(`📞 Phone Number: +${cleanPhone}`);
  console.log(`📁 Auth Storage: local_db/${lineConfig.dir}`);
  console.log(`==================================================\n`);

  const authDir = path.join(__dirname, '../local_db', lineConfig.dir);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  let version = [2, 3000, 1035194821];
  try {
    const v = await fetchLatestBaileysVersion();
    version = v.version;
  } catch (_) {}

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ['Windows', 'Chrome', '125.0.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection } = update;
    if (connection === 'open') {
      console.log(`\n🎉 LINE ${selectedLineKey} (${lineConfig.name} - +${cleanPhone}) IS LINKED & ACTIVE! ✅\n`);
      process.exit(0);
    }
  });

  if (!sock.authState.creds.registered) {
    console.log(`⏳ Connecting to WhatsApp servers...`);
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(cleanPhone);
        const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;
        console.log(`\n🎉 YOUR 8-DIGIT PAIRING CODE FOR LINE ${selectedLineKey} IS:\n`);
        console.log(`\x1b[32m\x1b[1m   ╔══════════════════════╗\x1b[0m`);
        console.log(`\x1b[32m\x1b[1m   ║     ${formattedCode}      ║\x1b[0m`);
        console.log(`\x1b[32m\x1b[1m   ╚══════════════════════╝\x1b[0m\n`);
        console.log(`📌 HOW TO ENTER ON YOUR PHONE FOR +${cleanPhone}:`);
        console.log(`1. Open WhatsApp on the phone with number +${cleanPhone}`);
        console.log(`2. Tap Settings (iOS) or 3 dots (Android) → Linked Devices`);
        console.log(`3. Tap "Link a Device" → "Link with phone number instead"`);
        console.log(`4. Enter the code above: ${formattedCode}\n`);
      } catch (err) {
        console.error(`❌ Error requesting pairing code:`, err.message);
      }
    }, 4000);
  } else {
    console.log(`✅ Line ${selectedLineKey} is ALREADY linked and active!`);
  }
}

requestPairingCode().catch(console.error);
