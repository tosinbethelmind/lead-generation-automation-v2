'use client';

import React from 'react';
import { MASTER_PAYOUT } from '@/data/monetizationCatalog';

interface Props {
  category: string;
  postTitle: string;
}

interface BenchmarkRow {
  factor: string;
  legacy: string;
  automated: string;
}

export const CommercialBenchmarkTable: React.FC<Props> = ({ category, postTitle }) => {
  const cat = (category || '').toLowerCase();

  const getRows = (): BenchmarkRow[] => {
    if (cat.includes('beauty') || cat.includes('salon') || cat.includes('spa') || cat.includes('wellness')) {
      return [
        {
          factor: 'Appointment Confirmation',
          legacy: 'Manual phone calls (often unanswered during busy hours)',
          automated: 'Automated 24h WhatsApp confirmation with 1-tap reschedule',
        },
        {
          factor: 'Peak & Weekend Slot Protection',
          legacy: 'Zero commitment; late cancellations leave empty chairs',
          automated: 'Optional commitment deposit locked via instant transfer',
        },
        {
          factor: 'Client Birthday & Loyalty Outreach',
          legacy: 'Manual paper records (rarely followed up)',
          automated: 'Automated VIP birthday perks dispatched 3 days prior',
        },
        {
          factor: 'After-Hours Booking Intake',
          legacy: 'Lost to competitors if client books after 7:00 PM',
          automated: '24/7 calendar availability and appointment intake on WhatsApp',
        },
      ];
    }

    if (cat.includes('clinic') || cat.includes('health') || cat.includes('medical') || cat.includes('hospital')) {
      return [
        {
          factor: 'Patient Consultation Scheduling',
          legacy: 'Manual reception desk triage causing wait-line friction',
          automated: 'Structured pre-consultation intake via WhatsApp in under 3 minutes',
        },
        {
          factor: 'Specialist Consultation No-Shows',
          legacy: 'Unconfirmed appointments causing vacant doctor consultation hours',
          automated: 'Pre-paid consultation deposits confirming attendance',
        },
        {
          factor: 'After-Hours Emergency Triage',
          legacy: 'Unattended calls outside outpatient operating hours',
          automated: 'Automated urgent care triage & priority morning scheduling',
        },
      ];
    }

    if (cat.includes('solar') || cat.includes('clean energy') || cat.includes('inverter')) {
      return [
        {
          factor: 'System Sizing & Quotation',
          legacy: '2 to 4 days delay waiting for an engineer to draft manual BOQ',
          automated: 'Instant automated BOQ load calculation with battery capacity breakdown',
        },
        {
          factor: 'Diesel vs. Solar Financial Model',
          legacy: 'Vague estimates without verifiable tariff payback figures',
          automated: '5-year audited cashflow model benchmarked against Band A tariffs',
        },
        {
          factor: 'Customer Speed-to-Lead',
          legacy: 'Slow inquiry response leading to lost commercial contracts',
          automated: 'Sub-3-second WhatsApp reply with instant equipment specifications',
        },
      ];
    }

    // Default Nigerian SME Operational Model
    return [
      {
        factor: 'First Response Velocity (Speed-to-Lead)',
        legacy: '30 to 90 minutes delay (high prospect abandonment)',
        automated: 'Sub-3-second automated response on WhatsApp 24/7',
      },
      {
        factor: 'Payment & Bank Transfer Verification',
        legacy: 'Manual paper teller slips (vulnerable to fake alert scams)',
        automated: 'Instant Moniepoint/Paystack API webhook verification',
      },
      {
        factor: 'After-Hours Customer Capture',
        legacy: 'Zero sales capacity after office closes at 6:00 PM',
        automated: '100% automated quotation and appointment scheduling overnight',
      },
      {
        factor: 'Administrative Overhead',
        legacy: 'Staff spend 2+ hours daily answering repetitive FAQs',
        automated: 'AI assistant handles 80%+ of initial inquiries automatically',
      },
    ];
  };

  const rows = getRows();

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mb-12">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Illustrative Operational Model
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Sector: <strong className="text-slate-300">{category}</strong>
          </span>
        </div>

        <h4 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
          Manual Workflow vs. Automated System Comparison
        </h4>
        <p className="text-xs text-slate-400 mb-6">
          Illustrative operational framework comparing conventional manual administration with automated workflows:
        </p>

        {/* Responsive Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Operational Factor</th>
                <th className="py-3 px-4 text-rose-400 bg-rose-950/20 rounded-t-lg">Manual Administration</th>
                <th className="py-3 px-4 text-amber-300 bg-amber-950/30 rounded-t-lg">Automated Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 font-semibold text-white">{r.factor}</td>
                  <td className="py-3 px-4 text-slate-400 bg-rose-950/10">{r.legacy}</td>
                  <td className="py-3 px-4 text-emerald-400 bg-amber-950/20 font-semibold">{r.automated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[11px] text-slate-500 italic">
          *Note: Operational improvements depend on appointment volume, deposit policies, and customer demographics. Request a pilot setup to evaluate results for your specific facility.
        </p>
      </div>
    </div>
  );
};
