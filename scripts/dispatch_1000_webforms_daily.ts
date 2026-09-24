/**
 * @file scripts/dispatch_1000_webforms_daily.ts
 * 
 * Direct command runner for Turbo 1,000 Web Contact Form Submissions Daily
 */

import { turbo1000WebformEngine } from '../src/lib/outreach/turbo1000WebformEngine';

async function main() {
  const target = parseInt(process.argv[2] || '1000', 10);
  console.log(`🚀 Starting Turbo ${target} Web Contact Form Outreach Pass...`);
  const stats = await turbo1000WebformEngine.execute1000WebformCampaign(target);
  console.log('✅ 1,000 Webform Campaign Results:', stats);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal webform error:', err);
  process.exit(1);
});
