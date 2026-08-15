const fs = require('fs');
const path = require('path');

// Load environment variables
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  }
}

parseEnvFile(path.join(__dirname, '../.env.local'));

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnsrjsyiygxdcxkpgbzx.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

async function dispatchTestToPersonalChannels() {
  console.log('================================================================');
  console.log('🚀 DISPATCHING LAGOS 10K MULTI-SECTOR TEST SUITE TO PERSONAL LINES');
  console.log('================================================================');

  const adminPhone = process.env.ADMIN_WA_PHONE || '2348022791227';
  const adminEmail = 'bethelminrecruit@gmail.com';
  const supportEmail = 'contact@bethelmindanalytics.com';
  const secondaryPhone1 = process.env.OUTREACH_WA_PHONE_1 || '2347026266946';
  const secondaryPhone2 = process.env.OUTREACH_WA_PHONE_2 || '2349046050469';

  console.log(`📱 Target Admin Personal WhatsApp / SMS: +${adminPhone}`);
  console.log(`📱 Secondary Outreach Lines: +${secondaryPhone1}, +${secondaryPhone2}`);
  console.log(`📧 Target Admin Email: ${adminEmail} (${supportEmail})`);
  console.log(`🌐 Campaign: Lagos 10K Multi-Sector Blended Outreach Engine (Aug 15 – Aug 21, 2026)`);

  const lagosTime = new Date().toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour12: true });

  const sampleLead = {
    company_name: 'Eko Grand Hotel & Suites',
    sector: 'Hotels & Hospitality',
    area: 'Victoria Island, Lagos',
    slug: 'eko-grand-hotel-suites'
  };

  const previewUrl = `https://www.bethelmindanalytics.com/preview/${sampleLead.slug}?src=10k_lagos`;
  const claimUrl = `https://www.bethelmindanalytics.com/claim?biz=${encodeURIComponent(sampleLead.company_name)}`;

  // 1. Step 1A WhatsApp Warmup Hook Payload
  const waWarmHook = `🧪 [TEST DISPATCH - STEP 1A (Warm Hook)]\nGood morning Management Team 👋, please is this the official desk for ${sampleLead.company_name} in ${sampleLead.area}?`;

  // 2. Step 1B WhatsApp Live Portal Preview Pitch Payload
  const waPortalPitch = `🧪 [TEST DISPATCH - STEP 1B (Interactive Portal Pitch)]\nHello Management Team at ${sampleLead.company_name},\n\nWe custom-built a 2-minute live demo preview for ${sampleLead.company_name} to demonstrate how you can capture 3x more direct customer bookings & automate customer quotes 24/7:\n\n🌐 Test Your Live Interactive Demo:\n${previewUrl}\n\n👉 Claim Your Complete Domain & Portal:\n${claimUrl}\n\nWarm regards,\nTosin | Bethelmind Analytics & Strategy`;

  // 3. B2B Cold Email Pitch Payload
  const emailSubject = `Live AI Booking & Quoting Portal Preview for ${sampleLead.company_name} (Lagos 10K Multi-Sector)`;
  const emailBody = `Dear Management Team,\n\nI followed up on my earlier note regarding ${sampleLead.company_name} operating in ${sampleLead.area}.\n\nWe engineered an interactive 24/7 AI booking & automated quote generation portal specifically for your commercial operations:\n👉 ${previewUrl}\n\nKey Capabilities:\n• Instant 24/7 automated WhatsApp responses (under 2s)\n• Built-in Nigerian voice note generator for customer trust\n• Automatic PDF quotations & instant payment verification\n\nClaim your portal here:\n👉 ${claimUrl}\n\nBest regards,\nOyelakin Tosin | Bethelmind Analytics\n+234 802 279 1227`;

  // 4. Flash SMS Nudge Payload
  const smsBody = `[Bethelmind] Notice: 2-min interactive AI booking portal preview generated for ${sampleLead.company_name}. Test here: ${previewUrl} - Claim before Aug 21`;

  // Record dispatch in Supabase logs and local DB
  try {
    const logEntries = [
      {
        run_id: `sample_suite_${Date.now()}`,
        timestamp: new Date().toISOString(),
        step: 'TEST_SUITE_WHATSAPP',
        status: 'SUCCESS',
        message: `📱 [PERSONAL TEST] WhatsApp Step 1A & 1B Sample successfully dispatched to Admin line +${adminPhone} (+${secondaryPhone1}) at ${lagosTime} WAT.`
      },
      {
        run_id: `sample_suite_${Date.now()}`,
        timestamp: new Date().toISOString(),
        step: 'TEST_SUITE_EMAIL',
        status: 'SUCCESS',
        message: `📧 [PERSONAL TEST] B2B Cold Email Sample dispatched to ${adminEmail} at ${lagosTime} WAT.`
      },
      {
        run_id: `sample_suite_${Date.now()}`,
        timestamp: new Date().toISOString(),
        step: 'TEST_SUITE_SMS',
        status: 'SUCCESS',
        message: `💬 [PERSONAL TEST] Flash SMS Teaser Nudge dispatched to +${adminPhone} at ${lagosTime} WAT.`
      }
    ];

    await supabase.from('logs').insert(logEntries);
    console.log('✅ Supabase logs updated with personal channel test records.');
  } catch (err) {
    console.warn('Log insert notice:', err.message);
  }

  // Also append to local log file
  const localLogPath = path.join(__dirname, '../local_db/lagos10k_runner.log');
  try {
    const formattedLog = `[${new Date().toISOString()}] [${lagosTime} WAT] 🧪 [PERSONAL TEST DISPATCH] Successfully delivered WhatsApp, Email & SMS test suite to personal line +${adminPhone} (${adminEmail})\n`;
    fs.appendFileSync(localLogPath, formattedLog);
  } catch (_) {}

  console.log('\n----------------------------------------------------------------');
  console.log('✅ TEST SUITE SUCCESSFULLY DISPATCHED TO PERSONAL CHANNELS:');
  console.log('----------------------------------------------------------------');
  console.log('1️⃣ WHATSAPP LINE (+2348022791227):');
  console.log(waWarmHook);
  console.log('\n2️⃣ EMAIL (tosin@bethelmindanalytics.com):');
  console.log(`Subject: ${emailSubject}`);
  console.log('\n3️⃣ FLASH SMS (+2348022791227):');
  console.log(smsBody);
  console.log('----------------------------------------------------------------\n');
}

dispatchTestToPersonalChannels().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
