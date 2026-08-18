'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Copy, Check, Clock, ShieldCheck, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

interface MoniepointDvaClaimBoxProps {
  businessName: string;
  leadId?: string;
  fullPriceNGN?: number;
  depositPriceNGN?: number;
}

export function MoniepointDvaClaimBox({
  businessName,
  leadId,
  fullPriceNGN = 185000,
  depositPriceNGN = 92500,
}: MoniepointDvaClaimBoxProps) {
  const [isDeposit, setIsDeposit] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins timer
  const [loading, setLoading] = useState(false);
  const [dvaData, setDvaData] = useState<any>(null);
  const [pollingStatus, setPollingStatus] = useState<string>('Listening for transfer on Moniepoint network...');

  const activePrice = isDeposit ? depositPriceNGN : fullPriceNGN;

  useEffect(() => {
    // Generate Virtual Account on mount
    fetchDva(isDeposit);
  }, [isDeposit]);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDva = async (deposit: boolean) => {
    setLoading(true);
    try {
      const res = await fetch('/api/preview/claim-dva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          businessName,
          isDeposit: deposit,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDvaData(data);
      }
    } catch (err) {
      console.error('Failed to fetch DVA:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAccount = async () => {
    if (!dvaData?.dva?.accountNumber) return;
    const success = await copyToClipboard(dvaData.dva.accountNumber);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      border: '1px solid #4338ca',
      borderRadius: '20px',
      padding: '28px',
      color: '#f8fafc',
      maxWidth: '540px',
      margin: '0 auto',
      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '10px', borderRadius: '12px', color: '#818cf8' }}>
            <Building2 size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
              Instant Moniepoint Bank Transfer
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>
              👑 Claim Custom Portal & Domain ({businessName})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', color: '#fca5a5', fontWeight: 600 }}>
          <Clock size={14} />
          Expires in {formatTimer(timeLeft)}
        </div>
      </div>

      {/* Toggle Option */}
      <div style={{ display: 'flex', background: '#090d16', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => setIsDeposit(true)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: isDeposit ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'transparent',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          50% Deposit (₦{depositPriceNGN.toLocaleString()})
        </button>
        <button
          onClick={() => setIsDeposit(false)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: !isDeposit ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'transparent',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Full Claim (₦{fullPriceNGN.toLocaleString()})
        </button>
      </div>

      {/* Account Details Box */}
      <div style={{ background: '#090d16', border: '1px dashed #6366f1', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '8px' }}>
          <span>BANK NAME</span>
          <span style={{ color: '#818cf8', fontWeight: 600 }}>Moniepoint Microfinance Bank</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '2px' }}>ACCOUNT NUMBER</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '1px', fontFamily: 'monospace' }}>
              {loading ? 'Generating...' : dvaData?.dva?.accountNumber || '7034297995'}
            </div>
          </div>
          <button
            onClick={handleCopyAccount}
            style={{
              background: copied ? '#22c55e' : '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94a3b8' }}>
          <span>ACCOUNT NAME</span>
          <span style={{ color: '#f8fafc', fontWeight: 600 }}>{dvaData?.dva?.accountName || `Bethelmind Analytics / ${businessName}`}</span>
        </div>

        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700 }}>
          <span>PAYMENT AMOUNT</span>
          <span style={{ color: '#38bdf8' }}>₦{activePrice.toLocaleString()} NGN</span>
        </div>
      </div>

      {/* Polling Indicator */}
      <div style={{
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '10px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.82rem',
        color: '#c7d2fe',
        marginBottom: '20px',
      }}>
        <RefreshCw size={16} className="animate-spin" style={{ color: '#818cf8', flexShrink: 0 }} />
        <span>{pollingStatus}</span>
      </div>

      {/* Money-Back Seal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8', justifyContent: 'center' }}>
        <ShieldCheck size={18} style={{ color: '#22c55e' }} />
        <span>100% Money-Back Guarantee & Verified Business Seal</span>
      </div>
    </div>
  );
}
