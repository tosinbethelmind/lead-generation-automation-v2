/**
 * @file src/app/legal/cookies/page.tsx
 * Cookie, Local Storage & Telemetry Policy
 * Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise, RC 7034297)
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie & Telemetry Policy | Bethelmind Digital Solutions',
  description: 'Official policy on cookie usage, client-side browser storage, and zero-cross-site-tracking privacy architecture.',
};

export default function CookiePolicyPage() {
  return (
    <div className="legal-content">
      {/* Header Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700, marginBottom: 20 }}>
        <Database style={{ width: 14, height: 14 }} />
        <span>NDPA 2023 &amp; NDPR Privacy Architecture</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#ffffff', margin: '0 0 10px', lineHeight: 1.2 }}>
        Cookie &amp; Browser Storage Policy
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 28, lineHeight: 1.6 }}>
        <strong>Entity:</strong> Bethelmind Digital Solutions (CAC Certified Enterprise · RC 7034297 · Lagos, Nigeria)<br />
        <strong>Last Updated &amp; Enforced:</strong> Q4 2026
      </p>

      <h2>1. Privacy-First Browser Storage Architecture</h2>
      <p>
        Bethelmind Digital Solutions is built on a <strong>privacy-conscious, zero-invasive-tracking</strong> architecture. We do not use third-party behavioral advertising cookies, cross-site trackers, or invasive data broker scripts.
      </p>

      <h2>2. What Technologies We Use</h2>
      <p>
        To ensure fast performance and remember your calculator configurations on metered mobile data, we utilize minimal, privacy-friendly client-side storage technologies:
      </p>
      <ul>
        <li><strong>Strictly Necessary Local Storage (localStorage):</strong> Used to remember your active industry selection, calculator parameters (e.g., solar appliance presets or vehicle VIN queries), and theme preferences so your work is not lost when refreshing the page.</li>
        <li><strong>Session Storage (sessionStorage):</strong> Temporarily holds calculation results and WhatsApp quote parameters during your active browser tab session. This data is automatically wiped when your browser tab is closed.</li>
        <li><strong>Functional Performance Telemetry:</strong> Anonymized performance telemetry used solely to detect page load latency, network error rates, and broken calculator formulas. This telemetry contains zero personally identifiable information (PII).</li>
      </ul>

      <h2>3. What We Strictly Do NOT Do</h2>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 20px', margin: '18px 0' }}>
        <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.8 }}>
          <li>We <strong>never sell, rent, or trade</strong> your browsing history or calculation data to third-party advertisers.</li>
          <li>We <strong>do not use cross-site tracking pixels</strong> that monitor your activities across other websites.</li>
          <li>We <strong>do not store sensitive financial details</strong>, bank PINs, or card numbers in your browser storage.</li>
        </ul>
      </div>

      <h2>4. Managing Browser Storage on Mobile &amp; Desktop</h2>
      <p>
        You have full control over browser storage. You can clear your cookies and local storage at any time via your browser settings:
      </p>
      <ul>
        <li><strong>Google Chrome (Android / Desktop):</strong> Settings &gt; Privacy and Security &gt; Clear Browsing Data &gt; Select &ldquo;Cookies and site data&rdquo;.</li>
        <li><strong>Apple Safari (iOS / macOS):</strong> Settings &gt; Safari &gt; Advanced &gt; Website Data &gt; Remove All Website Data.</li>
        <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data &gt; Clear Data.</li>
      </ul>
      <p>
        Note that clearing browser storage will simply reset your calculator presets to their factory defaults.
      </p>

      <h2>5. Compliance with Nigerian Data Protection Laws</h2>
      <p>
        This Cookie Policy complies with the <strong>Nigeria Data Protection Act 2023 (NDPA 2023)</strong> and the <strong>Nigeria Data Protection Regulation (NDPR)</strong>. For complete details on how we safeguard your personal data, please consult our <Link href="/legal/privacy" style={{ color: '#38bdf8' }}>Privacy Policy</Link>.
      </p>
    </div>
  );
}
