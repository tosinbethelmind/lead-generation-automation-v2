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
import {
  PLANS_NEED_WEBSITE,
  PLANS_HAVE_WEBSITE,
  OUTRIGHT_PACKAGES,
  MAINTENANCE_OPTIONS,
  ON_DEMAND_TASK_MENU,
  getPlanById,
  ONBOARDING_STEPS,
  type Plan,
  type OutrightPackage,
  type MaintenanceOption,
} from '@/config/plans';
import { generatePaymentReference } from '@/config/payment';
import RoiCalculator from './RoiCalculator';
import AddonModulesSection from './AddonModulesSection';
import InvoiceModal from '@/components/InvoiceModal';

interface InvoiceItem {
  name: string;
  price: number;
  qty: number;
}

interface PricingSectionProps {
  selectedPlanId: string;
  setSelectedPlanId: (planId: string) => void;
  businessName?: string;
  selectedIndustry: string;
  targetDistrict: string;
}

function buildPlanWhatsAppLink(plan: Plan, businessName?: string, industry?: string, district?: string): string {
  const biz = businessName ? ` for *${businessName}*` : '';
  const ind = industry ? ` in *${industry}*` : '';
  const dist = district ? ` (${district})` : '';
  const msg = `Hello Bethelmind Team,\n\nI want to subscribe to the *${plan.name}* (₦${plan.monthlyNGN.toLocaleString()}/mo + ₦${plan.setupFeeNGN.toLocaleString()} setup)${biz}${ind}${dist}.\n\nPlease guide me through onboarding and payment!`;
  return `https://wa.me/2347034297995?text=${encodeURIComponent(msg)}`;
}

function buildOutrightWhatsAppLink(pkg: OutrightPackage, businessName?: string, industry?: string): string {
  const biz = businessName ? ` for *${businessName}*` : '';
  const ind = industry ? ` (${industry})` : '';
  const msg = `Hello Bethelmind Team,\n\nI want to order the *1-Time Outright Purchase & Source Code Handover* for *${pkg.name}* (₦${pkg.priceNGN.toLocaleString()} one-off, ₦0 monthly)${biz}${ind}.\n\nPlease provide payment details and repository delivery!`;
  return `https://wa.me/2347034297995?text=${encodeURIComponent(msg)}`;
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
  const [websiteMode, setWebsiteMode] = useState<'need_website' | 'have_website' | 'outright_buyout'>('need_website');
  const [invoicePlanId, setInvoicePlanId] = useState<string | null>(null);
  const [customInvoiceItems, setCustomInvoiceItems] = useState<InvoiceItem[] | null>(null);

  const activePlans = websiteMode === 'need_website' ? PLANS_NEED_WEBSITE : PLANS_HAVE_WEBSITE;

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setTimeout(scrollToPayment, 80);
  };

  const currentInvoicePlan = invoicePlanId && websiteMode !== 'outright_buyout' ? getPlanById(invoicePlanId, websiteMode) : null;
  const invoiceItems: InvoiceItem[] = customInvoiceItems || (currentInvoicePlan
    ? [
        { name: `${currentInvoicePlan.name} Subscription (1st Month)`, price: currentInvoicePlan.monthlyNGN, qty: 1 },
        { name: 'Initial System & Workflow Setup Fee', price: currentInvoicePlan.setupFeeNGN, qty: 1 },
      ]
    : []);

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
          Choose Your Website & AI Setup
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.96rem', maxWidth: 720, margin: '0 auto 20px', lineHeight: 1.5 }}>
          Select whether you need a complete website developed from scratch or want to embed our AI tools into your existing website.
        </p>

        {/* Interactive Website Choice Switcher Tabs (3 Modes) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12, maxWidth: 940, margin: '0 auto 28px', textAlign: 'left' }}>
          
          {/* Option 1: Need Complete Website */}
          <button
            type="button"
            onClick={() => {
              setWebsiteMode('need_website');
              setSelectedPlanId('pro');
              setCustomInvoiceItems(null);
            }}
            style={{
              background: websiteMode === 'need_website'
                ? 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(124,58,237,0.1) 100%)'
                : 'rgba(255,255,255,0.02)',
              border: `2px solid ${websiteMode === 'need_website' ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 16,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              cursor: 'pointer',
              boxShadow: websiteMode === 'need_website' ? '0 8px 30px rgba(139,92,246,0.25)' : 'none',
              transition: 'all 0.25s ease',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                🌐
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: websiteMode === 'need_website' ? '#f8fafc' : '#cbd5e1' }}>
                  Managed Full Website
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 2 }}>
                  Monthly cloud &amp; AI hosting
                </div>
              </div>
            </div>
            {websiteMode === 'need_website' && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle style={{ width: 13, height: 13, color: '#fff' }} />
              </div>
            )}
          </button>

          {/* Option 2: Already Have Website */}
          <button
            type="button"
            onClick={() => {
              setWebsiteMode('have_website');
              setSelectedPlanId('starter');
              setCustomInvoiceItems(null);
            }}
            style={{
              background: websiteMode === 'have_website'
                ? 'linear-gradient(135deg, rgba(6,182,212,0.18) 0%, rgba(14,165,233,0.1) 100%)'
                : 'rgba(255,255,255,0.02)',
              border: `2px solid ${websiteMode === 'have_website' ? '#06b6d4' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 16,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              cursor: 'pointer',
              boxShadow: websiteMode === 'have_website' ? '0 8px 30px rgba(6,182,212,0.25)' : 'none',
              transition: 'all 0.25s ease',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                🔌
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: websiteMode === 'have_website' ? '#f8fafc' : '#cbd5e1' }}>
                  1-Line Script Embed
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 2 }}>
                  For WordPress, Wix, Shopify
                </div>
              </div>
            </div>
            {websiteMode === 'have_website' && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle style={{ width: 13, height: 13, color: '#fff' }} />
              </div>
            )}
          </button>

          {/* Option 3: 1-Time Outright Purchase (Zero Monthly) */}
          <button
            type="button"
            onClick={() => {
              setWebsiteMode('outright_buyout');
              setCustomInvoiceItems(null);
            }}
            style={{
              background: websiteMode === 'outright_buyout'
                ? 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(6,182,212,0.1) 100%)'
                : 'rgba(255,255,255,0.02)',
              border: `2px solid ${websiteMode === 'outright_buyout' ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 16,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              cursor: 'pointer',
              boxShadow: websiteMode === 'outright_buyout' ? '0 8px 30px rgba(16,185,129,0.25)' : 'none',
              transition: 'all 0.25s ease',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                📦
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: websiteMode === 'outright_buyout' ? '#f8fafc' : '#cbd5e1' }}>
                  1-Time Outright Buyout
                </div>
                <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 600, marginTop: 2 }}>
                  ₦0 Monthly • Full Code Transfer
                </div>
              </div>
            </div>
            {websiteMode === 'outright_buyout' && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle style={{ width: 13, height: 13, color: '#fff' }} />
              </div>
            )}
          </button>
        </div>

        <p style={{ color: '#10b981', fontSize: '0.84rem', fontWeight: 700, margin: 0 }}>
          ⚡ 50% deposit option available on setup packages • 100% legal Intellectual Property transfer on outright buyout.
        </p>
      </div>

      {/* RENDER CONDITIONAL PRICING GRIDS */}
      {websiteMode === 'outright_buyout' ? (
        /* 📦 1-TIME OUTRIGHT CODEBASE HANDOVER CARDS */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 56 }}>
          {OUTRIGHT_PACKAGES.map((pkg) => {
            const waOutrightLink = buildOutrightWhatsAppLink(pkg, businessName, selectedIndustry);
            const isHighlight = pkg.id === 'outright_complete';

            return (
              <div
                key={pkg.id}
                style={{
                  background: isHighlight ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `2px solid ${isHighlight ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 20,
                  padding: 26,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isHighlight ? '0 10px 40px rgba(16,185,129,0.15)' : 'none',
                }}
              >
                <div>
                  {pkg.badge && (
                    <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: isHighlight ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.1)', color: isHighlight ? '#07090e' : '#cbd5e1', fontSize: '0.66rem', fontWeight: 800, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                      {pkg.badge}
                    </div>
                  )}

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '0 0 6px', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
                    {pkg.name}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0 0 16px', lineHeight: 1.4 }}>
                    {pkg.tagline}
                  </p>

                  <div style={{ marginBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 14 }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 900, color: isHighlight ? '#10b981' : '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
                      ₦{pkg.priceNGN.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, display: 'block', marginTop: 2 }}>
                      One-Time Handover Outlay • ₦0/month
                    </span>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                        <CheckCircle style={{ width: 14, height: 14, color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                        <span style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.4 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a
                    href={waOutrightLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      width: '100%', padding: '12px 0', borderRadius: 12,
                      background: isHighlight ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'rgba(255,255,255,0.08)',
                      color: isHighlight ? '#07090e' : '#fff',
                      fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none',
                      textAlign: 'center',
                    }}
                  >
                    Order 1-Time Codebase on WhatsApp →
                  </a>

                  <button
                    onClick={() => {
                      setCustomInvoiceItems([
                        { name: `${pkg.name} — Full Source Codebase & 100% IP Transfer`, price: pkg.priceNGN, qty: 1 }
                      ]);
                      setInvoicePlanId(pkg.id);
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
                    <FileText size={14} /> Preview Instant 1-Time Invoice
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* STANDARD MANAGED SUBSCRIPTION PLANS GRID */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 20, marginBottom: 56 }}>
          {activePlans.map((plan) => {
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
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    {plan.badge}
                  </div>
                )}

                {isSelected && (
                  <div style={{ position: 'absolute', top: 14, right: 14, width: 20, height: 20, borderRadius: '50%', background: plan.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle style={{ width: 14, height: 14, color: '#fff' }} aria-hidden="true" />
                  </div>
                )}

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
                  {plan.name}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.78rem', margin: '0 0 16px', lineHeight: 1.4 }}>{plan.tagline}</p>

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

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginBottom: 20 }}>
                  {plan.features.map((f) => (
                    <div key={f.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <CheckCircle style={{ width: 14, height: 14, color: plan.color, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                      <span style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4 }}>{f.text}</span>
                    </div>
                  ))}
                </div>

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
                      setCustomInvoiceItems(null);
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
      )}

      {/* 🛡️ POST-LAUNCH SUPPORT, ANNUAL PASS & PAY-AS-YOU-GO MENU */}
      <div
        id="maintenance-support-suite"
        style={{
          marginTop: 20,
          marginBottom: 44,
          background: 'rgba(10,15,29,0.7)',
          border: '1px solid rgba(56,189,248,0.25)',
          borderRadius: 24,
          padding: 'clamp(20px, 4vw, 36px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 100, padding: '4px 14px', marginBottom: 10 }}>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Hands-Free Post-Launch Maintenance
            </span>
          </div>
          <h3 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.85rem)', fontWeight: 900, color: '#f8fafc', margin: '0 0 8px', fontFamily: "'Outfit', sans-serif" }}>
            Ongoing Support &amp; Updates for 1-Time Buyers
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: 680, margin: '0 auto' }}>
            Need price changes, banner updates, or fresh lead refills months after launch? Choose an annual peace-of-mind pass, grab a task voucher, or use our self-service Admin Dashboard.
          </p>
        </div>

        {/* Maintenance Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
          {MAINTENANCE_OPTIONS.map((opt) => (
            <div
              key={opt.id}
              style={{
                background: opt.id === 'annual_peace_of_mind' ? 'rgba(56,189,248,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${opt.id === 'annual_peace_of_mind' ? '#38bdf8' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 18,
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, background: opt.id === 'annual_peace_of_mind' ? '#38bdf8' : 'rgba(255,255,255,0.1)', color: opt.id === 'annual_peace_of_mind' ? '#07090e' : '#cbd5e1', padding: '3px 10px', borderRadius: 12 }}>
                    {opt.badge}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
                  {opt.name}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.4, margin: '0 0 14px' }}>
                  {opt.desc}
                </p>

                <div style={{ marginBottom: 14 }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', fontFamily: "'Outfit', sans-serif" }}>
                    ₦{opt.priceNGN.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}> {opt.period}</span>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, marginBottom: 16 }}>
                  {opt.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                      <CheckCircle size={13} style={{ color: '#38bdf8', flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/2347034297995?text=${encodeURIComponent(`Hello Bethelmind Team, I want to add the *${opt.name}* (₦${opt.priceNGN.toLocaleString()} ${opt.period}) for my website. Please activate it!`)}`}
                target="_blank"
                rel="noreferrer noopener"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 0',
                  borderRadius: 10,
                  background: 'rgba(56,189,248,0.15)',
                  border: '1px solid rgba(56,189,248,0.4)',
                  color: '#38bdf8',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                }}
              >
                Activate on WhatsApp →
              </a>
            </div>
          ))}
        </div>

        {/* On-Demand Pay-As-You-Go Menu Bar */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.9rem' }}>
              📋 Pay-As-You-Go Single Request Menu (No Retainer Required):
            </span>
            <span style={{ color: '#10b981', fontSize: '0.76rem', fontWeight: 700 }}>
              ⚡ Included: 30-Day Free Setup Warranty
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {ON_DEMAND_TASK_MENU.map((item) => (
              <div key={item.id} style={{ background: 'rgba(7,9,14,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>{item.icon} {item.task}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Turnaround: {item.turnaround}</div>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#10b981', fontFamily: "'Outfit', sans-serif" }}>
                  ₦{item.priceNGN.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
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
          What happens after you subscribe or buy?
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
