'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, ArrowRight, TrendingUp } from 'lucide-react';
import { getSectorCaseStudy } from '../../lib/blog/sectorCaseStudies';

interface SectorCaseStudyCalloutProps {
  category: string;
  businessName?: string;
}

export function SectorCaseStudyCallout({ category, businessName = 'Your Business' }: SectorCaseStudyCalloutProps) {
  const caseStudy = getSectorCaseStudy(category);

  return (
    <section className="my-10 px-4 max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-sky-900/60 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/40 p-6 md:p-8 shadow-2xl">
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-sky-500/10 border border-sky-400/20 text-sky-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>2026 Nigerian Operator Blueprint</span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
              {caseStudy.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {caseStudy.highlight} Designed specifically to help commercial operators scale revenue and eliminate bottlenecks.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span>Proven Operational Benchmark: {caseStudy.metric}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <Link
              href={`/blog/${caseStudy.slug}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/20 transition-all duration-200 group"
            >
              <span>Read Full Case Study</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>Browse All 88 Industry Guides</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectorCaseStudyCallout;
