import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from '@/lib/supabaseClient';

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

export function inferServiceKey(product: Pick<CommercialProduct, 'id' | 'division' | 'serviceKey'>): ServiceCategoryKey {
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
    serviceKey: 'whatsapp',
    priceNgn: 100000,
    monthlyMaintenanceNgn: 20000,
    recurringCostNotes:
      '₦20,000/month covers cloud hosting, monitoring, and up to 1,000 automated conversations/month. Meta WhatsApp API conversation charges and extra AI token usage beyond plan limits are billed separately.',
    depositPercent: 60,
    description:
      'Compliant WhatsApp Business enquiry management, automated FAQs, and instant staff notifications with opt-in/opt-out audit logs.',
    deliverables: [
      'Compliant WhatsApp Business API / authorised routing setup',
      'Automated FAQ & business hours responder (up to 1,000 conversations/month)',
      'Customer opt-in, opt-out & message audit logging',
      'Instant staff notification alerts & human-agent handover',
      'Monthly maintenance & hosting: ₦20,000/month',
    ],
    exclusions: [
      'Does not include unlimited bulk messaging or third-party Meta API conversation fees',
      'Unsolicited spam broadcasts are strictly prohibited',
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
    serviceKey: 'whatsapp',
    priceNgn: 180000,
    monthlyMaintenanceNgn: 35000,
    recurringCostNotes:
      '₦35,000/month covers cloud hosting, workflow monitoring, and up to 3,000 automated enquiries/month. Meta API fees and high-volume AI usage beyond 3,000 enquiries/month are billed at cost.',
    depositPercent: 60,
    description:
      'End-to-end WhatsApp product/service catalogue, customer booking workflows, order capture, and Paystack payment link integration.',
    deliverables: [
      'Interactive product & service catalogue on WhatsApp',
      'Customer booking & lead qualification workflow',
      'Structured order capture & human-agent handover',
      'Automated customer follow-up & sales enquiry records',
      'Monthly maintenance & monitoring: ₦35,000/month (up to 3,000 enquiries/month)',
    ],
    exclusions: [
      'Does not include unlimited messaging; usage limits apply per monthly tier',
      'Meta WhatsApp Business API conversation fees billed separately by usage',
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
    serviceKey: 'whatsapp',
    priceNgn: 300000,
    priceMaxNgn: 500000,
    monthlyMaintenanceNgn: 50000,
    recurringCostNotes:
      '₦50,000/month covers dedicated hosting, CRM sync, and up to 7,500 automated enquiries/month. Custom enterprise AI/API volumes are metered transparently.',
    depositPercent: 60,
    description:
      'Custom CRM-connected WhatsApp automation, multi-staff routing, automated invoicing, and recurring renewal management.',
    deliverables: [
      'Custom CRM & order ledger integration',
      'Multi-department enquiry routing & human-agent handover',
      'Automated invoice & receipt dispatch',
      'Weekly sales & response-time analytics',
      'Monthly maintenance & SLA support: ₦50,000/month (up to 7,500 enquiries/month)',
    ],
    exclusions: [
      'Usage above 7,500 enquiries/month or custom ERP connectors quoted separately',
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

  // ── DIVISION 4: GOOGLE BUSINESS PROFILE SERVICES ──
  {
    id: 'gbp-setup-optimisation',
    slug: 'gbp-setup-optimisation',
    name: 'Google Business Profile Setup & Optimisation',
    division: 'digital_business_solutions',
    serviceKey: 'gbp',
    pricingMode: 'starting_from',
    priceNgn: 35000,
    priceMaxNgn: 60000,
    monthlyMaintenanceNgn: 0,
    depositPercent: 100,
    milestonesDescription: '100% upfront for single-location setup & optimisation.',
    description:
      'Complete Google Business Profile setup, category and service optimisation, business information updates, product listings, and review management guidance.',
    deliverables: [
      'Google Business Profile setup & verification support',
      'Business category, service area, and description optimisation',
      'Structured product & service catalogue upload',
      'Review request & response playbook for staff',
    ],
    exclusions: [
      'Does not guarantee a specific Google ranking position',
      'Multi-branch profiles quoted separately',
    ],
    addOns: [
      {
        id: 'addon-gbp-monthly',
        name: 'Monthly Profile Updates & Post Management',
        priceNgn: 0,
        recurringMonthlyNgn: 15000,
        description: 'Monthly service updates, photo uploads, and review monitoring guidance.',
      },
    ],
    turnaroundTime: '2–4 business days',
    fulfilmentType: 'business_audit',
    active: true,
    sortOrder: 10,
  },

  // ── DIVISION 5: B2B LEAD GENERATION ──
  {
    id: 'lead-gen-starter-200',
    slug: 'b2b-leads-200',
    name: 'Verified B2B Lead Pack (200 Contacts)',
    division: 'business_intelligence',
    serviceKey: 'lead_gen',
    pricingMode: 'starting_from',
    priceNgn: 45000,
    monthlyMaintenanceNgn: 0,
    depositPercent: 60,
    milestonesDescription: '60% initial deposit, 40% upon sample verification before full spreadsheet delivery.',
    leadVolume: 200,
    targetIndustry: 'Custom Nigerian B2B Sector',
    geoCoverage: 'Lagos / Abuja / Port Harcourt / Nationwide',
    description:
      'Industry-specific Nigerian business research delivering 200 verified public business contacts in a clean Excel/CSV spreadsheet.',
    deliverables: [
      'Target-market & industry criteria alignment',
      '200 verified public business contacts (company, phone, email/location)',
      'Structured Excel/CSV spreadsheet ready for outreach',
      'Compliance-safe sourcing from public commercial listings',
    ],
    exclusions: [
      'Does not include personal private data or illegally obtained records',
      'Outreach campaign management quoted separately',
    ],
    addOns: [
      {
        id: 'addon-leads-extra-300',
        name: 'Expand to 500 Verified B2B Leads (+300)',
        priceNgn: 45000,
        description: 'Adds 300 extra verified commercial contacts in your chosen sector.',
      },
    ],
    dataSources: 'Public business directories, corporate websites, and verified commercial profiles.',
    limitations: 'Compiled from publicly available business listings in accordance with Nigerian privacy requirements.',
    turnaroundTime: '3–5 business days',
    fulfilmentType: 'research_project',
    active: true,
    sortOrder: 11,
  },

  // ── DIVISION 6: STRATEGY & BUSINESS CONSULTING ──
  {
    id: 'strat-consulting-custom',
    slug: 'strategy-business-consulting',
    name: 'Strategy, Pricing & Business Plan Advisory',
    division: 'business_intelligence',
    serviceKey: 'strategy',
    pricingMode: 'custom_quote',
    priceNgn: 0,
    monthlyMaintenanceNgn: 0,
    depositPercent: 50,
    milestonesDescription: 'Custom quotation issued after initial discovery assessment (typically 50% deposit / 50% on delivery).',
    description:
      'Tailored pricing strategy, business model review, structured business plans, investment proposals, growth roadmaps, and market research.',
    deliverables: [
      'Pricing strategy & margin structure review',
      'Business model & operational bottleneck assessment',
      'Structured business plan or investment proposal',
      'Market research & practical growth roadmap',
    ],
    exclusions: [
      'Does not guarantee bank loan, grant, or investor funding approval',
      'Does not guarantee a specific percentage of sales growth',
    ],
    turnaroundTime: '5–14 business days (scope-dependent)',
    fulfilmentType: 'business_audit',
    active: true,
    sortOrder: 12,
  },
];

const LOCAL_CATALOG_PATH = path.join(process.cwd(), 'local_db', 'commerce_catalog.json');

function readLocalCatalog(): CommercialProduct[] | null {
  try {
    if (!fs.existsSync(LOCAL_CATALOG_PATH)) return null;
    const raw = fs.readFileSync(LOCAL_CATALOG_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    // Merge any newly introduced service defaults (e.g. gbp, lead_gen, strategy) not yet in local cache
    const existingIds = new Set(parsed.map((p: CommercialProduct) => p.id));
    const missingDefaults = DEFAULT_COMMERCIAL_CATALOG.filter((d) => !existingIds.has(d.id));
    return missingDefaults.length > 0 ? [...parsed, ...missingDefaults] : parsed;
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
    serviceKey: row.service_key || undefined,
    pricingMode: row.pricing_mode || undefined,
    priceNgn: Number(row.price_ngn),
    priceMaxNgn: row.price_max_ngn != null ? Number(row.price_max_ngn) : undefined,
    promoPriceNgn: row.promo_price_ngn != null ? Number(row.promo_price_ngn) : undefined,
    promoLabel: row.promo_label || undefined,
    monthlyMaintenanceNgn: Number(row.monthly_maintenance_ngn || 0),
    recurringCostNotes: row.recurring_cost_notes || undefined,
    depositPercent: Number(row.deposit_percent || 60),
    milestonesDescription: row.milestones_description || undefined,
    description: row.description,
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    exclusions: Array.isArray(row.exclusions) ? row.exclusions : undefined,
    addOns: Array.isArray(row.add_ons) ? row.add_ons : undefined,
    leadVolume: row.lead_volume != null ? Number(row.lead_volume) : undefined,
    targetIndustry: row.target_industry || undefined,
    geoCoverage: row.geo_coverage || undefined,
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
  serviceKey?: ServiceCategoryKey;
  includeInactive?: boolean;
}): Promise<CommercialProduct[]> {
  let products: CommercialProduct[] | null = null;

  // Prefer local catalog if admin has saved customizations locally, otherwise try Supabase
  const localProducts = readLocalCatalog();
  if (localProducts) {
    products = localProducts;
  } else {
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
      // Fallback gracefully to defaults
    }
  }

  if (!products) {
    products = DEFAULT_COMMERCIAL_CATALOG;
  }

  return products
    .map((p) => ({
      ...p,
      serviceKey: inferServiceKey(p),
      pricingMode: p.pricingMode || (p.priceNgn === 0 ? 'custom_quote' : p.priceMaxNgn ? 'starting_from' : 'fixed'),
    }))
    .filter((p) => {
      if (!options?.includeInactive && !p.active) return false;
      if (options?.division && p.division !== options.division) return false;
      if (options?.serviceKey && p.serviceKey !== options.serviceKey) return false;
      return true;
    })
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function getCommercialProduct(idOrSlug: string): Promise<CommercialProduct | null> {
  const all = await listCommercialProducts({ includeInactive: true });
  return all.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
}

export async function createCommercialProduct(
  input: Omit<CommercialProduct, 'id' | 'slug' | 'sortOrder'> & { id?: string; slug?: string; sortOrder?: number }
): Promise<CommercialProduct> {
  const current = await listCommercialProducts({ includeInactive: true });
  const slugBase = (input.slug || input.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  const id = input.id || `${input.serviceKey || 'pkg'}-${slugBase}-${Date.now().toString(36).slice(-4)}`;
  const created: CommercialProduct = {
    ...input,
    id,
    slug: input.slug || slugBase || id,
    serviceKey: input.serviceKey || inferServiceKey({ id, division: input.division }),
    pricingMode: input.pricingMode || (input.priceNgn === 0 ? 'custom_quote' : 'fixed'),
    sortOrder: input.sortOrder ?? current.length + 1,
  };
  const next = [...current, created];
  writeLocalCatalog(next);
  return created;
}

export async function updateCommercialProduct(
  id: string,
  patch: Partial<CommercialProduct>
): Promise<CommercialProduct | null> {
  const current = await listCommercialProducts({ includeInactive: true });
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: CommercialProduct = {
    ...current[index],
    ...patch,
    id: current[index].id,
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

export async function deleteCommercialProduct(id: string): Promise<boolean> {
  const current = await listCommercialProducts({ includeInactive: true });
  const next = current.filter((p) => p.id !== id);
  if (next.length === current.length) return false;
  writeLocalCatalog(next);

  try {
    const supabase = getSupabaseClient();
    await (supabase.from('products') as any).delete().eq('id', id);
  } catch {}
  return true;
}

export function getEffectiveBasePriceNgn(product: CommercialProduct): number {
  if (product.promoPriceNgn && product.promoPriceNgn > 0 && product.promoPriceNgn < product.priceNgn) {
    return product.promoPriceNgn;
  }
  return product.priceNgn;
}

export function calculateOrderAmounts(
  product: CommercialProduct,
  paymentStage: 'deposit' | 'balance' | 'full' = 'deposit',
  selectedAddOnIds: string[] = []
) {
  const baseNgn = getEffectiveBasePriceNgn(product);
  const selectedAddOns = (product.addOns || []).filter((a) => selectedAddOnIds.includes(a.id));
  const addOnsOneTimeNgn = selectedAddOns.reduce((sum, a) => sum + Number(a.priceNgn || 0), 0);
  const addOnsRecurringNgn = selectedAddOns.reduce((sum, a) => sum + Number(a.recurringMonthlyNgn || 0), 0);

  const totalAmountNgn = baseNgn + addOnsOneTimeNgn;
  const depositAmountNgn = Math.round((totalAmountNgn * product.depositPercent) / 100);
  const balanceAmountNgn = Math.max(0, totalAmountNgn - depositAmountNgn);
  const dueNowNgn =
    paymentStage === 'full' ? totalAmountNgn : paymentStage === 'balance' ? balanceAmountNgn : depositAmountNgn;
  const recurringMonthlyNgn = Number(product.monthlyMaintenanceNgn || 0) + addOnsRecurringNgn;

  return {
    baseNgn,
    addOnsOneTimeNgn,
    totalAmountNgn,
    depositAmountNgn,
    balanceAmountNgn,
    dueNowNgn,
    recurringMonthlyNgn,
    selectedAddOns,
  };
}
