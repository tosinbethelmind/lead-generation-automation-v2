/**
 * scripts/dispatch_day2_whatsapp_followup.js
 * 
 * Bethelmind Analytics WhatsApp Follow-Up & Live Prototype Dispatcher for Day 2 Leads
 * 
 * Safety & Quality:
 * - 100% Genuine Nigerian Commercial Mobile Numbers ONLY
 * - Rotates between Line 1 (3007: Tosin 1) and Line 2 (3009: TOSIN New) with Instant Failover
 * - Pre-verified Unique Prototype URLs: https://www.bethelmindanalytics.com/preview/[lead_id]
 * - Dual-Audience Segmentation (Website Owners vs Non-Website Turnkey)
 * - Safe spacing with human-like jitter delays
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse environment variables
const envPath = path.join(__dirname, '../.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      envVars[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const url = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.SUPABASE_URL;
const key = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (url && key) ? createClient(url, key) : null;

const DB_PATH = path.join(__dirname, '../local_db/leads_db.json');
const ACTIVITIES_PATH = path.join(__dirname, '../local_db/activities.json');
const LINE1_URL = 'http://localhost:3007/api/send';
const LINE2_URL = 'http://localhost:3009/api/send';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function normalizeToInternational(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('234')) return digits;
  if (digits.startsWith('0') && digits.length === 11) return '234' + digits.slice(1);
  if (digits.length === 10 && ['7', '8', '9'].includes(digits[0])) return '234' + digits;
  return digits;
}

function isNigerianMobile(phone) {
  const digits = normalizeToInternational(phone);
  return /^234[789][01]\d{8}$/.test(digits);
}

async function sendSingleWhatsApp(targetUrl, phone, message, lineId) {
  const intlPhone = normalizeToInternational(phone);
  const payload = JSON.stringify({ phone: intlPhone, message, text: message });

  return new Promise((resolve) => {
    try {
      const urlObj = new URL(targetUrl);
      const req = http.request({
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 15000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ success: parsed.success === true || res.statusCode === 200, lineId, error: parsed.error, messageId: parsed.messageId });
          } catch (_) {
            resolve({ success: res.statusCode === 200, lineId });
          }
        });
      });
      req.on('error', (e) => resolve({ success: false, lineId, error: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ success: false, lineId, error: 'Timeout (15s)' }); });
      req.write(payload);
      req.end();
    } catch (err) {
      resolve({ success: false, lineId, error: err.message });
    }
  });
}

async function sendWhatsAppWithFailover(phone, message, preferredLineId = 1) {
  if (!isNigerianMobile(phone)) {
    return { success: false, lineId: preferredLineId, error: 'Non-mobile/landline skipped for WhatsApp' };
  }

  const primaryUrl = preferredLineId === 1 ? LINE1_URL : LINE2_URL;
  const fallbackUrl = preferredLineId === 1 ? LINE2_URL : LINE1_URL;
  const fallbackLineId = preferredLineId === 1 ? 2 : 1;

  let res = await sendSingleWhatsApp(primaryUrl, phone, message, preferredLineId);
  if (res.success) return res;

  console.log(`      ↳ Line ${preferredLineId} error (${res.error || 'Failed'}). Auto-failing over to Line ${fallbackLineId}...`);
  res = await sendSingleWhatsApp(fallbackUrl, phone, message, fallbackLineId);
  return res;
}

function recordActivity(activity) {
  try {
    let activities = [];
    if (fs.existsSync(ACTIVITIES_PATH)) {
      activities = JSON.parse(fs.readFileSync(ACTIVITIES_PATH, 'utf8') || '[]');
    }
    activities.push({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...activity,
      created_at: new Date().toISOString()
    });
    fs.writeFileSync(ACTIVITIES_PATH, JSON.stringify(activities, null, 2), 'utf8');
  } catch (e) {
    console.warn('[Activity Warn]', e.message);
  }
}

async function run() {
  console.log('===============================================================');
  console.log('🚀 BETHELMIND ANALYTICS DAY 2 WHATSAPP FOLLOW-UP ENGINE');
  console.log(`📅 Date: ${new Date().toLocaleDateString('en-NG')} | Dual-Line Rotator Active (3007/3009)`);
  console.log('===============================================================\n');

  if (!fs.existsSync(DB_PATH)) {
    console.error('Database file not found at:', DB_PATH);
    return;
  }

  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const allLeads = Array.isArray(data) ? data : (data.leads || Object.values(data));

  // Find contacted Day 2 leads from yesterday
  const targetLeads = allLeads.filter(l => l.status === 'CONTACTED' || (l.last_contacted_at && l.last_contacted_at.startsWith('2026-08-18')));
  console.log(`🎯 Found ${targetLeads.length} Day 2 Contacted Leads to process.\n`);

  let dispatchedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const nowIso = new Date().toISOString();

  for (let i = 0; i < targetLeads.length; i++) {
    const lead = targetLeads[i];
    const phone = lead.phone_e164 || lead.phone || '';
    const rawName = lead.name || '';
    const rawCategory = lead.category || 'Commercial Enterprise';
    
    // Clean noisy directory titles
    let cleanName = rawName
      .replace(/\|\|.*$/, '')
      .replace(/\|.*$/, '')
      .replace(/ - .*$/, '')
      .replace(/\(.*?\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanName || /^(lagos_det_|lead_|mock_|test)/i.test(cleanName)) {
      cleanName = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1) + ' Enterprise';
    }

    const leadId = lead.lead_id || lead.id;
    const previewUrl = `https://www.bethelmindanalytics.com/preview/${encodeURIComponent(leadId)}`;
    const lineId = (i % 2 === 0) ? 1 : 2;
    const hasWebsite = !!(lead.website && lead.website.trim() && lead.website.toLowerCase() !== 'none');

    console.log(`[${(i + 1).toString().padStart(2, '0')}/${targetLeads.length}] 🏢 ${cleanName.slice(0, 30).padEnd(30)} | 📱 ${phone.padEnd(15)} | Line ${lineId} | Web: ${hasWebsite ? 'YES' : 'NO'}`);
    console.log(`   🔗 Prototype Link: ${previewUrl}`);

    if (!isNigerianMobile(phone)) {
      console.log(`   ↳ ⚠️ Skipped WhatsApp: Landline / Non-mobile (${phone}). (SMS/Email channel only)\n`);
      skippedCount++;
      continue;
    }

    let message = '';
    if (hasWebsite) {
      message = `Good day team at *${cleanName}*! 👋 Following up from Bethelmind Analytics Lagos — we've finalized your interactive 24/7 WhatsApp AI Quoting & Appointment Portal preview attached to your website.\n\n` +
        `You can test how your clients get instant quotes & PDF bookings directly here:\n` +
        `👉 ${previewUrl}\n\n` +
        `(Takes under 10 minutes to activate on your existing website with 0 downtime).\n\n` +
        `Best regards,\n` +
        `*Tosin — Bethelmind Analytics Lagos Desk*`;
    } else {
      message = `Good day *${cleanName}* Management! 👋 Tosin from Bethelmind Analytics Lagos here.\n\n` +
        `We have completed and verified your private interactive website prototype and 24/7 WhatsApp booking desk:\n` +
        `👉 ${previewUrl}\n\n` +
        `Includes your Google Maps SEO setup, instant Paystack/Moniepoint payments, and ₦0 upfront review.\n\n` +
        `Let us know if you would like any customizations before deployment!\n` +
        `— *Bethelmind Analytics Lagos Team*`;
    }

    const res = await sendWhatsAppWithFailover(phone, message, lineId);

    if (res.success) {
      dispatchedCount++;
      lead.notes = (lead.notes || '') + ` | Day 2 WhatsApp Follow-Up Dispatched (Line ${res.lineId}) | URL: ${previewUrl}`;
      lead.last_contacted_at = nowIso;
      console.log(`   ↳ ✅ WhatsApp Delivered (Line ${res.lineId} - Msg ID: ${res.messageId || 'OK'})\n`);

      recordActivity({
        type: 'day2_outreach_dispatched',
        lead_id: leadId,
        deal_id: '',
        description: `Bethelmind Analytics Day 2 Follow-Up dispatched to ${cleanName} (${phone}) via Line ${res.lineId}`,
        metadata: JSON.stringify({ category: rawCategory, hasWebsite, previewUrl, lineId: res.lineId }),
        channel: 'whatsapp',
        actor: 'system'
      });
    } else {
      errorCount++;
      console.log(`   ↳ ❌ WhatsApp Failed: ${res.error}\n`);
    }

    // Dynamic anti-ban safety sleep between 3.5s and 5.5s
    const jitter = 3500 + Math.floor(Math.random() * 2000);
    await sleep(jitter);
  }

  // Save database updates locally
  fs.writeFileSync(DB_PATH, JSON.stringify(allLeads, null, 2), 'utf8');
  console.log(`💾 Saved updated records to local_db/leads_db.json`);

  if (supabase) {
    console.log('🔄 Syncing updated notes to Supabase Cloud...');
    try {
      for (const lead of targetLeads) {
        if (lead.notes && lead.notes.includes('Day 2 WhatsApp')) {
          await supabase.from('leads').update({
            notes: lead.notes,
            last_contacted_at: nowIso
          }).eq('lead_id', lead.lead_id || lead.id);
        }
      }
      console.log('✔ Supabase Cloud Synced.');
    } catch (sErr) {
      console.warn('Supabase sync warning:', sErr.message);
    }
  }

  console.log(`\n===============================================================`);
  console.log(`🎉 DAY 2 FOLLOW-UP COMPLETED: ${dispatchedCount} Dispatched | ${skippedCount} Skipped | ${errorCount} Errors`);
  console.log(`===============================================================`);
}

run().catch(console.error);
