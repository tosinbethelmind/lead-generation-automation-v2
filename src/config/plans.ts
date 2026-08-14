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
  /** Internal key used in payment references (STARTER | PRO | VIP) */
  id: 'starter' | 'pro' | 'vip';
  /** Display name */
  name: string;
  /** Monthly subscription price in Naira */
  monthlyNGN: number;
  /**
   * One-time setup / onboarding fee in Naira.
   * Covers initial workflow configuration, WhatsApp setup,
   * sector tools, CRM setup, and first review.
   * Paid once at the start — separate from the monthly plan.
   */
  setupFeeNGN: number;
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
    name: 'Complete Website & AI Closer Pro',
    monthlyNGN: 35_000,
    setupFeeNGN: 185_000,
    color: '#8b5cf6',
    badge: 'Most Popular • Full Website & Domain Included',
    tagline: 'Complete Done-For-You Luxury Website + Custom .com/.ng Domain + 24/7 AI Sales Closer.',
    features: [
      { text: '🌐 COMPLETE Luxury Business Website Development (Full Custom Build)' },
      { text: '🏷️ Free Custom .com or .com.ng Domain + SSL + Cloud CDN Hosting' },
      { text: '🎙️ WhatsApp AI Sales Closer with Nigerian Accent Voice Notes' },
      { text: '🧮 Tailored Sector Calculator (Solar BOQ, Auto Duty, Real Estate, Legal)' },
      { text: '💳 Moniepoint & Paystack Virtual Account Auto-Verification' },
      { text: '🎯 10,000 Verified Nigerian B2B Decision-Maker Leads/mo' },
      { text: '⚡ 50% Deposit Option Available (Pay ₦92,500 to begin, balance on handover)' },
    ],
  },
  {
    id: 'vip',
    name: 'VIP Enterprise Portal & Outbound AI',
    monthlyNGN: 75_000,
    setupFeeNGN: 350_000,
    color: '#f59e0b',
    badge: 'Enterprise Portal',
    tagline: 'For established firms needing custom multi-page web applications & multi-agent CRMs.',
    features: [
      { text: '🌐 Multi-Page Custom Web Portal + Customer Dashboard' },
      { text: '🏷️ High-Performance Enterprise Server Hosting & Daily Backups' },
      { text: '🎙️ Outbound Nigerian Voice Calling & 24/7 WhatsApp AI Closer' },
      { text: '👥 Multi-Agent WhatsApp Shared Team Inbox (Anti-Lead Theft)' },
      { text: '📸 Instagram DM & Social Ad-to-WhatsApp Funnel Automation' },
      { text: '🎯 Unlimited B2B Decision-Maker Lead Mining across Nigeria' },
      { text: '⚡ 50% Deposit Option Available (₦175,000 deposit to start)' },
    ],
  },
];

export const PLANS_HAVE_WEBSITE: Plan[] = [
  {
    id: 'starter',
    name: 'Starter AI Embed Package',
    monthlyNGN: 15_000,
    setupFeeNGN: 75_000,
    color: '#0ea5e9',
    badge: 'Quick 60s Setup',
    tagline: 'For businesses with WordPress, Wix, or Shopify who just want a 24/7 AI Chatbot.',
    features: [
      { text: '🔌 1-Line Script Embed on your existing website (60-second setup)' },
      { text: '🤖 24/7 WhatsApp & Web AI Sales Chatbot & Auto-Responder' },
      { text: '🎯 500 Verified Local SME & Decision-Maker Leads' },
      { text: '💳 Direct Bank Transfer & Payment Link Integration' },
      { text: '📊 Simple CRM Lead Pipeline & Deal Tracker' },
      { text: '⚡ Turnkey 24-hour setup & onboarding handover' },
    ],
  },
  {
    id: 'pro',
    name: 'Business Pro AI & Calculators Embed',
    monthlyNGN: 25_000,
    setupFeeNGN: 125_000,
    color: '#8b5cf6',
    badge: 'Most Popular for Existing Sites',
    tagline: 'Embed our full AI Voice Closer & 8 Sector Calculators into your current website.',
    features: [
      { text: '🔌 1-Line Script Embed for AI Concierge + All 8 Sector Calculators' },
      { text: '🎙️ WhatsApp AI Closer with Nigerian Voice Notes' },
      { text: '🧮 Interactive Sector Calculators embedded on your current domain' },
      { text: '💳 Moniepoint & Paystack Virtual Account Payment Auto-Verification' },
      { text: '🎯 5,000 Verified Nigerian B2B Decision-Maker Leads/mo' },
      { text: '⚡ 50% Deposit Option Available (Pay ₦62,500 to begin, balance on launch)' },
    ],
  },
  {
    id: 'vip',
    name: 'Enterprise Custom Integration',
    monthlyNGN: 50_000,
    setupFeeNGN: 250_000,
    color: '#f59e0b',
    badge: 'Full API & CRM Sync',
    tagline: 'Deep API & CRM integration with your existing custom web infrastructure.',
    features: [
      { text: '🔌 Full Custom API & Webhook Integration with your current database' },
      { text: '👥 Multi-Agent WhatsApp Shared Team Inbox' },
      { text: '📸 Instagram DM & Social Ad-to-WhatsApp Funnel Automation' },
      { text: '🎯 10,000 Verified Nigerian B2B Decision-Maker Leads/mo' },
      { text: '⚡ 50% Deposit Option Available (₦125,000 deposit to start)' },
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
