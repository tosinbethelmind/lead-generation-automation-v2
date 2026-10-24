'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Users, 
  Sparkles, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Car,
  Zap,
  GraduationCap
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

interface CampaignCard {
  id: string;
  platform: string;
  targetGroup: string;
  audienceSize: string;
  icon: any;
  topic: string;
  trackedUrl: string;
  groupSearchUrl: string;
  body: string;
}

const CAMPAIGNS: CampaignCard[] = [
  {
    id: 'solar',
    platform: 'Facebook Trade Groups',
    targetGroup: 'Solar Energy & Inverter Installers Nigeria',
    audienceSize: '140,000+ Members',
    icon: Zap,
    topic: '2026 Component BOQ Pricing: Stop Roadside Battery Undersizing',
    trackedUrl: 'https://www.bethelmindanalytics.com/tools/solar-boq?utm_source=fb_solar_trade&utm_medium=organic',
    groupSearchUrl: 'https://www.facebook.com/search/groups/?q=solar%20installers%20nigeria',
    body: 
`[2026 Solar Installers Reality Check] Why clients think 5kVA installations are "too expensive" and how to prove the math on paper before you climb the roof:

Fellow Installers & EPC Engineers,

With NERC Band A tariffs at N209.50/kWh and diesel at N1,300/L, our clients are desperate for solar. But the moment you submit an N8M quote for a 5kVA setup, they accuse you of overcharging because roadside technicians told them "N2.5M is enough".

Here is the exact component breakdown for a genuine Tier-1 5kVA Hybrid Setup (10kWh LiFePO4 Battery + 8x 550W Mono Half-Cell Panels):

1. Tier-1 5.0kVA Pure Sine Inverter (Growatt/Deye/Must): ~N850,000 - N1,150,000
2. 51.2V 200Ah (10.24kWh) Wall-Mount LiFePO4 Battery (CATL/EVE cells): ~N2,450,000 - N2,850,000
3. 8x 550W Tier-1 Monocrystalline Half-Cell Panels: ~N920,000 (at N115k/panel)
4. Heavy DC Cable Runs, 63A DC MCB, Surge Arrester & Rail Racks: ~N350,000
TOTAL AUDITED PROCUREMENT: ~N4,570,000 - N5,270,000 (excluding your installation markup).

Anything quoted at N2.5M is either using degraded second-life cells, Gel batteries that die in 8 months, or undersized fake panels that fail during Harmattan.

You can run your client's exact appliance load and generate a professional WhatsApp proposal free on your phone:
👉 https://www.bethelmindanalytics.com/tools/solar-boq?utm_source=fb_solar_trade

📥 FREE ON WHATSAPP: Want the confidential 2026 Alaba & Trade Fair Direct Importer Directory with phone numbers of verified CATL cell & Growatt distributors? Message our desk directly: https://wa.me/2348022791227?text=Please%20send%20me%20the%202026%20Alaba%20Solar%20Wholesale%20Directory`
  },
  {
    id: 'autos',
    platform: 'Facebook Trade Groups',
    targetGroup: 'Lagos Car Dealers & Auto Auction Importers',
    audienceSize: '210,000+ Members',
    icon: Car,
    topic: '2026 Tokunbo Customs Duty Sheet: 2007-2016 Camry & RX350 Surcharges',
    trackedUrl: 'https://www.bethelmindanalytics.com/tools/tokunbo-duty?utm_source=fb_car_dealers&utm_medium=organic',
    groupSearchUrl: 'https://www.facebook.com/search/groups/?q=lagos%20car%20dealers',
    body: 
`[Tin Can & PTML Clearing Update 2026] Don't wire money for Copart or Manheim cars until you confirm statutory duty vs terminal surcharges:

Colleagues in the auto trade,

Too many importers are having their capital trapped at the port because clearing agents gave estimated quotes without accounting for the 15% NAC levy and terminal demurrage.

Here is the audited breakdown for the most imported models right now:

• 2007-2010 Toyota Camry Muscle (PTML Grimaldi):
  - Statutory 20% Duty: ~N928,000 - N1,189,000
  - 15% NAC Levy: ~N696,000 - N891,750
  - 7.5% VAT: ~N348,000 - N445,875
  - Terminal & Shipping Surcharge: ~N420,000
  - Total Realistic Clearing: ~N2.4M - N2.95M

• 2010-2013 Lexus RX350 AWD (Tin Can Island):
  - Statutory 20% Duty: ~N1,798,000 - N2,465,000
  - 15% NAC Levy: ~N1,348,500 - N1,848,750
  - 7.5% VAT: ~N674,250 - N924,375
  - Terminal Demurrage & Handling: ~N550,000 - N580,000
  - Total Realistic Clearing: ~N4.37M - N5.82M

Verify your 17-digit VIN duty and terminal cost free before bidding:
👉 https://www.bethelmindanalytics.com/tools/tokunbo-duty?utm_source=fb_car_dealers

📥 FREE ON WHATSAPP: Want the NCS 2026 Single-Sheet Valuation Matrix & FOU Road Interception Clearance Checklist to verify your clearing slip? Message our desk directly: https://wa.me/2348022791227?text=Please%20send%20me%20the%20NCS%202026%20Customs%20Valuation%20Sheet`
  },
  {
    id: 'building',
    platform: 'Facebook Trade Groups',
    targetGroup: 'Nigeria Builders, Civil Engineers & Quantity Surveyors',
    audienceSize: '180,000+ Members',
    icon: Building2,
    topic: '2026 Lekki & Ibeju Soil Reality: Piling vs Raft Foundations',
    trackedUrl: 'https://www.bethelmindanalytics.com/tools/construction-estimator/ibeju-lekki?utm_source=fb_builders&utm_medium=organic',
    groupSearchUrl: 'https://www.facebook.com/search/groups/?q=nigeria%20builders%20engineers',
    body: 
`[Site Engineering Advisory 2026] The real danger of using strip foundations in Lekki Phase 1 vs Ibeju-Lekki sandy corridors:

Distinguished Site Engineers & Project Managers,

Before casting any slab in the Lekki-Epe axis, verify your soil strata. Lekki Phase 1 and Sangotedo sit on swampy marine clay where water table is less than 1.5m below ground level. Attempting a simple strip foundation results in wall shear cracks within 24 months.

Current Lekki Building Material Procurement Sheet:
• 20-tonne tipper sharp sand (Lekki): ~N120,000 vs Ibeju-Lekki: ~N85,000
• 30-tonne granite (3/4"): ~N260,000 - N280,000
• Dangote/BUA 42.5R Cement: ~N9,600 - N9,800/bag
• 16mm High-Yield TMT Iron Rods: ~N1,250,000/tonne

Run your site Bill of Quantities (BOQ) free on your phone:
👉 https://www.bethelmindanalytics.com/tools/construction-estimator?utm_source=fb_builders

📥 FREE ON WHATSAPP: Want the Lekki-Epe Soil Piling Engineering Guide & Direct Ogun Quarry Tipper Driver Contacts? Message our desk directly: https://wa.me/2348022791227?text=Please%20send%20me%20the%20Lekki%20Soil%20Piling%20Guide%20and%20Quarry%20Contacts`
  },
  {
    id: 'schools',
    platform: 'LinkedIn & Associations',
    targetGroup: 'Association of Private School Owners Nigeria (APSON)',
    audienceSize: '95,000+ Members',
    icon: GraduationCap,
    topic: 'Eliminating Unpaid Third-Term School Fees: Automated Result Gating',
    trackedUrl: 'https://www.bethelmindanalytics.com/tools/school-tuition?utm_source=linkedin_schools&utm_medium=organic',
    groupSearchUrl: 'https://www.linkedin.com/search/results/groups/?keywords=private%20school%20owners%20nigeria',
    body: 
`To Private School Proprietors and Administrators in Nigeria:

Why do schools struggle with unpaid term fees every holiday?
Because parents know that once the hardcopy report card is handed to the child, the school loses its financial leverage.

How top Lagos and Abuja private schools solved this:
1. Student digital report sheets are locked behind an encrypted parent portal.
2. Parents enter the student's admission number on their phone.
3. If outstanding balance is N0.00, the official stamped PDF result unlocks instantly.
4. If fees are pending, the portal presents instant Paystack/Moniepoint bank transfer with 10-second automatic ledger reconciliation.

Result: 94% fee recovery before vacation day.

Test the automated school fee and result gating portal free:
👉 https://www.bethelmindanalytics.com/tools/school-tuition?utm_source=linkedin_schools

📥 FREE ON WHATSAPP: Want the full Automated Result Gating Technical Blueprint and Parent WhatsApp Reminder Scripts? Message our desk directly: https://wa.me/2348022791227?text=Please%20send%20me%20the%20Automated%20Result%20Gating%20Blueprint`
  }
];

export default function SyndicationHubPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter']">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/tools" className="hover:text-cyan-400 transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-cyan-300 font-semibold">100x Syndication Command Hub</span>
        </div>

        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 p-6 sm:p-10 space-y-4 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-xs font-bold">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>100x Organic Growth & Trade Group Distribution</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bethelmind Digital Solutions (RC 7034297)</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight">
            Multi-Platform B2B Trade Group Syndication Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            One-tap dispatch center for high-intent Nigerian trade communities (Facebook Groups, LinkedIn, and Associations totaling over <strong>625,000+ Nigerian SME decision-makers</strong>). Copy the pre-crafted authority guides and publish directly to drive qualified traffic into our interactive quoting funnels.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="block text-[11px] text-slate-400">Total Group Reach</span>
              <span className="text-sm font-bold text-white">625,000+ Members</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="block text-[11px] text-slate-400">Target Sectors</span>
              <span className="text-sm font-bold text-cyan-300">Solar, Auto, Civil, Education</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="block text-[11px] text-slate-400">Attribution Links</span>
              <span className="text-sm font-bold text-emerald-400">100% Tracked UTMs</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="block text-[11px] text-slate-400">Lead Destination</span>
              <span className="text-sm font-bold text-amber-300">0802 279 1227 WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CAMPAIGNS.map((c) => {
            const Icon = c.icon;
            const isCopied = copiedId === c.id;

            return (
              <div 
                key={c.id} 
                className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 sm:p-6 space-y-4 hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Platform & Group Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                          {c.platform}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit']">
                          {c.targetGroup}
                        </h3>
                      </div>
                    </div>

                    <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {c.audienceSize}
                    </span>
                  </div>

                  {/* Topic */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                    <strong className="text-cyan-300">Subject:</strong> {c.topic}
                  </div>

                  {/* Content Preview */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Discussion Guide Preview:
                    </span>
                    <pre className="w-full bg-slate-950/90 border border-white/10 rounded-xl p-3 text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                      {c.body}
                    </pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleCopy(c.id, c.body)}
                    className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Guide'}</span>
                  </button>

                  <a
                    href={c.groupSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <span>Open Group</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-bold text-white font-['Outfit']">
              Want Custom Discussion Campaigns for Other Sectors?
            </h4>
            <p className="text-xs text-slate-300">
              Our automated engine can generate tailored guides for Supermarkets, Real Estate Escrow, and Hospital Booking.
            </p>
          </div>
          <Link
            href="/tools"
            className="shrink-0 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
          >
            <span>Explore All 10 Sector Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
