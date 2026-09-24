const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

const targetPhone = process.argv[2] || '2347026266946';
const authDir = path.join(__dirname, '../sessions/session_line1');

console.log(`Clearing session for dedicated outreach line (${targetPhone})...`);
try {
  fs.rmSync(authDir, { recursive: true, force: true });
  fs.mkdirSync(authDir, { recursive: true });
} catch (_) {}

async function main() {
  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection } = update;
    if (connection === 'connecting') {
      console.log(`⚡ Initializing WhatsApp socket for outreach line +${targetPhone}...`);
    }
    if (connection === 'open') {
      console.log(`✅ OUTREACH WHATSAPP LINE (+${targetPhone}) CONNECTED SUCCESSFULLY!`);
    }
  });

  setTimeout(async () => {
    try {
      console.log(`Requesting 8-digit Pairing Code for +${targetPhone}...`);
      const code = await sock.requestPairingCode(targetPhone.replace(/\D/g, ''));
      console.log('\n==================================================');
      console.log(`🔑 OUTREACH WHATSAPP PAIRING CODE:  ${code}`);
      console.log('==================================================\n');
    } catch (e) {
      console.error('Pairing code error:', e.message);
    }
  }, 3000);
}

main().catch(console.error);
