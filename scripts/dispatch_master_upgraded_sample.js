/**
 * @file scripts/dispatch_master_upgraded_sample.js
 * 
 * Delivers the Master Upgraded Suite (Voice Note + Proposal + 1-Click Link)
 * directly to Admin WhatsApp (0802 279 1227).
 */

const fs = require('fs');
const path = require('path');

async function dispatchMasterUpgraded() {
  console.log('========================================================================');
  console.log('👑 DISPATCHING MASTER UPGRADED OUTREACH PACKAGE TO ADMIN WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';
  const audioFilePath = path.join(__dirname, '../public/audio/Bethelmind_15s_MasterUpgraded_Jacio.wav');

  const proposalText = `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-701-JACIO*

Good day Alhaji / Management at Jacio International!

We know your desk regularly clears container shipments from China. Rather than experiencing 3-week Form M delays or paying inflated black market rates:

📊 *TODAY'S RESERVED CLEARANCE ALLOCATION:*
• *Locked Rate:* ₦1,520 / USD *(Guaranteed Fixed Commercial Rate)*
• *Benchmark Allocation:* $65,000 USD (₦98,800,000 NGN)
• *Execution Speed:* Direct Factory Delivery in Under 15 Minutes (Swift MT103 Proof)
• *Safety:* 100% CBN-Licensed Escrow Trust (Providus / Monnify Clearing Vault)
• *⏱️ Rate Validity:* Same-Day Commercial Window (Until 05:00 PM WAT)

👉 *Drop your China supplier invoice below or call 0802 279 1227 to secure this batch today.*`;

  const waUrl = `https://wa.me/2348185587222?text=${encodeURIComponent(proposalText)}`;

  const reviewCard = `👑 *[MASTER UPGRADED SAMPLE SUITE]*
━━━━━━━━━━━━━━━━━━━━━━
🏢 *Client:* Jacio International Company Ltd (ASPAMDA Trade Fair)
🆔 *Ref:* \`BM-OTC-701-JACIO\` ($65k / +₦1.625M Profit)

🎙️ *15s PERSONALIZED VOICE NOTE TRANSCRIPT:*
_"Good day Alhaji, this is Tosin from Bethelmind Analytics Lagos Desk. We know your desk regularly clears container shipments from China. Rather than experiencing 3-week Form M delays or high black market rates, our institutional desk has reserved a locked wholesale rate of 1,520 Naira per Dollar for your next container clearance today, with 15-minute factory delivery and 100% Providus Bank escrow protection. Drop your proforma invoice below to secure this batch today. Thank you, sir."_

📋 *MASTER UPGRADED PROPOSAL TEXT:*
${proposalText}

🟢 *1-CLICK WHATSAPP TEST LINK (TAP TO PREVIEW ON PHONE):*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

  // 1. Send Review Card
  console.log('1. Sending Master Review Card...');
  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: reviewCard, lineId: 2 })
  });
  await new Promise(r => setTimeout(r, 1200));

  // 2. Send Downloadable Audio File
  if (fs.existsSync(audioFilePath)) {
    console.log('2. Sending Downloadable Audio Voice Note File...');
    await fetch('http://localhost:5005/api/send-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: adminPhone,
        filePath: audioFilePath,
        caption: '🎙️ Master Upgraded 15s Voice Note for Jacio (BM-OTC-701-JACIO)',
        lineId: 2
      })
    });
  }

  console.log('\n🎉 MASTER UPGRADED SUITE SUCCESSFULLY DELIVERED TO ADMIN WHATSAPP!');
}

dispatchMasterUpgraded().catch(console.error);
