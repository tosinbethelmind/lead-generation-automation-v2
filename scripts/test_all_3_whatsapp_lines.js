const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const LINES = [
  { id: 1, name: 'Admin Tier 2 Line', phone: '2348022791227', dir: 'baileys_auth_line1' },
  { id: 2, name: 'Outreach Line 1', phone: '2347026266946', dir: 'baileys_auth_line2' },
  { id: 3, name: 'Outreach Line 2', phone: '2349046050469', dir: 'baileys_auth_line3' },
];

async function testLine(line) {
  const authDir = path.join(__dirname, '../local_db', line.dir);
  console.log(`\n=============================================================`);
  console.log(`🔍 TESTING LINE ${line.id}: ${line.name} (+${line.phone})`);
  console.log(`📁 Auth Directory: local_db/${line.dir}`);
  console.log(`=============================================================`);

  if (!fs.existsSync(path.join(authDir, 'creds.json'))) {
    console.log(`⚠️ creds.json not found in ${line.dir}`);
    return { id: line.id, status: 'no_creds' };
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  let version = [2, 3000, 1035194821];
  try {
    const v = await fetchLatestBaileysVersion();
    version = v.version;
  } catch (_) {}

  return new Promise((resolve) => {
    let resolved = false;
    const sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false,
      browser: ['Windows', 'Chrome', '125.0.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.log(`⏱️ Line ${line.id} connection timeout after 12s`);
        resolve({ id: line.id, status: 'timeout' });
      }
    }, 12000);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log(`📌 Line ${line.id} generated QR (not yet fully paired or waiting for scan)`);
      }

      if (connection === 'connecting') {
        console.log(`⏳ Line ${line.id} is connecting to WhatsApp servers...`);
      }

      if (connection === 'open') {
        clearTimeout(timeout);
        const actualPhone = sock.user?.id ? sock.user.id.split(':')[0] : line.phone;
        console.log(`\n🎉 LINE ${line.id} IS OPEN & AUTHENTICATED! (Phone: +${actualPhone}) ✅`);

        // Send a live test message to the user (+2348022791227)
        const targetPhone = '2348022791227';
        const targetJid = `${targetPhone}@s.whatsapp.net`;
        const testMsg = `🧪 *[MULTI-LINE WHATSAPP ENGINE ACTIVE]*\n\n✅ This message is sent LIVE from *Line ${line.id} (${line.name} - +${actualPhone})*!\n\n• Sprint Engine: Lagos 10K Multi-Sector (Aug 15 – Aug 21, 2026)\n• Line Status: 100% Connected & Active\n• Live Demo: https://www.bethelmindanalytics.com/preview/eko-luxury-suites?src=10k_lagos`;

        try {
          console.log(`📤 Sending live confirmation from Line ${line.id} to +${targetPhone}...`);
          const sent = await sock.sendMessage(targetJid, { text: testMsg });
          console.log(`✅ Message dispatched successfully! Message ID: ${sent.key.id}`);
        } catch (msgErr) {
          console.error(`❌ Send error on Line ${line.id}:`, msgErr.message);
        }

        if (!resolved) {
          resolved = true;
          resolve({ id: line.id, status: 'open', phone: actualPhone, sock });
        }
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        console.log(`⚠️ Line ${line.id} connection closed (code: ${statusCode})`);
        if (statusCode === DisconnectReason.loggedOut) {
          console.log(`❌ Line ${line.id} was logged out.`);
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            resolve({ id: line.id, status: 'logged_out' });
          }
        }
      }
    });
  });
}

async function testAll() {
  const results = [];
  for (const line of LINES) {
    const res = await testLine(line);
    results.push(res);
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('\n=============================================================');
  console.log('📊 FINAL 3-LINE WHATSAPP STATUS REPORT:');
  console.log(JSON.stringify(results.map(r => ({ line: r.id, status: r.status, phone: r.phone })), null, 2));
  console.log('=============================================================');
  process.exit(0);
}

testAll();
