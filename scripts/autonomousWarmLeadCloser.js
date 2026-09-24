/**
 * scripts/autonomousWarmLeadCloser.js
 * 
 * Autonomous WhatsApp Sales Closer Engine for High-Intent Interacting Leads.
 * 
 * - Queries Supabase Cloud telemetry logs for verified lead interactions.
 * - Reconciles lead identity, phone number, sector, and preview URL.
 * - Drafts sector-tailored, high-conviction Nigerian executive closer copy.
 * - Includes both the personalized prototype link and the 1-minute video walkthrough.
 * - Dispatches via active Baileys WhatsApp Line 1 (port 3007) with human jitter.
 * - Enforces strict anti-duplicate protection and updates Supabase logs + local journeys.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { createClient } = require('@supabase/supabase-js');

// ── Configuration & Paths ──
const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');
const DISPATCHED_STORE_PATH = path.join(LOCAL_DB_DIR, 'warm_leads_dispatched.json');
const JOURNEYS_PATH = path.join(LOCAL_DB_DIR, 'lead_journeys.json');
const SMS_DISPATCHES_PATH = path.join(LOCAL_DB_DIR, 'sms_dispatches.json');
const WEBFORMS_PATH = path.join(LOCAL_DB_DIR, 'real_webform_submissions.json');

const BAILEYS_URL = 'http://localhost:3007/send';
const APP_BASE_URL = 'https://www.bethelmindanalytics.com';
const VIDEO_WALKTHROUGH_URL = `${APP_BASE_URL}/walkthrough`;

// ── Supabase Client ──
function getSupabase() {
  const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
  const envVars = {};
  envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      envVars[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
  const url = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.SUPABASE_URL;
  const key = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createClient(url, key);
}

// ── Helper: Clean Nigerian Phone Number to E.164 ──
function cleanPhone(raw) {
  if (!raw) return '';
  let cleaned = String(raw).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) cleaned = cleaned.substring(1);
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '234' + cleaned.substring(1);
  } else if (cleaned.startsWith('234') && cleaned.length === 13) {
    // valid
  } else if (cleaned.length === 10) {
    cleaned = '234' + cleaned;
  }
  return cleaned;
}

// ── Helper: Get Already Dispatched Record ──
function getDispatchedHistory() {
  try {
    if (fs.existsSync(DISPATCHED_STORE_PATH)) {
      return JSON.parse(fs.readFileSync(DISPATCHED_STORE_PATH, 'utf8'));
    }
  } catch (_) {}
  return {};
}

function saveDispatchedHistory(history) {
  fs.writeFileSync(DISPATCHED_STORE_PATH, JSON.stringify(history, null, 2), 'utf8');
}

// ── Tailored Closer Copy Generator ──
function generateCloserPitch(lead) {
  const { businessName, category, previewUrl, totalInteractions } = lead;
  const cat = (category || '').toLowerCase();

  let sectorHook = '';
  let sectorTool = '';

  if (cat.includes('real') || cat.includes('propert') || businessName.toLowerCase().includes('propert')) {
    sectorHook = 'We noticed your team recently checked the interactive real estate quoter portal we built for your firm. In Nigerian property sales, after-hours buyers inquiring after 7:00 PM wait hours for price sheets, and 40% end up booking site inspections with other agencies.';
    sectorTool = 'We pre-configured a 24/7 WhatsApp AI Property & Mortgage Assistant for your firm that answers buyer questions, shares verified floor plans, and schedules private site viewings in under 3 seconds.';
  } else if (cat.includes('solar') || cat.includes('energy') || cat.includes('inverter') || businessName.toLowerCase().includes('solar')) {
    sectorHook = 'We noticed your team recently explored the custom solar EPC prototype we staged for your firm. In the solar industry today, customers inquiring for quotes wait hours for manual site assessments, during which they contact competing installers.';
    sectorTool = 'We pre-installed an interactive WhatsApp 24/7 Solar BOQ Load Sizer & DisCo Band A Avoidance Calculator (avoiding ₦209.50/kWh) directly on your portal so your clients receive custom inverter, battery, and panel quotes on WhatsApp in 2 minutes.';
  } else if (cat.includes('health') || cat.includes('clinic') || cat.includes('hospital') || cat.includes('dental')) {
    sectorHook = 'We noticed your management team recently reviewed the healthcare portal prototype we designed for your clinic. In healthcare, patients trying to schedule appointments after clinic hours experience frustrating delays.';
    sectorTool = 'We activated a 24/7 WhatsApp Patient Triage & HMO Pre-Booking Tool for your clinic that automatically captures patient symptoms, verifies HMO provider eligibility, and confirms doctor consultation slots.';
  } else if (cat.includes('logistics') || cat.includes('freight') || cat.includes('shipping') || cat.includes('haulage')) {
    sectorHook = 'We noticed your team recently inspected the logistics & haulage portal prototype we set up for your firm. Shippers and importers looking for haulage rates often demand instant pricing before booking cargo.';
    sectorTool = 'We activated a 24/7 WhatsApp Container Haulage & Customs Duty Estimator for your firm that quotes accurate waybill rates and port clearing timelines instantly.';
  } else if (cat.includes('hospitality') || cat.includes('beach') || cat.includes('hotel') || cat.includes('shortlet')) {
    sectorHook = 'We noticed your team recently reviewed the hospitality portal prototype we staged for your venue. Hospitality venues in Lagos lose thousands in OTA commissions to third-party booking sites.';
    sectorTool = 'We built a 24/7 Direct WhatsApp VIP Booking & Paystack Reservation Gateway for your venue that secures dates with 0% third-party commission and instant bank transfer confirmation.';
  } else if (cat.includes('event') || cat.includes('cater') || cat.includes('decor')) {
    sectorHook = 'We noticed your team recently inspected the event & catering prototype we staged for your brand. Event planners and clients inquiring for dates need instant per-head budget estimates before committing.';
    sectorTool = 'We pre-installed a 24/7 WhatsApp Event Menu Builder & Per-Head Budget Calculator that captures client headcount and locks event bookings with instant deposit payment.';
  } else if (cat.includes('manufactur') || cat.includes('metal') || cat.includes('engineer') || cat.includes('technical')) {
    sectorHook = 'We noticed your engineering team recently inspected the B2B portal prototype we built for your firm. Industrial buyers and contractors inquiring for wholesale specifications need immediate catalog specs and bulk price brackets.';
    sectorTool = 'We pre-configured a 24/7 WhatsApp Wholesale RFQ Quoter & Technical Tender Estimator that qualifies commercial contractors and prepares itemized quotation sheets automatically.';
  } else if (cat.includes('repair') || cat.includes('phone') || cat.includes('laptop') || cat.includes('electronic')) {
    sectorHook = 'We noticed your team recently checked out the repair & device portal prototype we built for your brand. Customers with faulty devices need instant diagnostics and transparent repair cost ranges before bringing their gadgets in.';
    sectorTool = 'We pre-configured a 24/7 WhatsApp Device Repair Diagnostic & Pickup Booking Assistant that gives instant repair estimates and books technician drop-offs.';
  } else if (cat.includes('educat') || cat.includes('school') || cat.includes('tutor')) {
    sectorHook = 'We noticed your team recently checked the educational portal prototype we set up for your institution. Parents seeking admission and tutoring need immediate curriculum details and fee schedules without waiting for manual replies.';
    sectorTool = 'We activated a 24/7 WhatsApp Parent Admissions Assistant & Tuition Fee Calculator that answers questions and registers students automatically.';
  } else {
    sectorHook = 'We noticed your team recently explored the custom commercial business prototype we staged for your company. In Lagos, businesses that take more than 5 minutes to answer prospect inquiries lose over 50% of high-intent clients to faster competitors.';
    sectorTool = 'We pre-installed a 24/7 Conversational AI WhatsApp Sales & Quoting Assistant tailored to your services that closes deals, provides accurate pricing, and collects client contact details automatically.';
  }

  // High engagement acknowledgement
  let engagementProof = '';
  if (totalInteractions >= 5) {
    engagementProof = `\n\nWe saw you interacted deeply with the features on the portal (${totalInteractions} tool interactions logged).`;
  }

  const pitch = 
`Good day Chief, Management Team at *${businessName}* 🙏

Trust operations are moving smoothly this week.

${sectorHook}${engagementProof}

${sectorTool}

🔗 *Your Live Interactive Prototype Portal:*
${previewUrl}

⚡ *Interactive Live Demonstration of Your 24/7 Quoting Tool:*
${VIDEO_WALKTHROUGH_URL}?lead=${lead.leadId}

━━━━━━━━━━━━━━━━━━━━
💡 *HOW WE CAN ACTIVATE THIS FOR YOU TODAY:*

1️⃣ *100% Done-For-You Turnkey Deployment (₦75,000 50% Deposit / ₦150,000 Complete):*
• Custom commercial .com.ng domain registered in your company name
• Ultra-fast 24/7 Cloud Hosting (0ms lag, mobile-optimized)
• Google Maps & Lagos Business SEO verification
• Pre-installed 24/7 AI WhatsApp Quoting Assistant connected directly to your official line

2️⃣ *10-Minute 1-Line Embed Upgrade (₦35,000 One-Time):*
• If you already have a website, we plug our 24/7 WhatsApp AI Quoter directly into your existing site. Your current hosting and domain remain 100% untouched.

Would you like our engineering desk to connect this to your official WhatsApp line today? 

Simply reply *YES* or call our Lagos closer desk directly:
📞 *0802 279 1227*

Warm regards,
*Bethelmind Analytics Lagos Desk*
Plot 12, Commercial Corridor, Lagos
(Reply STOP to opt out)`;

  return pitch;
}

// ── Baileys Line 1 Dispatcher ──
async function sendBaileysMessage(phone, text) {
  const payload = JSON.stringify({
    phone: phone,
    message: text,
    text: text
  });

  return new Promise((resolve) => {
    try {
      const urlObj = new URL(BAILEYS_URL);
      const req = http.request({
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 20000
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, status: res.statusCode, body });
          } else {
            resolve({ success: false, status: res.statusCode, error: body });
          }
        });
      });

      req.on('error', (e) => resolve({ success: false, error: e.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, error: 'Connection timed out (20s)' });
      });

      req.write(payload);
      req.end();
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
}

// ── Sleep Utility ──
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Main Autonomous Orchestrator ──
async function runCloser() {
  const isLive = process.argv.includes('--live');
  const isDryRun = !isLive || process.argv.includes('--dry-run');

  console.log('================================================================');
  console.log(`🤖 AUTONOMOUS WARM LEAD CLOSER ENGINE — ${isLive ? 'LIVE DISPATCH MODE' : 'DRY-RUN INSPECTION MODE'}`);
  console.log(`📅 Timestamp: ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })} WAT`);
  console.log('================================================================\n');

  const supabase = getSupabase();

  // 1. Fetch all confirmed journey interaction events from Supabase Cloud
  console.log('🔍 Fetching live interaction events from Supabase Cloud logs...');
  const { data: logs, error: logErr } = await supabase
    .from('logs')
    .select('*')
    .ilike('step', '%JOURNEY%')
    .order('timestamp', { ascending: true });

  if (logErr) {
    console.error('❌ Failed to fetch Supabase logs:', logErr.message);
    process.exit(1);
  }

  // Aggregate by leadId
  const interactionsMap = {};
  logs.forEach(l => {
    const leadId = l.run_id ? l.run_id.replace(/^journey_/, '') : 'unknown';
    if (!interactionsMap[leadId]) {
      interactionsMap[leadId] = { count: 0, events: [] };
    }
    interactionsMap[leadId].count++;
    interactionsMap[leadId].events.push(l);
  });

  const interactingLeadIds = Object.keys(interactionsMap);
  console.log(`✅ Found ${logs.length} telemetry interaction events across ${interactingLeadIds.length} distinct leads.\n`);

  // 2. Load Local Data Sources for Phone & Business Name Reconciliation
  let smsList = [];
  try { smsList = JSON.parse(fs.readFileSync(SMS_DISPATCHES_PATH, 'utf8')); } catch (_) {}
  let webforms = [];
  try { webforms = JSON.parse(fs.readFileSync(WEBFORMS_PATH, 'utf8')); } catch (_) {}

  // Also query Supabase leads table
  const { data: dbLeads } = await supabase
    .from('leads')
    .select('lead_id, name, business_name, category, phone_raw, phone_e164, phone, area, city')
    .in('lead_id', interactingLeadIds);

  const dbLeadsMap = {};
  (dbLeads || []).forEach(l => { dbLeadsMap[l.lead_id] = l; });

  const history = getDispatchedHistory();

  // 3. Compile Qualified Target Leads with Verified Phone Numbers
  const targetLeads = [];

  for (const leadId of interactingLeadIds) {
    let businessName = '';
    let phone = '';
    let category = '';

    // Match SMS dispatches
    for (const s of smsList) {
      const str = JSON.stringify(s);
      if (str.includes(leadId) || (s.slug && s.slug.includes(leadId))) {
        businessName = s.businessName || s.name || businessName;
        phone = s.phone || phone;
        category = s.category || category;
        break;
      }
    }

    // Match Webforms
    if (!businessName) {
      for (const w of webforms) {
        if (JSON.stringify(w).includes(leadId)) {
          businessName = w.businessName || w.name || businessName;
          break;
        }
      }
    }

    // Match Supabase DB
    const dbLead = dbLeadsMap[leadId];
    if (dbLead) {
      businessName = businessName || dbLead.business_name || dbLead.name;
      phone = phone || dbLead.phone_e164 || dbLead.phone_raw || dbLead.phone;
      category = category || dbLead.category;
    }

    const cleanedPhoneNumber = cleanPhone(phone);
    if (!cleanedPhoneNumber) {
      // Skip leads without a valid phone number (e.g. anonymous diplomatic visitors without contact)
      continue;
    }

    const previewUrl = `${APP_BASE_URL}/preview/${leadId}`;
    const totalInteractions = interactionsMap[leadId].count;

    targetLeads.push({
      leadId,
      businessName: businessName || `Enterprise Lead ${leadId}`,
      phone: cleanedPhoneNumber,
      category: category || 'Commercial SME',
      previewUrl,
      totalInteractions,
      alreadyDispatched: !!history[leadId]
    });
  }

  console.log(`🎯 Qualified Leads with Verified Phone Numbers: ${targetLeads.length}`);
  console.log(`📋 Already Dispatched Previously: ${targetLeads.filter(t => t.alreadyDispatched).length}`);
  console.log(`🚀 Ready for Closer Pitch: ${targetLeads.filter(t => !t.alreadyDispatched).length}\n`);

  // 4. Pre-Flight WhatsApp Line Health Check
  console.log('📡 Checking WhatsApp Baileys Line 1 on Port 3007...');
  let lineConnected = false;
  try {
    const statusRes = await new Promise((res) => {
      http.get('http://localhost:3007/status', r => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => res(JSON.parse(d || '{}')));
      }).on('error', () => res({}));
    });
    lineConnected = statusRes.status === 'connected';
    console.log(`📶 Line 1 Status: ${statusRes.status || 'OFFLINE'} (${statusRes.phone || 'No Phone'})\n`);
  } catch (_) {
    console.log('⚠️ Could not connect to Port 3007.\n');
  }

  if (isLive && !lineConnected) {
    console.error('❌ Cannot dispatch live messages: WhatsApp Line 1 on port 3007 is not connected.');
    process.exit(1);
  }

  // 5. Iterate and Dispatch
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < targetLeads.length; i++) {
    const lead = targetLeads[i];
    console.log(`\n----------------------------------------------------------------`);
    console.log(`[${i + 1}/${targetLeads.length}] LEAD: ${lead.businessName} (${lead.phone})`);
    console.log(`📂 Sector: ${lead.category} | Real Telemetry Interactions: ${lead.totalInteractions}`);
    console.log(`🔗 Prototype URL: ${lead.previewUrl}`);

    if (lead.alreadyDispatched) {
      console.log(`⏩ SKIPPED: Already received closer pitch on ${history[lead.leadId]?.dispatchedAtWat || 'prior run'}.`);
      skippedCount++;
      continue;
    }

    const pitchText = generateCloserPitch(lead);

    if (isDryRun) {
      console.log('\n📝 DRAFT CLOSER PITCH:');
      console.log(pitchText);
      console.log('----------------------------------------------------------------');
      successCount++;
    } else {
      console.log(`🚀 Dispatching Live WhatsApp Closer Pitch to +${lead.phone}...`);
      const result = await sendBaileysMessage(lead.phone, pitchText);

      if (result.success) {
        console.log(`✅ SENT SUCCESSFULLY! (Response code: ${result.status})`);
        successCount++;

        const now = new Date();
        const watTime = now.toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour12: true }) + ' WAT (' + now.toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos', month: 'short', day: 'numeric' }) + ')';

        // Record in history
        history[lead.leadId] = {
          leadId: lead.leadId,
          businessName: lead.businessName,
          phone: lead.phone,
          category: lead.category,
          totalInteractions: lead.totalInteractions,
          dispatchedAtWat: watTime,
          dispatchedAtIso: now.toISOString()
        };
        saveDispatchedHistory(history);

        // Record event in Supabase logs
        try {
          await supabase.from('logs').insert([{
            run_id: `closer_${lead.leadId}`,
            timestamp: now.toISOString(),
            step: 'JOURNEY_CLOSER_PITCH_SENT',
            status: 'SUCCESS',
            message: `🎯 [CLOSER] [${lead.businessName}] ➔ Sent Sector Video & Prototype Closer Pitch to +${lead.phone} (${watTime})`,
            tenant_id: 'default'
          }]);
        } catch (_) {}

        // Update local journey stage
        try {
          if (fs.existsSync(JOURNEYS_PATH)) {
            const journeys = JSON.parse(fs.readFileSync(JOURNEYS_PATH, 'utf8'));
            if (journeys[lead.leadId]) {
              journeys[lead.leadId].currentStage = 'CLOSER_PITCH_SENT';
              journeys[lead.leadId].lastActiveIso = now.toISOString();
              journeys[lead.leadId].events = journeys[lead.leadId].events || [];
              journeys[lead.leadId].events.unshift({
                id: `evt_closer_${Date.now()}`,
                leadId: lead.leadId,
                stage: 'CLOSER_PITCH_SENT',
                title: 'WhatsApp Closer Pitch & Walkthrough Video Dispatched',
                description: `Delivered high-conviction sector proposal & video walkthrough to +${lead.phone}`,
                timestamp: now.toISOString(),
                timestampWat: watTime
              });
              fs.writeFileSync(JOURNEYS_PATH, JSON.stringify(journeys, null, 2), 'utf8');
            }
          }
        } catch (_) {}

        // Anti-ban delay: 25s - 40s randomized delay between messages
        if (i < targetLeads.length - 1) {
          const delaySec = Math.floor(Math.random() * 16) + 25; // 25s to 40s
          console.log(`⏳ Anti-ban delay: Pausing ${delaySec}s before next pitch to emulate human typing...`);
          await sleep(delaySec * 1000);
        }
      } else {
        console.error(`❌ DISPATCH FAILED: ${result.error}`);
        failCount++;
      }
    }
  }

  console.log('\n================================================================');
  console.log('🏁 CLOSER ENGINE EXECUTION SUMMARY');
  console.log(`✅ ${isDryRun ? 'Drafted / Ready' : 'Delivered'}: ${successCount}`);
  console.log(`⏩ Skipped (Already Contacted): ${skippedCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('================================================================\n');
}

runCloser().catch(err => {
  console.error('Fatal Closer Error:', err);
  process.exit(1);
});
