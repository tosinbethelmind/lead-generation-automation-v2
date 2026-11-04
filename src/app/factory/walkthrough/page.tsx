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
    title: 'Introduction: Why Everything Runs on Mobile Phones',
    role: 'Mr. Obi (Owner)',
    badge: '👑 Executive Overview',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary: 'No computers, no complex accounting software, and zero monthly internet burden.',
    noviceExplanation: 'Water factories are dusty, wet, and fast-paced. You do not need an office computer or an IT technician. As the owner, your phone is connected directly to your plant. It works even when public power (NEPA) drops or mobile network fluctuates.',
    liveLink: '/factory/owner',
    actionText: 'View Owner Screen',
    keyRule: 'Rule: The factory owner should know their exact cash profit before 8:00 PM every evening.'
  },
  {
    id: 2,
    time: '00:25 - 00:55',
    title: 'Staff Login Without Passwords (Zero Learning Curve)',
    role: 'All Factory Staff',
    badge: '👥 No Password Login',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    summary: 'Four large picture cards with 4-digit PINs. No email addresses or complicated passwords.',
    noviceExplanation: 'Nigerian factory workers forget passwords within hours. On this system, nobody types an email. Staff see four large picture cards: Mr. Obi, Kenneth the supervisor, Blessing the cashier, and Musa the driver. Kenneth just taps his picture, types 1-1-1-1, and he is inside.',
    liveLink: '/factory/login',
    actionText: 'Try Staff Login Screen',
    keyRule: 'Rule: Never give factory workers complex email logins. Use simple 4-digit PINs.'
  },
  {
    id: 3,
    time: '00:55 - 01:30',
    title: 'Supervisor Shift Console (+1 Roll Used & Anti-Ghost Shift)',
    role: 'Kenneth (Supervisor)',
    badge: '📋 Shift Production',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    summary: 'Tap "+1 Roll Used" whenever nylon finishes. Automatically calculates 300 bags per roll.',
    noviceExplanation: 'Machine operators can no longer steal bags or run "ghost shifts". When a roll of nylon finishes on the sealing machine, Kenneth taps the big green button: "+1 Roll Used". The system counts 300 bags. If 14 rolls were used, 4,200 bags MUST be accounted for in the loading bay.',
    liveLink: '/factory/login',
    actionText: 'Test +1 Roll Button',
    keyRule: 'Rule: 1kg of pure water nylon film must yield 16 bags. Any discrepancy is flagged immediately.'
  },
  {
    id: 4,
    time: '01:30 - 02:05',
    title: 'Gate Sales POS (Physical Cash vs. Fake Bank Alerts)',
    role: 'Blessing (Cashier)',
    badge: '💰 Gate POS & Fraud Shield',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    summary: 'Distinguish between cash in hand and Moniepoint/OPay bank transfers with terminal verification.',
    noviceExplanation: 'Walk-in depot buyers buy directly at the gate. Blessing records the customer name, number of bags, and selects Cash or Transfer. If it is a transfer, she verifies the credit on the Moniepoint terminal before opening the gate. At 6:00 PM, physical cash in her drawer must match the software.',
    liveLink: '/factory/login',
    actionText: 'Test Cashier Gate POS',
    keyRule: 'Rule: Never release water for bank transfers until confirmed on the Moniepoint POS terminal.'
  },
  {
    id: 5,
    time: '02:05 - 02:45',
    title: 'Stopping Driver Shortages & The Physical Pouch Rule',
    role: 'Musa (Delivery Driver)',
    badge: '🚚 Driver Shortage Shield',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    summary: 'Musa loaded 700 bags. He remitted cash for 620 bags. The system auto-debits ₦14,000 for 40 missing bags.',
    noviceExplanation: 'This is where factory owners lose ₦20,000–₦50,000 every day. Drivers claim water burst on potholes, pocket the cash, and blame the road. Our rule is strict: if a bag bursts, Musa must bring back the physical empty plastic pouch. Because Musa brought back 0 pouches, the system auto-debits ₦14,000 from his pay. Zero arguments.',
    liveLink: '/factory/owner',
    actionText: 'See Musa Shortage Debit',
    keyRule: 'Rule: 0 physical burst pouches returned = 0 excuse. Full retail price auto-debited from driver pay.'
  },
  {
    id: 6,
    time: '02:45 - 03:25',
    title: 'Mr. Obi\'s 4-Digit Owner PIN Portal & Live Net Cash Profit',
    role: 'Mr. Obi (Managing Director)',
    badge: '🔑 4-Digit Owner PIN',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary: 'Enter PIN 2026 to see today\'s net cash profit (₦384,200), diesel cost per bag, and NAFDAC purity.',
    noviceExplanation: 'You do not have to wait until midnight. At 1:00 PM or 5:00 PM, open your phone, enter your PIN (2026), and see your real profit. You see diesel burned (28 Liters = ₦9.00/bag), total bags loaded, driver shortages debited, and your NAFDAC water test results (TDS 24 ppm, pH 7.2).',
    liveLink: '/factory/owner',
    actionText: 'Unlock Mr. Obi\'s Screen',
    keyRule: 'Rule: Keep generator diesel overhead below ₦12.00 per sachet bag to protect factory profit.'
  },
  {
    id: 7,
    time: '03:25 - 03:55',
    title: '8:00 PM WhatsApp Shift Summary & Home Screen App',
    role: 'Kenneth & Mr. Obi',
    badge: '📲 1-Tap WhatsApp Sync',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    summary: 'Supervisor taps one button to dispatch the complete evening audit straight to Mr. Obi\'s WhatsApp.',
    noviceExplanation: 'At 6:00 PM, Kenneth closes the shift and taps "Send Shift Close to Mr. Obi on WhatsApp". At 8:00 PM, your personal WhatsApp rings with the complete daily summary. Finally, tap "Add to Home screen" in your mobile browser, and the Obi Water icon sits right on your phone screen beside WhatsApp.',
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
          How to Run Obi Table Water OS <span className="text-[#38BDF8]">Like a Pro</span>
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
              <source src="/videos/obi_table_water_os_walkthrough.webm" type="video/webm" />
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

            <div className="flex items-center gap-2">
              <a
                href="/videos/obi_table_water_os_walkthrough.webm"
                download
                className="text-[11px] text-[#38BDF8] hover:underline font-bold flex items-center gap-1"
              >
                <span>Download Video (4.6 MB)</span>
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
