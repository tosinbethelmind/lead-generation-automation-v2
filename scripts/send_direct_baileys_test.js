const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function sendDirectWhatsApp() {
  console.log('================================================================');
  console.log('🚀 INITIALIZING DIRECT BAILEYS WHATSAPP DISPATCH FROM LINKED AUTH');
  console.log('================================================================');

  // Check auth directories
  const candidateDirs = [
    path.join(__dirname, '../local_db/evolution_auth_bethelmind_instance'),
    path.join(__dirname, '../local_db/evolution_auth_bethelmind_instance_1'),
    path.join(__dirname, '../local_db/baileys_auth'),
  ];

  let authDir = candidateDirs[0];
  for (const dir of candidateDirs) {
    if (fs.existsSync(path.join(dir, 'creds.json'))) {
      authDir = dir;
      console.log(`Found active WhatsApp session in: ${dir}`);
      break;
    }
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ['Windows', 'Chrome', '125.0.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'connecting') {
      console.log('Connecting to WhatsApp session...');
    }

    if (connection === 'open') {
      const userPhone = sock.user?.id ? sock.user.id.split(':')[0] : '2348022791227';
      console.log(`🎉 WHATSAPP SESSION ACTIVE & CONNECTED! (User: +${userPhone})`);

      const targetJid = '2348022791227@s.whatsapp.net';
      const previewUrl = 'https://www.bethelmindanalytics.com/preview/eko-luxury-suites?src=10k_lagos';

      const testMsg = `🧪 *[TEST DISPATCH - STEP 1A (Warm Hook)]*
Good morning Management Team 👋, please is this the official desk for Eko Grand Hotel & Suites in Victoria Island, Lagos?

---

🧪 *[TEST DISPATCH - STEP 1B (Interactive Portal Pitch)]*
Hello Management Team,

We custom-built a 2-minute live demo preview specifically for your commercial operations in Lagos:
👉 *Live Demo Preview:* ${previewUrl}

⚡ *What this system does:*
• 🤖 24/7 WhatsApp AI Customer Support & Instant Quoting
• 🎙️ Natural Nigerian Voice Note generator
• 📄 Instant automated PDF quote & verified bank payment confirmations

Warm regards,
Tosin | Bethelmind Analytics & Strategy (Lagos 10K Multi-Sector Engine)`;

      try {
        console.log(`Sending message to ${targetJid}...`);
        const sent = await sock.sendMessage(targetJid, { text: testMsg });
        console.log('✅ WHATSAPP TEST MESSAGE SENT SUCCESSFULLY OVER THE AIR!');
        console.log('Message ID:', sent?.key?.id);
        
        setTimeout(() => {
          process.exit(0);
        }, 3000);
      } catch (sendErr) {
        console.error('❌ Failed to send message:', sendErr.message);
        process.exit(1);
      }
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.log(`Connection closed with code: ${statusCode}`);
      if (statusCode === DisconnectReason.loggedOut) {
        console.log('Device logged out.');
      }
    }
  });
}

sendDirectWhatsApp().catch(err => {
  console.error('Initialization error:', err);
  process.exit(1);
});
