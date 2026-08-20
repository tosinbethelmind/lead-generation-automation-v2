import fs from 'fs';
import path from 'path';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';

export interface DailySprintQuota {
  date: string;
  day_of_sprint: number; // 1 to 7
  safe_daily_limit: number;
  dispatched_count: number;
  replies_count: number;
  claims_verified: number;
  channels_used: string[];
}

export interface AdminAiMemoryStore {
  admin_phone: string;
  admin_email: string;
  default_sector: string;
  default_location: string;
  preferred_sms_gateway: string;
  claim_fee_ngn: number;
  sprint_start_date: string; // '2026-08-17'
  sprint_end_date: string;   // '2026-08-23'
  custom_preferences: Record<string, string>;
  learned_facts: string[];
  daily_quotas: Record<string, DailySprintQuota>;
  recent_commands: {
    command: string;
    action: string;
    summary: string;
    timestamp: string;
  }[];
  conversation_history: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
  updated_at: string;
}

const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getMemoryFilePath(): string {
  return isServerless
    ? path.join('/tmp', 'admin_ai_memory.json')
    : path.join(process.cwd(), 'local_db', 'admin_ai_memory.json');
}

/**
 * Calculates current day in the active 1-week high-volume sprint (Aug 20 - Aug 26, 2026)
 * with a high-deliverability 500 leads/day capacity (Carrier SMS + B2B Email).
 */
export function getSprintDayInfo(targetDate: Date = new Date()): { dayNumber: number; safeLimit: number; dateStr: string } {
  const dateStr = targetDate.toISOString().split('T')[0];
  const sprintStart = new Date('2026-08-20T00:00:00Z');
  const now = new Date(`${dateStr}T00:00:00Z`);

  const diffDays = Math.floor((now.getTime() - sprintStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const dayNumber = Math.max(1, Math.min(diffDays, 7));

  // High-volume ban-proof daily capacity
  const safeLimit = 500;

  return { dayNumber, safeLimit, dateStr };
}

const DEFAULT_MEMORY: AdminAiMemoryStore = {
  admin_phone: '2348022791227',
  admin_email: 'tosin@bethelmindanalytics.com',
  default_sector: 'Salons, Healthcare Clinics, Auto Repair, Logistics & Restaurants',
  default_location: 'Lagos (Ikeja, Lekki, Surulere, Victoria Island, Ikoyi)',
  preferred_sms_gateway: 'http://10.132.90.251:8082',
  claim_fee_ngn: 185000,
  sprint_start_date: '2026-08-20',
  sprint_end_date: '2026-08-26',
  custom_preferences: {
    outreach_scope: '10K Lagos Engine ONLY (Exclude SolarQuotePro)',
    sms_gateway: 'Tailscale Android SMS Gateway (10.132.90.251:8082)',
    safe_ramp_schedule: '500 verified Lagos leads/day (Carrier SMS + B2B Email)',
    active_sprint: 'Thursday, August 20, 2026 to Wednesday, August 26, 2026',
    core_offer: 'Interactive B2B prototype with WhatsApp ordering & Paystack 48h instant setup claim'
  },
  learned_facts: [
    'High-volume outreach campaign launches: Thursday, August 20, 2026 (Runs through August 26, 2026)',
    'User phone number is 2348022791227 (08022791227)',
    'User email is tosin@bethelmindanalytics.com',
    'Outreach routes strictly through Tailscale Android SMS Gateway at http://10.132.90.251:8082 (NO Termii)',
    'Standard website prototype claim fee is 185,000 NGN via Moniepoint / OPay',
    'High-volume ban-proof target is 500 leads/day via dual Carrier SMS + B2B Email with 1-Tap inbound WhatsApp closer'
  ],
  daily_quotas: {},
  recent_commands: [],
  conversation_history: [],
  updated_at: new Date().toISOString()
};

export function getAdminMemory(): AdminAiMemoryStore {
  try {
    const memPath = getMemoryFilePath();
    if (!fs.existsSync(memPath)) {
      const dir = path.dirname(memPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      writeJsonFileSyncAtomic(memPath, DEFAULT_MEMORY);
      return DEFAULT_MEMORY;
    }
    const data = readJsonFileSyncWithRetry(memPath, DEFAULT_MEMORY);
    return { ...DEFAULT_MEMORY, ...data };
  } catch (err) {
    console.warn('Failed to read admin AI memory:', err);
    return DEFAULT_MEMORY;
  }
}

export function saveAdminMemory(update: Partial<AdminAiMemoryStore>): AdminAiMemoryStore {
  try {
    const current = getAdminMemory();
    const merged: AdminAiMemoryStore = {
      ...current,
      ...update,
      custom_preferences: { ...current.custom_preferences, ...(update.custom_preferences || {}) },
      learned_facts: Array.from(new Set([...current.learned_facts, ...(update.learned_facts || [])])),
      daily_quotas: { ...current.daily_quotas, ...(update.daily_quotas || {}) },
      updated_at: new Date().toISOString()
    };

    const memPath = getMemoryFilePath();
    const dir = path.dirname(memPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    writeJsonFileSyncAtomic(memPath, merged);
    return merged;
  } catch (err) {
    console.warn('Failed to persist admin AI memory:', err);
    return getAdminMemory();
  }
}

export function trackOutreachDispatch(count: number, channel: string) {
  try {
    const mem = getAdminMemory();
    const { dayNumber, safeLimit, dateStr } = getSprintDayInfo();

    const existingQuota = mem.daily_quotas[dateStr] || {
      date: dateStr,
      day_of_sprint: dayNumber,
      safe_daily_limit: safeLimit,
      dispatched_count: 0,
      replies_count: 0,
      claims_verified: 0,
      channels_used: []
    };

    existingQuota.dispatched_count += count;
    if (!existingQuota.channels_used.includes(channel)) {
      existingQuota.channels_used.push(channel);
    }

    mem.daily_quotas[dateStr] = existingQuota;
    saveAdminMemory({ daily_quotas: mem.daily_quotas });
  } catch (_) {}
}

export function recordCommandExecution(command: string, action: string, summary: string) {
  try {
    const mem = getAdminMemory();
    const newEntry = {
      command,
      action,
      summary,
      timestamp: new Date().toISOString()
    };
    const updatedCommands = [newEntry, ...mem.recent_commands].slice(0, 30);
    saveAdminMemory({ recent_commands: updatedCommands });
  } catch (_) {}
}

export function learnFact(fact: string) {
  if (!fact || typeof fact !== 'string') return;
  const mem = getAdminMemory();
  const trimmed = fact.trim();
  if (!mem.learned_facts.includes(trimmed)) {
    saveAdminMemory({ learned_facts: [trimmed, ...mem.learned_facts] });
  }
}

export function buildMemoryContextString(): string {
  const mem = getAdminMemory();
  const { dayNumber, safeLimit, dateStr } = getSprintDayInfo();
  const todayQuota = mem.daily_quotas[dateStr] || { dispatched_count: 0 };
  const remaining = Math.max(0, safeLimit - todayQuota.dispatched_count);

  return `
[CAMPAIGN LAUNCH & SPRINT INTELLIGENCE]
- Active Sprint: Monday, August 17, 2026 – Sunday, August 23, 2026
- Current Status: Day ${dayNumber} of 7 (Today: ${dateStr})
- Today's Safe Rate Limit: ${safeLimit} messages/day
- Dispatched Today: ${todayQuota.dispatched_count} / ${safeLimit} (Remaining Allowance: ${remaining})
- Admin Contact Phone: ${mem.admin_phone}
- Admin Contact Email: ${mem.admin_email}
- SMS Routing: Tailscale Android Gateway (${mem.preferred_sms_gateway})
- Standard Setup Claim Fee: ₦${(mem.claim_fee_ngn || 185000).toLocaleString()}
- Default Target Sectors: ${mem.default_sector}
- Target Locations: ${mem.default_location}

[CORE MEMORY DIRECTIVES]
${mem.learned_facts.map(f => `  * ${f}`).join('\n')}

[RECENT COMMANDS]
${mem.recent_commands.slice(0, 5).map(c => `  - [${c.timestamp.slice(11, 16)}] "${c.command}" -> ${c.summary}`).join('\n') || '  (None yet)'}
`.trim();
}
