'use client';

/**
 * @file src/components/home/PricingSection.tsx
 * Three-plan pricing grid with Option B pricing (monthly + one-time setup fee).
 *
 * PRICING CTA BUG FIX:
 * - Each plan card calls setSelectedPlanId(plan.id) AND smooth-scrolls to #payment
 * - The WhatsApp link for each card is generated from that specific plan's data
 * - No plan button hard-codes "Business Pro" — all labels and amounts are dynamic
 */

import React, { useState } from 'react';
import { CheckCircle, ArrowRight, FileText } from 'lucide-react';
import { PLANS, ONBOARDING_STEPS, getPlanById, type Plan } from '@/config/plans';
import { paymentConfig, buildWhatsAppLink, generatePaymentReference } from '@/config/payment';
import RoiCalculator from '@/components/home/RoiCalculator';
import InvoiceModal, { InvoiceItem } from '@/components/InvoiceModal';

import AddonModulesSection from '@/components/home/AddonModulesSection';

interface PricingSectionProps {
  selectedPlanId: string;
  setSelectedPlanId: (id: string) => void;
  businessName: string;
  selectedIndustry: string;
  targetDistrict: string;
}

function buildPlanWhatsAppLink(
  plan: Plan,
  businessName: string,
  industry: string,
  district: string,
): string {
  const ref = generatePaymentReference(plan.id);
  const msg =
    `Hello Bethelmind Analytics,\n\n` +
    `I have selected a subscription plan and would like to proceed.\n\n` +
    `Business Name: ${businessName || 'My Business'}\n` +
    `Industry: ${industry}\n` +
    `Lagos District: ${district}\n` +
    `Selected Plan: ${plan.name}\n` +
    `Monthly Fee: ₦${plan.monthlyNGN.toLocaleString()}/month\n` +
    `One-Time Setup Fee: ₦${plan.setupFeeNGN.toLocaleString()}\n` +
    `Payment Reference: ${ref}\n\n` +
    `Please confirm next steps for payment and onboarding.`;
  return buildWhatsAppLink(paymentConfig.whatsappNumber, msg);
}

function scrollToPayment() {
  const el = document.getElementById('payment');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function PricingSection({
  selectedPlanId,
  setSelectedPlanId,
  businessName,
  selectedIndustry,
  targetDistrict,
}: PricingSectionProps) {
  const [invoicePlanId, setInvoicePlanId] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setTimeout(scrollToPayment, 80);
  };

  const currentInvoicePlan = invoicePlanId ? getPlanById(invoicePlanId) : null;
  const invoiceItems: InvoiceItem[] = currentInvoicePlan
    ? [
        { name: `${currentInvoicePlan.name} Subscription (1st Month)`, price: currentInvoicePlan.monthlyNGN, qty: 1 },
        { name: 'Initial System & Workflow Setup Fee', price: currentInvoicePlan.setupFeeNGN, qty: 1 },
      ]
    : [];

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      style={{ padding: '72px clamp(16px, 4vw, 40px)', maxWidth: 1200, margin: '0 auto' }}
    >
      {/* Invoice Modal Trigger */}
      {currentInvoicePlan && (
        <InvoiceModal
          isOpen={!!invoicePlanId}
          onClose={() => setInvoicePlanId(null)}
          clientName={businessName || 'Valued Business'}
          clientIndustry={selectedIndustry}
          clientDistrict={targetDistrict}
          items={invoiceItems}
          paymentRef={generatePaymentReference(currentInvoicePlan.id)}
        />
      )}

      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 100, padding: '5px 16px', marginBottom: 14 }}>
          <span style={{ fontSize: '0.78rem', color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Transparent Pricing Plans</span>
        </div>
        <h2
          id="pricing-heading"
          style={{ fontSize: 'clamp(1.8rem, 4.2vw, 2.6rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc', letterSpacing: '-0.02em' }}
        >
          Simple, Transparent NGN Investment Packages
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.96rem', maxWidth: 720, margin: '0 auto 16px', lineHeight: 1.5 }}>
          Whether you need a brand-new luxury website developed from scratch or want to embed our AI tools into your existing site, select the plan below.
        </p>

        {/* Website Choice Comparison Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, maxWidth: 840, margin: '0 auto 28px', textAlign: 'left' }}>
          <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>🔌</span>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#38bdf8' }}>Already Have a Website?</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>WordPress, Wix, Shopify — simply paste our 1-line script embed in 60 seconds (Starter Plan).</div>
            </div>
          </div>
          <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>🌐</span>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#c084fc' }}>Need Complete Website Built?</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>We build & host your complete luxury website on your custom .com / .ng domain in 24h (Business Pro).</div>
            </div>
          </div>
        </div>

        <p style={{ color: '#10b981', fontSize: '0.84rem', fontWeight: 700, margin: 0 }}>
          ⚡ 50% deposit option available on all setup packages • Instant WhatsApp handover within 24 hours.
        </p>
      </div>

      {/* Plan grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 56 }}>
        {PLANS.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const planWaLink = buildPlanWhatsAppLink(plan, businessName, selectedIndustry, targetDistrict);

          return (
            <div
              key={plan.id}
              id={`plan-card-${plan.id}`}
              style={{
                background: plan.badge ? 'rgba(139,92,246,0.05)' : 'rgba(255,255,255,0.02)',
                border: `2px solid ${isSelected ? plan.color : plan.badge ? '#8b5cf690' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 20,
                padding: 26,
                position: 'relative',
                cursor: 'pointer',
                transition: 'border-color 0.25s, box-shadow 0.25s',
                boxShadow: isSelected ? `0 0 0 1px ${plan.color}50, 0 8px 32px ${plan.color}15` : 'none',
              }}
              onClick={() => handleSelectPlan(plan.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectPlan(plan.id); }}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              aria-label={`Select ${plan.name} — ₦${plan.monthlyNGN.toLocaleString()}/month + ₦${plan.setupFeeNGN.toLocaleString()} setup`}
            >
              {/* Badge */}
              {plan.badge && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  {plan.badge}
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <div style={{ position: 'absolute', top: 14, right: 14, width: 20, height: 20, borderRadius: '50%', background: plan.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle style={{ width: 14, height: 14, color: '#fff' }} aria-hidden="true" />
                </div>
              )}

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
                {plan.name}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.78rem', margin: '0 0 16px', lineHeight: 1.4 }}>{plan.tagline}</p>

              {/* Pricing */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ margin: '0 0 4px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: plan.color, fontFamily: "'Outfit', sans-serif" }}>
                    ₦{plan.monthlyNGN.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>/month</span>
                </p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                  + ₦{plan.setupFeeNGN.toLocaleString()} <span style={{ color: '#64748b' }}>one-time setup fee</span>
                </p>
              </div>

              {/* Features */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginBottom: 20 }}>
                {plan.features.map((f) => (
                  <div key={f.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <CheckCircle style={{ width: 14, height: 14, color: plan.color, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                    <span style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4 }}>{f.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  id={`plan-select-${plan.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan.id);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    width: '100%', padding: '12px 0', borderRadius: 12,
                    background: isSelected || plan.badge
                      ? `linear-gradient(135deg, ${plan.color}, #7c3aed)`
                      : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    border: isSelected || plan.badge ? 'none' : `1px solid ${plan.color}40`,
                    fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  aria-label={`Select ${plan.name} and proceed to payment`}
                >
                  {isSelected ? 'Selected — See Payment Details' : `Select ${plan.name}`}
                  <ArrowRight style={{ width: 14, height: 14 }} aria-hidden="true" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlanId(plan.id);
                    setInvoicePlanId(plan.id);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    width: '100%', padding: '8px 0', borderRadius: 10,
                    background: 'rgba(56,189,248,0.1)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56,189,248,0.25)',
                    fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                  }}
                >
                  <FileText size={14} /> Preview Instant Pro-Forma Invoice
                </button>
              </div>

              {/* Also provide a direct WhatsApp link as secondary option */}
              {isSelected && (
                <a
                  href={planWaLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: 'block', textAlign: 'center', marginTop: 10, fontSize: '0.76rem', color: '#64748b', textDecoration: 'none' }}
                  aria-label={`Ask about ${plan.name} on WhatsApp`}
                >
                  Or ask about this plan on WhatsApp →
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Lagos SME ROI Calculator (Positioned below plan cards) */}
      <div style={{ marginTop: 10, marginBottom: 50 }}>
        <RoiCalculator />
      </div>

      {/* Selectable Tool Add-on Modules */}
      <AddonModulesSection />

      {/* What happens after you subscribe */}
      <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 20, padding: 'clamp(20px, 4vw, 32px)', maxWidth: 720, margin: '0 auto' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 16px', fontFamily: "'Outfit', sans-serif" }}>
          What happens after you subscribe?
        </h3>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ONBOARDING_STEPS.map((step, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontWeight: 800, fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                {i + 1}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.55 }}>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
