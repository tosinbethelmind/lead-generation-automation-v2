import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

const LOCAL_DB = path.join(process.cwd(), 'local_db');

// Parse .env.local
let envContent = '';
try {
  envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
} catch (_) {}

let supabaseUrl = '';
let supabaseKey = '';

envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  const val = v.join('=').trim().replace(/^["']|["']$/g, '');
  if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
  if (k.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = val;
});

async function main() {
  console.log('=== VERIFYING TRUE OUTREACH & CUSTOMER JOURNEY DATA ===\n');

  // 1. Inspect leads_db.json
  const leadsDbPath = path.join(LOCAL_DB, 'leads_db.json');
  let leads: any[] = [];
  if (fs.existsSync(leadsDbPath)) {
    try {
      leads = JSON.parse(fs.readFileSync(leadsDbPath, 'utf8'));
    } catch (e: any) {
      console.log('Error reading leads_db.json:', e.message);
    }
  }

  console.log(`Total Leads in local RAM DB (leads_db.json): ${leads.length}`);

  let emailSentCount = 0;
  let socialDmSentCount = 0;
  let jijiDmSentCount = 0;
  let smsSentCount = 0;
  let webformSentCount = 0;

  const socialBreakdown: Record<string, number> = {
    'Instagram DM': 0,
    'Facebook Messenger': 0,
    'LinkedIn Direct': 0,
    'TikTok DM': 0,
    'Other Social DM': 0
  };

  leads.forEach(l => {
    if (l.email_sent || l.email_dispatched || l.outreach_channels?.includes('email')) {
      emailSentCount++;
    }
    if (l.sms_sent || l.sms_dispatched || l.outreach_channels?.includes('sms')) {
      smsSentCount++;
    }
    if (l.webform_submitted || l.webform_dispatched) {
      webformSentCount++;
    }
    if (l.social_dm_dispatched || l.social_dm_sent || l.outreach_channels?.includes('social_dm')) {
      socialDmSentCount++;
      const link = (l.social_links || l.website || '').toLowerCase();
      if (link.includes('instagram')) socialBreakdown['Instagram DM']++;
      else if (link.includes('facebook')) socialBreakdown['Facebook Messenger']++;
      else if (link.includes('linkedin')) socialBreakdown['LinkedIn Direct']++;
      else if (link.includes('tiktok')) socialBreakdown['TikTok DM']++;
      else socialBreakdown['Other Social DM']++;
    }
    if (l.jiji_dm_dispatched || l.jiji_dm_sent || l.channel === 'jiji' || l.source === 'jiji' || (l.social_dm_dispatched && l.category === 'Jiji Merchant')) {
      jijiDmSentCount++;
    }
  });

  // 2. Check lead_journeys.json
  const journeysPath = path.join(LOCAL_DB, 'lead_journeys.json');
  let journeys: Record<string, any> = {};
  if (fs.existsSync(journeysPath)) {
    try {
      journeys = JSON.parse(fs.readFileSync(journeysPath, 'utf8'));
    } catch (_) {}
  }

  const journeyList = Object.values(journeys);
  console.log(`Total Tracked Customer Journeys (lead_journeys.json): ${journeyList.length}`);

  const stageCounts: Record<string, number> = {};
  journeyList.forEach((j: any) => {
    const stage = j.currentStage || 'DISCOVERED';
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
  });

  console.log('\n--- CUSTOMER JOURNEY STAGE BREAKDOWN (LOCAL) ---');
  console.table(stageCounts);

  // 3. Check Engine Memory Files
  const fiveMoneyPath = path.join(LOCAL_DB, 'five_money_engine_memory.json');
  let fiveMoneyMemory: any = null;
  if (fs.existsSync(fiveMoneyPath)) {
    try {
      fiveMoneyMemory = JSON.parse(fs.readFileSync(fiveMoneyPath, 'utf8'));
    } catch (_) {}
  }

  console.log('\n--- 5 MONETIZATION ENGINES MEMORY ---');
  if (fiveMoneyMemory) {
    console.log('Five Money Engine State:', JSON.stringify(fiveMoneyMemory, null, 2));
  } else {
    console.log('No five_money_engine_memory.json found or empty.');
  }

  // 4. Query Supabase directly if available
  if (supabaseUrl && supabaseKey) {
    console.log('\n--- SUPABASE LIVE CLOUD METRICS ---');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { count: sbLeadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
    console.log(`Supabase total leads count: ${sbLeadsCount ?? 0}`);

    const { count: sbEmailCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('email_sent', true);
    console.log(`Supabase email_sent=true count: ${sbEmailCount ?? 0}`);

    const { count: sbSmsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('sms_sent', true);
    console.log(`Supabase sms_sent=true count: ${sbSmsCount ?? 0}`);

    const { count: sbCrmCount } = await supabase.from('crm_leads').select('*', { count: 'exact', head: true });
    console.log(`Supabase crm_leads count: ${sbCrmCount ?? 0}`);

    const { data: crmSample } = await supabase.from('crm_leads').select('id, business_name, status, channel, created_at').limit(10);
    console.log('Supabase CRM Sample:', crmSample);
  }

  console.log('\n--- SUMMARY CALCULATED OUTREACH COUNTS ---');
  console.log(`1. Total Emails Sent: ${emailSentCount}`);
  console.log(`2. Total Social Media Inbox DMs Sent: ${socialDmSentCount}`);
  console.log(`   Breakdown:`, socialBreakdown);
  console.log(`3. Total Jiji Inbox Messages Sent: ${jijiDmSentCount}`);
  console.log(`4. Total GSM SMS Sent: ${smsSentCount}`);
  console.log(`5. Total Web Contact Forms Submitted: ${webformSentCount}`);
}

main().catch(err => console.error(err));
