/**
 * @file src/config/plans.ts
 * Centralised subscription plan definitions for Bethelmind Digital Solutions.
 * CAC Certified Nigerian Enterprise (RC 7034297)
 *
 * HOW TO UPDATE PRICES:
 * Change monthlyNGN or setupFeeNGN here — the pricing UI and
 * payment section will reflect the change automatically.
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
  /** One-time setup / onboarding fee in Naira */
  setupFeeNGN: number;
  /** Normal standard agency price before direct SME subsidy */
  originalTotalNGN?: number;
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
  /** Badge text — null if none */
  badge: string | null;
  /** Short positioning tagline */
  tagline: string;
  /** List of included features */
  features: PlanFeature[];
}

export const PLANS_NEED_WEBSITE: Plan[] = [
  {
    id: 'starter',
    name: 'Official .COM.NG Website + 24/7 WhatsApp Closer',
    monthlyNGN: 0,
    setupFeeNGN: 35_000,
    originalTotalNGN: 130_000,
    totalAmountNGN: 65_000,
    depositAmountNGN: 35_000,
    balanceAmountNGN: 30_000,
    slaHours: 48,
    color: '#d4af37',
    badge: 'OFFICIAL SME INITIATIVE • MOST POPULAR',
    tagline: 'Standard Agency Price ₦130,000 → Direct SME Price: ₦65,000 (1 Full Year Domain & Hosting Included — Zero Monthly Rent).',
    features: [
      { text: 'Official www.yourbusiness.com.ng Domain & Cloud Hosting (1 Full Year Included)' },
      { text: 'Custom Branding with Your Real Shop/Office Photos, Logo & Price List' },
      { text: '24/7 WhatsApp Auto-Reply & Instant Price Quoter Connected to Your Phone' },
      { text: 'Tailored Sector Calculator (Solar BOQ, Real Estate, Auto Duty, Clinic, School)' },
      { text: 'Google Search & Google Maps Business Verification (Customers Find You Direct)' },
      { text: 'Zero Risk: Start Today With ₦35,000 Deposit • Pay ₦30,000 Balance ONLY After Live on Google' },
    ],
  },
  {
    id: 'pro',
    name: 'Corporate .COM Website + 3 Official Staff Emails',
    monthlyNGN: 0,
    setupFeeNGN: 60_000,
    originalTotalNGN: 240_000,
    totalAmountNGN: 120_000,
    depositAmountNGN: 60_000,
    balanceAmountNGN: 60_000,
    slaHours: 48,
    color: '#d4af37',
    badge: 'CORPORATE VIP • DIRECT SUITE',
    tagline: 'Standard Agency Price ₦240,000 → Direct SME Price: ₦120,000. For firms bidding for high-value contracts.',
    features: [
      { text: 'International .COM Domain + 3 Official Corporate Staff Emails (info@yourcompany.com)' },
      { text: '24/7 WhatsApp AI Sales Closer with Natural Nigerian Accent Voice Notes' },
      { text: 'Full Sector Calculator + Instant Bankable PDF Invoice Generator' },
      { text: 'Moniepoint & Paystack Virtual Account Payment Auto-Verification' },
      { text: 'Priority Google Maps #1 Local SEO Setup + 100% Source Code Handover' },
      { text: 'Zero Risk: Start Today With ₦60,000 Deposit • Pay ₦60,000 Balance ONLY on Handover' },
    ],
  },
  {
    id: 'app_bundle',
    name: 'Enterprise Web Portal + Branded Android App (.apk)',
    monthlyNGN: 0,
    setupFeeNGN: 85_000,
    originalTotalNGN: 350_000,
    totalAmountNGN: 175_000,
    depositAmountNGN: 85_000,
    balanceAmountNGN: 90_000,
    slaHours: 48,
    color: '#d4af37',
    badge: 'WEB + ANDROID APK • ENTERPRISE SUITE',
    tagline: 'Standard Agency Price ₦350,000 → Direct SME Price: ₦175,000. Complete Web Portal + Native Android App.',
    features: [
      { text: 'Complete Multi-Page Custom Web Portal + Customer Client Dashboard' },
      { text: 'Branded Native Android Mobile App (.apk) with Customer Push Notifications' },
      { text: 'Free Custom .com or .com.ng Domain + SSL + Cloud CDN Hosting (1 Full Year)' },
      { text: 'Multi-Agent WhatsApp Shared Team Inbox & All Sector Calculators' },
      { text: 'Zero Risk: Start Today With ₦85,000 Deposit • Pay ₦90,000 Balance ONLY After APK Approval' },
    ],
  },
];

export const PLANS_HAVE_WEBSITE: Plan[] = [
  {
    id: 'starter',
    name: '1-Line Sector Calculator & WhatsApp AI Embed',
    monthlyNGN: 0,
    setupFeeNGN: 35_000,
    originalTotalNGN: 70_000,
    totalAmountNGN: 35_000,
    depositAmountNGN: 35_000,
    balanceAmountNGN: 0,
    slaHours: 24,
    color: '#d4af37',
    badge: 'DIRECT SME RATE • 10-MINUTE SETUP',
    tagline: 'Standard Agency Price ₦70,000 → Direct SME Price: ₦35,000 One-Time. Keep your current website 100% untouched.',
    features: [
      { text: '1-Line Script Embed: Works on WordPress, Wix, Shopify, or Custom HTML' },
      { text: '24/7 WhatsApp & Web AI Sales Chatbot & Instant Quoter' },
      { text: 'Tailored Sector Lead Tool embedded on your existing website' },
      { text: '100% Zero-Touch Guarantee: Your current domain, hosting, and SEO remain untouched' },
      { text: 'One-Time ₦35,000 Direct SME Setup — Zero monthly charges' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro Multi-Tool Embed + Voice Note AI & CRM Suite',
    monthlyNGN: 0,
    setupFeeNGN: 65_000,
    originalTotalNGN: 130_000,
    totalAmountNGN: 65_000,
    depositAmountNGN: 35_000,
    balanceAmountNGN: 30_000,
    slaHours: 24,
    color: '#d4af37',
    badge: 'PRO MULTI-TOOL • FULL SUITE EMBED',
    tagline: 'Standard Agency Price ₦130,000 → Direct SME Price: ₦65,000 (Start with ₦35,000 Deposit).',
    features: [
      { text: '1-Line Script Embed for AI Concierge + All Specialized Sector Calculators' },
      { text: 'WhatsApp AI Closer with Nigerian Accent Voice Notes' },
      { text: 'Interactive Sector Calculators + PDF Quote Generator on your domain' },
      { text: 'Moniepoint & Paystack Virtual Account Payment Integration' },
      { text: 'Start with ₦35,000 Deposit, pay ₦30,000 balance only after live testing' },
    ],
  },
  {
    id: 'vip',
    name: 'Enterprise Custom API & Multi-Agent CRM Sync',
    monthlyNGN: 0,
    setupFeeNGN: 60_000,
    originalTotalNGN: 240_000,
    totalAmountNGN: 120_000,
    depositAmountNGN: 60_000,
    balanceAmountNGN: 60_000,
    slaHours: 48,
    color: '#d4af37',
    badge: 'FULL API & CRM SYNC • ENTERPRISE',
    tagline: 'Standard Agency Price ₦240,000 → Direct SME Price: ₦120,000. Deep API & CRM integration.',
    features: [
      { text: 'Full Custom API & Webhook Integration with your current database' },
      { text: 'Multi-Agent WhatsApp Shared Team Inbox' },
      { text: 'Instagram DM & Social Ad-to-WhatsApp Funnel Automation' },
      { text: '₦60,000 deposit to start, ₦60,000 balance only on complete sync' },
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
 * 1-Time Outright Purchase & Codebase Handover Tiers (Zero Monthly Fees)
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
      'Full JavaScript SDK & AI Widget Source Code',
      '24/7 WhatsApp AI Chatbot Engine (Self-Hosted Config)',
      '2,500 Verified Nigerian B2B Decision-Maker Leads',
      '30 Days Free Post-Launch Priority Setup & Handover Support',
      '₦0 Monthly Subscriptions Forever',
    ],
  },
  {
    id: 'outright_complete',
    name: 'Complete Website & AI Closer (Full Source Handover)',
    priceNGN: 325_000,
    badge: 'Best Value Outright Asset',
    tagline: 'Complete production Next.js/React codebase + AI Voice Closer + 100% IP Transfer Deed.',
    features: [
      '100% Complete Next.js & React Source Code Repository + ZIP',
      'Signed Legal Transfer of Intellectual Property (IP Deed Assignment)',
      '1st Year Free .com/.com.ng Domain + SSL + CDN Setup',
      'WhatsApp AI Closer with Nigerian Voice Notes (Self-Hosted Model)',
      'All 16 Sector Calculation Engines & Instant Invoicing Tools',
      '10,000 Verified Nigerian B2B Decision-Maker Leads Export',
      '60 Days Free Post-Launch Developer Handover & Support',
      '₦0 Monthly Retainers (Zero recurring obligations)',
    ],
  },
  {
    id: 'outright_enterprise',
    name: 'VIP Enterprise Portal & Multi-Agent CRM Handover',
    priceNGN: 650_000,
    badge: 'Enterprise IP Transfer',
    tagline: 'Full GitHub repository ownership of multi-page portal, CRM, and voice calling engines.',
    features: [
      'Full Multi-Page Portal Codebase + Admin Control Dashboard',
      'Comprehensive Intellectual Property Deed + Commercial Licensing Waiver',
      'Multi-Agent Shared Team WhatsApp Inbox Engine',
      'Outbound AI Voice Calling & CRM Lead Pipeline Sync',
      'Unlimited B2B Lead Mining Script & Database Dump',
      '90 Days Dedicated Senior Engineer Support & Custom Feature Tweaks',
      '₦0 Monthly Retainers • Lifetime Unrestricted Commercial Rights',
    ],
  },
];

/**
 * Ongoing Maintenance & Post-Launch Support Solutions
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
    badge: 'Most Popular for 1-Time Buyers',
    desc: 'For 1-time buyers who want zero monthly bills, but want their domain, hosting, and routine price updates handled hands-free all year long.',
    highlights: [
      'Annual .com/.ng Domain & SSL Security Certificate Renewal',
      '24/7 Cloud Hosting, DDoS Shield & Automatic Daily Backups',
      'Up to 2 Free Content/Price/Banner Edits Every Month',
      'Priority Emergency Developer Assistance on WhatsApp',
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
      '5 Reusable Developer Update Credits (No Expiry Date)',
      'Fast 2-4 hour turnaround per update request',
      'Simple WhatsApp task submission (just message what to change)',
      'Saves ₦15,000 compared to individual single task billing',
    ],
  },
];

/**
 * On-Demand Pay-As-You-Go Service Menu (Single Requests)
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
    icon: 'edit',
  },
  {
    id: 'ai_retrain',
    task: 'AI Voice Closer Knowledge Retuning (New Catalog/FAQs)',
    priceNGN: 25_000,
    turnaround: 'Same Day',
    icon: 'mic',
  },
  {
    id: 'leads_refill_5k',
    task: 'Fresh 5,000 Verified Nigerian B2B Leads Refill',
    priceNGN: 25_000,
    turnaround: 'Instant (1 Hour)',
    icon: 'target',
  },
  {
    id: 'feature_upgrade',
    task: 'New Custom Sector Calculator or Payment Tool Integration',
    priceNGN: 50_000,
    turnaround: '24 - 48 Hours',
    icon: 'calculator',
  },
];

/**
 * After-subscription onboarding steps shown in the pricing section.
 */
export const ONBOARDING_STEPS: string[] = [
  'We confirm your payment via WhatsApp.',
  'We schedule or begin onboarding within one business day.',
  'We collect your business information and workflow requirements.',
  'We configure your initial setup based on your chosen plan.',
  'We review, test, and launch the agreed workflow with you.',
];
