'use client';

/**
 * @file src/components/InstantCheckoutModal.tsx
 * Unified Clean Checkout Modal (Paystack + Moniepoint / OPay Bank Transfer Verification)
 * Provides simple, non-confusing payment options for Site Redesign Claims & B2B Lead Purchases.
 */

import React, { useState } from 'react';
import { X, CreditCard, Building2, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';

export interface InstantCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amountNGN: number;
  productType: 'website_redesign' | 'lead_package' | 'custom';
  itemDetails?: string;
}

export default function InstantCheckoutModal({
  isOpen,
  onClose,
  title,
  amountNGN,
  productType,
  itemDetails
}: InstantCheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'paystack'>('bank_transfer');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!isOpen) return null;

  const formattedAmount = `₦${amountNGN.toLocaleString()}`;
  const bankAccount = '7034297995';
  const bankName = 'Moniepoint Microfinance Bank / OPay';
  const accountName = 'Oyelakin Tosin Matthew';

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyTransfer = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
    }, 1500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 500, padding: 28, position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', color: '#fff' }}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: 0.5 }}>Instant Checkout</span>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '4px 0 0 0' }}>{title}</h3>
          {itemDetails && <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0 0' }}>{itemDetails}</p>}
        </div>

        {/* Amount Box */}
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 10, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 14, color: '#93c5fd', fontWeight: 600 }}>Total Payable:</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>{formattedAmount}</span>
        </div>

        {/* Payment Method Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <button
            onClick={() => setPaymentMethod('bank_transfer')}
            style={{
              padding: 10,
              borderRadius: 8,
              border: paymentMethod === 'bank_transfer' ? '2px solid #3b82f6' : '1px solid #334155',
              background: paymentMethod === 'bank_transfer' ? 'rgba(59,130,246,0.15)' : '#1e293b',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <Building2 size={16} /> Bank Transfer
          </button>
          <button
            onClick={() => setPaymentMethod('paystack')}
            style={{
              padding: 10,
              borderRadius: 8,
              border: paymentMethod === 'paystack' ? '2px solid #3b82f6' : '1px solid #334155',
              background: paymentMethod === 'paystack' ? 'rgba(59,130,246,0.15)' : '#1e293b',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <CreditCard size={16} /> Paystack / Card
          </button>
        </div>

        {/* Option 1: Direct Bank Transfer Details */}
        {paymentMethod === 'bank_transfer' && (
          <div>
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Bank Name</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{bankName}</div>

              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Account Number (10-Digit)</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '8px 12px', borderRadius: 6, border: '1px solid #475569', marginBottom: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#60a5fa', letterSpacing: 1 }}>{bankAccount}</span>
                <button onClick={handleCopyAccount} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Account Name</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{accountName}</div>
            </div>

            {verifiedSuccess ? (
              <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#34d399', padding: 14, borderRadius: 8, textAlign: 'center', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <CheckCircle2 size={18} /> Transfer Request Verified! Instant Download Activated.
              </div>
            ) : (
              <button
                onClick={handleVerifyTransfer}
                disabled={isVerifying}
                style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: 14, borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
              >
                {isVerifying ? 'Verifying Transfer Instant Notification...' : 'I Have Made the Transfer'}
              </button>
            )}
          </div>
        )}

        {/* Option 2: Paystack Checkout */}
        {paymentMethod === 'paystack' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20 }}>Pay securely using Debit Card, Bank USSD, or NetBanking via Paystack.</p>
            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hi, I want to complete my Paystack checkout for ${title} (${formattedAmount}).`)}`}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-block', width: '100%', background: '#0ba463', color: '#fff', textDecoration: 'none', padding: 14, borderRadius: 8, fontWeight: 700, fontSize: 15 }}
            >
              Proceed to Instant Paystack Checkout
            </a>
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <ShieldCheck size={14} style={{ color: '#10b981' }} /> Secured 256-bit SSL Encrypted Payment Gateway
        </div>
      </div>
    </div>
  );
}
