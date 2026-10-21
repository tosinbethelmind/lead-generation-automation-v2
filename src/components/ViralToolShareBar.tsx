'use client';

import React, { useState } from 'react';
import { MessageCircle, Copy, Check, Share2, Globe, Flame } from 'lucide-react';

export interface ViralShareProps {
  toolTitle: string;
  toolSlug: string;
  summaryText: string;
  highlights?: { label: string; value: string }[];
  category?: string;
}

export const ViralToolShareBar: React.FC<ViralShareProps> = ({
  toolTitle,
  toolSlug,
  summaryText,
  highlights = [],
  category = 'Commercial Tools',
}) => {
  const [copiedNairaland, setCopiedNairaland] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const cleanSlug = toolSlug.replace(/^\/+tools\/?/, '').replace(/^\/+/, '');
  const toolUrl = `https://www.bethelmindanalytics.com/tools/${cleanSlug}`;

  // WhatsApp Viral Text
  const waHighlights = highlights.length > 0 
    ? highlights.map(h => `• *${h.label}:* ${h.value}`).join('\n')
    : `• ${summaryText}`;

  const whatsAppShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `⚡ *${toolTitle} — 2026 Nigerian Cost & ROI Breakdown*\n\n` +
    `${waHighlights}\n\n` +
    `👉 Run your own exact property or business calculation free on your phone:\n` +
    `${toolUrl}\n\n` +
    `_Verified by Bethelmind Digital Solutions (CAC Certified RC 7034297)_`
  )}`;

  // Nairaland BBCode Post
  const nairalandBullets = highlights.length > 0
    ? highlights.map(h => `[b]• ${h.label}:[/b] ${h.value}`).join('\n')
    : `[b]• Result:[/b] ${summaryText}`;

  const nairalandBBCode = `[b]⚡ ${toolTitle} — 2026 Cost & Tariff Breakdown (Nigeria)[/b]

[quote]
${nairalandBullets}
[/quote]

Fellow Nairalanders, instead of guessing or arguing with contractors/agents, you can run your exact property numbers or vehicle VIN on this live calculator in 30 seconds:

[url=${toolUrl}][b]👉 Click Here to Test the Free ${toolTitle} (No Login Required)[/b][/url]

[i]Source: Bethelmind Digital Solutions (CAC Certified Enterprise RC 7034297)[/i]`;

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

  return (
    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Flame className="w-3.5 h-3.5 animate-pulse" />
          <span>Viral Traffic & Forum Distribution Engine:</span>
        </div>
        <span className="text-[11px] text-slate-400">1-Tap distribution to WhatsApp groups & Nairaland</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* 1. WhatsApp Share Button */}
        <a
          href={whatsAppShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Share to WhatsApp →</span>
        </a>

        {/* 2. Nairaland BBCode 1-Tap Copy */}
        <button
          type="button"
          onClick={copyNairalandBBCode}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 transition-all shadow-md active:scale-95"
          title="Copies BBCode formatted for Nairaland Auto, Properties, or Investment sections"
        >
          {copiedNairaland ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-emerald-400" />}
          <span>{copiedNairaland ? 'Nairaland BBCode Copied! ✓' : '🇳🇬 Copy Nairaland Post'}</span>
        </button>

        {/* 3. Copy Summary Receipt */}
        <button
          type="button"
          onClick={copyCleanSummary}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-white/10 transition-all active:scale-95"
        >
          {copiedText ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
          <span>{copiedText ? 'Receipt Copied! ✓' : '📋 Copy Summary'}</span>
        </button>

        {/* 4. Copy Direct Tool Link */}
        <button
          type="button"
          onClick={copyDirectLink}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-500/30 transition-all active:scale-95"
        >
          {copiedLink ? <Check className="w-4 h-4 text-cyan-400" /> : <Globe className="w-4 h-4 text-cyan-400" />}
          <span>{copiedLink ? 'Link Copied! ✓' : '🔗 Copy Tool URL'}</span>
        </button>
      </div>
    </div>
  );
};
