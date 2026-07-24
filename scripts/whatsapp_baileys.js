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

// REST Endpoint to query connection status and get pairing QR code
app.get('/status', (req, res) => {
  res.json({
    status: connectionStatus,
    qrCodeUrl: qrCodeBase64,
    qrRaw: qrCodeRaw
  });
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
