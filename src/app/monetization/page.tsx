import React from 'react';
import Link from 'next/link';
import { ShieldAlert, SunMedium, Globe2, Database, Sparkles, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export const metadata = {
  title: 'B2B Growth & Monetization Engines | Bethelmind Analytics Lagos',
  description: 'Explore the 5 core commercial engines: GMB Profile Lock, Commercial Solar Multi-Router, Expired Domain Reinstatement, Verified Lead Packs, and 48-Hour Turnkey Client Prototypes.',
  openGraph: {
    title: 'Bethelmind Analytics Lagos — 5 B2B Commercial Growth Engines',
    description: 'Autonomous B2B operations, Google Maps security, solar engineering routers, and instant website portals for Nigerian commercial businesses.',
  }
};

const ENGINES = [
  {
    id: 'engine-1',
    badge: '📍 Google Maps & Profile Shield',
    badgeColor: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
    title: 'Google Business Profile (GMB) Security Rescue',
    icon: ShieldAlert,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/10 border-rose-500/30',
    headline: 'Stop Competitor Number Hijacking & Lock Your 5-Star Reputation on Google Maps',
    description: 'We verify primary business ownership on Google, bypass the 3-month NIPOST postcard delay, link your direct WhatsApp line, and lock your listing against unauthorized public edits.',
    price: '₦45,000 One-Time',
    sla: 'Live in 24 Hours',
    features: [
      'Primary Google Ownership Authentication (No postcard wait)',
      'Direct 1-Tap WhatsApp Call/Chat Button on Google Maps',
      'Anti-Hijack Edit Shield (Blocks competitor phone tampering)',
      'Local 3-Pack Google Search Ranking Optimization',
      'High-Resolution Printable Google Review QR Code Card'
    ],
    ctaText: 'View GMB Security Teardown',
    ctaLink: '/gmb/sample-audit'
  },
  {
    id: 'engine-2',
    badge: '☀️ Clean Energy & Commercial Solar',
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    title: 'Commercial Solar & Energy Multi-Router',
    icon: SunMedium,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/30',
    headline: 'Calculate Your Commercial Solar Load & Get 2 Vetted EPC Quotes in 2 Minutes',
    description: 'Built for hospitals, hotels, schools, cold storage, and factories spending ₦1M+/month on NEPA/Diesel. Calculate inverter KVA, battery backup, and receive competitive installer pricing.',
    price: 'Free Instant Audit',
    sla: 'Instant Calculation',
    features: [
      'Precision Inverter & Lithium Battery Backup Sizer',
      'Daily Diesel & Grid Cost Savings Calculator',
      'Automated Bankable PDF Project Proposal Download',
      'Direct Match with 2 Non-Competing Vetted Tier-1 Installers',
      'Guaranteed 10-Year Equipment Warranty Protection'
    ],
    ctaText: 'Launch Solar Sizing Calculator',
    ctaLink: '/tools/solar-quote-pro'
  },
  {
    id: 'engine-3',
    badge: '🏛️ Digital Asset & Authority Escrow',
    badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
    title: 'Expired .com.ng Domain Registry & Custody',
    icon: Globe2,
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border-cyan-500/30',
    headline: 'Sovereign Custody Protection for Expired High-Authority Nigerian Business Domains',
    description: 'We monitor dropped commercial domains, secure their historic Google SEO traffic, and provide 1-click ownership reinstatement transfer for brand owners or portfolio investors.',
    price: '₦150,000 – ₦350,000 Reclaim',
    sla: 'Instant EPP Auth Code',
    features: [
      'Sovereign Escrow Custody Protection',
      'Preservation of Historic Google Backlinks & Organic Search Traffic',
      '1-Click Domain Ownership Reinstatement Transfer',
      'Zero-Latency Cloudflare DNS 301 Forwarding',
      'Full NiRA Accredited Registrar Compliance'
    ],
    ctaText: 'Explore Domain Custody Portal',
    ctaLink: '/domains/sample'
  },
  {
    id: 'engine-4',
    badge: '📦 Verified B2B Intelligence & Corporate Dossiers',
    badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    title: 'Verified Sector B2B Databases & Corporate Due Diligence',
    icon: Database,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10 border-purple-500/30',
    headline: 'Clean Decision-Maker Databases & Bankable Corporate Counterparty Dossiers',
    description: '100% verified phone numbers, carrier telemetry, and director identities across Solar, Real Estate, Clinics, and Importers. Order verified contact packs or commission full OpenPlanter corporate due diligence audits.',
    price: '₦15k–₦35k (Data Pack) or ₦150k (Corporate Dossier)',
    sla: 'Instant Selar Download / 24h Dossier Delivery',
    features: [
      '0% Synthetic Data Guard (Passed Rule #5 verification)',
      'Telecom Carrier & Active WhatsApp Verification via SearchPhone',
      'OpenPlanter Corporate Due Diligence (CAC Status, Director Mapping & Risk Score)',
      'Partitioned by Lagos Commercial Hubs (Lekki, VI, Ikeja, ASPAMDA)',
      'Clean CSV, Excel Spreadsheet & Executive PDF Formats',
      'Instant Automated Paystack & Moniepoint Digital Delivery'
    ],
    ctaText: 'Browse Intelligence Packs & Dossiers',
    ctaLink: '/store'
  },
  {
    id: 'engine-5',
    badge: '🚀 48-Hour Turnkey Digital Deployment & Mobile App',
    badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    title: 'Interactive Client Prototypes & Branded Android Apps',
    icon: Sparkles,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/30',
    headline: 'Experience Your Complete Mobile Operations Portal Live Before Paying ₦1',
    description: 'We pre-build an interactive working prototype for your business with 24/7 AI WhatsApp Closer (<3s reply), dynamic quotation calculators, automated online payment verification, and optional Branded Native Android Mobile App (.apk).',
    price: '₦75k (Web) or ₦125k (Web + Android App) 50% Milestone Deposit',
    sla: '48-Hour Delivery SLA',
    features: [
      '0ms Mobile Interactive Live Preview (/preview/[id])',
      '📱 Branded Native Android Mobile App (.apk) Ready for Google Play & Direct Install',
      '🔔 Customer Lock-Screen Push Notifications via Firebase / OneSignal',
      '24/7 AI Conversational WhatsApp Booking Agent',
      'Automated Bank Transfer & Paystack/Moniepoint Verification',
      'Google Sheets CRM & Instant Mobile Push Alerts',
      '.com.ng Domain Registration & Cloud Staging Included'
    ],
    ctaText: 'Test Working Client Preview',
    ctaLink: '/preview/apex-solar-technologies-lagos'
  }
];

export default function MonetizationHubPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 flex-1 w-full">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            ⚡ Bethelmind B2B Commercial Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            The 5 Core Commercial <span className="text-emerald-400">Growth Engines</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Engineered for Nigerian commercial enterprises, importers, and service leaders in Lagos. 
            Select any engine below to launch instant tools, verify assets, or claim live prototypes.
          </p>
        </div>

        {/* Engine Cards Grid */}
        <div className="space-y-8">
          {ENGINES.map((engine, idx) => {
            const Icon = engine.icon;
            return (
              <div
                key={engine.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
              >
                {/* Left Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${engine.badgeColor}`}>
                      {engine.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Engine #{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${engine.iconBg}`}>
                      <Icon className={`w-6 h-6 ${engine.iconColor}`} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {engine.title}
                    </h2>
                  </div>

                  <p className="text-lg font-semibold text-slate-200">
                    {engine.headline}
                  </p>

                  <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                    {engine.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {engine.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Action Box */}
                <div className="w-full lg:w-72 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between text-center space-y-4 flex-shrink-0">
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Pricing & Terms</div>
                    <div className="text-xl font-black text-white">{engine.price}</div>
                    <div className="text-xs text-emerald-400 font-medium mt-1">⚡ {engine.sla}</div>
                  </div>

                  <Link
                    href={engine.ctaLink}
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950/50"
                  >
                    <span>{engine.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Desk, I would like to inquire about ${engine.title}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Talk to Closer Desk</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-16 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Need a Custom Multi-Engine Integration for Your Business?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Direct settlement to OPay (7034297995) • 48-Hour delivery guarantee on all turnkey deployments.
            </p>
          </div>
          <a
            href="https://wa.me/2348022791227?text=Hello%20Bethelmind%20Executive%20Desk%2C%20I%20want%20to%20deploy%20a%20commercial%20engine%20for%20our%20business."
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 bg-white text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-all flex-shrink-0"
          >
            💬 Connect on WhatsApp (0802 279 1227)
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
