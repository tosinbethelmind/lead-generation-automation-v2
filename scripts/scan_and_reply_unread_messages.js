/**
 * @file scripts/scan_and_reply_unread_messages.js
 * 
 * 🔍 SCAN & AUTO-REPLY TO ALL PENDING PROSPECT MESSAGES ACROSS ALL LINES
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const ADMIN_JID = '2348022791227@s.whatsapp.net';

const LINES = [
  { id: 1, name: 'Line 1 (Admin Desk)', dir: 'baileys_auth_line1', phone: '+234 802 279 1227', active: true },
  { id: 3, name: 'Line 3 (Outreach 2)', dir: 'baileys_auth_line3', phone: '+234 904 605 0469', active: true }
];

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

async function scanLine(line) {
  const authDir = path.join(LOCAL_DB, line.dir);
  if (!fs.existsSync(path.join(authDir, 'creds.json'))) {
    return;
  }

  console.log(`\n🔍 Checking ${line.name} (${line.phone})...`);

  try {
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
      browser: ['Windows', 'Chrome', '128.0.6613.120'],
      connectTimeoutMs: 25000,
      syncFullHistory: true
    });

    sock.ev.on('creds.update', saveCreds);

    await new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve();
      }, 15000);

      sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
          console.log(`   ✅ [${line.name}] Connected! Listening for incoming messages...`);
        } else if (connection === 'close') {
          const code = lastDisconnect?.error?.output?.statusCode;
          console.log(`   ⚠️ [${line.name}] Connection closed (code: ${code}).`);
          clearTimeout(timer);
          resolve();
        }
      });

      sock.ev.on('messages.upsert', async ({ messages, type }) => {
        for (const msg of messages) {
          if (!msg.message || msg.key.fromMe) continue;
          const senderJid = msg.key.remoteJid || '';
          if (!senderJid.endsWith('@s.whatsapp.net')) continue;
          if (line.id !== 1 && senderJid === ADMIN_JID) continue;

          const text = extractMessageText(msg);
          if (!text.trim()) continue;

          const phone = senderJid.split('@')[0];
          console.log(`\n   📩 [FOUND UNANSWERED MESSAGE on ${line.name}] from +${phone}: "${text}"`);

          try {
            await sock.sendPresenceUpdate('composing', senderJid);
            await new Promise(r => setTimeout(r, 2000));
            await sock.sendPresenceUpdate('paused', senderJid);

            const reply = formatNigerianAutoReply(text);
            await sock.sendMessage(senderJid, { text: reply });
            console.log(`   🚀 [REPLIED TO +${phone}] via ${line.name}!`);

            // Alert admin if on outreach line
            if (line.id !== 1) {
              const alertMsg = `🚨 *[HOT INBOUND LEAD on ${line.name}]*\n` +
                `• From: \`+${phone}\`\n` +
                `• Message: "${text}"\n` +
                `• Replied: Yes (Auto-closer sent).\n` +
                `• Direct link: wa.me/${phone}`;
              try {
                await sock.sendMessage(ADMIN_JID, { text: alertMsg });
              } catch (_) {}
            }
          } catch (err) {
            console.error(`   ❌ Failed to reply to +${phone}:`, err.message);
          }
        }
      });
    });

    try { sock.end(); } catch (_) {}
  } catch (err) {
    console.error(`   ❌ Error on ${line.name}:`, err.message);
  }
}

async function main() {
  console.log('='.repeat(75));
  console.log('🔎 SCANNING FOR UNANSWERED MESSAGES ACROSS ALL 5 WHATSAPP LINES...');
  console.log('='.repeat(75));

  for (const line of LINES) {
    await scanLine(line);
  }

  console.log('\n✅ Scan complete!');
  process.exit(0);
}

main().catch(console.error);
