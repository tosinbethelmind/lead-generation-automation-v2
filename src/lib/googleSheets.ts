import { google } from 'googleapis';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { getRuntimeConfig, RuntimeConfig } from './localConfig';
import { getSupabaseClient } from './supabaseClient';

// ============================================================================
// TypeScript Interfaces & Types
// ============================================================================

export type LeadStatus = 'NEW' | 'CONTACTED' | 'DO_NOT_CONTACT' | 'ERROR' | 'CLAIMED' | 'MANUAL_REVISION';
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
  isMock?: boolean;
  business_hours?: string;
  reviews_data?: string;
  photos_data?: string;
  social_links?: string;
  services_data?: string;
  generated_copy?: any;
  design_theme?: any;
  overrides?: any;
  email_verified?: boolean;
  cms_platform?: string;
  upgrade_strategy?: string;
  cms_confidence?: string;
  plugin_suggestions?: string;
  embed_note?: string;
  cmsPlatform?: string;
  upgradeStrategy?: string;
  cmsConfidence?: string;
  pluginSuggestions?: string[];
  embedNote?: string;
}

export function isMockLead(lead: Partial<Lead>): boolean {
  if (!lead.lead_id) return false;
  const id = lead.lead_id.toLowerCase();
  const notes = (lead.notes || '').toLowerCase();
  return (
    id.startsWith('mock_') ||
    id.startsWith('osm_mock_') ||
    id.startsWith('apify_mock_') ||
    notes.includes('sandbox') ||
    notes.includes('mock') ||
    notes.includes('real scraper failed')
  );
}

export function deduplicateLeads<T extends Partial<Lead>>(leads: T[]): T[] {
  if (!leads || leads.length === 0) return [];

  // Sort a copy by rating desc, then reviews_count desc to find the "best" version
  const sorted = [...leads].sort((a, b) => {
    const rA = a.rating || 0;
    const rB = b.rating || 0;
    if (rB !== rA) return rB - rA;
    const revA = a.reviews_count || 0;
    const revB = b.reviews_count || 0;
    return revB - revA;
  });

  const idToKeptLead = new Map<string, T>();
  const emailKeyToKeptLead = new Map<string, T>();
  const phoneKeyToKeptLead = new Map<string, T>();

  const mergeLeadFields = (target: T, source: T) => {
    if (!target.email && source.email) target.email = source.email;
    if (!target.phone_e164 && source.phone_e164) target.phone_e164 = source.phone_e164;
    if (!target.phone_raw && source.phone_raw) target.phone_raw = source.phone_raw;
    if (!target.website && source.website) target.website = source.website;
    if (!target.social_links && source.social_links) target.social_links = source.social_links;
    if (!target.business_hours && source.business_hours) target.business_hours = source.business_hours;
    if (!target.reviews_data && source.reviews_data) target.reviews_data = source.reviews_data;
    if (!target.photos_data && source.photos_data) target.photos_data = source.photos_data;
    if (!target.services_data && source.services_data) target.services_data = source.services_data;
    if (!target.business_summary && source.business_summary) target.business_summary = source.business_summary;
    if (source.rating && (!target.rating || source.rating > target.rating)) target.rating = source.rating;
    if (source.reviews_count && (!target.reviews_count || source.reviews_count > target.reviews_count)) target.reviews_count = source.reviews_count;
    if (source.verified && !target.verified) target.verified = source.verified;
  };

  const finalLeads: T[] = [];

  for (const lead of sorted) {
    const leadId = lead.lead_id || '';
    if (!leadId) continue;

    const nameNorm = (lead.name || '').trim().toLowerCase();
    const emailNorm = (lead.email || '').trim().toLowerCase();
    
    const phoneRaw = lead.phone_e164 || lead.phone_raw || '';
    const phoneNorm = phoneRaw.replace(/\D/g, '');

    const emailKey = emailNorm ? `${nameNorm}|${emailNorm}` : '';
    const phoneKey = phoneNorm ? `${nameNorm}|${phoneNorm}` : '';

    // Check if we already kept a lead matching this ID, email key, or phone key
    let existingKept = idToKeptLead.get(leadId);
    if (!existingKept && emailKey) {
      existingKept = emailKeyToKeptLead.get(emailKey);
    }
    if (!existingKept && phoneKey) {
      existingKept = phoneKeyToKeptLead.get(phoneKey);
    }

    if (existingKept) {
      // Merge duplicate fields into the existing kept lead
      mergeLeadFields(existingKept, lead);
    } else {
      // Keep this lead
      const copy = { ...lead };
      finalLeads.push(copy);
      idToKeptLead.set(leadId, copy);
      if (emailKey) emailKeyToKeptLead.set(emailKey, copy);
      if (phoneKey) phoneKeyToKeptLead.set(phoneKey, copy);
    }
  }

  // To preserve the original order of the unique items from the input list,
  // we filter the original array to only include the ones that match our kept copies
  const seenIds = new Set<string>();
  const result: T[] = [];
  for (const orig of leads) {
    const id = orig.lead_id || '';
    if (id && idToKeptLead.has(id) && !seenIds.has(id)) {
      seenIds.add(id);
      const kept = idToKeptLead.get(id)!;
      result.push(kept);
    }
  }
  return result;
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

export function normalizeLogStatus(status: string): 'START' | 'INFO' | 'WARN' | 'SUCCESS' | 'ERROR' {
  let clean = (status || '').toUpperCase().trim();
  if (clean === 'WARNING') return 'WARN';
  if (['START', 'INFO', 'WARN', 'SUCCESS', 'ERROR'].includes(clean)) {
    return clean as any;
  }
  return 'INFO';
}


const COLUMNS = [
  'lead_id', 'source', 'name', 'category', 'address', 'area', 'city', 
  'phone_e164', 'phone_raw', 'email', 'website', 'rating', 'reviews_count', 
  'verified', 'listings_count', 'profile_url', 'source_query_or_seed', 
  'collected_at', 'status', 'last_contacted_at', 'duplicate_of_lead_id', 
  'business_summary', 'notes',
  'business_hours', 'reviews_data', 'photos_data', 'social_links', 'services_data',
  'cms_platform', 'upgrade_strategy', 'cms_confidence', 'plugin_suggestions', 'embed_note'
];

// ============================================================================
// Lead Name Validation (BUG 3)
// ============================================================================

const INVALID_LEAD_NAMES = new Set([
  'instagram', 'facebook', 'tiktok', 'twitter', 'x', 'linkedin',
  'whatsapp', 'snapchat', 'youtube', 'pinterest', 'reddit',
  'telegram', 'wechat', 'discord', 'threads', 'tumblr',
  'test', 'test lead', 'test lead insert', 'sample', 'demo',
  'n/a', 'na', 'none', 'null', 'undefined', 'unknown',
]);

export function isValidLeadName(name: string | undefined | null): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  // Reject if under 3 characters
  if (trimmed.length < 3) return false;
  // Reject if it contains '@' (social handle format)
  if (trimmed.includes('@')) return false;
  // Reject if it matches a social media platform or test string (case-insensitive)
  if (INVALID_LEAD_NAMES.has(trimmed.toLowerCase())) return false;
  // Reject if it contains 'test lead' (case-insensitive)
  if (trimmed.toLowerCase().includes('test lead')) return false;
  // Reject if it looks like a URL
  if (/^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed)) return false;
  // Reject if purely numeric
  if (/^\d+$/.test(trimmed)) return false;
  return true;
}

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
const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

import { readJsonFileAsyncWithRetry, writeJsonFileAsyncAtomic } from './atomicIo';

import { getWorkerIndex } from './requestContext';

function getDbFilePath(fileName: string): string {
  const workerIndex = getWorkerIndex();

  const nameParts = fileName.split('.');
  const baseName = workerIndex 
    ? `${nameParts[0]}.worker-${workerIndex}.${nameParts[1]}` 
    : fileName;

  const BUNDLE_DB_DIR = path.join(process.cwd(), 'local_db');
  const WRITEABLE_DB_DIR = isServerless ? path.join('/tmp', 'local_db') : BUNDLE_DB_DIR;

  // Ensure writeable db folder exists
  try {
    if (!fs.existsSync(WRITEABLE_DB_DIR)) {
      fs.mkdirSync(WRITEABLE_DB_DIR, { recursive: true });
    }
  } catch (e) {
    console.warn('Could not create WRITEABLE_DB_DIR:', e);
  }

  return path.join(WRITEABLE_DB_DIR, baseName);
}

const LEADS_FILE = 'leads_db.json';
const DNC_FILE = 'dnc_db.json';
const LOGS_FILE = 'logs_db.json';

async function readJsonFile<T>(fileName: string, defaultValue: T): Promise<T> {
  const filePath = getDbFilePath(fileName);
  const bundlePath = path.join(path.join(process.cwd(), 'local_db'), fileName);

  try {
    let targetPath = filePath;
    // Copy base db if worker-specific file doesn't exist
    if (filePath !== bundlePath && !fs.existsSync(filePath) && fs.existsSync(bundlePath)) {
      try {
        fs.copyFileSync(bundlePath, filePath);
      } catch (err) {
        console.error(`Error copying base DB ${fileName} to worker path:`, err);
      }
    }

    if (!fs.existsSync(targetPath)) {
      return defaultValue;
    }
    return await readJsonFileAsyncWithRetry<T>(targetPath, defaultValue);
  } catch (err) {
    console.error(`Error reading file ${fileName}:`, err);
    return defaultValue;
  }
}

async function writeJsonFile<T>(fileName: string, data: T): Promise<void> {
  const filePath = getDbFilePath(fileName);
  await writeJsonFileAsyncAtomic<T>(filePath, data);
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
  
  const trimmed = raw.trim();
  const isExplicitIntl = trimmed.startsWith('+') || trimmed.startsWith('00');
  
  // Strip non-numeric digits
  let digits = trimmed.replace(/\D/g, '');
  
  if (isExplicitIntl) {
    if (trimmed.startsWith('00')) {
      digits = digits.substring(2); // remove the leading '00'
    }
  } else if (country === 'NG') {
    if (digits.startsWith('2340')) {
      digits = '234' + digits.substring(4);
    } else if (digits.startsWith('0')) {
      digits = '234' + digits.substring(1);
    } else if (digits.length === 10 && ['7', '8', '9'].includes(digits[0])) {
      digits = '234' + digits;
    }
  }
  
  if (options?.strict) {
    if (digits.length < 9 || digits.length > 15) {
      return null;
    }
  } else {
    if (digits.length < 7) return null;
  }
  
  return '+' + digits;
}

export function extractPhonesFromText(text: string): string[] {
  if (!text) return [];
  // Match candidate number blocks: sequences of digits, spaces, hyphens, parentheses, plus sign.
  // Needs to contain at least 7 digits to avoid matching small numbers.
  const candidateRegex = /\+?[\d\s\-\(\)]{8,25}/g;
  const matches = text.match(candidateRegex) || [];
  const phones: string[] = [];
  
  for (const m of matches) {
    // Strip everything except digits
    const digits = m.replace(/\D/g, '');
    
    // Check if m originally starts with a plus (or 00) for international formats
    const trimmed = m.trim();
    const isExplicitInternational = trimmed.startsWith('+') || trimmed.startsWith('00');
    
    // 1. Explicit international format (e.g., +15551234567, +447911123456)
    if (isExplicitInternational && digits.length >= 9 && digits.length <= 15) {
      const cleanDigits = trimmed.startsWith('00') ? digits.substring(2) : digits;
      phones.push('+' + cleanDigits);
    }
    // 2. Nigerian Mobile patterns:
    // It should start with 234 followed by 70, 80, 81, 90, 91 (length 13)
    // Or start with 0 followed by 70, 80, 81, 90, 91 (length 11)
    // Or just be 10 digits starting with 70, 80, 81, 90, 91 (without leading 0)
    else if (digits.length === 13 && digits.startsWith('234') && ['7', '8', '9'].includes(digits[3])) {
      phones.push('+' + digits);
    } else if (digits.length === 11 && digits.startsWith('0') && ['7', '8', '9'].includes(digits[1])) {
      phones.push('+234' + digits.substring(1));
    } else if (digits.length === 10 && ['7', '8', '9'].includes(digits[0])) {
      phones.push('+234' + digits);
    }
    // 3. Nigerian Landline patterns (e.g. Lagos 01-xxx-xxxx, Abuja 09-xxx-xxxx):
    // Starts with 01 (length 9) or 09 (length 9) or 2341 (length 11) or 2349 (length 11)
    else if (digits.length === 9 && (digits.startsWith('01') || digits.startsWith('09'))) {
      phones.push('+234' + digits.substring(1));
    } else if (digits.length === 11 && (digits.startsWith('2341') || digits.startsWith('2349'))) {
      phones.push('+' + digits);
    }
  }
  return Array.from(new Set(phones)); // deduplicate
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

export async function getSheetsInstance() {
  const rootDir = process.cwd();
  const credentialsPath = path.join(rootDir, 'credentials.json');
  const config = getRuntimeConfig();

  // BUG 4: Try OAuth2 user credentials first (from Google Sign-In flow)
  if (config.googleClientId && config.googleClientSecret && config.googleRefreshToken) {
    try {
      const { saveLocalConfig } = await import('./localConfig');
      const oauth2Client = new google.auth.OAuth2(
        config.googleClientId,
        config.googleClientSecret,
        // redirect_uri is not needed for token refresh
      );

      oauth2Client.setCredentials({
        access_token: config.googleAccessToken || undefined,
        refresh_token: config.googleRefreshToken,
        expiry_date: config.googleTokenExpiry || undefined,
      });

      // Check if token is expired or about to expire (within 5 minutes)
      const now = Date.now();
      const isExpired = !config.googleAccessToken || !config.googleTokenExpiry || config.googleTokenExpiry < now + 5 * 60 * 1000;

      if (isExpired) {
        console.log('[getSheetsInstance] OAuth token expired or missing, refreshing...');
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);

        // Persist the refreshed tokens
        try {
          await saveLocalConfig({
            googleAccessToken: credentials.access_token || '',
            googleTokenExpiry: credentials.expiry_date || 0,
          });
          console.log('[getSheetsInstance] OAuth tokens refreshed and saved.');
        } catch (saveErr) {
          console.warn('[getSheetsInstance] Failed to persist refreshed tokens:', saveErr);
        }
      }

      return google.sheets({ version: 'v4', auth: oauth2Client as any });
    } catch (oauthErr) {
      console.warn('[getSheetsInstance] OAuth2 user auth failed, falling back to service account:', oauthErr);
    }
  }

  // Fallback: Service account credentials
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
      throw new Error("Missing Google credentials. Configure OAuth sign-in or supply service account credentials.");
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

  // Attach camelCase versions
  if (lead.cms_platform) lead.cmsPlatform = lead.cms_platform;
  if (lead.upgrade_strategy) lead.upgradeStrategy = lead.upgrade_strategy;
  if (lead.cms_confidence) lead.cmsConfidence = lead.cms_confidence;
  if (lead.plugin_suggestions) {
    try {
      lead.pluginSuggestions = JSON.parse(lead.plugin_suggestions);
    } catch (_) {
      lead.pluginSuggestions = lead.plugin_suggestions.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }
  if (lead.embed_note) lead.embedNote = lead.embed_note;

  lead.isMock = isMockLead(lead);
  return lead as Lead;
}

function leadToRow(lead: Partial<Lead>): any[] {
  const cms_platform = lead.cms_platform || lead.cmsPlatform || '';
  const upgrade_strategy = lead.upgrade_strategy || lead.upgradeStrategy || '';
  const cms_confidence = lead.cms_confidence || lead.cmsConfidence || '';
  
  let plugin_suggestions = '';
  if (lead.plugin_suggestions) {
    plugin_suggestions = Array.isArray(lead.plugin_suggestions) 
      ? JSON.stringify(lead.plugin_suggestions) 
      : String(lead.plugin_suggestions);
  } else if (lead.pluginSuggestions) {
    plugin_suggestions = JSON.stringify(lead.pluginSuggestions);
  }
  
  const embed_note = lead.embed_note || lead.embedNote || '';

  const fullLead = {
    ...lead,
    cms_platform,
    upgrade_strategy,
    cms_confidence,
    plugin_suggestions,
    embed_note
  };

  return COLUMNS.map(col => {
    const val = (fullLead as any)[col];
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
  updateLeadFields(leadId: string, fields: Partial<Lead>): Promise<boolean>;
  getTopReviewedLeads(limit?: number): Promise<Lead[]>;
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
  /**
   * Get top reviewed leads sorted by rating then reviews count.
   * @param limit Number of leads to return (default 20)
   */
  async getTopReviewedLeads(limit: number = 20): Promise<Lead[]> {
    const leads = await this.getLeads();
    const uniqueLeads = deduplicateLeads(leads);
    return uniqueLeads
      .sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviews_count - a.reviews_count;
      })
      .slice(0, limit);
  }
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
      const existingNameEmails = new Set(
        existingLeads
          .filter(l => l.email)
          .map(l => `${(l.name || '').trim().toLowerCase()}|${(l.email || '').trim().toLowerCase()}`)
      );
      
      const toAppend: any[][] = [];
      let skipped = 0;
      
      for (const lead of newLeads) {
        if (!lead.lead_id) continue;

        // Filter out invalid names
        if (!isValidLeadName(lead.name)) {
          skipped++;
          continue;
        }
        
        const normPhone = lead.phone_e164 ? (normalizePhone(lead.phone_e164) || '') : '';

        // Filter out leads with absolutely no contact info
        if (!normPhone && !lead.email && !lead.website) {
          skipped++;
          continue;
        }

        const nameEmailKey = lead.email ? `${(lead.name || '').trim().toLowerCase()}|${(lead.email || '').trim().toLowerCase()}` : '';
        
        const isDup = 
          existingIds.has(lead.lead_id) || 
          (normPhone && existingPhones.has(normPhone)) ||
          (lead.profile_url && existingUrls.has(lead.profile_url)) ||
          (nameEmailKey && existingNameEmails.has(nameEmailKey));
          
        if (isDup) {
          skipped++;
        } else {
          lead.phone_e164 = normPhone || lead.phone_e164 || '';
          toAppend.push(leadToRow(lead));
          existingIds.add(lead.lead_id);
          if (normPhone) existingPhones.add(normPhone);
          if (lead.profile_url) existingUrls.add(lead.profile_url);
          if (nameEmailKey) existingNameEmails.add(nameEmailKey);
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

  async updateLeadFields(leadId: string, fields: Partial<Lead>): Promise<boolean> {
    // Google Sheets doesn't support complex JSON fields, return false or no-op
    return false;
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
          values: [[runId, new Date().toISOString(), step, '', normalizeLogStatus(status), msg]],
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
  /**
   * Get top reviewed leads from local JSON store.
   */
  async getTopReviewedLeads(limit: number = 20): Promise<Lead[]> {
    const leads = await this.getLeads();
    const uniqueLeads = deduplicateLeads(leads);
    return uniqueLeads
      .sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviews_count - a.reviews_count;
      })
      .slice(0, limit);
  }
  async getLeads(): Promise<Lead[]> {
    const leads = await readJsonFile<Lead[]>(LEADS_FILE, []);
    return leads.map(l => ({ ...l, isMock: isMockLead(l) }));
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
      const existingNameEmails = new Set(
        leads
          .filter(l => l.email)
          .map(l => `${(l.name || '').trim().toLowerCase()}|${(l.email || '').trim().toLowerCase()}`)
      );
      
      const addedLeads: Lead[] = [];
      let skipped = 0;
      
      for (const partial of newLeads) {
        if (!partial.lead_id) continue;

        // Filter out invalid names
        if (!isValidLeadName(partial.name)) {
          skipped++;
          continue;
        }
        
        const normPhone = partial.phone_e164 ? (normalizePhone(partial.phone_e164) || '') : '';

        // Filter out leads with absolutely no contact info
        if (!normPhone && !partial.email && !partial.website) {
          skipped++;
          continue;
        }

        const nameEmailKey = partial.email ? `${(partial.name || '').trim().toLowerCase()}|${(partial.email || '').trim().toLowerCase()}` : '';
        
        const isDup = 
          existingIds.has(partial.lead_id) || 
          (normPhone && existingPhones.has(normPhone)) ||
          (partial.profile_url && existingUrls.has(partial.profile_url)) ||
          (nameEmailKey && existingNameEmails.has(nameEmailKey));
          
        if (isDup) {
          // Merge missing fields into the existing record in memory
          const existing = leads.find(l => 
            l.lead_id === partial.lead_id || 
            (normPhone && l.phone_e164 === normPhone) ||
            (partial.profile_url && l.profile_url === partial.profile_url)
          );

          if (existing) {
            let updated = false;
            if (!existing.email && partial.email) { existing.email = partial.email; updated = true; }
            if (!existing.phone_e164 && partial.phone_e164) { existing.phone_e164 = partial.phone_e164; updated = true; }
            if (!existing.phone_raw && partial.phone_raw) { existing.phone_raw = partial.phone_raw; updated = true; }
            if (!existing.website && partial.website) { existing.website = partial.website; updated = true; }
            if (!existing.social_links && partial.social_links) { existing.social_links = partial.social_links; updated = true; }
            if (!existing.business_hours && partial.business_hours) { existing.business_hours = partial.business_hours; updated = true; }
            if (!existing.reviews_data && partial.reviews_data) { existing.reviews_data = partial.reviews_data; updated = true; }
            if (!existing.photos_data && partial.photos_data) { existing.photos_data = partial.photos_data; updated = true; }
            if (!existing.services_data && partial.services_data) { existing.services_data = partial.services_data; updated = true; }
            
            if (updated) {
              if (existing.phone_e164) existingPhones.add(existing.phone_e164);
              if (existing.profile_url) existingUrls.add(existing.profile_url);
            }
          }
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
            notes: partial.notes || '',
            business_hours: partial.business_hours || '',
            reviews_data: partial.reviews_data || '',
            photos_data: partial.photos_data || '',
            social_links: partial.social_links || '',
            services_data: partial.services_data || ''
          };
          
          addedLeads.push(completeLead);
          existingIds.add(completeLead.lead_id);
          if (normPhone) existingPhones.add(normPhone);
          if (completeLead.profile_url) existingUrls.add(completeLead.profile_url);
          if (nameEmailKey) existingNameEmails.add(nameEmailKey);
        }
      }
      
      // Since some existing records in 'leads' may have been modified (merged),
      // we must save the entire leads array (which includes addedLeads if length > 0)
      if (addedLeads.length > 0 || skipped > 0) {
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

  async updateLeadFields(leadId: string, fields: Partial<Lead>): Promise<boolean> {
    return dbQueue.enqueue(async () => {
      const leads = await this.getLeads();
      const index = leads.findIndex(l => l.lead_id === leadId);
      if (index === -1) return false;
      
      leads[index] = {
        ...leads[index],
        ...fields
      };
      
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
        status: normalizeLogStatus(status),
        message: msg
      };
      await writeJsonFile<LogEntry[]>(LOGS_FILE, [...logs, newEntry]);
    });
  }
}

// ----------------------------------------------------------------------------
// Supabase Database Drivers
// ----------------------------------------------------------------------------

function restoreLead(dbLead: any): Lead {
  if (!dbLead) return dbLead;
  const restored = { ...dbLead };
  
  restored.generated_copy = dbLead.generated_copy;
  restored.design_theme = dbLead.design_theme;
  restored.overrides = dbLead.overrides;
  restored.email_verified = dbLead.email_verified;

  // Map website modernization properties
  restored.cms_platform = dbLead.cms_platform;
  restored.upgrade_strategy = dbLead.upgrade_strategy;
  restored.cms_confidence = dbLead.cms_confidence;
  restored.plugin_suggestions = dbLead.plugin_suggestions;
  restored.embed_note = dbLead.embed_note;

  if (dbLead.cms_platform) restored.cmsPlatform = dbLead.cms_platform;
  if (dbLead.upgrade_strategy) restored.upgradeStrategy = dbLead.upgrade_strategy;
  if (dbLead.cms_confidence) restored.cmsConfidence = dbLead.cms_confidence;
  if (dbLead.plugin_suggestions) {
    try {
      restored.pluginSuggestions = typeof dbLead.plugin_suggestions === 'string' 
        ? JSON.parse(dbLead.plugin_suggestions) 
        : dbLead.plugin_suggestions;
    } catch (_) {
      restored.pluginSuggestions = String(dbLead.plugin_suggestions).split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }
  if (dbLead.embed_note) restored.embedNote = dbLead.embed_note;

  const notes = dbLead.notes || '';
  if (notes.startsWith('[source:')) {
    const endIdx = notes.indexOf(']');
    if (endIdx !== -1) {
      const src = notes.substring(8, endIdx);
      restored.source = src;
      restored.notes = notes.substring(endIdx + 1);
    }
  } else {
    // Fallback deduction based on profile_url or lead_id if no prefix is present:
    let source = dbLead.source;
    const profileUrl = (dbLead.profile_url || '').toLowerCase();
    const leadId = (dbLead.lead_id || '').toLowerCase();
    
    if (profileUrl.includes('duckduckgo.com')) source = 'DUCKDUCKGO';
    else if (profileUrl.includes('openstreetmap.org') || profileUrl.includes('overpass-api')) source = 'OSM';
    else if (profileUrl.includes('instagram.com')) source = 'INSTAGRAM';
    else if (profileUrl.includes('facebook.com')) source = 'FACEBOOK';
    else if (profileUrl.includes('tiktok.com')) source = 'TIKTOK';
    else if (profileUrl.includes('linkedin.com')) source = 'LINKEDIN';
    else if (leadId.includes('mapsfree') || leadId.includes('maps_free')) source = 'MAPS_FREE';
    else if (leadId.includes('osm')) source = 'OSM';
    else if (leadId.includes('jiji')) source = 'JIJI';
    else if (leadId.includes('ddg') || leadId.includes('duckduckgo')) source = 'DUCKDUCKGO';
    
    restored.source = source;
  }
  
  restored.isMock = isMockLead(restored);
  return restored as Lead;
}

class SupabaseLeadRepository implements ILeadRepository {
  private fallback = new LocalJsonLeadRepository();

  async getTopReviewedLeads(limit: number = 20): Promise<Lead[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('leads')
        .select('*');
      if (error) throw error;
      const leads = (data || []).map(restoreLead) as Lead[];
      const uniqueLeads = deduplicateLeads(leads);
      return uniqueLeads
        .sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return b.reviews_count - a.reviews_count;
        })
        .slice(0, limit);
    } catch (e: any) {
      console.warn('Supabase getTopReviewedLeads error, falling back to local JSON:', e.message);
      return this.fallback.getTopReviewedLeads(limit);
    }
  }

  async getLeads(): Promise<Lead[]> {
    try {
      const supabase = getSupabaseClient();
      let allData: any[] = [];
      let from = 0;
      const step = 1000;

      while (true) {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .range(from, from + step - 1)
          .order('collected_at', { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) break;
        allData = allData.concat(data);
        if (data.length < step) break;
        from += step;
      }

      return allData.map(restoreLead) as Lead[];
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
      if (!data) return null;
      return restoreLead(data) as Lead;
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

        // Filter out invalid names
        if (!isValidLeadName(lead.name)) {
          skipped++;
          continue;
        }
        
        const normPhone = lead.phone_e164 ? (normalizePhone(lead.phone_e164) || '') : '';

        // Filter out leads with absolutely no contact info
        if (!normPhone && !lead.email && !lead.website) {
          skipped++;
          continue;
        }
        
        const isDup = 
          existingIds.has(lead.lead_id) || 
          (normPhone && existingPhones.has(normPhone)) ||
          (lead.profile_url && existingUrls.has(lead.profile_url));

        if (isDup) {
          // Merge missing fields into the existing record in Supabase
          const existing = existingLeads.find(l => 
            l.lead_id === lead.lead_id || 
            (normPhone && l.phone_e164 === normPhone) ||
            (lead.profile_url && l.profile_url === lead.profile_url)
          );

          if (existing) {
            const updates: Partial<Lead> = {};
            if (!existing.email && lead.email) updates.email = lead.email;
            if (!existing.phone_e164 && lead.phone_e164) {
              updates.phone_e164 = lead.phone_e164;
              updates.phone_raw = lead.phone_raw || lead.phone_e164;
            }
            if (!existing.website && lead.website) updates.website = lead.website;
            if (!existing.social_links && lead.social_links) updates.social_links = lead.social_links;
            if (!existing.business_hours && lead.business_hours) updates.business_hours = lead.business_hours;
            if (!existing.reviews_data && lead.reviews_data) updates.reviews_data = lead.reviews_data;
            if (!existing.photos_data && lead.photos_data) updates.photos_data = lead.photos_data;
            if (!existing.services_data && lead.services_data) updates.services_data = lead.services_data;
            if (!existing.cms_platform && (lead.cms_platform || lead.cmsPlatform)) updates.cms_platform = lead.cms_platform || lead.cmsPlatform;
            if (!existing.upgrade_strategy && (lead.upgrade_strategy || lead.upgradeStrategy)) updates.upgrade_strategy = lead.upgrade_strategy || lead.upgradeStrategy;
            if (!existing.cms_confidence && (lead.cms_confidence || lead.cmsConfidence)) updates.cms_confidence = lead.cms_confidence || lead.cmsConfidence;
            if (!existing.plugin_suggestions && (lead.plugin_suggestions || lead.pluginSuggestions)) {
              updates.plugin_suggestions = lead.plugin_suggestions 
                ? (Array.isArray(lead.plugin_suggestions) ? JSON.stringify(lead.plugin_suggestions) : String(lead.plugin_suggestions))
                : (lead.pluginSuggestions ? JSON.stringify(lead.pluginSuggestions) : '');
            }
            if (!existing.embed_note && (lead.embed_note || lead.embedNote)) updates.embed_note = lead.embed_note || lead.embedNote;

            if (Object.keys(updates).length > 0) {
              const { error: updateErr } = await supabase
                .from('leads')
                .update(updates)
                .eq('lead_id', existing.lead_id);
              if (!updateErr) {
                Object.assign(existing, updates);
                if (existing.phone_e164) existingPhones.add(existing.phone_e164);
                if (existing.profile_url) existingUrls.add(existing.profile_url);
              }
            }
          }
          skipped++;
        } else {
          lead.phone_e164 = normPhone || lead.phone_e164 || '';
          
          const originalSource = lead.source || 'GOOGLE';
          const mappedSource = ['JIJI', 'INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'LINKEDIN'].includes(originalSource) ? 'JIJI' : 'GOOGLE';
          const prefixedNotes = `[source:${originalSource}]${lead.notes || ''}`;

          let extraNotes = prefixedNotes;
          if (lead.cms_platform || lead.cmsPlatform) extraNotes += ` | CMS: ${lead.cms_platform || lead.cmsPlatform}`;
          if (lead.upgrade_strategy || lead.upgradeStrategy) extraNotes += ` | Strategy: ${lead.upgrade_strategy || lead.upgradeStrategy}`;
          if (lead.social_links) extraNotes += ` | Socials: ${lead.social_links}`;
          if (lead.business_hours) extraNotes += ` | Hours: ${lead.business_hours}`;

          toInsert.push({
            lead_id: lead.lead_id,
            source: mappedSource,
            name: lead.name,
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
            notes: extraNotes
          });

          existingIds.add(lead.lead_id);
          if (normPhone) existingPhones.add(normPhone);
          if (lead.profile_url) existingUrls.add(lead.profile_url);
        }
      }

      if (toInsert.length > 0) {
        const { error } = await supabase.from('leads').insert(toInsert);
        if (error) throw error;

        // Dual-write solar leads to SolarQuotePro DB asynchronously
        const solarItems = toInsert.filter(item => {
          const txt = `${item.category || ''} ${item.source_query_or_seed || ''} ${item.notes || ''} ${item.name || ''}`.toLowerCase();
          return txt.includes('solar') || txt.includes('inverter') || txt.includes('clean energy');
        }).map(item => ({
          lead_id: item.lead_id,
          source: item.source || 'GOOGLE',
          name: item.name || 'Solar Business',
          business_name: item.business_name || item.name || 'Solar Business',
          category: item.category || 'solar_installer',
          address: item.address || '',
          city: item.city || '',
          phone: item.phone_e164 || item.phone_raw || '',
          phone_e164: item.phone_e164 || '',
          email: item.email || '',
          website: item.website || '',
          rating: item.rating || 4.5,
          reviews_count: item.reviews_count || 10,
          verified: !!item.verified,
          source_query_or_seed: item.source_query_or_seed || 'solar_nigeria_5k',
          status: item.status || 'NEW',
          notes: item.notes || ''
        }));

        if (solarItems.length > 0) {
          try {
            const sqUrl = process.env.SOLARQUOTEPRO_SUPABASE_URL || 'https://pnsrjsyiygxdcxkpgbzx.supabase.co';
            const sqKey = process.env.SOLARQUOTEPRO_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8';
            const { createClient } = await import('@supabase/supabase-js');
            const sqClient = createClient(sqUrl, sqKey, { auth: { persistSession: false } });
            const { error: sqErr } = await sqClient.from('leads').upsert(solarItems, { onConflict: 'lead_id', ignoreDuplicates: true });
            if (sqErr) {
              console.warn('[Dual-Write SolarQuotePro Warning]:', sqErr.message);
            }
          } catch (_) {}
        }
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
      
      if (notes !== undefined) {
        // Fetch current notes to see if there is a [source:...] prefix we need to preserve
        let prefix = '';
        const { data: currentLead } = await supabase
          .from('leads')
          .select('notes')
          .eq('lead_id', leadId)
          .single();
        if (currentLead && currentLead.notes && currentLead.notes.startsWith('[source:')) {
          const endIdx = currentLead.notes.indexOf(']');
          if (endIdx !== -1) {
            prefix = currentLead.notes.substring(0, endIdx + 1);
          }
        }
        
        if (prefix && !notes.startsWith(prefix)) {
          updates.notes = prefix + notes;
        } else {
          updates.notes = notes;
        }
      }
      
      if (lastContactedAt !== undefined) updates.last_contacted_at = lastContactedAt;

      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('lead_id', leadId)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Lead not found in Supabase');
      }
      return true;
    } catch (e: any) {
      console.warn('Supabase updateLeadStatus error, falling back to local JSON:', e.message);
      return this.fallback.updateLeadStatus(leadId, status, notes, lastContactedAt);
    }
  }

  async updateLeadFields(leadId: string, fields: Partial<Lead>): Promise<boolean> {
    try {
      const supabase = getSupabaseClient();
      const updates: any = {};
      
      if (fields.name !== undefined) updates.name = fields.name;
      if (fields.status !== undefined) updates.status = fields.status;
      if (fields.notes !== undefined) updates.notes = fields.notes;
      if (fields.email !== undefined) updates.email = fields.email;
      if (fields.phone_e164 !== undefined) updates.phone_e164 = fields.phone_e164;
      if (fields.website !== undefined) updates.website = fields.website;
      if (fields.generated_copy !== undefined) updates.generated_copy = fields.generated_copy;
      if (fields.design_theme !== undefined) updates.design_theme = fields.design_theme;
      if (fields.overrides !== undefined) updates.overrides = fields.overrides;
      if (fields.email_verified !== undefined) updates.email_verified = fields.email_verified;
      if (fields.last_contacted_at !== undefined) updates.last_contacted_at = fields.last_contacted_at;

      // Modernization fields
      if (fields.cms_platform !== undefined) updates.cms_platform = fields.cms_platform;
      if (fields.cmsPlatform !== undefined) updates.cms_platform = fields.cmsPlatform;
      if (fields.upgrade_strategy !== undefined) updates.upgrade_strategy = fields.upgrade_strategy;
      if (fields.upgradeStrategy !== undefined) updates.upgrade_strategy = fields.upgradeStrategy;
      if (fields.cms_confidence !== undefined) updates.cms_confidence = fields.cms_confidence;
      if (fields.cmsConfidence !== undefined) updates.cms_confidence = fields.cmsConfidence;
      if (fields.plugin_suggestions !== undefined) {
        updates.plugin_suggestions = Array.isArray(fields.plugin_suggestions) ? JSON.stringify(fields.plugin_suggestions) : String(fields.plugin_suggestions);
      }
      if (fields.pluginSuggestions !== undefined) {
        updates.plugin_suggestions = JSON.stringify(fields.pluginSuggestions);
      }
      if (fields.embed_note !== undefined) updates.embed_note = fields.embed_note;
      if (fields.embedNote !== undefined) updates.embed_note = fields.embedNote;

      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('lead_id', leadId)
        .select();
      if (error) throw error;
      return true;
    } catch (e: any) {
      console.warn('Supabase updateLeadFields error, falling back to local JSON:', e.message);
      return this.fallback.updateLeadFields(leadId, fields);
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
        .neq('step', 'heartbeat')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      const formatted = (data || []).map((row: any) => [
        row.run_id || 'WEB_APP',
        row.created_at || row.timestamp || new Date().toISOString(),
        row.step || 'Scraper',
        '',
        row.status || 'INFO',
        row.message || ''
      ]);
      return formatted;
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
          status: normalizeLogStatus(status),
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
  const leads = await getActiveLeadRepository().getLeads();
  const valid = leads.filter(l => isValidLeadName(l.name));
  return deduplicateLeads(valid);
}

export async function saveLeads(leads: Partial<Lead>[]): Promise<{ added: number; skipped: number }> {
  // BUG 3: Filter out leads with invalid business names before saving
  const validLeads = leads.filter(l => isValidLeadName(l.name));
  const rejected = leads.length - validLeads.length;
  if (rejected > 0) {
    console.log(`[saveLeads] Rejected ${rejected} leads with invalid names`);
  }
  
  // Reject leads that have absolutely no contact details (no phone, no email, no website)
  const completeLeads = validLeads.filter(l => l.phone_e164 || l.phone_raw || l.email || l.website);
  const incompleteCount = validLeads.length - completeLeads.length;
  if (incompleteCount > 0) {
    console.log(`[saveLeads] Rejected ${incompleteCount} leads with no phone, email, or website`);
  }

  const deduplicated = deduplicateLeads(completeLeads);
  return getActiveLeadRepository().saveLeads(deduplicated);
}

export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string, lastContactedAt?: string): Promise<boolean> {
  return getActiveLeadRepository().updateLeadStatus(leadId, status, notes, lastContactedAt);
}

export async function updateLeadFields(leadId: string, fields: Partial<Lead>): Promise<boolean> {
  return getActiveLeadRepository().updateLeadFields(leadId, fields);
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

  const uniqueLeadsMap = new Map<string, Lead>();
  const phoneDncSet = new Set(dnc.map(p => p.replace(/\D/g, '')));

  for (const lead of leads) {
    if (lead.duplicate_of_lead_id) {
      continue;
    }

    const normPhone = lead.phone_e164 ? lead.phone_e164.replace(/\D/g, '') : '';
    const normName = lead.name.toLowerCase().trim();

    let key = lead.lead_id;
    if (normPhone) {
      key = `phone:${normPhone}`;
    } else {
      key = `name:${normName}`;
    }

    if (uniqueLeadsMap.has(key)) {
      const existing = uniqueLeadsMap.get(key)!;
      if (lead.status !== 'NEW' && existing.status === 'NEW') {
        uniqueLeadsMap.set(key, lead);
      }
    } else {
      uniqueLeadsMap.set(key, lead);
    }
  }

  const deduplicatedLeads = Array.from(uniqueLeadsMap.values());

  const finalLeads = deduplicatedLeads.map(lead => {
    const normPhone = lead.phone_e164 ? lead.phone_e164.replace(/\D/g, '') : '';
    if (normPhone && phoneDncSet.has(normPhone)) {
      return { ...lead, status: 'DO_NOT_CONTACT' as LeadStatus };
    }
    return lead;
  });
  
  const stats = {
    totalLeads: finalLeads.length,
    newLeads: finalLeads.filter(l => l.status === 'NEW').length,
    contactedLeads: finalLeads.filter(l => l.status === 'CONTACTED').length,
    dncLeads: finalLeads.filter(l => l.status === 'DO_NOT_CONTACT').length,
    errorLeads: finalLeads.filter(l => l.status === 'ERROR').length,
    googleLeads: finalLeads.filter(l => l.source === 'GOOGLE').length,
    jijiLeads: finalLeads.filter(l => l.source === 'JIJI').length,
    mapsFreeLeads: finalLeads.filter(l => l.source === 'MAPS_FREE').length,
    duckduckgoLeads: finalLeads.filter(l => l.source === 'DUCKDUCKGO').length,
    osmLeads: finalLeads.filter(l => l.source === 'OSM').length,
    instagramLeads: finalLeads.filter(l => l.source === 'INSTAGRAM').length,
    facebookLeads: finalLeads.filter(l => l.source === 'FACEBOOK').length,
    tiktokLeads: finalLeads.filter(l => l.source === 'TIKTOK').length,
    linkedinLeads: finalLeads.filter(l => l.source === 'LINKEDIN').length,
    highRatingLeads: finalLeads.filter(l => l.rating >= 4.5).length,
    noReviewLeads: finalLeads.filter(l => l.reviews_count === 0).length,
  };
  
  return stats;
}
