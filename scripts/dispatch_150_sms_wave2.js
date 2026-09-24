/**
 * @file scripts/dispatch_150_sms_wave2.js
 * 
 * 150-LEAD CARRIER GSM SMS DISPATCH CAMPAIGN (WAVE 2)
 * 
 * INVARIANTS:
 * 1. Exactly 150 NEW, UNCONTACTED genuine commercial leads.
 * 2. 2-Stage Drip Sequence strictly <= 158 chars each (1 GSM credit per message):
 *    - Message 1: Operational hook tailored by sector (< 158 chars).
 *    - Message 2: Private demo link + self-identifying WhatsApp link (< 158 chars).
 * 3. Gateways: Local Android GSM Gateway (http://192.168.0.121:8082/message / Tailscale http://100.107.243.108:8082/message).
 * 4. Cross-Ledger Sync: Real-time update to leads_db.json, sms_dispatches.json, and lead_journeys.json.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const LEADS_DB_PATH = path.join(LOCAL_DB, 'leads_db.json');
const CRM_LEADS_PATH = path.join(LOCAL_DB, 'crm_leads.json');
const SMS_LOG_PATH = path.join(LOCAL_DB, 'sms_dispatches.json');
const JOURNEYS_PATH = path.join(LOCAL_DB, 'lead_journeys.json');
const SMS_TOKEN = 'f34af5ea-f657-41b1-b83e-4a59eb786e57';

const GATEWAY_CANDIDATES = [
  'http://192.168.0.153:8082/message',
  'http://192.168.0.121:8082/message',
  'http://100.107.243.108:8082/message',
  'http://127.0.0.1:8082/message'
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanPhone(rawPhone) {
  if (!rawPhone) return null;
  let digits = String(rawPhone).replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 14) return null;
  if (/0000|1111|8888|9999|123456|666777/.test(digits)) return null;
  if (digits.startsWith('234') && digits.length === 13) return '+' + digits;
  if (digits.startsWith('0') && digits.length === 11) return '+234' + digits.substring(1);
  if (digits.length === 10) return '+234' + digits;
  return '+' + digits;
}

function isGenuineLead(lead) {
  const name = (lead.name || lead.business_name || '').trim();
  const phone = cleanPhone(lead.phone || lead.phone_e164 || lead.phone_raw);

  if (!phone) return false;
  if (/example\.com|test\.com|synthetic|testlead/i.test(lead.email || '')) return false;
  if (/premium.*?\d+/i.test(name) || /hub\s*#\d+/i.test(name) || /#\d+/i.test(name)) return false;
  if (/mock_|synthetic_/i.test(name)) return false;

  return true;
}

function cleanBusinessName(name) {
  if (!name) return 'Commercial Business';
  return name.split('||')[0].split('|')[0].split('-')[0].trim();
}

function generateSlug(name, leadId) {
  if (leadId && typeof leadId === 'string' && leadId.length > 3 && !leadId.startsWith('lead_')) {
    return leadId;
  }
  return cleanBusinessName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'lagos-business';
}

function formatSms(lead) {
  const rawName = cleanBusinessName(lead.name || lead.business_name || 'Business');
  const cleanName = rawName.length > 14 ? rawName.slice(0, 12).trim() : rawName;
  const cat = ((lead.category || lead.sector || '') + ' ' + rawName).toLowerCase();

  let prepSms = '';
  if (/solar|inverter|energy|battery/i.test(cat)) {
    prepSms = `Good day ${cleanName} team. After-hours solar clients wait hours for quotes. We built a 24/7 WhatsApp BOQ quoter for your firm. May I send a quick demo?`;
  } else if (/clinic|dental|dentist|health|hospital|doctor|eye|medical/i.test(cat)) {
    prepSms = `Good day ${cleanName} team. Patients booking after clinic hours experience delays. We built a 24/7 WhatsApp patient booking tool. May I send a quick demo?`;
  } else if (/hotel|shortlet|apartment|suite|resort/i.test(cat)) {
    prepSms = `Good day ${cleanName} team. Guests checking rooms at night often book elsewhere. We built a 24/7 direct WhatsApp booking tool. May I share a quick demo?`;
  } else if (/school|academy|college|creche/i.test(cat)) {
    prepSms = `Good day ${cleanName} team. Parents inquiring for admissions need instant fee info. We built a 24/7 WhatsApp enquiry tool for you. May I send a demo?`;
  } else if (/auto|car|dealership|spare|motor/i.test(cat)) {
    prepSms = `Good day ${cleanName} team. Buyers inquiring for car pricing wait hours for details. We built a 24/7 WhatsApp auto quote tool. May I share a quick demo?`;
  } else {
    prepSms = `Good day ${cleanName} team. After-hours clients often wait hours for quotes. We built a 24/7 WhatsApp quoting assistant for your firm. May I send a demo?`;
  }

  if (prepSms.length > 158) prepSms = prepSms.slice(0, 158);

  const slug = generateSlug(cleanName, lead.lead_id || lead.id);
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const prefill = encodeURIComponent(cleanName);
  let linkSms = `Hello ${cleanName}! Tap demo: ${previewUrl} (WhatsApp: wa.me/2348022791227?text=${prefill})`;

  if (linkSms.length > 158) linkSms = linkSms.slice(0, 158);

  return { prepSms, linkSms, previewUrl };
}

async function sendSmsWithCascade(phone, messageText) {
  for (const url of GATEWAY_CANDIDATES) {
    try {
      const resp = await axios.post(url, {
        to: phone,
        message: messageText
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': SMS_TOKEN
        },
        timeout: 4000
      });
      return { success: true, gateway: url, data: resp.data };
    } catch (_) {}
  }

  return { success: false, error: 'Gateway unavailable' };
}

async function run150SmsCampaign() {
  console.log('========================================================================');
  console.log('📱 LAUNCHING 150-LEAD CARRIER GSM SMS CAMPAIGN (WAVE 2)');
  console.log('💬 STRICT 2-MESSAGE DRIP SEQUENCE (<= 158 CHARACTERS EACH)');
  console.log('🌐 CARRIER GATEWAY: http://192.168.0.121:8082 / Tailscale Active');
  console.log('========================================================================\n');

  let leads = [];
  if (fs.existsSync(LEADS_DB_PATH)) {
    try { leads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8')); } catch (_) {}
  }
  let crmLeads = [];
  if (fs.existsSync(CRM_LEADS_PATH)) {
    try { crmLeads = JSON.parse(fs.readFileSync(CRM_LEADS_PATH, 'utf8')); } catch (_) {}
  }

  let journeys = {};
  if (fs.existsSync(JOURNEYS_PATH)) {
    try { journeys = JSON.parse(fs.readFileSync(JOURNEYS_PATH, 'utf8')); } catch (_) {}
  }

  let smsLog = [];
  if (fs.existsSync(SMS_LOG_PATH)) {
    try { smsLog = JSON.parse(fs.readFileSync(SMS_LOG_PATH, 'utf8')); } catch (_) {}
  }

  // Find all previously contacted phone numbers across today's dispatches
  const contactedPhones = new Set();
  smsLog.forEach(s => {
    const p = cleanPhone(s.phone);
    if (p) contactedPhones.add(p);
  });
  leads.forEach(l => {
    if (l.sms_dispatched_today) {
      const p = cleanPhone(l.phone || l.phone_e164 || l.phone_raw);
      if (p) contactedPhones.add(p);
    }
  });

  // Filter eligible unique genuine phone leads that have NOT been contacted today
  const phoneMap = new Map();
  leads.filter(isGenuineLead).forEach(l => {
    const p = cleanPhone(l.phone || l.phone_e164 || l.phone_raw);
    if (p && !contactedPhones.has(p) && !phoneMap.has(p)) phoneMap.set(p, l);
  });
  crmLeads.filter(isGenuineLead).forEach(l => {
    const p = cleanPhone(l.phone || l.phone_e164 || l.phone_raw);
    if (p && !contactedPhones.has(p) && !phoneMap.has(p)) phoneMap.set(p, l);
  });

  const eligible = Array.from(phoneMap.values());

  console.log(`📊 Total previously contacted phone numbers: ${contactedPhones.size}`);
  console.log(`🎯 Fresh eligible uncontacted leads in queue: ${eligible.length}`);

  const targetCount = Math.min(eligible.length, 150);
  console.log(`🚀 Commencing 2-message sequence dispatch to ${targetCount} fresh commercial leads...\n`);

  let deliveredCount = 0;
  let failedCount = 0;

  for (let i = 0; i < targetCount; i++) {
    const lead = eligible[i];
    const phone = cleanPhone(lead.phone || lead.phone_e164 || lead.phone_raw);
    const bName = cleanBusinessName(lead.name || lead.business_name);
    const { prepSms, linkSms, previewUrl } = formatSms(lead);

    console.log(`[${i + 1}/${targetCount}] 📱 Target: ${bName} (${phone})`);
    console.log(`   📤 Msg 1 (${prepSms.length}c): "${prepSms}"`);

    // Step 1: Send Hook Message
    const resPrep = await sendSmsWithCascade(phone, prepSms);

    // Step 2: Send Demo Link Message (2.5s pacing)
    await sleep(2500);
    console.log(`   📤 Msg 2 (${linkSms.length}c): "${linkSms}"`);
    const resLink = await sendSmsWithCascade(phone, linkSms);

    if (resPrep.success || resLink.success) {
      deliveredCount++;
      lead.sms_dispatched_today = true;
      lead.sms_dispatched_at = new Date().toISOString();
      lead.sms_status = 'DELIVERED';
      lead.sms_gateway = resLink.gateway || resPrep.gateway;

      const leadId = lead.id || lead.lead_id || `lead_${generateSlug(bName)}`;
      if (!journeys[leadId]) {
        journeys[leadId] = {
          leadId,
          leadName: bName,
          category: lead.category || lead.sector || 'Commercial Business',
          phone: phone,
          email: lead.email || '',
          area: lead.area || lead.city || 'Lagos',
          currentStage: 'OUTREACH_DISPATCHED',
          score: 65,
          heatScore: 35,
          intentLevel: 'WARM',
          previewUrl: previewUrl,
          createdAt: new Date().toISOString(),
          lastActiveIso: new Date().toISOString(),
          lastUpdatedWat: new Date().toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos' }) + ' WAT',
          metrics: { pageViews: 0, calculatorInteractions: 0, videoWatchSec: 0, chatMessages: 0, checkoutAttempts: 0, totalTimeSec: 0, rageClicks: 0 },
          events: []
        };
      }
      journeys[leadId].events.push({
        id: `evt_sms_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        leadId,
        leadName: bName,
        stage: 'OUTREACH_DISPATCHED',
        title: 'Carrier GSM SMS 2-Stage Drip Delivered',
        description: `Delivered operational hook & self-identifying demo link via GSM Carrier Gateway (${phone})`,
        channelUsed: 'Carrier GSM SMS',
        timestamp: new Date().toISOString(),
        timestampWat: new Date().toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos' }) + ' WAT',
        metadata: { phone, previewUrl, msg1Length: prepSms.length, msg2Length: linkSms.length, wave: 2 }
      });

      smsLog.push({
        lead_id: leadId,
        phone,
        name: bName,
        prep_message: prepSms,
        link_message: linkSms,
        status: 'DELIVERED',
        gateway: resLink.gateway || resPrep.gateway,
        timestamp: new Date().toISOString()
      });

      console.log(`   ✅ DELIVERED via ${resLink.gateway || resPrep.gateway}\n`);
    } else {
      failedCount++;
      console.log(`   ❌ FAILED: Gateway delivery failed\n`);
    }

    // Pacing between different leads: 3.5s (Safe rate for GSM SIM carrier billing)
    await sleep(3500);

    // Save progress every 10 leads
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2));
      fs.writeFileSync(SMS_LOG_PATH, JSON.stringify(smsLog, null, 2));
      fs.writeFileSync(JOURNEYS_PATH, JSON.stringify(journeys, null, 2));
      console.log(`💾 Progress synced (${deliveredCount} delivered, ${failedCount} failed)...\n`);
    }
  }

  // Final flush
  fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2));
  fs.writeFileSync(SMS_LOG_PATH, JSON.stringify(smsLog, null, 2));
  fs.writeFileSync(JOURNEYS_PATH, JSON.stringify(journeys, null, 2));

  console.log('\n========================================================================');
  console.log(`🎉 150-LEAD CARRIER GSM SMS CAMPAIGN (WAVE 2) COMPLETE!`);
  console.log(`• Total Leads Contacted with 2-Message Drip: ${deliveredCount}`);
  console.log(`• Total Failed: ${failedCount}`);
  console.log(`• Cross-Ledger Sync: leads_db.json, sms_dispatches.json, lead_journeys.json`);
  console.log('========================================================================\n');
}

run150SmsCampaign().catch(console.error);
