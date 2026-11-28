'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  Save,
  ShieldCheck,
  Download,
  Plus,
  Trash2,
} from 'lucide-react';
import type {
  CommercialProduct,
  PricingMode,
  ServiceCategoryKey,
} from '@/lib/commerce/catalog';
import type {
  EnquiryRecord,
  LeadPipelineStatus,
  PortfolioEntry,
} from '@/lib/commerce/enquiries';

const LEAD_STATUSES: LeadPipelineStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL SENT',
  'AWAITING PAYMENT',
  'WON',
  'LOST',
];

const SERVICE_KEY_OPTIONS: { key: ServiceCategoryKey; label: string; division: CommercialProduct['division'] }[] = [
  { key: 'website', label: 'Business Website Development', division: 'digital_business_solutions' },
  { key: 'whatsapp', label: 'WhatsApp Sales Automation', division: 'business_automation' },
  { key: 'gbp', label: 'Google Business Profile', division: 'digital_business_solutions' },
  { key: 'lead_gen', label: 'B2B Lead Generation', division: 'business_intelligence' },
  { key: 'bi_analytics', label: 'Business Intelligence & Analytics', division: 'business_intelligence' },
  { key: 'strategy', label: 'Strategy & Business Consulting', division: 'business_intelligence' },
];

export default function AdminCommercePage() {
  const [products, setProducts] = useState<CommercialProduct[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [adminToken, setAdminToken] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sales & Ad Spend Analytics state
  const [salesMetrics, setSalesMetrics] = useState<any>(null);
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [adSpendCampaign, setAdSpendCampaign] = useState('untagged');
  const [adSpendAmount, setAdSpendAmount] = useState('');

  // New Package form
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgServiceKey, setNewPkgServiceKey] = useState<ServiceCategoryKey>('website');
  const [newPkgPricingMode, setNewPkgPricingMode] = useState<PricingMode>('fixed');
  const [newPkgPrice, setNewPkgPrice] = useState('100000');
  const [newPkgPromoPrice, setNewPkgPromoPrice] = useState('');
  const [newPkgMonthly, setNewPkgMonthly] = useState('0');
  const [newPkgDeposit, setNewPkgDeposit] = useState('60');
  const [newPkgTurnaround, setNewPkgTurnaround] = useState('3–5 business days');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgDeliverables, setNewPkgDeliverables] = useState('');

  // Portfolio form
  const [portTitle, setPortTitle] = useState('');
  const [portCat, setPortCat] = useState('');
  const [portType, setPortType] = useState<'demonstration' | 'completed_client'>('completed_client');
  const [portUrl, setPortUrl] = useState('');
  const [portDesc, setPortDesc] = useState('');

  const authHeaders = (): Record<string, string> => ({
    'Content-Type': 'application/json',
    ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
      const [prodRes, ordRes, enqRes, portRes, analyticsRes] = await Promise.all([
        fetch('/api/commerce/products?includeInactive=true'),
        fetch('/api/commerce/orders', { headers }),
        fetch('/api/commerce/enquiries', { headers }),
        fetch('/api/commerce/portfolio'),
        fetch(
          `/api/commerce/analytics?businessDivision=${encodeURIComponent(
            divisionFilter
          )}&utmCampaign=${encodeURIComponent(campaignFilter)}`,
          { headers }
        ),
      ]);
      const prodData = await prodRes.json();
      if (prodData?.success) setProducts(prodData.products);
      const ordData = await ordRes.json();
      if (ordData?.success) setSummary(ordData.summary);
      const enqData = await enqRes.json();
      if (enqData?.success) setEnquiries(enqData.enquiries);
      const portData = await portRes.json();
      if (portData?.success) setPortfolio(portData.items);
      const analyticsData = await analyticsRes.json();
      if (analyticsData?.success) setSalesMetrics(analyticsData.metrics);
    } catch (err: any) {
      setStatusMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [divisionFilter, campaignFilter]);

  const handleSaveAdSpend = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/commerce/analytics', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        action: 'set_ad_spend',
        businessDivision: divisionFilter === 'all' ? 'business_solutions' : divisionFilter,
        utmCampaign: adSpendCampaign || 'untagged',
        spendNgn: Number(adSpendAmount) || 0,
      }),
    });
    const data = await res.json();
    if (data?.success) {
      setStatusMsg('Ad spend updated.');
      setAdSpendAmount('');
      loadData();
    } else {
      setStatusMsg(`Error: ${data?.error}`);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    const svcMeta = SERVICE_KEY_OPTIONS.find((s) => s.key === newPkgServiceKey) || SERVICE_KEY_OPTIONS[0];
    const res = await fetch('/api/commerce/products', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        name: newPkgName.trim(),
        serviceKey: newPkgServiceKey,
        division: svcMeta.division,
        pricingMode: newPkgPricingMode,
        priceNgn: newPkgPricingMode === 'custom_quote' ? 0 : Number(newPkgPrice) || 0,
        promoPriceNgn: newPkgPromoPrice ? Number(newPkgPromoPrice) : undefined,
        monthlyMaintenanceNgn: Number(newPkgMonthly) || 0,
        depositPercent: Number(newPkgDeposit) || 60,
        turnaroundTime: newPkgTurnaround || '3–5 business days',
        description: newPkgDesc.trim(),
        deliverables: newPkgDeliverables
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        active: true,
      }),
    });
    const data = await res.json();
    if (data?.success) {
      setStatusMsg(`Created package: ${data.product.name}`);
      setNewPkgName('');
      setNewPkgDesc('');
      setNewPkgDeliverables('');
      setNewPkgPromoPrice('');
      loadData();
    } else {
      setStatusMsg(`Error: ${data?.error}`);
    }
  };

  const handleSavePrice = async (p: CommercialProduct) => {
    setStatusMsg(null);
    const res = await fetch('/api/commerce/products', {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({
        id: p.id,
        name: p.name,
        pricingMode: p.pricingMode,
        priceNgn: Number(p.priceNgn || 0),
        promoPriceNgn: p.promoPriceNgn ? Number(p.promoPriceNgn) : undefined,
        promoLabel: p.promoLabel || undefined,
        monthlyMaintenanceNgn: Number(p.monthlyMaintenanceNgn || 0),
        depositPercent: Number(p.depositPercent || 60),
        turnaroundTime: p.turnaroundTime,
        active: p.active,
      }),
    });
    const data = await res.json();
    setStatusMsg(
      data?.success
        ? `Updated ${p.name} (₦${Number(p.priceNgn).toLocaleString()})`
        : `Error: ${data?.error}`
    );
  };

  const handleDeletePackage = async (id: string, name: string) => {
    setStatusMsg(null);
    const res = await fetch(`/api/commerce/products?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const data = await res.json();
    if (data?.success) {
      setStatusMsg(`Deleted package: ${name}`);
      loadData();
    } else {
      setStatusMsg(`Error: ${data?.error}`);
    }
  };

  const handleApproveTransfer = async (orderRef: string, expectedNgn: number) => {
    const res = await fetch('/api/commerce/orders', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        action: 'approve_manual_transfer',
        orderReference: orderRef,
        verifiedAmountNgn: expectedNgn,
      }),
    });
    const data = await res.json();
    if (data?.success) {
      setStatusMsg(`Approved Moniepoint transfer for ${orderRef}`);
      loadData();
    } else {
      setStatusMsg(`Error: ${data?.error}`);
    }
  };

  const handleUpdateEnquiry = async (
    id: string,
    status: LeadPipelineStatus,
    followUpNotes?: string
  ) => {
    const res = await fetch('/api/commerce/enquiries', {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ id, status, followUpNotes }),
    });
    const data = await res.json();
    if (data?.success) {
      setStatusMsg(`Enquiry ${id} updated to ${status}`);
      loadData();
    } else {
      setStatusMsg(`Error: ${data?.error}`);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/commerce/portfolio', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        title: portTitle,
        category: portCat,
        projectType: portType,
        liveUrl: portUrl,
        description: portDesc,
      }),
    });
    const data = await res.json();
    if (data?.success) {
      setStatusMsg(`Added portfolio entry: ${portTitle}`);
      setPortTitle('');
      setPortCat('');
      setPortUrl('');
      setPortDesc('');
      loadData();
    } else {
      setStatusMsg(`Error: ${data?.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
            <span>Bethelmind Commercial, Leads &amp; Pricing Desk</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Lead Pipeline, Flexible Pricing Manager, Campaign ROAS Analytics &amp; Server Payment Verification
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="password"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="Admin Token (if not logged in)"
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs"
          />
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#d4af37] text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-slate-900 border border-[#d4af37]/40 text-xs text-[#d4af37]">
          {statusMsg}
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Verified Revenue</div>
            <div className="text-xl font-black text-emerald-400">
              ₦{summary.totalRevenueNgn?.toLocaleString()}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Enquiries / Paid Orders</div>
            <div className="text-xl font-black text-white">
              {enquiries.length} / {summary.paidOrdersCount}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Pending Manual Transfers</div>
            <div className="text-xl font-black text-amber-400">{summary.pendingManualCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Active Projects / Exceptions</div>
            <div className="text-xl font-black text-white">
              {summary.activeProjectsCount} /{' '}
              <span className="text-rose-400">{summary.openExceptionsCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Central Advertising, Campaign Source & ROAS Dashboard */}
      {salesMetrics && (
        <section className="space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">
                Campaign Attribution, Acquisition Cost &amp; ROAS Dashboard
              </h2>
              <p className="text-xs text-slate-400">
                WhatsApp clicks are tracked separately and never counted as completed sales.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <select
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
              >
                <option value="all">All Businesses</option>
                <option value="business_solutions">Business Solutions</option>
                <option value="bethelmind_foods">Bethelmind Foods</option>
                <option value="academic_research">Academic Research</option>
              </select>
              <select
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
              >
                <option value="all">All Campaigns</option>
                {(salesMetrics.campaigns || []).map((c: string) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400">Page Views</div>
              <div className="text-lg font-black text-white">{salesMetrics.visitors}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400">WhatsApp Clicks (Non-Sale)</div>
              <div className="text-lg font-black text-emerald-400">
                {salesMetrics.whatsappEnquiries}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400">Enquiries / Qualified</div>
              <div className="text-lg font-black text-white">
                {salesMetrics.formLeads} / {salesMetrics.qualifiedLeads}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400">Confirmed Paid Orders</div>
              <div className="text-lg font-black text-emerald-400">
                {salesMetrics.confirmedPayments}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400">Revenue / Ad Spend</div>
              <div className="text-sm font-black text-[#d4af37]">
                ₦{salesMetrics.revenueNgn?.toLocaleString()} / ₦
                {salesMetrics.adSpendNgn?.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                CAC: ₦{salesMetrics.costPerPayingCustomerNgn?.toLocaleString()} &bull; ROAS:{' '}
                {salesMetrics.roas}x
              </div>
            </div>
          </div>

          {Array.isArray(salesMetrics.campaignBreakdown) &&
            salesMetrics.campaignBreakdown.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Campaign</th>
                      <th className="p-2.5">Enquiries</th>
                      <th className="p-2.5">Qualified</th>
                      <th className="p-2.5">Paid Orders</th>
                      <th className="p-2.5">Revenue</th>
                      <th className="p-2.5">Ad Spend</th>
                      <th className="p-2.5">CAC</th>
                      <th className="p-2.5">ROAS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {salesMetrics.campaignBreakdown.map((row: any) => (
                      <tr key={row.campaign}>
                        <td className="p-2.5 font-bold text-white">{row.campaign}</td>
                        <td className="p-2.5">{row.enquiries}</td>
                        <td className="p-2.5">{row.qualifiedLeads}</td>
                        <td className="p-2.5 text-emerald-400 font-bold">{row.paidOrders}</td>
                        <td className="p-2.5">₦{row.revenueNgn.toLocaleString()}</td>
                        <td className="p-2.5">₦{row.adSpendNgn.toLocaleString()}</td>
                        <td className="p-2.5">₦{row.acquisitionCostNgn.toLocaleString()}</td>
                        <td className="p-2.5 font-bold text-[#d4af37]">{row.roas}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          <form onSubmit={handleSaveAdSpend} className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <input
              type="text"
              placeholder="Campaign (e.g. search_websites)"
              value={adSpendCampaign}
              onChange={(e) => setAdSpendCampaign(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <input
              type="number"
              min={0}
              placeholder="Ad Spend (₦)"
              value={adSpendAmount}
              onChange={(e) => setAdSpendAmount(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white w-36"
            />
            <button type="submit" className="px-3.5 py-1.5 rounded-lg bg-[#d4af37] text-slate-950 font-bold">
              Log Ad Spend
            </button>
          </form>
        </section>
      )}

      {/* Incoming Enquiries & Lead Pipeline */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Incoming Enquiries &amp; Lead Pipeline ({enquiries.length})
          </h2>
          <a
            href="/api/commerce/enquiries?format=csv"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Export CSV</span>
          </a>
        </div>
        {enquiries.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            No enquiries recorded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-white">
                    {enq.name} {enq.businessName ? `(${enq.businessName})` : ''} &bull; {enq.whatsapp}
                    {enq.email ? ` • ${enq.email}` : ''}
                  </div>
                  <div className="text-slate-400">
                    Service: <strong className="text-[#d4af37]">{enq.selectedService}</strong>
                    {enq.selectedPackage ? ` — ${enq.selectedPackage}` : ''}
                    {enq.estimatedBudget ? ` • Budget: ${enq.estimatedBudget}` : ''}
                    {enq.preferredContactMethod ? ` • Via: ${enq.preferredContactMethod}` : ''}
                  </div>
                  {enq.message && <div className="text-slate-300">{enq.message}</div>}
                  <div className="text-[11px] text-slate-500">
                    Ref: {enq.id} &bull; Source: {enq.utmSource || enq.source}
                    {enq.utmCampaign ? ` (${enq.utmCampaign})` : ''} &bull;{' '}
                    {new Date(enq.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={enq.status}
                    onChange={(e) =>
                      handleUpdateEnquiry(enq.id, e.target.value as LeadPipelineStatus, enq.followUpNotes)
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    {!LEAD_STATUSES.includes(enq.status) && (
                      <option value={enq.status}>{enq.status}</option>
                    )}
                    {LEAD_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Flexible Pricing Management: Add & Edit Packages */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white">
            Flexible Pricing &amp; Service Package Manager ({products.length})
          </h2>
          <p className="text-xs text-slate-400">
            Add, edit, toggle availability, set promotional prices, configure deposits, or remove packages without editing code.
          </p>
        </div>

        {/* Create New Package */}
        <form
          onSubmit={handleCreatePackage}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
        >
          <div className="sm:col-span-3 font-bold text-[#d4af37]">+ Add New Service Package</div>
          <input
            required
            placeholder="Package Name *"
            value={newPkgName}
            onChange={(e) => setNewPkgName(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <select
            value={newPkgServiceKey}
            onChange={(e) => setNewPkgServiceKey(e.target.value as ServiceCategoryKey)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          >
            {SERVICE_KEY_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={newPkgPricingMode}
            onChange={(e) => setNewPkgPricingMode(e.target.value as PricingMode)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          >
            <option value="fixed">Fixed Price</option>
            <option value="starting_from">Starting From</option>
            <option value="custom_quote">Request a Custom Quote</option>
          </select>
          <input
            type="number"
            min={0}
            placeholder="Base Price (₦)"
            value={newPkgPrice}
            onChange={(e) => setNewPkgPrice(e.target.value)}
            disabled={newPkgPricingMode === 'custom_quote'}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white disabled:opacity-50"
          />
          <input
            type="number"
            min={0}
            placeholder="Promo Price (₦ optional)"
            value={newPkgPromoPrice}
            onChange={(e) => setNewPkgPromoPrice(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <input
            type="number"
            min={0}
            placeholder="Monthly Recurring (₦)"
            value={newPkgMonthly}
            onChange={(e) => setNewPkgMonthly(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <input
            type="number"
            min={1}
            max={100}
            placeholder="Deposit % (e.g. 60)"
            value={newPkgDeposit}
            onChange={(e) => setNewPkgDeposit(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <input
            placeholder="Turnaround (e.g. 3–5 business days)"
            value={newPkgTurnaround}
            onChange={(e) => setNewPkgTurnaround(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <input
            placeholder="Short description *"
            required
            value={newPkgDesc}
            onChange={(e) => setNewPkgDesc(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <textarea
            rows={2}
            placeholder="Deliverables (one per line)"
            value={newPkgDeliverables}
            onChange={(e) => setNewPkgDeliverables(e.target.value)}
            className="sm:col-span-3 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <button
            type="submit"
            className="sm:col-span-3 py-2.5 rounded-lg bg-[#d4af37] text-slate-950 font-bold inline-flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Service Package</span>
          </button>
        </form>

        {/* Existing Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p, idx) => (
            <div key={p.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase text-[#d4af37]">
                  {(p.serviceKey || p.division).replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-3">
                  <label className="text-xs flex items-center gap-1.5 text-slate-300">
                    <input
                      type="checkbox"
                      checked={p.active}
                      onChange={(e) => {
                        const next = [...products];
                        next[idx] = { ...p, active: e.target.checked };
                        setProducts(next);
                      }}
                    />
                    Available
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeletePackage(p.id, p.name)}
                    title="Delete Package"
                    className="text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={p.name}
                onChange={(e) => {
                  const next = [...products];
                  next[idx] = { ...p, name: e.target.value };
                  setProducts(next);
                }}
                className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 font-bold text-white text-sm"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Pricing Mode</label>
                  <select
                    value={p.pricingMode || 'fixed'}
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = { ...p, pricingMode: e.target.value as PricingMode };
                      setProducts(next);
                    }}
                    className="w-full px-2 py-1.5 rounded bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="starting_from">Starting From</option>
                    <option value="custom_quote">Custom Quote</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Base Price (₦)</label>
                  <input
                    type="number"
                    value={p.priceNgn}
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = { ...p, priceNgn: Number(e.target.value) };
                      setProducts(next);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Promo Price (₦)</label>
                  <input
                    type="number"
                    value={p.promoPriceNgn ?? ''}
                    placeholder="None"
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = {
                        ...p,
                        promoPriceNgn: e.target.value ? Number(e.target.value) : undefined,
                      };
                      setProducts(next);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Monthly Fee (₦)</label>
                  <input
                    type="number"
                    value={p.monthlyMaintenanceNgn}
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = { ...p, monthlyMaintenanceNgn: Number(e.target.value) };
                      setProducts(next);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Deposit %</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={p.depositPercent}
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = { ...p, depositPercent: Number(e.target.value) };
                      setProducts(next);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Promo Label</label>
                  <input
                    type="text"
                    value={p.promoLabel || ''}
                    placeholder="e.g. Launch Offer"
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = { ...p, promoLabel: e.target.value };
                      setProducts(next);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSavePrice(p)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Save Package</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Manager */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">
          Portfolio &amp; Demo Showcase Manager ({portfolio.length})
        </h2>
        <form
          onSubmit={handleAddPortfolio}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
        >
          <input
            required
            placeholder="Project Title"
            value={portTitle}
            onChange={(e) => setPortTitle(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <input
            required
            placeholder="Category (e.g. Solar, Healthcare)"
            value={portCat}
            onChange={(e) => setPortCat(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <select
            value={portType}
            onChange={(e) => setPortType(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          >
            <option value="completed_client">Completed Client Project</option>
            <option value="demonstration">Demonstration Project</option>
          </select>
          <input
            required
            placeholder="Live URL (e.g. https://... or /preview/...)"
            value={portUrl}
            onChange={(e) => setPortUrl(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <input
            required
            placeholder="Short description"
            value={portDesc}
            onChange={(e) => setPortDesc(e.target.value)}
            className="sm:col-span-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <button
            type="submit"
            className="sm:col-span-2 py-2.5 rounded-lg bg-[#d4af37] text-slate-950 font-bold inline-flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Portfolio Entry</span>
          </button>
        </form>
      </section>

      {/* Recent Orders & Manual Verification Queue */}
      {summary?.recentOrders?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white">
            Recent Orders &amp; Manual Verification Queue
          </h2>
          <div className="space-y-2">
            {summary.recentOrders.map((o: any) => (
              <div
                key={o.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white">
                    {o.orderReference} — {o.packageName}
                  </div>
                  <div className="text-slate-400">
                    Stage: {o.paymentStage} | Status:{' '}
                    <strong className="text-[#d4af37]">{o.paymentStatus}</strong> | Fulfilment:{' '}
                    {o.fulfilmentStatus}
                  </div>
                </div>
                {o.paymentStatus === 'pending_manual_verification' && (
                  <button
                    onClick={() =>
                      handleApproveTransfer(o.orderReference, o.depositAmountNgn || o.totalAmountNgn)
                    }
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      Confirm Bank Credit (₦
                      {(o.depositAmountNgn || o.totalAmountNgn).toLocaleString()})
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
