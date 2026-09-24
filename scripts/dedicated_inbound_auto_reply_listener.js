/**
 * @file scripts/dedicated_inbound_auto_reply_listener.js
 * 
 * 🎧 24/7 DEDICATED INBOUND WHATSAPP SALES CLOSER & AUTO-REPLY LISTENER
 * 
 * Bethelmind Analytics Lagos Desk
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
  console.log('   Bethelmind Analytics Lagos Desk');
  console.log('='.repeat(80) + '\n');

  for (const line of LISTENER_LINES) {
    const worker = new AutoReplyWorker(line);
    worker.start();
    await new Promise(r => setTimeout(r, 2000));
  }
}

main().catch(console.error);
