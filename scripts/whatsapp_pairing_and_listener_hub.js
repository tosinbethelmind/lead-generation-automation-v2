/**
 * @file scripts/whatsapp_pairing_and_listener_hub.js
 * 
 * 🌐 BETHELMIND ANALYTICS WHATSAPP FLEET HUB & 24/7 NIGERIAN CLOSING AUTO-RESPONDER
 * 
 * Features:
 * 1. Live Web Dashboard on http://localhost:5005 for QR scan & 8-Digit Pairing Code.
 * 2. Permanent Session Locking (triple-backup protection).
 * 3. 24/7 Intelligent Nigerian B2B Sales Closer Auto-Responder.
 * 4. Real-time notifications to Admin Closer Desk (0802 279 1227).
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

const ADMIN_JID = '2348022791227@s.whatsapp.net';
const autoRepliedPhoneMap = new Map();

// Active lines to manage in pairing hub
const LINES = [
  { id: 4, name: 'Line 4 (Outreach 3)', phone: '+234 814 160 9564', rawDigits: '2348141609564', authSubDir: 'baileys_auth_line4' },
  { id: 5, name: 'Line 5 (Outreach 4)', phone: '+234 703 055 6877', rawDigits: '2347030556877', authSubDir: 'baileys_auth_line5' },
  { id: 3, name: 'Line 3 (Outreach 2)', phone: '+234 904 605 0469', rawDigits: '2349046050469', authSubDir: 'baileys_auth_line3' }
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

/**
 * Highly Convincing Nigerian B2B Closer Auto-Reply Engine
 */
function formatNigerianAutoReply(text) {
  const lower = (text || '').toLowerCase().trim();

  // Pricing inquiries
  if (/price|cost|how much|fee|pay|pricing|expensive|cheap|charges|amount/i.test(lower)) {
    return `Good day Sir/Ma! Thank you for asking about pricing for *Bethelmind Analytics Lagos* business tools.

We keep our rates completely transparent with ZERO hidden fees:

1️⃣ *Option A: 1-Line Self-Install Embed* — *₦25,000* (one-time setup).
   Ideal if you already have a website and just want the 24/7 quoting bot & calculator added in 5 minutes.

2️⃣ *Option B: Full 100% Done-For-You (DFY) Turnkey* — *₦75,000* (Deposit: ₦35,000 to begin).
   We deliver everything within 48 hours:
   • Custom .com / .ng business domain
   • 24/7 AI WhatsApp Sales Bot configured on your business line
   • Automated Paystack & OPay bank transfer reconciliation (stops fake alerts)
   • 30-day technical support & staff handover

You can test drive the interactive demo on your phone right now:
👉 https://www.bethelmindanalytics.com

Which option fits your budget better (Self-Install ₦25k or Full DFY ₦75k)?
You can also call or message our Head of Desk directly:
👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
  }

  // Positive interest
  if (/yes|send|ok|sure|show me|interested|demo|proceed|details|link|share|go ahead|tell me more|how does it work/i.test(lower)) {
    return `Thank you so much Sir/Ma! We are excited to show you.

Here is the live interactive prototype (test it directly on your mobile device, ₦0 Upfront):
👉 https://www.bethelmindanalytics.com

📌 *What to test when you open it:*
1. Try the instant price calculator to see how fast it quotes.
2. Tap the WhatsApp demo button to experience the sub-3s automated response.

Once set up on your official business line, it captures paying customers day and night without your staff having to type repetitive replies.

Would you like our technical team to schedule a quick 10-minute activation for your business today?
Connect directly with our Lagos Desk Head:
👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
  }

  // Who are you / verification / location
  if (/who|where|office|address|location|scam|real|legit|call|number/i.test(lower)) {
    return `Good afternoon Sir/Ma!

We are *Bethelmind Analytics Lagos Desk*, a registered commercial technology enterprise based in Lagos, Nigeria.
• Head of Desk: Tosin Oyelakin
• Official Hotline / Direct WhatsApp: 0802 279 1227 (wa.me/2348022791227)
• Corporate Website: https://www.bethelmindanalytics.com
• Bank Settlement: Direct OPay Merchant Integration (Oyelakin Tosin Matthew)

We help Nigerian SMEs eliminate after-hours sales loss by deploying automated 24/7 WhatsApp response tools.

You do NOT pay anything upfront to review your demo. Feel free to inspect our platform or call 0802 279 1227 to speak with Tosin directly.`;
  }

  // General polite reply
  return `Good day Sir/Ma! Thank you for reaching out to *Bethelmind Analytics Lagos Desk*.

Our senior technical consultant is reviewing your message right now.

In the meantime, you can test drive how our 24/7 automated quoting tool works on your phone:
👉 https://www.bethelmindanalytics.com

To speak directly with our Head of Desk for immediate setup:
👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
}

function attachAutoResponder(sock, line) {
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const senderJid = msg.key.remoteJid || '';
      if (!senderJid.endsWith('@s.whatsapp.net')) continue;
      if (senderJid === ADMIN_JID) continue;

      const incomingText = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
      if (!incomingText.trim()) continue;

      const cleanPhoneNum = senderJid.split('@')[0];
      const now = Date.now();
      const lastReplyTime = autoRepliedPhoneMap.get(cleanPhoneNum) || 0;

      // Rate limit replies to same contact: once per 2 hours
      if (now - lastReplyTime < 2 * 60 * 60 * 1000) {
        continue;
      }

      console.log(`\n🔔 [INCOMING PROSPECT MESSAGE on ${line.name}] from +${cleanPhoneNum}: "${incomingText}"`);

      try {
        await sock.sendPresenceUpdate('composing', senderJid);
        await new Promise(r => setTimeout(r, 3500));
        await sock.sendPresenceUpdate('paused', senderJid);

        const replyText = formatNigerianAutoReply(incomingText);
        await sock.sendMessage(senderJid, { text: replyText });
        autoRepliedPhoneMap.set(cleanPhoneNum, now);

        console.log(`   ✅ [NIGERIAN CLOSER REPLY SENT] via ${line.name} to +${cleanPhoneNum}!`);

        // Forward hot notification to Admin Desk
        const alertToAdmin = `🚨 *[HOT WHATSAPP PROSPECT ON ${line.name}]*\n` +
          `• Phone: \`+${cleanPhoneNum}\`\n` +
          `• Message: "${incomingText}"\n` +
          `• Auto-Replied: Yes (Sent Nigerian value pitch & closer links).\n` +
          `• Tap to Close: wa.me/${cleanPhoneNum}`;

        try {
          await sock.sendMessage(ADMIN_JID, { text: alertToAdmin });
          console.log(`   📲 [ADMIN DESK ALERTED] Notification sent to 0802 279 1227.`);
        } catch (_) {}

      } catch (err) {
        console.error(`❌ Error in auto-reply on ${line.name}:`, err.message);
      }
    }
  });
}

function saveLinePermanent(lineId) {
  const line = LINES.find(l => l.id === lineId);
  if (!line) return;

  const authDir = path.join(LOCAL_DB, line.authSubDir);
  const backupDir = path.join(LOCAL_DB, `${line.authSubDir}_backup`);
  const configBackupDir = path.join(process.cwd(), 'config', 'baileys_auth_backups', line.authSubDir);

  if (fs.existsSync(authDir)) {
    try {
      if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
      if (!fs.existsSync(configBackupDir)) fs.mkdirSync(configBackupDir, { recursive: true });
      fs.cpSync(authDir, backupDir, { recursive: true });
      fs.cpSync(authDir, configBackupDir, { recursive: true });
      console.log(`✅ [PERMANENT BACKUP] Saved ${line.name} session to backups!`);
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

  console.log(`🔄 Refreshing QR for ${targetLine.name}...`);
  await restartSingleLine(targetLine);
  res.json({ success: true, message: `Fresh QR regenerated for ${targetLine.name}` });
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
    console.log(`🔑 Pairing Code for ${targetLine.name}: ${formatted}`);
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
  <title>WhatsApp Fleet Command Center - Link & Auto-Responder</title>
  <style>
    body { background: #0b1329; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 24px; display: flex; flex-direction: column; align-items: center; }
    h1 { color: #10b981; margin-bottom: 4px; font-size: 1.8rem; text-align: center; }
    .subtitle { color: #94a3b8; font-size: 0.95rem; margin-bottom: 24px; text-align: center; max-width: 650px; }
    .grid { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; max-width: 1200px; width: 100%; }
    .card { background: #1e293b; border: 2px solid #334155; border-radius: 20px; padding: 20px; width: 280px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: all 0.3s ease; }
    .card.connected { border-color: #10b981; box-shadow: 0 0 25px rgba(16,185,129,0.3); }
    .card.qr-ready { border-color: #0284c7; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
    .badge.connected { background: rgba(16,185,129,0.2); color: #34d399; }
    .badge.qr-ready { background: rgba(2,132,199,0.2); color: #38bdf8; }
    .badge.connecting { background: rgba(234,179,8,0.2); color: #facc15; }
    .badge.disconnected { background: rgba(239,68,68,0.2); color: #f87171; }
    .line-title { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; }
    .line-phone { font-size: 1rem; color: #38bdf8; font-weight: 600; margin: 4px 0 14px; font-family: monospace; }
    .qr-box { background: white; padding: 10px; border-radius: 14px; display: inline-block; margin: 10px 0; min-width: 200px; min-height: 200px; display: flex; align-items: center; justify-content: center; }
    .qr-box img { display: block; width: 200px; height: 200px; }
    .code-box { background: #0f172a; border: 2px solid #38bdf8; padding: 10px; border-radius: 12px; margin: 10px 0; }
    .code-val { font-size: 1.5rem; font-weight: 900; letter-spacing: 2px; color: #38bdf8; font-family: monospace; }
    .btn { display: block; width: 100%; border: none; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer; margin-top: 8px; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.9; }
    .btn-code { background: #0284c7; color: white; }
    .btn-refresh { background: #334155; color: #e2e8f0; }
    .success-box { background: rgba(16,185,129,0.1); border: 1px solid #10b981; border-radius: 16px; padding: 24px 12px; margin: 16px 0; }
    .success-box h3 { color: #10b981; margin: 0 0 6px; }
    .success-box p { color: #94a3b8; margin: 0; font-size: 0.8rem; }
    .hub-footer { margin-top: 30px; text-align: center; color: #64748b; font-size: 0.85rem; }
  </style>
</head>
<body>
  <h1>📱 WhatsApp Fleet Command Center</h1>
  <div class="subtitle">Relink any disconnected lines below. Once linked, sessions are <b>locked permanently</b> and the <b>24/7 Nigerian Closer Auto-Responder</b> immediately handles all incoming prospect inquiries!</div>

  <div class="grid" id="gridContainer">
    ${LINES.map(line => `
      <div class="card" id="card-${line.id}">
        <div class="badge connecting">CONNECTING...</div>
        <div class="line-title">${line.name}</div>
        <div class="line-phone">${line.phone}</div>

        <div class="content-area" id="content-${line.id}">
          <div style="color: #94a3b8; padding: 40px 0; font-size: 0.9rem;">Initializing WhatsApp engine...</div>
        </div>

        <div class="actions" id="actions-${line.id}" style="display: none;">
          <button class="btn btn-code" onclick="requestPairingCode(${line.id})">🔑 Get 8-Digit Pairing Code</button>
          <button class="btn btn-refresh" onclick="refreshQR(${line.id})">🔄 Refresh QR Code</button>
        </div>
      </div>
    `).join('')}
  </div>

  <div class="hub-footer">
    🛡️ Bethelmind Analytics Lagos Desk · Protected by Permanent Triple Session Vault
  </div>

  <script>
    async function updateDashboard() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        if (!data.success) return;

        Object.values(data.stateMap).forEach(st => {
          const card = document.getElementById('card-' + st.id);
          const badge = card.querySelector('.badge');
          const content = document.getElementById('content-' + st.id);
          const actions = document.getElementById('actions-' + st.id);

          card.className = 'card ' + st.status.replace('_', '-');
          badge.className = 'badge ' + st.status.replace('_', '-');

          if (st.status === 'open') {
            badge.textContent = '🟢 ONLINE & LISTENING';
            content.innerHTML = \`
              <div class="success-box">
                <h3>✅ LINE LINKED & LOCKED!</h3>
                <p>24/7 Auto-Responder is active and listening for prospect messages.</p>
              </div>
            \`;
            actions.style.display = 'none';
          } else if (st.status === 'qr_ready') {
            badge.textContent = '🟡 SCAN QR CODE';
            let html = \`<div class="qr-box"><img src="\${st.qrDataUrl}" /></div>\`;
            if (st.pairingCode) {
              html += \`
                <div class="code-box">
                  <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 4px;">ENTER CODE ON WHATSAPP:</div>
                  <div class="code-val">\${st.pairingCode}</div>
                </div>
              \`;
            }
            content.innerHTML = html;
            actions.style.display = 'block';
          } else if (st.status === 'connecting') {
            badge.textContent = '🟡 INITIALIZING';
            content.innerHTML = '<div style="color: #94a3b8; padding: 40px 0; font-size: 0.9rem;">Connecting to WhatsApp server...</div>';
            actions.style.display = 'none';
          } else {
            badge.textContent = '🔴 DISCONNECTED';
            content.innerHTML = '<div style="color: #f87171; padding: 30px 0; font-size: 0.85rem;">Session expired. Click Refresh QR to pair.</div>';
            actions.style.display = 'block';
          }
        });
      } catch (_) {}
    }

    async function requestPairingCode(lineId) {
      const btn = event.target;
      btn.textContent = '⏳ Requesting code...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/pairing-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lineId })
        });
        const data = await res.json();
        if (data.pairingCode) {
          updateDashboard();
        } else {
          alert('Could not get pairing code: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Network error: ' + err.message);
      } finally {
        btn.textContent = '🔑 Get 8-Digit Pairing Code';
        btn.disabled = false;
      }
    }

    async function refreshQR(lineId) {
      const btn = event.target;
      btn.textContent = '⏳ Regenerating...';
      btn.disabled = true;
      try {
        await fetch('/api/refresh-qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lineId })
        });
        updateDashboard();
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        btn.textContent = '🔄 Refresh QR Code';
        btn.disabled = false;
      }
    }

    setInterval(updateDashboard, 2500);
    updateDashboard();
  </script>
</body>
</html>`);
});

const PORT = 5005;
app.listen(PORT, () => {
  console.log('='.repeat(80));
  console.log(`🌐 WHATSAPP FLEET HUB LIVE AT: http://localhost:${PORT}`);
  console.log(`   • 24/7 Nigerian Closer Auto-Responder attached to all linked lines`);
  console.log(`   • Automatic Permanent Session Solidification enabled`);
  console.log('='.repeat(80) + '\n');
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
  stateMap[line.id].pairingCode = '';

  if (socketMap[line.id]) {
    try { socketMap[line.id].end(); } catch (_) {}
  }
  if (fs.existsSync(authDir)) {
    try { fs.rmSync(authDir, { recursive: true, force: true }); } catch (_) {}
  }
  await new Promise(r => setTimeout(r, 600));
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
  attachAutoResponder(sock, line);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      stateMap[line.id].status = 'qr_ready';
      stateMap[line.id].qrDataUrl = await QRCode.toDataURL(qr, { width: 300, margin: 2 });
      console.log(`📌 ${line.name} (${line.phone}): QR Code Ready!`);
    } else if (connection === 'open') {
      stateMap[line.id].status = 'open';
      stateMap[line.id].qrDataUrl = '';
      stateMap[line.id].pairingCode = '';
      console.log(`\n🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉`);
      console.log(`✅ SUCCESS! ${line.name} (${line.phone}) IS LINKED & LISTENING!`);
      console.log(`🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n`);
      saveLinePermanent(line.id);
    } else if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.log(`⚠️ ${line.name} connection closed (code: ${statusCode}).`);

      if (statusCode === 403) {
        stateMap[line.id].status = 'banned';
        stateMap[line.id].errorMsg = 'Account flagged / review required by WhatsApp';
        console.log(`⛔ ${line.name} has code 403 (Flagged/Banned). Reconnect stopped.`);
        return;
      }

      if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
        stateMap[line.id].status = 'connecting';
        stateMap[line.id].qrDataUrl = '';
        stateMap[line.id].pairingCode = '';
        console.log(`🔄 Session expired for ${line.name} (code: ${statusCode}). Clearing auth and regenerating fresh QR...`);
        if (fs.existsSync(authDir)) {
          try { fs.rmSync(authDir, { recursive: true, force: true }); } catch (_) {}
        }
        setTimeout(() => startLineSocket(line), 2000);
      } else {
        const shouldReconnect = true;
        console.log(`🔄 ${line.name} reconnecting in 3s...`);
        setTimeout(() => startLineSocket(line), 3000);
      }
    }
  });
}

// Start all lines
async function initFleet() {
  for (const line of LINES) {
    console.log(`🚀 Starting ${line.name} (${line.phone})...`);
    await startLineSocket(line);
    await new Promise(r => setTimeout(r, 1500));
  }
}

initFleet().catch(console.error);
