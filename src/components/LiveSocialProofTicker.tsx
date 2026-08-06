'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Flame, Award, CheckCircle2 } from 'lucide-react';

interface ProofItem {
  id: number;
  text: string;
  timeAgo: string;
  category: string;
}

const SAMPLE_PROOFS: ProofItem[] = [
  { id: 1, text: 'Solar Installer in Ikeja, Lagos', timeAgo: '8 mins ago', category: 'Solar Energy' },
  { id: 2, text: 'Tokunbo Car Dealer in Lekki Phase 1', timeAgo: '24 mins ago', category: 'Automotive' },
  { id: 3, text: 'Corporate Legal Firm in Victoria Island', timeAgo: '42 mins ago', category: 'Legal Services' },
  { id: 4, text: 'Private Secondary School in Abuja (Wuse 2)', timeAgo: '1 hour ago', category: 'Education' },
  { id: 5, text: 'Diagnostic Center in Port Harcourt (GRA)', timeAgo: '2 hours ago', category: 'Healthcare' },
];

export function LiveSocialProofTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SAMPLE_PROOFS.length);
        setVisible(true);
      }, 400);
    }, 7000); // cycle every 7 seconds

    return () => clearInterval(interval);
  }, []);

  const current = SAMPLE_PROOFS[currentIndex];

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 9990,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      pointerEvents: 'none',
    }}>
      {/* Verified Business Shield Badge */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(34, 197, 94, 0.4)',
        borderRadius: '12px',
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#f8fafc',
        fontSize: '0.8rem',
        fontWeight: 600,
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        pointerEvents: 'auto',
      }}>
        <ShieldCheck size={18} style={{ color: '#22c55e' }} />
        <span>Verified Local Business Shield</span>
      </div>

      {/* Live Social Proof Toast */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        border: '1px solid #6366f1',
        borderRadius: '14px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#fff',
        boxShadow: '0 15px 30px rgba(0,0,0,0.6)',
        transition: 'all 0.4s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        pointerEvents: 'auto',
        maxWidth: '340px',
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          color: '#f87171',
          padding: '6px',
          borderRadius: '50%',
          display: 'flex',
        }}>
          <Flame size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.78rem', color: '#a5b4fc', fontWeight: 600 }}>
            {current.category} Portal Claimed
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {current.text}
          </div>
        </div>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
          {current.timeAgo}
        </span>
      </div>
    </div>
  );
}
