/**
 * @file scripts/reply_dual_channel.js
 * 
 * 🚀 DUAL-CHANNEL INSTANT CONVERSION DISPATCHER (SMS + WHATSAPP)
 * 
 * Delivers simultaneous synchronized responses across BOTH channels:
 * 1. Carrier GSM SMS: Short, crisp, 1-credit clarification (< 158 chars) with demo link.
 * 2. WhatsApp DM: Full rich AI Closer message with live prototype link, 15s audio note, and OPay settlement details.
 * 
 * Usage:
 *   node scripts/reply_dual_channel.js <phone> [inbound_message]
 * 
 * Example:
 *   node scripts/reply_dual_channel.js 08034567891 "I don't understand"
 */

const axios = require('axios');
const { sendReply: sendSmsReply, buildSmsReply, findLeadByPhone, cleanPhone } = require('./reply_sms_lead');

const BAILEYS_URL = 'http://localhost:3007/trigger-closer-reply';

async function replyDualChannel(phoneInput, inboundMessage = '') {
  if (!phoneInput) {
    console.error('❌ Missing phone argument! Usage: node scripts/reply_dual_channel.js <phone> [inbound_message]');
    process.exit(1);
  }

  const cleanP = cleanPhone(phoneInput);
  if (!cleanP) {
    console.error(`❌ Invalid Nigerian phone format: ${phoneInput}`);
    process.exit(1);
  }

  const lead = findLeadByPhone(cleanP);
  const name = lead?.name || lead?.business_name || 'Business Owner';

  console.log('\n======================================================');
  console.log(`⚡ EXECUTING DUAL-CHANNEL CONVERSION: ${cleanP}`);
  console.log(`🏢 Business: ${name}`);
  console.log(`💬 Inbound Text: "${inboundMessage || '(General / Confusion)'}"`);
  console.log('======================================================');

  // CHANNEL 1: Carrier GSM SMS Reply (<= 158 chars)
  console.log('\n[1/2] 📤 Sending Carrier GSM SMS Reply...');
  try {
    await sendSmsReply(cleanP, inboundMessage);
    console.log('✅ Channel 1: Carrier GSM SMS dispatched successfully.');
  } catch (smsErr) {
    console.error('❌ Channel 1 Error (SMS):', smsErr.message);
  }

  // CHANNEL 2: WhatsApp AI Closer Message
  console.log('\n[2/2] 💬 Sending WhatsApp AI Closer Message...');
  try {
    const waRes = await axios.post(BAILEYS_URL, {
      phone: cleanP,
      message: inboundMessage || "I don't understand the message"
    }, { timeout: 8000 });

    if (waRes.data && waRes.data.success) {
      console.log('✅ Channel 2: WhatsApp AI Closer message delivered successfully!');
    } else {
      console.log('⚠️ Channel 2: WhatsApp response:', waRes.data);
    }
  } catch (waErr) {
    console.log(`ℹ️ Channel 2 (WhatsApp): ${waErr.response?.data?.error || waErr.message}`);
  }

  console.log('\n======================================================');
  console.log(`🎉 DUAL-CHANNEL SEQUENCE COMPLETE FOR ${cleanP}`);
  console.log('======================================================\n');
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const phone = args[0];
  const msg = args.slice(1).join(' ');
  replyDualChannel(phone, msg);
}

module.exports = { replyDualChannel };
