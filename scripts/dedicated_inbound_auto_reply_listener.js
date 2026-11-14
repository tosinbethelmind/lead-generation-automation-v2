/**
 * @file scripts/dedicated_inbound_auto_reply_listener.js
 * 
 * 🎧 24/7 DEDICATED INBOUND WHATSAPP SALES CLOSER & AUTO-REPLY LISTENER
 * 
 * Bethelmind Digital Solutions
 * 
 * Listens 24/7 to all connected WhatsApp lines (Admin Desk + Outreach lines)
 * and delivers instantaneous, persuasive Nigerian closing sales replies to every inquiry!
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const ADMIN_JID = '2348022791227@s.whatsapp.net';

// Lines to listen to
const LISTENER_LINES = [
  { id: 1, name: 'Admin Closer Desk', dir: 'baileys_auth_line1', phone: '+234 802 279 1227' },
  { id: 3, name: 'Outreach Line 2', dir: 'baileys_auth_line3', phone: '+234 904 605 0469' },
  { id: 4, name: 'Outreach Line 3', dir: 'baileys_auth_line4', phone: '+234 814 160 9564' },
  { id: 2, name: 'Outreach Line 1', dir: 'baileys_auth_line2', phone: '+234 702 626 6946' }
];

const autoRepliedHistory = new Map();

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

function formatNigerianAutoReply(text) {
  const lower = (text || '').toLowerCase().trim();

  // 🏛️ 1. PILLAR 2: LUXURY REAL ESTATE & LASRERA CO-BROKERAGE INQUIRIES
  const isPillar2 = /\b(mandate|property|properties|listing|inspection|jim|co-brokerage|80\/20|lasrera|duplex|penthouse|mansion|detached|banana island|ikoyi|lekki|amen estate|victoria island|c of o|governor|title|diaspora|buyer|realtor|commission)\b/i.test(lower);
  if (isPillar2) {
    return `Good day Sir/Ma,
Thank you for contacting the *Bethelmind Corporate & Diaspora Property Desk* (CAC Certified: Reg 9912717).

Regarding your prime Lagos property / co-brokerage mandate:
1️⃣ *Buyer Mandate Allocation:* Our acquisition briefs (including Dr. Ademola Adeyemi & Family diaspora mandate and corporate executive allocations) are verified with liquid proof of funds for 48-hour closure.
2️⃣ *LASRERA 80/20 Commission Split:* You retain 80% of the agency commission; Bethelmind retains 20% origination fee.
3️⃣ *Digital Signing & Inspection:* Review our statutory Joint Inspection Memorandum (JIM) and execute e-signatures in 60 seconds on your smartphone:
👉 https://www.bethelmindanalytics.com/mandate

Our retained legal counsel coordinates physical walkthroughs and Alausa Lands Bureau title verification upon counter-signing.

To speak directly with the Principal Desk:
👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
  }

  // 🏢 2. PILLAR 1: PRICING INQUIRIES (SME AUTOMATION & DFY WEBSITES)
  if (/price|cost|how much|fee|pay|pricing|expensive|cheap|charges|amount/i.test(lower)) {
    return `Good day Sir/Ma! Thank you for asking about pricing for *Bethelmind Digital Solutions* (CAC Certified: Reg 9912717).

We operate a 100% ONE-TIME LIFETIME ASSET model with ₦0 MONTHLY SUBSCRIPTIONS FOREVER:

1️⃣ *Option 1: Starter Turnkey (100% One-Time Lifetime Ownership)* — *₦80,000* Flat
   *(Or ₦40,000 50% Milestone Deposit with ₦40,000 balance on live approval)*
   • Official Mobile Website + 24/7 AI WhatsApp Closer configured
   • Fake Alert Proof OPay/Moniepoint Bank Transfer Reconciliation
   • 1 Full Year Free Domain & Cloud Hosting Included
   • *₦0 Monthly Subscriptions Forever*

2️⃣ *Option 2: Full Turnkey Custom Domain Suite* — *₦150,000* Total
   *(50% Milestone Deposit: ₦75,000 to begin)*
   • Dedicated .com / .ng international custom domain
   • 3 official corporate staff emails
   • Complete sector calculator + WhatsApp speed-to-lead ledger
   • Google Search SEO ranking setup & full code ownership in 48 hours

Test drive the interactive prototype on your phone right now (₦0 Upfront):
👉 https://www.bethelmindanalytics.com

Which option fits your business better (Option 1 ₦80k / ₦40k deposit, or Option 2 ₦150k)?
Call or message our Head of Desk directly:
👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
  }

  // 🏢 3. POSITIVE INTEREST / DEMO / LINK
  if (/yes|send|ok|sure|show me|interested|demo|proceed|details|link|share|go ahead|tell me more|how does it work/i.test(lower)) {
    return `Thank you so much Sir/Ma! We are excited to show you.

Here is the live interactive prototype (test it directly on your mobile device, ₦0 Upfront):
👉 https://www.bethelmindanalytics.com

📌 *What to test when you open it:*
1. Try the instant sector calculator to see how fast it quotes.
2. Experience the sub-3s automated WhatsApp response that closes clients day and night without staff fatigue.

Would you like our technical team to schedule a quick 10-minute activation for your business today?
Connect directly with our Lagos Desk Head:
👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
  }

  // 🏢 4. WHO ARE YOU / CAC VERIFICATION / LOCATION
  if (/who|where|office|address|location|scam|real|legit|call|number/i.test(lower)) {
    return `Good afternoon Sir/Ma!

We are *Bethelmind Digital Solutions*, a CAC Certified Nigerian Enterprise (Reg: 9912717) based in Lagos, Nigeria.
• Head of Desk: Tosin Oyelakin
• Official Hotline / Direct WhatsApp: 0802 279 1227 (wa.me/2348022791227)
• Corporate Settlement: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
• Corporate Portal: https://www.bethelmindanalytics.com

We operate two specialized desks:
1. *Enterprise SME Automation:* High-conversion websites, 24/7 WhatsApp AI sales closers, and fake-alert-proof bank transfer reconcilers.
2. *Corporate & Diaspora Property Desk:* High-ticket luxury co-brokerage mandates and LASRERA 80/20 joint ventures.

You do NOT pay anything upfront to review your demo. Feel free to inspect our platform or call 0802 279 1227 to speak with Tosin directly.`;
  }

  // 🏢 5. GENERAL POLITE GREETING
  return `Good day Sir/Ma! Thank you for reaching out to *Bethelmind Digital Solutions* (CAC Reg: 9912717).

Our Principal Desk is reviewing your inquiry right now.

To help us route your request to the appropriate team:
• If inquiring about *SME Website, WhatsApp AI Closer, or Sector Tools*: Please share your business name or tap https://www.bethelmindanalytics.com
• If inquiring about *Prime Real Estate, Co-Brokerage Mandates, or Property Walkthroughs*: Please share property location or tap https://www.bethelmindanalytics.com/mandate

To speak directly with our Head of Desk for immediate attention:
👉 wa.me/2348022791227 (Tosin Oyelakin · 0802 279 1227).`;
}

class AutoReplyWorker {
  constructor(line) {
    this.line = line;
    this.sock = null;
    this.authDir = path.join(LOCAL_DB, line.dir);
    this.reconnecting = false;
  }

  async start() {
    if (!fs.existsSync(path.join(this.authDir, 'creds.json'))) {
      console.log(`ℹ️ [${this.line.name}] No creds.json found. Skipping.`);
      return;
    }

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
        syncFullHistory: true
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
          this.reconnecting = false;
          console.log(`✅ [${this.line.name} - ${this.line.phone}] 🟢 CONNECTED & LISTENING 24/7!`);
        } else if (connection === 'close') {
          const code = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = code !== DisconnectReason.loggedOut && code !== 401 && code !== 403;
          console.log(`⚠️ [${this.line.name}] Connection closed (code: ${code}). Reconnect: ${shouldReconnect}`);

          if (shouldReconnect && !this.reconnecting) {
            this.reconnecting = true;
            setTimeout(() => this.start(), 5000);
          }
        }
      });

      this.sock.ev.on('messages.upsert', async ({ messages, type }) => {
        for (const msg of messages) {
          if (!msg.message || msg.key.fromMe) continue;

          const senderJid = msg.key.remoteJid || '';
          if (!senderJid.endsWith('@s.whatsapp.net')) continue;
          if (this.line.id !== 1 && senderJid === ADMIN_JID) continue;

          const text = extractMessageText(msg);
          if (!text.trim()) continue;

          const phone = senderJid.split('@')[0];
          const now = Date.now();
          const lastTime = autoRepliedHistory.get(phone) || 0;

          // Prevent rapid double-replies within 30 seconds
          if (now - lastTime < 30000) continue;

          console.log(`\n🔔 [INCOMING LEAD on ${this.line.name}] from +${phone}: "${text}"`);

          try {
            await this.sock.sendPresenceUpdate('composing', senderJid);
            await new Promise(r => setTimeout(r, 2500));
            await this.sock.sendPresenceUpdate('paused', senderJid);

            const reply = formatNigerianAutoReply(text);
            await this.sock.sendMessage(senderJid, { text: reply });
            autoRepliedHistory.set(phone, now);

            console.log(`   🚀 [AUTO-CLOSER SENT] via ${this.line.name} to +${phone}!`);

            if (this.line.id !== 1) {
              const alertMsg = `🚨 *[HOT INBOUND LEAD on ${this.line.name}]*\n` +
                `• From: \`+${phone}\`\n` +
                `• Message: "${text}"\n` +
                `• Auto-Replied: Yes (Nigerian closer delivered).\n` +
                `• Chat: wa.me/${phone}`;

              try {
                await this.sock.sendMessage(ADMIN_JID, { text: alertMsg });
                console.log(`   📲 [ADMIN DESK ALERTED] Ping sent to 0802 279 1227.`);
              } catch (_) {}
            }
          } catch (err) {
            console.error(`   ❌ Send error on ${this.line.name}:`, err.message);
          }
        }
      });

    } catch (err) {
      console.error(`❌ Error starting ${this.line.name}:`, err.message);
    }
  }
}

async function main() {
  console.log('='.repeat(80));
  console.log('🎧 24/7 DEDICATED INBOUND WHATSAPP AUTO-RESPONDER & SALES CLOSER DESK');
  console.log('   Bethelmind Digital Solutions');
  console.log('='.repeat(80) + '\n');

  for (const line of LISTENER_LINES) {
    const worker = new AutoReplyWorker(line);
    worker.start();
    await new Promise(r => setTimeout(r, 2000));
  }
}

main().catch(console.error);
