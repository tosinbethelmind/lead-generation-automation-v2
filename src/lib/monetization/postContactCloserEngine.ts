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
      messageText: `No problem at all! You have been removed from our messages. Wishing ${name} huge business success. - Bethelmind Digital Solutions`,
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
        `So our firm (*Bethelmind Digital Solutions*) designed a professional modern website and an automated 24/7 WhatsApp assistant for *${name}* that replies to your customers, answers their questions, and gives them quotes automatically day and night.\n\n` +
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
    let totalCost = '₦65,000 NGN (October 50% Promo — Normal Price ₦130,000)';
    let depositAmount = '₦35,000 NGN (Balance of ₦30,000 payable AFTER going live)';

    if (/corporate|option 2|\.com\b|staff email/i.test(msg)) {
      selectedPackage = 'Corporate .COM Domain + 3 Official Staff Emails & 24/7 AI Quoting Suite (October 50% Promo)';
      totalCost = '₦120,000 NGN (October 50% Promo — Normal Price ₦240,000)';
      depositAmount = '₦60,000 NGN (50% Milestone Deposit)';
    } else if (/app|android|mobile|apk|luxury/i.test(msg)) {
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
        `🤝 Wonderful decision, Boss / Management at *${name}*! Let's lock in your *October 50% SME Promo* and get your website live on Google.\n\n` +
        `📋 *OFFICIAL OCTOBER PROMO INVOICE & AGREEMENT:*\n` +
        `• Package: *${selectedPackage}*\n` +
        `• October Promo Total: *${totalCost}*\n` +
        `• *Milestone Deposit to Start Today: ${depositAmount}*\n` +
        `• Balance Terms: Strictly payable ONLY AFTER your website is live on Google with your real shop photos & 100% approved by you.\n` +
        `• Delivery Time: Live & ready within 24–48 Hours.\n\n` +
        `🏛️ *OFFICIAL CAC CORPORATE BANK ACCOUNT:*\n` +
        `• Bank: *${OPAY_BENEFICIARY_CONFIG.bankName}*\n` +
        `• Account Number: *${OPAY_BENEFICIARY_CONFIG.accountNumber}*\n` +
        `• Account Name: *${OPAY_BENEFICIARY_CONFIG.accountName}*\n\n` +
        `⚡ *NEXT STEP TO START:* \n` +
        `1. Transfer your deposit (${depositAmount}) to our corporate Moniepoint account above.\n` +
        `2. Send your transfer receipt + 3 to 5 photos of your business/work right here on WhatsApp.\n` +
        `3. Our Lagos engineer will immediately customize your website and register your domain!\n\n` +
        `👉 Your live sample website: ${previewUrl}`,
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
        `4️⃣ Watermarked, Printable Executive Audit Report (PDF/HTML) authorized by Bethelmind Digital Solutions.\n` +
        `5️⃣ Delivered within 24 Hours.\n\n` +
        `🏦 *Fee: ₦150,000 NGN* per audited entity.\n` +
        `Settlement: *Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions)*.\n\n` +
        `To commission this dossier immediately, transfer ₦150,000 to the Moniepoint account above and send your proof here!`,
      suggestedAction: 'COMMISSION_DOSSIER',
      directPaymentEligible: true
    };
  }

  // 4. Pricing / Packages Inquiry — October 50% SME Promo in Simple Nigerian Business Language
  if (/price|cost|how much|charges|fee|package|plans|rate|promo/i.test(msg)) {
    return {
      intent: 'PRICING_INQUIRY',
      messageText:
        `Good day! 👋 Because we already built 80% of the sample website for *${name}* in advance, you qualify for our *🇳🇬 October 50% SME Digital Growth Promo*:\n\n` +
        `⭐ *Option 1: Official .COM.NG Business Website + WhatsApp Assistant*\n` +
        `• Normal Agency Price: ~₦130,000~\n` +
        `• *October 50% Promo Total: ₦65,000* _(Includes 1 Full Year Domain & Hosting — Zero Monthly Rent!)_\n` +
        `• 👉 *Start Today With Just ₦35,000 Deposit* _(Pay the ₦30,000 balance ONLY after your website is live with your real photos!)_\n\n` +
        `🏆 *Option 2: Corporate .COM Website + 3 Official Staff Emails & AI Calculator*\n` +
        `• Normal Agency Price: ~₦240,000~\n` +
        `• *October 50% Promo Total: ₦120,000*\n` +
        `• 👉 *Start Today With ₦60,000 Deposit* _(Pay ₦60,000 balance after Google & Email handover)_\n\n` +
        `✏️ *Option 3: Free Custom Photo & Price Preview First (₦0 Upfront)*\n` +
        `• Send us 3–5 photos of your shop/work and your price list here on WhatsApp — we will update your sample page FREE so you see it before paying a kobo!\n\n` +
        `🏛️ *Official CAC Corporate Bank Account:*\n` +
        `• Bank: *Moniepoint Microfinance Bank*\n` +
        `• Account No: *6805375225*\n` +
        `• Account Name: *Bethelmind Digital Solutions* _(CAC Certified)_\n\n` +
        `👉 Check your sample website here:\n${previewUrl}\n\n` +
        `Would you like to start with *Option 1 (₦35k Deposit)*, *Option 2 (₦60k Deposit)*, or *send your shop photos first (Free)*?`,
      suggestedAction: 'QUALIFY_PACKAGE',
      directPaymentEligible: true
    };
  }

  // 5. Request Demo / Link / "DEMO" Trigger from SMS — Warm Nigerian Tone + October 50% Promo
  if (/link|demo|sample|preview|see it|show me|where/i.test(msg)) {
    return {
      intent: 'REQUEST_DEMO_LINK',
      messageText:
        `Good day Boss / Management at *${name}*! 👋 Well done with your work in ${leadData.area || 'Nigeria'}.\n\n` +
        `When customers search for *${name}* on Google right now, you don't have an official website yet, so other businesses show up instead.\n\n` +
        `We already built a *ready-made sample website + 24/7 WhatsApp assistant* for *${name}*.\n\n` +
        `👉 *Tap here to check your sample website FREE on your phone (₦0 to view):*\n` +
        `${previewUrl}\n\n` +
        `🇳🇬 *OCTOBER 50% SME PROMO (Because Your Sample Is Already 80% Built):*\n` +
        `1️⃣ *Option 1 (Official .COM.NG Website + WhatsApp Closer):* *₦65,000 Total* _(Normal price ~₦130,000~)_ — *Start today with ₦35,000 Deposit* and pay the ₦30k balance ONLY after it is live with your photos!\n` +
        `2️⃣ *Option 2 (Corporate .COM + Staff Emails Suite):* *₦120,000 Total* _(Normal price ~₦240,000~)_ — *Start today with ₦60,000 Deposit*.\n` +
        `3️⃣ *Want to see your real shop photos on it first?* Send 3–5 photos of your work here on WhatsApp and we will update your sample page FREE before you pay!\n\n` +
        `🏛️ *CAC Corporate Account:* Moniepoint MFB · *6805375225* · *Bethelmind Digital Solutions*\n\n` +
        `Tap the link above to check your website on your phone now and tell me what you think!`,
      suggestedAction: 'AWAIT_DEMO_FEEDBACK',
      directPaymentEligible: true
    };
  }

  // 6. Trust & Verification / "Who are you? / Is this real?"
  if (/legit|scam|trust|real|who are you|office|address|guarantee|understand/i.test(msg)) {
    return {
      intent: 'TRUST_VERIFICATION',
      messageText:
        `Good day! 👋 My name is Tosin from *Bethelmind Digital Solutions* (a CAC Certified Nigerian Company in Lagos).\n\n` +
        `We built a free sample website for *${name}* so you can see how your business will look on Google before paying a kobo.\n\n` +
        `🛡️ *Why You Are 100% Safe With Us:* \n` +
        `1. *Check Your Website Free First:* Open ${previewUrl} on your phone at ₦0 cost.\n` +
        `2. *Send Your Photos First (Free):* You can send us your shop photos on WhatsApp and see them on your page before paying.\n` +
        `3. *50% October Promo Milestone:* Standard *.com.ng* website is *₦65,000* (down from ₦130k) — you only pay *₦35,000 deposit* to start, and pay the ₦30,000 balance AFTER your website is live on Google!\n` +
        `4. *CAC Registered Corporate Bank Account:* You never pay into any personal account — our official bank account is *Moniepoint Microfinance Bank · 6805375225 · Bethelmind Digital Solutions*.\n\n` +
        `Check your sample website link above and message me whenever you are ready!`,
      suggestedAction: 'REASSURE_AND_CLOSE',
      directPaymentEligible: true
    };
  }

  // Default: Simple, Warm Nigerian Business Handshake + October 50% Promo
  return {
    intent: 'GREETING_HANDSHAKE',
    messageText:
      `Good day Boss / Management at *${name}*! 👋 Welcome to *Bethelmind Digital Solutions* (CAC Certified).\n\n` +
      `We noticed *${name}* in ${leadData.area || 'Nigeria'} doesn't have an official website on Google yet, so we built a *free sample website + 24/7 WhatsApp assistant* for you to check on your phone:\n\n` +
      `👉 *Tap here to see ${name}'s sample website (100% Free):*\n${previewUrl}\n\n` +
      `🇳🇬 *OCTOBER 50% SME PROMO (Ends Oct 31):*\n` +
      `• *Option 1 (Official .COM.NG Website):* *₦65,000 Total* _(down from ~₦130,000~)_ — *Start today with ₦35,000 Deposit*, pay ₦30k balance after going live!\n` +
      `• *Option 2 (Corporate .COM + Staff Emails):* *₦120,000 Total* _(down from ~₦240,000~)_ — *Start with ₦60,000 Deposit*.\n` +
      `• *Option 3 (Free Photo Update First):* Send us 3–5 shop photos here on WhatsApp and we will put them on your sample page FREE first!\n\n` +
      `🏛️ *CAC Corporate Account:* Moniepoint MFB · *6805375225* · *Bethelmind Digital Solutions*\n\n` +
      `Tap the link above to check your website now, and reply *1*, *2*, or send your shop photos!`,
    suggestedAction: 'SEND_DEMO_LINK',
    directPaymentEligible: true
  };
}

/**
 * Automatically looks up an incoming WhatsApp/SMS sender's phone number
 * in local_db/leads_db.json so we greet them by their EXACT Business Name
 * and send their exact pre-built /preview/[slug] link!
 */
export function lookupLeadByPhoneOrText(senderPhone: string, messageBody?: string): {
  businessName: string;
  category: string;
  area: string;
  previewUrl: string;
  hasWebsite: boolean;
} {
  const cleanDigits = (senderPhone || '').replace(/\D/g, '');
  const phoneTail = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'local_db', 'leads_db.json');
    if (fs.existsSync(dbPath)) {
      const leads = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (Array.isArray(leads)) {
        const matched = leads.find((l: any) => {
          const p = String(l.phone_e164 || l.phone_raw || l.phone || '').replace(/\D/g, '');
          return phoneTail && p.endsWith(phoneTail);
        });
        if (matched) {
          const rawName = String(matched.name || matched.business_name || 'Valued Business')
            .split('||')[0]
            .split('|')[0]
            .trim();
          const slug =
            (matched.preview_url && String(matched.preview_url).replace(/^\/preview\//, '')) ||
            (matched.lead_id && !String(matched.lead_id).startsWith('lead_1') ? matched.lead_id : '') ||
            rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          return {
            businessName: rawName,
            category: matched.category || matched.sector || 'Commercial Enterprise',
            area: matched.area || matched.city || 'Lagos',
            previewUrl: `https://www.bethelmindanalytics.com/preview/${slug}`,
            hasWebsite: false
          };
        }
      }
    }
  } catch (_) {}

  // Fallback if they used a secondary phone line: check if their message mentions their business name
  const bodyMatch = (messageBody || '').match(/for\s+\*?([A-Za-z0-9\s&'-]{3,40})\*?/i);
  const fallbackName = bodyMatch ? bodyMatch[1].trim() : 'Your Business';
  const fallbackSlug = fallbackName !== 'Your Business'
    ? fallbackName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    : (phoneTail || 'demo');

  return {
    businessName: fallbackName,
    category: 'Commercial Enterprise',
    area: 'Nigeria',
    previewUrl: `https://www.bethelmindanalytics.com/preview/${fallbackSlug}`,
    hasWebsite: false
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
  const resolvedLead = lookupLeadByPhoneOrText(params.senderPhone, params.messageBody);
  const closerRes = handlePostContactInquiry(params.messageBody, {
    businessName: resolvedLead.businessName,
    category: resolvedLead.category,
    area: resolvedLead.area,
    phone: params.senderPhone,
    hasWebsite: resolvedLead.hasWebsite,
    previewUrl: resolvedLead.previewUrl,
  });
  return {
    replyText: closerRes.messageText,
    intent: closerRes.intent,
    action: closerRes.suggestedAction,
  };
}
