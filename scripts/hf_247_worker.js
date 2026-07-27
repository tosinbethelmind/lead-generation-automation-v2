const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://szyuterncawfxwzhvwcf.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eXV0ZXJuY2F3Znh3emh2d2NmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM5ODIwOSwiZXhwIjoyMDk3OTc0MjA5fQ._SzfC4NE4KCwWkK_GFQAyQjgkFrQLhbpz1w9R3FIUBY';
const supabase = createClient(supabaseUrl, supabaseKey);

function log(msg) {
  const timestamp = new Date().toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos' }) + ' WAT';
  console.log(`[HF 24/7 Worker ${timestamp}] ${msg}`);
}

async function runHarvestPass() {
  log('⚡ Starting 24/7 Cloud Harvester Pass...');
  try {
    const fetchRes = await fetch('https://lead-generation-automation-ecru.vercel.app/api/cron/harvest');
    const data = await fetchRes.json();
    log(`✓ Harvest Pass Done: Lagos: +${data.results?.lagos?.added || 0}, Solar: +${data.results?.solar?.added || 0}`);

    await supabase.from('logs').insert([{
      run_id: `hf_worker_${Date.now()}`,
      step: 'HF_247_WORKER_HEARTBEAT',
      status: 'SUCCESS',
      message: `🟢 [Hugging Face 24/7 Worker] Cloud Worker Pulse: Lagos (+${data.results?.lagos?.added || 0}), Solar (+${data.results?.solar?.added || 0})`,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    }]);
  } catch (err) {
    log(`⚠️ Harvest Pass warn: ${err.message}`);
  }
}

async function mainLoop() {
  log('==================================================');
  log('🚀 ApexReach Hugging Face 24/7 Worker Initialized');
  log('==================================================');

  while (true) {
    await runHarvestPass();
    log('Sleeping for 20 minutes before next harvest cycle...');
    await new Promise(r => setTimeout(r, 20 * 60 * 1000));
  }
}

mainLoop().catch(err => {
  log(`Fatal error in HF worker: ${err.message}`);
  process.exit(0);
});
