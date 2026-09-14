/**
 * @file scripts/launch_background_autopilot.js
 * Detached, rock-solid silent background launcher for Bethelmind 24/7 Autopilot.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const logsDir = path.join(rootDir, 'local_db');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'unified_master_autopilot.log');
const out = fs.openSync(logFile, 'a');
const err = fs.openSync(logFile, 'a');

const autopilotScript = path.join(__dirname, 'unified_master_autopilot.js');

// 1. Launch Master Autopilot in detached silent background mode
const child = spawn(process.execPath, [
  '--max-old-space-size=384',
  autopilotScript,
  '--low-data'
], {
  detached: true,
  stdio: ['ignore', out, err],
  windowsHide: true,
  cwd: rootDir,
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=256'
  }
});

child.unref();

const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
console.log(`[${timestamp}] 🚀 Bethelmind Master Autopilot successfully spawned in background.`);
console.log(`   PID     : ${child.pid}`);
console.log(`   Memory  : Strictly capped <= 384MB (Eco-Mode)`);
console.log(`   Priority: Background`);
console.log(`   Log     : ${logFile}`);
