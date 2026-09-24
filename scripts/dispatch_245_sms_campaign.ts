/**
 * @file scripts/dispatch_245_sms_campaign.ts
 * 
 * 245-LEAD HIGH-CONVERSION CARRIER GSM SMS OUTREACH DISPATCHER.
 * Direct carrier transmission with:
 * 1. Dynamic Auto-Discovery of Android GSM SMS Gateway (subnet probe + candidates failover).
 * 2. Automatic Termii Cloud API fallback.
 * 3. Smart Resume Invariant: never duplicates already delivered leads (skips the 62 confirmed leads).
 * 4. Completes partial deliveries (e.g. Stage 2 only for single-message interrupted leads).
 * 5. Double message per lead (Stage 1 Operational Leak Hook + Stage 2 Demo Link Delivery <= 158 chars each).
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const LEADS_DB_PATH = path.join(LOCAL_DB, 'leads_db.json');
const CRM_LEADS_PATH = path.join(LOCAL_DB, 'crm_leads.json');
const SMS_LOG_PATH = path.join(LOCAL_DB, 'sms_dispatches.json');
const SMS_TOKEN = process.env.SMS_GATEWAY_TOKEN || 'f34af5ea-f657-41b1-b83e-4a59eb786e57';
const TERMII_API_KEY = process.env.TERMII_API_KEY || 'tlv_HilsNNhBaQtzgLkf0nyq1Maie3kfr27xDYW2_d-JD6M';

const KNOWN_CANDIDATES = [
  'http://192.168.0.153:8082',
  'http://192.168.0.121:8082',
  'http://192.168.0.118:8082',
  'http://100.107.243.108:8082',
  'http://127.0.0.1:8082'
];

function cleanPhone(rawPhone: string): string | null {
  if (!rawPhone) return null;
  let digits = rawPhone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 14) return null;
  if (/0000|1111|8888|9999|123456|666777/.test(digits)) return null;
  if (digits.startsWith('234') && digits.length === 13) return '+' + digits;
  if (digits.startsWith('0') && digits.length === 11) return '+234' + digits.substring(1);
  if (digits.length === 10) return '+234' + digits;
  return '+' + digits;
}

const { formatSmsGuaranteed } = require('./leadClassifier');

function formatSms(lead: any): { prepSms: string; linkSms: string } {
  const res = formatSmsGuaranteed(lead);
  return {
    prepSms: res.prepSms,
    linkSms: res.linkSms
  };
}

/**
 * Discovers the active SMS gateway URL dynamically
 */
async function discoverActiveGateway(): Promise<string | null> {
  const envUrl = process.env.SMS_GATEWAY_URL ? process.env.SMS_GATEWAY_URL.replace(/\/message\/?$/, '') : null;
  const listToTry = envUrl ? [envUrl, ...KNOWN_CANDIDATES] : KNOWN_CANDIDATES;

  // 1. Check known candidates
  for (const candidate of listToTry) {
    try {
      const res = await axios.get(candidate, { timeout: 1200 });
      if (res.status >= 200 && res.status < 400) {
        return candidate;
      }
    } catch (_) {}
  }

  // 2. Fast scan across local subnet 192.168.0.2 - 192.168.0.254
  console.log('   🔍 Scanning local subnet (192.168.0.x:8082) for active Android SMS Gateway...');
  const probePromises = [];
  for (let i = 2; i < 255; i++) {
    const candidate = `http://192.168.0.${i}:8082`;
    probePromises.push(
      axios.get(candidate, { timeout: 1000 })
        .then(r => (r.status >= 200 && r.status < 400 ? candidate : null))
        .catch(() => null)
    );
  }

  const results = await Promise.all(probePromises);
  const active = results.find(Boolean);
  if (active) {
    console.log(`   🎯 Discovered active Android SMS Gateway on: ${active}`);
    return active;
  }

  return null;
}

/**
 * Sends an SMS with automatic gateway failover & Termii fallback
 */
async function sendSmsWithFailover(phone: string, messageText: string, currentGatewayUrl: string | null): Promise<{
  success: boolean;
  gatewayUsed: string;
  error?: string;
  newGatewayUrl?: string | null;
}> {
  // 1. Try GSM Gateway if available
  if (currentGatewayUrl) {
    try {
      const resp = await axios.post(`${currentGatewayUrl}/message`, {
        to: phone,
        message: messageText
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': SMS_TOKEN
        },
        timeout: 5000
      });

      if (resp.status >= 200 && resp.status < 300) {
        return { success: true, gatewayUsed: `${currentGatewayUrl}/message` };
      }
    } catch (err: any) {
      console.log(`   ⚠️ Gateway error on ${currentGatewayUrl}: ${err.code || err.message}`);
    }
  }

  // 2. Gateway may have updated IP or dropped; attempt immediate rediscovery
  console.log('   🔄 Attempting gateway auto-rediscovery...');
  const newlyDiscovered = await discoverActiveGateway();
  if (newlyDiscovered && newlyDiscovered !== currentGatewayUrl) {
    try {
      const resp = await axios.post(`${newlyDiscovered}/message`, {
        to: phone,
        message: messageText
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': SMS_TOKEN
        },
        timeout: 5000
      });

      if (resp.status >= 200 && resp.status < 300) {
        return { success: true, gatewayUsed: `${newlyDiscovered}/message`, newGatewayUrl: newlyDiscovered };
      }
    } catch (_) {}
  }

  // 3. Fallback to Termii Cloud API if available
  if (TERMII_API_KEY) {
    try {
      const cleanTarget = phone.replace('+', '');
      const resp = await axios.post('https://api.ng.termii.com/api/sms/send', {
        to: cleanTarget,
        from: 'N-Alert',
        sms: messageText,
        type: 'plain',
        channel: 'generic',
        api_key: TERMII_API_KEY
      }, { timeout: 6000 });

      if (resp.data && (resp.data.code === 'ok' || resp.data.message_id)) {
        return { success: true, gatewayUsed: 'Termii Cloud API' };
      }
    } catch (err: any) {
      console.log(`   ⚠️ Termii API error: ${err.message}`);
    }
  }

  return { success: false, gatewayUsed: 'NONE', error: 'All gateways offline or unreachable' };
}

async function run245SmsCampaign() {
  console.log('========================================================================');
  console.log('📱 LAUNCHING LIVE 245-LEAD RESILIENT CARRIER GSM SMS DISPATCH CAMPAIGN');
  console.log('• Sequence        : Stage 1 (Operational Hook) + Stage 2 (Demo Link Delivery)');
  console.log('• Length Invariant: <= 158 Characters Each (Single GSM Credit)');
  console.log('• Admin Desk CTA  : wa.me/2348022791227');
  console.log('========================================================================\n');

  // Discover Gateway
  console.log('🔎 Checking Gateway status...');
  let activeGateway = await discoverActiveGateway();
  if (activeGateway) {
    console.log(`✅ Active Android GSM Gateway Detected: ${activeGateway}`);
  } else {
    console.log(`⚠️ No local Android SMS Gateway currently active on LAN.`);
    console.log(`☁️ Falling back to Termii Cloud API / Staged Queue Mode.`);
  }

  let leadsDb: any[] = [];
  if (fs.existsSync(LEADS_DB_PATH)) {
    try { leadsDb = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8')); } catch (_) {}
  }

  let crmLeads: any[] = [];
  if (fs.existsSync(CRM_LEADS_PATH)) {
    try { crmLeads = JSON.parse(fs.readFileSync(CRM_LEADS_PATH, 'utf8')); } catch (_) {}
  }

  let smsLog: any[] = [];
  if (fs.existsSync(SMS_LOG_PATH)) {
    try { smsLog = JSON.parse(fs.readFileSync(SMS_LOG_PATH, 'utf8')); } catch (_) {}
  }

  // Check already confirmed delivered leads
  const confirmedPhones = new Set<string>();
  const partialPhones = new Map<string, any>();

  for (const s of smsLog) {
    if (s.phone && s.status === 'CONFIRMED_DELIVERED') {
      confirmedPhones.add(s.phone);
    } else if (s.phone && s.status === 'PARTIAL_DELIVERY') {
      partialPhones.set(s.phone, s);
    }
  }

  console.log(`📊 Prior State Check:`);
  console.log(`   - Leads already CONFIRMED_DELIVERED: ${confirmedPhones.size} leads (Will NOT duplicate)`);
  console.log(`   - Leads with PARTIAL_DELIVERY     : ${partialPhones.size} leads (Will complete Stage 2)`);

  // Build target 245 list
  const candidatePool: any[] = [];
  const seenPhones = new Set<string>();

  // Add partial leads first to complete them
  for (const [phone, logRecord] of partialPhones.entries()) {
    candidatePool.push({
      lead_id: logRecord.lead_id,
      name: logRecord.name,
      resolvedPhone: phone,
      isPartialResume: true
    });
    seenPhones.add(phone);
  }

  // Add unsent candidates up to 245 total
  for (const l of [...leadsDb, ...crmLeads]) {
    const raw = l.phone_e164 || l.phone_raw || l.phone || l.phoneNumber || l.contact;
    const phone = cleanPhone(raw);
    if (!phone) continue;
    if (confirmedPhones.has(phone)) continue;
    if (seenPhones.has(phone)) continue;

    const name = l.name || l.leadName || l.business_name || l.company || '';
    if (/test|mock|synthetic|sample|dummy/i.test(name)) continue;

    seenPhones.add(phone);
    candidatePool.push({
      ...l,
      resolvedPhone: phone,
      isPartialResume: false
    });

    if (candidatePool.length + confirmedPhones.size >= 245) break;
  }

  const remainingToDispatch = candidatePool;
  console.log(`🎯 Remaining Leads to Dispatch to reach 245 quota: ${remainingToDispatch.length}\n`);

  if (remainingToDispatch.length === 0) {
    console.log('✅ All 245 leads are already confirmed delivered! Nothing to dispatch.');
    return;
  }

  if (!activeGateway) {
    console.log('⚠️ Notice: Gateway is offline. If you wish to send via carrier phone, open the Android SMS Gateway app on your phone.');
    console.log('To send via Termii instead, ensure Termii balance is loaded.');
  }

  let deliveredCount = 0;
  let failedCount = 0;

  for (let i = 0; i < remainingToDispatch.length; i++) {
    const lead = remainingToDispatch[i];
    const phone = lead.resolvedPhone;
    const { prepSms, linkSms } = formatSms(lead);
    const leadDisplayName = (lead.name || lead.leadName || lead.business_name || 'Commercial SME').slice(0, 26);

    console.log(`[${i + 1}/${remainingToDispatch.length}] 📲 Target: ${leadDisplayName} (${phone})`);

    let resPrep = { success: false, gatewayUsed: 'NONE' };
    if (!lead.isPartialResume) {
      console.log(`   📤 Stage 1 [${prepSms.length}c]: "${prepSms}"`);
      resPrep = await sendSmsWithFailover(phone, prepSms, activeGateway);
      if (resPrep.newGatewayUrl) activeGateway = resPrep.newGatewayUrl;

      if (resPrep.success) {
        console.log(`   ✅ Stage 1 Sent: via ${resPrep.gatewayUsed}`);
      } else {
        console.log(`   ⚠️ Stage 1 Failed: ${resPrep.error}`);
      }

      await new Promise(r => setTimeout(r, 1500));
    } else {
      console.log(`   ℹ️ Stage 1 already sent earlier; sending Stage 2 demo link only...`);
      resPrep = { success: true, gatewayUsed: 'Earlier Transmission' };
    }

    // Step 2: Send Link
    console.log(`   📤 Stage 2 [${linkSms.length}c]: "${linkSms}"`);
    const resLink = await sendSmsWithFailover(phone, linkSms, activeGateway);
    if (resLink.newGatewayUrl) activeGateway = resLink.newGatewayUrl;

    if (resLink.success) {
      console.log(`   ✅ Stage 2 Sent: via ${resLink.gatewayUsed}`);
    } else {
      console.log(`   ⚠️ Stage 2 Failed: ${resLink.error}`);
    }

    const isConfirmed = resPrep.success && resLink.success;
    if (isConfirmed) deliveredCount++;
    else failedCount++;

    const status = isConfirmed ? 'CONFIRMED_DELIVERED' : (resPrep.success || resLink.success ? 'PARTIAL_DELIVERY' : 'FAILED');

    // Update dispatch log
    const existingLogIdx = smsLog.findIndex(s => s.phone === phone);
    const logItem = {
      lead_id: lead.lead_id || lead.id || `lead_sms_${Date.now()}_${i}`,
      phone,
      name: lead.name || lead.leadName || lead.business_name,
      stage1_hook: prepSms,
      stage2_link: linkSms,
      status,
      gateway: resLink.gatewayUsed || resPrep.gatewayUsed || (activeGateway ? `${activeGateway}/message` : 'NONE'),
      carrier_timestamp: new Date().toISOString()
    };

    if (existingLogIdx >= 0) {
      smsLog[existingLogIdx] = logItem;
    } else {
      smsLog.push(logItem);
    }

    // Update lead record in leadsDb
    const inDb = leadsDb.find(d => (d.lead_id && d.lead_id === lead.lead_id) || (cleanPhone(d.phone_e164 || d.phone) === phone));
    if (inDb) {
      inDb.sms_dispatched_today = true;
      inDb.sms_dispatched_at = new Date().toISOString();
      inDb.sms_status = status;
    }

    // Persist every 5 leads
    if ((i + 1) % 5 === 0 || (i + 1) === remainingToDispatch.length) {
      try {
        fs.writeFileSync(SMS_LOG_PATH, JSON.stringify(smsLog, null, 2));
        fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leadsDb, null, 2));
        console.log(`   💾 Progress saved (${deliveredCount} delivered, ${failedCount} failed)...\n`);
      } catch (err) {
        console.error('Persistence error:', err);
      }
    }

    // Safe GSM rate pacing
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n========================================================================');
  console.log('🎉 RESILIENT CARRIER GSM SMS DISPATCH RUN FINISHED!');
  console.log(`• Newly Delivered Leads : ${deliveredCount}`);
  console.log(`• Total Delivered Today : ${confirmedPhones.size + deliveredCount} / 245`);
  console.log(`• Log Location          : ${SMS_LOG_PATH}`);
  console.log('========================================================================\n');
}

run245SmsCampaign().catch(console.error);
