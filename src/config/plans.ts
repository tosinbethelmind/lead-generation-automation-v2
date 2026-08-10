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
    tagline: 'For businesses that want a simple enquiry and follow-up foundation.',
    features: [
      { text: 'Basic WhatsApp enquiry workflow setup' },
      { text: 'Simple CRM and lead pipeline configuration' },
      { text: 'Basic catalogue or FAQ setup' },
      { text: 'Guided onboarding and initial review' },
      { text: 'Basic sector workflow configuration where applicable' },
      { text: 'WhatsApp support during onboarding' },
    ],
  },
  {
    id: 'pro',
    name: 'Business Pro Package',
    monthlyNGN: 35_000,
    setupFeeNGN: 50_000,
    color: '#8b5cf6',
    badge: 'Most Popular',
    tagline: 'For businesses that need deeper workflow setup and sector-specific sales tools.',
    features: [
      { text: 'Everything in Starter' },
      { text: 'Sector-specific calculator or quote workflow' },
      { text: 'Expanded CRM and follow-up process configuration' },
      { text: 'Website and WhatsApp enquiry workflow integration' },
      { text: 'Campaign content workflow support' },
      { text: 'Guided implementation and review session' },
      { text: 'Priority WhatsApp support during setup' },
    ],
  },
  {
    id: 'vip',
    name: 'VIP Enterprise Suite',
    monthlyNGN: 75_000,
    setupFeeNGN: 100_000,
    color: '#f59e0b',
    badge: null,
    tagline: 'For businesses that need tailored automation workflows and priority support.',
    features: [
      { text: 'Everything in Business Pro' },
      { text: 'Custom workflow configuration for your process' },
      { text: 'Advanced reporting and dashboard setup where available' },
      { text: 'Priority support and dedicated review sessions' },
      { text: 'Integration scoping and implementation support' },
      { text: 'Ongoing monthly workflow review and optimisation' },
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
