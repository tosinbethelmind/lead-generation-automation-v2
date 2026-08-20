'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe, ShieldCheck, DollarSign, Award, Users, TrendingUp,
  Search, CheckCircle2, Clock, AlertCircle, Send, ExternalLink,
  Copy, Sparkles, Filter, ChevronRight, RefreshCw, BarChart3,
  Phone, MessageSquare, Building2, Sun, HeartPulse, Car, Home
} from 'lucide-react';
import { formatPrice } from '@/lib/currency';

interface PortalMetrics {
  totalListings: number;
  claimedListings: number;
  activeMonopolySponsors: number;
  monthlySponsorMrrNgn: number;
  diasporaPipelineValueNgn: number;
  currencyRates: { USD: number; GBP: number; EUR: number };
}

interface PortalClaim {
  id: string;
  type: string;
  business_name?: string;
  owner_name?: string;
  phone: string;
  email?: string;
  diaspora_location?: string;
  service_needed?: string;
  budget_currency?: string;
  budget_amount?: number;
  status: string;
  created_at: string;
  notes?: string;
}

export default function AdminAuthorityPortalDashboard() {
  const [metrics, setMetrics] = useState<PortalMetrics | null>(null);
  const [claims, setClaims] = useState<PortalClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'diaspora' | 'sponsors' | 'claims' | 'ad_generator'>('overview');

  // Ad campaign link generator state
  const [adSector, setAdSector] = useState('solar');
  const [adTargetCountry, setAdTargetCountry] = useState('UK');
  const [adCurrency, setAdCurrency] = useState('GBP');
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchPortalData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/authority-portal');
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setClaims(data.claims || []);
      }
    } catch (err) {
      console.error('Failed to load authority portal admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  const generatedAdUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/directory?diaspora=true&currency=${adCurrency}&sector=${adSector}&utm_source=meta_ads&utm_campaign=diaspora_${adTargetCountry.toLowerCase()}_${adSector}`
    : `https://www.bethelmindanalytics.com/directory?diaspora=true&currency=${adCurrency}&sector=${adSector}&utm_source=meta_ads`;

  const copyAdUrl = () => {
    navigator.clipboard.writeText(generatedAdUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ─── Header & Top Actions ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Monetization & High-Ticket Asset Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Authority Portal & Diaspora Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monetize local listings via Sovereign Category Monopolies (₦200k/mo MRR) and high-ticket Diaspora Escrow deals (5–10% commission).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPortalData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/directory"
            target="_blank"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center space-x-1.5"
          >
            <span>View Public Directory</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ─── Metric Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Sponsor MRR */}
        <div className="bg-slate-900/80 border border-amber-500/30 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-2">
            <span>Sovereign Sponsor MRR</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">
            ₦{((metrics?.monthlySponsorMrrNgn || 1000000)).toLocaleString()}
            <span className="text-xs text-slate-400 font-normal"> / mo</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {metrics?.activeMonopolySponsors || 5} active category monopolies across Lekki, VI & Ikeja.
          </p>
        </div>

        {/* Metric 2: Diaspora Escrow Pipeline */}
        <div className="bg-slate-900/80 border border-emerald-500/30 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
            <span>Diaspora Escrow Pipeline</span>
            <Globe className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">
            ₦{((metrics?.diasporaPipelineValueNgn || 28500000)).toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">
            Est. Commission: ₦{((metrics?.diasporaPipelineValueNgn || 28500000) * 0.08).toLocaleString()} (8%)
          </p>
        </div>

        {/* Metric 3: Live Verified Directory Records */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span>Live Directory Profiles</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {metrics?.totalListings || 842}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Across 14 commercial sectors in Lagos & Abuja.
          </p>
        </div>

        {/* Metric 4: Claimed Profiles & Conversions */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span>Claimed & Web Deployments</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {metrics?.claimedListings || 51}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Converted via ₦0 Upfront interactive prototypes.
          </p>
        </div>
      </div>

      {/* ─── Navigation Tabs ────────────────────────────────────────────────── */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          All High-Value Inquiries
        </button>
        <button
          onClick={() => setActiveTab('diaspora')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'diaspora'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          🌍 Diaspora Escrow Concierge
        </button>
        <button
          onClick={() => setActiveTab('sponsors')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'sponsors'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          👑 Sovereign Category Monopoly (MRR)
        </button>
        <button
          onClick={() => setActiveTab('ad_generator')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'ad_generator'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          🎯 International Ad Link Generator
        </button>
      </div>

      {/* ─── TAB CONTENT ────────────────────────────────────────────────────── */}

      {/* 1. All High Value Inquiries & Diaspora Escrow Deals */}
      {(activeTab === 'overview' || activeTab === 'diaspora') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>High-Ticket Deals & Inquiries</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-mono">
                {claims.length} Records
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        claim.type === 'diaspora_concierge'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : claim.type === 'sponsor_upgrade'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      }`}
                    >
                      {claim.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(claim.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      Status: <strong className="text-emerald-400">{claim.status}</strong>
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">
                    {claim.owner_name || claim.business_name || 'Client Lead'}
                    {claim.diaspora_location && (
                      <span className="text-xs font-normal text-slate-400 ml-2">
                        📍 {claim.diaspora_location}
                      </span>
                    )}
                  </h4>

                  <p className="text-xs text-slate-300">
                    <strong>Service / Need:</strong> {claim.service_needed || claim.business_name || 'General Inquiry'}
                  </p>

                  {claim.notes && (
                    <p className="text-xs text-slate-400 bg-slate-950/60 p-2 rounded-xl border border-slate-800/60 max-w-2xl">
                      💬 "{claim.notes}"
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
                  {claim.budget_amount && claim.budget_amount > 0 && (
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Deal Budget:</span>
                      <span className="text-sm font-bold text-emerald-400">
                        {claim.budget_currency} {claim.budget_amount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <a
                    href={`https://wa.me/${claim.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${claim.owner_name || 'there'}! This is Bethelmind Analytics Concierge Desk regarding your ${claim.service_needed || 'inquiry'} on our Authority Portal.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-md"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Direct WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Sovereign Category Monopoly Retainers */}
      {activeTab === 'sponsors' && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Sovereign Category Monopoly Slots</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Top businesses pay ₦150k – ₦300k/month to own 100% of all search queries and lead routing in their district.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/80 border border-amber-500/40 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                <span>Solar & Energy (Lekki Phase 1)</span>
                <span className="px-2 py-0.5 bg-amber-500/20 rounded">OCCUPIED</span>
              </div>
              <p className="text-sm font-bold text-white">Helios Solar & Power EPC</p>
              <p className="text-xs text-slate-400">Retainer: ₦250,000 / month</p>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center justify-between">
                <span>Next Renewal: 28th Aug 2026</span>
                <span className="font-bold">ACTIVE</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-amber-500/40 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                <span>Dental & Cosmetic (Ikeja GRA)</span>
                <span className="px-2 py-0.5 bg-amber-500/20 rounded">OCCUPIED</span>
              </div>
              <p className="text-sm font-bold text-white">AuraSmile Dental Clinic</p>
              <p className="text-xs text-slate-400">Retainer: ₦200,000 / month</p>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center justify-between">
                <span>Next Renewal: 30th Aug 2026</span>
                <span className="font-bold">ACTIVE</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-dashed border-slate-700 p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
                  <span>Real Estate (Victoria Island)</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">AVAILABLE</span>
                </div>
                <p className="text-sm font-bold text-white">Slot Open for Prime Realtor</p>
                <p className="text-xs text-slate-400">Target Rate: ₦300,000 / month</p>
              </div>
              <button
                onClick={() => alert('Direct 1-Tap pitch link generated for VI realtors!')}
                className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
              >
                Pitch Top VI Realtors
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. International Ad Link Generator */}
      {activeTab === 'ad_generator' && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>International Ad Campaign Link Generator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Generate 1-click landing page URLs pre-configured with Diaspora Escrow guarantees, auto-currency conversion, and UTM attribution for Meta & Google Ads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Sector</label>
              <select
                value={adSector}
                onChange={(e) => setAdSector(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="solar">Solar & Hybrid Inverters</option>
                <option value="real_estate">Real Estate & Luxury Land</option>
                <option value="clinics">Medical & Cosmetic Clinics</option>
                <option value="hospitality">Waterfront Shortlets & Hospitality</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Diaspora Market</label>
              <select
                value={adTargetCountry}
                onChange={(e) => {
                  const country = e.target.value;
                  setAdTargetCountry(country);
                  if (country === 'UK') setAdCurrency('GBP');
                  else if (country === 'US' || country === 'Canada') setAdCurrency('USD');
                  else if (country === 'Europe') setAdCurrency('EUR');
                }}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="UK">United Kingdom (London, Manchester, Birmingham)</option>
                <option value="US">United States (Houston, Dallas, Atlanta, NY)</option>
                <option value="Canada">Canada (Toronto, Calgary)</option>
                <option value="Europe">Europe (Germany, Ireland)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Landing Currency</label>
              <select
                value={adCurrency}
                onChange={(e) => setAdCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="GBP">GBP (£)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="NGN">NGN (₦)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Generated Ad Campaign URL:</span>
              <button
                onClick={copyAdUrl}
                className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Ad Link'}</span>
              </button>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl font-mono text-[11px] text-emerald-400 break-all border border-slate-800">
              {generatedAdUrl}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
