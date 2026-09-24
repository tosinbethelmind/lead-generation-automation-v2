/**
 * @file scripts/whatsapp_qr_web_portal.js
 * 
 * 🌐 FLICKER-FREE LIVE BROWSER QR PORTAL FOR LINE 4 (0913 512 9625)
 * 
 * - Seamless client-side auto-update (Zero whole-page reloading / zero flicker)
 * - Preserves cryptographic keys across 515 (restartRequired)
 * - Auto-backs up session to triple vaults immediately upon scan
 * - Live at http://localhost:5005
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const pino = require('pino');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5005;

const LINE_ID = 4;
const PHONE = '2349135129625';
const LOCAL_DB = path.join(process.cwd(), 'local_db');
const AUTH_DIR = path.join(LOCAL_DB, `baileys_auth_line${LINE_ID}`);
const REGISTRY_PATH = path.join(LOCAL_DB, 'whatsapp_lines_registry.json');

const BACKUP_DIRS = [
  path.join(LOCAL_DB, 'baileys_auth_backups', `baileys_auth_line${LINE_ID}`),
  path.join(process.cwd(), 'config', 'baileys_auth_backups', `baileys_auth_line${LINE_ID}`),
  path.join(LOCAL_DB, `baileys_auth_line${LINE_ID}_backup`)
];

let currentQrDataUrl = '';
let currentRawQr = '';
let connectionState = 'connecting';
let connectedPhone = '';
let qrCount = 0;
let activeSock = null;

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

// API endpoint for smooth client-side polling
app.get('/api/status', (req, res) => {
  res.json({
    status: connectionState,
    qrDataUrl: currentQrDataUrl,
    qrCount,
    phone: connectedPhone || PHONE
  });
});

// Single-page application without full page reloading
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhatsApp Link QR · Bethelmind Analytics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #070a12;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
    }
    .card {
      background: #0f172a;
      border: 1.5px solid #0284c7;
      padding: 32px 24px;
      border-radius: 24px;
      text-align: center;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .tag {
      display: inline-block;
      background: rgba(2, 132, 199, 0.15);
      color: #38bdf8;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }
    h1 { color: #fff; font-size: 1.4rem; margin-bottom: 6px; font-weight: 700; }
    .sub { color: #94a3b8; font-size: 0.88rem; margin-bottom: 20px; }
    .qr-frame {
      background: #ffffff;
      padding: 14px;
      border-radius: 18px;
      display: inline-block;
      margin-bottom: 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      min-width: 290px;
      min-height: 290px;
    }
    #qr-img {
      display: block;
      width: 262px;
      height: 262px;
      border-radius: 8px;
    }
    .placeholder {
      width: 262px;
      height: 262px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-size: 0.85rem;
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(2, 132, 199, 0.2);
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 12px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .steps {
      background: #1e293b;
      padding: 14px 16px;
      border-radius: 12px;
      text-align: left;
      font-size: 0.84rem;
      color: #cbd5e1;
      line-height: 1.6;
      border: 1px solid #334155;
      margin-bottom: 16px;
    }
    .steps strong { color: #38bdf8; }
    .status-bar {
      font-size: 0.78rem;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
    .success-view { display: none; }
  </style>
</head>
<body>
  <div class="card" id="main-card">
    <div id="scanning-section">
      <div class="tag">Outreach Line 4 Setup</div>
      <h1>Scan WhatsApp QR Code</h1>
      <p class="sub">Link SIM <strong>0913 512 9625</strong> to Bethelmind Automation</p>
      
      <div class="qr-frame">
        <div id="placeholder-box" class="placeholder">
          <div class="spinner"></div>
          Connecting to WhatsApp servers...
        </div>
        <img id="qr-img" style="display:none;" alt="WhatsApp QR Code" />
      </div>

      <div class="steps">
        1. Open WhatsApp on phone (<strong>0913 512 9625</strong>)<br/>
        2. Tap <strong>Settings</strong> or <strong>3 dots (⋮)</strong> &rarr; <strong>Linked Devices</strong><br/>
        3. Tap <strong>Link a Device</strong><br/>
        4. Point your camera at this QR code!
      </div>

      <div class="status-bar">
        <span class="pulse-dot"></span>
        <span id="status-text">Generating fresh QR code...</span>
      </div>
    </div>

    <div id="success-section" class="success-view">
      <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
      <h1 style="color: #10b981; margin-bottom: 8px;">WhatsApp Connected!</h1>
      <p style="color: #94a3b8; margin-bottom: 24px;">SIM <strong>0913 512 9625</strong> has been verified and permanently locked into your outreach vault.</p>
      <div style="background: #1e293b; padding: 14px; border-radius: 12px; font-size: 0.85rem; color: #cbd5e1; text-align: left; line-height: 1.6;">
        • Status: <strong style="color:#10b981;">PAIRED & ONLINE</strong><br/>
        • Vault: <strong>local_db/baileys_auth_line4</strong><br/>
        • Outreach Mode: <strong>Ready for Automated Campaigns</strong>
      </div>
    </div>
  </div>

  <script>
    let lastQr = '';
    async function checkStatus() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        
        if (data.status === 'open') {
          document.getElementById('scanning-section').style.display = 'none';
          document.getElementById('success-section').style.display = 'block';
          document.getElementById('main-card').style.borderColor = '#10b981';
          return;
        }

        if (data.qrDataUrl && data.qrDataUrl !== lastQr) {
          lastQr = data.qrDataUrl;
          const img = document.getElementById('qr-img');
          const placeholder = document.getElementById('placeholder-box');
          img.src = data.qrDataUrl;
          img.style.display = 'block';
          placeholder.style.display = 'none';
          document.getElementById('status-text').innerText = 'Ready to scan (QR #' + data.qrCount + ')';
        } else if (!data.qrDataUrl) {
          document.getElementById('status-text').innerText = 'Refreshing connection...';
        }
      } catch (_) {}
    }

    // Smooth poll every 1.5s (Zero page reloading / zero flickering)
    setInterval(checkStatus, 1500);
    checkStatus();
  </script>
</body>
</html>`);
});

async function startWhatsAppSocket(isRestart = false) {
  if (!isRestart) {
    if (fs.existsSync(AUTH_DIR)) {
      fs.rmSync(AUTH_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  if (activeSock) {
    try { activeSock.end(); } catch (_) {}
    activeSock = null;
  }

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

  activeSock = sock;
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrCount++;
      currentRawQr = qr;
      connectionState = 'qr_ready';
      currentQrDataUrl = await QRCode.toDataURL(qr, { width: 360, margin: 2 });
      console.log(`📌 Stable QR Code #${qrCount} generated. Live at http://localhost:${PORT}`);
    }

    if (connection === 'open') {
      connectionState = 'open';
      connectedPhone = sock.user?.id || PHONE;
      console.log('\n' + '🎉'.repeat(30));
      console.log(`✅ WHATSAPP LINE 4 (+${PHONE}) LINKED SUCCESSFULLY!`);
      console.log('🎉'.repeat(30) + '\n');

      backupSession();
      updateRegistry({
        userJid: sock.user?.id,
        userName: sock.user?.name || 'Outreach Desk'
      });

      setTimeout(() => {
        try { sock.end(); } catch (_) {}
      }, 5000);
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.log(`Connection update: closed with code ${statusCode}`);
      if (connectionState !== 'open') {
        const shouldPreserveAuth = statusCode === 515 || statusCode === 408;
        console.log(`⏳ Re-establishing socket in 3s (preserveAuth: ${shouldPreserveAuth})...`);
        setTimeout(() => {
          startWhatsAppSocket(shouldPreserveAuth).catch(console.error);
        }, 3000);
      }
    }
  });
}

function start() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================================`);
    console.log(`🌐 FLICKER-FREE WHATSAPP QR PORTAL: http://localhost:${PORT}`);
    console.log(`======================================================================\n`);
    startWhatsAppSocket(false).catch(console.error);
  });
}

start();
