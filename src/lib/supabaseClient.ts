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
// Scrape Jobs CRUD Helpers
// ============================================================================

import { randomUUID } from 'crypto';

export type ScrapeJobType = 'jiji' | 'google';
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

/** Create a new scraper job */
export async function createScrapeJob(
  type: ScrapeJobType,
  payload: any,
  userId?: string
): Promise<ScrapeJob> {
  const { data, error } = await supabase.from('scrape_jobs').insert([
    {
      id: randomUUID(),
      type,
      status: 'queued',
      payload,
      user_id: userId || null,
    },
  ]).select().single();

  if (error) throw error;
  return data as ScrapeJob;
}

/** Retrieve a job by its ID */
export async function getScrapeJob(id: string): Promise<ScrapeJob | null> {
  const { data, error } = await supabase
    .from('scrape_jobs')
    .select('*')
    .eq('id', id)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // row not found is ok
  return data as ScrapeJob | null;
}

/** Update status (and optional result/error) */
export async function updateScrapeJobStatus(
  id: string,
  status: ScrapeJobStatus,
  updates?: Partial<Pick<ScrapeJob, 'result' | 'error_message'>>
): Promise<ScrapeJob> {
  const updatePayload = { status, ...updates };
  const { data, error } = await supabase
    .from('scrape_jobs')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as ScrapeJob;
}

/** Delete a job (admin only) */
export async function deleteScrapeJob(id: string): Promise<void> {
  const { error } = await supabase.from('scrape_jobs').delete().eq('id', id);
  if (error) throw error;
}

