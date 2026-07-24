import { createClient } from '@supabase/supabase-js';
import { getRuntimeConfig } from './localConfig';

const ACTIVE_SUPABASE_URL = 'https://pnsrjsyiygxdcxkpgbzx.supabase.co';
const ACTIVE_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8';

function isValidKeyForProject(keyStr: string | undefined): boolean {
  if (!keyStr || typeof keyStr !== 'string') return false;
  const trimmed = keyStr.trim();
  if (trimmed.length < 20 || trimmed === 'undefined' || trimmed === 'null') return false;
  try {
    const parts = trimmed.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      return payload.ref === 'pnsrjsyiygxdcxkpgbzx';
    }
  } catch (e) {}
  return false;
}

function getValidUrl(): string {
  const candidates = [process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_URL];
  for (const c of candidates) {
    if (c && typeof c === 'string' && c.trim().includes('pnsrjsyiygxdcxkpgbzx')) {
      return c.trim();
    }
  }
  return ACTIVE_SUPABASE_URL;
}

function getValidKey(): string {
  const candidates = [
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.SUPABASE_KEY
  ];
  for (const c of candidates) {
    if (c && isValidKeyForProject(c)) {
      return c.trim();
    }
  }
  return ACTIVE_SUPABASE_KEY;
}

let cachedClient: any = null;

export function getSupabaseClient() {
  if (!cachedClient) {
    cachedClient = createClient(getValidUrl(), getValidKey(), {
      auth: {
        persistSession: false,
      },
    });
  }
  return cachedClient;
}

export const supabase = new Proxy({} as any, {
  get(_target, prop, receiver) {
    const client = getSupabaseClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});

// ============================================================================
// Scrape Jobs CRUD Helpers with Local Fallback
// ============================================================================

import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

export type ScrapeJobType = 'jiji' | 'google' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'maps-free' | 'duckduckgo' | 'osm' | 'apify' | string;
export type ScrapeJobStatus = 'queued' | 'running' | 'completed' | 'failed';

export interface ScrapeJob {
  id: string;
  type: ScrapeJobType;
  status: ScrapeJobStatus;
  payload: any; // JSON payload sent by client
  result?: any; // scraper output when finished
  error_message?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

// Fallback JSON database file paths
const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';

import { getWorkerIndex } from './requestContext';

function getJobsFilePath(fileName: string): string {
  const workerIndex = getWorkerIndex();

  const nameParts = fileName.split('.');
  const baseName = workerIndex 
    ? `${nameParts[0]}.worker-${workerIndex}.${nameParts[1]}` 
    : fileName;

  return isServerless
    ? path.join('/tmp', baseName)
    : path.join(process.cwd(), 'local_db', baseName);
}

const fallbackJobsInMemory: Record<string, ScrapeJob> = {};

function readFallbackJobs(): Record<string, ScrapeJob> {
  try {
    const filePath = getJobsFilePath('scrape_jobs.json');
    const bundlePath = path.join(process.cwd(), 'local_db', 'scrape_jobs.json');

    // Copy base jobs if worker-specific file doesn't exist
    if (filePath !== bundlePath && !fs.existsSync(filePath) && fs.existsSync(bundlePath)) {
      try {
        fs.copyFileSync(bundlePath, filePath);
      } catch (err) {
        console.error('Error copying base scrape_jobs to worker path:', err);
      }
    }

    return readJsonFileSyncWithRetry<Record<string, ScrapeJob>>(filePath, {});
  } catch (e) {
    console.error('Error reading fallback jobs:', e);
  }
  return {};
}

function writeFallbackJobs(jobs: Record<string, ScrapeJob>) {
  try {
    const filePath = getJobsFilePath('scrape_jobs.json');
    writeJsonFileSyncAtomic(filePath, jobs);
  } catch (e) {
    console.error('Error writing fallback jobs:', e);
  }
}

function saveFallbackJob(job: ScrapeJob) {
  const jobs = readFallbackJobs();
  jobs[job.id] = job;
  writeFallbackJobs(jobs);
}

function getFallbackJob(id: string): ScrapeJob | null {
  const jobs = readFallbackJobs();
  if (jobs[id]) {
    return jobs[id];
  }
  return null;
}

function removeFallbackJob(id: string) {
  const jobs = readFallbackJobs();
  if (jobs[id]) {
    delete jobs[id];
    writeFallbackJobs(jobs);
  }
}

function isTableMissingError(error: any): boolean {
  if (!error) return false;
  const msg = String(error.message || '').toLowerCase();
  const code = String(error.code || '');
  return code === '42P01' || msg.includes('schema cache') || msg.includes('does not exist');
}

/** Create a new scraper job */
export async function createScrapeJob(
  type: ScrapeJobType,
  payload: any,
  userId?: string
): Promise<ScrapeJob> {
  const jobId = randomUUID();
  const newJob: ScrapeJob = {
    id: jobId,
    type,
    status: 'queued',
    payload,
    user_id: userId || undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const config = getRuntimeConfig();
  if (!supabase || config.storageMode === 'local') {
    saveFallbackJob(newJob);
    return newJob;
  }

  try {
    const { data, error } = await supabase.from('scrape_jobs').insert([
      {
        id: jobId,
        type,
        status: 'queued',
        payload,
        user_id: userId || null,
      },
    ]).select().single();

    if (error) {
      if (isTableMissingError(error)) {
        console.warn('Supabase table "scrape_jobs" not found. Falling back to local file/memory storage.');
        saveFallbackJob(newJob);
        return newJob;
      }
      throw error;
    }
    return data as ScrapeJob;
  } catch (err: any) {
    if (isTableMissingError(err)) {
      saveFallbackJob(newJob);
      return newJob;
    }
    throw err;
  }
}

/** Retrieve a job by its ID */
export async function getScrapeJob(id: string): Promise<ScrapeJob | null> {
  const config = getRuntimeConfig();
  if (!supabase || config.storageMode === 'local') {
    return getFallbackJob(id);
  }

  try {
    const { data, error } = await supabase
      .from('scrape_jobs')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      if (isTableMissingError(error)) {
        return getFallbackJob(id);
      }
      if (error.code !== 'PGRST116') throw error; // row not found is ok
    }
    return data as ScrapeJob | null;
  } catch (err: any) {
    if (isTableMissingError(err)) {
      return getFallbackJob(id);
    }
    throw err;
  }
}

/** Update status (and optional result/error) */
export async function updateScrapeJobStatus(
  id: string,
  status: ScrapeJobStatus,
  updates?: Partial<Pick<ScrapeJob, 'result' | 'error_message'>>
): Promise<ScrapeJob> {
  const updatePayload = { status, ...updates, updated_at: new Date().toISOString() };

  const config = getRuntimeConfig();
  if (!supabase || config.storageMode === 'local') {
    const job = getFallbackJob(id);
    if (!job) throw new Error(`Job not found: ${id}`);
    const updatedJob = { ...job, ...updatePayload };
    saveFallbackJob(updatedJob);
    return updatedJob;
  }

  try {
    const { data, error } = await supabase
      .from('scrape_jobs')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      if (isTableMissingError(error)) {
        const job = getFallbackJob(id);
        if (!job) throw new Error(`Job not found: ${id}`);
        const updatedJob = { ...job, ...updatePayload };
        saveFallbackJob(updatedJob);
        return updatedJob;
      }
      throw error;
    }
    return data as ScrapeJob;
  } catch (err: any) {
    if (isTableMissingError(err)) {
      const job = getFallbackJob(id);
      if (!job) throw new Error(`Job not found: ${id}`);
      const updatedJob = { ...job, ...updatePayload };
      saveFallbackJob(updatedJob);
      return updatedJob;
    }
    throw err;
  }
}

/** Delete a job (admin only) */
export async function deleteScrapeJob(id: string): Promise<void> {
  const config = getRuntimeConfig();
  if (!supabase || config.storageMode === 'local') {
    removeFallbackJob(id);
    return;
  }

  try {
    const { error } = await supabase.from('scrape_jobs').delete().eq('id', id);
    if (error) {
      if (isTableMissingError(error)) {
        removeFallbackJob(id);
        return;
      }
      throw error;
    }
  } catch (err: any) {
    if (isTableMissingError(err)) {
      removeFallbackJob(id);
      return;
    }
    throw err;
  }
}

