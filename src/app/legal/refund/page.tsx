/**
 * @file src/app/legal/refund/page.tsx
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Bethelmind Analytics',
  description: 'Refund and cancellation terms for Bethelmind Analytics & Strategy subscriptions.',
};

export default function RefundPolicyPage() {
  return (
    <div className="legal-content">
      <p style={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 700, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 28 }}>
        ⚠ Template — review with a qualified Nigerian legal professional before production use.
      </p>

      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#f8fafc', margin: '0 0 6px' }}>
        Refund & Cancellation Policy
      </h1>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 32 }}>Last updated: August 2026</p>

      <h2>1. Monthly Subscription</h2>
      <p>
        Our subscription plans are billed on a monthly basis. You may cancel your subscription at any time by contacting us via WhatsApp before your next billing cycle. Cancellation takes effect at the end of the current billing period — you retain access to your configured workflow until the end of the period for which you have paid.
      </p>

      <h2>2. One-Time Setup Fee</h2>
      <p>
        The one-time setup fee is non-refundable once onboarding work has commenced. This fee covers the time and work involved in initial workflow configuration, WhatsApp setup, sector tools, CRM setup, and the first review session. If onboarding has not yet begun and you cancel before any work is performed, we will consider a refund request on a case-by-case basis.
      </p>

      <h2>3. Monthly Subscription Refunds</h2>
      <p>
        Monthly subscription fees are non-refundable once the billing period has started. If you experience a service failure directly caused by us (for example, a configuration error that prevents your workflow from functioning), we will assess a pro-rated credit or refund on a case-by-case basis.
      </p>

      <h2>4. How to Cancel</h2>
      <p>
        To cancel your subscription, send a cancellation request via WhatsApp to the business number shown on our website. Include your business name and the plan you wish to cancel. We will confirm cancellation within one business day.
      </p>

      <h2>5. Payment Errors</h2>
      <p>
        If you transferred the wrong amount or transferred to the wrong account, contact us immediately via WhatsApp with your transfer receipt. We will work with you to resolve the situation. We are not responsible for transfers made to unofficial accounts or individuals not authorised by Bethelmind Analytics & Strategy.
      </p>

      <h2>6. Dispute Resolution</h2>
      <p>
        If you have a dispute about a charge, contact us via WhatsApp or email first. We aim to resolve all genuine disputes promptly and fairly. If we cannot resolve a dispute directly, it shall be subject to the jurisdiction of the courts of Lagos State, Nigeria.
      </p>
    </div>
  );
}
