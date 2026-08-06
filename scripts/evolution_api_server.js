/**
 * @file scripts/evolution_api_server.js
 * Multi-Instance Evolution API (v1 / v2) Server Supporting 3 Concurrent WhatsApp Lines
 * Runs locally on http://localhost:8080
 */

const express = require('express');
const cors = require('cors');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.EVOLUTION_API_KEY || 'evolution_bethelmind_secret_2026';
const PORT = process.env.EVOLUTION_PORT || 8080;

const instances = {
  instance_1: { name: 'bethelmind_instance_1', label: 'Phone Line 1 (Admin)', socket: null, qr: '', state: 'close', phone: '' },
  instance_2: { name: 'bethelmind_instance_2', label: 'Phone Line 2 (Outreach 1)', socket: null, qr: '', state: 'close', phone: '' },
  instance_3: { name: 'bethelmind_instance_3', label: 'Phone Line 3 (Outreach 2)', socket: null, qr: '', state: 'close', phone: '' },
};

function authMiddleware(req, res, next) {
  const apiKey = req.headers['apikey'] || req.query.apikey;
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: true, message: 'Unauthorized. Invalid apikey.' });
  }
  next();
}

async function startInstanceSocket(key) {
  const inst = instances[key];
  if (!inst) return;

  const authDir = path.join(__dirname, `../local_db/evolution_auth_${inst.name}`);
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();

  console.log(`[Evolution API] Starting ${inst.label} (${inst.name}) with Baileys v${version.join('.')}...`);

  inst.socket = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ['Windows', 'Chrome', '125.0.0.0']
  });

  inst.socket.ev.on('creds.update', saveCreds);

  inst.socket.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      inst.state = 'connecting';
      inst.qr = await QRCode.toDataURL(qr, { width: 350, margin: 2 });
      console.log(`[Evolution API] 📌 QR Code generated for ${inst.label}`);
    }

    if (connection === 'connecting') inst.state = 'connecting';

    if (connection === 'open') {
      inst.state = 'open';
      inst.phone = inst.socket.user?.id ? inst.socket.user.id.split(':')[0] : 'connected';
      console.log(`[Evolution API] 🎉 ${inst.label} CONNECTED! Phone: +${inst.phone}`);
    }

    if (connection === 'close') {
      inst.state = 'close';
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.log(`[Evolution API] ⚠️ Connection closed for ${inst.label} (code: ${statusCode})`);
      if (statusCode === DisconnectReason.loggedOut) {
        if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true, force: true });
      }
      setTimeout(() => {
        try { startInstanceSocket(key); } catch (e) { console.error(`[Evolution API] Reconnect error for ${inst.label}:`, e.message); }
      }, 3000);
    }
  });
}


// Start all 3 instances concurrently
Object.keys(instances).forEach(key => startInstanceSocket(key));

// Dashboard with 3 Line Tabs
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="5">
  <title>3-Line WhatsApp Manager</title>
  <style>
    body { background: #0f172a; color: #f8fafc; font-family: system-ui; margin: 0; padding: 24px; }
    h1 { color: #06b6d4; text-align: center; margin-bottom: 8px; }
    p.sub { text-align: center; color: #94a3b8; margin-top: 0; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 24px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
    .card.connected { border-color: #10b981; }
    .badge { padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 0.8rem; display: inline-block; margin-bottom: 14px; }
    .badge.open { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid #10b981; }
    .badge.close { background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid #ef4444; }
    .qr-box { background: white; padding: 12px; border-radius: 14px; margin: 12px 0; display: inline-block; }
    img { display: block; width: 260px; height: 260px; }
  </style>
</head>
<body>
  <h1>📱 3-Line WhatsApp Multi-Instance Dashboard</h1>
  <p class="sub">Connect all 3 WhatsApp phone numbers simultaneously for high-speed recruitment &amp; lead outreach.</p>
  
  <div class="grid">
    ${Object.keys(instances).map(key => {
      const i = instances[key];
      const isOpen = i.state === 'open';
      return `
        <div class="card ${isOpen ? 'connected' : ''}">
          <h2 style="margin-top:0;font-size:1.2rem;color:#f8fafc;">${i.label}</h2>
          <div class="badge ${isOpen ? 'open' : 'close'}">STATUS: ${i.state.toUpperCase()} ${i.phone ? `(+${i.phone})` : ''}</div>
          ${isOpen ? `
            <div style="padding:40px 10px;">
              <p style="color:#10b981;font-weight:700;font-size:1.1rem;">✅ LINE CONNECTED &amp; ACTIVE!</p>
              <p style="color:#94a3b8;font-size:0.85rem;">Phone Number: +${i.phone}</p>
            </div>
          ` : `
            <p style="font-size:0.85rem;color:#94a3b8;">Scan with WhatsApp Camera to connect Line:</p>
            <div class="qr-box">
              ${i.qr ? `<img src="${i.qr}" />` : '<p style="color:#64748b;padding:30px;">Generating QR Code...</p>'}
            </div>
          `}
        </div>
      `;
    }).join('')}
  </div>
</body>
</html>`);
});

// API Endpoints for Multi-Instance
app.get('/instance/connectionState/:instanceName', authMiddleware, (req, res) => {
  const name = req.params.instanceName;
  const inst = Object.values(instances).find(i => i.name === name) || instances.instance_1;
  res.json({ instance: { instanceName: name, state: inst.state, owner: inst.phone } });
});

app.post('/message/sendText/:instanceName', authMiddleware, async (req, res) => {
  const name = req.params.instanceName;
  const inst = Object.values(instances).find(i => i.name === name) || instances.instance_1;

  const { number, text } = req.body;
  if (!number || !text) return res.status(400).json({ error: true, message: 'Missing number or text' });

  if (inst.state !== 'open' || !inst.socket) {
    return res.status(503).json({ error: true, message: `Instance '${name}' is not connected` });
  }

  try {
    const cleanPhone = number.replace(/[^0-9]/g, '');
    const sent = await inst.socket.sendMessage(`${cleanPhone}@s.whatsapp.net`, { text });
    res.json({ success: true, key: sent.key });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 3-LINE MULTI-INSTANCE EVOLUTION API SERVER RUNNING`);
  console.log(`   URL : http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
