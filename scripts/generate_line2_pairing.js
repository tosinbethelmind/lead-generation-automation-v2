/**
 * scripts/generate_line2_pairing.js
 * Generates an instant, live 8-Digit Pairing Code for WhatsApp Line 2 (+234 904 605 0469)
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const AUTH_DIR = path.join(__dirname, '../local_db/baileys_auth_line2');
const PHONE = '2349046050469';

async function startLine2() {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'open') {
      console.log('\n🎉🎉 SUCCESS! WHATSAPP LINE 2 (+234 904 605 0469) IS NOW CONNECTED! 🎉🎉\n');
    }
    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error)?.output?.statusCode;
      if (statusCode !== DisconnectReason.loggedOut) {
        setTimeout(startLine2, 3000);
      }
    }
  });

  if (!state.creds.registered) {
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(PHONE);
        const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;
        console.log(`\n======================================================`);
        console.log(`🔥 YOUR WHATSAPP LINE 2 PAIRING CODE IS:  ${formattedCode}`);
        console.log(`   Phone Number: +${PHONE}`);
        console.log(`======================================================\n`);
      } catch (err) {
        console.error('Error generating pairing code:', err.message);
      }
    }, 2000);
  }
}

startLine2();
