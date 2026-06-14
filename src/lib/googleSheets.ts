import { google } from 'googleapis';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { getRuntimeConfig, RuntimeConfig } from './localConfig';
import { getSupabaseClient } from './supabaseClient';

// ============================================================================
// TypeScript Interfaces & Types
// ============================================================================

export type LeadStatus = 'NEW' | 'CONTACTED' | 'DO_NOT_CONTACT' | 'ERROR';
export type LeadSource = 'GOOGLE' | 'JIJI' | 'MAPS_FREE' | 'DUCKDUCKGO' | 'OSM' | 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'LINKEDIN';

export interface Lead {
  lead_id: string;
  source: LeadSource;
  name: string;
  category: string;
  address: string;
  area: string;
  city: string;
  phone_e164: string;
  phone_raw: string;
  email: string;
  website: string;
  rating: number;
  reviews_count: number;
  verified: boolean;
  listings_count: number;
  profile_url: string;
  source_query_or_seed: string;
  collected_at: string;
  status: LeadStatus;
  last_contacted_at: string;
  duplicate_of_lead_id: string;
  business_summary: string;
  notes: string;
}

export interface DncEntry {
  phone_e164: string;
  added_at: string;
  reason?: string;
}

export interface LogEntry {
  run_id: string;
  timestamp: string;
  step: string;
  status: 'START' | 'INFO' | 'WARN' | 'SUCCESS' | 'ERROR';
  message: string;
}

const COLUMNS = [
  'lead_id', 'source', 'name', 'category', 'address', 'area', 'city', 
  'phone_e164', 'phone_raw', 'email', 'website', 'rating', 'reviews_count', 
  'verified', 'listings_count', 'profile_url', 'source_query_or_seed', 
  'collected_at', 'status', 'last_contacted_at', 'duplicate_of_lead_id', 
  'business_summary', 'notes'
];

// ============================================================================
// Asynchronous Dev-Safe JSON File Database & Safe Locks
// ============================================================================

class WriteQueue {
  private queue: Promise<any> = Promise.resolve();

  enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const next = this.queue.then(operation);
    this.queue = next.catch(() => {});
    return next;
  }
}

const dbQueue = new WriteQueue();
const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');

// Ensure local db folder exists
if (!fs.existsSync(LOCAL_DB_DIR)) {
  fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
}

const LEADS_FILE = path.join(LOCAL_DB_DIR, 'leads_db.json');
const DNC_FILE = path.join(LOCAL_DB_DIR, 'dnc_db.json');
const LOGS_FILE = path.join(LOCAL_DB_DIR, 'logs_db.json');

async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const data = await fsPromises.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return defaultValue;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ============================================================================
// Cache-Optimized Google Auth Verification
// ============================================================================

let _isGoogleAuthCached: boolean | null = null;

export function isGoogleAuthAvailable(config?: RuntimeConfig): boolean {
  if (_isGoogleAuthCached !== null) return _isGoogleAuthCached;
  const rootDir = process.cwd();
  const credentialsPath = path.join(rootDir, 'credentials.json');
  
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  
  const available = fs.existsSync(credentialsPath) || !!(email && privateKey);
  _isGoogleAuthCached = available;
  return available;
}

export function shouldUseLocalSandbox(config: RuntimeConfig): boolean {
  if (config.storageMode === 'local') return true;
  if (config.storageMode === 'cloud') return false;
  // hybrid mode auto-detects
  return !isGoogleAuthAvailable(config) || !config.googleSpreadsheetId;
}

// ============================================================================
// Unified E.164-Like Phone Normalizer & DNC Checkers
// ============================================================================

export function normalizePhone(
  raw: string,
  country = 'NG',
  options?: { strict?: boolean }
): string | null {
  if (!raw) return null;
  
  // Strip non-numeric digits
  let digits = raw.replace(/\D/g, '');
  
  if (country === 'NG') {
    if (digits.startsWith('2340')) {
      digits = '234' + digits.substring(4);
    } else if (digits.startsWith('0')) {
      digits = '234' + digits.substring(1);
    } else if (digits.length === 10 && ['7', '8', '9'].includes(digits[0])) {
      digits = '234' + digits;
    }
  }
  
  if (options?.strict) {
    if (digits.length < 11 || digits.length > 15) {
      return null;
    }
  } else {
    if (digits.length < 7) return null;
  }
  
  return '+' + digits;
}

export function getDncKeyFromPhone(normalizedPhone: string): string {
  return normalizedPhone.replace(/\D/g, '');
}

export async function isPhoneOnDnc(phone: string, country = 'NG'): Promise<boolean> {
  const norm = normalizePhone(phone, country);
  if (!norm) return false;
  const dncList = await getDNCList();
  const normalizedDnc = dncList.map((p: string) => normalizePhone(p, country)).filter(Boolean) as string[];
  return normalizedDnc.includes(norm);
}

// ============================================================================
// Google Sheets Client Helpers
// ============================================================================

async function getSheetsInstance() {
  const rootDir = process.cwd();
  const credentialsPath = path.join(rootDir, 'credentials.json');

  let auth;
  if (fs.existsSync(credentialsPath)) {
    auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } else {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!email || !privateKey) {
      throw new Error("Missing Google Service Account credentials. Run in local sandbox mode or supply credentials.");
    }
    auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client as any });
}

function getSpreadsheetId() {
  const config = getRuntimeConfig();
  if (!config.googleSpreadsheetId) {
    throw new Error("Spreadsheet ID is not configured in Settings.");
  }
  return config.googleSpreadsheetId;
}

function rowToLead(row: any[]): Lead {
  const lead: any = {};
  COLUMNS.forEach((col, idx) => {
    let val = row[idx] !== undefined ? row[idx] : '';
    if (col === 'rating' || col === 'reviews_count' || col === 'listings_count') {
      lead[col] = Number(val) || 0;
    } else if (col === 'verified') {
      lead[col] = String(val).toUpperCase() === 'TRUE';
    } else {
      lead[col] = String(val);
    }
  });
  return lead as Lead;
}

function leadToRow(lead: Partial<Lead>): any[] {
  return COLUMNS.map(col => {
    const val = (lead as any)[col];
    if (val === undefined || val === null) return '';
    if (col === 'verified') return String(val).toUpperCase();
    return val;
  });
}

function getColLetter(colNum: number): string {
  let temp, letter = '';
  while (colNum > 0) {
    temp = (colNum - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    colNum = (colNum - temp - 1) / 26;
  }
  return letter;
}

// ============================================================================
// Repository Abstraction Architectures
// ============================================================================

export interface ILeadRepository {
  getLeads(): Promise<Lead[]>;
  getLeadById(leadId: string): Promise<Lead | null>;
  saveLeads(leads: Partial<Lead>[]): Promise<{ added: number; skipped: number }>;
  updateLeadStatus(leadId: string, status: LeadStatus, notes?: string, lastContactedAt?: string): Promise<boolean>;
}

export interface IDncRepository {
  getDncList(): Promise<string[]>;
  addToDnc(phone: string): Promise<boolean>;
}

export interface ILogRepository {
  getLogs(): Promise<any[]>;
  appendLog(step: string, status: string, msg: string, runId?: string): Promise<void>;
}

// ----------------------------------------------------------------------------
// Cloud Storage Drivers (Google Sheets)
// ----------------------------------------------------------------------------

class GoogleSheetsLeadRepository implements ILeadRepository {
  async getLeads(): Promise<Lead[]> {
    try {
      const sheets = await getSheetsInstance();
      const spreadsheetId = getSpreadsheetId();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Leads!A2:W',
      });
      const rows = response.data.values || [];
      return rows.map(rowToLead);
    } catch (e: any) {
      console.error('Sheets getLeads error:', e.message);
      return [];
    }
  }

  async getLeadById(leadId: string): Promise<Lead | null> {
    const leads = await this.getLeads();
    return leads.find(l => l.lead_id === leadId) || null;
  }

  async saveLeads(newLeads: Partial<Lead>[]): Promise<{ added: number; skipped: number }> {
    if (newLeads.length === 0) return { added: 0, skipped: 0 };
    
    try {
      const sheets = await getSheetsInstance();
      const spreadsheetId = getSpreadsheetId();
      const existingLeads = await this.getLeads();
      
      const existingIds = new Set(existingLeads.map(l => l.lead_id));
      const existingPhones = new Set(existingLeads.map(l => l.phone_e164).filter(Boolean));
      const existingUrls = new Set(existingLeads.map(l => l.profile_url).filter(Boolean));
      
      const toAppend: any[][] = [];
      let skipped = 0;
      
      for (const lead of newLeads) {
        if (!lead.lead_id) continue;
        
        const normPhone = lead.phone_e164 ? normalizePhone(lead.phone_e164) : null;
        const isDup = 
          existingIds.has(lead.lead_id) || 
          (normPhone && existingPhones.has(normPhone)) ||
          (lead.profile_url && existingUrls.has(lead.profile_url));
          
        if (isDup) {
          skipped++;
        } else {
          lead.phone_e164 = normPhone || lead.phone_e164 || '';
          toAppend.push(leadToRow(lead));
          existingIds.add(lead.lead_id);
          if (normPhone) existingPhones.add(normPhone);
          if (lead.profile_url) existingUrls.add(lead.profile_url);
        }
      }
      
      if (toAppend.length > 0) {
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'Leads!A2',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: toAppend,
          },
        });
      }
      
      return { added: toAppend.length, skipped };
    } catch (e: any) {
      console.error('Sheets saveLeads error:', e.message);
      return { added: 0, skipped: newLeads.length };
    }
  }

  async updateLeadStatus(leadId: string, status: LeadStatus, notes?: string, lastContactedAt?: string): Promise<boolean> {
    try {
      const sheets = await getSheetsInstance();
      const spreadsheetId = getSpreadsheetId();
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Leads!A1:W',
      });
      
      const sheetRows = response.data.values || [];
      const headers = sheetRows[0] || [];
      const idxStatus = headers.indexOf('status');
      const idxLastContacted = headers.indexOf('last_contacted_at');
      const idxNotes = headers.indexOf('notes');
      const idxId = headers.indexOf('lead_id');
      
      if (idxStatus === -1 || idxId === -1) {
        throw new Error("Invalid sheet headers.");
      }
      
      const rowIndex = sheetRows.findIndex(row => row[idxId] === leadId);
      if (rowIndex === -1) return false;
      
      const rowNum = rowIndex + 1;
      
      // Update status
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Leads!${getColLetter(idxStatus + 1)}${rowNum}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[status]] },
      });
      
      // Update notes
      if (notes !== undefined && idxNotes !== -1) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Leads!${getColLetter(idxNotes + 1)}${rowNum}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [[notes]] },
        });
      }
      
      // Update last_contacted_at
      if (lastContactedAt !== undefined && idxLastContacted !== -1) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Leads!${getColLetter(idxLastContacted + 1)}${rowNum}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [[lastContactedAt]] },
        });
      }
      
      return true;
    } catch (e: any) {
      console.error('Sheets updateLeadStatus error:', e.message);
      return false;
    }
  }
}

class GoogleSheetsDncRepository implements IDncRepository {
  async getDncList(): Promise<string[]> {
    try {
      const sheets = await getSheetsInstance();
      const spreadsheetId = getSpreadsheetId();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'DNC!A2:A',
      });
      const rows = response.data.values || [];
      return rows.map(r => String(r[0]).trim()).filter(Boolean);
    } catch (e) {
      console.error('Sheets getDncList error:', e);
      return [];
    }
  }

  async addToDnc(phone: string): Promise<boolean> {
    try {
      const sheets = await getSheetsInstance();
      const spreadsheetId = getSpreadsheetId();
      const dnc = await this.getDncList();
      const norm = normalizePhone(phone);
      if (!norm) return false;
      
      if (dnc.includes(norm)) return true;
      
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'DNC!A2',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[norm, new Date().toISOString()]],
        },
      });
      return true;
    } catch (e) {
      console.error('Sheets addToDnc error:', e);
      return false;
    }
  }
}

class GoogleSheetsLogRepository implements ILogRepository {
  async getLogs(): Promise<any[]> {
    try {
      const sheets = await getSheetsInstance();
      const spreadsheetId = getSpreadsheetId();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Logs!A2:F100',
      });
      return response.data.values || [];
    } catch (e) {
      console.error('Sheets getLogs error:', e);
      return [];
    }
  }

  async appendLog(step: string, status: string, msg: string, runId = 'WEB_APP'): Promise<void> {
    try {
      const sheets = await getSheetsInstance();
      const spreadsheetId = getSpreadsheetId();
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Logs!A2',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[runId, new Date().toISOString(), step, '', status, msg]],
        },
      });
    } catch (e) {
      console.error('Sheets appendLog error:', e);
    }
  }
}

// ----------------------------------------------------------------------------
// Local Storage Drivers (Dev-Safe Asynchronous JSON database with Locks)
// ----------------------------------------------------------------------------

class LocalJsonLeadRepository implements ILeadRepository {
  async getLeads(): Promise<Lead[]> {
    return readJsonFile<Lead[]>(LEADS_FILE, []);
  }

  async getLeadById(leadId: string): Promise<Lead | null> {
    const leads = await this.getLeads();
    return leads.find(l => l.lead_id === leadId) || null;
  }

  async saveLeads(newLeads: Partial<Lead>[]): Promise<{ added: number; skipped: number }> {
    return dbQueue.enqueue(async () => {
      const leads = await this.getLeads();
      const existingIds = new Set(leads.map(l => l.lead_id));
      const existingPhones = new Set(leads.map(l => l.phone_e164).filter(Boolean));
      const existingUrls = new Set(leads.map(l => l.profile_url).filter(Boolean));
      
      const addedLeads: Lead[] = [];
      let skipped = 0;
      
      for (const partial of newLeads) {
        if (!partial.lead_id) continue;
        
        const normPhone = partial.phone_e164 ? normalizePhone(partial.phone_e164) : null;
        const isDup = 
          existingIds.has(partial.lead_id) || 
          (normPhone && existingPhones.has(normPhone)) ||
          (partial.profile_url && existingUrls.has(partial.profile_url));
          
        if (isDup) {
          skipped++;
        } else {
          const completeLead: Lead = {
            lead_id: partial.lead_id,
            source: partial.source || 'GOOGLE',
            name: partial.name || 'Business Owner',
            category: partial.category || 'Business',
            address: partial.address || '',
            area: partial.area || '',
            city: partial.city || 'Lagos',
            phone_e164: normPhone || partial.phone_raw || '',
            phone_raw: partial.phone_raw || '',
            email: partial.email || '',
            website: partial.website || '',
            rating: partial.rating || 0,
            reviews_count: partial.reviews_count || 0,
            verified: !!partial.verified,
            listings_count: partial.listings_count || 1,
            profile_url: partial.profile_url || '',
            source_query_or_seed: partial.source_query_or_seed || '',
            collected_at: partial.collected_at || new Date().toISOString(),
            status: (partial.status as LeadStatus) || 'NEW',
            last_contacted_at: partial.last_contacted_at || '',
            duplicate_of_lead_id: partial.duplicate_of_lead_id || '',
            business_summary: partial.business_summary || '',
            notes: partial.notes || ''
          };
          
          addedLeads.push(completeLead);
          existingIds.add(completeLead.lead_id);
          if (normPhone) existingPhones.add(normPhone);
          if (completeLead.profile_url) existingUrls.add(completeLead.profile_url);
        }
      }
      
      if (addedLeads.length > 0) {
        await writeJsonFile<Lead[]>(LEADS_FILE, [...leads, ...addedLeads]);
      }
      
      return { added: addedLeads.length, skipped };
    });
  }

  async updateLeadStatus(leadId: string, status: LeadStatus, notes?: string, lastContactedAt?: string): Promise<boolean> {
    return dbQueue.enqueue(async () => {
      const leads = await this.getLeads();
      const index = leads.findIndex(l => l.lead_id === leadId);
      if (index === -1) return false;
      
      leads[index].status = status;
      if (notes !== undefined) {
        leads[index].notes = notes;
      }
      if (lastContactedAt !== undefined) {
        leads[index].last_contacted_at = lastContactedAt;
      }
      
      await writeJsonFile<Lead[]>(LEADS_FILE, leads);
      return true;
    });
  }
}

class LocalJsonDncRepository implements IDncRepository {
  async getDncList(): Promise<string[]> {
    const entries = await readJsonFile<DncEntry[]>(DNC_FILE, []);
    return entries.map(e => e.phone_e164);
  }

  async addToDnc(phone: string): Promise<boolean> {
    return dbQueue.enqueue(async () => {
      const entries = await readJsonFile<DncEntry[]>(DNC_FILE, []);
      const norm = normalizePhone(phone);
      if (!norm) return false;
      
      if (entries.some(e => e.phone_e164 === norm)) return true;
      
      const newEntry: DncEntry = {
        phone_e164: norm,
        added_at: new Date().toISOString()
      };
      
      await writeJsonFile<DncEntry[]>(DNC_FILE, [...entries, newEntry]);
      return true;
    });
  }
}

class LocalJsonLogRepository implements ILogRepository {
  async getLogs(): Promise<any[]> {
    const logs = await readJsonFile<LogEntry[]>(LOGS_FILE, []);
    // Map entries into the spreadsheet-like array to remain fully compatible with dashboard
    return logs.map(l => [l.run_id, l.timestamp, l.step, '', l.status, l.message]);
  }

  async appendLog(step: string, status: string, msg: string, runId = 'WEB_APP'): Promise<void> {
    return dbQueue.enqueue(async () => {
      const logs = await readJsonFile<LogEntry[]>(LOGS_FILE, []);
      const newEntry: LogEntry = {
        run_id: runId,
        timestamp: new Date().toISOString(),
        step,
        status: status as any,
        message: msg
      };
      await writeJsonFile<LogEntry[]>(LOGS_FILE, [...logs, newEntry]);
    });
  }
}

// ----------------------------------------------------------------------------
// Supabase Database Drivers
// ----------------------------------------------------------------------------

class SupabaseLeadRepository implements ILeadRepository {
  private fallback = new LocalJsonLeadRepository();

  async getLeads(): Promise<Lead[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('collected_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Lead[];
    } catch (e: any) {
      console.warn('Supabase getLeads error, falling back to local JSON:', e.message);
      return this.fallback.getLeads();
    }
  }

  async getLeadById(leadId: string): Promise<Lead | null> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('lead_id', leadId)
        .single();
      if (error) throw error;
      return data as Lead;
    } catch (e: any) {
      console.warn('Supabase getLeadById error, falling back to local JSON:', e.message);
      return this.fallback.getLeadById(leadId);
    }
  }

  async saveLeads(newLeads: Partial<Lead>[]): Promise<{ added: number; skipped: number }> {
    if (newLeads.length === 0) return { added: 0, skipped: 0 };
    try {
      const supabase = getSupabaseClient();
      const existingLeads = await this.getLeads();
      const existingIds = new Set(existingLeads.map(l => l.lead_id));
      const existingPhones = new Set(existingLeads.map(l => l.phone_e164).filter(Boolean));
      const existingUrls = new Set(existingLeads.map(l => l.profile_url).filter(Boolean));

      const toInsert: any[] = [];
      let skipped = 0;

      for (const lead of newLeads) {
        if (!lead.lead_id) continue;
        const normPhone = lead.phone_e164 ? normalizePhone(lead.phone_e164) : null;
        const isDup = 
          existingIds.has(lead.lead_id) || 
          (normPhone && existingPhones.has(normPhone)) ||
          (lead.profile_url && existingUrls.has(lead.profile_url));

        if (isDup) {
          skipped++;
        } else {
          lead.phone_e164 = normPhone || lead.phone_e164 || '';
          
          toInsert.push({
            lead_id: lead.lead_id,
            source: lead.source || 'GOOGLE',
            name: lead.name || 'Business Owner',
            category: lead.category || '',
            address: lead.address || '',
            area: lead.area || '',
            city: lead.city || 'Lagos',
            phone_e164: lead.phone_e164,
            phone_raw: lead.phone_raw || '',
            email: lead.email || '',
            website: lead.website || '',
            rating: lead.rating || 0,
            reviews_count: lead.reviews_count || 0,
            verified: !!lead.verified,
            listings_count: lead.listings_count || 1,
            profile_url: lead.profile_url || '',
            source_query_or_seed: lead.source_query_or_seed || '',
            collected_at: lead.collected_at || new Date().toISOString(),
            status: lead.status || 'NEW',
            last_contacted_at: lead.last_contacted_at || null,
            duplicate_of_lead_id: lead.duplicate_of_lead_id || '',
            business_summary: lead.business_summary || '',
            notes: lead.notes || ''
          });

          existingIds.add(lead.lead_id);
          if (normPhone) existingPhones.add(normPhone);
          if (lead.profile_url) existingUrls.add(lead.profile_url);
        }
      }

      if (toInsert.length > 0) {
        const { error } = await supabase.from('leads').insert(toInsert);
        if (error) throw error;
      }
      return { added: toInsert.length, skipped };
    } catch (e: any) {
      console.warn('Supabase saveLeads error, falling back to local JSON:', e.message);
      return this.fallback.saveLeads(newLeads);
    }
  }

  async updateLeadStatus(leadId: string, status: LeadStatus, notes?: string, lastContactedAt?: string): Promise<boolean> {
    try {
      const supabase = getSupabaseClient();
      const updates: any = { status };
      if (notes !== undefined) updates.notes = notes;
      if (lastContactedAt !== undefined) updates.last_contacted_at = lastContactedAt;

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('lead_id', leadId);
      if (error) throw error;
      return true;
    } catch (e: any) {
      console.warn('Supabase updateLeadStatus error, falling back to local JSON:', e.message);
      return this.fallback.updateLeadStatus(leadId, status, notes, lastContactedAt);
    }
  }
}

class SupabaseDncRepository implements IDncRepository {
  private fallback = new LocalJsonDncRepository();

  async getDncList(): Promise<string[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('dnc')
        .select('phone_e164');
      if (error) throw error;
      return (data || []).map((row: any) => row.phone_e164);
    } catch (e: any) {
      console.warn('Supabase getDncList error, falling back to local JSON:', e.message);
      return this.fallback.getDncList();
    }
  }

  async addToDnc(phone: string): Promise<boolean> {
    try {
      const supabase = getSupabaseClient();
      const norm = normalizePhone(phone);
      if (!norm) return false;

      const { error } = await supabase
        .from('dnc')
        .upsert({
          phone_e164: norm,
          added_at: new Date().toISOString()
        });
      if (error) throw error;
      return true;
    } catch (e: any) {
      console.warn('Supabase addToDnc error, falling back to local JSON:', e.message);
      return this.fallback.addToDnc(phone);
    }
  }
}

class SupabaseLogRepository implements ILogRepository {
  private fallback = new LocalJsonLogRepository();

  async getLogs(): Promise<any[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data || []).map((row: any) => [
        row.run_id,
        row.timestamp,
        row.step,
        '',
        row.status,
        row.message
      ]);
    } catch (e: any) {
      console.warn('Supabase getLogs error, falling back to local JSON:', e.message);
      return this.fallback.getLogs();
    }
  }

  async appendLog(step: string, status: string, msg: string, runId = 'WEB_APP'): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('logs')
        .insert({
          run_id: runId,
          timestamp: new Date().toISOString(),
          step,
          status,
          message: msg
        });
      if (error) throw error;
    } catch (e: any) {
      console.warn('Supabase appendLog error, falling back to local JSON:', e.message);
      return this.fallback.appendLog(step, status, msg, runId);
    }
  }
}

// ============================================================================
// Storage Context Director
// ============================================================================

export function getActiveLeadRepository(): ILeadRepository {
  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    return new LocalJsonLeadRepository();
  }
  if (config.storageMode === 'supabase' || (config.supabaseUrl && config.supabaseKey)) {
    return new SupabaseLeadRepository();
  }
  if (shouldUseLocalSandbox(config)) {
    return new LocalJsonLeadRepository();
  }
  return new GoogleSheetsLeadRepository();
}

export function getActiveDncRepository(): IDncRepository {
  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    return new LocalJsonDncRepository();
  }
  if (config.storageMode === 'supabase' || (config.supabaseUrl && config.supabaseKey)) {
    return new SupabaseDncRepository();
  }
  if (shouldUseLocalSandbox(config)) {
    return new LocalJsonDncRepository();
  }
  return new GoogleSheetsDncRepository();
}

export function getActiveLogRepository(): ILogRepository {
  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    return new LocalJsonLogRepository();
  }
  if (config.storageMode === 'supabase' || (config.supabaseUrl && config.supabaseKey)) {
    return new SupabaseLogRepository();
  }
  if (shouldUseLocalSandbox(config)) {
    return new LocalJsonLogRepository();
  }
  return new GoogleSheetsLogRepository();
}

// ============================================================================
// Direct Backward-Compatible Export Interfaces
// ============================================================================

export async function getLeads(): Promise<Lead[]> {
  return getActiveLeadRepository().getLeads();
}

export async function saveLeads(leads: Partial<Lead>[]): Promise<{ added: number; skipped: number }> {
  return getActiveLeadRepository().saveLeads(leads);
}

export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string, lastContactedAt?: string): Promise<boolean> {
  return getActiveLeadRepository().updateLeadStatus(leadId, status, notes, lastContactedAt);
}

export async function getDNCList(): Promise<string[]> {
  return getActiveDncRepository().getDncList();
}

export async function addDNCEntry(phone: string): Promise<boolean> {
  return getActiveDncRepository().addToDnc(phone);
}

export async function getLogs(): Promise<any[]> {
  return getActiveLogRepository().getLogs();
}

export async function addLog(step: string, status: string, msg: string, runId?: string): Promise<void> {
  return getActiveLogRepository().appendLog(step, status, msg, runId);
}

export async function getSyncStats() {
  const leads = await getLeads();
  const dnc = await getDNCList();
  
  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === 'NEW').length,
    contactedLeads: leads.filter(l => l.status === 'CONTACTED').length,
    dncLeads: leads.filter(l => l.status === 'DO_NOT_CONTACT').length + dnc.length,
    errorLeads: leads.filter(l => l.status === 'ERROR').length,
    googleLeads: leads.filter(l => l.source === 'GOOGLE').length,
    jijiLeads: leads.filter(l => l.source === 'JIJI').length,
    mapsFreeLeads: leads.filter(l => l.source === 'MAPS_FREE').length,
    duckduckgoLeads: leads.filter(l => l.source === 'DUCKDUCKGO').length,
    osmLeads: leads.filter(l => l.source === 'OSM').length,
    instagramLeads: leads.filter(l => l.source === 'INSTAGRAM').length,
    facebookLeads: leads.filter(l => l.source === 'FACEBOOK').length,
    tiktokLeads: leads.filter(l => l.source === 'TIKTOK').length,
    linkedinLeads: leads.filter(l => l.source === 'LINKEDIN').length,
    highRatingLeads: leads.filter(l => l.rating >= 4.5).length,
    noReviewLeads: leads.filter(l => l.reviews_count === 0).length,
  };
  
  return stats;
}
