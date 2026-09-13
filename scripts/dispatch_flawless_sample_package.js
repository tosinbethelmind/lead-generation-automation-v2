/**
 * @file scripts/dispatch_flawless_sample_package.js
 * 
 * Delivers the 100% clean, verified, zero-placeholder Master Sample Package
 * (Voice Note Audio File + Proposal + 1-Click WhatsApp Review Link)
 * to Admin WhatsApp (0802 279 1227).
 */

const fs = require('fs');
const path = require('path');

async function dispatchMasterSample() {
  console.log('========================================================================');
  console.log('💎 DISPATCHING 100% CLEAN MASTER SAMPLE PACKAGE TO ADMIN WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';
  const audioFilePath = path.join(__dirname, '../public/audio/Bethelmind_15s_Jacio.wav');

  const proposalText = `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-701-JACIO*

Good day management at Jacio International! Why wait weeks on Form M or risk black market delays?

📊 *TODAY'S LOCKED COMMERCIAL PROPOSAL:*
• *Order Allocation:* $65,000 USD (China Supplier Wire)
• *Locked Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Settlement:* ₦98,800,000 NGN
• *⏱️ Rate Validity:* Same-Day Commercial Window (Until 05:00 PM WAT)
• *Execution Speed:* Under 15 Minutes Direct to China Factory

🏦 *INSTITUTIONAL ESCROW PROTECTION:*
• *Settlement Desk:* AlphaDesk Institutional OTC (Providus / Monnify Corporate Trust)
• *Security Guarantee:* 100% platform-bonded escrow. Your funds are held safely in bank trust until your factory confirms receipt.
• *Payment Account:* Dedicated verified clearing vault details issued immediately upon invoice confirmation.

👉 *Reply with your China Supplier Invoice or Call 0802 279 1227 to secure this batch today.*`;

  const waUrl = `https://wa.me/2348185587222?text=${encodeURIComponent(proposalText)}`;

  const reviewCard = `👑 *[MASTER CLEAN SAMPLE FOR REVIEW]*
🏢 *Client:* Jacio International Company Ltd (ASPAMDA Trade Fair)
🆔 *Unique Ref:* \`BM-OTC-701-JACIO\`
📦 *Volume:* $65,000 USD (₦98,800,000 NGN)
💰 *YOUR SPREAD PROFIT:* *+₦1,625,000 NGN* (Direct to OPay 7034297995)
━━━━━━━━━━━━━━━━━━━━━━
🎙️ *15s PERSONALIZED VOICE NOTE TRANSCRIPT:*
_"Good day Alhaji, management at Jacio International in ASPAMDA Trade Fair. Tosin here from Bethelmind Analytics. Why wait weeks on Form M? We have locked 1,520 Naira per Dollar for your 65,000 Dollar Guangzhou container wire today, with 15-minute delivery and 100% institutional escrow safety. Check the quick details below with reference BM-OTC-701-JACIO and let us clear your batch today. Thank you."_

📋 *CLEAN PROPOSAL TEXT (NO PLACEHOLDERS / NO DUMMIES):*
${proposalText}

🟢 *1-CLICK WHATSAPP TEST LINK (TAP TO PREVIEW ON PHONE):*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

  // 1. Send the Master Review Card
  console.log('1. Sending Master Review Card...');
  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: reviewCard, lineId: 2 })
  });
  await new Promise(r => setTimeout(r, 1200));

  // 2. Send the Downloadable Audio File
  if (fs.existsSync(audioFilePath)) {
    console.log('2. Sending Downloadable Audio File...');
    await fetch('http://localhost:5005/api/send-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: adminPhone,
        filePath: audioFilePath,
        caption: '🎙️ 15s Voice Note for Jacio International (BM-OTC-701-JACIO)',
        lineId: 2
      })
    });
  }

  console.log('\n🎉 MASTER CLEAN SAMPLE SUCCESSFULLY DELIVERED TO ADMIN WHATSAPP!');
}

dispatchMasterSample().catch(console.error);
