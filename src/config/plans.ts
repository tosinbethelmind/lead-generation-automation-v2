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
    name: 'Starter Package',
    monthlyNGN: 15_000,
    setupFeeNGN: 25_000,
    color: '#0ea5e9',
    badge: null,
    tagline: 'For boutique businesses & SMEs needing simple WhatsApp lead capture and payment links.',
    features: [
      { text: 'Basic WhatsApp enquiry workflow & auto-responder setup' },
      { text: 'Simple CRM lead pipeline & status tracking' },
      { text: 'Direct Bank Transfer payment link integration' },
      { text: 'Basic WhatsApp catalogue & FAQ workflow setup' },
      { text: 'Guided onboarding & initial review session' },
      { text: 'Dedicated WhatsApp support during setup' },
    ],
  },
  {
    id: 'pro',
    name: 'Business Pro Package',
    monthlyNGN: 35_000,
    setupFeeNGN: 50_000,
    color: '#8b5cf6',
    badge: 'Most Popular',
    tagline: 'For growing firms needing sector calculators, virtual NUBAN auto-reconciliation & voice note AI.',
    features: [
      { text: 'Everything in Starter' },
      { text: 'Tailored sector calculator (Solar BOQ, Auto Duty, Installments, CAC Fees)' },
      { text: 'Dedicated Virtual Bank Account (NUBAN) payment auto-verification' },
      { text: 'WhatsApp Voice Note (VN) speech-to-text AI handler' },
      { text: 'FIRS VAT & WHT-compliant pro-forma invoice generator' },
      { text: 'Website & WhatsApp unified lead capture workflow' },
      { text: 'Priority WhatsApp setup & implementation review' },
    ],
  },
  {
    id: 'vip',
    name: 'VIP Enterprise Suite',
    monthlyNGN: 75_000,
    setupFeeNGN: 100_000,
    color: '#f59e0b',
    badge: null,
    tagline: 'For established enterprises needing multi-agent team CRMs, IG DMs & lead protection.',
    features: [
      { text: 'Everything in Business Pro' },
      { text: 'Multi-agent WhatsApp shared team inbox (Protects lead theft)' },
      { text: 'Instagram DM & Comment-to-WhatsApp funnel automation' },
      { text: 'B2B lead extraction & local directory finder access' },
      { text: 'Smart anti-ban WhatsApp broadcast engine configuration' },
      { text: 'Custom workflow setup & dedicated account manager' },
      { text: 'Ongoing monthly workflow review & performance optimization' },
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
