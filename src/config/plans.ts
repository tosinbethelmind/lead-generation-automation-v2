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

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Embed Package',
    monthlyNGN: 15_000,
    setupFeeNGN: 75_000,
    color: '#0ea5e9',
    badge: null,
    tagline: 'For businesses with an existing website (WordPress, Wix, Shopify) or WhatsApp-only sales.',
    features: [
      { text: '1-Line Script Embed on existing website (60-second setup)' },
      { text: '24/7 WhatsApp AI Sales Chatbot & Auto-Responder' },
      { text: '500 Verified Local SME & Decision-Maker Leads' },
      { text: 'Direct Bank Transfer & Payment Link Integration' },
      { text: 'Simple CRM Lead Pipeline & Deal Tracker' },
      { text: 'Full 24-hour setup & onboarding handover' },
    ],
  },
  {
    id: 'pro',
    name: 'Complete Website & AI Closer Pro',
    monthlyNGN: 35_000,
    setupFeeNGN: 185_000,
    color: '#8b5cf6',
    badge: 'Most Popular • Full Website Included',
    tagline: 'Complete Done-For-You Luxury Website + Custom .com/.ng Domain + 24/7 AI Sales Closer.',
    features: [
      { text: '🌐 COMPLETE Luxury Business Website Development (Full Custom Build)' },
      { text: '🏷️ Free Custom .com or .com.ng Domain + SSL + Cloud CDN Hosting' },
      { text: '🎙️ WhatsApp AI Closer with Nigerian Voice Notes' },
      { text: '🧮 Tailored Sector Calculator (Solar BOQ, Auto Duty, Real Estate, Legal)' },
      { text: '💳 Moniepoint & Paystack Virtual Account Payment Auto-Verification' },
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
    tagline: 'For established enterprises needing high-scale web portals, multi-agent CRMs & voice calling.',
    features: [
      { text: 'Everything in Business Pro + Multi-Page Custom Web Portal' },
      { text: 'Dedicated Enterprise Server Hosting & Daily Backups' },
      { text: 'Multi-Agent WhatsApp Shared Team Inbox (Anti-Lead Theft)' },
      { text: 'Instagram DM & Social Ad-to-WhatsApp Funnel Automation' },
      { text: 'Smart Anti-Ban WhatsApp Broadcast Engine' },
      { text: 'Dedicated Technical Account Manager & Priority 24/7 SLA' },
      { text: '50% Deposit Option Available (₦175,000 deposit to start)' },
    ],
  },
];

/** Returns a plan by ID, falling back to Business Pro if not found. */
export function getPlanById(id: string): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[1];
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
