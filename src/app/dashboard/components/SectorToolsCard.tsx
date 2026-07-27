'use client';

import React, { useState } from 'react';
import { SolarBoqResult, CustomsDutyResult, CacRegistrationResult } from '@/lib/sectorModules';

export default function SectorToolsCard() {
  const [activeTool, setActiveTool] = useState<'solar' | 'auto' | 'legal' | 'retail'>('solar');

  // Solar State
  const [kvaInput, setKvaInput] = useState<number>(5);
  const [batteryType, setBatteryType] = useState<'lithium' | 'gel'>('lithium');
  const [boqResult, setBoqResult] = useState<SolarBoqResult | null>(null);
  const [monthlyDiesel, setMonthlyDiesel] = useState<number>(250);
  const [roiResult, setRoiResult] = useState<any | null>(null);

  // Auto State
  const [carYear, setCarYear] = useState<number>(2018);
  const [cifValue, setCifValue] = useState<number>(8500000);
  const [dutyResult, setDutyResult] = useState<CustomsDutyResult | null>(null);

  // Legal State
  const [entityType, setEntityType] = useState<'business_name' | 'company_ltd' | 'incorporated_trustee'>('company_ltd');
  const [shareCapital, setShareCapital] = useState<number>(1000000);
  const [cacResult, setCacResult] = useState<CacRegistrationResult | null>(null);

  // Loading
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateBoq = async () => {
    setLoading(true);
    try {
      const [resBoq, resRoi] = await Promise.all([
        fetch('/api/sector-tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'solar_boq', kva: kvaInput, batteryType }),
        }).then(r => r.json()),
        fetch('/api/sector-tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'diesel_roi', monthlyDieselLiters: monthlyDiesel }),
        }).then(r => r.json()),
      ]);

      if (resBoq.success) setBoqResult(resBoq.result);
      if (resRoi.success) setRoiResult(resRoi.result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateDuty = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sector-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tokunbo_duty', year: carYear, cifNgn: cifValue }),
      }).then(r => r.json());
      if (res.success) setDutyResult(res.result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateCac = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sector-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cac_fees', entityType, shareCapital }),
      }).then(r => r.json());
      if (res.success) setCacResult(res.result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glassmorphism p-6 rounded-2xl border border-white/10 text-white space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>⚙️</span> Sector Specialized Revenue Calculators
          </h2>
          <p className="text-sm text-slate-400">Generate BOQs, Tokunbo Customs Duties, CAC Filing Fees & ROI Statements</p>
        </div>

        {/* Sector Switcher Tabs */}
        <div className="flex gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTool('solar')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeTool === 'solar' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
          >
            ☀️ Solar BOQ & ROI
          </button>
          <button
            onClick={() => setActiveTool('auto')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeTool === 'auto' ? 'bg-red-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            🚗 Tokunbo Duty
          </button>
          <button
            onClick={() => setActiveTool('legal')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeTool === 'legal' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            ⚖️ CAC Filing
          </button>
        </div>
      </div>

      {/* SOLAR ENGINE */}
      {activeTool === 'solar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Required Load (kVA)</label>
              <input
                type="number"
                value={kvaInput}
                onChange={(e) => setKvaInput(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Battery Storage Technology</label>
              <select
                value={batteryType}
                onChange={(e: any) => setBatteryType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="lithium">LiFePO4 Lithium (Recommended)</option>
                <option value="gel">Deep Cycle Gel</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Monthly Diesel Use (Liters)</label>
              <input
                type="number"
                value={monthlyDiesel}
                onChange={(e) => setMonthlyDiesel(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateBoq}
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold rounded-xl text-sm shadow-lg transition"
          >
            {loading ? 'Calculating BOQ & ROI...' : '⚡ Generate Instant Bill of Quantities (BOQ) & Diesel ROI'}
          </button>

          {boqResult && (
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-amber-400">Branded Technical Survey BOQ ({boqResult.loadKva}kVA System)</h3>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full font-mono">
                  Total: ₦{boqResult.grandTotal.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                {boqResult.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs bg-slate-800/60 p-2.5 rounded-lg">
                    <div>
                      <span className="font-medium text-slate-200 block">{item.name}</span>
                      <span className="text-[10px] text-slate-400">{item.category} • Qty: {item.quantity}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold">₦{item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {roiResult && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-center text-xs">
                  <div className="bg-slate-800/80 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Monthly Diesel Spend</span>
                    <span className="font-bold text-red-400 font-mono">₦{roiResult.monthlyDieselCost.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Payback Period</span>
                    <span className="font-bold text-amber-400 font-mono">{roiResult.paybackPeriodMonths} Months</span>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">5-Year Diesel Cost</span>
                    <span className="font-bold text-slate-300 font-mono">₦{roiResult.fiveYearDieselCost.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">5-Year Net Savings</span>
                    <span className="font-bold text-emerald-400 font-mono">₦{roiResult.fiveYearNetSavings.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* AUTOMOTIVE TOKUNBO DUTY ENGINE */}
      {activeTool === 'auto' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Vehicle Model Year</label>
              <input
                type="number"
                value={carYear}
                onChange={(e) => setCarYear(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">CIF Value (NGN ₦)</label>
              <input
                type="number"
                value={cifValue}
                onChange={(e) => setCifValue(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleCalculateDuty}
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold rounded-xl text-sm shadow-lg transition"
          >
            {loading ? 'Calculating Customs Tariff...' : '🚗 Calculate Official Tokunbo Customs Import Duty'}
          </button>

          {dutyResult && (
            <div className="bg-slate-900/90 border border-red-500/30 rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-sm text-red-400 border-b border-slate-800 pb-2">
                NCS Customs Clearing Breakdown ({dutyResult.year} Vehicle)
              </h3>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="bg-slate-800/60 p-2 rounded">Import Duty (20%): <strong className="text-white font-mono">₦{dutyResult.importDuty.toLocaleString()}</strong></div>
                <div className="bg-slate-800/60 p-2 rounded">NAC Levy (15%): <strong className="text-white font-mono">₦{dutyResult.nacLevy.toLocaleString()}</strong></div>
                <div className="bg-slate-800/60 p-2 rounded">VAT (7.5%): <strong className="text-white font-mono">₦{dutyResult.vat.toLocaleString()}</strong></div>
                <div className="bg-slate-800/60 p-2 rounded">CISS & ECOWAS Levy: <strong className="text-white font-mono">₦{(dutyResult.cissLevy + dutyResult.ecowasTradeLevy).toLocaleString()}</strong></div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Customs Duty:</span>
                <span className="font-bold text-emerald-400 font-mono">₦{dutyResult.totalCustomsDuty.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEGAL CAC ENGINE */}
      {activeTool === 'legal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs text-slate-400 mb-1">CAC Entity Type</label>
              <select
                value={entityType}
                onChange={(e: any) => setEntityType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="business_name">Business Name (BN / Enterprise)</option>
                <option value="company_ltd">Private Limited Company (LTD)</option>
                <option value="incorporated_trustee">Incorporated Trustee (NGO/Church)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Share Capital (NGN ₦)</label>
              <input
                type="number"
                value={shareCapital}
                onChange={(e) => setShareCapital(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleCalculateCac}
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-sm shadow-lg transition"
          >
            {loading ? 'Calculating CAC Fees...' : '⚖️ Calculate CAC Registration & Stamp Duty Fees'}
          </button>

          {cacResult && (
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-sm text-indigo-400 border-b border-slate-800 pb-2">
                Official CAC Registration Cost ({cacResult.entityType.toUpperCase()})
              </h3>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="bg-slate-800/60 p-2 rounded">Name Reservation: <strong className="text-white font-mono">₦{cacResult.nameReservationFee.toLocaleString()}</strong></div>
                <div className="bg-slate-800/60 p-2 rounded">CAC Filing Fee: <strong className="text-white font-mono">₦{cacResult.cacFilingFee.toLocaleString()}</strong></div>
                <div className="bg-slate-800/60 p-2 rounded">FIRS Stamp Duty: <strong className="text-white font-mono">₦{cacResult.firsStampDuty.toLocaleString()}</strong></div>
                <div className="bg-slate-800/60 p-2 rounded">Timeline: <strong className="text-emerald-400">{cacResult.estimatedTimelineDays} Business Days</strong></div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Registration Cost:</span>
                <span className="font-bold text-emerald-400 font-mono">₦{cacResult.totalCost.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
