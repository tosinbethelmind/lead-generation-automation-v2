/**
 * @file src/app/legal/responsible-outreach/page.tsx
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Responsible Outreach & Data Policy | Bethelmind Analytics',
  description: 'Bethelmind Analytics policy on responsible outreach, consent, data use, and AI agent conduct.',
};

export default function ResponsibleOutreachPage() {
  return (
    <div className="legal-content">
      <p style={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 700, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 28 }}>
        ⚠ Template — review with a qualified Nigerian legal professional before production use.
      </p>

      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#f8fafc', margin: '0 0 6px' }}>
        Responsible Outreach & Data Policy
      </h1>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 32 }}>Last updated: August 2026</p>

      <h2>1. Our Commitment</h2>
      <p>
        Bethelmind Analytics & Strategy is committed to responsible, respectful, and lawful business communication. This policy sets out our expectations for how clients use our services for outreach, and how we handle business data.
      </p>

      <h2>2. Your Responsibility for Outreach Lawfulness</h2>
      <p>
        You, as the business owner or operator, are solely responsible for ensuring that any outreach you conduct using our workflow tools has a lawful basis. This includes:
      </p>
      <ul>
        <li>Ensuring you have obtained valid consent where required by law or platform policy before sending marketing messages.</li>
        <li>Maintaining and honouring opt-out or unsubscribe requests promptly.</li>
        <li>Complying with the Nigeria Data Protection Regulation (NDPR) and any other applicable data protection obligations.</li>
        <li>Complying with WhatsApp&apos;s Business Policy and Meta&apos;s platform rules at all times.</li>
        <li>Complying with all other applicable Nigerian consumer protection and communications laws.</li>
      </ul>

      <h2>3. Prohibited Outreach Conduct</h2>
      <p>You must not use our tools to conduct outreach that involves:</p>
      <ul>
        <li>Spam — unsolicited bulk messaging to individuals who have not consented.</li>
        <li>Deception or misrepresentation — false or misleading claims about your products, prices, identity, or business.</li>
        <li>Impersonation of another person, company, or authority.</li>
        <li>Harassment or persistent contact with individuals who have asked not to be contacted.</li>
        <li>Collection or use of personal data without a valid legal basis.</li>
        <li>Any outreach that is abusive, threatening, discriminatory, or unlawful.</li>
      </ul>

      <h2>4. Lead Data Sources and Validation</h2>
      <p>
        Where you use contact lists or lead data with our workflows, you are responsible for:
      </p>
      <ul>
        <li>Knowing the source and provenance of your contact data.</li>
        <li>Understanding the freshness and accuracy of your data.</li>
        <li>Ensuring the contacts on your list have a reasonable expectation of being contacted by your type of business.</li>
        <li>Removing or updating contacts who have opted out, been unreachable, or whose data is outdated.</li>
      </ul>
      <p>
        We do not independently verify the legality or quality of contact lists you use. Using inaccurate, stale, or unlawfully obtained data is your responsibility and risk.
      </p>

      <h2>5. AI Agent Conduct and Human Handoff</h2>
      <p>
        Our AI-assisted workflow tools are designed to support your team — not to replace human judgment in sensitive situations. We require that:
      </p>
      <ul>
        <li>Your workflow includes a clear and accessible path for contacts to reach a human team member.</li>
        <li>AI-generated responses do not make false promises, guarantee outcomes, or misrepresent your business.</li>
        <li>Sensitive, complex, high-value, or emotionally significant conversations are handled by a human member of your team.</li>
        <li>Contacts can be informed, upon request, that they are interacting with an automated workflow.</li>
      </ul>

      <h2>6. Data Access, Correction, and Deletion Requests</h2>
      <p>
        Individuals whose data you process through our tools may have rights under the NDPR or other applicable law to request access to, correction of, or deletion of their data. You are responsible for honouring these requests. You may also contact us via WhatsApp or email if you wish to review, correct, or delete data you have shared with us during onboarding.
      </p>

      <h2>7. Reporting Concerns</h2>
      <p>
        If you believe our tools are being misused, or if you have a concern about outreach you have received that you believe originated from a Bethelmind Analytics workflow, please contact us via WhatsApp or email and we will investigate.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Continued use of our services after changes are published constitutes acceptance of the updated policy.
      </p>
    </div>
  );
}
