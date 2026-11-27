import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from '@/lib/supabaseClient';

export type CommercialDivision =
  | 'digital_business_solutions'
  | 'business_automation'
  | 'business_intelligence'
  | 'digital_asset';

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
  priceNgn: number;
  priceMaxNgn?: number;
  monthlyMaintenanceNgn: number;
  depositPercent: number;
  description: string;
  deliverables: string[];
  dataSources?: string;
  limitations?: string;
  turnaroundTime: string;
  fulfilmentType: FulfilmentType;
  active: boolean;
  sortOrder: number;
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
  // ── DIVISION 1: BETHELMIND DIGITAL BUSINESS SOLUTIONS (PRIMARY CASHFLOW) ──
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

  // ── DIVISION 2: BETHELMIND BUSINESS AUTOMATION (RECURRING REVENUE) ──
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

  // ── DIVISION 3: BETHELMIND BUSINESS INTELLIGENCE (DATA & RESEARCH) ──
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
];

const LOCAL_CATALOG_PATH = path.join(process.cwd(), 'local_db', 'commerce_catalog.json');

function readLocalCatalog(): CommercialProduct[] | null {
  try {
    if (!fs.existsSync(LOCAL_CATALOG_PATH)) return null;
    const raw = fs.readFileSync(LOCAL_CATALOG_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocalCatalog(products: CommercialProduct[]): void {
  try {
    const dir = path.dirname(LOCAL_CATALOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_CATALOG_PATH, JSON.stringify(products, null, 2), 'utf8');
  } catch (err) {
    console.warn('[Catalog] Failed to persist local catalog cache:', err);
  }
}

function mapRowToProduct(row: any): CommercialProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    division: row.division,
    priceNgn: Number(row.price_ngn),
    priceMaxNgn: row.price_max_ngn != null ? Number(row.price_max_ngn) : undefined,
    monthlyMaintenanceNgn: Number(row.monthly_maintenance_ngn || 0),
    depositPercent: Number(row.deposit_percent || 60),
    description: row.description,
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    dataSources: row.data_sources || undefined,
    limitations: row.limitations || undefined,
    turnaroundTime: row.turnaround_time || '3–5 business days',
    fulfilmentType: row.fulfilment_type,
    active: row.active !== false,
    sortOrder: Number(row.sort_order || 0),
  };
}

export async function listCommercialProducts(options?: {
  division?: CommercialDivision;
  includeInactive?: boolean;
}): Promise<CommercialProduct[]> {
  let products: CommercialProduct[] | null = null;

  try {
    const supabase = getSupabaseClient();
    let query = supabase.from('products').select('*').order('sort_order', { ascending: true });
    if (!options?.includeInactive) {
      query = query.eq('active', true);
    }
    const { data, error } = await query;
    if (!error && Array.isArray(data) && data.length > 0) {
      products = data.map(mapRowToProduct);
    }
  } catch {
    // Fallback gracefully to local cache / defaults
  }

  if (!products) {
    products = readLocalCatalog() || DEFAULT_COMMERCIAL_CATALOG;
  }

  return products.filter((p) => {
    if (!options?.includeInactive && !p.active) return false;
    if (options?.division && p.division !== options.division) return false;
    return true;
  });
}

export async function getCommercialProduct(idOrSlug: string): Promise<CommercialProduct | null> {
  const all = await listCommercialProducts({ includeInactive: true });
  return all.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
}

export async function updateCommercialProduct(
  id: string,
  patch: Partial<
    Pick<
      CommercialProduct,
      'name' | 'priceNgn' | 'priceMaxNgn' | 'monthlyMaintenanceNgn' | 'depositPercent' | 'description' | 'deliverables' | 'active' | 'turnaroundTime'
    >
  >
): Promise<CommercialProduct | null> {
  const current = await listCommercialProducts({ includeInactive: true });
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: CommercialProduct = {
    ...current[index],
    ...patch,
  };
  current[index] = updated;
  writeLocalCatalog(current);

  try {
    const supabase = getSupabaseClient();
    await (supabase.from('products') as any).upsert({
      id: updated.id,
      slug: updated.slug,
      name: updated.name,
      division: updated.division,
      price_ngn: updated.priceNgn,
      price_max_ngn: updated.priceMaxNgn ?? null,
      monthly_maintenance_ngn: updated.monthlyMaintenanceNgn,
      deposit_percent: updated.depositPercent,
      description: updated.description,
      deliverables: updated.deliverables,
      data_sources: updated.dataSources ?? null,
      limitations: updated.limitations ?? null,
      turnaround_time: updated.turnaroundTime,
      fulfilment_type: updated.fulfilmentType,
      active: updated.active,
      sort_order: updated.sortOrder,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[Catalog] Supabase upsert skipped/failed, saved locally:', err);
  }

  return updated;
}

export function calculateOrderAmounts(product: CommercialProduct, paymentStage: 'deposit' | 'balance' | 'full' = 'deposit') {
  const totalAmountNgn = product.priceNgn;
  const depositAmountNgn = Math.round((totalAmountNgn * product.depositPercent) / 100);
  const balanceAmountNgn = Math.max(0, totalAmountNgn - depositAmountNgn);
  const dueNowNgn =
    paymentStage === 'full' ? totalAmountNgn : paymentStage === 'balance' ? balanceAmountNgn : depositAmountNgn;

  return {
    totalAmountNgn,
    depositAmountNgn,
    balanceAmountNgn,
    dueNowNgn,
  };
}
