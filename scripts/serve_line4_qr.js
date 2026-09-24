/**
 * @file scripts/serve_line4_qr.js
 * 
 * 📱 QR CODE GENERATOR & INSTANT VIEWER FOR NEW OUTREACH LINE 4 (09135129625)
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');

const LINE_ID = 4;
const PHONE = '2349135129625';
const LOCAL_DB = path.join(process.cwd(), 'local_db');
const AUTH_DIR = path.join(LOCAL_DB, `baileys_auth_line${LINE_ID}`);
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const QR_PNG_PATH = path.join(PUBLIC_DIR, 'whatsapp_qr.png');
const QR_HTML_PATH = path.join(PUBLIC_DIR, 'whatsapp_qr.html');
const ARTIFACT_DIR = path.join('C:', 'Users', 'HomePC', '.gemini', 'antigravity-ide', 'brain', '9a639b58-46c1-406c-af7b-a59fd57e9459');
const ARTIFACT_PNG = path.join(ARTIFACT_DIR, 'whatsapp_qr.png');
const REGISTRY_PATH = path.join(LOCAL_DB, 'whatsapp_lines_registry.json');

// Triple backup destinations
const BACKUP_DIRS = [
  path.join(LOCAL_DB, 'baileys_auth_backups', `baileys_auth_line${LINE_ID}`),
  path.join(process.cwd(), 'config', 'baileys_auth_backups', `baileys_auth_line${LINE_ID}`),
  path.join(LOCAL_DB, `baileys_auth_line${LINE_ID}_backup`)
];

function backupSession() {
  console.log('🔒 Locking session into triple redundant vaults...');
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
    name: `Line ${LINE_ID} (Outreach - 0913 512 9625)`,
    phone: PHONE,
    connected: true,
    permanentlyLocked: true,
    pairedAt: new Date().toISOString(),
    ...info
  };
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2), 'utf8');
  console.log(`✅ Line ${LINE_ID} registered in whatsapp_lines_registry.json`);
}

async function startQrEngine() {
  console.log('='.repeat(70));
  console.log(`📲 GENERATING WHATSAPP QR CODE FOR LINE 4 (0913 512 9625)`);
  console.log(`📁 Auth Directory: local_db/baileys_auth_line${LINE_ID}`);
  console.log('='.repeat(70) + '\n');

  // Clean stale session
  if (fs.existsSync(AUTH_DIR)) {
    fs.rmSync(AUTH_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const version = [2, 3000, 1043857760];

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
      console.log(`📷 WHATSAPP QR CODE #${qrCount} READY TO SCAN!`);
      console.log(`=============================================================\n`);

      // 1. Generate high-res PNG
      await QRCode.toFile(QR_PNG_PATH, qr, {
        width: 400,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      });
      console.log(`✅ Saved QR Image to: public/whatsapp_qr.png`);

      // Also copy to artifact dir if exists
      if (fs.existsSync(ARTIFACT_DIR)) {
        fs.copyFileSync(QR_PNG_PATH, ARTIFACT_PNG);
      }

      // 2. Generate standalone HTML viewer
      const dataUrl = await QRCode.toDataURL(qr, { width: 360, margin: 2 });
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Scan WhatsApp QR Code - Line 4</title>
  <style>
    body { background: #070a12; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #0f172a; border: 2px solid #38bdf8; padding: 32px; border-radius: 20px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.6); max-width: 420px; }
    h2 { color: #38bdf8; margin: 0 0 8px 0; }
    p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; }
    .qr-wrap { background: #fff; padding: 12px; border-radius: 12px; display: inline-block; margin-bottom: 20px; }
    img { display: block; width: 320px; height: 320px; }
    .steps { text-align: left; background: #1e293b; padding: 14px 18px; border-radius: 10px; font-size: 0.85rem; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h2>📱 Scan WhatsApp QR Code</h2>
    <p>Linking New Outreach SIM: <strong>0913 512 9625</strong></p>
    <div class="qr-wrap">
      <img src="${dataUrl}" alt="WhatsApp QR Code" />
    </div>
    <div class="steps">
      1. Open WhatsApp on your phone.<br/>
      2. Tap <strong>Settings</strong> or <strong>3 dots ⋮</strong> &rarr; <strong>Linked Devices</strong>.<br/>
      3. Tap <strong>Link a Device</strong>.<br/>
      4. Point your phone camera at this QR code!
    </div>
  </div>
</body>
</html>`;
      fs.writeFileSync(QR_HTML_PATH, htmlContent, 'utf8');
      console.log(`✅ Saved HTML Viewer to: public/whatsapp_qr.html`);

      // 3. Print ASCII QR in terminal
      qrcodeTerminal.generate(qr, { small: true }, (ascii) => {
        console.log(ascii);
      });

      // 4. Open the image directly on the user's desktop so they can scan it immediately
      try {
        cp.exec(`start "" "${QR_PNG_PATH}"`);
        console.log('🚀 Opened QR code on your screen!');
      } catch (_) {}

      console.log(`\n📱 SCAN INSTRUCTIONS:`);
      console.log(`   1. Open WhatsApp on phone (0913 512 9625)`);
      console.log(`   2. Tap Settings ➔ Linked Devices ➔ Link a Device`);
      console.log(`   3. Point camera at the QR code on your screen!\n`);
    }

    if (connection === 'open') {
      console.log('\n' + '🎉'.repeat(30));
      console.log(`✅ SUCCESS! NEW OUTREACH LINE 4 (+${PHONE}) IS OFFICIALLY CONNECTED!`);
      console.log('🎉'.repeat(30) + '\n');

      backupSession();
      updateRegistry({
        userJid: sock.user?.id,
        userName: sock.user?.name || 'Outreach Desk'
      });

      console.log('\n🚀 Line 4 is now permanently armed and secured!');
      setTimeout(() => {
        try { sock.end(); } catch (_) {}
        process.exit(0);
      }, 3000);

    } else if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode === DisconnectReason.loggedOut) {
        console.log('❌ Logged out.');
        process.exit(1);
      }
    }
  });

  // Keep alive for 600s (10 minutes) to allow scanning
  await new Promise(r => setTimeout(r, 600000));
  console.log('⏰ QR Code scanning window timed out. Run again if needed.');
  try { sock.end(); } catch (_) {}
  process.exit(0);
}

startQrEngine().catch(console.error);
