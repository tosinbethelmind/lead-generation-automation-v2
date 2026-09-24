/**
 * @file scripts/generate_line4_line5_qrs.js
 * 
 * 📱 DUAL-LINE QR & PAIRING CODE COMMAND CENTER (LINE 4 & LINE 5)
 * Serves live QR codes side-by-side on http://localhost:5005 for:
 * - Line 4: +234 814 160 9564
 * - Line 5: +234 703 055 6877
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const pino = require('pino');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

const LOCAL_DB = path.join(process.cwd(), 'local_db');
if (!fs.existsSync(LOCAL_DB)) fs.mkdirSync(LOCAL_DB, { recursive: true });

const LINES = [
  { id: 4, name: 'WhatsApp Line 4 (Outreach 3)', phone: '+234 814 160 9564', rawDigits: '2348141609564', authSubDir: 'baileys_auth_line4' },
  { id: 5, name: 'WhatsApp Line 5 (Outreach 4)', phone: '+234 703 055 6877', rawDigits: '2347030556877', authSubDir: 'baileys_auth_line5' }
];

const stateMap = {};
const socketMap = {};

LINES.forEach(line => {
  stateMap[line.id] = {
    id: line.id,
    name: line.name,
    phone: line.phone,
    status: 'connecting',
    qrDataUrl: '',
    pairingCode: '',
    errorMsg: ''
  };
});

function saveLinePermanent(lineId) {
  const line = LINES.find(l => l.id === lineId);
  if (!line) return;

  const authDir = path.join(LOCAL_DB, line.authSubDir);
  const backupDir = path.join(LOCAL_DB, `${line.authSubDir}_backup`);
  if (fs.existsSync(authDir)) {
    try {
      fs.cpSync(authDir, backupDir, { recursive: true });
      console.log(`✅ [PERMANENT BACKUP] Saved ${line.name} session to: ${backupDir}`);
    } catch (_) {}
  }

  const regPath = path.join(LOCAL_DB, 'whatsapp_lines_registry.json');
  let reg = {};
  if (fs.existsSync(regPath)) {
    try { reg = JSON.parse(fs.readFileSync(regPath, 'utf8')); } catch (_) {}
  }
  reg[`line_${line.id}`] = {
    line: line.id,
    name: line.name,
    phone: line.rawDigits,
    connected: true,
    permanentlyLocked: true,
    pairedAt: new Date().toISOString()
  };
  fs.writeFileSync(regPath, JSON.stringify(reg, null, 2), 'utf8');
  console.log(`✅ [REGISTRY LOCKED] Registered ${line.name} in whatsapp_lines_registry.json`);
}

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ success: true, stateMap });
});

app.post('/api/refresh-qr', async (req, res) => {
  const lineId = parseInt(req.query?.lineId || req.body?.lineId, 10);
  const targetLine = LINES.find(l => l.id === lineId);
  if (!targetLine) return res.status(400).json({ error: 'Invalid lineId' });

  console.log(`🔄 Refreshing QR code for ${targetLine.name}...`);
  await restartSingleLine(targetLine);
  res.json({ success: true, message: `Fresh QR regenerated for Line ${targetLine.id}` });
});

app.post('/api/pairing-code', async (req, res) => {
  const lineId = parseInt(req.query?.lineId || req.body?.lineId, 10);
  const targetLine = LINES.find(l => l.id === lineId);
  if (!targetLine) return res.status(400).json({ error: 'Invalid lineId' });

  const sock = socketMap[targetLine.id];
  if (!sock) return res.status(500).json({ error: 'Socket not ready' });

  try {
    const code = await sock.requestPairingCode(targetLine.rawDigits);
    const formatted = code?.match(/.{1,4}/g)?.join('-') || code;
    stateMap[targetLine.id].pairingCode = formatted;
    console.log(`🔑 Pairing Code for Line ${targetLine.id}: ${formatted}`);
    return res.json({ success: true, lineId: targetLine.id, pairingCode: formatted });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// HTML Dashboard UI
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Link Line 4 & Line 5 - WhatsApp Command Center</title>
  <style>
    body { background: #0b1329; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 24px; display: flex; flex-direction: column; align-items: center; }
    h1 { color: #10b981; margin-bottom: 4px; font-size: 1.8rem; text-align: center; }
    .subtitle { color: #94a3b8; font-size: 0.95rem; margin-bottom: 24px; text-align: center; }
    .grid { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; max-width: 950px; width: 100%; }
    .card { background: #1e293b; border: 2px solid #334155; border-radius: 20px; padding: 24px; width: 360px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: all 0.3s ease; }
    .card.connected { border-color: #10b981; box-shadow: 0 0 25px rgba(16,185,129,0.3); }
    .card.qr-ready { border-color: #0284c7; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
    .badge.connected { background: rgba(16,185,129,0.2); color: #34d399; }
    .badge.qr-ready { background: rgba(2,132,199,0.2); color: #38bdf8; }
    .badge.connecting { background: rgba(234,179,8,0.2); color: #facc15; }
    .badge.disconnected { background: rgba(239,68,68,0.2); color: #f87171; }
    .line-title { font-size: 1.25rem; font-weight: 700; color: #f1f5f9; }
    .line-phone { font-size: 1.05rem; color: #38bdf8; font-weight: 600; margin: 4px 0 16px; font-family: monospace; }
    .qr-box { background: white; padding: 14px; border-radius: 16px; display: inline-block; margin: 12px 0; min-width: 250px; min-height: 250px; display: flex; align-items: center; justify-content: center; }
    .qr-box img { display: block; width: 250px; height: 250px; }
    .code-box { background: #0f172a; border: 2px solid #38bdf8; padding: 12px; border-radius: 12px; margin: 12px 0; }
    .code-val { font-size: 1.8rem; font-weight: 900; letter-spacing: 3px; color: #38bdf8; font-family: monospace; }
    .step { background: #0f172a; padding: 8px 12px; border-radius: 8px; margin: 4px 0; font-size: 0.8rem; text-align: left; color: #cbd5e1; }
    .btn { display: block; width: 100%; border: none; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer; margin-top: 8px; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.9; }
    .btn-code { background: #0284c7; color: white; }
    .btn-refresh { background: #334155; color: #e2e8f0; }
    .success-box { background: rgba(16,185,129,0.1); border: 1px solid #10b981; border-radius: 16px; padding: 30px 16px; margin: 20px 0; }
    .success-box h2 { color: #10b981; margin: 0 0 8px; }
    .success-box p { color: #94a3b8; margin: 0; font-size: 0.85rem; }
  </style>
</head>
<body>
  <h1>📱 Link Line 4 & Line 5 to WhatsApp Fleet</h1>
  <div class="subtitle">Point your phone camera to scan QR or tap "Get 8-Digit Pairing Code" for instant linking!</div>

  <div class="grid" id="gridContainer">
    ${LINES.map(line => `
      <div class="card" id="card-${line.id}">
        <div class="badge connecting">CONNECTING...</div>
        <div class="line-title">${line.name}</div>
        <div class="line-phone">${line.phone}</div>
        <div class="qr-box"><p style="color:#64748b;">Generating QR code...</p></div>
      </div>
    `).join('')}
  </div>

  <script>
    async function checkStatus() {
      try {
        const resp = await fetch('/api/status');
        const data = await resp.json();
        if (data.success && data.stateMap) {
          const lines = [
            { id: 4, name: 'WhatsApp Line 4 (Outreach 3)', phone: '+234 814 160 9564' },
            { id: 5, name: 'WhatsApp Line 5 (Outreach 4)', phone: '+234 703 055 6877' }
          ];
          lines.forEach(line => {
            const el = document.getElementById('card-' + line.id);
            const st = data.stateMap[line.id];
            if (el && st) {
              const isConnected = st.status === 'open';
              const isQr = st.status === 'qr_ready' && st.qrDataUrl;
              const pCode = st.pairingCode || '';

              el.className = 'card ' + (isConnected ? 'connected' : (isQr ? 'qr-ready' : ''));
              el.innerHTML = \`
                <div class="badge \${isConnected ? 'connected' : (isQr ? 'qr-ready' : (st.status === 'connecting' ? 'connecting' : 'disconnected'))}">
                  \${isConnected ? '🎉 LINKED & ACTIVE ✅' : (isQr ? '⚡ SCAN QR OR ENTER CODE' : st.status.toUpperCase())}
                </div>
                <div class="line-title">\${line.name}</div>
                <div class="line-phone">\${line.phone}</div>

                \${isConnected ? \`
                  <div class="success-box">
                    <h2>🎉 Line Linked!</h2>
                    <p>Permanently locked and secured in fleet registry.</p>
                  </div>
                \` : \`
                  \${pCode ? \`
                    <div class="code-box">
                      <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:2px;">ENTER CODE ON PHONE:</div>
                      <div class="code-val">\${pCode}</div>
                    </div>
                  \` : ''}
                  <div class="qr-box">
                    \${isQr ? \`<img src="\${st.qrDataUrl}" alt="\${line.name} QR" />\` : \`<p style="color:#64748b;">Loading QR code...</p>\`}
                  </div>
                  <div class="step">1. Open WhatsApp on <strong>\${line.phone}</strong></div>
                  <div class="step">2. Tap Settings / 3-dots &rarr; <strong>Linked Devices</strong></div>
                  <div class="step">3. Tap <strong>Link a Device</strong> &amp; scan QR above</div>
                  <button class="btn btn-code" onclick="getPairingCode(\${line.id})">🔑 Get 8-Digit Pairing Code</button>
                  <button class="btn btn-refresh" onclick="refreshLine(\${line.id})">⚡ Regenerate Fresh QR</button>
                \`}
              \`;
            }
          });
        }
      } catch (_) {}
    }

    async function getPairingCode(lineId) {
      try {
        const resp = await fetch('/api/pairing-code?lineId=' + lineId, { method: 'POST' });
        const data = await resp.json();
        if (data.pairingCode) {
          alert('🔑 8-digit Pairing Code for Line ' + lineId + ' is:\\n\\n' + data.pairingCode + '\\n\\nEnter this in WhatsApp (Linked Devices ➔ Link with phone number instead).');
          checkStatus();
        } else {
          alert('Notice: ' + (data.error || 'Failed to generate code. Please scan QR.'));
        }
      } catch (e) {
        alert('Error: ' + e.message);
      }
    }

    async function refreshLine(lineId) {
      try {
        await fetch('/api/refresh-qr?lineId=' + lineId, { method: 'POST' });
        checkStatus();
      } catch (e) {
        alert('Error: ' + e.message);
      }
    }

    setInterval(checkStatus, 3000);
    checkStatus();
  </script>
</body>
</html>`);
});

const PORT = 5005;
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🌐 LINE 4 & LINE 5 COMMAND CENTER LIVE AT:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`==================================================`);
});

let cachedVersion = null;
async function getBaileysVersion() {
  if (!cachedVersion) {
    try {
      const { version } = await fetchLatestBaileysVersion();
      cachedVersion = version;
    } catch (_) {
      cachedVersion = [2, 3000, 1043857760];
    }
  }
  return cachedVersion;
}

async function restartSingleLine(line) {
  const authDir = path.join(LOCAL_DB, line.authSubDir);
  stateMap[line.id].status = 'connecting';
  stateMap[line.id].qrDataUrl = '';

  if (socketMap[line.id]) {
    try { socketMap[line.id].end(); } catch (_) {}
  }
  if (fs.existsSync(authDir)) {
    try { fs.rmSync(authDir, { recursive: true, force: true }); } catch (_) {}
  }
  await new Promise(r => setTimeout(r, 500));
  await startLineSocket(line);
}

async function startLineSocket(line) {
  const authDir = path.join(LOCAL_DB, line.authSubDir);
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const version = await getBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ['Windows', 'Chrome', '128.0.6613.120'],
    connectTimeoutMs: 60000,
    syncFullHistory: false
  });

  socketMap[line.id] = sock;
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      stateMap[line.id].status = 'qr_ready';
      stateMap[line.id].qrDataUrl = await QRCode.toDataURL(qr, { width: 300, margin: 2 });
      console.log(`📌 ${line.name} (${line.phone}): Stable QR Code Ready!`);
    } else if (connection === 'open') {
      stateMap[line.id].status = 'open';
      stateMap[line.id].qrDataUrl = '';
      console.log(`\n🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉`);
      console.log(`✅ SUCCESS! ${line.name} (${line.phone}) IS LINKED & ACTIVE!`);
      console.log(`🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n`);
      saveLinePermanent(line.id);
    } else if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(`⚠️ ${line.name} connection closed (code: ${statusCode}). Reconnecting: ${shouldReconnect}`);

      if (statusCode === DisconnectReason.loggedOut) {
        stateMap[line.id].status = 'disconnected';
        if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true, force: true });
        setTimeout(() => startLineSocket(line), 1500);
      } else {
        stateMap[line.id].status = 'connecting';
        if (shouldReconnect) setTimeout(() => startLineSocket(line), 2000);
      }
    }
  });
}

async function bootLines() {
  for (const line of LINES) {
    await startLineSocket(line).catch(err => console.error(`${line.name} Boot Error:`, err));
    await new Promise(r => setTimeout(r, 1000));
  }
}

bootLines();
