'use client';

import React, { useState } from 'react';
import { Zap, Phone, QrCode, Volume2, CheckCircle2, Copy, Send, HelpCircle, MessageSquare } from 'lucide-react';

interface BuyerZeroFrictionWidgetProps {
  businessName: string;
  category?: string;
  merchantPhone?: string;
  defaultPriceNGN?: number;
}

export function BuyerZeroFrictionWidget({
  businessName,
  category = 'general',
  merchantPhone = '2348022791227',
  defaultPriceNGN = 185000,
}: BuyerZeroFrictionWidgetProps) {
  const [sliderValue, setSliderValue] = useState(5); // 5kVA or 5 items
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [activeTab, setActiveTab] = useState<'no_tech' | 'copy_bank' | 'scan_qr'>('no_tech');

  // Dynamic calculated price based on visual slider
  const calculatedPriceNGN = Math.round(defaultPriceNGN * (sliderValue / 5));
  const deposit50PercentNGN = Math.round(calculatedPriceNGN * 0.5);

  const cleanPhone = merchantPhone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('234')
    ? cleanPhone
    : cleanPhone.startsWith('0')
    ? '234' + cleanPhone.substring(1)
    : '234' + cleanPhone;

  // Build pre-filled 1-Tap WhatsApp Checkout URL
  const checkoutMessage = `Hello ${businessName}! I am accepting your offer:\n\n` +
    `• *Selected Package:* ${sliderValue}kVA / Level Executive Offer\n` +
    `• *Total Price:* ₦${calculatedPriceNGN.toLocaleString()}\n` +
    `• *50% Deposit:* ₦${deposit50PercentNGN.toLocaleString()}\n\n` +
    `Please confirm delivery timeline and Moniepoint DVA bank transfer details!`;

  const waCheckoutUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(checkoutMessage)}`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('7034297995');
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2500);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
      border: '1px solid #4338ca',
      borderRadius: '20px',
      padding: '24px',
      color: '#f8fafc',
      maxWidth: '580px',
      margin: '24px auto',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '8px', borderRadius: '10px', color: '#818cf8' }}>
            <Zap size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
              3 Easy Options To Accept Offer
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>
              Select the simplest option for your technical comfort
            </span>
          </div>
        </div>

        {/* 15s Audio Explainer Widget */}
        <button
          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
          style={{
            background: isPlayingAudio ? '#22c55e' : 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '6px 12px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Volume2 size={14} />
          {isPlayingAudio ? 'Playing...' : 'Listen Audio'}
        </button>
      </div>

      {/* Audio Transcript Bar */}
      {isPlayingAudio && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '0.82rem',
          color: '#86efac',
          marginBottom: '20px',
          lineHeight: '1.4',
        }}>
          🔊 <em>"Alhaji, this {sliderValue}kVA package go power your house for 24 hours straight without noise or diesel. Choose any of the 3 simple options below to order!"</em>
        </div>
      )}

      {/* Visual Range Slider */}
      <div style={{ background: '#0f172a', padding: '16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '8px' }}>
          <span>SELECT SYSTEM CAPACITY / SCOPE</span>
          <span style={{ color: '#818cf8' }}>{sliderValue} kVA / Level</span>
        </div>

        <input
          type="range"
          min="1"
          max="15"
          step="1"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            accentColor: '#6366f1',
            cursor: 'pointer',
            marginBottom: '12px',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #1e293b' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>ESTIMATED TOTAL</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
              ₦{calculatedPriceNGN.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>50% DEPOSIT</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
              ₦{deposit50PercentNGN.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 3-Option Mode Selector Buttons */}
      <div style={{ display: 'flex', gap: '6px', background: '#090d16', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('no_tech')}
          style={{
            flex: 1,
            padding: '10px 6px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'no_tech' ? 'linear-gradient(135deg, #25D366 0%, #16a34a 100%)' : 'transparent',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <MessageSquare size={14} />
          1. WhatsApp/Call (Zero Tech)
        </button>

        <button
          onClick={() => setActiveTab('copy_bank')}
          style={{
            flex: 1,
            padding: '10px 6px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'copy_bank' ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'transparent',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <Copy size={14} />
          2. Copy Bank Account
        </button>

        <button
          onClick={() => setActiveTab('scan_qr')}
          style={{
            flex: 1,
            padding: '10px 6px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'scan_qr' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <QrCode size={14} />
          3. Scan QR Code
        </button>
      </div>

      {/* Tab Content 1: Absolute Zero Tech (Direct Call / WhatsApp) */}
      {activeTab === 'no_tech' && (
        <div style={{ background: '#0f172a', border: '1px solid #22c55e', borderRadius: '14px', padding: '18px', textDecoration: 'none' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#86efac', marginBottom: '6px' }}>
            🟢 OPTION 1: Direct WhatsApp Chat / Call (No Codes, No Tech Required!)
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '16px', lineHeight: '1.4' }}>
            Don't like copying numbers or scanning codes? Simply click below to speak or chat directly with us on WhatsApp!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <a
              href={waCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #16a34a 100%)',
                color: '#fff',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.88rem',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Send size={16} />
              Chat on WhatsApp
            </a>

            <a
              href={`tel:+${formattedPhone}`}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#fff',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.88rem',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Phone size={16} style={{ color: '#38bdf8' }} />
              Call Phone Number
            </a>
          </div>
        </div>
      )}

      {/* Tab Content 2: Copy Bank Account */}
      {activeTab === 'copy_bank' && (
        <div style={{ background: '#0f172a', border: '1px solid #6366f1', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '6px' }}>
            🔵 OPTION 2: Copy Moniepoint Account & Transfer via Any Mobile Bank App
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '14px' }}>
            Tap the button below to copy the 10-digit account number, then open GTB, Zenith, FirstBank, OPay, or Moniepoint app to paste and transfer.
          </p>

          <div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>MONIEPOINT MICROFINANCE BANK</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>7034297995</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Name: ApexReach / {businessName}</div>
            </div>
            <button
              onClick={handleCopyAccount}
              style={{
                background: copiedAcc ? '#22c55e' : '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {copiedAcc ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {copiedAcc ? 'Copied!' : 'Copy Account'}
            </button>
          </div>
        </div>
      )}

      {/* Tab Content 3: Scan QR Code */}
      {activeTab === 'scan_qr' && (
        <div style={{ background: '#0f172a', border: '1px solid #0284c7', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
            🟣 OPTION 3: Scan Bank App QR Code (For Tech-Savvy Users)
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '14px' }}>
            Open your mobile bank app camera or scanner to auto-fill account number and transfer amount instantly.
          </p>

          <div style={{ background: '#fff', padding: '14px', borderRadius: '12px', display: 'inline-block', marginBottom: '10px' }}>
            <svg width="110" height="110" viewBox="0 0 100 100" fill="#000">
              <rect x="10" y="10" width="25" height="25" fill="#000"/>
              <rect x="15" y="15" width="15" height="15" fill="#fff"/>
              <rect x="18" y="18" width="9" height="9" fill="#000"/>
              
              <rect x="65" y="10" width="25" height="25" fill="#000"/>
              <rect x="70" y="15" width="15" height="15" fill="#fff"/>
              <rect x="73" y="18" width="9" height="9" fill="#000"/>
              
              <rect x="10" y="65" width="25" height="25" fill="#000"/>
              <rect x="15" y="70" width="15" height="15" fill="#fff"/>
              <rect x="18" y="73" width="9" height="9" fill="#000"/>

              <rect x="40" y="40" width="20" height="20" fill="#6366f1"/>
            </svg>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Moniepoint Account: <strong style={{ color: '#fff' }}>7034297995</strong>
          </div>
        </div>
      )}
    </div>
  );
}
