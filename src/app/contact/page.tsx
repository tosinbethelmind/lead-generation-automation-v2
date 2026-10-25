'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  MessageCircle, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Building, 
  ShieldCheck, 
  Clock, 
  Send,
  CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function ContactPage() {
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('Solar & Renewable Energy');
  const [location, setLocation] = useState('Lagos');
  const [hasWebsite, setHasWebsite] = useState('no');
  const [preferredPlan, setPreferredPlan] = useState('starter');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const adminPhone = '2348022791227';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const message = encodeURIComponent(
      `Hello Bethelmind Lagos Demo Desk!\n\nI want to schedule a live demo for our business:\n` +
      `• Business: *${businessName || 'My Business'}*\n` +
      `• Industry: *${industry}*\n` +
      `• Location: *${location}*\n` +
      `• Has Website?: *${hasWebsite === 'yes' ? 'Yes (Want 1-Line Embed)' : 'No (Need Official Mobile Website)'}*\n` +
      `• Target Plan: *${preferredPlan.toUpperCase()}*\n` +
      `• Contact Phone: *${phoneNumber || 'N/A'}*\n` +
      (notes ? `• Specific Notes: ${notes}\n\n` : `\n`) +
      `Please issue our 48-Hour Prototype Scope and connect with our team.`
    );

    window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f5f3ef] font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      <Navbar />

      <main className="pt-36 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
            <MessageCircle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Direct WhatsApp Concierge &bull; Lagos Technical Advisory</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-tight">
            Book Your Private Consultation or <br />
            <span className="italic font-light text-[#d4af37]">
              Speak with a Solutions Director.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#c9c4bc] font-light leading-relaxed max-w-2xl mx-auto">
            Receive a tailored evaluation on launching your bespoke mobile website, 24/7 AI WhatsApp closer, or specialized Nigerian sector calculation engines.
          </p>
        </div>

        {/* Main Grid: Form vs Contact Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          
          {/* Left Column: Interactive Demo Booking Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#090d16]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-md space-y-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-widest block">
                Private Consultation
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#f5f3ef]">
                Schedule Live WhatsApp Demonstration
              </h2>
              <p className="text-xs text-[#c9c4bc] font-light leading-relaxed">
                Provide your commercial requirements. Our solutions desk prepares your interactive prototype before connecting directly on WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-[#c9c4bc] mb-1.5">
                  Business / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Solar Systems Ltd"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0e17] border border-white/[0.08] text-[#f5f3ef] text-xs placeholder:text-[#c9c4bc]/40 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#c9c4bc] mb-1.5">
                    Industry Sector *
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0e17] border border-white/[0.08] text-[#f5f3ef] text-xs focus:outline-none focus:border-[#d4af37] transition-colors"
                  >
                    <option value="Solar & Renewable Energy">Solar & Renewable Energy</option>
                    <option value="Automotive & Tokunbo Car Sales">Automotive & Tokunbo Car Sales</option>
                    <option value="Real Estate & Property Development">Real Estate & Property Development</option>
                    <option value="Beauty, Hair Salon & Spa">Beauty, Hair Salon & Spa</option>
                    <option value="Retail & E-commerce Boutiques">Retail & E-commerce Boutiques</option>
                    <option value="Logistics & Interstate Freight">Logistics & Interstate Freight</option>
                    <option value="Clinic, Hospital & Healthcare">Clinic, Hospital & Healthcare</option>
                    <option value="Private Schools & Education">Private Schools & Education</option>
                    <option value="Hospitality & Shortlet Apartments">Hospitality & Shortlet Apartments</option>
                    <option value="Construction & Civil Contracting">Construction & Civil Contracting</option>
                    <option value="Agribusiness & Farm Supplies">Agribusiness & Farm Supplies</option>
                    <option value="General Commercial SME">Other Commercial SME</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c9c4bc] mb-1.5">
                    Location / City *
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0e17] border border-white/[0.08] text-[#f5f3ef] text-xs focus:outline-none focus:border-[#d4af37] transition-colors"
                  >
                    <option value="Lagos (Ikeja, Lekki, VI, Mainland)">Lagos</option>
                    <option value="Abuja FCT">Abuja FCT</option>
                    <option value="Port Harcourt / Rivers">Port Harcourt</option>
                    <option value="Ibadan / Oyo">Ibadan</option>
                    <option value="Kano / Kaduna">Kano / Kaduna</option>
                    <option value="Enugu / Anambra / Asaba">South East Corridor</option>
                    <option value="Other Nigerian City">Other City</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#c9c4bc] mb-1.5">
                    Do you have an active website?
                  </label>
                  <select
                    value={hasWebsite}
                    onChange={(e) => setHasWebsite(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0e17] border border-white/[0.08] text-[#f5f3ef] text-xs focus:outline-none focus:border-[#d4af37] transition-colors"
                  >
                    <option value="no">No (Directory/Social Only &bull; Need Website)</option>
                    <option value="yes">Yes (Have WordPress/Wix &bull; Want 1-Line Embed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c9c4bc] mb-1.5">
                    Preferred Engagement Tier
                  </label>
                  <select
                    value={preferredPlan}
                    onChange={(e) => setPreferredPlan(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0e17] border border-white/[0.08] text-[#f5f3ef] text-xs focus:outline-none focus:border-[#d4af37] transition-colors"
                  >
                    <option value="starter">Starter Activation (₦35k dep / ₦65k total)</option>
                    <option value="pro">Corporate Pro Suite (₦60k dep / ₦120k total)</option>
                    <option value="enterprise">Enterprise Web + APK (₦85k dep / ₦175k total)</option>
                    <option value="embed">1-Line Embed Only (₦35k one-time)</option>
                    <option value="outright">Outright Code Buyout (₦325k full IP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c9c4bc] mb-1.5">
                  Your WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0802 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0e17] border border-white/[0.08] text-[#f5f3ef] text-xs placeholder:text-[#c9c4bc]/40 focus:outline-none focus:border-[#d4af37] font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c9c4bc] mb-1.5">
                  Specific Requirements or Questions (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your price catalog, primary client inquiries, or required calculation features..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0e17] border border-white/[0.08] text-[#f5f3ef] text-xs placeholder:text-[#c9c4bc]/40 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#d4af37]/20 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Launch Live WhatsApp Demo Consultation &rarr;</span>
              </button>

              <p className="text-[11px] text-[#c9c4bc]/70 text-center font-light pt-1">
                Data strictly protected under the Nigeria Data Protection Act (NDPA 2023). Zero unsolicited spam.
              </p>
            </form>
          </div>

          {/* Right Column: Direct Contact Info & Corporate Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="bg-[#090d16]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl backdrop-blur-md">
              <h3 className="font-serif text-lg font-normal text-[#f5f3ef] border-b border-white/[0.06] pb-3">
                Direct Contact Hotline
              </h3>

              <div className="space-y-3.5 text-xs">
                <a
                  href={`https://wa.me/${adminPhone}?text=Hello%20Bethelmind%20Lagos%20Desk!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 hover:bg-[#d4af37]/15 transition-all text-[#f5f3ef]"
                >
                  <MessageCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#d4af37] fill-current" />
                  <div>
                    <span className="font-medium block text-[#f5f3ef]">WhatsApp &amp; Phone Advisory Desk</span>
                    <span className="font-mono text-[#d4af37] font-semibold">+234 802 279 1227</span>
                    <span className="text-[10px] text-[#c9c4bc] block mt-0.5">Mon &ndash; Sat (8:00 AM &ndash; 7:00 PM WAT)</span>
                  </div>
                </a>

                <a
                  href="mailto:bethelmindrecruit@gmail.com"
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] transition-all text-[#c9c4bc]"
                >
                  <Mail className="w-4 h-4 shrink-0 mt-0.5 text-[#c5a880]" />
                  <div>
                    <span className="font-medium block text-[#f5f3ef]">Official Corporate Email</span>
                    <span className="font-mono text-[#c5a880]">bethelmindrecruit@gmail.com</span>
                    <span className="text-[10px] text-[#c9c4bc]/70 block mt-0.5">Formal proposals &amp; client onboarding</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[#c9c4bc]">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#d4af37]" />
                  <div>
                    <span className="font-medium block text-[#f5f3ef]">Physical Commercial Office</span>
                    <span>Plot 12, Commercial Corridor, Lagos, Nigeria</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Settlement & Verification Seal */}
            <div className="bg-[#090d16]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl backdrop-blur-md text-xs text-[#c9c4bc]">
              <div className="flex items-center gap-2 text-[#f5f3ef] font-medium text-sm">
                <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                <span>CAC Certified Nigerian Enterprise</span>
              </div>

              <p className="font-light leading-relaxed">
                Registered under the Corporate Affairs Commission of the Federal Republic of Nigeria (RC 7034297).
              </p>

              <div className="p-4 rounded-xl bg-[#0a0e17] border border-white/[0.06] space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#c9c4bc]/70">Corporate Bank:</span>
                  <span className="text-[#f5f3ef] font-medium">Moniepoint Microfinance Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c9c4bc]/70">Account Number:</span>
                  <span className="text-[#d4af37] font-bold">6805375225</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c9c4bc]/70">Account Name:</span>
                  <span className="text-[#f5f3ef] font-medium">Bethelmind Digital Solutions</span>
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
