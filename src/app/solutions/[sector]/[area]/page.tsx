import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Download, MessageSquare, Star } from 'lucide-react';
import { ALL_PRODUCTS_DATA } from '@/lib/productsData';

interface PageProps {
  params: Promise<{
    sector: string;
    area: string;
  }>;
}

const SECTORS: Record<string, { title: string; subtitle: string; productId: string; highlight: string }> = {
  'dental': {
    title: 'Dental & Aesthetics Clinics',
    subtitle: 'Automated 24/7 Appointment Booking & MDCN Veneer Pricing Engine',
    productId: 'luxury-health',
    highlight: 'Saves £2,000–£5,000 on medical procedures while eliminating no-shows.'
  },
  'solar': {
    title: 'Solar & Renewable Energy Sizing',
    subtitle: 'Load Sizer & Anti-Fake Lithium Cell Due-Diligence System',
    productId: 'solar-buster',
    highlight: 'Prevents ₦1.8M counterfeit battery purchases and models generator fuel ROI.'
  },
  'legal': {
    title: 'SME SCUML & Startup Legal Vault',
    subtitle: 'EFCC SCUML Certificate Blueprint & Nigerian Contract Templates',
    productId: 'sme-legal',
    highlight: 'Saves ₦150k+ in legal drafting and guarantees corporate bank onboarding.'
  },
  'real-estate': {
    title: 'Real Estate & Shortlet Operations',
    subtitle: 'Caution Deposit & Sublease Protection Operating OS',
    productId: 'shortlet-os',
    highlight: 'Protects furniture and electronic assets while optimizing power tariffs.'
  },
  'land-cadastral': {
    title: 'Lekki-Epe Land Risk & Title Verification',
    subtitle: 'Cadastral Demolition Buffer Map & Survey Beacon Coordinate Audit',
    productId: 'land-dossier',
    highlight: 'Protects ₦15M–₦80M land investments from statutory highway demolitions.'
  }
};

const AREAS: Record<string, string> = {
  'lekki-phase-1': 'Lekki Phase 1, Lagos',
  'victoria-island': 'Victoria Island, Lagos',
  'ikeja-gra': 'Ikeja GRA, Lagos',
  'ikoyi': 'Ikoyi, Lagos',
  'surulere': 'Surulere, Lagos',
  'yaba': 'Yaba Tech Corridor, Lagos',
  'ajah': 'Ajah / Sangotedo, Lagos',
  'magodo': 'Magodo Phase 2, Lagos'
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sector, area } = await params;
  const sectorData = SECTORS[sector];
  const areaName = AREAS[area] || area.replace(/-/g, ' ');

  if (!sectorData) {
    return { title: 'Bethelmind Analytics Solutions' };
  }

  return {
    title: `${sectorData.title} in ${areaName} (2026 Verified Blueprint)`,
    description: `Official Bethelmind Due-Diligence & Automated Growth Blueprint for ${sectorData.title} in ${areaName}. Instant digital asset access and 1-tap WhatsApp Closer.`,
  };
}

export default async function ProgrammaticSolutionPage({ params }: PageProps) {
  const { sector, area } = await params;
  const sectorData = SECTORS[sector];
  const areaName = AREAS[area] || area.replace(/-/g, ' ');

  if (!sectorData) {
    notFound();
  }

  const product = ALL_PRODUCTS_DATA.find(p => p.id === sectorData.productId) || ALL_PRODUCTS_DATA[0];
  const selarUrl = `https://selar.com/showlove/bethelmind?currency=NGN&item=${product.id}&amount=${product.prices.NGN}`;
  const prefilledWaMsg = encodeURIComponent(`Hello Bethelmind Desk, I saw your ${sectorData.title} solution page for ${areaName} and would like to claim my copy / speak with a specialist.`);
  const whatsappUrl = `https://wa.me/2348022791227?text=${prefilledWaMsg}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950/60 border-b border-blue-800/30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-blue-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Institutional Due-Diligence Protocol</span>
            <span className="hidden md:inline text-slate-400">• Verified for {areaName} (2026)</span>
          </div>
          <Link href="/store" className="text-blue-400 hover:text-blue-300 underline font-medium">
            Explore All 16 Asset Packs &rarr;
          </Link>
        </div>
      </div>

      {/* Main Content Hero */}
      <main className="max-w-4xl mx-auto px-4 pt-12 sm:pt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5" />
          <span>Geo-Verified Commercial Architecture: {areaName}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          {sectorData.title} <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            {areaName} Operations
          </span>
        </h1>

        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          {sectorData.subtitle}. {product.shortDesc}
        </p>

        {/* Value Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-10 shadow-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Financial Impact & ROI</h3>
              <p className="text-slate-300 text-sm sm:text-base">{sectorData.highlight}</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Included Deliverables:</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {product.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href={selarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Download on Selar (₦{product.prices.NGN.toLocaleString()})</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-base border border-slate-700 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat with Closer Desk (0802 279 1227)</span>
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="text-center text-xs text-slate-500">
          <p>Dispatched & Certified by Bethelmind Analytics Lagos Due-Diligence Desk.</p>
        </div>
      </main>
    </div>
  );
}
