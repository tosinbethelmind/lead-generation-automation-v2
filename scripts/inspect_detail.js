const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadConfig() {
  let supabaseUrl = '';
  let supabaseKey = '';

  const configPath = path.resolve(process.cwd(), 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      supabaseUrl = config.supabaseUrl || '';
      supabaseKey = config.supabaseKey || '';
    } catch (e) {
      console.error('Error parsing config.json:', e);
    }
  }

  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)/);
      const keyMatch = content.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']?([^"'\r\n]+)/);
      if (urlMatch && !supabaseUrl) supabaseUrl = urlMatch[1];
      if (keyMatch && !supabaseKey) supabaseKey = keyMatch[1];
    } catch (e) {
      console.error('Error parsing .env.local:', e);
    }
  }

  return { supabaseUrl, supabaseKey };
}

const { supabaseUrl, supabaseKey } = loadConfig();
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key not found in config.json or .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runInspection() {
  try {
    console.log('Connecting to Supabase...');
    
    // Fetch leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*');
      
    if (leadsError) {
      throw new Error(`Leads query error: ${leadsError.message}`);
    }

    console.log(`Fetched ${leads.length} total raw leads from Supabase.`);

    // Fetch logs
    const { data: logs, error: logsError } = await supabase
      .from('logs')
      .select('*')
      .order('timestamp', { ascending: false });

    const logsList = logs || [];
    console.log(`Fetched ${logsList.length} logs from Supabase.`);

    // Deduplicate leads using project logic
    // (Sort by rating/reviews_count desc)
    const sorted = [...leads].sort((a, b) => {
      const rA = a.rating || 0;
      const rB = b.rating || 0;
      if (rB !== rA) return rB - rA;
      const revA = a.reviews_count || 0;
      const revB = b.reviews_count || 0;
      return revB - revA;
    });

    const idToKeptLead = new Map();
    const emailKeyToKeptLead = new Map();
    const phoneKeyToKeptLead = new Map();
    const uniqueLeads = [];

    for (const lead of sorted) {
      const leadId = lead.lead_id || '';
      if (!leadId) continue;

      const nameNorm = (lead.name || '').trim().toLowerCase();
      const emailNorm = (lead.email || '').trim().toLowerCase();
      const phoneRaw = lead.phone_e164 || lead.phone_raw || '';
      const phoneNorm = phoneRaw.replace(/\D/g, '');

      const emailKey = emailNorm ? `${nameNorm}|${emailNorm}` : '';
      const phoneKey = phoneNorm ? `${nameNorm}|${phoneNorm}` : '';

      let existingKept = idToKeptLead.get(leadId);
      if (!existingKept && emailKey) existingKept = emailKeyToKeptLead.get(emailKey);
      if (!existingKept && phoneKey) existingKept = phoneKeyToKeptLead.get(phoneKey);

      if (existingKept) {
        // Merge missing fields
        if (!existingKept.email && lead.email) existingKept.email = lead.email;
        if (!existingKept.phone_e164 && lead.phone_e164) existingKept.phone_e164 = lead.phone_e164;
        if (!existingKept.website && lead.website) existingKept.website = lead.website;
        if (!existingKept.social_links && lead.social_links) existingKept.social_links = lead.social_links;
      } else {
        const copy = { ...lead };
        uniqueLeads.push(copy);
        idToKeptLead.set(leadId, copy);
        if (emailKey) emailKeyToKeptLead.set(emailKey, copy);
        if (phoneKey) phoneKeyToKeptLead.set(phoneKey, copy);
      }
    }

    console.log(`Deduplicated to ${uniqueLeads.length} unique leads.`);

    // Perform breakdown
    const sourceBreakdown = {};
    const statusBreakdown = {};
    let hasEmail = 0;
    let hasPhone = 0;
    let hasBoth = 0;
    let hasWebsite = 0;
    let hasSocial = 0;
    let emailVerified = 0;

    for (const lead of uniqueLeads) {
      // Deduce source from notes prefix [source:...] or source field
      let source = lead.source || 'UNKNOWN';
      const notes = lead.notes || '';
      if (notes.startsWith('[source:')) {
        const endIdx = notes.indexOf(']');
        if (endIdx !== -1) {
          source = notes.substring(8, endIdx);
        }
      }

      sourceBreakdown[source] = (sourceBreakdown[source] || 0) + 1;
      statusBreakdown[lead.status] = (statusBreakdown[lead.status] || 0) + 1;

      const emailVal = (lead.email || '').trim();
      const phoneVal = (lead.phone_e164 || lead.phone_raw || '').trim();
      const siteVal = (lead.website || '').trim();
      const socialVal = (lead.social_links || '').trim();

      if (emailVal && emailVal.includes('@')) {
        hasEmail++;
        if (lead.email_verified) emailVerified++;
      }
      if (phoneVal) hasPhone++;
      if (emailVal && emailVal.includes('@') && phoneVal) hasBoth++;
      if (siteVal) hasWebsite++;
      if (socialVal && socialVal !== '[]' && socialVal !== '{}') hasSocial++;
    }

    // Collect unique steps to identify outreach-related events
    const uniqueSteps = new Set();
    logsList.forEach(l => {
      if (l.step) uniqueSteps.add(l.step);
    });

    // Outreach stats from logs
    const outreachLogs = logsList.filter(l => 
      String(l.step || '').toLowerCase().includes('outreach') || 
      String(l.step || '').toLowerCase().includes('email') ||
      String(l.step || '').toLowerCase().includes('whatsapp') ||
      String(l.step || '').toLowerCase().includes('sms') ||
      String(l.message || '').toLowerCase().includes('outreach') || 
      String(l.message || '').toLowerCase().includes('email') ||
      String(l.message || '').toLowerCase().includes('whatsapp') ||
      String(l.message || '').toLowerCase().includes('sms')
    );

    const outreachStatusSummary = {};
    outreachLogs.forEach(l => {
      outreachStatusSummary[l.status] = (outreachStatusSummary[l.status] || 0) + 1;
    });

    const report = {
      timestamp: new Date().toISOString(),
      rawLeadsCount: leads.length,
      uniqueLeadsCount: uniqueLeads.length,
      contactRateBreakdown: {
        totalLeads: uniqueLeads.length,
        hasEmail,
        emailVerified,
        hasPhone,
        hasBothPhoneAndEmail: hasBoth,
        hasWebsite,
        hasSocialLinks: hasSocial,
      },
      sourceBreakdown,
      statusBreakdown,
      uniqueLogSteps: Array.from(uniqueSteps),
      outreachSystemLogs: {
        totalLogsAnalysed: logsList.length,
        outreachRelatedLogsCount: outreachLogs.length,
        outreachLogStatusBreakdown: outreachStatusSummary,
        recentOutreachLogs: outreachLogs.slice(0, 15).map(l => ({
          timestamp: l.timestamp,
          step: l.step,
          status: l.status,
          message: l.message
        }))
      }
    };

    // Log contacted leads details
    const contactedLeads = uniqueLeads.filter(l => l.status === 'CONTACTED');
    console.log('\n--- CONTACTED LEADS DETAIL ---');
    contactedLeads.forEach(l => {
      console.log(`ID: ${l.lead_id}`);
      console.log(`Name: ${l.name}`);
      console.log(`Status: ${l.status}`);
      console.log(`Email: ${l.email} (Verified: ${l.email_verified})`);
      console.log(`Phone: ${l.phone_e164 || l.phone_raw}`);
      console.log(`Notes: ${l.notes}`);
      console.log('------------------------------');
    });

    // Save report
    fs.writeFileSync('detail_inspect_results.json', JSON.stringify(report, null, 2), 'utf8');
    console.log('Inspection report saved to detail_inspect_results.json successfully.');

  } catch (err) {
    console.error('Inspection failed:', err);
  }
}

runInspection();


