'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, ShieldCheck, FileText } from 'lucide-react';
import { paymentConfig } from '@/config/payment';

export default function FinalCtaSection() {
  const waLink = `https://wa.me/${paymentConfig.whatsappNumber}?text=${encodeURIComponent(
    'Hello Bethelmind Lagos Desk! I would like to request a private consultation to discuss bespoke automation architecture for our business.'
  )}`;

  return (
    <section 
      aria-label="Private Consultation Call to Action"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      <div className="p-8 sm:p-14 rounded-3xl bg-[#0a0d14] border border-[#d4af37]/30 text-center space-y-8 shadow-2xl shadow-black/80 relative overflow-hidden">
        
        {/* Subtle Ambient Light */}
        <div 
          aria-hidden="true"
          className="absolute top-0 right-0 -mr-24 -mt-24 w-72 h-72 bg-[#d4af37]/[0.05] rounded-full blur-3xl pointer-events-none" 
        />
        
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-semibold block">
            Guaranteed 48-Hour Prototype Turnaround
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-snug md:leading-tight">
            Request your private consultation.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#c9c4bc] font-light leading-relaxed">
            Experience how a bespoke mobile website and intelligent WhatsApp quotation assistant protect client relationships and scale enterprise conversion.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3.5 px-7 rounded-xl bg-[#d4af37] hover:bg-[#c5a880] text-slate-950 font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#d4af37]/15 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Book Private Consultation (0802 279 1227)</span>
          </a>

          <Link
            href="/contact"
            className="w-full sm:w-auto py-3.5 px-7 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#f5f3ef] border border-white/[0.08] hover:border-white/[0.15] text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-[#d4af37]" />
            <span>Request Written Proposal</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-white/[0.04] flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#8e887e] font-light">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>CAC Certified Enterprise (RC 7034297)</span>
          </span>
          <span className="hidden sm:inline text-white/20">&bull;</span>
          <span>Moniepoint MFB: 6805375225</span>
          <span className="hidden sm:inline text-white/20">&bull;</span>
          <span>Commercial Corridor, Lagos</span>
        </div>
      </div>
    </section>
  );
}
