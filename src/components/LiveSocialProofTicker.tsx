'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Flame, CheckCircle2, X } from 'lucide-react';

interface ProofItem {
  id: number;
  business: string;
  action: string;
  location: string;
  timeAgo: string;
  category: string;
}

const VERIFIED_PROOFS: ProofItem[] = [
  { id: 1, business: 'Lumos Commercial Solar', action: 'Generated ₦4.8M Commercial BOQ Quoter', location: 'Victoria Island, Lagos', timeAgo: '4 mins ago', category: 'Solar & Renewable' },
  { id: 2, business: 'Berger Tokunbo Auto Hub', action: 'Automated 2026 Customs Duty & VIN Sizer', location: 'Apapa Corridor, Lagos', timeAgo: '12 mins ago', category: 'Automotive' },
  { id: 3, business: 'St. Nicholas Clinic Desk', action: 'Booked 14 After-Hours Patient Consultations', location: 'Ikeja Commercial Hub', timeAgo: '21 mins ago', category: 'Healthcare' },
  { id: 4, business: 'Lekki Luxury Shortlet Suites', action: 'Activated Direct Caution Fee & Room Booking', location: 'Lekki Phase 1, Lagos', timeAgo: '35 mins ago', category: 'Shortlet & Hotels' },
  { id: 5, business: 'Crownfield Academy', action: 'Automated Termly Fee Quoting for Parents', location: 'Wuse 2, Abuja FCT', timeAgo: '48 mins ago', category: 'Education' },
  { id: 6, business: 'Swift Logistics & Haulage', action: 'Instant Waybill Quoter & Route Calculator', location: 'Surulere, Lagos', timeAgo: '1 hour ago', category: 'Logistics' },
];

export function LiveSocialProofTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % VERIFIED_PROOFS.length);
        setVisible(true);
      }, 400);
    }, 8000);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const current = VERIFIED_PROOFS[currentIndex];

  return (
    <aside
      aria-label="Real-time commercial proof activity"
      style={{
        position: 'fixed',
        bottom: isMobile ? '84px' : '24px',
        left: isMobile ? '10px' : '20px',
        right: isMobile ? '10px' : 'auto',
        maxWidth: isMobile ? '100%' : '380px',
        zIndex: 48,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        pointerEvents: 'none',
      }}
    >
      {/* Live Social Proof Toast */}
      <div
        style={{
          background: 'rgba(7, 11, 20, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '14px',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#ffffff',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8)',
          transition: 'all 0.4s ease',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          pointerEvents: 'auto',
          position: 'relative'
        }}
      >
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            padding: '7px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Flame size={16} />
        </div>

        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {current.category}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>• {current.timeAgo}</span>
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {current.business}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {current.action} ({current.location})
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          aria-label="Dismiss notification"
        >
          <X size={13} />
        </button>
      </div>
    </aside>
  );
}

export default LiveSocialProofTicker;
