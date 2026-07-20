import * as fs from 'fs';
import * as path from 'path';
import dns from 'dns';
import { createClient } from '@supabase/supabase-js';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from '../src/lib/atomicIo.ts';

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// Resolve environment configuration (from .env.local or config.json)
function loadConfig() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  let storageMode = process.env.STORAGE_MODE || '';

  // Attempt to parse .env.local
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)/);
    const keyMatch = content.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']?([^"'\r\n]+)/);
    const modeMatch = content.match(/STORAGE_MODE\s*=\s*["']?([^"'\r\n]+)/);
    if (urlMatch && !supabaseUrl) supabaseUrl = urlMatch[1];
    if (keyMatch && !supabaseKey) supabaseKey = keyMatch[1];
    if (modeMatch && !storageMode) storageMode = modeMatch[1];
  }

  // Attempt to fallback to config.json
  const configPath = path.resolve(process.cwd(), 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (!supabaseUrl) supabaseUrl = config.supabaseUrl || '';
      if (!supabaseKey) supabaseKey = config.supabaseKey || '';
      if (!storageMode) storageMode = config.storageMode || '';
    } catch (e) {
      console.warn('Error reading config.json:', e);
    }
  }

  return { supabaseUrl, supabaseKey, storageMode };
}

const { supabaseUrl, supabaseKey, storageMode } = loadConfig();
const isLocalMode = storageMode === 'local';

if (!isLocalMode && (!supabaseUrl || !supabaseKey)) {
  console.error('❌ Error: Supabase credentials missing.');
  console.error('Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local or config.json.');
  process.exit(1);
}

const supabase = (!isLocalMode && supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Helper to wrap Supabase operations with automatic retry logic with exponential backoff
async function supabaseWithRetry<T>(queryPromiseFn: () => Promise<{ data: T | null; error: any }>, retries = 5, initialDelay = 1000): Promise<{ data: T | null; error: any }> {
  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      const result = await queryPromiseFn();
      if (!result.error) {
        return result;
      }
      
      const errMsg = String(result.error.message || '').toLowerCase();
      const errCode = String(result.error.code || '');
      const isNetworkError = 
        errMsg.includes('fetch') || 
        errMsg.includes('network') || 
        errMsg.includes('connection') || 
        errMsg.includes('timeout') || 
        errCode === 'PGRST' || 
        errMsg.includes('socket') ||
        errMsg.includes('bad gateway') ||
        errMsg.includes('service unavailable');
        
      if (isNetworkError) {
        if (i === retries - 1) {
          return result;
        }
        console.warn(`⚠️ [Network Retry] Supabase query returned network error: "${result.error.message}". Retrying in ${delay / 1000}s (Attempt ${i + 1}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      return result;
    } catch (err: any) {
      if (i === retries - 1) {
        return { data: null, error: err };
      }
      console.warn(`⚠️ [Network Retry] Supabase query threw exception: "${err.message}". Retrying in ${delay / 1000}s (Attempt ${i + 1}/${retries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  return { data: null, error: { message: 'Max retries reached.' } };
}

const LOCAL_API_PORT = process.env.PORT || '3006';
const LOCAL_BASE_URL = `http://localhost:${LOCAL_API_PORT}`;

// Track the currently processing job for real-time frontend reporting
let currentJob: any = null;

console.log('====================================================');
console.log('🚀 Local Scraping Job Runner Started');
if (isLocalMode) {
  console.log('Storage Mode: local (Offline JSON Queue Enabled)');
} else {
  console.log(`Supabase URL: ${supabaseUrl}`);
}
console.log(`Local Next.js URL: ${LOCAL_BASE_URL}`);
console.log('====================================================');

// Local Queue Utilities for Offline Mode
function getJobsFilePath(fileName: string): string {
  const workerIndex = process.env.TEST_WORKER_INDEX || '';
  const nameParts = fileName.split('.');
  const baseName = workerIndex 
    ? `${nameParts[0]}.worker-${workerIndex}.${nameParts[1]}` 
    : fileName;
  return path.join(process.cwd(), 'local_db', baseName);
}

function readLocalJobs(): Record<string, any> {
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

    return readJsonFileSyncWithRetry<Record<string, any>>(filePath, {});
  } catch (e) {
    console.error('Error reading local jobs:', e);
  }
  return {};
}

function writeLocalJobs(jobs: Record<string, any>) {
  try {
    const filePath = getJobsFilePath('scrape_jobs.json');
    writeJsonFileSyncAtomic(filePath, jobs);
  } catch (e) {
    console.error('Error writing local jobs:', e);
  }
}

// Type mapping from job type to API endpoint path
const endpointMap: Record<string, string> = {
  jiji: 'jiji',
  osm: 'osm',
  'maps-free': 'maps-free',
  social: 'social',
  duckduckgo: 'duckduckgo',
  maps: 'maps',
  google: 'maps'
};

async function processJob(job: any, alreadyRunning: boolean = false) {
  currentJob = {
    id: job.id,
    type: job.type,
    payload: job.payload,
    startedAt: new Date().toISOString()
  };
  console.log(`\n[${new Date().toISOString()}] Processing Job: ${job.id} (Type: ${job.type})`);
  
  try {
    if (!alreadyRunning) {
      // 1. Mark job as running
      if (isLocalMode) {
        const jobs = readLocalJobs();
        if (jobs[job.id]) {
          jobs[job.id].status = 'running';
          jobs[job.id].updated_at = new Date().toISOString();
          writeLocalJobs(jobs);
        }
      } else if (supabase) {
        const { error: updateError } = await supabaseWithRetry(() => supabase!
          .from('scrape_jobs')
          .update({ 
            status: 'running', 
            updated_at: new Date().toISOString() 
          })
          .eq('id', job.id)
        );

        if (updateError) {
          console.error(`❌ Failed to update status to "running" for job ${job.id}:`, updateError.message);
          return;
        }
      }
    }

    // 2. Resolve endpoint url
    const pathName = endpointMap[job.type];
    if (!pathName) {
      const errorMsg = `Unsupported job type: ${job.type}`;
      console.error(`❌ ${errorMsg}`);
      await failJob(job.id, errorMsg);
      return;
    }

    const endpointUrl = `${LOCAL_BASE_URL}/api/scrape/${pathName}`;
    console.log(`👉 Forwarding request to local scraper: ${endpointUrl}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(`⚠️ Job ${job.id} request timed out after 10 minutes.`);
        controller.abort();
      }, 600000); // 10 minutes timeout

      // 3. Dispatch post request to local server
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bypass-queue': 'true' // Bypass queue intercept to trigger actual execution
        },
        body: JSON.stringify({
          ...job.payload,
          bypassQueue: true // Fail-safe fallback parameter
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Local endpoint returned status ${response.status}: ${errorText}`);
      }

      const resultData = await response.json();
      if (resultData.error) {
        throw new Error(resultData.error);
      }

      // 4. Mark job as completed
      if (isLocalMode) {
        const jobs = readLocalJobs();
        if (jobs[job.id]) {
          jobs[job.id].status = 'completed';
          jobs[job.id].result = {
            added: resultData.added || 0,
            skipped: resultData.skipped || 0,
            leadsCount: resultData.leads?.length || 0
          };
          jobs[job.id].updated_at = new Date().toISOString();
          writeLocalJobs(jobs);
          console.log(`✅ Job ${job.id} completed successfully. Added: ${resultData.added || 0}, Skipped: ${resultData.skipped || 0}`);
        }
      } else if (supabase) {
        const { error: completeError } = await supabaseWithRetry(() => supabase!
          .from('scrape_jobs')
          .update({
            status: 'completed',
            result: {
              added: resultData.added || 0,
              skipped: resultData.skipped || 0,
              leadsCount: resultData.leads?.length || 0
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', job.id)
        );

        if (completeError) {
          console.error(`❌ Failed to update status to "completed" for job ${job.id}:`, completeError.message);
        } else {
          console.log(`✅ Job ${job.id} completed successfully. Added: ${resultData.added || 0}, Skipped: ${resultData.skipped || 0}`);
        }
      }
    } catch (err: any) {
      console.error(`❌ Error executing job ${job.id}:`, err.message);
      await failJob(job.id, err.message);
    }
  } finally {
    currentJob = null;
  }
}

async function failJob(id: string, errorMessage: string) {
  if (isLocalMode) {
    const jobs = readLocalJobs();
    if (jobs[id]) {
      jobs[id].status = 'failed';
      jobs[id].error_message = errorMessage;
      jobs[id].updated_at = new Date().toISOString();
      writeLocalJobs(jobs);
      console.log(`⚠️ Marked local job ${id} as failed.`);
    }
  } else if (supabase) {
    const { error } = await supabaseWithRetry(() => supabase!
      .from('scrape_jobs')
      .update({
        status: 'failed',
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    );

    if (error) {
      console.error(`❌ Failed to mark job ${id} as failed:`, error.message);
    } else {
      console.log(`⚠️ Marked job ${id} as failed.`);
    }
  }
}

async function pollQueue() {
  try {
    if (isLocalMode) {
      const jobs = readLocalJobs();
      const nextJobId = Object.keys(jobs)
        .filter(id => jobs[id].status === 'queued')
        .sort((a, b) => new Date(jobs[a].created_at).getTime() - new Date(jobs[b].created_at).getTime())[0];
      
      if (nextJobId) {
        const job = jobs[nextJobId];
        console.log(`[Queue] Dequeued local job ${job.id} from filesystem.`);
        job.status = 'running';
        job.updated_at = new Date().toISOString();
        writeLocalJobs(jobs);
        
        await processJob(job, true);
      }
      return;
    }

    if (supabase) {
      // Try to dequeue atomically via RPC
      const { data: job, error: rpcError } = await supabaseWithRetry(() => supabase!.rpc('dequeue_next_scrape_job'));

      if (!rpcError && job) {
        const jobRow = Array.isArray(job) ? job[0] : job;
        if (jobRow && jobRow.id) {
          console.log(`[Queue] Atomically dequeued job ${jobRow.id} via RPC.`);
          await processJob(jobRow, true);
          return;
        }
      }

      if (rpcError) {
        if (rpcError.message?.includes('does not exist')) {
          console.warn('⚠️ dequeue_next_scrape_job RPC not found. Falling back to non-atomic queue polling...');
        } else {
          console.error('Error calling dequeue_next_scrape_job RPC:', rpcError.message);
        }
      }

      // Fallback: standard non-atomic queue check
      const { data: jobs, error } = await supabaseWithRetry(() => supabase!
        .from('scrape_jobs')
        .select('*')
        .eq('status', 'queued')
        .order('created_at', { ascending: true })
        .limit(1)
      );

      if (error) {
        console.error('Error polling queue from Supabase (fallback):', error.message);
        return;
      }

      if (jobs && jobs.length > 0) {
        await processJob(jobs[0]);
      }
    }
  } catch (err: any) {
    console.error('Unexpected error during queue polling:', err.message);
  }
}

async function resetStuckJobs() {
  try {
    console.log('🔄 Cleaning up and resetting stuck/running jobs...');
    if (isLocalMode) {
      const jobs = readLocalJobs();
      let updatedCount = 0;
      for (const id of Object.keys(jobs)) {
        if (jobs[id].status === 'running') {
          jobs[id].status = 'queued';
          jobs[id].updated_at = new Date().toISOString();
          updatedCount++;
        }
      }
      if (updatedCount > 0) {
        writeLocalJobs(jobs);
      }
      console.log(`✅ Stuck/running local jobs successfully reset back to queued state. Count: ${updatedCount}`);
    } else if (supabase) {
      const { error } = await supabaseWithRetry(() => supabase!
        .from('scrape_jobs')
        .update({ 
          status: 'queued', 
          updated_at: new Date().toISOString() 
        })
        .eq('status', 'running')
      );

      if (error) {
        console.error('❌ Failed to reset stuck jobs:', error.message);
      } else {
        console.log('✅ Stuck/running jobs successfully reset back to queued state.');
      }
    }
  } catch (err: any) {
    console.error('Unexpected error resetting stuck jobs:', err.message);
  }
}

async function checkAndRecoverStuckJobs() {
  try {
    console.log(`🔍 [${new Date().toISOString()}] Checking stuck jobs...`);
    if (isLocalMode) {
      const jobs = readLocalJobs();
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      let updatedCount = 0;
      
      for (const id of Object.keys(jobs)) {
        if (jobs[id].status === 'running' && jobs[id].updated_at < fifteenMinutesAgo) {
          jobs[id].status = 'failed';
          jobs[id].error_message = 'Job execution timed out (stuck in running state for over 15 minutes).';
          jobs[id].updated_at = new Date().toISOString();
          updatedCount++;
        }
      }
      if (updatedCount > 0) {
        writeLocalJobs(jobs);
      }
      console.log(`✅ Stale local jobs recovered. Count: ${updatedCount}`);
      return;
    }

    if (supabase) {
      const { data, error: rpcError } = await supabaseWithRetry(() => supabase!.rpc('recover_stuck_jobs', {
        p_timeout_minutes: 15,
        p_max_retries: 3
      }));

      if (!rpcError && data !== null) {
        const recoveredCount = Array.isArray(data) ? (data[0]?.recovered_count ?? 0) : (data?.recovered_count ?? data ?? 0);
        console.log(`✅ Stale jobs recovered via RPC. Count: ${recoveredCount}`);
        return;
      }

      if (rpcError) {
        if (rpcError.message?.includes('does not exist')) {
          console.warn('⚠️ recover_stuck_jobs RPC not found. Falling back to manual check...');
        } else {
          console.error('Error calling recover_stuck_jobs RPC:', rpcError.message);
        }
      }

      // Fallback: manual stuck jobs recovery
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { data: stuckJobs, error: fetchError } = await supabaseWithRetry(() => supabase!
        .from('scrape_jobs')
        .select('id, type')
        .eq('status', 'running')
        .lt('updated_at', fifteenMinutesAgo)
      );
        
      if (fetchError) {
        console.error('❌ Failed to fetch stuck jobs (fallback):', fetchError.message);
        return;
      }
      
      if (stuckJobs && stuckJobs.length > 0) {
        console.log(`⚠️ Found ${stuckJobs.length} stuck jobs (fallback). Marking them as failed...`);
        for (const job of stuckJobs) {
          await failJob(job.id, 'Job execution timed out (stuck in running state for over 15 minutes).');
        }
      } else {
        console.log('✅ No stuck jobs found (fallback).');
      }
    }
  } catch (err: any) {
    console.error('Unexpected error checking for stuck jobs:', err.message);
  }
}

async function checkScheduledCampaigns() {
  try {
    console.log(`[${new Date().toISOString()}] 📅 Checking for scheduled campaigns...`);
    const response = await fetch(`${LOCAL_BASE_URL}/api/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'trigger-next', force: false })
    });
    if (!response.ok) {
      throw new Error(`Schedule endpoint returned status ${response.status}`);
    }
    const data = await response.json();
    if (data.success && data.queued) {
      console.log(`[Scheduler] Auto-queued new campaign query: "${data.queued.query}"`);
    } else if (data.success) {
      console.log('[Scheduler] No campaign query queued (pacing active or all done).');
    }
  } catch (err: any) {
    console.error('❌ Error checking scheduled campaigns:', err.message);
  }
}

async function checkLagosDailyScraper() {
  try {
    const configPath = path.resolve(process.cwd(), 'config.json');
    let autoQueueEnabled = false;
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        // We will support a setting in config if needed, default to true for scaling objective
        autoQueueEnabled = config.autoQueueLagosDaily10k !== false;
      } catch {}
    }

    if (!autoQueueEnabled) {
      console.log('[Scheduler] Daily automated 10K Lagos Scraper is disabled in settings.');
      return;
    }

    const localDbPath = path.resolve(process.cwd(), 'local_db');
    if (!fs.existsSync(localDbPath)) {
      fs.mkdirSync(localDbPath, { recursive: true });
    }
    const lastRunFile = path.join(localDbPath, 'lagos_daily_last_run.json');
    let lastRunTime = 0;
    if (fs.existsSync(lastRunFile)) {
      try {
        const lastRun = JSON.parse(fs.readFileSync(lastRunFile, 'utf8'));
        lastRunTime = lastRun.timestamp || 0;
      } catch {}
    }
    
    // Check if 24 hours (86,400,000 ms) have passed
    const now = Date.now();
    if (now - lastRunTime >= 24 * 60 * 60 * 1000) {
      console.log(`[Scheduler] 24h passed. Triggering automated daily 10K Lagos Scraper...`);
      const response = await fetch(`${LOCAL_BASE_URL}/api/scrape/bulk-queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          limit: 100, 
          maxJobsToQueue: 100,
          targetLagosDaily10k: true
        })
      });
      if (response.ok) {
        const data = await response.json();
        console.log(`[Scheduler] Daily scraper automated execution complete. Queued ${data.jobsCount} scraper jobs.`);
        fs.writeFileSync(lastRunFile, JSON.stringify({ timestamp: now }), 'utf8');
      } else {
        console.error(`[Scheduler] Daily scraper endpoint returned error status: ${response.status}`);
      }
    } else {
      const remainingHours = ((24 * 60 * 60 * 1000 - (now - lastRunTime)) / (60 * 60 * 1000)).toFixed(1);
      console.log(`[Scheduler] Lagos daily automated scraper check: Next queue run in ${remainingHours} hours.`);
    }
  } catch (err: any) {
    console.error('❌ Error executing automated daily Lagos scraper:', err.message);
  }
}

// Start queue polling, run startup recovery, and set intervals
(async () => {
  // Asynchronous Batch Deployment synchronization handler
  async function triggerBatchSync() {
    try {
      console.log(`[${new Date().toISOString()}] 🔄 Running background Git-batch sync check...`);
      const cronSecret = process.env.CRON_SECRET || 'apexreach_sync_secret';
      const response = await fetch(`${LOCAL_BASE_URL}/api/deploy/batch-sync?secret=${cronSecret}`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(`Batch sync returned status ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.results) {
        const { redesignsProcessed, gitDeploysProcessed, redesignErrors, gitDeployErrors } = data.results;
        if (
          redesignsProcessed.length > 0 ||
          gitDeploysProcessed.length > 0 ||
          redesignErrors.length > 0 ||
          gitDeployErrors.length > 0
        ) {
          console.log(`[Batch Sync] Execution completed:
 - Redesigns: ${redesignsProcessed.length} success, ${redesignErrors.length} failed.
 - Git Deploys: ${gitDeploysProcessed.length} success, ${gitDeployErrors.length} failed.`);
        }
      }
    } catch (err: any) {
      console.error('❌ Error executing background batch sync:', err.message);
    }
  }

  if (process.env.RUN_ONCE === 'true') {
    console.log('🏃 RUN_ONCE mode active: Processing all queued jobs and then exiting...');
    await resetStuckJobs();
    await checkAndRecoverStuckJobs();
    await checkScheduledCampaigns();
    await triggerBatchSync();
    
    let processedCount = 0;
    let consecutiveEmptyPolls = 0;
    
    while (true) {
      // Check if there is a queued job
      let jobRow: any = null;
      if (isLocalMode) {
        const jobs = readLocalJobs();
        const nextJobId = Object.keys(jobs)
          .filter(id => jobs[id].status === 'queued')
          .sort((a, b) => new Date(jobs[a].created_at).getTime() - new Date(jobs[b].created_at).getTime())[0];
        if (nextJobId) {
          jobRow = jobs[nextJobId];
          jobRow.status = 'running';
          jobRow.updated_at = new Date().toISOString();
          writeLocalJobs(jobs);
        }
      } else if (supabase) {
        const { data, error: rpcError } = await supabaseWithRetry(() => supabase!.rpc('dequeue_next_scrape_job'));
        if (!rpcError && data) {
          jobRow = Array.isArray(data) ? data[0] : data;
        }
        if (!jobRow && rpcError) {
          const { data: jobs, error } = await supabaseWithRetry(() => supabase!
            .from('scrape_jobs')
            .select('*')
            .eq('status', 'queued')
            .order('created_at', { ascending: true })
            .limit(1)
          );
          if (!error && jobs && jobs.length > 0) {
            jobRow = jobs[0];
          }
        }
      }

      if (jobRow && jobRow.id) {
        consecutiveEmptyPolls = 0;
        console.log(`[Queue] Dequeued job ${jobRow.id} (type: ${jobRow.type}) for execution.`);
        await processJob(jobRow, true);
        processedCount++;
      } else {
        consecutiveEmptyPolls++;
        if (consecutiveEmptyPolls >= 3) {
          console.log(`[Queue] No queued jobs remaining after ${consecutiveEmptyPolls} checks. Exiting.`);
          break;
        }
        console.log('[Queue] No jobs found in queue, waiting 3 seconds before double-checking...');
        await new Promise(r => setTimeout(r, 3000));
      }
    }
    
    console.log(`👋 RUN_ONCE execution complete. Processed ${processedCount} jobs.`);
    process.exit(0);
  }

  // Fallback to original continuous runner behaviour
  await resetStuckJobs();
  await checkAndRecoverStuckJobs();
  await checkScheduledCampaigns();
  await checkLagosDailyScraper();
  
  // Poll queue for new jobs every 3 seconds
  setInterval(pollQueue, 3000);
  console.log('🔍 Polling queue every 3 seconds...');

  // Write heartbeat file and database entry every 3 seconds to let Next.js dashboard know we are alive
  setInterval(async () => {
    const heartbeatData = { 
      last_seen: Date.now(), 
      pid: process.pid,
      currentJob: currentJob
    };
    
    // 1. Local file write
    try {
      const heartbeatPath = path.resolve(process.cwd(), 'local_runner_heartbeat.json');
      writeJsonFileSyncAtomic(heartbeatPath, heartbeatData);
    } catch (err: any) {
      console.error('❌ Heartbeat file write error:', err.message);
    }

    // 2. Database write
    try {
      if (supabase) {
        // Delete older heartbeats to avoid table bloating
        await supabaseWithRetry(() => supabase!
          .from('logs')
          .delete()
          .eq('run_id', 'local_runner')
          .eq('step', 'heartbeat')
        );

        // Insert new heartbeat
        await supabaseWithRetry(() => supabase!
          .from('logs')
          .insert([{
            run_id: 'local_runner',
            step: 'heartbeat',
            status: 'INFO',
            message: JSON.stringify(heartbeatData)
          }])
        );
      }
    } catch (err: any) {
      // Fail silently to avoid clogging stdout on intermittent network issues
    }
  }, 3000);
  
  // Scan for stuck jobs every 5 minutes
  setInterval(checkAndRecoverStuckJobs, 5 * 60 * 1000);
  console.log('⏰ Scheduled stuck job recovery checks every 5 minutes.');

  // Check scheduled campaigns every 5 minutes
  setInterval(checkScheduledCampaigns, 5 * 60 * 1000);
  console.log('⏰ Scheduled campaign checks every 5 minutes.');

  // Check Lagos daily automated scraper every 5 minutes
  setInterval(checkLagosDailyScraper, 5 * 60 * 1000);
  console.log('⏰ Scheduled Lagos daily automated scraper checks every 5 minutes.');

  // Initial trigger on startup
  await triggerBatchSync();

  // Run Batch Sync check every 1 minute
  setInterval(triggerBatchSync, 60 * 1000);
  console.log('⏰ Scheduled background Git-batch synchronization every 1 minute.');
})();
