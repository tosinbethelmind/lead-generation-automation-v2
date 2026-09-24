/**
 * @file scripts/manage_5_whatsapp_sims.js
 * 
 * 🚀 BETHELMIND ANALYTICS: 5-SIM WHATSAPP MANAGER & PAIRING SYSTEM
 * 
 * Supports up to 5 SIM cards / WhatsApp lines for automated high-volume outreach:
 * - Line 1: local_db/baileys_auth_line1
 * - Line 2: local_db/baileys_auth_line2
 * - Line 3: local_db/baileys_auth_line3
 * - Line 4: local_db/baileys_auth_line4
 * - Line 5: local_db/baileys_auth_line5
 * 
 * Features:
 * 1. 100% Phone-Number Pairing Code (No QR scanning needed).
 * 2. Automatic Nigerian Phone Normalization (080... -> 23480...).
 * 3. Status Inspector across all 5 lines.
 * 4. Test Message Dispatcher from any line.
 * 5. Interactive CLI + Batch Command-line support.
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const LOCAL_DB = path.join(__dirname, '../local_db');
if (!fs.existsSync(LOCAL_DB)) fs.mkdirSync(LOCAL_DB, { recursive: true });

const REGISTRY_PATH = path.join(LOCAL_DB, 'whatsapp_lines_registry.json');

const LINES_CONFIG = {
  1: { id: 1, name: 'WhatsApp Line 1 (Admin Closer)', dir: 'baileys_auth_line1', defaultPhone: '2348022791227' },
  2: { id: 2, name: 'WhatsApp Line 2 (Outreach 1)', dir: 'baileys_auth_line2', defaultPhone: '2347026266946' },
  3: { id: 3, name: 'WhatsApp Line 3 (Outreach 2)', dir: 'baileys_auth_line3', defaultPhone: '2349046050469' },
  4: { id: 4, name: 'WhatsApp Line 4 (Outreach 3)', dir: 'baileys_auth_line4', defaultPhone: '2349135129625' },
  5: { id: 5, name: 'WhatsApp Line 5 (Outreach 4)', dir: 'baileys_auth_line5', defaultPhone: '2347030556877' },
  6: { id: 6, name: 'WhatsApp Line 6 (Outreach 5)', dir: 'baileys_auth_line6', defaultPhone: '2348119346518' },
  7: { id: 7, name: 'WhatsApp Line 7 (Outreach 6)', dir: 'baileys_auth_line7', defaultPhone: '2348141609564' }
};

function normalizePhone(rawPhone) {
  if (!rawPhone) return null;
  let digits = String(rawPhone).replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    digits = '234' + digits.substring(1);
  } else if (digits.length === 10) {
    digits = '234' + digits;
  }
  if (!digits.startsWith('234') || digits.length < 13 || digits.length > 14) {
    return null;
  }
  return digits;
}

function loadRegistry() {
  if (fs.existsSync(REGISTRY_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    } catch (_) {}
  }
  return {};
}

function saveRegistry(reg) {
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2), 'utf8');
}

function inspectLineStatus(lineNum) {
  const cfg = LINES_CONFIG[lineNum];
  if (!cfg) return { connected: false, phone: null, status: 'UNKNOWN' };

  const authDir = path.join(LOCAL_DB, cfg.dir);
  const credsFile = path.join(authDir, 'creds.json');

  if (!fs.existsSync(credsFile)) {
    return { connected: false, phone: null, status: 'NOT_PAIRED' };
  }

  try {
    const creds = JSON.parse(fs.readFileSync(credsFile, 'utf8'));
    if (creds && creds.me && creds.me.id) {
      if (creds.registered === false) {
        return { connected: false, phone: null, status: 'UNLINKED_NEED_REPAIR' };
      }
      const rawJid = creds.me.id;
      const phone = rawJid.split(':')[0].split('@')[0];
      return {
        connected: true,
        phone,
        name: creds.me.name || creds.me.notify || cfg.name,
        status: 'PAIRED_READY'
      };
    }
  } catch (_) {}

  return { connected: false, phone: null, status: 'CREDS_INVALID' };
}

function displayAllLinesStatus() {
  console.log('\n====================================================================');
  console.log('📱 BETHELMIND ANALYTICS: 7-SIM WHATSAPP LINES STATUS REGISTRY');
  console.log('====================================================================');
  
  const reg = loadRegistry();

  for (let i = 1; i <= 7; i++) {
    const cfg = LINES_CONFIG[i];
    const status = inspectLineStatus(i);
    const indicator = status.connected ? '🟢 [ONLINE & PAIRED]' : '⚪ [NOT CONNECTED]';
    const phoneDisplay = status.phone ? `+${status.phone}` : (cfg.defaultPhone ? `+${cfg.defaultPhone} (configured)` : 'No SIM linked yet');

    console.log(`Line ${i}: ${indicator} ${cfg.name}`);
    console.log(`        Phone: ${phoneDisplay}`);
    console.log(`        Folder: local_db/${cfg.dir}\n`);

    if (status.connected) {
      reg[`line_${i}`] = {
        line: i,
        phone: status.phone,
        name: status.name,
        connected: true,
        lastChecked: new Date().toISOString()
      };
    }
  }
  console.log('====================================================================\n');
  saveRegistry(reg);
}

function generatePairingCode(lineNum, rawPhone) {
  return new Promise(async (resolve) => {
    const cfg = LINES_CONFIG[lineNum];
    if (!cfg) {
      console.error(`❌ Invalid Line Number: ${lineNum}. Must be between 1 and 7.`);
      return resolve(false);
    }

    const phone = normalizePhone(rawPhone || cfg.defaultPhone);
    if (!phone) {
      console.error(`\n❌ Invalid Nigerian Phone Number: "${rawPhone}".`);
      console.error(`   Please provide a valid 11-digit Nigerian number (e.g. 08022791227 or 2348022791227).\n`);
      return resolve(false);
    }

    // Check if Gateway Daemon is active on port 3008 to delegate pairing cleanly
    try {
      const gCheck = await fetch('http://localhost:3008/api/status', { signal: AbortSignal.timeout(1500) });
      if (gCheck.ok) {
        console.log(`📡 Bethelmind Gateway active on port 3008. Requesting pairing code via Gateway...`);
        const pRes = await fetch('http://localhost:3008/api/pair', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lineId: lineNum, phone, method: 'code' })
        });
        const pData = await pRes.json();
        if (pData.ok && pData.pairingCode) {
          console.log(`\n======================================================`);
          console.log(`🔑 8-DIGIT PAIRING CODE FOR LINE ${lineNum} (+${phone}):`);
          console.log(`        👉 [  ${pData.pairingCode}  ]  👈`);
          console.log(`📱 On WhatsApp: Settings -> Linked Devices -> Link with phone number`);
          console.log(`======================================================\n`);
          return resolve(true);
        }
      }
    } catch (_) {}

    const authDir = path.join(LOCAL_DB, cfg.dir);
    console.log(`\n🔄 Initializing WhatsApp engine for ${cfg.name} (+${phone})...`);

    // Fresh session directory for clean pairing
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true });
    }
    fs.mkdirSync(authDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(authDir);

    let version = [2, 3000, 1043857760];
    try {
      const v = await fetchLatestBaileysVersion();
      version = v.version;
    } catch (_) {}

    const sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false,
      browser: Browsers.windows('Desktop'),
      connectTimeoutMs: 60000,
      syncFullHistory: false
    });

    sock.ev.on('creds.update', saveCreds);

    let pairCodeRequested = false;

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'open') {
        console.log(`\n🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉`);
        console.log(`✅ SUCCESS! ${cfg.name} (+${phone}) IS OFFICIALLY CONNECTED!`);
        console.log(`   Session permanently secured in: local_db/${cfg.dir}`);
        console.log(`🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n`);

        const reg = loadRegistry();
        reg[`line_${lineNum}`] = {
          line: lineNum,
          phone,
          connected: true,
          pairedAt: new Date().toISOString()
        };
        saveRegistry(reg);

        setTimeout(() => {
          try { sock.end(); } catch (_) {}
          resolve(true);
        }, 3000);
      } else if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        if (!pairCodeRequested) {
          console.log(`⚠️ Connection closed before pairing code requested. Code: ${statusCode}`);
        }
      }
    });

    // Wait 3.5s for Baileys handshake before requesting code
    await new Promise(r => setTimeout(r, 3500));

    try {
      const code = await sock.requestPairingCode(phone);
      pairCodeRequested = true;
      const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;

      console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
      console.log(`║      🔑 8-CHARACTER WHATSAPP PAIRING CODE FOR LINE ${lineNum}       ║`);
      console.log(`╠══════════════════════════════════════════════════════════════╣`);
      console.log(`║                                                              ║`);
      console.log(`║                  👉   ${formattedCode.padEnd(9)}   👈                      ║`);
      console.log(`║                                                              ║`);
      console.log(`╚══════════════════════════════════════════════════════════════╝\n`);

      console.log(`📱 HOW TO VERIFY ON YOUR PHONE IN 10 SECONDS:`);
      console.log(`   1. Open WhatsApp on the phone with SIM: +${phone}`);
      console.log(`   2. Tap Settings (or ⋮ 3 dots) ➔ "Linked Devices"`);
      console.log(`   3. Tap "Link a Device"`);
      console.log(`   4. Tap "Link with phone number instead" at the bottom`);
      console.log(`   5. Enter the 8-character code: ${formattedCode}`);
      console.log(`\n⏳ Waiting for you to type the code on your phone (listening)...`);

      // Keep process alive up to 90s for user to input code
      setTimeout(() => {
        const status = inspectLineStatus(lineNum);
        if (!status.connected) {
          console.log(`\n⏰ Timeout waiting for pairing. You can re-run this anytime.`);
          try { sock.end(); } catch (_) {}
          resolve(false);
        }
      }, 90000);

    } catch (err) {
      console.error(`❌ Failed to request pairing code for Line ${lineNum}:`, err.message);
      try { sock.end(); } catch (_) {}
      resolve(false);
    }
  });
}

function sendTestMessage(lineNum, recipientPhone, text = 'Hello from Bethelmind Analytics Lagos Desk!') {
  return new Promise(async (resolve) => {
    const cfg = LINES_CONFIG[lineNum];
    if (!cfg) {
      console.log(`❌ Invalid line number ${lineNum}`);
      return resolve(false);
    }

    const authDir = path.join(LOCAL_DB, cfg.dir);
    if (!fs.existsSync(path.join(authDir, 'creds.json'))) {
      console.log(`❌ Line ${lineNum} is not paired yet. Please pair it first.`);
      return resolve(false);
    }

    const targetPhone = normalizePhone(recipientPhone);
    if (!targetPhone) {
      console.log(`❌ Invalid recipient phone number: ${recipientPhone}`);
      return resolve(false);
    }

    console.log(`📤 Sending test message from Line ${lineNum} to +${targetPhone}...`);
    const { state, saveCreds } = await useMultiFileAuthState(authDir);

    const sock = makeWASocket({
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false,
      browser: ['Windows', 'Chrome', '128.0.6613.120']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection } = update;
      if (connection === 'open') {
        try {
          const jid = `${targetPhone}@s.whatsapp.net`;
          await sock.sendMessage(jid, { text });
          console.log(`✅ Test message sent successfully to +${targetPhone} via Line ${lineNum}!`);
          setTimeout(() => {
            try { sock.end(); } catch (_) {}
            resolve(true);
          }, 2000);
        } catch (err) {
          console.error(`❌ Failed to send message:`, err.message);
          try { sock.end(); } catch (_) {}
          resolve(false);
        }
      }
    });
  });
}

// ── Interactive CLI Menu ──────────────────────────────────────────────────────
function runInteractiveMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n====================================================================');
  console.log('👑 BETHELMIND ANALYTICS: 7-SIM WHATSAPP MANAGEMENT CENTER');
  console.log('====================================================================');
  console.log('  [1] Check Live Status of All 7 Lines');
  console.log('  [2] Link Line 1 (Admin Closer: 0802 279 1227)');
  console.log('  [3] Link Line 2 (Outreach 1: 0702 626 6946)');
  console.log('  [4] Link Line 3 (Outreach 2: 0904 605 0469)');
  console.log('  [5] Link Line 4 (Outreach 3: 0913 512 9625)');
  console.log('  [6] Link Line 5 (Outreach 4: 0703 055 6877)');
  console.log('  [7] Link Line 6 (Outreach 5: 0811 934 6518)');
  console.log('  [8] Link Line 7 (Outreach 6: 0814 160 9564)');
  console.log('  [9] Send Test Message from a Connected Line');
  console.log('  [0] Exit');
  console.log('====================================================================');

  rl.question('\nSelect an option (0-9): ', async (ans) => {
    const choice = ans.trim();

    if (choice === '1') {
      displayAllLinesStatus();
      rl.close();
      process.exit(0);
    } else if (['2', '3', '4', '5', '6', '7', '8'].includes(choice)) {
      const lineNum = parseInt(choice, 10) - 1;
      const cfg = LINES_CONFIG[lineNum];
      rl.question(`Enter the Nigerian phone number for Line ${lineNum} (default: ${cfg.defaultPhone}): `, async (phoneInput) => {
        rl.close();
        const targetPhone = phoneInput.trim() || cfg.defaultPhone;
        await generatePairingCode(lineNum, targetPhone);
        process.exit(0);
      });
    } else if (choice === '9') {
      rl.question('Enter line number to send from (1-7): ', (lInput) => {
        const line = parseInt(lInput.trim(), 10);
        rl.question('Enter recipient Nigerian phone (e.g. 08022791227): ', async (recip) => {
          rl.close();
          await sendTestMessage(line, recip.trim());
          process.exit(0);
        });
      });
    } else {
      console.log('Goodbye.');
      rl.close();
      process.exit(0);
    }
  });
}

// ── CLI Argument Parser ───────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--status')) {
    displayAllLinesStatus();
    process.exit(0);
  }

  const lineArg = args.find(a => a.startsWith('--line='));
  const phoneArg = args.find(a => a.startsWith('--phone='));
  const testArg = args.includes('--test');
  const toArg = args.find(a => a.startsWith('--to='));

  if (lineArg && phoneArg && !testArg) {
    const lineNum = parseInt(lineArg.split('=')[1], 10);
    const rawPhone = phoneArg.split('=')[1];
    await generatePairingCode(lineNum, rawPhone);
    process.exit(0);
  }

  if (testArg && lineArg && toArg) {
    const lineNum = parseInt(lineArg.split('=')[1], 10);
    const to = toArg.split('=')[1];
    await sendTestMessage(lineNum, to);
    process.exit(0);
  }

  // If no CLI flags provided, launch interactive visual menu
  runInteractiveMenu();
}

main();
