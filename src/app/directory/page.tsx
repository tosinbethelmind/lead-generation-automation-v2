'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, ShieldCheck, Star, Globe, MapPin, Phone, MessageSquare,
  Zap, Award, CheckCircle2, ChevronRight, Filter, DollarSign,
  ArrowUpRight, Building2, Sun, HeartPulse, Car, Home, Sparkles,
  ExternalLink, Lock, Check, Send, AlertCircle, X
} from 'lucide-react';
import { SupportedCurrency, CURRENCY_SYMBOLS, formatPrice } from '@/lib/currency';

interface DirectoryListing {
  id: string;
  name: string;
  slug: string;
  category: string;
  sectorSlug: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  previewUrl: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  isClaimed: boolean;
  isFeaturedSponsor: boolean;
  isExclusiveCategorySponsor: boolean;
  startingPriceNgn: number;
  diasporaEscrowEligible: boolean;
  tagline: string;
  features: string[];
}

const SECTORS = [
  { id: 'all', name: 'All Sectors', icon: Sparkles },
  { id: 'solar', name: 'Solar & Inverters', icon: Sun },
  { id: 'real_estate', name: 'Real Estate & Land', icon: Building2 },
  { id: 'clinics', name: 'Medical & Dental', icon: HeartPulse },
  { id: 'spa', name: 'Aesthetic Spas', icon: Sparkles },
  { id: 'auto', name: 'Luxury Auto Care', icon: Car },
  { id: 'hospitality', name: 'Shortlets & Living', icon: Home },
];

const DISTRICTS = [
  'All Districts',
  'Lekki Phase 1',
  'Victoria Island',
  'Ikoyi / Banana Island',
  'Ikeja GRA',
  'Abuja Central',
  'UK / London Diaspora',
  'US / Houston Diaspora',
];

export default function PublicAuthorityDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [currency, setCurrency] = useState<SupportedCurrency>('NGN');
  const [diasporaMode, setDiasporaMode] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [listings, setListings] = useState<DirectoryListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedListingForClaim, setSelectedListingForClaim] = useState<DirectoryListing | null>(null);
  const [claimForm, setClaimForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  // Diaspora Concierge Modal
  const [conciergeModalOpen, setConciergeModalOpen] = useState(false);
  const [conciergeForm, setConciergeForm] = useState({
    name: '',
    phone: '',
    email: '',
    diasporaLocation: 'London, UK',
    serviceNeeded: '10kVA Solar Installation & Escrow',
    budgetAmount: 5000,
    notes: '',
  });
  const [conciergeSubmitted, setConciergeSubmitted] = useState(false);

  useEffect(() => {
    // Detect URL query parameters for Ad Campaigns (e.g. ?diaspora=true&currency=GBP)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('diaspora') === 'true') {
        setDiasporaMode(true);
      }
      const urlCur = params.get('currency')?.toUpperCase() as SupportedCurrency;
      if (urlCur && ['NGN', 'USD', 'GBP', 'EUR'].includes(urlCur)) {
        setCurrency(urlCur);
      }
      if (params.get('sector')) {
        setSelectedSector(params.get('sector')!.toLowerCase());
      }
    }
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const distParam = selectedDistrict === 'All Districts' ? '' : selectedDistrict;
      const res = await fetch(
        `/api/directory/search?q=${encodeURIComponent(searchQuery)}&sector=${selectedSector}&location=${encodeURIComponent(distParam)}&verifiedOnly=${verifiedOnly}&diaspora=${diasporaMode}&currency=${currency}`
      );
      const data = await res.json();
      if (data.success) {
        setListings(data.listings);
      }
    } catch (err) {
      console.error('Failed to fetch directory listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [searchQuery, selectedSector, selectedDistrict, verifiedOnly, diasporaMode, currency]);

  const handleOpenClaim = (listing: DirectoryListing) => {
    setSelectedListingForClaim(listing);
    setClaimForm({ name: '', phone: '', email: '', notes: '' });
    setClaimSubmitted(false);
    setClaimModalOpen(true);
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimForm.phone || !claimForm.name) return;
    try {
      await fetch('/api/directory/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'claim_listing',
          listingId: selectedListingForClaim?.id,
          businessName: selectedListingForClaim?.name,
          ownerName: claimForm.name,
          phone: claimForm.phone,
          email: claimForm.email,
          notes: claimForm.notes,
        }),
      });
      setClaimSubmitted(true);
    } catch (err) {
      console.error('Claim error:', err);
    }
  };

  const handleConciergeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conciergeForm.phone || !conciergeForm.name) return;
    try {
      await fetch('/api/directory/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'diaspora_concierge',
          ownerName: conciergeForm.name,
          phone: conciergeForm.phone,
          email: conciergeForm.email,
          diasporaLocation: conciergeForm.diasporaLocation,
          serviceNeeded: conciergeForm.serviceNeeded,
          budgetCurrency: currency,
          budgetAmount: Number(conciergeForm.budgetAmount),
          notes: conciergeForm.notes,
        }),
      });
      setConciergeSubmitted(true);
    } catch (err) {
      console.error('Concierge error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      {/* ─── Top Utility Bar & Currency Switcher ──────────────────────────────── */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                Bethelmind <span className="text-emerald-400">Authority Portal</span>
              </span>
              <span className="hidden sm:block text-[11px] text-slate-400 font-medium">
                Verified B2B Search & Diaspora Escrow Network
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/70 rounded-xl p-1 text-xs font-semibold">
              {(['NGN', 'USD', 'GBP', 'EUR'] as SupportedCurrency[]).map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    currency === cur
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {CURRENCY_SYMBOLS[cur]} {cur}
                </button>
              ))}
            </div>

            {/* Diaspora Mode Toggle */}
            <button
              onClick={() => setDiasporaMode(!diasporaMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                diasporaMode
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-lg shadow-amber-900/30'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Diaspora Shield:</span>
              <span>{diasporaMode ? 'Active (UK/US)' : 'Domestic'}</span>
            </button>

            {/* Digital Store Link */}
            <Link
              href="/store"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-900/30 hover:opacity-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Asset Store</span>
            </Link>

            {/* Admin Desk Link */}
            <Link
              href="/admin/authority-portal"
              className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:border-emerald-500/50 transition-all"
            >
              <span>Admin Desk</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Diaspora Shield Banner (If Activated) ──────────────────────────── */}
      {diasporaMode && (
        <div className="bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-slate-900 border-b border-amber-600/30 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-amber-200">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Diaspora Trust Guarantee:</strong> All projects & contractors booked through this portal include <strong>Milestone Video Audits</strong> and <strong>100% Escrow Protection</strong> managed by Bethelmind Analytics.
              </span>
            </div>
            <button
              onClick={() => setConciergeModalOpen(true)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all shadow-md shrink-0 flex items-center gap-1"
            >
              <span>Book Diaspora Concierge</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Hero Search Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Over 800+ Vetted Lagos & Abuja Commercial Providers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Find & Hire <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Verified Providers</span> with Instant 0ms WhatsApp Desks
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Browse verified clinics, solar EPCs, luxury real estate developers, and auto engineers. Instant interactive quote calculations and guaranteed direct communication.
          </p>

          {/* Search Inputs Bar */}
          <div className="bg-slate-900/90 border border-slate-700/80 p-2.5 rounded-2xl shadow-2xl shadow-emerald-950/20 flex flex-col md:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search business name, category, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl pl-9 pr-8 py-2.5 text-xs font-medium focus:outline-none focus:border-emerald-500 appearance-none"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={fetchListings}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 shrink-0"
              >
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Sector Pills Filter ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {SECTORS.map((sector) => {
            const Icon = sector.icon;
            const isSelected = selectedSector === sector.id;
            return (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sector.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Listings Grid ──────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Authority Listings</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-mono font-bold">
                {listings.length} Results
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by verified customer reviews, 0ms WhatsApp availability, and Bethelmind audits.
            </p>
          </div>

          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
              verifiedOnly
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Only</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Listings Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
              Try adjusting your search terms or clearing sector filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSector('all');
                setSelectedDistrict('All Districts');
                setVerifiedOnly(false);
              }}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <div
                key={item.id}
                className={`relative rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group ${
                  item.isExclusiveCategorySponsor
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-amber-950/20 border-amber-500/40 shadow-xl shadow-amber-950/20 hover:border-amber-400'
                    : item.isFeaturedSponsor
                    ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-400/80 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Sponsor / Exclusive Badge */}
                {item.isExclusiveCategorySponsor ? (
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider py-1 px-3 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" /> #1 Exclusive Sovereign Sponsor ({item.district})
                    </span>
                    <span>100% Guaranteed</span>
                  </div>
                ) : item.isFeaturedSponsor ? (
                  <div className="bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-[10px] font-bold py-0.5 px-3 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured Authority Partner
                    </span>
                    <span>Top Rated</span>
                  </div>
                ) : null}

                <div className="p-5 flex-1">
                  {/* Category & Verified Tag */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      {item.category}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{item.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({item.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Business Name */}
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mb-1">
                    {item.name}
                  </h3>

                  {/* Address */}
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-3 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{item.address}</span>
                  </p>

                  {/* Tagline / Value proposition */}
                  <p className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 mb-3 leading-relaxed">
                    {item.tagline}
                  </p>

                  {/* Features bullets */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-400 mb-4">
                    {item.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer & Action Buttons */}
                <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Starting from:</span>
                    <span className="font-bold text-white text-sm">
                      {formatPrice(item.startingPriceNgn, currency)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* 1-Tap WhatsApp Lead Action */}
                    <a
                      href={`https://wa.me/2348022791227?text=${encodeURIComponent(
                        `Hello Bethelmind Authority Desk! I am interested in booking / consulting with: ${item.name} (${item.category}, ${item.district}). Please connect me!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 shadow-md shadow-emerald-900/30"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Desk</span>
                    </a>

                    {/* Prototype Preview / Claim Listing Button */}
                    {item.isClaimed ? (
                      <a
                        href={item.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1 border border-slate-700 hover:border-slate-600"
                      >
                        <span>Live Preview</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    ) : (
                      <button
                        onClick={() => handleOpenClaim(item)}
                        className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Claim Listing</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ─── Profile Claim Modal ────────────────────────────────────────────── */}
      {claimModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setClaimModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {claimSubmitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Claim Request Received!</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
                  Our verification desk is preparing your custom 24/7 AI WhatsApp closer and interactive website deployment for <strong>{selectedListingForClaim?.name}</strong>.
                </p>
                <button
                  onClick={() => setClaimModalOpen(false)}
                  className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Back to Directory
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-2 text-amber-400 mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Business Owner Verification</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Claim & Verify: {selectedListingForClaim?.name}
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  Unlock your verified badge, direct customer inquiry routing, and custom interactive website prototype.
                </p>

                <form onSubmit={handleClaimSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Owner / Manager Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Folake Adeyemi"
                      value={claimForm.name}
                      onChange={(e) => setClaimForm({ ...claimForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Direct WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 08022791227"
                      value={claimForm.phone}
                      onChange={(e) => setClaimForm({ ...claimForm, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. contact@yourbusiness.ng"
                      value={claimForm.email}
                      onChange={(e) => setClaimForm({ ...claimForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Special Notes / Upgrades Desired</label>
                    <textarea
                      rows={2}
                      placeholder="Tell us if you want direct Paystack/Moniepoint integration..."
                      value={claimForm.notes}
                      onChange={(e) => setClaimForm({ ...claimForm, notes: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-1.5 mt-4"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Claim & Get Instant Prototype (₦0 Upfront)</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Diaspora Concierge Modal ───────────────────────────────────────── */}
      {conciergeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 max-w-lg w-full rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setConciergeModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {conciergeSubmitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Concierge Request Prioritized!</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
                  A Senior Diaspora Project Officer will contact you via WhatsApp with verified escrow quotes and video inspection protocols.
                </p>
                <button
                  onClick={() => setConciergeModalOpen(false)}
                  className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Return to Portal
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-2 text-amber-400 mb-2">
                  <Globe className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Bethelmind Diaspora Concierge & Escrow</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Deploy Projects in Nigeria with 100% Fraud Protection
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  We inspect, verify, and milestone-fund solar installations, property development, and high-end living in Nigeria on behalf of diaspora clients.
                </p>

                <form onSubmit={handleConciergeSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engr. Chinedu Eze"
                      value={conciergeForm.name}
                      onChange={(e) => setConciergeForm({ ...conciergeForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        required
                        placeholder="+44 7911 123456"
                        value={conciergeForm.phone}
                        onChange={(e) => setConciergeForm({ ...conciergeForm, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Location (City/Country)</label>
                      <input
                        type="text"
                        placeholder="London, UK or Houston, US"
                        value={conciergeForm.diasporaLocation}
                        onChange={(e) => setConciergeForm({ ...conciergeForm, diasporaLocation: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Service or Project Needed</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10kVA Hybrid Solar for Parent's House in Lekki"
                      value={conciergeForm.serviceNeeded}
                      onChange={(e) => setConciergeForm({ ...conciergeForm, serviceNeeded: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Approximate Budget ({currency})</label>
                    <input
                      type="number"
                      placeholder="5000"
                      value={conciergeForm.budgetAmount}
                      onChange={(e) => setConciergeForm({ ...conciergeForm, budgetAmount: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-1.5 mt-4"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit & Request Verified Escrow Quote</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
