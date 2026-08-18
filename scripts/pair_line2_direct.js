/**
 * scripts/pair_line2_direct.js
 * 
 * Persistent Pairing Session for Line 2 (+234 904 605 0469)
 * Keeps connection active while waiting for user to enter code
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const AUTH_DIR = path.join(__dirname, '../local_db/baileys_auth_line2');
const PHONE_NUMBER = '2349046050469';

let sock = null;

async function startPairing() {
  console.log('========================================================================');
  console.log('📱 DIRECT WHATSAPP LINE 2 PAIRING SESSION (+234 904 605 0469)');
  console.log('========================================================================\n');

  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    connectTimeoutMs: 120000,
    defaultQueryTimeoutMs: 120000
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'connecting') {
      console.log('🔄 Connecting to WhatsApp Pairing Gateway...');
    }

    if (connection === 'open') {
      console.log('\n🎉 ================================================================');
      console.log('✅ WHATSAPP LINE 2 (+234 904 605 0469) SUCCESSFULLY AUTHENTICATED!');
      console.log('💾 Session keys solidified permanently in local_db/baileys_auth_line2');
      console.log('================================================================\n');
      process.exit(0);
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error)?.output?.statusCode;
      const isLoggedOut = statusCode === DisconnectReason.loggedOut;
      if (!isLoggedOut) {
        console.log(`Socket closed (Code: ${statusCode || 'unknown'}). Refreshing session...`);
        setTimeout(startPairing, 3000);
      }
    }
  });

  // Request code after socket connects
  if (!sock.authState.creds.registered) {
    setTimeout(async () => {
      try {
        console.log(`📡 Requesting 8-Digit Pairing Code for +${PHONE_NUMBER}...`);
        const code = await sock.requestPairingCode(PHONE_NUMBER);
        const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;

        console.log('\n========================================================================');
        console.log(`🔑 ENTER THIS PAIRING CODE IN WHATSAPP:   👉  ${formattedCode}  👈`);
        console.log('========================================================================\n');
        console.log('Steps on your phone (+234 904 605 0469):');
        console.log('1. Open WhatsApp ➔ Settings / 3-dots ➔ Linked Devices ➔ Link a Device');
        console.log('2. Tap "Link with phone number instead" at the bottom');
        console.log(`3. Type code: ${formattedCode}\n`);
      } catch (err) {
        console.error('Failed to request code:', err.message);
      }
    }, 4000);
  }
}

startPairing().catch(console.error);
