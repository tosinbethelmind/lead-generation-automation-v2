import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { upsertCustomer } from '@/lib/commerce/ledger';

export interface WhatsAppAuditEntry {
  id: string;
  phoneE164: string;
  direction: 'inbound' | 'outbound';
  provider: 'meta_cloud' | 'evolution' | 'manual';
  messageType: string;
  templateName?: string;
  contentSummary: string;
  optInVerified: boolean;
  status: string;
  providerMessageId?: string;
  createdAt: string;
}

const AUDIT_FILE = path.join(process.cwd(), 'local_db', 'whatsapp_audit_log.json');
const CONSENT_FILE = path.join(process.cwd(), 'local_db', 'whatsapp_consents.json');

function normalizePhone(phone: string): string {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) return `234${digits.slice(1)}`;
  return digits;
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {}
  return fallback;
}

function writeJson(filePath: string, data: unknown): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch {}
}

export async function recordWhatsAppConsent(
  phone: string,
  status: 'opted_in' | 'opted_out',
  name?: string
) {
  const phoneE164 = normalizePhone(phone);
  const consents = readJson<Record<string, { status: string; updatedAt: string }>>(CONSENT_FILE, {});
  consents[phoneE164] = { status, updatedAt: new Date().toISOString() };
  writeJson(CONSENT_FILE, consents);

  await upsertCustomer({
    name: name || 'WhatsApp Contact',
    whatsappNumber: phoneE164,
    consentStatus: status,
  });

  return { phoneE164, consentStatus: status };
}

export function getWhatsAppConsentStatus(phone: string): 'opted_in' | 'opted_out' | 'pending' {
  const phoneE164 = normalizePhone(phone);
  const consents = readJson<Record<string, { status: string }>>(CONSENT_FILE, {});
  const s = consents[phoneE164]?.status;
  if (s === 'opted_in' || s === 'opted_out') return s;
  return 'pending';
}

export async function logWhatsAppAudit(entry: Omit<WhatsAppAuditEntry, 'id' | 'createdAt'>): Promise<WhatsAppAuditEntry> {
  const phoneE164 = normalizePhone(entry.phoneE164);
  const record: WhatsAppAuditEntry = {
    ...entry,
    phoneE164,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const list = readJson<WhatsAppAuditEntry[]>(AUDIT_FILE, []);
  list.push(record);
  if (list.length > 1000) list.splice(0, list.length - 1000);
  writeJson(AUDIT_FILE, list);

  try {
    const supabase = getSupabaseClient();
    await (supabase.from('whatsapp_message_audit') as any).insert({
      id: record.id,
      phone_e164: record.phoneE164,
      direction: record.direction,
      provider: record.provider,
      message_type: record.messageType,
      template_name: record.templateName || null,
      content_summary: record.contentSummary,
      opt_in_verified: record.optInVerified,
      status: record.status,
      provider_message_id: record.providerMessageId || null,
      created_at: record.createdAt,
    });
  } catch {}

  return record;
}

export function canSendCompliantWhatsApp(phone: string): { allowed: boolean; reason?: string } {
  const status = getWhatsAppConsentStatus(phone);
  if (status === 'opted_out') {
    return { allowed: false, reason: 'Recipient has opted out of WhatsApp messages' };
  }
  return { allowed: true };
}
