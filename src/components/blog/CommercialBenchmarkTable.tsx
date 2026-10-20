'use client';

import React from 'react';
import { MASTER_PAYOUT } from '@/data/monetizationCatalog';

interface Props {
  category: string;
  postTitle: string;
}

export const CommercialBenchmarkTable: React.FC<Props> = ({ category, postTitle }) => {
  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mb-12">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              2026 Nigerian Operational Benchmark Matrix
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Sector: <strong className="text-slate-300">{category}</strong>
          </span>
        </div>

        <h4 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
          Traditional Manual Workflow vs. Bethelmind Automated System
        </h4>
        <p className="text-xs text-slate-400 mb-6">
          Quantified operational performance metrics based on audited Lagos &amp; Nigeria commercial deployments:
        </p>

        {/* Responsive Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Operational Factor</th>
                <th className="py-3 px-4 text-red-400 bg-red-950/20 rounded-t-lg">Manual / Legacy Method</th>
                <th className="py-3 px-4 text-amber-300 bg-amber-950/30 rounded-t-lg">Bethelmind AI System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">First Response Time (Speed-to-Lead)</td>
                <td className="py-3 px-4 text-slate-400 bg-red-950/10">35 – 90 mins (Customer already left)</td>
                <td className="py-3 px-4 text-emerald-400 bg-amber-950/20 font-bold">&lt; 3 seconds (24/7 WhatsApp AI)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Payment &amp; Transfer Verification</td>
                <td className="py-3 px-4 text-slate-400 bg-red-950/10">Paper teller slips (Fake Alert Risk)</td>
                <td className="py-3 px-4 text-emerald-400 bg-amber-950/20 font-bold">Real-Time Moniepoint NIP Webhook</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">After-Hours Sales Conversion</td>
                <td className="py-3 px-4 text-slate-400 bg-red-950/10">0% (Office shut after 6:00 PM)</td>
                <td className="py-3 px-4 text-emerald-400 bg-amber-950/20 font-bold">100% Automated Quotes &amp; Orders</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Estimated Monthly Revenue Leak</td>
                <td className="py-3 px-4 text-red-400 bg-red-950/10 font-bold">₦120,000 – ₦450,000+</td>
                <td className="py-3 px-4 text-emerald-400 bg-amber-950/20 font-bold">₦0 (100% captured &amp; logged)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Implementation Cost &amp; Timeline</td>
                <td className="py-3 px-4 text-slate-400 bg-red-950/10">₦400k+ &amp; 3 to 6 weeks delay</td>
                <td className="py-3 px-4 text-amber-300 bg-amber-950/20 font-bold">₦35,000 Starter / Live in 48h</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Action Footer */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            Want this automated workflow deployed on your business domain this week?
          </span>
          <a
            href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+saw+the+Benchmark+Matrix+for+${encodeURIComponent(category)}+in+${encodeURIComponent(postTitle)}+and+want+to+automate+my+operations.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shrink-0"
          >
            💬 Talk to Lagos Systems Desk →
          </a>
        </div>
      </div>
    </div>
  );
};
