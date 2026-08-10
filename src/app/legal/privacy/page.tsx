/**
 * @file src/app/legal/privacy/page.tsx
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Bethelmind Analytics',
  description: 'How Bethelmind Analytics & Strategy collects, uses, and protects your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-content">
      <p style={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 700, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 28 }}>
        ⚠ Template — review with a qualified Nigerian legal professional before production use.
      </p>

      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#f8fafc', margin: '0 0 6px' }}>
        Privacy Policy
      </h1>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 32 }}>Last updated: August 2026</p>

      <h2>1. Who We Are</h2>
      <p>
        Bethelmind Analytics & Strategy (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a business automation and customer-acquisition workflow provider based in Lagos, Nigeria. We can be contacted via WhatsApp at the number shown on our website or by email at the address provided during onboarding.
      </p>

      <h2>2. What Information We Collect</h2>
      <p>We may collect the following categories of information:</p>
      <ul>
        <li><strong>Business profile data:</strong> Business name, industry, location, products or services, provided during onboarding or through our website profiler.</li>
        <li><strong>Contact information:</strong> WhatsApp number, email address, and name used to communicate with us.</li>
        <li><strong>Payment information:</strong> Transfer reference, amount, and receipt submitted via WhatsApp for manual payment confirmation. We do not collect card numbers or process payments through an automated gateway.</li>
        <li><strong>Usage data:</strong> Pages visited and interactions with our website (where analytics tools are configured).</li>
        <li><strong>Enquiry data:</strong> Messages and information submitted through WhatsApp or website enquiry forms.</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>To configure and deliver your workflow setup and onboarding.</li>
        <li>To confirm and record your payment.</li>
        <li>To communicate with you regarding your subscription, support, or service updates.</li>
        <li>To improve our services and tools.</li>
      </ul>

      <h2>4. Legal Basis for Processing</h2>
      <p>
        We process your personal data on the basis of contract performance (to deliver the services you have subscribed to), legitimate interests (to operate and improve our business), and your consent where specifically requested.
      </p>

      <h2>5. Data Sharing</h2>
      <p>
        We do not sell your personal data to third parties. We may share data with service providers who assist in delivering our services (for example, hosting providers or communication tools), subject to confidentiality obligations.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your business profile and communication data for the duration of your subscription and for a reasonable period thereafter for legal and administrative purposes. You may request deletion at any time by contacting us via WhatsApp or email.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        Subject to applicable Nigerian data protection law (including the Nigeria Data Protection Regulation, NDPR), you may have the right to access, correct, or request deletion of your personal data. Contact us via WhatsApp or email to make a request.
      </p>

      <h2>8. Security</h2>
      <p>
        We take reasonable steps to protect your information from unauthorised access or disclosure. However, no transmission over the internet or WhatsApp is completely secure. Do not share sensitive financial or personal information beyond what is necessary.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Significant changes will be communicated via our website or WhatsApp. Continued use of our services after changes constitutes acceptance of the updated policy.
      </p>

      <h2>10. Contact</h2>
      <p>
        For privacy-related enquiries, contact us via WhatsApp at the number shown on our website or by email during onboarding.
      </p>
    </div>
  );
}
