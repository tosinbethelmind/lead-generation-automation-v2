import React from 'react';
import { RecruitmentEngineWidget } from '@/components/RecruitmentEngineWidget';
import { WebappToolActionBar } from '@/components/WebappToolActionBar';
import Link from 'next/link';
import { ArrowLeft, Briefcase, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'AI Recruitment & Talent Engine | ApexReach 2026',
  description: 'Position advertising, evergreen talent pool bank, automated AI CV grading, Google X-Ray candidate sourcing, and interview scheduling.',
};

export default function RecruitmentPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Global Action Bar with Sell Engine & Team Access Buttons */}
        <WebappToolActionBar currentTool="Recruitment Engine" />

        {/* Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                  Enterprise HR & Talent Suite
                </span>
                <span className="flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>AI Engine Active</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                <span>AI Recruitment & Talent Hiring Engine</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg"
            >
              Go to Master Dashboard &rarr;
            </Link>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg font-bold">📢</div>
            <div>
              <div className="font-bold text-white">Job Ads & Criteria</div>
              <div className="text-slate-400 text-[11px]">Pre-screening filters</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg font-bold">🌐</div>
            <div>
              <div className="font-bold text-white">Talent Pool Bank</div>
              <div className="text-slate-400 text-[11px]">1-tap WhatsApp availability</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg font-bold">🔎</div>
            <div>
              <div className="font-bold text-white">Google X-Ray Sourcing</div>
              <div className="text-slate-400 text-[11px]">100% Free LinkedIn search</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg font-bold">🤖</div>
            <div>
              <div className="font-bold text-white">AI CV Grader (0-100%)</div>
              <div className="text-slate-400 text-[11px]">Instant suitability match</div>
            </div>
          </div>
        </div>

        {/* Recruitment Engine Main Widget */}
        <RecruitmentEngineWidget />
      </div>
    </main>
  );
}
