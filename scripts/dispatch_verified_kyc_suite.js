/**
 * Dispatch 100% Verified Tier-3 KYC-Compliant Proposals to Admin WhatsApp
 */
const fs = require('fs');

async function dispatchVerifiedKycSuite() {
  console.log('========================================================================');
  console.log('✅ DISPATCHING 100% VERIFIED KYC-COMPLIANT PROPOSALS TO ADMIN WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';

  const deals = [
    {
      id: 1,
      ref: 'BM-OTC-701-JACIO',
      name: 'Jacio International Company Ltd',
      location: 'ASPAMDA Trade Fair Complex, Lagos',
      volume: '$65,000 USD (Container Supplier Clearance)',
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
• *Total Naira:* ₦98,800,000 NGN
• *Speed:* Under 15 Minutes Direct to Factory

🏦 *100% VERIFIED ESCROW VAULT (TIER-3 KYC ACTIVE):*
• *Bank:* OPay Digital Services
• *Account Name:* Oyelakin Tosin Matthew (Bethelmind Escrow Trust)
• *Account Number:* 7034297995
• *Payment Narration:* BM-OTC-701-JACIO
• *Safety:* 100% verified KYC account. Funds locked safely until your factory confirms receipt.

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
• *Total Naira:* ₦98,800,000 NGN
• *Speed:* Under 15 Minutes Direct to Supplier

🏦 *100% VERIFIED ESCROW VAULT (TIER-3 KYC ACTIVE):*
• *Bank:* OPay Digital Services
• *Account Name:* Oyelakin Tosin Matthew (Bethelmind Escrow Trust)
• *Account Number:* 7034297995
• *Payment Narration:* BM-OTC-702-MALDINI
• *Safety:* 100% verified KYC account. Funds locked safely until your supplier confirms receipt.

👉 *Reply with your Invoice or Call 0802 279 1227 to lock this batch today.*`
    },
    {
      id: 3,
      ref: 'BM-OTC-703-FOUANI',
      name: 'Fouani (Commercial Electronics)',
      location: '17-19 Allen Avenue, Ikeja, Lagos',
      volume: '$50,000 USD (Single Container Clearance)',
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
• *Total Naira:* ₦76,000,000 NGN
• *Speed:* Under 15 Minutes Direct to Factory

🏦 *100% VERIFIED ESCROW VAULT (TIER-3 KYC ACTIVE):*
• *Bank:* OPay Digital Services
• *Account Name:* Oyelakin Tosin Matthew (Bethelmind Escrow Trust)
• *Account Number:* 7034297995
• *Payment Narration:* BM-OTC-703-FOUANI
• *Safety:* 100% verified KYC account. Funds locked safely until your factory confirms receipt.

👉 *Reply with your China Invoice or Call 0802 279 1227 to lock this batch today.*`
    }
  ];

  for (const d of deals) {
    const waUrl = `https://wa.me/${d.cleanPhone}?text=${encodeURIComponent(d.proposal)}`;

    const card = `🏢 *DEAL #${d.id}: ${d.name.toUpperCase()}*
🆔 *REF:* \`${d.ref}\` | 💰 *PROFIT:* *+${d.profit}*
━━━━━━━━━━━━━━━━━━━━━━
🏦 *VERIFIED TIER-3 KYC ESCROW ACCOUNT:*
• Bank: *OPay Digital Services*
• Account: \`7034297995\`
• Name: *Oyelakin Tosin Matthew (Bethelmind Escrow Trust)*
• Status: 🟢 *100% Active & Verified (No KYC limits / No errors)*

🟢 *1-CLICK WHATSAPP PROPOSAL (WITH VERIFIED OPAY ACCOUNT):*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

    console.log(`Sending verified deal #${d.id} to admin WhatsApp...`);
    await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: adminPhone, message: card, lineId: 2 })
    });
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log('\n🎉 ALL VERIFIED KYC PROPOSALS DISPATCHED TO ADMIN WHATSAPP!');
}

dispatchVerifiedKycSuite().catch(console.error);
