/**
 * @file src/lib/monetization/postContactCloserEngine.ts
 * 
 * BETHELMIND POST-CONTACT AI CLOSER & INBOUND CONVERSION ENGINE
 * 
 * Manages every stage after outreach is delivered:
 * 1. Warm Handshake & Identity Confirmation
 * 2. Instant Demo Walkthrough & Feature Breakdown
 * 3. Package Selection (₦75k/₦150k DFY Turnkey vs ₦35k/₦65k Embed)
 * 4. Freight Importer Wholesale OTC Escrow Rate-Locks ($10k-$60k)
 * 5. Risk-Reversal SLA & Direct-to-OPay Bank Invoice Generation
 * 6. Automated Handover & Cloud Deployment Provisioning
 */

import { OPAY_BENEFICIARY_CONFIG } from './directNairaAutoLiquidationRouter';
import { getLiveMarketRatesSync } from './autonomousLiveRateOracle';

export type ProspectIntent = 
  | 'GREETING_HANDSHAKE'
  | 'REQUEST_DEMO_LINK'
  | 'PRICING_INQUIRY'
  | 'FREIGHT_FX_RATE_LOCK'
  | 'HOW_IT_WORKS_TECHNICAL'
  | 'TRUST_VERIFICATION'
  | 'READY_TO_PAY_INVOICE'
  | 'DEPLOYMENT_HANDOVER'
  | 'OPT_OUT';

export interface CloserResponse {
  intent: ProspectIntent;
  messageText: string;
  suggestedAction: string;
  directPaymentEligible: boolean;
  actionButtons?: { label: string; url?: string; payload?: string }[];
}

export function handlePostContactInquiry(
  clientMessage: string,
  leadData: {
    businessName: string;
    category?: string;
    area?: string;
    phone?: string;
    hasWebsite?: boolean;
    previewUrl?: string;
  }
): CloserResponse {
  const msg = (clientMessage || '').toLowerCase().trim();
  const name = leadData.businessName || 'Valued Business';
  const category = leadData.category || 'Commercial Enterprise';
  const previewUrl = leadData.previewUrl || `https://www.bethelmindanalytics.com/preview/${leadData.phone || 'demo'}`;

  // 1. Opt-out intercept
  if (/stop|unsubscribe|remove|don't message|cancel/i.test(msg)) {
    return {
      intent: 'OPT_OUT',
      messageText: `You have been removed from automated communications. Wishing ${name} continued success. - Bethelmind Analytics Lagos`,
      suggestedAction: 'DNC_SUPPRESS',
      directPaymentEligible: false
    };
  }

  // 2. Ready to pay / Send invoice request
  if (/account|bank|pay|invoice|transfer|send details|deposit|ready to start|moniepoint|opay/i.test(msg)) {
    return {
      intent: 'READY_TO_PAY_INVOICE',
      messageText: 
        `🤝 Excellent decision, Management Team at *${name}*!\n\n` +
        `📋 *OFFICIAL INVOICE & SETUP AGREEMENT*\n` +
        `• Package: 100% Turnkey DFY Website + 24/7 AI WhatsApp Closer + Google Maps SEO\n` +
        `• Total Investment: ₦150,000 NGN (50% Deposit to commence: *₦75,000 NGN*)\n` +
        `• Balance: ₦75,000 upon live deployment & verification.\n` +
        `• Deployment SLA: Exactly 48 Hours to live production.\n\n` +
        `🏦 *OFFICIAL DIRECT PAYMENT DETAILS:*\n` +
        `• Bank Name: *${OPAY_BENEFICIARY_CONFIG.bankName}*\n` +
        `• Account Number: *${OPAY_BENEFICIARY_CONFIG.accountNumber}*\n` +
        `• Account Name: *${OPAY_BENEFICIARY_CONFIG.accountName}*\n` +
        `• Reference: *BM-${name.replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase()}*\n\n` +
        `⚡ Once payment is initiated, kindly send proof here. Our technical team starts domain registration and configuration immediately!`,
      suggestedAction: 'AWAIT_PAYMENT_PROOF',
      directPaymentEligible: true,
      actionButtons: [
        { label: 'Confirm Payment', payload: 'PAYMENT_CONFIRMED' }
      ]
    };
  }

  // 3. Freight / Importer Wholesale FX Rate Lock
  if (/rate|dollar|usdt|china|freight|rmb|supplier|fx|alaba|aspamda|trade fair/i.test(msg)) {
    const liveRates = getLiveMarketRatesSync();
    const wholesaleFloor = liveRates.wholesaleFloorNGN || 1348;
    const spread = liveRates.spreadProfitPerUSD || 25;
    const quotedRate = wholesaleFloor + spread;

    return {
      intent: 'FREIGHT_FX_RATE_LOCK',
      messageText:
        `📦 *BETHELMIND INSTITUTIONAL B2B OTC ESCROW DESK*\n\n` +
        `• Trade Desk: Guaranteed Same-Day Commercial Settlement to China Suppliers\n` +
        `• *Live Wholesale Floor:* ₦${wholesaleFloor.toLocaleString()} / USD (${liveRates.source})\n` +
        `• *Locked Commercial Rate:* ₦${quotedRate.toLocaleString()} / USD *(Spread: +₦${spread}/USD)*\n` +
        `• Escrow Security: 100% CBN-Licensed Vault with Swift MT103 confirmation receipt.\n` +
        `• Speed: Funds delivered to factory wallet/bank in < 15 minutes.\n\n` +
        `🏢 *VERIFIED DIAMOND MERCHANT DESK CONTACT:*\n` +
        `• Desk: AlphaDesk Institutional Liquidity Desk #402\n` +
        `• Desk Head: Alhaji Kabir (Lead Settlement Officer)\n` +
        `• Direct Hotline: +234 809 112 4022\n` +
        `• Office: Plot 12, Commercial Corridor, Victoria Island, Lagos\n` +
        `• Bonded Collateral: ₦450,000,000 NGN in Platform Vault (99.88% Completion)\n\n` +
        `👉 Kindly confirm your order volume ($10,000 - $65,000 USD) and China supplier invoice to lock this live rate for today.`,
      suggestedAction: 'LOCK_OTC_RATE',
      directPaymentEligible: true
    };
  }

  // 4. Pricing / Packages Inquiry
  if (/price|cost|how much|charges|fee|package|plans/i.test(msg)) {
    return {
      intent: 'PRICING_INQUIRY',
      messageText:
        `Good day Management Team at *${name}*! 👋\n\n` +
        `We have structured two transparent commercial options:\n\n` +
        `🔹 *Option 1: Complete Done-For-You Turnkey Deployment (₦150,000)*\n` +
        `• Custom interactive website & brand identity\n` +
        `• Free .com.ng domain + high-speed cloud hosting\n` +
        `• 24/7 AI WhatsApp Closer (responds in < 3s, closes orders)\n` +
        `• Moniepoint / Paystack direct payment setup\n` +
        `• Google Maps Local SEO discovery in Lagos\n` +
        `*(₦75,000 50% deposit to commence / balance upon delivery in 48h)*\n\n` +
        `🔹 *Option 2: 1-Line Script Embed Upgrade (₦35,000 / ₦65,000)*\n` +
        `• For businesses with an existing website who just need the 24/7 AI Closer & quote engine.\n\n` +
        `👉 Which option best fits ${name}'s current goals?`,
      suggestedAction: 'QUALIFY_PACKAGE',
      directPaymentEligible: false
    };
  }

  // 5. Request Demo / Interactive Link
  if (/link|demo|sample|preview|see it|show me/i.test(msg)) {
    return {
      intent: 'REQUEST_DEMO_LINK',
      messageText:
        `Here is your private interactive prototype built for *${name}*:\n\n` +
        `👉 ${previewUrl}\n\n` +
        `⚡ *Key Features to Test:* \n` +
        `1. Tap the WhatsApp Quoting Button to test instant response speed.\n` +
        `2. Test the dynamic quote calculator designed for your ${category} clients.\n` +
        `3. Check mobile loading speed on your phone (< 1.5s paint).\n\n` +
        `Would you like our engineering team to connect your official phone line to this portal today?`,
      suggestedAction: 'AWAIT_DEMO_FEEDBACK',
      directPaymentEligible: false
    };
  }

  // 6. Trust & Security / "Is this genuine?"
  if (/legit|scam|trust|real|who are you|office|address|guarantee/i.test(msg)) {
    return {
      intent: 'TRUST_VERIFICATION',
      messageText:
        `🛡️ *Bethelmind Analytics Lagos Commitment to Security:*\n\n` +
        `1. *Zero Risk*: You test your interactive website prototype completely FREE before paying any final balance.\n` +
        `2. *Structured Milestone*: 50% commitment deposit (₦75,000) to cover domain registration & cloud setup, balance strictly paid after you inspect and approve the live website.\n` +
        `3. *48-Hour SLA*: Guaranteed delivery within 48 hours, or 100% full instant refund.\n` +
        `4. *Physical Contact*: Direct Admin Desk hotline: +234 802 279 1227 (Oyelakin Tosin Matthew).\n\n` +
        `Shall we prepare your official 48-Hour deployment schedule?`,
      suggestedAction: 'REASSURE_AND_CLOSE',
      directPaymentEligible: false
    };
  }

  // Default: Warm greeting handshake
  return {
    intent: 'GREETING_HANDSHAKE',
    messageText:
      `Good day! 👋 Thank you for connecting with Bethelmind Analytics Lagos.\n\n` +
      `We prepared a custom 24/7 AI-powered website prototype for *${name}* to automate customer inquiries and online quote generation.\n\n` +
      `👉 You can test your interactive demo here:\n${previewUrl}\n\n` +
      `Would you like to review how this brings 15–30 net-new paying customers to ${name} every month?`,
    suggestedAction: 'SEND_DEMO_LINK',
    directPaymentEligible: false
  };
}
