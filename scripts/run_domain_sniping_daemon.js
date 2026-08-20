/**
 * @file scripts/run_domain_sniping_daemon.js
 * 
 * 24/7 Autonomous Domain Sniping & Daily Top 5 Digest Daemon.
 * 
 * - Scans NiRA dropped domain registry continuously.
 * - Dispatches a clean Daily Top 5 Digest to bethelmindrecruit@gmail.com at 08:00 AM WAT.
 * - Stops spammy instant alerts.
 */

const path = require('path');
const { dispatchDailyDomainTop5Digest } = require(path.join(process.cwd(), 'src', 'lib', 'monetization', 'expiredDomainMonitor.ts'));

let lastDigestDate = '';

async function checkDailyDigest() {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const watHour = (utcHours + 1) % 24;
  const todayStr = now.toISOString().split('T')[0];

  // Send daily at 08:00 AM WAT
  if (watHour === 8 && lastDigestDate !== todayStr) {
    lastDigestDate = todayStr;
    console.log(`[${new Date().toISOString()}] 📊 Dispatching scheduled 08:00 AM WAT Daily Top 5 Domain Digest...`);
    await dispatchDailyDomainTop5Digest();
  }
}

async function main() {
  if (process.argv.includes('--send-now') || process.argv.includes('--once')) {
    console.log('📊 Dispatching Daily Top 5 Domain Digest on demand...');
    const res = await dispatchDailyDomainTop5Digest();
    console.log('Result:', res);
    process.exit(res.success ? 0 : 1);
  }

  console.log('⏰ Domain Sniping Daemon active. Scheduled for daily 08:00 AM WAT Top 5 digests.');
  // Check schedule every 10 minutes
  setInterval(checkDailyDigest, 10 * 60 * 1000);
}

main();
