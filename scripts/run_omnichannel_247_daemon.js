/**
 * 🇳🇬 Bethelmind Digital Solutions - 24/7 Omnichannel Social Autopilot Daemon
 * Runs continuously on Contabo VPS via PM2 (bethelmind-omnichannel-autopilot)
 * Coordinates Pinterest, Reddit, Quora & Nairaland distribution non-stop
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('=================================================================');
console.log('🇳🇬 24/7 OMNICHANNEL SOCIAL DISTRIBUTION AUTOPILOT DAEMON');
console.log('=================================================================');
console.log('• Channels: Nairaland, Quora, Reddit, Pinterest');
console.log('• Cadence: Every 4 Hours Continuous Cycle');
console.log('• Revenue Suite: Tokunbo VIN, P2P Arbitrage, Solar BOQ, Fake Alert Shield');
console.log('• WhatsApp Desk: 0802 279 1227 • Moniepoint RC 7034297');
console.log('• Status: 100% Autonomous 24/7 Self-Healing Operation');
console.log('=================================================================\n');

async function runOmnichannelCycle() {
  return new Promise((resolve) => {
    const watTime = new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos' });
    console.log(`\n[${watTime} WAT] 🚀 Starting Omnichannel Social Cycle (Pinterest, Reddit, Quora)...`);

    const child = spawn('node', ['scripts/omnichannel_social_master.js'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      console.log(`[${watTime} WAT] ✓ Completed Omnichannel Cycle (Exit Code: ${code}).\n`);
      resolve(code);
    });

    child.on('error', (err) => {
      console.error(`Error in Omnichannel Cycle:`, err.message);
      resolve(1);
    });
  });
}

async function loop() {
  while (true) {
    try {
      await runOmnichannelCycle();
    } catch (e) {
      console.error('Cycle exception:', e.message);
    }
    const nextWaitHours = 4;
    console.log(`>>> Sleeping ${nextWaitHours} hours until next automated omnichannel distribution cycle...\n`);
    await new Promise(r => setTimeout(r, nextWaitHours * 60 * 60 * 1000));
  }
}

// Start continuous loop
loop().catch(console.error);
