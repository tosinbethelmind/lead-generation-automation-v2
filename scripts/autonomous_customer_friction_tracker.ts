/**
 * @file scripts/autonomous_customer_friction_tracker.ts
 * 24/7 Background Watchdog for Customer Journey Friction & Landing Page Optimization
 */

import fs from 'fs';
import path from 'path';
import { analyzeCustomerJourneyFriction } from '../src/lib/customerFrictionAnalyzer';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const AUDIT_FILE = path.join(LOCAL_DB, 'landing_page_friction_audit.json');
const LOG_FILE = path.join(LOCAL_DB, 'customer_friction_tracker.log');

function log(msg: string) {
  const ts = new Date().toISOString();
  const line = `[FrictionTracker ${ts}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

async function runFrictionAudit() {
  log('🔎 Running automated Customer Journey Friction & Drop-Off Analysis...');
  const report = analyzeCustomerJourneyFriction();

  fs.writeFileSync(AUDIT_FILE, JSON.stringify(report, null, 2));
  log(`✅ Audit complete: Analyzed ${report.totalAnalyzedJourneys} journeys | ${report.totalPageViews} page views | ${report.totalCalculatorRuns} calculator runs.`);
  log(`⚠️ Detected Friction Points: ${report.detectedFrictionPoints.length} items logged.`);
  report.detectedFrictionPoints.forEach(p => {
    log(`   [${p.severity}] ${p.issue} -> Recommendation: ${p.recommendedPageImprovement}`);
  });
}

async function startDaemon() {
  log('================================================================');
  log('🧠 LAUNCHING 24/7 CUSTOMER JOURNEY FRICTION & OPTIMIZATION WATCHDOG');
  log('================================================================');

  await runFrictionAudit();

  // Run every 15 minutes
  setInterval(async () => {
    try {
      await runFrictionAudit();
    } catch (err: any) {
      log(`⚠️ Friction Audit error: ${err.message}`);
    }
  }, 15 * 60 * 1000);
}

startDaemon().catch(err => {
  log(`❌ Fatal Tracker Error: ${err.message}`);
});
