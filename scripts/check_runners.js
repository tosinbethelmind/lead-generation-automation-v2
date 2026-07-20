const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
const content = fs.readFileSync(envPath, 'utf8');
const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)/);
const keyMatch = content.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']?([^"'\r\n]+)/);

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function checkRunners() {
  // Get latest heartbeats from all runners
  const { data: heartbeats } = await supabase
    .from('logs')
    .select('*')
    .eq('step', 'heartbeat')
    .order('created_at', { ascending: false })
    .limit(10);

  // Get recent job stats
  const { data: recentJobs } = await supabase
    .from('scrape_jobs')
    .select('type, status, updated_at')
    .order('updated_at', { ascending: false })
    .limit(20);

  const now = Date.now();

  console.log('=== CLOUD RUNNER STATUS ===\n');
  if (heartbeats?.length > 0) {
    const seen = new Set();
    heartbeats.forEach(h => {
      let info = {};
      try { info = JSON.parse(h.message); } catch {}
      const key = `${h.run_id}_${info.pid}`;
      if (seen.has(key)) return;
      seen.add(key);
      const lastSeen = info.last_seen ? new Date(info.last_seen) : new Date(h.created_at);
      const ageMs = now - lastSeen.getTime();
      const ageMins = Math.round(ageMs / 60000);
      const status = ageMs < 5 * 60 * 1000 ? '🟢 ONLINE' : ageMs < 30 * 60 * 1000 ? '🟡 STALE' : '🔴 OFFLINE';
      console.log(`Runner [${h.run_id}] | PID: ${info.pid || 'N/A'} | Last Heartbeat: ${ageMins} min ago | Status: ${status} | Job: ${info.currentJob ? JSON.stringify(info.currentJob) : 'idle'}`);
    });
  } else {
    console.log('No heartbeat logs found.');
  }

  console.log('\n=== RECENT JOBS (Last 20) ===\n');
  const stats = { completed: 0, failed: 0, queued: 0, running: 0 };
  recentJobs?.forEach(j => {
    stats[j.status] = (stats[j.status] || 0) + 1;
  });
  console.log(`Completed: ${stats.completed} | Failed: ${stats.failed} | Queued: ${stats.queued} | Running: ${stats.running}`);
  console.log('\nFailed jobs:');
  recentJobs?.filter(j => j.status === 'failed').forEach(j => console.log(`  - type=${j.type} | updated=${j.updated_at}`));
}

checkRunners();
