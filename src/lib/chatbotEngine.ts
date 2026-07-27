/**
 * @file chatbotEngine.ts
 * AI Chatbot Engine for Generated Lead Preview Sites
 * 
 * Functions:
 * - Sector-aware conversational agent using Gemini AI
 * - Automated lead capture (name, phone, email, requirement)
 * - Automatically converts qualified conversations into Leads & Deals
 * - Stores conversation state locally / Supabase
 */

import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient';
import { getRuntimeConfig } from './localConfig';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';
import { logActivity } from './activityLogger';
import { convertLeadToDeal } from './pipelineManager';
import { getCategoryType } from './pitchHelper';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  lead_id: string;
  session_id: string;
  sector: string;
  business_name: string;
  visitor_name: string;
  visitor_phone: string;
  visitor_email: string;
  messages: ChatMessage[];
  lead_captured: boolean;
  sentiment: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

// Local Fallback Storage
const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getChatbotsFilePath(): string {
  return isServerless
    ? path.join('/tmp', 'chatbot_conversations.json')
    : path.join(process.cwd(), 'local_db', 'chatbot_conversations.json');
}

function readLocalChatbots(): Record<string, ChatSession> {
  try {
    return readJsonFileSyncWithRetry<Record<string, ChatSession>>(getChatbotsFilePath(), {});
  } catch {
    return {};
  }
}

function writeLocalChatbots(chatbots: Record<string, ChatSession>): void {
  try {
    const filePath = getChatbotsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    writeJsonFileSyncAtomic(filePath, chatbots);
  } catch (e) {
    console.error('[ChatbotEngine] Error writing local chatbots:', e);
  }
}

function isTableMissingError(error: any): boolean {
  if (!error) return false;
  const msg = String(error.message || '').toLowerCase();
  const code = String(error.code || '');
  return code === '42P01' || msg.includes('does not exist') || msg.includes('schema cache') ||
    msg.includes('api key') || msg.includes('unauthorized') || msg.includes('apikey');
}

/** Get or initialize a chatbot session */
export async function getOrCreateChatSession(
  sessionId: string,
  sector = 'general',
  businessName = 'Bethelmind Solutions'
): Promise<ChatSession> {
  const config = getRuntimeConfig();
  let session: ChatSession | null = null;

  if (config.storageMode === 'local') {
    session = readLocalChatbots()[sessionId] || null;
  } else {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await (supabase as any)
        .from('chatbot_conversations')
        .select('*')
        .eq('session_id', sessionId)
        .single();
      if (!error && data) {
        const rawData = data as any;
        session = {
          ...rawData,
          messages: typeof rawData.messages === 'string' ? JSON.parse(rawData.messages) : rawData.messages,
        };
      }
    } catch (e) {
      session = readLocalChatbots()[sessionId] || null;
    }
  }

  if (!session) {
    const now = new Date().toISOString();
    const welcomeMsg = getSectorWelcomeMessage(sector, businessName);

    session = {
      id: randomUUID(),
      lead_id: '',
      session_id: sessionId,
      sector,
      business_name: businessName,
      visitor_name: '',
      visitor_phone: '',
      visitor_email: '',
      messages: [{ sender: 'bot', text: welcomeMsg, timestamp: now }],
      lead_captured: false,
      sentiment: 'neutral',
      summary: '',
      created_at: now,
      updated_at: now,
    };

    await saveChatSession(session);
  }

  return session;
}

/** Save/Update chat session */
export async function saveChatSession(session: ChatSession): Promise<void> {
  session.updated_at = new Date().toISOString();
  const config = getRuntimeConfig();

  if (config.storageMode === 'local') {
    const chatbots = readLocalChatbots();
    chatbots[session.session_id] = session;
    writeLocalChatbots(chatbots);
    return;
  }

  try {
    const supabase = getSupabaseClient();
    const payload = {
      ...session,
      messages: JSON.stringify(session.messages),
    };
    const { error } = await (supabase as any).from('chatbot_conversations').upsert([payload]);
    if (error && isTableMissingError(error)) {
      const chatbots = readLocalChatbots();
      chatbots[session.session_id] = session;
      writeLocalChatbots(chatbots);
    }
  } catch (err) {
    const chatbots = readLocalChatbots();
    chatbots[session.session_id] = session;
    writeLocalChatbots(chatbots);
  }
}

/** Process incoming user message and generate AI response */
export async function processChatMessage(
  sessionId: string,
  userMessage: string,
  sector = 'general',
  businessName = 'Bethelmind Solutions'
): Promise<{ reply: string; session: ChatSession }> {
  const session = await getOrCreateChatSession(sessionId, sector, businessName);
  const now = new Date().toISOString();

  // Add user message
  session.messages.push({ sender: 'user', text: userMessage, timestamp: now });

  // Extract contact details if provided
  extractContactInfo(userMessage, session);

  // Generate bot reply via AI / rule-based fallback
  const reply = await generateAiBotResponse(session, userMessage);
  session.messages.push({ sender: 'bot', text: reply, timestamp: new Date().toISOString() });

  // Check if we captured lead info for the first time
  if (!session.lead_captured && (session.visitor_phone || session.visitor_email)) {
    session.lead_captured = true;
    
    // Automatically create a Deal & log activity!
    try {
      const deal = await convertLeadToDeal({
        lead_id: `chat_${session.id.substring(0, 8)}`,
        name: session.visitor_name || 'Website Inquiry',
        category: sector,
        phone_e164: session.visitor_phone,
        email: session.visitor_email,
      });

      session.lead_id = deal.lead_id;

      await logActivity({
        type: 'chatbot_lead_captured',
        lead_id: deal.lead_id,
        deal_id: deal.id,
        description: `Chatbot captured lead: ${session.visitor_name || 'Visitor'} (${session.visitor_phone || session.visitor_email})`,
        metadata: { sector, session_id: sessionId },
      });
    } catch (e) {
      console.error('[ChatbotEngine] Lead conversion error:', e);
    }
  }

  await saveChatSession(session);
  return { reply, session };
}

// ============================================================================
// Helper Functions
// ============================================================================

function getSectorWelcomeMessage(sector: string, businessName: string): string {
  switch (sector) {
    case 'solar':
      return `Hello! Welcome to ${businessName} Solar Support ☀️. Looking to cut your electricity and generator costs? Ask me anything or request a free survey quote!`;
    case 'real_estate':
      return `Welcome to ${businessName} Real Estate 🏡. Are you looking to buy, rent, or inspect off-plan property today?`;
    case 'school':
      return `Welcome to ${businessName} Admissions 🎓! How can we assist with enrollment, fee structures, or campus tours today?`;
    case 'medical':
      return `Hello, welcome to ${businessName} Healthcare 🩺. Would you like to book a consultation or ask about our specialist services?`;
    case 'auto':
      return `Welcome to ${businessName} Motors 🚗! Looking for vehicle pricing, trade-in valuations, or test drive bookings?`;
    case 'restaurant':
      return `Welcome to ${businessName} 🍽️! Would you like to reserve a table, view our menu, or inquire about catering?`;
    case 'legal':
      return `Welcome to ${businessName} Legal Practice ⚖️. How may we assist you with legal consultation or document filing today?`;
    case 'retail':
      return `Hi there! Welcome to ${businessName} Storefront 🛍️. Need help finding a product or tracking an order?`;
    default:
      return `Hello! Welcome to ${businessName} 👋. How can we help you today? Leave your phone or email and our team will get back to you!`;
  }
}

function extractContactInfo(text: string, session: ChatSession) {
  // Extract phone (+234... or 080... etc)
  const phoneMatch = text.match(/(?:\+?234|0)[789][01]\d{8}/);
  if (phoneMatch && !session.visitor_phone) {
    session.visitor_phone = phoneMatch[0];
  }

  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch && !session.visitor_email) {
    session.visitor_email = emailMatch[0];
  }

  // Extract name if introduced
  const nameMatch = text.match(/(?:my name is|i am|call me)\s+([a-zA-Z\s]{2,20})/i);
  if (nameMatch && !session.visitor_name) {
    session.visitor_name = nameMatch[1].trim();
  }
}

async function generateAiBotResponse(session: ChatSession, userMessage: string): Promise<string> {
  const config = getRuntimeConfig();
  const apiKey = config.antigravityApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{
                text: `You are an AI sales assistant representing "${session.business_name}" in the "${session.sector}" industry sector in Nigeria.
Be polite, helpful, short (max 2-3 sentences), professional, and encourage the visitor to provide their Phone Number or Email so a representative can send a detailed quote/proposal.

Visitor message: "${userMessage}"`
              }]
            }
          ]
        })
      });

      const data = await response.json();
      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (replyText) return replyText.trim();
    } catch (e) {
      console.warn('[ChatbotEngine] Gemini API call failed, using rule-based fallback.');
    }
  }

  // Smart Rule-Based Fallback
  const lower = userMessage.toLowerCase();

  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    return `Our pricing depends on your exact scope. If you leave your Phone Number or Email, we can send you a detailed instant quotation!`;
  }
  if (lower.includes('location') || lower.includes('where') || lower.includes('office')) {
    return `We serve clients across Lagos and major state capitals in Nigeria! What location are you based in?`;
  }
  if (session.visitor_phone || session.visitor_email) {
    return `Thank you! We have received your contact info (${session.visitor_phone || session.visitor_email}). Our team will reach out to you shortly!`;
  }

  return `Thanks for reaching out! To give you the best offer, could you share your mobile phone number or WhatsApp?`;
}
