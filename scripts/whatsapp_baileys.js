const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
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

let sock = null;
let connectionStatus = "disconnected"; // disconnected, qr, connecting, connected
let qrCodeBase64 = "";
let qrCodeRaw = "";

async function connectToWhatsApp() {
  const authDir = path.join(__dirname, '../local_db/baileys_auth');
  if (!fs.existsSync(path.join(__dirname, '../local_db'))) {
    fs.mkdirSync(path.join(__dirname, '../local_db'), { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      qrCodeRaw = qr;
      connectionStatus = "qr";
      console.log("\n--- WHATSAPP QR CODE ---");
      qrcodeTerminal.generate(qr, { small: true });
      console.log("Scan this QR code with your phone to connect custom Baileys API.");
      
      try {
        qrCodeBase64 = await QRCode.toDataURL(qr);
      } catch (err) {
        console.error("Failed to generate QR data URL:", err);
      }
    }

    if (connection === 'connecting') {
      connectionStatus = 'connecting';
      console.log('Connecting to WhatsApp...');
    }

    if (connection === 'open') {
      connectionStatus = 'connected';
      qrCodeBase64 = "";
      qrCodeRaw = "";
      console.log('WhatsApp connection opened successfully!');
    }

    if (connection === 'close') {
      connectionStatus = 'disconnected';
      qrCodeBase64 = "";
      qrCodeRaw = "";
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(`Connection closed. Reconnecting: ${shouldReconnect}`, lastDisconnect.error);
      if (shouldReconnect) {
        setTimeout(connectToWhatsApp, 3000);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // ── WhatsApp AI Auto-Reply Listener ──────────────────────────────────────
  sock.ev.on('messages.upsert', async (m) => {
    try {
      if (m.type !== 'notify') return;
      for (const msg of m.messages) {
        if (!msg.message || msg.key.fromMe) continue; // Ignore own messages

        const senderJid = msg.key.remoteJid;
        if (!senderJid || senderJid.endsWith('@g.us')) continue; // Ignore group messages for now

        const textMessage = msg.message.conversation || 
                           msg.message.extendedTextMessage?.text || 
                           msg.message.buttonsResponseMessage?.selectedButtonId || '';

        if (!textMessage.trim()) continue;

        const senderPhone = senderJid.replace('@s.whatsapp.net', '');
        console.log(`\n📩 [WhatsApp AutoReply] Received message from ${senderPhone}: "${textMessage}"`);

        // Show typing indicator
        try {
          await sock.sendPresenceUpdate('composing', senderJid);
          await new Promise(resolve => setTimeout(resolve, 2000));
          await sock.sendPresenceUpdate('paused', senderJid);
        } catch (_) {}

        // Simple Smart Auto-Reply AI Logic
        let replyText = '';
        const lowerMsg = textMessage.toLowerCase();

        if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much') || lowerMsg.includes('plan')) {
          replyText = `Hello! 👋 Thanks for reaching out to ApexReach.\n\nOur Growth Packages start at ₦75,000 for Starter WhatsApp Catalogs and ₦185,000 for full Business Portals with virtual bank transfer. Would you like to view a live preview for your business?`;
        } else if (lowerMsg.includes('preview') || lowerMsg.includes('site') || lowerMsg.includes('website') || lowerMsg.includes('link')) {
          replyText = `Great! 🌐 You can view your business preview live at: https://lead-generation-automation-ecru.vercel.app/\n\nReply with 'CLAIM' when you are ready to launch!`;
        } else if (lowerMsg.includes('claim') || lowerMsg.includes('buy') || lowerMsg.includes('pay') || lowerMsg.includes('start')) {
          replyText = `Awesome! 🚀 To claim your site and setup your domain, choose your preferred payment option:\n1️⃣ Bank Transfer (Moniepoint)\n2️⃣ Paystack Card Payment\n\nVisit your portal or call us directly to finalize setup!`;
        } else {
          replyText = `Hello! 👋 Thank you for contacting ApexReach B2B Growth Engine.\nHow can we assist your business today? (Reply 'PRICE' for packages, 'PREVIEW' for website samples, or 'CLAIM' to activate your portal).`;
        }

        await sock.sendMessage(senderJid, { text: replyText });
        console.log(`📤 [WhatsApp AutoReply] Auto-replied to ${senderPhone}`);
      }
    } catch (err) {
      console.error('[WhatsApp AutoReply Error]:', err.message);
    }
  });
}

// REST Endpoint to send message with human-like typing simulation
app.post('/send', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) {
    return res.status(400).json({ error: "Missing phone or message in payload" });
  }

  if (connectionStatus !== 'connected' || !sock) {
    return res.status(400).json({ error: `WhatsApp client is not connected. Current status: ${connectionStatus}` });
  }

  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const jid = `${cleanPhone}@s.whatsapp.net`;
    
    // Simulate human typing
    try {
      await sock.sendPresenceUpdate('composing', jid);
      // Typing duration depends on message length (approx 15ms per character, capped between 1.5s and 4s)
      const typingDuration = Math.min(Math.max(message.length * 15, 1500), 4000);
      await new Promise(resolve => setTimeout(resolve, typingDuration));
      await sock.sendPresenceUpdate('paused', jid);
    } catch (presenceErr) {
      console.warn("[Baileys Service] Failed to send presence update, sending message anyway:", presenceErr.message);
    }

    await sock.sendMessage(jid, { text: message });
    console.log(`[Baileys Service] Message successfully sent to ${cleanPhone}`);
    return res.json({ success: true, message: `Message sent to ${cleanPhone}` });
  } catch (err) {
    console.error("[Baileys Service] Send error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Serve visual HTML Pairing Dashboard at GET /
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ApexReach — Baileys WhatsApp Connection Console</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        h1 { font-size: 1.5rem; color: #38bdf8; margin-bottom: 8px; }
        p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 24px; }
        .status-badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-weight: 600; font-size: 0.875rem; text-transform: uppercase; margin-bottom: 20px; }
        .status-connected { background: #059669; color: #ecfdf5; }
        .status-qr { background: #d97706; color: #fffbeb; }
        .status-disconnected { background: #dc2626; color: #fef2f2; }
        .qr-box { background: white; padding: 16px; border-radius: 12px; display: inline-block; margin-bottom: 20px; min-width: 200px; min-height: 200px; }
        .qr-box img { width: 220px; height: 220px; display: block; }
        .btn { background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 12px; }
        .btn:hover { background: #0369a1; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>📱 WhatsApp Baileys Gateway</h1>
        <p>ApexReach B2B Lead Outreach & Pre-Verification Engine</p>
        <div id="statusBadge" class="status-badge status-disconnected">Checking...</div>
        <div id="qrContainer" class="qr-box">Loading QR Code...</div>
        <div>
          <button class="btn" onclick="fetchStatus()">🔄 Refresh Status</button>
        </div>
      </div>
      <script>
        async function fetchStatus() {
          try {
            const res = await fetch('/status');
            const data = await res.json();
            const badge = document.getElementById('statusBadge');
            const container = document.getElementById('qrContainer');
            
            badge.innerText = 'STATUS: ' + data.status;
            badge.className = 'status-badge status-' + data.status;

            if (data.status === 'connected') {
              container.innerHTML = '<div style="color:#059669; font-weight:bold; font-size:1.2rem; padding: 40px 10px;">✅ WhatsApp Active & Connected!<br/><span style="font-size:0.85rem; color:#475569;">Ready for Lead Pre-Verification & Outreach</span></div>';
            } else if (data.qrCodeUrl) {
              container.innerHTML = '<img src="' + data.qrCodeUrl + '" alt="WhatsApp QR Code"/><p style="color:#334155; font-size:0.8rem; margin-top:8px;">Scan with WhatsApp on your phone</p>';
            } else {
              container.innerHTML = '<div style="color:#64748b; padding: 40px 10px;">Connecting to WhatsApp client...</div>';
            }
          } catch(e) {
            document.getElementById('statusBadge').innerText = 'STATUS: UNREACHABLE';
          }
        }
        fetchStatus();
        setInterval(fetchStatus, 3000);
      </script>
    </body>
    </html>
  `);
});

// REST Endpoint to query connection status and get pairing QR code
app.get('/status', (req, res) => {
  res.json({
    status: connectionStatus,
    qrCodeUrl: qrCodeBase64,
    qrRaw: qrCodeRaw
  });
});

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
    // If not connected, return fallback estimation based on E.164 validity
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


// Endpoint to force logout and reset session
app.post('/logout', (req, res) => {
  try {
    const authDir = path.join(__dirname, '../local_db/baileys_auth');
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true });
    }
    connectionStatus = "disconnected";
    qrCodeBase64 = "";
    qrCodeRaw = "";
    if (sock) {
      sock.end();
    }
    setTimeout(connectToWhatsApp, 1000);
    return res.json({ success: true, message: "Session reset initiated" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.WHATSAPP_BAILEYS_PORT || 3007;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Baileys Custom WhatsApp service running on http://localhost:${PORT}`);
  connectToWhatsApp().catch(err => console.error("Error starting Baileys connect process:", err));
});
