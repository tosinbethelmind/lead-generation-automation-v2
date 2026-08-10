/**
 * @file src/app/legal/terms/page.tsx
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Bethelmind Analytics',
  description: 'Terms and conditions for using Bethelmind Analytics & Strategy services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="legal-content">
      <p style={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 700, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 28 }}>
        ⚠ Template — review with a qualified Nigerian legal professional before production use.
      </p>

      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#f8fafc', margin: '0 0 6px' }}>
        Terms of Service
      </h1>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 32 }}>Last updated: August 2026</p>

      <h2>1. Agreement</h2>
      <p>
        By subscribing to or using any service offered by Bethelmind Analytics & Strategy (&ldquo;we&rdquo;, &ldquo;us&rdquo;), you agree to these Terms of Service. If you do not agree, do not use our services.
      </p>

      <h2>2. Services</h2>
      <p>
        We provide business automation and customer-acquisition workflow services including, but not limited to, WhatsApp enquiry workflow setup, simple CRM configuration, sector-specific tools, and guided onboarding. The scope of services delivered depends on your selected subscription plan and specific business requirements agreed during onboarding.
      </p>

      <h2>3. Subscription and Payment</h2>
      <ul>
        <li>Subscriptions are billed monthly. A one-time setup fee is charged at the start of your subscription.</li>
        <li>Payment is currently accepted via manual OPay bank transfer only. We do not operate an automated payment gateway.</li>
        <li>Your subscription is activated after we manually confirm receipt of payment via WhatsApp.</li>
        <li>Subscription fees are due at the start of each monthly cycle. Non-payment may result in suspension of services.</li>
      </ul>

      <h2>4. Cancellation and Refunds</h2>
      <p>
        Please refer to our <a href="/legal/refund">Refund and Cancellation Policy</a> for full details.
      </p>

      <h2>5. Acceptable Use</h2>
      <p>
        You must use our services in accordance with our <a href="/legal/acceptable-use">Acceptable Use Policy</a>. You are responsible for all activity conducted using your workflow setup.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        All workflow configurations, tools, and materials provided by us remain the intellectual property of Bethelmind Analytics & Strategy. You are granted a non-exclusive licence to use them for your own business purposes during your active subscription.
      </p>

      <h2>7. No Guarantee of Results</h2>
      <p>
        We do not guarantee specific business outcomes, lead volumes, conversion rates, revenue increases, or other results from using our services. Outcomes depend on your business process, data quality, team responsiveness, and market conditions.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, our liability to you for any claim arising from the use of our services is limited to the monthly fees paid by you in the month in which the claim arose.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.
      </p>

      <h2>10. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Significant changes will be communicated via our website or WhatsApp. Continued use of our services constitutes acceptance of the updated Terms.
      </p>
    </div>
  );
}
