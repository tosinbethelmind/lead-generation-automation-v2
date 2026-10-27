'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  MessageCircle, 
  Download, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  Building2, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export interface WhatsAppLeadMagnetProps {
  toolSlug: string;
  category: string;
  title: string;
}

interface MagnetConfig {
  hookTitle: string;
  hookBadge: string;
  hookDescription: string;
  deliverables: string[];
  ctaButtonText: string;
  whatsappMessage: string;
  urgencyText: string;
}

const MAGNET_MAP: Record<string, MagnetConfig> = {
  'solar-boq': {
    hookBadge: '2026 Alaba & Trade Fair Wholesale Directory',
    hookTitle: 'Get The Audited Alaba Solar Wholesale Price Sheet & Direct Supplier Contacts',
    hookDescription: 'Stop paying ₦8.5M for a 5kVA setup. Get the confidential component procurement sheet with direct phone numbers of verified Tier-1 Growatt/Deye importers and CATL lithium battery distributors at Alaba International Market.',
    deliverables: [
      'Alaba & Trade Fair Wholesale Contact Directory (Direct Importers)',
      'Tier-1 51.2V 200Ah LiFePO4 Cell Verification Checklist (Detect B-Grade Cells)',
      'DisCo Band A Prepaid Meter Overbilling Audit Formula',
      'Instant Printable PDF Proposal Template'
    ],
    ctaButtonText: 'Send Price Sheet to My WhatsApp (Free)',
    whatsappMessage: 'Hello Bethelmind! I just tested the Solar BOQ Calculator on your website. Please send me the 2026 Alaba Wholesale Supplier Directory & Tier-1 LiFePO4 Price Sheet on WhatsApp.',
    urgencyText: 'Official 2026 Edition · 100% Free · Delivered in < 15 seconds'
  },
  'solar-quote-pro': {
    hookBadge: '2026 Alaba & Trade Fair Wholesale Directory',
    hookTitle: 'Get The Audited Alaba Solar Wholesale Price Sheet & Direct Supplier Contacts',
    hookDescription: 'Stop paying ₦8.5M for a 5kVA setup. Get the confidential component procurement sheet with direct phone numbers of verified Tier-1 Growatt/Deye importers and CATL lithium battery distributors at Alaba International Market.',
    deliverables: [
      'Alaba & Trade Fair Wholesale Contact Directory (Direct Importers)',
      'Tier-1 51.2V 200Ah LiFePO4 Cell Verification Checklist (Detect B-Grade Cells)',
      'DisCo Band A Prepaid Meter Overbilling Audit Formula',
      'Instant Printable PDF Proposal Template'
    ],
    ctaButtonText: 'Send Price Sheet to My WhatsApp (Free)',
    whatsappMessage: 'Hello Bethelmind! I just tested the Solar BOQ Calculator on your website. Please send me the 2026 Alaba Wholesale Supplier Directory & Tier-1 LiFePO4 Price Sheet on WhatsApp.',
    urgencyText: 'Official 2026 Edition · 100% Free · Delivered in < 15 seconds'
  },
  'tokunbo-duty': {
    hookBadge: 'NCS 2026 Road Interception Alert',
    hookTitle: 'Get The NCS VIN Valuation Matrix & FOU Road Interception Clearance Sheet',
    hookDescription: 'Avoid having your imported vehicle seized on the Benin-Ore or Lagos-Ibadan expressway. Get the official Nigeria Customs Service (NCS) 2026 statutory duty matrix and demurrage waiver checklist before wiring clearing funds.',
    deliverables: [
      'NCS 2026 Single-Sheet Valuation Matrix for Top 40 Tokunbo Models',
      'Federal Operations Unit (FOU) Expressway Inspection Clearance Checklist',
      'PTML Grimaldi & Tin Can Island Terminal Demurrage Schedule',
      'VIN Undervaluation Warning Formula (Detect Corrupt Agent Traps)'
    ],
    ctaButtonText: 'Send Customs Duty Sheet to My WhatsApp (Free)',
    whatsappMessage: 'Hello Bethelmind! I am verifying customs duty on your website. Please send me the NCS 2026 Single-Sheet Valuation Matrix & FOU Road Interception Clearance Checklist on WhatsApp.',
    urgencyText: 'NCS 2026 Official Benchmarks · Delivered Free to WhatsApp'
  },
  'retail-catalog': {
    hookBadge: 'Retail Fraud & Fake Alert Shield',
    hookTitle: 'Download The Weekend Fake Alert Blacklist & Automated Reconciliation Guide',
    hookDescription: 'Stop losing money to weekend screenshot fraud and phantom bank transfers. Get the technical guide on how Lagos supermarkets configure automated Moniepoint & Paystack bank webhooks to confirm real cash before handing over goods.',
    deliverables: [
      'Blacklist of 4 Top Fraudulent Bank Apps Used by Weekend Scammers',
      'Step-by-Step Moniepoint & OPay Automated API Webhook Setup Guide',
      'Staff Cashier Protocol Card to Detect Fake Transfer Slips',
      'POS Network Downtime Emergency Fallback Sheet'
    ],
    ctaButtonText: 'Send Fake Alert Shield to My WhatsApp (Free)',
    whatsappMessage: 'Hello Bethelmind! I want to protect my retail store from fake alerts. Please send me the Weekend Fake Alert Blacklist & Automated Bank Webhook Guide on WhatsApp.',
    urgencyText: 'Retail Theft Prevention · Delivered Free to WhatsApp'
  },
  'bank-reconciliation': {
    hookBadge: 'Retail Fraud & Fake Alert Shield',
    hookTitle: 'Download The Weekend Fake Alert Blacklist & Automated Reconciliation Guide',
    hookDescription: 'Stop losing money to weekend screenshot fraud and phantom bank transfers. Get the technical guide on how Lagos supermarkets configure automated Moniepoint & Paystack bank webhooks to confirm real cash before handing over goods.',
    deliverables: [
      'Blacklist of 4 Top Fraudulent Bank Apps Used by Weekend Scammers',
      'Step-by-Step Moniepoint & OPay Automated API Webhook Setup Guide',
      'Staff Cashier Protocol Card to Detect Fake Transfer Slips',
      'POS Network Downtime Emergency Fallback Sheet'
    ],
    ctaButtonText: 'Send Fake Alert Shield to My WhatsApp (Free)',
    whatsappMessage: 'Hello Bethelmind! I want to protect my retail store from fake alerts. Please send me the Weekend Fake Alert Blacklist & Automated Bank Webhook Guide on WhatsApp.',
    urgencyText: 'Retail Theft Prevention · Delivered Free to WhatsApp'
  },
  'construction-estimator': {
    hookBadge: '2026 Lekki & Ibeju Soil & Price Alert',
    hookTitle: 'Get The Lekki-Epe Soil Piling vs Raft Engineering Guide & Quarry Direct Contacts',
    hookDescription: 'Why are new buildings cracking in Ajah and Sangotedo? Download the geotechnical foundation guide with direct phone numbers of quarry tipper drivers in Ogun and Dangote 42.5R depot distributors.',
    deliverables: [
      'Lekki Phase 1, Ajah & Ibeju Soil Strata & Piling Depth Matrix',
      'Quarry Direct Tipper Contact List (Save ₦35,000 per Granite Trip)',
      'Dangote & BUA 42.5R Direct Depot Pricing & Batch Testing Guide',
      'Site Steel Rod Quality Check (Detect Under-Gauged 16mm Rods)'
    ],
    ctaButtonText: 'Send Quarry Sheet to My WhatsApp (Free)',
    whatsappMessage: 'Hello Bethelmind! I am planning a construction project. Please send me the Lekki-Epe Soil Piling Engineering Guide & Quarry Direct Contact Sheet on WhatsApp.',
    urgencyText: 'Geotechnical Safety Index · Delivered Free to WhatsApp'
  },
  'school-tuition': {
    hookBadge: 'School Fee Recovery Blueprint',
    hookTitle: 'Download The Automated Student Result Gating Setup Blueprint (94% Recovery)',
    hookDescription: 'Eliminate unpaid term fees before the holiday. Learn how top private schools in Lagos and Abuja lock digital report cards behind instant Paystack/Moniepoint parent portals.',
    deliverables: [
      'Step-by-Step Result Gating Blueprint for Private School Proprietors',
      'Parent WhatsApp Payment Reminder Automated Scripts',
      'Automated Moniepoint & Paystack Term Fee Ledger Configuration',
      'Term-End Debt Collection Policy Template'
    ],
    ctaButtonText: 'Send School Blueprint to My WhatsApp (Free)',
    whatsappMessage: 'Hello Bethelmind! I manage a private school. Please send me the Automated Student Result Gating Setup Blueprint on WhatsApp.',
    urgencyText: 'School Financial Recovery · Delivered Free to WhatsApp'
  }
};

export const WhatsAppLeadMagnetModal: React.FC<WhatsAppLeadMagnetProps> = ({
  toolSlug,
  category,
  title
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Fallback config if tool isn't explicitly mapped
  const baseSlug = toolSlug.split('/')[0];
  const config = MAGNET_MAP[baseSlug] || {
    hookBadge: '2026 Commercial Implementation Guide',
    hookTitle: `Download The Audited ${title} Market Specification Sheet`,
    hookDescription: `Get the confidential pricing data, supplier contact directory, and official checklist for ${title} delivered free to your WhatsApp.`,
    deliverables: [
      '2026 Audited Market Pricing Index',
      'Verified Nigerian Supplier & Contractor Contacts',
      'Instant Turnkey Implementation Checklist',
      'Official CAC Certified Proposal Template'
    ],
    ctaButtonText: 'Send Guide to My WhatsApp (Free)',
    whatsappMessage: `Hello Bethelmind! I just tested the ${title} on your website. Please send me the Audited Market Specification Sheet on WhatsApp.`,
    urgencyText: 'Updated for 2026 · Delivered Free to WhatsApp'
  };

  const finalName = userName.trim() || 'Valued Partner';
  const customMessage = `${config.whatsappMessage}\n\n• My Name: ${finalName}${businessName ? `\n• Enterprise: ${businessName.trim()}` : ''}`;
  const waUrl = `https://wa.me/2348022791227?text=${encodeURIComponent(customMessage)}`;

  return (
    <>
      {/* High-Impact Magnet Hook Banner (Inline Callout) */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-cyan-500/15 border-2 border-amber-500/40 p-5 sm:p-7 shadow-[0_15px_40px_rgba(245,158,11,0.15)] relative overflow-hidden space-y-4">
        
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{config.hookBadge}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Free WhatsApp Delivery (No Card Required)</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg sm:text-2xl font-black text-white font-['Outfit'] tracking-tight leading-snug">
            {config.hookTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
            {config.hookDescription}
          </p>
        </div>

        {/* Deliverables Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {config.deliverables.slice(0, 4).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 bg-black/30 px-3 py-2 rounded-xl border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>

        {/* Action Trigger */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-[11px] text-amber-300/80 font-semibold">
            <Sparkles className="w-3 h-3 text-[#d4af37]" /><span>{config.urgencyText}</span>
          </span>

          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            <MessageCircle className="w-5 h-5 fill-slate-950" />
            <span>{config.ctaButtonText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-emerald-500/50 p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>Direct WhatsApp Delivery Desk</span>
                </div>
                <h3 className="text-xl font-black text-white font-['Outfit']">
                  Receive Your Free Confidential Asset
                </h3>
              </div>
              <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
            </div>

            {/* Included in this download */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Delivered Instantly to Your WhatsApp:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {config.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Optional Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Your Full Name or Title:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Engr. Babatunde / Chief Adeleke"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Your Company or Organization (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lekki Solar EPC Ltd / Prime Auto"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* 1-Tap Trigger Button */}
            <div className="pt-2 space-y-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-95 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                <MessageCircle className="w-5 h-5 fill-slate-950" />
                <span>Open WhatsApp & Receive Free Sheet Now →</span>
              </a>

              <p className="text-center text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1.5"><Lock className="w-3 h-3 text-slate-400" /> We respect your privacy. No spam. Direct verification from Bethelmind Digital Solutions (CAC Certified Enterprise (Reg: 9912717)).</span>
              </p>
            </div>

            {/* B2B SME Upgrade Offer */}
            <div className="rounded-2xl bg-cyan-950/40 border border-cyan-500/25 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Are you a business owner or contractor?</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Launch your own branded mobile portal with 24/7 AI WhatsApp closer and OPay/Moniepoint transfer verification in 24 hours (₦35,000 Starter or ₦75,000 Turnkey Suite).
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
