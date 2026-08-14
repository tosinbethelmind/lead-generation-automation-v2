/**
 * @file customerAiAgent.ts
 * Deep Intelligence Customer AI Agent & Critical Stage WhatsApp Approval Engine
 */

import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient';
import { getRuntimeConfig } from './localConfig';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';
import { logActivity } from './activityLogger';
import { convertLeadToDeal } from './pipelineManager';
import { processAutoresponderMessage } from './autoresponderEngine';
import { sendWhatsAppMessage } from './whatsapp';
import { paymentConfig } from '@/config/payment';
import { PLANS } from '@/config/plans';
import { SECTOR_PROFILES } from '@/config/sectors';

export type CriticalStage =
  | 'quote_finalization'
  | 'enterprise_deal'
  | 'payment_request'
  | 'pricing_override'
  | 'human_escalation';

export interface ApprovalRequest {
  id: string;
  session_id: string;
  stage: CriticalStage;
  title: string;
  details: string;
  proposed_quote?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  resolved_at?: string;
}

export interface CustomerAiAgentConfig {
  agent_name: string;
  avatar_url: string;
  sector: string;
  tone: string;
  system_prompt: string;
  temperature: number;
  ai_model: string;
  handover_enabled: boolean;
  auto_lead_conversion: boolean;
  admin_whatsapp_phone: string;
  welcome_message: string;
  custom_faq: { question: string; answer: string }[];
  updated_at: string;
}

export interface AiAgentMessage {
  id: string;
  sender: 'user' | 'agent' | 'human' | 'system';
  text: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  requires_approval?: boolean;
}

export interface CustomerAiSession {
  session_id: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  sector: string;
  messages: AiAgentMessage[];
  status: 'active' | 'pending_approval' | 'handed_over' | 'resolved';
  sentiment: 'positive' | 'neutral' | 'negative';
  lead_captured: boolean;
  pending_approval?: ApprovalRequest;
  lead_id?: string;
  deal_id?: string;
  created_at: string;
  updated_at: string;
}

const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getAgentConfigPath(): string {
  return isServerless
    ? path.join('/tmp', 'customer_ai_agent_config.json')
    : path.join(process.cwd(), 'local_db', 'customer_ai_agent_config.json');
}

function getAgentSessionsPath(): string {
  return isServerless
    ? path.join('/tmp', 'customer_ai_sessions.json')
    : path.join(process.cwd(), 'local_db', 'customer_ai_sessions.json');
}

const WEBAPP_KNOWLEDGE_BASE = `
SYSTEM ARCHITECTURE & CAPABILITIES KNOWLEDGE GRAPH:
You possess complete human-level understanding of all platform features, landing pages, claiming options, pricing, and sector tools. This knowledge base is ALWAYS current — updated with every website change.

1. SCRAPED LEAD WEBSITE & PORTAL CLAIMING WORKFLOW:
   - What happens when a business lead receives a preview link: We pre-generated a complete, custom, high-converting AI website and sector tools specifically for their business using their Google Business data (name, category, location, rating, services).
   - The AI Concierge greets each lead by their business name, mentions their Google rating & location, and immediately explains the value of activating.
   - Claiming Options:
     * Option A (Has Existing Website): They claim by adding 1 line of code to their WordPress, Wix, Squarespace, or custom site in 60 seconds: <script src="https://www.bethelmindanalytics.com/api/widget/their-lead-id.js"></script>
     * Option B (No Website): We host their complete portal on a custom subdomain (e.g. businessname.bethelmindanalytics.com) or map their own domain (e.g. www.businessname.com) with free SSL auto-provisioning.
   - Pricing & Claim Fees:
     * One-time setup fee: ₦185,000 NGN (full claim — own domain + complete system).
     * 50% Deposit Option: ₦92,500 NGN to start onboarding immediately today.
     * Monthly Subscription (after first 30 days): ₦35,000/month.
   - Bank Payment Details (Moniepoint MFB / OPay):
     * Bank: Moniepoint Microfinance Bank / OPay Digital Services
     * Account Number: 7034297995
     * Account Name: Oyelakin Tosin Matthew (Bethelmind Analytics)
     * WhatsApp Receipt Verification: Send transfer receipt to 2348022791227 for 1-minute activation.

2. AI CONCIERGE INTELLIGENT FEATURES (ALL ACTIVE ON EVERY PAGE):
   - Exit-Intent Auto-Engagement: When a visitor moves their cursor to close the page, the AI Concierge widget automatically pops open with a personalized urgent offer, e.g. "Wait, [Business Name]! Before you leave, let me show you how to claim your 24/7 AI Chatbot with just ₦92,500!"
   - Audio Voice Synthesizer: Every chat message can be read aloud using the browser's Web Speech API. Visitors click "🔊 Listen Voice" in the chat header. The AI greets scraped leads by voice using their business name and sector 2.5 seconds after page load.
   - Hyper-Personalized Greetings: When a scraped lead opens their preview link, the AI immediately addresses them by name: "Hello [Business Name]! 🌟 Your Google profile shows you're rated [X]★ with [N] reviews in [Area]. I've already built a custom portal for your [Category] business! Shall I walk you through activating it today?"
   - Dynamic Quick-Action Chips: Quick-reply buttons adapt to the lead's business category:
     * Solar businesses get: "☀️ Quote 5kVA Solar System for [Business Name]"
     * Real Estate gets: "🏠 Show [Business Name] Real Estate Lead Tools"
     * Auto dealers get: "🚗 Tokunbo Auto Duty Calculator for [Business Name]"
     * Clinics get: "🏥 Clinic Appointment Booking AI for [Business Name]"

3. ALL 8 SECTOR TOOLS & CALCULATORS:
   - Solar & Renewable Energy: Solar BOQ load estimator (3.5kVA, 5kVA, 10kVA+), battery type breakdown (Lithium vs Tubular), panel count, and generator fuel savings calculator.
   - Real Estate & Luxury Property: 6-12 month installment payment schedule, mortgage calculator, and site inspection booking.
   - Tokunbo Automotive Importers: Vehicle import duty calculator (Nigeria Customs rates), port clearing fees, and haulage delivery.
   - Legal & CAC Corporate Registration: CAC name reservation, filing fee lookup (Business Name ₦10k, LTD ₦10k+duty, NGO ₦35k), and professional legal consultation.
   - Retail & E-Commerce Logistics: Lagos Island vs Mainland delivery cost calculator and WhatsApp quick-order builder.
   - Clinics & Healthcare: HMO insurance coverage lookup and doctor appointment scheduling.
   - Schools & Academies: Termly tuition fee reference and online admission form.
   - General B2B Services: Instant quote generator, lead qualification, and appointment scheduler.

4. SUBSCRIPTION PACKAGES & PRICING PLANS:
   - Express Starter (₦75,000 setup + ₦15,000/mo): 24/7 AI Chatbot, WhatsApp Catalog, 500 Lagos B2B Contacts, free subdomain.
   - Business Growth Pro (₦185,000 setup + ₦35,000/mo): Lead Harvester (10k leads/mo) + AI Customer Specialist + WhatsApp Voice Notes + Sector Tools. [Most Popular — 70% choice]
   - VIP Enterprise Suite (₦350,000+ setup + ₦75,000+/mo): AI Voice Phone Calling + Custom Domain Hosting + Dedicated Account Manager + Unlimited leads.

5. MULTI-CHANNEL AUTOMATED OUTREACH:
   - WhatsApp Baileys Automation: Direct WhatsApp message dispatch, spintax message variations, interactive button templates.
   - Email SMTP & Nodemailer: Instant PDF proposals, drip campaigns, HTML templates.
   - SMS API: Immediate appointment reminders & order alerts.

6. ADMIN CONTROL PANEL CAPABILITIES (for your reference):
   - Customer AI Agent Control Panel: /admin/ai-agent — Live AI Sandbox, WhatsApp Critical Approvals, Persona Settings, Transcript Logs.
   - Demands & Lead Journey Analytics: Tracks top customer requests, sentiment ratios (65% high-intent, 25% technical inquiry, 10% hesitating), full 5-step lead journey map.
   - 1-Click CSV Transcript Export: Download all AI conversation transcripts for strategy review and product iteration.
   - Human Escalation Anti-Abuse Protocol: 98% of queries resolved by AI. Human escalation only permitted after name + WhatsApp number collected and critical requirement verified.

7. LANDING PAGES & WHERE THE AI WIDGET APPEARS:
   - Homepage (/home): Full business profiler with sector tools and pricing.
   - Marketplace / Pricing (/marketplace): All subscription tiers with feature comparison.
   - Lead Preview Pages (/preview/[lead_id]): Hyper-personalized with scraped business data and auto-voice greeting.
   - All pages feature the floating AI Concierge widget for 24/7 instant engagement.
`;


const DEFAULT_AGENT_CONFIG: CustomerAiAgentConfig = {
  agent_name: 'Bethel Intelligent Customer Specialist',
  avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  sector: 'Solar & B2B Lead Generation Automation',
  tone: 'Human-level intelligence, warm, authoritative, solution-driven, and highly helpful',
  system_prompt: `You are "Bethel" — the warm, witty, and brilliantly knowledgeable AI Business Concierge for Bethelmind Analytics & Strategy.

${WEBAPP_KNOWLEDGE_BASE}

YOUR CONVERSATIONAL PERSONALITY:
- You are NOT a rigid script-following bot. You are a REAL conversation partner — curious, warm, and genuinely interested in what the client has to say.
- Let the client talk freely. Listen first, then respond thoughtfully. Ask follow-up questions if something is unclear.
- Mirror the energy of the visitor: if they're casual and chatty, be friendly and relaxed. If they're technical, go deep. If they seem frustrated, empathize first before solving.
- Use natural Nigerian English when appropriate (e.g. "Oga!", "No wahala!", "Sharp sharp!", "That's a great one o!") to feel local, familiar, and trustworthy — but remain professional.
- Tell stories and give examples. Instead of "Our solar tool calculates loads", say "Imagine you just tell us your appliances and we instantly tell you exactly what inverter to get — sharp sharp!"
- Do NOT give robotic bullet-point lists unless someone specifically asks for a breakdown. Flow naturally.

HOW TO HANDLE FREE-FORM EXPRESSIONS:
- If a client says something unrelated to our services (e.g. talks about their day, complains about NEPA, asks about football), acknowledge it warmly, have a brief human moment, then gently steer back: "I hear you — NEPA is something else! 😅 But that's actually exactly why solar makes total sense right now. Want me to run a quick estimate for your situation?"
- If a client is confused, ranting, or emotional — DON'T rush to a solution. Say: "I understand your frustration, and I want to make sure we get this right for you. Tell me more — what exactly happened / what do you need?"
- If a client asks something you genuinely don't know the specific answer to — be honest: "Let me be real with you — that specific detail I want to confirm with our team so I don't give you wrong information. Can I get your WhatsApp so they can reach you directly?"

HOW YOU RESOLVE THINGS (Priority Order):
1. LISTEN & UNDERSTAND — let the client fully express what they want or feel.
2. ANSWER DIRECTLY — give a clear, warm, useful answer with real numbers/examples.
3. SUGGEST — recommend the right tool, plan, or action based on what they said.
4. COLLECT CONTACT — if you need to follow up, ask for their WhatsApp or name naturally ("What's the best number to reach you?")
5. ESCALATE TO HUMAN — only when the issue is genuinely beyond AI resolution (see below).

SMART HUMAN ESCALATION PROTOCOL:
- First try to resolve the issue yourself. 98% of questions (pricing, sizing, claiming, payments, sector tools) you can handle completely.
- If someone asks for a human, don't just redirect — first acknowledge and offer to help: "Of course! But before I connect you, let me see if I can sort this out for you right now — what's the specific thing you need help with?"
- If after listening you determine it truly needs human involvement (complex site audit, payment dispute, custom enterprise deal >₦500k, on-site survey), then:
  * Collect their Full Name and WhatsApp Phone Number first.
  * Inform them warmly: "Perfect, I've noted your details and flagged this for our Senior Consultant. Expect a WhatsApp message within the hour — they'll have full context of our chat so you won't have to repeat yourself!"
  * Trigger the admin WhatsApp approval notification.
- For critical requests (formal invoice, contract, payment receipt confirmation, enterprise discount), always inform them the request has been prepared and submitted for admin sign-off.`,
  temperature: 0.85,
  ai_model: 'gemini-1.5-flash',
  handover_enabled: true,
  auto_lead_conversion: true,
  admin_whatsapp_phone: '+2348022791227',
  welcome_message: '👋 Welcome to Bethelmind Analytics! I am your 24/7 AI Guide. How can I help you explore our landing pages, sector tools, pricing offers, or claim your website today?',
  custom_faq: [
    {
      question: 'How do I claim my pre-generated website & AI tools?',
      answer: 'If you have a site, embed our 1-line script tag in 60s. If not, we host your full site on custom domain! Transfer ₦92,500 deposit to Moniepoint 7034297995 to activate.',
    },
    {
      question: 'How fast can a 5kVA Solar System be installed?',
      answer: 'Our certified engineers can survey and complete installation within 48 to 72 hours with 5 years warranty!',
    },
    {
      question: 'What scrapers are included in the Lead Harvest Engine?',
      answer: 'We include Jiji Nigeria, Google Places, YellowPages, Instagram, LinkedIn, and Overpass with verified WhatsApp checking!',
    },
  ],
  updated_at: new Date().toISOString(),
};

/** Get Agent Config */
export async function getCustomerAiAgentConfig(): Promise<CustomerAiAgentConfig> {
  try {
    const config = readJsonFileSyncWithRetry<CustomerAiAgentConfig>(getAgentConfigPath(), DEFAULT_AGENT_CONFIG);
    return config || DEFAULT_AGENT_CONFIG;
  } catch {
    return DEFAULT_AGENT_CONFIG;
  }
}

/** Save Agent Config */
export async function saveCustomerAiAgentConfig(newConfig: Partial<CustomerAiAgentConfig>): Promise<CustomerAiAgentConfig> {
  const current = await getCustomerAiAgentConfig();
  const updated: CustomerAiAgentConfig = {
    ...current,
    ...newConfig,
    updated_at: new Date().toISOString(),
  };

  try {
    const filePath = getAgentConfigPath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    writeJsonFileSyncAtomic(filePath, updated);
  } catch (e) {
    console.error('[CustomerAiAgent] Error writing config:', e);
  }

  await logActivity({
    type: 'ai_agent_config_updated',
    description: `Updated Customer AI Agent settings (${updated.agent_name})`,
  });

  return updated;
}

/** Read Sessions */
function readSessions(): Record<string, CustomerAiSession> {
  try {
    return readJsonFileSyncWithRetry<Record<string, CustomerAiSession>>(getAgentSessionsPath(), {});
  } catch {
    return {};
  }
}

/** Write Sessions */
function writeSessions(sessions: Record<string, CustomerAiSession>): void {
  try {
    const filePath = getAgentSessionsPath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    writeJsonFileSyncAtomic(filePath, sessions);
  } catch (e) {
    console.error('[CustomerAiAgent] Error saving sessions:', e);
  }
}

/** Get or Create Session */
export async function getOrCreateCustomerSession(sessionId: string, sector = 'general'): Promise<CustomerAiSession> {
  const sessions = readSessions();
  let session = sessions[sessionId];

  if (!session) {
    const config = await getCustomerAiAgentConfig();
    const now = new Date().toISOString();

    session = {
      session_id: sessionId,
      sector,
      messages: [
        {
          id: `msg_${randomUUID().substring(0, 8)}`,
          sender: 'agent',
          text: config.welcome_message,
          timestamp: now,
        },
      ],
      status: 'active',
      sentiment: 'neutral',
      lead_captured: false,
      created_at: now,
      updated_at: now,
    };

    sessions[sessionId] = session;
    writeSessions(sessions);
  }

  return session;
}

/** Detect Critical Stage from User Inquiry */
function detectCriticalStage(userMsg: string): { isCritical: boolean; stage?: CriticalStage; title?: string } {
  const lower = userMsg.toLowerCase();

  if (lower.includes('invoice') || lower.includes('final quote') || lower.includes('formal proposal') || lower.includes('send price list pdf')) {
    return { isCritical: true, stage: 'quote_finalization', title: 'Custom Quotation & Invoice Sign-Off' };
  }
  if (lower.includes('payment link') || lower.includes('account number') || lower.includes('bank details') || lower.includes('pay now')) {
    return { isCritical: true, stage: 'payment_request', title: 'Direct Payment Gateway Request' };
  }
  if (lower.includes('discount') || lower.includes('cheaper') || lower.includes('reduce price') || lower.includes('override')) {
    return { isCritical: true, stage: 'pricing_override', title: 'Price Override / Special Discount Request' };
  }
  if (lower.includes('enterprise') || lower.includes('contract') || lower.includes('franchise') || lower.includes('partnership')) {
    return { isCritical: true, stage: 'enterprise_deal', title: 'Enterprise Contract Agreement' };
  }
  if (lower.includes('refund') || lower.includes('debited') || lower.includes('dispute') || lower.includes('fccpc') || lower.includes('chargeback') || lower.includes('scam') || lower.includes('fraud')) {
    return { isCritical: true, stage: 'human_escalation', title: 'Priority 1 Payment Dispute & Refund Alert' };
  }
  if (lower.includes('human engineer') || lower.includes('talk to manager') || lower.includes('senior engineer') || lower.includes('speak to human')) {
    return { isCritical: true, stage: 'human_escalation', title: 'Senior Engineer Escalation' };
  }

  return { isCritical: false };
}

/** Process Customer Message */
export async function processCustomerMessage(
  sessionId: string,
  userMessage: string,
  sector = 'general',
  leadData?: any
): Promise<{ reply: string; session: CustomerAiSession; pendingApproval: boolean }> {
  const session = await getOrCreateCustomerSession(sessionId, sector);
  const agentConfig = await getCustomerAiAgentConfig();
  const now = new Date().toISOString();

  // 1. Record User Message
  session.messages.push({
    id: `msg_${randomUUID().substring(0, 8)}`,
    sender: 'user',
    text: userMessage,
    timestamp: now,
  });

  // 2. Parse Contact Info from message or leadData
  if (leadData?.phone && !session.customer_phone) {
    session.customer_phone = leadData.phone;
  }
  if (leadData?.email && !session.customer_email) {
    session.customer_email = leadData.email;
  }
  if (leadData?.name && !session.customer_name) {
    session.customer_name = leadData.name;
  }
  extractCustomerInfo(userMessage, session);

  const hasContact = !!(session.customer_phone || session.customer_email);

  // 3. If contact is NOT yet provided, prompt for WhatsApp number or email for retargeting/followup
  if (!hasContact) {
    const contactPrompt = `👋 I would love to give you the exact details and customized breakdown for your business!\n\nPlease share your **WhatsApp phone number** or **email address** below so our team can send you the official proposal & offer, and I will immediately answer your question right here! 🚀`;

    session.messages.push({
      id: `msg_${randomUUID().substring(0, 8)}`,
      sender: 'agent',
      text: contactPrompt,
      timestamp: new Date().toISOString(),
    });

    session.updated_at = new Date().toISOString();
    const sessions = readSessions();
    sessions[sessionId] = session;
    writeSessions(sessions);

    return { reply: contactPrompt, session, pendingApproval: false };
  }

  // 4. Check Critical Stage Detection (Dispatched to Admin in Background without blocking the customer)
  const criticalCheck = detectCriticalStage(userMessage);
  let pendingApproval = false;

  if (criticalCheck.isCritical && criticalCheck.stage) {
    const approvalReq: ApprovalRequest = {
      id: `appr_${randomUUID().substring(0, 8)}`,
      session_id: sessionId,
      stage: criticalCheck.stage,
      title: criticalCheck.title || 'Critical Deal Approval Required',
      details: userMessage,
      customer_name: session.customer_name || 'Valued Visitor',
      customer_phone: session.customer_phone || 'Unprovided',
      customer_email: session.customer_email || 'Unprovided',
      requested_at: new Date().toISOString(),
      status: 'pending',
    };

    session.pending_approval = approvalReq;
    pendingApproval = true;

    // Trigger WhatsApp Alert to Admin Phone asynchronously in background
    triggerWhatsAppApprovalAlert(approvalReq, agentConfig).catch((err) => {
      console.warn('[CustomerAiAgent] Background WhatsApp alert failed:', err);
    });
  }

  // 5. Check Multi-Channel Autoresponder Triggers
  const autoresResult = await processAutoresponderMessage({
    message: userMessage,
    channel: 'webchat',
    senderContact: session.customer_phone || session.customer_email,
    senderName: session.customer_name,
  });

  let replyText = '';

  if (autoresResult.matched && autoresResult.responseType === 'template') {
    replyText = autoresResult.replyText;
  } else {
    // 6. Query Intelligent Gemini AI — freely answering the question asked now that contact is secured
    replyText = await generateIntelligentAiResponse(userMessage, session, agentConfig, leadData);
  }

  // 7. Push Response to Session History
  session.messages.push({
    id: `msg_${randomUUID().substring(0, 8)}`,
    sender: 'agent',
    text: replyText,
    timestamp: new Date().toISOString(),
  });

  // 8. Auto-convert lead to deal pipeline if phone/email captured for the first time
  if (!session.lead_captured && (session.customer_phone || session.customer_email) && agentConfig.auto_lead_conversion) {
    session.lead_captured = true;
    try {
      const deal = await convertLeadToDeal({
        lead_id: `ai_agent_${session.session_id.substring(0, 8)}`,
        name: session.customer_name || 'Customer AI Qualified Lead',
        category: sector,
        phone_e164: session.customer_phone,
        email: session.customer_email,
      });

      session.lead_id = deal.lead_id;
      session.deal_id = deal.id;

      await logActivity({
        type: 'ai_agent_lead_converted',
        description: `Customer AI Agent qualified & converted lead: ${session.customer_name || 'Visitor'} (${session.customer_phone || session.customer_email})`,
        metadata: { session_id: sessionId, deal_id: deal.id },
      });
    } catch (e) {
      console.error('[CustomerAiAgent] Deal conversion error:', e);
    }
  }

  session.updated_at = new Date().toISOString();
  const sessions = readSessions();
  sessions[sessionId] = session;
  writeSessions(sessions);

  return { reply: replyText, session, pendingApproval };
}

/** Trigger WhatsApp Approval Alert to Admin Phone */
export async function triggerWhatsAppApprovalAlert(
  request: ApprovalRequest,
  config: CustomerAiAgentConfig
): Promise<boolean> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';
  const messageText = `🚨 *CRITICAL STAGE APPROVAL REQUIRED* 🚨\n\n` +
    `*Stage:* ${request.title}\n` +
    `*Customer:* ${request.customer_name} (${request.customer_phone})\n` +
    `*Session ID:* ${request.session_id}\n` +
    `*Inquiry Details:* "${request.details}"\n\n` +
    `👉 Open Admin Approval Center: ${appUrl}/admin/ai-agent`;

  try {
    await sendWhatsAppMessage(
      {
        lead_id: request.id,
        name: 'Admin',
        phone: config.admin_whatsapp_phone,
        phone_e164: config.admin_whatsapp_phone,
      },
      `${appUrl}/admin/ai-agent`,
      appUrl,
      messageText
    );
  } catch (e) {
    console.warn('[CustomerAiAgent] WhatsApp alert dispatch failed, logged to Admin Panel:', e);
  }

  await logActivity({
    type: 'ai_agent_whatsapp_approval_requested',
    description: `Critical Stage WhatsApp alert dispatched to Admin (${config.admin_whatsapp_phone}) for ${request.title}`,
    metadata: { session_id: request.session_id, stage: request.stage },
  });

  return true;
}

/** Process Admin Approval Decision */
export async function processApprovalDecision(params: {
  sessionId: string;
  decision: 'approve' | 'reject';
  adminNotes?: string;
}): Promise<{ success: boolean; session: CustomerAiSession }> {
  const sessions = readSessions();
  const session = sessions[params.sessionId];

  if (!session || !session.pending_approval) {
    throw new Error('No pending approval request found for this session');
  }

  const req = session.pending_approval;
  req.status = params.decision === 'approve' ? 'approved' : 'rejected';
  req.admin_notes = params.adminNotes || '';
  req.resolved_at = new Date().toISOString();

  session.status = 'active';

  const resolutionMsg =
    params.decision === 'approve'
      ? `✅ *APPROVAL CONFIRMED FROM SENIOR ENGINEER via WhatsApp!* Your custom request for "${req.title}" has been signed off. ${params.adminNotes ? `Admin Note: ${params.adminNotes}` : 'We are finalizing your order now!'}`
      : `⚠️ Our Senior Engineer has reviewed your request for "${req.title}". ${params.adminNotes ? `Note: ${params.adminNotes}` : 'Please provide additional load specifications or contact support.'}`;

  session.messages.push({
    id: `msg_${randomUUID().substring(0, 8)}`,
    sender: 'system',
    text: resolutionMsg,
    timestamp: new Date().toISOString(),
  });

  delete session.pending_approval;
  session.updated_at = new Date().toISOString();

  sessions[params.sessionId] = session;
  writeSessions(sessions);

  await logActivity({
    type: 'ai_agent_approval_resolved',
    description: `Admin ${params.decision.toUpperCase()}ED critical stage approval (${req.title}) for session ${params.sessionId}`,
    metadata: { session_id: params.sessionId, decision: params.decision },
  });

  return { success: true, session };
}

/** Extract customer phone, email, and name */
function extractCustomerInfo(text: string, session: CustomerAiSession) {
  const phoneMatch = text.match(/(?:\+?234|0)[789][01]\d{8}/);
  if (phoneMatch && !session.customer_phone) {
    session.customer_phone = phoneMatch[0];
  }

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch && !session.customer_email) {
    session.customer_email = emailMatch[0];
  }

  const nameMatch = text.match(/(?:my name is|i am|call me|this is)\s+([a-zA-Z\s]{2,25})/i);
  if (nameMatch && !session.customer_name) {
    session.customer_name = nameMatch[1].trim();
  }
}

/** Intelligent Gemini AI Response Generator */
async function generateIntelligentAiResponse(
  userMsg: string,
  session: CustomerAiSession,
  config: CustomerAiAgentConfig,
  leadData?: any
): Promise<string> {
  const runtimeConfig = getRuntimeConfig();
  const apiKey = runtimeConfig.antigravityApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const historyContext = session.messages
        .slice(-8)
        .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
        .join('\n');

      const payment = paymentConfig;
      const activePlans = PLANS.map(p => `• ${p.name}: Setup ₦${p.setupFeeNGN.toLocaleString()} + ₦${p.monthlyNGN.toLocaleString()}/mo — ${p.tagline}`).join('\n');
      const activeSectors = Object.values(SECTOR_PROFILES).map((s: any) => `• ${s.name}: ${s.topToolDesc} (Tool: ${s.topToolName})`).join('\n');

      const scrapedLeadPrompt = leadData ? `
SCRAPED LEAD INDIVIDUAL PROFILE & DATA:
- Target Business Name: ${leadData.name || 'Valued Business'}
- Category / Sector: ${leadData.category || 'General Business'}
- Primary Location: ${leadData.address || leadData.area || leadData.city || 'Lagos'}
- Google Business Rating: ${leadData.rating || 4.8}★ (${leadData.reviews_count || 32} reviews)
- Summary: ${leadData.business_summary || 'Verified Enterprise'}

TAILORED SALES ADVICE DIRECTIVE:
Address them warmly using their business name (${leadData.name}). Provide fascinating, bespoke advice explaining how our 24/7 AI Chatbot & 1-Click ${leadData.category} calculator will capture 4x more inbound leads for their business in ${leadData.area || leadData.city || 'Lagos'}!
` : '';

      const liveWebsiteState = `
LIVE WEBSITE & CONFIGURATION STATE (REAL-TIME UPDATED):
- Official Bank Account for Transfers: ${payment.bankName} | Account No: ${payment.accountNumber} | Name: ${payment.accountName}
- Support WhatsApp: +${payment.whatsappNumber}
- Official Website URL: https://www.bethelmindanalytics.com
- Active Pricing Plans & Packages:
${activePlans}
- Supported Industry Sectors & Tools:
${activeSectors}
- Lead Claiming Options:
  1) Existing Website: Add 1-line script tag (<script src="https://www.bethelmindanalytics.com/api/widget/lead-id.js"></script>) in 60s.
  2) No Website: We host full portal on custom domain / subdomain with free SSL.
  3) Transfer ₦92,500 50% deposit or ₦185,000 full fee to ${payment.accountNumber} (${payment.bankName}) and send receipt on WhatsApp.
${scrapedLeadPrompt}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${config.system_prompt}

${liveWebsiteState}

Session Industry Sector: ${session.sector || config.sector}
Customer Name: ${session.customer_name || 'Visitor'}

Recent Conversation History:
${historyContext}

Latest Customer Query: "${userMsg}"`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) return reply.trim();
    } catch (e) {
      console.warn('[CustomerAiAgent] Gemini API call failed, using intelligent rule fallback.');
    }
  }

  // Comprehensive Intelligent Fallback System
  const lower = userMsg.toLowerCase();
  const payment = paymentConfig;

  if (lower.includes('bank') || lower.includes('account') || lower.includes('transfer') || lower.includes('pay') || lower.includes('payment')) {
    return `💳 Here are the official payment details to activate your system today:\n\n• Bank: ${payment.bankName}\n• Account Number: ${payment.accountNumber}\n• Account Name: ${payment.accountName}\n• Setup Fee: ₦185,000 (or ₦92,500 50% deposit to begin immediately)\n\nOnce transferred, send your receipt screenshot to our WhatsApp (+${payment.whatsappNumber}) for instant activation!`;
  }

  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('plan') || lower.includes('package')) {
    return `💰 Here are our transparent setup & subscription packages:\n\n1. Express Starter (₦75k setup + ₦15k/mo): 24/7 AI Chatbot, WhatsApp Catalog, 500 Lagos B2B Contacts.\n2. Business Growth Pro (₦185k setup + ₦35k/mo): 10k Verified B2B Leads/mo + AI WhatsApp Voice Notes + Sector Calculators + Custom Domain. [Most Popular]\n3. VIP Enterprise (₦350k+ setup): Custom CRM Sync + Outbound AI Voice Phone Calls + Dedicated Account Manager.\n\nYou can also start with a 50% deposit (₦92,500). What package fits your goals best?`;
  }

  if (lower.includes('website') || lower.includes('domain') || lower.includes('wordpress') || lower.includes('wix') || lower.includes('shopify')) {
    return `🌐 You have two flexible options:\n\n1. If you already have a website (WordPress, Shopify, Wix, custom): You DO NOT need to rebuild. Simply paste our 1-line script to embed the AI agent & calculators in 60 seconds.\n2. If you need a website: We host and deliver your complete luxury website on your custom .com / .ng domain with SSL within 24 hours!\n\nWhich option matches your business?`;
  }

  if (lower.includes('solar') || lower.includes('inverter') || lower.includes('battery') || lower.includes('kva')) {
    return `☀️ Our Solar Quote Pro engine allows your customers to calculate exact appliance loads (3.5kVA, 5kVA, 10kVA+), battery banks, and solar panel requirements in 2 minutes, generating branded PDF technical quotes and Paystack commitment deposits automatically!`;
  }

  if (lower.includes('real estate') || lower.includes('property') || lower.includes('estate') || lower.includes('duplex') || lower.includes('land')) {
    return `🏡 Our Real Estate Lead Engine allows diaspora and local buyers to calculate off-plan installment payment plans (10%, 20%, 30% deposits), schedule private property inspections in Lekki/Ikoyi/Abuja, and download PDF brochures directly on WhatsApp!`;
  }

  if (lower.includes('auto') || lower.includes('car') || lower.includes('tokunbo') || lower.includes('duty') || lower.includes('customs')) {
    return `🚗 Our Tokunbo Auto & Vehicle Valuation Engine lets buyers calculate Nigeria Customs clearing duties, schedule physical inspection slots, and pay commitment reservation deposits directly online!`;
  }

  if (lower.includes('time') || lower.includes('how long') || lower.includes('timeline') || lower.includes('when')) {
    return `⚡ Your complete 24/7 AI Lead Generation system and custom portal are fully deployed and delivered within 24 hours of confirmation!`;
  }

  if (lower.includes('lead') || lower.includes('scraper') || lower.includes('harvest') || lower.includes('contact')) {
    return `🎯 Our Lagos & Nationwide B2B Lead Harvester extracts verified business names, WhatsApp phone numbers, emails, and decision-maker contact details across 27+ Lagos districts, Abuja, and Port Harcourt with real-time verification!`;
  }

  return `Thank you for reaching out! I've recorded your inquiry. I can help you with pricing packages, custom domain setup, our 24/7 WhatsApp AI Agent, or sector calculators (Solar, Real Estate, Auto, Legal). What would you like to explore next?`;
}

/** Get All Sessions */
export async function getAllCustomerSessions(): Promise<CustomerAiSession[]> {
  const sessions = readSessions();
  return Object.values(sessions).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

/** Get All Pending Approval Requests */
export async function getPendingApprovalRequests(): Promise<ApprovalRequest[]> {
  const sessions = readSessions();
  const pending: ApprovalRequest[] = [];
  for (const s of Object.values(sessions)) {
    if (s.pending_approval && s.pending_approval.status === 'pending') {
      pending.push(s.pending_approval);
    }
  }
  return pending.sort((a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime());
}
