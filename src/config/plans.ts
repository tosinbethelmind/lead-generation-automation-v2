/**
 * @file src/config/plans.ts
 * Centralised subscription plan definitions for Bethelmind Analytics.
 *
 * HOW TO UPDATE PRICES:
 * Change monthlyNGN or setupFeeNGN here — the pricing UI and
 * payment section will reflect the change automatically.
 *
 * HOW TO UPDATE FEATURES:
 * Edit the features array under each plan. Keep copy honest and
 * within scope of what is actually delivered. Do not add features
 * that are not configured or available.
 */

export interface PlanFeature {
  text: string;
}

export interface Plan {
  /** Internal key used in payment references (STARTER | PRO | VIP | APP_BUNDLE) */
  id: 'starter' | 'pro' | 'vip' | 'app_bundle';
  /** Display name */
  name: string;
  /** Monthly subscription price in Naira */
  monthlyNGN: number;
  /**
   * One-time setup / onboarding fee in Naira.
   */
  setupFeeNGN: number;
  /** Total project investment */
  totalAmountNGN: number;
  /** Milestone commitment deposit to begin */
  depositAmountNGN: number;
  /** Balance due only upon live production approval */
  balanceAmountNGN: number;
  /** Guaranteed deployment delivery SLA in hours */
  slaHours: number;
  /** Hex accent colour for this plan */
  color: string;
  /** Badge text (e.g. "Most Popular") — null if none */
  badge: string | null;
  /** Short positioning tagline */
  tagline: string;
  /** List of included features */
  features: PlanFeature[];
}

export const PLANS_NEED_WEBSITE: Plan[] = [
  {
    id: 'pro',
    name: 'Complete Luxury Website & 24/7 AI Sales Closer',
    monthlyNGN: 0,
    setupFeeNGN: 75_000,
    totalAmountNGN: 150_000,
    depositAmountNGN: 75_000,
    balanceAmountNGN: 75_000,
    slaHours: 48,
    color: '#8b5cf6',
    badge: '🔥 Most Popular • 50% Milestone Deposit • 48h Live SLA',
    tagline: '100% Done-For-You Luxury Website + Custom .com.ng Domain + 24/7 AI WhatsApp Quoting Assistant.',
    features: [
      { text: '🌐 100% Done-For-You Luxury Custom Website (Desktop + Mobile Ultra-Fast)' },
      { text: '🏷️ Free Custom .com or .com.ng Domain + SSL + Cloud CDN Hosting Included' },
      { text: '🎙️ 24/7 WhatsApp AI Sales Closer with Natural Nigerian Accent Voice Notes' },
      { text: '🧮 Tailored Sector Tool (Solar BOQ, Real Estate Calculator, HMO Clinic Booker, Auto Duty)' },
      { text: '💳 Moniepoint & Paystack Virtual Account Payment Auto-Verification' },
      { text: '📍 Google Maps & Local SEO Business Profile Setup' },
      { text: '🛡️ 100% Risk Reversal: ₦75,000 deposit to start. Balance of ₦75,000 paid ONLY after live approval' },
    ],
  },
  {
    id: 'app_bundle',
    name: 'Luxury Web Portal + Branded Android Mobile App (.apk)',
    monthlyNGN: 0,
    setupFeeNGN: 125_000,
    totalAmountNGN: 250_000,
    depositAmountNGN: 125_000,
    balanceAmountNGN: 125_000,
    slaHours: 48,
    color: '#10b981',
    badge: '👑 Web + Native Android APK • Customer Push Notifications',
    tagline: 'Complete Done-For-You Luxury Website + Branded Native Android App (.apk) with Lock-Screen Push Notifications.',
    features: [
      { text: '🌐 100% Done-For-You Luxury Custom Website (Desktop + Mobile Ultra-Fast)' },
      { text: '📱 Branded Native Android Mobile App (.apk) ready for Google Play & direct install' },
      { text: '🔔 Customer Lock-Screen Push Notifications via Firebase / OneSignal' },
      { text: '🏷️ Free Custom .com or .com.ng Domain + SSL + Cloud CDN Hosting Included' },
      { text: '🎙️ 24/7 WhatsApp AI Sales Closer with Natural Nigerian Accent Voice Notes' },
      { text: '🧮 Tailored Sector Tool (Solar BOQ, Real Estate Calculator, HMO Booker, Auto Duty)' },
      { text: '💳 Moniepoint & Paystack Virtual Account Payment Auto-Verification' },
      { text: '🛡️ 100% Risk Reversal: ₦125,000 deposit to start. Balance of ₦125,000 paid ONLY after live APK approval' },
    ],
  },
  {
    id: 'vip',
    name: 'Enterprise Custom Portal & Multi-Agent CRM',
    monthlyNGN: 0,
    setupFeeNGN: 175_000,
    totalAmountNGN: 350_000,
    depositAmountNGN: 175_000,
    balanceAmountNGN: 175_000,
    slaHours: 72,
    color: '#f59e0b',
    badge: '🏢 Enterprise Multi-Branch Build',
    tagline: 'For established firms needing custom multi-page web applications & multi-agent CRMs.',
    features: [
      { text: '🌐 Multi-Page Custom Web Portal + Customer Client Dashboard' },
      { text: '🏷️ High-Performance Enterprise Server Hosting & Daily Backups' },
      { text: '🎙️ Outbound Nigerian Voice Calling & 24/7 WhatsApp AI Closer' },
      { text: '👥 Multi-Agent WhatsApp Shared Team Inbox (Anti-Lead Theft)' },
      { text: '📸 Instagram DM & Social Ad-to-WhatsApp Funnel Automation' },
      { text: '🛡️ 100% Risk Reversal: ₦175,000 deposit to begin, balance of ₦175,000 on live handover' },
    ],
  },
];

export const PLANS_HAVE_WEBSITE: Plan[] = [
  {
    id: 'starter',
    name: 'Starter 1-Line Script Embed',
    monthlyNGN: 0,
    setupFeeNGN: 35_000,
    totalAmountNGN: 65_000,
    depositAmountNGN: 35_000,
    balanceAmountNGN: 30_000,
    slaHours: 24,
    color: '#0ea5e9',
    badge: '⚡ 10-Minute Setup • 0% Downtime',
    tagline: 'Keep your existing website 100% untouched. Attach our 24/7 AI WhatsApp Quoter & Sector Tool.',
    features: [
      { text: '🔌 1-Line Script Embed: Works on WordPress, Wix, Shopify, or Custom HTML' },
      { text: '🤖 24/7 WhatsApp & Web AI Sales Chatbot & Instant Quoter' },
      { text: '🧮 Tailored Sector Lead Tool embedded on your existing website' },
      { text: '🔒 100% Zero-Touch Guarantee: Your current domain, hosting, and SEO remain untouched' },
      { text: '🛡️ Pay ₦35,000 deposit to start, balance of ₦30,000 only after you test live' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro Embed & Custom Sector CRM Suite',
    monthlyNGN: 0,
    setupFeeNGN: 65_000,
    totalAmountNGN: 65_000,
    depositAmountNGN: 65_000,
    balanceAmountNGN: 0,
    slaHours: 24,
    color: '#8b5cf6',
    badge: '🔥 Complete Single-Payment Handover',
    tagline: 'Embed full AI Voice Closer & Specialized Sector Calculators into your current website.',
    features: [
      { text: '🔌 1-Line Script Embed for AI Concierge + All Specialized Sector Calculators' },
      { text: '🎙️ WhatsApp AI Closer with Nigerian Accent Voice Notes' },
      { text: '🧮 Interactive Sector Calculators embedded on your current domain' },
      { text: '💳 Moniepoint & Paystack Virtual Account Payment Integration' },
      { text: '📊 Real-Time CRM Lead Pipeline & Deal Tracker' },
      { text: '⚡ One-Time ₦65,000 Complete Integration Fee — Zero monthly charges' },
    ],
  },
  {
    id: 'vip',
    name: 'Enterprise Custom Integration',
    monthlyNGN: 0,
    setupFeeNGN: 150_000,
    totalAmountNGN: 150_000,
    depositAmountNGN: 75_000,
    balanceAmountNGN: 75_000,
    slaHours: 48,
    color: '#f59e0b',
    badge: 'Full API & CRM Sync',
    tagline: 'Deep API & CRM integration with your existing custom web infrastructure.',
    features: [
      { text: '🔌 Full Custom API & Webhook Integration with your current database' },
      { text: '👥 Multi-Agent WhatsApp Shared Team Inbox' },
      { text: '📸 Instagram DM & Social Ad-to-WhatsApp Funnel Automation' },
      { text: '🛡️ ₦75,000 deposit to start, balance only on complete sync' },
    ],
  },
];

export const PLANS: Plan[] = [
  ...PLANS_NEED_WEBSITE,
  PLANS_HAVE_WEBSITE[0],
];

/** Returns a plan by ID, falling back to Business Pro if not found. */
export function getPlanById(id: string, mode: 'need_website' | 'have_website' = 'need_website'): Plan {
  const planList = mode === 'need_website' ? PLANS_NEED_WEBSITE : PLANS_HAVE_WEBSITE;
  return planList.find((p) => p.id === id) ?? planList[0] ?? PLANS[0];
}

/**
 * 📦 1-Time Outright Purchase & Codebase Handover Tiers (Zero Monthly Fees)
 */
export interface OutrightPackage {
  id: string;
  name: string;
  priceNGN: number;
  badge: string;
  tagline: string;
  features: string[];
}

export const OUTRIGHT_PACKAGES: OutrightPackage[] = [
  {
    id: 'outright_embed',
    name: 'Starter 1-Time Embed Bundle',
    priceNGN: 135_000,
    badge: 'Zero Monthly Fees',
    tagline: '1-Line AI & Calculator script for existing websites with full self-hosting instructions.',
    features: [
      '🔌 Full JavaScript SDK & AI Widget Source Code',
      '🤖 24/7 WhatsApp AI Chatbot Engine (Self-Hosted Config)',
      '🎯 2,500 Verified Nigerian B2B Decision-Maker Leads',
      '🛡️ 30 Days Free Post-Launch Priority Setup & Handover Support',
      '✨ ₦0 Monthly Subscriptions Forever',
    ],
  },
  {
    id: 'outright_complete',
    name: 'Complete Website & AI Closer (Full Source Handover)',
    priceNGN: 325_000,
    badge: '👑 Best Value Outright Asset',
    tagline: 'Complete production Next.js/React codebase + AI Voice Closer + 100% IP Transfer Deed.',
    features: [
      '🌐 100% Complete Next.js & React Source Code Repository + ZIP',
      '📜 Signed Legal Transfer of Intellectual Property (IP Deed Assignment)',
      '🏷️ 1st Year Free .com/.com.ng Domain + SSL + CDN Setup',
      '🎙️ WhatsApp AI Closer with Nigerian Voice Notes (Self-Hosted Model)',
      '🧮 All 16 Sector Calculation Engines & Instant Invoicing Tools',
      '🎯 10,000 Verified Nigerian B2B Decision-Maker Leads Export',
      '🛡️ 60 Days Free Post-Launch Developer Handover & Support',
      '⚡ ₦0 Monthly Retainers (Zero recurring obligations)',
    ],
  },
  {
    id: 'outright_enterprise',
    name: 'VIP Enterprise Portal & Multi-Agent CRM Handover',
    priceNGN: 650_000,
    badge: 'Enterprise IP Transfer',
    tagline: 'Full GitHub repository ownership of multi-page portal, CRM, and voice calling engines.',
    features: [
      '🌐 Full Multi-Page Portal Codebase + Admin Control Dashboard',
      '📜 Comprehensive Intellectual Property Deed + Commercial Licensing Waiver',
      '👥 Multi-Agent Shared Team WhatsApp Inbox Engine',
      '🎙️ Outbound AI Voice Calling & CRM Lead Pipeline Sync',
      '🎯 Unlimited B2B Lead Mining Script & Database Dump',
      '🛡️ 90 Days Dedicated Senior Engineer Support & Custom Feature Tweaks',
      '⚡ ₦0 Monthly Retainers • Lifetime Unrestricted Commercial Rights',
    ],
  },
];

/**
 * 🛡️ Ongoing Maintenance & Post-Launch Support Solutions
 */
export interface MaintenanceOption {
  id: string;
  name: string;
  priceNGN: number;
  period: string;
  badge: string;
  desc: string;
  highlights: string[];
}

export const MAINTENANCE_OPTIONS: MaintenanceOption[] = [
  {
    id: 'annual_peace_of_mind',
    name: 'Annual Peace of Mind Pass',
    priceNGN: 85_000,
    period: 'per year (paid annually)',
    badge: '⭐ Most Popular for 1-Time Buyers',
    desc: 'For 1-time buyers who want zero monthly bills, but want their domain, hosting, and routine price updates handled hands-free all year long.',
    highlights: [
      '🏷️ Annual .com/.ng Domain & SSL Security Certificate Renewal',
      '☁️ 24/7 Cloud Hosting, DDoS Shield & Automatic Daily Backups',
      '✏️ Up to 2 Free Content/Price/Banner Edits Every Month',
      '⚡ Priority Emergency Developer Assistance on WhatsApp',
    ],
  },
  {
    id: 'support_voucher_5',
    name: 'Prepaid 5-Task Support Voucher Card',
    priceNGN: 35_000,
    period: 'one-time (5 task credits)',
    badge: 'Pay-As-You-Need',
    desc: 'Prepaid credit card for 5 on-demand website modifications, price changes, or new product uploads. Use whenever you need.',
    highlights: [
      '🎫 5 Reusable Developer Update Credits (No Expiry Date)',
      '⚡ Fast 2-4 hour turnaround per update request',
      '📱 Simple WhatsApp task submission (just message what to change)',
      '💰 Saves ₦15,000 compared to individual single task billing',
    ],
  },
];

/**
 * 📋 On-Demand Pay-As-You-Go Service Menu (Single Requests)
 */
export interface OnDemandTaskItem {
  id: string;
  task: string;
  priceNGN: number;
  turnaround: string;
  icon: string;
}

export const ON_DEMAND_TASK_MENU: OnDemandTaskItem[] = [
  {
    id: 'minor_edit',
    task: 'Quick Content, Price or Phone Number Update',
    priceNGN: 10_000,
    turnaround: '2 - 4 Hours',
    icon: '✏️',
  },
  {
    id: 'ai_retrain',
    task: 'AI Voice Closer Knowledge Retuning (New Catalog/FAQs)',
    priceNGN: 25_000,
    turnaround: 'Same Day',
    icon: '🎙️',
  },
  {
    id: 'leads_refill_5k',
    task: 'Fresh 5,000 Verified Nigerian B2B Leads Refill',
    priceNGN: 25_000,
    turnaround: 'Instant (1 Hour)',
    icon: '🎯',
  },
  {
    id: 'feature_upgrade',
    task: 'New Custom Sector Calculator or Payment Tool Integration',
    priceNGN: 50_000,
    turnaround: '24 - 48 Hours',
    icon: '🧮',
  },
];

/**
 * After-subscription onboarding steps shown in the pricing section.
 * Edit here to keep the UI and this copy in sync.
 */
export const ONBOARDING_STEPS: string[] = [
  'We confirm your payment via WhatsApp.',
  'We schedule or begin onboarding within one business day.',
  'We collect your business information and workflow requirements.',
  'We configure your initial setup based on your chosen plan.',
  'We review, test, and launch the agreed workflow with you.',
];
