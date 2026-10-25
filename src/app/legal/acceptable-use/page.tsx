/**
 * @file src/app/legal/acceptable-use/page.tsx
 * Acceptable Use Policy
 * Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise, RC 7034297)
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, AlertOctagon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Acceptable Use Policy | Bethelmind Digital Solutions',
  description: 'Rules, restrictions, and anti-abuse policies governing Bethelmind Digital Solutions workflows, sector tools, and messaging infrastructure.',
};

export default function AcceptableUsePolicyPage() {
  return (
    <div className="legal-content">
      {/* Header Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', fontSize: '0.75rem', fontWeight: 700, marginBottom: 20 }}>
        <AlertOctagon style={{ width: 14, height: 14 }} />
        <span>Anti-Abuse &amp; Service Integrity Standards</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#ffffff', margin: '0 0 10px', lineHeight: 1.2 }}>
        Acceptable Use Policy
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 28, lineHeight: 1.6 }}>
        <strong>Entity:</strong> Bethelmind Digital Solutions (CAC Certified Enterprise · RC 7034297 · Lagos, Nigeria)<br />
        <strong>Effective Date:</strong> Q4 2026
      </p>

      <h2>1. Purpose &amp; Scope</h2>
      <p>
        This Acceptable Use Policy (&ldquo;AUP&rdquo;) establishes the operational and ethical standards governing the use of all digital solutions, software workflows, WhatsApp automation bots, APIs, and sector tools provided by Bethelmind Digital Solutions.
      </p>
      <p>
        By using our services, accessing our prototypes, or deploying our workflows, you agree to comply strictly with this AUP and all applicable Nigerian and international communications and data protection laws.
      </p>

      <h2>2. Permitted Commercial Uses</h2>
      <p>Bethelmind solutions are designed strictly for genuine, lawful commercial operations:</p>
      <ul>
        <li>Automating first-response enquiry handling for your own verified commercial business;</li>
        <li>Deploying interactive sector quotation tools to calculate preliminary estimates for legitimate prospective customers;</li>
        <li>Managing customer appointment bookings and securing deposit receipts;</li>
        <li>Reconciling incoming bank transfer payments via official Moniepoint/OPay webhooks; and</li>
        <li>Organizing and following up with consenting business inquiries.</li>
      </ul>

      <h2>3. Strictly Prohibited Uses</h2>
      <p>You must not, under any circumstances, utilize our services or software to:</p>
      <ul>
        <li><strong>Unsolicited Bulk Messaging (Spam):</strong> Transmit bulk marketing messages to individuals without prior consent or legitimate commercial relationship, in violation of Nigerian Communications Commission (NCC) Value Added Services (VAS) regulations.</li>
        <li><strong>Fraudulent Schemes (419 / Advance Fee Fraud):</strong> Promote fake investment platforms, crypto ponzi schemes, forex doubling, illegal lottery schemes, or fake bank alert scams.</li>
        <li><strong>Impersonation &amp; Deception:</strong> Impersonate government agencies (CAC, FIRS, NCS, CBN), commercial banks, law enforcement, or other corporate entities.</li>
        <li><strong>Harassment &amp; Non-Compliance:</strong> Continue contacting individuals who have requested to opt out or unsubscribe from your communication list.</li>
        <li><strong>Platform Policy Violations:</strong> Violate Meta&apos;s WhatsApp Business Policy, Cloud API Terms, or platform anti-spam rules.</li>
        <li><strong>Reverse Engineering &amp; Unauthorized Distribution:</strong> Attempt to decompile, reverse engineer, resell, or distribute Bethelmind proprietary source code without an outright buyout agreement.</li>
      </ul>

      <h2>4. Client Data Responsibility</h2>
      <p>
        The Client is solely responsible for ensuring that all contact numbers, customer lists, and product catalog details uploaded to or processed through their workflow were lawfully obtained in full compliance with the <strong>Nigeria Data Protection Act 2023 (NDPA)</strong>. Bethelmind does not verify the legality or provenance of client-provided contact databases.
      </p>

      <h2>5. Enforcement &amp; Immediate Termination</h2>
      <p>
        Bethelmind maintains a zero-tolerance policy for fraudulent or unlawful use. We reserve the absolute right to immediately suspend, isolate, or terminate any account, custom domain routing, or WhatsApp instance found in violation of this AUP, without prior notice or refund of fees, and to report confirmed criminal activity to the relevant Nigerian law enforcement authorities.
      </p>

      <h2>6. Contact &amp; Violations Reporting</h2>
      <p>
        To report suspected violations of this policy:
      </p>
      <p>
        <strong>Bethelmind Abuse &amp; Compliance Desk</strong><br />
        Email: <code>compliance@bethelmindanalytics.com</code> / <code>bethelmindrecruit@gmail.com</code><br />
        WhatsApp Hotline: <code>+234 802 279 1227</code>
      </p>
    </div>
  );
}
