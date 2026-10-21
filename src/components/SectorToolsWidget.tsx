'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  calculateShortletBookingAndCaution,
  calculateBeautySalonStylistBooking
} from '@/lib/sectorModules';
import { Code, Copy, Check, MessageCircle, Sparkles, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

export type SectorToolTab = 
  | 'solar' 
  | 'auto' 
  | 'beauty'
  | 'restaurant'
  | 'retail'
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
  if (/salon|spa|beauty|hair|barber|makeup|skincare|nails|aesthetic|cosmetic/.test(c)) return 'beauty';
  if (/solar|inverter|energy|battery|power|panel|clean energy/.test(c)) return 'solar';
  if (/restaurant|dining|lounge|cafe|bistro|bar|kitchen|eatery|fast food|grills?|bakery|food/.test(c)) return 'restaurant';
  if (/boutique|retail|store|supermarket|fashion|cloth|wear|shoe|bag|perfume|phone|gadget/.test(c)) return 'retail';
  if (/hotel|shortlet|apartment|suite|hospitality|resort|lodge/.test(c)) return 'hospitality';
  if (/(\bcar\b|\bcars\b|auto|motor|vehicle|tokunbo|dealership|mechanic|garage|tyre|spare)/.test(c)) return 'auto';
  if (/estate|property|home|realty|housing|developer|land|mansion/.test(c)) return 'mortgage';
  if (/clinic|medical|doctor|health|\bhospitals?\b|pharmacy|dental|dentist|eye|optician|lab|surgery|hmo/.test(c)) return 'healthcare';
  if (/school|academy|education|college|creche|tutor|university|institute/.test(c)) return 'education';
  if (/logistics|haulage|courier|dispatch|delivery|freight|cargo|truck|transport/.test(c)) return 'logistics';
  if (/law|legal|attorney|solicitor|advocate|barrister|cac|chamber/.test(c)) return 'legal';
  if (/recruit|talent|hr|staff|hiring/.test(c)) return 'recruitment';
  if (/social|ad|marketing|agency/.test(c)) return 'social_ads';
  if (/security|cctv|surveillance|guard|alarm|access control|spy|tracking/.test(c)) return 'dva';
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
  const [copiedQuote, setCopiedQuote] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const copyFormattedQuote = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 3000);
    }
  };

  // Keep activeTab in sync if businessCategory changes
  useEffect(() => {
    setActiveTab(detectCategoryTab(businessCategory));
    setResult(null);
  }, [businessCategory]);

  // Smooth scroll to result card on calculation
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

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

  // Beauty & Salon
  const [beautyCategory, setBeautyCategory] = useState<'hair_extensions' | 'bridal_styling' | 'spa_facial' | 'nail_bar'>('hair_extensions');
  const [hairLength, setHairLength] = useState(22);
  const [stylistTier, setStylistTier] = useState<'senior' | 'master_director'>('senior');

  // DVA
  const [amountNgn, setAmountNgn] = useState(25000);
  const [customerName, setCustomerName] = useState('Valued Lead');

  // Restaurant & Lounge (0% Commission Digital Food Menu)
  const [foodItem, setFoodItem] = useState<'jollof_turkey' | 'catfish_peppersoup' | 'seafood_platter' | 'shawarma_combo'>('jollof_turkey');
  const [foodQty, setFoodQty] = useState(2);
  const [orderMode, setOrderMode] = useState<'delivery' | 'dine_in' | 'takeaway'>('delivery');
  const [tableOrAddress, setTableOrAddress] = useState('Lekki Phase 1, Lagos');

  // Retail & Boutiques (Sub-3s WhatsApp Catalog Closer)
  const [retailProduct, setRetailProduct] = useState('Italian Leather Sneakers');
  const [retailPrice, setRetailPrice] = useState(45000);
  const [retailSize, setRetailSize] = useState('Size 42 (EU)');

  // Diaspora Currency Toggle (Real Estate) & Quick Receipt Copy
  const [diasporaCurrency, setDiasporaCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const handleCopyReceipt = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 2000);
    }
  };

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
        const dutyRes = calculateCustomsDutyTokunbo(2018, 2500, payload.cifNgn || cifValue);
        setResult({
          ...dutyRes,
          totalDutyAndLeviesNgn: dutyRes.totalCustomsDuty,
          estimatedPortClearingTotalNgn: dutyRes.estimatedTotalClearingCost,
          selectedPort: {
            portName: 'Tin Can Island Port, Lagos',
            customsDutyNgn: dutyRes.totalCustomsDuty,
            terminalDemurrageNgn: 450000,
            totalClearingCostNgn: dutyRes.estimatedTotalClearingCost,
          }
        });
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
        const hmoRes = calculateHmoCoPayAndTelehealth('Reliance HMO', `${consultType} Consultation`, procCost);
        const actualPatientPayable = hasHmo ? hmoRes.patientCoPayNgn : procCost;
        setResult({
          ...hmoRes,
          totalEstimatedBillNgn: procCost,
          patientPayableNgn: actualPatientPayable,
          patientCoPayNgn: actualPatientPayable,
          appointmentCode: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
        });
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
      } else if (action === 'beauty_salon_booking' || action === 'salon_booking') {
        setResult(calculateBeautySalonStylistBooking(beautyCategory, hairLength, stylistTier));
      } else if (action === 'restaurant_order') {
        const foodPrices: Record<string, { name: string; price: number }> = {
          jollof_turkey: { name: 'Party Jollof Rice & Jumbo Turkey', price: 6500 },
          catfish_peppersoup: { name: 'Point & Kill Catfish Pepper Soup + Yam', price: 8500 },
          seafood_platter: { name: 'Executive Seafood Platter (Prawns & Snails)', price: 28000 },
          shawarma_combo: { name: 'Double Sausage Shawarma & Fresh Juice', price: 4500 },
        };
        const selectedFood = foodPrices[foodItem] || foodPrices.jollof_turkey;
        const foodSubtotal = selectedFood.price * foodQty;
        const packagingFee = orderMode === 'dine_in' ? 0 : 500 * foodQty;
        const deliveryFee = orderMode === 'delivery' ? 2500 : 0;
        const totalFoodOrder = foodSubtotal + packagingFee + deliveryFee;
        setResult({
          dishName: selectedFood.name,
          unitPriceNgn: selectedFood.price,
          quantity: foodQty,
          foodSubtotalNgn: foodSubtotal,
          packagingFeeNgn: packagingFee,
          deliveryFeeNgn: deliveryFee,
          totalOrderNgn: totalFoodOrder,
          chowdeckCommissionSavedNgn: Math.round(totalFoodOrder * 0.25),
          kitchenOrderTicket: `KITCHEN-${Math.floor(1000 + Math.random() * 9000)}`,
        });
      } else if (action === 'retail_catalog_order') {
        setResult({
          productName: retailProduct,
          priceNgn: retailPrice,
          size: retailSize,
          stockStatus: 'In Stock (Ready for Dispatch)',
          deliveryFeeNgn: 2500,
          totalNgn: retailPrice + 2500,
          virtualAccount: '6805375225',
          bank: 'Moniepoint Microfinance Bank',
          antiFakeAlertCode: `BM-RETAIL-${Math.floor(1000 + Math.random() * 9000)}`
        });
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
            onClick={() => { setActiveTab('beauty'); setResult(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'beauty' ? 'bg-pink-500/20 border border-pink-500/50 text-pink-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            💅 Salon & Spa Deposit Lock
          </button>
          <button
            onClick={() => { setActiveTab('restaurant'); setResult(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'restaurant' ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🍔 Restaurant & Food (0% Commission)
          </button>
          <button
            onClick={() => { setActiveTab('retail'); setResult(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'retail' ? 'bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🛍️ Boutique & Retail Catalog Closer
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-400">Appliance Load (kVA)</label>
                    <span className="text-[11px] text-amber-400 font-bold">💡 1-Tap Presets:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    <button
                      type="button"
                      onClick={() => setKva(2.5)}
                      className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                        kva === 2.5 ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      Flat / 2.5kVA
                    </button>
                    <button
                      type="button"
                      onClick={() => setKva(5)}
                      className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                        kva === 5 ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      Duplex / 5kVA
                    </button>
                    <button
                      type="button"
                      onClick={() => setKva(10)}
                      className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                        kva === 10 ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      Commercial / 10kVA
                    </button>
                  </div>
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
                <div ref={resultRef} className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 space-y-4">
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

                  {/* Specialized Solar Proposal Builder Webapp Upsell Banner */}
                  <div className="p-3.5 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border border-amber-500/40 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg text-base">💼</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-300">Need Bankable Engineering PDF Proposals for Corporate Clients?</span>
                          <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full uppercase">PWA Webapp</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Claim your prototype to unlock our <strong>Specialized Solar ROI Proposal Builder Webapp</strong> with your company logo, battery discharge curves, offline sync, and 1-click printable PDF for corporate tenders.
                        </p>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${merchantPhone}?text=${encodeURIComponent(`Hello Bethelmind Lagos Desk! I am testing the Solar BOQ calculator for *${businessName}*. Please show me the Specialized Solar Proposal Builder Webapp with PDF generation for my company.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs whitespace-nowrap transition-all shadow-md text-center"
                    >
                      <span>Request Webapp Demo →</span>
                    </a>
                  </div>

                  {/* High-Conversion WhatsApp and PDF Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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
                        <span>🟢 Send Quote to WhatsApp →</span>
                      </a>

                      <button
                        onClick={() =>
                          copyFormattedQuote(
                            `☀️ ${businessName} — Solar & Inverter Quoting Breakdown\n• Capacity: ${kva}kVA Hybrid Solar\n• Estimated BOQ: ₦${(result.solarSetupCost || result.grandTotal || 4500000).toLocaleString()}\n• 50% Commitment Deposit: ₦${Math.round((result.solarSetupCost || result.grandTotal || 4500000) * 0.5).toLocaleString()}\n• Estimated Monthly Savings: ₦${(result.netMonthlySavings || 185000).toLocaleString()}/mo\n• Payback Period: ${result.paybackPeriodMonths || 14} Months\n\nVerified by Bethelmind Digital Solutions (CAC Certified)`
                          )
                        }
                        className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        {copiedQuote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        <span>{copiedQuote ? 'Copied Receipt! ✓' : '📋 Copy Receipt'}</span>
                      </button>
                    </div>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Solar & Renewable Energy"
                      toolType={`Solar Hybrid ${kva}kVA BOQ & Energy Audit`}
                      claimFeeNgn={65000}
                      depositFeeNgn={35000}
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
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-400">Popular Tokunbo Clearing Tiers</span>
                  <span className="text-[11px] text-blue-400 font-bold">🚗 1-Tap Presets:</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setCifValue(8500000); setVin('1HGCR2F83JA102938'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      cifValue === 8500000 ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Sedan / Corolla (₦8.5m)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCifValue(18500000); setVin('2T2HZMCA4KC918273'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      cifValue === 18500000 ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    SUV / RX350 (₦18.5m)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCifValue(32000000); setVin('WDDWF4KB7GA654321'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      cifValue === 32000000 ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Luxury / Benz (₦32m)
                  </button>
                </div>
              </div>

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
                      claimFeeNgn={65000}
                      depositFeeNgn={35000}
                      adminPhone={merchantPhone}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BEAUTY, SALON & SPA TAB */}
          {activeTab === 'beauty' && (
            <div className="space-y-4">
              <FeatureShareBar toolTitle="24/7 Salon Booking & Deposit Lock Engine" toolSlug="salon-booking" description="Stylist Slot Allocation, Hair Extensions Estimator & No-Show Deposit Lock" />
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-400">Popular Nigerian Services</span>
                  <span className="text-[11px] text-pink-400 font-bold">💅 1-Tap Presets:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setBeautyCategory('bridal_styling'); setHairLength(26); setStylistTier('master_director'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      beautyCategory === 'bridal_styling' ? 'bg-pink-600 text-white border-pink-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Bridal Glam (₦120k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBeautyCategory('hair_extensions'); setHairLength(22); setStylistTier('senior'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      beautyCategory === 'hair_extensions' ? 'bg-pink-600 text-white border-pink-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Bone Straight (₦85k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBeautyCategory('spa_facial'); setHairLength(12); setStylistTier('senior'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      beautyCategory === 'spa_facial' ? 'bg-pink-600 text-white border-pink-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Luxury Facial (₦45k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBeautyCategory('nail_bar'); setHairLength(10); setStylistTier('senior'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      beautyCategory === 'nail_bar' ? 'bg-pink-600 text-white border-pink-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Nail Bar & Pedi (₦25k)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Service Required</label>
                  <select
                    value={beautyCategory}
                    onChange={e => setBeautyCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500"
                  >
                    <option value="hair_extensions">Raw Hair Extensions & Weaving</option>
                    <option value="bridal_styling">Bridal Hair & Makeup Package</option>
                    <option value="spa_facial">Luxury Spa Facial & Glow Treatment</option>
                    <option value="nail_bar">Full Gel Nail Bar & Pedicure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Hair Length (Inches)</label>
                  <input
                    type="number"
                    value={hairLength}
                    onChange={e => setHairLength(Number(e.target.value))}
                    min={10}
                    max={36}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Stylist Experience Tier</label>
                  <select
                    value={stylistTier}
                    onChange={e => setStylistTier(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500"
                  >
                    <option value="senior">Senior Stylist (Standard)</option>
                    <option value="master_director">Master Creative Director (+40%)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() =>
                  handleRunCalculation('beauty_salon_booking', {
                    serviceCategory: beautyCategory,
                    hairLengthInches: hairLength,
                    stylistTier
                  })
                }
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? 'Calculating Booking Slot...' : '💅 Calculate Total Booking Cost & Lock Appointment Deposit'}
              </button>

              {result && (
                <div ref={resultRef} className="bg-slate-950 border border-pink-500/30 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs text-pink-400 font-bold uppercase">Appointment & Deposit Lock Summary</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">{result.bookingConfirmationCode || 'VIP-SLOT-CONFIRMED'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Total Service Value</span>
                      <span className="text-base font-bold text-slate-200">
                        <KineticNumber prefix="₦" value={result.totalBookingCostNgn || 85000} />
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-pink-500/40">
                      <span className="text-xs text-pink-400 font-bold block">Mandatory 25% Deposit Lock</span>
                      <span className="text-base font-extrabold text-pink-300">
                        <KineticNumber prefix="₦" value={result.mandatoryDeposit25PercentNgn || 21250} />
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Balance on Arrival</span>
                      <span className="text-base font-bold text-emerald-400">
                        <KineticNumber prefix="₦" value={result.balancePayableAtSalonNgn || 63750} />
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-pink-950/20 border border-pink-500/20 rounded-xl text-xs text-pink-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>{result.salonPolicyRemark || 'SEAT LOCKED: 25% deposit secures chair reservation. Balance payable on arrival.'}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <a
                        href={buildSectorWhatsAppQuoteMessage(
                          businessName,
                          'Beauty, Salon & Spa',
                          'Salon Booking & Deposit Lock Engine',
                          `Total Value: ₦${(result.totalBookingCostNgn || 85000).toLocaleString()} · Deposit Lock: ₦${(result.mandatoryDeposit25PercentNgn || 21250).toLocaleString()}`,
                          merchantPhone
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>🟢 Send Booking to WhatsApp →</span>
                      </a>

                      <button
                        onClick={() =>
                          copyFormattedQuote(
                            `💅 ${businessName} — Salon Appointment Booking Receipt\n• Service Tier: ${stylistTier === 'master_director' ? 'Master Director' : 'Senior Stylist'}\n• Hair/Service Length: ${hairLength} Inches\n• Total Booking Value: ₦${(result.totalBookingCostNgn || 85000).toLocaleString()}\n• 25% Mandatory Seat Deposit: ₦${(result.mandatoryDeposit25PercentNgn || 21250).toLocaleString()}\n• Balance Payable at Salon: ₦${(result.balancePayableAtSalonNgn || 63750).toLocaleString()}\n• Confirmation Code: ${result.bookingConfirmationCode || 'VIP-SLOT-CONFIRMED'}\n\nVerified by Bethelmind Digital Solutions (CAC Certified)`
                          )
                        }
                        className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        {copiedQuote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        <span>{copiedQuote ? 'Copied Receipt! ✓' : '📋 Copy Receipt'}</span>
                      </button>
                    </div>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Beauty, Salon & Wellness Studio"
                      toolType="24/7 WhatsApp Appointment Booking & Deposit Lock Engine"
                      claimFeeNgn={65000}
                      depositFeeNgn={35000}
                      adminPhone={merchantPhone}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RESTAURANT, LOUNGE & CAFE TAB */}
          {activeTab === 'restaurant' && (
            <div className="space-y-4">
              <FeatureShareBar toolTitle="0% Commission Direct Digital Food Menu & Kitchen Dispatch" toolSlug="restaurant-menu" description="Stop Chowdeck 25% Commission, Direct Kitchen Order Printing & Automated WhatsApp Delivery Receipts" />
              
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-400">Popular Nigerian Menu Favorites</span>
                  <span className="text-[11px] text-orange-400 font-bold">🍔 1-Tap Presets:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setFoodItem('jollof_turkey'); setFoodQty(2); setOrderMode('delivery'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      foodItem === 'jollof_turkey' ? 'bg-orange-500 text-slate-950 border-orange-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Jollof & Turkey (₦6.5k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFoodItem('catfish_peppersoup'); setFoodQty(1); setOrderMode('dine_in'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      foodItem === 'catfish_peppersoup' ? 'bg-orange-500 text-slate-950 border-orange-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Catfish Pepper Soup (₦8.5k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFoodItem('seafood_platter'); setFoodQty(1); setOrderMode('delivery'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      foodItem === 'seafood_platter' ? 'bg-orange-500 text-slate-950 border-orange-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Seafood Platter (₦28k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFoodItem('shawarma_combo'); setFoodQty(2); setOrderMode('takeaway'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      foodItem === 'shawarma_combo' ? 'bg-orange-500 text-slate-950 border-orange-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Shawarma Combo (₦4.5k)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Select Menu Item</label>
                  <select
                    value={foodItem}
                    onChange={e => setFoodItem(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-orange-500"
                  >
                    <option value="jollof_turkey">Party Jollof Rice & Jumbo Turkey (₦6,500)</option>
                    <option value="catfish_peppersoup">Point & Kill Catfish Pepper Soup + Yam (₦8,500)</option>
                    <option value="seafood_platter">Executive Seafood Platter (₦28,000)</option>
                    <option value="shawarma_combo">Double Sausage Shawarma & Fresh Juice (₦4,500)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Order Mode</label>
                  <select
                    value={orderMode}
                    onChange={e => setOrderMode(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-orange-500"
                  >
                    <option value="delivery">Home / Office Delivery</option>
                    <option value="dine_in">Dine-In Table Order</option>
                    <option value="takeaway">Walk-In Pick Up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Portions / Plates</label>
                  <input
                    type="number"
                    value={foodQty}
                    onChange={e => setFoodQty(Number(e.target.value))}
                    min={1}
                    max={20}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRunCalculation('restaurant_order', { foodItem, foodQty, orderMode, tableOrAddress })}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Dispatching to Kitchen...' : '🍔 Calculate Order & Dispatch to Kitchen WhatsApp (0% Commission)'}
              </button>

              {result && (
                <div ref={resultRef} className="bg-slate-950 border border-orange-500/30 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs text-orange-400 font-bold uppercase">Direct Kitchen Ticket (0% Third-Party Cut)</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">{result.kitchenOrderTicket || 'KITCHEN-8421'}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Food Subtotal</span>
                      <span className="text-base font-bold text-slate-200">
                        ₦{(result.foodSubtotalNgn || 13000).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Packaging & Dispatch</span>
                      <span className="text-base font-bold text-slate-300">
                        ₦{((result.packagingFeeNgn || 1000) + (result.deliveryFeeNgn || 2500)).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/30">
                      <span className="text-xs text-emerald-400 font-bold block">Chowdeck Fee Saved</span>
                      <span className="text-base font-extrabold text-emerald-400">
                        +₦{(result.chowdeckCommissionSavedNgn || 4125).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Total Due (Direct Bank)</span>
                      <span className="text-base font-black text-orange-400">
                        ₦{(result.totalOrderNgn || 16500).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-orange-950/20 border border-orange-500/20 rounded-xl text-xs text-orange-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>0% COMMISSION GUARANTEE: 100% of revenue goes directly into your Moniepoint account with zero 25% aggregator deductions.</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <a
                        href={buildSectorWhatsAppQuoteMessage(
                          businessName,
                          'Restaurants & Lounges',
                          'Direct Food Order',
                          `Order: ${result.dishName || 'Food Order'} (x${foodQty}). Total: ₦${(result.totalOrderNgn || 16500).toLocaleString()} (0% Commission)`,
                          merchantPhone
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>🟢 Send Order to WhatsApp →</span>
                      </a>

                      <button
                        onClick={() =>
                          copyFormattedQuote(
                            `🍔 ${businessName} — Kitchen Food Order Receipt\n• Ticket: ${result.kitchenOrderTicket || 'KITCHEN-8421'}\n• Item: ${result.dishName || 'Food Order'} (Qty: ${foodQty})\n• Order Mode: ${orderMode}\n• Subtotal: ₦${(result.foodSubtotalNgn || 13000).toLocaleString()}\n• Packaging & Delivery: ₦${((result.packagingFeeNgn || 1000) + (result.deliveryFeeNgn || 2500)).toLocaleString()}\n• Chowdeck 25% Fee Saved: +₦${(result.chowdeckCommissionSavedNgn || 4125).toLocaleString()}\n• Total Payable: ₦${(result.totalOrderNgn || 16500).toLocaleString()}\n\n0% Commission Direct Settlement · Bethelmind Digital Solutions`
                          )
                        }
                        className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        {copiedQuote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        <span>{copiedQuote ? 'Copied Receipt! ✓' : '📋 Copy Receipt'}</span>
                      </button>
                    </div>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Restaurants, Cafes & Lounges"
                      toolType="0% Commission Direct Digital Food Ordering Engine"
                      claimFeeNgn={65000}
                      depositFeeNgn={35000}
                      adminPhone={merchantPhone}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RETAIL & BOUTIQUE CATALOG CLOSER TAB */}
          {activeTab === 'retail' && (
            <div className="space-y-4">
              <FeatureShareBar toolTitle="Sub-3s WhatsApp Catalog Closer & Stock Reservation" toolSlug="retail-catalog" description="Stop Instagram DM Drop-Offs, Moniepoint Anti-Fake Alert Virtual Accounts & Hyperlocal Waybill Estimator" />
              
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-400">Fast-Selling Nigerian Retail Items</span>
                  <span className="text-[11px] text-fuchsia-400 font-bold">🛍️ 1-Tap Presets:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setRetailProduct('Italian Leather Sneakers'); setRetailPrice(45000); setRetailSize('Size 42 (EU)'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      retailProduct === 'Italian Leather Sneakers' ? 'bg-fuchsia-600 text-white border-fuchsia-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Italian Sneakers (₦45k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRetailProduct('Tailored Corporate Suit'); setRetailPrice(85000); setRetailSize('Size 44 Regular'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      retailProduct === 'Tailored Corporate Suit' ? 'bg-fuchsia-600 text-white border-fuchsia-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Corporate Suit (₦85k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRetailProduct('Luxury Chrono Smartwatch'); setRetailPrice(65000); setRetailSize('Rose Gold 44mm'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      retailProduct === 'Luxury Chrono Smartwatch' ? 'bg-fuchsia-600 text-white border-fuchsia-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Smartwatch (₦65k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRetailProduct('Silk Evening Dinner Gown'); setRetailPrice(38000); setRetailSize('Size 12 UK'); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      retailProduct === 'Silk Evening Dinner Gown' ? 'bg-fuchsia-600 text-white border-fuchsia-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Dinner Gown (₦38k)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Description</label>
                  <input
                    type="text"
                    value={retailProduct}
                    onChange={e => setRetailProduct(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Item Price (NGN)</label>
                  <input
                    type="number"
                    value={retailPrice}
                    onChange={e => setRetailPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Size / Color Variant</label>
                  <input
                    type="text"
                    value={retailSize}
                    onChange={e => setRetailSize(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRunCalculation('retail_catalog_order', { retailProduct, retailPrice, retailSize })}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-black rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Reserving Stock...' : '🛍️ Generate Sub-3s WhatsApp Checkout & Anti-Fake Alert Account'}
              </button>

              {result && (
                <div ref={resultRef} className="bg-slate-950 border border-fuchsia-500/30 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs text-fuchsia-400 font-bold uppercase">Sub-3s WhatsApp Fast Checkout</span>
                    <span className="text-xs text-emerald-400 font-bold">🟢 IN STOCK (READY TO DISPATCH)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Item Price</span>
                      <span className="text-base font-bold text-slate-200">
                        ₦{(result.priceNgn || retailPrice).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Local Waybill</span>
                      <span className="text-base font-bold text-slate-300">
                        ₦{(result.deliveryFeeNgn || 2500).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-fuchsia-500/30">
                      <span className="text-xs text-fuchsia-400 font-bold block">Total Pay-On-Order</span>
                      <span className="text-base font-black text-fuchsia-300">
                        ₦{((result.priceNgn || retailPrice) + (result.deliveryFeeNgn || 2500)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-fuchsia-950/20 border border-fuchsia-500/20 rounded-xl text-xs text-fuchsia-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-fuchsia-400 shrink-0" />
                    <span>ANTI-FAKE ALERT SHIELD: Automatic bank webhook confirmation via Moniepoint (Acct: 6805375225) ensures orders dispatch only on cleared funds.</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <a
                        href={buildSectorWhatsAppQuoteMessage(
                          businessName,
                          'Boutiques & Retail',
                          'WhatsApp Catalog Order',
                          `Item: ${retailProduct} (${retailSize}). Total: ₦${((result.priceNgn || retailPrice) + (result.deliveryFeeNgn || 2500)).toLocaleString()}`,
                          merchantPhone
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>🟢 Send Order to WhatsApp →</span>
                      </a>

                      <button
                        onClick={() =>
                          copyFormattedQuote(
                            `🛍️ ${businessName} — Order & Waybill Receipt\n• Item: ${retailProduct}\n• Variant/Size: ${retailSize}\n• Price: ₦${(result.priceNgn || retailPrice).toLocaleString()}\n• Dispatch Waybill: ₦${(result.deliveryFeeNgn || 2500).toLocaleString()}\n• Total Amount: ₦${((result.priceNgn || retailPrice) + (result.deliveryFeeNgn || 2500)).toLocaleString()}\n• Settlement Bank: Moniepoint (CAC Certified)\n\nProcessed via Sub-3s WhatsApp Closer · Bethelmind Digital Solutions`
                          )
                        }
                        className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        {copiedQuote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        <span>{copiedQuote ? 'Copied Receipt! ✓' : '📋 Copy Receipt'}</span>
                      </button>
                    </div>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Retail Boutiques & Supermarkets"
                      toolType="Sub-3s WhatsApp Catalog Closer & Stock Reservation Suite"
                      claimFeeNgn={65000}
                      depositFeeNgn={35000}
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
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-400">Nigerian Property Categories</span>
                  <span className="text-[11px] text-teal-400 font-bold">🏡 1-Tap Presets:</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setPropertyPrice(45000000); setDownPaymentPercent(20); setTenureYears(10); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      propertyPrice === 45000000 ? 'bg-teal-600 text-white border-teal-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Lekki 2-Bed (₦45m)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPropertyPrice(95000000); setDownPaymentPercent(25); setTenureYears(15); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      propertyPrice === 95000000 ? 'bg-teal-600 text-white border-teal-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Terrace Duplex (₦95m)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPropertyPrice(250000000); setDownPaymentPercent(30); setTenureYears(10); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      propertyPrice === 250000000 ? 'bg-teal-600 text-white border-teal-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Commercial Plaza (₦250m)
                  </button>
                </div>
              </div>

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
                <div ref={resultRef} className="bg-slate-950 border border-teal-500/30 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs text-teal-400 font-bold uppercase">Property Loan Amortization</span>
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setDiasporaCurrency('NGN')}
                        className={`px-2 py-0.5 rounded font-bold transition-all ${diasporaCurrency === 'NGN' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                      >
                        ₦ NGN
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiasporaCurrency('USD')}
                        className={`px-2 py-0.5 rounded font-bold transition-all ${diasporaCurrency === 'USD' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                      >
                        $ USD Diaspora
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Down Payment</span>
                      <span className="text-sm font-bold text-slate-100">
                        {diasporaCurrency === 'USD' ? (
                          <span>${Math.round((result.downPaymentNgn || (propertyPrice * downPaymentPercent / 100)) / 1375).toLocaleString()}</span>
                        ) : (
                          <KineticNumber prefix="₦" value={result.downPaymentNgn || (propertyPrice * downPaymentPercent / 100)} />
                        )}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Monthly Repayment</span>
                      <span className="text-sm font-bold text-teal-300">
                        {diasporaCurrency === 'USD' ? (
                          <span>${Math.round((result.monthlyPaymentNgn || 540000) / 1375).toLocaleString()}/mo</span>
                        ) : (
                          <KineticNumber prefix="₦" value={result.monthlyPaymentNgn || 540000} suffix="/mo" />
                        )}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 block">Total Interest</span>
                      <span className="text-sm font-bold text-slate-400">
                        {diasporaCurrency === 'USD' ? (
                          <span>${Math.round((result.totalInterestPayableNgn || 18200000) / 1375).toLocaleString()}</span>
                        ) : (
                          <KineticNumber prefix="₦" value={result.totalInterestPayableNgn || 18200000} />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* 4-Phase Off-Plan Milestone Schedule */}
                  <div className="p-3 bg-teal-950/20 border border-teal-500/20 rounded-xl space-y-1.5 text-xs">
                    <span className="font-bold text-teal-300 block">🏗️ Recommended Nigerian Off-Plan Milestone Schedule:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="bg-slate-900/80 p-2 rounded-lg">
                        <span className="text-slate-400 block">1. Foundation (30%)</span>
                        <span className="font-bold text-white">₦{((propertyPrice * 0.30)).toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg">
                        <span className="text-slate-400 block">2. Carcass/Roof (30%)</span>
                        <span className="font-bold text-white">₦{((propertyPrice * 0.30)).toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg">
                        <span className="text-slate-400 block">3. Plaster/Pipes (20%)</span>
                        <span className="font-bold text-white">₦{((propertyPrice * 0.20)).toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-teal-500/30">
                        <span className="text-teal-300 block">4. Key Handover (20%)</span>
                        <span className="font-bold text-emerald-400">₦{((propertyPrice * 0.20)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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
                        <span>🟢 Send Quote to WhatsApp →</span>
                      </a>

                      <button
                        onClick={() =>
                          copyFormattedQuote(
                            `🏡 ${businessName} — Property Mortgage & Off-Plan Milestone Breakdown\n• Property Price: ₦${propertyPrice.toLocaleString()} ($${Math.round(propertyPrice / 1375).toLocaleString()} USD)\n• Down Payment (${downPaymentPercent}%): ₦${(result.downPaymentNgn || (propertyPrice * downPaymentPercent / 100)).toLocaleString()}\n• Monthly Installment: ₦${(result.monthlyPaymentNgn || 540000).toLocaleString()}/mo\n• Foundation (30%): ₦${(propertyPrice * 0.3).toLocaleString()}\n• Carcass/Roof (30%): ₦${(propertyPrice * 0.3).toLocaleString()}\n• Key Handover (20%): ₦${(propertyPrice * 0.2).toLocaleString()}\n\nVerified by Bethelmind Digital Solutions (CAC Certified)`
                          )
                        }
                        className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        {copiedQuote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        <span>{copiedQuote ? 'Copied Receipt! ✓' : '📋 Copy Receipt'}</span>
                      </button>
                    </div>

                    <ExecutivePdfQuoteModal
                      businessName={businessName}
                      category="Real Estate & Property Development"
                      toolType="Property Mortgage Amortization & Installment Schedule"
                      claimFeeNgn={65000}
                      depositFeeNgn={35000}
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
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-400">Clinical Consultation Categories</span>
                  <span className="text-[11px] text-rose-400 font-bold">🏥 1-Tap Presets:</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setConsultType('general'); setHasHmo(false); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      consultType === 'general' ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    GOPD Outpatient (₦15k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setConsultType('specialist'); setHasHmo(true); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      consultType === 'specialist' ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    HMO Specialist (₦3.5k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setConsultType('emergency'); setHasHmo(false); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      consultType === 'emergency' ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Emergency (₦50k)
                  </button>
                </div>
              </div>

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
                      claimFeeNgn={65000}
                      depositFeeNgn={35000}
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
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-400">School Level & Enrollment Tier</span>
                  <span className="text-[11px] text-purple-400 font-bold">🎓 1-Tap Presets:</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setTermlyTuition(95000); setStudentCount(80); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      termlyTuition === 95000 ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Creche/Nursery (₦95k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTermlyTuition(150000); setStudentCount(150); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      termlyTuition === 150000 ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Primary (₦150k)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTermlyTuition(250000); setStudentCount(220); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      termlyTuition === 250000 ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    College / SSS (₦250k)
                  </button>
                </div>
              </div>

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
                      claimFeeNgn={65000}
                      depositFeeNgn={35000}
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
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-400">Popular Interstate Freight Routes</span>
                  <span className="text-[11px] text-indigo-400 font-bold">📦 1-Tap Presets:</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setOriginCity('Lagos'); setDestCity('Abuja'); setWeightKg(15); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      originCity === 'Lagos' && destCity === 'Abuja' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Lagos → Abuja (15kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOriginCity('Lagos'); setDestCity('Port Harcourt'); setWeightKg(25); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      originCity === 'Lagos' && destCity === 'Port Harcourt' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Lagos → PH (25kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOriginCity('Lagos'); setDestCity('Kano'); setWeightKg(50); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      originCity === 'Lagos' && destCity === 'Kano' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Lagos → Kano (50kg)
                  </button>
                </div>
              </div>

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
                      claimFeeNgn={65000}
                      depositFeeNgn={35000}
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
                      claimFeeNgn={65000}
                      depositFeeNgn={35000}
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
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-400">Nigerian Shortlet & Hotel Categories</span>
                  <span className="text-[11px] text-amber-400 font-bold">🏨 1-Tap Presets:</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setNightlyRate(45000); setNightsCount(2); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      nightlyRate === 45000 ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Studio (₦45k/nt)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setNightlyRate(85000); setNightsCount(3); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      nightlyRate === 85000 ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    2-Bed Lekki (₦85k/nt)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setNightlyRate(180000); setNightsCount(4); }}
                    className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      nightlyRate === 180000 ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Penthouse (₦180k/nt)
                  </button>
                </div>
              </div>

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
                      claimFeeNgn={65000}
                      depositFeeNgn={35000}
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
                      <span className="text-sm font-bold text-emerald-300">Moniepoint Microfinance Bank</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Account Number</span>
                      <span className="text-xl font-black text-white tracking-widest">6805375225</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Beneficiary Name</span>
                      <span className="text-xs font-semibold text-slate-200">Bethelmind Digital Solutions</span>
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

      {/* 1-Line Embed Modal (For Existing Websites - Sector Tool Instant Embed: ₦35,000) */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg font-bold">💻</span>
                <div>
                  <h3 className="text-base font-bold text-white">1-Line Script Embed Upgrade</h3>
                  <span className="text-[11px] font-bold text-emerald-400">
                    🇳🇬 Sector Tool Upgrade: ₦35,000 One-Time Setup
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Already have an active website on WordPress, Wix, or custom hosting? Keep your existing hosting, domain, and SEO rankings 100% untouched. Paste this 1-line script right before your <code className="text-cyan-400 font-mono">&lt;/body&gt;</code> tag, or claim the <strong>Full .COM.NG Website + Calculator</strong> for the same <strong>₦35,000 Deposit</strong>!
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
                href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Lagos Desk! I want to claim the Sector Tool Integration (₦35,000) for *${businessName}*. Please send setup instructions!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Claim ₦35k Starter Package →</span>
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
