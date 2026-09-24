/**
 * @file autoresponderEngine.ts
 * Multi-Channel Autoresponder Engine
 * Supports WhatsApp, SMS, Email, and Web Chat auto-replies with integrated Anti-Ban STOP suppression.
 */

import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient';
import { getRuntimeConfig } from './localConfig';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';
import { logActivity } from './activityLogger';
import { isOptOutKeyword, recordOptOut } from './whatsappRotator';

export type AutoresponderChannel = 'all' | 'whatsapp' | 'sms' | 'email' | 'webchat';
export type TriggerType = 'keyword' | 'contains' | 'default_welcome' | 'outside_hours';
export type ResponseType = 'template' | 'ai_generated' | 'drip';

export interface AutoresponderRule {
  id: string;
  name: string;
  channel: AutoresponderChannel;
  trigger_type: TriggerType;
  keywords: string[];
  response_type: ResponseType;
  response_text: string;
  priority: number;
  enabled: boolean;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getAutorespondersFilePath(): string {
  return isServerless
    ? path.join('/tmp', 'autoresponder_rules.json')
    : path.join(process.cwd(), 'local_db', 'autoresponder_rules.json');
}

/** Default starter autoresponder rules with Anti-Ban STOP suppression */
const DEFAULT_RULES: AutoresponderRule[] = [
  {
    id: 'rule_optout_000',
    name: 'Automatic STOP / Unsubscribe Handler',
    channel: 'all',
    trigger_type: 'keyword',
    keywords: ['stop', 'unsubscribe', 'remove me', 'remove', 'opt out', 'opt-out', 'dont message me', "don't message me", 'block', 'cancel'],
    response_type: 'template',
    response_text: 'You have been successfully unsubscribed. You will not receive any further automated outreach messages from Bethelmind Analytics Lagos Desk. Wishing your business continued success!',
    priority: 100, // Highest priority to intercept opt-outs immediately
    enabled: true,
    reply_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rule_deal_close_payment_001',
    name: 'Direct Deal Closer & OPay Settlement Invoice',
    channel: 'all',
    trigger_type: 'contains',
    keywords: ['account', 'bank', 'pay', 'invoice', 'transfer', 'deposit', 'payment', 'send details', 'details', 'ready to start', 'ready', 'buy', 'interested', 'proceed', 'how to start', 'how do we start', 'deal', 'opay', 'moniepoint', 'give me account', 'send account', 'start now', 'set it up', 'close deal'],
    response_type: 'template',
    response_text: "🤝 Wonderful decision! Let's get your business automated and closing deals 24/7.\n\n📋 *OFFICIAL PACKAGES & SETUP AGREEMENT:*\n1️⃣ *Complete Turnkey Website + 24/7 AI WhatsApp Sales Assistant*\n• Total: ₦150,000 NGN | *Commitment Deposit to Start: ₦75,000 NGN*\n• Balance strictly payable AFTER your deployment is completed, live on Google, and 100% approved by you.\n• Delivery SLA: Live & ready in exactly 48 Hours.\n\n2️⃣ *1-Line WhatsApp Quoting Assistant (Existing Websites)*\n• Total: ₦65,000 NGN | *Deposit: ₦35,000 NGN*\n\n🏦 *OFFICIAL DIRECT OPAY SETTLEMENT ACCOUNT:*\n• Bank: *OPay Digital Services*\n• Account Number: *7034297995*\n• Account Name: *Oyelakin Tosin Matthew*\n• Narration: *Website Setup Deposit*\n\n⚡ *NEXT STEP TO COMMENCE:*\n1. Transfer your commitment deposit (₦75,000 for Turnkey or ₦35,000 for 1-Line Embed).\n2. Send your transfer receipt or payment screenshot right here on WhatsApp.\n3. Our Lagos technical desk will immediately register your domain/staging and begin setup!",
    priority: 90,
    enabled: true,
    reply_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rule_pricing_002',
    name: 'Package Pricing & Instant Deal Closer',
    channel: 'all',
    trigger_type: 'contains',
    keywords: ['price', 'cost', 'pricing', 'how much', 'quote', 'package', 'tariff', 'fee', 'rate', 'charges', 'plans'],
    response_type: 'template',
    response_text: "Good day! 👋 Here is our complete growth package ladder and official settlement details:\n\n💎 *1. CORE DFY: Complete Turnkey Business Website + WhatsApp AI Sales Assistant*\n• Total: ₦150,000 NGN | *Commitment Deposit to Start: ₦75,000 NGN*\n• Balance strictly payable AFTER your site is live and 100% approved by you. Ready in 48 hours!\n• Includes custom domain (.com/.com.ng), Google Maps SEO, photo showcase, and 24/7 automated WhatsApp quoting.\n\n⚡ *2. UPGRADE: 1-Line WhatsApp Quoting Assistant (For Existing Websites)*\n• Setup: *₦35,000 NGN* (Full integration: ₦65,000 NGN)\n• Installs in 10 minutes without touching your hosting or SEO rankings.\n\n👑 *3. ENTERPRISE: Luxury Web Portal + Branded Android Mobile App (.apk)*\n• Total: ₦250,000 NGN | *Commitment Deposit: ₦125,000 NGN*\n\n🏦 *OFFICIAL DIRECT OPAY SETTLEMENT ACCOUNT:*\n• Bank: *OPay Digital Services*\n• Account Number: *7034297995*\n• Account Name: *Oyelakin Tosin Matthew*\n• Narration: *Website Setup Deposit*\n\n⚡ *TO LOCK IN YOUR SETUP TODAY:*\nTransfer your commitment deposit (₦75k for Turnkey or ₦35k for 1-Line Embed) to the OPay account above, send your receipt here, and we begin immediately!",
    priority: 80,
    enabled: true,
    reply_count: 98,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rule_welcome_001',
    name: 'Instant Welcome Auto-reply with Deal Closer',
    channel: 'all',
    trigger_type: 'default_welcome',
    keywords: ['hello', 'hi', 'start', 'help', 'hey', 'good day', 'good morning', 'good afternoon'],
    response_type: 'template',
    response_text: "Hello! 👋 Welcome to Bethelmind Analytics Lagos Desk.\n\nWe build 24/7 AI WhatsApp Sales Assistants and Turnkey Business Websites delivered in exactly 48 Hours to capture customers and close deals on autopilot.\n\n🛠️ *OUR PACKAGES & 48-HOUR SLA:*\n• Turnkey Website + WhatsApp AI Assistant: ₦75,000 deposit to start (₦150,000 total).\n• 1-Line Embed Upgrade: ₦35,000 deposit.\n• Balance strictly payable after deployment and your 100% approval.\n\n🏦 *Official OPay Settlement Account:*\n• Bank: *OPay Digital Services*\n• Account Number: *7034297995*\n• Account Name: *Oyelakin Tosin Matthew*\n\nReply with your business name or transfer your deposit and share your receipt here to secure your 48-hour delivery slot!",
    priority: 10,
    enabled: true,
    reply_count: 142,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rule_lagos10k_handshake',
    name: 'Lagos 10K Warm Greeting Handshake Handler',
    channel: 'whatsapp',
    trigger_type: 'keyword',
    keywords: ['yes', 'speaking', 'who is this', 'who is speaking', 'how can i help', 'who are you', 'how may i help', 'im listening', "i'm listening", 'tell me', 'go ahead'],
    response_type: 'template',
    response_text: 'Thank you for confirming! 👋 We operate Bethelmind Analytics in Lagos. We have designed an interactive 24/7 AI Customer Quoting & Booking portal demo specifically for your business to capture after-hours customers on autopilot.\n\n👉 Test your live 2-min interactive preview here:\nhttps://www.bethelmindanalytics.com/preview/demo\n\n🛠️ *Ready to launch in 48 Hours?*\n• Turnkey Website + WhatsApp AI: ₦75,000 commitment deposit (₦150,000 total).\n• Bank: OPay Digital Services | Account: 7034297995 | Name: Oyelakin Tosin Matthew',
    priority: 50,
    enabled: true,
    reply_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rule_afterhours_003',
    name: 'After-Hours Auto-acknowledgement',
    channel: 'whatsapp',
    trigger_type: 'outside_hours',
    keywords: ['night', 'after hours', 'closed'],
    response_type: 'template',
    response_text: '🌙 Thanks for your message! Our 24/7 AI Sales Assistant is active. If you are ready to launch your business website or WhatsApp bot:\n• Turnkey Website + WhatsApp AI: ₦75,000 deposit (₦150k total).\n• OPay: 7034297995 (OPay Digital Services - Oyelakin Tosin Matthew).\nLeave your business name or send your deposit receipt and we will finalize your domain first thing in the morning!',
    priority: 5,
    enabled: true,
    reply_count: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rule_ai_fallback_004',
    name: 'Smart Customer AI Assistant Route',
    channel: 'all',
    trigger_type: 'contains',
    keywords: ['agent', 'ai', 'support', 'question', 'info', 'details'],
    response_type: 'ai_generated',
    response_text: 'Routing inquiry to 24/7 Customer AI Agent...',
    priority: 3,
    enabled: true,
    reply_count: 210,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/** Read rules locally */
function readLocalRules(): AutoresponderRule[] {
  try {
    const rules = readJsonFileSyncWithRetry<AutoresponderRule[]>(getAutorespondersFilePath(), []);
    if (!rules || rules.length === 0) {
      writeLocalRules(DEFAULT_RULES);
      return DEFAULT_RULES;
    }
    return rules;
  } catch {
    return DEFAULT_RULES;
  }
}

/** Write rules locally */
function writeLocalRules(rules: AutoresponderRule[]): void {
  try {
    const filePath = getAutorespondersFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    writeJsonFileSyncAtomic(filePath, rules);
  } catch (e) {
    console.error('[AutoresponderEngine] Error writing rules file:', e);
  }
}

/** Get all autoresponder rules (from Supabase or Local DB) */
export async function getAutoresponderRules(): Promise<AutoresponderRule[]> {
  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    return readLocalRules();
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any)
      .from('autoresponder_rules')
      .select('*')
      .order('priority', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        ...item,
        keywords: typeof item.keywords === 'string' ? JSON.parse(item.keywords) : item.keywords || [],
      }));
    }
  } catch (e) {
    console.warn('[AutoresponderEngine] Supabase fetch failed, falling back to local store.');
  }

  return readLocalRules();
}

/** Save or update an autoresponder rule */
export async function saveAutoresponderRule(rule: Partial<AutoresponderRule> & { name: string }): Promise<AutoresponderRule> {
  const existingRules = await getAutoresponderRules();
  const now = new Date().toISOString();

  let ruleToSave: AutoresponderRule;

  if (rule.id) {
    const idx = existingRules.findIndex((r) => r.id === rule.id);
    if (idx !== -1) {
      ruleToSave = {
        ...existingRules[idx],
        ...rule,
        keywords: rule.keywords || existingRules[idx].keywords,
        updated_at: now,
      };
      existingRules[idx] = ruleToSave;
    } else {
      ruleToSave = {
        id: rule.id,
        name: rule.name,
        channel: rule.channel || 'all',
        trigger_type: rule.trigger_type || 'contains',
        keywords: rule.keywords || [],
        response_type: rule.response_type || 'template',
        response_text: rule.response_text || 'Thank you for reaching out!',
        priority: rule.priority || 1,
        enabled: rule.enabled !== undefined ? rule.enabled : true,
        reply_count: rule.reply_count || 0,
        created_at: now,
        updated_at: now,
      };
      existingRules.push(ruleToSave);
    }
  } else {
    ruleToSave = {
      id: `rule_${randomUUID().substring(0, 8)}`,
      name: rule.name,
      channel: rule.channel || 'all',
      trigger_type: rule.trigger_type || 'contains',
      keywords: rule.keywords || [],
      response_type: rule.response_type || 'template',
      response_text: rule.response_text || 'Thank you for reaching out!',
      priority: rule.priority || 1,
      enabled: rule.enabled !== undefined ? rule.enabled : true,
      reply_count: 0,
      created_at: now,
      updated_at: now,
    };
    existingRules.push(ruleToSave);
  }

  writeLocalRules(existingRules);

  const config = getRuntimeConfig();
  if (config.storageMode !== 'local') {
    try {
      const supabase = getSupabaseClient();
      await (supabase as any).from('autoresponder_rules').upsert([{
        ...ruleToSave,
        keywords: JSON.stringify(ruleToSave.keywords),
      }]);
    } catch (e) {
      console.warn('[AutoresponderEngine] Supabase upsert error:', e);
    }
  }

  await logActivity({
    type: 'autoresponder_rule_updated',
    description: `Updated autoresponder rule: "${ruleToSave.name}" (${ruleToSave.channel})`,
    metadata: { rule_id: ruleToSave.id, channel: ruleToSave.channel },
  });

  return ruleToSave;
}

/** Delete rule */
export async function deleteAutoresponderRule(ruleId: string): Promise<boolean> {
  const rules = await getAutoresponderRules();
  const filtered = rules.filter((r) => r.id !== ruleId);
  writeLocalRules(filtered);

  const config = getRuntimeConfig();
  if (config.storageMode !== 'local') {
    try {
      const supabase = getSupabaseClient();
      await (supabase as any).from('autoresponder_rules').delete().eq('id', ruleId);
    } catch (e) {
      console.warn('[AutoresponderEngine] Supabase delete error:', e);
    }
  }
  return true;
}

/** Match incoming message and return autoresponder reply */
export async function processAutoresponderMessage(params: {
  message: string;
  channel: AutoresponderChannel;
  senderContact?: string;
  senderName?: string;
}): Promise<{ matched: boolean; ruleId?: string; replyText: string; responseType: ResponseType; isOptOut?: boolean }> {
  // 1. Instant check for Opt-Out / STOP
  if (isOptOutKeyword(params.message)) {
    if (params.senderContact) {
      recordOptOut(params.senderContact, `User sent opt-out keyword: "${params.message}"`);
    }

    await logActivity({
      type: 'autoresponder_triggered',
      description: `Opt-out / STOP processed for ${params.senderContact || 'unknown contact'}`,
      metadata: { channel: params.channel, sender: params.senderContact, text: params.message },
    });

    return {
      matched: true,
      ruleId: 'rule_optout_000',
      replyText: 'You have been successfully unsubscribed. You will not receive any further automated outreach messages from Bethelmind Solutions. Wishing your business continued success!',
      responseType: 'template',
      isOptOut: true,
    };
  }

  const rules = await getAutoresponderRules();
  const activeRules = rules.filter(
    (r) => r.enabled && (r.channel === 'all' || r.channel === params.channel)
  ).sort((a, b) => b.priority - a.priority);

  const cleanMsg = params.message.trim().toLowerCase();

  for (const rule of activeRules) {
    let matches = false;

    if (rule.trigger_type === 'default_welcome') {
      if (cleanMsg.length < 15 || rule.keywords.some((kw) => cleanMsg.includes(kw.toLowerCase()))) {
        matches = true;
      }
    } else if (rule.trigger_type === 'contains' || rule.trigger_type === 'keyword') {
      if (rule.keywords.some((kw) => cleanMsg.includes(kw.toLowerCase()))) {
        matches = true;
      }
    } else if (rule.trigger_type === 'outside_hours') {
      const currentHour = new Date().getHours();
      if (currentHour < 8 || currentHour >= 18) {
        matches = true;
      }
    }

    if (matches) {
      rule.reply_count = (rule.reply_count || 0) + 1;
      await saveAutoresponderRule(rule);

      // Bridge alert to Unified WhatsApp Closer / Admin Desk
      try {
        const hubUrls = [process.env.COMMAND_CENTER_URL, 'http://127.0.0.1:3007', 'http://127.0.0.1:3008'].filter(Boolean) as string[];
        for (const hubUrl of hubUrls) {
          fetch(`${hubUrl}/inbound-inquiry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              channel: params.channel,
              phone: params.senderContact,
              name: params.senderName || 'Autoresponder Inquirer',
              message: params.message,
              subject: `Autoresponder Match: ${rule.name}`
            }),
            signal: AbortSignal.timeout(2000)
          }).catch(() => {});
        }
      } catch (_) {}

      return {
        matched: true,
        ruleId: rule.id,
        replyText: rule.response_text,
        responseType: rule.response_type,
      };
    }
  }

  // Fallback forwarder
  try {
    const hubUrls = [process.env.COMMAND_CENTER_URL, 'http://127.0.0.1:3007', 'http://127.0.0.1:3008'].filter(Boolean) as string[];
    for (const hubUrl of hubUrls) {
      fetch(`${hubUrl}/inbound-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: params.channel,
          phone: params.senderContact,
          name: params.senderName || 'Inquirer',
          message: params.message,
          subject: 'Unmatched Inbound Autoresponder Inquiry'
        }),
        signal: AbortSignal.timeout(2000)
      }).catch(() => {});
    }
  } catch (_) {}

  return {
    matched: false,
    replyText: 'Thank you for your message! Our Customer AI Agent and support team have logged your inquiry and will reply shortly.',
    responseType: 'template',
  };
}
