/**
 * @file scripts/generate_3_whatsapp_qrs.js
 * 3-Line Multi-WhatsApp QR Code Command Center & Direct Message Gateway
 * Serves 3 live QR Codes side-by-side on http://localhost:5005 & handles API send requests.
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const pino = require('pino');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

const LINES = [
  { id: 1, name: 'Admin Tier 2 Line', phone: '+234 802 279 1227', authSubDir: 'baileys_auth_line1' },
  { id: 2, name: 'Outreach Line 1', phone: '+234 702 626 6946', authSubDir: 'baileys_auth_line2' },
  { id: 3, name: 'Outreach Line 2', phone: '+234 904 605 0469', authSubDir: 'baileys_auth_line3' },
];

const stateMap = {};
const socketMap = {};
let rrIndex = 0;

LINES.forEach(line => {
  stateMap[line.id] = {
    id: line.id,
    name: line.name,
    phone: line.phone,
    status: 'connecting',
    qrDataUrl: '',
    errorMsg: ''
  };
});

// === API ROUTES (MUST BE DECLARED BEFORE ROOT GET ROUTE) ===

app.get('/api/status', (req, res) => {
  res.json({ success: true, stateMap });
});

app.post('/api/send', async (req, res) => {
  const { phone, message, lineId } = req.body || {};
  if (!phone || !message) {
    return res.status(400).json({ error: 'Missing phone or message parameter.' });
  }

  const cleanPhone = String(phone).replace(/\D/g, '');
  const jid = `${cleanPhone}@s.whatsapp.net`;

  const activeLineIds = Object.keys(socketMap).filter(id => stateMap[id]?.status === 'open' && socketMap[id]);
  if (activeLineIds.length === 0) {
    return res.status(530).json({ error: 'No WhatsApp line is currently connected.', activeLineIds, stateMap });
  }

  let selectedLineId = lineId;
  if (!selectedLineId || !socketMap[selectedLineId] || stateMap[selectedLineId]?.status !== 'open') {
    selectedLineId = activeLineIds[rrIndex % activeLineIds.length];
    rrIndex++;
  }

  const sock = socketMap[selectedLineId];
  try {
    let targetJid = `${cleanPhone}@s.whatsapp.net`;
    try {
      const [onWa] = await sock.onWhatsApp(cleanPhone);
      if (onWa && onWa.jid) targetJid = onWa.jid;
    } catch (_) {}

    const sent = await sock.sendMessage(targetJid, { text: message });
    console.log(`📤 [Outreach Sent via Line ${selectedLineId}] to +${cleanPhone}`);
    return res.json({ success: true, lineId: selectedLineId, messageId: sent.key.id, recipient: cleanPhone });
  } catch (err) {
    console.error(`❌ [Outreach Send Error Line ${selectedLineId}]:`, err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/refresh-qr', async (req, res) => {
  const lineIdParam = req.query?.lineId || req.body?.lineId || 'all';
  
  if (lineIdParam === 'all') {
    console.log('\n🔄 [Global Refresh] Regenerating fresh QR codes for ALL 3 lines...');
    for (const line of LINES) {
      await restartSingleLine(line);
    }
    return res.json({ success: true, message: 'All 3 QR codes reset and regenerating.' });
  }

  const targetLine = LINES.find(l => l.id === parseInt(lineIdParam, 10));
  if (!targetLine) {
    return res.status(400).json({ error: 'Invalid lineId' });
  }

  console.log(`\n🔄 [Line ${targetLine.id} Refresh] Regenerating fresh QR code for ${targetLine.name}...`);
  await restartSingleLine(targetLine);
  return res.json({ success: true, message: `Fresh QR code generated for ${targetLine.name}` });
});

// === HTML UI PAGE ROUTE ===

function renderCardHtml(line, st) {
  const isConnected = st.status === 'open';
  const isQr = st.status === 'qr_ready' && st.qrDataUrl;
  return `
    <div class="card ${isConnected ? 'connected' : (isQr ? 'qr-ready' : '')}" id="card-${line.id}">
      <div class="badge ${isConnected ? 'connected' : (isQr ? 'qr-ready' : (st.status === 'connecting' ? 'connecting' : 'disconnected'))}">
        ${isConnected ? '🎉 LINKED & ACTIVE ✅' : (isQr ? '⚡ SCAN QR CODE NOW' : st.status.toUpperCase())}
      </div>
      <div class="line-title">${line.name}</div>
      <div class="line-phone">${line.phone}</div>
      
      ${isConnected ? `
        <div class="success-box">
          <h2>🎉 Connected!</h2>
          <p>Line is online & ready for lead dispatch.</p>
        </div>
      ` : `
        <div class="qr-box">
          ${isQr ? `<img src="${st.qrDataUrl}" alt="${line.name} QR" />` : `<p style="color:#64748b;padding:30px 0;">Generating QR code...</p>`}
        </div>
        <div class="step">1. Open WhatsApp for <strong>${line.phone}</strong></div>
        <div class="step">2. Tap Settings / 3-dots &rarr; <strong>Linked Devices</strong></div>
        <div class="step">3. Tap <strong>Link a Device</strong> &amp; scan QR above</div>
        <button class="btn-card" onclick="refreshLine(${line.id})">⚡ Regenerate QR for ${line.name}</button>
      `}
    </div>
  `;
}

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>3-Line WhatsApp Command Center</title>
  <style>
    body { background: #0b1329; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 24px; min-height: 100vh; box-sizing: border-box; }
    .header { text-align: center; margin-bottom: 28px; }
    .header h1 { color: #10b981; margin: 0 0 8px 0; font-size: 2rem; }
    .header p { color: #94a3b8; font-size: 1rem; margin: 0 0 16px 0; }
    .btn-global { background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 12px rgba(59,130,246,0.4); }
    .btn-global:hover { background: #2563eb; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto; }
    .card { background: #1e293b; border: 2px solid #334155; border-radius: 20px; padding: 24px; text-align: center; box-shadow: 0 12px 24px rgba(0,0,0,0.4); transition: all 0.3s; }
    .card.connected { border-color: #10b981; background: #064e3b22; }
    .card.qr-ready { border-color: #38bdf8; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 16px; }
    .badge.connected { background: #10b98122; color: #34d399; border: 1px solid #10b981; }
    .badge.qr-ready { background: #38bdf822; color: #38bdf8; border: 1px solid #38bdf8; }
    .badge.connecting { background: #f59e0b22; color: #fbbf24; border: 1px solid #f59e0b; }
    .badge.disconnected { background: #ef444422; color: #f87171; border: 1px solid #ef4444; }
    .line-title { color: #f8fafc; font-size: 1.25rem; font-weight: 700; margin: 0 0 4px 0; }
    .line-phone { color: #94a3b8; font-size: 0.95rem; margin-bottom: 16px; }
    .qr-box { background: white; padding: 14px; border-radius: 16px; display: inline-block; margin: 12px 0; min-width: 260px; min-height: 260px; }
    .qr-box img { display: block; width: 260px; height: 260px; }
    .success-box { padding: 40px 20px; color: #34d399; }
    .success-box h2 { font-size: 1.5rem; margin-bottom: 8px; }
    .step { background: #0f172a; padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-align: left; margin: 4px 0; }
    .btn-card { background: #475569; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; margin-top: 12px; width: 100%; transition: background 0.2s; }
    .btn-card:hover { background: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📲 3-Line WhatsApp Command Center</h1>
    <p>Stable QR codes. Point your phone camera and scan seamlessly!</p>
    <button class="btn-global" onclick="refreshLine('all')">🔄 REGENERATE ALL 3 FRESH QR CODES</button>
  </div>
  <div class="grid" id="gridContainer">
    ${LINES.map(line => renderCardHtml(line, stateMap[line.id])).join('')}
  </div>

  <script>
    async function checkStatus() {
      try {
        const resp = await fetch('/api/status');
        const data = await resp.json();
        if (data.success && data.stateMap) {
          const lines = [
            { id: 1, name: 'Admin Tier 2 Line', phone: '+234 802 279 1227' },
            { id: 2, name: 'Outreach Line 1', phone: '+234 702 626 6946' },
            { id: 3, name: 'Outreach Line 2', phone: '+234 904 605 0469' }
          ];
          lines.forEach(line => {
            const el = document.getElementById('card-' + line.id);
            const st = data.stateMap[line.id];
            if (el && st) {
              const isConnected = st.status === 'open';
              const isQr = st.status === 'qr_ready' && st.qrDataUrl;
              el.className = 'card ' + (isConnected ? 'connected' : (isQr ? 'qr-ready' : ''));
              el.innerHTML = \`
                <div class="badge \${isConnected ? 'connected' : (isQr ? 'qr-ready' : (st.status === 'connecting' ? 'connecting' : 'disconnected'))}">
                  \${isConnected ? '🎉 LINKED & ACTIVE ✅' : (isQr ? '⚡ SCAN QR CODE NOW' : st.status.toUpperCase())}
                </div>
                <div class="line-title">\${line.name}</div>
                <div class="line-phone">\${line.phone}</div>
                
                \${isConnected ? \`
                  <div class="success-box">
                    <h2>🎉 Connected!</h2>
                    <p>Line is online & ready for lead dispatch.</p>
                  </div>
                \` : \`
                  <div class="qr-box">
                    \${isQr ? \`<img src="\${st.qrDataUrl}" alt="\${line.name} QR" />\` : \`<p style="color:#64748b;padding:30px 0;">Generating QR code...</p>\`}
                  </div>
                  <div class="step">1. Open WhatsApp for <strong>\${line.phone}</strong></div>
                  <div class="step">2. Tap Settings / 3-dots &rarr; <strong>Linked Devices</strong></div>
                  <div class="step">3. Tap <strong>Link a Device</strong> &amp; scan QR above</div>
                  <button class="btn-card" onclick="refreshLine(\${line.id})">⚡ Regenerate QR for \${line.name}</button>
                \`}
              \`;
            }
          });
        }
      } catch (_) {}
    }

    async function refreshLine(lineId) {
      if (!confirm('🔒 Are you sure you want to reset this linked WhatsApp session? (Your session is currently locked & active)')) return;
      try {
        await fetch('/api/refresh-qr?lineId=' + lineId, { method: 'POST' });
        checkStatus();
      } catch (e) {
        alert('Error: ' + e.message);
      }
    }

    setInterval(checkStatus, 3000);
  </script>
</body>
</html>`);
});

const PORT = 5005;
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🌐 3-LINE STABLE WHATSAPP QR COMMAND CENTER READY AT:`);
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
      cachedVersion = [2, 3000, 1015901307];
    }
  }
  return cachedVersion;
}

async function restartSingleLine(line) {
  const authDir = path.join(__dirname, '../local_db', line.authSubDir);
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
  const authDir = path.join(__dirname, '../local_db', line.authSubDir);
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const version = await getBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04']
  });

  socketMap[line.id] = sock;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      stateMap[line.id].status = 'qr_ready';
      stateMap[line.id].qrDataUrl = await QRCode.toDataURL(qr, { width: 320, margin: 2 });
      console.log(`📌 Line ${line.id} (${line.name}): Stable QR Code Ready!`);
    } else if (connection === 'open') {
      stateMap[line.id].status = 'open';
      stateMap[line.id].qrDataUrl = '';
      console.log(`🎉 Line ${line.id} (${line.name} - ${line.phone}): LINKED & ACTIVE! ✅`);
    } else if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (stateMap[line.id].status !== 'open') {
        if (statusCode === DisconnectReason.loggedOut) {
          stateMap[line.id].status = 'disconnected';
          if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true, force: true });
        }
        setTimeout(() => startLineSocket(line), 3000);
      }
    }
  });
}

// Start line sockets
async function bootAllLines() {
  for (const line of LINES) {
    await startLineSocket(line).catch(err => console.error(`Line ${line.id} Error:`, err));
    await new Promise(r => setTimeout(r, 1000));
  }
}

bootAllLines();
