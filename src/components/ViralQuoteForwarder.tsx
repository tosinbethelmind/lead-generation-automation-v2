'use client';

import React, { useState } from 'react';
import { 
  Share2, 
  MessageCircle, 
  Copy, 
  Check, 
  Sparkles, 
  Building2, 
  User, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  X
} from 'lucide-react';

export interface ViralQuoteForwarderProps {
  toolSlug: string;
  toolTitle: string;
  category: string;
  defaultProjectTitle?: string;
  summaryMetrics?: { label: string; value: string }[];
}

export const ViralQuoteForwarder: React.FC<ViralQuoteForwarderProps> = ({
  toolSlug,
  toolTitle,
  category,
  defaultProjectTitle = 'Commercial Implementation',
  summaryMetrics = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [copied, setCopied] = useState(false);

  const displayClient = clientName.trim() || 'Valued Client';
  const displaySender = businessName.trim() || 'Bethelmind Digital Solutions (RC 7034297)';

  const metricsText = summaryMetrics.length > 0 
    ? summaryMetrics.map(m => `• ${m.label}: ${m.value}`).join('\n')
    : `• Sizing & Pricing: Audited Commercial Benchmark\n• Execution SLA: 48-Hour Turnkey Deployment`;

  const quoteText = 
`*OFFICIAL COMMERCIAL QUOTATION & SPECIFICATION*
Prepared For: *${displayClient}*
Project / Sector: *${toolTitle}*
Issuing Provider: *${displaySender}*

*TECHNICAL SUMMARY & ESTIMATE:*
${metricsText}

*TERMS & PRICE LOCK:*
• Tariff & Material Price Validity: 48 Hours from issuance
• Corporate Settlement: Moniepoint Microfinance Bank (6805375225)
• CAC Certified Verification: RC 7034297

----------------------------------------
*Audited with Bethelmind Commercial Quoting Engine*
Test your own facility load or verify tariffs free:
https://www.bethelmindanalytics.com/tools/${toolSlug}?ref=client_quote
----------------------------------------`;

  const waUrl = `https://wa.me/?text=${encodeURIComponent(quoteText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Floating Action Bar / Inline Action Button */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border border-emerald-500/30 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white font-['Outfit'] flex items-center gap-2">
              <span>Send This Quote To Your Client</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider">
                Viral Quoter
              </span>
            </h4>
            <p className="text-xs text-slate-300">
              Format this calculation into an official WhatsApp proposal with your company header in 1 tap.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <MessageCircle className="w-4 h-4 fill-slate-950" />
          <span>Forward Quote on WhatsApp</span>
        </button>
      </div>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-emerald-500/40 p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>Instant WhatsApp Proposal Generator</span>
                </div>
                <h3 className="text-lg font-black text-white font-['Outfit']">
                  Send Audited Quote to Client
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Customer / Client Name (Optional):</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chief Adeleke / Prime Supermarket"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Your Company / Business Name (Optional):</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lekki Solar Engineering Ltd"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Live Message Preview */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Live WhatsApp Message Preview:
              </span>
              <pre className="w-full bg-slate-950/80 border border-emerald-500/20 rounded-xl p-3 text-[11px] font-mono text-emerald-300/90 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {quoteText}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
              <button
                onClick={handleCopy}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Quote Text'}</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Open in WhatsApp</span>
              </a>
            </div>

            {/* Upsell Banner */}
            <div className="rounded-xl bg-cyan-950/40 border border-cyan-500/20 p-3 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-cyan-300">Want this tool on your own website domain?</span>
                <p className="text-[11px] text-slate-400">₦35k Starter or ₦75k Turnkey Suite in 24 hours.</p>
              </div>
              <a
                href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind! I would like to deploy the ${toolTitle} on my own custom domain for ${displaySender}. Please share activation details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/30 text-[11px] flex items-center gap-1"
              >
                <span>Deploy Engine</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
