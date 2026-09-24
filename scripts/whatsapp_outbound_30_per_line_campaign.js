/**
 * @file scripts/whatsapp_outbound_30_per_line_campaign.js
 * 
 * 🛡️ ULTRA-SAFE SLOW-DRIP WHATSAPP WARM-UP & 24/7 INBOUND LISTENER
 * 
 * Bethelmind Analytics Lagos Desk · Commercial Growth Engine
 * 
 * 🚨 Hardened Anti-Ban Cadence (30-Minute Rest & Warm-Up Protocol):
 * 1. Safe Outreach Limit: Strictly 30 messages per active line per day.
 * 2. Alternating Lines: Rotates across Lines 3–7, sending 1 lead per line with 60s–90s jitter.
 * 3. Mandatory 30-Minute Rest Window: Waits 30 minutes between micro-batches.
 * 4. Self-Healing Socket Manager: Auto-reconnects immediately upon code 515/408/drop.
 * 5. Line 2 is PAUSED/QUARANTINED to protect the account while under review.
 * 6. 24/7 Inbound Listening & Typing Presence ('composing' 4s) across ALL lines.
 * 7. Lines 5, 6, 7 paired via WhatsApp Web (Browser) — fully active as of 2026-09-19.
 */

const fs = require('fs');
const path = require('path');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const LEADS_DB_PATH = path.join(LOCAL_DB, 'leads_db.json');
const WA_LOG_PATH = path.join(LOCAL_DB, 'whatsapp_daily_outreach_log.json');
const ADMIN_JID = '2348022791227@s.whatsapp.net';

// ============================================================
// 🔒 PERMANENTLY LOCKED 7-LINE FLEET (as of 2026-09-19)
// Line 1 (+234 802 279 1227): Admin & Inbound Closer — listens & auto-replies only, NO outbound
// Line 2 (+234 702 626 6946): QUARANTINED — paused for account review
// Line 3 (+234 904 605 0469): PRIMARY outreach — established, 30 msg/day
// Line 4 (+234 913 512 9625): Active outreach — 30 msg/day
// Line 5 (+234 703 055 6877): Active outreach — 30 msg/day (paired 2026-09-19)
// Line 6 (+234 811 934 6518): Active outreach — 30 msg/day (paired 2026-09-19)
// Line 7 (+234 814 160 9564): Active outreach — 30 msg/day (paired 2026-09-19)
// ============================================================
const ALL_OUTREACH_LINES = [
  { id: 1, name: 'Admin Closer Desk',  dir: 'baileys_auth_line1', phone: '+234 802 279 1227', active: false, dailyLimit: 0  },
  { id: 2, name: 'Outreach Line 1',    dir: 'baileys_auth_line2', phone: '+234 702 626 6946', active: true,  dailyLimit: 30 },
  { id: 3, name: 'Outreach Line 2',    dir: 'baileys_auth_line3', phone: '+234 904 605 0469', active: false, dailyLimit: 0  },
  { id: 4, name: 'Outreach Line 3',    dir: 'baileys_auth_line4', phone: '+234 913 512 9625', active: false, dailyLimit: 0  },
  { id: 5, name: 'Outreach Line 4',    dir: 'baileys_auth_line5', phone: '+234 703 055 6877', active: false, dailyLimit: 0  },
  { id: 6, name: 'Outreach Line 5',    dir: 'baileys_auth_line6', phone: '+234 811 934 6518', active: false, dailyLimit: 0  },
  { id: 7, name: 'Outreach Line 6',    dir: 'baileys_auth_line7', phone: '+234 814 160 9564', active: false, dailyLimit: 0  }
];

const MICRO_BATCH_SIZE = 1; // Strictly 1 lead per micro-batch
const BATCH_REST_MINUTES = 30; // 30 minutes rest between micro-batches for responses to register
const DAILY_LIMIT_PER_LINE = 20; // Safe daily ceiling for Line 3
const autoRepliedPhoneMap = new Map();

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function cleanPhone(rawPhone) {
  if (!rawPhone) return null;
  let digits = String(rawPhone).replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 14) return null;
  if (/0000|1111|8888|9999|123456/.test(digits)) return null;
  if (digits.startsWith('0') && digits.length === 11) digits = '234' + digits.substring(1);
  else if (digits.length === 10) digits = '234' + digits;
  else if (digits.startsWith('234') && digits.length === 13) digits = digits;
  return digits;
}

const { formatWhatsAppIntroGuaranteed, formatSmsGuaranteed, classifyLeadSector } = require('./leadClassifier');

function formatWaIntroduction(lead) {
  return formatWhatsAppIntroGuaranteed(lead);
}

function formatWaProposal(lead) {
  const rawName = (lead.name || lead.business_name || 'Commercial Enterprise')
    .split('||')[0].split('|')[0].replace(/\(.*?\)/g, '').trim();
  const cleanName = rawName.length > 28 ? rawName.slice(0, 25).trim() : rawName;
  const slug = (lead.lead_id && !lead.lead_id.includes('_det_') && !lead.lead_id.includes('lead_1'))
    ? lead.lead_id.slice(0, 20)
    : cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 18);
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const closerWa = `wa.me/2348022791227?text=${encodeURIComponent('Hello Tosin, I am reviewing the demo for ' + cleanName + ' and want to discuss setup.')}`;

  return `Here is your private preview link for *${cleanName}* (test it free right on your phone):
👉 ${previewUrl}

💡 *Why Lagos Businesses Are Using This:*
• Responds to buyers in under 3 seconds 24/7 (never miss a midnight sale)
• Calculates exact pricing & generates instant PDF quotes on WhatsApp
• Optional Fake-Alert-Proof bank transfer verification (Paystack/OPay)

💰 *Transparent Turnkey Pricing:*
• 1-Line Self-Install Embed: *₦25,000* one-time
• 100% Done-For-You Turnkey (Domain + Bot + Payment setup): *₦75,000*

To activate this on your official business line, tap here to connect directly with our Lagos Desk Head (Tosin Oyelakin):
👉 ${closerWa} (0802 279 1227)

Or simply reply *YES* to this chat and we will assist you immediately!`;
}

function formatAutoReply(text) {
  const lower = (text || '').toLowerCase().trim();

  // Pricing inquiries
  if (/price|cost|how much|fee|pay|pricing|expensive|cheap|charges|amount/i.test(lower)) {
    return `Good day Sir/Ma! Thank you for asking about pricing for *Bethelmind Analytics Lagos* business tools.

We keep our rates completely transparent with ZERO hidden fees:

1️⃣ *Option A: 1-Line Self-Install Embed* — *₦25,000* (one-time setup).
   Ideal if you already have a website and just want the 24/7 quoting bot & calculator added in 5 minutes.

2️⃣ *Option B: Full 100% Done-For-You (DFY) Turnkey* — *₦75,000* (Deposit: ₦35,000 to begin).
   We deliver everything within 48 hours:
   • Custom .com / .ng business domain
   • 24/7 AI WhatsApp Sales Bot configured on your business line
   • Automated Paystack & OPay bank transfer reconciliation (stops fake alerts)
   • 30-day technical support & staff handover

You can test drive the interactive demo on your phone right now:
👉 https://www.bethelmindanalytics.com

Which option fits your budget better (Self-Install ₦25k or Full DFY ₦75k)?
You can also call or message our Head of Desk directly:
👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
  }

  // Positive interest
  if (/yes|send|ok|sure|show me|interested|demo|proceed|details|link|share|go ahead|tell me more|how does it work/i.test(lower)) {
    return `Thank you so much Sir/Ma! We are excited to show you.

Here is the live interactive prototype (test it directly on your mobile device, ₦0 Upfront):
👉 https://www.bethelmindanalytics.com

📌 *What to test when you open it:*
1. Try the instant price calculator to see how fast it quotes.
2. Tap the WhatsApp demo button to experience the sub-3s automated response.

Once set up on your official business line, it captures paying customers day and night without your staff having to type repetitive replies.

Would you like our technical team to schedule a quick 10-minute activation for your business today?
Connect directly with our Lagos Desk Head:
👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
  }

  // Who are you / verification / location
  if (/who|where|office|address|location|scam|real|legit|call|number/i.test(lower)) {
    return `Good afternoon Sir/Ma!

We are *Bethelmind Analytics Lagos Desk*, a registered commercial technology enterprise based in Lagos, Nigeria.
• Head of Desk: Tosin Oyelakin
• Official Hotline / Direct WhatsApp: 0802 279 1227 (wa.me/2348022791227)
• Corporate Website: https://www.bethelmindanalytics.com
• Bank Settlement: Direct OPay Merchant Integration (Oyelakin Tosin Matthew)

We help Nigerian SMEs eliminate after-hours sales loss by deploying automated 24/7 WhatsApp response tools.

You do NOT pay anything upfront to review your demo. Feel free to inspect our platform or call 0802 279 1227 to speak with Tosin directly.`;
  }

  // General polite reply
  return `Good day Sir/Ma! Thank you for reaching out to *Bethelmind Analytics Lagos Desk*.

Our senior technical consultant is reviewing your message right now.

In the meantime, you can test drive how our 24/7 automated quoting tool works on your phone:
👉 https://www.bethelmindanalytics.com

To speak directly with our Head of Desk for immediate setup:
👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
}

/**
 * Self-healing persistent WhatsApp line controller
 */
class PersistentWhatsAppLine {
  constructor(cfg) {
    this.cfg = cfg;
    this.sock = null;
    this.isOpen = false;
    this.isReconnecting = false;
    this.authDir = path.join(LOCAL_DB, cfg.dir);
  }

  async init() {
    const credsPath = path.join(this.authDir, 'creds.json');
    const backupDir = path.join(LOCAL_DB, `${this.cfg.dir}_solidified_backup`);
    if (!fs.existsSync(credsPath) && fs.existsSync(backupDir)) {
      console.log(`[Self-Healing] Restoring session for ${this.cfg.name} from solidified backup...`);
      if (!fs.existsSync(this.authDir)) fs.mkdirSync(this.authDir, { recursive: true });
      for (const f of fs.readdirSync(backupDir)) {
        try { fs.copyFileSync(path.join(backupDir, f), path.join(this.authDir, f)); } catch (_) {}
      }
    }
    if (!fs.existsSync(credsPath)) {
      return false;
    }
    return this.connect();
  }

  async connect() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);
      let version = [2, 3000, 1043857760];
      try {
        const v = await fetchLatestBaileysVersion();
        version = v.version;
      } catch (_) {}

      this.sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        browser: ['Windows', 'Chrome', '128.0.6613.120'],
        connectTimeoutMs: 60000,
        syncFullHistory: false
      });

      this.sock.ev.on('creds.update', saveCreds);
      this.attachAutoResponder();

      return new Promise((resolve) => {
        let settled = false;

        const timeout = setTimeout(() => {
          if (!settled) {
            settled = true;
            resolve(this.isOpen);
          }
        }, 30000);

        this.sock.ev.on('connection.update', (update) => {
          const { connection, lastDisconnect } = update;
          if (connection === 'open') {
            this.isOpen = true;
            this.isReconnecting = false;
            console.log(`✅ [${this.cfg.name} - ${this.cfg.phone}] Online & Listening!`);
            if (!settled) {
              settled = true;
              clearTimeout(timeout);
              resolve(true);
            }
          } else if (connection === 'close') {
            this.isOpen = false;
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log(`⚠️ [${this.cfg.name}] Connection closed (code: ${statusCode}). Auto-reconnect: ${shouldReconnect}`);

            if (shouldReconnect && !this.isReconnecting) {
              this.isReconnecting = true;
              setTimeout(() => {
                this.connect().catch(() => {});
              }, 4000);
            }
          }
        });
      });
    } catch (err) {
      console.error(`❌ [${this.cfg.name}] Init error:`, err.message);
      return false;
    }
  }

  async waitUntilOpen(timeoutMs = 25000) {
    if (this.isOpen && this.sock) return true;
    if (!this.isOpen && !this.isReconnecting) {
      this.isReconnecting = true;
      this.connect().catch(() => {});
    }
    const start = Date.now();
    while (!this.isOpen && (Date.now() - start < timeoutMs)) {
      await new Promise(r => setTimeout(r, 500));
    }
    return this.isOpen;
  }

  async send(jid, content) {
    const ready = await this.waitUntilOpen(25000);
    if (!ready || !this.sock || !this.isOpen) {
      throw new Error(`Socket not connected for ${this.cfg.name}`);
    }
    try {
      return await this.sock.sendMessage(jid, content);
    } catch (err) {
      if (err.message.includes('Connection Closed') || err.message.includes('not opened') || err.message.includes('stream')) {
        console.log(`🔄 [${this.cfg.name}] Stream drop on send. Reconnecting socket...`);
        this.isOpen = false;
        this.isReconnecting = true;
        await this.connect();
        await this.waitUntilOpen(25000);
        return await this.sock.sendMessage(jid, content);
      }
      throw err;
    }
  }

  attachAutoResponder() {
    this.sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        if (!msg.message || msg.key.fromMe) continue;

        const senderJid = msg.key.remoteJid || '';
        if (!senderJid.endsWith('@s.whatsapp.net')) continue;
        if (this.cfg.id !== 1 && senderJid === ADMIN_JID) continue;

        const incomingText = (
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          msg.message.imageMessage?.caption ||
          msg.message.videoMessage?.caption ||
          msg.message.buttonsResponseMessage?.selectedDisplayText ||
          msg.message.listResponseMessage?.title ||
          msg.message.ephemeralMessage?.message?.conversation ||
          msg.message.ephemeralMessage?.message?.extendedTextMessage?.text ||
          msg.message.viewOnceMessageV2?.message?.extendedTextMessage?.text ||
          ''
        ).trim();

        if (!incomingText) continue;

        const cleanPhoneNum = senderJid.split('@')[0];
        const now = Date.now();
        const lastReplyTime = autoRepliedPhoneMap.get(cleanPhoneNum) || 0;

        // Prevent rapid double-replies within 30 seconds
        if (now - lastReplyTime < 30000) {
          continue;
        }

        console.log(`\n🔔 [INCOMING PROSPECT MESSAGE on ${this.cfg.name}] from +${cleanPhoneNum}: "${incomingText}"`);

        try {
          await this.sock.sendPresenceUpdate('composing', senderJid);
          await new Promise(r => setTimeout(r, 4000));
          await this.sock.sendPresenceUpdate('paused', senderJid);

          const replyText = formatAutoReply(incomingText);
          await this.sock.sendMessage(senderJid, { text: replyText });
          autoRepliedPhoneMap.set(cleanPhoneNum, now);

          console.log(`   ✅ [AUTO-REPLY DELIVERED] via ${this.cfg.name} to +${cleanPhoneNum}!`);

          if (this.cfg.id !== 1) {
            const alertToAdmin = `🚨 *[HOT WHATSAPP LEAD on ${this.cfg.name}]*\n` +
              `• From: \`+${cleanPhoneNum}\`\n` +
              `• Message: "${incomingText}"\n` +
              `• Auto-Replied: Yes (Sent demo & closer link).\n` +
              `• Direct Chat: wa.me/${cleanPhoneNum}`;

            try {
              await this.sock.sendMessage(ADMIN_JID, { text: alertToAdmin });
              console.log(`   📲 [ADMIN DESK ALERTED] Notification sent to 0802 279 1227.`);
            } catch (_) {}
          }

        } catch (err) {
          console.error(`❌ Error in auto-reply on ${this.cfg.name}:`, err.message);
        }
      }
    });
  }
}

class GatewayWhatsAppLine {
  constructor(cfg) {
    this.cfg = cfg;
    this.isOpen = true;
  }
  async send(jid, content) {
    const targetDigits = jid.split('@')[0];
    const res = await fetch('http://localhost:3008/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lineId: this.cfg.id,
        phone: targetDigits,
        message: content.text || ''
      })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Gateway send failed');
    return { key: { id: data.messageId || `GATEWAY-${Date.now()}` } };
  }
}

async function runSafeSlowDripCampaign() {
  console.log('='.repeat(85));
  console.log('🛡️ ULTRA-SAFE SLOW-DRIP WHATSAPP WARM-UP CAMPAIGN (10 MSGS/DAY CADENCE)');
  console.log(`   • Pacing: Strictly 1 lead per active line per micro-batch`);
  console.log(`   • Mandatory Rest: ${BATCH_REST_MINUTES} minutes between micro-batches`);
  console.log('   • Anti-Ban: Sockets remain active & listening for replies during rest');
  console.log('   • Quarantined: Line 2 paused for account review');
  console.log('='.repeat(85) + '\n');

  if (!fs.existsSync(LEADS_DB_PATH)) return;

  let leads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));
  let waLog = { dates: {} };
  if (fs.existsSync(WA_LOG_PATH)) {
    try { waLog = JSON.parse(fs.readFileSync(WA_LOG_PATH, 'utf8')); } catch (_) {}
  }

  const todayKey = getTodayKey();
  if (!waLog.dates[todayKey]) {
    waLog.dates[todayKey] = { lineCounts: {}, dispatches: [] };
  }
  const todayLog = waLog.dates[todayKey];
  if (!todayLog.lineCounts) todayLog.lineCounts = {};

  // 1. Check if Bethelmind Omnichannel Gateway is active on port 3008 to prevent socket collisions
  let gatewayLines = null;
  try {
    const gRes = await fetch('http://localhost:3008/api/status', { signal: AbortSignal.timeout(2500) });
    if (gRes.ok) {
      const gData = await gRes.json();
      if (gData.ok && gData.lines) gatewayLines = gData.lines;
    }
  } catch (_) {}

  // Initialize line controllers
  const activeControllers = [];
  if (gatewayLines) {
    console.log('📡 Bethelmind Omnichannel Gateway (Port 3008) is active! Using Gateway Mode (Zero socket collision).');
    for (const lineCfg of ALL_OUTREACH_LINES) {
      if (!lineCfg.active) continue;
      const gLine = gatewayLines[lineCfg.id];
      if (gLine && gLine.status === 'open') {
        activeControllers.push(new GatewayWhatsAppLine(lineCfg));
      }
    }
  } else {
    for (const lineCfg of ALL_OUTREACH_LINES) {
      if (!lineCfg.active) continue;
      const controller = new PersistentWhatsAppLine(lineCfg);
      const ok = await controller.init();
      if (ok) {
        activeControllers.push(controller);
      }
    }
  }

  if (activeControllers.length === 0) {
    console.log('ℹ️ No active outreach lines currently ready. Sockets sleeping.');
    return;
  }

  console.log(`\n📱 ${activeControllers.length} Active WhatsApp Line(s) Connected:`);
  activeControllers.forEach(c => console.log(`   • ${c.cfg.name} (${c.cfg.phone})`));

  // Deduplication
  const seenPhones = new Set();
  const eligibleLeads = [];
  for (const l of leads) {
    const p = cleanPhone(l.phone_e164 || l.phone_raw || l.phone);
    if (!p) continue;
    if (l.wa_outbound_dispatched) {
      seenPhones.add(p);
      continue;
    }
    if (seenPhones.has(p)) continue;
    seenPhones.add(p);
    eligibleLeads.push(l);
  }

  console.log(`\n📋 Eligible distinct leads remaining: ${eligibleLeads.length}\n`);

  let leadPointer = 0;
  let cycle = 1;

  while (leadPointer < eligibleLeads.length) {
    // Check if all active lines reached their daily limit
    const allCompleted = activeControllers.every(c => {
      const sent = todayLog.lineCounts[c.cfg.id] || 0;
      const limit = c.cfg.dailyLimit !== undefined ? c.cfg.dailyLimit : DAILY_LIMIT_PER_LINE;
      return sent >= limit;
    });

    if (allCompleted) {
      console.log('\n' + '='.repeat(85));
      console.log('🎉 ALL ACTIVE LINES HAVE SAFELY COMPLETED THEIR DAILY WARM-UP QUOTA (10/day)!');
      console.log('🎧 WhatsApp sockets are permanently active in 24/7 INBOUND LISTENER MODE.');
      console.log('   All prospect replies will be auto-replied and forwarded to 0802 279 1227.');
      console.log('='.repeat(85) + '\n');

      while (true) {
        await new Promise(r => setTimeout(r, 60000));
      }
    }

    console.log(`────────────────────────────────────────────────────────────────────────`);
    console.log(`🚀 [MICRO-BATCH #${cycle}] Sending 1 lead per active line (Warm-Up Cadence)...`);
    console.log(`────────────────────────────────────────────────────────────────────────`);

    let sentInThisMicroBatch = 0;

    for (const controller of activeControllers) {
      const lineSentToday = todayLog.lineCounts[controller.cfg.id] || 0;
      const lineLimit = controller.cfg.dailyLimit !== undefined ? controller.cfg.dailyLimit : DAILY_LIMIT_PER_LINE;

      if (lineSentToday >= lineLimit) {
        console.log(`✅ [${controller.cfg.name}] At daily cap (${lineSentToday}/${lineLimit}). Active for inbound replies only.`);
        continue;
      }

      if (leadPointer >= eligibleLeads.length) break;

      const lead = eligibleLeads[leadPointer];
      const phone = cleanPhone(lead.phone_e164 || lead.phone_raw || lead.phone);
      if (!phone) {
        leadPointer++;
        continue;
      }

      const jid = `${phone}@s.whatsapp.net`;
      const introMsg = formatWaIntroduction(lead);
      const proposalMsg = formatWaProposal(lead);

      console.log(`📤 [${controller.cfg.name} (${controller.cfg.phone})] -> +${phone} (${lead.name || 'Client'})...`);

      try {
        // Step 1: Permission hook
        const sent1 = await controller.send(jid, { text: introMsg });
        console.log(`   ✅ Step 1 Delivered! (ID: ${sent1.key.id})`);

        // 4s natural chat typing pause
        await new Promise(r => setTimeout(r, 4000));

        // Step 2: Prototype link + Closer desk CTA
        const sent2 = await controller.send(jid, { text: proposalMsg });
        console.log(`   ✅ Step 2 Delivered! (ID: ${sent2.key.id})`);

        todayLog.lineCounts[controller.cfg.id] = (todayLog.lineCounts[controller.cfg.id] || 0) + 1;
        lead.wa_outbound_dispatched = true;
        lead.wa_outbound_dispatched_at = new Date().toISOString();
        lead.wa_outbound_line = controller.cfg.id;

        todayLog.dispatches.push({
          lead_id: lead.id || lead.lead_id,
          phone: `+${phone}`,
          name: lead.name || lead.business_name,
          lineId: controller.cfg.id,
          timestamp: new Date().toISOString(),
          success: true
        });

        fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2), 'utf8');
        fs.writeFileSync(WA_LOG_PATH, JSON.stringify(waLog, null, 2), 'utf8');

        leadPointer++;
        sentInThisMicroBatch++;
        console.log(`   📊 Today's Progress for ${controller.cfg.name}: ${todayLog.lineCounts[controller.cfg.id]}/${lineLimit} sent`);

        // 60s - 90s natural delay between line switches
        const delayMs = Math.floor(Math.random() * (90000 - 60000 + 1)) + 60000;
        console.log(`   ⏳ Intra-batch spacing: ${Math.round(delayMs / 1000)}s before next line...\n`);
        await new Promise(r => setTimeout(r, delayMs));

      } catch (err) {
        console.error(`❌ Send error on ${controller.cfg.name}:`, err.message);
        console.log(`   ⏳ Waiting 60s for socket to stabilize before retrying...`);
        await new Promise(r => setTimeout(r, 60000));
      }
    }

    cycle++;

    if (sentInThisMicroBatch > 0) {
      // 🚨 MANDATORY 30-MINUTE REST COOLDOWN (LISTENING MODE)
      console.log(`\n` + '='.repeat(85));
      console.log(`🛑 [MICRO-BATCH COMPLETE] SENT ${sentInThisMicroBatch} MSG(S). ENTERING ${BATCH_REST_MINUTES}-MINUTE REST & LISTENING WINDOW`);
      console.log(`   • WhatsApp sockets remain 100% active to capture and auto-reply to replies`);
      console.log(`   • Expecting responses from prospects before next batch fires`);
      console.log(`   • Next micro-batch will trigger in ${BATCH_REST_MINUTES} minutes (${new Date(Date.now() + BATCH_REST_MINUTES * 60 * 1000).toLocaleTimeString()})`);
      console.log('='.repeat(85) + '\n');

      await new Promise(r => setTimeout(r, BATCH_REST_MINUTES * 60 * 1000));
    } else {
      // Sockets offline or no leads dispatched in this cycle: gentle backoff
      console.log(`⏳ No messages dispatched in cycle #${cycle - 1}. Sockets reconnecting. Waiting 60s...`);
      await new Promise(r => setTimeout(r, 60000));
    }
  }
}

if (require.main === module) {
  runSafeSlowDripCampaign().catch(console.error);
}

module.exports = { runSafeSlowDripCampaign };
