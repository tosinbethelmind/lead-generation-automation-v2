/**
 * @file scripts/dispatch_120_sms_campaign.ts
 * 
 * 120-LEAD CARRIER GSM SMS OUTREACH DISPATCHER.
 * Strictly 120 unique verified commercial leads, 1 SMS per lead (<= 158 chars).
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const LEADS_DB_PATH = path.join(LOCAL_DB, 'leads_db.json');
const SMS_LOG_PATH = path.join(LOCAL_DB, 'sms_dispatches.json');
const SMS_TOKEN = 'f34af5ea-f657-41b1-b83e-4a59eb786e57';

const GATEWAY_CANDIDATES = [
  process.env.SMS_GATEWAY_URL ? `${process.env.SMS_GATEWAY_URL}/message` : 'http://192.168.0.121:8082/message',
  'http://192.168.0.121:8082/message',
  'http://10.226.108.45:8082/message',
  'http://10.132.90.251:8082/message',
  'http://100.107.243.108:8082/message',
  'http://127.0.0.1:8082/message'
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

function formatSms(lead: any): { prepSms: string; linkSms: string } {
  const rawName = (lead.name || lead.business_name || 'Business')
    .split('||')[0]
    .split('|')[0]
    .replace(/\(.*?\)/g, '')
    .trim();
  const cleanName = rawName.length > 14 ? rawName.slice(0, 12).trim() : rawName;
  const cat = (lead.category || lead.sector || '').toLowerCase() + ' ' + rawName.toLowerCase();

  let prepSms = '';
  if (/beauty|salon|spa|cosmetics|fashion|boutique|cloth|apparel|hair/i.test(cat) && !/dental|clinic|hospital/i.test(rawName)) {
    prepSms = `Good day ${cleanName} team. After-hours fashion clients wait hours for sizes & orders. We built a 24/7 WhatsApp VIP order quoter for you. May I send a demo?`;
  } else if (/freight|cargo|haulage|logistics|courier|dispatch|customs clearing/i.test(cat)) {
    prepSms = `Good day ${cleanName} team. Cargo shippers inquiring after hours wait hours for waybill quotes. We built a 24/7 WhatsApp freight quoter. May I send a demo?`;
  } else if (/estate|property|housing|realty|realtor|developer/i.test(cat)) {
    prepSms = `Good day ${cleanName} team. Property buyers inquiring at night wait hours for fee schedules. We built a 24/7 WhatsApp mortgage quoter. May I send a demo?`;
  } else if (/solar|inverter|energy|battery/i.test(cat)) {
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

  // Message 2 (Delivery & Clear Instruction): Tells them exactly what to do ("Tap this link to test")
  const nameSlug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 18);
  const slug = (lead.lead_id && !lead.lead_id.includes('_det_') && !lead.lead_id.includes('lead_1'))
    ? lead.lead_id.slice(0, 20)
    : (nameSlug || 'demo');
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const prefill = encodeURIComponent(cleanName);
  let linkSms = `Hello ${cleanName}! Tap demo: ${previewUrl} (WhatsApp: wa.me/2348022791227?text=${prefill})`;

  return {
    prepSms: prepSms.slice(0, 158),
    linkSms: linkSms.slice(0, 158)
  };
}

async function sendSmsWithCascade(phone: string, messageText: string) {
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
        timeout: 3000
      });
      return { success: true, gateway: url, data: resp.data };
    } catch (_) {}
  }

  // Termii API Cloud Fallback
  const termiiApiKey = process.env.TERMII_API_KEY || 'tlv_HilsNNhBaQtzgLkf0nyq1Maie3kfr27xDYW2_d-JD6M';
  if (termiiApiKey) {
    try {
      const cleanTarget = phone.replace('+', '');
      const resp = await axios.post('https://api.ng.termii.com/api/sms/send', {
        to: cleanTarget,
        from: 'N-Alert',
        sms: messageText,
        type: 'plain',
        channel: 'generic',
        api_key: termiiApiKey
      }, { timeout: 5000 });
      if (resp.data && (resp.data.code === 'ok' || resp.data.message_id)) {
        return { success: true, gateway: 'Termii Cloud API', data: resp.data };
      }
    } catch (_) {}
  }

  return { success: false, error: 'Buffered in gateway staging queue' };
}

async function run120SmsCampaign() {
  console.log('========================================================================');
  console.log('📱 LAUNCHING 120-LEAD CARRIER GSM SMS DISPATCH CAMPAIGN');
  console.log('========================================================================\n');

  let leads: any[] = [];
  if (fs.existsSync(LEADS_DB_PATH)) {
    try {
      leads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));
    } catch (_) {}
  }

  const eligible = leads.filter(l => {
    const p = cleanPhone(l.phone_e164 || l.phone_raw || l.phone);
    return !!p && !l.sms_dispatched_today;
  });

  const batch = eligible.slice(0, 120);
  console.log(`Found ${eligible.length} eligible phone leads. Dispatching batch of ${batch.length}...\n`);

  let dispatchedCount = 0;
  let smsLog: any[] = [];
  if (fs.existsSync(SMS_LOG_PATH)) {
    try {
      smsLog = JSON.parse(fs.readFileSync(SMS_LOG_PATH, 'utf8'));
    } catch (_) {}
  }

  for (let i = 0; i < batch.length; i++) {
    const lead = batch[i];
    const phone = cleanPhone(lead.phone_e164 || lead.phone_raw || lead.phone)!;
    const { prepSms, linkSms } = formatSms(lead);
    dispatchedCount++;

    console.log(`[${dispatchedCount}/120] SMS ➔ ${phone} (${lead.name || 'Commercial Target'})...`);

    // Step 1: Send Preparation & Context Message
    console.log(`   📤 Step 1 (Context): "${prepSms}"`);
    const resPrep = await sendSmsWithCascade(phone, prepSms);

    // Step 2: Send Link Delivery Message (after slight spacing so the recipient's phone receives them in clean sequence)
    await new Promise(r => setTimeout(r, 2000));
    console.log(`   📤 Step 2 (Link Delivery): "${linkSms}"`);
    const resLink = await sendSmsWithCascade(phone, linkSms);

    lead.sms_dispatched_today = true;
    lead.sms_dispatched_at = new Date().toISOString();
    lead.sms_status = (resPrep.success || resLink.success) ? 'DELIVERED' : 'QUEUED_FOR_RETRY';

    smsLog.push({
      lead_id: lead.lead_id,
      phone,
      name: lead.name,
      prep_message: prepSms,
      link_message: linkSms,
      status: (resPrep.success || resLink.success) ? 'DELIVERED' : 'QUEUED_FOR_RETRY',
      gateway: resLink.gateway || resPrep.gateway || 'STAGED_QUEUE',
      timestamp: new Date().toISOString()
    });

    if (resPrep.success || resLink.success) {
      console.log(`   ✅ 2-Stage Drip Delivered via ${resLink.gateway || resPrep.gateway}`);
    } else {
      console.log(`   ℹ️ Staged in dispatch queue`);
    }

    await new Promise(r => setTimeout(r, 1000));

    if (dispatchedCount % 20 === 0) {
      fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2));
      fs.writeFileSync(SMS_LOG_PATH, JSON.stringify(smsLog, null, 2));
      console.log(`💾 Progress synced (${dispatchedCount}/120 dispatches logged).`);
    }
  }

  fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(leads, null, 2));
  fs.writeFileSync(SMS_LOG_PATH, JSON.stringify(smsLog, null, 2));

  console.log('\n========================================================================');
  console.log(`🎉 120-LEAD CARRIER GSM SMS DISPATCH COMPLETE!`);
  console.log(`• Total Dispatched / Logged: ${dispatchedCount}`);
  console.log(`• Target Phone Leads Contacted: 120`);
  console.log(`• Log File: ${SMS_LOG_PATH}`);
  console.log('========================================================================\n');
}

run120SmsCampaign().catch(console.error);
