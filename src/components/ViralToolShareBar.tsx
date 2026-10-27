'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageCircle, 
  Copy, 
  Check, 
  Share2, 
  Globe, 
  Flame, 
  ShieldCheck, 
  Gift, 
  FileCheck2, 
  ArrowRight, 
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

export interface ViralShareProps {
  toolTitle: string;
  toolSlug: string;
  summaryText: string;
  highlights?: { label: string; value: string }[];
  category?: string;
  hideDisclaimer?: boolean;
}

export const ViralToolShareBar: React.FC<ViralShareProps> = ({
  toolTitle,
  toolSlug,
  summaryText,
  highlights = [],
  category = 'Commercial Tools',
  hideDisclaimer = false,
}) => {
  const [copiedNairaland, setCopiedNairaland] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [unlockedFree, setUnlockedFree] = useState(false);

  const cleanSlug = toolSlug.replace(/^\/+tools\/?/, '').replace(/^\/+/, '');
  const toolUrl = `https://www.bethelmindanalytics.com/tools/${cleanSlug}`;

  // WhatsApp Viral Text
  const waHighlights = highlights.length > 0 
    ? highlights.map(h => `• *${h.label}:* ${h.value}`).join('\n')
    : `• ${summaryText}`;

  const whatsAppShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `*${toolTitle} — 2026 Nigerian Cost, ROI & Fraud Breakdown*\n\n` +
    `${waHighlights}\n\n` +
    `Test your own exact property or business calculation free on your phone:\n` +
    `${toolUrl}\n\n` +
    `_Verified by Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise (Reg: 9912717))_`
  )}`;

  // Sector Specific Free Lead Magnets
  const getFreeLeadMagnet = () => {
    const slug = cleanSlug.toLowerCase();
    if (slug.includes('solar')) {
      return {
        title: 'FREE 2026 Nigerian Solar Buyer’s Shield & Fake Battery Detector',
        desc: 'Detect rebranded lead-acid batteries, undersized DC cables, and inverter surge traps before paying installers.',
        waText: 'Please send me the FREE 2026 Solar Buyer\'s Shield & Component Inspection Guide (PDF)'
      };
    } else if (slug.includes('vin') || slug.includes('auto') || slug.includes('duty')) {
      return {
        title: 'FREE 2026 NCS Single-Sheet Customs Valuation Matrix & FOU Defense Guide',
        desc: 'Statutory 20% duty + 15% NAC levy sheets and how to avoid Customs FOU highway interception.',
        waText: 'Please send me the FREE 2026 NCS Customs Valuation Sheet and FOU Highway Defense Checklist'
      };
    } else if (slug.includes('alert') || slug.includes('dva') || slug.includes('transfer')) {
      return {
        title: 'FREE Cashier Counter Anti-Fraud Defense Poster & NIBSS Protocol',
        desc: 'Printable counter poster protecting cashiers against fake SMS alerts, USSD reversals, and photoshopped slips.',
        waText: 'Please send me the FREE Cashier Counter Anti-Fraud Defense Poster and NIBSS Verification Protocol'
      };
    } else if (slug.includes('school') || slug.includes('education')) {
      return {
        title: 'FREE Private School Bursary Debt Recovery Script & WhatsApp Templates',
        desc: 'Proven, polite fee recovery WhatsApp scripts that eliminate 85% of term tuition defaults.',
        waText: 'Please send me the FREE Private School Bursary Debt Recovery Script & WhatsApp Reminder Pack'
      };
    } else if (slug.includes('mortgage') || slug.includes('building') || slug.includes('estate')) {
      return {
        title: 'FREE Q4 2026 Lagos Building Material Price Index & Site Fraud Guide',
        desc: 'Real-time landed rates for Dangote cement, 16mm/12mm TMT rebar, sharp sand, and tipper truck checks.',
        waText: 'Please send me the FREE Q4 2026 Lagos Building Material Price Index and Site Engineer Fraud Guide'
      };
    }
    return {
      title: 'FREE 2026 Nigerian B2B Speed-to-Lead & WhatsApp Catalog Playbook',
      desc: 'How to close 3x more customers on WhatsApp within 3 seconds using automated quoting and payment verification.',
      waText: `Please send me the FREE 2026 WhatsApp Conversion & Revenue Growth Playbook for ${toolTitle}`
    };
  };

  const leadMagnet = getFreeLeadMagnet();
  const leadMagnetWaUrl = `https://wa.me/2348022791227?text=${encodeURIComponent(leadMagnet.waText)}`;

  // Nairaland BBCode Post
  const nairalandBullets = highlights.length > 0
    ? highlights.map(h => `[b]• ${h.label}:[/b] ${h.value}`).join('\n')
    : `[b]• Result:[/b] ${summaryText}`;

  const nairalandBBCode = `[b]${toolTitle} — 2026 Cost & Tariff Breakdown (Nigeria)[/b]

[quote]
${nairalandBullets}
[/quote]

Instead of guessing or arguing with contractors/agents, you can run your exact property numbers or vehicle VIN on this live calculator in 30 seconds:

[url=${toolUrl}][b]Click Here to Test the Free ${toolTitle} (No Login Required)[/b][/url]

[i]Source: Bethelmind Digital Solutions (CAC Certified Enterprise (Reg: 9912717) CAC Certified Enterprise (Reg: 9912717))[/i]`;

  const copyNairalandBBCode = () => {
    navigator.clipboard.writeText(nairalandBBCode);
    setCopiedNairaland(true);
    setTimeout(() => setCopiedNairaland(false), 2500);
  };

  const copyCleanSummary = () => {
    const text = `${toolTitle} Summary:\n${summaryText}\nTest your numbers free: ${toolUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const copyDirectLink = () => {
    navigator.clipboard.writeText(toolUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareToUnlock = () => {
    window.open(whatsAppShareUrl, '_blank');
    setUnlockedFree(true);
  };

  return (
    <div className="mt-6 pt-5 border-t border-white/10 space-y-4">

      {/* ─── 1. TROJAN HORSE FREE LEAD MAGNET BANNER ─── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0a121e] to-emerald-950/30 border border-emerald-500/35 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-emerald-950/40">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
            <Gift className="w-3 h-3 text-emerald-400" />
            <span>100% Free WhatsApp Download</span>
          </div>
          <h4 className="text-sm font-semibold text-emerald-100 flex items-center gap-1.5 pt-0.5">
            {leadMagnet.title}
          </h4>
          <p className="text-xs text-slate-300 font-light leading-relaxed max-w-xl">
            {leadMagnet.desc}
          </p>
        </div>
        <a
          href={leadMagnetWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/25 shrink-0 active:scale-95 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Claim Free on WhatsApp →</span>
        </a>
      </div>

      {/* ─── 2. VIRAL SHARE & UNLOCK BAR ─── */}
      <div className="p-4 rounded-xl bg-[#070b14] border border-white/[0.08] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[#d4af37] font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>1-Tap Viral Distribution & Free Stamped Certificate Unlock:</span>
          </div>
          <span className="text-[11px] text-slate-400">Share with colleagues or clients on WhatsApp</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* 1. Share to WhatsApp to Unlock Free */}
          <button
            type="button"
            onClick={handleShareToUnlock}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{unlockedFree ? '✓ Unlocked via WhatsApp' : 'Share to Unlock Free →'}</span>
          </button>

          {/* 2. Nairaland BBCode 1-Tap Copy */}
          <button
            type="button"
            onClick={copyNairalandBBCode}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 transition-all shadow-md active:scale-95 cursor-pointer"
            title="Copies BBCode formatted for Nairaland Auto, Properties, or Investment sections"
          >
            {copiedNairaland ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-emerald-400" />}
            <span>{copiedNairaland ? 'Nairaland Post Copied' : 'Copy Nairaland Post'}</span>
          </button>

          {/* 3. Copy Summary Receipt */}
          <button
            type="button"
            onClick={copyCleanSummary}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-white/10 transition-all active:scale-95 cursor-pointer"
          >
            {copiedText ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copiedText ? 'Summary Copied' : 'Copy Summary'}</span>
          </button>

          {/* 4. Copy Direct Tool Link */}
          <button
            type="button"
            onClick={copyDirectLink}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#d4af37] bg-slate-900 hover:bg-slate-800 border border-[#d4af37]/30 transition-all active:scale-95 cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Globe className="w-4 h-4 text-[#d4af37]" />}
            <span>{copiedLink ? 'Link Copied' : 'Copy Direct URL'}</span>
          </button>
        </div>
      </div>

      {/* ─── 3. B2B SME TURNKEY WEBSITE UPSELL CARD ─── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#070b14] via-[#121829] to-[#070b14] border border-[#d4af37]/35 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-black/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Turnkey Business Growth Engine for SMEs</span>
          </div>
          <h4 className="text-sm sm:text-base font-serif font-normal text-[#f5f3ef]">
            Are You an SME Business Owner? Competitors Are Stealing Your Google Searches
          </h4>
          <p className="text-xs text-[#c9c4bc] font-light leading-relaxed max-w-xl">
            Launch your own live <strong className="text-[#f5f3ef] font-medium">Official Mobile Website + 24/7 AI WhatsApp Sales Closer</strong> in 15 minutes. Low-friction Starter Activation at <strong className="text-[#d4af37] font-semibold">₦35,000</strong> (or ₦25,000/mo) with Moniepoint settlements.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <a
            href="https://wa.me/2348022791227?text=Hello%20Bethelmind,%20I%20am%20a%20business%20owner%20and%20want%20to%20activate%20my%20turnkey%20website%20and%20WhatsApp%20Closer%20(₦35,000%20Starter%20Go-Live)"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#070b14] bg-[#d4af37] hover:bg-[#e5c158] transition shadow-md shadow-[#d4af37]/20 cursor-pointer"
          >
            <span>Activate for ₦35,000 →</span>
          </a>
        </div>
      </div>

      {/* Statutory Disclaimer & Legal Liability Notice */}
      {!hideDisclaimer && (
        <aside aria-label="Statutory Disclaimer" className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] leading-relaxed text-slate-400 space-y-1.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="uppercase tracking-wider text-[10px] text-[#d4af37] font-bold">
                Statutory Notice & Algorithmic Approximation Disclaimer
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">CAC Certified Enterprise (Reg: 9912717) • Moniepoint MFB 6805375225</span>
          </div>
          <p>
            Calculations generated by this tool are automated algorithmic approximations for preliminary budgeting and operational planning only. Bethelmind Digital Solutions provides enterprise software, quotation engines, and customer communication automation; we do not provide certified COREN engineering blueprints, statutory customs clearance assessments, licensed legal title opinions, medical diagnosis, or chartered tax advice. Final binding contracts, tariff settlements, and structural blueprints require verified on-site professional consultation.
          </p>
          <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400 flex-wrap border-t border-slate-800/80">
            <span className="font-semibold text-slate-300">Governed by:</span>
            <Link href="/legal/disclaimer" className="text-[#d4af37] hover:underline" target="_blank">
              Sector Tools Disclaimer
            </Link>
            <span>·</span>
            <Link href="/legal/terms" className="text-[#d4af37] hover:underline" target="_blank">
              Terms of Service
            </Link>
            <span>·</span>
            <Link href="/legal/privacy" className="text-[#d4af37] hover:underline" target="_blank">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/legal/delivery" className="text-[#d4af37] hover:underline" target="_blank">
              Delivery & Handover SLA
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
};
