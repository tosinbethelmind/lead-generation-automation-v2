'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles, Globe, MessageSquare, Video, Share2, Copy, Check,
  Search, Flame, Layers, ArrowUpRight, Zap, RefreshCw, Send,
  ShieldCheck, AlertCircle, ExternalLink, HelpCircle
} from 'lucide-react';
import { ALL_PRODUCTS_DATA, ProductItem } from '@/lib/productsData';
import { GeneratedTrafficPackage, generateTrafficPackageForProduct } from '@/lib/trafficAutomationMaster';

export default function AdminTrafficAutomationPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(ALL_PRODUCTS_DATA[0]);
  const [activeChannelTab, setActiveChannelTab] = useState<'nairaland' | 'diaspora' | 'video' | 'linkedin' | 'googleads' | 'whatsapp'>('nairaland');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isIndexing, setIsIndexing] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [currentPackage, setCurrentPackage] = useState<GeneratedTrafficPackage | null>(null);

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.bethelmindanalytics.com';
    const pkg = generateTrafficPackageForProduct(selectedProduct, origin);
    setCurrentPackage(pkg);
  }, [selectedProduct]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateAllAndSave = async () => {
    setIsGenerating(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/traffic/automate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_and_save' })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(`✅ Successfully generated & saved ${data.packagesCount} multi-channel traffic asset batches!`);
      } else {
        setFeedbackMsg(`❌ Error: ${data.error}`);
      }
    } catch (e: any) {
      setFeedbackMsg(`❌ Error: ${e.message}`);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setFeedbackMsg(null), 5000);
    }
  };

  const handlePingGoogleIndexing = async () => {
    setIsIndexing(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/traffic/automate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ping_google_indexing' })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(`🚀 Google Indexing API pinged for ${data.result?.submittedCount || 17} URLs!`);
      } else {
        setFeedbackMsg(`❌ Indexing error: ${data.error}`);
      }
    } catch (e: any) {
      setFeedbackMsg(`❌ Indexing error: ${e.message}`);
    } finally {
      setIsIndexing(false);
      setTimeout(() => setFeedbackMsg(null), 5000);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ─── Header & Top Overview ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Traffic & Viral Growth Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Multi-Channel Traffic & Campaign Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Auto-generate high-converting copy, scripts, and keyword clusters across Google Search, Diaspora Facebook/Nairaland, TikTok/Shorts, and WhatsApp Channels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleGenerateAllAndSave}
            disabled={isGenerating}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Regenerate All 16 Packs'}</span>
          </button>

          <button
            onClick={handlePingGoogleIndexing}
            disabled={isIndexing}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 text-cyan-400 ${isIndexing ? 'animate-pulse' : ''}`} />
            <span>{isIndexing ? 'Pinging Google...' : 'Ping Google Indexing'}</span>
          </button>

          <a
            href="/store"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 transition-all flex items-center space-x-1.5"
          >
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ─── Top Stats Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Active Products</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">16 Master Kits</div>
          <span className="text-[10px] text-slate-500">100% Deliverable Verified</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Outreach Velocity</span>
            <Send className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">500 Leads / Day</div>
          <span className="text-[10px] text-emerald-400">Carrier SMS + B2B Email</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Traffic Channels</span>
            <Globe className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">5 High-Yield</div>
          <span className="text-[10px] text-slate-500">Search, Diaspora, Shorts, WA</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Closer Desk Bridge</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-300">0802 279 1227</div>
          <span className="text-[10px] text-slate-500">24/7 Inbound WhatsApp Bridge</span>
        </div>
      </div>

      {/* ─── Main Product Selector & Channel Generator ──────────────────────── */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-6">
        {/* Product Selection Bar */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Digital Asset / Solution to Generate Traffic Content For:
          </label>
          <select
            value={selectedProduct.id}
            onChange={(e) => {
              const found = ALL_PRODUCTS_DATA.find(p => p.id === e.target.value);
              if (found) setSelectedProduct(found);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
          >
            {ALL_PRODUCTS_DATA.map((prod, idx) => (
              <option key={prod.id} value={prod.id} className="bg-slate-950 text-white">
                #{idx + 1}: {prod.title} (₦{prod.prices.NGN.toLocaleString()} / ${prod.prices.USD})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Product Summary Card */}
        {currentPackage && (
          <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${selectedProduct.badgeColor}`}>
                {selectedProduct.badge}
              </span>
              <h3 className="text-lg font-bold text-white">{currentPackage.productTitle}</h3>
              <p className="text-xs text-slate-400 max-w-xl">{selectedProduct.shortDesc}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(currentPackage.selarUrl, 'selar-link')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center space-x-1"
              >
                {copiedKey === 'selar-link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Selar Link</span>
              </button>

              <button
                onClick={() => handleCopy(currentPackage.whatsappDeskUrl, 'wa-link')}
                className="px-3 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-800/60 flex items-center space-x-1"
              >
                {copiedKey === 'wa-link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <MessageSquare className="w-3.5 h-3.5" />}
                <span>Copy WhatsApp Link</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── Traffic Channel Tabs ────────────────────────────────────────── */}
        <div className="border-b border-slate-800 flex flex-wrap gap-2 pb-2">
          {[
            { id: 'nairaland', label: '🇳🇬 Nairaland Thread (BBCode)', icon: Flame },
            { id: 'diaspora', label: '🌍 Diaspora FB & Groups', icon: Globe },
            { id: 'video', label: '🎬 TikTok / Shorts (35s Script)', icon: Video },
            { id: 'linkedin', label: '💼 LinkedIn B2B Teardown', icon: Share2 },
            { id: 'googleads', label: '🔍 Google Search Ads Keywords', icon: Search },
            { id: 'whatsapp', label: '📱 WhatsApp Channel Broadcast', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveChannelTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeChannelTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── Active Tab Content Display ──────────────────────────────────── */}
        {currentPackage && (
          <div className="space-y-4">
            {/* 1. Nairaland Tab */}
            {activeChannelTab === 'nairaland' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Recommended Section: <strong className="text-emerald-400">{currentPackage.nairalandPost.section.toUpperCase()}</strong>
                  </div>
                  <button
                    onClick={() => handleCopy(currentPackage.nairalandPost.bbcodeContent, 'nairaland-post')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'nairaland-post' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Full BBCode Thread</span>
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 font-mono">
                  <strong className="text-slate-400">Thread Title:</strong> {currentPackage.nairalandPost.threadTitle}
                </div>

                <textarea
                  readOnly
                  rows={14}
                  value={currentPackage.nairalandPost.bbcodeContent}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none"
                />
              </div>
            )}

            {/* 2. Diaspora Facebook Groups Tab */}
            {activeChannelTab === 'diaspora' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Target Groups: <strong className="text-emerald-400">UK, US, Canada Nigerian Communities</strong>
                  </div>
                  <button
                    onClick={() => handleCopy(currentPackage.diasporaFacebookPost.body, 'diaspora-post')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'diaspora-post' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Facebook Post</span>
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 font-mono">
                  <strong className="text-slate-400">Headline:</strong> {currentPackage.diasporaFacebookPost.headline}
                </div>

                <textarea
                  readOnly
                  rows={14}
                  value={currentPackage.diasporaFacebookPost.body}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none"
                />
              </div>
            )}

            {/* 3. Short-Form Video Script Tab */}
            {activeChannelTab === 'video' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Format: <strong className="text-emerald-400">35–45s Vertical Video (Shorts / TikTok / Reels)</strong>
                  </div>
                  <button
                    onClick={() => {
                      const fullScript = `${currentPackage.shortFormVideoScript.hook0to3s}\n\n${currentPackage.shortFormVideoScript.problemDemo}\n\n${currentPackage.shortFormVideoScript.solutionBreakdown}\n\n${currentPackage.shortFormVideoScript.ctaAndPinnedComment}`;
                      handleCopy(fullScript, 'video-script');
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'video-script' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Full Video Script</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-amber-400">Act 1: 0–3s Visual Hook</span>
                    <p className="text-xs text-slate-200 whitespace-pre-line">{currentPackage.shortFormVideoScript.hook0to3s}</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-rose-400">Act 2: Problem Demonstration</span>
                    <p className="text-xs text-slate-200 whitespace-pre-line">{currentPackage.shortFormVideoScript.problemDemo}</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-400">Act 3: The Solution</span>
                    <p className="text-xs text-slate-200 whitespace-pre-line">{currentPackage.shortFormVideoScript.solutionBreakdown}</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-cyan-400">Act 4: CTA & Pinned Comment</span>
                    <p className="text-xs text-slate-200 whitespace-pre-line">{currentPackage.shortFormVideoScript.ctaAndPinnedComment}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. LinkedIn B2B Post Tab */}
            {activeChannelTab === 'linkedin' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Format: <strong className="text-emerald-400">B2B Executive Due-Diligence Breakdown</strong>
                  </div>
                  <button
                    onClick={() => {
                      const text = `${currentPackage.b2bLinkedInPost.hook}\n\n${currentPackage.b2bLinkedInPost.content}\n\n${currentPackage.b2bLinkedInPost.hashtags.join(' ')}`;
                      handleCopy(text, 'linkedin-post');
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'linkedin-post' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy LinkedIn Post</span>
                  </button>
                </div>

                <textarea
                  readOnly
                  rows={14}
                  value={`${currentPackage.b2bLinkedInPost.hook}\n\n${currentPackage.b2bLinkedInPost.content}\n\n${currentPackage.b2bLinkedInPost.hashtags.join(' ')}`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none"
                />
              </div>
            )}

            {/* 5. Google Ads Keywords Tab */}
            {activeChannelTab === 'googleads' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Campaign: <strong className="text-emerald-400">{currentPackage.googleAdsCampaign.campaignName}</strong>
                  </div>
                  <button
                    onClick={() => {
                      const allKw = `EXACT MATCH:\n${currentPackage.googleAdsCampaign.exactMatchKeywords.join('\n')}\n\nPHRASE MATCH:\n${currentPackage.googleAdsCampaign.phraseMatchKeywords.join('\n')}\n\nNEGATIVE KEYWORDS:\n${currentPackage.googleAdsCampaign.negativeKeywords.join('\n')}`;
                      handleCopy(allKw, 'google-kw');
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'google-kw' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Keyword Set</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-emerald-400">Exact Match Keywords [ ]</span>
                    <ul className="text-xs text-slate-300 space-y-1 font-mono">
                      {currentPackage.googleAdsCampaign.exactMatchKeywords.map((kw, i) => (
                        <li key={i}>{kw}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-cyan-400">Phrase Match Keywords &quot; &quot;</span>
                    <ul className="text-xs text-slate-300 space-y-1 font-mono">
                      {currentPackage.googleAdsCampaign.phraseMatchKeywords.map((kw, i) => (
                        <li key={i}>{kw}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-rose-400">Negative Keywords (-)</span>
                    <ul className="text-xs text-slate-300 space-y-1 font-mono">
                      {currentPackage.googleAdsCampaign.negativeKeywords.map((kw, i) => (
                        <li key={i}>-{kw}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 6. WhatsApp Channel Broadcast Tab */}
            {activeChannelTab === 'whatsapp' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Prime Time: <strong className="text-emerald-400">{currentPackage.whatsappBroadcast.broadcastTime}</strong>
                  </div>
                  <button
                    onClick={() => handleCopy(currentPackage.whatsappBroadcast.messageText, 'wa-broadcast')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'wa-broadcast' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy WhatsApp Broadcast</span>
                  </button>
                </div>

                <textarea
                  readOnly
                  rows={12}
                  value={currentPackage.whatsappBroadcast.messageText}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-300 leading-relaxed focus:outline-none"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
