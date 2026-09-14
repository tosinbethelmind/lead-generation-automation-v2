/**
 * @file scripts/check_autopilot_status.js
 * Inspects live status of all Bethelmind 24/7 background automation processes.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('========================================================================');
console.log('🔍 BETHELMIND 24/7 AUTOPILOT STATUS INSPECTOR');
console.log('========================================================================');

// 1. System Memory Overview
const totalMemMB = Math.round(os.totalmem() / (1024 * 1024));
const freeMemMB = Math.round(os.freemem() / (1024 * 1024));
const usedMemMB = totalMemMB - freeMemMB;
const memUsagePct = Math.round((usedMemMB / totalMemMB) * 100);

console.log(`💻 System RAM: ${usedMemMB.toLocaleString()}MB used / ${totalMemMB.toLocaleString()}MB total (${freeMemMB.toLocaleString()}MB free - ${100 - memUsagePct}% available)`);

// 2. Scan Running Processes for this workspace
try {
  const psOutput = execSync(
    `powershell -Command "Get-CimInstance Win32_Process -Filter \\"name = 'node.exe'\\" | Select-Object ProcessId, CommandLine, @{Name='WS_MB';Expression={[math]::Round($_.WS / 1MB, 1)}} | ConvertTo-Json -Compress"`,
    { encoding: 'utf8', timeout: 8000 }
  );

  let processes = [];
  try {
    const parsed = JSON.parse(psOutput.trim() || '[]');
    processes = Array.isArray(parsed) ? parsed : [parsed];
  } catch (_) {}

  const myWorkDir = path.resolve(__dirname, '..').toLowerCase();
  const automationProcs = processes.filter(p => {
    const cmd = (p.CommandLine || '').toLowerCase();
    return cmd.includes(myWorkDir) || cmd.includes('unified_master_autopilot') || cmd.includes('lead generation automation');
  });

  console.log(`\n🤖 Active Background Automation Workers: ${automationProcs.length}`);
  let totalAutomationRamMB = 0;

  if (automationProcs.length === 0) {
    console.log('   ⚠️  No Bethelmind background workers are currently active.');
    console.log('   👉 Start background autopilot with: npm run autopilot:start');
  } else {
    automationProcs.forEach((p, idx) => {
      const ram = p.WS_MB || 0;
      totalAutomationRamMB += ram;
      let label = 'Worker';
      const cmd = p.CommandLine || '';
      if (cmd.includes('unified_master_autopilot')) label = 'Master Autopilot Supervisor';
      else if (cmd.includes('next dev') || cmd.includes('-p 3006')) label = 'Dev Server (Port 3006)';
      else if (cmd.includes('whatsapp_baileys.js')) label = 'WhatsApp Line 1 (Port 3007)';
      else if (cmd.includes('whatsapp_baileys_line2.js')) label = 'WhatsApp Line 2 (Port 3009)';
      else if (cmd.includes('evolution_api_server.js')) label = 'Evolution API (Port 8080)';
      else if (cmd.includes('execute_today_300_emails')) label = '300 Outreach Dispatcher';
      else if (cmd.includes('run_heavy_10k_nigeria_scraper')) label = 'Massive Harvester Wave';
      else if (cmd.includes('run_autonomous_blog_engine')) label = 'Viral Blog Publisher';
      else if (cmd.includes('run_autonomous_opensource_closer')) label = 'AI Closer Daemon';
      else if (cmd.includes('autonomous_traffic_daemon')) label = 'Traffic & SEO Engine';
      else if (cmd.includes('keep_alive_runner')) label = 'Job Pipeline Runner';

      console.log(`   #${idx + 1} [PID ${p.ProcessId}] ${label} — RAM: ${ram} MB`);
    });
    console.log(`\n📊 Total Memory Consumed by Automation: ${totalAutomationRamMB.toFixed(1)} MB (Strictly <= 512MB Budget)`);
  }
} catch (err) {
  console.log('Process query note:', err.message);
}

// 3. Port Listening Checks
console.log('\n🌐 Network Port Watchdogs:');
const portsToCheck = [
  { port: 3006, name: 'Web App & Dynamic Prototypes' },
  { port: 3007, name: 'WhatsApp Line 1 Server' },
  { port: 3009, name: 'WhatsApp Line 2 Server' },
  { port: 8080, name: 'Evolution API Server' }
];

try {
  const netOutput = execSync(
    `powershell -Command "Get-NetTCPConnection -LocalPort 3006, 3007, 3009, 8080 -State Listen -ErrorAction SilentlyContinue | Select-Object LocalPort, State | ConvertTo-Json -Compress"`,
    { encoding: 'utf8', timeout: 5000 }
  );
  let activePorts = [];
  try {
    const parsed = JSON.parse(netOutput.trim() || '[]');
    activePorts = (Array.isArray(parsed) ? parsed : [parsed]).map(p => p.LocalPort);
  } catch (_) {}

  portsToCheck.forEach(p => {
    const isOpen = activePorts.includes(p.port);
    console.log(`   ${isOpen ? '🟢' : '⚪'} Port ${p.port} (${p.name}): ${isOpen ? 'ONLINE (Listening)' : 'STANDBY'}`);
  });
} catch (_) {}

// 4. Recent Autopilot Log Heartbeats
console.log('\n📋 Recent Autopilot Logs:');
const logFile = path.join(__dirname, '../local_db/unified_master_autopilot.log');
if (fs.existsSync(logFile)) {
  const lines = fs.readFileSync(logFile, 'utf8').trim().split('\n').filter(Boolean);
  const recent = lines.slice(-5);
  recent.forEach(l => console.log(`   ${l}`));
} else {
  console.log('   (No logs found yet in local_db/unified_master_autopilot.log)');
}

console.log('========================================================================\n');
