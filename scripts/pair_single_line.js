const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

const authDir = path.join(__dirname, '../sessions/session_line1');
console.log('Clearing old session folder:', authDir);
try {
  fs.rmSync(authDir, { recursive: true, force: true });
  fs.mkdirSync(authDir, { recursive: true });
} catch (_) {}

async function pair() {
  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'connecting') {
      console.log('⚡ Initializing WhatsApp socket for +234 702 626 6946...');
    }
    if (connection === 'open') {
      console.log('✅ WHATSAPP LINE 1 CONNECTED SUCCESSFULLY!');
    }
    if (connection === 'close') {
      console.log('Connection closed:', lastDisconnect?.error?.message);
    }
  });

  setTimeout(async () => {
    try {
      console.log('Requesting 8-digit Pairing Code for +234 802 279 1227...');
      const code = await sock.requestPairingCode('2348022791227');
      console.log('\n==================================================');
      console.log(`🔑 YOUR WHATSAPP LINE 1 PAIRING CODE:  ${code}`);
      console.log('==================================================\n');
    } catch (e) {
      console.error('Pairing code request error:', e.message);
    }
  }, 3000);
}

pair().catch(console.error);
