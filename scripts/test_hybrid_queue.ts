import { spawn, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Load credentials
function loadConfig() {
  let supabaseUrl = '';
  let supabaseKey = '';

  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)/);
    const keyMatch = content.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']?([^"'\r\n]+)/);
    if (urlMatch) supabaseUrl = urlMatch[1];
    if (keyMatch) supabaseKey = keyMatch[1];
  }

  const configPath = path.resolve(process.cwd(), 'config.json');
  if (fs.existsSync(configPath) && (!supabaseUrl || !supabaseKey)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (!supabaseUrl) supabaseUrl = config.supabaseUrl || '';
      if (!supabaseKey) supabaseKey = config.supabaseKey || '';
    } catch (e) {}
  }

  return { supabaseUrl, supabaseKey };
}

const { supabaseUrl, supabaseKey } = loadConfig();
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing.');
  process.exit(1);
}

// Override execution mode environment variable for testing
const envPath = path.resolve(process.cwd(), '.env.local');
let originalEnv = '';
let envExisted = false;

if (fs.existsSync(envPath)) {
  originalEnv = fs.readFileSync(envPath, 'utf8');
  envExisted = true;
  if (!originalEnv.includes('SCRAPER_EXECUTION_MODE')) {
    fs.appendFileSync(envPath, '\nSCRAPER_EXECUTION_MODE=local\n');
  } else {
    const updated = originalEnv.replace(/SCRAPER_EXECUTION_MODE\s*=\s*\w+/, 'SCRAPER_EXECUTION_MODE=local');
    fs.writeFileSync(envPath, updated, 'utf8');
  }
} else {
  fs.writeFileSync(envPath, 'SCRAPER_EXECUTION_MODE=local\n', 'utf8');
}

async function runTest() {
  console.log('====================================================');
  console.log('🤖 Starting Automated Hybrid Scraper Queue Test...');
  console.log('====================================================');
  
  // 1. Start dev server (runs on port 3006 in dev mode)
  console.log('⚡ Starting Next.js Dev Server on port 3006...');
  const devServer = spawn('npm', ['run', 'dev'], { 
    shell: true, 
    env: { ...process.env, SCRAPER_EXECUTION_MODE: 'local', PORT: '3006' } 
  });
  
  devServer.stdout.on('data', (data) => {
    const cleanLog = data.toString().trim();
    if (cleanLog) {
      console.log(`[Next.js Dev]: ${cleanLog}`);
    }
  });
  devServer.stderr.on('data', (data) => {
    const cleanLog = data.toString().trim();
    if (cleanLog) {
      console.error(`[Next.js Dev Err]: ${cleanLog}`);
    }
  });

  // 2. Start local job runner
  console.log('🏃 Starting Local Job Runner...');
  const runner = spawn('npm', ['run', 'local-runner'], { 
    shell: true,
    env: { ...process.env, SCRAPER_EXECUTION_MODE: 'local', PORT: '3006' }
  });

  runner.stdout.on('data', (data) => {
    const cleanLog = data.toString().trim();
    if (cleanLog) {
      console.log(`[Runner Log]: ${cleanLog}`);
    }
  });

  // Wait for dev server to boot up by polling it
  console.log('⏳ Waiting for dev server to initialize...');
  let serverReady = false;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:3006/');
      if (res.status === 200) {
        serverReady = true;
        break;
      }
    } catch (e) {
      // not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  if (!serverReady) {
    console.error('❌ Dev server failed to start on port 3006 within 30 seconds.');
    devServer.kill();
    runner.kill();
    process.exit(1);
  }
  console.log('⚡ Dev server is ready!');

  let testPassed = false;
  
  try {
    // 3. Dispatch post request to trigger a queued job
    console.log('📨 Triggering sandbox OSM scrape via API...');
    const response = await fetch('http://localhost:3006/api/scrape/osm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'sandbox dentist',
        limit: 2
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to call scrape endpoint: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📥 Received API Response:', data);

    if (data.status !== 'queued' || !data.jobId) {
      throw new Error(`Expected job to be queued. Got: ${JSON.stringify(data)}`);
    }

    console.log(`🔍 Job queued successfully. ID: ${data.jobId}`);
    console.log('⏳ Polling job status via API...');

    // 4. Poll job status
    let attempts = 0;
    const maxAttempts = 15;
    
    while (attempts < maxAttempts) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const jobResp = await fetch(`http://localhost:3006/api/scrape/jobs/${data.jobId}`);
      if (!jobResp.ok) continue;

      const job = await jobResp.json();
      console.log(`   [Attempt ${attempts}] Job Status: ${job.status}`);

      if (job.status === 'completed') {
        console.log('🎉 Test Success! Job processed by local runner.');
        console.log('📊 Result summary:', job.result);
        testPassed = true;
        break;
      } else if (job.status === 'failed') {
        throw new Error(`Job execution failed: ${job.error_message}`);
      }
    }

    if (!testPassed) {
      throw new Error('Job execution timed out.');
    }

  } catch (err: any) {
    console.error('❌ Test Failed:', err.message);
  } finally {
    // 5. Cleanup
    console.log('🛑 Shutting down dev server and job runner...');
    if (process.platform === 'win32') {
      try {
        if (devServer.pid) execSync(`taskkill /pid ${devServer.pid} /T /F`, { stdio: 'ignore' });
      } catch (e) {}
      try {
        if (runner.pid) execSync(`taskkill /pid ${runner.pid} /T /F`, { stdio: 'ignore' });
      } catch (e) {}
    } else {
      devServer.kill();
      runner.kill();
    }

    // Restore .env.local
    try {
      if (envExisted) {
        fs.writeFileSync(envPath, originalEnv, 'utf8');
      } else if (fs.existsSync(envPath)) {
        fs.unlinkSync(envPath);
      }
    } catch (e) {
      console.error('Failed to restore .env.local:', e);
    }

    process.exit(testPassed ? 0 : 1);
  }
}

runTest();
