import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Manually parse .env.local without external dotenv package
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

async function checkSupabaseActualData() {
  console.log('Connecting to Supabase at:', supabaseUrl);
  if (!supabaseUrl || !supabaseKey) {
    console.log('No Supabase credentials configured in .env.local');
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    const { data: leads, error: errLeads, count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: false })
      .limit(10);

    console.log('\n--- SUPABASE REAL DATABASE DISCOVERIES ---');
    if (errLeads) {
      console.log('Notice on leads table:', errLeads.message);
    } else {
      console.log('Total Commercial Leads in Cloud Database:', totalLeads ?? (leads ? leads.length : 0));
      if (leads && leads.length > 0) {
        console.log('Real Harvested Lagos Businesses:');
        leads.slice(0, 5).forEach((l, idx) => {
          const name = l.business_name || l.name || 'Unnamed Business';
          const phone = l.phone || 'No phone';
          const sector = l.sector || 'Uncategorized';
          console.log(`  ${idx + 1}. ${name} | Phone: ${phone} | Sector: ${sector}`);
        });
      }
    }
  } catch (e: any) {
    console.log('Leads query notice:', e.message);
  }

  try {
    const { data: crm, error: errCrm } = await supabase.from('crm_leads').select('*').limit(5);
    console.log('\n--- REAL CRM CONVERSATION LEADS ---');
    if (errCrm) {
      console.log('Notice on CRM table:', errCrm.message);
    } else {
      console.log('Real CRM Customer Inquiries:', crm ? crm.length : 0);
    }
  } catch (e: any) {
    console.log('CRM query notice:', e.message);
  }
}

checkSupabaseActualData();
