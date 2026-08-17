import fs from 'fs';
import path from 'path';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';

export interface AdminAiMemoryStore {
  admin_phone?: string;
  admin_email?: string;
  default_sector?: string;
  default_location?: string;
  preferred_sms_gateway?: string;
  claim_fee_ngn?: number;
  custom_preferences: Record<string, string>;
  learned_facts: string[];
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

const DEFAULT_MEMORY: AdminAiMemoryStore = {
  admin_phone: '2348022791227',
  admin_email: 'tosin@bethelmindanalytics.com',
  default_sector: 'Salons & Healthcare Clinics',
  default_location: 'Lagos (Ikeja, Lekki, Surulere, Victoria Island)',
  preferred_sms_gateway: 'http://10.132.90.251:8082',
  claim_fee_ngn: 185000,
  custom_preferences: {
    outreach_scope: '10K Lagos Engine ONLY (Exclude SolarQuotePro)',
    sms_gateway: 'Tailscale Android SMS Gateway (10.132.90.251:8082)',
    safe_ramp: 'Day 1-2: 30 msgs, Day 3-5: 45 msgs, Day 6-7: 60 msgs',
    active_sprint: 'Monday, August 17, 2026 to Sunday, August 23, 2026'
  },
  learned_facts: [
    'User phone number is 2348022791227 (08022791227)',
    'User email is tosin@bethelmindanalytics.com',
    'Outreach routes strictly through Tailscale Android SMS Gateway (NO Termii)',
    'Active sprint is August 17 to August 23, 2026',
    'Standard claim fee is 185,000 NGN via Moniepoint / OPay'
  ],
  recent_commands: [],
  conversation_history: [],
  updated_at: new Date().toISOString()
};

export function getAdminMemory(): AdminAiMemoryStore {
  try {
    const memPath = getMemoryFilePath();
    if (!fs.existsSync(memPath)) {
      // Ensure dir exists
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
  return `
[PERMANENT ADMIN MEMORY & KNOWLEDGE BASE]
- Admin Contact Phone: ${mem.admin_phone}
- Admin Contact Email: ${mem.admin_email}
- Default Sector Focus: ${mem.default_sector}
- Default Territory: ${mem.default_location}
- SMS Gateway: ${mem.preferred_sms_gateway}
- Claim Fee: ₦${(mem.claim_fee_ngn || 185000).toLocaleString()}
- Active Sprint: ${mem.custom_preferences.active_sprint || 'Aug 17 - Aug 23, 2026'}
- Core Memory Directives:
${mem.learned_facts.map(f => `  * ${f}`).join('\n')}

[RECENT COMMANDS HISTORY]
${mem.recent_commands.slice(0, 5).map(c => `  - [${c.timestamp.slice(11, 16)}] "${c.command}" -> ${c.summary}`).join('\n') || '  (None yet)'}
`.trim();
}
