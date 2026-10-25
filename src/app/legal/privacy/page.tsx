/**
 * @file src/app/legal/privacy/page.tsx
 * Comprehensive Data Privacy Policy under NDPA 2023 & NDPR
 * Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise, RC 7034297)
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, ShieldCheck, CheckCircle2, FileText, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Bethelmind Digital Solutions',
  description: 'How Bethelmind Digital Solutions protects personal data in full compliance with the Nigeria Data Protection Act 2023 (NDPA) and NDPR.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-content">
      {/* Header Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, marginBottom: 20 }}>
        <ShieldCheck style={{ width: 14, height: 14 }} />
        <span>Nigeria Data Protection Act 2023 (NDPA) &amp; NDPR Compliant</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#ffffff', margin: '0 0 10px', lineHeight: 1.2 }}>
        Privacy &amp; Data Protection Policy
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 28, lineHeight: 1.6 }}>
        <strong>Data Controller:</strong> Bethelmind Digital Solutions (CAC Certified Enterprise · RC 7034297 · Lagos, Nigeria)<br />
        <strong>Supervising Authority:</strong> Nigeria Data Protection Commission (NDPC)<br />
        <strong>Effective Date:</strong> Q4 2026
      </p>

      <h2>1. Introduction &amp; Commitment</h2>
      <p>
        Bethelmind Digital Solutions (&ldquo;Bethelmind&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) is committed to safeguarding the privacy and personal data of our website visitors, clients, and prospective commercial partners in strict compliance with the <strong>Nigeria Data Protection Act 2023 (NDPA)</strong>, the <strong>Nigeria Data Protection Regulation (NDPR)</strong>, and applicable international data governance standards.
      </p>
      <p>
        This Privacy Policy explains the categories of data we collect, our lawful bases for processing, how data is safeguarded, and your statutory rights as a data subject.
      </p>

      <h2>2. Categories of Personal Data We Collect</h2>
      <p>
        We practice data minimization and collect only data strictly necessary to configure and deliver business automation solutions:
      </p>
      <ul>
        <li><strong>Commercial Identity &amp; Profile Data:</strong> Business name, registered address, CAC registration number (where applicable), industry sector, and commercial service offerings provided during onboarding or via sector calculators.</li>
        <li><strong>Direct Contact Data:</strong> Authorized contact person name, business email address, and Nigerian mobile WhatsApp phone number.</li>
        <li><strong>Financial &amp; Settlement Verification Data:</strong> Bank payment transfer references, Moniepoint/NIBSS electronic settlement session IDs, transaction amounts, and payment dates required to verify milestone deposits. <em>Note: We do not collect, view, or store credit/debit card numbers or private bank PINs.</em></li>
        <li><strong>Client Configuration Telemetry:</strong> Sector calculator inputs (e.g., solar appliance loads, estimated vehicle CIF amounts) stored locally on your device to generate initial PDF estimates.</li>
        <li><strong>Technical &amp; Network Telemetry:</strong> IP address, device type, browser version, and server response latency used strictly to prevent denial-of-service (DoS) attacks and ensure edge reliability.</li>
      </ul>

      <h2>3. Lawful Bases for Processing Under the NDPA 2023</h2>
      <p>
        Under Section 25 of the Nigeria Data Protection Act 2023, we process personal data under the following recognized legal bases:
      </p>
      <ul>
        <li><strong>Performance of a Contract:</strong> To deliver website prototypes, register custom domains with registry authorities, configure WhatsApp AI quoting bots, and honor our 48-Hour delivery SLA.</li>
        <li><strong>Compliance with Legal Obligations:</strong> To maintain bankable corporate transaction ledgers as required by the Federal Inland Revenue Service (FIRS) and the Companies and Allied Matters Act (CAMA 2020).</li>
        <li><strong>Legitimate Interests:</strong> To secure our web infrastructure against fraud, audit system uptime, prevent fake bank transfer alerts, and optimize mobile responsiveness for Nigerian network conditions.</li>
        <li><strong>Explicit Consent:</strong> Where you voluntarily opt in to receive commercial updates, request a live private WhatsApp demonstration, or submit a custom project brief.</li>
      </ul>

      <h2>4. WhatsApp &amp; Automated Messaging Data Handling</h2>
      <p>
        When you interact with our 24/7 AI WhatsApp Assistants or test client prototypes:
      </p>
      <ul>
        <li>Messages are processed securely via official business APIs (Meta WhatsApp Cloud API / Evolution Engine).</li>
        <li>Conversations are used strictly to generate instant sector estimates, schedule private consultations, or dispatch branded PDF quotes.</li>
        <li>We never sell, rent, or lease client contact lists or inquiry numbers to third-party marketing brokers.</li>
        <li>Contacts have the absolute right to opt out at any time by simply messaging &ldquo;STOP&rdquo; or &ldquo;UNSUBSCRIBE&rdquo;.</li>
      </ul>

      <h2>5. Data Retention &amp; Disposal</h2>
      <p>
        We retain personal and commercial onboarding data only for as long as necessary to fulfill the purposes for which it was collected:
      </p>
      <ul>
        <li><strong>Active Client Accounts:</strong> Retained for the duration of the commercial engagement and active warranty period.</li>
        <li><strong>Financial Records:</strong> Transaction ledgers and bank webhook credit logs are retained for seven (7) years in compliance with Nigerian statutory accounting and tax laws.</li>
        <li><strong>Inquiry Leads &amp; Calculation Logs:</strong> Automatically purged or anonymized after ninety (90) days of inactivity unless converted into an active commercial contract.</li>
      </ul>

      <h2>6. Information Sharing &amp; Third-Party Processors</h2>
      <p>
        We do not disclose your personal data to third parties except as strictly required to deliver our services under binding data processing agreements:
      </p>
      <ul>
        <li><strong>Domain Registrars:</strong> Transmitting business contact details to NiRA-accredited registrars solely to register your requested `.com.ng` or `.com` domain name.</li>
        <li><strong>Financial Settlement Partners:</strong> Moniepoint Microfinance Bank and licensed payment switches to verify genuine electronic fund transfers.</li>
        <li><strong>Cloud Infrastructure Providers:</strong> Encrypted hosting providers (Vercel, Supabase, Cloudflare) operating high-security global data centers.</li>
        <li><strong>Statutory &amp; Law Enforcement Bodies:</strong> Only when legally compelled by a valid subpoena or court order issued by a competent Nigerian court.</li>
      </ul>

      <h2>7. Your Statutory Rights Under the NDPA 2023</h2>
      <p>
        As a data subject in Nigeria, you enjoy comprehensive statutory rights under the NDPA 2023:
      </p>
      <ul>
        <li><strong>Right to Access:</strong> You may request a complete copy of the personal data we hold concerning your business.</li>
        <li><strong>Right to Rectification:</strong> You may request the immediate correction of inaccurate or outdated information.</li>
        <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> You may request the permanent deletion of your data where continued retention has no lawful basis.</li>
        <li><strong>Right to Restrict or Object to Processing:</strong> You may object at any time to the processing of your data for direct marketing or outreach purposes.</li>
        <li><strong>Right to Data Portability:</strong> You may request that your project assets, database exports, and domain credentials be transferred to another provider.</li>
        <li><strong>Right to Lodge a Complaint:</strong> You have the right to lodge a complaint directly with the <strong>Nigeria Data Protection Commission (NDPC)</strong> (<code>info@ndpc.gov.ng</code>) if you believe your privacy rights have been infringed.</li>
      </ul>

      <h2>8. Data Security Measures</h2>
      <p>
        We enforce rigorous technical and organizational safeguards to prevent unauthorized access, loss, or alteration of data:
      </p>
      <ul>
        <li>Full end-to-end TLS 1.3 encryption for all data in transit across our website and APIs;</li>
        <li>Strict zero-trust API credential isolation, ensuring private server keys are never exposed client-side;</li>
        <li>Automated circuit-breakers and rate-limiting to block brute-force attacks; and</li>
        <li>Local-first architecture minimizing redundant cloud transmission.</li>
      </ul>

      <h2>9. Contact the Data Protection Desk</h2>
      <p>
        To exercise any of your data protection rights, submit a deletion request, or raise a privacy query:
      </p>
      <p>
        <strong>Data Protection Officer (DPO)</strong><br />
        Bethelmind Digital Solutions · CAC Certified Enterprise · RC 7034297<br />
        Plot 12, Commercial Corridor, Lagos, Nigeria<br />
        Direct WhatsApp: <code>+234 802 279 1227</code><br />
        Email: <code>privacy@bethelmindanalytics.com</code> / <code>bethelmindrecruit@gmail.com</code>
      </p>
    </div>
  );
}
