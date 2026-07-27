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
You possess complete human-level understanding of all platform features:

1. B2B LEAD HARVESTING ENGINE:
   - Scrapers available: Jiji Nigeria Scraper, Google Places Scraper, YellowPages Directory, Instagram Business Profiles, Overpass OSM, and LinkedIn Directory.
   - Filters: Location (Lagos, Abuja, Port Harcourt, Ibadan, Kano, etc.), Category/Industry, Verified Phone/WhatsApp Check.
   - Lead Enrichment: Automatic email verification, social media handle lookup, domain audit, and lead scoring (0 - 100).

2. SPECIALIZED SOLAR ROI & SYSTEM PROPOSAL BUILDER:
   - System Sizes & Loads:
     * 3.5kVA Basic (Powers TV, Fans, Lights, Laptop, Fridge) -> 2x 220Ah Tubular/Lithium Batteries, 4x 450W Mono Solar Panels.
     * 5kVA Standard (Powers Air Conditioner, Freezer, Water Pump, TV, Office Loads) -> 4x 220Ah / 5kWh Lithium, 8x 500W Panels.
     * 10kVA - 20kVA Heavy Commercial -> High capacity 15kWh-30kWh Lithium Server Rack Batteries, 16x-32x Panels.
   - Generator Cost Savings: Calculates exact monthly fuel savings vs grid & diesel generators in Nigeria (saves 60%-85% power expenses).
   - Free Site Survey Booking: Customers can request a 48-hour certified engineer site audit.

3. MULTI-CHANNEL AUTOMATED OUTREACH:
   - WhatsApp Baileys Automation: Direct WhatsApp message dispatch, spintax message variations, interactive button templates.
   - Email SMTP & Nodemailer: Instant PDF proposals, drip campaigns, HTML templates.
   - SMS API (Twilio / Local SMS Gateways): Immediate appointment reminders & order alerts.

4. PAYMENT GATEWAYS & INVOICING:
   - Payment options: Moniepoint Microfinance Bank, OPay Merchant, Paystack Online Card/Transfer.
   - Split Payment / Milestones: Initial 60% Deposit upon site survey approval, 40% on installation completion.

5. DOMAIN & CUSTOM HOSTING:
   - Subdomains & Custom Domains (Vercel DNS, Caddy Reverse Proxy, SSL HTTPS Certificates).
`;

const DEFAULT_AGENT_CONFIG: CustomerAiAgentConfig = {
  agent_name: 'Bethel Intelligent Customer Specialist',
  avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  sector: 'Solar & B2B Lead Generation Automation',
  tone: 'Human-level intelligence, warm, authoritative, solution-driven, and highly helpful',
  system_prompt: `You are Bethel Intelligent Customer Specialist, an AI agent with complete understanding of all webapp capabilities.
${WEBAPP_KNOWLEDGE_BASE}

YOUR CORE BEHAVIOR RULES:
1. Act like an expert human sales & engineering consultant. Answer questions with total clarity, confidence, and precision.
2. For general questions, give clear, short, helpful answers (2-3 sentences max).
3. For custom Solar audit requests or large lead generation packages, ask for their WhatsApp Phone Number, Email, and Location.
4. IMPORTANT - CRITICAL STAGE HUMAN APPROVAL PROTOCOL:
   Whenever a customer requests:
   - A final custom solar quotation / formal invoice
   - An enterprise custom contract or discount override
   - A direct payment link / bank transfer account details
   - Explicit human engineer sign-off
   You MUST inform them warmly that you have prepared the customized proposal and submitted it for instant Admin Approval via WhatsApp. You will notify them the moment the Senior Engineer signs off!`,
  temperature: 0.7,
  ai_model: 'gemini-1.5-flash',
  handover_enabled: true,
  auto_lead_conversion: true,
  admin_whatsapp_phone: '+2348000000000',
  welcome_message: '👋 Welcome to Bethelmind Solutions! I am your 24/7 AI Customer Specialist. How can I help you scale your energy or lead generation today?',
  custom_faq: [
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
  if (lower.includes('human engineer') || lower.includes('talk to manager') || lower.includes('senior engineer')) {
    return { isCritical: true, stage: 'human_escalation', title: 'Senior Engineer Escalation' };
  }

  return { isCritical: false };
}

/** Process Customer Message */
export async function processCustomerMessage(
  sessionId: string,
  userMessage: string,
  sector = 'general'
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

  // 2. Parse Contact Info
  extractCustomerInfo(userMessage, session);

  // 3. Check Critical Stage Detection
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
    session.status = 'pending_approval';
    pendingApproval = true;

    // Trigger WhatsApp Alert to Admin Phone
    await triggerWhatsAppApprovalAlert(approvalReq, agentConfig);

    const replyText = `📋 I have calculated your custom requirements for "${criticalCheck.title}". Because this is a critical deal stage, I have dispatched a real-time sign-off request to our Senior Engineer's WhatsApp (${agentConfig.admin_whatsapp_phone}). You will receive immediate notification here as soon as approved!`;

    session.messages.push({
      id: `msg_${randomUUID().substring(0, 8)}`,
      sender: 'agent',
      text: replyText,
      timestamp: new Date().toISOString(),
      requires_approval: true,
    });

    session.updated_at = new Date().toISOString();
    const sessions = readSessions();
    sessions[sessionId] = session;
    writeSessions(sessions);

    return { reply: replyText, session, pendingApproval: true };
  }

  // 4. Check Multi-Channel Autoresponder Triggers
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
    // 5. Query Intelligent Gemini AI
    replyText = await generateIntelligentAiResponse(userMessage, session, agentConfig);
  }

  // 6. Push Response
  session.messages.push({
    id: `msg_${randomUUID().substring(0, 8)}`,
    sender: 'agent',
    text: replyText,
    timestamp: new Date().toISOString(),
  });

  // 7. Auto-convert lead to deal pipeline if phone/email captured for the first time
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

  return { reply: replyText, session, pendingApproval: false };
}

/** Trigger WhatsApp Approval Alert to Admin Phone */
export async function triggerWhatsAppApprovalAlert(
  request: ApprovalRequest,
  config: CustomerAiAgentConfig
): Promise<boolean> {
  const messageText = `🚨 *CRITICAL STAGE APPROVAL REQUIRED* 🚨\n\n` +
    `*Stage:* ${request.title}\n` +
    `*Customer:* ${request.customer_name} (${request.customer_phone})\n` +
    `*Session ID:* ${request.session_id}\n` +
    `*Inquiry Details:* "${request.details}"\n\n` +
    `👉 Open Admin Approval Center: https://lead-generation-automation-ecru.vercel.app/admin/ai-agent`;

  try {
    await sendWhatsAppMessage(
      {
        lead_id: request.id,
        name: 'Admin',
        phone: config.admin_whatsapp_phone,
        phone_e164: config.admin_whatsapp_phone,
      },
      'https://lead-generation-automation-ecru.vercel.app/admin/ai-agent',
      'https://lead-generation-automation-ecru.vercel.app',
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
  config: CustomerAiAgentConfig
): Promise<string> {
  const runtimeConfig = getRuntimeConfig();
  const apiKey = runtimeConfig.antigravityApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const historyContext = session.messages
        .slice(-8)
        .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
        .join('\n');

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

  // Intelligent Fallback
  const lower = userMsg.toLowerCase();
  if (lower.includes('solar') || lower.includes('inverter') || lower.includes('battery')) {
    return `We offer 3.5kVA, 5kVA, and 10kVA-20kVA commercial solar systems with lithium storage & 5-year warranty! Would you like a free site survey in your location?`;
  }
  if (lower.includes('scraper') || lower.includes('lead') || lower.includes('harvest')) {
    return `Our B2B Lead Harvester extracts verified WhatsApp contacts from Jiji, Google Places, Instagram, and LinkedIn with real-time verification!`;
  }

  return `Thank you for your message! Share your WhatsApp phone number or email address and our team will send a full breakdown directly.`;
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
