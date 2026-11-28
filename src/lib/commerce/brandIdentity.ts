export type CommercialDivision =
  | 'digital_business_solutions'
  | 'business_automation'
  | 'business_intelligence'
  | 'digital_asset';

export type ServiceCategoryKey =
  | 'website'
  | 'whatsapp'
  | 'gbp'
  | 'lead_gen'
  | 'bi_analytics'
  | 'strategy';

export type PricingMode = 'fixed' | 'starting_from' | 'custom_quote';

export interface ProductAddOn {
  id: string;
  name: string;
  priceNgn: number;
  recurringMonthlyNgn?: number;
  description?: string;
}

export type FulfilmentType =
  | 'website_project'
  | 'automation_project'
  | 'research_project'
  | 'digital_product'
  | 'business_audit';

export interface CommercialProduct {
  id: string;
  slug: string;
  name: string;
  division: CommercialDivision;
  serviceKey?: ServiceCategoryKey;
  pricingMode?: PricingMode;
  priceNgn: number;
  priceMaxNgn?: number;
  promoPriceNgn?: number;
  promoLabel?: string;
  monthlyMaintenanceNgn: number;
  recurringCostNotes?: string;
  depositPercent: number;
  milestonesDescription?: string;
  description: string;
  deliverables: string[];
  exclusions?: string[];
  addOns?: ProductAddOn[];
  leadVolume?: number;
  targetIndustry?: string;
  geoCoverage?: string;
  dataSources?: string;
  limitations?: string;
  turnaroundTime: string;
  fulfilmentType: FulfilmentType;
  active: boolean;
  sortOrder: number;
}

export function inferServiceKey(
  product: Pick<CommercialProduct, 'id' | 'division' | 'serviceKey'>
): ServiceCategoryKey {
  if (product.serviceKey) return product.serviceKey;
  if (product.id.startsWith('gbp-')) return 'gbp';
  if (product.id.startsWith('lead-')) return 'lead_gen';
  if (product.id.startsWith('strat-')) return 'strategy';
  if (product.division === 'business_automation' || product.id.startsWith('ba-')) return 'whatsapp';
  if (product.division === 'business_intelligence' || product.id.startsWith('bi-')) return 'bi_analytics';
  return 'website';
}

export const BRAND_IDENTITY = {
  companyName: 'Bethelmind Analytics & Digital Solutions',
  shortName: 'Bethelmind',
  cacReg: 'CAC Reg: 9912717',
  whatsappNumber: '2348022791227',
  whatsappDisplay: '0802 279 1227',
  email: 'bethelmindrecruit@gmail.com',
  settlementBank: 'Moniepoint Microfinance Bank',
  settlementAccountNumber: '6805375225',
  settlementAccountName: 'Bethelmind Digital Solutions',
} as const;

export const DEFAULT_COMMERCIAL_CATALOG: CommercialProduct[] = [
  {
    id: 'dbs-business-launch',
    slug: 'business-launch',
    name: 'Business Launch Website',
    division: 'digital_business_solutions',
    priceNgn: 80000,
    priceMaxNgn: 120000,
    monthlyMaintenanceNgn: 0,
    depositPercent: 60,
    description:
      'Fast, mobile-first business landing page with direct WhatsApp enquiry capture and Google visibility setup for Nigerian SMEs.',
    deliverables: [
      'Mobile-responsive business website / landing page',
      'Direct WhatsApp enquiry & quote button integration',
      'Business contact & enquiry capture form',
      'Basic Google Business & search indexing setup',
      '60% initial deposit (₦48,000), 40% balance (₦32,000) before final handover',
    ],
    turnaroundTime: '3–5 business days',
    fulfilmentType: 'website_project',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'dbs-professional-website',
    slug: 'professional-website',
    name: 'Professional Business Website',
    division: 'digital_business_solutions',
    priceNgn: 150000,
    priceMaxNgn: 250000,
    monthlyMaintenanceNgn: 0,
    depositPercent: 60,
    description:
      'Multi-page corporate website with service showcase, booking/enquiry workflows, WhatsApp integration, and custom domain setup.',
    deliverables: [
      'Multi-page mobile-first corporate website',
      'Online booking & structured enquiry capture system',
      'Website & WhatsApp Business click-to-chat integration',
      'Custom domain & SSL configuration',
      '60% initial deposit (₦90,000), 40% balance (₦60,000) before final handover',
    ],
    turnaroundTime: '5–7 business days',
    fulfilmentType: 'website_project',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'dbs-advanced-website',
    slug: 'advanced-business-website',
    name: 'Advanced Business Website',
    division: 'digital_business_solutions',
    priceNgn: 300000,
    priceMaxNgn: 500000,
    monthlyMaintenanceNgn: 0,
    depositPercent: 60,
    description:
      'Custom business web platform with Paystack checkout, sector calculators, client portal, and ongoing maintenance options.',
    deliverables: [
      'Custom multi-section web application & client portal',
      'Paystack & verified bank transfer checkout integration',
      'Interactive sector quotation or booking calculator',
      'Staff handover training & documentation',
      '60% initial deposit (₦180,000), 40% balance (₦120,000) before final handover',
    ],
    turnaroundTime: '7–14 business days',
    fulfilmentType: 'website_project',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'ba-basic-setup',
    slug: 'automation-basic-setup',
    name: 'Basic WhatsApp Automation Setup',
    division: 'business_automation',
    priceNgn: 100000,
    monthlyMaintenanceNgn: 20000,
    depositPercent: 60,
    description:
      'Compliant WhatsApp Business enquiry management, automated FAQs, and instant staff notifications with opt-in/opt-out audit logs.',
    deliverables: [
      'Compliant WhatsApp Business API / authorised routing setup',
      'Automated FAQ & business hours responder',
      'Customer opt-in, opt-out & message audit logging',
      'Instant staff notification alerts on new enquiries',
      'Optional monthly maintenance: ₦20,000/month',
    ],
    turnaroundTime: '3–5 business days',
    fulfilmentType: 'automation_project',
    active: true,
    sortOrder: 4,
  },
  {
    id: 'ba-business-automation',
    slug: 'business-automation-suite',
    name: 'Business Automation Suite',
    division: 'business_automation',
    priceNgn: 180000,
    monthlyMaintenanceNgn: 35000,
    depositPercent: 60,
    description:
      'End-to-end WhatsApp product/service catalogue, customer booking workflows, order capture, and Paystack payment link integration.',
    deliverables: [
      'Interactive product & service catalogue on WhatsApp',
      'Customer booking & appointment confirmation workflow',
      'Structured order capture & Paystack payment link generation',
      'Automated customer follow-up & basic sales reporting',
      'Monthly maintenance & monitoring: ₦35,000/month',
    ],
    turnaroundTime: '5–10 business days',
    fulfilmentType: 'automation_project',
    active: true,
    sortOrder: 5,
  },
  {
    id: 'ba-advanced-integration',
    slug: 'automation-advanced-integration',
    name: 'Advanced Business Integration',
    division: 'business_automation',
    priceNgn: 300000,
    priceMaxNgn: 500000,
    monthlyMaintenanceNgn: 50000,
    depositPercent: 60,
    description:
      'Custom CRM-connected WhatsApp automation, multi-staff routing, automated invoicing, and recurring renewal management.',
    deliverables: [
      'Custom CRM & order ledger integration',
      'Multi-department enquiry routing & human-approval gates',
      'Automated invoice & receipt dispatch',
      'Weekly sales & response-time analytics',
      'Monthly maintenance & SLA support: ₦50,000/month',
    ],
    turnaroundTime: '10–14 business days',
    fulfilmentType: 'automation_project',
    active: true,
    sortOrder: 6,
  },
  {
    id: 'bi-market-snapshot',
    slug: 'market-snapshot',
    name: 'Market Snapshot Report',
    division: 'business_intelligence',
    priceNgn: 25000,
    monthlyMaintenanceNgn: 0,
    depositPercent: 100,
    description:
      'Focused sector and location overview combining verified public directory data, demand signals, and Excel/PDF summary.',
    deliverables: [
      'Concise PDF Market Snapshot Report',
      'Structured Excel dataset of verified local businesses',
      'Methodology, collection dates & explicit data limitations',
    ],
    dataSources: 'Public business directories, Google Maps public listings, Nigerian corporate registries, and direct price checks.',
    limitations: 'Reflects publicly available data at the collection date; private revenue figures are excluded unless self-reported.',
    turnaroundTime: '48 hours',
    fulfilmentType: 'research_project',
    active: true,
    sortOrder: 7,
  },
  {
    id: 'bi-opportunity-report',
    slug: 'business-opportunity-report',
    name: 'Business Opportunity Report',
    division: 'business_intelligence',
    priceNgn: 40000,
    priceMaxNgn: 60000,
    monthlyMaintenanceNgn: 0,
    depositPercent: 60,
    description:
      'Location intelligence, target customer density analysis, and verified B2B prospect shortlist for market entry or expansion.',
    deliverables: [
      'Comprehensive PDF Opportunity & Location Intelligence Report',
      'Cleaned Excel workbook with statistical breakdown & verified prospects',
      '30-minute walkthrough consultation (optional)',
    ],
    dataSources: 'Public commercial directories, geospatial corridor mapping, and verified B2B contact checks.',
    limitations: 'Market sizing is derived from observable business density and public pricing benchmarks; not a statutory audit.',
    turnaroundTime: '3–5 business days',
    fulfilmentType: 'research_project',
    active: true,
    sortOrder: 8,
  },
  {
    id: 'bi-competitor-intelligence',
    slug: 'competitor-intelligence',
    name: 'Competitor Intelligence Dossier',
    division: 'business_intelligence',
    priceNgn: 75000,
    priceMaxNgn: 150000,
    monthlyMaintenanceNgn: 0,
    depositPercent: 60,
    description:
      'Deep competitor benchmarking covering pricing, digital presence, positioning gaps, and actionable recommendations.',
    deliverables: [
      'Executive PDF Competitor Intelligence Dossier',
      'Competitor price & feature comparison Excel matrix',
      'Digital presence & customer-review gap analysis',
      'Strategy consultation to review findings',
    ],
    dataSources: 'Public competitor websites, published rate cards, public customer reviews, and verified directory profiles.',
    limitations: 'Covers observable public offerings and published prices as of the research date.',
    turnaroundTime: '5–7 business days',
    fulfilmentType: 'research_project',
    active: true,
    sortOrder: 9,
  },
  {
    id: 'bs-revenue-management',
    slug: 'revenue-management',
    name: 'Product A: SME Revenue & Payment Management',
    division: 'digital_business_solutions',
    priceNgn: 150000,
    priceMaxNgn: 250000,
    monthlyMaintenanceNgn: 25000,
    depositPercent: 60,
    description:
      'Connect customer records, quotations, invoices, Paystack payments, verified bank transfers, receipts, outstanding balances, and daily/monthly sales reports.',
    deliverables: [
      'Customer ledger & transaction history portal',
      'Quotation builder with 1-click conversion to invoice/order',
      'Paystack checkout + verified transfer & receipt upload workflow',
      'Outstanding balance tracker & payment reminder templates',
      'Daily & monthly sales reconciliation reports',
      'Staff onboarding, role permissions & 60/40 milestone deployment',
    ],
    limitations:
      'Uses authorised Paystack webhooks and verified transfer records; does not claim automatic direct polling of arbitrary third-party bank accounts.',
    turnaroundTime: '5–7 business days',
    fulfilmentType: 'automation_project',
    active: true,
    sortOrder: 10,
  },
  {
    id: 'bs-operations-inventory',
    slug: 'operations-inventory',
    name: 'Product B: Business Operations & Inventory Control',
    division: 'business_automation',
    priceNgn: 220000,
    priceMaxNgn: 380000,
    monthlyMaintenanceNgn: 35000,
    depositPercent: 60,
    description:
      'Configurable catalogue, multi-branch stock records, purchases, suppliers, sales, stock movement ledger, low-stock alerts, cost tracking, and estimated gross profit — built first for Nigerian distributors & wholesalers.',
    deliverables: [
      'Configurable SKU catalogue (cartons, bags, litres, packs, units)',
      'Multi-branch stock balance & movement ledger (purchase, sale, adjustment, transfer)',
      'Supplier directory & purchase order cost tracking',
      'Automated low-stock alerts & daily gross-profit report',
      'Role-based permissions (owner, manager, inventory clerk, accountant)',
      'Hands-on staff training & operational handover',
    ],
    limitations:
      'Requires initial opening stock count from client; excludes physical barcode hardware unless added separately.',
    turnaroundTime: '7–10 business days',
    fulfilmentType: 'automation_project',
    active: true,
    sortOrder: 11,
  },
  {
    id: 'bs-sales-recovery',
    slug: 'sales-recovery',
    name: 'Product C: Customer Acquisition & Sales Recovery',
    division: 'business_automation',
    priceNgn: 140000,
    priceMaxNgn: 240000,
    monthlyMaintenanceNgn: 25000,
    depositPercent: 60,
    description:
      'Connect web forms, authorised WhatsApp Business enquiries, lead qualification, sales-agent assignment, follow-up reminders, quotations, bookings, and lost-lead reporting.',
    deliverables: [
      'Website form & authorised WhatsApp enquiry capture with opt-in/opt-out logs',
      'Lead qualification stages & sales-agent assignment',
      'Automated follow-up reminders & booking workflow',
      'Quotation handoff & conversion attribution tracking',
      'Lost-lead reason reporting & recovery dashboard',
    ],
    limitations:
      'Uses authorised WhatsApp Business Platform workflows with explicit consent; unsolicited bulk messaging is not supported.',
    turnaroundTime: '5–7 business days',
    fulfilmentType: 'automation_project',
    active: true,
    sortOrder: 12,
  },
];
