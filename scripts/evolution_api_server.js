/**
 * @file scripts/evolution_api_server.js
 * Multi-Instance Evolution API (v1 / v2) Server Supporting ALL 7 Concurrent WhatsApp Lines
 * Runs locally on http://localhost:8080
 * 
 * Features:
 * - Complete 7-Line WhatsApp Architecture:
 *     • Line 1: Admin Closer Desk (0802 279 1227)
 *     • Line 2: Outreach Desk 1 (0702 626 6946)
 *     • Line 3: Outreach Desk 2 (0904 605 0469)
 *     • Line 4: Outreach Desk 3 (0913 512 9625)
 *     • Line 5: Outreach Desk 4 (0703 055 6877)
 *     • Line 6: Outreach Desk 5 (0811 934 6518)
 *     • Line 7: Outreach Desk 6 (0814 160 9564)
 * - PERMANENT SESSION PRESERVATION:
 *     • Never wipes or deletes valid auth folders on close
 *     • Preserves all linked devices across reboots
 *     • Auto-reconnects existing linked sessions
 *     • 1-Click "Reconnect / Verify Link" button for existing sessions
 * - 100% Evolution API v1/v2 compatible endpoints + Baileys gateway aliases
 * - Official Browsers.windows('Desktop') identity to prevent bot flags
 * - Canonical auth directories: local_db/baileys_auth_line1 to line7
 * - Safe reconnect watchdog with exponential backoff (zero 403 infinite loops)
 * - Premium 7-Line Command Center Dashboard with live indicators
 */

const express = require('express');
const cors = require('cors');
const { 
  default: makeWASocket, 
  useMultiFileAuthState, 
  fetchLatestBaileysVersion, 
  DisconnectReason,
  Browsers
} = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

const API_KEY = process.env.EVOLUTION_API_KEY || 'evolution_bethelmind_secret_2026';
const PORT = process.env.EVOLUTION_PORT || 8080;
const BAILEYS_VERSION = [2, 3000, 1043857760];

const instances = {
  instance_1: { 
    id: 1,
    key: 'instance_1',
    name: 'bethelmind_instance_1', 
    label: 'Line 1: Admin Closer Desk (0802 279 1227)', 
    role: 'Admin Closer Desk (Inbound Calls & High-Intent Closers)',
    canonicalDir: 'baileys_auth_line1',
    fallbackPhone: '2348022791227',
    displayPhone: '0802 279 1227',
    socket: null, 
    qr: '', 
    pairingCode: '', 
    state: 'close', 
    phone: '',
    hasSavedLink: false,
    reconnectAttempts: 0
  },
  instance_2: { 
    id: 2,
    key: 'instance_2',
    name: 'bethelmind_instance_2', 
    label: 'Line 2: Outreach Desk 1 (0702 626 6946)', 
    role: 'Commercial Cold Outreach & Speed-to-Lead Followup',
    canonicalDir: 'baileys_auth_line2',
    fallbackPhone: '2347026266946',
    displayPhone: '0702 626 6946',
    socket: null, 
    qr: '', 
    pairingCode: '', 
    state: 'close', 
    phone: '',
    hasSavedLink: false,
    reconnectAttempts: 0
  },
  instance_3: { 
    id: 3,
    key: 'instance_3',
    name: 'bethelmind_instance_3', 
    label: 'Line 3: Outreach Desk 2 (0904 605 0469)', 
    role: 'Commercial Cold Outreach & Prototype Delivery',
    canonicalDir: 'baileys_auth_line3',
    fallbackPhone: '2349046050469',
    displayPhone: '0904 605 0469',
    socket: null, 
    qr: '', 
    pairingCode: '', 
    state: 'close', 
    phone: '',
    hasSavedLink: false,
    reconnectAttempts: 0
  },
  instance_4: { 
    id: 4,
    key: 'instance_4',
    name: 'bethelmind_instance_4', 
    label: 'Line 4: Outreach Desk 3 (0913 512 9625)', 
    role: 'Commercial Cold Outreach & Voice Note Broadcasting',
    canonicalDir: 'baileys_auth_line4',
    fallbackPhone: '2349135129625',
    displayPhone: '0913 512 9625',
    socket: null, 
    qr: '', 
    pairingCode: '', 
    state: 'close', 
    phone: '',
    hasSavedLink: false,
    reconnectAttempts: 0
  },
  instance_5: { 
    id: 5,
    key: 'instance_5',
    name: 'bethelmind_instance_5', 
    label: 'Line 5: Outreach Desk 4 (0703 055 6877)', 
    role: 'Commercial Cold Outreach & Appointment Locking',
    canonicalDir: 'baileys_auth_line5',
    fallbackPhone: '2347030556877',
    displayPhone: '0703 055 6877',
    socket: null, 
    qr: '', 
    pairingCode: '', 
    state: 'close', 
    phone: '',
    hasSavedLink: false,
    reconnectAttempts: 0
  },
  instance_6: { 
    id: 6,
    key: 'instance_6',
    name: 'bethelmind_instance_6', 
    label: 'Line 6: Outreach Desk 5 (0811 934 6518)', 
    role: 'Commercial Cold Outreach & Sector Tool Demonstrations',
    canonicalDir: 'baileys_auth_line6',
    fallbackPhone: '2348119346518',
    displayPhone: '0811 934 6518',
    socket: null, 
    qr: '', 
    pairingCode: '', 
    state: 'close', 
    phone: '',
    hasSavedLink: false,
    reconnectAttempts: 0
  },
  instance_7: { 
    id: 7,
    key: 'instance_7',
    name: 'bethelmind_instance_7', 
    label: 'Line 7: Outreach Desk 6 (0814 160 9564)', 
    role: 'Commercial Cold Outreach & Importer Escrow Inquiries',
    canonicalDir: 'baileys_auth_line7',
    fallbackPhone: '2348141609564',
    displayPhone: '0814 160 9564',
    socket: null, 
    qr: '', 
    pairingCode: '', 
    state: 'close', 
    phone: '',
    hasSavedLink: false,
    reconnectAttempts: 0
  },
};

function hasSavedSession(authDir) {
  const credsFile = path.join(authDir, 'creds.json');
  if (!fs.existsSync(credsFile)) return null;
  try {
    const stat = fs.statSync(credsFile);
    if (stat.size < 50) return null;
    const creds = JSON.parse(fs.readFileSync(credsFile, 'utf8'));
    if (creds && creds.registered === true && creds.me && creds.me.id) {
      return {
        phone: creds.me.id.split(':')[0],
        name: creds.me.name || creds.me.notify || ''
      };
    }
  } catch (_) {}
  return null;
}

function resolveAuthDir(inst) {
  const localDb = path.join(__dirname, '../local_db');
  const targetDir = path.join(localDb, inst.canonicalDir);

  // Check canonical dir first
  if (hasSavedSession(targetDir)) {
    return targetDir;
  }

  // Check permanent master backup and general backup directories
  const candidateDirs = [
    path.join(localDb, 'baileys_auth_permanent_master', inst.canonicalDir),
    path.join(localDb, 'baileys_auth_backups', inst.canonicalDir),
    inst.id === 1 ? path.join(localDb, 'baileys_auth_admin') : null
  ].filter(Boolean);

  for (const backupDir of candidateDirs) {
    if (hasSavedSession(backupDir)) {
      try {
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        for (const f of fs.readdirSync(backupDir)) {
          const sf = path.join(backupDir, f);
          if (fs.statSync(sf).isFile()) fs.copyFileSync(sf, path.join(targetDir, f));
        }
        console.log(`[Evolution API] 🔄 Restored valid session for ${inst.label} from ${backupDir}`);
        return targetDir;
      } catch (_) {}
    }
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  return targetDir;
}

function updateLineRegistry(inst, isConnected, phone = '') {
  try {
    const regPath = path.join(__dirname, '../local_db/whatsapp_lines_registry.json');
    let reg = {};
    if (fs.existsSync(regPath)) {
      try { reg = JSON.parse(fs.readFileSync(regPath, 'utf8')); } catch (_) {}
    }
    reg[`line_${inst.id}`] = {
      line: inst.id,
      phone: phone || inst.phone || inst.fallbackPhone,
      phoneDisplay: inst.displayPhone,
      role: inst.role,
      connected: isConnected,
      lastChecked: new Date().toISOString()
    };
    fs.writeFileSync(regPath, JSON.stringify(reg, null, 2), 'utf8');
  } catch (_) {}
}

function copyCoreAuthKeys(from, to) {
  if (!fs.existsSync(from)) return 0;
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  let count = 0;
  try {
    const files = fs.readdirSync(from);
    for (const element of files) {
      if (element === 'creds.json' || element.startsWith('app-state') || element.startsWith('identity-key') || element.startsWith('device-list')) {
        const srcFile = path.join(from, element);
        const destFile = path.join(to, element);
        try {
          fs.copyFileSync(srcFile, destFile);
          count++;
        } catch (_) {}
      }
    }
  } catch (_) {}
  return count;
}

function permanentLockSession(inst, authDir) {
  try {
    const localDb = path.join(__dirname, '../local_db');
    const configBackups = path.join(__dirname, '../config', 'baileys_auth_backups', inst.canonicalDir);
    const backupDirs = [
      path.join(localDb, 'baileys_auth_permanent_master', inst.canonicalDir),
      path.join(localDb, 'baileys_auth_backups', inst.canonicalDir),
      configBackups,
      path.join(localDb, `${inst.canonicalDir}_solidified_backup`),
      path.join(localDb, `${inst.canonicalDir}_backup`)
    ];

    let count = 0;
    for (const bDir of backupDirs) {
      count += copyCoreAuthKeys(authDir, bDir);
    }
    console.log(`🔒 [PERMANENT LOCK] ${inst.label} sealed across 5 redundant backup vaults! (${count} keys secured)`);
    return count;
  } catch (err) {
    console.warn(`[Lock Warning] Failed to lock ${inst.label}:`, err.message);
    return 0;
  }
}

function permanentLockAllSessions() {
  const localDb = path.join(__dirname, '../local_db');
  let totalLocked = 0;
  const results = {};

  for (let id = 1; id <= 7; id++) {
    const key = `instance_${id}`;
    const inst = instances[key];
    if (!inst) continue;

    const authDir = path.join(localDb, inst.canonicalDir);
    const credsFile = path.join(authDir, 'creds.json');
    if (fs.existsSync(credsFile)) {
      const lockedCount = permanentLockSession(inst, authDir);
      results[`line_${id}`] = { status: 'locked', keysSecured: lockedCount, phone: inst.phone || inst.fallbackPhone };
      totalLocked++;
    } else {
      results[`line_${id}`] = { status: 'awaiting_pairing', phone: inst.fallbackPhone };
    }
  }

  return { totalLocked, results };
}

function authMiddleware(req, res, next) {
  const apiKey = req.headers['apikey'] || req.query.apikey;
  if (
    req.path === '/' || 
    req.path === '/health' || 
    req.path === '/status' || 
    req.path === '/api/status' ||
    req.path === '/check-whatsapp' ||
    req.path === '/send' ||
    req.path === '/send-voicenote' ||
    req.path.startsWith('/api/') || 
    req.path.startsWith('/pair') ||
    req.path.startsWith('/instance/pairingCode') ||
    req.path.startsWith('/instance/request-qr') ||
    req.path.startsWith('/request-qr') ||
    req.path.startsWith('/request-pairing-code') ||
    req.path.startsWith('/instance/reconnect') ||
    req.path.startsWith('/instance/connect') ||
    req.path.startsWith('/instance/lock') ||
    req.path.startsWith('/lock')
  ) {
    return next();
  }
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: true, message: 'Unauthorized. Invalid apikey.' });
  }
  next();
}

app.use(authMiddleware);

// ── 24/7 INBOUND SALES CLOSER & AUTO-REPLY HANDLER ─────────────────────────
const inboundCooldowns = new Map();

function extractMessageText(msg) {
  if (!msg.message) return '';
  const m = msg.message;
  return m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.buttonsResponseMessage?.selectedDisplayText ||
    m.listResponseMessage?.title ||
    m.templateButtonReplyMessage?.selectedId ||
    m.ephemeralMessage?.message?.conversation ||
    m.ephemeralMessage?.message?.extendedTextMessage?.text ||
    m.viewOnceMessage?.message?.conversation ||
    m.viewOnceMessageV2?.message?.conversation ||
    m.viewOnceMessageV2?.message?.extendedTextMessage?.text ||
    '';
}

function formatInboundCloserReply(text) {
  const lower = (text || '').toLowerCase().trim();

  // Pricing inquiries
  if (/price|cost|how much|fee|pay|pricing|expensive|cheap|charges|amount/i.test(lower)) {
    return `Good day Sir/Ma! Thank you for asking about pricing for *Bethelmind Analytics Lagos* business tools.\n\nWe keep our rates completely transparent with ZERO hidden fees:\n\n1️⃣ *Option A: 1-Line Self-Install Embed* — *₦25,000* (one-time setup).\n   Ideal if you already have a website and just want the 24/7 quoting bot & calculator added in 5 minutes.\n\n2️⃣ *Option B: Full 100% Done-For-You (DFY) Turnkey* — *₦75,000* (Deposit: ₦35,000 to begin).\n   We deliver everything within 48 hours:\n   • Custom .com / .ng business domain\n   • 24/7 AI WhatsApp Sales Bot configured on your business line\n   • Automated Paystack & OPay bank transfer reconciliation (stops fake alerts)\n   • 30-day technical support & staff handover\n\nYou can test drive the interactive demo on your phone right now:\n👉 https://www.bethelmindanalytics.com\n\nWhich option fits your budget better (Self-Install ₦25k or Full DFY ₦75k)?\nYou can also call or message our Head of Desk directly:\n👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
  }

  // Positive interest / demo requests
  if (/yes|send|ok|sure|show me|interested|demo|proceed|details|link|share|go ahead|tell me more|how does it work/i.test(lower)) {
    return `Thank you so much Sir/Ma! We are excited to show you.\n\nHere is the live interactive prototype (test it directly on your mobile device, ₦0 Upfront):\n👉 https://www.bethelmindanalytics.com\n\n📌 *What to test when you open it:*\n1. Try the instant price calculator to see how fast it quotes.\n2. Tap the WhatsApp demo button to experience the sub-3s automated response.\n\nOnce set up on your official business line, it captures paying customers day and night without your staff having to type repetitive replies.\n\nWould you like our technical team to schedule a quick 10-minute activation for your business today?\nConnect directly with our Lagos Desk Head:\n👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
  }

  // Verification / Location / Legitimacy
  if (/who|where|office|address|location|scam|real|legit|call|number/i.test(lower)) {
    return `Good day Sir/Ma!\n\nWe are *Bethelmind Analytics Lagos Desk*, a registered commercial technology enterprise based in Lagos, Nigeria.\n• Head of Desk: Tosin Oyelakin\n• Official Hotline / Direct WhatsApp: 0802 279 1227 (wa.me/2348022791227)\n• Corporate Website: https://www.bethelmindanalytics.com\n• Bank Settlement: Direct OPay Merchant Integration (Oyelakin Tosin Matthew)\n\nWe help Nigerian businesses eliminate after-hours sales loss by deploying automated 24/7 WhatsApp response tools.\n\nYou do NOT pay anything upfront to review your demo. Feel free to inspect our platform or call 0802 279 1227 to speak with Tosin directly.`;
  }

  // General polite response
  return `Good day Sir/Ma! Thank you for reaching out to *Bethelmind Analytics Lagos Desk*.\n\nOur senior technical consultant is reviewing your message right now.\n\nIn the meantime, you can test drive how our 24/7 automated quoting tool works on your phone:\n👉 https://www.bethelmindanalytics.com\n\nTo speak directly with our Head of Desk for immediate setup:\n👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
}

async function handleInboundMessage(inst, msg) {
  try {
    const senderJid = msg.key?.remoteJid || '';
    if (!senderJid.endsWith('@s.whatsapp.net')) return; // ignore groups, broadcasts, newsletters
    if (senderJid === '2348022791227@s.whatsapp.net') return; // ignore admin desk self

    const text = extractMessageText(msg);
    if (!text || !text.trim()) return;

    const cleanSender = senderJid.replace('@s.whatsapp.net', '');
    const now = Date.now();
    const lastReply = inboundCooldowns.get(senderJid) || 0;
    if (now - lastReply < 10 * 60 * 1000) {
      console.log(`[Inbound Closer] Cooldown active for +${cleanSender}. Skipping repeated auto-reply.`);
      return;
    }
    inboundCooldowns.set(senderJid, now);

    console.log(`\n🎧 [Inbound Closer] New inquiry on ${inst.label} from +${cleanSender}: "${text.trim().substring(0, 80)}"`);
    const replyText = formatInboundCloserReply(text);

    // Simulate natural typing delay (800ms - 1500ms)
    await inst.socket.presenceSubscribe(senderJid);
    await inst.socket.sendPresenceUpdate('composing', senderJid);
    await new Promise(r => setTimeout(r, 1200));

    await inst.socket.sendMessage(senderJid, { text: replyText });
    console.log(`✅ [Inbound Closer] Auto-reply dispatched to +${cleanSender}!`);

    // Alert Admin Closer Desk (0802 279 1227) if message came on an outreach line
    if (inst.id !== 1 && instances.instance_1?.socket && instances.instance_1?.state === 'open') {
      try {
        const adminAlert = `🚨 *[INBOUND LEAD ALERT]* on *${inst.label}*\n• From: +${cleanSender}\n• Client Message: "${text.trim()}"\n• Action: Auto-reply closer sent with demo link.\n• Jump in: wa.me/${cleanSender}`;
        await instances.instance_1.socket.sendMessage('2348022791227@s.whatsapp.net', { text: adminAlert });
        console.log(`📢 [Admin Alert] Dispatched lead notification to 0802 279 1227!`);
      } catch (alertErr) {
        console.warn(`[Admin Alert Warning]:`, alertErr.message);
      }
    }

    // Persist into crm_leads.json
    try {
      const crmPath = path.join(__dirname, '../local_db/crm_leads.json');
      let crm = [];
      if (fs.existsSync(crmPath)) {
        try { crm = JSON.parse(fs.readFileSync(crmPath, 'utf8')); } catch (_) {}
      }
      crm.unshift({
        sender: cleanSender,
        lineId: inst.id,
        lineLabel: inst.label,
        message: text.trim(),
        replySent: true,
        timestamp: new Date().toISOString()
      });
      if (crm.length > 500) crm = crm.slice(0, 500);
      fs.writeFileSync(crmPath, JSON.stringify(crm, null, 2), 'utf8');
    } catch (_) {}

  } catch (err) {
    console.warn(`[Inbound Closer Error on ${inst.label}]:`, err.message);
  }
}

async function startInstanceSocket(key, isUserInitiated = false) {
  const inst = instances[key];
  if (!inst) return;

  const authDir = resolveAuthDir(inst);
  const saved = hasSavedSession(authDir);

  if (saved) {
    inst.phone = saved.phone;
    inst.hasSavedLink = true;
  } else if (!isUserInitiated) {
    inst.state = 'close';
    inst.phone = '';
    inst.hasSavedLink = false;
    updateLineRegistry(inst, false);
    return;
  }

  // Safely clean up previous socket if existing
  if (inst.socket) {
    try {
      inst.socket.ev.removeAllListeners();
      inst.socket.end();
    } catch (_) {}
    inst.socket = null;
  }

  try {
    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    inst.state = 'connecting';

    console.log(`[Evolution API] 🚀 Starting ${inst.label} (Session: ${saved ? '+' + saved.phone : 'New Pairing'})...`);

    inst.socket = makeWASocket({
      version: BAILEYS_VERSION,
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false,
      browser: ['Windows', 'Chrome', '128.0.6613.120'],
      syncFullHistory: false,
      markOnlineOnConnect: true,
      keepAliveIntervalMs: 25000,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000
    });

    inst.socket.ev.on('creds.update', saveCreds);

    inst.socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        inst.state = 'connecting';
        try {
          inst.qr = await QRCode.toDataURL(qr, { width: 350, margin: 2 });
        } catch (_) {}
      }

      if (connection === 'connecting') {
        inst.state = 'connecting';
      }

      if (connection === 'open') {
        inst.state = 'open';
        inst.phone = inst.socket.user?.id ? inst.socket.user.id.split(':')[0] : (saved?.phone || inst.fallbackPhone || 'connected');
        inst.hasSavedLink = true;
        inst.pairingCode = '';
        inst.qr = '';
        inst.reconnectAttempts = 0;
        updateLineRegistry(inst, true, inst.phone);

        console.log(`\n======================================================`);
        console.log(`🎉 [Evolution API] ${inst.label} IS CONNECTED & ACTIVE!`);
        console.log(`   Phone Number : +${inst.phone}`);
        console.log(`======================================================\n`);

        // Automatically permanently lock session across 5 redundant vaults
        permanentLockSession(inst, authDir);
      }

      if (connection === 'close') {
        inst.state = 'close';
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        console.log(`[Evolution API] ℹ️ ${inst.label} socket closed (code: ${statusCode}).`);

        // Clean up socket instance safely
        try {
          inst.socket?.ev?.removeAllListeners();
          inst.socket?.end();
        } catch (_) {}
        inst.socket = null;

        // 1. RESTART REQUIRED (515) - CRITICAL: HAPPENS RIGHT AFTER PHONE PAIRS VIA CODE OR QR!
        if (statusCode === DisconnectReason.restartRequired || statusCode === 515) {
          console.log(`[Evolution API] ⚡ Pair handshake accepted by WhatsApp! Restarting socket immediately (400ms) to finalize session for ${inst.label}...`);
          setTimeout(() => {
            startInstanceSocket(key, true);
          }, 400);
          return;
        }

        // 2. LOGGED OUT (401) OR FORBIDDEN (403)
        if (statusCode === DisconnectReason.loggedOut || statusCode === 401 || statusCode === 403) {
          console.log(`[Evolution API] 🔒 Session unlinked for ${inst.label}. Preserving keys on disk.`);
          inst.hasSavedLink = false;
          inst.phone = '';
          updateLineRegistry(inst, false);
          return;
        }

        // 3. TEMPORARY NETWORK DROP / RECONNECT WATCHDOG
        if (inst.hasSavedLink || isUserInitiated) {
          inst.reconnectAttempts = (inst.reconnectAttempts || 0) + 1;
          if (inst.reconnectAttempts <= 10) {
            const delayMs = Math.min(2500 * Math.pow(1.4, inst.reconnectAttempts - 1), 25000);
            console.log(`[Evolution API] 🔄 Reconnecting ${inst.label} in ${(delayMs / 1000).toFixed(1)}s (Attempt ${inst.reconnectAttempts})...`);
            setTimeout(() => {
              startInstanceSocket(key, isUserInitiated);
            }, delayMs);
          }
        }
      }
    });

    // Inbound Sales Closer & Auto-Reply Listener
    inst.socket.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;
      for (const msg of messages) {
        if (!msg.message || msg.key?.fromMe) continue;
        await handleInboundMessage(inst, msg);
      }
    });

  } catch (err) {
    console.error(`[Evolution API] Socket error for ${inst.label}:`, err.message);
    inst.state = 'close';
    inst.socket = null;
  }
}

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    totalLines: Object.keys(instances).length,
    onlineLines: Object.values(instances).filter(i => i.state === 'open').length,
    instances: Object.values(instances).map(i => ({ 
      id: i.id,
      key: i.key, 
      name: i.name, 
      label: i.label,
      role: i.role,
      displayPhone: i.displayPhone,
      state: i.state, 
      phone: i.phone,
      hasSavedLink: i.hasSavedLink
    }))
  });
});

// ── Premium 7-Line WhatsApp Command Center Dashboard ────────────────────────
app.get('/', (req, res) => {
  const onlineCount = Object.values(instances).filter(i => i.state === 'open').length;
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="6">
  <title>Bethelmind 7-Line WhatsApp Command Center</title>
  <style>
    body { background: #070d1e; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 24px; }
    .header { text-align: center; max-width: 1000px; margin: 0 auto 28px auto; }
    h1 { color: #38bdf8; margin-bottom: 6px; font-size: 2rem; font-weight: 800; letter-spacing: -0.5px; }
    p.sub { color: #94a3b8; font-size: 1rem; margin-top: 0; }
    .summary-bar { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 12px 24px; display: inline-flex; gap: 24px; align-items: center; margin-top: 8px; }
    .summary-item { font-size: 0.9rem; color: #94a3b8; }
    .summary-item b { color: #38bdf8; font-size: 1.1rem; }
    .summary-item.online b { color: #10b981; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; max-width: 1400px; margin: 0 auto; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 22px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; }
    .card.connected { border-color: #10b981; }
    .line-number { position: absolute; top: 16px; left: 16px; font-size: 0.75rem; font-weight: 800; background: #1e293b; color: #38bdf8; padding: 4px 10px; border-radius: 6px; }
    .card-title { font-size: 1.05rem; font-weight: 700; color: #f8fafc; margin-top: 24px; margin-bottom: 4px; }
    .card-role { font-size: 0.78rem; color: #64748b; margin-bottom: 14px; min-height: 28px; }
    .badge { padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 0.8rem; display: inline-block; margin-bottom: 16px; letter-spacing: 0.5px; }
    .badge.open { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid #10b981; }
    .badge.connecting { background: rgba(245,158,11,0.2); color: #fbbf24; border: 1px solid #f59e0b; }
    .badge.close { background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid #ef4444; }
    .badge.preserved { background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid #0284c7; }
    .qr-box { background: white; padding: 12px; border-radius: 12px; margin: 14px auto; display: inline-block; }
    img { display: block; width: 200px; height: 200px; }
    .code-box { background: #1e293b; color: #38bdf8; font-size: 1.4rem; font-weight: 800; letter-spacing: 4px; padding: 14px; border-radius: 8px; border: 1px dashed #38bdf8; margin: 14px 0; }
    .input-phone { background: #1e293b; border: 1px solid #334155; color: #f8fafc; padding: 9px 12px; border-radius: 8px; font-size: 0.9rem; width: 75%; margin-bottom: 8px; text-align: center; }
    .btn { background: #0284c7; color: white; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-block; font-size: 0.85rem; margin-top: 4px; }
    .btn:hover { background: #0369a1; }
    .btn-green { background: #10b981; }
    .btn-green:hover { background: #059669; }
    .btn-secondary { background: #334155; font-size: 0.78rem; padding: 8px 12px; }
    .btn-secondary:hover { background: #475569; }
    .instructions { font-size: 0.8rem; color: #94a3b8; line-height: 1.4; margin-top: 10px; }
    .saved-box { background: #132238; border: 1px solid #1e3a5f; padding: 10px; border-radius: 8px; margin: 10px 0; font-size: 0.82rem; color: #7dd3fc; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📱 Bethelmind 7-Line WhatsApp Command Center</h1>
    <p class="sub">Unified Multi-Line Gateway (Port 8080) · Desktop Signature · Permanent Session Lock</p>
    <div class="summary-bar" style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;">
      <div class="summary-item">Total Lines: <b>7</b></div>
      <div class="summary-item online">Online &amp; Active: <b>${onlineCount} / 7</b></div>
      <div class="summary-item">Architecture: <b>1 Admin Closer + 6 Outreach Desks</b></div>
      <button class="btn btn-green" style="font-size:0.85rem;padding:8px 16px;cursor:pointer;" onclick="lockAllSessions()">🔒 Permanently Lock All 7 Lines</button>
    </div>
    <div style="margin-top:14px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">
      <span style="color:#64748b;font-size:0.8rem;align-self:center;">⚡ Direct 1-Click Line Pairing:</span>
      ${Object.keys(instances).map(k => {
        const lineObj = instances[k];
        return `<a href="/pair/${lineObj.id}" class="btn btn-secondary" style="font-size:0.75rem;padding:6px 12px;text-decoration:none;">🔑 Pair Line ${lineObj.id} (${lineObj.displayPhone})</a>`;
      }).join('')}
    </div>
  </div>
  
  <div class="grid">
    ${Object.keys(instances).map(key => {
      const i = instances[key];
      const isOpen = i.state === 'open';
      const isConnecting = i.state === 'connecting';
      const hasSaved = Boolean(i.hasSavedLink && i.phone);
      return `
        <div class="card ${isOpen ? 'connected' : ''}">
          <div class="line-number">LINE ${i.id}</div>
          <div class="card-title">${i.displayPhone}</div>
          <div class="card-role">${i.role}</div>
          <div class="badge ${isOpen ? 'open' : (isConnecting ? 'connecting' : (hasSaved ? 'preserved' : 'close'))}">
            ${isOpen ? `STATUS: ONLINE (+${i.phone})` : (isConnecting ? 'CONNECTING...' : (hasSaved ? `SAVED LINK (+${i.phone})` : 'UNLINKED / READY'))}
          </div>

          ${isOpen ? `
            <div style="padding:20px 10px;">
              <div style="font-size:3rem;margin-bottom:10px;">✅</div>
              <p style="color:#10b981;font-weight:800;font-size:1.1rem;margin:0;">LINE CONNECTED &amp; LIVE</p>
              <p style="color:#94a3b8;font-size:0.82rem;margin-top:6px;">Connected Phone: +${i.phone}</p>
              <button class="btn btn-secondary" style="margin-top:14px;" onclick="reconnectInstance('${i.name}')">🔄 Ping Connection</button>
            </div>
          ` : `
            <div>
              ${hasSaved ? `
                <div class="saved-box">
                  🔒 <b>Session Keys Preserved</b> (+${i.phone})<br/>
                  Click below to activate and verify link.
                </div>
                <button class="btn btn-green" style="width:100%;margin-bottom:8px;" onclick="reconnectInstance('${i.name}')">⚡ Connect / Verify Link</button>
              ` : ''}

              <a href="/pair/${i.id}" class="btn btn-green" style="display:block;margin:10px 0;text-decoration:none;font-size:0.92rem;padding:12px 16px;text-align:center;font-weight:800;letter-spacing:0.5px;">
                🚀 Open Line ${i.id} Pairing Room (QR / Code)
              </a>

              <div id="pairbox_${i.key}" style="margin-top:12px;border-top:1px solid #1e293b;padding-top:12px;">
                ${i.pairingCode ? `
                  <div class="code-box">${i.pairingCode}</div>
                  <p class="instructions">
                    Open WhatsApp on phone &rarr; <b>Linked Devices</b> &rarr; <b>Link with phone number instead</b> &rarr; Enter code above.
                  </p>
                ` : `
                  <div style="margin: 8px 0;">
                    <input type="text" id="phone_${i.key}" class="input-phone" value="${i.fallbackPhone}" placeholder="e.g. 2348022791227" /><br/>
                    <button class="btn" style="width:100%;" onclick="requestCode('${i.key}', '${i.name}')">🔢 Request 8-Digit Pairing Code</button>
                  </div>
                `}

                ${i.qr ? `
                  <div class="qr-box">
                    <img src="${i.qr}" />
                  </div>
                  <p class="instructions">Scan QR code above with WhatsApp camera on your phone.</p>
                ` : `
                  <div style="margin-top: 8px;">
                    <button type="button" class="btn btn-secondary" style="width:100%;" onclick="generateQr('${i.name}')">📸 Generate Live QR Code</button>
                  </div>
                `}
              </div>
            </div>
          `}
        </div>
      `;
    }).join('')}
  </div>

  <div style="text-align: center; margin: 30px 0; color: #64748b; font-size: 0.85rem;">
    🔄 Dashboard auto-refreshes status every 8 seconds · <a href="/" style="color:#38bdf8;text-decoration:none;">Tap to Refresh Now</a>
  </div>

  <script>
    // Auto-refresh: check if new line comes online every 8 seconds
    let _refreshCount = 0;
    const _refreshTimer = setInterval(async () => {
      _refreshCount++;
      if (_refreshCount > 30) { clearInterval(_refreshTimer); return; } // stop after 4 min
      try {
        const res = await fetch('/status');
        const data = await res.json();
        if (data.onlineLines !== ${onlineCount}) {
          clearInterval(_refreshTimer);
          window.location.reload();
        }
      } catch (_) {}
    }, 8000);

    function togglePairBox(key) {
      const el = document.getElementById('pairbox_' + key);
      if (el) el.style.display = (el.style.display === 'none' ? 'block' : 'none');
    }

    async function generateQr(instanceName) {
      const btn = event.target;
      btn.innerText = 'Generating QR...';
      btn.disabled = true;
      try {
        await fetch('/instance/connect/' + instanceName, { headers: { 'Accept': 'application/json' } });
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        alert('Error: ' + err.message);
        btn.innerText = '📸 Generate QR Code';
        btn.disabled = false;
      }
    }

    async function reconnectInstance(instanceName) {
      const btn = event.target;
      btn.innerText = 'Connecting...';
      btn.disabled = true;
      try {
        const res = await fetch('/instance/reconnect/' + instanceName, { method: 'POST' });
        const data = await res.json();
        setTimeout(() => window.location.reload(), 1800);
      } catch (err) {
        alert('Error: ' + err.message);
        btn.innerText = '⚡ Connect / Verify Link';
        btn.disabled = false;
      }
    }

    async function requestCode(key, instanceName) {
      const input = document.getElementById('phone_' + key);
      const phone = input ? input.value.trim() : '';
      if (!phone) { alert('Please enter phone number'); return; }
      const btn = event.target;
      const originalText = btn.innerText;
      btn.innerText = '⏳ Connecting & Generating Code (4s)...';
      btn.disabled = true;
      try {
        const res = await fetch('/instance/pairingCode/' + instanceName, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: phone })
        });
        const data = await res.json();
        if (data.pairingCode) {
          const pairBox = document.getElementById('pairbox_' + key);
          if (pairBox) {
            pairBox.style.display = 'block';
            pairBox.innerHTML = 
              '<div style="margin: 16px 0; background: #022c22; border: 2px solid #10b981; border-radius: 12px; padding: 18px; text-align: center;">' +
                '<div style="color: #6ee7b7; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">8-DIGIT PAIRING CODE</div>' +
                '<div style="font-size: 2rem; font-family: monospace; letter-spacing: 6px; font-weight: 900; color: #ffffff; text-shadow: 0 0 12px #10b981;">' +
                  data.pairingCode +
                '</div>' +
              '</div>' +
              '<div style="background: #1e293b; border-radius: 8px; padding: 12px; font-size: 0.82rem; color: #cbd5e1; text-align: left; line-height: 1.5;">' +
                '<b>How to link on your phone (+' + phone + '):</b><br/>' +
                '1. Open WhatsApp &rarr; <b>Settings</b> (or 3 dots) &rarr; <b>Linked Devices</b><br/>' +
                '2. Tap <b>Link a Device</b><br/>' +
                '3. Tap <b>"Link with phone number instead"</b> at the bottom<br/>' +
                '4. Enter the code: <b style="color:#10b981;font-size:1.1rem;letter-spacing:2px;">' + data.pairingCode + '</b>' +
              '</div>' +
              '<div style="margin-top: 10px; color: #38bdf8; font-size: 0.78rem; text-align: center;">' +
                '🔄 This card will turn green <b>ONLINE</b> automatically when you enter the code!' +
              '</div>';
          } else {
            window.location.reload();
          }
        } else {
          alert('Error: ' + (data.message || 'Failed to get pairing code. Please try again.'));
          btn.innerText = originalText;
          btn.disabled = false;
        }
      } catch (err) {
        alert('Network error: ' + err.message);
        btn.innerText = originalText;
        btn.disabled = false;
      }
    }

    async function lockAllSessions() {
      const btn = event.target;
      const orig = btn.innerText;
      btn.innerText = 'Sealing 5 Vaults...';
      btn.disabled = true;
      try {
        const res = await fetch('/instance/lock-all', { method: 'POST' });
        const data = await res.json();
        alert('🛡️ SUCCESS: ' + data.totalLocked + ' active line(s) permanently locked and solidified across 5 backup vaults!');
        window.location.reload();
      } catch (err) {
        alert('Lock error: ' + err.message);
      } finally {
        btn.innerText = orig;
        btn.disabled = false;
      }
    }
  </script>
</body>
</html>`);
});

// ── Status Endpoint per Line for Rapid Live Polling ─────────────────────────
app.get('/pair-status/:lineNum', (req, res) => {
  const lineNum = parseInt(req.params.lineNum, 10);
  const inst = Object.values(instances).find(i => i.id === lineNum);
  if (!inst) return res.status(404).json({ error: 'Line not found' });
  res.json({
    success: true,
    id: inst.id,
    name: inst.name,
    label: inst.label,
    displayPhone: inst.displayPhone,
    phone: inst.phone,
    state: inst.state,
    online: inst.state === 'open',
    hasSavedLink: inst.hasSavedLink,
    qr: inst.qr || '',
    pairingCode: inst.pairingCode || ''
  });
});

// ── Dedicated Dual-Mode Pairing Page per Line ────────────────────────────────
app.get('/pair/:lineNum', (req, res) => {
  const lineNum = parseInt(req.params.lineNum, 10);
  const inst = Object.values(instances).find(i => i.id === lineNum);
  if (!inst) return res.redirect('/');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link WhatsApp Line ${lineNum}: ${inst.displayPhone}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=JetBrains+Mono:wght@700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #020617; color: #f8fafc; font-family: 'Inter', system-ui, sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 16px; }
    .nav-bar { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-width: 680px; margin-bottom: 20px; }
    .nav-btn { background: #0f172a; border: 1px solid #1e293b; color: #94a3b8; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 9999px; text-decoration: none; transition: all 0.2s; }
    .nav-btn:hover { background: #1e293b; color: #f8fafc; }
    .nav-btn.active { background: #0284c7; color: #ffffff; border-color: #38bdf8; box-shadow: 0 0 12px rgba(56,189,248,0.4); }
    .nav-btn.online { border-color: #10b981; color: #34d399; }
    .card { background: #0f172a; border: 1.5px solid #1e3a5f; border-radius: 24px; padding: 32px 28px; max-width: 520px; width: 100%; text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.7); position: relative; }
    .line-badge { background: #1e293b; color: #38bdf8; font-size: 0.75rem; font-weight: 800; padding: 5px 14px; border-radius: 20px; display: inline-block; margin-bottom: 12px; letter-spacing: 1.2px; text-transform: uppercase; }
    h1 { font-size: 1.45rem; font-weight: 900; color: #f8fafc; margin-bottom: 4px; letter-spacing: -0.3px; }
    .phone-label { color: #38bdf8; font-size: 1.15rem; font-weight: 800; margin-bottom: 6px; }
    .role-label { color: #64748b; font-size: 0.8rem; margin-bottom: 22px; }
    
    .tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #090d16; border: 1px solid #1e293b; border-radius: 14px; padding: 4px; margin-bottom: 22px; }
    .tab-btn { background: transparent; border: none; color: #94a3b8; font-size: 0.85rem; font-weight: 700; padding: 10px 14px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .tab-btn.active { background: #1e293b; color: #f8fafc; box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
    
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    
    .qr-box { background: #ffffff; padding: 14px; border-radius: 16px; margin: 16px auto; display: inline-block; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .qr-box img { display: block; width: 220px; height: 220px; }
    
    .code-card { background: #022c22; border: 2px solid #10b981; border-radius: 16px; padding: 22px 18px; margin: 18px 0; }
    .code-label { color: #6ee7b7; font-size: 0.75rem; font-weight: 800; letter-spacing: 2px; margin-bottom: 8px; }
    .code-value { font-family: 'JetBrains Mono', monospace; font-size: 2.6rem; font-weight: 900; color: #ffffff; letter-spacing: 8px; text-shadow: 0 0 20px rgba(16,185,129,0.7); }
    .btn-copy { background: #065f46; color: #a7f3d0; border: none; padding: 6px 14px; border-radius: 8px; font-size: 0.78rem; font-weight: 700; cursor: pointer; margin-top: 10px; }
    .btn-copy:hover { background: #047857; }
    
    .steps { background: #1e293b; border-radius: 14px; padding: 16px 18px; text-align: left; margin: 18px 0; font-size: 0.84rem; color: #cbd5e1; line-height: 1.8; }
    .steps b { color: #38bdf8; }
    
    .status-pill { background: #132238; border: 1px solid #1e3a5f; color: #7dd3fc; padding: 10px 16px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; margin: 14px 0; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .status-pill.online { background: #022c22; border-color: #10b981; color: #34d399; font-weight: 800; }
    
    .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid #334155; border-top-color: #38bdf8; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .btn { background: #0284c7; color: white; border: none; padding: 11px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.88rem; width: 100%; transition: background 0.2s; }
    .btn:hover { background: #0369a1; }
    .btn-green { background: #10b981; }
    .btn-green:hover { background: #059669; }
    
    .back-link { color: #64748b; font-size: 0.82rem; margin-top: 22px; display: inline-block; text-decoration: none; font-weight: 600; }
    .back-link:hover { color: #94a3b8; }
  </style>
</head>
<body>
  <div class="nav-bar">
    ${Object.values(instances).map(o => `
      <a href="/pair/${o.id}" class="nav-btn ${o.id === lineNum ? 'active' : ''} ${o.state === 'open' ? 'online' : ''}">
        ${o.state === 'open' ? '🟢' : '⚪'} Line ${o.id} (${o.displayPhone})
      </a>
    `).join('')}
  </div>

  <div class="card">
    <div class="line-badge">LINE ${lineNum} · WHATSAPP LINKING ROOM</div>
    <h1>Link WhatsApp Account</h1>
    <div class="phone-label">+${inst.displayPhone}</div>
    <div class="role-label">${inst.role}</div>

    <div class="tabs">
      <button id="tabBtnQr" class="tab-btn active" onclick="switchTab('qr')">📸 Instant QR Scan</button>
      <button id="tabBtnCode" class="tab-btn" onclick="switchTab('code')">🔢 8-Digit Phone Code</button>
    </div>

    <!-- TAB 1: INSTANT QR CODE SCAN -->
    <div id="tabQr" class="tab-content active">
      <div id="qrArea">
        <div style="padding:30px 20px; color:#94a3b8; font-size:0.9rem;">
          <span class="spinner"></span> Generating live QR code for Line ${lineNum}...
        </div>
      </div>
      <div class="steps">
        <b>How to scan on phone (+${inst.displayPhone}):</b><br/>
        1. Open <b>WhatsApp</b> on your phone<br/>
        2. Tap <b>Menu (⋮)</b> or <b>Settings</b> &rarr; <b>Linked Devices</b><br/>
        3. Tap <b>Link a Device</b><br/>
        4. Point camera at the QR code above
      </div>
      <button class="btn" onclick="requestQr()">🔄 Refresh QR Code</button>
    </div>

    <!-- TAB 2: 8-DIGIT PAIRING CODE -->
    <div id="tabCode" class="tab-content">
      <div id="codeArea">
        <div style="padding:20px 0;">
          <button class="btn btn-green" onclick="requestCode()">🔢 Generate 8-Digit Pairing Code</button>
        </div>
      </div>
      <div class="steps">
        <b>How to link with code on phone:</b><br/>
        1. Open <b>WhatsApp</b> &rarr; <b>Linked Devices</b><br/>
        2. Tap <b>Link a Device</b><br/>
        3. Tap <b>"Link with phone number instead"</b> at bottom<br/>
        4. Enter the 8-digit code shown above
      </div>
    </div>

    <div id="liveStatusBox" class="status-pill">
      <span class="spinner"></span> Waiting for phone to link...
    </div>

    <a href="/" class="back-link">← Return to WhatsApp Command Center</a>
  </div>

  <script>
    const LINE_NUM = ${lineNum};
    const INSTANCE_NAME = '${inst.name}';
    const PHONE = '${inst.fallbackPhone}';

    function switchTab(tab) {
      document.getElementById('tabBtnQr').classList.toggle('active', tab === 'qr');
      document.getElementById('tabBtnCode').classList.toggle('active', tab === 'code');
      document.getElementById('tabQr').classList.toggle('active', tab === 'qr');
      document.getElementById('tabCode').classList.toggle('active', tab === 'code');
      if (tab === 'qr') requestQr();
    }

    async function requestQr() {
      const qrArea = document.getElementById('qrArea');
      qrArea.innerHTML = '<div style="padding:24px; color:#94a3b8; font-size:0.9rem;"><span class="spinner"></span> Generating live QR code...</div>';
      try {
        const res = await fetch('/instance/request-qr/' + INSTANCE_NAME, { method: 'POST' });
        const data = await res.json();
        if (data.qr) {
          renderQr(data.qr);
        } else {
          // Poll for QR to appear within 5s
          let tries = 0;
          const t = setInterval(async () => {
            tries++;
            const sRes = await fetch('/pair-status/' + LINE_NUM);
            const sData = await sRes.json();
            if (sData.qr) {
              clearInterval(t);
              renderQr(sData.qr);
            } else if (tries > 8) {
              clearInterval(t);
              qrArea.innerHTML = '<div style="color:#f87171;padding:16px;">QR generation timeout. Please click Refresh QR Code below.</div>';
            }
          }, 800);
        }
      } catch (err) {
        qrArea.innerHTML = '<div style="color:#f87171;padding:16px;">Network error: ' + err.message + '</div>';
      }
    }

    function renderQr(qrDataUrl) {
      document.getElementById('qrArea').innerHTML =
        '<div class="qr-box"><img src="' + qrDataUrl + '" alt="Scan with WhatsApp" /></div>' +
        '<div style="color:#38bdf8;font-size:0.8rem;font-weight:700;">Point WhatsApp camera to pair instantly</div>';
    }

    async function requestCode() {
      const codeArea = document.getElementById('codeArea');
      codeArea.innerHTML = '<div style="padding:24px; color:#94a3b8;"><span class="spinner"></span> Requesting 8-digit pairing code (3-4 seconds)...</div>';
      try {
        const res = await fetch('/instance/pairingCode/' + INSTANCE_NAME, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: PHONE })
        });
        const data = await res.json();
        if (data.pairingCode) {
          codeArea.innerHTML =
            '<div class="code-card">' +
              '<div class="code-label">YOUR 8-DIGIT PAIRING CODE</div>' +
              '<div class="code-value" id="dispCode">' + data.pairingCode + '</div>' +
              '<button class="btn-copy" onclick="copyCode(\\'' + data.pairingCode + '\\')">📋 Copy 8-Digit Code</button>' +
            '</div>';
        } else {
          codeArea.innerHTML = '<div style="color:#f87171;padding:16px;">' + (data.message || 'Error generating code. Please retry.') + '</div><button class="btn btn-green" onclick="requestCode()">🔄 Retry Code</button>';
        }
      } catch (err) {
        codeArea.innerHTML = '<div style="color:#f87171;padding:16px;">Error: ' + err.message + '</div><button class="btn btn-green" onclick="requestCode()">🔄 Retry Code</button>';
      }
    }

    function copyCode(c) {
      navigator.clipboard.writeText(c);
      event.target.innerText = '✅ Copied!';
      setTimeout(() => event.target.innerText = '📋 Copy 8-Digit Code', 2000);
    }

    // Real-Time Connection Watchdog
    const pollTimer = setInterval(async () => {
      try {
        const res = await fetch('/pair-status/' + LINE_NUM);
        const d = await res.json();
        const box = document.getElementById('liveStatusBox');
        if (d.online) {
          clearInterval(pollTimer);
          box.className = 'status-pill online';
          box.innerHTML = '🎉 SUCCESS: Line ' + LINE_NUM + ' is now ONLINE (+ ' + d.phone + ') and Solidified!';
          setTimeout(() => { window.location.href = '/'; }, 2200);
        } else if (d.qr && document.getElementById('tabQr').classList.contains('active')) {
          const currentImg = document.querySelector('#qrArea img');
          if (!currentImg || currentImg.src !== d.qr) {
            renderQr(d.qr);
          }
        }
      } catch (_) {}
    }, 1500);

    // Initial load: generate QR code
    requestQr();
  </script>
</body>
</html>`);
});

// ── Reconnect Endpoint (keeps existing keys) ───────────────────────────────
app.post('/instance/reconnect/:instanceName', async (req, res) => {
  const name = req.params.instanceName;
  const inst = Object.values(instances).find(i => i.name === name) || instances.instance_1;
  inst.reconnectAttempts = 0;
  await startInstanceSocket(inst.key, true);
  res.json({ success: true, message: `Reconnecting ${inst.label}...` });
});

// ── Lock All Sessions Across 5 Redundant Vaults ───────────────────────────
app.all(['/instance/lock-all', '/lock-all', '/lock-sessions'], (req, res) => {
  const result = permanentLockAllSessions();
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.redirect('/?locked=' + result.totalLocked);
  }
  res.json({ 
    success: true, 
    message: `Permanently locked & sealed ${result.totalLocked} WhatsApp sessions across 5 redundant vaults.`, 
    ...result 
  });
});

// ── Standard Endpoints ─────────────────────────────────────────────────────
app.get('/status', (req, res) => {
  const activeInst = Object.values(instances).find(i => i.state === 'open');
  res.json({
    status: activeInst ? 'connected' : 'disconnected',
    phone: activeInst ? `+${activeInst.phone}` : '',
    totalLines: Object.keys(instances).length,
    onlineLines: Object.values(instances).filter(i => i.state === 'open').length,
    instances: Object.values(instances).map(i => ({ 
      id: i.id,
      key: i.key,
      name: i.name, 
      label: i.label, 
      state: i.state, 
      phone: i.phone,
      hasSavedLink: i.hasSavedLink
    })),
    activeInstance: activeInst ? activeInst.name : null,
    qrCodeUrl: Object.values(instances).find(i => i.qr)?.qr || '',
    lastPairingCode: Object.values(instances).find(i => i.pairingCode)?.pairingCode || ''
  });
});
app.get('/api/status', (req, res) => res.redirect('/status'));

app.post('/check-whatsapp', async (req, res) => {
  const phone = req.body.phone || req.query.phone || '';
  if (!phone) return res.status(400).json({ error: 'Missing phone in payload' });

  const cleanDigits = phone.replace(/\D/g, '');
  const activeInst = Object.values(instances).find(i => i.state === 'open' && i.socket);

  if (!activeInst) {
    const isValidNg = (cleanDigits.startsWith('234') && cleanDigits.length === 13) || (cleanDigits.startsWith('0') && cleanDigits.length === 11);
    return res.json({
      phone,
      exists: isValidNg,
      verified_via: 'syntax_fallback',
      message: 'Evolution API gateway has no active online instance; verified via syntax.'
    });
  }

  try {
    const jid = `${cleanDigits.startsWith('0') ? '234' + cleanDigits.slice(1) : cleanDigits}@s.whatsapp.net`;
    const results = await activeInst.socket.onWhatsApp(jid);
    const exists = results && results.length > 0 && results[0].exists;
    return res.json({
      phone,
      exists: Boolean(exists),
      jid,
      verified_via: `evolution_baileys_${activeInst.name}`
    });
  } catch (err) {
    return res.json({ phone, exists: true, fallback: true, message: err.message });
  }
});

app.post('/send', async (req, res) => {
  const phone = req.body.phone || req.body.number;
  const message = req.body.message || req.body.text;
  const targetLine = req.body.lineId || req.body.line;

  if (!phone || !message) return res.status(400).json({ error: 'Missing phone or message in body' });

  let inst = null;
  if (targetLine && instances[`instance_${targetLine}`]) {
    inst = instances[`instance_${targetLine}`];
  }
  if (!inst || inst.state !== 'open' || !inst.socket) {
    inst = Object.values(instances).find(i => i.state === 'open' && i.socket);
  }

  if (!inst) return res.status(503).json({ error: 'No active WhatsApp instance online' });

  try {
    const cleanDigits = phone.replace(/\D/g, '');
    const jid = `${cleanDigits.startsWith('0') ? '234' + cleanDigits.slice(1) : cleanDigits}@s.whatsapp.net`;
    await inst.socket.presenceSubscribe(jid);
    await inst.socket.sendPresenceUpdate('composing', jid);
    await new Promise(r => setTimeout(r, 600));

    const sent = await inst.socket.sendMessage(jid, { text: message });
    res.json({ success: true, messageId: sent?.key?.id, line: inst.id, phone: inst.phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/instance/create', (req, res) => {
  const { instanceName } = req.body;
  const inst = Object.values(instances).find(i => i.name === instanceName) || instances.instance_1;
  res.json({ success: true, instance: { instanceName: inst.name, state: inst.state } });
});

app.get('/instance/connect/:instanceName', async (req, res) => {
  const name = req.params.instanceName;
  const inst = Object.values(instances).find(i => i.name === name) || instances.instance_1;
  
  if (!inst.socket || inst.state === 'close') {
    await startInstanceSocket(inst.key, true);
  }

  // If user opened this in a web browser directly, redirect cleanly to the dashboard!
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.redirect('/?connecting=' + encodeURIComponent(inst.name));
  }

  res.json({
    code: inst.pairingCode || '',
    base64: inst.qr ? inst.qr.replace(/^data:image\/png;base64,/, '') : '',
    count: 1
  });
});

async function startPairingSocket(key, rawPhone) {
  const inst = instances[key];
  if (!inst) throw new Error('Invalid instance key: ' + key);

  let phone = (rawPhone || '').replace(/\D/g, '');
  if (phone.startsWith('0') && phone.length === 11) {
    phone = '234' + phone.substring(1);
  }

  const localDb = path.join(__dirname, '../local_db');
  const targetDir = path.join(localDb, inst.canonicalDir);

  // If unverified session exists, clean directory to guarantee fresh cryptographic keys
  if (!hasSavedSession(targetDir)) {
    try {
      if (fs.existsSync(targetDir)) {
        for (const f of fs.readdirSync(targetDir)) {
          try { fs.unlinkSync(path.join(targetDir, f)); } catch (_) {}
        }
      } else {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    } catch (_) {}
  }

  // Start the authoritative instance socket
  await startInstanceSocket(key, true);

  // Actively wait for WebSocket transport to be open (up to 8 seconds)
  console.log(`[Evolution API] Waiting for WebSocket transport to open for ${inst.label}...`);
  let waitCount = 0;
  while ((!inst.socket || !inst.socket.ws || !inst.socket.ws.isOpen) && waitCount < 32) {
    await new Promise(r => setTimeout(r, 250));
    waitCount++;
  }

  if (!inst.socket || typeof inst.socket.requestPairingCode !== 'function') {
    throw new Error('Socket could not initialize pairing interface. Please retry.');
  }

  console.log(`[Evolution API] Requesting 8-digit pairing code from WhatsApp for ${inst.label} (+${phone})...`);
  const code = await inst.socket.requestPairingCode(phone);
  inst.pairingCode = code;

  console.log(`\n======================================================`);
  console.log(`🔑 [Evolution API] 8-DIGIT PAIRING CODE FOR ${inst.label} (+${phone}):`);
  console.log(`        👉 [  ${code}  ]  👈`);
  console.log(`======================================================\n`);

  return code;
}

// ── Instant Live QR Code Generator Function ──────────────────────────────────
async function startQrSocket(key) {
  const inst = instances[key];
  if (!inst) throw new Error('Invalid instance key: ' + key);

  const localDb = path.join(__dirname, '../local_db');
  const targetDir = path.join(localDb, inst.canonicalDir);

  if (!hasSavedSession(targetDir)) {
    try {
      if (fs.existsSync(targetDir)) {
        for (const f of fs.readdirSync(targetDir)) {
          try { fs.unlinkSync(path.join(targetDir, f)); } catch (_) {}
        }
      } else {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    } catch (_) {}
  }

  // Start the authoritative instance socket
  await startInstanceSocket(key, true);

  return new Promise((resolve) => {
    if (inst.qr) return resolve(inst.qr);

    let tries = 0;
    const interval = setInterval(() => {
      tries++;
      if (inst.qr) {
        clearInterval(interval);
        return resolve(inst.qr);
      }
      if (tries > 28) { // 7 seconds timeout
        clearInterval(interval);
        return resolve(inst.qr || null);
      }
    }, 250);
  });
}

// ── QR Code Generation Endpoint ─────────────────────────────────────────────
app.all(['/instance/request-qr/:instanceName', '/request-qr/:instanceName'], async (req, res) => {
  const name = req.params.instanceName;
  const inst = Object.values(instances).find(i => i.name === name || String(i.id) === name || i.key === name) || instances.instance_1;
  try {
    console.log(`[Evolution API] Generating fresh live QR Code for ${inst.label}...`);
    const qr = await startQrSocket(inst.key);
    res.json({ success: true, qr: qr || inst.qr || '', state: inst.state, line: inst.id });
  } catch (err) {
    console.error(`[Evolution API] QR code error for ${inst.label}:`, err.message);
    res.status(500).json({ error: true, message: err.message });
  }
});

app.post('/instance/pairingCode/:instanceName', async (req, res) => {
  const name = req.params.instanceName;
  const inst = Object.values(instances).find(i => i.name === name || String(i.id) === name || i.key === name) || instances.instance_1;
  let phone = (req.body.phoneNumber || req.query.phone || req.body.phone || inst.fallbackPhone || '').replace(/\D/g, '');

  if (phone.startsWith('0') && phone.length === 11) {
    phone = '234' + phone.substring(1);
  }

  if (!phone) {
    return res.status(400).json({ error: true, message: 'Missing phoneNumber in body or query' });
  }

  try {
    console.log(`[Evolution API] Generating fresh pairing code for ${inst.label} (+${phone})...`);
    const code = await startPairingSocket(inst.key, phone);
    res.json({ success: true, pairingCode: code, phone });
  } catch (err) {
    console.error(`[Evolution API] Pairing code error for ${inst.label}:`, err.message);
    res.status(500).json({ error: true, message: err.message });
  }
});

app.post('/request-pairing-code', async (req, res) => {
  const phone = req.body.phone || req.query.phone;
  const line = req.body.line || req.query.line || 1;
  req.body.phoneNumber = phone;
  req.params.instanceName = `bethelmind_instance_${line}`;
  return app._router.handle(req, res);
});

app.get('/instance/connectionState/:instanceName', (req, res) => {
  const name = req.params.instanceName;
  const inst = Object.values(instances).find(i => i.name === name) || instances.instance_1;
  res.json({ instance: { instanceName: name, state: inst.state, owner: inst.phone } });
});

app.post('/message/sendText/:instanceName', async (req, res) => {
  const name = req.params.instanceName;
  const inst = Object.values(instances).find(i => i.name === name) || instances.instance_1;
  const { number, text } = req.body;
  if (!number || !text) return res.status(400).json({ error: true, message: 'Missing number or text' });

  if (inst.state !== 'open' || !inst.socket) {
    return res.status(503).json({ error: true, message: `Instance '${name}' is not connected (state: ${inst.state})` });
  }

  try {
    const cleanPhone = number.replace(/[^0-9]/g, '');
    const jid = `${cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone}@s.whatsapp.net`;
    await inst.socket.presenceSubscribe(jid);
    await inst.socket.sendPresenceUpdate('composing', jid);
    await new Promise(r => setTimeout(r, 600));

    const sent = await inst.socket.sendMessage(jid, { text });
    res.json({ success: true, key: sent.key, messageId: sent.key?.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/message/sendWhatsAppAudio/:instanceName', async (req, res) => {
  const name = req.params.instanceName;
  const inst = Object.values(instances).find(i => i.name === name) || instances.instance_1;
  const { number, audio } = req.body;
  if (!number || !audio) return res.status(400).json({ error: true, message: 'Missing number or audio payload' });

  if (inst.state !== 'open' || !inst.socket) {
    return res.status(503).json({ error: true, message: `Instance '${name}' is not connected (state: ${inst.state})` });
  }

  try {
    const cleanPhone = number.replace(/[^0-9]/g, '');
    const jid = `${cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone}@s.whatsapp.net`;

    await inst.socket.presenceSubscribe(jid);
    await inst.socket.sendPresenceUpdate('recording', jid);
    await new Promise(r => setTimeout(r, 800));

    let audioBuffer;
    if (audio.startsWith('http')) {
      const resp = await fetch(audio);
      audioBuffer = Buffer.from(await resp.arrayBuffer());
    } else {
      const cleanBase64 = audio.replace(/^data:audio\/\w+;base64,/, '');
      audioBuffer = Buffer.from(cleanBase64, 'base64');
    }

    const sent = await inst.socket.sendMessage(jid, {
      audio: audioBuffer,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true
    });

    res.json({ success: true, key: sent.key, messageId: sent.key?.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n================================================================`);
  console.log(`🚀 BETHELMIND 7-LINE UNIFIED EVOLUTION API & BAILEYS SERVER ACTIVE`);
  console.log(`   URL        : http://localhost:${PORT}`);
  console.log(`   Dashboard  : http://localhost:${PORT}/`);
  console.log(`   API Key    : ${API_KEY}`);
  console.log(`   Lines      : 7 Concurrent Lines (Admin Closer + 6 Outreach Desks)`);
  console.log(`   Preserved  : All saved session keys permanently locked`);
  console.log(`================================================================\n`);

  // Check and keep all existing genuinely registered saved sessions active with stagger
  let staggerIdx = 0;
  Object.keys(instances).forEach(key => {
    const inst = instances[key];
    const authDir = resolveAuthDir(inst);
    const saved = hasSavedSession(authDir);
    if (saved) {
      inst.phone = saved.phone;
      inst.hasSavedLink = true;
      const delay = staggerIdx * 4000;
      staggerIdx++;
      console.log(`[Evolution API] 💾 ${inst.label}: Saved link preserved for +${saved.phone}. Staggered auto-connect in ${delay / 1000}s...`);
      setTimeout(() => {
        startInstanceSocket(key, false);
      }, delay);
    } else {
      inst.state = 'close';
      inst.hasSavedLink = false;
      console.log(`[Evolution API] 📱 ${inst.label}: Ready for pairing code / QR link.`);
    }
  });
});
