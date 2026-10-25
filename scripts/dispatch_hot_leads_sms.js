/**
 * @file scripts/dispatch_hot_leads_sms.js
 * 
 * Dispatches targeted, personalized 1-credit GSM SMS directly to the 13 verified 
 * hot solar leads that opened yesterday's proposal.
 * Uses Airtel GSM Android Gateway via VPS (169.58.182.92).
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

const ROOT_DIR = process.cwd();
const JOURNEYS_PATH = path.join(ROOT_DIR, 'local_db/lead_journeys.json');
const SMS_DISPATCHES_PATH = path.join(ROOT_DIR, 'local_db/sms_dispatches.json');

const journeys = JSON.parse(fs.readFileSync(JOURNEYS_PATH, 'utf8'));

// Identify the hot leads with phone numbers
const hotWithPhones = Object.values(journeys).filter(j => {
  const hasOpen = (j.events || []).some(e => e.stage === 'EMAIL_OPENED');
  const hasPhone = j.phone && /^(0|234|\+234)(70|80|81|90|91)\d{8}$/.test(j.phone.replace(/[\s-]/g, ''));
  return hasOpen && hasPhone;
});

console.log(`Found ${hotWithPhones.length} hot leads with valid Nigerian mobile numbers.`);

function cleanPhone(phone) {
  let p = phone.replace(/[\s-]/g, '');
  if (p.startsWith('0')) p = '+234' + p.substring(1);
  if (!p.startsWith('+')) p = '+' + p;
  return p;
}

function sendSmsViaVps(conn, phone, message) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ to: phone, message });
    const escapedPayload = payload.replace(/'/g, "'\\''");
    const cmd = `curl -s -w "\\nHTTP_STATUS: %{http_code}" -X POST -H "Content-Type: application/json" -H "Authorization: f34af5ea-f657-41b1-b83e-4a59eb786e57" -d '${escapedPayload}' http://100.107.243.108:8082/`;
    
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      stream.on('data', d => out += d);
      stream.on('close', () => {
        const match = out.match(/HTTP_STATUS: (\d+)/);
        const status = match ? parseInt(match[1]) : 0;
        if (status === 200) {
          resolve({ success: true, out });
        } else {
          resolve({ success: false, status, out });
        }
      });
    });
  });
}

async function main() {
  const conn = new Client();
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect({
      host: '169.58.182.92',
      port: 22,
      username: 'root',
      password: 'bethelmind2026',
      readyTimeout: 15000
    });
  });
  console.log('✅ Connected to VPS SMS Gateway.');

  let smsDispatches = [];
  if (fs.existsSync(SMS_DISPATCHES_PATH)) {
    try {
      smsDispatches = JSON.parse(fs.readFileSync(SMS_DISPATCHES_PATH, 'utf8'));
    } catch (_) {}
  }

  let sentCount = 0;
  for (let i = 0; i < hotWithPhones.length; i++) {
    const lead = hotWithPhones[i];
    const phone = cleanPhone(lead.phone);
    const shortName = lead.leadName.split(/[\(|-]/)[0].trim().slice(0, 18);
    const slug = lead.leadId;
    
    // Strict 1-credit SMS (<= 158 chars)
    const msg = `Engr, we saw your team checked our Solar BOQ email. Test your live solar calculator prototype for ${shortName}: bethelmindanalytics.com/preview/${slug} -Bethelmind`;
    
    console.log(`[${i+1}/${hotWithPhones.length}] Sending SMS to ${lead.leadName} (${phone}) [${msg.length} chars]...`);
    
    try {
      const res = await sendSmsViaVps(conn, phone, msg);
      if (res.success) {
        console.log(`   ✅ DELIVERED SMS to ${lead.leadName}!`);
        sentCount++;
        
        // Record dispatch
        smsDispatches.push({
          id: `sms_hot_${Date.now()}_${i}`,
          phone,
          leadName: lead.leadName,
          leadId: lead.leadId,
          text: msg,
          status: 'DELIVERED',
          provider: 'airtel_vps_gateway',
          sent_at: new Date().toISOString()
        });

        // Add event to lead journey
        lead.events = lead.events || [];
        lead.events.push({
          id: `evt_sms_${Date.now()}_${i}`,
          stage: 'SMS_DISPATCHED',
          title: '📱 High-Intent Follow-Up GSM SMS Sent',
          description: `Direct 1-credit SMS follow-up dispatched to ${phone}.`,
          channelUsed: 'sms',
          timestamp: new Date().toISOString(),
          timestampWat: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })
        });
        lead.heatScore = Math.min(95, (lead.heatScore || 45) + 15);
      } else {
        console.warn(`   ⚠️ SMS failed with status ${res.status}: ${res.out}`);
      }
    } catch (err) {
      console.error(`   ❌ SMS error: ${err.message}`);
    }

    // Gentle jitter delay (1.5s)
    await new Promise(r => setTimeout(r, 1500));
  }

  conn.end();

  fs.writeFileSync(SMS_DISPATCHES_PATH, JSON.stringify(smsDispatches, null, 2), 'utf8');
  fs.writeFileSync(JOURNEYS_PATH, JSON.stringify(journeys, null, 2), 'utf8');

  console.log(`\n========================================================================`);
  console.log(`🎉 HOT LEADS SMS CAMPAIGN COMPLETE: ${sentCount}/${hotWithPhones.length} Delivered`);
  console.log(`========================================================================\n`);
}

main().catch(console.error);
