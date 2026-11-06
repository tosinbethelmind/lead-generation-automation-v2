with open('scripts/unified_master_autopilot.js', 'r', encoding='utf-8') as f:
    text = f.read()

worker17_code = '''// ── WORKER 17: Autonomous Continuous Luxury Mandate Discovery & Queue Watchdog ──
let pillar2Process = null;
function startPillar2DiscoveryWorker() {
  log('🏛️ [Worker 17: Luxury Mandate Engine] Launching Autonomous Deal Discovery & Tri-Channel Queue Drain...');
  pillar2Process = spawn('node', ['--max-old-space-size=256', tsxCli, 'scripts/run_autonomous_pillar2_deal_discovery.js'], {
    cwd: rootDir,
    shell: false,
    stdio: 'inherit',
    windowsHide: true,
    env: safeEnv
  });

  pillar2Process.on('exit', (code) => {
    log(`ℹ️ [Worker 17: Luxury Mandate Engine] Discovery & drain cycle completed (Code: ${code}). Resting 20 minutes before next sweep...`);
    setTimeout(startPillar2DiscoveryWorker, 20 * 60 * 1000);
  });

  pillar2Process.on('error', (err) => {
    log(`❌ [Worker 17: Luxury Mandate Engine] Error: ${err.message}. Retrying in 10 minutes...`);
    setTimeout(startPillar2DiscoveryWorker, 10 * 60 * 1000);
  });
}

const workerManifest = ['''

text = text.replace('const workerManifest = [', worker17_code)

old_manifest_end = '''  { name: 'Worker 16: Nairaland Traffic Engine', start: startNairalandWorker, delay: 42000 }
];'''

new_manifest_end = '''  { name: 'Worker 16: Nairaland Traffic Engine', start: startNairalandWorker, delay: 42000 },
  { name: 'Worker 17: Luxury Mandate Engine', start: startPillar2DiscoveryWorker, delay: 45000 }
];'''

text = text.replace(old_manifest_end, new_manifest_end)

with open('scripts/unified_master_autopilot.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Added Worker 17 to unified_master_autopilot.js!')
