/**
 * @file autoresponderEngine.ts
 * Multi-Channel Autoresponder Engine
 * Supports WhatsApp, SMS, Email, and Web Chat auto-replies.
 */

import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient';
import { getRuntimeConfig } from './localConfig';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';
import { logActivity } from './activityLogger';

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

/** Default starter autoresponder rules */
const DEFAULT_RULES: AutoresponderRule[] = [
  {
    id: 'rule_welcome_001',
    name: 'Instant Welcome Auto-reply',
    channel: 'all',
    trigger_type: 'default_welcome',
    keywords: ['hello', 'hi', 'start', 'help', 'hey', 'good day'],
    response_type: 'template',
    response_text: 'Hello! 👋 Thank you for reaching out to Bethelmind Solutions. How can we assist your business today? Type "PRICE" for packages or "AGENT" to talk to our AI assistant.',
    priority: 10,
    enabled: true,
    reply_count: 142,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rule_pricing_002',
    name: 'Solar & Lead Gen Pricing Inquiries',
    channel: 'all',
    trigger_type: 'contains',
    keywords: ['price', 'cost', 'pricing', 'how much', 'quote', 'package', 'tariff', 'fee'],
    response_type: 'template',
    response_text: '☀️ Our specialized packages start with customized solutions for Solar & B2B Lead Gen! Share your mobile phone or email address, and our AI Agent will generate an instant quote for you.',
    priority: 8,
    enabled: true,
    reply_count: 98,
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
    response_text: '🌙 Thanks for your message! Our team is currently off-duty, but our 24/7 Customer AI Agent is available. Leave your email or phone number and we will reply first thing in the morning!',
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
        priority: rule.priority || 5,
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
      priority: rule.priority || 5,
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
}): Promise<{ matched: boolean; ruleId?: string; replyText: string; responseType: ResponseType }> {
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
      // Increment reply counter
      rule.reply_count = (rule.reply_count || 0) + 1;
      await saveAutoresponderRule(rule);

      await logActivity({
        type: 'autoresponder_triggered',
        description: `Autoresponder "${rule.name}" triggered for ${params.channel}`,
        metadata: { rule_id: rule.id, channel: params.channel, sender: params.senderContact },
      });

      return {
        matched: true,
        ruleId: rule.id,
        replyText: rule.response_text,
        responseType: rule.response_type,
      };
    }
  }

  // Fallback default message
  return {
    matched: false,
    replyText: 'Thank you for your message! Our Customer AI Agent and support team have logged your inquiry and will reply shortly.',
    responseType: 'template',
  };
}
