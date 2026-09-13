/**
 * Master Professional Deal Action Suite (WhatsApp + 2-Stage SMS)
 */
const fs = require('fs');

async function runPerfectActionSuite() {
  console.log('========================================================================');
  console.log('💎 DISPATCHING REFINED MASTER DEAL & SMS ACTION SUITE TO ADMIN WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';

  const deals = [
    {
      id: 1,
      name: 'Jacio International Company Ltd',
      location: 'ASPAMDA Trade Fair Complex, Lagos',
      sector: 'Automotive & Freight Importers',
      volume: '$65,000 USD (Container Supplier Clearance)',
      rate: '₦1,520 / USD',
      profit: '₦1,625,000 NGN',
      phone: '0818 558 7222',
      cleanPhone: '2348185587222',
      smsStage1: 'Good day! Please is this the management team at Jacio International in ASPAMDA Trade Fair?',
      smsStage2: 'Bethelmind Analytics: Locked $65k China supplier FX rate at N1,520/$ with instant escrow. Call/WA 08022791227 to confirm.',
      waMessage: 'Good day Jacio International team! Bethelmind Analytics has locked your $65,000 USD supplier clearance rate at ₦1,520/$ with instant escrow.'
    },
    {
      id: 2,
      name: 'Maldini Granites and Marble Imports',
      location: '41A Alhaji Tokan Street, Surulere, Lagos',
      sector: 'Granite, Tiles & Container Logistics',
      volume: '$65,000 USD (Container Freight Wire)',
      rate: '₦1,520 / USD',
      profit: '₦1,625,000 NGN',
      phone: '0803 307 9719',
      cleanPhone: '2348033079719',
      smsStage1: 'Good day! Please is this the commercial desk for Maldini Granites & Marble in Surulere?',
      smsStage2: 'Bethelmind Analytics: Locked $65k freight & supplier FX rate at N1,520/$ with instant escrow. Call/WA 08022791227 to confirm.',
      waMessage: 'Good day Maldini Imports team! Bethelmind Analytics has locked your $65,000 USD supplier clearance rate at ₦1,520/$ with instant escrow.'
    },
    {
      id: 3,
      name: 'Fouani (Commercial Electronics & Appliances)',
      location: '17-19 Allen Avenue, Ikeja, Lagos',
      sector: 'Electronics & Commercial Importers',
      volume: '$85,000 USD (Factory Invoice Clearance)',
      rate: '₦1,520 / USD',
      profit: '₦2,125,000 NGN',
      phone: '0810 754 0008',
      cleanPhone: '2348107540008',
      smsStage1: 'Good day! Please is this the procurement desk for Fouani on Allen Avenue, Ikeja?',
      smsStage2: 'Bethelmind Analytics: Locked $85k factory clearance rate at N1,520/$ with instant escrow. Call/WA 08022791227 to confirm.',
      waMessage: 'Good day Fouani Ikeja management! Bethelmind Analytics has locked your $85,000 USD supplier clearance rate at ₦1,520/$ with instant escrow.'
    },
    {
      id: 4,
      name: 'COHBS International',
      location: '14 Fadeyi Aladura Street, Off Awolowo Way, Ikeja',
      sector: 'Industrial Hardware & Supplies',
      volume: '$35,000 USD (Hardware Invoices)',
      rate: '₦1,520 / USD',
      profit: '₦875,000 NGN',
      phone: '0817 041 7114',
      cleanPhone: '2348170417114',
      smsStage1: 'Good day! Please is this the management at COHBS International in Ikeja?',
      smsStage2: 'Bethelmind Analytics: Locked $35k hardware supplier rate at N1,520/$ with instant escrow. Call/WA 08022791227 to confirm.',
      waMessage: 'Good day COHBS International! Bethelmind Analytics has locked your $35,000 USD supplier clearance rate at ₦1,520/$ with instant escrow.'
    }
  ];

  // 1. Send Header
  const header = `👑 *[BETHELMIND EXECUTIVE ACTION DOSSIER: REFINED]*
🕒 WAT Time: ${new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos' })}

Total Deals: 4 High-Volume Importers
Total Order Flow: $250,000 USD
Total Net Profit: *₦6,250,000 NGN* (Direct-to-OPay: 7034297995)

Below are your individual deal cards with:
1️⃣ 1-Click Direct WhatsApp Bridge
2️⃣ Stage 1 Icebreaker SMS (High-Reply)
3️⃣ Stage 2 Official Rate SMS`;

  console.log('Sending Refined Master Header...');
  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: header, lineId: 1 })
  });
  await new Promise(r => setTimeout(r, 1500));

  // 2. Send Each Clean Deal Card
  for (const d of deals) {
    const waUrl = `https://wa.me/${d.cleanPhone}?text=${encodeURIComponent(d.waMessage)}`;

    const card = `🏢 *DEAL #${d.id}: ${d.name.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━━
📍 *Location:* ${d.location}
💼 *Sector:* ${d.sector}
📦 *Order Volume:* ${d.volume}
💵 *Commercial Rate:* ${d.rate}
💰 *YOUR SPREAD PROFIT:* *+${d.profit}*
📞 *Target Phone:* \`${d.phone}\`

🟢 *CHANNEL 1: WHATSAPP (1-TAP)*
👉 ${waUrl}

🟡 *CHANNEL 2: SMS STAGE 1 (WARM HOOK)*
_${d.smsStage1}_

🔵 *CHANNEL 3: SMS STAGE 2 (RATE OFFER)*
_${d.smsStage2}_
━━━━━━━━━━━━━━━━━━━━━━`;

    console.log(`Sending Refined Deal #${d.id}: ${d.name}...`);
    await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: adminPhone, message: card, lineId: 1 })
    });
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log('\n🎉 REFINED MASTER ACTION SUITE FULLY DISPATCHED!');
}

runPerfectActionSuite().catch(console.error);
