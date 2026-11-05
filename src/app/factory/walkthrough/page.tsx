'use client';

/**
 * @file src/app/factory/walkthrough/page.tsx
 * 
 * 💧 MR. OBI'S NOVICE VIDEO WALKTHROUGH & INTERACTIVE TRAINING CENTER
 * Step-by-Step Audio-Guided Guide for Nigerian Factory Owners & Staff
 * 
 * Features:
 * - Embedded Video Player with Nigerian English Voiceover Narration
 * - 7 Novice Step-by-Step Visual Chapters with "Try It Live" Buttons
 * - Synchronized Audio Voiceover Player with Play/Pause
 * - Interactive Mock Simulator Integration
 * - PWA "Add to Home Screen" Visual Installation Guide
 * - Downloadable / Printable Operating Manual
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Hotline: 0802 279 1227 (wa.me/2348022791227)
 */

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Droplets,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Users,
  Lock,
  Truck,
  Fuel,
  DollarSign,
  ShieldCheck,
  MessageCircle,
  Phone,
  ArrowRight,
  Sparkles,
  Printer,
  ChevronRight,
  Package,
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';

interface Chapter {
  id: number;
  time: string;
  title: string;
  role: string;
  badge: string;
  badgeBg: string;
  summary: string;
  noviceExplanation: string;
  liveLink: string;
  actionText: string;
  keyRule: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    time: '00:00 - 00:25',
    title: 'Introduction: Why Dual-Line Operations Run on Mobile Phones',
    role: 'Mr. Obi (Owner)',
    badge: '👑 Executive Overview',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary: 'Managing both Sachet Water (thin margin, high volume) and Bottled Water / Jars (high margin, high inventory risk) without computers.',
    noviceExplanation: 'Water factories in Nigeria run two distinct operations: the high-speed Sachet Line (bags of 20) and the Bottled Water Line (50cl, 75cl, and 19L dispenser jars). As the owner, you do not need expensive office computers. Your smartphone connects directly to both lines, tracking daily gross revenue (₦1,971,000) and net cash profit (₦524,200) even when NEPA drops or data fluctuates.',
    liveLink: '/factory/owner',
    actionText: 'View Owner Dual-Line Screen',
    keyRule: 'Rule: The factory owner should know their exact cash profit from both sachets and bottles before 8:00 PM every evening.'
  },
  {
    id: 2,
    time: '00:25 - 00:55',
    title: 'Staff Login Without Passwords (Zero Learning Curve)',
    role: 'All Factory Staff',
    badge: '👥 No Password Login',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    summary: 'Four large picture cards with 4-digit PINs. No email addresses or complicated passwords.',
    noviceExplanation: 'Nigerian factory workers forget passwords within hours. On this system, nobody types an email. Staff see four large picture cards: Mr. Obi, Kenneth the supervisor, Blessing the cashier, and Musa the driver. Kenneth just taps his picture, types 1-1-1-1, and immediately switches between the Sachet Line and Bottled Line tabs.',
    liveLink: '/factory/login',
    actionText: 'Try Staff Login Screen',
    keyRule: 'Rule: Never give factory workers complex email logins. Use simple 4-digit PINs.'
  },
  {
    id: 3,
    time: '00:55 - 01:30',
    title: 'Dual-Line Production Console (+1 Roll Used & Bottle Preforms)',
    role: 'Kenneth (Supervisor)',
    badge: '📋 Sachet + Bottling Console',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    summary: 'Tap "+1 Roll Used" for sachets (300 bags) or tap "+10 Packs 75cl", "+10 Packs 50cl", "+5 Jars Refilled".',
    noviceExplanation: 'For sachets, Kenneth taps "+1 Roll Used" whenever nylon film finishes (300 bags counted). For the bottling line, he logs PET preforms issued (e.g. 3,000 preforms) and blow-molding rejects (e.g. 24 defective bottles). The system ensures machine operators do not sell unrecorded packs out the back door.',
    liveLink: '/factory/login',
    actionText: 'Test Production Buttons',
    keyRule: 'Rule: 1kg of sachet nylon must yield 16 bags, and blow-molding reject rate must remain below 1.2%.'
  },
  {
    id: 4,
    time: '01:30 - 02:05',
    title: 'Gate POS: Multi-Product Sales & Fake Alert Shield',
    role: 'Blessing (Cashier)',
    badge: '💰 Multi-Product POS Shield',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    summary: 'Sell Sachet bags (₦350), 75cl packs (₦1,200), 50cl packs (₦1,100), and 19L refills (₦900).',
    noviceExplanation: 'Walk-in customers and distributors buy different products. Blessing selects the product, quantity, and Cash vs. Transfer. For Moniepoint/OPay transfers, she verifies credit on the physical POS terminal before opening the gate. Cash in her drawer must match the software to the exact Naira at 6:00 PM.',
    liveLink: '/factory/login',
    actionText: 'Test Cashier Gate POS',
    keyRule: 'Rule: Never release sachets, bottle packs, or dispenser jars until payment is verified on Moniepoint POS.'
  },
  {
    id: 5,
    time: '02:05 - 02:45',
    title: 'Driver Shortages: Burst Pouch Rule & Empty Jar Deposits',
    role: 'Musa (Delivery Driver)',
    badge: '🚚 Driver & Jar Shield',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    summary: 'Auto-debit ₦14,000 for 40 missing sachet bags + Track ₦4,500 deposit for unreturned 19L dispenser jars.',
    noviceExplanation: 'Drivers often claim bags burst or that customers promised to return empty 19L jars. Our rule is strict: if a sachet burst on the road, Musa must bring back the physical plastic pouch. For 19L dispenser jars (which cost ₦4,500 each), Musa must either bring back the empty jar or collect a ₦4,500 deposit from the customer. Zero excuses.',
    liveLink: '/factory/owner',
    actionText: 'See Driver Reconciliation',
    keyRule: 'Rule: 0 physical burst pouches = auto-debit; Unreturned 19L jars without deposit = driver liability.'
  },
  {
    id: 6,
    time: '02:45 - 03:25',
    title: 'Mr. Obi\'s Owner Portal: Dual-Line Profit & Diesel Slicer',
    role: 'Mr. Obi (Managing Director)',
    badge: '🔑 4-Digit Owner PIN',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary: 'Enter PIN 2026 to see today\'s net profit (₦524,200), generator fuel overhead, and preform audit.',
    noviceExplanation: 'Enter PIN 2026 anytime during the day. See real-time sachet sales (₦1,470,000) plus bottled/jar sales (₦501,000) = ₦1,971,000 total gross. See diesel burned (32 Liters @ ₦1,350 = ₦43,200), nylon film cost (₦280,000), PET preforms/caps (₦95,600), and net cash profit of ₦524,200.',
    liveLink: '/factory/owner',
    actionText: 'Unlock Mr. Obi\'s Screen',
    keyRule: 'Rule: Maintain generator diesel overhead below ₦12/sachet bag and monitor PET preform reject rate.'
  },
  {
    id: 7,
    time: '03:25 - 03:55',
    title: '8:00 PM WhatsApp Shift Summary & Home Screen App',
    role: 'Kenneth & Mr. Obi',
    badge: '📲 1-Tap WhatsApp Sync',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    summary: 'Supervisor taps one button to dispatch the dual-line production & financial audit to Mr. Obi\'s WhatsApp.',
    noviceExplanation: 'At 6:00 PM, Kenneth closes the shift and taps "Send Shift Close to Mr. Obi on WhatsApp". At 8:00 PM, Mr. Obi receives the complete daily digest broken down by Sachets, 75cl Bottles, 50cl Bottles, and 19L Dispenser Jars. Finally, save the app to your phone home screen for 1-tap instant access.',
    liveLink: '/factory',
    actionText: 'View Sample WhatsApp Report',
    keyRule: 'Rule: Zero WhatsApp API fees, zero Meta approvals, and zero risk of phone number bans.'
  }
];

export default function ObiFactoryWalkthroughPage() {
  const [activeChapter, setActiveChapter] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(e => console.log('Audio playback error:', e));
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-white font-sans antialiased selection:bg-[#0B5FFF] selection:text-white pb-24">
      
      {/* ──────────────────────────────────────────────────────────────────────────
          TOP NAVIGATION
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0B5FFF] to-[#00C2CB] flex items-center justify-center text-white shadow-md shadow-[#0B5FFF]/30">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
              <span>Obi Table Water Training Center</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Complete Beginner &bull; Novice Walkthrough
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/factory/owner"
            className="text-[11px] bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2.5 py-1 rounded-lg border border-amber-500/40 font-bold"
          >
            🔑 Owner PIN
          </Link>
          <Link
            href="/factory/login"
            className="text-[11px] text-[#38BDF8] hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700 font-bold"
          >
            Staff Login
          </Link>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          HERO & INTRO
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pt-6 pb-4 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B5FFF]/15 border border-[#0B5FFF]/30 text-[#38BDF8] text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>AUDIO-GUIDED TUTORIAL FOR MR. OBI &amp; FACTORY STAFF</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Obi Table Water OS: <span className="text-[#38BDF8]">Sachet & Bottled Water Dual-Line Guide</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Watch the video below with clean Nigerian voiceover narration, or follow the 7 beginner-friendly chapters to master machine tracking, driver shortages, diesel monitoring, and daily evening profits.
        </p>

        {/* Audio Player Controller Bar */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 max-w-lg mx-auto text-xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleAudio}
              className="w-9 h-9 rounded-xl bg-[#0B5FFF] hover:bg-[#094fd4] text-white flex items-center justify-center transition shadow-md shadow-[#0B5FFF]/30 cursor-pointer shrink-0"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="text-left">
              <strong className="text-white block text-[11px] font-bold">
                Nigerian Audio Voiceover (3 mins)
              </strong>
              <span className="text-[10px] text-slate-400">
                Official Voice: Abeo (Lagos Business Narration)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              {isPlayingAudio ? 'Playing 🔊' : 'Ready'}
            </span>
          </div>
        </div>

        <audio
          ref={audioRef}
          src="/videos/obi_walkthrough_voiceover.mp3"
          onEnded={() => setIsPlayingAudio(false)}
        />
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          MAIN VIDEO PLAYER CONTAINER
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-2">
        <div className="rounded-3xl bg-slate-900 border-2 border-[#0B5FFF]/40 overflow-hidden shadow-2xl space-y-3 p-2 sm:p-4">
          
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/qa-screenshots/sim_2026_water_factory_erp_mobile.png"
              className="w-full h-full object-contain"
            >
              <source src="/videos/obi_table_water_os_walkthrough.mp4" type="video/mp4" />
              <source src="/videos/obi_table_water_os_walkthrough.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Full Production HD Screen Capture</span>
              <span>&bull;</span>
              <span>Duration: ~3 Minutes</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/videos/obi_table_water_os_walkthrough.mp4"
                download
                className="text-[11px] bg-[#0B5FFF]/20 text-[#38BDF8] hover:bg-[#0B5FFF]/30 px-3 py-1 rounded-lg border border-[#0B5FFF]/40 font-bold flex items-center gap-1.5 transition"
              >
                <span>🎬 Download Video (MP4 - 6.6 MB)</span>
              </a>
              <a
                href="/downloads/obi_table_water_complete_handbook.pdf"
                download
                className="text-[11px] bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 px-3 py-1 rounded-lg border border-emerald-500/40 font-bold flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📄 Download Complete PDF Manual (431 KB)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          THE 7 NOVICE CHAPTERS (STEP-BY-STEP EXPLAINER)
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              7 Step-by-Step Chapters (Novice Guide)
            </h2>
            <p className="text-xs text-slate-400">
              Read each step below or tap &apos;Try Live&apos; to test that specific screen yourself:
            </p>
          </div>
          <span className="text-xs font-bold text-[#38BDF8] bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
            7 Lessons
          </span>
        </div>

        <div className="space-y-4">
          {CHAPTERS.map((ch) => (
            <div
              key={ch.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                activeChapter === ch.id
                  ? 'bg-slate-900/90 border-[#0B5FFF] shadow-xl'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-[#0B5FFF]/20 text-[#38BDF8] flex items-center justify-center font-black text-xs border border-[#0B5FFF]/40">
                    {ch.id}
                  </span>
                  <div>
                    <strong className="text-sm sm:text-base font-black text-white block">
                      {ch.title}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Video Timestamp: {ch.time} &bull; Actor: {ch.role}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border self-start sm:self-auto ${ch.badgeBg}`}>
                  {ch.badge}
                </span>
              </div>

              {/* Novice Description */}
              <div className="pt-3 space-y-2 text-xs text-slate-300">
                <p className="leading-relaxed">
                  {ch.noviceExplanation}
                </p>

                {/* Golden Factory Rule */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
                  <span className="text-base leading-none">💡</span>
                  <span><strong>Golden Rule:</strong> {ch.keyRule}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => setActiveChapter(ch.id)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <span>{activeChapter === ch.id ? 'Active Chapter' : 'Select Chapter'}</span>
                </button>

                <Link
                  href={ch.liveLink}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0B5FFF] hover:bg-[#094fd4] text-white text-xs font-bold transition flex items-center gap-1 shadow cursor-pointer"
                >
                  <span>{ch.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          NOVICE FAQ (ANSWERS TO COMMON FACTORY WORRIES)
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pt-10 space-y-4">
        <h2 className="text-lg font-black text-white border-b border-slate-800 pb-2">
          Frequently Asked Questions for Novice Owners
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <strong className="text-white font-bold block">
              1. What if my factory supervisor is not good with technology?
            </strong>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              The supervisor only has one primary button: <strong>&apos;+1 Roll Used&apos;</strong>. He does not need to type paragraphs or calculate math. If he knows how to tap an icon on WhatsApp, he can run this in 5 minutes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <strong className="text-white font-bold block">
              2. What happens if our factory internet or power cuts off?
            </strong>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              It is 100% offline-first. Kenneth and Blessing can continue recording bags and cash without data. The moment mobile network catches, all figures sync automatically.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <strong className="text-white font-bold block">
              3. How does this prevent my drivers from arguing with me?
            </strong>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              The software introduces the <strong>Physical Pouch Rule</strong>. If a driver claims 30 bags burst, he must hand over 30 empty physical pouches. If he cannot produce the pouches, the system auto-debits his pay. The software takes the blame—not you.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <strong className="text-white font-bold block">
              4. Can my supervisor see how much net profit I am making?
            </strong>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              No. Kenneth only sees production and rolls used. Your total bank balances and daily net profit are locked behind Mr. Obi&apos;s private 4-digit PIN (2026).
            </p>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          FINAL CTA & SUPPORT
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pt-10 text-center space-y-4">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B5FFF]/20 via-slate-900 to-[#00C2CB]/20 border border-[#0B5FFF]/30 space-y-3">
          <h3 className="text-xl font-black text-white">
            Ready to Put Obi Table Water OS in Your Plant?
          </h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Book your 14-day zero-risk factory pilot. We configure your machine specs, driver names, and wholesale prices within 48 hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <a
              href="https://wa.me/2348022791227?text=Hello%20Bethelmind%20Desk!%20I%20watched%20the%20Obi%20Table%20Water%20walkthrough%20video%20and%20want%20to%20activate%20my%2014-day%20plant%20pilot."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-[#25D366]/25 transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Book Plant Pilot on WhatsApp (0802 279 1227)</span>
            </a>

            <Link
              href="/factory/owner"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition"
            >
              Open Live Owner Screen &rarr;
            </Link>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 pt-2">
          Bethelmind Digital Solutions &bull; CAC Certified Enterprise (Reg: 9912717) &bull; Moniepoint MFB: 6805375225
        </div>
      </section>

    </div>
  );
}
