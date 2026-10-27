'use client';

/**
 * @file src/app/solar/page.tsx
 * STANDALONE & INTEGRATED SOLAR BOQ ENGINE (SolarQuotePro)
 * 
 * Features:
 * 1. Full interactive native Solar BOQ & Inverter Load Sizing Suite built directly inside the website.
 * 2. Cross-link to the standalone sovereign app (https://solar-roi-proposal-builder.vercel.app).
 * 3. 100% preservation of all links, phone hotlines, and calculation logic.
 */

import React from 'react';
import Link from 'next/link';
import { 
  Zap, ArrowRight, ExternalLink, ShieldCheck, Calculator, 
  Layers, CheckCircle2, PhoneCall, Sparkles, Server, FileText
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import SolarBoqCalculator from '@/components/solar/SolarBoqCalculator';

export default function SolarPortalPage() {
  const SOLAR_WEBAPP_URL = 'https://solar-roi-proposal-builder.vercel.app';
  const WA_HOTLINE = 'https://wa.me/2348022791227?text=Hello%20Bethelmind%20Lagos%20Desk%2C%20I%20am%20a%20solar%20installer%20and%20want%20to%20access%20the%20SolarQuotePro%20Installer%20Suite.';

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f5f3ef] font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      <Navbar />

      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* HERO SECTION */}
        <section className="max-w-4xl mx-auto text-center space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Integrated Solar Quoting Suite</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-snug sm:leading-tight">
            SolarQuotePro &bull; <br className="hidden sm:inline" />{' '}
            <span className="italic font-light text-[#d4af37]">
              Interactive Solar BOQ &amp; ROI Engine
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#c9c4bc] font-light leading-relaxed max-w-2xl mx-auto">
            Dimension inverter capacities, size lithium LiFePO4 battery banks, compare DisCo Band A vs diesel generator fuel costs, and generate bankable WhatsApp BOQs directly on this page.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={WA_HOTLINE}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-[#070b14]" />
              <span>Installer Onboarding Desk &rarr;</span>
            </a>

            <a
              href={SOLAR_WEBAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#c9c4bc] hover:text-[#f5f3ef] border border-white/[0.08] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all"
            >
              <span>Open Standalone Web App</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
            </a>
          </div>
        </section>

        {/* NATIVE WORKING SOLAR CALCULATOR (BUILT DIRECTLY INSIDE WEBSITE) */}
        <section className="max-w-6xl mx-auto">
          <div className="rounded-3xl bg-[#090d16]/95 border border-[#d4af37]/25 p-4 sm:p-8 shadow-2xl backdrop-blur-md">
            <SolarBoqCalculator businessName="Solar Engineering Integrator" isEmbedded={false} />
          </div>
        </section>

        {/* ARCHITECTURE & STANDALONE WORKSPACE INFO */}
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="rounded-2xl bg-[#090d16]/60 border border-white/[0.06] p-5 sm:p-6 text-left flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center shrink-0 mt-0.5">
              <Server className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-base text-[#f5f3ef] font-normal">
                Dual Solar Deployment Architecture
              </h4>
              <p className="text-xs text-[#c9c4bc] font-light leading-relaxed">
                You have two connected versions of this tool: <strong className="text-[#f5f3ef]">1) The Native In-Website Engine</strong> rendered directly above (at <code className="text-[#d4af37] font-mono">/solar</code> and <code className="text-[#d4af37] font-mono">/tools/solar-boq</code>), and <strong className="text-[#f5f3ef]">2) The Standalone Sovereign Application</strong> running at <a href={SOLAR_WEBAPP_URL} target="_blank" rel="noreferrer" className="text-[#d4af37] underline decoration-[#d4af37]/40 hover:decoration-[#d4af37]">solar-roi-proposal-builder.vercel.app</a>. Both use verified Nigerian DisCo tariffs (₦209.50/kWh) and diesel replacement payback matrices.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
