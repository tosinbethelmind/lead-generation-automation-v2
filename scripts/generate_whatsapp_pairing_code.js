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
  } else {
    // Check if creds is already registered
    const credsPath = path.join(authDir, 'creds.json');
    if (fs.existsSync(credsPath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
        if (!existing.registered) {
          // Stale / unlinked session: clean up for fresh pairing
          fs.readdirSync(authDir).forEach(f => fs.unlinkSync(path.join(authDir, f)));
        }
      } catch (_) {
        fs.readdirSync(authDir).forEach(f => fs.unlinkSync(path.join(authDir, f)));
      }
    }
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const version = [2, 3000, 1043857760];

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    connectTimeoutMs: 30000
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection } = update;
    if (connection === 'open') {
      console.log(`\n🎉 LINE ${selectedLineKey} (${lineConfig.name} - +${cleanPhone}) IS LINKED & ACTIVE! ✅\n`);
      
      // Update registry
      const regPath = path.join(__dirname, '../local_db/whatsapp_lines_registry.json');
      try {
        let reg = fs.existsSync(regPath) ? JSON.parse(fs.readFileSync(regPath, 'utf8')) : {};
        reg[`line_${selectedLineKey}`] = {
          line: parseInt(selectedLineKey),
          phone: cleanPhone,
          name: lineConfig.name,
          connected: true,
          lastChecked: new Date().toISOString()
        };
        fs.writeFileSync(regPath, JSON.stringify(reg, null, 2), 'utf8');
      } catch (_) {}

      setTimeout(() => process.exit(0), 2000);
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
        console.log(`⏳ Waiting for phone authorization (listening for 3 minutes)...`);
      } catch (err) {
        console.error(`❌ Error requesting pairing code:`, err.message);
      }
    }, 4500);

    // Keep event loop alive for 3 minutes waiting for user input on phone
    const keepAlive = setInterval(() => {}, 5000);
    setTimeout(() => {
      clearInterval(keepAlive);
      console.log('\n⏱️ Pairing code expired after 3 minutes.');
      process.exit(0);
    }, 180000);
  } else {
    console.log(`✅ Line ${selectedLineKey} is ALREADY linked and active!`);
  }
}

requestPairingCode().catch(console.error);
