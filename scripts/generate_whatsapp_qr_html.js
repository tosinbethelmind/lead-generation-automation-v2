/**
 * @file scripts/generate_whatsapp_qr_html.js
 * Clean WhatsApp Socket Linker with Updated Chrome User Agent & Fresh Auth Clean
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const pino = require('pino');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
let currentQrDataUrl = '';
let connectionStatus = 'disconnected';
let lastErrorMsg = '';

app.get('/', (req, res) => {
  if (connectionStatus === 'open') {
    return res.send(`
      <!DOCTYPE html><html><head><meta charset="utf-8"><title>WhatsApp Connected</title>
      <style>body{background:#0f172a;color:#10b981;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}
      .box{background:#1e293b;padding:40px;border-radius:24px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.5);max-width:450px;}
      h1{color:#10b981;margin-top:0;}p{color:#94a3b8;}</style></head>
      <body><div class="box"><h1>🎉 WhatsApp Linked & Active! ✅</h1><p>Your WhatsApp number is successfully linked to your automated Lead Engine!</p></div></body></html>
    `);
  }

  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="5">
  <title>Scan WhatsApp QR Code</title>
  <style>
    body { background: #0f172a; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #1e293b; border: 2px solid #10b981; padding: 32px; border-radius: 24px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); max-width: 480px; }
    h1 { color: #10b981; margin-top: 0; font-size: 1.6rem; }
    p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; }
    .qr-box { background: white; padding: 16px; border-radius: 16px; margin: 20px 0; display: inline-block; }
    img { display: block; width: 320px; height: 320px; }
    .step { background: #334155; padding: 10px 16px; border-radius: 8px; margin: 6px 0; font-size: 0.85rem; text-align: left; }
    .status { background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 8px; border-radius: 8px; font-weight: 600; font-size: 0.8rem; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>📱 Scan WhatsApp QR Code</h1>
    <div class="status">Status: ${connectionStatus.toUpperCase()} ${lastErrorMsg ? `(${lastErrorMsg})` : ''}</div>
    <p>Open WhatsApp on your phone and scan the QR code below:</p>
    <div class="qr-box">
      ${currentQrDataUrl ? `<img src="${currentQrDataUrl}" alt="WhatsApp QR Code" />` : `<p style="color:#64748b;padding:40px;">Connecting to WhatsApp servers...</p>`}
    </div>
    <div class="step">1. Open WhatsApp on your phone</div>
    <div class="step">2. Tap Settings (iOS) or 3 dots (Android) &rarr; <strong>Linked Devices</strong></div>
    <div class="step">3. Tap <strong>"Link a Device"</strong> &amp; scan the code above</div>
  </div>
</body>
</html>`);
});

const PORT = 5005;
app.listen(PORT, () => {
  console.log(`🌐 Local QR Server running at http://localhost:${PORT}`);
});

async function startQrCodeServer() {
  const authDir = path.join(__dirname, '../local_db/baileys_auth');
  
  // Wipe stale auth cache if requested
  if (process.argv.includes('--clean') && fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
    console.log('🧹 Cleaned old auth cache.');
  }

  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();

  console.log(`⚡ Connecting via Baileys v${version.join('.')} [Windows/Chrome 125]...`);

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: true,
    browser: ['Windows', 'Chrome', '125.0.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      connectionStatus = 'qr_ready';
      currentQrDataUrl = await QRCode.toDataURL(qr, { width: 400, margin: 2 });
      console.log(`\n📌 FRESH WHATSAPP QR CODE READY AT http://localhost:${PORT}`);
      qrcodeTerminal.generate(qr, { small: true });
    }

    if (connection === 'connecting') {
      connectionStatus = 'connecting';
      console.log('⏳ Connecting to WhatsApp socket...');
    }

    if (connection === 'open') {
      connectionStatus = 'open';
      console.log(`\n🎉 WHATSAPP CONNECTED & LINKED SUCCESSFULLY! ✅\n`);
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.log(`⚠️ Connection closed. Status code: ${statusCode}`);
      lastErrorMsg = `Status code ${statusCode}`;
      if (statusCode === DisconnectReason.loggedOut) {
        console.log('🔒 Logged out. Wiping session and restarting...');
        if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true, force: true });
      }
      setTimeout(startQrCodeServer, 3000);
    }
  });
}

startQrCodeServer().catch(console.error);
