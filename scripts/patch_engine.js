const fs = require('fs');

let content = fs.readFileSync('src/lib/pillar2/pillar2Engine.ts', 'utf8');

// 1. Upgrade fallback phone logic
const target1 = "  const rawContact = ticket?.targetContactPhone || ticket?.actionPayload?.recipientPhone || '08021061457';";
const repl1 = `  let rawContact = ticket?.targetContactPhone || ticket?.actionPayload?.recipientPhone;
  const targetBrokerName = ticket?.targetBusinessName || ticket?.actionPayload?.recipientName || '';
  if (!rawContact || rawContact.includes('8021061457') || rawContact.includes('7052090118') || rawContact.includes('8023456781')) {
    if (targetBrokerName.includes('Ora Egbunike')) rawContact = '08038774238';
    else if (targetBrokerName.includes('Jide Taiwo')) rawContact = '07052090092';
    else if (targetBrokerName.includes('Diya Fatimilehin')) rawContact = '09053964068';
    else {
      const listingIdx = PRIME_LUXURY_LISTINGS.findIndex(l => ticketId.startsWith(l.id));
      const fallbackBroker = VERIFIED_NIGERIAN_BROKERS[(listingIdx >= 0 ? listingIdx : 0) % VERIFIED_NIGERIAN_BROKERS.length];
      rawContact = fallbackBroker.phone;
    }
  }`;

if (content.includes(target1)) {
  content = content.replace(target1, repl1);
  console.log('Patch 1: Upgraded fallback phone logic applied.');
} else {
  console.log('Patch 1 NOT found (checking CRLF)...');
}

// 2. Strict status reporting (no false multi-channel success if WhatsApp fails)
const target2 = `  if (activeGateways.length > 0) {
    queueItem.status = 'DISPATCHED_MULTI_CHANNEL';
    queueItem.dispatchedAt = new Date().toISOString();
    queueItem.gateway = activeGateways.join(' + ');
    inMemoryDispatched.push(queueItem);
    try {
      await recordPillar2Dispatch({
        ticketId,
        recipient: recipientEmail || e164,
        channel: activeGateways.join(' + ')
      });
    } catch (_) {}
  } else {
    queueItem.status = 'DIRECT_CHAT_READY';
    queueItem.gateway = 'Direct Multi-Channel (1-Tap WhatsApp, SMS & Email)';
  }`;

const repl2 = `  // 🛡️ STRICT REAL-ACTION REPORTING: WhatsApp delivery must be genuine
  if (waResult.dispatched) {
    queueItem.status = 'DISPATCHED_MULTI_CHANNEL';
    queueItem.dispatchedAt = new Date().toISOString();
    queueItem.gateway = activeGateways.join(' + ');
    inMemoryDispatched.push(queueItem);
    try {
      await recordPillar2Dispatch({
        ticketId,
        recipient: recipientEmail || e164,
        channel: activeGateways.join(' + ')
      });
    } catch (_) {}
  } else if (activeGateways.length > 0) {
    // Email or SMS went through, but WhatsApp did not
    queueItem.status = 'DISPATCHED_EMAIL_ONLY';
    queueItem.dispatchedAt = new Date().toISOString();
    queueItem.gateway = activeGateways.join(' + ') + ' (WhatsApp: PENDING/FAILED)';
    inMemoryDispatched.push(queueItem);
  } else {
    queueItem.status = 'DIRECT_CHAT_READY';
    queueItem.gateway = 'Direct Multi-Channel (1-Tap WhatsApp, SMS & Email)';
  }`;

if (content.includes(target2)) {
  content = content.replace(target2, repl2);
  console.log('Patch 2: Strict dispatch reporting applied.');
} else {
  // Try CRLF variant
  const target2CRLF = target2.replace(/\n/g, '\r\n');
  if (content.includes(target2CRLF)) {
    content = content.replace(target2CRLF, repl2.replace(/\n/g, '\r\n'));
    console.log('Patch 2 (CRLF): Strict dispatch reporting applied.');
  } else {
    console.log('Patch 2 NOT matched!');
  }
}

fs.writeFileSync('src/lib/pillar2/pillar2Engine.ts', content, 'utf8');
console.log('Saved src/lib/pillar2/pillar2Engine.ts');
