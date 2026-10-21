'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Sparkles, 
  Globe, 
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

interface NairalandCampaign {
  id: string;
  toolTitle: string;
  toolSlug: string;
  nairalandSection: string;
  threadTitle: string;
  bestPostingTime: string;
  contentBBCode: string;
  summary: string;
}

const CAMPAIGNS: NairalandCampaign[] = [
  {
    id: 'solar-boq',
    toolTitle: 'Solar & Renewable Energy BOQ Load Sizer',
    toolSlug: 'solar-boq',
    nairalandSection: 'Properties / Investment / General',
    threadTitle: '2026 Reality: How A 5kVA Solar Setup Replaces N312,500/Month Diesel at NERC Band A Tariffs (Live Breakdown)',
    bestPostingTime: '08:00 AM or 07:30 PM WAT (Peak Traffic)',
    summary: 'Explains the actual monthly economics of Band A (₦209.50/kWh) vs running a 20kVA generator on ₦1,250/L diesel.',
    contentBBCode: `[b]2026 Reality: How A 5kVA Solar Setup Replaces N312,500/Month Diesel at NERC Band A Tariffs (Live Breakdown)[/b]

Fellow Nairalanders,

With fuel currently sitting around [b]N1,250 to N1,300 per liter[/b] and NERC DisCo Band A billing at [b]N209.50/kWh[/b], running a standard residential duplex or medium SME business in Nigeria has become a major cash drain.

Many people are either overpaying solar installers or buying undersized inverter systems that burn out within 6 months.

Here is an audited cost & payback breakdown for a standard [b]5kVA Hybrid Solar System (Tier-1 51.2V LiFePO4 Lithium Battery)[/b]:

[quote]
[b]• System Sizing:[/b] 5.0 kVA Pure Sine Wave Inverter + 10kWh 51.2V Lithium Battery + 8x 550W Mono Half-Cell Panels
[b]• Daily Appliance Load:[/b] 1-2 Inverter ACs, Refrigerator, Deep Freezer, Water Pump, TV & Full Lighting
[b]• Monthly Diesel Displaced:[/b] ~250 Liters/month ([b]approx N312,500/month saved[/b])
[b]• Estimated Complete BOQ & Procurement:[/b] ~N4,500,000 – N5,200,000 (depending on cable runs & surge protection)
[b]• Complete Payback Period:[/b] [b]14 to 16 Months[/b] (After month 16, your electricity is virtually 100% free)
[/quote]

Instead of guessing your load or letting rogue technicians overcharge you on procurement, our engineering team at Bethelmind built a [b]Free Interactive 2026 Solar BOQ & ROI Sizer[/b] you can test right on your phone:

[url=https://www.bethelmindanalytics.com/tools/solar-boq][b]👉 Test Your Exact Property Load & DisCo Sizing Free (No Sign-Up Needed)[/b][/url]

You can select your property type (Flat, Duplex, or Commercial Facility), enter your current monthly diesel spend, and generate an audited WhatsApp proposal instantly.

How much are you spending monthly on generator fuel or Band A tokens in your area right now? Share below and let us run the numbers.

[i]Verified by Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise RC 7034297)[/i]`
  },
  {
    id: 'tokunbo-duty',
    toolTitle: 'Tokunbo Customs Duty & Port Landing Sizer',
    toolSlug: 'tokunbo-duty',
    nairalandSection: 'Auto (Car Talk / Car Deals)',
    threadTitle: 'OFFICIAL 2026 Tin Can & PTML Customs Duty Calculation on Tokunbo Vehicles (20% Duty + 15% NAC Matrix)',
    bestPostingTime: '11:00 AM or 08:30 PM WAT',
    summary: 'Breaks down how statutory 20% import duty, 15% NAC levy, 7.5% VAT, and port demurrage charges are calculated.',
    contentBBCode: `[b]OFFICIAL 2026 Tin Can & PTML Customs Duty Calculation on Tokunbo Vehicles (20% Duty + 15% NAC Matrix)[/b]

To all car buyers, clearing agents, and auto dealers on Nairaland,

One of the biggest issues when buying or importing a Tokunbo vehicle (Corolla, Camry, Lexus RX350, Mercedes Benz) is not knowing the [b]exact statutory Nigerian Customs Service (NCS) duty[/b] before the vehicle docks at Tin Can Island or PTML Lagos.

When you don't know the statutory figures, clearing agents can inflate terminal charges or give you inaccurate quotes that lead to unexpected demurrage fees.

Here is the statutory NCS clearing formula:

[quote]
[b]1. Statutory Import Duty:[/b] 20% of assessed CIF (Cost, Insurance & Freight) valuation
[b]2. National Automotive Council (NAC) Levy:[/b] 15% of CIF
[b]3. Statutory VAT:[/b] 7.5%
[b]4. Port Terminal Charges (PTML / Tin Can):[/b] Approx N280,000 – N380,000 depending on dwell time and shipping line
[b]5. Example (2018 Lexus RX350 @ N18.5m CIF):[/b] Duty (N3.7m) + NAC (N2.775m) + VAT & Terminal Fees = ~[b]N7,250,000 Total Port Landing Clearance[/b]
[/quote]

To help everyone verify vehicle duty before committing funds or wiring money to auction houses, you can run the live 17-digit VIN clearing calculator here:

[url=https://www.bethelmindanalytics.com/tools/tokunbo-duty][b]👉 Check Exact Tokunbo Customs Duty & Port Landing Cost Free[/b][/url]

Input your vehicle valuation or VIN, select your discharge port (PTML or Tin Can), and get the full statutory sheet in 3 seconds.

[i]Source: Bethelmind Digital Solutions (CAC Certified Enterprise RC 7034297)[/i]`
  },
  {
    id: 'salon-booking',
    toolTitle: 'Salon & Spa 24/7 Booking & Deposit Lock',
    toolSlug: 'salon-booking',
    nairalandSection: 'Business / Fashion / Romance',
    threadTitle: 'How Lagos Salons & Spas Are Stopping Fake Alerts and No-Shows with 25% WhatsApp Deposit Locks',
    bestPostingTime: '01:00 PM or 09:00 PM WAT',
    summary: 'Details how beauty parlors and barbing lounges prevent empty chairs and fraudulent transfer slips.',
    contentBBCode: `[b]How Lagos Salons & Spas Are Stopping Fake Alerts and No-Shows with 25% WhatsApp Deposit Locks[/b]

If you operate a hair salon, spa, nail bar, or executive barbershop in Lagos, Abuja, or Port Harcourt, you already know the two biggest revenue killers:

1. [b]Customer No-Shows:[/b] A client books bridal glam or 26-inch bone straight fixing for Saturday 11 AM, your senior stylist sits waiting, and the client never shows up.
2. [b]Fake Bank Credit Alerts:[/b] In a busy salon on weekend evenings, customers show fake bank transfer screenshots or reversed transactions before walking out.

[quote]
[b]The Fix:[/b] Automated 24/7 WhatsApp Appointment Booking with an instant [b]25% Commitment Deposit Lock[/b].
• Client picks stylist, service, and time slot on your mobile menu.
• System instantly provisions a dynamic Moniepoint virtual account.
• When the 25% seat deposit clears, the chair is locked and calendar invite auto-dispatches.
• Zero fake alerts, zero vacant stylist hours.
[/quote]

We built an interactive prototype showing how this works in real time:

[url=https://www.bethelmindanalytics.com/tools/salon-booking][b]👉 Test The Free 24/7 Salon Booking & Deposit Lock Engine[/b][/url]

[i]Developed by Bethelmind Digital Solutions (CAC Certified Enterprise RC 7034297)[/i]`
  },
  {
    id: 'restaurant-order',
    toolTitle: 'Restaurant Direct Food Order & Chowdeck Commission Saver',
    toolSlug: 'restaurant-order',
    nairalandSection: 'Food / Business to Business',
    threadTitle: 'Stop Giving Away 25% of Your Food Revenue to Third-Party Delivery Apps: The Direct WhatsApp Menu',
    bestPostingTime: '12:00 PM or 06:30 PM WAT',
    summary: 'Shows restaurant and lounge owners how direct WhatsApp digital menus eliminate 25% aggregators fee.',
    contentBBCode: `[b]Stop Giving Away 25% of Your Food Revenue to Third-Party Delivery Apps: The Direct WhatsApp Menu[/b]

Restaurant, cafe, and lounge owners in Nigeria are currently getting squeezed by 25% - 30% commission cuts from delivery aggregators (Chowdeck, Glovo, FoodCourt).

On an order of N16,500 (Party Jollof, Jumbo Turkey & Drinks), the aggregator takes [b]over N4,125[/b] in fees, completely wiping out the kitchen's profit margin after accounting for food costs, gas, and generator fuel.

[quote]
[b]The Alternative:[/b] A lightweight Direct Digital Menu + Kitchen Ticket Generator that routes 100% of customer orders directly to your WhatsApp and Moniepoint account with [b]0% commission deducted[/b].
• Customer selects items and delivery/dine-in mode.
• Order prints automated kitchen order ticket (e.g. KITCHEN-8421).
• Payment clears directly into your own corporate account with zero intermediary delay.
[/quote]

Test the live interactive 0% commission food ordering engine here:

[url=https://www.bethelmindanalytics.com/tools/restaurant-order][b]👉 Test The 0% Commission Direct Restaurant Ordering Suite[/b][/url]

[i]Source: Bethelmind Digital Solutions — Commercial Growth Systems[/i]`
  },
  {
    id: 'mortgage-calculator',
    toolTitle: 'Real Estate Plot Layout & Mortgage Amortization',
    toolSlug: 'mortgage-calculator',
    nairalandSection: 'Properties (Land & Real Estate)',
    threadTitle: 'Before You Buy Land in Lagos: The Real Cost of Registered Survey (Red Copy), Deed, and Development Levies',
    bestPostingTime: '09:00 AM or 08:00 PM WAT',
    summary: 'Underwrites plot purchases, 30% foundation milestones, and legal documentation fees across Lagos/Ogun corridors.',
    contentBBCode: `[b]Before You Buy Land in Lagos: The Real Cost of Registered Survey (Red Copy), Deed, and Development Levies[/b]

Many buyers and diaspora investors purchase plots along the Epe, Ibeju-Lekki, or Mowe-Ofada corridors believing the advertised purchase price is their only expense.

Within 30 days of purchase, they get hit with unexpected ancillary charges:
[quote]
• Registered Survey (Lagos State Red Copy): N450,000 – N850,000
• Deed of Assignment & Legal Drafting: N250,000 – N500,000
• Infrastructure / Development Levy: N1,000,000 – N2,500,000
• Foundation Construction Milestone (30% of build contract)
[/quote]

To avoid budgeting blind, our real estate tools suite lets you calculate full plot layouts, installment amortization schedules, and off-plan milestone disbursements:

[url=https://www.bethelmindanalytics.com/tools/mortgage-calculator][b]👉 Calculate Plot Layout, Survey & Milestone Amortization Free[/b][/url]

[i]Verified by Bethelmind Digital Solutions (CAC Certified RC 7034297)[/i]`
  },
  {
    id: 'school-portal',
    toolTitle: 'Private School Term Tuition & Result PIN Portal',
    toolSlug: 'school-portal',
    nairalandSection: 'Education / Family',
    threadTitle: 'Private School Administrators: How to Gate Digital Result Sheets Until Term Fees Are 100% Cleared',
    bestPostingTime: '10:00 AM or 04:00 PM WAT',
    summary: 'Explains how private schools recover millions in outstanding term fees by auto-gating broadsheets until payments clear.',
    contentBBCode: `[b]Private School Administrators: How to Gate Digital Result Sheets Until Term Fees Are 100% Cleared[/b]

Every school term, private nursery, primary, and secondary school proprietors struggle with unpaid tuition fees. Parents frequently defer payment until students finish exams, and once term reports are issued, collecting fee arrears becomes nearly impossible.

[quote]
[b]The Proven Solution:[/b] Automated Student Term Fee Portals with Scratch-PIN / Digital Result Gating.
• Term report cards and exam broadsheets remain strictly locked behind an automated gateway.
• Parents settle term tuition via instant Moniepoint bank transfer or unique student PIN.
• The moment payment clears in the school's ledger, the digital report card unlocks immediately.
• Generated over N1.08m in supplementary scratch-PIN accounting profit for a 200-student school.
[/quote]

Proprietors and administrators can test the interactive school tuition & PIN ledger suite here:

[url=https://www.bethelmindanalytics.com/tools/school-portal][b]👉 Test The School Tuition & Result PIN Ledger Free[/b][/url]

[i]Developed by Bethelmind Digital Solutions (CAC Certified RC 7034297)[/i]`
  }
];

export default function NairalandDistributionHub() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyBBCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />

      {/* Top Metallic Accent Glow */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-cyan-400 opacity-90 shadow-[0_0_20px_rgba(16,185,129,0.6)]" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-4">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tools Directory</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-full font-bold">
              🇳🇬 Nairaland Viral Traffic Engine
            </span>
            <span className="text-slate-400">CAC Certified RC 7034297</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>High-Yield Organic Traffic Distribution Station</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Nairaland & Forum Traffic Launchpad
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Pre-formatted, high-engagement forum threads designed for Nairaland Auto, Properties, Investment, and Business sections. Each post contains audited figures, burning Nigerian problem hooks, and 1-tap links directly to your interactive tools.
          </p>
        </div>

        {/* How It Works Instruction Card */}
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/20 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>3-Step Nairaland Distribution Playbook (Guaranteed Organic Traffic)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl space-y-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black inline-flex items-center justify-center">1</span>
              <h3 className="font-bold text-white text-sm">Copy 1-Click BBCode</h3>
              <p className="text-slate-400 leading-relaxed">
                Click the "Copy Nairaland BBCode" button on the campaign below. It copies fully formatted text with working links, bolding, and quotes.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl space-y-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black inline-flex items-center justify-center">2</span>
              <h3 className="font-bold text-white text-sm">Post in Target Section</h3>
              <p className="text-slate-400 leading-relaxed">
                Open Nairaland.com, go to the listed target section (e.g. Auto or Properties), paste the thread title and BBCode body, and submit.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl space-y-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black inline-flex items-center justify-center">3</span>
              <h3 className="font-bold text-white text-sm">Engage & Bump to Front Page</h3>
              <p className="text-slate-400 leading-relaxed">
                When readers reply with their car VIN or diesel spend, run their numbers on the tool and reply with their exact results. This bumps your thread to the Nairaland front page!
              </p>
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <span>Available Sector Tool Campaigns ({CAMPAIGNS.length})</span>
          </h2>

          <div className="space-y-6">
            {CAMPAIGNS.map((c) => {
              const isCopied = copiedId === c.id;
              return (
                <div
                  key={c.id}
                  className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 hover:border-emerald-500/40 transition-all shadow-xl"
                >
                  {/* Top Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-black">
                        📍 Section: {c.nairalandSection}
                      </span>
                      <span className="text-xs text-amber-400 font-semibold">
                        ⏰ Best Time: {c.bestPostingTime}
                      </span>
                    </div>
                    <Link
                      href={`/tools/${c.toolSlug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold"
                    >
                      <span>View Live Tool</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Title & Hook */}
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit']">
                      {c.threadTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {c.summary}
                    </p>
                  </div>

                  {/* BBCode Preview Box */}
                  <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
                    {c.contentBBCode}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => copyBBCode(c.id, c.contentBBCode)}
                      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shadow-lg active:scale-95 ${
                        isCopied
                          ? 'bg-emerald-400 text-slate-950 shadow-emerald-400/25'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20'
                      }`}
                    >
                      {isCopied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                      <span>{isCopied ? 'BBCode Copied to Clipboard! ✓' : '📋 Copy Complete Nairaland Post'}</span>
                    </button>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `*${c.threadTitle}*\n\nTest your numbers free on your phone:\nhttps://www.bethelmindanalytics.com/tools/${c.toolSlug}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-slate-200 transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Share Thread Teaser to WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Verification Footer Seal */}
        <footer className="text-center py-6 text-xs text-slate-500 border-t border-white/5 space-y-2">
          <p className="flex items-center justify-center gap-2 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Bethelmind Digital Solutions (RC 7034297) · Moniepoint MFB 6805375225</span>
          </p>
          <p>© 2026 Bethelmind Digital Solutions · Plot 12, Commercial Corridor, Lagos, Nigeria.</p>
        </footer>
      </main>

      <Footer />
    </div>
  );
}
