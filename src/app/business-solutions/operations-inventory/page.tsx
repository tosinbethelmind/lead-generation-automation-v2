import FlagshipProductPage, { type FlagshipProductSpec } from '@/components/commerce/FlagshipProductPage';

const SPEC: FlagshipProductSpec = {
  productId: 'bs-operations-inventory',
  badge: 'Flagship Product B • Business Operations & Inventory Control',
  headline: 'Control Stock, Suppliers, Branches & Daily Gross Profit Without Guesswork.',
  subheadline:
    'Built first for Nigerian distributors, wholesalers, and multi-branch businesses. Track configurable units, purchases, stock movements, low-stock alerts, cost prices, and estimated gross profit in real time.',
  targetCustomer: [
    'Nigerian wholesale & retail distributors (FMCG, drinks, building materials, provisions)',
    'Multi-branch shops and warehouses tracking stock transfers and shrinkage',
    'Factory and depot owners needing daily cost vs. sales visibility',
  ],
  problemsSolved: [
    'Stock discrepancies between warehouse counts, branch sales, and cash collected',
    'Unexpected stock-outs on fast-moving SKUs due to missing reorder alerts',
    'Inability to see true product cost vs. estimated gross profit at the end of the day',
  ],
  benefits: [
    'Configure units per product (cartons, bags, litres, packs, trays, or pieces)',
    'Every purchase, sale, transfer, and adjustment is logged with user & timestamp',
    'Automatic low-stock alerts when quantity hits your configured reorder level',
  ],
  implementationScope: [
    'SKU catalogue, multi-branch stock ledger, supplier directory, purchase & sale movement tracking, low-stock alerts, and role permissions',
  ],
  exclusions: [
    'Requires initial opening stock count provided by client team',
    'Physical barcode scanners or thermal printers are optional hardware add-ons',
  ],
  onboardingSteps: [
    'Operations & branch structure assessment',
    '60% setup deposit & SKU/unit template preparation',
    'Opening stock & supplier import + role permissions setup (owner, manager, clerk, accountant)',
    'Staff practical training & daily report handover',
  ],
  trainingAndSupport: [
    'Hands-on training for warehouse clerks, branch managers, and accountants',
    'Ongoing monthly support for new branches, SKU imports, and system uptime',
  ],
  optionalAddOns: [
    { name: 'Additional Branch Workspace', note: 'Configurable per depot or retail outlet' },
    { name: 'Factory / Dispatch Yield Module', note: 'Adapted from our Obi Table Water OS workflow' },
  ],
  demoTitle: 'Product B Live Operations Preview (Distributor Stock & Profit)',
  demoRows: [
    { label: 'Sample SKU Stock Balance', metric: '142 Cartons (Reorder: 30)', status: 'Healthy Stock' },
    { label: 'Sample Low-Stock Alert', metric: '50kg Sugar Bags: 8 Left', status: 'Below Reorder Level (15)' },
    { label: 'Sample Daily Gross Profit', metric: 'Sales ₦485,000 • Est. Profit ₦94,000', status: 'Margin: 19.4%' },
  ],
};

export default function OperationsInventoryPage() {
  return <FlagshipProductPage spec={SPEC} />;
}
