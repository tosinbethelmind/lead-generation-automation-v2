const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse environment variables
const envPath = path.join(__dirname, '../.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      envVars[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

async function checkAllSources() {
  console.log('===============================================================');
  console.log('🔍 HUNTING FOR ALL LEAD DATASETS ACROSS WORKSPACE & CLOUD');
  console.log('===============================================================\n');

  // Check Supabase count
  if (supabase) {
    try {
      const { count, error } = await supabase.from('leads').select('*', { count: 'exact', head: true });
      console.log('⚡ Supabase cloud leads count:', count, error?.message || '');
    } catch(e) {
      console.log('Supabase error:', e.message);
    }
  }

  // Check Google Sheets
  try {
    const { getSheetsInstance } = require('../src/lib/googleSheets');
    const sheets = await getSheetsInstance();
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));
    if (config.googleSpreadsheetId) {
      const resp = await sheets.spreadsheets.values.get({
        spreadsheetId: config.googleSpreadsheetId,
        range: 'Leads!A2:A',
      });
      console.log('⚡ Google Sheets total rows:', (resp.data.values || []).length);
    }
  } catch (e) {
    console.log('Google Sheets error / skipped:', e.message);
  }

  // Check all tmp files in local_db
  const dbDir = path.join(__dirname, '../local_db');
  const files = fs.readdirSync(dbDir);
  
  let totalUniqueLeads = new Map();

  for (const f of files) {
    if (f.startsWith('leads_db.json') || f.endsWith('.json')) {
      const fullPath = path.join(dbDir, f);
      try {
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        if (Array.isArray(data)) {
          console.log(`📁 ${f.padEnd(45)} -> ${data.length.toLocaleString()} leads`);
          data.forEach(lead => {
            const id = lead.id || lead.lead_id;
            const phone = lead.phone_e164 || lead.phone || lead.phone_raw;
            const key = id || (phone ? `phone_${phone}` : null) || (lead.name ? `name_${lead.name}` : null);
            if (key && !totalUniqueLeads.has(key)) {
              totalUniqueLeads.set(key, lead);
            }
          });
        }
      } catch(_) {}
    }
  }

  console.log('\n===============================================================');
  console.log(`🎯 TOTAL UNIQUE CONSOLIDATED LEADS FOUND ACROSS ALL BACKUPS: ${totalUniqueLeads.size.toLocaleString()}`);
  console.log('===============================================================\n');

  // Sector and location breakdown of the consolidated set
  let lagosCount = 0;
  let lagosPhone = 0;
  let lagosRegular = 0;
  let solarCount = 0;

  totalUniqueLeads.forEach(lead => {
    const loc = `${lead.city || ''} ${lead.area || ''} ${lead.address || ''} ${lead.source_query_or_seed || ''}`.toLowerCase();
    const cat = `${lead.category || ''} ${lead.name || ''} ${lead.business_summary || ''}`.toLowerCase();
    const isSolar = (lead.id || lead.lead_id || '').startsWith('solar_') || /solar|inverter|energy|panel|power/i.test(cat);
    const isIbadan = /ibadan|bodija|dugbe|mokola|eleyele|akobo|apata/i.test(loc);
    const isLagos = !isIbadan && (/lagos|ikeja|lekki|vi\b|victoria island|surulere|yaba|maryland|ikoyi|ajah|gbagada/i.test(loc) || !loc.includes('kano'));

    if (isLagos) {
      lagosCount++;
      if (lead.phone_e164 || lead.phone || lead.phone_raw) lagosPhone++;
      if (!isSolar) lagosRegular++;
      else solarCount++;
    }
  });

  console.log(`📌 Consolidated Breakdown:`);
  console.log(`   • Total Lagos Leads:                    ${lagosCount.toLocaleString()}`);
  console.log(`   • Regular Lagos B2B Businesses:         ${lagosRegular.toLocaleString()}`);
  console.log(`   • Lagos Leads with Direct Phone:        ${lagosPhone.toLocaleString()}`);
  console.log(`   • Solar Energy Leads:                   ${solarCount.toLocaleString()}`);
}

checkAllSources().catch(console.error);
