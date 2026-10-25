'use client';

/**
 * @file src/components/home/PaymentSection.tsx
 * Manual Moniepoint / Bank transfer payment box.
 *
 * - Account details read from NEXT_PUBLIC_* env vars via paymentConfig
 * - No hard-coded account numbers in JSX
 * - Clipboard copy with aria-live toast
 * - WhatsApp message includes the correct selected plan and amount
 * - Payment reference generated per-plan per-session
 */

import React, { useState, useEffect, useMemo, useId } from 'react';
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

  // Stable reference per selected plan (deterministic on SSR to prevent Error #418)
  const [paymentRef, setPaymentRef] = useState(() => generatePaymentReference(plan.id, 'PAY'));

  useEffect(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
    setPaymentRef(generatePaymentReference(plan.id, rand));
  }, [plan.id]);

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

  const isDeposit = plan.balanceAmountNGN > 0;

  const waMessage =
    `Hello Bethelmind Lagos Desk,\n\n` +
    `I am ready to proceed with my website & AI sales assistant setup.\n\n` +
    `Business Name: ${businessName || 'My Business'}\n` +
    `Industry: ${selectedIndustry}\n` +
    `Lagos District/Region: ${targetDistrict}\n` +
    `Selected Package: ${plan.name}\n` +
    `Milestone Deposit to Start: ₦${plan.depositAmountNGN.toLocaleString()} NGN (Total: ₦${plan.totalAmountNGN.toLocaleString()} NGN)\n` +
    `Delivery SLA: Guaranteed ${plan.slaHours} Hours\n` +
    `Payment Reference: ${paymentRef}\n\n` +
    `Please confirm receipt and dispatch my deployment onboarding pack!`;

  const waLink = buildWhatsAppLink('2348022791227', waMessage);

  const handleWhatsAppClick = () => setWhatsappOpened(true);

  return (
    <section
      id="payment"
      aria-labelledby="payment-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-24"
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
        className="fixed bottom-6 right-6 z-50 pointer-events-none"
      >
        {copied && (
          <div className="bg-[#d4af37] text-[#070b14] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-2xl animate-fade-in-up">
            <CheckCircle className="w-4 h-4" aria-hidden="true" />
            <span>{copied === 'account' ? 'Account number copied' : 'Payment reference copied'}</span>
          </div>
        )}
      </div>

      <div className="bg-[#090d16]/95 border border-white/[0.08] hover:border-[#d4af37]/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-8 transition-all">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Official Settlement Desk &bull; 50% Milestone Escrow</span>
          </div>
          
          <h2
            id="payment-heading"
            className="font-serif text-2xl sm:text-3xl font-normal text-[#f5f3ef]"
          >
            Milestone Settlement &amp; Official Invoicing
          </h2>
          
          <p className="text-xs sm:text-sm text-[#c9c4bc] font-light max-w-xl mx-auto leading-relaxed">
            Your investment is fully protected. Pay the 50% milestone deposit to commence your build. The balance is settled <span className="text-[#f5f3ef] font-medium underline decoration-[#d4af37] underline-offset-4">ONLY</span> after you inspect and approve your live mobile website.
          </p>
        </div>

        {/* Selected plan summary */}
        <div className="bg-[#0a0e17] border border-white/[0.06] rounded-2xl p-5 space-y-3">
          <span className="text-[10px] font-semibold text-[#c5a880] uppercase tracking-widest block">
            Selected Engagement Package
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <span className="font-serif text-xl font-normal text-[#f5f3ef]">
              {plan.name}
            </span>
            <div className="text-left sm:text-right">
              <span className="font-mono text-2xl font-normal text-[#d4af37]">
                &#8358;{plan.depositAmountNGN.toLocaleString()}
              </span>
              <span className="text-xs text-[#c5a880] font-medium ml-2">
                {plan.balanceAmountNGN > 0 ? '(50% Milestone Deposit)' : '(Complete Activation)'}
              </span>
              <p className="text-[11px] text-[#c9c4bc]/70 font-light mt-0.5">
                {plan.balanceAmountNGN > 0
                  ? `Total Project: ₦${plan.totalAmountNGN.toLocaleString()} • Balance of ₦${plan.balanceAmountNGN.toLocaleString()} due strictly upon live approval`
                  : `Guaranteed ${plan.slaHours}h Live Handover`}
              </p>
            </div>
          </div>
        </div>

        {/* Account details */}
        {!isConfigured ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs">
              <p className="text-amber-300 font-semibold mb-1">Payment account not configured</p>
              <p className="text-[#c9c4bc] font-light">
                Configure account credentials in your environment variables.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#0a0e17] border border-white/[0.06] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-[#c9c4bc]/70 font-light">Bank: <strong className="text-[#f5f3ef] font-medium">{bankName}</strong></p>
                <p className="text-xs text-[#c9c4bc]/70 font-light">Account Name: <strong className="text-[#f5f3ef] font-medium">{accountName}</strong></p>
                <p className="text-xs text-[#c9c4bc]/70 font-light pt-1">Corporate Account Number:</p>
                <p className="text-2xl sm:text-3xl font-mono text-[#d4af37] tracking-wider pt-0.5">
                  {accountNumber}
                </p>
              </div>

              <button
                id="copy-account-btn"
                onClick={() => copyToClipboard(accountNumber, 'account')}
                aria-label="Copy account number to clipboard"
                className="py-2.5 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#d4af37] border border-[#d4af37]/30 text-xs font-semibold flex items-center gap-2 transition-all self-start whitespace-nowrap active:scale-95"
              >
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{copied === 'account' ? 'Copied' : 'Copy Account No.'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Payment reference */}
        <div className="bg-[#0a0e17] border border-white/[0.06] rounded-2xl p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-0.5">
            <p className="text-xs text-[#c9c4bc]/70 font-light">Payment Reference (Transfer Narration):</p>
            <code className="text-sm font-mono text-[#c5a880] tracking-wider">
              {paymentRef}
            </code>
          </div>
          <button
            id="copy-ref-btn"
            onClick={() => copyToClipboard(paymentRef, 'reference')}
            aria-label="Copy payment reference to clipboard"
            className="py-2 px-3.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-[#c9c4bc] hover:text-[#f5f3ef] border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95"
          >
            <Copy className="w-3 h-3" aria-hidden="true" />
            <span>{copied === 'reference' ? 'Copied' : 'Copy Reference'}</span>
          </button>
        </div>

        {/* Security Cross-Check Protection Guard */}
        <div className="bg-[#d4af37]/[0.03] border border-[#d4af37]/20 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
          <ShieldCheck className="text-[#d4af37] w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider block">
              Direct Verification Cross-Check Guard
            </span>
            <p className="text-xs text-[#c9c4bc] font-light leading-relaxed">
              To ensure 100% transaction safety and verify against spoofing, your transfer credit and narration reference <code className="text-[#f5f3ef] font-mono">{paymentRef}</code> are cross-verified directly on our official WhatsApp desk before onboarding commences.
            </p>
          </div>
        </div>

        {/* Payment Steps */}
        <div className="space-y-3">
          <span className="text-[11px] font-semibold text-[#c5a880] uppercase tracking-widest block">
            Onboarding Protocol
          </span>
          <ol className="space-y-2">
            {instructions.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-[#c9c4bc] font-light">
                <span className="w-5 h-5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <a
            id="payment-whatsapp-cta"
            href={waLink}
            target="_blank"
            rel="noreferrer noopener"
            onClick={handleWhatsAppClick}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#d4af37]/20 active:scale-95"
            aria-label="Request Settlement Account & Invoice on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Request Verified Settlement Account &amp; Invoice on WhatsApp</span>
          </a>

          <button
            onClick={() => setShowInvoiceModal(true)}
            className="w-full py-3 px-6 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#c9c4bc] hover:text-[#f5f3ef] border border-white/[0.08] text-xs font-medium flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-[#d4af37]" />
            <span>Preview Instant Pro-Forma Invoice (PDF)</span>
          </button>
        </div>

        {/* Post-click note */}
        {whatsappOpened && (
          <div role="status" aria-live="polite" className="text-center p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20">
            <p className="text-xs text-[#d4af37] font-medium">
              WhatsApp opened for receipt submission. Your payment is reviewed by our desk prior to onboarding.
            </p>
          </div>
        )}

        {/* Nigerian Security & Compliance Badges */}
        <div className="flex justify-center gap-6 flex-wrap pt-4 border-t border-white/[0.06] text-xs text-[#c9c4bc]/70 font-light">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>256-Bit SSL Encrypted</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>NDPA Data Compliance Verified</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>CAC RC 7034297</span>
          </span>
        </div>

        {/* Safety note */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5">
          <p className="text-[11px] text-[#c9c4bc]/80 font-light leading-relaxed">
            <strong className="text-[#f5f3ef] font-medium">Safety: </strong>{safetyNote}
          </p>
        </div>

      </div>
    </section>
  );
}
