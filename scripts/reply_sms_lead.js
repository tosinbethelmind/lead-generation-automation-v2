/**
 * @file scripts/reply_sms_lead.js
 * 
 * 📱 INSTANT CARRIER SMS REPLY & CONVERSION DISPATCHER
 * 
 * Usage:
 *   node scripts/reply_sms_lead.js <phone> [incoming_message_or_question]
 * 
 * Examples:
 *   node scripts/reply_sms_lead.js 08034567891
 *   node scripts/reply_sms_lead.js 08034567891 "I don't understand"
 *   node scripts/reply_sms_lead.js 08034567891 "How much is it?"
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
function cleanPhone(rawPhone) {
  if (!rawPhone) return null;
  let digits = String(rawPhone).replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 14) return null;
  if (/0000|1111|8888|9999|123456|666777/.test(digits)) return null;
  if (digits.startsWith('234') && digits.length === 13) return '+' + digits;
  if (digits.startsWith('0') && digits.length === 11) return '+234' + digits.substring(1);
  if (digits.length === 10) return '+234' + digits;
  return '+' + digits;
}

const GATEWAY_URL = 'http://192.168.0.153:8082/message';
const SMS_TOKEN = 'f34af5ea-f657-41b1-b83e-4a59eb786e57';
const LEADS_DB_PATH = path.join(__dirname, '../local_db/leads_db.json');
const CRM_LEADS_PATH = path.join(__dirname, '../local_db/crm_leads.json');

function cleanBusinessName(name) {
  if (!name) return 'Commercial Business';
  return name.split('||')[0].split('|')[0].split('-')[0].trim();
}

function generateSlug(name, leadId) {
  if (leadId && typeof leadId === 'string' && leadId.length > 3 && !leadId.startsWith('lead_')) {
    return leadId;
  }
  return cleanBusinessName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'lagos-business';
}

function findLeadByPhone(rawPhone) {
  const targetPhone = String(rawPhone).replace(/\D/g, '');
  let allLeads = [];

  if (fs.existsSync(LEADS_DB_PATH)) {
    try { allLeads = allLeads.concat(JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'))); } catch (_) {}
  }
  if (fs.existsSync(CRM_LEADS_PATH)) {
    try { allLeads = allLeads.concat(JSON.parse(fs.readFileSync(CRM_LEADS_PATH, 'utf8'))); } catch (_) {}
  }

  const matched = allLeads.find(l => {
    const p = (l.phone || l.phone_e164 || l.phone_raw || '').replace(/\D/g, '');
    return p && (targetPhone.endsWith(p.slice(-10)) || p.endsWith(targetPhone.slice(-10)));
  });

  return matched || null;
}

function buildSmsReply(lead, incomingText = '') {
  const rawName = cleanBusinessName(lead?.name || lead?.business_name || 'Business');
  const cleanName = rawName.length > 14 ? rawName.slice(0, 12).trim() : rawName;
  const slug = generateSlug(cleanName, lead?.lead_id || lead?.id);
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const lower = (incomingText || '').toLowerCase();

  let reply = '';

  if (/price|cost|how much|fee|charges/i.test(lower)) {
    reply = `Good day ${cleanName}! Preview is ₦0 free. Setup is ₦75,000 deposit (₦150k total, 48h SLA) or ₦35k for existing sites. WhatsApp: wa.me/2348022791227`;
  } else if (/who are you|where did you get|who is this/i.test(lower)) {
    reply = `We are Bethelmind Analytics Lagos. We built a free sample website & 24/7 WhatsApp quoter for your business. Chat us: wa.me/2348022791227`;
  } else {
    // Default: Clarification & Free Preview Invitation
    reply = `Good day ${cleanName}! We made a free sample website for your business to get clients on WhatsApp. View free: ${previewUrl} or call 08022791227`;
  }

  // Strict <= 158 characters invariant (1 SMS credit)
  if (reply.length > 158) {
    reply = reply.slice(0, 158);
  }

  return { reply, cleanName, previewUrl };
}

async function sendReply(phoneArg, messageArg = '') {
  if (!phoneArg) {
    console.error('❌ Missing phone argument! Usage: node scripts/reply_sms_lead.js <phone> [question]');
    process.exit(1);
  }

  const cleanP = cleanPhone(phoneArg);
  if (!cleanP) {
    console.error(`❌ Invalid Nigerian phone format: ${phoneArg}`);
    process.exit(1);
  }

  const lead = findLeadByPhone(cleanP);
  const { reply, cleanName, previewUrl } = buildSmsReply(lead, messageArg);

  console.log('\n======================================================');
  console.log('📤 DISPATCHING CARRIER SMS REPLY');
  console.log('======================================================');
  console.log(`📱 Recipient: ${cleanP} (${cleanName})`);
  console.log(`💬 Inbound Question: "${messageArg || '(General / Confusion)'}"`);
  console.log(`📝 Outbound Reply (${reply.length} chars): "${reply}"`);
  console.log(`🌐 Target Demo URL: ${previewUrl}`);
  console.log('------------------------------------------------------');

  try {
    const res = await axios.post(GATEWAY_URL, {
      to: cleanP,
      message: reply
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': SMS_TOKEN
      },
      timeout: 5000
    });

    console.log(`✅ SMS SUCCESSFULLY DELIVERED via ${GATEWAY_URL}`);
    console.log(`Status: ${res.status}`);
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Failed to send SMS reply:', err.response?.data || err.message);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const phone = args[0];
  const msg = args.slice(1).join(' ');
  sendReply(phone, msg);
}

module.exports = { sendReply, buildSmsReply, findLeadByPhone, cleanPhone };
