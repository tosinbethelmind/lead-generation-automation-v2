/**
 * @file src/app/legal/refund/page.tsx
 * Comprehensive Refund, Cancellation & Milestone Deposit Policy
 * Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise, RC 7034297)
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Bethelmind Digital Solutions',
  description: 'Official refund terms, 48-Hour delivery guarantee refund eligibility, milestone deposits, and dispute resolution protocol.',
};

export default function RefundPolicyPage() {
  return (
    <div className="legal-content">
      {/* Header Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#d4af37', fontSize: '0.75rem', fontWeight: 700, marginBottom: 20 }}>
        <RefreshCw style={{ width: 14, height: 14 }} />
        <span>Fair Trading &amp; Consumer Protection Policy</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#ffffff', margin: '0 0 10px', lineHeight: 1.2 }}>
        Refund &amp; Cancellation Policy
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 28, lineHeight: 1.6 }}>
        <strong>Entity:</strong> Bethelmind Digital Solutions (CAC Certified Enterprise · RC 7034297 · Lagos, Nigeria)<br />
        <strong>Official Corporate Settlement:</strong> Moniepoint Microfinance Bank (<code>6805375225</code>)<br />
        <strong>Effective Date:</strong> Q4 2026
      </p>

      {/* Highlights Box */}
      <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 16, padding: '20px', marginBottom: 36 }}>
        <h3 style={{ color: '#ffffff', margin: '0 0 10px', fontSize: '1rem', fontWeight: 800 }}>
          The Bethelmind Client Protection Guarantee
        </h3>
        <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.7 }}>
          We believe Nigerian business owners should never risk capital on unverified promises. Our <strong>Pay-After-Approval</strong> policy ensures you inspect and test your live website and WhatsApp AI quoter on your own smartphone before your 50% milestone balance is paid.
        </p>
      </div>

      <h2>1. The 48-Hour Delivery Guarantee &amp; Full Refund Eligibility</h2>
      <p>
        Bethelmind provides a strict <strong>48-Hour Live Delivery Guarantee</strong> for all commercial packages:
      </p>
      <ul>
        <li>If Bethelmind fails to deliver your functional mobile website and sector calculator prototype within 48 business hours of deposit confirmation (excluding delays caused by client failure to submit basic business details), you are entitled to cancel immediately and request a <strong>100% full refund of your initial deposit</strong>.</li>
        <li>Refunds under the 48-Hour Guarantee are processed and returned to your originating Nigerian bank account within two (2) business days of written request.</li>
      </ul>

      <h2>2. Milestone Deposit Terms (Turnkey Packages)</h2>
      <p>
        For Full Turnkey Custom Domain Suites (₦150,000 total investment):
      </p>
      <ul>
        <li><strong>Milestone 1 Deposit (50% · ₦75,000):</strong> This initial deposit covers dedicated server provisioning, bespoke UI design, custom sector calculator calibration, and domain acquisition. It is fully refundable if the delivery deadline is breached under Section 1 above. Once the working prototype is delivered for review, this labor deposit becomes non-refundable.</li>
        <li><strong>Milestone 2 Balance (50% · ₦75,000):</strong> <strong>Strictly due ONLY after you inspect, test, and approve your live website and WhatsApp quoter on your mobile phone.</strong> If you are dissatisfied during the inspection window, you are not obligated to pay the balance, and you may request adjustments under our standard revision process.</li>
      </ul>

      <h2>3. Starter Activation Packages</h2>
      <p>
        For Starter Activation packages (₦35,000 setup):
      </p>
      <ul>
        <li>Work commences immediately upon payment to configure your subdomain, catalog closer, and transfer reconciliation engine.</li>
        <li>Cancellations requested before work commences are eligible for a 100% refund.</li>
        <li>Once the working staging environment is provisioned and handed over, the setup fee is non-refundable, but is covered by our <strong>30-Day Setup Warranty</strong> for unlimited error corrections.</li>
      </ul>

      <h2>4. Monthly Managed Subscriptions &amp; Cancellation</h2>
      <p>
        For clients operating on monthly hosting and managed AI retainer plans (e.g., ₦25,000/month):
      </p>
      <ul>
        <li><strong>Cancel Anytime:</strong> You may cancel your monthly subscription at any time without long-term lock-in or cancellation penalties.</li>
        <li><strong>Notice Period:</strong> Cancellation requests must be submitted via WhatsApp or email at least three (3) business days prior to your next monthly renewal date.</li>
        <li><strong>Service Access:</strong> Upon cancellation, your services remain fully active until the conclusion of the paid monthly billing cycle.</li>
        <li><strong>Pre-paid Cycles:</strong> Monthly subscription fees already billed are non-refundable once the billing month commences.</li>
      </ul>

      <h2>5. Non-Refundable Third-Party Registry Expenses</h2>
      <p>
        Clients acknowledge that certain pass-through fees paid to sovereign registries and global third-party providers cannot be reversed:
      </p>
      <ul>
        <li><strong>Custom Domain Registrations:</strong> Once a dedicated `.com`, `.com.ng`, or `.ng` domain name has been registered with the Nigeria Internet Registration Association (NiRA) or ICANN registrar, the domain name fee is consumed by the registry and is non-refundable under registry rules.</li>
      </ul>

      <h2>6. How to Request a Refund or Cancellation</h2>
      <p>
        To request a cancellation or refund:
      </p>
      <ol>
        <li>Send a direct message to our Executive Desk via WhatsApp at <code>+234 802 279 1227</code> or email <code>billing@bethelmindanalytics.com</code>.</li>
        <li>State your business name, project reference or invoice number, and the reason for your request.</li>
        <li>Our billing officer will acknowledge receipt within four (4) business hours and resolve verified refund requests within two (2) business days via direct Moniepoint/NIP bank transfer.</li>
      </ol>

      <h2>7. Dispute Resolution &amp; Chargeback Protocol</h2>
      <p>
        In accordance with the Federal Competition and Consumer Protection Commission (FCCPC) guidelines:
      </p>
      <ul>
        <li>Clients agree to contact Bethelmind directly to resolve any invoice discrepancy or delivery concern before initiating third-party bank chargebacks.</li>
        <li>We maintain full, auditable server logs, deployment timestamps, and WhatsApp correspondence records to ensure fair and transparent resolution of all client inquiries.</li>
      </ul>
    </div>
  );
}
