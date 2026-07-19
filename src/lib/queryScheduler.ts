import { supabase } from './supabaseClient';
import { getRuntimeConfig, rotateKey } from './localConfig';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

export interface ScheduledQuery {
  id: string;
  query: string;
  scraper: 'maps-free' | 'social' | 'google' | 'duckduckgo' | 'osm' | 'jiji' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
  limit: number;
  status: 'pending' | 'queued' | 'completed' | 'failed';
  jobId?: string;
  queuedAt?: string;
  completedAt?: string;
  leadsScraped?: number;
}

export interface WeeklySchedule {
  weekNumber: number;
  queries: ScheduledQuery[];
}

export interface MonthlySchedule {
  id: string;
  monthYear: string;
  autoQueueEnabled: boolean;
  intervalDays: number;
  lastTriggeredAt?: string;
  weeks: WeeklySchedule[];
  nicheFocus?: string;
  locationFocus?: string;
  updatedAt: string;
}

// Fallback JSON file path
const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';

import { getWorkerIndex } from './requestContext';

function getSchedulerFilePath(fileName: string): string {
  const workerIndex = getWorkerIndex();

  const nameParts = fileName.split('.');
  const baseName = workerIndex 
    ? `${nameParts[0]}.worker-${workerIndex}.${nameParts[1]}` 
    : fileName;

  return isServerless
    ? path.join('/tmp', baseName)
    : path.join(process.cwd(), 'local_db', baseName);
}

// Default niches and locations
const DEFAULT_NICHES = [
  { name: 'dentist', type: 'maps-free' },
  { name: 'salon', type: 'social' },
  { name: 'restaurant', type: 'social' },
  { name: 'gym', type: 'social' },
  { name: 'lawyer', type: 'maps-free' },
  { name: 'hotel', type: 'maps-free' },
  { name: 'car dealer', type: 'maps-free' },
  { name: 'mechanic', type: 'maps-free' },
  { name: 'school', type: 'maps-free' },
  { name: 'solar installer', type: 'maps-free' },
  { name: 'boutique', type: 'social' },
  { name: 'pharmacy', type: 'maps-free' }
];

const DEFAULT_LOCATIONS = [
  'ikeja', 'lekki', 'yaba', 'surulere', 'ikoyi', 
  'victoria island', 'gbagada', 'festac', 'maryland', 'apapa'
];

/**
 * Generate a default schedule deterministically
 */
export function generateDefaultSchedule(nicheFocus?: string, locationFocus?: string): MonthlySchedule {
  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const weeks: WeeklySchedule[] = [];
  let queryIndex = 0;

  for (let w = 1; w <= 4; w++) {
    const queries: ScheduledQuery[] = [];
    for (let q = 1; q <= 3; q++) {
      // Pick niche and location based on index, or use focuses if specified
      const targetNiche = nicheFocus 
        ? { name: nicheFocus, type: 'maps-free' } 
        : DEFAULT_NICHES[queryIndex % DEFAULT_NICHES.length];
        
      const targetLoc = locationFocus
        ? locationFocus
        : DEFAULT_LOCATIONS[(queryIndex + w) % DEFAULT_LOCATIONS.length];

      const queryStr = `${targetNiche.name} ${targetLoc}`;
      queries.push({
        id: randomUUID(),
        query: queryStr,
        scraper: targetNiche.type as any,
        limit: 25,
        status: 'pending'
      });
      queryIndex++;
    }
    weeks.push({ weekNumber: w, queries });
  }

  return {
    id: 'active-schedule',
    monthYear: monthName,
    autoQueueEnabled: true,
    intervalDays: 3, // default trigger every 3 days
    weeks,
    nicheFocus,
    locationFocus,
    updatedAt: now.toISOString()
  };
}

/**
 * Retrieve the current monthly campaign schedule (checks Supabase, falls back to local JSON)
 */
export async function getMonthlySchedule(): Promise<MonthlySchedule> {
  let schedule: MonthlySchedule | null = null;

  // 1. Try Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('query_schedule')
        .select('*')
        .eq('id', 'active-schedule')
        .single();

      if (!error && data) {
        schedule = {
          id: data.id,
          monthYear: data.month_year,
          autoQueueEnabled: data.auto_queue_enabled,
          intervalDays: data.schedule.intervalDays ?? 3,
          lastTriggeredAt: data.schedule.lastTriggeredAt,
          weeks: data.schedule.weeks || [],
          nicheFocus: data.schedule.nicheFocus,
          locationFocus: data.schedule.locationFocus,
          updatedAt: data.updated_at
        };
      }
    } catch (e: any) {
      console.warn('[Scheduler] Supabase query failed, falling back to local file:', e.message);
    }
  }

  // 2. Try Local File
  if (!schedule) {
    try {
      const schedulerPath = getSchedulerFilePath('query_schedule.json');
      const bundlePath = path.join(process.cwd(), 'local_db', 'query_schedule.json');
      
      // Copy base schedule if worker-specific file doesn't exist
      if (schedulerPath !== bundlePath && !fs.existsSync(schedulerPath) && fs.existsSync(bundlePath)) {
        try {
          fs.copyFileSync(bundlePath, schedulerPath);
        } catch (err) {
          console.error('Error copying base schedule to worker path:', err);
        }
      }

      if (fs.existsSync(schedulerPath)) {
        schedule = readJsonFileSyncWithRetry<MonthlySchedule | null>(schedulerPath, null);
      }
    } catch (e) {
      console.error('[Scheduler] Error reading local schedule file:', e);
    }
  }

  // 3. Fallback to generating default
  if (!schedule) {
    schedule = generateDefaultSchedule();
    await saveMonthlySchedule(schedule);
  }

  // 4. Synchronize status of queued queries
  if (schedule && supabase) {
    let modified = false;
    for (let w = 0; w < schedule.weeks.length; w++) {
      for (let q = 0; q < schedule.weeks[w].queries.length; q++) {
        const query = schedule.weeks[w].queries[q];
        if (query.status === 'queued' && query.jobId) {
          try {
            const { data: job, error } = await supabase
              .from('scrape_jobs')
              .select('status, result')
              .eq('id', query.jobId)
              .single();

            if (!error && job) {
              if (job.status === 'completed') {
                query.status = 'completed';
                query.completedAt = new Date().toISOString();
                query.leadsScraped = job.result?.added ?? job.result?.leadsCount ?? 0;
                modified = true;
              } else if (job.status === 'failed') {
                query.status = 'failed';
                modified = true;
              }
            }
          } catch (e) {}
        }
      }
    }

    if (modified) {
      await saveMonthlySchedule(schedule);
    }
  }

  return schedule;
}

/**
 * Save the monthly schedule (writes to Supabase, falls back to local JSON)
 */
export async function saveMonthlySchedule(schedule: MonthlySchedule): Promise<boolean> {
  const now = new Date().toISOString();
  schedule.updatedAt = now;

  // 1. Try Supabase
  if (supabase) {
    try {
      const payload = {
        id: schedule.id,
        month_year: schedule.monthYear,
        auto_queue_enabled: schedule.autoQueueEnabled,
        schedule: {
          weeks: schedule.weeks,
          intervalDays: schedule.intervalDays,
          lastTriggeredAt: schedule.lastTriggeredAt,
          nicheFocus: schedule.nicheFocus,
          locationFocus: schedule.locationFocus
        },
        updated_at: now
      };

      const { error } = await supabase
        .from('query_schedule')
        .upsert(payload, { onConflict: 'id' });

      if (!error) {
        console.log('[Scheduler] Saved schedule to Supabase');
        // Sync local file too just in case
        saveToLocalFile(schedule);
        return true;
      }
      console.warn('[Scheduler] Supabase upsert failed, writing to local file:', error.message);
    } catch (e: any) {
      console.warn('[Scheduler] Supabase save error, writing to local file:', e.message);
    }
  }

  // 2. Local File Save
  return saveToLocalFile(schedule);
}

function saveToLocalFile(schedule: MonthlySchedule): boolean {
  try {
    const schedulerPath = getSchedulerFilePath('query_schedule.json');
    writeJsonFileSyncAtomic(schedulerPath, schedule);
    console.log('[Scheduler] Saved schedule to local file:', schedulerPath);
    return true;
  } catch (e) {
    console.error('[Scheduler] Error writing local schedule file:', e);
    return false;
  }
}

/**
 * Get database statistics to guide AI planning
 */
async function getDbStats(): Promise<{ niches: Record<string, number>; cities: Record<string, number> }> {
  const stats = { niches: {} as Record<string, number>, cities: {} as Record<string, number> };

  // 1. Try from Supabase
  if (supabase) {
    try {
      const { data: categoryData } = await supabase.rpc('get_leads_by_category');
      const { data: cityData } = await supabase.rpc('get_leads_by_city');

      if (categoryData && Array.isArray(categoryData)) {
        categoryData.forEach(row => { stats.niches[row.category || 'unknown'] = row.count || 0; });
      }
      if (cityData && Array.isArray(cityData)) {
        cityData.forEach(row => { stats.cities[row.city || 'unknown'] = row.count || 0; });
      }

      if (categoryData || cityData) return stats;
    } catch (e) {}

    // Backup simple query if RPC is not deployed
    try {
      const { data } = await supabase.from('leads').select('category, city');
      if (data) {
        data.forEach(row => {
          if (row.category) stats.niches[row.category] = (stats.niches[row.category] || 0) + 1;
          if (row.city) stats.cities[row.city] = (stats.cities[row.city] || 0) + 1;
        });
        return stats;
      }
    } catch (e) {}
  }

  // 2. Try Local File
  try {
    const leadsFile = getSchedulerFilePath('leads.json');
    const bundleLeads = path.join(process.cwd(), 'local_db', 'leads.json');
    
    // Copy base leads if worker-specific file doesn't exist
    if (leadsFile !== bundleLeads && !fs.existsSync(leadsFile) && fs.existsSync(bundleLeads)) {
      try {
        fs.copyFileSync(bundleLeads, leadsFile);
      } catch (err) {}
    }

    if (fs.existsSync(leadsFile)) {
      const leads = readJsonFileSyncWithRetry<any[]>(leadsFile, []);
      if (Array.isArray(leads)) {
        leads.forEach((l: any) => {
          if (l.category) stats.niches[l.category] = (stats.niches[l.category] || 0) + 1;
          if (l.city) stats.cities[l.city] = (stats.cities[l.city] || 0) + 1;
        });
      }
    }
  } catch (e) {}

  return stats;
}

/**
 * Smart AI Campaign Generator (via Gemini 2.5 Flash)
 */
export async function generateAISchedule(nicheFocus?: string, locationFocus?: string): Promise<MonthlySchedule> {
  const config = getRuntimeConfig();
  
  // If on-ground mode is true or API keys are missing, return deterministic default
  const hasGeminiKey = !!(config.geminiApiKey || (Array.isArray(config.geminiApiKeys) && config.geminiApiKeys.length));
  if (config.onGroundMode || !hasGeminiKey) {
    console.info('[Scheduler AI] On-ground mode or missing keys - generating default schedule.');
    return generateDefaultSchedule(nicheFocus, locationFocus);
  }

  // Get current lead metrics
  const stats = await getDbStats();
  
  const prompt = `You are the Campaign Scheduler AI for Bethelmind Analytics & Strategy lead automation.
Your task is to generate a highly optimized 30-day lead generation plan (4 weeks, 3 queries per week = 12 total queries).
The goal is to expand our contact pipeline with high-quality local business targets while avoiding duplication of existing data.

Database Stats of Already Scraped Leads:
- Niches currently captured: ${JSON.stringify(stats.niches)}
- Cities currently captured: ${JSON.stringify(stats.cities)}

Campaign Constraints:
- Niche Focus: ${nicheFocus || 'Any local business category'}
- Location Focus: ${locationFocus || 'Any city/area'}

Instructions:
1. Generate 12 distinct search queries (3 queries per week across 4 weeks).
2. Prioritize niches and locations that are under-represented in our current database stats.
3. Select the best scraper engine for each query:
   - Use "social" for retail/visual/lifestyle categories (e.g. boutique, gym, salon, restaurant, spa, bakery).
   - Use "maps-free" for professional or trade services (e.g. dentist, law firm, solar installer, mechanic, school, pharmacy).
4. Do NOT duplicate search queries. Keep them realistic for local search (e.g. "dental clinics in Lekki", "boutiques in Yaba", "solar installers Abuja").
5. Return ONLY a valid JSON object matching this TypeScript structure:
{
  "weeks": [
    {
      "weekNumber": 1,
      "queries": [
        { "query": "dental clinics Lekki", "scraper": "maps-free", "limit": 25 },
        { "query": "boutiques Yaba", "scraper": "social", "limit": 25 },
        { "query": "restaurants Ikeja", "scraper": "social", "limit": 25 }
      ]
    },
    ... up to week 4
  ]
}`;

  const keys = Array.isArray(config.geminiApiKeys) ? config.geminiApiKeys : (config.geminiApiKey ? config.geminiApiKey.split(',') : []);
  const activeKey = keys.length ? rotateKey(keys.join(',')) : '';

  if (!activeKey) {
    console.warn('[Scheduler AI] No active Gemini key found, falling back to default.');
    return generateDefaultSchedule(nicheFocus, locationFocus);
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;

  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} - ${resp.statusText}`);
    }

    const data = await resp.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON structure returned from Gemini');

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Convert to full MonthlySchedule
    const now = new Date();
    const weeks: WeeklySchedule[] = parsed.weeks.map((w: any) => ({
      weekNumber: w.weekNumber,
      queries: w.queries.map((q: any) => ({
        id: randomUUID(),
        query: q.query,
        scraper: q.scraper,
        limit: q.limit || 25,
        status: 'pending'
      }))
    }));

    const newSchedule: MonthlySchedule = {
      id: 'active-schedule',
      monthYear: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      autoQueueEnabled: true,
      intervalDays: 3,
      weeks,
      nicheFocus,
      locationFocus,
      updatedAt: now.toISOString()
    };

    await saveMonthlySchedule(newSchedule);
    return newSchedule;
  } catch (err: any) {
    console.error('[Scheduler AI] Failed to generate AI schedule, returning default:', err.message);
    return generateDefaultSchedule(nicheFocus, locationFocus);
  }
}

/**
 * Queue the next pending query from the active schedule
 */
export async function queueNextPendingQuery(force: boolean = false): Promise<ScheduledQuery | null> {
  const schedule = await getMonthlySchedule();
  if (!schedule.autoQueueEnabled) {
    console.log('[Scheduler] Autocamping is disabled.');
    return null;
  }

  const now = new Date();

  // If not forced, check rate-limiting spacing (intervalDays)
  if (!force && schedule.lastTriggeredAt) {
    const lastTime = new Date(schedule.lastTriggeredAt).getTime();
    const elapsedMs = now.getTime() - lastTime;
    const requiredMs = schedule.intervalDays * 24 * 60 * 60 * 1000;
    
    if (elapsedMs < requiredMs) {
      const remainingDays = ((requiredMs - elapsedMs) / (24 * 60 * 60 * 1000)).toFixed(1);
      console.log(`[Scheduler] Skipping dispatch: Pace limit active. ${remainingDays} days remaining before next auto-queue.`);
      return null;
    }
  }

  // Find the first pending query
  let nextQuery: ScheduledQuery | null = null;
  let targetWeekIndex = -1;
  let targetQueryIndex = -1;

  for (let w = 0; w < schedule.weeks.length; w++) {
    for (let q = 0; q < schedule.weeks[w].queries.length; q++) {
      if (schedule.weeks[w].queries[q].status === 'pending') {
        nextQuery = schedule.weeks[w].queries[q];
        targetWeekIndex = w;
        targetQueryIndex = q;
        break;
      }
    }
    if (nextQuery) break;
  }

  if (!nextQuery) {
    console.log('[Scheduler] All scheduled campaigns are already completed or queued.');
    return null;
  }

  console.log(`[Scheduler] Dispatching scheduled query: "${nextQuery.query}" using [${nextQuery.scraper}]`);

  // Dispatch scrape job via supabaseClient helper or API route
  try {
    const { createScrapeJob } = await import('./supabaseClient');
    
    const payload: any = {
      query: nextQuery.query,
      limit: nextQuery.limit
    };
    if (nextQuery.scraper === 'social') {
      payload.platform = 'instagram';
    }

    const job = await createScrapeJob(nextQuery.scraper, payload);
    
    // Update query status
    nextQuery.status = 'queued';
    nextQuery.jobId = job.id;
    nextQuery.queuedAt = now.toISOString();

    schedule.weeks[targetWeekIndex].queries[targetQueryIndex] = nextQuery;
    schedule.lastTriggeredAt = now.toISOString();
    
    await saveMonthlySchedule(schedule);

    console.log(`[Scheduler] Successfully dispatched job: ID = ${job.id}`);
    return nextQuery;
  } catch (err: any) {
    console.error(`[Scheduler] Failed to dispatch job for "${nextQuery.query}":`, err.message);
    nextQuery.status = 'failed';
    await saveMonthlySchedule(schedule);
    return null;
  }
}
