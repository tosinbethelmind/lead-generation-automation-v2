import React from 'react';
import { Metadata } from 'next';
import { ArbitrageClient } from '@/components/arbitrage/ArbitrageClient';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export const metadata: Metadata = {
  title: 'P2P FX Arbitrage Alert Desk & Spread Terminal | Bethelmind',
  description:
    'Real-time P2P FX & crypto spread terminal for Nigerian traders. Compare Binance P2P, Bybit, BDC parallel street rate, and NAFEM official windows with automated profit sizing and Telegram signals.',
  openGraph: {
    title: 'P2P FX Arbitrage Alert Desk & Dollar Spread Terminal | Bethelmind',
    description:
      'Live crypto and USD/NGN arbitrage spread scanner with profit calculator and Telegram VIP signal stream.',
    url: 'https://www.bethelmindanalytics.com/arbitrage',
    siteName: 'Bethelmind Digital Solutions',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'P2P Arbitrage Alert Desk Nigeria',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
};

export default function ArbitragePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />
      <div className="pt-24 pb-16 flex-grow">
        <ArbitrageClient />
      </div>
      <Footer />
    </main>
  );
}
