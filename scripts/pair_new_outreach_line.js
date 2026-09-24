/**
 * @file scripts/pair_new_outreach_line.js
 * 
 * 🚀 PAIR NEW WHATSAPP OUTREACH LINE: +234 913 512 9625
 * 
 * - Configured on Line 4 (local_db/baileys_auth_line4)
 * - Generates 8-character phone pairing code
 * - Permanently backs up session to triple redundant vaults upon connection
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const PHONE_RAW = process.argv[2] || '09135129625';
const LINE_ID = 4;
const DIR_NAME = `baileys_auth_line${LINE_ID}`;

function normalizePhone(raw) {
  let digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) digits = '234' + digits.substring(1);
  else if (digits.length === 10) digits = '234' + digits;
  return digits;
}

const PHONE = normalizePhone(PHONE_RAW);
const LOCAL_DB = path.join(process.cwd(), 'local_db');
const AUTH_DIR = path.join(LOCAL_DB, DIR_NAME);
const REGISTRY_PATH = path.join(LOCAL_DB, 'whatsapp_lines_registry.json');

// Triple backup destinations
const BACKUP_DIRS = [
  path.join(LOCAL_DB, 'baileys_auth_backups', DIR_NAME),
  path.join(process.cwd(), 'config', 'baileys_auth_backups', DIR_NAME),
  path.join(LOCAL_DB, `${DIR_NAME}_backup`)
];

function backupSession() {
  console.log('🔒 Locking session into triple redundant vaults...');
  for (const bDir of BACKUP_DIRS) {
    if (!fs.existsSync(bDir)) fs.mkdirSync(bDir, { recursive: true });
    const files = fs.readdirSync(AUTH_DIR);
    for (const f of files) {
      fs.copyFileSync(path.join(AUTH_DIR, f), path.join(bDir, f));
    }
    console.log(`   ✅ Vault secured: ${bDir}`);
  }
}

function updateRegistry(info) {
  let reg = {};
  if (fs.existsSync(REGISTRY_PATH)) {
    try { reg = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')); } catch (_) {}
  }
  reg[`line_${LINE_ID}`] = {
    line: LINE_ID,
    name: `Line ${LINE_ID} (Outreach)`,
    phone: PHONE,
    connected: true,
    permanentlyLocked: true,
    pairedAt: new Date().toISOString(),
    ...info
  };
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2), 'utf8');
  console.log(`✅ Line ${LINE_ID} registered in whatsapp_lines_registry.json`);
}

async function startPairing() {
  console.log('='.repeat(70));
  console.log(`📲 GENERATING WHATSAPP PAIRING CODE FOR NEW OUTREACH LINE`);
  console.log(`📞 Phone Number: +${PHONE} (${PHONE_RAW})`);
  console.log(`📁 Auth Directory: local_db/${DIR_NAME}`);
  console.log('='.repeat(70) + '\n');

  // Clear stale session
  if (fs.existsSync(AUTH_DIR)) {
    fs.rmSync(AUTH_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  const version = [2, 3000, 1043857760];

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ['Windows', 'Chrome', '128.0.6613.120'],
    connectTimeoutMs: 60000,
    syncFullHistory: false
  });

  sock.ev.on('creds.update', saveCreds);

  let pairingCodeRequested = false;

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      console.log('\n' + '🎉'.repeat(30));
      console.log(`✅ SUCCESS! NEW OUTREACH LINE (+${PHONE}) IS OFFICIALLY CONNECTED!`);
      console.log('🎉'.repeat(30) + '\n');

      backupSession();
      updateRegistry({
        userJid: sock.user?.id,
        userName: sock.user?.name || 'Outreach Desk'
      });

      console.log('\n🚀 Line 4 is now permanently armed and ready for outreach.');
      setTimeout(() => {
        try { sock.end(); } catch (_) {}
        process.exit(0);
      }, 3000);

    } else if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode === DisconnectReason.loggedOut) {
        console.log('❌ Logged out. Re-run to generate a fresh code.');
      } else if (!pairingCodeRequested) {
        console.log(`⚠️ Connection closed (code: ${statusCode}). Retrying...`);
      }
    }
  });

  // Wait 3.5s for WebSocket handshake before requesting pairing code
  await new Promise(r => setTimeout(r, 3500));

  try {
    const code = await sock.requestPairingCode(PHONE);
    pairingCodeRequested = true;
    const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;

    console.log('\n' + '╔' + '═'.repeat(60) + '╗');
    console.log(`║      🔑 8-CHARACTER WHATSAPP PAIRING CODE FOR LINE 4        ║`);
    console.log('╠' + '═'.repeat(60) + '╣');
    console.log(`║                                                            ║`);
    console.log(`║                  👉   ${formattedCode.padEnd(10)}   👈                    ║`);
    console.log(`║                                                            ║`);
    console.log('╚' + '═'.repeat(60) + '╝\n');

    console.log(`📱 HOW TO ENTER THE CODE ON YOUR PHONE (+${PHONE}):`);
    console.log(`   1. Open WhatsApp on the phone with SIM: 0913 512 9625`);
    console.log(`   2. Tap Settings (or 3 dots ⋮) ➔ "Linked Devices"`);
    console.log(`   3. Tap "Link a Device"`);
    console.log(`   4. Tap "Link with phone number instead" at the bottom`);
    console.log(`   5. Enter the code: ${formattedCode}`);
    console.log(`\n⏳ Waiting for you to enter the code on WhatsApp (socket listening)...`);

    // Keep active for 300s (5 minutes) to allow user to type the code
    await new Promise(r => setTimeout(r, 300000));
    console.log('\n⏰ Pairing window timed out. You can run this command again anytime.');
    try { sock.end(); } catch (_) {}
    process.exit(0);

  } catch (err) {
    console.error('❌ Failed to request pairing code:', err.message);
    try { sock.end(); } catch (_) {}
    process.exit(1);
  }
}

startPairing().catch(console.error);
