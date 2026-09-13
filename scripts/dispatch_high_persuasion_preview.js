/**
 * High-Persuasion BDC-Beating Client Proposal & Audio Voice Note Dispatcher
 */
const fs = require('fs');

async function dispatchHighPersuasionPreview() {
  console.log('========================================================================');
  console.log('🔥 DISPATCHING HIGH-PERSUASION BDC-BEATING PREVIEW TO ADMIN WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';

  const audioLink = 'http://localhost:5005/audio/sample_voicenote_high_persuasion.wav';
  const playerLink = 'http://localhost:5005/listen_high_persuasion.html';

  const convincingMessage = `🤝 *[BETHELMIND INSTITUTIONAL FX & ESCROW DESK]*
📋 *OFFICIAL SETTLEMENT ADVICE — CLIENT REF: BM-OTC-701-JACIO*

Attn: Management, Jacio International Company Ltd
Location: ASPAMDA Trade Fair Complex, Lagos

Good day management. We understand you already have regular BDC/exchange channels for your China container wires. However, compare the institutional difference:

⚖️ *WHY TOP LAGOS IMPORTERS SWITCH TO BETHELMIND:*
❌ *Regular BDC Guys:* 24–48h delays, black market price gouging (₦1,540+), zero bank protection, personal account risks.
✅ *Bethelmind Desk:* 
1. *Sub-15 Min Execution:* Direct China factory wire with official Swift MT103 proof delivered before funds release.
2. *Guaranteed Wholesale Rate:* ₦1,520 / USD *(Saves you ₦1.3M–₦2.0M per container)*.
3. *100% CBN-Licensed Escrow Safety:* Your funds do NOT go to a personal account; they are locked in Providus Bank Escrow Vault until your China supplier confirms receipt.

📊 *TRANSACTION SPECIFICATIONS:*
• *Client Unique ID:* BM-OTC-701-JACIO
• *Order Allocation:* $65,000 USDT / RMB Factory Clearance
• *Guaranteed Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦98,800,000 NGN
• *⏱️ Rate Lock Window:* Same-Day Commercial Window (Until 05:00 PM WAT)

🏦 *CBN-LICENSED INSTITUTIONAL ESCROW DEPOSIT:*
• *Escrow Bank:* Providus Bank / Wema Bank (CBN Licensed)
• *Account Name:* Bethelmind Analytics / OTC Settlement Trust
• *Escrow Vault Account:* 9928371029
• *Payment Narration / Ref:* BM-OTC-701-JACIO

💡 *RISK-FREE TRIAL:*
You don't need to change your regular dealer—simply test a single batch with us today and experience the speed and institutional safety yourself.

Would you like us to confirm this $65k allocation for your factory clearance today?`;

  const waUrl = `https://wa.me/2348185587222?text=${encodeURIComponent(convincingMessage)}`;

  const masterPreviewCard = `🔥 *[HIGH-PERSUASION BDC-BEATING CLIENT PROPOSAL]*
🎯 *Tackles the "I already have a regular BDC guy" objection + 100% Escrow Proof*
━━━━━━━━━━━━━━━━━━━━━━
🏢 *Client:* Jacio International Company Ltd (ASPAMDA Trade Fair)
🆔 *Unique Ref:* \`BM-OTC-701-JACIO\` ($65k Allocation)
💰 *Your Spread Profit:* *+₦1,625,000 NGN*

🔊 *1. LISTEN TO THE NEW HIGH-PERSUASION VOICE NOTE:*
👉 Audio File: ${audioLink}
👉 Web Audio Player: ${playerLink}

🎙️ *2. VOICE NOTE TRANSCRIPT (RECORD ON WHATSAPP):*
_"Good day Alhaji / Management at Jacio International. This is Tosin from Bethelmind Analytics Lagos Desk. We understand you already have your regular exchange dealers for your China container wires. But we also know the daily headaches with regular BDC guys: unconfirmed transfers, price gouging, and 24 to 48 hours of delays that stall your container clearing in Guangzhou. With Bethelmind Analytics, you get 3 massive advantages: First, a guaranteed wholesale rate of 1,520 Naira per Dollar. Second, your factory receives the wire in under 15 minutes with official Swift MT103 proof. And most importantly, you are 100% protected by our CBN-licensed Providus Bank Escrow Vault 9928371029. Your money never goes to a personal account; it is locked safely in institutional trust until your supplier confirms receipt. You don't have to change your regular dealer—just test a single batch today and experience the speed and bank safety yourself. Check the official breakdown below. Thank you."_

🟢 *3. 1-CLICK WHATSAPP PROPOSAL (WITH BDC COMPARISON & ESCROW):*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

  console.log('Sending High-Persuasion Preview to Admin WhatsApp...');
  const res = await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: masterPreviewCard, lineId: 2 })
  });
  const data = await res.json();
  console.log('✅ Dispatched to Admin WhatsApp! Msg ID:', data.messageId);
}

dispatchHighPersuasionPreview().catch(console.error);
