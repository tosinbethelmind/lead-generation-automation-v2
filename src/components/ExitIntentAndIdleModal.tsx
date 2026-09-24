'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, X, Zap, ShieldCheck, ArrowRight, CheckCircle2, Clock, Phone, Loader2 } from 'lucide-react';

interface ExitIntentAndIdleModalProps {
  businessName: string;
  category?: string;
  area?: string;
  adminPhone?: string;
  leadId?: string;
}

export default function ExitIntentAndIdleModal({
  businessName = 'Your Business',
  category = 'Commercial Enterprise',
  area = 'Lagos',
  adminPhone = '2348022791227',
  leadId = ''
}: ExitIntentAndIdleModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const triggerModal = useCallback(() => {
    if (hasTriggered) return;
    try {
      const alreadyShown = sessionStorage.getItem('bm_exit_modal_seen');
      if (alreadyShown === 'true') return;
      sessionStorage.setItem('bm_exit_modal_seen', 'true');
    } catch (_) {}

    setHasTriggered(true);
    setIsOpen(true);
  }, [hasTriggered]);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 640 || 'ontouchstart' in window);

    // 1. Desktop Exit Intent (mouse moves out top of viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15 && !hasTriggered) {
        triggerModal();
      }
    };

    // 2. Mobile Exit / Inaction Guard: Gentle 50-second timer on mobile (or 20s on desktop), preventing mid-reading interruption
    const timeoutDuration = isMobile ? 50000 : 20000;
    const idleTimer = setTimeout(() => {
      if (!hasTriggered) {
        triggerModal();
      }
    }, timeoutDuration);

    if (!isMobile) {
      document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (!isMobile) {
        document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      }
      clearTimeout(idleTimer);
    };
  }, [hasTriggered, triggerModal]);

  if (!isOpen) return null;

  const previewLink = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://www.bethelmindanalytics.com/preview/${leadId || 'demo'}`;

  const prefilledMessage = encodeURIComponent(
    `Hello Bethelmind Analytics Lagos Desk! I was previewing the 24/7 AI quoting assistant for *${businessName}* (${category}) in ${area}.\n\nDemo: ${previewLink}\n\nPlease show me how the 2-second auto-reply answers our customers' quote inquiries (₦0 Upfront Preview).`
  );

  const waUrl = `https://wa.me/${adminPhone}?text=${prefilledMessage}`;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPhone.trim()) return;

    setIsSending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const resp = await fetch('/api/preview/send-instant-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userPhone,
          businessName,
          category,
          area,
          leadId
        })
      });

      const data = await resp.json();
      if (data.success) {
        setSuccessMsg(`🎉 Live demo dispatched to ${data.phone}! Tap below to open WhatsApp.`);
        setUserPhone('');
      } else {
        setErrorMsg(data.error || 'Please enter a valid 11-digit Nigerian WhatsApp number.');
      }
    } catch (_) {
      setErrorMsg('Network timeout. You can tap the green button to chat directly on WhatsApp.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      style={{ boxSizing: 'border-box' }}
    >
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/50 rounded-2xl shadow-2xl p-5 sm:p-7 text-slate-100 space-y-4"
        style={{
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(16, 185, 129, 0.25)',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-all text-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Attention Hook */}
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
          <span className="p-1 bg-emerald-500/20 rounded-md">⚡</span>
          <span>Wait! Before You Leave...</span>
        </div>

        {/* Dynamic Business Title */}
        <div className="space-y-1 text-left">
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
            See How <span className="text-emerald-400">{businessName}</span> Can Close 3x More Sales in Under 2 Seconds.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            While you sleep or focus on operations, after-hours Nigerian clients messaging your firm get instant price quotes, BOQ calculations, and booking confirmations 24/7.
          </p>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-2 gap-2 text-left pt-1">
          <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-200">2-Second Auto-Reply</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-200">₦0 Upfront Demo</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-200">Zero Technical Skills</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-200">Natural Nigerian Tone</span>
          </div>
        </div>

        {/* Action 1: Instant Phone Test Form */}
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-3.5 space-y-2 text-left">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test a Live 10-Second Demo On Your Phone Right Now:</span>
          </div>

          <form onSubmit={handlePhoneSubmit} className="flex gap-2 flex-wrap sm:flex-nowrap">
            <input
              type="tel"
              value={userPhone}
              onChange={e => setUserPhone(e.target.value)}
              placeholder="e.g. 0802 279 1227"
              required
              className="flex-1 min-w-[160px] bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={isSending}
              className="py-2 px-3 sm:px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shrink-0"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Test →</span>
                </>
              )}
            </button>
          </form>

          {successMsg && (
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-2 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Action 2: Direct 1-Tap WhatsApp Claim Button */}
        <div className="space-y-2 pt-1">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 text-center"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>🟢 Tap to Chat Bethelmind Lagos Desk (₦0 Upfront) →</span>
          </a>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-center text-[11px] text-slate-500 hover:text-slate-400 py-1 transition-colors"
          >
            No thanks, I will continue reviewing the prototype on this page
          </button>
        </div>

        {/* Trust Footer */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Bethelmind Analytics Lagos Desk · 100% Zero Capital Risk · Verified 24/7 SLA</span>
        </div>
      </div>
    </div>
  );
}
