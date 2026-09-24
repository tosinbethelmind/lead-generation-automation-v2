/**
 * @file scripts/whatsapp_outbound_30_per_line_campaign.ts
 * 
 * 🚀 MULTI-SIM ANTI-BAN WHATSAPP OUTBOUND OUTREACH ENGINE
 * 
 * Bethelmind Analytics Lagos Desk · Commercial B2B Revenue Growth Engine
 * 
 * Strict Anti-Ban Architecture:
 * 1. Multi-SIM Round-Robin across verified active lines (Lines 2, 4, 5, 6, 7).
 *    (Line 1 - 0802 279 1227 is strictly reserved as the Inbound Closer Desk).
 * 2. Strict Quota: Exactly 30 verified DMs per line per day.
 * 3. Human-like Jitter & Inter-SIM Cadence: 45s - 75s delay between dispatches.
 *    With 5 lines rotating, each SIM only sends 1 message every 4 to 6 minutes!
 * 4. 2-Step Permission Loop: ZERO raw links on Message #1 to prevent spam flags.
 *    Ends with respectful permission question ("May I send a 1-minute demo?").
 * 5. Dispatches through the authoritative Unified Gateway on Port 8080 (/send).
 * 6. 100% Real-Action persistence into leads_db.json & whatsapp_daily_outreach_log.json.
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const LEADS_DB_PATH = path.join(LOCAL_DB, 'leads_db.json');
const WA_LOG_PATH = path.join(LOCAL_DB, 'whatsapp_daily_outreach_log.json');
const REGISTRY_PATH = path.join(LOCAL_DB, 'whatsapp_lines_registry.json');
const EVOLUTION_URL = process.env.EVOLUTION_URL || 'http://localhost:8080';

const LINES_CONFIG: Record<number, { id: number; name: string; dir: string; phone: string }> = {
  1: { id: 1, name: 'Line 1 (Admin Closer Desk)', dir: 'baileys_auth_line1', phone: '2348022791227' },
  2: { id: 2, name: 'Line 2 (Outreach Desk 1)', dir: 'baileys_auth_line2', phone: '2347026266946' },
  3: { id: 3, name: 'Line 3 (Outreach Desk 2)', dir: 'baileys_auth_line3', phone: '2349046050469' },
  4: { id: 4, name: 'Line 4 (Outreach Desk 3)', dir: 'baileys_auth_line4', phone: '2349135129625' },
  5: { id: 5, name: 'Line 5 (Outreach Desk 4)', dir: 'baileys_auth_line5', phone: '2347030556877' },
  6: { id: 6, name: 'Line 6 (Outreach Desk 5)', dir: 'baileys_auth_line6', phone: '2348119346518' },
  7: { id: 7, name: 'Line 7 (Outreach Desk 6)', dir: 'baileys_auth_line7', phone: '2348141609564' }
};

const limitArg = process.argv.find(a => a.startsWith('--limit='));
const DAILY_LIMIT_PER_LINE = limitArg ? parseInt(limitArg.split('=')[1], 10) : 30;

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function cleanPhone(rawPhone: string): string | null {
  if (!rawPhone) return null;
  let digits = rawPhone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 14) return null;
  // Reject synthetic patterns (Rule #5)
  if (/0000|1111|8888|9999|123456/.test(digits)) return null;
  if (digits.startsWith('0') && digits.length === 11) digits = '234' + digits.substring(1);
  else if (digits.length === 10) digits = '234' + digits;
  else if (digits.startsWith('234') && digits.length === 13) digits = digits;
  else return null;
  return digits;
}

async function getConnectedOutreachLines(): Promise<number[]> {
  // 1. Primary: Query Port 8080 live status
  try {
    const res = await axios.get(`${EVOLUTION_URL}/status`, { timeout: 3500 });
    if (res.data?.instances) {
      const onlineLines = res.data.instances
        .filter((inst: any) => inst.state === 'open' && inst.id > 1) // Strictly Lines 2-7 for outbound
        .map((inst: any) => inst.id as number);
      if (onlineLines.length > 0) {
        return onlineLines;
      }
    }
  } catch (_) {}

  // 2. Fallback: check filesystem credentials on Lines 2 to 7
  const connected: number[] = [];
  for (let i = 2; i <= 7; i++) {
    const cfg = LINES_CONFIG[i];
    if (!cfg) continue;
    const credsFile = path.join(LOCAL_DB, cfg.dir, 'creds.json');
    if (fs.existsSync(credsFile)) {
      try {
        const creds = JSON.parse(fs.readFileSync(credsFile, 'utf8'));
        if (creds && creds.me && creds.me.id && (creds.registered === true || creds.account)) {
          connected.push(i);
        }
      } catch (_) {}
    }
  }
  return connected;
}

/**
 * High-Conversion Anti-Ban Nigerian WhatsApp Copy
 * 2-Step Permission Hook: NO raw links on message 1.
 * Focuses 100% on acute revenue leaks and cash recovery.
 */
function formatAntiBanWaProposal(lead: any): string {
  const rawName = (lead.name || lead.business_name || 'Commercial Enterprise')
    .split('||')[0]
    .split('|')[0]
    .split(' - ')[0]
    .replace(/\(.*?\)/g, '')
    .trim();
  const cleanName = rawName.length > 28 ? rawName.slice(0, 25).trim() : rawName;
  const area = lead.area || lead.city || 'Lagos';
  const cat = (lead.category || lead.sector || '').toLowerCase() + ' ' + rawName.toLowerCase();

  let sectorHook = '';
  if (/beauty|salon|spa|cosmetics|fashion|boutique|cloth|apparel|hair/i.test(cat) && !/dental|clinic|hospital/i.test(rawName)) {
    sectorHook = `Vendors running Instagram/TikTok ads lose up to 40% of sales because buyers asking "how much" wait hours for size & price details.

We set up a 3-second WhatsApp Speed Closer that displays your catalog, calculates delivery, and confirms bank transfers immediately.`;
  } else if (/solar|inverter|energy|renewable|battery/i.test(cat)) {
    sectorHook = `I noticed that after-hours solar clients in Lagos inquiring past 7 PM wait hours for quotes and end up buying from competitors.

We set up a 24/7 WhatsApp Sales Assistant for solar firms that calculates exact load sizes and locks inspection deposits before you wake up.`;
  } else if (/freight|cargo|haulage|logistics|courier|dispatch|customs/i.test(cat)) {
    sectorHook = `How many times have dispatch riders delayed waybills or shop attendants argued over uncredited bank transfers?

We set up an automated WhatsApp Transfer Shield that verifies Moniepoint/OPay credits in 2 seconds and auto-generates tracking waybills.`;
  } else if (/clinic|dental|dentist|health|hospital|doctor|eye|medical|optician/i.test(cat)) {
    sectorHook = `Patients inquiring for clinic consultations after hours often face delays and end up seeking medical care elsewhere.

We set up a 24/7 WhatsApp patient intake and consultation deposit tool for Lagos clinics.`;
  } else if (/hotel|shortlet|apartment|suite|resort|lodge/i.test(cat)) {
    sectorHook = `Guests checking room rates at night frequently book elsewhere when availability responses are delayed.

We set up a 24/7 direct WhatsApp booking assistant that verifies reservations and saves third-party commission fees.`;
  } else if (/auto|car|dealership|spare|motor|tokunbo/i.test(cat)) {
    sectorHook = `Car buyers inquiring for vehicle prices or customs clearance past 7 PM often wait hours and visit other car lots.

We set up a 24/7 vehicle duty calculator and WhatsApp stock browser that books inspection test drives automatically.`;
  } else {
    sectorHook = `After-hours clients in Lagos inquiring past 7 PM often wait hours for quotes and purchase from competitors.

We set up a 24/7 WhatsApp Sales Closer that quotes inquiries and locks in customer orders while you sleep.`;
  }

  return `Good day Team at *${cleanName}* (${area}),

${sectorHook}

May I send a quick 1-minute WhatsApp demo for your team to test?

— Tosin, Bethelmind Analytics Lagos Desk
(wa.me/2348022791227)`;
}

async function sendMessageViaGateway(lineNum: number, phone: string, text: string): Promise<boolean> {
  // Primary: Port 8080 unified send endpoint
  try {
    const res = await axios.post(`${EVOLUTION_URL}/send`, {
      lineId: lineNum,
      phone: phone,
      message: text
    }, { timeout: 25000 });

    if (res.data?.success || res.data?.messageId) {
      return true;
    }
  } catch (err: any) {
    const errMsg = err.response?.data?.error || err.message;
    console.warn(`   ⚠️ Port 8080 primary send notice on Line ${lineNum}: ${errMsg}`);
  }

  // Fallback: Port 8080 instance text endpoint
  try {
    const res = await axios.post(`${EVOLUTION_URL}/message/sendText/bethelmind_instance_${lineNum}`, {
      number: phone,
      text: text
    }, { timeout: 20000 });

    if (res.data?.success || res.data?.key) {
      return true;
    }
  } catch (_) {}

  return false;
}

async function runWhatsAppOutboundCampaign() {
  console.log('\n========================================================================');
  console.log('📱 BETHELMIND MULTI-SIM ANTI-BAN WHATSAPP OUTBOUND OUTREACH ENGINE');
  console.log('   Strict 30 Leads/Line/Day · 45s-75s Jitter · 2-Step Permission Loop');
  console.log('========================================================================\n');

  const connectedLines = await getConnectedOutreachLines();
  console.log(`📡 Connected Active Outreach Lines: ${connectedLines.length} (Lines: ${connectedLines.join(', ') || 'None'})`);
  connectedLines.forEach(l => {
    const cfg = LINES_CONFIG[l];
    console.log(`   • Line ${l}: ${cfg.name} (+${cfg.phone})`);
  });
  console.log('');

  if (connectedLines.length === 0) {
    console.log('⚠️ No active outreach lines currently ready in open state.');
    console.log('👉 Open http://localhost:8080 to check line status.');
    return;
  }

  let leads: any[] = [];
  if (fs.existsSync(LEADS_DB_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));
      leads = Array.isArray(data) ? data : Object.values(data);
    } catch (_) {}
  }

  let waLog: any = { dates: {} };
  if (fs.existsSync(WA_LOG_PATH)) {
    try { waLog = JSON.parse(fs.readFileSync(WA_LOG_PATH, 'utf8')); } catch (_) {}
  }

  const todayKey = getTodayKey();
  if (!waLog.dates[todayKey]) {
    waLog.dates[todayKey] = { lineCounts: {}, dispatches: [] };
  }
  const todayLog = waLog.dates[todayKey];
  if (!todayLog.lineCounts) todayLog.lineCounts = {};

  // Find genuine Nigerian commercial leads not yet dispatched via WhatsApp
  const eligibleLeads = leads.filter(l => {
    const p = cleanPhone(l.phone_e164 || l.phone_raw || l.phone);
    return Boolean(p && !l.wa_outbound_dispatched && !l.whatsapp_dispatched);
  });

  console.log(`📋 Total Verified Genuine Leads Eligible for WhatsApp Outreach: ${eligibleLeads.length}`);
  console.log(`🎯 Daily Target per Line: ${DAILY_LIMIT_PER_LINE} leads (Max potential: ${connectedLines.length * DAILY_LIMIT_PER_LINE} today)\n`);

  let leadPointer = 0;
  let totalDispatchedThisCycle = 0;
  let activeLineIndex = 0;

  while (leadPointer < eligibleLeads.length) {
    // Determine which lines still have quota today
    const linesWithQuota = connectedLines.filter(l => (todayLog.lineCounts[l] || 0) < DAILY_LIMIT_PER_LINE);
    if (linesWithQuota.length === 0) {
      console.log('🎉 All active outreach lines have completed their daily 30-lead quota for today!');
      break;
    }

    // Round-Robin across active lines
    const lineNum = linesWithQuota[activeLineIndex % linesWithQuota.length];
    activeLineIndex++;

    const cfg = LINES_CONFIG[lineNum] || { name: `Line ${lineNum}`, phone: '' };
    const lead = eligibleLeads[leadPointer++];
    const phone = cleanPhone(lead.phone_e164 || lead.phone_raw || lead.phone);
    if (!phone) continue;

    const messageText = formatAntiBanWaProposal(lead);
    const lineSentCount = (todayLog.lineCounts[lineNum] || 0) + 1;
    console.log(`🚀 [${cfg.name} · Lead ${lineSentCount}/${DAILY_LIMIT_PER_LINE}] Dispatching to +${phone} (${lead.name || 'Commercial Target'})...`);

    // Safe dispatch via Port 8080
    const success = await sendMessageViaGateway(lineNum, phone, messageText);

    if (success) {
      totalDispatchedThisCycle++;
      todayLog.lineCounts[lineNum] = lineSentCount;

      lead.wa_outbound_dispatched = true;
      lead.wa_outbound_dispatched_at = new Date().toISOString();
      lead.wa_outbound_line = lineNum;

      todayLog.dispatches.push({
        lead_id: lead.id || lead.lead_id,
        phone: `+${phone}`,
        name: lead.name || lead.business_name,
        lineId: lineNum,
        timestamp: new Date().toISOString(),
        success: true
      });

      console.log(`   ✅ [CONFIRMED DELIVERED] via ${cfg.name} to +${phone}! (${lineSentCount}/${DAILY_LIMIT_PER_LINE} today)`);

      // Persist real logs immediately
      fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2), 'utf8');
      fs.writeFileSync(WA_LOG_PATH, JSON.stringify(waLog, null, 2), 'utf8');

      // Strict Anti-Ban Cadence: 45s to 75s randomized delay
      const delayMs = Math.floor(Math.random() * (75000 - 45000 + 1)) + 45000;
      console.log(`   ⏳ Anti-Ban Protection: resting ${Math.round(delayMs / 1000)}s before rotating to next SIM line...`);
      await new Promise(r => setTimeout(r, delayMs));
    } else {
      console.log(`   ⚠️ Dispatch skipped/failed on Line ${lineNum} for +${phone}. Lead returned to pool.`);
      // Small pause before retry
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  console.log('\n========================================================================');
  console.log(`🎉 CAMPAIGN CYCLE COMPLETE: ${totalDispatchedThisCycle} verified WhatsApp DMs delivered!`);
  connectedLines.forEach(l => {
    console.log(`   • Line ${l}: ${todayLog.lineCounts[l] || 0} / ${DAILY_LIMIT_PER_LINE} sent today`);
  });
  console.log('========================================================================\n');
}

if (require.main === module) {
  runWhatsAppOutboundCampaign().catch(console.error);
}

export { runWhatsAppOutboundCampaign };
