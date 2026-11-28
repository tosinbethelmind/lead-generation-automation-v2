import fs from 'fs';
import path from 'path';
import type { BusinessDivisionKey } from './googleTracking';
import { listEnquiries } from './enquiries';
import { getLedgerSummary } from './ledger';

export interface AnalyticsEventRow {
  eventName: string;
  businessDivision: BusinessDivisionKey;
  utmSource: string;
  utmCampaign: string;
  abVariant: string;
  valueNgn: number;
  timestamp: string;
}

export interface AdSpendRecord {
  id: string;
  businessDivision: BusinessDivisionKey;
  utmCampaign: string;
  spendNgn: number;
  updatedAt: string;
}

interface SalesAnalyticsState {
  events: AnalyticsEventRow[];
  adSpend: AdSpendRecord[];
}

const ANALYTICS_PATH = path.join(process.cwd(), 'local_db', 'commerce_sales_analytics.json');

function readState(): SalesAnalyticsState {
  try {
    if (fs.existsSync(ANALYTICS_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(ANALYTICS_PATH, 'utf8'));
      return {
        events: Array.isArray(parsed.events) ? parsed.events : [],
        adSpend: Array.isArray(parsed.adSpend) ? parsed.adSpend : [],
      };
    }
  } catch {}
  return { events: [], adSpend: [] };
}

function writeState(state: SalesAnalyticsState): void {
  try {
    const dir = path.dirname(ANALYTICS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ANALYTICS_PATH, JSON.stringify(state, null, 2), 'utf8');
  } catch {}
}

export function recordAnalyticsEvent(input: Omit<AnalyticsEventRow, 'timestamp'>): void {
  const state = readState();
  state.events.push({
    ...input,
    timestamp: new Date().toISOString(),
  });
  if (state.events.length > 5000) {
    state.events = state.events.slice(-5000);
  }
  writeState(state);
}

export function upsertAdSpend(input: {
  businessDivision: BusinessDivisionKey;
  utmCampaign: string;
  spendNgn: number;
}): AdSpendRecord {
  const state = readState();
  const campaign = input.utmCampaign.trim() || 'untagged';
  const existing = state.adSpend.find(
    (s) => s.businessDivision === input.businessDivision && s.utmCampaign === campaign
  );
  const now = new Date().toISOString();
  if (existing) {
    existing.spendNgn = input.spendNgn;
    existing.updatedAt = now;
    writeState(state);
    return existing;
  }
  const created: AdSpendRecord = {
    id: `${input.businessDivision}:${campaign}`,
    businessDivision: input.businessDivision,
    utmCampaign: campaign,
    spendNgn: input.spendNgn,
    updatedAt: now,
  };
  state.adSpend.push(created);
  writeState(state);
  return created;
}

export async function getSalesDashboardMetrics(filters?: {
  businessDivision?: BusinessDivisionKey | 'all';
  utmCampaign?: string;
}) {
  const state = readState();
  const enquiries = await listEnquiries();
  const ledger = getLedgerSummary();

  const divFilter = filters?.businessDivision && filters.businessDivision !== 'all' ? filters.businessDivision : null;
  const campFilter = filters?.utmCampaign && filters.utmCampaign !== 'all' ? filters.utmCampaign : null;

  const filteredEvents = state.events.filter((e) => {
    if (divFilter && e.businessDivision !== divFilter) return false;
    if (campFilter && e.utmCampaign !== campFilter) return false;
    return true;
  });

  const filteredEnquiries = enquiries.filter((enq) => {
    const enqDiv: BusinessDivisionKey = enq.source?.includes('academic')
      ? 'academic_research'
      : enq.source?.includes('foods')
        ? 'bethelmind_foods'
        : 'business_solutions';
    if (divFilter && enqDiv !== divFilter) return false;
    if (campFilter && (enq.utmCampaign || 'untagged') !== campFilter) return false;
    return true;
  });

  const filteredOrders = ledger.recentOrders.filter((o: any) => {
    const oDiv: BusinessDivisionKey =
      o.division === 'academic_research'
        ? 'academic_research'
        : o.division === 'bethelmind_foods'
          ? 'bethelmind_foods'
          : 'business_solutions';
    if (divFilter && oDiv !== divFilter) return false;
    return true;
  });

  const paidOrders = filteredOrders.filter(
    (o: any) => o.paymentStatus === 'paid' || o.paymentStatus === 'deposit_paid'
  );
  const confirmedRevenueNgn = paidOrders.reduce((s: number, o: any) => s + Number(o.amountPaidNgn || 0), 0);

  const totalAdSpendNgn = state.adSpend
    .filter((s) => (!divFilter || s.businessDivision === divFilter) && (!campFilter || s.utmCampaign === campFilter))
    .reduce((sum, s) => sum + Number(s.spendNgn || 0), 0);

  const payingCustomersCount = paidOrders.length;
  const costPerPayingCustomerNgn =
    payingCustomersCount > 0 && totalAdSpendNgn > 0
      ? Math.round(totalAdSpendNgn / payingCustomersCount)
      : 0;
  const roas = totalAdSpendNgn > 0 ? Number((confirmedRevenueNgn / totalAdSpendNgn).toFixed(2)) : 0;

  const campaigns = Array.from(
    new Set([
      ...state.events.map((e) => e.utmCampaign),
      ...state.adSpend.map((s) => s.utmCampaign),
    ])
  ).filter(Boolean);

  const QUALIFIED_STATUSES = [
    'QUALIFIED',
    'PROPOSAL SENT',
    'QUOTE SENT',
    'AWAITING PAYMENT',
    'PAID',
    'IN PROGRESS',
    'COMPLETED',
    'WON',
  ];

  const allCampaigns = Array.from(
    new Set([
      ...state.events.map((e) => e.utmCampaign || 'untagged'),
      ...state.adSpend.map((s) => s.utmCampaign || 'untagged'),
      ...filteredEnquiries.map((e) => e.utmCampaign || 'untagged'),
    ])
  ).filter(Boolean);

  const campaignBreakdown = allCampaigns.map((camp) => {
    const campEnquiries = filteredEnquiries.filter((e) => (e.utmCampaign || 'untagged') === camp);
    const campQualified = campEnquiries.filter((e) => QUALIFIED_STATUSES.includes(e.status)).length;
    const campPaid = paidOrders.filter((o: any) => (o.metadata?.utmCampaign || 'untagged') === camp);
    const campRevenue = campPaid.reduce((s: number, o: any) => s + Number(o.amountPaidNgn || 0), 0);
    const campSpend = state.adSpend
      .filter((s) => (!divFilter || s.businessDivision === divFilter) && (s.utmCampaign || 'untagged') === camp)
      .reduce((sum, s) => sum + Number(s.spendNgn || 0), 0);
    const campCac = campPaid.length > 0 && campSpend > 0 ? Math.round(campSpend / campPaid.length) : 0;
    const campRoas = campSpend > 0 ? Number((campRevenue / campSpend).toFixed(2)) : 0;
    return {
      campaign: camp,
      enquiries: campEnquiries.length,
      qualifiedLeads: campQualified,
      paidOrders: campPaid.length,
      revenueNgn: campRevenue,
      adSpendNgn: campSpend,
      acquisitionCostNgn: campCac,
      roas: campRoas,
    };
  });

  return {
    visitors: filteredEvents.filter((e) => e.eventName === 'page_view').length,
    whatsappEnquiries: filteredEvents.filter((e) => e.eventName === 'click_whatsapp').length,
    formLeads: filteredEnquiries.length,
    qualifiedLeads: filteredEnquiries.filter((e) => QUALIFIED_STATUSES.includes(e.status)).length,
    orders: filteredOrders.length,
    confirmedPayments: payingCustomersCount,
    revenueNgn: confirmedRevenueNgn,
    adSpendNgn: totalAdSpendNgn,
    costPerPayingCustomerNgn,
    roas,
    campaigns,
    campaignBreakdown,
    adSpendRecords: state.adSpend,
  };
}
