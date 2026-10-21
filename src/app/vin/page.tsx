import React from 'react';
import { Metadata } from 'next';
import { VinCheckerClient } from '@/components/vin/VinCheckerClient';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export const metadata: Metadata = {
  title: 'Tokunbo VIN Car History & Customs Duty Checker Nigeria | Bethelmind',
  description:
    'Decode any 17-character VIN in seconds. Check US Copart/IAAI salvage auction damage, Texas/Florida hurricane flood risks, Nigeria Customs Service (NCS) clearing tariffs, and printable pre-purchase inspection checklists.',
  openGraph: {
    title: 'Tokunbo VIN Car History & Customs Duty Checker Nigeria | Bethelmind',
    description:
      'Check US salvage records, flood corridor damage, open safety recalls, and Lagos fair market valuations before wiring car payments.',
    url: 'https://www.bethelmindanalytics.com/vin',
    siteName: 'Bethelmind Digital Solutions',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Tokunbo VIN Checker Nigeria',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
};

export default function VinPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />
      <div className="pt-24 pb-16 flex-grow">
        <VinCheckerClient />
      </div>
      <Footer />
    </main>
  );
}
