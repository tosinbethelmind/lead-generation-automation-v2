/**
 * @file scripts/whatsapp_multi_line_qr_portal.js
 * 
 * 🌐 7-SIM WHATSAPP UNIFIED PAIRING & MANAGEMENT PORTAL
 * Bethelmind Analytics Lagos Desk · Commercial Growth Engine
 * 
 * Accessible at: http://localhost:5005
 * 
 * Supports all 7 WhatsApp lines:
 * 1. Line 1: +234 802 279 1227 (Admin & Inbound Closer Desk)
 * 2. Line 2: +234 702 626 6946 (Outreach Line 1)
 * 3. Line 3: +234 904 605 0469 (Outreach Line 2)
 * 4. Line 4: +234 913 512 9625 (Outreach Line 3)
 * 5. Line 5: +234 703 055 6877 (Outreach Line 4)
 * 6. Line 6: +234 811 934 6518 (Outreach Line 5)
 * 7. Line 7: +234 814 160 9564 (Outreach Line 6)
 * 
 * Dual Pairing Methods per Line:
 * - Method A: Instant QR Code Scan
 * - Method B: 8-Digit Phone Pairing Code (Type on phone without camera)
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const pino = require('pino');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
const PORT = 5005;

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const REGISTRY_PATH = path.join(LOCAL_DB, 'whatsapp_lines_registry.json');

const ALL_LINES = [
  { id: 1, name: 'Line 1 (Admin Desk)', phone: '2348022791227', phoneDisplay: '0802 279 1227', dir: 'baileys_auth_line1', role: 'Dedicated Admin & Inbound Closer' },
  { id: 2, name: 'Line 2 (Outreach 1)', phone: '2347026266946', phoneDisplay: '0702 626 6946', dir: 'baileys_auth_line2', role: 'High-Speed B2B Outreach' },
  { id: 3, name: 'Line 3 (Outreach 2)', phone: '2349046050469', phoneDisplay: '0904 605 0469', dir: 'baileys_auth_line3', role: 'High-Speed B2B Outreach' },
  { id: 4, name: 'Line 4 (Outreach 3)', phone: '2349135129625', phoneDisplay: '0913 512 9625', dir: 'baileys_auth_line4', role: 'High-Speed B2B Outreach' },
  { id: 5, name: 'Line 5 (Outreach 4)', phone: '2347030556877', phoneDisplay: '0703 055 6877', dir: 'baileys_auth_line5', role: 'High-Speed B2B Outreach' },
  { id: 6, name: 'Line 6 (Outreach 5)', phone: '2348119346518', phoneDisplay: '0811 934 6518', dir: 'baileys_auth_line6', role: 'High-Speed B2B Outreach' },
  { id: 7, name: 'Line 7 (Outreach 6)', phone: '2348141609564', phoneDisplay: '0814 160 9564', dir: 'baileys_auth_line7', role: 'High-Speed B2B Outreach' }
];

// Auto-detect first unlinked line (preferring outreach lines 5→6→7 first)
function findFirstUnlinkedIndex() {
  const preferredOrder = [4, 5, 6, 0, 1, 2, 3];
  for (const idx of preferredOrder) {
    if (!checkLineAuthStatus(ALL_LINES[idx])) return idx;
  }
  return 6; // All linked — default to Line 7 for manual re-pair
}
let currentLineIndex = findFirstUnlinkedIndex();
let currentQrDataUrl = '';
let connectionState = 'idle';
let currentPairingCode = '';
let qrCount = 0;
let activeSock = null;

function getActiveLine() {
  return ALL_LINES[currentLineIndex];
}

function checkLineAuthStatus(line) {
  const authDir = path.join(LOCAL_DB, line.dir);
  const credsFile = path.join(authDir, 'creds.json');
  if (!fs.existsSync(credsFile)) return false;
  try {
    const c = JSON.parse(fs.readFileSync(credsFile, 'utf8'));
    return !!(c && c.me && c.me.id);
  } catch (_) {
    return false;
  }
}

function backupSession(line) {
  const authDir = path.join(LOCAL_DB, line.dir);
  const backupDirs = [
    path.join(LOCAL_DB, 'baileys_auth_backups', line.dir),
    path.join(LOCAL_DB, `${line.dir}_backup`),
    path.join(LOCAL_DB, `${line.dir}_solidified_backup`)
  ];

  console.log(`🔒 Securing redundant session backups for ${line.name} (${line.phoneDisplay})...`);
  for (const bDir of backupDirs) {
    if (!fs.existsSync(bDir)) fs.mkdirSync(bDir, { recursive: true });
    if (fs.existsSync(authDir)) {
      const files = fs.readdirSync(authDir);
      for (const f of files) {
        fs.copyFileSync(path.join(authDir, f), path.join(bDir, f));
      }
    }
    console.log(`   ✅ Vault locked: ${bDir}`);
  }
}

function updateRegistry(line, info = {}) {
  let reg = {};
  if (fs.existsSync(REGISTRY_PATH)) {
    try { reg = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')); } catch (_) {}
  }
  reg[`line_${line.id}`] = {
    line: line.id,
    name: line.name,
    phone: line.phone,
    connected: true,
    permanentlyLocked: true,
    lastChecked: new Date().toISOString(),
    pairedAt: new Date().toISOString(),
    ...info
  };
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2), 'utf8');
  console.log(`✅ Line ${line.id} updated in whatsapp_lines_registry.json`);
}

// API endpoint for frontend status
app.get('/api/status', (req, res) => {
  const line = getActiveLine();
  const isAlreadyPaired = checkLineAuthStatus(line);

  res.json({
    lineIndex: currentLineIndex,
    lineId: line.id,
    name: line.name,
    role: line.role,
    phone: line.phone,
    phoneDisplay: line.phoneDisplay,
    status: isAlreadyPaired && connectionState !== 'open' ? 'already_paired' : connectionState,
    qrDataUrl: currentQrDataUrl,
    pairingCode: currentPairingCode,
    qrCount,
    allLines: ALL_LINES.map((l, idx) => ({
      id: l.id,
      name: l.name,
      phoneDisplay: l.phoneDisplay,
      role: l.role,
      active: idx === currentLineIndex,
      isPaired: checkLineAuthStatus(l)
    }))
  });
});

// API endpoint to switch lines
app.post('/api/select-line/:idx', (req, res) => {
  const idx = parseInt(req.params.idx, 10);
  if (idx >= 0 && idx < ALL_LINES.length) {
    if (idx !== currentLineIndex) {
      currentLineIndex = idx;
      currentQrDataUrl = '';
      currentPairingCode = '';
      connectionState = 'switching';
      qrCount = 0;
      console.log(`\n🔄 Switched to ${getActiveLine().name} (${getActiveLine().phoneDisplay})`);
      startWhatsAppSocket(false).catch(console.error);
    }
    return res.json({ success: true, active: getActiveLine() });
  }
  res.status(400).json({ error: 'Invalid line index' });
});

// API endpoint to request 8-digit Pairing Code
app.post('/api/request-pairing-code', async (req, res) => {
  const line = getActiveLine();
  const inputPhone = req.body?.phone || line.phone;
  const cleanPhone = String(inputPhone).replace(/\D/g, '');

  if (!cleanPhone || cleanPhone.length < 10) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  try {
    if (!activeSock) {
      await startWhatsAppSocket(false);
    }
    // Wait for connection to be ready for pair code
    await new Promise(r => setTimeout(r, 2500));

    console.log(`📱 Requesting 8-digit Pairing Code for ${line.name} (+${cleanPhone})...`);
    const code = await activeSock.requestPairingCode(cleanPhone);
    const formatted = code?.match(/.{1,4}/g)?.join('-') || code;
    currentPairingCode = formatted;

    console.log(`🔑 Pairing Code Generated: ${formatted}`);
    return res.json({ success: true, code: formatted, phone: cleanPhone });
  } catch (err) {
    console.error('❌ Error requesting pairing code:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Serve frontend UI
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bethelmind 6-SIM WhatsApp Hub</title>
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
      padding: 24px 16px;
    }
    .card {
      background: #0f172a;
      border: 1.5px solid #0284c7;
      padding: 32px 24px;
      border-radius: 24px;
      text-align: center;
      max-width: 580px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .grid-tabs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      background: #070a12;
      padding: 8px;
      border-radius: 16px;
      margin-bottom: 24px;
      border: 1px solid #1e293b;
    }
    .tab-btn {
      background: #1e293b;
      border: 1px solid #334155;
      color: #94a3b8;
      font-size: 0.78rem;
      font-weight: 600;
      padding: 10px 6px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .tab-btn.active {
      background: #0284c7;
      border-color: #38bdf8;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);
    }
    .tab-btn .badge {
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(0,0,0,0.3);
    }
    .tab-btn.paired .badge {
      background: rgba(16, 185, 129, 0.25);
      color: #34d399;
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
    h1 { color: #fff; font-size: 1.35rem; margin-bottom: 4px; font-weight: 700; }
    .sub { color: #94a3b8; font-size: 0.88rem; margin-bottom: 18px; }
    .sub strong { color: #38bdf8; }
    
    .dual-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
      align-items: stretch;
    }
    @media (max-width: 520px) {
      .dual-box { grid-template-columns: 1fr; }
      .grid-tabs { grid-template-columns: repeat(2, 1fr); }
    }
    
    .method-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .method-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: #cbd5e1;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .qr-frame {
      background: #ffffff;
      padding: 8px;
      border-radius: 12px;
      display: inline-block;
      min-width: 170px;
      min-height: 170px;
    }
    #qr-img {
      width: 154px;
      height: 154px;
      border-radius: 6px;
      display: block;
    }
    .placeholder {
      width: 154px;
      height: 154px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-size: 0.75rem;
    }
    .spinner {
      width: 28px;
      height: 28px;
      border: 3px solid rgba(2, 132, 199, 0.2);
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 8px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .code-display {
      background: #070a12;
      border: 1.5px dashed #0284c7;
      border-radius: 12px;
      padding: 14px 12px;
      font-size: 1.25rem;
      font-weight: 800;
      color: #38bdf8;
      letter-spacing: 0.15em;
      margin: 10px 0;
      width: 100%;
    }
    .action-btn {
      background: #0284c7;
      color: #fff;
      border: none;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      transition: background 0.2s ease;
    }
    .action-btn:hover { background: #0369a1; }
    
    .steps {
      background: #1e293b;
      padding: 12px 16px;
      border-radius: 12px;
      text-align: left;
      font-size: 0.8rem;
      color: #cbd5e1;
      line-height: 1.5;
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
    
    .paired-notice {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 12px;
      border-radius: 12px;
      color: #34d399;
      font-size: 0.82rem;
      margin-bottom: 16px;
      display: none;
    }
  </style>
</head>
<body>
  <div class="card" id="main-card">
    <div class="tag">Bethelmind Analytics Lagos Desk</div>
    <h1>WhatsApp 6-SIM Hub</h1>
    <p class="sub">Active Line: <strong id="active-line-name">Line 5</strong> &bull; <strong id="phone-display">0703 055 6877</strong></p>

    <div class="grid-tabs" id="tabs-container">
      <!-- Generated via JS -->
    </div>

    <div id="paired-box" class="paired-notice">
      ✅ <strong>This SIM is already paired & locked!</strong> It is active and available for dispatches. To re-link, scan below or request a new code.
    </div>

    <div class="dual-box">
      <!-- Method 1: QR Code -->
      <div class="method-card">
        <div class="method-title">📷 Option 1: Scan QR</div>
        <div class="qr-frame">
          <div id="placeholder-box" class="placeholder">
            <div class="spinner"></div>
            Loading QR...
          </div>
          <img id="qr-img" style="display:none;" alt="WhatsApp QR Code" />
        </div>
      </div>

      <!-- Method 2: 8-Digit Pairing Code -->
      <div class="method-card">
        <div class="method-title">🔢 Option 2: 8-Digit Code</div>
        <p style="font-size: 0.72rem; color: #94a3b8; margin-bottom: 6px;">Link on your phone without camera</p>
        <div class="code-display" id="code-box">---- ----</div>
        <button class="action-btn" id="pair-code-btn" onclick="requestCode()">Get 8-Digit Code</button>
      </div>
    </div>

    <div class="steps">
      <strong>📱 How to Link on Your Phone in 10 Seconds:</strong><br/>
      1. Open WhatsApp on phone with SIM <strong id="steps-phone">0703 055 6877</strong><br/>
      2. Tap <strong>Settings (or ⋮ 3 dots)</strong> &rarr; <strong>Linked Devices</strong> &rarr; <strong>Link a Device</strong><br/>
      3. Either scan the QR code OR tap <strong>"Link with phone number instead"</strong> and type the 8-digit code!
    </div>

    <div class="status-bar">
      <span class="pulse-dot"></span>
      <span id="status-text">Ready to pair...</span>
    </div>
  </div>

  <script>
    let currentIdx = 4;
    let lastQr = '';

    async function requestCode() {
      const btn = document.getElementById('pair-code-btn');
      btn.innerText = 'Requesting...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/request-pairing-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        const data = await res.json();
        if (data.code) {
          document.getElementById('code-box').innerText = data.code;
          btn.innerText = 'Refresh Code';
        } else {
          alert('Could not get code: ' + (data.error || 'Check server'));
          btn.innerText = 'Retry';
        }
      } catch (e) {
        alert('Request failed: ' + e.message);
        btn.innerText = 'Retry';
      } finally {
        btn.disabled = false;
      }
    }

    async function switchTab(idx) {
      if (idx === currentIdx) return;
      currentIdx = idx;
      
      document.getElementById('qr-img').style.display = 'none';
      document.getElementById('placeholder-box').style.display = 'flex';
      document.getElementById('status-text').innerText = 'Initializing line ' + (idx + 1) + '...';
      document.getElementById('code-box').innerText = '---- ----';
      lastQr = '';

      await fetch('/api/select-line/' + idx, { method: 'POST' });
      checkStatus();
    }

    async function checkStatus() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        
        currentIdx = data.lineIndex;
        document.getElementById('active-line-name').innerText = data.name;
        document.getElementById('phone-display').innerText = data.phoneDisplay;
        document.getElementById('steps-phone').innerText = data.phoneDisplay;

        // Render Tabs
        const tabsBox = document.getElementById('tabs-container');
        tabsBox.innerHTML = data.allLines.map((l, i) => \`
          <button class="tab-btn \${i === currentIdx ? 'active' : ''} \${l.isPaired ? 'paired' : ''}" onclick="switchTab(\${i})">
            <span>\${l.name.split(' ')[0]} \${l.name.split(' ')[1]}</span>
            <span class="badge">\${l.isPaired ? '🟢 Paired' : '⚪ Unlinked'}</span>
          </button>
        \`).join('');

        // Paired Notice
        const isPaired = data.allLines[currentIdx].isPaired;
        document.getElementById('paired-box').style.display = isPaired ? 'block' : 'none';

        // Update Pairing Code if available
        if (data.pairingCode) {
          document.getElementById('code-box').innerText = data.pairingCode;
        }

        // Connection open
        if (data.status === 'open') {
          document.getElementById('status-text').innerText = '✅ Line Connected & Locked in Vault!';
          document.getElementById('main-card').style.borderColor = '#10b981';
          return;
        }

        // Render QR Image
        if (data.qrDataUrl && data.qrDataUrl !== lastQr) {
          lastQr = data.qrDataUrl;
          const img = document.getElementById('qr-img');
          const placeholder = document.getElementById('placeholder-box');
          img.src = data.qrDataUrl;
          img.style.display = 'block';
          placeholder.style.display = 'none';
          document.getElementById('status-text').innerText = 'Live QR Ready (#' + data.qrCount + ')';
        }
      } catch (_) {}
    }

    setInterval(checkStatus, 2000);
    checkStatus();
  </script>
</body>
</html>`);
});

async function startWhatsAppSocket(isRestart = false) {
  const line = getActiveLine();
  const authDir = path.join(LOCAL_DB, line.dir);

  if (!isRestart) {
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true });
    }
    fs.mkdirSync(authDir, { recursive: true });
  }

  if (activeSock) {
    try { activeSock.end(); } catch (_) {}
    activeSock = null;
  }

  console.log(`\n======================================================`);
  console.log(`⚡ INITIALIZING SOCKET FOR ${line.name}: +${line.phone} (${line.phoneDisplay})`);
  console.log(`📁 Auth Folder: local_db/${line.dir}`);
  console.log(`======================================================\n`);

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
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
      connectionState = 'qr_ready';
      currentQrDataUrl = await QRCode.toDataURL(qr, { width: 360, margin: 2 });
      console.log(`📌 QR Code #${qrCount} for ${line.name} (${line.phoneDisplay}) live at http://localhost:${PORT}`);
    }

    if (connection === 'open') {
      connectionState = 'open';
      console.log('\n' + '🎉'.repeat(30));
      console.log(`✅ ${line.name} (${line.phoneDisplay}) LINKED SUCCESSFULLY!`);
      console.log('🎉'.repeat(30) + '\n');

      backupSession(line);
      updateRegistry(line, {
        userJid: sock.user?.id,
        userName: sock.user?.name || `Outreach Desk ${line.id}`
      });
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (connectionState !== 'open') {
        const preserve = statusCode === 515 || statusCode === 408;
        console.log(`⚠️ Socket dropped (code: ${statusCode}). Auto-reconnecting in 3s...`);
        setTimeout(() => {
          startWhatsAppSocket(preserve).catch(console.error);
        }, 3000);
      }
    }
  });
}

function start() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================================`);
    console.log(`🌐 6-SIM WHATSAPP UNIFIED PORTAL IS LIVE: http://localhost:${PORT}`);
    console.log(`======================================================================\n`);
    startWhatsAppSocket(false).catch(console.error);
  });
}

start();
