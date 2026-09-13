/**
 * Dispatch 4 Unique Downloadable Audio Files + 4 Unique Messages to Admin WhatsApp
 */
const fs = require('fs');
const path = require('path');

async function dispatchAllUniqueSuites() {
  console.log('========================================================================');
  console.log('👑 DISPATCHING 4 UNIQUE PERSONALIZED AUDIO SUITES TO ADMIN WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';

  const clients = [
    {
      id: 1,
      ref: 'BM-OTC-701-JACIO',
      name: 'Jacio International Company Ltd',
      location: 'ASPAMDA Trade Fair Complex, Lagos',
      volume: '$65,000 USD (Guangzhou Container Wire)',
      totalNaira: '₦98,800,000 NGN',
      profit: '₦1,625,000 NGN',
      phone: '0818 558 7222',
      cleanPhone: '2348185587222',
      audioFile: path.join(__dirname, '../public/audio/Bethelmind_15s_Jacio.wav'),
      audioName: 'Bethelmind_15s_Jacio.wav',
      voiceTranscript: 'Good day Alhaji, management at Jacio International in ASPAMDA Trade Fair. Tosin here from Bethelmind Analytics. Why wait weeks on Form M? We have locked 1,520 Naira per Dollar for your 65,000 Dollar Guangzhou container wire today, with 15-minute delivery and 100% Providus Bank escrow safety. Check the quick details below with reference BM-OTC-701-JACIO and let us clear your batch today. Thank you.',
      proposal: `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-701-JACIO*

Good day management at Jacio! Why wait weeks on Form M or risk black market delays?

📊 *TODAY'S LOCKED PROPOSAL:*
• *Order Allocation:* $65,000 USD (China Supplier Wire)
• *Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦98,800,000 NGN
• *Execution Speed:* Under 15 Minutes Direct to Factory

🏦 *100% INSTITUTIONAL ESCROW PROTECTION:*
• *Escrow Type:* CBN-Licensed Bank Escrow Trust
• *Security Guarantee:* 100% platform-bonded escrow. Funds held safely until your factory confirms receipt.
• *Dedicated Account:* Official verified clearing account provided immediately upon invoice confirmation.

👉 *Reply with your China Invoice or Call 0802 279 1227 to lock this batch today.*`
    },
    {
      id: 2,
      ref: 'BM-OTC-702-MALDINI',
      name: 'Maldini Granites and Marble Imports',
      location: 'Alaka Estate, Surulere, Lagos',
      volume: '$65,000 USD (Container Freight Wire)',
      totalNaira: '₦98,800,000 NGN',
      profit: '₦1,625,000 NGN',
      phone: '0803 307 9719',
      cleanPhone: '2348033079719',
      audioFile: path.join(__dirname, '../public/audio/Bethelmind_15s_Maldini.wav'),
      audioName: 'Bethelmind_15s_Maldini.wav',
      voiceTranscript: 'Good day Executive Team at Maldini Granites in Surulere. Tosin here from Bethelmind Analytics. Avoid costly bank delays for your stone supplier wires. We have locked 1,520 Naira per Dollar for your 65,000 Dollar container batch today, with 15-minute direct delivery and 100% bank escrow protection. Check the breakdown below under reference BM-OTC-702-MALDINI. Thank you.',
      proposal: `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-702-MALDINI*

Good day management at Maldini! Avoid costly bank delays for your container freight wires:

📊 *TODAY'S LOCKED PROPOSAL:*
• *Order Allocation:* $65,000 USD (Container Freight Wire)
• *Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦98,800,000 NGN
• *Execution Speed:* Under 15 Minutes Direct to Supplier

🏦 *100% INSTITUTIONAL ESCROW PROTECTION:*
• *Escrow Type:* CBN-Licensed Bank Escrow Trust
• *Security Guarantee:* 100% platform-bonded escrow. Funds held safely until your supplier confirms receipt.
• *Dedicated Account:* Official verified clearing account provided immediately upon invoice confirmation.

👉 *Reply with your Invoice or Call 0802 279 1227 to lock this batch today.*`
    },
    {
      id: 3,
      ref: 'BM-OTC-703-FOUANI',
      name: 'Fouani (Commercial Electronics)',
      location: '17-19 Allen Avenue, Ikeja, Lagos',
      volume: '$50,000 USD (Single Container Batch)',
      totalNaira: '₦76,000,000 NGN',
      profit: '₦1,250,000 NGN',
      phone: '0810 754 0008',
      cleanPhone: '2348107540008',
      audioFile: path.join(__dirname, '../public/audio/Bethelmind_15s_Fouani.wav'),
      audioName: 'Bethelmind_15s_Fouani.wav',
      voiceTranscript: 'Good day Procurement Team at Fouani on Allen Avenue, Ikeja. Tosin here from Bethelmind Analytics. We have secured a locked commercial rate of 1,520 Naira per Dollar for your 50,000 Dollar electronics container invoice today, with 15-minute factory clearance and full institutional escrow safety. Check your proposal below under reference BM-OTC-703-FOUANI. Thank you.',
      proposal: `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-703-FOUANI*

Good day management at Fouani! Fast-track your commercial electronics container invoices:

📊 *TODAY'S LOCKED PROPOSAL:*
• *Order Allocation:* $50,000 USD (Factory Clearance)
• *Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦76,000,000 NGN
• *Execution Speed:* Under 15 Minutes Direct to Factory

🏦 *100% INSTITUTIONAL ESCROW PROTECTION:*
• *Escrow Type:* CBN-Licensed Bank Escrow Trust
• *Security Guarantee:* 100% platform-bonded escrow. Funds held safely until your factory confirms receipt.
• *Dedicated Account:* Official verified clearing account provided immediately upon invoice confirmation.

👉 *Reply with your China Invoice or Call 0802 279 1227 to lock this batch today.*`
    },
    {
      id: 4,
      ref: 'BM-OTC-704-COHBS',
      name: 'COHBS International',
      location: '14 Fadeyi Aladura Street, Ikeja, Lagos',
      volume: '$35,000 USD (Industrial Hardware Invoice)',
      totalNaira: '₦53,200,000 NGN',
      profit: '₦875,000 NGN',
      phone: '0817 041 7114',
      cleanPhone: '2348170417114',
      audioFile: path.join(__dirname, '../public/audio/Bethelmind_15s_Cohbs.wav'),
      audioName: 'Bethelmind_15s_Cohbs.wav',
      voiceTranscript: 'Good day Management at COHBS International in Ikeja. Tosin here from Bethelmind Analytics. We have locked 1,520 Naira per Dollar for your 35,000 Dollar industrial hardware supplier invoice today, with 15-minute factory payment and 100% escrow security. Check your details below under reference BM-OTC-704-COHBS. Thank you.',
      proposal: `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-704-COHBS*

Good day management at COHBS! Fast-track your industrial hardware supplier invoices:

📊 *TODAY'S LOCKED PROPOSAL:*
• *Order Allocation:* $35,000 USD (Supplier Invoice Wire)
• *Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦53,200,000 NGN
• *Execution Speed:* Under 15 Minutes Direct to Factory

🏦 *100% INSTITUTIONAL ESCROW PROTECTION:*
• *Escrow Type:* CBN-Licensed Bank Escrow Trust
• *Security Guarantee:* 100% platform-bonded escrow. Funds held safely until your supplier confirms receipt.
• *Dedicated Account:* Official verified clearing account provided immediately upon invoice confirmation.

👉 *Reply with your Supplier Invoice or Call 0802 279 1227 to lock this batch today.*`
    }
  ];

  for (const c of clients) {
    const waUrl = `https://wa.me/${c.cleanPhone}?text=${encodeURIComponent(c.proposal)}`;

    const card = `🏢 *CLIENT #${c.id}: ${c.name.toUpperCase()}*
🆔 *REF:* \`${c.ref}\` | 📦 *VOLUME:* ${c.volume}
💰 *YOUR SPREAD PROFIT:* *+${c.profit}* (Settles to OPay 7034297995)
━━━━━━━━━━━━━━━━━━━━━━
🎙️ *THIS CLIENT'S UNIQUE 15s VOICE NOTE SCRIPT:*
_"${c.voiceTranscript}"_

🟢 *1-CLICK WHATSAPP PROPOSAL (READY TO SEND):*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

    console.log(`Sending Unique Suite #${c.id} for ${c.name}...`);
    
    // 1. Send Proposal Card Text
    await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: adminPhone, message: card, lineId: 2 })
    });
    await new Promise(r => setTimeout(r, 1000));

    // 2. Send Unique Downloadable Audio File
    if (fs.existsSync(c.audioFile)) {
      await fetch('http://localhost:5005/api/send-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: adminPhone,
          filePath: c.audioFile,
          caption: `🎙️ 15s Voice Note for ${c.name} (${c.ref})`,
          lineId: 2
        })
      });
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n🎉 ALL 4 UNIQUE AUDIO VOICE NOTES & PROPOSALS DELIVERED TO ADMIN WHATSAPP!');
}

dispatchAllUniqueSuites().catch(console.error);
