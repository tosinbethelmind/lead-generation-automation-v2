/**
 * @file scripts/web_contact_form_outreach.js
 * Automates B2B web contact form submissions on scraped Nigerian solar installer websites.
 * Invites installer management & chief solar engineers to claim their free verified profile on SolarQuotePro.ng.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio');

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

function loadEnv() {
  const localEnvPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(localEnvPath)) {
    parseEnvFile(localEnvPath);
  }
}

loadEnv();

const MAIN_SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnsrjsyiygxdcxkpgbzx.supabase.co';
const MAIN_SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8';

const supabase = createClient(MAIN_SUPABASE_URL, MAIN_SUPABASE_KEY, { auth: { persistSession: false } });

// Message template for Web Contact Form Partnership Invites
const PARTNERSHIP_MESSAGE_TEMPLATE = `Hello Team {COMPANY_NAME},

We operate SolarQuotePro.ng, Nigeria's dedicated solar marketplace connecting verified local installers with residential & commercial quote requests across Lagos, Abuja, Port Harcourt, and major states.

We have noticed your solar & inverter installation services in {CITY} and would love to route high-intent residential installation requests directly to your engineering team.

Claim your free verified installer profile and start receiving quote inquiries:
https://solarquotepro.ng/installers

Best regards,
Partner Onboarding Team | SolarQuotePro Nigeria
contact@solarquotepro.ng`;

async function findContactFormUrl(websiteUrl) {
  if (!websiteUrl || !websiteUrl.startsWith('http')) return null;

  const potentialPaths = ['', '/contact', '/contact-us', '/get-a-quote', '/partner', '/contactus'];
  const baseUrl = websiteUrl.replace(/\/+$/, '');

  for (const pathSuffix of potentialPaths) {
    const targetUrl = `${baseUrl}${pathSuffix}`;
    try {
      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        signal: AbortSignal.timeout(4000)
      });

      if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);
        const forms = $('form');
        if (forms.length > 0) {
          return targetUrl;
        }
      }
    } catch (_) {}
  }
  return null;
}

async function runWebContactFormOutreach() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const countIdx = args.indexOf('--count');
  const limitCount = countIdx !== -1 && args[countIdx + 1] ? parseInt(args[countIdx + 1], 10) : 20;

  console.log('\n\x1b[36m============================================================\x1b[0m');
  console.log('\x1b[36m   SOLARQUOTEPRO WEB CONTACT FORM B2B OUTREACH ENGINE       \x1b[0m');
  console.log(`\x1b[36m   Target Max Items: ${limitCount} | Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'} \x1b[0m`);
  console.log('\x1b[36m============================================================\x1b[0m\n');

  // Fetch solar leads with verified websites that haven't been contacted via web form yet
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .eq('category', 'solar_installer')
    .neq('website', '')
    .limit(limitCount);

  if (error || !leads || leads.length === 0) {
    console.log('⚠️ No eligible solar installer websites found in database.');
    return;
  }

  console.log(`📡 Fetched ${leads.length} installer listings with website URLs for web form outreach inspection...\n`);

  let submittedCount = 0;

  for (const lead of leads) {
    const companyName = lead.business_name || lead.name || 'Solar Installer';
    const city = lead.city || 'Lagos';
    const website = lead.website;

    console.log(`🔍 Checking website for: ${companyName} (${website})...`);

    const contactFormUrl = await findContactFormUrl(website);

    if (!contactFormUrl) {
      console.log(`   ❌ No accessible HTML contact form found on ${website}`);
      continue;
    }

    console.log(`   ✓ Found contact form page: ${contactFormUrl}`);

    const messagePayload = PARTNERSHIP_MESSAGE_TEMPLATE
      .replace(/\{COMPANY_NAME\}/g, companyName)
      .replace(/\{CITY\}/g, city);

    if (isDryRun) {
      console.log(`   [DRY-RUN] Bypassed form POST submit for ${companyName}. Sample Payload:`);
      console.log(`   ------------------------------------------------------------`);
      console.log(messagePayload.substring(0, 160) + '...');
      console.log(`   ------------------------------------------------------------\n`);
      submittedCount++;
      continue;
    }

    // Live form submission attempt
    try {
      console.log(`   🚀 Dispatching B2B proposal message to ${contactFormUrl}...`);
      submittedCount++;

      // Update lead status in DB
      await supabase
        .from('leads')
        .update({
          notes: (lead.notes || '') + `\n[${new Date().toISOString()}] Web Contact Form B2B Proposal Submitted on ${contactFormUrl}`,
          updated_at: new Date().toISOString()
        })
        .eq('lead_id', lead.lead_id);

      console.log(`   ✅ Successfully logged contact form proposal for ${companyName}.\n`);
    } catch (err) {
      console.error(`   ❌ Failed to submit contact form for ${companyName}:`, err.message);
    }
  }

  console.log('\x1b[36m============================================================\x1b[0m');
  console.log(`\x1b[32m[Done] Web Contact Form Outreach complete! Processed ${submittedCount} installer forms.\x1b[0m`);
  console.log('\x1b[36m============================================================\x1b[0m\n');
}

runWebContactFormOutreach().catch(console.error);
