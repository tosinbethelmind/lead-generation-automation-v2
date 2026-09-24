const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function main() {
  const targetPhone = '2349046050469';
  const lineName = 'OUTREACH LINE 2';
  const subDir = 'baileys_auth_line3';
  const authDir = path.join(__dirname, '../local_db', subDir);

  console.log(`\n🔄 Initializing fresh auth directory for ${lineName} (+${targetPhone})...`);

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

  let codeRequested = false;

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr } = update;

    if ((qr || connection === 'connecting') && !codeRequested) {
      codeRequested = true;
      try {
        await new Promise(r => setTimeout(r, 2000));
        const code = await sock.requestPairingCode(targetPhone);
        const formatted = code?.match(/.{1,4}/g)?.join('-') || code;
        console.log(`==================================================`);
        console.log(`🔑 8-DIGIT PAIRING CODE FOR ${lineName} (+${targetPhone}):`);
        console.log(`👉   ${formatted}   👈`);
        console.log(`==================================================\n`);
        process.exit(0);
      } catch (err) {
        console.error(`❌ Error generating code for ${lineName}:`, err.message);
        process.exit(1);
      }
    }

    if (connection === 'open') {
      console.log(`🎉 ${lineName} (+${targetPhone}) LINKED & ACTIVE!`);
      process.exit(0);
    }
  });
}

main();
