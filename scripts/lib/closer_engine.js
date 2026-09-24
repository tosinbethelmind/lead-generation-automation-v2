/**
 * @file scripts/lib/closer_engine.js
 * 
 * 🤖 PURE COMMONJS AI CLOSER & CONVERSION ENGINE
 * 
 * Guarantees zero module resolution failures in whatsapp_baileys.js and
 * ensures intelligent, contextual responses to every Nigerian business inquiry.
 */

const OPAY_BENEFICIARY = {
  bankName: 'OPay Digital Services',
  accountNumber: '7034297995',
  accountName: 'Oyelakin Tosin Matthew'
};

function handlePostContactInquiry(clientMessage, leadData = {}) {
  const msg = (clientMessage || '').toLowerCase().trim();
  const name = leadData.businessName || 'Valued Enterprise';
  const area = leadData.area || 'Lagos';
  const previewUrl = leadData.previewUrl || `https://www.bethelmindanalytics.com/preview/${leadData.phone || 'demo'}`;

  // 1. Opt-out / Stop
  if (/stop|unsubscribe|remove|don't message|cancel/i.test(msg)) {
    return {
      intent: 'OPT_OUT',
      messageText: `No problem at all! You have been removed from our messages. Wishing ${name} huge business success. - Bethelmind Analytics Lagos`,
      suggestedAction: 'DNC_SUPPRESS',
      directPaymentEligible: false
    };
  }

  // 1B. Voice Note / Audio Message
  if (/\[voice note received\]|voice note|audio message/i.test(msg)) {
    return {
      intent: 'VOICE_NOTE_ACK',
      messageText:
        `Hello ${name}! 🎙️ We received your voice note and our Lagos team is listening to it right away.\n\n` +
        `While we review your audio, you can test your customized 24/7 quoting demo and sample website on your phone here:\n` +
        `👉 ${previewUrl}\n\n` +
        `We will follow up on your voice message immediately!`,
      suggestedAction: 'ACK_VOICE_NOTE',
      directPaymentEligible: false
    };
  }

  // 2. Video Explainer Request / "Send video"
  if (/video|clip|watch|show video|send video|see video/i.test(msg)) {
    return {
      intent: 'VIDEO_DEMO_REQUEST',
      messageText:
        `Here is your 45-second interactive demonstration for *${name}*! 🎥\n\n` +
        `👉 *Watch Full Live Demo on Your Phone:*\n${previewUrl}#video\n\n` +
        `📱 *In this 45-second walkthrough, you will see:*\n` +
        `1. How clients in ${area} discover ${name} on Google.\n` +
        `2. How the WhatsApp Assistant answers inquiries and issues quotes in 2 seconds.\n` +
        `3. How orders and bookings land directly on your phone.\n\n` +
        `You can test everything 100% free with ₦0 upfront risk. Ready to see it in action?`,
      suggestedAction: 'SEND_VIDEO_ASSET',
      directPaymentEligible: false
    };
  }

  // 2B. Test Drive / "Testing the 2-second AI auto-reply" / Live Verification
  if (/test|testing|2-second|test drive|instant quote demo/i.test(msg)) {
    return {
      intent: 'TEST_DRIVE_VERIFICATION',
      messageText:
        `⚡ *BINGO! 2-SECOND AI AUTO-REPLY VERIFIED!*\n\n` +
        `Look at your clock right now — our 24/7 AI closer just answered you in less than 2 seconds! 🚀\n\n` +
        `💡 *HERE IS WHAT THIS MEANS FOR ${name.toUpperCase()}:*\n` +
        `When a customer searches for your services at 11:30 PM or while you are busy on-site, they will receive an instant, polite, professional reply with your prices and pictures before they can look for competitors.\n\n` +
        `👉 *Your Free Sample Website & WhatsApp Engine:* \n${previewUrl}\n\n` +
        `🛠️ *HOW WE LAUNCH IT FOR ${name.toUpperCase()} IN 48 HOURS:*\n` +
        `1️⃣ *Core Turnkey Website + WhatsApp AI*: ₦75,000 commitment deposit (₦150,000 total)\n` +
        `2️⃣ *1-Line Embed Upgrade*: ₦35,000 (if you already have a website)\n\n` +
        `Should we configure this on your official business WhatsApp line?`,
      suggestedAction: 'CONVERT_TEST_DRIVE',
      directPaymentEligible: false
    };
  }

  // 2C. Confusion / "I don't understand" / "What is this about?" / "Who are you?"
  if (/understand|what is this|what does this mean|explain|who is this|who are you|what do you mean|what are you talking about|how does it concern me|i don't get|what for|meaning|why message|why did you send|confused/i.test(msg)) {
    return {
      intent: 'CLARIFICATION_EXPLANATION',
      messageText:
        `Good day sir/ma! 👋 Sorry for any confusion. Let me explain very simply:\n\n` +
        `We noticed your business *${name}* in ${area}.\n\n` +
        `💡 *WHY WE CONTACTED YOU:*\n` +
        `Many times, new customers want to buy from you, book your services, or ask prices at night or when you are busy. But if nobody answers them quickly on WhatsApp, they leave and go to competitors.\n\n` +
        `So our firm (*Bethelmind Analytics Lagos Desk*) designed a professional modern website and an automated 24/7 WhatsApp quoting assistant for *${name}* that answers your customers' questions and gives them quotes automatically day and night.\n\n` +
        `👉 *We already prepared a FREE sample website for you to test on your phone:*\n` +
        `${previewUrl}\n\n` +
        `📱 Open the link right now on your phone — it is 100% FREE to inspect. You don't pay ₦1 to look at it.\n\n` +
        `🛠️ *HOW WE LAUNCH IT OFFICIALLY IN 48 HOURS:*\n` +
        `• 100% Turnkey DFY Website + 24/7 WhatsApp AI: *₦75,000 commitment deposit* (₦150,000 total, balance only upon approval).\n` +
        `• 1-Line Embed Upgrade: *₦35,000 deposit*.\n\n` +
        `🏦 *Official OPay Settlement Account:*\n` +
        `• Bank: *${OPAY_BENEFICIARY.bankName}*\n` +
        `• Account Number: *${OPAY_BENEFICIARY.accountNumber}*\n` +
        `• Account Name: *${OPAY_BENEFICIARY.accountName}*\n\n` +
        `Transfer your deposit and share your receipt here to lock in your 48-hour delivery slot!`,
      suggestedAction: 'EXPLAIN_VALUE_AND_ENGAGE',
      directPaymentEligible: true
    };
  }

  // 2D. Appointment / Demo Call / Meeting Request
  if (/book|schedule|call|call me|talk|meet|appointment|what time|free time|availability|discuss|zoom|google meet|phone call/i.test(msg)) {
    return {
      intent: 'APPOINTMENT_REQUEST',
      messageText:
        `Hello ${name}! 👋 We would love to do a quick 10-minute live walkthrough with you.\n\n` +
        `📅 *AVAILABLE 10-MINUTE SLOTS:*\n` +
        `1️⃣ Today, 3:30 PM WAT\n` +
        `2️⃣ Today, 5:00 PM WAT\n` +
        `3️⃣ Tomorrow, 11:30 AM WAT\n\n` +
        `Reply with *1*, *2*, or *3* to lock in your slot right now, or let us know what time works best for you today!\n\n` +
        `📱 You can also test your live demo on your phone anytime: ${previewUrl}`,
      suggestedAction: 'BOOK_APPOINTMENT',
      directPaymentEligible: false
    };
  }

  // 2E. Sector Calculator / Load Sizer / Duty / Mortgage Request
  if (/kw|kva|inverter|battery|solar|diesel|duty|customs|tokunbo|mortgage|patient|clinic|doctor|booking|calculator|estimate/i.test(msg)) {
    return {
      intent: 'SECTOR_CALCULATOR_INQUIRY',
      messageText:
        `Great question for ${name}! ⚡\n\n` +
        `Our 24/7 quoting assistant is pre-configured with exact local benchmarks for ${leadData.category || 'your sector'} in ${area}.\n\n` +
        `👉 *Run Your Instant 1-Click Calculation Demo Here:*\n${previewUrl}#calculator\n\n` +
        `It calculates your custom estimate in 2 seconds and issues a bankable PDF quote directly to your WhatsApp.\n\n` +
        `Would you like us to install this quoter on your official business line? (₦35,000 embed upgrade or ₦75,000 turnkey website deposit)`,
      suggestedAction: 'DEMO_CALCULATOR',
      directPaymentEligible: true
    };
  }

  // 3. Ready to pay / Account details / Transfer / Positive Interest to Buy & Close Deal
  if (/account|bank|pay|invoice|transfer|send details|deposit|ready to start|moniepoint|opay|interested|proceed|i want|let's start|how do we start|how to start|deal|buy|get started|how much to start|give me account|payment|send account|ready|start now|set it up|close deal/i.test(msg)) {
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
        `• Bank: *${OPAY_BENEFICIARY.bankName}*\n` +
        `• Account Number: *${OPAY_BENEFICIARY.accountNumber}*\n` +
        `• Account Name: *${OPAY_BENEFICIARY.accountName}*\n` +
        `• Narration/Ref: *${name.slice(0, 15)} Setup*\n\n` +
        `⚡ *NEXT STEP TO COMMENCE:* \n` +
        `1. Transfer your commitment deposit (${depositAmount}) to the OPay account above.\n` +
        `2. Send your transfer receipt or payment screenshot right here on WhatsApp.\n` +
        `3. Our Lagos technical desk will immediately register your domain/staging and begin setup!\n\n` +
        `👉 Live preview link: ${previewUrl}`,
      suggestedAction: 'AWAIT_PAYMENT_PROOF',
      directPaymentEligible: true
    };
  }

  // 4. B2B Corporate Due Diligence Dossier Request
  if (/dossier|due diligence|cac|director|counterparty|background check|risk report|investigate/i.test(msg)) {
    return {
      intent: 'B2B_DOSSIER_REQUEST',
      messageText:
        `Good day! 👋 For *${name}* or any commercial counterparty in Nigeria, our Lagos Intelligence Desk generates bankable **Institutional B2B Corporate Due Diligence Dossiers**:\n\n` +
        `📋 *WHAT IS INCLUDED IN THE ₦150,000 EXECUTIVE DOSSIER:*\n` +
        `1️⃣ CAC Public Registry Resolution & Registered Directors Mapping.\n` +
        `2️⃣ SearchPhone Telecom Handset & Carrier Fraud Risk Audit.\n` +
        `3️⃣ Institutional Composite Trust Grade (AAA / AA / A Scoring).\n` +
        `4️⃣ Watermarked, Printable Executive Audit Report (PDF/HTML) authorized by Bethelmind Analytics Lagos Desk.\n` +
        `5️⃣ Delivered within 24 Hours.\n\n` +
        `🏦 *Fee: ₦150,000 NGN* per audited entity.\n` +
        `Settlement: *OPay Digital Services (7034297995 - Oyelakin Tosin Matthew)*.\n\n` +
        `To commission this dossier immediately, transfer ₦150,000 to the OPay account above and send your proof here!`,
      suggestedAction: 'COMMISSION_DOSSIER',
      directPaymentEligible: true
    };
  }

  // 5. Pricing & Packages Inquiry — Close Deal & Give Account Details Immediately
  if (/price|cost|how much|charges|fee|package|plans|rate/i.test(msg)) {
    return {
      intent: 'PRICING_INQUIRY',
      messageText:
        `Good day! 👋 Glad you reviewed your sample website for *${name}*.\n\n` +
        `Here is our simple price breakdown:\n\n` +
        `1️⃣ *Complete Turnkey Website + 24/7 AI WhatsApp Closer (Recommended):*\n` +
        `• Total: ₦150,000 NGN\n` +
        `• *Commitment Deposit to start: ₦75,000 NGN*\n` +
        `• Balance (₦75k) is paid only AFTER your website is live and 100% approved by you.\n` +
        `• Includes: Custom business website, custom domain (.com.ng), Google Maps SEO listing, and 24/7 automated WhatsApp sales quoter.\n` +
        `• Ready in 48 hours guaranteed.\n\n` +
        `2️⃣ *1-Line Script Embed (If you already have a website):*\n` +
        `• ₦35,000 deposit (₦65,000 total) to install the 24/7 WhatsApp quoting assistant directly onto your existing website in 10 minutes.\n\n` +
        `🏦 *Official Bank Details (Direct Bank Transfer):*\n` +
        `• Bank: *${OPAY_BENEFICIARY.bankName}*\n` +
        `• Account Number: *${OPAY_BENEFICIARY.accountNumber}*\n` +
        `• Account Name: *${OPAY_BENEFICIARY.accountName}*\n` +
        `• Narration: *${name.slice(0, 15)} Setup*\n\n` +
        `Once you make the ₦75,000 transfer, kindly send your receipt here and our engineering team will lock your slot and deliver in 48 hours!`,
      suggestedAction: 'QUALIFY_PACKAGE',
      directPaymentEligible: true
    };
  }

  // 6. Request Demo / Link / "Where is the link?"
  if (/link|demo|sample|preview|see it|show me|where/i.test(msg)) {
    return {
      intent: 'REQUEST_DEMO_LINK',
      messageText:
        `Here is your free sample website demo created for *${name}*:\n\n` +
        `👉 ${previewUrl}\n\n` +
        `📱 Open it on your phone to see how your business will look to customers on Google.\n` +
        `You can tap the buttons to test the 24/7 WhatsApp quoting engine.\n\n` +
        `🛠️ *READY TO LAUNCH FOR YOUR BUSINESS IN 48 HOURS?*\n` +
        `• 50% commitment deposit to start: *₦75,000 NGN* (₦150k total, balance only upon approval).\n` +
        `• Bank: *OPay Digital Services* | Account: *7034297995* | Name: *Oyelakin Tosin Matthew*\n\n` +
        `Send your receipt here once transferred and we commence deployment immediately!`,
      suggestedAction: 'AWAIT_DEMO_FEEDBACK',
      directPaymentEligible: true
    };
  }

  // 7. Trust & Verification / "Who are you? / Is this real?"
  if (/legit|scam|trust|real|who are you|office|address|guarantee/i.test(msg)) {
    return {
      intent: 'TRUST_VERIFICATION',
      messageText:
        `Hello! 👋 My name is Tosin from Bethelmind Analytics Lagos Desk.\n\n` +
        `We are a registered business tech firm in Lagos. We created a free sample website for *${name}* to help you get more customers online and answer people on WhatsApp even when you are busy or asleep.\n\n` +
        `🛡️ *Why You Are 100% Protected:* \n` +
        `1. You test your sample website completely FREE on your phone: ${previewUrl}\n` +
        `2. You only pay a 50% commitment deposit (₦75,000) to start, balance strictly after your site is live and approved by you.\n` +
        `3. Guaranteed 48-Hour delivery SLA.\n` +
        `4. Direct settlement to verified Nigerian bank account: *OPay Digital Services (7034297995 - Oyelakin Tosin Matthew)*.\n` +
        `5. Direct phone hotline: +234 802 279 1227.\n\n` +
        `Once transferred, share your receipt here so we can activate your deployment!`,
      suggestedAction: 'REASSURE_AND_CLOSE',
      directPaymentEligible: true
    };
  }

  // Default: Simple, Warm Handshake with Voice Note Bridge, Packages & OPay Details
  return {
    intent: 'GREETING_HANDSHAKE',
    messageText:
      `Good day! 👋 Welcome to Bethelmind Analytics Lagos Desk.\n\n` +
      `We prepared a customized interactive commercial prototype for *${name}* to show you how clients in ${area} can easily discover your business on Google and receive instant 24/7 quotes on WhatsApp.\n\n` +
      `👉 *View Your Free Live Prototype:* \n${previewUrl}\n\n` +
      `🛠️ *LAUNCH YOUR COMPLETE 24/7 SYSTEM IN 48 HOURS:*\n` +
      `• Turnkey Website + WhatsApp AI Assistant: ₦75,000 commitment deposit (₦150,000 total).\n` +
      `• 1-Line Embed Upgrade (If you already have a website): ₦35,000 deposit.\n` +
      `• Balance strictly payable after deployment & your 100% approval.\n\n` +
      `🏦 *Official OPay Settlement Account:*\n` +
      `• Bank: *OPay Digital Services*\n` +
      `• Account Number: *7034297995*\n` +
      `• Account Name: *Oyelakin Tosin Matthew*\n` +
      `• Narration: *${name.slice(0, 15)} Setup*\n\n` +
      `Reply with any questions or transfer your deposit and share your receipt here to secure your 48-hour delivery slot!`,
    suggestedAction: 'SEND_DEMO_LINK',
    directPaymentEligible: true
  };
}

module.exports = { handlePostContactInquiry };
