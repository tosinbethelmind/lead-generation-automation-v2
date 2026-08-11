/**
 * ============================================================
 *  UNIFIED WHATSAPP COMMAND CENTER
 *  Bethelmind Analytics — Multi-Channel Control Hub
 * ============================================================
 *  This service bridges ALL inbound channels to your WhatsApp:
 *    • Email inquiries  (via IMAP polling)
 *    • Web contact form (via POST /web-inquiry)
 *    • SMS/other        (via POST /sms-inquiry)
 *
 *  How approvals work:
 *    1. Lead sends email/fills form/sends SMS
 *    2. AI drafts a personalized reply
 *    3. YOU get a WhatsApp alert on your phone with the draft
 *    4. You reply: APPROVE EM-APPR-001    → email sent
 *                  APPROVE WEB-APPR-002   → lead gets email/SMS
 *                  REJECT EM-APPR-001     → ticket cancelled
 *                  APPROVE EM-APPR-001 [custom text]  → custom reply sent
 *
 *  Runs on port 3008 (separate from Baileys on 3007)
 *  Requires Baileys service (whatsapp_baileys.js) to be running.
 * ============================================================
 */

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Optional: imap + mailparser for email inbox polling (install with: npm install imap mailparser)
let Imap = null;
let simpleParser = null;
try { Imap = require('imap'); } catch (_) {}
try { simpleParser = require('mailparser').simpleParser; } catch (_) {}


const app = express();
app.use(express.json());
app.use(cors());

// ─── CONFIG (edit these values) ──────────────────────────────
const CONFIG = {
  // Your admin WhatsApp phone number (will receive all approval alerts)
  adminWhatsAppPhone: process.env.ADMIN_WA_PHONE || '2348022791227', // ← REPLACE with your number

  // Baileys service URL
  baileysUrl: process.env.BAILEYS_URL || 'http://localhost:3007',

  // Email reply sender config (Nodemailer SMTP)
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',  // ← your business Gmail/SMTP email
        pass: process.env.SMTP_PASS || ''   // ← App password (not your login password)
      }
    },
    fromName:    process.env.EMAIL_FROM_NAME || 'Bethelmind Analytics',
    fromAddress: process.env.SMTP_USER || ''
  },

  // IMAP email polling config (to detect incoming emails)
  imap: {
    user:     process.env.IMAP_USER     || '',   // ← same Gmail
    password: process.env.IMAP_PASS     || '',   // ← App password
    host:     process.env.IMAP_HOST     || 'imap.gmail.com',
    port:     parseInt(process.env.IMAP_PORT || '993'),
    tls:      true,
    tlsOptions: { rejectUnauthorized: false },
    pollIntervalMs: 30000  // Check inbox every 30 seconds
  }
};
// ─────────────────────────────────────────────────────────────

// In-memory unified ticket queue
const unifiedQueue = [];
let ticketCounter = 1000;

function generateTicketId(prefix) {
  return `${prefix}-APPR-${ticketCounter++}`;
}

// ─── AI DRAFT GENERATOR ──────────────────────────────────────
function generateAiDraft(channel, senderName, senderEmail, question) {
  const lq = (question || '').toLowerCase();

  if (lq.includes('price') || lq.includes('cost') || lq.includes('how much') || lq.includes('plan') || lq.includes('fee')) {
    return `Hello ${senderName}! 👋 Thank you for reaching out to Bethelmind Analytics.\n\nOur B2B Website Launch Package is priced at ₦185,000 — this includes a fully custom business portal with Paystack card payment & Moniepoint bank transfer integration, all set up within 24 hours.\n\nWould you like me to send you a live preview link for your business? Just reply and we'll get it ready!`;
  }
  if (lq.includes('preview') || lq.includes('demo') || lq.includes('sample') || lq.includes('website') || lq.includes('link')) {
    return `Hello ${senderName}! 🌐 Great news — we can generate a live preview of your business website right away!\n\nVisit: https://www.bethelmindanalytics.com/ to see a sample portal.\n\nReply "CLAIM" when you are ready to launch your own site. Setup takes under 24 hours!`;
  }
  if (lq.includes('claim') || lq.includes('buy') || lq.includes('pay') || lq.includes('start') || lq.includes('order')) {
    return `Excellent! 🚀 To claim your site, choose your payment option:\n\n1️⃣ Bank Transfer (Moniepoint): Account details will be sent to you.\n2️⃣ Paystack Card Payment: https://www.bethelmindanalytics.com/claim\n\nOnce payment is confirmed, your domain and hosting will be configured within 24 hours!`;
  }
  if (lq.includes('support') || lq.includes('help') || lq.includes('issue') || lq.includes('problem')) {
    return `Hello ${senderName}! Thank you for contacting Bethelmind Analytics support.\n\nWe've received your message and our team will reach out to you shortly. For urgent matters, you can also WhatsApp us directly.\n\nWe're committed to resolving your issue as quickly as possible. 🙏`;
  }

  // Generic response
  return `Hello ${senderName}! 👋 Thank you for reaching out to Bethelmind Analytics.\n\nWe've received your message: "${question.substring(0, 80)}${question.length > 80 ? '...' : ''}"\n\nA member of our team will get back to you within the hour. In the meantime, visit our website to learn more about our B2B website launch packages.\n\nBest regards,\nBethelmind Analytics Team`;
}

// ─── SEND WHATSAPP ALERT TO ADMIN ────────────────────────────
async function sendAdminWhatsAppAlert(ticket) {
  const channelEmoji = { EMAIL: '📧', WEB: '🌐', SMS: '📲', WHATSAPP: '📱' };
  const emoji = channelEmoji[ticket.channel] || '📩';

  const alertText =
`${emoji} *NEW ${ticket.channel} INQUIRY — ACTION REQUIRED*
━━━━━━━━━━━━━━━━━━━━━━
*Ticket:*  ${ticket.id}
*From:*    ${ticket.senderName} (${ticket.senderEmail || ticket.senderPhone || 'N/A'})
*Message:* "${ticket.incomingMessage.substring(0, 120)}${ticket.incomingMessage.length > 120 ? '...' : ''}"
━━━━━━━━━━━━━━━━━━━━━━
🤖 *AI Draft Reply:*
"${ticket.proposedReply.substring(0, 200)}${ticket.proposedReply.length > 200 ? '...' : ''}"
━━━━━━━━━━━━━━━━━━━━━━
⚡ *QUICK REPLIES:*
Reply *1* -> Approve & Send
Reply *2* -> Reject
Reply *1 <custom message>* -> Edit & Send
_(Or text APPROVE ${ticket.id})_`;

  try {
    const response = await fetch(`${CONFIG.baileysUrl}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: CONFIG.adminWhatsAppPhone,
        message: alertText
      }),
      signal: AbortSignal.timeout(8000)
    });

    if (response.ok) {
      console.log(`✅ [Command Center] WhatsApp alert sent to admin for ticket ${ticket.id}`);
    } else {
      const err = await response.text();
      console.warn(`⚠️  [Command Center] WhatsApp alert failed for ${ticket.id}: ${err}`);
    }
  } catch (err) {
    console.error(`❌ [Command Center] Could not reach Baileys service: ${err.message}`);
  }
}

// ─── SEND EMAIL REPLY ─────────────────────────────────────────
async function sendEmailReply(ticket, replyText) {
  if (!CONFIG.email.smtp.auth.user || !CONFIG.email.smtp.auth.pass) {
    console.warn('[Command Center] SMTP not configured — email reply skipped.');
    return false;
  }

  const transporter = nodemailer.createTransport(CONFIG.email.smtp);
  try {
    await transporter.sendMail({
      from: `"${CONFIG.email.fromName}" <${CONFIG.email.fromAddress}>`,
      to: ticket.senderEmail,
      subject: `Re: ${ticket.originalSubject || 'Your Inquiry — Bethelmind Analytics'}`,
      text: replyText,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0f172a;padding:20px;border-radius:8px 8px 0 0;">
          <h2 style="color:#38bdf8;margin:0;">Bethelmind Analytics</h2>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e2e8f0;">
          ${replyText.replace(/\n/g, '<br>')}
        </div>
        <div style="background:#f8fafc;padding:12px;border-radius:0 0 8px 8px;font-size:0.8rem;color:#64748b;">
          Bethelmind Analytics | B2B Lead Generation & Website Launch Platform
        </div>
      </div>`
    });
    console.log(`📧 [Command Center] Email reply sent to ${ticket.senderEmail} (Ticket: ${ticket.id})`);
    return true;
  } catch (err) {
    console.error(`❌ [Command Center] Email send error: ${err.message}`);
    return false;
  }
}

// ─── CREATE & QUEUE TICKET ────────────────────────────────────
async function createAndQueueTicket({ channel, senderName, senderEmail, senderPhone, subject, message }) {
  const prefix = channel === 'EMAIL' ? 'EM' : channel === 'WEB' ? 'WEB' : channel === 'SMS' ? 'SMS' : 'GEN';
  const ticketId = generateTicketId(prefix);
  const aiDraft = generateAiDraft(channel, senderName, senderEmail || senderPhone, message);

  // Option 3: Calculate Lead Heat & Intent Score
  let calculateMessageHeatScore, syncRecordToCrm;
  try {
    ({ calculateMessageHeatScore } = require('../src/lib/leadHeatScorer'));
    ({ syncRecordToCrm } = require('../src/lib/crmPipelineSync'));
  } catch (_) {
    calculateMessageHeatScore = function(message, contact, channel = 'WHATSAPP') {
      const text = (message || '').toLowerCase();
      let score = 65;
      let badge = '🔥 HOT LEAD (65/100)';
      if (text.includes('price') || text.includes('cost') || text.includes('how much') || text.includes('package')) {
        score = 85;
        badge = '🔥 HOT LEAD (85/100)';
      }
      return { score, heatCategory: 'HOT', badge, estimatedValueNgn: 185000, buyingUrgency: 'HIGH' };
    };
    syncRecordToCrm = async function() { return true; };
  }

  const heat = calculateMessageHeatScore(message, senderPhone || senderEmail, channel);

  const ticket = {
    id: ticketId,
    channel,
    senderName:      senderName   || 'Unknown',
    senderEmail:     senderEmail  || '',
    senderPhone:     senderPhone  || '',
    originalSubject: subject      || 'Inquiry',
    incomingMessage: message,
    proposedReply:   aiDraft,
    heatCategory:    heat.heatCategory,
    heatScore:       heat.score,
    status:          'PENDING_HUMAN_APPROVAL',
    createdAt:       new Date().toISOString()
  };

  unifiedQueue.unshift(ticket);

  // Option 4: Sync to CRM Pipeline Storage
  syncRecordToCrm({
    ticketId,
    channel: channel,
    leadName: senderName || 'Inbound Lead',
    contact: senderEmail || senderPhone || 'N/A',
    messageText: message,
    aiDraftReply: aiDraft,
    status: 'PENDING_APPROVAL',
    stage: 'NEW_INQUIRY',
    heatCategory: heat.heatCategory,
    heatScore: heat.score,
    estimatedValueNgn: heat.estimatedValueNgn
  }).catch(() => {});

  console.log(`\n${'='.repeat(58)}`);
  console.log(`🚨 [UNIFIED COMMAND CENTER] NEW ${channel} TICKET: ${ticketId}`);
  console.log(`   Badge:   ${heat.badge}`);
  console.log(`${'='.repeat(58)}`);
  console.log(`From:    ${senderName} <${senderEmail || senderPhone}>`);
  console.log(`Message: "${message.substring(0, 100)}"`);
  console.log(`Draft:   "${aiDraft.substring(0, 100)}..."`);
  console.log(`Action:  Reply 1 to Approve | Reply 2 to Reject`);
  console.log(`${'='.repeat(58)}\n`);

  // Push alert to admin's WhatsApp
  await sendAdminWhatsAppAlert({ ...ticket, heatBadge: heat.badge, estValue: heat.estimatedValueNgn });

  // Sync ticket to Next.js Central Approval Queue API
  try {
    const nextAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
    const actionType = channel === 'EMAIL' ? 'OTHER' : channel === 'WEB' ? 'OTHER' : 'OTHER';
    fetch(`${nextAppUrl}/api/admin/approvals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        actionType: 'OTHER',
        title: `${channel} Inquiry from ${senderName}`,
        summary: `Message: "${message.substring(0, 100)}...". Proposed AI Reply: "${aiDraft.substring(0, 100)}..."`,
        proposedData: { ticketId, channel, senderName, senderEmail, senderPhone, replyText: aiDraft }
      }),
      signal: AbortSignal.timeout(3000)
    }).catch(() => {
      // Fallback to port 3000 if 3006 fails
      fetch('http://localhost:3000/api/admin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          actionType: 'OTHER',
          title: `${channel} Inquiry from ${senderName}`,
          summary: `Message: "${message.substring(0, 100)}...". Proposed AI Reply: "${aiDraft.substring(0, 100)}..."`,
          proposedData: { ticketId, channel, senderName, senderEmail, senderPhone, replyText: aiDraft }
        })
      }).catch(() => {});
    });
  } catch (_) {}

  return ticket;
}

// ─── IMAP EMAIL POLLER ────────────────────────────────────────
let seenEmailIds = new Set();

function pollEmailInbox() {
  if (!Imap || !simpleParser) {
    return; // imap/mailparser not installed yet — run: npm install imap mailparser
  }
  if (!CONFIG.imap.user || !CONFIG.imap.password) {
    console.log('[Email Poller] IMAP credentials not set — email polling disabled.');
    return;
  }

  const imap = new Imap({
    user:       CONFIG.imap.user,
    password:   CONFIG.imap.password,
    host:       CONFIG.imap.host,
    port:       CONFIG.imap.port,
    tls:        CONFIG.imap.tls,
    tlsOptions: CONFIG.imap.tlsOptions
  });

  imap.once('ready', () => {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) { imap.end(); return; }

      // Search for UNSEEN emails from the last 24 hours
      const since = new Date();
      since.setDate(since.getDate() - 1);

      imap.search(['UNSEEN', ['SINCE', since]], (err, results) => {
        if (err || !results || results.length === 0) { imap.end(); return; }

        const newResults = results.filter(uid => !seenEmailIds.has(uid));
        if (newResults.length === 0) { imap.end(); return; }

        console.log(`[Email Poller] Found ${newResults.length} new unread email(s).`);

        const f = imap.fetch(newResults, { bodies: '' });
        f.on('message', (msg, seqno) => {
          msg.on('body', (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) return;

              const uid = newResults[seqno - 1] || seqno;
              seenEmailIds.add(uid);

              const from = parsed.from?.value?.[0] || {};
              const senderName  = from.name  || 'Unknown Sender';
              const senderEmail = from.address || '';
              const subject     = parsed.subject || 'No Subject';
              const body        = (parsed.text || '').substring(0, 500).trim();

              if (!senderEmail || senderEmail.includes('noreply') || senderEmail.includes('donotreply')) return;

              await createAndQueueTicket({
                channel: 'EMAIL',
                senderName,
                senderEmail,
                subject,
                message: body || subject
              });
            });
          });
        });

        f.once('end', () => imap.end());
      });
    });
  });

  imap.once('error', (err) => {
    console.warn(`[Email Poller] IMAP error: ${err.message}`);
  });

  imap.connect();
}

// Start periodic email polling
setInterval(pollEmailInbox, CONFIG.imap.pollIntervalMs);
setTimeout(pollEmailInbox, 5000); // First poll after 5s

// ─── REST ENDPOINTS ───────────────────────────────────────────

// POST /web-inquiry — Web contact form submissions
app.post('/web-inquiry', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message field' });

    const ticket = await createAndQueueTicket({
      channel:     'WEB',
      senderName:  name    || 'Website Visitor',
      senderEmail: email   || '',
      senderPhone: phone   || '',
      subject:     subject || 'Website Contact Form',
      message:     message
    });

    return res.json({ success: true, ticketId: ticket.id, status: 'PENDING_HUMAN_APPROVAL' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /sms-inquiry — SMS/other channel submissions
app.post('/sms-inquiry', async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    if (!message || !phone) return res.status(400).json({ error: 'Missing phone or message' });

    const ticket = await createAndQueueTicket({
      channel:     'SMS',
      senderName:  name  || 'SMS Lead',
      senderPhone: phone,
      message:     message
    });

    return res.json({ success: true, ticketId: ticket.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /email-inquiry — Manual email routing (for webhook/forward)
app.post('/email-inquiry', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!message || !email) return res.status(400).json({ error: 'Missing email or message' });

    const ticket = await createAndQueueTicket({
      channel:     'EMAIL',
      senderName:  name    || 'Email Lead',
      senderEmail: email,
      subject:     subject || 'Email Inquiry',
      message:     message
    });

    return res.json({ success: true, ticketId: ticket.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /approve — Approve a ticket (called by Baileys WhatsApp command handler)
app.post('/approve', async (req, res) => {
  try {
    const { ticketId, customReply } = req.body;
    if (!ticketId) return res.status(400).json({ error: 'Missing ticketId' });

    const ticket = unifiedQueue.find(t => t.id === ticketId);
    if (!ticket) return res.status(404).json({ error: `Ticket ${ticketId} not found` });
    if (ticket.status !== 'PENDING_HUMAN_APPROVAL') {
      return res.status(400).json({ error: `Ticket already ${ticket.status}` });
    }

    const finalReply = (customReply && customReply.trim()) ? customReply.trim() : ticket.proposedReply;
    ticket.finalReply  = finalReply;
    ticket.status      = 'APPROVED';
    ticket.approvedAt  = new Date().toISOString();

    let deliveryResult = { sent: false, method: 'none' };

    // Deliver reply to appropriate channel
    if (ticket.channel === 'EMAIL' && ticket.senderEmail) {
      const sent = await sendEmailReply(ticket, finalReply);
      deliveryResult = { sent, method: 'email' };
    } else if (ticket.channel === 'WEB') {
      // Web inquiries: if email provided, reply by email; else log only
      if (ticket.senderEmail) {
        const sent = await sendEmailReply(ticket, finalReply);
        deliveryResult = { sent, method: 'email' };
      } else if (ticket.senderPhone) {
        // Could route to WhatsApp or SMS
        deliveryResult = { sent: false, method: 'phone_fallback', note: 'Manual follow-up required' };
      }
    } else if (ticket.channel === 'SMS' && ticket.senderPhone) {
      // Route back via WhatsApp if on WhatsApp, or log for manual SMS
      deliveryResult = { sent: false, method: 'manual_sms', note: 'Please send manual SMS/call to ' + ticket.senderPhone };
    }

    // Notify admin of successful dispatch via WhatsApp
    try {
      await fetch(`${CONFIG.baileysUrl}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: CONFIG.adminWhatsAppPhone,
          message: `✅ *TICKET APPROVED & DISPATCHED*\n\nTicket: ${ticket.id}\nChannel: ${ticket.channel}\nTo: ${ticket.senderEmail || ticket.senderPhone}\nMethod: ${deliveryResult.method}\n${deliveryResult.note ? `Note: ${deliveryResult.note}` : ''}`
        }),
        signal: AbortSignal.timeout(5000)
      });
    } catch (_) {}

    console.log(`✅ [Command Center] Ticket ${ticketId} APPROVED. Reply dispatched via ${deliveryResult.method}.`);
    return res.json({ success: true, ticket, deliveryResult });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /reject — Reject a ticket
app.post('/reject', (req, res) => {
  const { ticketId, reason } = req.body;
  if (!ticketId) return res.status(400).json({ error: 'Missing ticketId' });

  const ticket = unifiedQueue.find(t => t.id === ticketId);
  if (!ticket) return res.status(404).json({ error: `Ticket ${ticketId} not found` });

  ticket.status     = 'REJECTED';
  ticket.rejectReason = reason || 'Rejected by Admin';
  ticket.rejectedAt = new Date().toISOString();

  console.log(`❌ [Command Center] Ticket ${ticketId} REJECTED. Reason: ${ticket.rejectReason}`);
  return res.json({ success: true, ticket });
});

// GET /queue — View all pending tickets
app.get('/queue', (req, res) => {
  const { channel, status } = req.query;
  let tickets = unifiedQueue;
  if (channel) tickets = tickets.filter(t => t.channel === channel.toUpperCase());
  if (status)  tickets = tickets.filter(t => t.status  === status.toUpperCase());
  return res.json({ success: true, total: tickets.length, tickets });
});

// GET /health
app.get('/health', (req, res) => {
  return res.json({
    service: 'Unified WhatsApp Command Center',
    status:  'running',
    adminPhone: CONFIG.adminWhatsAppPhone,
    queueSize: unifiedQueue.length,
    pending: unifiedQueue.filter(t => t.status === 'PENDING_HUMAN_APPROVAL').length,
    emailPollingEnabled: !!(CONFIG.imap.user && CONFIG.imap.password),
    timestamp: new Date().toISOString()
  });
});

// ─── START SERVER ──────────────────────────────────────────────
const PORT = process.env.UNIFIED_COMMAND_PORT || 3008;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🌐 Unified WhatsApp Command Center — STARTED`);
  console.log(`${'='.repeat(60)}`);
  console.log(`  Port:          http://localhost:${PORT}`);
  console.log(`  Web Inquiries: POST http://localhost:${PORT}/web-inquiry`);
  console.log(`  Email Bridge:  POST http://localhost:${PORT}/email-inquiry`);
  console.log(`  SMS Bridge:    POST http://localhost:${PORT}/sms-inquiry`);
  console.log(`  Approve:       POST http://localhost:${PORT}/approve`);
  console.log(`  Queue:         GET  http://localhost:${PORT}/queue`);
  console.log(`  Admin Phone:   ${CONFIG.adminWhatsAppPhone}`);
  console.log(`  Baileys:       ${CONFIG.baileysUrl}`);
  console.log(`${'='.repeat(60)}\n`);
});
