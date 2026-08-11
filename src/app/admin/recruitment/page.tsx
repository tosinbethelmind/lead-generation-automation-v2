'use client';

import React from 'react';
import { RecruitmentEngineWidget } from '@/components/RecruitmentEngineWidget';
import { Briefcase, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminRecruitmentPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-950/80 p-6 rounded-2xl border border-indigo-500/30 shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" /> Standalone HR Entity
          </div>
          <h1 className="text-2xl font-extrabold text-white">Recruitment & Talent Sourcing Suite</h1>
          <p className="text-xs text-slate-400 mt-1">
            Separated enterprise recruitment module for position advertising, automated AI CV grading, talent pool banking, and interview scheduling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/crm"
            className="accessible-btn accessible-btn-ghost text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Scraper CRM
          </Link>
          <span className="engine-badge engine-badge-recruitment">
            <span className="status-dot-pulse bg-indigo-400"></span> HR Engine Active
          </span>
        </div>
      </div>

      {/* Main Recruitment Widget Embed */}
      <div className="bg-slate-900/60 rounded-2xl border border-white/10 p-2 shadow-2xl">
        <RecruitmentEngineWidget />
      </div>
    </div>
  );
}
