/**
 * @file scripts/dispatch_nigerian_female_audio.js
 * 
 * Delivers the Authentic Nigerian Cool Female Voice Note & Proposal to Admin WhatsApp (0802 279 1227).
 */

const fs = require('fs');
const path = require('path');

async function dispatchNigerianFemale() {
  console.log('========================================================================');
  console.log('🎙️ DISPATCHING AUTHENTIC NIGERIAN COOL FEMALE VOICE NOTE TO WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';
  const audioFilePath = path.join(__dirname, '../public/audio/Bethelmind_15s_Nigerian_Female_Jacio.mp3');

  const proposalText = `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-701-JACIO*

Good day Alhaji / Management at Jacio International!

We know your desk regularly clears container shipments from China. Rather than experiencing 3-week Form M delays or paying inflated black market rates:

📊 *TODAY'S RESERVED CLEARANCE ALLOCATION:*
• *Locked Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Benchmark Allocation:* $65,000 USD (₦98,800,000 NGN)
• *Execution Speed:* Direct Factory Delivery in Under 15 Minutes (Swift MT103 Proof)
• *Safety:* 100% CBN-Licensed Escrow Trust (Providus / Monnify Clearing Vault)
• *⏱️ Rate Validity:* Same-Day Commercial Window (Until 05:00 PM WAT)

👉 *Drop your China supplier invoice below or call 0802 279 1227 to secure this batch today.*`;

  const waUrl = `https://wa.me/2348185587222?text=${encodeURIComponent(proposalText)}`;

  const reviewCard = `🎙️ *[AUTHENTIC NIGERIAN COOL FEMALE VOICE NOTE READY]*
━━━━━━━━━━━━━━━━━━━━━━
🏢 *Client:* Jacio International (ASPAMDA Trade Fair)
🆔 *Ref:* \`BM-OTC-701-JACIO\` ($65k / +₦1.625M Profit)
🔊 *Voice Profile:* **Nigerian Female Executive (Ezinne Neural)** — Cool, calm, professional, and natural.

🎙️ *VOICE NOTE TRANSCRIPT:*
_"Good day Alhaji, this is Tosin from Bethelmind Analytics Lagos Desk. We know your desk regularly clears container shipments from China. Rather than experiencing 3-week Form M delays or high black market rates, our institutional desk has reserved a locked wholesale rate of 1,520 Naira per Dollar for your next container clearance today, with 15-minute factory delivery and 100 percent Providus Bank escrow protection. Drop your proforma invoice below to secure this batch today. Thank you, sir."_

📋 *PROPOSAL TEXT:*
${proposalText}

🟢 *1-CLICK TEST LINK ON WHATSAPP:*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

  console.log('1. Sending Nigerian Female Review Card...');
  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: reviewCard, lineId: 2 })
  });
  await new Promise(r => setTimeout(r, 1200));

  if (fs.existsSync(audioFilePath)) {
    console.log('2. Sending Nigerian Female Audio File (.mp3)...');
    await fetch('http://localhost:5005/api/send-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: adminPhone,
        filePath: audioFilePath,
        caption: '🎙️ Nigerian Cool Female Voice Note for Jacio (BM-OTC-701-JACIO)',
        lineId: 2
      })
    });
  }

  console.log('\n🎉 AUTHENTIC NIGERIAN COOL FEMALE AUDIO DELIVERED TO ADMIN WHATSAPP!');
}

dispatchNigerianFemale().catch(console.error);
