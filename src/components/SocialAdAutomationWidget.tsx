'use client';

import React, { useState } from 'react';
import { WebappToolActionBar } from './WebappToolActionBar';
import {
  generateSocialContentCalendar,
  generateAiAdCampaign,
  PREMIUM_SOCIAL_AD_PRICING,
  SIMPLE_HOW_IT_WORKS,
  SocialPost,
  AdCampaignConfig,
} from '@/lib/socialAdAutomation';
import {
  auditAndSwapAdCreatives,
  AdPerformanceMetric,
  CreativeSwapResult,
} from '@/lib/socialAdGuardian';

interface SocialAdAutomationWidgetProps {
  businessName?: string;
  category?: string;
  onSelectPackage?: (packageId: string, priceNGN: number) => void;
}

export function SocialAdAutomationWidget({
  businessName = 'ApexReach Partner',
  category = 'Solar & Renewable Energy',
  onSelectPackage,
}: SocialAdAutomationWidgetProps) {
  const [activeTab, setActiveTab] = useState<'how_it_works' | 'calendar' | 'ad_launcher' | 'guardian' | 'pricing'>('how_it_works');
  const [tone, setTone] = useState<'english' | 'pidgin'>('english');
  const [adBudgetNGN, setAdBudgetNGN] = useState<number>(150000);
  const [selectedPostIdx, setSelectedPostIdx] = useState<number>(0);
  const [selectedCreativeIdx, setSelectedCreativeIdx] = useState<number>(0);
  const [claimedPackage, setClaimedPackage] = useState<string | null>(null);

  // Guardian state
  const [sampleMetrics, setSampleMetrics] = useState<AdPerformanceMetric[]>([
    { adId: 'AD-001', headline: '⚡ Save ₦300k/mo on Diesel with Solar!', creativeType: 'VIDEO_REEL', impressions: 14500, clicks: 520, ctrPercent: 3.58, costPerLeadNGN: 1850, status: 'ACTIVE' },
    { adId: 'AD-002', headline: 'Solar Installation in Lagos with 0% Down', creativeType: 'SINGLE_IMAGE', impressions: 18200, clicks: 145, ctrPercent: 0.79, costPerLeadNGN: 4200, status: 'ACTIVE' },
    { adId: 'AD-003', headline: '🇳🇬 Band A Tariff Hike Solution for Business', creativeType: 'IMAGE_CAROUSEL', impressions: 9800, clicks: 290, ctrPercent: 2.95, costPerLeadNGN: 2100, status: 'ACTIVE' },
  ]);
  const [swappedHistory, setSwappedHistory] = useState<CreativeSwapResult[]>([]);
  const [guardianSummary, setGuardianSummary] = useState<string | null>(null);

  const posts: SocialPost[] = generateSocialContentCalendar(businessName, category);
  const campaign: AdCampaignConfig = generateAiAdCampaign(businessName, category, adBudgetNGN);

  const handleRunGuardianAudit = () => {
    const auditResult = auditAndSwapAdCreatives(sampleMetrics, businessName, category);
    setSampleMetrics(auditResult.updatedMetrics);
    setSwappedHistory(auditResult.swappedCreatives);
    setGuardianSummary(auditResult.reallocatedBudgetSummary);
  };

  const handleClaim = (pkgId: string, price: number) => {
    setClaimedPackage(pkgId);
    if (onSelectPackage) {
      onSelectPackage(pkgId, price);
    }
  };

  return (
    <div className="w-full space-y-4">
      <WebappToolActionBar currentTool="AI Social Ad Launcher" />
      <div className="w-full max-w-5xl mx-auto my-8 bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden font-sans text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase rounded-full tracking-wider">
                🎯 High-Converting Ad Engine 2026
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Meta & Google API Bridge Active
              </span>
              <span className="px-3 py-1 bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-medium rounded-full">
                ⚡ -64% Cost-Per-Lead Savings
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              AI Social Media Management & High-Converting Ad Launcher
            </h2>
            <p className="text-blue-100 text-sm md:text-base mt-1">
              Topmost AI ad engine for {businessName}: Produces ultra-effective Meta/Google Ads with instant WhatsApp lead delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('how_it_works')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'how_it_works'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              💡 Simple 3-Steps
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'calendar'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              📱 Post Calendar
            </button>
            <button
              onClick={() => setActiveTab('ad_launcher')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'ad_launcher'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🚀 High-Converting Ads
            </button>
            <button
              onClick={() => setActiveTab('guardian')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'guardian'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🛡️ Zero-Failure Guard
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'pricing'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              💎 Pricing Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 md:p-8 bg-slate-900/60">
        {/* TAB 0: SIMPLE 3-STEP EXPLANATION */}
        {activeTab === 'how_it_works' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold uppercase rounded-full border border-amber-400/30">
                ⚡ Simple 10-Second Explanation
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                How AI Ad & Social Automation Works in 3 Simple Steps
              </h3>
              <p className="text-slate-300 text-xs md:text-sm">
                No technical skills needed. Our AI handles 100% of the graphic design, direct-response ad copywriting, and buyer targeting.
              </p>
            </div>

            {/* 3 Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SIMPLE_HOW_IT_WORKS.map((step) => (
                <div
                  key={step.step}
                  className="bg-slate-950 p-6 rounded-3xl border border-slate-800 relative flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{step.icon}</span>
                      <span className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-black flex items-center justify-center">
                        #{step.step}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white">{step.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Efficiency Comparison Card */}
            <div className="bg-gradient-to-r from-emerald-950/60 via-slate-950 to-teal-950/60 p-6 md:p-8 rounded-3xl border border-emerald-500/40 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase rounded-full">
                    💰 Maximum Cost Efficiency Math
                  </span>
                  <h4 className="text-xl font-extrabold text-white mt-1">
                    Traditional Agency Ads vs ApexReach AI Ad Engine
                  </h4>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold">
                  ⚡ Saves 64% Cost-Per-Lead (CPL)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Traditional Cost / Lead</span>
                  <span className="text-2xl font-bold text-red-400 mt-1 block">
                    ₦{campaign.efficiencyMetrics.traditionalCostPerLeadNGN.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500">High wasted ad spend</span>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-emerald-500/40">
                  <span className="text-xs text-emerald-400 block font-bold">ApexReach AI Cost / Lead</span>
                  <span className="text-2xl font-black text-emerald-300 mt-1 block">
                    ₦{campaign.efficiencyMetrics.aiOptimizedCostPerLeadNGN.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400">High-intent buyer target</span>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-500/40">
                  <span className="text-xs text-amber-400 block font-bold">Wasted Ad Spend Saved</span>
                  <span className="text-2xl font-black text-amber-300 mt-1 block">
                    ₦{campaign.efficiencyMetrics.wasteSpendEliminatedNGN.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-amber-400">62% budget leak eliminated</span>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setActiveTab('ad_launcher')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Test High-Converting Ad Launcher →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: SOCIAL POST CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📅 30-Day AI Multi-Platform Post Schedule</span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Scheduled for Instagram, Facebook, TikTok, LinkedIn & X with Pidgin/English dual AI writer
                </p>
              </div>

              {/* Tone Switcher */}
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setTone('english')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    tone === 'english'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇬🇧 Formal English
                </button>
                <button
                  onClick={() => setTone('pidgin')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    tone === 'pidgin'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇳🇬 Nigerian Pidgin AI
                </button>
              </div>
            </div>

            {/* Grid of Posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sidebar List of Posts */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                {posts.map((post, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPostIdx(idx)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedPostIdx === idx
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-blue-400">Day {post.day}</span>
                      <span className="uppercase text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-700 text-slate-200">
                        {post.platform}
                      </span>
                    </div>
                    <p className="text-sm font-semibold truncate">{post.topic}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                      <span>⏰ {post.bestTime}</span>
                      <span className="text-emerald-400 text-[10px]">● Scheduled</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Selected Post Preview */}
              <div className="md:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-bold">Live AI Preview</span>
                    <h4 className="text-lg font-bold text-white mt-0.5">
                      {posts[selectedPostIdx].topic}
                    </h4>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-lg text-xs font-bold capitalize">
                    {posts[selectedPostIdx].platform} Post
                  </span>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {tone === 'pidgin'
                    ? posts[selectedPostIdx].pidginCaption
                    : posts[selectedPostIdx].caption}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {posts[selectedPostIdx].hashtags.map((tag, hIdx) => (
                    <span
                      key={hIdx}
                      className="px-2.5 py-1 bg-slate-800 text-blue-400 text-xs rounded-md border border-slate-700 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="text-amber-400 font-bold block mb-1">
                    🎨 AI Visual Concept Prompt:
                  </span>
                  <p className="text-slate-300 italic">{posts[selectedPostIdx].visualPrompt}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-emerald-400 font-medium">
                    {posts[selectedPostIdx].callToAction}
                  </span>
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                  >
                    Activate AI Auto-Publisher →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HIGH-CONVERTING AD LAUNCHER */}
        {activeTab === 'ad_launcher' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Budget Controls & Setup */}
              <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🚀 1-Click High-Converting Meta & Google Ad Launcher</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Simulate monthly ad spend budget and calculate real-time lead volume & ROI.
                  </p>
                </div>

                {/* Budget Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300 font-medium">Monthly Ad Spend Budget:</span>
                    <span className="text-emerald-400 font-extrabold text-lg">
                      ₦{adBudgetNGN.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="25000"
                    value={adBudgetNGN}
                    onChange={(e) => setAdBudgetNGN(Number(e.target.value))}
                    className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>₦50k/mo</span>
                    <span>₦500k/mo</span>
                    <span>₦1M/mo</span>
                  </div>
                </div>

                {/* Audience Target Card */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                    🎯 AI Audience Targeting Engine
                  </span>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p>
                      <strong>Locations:</strong> Lagos (Lekki, Ikoyi, Ikeja), Abuja (Maitama), Port Harcourt
                    </p>
                    <p>
                      <strong>Age Range:</strong> {campaign.targetAudience.ageRange}
                    </p>
                    <p>
                      <strong>Income Persona:</strong> High Net Worth Buyers & SME Business Owners
                    </p>
                  </div>
                </div>

                {/* Direct Lead Routing Spec */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    📲 Instant Lead Dispatch
                  </span>
                  <p className="text-xs text-slate-300">
                    Lead form responses drop <strong>instantly</strong> into client’s WhatsApp bot + Google Sheets CRM within 1.5 seconds.
                  </p>
                </div>
              </div>

              {/* Projected Results & Ad Creative Demo */}
              <div className="lg:col-span-7 space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-xs block">Estimated Leads</span>
                    <span className="text-2xl font-black text-white mt-1 block">
                      {campaign.budgetAllocation.projectedLeads}
                    </span>
                    <span className="text-[10px] text-emerald-400">High-Intent Leads</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-xs block">Cost Per Lead</span>
                    <span className="text-xl font-bold text-blue-400 mt-1 block">
                      ₦{campaign.budgetAllocation.estimatedCostPerLeadNGN.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400">-64% AI Savings</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-xs block">Est. Revenue</span>
                    <span className="text-xl font-bold text-emerald-400 mt-1 block">
                      ₦{(campaign.budgetAllocation.estimatedRevenueNGN / 1000000).toFixed(1)}M
                    </span>
                    <span className="text-[10px] text-emerald-500">Projected Sales</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-xs block">Projected ROI</span>
                    <span className="text-2xl font-black text-amber-400 mt-1 block">
                      +{campaign.budgetAllocation.projectedROIPercent}%
                    </span>
                    <span className="text-[10px] text-amber-500">Return on Ad Spend</span>
                  </div>
                </div>

                {/* Direct-Response Copywriting Framework Selector */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>🎨 Direct-Response High-Converting Copy Angles</span>
                    </h4>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-400/30">
                      Proven Copy Formulas
                    </span>
                  </div>

                  {/* Angle Switcher Buttons */}
                  <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
                    {campaign.adCreatives.map((creative, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => setSelectedCreativeIdx(cIdx)}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                          selectedCreativeIdx === cIdx
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {creative.angleName}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">
                        {campaign.adCreatives[selectedCreativeIdx].conversionBonus}
                      </span>
                      <span className="text-[11px] uppercase font-extrabold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {campaign.adCreatives[selectedCreativeIdx].framework}
                      </span>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-blue-400 font-bold block mb-1">
                        High-Converting Ad Headline:
                      </span>
                      <p className="text-sm font-bold text-white">
                        {campaign.adCreatives[selectedCreativeIdx].headline}
                      </p>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 font-bold block mb-1">
                        Primary Direct-Response Text:
                      </span>
                      <p className="text-xs text-slate-200 whitespace-pre-wrap">
                        {campaign.adCreatives[selectedCreativeIdx].primaryText}
                      </p>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-emerald-400 font-bold block mb-1">
                        Pidgin Local Hook:
                      </span>
                      <p className="text-xs text-emerald-200">
                        {campaign.adCreatives[selectedCreativeIdx].pidginAdCopy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400">
                      CTA Button: <strong>{campaign.adCreatives[selectedCreativeIdx].ctaButton}</strong>
                    </span>
                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                    >
                      Launch High-Converting Ads →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ZERO-FAILURE GUARDIAN & A/B SWAPPER */}
        {activeTab === 'guardian' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-950/40 p-5 rounded-2xl border border-purple-800/60">
              <div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold uppercase rounded-full border border-purple-400/40 mb-1 inline-block">
                  🛡️ Zero-Failure Reliability & Ad Fatigue Guardian
                </span>
                <h3 className="text-lg font-bold text-white">
                  Autonomous Creative Auto-Swapper & Fail-Safe Webhook Gateway
                </h3>
                <p className="text-slate-300 text-xs mt-0.5">
                  Monitors ad performance 24/7. Automatically pauses low-CTR ads (&lt; 1.2%) and spawns fresh AI variants with 99.99% lead delivery guarantee.
                </p>
              </div>

              <button
                onClick={handleRunGuardianAudit}
                className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all whitespace-nowrap"
              >
                ⚡ Run Autonomous Creative Audit →
              </button>
            </div>

            {/* Live Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block font-semibold">Webhook Gateway Health</span>
                <span className="text-lg font-extrabold text-emerald-400 mt-1 block flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  99.99% Operational
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">Avg Latency: 140ms | Fallback Dispatch Active</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block font-semibold">Phone Normalizer Engine</span>
                <span className="text-lg font-extrabold text-blue-400 mt-1 block">
                  E.164 (+234) Universal Sync
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">0% Format Drops | E.164 Compliant</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block font-semibold">Ad Creative Guardian</span>
                <span className="text-lg font-extrabold text-amber-400 mt-1 block">
                  Autonomous A/B Swapper
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">Auto-Pauses CTR &lt; 1.2%</span>
              </div>
            </div>

            {guardianSummary && (
              <div className="bg-emerald-950/40 border border-emerald-500/50 p-4 rounded-xl text-emerald-200 text-xs font-semibold">
                ✅ {guardianSummary}
              </div>
            )}

            {/* Active Ads Table */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white">Live Ad Variants & Guardian Audit Status</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Ad ID</th>
                      <th className="p-3">Headline</th>
                      <th className="p-3">Impressions</th>
                      <th className="p-3">CTR %</th>
                      <th className="p-3">Cost / Lead</th>
                      <th className="p-3">Guardian Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {sampleMetrics.map((ad, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-blue-400">{ad.adId}</td>
                        <td className="p-3 font-sans font-medium text-slate-200">{ad.headline}</td>
                        <td className="p-3">{ad.impressions.toLocaleString()}</td>
                        <td className={`p-3 font-bold ${ad.ctrPercent < 1.2 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {ad.ctrPercent.toFixed(2)}%
                        </td>
                        <td className="p-3">₦{ad.costPerLeadNGN.toLocaleString()}</td>
                        <td className="p-3">
                          {ad.status === 'REPLACED' ? (
                            <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded font-sans text-[10px] font-bold">
                              ⛔ PAUSED & SWAPPED
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded font-sans text-[10px] font-bold">
                              ✓ OPTIMAL
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {swappedHistory.length > 0 && (
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 mt-4">
                  <span className="text-xs font-bold text-amber-400 uppercase block">
                    🤖 Autonomous AI Creative Replacement Log:
                  </span>
                  {swappedHistory.map((swap, sIdx) => (
                    <div key={sIdx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>Swapped <strong>{swap.previousAdId}</strong> → <strong>{swap.newAdId}</strong></span>
                        <span>{swap.timestamp}</span>
                      </div>
                      <p className="text-slate-300"><strong>Reason:</strong> {swap.reason}</p>
                      <p className="text-emerald-300 font-semibold"><strong>New AI Headline:</strong> {swap.newHeadline}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PRICING & TIERS */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold uppercase rounded-full border border-amber-400/30">
                💎 Topmost Premium Pricing Matrix
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                Choose Your AI Social & Ad Automation Package
              </h3>
              <p className="text-slate-400 text-xs md:text-sm">
                Add 100% hands-free AI content creation, post scheduling, and Meta/Google ad automation to your lead generation package.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.values(PREMIUM_SOCIAL_AD_PRICING).map((tier) => {
                const isSelected = claimedPackage === tier.id;
                const isDominance = tier.id === 'social_ad_dominance_suite';

                return (
                  <div
                    key={tier.id}
                    className={`relative p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                      isDominance
                        ? 'bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 border-amber-500/50 shadow-2xl ring-1 ring-amber-500/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isDominance && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[11px] font-black uppercase rounded-full shadow-lg">
                        👑 Best Value Dominance Bundle
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold text-blue-400 block mb-1">
                          {tier.badge}
                        </span>
                        <h4 className="text-lg font-bold text-white">{tier.name}</h4>
                      </div>

                      <div className="border-y border-slate-800/80 py-4 space-y-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl md:text-3xl font-black text-white">
                            ₦{tier.monthlySubscriptionNGN.toLocaleString()}
                          </span>
                          <span className="text-slate-400 text-xs">/ month</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Or <strong>₦{tier.oneTimeSetupNGN.toLocaleString()}</strong> one-time lifetime setup
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-300 block">
                          Key Features Included:
                        </span>
                        <ul className="space-y-2 text-xs text-slate-300">
                          {tier.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2">
                              <span className="text-emerald-400 font-bold">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={() => handleClaim(tier.id, tier.oneTimeSetupNGN)}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg ${
                          isSelected
                            ? 'bg-emerald-500 text-white shadow-emerald-500/40'
                            : isDominance
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-amber-500/30'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30'
                        }`}
                      >
                        {isSelected
                          ? '✓ Package Selected & Claimed'
                          : `Claim ${tier.name} →`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
