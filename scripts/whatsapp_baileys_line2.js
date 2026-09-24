/**
 * scripts/whatsapp_baileys_line2.js
 * Dedicated WhatsApp Baileys Gateway for Line 2 (+234 904 605 0469)
 * Runs on Port 3009 with Live Web UI and Pairing Code Generator
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = require('@whiskeysockets/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const pino = require('pino');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.LINE2_PORT || 3009;
const AUTH_DIR = path.join(__dirname, '../local_db/baileys_auth_line2');
const BACKUP_DIR = path.join(__dirname, '../local_db/baileys_auth_line2_solidified_backup');

let sock = null;
let connectionStatus = "disconnected";
let qrCodeBase64 = "";
let qrCodeRaw = "";
let lastPairingCode = "";
const processedMsgIds = new Set();

function extractMessageText(msg) {
  if (!msg || !msg.message) return '';
  let m = msg.message;
  if (m.ephemeralMessage?.message) m = m.ephemeralMessage.message;
  if (m.viewOnceMessage?.message) m = m.viewOnceMessage.message;
  if (m.viewOnceMessageV2?.message) m = m.viewOnceMessageV2.message;
  if (m.documentWithCaptionMessage?.message) m = m.documentWithCaptionMessage.message;

  if (m.conversation) return m.conversation;
  if (m.extendedTextMessage?.text) return m.extendedTextMessage.text;
  if (m.buttonsResponseMessage?.selectedButtonId) return m.buttonsResponseMessage.selectedButtonId;
  if (m.buttonsResponseMessage?.selectedDisplayText) return m.buttonsResponseMessage.selectedDisplayText;
  if (m.templateButtonReplyMessage?.selectedId) return m.templateButtonReplyMessage.selectedId;
  if (m.templateButtonReplyMessage?.selectedDisplayText) return m.templateButtonReplyMessage.selectedDisplayText;
  if (m.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson) {
    try {
      const parsed = JSON.parse(m.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
      return parsed.id || parsed.title || JSON.stringify(parsed);
    } catch (_) {}
  }
  if (m.interactiveResponseMessage?.body?.text) return m.interactiveResponseMessage.body.text;
  if (m.listResponseMessage?.singleSelectReply?.selectedRowId) return m.listResponseMessage.singleSelectReply.selectedRowId;
  if (m.listResponseMessage?.title) return m.listResponseMessage.title;
  if (m.imageMessage?.caption) return m.imageMessage.caption;
  if (m.videoMessage?.caption) return m.videoMessage.caption;
  if (m.documentMessage?.caption) return m.documentMessage.caption;
  if (m.audioMessage) return '[Voice Note Received]';
  if (m.locationMessage) return `[Location Shared: ${m.locationMessage.name || m.locationMessage.address || 'GPS'}]`;
  if (m.contactMessage?.vcard) return `[Contact Shared: ${m.contactMessage.displayName || 'Contact'}]`;
  return '';
}

function syncDirSync(src, dest) {
  try {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      const stat = fs.statSync(srcPath);
      if (stat.isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('[Line 2 Sync Error]:', err.message);
  }
}

async function connectToWhatsApp() {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  // Self-Healing Session Solidification: Auto-restore ONLY if backup creds are valid and registered
  if (!fs.existsSync(path.join(AUTH_DIR, 'creds.json'))) {
    const backupCreds = path.join(BACKUP_DIR, 'creds.json');
    if (fs.existsSync(backupCreds)) {
      try {
        const c = JSON.parse(fs.readFileSync(backupCreds, 'utf8'));
        if (c && c.registered !== false && c.me?.id) {
          console.log('🔄 [Baileys Line 2] Restoring authenticated session from solidified backup...');
          syncDirSync(BACKUP_DIR, AUTH_DIR);
        }
      } catch (_) {}
    }
  }

  try {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version } = await fetchLatestBaileysVersion();

    if (sock) {
      try {
        sock.ev.removeAllListeners();
        sock.end(new Error('Reconnecting'));
      } catch (_) {}
    }

    sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      auth: state,
      syncFullHistory: false,
      markOnlineOnConnect: false,
      printQRInTerminal: true,
      browser: Browsers.windows('Desktop'),
      keepAliveIntervalMs: 30000,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        qrCodeRaw = qr;
        connectionStatus = "qr";
        console.log("\n--- WHATSAPP LINE 2 (+234 904 605 0469) QR CODE ---");
        qrcodeTerminal.generate(qr, { small: true });
        try {
          qrCodeBase64 = await QRCode.toDataURL(qr);
        } catch (err) {
          console.error("Failed to generate QR data URL:", err);
        }
      }

      if (connection === 'connecting') {
        connectionStatus = 'connecting';
        console.log('Connecting WhatsApp Line 2 (+234 904 605 0469)...');
      }

      if (connection === 'open') {
        connectionStatus = 'connected';
        qrCodeBase64 = "";
        qrCodeRaw = "";
        console.log('✅ WhatsApp Line 2 (+234 904 605 0469) connected & online!');
        syncDirSync(AUTH_DIR, BACKUP_DIR);
      }

      if (connection === 'close') {
        connectionStatus = 'disconnected';
        qrCodeBase64 = "";
        qrCodeRaw = "";
        const statusCode = (lastDisconnect?.error)?.output?.statusCode;
        const isFatal = statusCode === DisconnectReason.loggedOut || statusCode === 401 || statusCode === 403;
        console.log(`WhatsApp Line 2 connection closed (Code: ${statusCode}). Fatal logout: ${isFatal}`);
        
        if (isFatal) {
          console.log('⚠️ WhatsApp Line 2 session unlinked/logged out (Code ' + statusCode + '). Purging dead auth files...');
          try {
            if (fs.existsSync(AUTH_DIR)) fs.rmSync(AUTH_DIR, { recursive: true, force: true });
            if (fs.existsSync(BACKUP_DIR)) fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
            fs.mkdirSync(AUTH_DIR, { recursive: true });
          } catch (_) {}
          // Stop reconnecting on fatal unlinking
          return;
        }

        // Temporary network drop: wait 5 seconds before reconnecting
        setTimeout(connectToWhatsApp, 5000);
      }
    });

    sock.ev.on('creds.update', () => {
      saveCreds();
      if (connectionStatus === 'connected') {
        syncDirSync(AUTH_DIR, BACKUP_DIR);
      }
    });

    // ── WhatsApp AI Auto-Reply Listener (Line 2) ──────────────────────────────
    sock.ev.on('messages.upsert', async (m) => {
      try {
        if (m.type !== 'notify' && m.type !== 'append') return;
        for (const msg of m.messages) {
          if (!msg.message || msg.key.fromMe) continue; // Ignore own messages
          if (msg.key.id && processedMsgIds.has(msg.key.id)) continue;
          if (msg.key.id) {
            processedMsgIds.add(msg.key.id);
            if (processedMsgIds.size > 2000) {
              const firstKey = processedMsgIds.values().next().value;
              processedMsgIds.delete(firstKey);
            }
          }

          const senderJid = msg.key.remoteJid;
          if (!senderJid || senderJid === 'status@broadcast' || senderJid.endsWith('@broadcast') || senderJid.endsWith('@g.us')) continue; // Ignore statuses and groups

          const textMessage = extractMessageText(msg);
          if (!textMessage.trim()) continue;

          console.log(`\n📩 [Line 2 WhatsApp Message Received] From ${senderJid}: "${textMessage}"`);

          await executeCloserReply(senderJid, textMessage, msg);
        }
      } catch (err) {
        console.error('[WhatsApp Line 2 AutoReply Error]:', err.message);
      }
    });
  } catch (err) {
    console.error('Failed to initialize Line 2 socket:', err.message);
    setTimeout(connectToWhatsApp, 5000);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ⚡ AUTONOMOUS NIGERIAN AI CLOSER & INBOUND CONVERSION (Line 2)
// ─────────────────────────────────────────────────────────────────────────────
async function executeCloserReply(targetRecipient, incomingText = '', rawMsg = null) {
  let targetJid = '';
  let cleanPhone = '';

  if (typeof targetRecipient === 'string' && targetRecipient.includes('@')) {
    targetJid = targetRecipient;
    if (targetRecipient.endsWith('@s.whatsapp.net')) {
      cleanPhone = targetRecipient.replace('@s.whatsapp.net', '');
    }
  } else {
    cleanPhone = String(targetRecipient || '').replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '234' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) {
      cleanPhone = '234' + cleanPhone;
    }
    targetJid = `${cleanPhone}@s.whatsapp.net`;
  }

  // Check participant for phone number if target is LID or Group
  if (rawMsg?.key?.participant && rawMsg.key.participant.endsWith('@s.whatsapp.net')) {
    cleanPhone = rawMsg.key.participant.replace('@s.whatsapp.net', '');
  }

  let replyText = '';
  let intent = 'GENERAL_INQUIRY';
  let directPaymentEligible = false;
  let customerName = cleanPhone ? `Business Owner (+${cleanPhone})` : 'Valued Business Owner';
  let customerArea = 'Nigeria';
  let customerCategory = 'Commercial Business';
  const vercelBase = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.bethelmindanalytics.com';
  let customerPreviewUrl = `${vercelBase}/preview/${cleanPhone || 'demo'}`;

  // 1. Resolve Lead Identity from Local DB
  try {
    const leadsDbPath = path.join(__dirname, '../local_db/leads_db.json');
    if (fs.existsSync(leadsDbPath)) {
      const rawLeads = JSON.parse(fs.readFileSync(leadsDbPath, 'utf8'));
      const leadsList = Array.isArray(rawLeads) ? rawLeads : Object.values(rawLeads);

      let matched = null;

      if (incomingText) {
        const linkMatch = incomingText.match(/preview\/([a-zA-Z0-9_-]+)/i);
        if (linkMatch) {
          const targetSlug = linkMatch[1];
          matched = leadsList.find(l =>
            (l.id && l.id === targetSlug) ||
            (l.lead_id && l.lead_id === targetSlug) ||
            (l.slug && l.slug === targetSlug)
          );
          if (matched) {
            customerPreviewUrl = `${vercelBase}/preview/${targetSlug}`;
          } else {
            customerPreviewUrl = linkMatch[0].startsWith('http') ? linkMatch[0] : `${vercelBase}/preview/${targetSlug}`;
          }
        }
      }

      if (!matched && cleanPhone) {
        matched = leadsList.find(l => {
          const lp = (l.phone || l.phone_e164 || l.phone_raw || '').replace(/\D/g, '');
          return lp && (cleanPhone.endsWith(lp.slice(-10)) || lp.endsWith(cleanPhone.slice(-10)));
        });
      }

      if (matched) {
        customerName = matched.business_name || matched.name || customerName;
        customerArea = matched.area || matched.city || customerArea;
        customerCategory = matched.category || matched.sector || customerCategory;
        const slug = (matched.id || matched.lead_id || customerName.toLowerCase().replace(/[^a-z0-9]+/g, '-')).slice(0, 40);
        if (!incomingText || !incomingText.includes(slug)) {
          customerPreviewUrl = `${vercelBase}/preview/${slug}`;
        }
        if (matched.phone || matched.phone_e164) {
          cleanPhone = (matched.phone || matched.phone_e164).replace(/\D/g, '');
        }
      }
    }
  } catch (_) {}

  // 2. Generate Simple, Natural Nigerian AI Closer Response
  try {
    try { delete require.cache[require.resolve('./lib/closer_engine')]; } catch (_) {}
    const { handlePostContactInquiry } = require('./lib/closer_engine');
    const closerRes = handlePostContactInquiry(incomingText || 'Hello I am inquiring about website', {
      businessName: customerName,
      category: customerCategory,
      area: customerArea,
      phone: cleanPhone,
      hasWebsite: false,
      previewUrl: customerPreviewUrl
    });
    replyText = closerRes.messageText;
    intent = closerRes.intent;
    directPaymentEligible = closerRes.directPaymentEligible;
  } catch (_) {
    replyText = `Good day! 👋 Welcome to Bethelmind Analytics Lagos Desk.\n\nWe created a free sample website for your business (*${customerName}*) so you can see how customers can find you on Google and message you on WhatsApp 24/7.\n\n👉 You can view your sample website here:\n${customerPreviewUrl}\n\nOur setup fee is ₦75,000 deposit to start (₦150,000 total, ready in 48 hours). Bank: OPay Digital Services | Account: 7034297995 | Name: Oyelakin Tosin Matthew. Please send your receipt once transferred!`;
  }

  if (connectionStatus !== 'connected' || !sock) {
    console.warn(`[Line 2 AutoReply] Socket not connected (Status: ${connectionStatus}). Cannot dispatch to ${targetJid}`);
    return;
  }

  // 3. Simulate Typing & Send Instant Autonomous AI Response (< 2.5s) to targetJid
  try {
    await sock.sendPresenceUpdate('composing', targetJid);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await sock.sendPresenceUpdate('paused', targetJid);
    await sock.sendMessage(targetJid, { text: replyText });
    console.log(`⚡ [Line 2 AI Auto-Reply] Successfully replied to ${targetJid} (${customerName}) (Intent: ${intent})`);
  } catch (sendErr) {
    console.error(`❌ [Line 2 AI Auto-Reply Error] Failed to send message to ${targetJid}:`, sendErr.message);
  }

  // 4. Real-Time Admin Notification to 0802 279 1227
  try {
    const adminPhone = process.env.ADMIN_WA_PHONE || '2348022791227';
    const adminJid = `${adminPhone.replace(/\D/g, '')}@s.whatsapp.net`;
    const adminAlertText =
`🔔 *INBOUND CHAT ON LINE 2 (AI AGENT RESPONDED)*
━━━━━━━━━━━━━━━━━━━━━━
🏢 *Business:* ${customerName} (${customerArea})
📱 *Identifier / Phone:* ${cleanPhone ? '+' + cleanPhone : targetJid}
🎯 *Intent:* ${intent}
🔗 *Customer Demo Link:* 
${customerPreviewUrl}
━━━━━━━━━━━━━━━━━━━━━━
💬 *Customer Said:* 
"${incomingText || 'Direct Inquiry'}"
━━━━━━━━━━━━━━━━━━━━━━
🤖 *AI Agent Sent:*
"${replyText.slice(0, 250)}..."
━━━━━━━━━━━━━━━━━━━━━━
⚡ *Direct Chat Link:* ${cleanPhone ? `wa.me/${cleanPhone}` : `WhatsApp (${targetJid})`}`;

    if (adminJid !== targetJid) {
      await sock.sendMessage(adminJid, { text: adminAlertText });
    }
  } catch (e) {
    console.warn('[Line 2 Admin Alert Error]:', e.message);
  }
}

// ── Web UI Root ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>WhatsApp Line 2 (+234 904 605 0469) Connection Hub</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #fff; margin: 0; padding: 40px 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #1e293b; border: 1.5px solid rgba(16, 185, 129, 0.4); border-radius: 16px; padding: 32px; max-width: 480px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.5); text-align: center; }
        h1 { margin: 0 0 8px 0; font-size: 1.4rem; color: #10b981; }
        .phone-badge { display: inline-block; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 12px; border-radius: 20px; font-weight: bold; font-family: monospace; font-size: 0.95rem; margin-bottom: 16px; }
        .qr-box { background: #fff; border-radius: 12px; padding: 16px; display: inline-block; margin-bottom: 20px; min-height: 220px; min-width: 220px; display: flex; align-items: center; justify-content: center; }
        .qr-box img { width: 220px; height: 220px; display: block; }
        .pairing-box { background: rgba(0,0,0,0.4); border: 1px dashed rgba(16, 185, 129, 0.5); border-radius: 10px; padding: 16px; margin-bottom: 20px; }
        .pairing-code { font-size: 1.8rem; font-weight: 900; color: #34d399; letter-spacing: 0.15em; font-family: monospace; }
        button { background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; border-radius: 8px; padding: 12px 20px; font-weight: bold; font-size: 0.9rem; cursor: pointer; width: 100%; }
        .status-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; margin-bottom: 16px; }
        .status-connected { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .status-qr { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
        .status-disconnected { background: rgba(239, 68, 68, 0.2); color: #f87171; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>WhatsApp Line 2 Rotator</h1>
        <div class="phone-badge">+234 904 605 0469</div>
        <div id="statusBadge" class="status-badge status-disconnected">Checking status...</div>
        
        <div class="qr-box" id="qrContainer">
          <div style="color: #64748b; font-size: 0.85rem;">Generating QR Code...</div>
        </div>

        <div class="pairing-box" id="pairingBox" style="display: none;">
          <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 6px;">8-DIGIT PAIRING CODE</div>
          <div class="pairing-code" id="pairingCodeText">----</div>
        </div>

        <button onclick="requestPairingCode()">🔑 Generate 8-Digit Pairing Code</button>
      </div>

      <script>
        async function fetchStatus() {
          try {
            const res = await fetch('/status');
            const data = await res.json();
            const badge = document.getElementById('statusBadge');
            const qrContainer = document.getElementById('qrContainer');
            
            badge.innerText = 'STATUS: ' + data.status.toUpperCase();
            badge.className = 'status-badge status-' + data.status;

            if (data.status === 'connected') {
              qrContainer.innerHTML = '<div style="color:#10b981; font-weight:bold; padding:20px;">✅ Line 2 Connected & Online!</div>';
            } else if (data.qrCodeUrl) {
              qrContainer.innerHTML = '<img src="' + data.qrCodeUrl + '" alt="QR Code" />';
            }

            if (data.lastPairingCode) {
              document.getElementById('pairingBox').style.display = 'block';
              document.getElementById('pairingCodeText').innerText = data.lastPairingCode;
            }
          } catch(e) {}
        }

        async function requestPairingCode() {
          const btn = document.querySelector('button');
          btn.innerText = 'Requesting Code...';
          try {
            const res = await fetch('/request-pairing-code?phone=2349046050469');
            const data = await res.json();
            if (data.pairingCode) {
              document.getElementById('pairingBox').style.display = 'block';
              document.getElementById('pairingCodeText').innerText = data.pairingCode;
            }
          } catch(e) {}
          btn.innerText = '🔑 Generate 8-Digit Pairing Code';
          fetchStatus();
        }

        fetchStatus();
        setInterval(fetchStatus, 3000);
      </script>
    </body>
    </html>
  `);
});

// REST Endpoints
const getStatusHandler = (req, res) => {
  const actualPhone = sock?.user?.id ? ('+' + sock.user.id.split(':')[0]) : '+234 904 605 0469';
  res.json({
    lineId: 2,
    phone: actualPhone,
    status: connectionStatus,
    qrCodeUrl: qrCodeBase64,
    qrRaw: qrCodeRaw,
    lastPairingCode
  });
};

app.get('/status', getStatusHandler);
app.get('/api/status', getStatusHandler);

// GET /on-whatsapp helper
app.get('/on-whatsapp', async (req, res) => {
  const phone = req.query.phone || '';
  if (!phone) return res.json({ active: false, existsOnWhatsApp: false });

  if (connectionStatus !== 'connected' || !sock) {
    return res.json({ active: true, existsOnWhatsApp: true, fallback: true });
  }

  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const jid = `${cleanPhone}@s.whatsapp.net`;
    const results = await sock.onWhatsApp(jid);
    const exists = results && results.length > 0 && results[0].exists;
    return res.json({ active: true, existsOnWhatsApp: Boolean(exists) });
  } catch (_) {
    return res.json({ active: true, existsOnWhatsApp: true, fallback: true });
  }
});

// REST Endpoint to check if phone number has active WhatsApp account
app.post('/check-whatsapp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Missing phone in payload" });
  }

  if (connectionStatus !== 'connected' || !sock) {
    const cleanDigits = phone.replace(/\D/g, '');
    const isValidNg = cleanDigits.startsWith('234') && cleanDigits.length === 13;
    return res.json({ 
      phone: phone,
      exists: isValidNg, 
      verified_via: 'syntax_fallback',
      message: 'Baileys client not connected, checked syntax.' 
    });
  }

  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const jid = `${cleanPhone}@s.whatsapp.net`;
    const results = await sock.onWhatsApp(jid);
    
    if (results && results.length > 0 && results[0].exists) {
      return res.json({
        phone: phone,
        exists: true,
        jid: results[0].jid,
        verified_via: 'baileys_live'
      });
    } else {
      return res.json({
        phone: phone,
        exists: false,
        verified_via: 'baileys_live'
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message, exists: false });
  }
});

// Endpoint to reconnect or reset connection gracefully
app.post('/reconnect', (req, res) => {
  try {
    connectionStatus = "connecting";
    if (sock) {
      sock.end();
    }
    setTimeout(connectToWhatsApp, 1000);
    return res.json({ success: true, message: "Reconnection initiated" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.all('/request-pairing-code', async (req, res) => {
  const phone = req.body?.phone || req.query?.phone || '2349046050469';
  const cleanPhone = phone.replace(/\D/g, '');

  if (!sock) {
    return res.status(500).json({ error: "WhatsApp Line 2 socket is not initialized" });
  }

  try {
    console.log(`\n🔑 [Line 2 Pairing Code] Requesting 8-Digit Code for ${cleanPhone}...`);
    const code = await sock.requestPairingCode(cleanPhone);
    const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;
    lastPairingCode = formattedCode;

    console.log(`\n=================================================`);
    console.log(`🔑 WHATSAPP LINE 2 PAIRING CODE:  ${formattedCode}`);
    console.log(`   Phone: +${cleanPhone}`);
    console.log(`=================================================\n`);

    return res.json({
      success: true,
      phone: cleanPhone,
      pairingCode: formattedCode,
      instructions: "Open WhatsApp ➔ Linked Devices ➔ Link with phone number instead ➔ Enter code: " + formattedCode
    });
  } catch (err) {
    console.error("[Line 2 Pairing Code Error]:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

const sendHandler = async (req, res) => {
  const { phone, message, text } = req.body;
  const outboundText = message || text;
  if (!phone || !outboundText) {
    return res.status(400).json({ error: "Missing phone or message in payload" });
  }

  if (connectionStatus !== 'connected' || !sock) {
    return res.status(503).json({ error: `WhatsApp Line 2 not connected. Status: ${connectionStatus}` });
  }

  try {
    let cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '234' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) {
      cleanPhone = '234' + cleanPhone;
    }
    const jid = `${cleanPhone}@s.whatsapp.net`;

    // Simulate natural human typing
    try {
      await sock.sendPresenceUpdate('composing', jid);
      const typingDuration = Math.min(Math.max(outboundText.length * 15, 1200), 3000);
      await new Promise(resolve => setTimeout(resolve, typingDuration));
      await sock.sendPresenceUpdate('paused', jid);
    } catch (_) {}

    const result = await sock.sendMessage(jid, { text: outboundText });
    console.log(`[Baileys Line 2] Message sent to ${cleanPhone}`);
    return res.json({ success: true, lineId: 2, messageId: result?.key?.id, phone: cleanPhone });
  } catch (err) {
    console.error("[Baileys Line 2 Send Error]:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

app.get('/pair', async (req, res) => {
  const targetPhone = req.query.phone || '2349046050469';
  try {
    if (!sock) return res.status(500).json({ error: 'Socket not initialized' });
    const code = await sock.requestPairingCode(targetPhone.replace(/\D/g, ''));
    console.log(`🔑 [PAIRING CODE] Generated WhatsApp Line 2 Pairing Code for ${targetPhone}: ${code}`);
    return res.json({ success: true, phone: targetPhone, pairingCode: code });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/send', sendHandler);
app.post('/send', sendHandler);

app.listen(PORT, () => {
  console.log(`🚀 Baileys WhatsApp Line 2 running on http://localhost:${PORT}`);
  connectToWhatsApp();
});
