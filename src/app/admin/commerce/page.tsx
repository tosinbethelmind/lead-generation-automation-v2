'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, RefreshCw, Save, ShieldCheck, Download, Plus } from 'lucide-react';
import type { CommercialProduct } from '@/lib/commerce/catalog';
import type { EnquiryRecord, LeadPipelineStatus, PortfolioEntry } from '@/lib/commerce/enquiries';

const LEAD_STATUSES: LeadPipelineStatus[] = [
  'NEW',
  'CONTACTED',
  'QUOTE SENT',
  'AWAITING PAYMENT',
  'PAID',
  'IN PROGRESS',
  'COMPLETED',
  'LOST',
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

  // Portfolio form
  const [portTitle, setPortTitle] = useState('');
  const [portCat, setPortCat] = useState('');
  const [portType, setPortType] = useState<'demonstration' | 'completed_client'>('completed_client');
  const [portUrl, setPortUrl] = useState('');
  const [portDesc, setPortDesc] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
      const [prodRes, ordRes, enqRes, portRes, analyticsRes] = await Promise.all([
        fetch('/api/commerce/products?includeInactive=true'),
        fetch('/api/commerce/orders', { headers }),
        fetch('/api/commerce/enquiries', { headers }),
        fetch('/api/commerce/portfolio'),
        fetch(`/api/commerce/analytics?businessDivision=${encodeURIComponent(divisionFilter)}&utmCampaign=${encodeURIComponent(campaignFilter)}`, { headers }),
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

  const authHeaders = (): Record<string, string> => ({
    'Content-Type': 'application/json',
    ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
  });

  const handleSavePrice = async (p: CommercialProduct) => {
    setStatusMsg(null);
    const res = await fetch('/api/commerce/products', {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({
        id: p.id,
        priceNgn: p.priceNgn,
        monthlyMaintenanceNgn: p.monthlyMaintenanceNgn,
        active: p.active,
      }),
    });
    const data = await res.json();
    setStatusMsg(data?.success ? `Updated ${p.name} (₦${p.priceNgn.toLocaleString()})` : `Error: ${data?.error}`);
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

  const handleUpdateEnquiry = async (id: string, status: LeadPipelineStatus, followUpNotes?: string) => {
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
            <span>Bethelmind Commercial, Leads &amp; Fulfilment Desk</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enquiries, Lead Pipeline, Portfolio, Editable 3-Division Catalog &amp; Moniepoint Verification
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
            <div className="text-xl font-black text-emerald-400">₦{summary.totalRevenueNgn?.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Enquiries / Paid Orders</div>
            <div className="text-xl font-black text-white">{enquiries.length} / {summary.paidOrdersCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Pending Manual Transfers</div>
            <div className="text-xl font-black text-amber-400">{summary.pendingManualCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Active Projects / Exceptions</div>
            <div className="text-xl font-black text-white">
              {summary.activeProjectsCount} / <span className="text-rose-400">{summary.openExceptionsCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Central Advertising & Sales Dashboard (Phase 4) */}
      {salesMetrics && (
        <section className="space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Central Advertising &amp; Sales Dashboard</h2>
              <p className="text-xs text-slate-400">Real tracked visitors, enquiries, orders, confirmed revenue, CPA &amp; ROAS</p>
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
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400">Visitors</div>
              <div className="text-lg font-black text-white">{salesMetrics.visitors}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400">WhatsApp Clicks</div>
              <div className="text-lg font-black text-emerald-400">{salesMetrics.whatsappEnquiries}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400">Form / Qualified Leads</div>
              <div className="text-lg font-black text-white">{salesMetrics.formLeads} / {salesMetrics.qualifiedLeads}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400">Confirmed Payments</div>
              <div className="text-lg font-black text-emerald-400">{salesMetrics.confirmedPayments}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400">Revenue / Ad Spend</div>
              <div className="text-sm font-black text-[#d4af37]">
                ₦{salesMetrics.revenueNgn?.toLocaleString()} / ₦{salesMetrics.adSpendNgn?.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                CPA: ₦{salesMetrics.costPerPayingCustomerNgn?.toLocaleString()} &bull; ROAS: {salesMetrics.roas}x
              </div>
            </div>
          </div>

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
          <h2 className="text-lg font-bold text-white">Incoming Enquiries &amp; Lead Status</h2>
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
                  </div>
                  <div className="text-slate-400">
                    Service: <strong className="text-[#d4af37]">{enq.selectedService}</strong>
                    {enq.selectedPackage ? ` — ${enq.selectedPackage}` : ''}
                    {enq.gclid ? ` • GCLID: ${enq.gclid.slice(0, 12)}...` : ''}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Ref: {enq.id} &bull; {new Date(enq.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={enq.status}
                    onChange={(e) => handleUpdateEnquiry(enq.id, e.target.value as LeadPipelineStatus, enq.followUpNotes)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    {LEAD_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Portfolio Manager */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">Portfolio &amp; Demo Showcase Manager ({portfolio.length})</h2>
        <form onSubmit={handleAddPortfolio} className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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

      {/* Editable Catalog */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">Editable 3-Division Product Catalog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p, idx) => (
            <div key={p.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#d4af37]">{p.division.replace(/_/g, ' ')}</span>
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
                  Active
                </label>
              </div>
              <div className="font-bold text-white text-sm">{p.name}</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
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
                  <label className="text-slate-400 block mb-1">Monthly Maint. (₦)</label>
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
              </div>
              <button
                onClick={() => handleSavePrice(p)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Save Changes</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Orders & Manual Verification Queue */}
      {summary?.recentOrders?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white">Recent Orders &amp; Manual Verification Queue</h2>
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
                    Stage: {o.paymentStage} | Status: <strong className="text-[#d4af37]">{o.paymentStatus}</strong> | Fulfilment: {o.fulfilmentStatus}
                  </div>
                </div>
                {o.paymentStatus === 'pending_manual_verification' && (
                  <button
                    onClick={() => handleApproveTransfer(o.orderReference, o.depositAmountNgn || o.totalAmountNgn)}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Bank Credit (₦{(o.depositAmountNgn || o.totalAmountNgn).toLocaleString()})</span>
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
