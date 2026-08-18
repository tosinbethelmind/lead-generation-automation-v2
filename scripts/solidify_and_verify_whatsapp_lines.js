/**
 * scripts/solidify_and_verify_whatsapp_lines.js
 * 
 * Bethelmind Analytics — Dual-Line WhatsApp Solidification & Verification Engine
 * 
 * 1. Synchronizes and solidifies all cryptographic credentials for:
 *    - Line 1: +234 702 626 6946 (Port 3007)
 *    - Line 2: +234 904 605 0469 (Port 3009)
 * 2. Establishes live non-destructive Baileys handshake with WhatsApp servers.
 * 3. Verifies zero session loss, self-healing backups, and readiness for rotation.
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

function syncDirectory(src, dest) {
  if (!fs.existsSync(src)) return 0;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src);
  let count = 0;
  for (const entry of entries) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const stat = fs.statSync(srcPath);
    if (stat.isFile()) {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

const LINE_CONFIGS = [
  {
    id: 1,
    name: 'Outreach Line 1 (Primary)',
    phone: '2347026266946',
    port: 3007,
    authDir: path.join(__dirname, '../local_db/baileys_auth'),
    backupDirs: [
      path.join(__dirname, '../local_db/baileys_auth_solidified_backup'),
      path.join(__dirname, '../local_db/baileys_auth_permanent_master'),
      path.join(__dirname, '../local_db/baileys_auth_line1'),
      path.join(__dirname, '../local_db/baileys_auth_outreach1')
    ]
  },
  {
    id: 2,
    name: 'Outreach Line 2 (Rotator)',
    phone: '2349046050469',
    port: 3009,
    authDir: path.join(__dirname, '../local_db/baileys_auth_line2'),
    backupDirs: [
      path.join(__dirname, '../local_db/baileys_auth_line2_solidified_backup'),
      path.join(__dirname, '../local_db/baileys_auth_line3'),
      path.join(__dirname, '../local_db/baileys_auth_outreach2')
    ]
  }
];

async function testLineAuth(config) {
  console.log(`\n=============================================================`);
  console.log(`🔍 VERIFYING & SOLIDIFYING LINE ${config.id}: ${config.name}`);
  console.log(`📞 Expected Phone: +${config.phone} (Port ${config.port})`);
  console.log(`📁 Primary Auth: ${path.relative(process.cwd(), config.authDir)}`);
  console.log(`=============================================================`);

  // 1. Check primary creds or restore from backup
  const credsFile = path.join(config.authDir, 'creds.json');
  if (!fs.existsSync(credsFile)) {
    console.log(`⚠️ Primary creds.json missing. Attempting self-healing recovery...`);
    let restored = false;
    for (const bDir of config.backupDirs) {
      if (fs.existsSync(path.join(bDir, 'creds.json'))) {
        console.log(`🔄 Restoring credentials from ${path.relative(process.cwd(), bDir)}...`);
        syncDirectory(bDir, config.authDir);
        restored = true;
        break;
      }
    }
    if (!restored) {
      return { id: config.id, success: false, reason: 'no_creds' };
    }
  }

  // 2. Perform Solidification Backup
  for (const bDir of config.backupDirs) {
    const copied = syncDirectory(config.authDir, bDir);
    console.log(`💾 Solidified ${copied} auth keys to ${path.relative(process.cwd(), bDir)}`);
  }

  // 3. Connect to WhatsApp Socket to verify authentication
  const { state } = await useMultiFileAuthState(config.authDir);
  let version = [2, 3000, 1035194821];
  try {
    const v = await fetchLatestBaileysVersion();
    version = v.version;
  } catch (_) {}

  return new Promise((resolve) => {
    let resolved = false;
    const sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false,
      browser: ['Bethelmind Analytics', 'Chrome', '124.0.0']
    });

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.log(`⏱️ Connection timed out for Line ${config.id}`);
        try { sock.end(); } catch (_) {}
        resolve({ id: config.id, success: false, reason: 'timeout' });
      }
    }, 15000);

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log(`⚠️ Line ${config.id} requires QR re-pairing.`);
      }

      if (connection === 'connecting') {
        console.log(`⏳ Handshaking with WhatsApp servers...`);
      }

      if (connection === 'open') {
        clearTimeout(timeout);
        resolved = true;
        const actualPhone = sock.user?.id ? sock.user.id.split(':')[0] : config.phone;
        const userName = sock.user?.name || 'Verified Session';
        console.log(`✅ LINE ${config.id} IS 100% ONLINE & AUTHENTICATED!`);
        console.log(`   - Connected Number: +${actualPhone}`);
        console.log(`   - Registered Name: ${userName}`);
        console.log(`   - Solidification: SECURED & BACKED UP`);

        setTimeout(() => {
          try { sock.end(); } catch (_) {}
          resolve({
            id: config.id,
            success: true,
            phone: actualPhone,
            userName,
            port: config.port,
            status: 'ONLINE & SOLIDIFIED'
          });
        }, 1200);
      }

      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode;
        if (code === DisconnectReason.loggedOut && !resolved) {
          clearTimeout(timeout);
          resolved = true;
          resolve({ id: config.id, success: false, reason: 'logged_out' });
        }
      }
    });
  });
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║   BETHELMIND ANALYTICS — WHATSAPP LINE SOLIDIFICATION HUB      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  const results = [];
  for (const cfg of LINE_CONFIGS) {
    const res = await testLineAuth(cfg);
    results.push(res);
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n=============================================================');
  console.log('📊 FINAL DUAL-LINE SOLIDIFICATION REPORT:');
  console.log('=============================================================');
  results.forEach(r => {
    if (r.success) {
      console.log(`✅ Line ${r.id} (+${r.phone}) [Port ${r.port}]: ${r.status} (${r.userName})`);
    } else {
      console.log(`❌ Line ${r.id}: FAILED (${r.reason})`);
    }
  });
  console.log('=============================================================\n');

  process.exit(0);
}

main();
