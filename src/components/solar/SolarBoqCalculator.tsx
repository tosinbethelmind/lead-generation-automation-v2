'use client';

import React, { useState, useMemo } from 'react';
import { 
  Sun, 
  BatteryCharging, 
  Zap, 
  TrendingDown, 
  FileText, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw,
  Building,
  Home,
  Factory,
  ChevronRight,
  Info
} from 'lucide-react';
import { ExecutivePdfQuoteModal } from '@/components/ExecutivePdfQuoteModal';

export interface SolarBoqCalculatorProps {
  businessName?: string;
  adminPhone?: string;
  isEmbedded?: boolean;
}

interface ApplianceItem {
  id: string;
  name: string;
  category: 'cooling' | 'heavy' | 'appliances' | 'lighting';
  wattage: number;
  defaultQty: number;
  hoursDay: number;
}

const APPLIANCE_CATALOG: ApplianceItem[] = [
  { id: 'ac_1hp', name: '1.0 HP Inverter AC', category: 'cooling', wattage: 900, defaultQty: 1, hoursDay: 8 },
  { id: 'ac_1_5hp', name: '1.5 HP Inverter AC', category: 'cooling', wattage: 1300, defaultQty: 0, hoursDay: 8 },
  { id: 'ac_2hp', name: '2.0 HP Standard AC', category: 'cooling', wattage: 2000, defaultQty: 0, hoursDay: 6 },
  { id: 'fridge_inv', name: 'Deep Freezer / Inverter Fridge', category: 'appliances', wattage: 350, defaultQty: 1, hoursDay: 24 },
  { id: 'water_pump', name: '1.0 HP Submersible Water Pump', category: 'heavy', wattage: 1100, defaultQty: 1, hoursDay: 2 },
  { id: 'lighting', name: 'LED Bulbs & Security Lights (10 pcs)', category: 'lighting', wattage: 120, defaultQty: 1, hoursDay: 10 },
  { id: 'tv_sound', name: 'Smart TV + Decoder + Soundbar', category: 'appliances', wattage: 200, defaultQty: 1, hoursDay: 8 },
  { id: 'pc_workstation', name: 'Desktop PC / Laptops & Wi-Fi Routers', category: 'appliances', wattage: 300, defaultQty: 1, hoursDay: 10 },
];

export default function SolarBoqCalculator({
  businessName = 'Your Business Name',
  adminPhone = '2348022791227',
  isEmbedded = false,
}: SolarBoqCalculatorProps) {
  // 1. Property & Location
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial' | 'industrial'>('residential');
  const [locationState, setLocationState] = useState<string>('Lagos');
  
  // 2. Appliances Selection
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    APPLIANCE_CATALOG.forEach(a => {
      initial[a.id] = a.defaultQty;
    });
    return initial;
  });

  // 3. Operational Requirements
  const [backupHours, setBackupHours] = useState<number>(12);
  const [batteryType, setBatteryType] = useState<'lithium' | 'gel'>('lithium');
  const [budgetTier, setBudgetTier] = useState<'economy' | 'standard' | 'premium'>('standard');
  const [roofAreaSqm, setRoofAreaSqm] = useState<number>(45);

  // 4. Current Energy Expenditure (Diesel / DisCo Band A)
  const [generatorFuelType, setGeneratorFuelType] = useState<'diesel' | 'petrol'>('diesel');
  const [generatorLitersPerDay, setGeneratorLitersPerDay] = useState<number>(15);
  const [fuelCostPerLiter, setFuelCostPerLiter] = useState<number>(1150); // Diesel ₦1,150/L
  const [discoBandTariff, setDiscoBandTariff] = useState<'Band A' | 'Band B' | 'Band C'>('Band A');
  const [discoMonthlySpendNgn, setDiscoMonthlySpendNgn] = useState<number>(120000);

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  // Calculations
  const metrics = useMemo(() => {
    let totalContinuousWatts = 0;
    let totalDailyKwh = 0;

    APPLIANCE_CATALOG.forEach(item => {
      const qty = quantities[item.id] || 0;
      if (qty > 0) {
        totalContinuousWatts += item.wattage * qty;
        totalDailyKwh += (item.wattage * qty * item.hoursDay) / 1000;
      }
    });

    // Surge Factor & kVA Sizing
    // Inverters sized with 1.35x headroom for inductive motor surges (compressors, pumps)
    const surgeWatts = totalContinuousWatts * 1.35;
    let recommendedKva = 3.5;
    if (surgeWatts > 8000) recommendedKva = 15;
    else if (surgeWatts > 5500) recommendedKva = 10;
    else if (surgeWatts > 3200) recommendedKva = 7.5;
    else if (surgeWatts > 2200) recommendedKva = 5;
    else if (surgeWatts > 1400) recommendedKva = 3.5;
    else recommendedKva = 2.5;

    // Battery Bank Sizing (kWh needed during backup hours)
    // Daily nighttime load estimated at 60% of total daily kWh
    const backupKwhNeeded = (totalDailyKwh * (backupHours / 24)) * 1.15; // 15% efficiency buffer
    
    // Depth of Discharge: LiFePO4 = 90% DoD, Gel = 50% DoD
    const dod = batteryType === 'lithium' ? 0.90 : 0.50;
    const grossBatteryKwh = backupKwhNeeded / dod;
    
    // 5.12kWh 48V 100Ah LiFePO4 packs or 2.4kWh 12V 200Ah Gel
    const lithiumPacks = Math.max(1, Math.ceil(grossBatteryKwh / 5.12));
    const gelBatteries = Math.max(2, Math.ceil(grossBatteryKwh / 2.4));

    // Solar PV Array Sizing (Peak Sun Hours: Lagos ~ 4.2h, Abuja ~ 5.1h, North ~ 5.5h)
    const peakSunHours = locationState === 'Lagos' ? 4.2 : locationState === 'Abuja' ? 5.0 : 4.6;
    const requiredArrayKw = (totalDailyKwh * 1.25) / peakSunHours; // 25% system loss/dust factor
    const panelWatts = 550; // Tier-1 Monocrystalline
    const panelCount = Math.max(4, Math.ceil((requiredArrayKw * 1000) / panelWatts));
    const totalSolarKw = (panelCount * panelWatts) / 1000;
    const requiredRoofSqm = Math.ceil(panelCount * 2.6); // 2.6 sqm per 550W panel

    // Pricing Model (Sensible 2026 Nigerian Market Rates)
    const inverterUnitRate = recommendedKva <= 5 ? 175000 : 160000;
    const inverterCost = Math.round(recommendedKva * inverterUnitRate);
    
    const panelCost = panelCount * 115000;
    const batteryCost = batteryType === 'lithium' 
      ? lithiumPacks * 1280000 // 5.12kWh LiFePO4
      : gelBatteries * 340000; // 200Ah Gel

    const balanceOfSystem = Math.round(
      (inverterCost + panelCost + batteryCost) * 0.14 // DC breakers, Surge arrestors, Cabling, Aluminum Rails
    );
    const installationLabor = Math.round(
      (inverterCost + panelCost + batteryCost + balanceOfSystem) * 0.10
    );

    const baseBoqTotal = inverterCost + panelCost + batteryCost + balanceOfSystem + installationLabor;
    
    // Budget tier multiplier
    const tierMultiplier = budgetTier === 'economy' ? 0.88 : budgetTier === 'premium' ? 1.18 : 1.0;
    const finalBoqTotal = Math.round(baseBoqTotal * tierMultiplier);
    const deposit50Percent = Math.round(finalBoqTotal * 0.5);

    // Fuel Displacement & Payback Economics
    const monthlyFuelCost = generatorLitersPerDay * 30 * fuelCostPerLiter;
    // Estimated 80% generator elimination
    const monthlyDieselSaved = Math.round(monthlyFuelCost * 0.82);
    // Estimated 40% DisCo bill reduction (solar generation during peak Band A daylight tariff)
    const monthlyDiscoSaved = Math.round(discoMonthlySpendNgn * 0.45);
    const totalMonthlyEnergySavings = monthlyDieselSaved + monthlyDiscoSaved;

    const paybackPeriodMonths = totalMonthlyEnergySavings > 0 
      ? Math.max(4, Math.round((finalBoqTotal / totalMonthlyEnergySavings) * 10) / 10) 
      : 24;

    return {
      totalContinuousWatts,
      totalDailyKwh: Math.round(totalDailyKwh * 10) / 10,
      recommendedKva,
      backupKwhNeeded: Math.round(backupKwhNeeded * 10) / 10,
      lithiumPacks,
      gelBatteries,
      panelCount,
      totalSolarKw: Math.round(totalSolarKw * 10) / 10,
      requiredRoofSqm,
      roofSufficient: roofAreaSqm >= requiredRoofSqm,
      finalBoqTotal,
      deposit50Percent,
      monthlyFuelCost,
      monthlyDieselSaved,
      monthlyDiscoSaved,
      totalMonthlyEnergySavings,
      paybackPeriodMonths,
    };
  }, [
    quantities, 
    backupHours, 
    batteryType, 
    budgetTier, 
    roofAreaSqm, 
    locationState, 
    generatorLitersPerDay, 
    fuelCostPerLiter, 
    discoMonthlySpendNgn
  ]);

  const whatsappMessage = encodeURIComponent(
    `Hello Bethelmind Lagos Solar Desk!\n\nI just sized a *${metrics.recommendedKva}kVA Solar Hybrid Proposal* on your official website:\n` +
    `• Load: ${metrics.totalContinuousWatts}W (${metrics.totalDailyKwh} kWh/day)\n` +
    `• Recommended Inverter: ${metrics.recommendedKva}kVA Pure Sine Wave\n` +
    `• Storage: ${batteryType === 'lithium' ? `${metrics.lithiumPacks}x 5.12kWh LiFePO4 Lithium` : `${metrics.gelBatteries}x 200Ah Gel Batteries`}\n` +
    `• Solar Array: ${metrics.panelCount}x 550W Tier-1 Panels (${metrics.totalSolarKw} kWp)\n` +
    `• Estimated BOQ: ₦${metrics.finalBoqTotal.toLocaleString()}\n` +
    `• Est. Monthly Savings: ₦${metrics.totalMonthlyEnergySavings.toLocaleString()} (Payback: ~${metrics.paybackPeriodMonths} months)\n\n` +
    `Please schedule our site inspection and issue the bankable procurement proposal.`
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 font-sans">
      {/* Title & Value Strip */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sun className="w-3.5 h-3.5" />
              <span>Nigerian Solar & Inverter Engineering Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">
              Solar Load & BOQ Quotation Engine
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Calculates DisCo Band A (₦209.50/kWh) tariff avoidance vs generator diesel fuel economics, sizes 51.2V LiFePO4 battery banks, and generates bankable 3-tier customer proposals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <ExecutivePdfQuoteModal
              businessName={businessName}
              category="Solar & Renewable Energy EPC"
              location={`${locationState}, Nigeria`}
              toolType="Solar Hybrid & BOQ Proposal Builder"
              claimFeeNgn={65000}
              depositFeeNgn={35000}
              adminPhone={adminPhone}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Real-Time Sizing Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Property & Energy Profile */}
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>1. Property & Location Profile</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'residential', label: 'Residential', icon: Home },
                { id: 'commercial', label: 'Commercial', icon: Building },
                { id: 'industrial', label: 'Industrial', icon: Factory },
              ].map(t => {
                const Icon = t.icon;
                const active = propertyType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPropertyType(t.id as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                      active 
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10' 
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  State / Solar Radiation Zone
                </label>
                <select
                  value={locationState}
                  onChange={(e) => setLocationState(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="Lagos">Lagos State (4.2 Peak Sun Hours)</option>
                  <option value="Abuja">Abuja / FCT (5.0 Peak Sun Hours)</option>
                  <option value="Rivers">Rivers / Port Harcourt (4.0 PSH)</option>
                  <option value="Oyo">Oyo / Ibadan (4.4 PSH)</option>
                  <option value="Kano">Kano / Kaduna (5.5 PSH)</option>
                  <option value="Enugu">Enugu / Anambra (4.5 PSH)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Available Roof Area (Square Metres)
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={roofAreaSqm}
                  onChange={(e) => setRoofAreaSqm(Number(e.target.value) || 20)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Appliances & Load Selection */}
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>2. Appliance Load Configuration</span>
              </h3>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {metrics.totalContinuousWatts.toLocaleString()} W Active
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {APPLIANCE_CATALOG.map(item => {
                const qty = quantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">{item.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.wattage}W each &bull; ~{item.hoursDay} hrs/day
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold text-sm transition-all"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white font-mono">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600/50 flex items-center justify-center font-bold text-sm transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Storage & Battery Technology */}
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              <span>3. Battery Chemistry & Autonomy Hours</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Night/Blackout Backup Autonomy
                </label>
                <div className="flex gap-2">
                  {[8, 12, 18, 24].map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setBackupHours(h)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        backupHours === h
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Battery Chemistry Selection
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBatteryType('lithium')}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      batteryType === 'lithium'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    51.2V LiFePO4
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatteryType('gel')}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      batteryType === 'gel'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    12V Deep Cycle Gel
                  </button>
                </div>
              </div>
            </div>

            {/* Current Gen & Grid Spend (Diesel Economics) */}
            <div className="pt-2 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Current Generator Fuel (Liters/Day)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={generatorLitersPerDay}
                    onChange={(e) => setGeneratorLitersPerDay(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono"
                  />
                  <span className="text-xs text-slate-400 shrink-0">L/day</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Monthly DisCo Power Spend (₦)
                </label>
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={discoMonthlySpendNgn}
                  onChange={(e) => setDiscoMonthlySpendNgn(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Engineering Sizing & Bill of Quantities (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-6 sticky top-24">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Engineering Sizing Output
                </span>
                <h3 className="text-xl font-black text-white font-['Outfit']">
                  {metrics.recommendedKva} kVA Pure Sine Wave
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                Tier-1 Hardware
              </span>
            </div>

            {/* Spec Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-slate-400 text-[11px]">Daily Consumption</p>
                <p className="text-base font-bold text-white font-mono mt-0.5">
                  {metrics.totalDailyKwh} <span className="text-xs font-normal text-slate-400">kWh/day</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-slate-400 text-[11px]">Solar PV Array</p>
                <p className="text-base font-bold text-amber-400 font-mono mt-0.5">
                  {metrics.totalSolarKw} <span className="text-xs font-normal text-slate-400">kWp</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {metrics.panelCount}x 550W Panels
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-slate-400 text-[11px]">Battery Storage</p>
                <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                  {batteryType === 'lithium' ? `${metrics.lithiumPacks}x 5.12kWh` : `${metrics.gelBatteries}x 200Ah`}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {batteryType === 'lithium' ? '90% DoD LiFePO4' : '50% DoD Deep Cycle'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-slate-400 text-[11px]">Roof Space Needed</p>
                <p className={`text-base font-bold font-mono mt-0.5 ${metrics.roofSufficient ? 'text-white' : 'text-rose-400'}`}>
                  {metrics.requiredRoofSqm} <span className="text-xs font-normal text-slate-400">sqm</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {metrics.roofSufficient ? 'Sufficient roof space' : 'Limited roof space'}
                </p>
              </div>
            </div>

            {/* Financial & Payback Summary */}
            <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Estimated Turnkey BOQ Total:</span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  ₦{metrics.finalBoqTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-amber-500/10 pt-2">
                <span className="text-slate-400">50% Commitment Milestone:</span>
                <span className="text-xs font-bold text-slate-200 font-mono">
                  ₦{metrics.deposit50Percent.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-amber-500/10 pt-2">
                <span className="text-emerald-400 font-medium">Monthly Fuel & Tariff Saved:</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  +₦{metrics.totalMonthlyEnergySavings.toLocaleString()}/mo
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-amber-500/10 pt-2">
                <span className="text-slate-300 font-semibold">Estimated Payback Horizon:</span>
                <span className="text-xs font-extrabold text-cyan-300">
                  ~{metrics.paybackPeriodMonths} Months
                </span>
              </div>
            </div>

            {/* Actions: Send to WhatsApp & Proposal Generation */}
            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/${adminPhone}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send Sizing to WhatsApp Proposal Desk →</span>
              </a>

              <div className="text-center">
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Includes 5-Year Inverter Warranty & 10-Year Panel Warranty</span>
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Assumptions & Disclaimers Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 leading-relaxed flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-300">Nigerian Market Engineering Assumptions:</p>
          <p>
            Calculations use 4.2 to 5.5 daily Peak Sun Hours (PSH) across Nigerian geographic zones, 550W Tier-1 Monocrystalline PV panels (115k/panel), and 51.2V LiFePO4 batteries with 90% Depth-of-Discharge. Fuel displacement assumes diesel at ₦1,150/L and petrol at ₦950/L with 80% generator operational displacement. Final site inspection required before structural roof mounting sign-off.
          </p>
        </div>
      </div>
    </div>
  );
}
