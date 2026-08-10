import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Responsible Use Policy | Bethelmind Analytics',
  description: 'Guidelines and safety protocols for responsible AI agent deployment, human oversight, and data privacy.',
};

export default function AiResponsibleUsePage() {
  return (
    <div className="legal-content">
      <p style={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 700, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 28 }}>
        ⚠️ Notice: This AI Responsible Use Policy applies to all Bethelmind AI Customer Care Concierges, Voice Assistants, and Automated Lead Engines.
      </p>

      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#f8fafc', margin: '0 0 6px' }}>
        AI Responsible Use & Safety Policy
      </h1>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 32 }}>Last updated: August 2026</p>

      <h2>1. Purpose and Scope</h2>
      <p>
        Bethelmind Analytics & Strategy builds automated AI Lead Generation Engines, 24/7 Virtual Customer Care Concierges, and Voice Note Assistants. This policy outlines our standards for deploying Artificial Intelligence safely, ethically, and responsibly.
      </p>

      <h2>2. Human-in-the-Loop Governance</h2>
      <p>
        AI agents are designed to assist and qualify leads, not to act with absolute legal authority. All high-stakes decisions—including enterprise pricing overrides, custom discounts, contract finalizations, and billing disputes—require explicit human authorization through our Central Approval Queue.
      </p>

      <h2>3. Transparency & AI Identity Disclosure</h2>
      <p>
        AI assistants must identify themselves as AI virtual assistants (e.g., &quot;Bethel AI Concierge&quot;). Customers are always notified when interacting with an automated agent and may request human escalation at any time.
      </p>

      <h2>4. Anti-Abuse & Escalation Protocols</h2>
      <p>
        When an interaction involves abusive language, high customer frustration, or complex custom requirements beyond trained scope, the AI agent is configured to instantly pause automated responses and route the conversation to a human manager.
      </p>

      <h2>5. Data Privacy & Security</h2>
      <p>
        Customer conversation logs are stored securely and processed solely to deliver customer service and lead routing. Conversation data is never sold to third parties or used to train open public AI models.
      </p>

      <h2>6. Accuracy & Non-Binding Guidance</h2>
      <p>
        While AI agents are trained on verified business catalogs and pricing models, automated outputs, estimates, and sizing calculations are illustrative guidance. Final invoices and contract terms are issued by authorized human management.
      </p>
    </div>
  );
}
