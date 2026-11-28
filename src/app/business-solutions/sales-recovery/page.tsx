import FlagshipProductPage, { type FlagshipProductSpec } from '@/components/commerce/FlagshipProductPage';

const SPEC: FlagshipProductSpec = {
  productId: 'bs-sales-recovery',
  badge: 'Flagship Product C • Customer Acquisition & Sales Recovery',
  headline: 'Capture Every Web & WhatsApp Enquiry, Assign Staff & Recover Lost Leads.',
  subheadline:
    'Connect website forms, authorised WhatsApp Business enquiries, lead qualification, sales-agent assignment, follow-up reminders, quotations, bookings, and lost-lead reporting.',
  targetCustomer: [
    'Service businesses, clinics, real estate agencies, solar firms, and schools',
    'Sales teams handling inbound Google Ads, Meta Ads, and WhatsApp enquiries',
    'Owners who want visibility into why enquiries were won or lost',
  ],
  problemsSolved: [
    'Paid ad enquiries sitting unanswered in personal WhatsApp chats',
    'No clear assignment of which sales agent owns each incoming lead',
    'Zero follow-up reminders or reporting on lost-lead reasons',
  ],
  benefits: [
    'Structured opt-in/opt-out compliance logs on WhatsApp enquiries',
    'Clear pipeline stages from New → Qualified → Quote Sent → Won / Lost',
    'Google Ads & Meta attribution preserved from click to verified payment',
  ],
  implementationScope: [
    'Lead capture forms, authorised WhatsApp routing, qualification stages, agent assignment, follow-up reminders, and lost-lead analytics',
  ],
  exclusions: [
    'Uses authorised WhatsApp Business Platform integrations with explicit opt-in/opt-out records',
    'Unsolicited bulk messaging or cold spamming is strictly excluded',
  ],
  onboardingSteps: [
    'Lead channel & sales team workflow audit',
    '60% setup deposit & WhatsApp/form integration setup',
    'Qualification stage & agent assignment configuration',
    'Team training on follow-up discipline & lost-lead logging',
  ],
  trainingAndSupport: [
    'Sales team onboarding & follow-up playbook walkthrough',
    'Monthly monitoring of webhook health, attribution accuracy, and CRM updates',
  ],
  optionalAddOns: [
    { name: 'Dedicated Conversion Landing Page', note: 'Custom ad-focused landing page for Google/Meta campaigns' },
    { name: 'Meta CAPI & Google Ads Tagging', note: 'Server-side Lead & Purchase event relay' },
  ],
  demoTitle: 'Product C Live Pipeline Preview (Lead Capture & Recovery)',
  demoRows: [
    { label: 'Sample Inbound Enquiry', metric: 'Web Form + Opt-In WhatsApp', status: 'Assigned: Agent Tunde' },
    { label: 'Sample Follow-Up Reminder', metric: 'Quote Sent 48h Ago', status: 'Due Today' },
    { label: 'Sample Lost-Lead Report', metric: 'Price / Timing Breakdown', status: 'Trackable in CRM' },
  ],
};

export default function SalesRecoveryPage() {
  return <FlagshipProductPage spec={SPEC} />;
}
