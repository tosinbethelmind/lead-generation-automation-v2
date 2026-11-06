import sys

path = 'scripts/lib/closer_engine.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add require('./pillar2_closer') near top
import_target = "const { cleanBusinessName, getShortBrand, isGarbageOrId } = require('./nameSanitizer');"
import_replacement = """const { cleanBusinessName, getShortBrand, isGarbageOrId } = require('./nameSanitizer');
const { isPillar2Conversation, handlePillar2Inquiry } = require('./pillar2_closer');"""

# 2. Add Pillar 2 check inside lookupLeadForWhatsApp
lookup_target = """function lookupLeadForWhatsApp(senderPhone, incomingText = '') {
  const cleanPhone = String(senderPhone || '').replace(/\\D/g, '');"""

lookup_replacement = """function lookupLeadForWhatsApp(senderPhone, incomingText = '') {
  const cleanPhone = String(senderPhone || '').replace(/\\D/g, '');

  // 🏛️ PILLAR 2 CHECK: Route luxury real estate brokers immediately
  const p2Check = isPillar2Conversation(senderPhone, incomingText, {});
  if (p2Check.isPillar2) {
    const b = p2Check.broker;
    return {
      isPillar2: true,
      businessName: b ? b.name : 'Real Estate Partner',
      category: 'Real Estate & Properties',
      area: b ? b.city : 'Lagos',
      phone: senderPhone,
      broker: b,
      propertyListing: b ? b.defaultListing : 'Prime Luxury Lagos Mandate',
      ticketId: b ? b.defaultTicketId : 'DEAL-MANDATE-DESK',
      previewUrl: 'https://www.bethelmindanalytics.com/mandate'
    };
  }"""

# 3. Add Pillar 2 check inside handlePostContactInquiry
sync_target = """function handlePostContactInquiry(clientMessage, leadData = {}) {
  const rawMsg = String(clientMessage || '').trim();
  const msg = rawMsg.toLowerCase();"""

sync_replacement = """function handlePostContactInquiry(clientMessage, leadData = {}) {
  const rawMsg = String(clientMessage || '').trim();
  const msg = rawMsg.toLowerCase();

  // 🏛️ PILLAR 2 CHECK: Luxury Real Estate Co-Brokerage Gate
  const p2Check = isPillar2Conversation(leadData.phone, rawMsg, leadData);
  if (p2Check.isPillar2) {
    return handlePillar2Inquiry(rawMsg, {
      ...leadData,
      broker: p2Check.broker
    });
  }"""

# 4. Add Pillar 2 check inside handlePostContactInquiryAsync
async_target = """async function handlePostContactInquiryAsync(clientMessage, leadData = {}) {
  // 1. Run deterministic matrix first
  const deterministicDecision = handlePostContactInquiry(clientMessage, leadData);"""

async_replacement = """async function handlePostContactInquiryAsync(clientMessage, leadData = {}) {
  const rawMsg = String(clientMessage || '').trim();

  // 🏛️ PILLAR 2 CHECK: High-Ticket Real Estate Mandate Intelligence
  const p2Check = isPillar2Conversation(leadData.phone, rawMsg, leadData);
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
  }

  // 1. Run deterministic matrix first
  const deterministicDecision = handlePostContactInquiry(clientMessage, leadData);"""

content_norm = content.replace('\r\n', '\n')
import_target_norm = import_target.replace('\r\n', '\n')
import_replacement_norm = import_replacement.replace('\r\n', '\n')

lookup_target_norm = lookup_target.replace('\r\n', '\n')
lookup_replacement_norm = lookup_replacement.replace('\r\n', '\n')

sync_target_norm = sync_target.replace('\r\n', '\n')
sync_replacement_norm = sync_replacement.replace('\r\n', '\n')

async_target_norm = async_target.replace('\r\n', '\n')
async_replacement_norm = async_replacement.replace('\r\n', '\n')

assert import_target_norm in content_norm, "import_target not found"
content_norm = content_norm.replace(import_target_norm, import_replacement_norm, 1)

assert lookup_target_norm in content_norm, "lookup_target not found"
content_norm = content_norm.replace(lookup_target_norm, lookup_replacement_norm, 1)

assert sync_target_norm in content_norm, "sync_target not found"
content_norm = content_norm.replace(sync_target_norm, sync_replacement_norm, 1)

assert async_target_norm in content_norm, "async_target not found"
content_norm = content_norm.replace(async_target_norm, async_replacement_norm, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_norm)

print("SUCCESS: scripts/lib/closer_engine.js patched with Pillar 2 routing!")
