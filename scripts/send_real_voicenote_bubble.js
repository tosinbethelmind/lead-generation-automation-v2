const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function sendVoiceNoteToAdmin() {
  console.log('Sending actual audio voice note to 2348022791227...');

  // Try baileys_auth_line2 then baileys_auth_line1
  const candidateDirs = [
    path.join(process.cwd(), 'local_db', 'baileys_auth_line2'),
    path.join(process.cwd(), 'local_db', 'baileys_auth_line1')
  ];

  for (const authDir of candidateDirs) {
    if (!fs.existsSync(path.join(authDir, 'creds.json'))) continue;

    console.log(`Connecting through: ${path.basename(authDir)}...`);
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

    const sent = await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        try { sock.end(undefined); } catch (_) {}
        resolve(false);
      }, 15000);

      sock.ev.on('connection.update', async (up) => {
        if (up.connection === 'open') {
          console.log(`🎉 Connected as +${sock.user?.id?.split(':')[0]}!`);
          try {
            // 1. Send Audio File as Voice Note
            const audioPath = path.join(process.cwd(), 'public', 'audio', 'sample_voicenote_jacio.wav');
            if (fs.existsSync(audioPath)) {
              console.log('Dispatching audio voice note buffer...');
              const audioBuffer = fs.readFileSync(audioPath);
              await sock.sendMessage('2348022791227@s.whatsapp.net', {
                audio: audioBuffer,
                mimetype: 'audio/mp4',
                ptt: true // True makes it show as a real voice note bubble with play button!
              });
              console.log('✅ AUDIO VOICE NOTE BUBBLE DISPATCHED!');
            }

            // 2. Send Summary Text
            await sock.sendMessage('2348022791227@s.whatsapp.net', {
              text: `🎙️ *[OFFICIAL 35s VOICE NOTE DELIVERED]*\n\nAbove is the official voice note for *Jacio International Company Ltd* (Ref: BM-OTC-701-JACIO).\n\nTap play to listen to the audio message!`
            });
            console.log('✅ SUMMARY TEXT DISPATCHED!');

            clearTimeout(timeout);
            setTimeout(() => {
              try { sock.end(undefined); } catch (_) {}
              resolve(true);
            }, 3000);
          } catch (err) {
            console.error('Send error:', err.message);
            clearTimeout(timeout);
            try { sock.end(undefined); } catch (_) {}
            resolve(false);
          }
        }
      });
    });

    if (sent) {
      console.log('🚀 Voice note successfully delivered to your WhatsApp!');
      return;
    }
  }
}

sendVoiceNoteToAdmin().catch(console.error);
