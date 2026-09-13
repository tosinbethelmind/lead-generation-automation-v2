/**
 * Dispatch Flawless Professional Proposals (Dynamic Escrow Protocol)
 * Eliminates dummy bank numbers so no buyer ever encounters a KYC error.
 */
const fs = require('fs');

async function dispatchFlawlessSuite() {
  console.log('========================================================================');
  console.log('🛡️ DISPATCHING FLAWLESS DYNAMIC ESCROW PROPOSALS TO ADMIN WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';

  const deals = [
    {
      id: 1,
      ref: 'BM-OTC-701-JACIO',
      name: 'Jacio International Company Ltd',
      location: 'ASPAMDA Trade Fair Complex, Lagos',
      volume: '$65,000 USD (China Supplier Wire)',
      totalNaira: '₦98,800,000 NGN',
      profit: '₦1,625,000 NGN',
      phone: '0818 558 7222',
      cleanPhone: '2348185587222',
      proposal: `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-701-JACIO*

Good day management! Why wait weeks on Form M or risk black market delays?

📊 *TODAY'S LOCKED PROPOSAL:*
• *Order Allocation:* $65,000 USD (China Supplier Wire)
• *Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦98,800,000 NGN
• *Execution Speed:* Under 15 Minutes Direct to China Factory

🏦 *100% INSTITUTIONAL ESCROW PROTECTION:*
• *Escrow Type:* CBN-Licensed Bank Escrow Trust
• *Security Guarantee:* 100% platform-bonded escrow. Your funds remain locked in bank trust until your factory confirms receipt.
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
      proposal: `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-702-MALDINI*

Good day management! Avoid costly bank delays for your container freight wires:

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
      proposal: `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-703-FOUANI*

Good day management! Fast-track your commercial electronics container invoices:

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
    }
  ];

  for (const d of deals) {
    const waUrl = `https://wa.me/${d.cleanPhone}?text=${encodeURIComponent(d.proposal)}`;

    const card = `🏢 *DEAL #${d.id}: ${d.name.toUpperCase()}*
🆔 *REF:* \`${d.ref}\` | 📦 *VOLUME:* ${d.volume}
💰 *YOUR SPREAD PROFIT:* *+${d.profit}* (Settles to OPay 7034297995)
━━━━━━━━━━━━━━━━━━━━━━
🛡️ *FLAWLESS DYNAMIC ESCROW PROTOCOL:*
• *No Dummy Account Numbers:* Buyer is never given an unverified number.
• *Workflow:* Buyer submits invoice ➔ Live active merchant vault generated ➔ Wire executed ➔ Profit paid to your OPay.

🟢 *1-CLICK WHATSAPP PROPOSAL (PROFESSIONAL & FLAWLESS):*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

    console.log(`Sending flawless deal #${d.id} to admin WhatsApp...`);
    await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: adminPhone, message: card, lineId: 2 })
    });
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log('\n🎉 ALL FLAWLESS DYNAMIC ESCROW PROPOSALS DELIVERED TO ADMIN WHATSAPP!');
}

dispatchFlawlessSuite().catch(console.error);
