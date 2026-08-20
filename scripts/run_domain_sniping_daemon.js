/**
 * @file scripts/run_domain_sniping_daemon.js
 * 
 * 24/7 Autonomous Domain Sniping & Instant Alert Daemon.
 * Scans every 30 minutes for dropping domains and dispatches instant 1-tap alerts to the executive inbox.
 */

const path = require('path');
const { scanExpiringNigerianDomains, dispatchInstantDomainAlert } = require(path.join(process.cwd(), 'src', 'lib', 'monetization', 'expiredDomainMonitor.ts'));

const alertedDomains = new Set();

async function runDomainScan() {
  console.log(`[${new Date().toISOString()}] 🔍 Scanning for dropping .com.ng / .ng commercial domains...`);
  try {
    const { snipedOpportunities } = await scanExpiringNigerianDomains();

    for (const domain of snipedOpportunities) {
      if (!alertedDomains.has(domain.domain)) {
        console.log(`⚡ Dropped Domain Found: ${domain.domain} (Valuation: ₦${domain.resaleValuationNGN.toLocaleString()}). Dispatching urgent alert...`);
        const result = await dispatchInstantDomainAlert(domain);
        if (result.success) {
          alertedDomains.add(domain.domain);
        }
      }
    }
  } catch (err) {
    console.error('Error running domain scan:', err.message);
  }
}

async function main() {
  await runDomainScan();

  if (process.argv.includes('--once')) {
    process.exit(0);
  }

  // Scan every 30 minutes in background
  setInterval(runDomainScan, 30 * 60 * 1000);
}

main();
