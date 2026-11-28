import FlagshipProductPage, { type FlagshipProductSpec } from '@/components/commerce/FlagshipProductPage';

const SPEC: FlagshipProductSpec = {
  productId: 'bs-revenue-management',
  badge: 'Flagship Product A • SME Revenue & Payment Management',
  headline: 'Manage Quotations, Invoices, Paystack & Verified Transfers in One Place.',
  subheadline:
    'Stop losing track of unpaid balances, scattered receipts, and manual Excel sheets. Connect customer records, quotations, invoices, Paystack payments, verified transfer records, and daily sales reports.',
  targetCustomer: [
    'Nigerian SMEs issuing regular quotes, proforma invoices, and milestone bills',
    'Service businesses, contractors, private schools, and B2B suppliers',
    'Teams reconciling Paystack payments alongside verified corporate bank transfers',
  ],
  problemsSolved: [
    'Unpaid balances forgotten because invoices live in Word/PDF files on staff laptops',
    'No single view of customer transaction history across deposits and final balances',
    'Confusion over which transfers have actually been verified vs. pending receipts',
  ],
  benefits: [
    'Convert approved quotations into orders and invoices in one click',
    'Track exact deposit paid vs. remaining balance per customer',
    'Produce clean daily and monthly sales reconciliation summaries',
  ],
  implementationScope: [
    'Customer ledger, quotation builder, invoice portal, Paystack webhook verification, verified transfer upload, and sales reporting',
  ],
  exclusions: [
    'Uses authorised Paystack webhooks and verified corporate transfer records; does not claim automatic direct polling of arbitrary third-party bank accounts',
    'Excludes statutory tax filing or external ERP accounting migration unless scoped as an add-on',
  ],
  onboardingSteps: [
    'Business assessment & invoice/tax template review',
    '60% setup deposit & workspace provisioning',
    'Import active customer list & configure Paystack/Moniepoint settlement details',
    'Staff walkthrough, test transaction verification & go-live',
  ],
  trainingAndSupport: [
    'Live remote training session for owner & accounts staff',
    'WhatsApp & email support during business hours (Mon–Sat)',
    'Monthly maintenance covers webhook monitoring, updates, and backup checks',
  ],
  optionalAddOns: [
    { name: 'Custom .com Domain & Branded Email', note: 'Quoted based on domain registrar availability' },
    { name: 'Automated WhatsApp Balance Reminders', note: 'Requires approved WhatsApp Business Platform template' },
  ],
  demoTitle: 'Product A Live Workflow Preview (Quotation → Invoice → Balance)',
  demoRows: [
    { label: 'Sample Quotation → Invoice', metric: 'QT-884210 → INV-884210', status: 'Converted & Sent' },
    { label: 'Sample Deposit (Paystack Verified)', metric: '₦150,000 / ₦250,000', status: 'Balance Due: ₦100,000' },
    { label: 'Sample Daily Sales Summary', metric: '4 Verified Orders • ₦620,000', status: 'Reconciled' },
  ],
};

export default function RevenueManagementPage() {
  return <FlagshipProductPage spec={SPEC} />;
}
