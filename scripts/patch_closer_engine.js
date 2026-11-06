const fs = require('fs');

let content = fs.readFileSync('scripts/lib/closer_engine.js', 'utf8');

const target = `  const p2Check = isPillar2Conversation(leadData.phone, rawMsg, leadData);
  if (p2Check.isPillar2) {
    const p2Decision = handlePillar2Inquiry(rawMsg, {
      ...leadData,
      broker: p2Check.broker
    });

    const SPECIFIC_P2_INTENTS = [
      'PILLAR2_MANDATE_UNAVAILABLE',
      'PILLAR2_BUYER_IDENTITY_PROTOCOL',
      'PILLAR2_COMMISSION_ASSERTION',
      'PILLAR2_DISPATCH_JIM',
      'PILLAR2_AVAILABILITY_CONFIRMED',
      'PILLAR2_INSPECTION_SCHEDULING',
      'PILLAR2_CORPORATE_CREDENTIALS',
      'PILLAR2_CALL_REQUEST'
    ];

    if (SPECIFIC_P2_INTENTS.includes(p2Decision.intent)) {
      return p2Decision;
    }

    // Try Gemini with Pillar 2 Real Estate context for open-ended queries
    try {
      const geminiText = await generateGeminiReply(rawMsg, {
        isPillar2: true,
        businessName: p2Check.broker ? p2Check.broker.name : (leadData.businessName || 'Partner Firm'),
        propertyListing: p2Check.broker ? p2Check.broker.defaultListing : 'Prime Luxury Lagos Listing'
      });
      if (geminiText) {
        return {
          intent: 'PILLAR2_GEMINI_DYNAMIC_CLOSER',
          isOptOut: false,
          messageText: geminiText,
          suggestedAction: 'ENGAGE_PILLAR2_GEMINI'
        };
      }
    } catch (_) {}

    return p2Decision;
  }`;

const repl = `  const p2Check = isPillar2Conversation(leadData.phone, rawMsg, leadData);
  const isPillar2Active = Boolean(p2Check.isPillar2 || leadData.isPillar2);

  if (isPillar2Active) {
    const brokerObj = p2Check.broker || leadData.broker || null;
    const p2Decision = handlePillar2Inquiry(rawMsg, {
      ...leadData,
      broker: brokerObj
    });

    const SPECIFIC_P2_INTENTS = [
      'PILLAR2_MANDATE_UNAVAILABLE',
      'PILLAR2_CORPORATE_IDENTITY',
      'PILLAR2_EXECUTIVE_GREETING',
      'PILLAR2_AVAILABILITY_CONFIRMED',
      'PILLAR2_BUYER_IDENTITY_PROTOCOL',
      'PILLAR2_COMMISSION_ASSERTION',
      'PILLAR2_DISPATCH_JIM',
      'PILLAR2_INSPECTION_SCHEDULING',
      'PILLAR2_CORPORATE_CREDENTIALS',
      'PILLAR2_CALL_REQUEST'
    ];

    if (SPECIFIC_P2_INTENTS.includes(p2Decision.intent)) {
      return p2Decision;
    }

    // Try Gemini with Pillar 2 Real Estate context for open-ended queries
    try {
      const brokerDisplayName = brokerObj ? (brokerObj.brokerName || brokerObj.name) : (leadData.businessName || 'Partner Firm');
      const geminiText = await generateGeminiReply(rawMsg, {
        isPillar2: true,
        businessName: brokerDisplayName,
        propertyListing: brokerObj ? (brokerObj.defaultListing || 'Prime Luxury Lagos Listing') : 'Prime Luxury Lagos Listing'
      });
      if (geminiText) {
        return {
          intent: 'PILLAR2_GEMINI_DYNAMIC_CLOSER',
          isOptOut: false,
          messageText: geminiText,
          suggestedAction: 'ENGAGE_PILLAR2_GEMINI'
        };
      }
    } catch (_) {}

    // 🛡️ STRICT INVARIANT: If Pillar 2, NEVER EVER fall back to Pillar 1 SME copy!
    return p2Decision;
  }`;

const targetCRLF = target.replace(/\n/g, '\r\n');
const replCRLF = repl.replace(/\n/g, '\r\n');

if (content.includes(target)) {
  content = content.replace(target, repl);
  console.log('Patch 2 applied (LF).');
} else if (content.includes(targetCRLF)) {
  content = content.replace(targetCRLF, replCRLF);
  console.log('Patch 2 applied (CRLF).');
} else {
  console.log('Patch 2 NOT found!');
}

fs.writeFileSync('scripts/lib/closer_engine.js', content, 'utf8');
