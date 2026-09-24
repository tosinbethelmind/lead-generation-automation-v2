/**
 * Dispatch Unique Customer Samples (Each with distinct ID + distinct Voice Note Audio Link)
 */
const fs = require('fs');

async function dispatchUniqueSamples() {
  console.log('========================================================================');
  console.log('💎 DISPATCHING 4 DISTINCT & UNIQUE CLIENT SAMPLES TO ADMIN WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';

  const clients = [
    {
      id: 1,
      clientRef: 'BM-OTC-701-JACIO',
      name: 'Jacio International Company Ltd',
      location: 'Zone B, Block 9, Shop 15, ASPAMDA Trade Fair Complex, Lagos',
      sector: 'Automotive & Container Freight Logistics',
      volume: '$65,000 USD (Container Supplier Clearance)',
      totalNaira: '₦98,800,000 NGN',
      profit: '₦1,625,000 NGN',
      phone: '0818 558 7222',
      cleanPhone: '2348185587222',
      audioLink: 'http://localhost:5005/audio/sample_voicenote_jacio.wav',
      voiceTranscript: 'Good day Alhaji / Management at Jacio International. This is Tosin from Bethelmind Analytics Lagos Desk. I am reaching out directly regarding your container factory shipments from China. We know traditional bank Form M takes 3 to 4 weeks, so our institutional liquidity desk has reserved and locked a wholesale rate of 1,520 Naira per Dollar for your 65,000 Dollar clearance today with guaranteed same-day supplier delivery and Providus Bank escrow safety. I have sent the official settlement breakdown below with your unique allocation reference BM-OTC-701-JACIO for your review. Let me know once you check it so we lock your batch. Thank you.',
      proposalText: `🤝 [BETHELMIND INSTITUTIONAL FX & ESCROW DESK]
📋 OFFICIAL SETTLEMENT ADVICE — CLIENT REF: BM-OTC-701-JACIO

Attn: Management, Jacio International Company Ltd
Location: ASPAMDA Trade Fair Complex, Lagos

• Client Unique ID: BM-OTC-701-JACIO
• Order Allocation: $65,000 USD / RMB Factory Clearance
• Guaranteed Wholesale Rate: ₦1,520 / USD (Fixed Rate)
• Total Naira Deposit: ₦98,800,000 NGN
• Rate Lock Window: Same-Day Commercial Window (Until 05:00 PM WAT)

🏦 CBN-LICENSED INSTITUTIONAL ESCROW VAULT:
• Escrow Bank: Providus Bank / Wema Bank
• Account Name: Bethelmind Analytics / OTC Settlement Trust
• Escrow Vault Account: 9928371029
• Payment Narration: BM-OTC-701-JACIO

📋 GUARANTEED 3-STEP SETTLEMENT:
1. Buyer transfers ₦98,800,000 into the dedicated Providus Escrow Vault above.
2. Wholesale desk dispatches $65,000 USDT wire direct to your China factory within 15 minutes.
3. Official Swift MT103 confirmation receipt delivered to your desk before funds release.`
    },
    {
      id: 2,
      clientRef: 'BM-OTC-702-MALDINI',
      name: 'Maldini Granites and Marble Imports Limited',
      location: '41A Alhaji Tokan Street, Alaka Estate, Surulere, Lagos',
      sector: 'Granite, Tiles & Container Logistics',
      volume: '$65,000 USD (Container Freight Wire)',
      totalNaira: '₦98,800,000 NGN',
      profit: '₦1,625,000 NGN',
      phone: '0803 307 9719',
      cleanPhone: '2348033079719',
      audioLink: 'http://localhost:5005/audio/sample_voicenote_maldini.wav',
      voiceTranscript: 'Good day Executive Team at Maldini Granites and Marble in Surulere. This is Tosin from Bethelmind Analytics Lagos Desk. I am reaching out concerning your international container freight and stone supplier wires. Rather than experiencing bank documentation bottlenecks, our desk has locked an exclusive wholesale rate of 1,520 Naira per Dollar for your 65,000 Dollar allocation with zero bank delay and full Providus Bank escrow protection. I have dropped the official proposal text below with your unique reference BM-OTC-702-MALDINI. Kindly review and let me know if we should secure this allocation for your desk today.',
      proposalText: `🤝 [BETHELMIND INSTITUTIONAL FX & ESCROW DESK]
📋 OFFICIAL SETTLEMENT ADVICE — CLIENT REF: BM-OTC-702-MALDINI

Attn: Commercial Director, Maldini Granites & Marble Imports
Location: Alaka Estate, Surulere, Lagos

• Client Unique ID: BM-OTC-702-MALDINI
• Order Allocation: $65,000 USDT / Factory Wire
• Guaranteed Wholesale Rate: ₦1,520 / USD (Fixed Rate)
• Total Naira Deposit: ₦98,800,000 NGN
• Rate Lock Window: Same-Day Commercial Window (Until 05:00 PM WAT)

🏦 CBN-LICENSED INSTITUTIONAL ESCROW VAULT:
• Escrow Bank: Providus Bank / Wema Bank
• Account Name: Bethelmind Analytics / OTC Settlement Trust
• Escrow Vault Account: 9928371029
• Payment Narration: BM-OTC-702-MALDINI

📋 GUARANTEED 3-STEP SETTLEMENT:
1. Buyer transfers ₦98,800,000 into the dedicated Providus Escrow Vault above.
2. Wholesale desk executes $65,000 wire direct to your supplier account within 15 minutes.
3. Official Swift MT103 confirmation receipt delivered to your desk before funds release.`
    },
    {
      id: 3,
      clientRef: 'BM-OTC-703-FOUANI',
      name: 'Fouani (Commercial Electronics & Appliances)',
      location: '17-19 Allen Avenue, Ikeja, Lagos',
      sector: 'Commercial Electronics & Appliances Importers',
      volume: '$50,000 USD (Single Container Clearance)',
      totalNaira: '₦76,000,000 NGN',
      profit: '₦1,250,000 NGN',
      phone: '0810 754 0008',
      cleanPhone: '2348107540008',
      audioLink: 'http://localhost:5005/audio/sample_voicenote_fouani.wav',
      voiceTranscript: 'Good day Procurement Team at Fouani on Allen Avenue, Ikeja. This is Tosin from Bethelmind Analytics. We specialize in fast-track institutional foreign exchange settlement for major commercial electronics importers. We have secured a locked commercial rate of 1,520 Naira per Dollar for your 50,000 Dollar single-container batch today, backed by CBN-licensed Providus Bank escrow trust. Your factory receives payment within 15 minutes with official Swift proof. I have sent the complete settlement breakdown below under your reference BM-OTC-703-FOUANI. Please review and let me know to lock this batch for you.',
      proposalText: `🤝 [BETHELMIND INSTITUTIONAL FX & ESCROW DESK]
📋 OFFICIAL SETTLEMENT ADVICE — CLIENT REF: BM-OTC-703-FOUANI

Attn: Procurement & Finance Desk, Fouani Ikeja
Location: 17-19 Allen Avenue, Ikeja, Lagos

• Client Unique ID: BM-OTC-703-FOUANI
• Order Allocation: $50,000 USDT / Factory Invoice Clearance
• Guaranteed Wholesale Rate: ₦1,520 / USD (Fixed Rate)
• Total Naira Deposit: ₦76,000,000 NGN
• Rate Lock Window: Same-Day Commercial Window (Until 05:00 PM WAT)

🏦 CBN-LICENSED INSTITUTIONAL ESCROW VAULT:
• Escrow Bank: Providus Bank / Wema Bank
• Account Name: Bethelmind Analytics / OTC Settlement Trust
• Escrow Vault Account: 9928371029
• Payment Narration: BM-OTC-703-FOUANI

📋 GUARANTEED 3-STEP SETTLEMENT:
1. Buyer transfers ₦76,000,000 into the dedicated Providus Escrow Vault above.
2. Wholesale desk executes $50,000 payment direct to factory within 15 minutes.
3. Official Swift MT103 confirmation receipt delivered to your desk before funds release.`
    },
    {
      id: 4,
      clientRef: 'BM-OTC-704-COHBS',
      name: 'COHBS International',
      location: '14 Fadeyi Aladura Street, Off Awolowo Way, Ikeja, Lagos',
      sector: 'Industrial Hardware & Commercial Supplies',
      volume: '$35,000 USD (Hardware Invoices)',
      totalNaira: '₦53,200,000 NGN',
      profit: '₦875,000 NGN',
      phone: '0817 041 7114',
      cleanPhone: '2348170417114',
      audioLink: 'http://localhost:5005/audio/sample_voicenote_cohbs.wav',
      voiceTranscript: 'Good day Management at COHBS International in Ikeja. This is Tosin from Bethelmind Analytics. We provide direct institutional supplier clearance for industrial hardware importers. We have locked a special wholesale rate of 1,520 Naira per Dollar for your 35,000 Dollar supplier invoice today with full Providus Bank escrow security and same-day payment delivery to your manufacturer. Check the settlement details I just sent below under reference BM-OTC-704-COHBS, and let us get your invoice cleared today. Thank you.',
      proposalText: `🤝 [BETHELMIND INSTITUTIONAL FX & ESCROW DESK]
📋 OFFICIAL SETTLEMENT ADVICE — CLIENT REF: BM-OTC-704-COHBS

Attn: Management, COHBS International
Location: Off Awolowo Way, Ikeja, Lagos

• Client Unique ID: BM-OTC-704-COHBS
• Order Allocation: $35,000 USDT / Supplier Invoice Clearance
• Guaranteed Wholesale Rate: ₦1,520 / USD (Fixed Rate)
• Total Naira Deposit: ₦53,200,000 NGN
• Rate Lock Window: Same-Day Commercial Window (Until 05:00 PM WAT)

🏦 CBN-LICENSED INSTITUTIONAL ESCROW VAULT:
• Escrow Bank: Providus Bank / Wema Bank
• Account Name: Bethelmind Analytics / OTC Settlement Trust
• Escrow Vault Account: 9928371029
• Payment Narration: BM-OTC-704-COHBS

📋 GUARANTEED 3-STEP SETTLEMENT:
1. Buyer transfers ₦53,200,000 into the dedicated Providus Escrow Vault above.
2. Wholesale desk executes $35,000 wire direct to manufacturer within 15 minutes.
3. Official Swift MT103 confirmation receipt delivered to your desk before funds release.`
    }
  ];

  for (const c of clients) {
    const waUrl = `https://wa.me/${c.cleanPhone}?text=${encodeURIComponent(c.proposalText)}`;

    const message = `🏢 *UNIQUE CUSTOMER SAMPLE: ${c.name.toUpperCase()}*
🆔 *DEDICATED REFERENCE NUMBER:* \`${c.clientRef}\`
━━━━━━━━━━━━━━━━━━━━━━
📍 *Location:* ${c.location}
💼 *Sector:* ${c.sector}
📦 *Order Volume:* ${c.volume}
💰 *YOUR SPREAD PROFIT:* *+${c.profit}*
📞 *Target Phone:* \`${c.phone}\`

🔊 *LISTEN TO THIS CLIENT'S UNIQUE VOICE NOTE:*
👉 ${c.audioLink}

🎙️ *VOICE NOTE TRANSCRIPT (RECORD ON WA):*
_"${c.voiceTranscript}"_

🟢 *1-CLICK WHATSAPP PROPOSAL (WITH ESCROW & UNIQUE ID):*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

    console.log(`Sending Unique Sample for ${c.name}...`);
    await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: adminPhone, message, lineId: 1 })
    });
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n🎉 ALL 4 DISTINCT UNIQUE CUSTOMER SAMPLES DELIVERED TO ADMIN WHATSAPP!');
}

dispatchUniqueSamples().catch(console.error);
