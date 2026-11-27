import DivisionFunnelPage, { type DivisionConfig } from '@/components/commerce/DivisionFunnelPage';

const CONFIG: DivisionConfig = {
  division: 'business_automation',
  badge: 'Division 2 • Business Automation',
  headline: 'Compliant WhatsApp & Enquiry Automation That Works Around the Clock',
  subheadline:
    'Turn incoming WhatsApp and web enquiries into structured bookings, product catalogues, Paystack payment links, and instant staff alerts — backed by official API compliance and opt-in/opt-out audit logs.',
  problemTitle: 'Where Manual Customer Handling Breaks Down',
  problems: [
    'Slow replies to WhatsApp enquiries cause prospects to move on to faster competitors.',
    'Staff repeatedly answer the same price, location, and availability questions by hand.',
    'Fragile unofficial WhatsApp sessions risk disconnects and lack customer opt-in/opt-out records.',
  ],
  solutionTitle: 'Structured, Compliant Automation Infrastructure',
  solutions: [
    'Built on the official WhatsApp Business Cloud API / authorised routing with opt-in, opt-out, and message audit records.',
    'Automated FAQs, product/service catalogues, booking workflows, order capture, and Paystack payment links.',
    'Human approval gates for sensitive financial or customer-facing actions, plus monthly maintenance & monitoring.',
  ],
  demoTitle: 'How Our Automation Workflow Operates',
  demoDescription:
    'Every automation package follows a clean, auditable flow from customer enquiry to staff notification and sales reporting.',
  demoPoints: [
    '1. Enquiry & Opt-In: Customer messages your WhatsApp Business number and is logged with consent status.',
    '2. Guided Flow: Automated FAQ, catalogue selection, or booking workflow captures structured order details.',
    '3. Payment & Staff Alert: Paystack link or verified transfer reference is issued and staff are notified immediately.',
  ],
  demoCtaLabel: 'Explore Live Automation Pricing',
  demoCtaHref: '/pricing',
  faqs: [
    {
      q: 'Why is monthly maintenance (₦20,000–₦50,000) required?',
      a: 'Monthly maintenance covers API monitoring, template updates, workflow adjustments, renewal notifications, and reliable uptime support.',
    },
    {
      q: 'Do you use compliant WhatsApp infrastructure?',
      a: 'Yes. Production workflows use official WhatsApp Business Platform APIs or authorised providers with explicit opt-in, opt-out, and audit logs.',
    },
    {
      q: 'Can staff take over a conversation at any time?',
      a: 'Yes. Sensitive, financial, and unrecognised queries route directly to your staff with human-approval controls.',
    },
    {
      q: 'What is the onboarding process?',
      a: 'Enquiry → Business assessment → Package selection → 60% deposit → Workflow setup & testing → Client approval → Activation.',
    },
  ],
};

export default function BusinessAutomationPage() {
  return <DivisionFunnelPage config={CONFIG} />;
}
