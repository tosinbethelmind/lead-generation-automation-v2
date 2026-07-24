import * as fs from 'fs';
import * as path from 'path';
import dns from 'dns';
import ws from 'ws';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import { harvestLiveSolarLeads, harvestLiveLagosLeads } from '../src/lib/liveLeadHarvester';

if (typeof (globalThis as any).WebSocket === 'undefined') {
  (globalThis as any).WebSocket = ws;
}

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// Intercept all unhandled exceptions and promise rejections to prevent crashing the daemon
process.on('uncaughtException', (err) => {
  console.error('🔥 [Runner UncaughtException] Fatal error caught globally:', err.stack || err.message || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 [Runner UnhandledRejection] Unhandled Promise rejection at:', promise, 'reason:', reason);
});

const HARDCODED_URL = 'https://pnsrjsyiygxdcxkpgbzx.supabase.co';
const HARDCODED_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8';

function cleanEnvVal(val: string | undefined): string {
  if (!val) return '';
  let clean = val.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.substring(1, clean.length - 1).trim();
  }
  return clean;
}

function isValidKey(key: string): boolean {
  if (!key || key.length < 50) return false;
  try {
    const parts = key.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      return payload.ref === 'pnsrjsyiygxdcxkpgbzx';
    }
  } catch (_) {}
  return false;
}

// Resolve environment configuration
function loadConfig() {
  let envUrl = cleanEnvVal(process.env.SUPABASE_URL) || cleanEnvVal(process.env.NEXT_PUBLIC_SUPABASE_URL);
  let envKey = cleanEnvVal(process.env.SUPABASE_SERVICE_ROLE_KEY) || cleanEnvVal(process.env.SUPABASE_KEY);

  let supabaseUrl = (envUrl && envUrl.length > 10) ? envUrl : HARDCODED_URL;
  let supabaseKey = (envKey && envKey.length > 20) ? envKey : HARDCODED_KEY;
  let storageMode = cleanEnvVal(process.env.STORAGE_MODE) || 'supabase';

  return { supabaseUrl, supabaseKey, storageMode };
}

const { supabaseUrl, supabaseKey, storageMode } = loadConfig();
const isLocalMode = false; // Always connect to active Supabase database

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

const isHuggingFaceEnv = process.env.RUNNER_ENVIRONMENT === 'huggingface' || !!process.env.SPACE_ID;

let cachedActiveRunner: string | null = null;
let lastActiveRunnerCheck = 0;

// Throttle failover log so it only prints once every 5 minutes
let lastFailoverLogTime = 0;
const FAILOVER_LOG_THROTTLE_MS = 5 * 60 * 1000;

async function checkActiveRunnerBackend(): Promise<string> {
  const now = Date.now();
  if (now - lastActiveRunnerCheck < 15000 && cachedActiveRunner !== null) {
    return cachedActiveRunner;
  }
  
  if (isLocalMode) {
    cachedActiveRunner = 'local';
    lastActiveRunnerCheck = now;
    return 'local';
  }
  if (!supabase) {
    cachedActiveRunner = 'local';
    lastActiveRunnerCheck = now;
    return 'local';
  }

  try {
    const { data } = await supabaseWithRetry(() => supabase!
      .from('app_settings')
      .select('value')
      .eq('key', 'apexreach_runtime_config')
      .maybeSingle()
    );

    if (data?.value) {
      const parsed = JSON.parse(data.value);
      cachedActiveRunner = parsed.activeRunnerBackend || 'local';
    } else {
      cachedActiveRunner = 'local';
    }
  } catch (err: any) {
    cachedActiveRunner = 'local';
  }
  lastActiveRunnerCheck = now;
  return cachedActiveRunner;
}

async function isActiveRunner(): Promise<boolean> {
  const activeRunner = await checkActiveRunnerBackend();
  
  if (activeRunner === (isHuggingFaceEnv ? 'huggingface' : 'local')) {
    return true;
  }

  // Fallback: If active backend is huggingface, but this is the local workspace,
  // check if huggingface_runner has gone offline (missing heartbeats) to take over.
  if (activeRunner === 'huggingface' && !isHuggingFaceEnv && supabase) {
    try {
      const { data: dbLogs } = await supabaseWithRetry(() => supabase!
        .from('logs')
        .select('*')
        .eq('run_id', 'huggingface_runner')
        .eq('step', 'heartbeat')
        .order('created_at', { ascending: false })
        .limit(1)
      );

      if (dbLogs && dbLogs.length > 0) {
        const logEntry = dbLogs[0];
        const logTime = new Date(logEntry.created_at || logEntry.timestamp).getTime();
        const inactiveDuration = Date.now() - logTime;
        // 5 minutes threshold (300,000 ms)
        if (inactiveDuration > 300000) {
          const now = Date.now();
          if (now - lastFailoverLogTime > FAILOVER_LOG_THROTTLE_MS) {
            console.log(`⚠️ [Failover] Cloud runner (Hugging Face) is offline (last heartbeat ${Math.round(inactiveDuration / 1000)}s ago). Local PC runner activating fallback.`);
            lastFailoverLogTime = now;
          }
          return true;
        }
      } else {
        const now = Date.now();
        if (now - lastFailoverLogTime > FAILOVER_LOG_THROTTLE_MS) {
          console.log(`⚠️ [Failover] Cloud runner (Hugging Face) heartbeat not recorded. Local PC runner taking over fallback.`);
          lastFailoverLogTime = now;
        }
        return true;
      }
    } catch (err: any) {
      console.warn(`[Failover Check Error] ${err.message}. Standing by...`);
    }
  }

  return false;
}

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

let LOCAL_API_PORT = process.env.PORT || '3006';
// Allow cloud deployments to point at the Vercel-hosted scraper API instead of localhost
let LOCAL_BASE_URL = process.env.SCRAPER_API_BASE_URL
  ? process.env.SCRAPER_API_BASE_URL.replace(/\/$/, '')
  : `http://localhost:${LOCAL_API_PORT}`;


// Track the currently processing job for real-time frontend reporting
let currentJob: any = null;

console.log('====================================================');
console.log('🚀 Local Scraping Job Runner Started');
if (isLocalMode) {
  console.log('Storage Mode: local (Offline JSON Queue Enabled)');
} else {
  console.log(`Supabase URL: ${supabaseUrl}`);
}
console.log(`Initial Next.js Base Port Option: ${LOCAL_API_PORT}`);
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

    // 1.5. Direct execution for solar/lagos scrapers to avoid serverless HTTP timeout
    if (job.type === 'solar_scrape' || job.type === 'solar_nigeria_5k' || job.type === 'lagos_10k' || job.type === 'lagos_scrape') {
      const scriptName = 
        job.type === 'solar_nigeria_5k' ? 'nigeria_solar_5k_scraper.js' :
        job.type === 'lagos_10k' || job.type === 'lagos_scrape' ? 'lagos_10k_master_harvester.js' :
        'mass_solar_scraper.js';
      const scriptPath = path.resolve(process.cwd(), 'scripts', scriptName);
      const args: string[] = [];
      const mode = job.payload?.mode;
      const count = job.payload?.count;
      
      if (mode === 'synthetic') {
        // Quality Gate: synthetic mode is permanently disabled — route to live extraction instead
        console.log(`[Quality Gate] Synthetic mode for job ${job.type} overridden to live extraction.`);
        args.push('--count');
        args.push(String(count || (job.type === 'solar_nigeria_5k' ? 5000 : 1000)));
      } else if (mode === 'dry-run') {
        args.push('--dry-run');
        if (count) {
          args.push('--count');
          args.push(String(count));
        }
      } else if (mode === 'live-solar') {
        if (job.type === 'solar_scrape') {
          args.push('--solar-only');
        } else {
          args.push('--count');
          args.push(String(count || 5000));
        }
      } else if (count) {
        args.push('--count');
        args.push(String(count));
      }
      
      const childArgs = [...args, '--run-id', job.id];
      console.log(`[local_job_runner] Spawning direct scraper (${scriptName}, Job: ${job.id}) with args: ${childArgs.join(' ')}`);
      
      const child = spawn(process.execPath, [scriptPath, ...childArgs], {
        env: {
          ...process.env,
        },
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      // Helper function to write to Logs table in Supabase
      const appendJobLog = async (msg: string, status: 'INFO' | 'ERROR' | 'START' | 'SUCCESS') => {
        console.log(`[Job ${job.id}] [${status}] ${msg}`);
        if (!isLocalMode && supabase) {
          try {
            await supabaseWithRetry(() => supabase!
              .from('logs')
              .insert({
                run_id: job.id,
                timestamp: new Date().toISOString(),
                step: 'solar_scraper',
                status: status,
                message: msg
              })
            );
          } catch (dbErr: any) {
            console.error('Failed to write log to DB:', dbErr.message);
          }
        }
      };

      await appendJobLog(`Mass scraper runner process initialized in mode: ${mode || 'production'} (count: ${count || 'default'})`, 'START');

      let stdoutBuffer = '';
      child.stdout.on('data', (data: any) => {
        stdoutBuffer += data.toString();
        const lines = stdoutBuffer.split(/[\r\n]+/);
        stdoutBuffer = lines.pop() || '';
        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine) {
            appendJobLog(cleanLine, 'INFO');
          }
        }
      });

      let stderrBuffer = '';
      child.stderr.on('data', (data: any) => {
        stderrBuffer += data.toString();
        const lines = stderrBuffer.split(/[\r\n]+/);
        stderrBuffer = lines.pop() || '';
        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine) {
            appendJobLog(cleanLine, 'ERROR');
          }
        }
      });

      await new Promise<void>((resolve, reject) => {
        child.on('close', async (code: any) => {
          if (stdoutBuffer.trim()) {
            await appendJobLog(stdoutBuffer.trim(), 'INFO');
          }
          if (stderrBuffer.trim()) {
            await appendJobLog(stderrBuffer.trim(), 'ERROR');
          }

          const isSuccess = code === 0;
          const jobStatus = isSuccess ? 'completed' : 'failed';
          const errMsg = isSuccess ? null : `Scraper process exited with non-zero code ${code}`;

          await appendJobLog(
            isSuccess ? 'Scraper completed successfully.' : `Scraper failed with exit code ${code}`,
            isSuccess ? 'SUCCESS' : 'ERROR'
          );

          if (isLocalMode) {
            const jobs = readLocalJobs();
            if (jobs[job.id]) {
              jobs[job.id].status = jobStatus;
              if (errMsg) jobs[job.id].error_message = errMsg;
              jobs[job.id].updated_at = new Date().toISOString();
              writeLocalJobs(jobs);
            }
          } else if (supabase) {
            try {
              await supabaseWithRetry(() => supabase!
                .from('scrape_jobs')
                .update({
                  status: jobStatus,
                  error_message: errMsg,
                  updated_at: new Date().toISOString()
                })
                .eq('id', job.id)
              );
            } catch (dbErr: any) {
              console.error('Failed to update scraper job finish status:', dbErr.message);
            }
          }
          if (isSuccess) resolve();
          else reject(new Error(errMsg || 'Scraper failed'));
        });
      });
      return;
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
    const isActive = await isActiveRunner();
    if (!isActive) return;

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
    const isActive = await isActiveRunner();
    if (!isActive) return;
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
    const isActive = await isActiveRunner();
    if (!isActive) return;
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
    const isActive = await isActiveRunner();
    if (!isActive) return;
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
    const isActive = await isActiveRunner();
    if (!isActive) return;
    const configPath = path.resolve(process.cwd(), 'config.json');
    let autoQueueEnabled = false;
    let targetVolume = 10000;
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        autoQueueEnabled = config.autoQueueLagosDaily10k !== false;
        if (config.lagosDailyLeadTarget) {
          targetVolume = Number(config.lagosDailyLeadTarget);
        }
      } catch {}
    }

    if (!autoQueueEnabled) {
      console.log('[Scheduler] Daily automated Lagos Scraper is disabled in settings.');
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
      const maxJobs = Math.ceil(targetVolume / 100);
      console.log(`[Scheduler] 24h passed. Triggering automated daily Lagos Scraper (Target leads: ${targetVolume}, queuing ${maxJobs} jobs)...`);
      const response = await fetch(`${LOCAL_BASE_URL}/api/scrape/bulk-queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          limit: 100, 
          maxJobsToQueue: maxJobs,
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
  // Discover active port dynamically on startup
  async function discoverLocalPort(): Promise<string> {
    const portsToTarget = ['3006', '3005', '3009', '3000', '3007'];
    if (process.env.PORT && !portsToTarget.includes(process.env.PORT)) {
      portsToTarget.unshift(process.env.PORT);
    }
    
    console.log(`🔍 Probing local Next.js server ports: [${portsToTarget.join(', ')}]...`);
    for (const port of portsToTarget) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 400);
        const res = await fetch(`http://localhost:${port}/api/scrape/osm`, {
          method: 'OPTIONS',
          signal: controller.signal
        });
        clearTimeout(timer);
        if (res.ok || res.status === 404 || res.status === 405 || res.status === 200) {
          console.log(`🟢 Successfully discovered active Next.js API server on port: ${port}`);
          return port;
        }
      } catch (err) {
        // silent fallback to next port
      }
    }
    const fallbackPort = process.env.PORT || '3006';
    console.warn(`⚠️ Could not auto-detect active Next.js server. Falling back to port: ${fallbackPort}`);
    return fallbackPort;
  }

  // If a remote API URL is already configured, skip localhost port discovery
  if (process.env.SCRAPER_API_BASE_URL) {
    console.log(`🌐 Using pre-configured SCRAPER_API_BASE_URL: ${LOCAL_BASE_URL}`);
  } else {
    LOCAL_API_PORT = await discoverLocalPort();
    LOCAL_BASE_URL = `http://localhost:${LOCAL_API_PORT}`;
    console.log(`🌐 Base API URL resolved dynamically to: ${LOCAL_BASE_URL}`);
  }


  // Asynchronous Batch Deployment synchronization handler
  async function triggerBatchSync() {
    try {
      const isActive = await isActiveRunner();
      if (!isActive) return;
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
      // Suppress fetch errors silently — Next.js server may not be running locally
      const isFetchError = err.message?.toLowerCase().includes('fetch') || err.message?.toLowerCase().includes('econnrefused') || err.message?.toLowerCase().includes('network');
      if (!isFetchError) {
        console.error('❌ Error executing background batch sync:', err.message);
      }
    }
  }

  if (process.env.RUN_ONCE === 'true') {
    const isActive = await isActiveRunner();
    if (!isActive) {
      console.log('🏃 RUN_ONCE mode active but environment is inactive. Exiting.');
      process.exit(0);
    }
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
      currentJob: currentJob,
      port: LOCAL_API_PORT
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
        const runId = isHuggingFaceEnv ? 'huggingface_runner' : 'local_runner';
        // Delete older heartbeats to avoid table bloating
        await supabaseWithRetry(() => supabase!
          .from('logs')
          .delete()
          .eq('run_id', runId)
          .eq('step', 'heartbeat')
        );

        // Insert new heartbeat
        await supabaseWithRetry(() => supabase!
          .from('logs')
          .insert([{
            run_id: runId,
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

  // Autonomous 30-Second Continuous Multi-Source Lead Harvest Daemon
  async function runAutonomousLeadHarvest() {
    try {
      const isActive = await isActiveRunner();
      if (!isActive) return;
      
      const [solarRes, lagosRes] = await Promise.allSettled([
        harvestLiveSolarLeads(),
        harvestLiveLagosLeads()
      ]);

      if (solarRes.status === 'fulfilled' && solarRes.value.added > 0) {
        console.log(`⚡ [Autonomous Daemon] Solar Engine harvested +${solarRes.value.added} leads (Total: ${solarRes.value.totalSolar})`);
      }
      if (lagosRes.status === 'fulfilled' && lagosRes.value.added > 0) {
        console.log(`🏢 [Autonomous Daemon] Lagos Engine harvested +${lagosRes.value.added} leads (Total: ${lagosRes.value.totalLagos})`);
      }
    } catch (_) {}
  }

  // Initial trigger on startup
  runAutonomousLeadHarvest();
  await triggerBatchSync();

  // Run Autonomous Harvest Daemon every 30 seconds
  setInterval(runAutonomousLeadHarvest, 30 * 1000);
  console.log('⚡ Scheduled autonomous 30-second continuous multi-source lead harvest daemon.');

  // Run Batch Sync check every 1 minute
  setInterval(triggerBatchSync, 60 * 1000);
  console.log('⏰ Scheduled background Git-batch synchronization every 1 minute.');
})();
