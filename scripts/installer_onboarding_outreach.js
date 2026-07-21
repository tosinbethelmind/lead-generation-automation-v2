/**
 * @file installer_onboarding_outreach.js
 * Automates NDPA-compliant B2B solar installer onboarding outreach.
 * Reads leads from the database, filters for new solar-related installers,
 * and dispatches personalized invitations with opt-out mechanisms.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local to avoid needing dotenv package
function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index !== -1) {
        const key = trimmed.substring(0, index).trim();
        let val = trimmed.substring(index + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    });
  }
}

loadEnvLocal();

// Simple helper to load local leads JSON if DB fallback is active
function readLocalLeads() {
  const filePath = path.join(__dirname, '..', 'local_db', 'leads_db.json');
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (_) {}
  }
  return [];
}

function writeLocalLeads(leads) {
  const filePath = path.join(__dirname, '..', 'local_db', 'leads_db.json');
  fs.writeFileSync(filePath, JSON.stringify(leads, null, 2));
}

// Spintax parser logic
function parseSpintax(text) {
  const placeholders = [];
  const placeholderPattern = /\{\{[^{}]+\}\}/g;
  
  let processedText = text.replace(placeholderPattern, (match) => {
    placeholders.push(match);
    return `__SPINTAX_PLACEHOLDER_${placeholders.length - 1}__`;
  });

  const spintaxPattern = /\{([^{}]+)\}/g;
  let matches = processedText.match(spintaxPattern);
  
  while (matches && matches.length > 0) {
    for (const match of matches) {
      const options = match.slice(1, -1).split('|');
      const chosen = options[Math.floor(Math.random() * options.length)];
      processedText = processedText.replace(match, chosen);
    }
    matches = processedText.match(spintaxPattern);
  }

  for (let i = 0; i < placeholders.length; i++) {
    processedText = processedText.replace(`__SPINTAX_PLACEHOLDER_${i}__`, placeholders[i]);
  }

  return processedText;
}

// Spintax message template matching the Legitimate Interest basis
const MESSAGE_TEMPLATE = `{Hi|Hello} {{name}},

We noticed your solar/inverter listing on {{source}} in {{city}}. We operate SolarQuotePro.ng, a leading platform connecting high-intent B2C homeowners with vetted local installers. We would love to onboard your business to receive residential installation leads.

Learn more & sign up here: https://lead-generation-automation-e0oitxcsi.vercel.app/signup

Best,
The SolarQuotePro Team
(If you do not wish to receive further messages, reply STOP)`;

async function runOnboarding() {
  console.log('\n\x1b[36m============================================================\x1b[0m');
  console.log('\x1b[36m   SOLARQUOTEPRO B2B INSTALLER ONBOARDING OUTREACH           \x1b[0m');
  console.log('\x1b[36m============================================================\x1b[0m\n');

  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');

  if (isDryRun) {
    console.log('\x1b[33m[Mode] DRY-RUN enabled. No messages will be dispatched.\x1b[0m\n');
  }

  // Load config.json
  const configPath = path.join(__dirname, '..', 'config.json');
  if (!fs.existsSync(configPath)) {
    console.error('\x1b[31m[Error] config.json not found in project root.\x1b[0m');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log(`[Config] Storage Mode: ${config.storageMode}`);
  console.log(`[Config] WhatsApp Provider: ${config.whatsappProvider || 'cloud'}`);

  let leads = [];
  let dncList = [];

  // Fetch leads and DNC based on storage mode
  if (config.storageMode === 'cloud' || config.storageMode === 'supabase') {
    const supabaseUrl = config.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = config.supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('\x1b[31m[Error] Supabase credentials not found in config or env.\x1b[0m');
      process.exit(1);
    }

    console.log('[Database] Connecting to Supabase...');
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
    
    // Fetch leads where status = NEW
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('status', 'NEW');

    if (leadError) {
      console.error('\x1b[31m[Error] Failed to fetch leads from Supabase:\x1b[0m', leadError.message);
      process.exit(1);
    }
    leads = leadData || [];

    // Fetch DNC list
    const { data: dncData, error: dncError } = await supabase
      .from('dnc')
      .select('phone_e164');
    
    if (!dncError && dncData) {
      dncList = dncData.map(d => d.phone_e164);
    }
  } else {
    console.log('[Database] Loading local JSON database...');
    leads = readLocalLeads();
    
    // Load local DNC list if exists
    const dncPath = path.join(__dirname, '..', 'local_db', 'dnc_db.json');
    if (fs.existsSync(dncPath)) {
      try {
        dncList = JSON.parse(fs.readFileSync(dncPath, 'utf8')).map(d => d.phone_e164);
      } catch (_) {}
    }
  }

  // Filter leads: Must be new, have a phone number, and category must match solar/energy/inverter/electrical
  const solarKeywords = ['solar', 'inverter', 'battery', 'energy', 'electric', 'power'];
  const targets = leads.filter(lead => {
    if ((lead.status || 'NEW') !== 'NEW') return false;
    const phone = lead.phone_e164 || lead.phone_raw;
    if (!phone) return false;

    // Filter out DNC
    const cleanPhone = phone.replace(/\D/g, '');
    const isDnc = dncList.some(d => d.replace(/\D/g, '') === cleanPhone);
    if (isDnc) return false;

    // Match solar category
    const cat = (lead.category || '').toLowerCase();
    const name = (lead.name || '').toLowerCase();
    const matchesKeyword = solarKeywords.some(kw => cat.includes(kw) || name.includes(kw));

    return matchesKeyword;
  });

  console.log(`[Filtering] Found ${targets.length} installers eligible for onboarding out of ${leads.length} total leads.`);

  if (targets.length === 0) {
    console.log('\n\x1b[32m[Done] No new target installers to contact. Exiting.\x1b[0m\n');
    return;
  }

  for (const lead of targets) {
    const phone = lead.phone_e164 || lead.phone_raw;
    const city = lead.city || 'Lagos';
    const source = lead.source || 'Public Directory';

    // Construct personalized spintax message
    const resolvedSpintax = parseSpintax(MESSAGE_TEMPLATE);
    const message = resolvedSpintax
      .replace(/\{\{\s*name\s*\}\}/g, lead.name)
      .replace(/\{\{\s*source\s*\}\}/g, source)
      .replace(/\{\{\s*city\s*\}\}/g, city);

    console.log(`\n\x1b[33m------------------------------------------------------------\x1b[0m`);
    console.log(`[Target] Name:  ${lead.name}`);
    console.log(`[Target] Phone: ${phone}`);
    console.log(`[Target] Msg:\n${message}`);

    if (isDryRun) {
      console.log('\x1b[33m[Dry Run] Bypassed message delivery.\x1b[0m');
      continue;
    }

    try {
      await sendWhatsApp(phone, message, config);
      console.log(`\x1b[32m[Success] Message sent to ${lead.name}.\x1b[0m`);

      // Update lead status in DB
      lead.status = 'CONTACTED';
      lead.last_contacted_at = new Date().toISOString();
      lead.notes = (lead.notes || '') + `\n[${new Date().toISOString()}] Automated B2B Onboarding Invitation Sent via WhatsApp.`;

      if (config.storageMode === 'cloud' || config.storageMode === 'supabase') {
        const supabaseUrl = config.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = config.supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        await supabase
          .from('leads')
          .update({
            status: lead.status,
            last_contacted_at: lead.last_contacted_at,
            notes: lead.notes
          })
          .eq('lead_id', lead.lead_id);
      } else {
        writeLocalLeads(leads);
      }
    } catch (err) {
      console.error(`\x1b[31m[Error] Failed to send message to ${lead.name}: ${err.message}\x1b[0m`);
    }
  }

  console.log('\n\x1b[36m============================================================\x1b[0m');
  console.log('\x1b[32m[Done] Outreach execution complete!\x1b[0m');
  console.log('\x1b[36m============================================================\x1b[0m\n');
}

async function sendWhatsApp(phone, message, config) {
  const cleanPhone = phone.replace(/\D/g, '');
  const provider = config.whatsappProvider || 'cloud';

  if (provider === 'cloud') {
    const url = `https://graph.facebook.com/v16.0/${config.whatsappPhoneNumberId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'text',
      text: { body: message }
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.whatsappAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const data = await resp.json();
      const errMsg = data.error?.message || resp.statusText;
      throw new Error(`Meta Cloud API error: ${errMsg}`);
    }
  } else if (provider === 'evolution') {
    if (!config.evolutionApiUrl || !config.evolutionInstanceName) {
      throw new Error('Evolution API URL and Instance Name must be configured.');
    }
    const baseUrl = config.evolutionApiUrl.replace(/\/+$/, '');
    const url = `${baseUrl}/message/sendText/${config.evolutionInstanceName}`;
    const payload = {
      number: cleanPhone,
      options: { delay: 1200, presence: 'composing' },
      textMessage: { text: message }
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.evolutionApiKey || '',
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Evolution API error (${resp.status}): ${txt}`);
    }
  } else if (provider === 'whapi') {
    if (!config.whapiToken) {
      throw new Error('Whapi.cloud Token must be configured.');
    }
    const url = 'https://gate.whapi.cloud/messages/text';
    const payload = {
      to: `${cleanPhone}@s.whatsapp.net`,
      body: message,
      typing_time: 1500
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.whapiToken}`
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Whapi error (${resp.status}): ${txt}`);
    }
  } else if (provider === 'baileys') {
    const baseUrl = config.whatsappBaileysUrl || 'http://localhost:3007';
    const url = `${baseUrl.replace(/\/+$/, '')}/send`;
    const payload = { phone: cleanPhone, message: message };

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Baileys error (${resp.status}): ${txt}`);
    }
  } else {
    throw new Error(`Unknown WhatsApp Provider: ${provider}`);
  }
}

runOnboarding().catch(console.error);
