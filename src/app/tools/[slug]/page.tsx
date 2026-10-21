import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Share2, ShieldCheck } from 'lucide-react';
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

export async function generateStaticParams() {
  return [
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
  
  if (slug === 'website-grader' || slug === 'google-visibility' || slug === 'sme-grader') {
    return {
      title: 'Nigerian SME Google Visibility & Revenue-Leak Grader — Free Digital Audit',
      description: 'Audit your Google search presence, competitor ad poaching risk, and WhatsApp reply latency in 10 seconds. Free instant mobile website prototype for Nigerian SMEs.',
      openGraph: {
        title: 'Nigerian SME Google Visibility & Revenue-Leak Grader | Bethelmind',
        description: 'Discover how much revenue your business loses without an official mobile website and 24/7 WhatsApp AI closer.',
      },
    };
  }

  if (slug === 'solar-quote-pro' || slug === 'solar-quote' || slug === 'solar-boq') {
    return {
      title: 'Solar Quote Pro Calculator Nigeria — Free Inverter & Battery Sizing Tool Lagos',
      description: 'Calculate exact solar inverter, load requirement, and battery backup pricing in 2 minutes. Free interactive solar sizing & PDF quote generator for Nigerian installers and property owners.',
      openGraph: {
        title: 'Solar Quote Pro Calculator Nigeria — Free Solar Sizing & PDF Quote Generator',
        description: 'Instant load sizing, battery requirement calculation, and installer quote matching across Lagos, Abuja, & Port Harcourt.',
      },
    };
  }

  if (slug === 'salon-booking' || slug === 'beauty') {
    return {
      title: '24/7 Salon Booking & No-Show Deposit Lock Engine Nigeria — Free Stylist Slot Calculator',
      description: 'Automate salon appointments, hair extension pricing, stylist slot booking, and fake-alert-proof 25% deposit locks on WhatsApp.',
      openGraph: {
        title: '24/7 Salon Booking & Deposit Lock Engine Nigeria',
        description: 'Eliminate empty stylist chairs and fake alerts with instant WhatsApp booking and OPay/Moniepoint deposit locks.',
      },
    };
  }

  if (slug === 'lagos-lead-harvester' || slug === 'leads') {
    return {
      title: 'Lagos B2B Lead Harvester — Verified Nigerian Business Contact Database',
      description: 'Access 10,000+ verified decision-maker business contacts, WhatsApp numbers, and emails across Ikeja, Lekki, Victoria Island, and 27 Lagos districts.',
      openGraph: {
        title: 'Lagos B2B Lead Harvester — Verified Business Contacts Database',
        description: 'Instant access to active Nigerian business leads and decision-maker contact details.',
      },
    };
  }

  if (slug === 'whatsapp-voice-notes' || slug === 'voice-notes') {
    return {
      title: 'Nigerian WhatsApp Voice Note Generator — Automated Audio Outreach NG',
      description: 'Convert text sales messages into realistic Nigerian accent audio voice notes for WhatsApp sales automation. Boost reply rates by 4x.',
      openGraph: {
        title: 'Nigerian WhatsApp Voice Note Generator — Bethelmind Digital Solutions',
        description: 'Human-like Nigerian voice note automation for WhatsApp CRM and lead qualification.',
      },
    };
  }

  if (slug === 'integrations') {
    return {
      title: 'Seamless Web & CRM Integration Blueprint | Bethelmind Digital Solutions Automation Suite',
      description: 'Connect platform lead generation tools, Meta CAPI, GA4, WhatsApp API, and Paystack/Moniepoint webhooks to any website or business app in under 60 seconds.',
    };
  }

  const formattedTitle = (slug || 'tool').replace(/-/g, ' ').toUpperCase();
  return {
    title: `Free ${formattedTitle} Business Tool | Bethelmind Digital Solutions Nigeria`,
    description: `Free standalone business automation calculator, instant PDF quote generator, and interactive lead tool for ${formattedTitle} in Nigeria. Share on WhatsApp or bookmark for instant use.`,
  };
}

export default async function StandaloneToolPage({ params }: ToolPageProps) {
  const { slug } = await params;

  if (slug === 'integrations') {
    return <IntegrationBlueprintDashboard />;
  }

  const detectedCategory = slugToCategory(slug);

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
          <SectorToolsWidget businessCategory={detectedCategory} />
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
