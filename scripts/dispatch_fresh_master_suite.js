/**
 * Fresh Complete Master Suite with Visible Escrow Account Details
 */
const fs = require('fs');

async function dispatchFreshSuite() {
  console.log('========================================================================');
  console.log('💎 DISPATCHING FRESH COMPLETE ACTION SUITE TO ADMIN WHATSAPP (+2348022791227)');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';

  const deals = [
    {
      id: 1,
      dealRef: 'DEAL-OTC-JACIO-65K',
      name: 'Jacio International Company Ltd',
      location: 'Zone B, Block 9, Shop 15, ASPAMDA Trade Fair Complex, Lagos',
      sector: 'Automotive & Container Logistics Importers',
      volume: '$65,000 USD',
      totalNaira: '₦98,800,000 NGN',
      profit: '₦1,625,000 NGN',
      phone: '0818 558 7222',
      cleanPhone: '2348185587222',
      escrowBank: 'Providus Bank / Wema Bank',
      escrowAccName: 'Bethelmind Analytics / OTC Settlement Trust',
      escrowAccNo: '9928371029',
      smsStage1: 'Good day! Please is this the management team at Jacio International in ASPAMDA Trade Fair?',
      smsStage2: 'Bethelmind Analytics: Locked $65k China supplier FX rate at N1,520/$. Escrow Vault: Providus Bank 9928371029 (Bethelmind). Call/WA 08022791227 to confirm.',
      waMessage: `🤝 [BETHELMIND INSTITUTIONAL OTC ESCROW: DEAL-OTC-JACIO-65K]

• Buyer: Jacio International Company Ltd
• Order Volume: $65,000 USDT / RMB Supplier Clearance
• Guaranteed Commercial Rate: ₦1,520 / USD
• ⏱️ RATE VALIDITY: Same-Day Commercial Window (Until 05:00 PM WAT)
• Total Naira Settlement: ₦98,800,000

🏦 DEDICATED INSTITUTIONAL ESCROW DEPOSIT:
• Escrow Bank: Providus Bank / Wema Bank (CBN Licensed)
• Account Name: Bethelmind Analytics / OTC Settlement Trust
• Escrow Vault No: 9928371029 (Ref: DEAL-OTC-JACIO-65K)

📋 SETTLEMENT PROTOCOL:
1. Buyer transfers ₦98,800,000 to the dedicated Escrow Vault above.
2. Wholesale desk dispatches $65,000 USDT supplier wire direct to your China recipient wallet.
3. Immediate on-chain transaction hash & swift confirmation receipt delivered to buyer.`
    },
    {
      id: 2,
      dealRef: 'DEAL-OTC-MALDINI-65K',
      name: 'Maldini Granites and Marble Imports',
      location: '41A Alhaji Tokan Street, Alaka Estate, Surulere, Lagos',
      sector: 'Granite, Tiles & Container Logistics',
      volume: '$65,000 USD',
      totalNaira: '₦98,800,000 NGN',
      profit: '₦1,625,000 NGN',
      phone: '0803 307 9719',
      cleanPhone: '2348033079719',
      escrowBank: 'Providus Bank / Wema Bank',
      escrowAccName: 'Bethelmind Analytics / OTC Settlement Trust',
      escrowAccNo: '9928371029',
      smsStage1: 'Good day! Please is this the commercial desk for Maldini Granites & Marble in Surulere?',
      smsStage2: 'Bethelmind Analytics: Locked $65k freight & supplier FX rate at N1,520/$. Escrow Vault: Providus Bank 9928371029 (Bethelmind). Call/WA 08022791227.',
      waMessage: `🤝 [BETHELMIND INSTITUTIONAL OTC ESCROW: DEAL-OTC-MALDINI-65K]

• Buyer: Maldini Granites and Marble Imports
• Order Volume: $65,000 USDT / RMB Supplier Clearance
• Guaranteed Commercial Rate: ₦1,520 / USD
• ⏱️ RATE VALIDITY: Same-Day Commercial Window (Until 05:00 PM WAT)
• Total Naira Settlement: ₦98,800,000

🏦 DEDICATED INSTITUTIONAL ESCROW DEPOSIT:
• Escrow Bank: Providus Bank / Wema Bank (CBN Licensed)
• Account Name: Bethelmind Analytics / OTC Settlement Trust
• Escrow Vault No: 9928371029 (Ref: DEAL-OTC-MALDINI-65K)

📋 SETTLEMENT PROTOCOL:
1. Buyer transfers ₦98,800,000 to the dedicated Escrow Vault above.
2. Wholesale desk dispatches $65,000 USDT supplier wire direct to your China recipient wallet.
3. Immediate on-chain transaction hash & swift confirmation receipt delivered to buyer.`
    },
    {
      id: 3,
      dealRef: 'DEAL-OTC-FOUANI-50K',
      name: 'Fouani (Commercial Electronics & Appliances)',
      location: '17-19 Allen Avenue, Ikeja, Lagos',
      sector: 'Electronics & Commercial Importers',
      volume: '$50,000 USD',
      totalNaira: '₦76,000,000 NGN',
      profit: '₦1,250,000 NGN',
      phone: '0810 754 0008',
      cleanPhone: '2348107540008',
      escrowBank: 'Providus Bank / Wema Bank',
      escrowAccName: 'Bethelmind Analytics / OTC Settlement Trust',
      escrowAccNo: '9928371029',
      smsStage1: 'Good day! Please is this the procurement desk for Fouani on Allen Avenue, Ikeja?',
      smsStage2: 'Bethelmind Analytics: Locked $50k factory clearance rate at N1,520/$. Escrow Vault: Providus Bank 9928371029 (Bethelmind). Call/WA 08022791227.',
      waMessage: `🤝 [BETHELMIND INSTITUTIONAL OTC ESCROW: DEAL-OTC-FOUANI-50K]

• Buyer: Fouani (Commercial Electronics & Appliances)
• Order Volume: $50,000 USDT / RMB Supplier Clearance
• Guaranteed Commercial Rate: ₦1,520 / USD
• ⏱️ RATE VALIDITY: Same-Day Commercial Window (Until 05:00 PM WAT)
• Total Naira Settlement: ₦76,000,000

🏦 DEDICATED INSTITUTIONAL ESCROW DEPOSIT:
• Escrow Bank: Providus Bank / Wema Bank (CBN Licensed)
• Account Name: Bethelmind Analytics / OTC Settlement Trust
• Escrow Vault No: 9928371029 (Ref: DEAL-OTC-FOUANI-50K)

📋 SETTLEMENT PROTOCOL:
1. Buyer transfers ₦76,000,000 to the dedicated Escrow Vault above.
2. Wholesale desk dispatches $50,000 USDT supplier wire direct to your China recipient wallet.
3. Immediate on-chain transaction hash & swift confirmation receipt delivered to buyer.`
    },
    {
      id: 4,
      dealRef: 'DEAL-OTC-COHBS-35K',
      name: 'COHBS International',
      location: '14 Fadeyi Aladura Street, Off Awolowo Way, Ikeja, Lagos',
      sector: 'Industrial Hardware & Supplies',
      volume: '$35,000 USD',
      totalNaira: '₦53,200,000 NGN',
      profit: '₦875,000 NGN',
      phone: '0817 041 7114',
      cleanPhone: '2348170417114',
      escrowBank: 'Providus Bank / Wema Bank',
      escrowAccName: 'Bethelmind Analytics / OTC Settlement Trust',
      escrowAccNo: '9928371029',
      smsStage1: 'Good day! Please is this the management at COHBS International in Ikeja?',
      smsStage2: 'Bethelmind Analytics: Locked $35k hardware supplier rate at N1,520/$. Escrow Vault: Providus Bank 9928371029 (Bethelmind). Call/WA 08022791227.',
      waMessage: `🤝 [BETHELMIND INSTITUTIONAL OTC ESCROW: DEAL-OTC-COHBS-35K]

• Buyer: COHBS International
• Order Volume: $35,000 USDT / RMB Supplier Clearance
• Guaranteed Commercial Rate: ₦1,520 / USD
• ⏱️ RATE VALIDITY: Same-Day Commercial Window (Until 05:00 PM WAT)
• Total Naira Settlement: ₦53,200,000

🏦 DEDICATED INSTITUTIONAL ESCROW DEPOSIT:
• Escrow Bank: Providus Bank / Wema Bank (CBN Licensed)
• Account Name: Bethelmind Analytics / OTC Settlement Trust
• Escrow Vault No: 9928371029 (Ref: DEAL-OTC-COHBS-35K)

📋 SETTLEMENT PROTOCOL:
1. Buyer transfers ₦53,200,000 to the dedicated Escrow Vault above.
2. Wholesale desk dispatches $35,000 USDT supplier wire direct to your China recipient wallet.
3. Immediate on-chain transaction hash & swift confirmation receipt delivered to buyer.`
    }
  ];

  // 1. Send Fresh Master Dossier Header
  const header = `👑 *[BETHELMIND FRESH MASTER ACTION DOSSIER]*
🕒 Time: ${new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos' })} WAT

📊 *PIPELINE SUMMARY:*
• Active Deals: 4 High-Volume Genuine Importers
• Total Order Flow: $215,000 USD
• Total Spread Profit: *₦5,375,000 NGN*
• Settlement Destination: OPay 7034297995 (Oyelakin Tosin Matthew)

🏦 *OFFICIAL INSTITUTIONAL ESCROW DETAILS (VISIBLE TO CLIENTS):*
• Bank: Providus Bank / Wema Bank (CBN Licensed)
• Account Name: Bethelmind Analytics / OTC Settlement Trust
• Escrow Vault Account: 9928371029

👇 *Here are your 4 fresh, clean deal cards with visible escrow details:*`;

  console.log('Sending Fresh Master Header...');
  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: header, lineId: 1 })
  });
  await new Promise(r => setTimeout(r, 1500));

  // 2. Dispatch Each Fresh Deal Card
  for (const d of deals) {
    const waUrl = `https://wa.me/${d.cleanPhone}?text=${encodeURIComponent(d.waMessage)}`;

    const card = `🏢 *DEAL #${d.id}: ${d.name.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━━
📍 *Location:* ${d.location}
💼 *Sector:* ${d.sector}
📦 *Order Volume:* ${d.volume}
💵 *Commercial Rate:* ₦1,520 / USD (Same-Day Window)
💰 *YOUR SPREAD PROFIT:* *+${d.profit}*
📞 *Target Phone:* \`${d.phone}\`

🏦 *INSTITUTIONAL ESCROW DEPOSIT DETAILS:*
• Bank: ${d.escrowBank}
• Name: ${d.escrowAccName}
• Account: \`${d.escrowAccNo}\` (Ref: ${d.dealRef})

🟢 *1-CLICK WHATSAPP PROPOSAL (WITH ESCROW):*
👉 ${waUrl}

🟡 *SMS STAGE 1 (WARM HOOK):*
_${d.smsStage1}_

🔵 *SMS STAGE 2 (OFFICIAL RATE & ESCROW SMS):*
_${d.smsStage2}_
━━━━━━━━━━━━━━━━━━━━━━`;

    console.log(`Sending Fresh Deal #${d.id}: ${d.name}...`);
    const res = await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: adminPhone, message: card, lineId: 1 })
    });
    const result = await res.json();
    console.log(`✅ Fresh Deal #${d.id} sent! Msg ID: ${result.messageId}`);
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log('\n🎉 ALL FRESH DEALS WITH VISIBLE ESCROW DISPATCHED TO ADMIN WHATSAPP!');
}

dispatchFreshSuite().catch(console.error);
