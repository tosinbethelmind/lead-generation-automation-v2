'use client';

/**
 * @file src/components/home/FaqSection.tsx
 * 10-question accordion FAQ for Bethelmind Digital Solutions.
 */

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Do I or my staff need any technical or coding skills?',
    a: 'None at all. We handle 100% of the architecture, domain setup, WhatsApp AI configuration, and sector calculation integrations for you. You receive a complete, ready-to-use business system delivered within 48 hours.',
  },
  {
    q: 'Can my human sales team still reply and chat with customers on WhatsApp?',
    a: 'Yes, absolutely. The AI assistant operates seamlessly in the background. Whenever your staff wants to reply directly, they can simply type or send voice notes on WhatsApp as usual. Human handoff is instant and you maintain full control at all times.',
  },
  {
    q: 'How do the Nigerian Accent Voice Notes work?',
    a: 'Our AI engine responds in natural, authentic Nigerian English. When prospects ask about prices, inverter specifications, or real estate installments, the AI sends clear, professional audio voice notes that sound like an experienced client advisor, building instant trust and closing sales faster.',
  },
  {
    q: 'How does the 50% commitment deposit work?',
    a: 'You can initiate onboarding with a 50% commitment deposit (₦35,000 for Starter or ₦75,000 for Turnkey). Our engineering team builds your bespoke 24/7 AI assistant, website prototype, and sector calculators immediately. You pay the remaining balance strictly upon live testing and final approval within 48 hours.',
  },
  {
    q: 'What if I already have a website (WordPress, Wix, Shopify, custom)?',
    a: 'You do not need to rebuild your website. Simply insert our 1-line lightweight script tag into your existing site in 60 seconds, and your 24/7 AI assistant and sector calculators will activate immediately with zero disruption to your current domain or hosting.',
  },
  {
    q: 'How does Bank Transfer Auto-Verification work?',
    a: 'We integrate directly with Moniepoint and Paystack virtual accounts. When a customer transfers funds via their mobile banking app (GTB, Kuda, Zenith, OPay), the payment is automatically verified in real time and an official digital receipt is issued on WhatsApp with zero manual delays.',
  },
  {
    q: 'How many B2B leads do I receive with the Lead Harvester?',
    a: 'Our Corporate Pro suite includes verified Nigerian B2B contacts every month, complete with verified business names, WhatsApp phone numbers, and decision-maker details across Lagos, Abuja, and Port Harcourt.',
  },
  {
    q: 'Can I do a 1-time purchase with 100% full code ownership and NO monthly subscription?',
    a: 'Yes, absolutely. For enterprises that require complete independence with zero recurring monthly fees, we offer an Outright Code Handover & IP Transfer package. You receive the complete production source code (ZIP & GitHub repository), full legal Intellectual Property transfer deed, setup scripts, and self-hosting documentation with lifetime unrestricted commercial ownership.',
  },
  {
    q: 'What happens if I need updates or price changes after deployment?',
    a: 'You have three flexible options: 1) Use your private, mobile-friendly Admin Dashboard to update prices, phone numbers, and products anytime with zero coding; 2) Submit on-demand developer update requests from our Pay-As-You-Go menu (from ₦10,000 per task); or 3) Choose an optional Annual Maintenance Pass for continuous domain renewal, cloud hosting, and monthly developer hours.',
  },
  {
    q: 'Can I cancel my monthly subscription anytime if I choose a managed plan?',
    a: 'Yes. If you choose our fully managed cloud hosting and AI maintenance plan, it can be cancelled at any time with a simple one-click notice. There are no long-term contracts, lock-ins, or cancellation penalties.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-14 border-t border-white/[0.04] scroll-mt-24"
    >
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
          <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Private Client Clarifications</span>
        </div>

        <h2
          id="faq-heading"
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-snug md:leading-tight"
        >
          Frequently Asked <span className="italic font-light text-[#d4af37]">Questions</span>
        </h2>

        <p className="text-sm sm:text-base text-[#c9c4bc] font-light leading-relaxed">
          Transparent answers regarding our commercial terms, technical integrations, and 48-hour delivery standards.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                isOpen 
                  ? 'bg-[#090d16] border border-[#d4af37]/35 shadow-lg shadow-black/40' 
                  : 'bg-[#090d16]/70 border border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <button
                id={`faq-btn-${i}`}
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left gap-4"
              >
                <span className="font-serif text-base sm:text-lg font-normal text-[#f5f3ef] leading-snug">
                  {item.q}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isOpen 
                      ? 'bg-[#d4af37] text-[#070b14]' 
                      : 'bg-white/[0.04] text-[#c9c4bc] border border-white/[0.08]'
                  }`}
                >
                  {isOpen ? <Minus className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className="px-5 sm:px-6 pb-6 pt-1 border-t border-white/[0.04]"
                >
                  <p className="text-xs sm:text-sm text-[#c9c4bc] font-light leading-relaxed">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
