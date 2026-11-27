import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { ArrowRight, Globe, MessageSquare, BarChart3, ShieldCheck } from 'lucide-react';
import { BRAND_IDENTITY } from '@/lib/commerce/catalog';

const PORTFOLIO_SHOWCASES = [
  {
    division: 'Digital Business Solutions',
    title: 'Solar & Inverter Dealer Web Presence',
    description:
      'Mobile-first SME website with interactive load sizing, service breakdown, and direct WhatsApp quotation capture.',
    href: '/preview/lagos-solar-demo',
    cta: 'View Live Preview',
    icon: Globe,
  },
  {
    division: 'Digital Business Solutions',
    title: 'Clinic & Healthcare Booking Website',
    description:
      'Clean patient-first landing page with service hours, location map, and appointment enquiry capture.',
    href: '/preview/ikeja-clinic-demo',
    cta: 'View Live Preview',
    icon: Globe,
  },
  {
    division: 'Business Automation',
    title: 'WhatsApp Enquiry & Booking Workflow',
    description:
      'Compliant WhatsApp Business Cloud API routing with automated FAQs, catalogue selection, and staff alerts.',
    href: '/business-automation',
    cta: 'Explore Automation',
    icon: MessageSquare,
  },
  {
    division: 'Business Intelligence',
    title: 'Lagos Corridor Market & Competitor Dossier',
    description:
      'Structured Excel dataset and PDF executive report covering verified local competitors, pricing, and gaps.',
    href: '/business-intelligence',
    cta: 'Explore Intelligence',
    icon: BarChart3,
  },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
      <Navbar />
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{BRAND_IDENTITY.companyName} • Portfolio & Live Demos</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Interactive Previews & Solution Showcases
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Inspect live website prototypes, automation workflows, and intelligence deliverables built for Nigerian businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PORTFOLIO_SHOWCASES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6 hover:border-[#d4af37]/40 transition"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                    <Icon className="w-4 h-4" />
                    <span>{item.division}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{item.title}</h2>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
                </div>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#d4af37] hover:underline"
                >
                  <span>{item.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
