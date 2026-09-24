const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

function generateCodeForLine(phone, lineName, subDir) {
  return new Promise(async (resolve) => {
    const authDir = path.join(__dirname, '../local_db', subDir);
    console.log(`\n🔄 Resetting auth session for ${lineName} (+${phone})...`);

    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true });
    }
    fs.mkdirSync(authDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    let version = [2, 3000, 1043857760];
    try {
      const v = await fetchLatestBaileysVersion();
      version = v.version;
    } catch (_) {}

    const sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false,
      browser: ['Windows', 'Chrome', '125.0.0.0'],
      connectTimeoutMs: 30000,
      syncFullHistory: false
    });

    sock.ev.on('creds.update', saveCreds);

    await new Promise(r => setTimeout(r, 3500));

    try {
      const code = await sock.requestPairingCode(phone);
      const formatted = code?.match(/.{1,4}/g)?.join('-') || code;
      console.log(`==================================================`);
      console.log(`🔑 8-DIGIT PAIRING CODE FOR ${lineName} (+${phone}):`);
      console.log(`👉   ${formatted}   👈`);
      console.log(`==================================================\n`);
      try { sock.end(); } catch (_) {}
      resolve(formatted);
    } catch (err) {
      console.error(`❌ Error generating code for ${lineName}:`, err.message);
      try { sock.end(); } catch (_) {}
      resolve(null);
    }
  });
}

async function main() {
  console.log("🚀 GENERATING 8-DIGIT PAIRING CODES FOR WHATSAPP LINES...\n");
  
  console.log("1️⃣ ADMIN LINE (+2348022791227)");
  await generateCodeForLine('2348022791227', 'ADMIN LINE', 'baileys_auth_line1');
  
  await new Promise(r => setTimeout(r, 2000));

  console.log("2️⃣ OUTREACH LINE 2 (+2349046050469)");
  await generateCodeForLine('2349046050469', 'OUTREACH LINE 2', 'baileys_auth_line3');

  process.exit(0);
}

main();
