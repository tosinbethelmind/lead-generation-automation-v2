const fs = require('fs');

let content = fs.readFileSync('scripts/evolution_api_server.js', 'utf8');

// 1. Patch messages.upsert
const targetUpsert = `    // Inbound Sales Closer & Auto-Reply Listener
    inst.socket.ev.on('messages.upsert', async ({ messages, type }) => {
      console.log(\`[Evolution API] 📥 Raw messages.upsert event: count=\${messages?.length}, type=\${type} on \${inst.label}\`);
      for (const msg of messages || []) {
        if (!msg.message) continue;
        const senderJid = msg.key?.remoteJid || '';
        const fromMe = Boolean(msg.key?.fromMe);
        const text = extractMessageText(msg);
        console.log(\`[Evolution API] 📩 Packet from \${senderJid} (fromMe: \${fromMe}): "\${text}"\`);
        
        // Allow self-test if user typed into their own chat (08022791227)
        const isSelfTest = senderJid.includes('8022791227') && inst.id === 1;
        if (fromMe && !isSelfTest) {
          console.log(\`[Evolution API] ⏭️ Skipping message (fromMe: true and not self-test)\`);
          continue;
        }
        await handleInboundMessage(inst, msg);
      }
    });`;

const replUpsert = `    // Inbound Sales Closer & Auto-Reply Listener
    inst.socket.ev.on('messages.upsert', async ({ messages, type }) => {
      for (const msg of messages || []) {
        if (!msg.message) continue;
        const senderJid = msg.key?.remoteJid || '';
        const fromMe = Boolean(msg.key?.fromMe);

        // 🛡️ STRICT LOOP & SPAM PREVENTION: Never auto-reply to outgoing messages!
        // Under NO circumstance should any message with fromMe=true trigger an auto-reply!
        if (fromMe) {
          continue;
        }

        // 🛡️ Filter out WhatsApp status broadcasts, newsletters, and group chats
        if (
          !senderJid ||
          senderJid === 'status@broadcast' ||
          senderJid.endsWith('@broadcast') ||
          senderJid.endsWith('@newsletter') ||
          senderJid.endsWith('@g.us')
        ) {
          continue;
        }

        const text = extractMessageText(msg);
        if (!text || !text.trim()) continue;

        console.log(\`[Evolution API] 📩 Valid Inbound Packet from \${senderJid}: "\${text.substring(0, 60)}"\`);
        await handleInboundMessage(inst, msg);
      }
    });`;

const targetUpsertCRLF = targetUpsert.replace(/\n/g, '\r\n');
const replUpsertCRLF = replUpsert.replace(/\n/g, '\r\n');

if (content.includes(targetUpsert)) {
  content = content.replace(targetUpsert, replUpsert);
  console.log('Patch 1: messages.upsert applied (LF).');
} else if (content.includes(targetUpsertCRLF)) {
  content = content.replace(targetUpsertCRLF, replUpsertCRLF);
  console.log('Patch 1: messages.upsert applied (CRLF).');
} else {
  console.log('Patch 1 NOT found!');
}

// 2. Patch handleInboundMessage
const targetInbound = `    // Dynamically load upgraded closer engine
    delete require.cache[require.resolve('./lib/closer_engine')];
    const { handlePostContactInquiryAsync, lookupLeadForWhatsApp } = require('./lib/closer_engine');

    const leadInfo = lookupLeadForWhatsApp(cleanSender, text);
    const decision = await handlePostContactInquiryAsync(text, {
      businessName: leadInfo.businessName,
      category: leadInfo.category,
      area: leadInfo.area,
      phone: cleanSender,
      slug: leadInfo.slug,
      previewUrl: leadInfo.previewUrl,
      hasMediaImage: Boolean(msg.message?.imageMessage)
    });`;

const replInbound = `    // Dynamically load upgraded closer engine & dual-pillar registries
    delete require.cache[require.resolve('./lib/closer_engine')];
    try { delete require.cache[require.resolve('./lib/pillar2_closer')]; } catch (_) {}
    try { delete require.cache[require.resolve('./lib/pillar2_contacts_registry')]; } catch (_) {}
    const { handlePostContactInquiryAsync, lookupLeadForWhatsApp } = require('./lib/closer_engine');

    const leadInfo = lookupLeadForWhatsApp(cleanSender, text);
    const decision = await handlePostContactInquiryAsync(text, {
      businessName: leadInfo.businessName,
      category: leadInfo.category,
      area: leadInfo.area,
      phone: cleanSender,
      slug: leadInfo.slug,
      previewUrl: leadInfo.previewUrl,
      hasMediaImage: Boolean(msg.message?.imageMessage),
      isPillar2: Boolean(leadInfo.isPillar2),
      broker: leadInfo.broker,
      propertyListing: leadInfo.propertyListing,
      ticketId: leadInfo.ticketId
    });`;

const targetInboundCRLF = targetInbound.replace(/\n/g, '\r\n');
const replInboundCRLF = replInbound.replace(/\n/g, '\r\n');

if (content.includes(targetInbound)) {
  content = content.replace(targetInbound, replInbound);
  console.log('Patch 2: handleInboundMessage applied (LF).');
} else if (content.includes(targetInboundCRLF)) {
  content = content.replace(targetInboundCRLF, replInboundCRLF);
  console.log('Patch 2: handleInboundMessage applied (CRLF).');
} else {
  console.log('Patch 2 NOT found!');
}

fs.writeFileSync('scripts/evolution_api_server.js', content, 'utf8');
console.log('Saved scripts/evolution_api_server.js');
