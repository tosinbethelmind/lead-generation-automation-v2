import { createClient } from '@supabase/supabase-js';
import { getRuntimeConfig } from './localConfig';

// Initialise a singleton Supabase client for the whole app
const config = getRuntimeConfig();
const supabaseUrl = config.supabaseUrl;
const supabaseKey = config.supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase storage mode requires both supabaseUrl and supabaseKey parameters. Please configure them in your settings or environment.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

// Backwards‑compatible helper (in case other modules still call it)
export function getSupabaseClient() {
  return supabase;
}

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
const FALLBACK_JOBS_FILE = isServerless 
  ? path.join('/tmp', 'scrape_jobs.json')
  : path.join(process.cwd(), 'local_db', 'scrape_jobs.json');

const fallbackJobsInMemory: Record<string, ScrapeJob> = {};

function readFallbackJobs(): Record<string, ScrapeJob> {
  try {
    const dir = path.dirname(FALLBACK_JOBS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(FALLBACK_JOBS_FILE)) {
      const content = fs.readFileSync(FALLBACK_JOBS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading fallback jobs:', e);
  }
  return {};
}

function writeFallbackJobs(jobs: Record<string, ScrapeJob>) {
  try {
    const dir = path.dirname(FALLBACK_JOBS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FALLBACK_JOBS_FILE, JSON.stringify(jobs, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing fallback jobs:', e);
  }
}

function saveFallbackJob(job: ScrapeJob) {
  fallbackJobsInMemory[job.id] = job;
  const jobs = readFallbackJobs();
  jobs[job.id] = job;
  writeFallbackJobs(jobs);
}

function getFallbackJob(id: string): ScrapeJob | null {
  if (fallbackJobsInMemory[id]) return fallbackJobsInMemory[id];
  const jobs = readFallbackJobs();
  if (jobs[id]) {
    fallbackJobsInMemory[id] = jobs[id];
    return jobs[id];
  }
  return null;
}

function removeFallbackJob(id: string) {
  delete fallbackJobsInMemory[id];
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

