'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Zap, ShieldCheck, Code, Sparkles, X, Calendar, Phone } from 'lucide-react';
import OneTapDemoSchedulerModal from '@/components/OneTapDemoSchedulerModal';

interface StickyMobileConversionBarProps {
  businessName: string;
  area?: string;
  category?: string;
  hasWebsite?: boolean;
  website?: string;
  adminPhone?: string;
}

export default function StickyMobileConversionBar({
  businessName,
  area = 'Lagos',
  category = 'Commercial Enterprise',
  hasWebsite = false,
  website,
  adminPhone = '2348022791227'
}: StickyMobileConversionBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setHasScrolled(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const isExistingWeb = Boolean(hasWebsite || (website && website.startsWith('http')));

  const previewLink = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://www.bethelmindanalytics.com/preview/${businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  const offerText = isExistingWeb ? '1-Line WhatsApp Embed Upgrade' : 'Turnkey Business Website + 24/7 AI Assistant';

  const prefilledMessage = encodeURIComponent(
    `Hello Bethelmind Digital Solutions! I just viewed the live website prototype for *${businessName}* (${category}) in ${area}.\n\nDemo Link: ${previewLink}\n\nPlease help me lock in our 6-Month Independence Bundle (₦75k Total · ₦35k Deposit today, balance after live approval).`
  );
  const waUrl = `https://wa.me/${adminPhone}?text=${prefilledMessage}`;

  return (
    <aside 
      aria-label="Instant Conversion Bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '10px 14px',
        background: 'rgba(7, 11, 20, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(16, 185, 129, 0.35)',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.7)',
        boxSizing: 'border-box'
      }}
    >
      <div 
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {/* Main 1-Tap High-Conversion WhatsApp Closer Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.85rem',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 6px #ffffff', flexShrink: 0 }}></span>
            <div style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.95, display: 'block', fontWeight: 800, color: '#fef08a' }}>
                🇳🇬 Direct SME Rate (₦65k) · Start With ₦35k Deposit
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                🟢 Claim Starter Package on WhatsApp →
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 0, 0, 0.25)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
            <MessageCircle size={14} />
            <span>Chat</span>
          </div>
        </a>

        {/* Quick Call Direct Hotline */}
        <a
          href="tel:+2348022791227"
          style={{
            padding: '10px 12px',
            borderRadius: '12px',
            background: '#0f172a',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            flexShrink: 0
          }}
          title="Call Lagos Desk directly: 0802 279 1227"
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Phone className="w-3.5 h-3.5" /> Call</span>
        </a>

        {/* Quick 10-Min Demo Book Button */}
        <button
          onClick={() => setShowScheduler(true)}
          style={{
            padding: '10px',
            borderRadius: '12px',
            background: '#0f172a',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
          title="Book 10-Min Demo"
        >
          <Calendar size={18} />
        </button>

        {/* Dismiss mini button */}
        <button
          onClick={() => setIsVisible(false)}
          style={{
            padding: '10px',
            borderRadius: '12px',
            background: '#0f172a',
            border: '1px solid #1e293b',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
          aria-label="Dismiss bar"
        >
          <X size={16} />
        </button>
      </div>

      {/* Trust Micro-Badge */}
      <div className="flex items-center justify-center gap-3 mt-1.5 text-[10px] text-slate-400 font-medium">
        <span className="flex items-center gap-1 text-emerald-400">
          <Zap className="w-3 h-3 text-emerald-400 fill-current" />
          CAC Certified Enterprise: Bethelmind Digital Solutions
        </span>
        <span>•</span>
        <span className="flex items-center gap-1 text-slate-300">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Corporate Moniepoint Verified (6805375225)
        </span>
      </div>

      {/* One-Tap Demo Scheduler Modal */}
      <OneTapDemoSchedulerModal
        isOpen={showScheduler}
        onClose={() => setShowScheduler(false)}
        businessName={businessName}
        category={category}
        area={area}
        adminPhone={adminPhone}
      />
    </aside>
  );
}

