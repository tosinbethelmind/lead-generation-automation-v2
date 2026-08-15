const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function run() {
  const targetPhone = '2348022791227';
  const authDir = path.join(__dirname, '../local_db/baileys_auth_line1');

  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
  }
  fs.mkdirSync(authDir, { recursive: true });

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
      console.log('\n🎉 LINE 1 IS OPEN AND AUTHENTICATED!\n');
    }
  });

  await new Promise(r => setTimeout(r, 3000));
  try {
    const code = await sock.requestPairingCode(targetPhone);
    const formatted = code?.match(/.{1,4}/g)?.join('-') || code;
    console.log(`PAIRING_CODE_RESULT:${formatted}`);
  } catch (err) {
    console.error(`ERROR:${err.message}`);
  }
}

run();
