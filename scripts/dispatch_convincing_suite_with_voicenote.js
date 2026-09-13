/**
 * Convincing High-Authority Client Proposals + Personalized Voice Note Scripts + Unique Client Reference Numbers
 */
const fs = require('fs');

async function dispatchConvincingSuite() {
  console.log('========================================================================');
  console.log('🎙️ DISPATCHING HIGH-CONVERTING CLIENT SUITE + VOICE NOTE + UNIQUE IDS');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';

  const deals = [
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
      escrowBank: 'Providus Bank / Wema Bank',
      escrowAccName: 'Bethelmind Analytics / OTC Settlement Trust',
      escrowAccNo: '9928371029',
      voiceNoteScript: `Good day Alhaji / Management at Jacio International. This is Tosin from Bethelmind Analytics Lagos Desk. I'm reaching out directly regarding your container factory shipments from China. We know traditional bank Form M takes 3 to 4 weeks, so our institutional liquidity desk has reserved and locked a wholesale rate of 1,520 Naira per Dollar for your 65,000 Dollar clearance today with guaranteed same-day supplier delivery and Providus Bank escrow safety. I have sent the official settlement breakdown below for your review. Let me know once you check it so we lock your batch. Thank you.`,
      convincingProposal: `🤝 *[BETHELMIND INSTITUTIONAL FX & ESCROW DESK]*
📋 *OFFICIAL SETTLEMENT ADVICE — CLIENT REF: BM-OTC-701-JACIO*

Attn: Management, Jacio International Company Ltd
Location: ASPAMDA Trade Fair Complex, Lagos

Good day management. Eliminate 3-week commercial bank delays and black market FX volatility. Bethelmind Analytics provides guaranteed same-day wholesale supplier clearance for your China container orders:

📊 *TRANSACTION SPECIFICATIONS:*
• *Client Unique ID:* BM-OTC-701-JACIO
• *Order Allocation:* $65,000 USDT / RMB Factory Clearance
• *Guaranteed Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦98,800,000 NGN
• *⏱️ Rate Lock Window:* Same-Day Commercial Window (Until 05:00 PM WAT)

🏦 *CBN-LICENSED INSTITUTIONAL ESCROW VAULT:*
• *Escrow Bank:* Providus Bank / Wema Bank
• *Account Name:* Bethelmind Analytics / OTC Settlement Trust
• *Escrow Vault Account:* 9928371029
• *Payment Narration / Ref:* BM-OTC-701-JACIO

📋 *GUARANTEED 3-STEP SETTLEMENT:*
1. Buyer transfers ₦98,800,000 into the dedicated Providus Escrow Vault above.
2. Wholesale desk dispatches $65,000 USDT / Swift wire direct to your China factory within 15 minutes.
3. Official Swift MT103 confirmation receipt delivered to your desk before funds release.

Would you like us to confirm this allocation for your factory clearance today?`
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
      escrowBank: 'Providus Bank / Wema Bank',
      escrowAccName: 'Bethelmind Analytics / OTC Settlement Trust',
      escrowAccNo: '9928371029',
      voiceNoteScript: `Good day Executive Team at Maldini Granites and Marble. This is Tosin from Bethelmind Analytics Lagos Desk. I'm reaching out concerning your international container freight and stone supplier wires. Rather than experiencing bank documentation bottlenecks, our desk has locked an exclusive wholesale rate of 1,520 Naira per Dollar for your 65,000 Dollar allocation with zero bank delay and full Providus Bank escrow protection. I have dropped the official proposal text below. Kindly review and let me know if we should secure this allocation for your desk today.`,
      convincingProposal: `🤝 *[BETHELMIND INSTITUTIONAL FX & ESCROW DESK]*
📋 *OFFICIAL SETTLEMENT ADVICE — CLIENT REF: BM-OTC-702-MALDINI*

Attn: Commercial Director, Maldini Granites & Marble Imports
Location: Alaka Estate, Surulere, Lagos

Good day management. Avoid costly bank transfer delays for your international container logistics. Bethelmind Analytics provides instant institutional FX settlement directly to your international factory suppliers:

📊 *TRANSACTION SPECIFICATIONS:*
• *Client Unique ID:* BM-OTC-702-MALDINI
• *Order Allocation:* $65,000 USDT / Factory Wire
• *Guaranteed Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦98,800,000 NGN
• *⏱️ Rate Lock Window:* Same-Day Commercial Window (Until 05:00 PM WAT)

🏦 *CBN-LICENSED INSTITUTIONAL ESCROW VAULT:*
• *Escrow Bank:* Providus Bank / Wema Bank
• *Account Name:* Bethelmind Analytics / OTC Settlement Trust
• *Escrow Vault Account:* 9928371029
• *Payment Narration / Ref:* BM-OTC-702-MALDINI

📋 *GUARANTEED 3-STEP SETTLEMENT:*
1. Buyer transfers ₦98,800,000 into the dedicated Providus Escrow Vault above.
2. Wholesale desk executes $65,000 wire direct to your supplier account within 15 minutes.
3. Official Swift MT103 confirmation receipt delivered to your desk before funds release.

Would you like us to confirm this allocation for your logistics clearance today?`
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
      cleanPhone: '23480107540008',
      escrowBank: 'Providus Bank / Wema Bank',
      escrowAccName: 'Bethelmind Analytics / OTC Settlement Trust',
      escrowAccNo: '9928371029',
      voiceNoteScript: `Good day Procurement Team at Fouani Ikeja. This is Tosin from Bethelmind Analytics. We specialize in fast-track institutional foreign exchange settlement for major commercial electronics importers on Allen Avenue. We have secured a locked commercial rate of 1,520 Naira per Dollar for your 50,000 Dollar single-container batch today, backed by CBN-licensed Providus Bank escrow trust. Your factory receives payment within 15 minutes with official Swift proof. I've sent the complete settlement breakdown below. Please review and let me know to lock this batch for you.`,
      convincingProposal: `🤝 *[BETHELMIND INSTITUTIONAL FX & ESCROW DESK]*
📋 *OFFICIAL SETTLEMENT ADVICE — CLIENT REF: BM-OTC-703-FOUANI*

Attn: Procurement & Finance Desk, Fouani Ikeja
Location: 17-19 Allen Avenue, Ikeja, Lagos

Good day management. Fast-track your commercial electronics container invoices with zero FX volatility and zero documentation delay:

📊 *TRANSACTION SPECIFICATIONS:*
• *Client Unique ID:* BM-OTC-703-FOUANI
• *Order Allocation:* $50,000 USDT / Factory Invoice Clearance
• *Guaranteed Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦76,000,000 NGN
• *⏱️ Rate Lock Window:* Same-Day Commercial Window (Until 05:00 PM WAT)

🏦 *CBN-LICENSED INSTITUTIONAL ESCROW VAULT:*
• *Escrow Bank:* Providus Bank / Wema Bank
• *Account Name:* Bethelmind Analytics / OTC Settlement Trust
• *Escrow Vault Account:* 9928371029
• *Payment Narration / Ref:* BM-OTC-703-FOUANI

📋 *GUARANTEED 3-STEP SETTLEMENT:*
1. Buyer transfers ₦76,000,000 into the dedicated Providus Escrow Vault above.
2. Wholesale desk executes $50,000 payment direct to factory within 15 minutes.
3. Official Swift MT103 confirmation receipt delivered to your desk before funds release.

Would you like us to confirm this allocation for your factory clearance today?`
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
      escrowBank: 'Providus Bank / Wema Bank',
      escrowAccName: 'Bethelmind Analytics / OTC Settlement Trust',
      escrowAccNo: '9928371029',
      voiceNoteScript: `Good day Management at COHBS International. This is Tosin from Bethelmind Analytics. We provide direct institutional supplier clearance for industrial hardware importers in Ikeja. We have locked a special wholesale rate of 1,520 Naira per Dollar for your 35,000 Dollar supplier invoice today with full Providus Bank escrow security and same-day payment delivery to your manufacturer. Check the settlement details I just sent below, and let's get your invoice cleared today. Thank you.`,
      convincingProposal: `🤝 *[BETHELMIND INSTITUTIONAL FX & ESCROW DESK]*
📋 *OFFICIAL SETTLEMENT ADVICE — CLIENT REF: BM-OTC-704-COHBS*

Attn: Management, COHBS International
Location: Off Awolowo Way, Ikeja, Lagos

Good day management. Eliminate commercial bank delays for your industrial hardware supplier payments:

📊 *TRANSACTION SPECIFICATIONS:*
• *Client Unique ID:* BM-OTC-704-COHBS
• *Order Allocation:* $35,000 USDT / Supplier Invoice Clearance
• *Guaranteed Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦53,200,000 NGN
• *⏱️ Rate Lock Window:* Same-Day Commercial Window (Until 05:00 PM WAT)

🏦 *CBN-LICENSED INSTITUTIONAL ESCROW VAULT:*
• *Escrow Bank:* Providus Bank / Wema Bank
• *Account Name:* Bethelmind Analytics / OTC Settlement Trust
• *Escrow Vault Account:* 9928371029
• *Payment Narration / Ref:* BM-OTC-704-COHBS

📋 *GUARANTEED 3-STEP SETTLEMENT:*
1. Buyer transfers ₦53,200,000 into the dedicated Providus Escrow Vault above.
2. Wholesale desk executes $35,000 wire direct to manufacturer within 15 minutes.
3. Official Swift MT103 confirmation receipt delivered to your desk before funds release.

Would you like us to confirm this allocation for your supplier invoice today?`
    }
  ];

  // Send Header
  const header = `👑 *[BETHELMIND HIGH-CONVERTING MASTER SUITE]*
🎙️ *COMBINED: CONVINCING PROPOSAL + 35s VOICE NOTE SCRIPT + UNIQUE CLIENT ID*

Total Pipeline: $215,000 USD
Total Spread Margin: *₦5,375,000 NGN*
Settlement Route: OPay 7034297995 (Oyelakin Tosin Matthew)

👇 *Here are your 4 High-Authority Client Action Cards:*`;

  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: header, lineId: 1 })
  });
  await new Promise(r => setTimeout(r, 1500));

  for (const d of deals) {
    const rawClean = d.phone.replace(/\D/g, '');
    const cleanP = rawClean.startsWith('234') ? rawClean : `234${rawClean.replace(/^0+/, '')}`;
    const waUrl = `https://wa.me/${cleanP}?text=${encodeURIComponent(d.convincingProposal)}`;

    const card = `🏢 *CLIENT #${d.id}: ${d.name.toUpperCase()}*
🆔 *UNIQUE CLIENT NUMBER:* \`${d.clientRef}\`
━━━━━━━━━━━━━━━━━━━━━━
📍 *Location:* ${d.location}
💼 *Sector:* ${d.sector}
📦 *Order Volume:* ${d.volume}
💵 *Commercial Rate:* ₦1,520 / USD (Same-Day Window)
💰 *YOUR SPREAD PROFIT:* *+${d.profit}*
📞 *Verified Phone:* \`${d.phone}\`

🎙️ *35-SECOND PERSONALIZED VOICE NOTE SCRIPT (RECORD & SEND):*
_"${d.voiceNoteScript}"_

🟢 *1-CLICK WHATSAPP PROPOSAL (WITH ESCROW & CLIENT ID):*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

    console.log(`Sending Convincing Suite Deal #${d.id}: ${d.name}...`);
    await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: adminPhone, message: card, lineId: 1 })
    });
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n🎉 ALL CONVINCING SUITE DEALS + VOICE NOTE SCRIPTS DELIVERED TO ADMIN WHATSAPP!');
}

dispatchConvincingSuite().catch(console.error);
