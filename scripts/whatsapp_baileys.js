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

// REST Endpoint to send message
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

const PORT = process.env.WHATSAPP_BAILEYS_PORT || 3006;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Baileys Custom WhatsApp service running on http://localhost:${PORT}`);
  connectToWhatsApp().catch(err => console.error("Error starting Baileys connect process:", err));
});
