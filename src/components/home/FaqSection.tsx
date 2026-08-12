'use client';

/**
 * @file src/components/home/FaqSection.tsx
 * 10-question accordion FAQ. Transparent answers, honest about manual payment.
 */

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How does onboarding work?',
    a: 'After payment, we schedule an onboarding session (typically within one business day). We collect your business information, products, or service rules, configure your initial WhatsApp & CRM setup, and review everything with you before launching.',
  },
  {
    q: 'How does Bank Transfer Auto-Verification (Virtual Accounts) work?',
    a: 'For businesses handling bank transfers, we integrate dedicated Virtual Bank Account Numbers (NUBANs) generated via Paystack or Monnify. When a customer transfers funds via their mobile banking app (GTB, Kuda, Zenith, OPay), the transaction is automatically verified, updating the lead status and issuing an instant PDF receipt on WhatsApp without manual checking.',
  },
  {
    q: 'Can the assistant process WhatsApp Voice Notes and Nigerian Pidgin?',
    a: 'Yes. The system uses Speech-to-Text AI (OpenAI Whisper) to transcribe audio voice notes sent by Nigerian customers in local accents or Pidgin English, enabling your automated workflow to process voice messages and generate structured replies or route them to your team.',
  },
  {
    q: 'Can the assistant hand conversations over to my sales team?',
    a: 'Yes. The system includes a human handoff step. When an enquiry requires custom negotiation, a physical site visit, or complex closing, the conversation routes to designated team members on WhatsApp while keeping all records centralized in your CRM.',
  },
  {
    q: 'How do you protect against Meta WhatsApp account bans during marketing?',
    a: 'We configure rate-limiting throttles, randomized human message delays, and message variation templates. For larger campaigns, we integrate the Official WhatsApp Business Cloud API to ensure full compliance with Meta’s anti-spam guidelines.',
  },
  {
    q: 'Are sector-specific calculators included in every plan?',
    a: 'Basic sector enquiry workflows are included in Starter. Specialized quote calculators (Solar BOQ, Vehicle VIN Import Duty, Real Estate Installment Spreads, and CAC Filing Fees) are included in Business Pro and VIP Enterprise plans.',
  },
  {
    q: 'Does the system generate FIRS VAT and WHT-compliant invoices?',
    a: 'Yes. The pro-forma invoice generator allows you to generate professional PDF invoices formatted with your CAC Registration Number, Tax Identification Number (TIN), 7.5% VAT, and 5% Withholding Tax (WHT) line items for corporate clients.',
  },
  {
    q: 'Can I cancel my monthly plan anytime?',
    a: 'Yes. Monthly subscriptions can be cancelled at any time before your next billing cycle with no long-term contracts or cancellation penalties.',
  },
  {
    q: 'How is my business data handled?',
    a: 'All client information and lead databases are kept strictly confidential and secure. We do not share or sell client data to third parties. Review our Privacy Policy for full terms.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      style={{ padding: '72px clamp(16px, 4vw, 40px)', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 14 }}>
            <span style={{ fontSize: '0.74rem', color: '#06b6d4', fontWeight: 700 }}>FAQ</span>
          </div>
          <h2
            id="faq-heading"
            style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Honest answers to questions we commonly receive.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{ background: 'rgba(7,9,14,0.5)', border: `1px solid ${isOpen ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, transition: 'border-color 0.2s', overflow: 'hidden' }}
              >
                <button
                  id={`faq-btn-${i}`}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', gap: 12, textAlign: 'left' }}
                >
                  <span style={{ color: isOpen ? '#f8fafc' : '#cbd5e1', fontSize: '0.92rem', fontWeight: 700, flex: 1, lineHeight: 1.4 }}>
                    {item.q}
                  </span>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: isOpen ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {isOpen
                      ? <Minus style={{ width: 14, height: 14, color: '#06b6d4' }} aria-hidden="true" />
                      : <Plus style={{ width: 14, height: 14, color: '#64748b' }} aria-hidden="true" />}
                  </div>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  hidden={!isOpen}
                  style={{ padding: isOpen ? '0 18px 18px' : 0 }}
                >
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.7 }}>
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
