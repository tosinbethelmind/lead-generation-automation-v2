/**
 * @file src/app/legal/terms/page.tsx
 * Comprehensive Commercial Terms of Service
 * Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise, RC 7034297)
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Scale, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Bethelmind Digital Solutions',
  description: 'Official commercial terms, milestone payment contracts, and intellectual property terms for Bethelmind Digital Solutions.',
};

export default function TermsOfServicePage() {
  return (
    <div className="legal-content">
      {/* Header Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.25)', color: '#d4af37', fontSize: '0.75rem', fontWeight: 700, marginBottom: 20 }}>
        <Scale style={{ width: 14, height: 14 }} />
        <span>CAC Certified Enterprise · RC 7034297 · Commercial Agreement</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#ffffff', margin: '0 0 10px', lineHeight: 1.2 }}>
        Commercial Terms of Service
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 28, lineHeight: 1.6 }}>
        <strong>Corporate Entity:</strong> Bethelmind Digital Solutions (Registered with the Corporate Affairs Commission, Federal Republic of Nigeria · RC 7034297)<br />
        <strong>Official Corporate Settlement:</strong> Moniepoint Microfinance Bank (Account No: <code>6805375225</code>)<br />
        <strong>Effective Date:</strong> Q4 2026
      </p>

      <h2>1. The Commercial Agreement</h2>
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;, &ldquo;Agreement&rdquo;) constitute a legally binding agreement between you (&ldquo;Client&rdquo;, &ldquo;Customer&rdquo;, &ldquo;You&rdquo;) and <strong>Bethelmind Digital Solutions</strong> (&ldquo;Bethelmind&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), registered under the Companies and Allied Matters Act (CAMA 2020) of Nigeria.
      </p>
      <p>
        By accessing this website, utilizing our sector calculators, testing client prototypes (<code>/preview/[lead_id]</code>), paying an onboarding milestone deposit, or subscribing to our software solutions, you represent that you have read, understood, and agreed to be bound by these Terms and our incorporated <Link href="/legal/privacy" style={{ color: '#38bdf8' }}>Privacy Policy</Link>, <Link href="/legal/disclaimer" style={{ color: '#38bdf8' }}>Sector Tools Disclaimer</Link>, and <Link href="/legal/delivery" style={{ color: '#38bdf8' }}>Delivery SLA Policy</Link>.
      </p>

      <h2>2. Description of Services</h2>
      <p>
        Bethelmind provides turnkey digital solutions, bespoke mobile business websites, 24/7 AI-assisted WhatsApp sales and quoting assistants, interactive industry calculators (Solar BOQ, Tokunbo customs tariffs, plot layout sizers, etc.), digital PDF proposal generators, and Moniepoint/OPay bank transfer verification workflows tailored for Nigerian commercial enterprises.
      </p>

      <h2>3. Transparent Two-Tier Commercial Pricing &amp; Milestone Settlement</h2>
      <p>
        All services are structured with low-friction, milestone-protected terms:
      </p>
      <ul>
        <li><strong>Option 1 — Starter Activation (Fast Go-Live):</strong> ₦35,000 one-time setup (or ₦25,000/month on the Pay-Small-Small plan). Launches the business on a secure Bethelmind subdomain with full 24/7 WhatsApp closer and sector calculator.</li>
        <li><strong>Option 2 — Full Turnkey Custom Domain Suite:</strong> ₦150,000 total investment.
          <ul style={{ marginTop: 6 }}>
            <li><strong>Milestone 1 Deposit (50%):</strong> ₦75,000 required to commence custom `.com`/`.com.ng` domain registration, dedicated infrastructure staging, and engine configuration.</li>
            <li><strong>Milestone 2 Balance (50%):</strong> ₦75,000 strictly due <em>only after</em> the client tests and approves the live website and WhatsApp AI on their phone.</li>
          </ul>
        </li>
      </ul>

      <h2>4. Non-Payment &amp; Official Settlement Security</h2>
      <p>
        To prevent fraudulent bank transfer scams and ensure compliance with Nigerian financial regulations:
      </p>
      <ul>
        <li>All settlements must be remitted strictly to our CAC Certified corporate bank account: <strong>Moniepoint Microfinance Bank · Account No: <code>6805375225</code> · Account Name: Bethelmind Digital Solutions</strong>.</li>
        <li>Transfers are reconciled automatically via secure bank webhooks. Screenshots or paper slips alone do not constitute confirmed credit until verified on our corporate ledger.</li>
        <li>Failure to remit the Milestone 2 balance within 14 calendar days of approving the prototype on your phone may result in temporary suspension of custom domain routing until settled.</li>
      </ul>

      <h2>5. Sector Calculators &amp; Algorithmic Estimates</h2>
      <p>
        You expressly acknowledge and agree to our <Link href="/legal/disclaimer" style={{ color: '#38bdf8' }}>Sector Tools &amp; Calculation Accuracy Policy</Link>. All automated calculations, Bill of Quantities (BOQ) estimates, customs duty figures, land survey allocations, and procedure co-pays generated by our tools:
      </p>
      <ul>
        <li>Are mathematical simulations for preliminary guidance and commercial quoting only;</li>
        <li>Do not constitute certified engineering specifications, official government customs declarations, licensed legal land titles, medical advice, or formal tax clearance certificates; and</li>
        <li>Must be independently audited and certified by relevant licensed Nigerian professionals (COREN, SURCON, CRFFN, CITN) prior to major financial commitments.</li>
      </ul>

      <h2>6. Intellectual Property &amp; Codebase Ownership</h2>
      <ul>
        <li><strong>Turnkey Outright Packages:</strong> Upon 100% receipt of the agreed final milestone balance, full ownership, domain control, and customized source code rights transfer completely to the Client. The Client is free to host, modify, or expand the codebase without recurring licensing fees to Bethelmind.</li>
        <li><strong>Subscription Packages:</strong> For clients on monthly managed plans, Bethelmind grants a non-exclusive, non-transferable license to utilize the workflow, hosting infrastructure, and AI engine during the active subscription period.</li>
        <li><strong>Core Proprietary Frameworks:</strong> Underlying proprietary automation libraries, scraper engines, and multi-sector algorithmic frameworks developed independently by Bethelmind remain the exclusive intellectual property of Bethelmind Digital Solutions.</li>
      </ul>

      <h2>7. 48-Hour Delivery SLA &amp; 30-Day Setup Warranty</h2>
      <p>
        Bethelmind provides an accelerated 48-hour delivery commitment as set forth in our <Link href="/legal/delivery" style={{ color: '#38bdf8' }}>Delivery SLA Policy</Link>. Additionally, all live deployments include a <strong>30-Day Free Setup Warranty</strong> covering bug fixes, minor text edits, and WhatsApp AI intent calibrations at zero extra cost.
      </p>

      <h2>8. Limitation of Liability &amp; Indemnity</h2>
      <p>
        To the maximum extent permitted under Nigerian law (including the Federal Competition and Consumer Protection Act 2018):
      </p>
      <ul>
        <li>Bethelmind Digital Solutions shall not be liable for any indirect, incidental, punitive, or consequential damages (including loss of business profits, third-party network outages, Meta/WhatsApp account bans resulting from client misuse, customs valuation adjustments, or equipment performance variances).</li>
        <li>Our total aggregate liability for any and all claims arising from or related to our services shall in no event exceed the total amount actually paid by the Client to Bethelmind during the three (3) months preceding the event giving rise to liability.</li>
        <li>The Client agrees to indemnify and hold harmless Bethelmind Digital Solutions, its proprietors, and developers against any claims, losses, or expenses resulting from the Client&apos;s breach of these Terms or misuse of client-side messaging channels.</li>
      </ul>

      <h2>9. Acceptable Use &amp; Anti-Spam Compliance</h2>
      <p>
        Clients must strictly adhere to our <Link href="/legal/acceptable-use" style={{ color: '#38bdf8' }}>Acceptable Use Policy</Link> and <Link href="/legal/responsible-outreach" style={{ color: '#38bdf8' }}>Responsible Outreach Policy</Link>. Using our automation tools for unsolicited spam, fraudulent deceptive marketing, impersonation, or unlawful activities is strictly prohibited and results in immediate termination with zero refund.
      </p>

      <h2>10. Dispute Resolution &amp; Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. In the event of any commercial dispute:
      </p>
      <ol>
        <li>The parties shall first attempt in good faith to resolve the matter amicably through direct consultation via the Bethelmind executive desk within fourteen (14) business days.</li>
        <li>If unresolved, the dispute shall be submitted to the exclusive jurisdiction of the High Court of Lagos State, Nigeria.</li>
      </ol>

      <h2>11. Contact &amp; Notices</h2>
      <p>
        All formal legal notices should be directed to:
      </p>
      <p>
        <strong>Bethelmind Digital Solutions</strong><br />
        Plot 12, Commercial Corridor, Lagos, Nigeria<br />
        Executive Desk: <code>+234 802 279 1227</code><br />
        Email: <code>legal@bethelmindanalytics.com</code> / <code>bethelmindrecruit@gmail.com</code>
      </p>
    </div>
  );
}
