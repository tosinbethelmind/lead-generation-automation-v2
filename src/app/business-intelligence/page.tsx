import DivisionFunnelPage, { type DivisionConfig } from '@/components/commerce/DivisionFunnelPage';

const CONFIG: DivisionConfig = {
  division: 'business_intelligence',
  badge: 'Division 3 • Business Intelligence',
  headline: 'Verified Nigerian Market Research, Competitor Intelligence & Data Analysis',
  subheadline:
    'Make expansion, pricing, and prospecting decisions using structured research, competitor price monitoring, Excel data analysis, and executive PDF dossiers — with transparent sources and zero fabricated figures.',
  problemTitle: 'The Cost of Guessing in Nigerian Markets',
  problems: [
    'Launching in a new Lagos, Abuja, or Port Harcourt corridor without verified competitor pricing or business density data.',
    'Relying on outdated or fabricated market estimates instead of observable directory and field-checked records.',
    'Raw spreadsheets without statistical summaries or actionable executive takeaways.',
  ],
  solutionTitle: 'Evidence-Based Research With Clear Deliverables',
  solutions: [
    'Every report includes both a clean Excel workbook and a presentation-ready PDF dossier.',
    'Explicitly documents public data sources, collection dates, methodology, and research limitations.',
    'Custom research quotations available for specialised sector, location, or statistical assignments.',
  ],
  demoTitle: 'Standardised Research Workflow & Deliverables',
  demoDescription:
    'From Market Snapshots (₦25,000) to full Competitor Intelligence Dossiers (₦75,000–₦150,000), every assignment follows a rigorous 6-step process.',
  demoPoints: [
    '1. Requirements & Scope: Clear definition of target sector, geography, and research questions.',
    '2. Collection & Validation: Public directory checks, price benchmarking, and duplicate removal.',
    '3. Excel + PDF Delivery: Statistical summary, verified prospect list, limitations note, and optional consultation.',
  ],
  demoCtaLabel: 'Request a Custom Research Quote',
  demoCtaHref: '/contact',
  faqs: [
    {
      q: 'Do you fabricate or estimate private competitor revenue?',
      a: 'Never. We strictly report observable public data, verified listings, and published prices, and we explicitly state collection dates and limitations.',
    },
    {
      q: 'What file formats do I receive?',
      a: 'You receive a structured Excel (.xlsx) dataset for your team plus an executive PDF report.',
    },
    {
      q: 'Can I request custom research outside the three packages?',
      a: 'Yes. Contact us with your sector, location, and data requirements for a custom quotation and turnaround timeline.',
    },
    {
      q: 'How fast is delivery?',
      a: 'Market Snapshots deliver in 48 hours; Business Opportunity Reports in 3–5 business days; Competitor Intelligence in 5–7 business days.',
    },
  ],
};

export default function BusinessIntelligencePage() {
  return <DivisionFunnelPage config={CONFIG} />;
}
