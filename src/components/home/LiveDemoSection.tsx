'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, MessageSquare, Volume2, ShieldCheck, Sun, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { paymentConfig, buildWhatsAppLink } from '@/config/payment';

interface LiveDemoSectionProps {
  businessName?: string;
  selectedIndustry?: string;
}

export default function LiveDemoSection({
  businessName = 'My Business',
  selectedIndustry = 'solar',
}: LiveDemoSectionProps) {
  const [activeTab, setActiveTab] = useState<'audio' | 'whatsapp' | 'solar' | 'bank'>('audio');

  // Real Audio Voice Note Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState('0:00');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sample_voice_ng.mp3');
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          const cur = audioRef.current.currentTime;
          const dur = audioRef.current.duration || 15;
          setAudioProgress((cur / dur) * 100);
          const mins = Math.floor(cur / 60);
          const secs = Math.floor(cur % 60);
          setAudioCurrentTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }
      };
      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
        setAudioProgress(0);
        setAudioCurrentTime('0:00');
      };
      audioRef.current.onerror = () => {
        setIsPlayingAudio(false);
      };
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.warn('Audio playback notice:', err);
      });
    }
  };

  // Solar Quick Simulator
  const [solarTier, setSolarTier] = useState<'3.5kva' | '5kva' | '10kva'>('5kva');
  const solarSpecs = useMemo(() => {
    if (solarTier === '3.5kva') {
      return { kva: '3.5kVA', battery: '4.8kWh LiFePO4', monthlySavings: '₦125,000 / month', boqRange: '₦2.8M – ₦3.4M' };
    }
    if (solarTier === '10kva') {
      return { kva: '10kVA Commercial', battery: '15.36kWh LiFePO4', monthlySavings: '₦360,000 / month', boqRange: '₦7.5M – ₦9.2M' };
    }
    return { kva: '5kVA Pure Sine Wave', battery: '5.12kWh LiFePO4', monthlySavings: '₦185,000 / month', boqRange: '₦4.2M – ₦5.1M' };
  }, [solarTier]);

  // Bank Reconciliation Simulation
  const [bankStatus, setBankStatus] = useState<'idle' | 'detecting' | 'verified'>('idle');
  const triggerBankSimulation = () => {
    setBankStatus('detecting');
    setTimeout(() => {
      setBankStatus('verified');
    }, 900);
  };

  const testOnWhatsAppUrl = `https://wa.me/${paymentConfig.whatsappNumber}?text=${encodeURIComponent(
    'Hello Bethelmind Lagos Desk! I am testing the live demo on your website and would like to experience the 24/7 AI quotation workflow firsthand.'
  )}`;

  return (
    <section
      id="demo"
      aria-labelledby="live-demo-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 scroll-mt-24"
    >
      <div className="text-center max-w-2xl mx-auto space-y-3.5">
        <span className="text-[11px] font-medium text-[#c5a880] uppercase tracking-widest block">
          Interactive Proof of Concept
        </span>
        <h2
          id="live-demo-heading"
          className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal text-[#f5f3ef] tracking-tight"
        >
          Experience the workflow <br className="hidden sm:inline" />
          <span className="italic font-light text-[#d4af37]">before you commit.</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#c9c4bc] font-light leading-relaxed">
          Test real Nigerian voice notes, sub-2s WhatsApp quotation responses, and automated bank reconciliation right in your browser.
        </p>
      </div>

      {/* Main Luxury Demo Shell */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#0a0d14] border border-white/[0.08] shadow-2xl shadow-black/80 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/[0.06] pb-4">
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${
              activeTab === 'audio'
                ? 'bg-[#d4af37] text-slate-950 font-semibold'
                : 'text-[#c9c4bc] hover:text-[#f5f3ef] bg-white/[0.02]'
            }`}
          >
            Nigerian Voice Note
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-[#d4af37] text-slate-950 font-semibold'
                : 'text-[#c9c4bc] hover:text-[#f5f3ef] bg-white/[0.02]'
            }`}
          >
            Sub-2s WhatsApp Closer
          </button>
          <button
            onClick={() => setActiveTab('solar')}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${
              activeTab === 'solar'
                ? 'bg-[#d4af37] text-slate-950 font-semibold'
                : 'text-[#c9c4bc] hover:text-[#f5f3ef] bg-white/[0.02]'
            }`}
          >
            Solar BOQ Sizer
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${
              activeTab === 'bank'
                ? 'bg-[#d4af37] text-slate-950 font-semibold'
                : 'text-[#c9c4bc] hover:text-[#f5f3ef] bg-white/[0.02]'
            }`}
          >
            Bank Transfer Shield
          </button>
        </div>

        {/* Tab Content: Audio Voice Note */}
        {activeTab === 'audio' && (
          <div className="space-y-6 max-w-xl mx-auto text-center py-4">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                Natural Human Rapport
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#f5f3ef]">
                Nigerian Accent Audio Bubble
              </h3>
              <p className="text-xs sm:text-sm text-[#c9c4bc] font-light leading-relaxed">
                Rather than robotic automated text, your assistant sends 15-second personalized voice notes in a warm, professional Nigerian tone that builds immediate trust.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1017] border border-white/[0.06] flex items-center gap-4 text-left">
              <button
                onClick={toggleAudio}
                className="w-12 h-12 rounded-xl bg-[#d4af37] hover:bg-[#c5a880] text-slate-950 flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md shadow-[#d4af37]/20"
                aria-label={isPlayingAudio ? 'Pause Voice Note' : 'Play Voice Note'}
              >
                {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#c9c4bc]">
                  <span className="font-medium text-[#f5f3ef]">Voice Note: Commercial Inverter Inquiry</span>
                  <span className="font-mono text-[11px] text-[#8e887e]">{audioCurrentTime} / 0:15</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#d4af37] transition-all duration-200" 
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: WhatsApp Speed-to-Lead Closer */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4 max-w-lg mx-auto py-2">
            <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/[0.06] space-y-3 font-sans text-xs">
              
              {/* Buyer message */}
              <div className="flex justify-end">
                <div className="bg-[#121824] text-[#f5f3ef] p-3 rounded-2xl rounded-tr-sm max-w-[85%] space-y-1">
                  <p>Good evening, do you have 5kVA solar inverters with 5kWh lithium batteries in stock? How much?</p>
                  <span className="text-[10px] text-[#8e887e] text-right block">10:42 PM &bull; Delivered</span>
                </div>
              </div>

              {/* AI Assistant instant reply */}
              <div className="flex justify-start">
                <div className="bg-[#0f172a] border border-[#d4af37]/30 text-[#f5f3ef] p-3.5 rounded-2xl rounded-tl-sm max-w-[88%] space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#d4af37] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                    <span>Bethelmind 24/7 Concierge &bull; 10:42 PM (1.8s reply)</span>
                  </div>
                  <p className="leading-relaxed">
                    Good evening! Yes, our <strong>5kVA Pure Sine Wave Inverter + 5.12kWh LiFePO4 battery</strong> package is currently available in our Ikeja warehouse.
                  </p>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#8e887e]">System Price:</span>
                      <span className="font-mono text-[#f5f3ef] font-semibold">₦4,450,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8e887e]">Monthly Diesel Saved:</span>
                      <span className="font-mono text-[#d4af37] font-semibold">₦185,000 / mo</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#c9c4bc]">
                    Would you like our engineer to generate a tailored PDF proposal for your property right now?
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab Content: Solar BOQ Quick Sizer */}
        {activeTab === 'solar' && (
          <div className="space-y-6 max-w-xl mx-auto py-2">
            <div className="flex items-center justify-center gap-2">
              {(['3.5kva', '5kva', '10kva'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSolarTier(tier)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    solarTier === tier
                      ? 'bg-[#d4af37] text-slate-950 font-bold'
                      : 'bg-white/[0.03] text-[#c9c4bc] hover:text-[#f5f3ef] border border-white/[0.06]'
                  }`}
                >
                  {tier.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3.5 rounded-xl bg-[#0c1017] border border-white/[0.06]">
                <span className="text-[10px] text-[#8e887e] block">Recommended System</span>
                <span className="text-xs font-semibold text-[#f5f3ef] mt-0.5 block">{solarSpecs.kva}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0c1017] border border-white/[0.06]">
                <span className="text-[10px] text-[#8e887e] block">Battery Capacity</span>
                <span className="text-xs font-semibold text-[#f5f3ef] mt-0.5 block">{solarSpecs.battery}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0c1017] border border-white/[0.06]">
                <span className="text-[10px] text-[#8e887e] block">Monthly Diesel Avoidance</span>
                <span className="text-xs font-mono font-semibold text-[#d4af37] mt-0.5 block">{solarSpecs.monthlySavings}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0c1017] border border-white/[0.06]">
                <span className="text-[10px] text-[#8e887e] block">Estimated BOQ Bracket</span>
                <span className="text-xs font-mono font-semibold text-[#f5f3ef] mt-0.5 block">{solarSpecs.boqRange}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Bank Transfer Reconciliation */}
        {activeTab === 'bank' && (
          <div className="space-y-6 max-w-xl mx-auto text-center py-2">
            <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.06] space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                  Zero Fake Alert Vulnerability
                </span>
                <h4 className="font-serif text-lg text-[#f5f3ef]">Moniepoint NIP Webhook Reconciliation</h4>
              </div>

              {bankStatus === 'idle' && (
                <button
                  onClick={triggerBankSimulation}
                  className="px-6 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-[#f5f3ef] border border-white/[0.1] text-xs font-medium transition-all"
                >
                  Simulate Inbound ₦75,000 Transfer
                </button>
              )}

              {bankStatus === 'detecting' && (
                <div className="text-xs text-[#d4af37] flex items-center justify-center gap-2 animate-pulse font-mono">
                  <span>Listening for NIP interbank ledger webhook...</span>
                </div>
              )}

              {bankStatus === 'verified' && (
                <div className="p-3 rounded-xl bg-[#07130f] border border-emerald-500/30 text-left space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>NIP Credit Verified &bull; Reference BM-TRF-88421</span>
                  </div>
                  <p className="text-[#c9c4bc] text-[11px]">
                    Ledger balance confirmed via Moniepoint MFB. Digital invoice released. Receipt auto-sent to buyer on WhatsApp.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Link to Live Testing */}
        <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-[#8e887e]">
            Ready to test live with your actual products?
          </span>

          <a
            href={testOnWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a880] text-slate-950 font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span>Test on Your Phone (0802 279 1227)</span>
          </a>
        </div>

      </div>
    </section>
  );
}
