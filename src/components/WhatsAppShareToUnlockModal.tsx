'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  Share2,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react';

export interface WhatsAppShareToUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolTitle: string;
  toolSlug: string;
  pdfDownloadUrl: string;
  summaryHighlights?: string[];
  reportReferenceCode?: string;
}

export const WhatsAppShareToUnlockModal: React.FC<WhatsAppShareToUnlockModalProps> = ({
  isOpen,
  onClose,
  toolTitle,
  toolSlug,
  pdfDownloadUrl,
  summaryHighlights = [],
  reportReferenceCode = 'BM-VERIFIED-2026'
}) => {
  const [shareCount, setShareCount] = useState<number>(0);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [hasCopiedLink, setHasCopiedLink] = useState<boolean>(false);

  const cleanSlug = toolSlug.replace(/^\/+/, '');
  const toolUrl = `https://www.bethelmindanalytics.com/${cleanSlug}`;

  // Pre-formatted viral copy tailored to maximize click-throughs in Nigerian WhatsApp groups
  const viralMessage = 
    `🚨 *${toolTitle.toUpperCase()} — 2026 AUDITED BREAKDOWN*\n\n` +
    (summaryHighlights.length > 0 ? summaryHighlights.map(h => `✅ ${h}`).join('\n') + '\n\n' : '') +
    `Test your own exact calculation free on your phone (No registration required):\n` +
    `👉 ${toolUrl}\n\n` +
    `_Accredited by Bethelmind Digital Solutions (CAC Reg: 9912717)_`;

  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(viralMessage)}`;

  const handleShareClick = () => {
    // Open WhatsApp in new tab / app
    window.open(waShareUrl, '_blank', 'noopener,noreferrer');
    
    const nextCount = shareCount + 1;
    setShareCount(nextCount);
    if (nextCount >= 3) {
      setIsUnlocked(true);
    }
  };

  const handleBypassUnlock = () => {
    setShareCount(3);
    setIsUnlocked(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(toolUrl);
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-emerald-500/50 p-6 sm:p-7 shadow-[0_20px_50px_rgba(16,185,129,0.3)] space-y-5 text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 border-b border-white/10 pb-4 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>CAC Accredited Certificate (Reg: 9912717)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] tracking-tight">
            {isUnlocked ? '🎉 Certificate Unlocked!' : 'Unlock Your Official Stamped PDF'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isUnlocked
              ? 'Your bankable PDF certificate has been generated and cryptographically sealed.'
              : 'To prevent automated commercial scrapers and keep this tool 100% free for Nigerians, unlock your instant download by sharing with 3 business contacts or 1 WhatsApp group.'}
          </p>
        </div>

        {/* Live Progress Bar */}
        <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-300">
              {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
              <span>Unlock Progress</span>
            </span>
            <span className={isUnlocked ? 'text-emerald-400 font-black' : 'text-amber-400'}>
              {Math.min(shareCount, 3)} of 3 Shares Completed
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[1, 2, 3].map((step) => {
              const completed = shareCount >= step;
              return (
                <div
                  key={step}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    completed
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : 'bg-white/10'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Action Trigger Area */}
        {!isUnlocked ? (
          <div className="space-y-3 pt-1">
            <button
              onClick={handleShareClick}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-95 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              <MessageCircle className="w-5 h-5 fill-slate-950" />
              <span>Tap to Share on WhatsApp ({shareCount}/3)</span>
            </button>

            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              <button
                onClick={handleCopyLink}
                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{hasCopiedLink ? 'Copied to Clipboard!' : 'Copy Tool Link'}</span>
              </button>

              <button
                onClick={handleBypassUnlock}
                className="text-amber-400/90 hover:text-amber-300 underline font-medium transition-colors"
              >
                Already shared? Instant Unlock
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-1 animate-in zoom-in-95 duration-200">
            <a
              href={pdfDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white font-black text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            >
              <Download className="w-5 h-5" />
              <span>Download Official Stamped PDF ({reportReferenceCode})</span>
            </a>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Includes 2026 Alaba/NCS market benchmarks and CAC verification stamp.</span>
            </div>
          </div>
        )}

        {/* Corporate Trust Badge */}
        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">
            Bethelmind Digital Solutions · CAC Reg: 9912717
          </span>
          <a
            href="https://wa.me/2348022791227?text=Hello%20Bethelmind!%20I%20unlocked%20a%20certificate%20and%20would%20like%20to%20inquire%20about%20a%20turnkey%20deployment."
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
          >
            <span>Admin Desk Hotline: 0802 279 1227</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
