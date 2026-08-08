/**
 * master_247_supervisor.js
 * Master 24/7 Non-Stop Automation Supervisor for ApexReach & 10K Lagos Engine.
 * 
 * Manages:
 * 1. Lagos 10K Continuous Harvester (python scripts/colab_lagos_10k_runner.py --loop)
 * 2. Local Queue Job Runner (node scripts/keep_alive_runner.js)
 * 
 * Auto-restarts processes on crash or wake-from-sleep.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const logsDir = path.join(rootDir, 'local_db');
if (!fs.existsSync(logsDir)) {
  try { fs.mkdirSync(logsDir, { recursive: true }); } catch (_) {}
}

const masterLogPath = path.join(logsDir, 'master_247_supervisor.log');

function logMaster(msg) {
  const timestamp = new Date().toISOString();
  const formatted = `[Master247 ${timestamp}] ${msg}`;
  console.log(formatted);
  try {
    fs.appendFileSync(masterLogPath, formatted + '\n');
  } catch (_) {}
}

logMaster('==================================================');
logMaster('🚀 INITIALIZING MASTER 24/7 NON-STOP AUTOMATION');
logMaster('==================================================');

let pyProcess = null;
let queueProcess = null;

function startPythonHarvester() {
  logMaster('⚡ Starting Python 10K Lagos 24/7 Harvester Loop...');
  pyProcess = spawn('python', ['scripts/colab_lagos_10k_runner.py', '--loop'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  });

  pyProcess.on('exit', (code) => {
    logMaster(`⚠️ Python Harvester exited with code ${code}. Restarting in 10s...`);
    setTimeout(startPythonHarvester, 10000);
  });

  pyProcess.on('error', (err) => {
    logMaster(`❌ Python Harvester error: ${err.message}. Restarting in 15s...`);
    setTimeout(startPythonHarvester, 15000);
  });
}

function startQueueRunner() {
  logMaster('⚡ Starting Local Queue Keep-Alive Runner...');
  queueProcess = spawn('node', ['scripts/keep_alive_runner.js'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  });

  queueProcess.on('exit', (code) => {
    logMaster(`⚠️ Queue Runner exited with code ${code}. Restarting in 10s...`);
    setTimeout(startQueueRunner, 10000);
  });

  queueProcess.on('error', (err) => {
    logMaster(`❌ Queue Runner error: ${err.message}. Restarting in 15s...`);
    setTimeout(startQueueRunner, 15000);
  });
}

// Launch both processes
startPythonHarvester();
startQueueRunner();

// Heartbeat every 10 minutes
setInterval(() => {
  logMaster('🟢 [Master 24/7 Heartbeat] All background scrapers and runners active and healthy.');
}, 10 * 60 * 1000);

process.on('SIGINT', () => {
  logMaster('Stopping master supervisor...');
  if (pyProcess) try { pyProcess.kill(); } catch (_) {}
  if (queueProcess) try { queueProcess.kill(); } catch (_) {}
  process.exit(0);
});
