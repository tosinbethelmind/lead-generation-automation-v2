import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Share2, ShieldCheck, ExternalLink } from 'lucide-react';
import { SectorToolsWidget } from '@/components/SectorToolsWidget';
import { RecruitmentEngineWidget } from '@/components/RecruitmentEngineWidget';
import { WebappToolActionBar } from '@/components/WebappToolActionBar';
import CustomerAiAgentWidget from '@/components/CustomerAiAgentWidget';
import IntegrationBlueprintDashboard from '@/components/IntegrationBlueprintDashboard';
import { SmeWebsiteGraderWidget } from '@/components/blog/SmeWebsiteGraderWidget';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

const VIRAL_TOOLS: Record<string, { title: string; file: string; badge: string; description: string }> = {
  'solar-savings': { 
    title: 'Solar & Clean Energy Savings Calculator', 
    file: 'solar-savings.html', 
    badge: 'High Solar ROI', 
    description: 'Calculate 25-year rooftop solar savings, panel count, and 30% clean energy rebates in seconds.' 
  },
  'crypto-dca': { 
    title: 'WhaleDCA™ Crypto & Profit Target Exit Ladder', 
    file: 'crypto-dca.html', 
    badge: 'Crypto Alpha', 
    description: 'Simulate Bitcoin, ETH & Solana dollar-cost averaging and auto-generate institutional 4-tier take-profit exit targets.' 
  },
  'kids-learning': { 
    title: 'Tiny Learners™ 3D Kids Phonics & Activity Generator', 
    file: 'kids-learning.html', 
    badge: 'Family & Toddlers', 
    description: 'Generate instant, screen-free phonics games, counting quests, and printable coloring activities for toddlers and preschoolers.' 
  },
  'biohack-longevity': { 
    title: 'Biohack Longevity™ Macro & Autophagy Engine', 
    file: 'biohack-longevity.html', 
    badge: 'Biotech Health', 
    description: 'Calculate personalized BMR/TDEE, cellular autophagy hours, optimal protein floor, and intermittent fasting windows.' 
  },
  'wealth-calculator': { 
    title: 'WealthPulse Pro™ Compound Growth Model', 
    file: 'wealth-calculator.html', 
    badge: 'Finance Magnet', 
    description: 'Interactive compound interest, financial freedom timeline, and annual savings projection visualizer.' 
  },
  'deal-calculator': { 
    title: 'DealCheck™ Rental Property Cashflow & Cap Rate', 
    file: 'cashflow-calculator.html', 
    badge: 'Real Estate Pro', 
    description: 'Calculate net cash-on-cash return, cap rate, and mortgage DSCR for long-term rental and Airbnb properties.' 
  },
  'cashflow': { 
    title: 'DealCheck™ Rental Property Cashflow & Cap Rate', 
    file: 'cashflow-calculator.html', 
    badge: 'Real Estate Pro', 
    description: 'Calculate net cash-on-cash return, cap rate, and mortgage DSCR for long-term rental and Airbnb properties.' 
  },
  'script-generator': { 
    title: 'Viral Shorts Hook & Script Studio', 
    file: 'script-generator.html', 
    badge: 'Trending #1', 
    description: 'Generate 0–3s high-contrast hooks, scene-by-scene B-roll prompts, and APV > 100% loop bridges in 10 seconds.' 
  },
  'site-audit': { 
    title: 'Website Health & SEO Audit Scorecard', 
    file: 'site-audit.html', 
    badge: 'Client Closer', 
    description: 'Instant 360° audit grading Google Core Web Vitals, On-Page SEO, security headers, and revenue leakage with auto client pitch.' 
  },
  'wholesaling-loi': { 
    title: 'Real Estate Wholesaling & Auto-LOI Contract', 
    file: 'wholesaling-loi.html', 
    badge: 'Deal Closer', 
    description: 'Calculate 70% Rule Maximum Allowable Offer (MAO), rehab repair tiers, and auto-generate 1-page cash offer LOI contracts.' 
  },
  'prayer-journal': { 
    title: 'Daily Grace™ Scripture & Prayer Journal', 
    file: 'prayer-journal.html', 
    badge: 'Faith & Soul', 
    description: 'Scripture promise finder, prayer journal with audio devotionals, and daily faith affirmations.' 
  },
  'sports-edge': { 
    title: 'SportsBet Edge™ Expected Value Matrix', 
    file: 'sports-edge.html', 
    badge: 'High Engagement', 
    description: 'Calculate positive expected value (+EV), fractional Kelly Criterion staking, and eliminate emotional wagering tilt.' 
  },
  'ai-stack-finder': { 
    title: 'AI & Micro-SaaS Stack ROI Finder', 
    file: 'ai-stack-finder.html', 
    badge: 'Automation', 
    description: 'Discover the top AI software stack for your business and calculate exact monthly hours and dollars saved.' 
  },
};

export async function generateStaticParams() {
  const defaultSlugs = [
    { slug: 'website-grader' },
    { slug: 'google-visibility' },
    { slug: 'solar-boq' },
    { slug: 'solar-quote-pro' },
    { slug: 'solar-quote' },
    { slug: 'salon-booking' },
    { slug: 'tokunbo-duty' },
    { slug: 'mortgage-calc' },
    { slug: 'clinic-booking' },
    { slug: 'school-tuition' },
    { slug: 'logistics-waybill' },
    { slug: 'cac-filing' },
    { slug: 'shortlet-booking' },
    { slug: 'recruitment' },
    { slug: 'integrations' },
    { slug: 'social-ads' },
  ];

  const viralSlugs = Object.keys(VIRAL_TOOLS).map(s => ({ slug: s }));
  return [...defaultSlugs, ...viralSlugs];
}

function slugToCategory(slug: string): string {
  switch (slug) {
    case 'salon-booking':
    case 'beauty':
    case 'spa':
      return 'Beauty & Hair Salon';
    case 'solar-boq':
    case 'solar-quote':
    case 'solar-quote-pro':
    case 'solar':
      return 'Solar & Renewable Energy';
    case 'tokunbo-duty':
    case 'auto':
    case 'car-clearing':
      return 'Automobile & Tokunbo Dealership';
    case 'mortgage-calc':
    case 'mortgage':
    case 'real-estate':
      return 'Real Estate & Property Development';
    case 'clinic-booking':
    case 'healthcare':
    case 'clinic':
      return 'Clinic & Healthcare HMO';
    case 'school-tuition':
    case 'education':
    case 'school':
      return 'Private Education & Schools';
    case 'logistics-waybill':
    case 'logistics':
      return 'Logistics & Freight Haulage';
    case 'cac-filing':
    case 'legal':
      return 'Legal & CAC Corporate Services';
    case 'shortlet-booking':
    case 'hospitality':
    case 'shortlet':
      return 'Shortlet & Hospitality Apartments';
    case 'social-ads':
      return 'Social Ad Automation & Growth';
    default:
      return 'Solar & Renewable Energy';
  }
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params;
  const cleanSlug = (slug || '').replace(/\.html$/i, '');

  if (VIRAL_TOOLS[cleanSlug]) {
    const vTool = VIRAL_TOOLS[cleanSlug];
    return {
      title: `${vTool.title} | Free Online Calculator Bethelmind`,
      description: vTool.description,
      openGraph: {
        title: `${vTool.title} | Free Bethelmind Tool`,
        description: vTool.description,
      }
    };
  }
  
  if (cleanSlug === 'website-grader' || cleanSlug === 'google-visibility' || cleanSlug === 'sme-grader') {
    return {
      title: 'Nigerian SME Google Visibility & Revenue-Leak Grader — Free Digital Audit',
      description: 'Audit your Google search presence, competitor ad poaching risk, and WhatsApp reply latency in 10 seconds. Free instant mobile website prototype for Nigerian SMEs.',
      openGraph: {
        title: 'Nigerian SME Google Visibility & Revenue-Leak Grader | Bethelmind',
        description: 'Discover how much revenue your business loses without an official mobile website and 24/7 WhatsApp AI closer.',
      },
    };
  }

  if (cleanSlug === 'solar-quote-pro' || cleanSlug === 'solar-quote' || cleanSlug === 'solar-boq') {
    return {
      title: 'Solar Quote Pro Calculator Nigeria — Free Inverter & Battery Sizing Tool Lagos',
      description: 'Calculate exact solar inverter, load requirement, and battery backup pricing in 2 minutes. Free interactive solar sizing & PDF quote generator for Nigerian installers and property owners.',
      openGraph: {
        title: 'Solar Quote Pro Calculator Nigeria — Free Solar Sizing & PDF Quote Generator',
        description: 'Instant load sizing, battery requirement calculation, and installer quote matching across Lagos, Abuja, & Port Harcourt.',
      },
    };
  }

  const formattedTitle = (cleanSlug || 'tool').replace(/-/g, ' ').toUpperCase();
  return {
    title: `Free ${formattedTitle} Business Tool | Bethelmind Digital Solutions Nigeria`,
    description: `Free standalone business automation calculator, instant PDF quote generator, and interactive lead tool for ${formattedTitle} in Nigeria. Share on WhatsApp or bookmark for instant use.`,
  };
}

export default async function StandaloneToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const cleanSlug = (slug || '').replace(/\.html$/i, '');

  if (cleanSlug === 'integrations') {
    return <IntegrationBlueprintDashboard />;
  }

  // 🚀 Check if this matches one of our 12 Viral Interactive Tools
  if (VIRAL_TOOLS[cleanSlug]) {
    const tool = VIRAL_TOOLS[cleanSlug];
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Tools
            </Link>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                {tool.badge}
              </span>
              <a
                href={`/calc/${tool.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700"
              >
                <span>Full-Screen View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-5xl w-full mx-auto p-2 sm:p-6 flex flex-col">
          <div className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative" style={{ minHeight: '880px' }}>
            <iframe 
              src={`/calc/${tool.file}`} 
              title={tool.title}
              className="w-full h-full border-0 absolute inset-0"
              style={{ width: '100%', height: '100%', minHeight: '880px' }}
            />
          </div>
        </div>
      </main>
    );
  }

  const detectedCategory = slugToCategory(cleanSlug);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <WebappToolActionBar currentTool={(cleanSlug || 'tool').replace('-', ' ')} />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <Link
              href="/tools"
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
                <span>{(cleanSlug || 'tool').replace('-', ' ')} Tool</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/tools"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg"
            >
              Explore All Tools &rarr;
            </Link>
          </div>
        </div>

        {cleanSlug === 'recruitment' ? (
          <RecruitmentEngineWidget />
        ) : (
          <SectorToolsWidget businessCategory={detectedCategory} />
        )}
      </div>

      <CustomerAiAgentWidget
        sector={(cleanSlug || 'tool').replace(/-/g, ' ')}
        agentTitle={`Bethel — Your ${(cleanSlug || 'tool').replace(/-/g, ' ').toUpperCase()} AI Guide`}
      />
    </main>
  );
}
