import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Transparency & Disclaimer Policy | Bethelmind Analytics',
  description: 'Official AI output disclaimer, accuracy limits, and non-binding estimate notices for client websites.',
};

export default function AiDisclaimerPage() {
  return (
    <div className="legal-content">
      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#f8fafc', margin: '0 0 6px' }}>
        AI Output Disclaimer & Transparency Policy
      </h1>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 32 }}>Last updated: August 2026</p>

      <h2>1. AI Assistant Nature</h2>
      <p>
        The interactive tools, chatbots, voice synthesis modules, and calculators on this website are powered by artificial intelligence. While engineered for high accuracy and alignment with official business catalogs, responses are generated algorithmically.
      </p>

      <h2>2. Estimates & Quotations</h2>
      <p>
        Any price quotes, solar sizing recommendations, product estimates, or service schedules provided by our AI tools are preliminary estimates for informational purposes only. Official binding quotes will be issued after formal human review.
      </p>

      <h2>3. Human Verification Encouraged</h2>
      <p>
        Users are encouraged to verify critical specifications, installation details, or custom enterprise requirements directly with authorized business personnel via direct WhatsApp or email contact.
      </p>

      <h2>4. Limitation of Liability</h2>
      <p>
        Bethelmind Analytics and its client business partners shall not be held liable for temporary AI misinterpretations, third-party network delays, or reliance placed on non-binding automated estimates without written human confirmation.
      </p>
    </div>
  );
}
