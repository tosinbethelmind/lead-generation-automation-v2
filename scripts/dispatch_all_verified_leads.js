/**
 * @file scripts/dispatch_all_verified_leads.js
 * Multi-Line WhatsApp & Termii SMS Production Lead Dispatcher.
 * Rotates across 3 linked WhatsApp lines + Termii SMS to message all verified leads.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pnsrjsyiygxdcxkpgbzx.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

const TERMII_KEY = 'tlv_HilsNNhBaQtzgLkf0nyq1Maie3kfr27xDYW2_d-JD6M';
const TERMII_SENDER_ID = 'N-Alert';
const WA_GATEWAY_URL = 'http://localhost:5005/api/send';

function generateCustomMessage(lead) {
  const companyName = (lead.name || 'Partner').trim();
  const category = (lead.category || 'Business Services').replace(/^Lagos\s+/i, '');
  const city = lead.city || lead.area || 'Lagos';

  return `Hello Team ${companyName},

We operate SolarQuotePro.ng & Bethelmind Lead Network, Nigeria's B2B marketplace connecting verified ${category} providers with commercial & residential clients across ${city} and major hubs.

We noticed your verified business listing in ${city} and would love to route high-intent customer inquiries directly to your team.

Would you be open to receiving customer inquiries this week?

Best regards,
Tosin | CEO, Bethelmind Analytics & Strategy
WhatsApp/Call: +234 802 279 1227`;
}

async function sendWhatsApp(phone, message) {
  try {
    const res = await fetch(WA_GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message }),
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    return data;
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function sendTermiiSms(phone, message) {
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const formatted = cleanPhone.startsWith('0') ? '234' + cleanPhone.substring(1) : cleanPhone;
    
    const payload = {
      to: formatted,
      from: TERMII_SENDER_ID,
      sms: message,
      type: 'plain',
      channel: 'generic',
      api_key: TERMII_KEY
    };

    const res = await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });
    const data = await res.json();
    return { success: !!(data.message_id || data.code === 'ok'), data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function startMasterLeadDispatch() {
  console.log(`\n==================================================`);
  console.log(`🚀 STARTING PRODUCTION 3-LINE WHATSAPP & SMS DISPATCH`);
  console.log(`==================================================\n`);

  let offset = 0;
  const limit = 200;
  let totalDispatched = 0;
  let waSuccessCount = 0;
  let smsSuccessCount = 0;

  while (true) {
    console.log(`📥 Fetching lead batch ${offset + 1} to ${offset + limit}...`);
    const { data: leads, error } = await supabase
      .from('leads')
      .select('lead_id, name, category, city, area, phone_e164, phone_raw, email, status')
      .or('status.eq.NEW,status.is.null')
      .neq('phone_e164', '')
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('❌ Supabase Fetch Error:', error.message);
      break;
    }

    if (!leads || leads.length === 0) {
      console.log('✅ All pending leads in batch processed!');
      break;
    }

    for (const lead of leads) {
      const phone = lead.phone_e164 || lead.phone_raw;
      if (!phone) continue;

      const message = generateCustomMessage(lead);
      console.log(`\n📲 Outreaching lead: "${lead.name}" (+${phone})...`);

      // Channel 1: WhatsApp 3-Line Round-Robin Dispatch
      const waRes = await sendWhatsApp(phone, message);
      if (waRes.success) {
        waSuccessCount++;
        console.log(`   ✅ WhatsApp Dispatch SUCCESS via Line ${waRes.lineId} (Msg ID: ${waRes.messageId})`);
      } else {
        console.log(`   ⚠️ WhatsApp Dispatch skipped/failed: ${waRes.error}`);
      }

      // Channel 2: Termii SMS Gateway Direct Dispatch
      const smsRes = await sendTermiiSms(phone, message);
      if (smsRes.success) {
        smsSuccessCount++;
        console.log(`   ✅ Termii SMS Dispatch SUCCESS to +${phone} (Sender: ${TERMII_SENDER_ID})`);
      } else {
        console.log(`   ⚠️ Termii SMS Dispatch skipped/failed: ${smsRes.error || 'Gateway response error'}`);
      }

      if (waRes.success || smsRes.success) {
        totalDispatched++;
        await supabase
          .from('leads')
          .update({
            status: 'CONTACTED',
            last_contacted_at: new Date().toISOString(),
            notes: `Dual-Channel Outreached (WA Line ${waRes.lineId || 'N/A'}, Termii SMS: ${smsRes.success ? 'SENT' : 'FAIL'})`
          })
          .eq('lead_id', lead.lead_id);
      }

      // Randomized delay (4-7 seconds) to maintain 100% phone line health & anti-spam compliance
      const delayMs = Math.floor(Math.random() * 3000) + 4000;
      await new Promise(r => setTimeout(r, delayMs));
    }

    offset += limit;
  }

  console.log(`\n==================================================`);
  console.log(`🎉 PRODUCTION DISPATCH CYCLE COMPLETE!`);
  console.log(`   ├─ Total Leads Contacted: ${totalDispatched}`);
  console.log(`   ├─ WhatsApp Dispatches:   ${waSuccessCount}`);
  console.log(`   └─ Termii SMS Dispatches:  ${smsSuccessCount}`);
  console.log(`==================================================\n`);
}

startMasterLeadDispatch().catch(console.error);
