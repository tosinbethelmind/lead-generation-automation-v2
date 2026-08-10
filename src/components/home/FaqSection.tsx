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
    a: 'After we confirm your payment, we schedule an onboarding session (typically within one business day). We collect your business information, products or services, and workflow requirements. We then configure your initial setup and review it with you before going live.',
  },
  {
    q: 'Can the AI hand a conversation to my team?',
    a: "Yes. The workflow is designed with a human handoff step. When a conversation requires your team's attention — for example, a pricing negotiation, a sensitive enquiry, or a confirmed order — the system routes it to a designated team contact on WhatsApp.",
  },
  {
    q: 'Do I need a WhatsApp Business account?',
    a: 'Yes. A WhatsApp Business account (or WhatsApp Business API access, depending on your plan and requirements) is required to use the WhatsApp workflow features. We will advise on the appropriate setup during onboarding.',
  },
  {
    q: 'Which integrations are currently supported?',
    a: 'Current integrations include WhatsApp Business messaging, website enquiry capture widgets, and basic CRM pipeline tracking. Payment gateway integration (Paystack, OPay API) is not yet configured. We use a manual OPay transfer process for plan payments. Other integrations are scoped individually — please ask during onboarding.',
  },
  {
    q: 'Are sector tools included in every plan?',
    a: 'Basic sector workflow configuration is included in Starter. Sector-specific calculator and quote workflow tools are included in Business Pro and above. Availability and scope depend on your plan and specific business requirements. Please review the plan feature list or ask us via WhatsApp.',
  },
  {
    q: 'How is my business data handled?',
    a: 'Business data you provide during onboarding is used only to configure your workflow. We do not sell or share your data with third parties. For full details, please review our Privacy Policy and Responsible Outreach & Data Policy. We recommend reviewing these with a qualified legal professional before production use.',
  },
  {
    q: 'Can I cancel my monthly plan?',
    a: 'Yes. Monthly plans can be cancelled at any time. Simply contact us via WhatsApp before your next billing cycle. The one-time setup fee is non-refundable once onboarding has begun, as it covers work already performed. Please review our Refund and Cancellation Policy for full details.',
  },
  {
    q: 'How do I pay for my plan?',
    a: 'We currently accept manual OPay bank transfer only. Transfer the monthly fee and setup fee to the OPay account displayed on our pricing page, then send your payment receipt via WhatsApp. We confirm payment manually, typically within one business day.',
  },
  {
    q: 'Is payment confirmed automatically?',
    a: 'No. Payment confirmation is a manual process. We review your transfer receipt on WhatsApp and confirm by message before onboarding begins. We do not have an automated payment gateway or instant activation system at this time.',
  },
  {
    q: 'Is lead outreach subject to consent and platform rules?',
    a: "Yes, and this is your responsibility as the business owner. You must ensure you have a lawful basis for any outreach you conduct using our tools. WhatsApp's policies, Nigerian data protection obligations (NDPR), and applicable consumer protection rules apply. Do not use our tools for unsolicited bulk messaging, spam, impersonation, or any prohibited activity. Please review our Acceptable Use Policy and Responsible Outreach & Data Policy for full details.",
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
