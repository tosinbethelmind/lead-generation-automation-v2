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
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Dedicated Lagos Technical Desk &bull; Rapid SLA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight leading-tight">
            Support & Maintenance. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              We Keep Your Sales Machine Running 24/7.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            From emergency domain renewals and price catalog updates to WhatsApp AI retuning, our senior engineering desk is always one message away.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/${adminPhone}?text=${encodeURIComponent(
                'Hello Bethelmind Support Desk! I am an active client and require technical assistance with our business website/AI assistant.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Priority WhatsApp Support (0802 279 1227) →</span>
            </a>

            <a
              href={`mailto:${supportEmail}`}
              className="py-3 px-5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
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
              color: 'text-rose-400',
              border: 'border-rose-500/30'
            },
            {
              title: 'Content & Price Updates',
              sla: '2 to 4 Hours',
              desc: 'Fast turnaround for new phone numbers, price adjustments, or staff email additions.',
              color: 'text-cyan-400',
              border: 'border-cyan-500/30'
            },
            {
              title: 'Custom Calculators & Modules',
              sla: '24 to 48 Hours',
              desc: 'Comprehensive engineering for new sector quotation tools or API webhook integrations.',
              color: 'text-amber-400',
              border: 'border-amber-500/30'
            }
          ].map((item, i) => (
            <div key={i} className={`p-6 rounded-3xl bg-slate-900/70 border ${item.border} space-y-2`}>
              <span className={`text-2xl font-black font-mono ${item.color} block`}>
                {item.sla}
              </span>
              <h3 className="text-base font-bold text-white font-['Outfit']">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Maintenance Pass Packages */}
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-white font-['Outfit']">
              Annual Support Passes & Prepaid Vouchers
            </h2>
            <p className="text-xs text-slate-400">
              For clients who want hands-free peace of mind without unpredictable agency bills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MAINTENANCE_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    {opt.badge}
                  </span>
                  <h3 className="text-2xl font-bold text-white font-['Outfit']">
                    {opt.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {opt.desc}
                  </p>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Rate:</span>
                    <div>
                      <span className="text-2xl font-black text-emerald-400 font-mono">
                        ₦{opt.priceNGN.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 ml-1.5">{opt.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {opt.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
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
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Activate Pass on WhatsApp →</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* On-Demand Task Menu */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              📋 Pay-As-You-Go Developer Task Menu
            </h3>
            <p className="text-xs text-slate-400">
              Only need a one-off update? Order single tasks with guaranteed turnaround times.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ON_DEMAND_TASK_MENU.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white">{item.task}</p>
                  <p className="text-[11px] text-slate-400">⚡ Turnaround: {item.turnaround}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="text-sm font-black text-cyan-400 font-mono block">
                    ₦{item.priceNGN.toLocaleString()}
                  </span>
                  <a
                    href={`https://wa.me/${adminPhone}?text=${encodeURIComponent(
                      `Hello Bethelmind Support Desk! I need an on-demand task: *${item.task}* (₦${item.priceNGN.toLocaleString()}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-400 hover:underline font-bold"
                  >
                    Request Task →
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
