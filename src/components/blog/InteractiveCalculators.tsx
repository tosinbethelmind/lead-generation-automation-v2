'use client';

import React, { useState, useEffect } from 'react';
import { MASTER_PAYOUT } from '@/data/monetizationCatalog';

interface CalculatorProps {
  niche?: string;
  articleTitle?: string;
}

type TabType = 'solar' | 'realestate' | 'b2bleadgen' | 'clinic';

export const InteractiveCalculators: React.FC<CalculatorProps> = ({ 
  niche = 'solar', 
  articleTitle = 'Commercial Analysis' 
}) => {
  // Determine initial tab based on niche
  const getInitialTab = (): TabType => {
    const n = niche.toLowerCase();
    if (n.includes('real') || n.includes('property') || n.includes('rent') || n.includes('estate')) return 'realestate';
    if (n.includes('clinic') || n.includes('health') || n.includes('hospital') || n.includes('doctor')) return 'clinic';
    if (n.includes('lead') || n.includes('b2b') || n.includes('sales') || n.includes('marketing') || n.includes('ai')) return 'b2bleadgen';
    return 'solar';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab());

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [niche]);

  // 1. Solar Calculator State
  const [monthlyDiesel, setMonthlyDiesel] = useState<number>(850000);
  const [generatorKva, setGeneratorKva] = useState<number>(20);

  // 2. Real Estate Calculator State
  const [propertyPrice, setPropertyPrice] = useState<number>(85000000);
  const [nightlyRate, setNightlyRate] = useState<number>(95000);
  const [occupancyRate, setOccupancyRate] = useState<number>(70);

  // 3. B2B Lead Gen & WhatsApp Sales State
  const [monthlyTargetLeads, setMonthlyTargetLeads] = useState<number>(3000);
  const [averageDealValue, setAverageDealValue] = useState<number>(180000); // ₦180k per deal
  const [conversionRate, setConversionRate] = useState<number>(3.5); // 3.5%

  // 4. Clinic Appointment Recovery State
  const [dailyPatients, setDailyPatients] = useState<number>(35);
  const [consultationFee, setConsultationFee] = useState<number>(15000); // ₦15k per patient
  const [missedCallsPercent, setMissedCallsPercent] = useState<number>(25); // 25% missed after-hours

  // 1. Solar Calculations
  const annualDieselSpend = monthlyDiesel * 12;
  const fiveYearDieselSpend = annualDieselSpend * 5;
  const recommendedSolarKva = Math.min(Math.round(generatorKva * 0.75), 100);
  const estimatedSolarCost = recommendedSolarKva * 380000;
  const paybackMonths = Math.max(Math.round((estimatedSolarCost / monthlyDiesel) * 10) / 10, 5);
  const netFiveYearSavings = fiveYearDieselSpend - estimatedSolarCost;

  // 2. Real Estate Calculations
  const occupiedNights = Math.round(365 * (occupancyRate / 100));
  const annualGrossRevenue = occupiedNights * nightlyRate;
  const operationalExpenses = annualGrossRevenue * 0.28;
  const annualNetIncome = annualGrossRevenue - operationalExpenses;
  const netRentalYield = Math.round((annualNetIncome / propertyPrice) * 1000) / 10;

  // 3. B2B Lead Gen Calculations
  const estimatedDealsPerMonth = Math.round(monthlyTargetLeads * (conversionRate / 100));
  const projectedMonthlyRevenue = estimatedDealsPerMonth * averageDealValue;
  const projectedAnnualRevenue = projectedMonthlyRevenue * 12;

  // 4. Clinic Appointment Calculations
  const lostPatientsMonthly = Math.round((dailyPatients * 30) * (missedCallsPercent / 100));
  const recoveredRevenueMonthly = Math.round(lostPatientsMonthly * 0.75 * consultationFee);
  const annualRecoveredRevenue = recoveredRevenueMonthly * 12;

  return (
    <div className="my-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-navy-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 shadow-2xl text-white">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Interactive Commercial ROI Engine (2026 Live Model)</span>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('solar')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'solar' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Solar & Diesel
          </button>
          <button
            onClick={() => setActiveTab('realestate')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'realestate' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏢 Real Estate Yield
          </button>
          <button
            onClick={() => setActiveTab('b2bleadgen')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'b2bleadgen' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚀 B2B WhatsApp Sales
          </button>
          <button
            onClick={() => setActiveTab('clinic')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'clinic' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏥 Clinic Recovery
          </button>
        </div>
      </div>

      {/* 1. SOLAR CALCULATOR */}
      {activeTab === 'solar' && (
        <div>
          <h3 className="text-xl md:text-2xl font-black mb-2">
            Commercial Solar Payback & Generator Diesel Savings
          </h3>
          <p className="text-slate-300 text-xs md:text-sm mb-6">
            Input your monthly diesel fuel overhead to calculate recommended solar battery capacity and 5-year net savings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Monthly Generator Diesel Spend:</span>
                  <span className="text-amber-400 font-bold">₦{monthlyDiesel.toLocaleString()} / mo</span>
                </div>
                <input 
                  type="range" 
                  min="200000" 
                  max="10000000" 
                  step="50000"
                  value={monthlyDiesel}
                  onChange={(e) => setMonthlyDiesel(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Current Generator Capacity:</span>
                  <span className="text-amber-400 font-bold">{generatorKva} kVA</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  step="5"
                  value={generatorKva}
                  onChange={(e) => setGeneratorKva(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Solar Hybrid Sizing:</span>
                <span className="text-xl font-black text-amber-400">{recommendedSolarKva} kVA</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">LiFePO4 Storage</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Full Payback Horizon:</span>
                <span className="text-xl font-black text-emerald-400">{paybackMonths} Months</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Zero Diesel Dependency</span>
              </div>
              <div className="col-span-2 pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Projected 5-Year Net Savings:</span>
                <span className="text-2xl font-black text-white">₦{netFiveYearSavings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 max-w-md">
              Need an official BOQ proposal with engineering sign-off for your facility?
            </span>
            <a 
              href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+used+your+Solar+Calculator+on+'${encodeURIComponent(articleTitle)}'.+My+diesel+spend+is+₦${monthlyDiesel.toLocaleString()}/mo+(generator+${generatorKva}kVA).+Please+send+my+custom+BOQ+proposal.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs tracking-wide shadow-lg hover:scale-105 transition-all"
            >
              💬 Request Official BOQ on WhatsApp (0802 279 1227) →
            </a>
          </div>
        </div>
      )}

      {/* 2. REAL ESTATE CALCULATOR */}
      {activeTab === 'realestate' && (
        <div>
          <h3 className="text-xl md:text-2xl font-black mb-2">
            Lekki & Ikoyi Shortlet Rental Yield & Cashflow Estimator
          </h3>
          <p className="text-slate-300 text-xs md:text-sm mb-6">
            Calculate net annual cashflow and capitalization rates on off-plan and completed Lagos luxury apartments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Apartment Acquisition Cost:</span>
                  <span className="text-amber-400 font-bold">₦{propertyPrice.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="30000000" 
                  max="500000000" 
                  step="5000000"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Average Nightly Shortlet Tariff:</span>
                  <span className="text-amber-400 font-bold">₦{nightlyRate.toLocaleString()} / night</span>
                </div>
                <input 
                  type="range" 
                  min="40000" 
                  max="350000" 
                  step="5000"
                  value={nightlyRate}
                  onChange={(e) => setNightlyRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Net Annual Rental Yield:</span>
                <span className="text-2xl font-black text-emerald-400">{netRentalYield}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">vs 7% Standard Annual Lease</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Net Annual Cashflow:</span>
                <span className="text-2xl font-black text-amber-400">₦{annualNetIncome.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">After 28% OpEx reserve</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 max-w-md">
              Need verified Governor's Consent / C of O legal vetting for your Lagos property investment?
            </span>
            <a 
              href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+used+your+Rental+Yield+Calculator+on+'${encodeURIComponent(articleTitle)}'.+I+am+reviewing+a+₦${propertyPrice.toLocaleString()}+property.+Please+provide+title+verification+guidance.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs tracking-wide shadow-lg hover:scale-105 transition-all"
            >
              💬 Consult Lagos Real Estate Desk on WhatsApp →
            </a>
          </div>
        </div>
      )}

      {/* 3. B2B LEAD GEN & WHATSAPP CLOSER CALCULATOR */}
      {activeTab === 'b2bleadgen' && (
        <div>
          <h3 className="text-xl md:text-2xl font-black mb-2">
            B2B Outbound Lead Engine & 24/7 AI Closer Revenue Model
          </h3>
          <p className="text-slate-300 text-xs md:text-sm mb-6">
            Project new customer acquisitions and monthly cash collection by deploying autonomous B2B lead generation with &lt;3s WhatsApp responses.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Verified Decision-Maker Leads Targeted / Month:</span>
                  <span className="text-amber-400 font-bold">{monthlyTargetLeads.toLocaleString()} Leads</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="15000" 
                  step="500"
                  value={monthlyTargetLeads}
                  onChange={(e) => setMonthlyTargetLeads(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Average Transaction / Retainer Value:</span>
                  <span className="text-amber-400 font-bold">₦{averageDealValue.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="25000" 
                  max="1000000" 
                  step="25000"
                  value={averageDealValue}
                  onChange={(e) => setAverageDealValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Closed Deal Conversion Rate:</span>
                  <span className="text-emerald-400 font-bold">{conversionRate}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="0.5"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Closed Deals / Month:</span>
                <span className="text-2xl font-black text-amber-400">{estimatedDealsPerMonth} Clients</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Automated AI Closings</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Projected Monthly Revenue:</span>
                <span className="text-2xl font-black text-emerald-400">₦{projectedMonthlyRevenue.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Direct Bank Wire / NIP</span>
              </div>
              <div className="col-span-2 pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Projected 12-Month Annual Run-Rate:</span>
                <span className="text-3xl font-black text-white">₦{projectedAnnualRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 max-w-md">
              Deploy our 5,000+ verified B2B leads directory and Make.com WhatsApp bot blueprint in your business today.
            </span>
            <a 
              href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+calculated+projected+revenue+of+₦${projectedMonthlyRevenue.toLocaleString()}/mo+using+your+B2B+LeadGen+Calculator.+I+want+to+deploy+the+leads+and+AI+closer.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs tracking-wide shadow-lg hover:scale-105 transition-all"
            >
              💬 Deploy B2B Engine on WhatsApp (0802 279 1227) →
            </a>
          </div>
        </div>
      )}

      {/* 4. CLINIC & APPOINTMENT LEAKAGE CALCULATOR */}
      {activeTab === 'clinic' && (
        <div>
          <h3 className="text-xl md:text-2xl font-black mb-2">
            Private Clinic & Dental Practice Lost Revenue Recovery
          </h3>
          <p className="text-slate-300 text-xs md:text-sm mb-6">
            Calculate the patient booking revenue lost to after-hours unanswered calls and delayed emergency inquiries in Nigerian medical practices.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Average Daily Inquiring Patients:</span>
                  <span className="text-amber-400 font-bold">{dailyPatients} Patients / Day</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="150" 
                  step="5"
                  value={dailyPatients}
                  onChange={(e) => setDailyPatients(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Average Consultation & Procedure Bill:</span>
                  <span className="text-amber-400 font-bold">₦{consultationFee.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="150000" 
                  step="5000"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Estimated Unanswered After-Hours Rate:</span>
                  <span className="text-rose-400 font-bold">{missedCallsPercent}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="50" 
                  step="5"
                  value={missedCallsPercent}
                  onChange={(e) => setMissedCallsPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Missed Patients / Month:</span>
                <span className="text-2xl font-black text-rose-400">{lostPatientsMonthly} Patients</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Unanswered Night/Weekend</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Recoverable Revenue / Month:</span>
                <span className="text-2xl font-black text-emerald-400">₦{recoveredRevenueMonthly.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Via 24/7 WhatsApp AI Triaging</span>
              </div>
              <div className="col-span-2 pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Annual Practice Profit Leakage Stopped:</span>
                <span className="text-3xl font-black text-white">₦{annualRecoveredRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 max-w-md">
              Install 24/7 AI Patient Booking on your clinic WhatsApp line in under 48 hours.
            </span>
            <a 
              href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+used+your+Clinic+Calculator.+Our+facility+has+approx+${dailyPatients}+patients/day+and+wants+to+recover+₦${recoveredRevenueMonthly.toLocaleString()}/mo+in+missed+inquiries.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs tracking-wide shadow-lg hover:scale-105 transition-all"
            >
              💬 Install Clinic AI Quoter on WhatsApp →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
