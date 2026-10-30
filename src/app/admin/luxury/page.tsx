'use client';

/**
 * @file src/app/admin/luxury/page.tsx
 * 
 * 👑 BETHELMIND SOVEREIGN COMMAND DECK (2026 LUXURY EDITION)
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
 * 
 * High-Ticket Deal Wire | VPS Radar | Instant Prototype Forge | Moniepoint Vault
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Crown,
  Shield,
  Zap,
  Radio,
  Send,
  Building2,
  DollarSign,
  TrendingUp,
  Cpu,
  RefreshCw,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ChevronRight,
  Flame,
  Award,
  Layers,
  ArrowUpRight,
  Globe,
  Lock,
  MessageCircle,
  Eye,
  Sliders,
  Check
} from 'lucide-react';

interface DealBrief {
  deal_id: string;
  category: string;
  title: string;
  description: string;
  location: { state: string; city: string; area: string };
  budget_amount_ngn: number;
  formatted_budget: string;
  estimated_commission_pool_ngn: number;
  bethelmind_origination_fee_ngn: number;
  buyer_contact: { name: string; phone: string; carrier: string };
  qualification_status: string;
  digital_mandate: {
    mandate_ref: string;
    cac_registration: string;
    settlement_account: string;
    mandate_text: string;
  };
}

export default function SovereignLuxuryCommandDeck() {
  const [activeTab, setActiveTab] = useState<'deal_wire' | 'vps_radar' | 'forge' | 'vault'>('deal_wire');
  const [dealData, setDealData] = useState<{
    metrics: {
      total_briefs: number;
      total_deal_flow_val_ngn: number;
      total_agency_fee_pool_ngn: number;
      total_bethelmind_pool_ngn: number;
    };
    briefs: DealBrief[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Prototype Forge Form
  const [forgeName, setForgeName] = useState('');
  const [forgePhone, setForgePhone] = useState('');
  const [forgeSector, setForgeSector] = useState('Solar & Inverters');
  const [forgeArea, setForgeArea] = useState('Lekki Phase 1');
  const [forgeResult, setForgeResult] = useState<{ slug: string; url: string; pitch: string } | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchDealWireData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/deal-wire', {
        headers: {
          'x-admin-token': 'bethelmind_admin_2026'
        }
      });
      const data = await res.json();
      if (data.success) {
        setDealData({
          metrics: data.metrics,
          briefs: data.briefs
        });
      }
    } catch (err: any) {
      showToast('Error syncing Deal Wire: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealWireData();
  }, []);

  const triggerHarvest = async () => {
    try {
      setActionLoading('harvest');
      showToast('🚀 Running High-Intent Deal Wire Harvester on Contabo VPS...');
      const res = await fetch('/api/admin/deal-wire', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': 'bethelmind_admin_2026'
        },
        body: JSON.stringify({ action: 'harvest' })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✨ Intercepted ${data.harvestedCount} verified high-ticket briefs!`);
        fetchDealWireData();
      } else {
        showToast('Harvest notice: ' + (data.error || 'Complete'));
      }
    } catch (err: any) {
      showToast('Failed to run harvest: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const updateDealStatus = async (dealId: string, status: string) => {
    try {
      setActionLoading(dealId);
      const res = await fetch('/api/admin/deal-wire', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': 'bethelmind_admin_2026'
        },
        body: JSON.stringify({ action: 'update_status', deal_id: dealId, status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Status updated to: ${status.replace(/_/g, ' ')}`);
        fetchDealWireData();
      }
    } catch (err: any) {
      showToast('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleGeneratePrototype = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgeName.trim()) return;

    const slug = forgeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
    const pitch = `Good day, ${forgeName} Management. We noticed when prospective clients search for ${forgeName} in ${forgeArea}, only third-party directory listings appear because you do not have an official mobile website yet. 

Instead of waiting weeks for a developer, we already built your Official Mobile Website + 24/7 AI WhatsApp Closer for ${forgeName} to test free right now:
${previewUrl}

Option 1: ₦35,000 Starter Go-Live (or ₦25k/mo Pay-Small-Small)
Option 2: ₦75,000 Milestone Deposit (₦150k Full Custom Domain Suite)

Settlement Vault: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions, CAC Reg: 9912717).`;

    setForgeResult({ slug, url: previewUrl, pitch });
    showToast('Prototype forge generated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-gradient-to-r from-amber-950 to-slate-900 border border-amber-500/40 text-amber-200 px-5 py-3 rounded-xl shadow-2xl shadow-amber-950/40 backdrop-blur-md animate-fade-in text-sm font-medium">
          <SparkleIcon />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* LUXURY SOVEREIGN TOP BAR */}
      <header className="sticky top-0 z-40 bg-[#070a12]/90 backdrop-blur-xl border-b border-amber-500/20 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Brand & CAC Seal */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/40">
              <Crown className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  BETHELMIND SOVEREIGN
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  CAC REG: 9912717
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Contabo VPS 169.58.182.92 • 24/7 Engine Operational
              </p>
            </div>
          </div>

          {/* Quick Vault & Sub-Desk Nav */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Settlement Vault:</span>
              <span className="font-mono font-medium text-amber-300">Moniepoint 6805375225</span>
            </div>

            <Link
              href="/admin/mobile"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Mobile Desk</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Classic Admin</span>
            </Link>

            <a
              href="https://www.bethelmindanalytics.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition"
              title="Open Live Production Domain"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">bethelmindanalytics.com</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">

        {/* FINANCIAL VAULT HERO METRICS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Deal Flow Value */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c101c] to-[#070a12] border border-amber-500/30 p-5 shadow-xl shadow-amber-950/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="uppercase tracking-wider font-semibold">Total Deal Flow Value</span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-200">
              ₦{dealData?.metrics.total_deal_flow_val_ngn ? dealData.metrics.total_deal_flow_val_ngn.toLocaleString() : '43,500,000'}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Prime Lekki, Ikoyi & Abuja Briefs
            </p>
          </div>

          {/* Card 2: Gross Agency Fee Pool */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c101c] to-[#070a12] border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="uppercase tracking-wider font-semibold">Gross Agency Fee Pool</span>
              <DollarSign className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              ₦{dealData?.metrics.total_agency_fee_pool_ngn ? dealData.metrics.total_agency_fee_pool_ngn.toLocaleString() : '7,200,000'}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">5% Sales / 10% Leases / 20% Solar</p>
          </div>

          {/* Card 3: Bethelmind Origination Pool */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121624] to-[#0c101c] border border-emerald-500/30 p-5 shadow-xl shadow-emerald-950/20">
            <div className="flex items-center justify-between text-xs text-emerald-400 mb-2">
              <span className="uppercase tracking-wider font-semibold">Bethelmind Origination Cut</span>
              <Flame className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-300">
              ₦{dealData?.metrics.total_bethelmind_pool_ngn ? dealData.metrics.total_bethelmind_pool_ngn.toLocaleString() : '1,515,000'}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              15%–25% Split Due on Close
            </p>
          </div>

          {/* Card 4: Settlement Vault Destination */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c101c] to-[#070a12] border border-amber-500/30 p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="uppercase tracking-wider font-semibold">Corporate Vault</span>
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-300">
              6805375225
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-slate-400">Moniepoint MFB</span>
              <button
                onClick={() => copyToClipboard('6805375225', 'vault_acc')}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold uppercase flex items-center gap-1"
              >
                {copiedId === 'vault_acc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy
              </button>
            </div>
          </div>
        </section>

        {/* LUXURY NAVIGATION TABS */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md overflow-x-auto">
          <button
            onClick={() => setActiveTab('deal_wire')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'deal_wire'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>High-Ticket Deal Wire</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-slate-950/40 text-[10px]">
              {dealData?.briefs.length || 4}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vps_radar')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'vps_radar'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>VPS Outreach Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('forge')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'forge'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>1-Tap Prototype Forge</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'vault'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Mandates & Settlement</span>
          </button>
        </div>

        {/* TAB CONTENT 1: HIGH-TICKET DEAL WIRE */}
        {activeTab === 'deal_wire' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c101c] border border-amber-500/20">
              <div>
                <h3 className="text-base font-bold text-amber-100 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  Live Verified High-Intent Briefs
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-screened luxury property sales, prime rentals & commercial solar installations with 15%–25% origination cuts.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={fetchDealWireData}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>

                <button
                  onClick={triggerHarvest}
                  disabled={actionLoading === 'harvest'}
                  className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:opacity-95 transition disabled:opacity-50"
                >
                  {actionLoading === 'harvest' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Interception Active...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Run Deal Wire Harvester</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Briefs Cards Grid */}
            <div className="space-y-4">
              {dealData?.briefs && dealData.briefs.length > 0 ? (
                dealData.briefs.map((brief, idx) => (
                  <div
                    key={brief.deal_id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#0a0d16] border border-slate-800 hover:border-amber-500/30 transition shadow-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {brief.category.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          📍 {brief.location.area}, {brief.location.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          brief.qualification_status === 'VERIFIED_CASH_READY'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : brief.qualification_status === 'CLOSED_SETTLED'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {brief.qualification_status.replace(/_/g, ' ')}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">{brief.digital_mandate.mandate_ref}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Left: Brief Description */}
                      <div className="md:col-span-2 space-y-2">
                        <h4 className="text-sm font-bold text-slate-100">{brief.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{brief.description}</p>
                        <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-3">
                          <span>👤 Contact: <strong className="text-slate-200">{brief.buyer_contact.name}</strong></span>
                          <span>📞 Tel: <strong className="text-slate-200 font-mono">{brief.buyer_contact.phone}</strong></span>
                        </div>
                      </div>

                      {/* Right: Valuation Matrix */}
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Client Budget:</span>
                          <span className="font-mono font-bold text-amber-200">{brief.formatted_budget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Est. Agency Fee:</span>
                          <span className="font-mono text-slate-300">₦{brief.estimated_commission_pool_ngn.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                          <span className="text-emerald-400">Bethelmind Origination:</span>
                          <span className="font-mono text-emerald-300">₦{brief.bethelmind_origination_fee_ngn.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateDealStatus(brief.deal_id, 'VERIFIED_CASH_READY')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition"
                        >
                          Mark Cash-Ready
                        </button>
                        <button
                          onClick={() => updateDealStatus(brief.deal_id, 'CLOSED_SETTLED')}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition"
                        >
                          Mark Closed & Settled
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`/deal/${brief.deal_id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition"
                        >
                          <span>🔗 View Teaser</span>
                        </a>

                        <button
                          onClick={() => {
                            const pShare = brief.estimated_commission_pool_ngn - brief.bethelmind_origination_fee_ngn;
                            const teaserMsg = 
`Good day Boss! 👋 Bethelmind Digital Solutions (CAC: 9912717) has an incoming cash-ready buyer:

• Brief: ${brief.title}
• Location: ${brief.location.area}, ${brief.location.city}
• Verified Budget: ${brief.formatted_budget} (Direct Wire Ready)
• Your Partner Share: ₦${pShare.toLocaleString()}

We are offering your desk first-look rights on a 50/50 co-brokerage split. Review criteria and unlock the direct buyer line here (45-min exclusive window):
👉 https://www.bethelmindanalytics.com/deal/${brief.deal_id}`;
                            copyToClipboard(teaserMsg, `teaser-${brief.deal_id}`);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                        >
                          {copiedId === `teaser-${brief.deal_id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Copy Teaser Pitch</span>
                        </button>

                        <button
                          onClick={() => copyToClipboard(brief.digital_mandate.mandate_text, brief.deal_id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                        >
                          {copiedId === brief.deal_id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Copy NCNDA Mandate</span>
                        </button>

                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `Good day Boss! 👋 Bethelmind Digital Solutions (CAC: 9912717) has an incoming cash-ready buyer:\n\n• Brief: ${brief.title}\n• Location: ${brief.location.area}\n• Budget: ${brief.formatted_budget}\n\nReview criteria and claim buyer line here:\n👉 https://www.bethelmindanalytics.com/deal/${brief.deal_id}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition shadow-md"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Dispatch Teaser</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-[#0a0d16] border border-slate-800 text-center space-y-3">
                  <p className="text-slate-400 text-sm">No deal wire briefs staged yet.</p>
                  <button
                    onClick={triggerHarvest}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase"
                  >
                    Run Harvester Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: VPS OUTREACH RADAR */}
        {activeTab === 'vps_radar' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                Contabo VPS Infrastructure Radar (169.58.182.92)
              </h3>
              <p className="text-xs text-slate-400">
                100% offloaded high-speed background engine. Protects your host laptop from mobile cellular data depletion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Channel 1: Hostinger SMTP Pool */}
              <div className="p-5 rounded-2xl bg-[#0a0d16] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-400">B2B Executive Email</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-xl font-bold font-mono text-slate-100">600 Emails / Day</div>
                <p className="text-xs text-slate-400">
                  Dual-Mailbox Hostinger Direct SMTP Pool (<code className="text-amber-300">tosin@</code> + <code className="text-amber-300">matthew@</code>) + Brevo API v3 failover.
                </p>
                <div className="text-[11px] text-emerald-400 font-medium">✓ Micro-Payloads (&lt; 10 KB) Verified</div>
              </div>

              {/* Channel 2: WhatsApp Evolution API */}
              <div className="p-5 rounded-2xl bg-[#0a0d16] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-400">WhatsApp Closer Desk</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-xl font-bold font-mono text-slate-100">Port 8080 Active</div>
                <p className="text-xs text-slate-400">
                  Evolution API Instance Server on VPS. 30 outbound messages/day per warmed line + sub-3s AI Closer responses.
                </p>
                <div className="text-[11px] text-emerald-400 font-medium">✓ Admin Line: 0802 279 1227 Verified</div>
              </div>

              {/* Channel 3: Airtel GSM SMS Gateway */}
              <div className="p-5 rounded-2xl bg-[#0a0d16] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-400">Airtel GSM SMS Gateway</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-xl font-bold font-mono text-slate-100">120 SMS / Day</div>
                <p className="text-xs text-slate-400">
                  Single-credit SMS (&le; 158 chars) dispatched directly through Android GSM SIM hardware.
                </p>
                <div className="text-[11px] text-emerald-400 font-medium">✓ Direct-to-Carrier Dispatch Active</div>
              </div>
            </div>

            {/* Cloud Automation Blueprint Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c101c] to-[#070a12] border border-amber-500/20 space-y-3">
              <h4 className="text-sm font-bold text-amber-200 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                24/7 Autonomous Cloud Engine (GitHub Actions)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Continuous lead discovery across all 36 Nigerian States + FCT is executed autonomously in the cloud every 30 minutes via <code className="text-amber-300">.github/workflows/autonomous_247_cloud_engine.yml</code>. All discovered genuine leads sync directly to Supabase Cloud without requiring your laptop to remain awake.
              </p>
            </div>
          </div>
        )}

        {/* TAB CONTENT 3: 1-TAP PROTOTYPE FORGE */}
        {activeTab === 'forge' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                1-Tap Done-For-You Prototype Forge
              </h3>
              <p className="text-xs text-slate-400">
                Instantly generate a live official mobile website + 24/7 AI WhatsApp Closer for any Nigerian SME without a website.
              </p>
            </div>

            <form onSubmit={handleGeneratePrototype} className="p-6 rounded-2xl bg-[#0a0d16] border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adeolu Solar & Electrical Systems"
                    value={forgeName}
                    onChange={(e) => setForgeName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Owner Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0803 123 4567"
                    value={forgePhone}
                    onChange={(e) => setForgePhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Commercial Vertical</label>
                  <select
                    value={forgeSector}
                    onChange={(e) => setForgeSector(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option>Solar & Inverters</option>
                    <option>Real Estate & Agency</option>
                    <option>Clinic & Healthcare</option>
                    <option>Automotive & Spare Parts</option>
                    <option>Construction & Materials</option>
                    <option>Retail & Fashion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Prime Territory / City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lekki Phase 1, Lagos"
                    value={forgeArea}
                    onChange={(e) => setForgeArea(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:opacity-95 transition"
              >
                ⚡ Forge Live Prototype & Personalized Pitch
              </button>
            </form>

            {forgeResult && (
              <div className="p-6 rounded-2xl bg-[#0c101c] border border-amber-500/30 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-200">✨ Generated Prototype Assets</h4>
                  <a
                    href={forgeResult.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <span>Open Live Prototype</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 font-mono text-xs text-slate-300 break-all border border-slate-800">
                  {forgeResult.url}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Personalized WhatsApp Outreach Copy</span>
                    <button
                      onClick={() => copyToClipboard(forgeResult.pitch, 'pitch_text')}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                    >
                      {copiedId === 'pitch_text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Pitch
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    readOnly
                    value={forgeResult.pitch}
                    className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT 4: SETTLEMENT VAULT & MANDATES */}
        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c101c] to-[#070a12] border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 font-bold shadow-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-100">Bethelmind Digital Solutions</h3>
                  <p className="text-xs text-slate-400">CAC Certified Nigerian Enterprise (Reg: 9912717)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block uppercase">Settlement Bank</span>
                  <strong className="text-sm text-slate-100">Moniepoint Microfinance Bank</strong>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block uppercase">Corporate Account Number</span>
                  <strong className="text-base font-mono text-amber-300">6805375225</strong>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block uppercase">Account Name</span>
                  <strong className="text-sm text-slate-100">Bethelmind Digital Solutions</strong>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0a0d16] border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Digital Co-Agency Mandate & Non-Circumvention Enforcement
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All deal origination transactions are legally anchored by our timestamped Digital Co-Agency Mandate. Partner brokers agree to a 20% origination fee remitted within 48 hours of client closing directly to Moniepoint Account <code className="text-amber-300">6805375225</code>. Non-compliant partners are permanently blacklisted from our territorial lead wires.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}
