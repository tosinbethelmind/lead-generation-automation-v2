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
  | 'B2B_DOSSIER_REQUEST'
  | 'CLARIFICATION_EXPLANATION'
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
      messageText: `No problem at all! You have been removed from our messages. Wishing ${name} huge business success. - Bethelmind Analytics Lagos`,
      suggestedAction: 'DNC_SUPPRESS',
      directPaymentEligible: false
    };
  }

  // 1b. Clarification & Plain English Explanation ("I don't understand / What is this about?")
  if (/understand|what is this|what does this mean|explain|who is this|who are you|what do you mean|what are you talking about|how does it concern me|i don't get|what for|meaning|why message|why did you send|confused/i.test(msg)) {
    return {
      intent: 'CLARIFICATION_EXPLANATION',
      messageText:
        `Good day sir/ma! 👋 Sorry for any confusion. Let me explain very simply:\n\n` +
        `We noticed your business *${name}* in ${leadData.area || 'Nigeria'}.\n\n` +
        `💡 *WHY WE CONTACTED YOU:*\n` +
        `Most times, new customers want to buy from you or ask prices at night or when you are busy, but if nobody replies to them quickly on WhatsApp, they leave and buy from other competitors.\n\n` +
        `So our firm (*Bethelmind Analytics Lagos*) designed a professional modern website and an automated 24/7 WhatsApp assistant for *${name}* that replies to your customers, answers their questions, and gives them quotes automatically day and night.\n\n` +
        `👉 *We already prepared a FREE sample website for you to see on your phone:*\n` +
        `${previewUrl}\n\n` +
        `📱 You can open the link right now on your phone — it is 100% FREE to look at. You don't pay ₦1 to inspect it.\n\n` +
        `🛠️ *HOW WE LAUNCH IT OFFICIALLY IN 48 HOURS:*\n` +
        `• 100% Turnkey DFY Website + 24/7 WhatsApp AI: *₦75,000 commitment deposit* (₦150,000 total, balance only upon approval).\n` +
        `• 1-Line Embed Upgrade: *₦35,000 deposit*.\n\n` +
        `🏦 *Official OPay Settlement Account:*\n` +
        `• Bank: *${OPAY_BENEFICIARY_CONFIG.bankName}*\n` +
        `• Account Number: *${OPAY_BENEFICIARY_CONFIG.accountNumber}*\n` +
        `• Account Name: *${OPAY_BENEFICIARY_CONFIG.accountName}*\n\n` +
        `Transfer your deposit and share your receipt here to lock in your 48-hour delivery slot!`,
      suggestedAction: 'EXPLAIN_VALUE_AND_ENGAGE',
      directPaymentEligible: true
    };
  }

  // 2. Ready to pay / Send invoice request / Close Deal & Positive Interest
  if (/account|bank|pay|invoice|transfer|send details|deposit|ready to start|moniepoint|opay|interested|proceed|i want|let's start|how do we start|how to start|deal|buy|get started|how much to start|give me account|payment|send account|ready|start now|set it up|close deal/i.test(msg)) {
    // Check if client specifically asked for Android App (₦125k deposit), Embed (₦35k), or Dossier (₦150k)
    let selectedPackage = 'Complete Turnkey Business Website + 24/7 AI WhatsApp Sales Assistant';
    let totalCost = '₦150,000 NGN';
    let depositAmount = '₦75,000 NGN';

    if (/app|android|mobile|apk|luxury/i.test(msg)) {
      selectedPackage = 'Luxury Web Portal + Branded Android Mobile App (.apk) with Customer Push Notifications';
      totalCost = '₦250,000 NGN';
      depositAmount = '₦125,000 NGN';
    } else if (/embed|widget|script|existing/i.test(msg)) {
      selectedPackage = '1-Line 24/7 WhatsApp Quoting Assistant Integration (Existing Website)';
      totalCost = '₦65,000 NGN';
      depositAmount = '₦35,000 NGN';
    } else if (/dossier|cac|due diligence|audit|report/i.test(msg)) {
      selectedPackage = 'Institutional B2B Corporate Due Diligence Dossier (CAC Verification + Risk Audit)';
      totalCost = '₦150,000 NGN';
      depositAmount = '₦150,000 NGN (Full Handover)';
    }

    return {
      intent: 'READY_TO_PAY_INVOICE',
      messageText: 
        `🤝 Wonderful decision, Management Team at *${name}*! Let's get your business automated and closing deals 24/7.\n\n` +
        `📋 *OFFICIAL INVOICE & SETUP AGREEMENT:*\n` +
        `• Package: *${selectedPackage}*\n` +
        `• Total Value: ${totalCost}\n` +
        `• *Milestone Commitment Deposit to Start: ${depositAmount}*\n` +
        `• Balance Terms: Strictly payable AFTER your deployment is completed, live on Google, and 100% approved by you.\n` +
        `• Delivery SLA: Live & ready in exactly 48 Hours.\n\n` +
        `🏦 *OFFICIAL DIRECT OPAY SETTLEMENT ACCOUNT:*\n` +
        `• Bank: *${OPAY_BENEFICIARY_CONFIG.bankName}*\n` +
        `• Account Number: *${OPAY_BENEFICIARY_CONFIG.accountNumber}*\n` +
        `• Account Name: *${OPAY_BENEFICIARY_CONFIG.accountName}*\n` +
        `• Narration/Ref: *${name.slice(0, 15)} Setup*\n\n` +
        `⚡ *NEXT STEP TO COMMENCE:* \n` +
        `1. Transfer your commitment deposit (${depositAmount}) to the OPay account above.\n` +
        `2. Send your transfer receipt or payment screenshot right here on WhatsApp.\n` +
        `3. Our Lagos technical desk will immediately register your domain/staging and begin setup!\n\n` +
        `👉 Live preview link: ${previewUrl}`,
      suggestedAction: 'AWAIT_PAYMENT_PROOF',
      directPaymentEligible: true,
      actionButtons: [
        { label: 'Confirm Payment', payload: 'PAYMENT_CONFIRMED' }
      ]
    };
  }

  // 3. High-Ticket B2B Corporate Due Diligence Dossier Inquiry
  if (/dossier|due diligence|cac|director|counterparty|background check|risk report|investigate/i.test(msg)) {
    return {
      intent: 'B2B_DOSSIER_REQUEST',
      messageText:
        `Good day! 👋 For *${name}* or any corporate counterparty in Nigeria, our Lagos Intelligence Desk generates bankable **Institutional B2B Corporate Due Diligence Dossiers**:\n\n` +
        `📋 *WHAT IS INCLUDED IN THE ₦150,000 EXECUTIVE DOSSIER:*\n` +
        `1️⃣ CAC Public Registry Resolution & Registered Directors Mapping.\n` +
        `2️⃣ SearchPhone Telecom Handset & Carrier Fraud Risk Audit.\n` +
        `3️⃣ Institutional Composite Trust Grade (AAA / AA / A Scoring).\n` +
        `4️⃣ Watermarked, Printable Executive Audit Report (PDF/HTML) authorized by Bethelmind Analytics Lagos Desk.\n` +
        `5️⃣ Delivered within 24 Hours.\n\n` +
        `🏦 *Fee: ₦150,000 NGN* per audited entity.\n` +
        `Settlement: *Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions)*.\n\n` +
        `To commission this dossier immediately, transfer ₦150,000 to the Moniepoint account above and send your proof here!`,
      suggestedAction: 'COMMISSION_DOSSIER',
      directPaymentEligible: true
    };
  }

  // 4. Pricing / Packages Inquiry — Close Deal & Give Account Details Immediately
  if (/price|cost|how much|charges|fee|package|plans|rate/i.test(msg)) {
    return {
      intent: 'PRICING_INQUIRY',
      messageText:
        `Good day! 👋 Here is our complete package ladder and official settlement details for *${name}*:\n\n` +
        `💎 *1. STARTER: Complete Web Presence + 24/7 WhatsApp AI Assistant*\n` +
        `• Setup Fee: *₦45,000 NGN* (One-off setup, ideal if you don't have a website)\n` +
        `• Includes mobile web page, Google Maps setup, and 24/7 automated WhatsApp quoter. Ready in 48 hours!\n\n` +
        `⚡ *2. PRO: Custom Domain (.com/.ng) + Priority Automation*\n` +
        `• Total: ₦85,000 NGN | *Commitment Deposit: ₦40,000 NGN*\n` +
        `• Includes your custom company domain, business email, and high-speed hosting.\n\n` +
        `🏦 *OFFICIAL DIRECT MONIEPOINT SETTLEMENT ACCOUNT:*\n` +
        `• Bank: *${OPAY_BENEFICIARY_CONFIG.bankName}*\n` +
        `• Account Number: *${OPAY_BENEFICIARY_CONFIG.accountNumber}*\n` +
        `• Account Name: *${OPAY_BENEFICIARY_CONFIG.accountName}*\n` +
        `• Narration/Ref: *${name.slice(0, 15)} Setup*\n\n` +
        `👉 Test your live sample preview on your phone right now: \n${previewUrl}\n\n` +
        `⚡ *TO LOCK IN YOUR SETUP TODAY:*\n` +
        `Transfer to the Moniepoint account above, send your receipt here, and we begin immediately!`,
      suggestedAction: 'QUALIFY_PACKAGE',
      directPaymentEligible: true
    };
  }

  // 5. Request Demo / Link / "Where is the link?"
  if (/link|demo|sample|preview|see it|show me|where/i.test(msg)) {
    return {
      intent: 'REQUEST_DEMO_LINK',
      messageText:
        `Here is your free sample preview created for *${name}*:\n\n` +
        `👉 ${previewUrl}\n\n` +
        `📱 Open it on your phone to see how your business will look to customers on Google.\n` +
        `You can tap the buttons to test the 24/7 WhatsApp quoting engine.\n\n` +
        `🛠️ *READY TO LAUNCH FOR YOUR BUSINESS IN 48 HOURS?*\n` +
        `• Complete Web Presence + WhatsApp AI: *₦45,000 NGN* one-off.\n` +
        `• Bank: *Moniepoint Microfinance Bank* | Account: *6805375225* | Name: *Bethelmind Digital Solutions*\n\n` +
        `Send your receipt here once transferred and we commence deployment immediately!`,
      suggestedAction: 'AWAIT_DEMO_FEEDBACK',
      directPaymentEligible: true
    };
  }

  // 6. Trust & Verification / "Who are you? / Is this real?"
  if (/legit|scam|trust|real|who are you|office|address|guarantee|understand/i.test(msg)) {
    return {
      intent: 'TRUST_VERIFICATION',
      messageText:
        `Hello! 👋 My name is Tosin from Bethelmind Digital Solutions.\n\n` +
        `We are a registered business technology firm in Lagos. We created a free sample preview for *${name}* to help you get more customers online and answer enquiries on WhatsApp even when you are busy or asleep.\n\n` +
        `🛡️ *Why You Are 100% Protected:* \n` +
        `1. You test your sample preview completely FREE on your phone: ${previewUrl}\n` +
        `2. One-time setup of ₦45,000 NGN (complete web presence + 24/7 WhatsApp AI bot).\n` +
        `3. Guaranteed 48-Hour delivery SLA.\n` +
        `4. Direct settlement to verified Nigerian business account: *Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions)*.\n` +
        `5. Direct WhatsApp / Phone hotline: +234 802 279 1227.\n\n` +
        `Once transferred, share your receipt here so we can activate your deployment!`,
      suggestedAction: 'REASSURE_AND_CLOSE',
      directPaymentEligible: true
    };
  }

  // Default: Simple, Warm Handshake with Voice Note Bridge, Packages & Moniepoint Details
  return {
    intent: 'GREETING_HANDSHAKE',
    messageText:
      `Good day! 👋 Welcome to Bethelmind Digital Solutions.\n\n` +
      `We prepared a customized interactive prototype for *${name}* to show you how clients in ${leadData.area || 'Nigeria'} can easily discover your business on Google and receive instant 24/7 quotes on WhatsApp.\n\n` +
      `👉 *View Your Free Live Prototype:* \n${previewUrl}\n\n` +
      `🛠️ *LAUNCH YOUR COMPLETE 24/7 SYSTEM IN 48 HOURS:*\n` +
      `• Complete Web Presence + 24/7 WhatsApp AI Assistant: ₦45,000 one-off.\n` +
      `• Custom Domain + Priority Automation Suite: ₦85,000 (₦40,000 deposit to start).\n` +
      `• Live on Google and WhatsApp in 48 Hours.\n\n` +
      `🏦 *Official Settlement Account:*\n` +
      `• Bank: *Moniepoint Microfinance Bank*\n` +
      `• Account Number: *6805375225*\n` +
      `• Account Name: *Bethelmind Digital Solutions*\n` +
      `• Narration: *${name.slice(0, 15)} Setup*\n\n` +
      `Reply with any questions or transfer and share your receipt here to secure your 48-hour delivery slot!`,
    suggestedAction: 'SEND_DEMO_LINK',
    directPaymentEligible: true
  };
}

/**
 * Handles inbound lead messages from webhooks (e.g. Meta Cloud API, Baileys, Evolution)
 * and returns an immediate conversational AI response in Nigerian business tone.
 */
export async function handleInboundLeadMessage(params: {
  senderPhone: string;
  messageBody: string;
  channel?: string;
}): Promise<{ replyText: string; intent: ProspectIntent; action: string }> {
  const closerRes = handlePostContactInquiry(params.messageBody, {
    businessName: 'Business Owner',
    phone: params.senderPhone,
    hasWebsite: false,
  });
  return {
    replyText: closerRes.messageText,
    intent: closerRes.intent,
    action: closerRes.suggestedAction,
  };
}
