import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  MessageCircle, 
  CheckCircle2, 
  Zap, 
  Car, 
  Sun, 
  Building2, 
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  Phone
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { 
  ProgrammaticSeoEngine, 
  NIGERIAN_SOLAR_HUBS, 
  NIGERIAN_CAR_MODELS, 
  NIGERIAN_BUILDING_HUBS 
} from '@/lib/seo/programmaticSeoEngine';
import { WhatsAppShareToUnlockModal } from '@/components/WhatsAppShareToUnlockModal';
import { ClientShareGateTrigger } from './ClientShareGateTrigger';

interface PageProps {
  params: Promise<{
    category: string;
    location: string;
  }>;
}

export async function generateStaticParams() {
  const params: { category: string; location: string }[] = [];

  for (const hub of NIGERIAN_SOLAR_HUBS) {
    params.push({ category: 'solar-boq', location: hub.slug });
  }
  for (const car of NIGERIAN_CAR_MODELS) {
    params.push({ category: 'tokunbo-duty', location: car.slug });
  }
  for (const bld of NIGERIAN_BUILDING_HUBS) {
    params.push({ category: 'construction-estimator', location: bld.slug });
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, location } = await params;

  if (category === 'solar-boq') {
    const hub = ProgrammaticSeoEngine.resolveSolarHub(location);
    if (!hub) return { title: 'Solar Calculator | Bethelmind Digital Solutions' };
    return {
      title: `${hub.name} Solar BOQ & Band A Tariff Sizer 2026 | Bethelmind`,
      description: `Calculate 5kVA hybrid solar cost, DisCo Band A ₦${hub.bandATariff}/kWh savings, and diesel payback in ${hub.name}, ${hub.state}. Official 2026 Alaba market benchmarks.`,
      openGraph: {
        title: `${hub.name} Solar & Inverter Cost Sizer 2026`,
        description: `Stop overpaying solar installers in ${hub.name}. Exact 5kVA LiFePO4 battery & hybrid inverter BOQ breakdown.`,
      }
    };
  }

  if (category === 'tokunbo-duty') {
    const car = ProgrammaticSeoEngine.resolveCarModel(location);
    if (!car) return { title: 'Customs Duty Calculator | Bethelmind' };
    return {
      title: `${car.year} ${car.make} ${car.model} Customs Duty & VIN Clearing 2026 | Bethelmind`,
      description: `Official 2026 NCS Tin Can & PTML customs clearing valuation for ${car.year} ${car.make} ${car.model}. Duty: ₦${car.customsDutyNgn.toLocaleString()}. Avoid port demurrage and stolen catalytic converters.`,
    };
  }

  if (category === 'construction-estimator') {
    const bld = ProgrammaticSeoEngine.resolveBuildingHub(location);
    if (!bld) return { title: 'Building Material Matrix | Bethelmind' };
    return {
      title: `${bld.area} Building Material Cost & Foundation Guide 2026 | Bethelmind`,
      description: `2026 landed Dangote 42.5R cement, granite, sand, and 16mm TMT rebar prices for ${bld.area}, ${bld.city}. Geotechnical foundation and soil advice.`,
    };
  }

  return {
    title: 'Commercial Sector Tool | Bethelmind Digital Solutions',
    description: 'Autonomous Nigerian commercial sector calculators with 2026 market benchmarks.'
  };
}

export default async function ProgrammaticToolPage({ params }: PageProps) {
  const { category, location } = await params;

  // 1. SOLAR BOQ HUB
  if (category === 'solar-boq') {
    const hub = ProgrammaticSeoEngine.resolveSolarHub(location);
    if (!hub) notFound();

    const monthlyGridCostAt12h = Math.round(hub.bandATariff * 3.5 * 12 * 30); // 3.5 kW avg load
    const monthlyDieselCostAt6h = Math.round(2.2 * hub.dieselAvgPrice * 6 * 30); // 2.2L/hr gen
    const totalCurrentEnergyMonthly = monthlyGridCostAt12h + monthlyDieselCostAt6h;
    const est5kVaCost = 4850000;
    const paybackMonths = Math.round((est5kVaCost / (totalCurrentEnergyMonthly * 0.85)) * 10) / 10;

    return (
      <main className="min-h-screen bg-[#070b14] text-[#f5f3ef] selection:bg-[#d4af37]/20 font-sans">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-[#8e887e]">
            <Link href="/" className="hover:text-[#d4af37] transition">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-[#d4af37] transition">Sector Tools</Link>
            <span>/</span>
            <span className="text-[#d4af37] font-semibold">{hub.name}</span>
          </div>

          {/* Hero Header */}
          <div className="space-y-4 border-b border-white/[0.08] pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-[#d4af37] border border-[#d4af37]/30 text-xs font-bold uppercase tracking-wider">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{hub.state} Commercial Corridor · DisCo: {hub.disco}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight leading-snug sm:leading-tight">
              {hub.name} Solar BOQ & Band A Tariff Sizer (2026)
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Audited 5kVA / 10kVA Hybrid Solar Sizing vs ₦{hub.dieselAvgPrice.toLocaleString()}/L Diesel & ₦{hub.bandATariff}/kWh DisCo Band A Tariffs in {hub.name}.
            </p>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-[#8e887e] uppercase font-bold tracking-wider">DisCo Band A Tariff</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">₦{hub.bandATariff.toFixed(2)}/kWh</div>
              <span className="text-[11px] text-slate-400">Feeder: {hub.disco}</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-[#8e887e] uppercase font-bold tracking-wider">Avg Diesel Price</span>
              <div className="text-2xl font-black text-amber-400 font-mono">₦{hub.dieselAvgPrice.toLocaleString()}/L</div>
              <span className="text-[11px] text-slate-400">Local filling stations</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-[#8e887e] uppercase font-bold tracking-wider">Peak Sun Hours</span>
              <div className="text-2xl font-black text-cyan-400 font-mono">{hub.peakSunHours} PSH/Day</div>
              <span className="text-[11px] text-slate-400">Daily irradiance standard</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-[#8e887e] uppercase font-bold tracking-wider">Estimated Payback</span>
              <div className="text-2xl font-black text-white font-mono">{paybackMonths} Months</div>
              <span className="text-[11px] text-emerald-400">85% energy bill slash</span>
            </div>
          </div>

          {/* Detailed Financial & Engineering Matrix */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0e17] border border-white/[0.08] space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Audited 5kVA 48V Hybrid Solar BOQ Matrix for {hub.name}</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[#8e887e] uppercase font-semibold text-[11px]">
                    <th className="py-3 px-2">Component Description</th>
                    <th className="py-3 px-2">Audited Specification</th>
                    <th className="py-3 px-2 text-right">Alaba Wholesale</th>
                    <th className="py-3 px-2 text-right">Turnkey Installed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  <tr>
                    <td className="py-3 px-2 font-semibold text-white">5kVA 48V Hybrid Inverter</td>
                    <td className="py-3 px-2 text-slate-400">Pure Sine Wave, Dual MPPT 120-450VDC</td>
                    <td className="py-3 px-2 text-right font-mono">₦880,000</td>
                    <td className="py-3 px-2 text-right font-mono text-[#d4af37]">₦1,150,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-semibold text-white">51.2V 200Ah LiFePO4 Battery</td>
                    <td className="py-3 px-2 text-slate-400">10.24kWh, Smart BMS, 6,000 Cycles</td>
                    <td className="py-3 px-2 text-right font-mono">₦2,100,000</td>
                    <td className="py-3 px-2 text-right font-mono text-[#d4af37]">₦2,350,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-semibold text-white">Mono Half-Cut Tier-1 Panels (6x 550W)</td>
                    <td className="py-3 px-2 text-slate-400">3,300W Array, Anodized Aluminum Racking</td>
                    <td className="py-3 px-2 text-right font-mono">₦630,000</td>
                    <td className="py-3 px-2 text-right font-mono text-[#d4af37]">₦820,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-semibold text-white">DC Surge Protection & 32A Changeover</td>
                    <td className="py-3 px-2 text-slate-400">1000V DC SPD, 25mm pure copper flex cables</td>
                    <td className="py-3 px-2 text-right font-mono">₦210,000</td>
                    <td className="py-3 px-2 text-right font-mono text-[#d4af37]">₦320,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Client Share Gate Trigger Component */}
            <ClientShareGateTrigger
              toolTitle={`5kVA Solar BOQ & Band A Tariff Sizer for ${hub.name}`}
              toolSlug={`tools/solar-boq/${hub.slug}`}
              pdfDownloadUrl="http://169.58.182.92:5000/reports/BM-SOLAR-BOQ-002015.pdf"
              reportReferenceCode={`BM-SOLAR-${hub.slug.toUpperCase().slice(0, 8)}`}
              summaryHighlights={[
                `Feeder DisCo: ${hub.disco} (Band A: ₦${hub.bandATariff}/kWh)`,
                `Local Diesel Benchmark: ₦${hub.dieselAvgPrice}/L`,
                `5kVA Payback Period: ${paybackMonths} Months`,
                `Certified Enterprise: CAC Reg 9912717`
              ]}
            />
          </div>

        </div>

        <Footer />
      </main>
    );
  }

  // 2. TOKUNBO CAR DUTY HUB
  if (category === 'tokunbo-duty') {
    const car = ProgrammaticSeoEngine.resolveCarModel(location);
    if (!car) notFound();

    return (
      <main className="min-h-screen bg-[#070b14] text-[#f5f3ef] selection:bg-[#d4af37]/20 font-sans">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-[#8e887e]">
            <Link href="/" className="hover:text-[#d4af37] transition">Home</Link>
            <span>/</span>
            <Link href="/vin" className="hover:text-[#d4af37] transition">VIN Checker</Link>
            <span>/</span>
            <span className="text-[#d4af37] font-semibold">{car.year} {car.make} {car.model}</span>
          </div>

          {/* Hero Header */}
          <div className="space-y-4 border-b border-white/[0.08] pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
              <Car className="w-3.5 h-3.5" />
              <span>NCS Statutory Tariff · Terminal: {car.terminalPort}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight leading-snug sm:leading-tight">
              {car.year} {car.make} {car.model} Customs Duty & VIN Clearing Sheet (2026)
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Official Nigeria Customs Service (NCS) 20% statutory import duty, 15% NAC levy, and Grimaldi/Tin Can terminal demurrage breakdown for {car.year} {car.make} {car.model} ({car.engineSize}).
            </p>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-[#8e887e] uppercase font-bold tracking-wider">Statutory Import Duty</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">₦{car.customsDutyNgn.toLocaleString()}</div>
              <span className="text-[11px] text-slate-400">20% Statutory Rate</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-[#8e887e] uppercase font-bold tracking-wider">NAC Levy</span>
              <div className="text-2xl font-black text-amber-400 font-mono">₦{car.nacLevyNgn.toLocaleString()}</div>
              <span className="text-[11px] text-slate-400">15% National Auto Council</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-[#8e887e] uppercase font-bold tracking-wider">Port & Surcharges</span>
              <div className="text-2xl font-black text-cyan-400 font-mono">₦{(car.vatNgn + car.terminalDemurrageNgn).toLocaleString()}</div>
              <span className="text-[11px] text-slate-400">VAT + Demurrage Buffer</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-[#8e887e] uppercase font-bold tracking-wider">Total Landed Clearance</span>
              <div className="text-2xl font-black text-white font-mono">₦{car.totalClearingEstimateNgn.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-400">Estimated Port Release</span>
            </div>
          </div>

          {/* Critical Warnings */}
          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Pre-Wire Warning for {car.make} {car.model} Buyers in Lagos</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Verify the catalytic converter (&quot;Indomie&quot;) before wiring clearing funds. Corrupt dock handlers frequently strip OEM converters (worth ₦450,000–₦650,000 on {car.model}) and install dummy pipe resonators before release.
            </p>
          </div>

          {/* Client Share Gate Trigger Component */}
          <ClientShareGateTrigger
            toolTitle={`${car.year} ${car.make} ${car.model} Official Duty Valuation`}
            toolSlug={`tools/tokunbo-duty/${car.slug}`}
            pdfDownloadUrl="http://169.58.182.92:5000/reports/REP-JHLRD1851WC804433.pdf"
            reportReferenceCode={`REP-${car.slug.toUpperCase().slice(0, 8)}`}
            summaryHighlights={[
              `Vehicle: ${car.year} ${car.make} ${car.model} (${car.engineSize})`,
              `Statutory Duty: ₦${car.customsDutyNgn.toLocaleString()}`,
              `Total Port Clearing Estimate: ₦${car.totalClearingEstimateNgn.toLocaleString()}`,
              `CAC Verification: Bethelmind Digital Solutions (Reg: 9912717)`
            ]}
          />

        </div>

        <Footer />
      </main>
    );
  }

  // 3. CONSTRUCTION ESTIMATOR HUB
  if (category === 'construction-estimator') {
    const bld = ProgrammaticSeoEngine.resolveBuildingHub(location);
    if (!bld) notFound();

    return (
      <main className="min-h-screen bg-[#070b14] text-[#f5f3ef] selection:bg-[#d4af37]/20 font-sans">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
          
          <div className="flex items-center gap-2 text-xs text-[#8e887e]">
            <Link href="/" className="hover:text-[#d4af37] transition">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-[#d4af37] transition">Sector Tools</Link>
            <span>/</span>
            <span className="text-[#d4af37] font-semibold">{bld.area}</span>
          </div>

          <div className="space-y-4 border-b border-white/[0.08] pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>{bld.city} Corridor · Soil Type: {bld.soilType}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight leading-snug sm:leading-tight">
              {bld.area} Building Material Cost & Foundation Guide (2026)
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Real-time landed prices for Dangote 42.5R Cement, 16mm TMT iron rods, sharp sand, granite, and geotechnical foundation recommendations for {bld.area}, {bld.city}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-[#8e887e] uppercase font-bold tracking-wider">Dangote 42.5R Cement</span>
              <div className="text-2xl font-black text-white font-mono">₦{bld.cementPricePerBag.toLocaleString()}/Bag</div>
              <span className="text-[11px] text-slate-400">Direct Landed Site Rate</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-[#8e887e] uppercase font-bold tracking-wider">16mm TMT Iron Rods</span>
              <div className="text-2xl font-black text-cyan-400 font-mono">₦{bld.ironRodPricePerTonne.toLocaleString()}/Tonne</div>
              <span className="text-[11px] text-slate-400">High-Tensile Billet</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-[#8e887e] uppercase font-bold tracking-wider">Sharp Sand (20T Tipper)</span>
              <div className="text-2xl font-black text-amber-400 font-mono">₦{bld.sandPricePerTrip.toLocaleString()}</div>
              <span className="text-[11px] text-slate-400">Direct Dredger Rate</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-[#8e887e] uppercase font-bold tracking-wider">Granite (30T Tipper)</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">₦{bld.granitePricePerTrip.toLocaleString()}</div>
              <span className="text-[11px] text-slate-400">Quarry Direct Rate</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/30 space-y-2">
            <div className="text-sm font-bold text-blue-300">Geotechnical Foundation Recommendation for {bld.area}:</div>
            <p className="text-xs sm:text-sm text-slate-200">{bld.raftOrPilingRecommended}</p>
          </div>

          <ClientShareGateTrigger
            toolTitle={`Building Material Price Index for ${bld.area}`}
            toolSlug={`tools/construction-estimator/${bld.slug}`}
            pdfDownloadUrl="http://169.58.182.92:5000/reports/BM-MORTGAGE-CALCULATOR-013082.pdf"
            reportReferenceCode={`BM-BLD-${bld.slug.toUpperCase().slice(0, 8)}`}
            summaryHighlights={[
              `Location: ${bld.area}, ${bld.city}`,
              `Dangote 42.5R Cement: ₦${bld.cementPricePerBag.toLocaleString()}/Bag`,
              `16mm TMT Steel: ₦${bld.ironRodPricePerTonne.toLocaleString()}/Tonne`,
              `Accreditation: CAC Reg 9912717`
            ]}
          />

        </div>

        <Footer />
      </main>
    );
  }

  notFound();
}
