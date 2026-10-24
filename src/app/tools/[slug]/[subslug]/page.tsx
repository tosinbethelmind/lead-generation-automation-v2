import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Car, 
  Building2, 
  Zap, 
  Share2, 
  Info,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import SolarBoqCalculator from '@/components/solar/SolarBoqCalculator';
import { SectorToolsWidget } from '@/components/SectorToolsWidget';
import { InstantBrandCustomizer } from '@/components/InstantBrandCustomizer';
import { ViralQuoteForwarder } from '@/components/ViralQuoteForwarder';
import { WhatsAppLeadMagnetModal } from '@/components/WhatsAppLeadMagnetModal';
import StickyMobileConversionBar from '@/components/StickyMobileConversionBar';
import { 
  ProgrammaticSeoEngine, 
  NIGERIAN_SOLAR_HUBS, 
  NIGERIAN_CAR_MODELS, 
  NIGERIAN_BUILDING_HUBS 
} from '@/lib/seo/programmaticSeoEngine';

interface Props {
  params: Promise<{ slug: string; subslug: string }>;
}

export const dynamicParams = true;

// Pre-render top programmatic parameters
export async function generateStaticParams() {
  const params: { slug: string; subslug: string }[] = [];

  for (const loc of NIGERIAN_SOLAR_HUBS) {
    params.push({ slug: 'solar-boq', subslug: loc.slug });
  }
  for (const car of NIGERIAN_CAR_MODELS) {
    params.push({ slug: 'tokunbo-duty', subslug: car.slug });
  }
  for (const bld of NIGERIAN_BUILDING_HUBS) {
    params.push({ slug: 'construction-estimator', subslug: bld.slug });
  }

  return params;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, subslug } = await params;

  if (slug === 'solar-boq') {
    const loc = ProgrammaticSeoEngine.resolveSolarHub(subslug);
    if (!loc) return { title: 'Solar BOQ Sizer | Bethelmind' };
    return {
      title: `${loc.name} Solar System Cost & BOQ Calculator (2026 ${loc.disco} Band A Tariffs)`,
      description: `Audited 5kVA, 10kVA and commercial solar installation costs for ${loc.name}, ${loc.state}. Calculate DisCo Band A (₦${loc.bandATariff}/kWh) diesel replacement and payback.`,
      alternates: {
        canonical: `https://www.bethelmindanalytics.com/tools/solar-boq/${subslug}`
      }
    };
  }

  if (slug === 'tokunbo-duty') {
    const car = ProgrammaticSeoEngine.resolveCarModel(subslug);
    if (!car) return { title: 'Customs Duty Calculator | Bethelmind' };
    return {
      title: `${car.year} ${car.make} ${car.model} Customs Duty & Surcharge Clearing Sheet (NCS 2026)`,
      description: `Official 2026 Nigeria Customs statutory 20% import duty, 15% NAC levy, VAT, and ${car.terminalPort} terminal demurrage costs for ${car.year} ${car.make} ${car.model}.`,
      alternates: {
        canonical: `https://www.bethelmindanalytics.com/tools/tokunbo-duty/${subslug}`
      }
    };
  }

  if (slug === 'construction-estimator') {
    const bld = ProgrammaticSeoEngine.resolveBuildingHub(subslug);
    if (!bld) return { title: 'Building Material Estimator | Bethelmind' };
    return {
      title: `2026 Building Material Prices in ${bld.area}, ${bld.city}: Sand, Granite & Cement Sheet`,
      description: `Current prices for sharp sand, 30-tonne granite, 42.5R cement, and iron rods in ${bld.area}. Audited foundation and soil piling guide.`,
      alternates: {
        canonical: `https://www.bethelmindanalytics.com/tools/construction-estimator/${subslug}`
      }
    };
  }

  return {
    title: 'Bethelmind Commercial Sector Tool',
    description: 'Enterprise B2B commercial calculator for Nigerian businesses.'
  };
}

export default async function ProgrammaticToolPage({ params }: Props) {
  const { slug, subslug } = await params;

  // 1. SOLAR REGIONAL HUB HANDLER
  if (slug === 'solar-boq') {
    const loc = ProgrammaticSeoEngine.resolveSolarHub(subslug);
    if (!loc) notFound();

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter']">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/tools" className="hover:text-cyan-400 transition-colors">Tools</Link>
            <span>/</span>
            <Link href="/tools/solar-boq" className="hover:text-cyan-400 transition-colors">Solar BOQ</Link>
            <span>/</span>
            <span className="text-cyan-300 font-semibold">{loc.name}</span>
          </div>

          {/* Localized Hero */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-white/10 p-6 sm:p-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/25 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{loc.state} State Regional Grid Specification</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight">
              {loc.name} Solar Load & Cost Estimator
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Audited 2026 renewable engineering model calibrated for <strong className="text-cyan-300">{loc.disco}</strong> customers facing Band A tariffs of <strong>₦{loc.bandATariff.toFixed(2)}/kWh</strong> and diesel generator fuel costs averaging <strong>₦{loc.dieselAvgPrice.toLocaleString()}/Liter</strong>.
            </p>

            {/* Local Key Metrics Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[11px] text-slate-400">DisCo Provider</span>
                <span className="text-xs sm:text-sm font-bold text-white">{loc.disco.split('(')[0]}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[11px] text-slate-400">Band A Tariff</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">₦{loc.bandATariff}/kWh</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[11px] text-slate-400">Peak Sun Hours</span>
                <span className="text-xs sm:text-sm font-bold text-amber-400">{loc.peakSunHours}h / day</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[11px] text-slate-400">Diesel Baseline</span>
                <span className="text-xs sm:text-sm font-bold text-cyan-400">₦{loc.dieselAvgPrice}/L</span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator */}
          <SolarBoqCalculator businessName={`${loc.name} Solar EPC`} adminPhone="2348022791227" />

          {/* Viral WhatsApp Proposal Forwarder */}
          <ViralQuoteForwarder 
            toolSlug={`solar-boq/${loc.slug}`} 
            toolTitle={`Solar BOQ Quote (${loc.name})`}
            category="Solar & Renewable Energy"
            summaryMetrics={[
              { label: 'Location / DisCo Area', value: `${loc.name} (${loc.disco})` },
              { label: 'DisCo Band A Tariff Avoided', value: `₦${loc.bandATariff}/kWh` },
              { label: 'Estimated Payback Period', value: '14 to 16 Months vs Diesel' }
            ]}
          />

          {/* High-Converting WhatsApp Lead Magnet Gate */}
          <WhatsAppLeadMagnetModal toolSlug="solar-boq" category="Solar & Renewable Energy" title={`Solar BOQ (${loc.name})`} />

          {/* 1-Tap Brand Customizer */}
          <InstantBrandCustomizer 
            toolTitle={`Solar BOQ Sizer (${loc.name})`} 
            category="Solar & Renewable Energy" 
            defaultSectorName={`${loc.name} Solar Energy Ltd`}
          />
        </main>

        <Footer />

        {/* Zero-Friction 1-Tap Floating WhatsApp Magnet Pill (Mobile) */}
        <StickyMobileConversionBar toolSlug="solar-boq" category="Solar & Renewable Energy" />
      </div>
    );
  }

  // 2. CAR CUSTOMS DUTY & SURCHARGE HANDLER
  if (slug === 'tokunbo-duty') {
    const car = ProgrammaticSeoEngine.resolveCarModel(subslug);
    if (!car) notFound();

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter']">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/tools" className="hover:text-cyan-400 transition-colors">Tools</Link>
            <span>/</span>
            <Link href="/tools/tokunbo-duty" className="hover:text-cyan-400 transition-colors">Tokunbo Duty</Link>
            <span>/</span>
            <span className="text-cyan-300 font-semibold">{car.year} {car.make} {car.model}</span>
          </div>

          {/* Car Hero */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-white/10 p-6 sm:p-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/25 text-xs font-bold">
              <Car className="w-3.5 h-3.5 text-cyan-400" />
              <span>NCS 2026 Single-Sheet Valuation Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight">
              {car.year} {car.make} {car.model} Customs Duty Sheet
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Audited port clearing breakdown for the <strong>{car.year} {car.make} {car.model} ({car.engineSize})</strong> discharged at <strong className="text-cyan-300">{car.terminalPort}</strong>, factoring in statutory 20% import duty, 15% NAC levy, 7.5% VAT, and terminal shipping fees.
            </p>

            {/* Itemized Duty Sheet */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[11px] text-slate-400">Statutory 20% Duty</span>
                <span className="text-xs sm:text-sm font-bold text-white">₦{car.customsDutyNgn.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[11px] text-slate-400">15% NAC Levy</span>
                <span className="text-xs sm:text-sm font-bold text-white">₦{car.nacLevyNgn.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[11px] text-slate-400">Terminal Shipping Fee</span>
                <span className="text-xs sm:text-sm font-bold text-amber-400">₦{car.terminalDemurrageNgn.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-emerald-500/30 bg-emerald-500/10">
                <span className="block text-[11px] text-emerald-400 font-bold">Total Clearing Est.</span>
                <span className="text-xs sm:text-sm font-black text-emerald-300">₦{car.totalClearingEstimateNgn.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator */}
          <SectorToolsWidget businessCategory="Automotive & Tokunbo Dealership" hideHeader={true} />

          {/* Viral WhatsApp Proposal Forwarder */}
          <ViralQuoteForwarder 
            toolSlug={`tokunbo-duty/${car.slug}`} 
            toolTitle={`${car.year} ${car.make} ${car.model} Customs Duty Quote`}
            category="Automotive & Tokunbo Dealership"
            summaryMetrics={[
              { label: 'Vehicle', value: `${car.year} ${car.make} ${car.model} (${car.engineSize})` },
              { label: 'Discharge Terminal', value: car.terminalPort },
              { label: 'Estimated Port Release Total', value: `₦${car.totalClearingEstimateNgn.toLocaleString()}` }
            ]}
          />

          {/* High-Converting WhatsApp Lead Magnet Gate */}
          <WhatsAppLeadMagnetModal toolSlug="tokunbo-duty" category="Automotive & Tokunbo Dealership" title={`${car.year} ${car.make} ${car.model} Duty`} />

          {/* 1-Tap Brand Customizer */} 
          <InstantBrandCustomizer 
            toolTitle={`Car Duty Portal (${car.make} ${car.model})`} 
            category="Automotive & Tokunbo Dealership" 
            defaultSectorName="Lagos Auto Clearing Logistics Ltd"
          />
        </main>

        <Footer />

        {/* Zero-Friction 1-Tap Floating WhatsApp Magnet Pill (Mobile) */}
        <StickyMobileConversionBar toolSlug="tokunbo-duty" category="Automotive & Tokunbo Dealership" />
      </div>
    );
  }

  // 3. BUILDING MATERIALS & SOIL PILING HANDLER
  if (slug === 'construction-estimator') {
    const bld = ProgrammaticSeoEngine.resolveBuildingHub(subslug);
    if (!bld) notFound();

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter']">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/tools" className="hover:text-cyan-400 transition-colors">Tools</Link>
            <span>/</span>
            <Link href="/tools/construction-estimator" className="hover:text-cyan-400 transition-colors">Construction</Link>
            <span>/</span>
            <span className="text-cyan-300 font-semibold">{bld.area}</span>
          </div>

          {/* Building Hero */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-white/10 p-6 sm:p-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/25 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Site Cost & Soil Matrix: {bld.city}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight">
              {bld.area} Building Material Cost Sheet (2026)
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Audited contractor procurement index for site development in <strong className="text-cyan-300">{bld.area}, {bld.city}</strong>. Soil profile characterized as <strong>{bld.soilType}</strong>. Foundation recommendation: <strong>{bld.raftOrPilingRecommended}</strong>.
            </p>

            {/* Material Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[11px] text-slate-400">20-Tonne Sharp Sand</span>
                <span className="text-xs sm:text-sm font-bold text-white">₦{bld.sandPricePerTrip.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[11px] text-slate-400">30-Tonne Granite</span>
                <span className="text-xs sm:text-sm font-bold text-white">₦{bld.granitePricePerTrip.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[11px] text-slate-400">42.5R Cement / Bag</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">₦{bld.cementPricePerBag.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[11px] text-slate-400">16mm TMT Rods / Tonne</span>
                <span className="text-xs sm:text-sm font-bold text-cyan-400">₦{bld.ironRodPricePerTonne.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator */}
          <SectorToolsWidget businessCategory="Construction & Building Materials" hideHeader={true} />

          {/* Viral WhatsApp Proposal Forwarder */}
          <ViralQuoteForwarder 
            toolSlug={`construction-estimator/${bld.slug}`} 
            toolTitle={`Building Material Estimate (${bld.area})`}
            category="Construction & Building Materials"
            summaryMetrics={[
              { label: 'Site Location', value: `${bld.area}, ${bld.city}` },
              { label: 'Soil Profile', value: bld.soilType },
              { label: 'Foundation Recommendation', value: bld.raftOrPilingRecommended }
            ]}
          />

          {/* High-Converting WhatsApp Lead Magnet Gate */}
          <WhatsAppLeadMagnetModal toolSlug="construction-estimator" category="Construction & Building Materials" title={`Site Material Estimator (${bld.area})`} />

          {/* 1-Tap Brand Customizer */} 
          <InstantBrandCustomizer 
            toolTitle={`Site Material Estimator (${bld.area})`} 
            category="Construction & Building Materials" 
            defaultSectorName="Lekki Structural Engineering Ltd"
          />
        </main>

        <Footer />

        {/* Zero-Friction 1-Tap Floating WhatsApp Magnet Pill (Mobile) */}
        <StickyMobileConversionBar toolSlug="construction-estimator" category="Construction & Building Materials" />
      </div>
    );
  }

  notFound();
}
