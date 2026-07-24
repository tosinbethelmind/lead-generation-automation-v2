/**
 * @file scripts/solarquotepro_multi_channel_outreach.js
 * Master Outreach Arm Orchestrator for SolarQuotePro.ng
 * Combines 10K Nigeria Scraper, Dual-DB Sync, Web Contact Forms, Group Hunter, Jiji Messaging, & B2B Emails.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function runChildScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName);
    console.log(`\n\x1b[36m▶ Running sub-task: node scripts/${scriptName} ${args.join(' ')}\x1b[0m\n`);

    const child = spawn('node', [scriptPath, ...args], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        console.warn(`⚠️ Script ${scriptName} exited with code ${code}`);
        resolve(); // Continue pipeline even if individual step has non-zero exit code
      }
    });

    child.on('error', (err) => {
      console.error(`❌ Error launching ${scriptName}:`, err.message);
      resolve();
    });
  });
}

async function runMasterOutreachPipeline() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const countIdx = args.indexOf('--count');
  const targetCount = countIdx !== -1 && args[countIdx + 1] ? args[countIdx + 1] : '2500';
  
  const channelsIdx = args.indexOf('--channels');
  const selectedChannels = channelsIdx !== -1 && args[channelsIdx + 1] 
    ? args[channelsIdx + 1].split(',')
    : ['groups', 'web_forms', 'email', 'jiji'];

  console.log('===========================================================');
  console.log('🇳🇬 SOLARQUOTEPRO.NG NATIONWIDE MULTI-CHANNEL OUTREACH ARM');
  console.log(`🎯 Scraper Daily Target: ${targetCount} installer leads across 36 States + FCT`);
  console.log(`📡 Selected Outreach Channels: ${selectedChannels.join(', ')}`);
  console.log(`⚡ Execution Mode: ${isDryRun ? 'DRY RUN' : 'LIVE PRODUCTION OUTREACH'}`);
  console.log('===========================================================\n');

  // Step 1: Execute 10K Nigeria Solar Lead Extraction & Dual Supabase Sync
  console.log('Step 1: Running Scraper & Dual Supabase Database Sync...');
  const scraperArgs = ['--count', targetCount];
  if (isDryRun) scraperArgs.push('--dry-run');
  await runChildScript('nigeria_solar_5k_scraper.js', scraperArgs);

  // Step 2: Channel Execution - Group Hunter (Public Discussion Groups & Community Broadcasting)
  if (selectedChannels.includes('groups') || selectedChannels.includes('all')) {
    console.log('\nStep 2: Hunting Solar Installer Public Discussion Groups (Nairaland, Facebook, Telegram)...');
    await runChildScript('social_group_hunter.js');
  }

  // Step 3: Channel Execution - Web Contact Form B2B Proposals
  if (selectedChannels.includes('web_forms') || selectedChannels.includes('all')) {
    console.log('\nStep 3: Dispatching Automated Web Contact Form Proposals...');
    const formArgs = ['--count', '20'];
    if (isDryRun) formArgs.push('--dry-run');
    await runChildScript('web_contact_form_outreach.js', formArgs);
  }

  // Step 4: Channel Execution - B2B Email Outreach
  if (selectedChannels.includes('email') || selectedChannels.includes('all')) {
    console.log('\nStep 4: Executing B2B Phased Email Partnership Outreach...');
    const outreachArgs = [];
    if (isDryRun) outreachArgs.push('--dry-run');
    await runChildScript('installer_onboarding_outreach.js', outreachArgs);
  }

  console.log('\n===========================================================');
  console.log('🎉 SOLARQUOTEPRO MULTI-CHANNEL OUTREACH PIPELINE COMPLETE!');
  console.log('===========================================================\n');
}

runMasterOutreachPipeline().catch(console.error);
