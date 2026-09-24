import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  ShieldCheck, Star, MapPin, Phone, MessageSquare, 
  Zap, Award, CheckCircle2, ChevronRight, ArrowRight,
  Sun, HeartPulse, Car, Building2, Sparkles, ExternalLink 
} from 'lucide-react';

interface Props {
  params: Promise<{
    sector: string;
    area: string;
  }>;
}

function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector, area } = await params;
  const sectorTitle = formatSlug(sector);
  const areaTitle = formatSlug(area);

  return {
    title: `Top ${sectorTitle} Companies in ${areaTitle}, Lagos | Verified 2026 Directory`,
    description: `Discover verified ${sectorTitle} providers in ${areaTitle}, Nigeria. Compare verified ratings, pricing calculators, 24/7 WhatsApp quoting, and customer reviews.`,
    keywords: [
      `${sectorTitle} in ${areaTitle}`,
      `best ${sectorTitle} ${areaTitle} Lagos`,
      `24/7 AI ${sectorTitle} quotes ${areaTitle}`,
      `verified ${sectorTitle} contractors Nigeria`
    ]
  };
}

export default async function ProgrammaticSectorAreaDirectoryPage({ params }: Props) {
  const { sector, area } = await params;
  const sectorTitle = formatSlug(sector);
  const areaTitle = formatSlug(area);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `Top ${sectorTitle} Businesses in ${areaTitle}`,
    'description': `Verified directory of top rated ${sectorTitle} companies operating in ${areaTitle}, Nigeria.`,
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': `Premier ${sectorTitle} Hub ${areaTitle}`,
        'url': `https://www.bethelmindanalytics.com/directory/${sector}/${area}`
      }
    ]
  };

  const sampleBusinesses = [
    {
      name: `Apex ${sectorTitle} Solutions ${areaTitle}`,
      slug: `apex-${sector}-${area}`,
      rating: 4.9,
      reviews: 48,
      address: `Commercial Avenue, ${areaTitle}, Lagos`,
      phone: '0802 279 1227',
      isVerified: true
    },
    {
      name: `Grand ${sectorTitle} Hub ${areaTitle}`,
      slug: `grand-${sector}-${area}`,
      rating: 4.8,
      reviews: 36,
      address: `Plot 14 Corridor, ${areaTitle}, Lagos`,
      phone: '0802 279 1227',
      isVerified: true
    },
    {
      name: `Direct ${sectorTitle} Contractors ${areaTitle}`,
      slug: `direct-${sector}-${area}`,
      rating: 4.7,
      reviews: 29,
      address: `Central Plaza, ${areaTitle}, Lagos`,
      phone: '0802 279 1227',
      isVerified: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-sky-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/directory" className="hover:text-sky-400 transition-colors">Directory</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-sky-400">{sectorTitle} in {areaTitle}</span>
        </nav>

        {/* Hero Header */}
        <div className="border-b border-slate-800 pb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026 Verified Commercial Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Top <span className="text-sky-400">{sectorTitle}</span> in {areaTitle}, Lagos
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Compare the highest rated, verified {sectorTitle.toLowerCase()} businesses serving {areaTitle}. Featuring 24/7 instant WhatsApp quoting, transparent pricing calculators, and fast direct support.
          </p>
        </div>

        {/* Claim Your Business Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-sky-900/40 via-blue-900/30 to-slate-900 border border-sky-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl backdrop-blur-xl">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>Are You an SME Owner in {areaTitle}?</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Claim Your 24/7 AI WhatsApp Sales & Quoting Portal
            </h2>
            <p className="text-sm text-slate-300">
              Upgrade your business listing with an automated 24/7 AI quoting engine and direct Paystack/Moniepoint verification. <strong>₦0 Upfront Preview.</strong>
            </p>
          </div>
          <a
            href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Analytics! I operate a ${sectorTitle} business in ${areaTitle} and want to claim my 24/7 AI WhatsApp Sales Portal.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
          >
            <span>Claim Listing with ₦0 Upfront</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Business Listings Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Verified Listings</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {sampleBusinesses.length} Verified
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleBusinesses.map((biz, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">{sectorTitle}</span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{biz.rating} ({biz.reviews})</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white">{biz.name}</h4>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{biz.address}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={`/preview/${biz.slug}`}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Test Drive Live Prototype</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <a
                    href="https://wa.me/2348022791227"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
                    title="Direct WhatsApp Consultation"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation Back to Master Hub */}
        <div className="text-center pt-8 border-t border-slate-800/80">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <span>Explore All 50+ Nigerian Commercial Sectors & Districts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
