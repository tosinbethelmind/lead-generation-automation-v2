'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Briefcase, Sparkles, ShieldCheck } from 'lucide-react';

export function WebappToolActionBar({ currentTool }: { currentTool?: string }) {
  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-xl backdrop-blur-md mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-sans">
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
          ⚡
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold">Enterprise Engine Control</span>
            {currentTool && (
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[10px] font-semibold capitalize">
                {currentTool}
              </span>
            )}
          </div>
          <span className="text-slate-400 text-[11px]">
            Sell this engine copy or invite your team for multi-user access
          </span>
        </div>
      </div>

      {/* The Two Prominent Tool Buttons */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Button 1: Sell / Handover Engine for someone */}
        <Link
          href="/admin/handover"
          className="flex-1 sm:flex-none px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 border border-emerald-400/30"
          title="Sell or Transfer recruitment engine copy to a client with IP transfer docs & setup bundle"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>🤝 1. Sell / Handover Engine</span>
        </Link>

        {/* Button 2: Team Multi-User Access */}
        <Link
          href="/admin/team"
          className="flex-1 sm:flex-none px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 border border-blue-400/30"
          title="Give your team multiple access, generate access tokens, and assign user roles"
        >
          <Users className="w-3.5 h-3.5" />
          <span>👥 2. Team Multi-User Access</span>
        </Link>

        {/* Dedicated Recruitment Link */}
        <Link
          href="/recruitment"
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1"
          title="AI Recruitment & Talent Engine Direct Link"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Recruitment Engine</span>
        </Link>
      </div>
    </div>
  );
}
