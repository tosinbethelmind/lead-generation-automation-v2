/**
 * Dispatch Clean Deals with Verified Merchant Escrow Clearing Vault
 * (Your OPay account is used ONLY for receiving your private profit payouts)
 */
const fs = require('fs');

async function dispatchMerchantEscrowSuite() {
  console.log('========================================================================');
  console.log('🏛️ DISPATCHING CLEAN DEALS WITH VERIFIED MERCHANT ESCROW TO WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';

  const deals = [
    {
      id: 1,
      ref: 'BM-OTC-701-JACIO',
      clientName: 'Jacio International Company Ltd',
      location: 'ASPAMDA Trade Fair Complex, Lagos',
      volume: '$65,000 USD (China Supplier Wire)',
      totalNaira: '₦98,800,000 NGN',
      profit: '₦1,625,000 NGN',
      phone: '0818 558 7222',
      cleanPhone: '2348185587222',
      merchantName: 'AlphaDesk OTC Institutional Settlement Desk',
      merchantBank: 'Providus Bank / Monnify Corporate Clearing',
      merchantAccount: '0104882910',
      merchantAccountName: 'AlphaDesk OTC / Institutional Settlement Trust',
      merchantHotline: '+234 809 112 4022',
      proposal: `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-701-JACIO*

Good day management! Why wait weeks on Form M or risk black market delays?

📊 *TODAY'S LOCKED PROPOSAL:*
• *Order Allocation:* $65,000 USD (China Supplier Wire)
• *Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦98,800,000 NGN
• *Speed:* Under 15 Minutes Direct to China Factory

🏦 *INSTITUTIONAL ESCROW CLEARING VAULT:*
• *Bank:* Providus Bank (CBN Licensed)
• *Account Name:* AlphaDesk OTC / Institutional Settlement Trust
• *Account Number:* \`0104882910\`
• *Payment Narration:* BM-OTC-701-JACIO
• *Security Guarantee:* 100% platform-bonded escrow. Your funds are held safely until your factory confirms receipt.

👉 *Reply with your China Invoice or Call 0802 279 1227 to lock this batch today.*`
    },
    {
      id: 2,
      ref: 'BM-OTC-702-MALDINI',
      clientName: 'Maldini Granites and Marble Imports',
      location: 'Alaka Estate, Surulere, Lagos',
      volume: '$65,000 USD (Container Freight Wire)',
      totalNaira: '₦98,800,000 NGN',
      profit: '₦1,625,000 NGN',
      phone: '0803 307 9719',
      cleanPhone: '2348033079719',
      merchantName: 'BitDelta Institutional VIP OTC Desk',
      merchantBank: 'Providus Bank / Wema Bank Corporate Clearing',
      merchantAccount: '0104882910',
      merchantAccountName: 'AlphaDesk OTC / Institutional Settlement Trust',
      merchantHotline: '+234 813 900 8821',
      proposal: `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-702-MALDINI*

Good day management! Avoid costly bank delays for your container freight wires:

📊 *TODAY'S LOCKED PROPOSAL:*
• *Order Allocation:* $65,000 USD (Container Freight Wire)
• *Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦98,800,000 NGN
• *Speed:* Under 15 Minutes Direct to Supplier

🏦 *INSTITUTIONAL ESCROW CLEARING VAULT:*
• *Bank:* Providus Bank (CBN Licensed)
• *Account Name:* AlphaDesk OTC / Institutional Settlement Trust
• *Account Number:* \`0104882910\`
• *Payment Narration:* BM-OTC-702-MALDINI
• *Security Guarantee:* 100% platform-bonded escrow. Funds held safely until your supplier confirms receipt.

👉 *Reply with your Invoice or Call 0802 279 1227 to lock this batch today.*`
    },
    {
      id: 3,
      ref: 'BM-OTC-703-FOUANI',
      clientName: 'Fouani (Commercial Electronics)',
      location: '17-19 Allen Avenue, Ikeja, Lagos',
      volume: '$50,000 USD (Single Container Batch)',
      totalNaira: '₦76,000,000 NGN',
      profit: '₦1,250,000 NGN',
      phone: '0810 754 0008',
      cleanPhone: '2348107540008',
      merchantName: 'Lagos Importers Guild OTC Liquidity Hub',
      merchantBank: 'Providus Bank Corporate Clearing',
      merchantAccount: '0104882910',
      merchantAccountName: 'AlphaDesk OTC / Institutional Settlement Trust',
      merchantHotline: '+234 802 884 1900',
      proposal: `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
Ref: *BM-OTC-703-FOUANI*

Good day management! Fast-track your commercial electronics container invoices:

📊 *TODAY'S LOCKED PROPOSAL:*
• *Order Allocation:* $50,000 USD (Factory Clearance)
• *Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦76,000,000 NGN
• *Speed:* Under 15 Minutes Direct to Factory

🏦 *INSTITUTIONAL ESCROW CLEARING VAULT:*
• *Bank:* Providus Bank (CBN Licensed)
• *Account Name:* AlphaDesk OTC / Institutional Settlement Trust
• *Account Number:* \`0104882910\`
• *Payment Narration:* BM-OTC-703-FOUANI
• *Security Guarantee:* 100% platform-bonded escrow. Funds held safely until your factory confirms receipt.

👉 *Reply with your China Invoice or Call 0802 279 1227 to lock this batch today.*`
    }
  ];

  for (const d of deals) {
    const waUrl = `https://wa.me/${d.cleanPhone}?text=${encodeURIComponent(d.proposal)}`;

    const card = `🏢 *DEAL #${d.id}: ${d.clientName.toUpperCase()}*
🆔 *REF:* \`${d.ref}\` | 📦 *VOLUME:* ${d.volume}
💰 *YOUR SPREAD PROFIT:* *+${d.profit}*
━━━━━━━━━━━━━━━━━━━━━━
🏦 *CLIENT DEPOSIT ESCROW DESTINATION (OFFICIAL DESK VAULT):*
• *Bank:* Providus Bank (CBN Licensed)
• *Account Name:* ${d.merchantAccountName}
• *Clearing Account:* \`${d.merchantAccount}\`
• *Merchant Hotline:* \`${d.merchantHotline}\`

💰 *YOUR PRIVATE PROFIT DESTINATION (NEVER SHOWN TO CLIENT):*
• Bank: *OPay Digital Services*
• Account: \`7034297995\` (*Oyelakin Tosin Matthew*)

🟢 *1-CLICK WHATSAPP PROPOSAL (WITH OFFICIAL DESK VAULT):*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

    console.log(`Sending Deal #${d.id} with Merchant Clearing Vault...`);
    await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: adminPhone, message: card, lineId: 2 })
    });
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log('\n🎉 ALL CLEAN DEALS WITH MERCHANT ESCROW VAULT DELIVERED TO ADMIN WHATSAPP!');
}

dispatchMerchantEscrowSuite().catch(console.error);
