/**
 * @file src/app/legal/delivery/page.tsx
 * Service Delivery, Handover SLA & Milestone Payment Policy
 * Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise, RC 7034297)
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, CheckCircle2, ShieldCheck, ArrowRight, FileCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Service Delivery & Milestone SLA Policy | Bethelmind Digital Solutions',
  description: 'Official 48-Hour delivery SLA, milestone payment schedule, inspection protocol, and handover warranty terms.',
};

export default function DeliverySlaPage() {
  return (
    <div className="legal-content">
      {/* Header Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, marginBottom: 20 }}>
        <Clock style={{ width: 14, height: 14 }} />
        <span>Official Commercial Delivery &amp; Handover SLA</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#ffffff', margin: '0 0 10px', lineHeight: 1.2 }}>
        Service Delivery &amp; Handover Policy
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 28, lineHeight: 1.6 }}>
        <strong>Entity:</strong> Bethelmind Digital Solutions (CAC Certified Enterprise · RC 7034297 · Lagos, Nigeria)<br />
        <strong>Last Updated &amp; Enforced:</strong> Q4 2026
      </p>

      {/* SLA Highlights Card */}
      <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 16, padding: '20px', marginBottom: 36 }}>
        <h3 style={{ color: '#ffffff', margin: '0 0 12px', fontSize: '1rem', fontWeight: 800 }}>
          Core Commercial Guarantees
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.8 }}>
          <li><strong>48-Hour Live Deployment Guarantee:</strong> Your working business prototype, sector calculator, and WhatsApp AI integration go live within 48 business hours of milestone deposit confirmation.</li>
          <li><strong>Pay-After-Approval Protection:</strong> The 50% completion balance is strictly due <em>only after</em> you inspect and test your live website and WhatsApp AI on your own mobile phone.</li>
          <li><strong>30-Day Post-Launch Setup Warranty:</strong> Full bug fixes, wording corrections, and WhatsApp catalog tuning included at zero extra charge.</li>
          <li><strong>100% Direct Corporate Settlement:</strong> All transactions route to our official corporate account at Moniepoint Microfinance Bank (<code>6805375225</code>).</li>
        </ul>
      </div>

      <h2>1. The 48-Hour Delivery Guarantee (Turnaround SLA)</h2>
      <p>
        Bethelmind Digital Solutions operates an accelerated rapid-deployment workflow for Nigerian SMEs. The standard delivery turnaround for commercial packages is <strong>48 business hours</strong> (excluding Nigerian statutory public holidays and Sundays).
      </p>
      <ul>
        <li><strong>Commencement of Turnaround:</strong> The 48-hour delivery clock begins when:
          <ol style={{ marginTop: 6 }}>
            <li>The agreed initial setup deposit (₦35,000 for Starter Activation or ₦75,000 for Turnkey Custom Domain Suite) clears into the corporate Moniepoint account; and</li>
            <li>The client provides core onboarding details (business name, primary WhatsApp phone number, physical address, and basic product/service pricing).</li>
          </ol>
        </li>
        <li><strong>Deliverables Within 48 Hours:</strong>
          <ul style={{ marginTop: 6 }}>
            <li>Live, mobile-responsive custom commercial website deployed on secure global edge hosting;</li>
            <li>Custom sector calculator or quotation module calibrated to client specifications;</li>
            <li>Automated 24/7 WhatsApp AI enquiry responder pre-configured to your business number;</li>
            <li>Bankable branded PDF quotation generator; and</li>
            <li>Instant Moniepoint/OPay bank transfer verification ledger workflow.</li>
          </ul>
        </li>
      </ul>

      <h2>2. Two-Tier Engagement Pricing &amp; Milestone Structure</h2>
      <p>
        To eliminate price friction and protect clients against contractor non-performance, all services follow a transparent two-tier pricing model:
      </p>

      <h3>Tier 1: Starter Activation (Pay-Small-Small / Fast Go-Live)</h3>
      <ul>
        <li><strong>Total Setup Fee:</strong> ₦35,000 one-time (or ₦25,000/month on the Pay-Small-Small plan).</li>
        <li><strong>Inclusions:</strong> Full mobile business website hosted on Bethelmind secure high-speed subdomain, interactive sector calculator, automated 24/7 WhatsApp closer, and OPay/Moniepoint transfer verification.</li>
        <li><strong>Settlement Terms:</strong> 100% due upon project activation.</li>
      </ul>

      <h3>Tier 2: Full Turnkey Custom Domain Suite</h3>
      <ul>
        <li><strong>Total Package Investment:</strong> ₦150,000 total.</li>
        <li><strong>Milestone 1 (50% Project Deposit):</strong> ₦75,000. Covers immediate `.com` or `.com.ng` custom domain registration, dedicated DNS routing, bespoke UI development, and sector calculation engine calibration.</li>
        <li><strong>Milestone 2 (50% Completion Balance):</strong> ₦75,000. <strong>Due ONLY after the client tests and approves the live website and WhatsApp AI quoter on their mobile device.</strong></li>
        <li><strong>Inclusions:</strong> Dedicated `.com` or `.com.ng` domain ownership, full sector calculator, 24/7 WhatsApp sales engine, Google Search SEO listing, and 100% intellectual property transfer.</li>
      </ul>

      <h2>3. Client Inspection &amp; Approval Protocol</h2>
      <p>
        Upon deployment of the live staging prototype (accessible via <code>https://www.bethelmindanalytics.com/preview/[lead_id]</code> or your custom domain):
      </p>
      <ul>
        <li>The client is granted a <strong>72-hour inspection window</strong> to review design, calculation logic, brand information, and WhatsApp AI responses.</li>
        <li>The client may submit reasonable adjustment requests (e.g., price updates, logo swaps, phone number changes, custom FAQ additions).</li>
        <li>Upon confirmation of satisfaction, the remaining 50% milestone balance becomes due.</li>
        <li>If the client does not respond within 7 calendar days of prototype delivery and has not requested revisions, the prototype is deemed accepted.</li>
      </ul>

      <h2>4. Intellectual Property &amp; Source Code Ownership</h2>
      <p>
        For clients purchasing outright turnkey packages:
      </p>
      <ul>
        <li>Upon receipt of final milestone settlement, <strong>100% ownership</strong> of the custom domain, website branding, and customized codebase transfers to the client.</li>
        <li>The client receives their Welcome Dashboard Pack, administrative credentials, and full rights to host, modify, or expand the codebase without recurring licensing fees to Bethelmind.</li>
      </ul>

      <h2>5. 30-Day Setup Warranty</h2>
      <p>
        All new deployments include our standard <strong>30-Day Free Setup Warranty</strong>:
      </p>
      <ul>
        <li>Covers bug fixes, calculation logic adjustments, and phone/WhatsApp number updates;</li>
        <li>Guaranteed response time of under 4 business hours via the Admin WhatsApp desk;</li>
        <li>Excludes major post-approval architectural rewrites or third-party platform API changes introduced by Meta/WhatsApp after launch.</li>
      </ul>

      <h2>6. Non-Refundable Third-Party Pass-Through Expenses</h2>
      <p>
        While Bethelmind guarantees our labor and delivery milestones, clients acknowledge that certain third-party government and registry fees are irreversible:
      </p>
      <ul>
        <li>Custom domain registration fees paid to the Nigeria Internet Registration Association (NiRA for `.ng`/`.com.ng`) or ICANN-accredited registrars cannot be cancelled or refunded once issued to the registry.</li>
        <li>Custom SSL encryption certificates and cloud bandwidth provisioned specifically for the client domain.</li>
      </ul>

      <h2>7. Official Settlement Channel</h2>
      <p>
        To protect against fraud and fake alert scams, all milestone deposits and balance settlements must be paid strictly to:
      </p>
      <div style={{ background: '#0a101d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px', margin: '16px 0', fontSize: '0.86rem' }}>
        <p style={{ margin: '0 0 6px', color: '#94a3b8' }}>Bank Name: <strong style={{ color: '#ffffff' }}>Moniepoint Microfinance Bank</strong></p>
        <p style={{ margin: '0 0 6px', color: '#94a3b8' }}>Account Number: <strong style={{ color: '#10b981', fontSize: '1rem' }}>6805375225</strong></p>
        <p style={{ margin: 0, color: '#94a3b8' }}>Account Name: <strong style={{ color: '#ffffff' }}>Bethelmind Digital Solutions</strong></p>
      </div>
      <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
        Never make payments to personal accounts. Bethelmind Digital Solutions assumes no responsibility for funds transferred to unauthorized third parties.
      </p>
    </div>
  );
}
