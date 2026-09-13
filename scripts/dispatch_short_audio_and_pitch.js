/**
 * Dispatch Downloadable Audio File + Short Punchy Convincing Proposal to Admin WhatsApp
 */
const fs = require('fs');
const path = require('path');

async function dispatchShortAndPunchy() {
  console.log('========================================================================');
  console.log('⚡ DISPATCHING DOWNLOADABLE AUDIO + SHORT PUNCHY PROPOSAL TO WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';
  const audioFilePath = path.join(__dirname, '../public/audio/Bethelmind_15s_Executive_VoiceNote.wav');

  // 1. Send the Short Punchy Text Proposal
  const shortPunchyProposal = `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-701-JACIO*

Good day management! Why wait weeks on Form M or risk black market delays?

📊 *TODAY'S LOCKED PROPOSAL:*
• *Order Allocation:* $65,000 USD (China Supplier Wire)
• *Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira:* ₦98,800,000 NGN
• *Speed:* Under 15 Minutes Direct to Factory

🏦 *100% ESCROW PROTECTION:*
• *Bank:* Providus Bank (CBN Licensed)
• *Escrow Vault:* \`9928371029\` (Bethelmind Trust)
• *Safety:* Your funds are locked in bank trust until your factory confirms receipt.

👉 *Reply with your China Invoice or Call 0802 279 1227 to lock this batch today.*`;

  console.log('1. Sending Short Punchy Proposal Text...');
  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: shortPunchyProposal, lineId: 2 })
  });
  await new Promise(r => setTimeout(r, 1500));

  // 2. Send the Downloadable Audio File directly into WhatsApp
  console.log('2. Sending Downloadable Audio Voice Note File...');
  const audioRes = await fetch('http://localhost:5005/api/send-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: adminPhone,
      filePath: audioFilePath,
      caption: '🎙️ Listen to 15s Executive Voice Note (Tap to Play)',
      lineId: 2
    })
  });
  const audioData = await audioRes.json();
  console.log('✅ Audio File Dispatched! Msg ID:', audioData.messageId);
}

dispatchShortAndPunchy().catch(console.error);
