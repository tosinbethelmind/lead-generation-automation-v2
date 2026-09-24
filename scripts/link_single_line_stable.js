/**
 * @file scripts/link_single_line_stable.js
 * 
 * 📱 ROCK-SOLID, STABLE SINGLE-LINE QR LINKER
 * 
 * Usage:
 *   node scripts/link_single_line_stable.js 5 07030556877
 *   node scripts/link_single_line_stable.js 6 08119346518
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');

const LINE_ID = parseInt(process.argv[2] || '5', 10);
const PHONE_RAW = process.argv[3] || '07030556877';

function normalizePhone(raw) {
  let digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) digits = '234' + digits.substring(1);
  else if (digits.length === 10) digits = '234' + digits;
  return digits;
}

const PHONE = normalizePhone(PHONE_RAW);
const LOCAL_DB = path.join(process.cwd(), 'local_db');
const AUTH_DIR = path.join(LOCAL_DB, `baileys_auth_line${LINE_ID}`);
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const QR_PNG_PATH = path.join(PUBLIC_DIR, 'whatsapp_qr.png');
const QR_HTML_PATH = path.join(PUBLIC_DIR, 'whatsapp_qr.html');
const REGISTRY_PATH = path.join(LOCAL_DB, 'whatsapp_lines_registry.json');

const BACKUP_DIRS = [
  path.join(LOCAL_DB, 'baileys_auth_backups', `baileys_auth_line${LINE_ID}`),
  path.join(process.cwd(), 'config', 'baileys_auth_backups', `baileys_auth_line${LINE_ID}`),
  path.join(LOCAL_DB, `baileys_auth_line${LINE_ID}_backup`)
];

function backupSession() {
  console.log(`🔒 Locking session for Line ${LINE_ID} (+${PHONE}) into triple redundant vaults...`);
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
    name: `Line ${LINE_ID} (Outreach - ${PHONE_RAW})`,
    phone: PHONE,
    connected: true,
    permanentlyLocked: true,
    pairedAt: new Date().toISOString(),
    ...info
  };
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2), 'utf8');
  console.log(`✅ Line ${LINE_ID} registered in whatsapp_lines_registry.json`);
}

async function start() {
  console.log('='.repeat(70));
  console.log(`📲 GENERATING STABLE WHATSAPP QR CODE FOR LINE ${LINE_ID} (${PHONE_RAW})`);
  console.log(`📞 Normalized Phone: +${PHONE}`);
  console.log(`📁 Auth Directory: local_db/baileys_auth_line${LINE_ID}`);
  console.log('='.repeat(70) + '\n');

  // Check if existing valid credentials exist before wiping
  const isFreshRequested = process.argv.includes('--fresh') || process.argv.includes('--force');
  const usePairingCode = process.argv.includes('--code');
  const credsFile = path.join(AUTH_DIR, 'creds.json');

  if (isFreshRequested) {
    console.log(`🧹 Clearing existing session directory local_db/baileys_auth_line${LINE_ID} (--fresh flag passed)...`);
    if (fs.existsSync(AUTH_DIR)) {
      fs.rmSync(AUTH_DIR, { recursive: true, force: true });
    }
  }
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  let version = [2, 3000, 1043857760];

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

  let qrCount = 0;

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrCount++;
      console.log(`\n=============================================================`);
      console.log(`📷 STABLE WHATSAPP QR CODE #${qrCount} FOR LINE ${LINE_ID} (${PHONE_RAW}) READY!`);
      console.log(`=============================================================\n`);

      // 1. Write high-res PNG image
      await QRCode.toFile(QR_PNG_PATH, qr, {
        width: 400,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      });
      console.log(`✅ QR Image saved to: public/whatsapp_qr.png`);

      // 2. Write HTML viewer
      const dataUrl = await QRCode.toDataURL(qr, { width: 360, margin: 2 });
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Scan WhatsApp QR Code · Line ${LINE_ID}</title>
  <style>
    body { background: #070a12; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #0f172a; border: 2px solid #0284c7; padding: 32px; border-radius: 20px; text-align: center; max-width: 420px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    h2 { color: #38bdf8; margin: 0 0 6px 0; }
    p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; }
    .qr-wrap { background: #fff; padding: 12px; border-radius: 14px; display: inline-block; margin-bottom: 20px; }
    img { display: block; width: 300px; height: 300px; }
    .steps { text-align: left; background: #1e293b; padding: 14px 18px; border-radius: 10px; font-size: 0.85rem; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h2>📱 Link Line ${LINE_ID}</h2>
    <p>Scan for SIM: <strong>${PHONE_RAW}</strong></p>
    <div class="qr-wrap"><img src="${dataUrl}" alt="QR Code" /></div>
    <div class="steps">
      1. Open WhatsApp on phone (<strong>${PHONE_RAW}</strong>)<br/>
      2. Tap <strong>Settings</strong> ➔ <strong>Linked Devices</strong><br/>
      3. Tap <strong>Link a Device</strong><br/>
      4. Point phone camera at this QR code!
    </div>
  </div>
</body>
</html>`;
      fs.writeFileSync(QR_HTML_PATH, html, 'utf8');

      // 3. Print ASCII in terminal
      qrcodeTerminal.generate(qr, { small: true }, (ascii) => {
        console.log(ascii);
      });

      // 4. Pop open the PNG file in Windows default photo viewer on user screen
      try {
        cp.exec(`start "" "${QR_PNG_PATH}"`);
      } catch (_) {}

      console.log(`📱 SCAN INSTRUCTIONS:`);
      console.log(`   1. Open WhatsApp on phone (${PHONE_RAW})`);
      console.log(`   2. Tap Settings ➔ Linked Devices ➔ Link a Device`);
      console.log(`   3. Point camera at the QR code window on your screen!\n`);
    }

    if (connection === 'open') {
      console.log('\n' + '🎉'.repeat(30));
      console.log(`✅ SUCCESS! LINE ${LINE_ID} (+${PHONE}) IS OFFICIALLY CONNECTED & VERIFIED!`);
      console.log('🎉'.repeat(30) + '\n');

      backupSession();
      updateRegistry({
        userJid: sock.user?.id,
        userName: sock.user?.name || `Outreach Desk ${LINE_ID}`
      });

      console.log(`\n🔒 Line ${LINE_ID} session permanently secured.`);
      setTimeout(() => {
        try { sock.end(); } catch (_) {}
        process.exit(0);
      }, 3000);

    } else if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.log(`Connection closed: status ${statusCode}`);
      if (statusCode === DisconnectReason.loggedOut) {
        console.log('❌ Logged out.');
        process.exit(1);
      }
    }
  });

  // Hold alive for 10 minutes (600s)
  await new Promise(r => setTimeout(r, 600000));
  console.log('⏰ Pairing window timed out.');
  try { sock.end(); } catch (_) {}
  process.exit(0);
}

start().catch(console.error);
