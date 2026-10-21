'use client';

import React, { useState, useEffect } from 'react';
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
  Zap,
  Bot,
  Play,
  RotateCw,
  Key,
  CheckCircle2,
  AlertCircle
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
  const [botStatus, setBotStatus] = useState<any>(null);
  const [isPosting, setIsPosting] = useState<string | null>(null);
  const [isBumping, setIsBumping] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionModalTab, setSessionModalTab] = useState<'browser' | 'credentials' | 'cookie'>('browser');
  const [sessionInput, setSessionInput] = useState('');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Fetch bot status on mount
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/nairaland');
      const data = await res.json();
      if (data.success) {
        setBotStatus(data);
      }
    } catch (err) {
      console.warn('Could not load Nairaland status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const copyBBCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // 1-Click Launch Browser on PC
  const handleLaunchBrowser = async () => {
    setIsAuthenticating(true);
    setFeedbackMessage({ text: 'Opening visible browser on your PC desktop... Please check your screen!', type: 'info' });
    try {
      const res = await fetch('/api/nairaland', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'launch_browser' }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ text: data.message || 'Browser opened! Enter credentials and log in.', type: 'success' });
        // Poll status every 4 seconds for up to 2 minutes
        const interval = setInterval(async () => {
          const sRes = await fetch('/api/nairaland');
          const sData = await sRes.json();
          if (sData.authenticated) {
            setBotStatus(sData);
            setFeedbackMessage({ text: `✓ Successfully authenticated as ${sData.username}!`, type: 'success' });
            setShowSessionModal(false);
            clearInterval(interval);
          }
        }, 4000);
        setTimeout(() => clearInterval(interval), 120000);
      } else {
        setFeedbackMessage({ text: data.error || 'Failed to launch browser.', type: 'error' });
      }
    } catch (err: any) {
      setFeedbackMessage({ text: err.message, type: 'error' });
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Direct Credential Login
  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser.trim() || !loginPass.trim()) return;
    setIsAuthenticating(true);
    setFeedbackMessage({ text: `Authenticating ${loginUser} with stealth Playwright engine...`, type: 'info' });
    try {
      const res = await fetch('/api/nairaland', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login_with_credentials', username: loginUser.trim(), password: loginPass }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ text: data.message || 'Authentication in progress...', type: 'info' });
        // Poll for completion
        let tries = 0;
        const interval = setInterval(async () => {
          tries++;
          const sRes = await fetch('/api/nairaland');
          const sData = await sRes.json();
          if (sData.authenticated) {
            setBotStatus(sData);
            setFeedbackMessage({ text: `✓ Authenticated as ${sData.username}! Bot is ready.`, type: 'success' });
            setShowSessionModal(false);
            setLoginPass('');
            clearInterval(interval);
          } else if (tries > 12) {
            clearInterval(interval);
            setFeedbackMessage({ text: 'Authentication is taking longer than expected. Please verify your password.', type: 'error' });
          }
        }, 3000);
      } else {
        setFeedbackMessage({ text: data.error || 'Login attempt failed.', type: 'error' });
      }
    } catch (err: any) {
      setFeedbackMessage({ text: err.message, type: 'error' });
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Disconnect / Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/nairaland', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      setFeedbackMessage({ text: 'Nairaland session disconnected.', type: 'info' });
      fetchStatus();
    } catch (err: any) {
      setFeedbackMessage({ text: err.message, type: 'error' });
    }
  };

  // 1-Click Autonomous Post Handler
  const handleAutonomousPost = async (campaignId: string) => {
    setIsPosting(campaignId);
    setFeedbackMessage({ text: `Autonomous Playwright worker dispatched for ${campaignId}...`, type: 'info' });

    try {
      const res = await fetch('/api/nairaland', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'post', campaignId }),
      });
      const data = await res.json();

      if (data.success) {
        setFeedbackMessage({ text: data.message || 'Topic posted successfully!', type: 'success' });
        setTimeout(fetchStatus, 3000);
      } else {
        setFeedbackMessage({ text: data.error || 'Failed to dispatch post.', type: 'error' });
      }
    } catch (err: any) {
      setFeedbackMessage({ text: err.message || 'Network error.', type: 'error' });
    } finally {
      setIsPosting(null);
      setTimeout(() => setFeedbackMessage(null), 6000);
    }
  };

  // Autonomous Bump Handler
  const handleAutonomousBump = async () => {
    setIsBumping(true);
    setFeedbackMessage({ text: 'Autonomous Bumper triggered. Checking all active threads...', type: 'info' });

    try {
      const res = await fetch('/api/nairaland', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bump' }),
      });
      const data = await res.json();

      if (data.success) {
        setFeedbackMessage({ text: data.message || 'Threads bumped successfully!', type: 'success' });
        setTimeout(fetchStatus, 3000);
      } else {
        setFeedbackMessage({ text: data.error || 'Failed to bump threads.', type: 'error' });
      }
    } catch (err: any) {
      setFeedbackMessage({ text: err.message || 'Network error.', type: 'error' });
    } finally {
      setIsBumping(false);
      setTimeout(() => setFeedbackMessage(null), 6000);
    }
  };

  // Save Session Cookies
  const handleSaveSession = async () => {
    if (!sessionInput.trim()) return;
    try {
      const res = await fetch('/api/nairaland', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_session', sessionData: sessionInput }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ text: 'Nairaland session cookies saved!', type: 'success' });
        setShowSessionModal(false);
        setSessionInput('');
        fetchStatus();
      } else {
        setFeedbackMessage({ text: data.error || 'Failed to save session.', type: 'error' });
      }
    } catch (err: any) {
      setFeedbackMessage({ text: err.message, type: 'error' });
    }
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
              🇳🇬 Nairaland Fully Automated
            </span>
            <span className="text-slate-400">CAC Certified RC 7034297</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Autonomous Forum Growth & Front-Page Bumper Suite</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Nairaland Autonomous Traffic Engine
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Fully automated Playwright bot that bypasses Cloudflare, posts campaigns to target Nairaland boards, tracks incoming comments, and automatically posts expert calculation bumps to push threads to the Nairaland front page.
          </p>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMessage && (
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold transition-all shadow-xl ${
            feedbackMessage.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300' 
              : feedbackMessage.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-300'
              : 'bg-cyan-950/90 border-cyan-500/50 text-cyan-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedbackMessage.text}</span>
            </div>
            <button onClick={() => setFeedbackMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Autonomous Bot Control Deck */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${botStatus?.authenticated ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <h2 className="text-lg font-black text-white">
                  Bot Engine Status: {botStatus?.authenticated ? `Active (${botStatus?.username || 'Member'})` : 'Authentication Required'}
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                {botStatus?.authenticated 
                  ? `Authenticated session active. Ready to post and bump automatically on Nairaland.` 
                  : 'Connect your Nairaland account once to enable 1-click autonomous publishing.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {botStatus?.authenticated ? (
                <>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-300 transition-all active:scale-95"
                  >
                    <span>Disconnect</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSessionModal(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs font-bold text-slate-200 transition-all active:scale-95"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Change Account</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSessionModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Connect Nairaland Account</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleAutonomousBump}
                disabled={isBumping || !botStatus?.authenticated}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isBumping ? 'animate-spin' : ''}`} />
                <span>{isBumping ? 'Bumping Threads...' : '🔄 Run Auto-Bumper Now'}</span>
              </button>
            </div>
          </div>

          {/* Bot Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <span className="text-xs text-slate-400 block mb-1">Active Threads</span>
              <span className="text-2xl font-black text-white">{botStatus?.threadsCount || 0}</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <span className="text-xs text-slate-400 block mb-1">Total Auto-Bumps</span>
              <span className="text-2xl font-black text-emerald-400">{botStatus?.stats?.totalBumps || 0}</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <span className="text-xs text-slate-400 block mb-1">Target Boards</span>
              <span className="text-2xl font-black text-amber-400">5 Boards</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <span className="text-xs text-slate-400 block mb-1">Cloudflare Guard</span>
              <span className="text-2xl font-black text-cyan-400">Stealth v2</span>
            </div>
          </div>
        </div>

        {/* Modal for Connecting Nairaland Session */}
        {showSessionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative text-slate-100">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-black text-white">Connect Nairaland Account</h3>
                </div>
                <button onClick={() => setShowSessionModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setSessionModalTab('browser')}
                  className={`py-2 px-2 rounded-lg font-bold transition-all text-center ${
                    sessionModalTab === 'browser'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🖥️ PC Browser
                </button>
                <button
                  type="button"
                  onClick={() => setSessionModalTab('credentials')}
                  className={`py-2 px-2 rounded-lg font-bold transition-all text-center ${
                    sessionModalTab === 'credentials'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔐 Direct Login
                </button>
                <button
                  type="button"
                  onClick={() => setSessionModalTab('cookie')}
                  className={`py-2 px-2 rounded-lg font-bold transition-all text-center ${
                    sessionModalTab === 'cookie'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📋 Cookie String
                </button>
              </div>

              {/* Tab 1: Interactive Browser */}
              {sessionModalTab === 'browser' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <strong className="text-white font-bold">1-Click Visible Desktop Login</strong>
                    </div>
                    <p className="text-slate-300 text-[12px] leading-relaxed">
                      Launches a visible Chromium window on your PC screen. Log in normally — the bot detects your member session and saves it permanently!
                    </p>
                    <button
                      type="button"
                      onClick={handleLaunchBrowser}
                      disabled={isAuthenticating}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isAuthenticating ? 'Launching Browser Window...' : 'Open Nairaland Browser on PC Screen'}</span>
                    </button>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-1.5">
                    <span className="text-slate-400 text-[11px] block font-bold">Or run directly from your terminal:</span>
                    <code className="block p-2.5 bg-slate-950 rounded-lg text-amber-300 font-mono text-[11px] select-all border border-white/5">
                      node scripts/nairaland_autonomous_engine.js --interactive-login
                    </code>
                  </div>
                </div>
              )}

              {/* Tab 2: Direct Credentials */}
              {sessionModalTab === 'credentials' && (
                <form onSubmit={handleCredentialLogin} className="space-y-3 text-xs">
                  <p className="text-slate-400 text-[11px]">
                    Enter your Nairaland username & password. Stealth Playwright signs in in the background and saves session cookies directly.
                  </p>
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Nairaland Username</label>
                    <input
                      type="text"
                      required
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      placeholder="e.g. bethelmindtech"
                      className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Nairaland Password</label>
                    <input
                      type="password"
                      required
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAuthenticating || !loginUser || !loginPass}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{isAuthenticating ? 'Authenticating...' : 'Sign In & Save Session'}</span>
                  </button>
                </form>
              )}

              {/* Tab 3: Session Cookie String */}
              {sessionModalTab === 'cookie' && (
                <div className="space-y-3 text-xs">
                  <p className="text-slate-400 text-[11px]">
                    If you have your Nairaland `session` cookie or full JSON from browser developer tools, paste it here:
                  </p>
                  <textarea
                    rows={4}
                    value={sessionInput}
                    onChange={(e) => setSessionInput(e.target.value)}
                    placeholder='session=abc12345... or full JSON array'
                    className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveSession}
                    disabled={!sessionInput.trim()}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md active:scale-95"
                  >
                    Save Session Token →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Campaigns Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <span>Autonomous Campaigns Catalog ({CAMPAIGNS.length})</span>
          </h2>

          <div className="space-y-6">
            {CAMPAIGNS.map((c) => {
              const isCopied = copiedId === c.id;
              const isCurrentlyPosting = isPosting === c.id;

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
                        ⏰ Peak Time: {c.bestPostingTime}
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
                  <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-40 overflow-y-auto whitespace-pre-wrap select-all">
                    {c.contentBBCode}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* 1. 1-Click Autonomous Post Button */}
                      <button
                        type="button"
                        onClick={() => handleAutonomousPost(c.id)}
                        disabled={isCurrentlyPosting}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                      >
                        <Play className={`w-3.5 h-3.5 fill-current ${isCurrentlyPosting ? 'animate-pulse' : ''}`} />
                        <span>{isCurrentlyPosting ? 'Posting via Playwright...' : '🚀 1-Click Auto Post'}</span>
                      </button>

                      {/* 2. Manual BBCode Copy */}
                      <button
                        type="button"
                        onClick={() => copyBBCode(c.id, c.contentBBCode)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all active:scale-95"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied! ✓' : 'Copy BBCode'}</span>
                      </button>
                    </div>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `*${c.threadTitle}*\n\nTest your numbers free on your phone:\nhttps://www.bethelmindanalytics.com/tools/${c.toolSlug}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-slate-200 transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>WhatsApp Teaser</span>
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
