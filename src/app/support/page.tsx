'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  LifeBuoy, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  Check, 
  Wrench, 
  PhoneCall, 
  Mail, 
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { MAINTENANCE_OPTIONS, ON_DEMAND_TASK_MENU } from '@/config/plans';

export default function SupportPage() {
  const adminPhone = '2348022791227';
  const supportEmail = 'bethelmindrecruit@gmail.com';

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f5f3ef] font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      <Navbar />

      <main className="pt-36 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
            <LifeBuoy className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Dedicated Lagos Technical Desk &bull; Rapid SLA Response</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-snug sm:leading-tight">
            Support &amp; Maintenance. <br className="hidden sm:inline" />{' '}
            <span className="italic font-light text-[#d4af37]">
              Keeping Your Enterprise Operational 24/7.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#c9c4bc] font-light leading-relaxed max-w-2xl mx-auto">
            From emergency domain renewals and price catalog updates to WhatsApp AI retuning, our engineering desk is always on standby for active client accounts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href={`https://wa.me/${adminPhone}?text=${encodeURIComponent(
                'Hello Bethelmind Support Desk! I am an active client and require technical assistance with our business website/AI assistant.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#d4af37]/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Priority WhatsApp Support (0802 279 1227) &rarr;</span>
            </a>

            <a
              href={`mailto:${supportEmail}`}
              className="py-3 px-6 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#f5f3ef] border border-white/[0.08] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4 text-[#d4af37]" />
              <span>Email Support Desk</span>
            </a>
          </div>
        </div>

        {/* SLA Commitments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: 'Emergency Downtime Support',
              sla: '< 15 Minutes',
              desc: 'Immediate developer attention for domain, SSL, or server connection outages on WhatsApp.',
              color: 'text-[#d4af37]',
              border: 'border-[#d4af37]/30'
            },
            {
              title: 'Content & Price Updates',
              sla: '2 to 4 Hours',
              desc: 'Fast turnaround for new phone numbers, price adjustments, or staff email additions.',
              color: 'text-[#f5f3ef]',
              border: 'border-white/[0.08]'
            },
            {
              title: 'Custom Calculators & Modules',
              sla: '24 to 48 Hours',
              desc: 'Comprehensive engineering for new sector quotation tools or API webhook integrations.',
              color: 'text-[#c5a880]',
              border: 'border-white/[0.08]'
            }
          ].map((item, i) => (
            <div key={i} className={`p-6 sm:p-7 rounded-2xl bg-[#090d16]/80 border ${item.border} space-y-3 backdrop-blur-sm`}>
              <span className={`text-2xl font-normal font-mono ${item.color} block`}>
                {item.sla}
              </span>
              <h3 className="font-serif text-lg text-[#f5f3ef] font-normal">{item.title}</h3>
              <p className="text-xs text-[#c9c4bc] font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Maintenance Pass Packages */}
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-medium text-[#c5a880] uppercase tracking-widest block">
              Continuous Care &bull; Peace of Mind
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f3ef] font-normal">
              Annual Support Passes &amp; Retainer Vouchers
            </h2>
            <p className="text-xs text-[#c9c4bc] font-light max-w-xl mx-auto">
              For enterprises that require hands-free operational continuity without unpredictable agency invoices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MAINTENANCE_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className="p-7 sm:p-9 rounded-3xl bg-[#090d16]/90 border border-white/[0.08] hover:border-[#d4af37]/30 flex flex-col justify-between space-y-7 transition-all shadow-xl backdrop-blur-md"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-widest block">
                      {opt.badge}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  
                  <h3 className="font-serif text-2xl text-[#f5f3ef] font-normal">
                    {opt.name}
                  </h3>
                  
                  <p className="text-xs text-[#c9c4bc] font-light leading-relaxed">
                    {opt.desc}
                  </p>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-baseline justify-between">
                    <span className="text-xs text-[#c9c4bc]/70">Investment:</span>
                    <div>
                      <span className="text-2xl font-normal text-[#d4af37] font-mono">
                        &#8358;{opt.priceNGN.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#c9c4bc]/60 ml-1.5">{opt.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {opt.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[#c9c4bc] font-light">
                        <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`https://wa.me/${adminPhone}?text=${encodeURIComponent(
                    `Hello Bethelmind Support Desk! I want to activate the *${opt.name}* (₦${opt.priceNGN.toLocaleString()}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Activate Pass on WhatsApp &rarr;</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* On-Demand Task Menu */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[11px] font-medium text-[#c5a880] uppercase tracking-widest block">
              On-Demand Services
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#f5f3ef] font-normal">
              Pay-As-You-Go Developer Task Menu
            </h3>
            <p className="text-xs text-[#c9c4bc] font-light">
              Only require a one-off enhancement? Order isolated engineering tasks with guaranteed turnaround times.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ON_DEMAND_TASK_MENU.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#090d16]/70 border border-white/[0.06] hover:border-white/[0.12] flex items-center justify-between transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-xs font-medium text-[#f5f3ef]">{item.task}</p>
                  <p className="text-[11px] text-[#c9c4bc]/70 font-light">Turnaround: {item.turnaround}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-sm font-normal text-[#d4af37] font-mono block">
                    &#8358;{item.priceNGN.toLocaleString()}
                  </span>
                  <a
                    href={`https://wa.me/${adminPhone}?text=${encodeURIComponent(
                      `Hello Bethelmind Support Desk! I need an on-demand task: *${item.task}* (₦${item.priceNGN.toLocaleString()}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#c5a880] hover:text-[#f5f3ef] hover:underline font-medium inline-block mt-0.5"
                  >
                    Request Task &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
