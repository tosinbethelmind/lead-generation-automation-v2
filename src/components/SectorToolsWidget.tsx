'use client';

import React, { useState, useEffect } from 'react';
import { SocialAdAutomationWidget } from './SocialAdAutomationWidget';
import { RecruitmentEngineWidget } from './RecruitmentEngineWidget';
import { WebappToolActionBar } from './WebappToolActionBar';
import { KineticNumber } from './interactive/KineticNumber';
import { ExecutivePdfQuoteModal } from './ExecutivePdfQuoteModal';
import { 
  buildSectorWhatsAppQuoteMessage,
  generateSolarBOQ,
  calculateCustomsDutyTokunbo,
  calculateMortgageAmortization,
  calculateSchoolTuitionAndPin,
  calculateHmoCoPayAndTelehealth,
  calculateLogisticsDeliveryFee,
  calculateCacFilingFees,
  calculateShortletBookingAndCaution
} from '@/lib/sectorModules';
import { Code, Copy, Check, MessageCircle, Sparkles, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

export type SectorToolTab = 
  | 'solar' 
  | 'auto' 
  | 'mortgage' 
  | 'healthcare' 
  | 'education' 
  | 'logistics' 
  | 'legal' 
  | 'hospitality' 
  | 'dva' 
  | 'social_ads' 
  | 'recruitment';

interface SectorToolsWidgetProps {
  businessCategory?: string;
  businessName?: string;
  merchantPhone?: string;
  hasWebsite?: boolean;
}

export function detectCategoryTab(category: string = ''): SectorToolTab {
  const c = category.toLowerCase();
  if (/solar|inverter|energy|battery|power|panel|clean energy/.test(c)) return 'solar';
  if (/hotel|shortlet|apartment|suite|hospitality|resort|lodge|dining|lounge|restaurant|bar|cafe/.test(c)) return 'hospitality';
  if (/(\bcar\b|\bcars\b|auto|motor|vehicle|tokunbo|dealership|mechanic|garage|tyre|spare)/.test(c)) return 'auto';
  if (/estate|property|home|realty|housing|developer|land|mansion/.test(c)) return 'mortgage';
  if (/clinic|medical|doctor|health|\bhospitals?\b|pharmacy|dental|dentist|eye|optician|lab|surgery|hmo/.test(c)) return 'healthcare';
  if (/school|academy|education|college|creche|tutor|university|institute/.test(c)) return 'education';
  if (/logistics|haulage|courier|dispatch|delivery|freight|cargo|truck|transport/.test(c)) return 'logistics';
  if (/law|legal|attorney|solicitor|advocate|barrister|cac|chamber/.test(c)) return 'legal';
  if (/recruit|talent|hr|staff|hiring/.test(c)) return 'recruitment';
  if (/social|ad|marketing|agency/.test(c)) return 'social_ads';
  return 'solar';
}


export function FeatureShareBar({ toolTitle, toolSlug, description }: { toolTitle: string; toolSlug: string; description: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/tools/${toolSlug}` : `https://www.bethelmindanalytics.com/tools/${toolSlug}`;
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
  businessCategory = 'Solar & Renewable Energy',
  businessName = 'Bethelmind Demo',
  merchantPhone = '2348022791227',
  hasWebsite = false,
}: SectorToolsWidgetProps) {
  const initialTab = detectCategoryTab(businessCategory);
  const [activeTab, setActiveTab] = useState<SectorToolTab>(initialTab);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Keep activeTab in sync if businessCategory changes
  useEffect(() => {
    setActiveTab(detectCategoryTab(businessCategory));
    setResult(null);
  }, [businessCategory]);

  // Sector states
  // Solar
  const [kva, setKva] = useState(5);
  const [discoBand, setDiscoBand] = useState<'Band A' | 'Band B' | 'Band C'>('Band A');
  const [dieselLiters, setDieselLiters] = useState(250);

  // Auto
  const [cifValue, setCifValue] = useState(8500000);
  const [vin, setVin] = useState('1HGCR2F83JA000000');

  // Real Estate
  const [propertyPrice, setPropertyPrice] = useState(45000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [tenureYears, setTenureYears] = useState(10);

  // Healthcare
  const [consultType, setConsultType] = useState<'general' | 'specialist' | 'emergency'>('specialist');
  const [hasHmo, setHasHmo] = useState(true);

  // Education
  const [termlyTuition, setTermlyTuition] = useState(180000);
  const [studentCount, setStudentCount] = useState(150);

  // Logistics
  const [originCity, setOriginCity] = useState('Lagos');
  const [destCity, setDestCity] = useState('Abuja');
  const [weightKg, setWeightKg] = useState(10);

  // Legal
  const [authorizedCapital, setAuthorizedCapital] = useState(1000000);
  const [companyType, setCompanyType] = useState<'ltd' | 'business_name' | 'incorporated_trustees'>('ltd');

  // Hospitality / Shortlet
  const [nightlyRate, setNightlyRate] = useState(75000);
  const [nightsCount, setNightsCount] = useState(3);

  // DVA
  const [amountNgn, setAmountNgn] = useState(25000);
  const [customerName, setCustomerName] = useState('Valued Lead');

  const handleRunCalculation = async (action: string, payload: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/sector-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
      } else {
        runClientFallback(action, payload);
      }
    } catch (_) {
      runClientFallback(action, payload);
    } finally {
      setLoading(false);
    }
  };

  const runClientFallback = (action: string, payload: any) => {
    try {
      if (action === 'solar_hybrid_economics' || action === 'solar_boq') {
        setResult(generateSolarBOQ(payload.kva || kva, 'lithium', 12));
      } else if (action === 'tokunbo_port_clearing' || action === 'tokunbo_duty') {
        setResult(calculateCustomsDutyTokunbo(2018, 2500, payload.cifNgn || cifValue));
      } else if (action === 'mortgage_amortization') {
        setResult(calculateMortgageAmortization(payload.propertyPriceNgn || propertyPrice, payload.downPaymentPercent || downPaymentPercent, 18, payload.tenureYears || tenureYears));
      } else if (action === 'school_tuition') {
        const tuitionVal = Number(payload.termlyTuitionNgn || termlyTuition);
        const studentVal = Number(payload.studentsCount || studentCount);
        const baseSchool = calculateSchoolTuitionAndPin('JSS 1', false, 3);
        setResult({
          ...baseSchool,
          grossTermRevenueNgn: tuitionVal * studentVal,
          resultCheckerPinRevenueNgn: studentVal * 2500,
        });
      } else if (action === 'hmo_telehealth' || action === 'healthcare_hmo') {
        const procCost = consultType === 'specialist' ? 35000 : consultType === 'emergency' ? 50000 : 15000;
        setResult(calculateHmoCoPayAndTelehealth('Reliance HMO', `${consultType} Consultation`, procCost));
      } else if (action === 'logistics_delivery') {
        setResult(calculateLogisticsDeliveryFee(originCity, destCity, weightKg));
      } else if (action === 'cac_filing' || action === 'cac_fees') {
        const entityTypeMap: Record<string, 'company_ltd' | 'business_name' | 'incorporated_trustee'> = {
          ltd: 'company_ltd',
          business_name: 'business_name',
          incorporated_trustees: 'incorporated_trustee',
        };
        setResult(calculateCacFilingFees(entityTypeMap[companyType] || 'company_ltd', Number(payload.shareCapitalNgn || authorizedCapital)));
      } else if (action === 'shortlet_booking') {
        setResult(calculateShortletBookingAndCaution(nightlyRate, nightsCount, 30000));
      }
    } catch (err) {
      console.warn('Fallback calculation failed:', err);
    }
  };

  // Embed Snippet
  const embedCodeSnippet = `<!-- Bethelmind 24/7 AI ${businessCategory} Engine Embed (₦35k Upgrade) -->
<div id="bethelmind-tool-embed" data-tool="${activeTab}" data-merchant="${encodeURIComponent(businessName)}"></div>
<script src="https://www.bethelmindanalytics.com/embed.js" async></script>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  return (
    <div className="w-full space-y-4">
      <WebappToolActionBar currentTool={activeTab} />
      <div className="w-full max-w-4xl mx-auto my-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 font-sans">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-white">
                  ⚡ 24/7 Quoting Engine 2026
                </span>
                <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-full text-[11px] font-black">
                  ₦0 Upfront Demo
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Interactive {businessCategory} Quoting & Booking Suite
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                Custom built for <strong className="text-white underline">{businessName}</strong>. Test live instant pricing, customer BOQs, and WhatsApp dispatch.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEmbedModal(true)}
                className="px-3.5 py-2 bg-slate-950/70 hover:bg-slate-950 text-white rounded-xl text-xs font-bold border border-slate-700/80 flex items-center gap-1.5 transition-all"
                title="Embed on existing WordPress/Wix website"
              >
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                <span>1-Line Embed Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950 p-2 gap-1.5 scrollbar-none">
          <button
            onClick={() => { setActiveTab('solar'); setResult(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'solar' ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ☀️ Solar BOQ & ROI
          </button>
          <button
            onClick={() => { setActiveTab('auto'); setResult(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'auto' ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🚗 Tokunbo Duty & VIN
          </button>
          <button
            onClick={() => { setActiveTab('mortgage'); setResult(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'mortgage' ? 'bg-teal-500/20 border border-teal-400/50 text-teal-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏡 Real Estate Mortgage
          </button>
          <button
            onClick={() => { setActiveTab('healthcare'); setResult(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'healthcare' ? 'bg-rose-500/20 border border-rose-400/50 text-rose-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏥 Clinic & HMO Booking
          </button>
          <button
            onClick={() => { setActiveTab('education'); setResult(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'education' ? 'bg-purple-500/20 border border-purple-400/50 text-purple-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎓 School Tuition & Result PIN
          </button>
          <button
            onClick={() => { setActiveTab('logistics'); setResult(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'logistics' ? 'bg-indigo-500/20 border border-indigo-400/50 text-indigo-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📦 Logistics & Freight
          </button>
          <button
            onClick={() => { setActiveTab('legal'); setResult(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'legal' ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚖️ Legal & CAC Fees
          </button>
          <button
            onClick={() => { setActiveTab('hospitality'); setResult(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'hospitality' ? 'bg-amber-600/20 border border-amber-500/50 text-amber-300 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏨 Shortlet & Apartments
          </button>
          <button
            onClick={() => { setActiveTab('dva'); setResult(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'dva' ? 'bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏦 DVA Instant Bank Transfer
          </button>
        </div>

        {/* Tab Panels */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* SOLAR TAB */}
          {activeTab === 'solar' && (
            <div className="space-y-4">
              <FeatureShareBar toolTitle="Solar BOQ & DISCO ROI Calculator" toolSlug="solar-boq" description="BOQ Sizing & Diesel vs Solar Savings Estimator" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Appliance Load (kVA)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
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
                    <option value="Band A">Band A (20+ hrs @ ₦209.50/kWh)</option>
                    <option value="Band B">Band B (16 hrs @ ₦160/kWh)</option>
                    <option value="Band C">Band C (12 hrs @ ₦120/kWh)</option>
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
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Calculating Solar Economics...' : '⚡ Generate Live Solar BOQ & ROI Quote'}
              </button>

              {result && (
                <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs text-amber-400 font-bold uppercase">Solar Hybrid Economics Result</span>
                    <span className="text-xs text-slate-400">DISCO {result.discoBand || discoBand}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <p className="text-xs text-slate-400">Estimated Setup BOQ</p>
                      <p className="text-lg font-bold text-amber-400">
                        <KineticNumber prefix="₦" value={result.solarSetupCost || result.grandTotal || 4500000} />
                      </p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <p className="text-xs text-slate-400">50% Deposit (Locks In)</p>
                      <p className="text-lg font-bold text-emerald-400">
                        <KineticNumber prefix="₦" value={result.deposit50Percent || Math.round((result.solarSetupCost || 4500000) * 0.5)} />
                      </p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <p className="text-xs text-slate-400">Monthly Net Savings</p>
                      <p className="text-lg font-bold text-teal-400">
                        <KineticNumber prefix="₦" value={result.netMonthlySavings || 185000} suffix="/mo" />
                      </p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <p className="text-xs text-slate-400">Payback Period</p>
                      <p className="text-lg font-bold text-blue-400">
                        {result.paybackPeriodMonths || 14} Months
                      </p>
                    </div>
                  </div>

                  {/* High-Conversion WhatsApp and PDF Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <a
                      href={buildSectorWhatsAppQuoteMessage(
                        businessName,
                        'Solar & Inverter Energy',
                        `${kva}kVA Hybrid Solar BOQ`,
                        `Estimated BOQ: ₦${(result.solarSetupCost || result.grandTotal || 4500000).toLocaleString()} (50% Deposit: ₦${Math.round((result.solarSetupCost || result.grandTotal || 4500000) * 0.5).toLocaleString()})`,
                        merchantPhone
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>🟢 Send Quote to WhatsApp & Claim Prototype →</span>
                    </a>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Solar & Renewable Energy"
                      toolType={`Solar Hybrid ${kva}kVA BOQ & Energy Audit`}
                      claimFeeNgn={150000}
                      depositFeeNgn={75000}
                      adminPhone={merchantPhone}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AUTOMOTIVE TAB */}
          {activeTab === 'auto' && (
            <div className="space-y-4">
              <FeatureShareBar toolTitle="Tokunbo Duty & Port Clearance Calculator" toolSlug="tokunbo-duty" description="NCS 2026 Valuation, VIN Decoder & Clearing Fee Calculator" />
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
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Calculating Port Duties...' : '🚗 Calculate Customs Duty & Terminal Clearing'}
              </button>

              {result && (
                <div className="bg-slate-950 border border-blue-500/30 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs text-blue-400 font-bold uppercase">NCS 2026 Clearing Duty Breakdown</span>
                    <span className="text-xs text-slate-400">{result.selectedPort?.portName || 'Tin Can Island'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Duty + NAC + VAT</span>
                      <span className="text-base font-bold text-blue-300">
                        <KineticNumber prefix="₦" value={result.selectedPort?.customsDutyNgn || result.totalDutyAndLeviesNgn || 2150000} />
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Terminal & Demurrage</span>
                      <span className="text-base font-bold text-slate-300">
                        <KineticNumber prefix="₦" value={result.selectedPort?.terminalDemurrageNgn || 450000} />
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Total Est. Clearance</span>
                      <span className="text-base font-bold text-emerald-400">
                        <KineticNumber prefix="₦" value={result.selectedPort?.totalClearingCostNgn || result.estimatedPortClearingTotalNgn || 2600000} />
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <a
                      href={buildSectorWhatsAppQuoteMessage(
                        businessName,
                        'Automotive & Tokunbo',
                        'Tokunbo Customs Duty & Port Clearing',
                        `Estimated Duty & Clearance: ₦${(result.selectedPort?.totalClearingCostNgn || 2600000).toLocaleString()}`,
                        merchantPhone
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>🟢 Send Quote to WhatsApp & Claim Prototype →</span>
                    </a>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Automotive & Tokunbo Importer"
                      toolType="Tokunbo Customs Tariff & Port Clearance Assessment"
                      claimFeeNgn={150000}
                      depositFeeNgn={75000}
                      adminPhone={merchantPhone}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* REAL ESTATE MORTGAGE TAB */}
          {activeTab === 'mortgage' && (
            <div className="space-y-4">
              <FeatureShareBar toolTitle="Real Estate Mortgage & Diaspora Escrow Sizer" toolSlug="mortgage-calc" description="Calculate Down Payments, Monthly Installments & Diaspora Off-Plan Milestone Schedules" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Property Value (NGN)</label>
                  <input
                    type="number"
                    value={propertyPrice}
                    onChange={e => setPropertyPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Down Payment (%)</label>
                  <input
                    type="number"
                    value={downPaymentPercent}
                    onChange={e => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tenure (Years)</label>
                  <input
                    type="number"
                    value={tenureYears}
                    onChange={e => setTenureYears(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  handleRunCalculation('mortgage_amortization', {
                    propertyPriceNgn: propertyPrice,
                    downPaymentPercent,
                    interestRatePercent: 18,
                    tenureYears,
                  })
                }
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Calculating Mortgage...' : '🏡 Calculate Down Payment & Monthly Repayments'}
              </button>

              {result && (
                <div className="bg-slate-950 border border-teal-500/30 rounded-2xl p-5 space-y-3">
                  <p className="text-xs text-teal-400 font-bold uppercase">Property Loan Amortization</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Down Payment</span>
                      <span className="text-sm font-bold text-slate-100">
                        <KineticNumber prefix="₦" value={result.downPaymentNgn || (propertyPrice * downPaymentPercent / 100)} />
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Monthly Repayment</span>
                      <span className="text-sm font-bold text-teal-300">
                        <KineticNumber prefix="₦" value={result.monthlyPaymentNgn || 540000} suffix="/mo" />
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Total Interest</span>
                      <span className="text-sm font-bold text-slate-400">
                        <KineticNumber prefix="₦" value={result.totalInterestPayableNgn || 18200000} />
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <a
                      href={buildSectorWhatsAppQuoteMessage(
                        businessName,
                        'Real Estate & Properties',
                        'Mortgage Amortization Schedule',
                        `Down Payment: ₦${(result.downPaymentNgn || 9000000).toLocaleString()}, Monthly Repayment: ₦${(result.monthlyPaymentNgn || 540000).toLocaleString()}/mo`,
                        merchantPhone
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>🟢 Send Quote to WhatsApp & Claim Prototype →</span>
                    </a>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Real Estate & Property Development"
                      toolType="Property Mortgage Amortization & Installment Schedule"
                      claimFeeNgn={150000}
                      depositFeeNgn={75000}
                      adminPhone={merchantPhone}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HEALTHCARE & CLINICS TAB */}
          {activeTab === 'healthcare' && (
            <div className="space-y-4">
              <FeatureShareBar toolTitle="Clinic Patient Booking & HMO Co-Pay Estimator" toolSlug="clinic-booking" description="Instant Consultation Scheduling, HMO Co-Pay Calculation & WhatsApp Telehealth Triaging" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Consultation Type</label>
                  <select
                    value={consultType}
                    onChange={e => setConsultType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="general">General Outpatient (GOPD)</option>
                    <option value="specialist">Specialist / Consultant</option>
                    <option value="emergency">Urgent Care / Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">HMO Insurance Coverage</label>
                  <select
                    value={hasHmo ? 'yes' : 'no'}
                    onChange={e => setHasHmo(e.target.value === 'yes')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="yes">Covered under HMO (10% Co-Pay)</option>
                    <option value="no">Private Out-of-Pocket Payment</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleRunCalculation('hmo_telehealth', { consultationType: consultType, hasHmo, labTestsCount: 1 })}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Estimating Clinic Fee...' : '🏥 Calculate Clinic Consultation & Book Slot'}
              </button>

              {result && (
                <div className="bg-slate-950 border border-rose-500/30 rounded-2xl p-5 space-y-3">
                  <p className="text-xs text-rose-400 font-bold uppercase">Clinic Triage & Booking Estimate</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Total Hospital Bill</span>
                      <span className="text-base font-bold text-slate-100">
                        ₦{(result.totalEstimatedBillNgn || 25000).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Patient Co-Pay</span>
                      <span className="text-base font-bold text-rose-400">
                        ₦{(result.patientPayableNgn || 2500).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Booking Status</span>
                      <span className="text-xs font-bold text-emerald-400">
                        Slot Reserved ({result.appointmentCode || 'MED-4821'})
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <a
                      href={buildSectorWhatsAppQuoteMessage(
                        businessName,
                        'Healthcare & Clinics',
                        'Patient Consultation Booking',
                        `Consultation: ${consultType.toUpperCase()} (Patient Co-Pay: ₦${(result.patientPayableNgn || 2500).toLocaleString()})`,
                        merchantPhone
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>🟢 Send Booking to WhatsApp & Claim Prototype →</span>
                    </a>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Healthcare Clinics & Medical"
                      toolType="Clinic Patient Booking & HMO Co-Pay Schedule"
                      claimFeeNgn={150000}
                      depositFeeNgn={75000}
                      adminPhone={merchantPhone}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EDUCATION & SCHOOLS TAB */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <FeatureShareBar toolTitle="Termly School Tuition & Result PIN Portal Sizer" toolSlug="school-tuition" description="Automated Termly Fee Ledger, Online Admission Portal & Instant Scratch PIN Generator" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Average Termly Tuition (NGN)</label>
                  <input
                    type="number"
                    value={termlyTuition}
                    onChange={e => setTermlyTuition(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Enrolled Students Count</label>
                  <input
                    type="number"
                    value={studentCount}
                    onChange={e => setStudentCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRunCalculation('school_tuition', { termlyTuitionNgn: termlyTuition, studentsCount: studentCount })}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Calculating Tuition Ledger...' : '🎓 Calculate School Fee Collection & PIN Portal'}
              </button>

              {result && (
                <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-5 space-y-3">
                  <p className="text-xs text-purple-400 font-bold uppercase">School Termly Revenue & PIN Ledger</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Gross Term Tuition</span>
                      <span className="text-sm font-bold text-slate-100">
                        ₦{(result.grossTermRevenueNgn || termlyTuition * studentCount).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Result PIN Revenue</span>
                      <span className="text-sm font-bold text-purple-300">
                        ₦{(result.resultCheckerPinRevenueNgn || 375000).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Direct OPay Gateway</span>
                      <span className="text-xs font-bold text-emerald-400">
                        0% Commission (Instant Settlement)
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <a
                      href={buildSectorWhatsAppQuoteMessage(
                        businessName,
                        'Schools & Academies',
                        'Tuition & Online Result Portal',
                        `Expected Term Tuition: ₦${(result.grossTermRevenueNgn || 27000000).toLocaleString()} (Students: ${studentCount})`,
                        merchantPhone
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>🟢 Send Quote to WhatsApp & Claim Prototype →</span>
                    </a>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Schools & Education"
                      toolType="School Tuition Ledger & Automated Result PIN Portal"
                      claimFeeNgn={150000}
                      depositFeeNgn={75000}
                      adminPhone={merchantPhone}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LOGISTICS & FREIGHT TAB */}
          {activeTab === 'logistics' && (
            <div className="space-y-4">
              <FeatureShareBar toolTitle="Inter-State Logistics & Haulage Waybill Estimator" toolSlug="logistics-waybill" description="Dynamic Waybill Sizing, Interstate Fuel Calculation & Dispatch Tracking" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Origin Hub</label>
                  <input
                    type="text"
                    value={originCity}
                    onChange={e => setOriginCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Destination Hub</label>
                  <input
                    type="text"
                    value={destCity}
                    onChange={e => setDestCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Cargo Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={e => setWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRunCalculation('logistics_delivery', { originCity, destinationCity: destCity, weightKg })}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Estimating Waybill...' : '📦 Calculate Inter-State Waybill & Delivery Fee'}
              </button>

              {result && (
                <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-5 space-y-3">
                  <p className="text-xs text-indigo-400 font-bold uppercase">Waybill & Freight Estimate</p>
                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Intra-City Delivery</span>
                      <span className="text-base font-bold text-slate-100">
                        ₦{(result.intraCityCourierFeeNgn || 3500).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Inter-State Waybill</span>
                      <span className="text-base font-bold text-indigo-400">
                        ₦{(result.interStateWaybillFeeNgn || 18500).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <a
                      href={buildSectorWhatsAppQuoteMessage(
                        businessName,
                        'Logistics & Haulage',
                        'Inter-State Waybill Fee',
                        `${originCity} to ${destCity} (${weightKg}kg): ₦${(result.interStateWaybillFeeNgn || 18500).toLocaleString()}`,
                        merchantPhone
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>🟢 Send Quote to WhatsApp & Claim Prototype →</span>
                    </a>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Logistics & Haulage"
                      toolType="Interstate Waybill & Cargo Delivery Schedule"
                      claimFeeNgn={150000}
                      depositFeeNgn={75000}
                      adminPhone={merchantPhone}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LEGAL & CAC TAB */}
          {activeTab === 'legal' && (
            <div className="space-y-4">
              <FeatureShareBar toolTitle="CAC Business Registration & Stamp Duty Calculator" toolSlug="cac-filing" description="Official Corporate Affairs Commission Statutory Fees & FIRS Stamp Duty" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Business Entity Type</label>
                  <select
                    value={companyType}
                    onChange={e => setCompanyType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="business_name">Business Name (Sole Proprietorship / Enterprise)</option>
                    <option value="ltd">Private Limited Company (LTD)</option>
                    <option value="incorporated_trustees">Incorporated Trustees (NGO / Church / Club)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Authorized Share Capital (NGN)</label>
                  <input
                    type="number"
                    value={authorizedCapital}
                    onChange={e => setAuthorizedCapital(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRunCalculation('cac_filing', { shareCapitalNgn: authorizedCapital, entityType: companyType })}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Calculating CAC Filing Fees...' : '⚖️ Calculate Statutory CAC & Stamp Duty'}
              </button>

              {result && (
                <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                  <p className="text-xs text-emerald-400 font-bold uppercase">CAC & Legal Filing Assessment</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">CAC Filing Fee</span>
                      <span className="text-sm font-bold text-slate-100">
                        ₦{(result.cacFilingFeeNgn || result.cacFilingFee || 15000).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Stamp Duty (FIRS)</span>
                      <span className="text-sm font-bold text-emerald-300">
                        ₦{(result.stampDutyNgn || result.firsStampDuty || 7500).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Total Statutory</span>
                      <span className="text-sm font-bold text-emerald-400">
                        ₦{(result.totalStatutoryCostNgn || result.totalCost || 22500).toLocaleString()}
                      </span>
                    </div>
                  </div>


                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <a
                      href={buildSectorWhatsAppQuoteMessage(
                        businessName,
                        'Legal & CAC Services',
                        'CAC Statutory Filing & Stamp Duty',
                        `Total Statutory Filing: ₦${(result.totalStatutoryCostNgn || 22500).toLocaleString()}`,
                        merchantPhone
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>🟢 Send Quote to WhatsApp & Claim Prototype →</span>
                    </a>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Law Firms & Legal Practitioners"
                      toolType="CAC Registration & Legal Retainer Proposal"
                      claimFeeNgn={150000}
                      depositFeeNgn={75000}
                      adminPhone={merchantPhone}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HOSPITALITY & SHORTLET TAB */}
          {activeTab === 'hospitality' && (
            <div className="space-y-4">
              <FeatureShareBar toolTitle="Shortlet Direct Booking & Caution Fee Reconciler" toolSlug="shortlet-booking" description="Zero-OTA Direct Booking, Caution Deposit Escrow & Automatic WhatsApp Check-In" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nightly Rate (NGN)</label>
                  <input
                    type="number"
                    value={nightlyRate}
                    onChange={e => setNightlyRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Duration of Stay (Nights)</label>
                  <input
                    type="number"
                    value={nightsCount}
                    onChange={e => setNightsCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRunCalculation('shortlet_booking', { nightlyRateNgn: nightlyRate, nightsCount, cautionDepositNgn: 30000 })}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Calculating Booking...' : '🏨 Calculate Direct Booking & Lock Reservation'}
              </button>

              {result && (
                <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 space-y-3">
                  <p className="text-xs text-amber-400 font-bold uppercase">Direct Stay & Caution Deposit Breakdown</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Accommodation</span>
                      <span className="text-sm font-bold text-slate-100">
                        ₦{(result.accommodationSubtotalNgn || result.accommodationTotalNgn || nightlyRate * nightsCount).toLocaleString()}
                      </span>

                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Caution Deposit</span>
                      <span className="text-sm font-bold text-amber-300">
                        ₦{(result.cautionDepositNgn || 30000).toLocaleString()} (Refundable)
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Total Due</span>
                      <span className="text-sm font-bold text-emerald-400">
                        ₦{(result.grandTotalNgn || (nightlyRate * nightsCount + 30000)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <a
                      href={buildSectorWhatsAppQuoteMessage(
                        businessName,
                        'Hotels & Shortlet Apartments',
                        'Direct Stay Reservation',
                        `Nights: ${nightsCount} @ ₦${nightlyRate.toLocaleString()}/night. Total: ₦${(result.grandTotalNgn || (nightlyRate * nightsCount + 30000)).toLocaleString()}`,
                        merchantPhone
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>🟢 Send Booking to WhatsApp & Claim Prototype →</span>
                    </a>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Hotels & Shortlet Apartments"
                      toolType="Direct Shortlet Booking & Caution Fee Agreement"
                      claimFeeNgn={150000}
                      depositFeeNgn={75000}
                      adminPhone={merchantPhone}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DVA VIRTUAL ACCOUNT TAB */}
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
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Generating DVA Account...' : '🏦 Generate Moniepoint Virtual Account (Instant Transfer)'}
              </button>

              {result && (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs text-emerald-400 font-bold uppercase">Dynamic Virtual Account (DVA) Generated</span>
                    <span className="text-xs text-slate-400">Direct NIP Transfer</span>
                  </div>

                  <div className="bg-slate-900 border border-emerald-500/20 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Settlement Bank</span>
                      <span className="text-sm font-bold text-emerald-300">OPay Digital Services / Moniepoint</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Account Number</span>
                      <span className="text-xl font-black text-white tracking-widest">7034297995</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Beneficiary Name</span>
                      <span className="text-xs font-semibold text-slate-200">Oyelakin Tosin Matthew</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-center">
                    💡 All customer payments clear in real time with 0% risk of fake credit alerts.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 1-Line Embed Modal (For Existing Websites - ₦35k Upgrade) */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg font-bold">💻</span>
                <h3 className="text-base font-bold text-white">1-Line Script Embed Upgrade (₦35,000)</h3>
              </div>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Already have an active website on WordPress, Wix, or custom hosting? Keep your existing hosting, domain, and SEO rankings 100% untouched. Paste this 1-line script right before your <code className="text-cyan-400 font-mono">&lt;/body&gt;</code> tag:
            </p>

            <div className="relative bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
              <pre className="whitespace-pre-wrap">{embedCodeSnippet}</pre>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={copyEmbedCode}
                className="flex-1 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEmbed ? 'Copied to Clipboard!' : 'Copy 1-Line Embed Code'}</span>
              </button>

              <a
                href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Lagos Desk! I want to order the 1-Line Script Embed Upgrade (₦35,000) for *${businessName}*. Please send payment details and setup instructions!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order Embed Upgrade →</span>
              </a>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Includes 24/7 AI WhatsApp assistant hook, zero-latency CDN hosting, and 48-hour SLA.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SectorToolsWidget;
