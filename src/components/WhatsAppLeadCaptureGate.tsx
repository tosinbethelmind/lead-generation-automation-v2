'use client';

import React, { useState } from 'react';
import { 
  MessageCircle, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lock,
  Phone,
  User,
  AlertCircle
} from 'lucide-react';

export interface WhatsAppLeadCaptureGateProps {
  toolType?: 'solar' | 'vin' | 'fake-alert' | 'general';
  toolTitle?: string;
  calculationSummary?: string;
  onSuccessCapture?: (phone: string) => void;
  onDirectDownloadPdf?: () => void;
}

export default function WhatsAppLeadCaptureGate({
  toolType = 'solar',
  toolTitle = '2026 Engineering Technical Proposal',
  calculationSummary = '',
  onSuccessCapture,
  onDirectDownloadPdf,
}: WhatsAppLeadCaptureGateProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chatUrl, setChatUrl] = useState('');
  const [capturedPhoneDisplay, setCapturedPhoneDisplay] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setErrorMessage('Please enter an 11-digit Nigerian WhatsApp number (e.g. 0802 123 4567).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/lead-capture/whatsapp-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          fullName,
          toolType,
          calculationSummary,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        setCapturedPhoneDisplay(data.phoneDisplay || phone);
        setChatUrl(data.fallbackWhatsAppUrl || `https://wa.me/2348022791227?text=${encodeURIComponent('Hello Bethelmind, I requested my technical PDF report.')}`);
        if (onSuccessCapture) {
          onSuccessCapture(data.phone);
        }
      } else {
        setErrorMessage(data.error || 'Failed to submit. Please check your phone number and try again.');
      }
    } catch (err: any) {
      setErrorMessage('Network connection error. Please tap the WhatsApp hotline below directly.');
      setChatUrl(`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Lagos Desk! I need the ${toolTitle} for ${phone}.`)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#d4af37]/35 bg-gradient-to-b from-[#0a1220] via-[#070b14] to-[#05070d] p-6 sm:p-8 shadow-2xl shadow-black/80 my-8">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {!isSuccess ? (
        <div className="relative z-10 max-w-xl mx-auto space-y-6 text-center sm:text-left">
          
          {/* Badge & Lock */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Official Stamped Delivery</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CAC Certified Enterprise #9912717</span>
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#f5f3ef] tracking-tight">
              Get Your Official Stamped Breakdown &amp; Wholesale Directory Sent to WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-[#c9c4bc] font-light leading-relaxed">
              Enter your WhatsApp number below. Our Lagos desk will immediately dispatch your complete engineering PDF calculation, direct Alaba &amp; Trade Fair wholesale contact whitelist, and warranty certificate free.
            </p>
          </div>

          {/* Value Bullet Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-left pt-1">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[#e6e2dd] font-light">Bankable PDF Proposal &amp; BOQ</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[#e6e2dd] font-light">Lagos Wholesaler Price List</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[#e6e2dd] font-light">Moniepoint Escrow Safe (6805375225)</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[#e6e2dd] font-light">24/7 Senior Engineer Follow-up</span>
            </div>
          </div>

          {/* Capture Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Optional Name */}
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#d4af37] transition"
                />
              </div>

              {/* Phone (WhatsApp) */}
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp No (e.g. 0802 279 1227)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400 transition font-mono"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Lagos WhatsApp Dispatch Desk...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send Stamped PDF &amp; Wholesale List to My WhatsApp &rarr;</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center font-light">
              🔒 100% Free &bull; Zero spam &bull; Direct technical response from our verified Lagos engineers.
            </p>
          </form>

        </div>
      ) : (
        /* SUCCESS STATE */
        <div className="relative z-10 max-w-lg mx-auto text-center space-y-5 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-normal text-white">
              Report Dispatched to WhatsApp!
            </h3>
            <p className="text-xs sm:text-sm text-[#c9c4bc] font-light leading-relaxed">
              Your official stamped technical report has been queued for delivery to <strong className="text-emerald-400 font-mono font-semibold">{capturedPhoneDisplay}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs text-[#c9c4bc] text-left space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Active on Lagos Desk
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>CAC Registration:</span>
              <span className="text-white font-mono">Reg: 9912717</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Settlement Account:</span>
              <span className="text-[#d4af37] font-mono">Moniepoint (6805375225)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {chatUrl && (
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Open WhatsApp Chat Directly &rarr;</span>
              </a>
            )}

            {onDirectDownloadPdf && (
              <button
                type="button"
                onClick={onDirectDownloadPdf}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#d4af37] border border-[#d4af37]/40 font-bold text-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Instant PDF Download</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
