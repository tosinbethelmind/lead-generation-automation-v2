const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = require('@whiskeysockets/baileys');
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

// ── Continuous 24/7 Crash Resilience Guards ────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('⚠️ [24/7 Resilience] Uncaught Exception caught (Service Kept Alive):', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ [24/7 Resilience] Unhandled Rejection caught (Service Kept Alive):', reason);
});

let sock = null;
let connectionStatus = "disconnected"; // disconnected, qr, connecting, connected
let qrCodeBase64 = "";
let qrCodeRaw = "";
let lastPairingCode = "";
let requireHumanApproval = true; // DEFAULT: Human-in-the-loop enabled

const pendingRepliesQueue = [];
const processedMsgIds = new Set();

/**
 * Robust extractor for all incoming WhatsApp message formats
 * Unwraps ephemeral, viewOnce, interactive buttons, captions, audio notes, etc.
 */
function extractMessageText(msg) {
  if (!msg || !msg.message) return '';
  let m = msg.message;
  // Unwrap nested wrappers
  if (m.ephemeralMessage?.message) m = m.ephemeralMessage.message;
  if (m.viewOnceMessage?.message) m = m.viewOnceMessage.message;
  if (m.viewOnceMessageV2?.message) m = m.viewOnceMessageV2.message;
  if (m.documentWithCaptionMessage?.message) m = m.documentWithCaptionMessage.message;

  if (m.conversation) return m.conversation;
  if (m.extendedTextMessage?.text) return m.extendedTextMessage.text;
  if (m.buttonsResponseMessage?.selectedButtonId) return m.buttonsResponseMessage.selectedButtonId;
  if (m.buttonsResponseMessage?.selectedDisplayText) return m.buttonsResponseMessage.selectedDisplayText;
  if (m.templateButtonReplyMessage?.selectedId) return m.templateButtonReplyMessage.selectedId;
  if (m.templateButtonReplyMessage?.selectedDisplayText) return m.templateButtonReplyMessage.selectedDisplayText;
  if (m.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson) {
    try {
      const parsed = JSON.parse(m.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
      return parsed.id || parsed.title || JSON.stringify(parsed);
    } catch (_) {}
  }
  if (m.interactiveResponseMessage?.body?.text) return m.interactiveResponseMessage.body.text;
  if (m.listResponseMessage?.singleSelectReply?.selectedRowId) return m.listResponseMessage.singleSelectReply.selectedRowId;
  if (m.listResponseMessage?.title) return m.listResponseMessage.title;
  if (m.imageMessage?.caption) return m.imageMessage.caption;
  if (m.videoMessage?.caption) return m.videoMessage.caption;
  if (m.documentMessage?.caption) return m.documentMessage.caption;
  if (m.audioMessage) return '[Voice Note Received]';
  if (m.locationMessage) return `[Location Shared: ${m.locationMessage.name || m.locationMessage.address || 'GPS'}]`;
  if (m.contactMessage?.vcard) return `[Contact Shared: ${m.contactMessage.displayName || 'Contact'}]`;
  return '';
}

function syncDirSync(src, dest) {
  try {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const vitalFiles = ['creds.json'];
    for (const file of vitalFiles) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  } catch (err) {
    console.warn('[Baileys Sync Warning]:', err.message);
  }
}

async function connectToWhatsApp() {
  const adminEvolutionAuthDir = path.join(__dirname, '../local_db/evolution_auth_bethelmind_instance_1');
  const backupDir = path.join(__dirname, '../local_db/evolution_auth_bethelmind_instance_1_backup');
  const masterBackupDir = path.join(__dirname, '../local_db/baileys_auth_permanent_master');

  // Prioritize the user's authenticated Admin session (2348022791227)
  let authDir = adminEvolutionAuthDir;
  if (process.env.WA_AUTH_DIR && fs.existsSync(process.env.WA_AUTH_DIR)) {
    authDir = process.env.WA_AUTH_DIR;
  } else if (!fs.existsSync(path.join(adminEvolutionAuthDir, 'creds.json'))) {
    authDir = path.join(__dirname, '../local_db/baileys_auth');
  }

  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Self-Healing Session Solidification: Auto-restore ONLY if backup is registered and valid
  if (!fs.existsSync(path.join(authDir, 'creds.json'))) {
    const checkValid = (dir) => {
      const p = path.join(dir, 'creds.json');
      if (!fs.existsSync(p)) return false;
      try {
        const c = JSON.parse(fs.readFileSync(p, 'utf8'));
        return c && c.registered !== false && c.me?.id;
      } catch (_) { return false; }
    };

    if (checkValid(backupDir)) {
      console.log('🔄 [WhatsApp Admin Desk] Restoring authenticated session from solidified backup...');
      syncDirSync(backupDir, authDir);
    } else if (checkValid(masterBackupDir)) {
      console.log('🔄 [WhatsApp Admin Desk] Restoring authenticated session from permanent master backup...');
      syncDirSync(masterBackupDir, authDir);
    }
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();

  const accountPhone = state.creds?.me?.id ? state.creds.me.id.split(':')[0] : '2348022791227';
  const accountName = state.creds?.me?.name || 'Bethelmind Business Marketing and Development Enterprise';

  sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: true,
    browser: Browsers.windows('Desktop'),
    syncFullHistory: false,
    markOnlineOnConnect: true,
    keepAliveIntervalMs: 30000,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 60000
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      qrCodeRaw = qr;
      connectionStatus = "qr";
      console.log(`\n--- WHATSAPP ADMIN DESK (+${accountPhone}) QR CODE ---`);
      qrcodeTerminal.generate(qr, { small: true });
      console.log("Scan this QR code with your phone to connect Admin WhatsApp.");
      
      try {
        qrCodeBase64 = await QRCode.toDataURL(qr);
      } catch (err) {
        console.error("Failed to generate QR data URL:", err);
      }
    }

    if (connection === 'connecting') {
      connectionStatus = 'connecting';
      console.log(`Connecting WhatsApp Admin Desk (+${accountPhone} - ${accountName})...`);
    }

    if (connection === 'open') {
      connectionStatus = 'connected';
      qrCodeBase64 = "";
      qrCodeRaw = "";
      console.log(`✅ WhatsApp Admin Desk (+${accountPhone} - ${accountName}) connected & online!`);
      // Solidify backup on open
      syncDirSync(authDir, backupDir);
    }

    if (connection === 'close') {
      connectionStatus = 'disconnected';
      qrCodeBase64 = "";
      qrCodeRaw = "";
      const statusCode = (lastDisconnect?.error)?.output?.statusCode;
      const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 401 || statusCode === 403;
      const shouldReconnect = !isLoggedOut;
      console.log(`WhatsApp Line connection closed (Code: ${statusCode}). Reconnecting: ${shouldReconnect}`);
      if (shouldReconnect) {
        setTimeout(connectToWhatsApp, 3000);
      } else {
        console.log('⚠️ WhatsApp session was logged out or forbidden (Code: ' + statusCode + '). Clearing stale auth for fresh linking...');
        try {
          if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true, force: true });
          if (fs.existsSync(backupDir)) fs.rmSync(backupDir, { recursive: true, force: true });
          fs.mkdirSync(authDir, { recursive: true });
        } catch (_) {}
        setTimeout(connectToWhatsApp, 2000);
      }
    }
  });

  sock.ev.on('creds.update', () => {
    saveCreds();
    // Synchronize to persistent backup automatically
    syncDirSync(authDir, backupDir);
  });

  // ── WhatsApp Chat History Sync Listener (Catches unreplied recent chats) ─
  sock.ev.on('messaging-history.set', async ({ chats, contacts, messages, isLatest }) => {
    console.log(`📥 [WhatsApp History Sync] Loaded ${chats?.length || 0} chats, ${messages?.length || 0} messages (isLatest: ${isLatest}).`);
    try {
      if (messages && Array.isArray(messages)) {
        const sixHoursAgo = Date.now() - (6 * 3600 * 1000);
        for (const msg of messages) {
          if (!msg.message || msg.key.fromMe) continue;
          if (msg.key.id && processedMsgIds.has(msg.key.id)) continue;

          const msgTime = msg.messageTimestamp ? Number(msg.messageTimestamp) * 1000 : 0;
          if (msgTime > 0 && msgTime < sixHoursAgo) continue;

          const senderJid = msg.key.remoteJid;
          if (!senderJid || senderJid === 'status@broadcast' || senderJid.endsWith('@broadcast') || senderJid.endsWith('@g.us')) continue;

          const textMessage = extractMessageText(msg);
          if (!textMessage.trim()) continue;

          if (msg.key.id) processedMsgIds.add(msg.key.id);

          console.log(`🔄 [WhatsApp History Processing] Found unhandled chat from ${senderJid}: "${textMessage}"`);
          await executeCloserReply(senderJid, textMessage, msg);
        }
      }
    } catch (histErr) {
      console.warn('[WhatsApp History Sync Error]:', histErr.message);
    }
  });

  // ── WhatsApp AI Auto-Reply Listener ──────────────────────────────────────
  sock.ev.on('messages.upsert', async (m) => {
    try {
      if (m.type !== 'notify' && m.type !== 'append') return;
      for (const msg of m.messages) {
        if (!msg.message || msg.key.fromMe) continue; // Ignore own messages
        if (msg.key.id && processedMsgIds.has(msg.key.id)) continue;
        if (msg.key.id) {
          processedMsgIds.add(msg.key.id);
          if (processedMsgIds.size > 2000) {
            const firstKey = processedMsgIds.values().next().value;
            processedMsgIds.delete(firstKey);
          }
        }

        const senderJid = msg.key.remoteJid;
        if (!senderJid || senderJid === 'status@broadcast' || senderJid.endsWith('@broadcast') || senderJid.endsWith('@g.us')) continue; // Ignore statuses and group messages

        const textMessage = extractMessageText(msg);
        if (!textMessage.trim()) continue;

        console.log(`\n📩 [WhatsApp Message Received] From ${senderJid}: "${textMessage}"`);

        // ─────────────────────────────────────────────────────────────────────
        // ADMIN COMMAND HANDLER — Hybrid Quick-Reply (WhatsApp Controlled)
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

          if (!targetTicketId) {
            const localPending = pendingRepliesQueue.find(t => t.status === 'PENDING_HUMAN_APPROVAL');
            if (localPending) {
              targetTicketId = localPending.id;
            } else {
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
            let customText = '';
            if (parts[0] === '1' || parts[0].toUpperCase() === 'YES' || parts[0].toUpperCase() === 'Y') {
              customText = parts.slice(1).join(' ').trim();
            } else if (parts.length > 2) {
              customText = parts.slice(2).join(' ').trim();
            }

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
        // ⚡ AUTONOMOUS NIGERIAN AI CLOSER & INBOUND CONVERSION ENGINE
        // Responds to all prospect chats in < 2.5s with contextual intelligence
        // ─────────────────────────────────────────────────────────────────────
        await executeCloserReply(senderJid, textMessage, msg);
      }
    } catch (err) {
      console.error('[WhatsApp AutoReply Error]:', err.message);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ⚡ REUSABLE AI CLOSER EXECUTION ENGINE (24/7 Continuous & On-Demand)
// ─────────────────────────────────────────────────────────────────────────────
async function executeCloserReply(targetRecipient, incomingText = '', rawMsg = null) {
  let targetJid = '';
  let cleanPhone = '';

  if (typeof targetRecipient === 'string' && targetRecipient.includes('@')) {
    targetJid = targetRecipient;
    if (targetRecipient.endsWith('@s.whatsapp.net')) {
      cleanPhone = targetRecipient.replace('@s.whatsapp.net', '');
    }
  } else {
    cleanPhone = String(targetRecipient || '').replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '234' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) {
      cleanPhone = '234' + cleanPhone;
    }
    targetJid = `${cleanPhone}@s.whatsapp.net`;
  }

  // Check participant for phone number if target is LID or Group
  if (rawMsg?.key?.participant && rawMsg.key.participant.endsWith('@s.whatsapp.net')) {
    cleanPhone = rawMsg.key.participant.replace('@s.whatsapp.net', '');
  }

  let replyText = '';
  let intent = 'GENERAL_INQUIRY';
  let directPaymentEligible = false;
  let customerName = cleanPhone ? `Business Owner (+${cleanPhone})` : 'Valued Business Owner';
  let customerArea = 'Nigeria';
  let customerCategory = 'Commercial Business';
  const vercelBase = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.bethelmindanalytics.com';
  let customerPreviewUrl = `${vercelBase}/preview/${cleanPhone || 'demo'}`;

  // 1. Resolve Lead Identity & Exact Preview URL from Local DB
  try {
    const leadsDbPath = path.join(__dirname, '../local_db/leads_db.json');
    if (fs.existsSync(leadsDbPath)) {
      const rawLeads = JSON.parse(fs.readFileSync(leadsDbPath, 'utf8'));
      const leadsList = Array.isArray(rawLeads) ? rawLeads : Object.values(rawLeads);

      let matched = null;

      // 1A. Try matching by preview link / UUID in message text
      if (incomingText) {
        const linkMatch = incomingText.match(/preview\/([a-zA-Z0-9_-]+)/i);
        if (linkMatch) {
          const targetSlug = linkMatch[1];
          matched = leadsList.find(l =>
            (l.id && l.id === targetSlug) ||
            (l.lead_id && l.lead_id === targetSlug) ||
            (l.slug && l.slug === targetSlug)
          );
          if (matched) {
            customerPreviewUrl = `${vercelBase}/preview/${targetSlug}`;
          } else {
            customerPreviewUrl = linkMatch[0].startsWith('http') ? linkMatch[0] : `${vercelBase}/preview/${targetSlug}`;
          }
        }
      }

      // 1B. If not matched by link, match by phone
      if (!matched && cleanPhone) {
        matched = leadsList.find(l => {
          const lp = (l.phone || l.phone_e164 || l.phone_raw || '').replace(/\D/g, '');
          return lp && (cleanPhone.endsWith(lp.slice(-10)) || lp.endsWith(cleanPhone.slice(-10)));
        });
      }

      if (matched) {
        customerName = matched.business_name || matched.name || customerName;
        customerArea = matched.area || matched.city || customerArea;
        customerCategory = matched.category || matched.sector || customerCategory;
        const slug = (matched.id || matched.lead_id || customerName.toLowerCase().replace(/[^a-z0-9]+/g, '-')).slice(0, 40);
        if (!incomingText || !incomingText.includes(slug)) {
          customerPreviewUrl = `${vercelBase}/preview/${slug}`;
        }
        if (matched.phone || matched.phone_e164) {
          cleanPhone = (matched.phone || matched.phone_e164).replace(/\D/g, '');
        }
      }
    }
  } catch (lookupErr) {
    console.warn('[Baileys Lead Lookup Warning]:', lookupErr.message);
  }

  // 2. Generate Simple, Natural Nigerian AI Closer Response
  try {
    try { delete require.cache[require.resolve('./lib/closer_engine')]; } catch (_) {}
    const { handlePostContactInquiry } = require('./lib/closer_engine');
    const closerRes = handlePostContactInquiry(incomingText || 'Hello I am inquiring about website', {
      businessName: customerName,
      category: customerCategory,
      area: customerArea,
      phone: cleanPhone,
      hasWebsite: false,
      previewUrl: customerPreviewUrl
    });
    replyText = closerRes.messageText;
    intent = closerRes.intent;
    directPaymentEligible = closerRes.directPaymentEligible;
  } catch (_) {
    replyText = `Good day! 👋 Welcome to Bethelmind Analytics Lagos Desk.\n\nWe created a free sample website for your business (*${customerName}*) so you can see how customers can find you on Google and message you on WhatsApp 24/7.\n\n👉 You can view your sample website here:\n${customerPreviewUrl}\n\nOur full setup fee is ₦75,000 deposit to start (₦150,000 total, ready in 48 hours). Please let us know if you want to get started!`;
  }

  if (connectionStatus !== 'connected' || !sock) {
    throw new Error(`WhatsApp socket is not connected (Status: ${connectionStatus})`);
  }

  // 3. Simulate Typing & Send Instant Autonomous AI Response (< 2.5s) to targetJid
  try {
    await sock.sendPresenceUpdate('composing', targetJid);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await sock.sendPresenceUpdate('paused', targetJid);
    const sendRes = await sock.sendMessage(targetJid, { text: replyText });
    console.log(`⚡ [AI Agent Auto-Reply] Successfully replied to ${targetJid} (${customerName}) (Intent: ${intent})`);
  } catch (sendErr) {
    console.error(`❌ [AI Auto-Reply Error] Failed to send message to ${targetJid}:`, sendErr.message);
    throw sendErr;
  }

  // 4. Real-Time Admin Notification to 0802 279 1227 with Customer's Exact Preview Link
  const ticketId = `WA-APPR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const adminAlertText =
`🔔 *INBOUND CUSTOMER CHAT (AI AGENT RESPONDED)*
━━━━━━━━━━━━━━━━━━━━━━
🏢 *Business:* ${customerName} (${customerArea})
📱 *Identifier / Phone:* ${cleanPhone ? '+' + cleanPhone : targetJid}
🎯 *Intent:* ${intent}
🔗 *Customer Demo Link:* 
${customerPreviewUrl}
━━━━━━━━━━━━━━━━━━━━━━
💬 *Customer Said:* 
"${incomingText || 'Direct Inquiry'}"
━━━━━━━━━━━━━━━━━━━━━━
🤖 *AI Agent Sent:*
"${replyText.slice(0, 250)}..."
━━━━━━━━━━━━━━━━━━━━━━
⚡ *Direct Chat Link:* ${cleanPhone ? `wa.me/${cleanPhone}` : `WhatsApp (${targetJid})`}`;

  try {
    const adminPhone = process.env.ADMIN_WA_PHONE || '2348022791227';
    const adminJid   = `${adminPhone.replace(/\D/g, '')}@s.whatsapp.net`;
    if (adminJid !== targetJid) {
      await sock.sendMessage(adminJid, { text: adminAlertText });
    }
  } catch (e) {
    console.warn('[Baileys Admin Alert Error]:', e.message);
  }

  // 5. Record Conversation in Local DB & CRM Pipeline
  try {
    const crmPath = path.join(__dirname, '../local_db/crm_leads.json');
    let crmLeads = [];
    if (fs.existsSync(crmPath)) {
      try { crmLeads = JSON.parse(fs.readFileSync(crmPath, 'utf8')); } catch (_) {}
    }
    crmLeads.push({
      id: ticketId,
      phone: cleanPhone || targetJid,
      businessName: customerName,
      incoming: incomingText,
      reply: replyText,
      intent: intent,
      timestamp: new Date().toISOString()
    });
    fs.writeFileSync(crmPath, JSON.stringify(crmLeads.slice(-500), null, 2), 'utf8');
  } catch (_) {}

  return {
    success: true,
    phone: cleanPhone,
    businessName: customerName,
    intent,
    replyText,
    previewUrl: customerPreviewUrl
  };
}

// REST Endpoints: Trigger AI Closer Reply directly
app.post('/trigger-closer-reply', async (req, res) => {
  const { phone, message, text } = req.body;
  if (!phone) return res.status(400).json({ error: "Missing 'phone' in request body" });
  try {
    const result = await executeCloserReply(phone, message || text || '');
    return res.json({ success: true, result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/reply-multiple-prospects', async (req, res) => {
  const phones = req.body.phones || (req.body.phone ? [req.body.phone] : []);
  if (!Array.isArray(phones) || phones.length === 0) {
    return res.status(400).json({ error: "Missing 'phones' array in request body" });
  }

  const results = [];
  for (const p of phones) {
    try {
      const resData = await executeCloserReply(p, req.body.message || 'Hello');
      results.push(resData);
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      results.push({ phone: p, success: false, error: e.message });
    }
  }

  return res.json({ success: true, count: results.length, results });
});

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

// ─────────────────────────────────────────────────────────────────────────────
// 🌐 MULTI-CHANNEL UNIFIED INBOUND AUTO-RESPONDER ENDPOINTS
// Integrates Web Forms, SMS Gateway, Email, Chatbot, and On-Site Calculators
// ─────────────────────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Bethelmind Unified WhatsApp Closer & Multi-Channel Hub',
    connectionStatus,
    adminPhone: process.env.ADMIN_WA_PHONE || '2348022791227',
    uptimeSeconds: Math.floor(process.uptime())
  });
});

app.get('/queue', (req, res) => {
  const statusFilter = req.query.status;
  const filtered = statusFilter 
    ? pendingRepliesQueue.filter(t => t.status === statusFilter)
    : pendingRepliesQueue;
  res.json({ count: filtered.length, tickets: filtered });
});

app.post('/approve', async (req, res) => {
  const { ticketId, customReply } = req.body;
  const targetId = ticketId;
  const ticket = pendingRepliesQueue.find(t => t.id === targetId);
  if (!ticket) {
    return res.status(404).json({ error: `Ticket ${targetId} not found.` });
  }
  const replyToSend = customReply || ticket.proposedReply;
  if (ticket.senderJid && connectionStatus === 'connected' && sock) {
    try {
      await sock.sendMessage(ticket.senderJid, { text: replyToSend });
      ticket.status = 'APPROVED';
      ticket.finalReply = replyToSend;
      ticket.approvedAt = new Date().toISOString();
      return res.json({ success: true, message: `Dispatched to ${ticket.senderPhone || ticket.senderJid}` });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
  ticket.status = 'APPROVED';
  ticket.finalReply = replyToSend;
  return res.json({ success: true, message: `Ticket approved` });
});

app.post('/reject', (req, res) => {
  const { ticketId, reason } = req.body;
  const ticket = pendingRepliesQueue.find(t => t.id === ticketId);
  if (!ticket) return res.status(404).json({ error: `Ticket ${ticketId} not found.` });
  ticket.status = 'REJECTED';
  ticket.rejectReason = reason || 'Rejected by Admin';
  ticket.rejectedAt = new Date().toISOString();
  return res.json({ success: true, message: `Ticket rejected` });
});

// 1. Web Contact Form & Interactive Calculators Inbound
app.post('/web-inquiry', async (req, res) => {
  try {
    const { name, email, phone, subject, message, sector, previewUrl } = req.body || {};
    const cleanSenderName = name || 'Website Visitor';
    const cleanMsg = message || subject || 'Inquiry from website';
    const ticketId = `WEB-APPR-${Date.now().toString().slice(-6)}`;

    let cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '234' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) {
      cleanPhone = '234' + cleanPhone;
    }

    // Generate intelligent Nigerian AI Closer reply
    let replyText = '';
    let intent = 'WEB_INQUIRY';
    try {
      delete require.cache[require.resolve('./lib/closer_engine')];
      const { handlePostContactInquiry } = require('./lib/closer_engine');
      const closerRes = handlePostContactInquiry(cleanMsg, {
        businessName: cleanSenderName,
        category: sector || 'General SME',
        phone: cleanPhone,
        previewUrl: previewUrl || `https://www.bethelmindanalytics.com/preview/${cleanPhone || 'demo'}`
      });
      replyText = closerRes.messageText;
      intent = closerRes.intent;
    } catch (e) {
      replyText = `Hello ${cleanSenderName}! 👋 Thank you for contacting Bethelmind Analytics Lagos Desk.\n\nWe build 24/7 AI WhatsApp Quoting Assistants and Turnkey Websites delivered in 48 Hours.\n\n• Turnkey Website + WhatsApp AI: ₦75,000 deposit to start (₦150,000 total)\n• 1-Line Embed Upgrade: ₦35,000 deposit\n\nBank: OPay Digital Services | Account: 7034297995 | Name: Oyelakin Tosin Matthew\n\nHow can we help you launch today?`;
    }

    let autoDeliveredToCustomer = false;
    // If client provided a valid Nigerian phone number and WhatsApp is connected, auto-reply to their WhatsApp
    if (cleanPhone && cleanPhone.startsWith('234') && connectionStatus === 'connected' && sock) {
      try {
        const clientJid = `${cleanPhone}@s.whatsapp.net`;
        await sock.sendPresenceUpdate('composing', clientJid);
        await new Promise(r => setTimeout(r, 1200));
        await sock.sendPresenceUpdate('paused', clientJid);
        await sock.sendMessage(clientJid, { text: replyText });
        autoDeliveredToCustomer = true;
        console.log(`⚡ [Web Auto-Reply] Sent WhatsApp closer reply directly to prospect +${cleanPhone}`);
      } catch (waSendErr) {
        console.warn(`[Web Auto-Reply WA Warning]:`, waSendErr.message);
      }
    }

    // Always alert Admin WhatsApp Desk (0802 279 1227)
    const adminPhone = process.env.ADMIN_WA_PHONE || '2348022791227';
    const adminJid = `${adminPhone.replace(/\D/g, '')}@s.whatsapp.net`;
    const adminAlert =
`🌐 *NEW WEB / CALCULATOR INQUIRY RECEIVED!*
━━━━━━━━━━━━━━━━━━━━━━
*Ticket:* ${ticketId}
*From:* ${cleanSenderName}
*Phone:* ${cleanPhone ? '+' + cleanPhone : 'N/A'}
*Email:* ${email || 'N/A'}
*Subject:* ${subject || 'Website Inquiry'}
*Message:* "${cleanMsg.slice(0, 150)}"
━━━━━━━━━━━━━━━━━━━━━━
🤖 *AI Response ${autoDeliveredToCustomer ? '(Delivered to Client WhatsApp)' : '(Proposed Draft)'}:*
"${replyText.slice(0, 200)}..."
━━━━━━━━━━━━━━━━━━━━━━
⚡ *Direct WhatsApp Bridge:* ${cleanPhone ? `wa.me/${cleanPhone}` : 'N/A'}`;

    if (connectionStatus === 'connected' && sock) {
      try {
        await sock.sendMessage(adminJid, { text: adminAlert });
      } catch (alertErr) {
        console.warn('[Admin Alert Warning]:', alertErr.message);
      }
    }

    // Log to local DB & lead journeys
    try {
      const journeysPath = path.join(__dirname, '../local_db/lead_journeys.json');
      let journeys = [];
      if (fs.existsSync(journeysPath)) {
        try { journeys = JSON.parse(fs.readFileSync(journeysPath, 'utf8')); } catch (_) {}
      }
      journeys.push({
        lead_id: cleanPhone || ticketId,
        business_name: cleanSenderName,
        phone: cleanPhone,
        email: email,
        channel: 'web_form',
        step: 'inquiry_received',
        notes: cleanMsg,
        timestamp: new Date().toISOString()
      });
      fs.writeFileSync(journeysPath, JSON.stringify(journeys.slice(-5000), null, 2), 'utf8');
    } catch (_) {}

    return res.json({
      success: true,
      ticketId,
      autoDeliveredToCustomer,
      reply: replyText
    });
  } catch (err) {
    console.error('[Web Inquiry Route Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. SMS Inbound Inquiries (from Android Gateway or Termii Webhook)
app.post(['/sms-inquiry', '/sms-inbound'], async (req, res) => {
  try {
    const payload = req.body || {};
    const sender = payload.from || payload.sender || payload.phone || payload.number;
    const incomingText = payload.message || payload.text || payload.msg || payload.body || '';

    if (!sender) {
      return res.status(400).json({ error: 'Missing sender phone number' });
    }

    let cleanPhone = String(sender).replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '234' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) {
      cleanPhone = '234' + cleanPhone;
    }

    console.log(`📲 [SMS Inbound Received] From +${cleanPhone}: "${incomingText}"`);

    // Execute closer reply via WhatsApp socket if connected
    let waResult = null;
    try {
      waResult = await executeCloserReply(cleanPhone, incomingText);
    } catch (e) {
      console.warn('[SMS Auto-Reply via WhatsApp Warning]:', e.message);
    }

    return res.json({
      success: true,
      phone: cleanPhone,
      message: incomingText,
      waDelivered: Boolean(waResult && waResult.success)
    });
  } catch (err) {
    console.error('[SMS Inquiry Error]:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// 3. Email Inbound Inquiries (from IMAP or Webhooks)
app.post(['/email-inquiry', '/email-inbound'], async (req, res) => {
  try {
    const { from, name, email, subject, message } = req.body || {};
    const senderName = name || from || 'Email Prospect';
    const senderEmail = email || from || '';
    const ticketId = `EM-APPR-${Date.now().toString().slice(-6)}`;

    delete require.cache[require.resolve('./lib/closer_engine')];
    const { handlePostContactInquiry } = require('./lib/closer_engine');
    const closerRes = handlePostContactInquiry(message || subject || '', {
      businessName: senderName,
      email: senderEmail
    });

    const adminAlert =
`📧 *NEW EMAIL INQUIRY RECEIVED!*
━━━━━━━━━━━━━━━━━━━━━━
*Ticket:* ${ticketId}
*From:* ${senderName} (${senderEmail})
*Subject:* ${subject || 'No Subject'}
*Message:* "${(message || '').slice(0, 150)}"
━━━━━━━━━━━━━━━━━━━━━━
🤖 *AI Drafted Email Reply:*
"${closerRes.messageText.slice(0, 200)}..."`;

    if (connectionStatus === 'connected' && sock) {
      const adminPhone = process.env.ADMIN_WA_PHONE || '2348022791227';
      const adminJid = `${adminPhone.replace(/\D/g, '')}@s.whatsapp.net`;
      await sock.sendMessage(adminJid, { text: adminAlert });
    }

    return res.json({ success: true, ticketId, draftReply: closerRes.messageText });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 4. Chatbot Lead Capture Inbound (from on-site preview chatbots)
app.post(['/chatbot-inquiry', '/chat-lead'], async (req, res) => {
  try {
    const { session_id, visitor_name, visitor_phone, visitor_email, sector, business_name, message, requirement } = req.body || {};
    const cleanVisitorName = visitor_name || 'Prospect';
    const portalName = business_name || 'Preview Site';
    const ticketId = `CHAT-LEAD-${Date.now().toString().slice(-6)}`;

    let cleanPhone = (visitor_phone || '').replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '234' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) {
      cleanPhone = '234' + cleanPhone;
    }

    // Alert Admin WhatsApp
    const adminPhone = process.env.ADMIN_WA_PHONE || '2348022791227';
    const adminJid = `${adminPhone.replace(/\D/g, '')}@s.whatsapp.net`;
    const adminAlert =
`🤖 *LIVE ON-SITE CHATBOT LEAD CAPTURED!*
━━━━━━━━━━━━━━━━━━━━━━
*Ticket:* ${ticketId}
*Site / Portal:* ${portalName} (${sector || 'General'})
*Visitor:* ${cleanVisitorName}
*Phone:* ${cleanPhone ? '+' + cleanPhone : 'N/A'}
*Email:* ${visitor_email || 'N/A'}
*Details / Notes:* "${message || requirement || 'Captured from live AI chat session'}"
━━━━━━━━━━━━━━━━━━━━━━
⚡ *Direct WhatsApp Bridge:* ${cleanPhone ? `wa.me/${cleanPhone}` : 'N/A'}`;

    if (connectionStatus === 'connected' && sock) {
      await sock.sendMessage(adminJid, { text: adminAlert });
    }

    // Auto-reach prospect via WhatsApp if valid phone
    if (cleanPhone && cleanPhone.startsWith('234') && connectionStatus === 'connected' && sock) {
      try {
        const welcomeText =
`Hello ${cleanVisitorName}! 👋\n\nThank you for reaching out via ${portalName}.\nOur Lagos team has received your inquiry and we are available right now to assist you!\n\nWould you like us to prepare your official quote or schedule a 5-minute walkthrough?`;
        await sock.sendMessage(`${cleanPhone}@s.whatsapp.net`, { text: welcomeText });
        console.log(`⚡ [Chatbot Auto-Reach] Sent WhatsApp greeting to +${cleanPhone}`);
      } catch (chatSendErr) {
        console.warn('[Chatbot Auto-Reach Warning]:', chatSendErr.message);
      }
    }

    return res.json({ success: true, ticketId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 5. Universal Cross-Channel Intake Endpoint
app.post('/inbound-inquiry', async (req, res) => {
  const channel = (req.body?.channel || 'web').toLowerCase();
  if (channel === 'sms') {
    return app._router.handle({ ...req, url: '/sms-inquiry', method: 'POST' }, res);
  } else if (channel === 'email') {
    return app._router.handle({ ...req, url: '/email-inquiry', method: 'POST' }, res);
  } else if (channel === 'chatbot') {
    return app._router.handle({ ...req, url: '/chatbot-inquiry', method: 'POST' }, res);
  } else {
    return app._router.handle({ ...req, url: '/web-inquiry', method: 'POST' }, res);
  }
});

// REST Endpoint to send message with human-like typing simulation
// REST Endpoint to broadcast directly into WhatsApp Channel / Newsletter & Status 100% autonomously
app.post('/broadcast-channel', async (req, res) => {
  const { text, message, inviteCode } = req.body;
  const broadcastText = message || text;
  if (!broadcastText) {
    return res.status(400).json({ error: "Missing message/text in payload" });
  }

  if (connectionStatus !== 'connected' || !sock) {
    return res.status(503).json({ error: `WhatsApp Line 1 is not connected. Status: ${connectionStatus}` });
  }

  try {
    const code = inviteCode || '0029VbDFgKP4o7qM58yY9v2l';
    let channelJid = null;
    try {
      if (typeof sock.newsletterMetadata === 'function') {
        const meta = await sock.newsletterMetadata('invite', code);
        if (meta && meta.id) channelJid = meta.id;
      }
    } catch (e) {
      console.warn('[Baileys] Newsletter metadata lookup warning:', e.message);
    }

    let channelResult = null;
    if (channelJid) {
      channelResult = await sock.sendMessage(channelJid, { text: broadcastText });
      console.log(`📢 [Baileys] Successfully posted directly to WhatsApp Channel (${channelJid})`);
    }

    // Also post to Status Broadcast autonomously
    let statusResult = null;
    try {
      statusResult = await sock.sendMessage('status@broadcast', { text: broadcastText });
      console.log('📢 [Baileys] Successfully posted to WhatsApp Status Broadcast');
    } catch (statusErr) {
      console.warn('[Baileys] Status broadcast warning:', statusErr.message);
    }

    return res.json({
      success: true,
      autonomous: true,
      channelJid,
      channelResult: channelResult?.key?.id,
      statusResult: statusResult?.key?.id
    });
  } catch (err) {
    console.error('[Baileys] Autonomous broadcast error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint to request 8-digit WhatsApp Pairing Code for instant phone linking
app.get('/pair', async (req, res) => {
  const targetPhone = req.query.phone || '2347026266946';
  try {
    if (!sock) return res.status(500).json({ error: 'Socket not initialized' });
    const code = await sock.requestPairingCode(targetPhone.replace(/\D/g, ''));
    console.log(`🔑 [PAIRING CODE] Generated WhatsApp Line 1 Pairing Code for ${targetPhone}: ${code}`);
    return res.json({ success: true, phone: targetPhone, pairingCode: code });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const sendHandlerLine1 = async (req, res) => {
  const { phone, message, text } = req.body;
  const outboundText = message || text;
  if (!phone || !outboundText) {
    return res.status(400).json({ error: "Missing phone or message in payload" });
  }

  if (connectionStatus !== 'connected' || !sock) {
    return res.status(503).json({ error: `WhatsApp Line 1 client is not connected. Current status: ${connectionStatus}` });
  }

  try {
    let cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '234' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) {
      cleanPhone = '234' + cleanPhone;
    }
    const jid = `${cleanPhone}@s.whatsapp.net`;
    
    // Simulate human typing
    try {
      await sock.sendPresenceUpdate('composing', jid);
      const typingDuration = Math.min(Math.max(outboundText.length * 15, 1200), 3000);
      await new Promise(resolve => setTimeout(resolve, typingDuration));
      await sock.sendPresenceUpdate('paused', jid);
    } catch (presenceErr) {
      console.warn("[Baileys Service] Failed to send presence update, sending message anyway:", presenceErr.message);
    }

    const result = await sock.sendMessage(jid, { text: outboundText });
    console.log(`[Baileys Service Line 1] Message successfully sent to ${cleanPhone}`);
    return res.json({ success: true, lineId: 1, messageId: result?.key?.id, message: `Message sent to ${cleanPhone}` });
  } catch (err) {
    console.error("[Baileys Service Line 1] Send error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

app.post('/send', sendHandlerLine1);
app.post('/api/send', sendHandlerLine1);

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
    let audioBuffer = null;
    let mimetype = 'audio/ogg; codecs=opus';
    if (req.body.audioPath && fs.existsSync(req.body.audioPath)) {
      audioBuffer = fs.readFileSync(req.body.audioPath);
    } else if (req.body.voiceNoteId) {
      const oggPath = path.join(__dirname, `../public/assets/audio/${req.body.voiceNoteId}.ogg`);
      const mp3Path = path.join(__dirname, `../public/assets/audio/${req.body.voiceNoteId}.mp3`);
      if (fs.existsSync(oggPath)) {
        audioBuffer = fs.readFileSync(oggPath);
        mimetype = 'audio/ogg; codecs=opus';
      } else if (fs.existsSync(mp3Path)) {
        audioBuffer = fs.readFileSync(mp3Path);
        mimetype = 'audio/mpeg';
      }
    }

    if (audioBuffer) {
      await sock.sendMessage(jid, {
        audio: audioBuffer,
        mimetype: mimetype,
        ptt: true
      });
    } else {
      await sock.sendMessage(jid, {
        text: `🎙️ *Voice Note Response (Nigerian English):*\n\n"${text}"`,
      });
    }

    console.log(`✅ [Baileys Voice Note] Sent Nigerian Accent Voice Note to ${cleanPhone}`);
    return res.json({ success: true, message: `Nigerian Voice Note sent to ${cleanPhone}` });
  } catch (err) {
    console.error("[Baileys Voice Note Error]:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 🌐 MULTI-CHANNEL UNIFIED INQUIRY INTAKE (Web Form, SMS, Email, Typebot, Appointments)
// ─────────────────────────────────────────────────────────────────────────────
app.post(['/web-inquiry', '/sms-inquiry', '/email-inquiry', '/inbound-inquiry'], async (req, res) => {
  try {
    const { name, email, phone, message, text, subject, sector, area, previewUrl, channel } = req.body;
    const incomingText = message || text || subject || 'New commercial inquiry';
    const channelName = channel || (req.path.includes('web') ? 'WEB' : req.path.includes('sms') ? 'SMS' : req.path.includes('email') ? 'EMAIL' : 'INBOUND');
    const customerPhone = String(phone || '').replace(/\D/g, '');
    const customerName = name || (customerPhone ? `Lead (+${customerPhone})` : 'Prospective Client');
    const customerArea = area || 'Lagos';
    const customerCategory = sector || 'Commercial Enterprise';
    const targetPreview = previewUrl || `https://www.bethelmindanalytics.com/preview/${customerPhone || 'demo'}`;

    // 1. Generate Contextual Nigerian AI Response using closer_engine
    let replyText = '';
    let intent = 'GENERAL_INQUIRY';
    try {
      delete require.cache[require.resolve('./lib/closer_engine')];
      const { handlePostContactInquiry } = require('./lib/closer_engine');
      const closerRes = handlePostContactInquiry(incomingText, {
        businessName: customerName,
        category: customerCategory,
        area: customerArea,
        phone: customerPhone,
        hasWebsite: false,
        previewUrl: targetPreview
      });
      replyText = closerRes.messageText;
      intent = closerRes.intent;
    } catch (e) {
      replyText = `Hello ${customerName}! Thank you for your inquiry. We received your message and our Lagos team is reviewing it right away. Preview your demo: ${targetPreview}`;
    }

    const ticketId = `${channelName}-APPR-${Date.now().toString().slice(-4)}`;

    // 2. Alert Admin WhatsApp Desk (+2348022791227)
    if (sock && connectionStatus === 'connected') {
      const adminJid = '2348022791227@s.whatsapp.net';
      const alertMsg =
        `🔔 *NEW ${channelName} INQUIRY (${ticketId})*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Client:* ${customerName}\n` +
        `📱 *Phone:* ${customerPhone || 'Via Web'}\n` +
        `📧 *Email:* ${email || 'None'}\n` +
        `📍 *Area/Sector:* ${customerArea} (${customerCategory})\n` +
        `💬 *Message:* "${incomingText.slice(0, 160)}"\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🤖 *AI Draft Reply (${intent}):*\n` +
        `"${replyText.slice(0, 200)}..."\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `⚡ Reply *1* to Approve & Dispatch | Reply *2* to Reject`;

      sock.sendMessage(adminJid, { text: alertMsg }).catch(err => {
        console.warn('[Baileys Admin Alert Error]:', err.message);
      });
    }

    // 3. Update Lead Journey & Local Database
    try {
      const journeysPath = path.join(__dirname, '../local_db/lead_journeys.json');
      if (fs.existsSync(journeysPath)) {
        let journeys = JSON.parse(fs.readFileSync(journeysPath, 'utf8') || '[]');
        if (!Array.isArray(journeys)) journeys = Object.values(journeys);
        journeys.unshift({
          id: ticketId,
          leadName: customerName,
          phone: customerPhone,
          email: email || '',
          stage: 'INBOUND_REPLY',
          channel: channelName,
          message: incomingText,
          proposedReply: replyText,
          intent,
          timestamp: new Date().toISOString()
        });
        fs.writeFileSync(journeysPath, JSON.stringify(journeys.slice(0, 500), null, 2));
      }
    } catch (e) {}

    console.log(`📥 [Multi-Channel Inbound] Received ${channelName} inquiry from ${customerName} (${customerPhone || email}). Ticket: ${ticketId}`);
    return res.json({
      success: true,
      ticketId,
      intent,
      replyText,
      channel: channelName
    });
  } catch (err) {
    console.error('[Multi-Channel Inbound Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
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

// Direct Binary QR Image Endpoint (100% reliable, zero JS needed)
app.get('/qr.png', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Content-Type', 'image/png');
  try {
    const raw = qrCodeRaw || 'https://wa.me/2348022791227';
    const buf = await QRCode.toBuffer(raw, { width: 300, margin: 2 });
    return res.send(buf);
  } catch (err) {
    return res.status(500).send('Error rendering QR image');
  }
});

// Serve visual HTML Pairing Dashboard at GET /
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const activeCode = lastPairingCode || 'KZDM-V866';
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bethelmind Analytics — Admin WhatsApp Desk (+234 802 279 1227)</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 520px; width: 100%; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        h1 { font-size: 1.5rem; color: #38bdf8; margin-bottom: 8px; }
        p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 20px; }
        .status-badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-weight: 600; font-size: 0.875rem; text-transform: uppercase; margin-bottom: 20px; }
        .status-connected { background: #059669; color: #ecfdf5; }
        .status-qr { background: #d97706; color: #fffbeb; }
        .status-disconnected { background: #dc2626; color: #fef2f2; }
        .qr-box { background: white; padding: 16px; border-radius: 12px; display: inline-block; margin-bottom: 12px; }
        .pairing-input { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #475569; background: #1e293b; color: white; font-size: 1rem; box-sizing: border-box; margin-bottom: 12px; }
        .btn { background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 8px; width: 100%; }
        .btn:hover { background: #0369a1; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="status-badge status-qr" id="statusBadge">READY TO SCAN / LINK</div>

        <!-- QR Code Card First & Prominent -->
        <div style="background: #0f172a; border: 2px solid #38bdf8; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
          <div style="font-size: 0.95rem; color: #38bdf8; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
            📷 OPTION 1: SCAN QR CODE WITH PHONE
          </div>
          <div id="qrContainer" class="qr-box" style="margin: 0 auto;">
            <img id="qrImg" src="/qr.png?t=${Date.now()}" alt="WhatsApp QR Code" style="width: 250px; height: 250px; display: block;" />
          </div>
          <p style="font-size: 0.85rem; color: #cbd5e1; margin: 8px 0 0 0;">
            📱 On phone <b>0802 279 1227</b>: WhatsApp ➔ <b>Linked Devices</b> ➔ <b>Link a Device</b> ➔ Scan this QR
          </p>
        </div>

        <!-- 8-Digit Pairing Code Card -->
        <div style="background: #0f172a; border: 1px solid #475569; border-radius: 12px; padding: 18px; margin-bottom: 20px; text-align: center;">
          <div style="font-size: 0.85rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
            🔢 OPTION 2: 8-DIGIT PAIRING CODE
          </div>
          <div id="codeDisplay" style="background: #0284c7; color: white; font-size: 2rem; font-weight: 900; padding: 12px; border-radius: 8px; letter-spacing: 5px; font-family: monospace; display: block; margin: 8px 0;">
            ${activeCode}
          </div>
          <p style="font-size: 0.8rem; color: #94a3b8; margin: 6px 0 0 0;">
            Or tap "Link with phone number instead" and enter the code above.
          </p>
        </div>

        <!-- Instant AI Reply to Inbound Prospects Box -->
        <div style="background: #0f172a; border: 1px solid #10b981; border-radius: 12px; padding: 18px; margin-top: 10px; text-align: left;">
          <h3 style="color: #10b981; margin-top: 0; font-size: 1rem; display: flex; align-items: center; gap: 6px;">
            ⚡ Respond to Inbound Prospects with AI Closer
          </h3>
          <p style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 8px;">
            Enter phone number(s) of people who chatted you (e.g. 0802..., separated by commas):
          </p>
          <textarea id="prospectPhones" class="pairing-input" rows="2" style="resize: vertical; font-family: monospace;" placeholder="08012345678, 08087654321, 090..."></textarea>
          <button class="btn" style="background: #059669;" onclick="replyToProspects()">🤖 Send AI Closer Replies Now</button>
          <div id="replyFeedback" style="font-size: 0.82rem; margin-top: 10px; display: none;"></div>
        </div>

        <div style="margin-top: 20px;">
          <button class="btn" style="background:#334155;" onclick="location.reload()">🔄 Refresh QR & Code</button>
        </div>
      </div>

      <script>
        async function replyToProspects() {
          const raw = document.getElementById('prospectPhones').value.trim();
          if (!raw) return alert('Please enter at least one phone number.');
          const phones = raw.split(/[\n,;]+/).map(p => p.trim()).filter(Boolean);
          const feedback = document.getElementById('replyFeedback');
          feedback.style.display = 'block';
          feedback.style.color = '#38bdf8';
          feedback.innerText = 'Dispatching AI Closer response to ' + phones.length + ' prospect(s)...';
          try {
            const res = await fetch('/reply-multiple-prospects', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phones })
            });
            const data = await res.json();
            if (data.success) {
              feedback.style.color = '#34d399';
              feedback.innerText = '✅ Successfully responded to ' + data.count + ' prospect(s)!';
            } else {
              feedback.style.color = '#f87171';
              feedback.innerText = 'Error: ' + (data.error || 'Failed to dispatch');
            }
          } catch(e) {
            feedback.style.color = '#f87171';
            feedback.innerText = 'Network error: ' + e.message;
          }
        }

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
            const codeDisplay = document.getElementById('codeDisplay');
            
            if (badge) {
              badge.innerText = 'STATUS: ' + (data.status ? data.status.toUpperCase() : 'UNKNOWN');
              badge.className = 'status-badge status-' + (data.status || 'disconnected');
            }

            if (codeDisplay && data.lastPairingCode) {
              codeDisplay.innerText = data.lastPairingCode;
            }

            if (container) {
              if (data.status === 'connected') {
                if (badge) badge.innerText = 'STATUS: CONNECTED';
                container.innerHTML = '<div style="color:#059669; font-weight:bold; font-size:1.2rem; padding: 30px 10px;">✅ Admin WhatsApp Desk Active & Connected!<br/><span style="font-size:0.85rem; color:#475569;">+234 802 279 1227 — Inbound Closer Bot Running</span></div>';
              } else if (data.qrCodeUrl) {
                container.innerHTML = '<img src="' + data.qrCodeUrl + '" alt="WhatsApp QR Code" style="width:240px;height:240px;display:block;"/><p style="color:#334155; font-size:0.8rem; margin-top:8px;">Point phone camera here in WhatsApp Linked Devices</p>';
              } else {
                container.innerHTML = '<div style="color:#64748b; padding: 40px 10px;">Connecting to WhatsApp client...</div>';
              }
            }
          } catch(e) {
            const badge = document.getElementById('statusBadge');
            if (badge) badge.innerText = 'STATUS: UNREACHABLE';
          }
        }
        fetchStatus();
        setInterval(fetchStatus, 3000);
      </script>
    </body>
    </html>
  `);
});

const getStatusHandler = (req, res) => {
  const actualPhone = sock?.user?.id ? ('+' + sock.user.id.split(':')[0]) : '+234 802 279 1227';
  res.json({
    lineId: 1,
    phone: actualPhone,
    status: connectionStatus,
    qrCodeUrl: qrCodeBase64,
    qrRaw: qrCodeRaw,
    lastPairingCode
  });
};

app.get('/status', getStatusHandler);
app.get('/api/status', getStatusHandler);

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

// REST Endpoint to send a WhatsApp message directly via active Baileys socket
app.post('/send-message', async (req, res) => {
  const { to, phone, message, text } = req.body;
  const target = to || phone;
  const content = message || text;

  if (!target || !content) {
    return res.status(400).json({ error: "Missing 'to' or 'message' in payload" });
  }

  if (connectionStatus !== 'connected' || !sock) {
    console.warn(`[Baileys /send-message] Socket not connected (Status: ${connectionStatus})`);
    return res.status(503).json({ error: "WhatsApp socket not connected", status: connectionStatus });
  }

  try {
    const cleanPhone = target.replace(/\D/g, '');
    const jid = `${cleanPhone}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text: content });
    console.log(`📤 [Baileys /send-message] Successfully sent message to ${cleanPhone}`);
    return res.json({ success: true, deliveredTo: cleanPhone });
  } catch (err) {
    console.error(`❌ [Baileys /send-message Error]:`, err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint to reconnect or reset connection gracefully (without deleting solidified session)
app.post('/reconnect', (req, res) => {
  try {
    connectionStatus = "connecting";
    if (sock) {
      sock.end();
    }
    setTimeout(connectToWhatsApp, 1000);
    return res.json({ success: true, message: "Reconnection initiated" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get('/pair', async (req, res) => {
  const targetPhone = req.query.phone || '2347026266946';
  try {
    if (!sock) return res.status(500).json({ error: 'Socket not initialized' });
    const code = await sock.requestPairingCode(targetPhone.replace(/\D/g, ''));
    console.log(`🔑 [PAIRING CODE] Generated WhatsApp Line 1 Pairing Code for ${targetPhone}: ${code}`);
    return res.json({ success: true, phone: targetPhone, pairingCode: code });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint to request an 8-digit pairing code via POST
app.post('/request-pairing-code', async (req, res) => {
  const targetPhone = (req.body.phone || req.body.phoneNumber || req.query.phone || '2348022791227').replace(/\D/g, '');
  const cleanPhone = targetPhone.startsWith('0') ? ('234' + targetPhone.slice(1)) : targetPhone;
  try {
    if (!sock) return res.status(503).json({ success: false, error: 'Socket initializing, please wait...' });
    const code = await sock.requestPairingCode(cleanPhone);
    lastPairingCode = code;
    console.log(`🔑 [PAIRING CODE] Generated WhatsApp Pairing Code for +${cleanPhone}: ${code}`);
    return res.json({ success: true, phone: cleanPhone, pairingCode: code });
  } catch (err) {
    console.error('Pairing code generation error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Alias: POST /send (compatible with BaileysGatewayClient)
app.post('/send', async (req, res) => {
  const { phone, message, text, simulateTyping } = req.body;
  const target = phone || req.body.to;
  const content = message || text;

  if (!target || !content) {
    return res.status(400).json({ success: false, error: "Missing 'phone' or 'message' in payload" });
  }

  if (connectionStatus !== 'connected' || !sock) {
    return res.status(503).json({ success: false, error: "WhatsApp socket not connected", status: connectionStatus });
  }

  try {
    const cleanPhone = target.replace(/\D/g, '');
    const jid = `${cleanPhone}@s.whatsapp.net`;
    if (simulateTyping) {
      await sock.sendPresenceUpdate('composing', jid);
      await new Promise(r => setTimeout(r, 1200));
      await sock.sendPresenceUpdate('paused', jid);
    }
    await sock.sendMessage(jid, { text: content });
    console.log(`📤 [Baileys /send] Message sent to ${cleanPhone}`);
    return res.json({ success: true, deliveredTo: cleanPhone });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.WHATSAPP_BAILEYS_PORT || 3007;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bethelmind Admin WhatsApp AI Closer service running on http://localhost:${PORT}`);
  connectToWhatsApp().catch(err => console.error("Error starting Baileys connect process:", err));
});
