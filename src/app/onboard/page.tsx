'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Layers
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

const SERVICES_CATALOG = [
  { id: 'website_ai', name: 'Mobile Business Website + 24/7 AI WhatsApp Sales Closer', price: 70000, category: 'Web & Conversational AI' },
  { id: 'solar_boq', name: 'Solar & Inverter Load Sizing & Instant WhatsApp BOQ Engine', price: 70000, category: 'Engineering Software' },
  { id: 'fake_alert', name: 'Fake Alert Proof Bank Transfer Verification POS Shield', price: 70000, category: 'Fintech & Retail Software' },
  { id: 'dispatch_tracker', name: 'Interstate Waybill Tracker & Courier Dispatch Aggregator', price: 70000, category: 'Logistics & Supply Chain' },
  { id: 'retail_inventory', name: 'Multi-Location Stock Theft Prevention & Retail Cloud Ledger', price: 70000, category: 'Retail & Inventory Software' },
  { id: 'salon_booking', name: 'Salon & Aesthetic Clinic Appointment Booking Engine with Deposit Lock', price: 70000, category: 'Booking & Scheduling Software' },
  { id: 'shortlet_escrow', name: 'Shortlet Apartment Direct Booking Engine & Caution Fee Escrow', price: 70000, category: 'Hospitality & Real Estate Tech' },
  { id: 'construction_boq', name: 'Building Material Quantity Estimator & Site BOQ Calculator', price: 70000, category: 'Construction Tech & Estimators' },
  { id: 'school_fee', name: 'Private School Term Fee Payment Portal & Electronic Result PIN Gateway', price: 85000, category: 'EdTech & School Administration' },
  { id: 'estate_rent', name: 'Residential Estate Service Charge Billing & Tenant Rent Escrow Portal', price: 85000, category: 'PropTech & Facility Portals' },
  { id: 'fleet_gps', name: 'Cloud Fleet GPS Telematics & Highway Fuel Audit Software Portal', price: 70000, category: 'Fleet Telematics Software' },
  { id: 'agri_consolidator', name: 'Bulk Agribusiness Farm Input Order Consolidator Software Portal', price: 70000, category: 'AgriTech Software' },
  { id: 'vin_checker', name: 'Automated Tokunbo VIN Chassis Number & Salvage Auction Audit Software', price: 10000, category: 'Automotive Intelligence Tech' },
];

export default function ClientAdmissionPage() {
  const [selectedServiceId, setSelectedServiceId] = useState('website_ai');
  const [packageType, setPackageType] = useState<'starter' | 'turnkey'>('starter');
  
  // Client Form Details
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [preferredDomain, setPreferredDomain] = useState('');
  const [payoutBank, setPayoutBank] = useState('');
  const [catalogNotes, setCatalogNotes] = useState('');

  // UI State
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [invoiceNumber] = useState(() => `INV-BM-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`);

  const activeService = SERVICES_CATALOG.find(s => s.id === selectedServiceId) || SERVICES_CATALOG[0];

  // Price calculations - Minimum 70k, no hidden monthly bills
  let totalAmount = Math.max(70000, activeService.price);
  let depositAmount = totalAmount;

  if (packageType === 'turnkey') {
    totalAmount = 150000;
    depositAmount = 75000;
  }

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('6805375225');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const generateWhatsAppMessage = () => {
    const text = `🇳🇬 *BETHELMIND CLIENT ADMISSION & INVOICE PAYMENT*
━━━━━━━━━━━━━━━━━━━━
📄 *Invoice Reference:* ${invoiceNumber}
🏢 *Business Name:* ${businessName || 'My Business'}
👤 *Contact Person:* ${contactPerson || 'Business Owner'}
📱 *WhatsApp Phone:* ${whatsappPhone || 'Not provided'}
🎯 *Selected Service:* ${activeService.name}
📦 *Package Tier:* ${packageType === 'turnkey' ? 'Full Turnkey Custom Domain (₦75k Deposit / ₦150k Total)' : 'Standard Pro Go-Live (₦' + totalAmount.toLocaleString() + ' — 1 Full Year All-Inclusive)'}
🌐 *Preferred Domain:* ${preferredDomain || 'Will specify later'}
🏦 *Receiving Bank:* ${payoutBank || 'Will specify later'}

💵 *Milestone Deposit:* ₦${depositAmount.toLocaleString()}
🏛️ *Settlement Bank:* Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
━━━━━━━━━━━━━━━━━━━━
I have completed the admission form and I am ready to confirm payment screenshot for live deployment.`;
    return `https://wa.me/2348022791227?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f5f3ef]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Header Badges */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            CAC Certified Enterprise (Reg: 9912717) • 48-Hour Live Delivery SLA
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Client Admission & <span className="text-[#d4af37]">Instant Deployment Portal</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Complete your business details in under 2 minutes. Receive an official bankable invoice and lock your 48-Hour turnkey go-live date with zero developer delays.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Select Service */}
            <div className="bg-[#0a0e17] border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-[#d4af37] font-bold text-sm tracking-wide uppercase">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-xs">1</span>
                Select Your Required Tool / Solution
              </div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Choose the exact commercial system you want deployed for your business:
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full bg-[#070b14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition"
              >
                {SERVICES_CATALOG.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} (₦{service.price.toLocaleString()})
                  </option>
                ))}
              </select>

              {/* Package Type Selector */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Choose Deployment Package:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPackageType('starter')}
                    className={`p-4 rounded-xl border text-left transition ${
                      packageType === 'starter'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-400">Standard Pro Go-Live</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">1 Full Year</span>
                    </div>
                    <div className="text-2xl font-extrabold text-white">₦{Math.max(70000, activeService.price).toLocaleString()}</div>
                    <div className="text-xs text-slate-300 mt-1">Everything included • Zero monthly bills for 12 months</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPackageType('turnkey')}
                    className={`p-4 rounded-xl border text-left transition ${
                      packageType === 'turnkey'
                        ? 'bg-[#d4af37]/10 border-[#d4af37] text-white'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#d4af37]">Full Custom Domain Suite</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37]">Enterprise</span>
                    </div>
                    <div className="text-2xl font-extrabold text-white">₦75,000 <span className="text-xs font-normal text-slate-400">deposit (₦150k total)</span></div>
                    <div className="text-xs text-slate-300 mt-1">Dedicated .com.ng + Corporate Email + SEO + 100% Code</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Client 5 Core Details */}
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
                  placeholder="e.g. Adeolu Logistics & Haulage Ltd"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#070b14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Engr. Adeolu"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    WhatsApp Hotline for Alerts *
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    Preferred Domain / Subdomain Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. adeolulogistics.com.ng"
                    value={preferredDomain}
                    onChange={(e) => setPreferredDomain(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    Your Bank Account (For Customer Payments)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Moniepoint 1234567890"
                    value={payoutBank}
                    onChange={(e) => setPayoutBank(e.target.value)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Service Menu / Price List / Special Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste your top products, services, or prices here, or mention if you will send photos/flyers via WhatsApp."
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
                  <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider">Commercial Invoice</span>
                  <div className="text-base font-extrabold text-white">{invoiceNumber}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Delivery SLA</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 48-Hour Live
                  </span>
                </div>
              </div>

              {/* Scope Overview */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Client Business:</span>
                  <span className="text-white font-medium text-right">{businessName || 'Pending Admission'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Primary System:</span>
                  <span className="text-white font-medium text-right truncate max-w-[200px]">{activeService.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Package Tier:</span>
                  <span className="text-emerald-400 font-semibold">
                    {packageType === 'turnkey' ? 'Full Custom Suite (.com.ng)' : 'Standard Pro (1-Year All-Inclusive)'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Contract Value:</span>
                  <span className="text-white font-bold">₦{totalAmount.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-dashed border-white/15 pt-3 flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">Milestone Deposit Due:</span>
                  <span className="text-2xl font-black text-white">₦{depositAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Settlement Instructions (Moniepoint) */}
              <div className="bg-[#070b14] border border-white/10 rounded-xl p-4 mb-6">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Official Corporate Account:</span>
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
                  🏛️ CAC Registered Enterprise (Reg: 9912717) • Moniepoint Microfinance Bank
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
                Confirm Admission & Send Receipt on WhatsApp
              </a>

              {/* Guarantees */}
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>48h SLA Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>No Hidden Fees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Test Free On Phone</span>
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

      <Footer />
    </div>
  );
}
