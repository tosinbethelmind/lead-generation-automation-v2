/**
 * @file scripts/purge_orphaned_zombies.js
 * 
 * Safely terminates orphaned patchright/playwright driver nodes, duplicate tsx processes,
 * and releases stranded system RAM back to the laptop while keeping the master autopilot
 * and Next.js dev server protected.
 */

const { execSync } = require('child_process');

console.log('='.repeat(70));
console.log('🧹 PURGING ORPHANED ZOMBIE PROCESSES & ENFORCING FAIR DATA USE');
console.log('='.repeat(70));

const myPid = process.pid;

try {
  const output = execSync('wmic process where "name=\'node.exe\'" get ProcessId,CommandLine,WorkingSetSize /format:csv', { encoding: 'utf-8' });
  const lines = output.trim().split('\n').filter(l => l.trim().length > 0);
  
  let killedCount = 0;
  let freedBytes = 0;

  lines.slice(1).forEach(line => {
    const parts = line.split(',');
    if (parts.length >= 4) {
      const pidStr = parts[parts.length - 2].trim();
      const pid = parseInt(pidStr, 10);
      const ws = parseInt(parts[parts.length - 1].trim(), 10) || 0;
      const cmd = parts.slice(1, parts.length - 2).join(',').toLowerCase();

      if (pid === myPid) return;

      // Never kill master autopilot or next dev server or evolution server
      const isProtected = 
        cmd.includes('unified_master_autopilot.js') ||
        cmd.includes('evolution_api_server.js') ||
        cmd.includes('next dev');

      if (isProtected) {
        console.log(`🛡️  Protected Active Daemon [PID ${pid}]: ${cmd.slice(0, 70)}...`);
        return;
      }

      // Kill orphaned playwright/patchright driver nodes, stuck tsx CLI, or old crawlee/scout instances
      const isZombie = 
        cmd.includes('patchright') ||
        cmd.includes('playwright') ||
        cmd.includes('ms-playwright') ||
        cmd.includes('npx-cli.js') ||
        cmd.includes('tsx/dist/cli.mjs') ||
        cmd.includes('run_scout_lead_harvester') ||
        cmd.includes('run_crawlee_harvester') ||
        cmd.includes('inspect_node_processes') ||
        cmd.includes('test_blog_engine') ||
        cmd.includes('verify_blog_upgrade');

      if (isZombie) {
        try {
          process.kill(pid, 'SIGKILL');
          killedCount++;
          freedBytes += ws;
          console.log(`🛑 Terminated zombie process [PID ${pid}, ${(ws / (1024*1024)).toFixed(1)}MB]: ${cmd.slice(0, 60)}...`);
        } catch (_) {}
      }
    }
  });

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Cleanup Complete: Terminated ${killedCount} orphaned processes.`);
  console.log(`💾 Total Memory Restored to System: ${(freedBytes / (1024 * 1024)).toFixed(1)} MB.`);
  console.log('='.repeat(70));
} catch (err) {
  console.error('Error during zombie purge:', err.message);
}
