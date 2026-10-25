/**
 * @file src/app/legal/responsible-outreach/page.tsx
 * Responsible Outreach & Data Policy
 * Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise, RC 7034297)
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Send, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Responsible Outreach & Consent Policy | Bethelmind Digital Solutions',
  description: 'Standards for lawful B2B communication, opt-out protocols, NCC anti-spam rules, and NDPA compliance.',
};

export default function ResponsibleOutreachPage() {
  return (
    <div className="legal-content">
      {/* Header Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700, marginBottom: 20 }}>
        <Send style={{ width: 14, height: 14 }} />
        <span>Ethical B2B Outreach &amp; Consumer Consent Framework</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#ffffff', margin: '0 0 10px', lineHeight: 1.2 }}>
        Responsible Outreach &amp; Consent Policy
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 28, lineHeight: 1.6 }}>
        <strong>Entity:</strong> Bethelmind Digital Solutions (CAC Certified Enterprise · RC 7034297 · Lagos, Nigeria)<br />
        <strong>Effective Date:</strong> Q4 2026
      </p>

      <h2>1. Commitment to Ethical Business Communication</h2>
      <p>
        Bethelmind Digital Solutions adheres to strict ethical standards governing commercial communications. We believe automated technology should foster genuine commercial value, transparency, and trust—not nuisance messaging.
      </p>
      <p>
        This Policy establishes the standards of conduct required for all outbound communications, lead engagement, and customer messaging utilizing our software tools.
      </p>

      <h2>2. Statutory Compliance (NCC &amp; NDPA 2023)</h2>
      <p>
        All communications conducted via Bethelmind workflows must comply with:
      </p>
      <ul>
        <li>The <strong>Nigerian Communications Commission (NCC) Regulations</strong> on Value Added Services (VAS) and commercial messaging;</li>
        <li>The <strong>Nigeria Data Protection Act 2023 (NDPA)</strong> governing lawful processing of commercial contacts;</li>
        <li>The <strong>Federal Competition and Consumer Protection Act (FCCPA 2018)</strong> prohibiting false or misleading advertising; and</li>
        <li><strong>Meta&apos;s WhatsApp Business Messaging Policies</strong> and Commerce Policies.</li>
      </ul>

      <h2>3. Core Outreach Rules</h2>
      <p>Every commercial message dispatched using our systems must satisfy the following criteria:</p>
      <ul>
        <li><strong>Clear Commercial Identity:</strong> Messages must transparently identify the sending business name and registered entity. Deceptive headers or disguised identities are strictly prohibited.</li>
        <li><strong>Genuine Value Proposition:</strong> Outreach must pertain directly to the recipient&apos;s legitimate commercial sector or business operations.</li>
        <li><strong>Instant Opt-Out Mechanism:</strong> Every message must include an explicit, frictionless path for the recipient to opt out (e.g., &ldquo;Reply STOP to opt out&rdquo; or single-tap unsubscribe).</li>
        <li><strong>Immediate Opt-Out Processing:</strong> Opt-out requests must be honored immediately. The recipient&apos;s phone number or email must be permanently excluded from future marketing dispatches.</li>
        <li><strong>Bandwidth &amp; Time Sensitivity:</strong> Cold messaging must occur strictly during reasonable Nigerian business hours (08:30 AM to 06:00 PM West Africa Time, Monday through Friday). Late-night or weekend broadcasting is strictly prohibited.</li>
      </ul>

      <h2>4. Zero-Spam Guarantee &amp; Lead Integrity</h2>
      <p>
        Bethelmind strictly prohibits:
      </p>
      <ul>
        <li>Purchased third-party bulk phone number lists;</li>
        <li>Sequential phone number generators or broadcast storms; and</li>
        <li>Misleading hooks, fake delivery alerts, or fabricated invoices.</li>
      </ul>

      <h2>5. Opt-Out &amp; Contact Inquiries</h2>
      <p>
        If you received a communication from a Bethelmind workflow and wish to be permanently removed from all future contact lists:
      </p>
      <p>
        Simply reply &ldquo;STOP&rdquo; on WhatsApp, or send your phone number/email to our Compliance Desk at <code>compliance@bethelmindanalytics.com</code> or WhatsApp <code>+234 802 279 1227</code>. You will be permanently added to our master global suppression register within 2 hours.
      </p>
    </div>
  );
}
