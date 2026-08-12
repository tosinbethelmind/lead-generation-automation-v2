'use client';

import React, { useState } from 'react';
import { BUSINESS_OWNER_TOOL_DICTIONARY, ToolExplanation } from '@/lib/businessOwnerDictionary';
import { CheckCircle2, Info, Sparkles, Zap, ShieldCheck, Crown, HelpCircle, X, Layers, PlugZap } from 'lucide-react';

interface BusinessOwnerToolSelectorProps {
  baseFeeNGN: number;
  selectedToolIds: string[];
  onChangeSelectedTools: (newToolIds: string[]) => void;
}

export default function BusinessOwnerToolSelector({
  baseFeeNGN,
  selectedToolIds,
  onChangeSelectedTools,
}: BusinessOwnerToolSelectorProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'growth' | 'conversion' | 'automation'>('all');
  const [explainingTool, setExplainingTool] = useState<ToolExplanation | null>(null);

  const toolsList = Object.values(BUSINESS_OWNER_TOOL_DICTIONARY);

  const filteredTools = toolsList.filter((tool) => {
    if (activeTab === 'all') return true;
    return tool.category === activeTab;
  });

  const toggleTool = (toolId: string) => {
    if (selectedToolIds.includes(toolId)) {
      onChangeSelectedTools(selectedToolIds.filter((id) => id !== toolId));
    } else {
      onChangeSelectedTools([...selectedToolIds, toolId]);
    }
  };

  const applyPresetBundle = (bundleType: 'starter' | 'growth' | 'luxury') => {
    if (bundleType === 'starter') {
      onChangeSelectedTools(['whatsapp_bot']);
    } else if (bundleType === 'growth') {
      onChangeSelectedTools(['meta_capi', 'email_drip', 'journey_analytics']);
    } else if (bundleType === 'luxury') {
      onChangeSelectedTools(toolsList.map((t) => t.id));
    }
  };

  const totalAddonCost = selectedToolIds.reduce((sum, id) => {
    const tool = BUSINESS_OWNER_TOOL_DICTIONARY[id];
    return sum + (tool ? tool.addonPriceNGN : 0);
  }, 0);

  const finalTotalFee = baseFeeNGN + totalAddonCost;

  const COMMON_APPS = [
    { name: 'WhatsApp', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { name: 'Google Sheets', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
    { name: 'Paystack / Moniepoint', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { name: 'Google Calendar', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { name: 'Mailchimp / Email', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
    { name: 'WordPress & Shopify', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white my-6 shadow-2xl">
      {/* Selling Narrative Banner: Zero Migration & Universal Integration */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-950 to-purple-950 border border-indigo-500/30 rounded-xl p-4 mb-6 relative overflow-hidden">
        <div className="flex items-start gap-3.5 relative z-10">
          <div className="p-3 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-xl shrink-0">
            <PlugZap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-extrabold text-white">⚡ Keep Using What You Love — Zero Migration Required!</h4>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                100% Plug & Play
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              You don't need to replace your software or learn complicated platforms. Our tools plug seamlessly into the apps you open every morning in under 60 seconds without software migration or developer fees!
            </p>

            {/* App Ecosystem Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase mr-1">Plugs directly into:</span>
              {COMMON_APPS.map((app, idx) => (
                <span key={idx} className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${app.color}`}>
                  {app.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Header & Total Price */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🚀 Select Your Growth & Productivity Tools
          </h3>
          <p className="text-xs text-slate-400">Toggle tools to boost sales. Includes 100% done-for-you technical setup and integration.</p>
        </div>

        {/* Total Price Counter */}
        <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-right">
          <span className="text-[10px] uppercase text-slate-400 block font-semibold">Total Package Investment</span>
          <span className="text-xl font-extrabold text-emerald-400">₦{finalTotalFee.toLocaleString()}</span>
        </div>
      </div>

      {/* 1-Click Preset Bundles Bar */}
      <div className="mb-6 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Quick 1-Click Recommended Bundles:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => applyPresetBundle('starter')}
            className="flex items-center justify-between p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/70 rounded-lg text-left transition"
          >
            <div>
              <span className="text-xs font-bold text-white block">🚀 Essential Sales Starter</span>
              <span className="text-[10px] text-slate-400">Base Site + WhatsApp Bot</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPresetBundle('growth')}
            className="flex items-center justify-between p-2.5 bg-slate-900 hover:bg-indigo-950/40 border border-indigo-500/40 rounded-lg text-left transition"
          >
            <div>
              <span className="text-xs font-bold text-indigo-300 block">📈 Growth & Ad Accelerator</span>
              <span className="text-[10px] text-indigo-400">Anti-Adblock + Auto Emailer + Replay</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPresetBundle('luxury')}
            className="flex items-center justify-between p-2.5 bg-slate-900 hover:bg-amber-950/40 border border-amber-500/40 rounded-lg text-left transition"
          >
            <div>
              <span className="text-xs font-bold text-amber-300 block flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" /> Apex Luxury VIP Suite
              </span>
              <span className="text-[10px] text-amber-400">All Tools Included 100% Hands-Free</span>
            </div>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Tools ({toolsList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('growth')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'growth' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🎯 Get More Buyers
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('conversion')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'conversion' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🧲 Convert Visitors to Sales
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('automation')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'automation' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🤖 Auto-Pilot Follow-Up
        </button>
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTools.map((tool) => {
          const isSelected = selectedToolIds.includes(tool.id);
          return (
            <div
              key={tool.id}
              onClick={() => toggleTool(tool.id)}
              className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-950 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by parent div
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500"
                    />
                    <h4 className="text-sm font-bold text-white">{tool.businessName}</h4>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    +₦{tool.addonPriceNGN.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed">{tool.shortSummary}</p>

                {/* Selling Narrative Compatibility Badge */}
                <p className="text-[11px] text-indigo-300 font-medium mb-3 flex items-center gap-1.5 bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/20">
                  <PlugZap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  {tool.salesPitchHook}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 mt-2">
                <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  {tool.roiBadge}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExplainingTool(tool);
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 underline transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  Explain in 10s
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 10-Second Explainer Modal Popup */}
      {explainingTool && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setExplainingTool(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{explainingTool.businessName.split(' ')[0]}</span>
              <div>
                <h3 className="text-base font-bold text-white">{explainingTool.businessName}</h3>
                <p className="text-xs text-indigo-400 font-mono">{explainingTool.techName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              {explainingTool.explanation}
            </p>

            {/* Seamless Compatibility Box */}
            <div className="mb-4 p-3 bg-indigo-950/50 border border-indigo-500/30 rounded-xl">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 mb-1.5">
                <PlugZap className="w-3.5 h-3.5 text-indigo-400" />
                Zero-Code App Compatibility:
              </span>
              <div className="flex flex-wrap gap-1">
                {explainingTool.compatibleApps.map((app, idx) => (
                  <span key={idx} className="text-[10px] font-semibold bg-slate-900 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
                    {app}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300">
                <span className="text-xs font-bold block text-rose-200 mb-1">❌ WITHOUT THIS TOOL:</span>
                <p className="text-xs">{explainingTool.beforeVsAfter.before}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                <span className="text-xs font-bold block text-emerald-200 mb-1">✅ WITH THIS TOOL:</span>
                <p className="text-xs">{explainingTool.beforeVsAfter.after}</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!selectedToolIds.includes(explainingTool.id)) {
                  toggleTool(explainingTool.id);
                }
                setExplainingTool(null);
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              Add {explainingTool.businessName} (+₦{explainingTool.addonPriceNGN.toLocaleString()})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
