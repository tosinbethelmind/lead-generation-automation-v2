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

async function runRouting() {
  const startTime = Date.now();
  console.log('🤖 Starting Lead Routing Engine...');

  try {
    // 1. Fetch Installer service areas and subscriptions
    console.log('📡 Fetching service areas and subscriptions...');
    const [areasRes, subsRes] = await Promise.all([
      supabase.from('installer_service_areas').select('*'),
      supabase.from('installer_subscriptions').select('*')
    ]);

    if (areasRes.error) throw areasRes.error;
    if (subsRes.error) throw subsRes.error;

    const serviceAreas = areasRes.data || [];
    const subscriptions = subsRes.data || [];
    console.log(`Loaded ${serviceAreas.length} service areas and ${subscriptions.length} subscriptions.`);

    // Helper to get priority score
    const getPriority = (instId) => {
      const sub = subscriptions.find(s => s.installer_id === instId);
      if (!sub) return 0;
      if (sub.tier === 'verified_partner_plus') return 1000;
      if (sub.tier === 'verified_partner') return 500;
      return 0; // basic tier
    };

    const args = process.argv.slice(2);
    const shouldClear = args.includes('--clear');

    if (shouldClear) {
      console.log('🧹 Clearing all existing lead assignments as requested...');
      const { error: clearErr } = await supabase.from('lead_assignments').delete().neq('id', '');
      if (clearErr) throw clearErr;
      console.log('✅ Lead assignments cleared.');
    }

    // 2. Fetch already assigned lead IDs to avoid redundant routing
    console.log('📡 Fetching existing assignments to identify unassigned leads...');
    let existingAssignedSet = new Set();
    let hasMoreAssignments = true;
    let assignmentPage = 0;
    const ASSIGNMENT_PAGE_SIZE = 1000;

    while (hasMoreAssignments) {
      const { data, error } = await supabase
        .from('lead_assignments')
        .select('lead_id')
        .range(assignmentPage * ASSIGNMENT_PAGE_SIZE, (assignmentPage + 1) * ASSIGNMENT_PAGE_SIZE - 1);

      if (error) throw error;
      if (!data || data.length === 0) {
        hasMoreAssignments = false;
      } else {
        for (const item of data) {
          existingAssignedSet.add(item.lead_id);
        }
        assignmentPage++;
        process.stdout.write(`Loaded ${existingAssignedSet.size} assigned lead IDs...\r`);
      }
    }
    console.log(`\nFound ${existingAssignedSet.size} leads already assigned.`);

    // 3. Fetch leads and route them in pages
    let hasMoreLeads = true;
    let leadPage = 0;
    const LEAD_PAGE_SIZE = 1000;
    let totalAssignmentsCreated = 0;
    let totalLeadsRouted = 0;

    while (hasMoreLeads) {
      console.log(`\n📖 Processing leads page ${leadPage + 1}...`);
      const { data: leads, error } = await supabase
        .from('marketplace_leads')
        .select('id, state, city')
        .range(leadPage * LEAD_PAGE_SIZE, (leadPage + 1) * LEAD_PAGE_SIZE - 1);

      if (error) throw error;
      if (!leads || leads.length === 0) {
        hasMoreLeads = false;
        break;
      }

      const pendingLeads = leads.filter(l => !existingAssignedSet.has(l.id));
      console.log(`Page contains ${leads.length} leads (${pendingLeads.length} are unassigned).`);

      if (pendingLeads.length === 0) {
        leadPage++;
        continue;
      }

      const newAssignments = [];
      for (const lead of pendingLeads) {
        const leadStateNormalized = lead.state.toLowerCase().trim() === 'fct' ? 'abuja' : lead.state.toLowerCase().trim();
        const leadCityNormalized = lead.city ? lead.city.toLowerCase().trim() : '';

        // Find state & city matches
        let matchingInstallerIds = Array.from(
          new Set(
            serviceAreas
              .filter(
                sa =>
                  sa.state.toLowerCase().trim() === leadStateNormalized &&
                  sa.city.toLowerCase().trim() === leadCityNormalized
              )
              .map(sa => sa.installer_id)
          )
        );

        // Fallback to State only
        if (matchingInstallerIds.length === 0) {
          matchingInstallerIds = Array.from(
            new Set(
              serviceAreas
                .filter(sa => sa.state.toLowerCase().trim() === leadStateNormalized)
                .map(sa => sa.installer_id)
            )
          );
        }

        // Fallback to Nationwide/Regional installers
        if (matchingInstallerIds.length === 0) {
          matchingInstallerIds = ['inst-5', 'inst-8', 'inst-9', 'inst-12', 'inst-13', 'inst-20', 'inst-22'];
        }

        if (matchingInstallerIds.length > 0) {
          // Sort by tier priority descending
          const sortedByTier = matchingInstallerIds.sort((a, b) => getPriority(b) - getPriority(a));
          const topMatch = sortedByTier[0];
          const topSub = subscriptions.find(s => s.installer_id === topMatch);
          const isExclusive = topSub?.tier === 'verified_partner_plus';

          if (isExclusive) {
            newAssignments.push({
              id: `la_${lead.id}_${topMatch}`,
              lead_id: lead.id,
              installer_id: topMatch,
              status: 'pending',
              is_exclusive: true,
              assigned_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          } else {
            // Share with top 3
            sortedByTier.slice(0, 3).forEach((instId) => {
              newAssignments.push({
                id: `la_${lead.id}_${instId}`,
                lead_id: lead.id,
                installer_id: instId,
                status: 'pending',
                is_exclusive: false,
                assigned_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            });
          }
          totalLeadsRouted++;
        }
      }

      // Insert assignments in chunks of 2,000
      if (newAssignments.length > 0) {
        console.log(`📥 Inserting ${newAssignments.length} new assignments into Supabase...`);
        const CHUNK_SIZE = 2000;
        for (let j = 0; j < newAssignments.length; j += CHUNK_SIZE) {
          const chunk = newAssignments.slice(j, j + CHUNK_SIZE);
          const { error: insertErr } = await supabase
            .from('lead_assignments')
            .upsert(chunk, { onConflict: 'id' }); // Upsert to avoid potential constraint issues

          if (insertErr) {
            console.error(`❌ Failed to insert assignment chunk starting at index ${j}:`, insertErr.message);
          } else {
            totalAssignmentsCreated += chunk.length;
          }
        }
      }

      leadPage++;
      // Limit execution to prevent massive script runtimes if running outside background
      // Or run to completion
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n🎉 Routing complete!`);
    console.log(`Leads processed/assigned: ${totalLeadsRouted}`);
    console.log(`Total assignment rows created: ${totalAssignmentsCreated}`);
    console.log(`Duration: ${duration}s`);

    // Write audit log
    await supabase.from('operations_audit_log').insert({
      action_type: 'lead_route',
      status: 'success',
      payload: { leads_routed: totalLeadsRouted, assignments_created: totalAssignmentsCreated },
      response_details: `Completed routing of unassigned leads. Created ${totalAssignmentsCreated} assignments in ${duration}s.`,
      duration_ms: Date.now() - startTime
    });

  } catch (err) {
    console.error('❌ Routing failed:', err.message);
    // Write failed audit log
    await supabase.from('operations_audit_log').insert({
      action_type: 'lead_route',
      status: 'failed',
      response_details: `Routing failed: ${err.message}`,
      duration_ms: Date.now() - startTime
    });
  }
}

runRouting();
