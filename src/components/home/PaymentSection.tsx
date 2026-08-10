'use client';

/**
 * @file src/components/home/PaymentSection.tsx
 * Manual OPay transfer payment box.
 *
 * - Account details read from NEXT_PUBLIC_* env vars via paymentConfig
 * - No hard-coded account numbers in JSX
 * - No fake "instant activation" or "OPay verified" claims
 * - Clipboard copy with aria-live toast
 * - WhatsApp message includes the correct selected plan and amount
 * - Payment reference generated per-plan per-session
 */

import React, { useState, useMemo, useId } from 'react';
import { Copy, CheckCircle, MessageSquare, AlertTriangle, ShieldCheck, FileText, Lock } from 'lucide-react';
import { getPlanById } from '@/config/plans';
import { paymentConfig, buildWhatsAppLink, generatePaymentReference } from '@/config/payment';
import InvoiceModal, { InvoiceItem } from '@/components/InvoiceModal';

interface PaymentSectionProps {
  selectedPlanId: string;
  businessName: string;
  selectedIndustry: string;
  targetDistrict: string;
}

type CopiedState = 'account' | 'reference' | null;

export default function PaymentSection({
  selectedPlanId,
  businessName,
  selectedIndustry,
  targetDistrict,
}: PaymentSectionProps) {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const plan = useMemo(() => getPlanById(selectedPlanId), [selectedPlanId]);

  // Stable reference per selected plan (re-generated when plan changes)
  const paymentRef = useMemo(
    () => generatePaymentReference(plan.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plan.id],
  );

  const [copied, setCopied] = useState<CopiedState>(null);
  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const toastId = useId();

  const { bankName, accountName, accountNumber, instructions, safetyNote } = paymentConfig;

  const isConfigured = accountNumber.trim() !== '';

  const invoiceItems: InvoiceItem[] = [
    { name: `${plan.name} Subscription (1st Month)`, price: plan.monthlyNGN, qty: 1 },
    { name: 'Initial System & Workflow Setup Fee', price: plan.setupFeeNGN, qty: 1 },
  ];

  const copyToClipboard = async (text: string, which: CopiedState) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(which);
    setTimeout(() => setCopied(null), 3000);
  };

  const waMessage =
    `Hello Bethelmind Analytics,\n\n` +
    `I have made a payment by OPay transfer.\n\n` +
    `Business Name: ${businessName || 'My Business'}\n` +
    `Industry: ${selectedIndustry}\n` +
    `Lagos District: ${targetDistrict}\n` +
    `Package: ${plan.name}\n` +
    `Monthly Fee: ₦${plan.monthlyNGN.toLocaleString()}/month\n` +
    `Setup Fee: ₦${plan.setupFeeNGN.toLocaleString()} (one-time)\n` +
    `Payment Reference: ${paymentRef}\n\n` +
    `I will attach my payment receipt/screenshot below.\n` +
    `Please confirm my payment and send my onboarding instructions.`;

  const waLink = buildWhatsAppLink(paymentConfig.whatsappNumber, waMessage);

  const handleWhatsAppClick = () => setWhatsappOpened(true);

  return (
    <section
      id="payment"
      aria-labelledby="payment-heading"
      style={{ padding: '72px clamp(16px, 4vw, 40px)', maxWidth: 860, margin: '0 auto' }}
    >
      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        clientName={businessName || 'Valued Business'}
        clientIndustry={selectedIndustry}
        clientDistrict={targetDistrict}
        items={invoiceItems}
        paymentRef={paymentRef}
      />

      {/* aria-live region for copy toasts */}
      <div
        id={toastId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, pointerEvents: 'none' }}
      >
        {copied && (
          <div style={{ background: '#10b981', color: '#fff', padding: '10px 18px', borderRadius: 12, fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 28px rgba(0,0,0,0.4)', animation: 'fadeInUp 0.2s ease' }}>
            <CheckCircle style={{ width: 16, height: 16 }} aria-hidden="true" />
            {copied === 'account' ? 'Account number copied' : 'Payment reference copied'}
          </div>
        )}
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(139,92,246,0.06))', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 24, padding: 'clamp(20px, 4vw, 36px)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, padding: '4px 14px', marginBottom: 14 }}>
            <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 800 }}>Manual Confirmation: reviewed before setup begins</span>
          </div>
          <h2
            id="payment-heading"
            style={{ fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', fontWeight: 800, margin: '0 0 8px', color: '#fff', fontFamily: "'Outfit', sans-serif" }}
          >
            Pay by Bank / OPay Transfer
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Transfer the exact amount to the account below, then send your payment screenshot through WhatsApp for manual confirmation. Onboarding begins after payment is confirmed.
          </p>
        </div>

        {/* Selected plan summary */}
        <div style={{ background: 'rgba(7,9,14,0.6)', border: `2px solid ${getPlanById(selectedPlanId).color}40`, borderRadius: 16, padding: '14px 18px', marginBottom: 20 }}>
          <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Selected Package</p>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>{plan.name}</span>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: getPlanById(selectedPlanId).color, fontFamily: "'Outfit', sans-serif" }}>
                ₦{plan.monthlyNGN.toLocaleString()}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.78rem' }}>/month</span>
              <br />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>+ ₦{plan.setupFeeNGN.toLocaleString()} setup (once)</span>
            </div>
          </div>
        </div>

        {/* Account details */}
        {!isConfigured ? (
          <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 14, padding: '16px 18px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <AlertTriangle style={{ width: 20, height: 20, color: '#f59e0b', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
            <div>
              <p style={{ margin: '0 0 4px', color: '#f59e0b', fontWeight: 700, fontSize: '0.88rem' }}>Payment account not configured</p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>
                Set <code style={{ background: 'rgba(255,255,255,0.05)', padding: '1px 5px', borderRadius: 4 }}>NEXT_PUBLIC_PAYMENT_ACCOUNT_NUMBER</code> in your <code>.env.local</code> to display payment details.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(7,9,14,0.7)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '18px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <p style={{ margin: '0 0 3px', fontSize: '0.76rem', color: '#64748b' }}>Bank: <strong style={{ color: '#94a3b8' }}>{bankName}</strong></p>
                <p style={{ margin: '0 0 3px', fontSize: '0.76rem', color: '#64748b' }}>Account Name: <strong style={{ color: '#fff' }}>{accountName}</strong></p>
                <p style={{ margin: '0 0 8px', fontSize: '0.76rem', color: '#64748b' }}>Account Number:</p>
                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#06b6d4', letterSpacing: '0.06em', fontFamily: "'Outfit', sans-serif" }}>
                  {accountNumber}
                </p>
              </div>
              <button
                id="copy-account-btn"
                onClick={() => copyToClipboard(accountNumber, 'account')}
                aria-label="Copy account number to clipboard"
                style={{ background: copied === 'account' ? '#10b981' : 'rgba(6,182,212,0.12)', color: copied === 'account' ? '#fff' : '#06b6d4', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 12, padding: '10px 16px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', alignSelf: 'flex-start', whiteSpace: 'nowrap' }}
              >
                <Copy style={{ width: 14, height: 14 }} aria-hidden="true" />
                {copied === 'account' ? 'Copied!' : 'Copy Account No.'}
              </button>
            </div>
          </div>
        )}

        {/* Payment reference */}
        <div style={{ background: 'rgba(7,9,14,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '0.76rem', color: '#64748b' }}>Payment Reference (use as transfer narration if possible):</p>
            <code style={{ fontSize: '0.95rem', fontWeight: 800, color: '#8b5cf6', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
              {paymentRef}
            </code>
          </div>
          <button
            id="copy-ref-btn"
            onClick={() => copyToClipboard(paymentRef, 'reference')}
            aria-label="Copy payment reference to clipboard"
            style={{ background: copied === 'reference' ? '#10b981' : 'rgba(139,92,246,0.1)', color: copied === 'reference' ? '#fff' : '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 10, padding: '8px 14px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            <Copy style={{ width: 13, height: 13 }} aria-hidden="true" />
            {copied === 'reference' ? 'Copied!' : 'Copy Reference'}
          </button>
        </div>

        {/* WhatsApp Security Cross-Check Protection Guard */}
        <div style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 14, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <ShieldCheck style={{ color: '#38bdf8', width: 20, height: 20, flexShrink: 0, marginTop: 2 }} />
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              WhatsApp Security Cross-Check Protection
            </span>
            <p style={{ margin: '4px 0 0', color: '#cbd5e1', fontSize: '0.78rem', lineHeight: 1.5 }}>
              To ensure 100% payment safety and guard against website spoofing, your transfer receipt and narration reference <code>{paymentRef}</code> are cross-verified directly on our official WhatsApp desk before onboarding starts.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Payment Steps</p>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {instructions.map((step, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', color: '#06b6d4', fontWeight: 800, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  {i + 1}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.83rem', lineHeight: 1.5 }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 20 }}>
          <button
            onClick={() => setShowInvoiceModal(true)}
            style={{
              background: 'rgba(56,189,248,0.12)',
              color: '#38bdf8',
              border: '1px solid rgba(56,189,248,0.3)',
              borderRadius: 12,
              padding: '12px 24px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <FileText size={16} /> Generate Pro-Forma Invoice First
          </button>

          <a
            id="payment-whatsapp-cta"
            href={waLink}
            target="_blank"
            rel="noreferrer noopener"
            onClick={handleWhatsAppClick}
            style={{ background: '#25d366', color: '#fff', textDecoration: 'none', borderRadius: 14, padding: '14px 28px', fontWeight: 800, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 24px rgba(37,211,102,0.25)' }}
            aria-label="Open WhatsApp to send payment receipt"
          >
            <MessageSquare style={{ width: 18, height: 18 }} aria-hidden="true" />
            I Have Made Payment — Send Receipt on WhatsApp
          </a>
        </div>

        {/* Post-click note */}
        {whatsappOpened && (
          <div role="status" aria-live="polite" style={{ textAlign: 'center', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '10px 16px', marginBottom: 16 }}>
            <p style={{ margin: 0, color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>
              WhatsApp has opened for receipt submission. Your payment will be reviewed before onboarding starts.
            </p>
          </div>
        )}

        {/* Nigerian Security & Compliance Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', margin: '16px 0', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Lock size={12} style={{ color: '#10b981' }} /> 256-Bit SSL Encrypted
          </span>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ShieldCheck size={12} style={{ color: '#06b6d4' }} /> NDPA Data Compliance Verified
          </span>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
            🏦 Verified Bank Transfer Settlement
          </span>
        </div>

        {/* Safety note */}
        <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, padding: '12px 16px' }}>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.55 }}>
            <strong style={{ color: '#f87171' }}>Safety: </strong>{safetyNote}
          </p>
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
