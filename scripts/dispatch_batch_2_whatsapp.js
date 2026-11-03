/**
 * @file scripts/dispatch_batch_2_whatsapp.js
 * 
 * EXECUTES AUTOMATED WHATSAPP DISPATCH TO BATCH 2 (LEADS 6-10) VIA CONTABO VPS PORT 8080
 */

const fs = require('fs');
const path = require('path');

const CAMPAIGN_FILE = path.join(__dirname, '..', 'local_db', 'secret_shopper_campaign_20.json');
const LOG_FILE = path.join(__dirname, '..', 'local_db', 'whatsapp_daily_outreach_log.json');

const VPS_SEND_URL = 'http://169.58.182.92:8080/send';
const API_KEY = 'evolution_bethelmind_secret_2026';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dispatchBatch2() {
  if (!fs.existsSync(CAMPAIGN_FILE)) {
    console.error('Campaign file not found:', CAMPAIGN_FILE);
    return;
  }

  const campaign = JSON.parse(fs.readFileSync(CAMPAIGN_FILE, 'utf8'));
  const batch2 = campaign.leads.slice(5, 10);

  console.log('=================================================================');
  console.log(`[WHATSAPP BATCH 2 DISPATCH] Firing to ${batch2.length} verified Lagos leads via VPS...`);
  console.log('=================================================================\n');

  let results = [];

  for (let i = 0; i < batch2.length; i++) {
    const lead = batch2[i];
    console.log(`[${i + 1}/${batch2.length}] Sending to ${lead.businessName} (${lead.phoneDisplay} / +${lead.phoneE164})...`);

    const payload = {
      phone: lead.phoneE164,
      message: lead.whatsappPitchText,
      isColdOutreach: false,
      lineId: 1
    };

    try {
      const response = await fetch(VPS_SEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': API_KEY
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success || data.messageId) {
        console.log(`  ✓ DELIVERED! Message ID: ${data.messageId || 'SENT'} (Line: ${data.line || 1})`);
        results.push({
          leadId: lead.id,
          businessName: lead.businessName,
          phone: lead.phoneDisplay,
          phoneE164: lead.phoneE164,
          status: 'DELIVERED',
          messageId: data.messageId,
          timestamp: new Date().toISOString()
        });
      } else {
        console.warn(`  ⚠️ Dispatch notice for ${lead.businessName}:`, data.error || data.message || JSON.stringify(data));
        results.push({
          leadId: lead.id,
          businessName: lead.businessName,
          phone: lead.phoneDisplay,
          phoneE164: lead.phoneE164,
          status: 'FAILED',
          error: data.error || data.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error(`  ❌ Network error sending to ${lead.businessName}:`, err.message);
      results.push({
        leadId: lead.id,
        businessName: lead.businessName,
        phone: lead.phoneDisplay,
        status: 'NETWORK_ERROR',
        error: err.message,
        timestamp: new Date().toISOString()
      });
    }

    if (i < batch2.length - 1) {
      const jitterMs = 3500 + Math.floor(Math.random() * 2000);
      console.log(`  ⏳ Pausing ${Math.round(jitterMs / 1000)}s before next message for anti-ban rate limiting...`);
      await sleep(jitterMs);
    }
  }

  // Persist to log file
  try {
    let existingLogs = {
      date: new Date().toISOString().split('T')[0],
      totalSentToday: 0,
      sentNumbers: []
    };
    if (fs.existsSync(LOG_FILE)) {
      try {
        existingLogs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
      } catch {}
    }
    existingLogs.totalSentToday = (existingLogs.totalSentToday || 0) + results.filter(r => r.status === 'DELIVERED').length;
    if (!Array.isArray(existingLogs.sentNumbers)) existingLogs.sentNumbers = [];
    results.filter(r => r.status === 'DELIVERED').forEach(r => {
      if (!existingLogs.sentNumbers.includes(r.phoneE164)) existingLogs.sentNumbers.push(r.phoneE164);
    });
    fs.writeFileSync(LOG_FILE, JSON.stringify(existingLogs, null, 2), 'utf8');
  } catch (logErr) {
    console.error('Failed to update log file:', logErr.message);
  }

  console.log('\n=================================================================');
  console.log(`✓ BATCH 2 DISPATCH COMPLETE: ${results.filter(r => r.status === 'DELIVERED').length}/${batch2.length} delivered.`);
  console.log('=================================================================');
}

dispatchBatch2().catch(console.error);
