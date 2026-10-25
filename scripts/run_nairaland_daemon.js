const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const ACCOUNTS_REGISTRY = path.join(__dirname, '..', 'local_db', 'nairaland_accounts.json');

console.log('=================================================================');
console.log('🇳🇬 24/7 MULTI-ACCOUNT NAIRALAND FORUM ENGINE DAEMON');
console.log('=================================================================');
console.log('• Fleet: Bethelsolution, kenetwork2026, 4thmainland');
console.log('• Thread Bumping: Every 3 hours with Contextual Sector Updates');
console.log('• Campaign Auto-Posting: Independent 12-24h Cadence per Account');
console.log('• Revenue Focus: Stream 1 (B2B SME ₦35k Starter / ₦75k Suite)');
console.log('• Status: 100% Autonomous 24/7 Operation');
console.log('=================================================================\n');

function loadAccounts() {
  if (fs.existsSync(ACCOUNTS_REGISTRY)) {
    try {
      const data = JSON.parse(fs.readFileSync(ACCOUNTS_REGISTRY, 'utf8'));
      return data.accounts || [];
    } catch {}
  }
  return [{ username: 'Bethelsolution' }, { username: 'kenetwork2026' }, { username: '4thmainland' }];
}

async function runAccountCycle(username) {
  return new Promise((resolve) => {
    const watTime = new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos' });
    console.log(`[${watTime} WAT] 🚀 Launching Autonomous Cycle for: ${username}...`);

    const child = spawn('node', ['scripts/nairaland_autonomous_engine.js', '--auto-cycle', `--account=${username}`], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      console.log(`[${watTime} WAT] ✓ Completed cycle for ${username} (Code: ${code}).\n`);
      resolve(code);
    });

    child.on('error', (err) => {
      console.error(`Error running cycle for ${username}:`, err.message);
      resolve(1);
    });
  });
}

async function runFleetCycle() {
  const accounts = loadAccounts();
  const watTime = new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos' });
  console.log(`\n>>> [${watTime} WAT] Starting Full Fleet Autonomous Cycle across ${accounts.length} accounts...`);

  for (const acc of accounts) {
    if (acc.status === 'active' || !acc.status) {
      await runAccountCycle(acc.username);
      // Wait 15 seconds between accounts to avoid packet collision
      await new Promise(r => setTimeout(r, 15000));
    }
  }

  console.log(`>>> Fleet cycle completed. Sleeping 3 hours before next automated cycle...\n`);
  setTimeout(runFleetCycle, 3 * 60 * 60 * 1000);
}

// Start daemon loop
runFleetCycle();
