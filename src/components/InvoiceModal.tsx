'use client';

import React, { useState, useId } from 'react';
import { X, Printer, CheckCircle, Copy, MessageSquare, ShieldCheck, Download, FileText } from 'lucide-react';
import { paymentConfig, buildWhatsAppLink } from '@/config/payment';

export interface InvoiceItem {
  name: string;
  price: number;
  qty: number;
}

export interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  clientIndustry?: string;
  clientDistrict?: string;
  invoiceNumber?: string;
  items: InvoiceItem[];
  paymentRef: string;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  clientName,
  clientIndustry = 'General SME',
  clientDistrict = 'Lagos',
  invoiceNumber,
  items,
  paymentRef,
}: InvoiceModalProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const toastId = useId();

  if (!isOpen) return null;

  const generatedInvoiceNo = invoiceNumber || `INV-BMA-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  const dueDateStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const vatRate = 0.075; // 7.5% NGN VAT
  const vatAmount = subtotal * vatRate;
  const totalAmount = subtotal + vatAmount;

  const { bankName, accountName, accountNumber, whatsappNumber } = paymentConfig;

  const copyAccount = async () => {
    if (!accountNumber) return;
    try {
      await navigator.clipboard.writeText(accountNumber);
    } catch {
      const el = document.createElement('textarea');
      el.value = accountNumber;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const itemsListFormatted = items.map(i => `• ${i.name} (₦${i.price.toLocaleString()} x ${i.qty})`).join('\n');
  
  const waMsg =
    `Hello Bethelmind Analytics,\n\n` +
    `I have generated Pro-Forma Invoice #${generatedInvoiceNo}.\n\n` +
    `Client: ${clientName || 'My Business'}\n` +
    `Industry: ${clientIndustry}\n` +
    `District: ${clientDistrict}\n` +
    `Total Payable: ₦${totalAmount.toLocaleString()} (inc. VAT)\n` +
    `Payment Ref: ${paymentRef}\n\n` +
    `Items:\n${itemsListFormatted}\n\n` +
    `I will attach my payment receipt screenshot below once transfer is made.`;

  const waLink = buildWhatsAppLink(whatsappNumber, waMsg);

  return (
    <div
      className="invoice-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: 'rgba(7, 9, 14, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Toast Notification */}
      <div
        id={toastId}
        role="status"
        aria-live="polite"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100000, pointerEvents: 'none' }}
      >
        {copied && (
          <div style={{ background: '#10b981', color: '#fff', padding: '10px 18px', borderRadius: 12, fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 28px rgba(0,0,0,0.4)' }}>
            <CheckCircle style={{ width: 16, height: 16 }} />
            Account number copied to clipboard!
          </div>
        )}
      </div>

      <div
        className="printable-invoice"
        style={{
          background: '#ffffff',
          color: '#1e293b',
          borderRadius: 20,
          maxWidth: 720,
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 70px rgba(0,0,0,0.5)',
          position: 'relative',
          padding: 'clamp(20px, 4vw, 36px)',
          fontFamily: "'Inter', -apple-system, sans-serif",
          boxSizing: 'border-box',
        }}
      >
        {/* Header Controls (Hidden during print) */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText style={{ color: '#0284c7', width: 22, height: 22 }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
              Official Pro-Forma Payment Invoice
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handlePrint}
              style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: 10, padding: '8px 14px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Printer size={15} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              style={{ background: '#f1f5f9', border: 'none', color: '#64748b', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              aria-label="Close invoice modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Branding & Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
              BETHELMIND ANALYTICS
            </h2>
            <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, display: 'block', marginTop: 2 }}>
              & STRATEGY AUTOMATIONS NIGERIA
            </span>
            <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
              Lagos Tech Hub, Ikeja / Lekki Phase 1, Lagos State<br />
              RC Registered • NDPA Compliance Verified<br />
              Email: billing@bethelmindanalytics.com
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ background: '#e0f2fe', color: '#0369a1', display: 'inline-block', padding: '4px 12px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 800, marginBottom: 6 }}>
              PRO-FORMA INVOICE
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
              #{generatedInvoiceNo}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Date: <strong style={{ color: '#334155' }}>{dateStr}</strong><br />
              Due Date: <strong style={{ color: '#334155' }}>{dueDateStr}</strong>
            </p>
          </div>
        </div>

        {/* Bill To & Payment Ref Meta */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              BILLED TO (CLIENT):
            </span>
            <h4 style={{ margin: '4px 0 2px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              {clientName || 'My Business'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>
              Industry: {clientIndustry}<br />
              District: {clientDistrict}, Lagos
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PAYMENT REFERENCE NARRATION:
            </span>
            <div style={{ marginTop: 4 }}>
              <code style={{ fontSize: '0.95rem', fontWeight: 800, color: '#7c3aed', background: '#f3e8ff', padding: '3px 8px', borderRadius: 6, fontFamily: 'monospace' }}>
                {paymentRef}
              </code>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>
              Use as transfer narration in your banking app.
            </span>
          </div>
        </div>

        {/* Line Items Table */}
        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e1', background: '#f1f5f9' }}>
                <th style={{ padding: '10px 14px', fontSize: '0.78rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>Description / Item</th>
                <th style={{ padding: '10px 14px', fontSize: '0.78rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '10px 14px', fontSize: '0.78rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>Price (₦)</th>
                <th style={{ padding: '10px 14px', fontSize: '0.78rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>Amount (₦)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 14px', fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.88rem', color: '#475569', textAlign: 'center' }}>
                    {item.qty}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.88rem', color: '#475569', textAlign: 'right', fontFamily: 'monospace' }}>
                    ₦{item.price.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', textAlign: 'right', fontFamily: 'monospace' }}>
                    ₦{(item.price * item.qty).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Calculation */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
          <div style={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
              <span>Subtotal:</span>
              <strong style={{ color: '#1e293b', fontFamily: 'monospace' }}>₦{subtotal.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
              <span>VAT (7.5%):</span>
              <strong style={{ color: '#1e293b', fontFamily: 'monospace' }}>₦{vatAmount.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', color: '#0f172a', borderTop: '2px solid #0f172a', paddingTop: 8, marginTop: 4 }}>
              <span style={{ fontWeight: 800 }}>Total Payable:</span>
              <strong style={{ color: '#0284c7', fontWeight: 900, fontFamily: "'Outfit', monospace" }}>
                ₦{totalAmount.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        {/* Payment Transfer Instructions Box */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', borderRadius: 16, padding: '20px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck style={{ color: '#38bdf8', width: 20, height: 20 }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Bank Transfer Settlement Details:
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, background: 'rgba(52,211,153,0.15)', padding: '3px 10px', borderRadius: 12 }}>
              ✓ Verified Merchant Account
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Bank Name</span>
              <p style={{ margin: '2px 0 0', fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{bankName}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Account Name</span>
              <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{accountName}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Account Number</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                  {accountNumber || 'Configuring...'}
                </span>
                {accountNumber && (
                  <button
                    onClick={copyAccount}
                    style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.4)', borderRadius: 6, padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Copy size={12} /> {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <p style={{ margin: '12px 0 0', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.45 }}>
            <strong style={{ color: '#fbbf24' }}>WhatsApp Cross-Verification Guard: </strong>
            To guarantee your payment security against website spoofing, once you transfer, tap the green button below. Our official WhatsApp automated desk will cross-verify your transfer reference <code>{paymentRef}</code> and start your onboarding.
          </p>
        </div>

        {/* Primary Action Button (Hidden in Print) */}
        <div className="no-print" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              flex: 1,
              minWidth: 260,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '14px 24px',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
            }}
          >
            <MessageSquare size={18} /> Proceed to Pay & Send Receipt on WhatsApp
          </a>

          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #cbd5e1',
              padding: '14px 20px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Close Invoice
          </button>
        </div>

        <style>{`
          @media print {
            .no-print, .invoice-modal-overlay {
              background: transparent !important;
              padding: 0 !important;
              position: static !important;
            }
            .printable-invoice {
              box-shadow: none !important;
              max-width: 100% !important;
              border-radius: 0 !important;
              padding: 0 !important;
            }
            .no-print { display: none !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
