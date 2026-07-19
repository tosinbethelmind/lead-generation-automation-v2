const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read production env from sibling folder
const envPath = path.join(__dirname, '../../Solar ROI Proposal Builder/.env.local');
let supabaseUrl = '';
let supabaseKey = '';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.trim().match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      if (key === 'SUPABASE_URL' || key === 'NEXT_PUBLIC_SUPABASE_URL') {
        supabaseUrl = val;
      }
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
        supabaseKey = val;
      }
    }
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function verifyPipeline() {
  console.log('🔍 Verifying Solar Lead-to-Execution Pipeline Data...');

  try {
    const [installersCount, areasCount, subsCount, leadsCount, assignmentsCount] = await Promise.all([
      supabase.from('marketplace_installers').select('*', { count: 'exact', head: true }),
      supabase.from('installer_service_areas').select('*', { count: 'exact', head: true }),
      supabase.from('installer_subscriptions').select('*', { count: 'exact', head: true }),
      supabase.from('marketplace_leads').select('*', { count: 'exact', head: true }),
      supabase.from('lead_assignments').select('*', { count: 'exact', head: true })
    ]);

    console.log('==================================================');
    console.log('📊 DATABASE PIPELINE METRICS');
    console.log('==================================================');
    console.log(`Verified Installers:       ${installersCount.count || 0}`);
    console.log(`Service Areas Coverages:   ${areasCount.count || 0}`);
    console.log(`Subscriptions Configured:  ${subsCount.count || 0}`);
    console.log(`Total Scraped/Generated Leads: ${leadsCount.count || 0}`);
    console.log(`Total Leads Routing Assignments: ${assignmentsCount.count || 0}`);
    console.log('==================================================');

    console.log('\n📋 RECENT OPERATIONS AUDIT LOGS:');
    const { data: auditLogs, error: auditErr } = await supabase
      .from('operations_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (auditErr) {
      console.error('Failed to retrieve audit logs:', auditErr.message);
    } else if (auditLogs && auditLogs.length > 0) {
      auditLogs.forEach((log, index) => {
        console.log(`[${index + 1}] Action: ${log.action_type} | Status: ${log.status} | Created: ${log.created_at}`);
        console.log(`    Details: ${log.response_details}`);
      });
    } else {
      console.log('No recent audit log entries found.');
    }
    console.log('==================================================');

  } catch (err) {
    console.error('❌ Verification failed:', err.message);
  }
}

verifyPipeline();
