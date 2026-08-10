'use client';

import React, { useState } from 'react';
import { Sparkles, Palette, Check, RefreshCw, Layers, DollarSign, Eye, Send, Sliders } from 'lucide-react';
import { MODULAR_FEATURES_CATALOG, calculateCustomFeatureSelection } from '@/lib/featureCustomizer';

interface AdminLeadRedesignStudioProps {
  initialLeadId?: string;
  initialBusinessName?: string;
}

export default function AdminLeadRedesignStudio({
  initialLeadId = '',
  initialBusinessName = '',
}: AdminLeadRedesignStudioProps) {
  const [leadId, setLeadId] = useState(initialLeadId);
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [prompt, setPrompt] = useState('');
  const [redesigning, setRedesigning] = useState(false);
  const [redesignSuccess, setRedesignSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modular Features Selection
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([
    'feature_lead_harvester',
    'feature_customer_ai_agent',
    'feature_opay_dva_box',
  ]);
  const [savingFeatures, setSavingFeatures] = useState(false);
  const [featureSaveSuccess, setFeatureSaveSuccess] = useState(false);

  // Pricing calculation
  const pricing = calculateCustomFeatureSelection(selectedFeatureIds);

  const toggleFeature = (id: string) => {
    if (selectedFeatureIds.includes(id)) {
      if (selectedFeatureIds.length === 1) return; // Keep at least 1 feature
      setSelectedFeatureIds(selectedFeatureIds.filter(item => item !== id));
    } else {
      setSelectedFeatureIds([...selectedFeatureIds, id]);
    }
  };

  // Trigger Prompt-based AI Redesign
  const handleAiRedesign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId.trim() || !prompt.trim()) {
      setError('Please provide both Lead ID / Slug and Redesign Prompt.');
      return;
    }

    setRedesigning(true);
    setRedesignSuccess(null);
    setError(null);

    try {
      const res = await fetch('/api/preview/ai-redesign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: leadId.trim(), prompt: prompt.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setRedesignSuccess(
          data.shortcut
            ? '⚡ Instant color palette & theme shortcut applied!'
            : '✨ Vertex/Gemini AI redesign completed! New colors, copy, and layout applied.'
        );
      } else {
        throw new Error(data.error || 'Failed to execute AI redesign.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during AI redesign.');
    } finally {
      setRedesigning(false);
    }
  };

  // Save Custom Features & Updated Pricing to Lead Record
  const handleSaveFeaturePackage = async () => {
    if (!leadId.trim()) {
      setError('Please specify a Lead ID to bind feature pricing.');
      return;
    }

    setSavingFeatures(true);
    setError(null);
    setFeatureSaveSuccess(false);

    try {
      const res = await fetch('/api/preview/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: leadId.trim(),
          overrides: {
            selectedFeatures: selectedFeatureIds,
            customPricing: {
              setupFeeNGN: pricing.finalSetupNGN,
              monthlyRenewalNGN: pricing.finalMonthlyNGN,
              discountApplied: pricing.discountAppliedPercentage,
            },
          },
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setFeatureSaveSuccess(true);
        setTimeout(() => setFeatureSaveSuccess(false), 3000);
      } else {
        throw new Error(data.error || 'Failed to save feature package.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingFeatures(false);
    }
  };

  const previewUrl = leadId ? `/preview/${encodeURIComponent(leadId)}` : '#';

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 text-slate-100 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#06b6d4] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Human Assistant Design & Pricing Studio
          </div>
          <h3 className="text-xl font-bold text-white">Prompt-Based Website Redesign & Modular Feature Customizer</h3>
          <p className="text-xs text-slate-400">Type natural prompts to redesign lead sites instantly, add custom features, and automatically bind customized pricing packages.</p>
        </div>
        {leadId && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#06b6d4] text-slate-950 hover:opacity-90 transition-all flex items-center gap-1.5 shadow-lg shadow-[#06b6d4]/20"
          >
            <Eye className="w-4 h-4" /> Live Test Preview
          </a>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* Target Lead Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-white/5">
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">Lead ID / Business Slug</label>
          <input
            type="text"
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            placeholder="e.g. lekki-solar-hub or lead_123"
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#06b6d4]"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">Business Name (Optional Display)</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Lekki Luxury Solar Enterprise"
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#06b6d4]"
          />
        </div>
      </div>

      {/* 🎨 SECTION 1: PROMPT-BASED AI REDESIGN */}
      <form onSubmit={handleAiRedesign} className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Palette className="w-4 h-4" /> 1. Prompt-Based Visual & Copy Redesign
        </div>

        <div>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Redesign for a luxury solar enterprise in Lekki. Use dark gold background (#1c1917) with amber accents, rewrite hero title to 'Premium Solar & Battery Inverters', and highlight 24/7 support."
            className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Presets available: <code>dark</code>, <code>light</code>, <code>gold</code>, <code>eco green</code>, <code>blue ocean</code>
          </span>
          <button
            type="submit"
            disabled={redesigning}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {redesigning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Redesign Website from Prompt
          </button>
        </div>

        {redesignSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4" /> {redesignSuccess}
          </div>
        )}
      </form>

      {/* ⚙️ SECTION 2: MODULAR FEATURE PICKER WITH DESIGNED PRICING */}
      <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" /> 2. Add Modular Features with Designed Pricing
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {selectedFeatureIds.length} Features Selected
          </span>
        </div>

        {/* Catalog List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MODULAR_FEATURES_CATALOG.map((feat) => {
            const isSelected = selectedFeatureIds.includes(feat.id);
            return (
              <div
                key={feat.id}
                onClick={() => toggleFeature(feat.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 ${
                    isSelected
                      ? 'bg-[#06b6d4] border-[#06b6d4] text-slate-950'
                      : 'border-white/20 bg-slate-950'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">
                      {feat.icon} {feat.name}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400">
                      +₦{feat.setupPriceNGN.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Pricing Summary Card */}
        <div className="bg-slate-900 border border-white/10 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Calculated Package Setup Price:</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-emerald-400">
                ₦{pricing.finalSetupNGN.toLocaleString()}
              </span>
              {pricing.discountAppliedPercentage > 0 && (
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  🎉 {pricing.discountAppliedPercentage}% Bundle Discount Applied!
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Monthly Renewal: ₦{pricing.finalMonthlyNGN.toLocaleString()}/mo
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveFeaturePackage}
              disabled={savingFeatures}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {savingFeatures ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save Package & Bind Claim Fee
            </button>
          </div>
        </div>

        {featureSaveSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4" /> Feature package & claim fee of ₦{pricing.finalSetupNGN.toLocaleString()} bound successfully to lead!
          </div>
        )}
      </div>
    </div>
  );
}
