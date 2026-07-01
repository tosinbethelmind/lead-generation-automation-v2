import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Resolve environment configuration (from .env.local or config.json)
function loadConfig() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  // Attempt to parse .env.local
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)/);
    const keyMatch = content.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']?([^"'\r\n]+)/);
    if (urlMatch && !supabaseUrl) supabaseUrl = urlMatch[1];
    if (keyMatch && !supabaseKey) supabaseKey = keyMatch[1];
  }

  // Attempt to fallback to config.json
  const configPath = path.resolve(process.cwd(), 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (!supabaseUrl) supabaseUrl = config.supabaseUrl || '';
      if (!supabaseKey) supabaseKey = config.supabaseKey || '';
    } catch (e) {
      console.warn('Error reading config.json:', e);
    }
  }

  return { supabaseUrl, supabaseKey };
}

const { supabaseUrl, supabaseKey } = loadConfig();

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials missing.');
  console.error('Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local or config.json.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const LOCAL_API_PORT = process.env.PORT || '3005';
const LOCAL_BASE_URL = `http://localhost:${LOCAL_API_PORT}`;

console.log('====================================================');
console.log('🚀 Local Scraping Job Runner Started');
console.log(`Supabase URL: ${supabaseUrl}`);
console.log(`Local Next.js URL: ${LOCAL_BASE_URL}`);
console.log('====================================================');

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

async function processJob(job: any) {
  console.log(`\n[${new Date().toISOString()}] Processing Job: ${job.id} (Type: ${job.type})`);
  
  // 1. Mark job as running
  const { error: updateError } = await supabase
    .from('scrape_jobs')
    .update({ 
      status: 'running', 
      updated_at: new Date().toISOString() 
    })
    .eq('id', job.id);

  if (updateError) {
    console.error(`❌ Failed to update status to "running" for job ${job.id}:`, updateError.message);
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
    const { error: completeError } = await supabase
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
      .eq('id', job.id);

    if (completeError) {
      console.error(`❌ Failed to update status to "completed" for job ${job.id}:`, completeError.message);
    } else {
      console.log(`✅ Job ${job.id} completed successfully. Added: ${resultData.added || 0}, Skipped: ${resultData.skipped || 0}`);
    }
  } catch (err: any) {
    console.error(`❌ Error executing job ${job.id}:`, err.message);
    await failJob(job.id, err.message);
  }
}

async function failJob(id: string, errorMessage: string) {
  const { error } = await supabase
    .from('scrape_jobs')
    .update({
      status: 'failed',
      error_message: errorMessage,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error(`❌ Failed to mark job ${id} as failed:`, error.message);
  } else {
    console.log(`⚠️ Marked job ${id} as failed.`);
  }
}

async function pollQueue() {
  try {
    const { data: jobs, error } = await supabase
      .from('scrape_jobs')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(1);

    if (error) {
      console.error('Error polling queue from Supabase:', error.message);
      return;
    }

    if (jobs && jobs.length > 0) {
      await processJob(jobs[0]);
    }
  } catch (err: any) {
    console.error('Unexpected error during queue polling:', err.message);
  }
}

async function resetStuckJobs() {
  try {
    console.log('🔄 Cleaning up and resetting stuck/running jobs...');
    const { error } = await supabase
      .from('scrape_jobs')
      .update({ 
        status: 'queued', 
        updated_at: new Date().toISOString() 
      })
      .eq('status', 'running');

    if (error) {
      console.error('❌ Failed to reset stuck jobs:', error.message);
    } else {
      console.log('✅ Stuck/running jobs successfully reset back to queued state.');
    }
  } catch (err: any) {
    console.error('Unexpected error resetting stuck jobs:', err.message);
  }
}

async function checkAndRecoverStuckJobs() {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    console.log(`🔍 [${new Date().toISOString()}] Checking for jobs stuck in 'running' state since before ${fifteenMinutesAgo}...`);
    
    const { data: stuckJobs, error: fetchError } = await supabase
      .from('scrape_jobs')
      .select('id, type')
      .eq('status', 'running')
      .lt('updated_at', fifteenMinutesAgo);
      
    if (fetchError) {
      console.error('❌ Failed to fetch stuck jobs:', fetchError.message);
      return;
    }
    
    if (stuckJobs && stuckJobs.length > 0) {
      console.log(`⚠️ Found ${stuckJobs.length} stuck jobs. Marking them as failed...`);
      for (const job of stuckJobs) {
        await failJob(job.id, 'Job execution timed out (stuck in running state for over 15 minutes).');
      }
    } else {
      console.log('✅ No stuck jobs found.');
    }
  } catch (err: any) {
    console.error('Unexpected error checking for stuck jobs:', err.message);
  }
}

// Start queue polling, run startup recovery, and set intervals
(async () => {
  await resetStuckJobs();
  await checkAndRecoverStuckJobs();
  
  // Poll queue for new jobs every 3 seconds
  setInterval(pollQueue, 3000);
  console.log('🔍 Polling queue every 3 seconds...');
  
  // Scan for stuck jobs every 5 minutes
  setInterval(checkAndRecoverStuckJobs, 5 * 60 * 1000);
  console.log('⏰ Scheduled stuck job recovery checks every 5 minutes.');
})();
