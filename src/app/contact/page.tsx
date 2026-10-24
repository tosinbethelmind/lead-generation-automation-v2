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
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Direct WhatsApp Concierge &bull; Lagos Technical Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight leading-tight">
            Book Your Live Demo or <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Speak with a Solutions Consultant.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Get an instant consultation on building your official mobile website, 24/7 AI WhatsApp closer, or specialized Nigerian sector calculator.
          </p>
        </div>

        {/* Main Grid: Form vs Contact Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          
          {/* Left Column: Interactive Demo Booking Form (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white font-['Outfit']">
                Schedule Live WhatsApp Demo
              </h2>
              <p className="text-xs text-slate-400">
                Fill in your business details. Our team prepares your customized prototype before connecting on WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Business / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Solar Systems Ltd"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Industry Sector *
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
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
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Location / City *
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
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
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Do you have an active website?
                  </label>
                  <select
                    value={hasWebsite}
                    onChange={(e) => setHasWebsite(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="no">No (Directory/Social Only — Need Website)</option>
                    <option value="yes">Yes (Have WordPress/Wix — Want 1-Line Embed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Preferred Package Tier
                  </label>
                  <select
                    value={preferredPlan}
                    onChange={(e) => setPreferredPlan(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="starter">Starter Go-Live (₦35k dep / ₦65k total)</option>
                    <option value="pro">Corporate Pro Suite (₦60k dep / ₦120k total)</option>
                    <option value="enterprise">Enterprise Web + APK (₦85k dep / ₦175k total)</option>
                    <option value="embed">1-Line Embed Only (₦35k one-time)</option>
                    <option value="outright">Outright Code Buyout (₦325k full IP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Your WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0802 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Specific Requirements or Questions (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your price lists, primary customer questions, or specific calculator needs..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Launch Live WhatsApp Demo Consultation →</span>
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                🔒 We respect your privacy under the Nigeria Data Protection Act (NDPA 2023). Zero spam guaranteed.
              </p>
            </form>
          </div>

          {/* Right Column: Direct Contact Info & Corporate Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
              <h3 className="text-base font-bold text-white font-['Outfit'] border-b border-white/10 pb-3">
                Direct Contact Hotline
              </h3>

              <div className="space-y-4 text-xs">
                <a
                  href={`https://wa.me/${adminPhone}?text=Hello%20Bethelmind%20Lagos%20Desk!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all text-emerald-300"
                >
                  <MessageCircle className="w-4 h-4 shrink-0 mt-0.5 fill-current" />
                  <div>
                    <span className="font-bold block text-white">WhatsApp & Phone Desk</span>
                    <span className="font-mono text-emerald-400">+234 802 279 1227</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Available Mon &ndash; Sat (8:00 AM &ndash; 7:00 PM WAT)</span>
                  </div>
                </a>

                <a
                  href="mailto:bethelmindrecruit@gmail.com"
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] transition-all text-slate-300"
                >
                  <Mail className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                  <div>
                    <span className="font-bold block text-white">Official Corporate Email</span>
                    <span className="font-mono text-cyan-400">bethelmindrecruit@gmail.com</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Written proposals & partnership inquiries</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-300">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <span className="font-bold block text-white">Physical Commercial Office</span>
                    <span>Plot 12, Commercial Corridor, Lagos, Nigeria</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Settlement & Verification Seal */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl text-xs text-slate-400">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>CAC Certified Nigerian Enterprise</span>
              </div>

              <p className="leading-relaxed">
                Registered under the Corporate Affairs Commission of the Federal Republic of Nigeria (RC 7034297).
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Corporate Bank:</span>
                  <span className="text-white font-bold">Moniepoint Microfinance Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Number:</span>
                  <span className="text-emerald-400 font-bold">6805375225</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Name:</span>
                  <span className="text-white font-bold">Bethelmind Digital Solutions</span>
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
