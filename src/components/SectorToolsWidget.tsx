'use client';

import React, { useState } from 'react';
import { SocialAdAutomationWidget } from './SocialAdAutomationWidget';
import { RecruitmentEngineWidget } from './RecruitmentEngineWidget';
import { WebappToolActionBar } from './WebappToolActionBar';

interface SectorToolsWidgetProps {
  businessCategory?: string;
  businessName?: string;
  merchantPhone?: string;
}

export function FeatureShareBar({ toolTitle, toolSlug, description }: { toolTitle: string; toolSlug: string; description: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/tools/${toolSlug}` : `https://apexreach.app/tools/${toolSlug}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this free 24-Hour ${toolTitle} Tool (${description}): ${shareUrl}`)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs mb-4">
      <div className="flex items-center space-x-2">
        <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg font-bold">🔗</span>
        <div>
          <span className="font-bold text-white">Direct Tool & Bookmark Link: </span>
          <span className="text-slate-400 font-mono text-[11px]">{shareUrl}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/50 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1"
        >
          <span>📲 Share on WhatsApp</span>
        </a>
        <button
          onClick={handleCopy}
          className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:bg-blue-600/50 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1"
        >
          <span>{copied ? 'Copied Link! 🔗' : 'Copy Shareable Link'}</span>
        </button>
      </div>
    </div>
  );
}

export function SectorToolsWidget({
  businessCategory = 'Solar',
  businessName = 'ApexReach Demo',
  merchantPhone = '08012345678',
}: SectorToolsWidgetProps) {
  const [activeTab, setActiveTab] = useState<
    'solar' | 'auto' | 'legal' | 'dva' | 'logistics' | 'mortgage' | 'pidgin' | 'social_ads' | 'recruitment'
  >('recruitment');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Solar state
  const [kva, setKva] = useState(5);
  const [discoBand, setDiscoBand] = useState<'Band A' | 'Band B' | 'Band C'>('Band A');
  const [dieselLiters, setDieselLiters] = useState(250);

  // Auto state
  const [cifValue, setCifValue] = useState(8500000);
  const [vin, setVin] = useState('1HGCR2F83JA000000');

  // DVA Virtual Account state
  const [amountNgn, setAmountNgn] = useState(25000);
  const [customerName, setCustomerName] = useState('Valued Lead');

  // Pidgin AI state
  const [aiTone, setAiTone] = useState<'pidgin' | 'friendly' | 'corporate'>('pidgin');

  const handleRunCalculation = async (action: string, payload: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/sector-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Calculation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <WebappToolActionBar currentTool={activeTab} />
      <div className="w-full max-w-4xl mx-auto my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-white mb-2">
              ApexReach Revenue Engine 2026
            </span>
            <h2 className="text-2xl font-bold text-white">Interactive Sector Calculator & Trust Suite</h2>
            <p className="text-blue-100 text-sm mt-1">
              Select a sector engine to test live estimates and payment generators for {businessName}
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Nigerian API Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950 p-2 gap-1 scrollbar-none">
        <button
          onClick={() => {
            setActiveTab('recruitment');
            setResult(null);
          }}
          className={`px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'recruitment' ? 'bg-cyan-600/30 border border-cyan-500/50 text-cyan-300 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          💼 AI Recruitment & Talent Engine
        </button>
        <button
          onClick={() => {
            setActiveTab('social_ads');
            setResult(null);
          }}
          className={`px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'social_ads' ? 'bg-blue-600/30 border border-blue-500/50 text-blue-300' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📱 AI Social Media & Ad Launcher
        </button>
        <button
          onClick={() => {
            setActiveTab('solar');
            setResult(null);
          }}
          className={`px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'solar' ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚡ Solar & DISCO Band ROI
        </button>
        <button
          onClick={() => {
            setActiveTab('auto');
            setResult(null);
          }}
          className={`px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'auto' ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🚗 Tokunbo Port Clearing
        </button>
        <button
          onClick={() => {
            setActiveTab('dva');
            setResult(null);
          }}
          className={`px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'dva' ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏦 Instant Virtual Account (DVA)
        </button>
        <button
          onClick={() => {
            setActiveTab('pidgin');
            setResult(null);
          }}
          className={`px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'pidgin' ? 'bg-purple-500/20 border border-purple-400/50 text-purple-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🇳🇬 Nigerian AI Tone (Pidgin)
        </button>
        <button
          onClick={() => {
            setActiveTab('logistics');
            setResult(null);
          }}
          className={`px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'logistics' ? 'bg-indigo-500/20 border border-indigo-400/50 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📦 Inter-State Logistics
        </button>
        <button
          onClick={() => {
            setActiveTab('mortgage');
            setResult(null);
          }}
          className={`px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'mortgage' ? 'bg-teal-500/20 border border-teal-400/50 text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏡 Mortgage Amortization
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6 space-y-6">
        {/* RECRUITMENT TAB */}
        {activeTab === 'recruitment' && (
          <div className="space-y-4">
            <FeatureShareBar toolTitle="24-Hour AI Recruitment Engine" toolSlug="recruitment" description="24-Hour Fast Hiring, WhatsApp Voice Note Screening & AI CV Grader" />
            <RecruitmentEngineWidget />
          </div>
        )}
        {/* SOLAR TAB */}
        {activeTab === 'solar' && (
          <div className="space-y-4">
            <FeatureShareBar toolTitle="Solar BOQ & DISCO ROI Calculator" toolSlug="solar-boq" description="BOQ Sizing & Diesel vs Solar Savings Estimator" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Appliance Load (kVA)</label>
                <input
                  type="number"
                  value={kva}
                  onChange={e => setKva(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">NERC DISCO Band</label>
                <select
                  value={discoBand}
                  onChange={e => setDiscoBand(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Band A">Band A (20 hrs grid @ ₦209/kWh)</option>
                  <option value="Band B">Band B (16 hrs grid @ ₦160/kWh)</option>
                  <option value="Band C">Band C (12 hrs grid @ ₦120/kWh)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Monthly Diesel (Liters)</label>
                <input
                  type="number"
                  value={dieselLiters}
                  onChange={e => setDieselLiters(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              onClick={() =>
                handleRunCalculation('solar_hybrid_economics', {
                  discoBand,
                  kva,
                  monthlyDieselLiters: dieselLiters,
                })
              }
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
            >
              {loading ? 'Calculating Solar Economics...' : 'Calculate Solar Hybrid Savings & BOQ'}
            </button>

            {result && (
              <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs text-amber-400 font-semibold uppercase">Solar Hybrid Economics Result</span>
                  <span className="text-xs text-slate-400">DISCO {result.discoBand}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <p className="text-xs text-slate-400">Current Grid + Fuel</p>
                    <p className="text-lg font-bold text-red-400">₦{result.totalCurrentEnergyExpense?.toLocaleString()}/mo</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <p className="text-xs text-slate-400">Solar Setup BOQ</p>
                    <p className="text-lg font-bold text-amber-400">₦{result.solarSetupCost?.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <p className="text-xs text-slate-400">Lease-to-Own Payment</p>
                    <p className="text-lg font-bold text-blue-400">₦{result.monthlyLeasePayment?.toLocaleString()}/mo</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <p className="text-xs text-slate-400">Net Monthly Savings</p>
                    <p className="text-lg font-bold text-emerald-400">₦{result.netMonthlySavings?.toLocaleString()}/mo</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AUTOMOTIVE TAB */}
        {activeTab === 'auto' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">CIF Vehicle Value (NGN)</label>
                <input
                  type="number"
                  value={cifValue}
                  onChange={e => setCifValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">17-Digit Vehicle VIN</label>
                <input
                  type="text"
                  value={vin}
                  onChange={e => setVin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={() =>
                handleRunCalculation('tokunbo_port_clearing', {
                  year: 2018,
                  engineCc: 2500,
                  cifNgn: cifValue,
                  preferredPort: 'Tin Can',
                })
              }
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              {loading ? 'Calculating Port Duties...' : 'Calculate Port Customs Duty & Demurrage'}
            </button>

            {result && (
              <div className="bg-slate-950 border border-blue-500/30 rounded-2xl p-5 space-y-3">
                <p className="text-xs text-blue-400 font-semibold uppercase">NCS 2026 Clearing Duty Breakdown</p>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>Target Port:</span>
                    <span className="font-semibold text-slate-100">{result.selectedPort?.portName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customs Duty + NAC + VAT:</span>
                    <span className="font-semibold text-blue-300">₦{result.selectedPort?.customsDutyNgn?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Terminal Charges & Demurrage:</span>
                    <span className="font-semibold text-slate-400">₦{result.selectedPort?.terminalDemurrageNgn?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-bold text-emerald-400">
                    <span>Estimated Total Clearing:</span>
                    <span>₦{result.selectedPort?.totalClearingCostNgn?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIRTUAL ACCOUNT DVA TAB */}
        {activeTab === 'dva' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Customer / Lead Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Amount to Transfer (NGN)</label>
                <input
                  type="number"
                  value={amountNgn}
                  onChange={e => setAmountNgn(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={() =>
                handleRunCalculation('virtual_account_dva', {
                  merchantName: businessName,
                  amountNgn,
                  customerName,
                })
              }
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
            >
              {loading ? 'Generating DVA Account...' : 'Generate Moniepoint Virtual Account (Instant Transfer)'}
            </button>

            {result && (
              <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-emerald-400 font-semibold uppercase">Dynamic Virtual Account (DVA) Generated</span>
                  <span className="text-xs text-slate-400">Expires in 60 mins</span>
                </div>

                <div className="bg-slate-900 border border-emerald-500/20 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Bank Name</span>
                    <span className="text-sm font-bold text-emerald-300">{result.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Account Number</span>
                    <span className="text-xl font-black text-white tracking-widest">{result.accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Account Name</span>
                    <span className="text-xs font-semibold text-slate-200">{result.accountName}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-center">
                  💡 {result.paymentInstructionsText}
                </p>
              </div>
            )}
          </div>
        )}

        {/* NIGERIAN AI TONE TAB */}
        {activeTab === 'pidgin' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Select AI Outreach Tone</label>
              <select
                value={aiTone}
                onChange={e => setAiTone(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="pidgin">Business Pidgin English ("Hello Boss...")</option>
                <option value="friendly">Friendly Nigerian English ("Good day Chief...")</option>
                <option value="corporate">Corporate Professional ("Dear Sir/Madam...")</option>
              </select>
            </div>

            <button
              onClick={() =>
                handleRunCalculation('nigerian_ai_tone', {
                  businessName,
                  leadName: customerName,
                  tone: aiTone,
                })
              }
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              {loading ? 'Generating AI Tone...' : 'Format AI Outreach Template'}
            </button>

            {result && (
              <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs text-purple-400 font-semibold uppercase">{result.tone}</span>
                  <span className="text-xs text-slate-400">Subject: {result.subject}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl text-sm text-slate-200 whitespace-pre-wrap">
                  {result.messageBodyText}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LOGISTICS TAB */}
        {activeTab === 'logistics' && (
          <div className="space-y-4">
            <button
              onClick={() =>
                handleRunCalculation('logistics_delivery', {
                  originCity: 'Lagos',
                  destinationCity: 'Abuja',
                  weightKg: 5,
                })
              }
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              {loading ? 'Estimating Logistics...' : 'Estimate Inter-State & Intra-City Waybill Fees'}
            </button>

            {result && (
              <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-5 space-y-3">
                <p className="text-xs text-indigo-400 font-semibold uppercase">Waybill & Freight Estimate</p>
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <span className="text-xs text-slate-400 block">Intra-City Delivery</span>
                    <span className="text-base font-bold text-slate-100">₦{result.intraCityCourierFeeNgn?.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <span className="text-xs text-slate-400 block">Inter-State Waybill</span>
                    <span className="text-base font-bold text-indigo-400">₦{result.interStateWaybillFeeNgn?.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">Partner: {result.recommendedLogisticsPartner}</p>
              </div>
            )}
          </div>
        )}

        {/* MORTGAGE TAB */}
        {activeTab === 'mortgage' && (
          <div className="space-y-4">
            <button
              onClick={() =>
                handleRunCalculation('mortgage_amortization', {
                  propertyPriceNgn: 45000000,
                  downPaymentPercent: 20,
                  interestRatePercent: 18,
                  tenureYears: 10,
                })
              }
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              {loading ? 'Calculating Mortgage...' : 'Calculate Mortgage Down Payment & Monthly Repayments'}
            </button>

            {result && (
              <div className="bg-slate-950 border border-teal-500/30 rounded-2xl p-5 space-y-3">
                <p className="text-xs text-teal-400 font-semibold uppercase">Property Loan Amortization</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <span className="text-xs text-slate-400 block">Down Payment</span>
                    <span className="text-sm font-bold text-slate-100">₦{result.downPaymentNgn?.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <span className="text-xs text-slate-400 block">Monthly Repayment</span>
                    <span className="text-sm font-bold text-teal-300">₦{result.monthlyPaymentNgn?.toLocaleString()}/mo</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <span className="text-xs text-slate-400 block">Total Interest</span>
                    <span className="text-sm font-bold text-slate-400">₦{result.totalInterestPayableNgn?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SOCIAL ADS & AUTOMATION TAB */}
        {activeTab === 'social_ads' && (
          <div className="space-y-4">
            <SocialAdAutomationWidget
              businessName={businessName}
              category={businessCategory}
            />
          </div>
        )}
      </div>
    </div>
  );
}
