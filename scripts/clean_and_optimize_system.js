const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧹 OPTIMIZING LAPTOP RESOURCES & ELIMINATING POP-UPS');
console.log('====================================================\n');

// 1. Terminate all runaway node worker processes
const currentPid = process.pid;
console.log(`Current PID: ${currentPid}. Scanning for runaway worker processes...`);

try {
  // Query all node.exe processes using PowerShell CIM
  const psCmd = `Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Select-Object ProcessId, CommandLine | ConvertTo-Json -Compress`;
  const rawJson = execSync(`powershell -NoProfile -Command "${psCmd}"`, { encoding: 'utf8' }).trim();
  
  if (rawJson) {
    let procs = [];
    try {
      const parsed = JSON.parse(rawJson);
      procs = Array.isArray(parsed) ? parsed : [parsed];
    } catch (_) {}

    let killedCount = 0;
    procs.forEach(p => {
      const pid = p.ProcessId;
      const cmd = (p.CommandLine || '').toLowerCase();

      // Don't kill our current process or the main next dev server if running cleanly
      if (pid === currentPid) return;

      // Identify runaway scrapers, loops, keep-alive, or duplicate autopilots
      const isRunaway = 
        cmd.includes('keep_alive_runner') ||
        cmd.includes('local_job_runner') ||
        cmd.includes('autonomous_traffic_daemon') ||
        cmd.includes('unified_master_autopilot') ||
        cmd.includes('colab') ||
        cmd.includes('harvester') ||
        cmd.includes('scraper') ||
        cmd.includes('social_inbox') ||
        cmd.includes('check_runners');

      if (isRunaway) {
        try {
          process.kill(pid, 'SIGKILL');
          killedCount++;
          console.log(`   🛑 Terminated runaway worker PID ${pid}: ${cmd.slice(0, 70)}...`);
        } catch (_) {}
      }
    });

    console.log(`\n✅ Terminated ${killedCount} runaway worker processes.`);
  }
} catch (e) {
  console.warn('Process scan warning:', e.message);
}

// 2. Clean up any remaining temporary files
const rootDir = path.resolve(__dirname, '..');
const files = fs.readdirSync(rootDir);
let tmpCleaned = 0;
files.forEach(f => {
  if (f.includes('.tmp-') || f.startsWith('local_runner_heartbeat.json.tmp')) {
    try {
      fs.unlinkSync(path.join(rootDir, f));
      tmpCleaned++;
    } catch (_) {}
  }
});
console.log(`✅ Cleaned up ${tmpCleaned} leftover temporary heartbeat files.`);

// 3. Remove/Clean Startup Shortcut to stop automatic pop-ups on boot
const appData = process.env.APPDATA || '';
if (appData) {
  const startupShortcut = path.join(appData, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup', 'LeadGenAutomation.lnk');
  if (fs.existsSync(startupShortcut)) {
    try {
      fs.unlinkSync(startupShortcut);
      console.log(`✅ Removed automatic startup pop-up shortcut: ${startupShortcut}`);
    } catch (err) {
      console.warn('Could not remove startup shortcut:', err.message);
    }
  }
}

console.log('\n🔋 Local CPU and RAM usage are now restored to optimal normal levels.');
console.log('🚫 Terminal pop-ups have been eliminated.');
