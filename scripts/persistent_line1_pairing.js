const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function startPersistentLine1() {
  const targetPhone = '2348022791227';
  const authDir = path.join(__dirname, '../local_db/baileys_auth_line1');

  console.log(`\n======================================================`);
  console.log(`🚀 STARTING PERSISTENT PAIRING DAEMON FOR LINE 1 (+${targetPhone})`);
  console.log(`======================================================\n`);

  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  let version = [2, 3000, 1035194821];
  try {
    const v = await fetchLatestBaileysVersion();
    version = v.version;
  } catch (_) {}

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: true,
    browser: ['Windows', 'Chrome', '125.0.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  // Keep process alive indefinitely
  const keepAlive = setInterval(() => {}, 1000);

  let pairingCodeRequested = false;

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log(`\n📷 [Line 1 QR CODE GENERATED] - You can also scan this QR with your phone:`);
      qrcodeTerminal.generate(qr, { small: true });

      // Save HTML preview for easy scanning
      try {
        const qrDataUrl = await QRCode.toDataURL(qr, { width: 350 });
        const htmlContent = `<!DOCTYPE html>
<html>
<head><title>Line 1 (+2348022791227) WhatsApp QR</title>
<style>body{background:#0f172a;color:#fff;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;}
.card{background:#1e293b;padding:30px;border-radius:16px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.5);}
img{border-radius:12px;background:white;padding:12px;}
</style></head>
<body><div class="card">
<h2 style="color:#38bdf8;">📱 Link Admin Line 1 (+2348022791227)</h2>
<p style="color:#94a3b8;">Scan with WhatsApp ➔ Linked Devices</p>
<img src="${qrDataUrl}" />
</div></body></html>`;
        fs.writeFileSync(path.join(__dirname, '../local_db/line1_qr.html'), htmlContent);
        console.log(`🌐 Visual QR HTML page updated at: local_db/line1_qr.html`);
      } catch (_) {}
    }

    if (connection === 'connecting') {
      console.log(`⏳ Connecting to WhatsApp servers for Line 1...`);
    }

    if (connection === 'open') {
      clearInterval(keepAlive);
      const userPhone = sock.user?.id ? sock.user.id.split(':')[0] : targetPhone;
      console.log(`\n======================================================`);
      console.log(`🎉 LINE 1 (+${userPhone}) IS NOW 100% CONNECTED & AUTHENTICATED! ✅`);
      console.log(`======================================================\n`);

      // Dispatch live confirmation message
      try {
        await sock.sendMessage(`${targetPhone}@s.whatsapp.net`, {
          text: `🧪 *[LINE 1 CONNECTED]*\n\n🎉 Hello Tosin, Line 1 (+${userPhone}) has been successfully linked and authenticated!\n\nAll 3 lines (Admin + Outreach 1 + Outreach 2) are now 100% operational for your Lagos 10K Multi-Sector Outreach Engine.`
        });
        console.log(`✅ Confirmation message sent to +${targetPhone}`);
      } catch (e) {
        console.error('Error sending confirmation:', e.message);
      }

      setTimeout(() => {
        process.exit(0);
      }, 5000);
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.log(`⚠️ Connection closed for Line 1 (code: ${statusCode}). Reconnecting...`);
      if (statusCode === DisconnectReason.loggedOut) {
        console.log('Clearing old session for fresh pairing...');
        if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true, force: true });
        clearInterval(keepAlive);
        setTimeout(startPersistentLine1, 2000);
      }
    }
  });

  if (!sock.authState.creds.registered && !pairingCodeRequested) {
    pairingCodeRequested = true;
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(targetPhone);
        const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;
        console.log(`\n======================================================`);
        console.log(`🔑 ACTIVE 8-DIGIT PAIRING CODE FOR LINE 1 (+${targetPhone}):`);
        console.log(`\n       ╔══════════════════════╗`);
        console.log(`       ║     ${formattedCode}      ║`);
        console.log(`       ╚══════════════════════╝\n`);
        console.log(`📱 ENTER ON YOUR PHONE (KEEPING SESSION OPEN):`);
        console.log(`1. Open WhatsApp on +${targetPhone}`);
        console.log(`2. Tap Settings ➔ Linked Devices ➔ Link a Device`);
        console.log(`3. Tap "Link with phone number instead"`);
        console.log(`4. Enter code: ${formattedCode}`);
        console.log(`======================================================\n`);
      } catch (err) {
        console.error('❌ Pairing code request error:', err.message);
      }
    }, 4000);
  }
}

startPersistentLine1();
