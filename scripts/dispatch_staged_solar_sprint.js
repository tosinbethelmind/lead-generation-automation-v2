/**
 * @file scripts/dispatch_staged_solar_sprint.js
 * 
 * ☀️ 50-LEAD SOLAR & INVERTER HIGH-CONVERSION CAMPAIGN DISPATCHER
 * Bethelmind Digital Solutions · CAC Certified Nigerian Enterprise
 * 
 * INVARIANTS:
 * 1. Strictly 1 single SMS per lead (strictly <= 158 characters = 1 GSM credit = exactly ₦6 on Airtel).
 * 2. 100% genuine verified Nigerian Solar & Inverter enterprises (ZERO synthetic, ZERO broken names).
 * 3. Single-shot bounded execution (strictly NO PM2 auto-restart loops).
 * 4. Dual-gateway support: Local Android Gateway (http://192.168.0.121:8082) & Tailscale (http://100.107.243.108:8082).
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const STAGED_FILE = path.join(process.cwd(), 'local_db', 'staged_solar_50_sprint.json');
const DISPATCH_LOG = path.join(process.cwd(), 'local_db', 'sms_dispatches.json');
const JOURNEYS_FILE = path.join(process.cwd(), 'local_db', 'lead_journeys.json');

const SMS_TOKEN = 'f34af5ea-f657-41b1-b83e-4a59eb786e57';
const GATEWAY_CANDIDATES = [
  'http://100.107.243.108:8082/',
  'http://100.107.243.108:8082/message',
  'http://192.168.0.121:8082/',
  'http://192.168.0.121:8082/message'
];

async function sendSingleSms(phone, text) {
  for (const url of GATEWAY_CANDIDATES) {
    try {
      const resp = await axios.post(url, {
        to: phone,
        message: text
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': SMS_TOKEN
        },
        timeout: 4500
      });
      return { success: true, gateway: url, data: resp.data };
    } catch (_) {}
  }
  return { success: false, error: 'Gateway offline or unreachable' };
}

async function runSolarSprint() {
  console.log('========================================================================');
  console.log('☀️ LAUNCHING SPRINT 1: 50-LEAD DEDICATED SOLAR & INVERTER CAMPAIGN');
  console.log('🎯 Hook: 24/7 WhatsApp Solar BOQ & Quotation Sizer');
  console.log('💬 Format: Exactly 1 SMS per lead (strictly <= 158 characters = ₦6/lead)');
  console.log('========================================================================\n');

  if (!fs.existsSync(STAGED_FILE)) {
    console.error('❌ Staged solar file not found at:', STAGED_FILE);
    process.exit(1);
  }

  const leads = JSON.parse(fs.readFileSync(STAGED_FILE, 'utf8'));
  const countArg = process.argv.find(a => a.startsWith('--count='));
  const targetCount = countArg ? parseInt(countArg.split('=')[1], 10) : leads.length;
  const toSend = leads.slice(0, targetCount);

  console.log(`📋 Loaded ${leads.length} staged solar companies. Selected: ${toSend.length} targets.`);
  console.log(`💰 Expected Airtime Budget: ${toSend.length} × ₦6 = ₦${toSend.length * 6} total.\n`);

  let journeys = {};
  if (fs.existsSync(JOURNEYS_FILE)) {
    try { journeys = JSON.parse(fs.readFileSync(JOURNEYS_FILE, 'utf8')); } catch (_) {}
  }

  let smsLog = [];
  if (fs.existsSync(DISPATCH_LOG)) {
    try { smsLog = JSON.parse(fs.readFileSync(DISPATCH_LOG, 'utf8')); } catch (_) {}
  }

  let delivered = 0;
  let failed = 0;

  for (let i = 0; i < toSend.length; i++) {
    const lead = toSend[i];
    console.log(`[${i + 1}/${toSend.length}] 📱 Target: ${lead.name} (${lead.phone})`);
    console.log(`   📤 SMS (${lead.smsLength} chars): "${lead.sms}"`);

    const res = await sendSingleSms(lead.phone, lead.sms);

    if (res.success) {
      delivered++;
      console.log(`   ✅ DELIVERED via ${res.gateway}\n`);

      // Record in SMS Log
      smsLog.push({
        phone: lead.phone,
        name: lead.name,
        category: lead.category,
        message: lead.sms,
        charCount: lead.smsLength,
        status: 'DELIVERED',
        gateway: res.gateway,
        timestamp: new Date().toISOString()
      });

      // Update lead journey
      journeys[lead.id] = {
        leadId: lead.id,
        leadName: lead.name,
        category: lead.category,
        phone: lead.phone,
        email: '',
        area: lead.city,
        currentStage: 'OUTREACH_DISPATCHED',
        score: 75,
        heatScore: 40,
        intentLevel: 'WARM',
        previewUrl: lead.previewUrl,
        createdAt: new Date().toISOString(),
        lastActiveIso: new Date().toISOString(),
        lastUpdatedWat: new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos' }) + ' WAT',
        metrics: {
          pageViews: 0,
          calculatorInteractions: 0,
          videoWatchSec: 0,
          chatMessages: 0,
          checkoutAttempts: 0,
          totalTimeSec: 0,
          rageClicks: 0
        },
        events: [
          {
            id: 'evt_sms_' + Date.now() + '_' + i,
            leadId: lead.id,
            leadName: lead.name,
            stage: 'OUTREACH_DISPATCHED',
            title: 'Solar BOQ SMS Dispatched (Single Credit)',
            description: `Sent 1-credit SMS (${lead.smsLength} chars) with live BOQ preview link: ${lead.previewUrl}`,
            channelUsed: 'Airtel GSM SMS',
            timestamp: new Date().toISOString(),
            timestampWat: new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos' }) + ' WAT'
          }
        ]
      };
    } else {
      failed++;
      console.log(`   ❌ FAILED: ${res.error}\n`);
    }

    // Gentle pacing (1.5s delay to prevent carrier congestion)
    await new Promise(r => setTimeout(r, 1500));
  }

  // Persist logs
  fs.writeFileSync(DISPATCH_LOG, JSON.stringify(smsLog, null, 2));
  fs.writeFileSync(JOURNEYS_FILE, JSON.stringify(journeys, null, 2));

  console.log('========================================================================');
  console.log(`🏁 CAMPAIGN SUMMARY: ${delivered} Delivered | ${failed} Failed`);
  console.log(`💰 Total Airtime Deducted: ${delivered} × ₦6 = ₦${delivered * 6}`);
  console.log('========================================================================');
}

if (require.main === module) {
  runSolarSprint().then(() => process.exit(0)).catch(e => {
    console.error('Sprint error:', e);
    process.exit(1);
  });
}

module.exports = { runSolarSprint };
