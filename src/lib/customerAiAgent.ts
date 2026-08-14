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

2. AI CONCIERGE & NIGERIAN ACCENT VOICE NOTE AI SUITE:
   - Full 24/7 WhatsApp Voice Note Sales Specialist: Our AI is NOT merely a voice calculator — it is a complete, human-like Nigerian Accent Voice Sales Closer that:
     * Greets prospects in authentic, warm Nigerian English on WhatsApp.
     * Explains custom offers, product features, and sector solutions in audio voice notes.
     * Speaks real-time price quotes, BOQ cost estimates, and ROI calculations to buyers.
     * Coordinates private property inspections, solar site audits, and clinic bookings via voice notes.
     * Gives step-by-step voice guidance for bank transfers and instantly verifies payment receipts.
     * Executes automated outbound voice note outreach campaigns to thousands of verified Nigerian business owners.
   - Audio Voice Synthesizer on Web: Every chat message on the web portal can also be spoken aloud using browser voice synthesis with "🔊 Listen Voice".
   - Exit-Intent Auto-Engagement: When a visitor moves their cursor to close the page, the AI Concierge widget pops open with an urgent, personalized offer.
   - Hyper-Personalized Scraped Lead Greetings: Greets scraped leads by business name, mentions their Google rating and location, and invites them to claim their custom portal.

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
   - WhatsApp Baileys Automation: Direct WhatsApp message dispatch, voice note dispatch, spintax message variations, interactive button templates.
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

STRICT CONVERSATIONAL CONTINUITY & TOPIC FOLLOWING RULE (CRITICAL):
- ALWAYS follow the user's discussion through to full completion!
- If you asked the user a question or invited them to test a feature (e.g. "What appliances are you running?", "What district in Lagos?", "What is your target budget?"), and the user responds with their answer, you MUST immediately acknowledge their exact input, complete the calculation or test right away, and stay on that topic until the user decides to change it!
- NEVER abruptly jump to an unrelated topic, ignore the previous question, or repeat a generic greeting when the user is answering a specific prompt!

OUR FULL VOICE NOTE AI SUITE (NOT JUST A CALCULATOR):
- When asked about voice notes, explain that our Nigerian Accent WhatsApp Voice Note AI is a COMPLETE 24/7 Voice Sales & Support Specialist. It sends natural Nigerian voice notes to pitch products, answer customer questions, schedule inspections, explain quote breakdowns, guide bank transfers, and run outbound voice campaigns.

YOUR CONVERSATIONAL PERSONALITY:
- You are a REAL conversation partner — curious, warm, and genuinely interested in what the client has to say.
- Listen first, then respond thoughtfully. Follow the user's thread carefully.
- Mirror the energy of the visitor: if they're casual and chatty, be friendly and relaxed. If they're technical, go deep.
- Use natural Nigerian English when appropriate (e.g. "Oga!", "No wahala!", "Sharp sharp!", "That's a great one o!") to feel local, familiar, and trustworthy — but remain professional.

HOW YOU RESOLVE THINGS:
1. LISTEN & UNDERSTAND — stay strictly on the user's conversational topic.
2. ANSWER DIRECTLY — give clear, warm, useful answers with real numbers/examples.
3. FOLLOW THROUGH — if a calculation or test was started, finish it with exact figures.
4. SMART RETARGETING & CONTACT — once contact is provided, provide all answers without restriction.`,
  temperature: 0.7,
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

  // Find previous user inquiry if the current message is just phone/email
  const userMessages = session.messages.filter(m => m.sender === 'user');
  let activeInquiry = userMessage;
  const isJustContact = /^(\+?234|0)[789][01]\d{8}$/.test(userMessage.replace(/[\s-]/g, '')) || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userMessage.trim());

  if (isJustContact && userMessages.length >= 2) {
    const prevMsg = userMessages[userMessages.length - 2];
    if (prevMsg && prevMsg.text) {
      activeInquiry = prevMsg.text;
    }
  }

  // 4. Check Critical Stage Detection (Dispatched to Admin in Background without blocking the customer)
  const criticalCheck = detectCriticalStage(activeInquiry);
  let pendingApproval = false;

  if (criticalCheck.isCritical && criticalCheck.stage) {
    const approvalReq: ApprovalRequest = {
      id: `appr_${randomUUID().substring(0, 8)}`,
      session_id: sessionId,
      stage: criticalCheck.stage,
      title: criticalCheck.title || 'Critical Deal Approval Required',
      details: activeInquiry,
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

  // 5. Query Intelligent Gemini AI — freely answering the active question now that contact is secured
  const promptQuery = isJustContact
    ? `Customer provided contact info (${userMessage}) to unlock response for: "${activeInquiry}". Warmly acknowledge their contact, then immediately answer "${activeInquiry}" with complete, detailed numbers, tools, and options!`
    : activeInquiry;

  let replyText = await generateIntelligentAiResponse(promptQuery, session, agentConfig, leadData);

  // If user just provided contact info, ensure warm acknowledgement is prepended if not already present
  if (isJustContact && !replyText.toLowerCase().includes('thank') && !replyText.toLowerCase().includes('got it') && !replyText.toLowerCase().includes('saved')) {
    replyText = `✅ *Thank you! I've saved your WhatsApp contact (${session.customer_phone || session.customer_email}).*\n\n${replyText}`;
  }

  // 6. Push Response to Session History
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

  if (lower.includes('voice') || lower.includes('audio') || lower.includes('speak') || lower.includes('accent')) {
    return `🎙️ Our **Nigerian Accent WhatsApp Voice Note AI** is a complete 24/7 Voice Sales Specialist — NOT just a calculator!\n\nIt performs full end-to-end voice sales operations:\n• **Warm Nigerian Voice Greetings & Pitches**: Greets prospects in authentic, warm Nigerian English.\n• **Voice Product & Package Explanations**: Walks leads through your services and pricing.\n• **Voice Cost & Quote Breakdowns**: Speaks itemized quotes and ROI calculations aloud.\n• **Voice Appointment & Inspection Booking**: Schedules property viewings, solar site visits, or clinic consultations.\n• **Voice Payment Guidance**: Explains bank transfer details and verifies payment receipts.\n• **Outbound Voice Outreach**: Dispatches personalized voice notes to 10,000+ verified Nigerian B2B business owners!`;
  }

  // Handle follow-up calculation inputs (appliances, sizes, locations)
  if (lower.includes('fridge') || lower.includes('freezer') || lower.includes('ac') || lower.includes('tv') || lower.includes('fan') || lower.includes('pumping machine')) {
    return `☀️ Excellent! Based on your appliance load (Refrigeration + AC/Fans/Lighting), you require a **5kVA Solar Hybrid System** with a 48V 100Ah/200Ah Lithium Battery bank and 6–8 High-Efficiency Mono Solar Panels. This eliminates generator fueling costs and provides 24/7 uninterrupted power! Would you like a branded PDF quote sent to your WhatsApp?`;
  }

  if (lower.includes('lekki') || lower.includes('ikoyi') || lower.includes('ikeja') || lower.includes('abuja') || lower.includes('banana island')) {
    return `📍 Perfect! For properties in ${userMsg}, our Real Estate Lead Engine provides 6–12 month flexible installment payment schedules, automated inspection slot bookings, and instant brochure downloads for local and diaspora buyers. Would you like to see a live simulation?`;
  }

  if (lower.includes('calculator') || lower.includes('sector') || lower.includes('tool') || lower.includes('test')) {
    return `🧮 Here are our **8 Live Sector Engines & Calculators** ready to test:\n\n1. ☀️ **Solar BOQ Load & Inverter Estimator**: Calculates appliance wattages (3.5kVA, 5kVA, 10kVA+), battery sizes, and generator fuel savings.\n2. 🏡 **Real Estate Payment Schedule Engine**: Off-plan 6–12 month installments, mortgage calculations, and VIP site tour bookings.\n3. 🚗 **Tokunbo Customs Duty & Valuation**: Computes Nigeria Customs import tariffs, clearing fees, and vehicle inspection slots.\n4. ⚖️ **CAC & Corporate Legal Registration**: Business name reservation fee lookup and CAC filing guides.\n5. 🏥 **Clinic & HMO Appointment Scheduler**: HMO insurance coverage lookup and doctor booking.\n6. 📦 **Logistics & Delivery Calculator**: Mainland vs Island delivery tariff estimator.\n7. 🎓 **School & Academy Tuition Reference**: Termly fee breakdown and student admission registration.\n8. 💼 **General B2B Instant Quote Generator**: 1-click tailored proposals for Nigerian enterprises.\n\nWhich of these would you like to run a live test on right now?`;
  }

  return `Thank you for your response! I'm following your thread closely. I can help you with pricing packages, custom domain setup, our 24/7 WhatsApp AI Agent with Nigerian Voice Notes, or sector calculators (Solar, Real Estate, Auto, Legal). What would you like to explore next?`;
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
