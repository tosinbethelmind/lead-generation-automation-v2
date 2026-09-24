'use client';

import React, { useState } from 'react';
import { Send, Zap, Calculator, Phone, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

interface TypebotLeadConverterProps {
  businessName: string;
  category: string;
  area: string;
  leadId: string;
  primaryColor?: string;
  accentColor?: string;
}

export default function TypebotLeadConverter({
  businessName,
  category,
  area,
  leadId,
  primaryColor = '#0284c7',
  accentColor = '#38bdf8'
}: TypebotLeadConverterProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedSpend, setSelectedSpend] = useState<string>('₦150,000 - ₦300,000 / month');
  const [selectedAppliance, setSelectedAppliance] = useState<string>('ACs + Freezers + Lighting');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const cleanCategory = category.toLowerCase();
  const isSolar = cleanCategory.includes('solar') || cleanCategory.includes('energy') || cleanCategory.includes('inverter');
  const isAuto = cleanCategory.includes('auto') || cleanCategory.includes('car') || cleanCategory.includes('motor');
  const isRealEstate = cleanCategory.includes('estate') || cleanCategory.includes('property') || cleanCategory.includes('realty');
  const isHealth = cleanCategory.includes('clinic') || cleanCategory.includes('health') || cleanCategory.includes('dental') || cleanCategory.includes('hospital');

  // Sector calculations
  const calculateSavings = () => {
    if (selectedSpend.includes('150,000')) return { kva: '5.0 KVA Solar Hybrid', savings: '₦185,000 / month', batteries: '2x 200Ah Lithium' };
    if (selectedSpend.includes('300,000')) return { kva: '7.5 KVA Solar Hybrid', savings: '₦290,000 / month', batteries: '4x 200Ah Lithium' };
    return { kva: '10.0 KVA Industrial Solar', savings: '₦480,000 / month', batteries: '1x 10kWh High-Voltage Rack' };
  };

  const solarRes = calculateSavings();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitted(true);
      // Automatically sync lead phone number and calculation to unified WhatsApp Closer & CRM
      try {
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: businessName,
            phone: phoneInput,
            source: 'Interactive 24/7 Lead Engine',
            subject: `Calculator Lead: ${businessName} (${category})`,
            message: `Lead completed ${category} calculator for ${businessName} in ${area}.\nSpend: ${selectedSpend}\nAppliances: ${selectedAppliance}\nRecommended: ${solarRes.kva}\nSavings: ${solarRes.savings}\nContact WhatsApp: ${phoneInput}`
          })
        }).catch(() => {});
      } catch (_) {}
    }
  };

  const waLeadMsg = encodeURIComponent(
    `Hello Bethelmind Analytics Closer Desk! I just ran the live 24/7 quoting simulation on the ${businessName} prototype (${area}). Phone: ${phoneInput || 'Inquiry'}. I want to claim the ₦0 Upfront staging portal!`
  );

  return (
    <div className="w-full my-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: primaryColor }}
      />

      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            24/7 Live Interactive Lead Engine
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-100">
            {isSolar ? 'Interactive Solar BOQ Load Sizer & Diesel Savings' : 
             isAuto ? 'Tokunbo Customs Duty & Port Clearing Estimator' :
             isRealEstate ? '12-Month Installment & Mortgage Payment Schedule' :
             isHealth ? '24/7 HMO & Patient Appointment Concierge' :
             `24/7 AI Instant Quoting Engine for ${businessName}`}
          </h3>
        </div>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleNext} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-sm text-slate-300">
                {isSolar ? 'Step 1 of 3: Select your average monthly generator fuel & NEPA bill:' :
                 isAuto ? 'Step 1 of 3: Select vehicle production year category:' :
                 isRealEstate ? 'Step 1 of 3: Select target monthly budget or property type:' :
                 'Step 1 of 3: What is the primary service your clients request quotes for?'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  isSolar ? '₦80,000 - ₦150,000 / month' : isAuto ? '2016 - 2019 Models' : isRealEstate ? '₦25M - ₦50M (Lekki / Ikeja)' : 'Standard Commercial Package',
                  isSolar ? '₦150,000 - ₦300,000 / month' : isAuto ? '2020 - 2023 Models' : isRealEstate ? '₦50M - ₦120M (Ikoyi / VI)' : 'Premium Enterprise Package',
                  isSolar ? '₦300,000+ / month (Industrial)' : isAuto ? '2024+ Brand New / Luxury' : isRealEstate ? '₦120M+ Luxury Waterfront' : 'Custom Tailored Solution'
                ].map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setSelectedSpend(opt); setStep(2); }}
                    className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all duration-200 ${
                      selectedSpend === opt 
                        ? 'border-sky-500 bg-sky-500/10 text-sky-300 shadow-lg shadow-sky-500/10' 
                        : 'border-slate-800 bg-slate-800/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-sm text-slate-300">
                {isSolar ? 'Step 2 of 3: Select essential equipment to run during power outages:' :
                 isAuto ? 'Step 2 of 3: Select clearing terminal:' :
                 'Step 2 of 3: Preferred response speed for customer inquiries:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  isSolar ? 'Lighting + TV + Fans + Laptops' : 'Tin Can Island Port / Apapa',
                  isSolar ? '1-2 ACs + Freezers + Lighting' : 'PTML Roll-on Roll-off Terminal',
                  isSolar ? 'Central ACs + Pumping Machine' : 'Direct Inter-State Haulage'
                ].map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setSelectedAppliance(opt); setStep(3); }}
                    className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all duration-200 ${
                      selectedAppliance === opt 
                        ? 'border-sky-500 bg-sky-500/10 text-sky-300 shadow-lg shadow-sky-500/10' 
                        : 'border-slate-800 bg-slate-800/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-sm text-slate-300">
                Step 3 of 3: Where should we send your instant calculation breakdown & PDF quote?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0803 123 4567 (WhatsApp Number)"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
                >
                  <span>Unlock Instant Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Calculation Results Ready for {businessName}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-700/40 text-sm">
              <div>
                <div className="text-slate-400 text-xs">Recommended Setup</div>
                <div className="font-bold text-white mt-0.5">{solarRes.kva}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">Estimated Monthly Savings</div>
                <div className="font-bold text-emerald-400 mt-0.5">{solarRes.savings}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">Battery Bank Requirement</div>
                <div className="font-bold text-sky-400 mt-0.5">{solarRes.batteries}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>₦0 Upfront Preview · Verified Bethelmind Analytics Lagos Desk</span>
            </div>
            <a
              href={`https://wa.me/2348022791227?text=${waLeadMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Claim This Live Setup on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
