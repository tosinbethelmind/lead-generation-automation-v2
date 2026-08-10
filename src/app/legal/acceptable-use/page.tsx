/**
 * @file src/app/legal/acceptable-use/page.tsx
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acceptable Use Policy | Bethelmind Analytics',
  description: 'Rules and restrictions on how Bethelmind Analytics services may be used.',
};

export default function AcceptableUsePolicyPage() {
  return (
    <div className="legal-content">
      <p style={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 700, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 28 }}>
        ⚠ Template — review with a qualified Nigerian legal professional before production use.
      </p>

      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#f8fafc', margin: '0 0 6px' }}>
        Acceptable Use Policy
      </h1>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 32 }}>Last updated: August 2026</p>

      <h2>1. Purpose</h2>
      <p>
        This Acceptable Use Policy (&ldquo;AUP&rdquo;) sets out the rules for using services provided by Bethelmind Analytics & Strategy. By subscribing to or using our services, you agree to comply with this AUP.
      </p>

      <h2>2. Permitted Uses</h2>
      <p>Our services may be used to:</p>
      <ul>
        <li>Manage and respond to genuine business enquiries from your own customers or prospects.</li>
        <li>Configure automated first-response and lead capture workflows for your own business.</li>
        <li>Use sector calculation tools to support your own sales and quoting process.</li>
        <li>Organise and follow up on leads generated through lawful means.</li>
      </ul>

      <h2>3. Prohibited Uses</h2>
      <p>You must not use our services to:</p>
      <ul>
        <li>Send unsolicited bulk messages (spam) to individuals who have not consented to receive communications from you.</li>
        <li>Impersonate any person, company, or official body, or misrepresent your identity.</li>
        <li>Engage in fraudulent, deceptive, or misleading outreach.</li>
        <li>Harass, threaten, or intimidate any individual.</li>
        <li>Violate WhatsApp&apos;s Terms of Service, Meta&apos;s policies, or any applicable platform terms.</li>
        <li>Collect, use, or process personal data without a lawful basis under applicable data protection law.</li>
        <li>Conduct outreach to individuals who have opted out or requested to be removed from your contact list.</li>
        <li>Use our tools for any unlawful purpose under Nigerian law or any applicable jurisdiction.</li>
        <li>Attempt to reverse-engineer, copy, or redistribute our workflow configurations or tools.</li>
        <li>Use our services in a way that could harm the reputation of Bethelmind Analytics & Strategy.</li>
      </ul>

      <h2>4. Lead Data Responsibility</h2>
      <p>
        You are solely responsible for ensuring that any contact lists, phone numbers, or lead data you use within your workflow were obtained lawfully and that you have a valid basis for reaching out to those individuals. We do not verify the source or legality of contact data you provide or use.
      </p>

      <h2>5. WhatsApp and Platform Rules</h2>
      <p>
        WhatsApp enforces strict policies on business messaging. You are responsible for understanding and complying with WhatsApp&apos;s Business Policy and any applicable Meta platform rules. Misuse may result in your WhatsApp Business account being banned. We are not liable for account suspensions or bans caused by your use of the platform.
      </p>

      <h2>6. Consequences of Violation</h2>
      <p>
        We reserve the right to suspend or terminate your subscription if we reasonably believe you are violating this AUP, without refund of any fees paid. We may also report unlawful activity to relevant authorities.
      </p>

      <h2>7. Changes</h2>
      <p>
        We may update this AUP from time to time. Continued use of our services after changes are published constitutes acceptance of the updated AUP.
      </p>
    </div>
  );
}
