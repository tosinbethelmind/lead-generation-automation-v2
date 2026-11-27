const { fetchLatestBaileysVersion, default: makeWASocket } = require('@whiskeysockets/baileys');

async function checkVersion() {
  try {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log('Latest Baileys WhatsApp Web version:', version, 'Is Latest:', isLatest);
  } catch (e) {
    console.error('Fetch version error:', e.message);
  }
}

checkVersion();
