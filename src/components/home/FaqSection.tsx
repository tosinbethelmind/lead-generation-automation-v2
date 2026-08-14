'use client';

/**
 * @file src/components/home/FaqSection.tsx
 * 10-question accordion FAQ. Transparent answers, honest about manual payment.
 */

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Do I or my staff need any technical or coding skills?',
    a: 'None at all! We handle 100% of the setup, domain configuration, WhatsApp AI training, and sector calculator integration for you. You receive a complete, ready-to-use system delivered in 24 hours.',
  },
  {
    q: 'Can my human sales team still reply and chat with customers on WhatsApp?',
    a: 'Yes, absolutely. The AI operates seamlessly in the background. Whenever your staff wants to reply directly, they can simply type or send voice notes on WhatsApp as usual. You have full control at all times.',
  },
  {
    q: 'How do the Nigerian Accent Voice Notes work?',
    a: 'Our AI speaks in natural, authentic Nigerian English. When prospects ask about prices, inverter sizes, or property installments, the AI sends warm audio voice notes that sound like an experienced human sales rep, building instant trust and closing sales faster.',
  },
  {
    q: 'How does the 50% deposit option work?',
    a: 'You can start onboarding today with a 50% deposit (₦92,500). Our engineering team sets up your 24/7 AI agent and sector tools immediately, and you pay the remaining balance upon 100% handover within 24 hours.',
  },
  {
    q: 'What if I already have a website (WordPress, Wix, Shopify, custom)?',
    a: 'You DO NOT need to rebuild your website! Simply paste our 1-line script tag into your existing site in 60 seconds, and your 24/7 AI concierge and sector calculators will activate instantly.',
  },
  {
    q: 'How does Bank Transfer Auto-Verification work?',
    a: 'We integrate with Moniepoint and Paystack virtual accounts. When a customer transfers funds via their mobile banking app (GTB, Kuda, Zenith, OPay), the payment is automatically verified in real time and an official receipt is issued on WhatsApp with zero manual delays.',
  },
  {
    q: 'How many B2B leads do I receive with the Lead Harvester?',
    a: 'Our Business Pro plan includes up to 10,000 verified Nigerian B2B contacts every month, complete with verified business names, WhatsApp phone numbers, and decision-maker details across Lagos, Abuja, and Port Harcourt.',
  },
  {
    q: 'Can I cancel my monthly subscription anytime?',
    a: 'Yes. Monthly subscriptions can be cancelled at any time with a simple 1-click message. There are no contracts, lock-ins, or hidden cancellation penalties.',
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
