'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckSquare, Square, X, ArrowRight, ShieldCheck, Zap, Lock, Info } from 'lucide-react';

interface FeatureItem {
  id: string;
  name: string;
  priceFormatted: string;
  priceNumeric: number;
  narration: string;
  icon: string;
  badge?: string;
  isDefaultActive?: boolean;
}

const SHOWCASE_FEATURES: FeatureItem[] = [
  {
    id: 'ai_appointment_setter',
    name: '24/7 AI Appointment Setter & Google Calendar Sync',
    priceFormatted: '+₦40,000',
    priceNumeric: 40000,
    narration: 'Checks your live availability and books confirmed customer appointment slots 24/7 on autopilot.',
    icon: '📅',
    badge: '👑 #1 Seller',
    isDefaultActive: true,
  },
  {
    id: 'voice_ai_caller',
    name: 'Conversational Voice AI Phone Calling Agent',
    priceFormatted: '+₦75,000',
    priceNumeric: 75000,
    narration: 'Physically answers incoming calls and makes outbound sales calls in natural Pidgin & English.',
    icon: '📞',
    badge: '👑 Enterprise Hero',
    isDefaultActive: false,
  },
  {
    id: 'voice_note_ai',
    name: 'WhatsApp AI Voice Note Transcriber & Audio Responder',
    priceFormatted: '+₦45,000',
    priceNumeric: 45000,
    narration: '75%+ of buyers send WhatsApp voice notes. Your AI transcribes their audio and replies instantly in English or Pidgin.',
    icon: '🎙️',
    badge: '🔥 Top Demanded',
    isDefaultActive: true,
  },
  {
    id: 'human_escalation',
    name: 'WhatsApp Human Escalation Alert ("Hot Deal Alert")',
    priceFormatted: '+₦35,000',
    priceNumeric: 35000,
    narration: 'Triggers instant red WhatsApp alert to your personal phone the second a high-ticket customer is ready to pay.',
    icon: '🚨',
    badge: '🚨 Fast Deal Closer',
    isDefaultActive: true,
  },
  {
    id: 'pidgin_local_ai',
    name: 'English + Pidgin + Yoruba + Hausa AI Switcher',
    priceFormatted: '+₦25,000',
    priceNumeric: 25000,
    narration: '1-tap AI language toggle to communicate effortlessly with every customer across Nigeria.',
    icon: '🇳🇬',
    isDefaultActive: false,
  },
  {
    id: 'installment_drip',
    name: 'Automated Payment & Installment Drip Reminders',
    priceFormatted: '+₦35,000',
    priceNumeric: 35000,
    narration: 'Chases monthly or termly payment due dates automatically on WhatsApp with direct OPay transfer links.',
    icon: '💳',
    isDefaultActive: false,
  },
  {
    id: 'virtual_inspection',
    name: 'Instant WebRTC 1-Click Virtual Inspection Call',
    priceFormatted: '+₦50,000',
    priceNumeric: 50000,
    narration: '1-click browser video call for virtual property tours or consultation without Zoom downloads.',
    icon: '📹',
    isDefaultActive: false,
  },
  {
    id: 'cac_nin_shield',
    name: 'CAC Registration & NIN Identity Verification Shield',
    priceFormatted: '+₦30,000',
    priceNumeric: 30000,
    narration: 'Verifies customer CAC RC numbers and NIN identity on booking forms to block scammers.',
    icon: '🛡️',
    isDefaultActive: false,
  },
  {
    id: 'google_review',
    name: '1-Tap Google Review 5-Star Auto-Requester',
    priceFormatted: '+₦25,000',
    priceNumeric: 25000,
    narration: 'Automated 24h WhatsApp follow-up asking happy customers for 5-star Google Map reviews.',
    icon: '⭐',
    isDefaultActive: true,
  },
  {
    id: 'multi_agent_router',
    name: 'WhatsApp Multi-Agent Round-Robin Lead Router',
    priceFormatted: '+₦20,000',
    priceNumeric: 20000,
    narration: 'Rotates incoming sales chats fairly across 2 or more staff members so no lead is delayed.',
    icon: '👥',
    isDefaultActive: false,
  },
  {
    id: 'social_media_management',
    name: 'AI Social Media Content & Account Manager',
    priceFormatted: '+₦125,000/mo',
    priceNumeric: 125000,
    narration: '30-day AI post calendar auto-publisher for Instagram, Facebook, TikTok, LinkedIn & X with Pidgin/English tones.',
    icon: '📱',
    badge: '🚀 Organic Viral Engine',
    isDefaultActive: true,
  },
  {
    id: 'recruitment_engine',
    name: '⚡ 24-Hour Instant AI Recruitment Engine',
    priceFormatted: '+₦95,000',
    priceNumeric: 95000,
    narration: 'Hire vetted, top 5% professional candidates in under 24 hours. Features WhatsApp audio voice note screening, 1-ms AI CV grading (0-100%), and 1-tap interview booking.',
    icon: '⚡',
    badge: '⚡ 24H Instant Hire',
    isDefaultActive: true,
  },
  {
    id: 'ad_automation',
    name: 'AI Meta & Google Ad Campaign Launcher',
    priceFormatted: '+₦195,000/mo',
    priceNumeric: 195000,
    narration: '1-click Meta Lead Ads & Google Search Ads launcher with target audience AI modeling and direct WhatsApp lead routing.',
    icon: '🎯',
    badge: '👑 Paid Sales Booster',
    isDefaultActive: true,
  },
  {
    id: 'branded_pdf_invoice',
    name: 'Instant Branded PDF Proposal & Invoice Generator',
    priceFormatted: '+₦25,000',
    priceNumeric: 25000,
    narration: 'Generates instant downloadable PDF quotes w/ your logo, CAC info & OPay transfer details.',
    icon: '📄',
    isDefaultActive: true,
  },
  {
    id: 'social_proof_toast',
    name: 'Live Social Proof & FOMO Urgency Toast Widget',
    priceFormatted: '+₦15,000',
    priceNumeric: 15000,
    narration: 'Renders notification toasts ("Chidi from Ikeja just booked 3 mins ago") to boost sales.',
    icon: '⚡',
    isDefaultActive: true,
  },
];

interface ShowcaseProps {
  businessName: string;
  leadId: string;
}

export function InteractiveFeatureShowcaseModal({ businessName, leadId }: ShowcaseProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    SHOWCASE_FEATURES.filter(f => f.isDefaultActive).map(f => f.id)
  );

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addonsTotal = selectedFeatures.reduce((sum, id) => {
    const item = SHOWCASE_FEATURES.find(f => f.id === id);
    return sum + (item ? item.priceNumeric : 0);
  }, 0);

  const basePackagePrice = 285000; // Business Growth & AI default
  const grandTotal = basePackagePrice + addonsTotal;

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-extrabold flex items-center gap-2 hover:scale-105 transition-all border border-white/20"
      >
        <Sparkles className="w-4 h-4" /> Customize Features for {businessName} ({selectedFeatures.length} Active)
      </button>
    );
  }

  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-slate-950 border border-[#06b6d4]/40 p-4 rounded-2xl shadow-2xl max-w-sm text-slate-100 flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-slate-400 block">Features Selected: {selectedFeatures.length}</span>
          <span className="text-sm font-bold text-emerald-400">Total: ₦{grandTotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMinimized(false)}
            className="px-3 py-1.5 bg-[#06b6d4] text-slate-950 text-xs font-bold rounded-lg"
          >
            Expand
          </button>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-white/10 rounded-3xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl my-8 relative">
        {/* Close & Minimize controls */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div>
            <span className="text-[10px] font-bold text-[#06b6d4] uppercase tracking-wider block mb-0.5">
              Interactive Feature Selector
            </span>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#06b6d4]" /> Customize AI Features for {businessName}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMinimized(true)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-300"
            >
              Minimize
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Tap any feature to <strong className="text-white">ADD</strong> or <strong className="text-slate-400">REMOVE</strong> it from your website. Your total price updates live below.
        </p>

        {/* Feature List Grid */}
        <div className="max-h-[50vh] overflow-y-auto pr-2 flex flex-col gap-3 mb-6">
          {SHOWCASE_FEATURES.map((feat) => {
            const isChecked = selectedFeatures.includes(feat.id);
            return (
              <div
                key={feat.id}
                onClick={() => toggleFeature(feat.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isChecked
                    ? 'bg-slate-900 border-[#06b6d4]/60 shadow-md shadow-[#06b6d4]/5'
                    : 'bg-slate-950/40 border-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="mt-0.5">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-[#06b6d4]" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{feat.icon}</span> {feat.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#10b981] shrink-0">{feat.priceFormatted}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{feat.narration}</p>
                  {feat.badge && (
                    <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 mt-1">
                      {feat.badge}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Summary Bar & Claim Action */}
        <div className="bg-slate-900 border border-[#06b6d4]/30 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-[11px] text-slate-400 block">
              Base Package + {selectedFeatures.length} Add-Ons:
            </span>
            <span className="text-xl font-extrabold text-emerald-400">
              ₦{grandTotal.toLocaleString()}
            </span>
          </div>

          <Link
            href={`/handover/${leadId}`}
            className="px-6 py-3 bg-gradient-to-r from-[#06b6d4] to-[#10b981] text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-[#06b6d4]/20 flex items-center gap-2 hover:opacity-90 transition-all"
          >
            Claim Website & Launch Selected Features <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
