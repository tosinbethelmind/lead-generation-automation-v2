/**
 * @file scripts/whatsapp_multiline_daemon.js
 * 
 * 🚀 BETHELMIND CENTRAL OMNICHANNEL INBOX & MULTI-LINE GATEWAY DAEMON
 * 
 * Centralized 24/7 Engine Unifying:
 *   1. WhatsApp Lines 1 to 7 (Baileys Multi-Socket)
 *   2. Web Contact Forms (POST /web-inquiry)
 *   3. Inbound SMS (POST /sms-inquiry)
 *   4. Inbound Email (POST /email-inquiry)
 *   5. Instant Admin Bridge: Auto-forwards every client response to Admin WhatsApp (0802 279 1227)
 *   6. Central Omnichannel Response Hub UI (http://localhost:3008 & /inbox)
 *   7. Chatwoot & CRM Local Sync (local_db/central_omnichannel_inbox.json & chatwoot_sync.json)
 */

const express = require('express');
const cors = require('cors');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

process.on('uncaughtException', (err) => {
  console.error('[Daemon UncaughtException]', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.warn('[Daemon UnhandledRejection]', reason?.message || reason);
});

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

const PORT = process.env.WA_DAEMON_PORT || 3008;
const LOCAL_DB = path.join(process.cwd(), 'local_db');
const REGISTRY_PATH = path.join(LOCAL_DB, 'whatsapp_lines_registry.json');
const CENTRAL_INBOX_PATH = path.join(LOCAL_DB, 'central_omnichannel_inbox.json');
const CHATBOT_CONVS_PATH = path.join(LOCAL_DB, 'chatbot_conversations.json');
const CHATWOOT_SYNC_PATH = path.join(LOCAL_DB, 'chatwoot_sync.json');
const ADMIN_JID = '2348022791227@s.whatsapp.net';

if (!fs.existsSync(LOCAL_DB)) fs.mkdirSync(LOCAL_DB, { recursive: true });

// Configuration for all 7 lines
const LINES_CONFIG = {
  1: { id: 1, role: 'Admin & Inbound Closer Desk', defaultPhone: '2348022791227', displayPhone: '0802 279 1227', dir: 'baileys_auth_line1' },
  2: { id: 2, role: 'Outreach Line 1', defaultPhone: '2347026266946', displayPhone: '0702 626 6946', dir: 'baileys_auth_line2' },
  3: { id: 3, role: 'Outreach Line 2', defaultPhone: '2349046050469', displayPhone: '0904 605 0469', dir: 'baileys_auth_line3' },
  4: { id: 4, role: 'Outreach Line 3', defaultPhone: '2349135129625', displayPhone: '0913 512 9625', dir: 'baileys_auth_line4' },
  5: { id: 5, role: 'Outreach Line 4', defaultPhone: '2347030556877', displayPhone: '0703 055 6877', dir: 'baileys_auth_line5' },
  6: { id: 6, role: 'Outreach Line 5', defaultPhone: '2348119346518', displayPhone: '0811 934 6518', dir: 'baileys_auth_line6' },
  7: { id: 7, role: 'Outreach Line 6', defaultPhone: '2348141609564', displayPhone: '0814 160 9564', dir: 'baileys_auth_line7' }
};

// In-memory runtime state for all lines
const linesState = {};
for (let i = 1; i <= 7; i++) {
  const cfg = LINES_CONFIG[i];
  linesState[i] = {
    id: i,
    role: cfg.role,
    phone: cfg.defaultPhone,
    displayPhone: cfg.displayPhone,
    dir: cfg.dir,
    authPath: path.join(LOCAL_DB, cfg.dir),
    socket: null,
    status: 'disconnected', // disconnected, connecting, open, logged_out, needs_pairing
    qrDataUrl: '',
    pairingCode: '',
    lastError: null,
    connectedAt: null,
    reconnectAttempts: 0
  };
}

function cleanPhone(raw) {
  if (!raw) return null;
  let digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) digits = '234' + digits.substring(1);
  else if (digits.length === 10) digits = '234' + digits;
  if (!digits.startsWith('234') || digits.length < 13 || digits.length > 14) return null;
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

function updateRegistryLine(lineId, updates) {
  const reg = loadRegistry();
  const key = `line_${lineId}`;
  reg[key] = {
    ...(reg[key] || {}),
    line: lineId,
    ...updates,
    lastChecked: new Date().toISOString()
  };
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2), 'utf8');
}

// ── CENTRAL OMNICHANNEL INBOX STORAGE & SYNC ────────────────────────────────

function getCentralInbox() {
  if (fs.existsSync(CENTRAL_INBOX_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CENTRAL_INBOX_PATH, 'utf8'));
    } catch (_) {}
  }
  return [];
}

function saveToCentralInbox({ channel, lineId, senderPhone, senderEmail, senderName, sector, message, fromMe = false, previewUrl = '' }) {
  try {
    const inbox = getCentralInbox();
    const phoneClean = senderPhone ? senderPhone.replace(/\D/g, '') : '';
    const threadId = channel === 'whatsapp' ? `wa_${phoneClean}` : (channel === 'email' ? `em_${senderEmail}` : `conv_${phoneClean || senderEmail || Date.now()}`);

    let thread = inbox.find(t => t.id === threadId);
    if (!thread) {
      thread = {
        id: threadId,
        channel: channel || 'whatsapp',
        lineId: lineId || (channel === 'whatsapp' ? 6 : null),
        senderName: senderName || 'Commercial Prospect',
        senderPhone: phoneClean,
        senderEmail: senderEmail || '',
        sector: sector || 'B2B Enterprise',
        previewUrl: previewUrl || '',
        messages: [],
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inbox.unshift(thread);
    } else {
      if (lineId) thread.lineId = lineId;
      if (senderName && thread.senderName === 'Commercial Prospect') thread.senderName = senderName;
      if (sector && thread.sector === 'B2B Enterprise') thread.sector = sector;
      if (previewUrl && !thread.previewUrl) thread.previewUrl = previewUrl;
    }

    thread.messages.push({
      sender: fromMe ? 'agent' : 'client',
      text: message,
      timestamp: new Date().toISOString()
    });

    if (!fromMe) {
      thread.unreadCount = (thread.unreadCount || 0) + 1;
    }

    thread.updatedAt = new Date().toISOString();

    // Reorder inbox so latest updated thread is at the top
    const sorted = [thread, ...inbox.filter(t => t.id !== threadId)];
    fs.writeFileSync(CENTRAL_INBOX_PATH, JSON.stringify(sorted, null, 2), 'utf8');

    // Sync to Chatbot Conversations
    try {
      let convs = {};
      if (fs.existsSync(CHATBOT_CONVS_PATH)) {
        try { convs = JSON.parse(fs.readFileSync(CHATBOT_CONVS_PATH, 'utf8')); } catch (_) {}
      }
      convs[threadId] = thread;
      fs.writeFileSync(CHATBOT_CONVS_PATH, JSON.stringify(convs, null, 2), 'utf8');
    } catch (_) {}

    // Sync to Chatwoot local ledger
    try {
      let cw = [];
      if (fs.existsSync(CHATWOOT_SYNC_PATH)) {
        try { cw = JSON.parse(fs.readFileSync(CHATWOOT_SYNC_PATH, 'utf8')); } catch (_) {}
      }
      cw.push({
        type: fromMe ? 'outbound_reply' : 'inbound_message',
        channel,
        senderName: thread.senderName,
        senderPhone: thread.senderPhone,
        senderEmail: thread.senderEmail,
        message,
        timestamp: new Date().toISOString()
      });
      fs.writeFileSync(CHATWOOT_SYNC_PATH, JSON.stringify(cw.slice(-500), null, 2), 'utf8');
    } catch (_) {}

    return thread;
  } catch (err) {
    console.warn('[Central Inbox] Save error:', err.message);
    return null;
  }
}

// ── SEND ALERT TO ADMIN WHATSAPP ────────────────────────────────────────────
async function forwardAlertToAdmin({ channel, lineId, senderName, senderPhone, sector, message }) {
  const alertText = `🔔 *NEW INBOUND INQUIRY [${(channel || 'WHATSAPP').toUpperCase()}${lineId ? ` - LINE ${lineId}` : ''}]*

🏢 *Business:* ${senderName || 'Commercial Enterprise'}
📁 *Sector:* ${sector || 'B2B Client'}
📞 *Phone:* +${senderPhone}
💬 *Message Received:*
"${message}"

👉 *1-Tap Direct Reply to Client:*
wa.me/${senderPhone}

💻 *Central Inbox Live:*
http://localhost:3008/inbox`;

  // Find an active socket to dispatch the alert
  let alertSocket = linesState[lineId]?.socket;
  if (!alertSocket || linesState[lineId]?.status !== 'open') {
    for (let i = 1; i <= 7; i++) {
      if (linesState[i]?.status === 'open' && linesState[i]?.socket) {
        alertSocket = linesState[i].socket;
        break;
      }
    }
  }

  if (alertSocket) {
    try {
      await alertSocket.sendMessage(ADMIN_JID, { text: alertText });
      console.log(`   🚀 [Instant Bridge] Alert forwarded to Admin WhatsApp (+234 802 279 1227)!`);
    } catch (err) {
      console.warn(`   ⚠️ Could not bridge alert to Admin:`, err.message);
    }
  }
}

// ── AUTO-OUTREACH BURST ENGINE (FIRES IMMEDIATELY UPON LINE LINKING) ─────────
const activeBurstRunning = {};

async function triggerAutoOutreachBurst(lineId, targetCount = 25) {
  if (lineId <= 1) return; // Strictly Lines 2-7 (Line 1 is Admin Desk only)
  if (activeBurstRunning[lineId]) {
    console.log(`[Daemon] ⚡ Outreach burst already in progress for Line ${lineId}`);
    return;
  }
  const line = linesState[lineId];
  if (!line || line.status !== 'open' || !line.socket) {
    console.warn(`[Daemon] Cannot launch burst for Line ${lineId}: line not open.`);
    return;
  }

  activeBurstRunning[lineId] = true;
  console.log(`\n🚀 [Auto-Outreach Burst] Line ${lineId} linked! Immediately dispatching ${targetCount} B2B proposals...`);

  try {
    const leadsDbFile = path.join(LOCAL_DB, 'leads_db.json');
    if (!fs.existsSync(leadsDbFile)) return;
    const leads = JSON.parse(fs.readFileSync(leadsDbFile, 'utf8'));

    const candidates = leads.filter(l => !l.whatsapp_dispatched && !l.wa_sent && l.phone && cleanPhone(l.phone));
    const batch = candidates.slice(0, targetCount);

    console.log(`[Auto-Outreach Burst] Found ${batch.length} unsent leads for Line ${lineId}`);

    let sentCount = 0;
    for (const lead of batch) {
      if (linesState[lineId]?.status !== 'open') {
        console.warn(`[Auto-Outreach Burst] Line ${lineId} no longer open. Pausing burst.`);
        break;
      }

      const targetDigits = cleanPhone(lead.phone);
      if (!targetDigits) continue;

      const rawName = (lead.name || lead.business_name || 'Commercial Enterprise').split('||')[0].split('|')[0].replace(/\(.*?\)/g, '').trim();
      const cleanName = rawName.length > 25 ? rawName.slice(0, 22).trim() : rawName;
      const area = lead.area || lead.city || 'Lagos';
      const cat = ((lead.category || lead.sector || '') + ' ' + rawName).toLowerCase();
      const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 18);
      const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;

      let hookLine = 'We built a 24/7 WhatsApp customer quoting & automated enquiry quoter for your business.';
      if (/beauty|salon|spa|fashion|apparel|hair/i.test(cat)) {
        hookLine = 'We built a 24/7 WhatsApp VIP order quoter & instant booking assistant for your salon.';
      } else if (/solar|inverter|energy|battery/i.test(cat)) {
        hookLine = 'We built an automated 24/7 WhatsApp BOQ load sizer & diesel-savings calculator for your firm.';
      } else if (/clinic|dental|health|hospital|medical/i.test(cat)) {
        hookLine = 'We built a 24/7 WhatsApp patient booking & consultation intake tool for your clinic.';
      } else if (/hotel|shortlet|apartment|suite/i.test(cat)) {
        hookLine = 'We built a 24/7 direct WhatsApp room booking & deposit verification assistant.';
      } else if (/auto|car|dealership|spare/i.test(cat)) {
        hookLine = 'We built a 24/7 vehicle duty calculator & WhatsApp stock browser for your dealership.';
      }

      const proposalText = `Good day Team at *${cleanName}* (${area}),

My name is Tosin from Bethelmind Analytics Lagos Desk.

Prospective clients inquiring after business hours often wait hours before receiving quotes or availability confirmations.

${hookLine}

👉 *Test drive your live private prototype on your phone (₦0 Upfront):*
${previewUrl}

(Tap link to test the instant calculator, audio note, and automated quoter).

To claim your portal or request customizations, connect directly with our desk:
wa.me/2348022791227 (0802 279 1227).`;

      try {
        const jid = `${targetDigits}@s.whatsapp.net`;
        await line.socket.sendMessage(jid, { text: proposalText });
        lead.whatsapp_dispatched = true;
        lead.wa_sent = true;
        lead.wa_sent_line = lineId;
        lead.wa_sent_at = new Date().toISOString();
        sentCount++;
        console.log(`   ✅ [Line ${lineId} Burst ${sentCount}/${batch.length}] Delivered to ${cleanName} (+${targetDigits})`);

        saveToCentralInbox({
          channel: 'whatsapp',
          lineId,
          senderPhone: targetDigits,
          senderName: cleanName,
          sector: lead.category || lead.sector,
          message: proposalText,
          fromMe: true,
          previewUrl
        });

        // 12s - 20s natural throttle to keep session healthy
        const jitter = Math.floor(Math.random() * 8000) + 12000;
        await new Promise(r => setTimeout(r, jitter));
      } catch (sendErr) {
        console.warn(`   ⚠️ Send error on Line ${lineId} to +${targetDigits}:`, sendErr.message);
        if (sendErr.message?.includes('401') || sendErr.message?.includes('403')) break;
      }
    }

    fs.writeFileSync(leadsDbFile, JSON.stringify(leads, null, 2), 'utf8');

    // Update daily outreach log
    try {
      const today = new Date().toISOString().split('T')[0];
      const logFile = path.join(LOCAL_DB, 'whatsapp_daily_outreach_log.json');
      let log = { dates: {} };
      if (fs.existsSync(logFile)) {
        try { log = JSON.parse(fs.readFileSync(logFile, 'utf8')); } catch (_) {}
      }
      if (!log.dates) log.dates = {};
      if (!log.dates[today]) log.dates[today] = { lineCounts: {}, dispatches: [] };
      log.dates[today].lineCounts[lineId] = (log.dates[today].lineCounts[lineId] || 0) + sentCount;
      fs.writeFileSync(logFile, JSON.stringify(log, null, 2), 'utf8');
    } catch (_) {}

    console.log(`\n🎉 [Auto-Outreach Burst Complete] Line ${lineId} finished dispatching ${sentCount} proposals!`);

    if (linesState[1]?.status === 'open' && linesState[1]?.socket) {
      try {
        await linesState[1].socket.sendMessage(ADMIN_JID, {
          text: `⚡ *AUTO-OUTREACH BURST COMPLETE*\n\nLine ${lineId} (${line.displayPhone}) dispatched *${sentCount} B2B proposals* immediately upon linking!`
        });
      } catch (_) {}
    }
  } catch (err) {
    console.error(`[Auto-Burst Error] Line ${lineId}:`, err.message);
  } finally {
    delete activeBurstRunning[lineId];
  }
}

// ── BAILEYS SOCKET MANAGER ──────────────────────────────────────────────────

async function initLineSocket(lineId, isFreshPairing = false) {
  const line = linesState[lineId];
  if (!line) return;

  if (line.socket) {
    try { line.socket.end(); } catch(_) {}
    line.socket = null;
  }

  if (isFreshPairing) {
    line.isPairing = true;
  }

  const authDir = line.authPath;
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  const credsFile = path.join(authDir, 'creds.json');
  if (isFreshPairing && fs.existsSync(authDir)) {
    console.log(`[Daemon] Line ${lineId} requested fresh pairing. Archiving older creds...`);
    const backupDir = path.join(LOCAL_DB, 'baileys_auth_backups', line.dir);
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    try {
      const files = fs.readdirSync(authDir);
      for (const f of files) {
        try {
          fs.copyFileSync(path.join(authDir, f), path.join(backupDir, `archive_${Date.now()}_${f}`));
          fs.unlinkSync(path.join(authDir, f));
        } catch (_) {}
      }
    } catch (_) {}
  }

  line.status = 'connecting';
  line.lastError = null;

  try {
    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    const { version } = await fetchLatestBaileysVersion();

    if (!state.creds.registered && !isFreshPairing && !line.isPairing) {
      line.status = 'needs_pairing';
      line.lastError = 'Session not registered. Please generate pairing code or QR.';
      console.log(`[Daemon] 📱 Line ${lineId} (${line.displayPhone}) session not registered. Awaiting pairing from dashboard.`);
      return;
    }

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      browser: ['Windows', 'Chrome', '128.0.6613.120'],
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      keepAliveIntervalMs: 25000,
      emitOwnEvents: false,
      retryRequestDelayMs: 3000
    });

    line.socket = sock;

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        try {
          line.qrDataUrl = await QRCode.toDataURL(qr);
          line.status = 'needs_pairing';
          console.log(`[Daemon] 📱 QR Code generated for Line ${lineId} (${line.displayPhone})`);
          const publicQr = path.join(process.cwd(), 'public', `line_${lineId}_qr.png`);
          await QRCode.toFile(publicQr, qr, { width: 350, margin: 2 });
        } catch (_) {}
      }

      if (connection === 'open') {
        line.status = 'open';
        line.isPairing = false;
        line.qrDataUrl = '';
        line.pairingCode = '';
        line.reconnectAttempts = 0;
        line.connectedAt = new Date().toISOString();

        const myJid = sock.user?.id || '';
        const rawDigits = myJid.split(':')[0] || line.phone;
        line.phone = rawDigits;

        console.log(`[Daemon] 🎉 Line ${lineId} (${line.role}) CONNECTED & ACTIVE! (+${line.phone})`);
        updateRegistryLine(lineId, {
          connected: true,
          phone: line.phone,
          name: sock.user?.name || line.role,
          pairedMethod: 'Baileys Multi-Device Persistent',
          pairedAt: line.connectedAt
        });

        // ⚡ INSTANT AUTO-OUTREACH BURST ON LINE LINKING (Lines 2-7 only; Line 1 is Admin Desk)
        if (lineId >= 2) {
          console.log(`[Daemon] ⚡ Line ${lineId} freshly linked! Launching auto-outreach burst in 5s...`);
          setTimeout(() => triggerAutoOutreachBurst(lineId, 25), 5000);
        }
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        line.lastError = `Closed with status: ${statusCode}`;
        line.qrDataUrl = '';

        if (statusCode === DisconnectReason.loggedOut || statusCode === 401 || statusCode === 403) {
          line.status = statusCode === 403 ? 'needs_pairing' : 'logged_out';
          console.warn(`[Daemon] ⚠️ Line ${lineId} (${line.displayPhone}) authorization expired (Status ${statusCode}). Re-pairing required.`);
          updateRegistryLine(lineId, { connected: false });
        } else if (statusCode === DisconnectReason.restartRequired || statusCode === 515) {
          line.status = 'reconnecting';
          console.log(`[Daemon] 🔄 Line ${lineId} security keys updated / restart required (status 515). Reconnecting in 1.5s...`);
          setTimeout(() => {
            initLineSocket(lineId, false);
          }, 1500);
        } else if (statusCode === 428) {
          if (line.isPairing && line.pairingCode) {
            console.log(`[Daemon] 🔑 Line ${lineId} pairing code [ ${line.pairingCode} ] active. Awaiting phone authorization.`);
            return;
          }
          line.reconnectAttempts++;
          if (line.reconnectAttempts > 2) {
            line.status = 'needs_pairing';
            console.warn(`[Daemon] ⚠️ Line ${lineId} (${line.displayPhone}) session challenge (428). Marked for pairing.`);
            updateRegistryLine(lineId, { connected: false });
          } else {
            line.status = 'reconnecting';
            const delay = Math.min(15000, 5000 * line.reconnectAttempts);
            console.log(`[Daemon] 🔄 Line ${lineId} connection challenge (428). Reconnecting attempt ${line.reconnectAttempts}/2 in ${delay/1000}s...`);
            setTimeout(() => {
              initLineSocket(lineId, false);
            }, delay);
          }
        } else {
          // Automatic resilient reconnect with gentle exponential backoff
          line.status = 'reconnecting';
          line.reconnectAttempts++;
          const delay = Math.min(45000, 5000 * Math.pow(1.5, Math.min(line.reconnectAttempts, 5)));
          console.log(`[Daemon] 🔄 Line ${lineId} disconnected (${line.lastError}). Auto-reconnecting in ${Math.round(delay / 1000)}s...`);
          setTimeout(() => {
            initLineSocket(lineId, false);
          }, delay);
        }
      }
    });

    // Inbound message listener & Central Omnichannel Bridge
    sock.ev.on('messages.upsert', async (m) => {
      try {
        if (m.type !== 'notify') return;
        for (const msg of m.messages) {
          if (msg.key.fromMe || !msg.message) continue;

          const senderRaw = msg.key.remoteJid || '';
          if (senderRaw.endsWith('@broadcast') || senderRaw.endsWith('@g.us')) continue;

          // 1. Extract message text
          let text = '';
          const mContent = msg.message;
          if (mContent.conversation) text = mContent.conversation;
          else if (mContent.extendedTextMessage?.text) text = mContent.extendedTextMessage.text;
          else if (mContent.buttonsResponseMessage?.selectedDisplayText) text = mContent.buttonsResponseMessage.selectedDisplayText;
          else if (mContent.templateButtonReplyMessage?.selectedDisplayText) text = mContent.templateButtonReplyMessage.selectedDisplayText;
          else if (mContent.interactiveResponseMessage?.body?.text) text = mContent.interactiveResponseMessage.body.text;
          else if (mContent.imageMessage?.caption) text = `[Image] ${mContent.imageMessage.caption}`;
          else if (mContent.audioMessage) text = '[Voice Note]';
          else text = '[Media / Document Message]';

          // 2. Resolve sender phone (handling both standard @s.whatsapp.net and @lid)
          let senderPhone = '';
          if (senderRaw.endsWith('@s.whatsapp.net')) {
            senderPhone = senderRaw.split('@')[0];
          } else if (senderRaw.endsWith('@lid')) {
            const lidDigits = senderRaw.split('@')[0];
            const mappingFile = path.join(authDir, `lid-mapping-${lidDigits}_reverse.json`);
            if (fs.existsSync(mappingFile)) {
              try { senderPhone = JSON.parse(fs.readFileSync(mappingFile, 'utf8')); } catch (_) {}
            }
            if (!senderPhone && msg.key.participant) {
              senderPhone = msg.key.participant.split('@')[0];
            }
            if (!senderPhone) senderPhone = lidDigits;
          }

          console.log(`\n🔔 [Daemon] 💬 Inbound message on Line ${lineId} from +${senderPhone}: "${text.slice(0, 80)}"`);

          // 3. Lookup business name & sector from leads_db
          let prospectName = 'Commercial Enterprise';
          let prospectSector = 'B2B Client';
          let previewUrl = '';
          try {
            const leadsDbFile = path.join(LOCAL_DB, 'leads_db.json');
            if (fs.existsSync(leadsDbFile)) {
              const leads = JSON.parse(fs.readFileSync(leadsDbFile, 'utf8'));
              const match = leads.find(l => {
                const lp = (l.phone || l.phone_e164 || '').replace(/\D/g, '');
                return lp && senderPhone.includes(lp.slice(-9));
              });
              if (match) {
                prospectName = match.name || match.business_name || prospectName;
                prospectSector = match.category || match.sector || prospectSector;
                previewUrl = match.preview_url || `https://www.bethelmindanalytics.com/preview/${match.slug || match.id}`;
              }
            }
          } catch (_) {}

          // 4. Save to Central Omnichannel Inbox
          saveToCentralInbox({
            channel: 'whatsapp',
            lineId,
            senderPhone,
            senderName: prospectName,
            sector: prospectSector,
            message: text,
            fromMe: false,
            previewUrl
          });

          // 5. Forward alert to Admin Desk (0802 279 1227)
          if (lineId !== 1 && senderPhone !== '2348022791227') {
            await forwardAlertToAdmin({
              channel: 'whatsapp',
              lineId,
              senderName: prospectName,
              senderPhone,
              sector: prospectSector,
              message: text
            });
          }
        }
      } catch (err) {
        console.warn(`[Daemon] Error processing inbound message:`, err.message);
      }
    });

  } catch (err) {
    line.status = 'disconnected';
    line.lastError = err.message;
    console.error(`[Daemon] Error starting Line ${lineId}:`, err.message);
  }
}

/**
 * Request an 8-Digit Pairing Code for a line
 */
async function requestPairingCode(lineId, phoneInput) {
  const line = linesState[lineId];
  if (!line) throw new Error(`Invalid line ID: ${lineId}`);

  const phone = cleanPhone(phoneInput || line.phone);
  if (!phone) throw new Error('Valid 11-13 digit Nigerian phone number required.');

  line.phone = phone;

  // Initialize fresh socket
  await initLineSocket(lineId, true);

  // Wait 3.5 seconds for socket to complete TLS handshake with WhatsApp servers
  await new Promise(r => setTimeout(r, 3500));

  if (!line.socket) throw new Error('Failed to initialize socket for pairing code.');

  try {
    const code = await line.socket.requestPairingCode(phone);
    line.pairingCode = code;
    line.status = 'needs_pairing';
    console.log(`[Daemon] 🔑 8-Digit Pairing Code for Line ${lineId} (+${phone}): [ ${code} ]`);
    return code;
  } catch (err) {
    line.lastError = err.message;
    throw err;
  }
}

// ── REST API ROUTES ─────────────────────────────────────────────────────────

// 1. Health & Status
app.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('/api/status', (req, res) => {
  const linesSummary = {};
  for (let i = 1; i <= 7; i++) {
    const l = linesState[i];
    linesSummary[i] = {
      id: l.id,
      role: l.role,
      phone: l.phone,
      displayPhone: l.displayPhone,
      status: l.status,
      hasQr: !!l.qrDataUrl,
      hasPairingCode: !!l.pairingCode,
      pairingCode: l.pairingCode,
      connectedAt: l.connectedAt,
      lastError: l.lastError
    };
  }
  res.json({ ok: true, lines: linesSummary });
});

// 2. Send Message via Specific Line
app.post('/api/send', async (req, res) => {
  const { lineId, phone, message } = req.body;
  if (!lineId || !phone || !message) {
    return res.status(400).json({ ok: false, error: 'lineId, phone, and message are required.' });
  }

  const line = linesState[lineId];
  if (!line) {
    return res.status(404).json({ ok: false, error: `Line ${lineId} does not exist.` });
  }

  if (line.status !== 'open' || !line.socket) {
    return res.status(503).json({
      ok: false,
      error: `Line ${lineId} is currently ${line.status}. Connect it before dispatching.`
    });
  }

  const targetDigits = cleanPhone(phone);
  if (!targetDigits) {
    return res.status(400).json({ ok: false, error: `Invalid recipient phone number: ${phone}` });
  }

  const jid = `${targetDigits}@s.whatsapp.net`;

  try {
    const result = await line.socket.sendMessage(jid, { text: message });
    console.log(`[Daemon] ✅ Message sent to +${targetDigits} via Line ${lineId} (msgId: ${result.key?.id})`);

    // Record to Central Omnichannel Inbox
    saveToCentralInbox({
      channel: 'whatsapp',
      lineId,
      senderPhone: targetDigits,
      message,
      fromMe: true
    });

    res.json({ ok: true, messageId: result.key?.id, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(`[Daemon] ❌ Failed to send message via Line ${lineId}:`, err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 2B. Manual Auto-Outreach Burst Trigger
app.post('/api/outreach/burst', async (req, res) => {
  const { lineId, count } = req.body;
  const id = parseInt(lineId, 10);
  if (!id || id < 2 || id > 7) {
    return res.status(400).json({ ok: false, error: 'lineId must be between 2 and 7 (Line 1 is Admin Closer Desk).' });
  }
  const line = linesState[id];
  if (!line || line.status !== 'open') {
    return res.status(400).json({ ok: false, error: `Line ${id} is not open (status: ${line ? line.status : 'unknown'}).` });
  }
  const targetCount = parseInt(count, 10) || 25;
  triggerAutoOutreachBurst(id, targetCount);
  res.json({ ok: true, message: `Auto-outreach burst triggered for Line ${id} (${targetCount} leads).` });
});

// 3. Initiate Pairing
app.post('/api/pair', async (req, res) => {
  const { lineId, phone, method } = req.body;
  const id = parseInt(lineId, 10);
  if (!id || id < 1 || id > 7) {
    return res.status(400).json({ ok: false, error: 'Invalid lineId (must be 1-7).' });
  }

  try {
    if (method === 'code') {
      const code = await requestPairingCode(id, phone);
      return res.json({ ok: true, lineId: id, pairingCode: code });
    } else {
      await initLineSocket(id, true);
      return res.json({ ok: true, lineId: id, message: 'QR initialization started. Check dashboard or /api/status for QR.' });
    }
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// 4. Central Inbox Endpoints
app.get('/api/inbox', (req, res) => {
  const inbox = getCentralInbox();
  res.json({ ok: true, total: inbox.length, conversations: inbox });
});

// 5. Reply to Inbound Conversation
app.post('/api/inbox/reply', async (req, res) => {
  const { threadId, message, lineIdOverride } = req.body;
  if (!threadId || !message) {
    return res.status(400).json({ ok: false, error: 'threadId and message are required.' });
  }

  const inbox = getCentralInbox();
  const thread = inbox.find(t => t.id === threadId);
  if (!thread) {
    return res.status(404).json({ ok: false, error: 'Conversation thread not found.' });
  }

  const lineId = lineIdOverride || thread.lineId || 6;
  const line = linesState[lineId];

  if (!line || line.status !== 'open' || !line.socket) {
    // Try any active line
    let activeLine = Object.values(linesState).find(l => l.status === 'open' && l.socket);
    if (!activeLine) {
      return res.status(503).json({ ok: false, error: 'No WhatsApp line is currently connected to send replies.' });
    }
  }

  const sendLineId = (line && line.status === 'open') ? lineId : Object.values(linesState).find(l => l.status === 'open').id;
  const activeLineObj = linesState[sendLineId];

  try {
    const targetDigits = cleanPhone(thread.senderPhone);
    if (!targetDigits) {
      return res.status(400).json({ ok: false, error: `Invalid recipient phone number: ${thread.senderPhone}` });
    }

    const jid = `${targetDigits}@s.whatsapp.net`;
    const result = await activeLineObj.socket.sendMessage(jid, { text: message });

    // Mark as read and append sent message
    thread.messages.push({
      sender: 'agent',
      text: message,
      timestamp: new Date().toISOString()
    });
    thread.unreadCount = 0;
    thread.updatedAt = new Date().toISOString();
    fs.writeFileSync(CENTRAL_INBOX_PATH, JSON.stringify(inbox, null, 2), 'utf8');

    console.log(`[Central Inbox] ✅ Reply sent to ${thread.senderName} (+${targetDigits}) via Line ${sendLineId}`);
    res.json({ ok: true, messageId: result.key?.id, thread });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 6. Web Contact Form & Inbound SMS/Email Intake Endpoint
app.post('/web-inquiry', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!message) return res.status(400).json({ ok: false, error: 'Message required' });

  const thread = saveToCentralInbox({
    channel: 'webform',
    lineId: 6,
    senderName: name || 'Web Prospect',
    senderPhone: phone || '',
    senderEmail: email || '',
    sector: subject || 'Web Inquiry',
    message
  });

  await forwardAlertToAdmin({
    channel: 'webform',
    senderName: name,
    senderPhone: phone,
    sector: subject,
    message
  });

  res.json({ ok: true, ticketId: thread ? thread.id : `WEB-${Date.now()}` });
});

app.post('/sms-inquiry', async (req, res) => {
  const { sender, message, text } = req.body;
  const content = message || text || '';
  if (!content) return res.status(400).json({ ok: false, error: 'Message required' });

  const thread = saveToCentralInbox({
    channel: 'sms',
    lineId: null,
    senderPhone: sender || '',
    senderName: 'SMS Prospect',
    sector: 'GSM Inbound',
    message: content
  });

  await forwardAlertToAdmin({
    channel: 'sms',
    senderName: 'SMS Prospect',
    senderPhone: sender,
    sector: 'GSM Inbound',
    message: content
  });

  res.json({ ok: true, ticketId: thread ? thread.id : `SMS-${Date.now()}` });
});

app.post('/email-inquiry', async (req, res) => {
  const { from, subject, message } = req.body;
  if (!message) return res.status(400).json({ ok: false, error: 'Message required' });

  const thread = saveToCentralInbox({
    channel: 'email',
    lineId: null,
    senderEmail: from || '',
    senderName: from ? from.split('@')[0] : 'Email Prospect',
    sector: subject || 'Executive Email Inquiry',
    message
  });

  await forwardAlertToAdmin({
    channel: 'email',
    senderName: from,
    senderPhone: '',
    sector: subject,
    message
  });

  res.json({ ok: true, ticketId: thread ? thread.id : `EM-${Date.now()}` });
});

// ── UNIFIED WEB DASHBOARD & INBOX INTERFACE ──────────────────────────────────
app.get('/', (req, res) => {
  const registry = loadRegistry();
  const inbox = getCentralInbox();
  let cardsHtml = '';

  for (let i = 1; i <= 7; i++) {
    const l = linesState[i];
    const reg = registry[`line_${i}`] || {};
    const statusColor = l.status === 'open' ? '#22c55e' : (l.status === 'needs_pairing' ? '#f59e0b' : '#ef4444');
    const statusLabel = l.status === 'open' ? 'ONLINE & ACTIVE' : (l.status === 'needs_pairing' ? 'NEEDS PAIRING' : l.status.toUpperCase());

    cardsHtml += `
      <div class="line-card" id="card-${i}">
        <div class="card-header">
          <div>
            <span class="line-badge">Line ${i}</span>
            <span class="role-badge">${l.role}</span>
          </div>
          <span class="status-pill" style="background:${statusColor}20; color:${statusColor}; border-color:${statusColor}40;">
            ● ${statusLabel}
          </span>
        </div>
        <div class="phone-display">${l.displayPhone}</div>
        <div class="meta-row">Registered Name: <strong>${reg.name || 'Outreach Desk'}</strong></div>
        <div class="meta-row">Connected At: <strong>${l.connectedAt ? new Date(l.connectedAt).toLocaleTimeString() : 'N/A'}</strong></div>

        <div class="action-box">
          ${l.status === 'open' ? `
            <div class="active-banner">✅ Socket Persistent & Ready for Dispatches</div>
            ${i >= 2 ? `
              <button class="btn btn-primary" style="margin-top:10px; width:100%; background: linear-gradient(135deg, #059669, #10b981);" onclick="triggerBurst(${i})">🚀 Launch 25 Outbound Leads</button>
            ` : `
              <div style="font-size:0.8rem; color:var(--text-muted); margin-top:6px; text-align:center;">Admin & Inbound Desk (Zero cold outbound)</div>
            `}
          ` : `
            <div class="pair-actions">
              <button class="btn btn-primary" onclick="requestPairingCode(${i})">Get 8-Digit Code</button>
              <button class="btn btn-outline" onclick="requestQr(${i})">Show QR</button>
            </div>
            ${l.pairingCode ? `
              <div class="code-box">Pairing Code: <span>${l.pairingCode}</span></div>
            ` : ''}
            ${l.qrDataUrl ? `
              <div class="qr-box"><img src="${l.qrDataUrl}" width="200" height="200"/></div>
            ` : ''}
          `}
        </div>
      </div>
    `;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Bethelmind Omnichannel Response Hub & Multi-Line Gateway</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #070a13;
      --card-bg: #0e1526;
      --border: #1e293b;
      --primary: #38bdf8;
      --primary-hover: #0284c7;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent-green: #22c55e;
      --accent-gold: #f59e0b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      padding: 24px 20px;
      min-height: 100vh;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    header {
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 20px;
    }
    h1 { font-size: 1.8rem; font-weight: 800; color: #fff; }
    h1 span { color: var(--primary); }
    .subtitle { color: var(--text-muted); font-size: 0.95rem; margin-top: 4px; }
    
    .nav-tabs {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 12px;
    }
    .tab-btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      border: 1px solid transparent;
      background: transparent;
      color: var(--text-muted);
      transition: all 0.2s;
    }
    .tab-btn.active {
      background: #0284c725;
      color: var(--primary);
      border-color: #0284c750;
    }
    .badge-count {
      background: #ef4444;
      color: #fff;
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 12px;
      margin-left: 6px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
    }
    .line-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }
    .line-badge {
      background: #0284c725;
      color: #38bdf8;
      font-weight: 700;
      font-size: 0.8rem;
      padding: 4px 10px;
      border-radius: 6px;
      margin-right: 6px;
    }
    .role-badge { color: var(--text-muted); font-size: 0.8rem; }
    .status-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid;
    }
    .phone-display { font-size: 1.35rem; font-weight: 800; color: #fff; margin-top: 4px; }
    .meta-row { font-size: 0.85rem; color: var(--text-muted); }
    .meta-row strong { color: #e2e8f0; }
    .action-box { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border); }
    .active-banner {
      background: #22c55e15;
      color: #4ade80;
      border: 1px solid #22c55e30;
      padding: 10px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      text-align: center;
    }
    .pair-actions { display: flex; gap: 8px; }
    .btn {
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-primary { background: #0284c7; color: #fff; }
    .btn-primary:hover { background: #0369a1; }
    .btn-outline { background: transparent; border: 1px solid var(--border); color: #cbd5e1; }
    .btn-outline:hover { background: #1e293b; }
    .code-box {
      margin-top: 12px;
      background: #0284c715;
      border: 1px dashed #0284c7;
      padding: 10px;
      border-radius: 8px;
      text-align: center;
      font-size: 0.9rem;
    }
    .code-box span { font-size: 1.2rem; font-weight: 800; color: #38bdf8; letter-spacing: 2px; }
    .qr-box { margin-top: 12px; text-align: center; }
    .qr-box img { border-radius: 10px; background: #fff; padding: 6px; }

    /* INBOX SPLIT-PANE STYLES */
    .inbox-container {
      display: grid;
      grid-template-columns: 380px 1fr 340px;
      gap: 20px;
      height: 78vh;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
    }
    .conv-list {
      border-right: 1px solid var(--border);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .conv-item {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: background 0.15s;
    }
    .conv-item:hover, .conv-item.active {
      background: #1e293b50;
    }
    .conv-item.unread {
      border-left: 4px solid var(--primary);
    }
    .conv-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .conv-name { font-weight: 700; font-size: 0.95rem; color: #fff; }
    .conv-time { font-size: 0.75rem; color: var(--text-muted); }
    .conv-sector { font-size: 0.8rem; color: var(--primary); margin-bottom: 6px; }
    .conv-preview {
      font-size: 0.85rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .channel-tag {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      margin-right: 6px;
      background: #0284c725;
      color: #38bdf8;
    }
    .chat-pane {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #090e1c;
    }
    .chat-header {
      padding: 16px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--card-bg);
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .msg-bubble {
      max-width: 75%;
      padding: 14px 18px;
      border-radius: 14px;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    .msg-client {
      align-self: flex-start;
      background: #1e293b;
      color: #f1f5f9;
      border-bottom-left-radius: 2px;
    }
    .msg-agent {
      align-self: flex-end;
      background: #0284c7;
      color: #fff;
      border-bottom-right-radius: 2px;
    }
    .msg-time {
      font-size: 0.7rem;
      margin-top: 6px;
      opacity: 0.7;
      text-align: right;
    }
    .chat-reply-area {
      padding: 16px 24px;
      border-top: 1px solid var(--border);
      background: var(--card-bg);
    }
    .quick-templates {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      overflow-x: auto;
    }
    .template-chip {
      background: #1e293b;
      color: #cbd5e1;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      cursor: pointer;
      white-space: nowrap;
      border: 1px solid #334155;
    }
    .template-chip:hover {
      background: #334155;
      color: #fff;
    }
    .reply-form {
      display: flex;
      gap: 12px;
    }
    .reply-input {
      flex: 1;
      background: #0b1120;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 16px;
      color: #fff;
      font-family: inherit;
      font-size: 0.95rem;
      resize: none;
      height: 60px;
    }
    .reply-input:focus {
      outline: none;
      border-color: var(--primary);
    }
    .client-sidebar {
      border-left: 1px solid var(--border);
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .client-info-card {
      background: #090e1c;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
    }
    .info-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .info-val { font-size: 1rem; font-weight: 700; color: #fff; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>⚡ Bethelmind <span>Omnichannel Response Hub</span></h1>
        <p class="subtitle">Unified Centralized Inbound Inbox & Multi-Socket WhatsApp Gateway (Lines 1 to 7)</p>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-outline" onclick="location.reload()">🔄 Refresh</button>
      </div>
    </header>

    <div class="nav-tabs">
      <button class="tab-btn active" onclick="switchTab('inbox')" id="tab-inbox">
        💬 Central Omnichannel Inbox
        <span class="badge-count" id="unread-count">${inbox.filter(t => t.unreadCount > 0).length || 4}</span>
      </button>
      <button class="tab-btn" onclick="switchTab('gateway')" id="tab-gateway">
        📱 WhatsApp Gateway Sockets (Lines 1-7)
      </button>
    </div>

    <!-- TAB 1: CENTRAL OMNICHANNEL INBOX -->
    <div id="view-inbox" class="inbox-container">
      <div class="conv-list" id="conv-list">
        <!-- Injected via JavaScript -->
      </div>

      <div class="chat-pane">
        <div class="chat-header">
          <div>
            <h3 id="chat-title">Select a Conversation</h3>
            <div style="font-size:0.8rem; color:var(--text-muted);" id="chat-subtitle">Choose a prospect from the left to view the live thread</div>
          </div>
          <div id="chat-line-badge"></div>
        </div>

        <div class="chat-messages" id="chat-messages">
          <div style="margin:auto; text-align:center; color:var(--text-muted);">
            👈 Click on any of the 4 prospective client inquiries to begin chatting
          </div>
        </div>

        <div class="chat-reply-area">
          <div class="quick-templates">
            <span class="template-chip" onclick="insertTemplate('turnkey')">🎯 Turnkey Website (₦150k / ₦75k deposit)</span>
            <span class="template-chip" onclick="insertTemplate('embed')">⚡ 1-Line Embed WhatsApp Sales AI (₦35k)</span>
            <span class="template-chip" onclick="insertTemplate('demo')">🔗 Send Customized Prototype Demo Link</span>
            <span class="template-chip" onclick="insertTemplate('bank')">🏦 Send Verified OPay Account Details</span>
          </div>
          <form class="reply-form" onsubmit="sendReply(event)">
            <textarea id="reply-text" class="reply-input" placeholder="Type direct reply to client or click a template..."></textarea>
            <button type="submit" class="btn btn-primary" id="send-btn" style="min-width:100px;">Send 🚀</button>
          </form>
        </div>
      </div>

      <div class="client-sidebar">
        <h4 style="color:#fff;">🏢 Prospect Profile</h4>
        <div class="client-info-card">
          <div class="info-label">Business Name</div>
          <div class="info-val" id="side-name">—</div>
        </div>
        <div class="client-info-card">
          <div class="info-label">Sector / Category</div>
          <div class="info-val" id="side-sector">—</div>
        </div>
        <div class="client-info-card">
          <div class="info-label">WhatsApp Phone</div>
          <div class="info-val" id="side-phone">—</div>
        </div>
        <div class="client-info-card">
          <div class="info-label">Receiving Line</div>
          <div class="info-val" id="side-line">—</div>
        </div>
        <div class="client-info-card">
          <div class="info-label">Prototype Demo</div>
          <div class="info-val" style="font-size:0.85rem;" id="side-demo">—</div>
        </div>
        <div class="client-info-card">
          <div class="info-label">Settlement Rail</div>
          <div class="info-val" style="font-size:0.85rem; color:#4ade80;">OPay (7034297995 - Oyelakin Tosin Matthew)</div>
        </div>
      </div>
    </div>

    <!-- TAB 2: GATEWAY SOCKETS -->
    <div id="view-gateway" class="grid" style="display:none;">
      ${cardsHtml}
    </div>
  </div>

  <script>
    let activeThread = null;
    let allConversations = [];

    function switchTab(tab) {
      document.getElementById('view-inbox').style.display = tab === 'inbox' ? 'grid' : 'none';
      document.getElementById('view-gateway').style.display = tab === 'gateway' ? 'grid' : 'none';
      document.getElementById('tab-inbox').classList.toggle('active', tab === 'inbox');
      document.getElementById('tab-gateway').classList.toggle('active', tab === 'gateway');
    }

    async function loadInbox() {
      try {
        const res = await fetch('/api/inbox');
        const data = await res.json();
        if (data.ok) {
          allConversations = data.conversations;
          renderConvList();
          if (allConversations.length > 0 && !activeThread) {
            selectThread(allConversations[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load inbox:', err);
      }
    }

    function renderConvList() {
      const listEl = document.getElementById('conv-list');
      listEl.innerHTML = '';
      allConversations.forEach(c => {
        const lastMsg = c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1].text : 'No messages';
        const timeStr = c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
        const item = document.createElement('div');
        item.className = 'conv-item' + (activeThread?.id === c.id ? ' active' : '') + (c.unreadCount > 0 ? ' unread' : '');
        item.onclick = () => selectThread(c.id);
        item.innerHTML = \`
          <div class="conv-header">
            <span class="conv-name">\${c.senderName}</span>
            <span class="conv-time">\${timeStr}</span>
          </div>
          <div class="conv-sector">
            <span class="channel-tag">\${c.channel}</span>
            \${c.sector} \${c.lineId ? '• Line ' + c.lineId : ''}
          </div>
          <div class="conv-preview">\${lastMsg}</div>
        \`;
        listEl.appendChild(item);
      });
    }

    function selectThread(threadId) {
      activeThread = allConversations.find(t => t.id === threadId);
      if (!activeThread) return;

      renderConvList();

      document.getElementById('chat-title').textContent = activeThread.senderName;
      document.getElementById('chat-subtitle').textContent = '+' + activeThread.senderPhone + ' • ' + activeThread.sector;
      document.getElementById('chat-line-badge').innerHTML = \`
        <span class="line-badge">Line \${activeThread.lineId || 6}</span>
        <a href="https://wa.me/\${activeThread.senderPhone}" target="_blank" class="btn btn-outline" style="padding:4px 10px; font-size:0.75rem;">Open in WhatsApp ↗</a>
      \`;

      // Render Messages
      const msgBox = document.getElementById('chat-messages');
      msgBox.innerHTML = '';
      (activeThread.messages || []).forEach(m => {
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble ' + (m.sender === 'agent' ? 'msg-agent' : 'msg-client');
        bubble.innerHTML = \`
          <div>\${m.text.replace(/\\n/g, '<br/>')}</div>
          <div class="msg-time">\${new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
        \`;
        msgBox.appendChild(bubble);
      });
      msgBox.scrollTop = msgBox.scrollHeight;

      // Update Sidebar
      document.getElementById('side-name').textContent = activeThread.senderName;
      document.getElementById('side-sector').textContent = activeThread.sector;
      document.getElementById('side-phone').textContent = '+' + activeThread.senderPhone;
      document.getElementById('side-line').textContent = 'Line ' + (activeThread.lineId || 6);
      document.getElementById('side-demo').innerHTML = activeThread.previewUrl ? 
        \`<a href="\${activeThread.previewUrl}" target="_blank" style="color:var(--primary); word-break:break-all;">\${activeThread.previewUrl} ↗</a>\` : 'Turnkey Deploy';
    }

    function insertTemplate(type) {
      const input = document.getElementById('reply-text');
      const name = activeThread ? activeThread.senderName : 'Partner';
      const demo = activeThread && activeThread.previewUrl ? activeThread.previewUrl : 'https://www.bethelmindanalytics.com';

      if (type === 'turnkey') {
        input.value = \`Hello \${name}! 👋 Thank you for reaching out. We deploy 100% Turnkey Commercial Website Prototypes with integrated 24/7 AI WhatsApp Quoting Assistants in 48 Hours. Setup is ₦150,000 (only ₦75,000 deposit to start). Would you like to inspect your live preview demo?\`;
      } else if (type === 'embed') {
        input.value = \`Hello \${name}! 👋 We can upgrade your existing business setup with our 1-Line WhatsApp AI Lead Closer script for ₦35,000 deposit (₦65,000 total). It answers customer inquiries in <3 seconds 24/7. May I send you the 1-minute test?\`;
      } else if (type === 'demo') {
        input.value = \`Hello \${name}! Here is the interactive demo tailored for your company: \${demo} — Tap the link to inspect it and let me know your thoughts!\`;
      } else if (type === 'bank') {
        input.value = \`Here are our official company settlement details for the milestone deposit:\\n\\nBank: OPay Digital Services\\nAccount Number: 7034297995\\nAccount Name: Oyelakin Tosin Matthew\\n\\nOnce transfer is confirmed, our engineering team initiates your 48-Hour deployment immediately!\`;
      }
      input.focus();
    }

    async function sendReply(e) {
      e.preventDefault();
      if (!activeThread) return;
      const input = document.getElementById('reply-text');
      const text = input.value.trim();
      if (!text) return;

      const btn = document.getElementById('send-btn');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/inbox/reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            threadId: activeThread.id,
            message: text,
            lineIdOverride: activeThread.lineId || 6
          })
        });
        const data = await res.json();
        if (data.ok) {
          input.value = '';
          await loadInbox();
          selectThread(activeThread.id);
        } else {
          alert('Failed to send: ' + data.error);
        }
      } catch (err) {
        alert('Network error: ' + err.message);
      } finally {
        btn.textContent = 'Send 🚀';
        btn.disabled = false;
      }
    }

    async function requestPairingCode(lineId) {
      const btn = event.target;
      btn.textContent = 'Requesting...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/pair', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lineId, method: 'code' })
        });
        const data = await res.json();
        if (data.ok) {
          alert('8-Digit Pairing Code Generated: ' + data.pairingCode + '\\n\\nEnter this code in WhatsApp -> Linked Devices -> Link with phone number.');
          location.reload();
        } else {
          alert('Error: ' + data.error);
          btn.textContent = 'Get 8-Digit Code';
          btn.disabled = false;
        }
      } catch (err) {
        alert('Network error: ' + err.message);
        btn.textContent = 'Get 8-Digit Code';
        btn.disabled = false;
      }
    }

    async function requestQr(lineId) {
      const btn = event.target;
      btn.textContent = 'Generating...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/pair', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lineId, method: 'qr' })
        });
        const data = await res.json();
        if (data.ok) {
          alert('QR Generation Started. Refreshing in 3 seconds to display QR...');
          setTimeout(() => location.reload(), 3000);
        } else {
          alert('Error: ' + data.error);
          btn.textContent = 'Show QR';
          btn.disabled = false;
        }
      } catch (err) {
        alert('Network error: ' + err.message);
        btn.textContent = 'Show QR';
        btn.disabled = false;
      }
    }

    async function triggerBurst(lineId) {
      const btn = event.target;
      const orig = btn.textContent;
      btn.textContent = 'Launching Burst...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/outreach/burst', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lineId, count: 25 })
        });
        const data = await res.json();
        if (data.ok) {
          alert('⚡ Auto-Outreach Burst launched on Line ' + lineId + ' for 25 fresh leads!\\n\\nTracking progress in real-time...');
        } else {
          alert('Error: ' + data.error);
        }
      } catch (err) {
        alert('Network error: ' + err.message);
      } finally {
        btn.textContent = orig;
        btn.disabled = false;
      }
    }

    // Auto-load inbox on page open
    loadInbox();
    setInterval(loadInbox, 8000);
  </script>
</body>
</html>`;

  res.send(html);
});

// Also make /inbox redirect or render the same page
app.get('/inbox', (req, res) => {
  res.redirect('/');
});

// ── SERVER INITIALIZATION ───────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log('='.repeat(72));
  console.log(`🚀 BETHELMIND OMNICHANNEL INBOX & MULTI-LINE GATEWAY RUNNING ON PORT ${PORT}`);
  console.log(`🌐 Live Central Inbox & Dashboard: http://localhost:${PORT}`);
  console.log(`📡 REST Endpoints: GET /api/inbox · POST /api/inbox/reply · POST /api/send`);
  console.log('='.repeat(72) + '\n');

  // Stagger auto-connect by 3.5s per line to avoid WhatsApp IP connection rate-limiting
  console.log('🔍 Checking existing line credentials across local_db (staggered startup)...');
  for (let i = 1; i <= 7; i++) {
    const l = linesState[i];
    const credsFile = path.join(l.authPath, 'creds.json');
    if (fs.existsSync(credsFile)) {
      try {
        const creds = JSON.parse(fs.readFileSync(credsFile, 'utf8'));
        if (creds.registered) {
          setTimeout(() => {
            console.log(`   [Line ${i}] Verified active session found in ${l.dir}. Initializing persistent socket...`);
            initLineSocket(i, false);
          }, (i - 1) * 3500);
          continue;
        }
      } catch (_) {}
      console.log(`   [Line ${i}] Unregistered / needs pairing (${l.dir}).`);
      l.status = 'needs_pairing';
    } else {
      console.log(`   [Line ${i}] No credentials yet (${l.dir}). Ready for pairing.`);
      l.status = 'needs_pairing';
    }
  }
});
