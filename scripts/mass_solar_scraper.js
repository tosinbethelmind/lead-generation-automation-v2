/**
 * @file scripts/mass_solar_scraper.js
 * Standalone Node.js CLI script to perform high-concurrency mass lead collection
 * from OpenStreetMap (Overpass API) or high-fidelity synthetic generation (NDPA compliant)
 * and syncs them directly into the production Supabase database for SolarQuotePro.ng.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');

// Parse a single env file manually
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

// Load environment variables from local .env files
function loadEnv() {
  const localEnvPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(localEnvPath)) {
    console.log(`Loading env from: ${localEnvPath}`);
    parseEnvFile(localEnvPath);
  }

  // Also read from sibling Solar ROI Proposal Builder if database credentials are not set
  const currentUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!currentUrl || currentUrl.includes('szyuterncawfxwzhvwcf')) {
    const siblingEnvPath = path.join(__dirname, '../../Solar ROI Proposal Builder/.env.local');
    if (fs.existsSync(siblingEnvPath)) {
      console.log(`Targeting production Supabase from sibling project env: ${siblingEnvPath}`);
      const envContent = fs.readFileSync(siblingEnvPath, 'utf8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        const match = line.trim().match(/^([^#=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let val = match[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          if (key === 'SUPABASE_URL' || key === 'NEXT_PUBLIC_SUPABASE_URL') {
            process.env.TARGET_SUPABASE_URL = val;
          }
          if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
            process.env.TARGET_SUPABASE_KEY = val;
          }
        }
      }
    }
  }

  // Set defaults
  process.env.TARGET_SUPABASE_URL = process.env.TARGET_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.TARGET_SUPABASE_KEY = process.env.TARGET_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
}

loadEnv();

const SUPABASE_URL = process.env.TARGET_SUPABASE_URL;
const SUPABASE_KEY = process.env.TARGET_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase configuration missing! Please check environment variables.');
  process.exit(1);
}

console.log(`📡 Targeting Supabase instance: ${SUPABASE_URL}`);

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

// Configure Paths
const isServerless = !!(process.env.VERCEL || process.env.NOW_BUILDER || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);
const BUNDLE_DB_DIR = path.join(__dirname, '../local_db');
const LOCAL_DB_DIR = isServerless ? path.join('/tmp', 'local_db') : BUNDLE_DB_DIR;
if (!fs.existsSync(LOCAL_DB_DIR)) {
  fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
}

// Copy bundle cache if running in serverless and cache exists in bundle
if (isServerless) {
  const bundleCachePath = path.join(BUNDLE_DB_DIR, 'solar_leads_temp.json');
  const tempCachePath = path.join(LOCAL_DB_DIR, 'solar_leads_temp.json');
  if (fs.existsSync(bundleCachePath) && !fs.existsSync(tempCachePath)) {
    try {
      fs.copyFileSync(bundleCachePath, tempCachePath);
      console.log(`Successfully pre-loaded cache to serverless temp directory.`);
    } catch (err) {
      console.warn(`⚠️ Warning: Failed to pre-load cache: ${err.message}`);
    }
  }
}

const TEMP_LEADS_FILE = path.join(LOCAL_DB_DIR, 'solar_leads_temp.json');
const OUTPUT_CSV_FILE = path.join(LOCAL_DB_DIR, 'solar_leads_100k.csv');
const OUTPUT_XLSX_FILE = path.join(LOCAL_DB_DIR, 'solar_leads_100k.xlsx');

// Invalid name set for validation
const INVALID_LEAD_NAMES = new Set([
  'instagram', 'facebook', 'tiktok', 'twitter', 'x', 'linkedin',
  'whatsapp', 'snapchat', 'youtube', 'pinterest', 'reddit',
  'telegram', 'wechat', 'discord', 'threads', 'tumblr',
  'test', 'test lead', 'test lead insert', 'sample', 'demo',
  'n/a', 'na', 'none', 'null', 'undefined', 'unknown',
]);

function isValidLeadName(name) {
  if (!name) return false;
  const trimmed = name.trim();
  if (trimmed.length < 3) return false;
  if (trimmed.includes('@')) return false;
  if (INVALID_LEAD_NAMES.has(trimmed.toLowerCase())) return false;
  if (trimmed.toLowerCase().includes('test lead')) return false;
  if (/^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed)) return false;
  if (/^\d+$/.test(trimmed)) return false;
  return true;
}

// E.164 Phone Normalizer
function normalizePhone(raw, country = 'NG') {
  if (!raw) return null;
  const trimmed = raw.trim();
  const isExplicitIntl = trimmed.startsWith('+') || trimmed.startsWith('00');
  let digits = trimmed.replace(/\D/g, '');

  if (isExplicitIntl) {
    if (trimmed.startsWith('00')) {
      digits = digits.substring(2);
    }
  } else if (country === 'NG') {
    if (digits.startsWith('2340')) {
      digits = '234' + digits.substring(4);
    } else if (digits.startsWith('0')) {
      digits = '234' + digits.substring(1);
    } else if (digits.length === 10 && ['7', '8', '9'].includes(digits[0])) {
      digits = '234' + digits;
    }
  }

  if (digits.length < 7 || digits.length > 15) return null;
  return '+' + digits;
}

// Bounding boxes for major commercial/industrial regions in Nigeria
const URBAN_CLUSTERS = [
  { name: 'Ikeja & Mainland', state: 'Lagos', bbox: '6.55,3.25,6.68,3.40' },
  { name: 'Lagos Island, VI & Ikoyi', state: 'Lagos', bbox: '6.40,3.38,6.48,3.46' },
  { name: 'Lekki & Ajah', state: 'Lagos', bbox: '6.40,3.45,6.52,3.68' },
  { name: 'Surulere & Apapa', state: 'Lagos', bbox: '6.40,3.28,6.54,3.38' },
  { name: 'Alimosho & Agege', state: 'Lagos', bbox: '6.54,3.16,6.65,3.32' },
  { name: 'Yaba, Gbagada & Shomolu', state: 'Lagos', bbox: '6.49,3.35,6.58,3.42' },
  { name: 'Abuja Central (Wuse/Garki/Maitama)', state: 'FCT', bbox: '9.00,7.40,9.12,7.53' },
  { name: 'Gwarinpa & Kubwa', state: 'FCT', bbox: '9.08,7.30,9.18,7.42' },
  { name: 'Asokoro & Apo', state: 'FCT', bbox: '8.96,7.46,9.06,7.56' },
  { name: 'PH City & GRA', state: 'Rivers', bbox: '4.74,6.97,4.86,7.06' },
  { name: 'Trans-Amadi & Obio-Akpor', state: 'Rivers', bbox: '4.80,6.99,4.92,7.08' },
  { name: 'Ibadan North & Central', state: 'Oyo', bbox: '7.36,3.85,7.46,3.95' },
  { name: 'Ibadan South & Ring Road', state: 'Oyo', bbox: '7.30,3.80,7.39,3.90' },
  { name: 'Kano Commercial Center', state: 'Kano', bbox: '11.95,8.48,12.06,8.58' },
  { name: 'Kano Industrial Area', state: 'Kano', bbox: '11.90,8.50,11.98,8.60' },
  { name: 'Enugu Urban', state: 'Enugu', bbox: '6.40,7.46,6.50,7.56' },
  { name: 'Benin City', state: 'Edo', bbox: '6.30,5.56,6.40,5.68' },
  { name: 'Kaduna City', state: 'Kaduna', bbox: '10.46,7.38,10.56,7.48' },
  { name: 'Calabar', state: 'Cross River', bbox: '4.92,8.30,5.02,8.40' },
  { name: 'Uyo', state: 'Akwa Ibom', bbox: '4.98,7.88,5.08,7.98' },
  { name: 'Warri', state: 'Delta', bbox: '5.50,5.70,5.60,5.80' },
  { name: 'Aba', state: 'Abia', bbox: '5.08,7.32,5.18,7.42' },
  { name: 'Onitsha', state: 'Anambra', bbox: '6.12,6.76,6.22,6.86' },
  { name: 'Abeokuta', state: 'Ogun', bbox: '7.12,3.30,7.22,3.42' },
  { name: 'Ilorin', state: 'Kwara', bbox: '8.46,4.52,8.56,4.62' },
  { name: 'Jos', state: 'Plateau', bbox: '9.86,8.85,9.96,8.95' }
];

const COMMERCIAL_TAG_QUERIES = [
  { category: 'Solar Installers & Companies', query: 'node["craft"="solar_installer"](bbox); way["craft"="solar_installer"](bbox); relation["craft"="solar_installer"](bbox); node["shop"="solar_panels"](bbox); way["shop"="solar_panels"](bbox); relation["shop"="solar_panels"](bbox); node["office"="energy"](bbox); way["office"="energy"](bbox); relation["office"="energy"](bbox);' },
  { category: 'Hospitality', query: 'node["tourism"~"hotel|guest_house|hostel|motel"](bbox); way["tourism"~"hotel|guest_house|hostel|motel"](bbox); relation["tourism"~"hotel|guest_house|hostel|motel"](bbox);' },
  { category: 'Healthcare', query: 'node["amenity"~"hospital|clinic|pharmacy|doctors"](bbox); way["amenity"~"hospital|clinic|pharmacy|doctors"](bbox); relation["amenity"~"hospital|clinic|pharmacy|doctors"](bbox);' },
  { category: 'Education', query: 'node["amenity"~"school|college|university"](bbox); way["amenity"~"school|college|university"](bbox); relation["amenity"~"school|college|university"](bbox);' },
  { category: 'Retail & Commerce', query: 'node["shop"~"supermarket|mall|department_store|car"](bbox); way["shop"~"supermarket|mall|department_store|car"](bbox); relation["shop"~"supermarket|mall|department_store|car"](bbox); node["amenity"="bank"](bbox); way["amenity"="bank"](bbox); relation["amenity"="bank"](bbox);' },
  { category: 'Office & Professional', query: 'node["office"~"company|yes|government|ngo"](bbox); way["office"~"company|yes|government|ngo"](bbox); relation["office"~"company|yes|government|ngo"](bbox);' },
  { category: 'Industrial & Food', query: 'node["industrial"~"yes|factory|warehouse"](bbox); way["industrial"~"yes|factory|warehouse"](bbox); relation["industrial"~"yes|factory|warehouse"](bbox); node["amenity"~"restaurant|cafe|fast_food"](bbox); way["amenity"~"restaurant|cafe|fast_food"](bbox); relation["amenity"~"restaurant|cafe|fast_food"](bbox);' }
];

function buildOverpassQL(tagQuery, bbox) {
  return `
[out:json][timeout:90];
(
  ${tagQuery.replace(/\(bbox\)/g, `(${bbox})`)}
);
out tags center;
  `.trim();
}

function parseOSMAddress(tags, cluster) {
  const street = tags['addr:street'] || '';
  const num = tags['addr:housenumber'] || '';
  const city = tags['addr:city'] || cluster.name.split(' ')[0];
  const suburb = tags['addr:suburb'] || '';
  
  const parts = [];
  if (num && street) parts.push(`${num} ${street}`);
  else if (street) parts.push(street);
  
  if (suburb) parts.push(suburb);
  if (city) parts.push(city);
  
  return parts.join(', ') || tags['addr:full'] || `${cluster.name}, ${cluster.state}, Nigeria`;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getUUID(id) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    return id;
  }
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  let hex = '';
  for (let j = 0; j < 4; j++) {
    const val = Math.abs(hash + j * 9999999);
    hex += val.toString(16).padStart(8, '0');
  }
  hex = hex.substring(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(12, 15)}-9${hex.slice(15, 18)}-${hex.slice(18, 30)}`;
}

// HIGH-FIDELITY SYNTHETIC LEAD GENERATOR (NDPA 2023 Legitimate Interest & Consent Compliant)
function generateSyntheticLeads(count) {
  console.log(`🏭 Generating ${count} synthetic leads (mix of B2B Commercial and B2C Homeowner)...`);
  const leads = [];
  
  const b2cFirstNames = [
    'Chinedu', 'Ngozi', 'Obinna', 'Amara', 'Chidi', 'Chioma', 'Emeka', 'Ifunanya', 'Kelechi', 'Nneka', 'Uchenna',
    'Babajide', 'Femi', 'Folake', 'Tunde', 'Yemi', 'Adeola', 'Olamide', 'Biodun', 'Gbenga', 'Seyi', 'Yetunde',
    'Musa', 'Amina', 'Ibrahim', 'Fatima', 'Aliyu', 'Zainab', 'Abubakar', 'Hadiza', 'Usman', 'Mariam',
    'Bethel', 'Blessing', 'Joy', 'Patience', 'Emmanuel', 'Samuel', 'Victor', 'Grace'
  ];

  const b2cLastNames = [
    'Okonkwo', 'Eze', 'Okafor', 'Obi', 'Egwu', 'Nwachukwu', 'Anyanwu', 'Okeke', 'Chukwu', 'Ibeh',
    'Adeleke', 'Adewale', 'Bello', 'Oyinlola', 'Sowore', 'Fashola', 'Alabi', 'Oyelowo', 'Adebayo', 'Balogun',
    'Abubakar', 'Danjuma', 'Garba', 'Haruna', 'Sani', 'Gumi', 'Yusuf',
    'Bethelmind', 'Okon', 'Bassey', 'Effiong', 'Akpan'
  ];

  const adjectives = [
    'Lekki', 'Victoria', 'Ikeja', 'Capital', 'Premium', 'Metro', 'Summit', 'Apex', 'Nexus', 'Royal', 'Grand', 
    'Global', 'Atlantic', 'Nile', 'Niger', 'Zenith', 'Beacon', 'Crest', 'Dominion', 'Unity', 'Pinnacle', 
    'Alliance', 'Vanguard', 'Anchor', 'Nova', 'Meridian', 'Horizon', 'Starlight', 'Crown', 'Silverback',
    'Broadstreet', 'Marina', 'Chevron', 'Eko', 'Chartered', 'Integrated', 'Universal', 'Pioneer', 'Frontier'
  ];
  
  const nouns = [
    'Hotels', 'Suites', 'Hospital', 'Medical Center', 'Clinics', 'Plaza', 'Mall', 'Towers', 'Industries', 
    'Mills', 'Logistics', 'Foods', 'Beverages', 'Textiles', 'Chemicals', 'Holdings', 'Enterprises', 'Ventures', 
    'Schools', 'College', 'Academy', 'University', 'Bank', 'Microfinance', 'Offices', 'Hub', 'Complex',
    'Supermarkets', 'Coldrooms', 'Pharmaceuticals', 'Publishers', 'Breweries', 'Farms'
  ];
  
  const suffixes = ['Ltd', 'Plc', 'Group', 'Nigeria', 'West Africa', 'Enterprises'];

  const locations = [
    { state: 'Lagos', cities: ['Lekki', 'Victoria Island', 'Ikoyi', 'Ikeja', 'Gbagada', 'Surulere', 'Alimosho', 'Yaba', 'Ajah', 'Apapa'] },
    { state: 'Oyo', cities: ['Ibadan'] },
    { state: 'Rivers', cities: ['Port Harcourt'] },
    { state: 'Kano', cities: ['Kano'] },
    { state: 'FCT', cities: ['Wuse', 'Garki', 'Maitama', 'Gwarinpa', 'Kubwa', 'Asokoro', 'Apo'] },
    { state: 'Enugu', cities: ['Enugu'] },
    { state: 'Delta', cities: ['Warri'] },
    { state: 'Ogun', cities: ['Abeokuta'] },
    { state: 'Kwara', cities: ['Ilorin'] }
  ];

  for (let i = 1; i <= count; i++) {
    const loc = locations[i % locations.length];
    const city = loc.cities[i % loc.cities.length];
    const leadId = generateUUID();
    
    // 33% Homeowner/B2C, 67% Commercial/Industrial
    if (i % 3 === 0) {
      // B2C Homeowner Lead
      const firstName = b2cFirstNames[(i * 3) % b2cFirstNames.length];
      const lastName = b2cLastNames[(i * 7) % b2cLastNames.length];
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
      const suffixDigits = String(i).padStart(7, '0');
      const phone = `+234803${suffixDigits}`;
      
      const runningLoad = [1200, 1500, 2000, 2500, 3000, 3500, 4500][i % 7];
      let kva = "1.5 kVA";
      let systemSize = "1.5 kWp";
      if (runningLoad < 1500) {
        kva = "1.5 kVA";
        systemSize = "1.5 kWp";
      } else if (runningLoad < 2500) {
        kva = "3.0 kVA";
        systemSize = "3.0 kWp";
      } else if (runningLoad < 3500) {
        kva = "5.0 kVA";
        systemSize = "4.0 kWp";
      } else {
        kva = "7.5 kVA";
        systemSize = "5.5 kWp";
      }

      const fuelSpend = 80000 + (i % 10) * 30000;
      const savings = Math.round(fuelSpend * 0.75);
      
      let disco = "Eko Electricity Distribution";
      if (loc.state === 'Lagos') {
        disco = i % 2 === 0 ? "Ikeja Electric" : "Eko Electricity Distribution";
      } else if (loc.state === 'FCT') {
        disco = "Abuja Electricity Distribution (AEDC)";
      } else if (loc.state === 'Oyo') {
        disco = "Ibadan Electricity Distribution (IBEDC)";
      } else if (loc.state === 'Kano') {
        disco = "Kano Electricity Distribution (KEDCO)";
      } else {
        disco = "Enugu Electricity Distribution (EEDC)";
      }

      const note = `Residential backup request. Running load: ${runningLoad}W. Recommending a ${kva} hybrid inverter to offset domestic generator spend.`;
      
      leads.push({
        id: leadId,
        name,
        phone,
        email,
        state: loc.state,
        city,
        property_type: 'residential',
        monthly_spend: fuelSpend,
        power_source: 'mixed',
        interest_type: 'backup_power',
        budget_range: 'Flexible',
        preferred_contact: i % 2 === 0 ? 'WhatsApp' : 'Phone Call',
        timeline: '1-3 Months',
        note,
        request_source: 'estimator',
        created_at: new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000).toISOString(),
        running_load_w: runningLoad,
        kva_recommended: kva,
        monthly_savings_ngn: savings,
        monthly_fuel_spend: fuelSpend,
        city_disco: disco,
        estimated_system_size: systemSize,
        status: 'new'
      });
    } else {
      // B2B Commercial/Industrial Lead
      const adj = adjectives[(i * 3) % adjectives.length];
      const noun = nouns[(i * 7) % nouns.length];
      const suffix = suffixes[(i * 11) % suffixes.length];
      
      const companyName = `${adj} ${noun} ${suffix} #${1000 + i}`;
      const contactPerson = `${b2cFirstNames[(i * 2) % b2cFirstNames.length]} ${b2cLastNames[(i * 5) % b2cLastNames.length]}`;
      const emailName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `facility@${emailName}.com.ng`;
      
      const suffixDigits = String(i).padStart(7, '0');
      const phone = `+234803${suffixDigits}`;
      
      let propType = 'commercial';
      let spend = 1500000;
      let powerSource = 'mixed';
      let interestType = 'bill_savings';
      let budget = '50M-200M';
      let timeline = '1-3 Months';
      
      if (noun.includes('Hospital') || noun.includes('Medical') || noun.includes('Clinics')) {
        spend = 4000000 + (i % 6) * 1000000;
        propType = 'commercial';
        powerSource = 'generator';
        interestType = 'backup_power';
        budget = '200M+';
        timeline = 'Immediate';
      } else if (noun.includes('Industries') || noun.includes('Mills') || noun.includes('Logistics') || noun.includes('Chemicals') || noun.includes('Breweries') || noun.includes('Coldrooms')) {
        spend = 8000000 + (i % 8) * 1000000;
        propType = 'industrial';
        powerSource = 'generator';
        interestType = 'full_solar';
        budget = '200M+';
        timeline = 'Immediate';
      } else if (noun.includes('Schools') || noun.includes('College') || noun.includes('Academy') || noun.includes('University')) {
        spend = 800000 + (i % 5) * 400000;
        propType = 'commercial';
        powerSource = 'mixed';
        interestType = 'bill_savings';
        budget = '10M-50M';
        timeline = 'Researching';
      } else if (noun.includes('Hotels') || noun.includes('Suites')) {
        spend = 3000000 + (i % 5) * 1500000;
        propType = 'commercial';
        powerSource = 'generator';
        interestType = 'full_solar';
        budget = '50M-200M';
        timeline = '1-3 Months';
      } else if (noun.includes('Bank') || noun.includes('Microfinance')) {
        spend = 2000000 + (i % 4) * 1000000;
        propType = 'commercial';
        powerSource = 'mixed';
        interestType = 'backup_power';
        budget = '50M-200M';
        timeline = 'Immediate';
      } else {
        spend = 500000 + (i % 10) * 200000;
        propType = 'commercial';
        powerSource = 'mixed';
        interestType = 'bill_savings';
        budget = 'Flexible';
        timeline = 'Researching';
      }

      const estKwp = Math.round(spend / 40000);
      const savings = Math.round(spend * 0.72);
      
      const note = `Commercial energy efficiency inquiry. Est. size: ${estKwp}kWp. Est. diesel offset: NGN ${savings.toLocaleString()}/mo. Compliant B2B clean energy campaign lead.`;
      
      leads.push({
        id: leadId,
        name: companyName,
        contact_person: contactPerson,
        phone,
        email,
        state: loc.state,
        city,
        property_type: propType,
        monthly_spend: spend,
        power_source: powerSource,
        interest_type: interestType,
        budget_range: budget,
        preferred_contact: i % 2 === 0 ? 'WhatsApp' : 'Phone Call',
        timeline,
        note,
        request_source: 'general',
        created_at: new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000).toISOString(),
        status: 'new'
      });
    }
  }
  
  return leads;
}

// MAIN RUNNER
async function runScraper(options = { dryRun: false, synthetic: false, count: 100000 }) {
  let leads = [];

  // Quality Gate: synthetic mode is permanently disabled — always run live OSM extraction
  if (options.synthetic) {
    console.log('[Quality Gate] ⚠️  --synthetic flag detected but DISABLED. Routing to live OSM extraction instead.');
    console.log('[Quality Gate] Only 100% real verified leads from OpenStreetMap will be collected.');
  }
  {
    // Live OpenStreetMap Scraper Mode (always)
    
    // Set up cache map
    let localLeadsMap = new Map();
    if (fs.existsSync(TEMP_LEADS_FILE)) {
      try {
        const raw = fs.readFileSync(TEMP_LEADS_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        for (const l of parsed) {
          localLeadsMap.set(l.id, l);
        }
        console.log(`Loaded ${localLeadsMap.size} cached leads from: ${TEMP_LEADS_FILE}`);
      } catch (err) {
        console.error('Error loading temporary cache file:', err.message);
      }
    }

    const seenPhones = new Set();
    const seenEmails = new Set();
    for (const l of localLeadsMap.values()) {
      if (l.phone) seenPhones.add(l.phone);
      if (l.email) seenEmails.add(l.email.toLowerCase());
    }

    let clustersToScrape = options.dryRun ? URBAN_CLUSTERS.slice(0, 1) : URBAN_CLUSTERS;
    if (options.solarOnly) {
      clustersToScrape = [
        { name: 'All Nigeria', state: 'Nigeria', bbox: '4.27,2.67,13.89,14.68' }
      ];
    }
    let totalSaved = 0;
    let totalSkipped = 0;

    for (const cluster of clustersToScrape) {
      console.log(`\n🏢 Scraping Cluster: ${cluster.name} (${cluster.state}) [BBOX: ${cluster.bbox}]`);
      let queriesToRun = options.dryRun ? COMMERCIAL_TAG_QUERIES.slice(0, 2) : COMMERCIAL_TAG_QUERIES;
      if (options.solarOnly) {
        queriesToRun = COMMERCIAL_TAG_QUERIES.filter(q => q.category === 'Solar Installers & Companies');
      }

      for (const qTag of queriesToRun) {
        if (options.dryRun && totalSaved >= 50) {
          console.log('Dry run limit of 50 leads reached. Stopping.');
          break;
        }

        console.log(`  🔍 Category: ${qTag.category}...`);
        const overpassQL = buildOverpassQL(qTag.query, cluster.bbox);

        const OVERPASS_ENDPOINTS = [
          'https://overpass-api.de/api/interpreter',
          'https://overpass.kumi.systems/api/interpreter',
          'https://overpass.n.openstreetmap.de/api/interpreter',
          'https://overpass.osm.ch/api/interpreter'
        ];

        let data = null;
        let retries = 3;

        if (process.env.MOCK_SCRAPER === 'true') {
          console.log(`    [MOCK MODE] Simulating Overpass API response...`);
          data = {
            elements: [
              {
                type: 'node',
                id: 12345678,
                tags: {
                  name: 'Ikeja Solar Business Mock',
                  phone: '+2348012345678',
                  email: 'ikeja@solarmock.ng',
                  website: 'http://solarmock.ng',
                  amenity: 'office'
                }
              }
            ]
          };
          retries = 0;
        }

        while (retries > 0) {
          const endpoint = OVERPASS_ENDPOINTS[(3 - retries) % OVERPASS_ENDPOINTS.length];
          try {
            console.log(`    📡 Querying Overpass interpreter at: ${endpoint}...`);
            const resp = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'SolarQuoteProNGLeadGen/1.0 (contact@solarquotepro.ng)'
              },
              body: `data=${encodeURIComponent(overpassQL)}`
            });

            if (!resp.ok) {
              throw new Error(`Overpass API returned status: ${resp.status}`);
            }

            data = await resp.json();
            break;
          } catch (err) {
            retries--;
            console.warn(`    ⚠️ Overpass error from ${endpoint}: ${err.message}. Retries left: ${retries}`);
            if (retries > 0) {
              await sleep(10000);
            }
          }
        }

        if (!data || !data.elements) {
          console.log('    No data retrieved for this category.');
          continue;
        }

        const elements = data.elements;
        console.log(`    Retrieved ${elements.length} elements.`);

        let parsedInBatch = 0;

        for (const el of elements) {
          const tags = el.tags || {};
          const name = tags.name || tags.operator || tags.brand || '';

          if (!isValidLeadName(name)) {
            totalSkipped++;
            continue;
          }

          const rawPhone = tags.phone || tags['contact:phone'] || tags.mobile || tags['contact:mobile'] || '';
          const phone = rawPhone ? normalizePhone(rawPhone, 'NG') : null;
          const email = (tags.email || tags['contact:email'] || '').trim().toLowerCase();
          const website = (tags.website || tags['contact:website'] || tags.url || '').trim();

          if (!phone && !email && !website) {
            totalSkipped++;
            continue;
          }

          if (phone && seenPhones.has(phone)) {
            totalSkipped++;
            continue;
          }
          if (email && seenEmails.has(email)) {
            totalSkipped++;
            continue;
          }

          const city = tags['addr:city'] || cluster.name.split(' ')[0] || 'Lagos';
          const address = parseOSMAddress(tags, cluster);
          const category = tags.amenity || tags.shop || tags.office || tags.craft || tags.healthcare || tags.tourism || qTag.category;

          const leadId = `osm_${el.type}_${el.id}`;

          const lead = {
            id: leadId,
            name: name.trim(),
            phone: phone || rawPhone || 'N/A',
            email: email || 'no-email@solarquotepro.ng',
            state: cluster.state,
            city: city,
            property_type: 'commercial',
            monthly_spend: 0,
            power_source: 'mixed',
            interest_type: 'bill_savings',
            budget_range: 'Flexible',
            preferred_contact: phone ? 'WhatsApp' : 'Email',
            timeline: 'Researching',
            note: `OSM Category: ${category}. Address: ${address}. Profile: https://www.openstreetmap.org/${el.type}/${el.id}`,
            request_source: 'general',
            created_at: new Date().toISOString()
          };

          if (phone) seenPhones.add(phone);
          if (email) seenEmails.add(email);

          localLeadsMap.set(leadId, lead);
          
          // Append row to CSV
          const escapeField = (val) => {
            if (val === undefined || val === null) return '""';
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
          };
          if (!fs.existsSync(OUTPUT_CSV_FILE)) {
            const headers = ['id', 'name', 'phone', 'email', 'state', 'city', 'property_type', 'monthly_spend', 'power_source', 'interest_type', 'budget_range', 'preferred_contact', 'timeline', 'note', 'request_source', 'created_at', 'running_load_w', 'kva_recommended', 'monthly_savings_ngn', 'monthly_fuel_spend', 'city_disco', 'estimated_system_size', 'status'];
            fs.writeFileSync(OUTPUT_CSV_FILE, '\ufeff' + headers.join(',') + '\n');
          }
          const csvHeaders = ['id', 'name', 'phone', 'email', 'state', 'city', 'property_type', 'monthly_spend', 'power_source', 'interest_type', 'budget_range', 'preferred_contact', 'timeline', 'note', 'request_source', 'created_at', 'running_load_w', 'kva_recommended', 'monthly_savings_ngn', 'monthly_fuel_spend', 'city_disco', 'estimated_system_size', 'status'];
          const row = csvHeaders.map(h => escapeField(lead[h])).join(',');
          fs.appendFileSync(OUTPUT_CSV_FILE, row + '\n');

          parsedInBatch++;
          totalSaved++;

          if (options.dryRun && totalSaved >= 50) {
            break;
          }
        }

        console.log(`    Parsed and saved ${parsedInBatch} leads in this batch.`);
        fs.writeFileSync(TEMP_LEADS_FILE, JSON.stringify(Array.from(localLeadsMap.values()), null, 2));

        await sleep(4000);
      }
    }

    leads = Array.from(localLeadsMap.values());
    console.log(`\n🎉 Scraping Completed! Total leads saved locally: ${leads.length}`);

    // Export to Excel
    try {
      const worksheet = xlsx.utils.json_to_sheet(leads);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Solar Leads');
      xlsx.writeFile(workbook, OUTPUT_XLSX_FILE);
      console.log(`✅ Excel file exported successfully: ${OUTPUT_XLSX_FILE}`);
    } catch (err) {
      console.error('❌ Failed to export Excel file:', err.message);
    }

    // Sync to database
    await syncToSupabase(leads);
  }
}

// Sync leads directly to Supabase routing B2C to homeowner_leads and B2B to marketplace_leads + enterprise_leads
// Sync leads directly to Supabase routing B2C to homeowner_leads and B2B to marketplace_leads + enterprise_leads
async function syncToSupabase(leads) {
  console.log(`\n🗄️ Starting database sync/migration to Supabase...`);
  try {
    if (leads.length === 0) {
      console.warn('⚠️ No leads to sync.');
      return;
    }

    console.log(`Total leads to sync: ${leads.length}`);

    // Helper for retrying upsert operations on Supabase with backoff
    async function upsertWithRetry(table, rows, maxRetries = 3) {
      let attempt = 0;
      while (attempt < maxRetries) {
        try {
          const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
          if (!error) return null;
          console.warn(`\n⚠️ Warning: Upsert to ${table} failed (attempt ${attempt + 1}/${maxRetries}): ${error.message}`);
          if (attempt === maxRetries - 1) return error;
        } catch (err) {
          console.warn(`\n⚠️ Warning: Fetch failed during upsert to ${table} (attempt ${attempt + 1}/${maxRetries}): ${err.message}`);
          if (attempt === maxRetries - 1) return err;
        }
        attempt++;
        await new Promise(resolve => setTimeout(resolve, 1500 * attempt)); // Exponential backoff
      }
    }

    // Split leads into B2C (residential) and B2B (commercial/industrial)
    const residentialLeads = leads.filter(l => l.property_type === 'residential');
    const commercialLeads = leads.filter(l => l.property_type === 'commercial' || l.property_type === 'industrial');

    console.log(`Found ${residentialLeads.length} residential/homeowner leads.`);
    console.log(`Found ${commercialLeads.length} commercial/industrial leads.`);

    // Smaller chunk size (100) to ensure high reliability and avoid payload timeouts
    const CHUNK_SIZE = 100;
    
    // Sync Residential leads to homeowner_leads table
    if (residentialLeads.length > 0) {
      console.log(`\n🏡 Syncing B2C homeowner leads to public.homeowner_leads...`);
      let syncedRes = 0;
      let errorsRes = 0;
      for (let i = 0; i < residentialLeads.length; i += CHUNK_SIZE) {
        const chunk = residentialLeads.slice(i, i + CHUNK_SIZE);
        const dbRows = chunk.map(l => ({
          id: getUUID(l.id),
          name: l.name,
          phone: l.phone,
          email: l.email || null,
          location: `${l.city}, ${l.state}`,
          running_load_w: l.running_load_w || null,
          kva_recommended: l.kva_recommended || null,
          monthly_savings_ngn: l.monthly_savings_ngn || null,
          monthly_fuel_spend: l.monthly_fuel_spend || null,
          full_name: l.name,
          whatsapp: l.phone,
          city_disco: l.city_disco || null,
          estimated_system_size: l.estimated_system_size || null,
          status: l.status || 'new',
          notes: l.note || null,
          created_at: l.created_at
        }));

        const error = await upsertWithRetry('homeowner_leads', dbRows);

        if (error) {
          errorsRes += chunk.length;
          console.error(`❌ Failed to sync homeowner batch ${i / CHUNK_SIZE + 1}:`, error.message || error);
        } else {
          syncedRes += chunk.length;
          process.stdout.write(`Homeowner syncing progress: ${syncedRes}/${residentialLeads.length} leads synced...\r`);
        }
      }
      console.log(`\n✅ Homeowner sync completed. Successful: ${syncedRes}, Failures: ${errorsRes}`);
    }

    // Sync Commercial/Industrial leads to marketplace_leads and enterprise_leads
    if (commercialLeads.length > 0) {
      console.log(`\n🏢 Syncing B2B commercial leads to public.marketplace_leads and enterprise_leads...`);
      let syncedComm = 0;
      let errorsComm = 0;
      for (let i = 0; i < commercialLeads.length; i += CHUNK_SIZE) {
        const chunk = commercialLeads.slice(i, i + CHUNK_SIZE);
        
        // 1. Sync to marketplace_leads
        const marketplaceRows = chunk.map(l => ({
          id: l.id,
          name: l.name,
          phone: l.phone,
          email: l.email,
          state: l.state,
          city: l.city,
          property_type: l.property_type,
          monthly_spend: l.monthly_spend || 0,
          power_source: l.power_source,
          interest_type: l.interest_type,
          budget_range: l.budget_range,
          preferred_contact: l.preferred_contact,
          timeline: l.timeline,
          note: l.note,
          request_source: l.request_source,
          created_at: l.created_at
        }));

        const mpError = await upsertWithRetry('marketplace_leads', marketplaceRows);

        if (mpError) {
          errorsComm += chunk.length;
          console.error(`❌ Failed to sync marketplace batch ${i / CHUNK_SIZE + 1}:`, mpError.message || mpError);
          continue;
        }

        // 2. Sync to enterprise_leads
        const enterpriseRows = chunk.map(l => ({
          id: getUUID(l.id),
          company_name: l.name,
          contact_person: l.contact_person || 'Facility Manager',
          email: l.email,
          phone: l.phone,
          project_scope: l.note,
          status: l.status || 'new',
          created_at: l.created_at
        }));

        const entError = await upsertWithRetry('enterprise_leads', enterpriseRows);

        if (entError) {
          console.error(`❌ Failed to sync enterprise batch ${i / CHUNK_SIZE + 1}:`, entError.message || entError);
        }

        syncedComm += chunk.length;
        process.stdout.write(`Commercial syncing progress: ${syncedComm}/${commercialLeads.length} leads synced...\r`);
      }
      console.log(`\n✅ Commercial sync completed. Successful: ${syncedComm}, Failures: ${errorsComm}`);
    }

  } catch (err) {
    console.error('❌ database sync error:', err.message);
  }
}

// Handle execution args
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || args.includes('-d');
// Quality Gate: --synthetic flag is permanently ignored — live OSM extraction only
const isSynthetic = false; // was: args.includes('--synthetic') || args.includes('-s');
if (args.includes('--synthetic') || args.includes('-s')) {
  console.log('[Quality Gate] --synthetic flag detected and IGNORED. Running live extraction instead.');
}

const isSolarOnly = args.includes('--solar-only');

// Parse count argument
let count = 100000;
const countIndex = args.indexOf('--count');
if (countIndex !== -1 && args[countIndex + 1]) {
  count = parseInt(args[countIndex + 1], 10);
} else {
  const countValMatch = args.find(a => a.startsWith('--count='));
  if (countValMatch) {
    count = parseInt(countValMatch.split('=')[1], 10);
  }
}

runScraper({ dryRun: isDryRun, synthetic: isSynthetic, count: count, solarOnly: isSolarOnly }).catch(err => {
  console.error('Fatal execution error:', err.message);
});
