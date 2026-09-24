/**
 * @file scripts/continuous_smart_webform_submitter.ts
 * 
 * 🌐 AUTONOMOUS 300 DAILY WEB CONTACT FORM SUBMISSION DAEMON
 * Bethelmind Analytics Lagos Desk · 2026 Edition
 * 
 * Key Architecture:
 * 1. 100% Decoupled from Email Daemon (Email pauses will NEVER block webforms).
 * 2. Deep Heuristic Form Auto-Mapping (WordPress CF7, WPForms, Elementor, Wix, React).
 * 3. Verified 200 OK Delivery Logging to local_db/real_webform_submissions.json.
 * 4. Fast 3.5s Timeout per endpoint (Strict Rule #6: Zero page spinning).
 * 5. Automatic SMTP Cascade Fallback when form endpoints are blocked.
 */

import fs from 'fs';
import path from 'path';
import { submitContactForm } from '../src/lib/contactFormSubmitter';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const LEADS_DB_PATH = path.join(LOCAL_DB, 'leads_db.json');
const WEBFORM_LOG_PATH = path.join(LOCAL_DB, 'real_webform_submissions.json');

const TARGET_DAILY_QUOTA = 300;

function cleanName(rawName: string): string {
  return (rawName || 'Commercial Enterprise')
    .split('-')[0]
    .split('|')[0]
    .replace(/\(.*?\)/g, '')
    .trim()
    .slice(0, 50);
}

async function runWebformBatch(maxPerBatch = 25) {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Calculate today's existing verified submissions
  let existingLogs: any[] = [];
  if (fs.existsSync(WEBFORM_LOG_PATH)) {
    try {
      const raw = JSON.parse(fs.readFileSync(WEBFORM_LOG_PATH, 'utf8'));
      if (Array.isArray(raw)) existingLogs = raw;
    } catch (_) {}
  }

  const todayDelivered = existingLogs.filter(l =>
    (l.submitted_at || l.deliveredAt || l.timestamp || '').startsWith(todayStr) && l.success === true
  ).length;

  console.log(`\n========================================================================`);
  console.log(`🌐 300 WEB CONTACT FORM SUBMITTER DAEMON`);
  console.log(`📊 Today's Verified Delivery: ${todayDelivered}/${TARGET_DAILY_QUOTA}`);
  console.log(`========================================================================\n`);

  if (todayDelivered >= TARGET_DAILY_QUOTA) {
    console.log(`🎉 Daily target of ${TARGET_DAILY_QUOTA} webforms already achieved for today!`);
    return;
  }

  const remainingQuota = TARGET_DAILY_QUOTA - todayDelivered;
  const batchTarget = Math.min(remainingQuota, maxPerBatch);

  // 2. Load candidate leads with websites
  let leads: any[] = [];
  if (fs.existsSync(LEADS_DB_PATH)) {
    try {
      const raw = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));
      if (Array.isArray(raw)) leads = raw;
    } catch (_) {}
  }

  const EXCLUDE_DOMAINS = /jiji\.ng|bing\.com|google\.com|facebook\.com|instagram\.com|twitter\.com|x\.com|tiktok\.com|youtube\.com|linkedin\.com|wa\.me|finelib\.com|businesslist\.com\.ng|vconnect\.com|yellowpages/i;

  const candidateLeads = leads.filter(l => {
    const web = (l.website || '').trim().toLowerCase();
    return web.startsWith('http') && !EXCLUDE_DOMAINS.test(web) && !l.webform_submitted;
  });

  console.log(`📋 Available Commercial Websites to Contact: ${candidateLeads.length}`);
  console.log(`🎯 Quota for this batch: ${batchTarget} submissions\n`);

  let batchDelivered = 0;
  let candidateIndex = 0;

  while (batchDelivered < batchTarget && candidateIndex < candidateLeads.length) {
    const lead = candidateLeads[candidateIndex++];
    const bizName = cleanName(lead.business_name || lead.name);
    console.log(`   [Attempt ${candidateIndex}/${candidateLeads.length}] Contacting: ${lead.website} (${bizName})`);

    try {
      const result = await submitContactForm(
        {
          lead_id: lead.id || lead.lead_id || `lead_${Date.now()}`,
          source: 'GOOGLE',
          name: bizName,
          category: lead.category || 'Commercial Enterprise',
          address: lead.address || lead.area || 'Lagos, Nigeria',
          area: lead.area || 'Lagos',
          city: lead.city || 'Lagos',
          phone_e164: lead.phone_e164 || lead.phone || '+2348022791227',
          phone_raw: lead.phone || '08022791227',
          email: lead.email || '',
          website: lead.website,
          rating: lead.rating || 4.8,
          reviews_count: lead.reviews_count || 15,
          verified: true,
          listings_count: 1,
          profile_url: lead.website,
          source_query_or_seed: lead.source_query_or_seed || '',
          collected_at: new Date().toISOString(),
          status: 'NEW',
          last_contacted_at: '',
          duplicate_of_lead_id: '',
          business_summary: '',
          notes: ''
        } as any,
        'WebContactForm',
        'Bethelmind Analytics Lagos Desk'
      );

      lead.webform_submitted = true;
      lead.webform_submitted_at = new Date().toISOString();

      if (result.success) {
        batchDelivered++;
        console.log(`   ✅ [Delivered ${batchDelivered}/${batchTarget}]: ${bizName} via ${result.methodUsed || 'webform'} (Status: ${result.statusCode})`);
      } else {
        console.log(`   ℹ️ [Note]: ${bizName} — ${result.error || 'Form endpoint not found, transitioning'}`);
      }

      existingLogs.push({
        lead_id: lead.id,
        business_name: bizName,
        target_website: lead.website,
        form_action: result.form_action || lead.website,
        submitted_at: new Date().toISOString(),
        success: result.success,
        statusCode: result.statusCode,
        proposal_type: result.proposal_type || 'WEB_PROPOSAL',
        methodUsed: result.methodUsed || 'webform'
      });

      // Persist log periodically
      if (candidateIndex % 3 === 0 || batchDelivered >= batchTarget) {
        try {
          fs.writeFileSync(WEBFORM_LOG_PATH, JSON.stringify(existingLogs, null, 2), 'utf8');
          fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2), 'utf8');
        } catch (_) {}
      }

    } catch (err: any) {
      console.log(`   ⚠️ Submission exception for ${bizName}: ${err.message}`);
    }

    // Humanized 2-3s delay between submissions
    await new Promise(r => setTimeout(r, 2500));
  }

  // Final persistence
  try {
    fs.writeFileSync(WEBFORM_LOG_PATH, JSON.stringify(existingLogs, null, 2), 'utf8');
    fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2), 'utf8');
    console.log(`\n💾 Webform batch state saved. Total Delivered Today: ${todayDelivered + batchDelivered}/${TARGET_DAILY_QUOTA}`);
  } catch (_) {}
}

async function main() {
  const isContinuous = process.argv.includes('--continuous');
  const isTest = process.argv.includes('--test');

  if (isTest) {
    await runWebformBatch(2);
    process.exit(0);
  }

  do {
    try {
      await runWebformBatch(25);
    } catch (err: any) {
      console.error('Webform daemon cycle error:', err.message);
    }

    if (isContinuous) {
      console.log('⏳ Resting 10 minutes before next webform batch...\n');
      await new Promise(r => setTimeout(r, 10 * 60 * 1000));
    } else {
      break;
    }
  } while (isContinuous);

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal webform error:', err);
  process.exit(1);
});
