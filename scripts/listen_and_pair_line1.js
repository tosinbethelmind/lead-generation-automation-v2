const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function listenAndPair() {
  const targetPhone = '2348022791227';
  const authDir = path.join(__dirname, '../local_db/baileys_auth_line1');

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ['Windows', 'Chrome', '125.0.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr } = update;
    if (qr) {
      const qrDataUrl = await QRCode.toDataURL(qr, { width: 350 });
      fs.writeFileSync(path.join(__dirname, '../local_db/whatsapp_qr.html'), `<!DOCTYPE html>
<html><body style="background:#0f172a;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
<div style="background:#1e293b;padding:30px;border-radius:16px;text-align:center;">
<h2 style="color:#38bdf8;">Scan to Link Line 1 (+2348022791227)</h2>
<img src="${qrDataUrl}" style="background:white;padding:12px;border-radius:8px;"/>
</div></body></html>`);
    }

    if (connection === 'open') {
      console.log('\n🎉 [SUCCESS]: YOUR WHATSAPP PHONE (+2348022791227) IS NOW 100% LINKED & ACTIVE!\n');
      try {
        await sock.sendMessage('2348022791227@s.whatsapp.net', {
          text: '✅ *[BETHELMIND AUTOMATION ACTIVE]*\n\nYour WhatsApp line is now successfully connected to the 24/7 AI Arbitrage & Outreach Engine! All actionable reports and buyer inquiries will route here directly.'
        });
        console.log('✅ Confirmation ping delivered to your WhatsApp!');
      } catch (err) {
        console.log('Ping delivery note:', err.message);
      }
    }
  });

  // Request fresh pairing code if not registered
  if (!sock.authState.creds.registered) {
    await new Promise(r => setTimeout(r, 2000));
    try {
      const code = await sock.requestPairingCode(targetPhone);
      const formatted = code?.match(/.{1,4}/g)?.join('-') || code;
      console.log(`\n🔑 ACTIVE_PAIRING_CODE:${formatted}\n`);
    } catch (e) {
      console.log('Pairing code request note:', e.message);
    }
  }

  // Keep process alive indefinitely
  setInterval(() => {}, 10000);
}

listenAndPair().catch(console.error);
