import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Share2, ShieldCheck } from 'lucide-react';
import { SectorToolsWidget } from '@/components/SectorToolsWidget';
import { RecruitmentEngineWidget } from '@/components/RecruitmentEngineWidget';
import { WebappToolActionBar } from '@/components/WebappToolActionBar';
import CustomerAiAgentWidget from '@/components/CustomerAiAgentWidget';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params;
  const formattedTitle = (slug || 'tool').replace('-', ' ').toUpperCase();
  return {
    title: `Free ${formattedTitle} Business Tool | ApexReach 2026`,
    description: `Free standalone business automation calculator and interactive tool for ${formattedTitle}. Share on WhatsApp or bookmark for instant use.`,
  };
}

export default async function StandaloneToolPage({ params }: ToolPageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Global Action Bar with Sell Engine & Team Access Buttons */}
        <WebappToolActionBar currentTool={(slug || 'tool').replace('-', ' ')} />
        {/* Header Navigation */}
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
                  Free Standalone Business Tool
                </span>
                <span className="flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>100% Free & Shareable</span>
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-white mt-1 capitalize flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span>{(slug || 'tool').replace('-', ' ')} Tool</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg"
            >
              Explore All Features &rarr;
            </Link>
          </div>
        </div>

        {/* Feature Render */}
        {slug === 'recruitment' ? (
          <RecruitmentEngineWidget />
        ) : (
          <SectorToolsWidget />
        )}
      </div>

      {/* 24/7 Bethel AI Concierge — helps visitors interpret calculator results and take next steps */}
      <CustomerAiAgentWidget
        sector={(slug || 'tool').replace(/-/g, ' ')}
        agentTitle={`Bethel — Your ${(slug || 'tool').replace(/-/g, ' ').toUpperCase()} AI Guide`}
      />
    </main>
  );
}
