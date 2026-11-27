import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { upsertCustomer } from '@/lib/commerce/ledger';
import { getSupabaseClient } from '@/lib/supabaseClient';

export type LeadPipelineStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUOTE SENT'
  | 'AWAITING PAYMENT'
  | 'PAID'
  | 'IN PROGRESS'
  | 'COMPLETED'
  | 'LOST';

export interface EnquiryRecord {
  id: string;
  name: string;
  whatsapp: string;
  businessName?: string;
  email?: string;
  selectedService: string;
  selectedPackage?: string;
  agreedPriceNgn?: number;
  message?: string;
  source: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utmCampaign?: string;
  status: LeadPipelineStatus;
  followUpNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioEntry {
  id: string;
  title: string;
  category: string;
  projectType: 'demonstration' | 'completed_client';
  liveUrl: string;
  screenshotUrl?: string;
  description: string;
  createdAt: string;
}

const ENQUIRIES_PATH = path.join(process.cwd(), 'local_db', 'commerce_enquiries.json');
const PORTFOLIO_PATH = path.join(process.cwd(), 'local_db', 'commerce_portfolio.json');

const DEFAULT_PORTFOLIO: PortfolioEntry[] = [
  {
    id: 'demo-solar-lagos',
    title: 'Solar & Inverter Dealer Interactive Preview',
    category: 'Solar & Energy',
    projectType: 'demonstration',
    liveUrl: '/preview/lagos-solar-demo',
    description: 'Demonstration mobile-first website with service overview, load sizer, and WhatsApp enquiry capture.',
    createdAt: '2026-11-26T00:00:00.000Z',
  },
  {
    id: 'demo-clinic-ikeja',
    title: 'Clinic & Healthcare Booking Preview',
    category: 'Healthcare & Clinics',
    projectType: 'demonstration',
    liveUrl: '/preview/ikeja-clinic-demo',
    description: 'Demonstration patient-first landing page with service hours and appointment enquiry workflow.',
    createdAt: '2026-11-26T00:00:00.000Z',
  },
];

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

export function validateNigerianPhone(raw: string): { valid: boolean; normalized: string; error?: string } {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 14) {
    return { valid: false, normalized: digits, error: 'Please enter a valid 11-digit Nigerian WhatsApp number (e.g. 0803 123 4567).' };
  }
  if (/0000|11111|88888|123456|654321/.test(digits)) {
    return { valid: false, normalized: digits, error: 'Please enter a real WhatsApp phone number.' };
  }
  const normalized = digits.startsWith('0') && digits.length === 11 ? `234${digits.slice(1)}` : digits;
  return { valid: true, normalized };
}

export async function createEnquiry(input: {
  name: string;
  whatsapp: string;
  businessName?: string;
  email?: string;
  selectedService: string;
  selectedPackage?: string;
  agreedPriceNgn?: number;
  message?: string;
  source?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utmCampaign?: string;
}): Promise<EnquiryRecord> {
  const list = readJson<EnquiryRecord[]>(ENQUIRIES_PATH, []);
  const now = new Date().toISOString();
  const record: EnquiryRecord = {
    id: `ENQ-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
    name: input.name.trim(),
    whatsapp: input.whatsapp,
    businessName: input.businessName?.trim() || undefined,
    email: input.email?.trim() || undefined,
    selectedService: input.selectedService,
    selectedPackage: input.selectedPackage || undefined,
    agreedPriceNgn: input.agreedPriceNgn,
    message: input.message?.trim() || undefined,
    source: input.source || 'website',
    gclid: input.gclid || undefined,
    gbraid: input.gbraid || undefined,
    wbraid: input.wbraid || undefined,
    utmCampaign: input.utmCampaign || undefined,
    status: 'NEW',
    createdAt: now,
    updatedAt: now,
  };

  list.push(record);
  writeJson(ENQUIRIES_PATH, list);

  try {
    const supabase = getSupabaseClient();
    await (supabase.from('enquiries') as any).insert({
      id: record.id,
      name: record.name,
      whatsapp: record.whatsapp,
      business_name: record.businessName || null,
      email: record.email || null,
      selected_service: record.selectedService,
      selected_package: record.selectedPackage || null,
      agreed_price_ngn: record.agreedPriceNgn || null,
      message: record.message || null,
      source: record.source,
      gclid: record.gclid || null,
      gbraid: record.gbraid || null,
      wbraid: record.wbraid || null,
      utm_campaign: record.utmCampaign || null,
      status: record.status,
      created_at: now,
      updated_at: now,
    });
  } catch {}

  try {
    await upsertCustomer({
      name: record.name,
      email: record.email,
      whatsappNumber: record.whatsapp,
      companyName: record.businessName,
    });
  } catch {}

  return record;
}

export async function listEnquiries(): Promise<EnquiryRecord[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((r: any) => ({
        id: r.id,
        name: r.name,
        whatsapp: r.whatsapp,
        businessName: r.business_name || undefined,
        email: r.email || undefined,
        selectedService: r.selected_service,
        selectedPackage: r.selected_package || undefined,
        agreedPriceNgn: r.agreed_price_ngn || undefined,
        message: r.message || undefined,
        source: r.source,
        gclid: r.gclid || undefined,
        gbraid: r.gbraid || undefined,
        wbraid: r.wbraid || undefined,
        utmCampaign: r.utm_campaign || undefined,
        status: r.status,
        followUpNotes: r.follow_up_notes || undefined,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    }
  } catch {}
  return readJson<EnquiryRecord[]>(ENQUIRIES_PATH, []).slice().reverse();
}

export async function updateEnquiryStatus(
  id: string,
  status: LeadPipelineStatus,
  followUpNotes?: string
): Promise<EnquiryRecord | null> {
  const now = new Date().toISOString();
  const list = readJson<EnquiryRecord[]>(ENQUIRIES_PATH, []);
  const idx = list.findIndex((e) => e.id === id);
  let updatedRecord: EnquiryRecord | null = null;

  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      status,
      ...(followUpNotes !== undefined ? { followUpNotes } : {}),
      updatedAt: now,
    };
    writeJson(ENQUIRIES_PATH, list);
    updatedRecord = list[idx];
  }

  try {
    const supabase = getSupabaseClient();
    const { data } = await (supabase.from('enquiries') as any)
      .update({
        status,
        ...(followUpNotes !== undefined ? { follow_up_notes: followUpNotes } : {}),
        updated_at: now,
      })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (data && !updatedRecord) {
      updatedRecord = {
        id: data.id,
        name: data.name,
        whatsapp: data.whatsapp,
        selectedService: data.selected_service,
        source: data.source,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  } catch {}

  return updatedRecord;
}

export async function listPortfolioEntries(): Promise<PortfolioEntry[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        projectType: r.project_type,
        liveUrl: r.live_url,
        screenshotUrl: r.screenshot_url || undefined,
        description: r.description,
        createdAt: r.created_at,
      }));
    }
  } catch {}
  const stored = readJson<PortfolioEntry[]>(PORTFOLIO_PATH, []);
  return stored.length > 0 ? stored : DEFAULT_PORTFOLIO;
}

export async function addPortfolioEntry(input: Omit<PortfolioEntry, 'id' | 'createdAt'>): Promise<PortfolioEntry> {
  const current = await listPortfolioEntries();
  const entry: PortfolioEntry = {
    ...input,
    id: `port-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  writeJson(PORTFOLIO_PATH, [entry, ...current]);

  try {
    const supabase = getSupabaseClient();
    await (supabase.from('portfolio_items') as any).insert({
      id: entry.id,
      title: entry.title,
      category: entry.category,
      project_type: entry.projectType,
      live_url: entry.liveUrl,
      screenshot_url: entry.screenshotUrl || null,
      description: entry.description,
      created_at: entry.createdAt,
    });
  } catch {}

  return entry;
}
