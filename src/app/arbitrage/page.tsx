import React from 'react';
import InstitutionalArbitrageLanding from '@/components/arbitrage/InstitutionalArbitrageLanding';

export const metadata = {
  title: 'Institutional B2B FX & China Factory Escrow Desk | Bethelmind Analytics Lagos',
  description: 'Guaranteed wholesale FX floor rates, 100% CBN-regulated escrow clearing vault, and < 15-min Swift MT103 confirmation to China factories.'
};

export default function ArbitrageMainPage() {
  return (
    <main className="min-h-screen bg-[#060913] text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-emerald-500 selection:text-black">
      <InstitutionalArbitrageLanding />
    </main>
  );
}
