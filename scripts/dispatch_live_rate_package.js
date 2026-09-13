/**
 * @file scripts/dispatch_live_rate_package.js
 * 
 * Delivers Live Market Research (August 21) + Updated Voice Note to Admin WhatsApp (0802 279 1227).
 */

const fs = require('fs');
const path = require('path');

async function dispatchLiveRatePackage() {
  console.log('========================================================================');
  console.log('📊 DISPATCHING LIVE AUGUST 21 RATE INTELLIGENCE TO ADMIN WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';
  const audioFilePath = path.join(__dirname, '../public/audio/Bethelmind_15s_Nigerian_Female_LiveRate_Jacio.mp3');

  const liveProposal = `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-701-JACIO*

Good day Alhaji / Management at Jacio International!

We know your desk regularly clears container shipments from China. Rather than experiencing 3-week Form M delays or paying inflated black market rates:

📊 *TODAY'S RESERVED CLEARANCE ALLOCATION (AUG 21):*
• *Locked Rate:* ₦1,375 / USD *(Guaranteed Fixed Commercial Rate)*
• *Benchmark Allocation:* $65,000 USD (₦89,375,000 NGN)
• *Execution Speed:* Direct Factory Delivery in Under 15 Minutes (Swift MT103 Proof)
• *Safety:* 100% CBN-Licensed Escrow Trust (Providus / Monnify Clearing Vault)
• *⏱️ Rate Validity:* Same-Day Commercial Window (Until 05:00 PM WAT)

👉 *Drop your China supplier invoice below or call 0802 279 1227 to secure this batch today.*`;

  const waUrl = `https://wa.me/2348185587222?text=${encodeURIComponent(liveProposal)}`;

  const researchCard = `📊 *[LIVE NIGERIA FX MARKET RESEARCH — AUG 21]*
━━━━━━━━━━━━━━━━━━━━━━
🔍 *What the Market is Trading Right Now:*
• *Official NAFEM (Bank):* ~₦1,347.63 / USD (Slow, Form M queue)
• *Bybit / Bitget Institutional Floor:* ~₦1,348 – ₦1,350 / USD
• *Street Parallel Market (BDC):* ~₦1,405 – ₦1,415 / USD

🎯 *TODAY'S OPTIMAL COMMERCIAL QUOTE:*
• *Wholesale Desk Cost:* ₦1,350 / USD
• *Client Quoted Rate:* *₦1,375 / USD*
• *Client Benefit:* Cheaper than street BDC (₦1,415) by ₦40/$ (Saves ₦2.6M NGN!)
• *YOUR SPREAD PROFIT:* *+₦1,625,000 NGN* (OPay 7034297995)

📋 *UPDATED LIVE PROPOSAL:*
${liveProposal}

🟢 *1-CLICK TEST LINK ON WHATSAPP:*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

  console.log('1. Sending Live Research Card...');
  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: researchCard, lineId: 2 })
  });
  await new Promise(r => setTimeout(r, 1200));

  if (fs.existsSync(audioFilePath)) {
    console.log('2. Sending Live Rate Voice Note Audio (.mp3)...');
    await fetch('http://localhost:5005/api/send-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: adminPhone,
        filePath: audioFilePath,
        caption: '🎙️ Live Rate (₦1,375/$) Nigerian Female Voice Note for Jacio',
        lineId: 2
      })
    });
  }

  console.log('\n🎉 LIVE RATE PACKAGE DELIVERED TO ADMIN WHATSAPP!');
}

dispatchLiveRatePackage().catch(console.error);
