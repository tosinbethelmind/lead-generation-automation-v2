const fs = require('fs');
const path = require('path');

// Read setup/env variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SCRAPER_API_BASE_URL = process.env.SCRAPER_API_BASE_URL;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

if (!SCRAPER_API_BASE_URL) {
  console.error('❌ Missing SCRAPER_API_BASE_URL in environment.');
  process.exit(1);
}

const ENDPOINT_MAP = {
  jiji: 'jiji',
  osm: 'osm',
  'maps-free': 'maps-free',
  social: 'social',
  duckduckgo: 'duckduckgo',
  maps: 'maps',
  google: 'maps'
};

const startTime = Date.now();
const MAX_RUN_TIME = 9 * 60 * 1000; // 9 minutes
let currentJob = null;

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function supabaseRequest(method, endpoint, body = null, headers = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const defaultHeaders = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...headers
  };

  const options = {
    method,
    headers: defaultHeaders
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const maxRetries = 4;
  let delay = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const text = await res.text();
        if (res.status >= 500 || res.status === 429) {
          if (attempt === maxRetries) {
            throw new Error(`Supabase API error (${method} ${endpoint}): Status ${res.status} - ${text}`);
          }
          console.warn(`[Network Retry] Supabase API returned status ${res.status} (${method} ${endpoint}). Retrying in ${delay / 1000}s (Attempt ${attempt}/${maxRetries})...`);
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
          continue;
        } else {
          throw new Error(`Supabase API error (${method} ${endpoint}): Status ${res.status} - ${text}`);
        }
      }

      if (res.status === 204) return true;
      const text = await res.text();
      if (!text || text.trim() === '') return null;
      try {
        return JSON.parse(text);
      } catch (jsonErr) {
        throw new Error(`Failed to parse JSON response from ${method} ${endpoint} (Status ${res.status}): "${text.substring(0, 150)}". error: ${jsonErr.message}`);
      }
    } catch (err) {
      if (attempt === maxRetries) {
        throw err;
      }
      console.warn(`[Network Retry] Supabase API request failed (${method} ${endpoint}) with error: "${err.message}". Retrying in ${delay / 1000}s (Attempt ${attempt}/${maxRetries})...`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

async function updateJobStatus(jobId, status, errorMessage = null, result = null) {
  const payload = {
    status,
    updated_at: new Date().toISOString()
  };
  if (errorMessage) {
    payload.error_message = errorMessage;
  }
  if (result) {
    payload.result = result;
  }

  await supabaseRequest('PATCH', `scrape_jobs?id=eq.${jobId}`, payload);
}

async function processJob(job) {
  const jobId = job.id;
  const jobType = job.type;
  const payload = job.payload || {};

  currentJob = {
    id: jobId,
    type: jobType,
    payload,
    startedAt: new Date().toISOString()
  };

  log(`Processing Job: ${jobId} (Type: ${jobType})`);

  try {
    // 1. Optimistic Locking status update to 'running'
    const res = await supabaseRequest(
      'PATCH',
      `scrape_jobs?id=eq.${jobId}&status=eq.queued`,
      { status: 'running', updated_at: new Date().toISOString() },
      { 'Prefer': 'return=representation' }
    );

    // If returned row array is empty, job was already claimed by another runner
    if (!res || res.length === 0) {
      log(`Job ${jobId} already claimed or running elsewhere. Skipping.`);
      currentJob = null;
      return;
    }

    // 1.5. Direct execution for solar_scrape and solar_nigeria_5k to avoid serverless HTTP timeout
    if (jobType === 'solar_scrape' || jobType === 'solar_nigeria_5k') {
      const { spawn } = require('child_process');
      const scriptName = jobType === 'solar_nigeria_5k' ? 'nigeria_solar_5k_scraper.js' : 'mass_solar_scraper.js';
      const scriptPath = path.resolve(process.cwd(), 'scripts', scriptName);
      const args = [];
      const mode = payload.mode;
      const count = payload.count;
      
      if (mode === 'synthetic') {
        args.push('--synthetic');
        args.push('--count');
        args.push(String(count || (jobType === 'solar_nigeria_5k' ? 5000 : 1000)));
      } else if (mode === 'dry-run') {
        args.push('--dry-run');
        if (count) {
          args.push('--count');
          args.push(String(count));
        }
      } else if (mode === 'live-solar') {
        if (jobType === 'solar_scrape') {
          args.push('--solar-only');
        } else {
          args.push('--count');
          args.push(String(count || 5000));
        }
      } else if (count) {
        args.push('--count');
        args.push(String(count));
      }
      
      const childArgs = [...args, '--run-id', jobId];
      log(`[github_actions_runner] Spawning direct scraper (${scriptName}, Job: ${jobId}) with args: ${childArgs.join(' ')}`);
      
      const child = spawn(process.execPath, [scriptPath, ...childArgs], {
        env: {
          ...process.env,
        },
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      const appendJobLog = async (msg, status) => {
        console.log(`[Job ${jobId}] [${status}] ${msg}`);
        try {
          await supabaseRequest('POST', 'logs', [{
            run_id: jobId,
            timestamp: new Date().toISOString(),
            step: 'solar_scraper',
            status: status,
            message: msg
          }]);
        } catch (dbErr) {
          console.error('Failed to write log to DB:', dbErr.message);
        }
      };

      await appendJobLog(`Mass scraper runner process initialized in mode: ${mode || 'production'} (count: ${count || 'default'})`, 'START');

      let stdoutBuffer = '';
      child.stdout.on('data', (data) => {
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
      child.stderr.on('data', (data) => {
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

      await new Promise((resolve, reject) => {
        child.on('close', async (code) => {
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

          try {
            await updateJobStatus(jobId, jobStatus, errMsg);
          } catch (dbErr) {
            console.error('Failed to update scraper job finish status:', dbErr.message);
          }
          if (isSuccess) resolve();
          else reject(new Error(errMsg || 'Scraper failed'));
        });
      });
      return;
    }

    // 2. Resolve endpoint URL
    const pathName = ENDPOINT_MAP[jobType];
    if (!pathName) {
      const err = `Unsupported job type: ${jobType}`;
      log(`Error: ${err}`);
      await updateJobStatus(jobId, 'failed', err);
      currentJob = null;
      return;
    }

    const endpointUrl = `${SCRAPER_API_BASE_URL.replace(/\/$/, '')}/api/scrape/${pathName}`;
    log(`Forwarding job ${jobId} payload to Vercel API: ${endpointUrl}`);

    // Adjust timeout to 8 minutes internally
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 8 * 60 * 1000);

    const apiRes = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-queue': 'true'
      },
      body: JSON.stringify({
        ...payload,
        bypassQueue: true
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      throw new Error(`Scraper API returned code ${apiRes.status}: ${errorText}`);
    }

    const resultData = await apiRes.json();
    if (resultData.error) {
      throw new Error(resultData.error);
    }

    const added = resultData.added || 0;
    const skipped = resultData.skipped || 0;
    const leadsCount = Array.isArray(resultData.leads) ? resultData.leads.length : 0;

    const resultPayload = { added, skipped, leadsCount };
    await updateJobStatus(jobId, 'completed', null, resultPayload);
    log(`✅ Job ${jobId} completed successfully! Added: ${added}, Skipped: ${skipped}`);

  } catch (err) {
    log(`❌ Job execution failed for ${jobId}: ${err.message}`);
    await updateJobStatus(jobId, 'failed', err.message);
  } finally {
    currentJob = null;
  }
}

async function writeHeartbeat() {
  const heartbeatData = {
    last_seen: Date.now(),
    pid: process.pid,
    currentJob: currentJob,
    port: null
  };

  try {
    // 1. Delete prior heartbeats
    await supabaseRequest('DELETE', 'logs?run_id=eq.github_actions_runner&step=eq.heartbeat');
    // 2. Insert new heartbeat
    await supabaseRequest('POST', 'logs', [{
      run_id: 'github_actions_runner',
      step: 'heartbeat',
      status: 'INFO',
      message: JSON.stringify(heartbeatData)
    }]);
  } catch (e) {
    // Silent fail on temp connectivity errors
  }
}

async function runCronChecks() {
  // 1. Trigger Scheduled Campaigns check
  try {
    const schedUrl = `${SCRAPER_API_BASE_URL.replace(/\/$/, '')}/api/schedule`;
    await fetch(schedUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'trigger-next', force: false })
    });
  } catch (e) {}

  // 2. Trigger Lagos Daily Scraper check
  try {
    const dailyUrl = `${SCRAPER_API_BASE_URL.replace(/\/$/, '')}/api/schedule/lagos-10k`;
    await fetch(dailyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autoQueue: true })
    });
  } catch (e) {}

  // 3. Trigger Git batch synchronization trigger
  try {
    const cronSecret = process.env.CRON_SECRET || 'apexreach_sync_secret';
    const syncUrl = `${SCRAPER_API_BASE_URL.replace(/\/$/, '')}/api/deploy/batch-sync?secret=${cronSecret}`;
    await fetch(syncUrl, { method: 'GET' });
  } catch (e) {}

  // 4. Recover stuck running jobs (timed out after 15m)
  try {
    const runningJobs = await supabaseRequest('GET', 'scrape_jobs?status=eq.running');
    if (runningJobs && runningJobs.length > 0) {
      for (const j of runningJobs) {
        const updatedTime = new Date(j.updated_at).getTime();
        const diff = (Date.now() - updatedTime) / 1000;
        if (diff > 900) {
          log(`Stuck job found: ${j.id} (running since ${j.updated_at}). Mark as failed.`);
          await updateJobStatus(j.id, 'failed', 'Job execution timed out (running > 15 minutes).');
        }
      }
    }
  } catch (e) {}
}

async function main() {
  log('🚀 GitHub Actions Cloud Runner Initiated.');
  
  // Write initial heartbeat and start background heartbeat interval
  await writeHeartbeat();
  const heartbeatInterval = setInterval(async () => {
    await writeHeartbeat();
  }, 5000);
  
  // Run scheduled triggers immediately on startup
  log('🔄 Triggering background campaign and scheduled tasks...');
  await runCronChecks();

  let consecutiveEmptyPolls = 0;

  try {
    while (Date.now() - startTime < MAX_RUN_TIME) {
      // 1. Fetch next queued job
      let jobs = [];
      try {
        jobs = await supabaseRequest('GET', 'scrape_jobs?status=eq.queued&order=created_at.asc&limit=1');
      } catch (err) {
        log(`Error polling queue: ${err.message}`);
        await new Promise(r => setTimeout(r, 5000));
        continue;
      }

      if (jobs && jobs.length > 0) {
        consecutiveEmptyPolls = 0;
        await processJob(jobs[0]);
      } else {
        consecutiveEmptyPolls++;
        // If queue remains empty for 4 polls (~20 seconds), exit to save action minutes
        if (consecutiveEmptyPolls >= 4) {
          log(`💤 Queue empty after multiple checks. Gracefully exiting script.`);
          break;
        }
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  } finally {
    clearInterval(heartbeatInterval);
  }

  // 3. Chain-trigger next run if queue is still populated
  try {
    const remainingJobs = await supabaseRequest('GET', 'scrape_jobs?status=eq.queued&limit=1');
    if (remainingJobs && remainingJobs.length > 0) {
      log('🔄 Queue is not empty and job runner timed out. Querying configuration for chain-trigger...');
      const appSettings = await supabaseRequest('GET', 'app_settings?key=eq.apexreach_runtime_config');
      if (appSettings && appSettings.length > 0) {
        const parsed = JSON.parse(appSettings[0].value || '{}');
        const token = parsed.githubToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
        const repo = parsed.githubRepo || process.env.GITHUB_REPOSITORY;
        if (token && repo) {
          log(`🔄 Triggering chain-execution run for ${repo}...`);
          const triggerUrl = `https://api.github.com/repos/${repo}/dispatches`;
          const response = await fetch(triggerUrl, {
            method: 'POST',
            headers: {
              'Accept': 'application/vnd.github+json',
              'Authorization': `Bearer ${token}`,
              'X-GitHub-Api-Version': '2022-11-28',
              'User-Agent': 'ApexReach-App-ChainTrigger'
            },
            body: JSON.stringify({ event_type: 'run-queue' })
          });
          if (response.ok) {
            log('✅ Chain execution triggered successfully!');
          } else {
            const txt = await response.text();
            log(`❌ Chain trigger failed: ${response.status} - ${txt}`);
          }
        } else {
          log('⚠️ GitHub Token or Repo is not configured in database settings. Cannot trigger chain run.');
        }
      }
    }
  } catch (e) {
    log(`⚠️ Failed to chain trigger next run: ${e.message}`);
  }

  log('👋 GitHub Actions Cloud Runner Done.');
}

main().catch(err => {
  console.error('Fatal crash inside runner:', err);
  process.exit(1);
});
