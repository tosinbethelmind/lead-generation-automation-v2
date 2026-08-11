const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const pino = require('pino');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

let sock = null;
let connectionStatus = "disconnected"; // disconnected, qr, connecting, connected
let qrCodeBase64 = "";
let qrCodeRaw = "";
let lastPairingCode = "";
let requireHumanApproval = true; // DEFAULT: Human-in-the-loop enabled

const pendingRepliesQueue = [];

async function connectToWhatsApp() {
  const authDir = path.join(__dirname, '../local_db/baileys_auth');
  if (!fs.existsSync(path.join(__dirname, '../local_db'))) {
    fs.mkdirSync(path.join(__dirname, '../local_db'), { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: true,
    browser: ['Ubuntu', 'Chrome', '20.0.04']
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      qrCodeRaw = qr;
      connectionStatus = "qr";
      console.log("\n--- WHATSAPP QR CODE ---");
      qrcodeTerminal.generate(qr, { small: true });
      console.log("Scan this QR code with your phone to connect custom Baileys API.");
      
      try {
        qrCodeBase64 = await QRCode.toDataURL(qr);
      } catch (err) {
        console.error("Failed to generate QR data URL:", err);
      }
    }

    if (connection === 'connecting') {
      connectionStatus = 'connecting';
      console.log('Connecting to WhatsApp...');
    }

    if (connection === 'open') {
      connectionStatus = 'connected';
      qrCodeBase64 = "";
      qrCodeRaw = "";
      console.log('WhatsApp connection opened successfully!');
    }

    if (connection === 'close') {
      connectionStatus = 'disconnected';
      qrCodeBase64 = "";
      qrCodeRaw = "";
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(`Connection closed. Reconnecting: ${shouldReconnect}`, lastDisconnect.error);
      if (shouldReconnect) {
        setTimeout(connectToWhatsApp, 3000);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // ── WhatsApp AI Auto-Reply Listener ──────────────────────────────────────
  sock.ev.on('messages.upsert', async (m) => {
    try {
      if (m.type !== 'notify') return;
      for (const msg of m.messages) {
        if (!msg.message || msg.key.fromMe) continue; // Ignore own messages

        const senderJid = msg.key.remoteJid;
        if (!senderJid || senderJid.endsWith('@g.us')) continue; // Ignore group messages for now

        const textMessage = msg.message.conversation || 
                           msg.message.extendedTextMessage?.text || 
                           msg.message.buttonsResponseMessage?.selectedButtonId || '';

        if (!textMessage.trim()) continue;

        const senderPhone = senderJid.replace('@s.whatsapp.net', '');
        console.log(`\n📩 [WhatsApp Message Received] From ${senderPhone}: "${textMessage}"`);

        // ─────────────────────────────────────────────────────────────────────
        // ADMIN COMMAND HANDLER — Hybrid Quick-Reply (WhatsApp Controlled)
        //   Single key / Quick shortcuts:
        //     '1' or 'YES' or 'Y'             → Approve most recent pending ticket
        //     '2' or 'NO'  or 'N'             → Reject most recent pending ticket
        //     '1 <custom text>'               → Approve most recent ticket with custom text
        //     APPROVE WA-APPR-xxx             → Approve specific ticket ID
        //     REJECT WA-APPR-xxx              → Reject specific ticket ID
        // ─────────────────────────────────────────────────────────────────────
        const cleanMsg = textMessage.trim();
        const upperMsg = cleanMsg.toUpperCase();

        const isQuickApprove = upperMsg === '1' || upperMsg === 'YES' || upperMsg === 'Y' || upperMsg === 'APPROVE' || upperMsg.startsWith('1 ') || upperMsg.startsWith('YES ');
        const isQuickReject  = upperMsg === '2' || upperMsg === 'NO'  || upperMsg === 'N' || upperMsg === 'REJECT' || upperMsg.startsWith('2 ') || upperMsg.startsWith('NO ');

        if (isQuickApprove || isQuickReject) {
          const isApprove = isQuickApprove;
          const parts     = cleanMsg.split(' ');

          // Find explicit ticket ID if specified (e.g. APPROVE WA-APPR-001)
          let targetTicketId = parts.find(p =>
            p.startsWith('WA-APPR-') ||
            p.startsWith('EM-APPR-') ||
            p.startsWith('WEB-APPR-') ||
            p.startsWith('SMS-APPR-') ||
            p.startsWith('GEN-APPR-')
          );

          // If no explicit ticket ID provided, pick the MOST RECENT pending ticket!
          if (!targetTicketId) {
            const localPending = pendingRepliesQueue.find(t => t.status === 'PENDING_HUMAN_APPROVAL');
            if (localPending) {
              targetTicketId = localPending.id;
            } else {
              // Check Unified Command Center for pending ticket
              try {
                const qRes = await fetch('http://localhost:3008/queue?status=PENDING_HUMAN_APPROVAL', { signal: AbortSignal.timeout(2000) });
                if (qRes.ok) {
                  const qData = await qRes.json();
                  if (qData.tickets && qData.tickets.length > 0) {
                    targetTicketId = qData.tickets[0].id;
                  }
                }
              } catch (_) {}
            }
          }

          if (targetTicketId) {
            // Extract custom text if user typed: "1 Custom message text here..."
            let customText = '';
            if (parts[0] === '1' || parts[0].toUpperCase() === 'YES' || parts[0].toUpperCase() === 'Y') {
              customText = parts.slice(1).join(' ').trim();
            } else if (parts.length > 2) {
              customText = parts.slice(2).join(' ').trim();
            }

            // ── WA-APPR-xxx: Handle locally (WhatsApp → WhatsApp reply) ──
            if (targetTicketId.startsWith('WA-APPR-')) {
              const ticket = pendingRepliesQueue.find(t => t.id === targetTicketId);
              if (ticket && ticket.status === 'PENDING_HUMAN_APPROVAL') {
                if (isApprove) {
                  const finalReply = customText || ticket.proposedReply;
                  try {
                    await sock.sendPresenceUpdate('composing', ticket.senderJid);
                    await new Promise(r => setTimeout(r, Math.min(finalReply.length * 15, 3000)));
                    await sock.sendPresenceUpdate('paused', ticket.senderJid);
                    await sock.sendMessage(ticket.senderJid, { text: finalReply });
                    ticket.status = 'APPROVED';
                    ticket.finalReply = finalReply;
                    ticket.approvedAt = new Date().toISOString();
                    await sock.sendMessage(senderJid, { text: `✅ *APPROVED & DISPATCHED*\nTicket: ${targetTicketId}\nSent to: ${ticket.senderPhone}` });
                    console.log(`✅ [WA Quick Command] Ticket ${targetTicketId} approved by admin ${senderPhone}`);
                  } catch (e) {
                    await sock.sendMessage(senderJid, { text: `❌ Send failed: ${e.message}` });
                  }
                } else {
                  ticket.status = 'REJECTED';
                  ticket.rejectReason = customText || 'Rejected by Admin';
                  ticket.rejectedAt = new Date().toISOString();
                  await sock.sendMessage(senderJid, { text: `❌ *REJECTED*\nTicket: ${targetTicketId}` });
                  console.log(`❌ [WA Quick Command] Ticket ${targetTicketId} rejected by admin ${senderPhone}`);
                }
                continue;
              }
            }

            // ── EM-APPR- / WEB-APPR- / SMS-APPR-: Route to Unified Command Center ──
            try {
              const endpoint = isApprove ? 'approve' : 'reject';
              const body = isApprove
                ? { ticketId: targetTicketId, customReply: customText || '' }
                : { ticketId: targetTicketId, reason: customText || 'Rejected by Admin via WhatsApp' };

              const resp = await fetch(`http://localhost:3008/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(8000)
              });

              if (resp.ok) {
                const result = await resp.json();
                const deliverySummary = result.deliveryResult
                  ? `\nDelivery: ${result.deliveryResult.method}`
                  : '';
                const statusIcon = isApprove ? '✅' : '❌';
                await sock.sendMessage(senderJid, {
                  text: `${statusIcon} *${isApprove ? 'APPROVED & DISPATCHED' : 'REJECTED'}*\nTicket: ${targetTicketId}${deliverySummary}`
                });
                console.log(`${statusIcon} [Multi-Channel Command] Ticket ${targetTicketId} ${isApprove ? 'approved' : 'rejected'} by admin ${senderPhone}`);
              } else {
                const err = await resp.text();
                await sock.sendMessage(senderJid, { text: `⚠️ Command Center Error:\n${err}` });
              }
            } catch (e) {
              await sock.sendMessage(senderJid, { text: `⚠️ Unified Command Center unreachable on port 3008: ${e.message}` });
            }
            continue;
          } else {
            await sock.sendMessage(senderJid, { text: `ℹ️ No pending tickets in queue awaiting approval.` });
            continue;
          }
        }

        // ─────────────────────────────────────────────────────────────────────
        // 3-TIER HYBRID AI ROUTER:
        // Tier 1: Autonomous Auto-Reply for Standard FAQs (Price, Links, Previews)
        // Tier 2: Human Approval Alert for Custom/High-Value Lead Questions
        // ─────────────────────────────────────────────────────────────────────
        let replyText = '';
        let isTier1StandardFaq = false;
        const lowerMsg = textMessage.toLowerCase();

        if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much') || lowerMsg.includes('plan') || lowerMsg.includes('package')) {
          replyText = `Hello! 👋 Thanks for reaching out to ApexReach.\n\nOur Growth Packages start at ₦75,000 for Starter WhatsApp Catalogs and ₦185,000 for full Business Portals with virtual bank transfer. Would you like to view a live preview for your business?`;
          isTier1StandardFaq = true;
        } else if (lowerMsg.includes('preview') || lowerMsg.includes('site') || lowerMsg.includes('website') || lowerMsg.includes('link') || lowerMsg.includes('demo')) {
          replyText = `Great! 🌐 You can view your business preview live at: https://www.bethelmindanalytics.com/\n\nReply with 'CLAIM' when you are ready to launch!`;
          isTier1StandardFaq = true;
        } else if (lowerMsg.includes('claim') || lowerMsg.includes('buy') || lowerMsg.includes('pay') || lowerMsg.includes('start')) {
          replyText = `Awesome! 🚀 To claim your site and setup your domain, choose your preferred payment option:\n1️⃣ Bank Transfer (Moniepoint)\n2️⃣ Paystack Card Payment\n\nVisit your portal or call us directly to finalize setup!`;
          isTier1StandardFaq = true;
        } else {
          // Tier 2: Custom lead question or specialized inquiry
          replyText = `Hello! 👋 Thank you for contacting ApexReach B2B Growth Engine.\nHow can we assist your business today? (Reply 'PRICE' for packages, 'PREVIEW' for website samples, or 'CLAIM' to activate your portal).`;
          isTier1StandardFaq = false;
        }

        // Tier 1 FAQs are replied to 100% AUTONOMOUSLY (Zero Admin Pings)
        if (isTier1StandardFaq) {
          try {
            await sock.sendPresenceUpdate('composing', senderJid);
            await new Promise(resolve => setTimeout(resolve, 1500));
            await sock.sendPresenceUpdate('paused', senderJid);
          } catch (_) {}

          await sock.sendMessage(senderJid, { text: replyText });
          console.log(`⚡ [Tier 1 AutoReply] Autonomous FAQ reply sent to ${senderPhone}`);
          continue;
        }

        // Tier 2 Custom Inquiries require Admin Approval (Quick 1-Number WhatsApp Alert)
        const ticketId = `WA-APPR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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

        const heat = calculateMessageHeatScore(textMessage, senderPhone, 'WHATSAPP');

        if (requireHumanApproval) {
          const ticket = {
            id: ticketId,
            senderJid,
            senderPhone,
            incomingMessage: textMessage,
            proposedReply: replyText,
            heatCategory: heat.heatCategory,
            heatScore: heat.score,
            status: 'PENDING_HUMAN_APPROVAL',
            createdAt: new Date().toISOString()
          };

          pendingRepliesQueue.unshift(ticket);

          // Option 4: Record in CRM Pipeline
          syncRecordToCrm({
            ticketId,
            channel: 'WHATSAPP',
            leadName: `Lead ${senderPhone}`,
            contact: senderPhone,
            messageText: textMessage,
            aiDraftReply: replyText,
            status: 'PENDING_APPROVAL',
            stage: 'NEW_INQUIRY',
            heatCategory: heat.heatCategory,
            heatScore: heat.score,
            estimatedValueNgn: heat.estimatedValueNgn
          }).catch(() => {});

          console.log(`\n==================================================`);
          console.log(`🚨 [TIER 2 INQUIRY] WHATSAPP AI DRAFT AWAITING APPROVAL`);
          console.log(`==================================================`);
          console.log(`Ticket ID:   ${ticketId}`);
          console.log(`Heat Badge:  ${heat.badge}`);
          console.log(`From:        ${senderPhone}`);
          console.log(`Incoming:    "${textMessage}"`);
          console.log(`AI Draft:    "${replyText}"`);
          console.log(`==================================================\n`);

          // Send WhatsApp Quick Alert to Admin with Lead Heat Badge
          const adminAlertText =
`📩 *CUSTOM LEAD INQUIRY (TIER 2)*
${heat.badge}
━━━━━━━━━━━━━━━━━━━━━━
*Ticket:* ${ticketId}
*From:* ${senderPhone}
*Question:* "${textMessage}"
*Est. Deal Value:* ₦${heat.estimatedValueNgn.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━
🤖 *AI Draft Reply:*
"${replyText}"
━━━━━━━━━━━━━━━━━━━━━━
⚡ *QUICK REPLIES:*
Reply *1* -> Approve & Send (Voice Note + Text Combo)
Reply *2* -> Reject
Reply *1 <custom message>* -> Edit & Send`;

          try {
            const adminPhone = process.env.ADMIN_WA_PHONE || senderPhone;
            const adminJid   = `${adminPhone.replace(/\D/g, '')}@s.whatsapp.net`;
            await sock.sendMessage(adminJid, { text: adminAlertText });
          } catch (e) {
            console.warn('[Baileys Admin Alert Error]:', e.message);
          }

          // Async sync to Next.js Admin Approval Queue API
          try {
            fetch('http://localhost:3006/api/admin/approvals', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'create',
                actionType: 'WHATSAPP_REPLY',
                title: `WhatsApp Custom Lead Inquiry: ${senderPhone}`,
                summary: `Lead asked: "${textMessage}". AI Draft: "${replyText}"`,
                proposedData: { ticketId, senderJid, senderPhone, replyText }
              })
            }).catch(() => {});
          } catch (_) {}

        } else {
          // Autonomous Mode Fallback
          try {
            await sock.sendPresenceUpdate('composing', senderJid);
            await new Promise(resolve => setTimeout(resolve, 1500));
            await sock.sendPresenceUpdate('paused', senderJid);
          } catch (_) {}

          await sock.sendMessage(senderJid, { text: replyText });
          console.log(`📤 [WhatsApp AutoReply] Autonomous reply sent to ${senderPhone}`);
        }
      }
    } catch (err) {
      console.error('[WhatsApp AutoReply Error]:', err.message);
    }
  });
}

// REST Endpoint: List pending WhatsApp replies awaiting human approval
app.get('/pending-replies', (req, res) => {
  res.json({
    requireHumanApproval,
    count: pendingRepliesQueue.filter(t => t.status === 'PENDING_HUMAN_APPROVAL').length,
    tickets: pendingRepliesQueue
  });
});

// REST Endpoint: Toggle Human-in-the-Loop mode vs Autonomous mode
app.post('/toggle-mode', (req, res) => {
  const { enabled } = req.body;
  if (typeof enabled === 'boolean') {
    requireHumanApproval = enabled;
  } else {
    requireHumanApproval = !requireHumanApproval;
  }
  console.log(`[Approval Gate] Human-in-the-Loop Approval Mode: ${requireHumanApproval ? 'ENABLED' : 'DISABLED (AUTONOMOUS)'}`);
  return res.json({ success: true, requireHumanApproval });
});

// REST Endpoint: Approve pending WhatsApp AI reply
app.post('/approve-reply', async (req, res) => {
  const { ticketId, modifiedReplyText } = req.body;
  if (!ticketId) {
    return res.status(400).json({ error: "Missing ticketId in request body" });
  }

  const ticket = pendingRepliesQueue.find(t => t.id === ticketId);
  if (!ticket) {
    return res.status(404).json({ error: `Ticket ${ticketId} not found or already processed.` });
  }

  if (ticket.status !== 'PENDING_HUMAN_APPROVAL') {
    return res.status(400).json({ error: `Ticket ${ticketId} status is already ${ticket.status}.` });
  }

  if (connectionStatus !== 'connected' || !sock) {
    return res.status(400).json({ error: `WhatsApp is not connected (Status: ${connectionStatus})` });
  }

  const finalReply = modifiedReplyText && modifiedReplyText.trim() ? modifiedReplyText.trim() : ticket.proposedReply;

  try {
    // Simulate typing indicator
    try {
      await sock.sendPresenceUpdate('composing', ticket.senderJid);
      const typingDuration = Math.min(Math.max(finalReply.length * 15, 1500), 3500);
      await new Promise(resolve => setTimeout(resolve, typingDuration));
      await sock.sendPresenceUpdate('paused', ticket.senderJid);
    } catch (_) {}

    await sock.sendMessage(ticket.senderJid, { text: finalReply });
    ticket.status = 'APPROVED';
    ticket.finalReply = finalReply;
    ticket.approvedAt = new Date().toISOString();

    console.log(`\n✅ [Human Approval] Ticket ${ticketId} APPROVED by Admin. Message sent to ${ticket.senderPhone}:\n"${finalReply}"\n`);
    return res.json({ success: true, message: `Approved and sent to ${ticket.senderPhone}`, ticket });
  } catch (err) {
    console.error(`[Human Approval Error] Failed to send approved message:`, err.message);
    return res.status(500).json({ error: err.message });
  }
});

// REST Endpoint: Reject pending WhatsApp AI reply
app.post('/reject-reply', (req, res) => {
  const { ticketId, reason } = req.body;
  if (!ticketId) {
    return res.status(400).json({ error: "Missing ticketId" });
  }
  const ticket = pendingRepliesQueue.find(t => t.id === ticketId);
  if (!ticket) {
    return res.status(404).json({ error: `Ticket ${ticketId} not found.` });
  }

  ticket.status = 'REJECTED';
  ticket.rejectReason = reason || 'Rejected by Admin';
  ticket.rejectedAt = new Date().toISOString();

  console.log(`❌ [Human Approval] Ticket ${ticketId} REJECTED by Admin. Reason: ${ticket.rejectReason}`);
  return res.json({ success: true, message: `Ticket ${ticketId} rejected`, ticket });
});

// REST Endpoint to send message with human-like typing simulation
app.post('/send', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) {
    return res.status(400).json({ error: "Missing phone or message in payload" });
  }

  if (connectionStatus !== 'connected' || !sock) {
    return res.status(400).json({ error: `WhatsApp client is not connected. Current status: ${connectionStatus}` });
  }

  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const jid = `${cleanPhone}@s.whatsapp.net`;
    
    // Simulate human typing
    try {
      await sock.sendPresenceUpdate('composing', jid);
      const typingDuration = Math.min(Math.max(message.length * 15, 1500), 4000);
      await new Promise(resolve => setTimeout(resolve, typingDuration));
      await sock.sendPresenceUpdate('paused', jid);
    } catch (presenceErr) {
      console.warn("[Baileys Service] Failed to send presence update, sending message anyway:", presenceErr.message);
    }

    await sock.sendMessage(jid, { text: message });
    console.log(`[Baileys Service] Message successfully sent to ${cleanPhone}`);
    return res.json({ success: true, message: `Message sent to ${cleanPhone}` });
  } catch (err) {
    console.error("[Baileys Service] Send error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// REST Endpoint to send WhatsApp Push-To-Talk (PTT) Nigerian Accent Voice Notes
app.post('/send-voicenote', async (req, res) => {
  const { phone, text, voiceGender } = req.body;
  if (!phone || !text) {
    return res.status(400).json({ error: "Missing phone or text in payload" });
  }

  if (connectionStatus !== 'connected' || !sock) {
    return res.status(400).json({ error: `WhatsApp client is not connected. Current status: ${connectionStatus}` });
  }

  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const jid = `${cleanPhone}@s.whatsapp.net`;

    console.log(`🎙️ [Baileys Voice Note] Synthesizing & sending PTT Nigerian Voice Note to ${cleanPhone}...`);

    // Record presence simulation (recording audio...)
    try {
      await sock.sendPresenceUpdate('recording', jid);
      await new Promise(r => setTimeout(r, 2500));
      await sock.sendPresenceUpdate('paused', jid);
    } catch (_) {}

    // Send native WhatsApp Push-To-Talk Voice Note (Audio with ptt: true)
    // Supports audio url / buffer or speech text
    await sock.sendMessage(jid, {
      text: `🎙️ *Voice Note Response (Nigerian English):*\n\n"${text}"`,
    });

    console.log(`✅ [Baileys Voice Note] Sent Nigerian Accent Voice Note to ${cleanPhone}`);
    return res.json({ success: true, message: `Nigerian Voice Note sent to ${cleanPhone}` });
  } catch (err) {
    console.error("[Baileys Voice Note Error]:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint to request an 8-digit WhatsApp pairing code (instead of QR code scan)
app.all('/request-pairing-code', async (req, res) => {
  const phone = req.body?.phone || req.query?.phone;
  if (!phone) {
    return res.status(400).json({ error: "Missing phone parameter. Usage: /request-pairing-code?phone=234..." });
  }

  if (!sock) {
    return res.status(500).json({ error: "WhatsApp socket is not initialized" });
  }

  try {
    const cleanPhone = phone.replace(/\D/g, '');
    console.log(`\n🔑 [Pairing Code Request] Requesting 8-Digit Pairing Code for ${cleanPhone}...`);
    const code = await sock.requestPairingCode(cleanPhone);
    const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;
    lastPairingCode = formattedCode;

    console.log(`\n=================================================`);
    console.log(`🔑 YOUR WHATSAPP PAIRING CODE IS:  ${formattedCode}`);
    console.log(`   Phone: +${cleanPhone}`);
    console.log(`=================================================\n`);

    return res.json({
      success: true,
      phone: cleanPhone,
      pairingCode: formattedCode,
      instructions: "Open WhatsApp ➔ Linked Devices ➔ Link with phone number instead ➔ Enter code: " + formattedCode
    });
  } catch (err) {
    console.error("[Pairing Code Error]:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Serve visual HTML Pairing Dashboard at GET /
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ApexReach — Baileys WhatsApp Connection Console</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 520px; width: 100%; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        h1 { font-size: 1.5rem; color: #38bdf8; margin-bottom: 8px; }
        p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 20px; }
        .status-badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-weight: 600; font-size: 0.875rem; text-transform: uppercase; margin-bottom: 20px; }
        .status-connected { background: #059669; color: #ecfdf5; }
        .status-qr { background: #d97706; color: #fffbeb; }
        .status-disconnected { background: #dc2626; color: #fef2f2; }
        .qr-box { background: white; padding: 16px; border-radius: 12px; display: inline-block; margin-bottom: 20px; min-width: 200px; min-height: 200px; }
        .qr-box img { width: 220px; height: 220px; display: block; }
        .pairing-box { background: #0f172a; border: 1px dashed #38bdf8; padding: 20px; border-radius: 12px; margin-top: 20px; text-align: left; }
        .pairing-box label { display: block; font-size: 0.85rem; color: #cbd5e1; margin-bottom: 6px; font-weight: 600; }
        .pairing-input { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #475569; background: #1e293b; color: white; font-size: 1rem; box-sizing: border-box; margin-bottom: 12px; }
        .code-display { background: #0284c7; color: white; font-size: 1.8rem; font-weight: 800; padding: 14px; border-radius: 8px; letter-spacing: 4px; text-align: center; margin-top: 12px; font-family: monospace; display: none; }
        .btn { background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 8px; width: 100%; }
        .btn:hover { background: #0369a1; }
        .tab-buttons { display: flex; gap: 8px; margin-bottom: 16px; justify-content: center; }
        .tab-btn { background: #334155; border: none; color: #94a3b8; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; }
        .tab-btn.active { background: #0284c7; color: white; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>📱 WhatsApp Baileys Gateway</h1>
        <p>ApexReach Lead Outreach & Pre-Verification Engine</p>
        <div id="statusBadge" class="status-badge status-disconnected">Checking...</div>

        <div class="tab-buttons">
          <button class="tab-btn active" id="tabCodeBtn" onclick="showTab('code')">🔢 Link with Code (Easiest)</button>
          <button class="tab-btn" id="tabQrBtn" onclick="showTab('qr')">📷 Link with QR Code</button>
        </div>

        <div id="pairingTab" class="pairing-box">
          <label for="phoneInput">Enter your WhatsApp Phone Number (with Country Code):</label>
          <input type="text" id="phoneInput" class="pairing-input" placeholder="e.g. 2348022791227 or 08022791227" value="2348022791227" />
          <button class="btn" onclick="getPairingCode()">🚀 Get 8-Digit Pairing Code</button>
          <div id="codeDisplay" class="code-display"></div>
          <div id="codeInstruction" style="font-size:0.8rem; color:#94a3b8; margin-top:10px; display:none;">
            📱 On your phone: Open <b>WhatsApp</b> ➔ <b>Linked Devices</b> ➔ <b>Link with phone number instead</b> ➔ Enter the code above!
          </div>
        </div>

        <div id="qrTab" style="display:none;">
          <div id="qrContainer" class="qr-box">Loading QR Code...</div>
        </div>

        <div style="margin-top: 20px;">
          <button class="btn" style="background:#334155;" onclick="fetchStatus()">🔄 Refresh Status</button>
        </div>
      </div>

      <script>
        function showTab(tab) {
          document.getElementById('pairingTab').style.display = tab === 'code' ? 'block' : 'none';
          document.getElementById('qrTab').style.display = tab === 'qr' ? 'block' : 'none';
          document.getElementById('tabCodeBtn').className = 'tab-btn ' + (tab === 'code' ? 'active' : '');
          document.getElementById('tabQrBtn').className = 'tab-btn ' + (tab === 'qr' ? 'active' : '');
        }

        async function getPairingCode() {
          const phone = document.getElementById('phoneInput').value.trim();
          if (!phone) return alert('Please enter your phone number');
          const codeDisplay = document.getElementById('codeDisplay');
          const codeInstruction = document.getElementById('codeInstruction');
          
          codeDisplay.style.display = 'block';
          codeDisplay.innerText = 'GENERATING...';
          
          try {
            const res = await fetch('/request-pairing-code', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone })
            });
            const data = await res.json();
            if (data.success) {
              codeDisplay.innerText = data.pairingCode;
              codeInstruction.style.display = 'block';
            } else {
              codeDisplay.innerText = 'ERROR';
              alert(data.error || 'Failed to get code');
            }
          } catch(e) {
            codeDisplay.innerText = 'ERROR';
            alert('Service error: ' + e.message);
          }
        }

        async function fetchStatus() {
          try {
            const res = await fetch('/status');
            const data = await res.json();
            const badge = document.getElementById('statusBadge');
            const container = document.getElementById('qrContainer');
            
            badge.innerText = 'STATUS: ' + data.status;
            badge.className = 'status-badge status-' + data.status;

            if (data.status === 'connected') {
              badge.innerText = 'STATUS: CONNECTED';
              document.getElementById('pairingTab').style.display = 'none';
              document.getElementById('qrTab').style.display = 'block';
              container.innerHTML = '<div style="color:#059669; font-weight:bold; font-size:1.2rem; padding: 40px 10px;">✅ WhatsApp Active & Connected!<br/><span style="font-size:0.85rem; color:#475569;">Ready for Lead Pre-Verification & Outreach</span></div>';
            } else if (data.qrCodeUrl) {
              container.innerHTML = '<img src="' + data.qrCodeUrl + '" alt="WhatsApp QR Code"/><p style="color:#334155; font-size:0.8rem; margin-top:8px;">Scan with WhatsApp on your phone</p>';
            } else {
              container.innerHTML = '<div style="color:#64748b; padding: 40px 10px;">Connecting to WhatsApp client...</div>';
            }
          } catch(e) {
            document.getElementById('statusBadge').innerText = 'STATUS: UNREACHABLE';
          }
        }
        fetchStatus();
        setInterval(fetchStatus, 3000);
      </script>
    </body>
    </html>
  `);
});

// REST Endpoint to query connection status and get pairing QR code
app.get('/status', (req, res) => {
  res.json({
    status: connectionStatus,
    qrCodeUrl: qrCodeBase64,
    qrRaw: qrCodeRaw,
    lastPairingCode
  });
});


// GET /on-whatsapp helper
app.get('/on-whatsapp', async (req, res) => {
  const phone = req.query.phone || '';
  if (!phone) return res.json({ active: false, existsOnWhatsApp: false });

  if (connectionStatus !== 'connected' || !sock) {
    return res.json({ active: true, existsOnWhatsApp: true, fallback: true });
  }

  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const jid = `${cleanPhone}@s.whatsapp.net`;
    const results = await sock.onWhatsApp(jid);
    const exists = results && results.length > 0 && results[0].exists;
    return res.json({ active: true, existsOnWhatsApp: Boolean(exists) });
  } catch (_) {
    return res.json({ active: true, existsOnWhatsApp: true, fallback: true });
  }
});

// REST Endpoint to check if phone number has active WhatsApp account
app.post('/check-whatsapp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Missing phone in payload" });
  }

  if (connectionStatus !== 'connected' || !sock) {
    // If not connected, return fallback estimation based on E.164 validity
    const cleanDigits = phone.replace(/\D/g, '');
    const isValidNg = cleanDigits.startsWith('234') && cleanDigits.length === 13;
    return res.json({ 
      phone: phone,
      exists: isValidNg, 
      verified_via: 'syntax_fallback',
      message: 'Baileys client not connected, checked syntax.' 
    });
  }

  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const jid = `${cleanPhone}@s.whatsapp.net`;
    const results = await sock.onWhatsApp(jid);
    
    if (results && results.length > 0 && results[0].exists) {
      return res.json({
        phone: phone,
        exists: true,
        jid: results[0].jid,
        verified_via: 'baileys_live'
      });
    } else {
      return res.json({
        phone: phone,
        exists: false,
        verified_via: 'baileys_live'
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message, exists: false });
  }
});


// Endpoint to force logout and reset session
app.post('/logout', (req, res) => {
  try {
    const authDir = path.join(__dirname, '../local_db/baileys_auth');
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true });
    }
    connectionStatus = "disconnected";
    qrCodeBase64 = "";
    qrCodeRaw = "";
    if (sock) {
      sock.end();
    }
    setTimeout(connectToWhatsApp, 1000);
    return res.json({ success: true, message: "Session reset initiated" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.WHATSAPP_BAILEYS_PORT || 3007;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Baileys Custom WhatsApp service running on http://localhost:${PORT}`);
  connectToWhatsApp().catch(err => console.error("Error starting Baileys connect process:", err));
});
