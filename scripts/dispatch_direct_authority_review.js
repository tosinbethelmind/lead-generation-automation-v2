/**
 * @file scripts/dispatch_direct_authority_review.js
 * 
 * Delivers the High-Status Direct Authority Suite to Admin WhatsApp (0802 279 1227).
 */

const fs = require('fs');
const path = require('path');

async function dispatchDirectAuthority() {
  console.log('========================================================================');
  console.log('👑 DISPATCHING HIGH-STATUS DIRECT AUTHORITY SUITE TO ADMIN WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';
  const audioFilePath = path.join(__dirname, '../public/audio/Bethelmind_15s_DirectAuthority_Jacio.wav');

  const authorityProposal = `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-701-JACIO*

Good day Alhaji / Management at Jacio International!

We know your desk regularly clears container shipments from China. Rather than experiencing 3-week Form M delays or paying inflated black market rates:

📊 *TODAY'S RESERVED CLEARANCE ALLOCATION:*
• *Locked Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Allocation Volume:* $65,000 USD (₦98,800,000 NGN)
• *Execution Speed:* Direct Factory Delivery in Under 15 Minutes (Swift MT103 Proof)
• *Safety:* 100% CBN-Licensed Escrow Trust (Providus / Monnify Clearing Vault)
• *⏱️ Rate Validity:* Same-Day Commercial Window (Until 05:00 PM WAT)

👉 *Drop your China supplier invoice below or call 0802 279 1227 to secure this batch today.*`;

  const waUrl = `https://wa.me/2348185587222?text=${encodeURIComponent(authorityProposal)}`;

  const reviewCard = `👑 *[HIGH-STATUS DIRECT AUTHORITY PROPOSAL]*
━━━━━━━━━━━━━━━━━━━━━━
🏢 *Client:* Jacio International (ASPAMDA Trade Fair)
🆔 *Ref:* \`BM-OTC-701-JACIO\` ($65k / +₦1.625M Profit)

🧠 *WHY THIS IS 100% SUPERIOR:*
• *Zero Guessing:* Acknowledges we already know they are major container importers.
• *High Prestige:* Positions you as an institutional allocator reserving an exclusive wholesale rate.
• *Direct Action:* Directs them to simply drop their proforma invoice.

📋 *CLEAN PROPOSAL:*
${authorityProposal}

🟢 *1-CLICK TEST LINK ON WHATSAPP:*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

  console.log('1. Sending Direct Authority Card...');
  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: reviewCard, lineId: 2 })
  });
  await new Promise(r => setTimeout(r, 1200));

  if (fs.existsSync(audioFilePath)) {
    console.log('2. Sending Direct Authority Audio File...');
    await fetch('http://localhost:5005/api/send-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: adminPhone,
        filePath: audioFilePath,
        caption: '🎙️ Direct Authority 15s Voice Note for Jacio (BM-OTC-701-JACIO)',
        lineId: 2
      })
    });
  }

  console.log('\n🎉 HIGH-STATUS DIRECT AUTHORITY SUITE DELIVERED TO ADMIN WHATSAPP!');
}

dispatchDirectAuthority().catch(console.error);
