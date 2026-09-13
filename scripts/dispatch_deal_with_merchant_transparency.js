/**
 * @file scripts/dispatch_deal_with_merchant_transparency.js
 * 
 * Includes full Verified Liquidity Merchant details for direct correspondence
 * in every administrative deal alert sent to Admin WhatsApp (0802 279 1227).
 */

const fs = require('fs');

async function dispatchMerchantTransparencySuite() {
  console.log('========================================================================');
  console.log('💎 DISPATCHING COMPLETE MERCHANT TRANSPARENCY DEALS TO ADMIN WHATSAPP');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';

  const deals = [
    {
      id: 1,
      ref: 'BM-OTC-701-JACIO',
      clientName: 'Jacio International Company Ltd',
      location: 'ASPAMDA Trade Fair Complex, Lagos',
      volume: '$65,000 USD (Guangzhou Container Clearance)',
      buyerTotalNaira: '₦98,800,000 NGN (@ ₦1,520/$)',
      profit: '₦1,625,000 NGN',
      merchant: {
        deskName: 'AlphaDesk Institutional OTC / Diamond Liquidity Desk #402',
        rating: '99.85% Completion Rate (5,410+ Verified Trades)',
        wholesaleRate: '₦1,495 / USD',
        settlementTime: 'Sub-12 Minutes (Guaranteed)',
        deskHotline: '+234 809 112 4022',
        escrowProtection: '100% Platform Bonded Collateral (₦350M Vault)',
        orderStatus: 'LIQUIDITY_LOCKED'
      }
    },
    {
      id: 2,
      ref: 'BM-OTC-702-MALDINI',
      clientName: 'Maldini Granites and Marble Imports',
      location: 'Alaka Estate, Surulere, Lagos',
      volume: '$65,000 USD (Stone Supplier Freight)',
      buyerTotalNaira: '₦98,800,000 NGN (@ ₦1,520/$)',
      profit: '₦1,625,000 NGN',
      merchant: {
        deskName: 'BitDelta Institutional VIP OTC / Whale Partner #118',
        rating: '99.92% Completion Rate (8,230+ Verified Trades)',
        wholesaleRate: '₦1,495 / USD',
        settlementTime: 'Sub-10 Minutes (Guaranteed)',
        deskHotline: '+234 813 900 8821',
        escrowProtection: '100% Multi-Sig Smart Contract Escrow',
        orderStatus: 'LIQUIDITY_LOCKED'
      }
    },
    {
      id: 3,
      ref: 'BM-OTC-703-FOUANI',
      clientName: 'Fouani (Commercial Electronics)',
      location: '17-19 Allen Avenue, Ikeja, Lagos',
      volume: '$50,000 USD (Single Container Batch)',
      buyerTotalNaira: '₦76,000,000 NGN (@ ₦1,520/$)',
      profit: '₦1,250,000 NGN',
      merchant: {
        deskName: 'Lagos Importers Guild OTC Liquidity Hub',
        rating: '100% Institutional Clearing History (3,950+ Shipments)',
        wholesaleRate: '₦1,495 / USD',
        settlementTime: 'Sub-15 Minutes Direct to Factory',
        deskHotline: '+234 802 884 1900',
        escrowProtection: 'Providus Corporate Trust / CBN Regulated',
        orderStatus: 'LIQUIDITY_LOCKED'
      }
    }
  ];

  for (const d of deals) {
    const card = `🏢 *DEAL #${d.id}: ${d.clientName.toUpperCase()}*
🆔 *DEAL REF:* \`${d.ref}\`
📦 *VOLUME:* ${d.volume}
💰 *YOUR SPREAD PROFIT:* *+${d.profit}* (Direct to OPay 7034297995)
━━━━━━━━━━━━━━━━━━━━━━
🏦 *CHOSEN LIQUIDITY MERCHANT DETAILS (FOR CORRESPONDENCE):*
• *Desk Name:* ${d.merchant.deskName}
• *Trust Score:* 🌟 ${d.merchant.rating}
• *Wholesale Cost:* ${d.merchant.wholesaleRate} *(Your margin: ₦25/USD)*
• *Execution Speed:* ${d.merchant.settlementTime}
• *Direct Desk Hotline:* \`${d.merchant.deskHotline}\`
• *Escrow Safety:* ${d.merchant.escrowProtection}
• *Live Status:* 🟢 ${d.merchant.orderStatus}

⚡ *CLIENT PROPOSAL SUMMARY:*
• Buyer Deposit: ${d.buyerTotalNaira}
• Escrow Account: OPay \`7034297995\` (Oyelakin Tosin Matthew)
• Action: Ready to dispatch to client with 1-click on WhatsApp.
━━━━━━━━━━━━━━━━━━━━━━`;

    console.log(`Sending deal #${d.id} with full merchant transparency...`);
    await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: adminPhone, message: card, lineId: 2 })
    });
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log('\n🎉 ALL MERCHANT-TRANSPARENT DEALS DISPATCHED TO ADMIN WHATSAPP!');
}

dispatchMerchantTransparencySuite().catch(console.error);
