'use client';

import React, { useState } from 'react';
import { MASTER_PAYOUT } from '@/data/monetizationCatalog';

interface SocialShareHubProps {
  title: string;
  slug: string;
  whatsappSnippet?: string;
  twitterSnippet?: string[];
  linkedinSnippet?: string;
}

export const SocialShareHub: React.FC<SocialShareHubProps> = ({
  title,
  slug,
  whatsappSnippet,
  twitterSnippet,
  linkedinSnippet
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const articleUrl = `${MASTER_PAYOUT.website}/blog/${slug}`;

  const defaultWhatsapp = whatsappSnippet || `*${title}*\n\nRead the full strategic breakdown from Bethelmind Analytics Lagos Desk:\n👉 ${articleUrl}`;
  const defaultTwitter = (twitterSnippet && twitterSnippet[0]) || `${title}\n\nStrategic briefing via @BethelmindHQ:\n${articleUrl}`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 my-10 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
            Syndicate & Share This Executive Intelligence:
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            1-tap share or copy pre-formatted executive briefings for your team & network.
          </p>
        </div>

        {copiedType && (
          <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold animate-fade-in">
            ✓ Copied {copiedType} to clipboard!
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Share to WhatsApp */}
        <a 
          href={`https://wa.me/?text=${encodeURIComponent(defaultWhatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md hover:scale-105"
        >
          <span>💬 Share to WhatsApp</span>
        </a>

        {/* Share to X / Twitter */}
        <a 
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(defaultTwitter)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md hover:scale-105"
        >
          <span>𝕏 Share to Twitter/X</span>
        </a>

        {/* Share to LinkedIn */}
        <a 
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md hover:scale-105"
        >
          <span>💼 Share to LinkedIn</span>
        </a>

        {/* 1-Click Copy Status Broadcast */}
        <button
          onClick={() => copyToClipboard(defaultWhatsapp, 'WhatsApp Status')}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
        >
          <span>📋 Copy Status Text</span>
        </button>
      </div>
    </div>
  );
};
