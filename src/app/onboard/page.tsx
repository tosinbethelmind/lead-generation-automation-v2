'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Copy, 
  Check, 
  MessageCircle, 
  Building2, 
  Sparkles, 
  FileText, 
  ChevronRight,
  Phone,
  Globe,
  CreditCard,
  Layers,
  Smartphone,
  ExternalLink,
  Share2
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { PILLAR_ONE_SERVICES, getPillarOneService } from '@/lib/pillarOneCatalog';

function ClientAdmissionContent() {
  const searchParams = useSearchParams();

  // Get initial values from URL query parameters
  const initialServiceId = searchParams.get('service') || 'website_ai';
  const initialTier = (searchParams.get('tier') as 'starter' | 'annual' | 'turnkey') || 'annual';
  const initialBiz = searchParams.get('biz') || '';
  const initialPhone = searchParams.get('phone') || '';
  const initialUrl = searchParams.get('url') || '';

  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [packageType, setPackageType] = useState<'starter' | 'annual' | 'turnkey'>(initialTier);
  
  // Client Form Details
  const [businessName, setBusinessName] = useState(initialBiz);
  const [contactPerson, setContactPerson] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState(initialPhone);
  const [existingWebsiteUrl, setExistingWebsiteUrl] = useState(initialUrl);
  const [preferredDomain, setPreferredDomain] = useState('');
  const [payoutBank, setPayoutBank] = useState('');
  const [catalogNotes, setCatalogNotes] = useState('');

  // UI State
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [invoiceNumber] = useState(() => `INV-BM-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`);

  // Update selected service if query param changes
  useEffect(() => {
    const s = searchParams.get('service');
    if (s && PILLAR_ONE_SERVICES.some(item => item.id === s)) {
      setSelectedServiceId(s);
    }
    const b = searchParams.get('biz');
    if (b) setBusinessName(b);
    const p = searchParams.get('phone');
    if (p) setWhatsappPhone(p);
  }, [searchParams]);

  const activeService = getPillarOneService(selectedServiceId);
  const isPortal = Boolean(activeService.pricing.isPortal);

  // Exact Pricing Calculations
  let totalContractAmount = 0;
  let depositAmount = 0;
  let tierLabel = '';
  let paymentTerms = '';

  if (packageType === 'starter') {
    depositAmount = activeService.pricing.starterSetup;
    totalContractAmount = depositAmount;
    tierLabel = `Starter Go-Live (₦${activeService.pricing.starterSetup.toLocaleString()} Setup + ₦${activeService.pricing.starterMonthly.toLocaleString()}/mo)`;
    paymentTerms = `₦${activeService.pricing.starterSetup.toLocaleString()} one-time setup paid today • ₦${activeService.pricing.starterMonthly.toLocaleString()}/month hosting retainer starts after 30 days.`;
  } else if (packageType === 'annual') {
    depositAmount = activeService.pricing.annualPass;
    totalContractAmount = activeService.pricing.annualPass;
    tierLabel = `Annual Value Pass (₦${activeService.pricing.annualPass.toLocaleString()} — 1 Full Year Free Maintenance)`;
    paymentTerms = `₦${activeService.pricing.annualPass.toLocaleString()} flat fee includes complete turnkey deployment + 12 months full cloud hosting & technical support included (Save ₦${activeService.pricing.annualSavings.toLocaleString()}!).`;
  } else {
    // Turnkey Custom Domain
    totalContractAmount = activeService.pricing.turnkeyTotal;
    depositAmount = activeService.pricing.turnkeyDeposit;
    tierLabel = `Full Turnkey Custom Domain Suite (₦${activeService.pricing.turnkeyTotal.toLocaleString()} Total)`;
    paymentTerms = `₦${activeService.pricing.turnkeyDeposit.toLocaleString()} 50% commitment deposit due today • ₦${activeService.pricing.turnkeyDeposit.toLocaleString()} balance due only upon live approval on custom domain.`;
  }

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('6805375225');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/onboard?service=${selectedServiceId}&biz=${encodeURIComponent(businessName || '')}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const generateWhatsAppMessage = () => {
    const text = `🇳🇬 *BETHELMIND CLIENT ADMISSION & INVOICE PAYMENT*
━━━━━━━━━━━━━━━━━━━━
📄 *Invoice Reference:* ${invoiceNumber}
🏢 *Business Name:* ${businessName || 'My Business'}
👤 *Contact Person:* ${contactPerson || 'Business Owner'}
📱 *WhatsApp Phone:* ${whatsappPhone || 'Not provided'}
🎯 *Selected Solution:* ${activeService.title}
📦 *Package Tier:* ${tierLabel}
${selectedServiceId === 'website_to_app' && existingWebsiteUrl ? `🌐 *Website URL to Wrap:* ${existingWebsiteUrl}\n` : ''}${preferredDomain ? `🌐 *Preferred Domain:* ${preferredDomain}\n` : ''}${payoutBank ? `🏦 *Settlement Bank:* ${payoutBank}\n` : ''}
💵 *Deposit Due Today:* ₦${depositAmount.toLocaleString()}
🏛️ *Moniepoint Account:* 6805375225 (Bethelmind Digital Solutions)
━━━━━━━━━━━━━━━━━━━━
I have reviewed my quotation card and completed admission. I am ready to confirm payment screenshot for live deployment.`;

    return `https://wa.me/2348022791227?text=${encodeURIComponent(text)}`;
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      {/* Header Badges */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4" />
          Bethelmind Digital Solutions • CAC Certified Enterprise (Reg: 9912717)
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Client Admission &amp; <span className="text-[#d4af37]">Instant Deployment Portal</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Select any of our 10 High-Conversion Sector Engines or DFY SME Prototypes. Receive an official bankable invoice card and lock your delivery date in under 2 minutes.
        </p>

        {/* Quick Service Selector Bar */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#d4af37]/40 text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <span>Browse All 13 Sector Solutions</span>
            <ExternalLink className="w-3 h-3 text-[#d4af37]" />
          </Link>
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/40 text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <Share2 className="w-3 h-3 text-emerald-400" />
            <span>{copiedLink ? 'Admission Link Copied!' : 'Share This Quote'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Select Service */}
          <div className="bg-[#0a0e17] border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#d4af37] font-bold text-sm tracking-wide uppercase">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-xs">1</span>
                Select Required Sector Solution
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-[#d4af37] border border-[#d4af37]/30">
                {activeService.badge}
              </span>
            </div>

            <label className="block text-xs font-medium text-slate-400 mb-2">
              Choose the exact commercial system to deploy for your business:
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-[#070b14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition"
            >
              {PILLAR_ONE_SERVICES.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title} ({service.pricing.isPortal ? '₦45k Setup / ₦95k Annual' : '₦35k Setup / ₦80k Annual'})
                </option>
              ))}
            </select>

            {/* Service Brief Box */}
            <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="text-xs font-semibold text-slate-200">
                {activeService.headline}
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">
                {activeService.solution}
              </div>
              
              {/* Deliverables Bullet List */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {activeService.deliverables.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Type Selector (3 Tiers) */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Choose Deployment Package:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Tier 1: Starter */}
                <button
                  type="button"
                  onClick={() => setPackageType('starter')}
                  className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    packageType === 'starter'
                      ? 'bg-sky-500/10 border-sky-500 text-white shadow-lg shadow-sky-500/10'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-1">Starter Go-Live</div>
                    <div className="text-xl font-extrabold text-white">
                      ₦{activeService.pricing.starterSetup.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      + ₦{activeService.pricing.starterMonthly.toLocaleString()}/mo
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-white/5">
                    Pay-Small-Small • 48h Live
                  </div>
                </button>

                {/* Tier 2: Annual (Best Value) */}
                <button
                  type="button"
                  onClick={() => setPackageType('annual')}
                  className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    packageType === 'annual'
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="absolute -top-2.5 right-2 px-1.5 py-0.5 bg-emerald-500 text-[#070b14] font-black text-[9px] rounded uppercase tracking-wider">
                    Best Value
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Annual Value Pass</div>
                    <div className="text-xl font-extrabold text-white">
                      ₦{activeService.pricing.annualPass.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                      1 Full Year Included
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-300 mt-2 pt-2 border-t border-white/5">
                    Zero monthly bills for 12 months (Save ₦{activeService.pricing.annualSavings.toLocaleString()}!)
                  </div>
                </button>

                {/* Tier 3: Turnkey Custom Domain */}
                <button
                  type="button"
                  onClick={() => setPackageType('turnkey')}
                  className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    packageType === 'turnkey'
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-lg shadow-[#d4af37]/10'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider mb-1">Custom Domain</div>
                    <div className="text-xl font-extrabold text-white">
                      ₦75,000 <span className="text-[10px] font-normal text-slate-400">dep.</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      ₦150,000 Total
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-white/5">
                    Dedicated .com + 100% Code Handover
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Client Business Setup Details */}
          <div className="bg-[#0a0e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#d4af37] font-bold text-sm tracking-wide uppercase">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-xs">2</span>
              Enter Your Business Setup Details (2 Mins)
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Official Business / Trading Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Solar Engineering Ltd / Glamour Chic Salon"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Contact Person / Director Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Engr. Adeolu / Mrs. Funke"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-[#070b14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  WhatsApp Hotline for Inbound Orders *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0803 123 4567"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  className="w-full bg-[#070b14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Special Field for Website to Android App (.APK) */}
            {selectedServiceId === 'website_to_app' && (
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 space-y-2 animate-in fade-in">
                <label className="block text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  Existing Website URL to Convert to Android App (.APK) *
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://www.yourshop.com or https://yourstore.jiji.ng"
                  value={existingWebsiteUrl}
                  onChange={(e) => setExistingWebsiteUrl(e.target.value)}
                  className="w-full bg-[#070b14] border border-sky-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
                <p className="text-[11px] text-sky-300/80">
                  ⚡ We will convert this exact website address into an installable Android APK with custom splash screen and WhatsApp integration within 24 hours.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Preferred Domain Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. yourbusiness.com.ng"
                  value={preferredDomain}
                  onChange={(e) => setPreferredDomain(e.target.value)}
                  className="w-full bg-[#070b14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  Your Bank Account (For Customer Payouts)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Moniepoint / OPay 1234567890"
                  value={payoutBank}
                  onChange={(e) => setPayoutBank(e.target.value)}
                  className="w-full bg-[#070b14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Catalog Items / Special Instructions / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Mention your top services, prices, or if you will send photos/flyers to our WhatsApp desk."
                value={catalogNotes}
                onChange={(e) => setCatalogNotes(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

        </div>

        {/* Right Summary / Bankable Invoice Card (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-gradient-to-b from-[#0e1424] to-[#070b14] border border-[#d4af37]/30 rounded-2xl p-6 shadow-2xl sticky top-8">
            
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider">Official Bankable Invoice</span>
                <div className="text-base font-extrabold text-white">{invoiceNumber}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Delivery Guarantee</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {activeService.deliverySla} SLA
                </span>
              </div>
            </div>

            {/* Scope Overview */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Client Organization:</span>
                <span className="text-white font-medium text-right">{businessName || 'Pending Admission'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Selected Solution:</span>
                <span className="text-white font-medium text-right truncate max-w-[200px]">{activeService.shortTitle}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Deployment Tier:</span>
                <span className="text-emerald-400 font-semibold text-right max-w-[210px]">
                  {packageType === 'starter' && 'Starter Go-Live (Pay-Small-Small)'}
                  {packageType === 'annual' && 'Annual Value Pass (1 Year Free)'}
                  {packageType === 'turnkey' && 'Full Custom Domain Suite'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Contract Value:</span>
                <span className="text-white font-bold">₦{totalContractAmount.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-dashed border-white/15 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] block">
                    {packageType === 'turnkey' ? '50% Commitment Deposit:' : 'Payment Due Today:'}
                  </span>
                  <span className="text-[10px] text-slate-400">{paymentTerms}</span>
                </div>
                <span className="text-2xl font-black text-white shrink-0 ml-2">
                  ₦{depositAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Settlement Instructions (Moniepoint MFB) */}
            <div className="bg-[#070b14] border border-white/10 rounded-xl p-4 mb-6">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Official Settlement Account:</span>
                <span className="text-[10px] text-emerald-400 font-normal">Moniepoint MFB</span>
              </div>

              <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-lg p-2.5 mb-2">
                <div>
                  <div className="text-[11px] text-slate-400">Account Number:</div>
                  <div className="text-lg font-extrabold text-[#d4af37] tracking-wider font-mono">6805375225</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs text-white font-medium transition"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAccount ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="text-[11px] text-slate-400">
                <strong className="text-slate-200">Account Name:</strong> Bethelmind Digital Solutions
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                🏛️ CAC Registered Enterprise (Reg: 9912717) • Direct NIP Wire Settlement
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={generateWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#070b14] font-extrabold text-sm hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              Confirm Admission &amp; Send Invoice on WhatsApp
            </a>

            {/* Guarantees */}
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{activeService.deliverySla} SLA Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Test Live Before Handover</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>30-Day Tech Support</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default function ClientAdmissionPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-[#f5f3ef]">
      <Navbar />
      <Suspense fallback={
        <div className="max-w-4xl mx-auto px-4 py-32 text-center text-slate-400">
          Loading admission portal...
        </div>
      }>
        <ClientAdmissionContent />
      </Suspense>
      <Footer />
    </div>
  );
}
