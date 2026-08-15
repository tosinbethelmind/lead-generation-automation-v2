const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function pairLine1() {
  const targetPhone = '2348022791227';
  const authDir = path.join(__dirname, '../local_db/baileys_auth_line1');

  // Clean stale logged out creds
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
  }
  fs.mkdirSync(authDir, { recursive: true });

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
      console.log(`\n🎉 LINE 1 (+2348022791227) IS NOW FULLY LINKED & AUTHENTICATED! ✅\n`);
      process.exit(0);
    }
  });

  setTimeout(async () => {
    try {
      const code = await sock.requestPairingCode(targetPhone);
      const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;
      console.log(`\n======================================================`);
      console.log(`🔑 FRESH 8-DIGIT PAIRING CODE FOR LINE 1 (+${targetPhone}):`);
      console.log(`\n       ╔══════════════════════╗`);
      console.log(`       ║     ${formattedCode}      ║`);
      console.log(`       ╚══════════════════════╝\n`);
      console.log(`📱 HOW TO ENTER ON YOUR PHONE:`);
      console.log(`1. Open WhatsApp on +${targetPhone}`);
      console.log(`2. Tap Settings ➔ Linked Devices ➔ Link a Device`);
      console.log(`3. Tap "Link with phone number instead"`);
      console.log(`4. Type: ${formattedCode}`);
      console.log(`======================================================\n`);
    } catch (err) {
      console.error('Error requesting code:', err.message);
    }
  }, 3500);
}

pairLine1();
