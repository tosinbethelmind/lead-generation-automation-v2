import { NextRequest, NextResponse } from 'next/server';

const DOCS_CATALOG: Record<string, { filename: string; title: string; content: string }> = {
  admin_assistant_walkthrough: {
    filename: 'ADMIN_ASSISTANT_OPERATIONS_WALKTHROUGH.md',
    title: 'Human Admin Assistant Operations & Governance Walkthrough',
    content: `# Human Admin Assistant Operations & Governance Walkthrough
**Bethelmind Analytics & Lead Generation Platform**

---

## 1. Overview & Assistant Capabilities
Your Human Admin Assistant account is configured with granular operational permissions to manage day-to-day sales, client web redesigns, and AI governance.

### Core Assistant Capabilities:
- **Prompt-Based AI Redesign**: Redesign any lead preview site using natural language text prompts (e.g., "Redesign for luxury solar firm in Lekki with dark gold theme").
- **Modular Feature Customization**: Add selective features (WhatsApp AI Bot, Voice Notes, Moniepoint/OPay Virtual Account Box, AI Outbound Caller, Recruitment Engine) to client sites.
- **Dynamic Pricing Binding**: Automatically recalculate Setup Fees (NGN) and Monthly Renewals with an automatic 15% bundle discount when 3+ features are selected.
- **Human-in-the-Loop Interception**: Review, edit prompts, and authorize high-stakes AI responses before they are dispatched.
- **Live Preview Testing**: Test interactive chatbots, calculators, and payment boxes in real time.

---

## 2. Step-by-Step Operations Guide

### Step 1: Redesigning a Lead's Website from a Prompt
1. Navigate to **Admin Dashboard -> Design & Redesign Studio** (\`/admin/design\`).
2. Enter the target **Lead ID or Business Slug** (e.g. \`lekki-solar-hub\`).
3. Type a descriptive prompt in the Redesign box:
   *Example:* \`Redesign for a top luxury solar enterprise in Lekki. Use a dark gold theme (#1c1917) with amber accents, rewrite hero title to "Premium Solar & Battery Inverters", and highlight 24/7 support.\`
4. Click **"Redesign Website from Prompt"**. The AI engine will immediately apply new colors, copywriting, and layout structures.

### Step 2: Adding Modular Features & Setting Custom Pricing
1. On the same page, view the **Modular Feature Catalog**.
2. Select the features desired for the client (e.g., WhatsApp Voice Notes + Moniepoint Account Box + 24/7 AI Care Agent).
3. Review the **Calculated Package Setup Price** and bundle discounts.
4. Click **"Save Package & Bind Claim Fee"** to lock the custom invoice price for that lead.

### Step 3: Authorizing AI Decisions in the Approval Queue
1. Navigate to **Admin Dashboard -> AI Approvals** (\`/admin/approvals\`).
2. Filter tickets by \`PENDING_HUMAN_APPROVAL\`.
3. Click **"Approve / Modify Prompt"** to inspect the AI's proposed reply.
4. (Optional) Edit the prompt instruction modifier to refine the response.
5. Click **"Authorize Execution"** to send the message.

---

## 3. Security Boundaries & Guardrails
- **Restricted Access**: Admin Assistants cannot view or edit system secrets (API keys, Supabase DB passwords, Paystack secret keys).
- **No Team Tokens Modification**: Cannot add or delete other admin accounts.
- **No Production Code Redeploys**: Cloud deployments remain under Super Admin control.
`,
  },
  ai_responsible_use_policy: {
    filename: 'AI_RESPONSIBLE_USE_POLICY.md',
    title: 'AI Responsible Use & Safety Policy',
    content: `# AI Responsible Use & Safety Policy
**Bethelmind Analytics & Strategy**

## 1. Purpose and Scope
This policy sets standards for deploying Artificial Intelligence safely, ethically, and transparently across all Bethelmind AI Customer Care Concierges, Voice Synthesis Assistants, and Lead Generation Engines.

## 2. Human-in-the-Loop Oversight
All high-stakes interactions—including enterprise pricing overrides, custom discounts, contract finalizations, and billing disputes—require explicit human approval in the Central Approval Queue.

## 3. Transparency & AI Identity Disclosure
AI agents must clearly identify themselves as automated virtual assistants. Customers are informed of AI interactions and may request human handoff at any time.

## 4. Anti-Abuse & Escalation Protocols
If an interaction involves abusive language, high customer frustration, or complex requirements outside trained scope, the AI agent will instantly pause and route the conversation to a human manager.

## 5. Data Privacy
Customer interaction logs are stored securely and never sold to third parties or used to train open public models.
`,
  },
  ai_disclaimer_policy: {
    filename: 'AI_DISCLAIMER_POLICY.md',
    title: 'AI Output Transparency & Accuracy Disclaimer',
    content: `# AI Output Transparency & Accuracy Disclaimer
**Bethelmind Analytics & Strategy**

## 1. Algorithmic Nature
Interactive tools, chatbots, voice synthesis modules, and sizing calculators are powered by artificial intelligence. Output responses are generated algorithmically based on business data inputs.

## 2. Non-Binding Guidance
Price quotes, solar sizing recommendations, and service schedules provided by AI tools are preliminary estimates for informational purposes only. Binding invoices require formal human confirmation.

## 3. Verification Encouraged
Users are encouraged to verify critical specifications or custom requirements directly with authorized business personnel.
`,
  },
  client_ip_transfer: {
    filename: 'CLIENT_IP_TRANSFER_AGREEMENT.md',
    title: 'Software & Website IP Transfer Agreement',
    content: `# Software & Turnkey Website IP Transfer Agreement
**Bethelmind Analytics & Strategy**

## 1. Transfer of Rights
Upon payment of the setup fee, Bethelmind Analytics transfers perpetual usage rights for the provisioned custom website, layout styles, and software configuration to the designated client enterprise.

## 2. Included Assets
- Turnkey Responsive Web Portal
- 1-Line Embed Script Widget
- AI Customer Care Knowledge Base Configuration
- Dedicated Moniepoint / OPay Account Integration
`,
  },
  responsible_outreach_policy: {
    filename: 'RESPONSIBLE_OUTREACH_POLICY.md',
    title: 'Responsible Outreach & NDPR Compliance Policy',
    content: `# Responsible Outreach & Messaging Compliance Policy
**Bethelmind Analytics & Strategy**

## 1. Lawful Basis for Outreach
Clients are responsible for ensuring that any outreach conducted using platform tools complies with the Nigeria Data Protection Regulation (NDPR) and Meta / WhatsApp Business policies.

## 2. Opt-Out Honor
All opt-out or unsubscribe requests must be processed and honored immediately.
`,
  },
  sla_service_level_agreement: {
    filename: 'SERVICE_LEVEL_AGREEMENT_SLA.md',
    title: 'Service Level Agreement (SLA) & Uptime Guarantee',
    content: `# Service Level Agreement (SLA) & System Guarantee
**Bethelmind Analytics & Strategy**

## 1. Uptime Target
Bethelmind Analytics targets **99.9% operational availability** for client hosted web portals, AI concierge endpoints, and 1-line script embed widgets.

## 2. Maintenance & Notifications
Scheduled system maintenance is performed during low-traffic windows (12:00 AM - 4:00 AM WAT) with advance notice provided to admin users.

## 3. Support Response Times
- **Critical Outages**: Guaranteed response within 1 hour.
- **General Inquiries & AI Prompts**: Guaranteed response within 12 hours.
- **Custom Site Revisions**: Completed within 24-48 hours.
`,
  },
  client_onboarding_guide: {
    filename: 'CLIENT_ONBOARDING_GUIDE.md',
    title: 'Client Turnkey Website & AI Onboarding Guide',
    content: `# Client Turnkey Website & AI Sales Engine Onboarding Guide
**Bethelmind Analytics & Strategy**

## 1. Step 1: Claim & Verify Your Site Link
Visit your provisioned website URL (e.g. \`https://www.bethelmindanalytics.com/preview/your-business\`) and test your 24/7 AI Lead Specialist.

## 2. Step 2: Add Link to Social Media Profiles
Copy your web link and paste it into your WhatsApp Business profile, Instagram Bio, Facebook Page, and Google Business profile.

## 3. Step 3: Embed Widget on Existing Site (Optional)
Copy your 1-line script embed tag:
\`\`\`html
<script src="https://www.bethelmindanalytics.com/api/widget/your-slug.js" async></script>
\`\`\`
Paste this snippet before the closing \`</body>\` tag of your WordPress, Wix, or Shopify site to load your floating AI Concierge.

## 4. Step 4: Receive Qualified Leads
Every quote request, voice inquiry, and appointment booking will route directly to your designated WhatsApp number.
`,
  },
  terms_of_service: {
    filename: 'MASTER_TERMS_OF_SERVICE.md',
    title: 'Master Terms of Service & Subscription Conditions',
    content: `# Master Terms of Service
**Bethelmind Analytics & Strategy**

## 1. Agreement
By accessing or using Bethelmind Analytics software, lead scrapers, AI widgets, and client websites, you agree to these Master Terms of Service.

## 2. Subscriptions & Renewal
Monthly subscription fees cover hosting, AI model API tokens, automated lead scrapers, and ongoing technical support. Renewals are billed on the anniversary of subscription activation.

## 3. Acceptable Conduct
Users agree not to utilize platform tools for deceptive marketing, unlawful spamming, or fraudulent activity.
`,
  },
  privacy_policy: {
    filename: 'PRIVACY_POLICY_AND_NDPR.md',
    title: 'Privacy Policy & Data Protection Statement',
    content: `# Privacy Policy & Data Protection Statement
**Bethelmind Analytics & Strategy**

## 1. Data Collection
We collect business profile details, contact preferences, and customer support conversation logs solely to deliver AI concierge automation and lead generation services.

## 2. Data Protection & Security
All stored lead details and system logs are encrypted at rest and in transit. We comply with the Nigeria Data Protection Regulation (NDPR) and international privacy best practices.
`,
  },
  partner_referral_agreement: {
    filename: 'PARTNERSHIP_AND_REFERRAL_AGREEMENT.md',
    title: 'Agency & Partner Referral Agreement',
    content: `# Agency & Partner Referral Program Agreement
**Bethelmind Analytics & Strategy**

## 1. Partner Commissions
Approved agency partners earn a **15% recurring commission** on setup fees and ongoing monthly subscriptions for every business client onboarded to the Bethelmind AI Lead Generation platform.

## 2. Payout Terms
Commissions are calculated monthly and paid via direct Moniepoint / OPay bank transfer upon verification of active client subscriptions.
`,
  },
};

export async function GET(req: NextRequest) {
  const docKey = req.nextUrl.searchParams.get('doc') || 'admin_assistant_walkthrough';
  const doc = DOCS_CATALOG[docKey] || DOCS_CATALOG.admin_assistant_walkthrough;

  return new NextResponse(doc.content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${doc.filename}"`,
    },
  });
}
