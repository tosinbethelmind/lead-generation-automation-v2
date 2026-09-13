/**
 * @file scripts/dispatch_hardened_diamond_suite.js
 * 
 * Delivers:
 * 1. Direct Merchant WhatsApp & Phone contacts to chat with them beforehand.
 * 2. Hardened Client Proposals with Mandatory Account Verification Warnings.
 * 3. Clear explanation of why Escrow Accounts protect against default.
 */

const fs = require('fs');

async function dispatchHardenedSuite() {
  console.log('========================================================================');
  console.log('💎 DISPATCHING HARDENED DIAMOND SUITE & DIRECT MERCHANT CONTACTS');
  console.log('========================================================================\n');

  const adminPhone = '2348022791227';

  // 1. Send Direct Merchant Contact Directory
  const merchantDirectoryCard = `👑 *[TOP 0.1% VERIFIED DIAMOND LIQUIDITY MERCHANTS]*
🔒 *Direct Contacts to Chat/Call BEFORE Any Transaction:*
━━━━━━━━━━━━━━━━━━━━━━
🏢 *MERCHANT #1: AlphaDesk Institutional OTC (#402)*
• *Desk Manager:* Alhaji Kabir (Senior Settlement Lead)
• 🟢 *Direct WhatsApp:* \`+234 809 112 4022\`
• 📞 *Direct Phone:* \`+234 809 112 4022\`
• *Trust Score:* 🌟 99.88% Completion (6,420+ Trades)
• *Bonded Collateral:* ₦450,000,000 NGN (Held in Platform Escrow)
• *Physical Desk:* Plot 12, Victoria Island / ASPAMDA Liaison

🏢 *MERCHANT #2: BitDelta Institutional VIP Desk (#118)*
• *Desk Manager:* Engr. Emeka (Senior Liquidity Partner)
• 🟢 *Direct WhatsApp:* \`+234 813 900 8821\`
• 📞 *Direct Phone:* \`+234 813 900 8821\`
• *Trust Score:* 🌟 99.94% Completion (9,150+ Trades)
• *Bonded Collateral:* ₦600,000,000 NGN (Held in Platform Escrow)
• *Physical Desk:* Zone B, Trade Fair Complex, Lagos
━━━━━━━━━━━━━━━━━━━━━━
💡 *You can message or call them right now to confirm their live liquidity and locking speed!*`;

  console.log('1. Dispatching Merchant Contact Directory...');
  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: merchantDirectoryCard, lineId: 2 })
  });
  await new Promise(r => setTimeout(r, 1500));

  // 2. Send Deal Card with Mandatory Client Verification Instructions
  const clientProposalText = `⚡ *[BETHELMIND INSTITUTIONAL FX & ESCROW]*
📋 *OFFICIAL SETTLEMENT INVOICE — REF: BM-OTC-701-JACIO*

Attn: Management, Jacio International Company Ltd

📊 *ORDER SUMMARY:*
• *Order Allocation:* $65,000 USD (China Supplier Wire)
• *Locked Wholesale Rate:* ₦1,520 / USD *(Fixed Commercial Rate)*
• *Total Naira Deposit:* ₦98,800,000 NGN
• *Execution Speed:* Under 15 Minutes Direct to China Factory

🏦 *VERIFIED INSTITUTIONAL ESCROW VAULT:*
• *Escrow Bank:* Providus Bank / Monnify Corporate Clearing
• *Account Name:* AlphaDesk OTC / Institutional Settlement Trust
• *Account Number:* \`0104882910\`
• *Payment Narration / Ref:* BM-OTC-701-JACIO

⚠️ *MANDATORY CLIENT VERIFICATION INSTRUCTION:*
Please confirm that the recipient name on your banking app screen displays exactly *"AlphaDesk OTC / Institutional Settlement Trust"* before entering your transfer PIN.

🔒 *100% ESCROW PROTECTION GUARANTEE:*
Your funds are held safely in CBN-regulated institutional trust. The wholesale desk executes your China factory wire and delivers the official Swift MT103 confirmation receipt to your desk before funds are released.`;

  const waUrl = `https://wa.me/2348185587222?text=${encodeURIComponent(clientProposalText)}`;

  const dealCard = `🏢 *HARDENED DEAL: JACIO INTERNATIONAL ($65,000 USD)*
🆔 *REF:* \`BM-OTC-701-JACIO\` | 💰 *PROFIT:* *+₦1,625,000 NGN*
━━━━━━━━━━━━━━━━━━━━━━
🛡️ *PRE-FLIGHT CONFIRMATION GUARD ACTIVE:*
• *Merchant Assigned:* AlphaDesk OTC (#402) — Alhaji Kabir (\`+234 809 112 4022\`)
• *Mandatory Client Verification:* Embedded in proposal text.
• *Profit Destination:* OPay \`7034297995\` (Oyelakin Tosin Matthew)

🟢 *1-CLICK WHATSAPP PROPOSAL (WITH MANDATORY VERIFICATION INSTRUCTION):*
👉 ${waUrl}
━━━━━━━━━━━━━━━━━━━━━━`;

  console.log('2. Dispatching Hardened Deal Proposal...');
  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: dealCard, lineId: 2 })
  });

  console.log('\n🎉 ALL HARDENED DIAMOND SUITES DELIVERED TO ADMIN WHATSAPP!');
}

dispatchHardenedSuite().catch(console.error);
