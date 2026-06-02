/**
 * @OnlyCurrentDoc
 * Lead Generation Automation - Jiji, Google Maps, & Apify
 * Author: Trae AI & Antigravity for Bethelmind Analytics & Strategy
 */

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================

const CONFIG = {
  SHEET_NAMES: {
    LEADS: 'Leads',
    CONFIG: 'Config',
    DNC: 'DNC',
    LOGS: 'Logs'
  },
  // Map headers to column indices (0-based) for faster processing
  LEAD_COLUMNS: [
    'lead_id', 'source', 'name', 'category', 'address', 'area', 'city', 
    'phone_e164', 'phone_raw', 'email', 'website', 'rating', 'reviews_count', 
    'verified', 'listings_count', 'profile_url', 'source_query_or_seed', 
    'collected_at', 'status', 'last_contacted_at', 'duplicate_of_lead_id', 
    'business_summary', 'notes'
  ],
  STATUS: {
    NEW: 'NEW',
    ENRICHED: 'ENRICHED',
    CONTACTED: 'CONTACTED',
    DNC: 'DO_NOT_CONTACT',
    ERROR: 'ERROR',
    DUPLICATE: 'DUPLICATE'
  }
};

// Global cache for DNC list to prevent multiple spreadsheet reads during loop
let globalDncCache_ = null;

/**
 * Main Entry Point for Full Pipeline
 */
function runAll() {
  const runId = Utilities.getUuid();
  logEvent_(runId, 'START', 'runAll', 'Starting full pipeline');
  
  try {
    const config = loadConfig_();
    if (!config) throw new Error("Config load failed");

    // Reset DNC Cache for this execution run
    globalDncCache_ = null;

    // 1. Fetch Leads
    let newLeads = [];
    
    // Jiji
    try {
      const jijiLeads = fetchJijiLeadsFromSeeds_(config, runId);
      newLeads = newLeads.concat(jijiLeads);
    } catch (e) {
      logEvent_(runId, 'ERROR', 'Jiji Fetch', e.message);
    }

    // Google Maps
    try {
      const mapsLeads = fetchGooglePlacesLeads_(config, runId);
      newLeads = newLeads.concat(mapsLeads);
    } catch (e) {
      logEvent_(runId, 'ERROR', 'Maps Fetch', e.message);
    }

    // 2. Process & Dedupe
    if (newLeads.length > 0) {
      logEvent_(runId, 'INFO', 'Processing', `Found ${newLeads.length} raw leads`);
      
      // Load existing leads for deduplication
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const leadsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.LEADS);
      const existingData = leadsSheet.getDataRange().getValues();
      existingData.shift(); // Remove headers
      
      const processedLeads = dedupeLeads_(newLeads, existingData, runId);
      
      // 3. Write to Sheet (only unique, non-duplicates are appended)
      if (processedLeads.length > 0) {
        writeLeadsToSheet_(processedLeads, leadsSheet);
        logEvent_(runId, 'INFO', 'Write', `Appended ${processedLeads.length} unique leads`);
      } else {
        logEvent_(runId, 'INFO', 'Write', 'No new unique leads to append in this batch');
      }
    }

    // 4. WhatsApp Outreach
    if (config.whatsapp_enabled) {
      selectAndMessageLeads_(config, runId);
    } else {
      logEvent_(runId, 'INFO', 'WhatsApp', 'Skipped (Disabled in Config)');
    }

  } catch (e) {
    logEvent_(runId, 'FATAL', 'runAll', e.toString());
  }
  
  logEvent_(runId, 'END', 'runAll', 'Pipeline finished');
  cleanupOldLogs_();
}

/**
 * Stage 1: Quick MVP Test
 */
function runQuickTest() {
  const runId = 'MVP_' + new Date().getTime();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.CONFIG);
  
  // Minimal Hardcoded/Read Config for MVP
  const apiKey = configSheet.getRange("B2").getValue(); // google_places_api_key
  const query = configSheet.getRange("P2").getValue(); // First query in map
  
  if (!apiKey || !query) {
    SpreadsheetApp.getUi().alert("Please fill API Key (B2) and one Map Query (P2) in Config");
    return;
  }

  // Reset DNC cache
  globalDncCache_ = null;

  // 1. Fetch minimal Google Leads
  const leads = [];
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
  const response = UrlFetchApp.fetch(searchUrl);
  const data = JSON.parse(response.getContentText());
  
  if (data.results) {
    // Process first 5 results
    const limit = Math.min(5, data.results.length);
    for (let i = 0; i < limit; i++) {
      const place = data.results[i];
      try {
        // Get Details
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,rating,user_ratings_total,formatted_phone_number,website,types&key=${apiKey}`;
        const options = { 'muteHttpExceptions': true };
        const detResp = UrlFetchApp.fetch(detailsUrl, options);
        
        if (detResp.getResponseCode() !== 200) continue;
        
        const det = JSON.parse(detResp.getContentText()).result;
        if (!det) continue;
        
        const lead = {
          lead_id: 'GMP_' + place.place_id,
          source: 'GOOGLE',
          name: det.name,
          category: det.types ? det.types[0] : 'Business',
          address: det.formatted_address,
          area: 'Lagos', // Simple assumption for MVP
          city: 'Lagos',
          phone_raw: det.formatted_phone_number,
          phone_e164: normalizePhoneE164_(det.formatted_phone_number),
          rating: det.rating || 0,
          reviews_count: det.user_ratings_total || 0,
          verified: true, // Assumed for Maps
          listings_count: 0,
          profile_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          source_query_or_seed: query,
          collected_at: new Date(),
          status: CONFIG.STATUS.NEW
        };
        
        lead.business_summary = buildBusinessSummary_(lead);
        leads.push(lead);
      } catch (detError) {
        Logger.log(`MVP details fetch failed for place_id ${place.place_id}: ${detError.message}`);
      }
    }
  }
  
  // 2. Write to Sheet
  if (leads.length > 0) {
    const leadsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.LEADS);
    const existingData = leadsSheet.getDataRange().getValues();
    existingData.shift();
    
    const processedLeads = dedupeLeads_(leads, existingData, runId);
    if (processedLeads.length > 0) {
      writeLeadsToSheet_(processedLeads, leadsSheet);
      Logger.log(`MVP Run Complete. Appended ${processedLeads.length} unique leads to sheet.`);
    } else {
      Logger.log("MVP Run Complete. All fetched leads were duplicates.");
    }
  } else {
    Logger.log("MVP Run Complete. No leads found.");
  }
}

// ==========================================
// 2. DATA FETCHING
// ==========================================

function fetchGooglePlacesLeads_(config, runId) {
  const leads = [];
  const queries = config.maps_queries; // Array of objects
  
  if (!queries || queries.length === 0) return leads;

  queries.forEach(q => {
    try {
      // 1. Text Search
      let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q.query)}&key=${config.api_key}`;
      
      // Add Type filter if specified
      if (q.include_types) searchUrl += `&type=${q.include_types}`;
      
      const resp = UrlFetchApp.fetch(searchUrl);
      const data = JSON.parse(resp.getContentText());
      
      if (!data.results) return;
      
      // Limit results
      const resultsToProcess = data.results.slice(0, q.max_results || 20);
      
      resultsToProcess.forEach(place => {
        // Pre-filter by rating/reviews if available in search result to save Details quota
        if (q.min_rating && place.rating < q.min_rating) return;
        if (q.min_reviews && place.user_ratings_total < q.min_reviews) return;

        // 2. Place Details (Wrapped in try/catch to make it robust)
        try {
          const fields = 'name,formatted_address,geometry,rating,user_ratings_total,formatted_phone_number,website,url,business_status,types';
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=${fields}&key=${config.api_key}`;
          
          Utilities.sleep(200); // Rate limit protection
          const options = { 'muteHttpExceptions': true };
          const detResp = UrlFetchApp.fetch(detailsUrl, options);
          
          if (detResp.getResponseCode() !== 200) {
            logEvent_(runId, 'WARN', 'fetchGooglePlaces', `Details API response code ${detResp.getResponseCode()} for place_id ${place.place_id}`);
            return;
          }
          
          const det = JSON.parse(detResp.getContentText()).result;
          if (!det) return;

          // Filter: Phone is required
          if (!det.formatted_phone_number) return;

          const lead = {
            lead_id: 'GMP_' + place.place_id,
            source: 'GOOGLE',
            name: det.name,
            category: det.types ? formatCategory_(det.types) : 'Business',
            address: det.formatted_address,
            area: extractArea_(det.formatted_address),
            city: extractCity_(det.formatted_address),
            phone_raw: det.formatted_phone_number,
            phone_e164: normalizePhoneE164_(det.formatted_phone_number),
            email: '', // Maps API rarely returns email
            website: det.website || '',
            rating: det.rating || 0,
            reviews_count: det.user_ratings_total || 0,
            verified: true, // Google Maps entries are effectively verified listings
            listings_count: 0,
            profile_url: det.url,
            source_query_or_seed: q.query,
            collected_at: new Date(),
            status: CONFIG.STATUS.NEW
          };
          
          lead.business_summary = buildBusinessSummary_(lead);
          leads.push(lead);
        } catch (detailsError) {
          logEvent_(runId, 'WARN', 'fetchGooglePlaces', `Failed place details fetch for ${place.place_id}: ${detailsError.message}`);
        }
      });
      
    } catch (e) {
      logEvent_(runId, 'ERROR', 'fetchGooglePlaces', `Query: ${q.query} - ${e.message}`);
    }
  });
  
  return leads;
}

function fetchJijiLeadsFromSeeds_(config, runId) {
  // NOTE: Jiji scraping via Apps Script UrlFetchApp is highly experimental 
  // due to Cloudflare protection and dynamic content.
  const leads = [];
  const seeds = config.jiji_seeds;
  
  seeds.forEach(seed => {
    try {
      const options = {
        'muteHttpExceptions': true,
        'headers': {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      };
      
      const resp = UrlFetchApp.fetch(seed.url, options);
      const html = resp.getContentText();
      
      if (resp.getResponseCode() !== 200) {
        logEvent_(runId, 'WARN', 'Jiji', `Failed to fetch ${seed.url}: ${resp.getResponseCode()}`);
        return;
      }

      // Regex to find Listing URLs or Vendor URLs
      // Target: href="/item-url" class="qa-advert-list-item"
      const productRegex = /href="(\/[^"]+)"[^>]*class="[^"]*qa-advert-list-item/g;
      let match;
      let count = 0;
      
      while ((match = productRegex.exec(html)) !== null) {
        if (count >= (config.max_vendors_per_seed || 5)) break;
        
        const relativeUrl = match[1];
        const profileUrl = `https://jiji.ng${relativeUrl}`;
        
        // Generate a deterministic ID based on the relative profile URL path
        const deterministicId = 'JIJI_' + generateDeterministicHash_(relativeUrl);
        
        leads.push({
          lead_id: deterministicId,
          source: 'JIJI',
          name: 'Jiji Vendor (See Profile)', 
          category: 'Seller',
          address: 'Lagos',
          area: 'Lagos',
          city: 'Lagos',
          phone_raw: '', // Phone is hidden on Jiji listing
          phone_e164: '',
          email: '',
          website: '',
          rating: 0,
          reviews_count: 0,
          verified: false,
          listings_count: 1,
          profile_url: profileUrl,
          source_query_or_seed: seed.url,
          collected_at: new Date(),
          status: CONFIG.STATUS.NEW,
          business_summary: `Vendor listed on Jiji in Lagos.`
        });
        
        count++;
      }
      
      logEvent_(runId, 'INFO', 'Jiji', `Found ${count} leads from ${seed.url} (Deterministic extraction)`);
      
    } catch (e) {
      logEvent_(runId, 'ERROR', 'Jiji Fetch', e.message);
    }
  });
  
  return leads;
}

// ==========================================
// 3. PROCESSING & HELPERS
// ==========================================

function buildBusinessSummary_(lead) {
  const name = lead.name || 'This business';
  const category = lead.category || 'business';
  const area = lead.area || lead.city || 'Lagos';
  const source = lead.source === 'JIJI' ? 'Jiji' : 'Google Maps';
  const verifiedText = lead.verified ? 'verified' : 'listed';
  
  // Pattern 1: Rich Data
  if (lead.rating && lead.reviews_count > 0) {
    return `${name} is a ${verifiedText} ${category} in ${area} with a ${lead.rating}-star rating from ${lead.reviews_count} reviews on ${source}.`;
  }
  
  // Pattern 2: Minimal Data
  return `${name} is a ${verifiedText} ${category} in ${area} listed on ${source}.`;
}

function normalizePhoneE164_(raw) {
  if (!raw) return '';
  // Remove non-digits
  let digits = raw.replace(/\D/g, '');
  
  // Nigerian E164 formatting logic
  if (digits.startsWith('2340')) {
    digits = '234' + digits.substring(4);
  } else if (digits.startsWith('0')) {
    digits = '234' + digits.substring(1);
  } else if (digits.length === 10 && ['7','8','9'].includes(digits[0])) {
    digits = '234' + digits;
  }
  
  return digits ? '+' + digits : '';
}

function dedupeLeads_(newLeads, existingData, runId) {
  const processed = [];
  const phoneMap = new Map();
  const nameMap = new Map();
  const urlMap = new Map();
  
  // Index existing leads
  existingData.forEach(row => {
    const id = row[0]; // lead_id
    const phone = row[7]; // phone_e164
    const nameAddr = (row[2] + row[4]).toLowerCase().replace(/[^a-z0-9]/g, ''); // name + address
    const url = row[15]; // profile_url
    
    if (phone) phoneMap.set(phone, id);
    if (nameAddr) nameMap.set(nameAddr, id);
    if (url) urlMap.set(url, id);
  });
  
  newLeads.forEach(lead => {
    const phone = lead.phone_e164;
    const nameAddr = (lead.name + lead.address).toLowerCase().replace(/[^a-z0-9]/g, '');
    const url = lead.profile_url;
    
    let dupId = null;
    
    if (phone && phoneMap.has(phone)) {
      dupId = phoneMap.get(phone);
    } else if (nameAddr && nameMap.has(nameAddr)) {
      dupId = nameMap.get(nameAddr);
    } else if (url && urlMap.has(url)) {
      dupId = urlMap.get(url);
    }
    
    if (dupId) {
      // Do NOT push to processed array to prevent writing duplicate rows to the sheet
      logEvent_(runId, 'INFO', 'Deduplication', `Filtered duplicate lead: ${lead.name} (Duplicate of ${dupId})`);
    } else {
      // New unique lead
      processed.push(lead);
      // Add to maps so subsequent new leads in this batch also check against this one
      if (phone) phoneMap.set(phone, lead.lead_id);
      if (nameAddr) nameMap.set(nameAddr, lead.lead_id);
      if (url) urlMap.set(url, lead.lead_id);
    }
  });
  
  return processed;
}

function writeLeadsToSheet_(leads, sheet) {
  if (leads.length === 0) return;
  
  const rows = leads.map(lead => {
    return CONFIG.LEAD_COLUMNS.map(col => {
      // Handle Date objects
      if (lead[col] instanceof Date) return lead[col];
      return lead[col] || '';
    });
  });
  
  // Batch append
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, rows.length, rows[0].length).setValues(rows);
}

// ==========================================
// 4. WHATSAPP OUTREACH
// ==========================================

function selectAndMessageLeads_(config, runId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.LEADS);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  // Indices
  const idxStatus = headers.indexOf('status');
  const idxPhone = headers.indexOf('phone_e164');
  const idxId = headers.indexOf('lead_id');
  const idxNotes = headers.indexOf('notes');
  const idxLastContacted = headers.indexOf('last_contacted_at');
  
  let sentCount = 0;
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const phone = row[idxPhone];
    const leadId = row[idxId];
    
    if (row[idxStatus] === CONFIG.STATUS.NEW && sentCount < config.whatsapp_daily_cap) {
      
      // 1. Phone number validation
      if (!phone || phone === '+' || phone.length < 10) {
        sheet.getRange(i + 2, idxStatus + 1).setValue(CONFIG.STATUS.ERROR);
        sheet.getRange(i + 2, idxNotes + 1).setValue("Skipped: Invalid or empty E164 phone number");
        logEvent_(runId, 'WARN', 'WhatsApp Validation', `Lead ${leadId} skipped due to invalid phone: "${phone}"`);
        continue;
      }
      
      // 2. Check DNC List
      if (isDNC_(phone, config)) {
        sheet.getRange(i + 2, idxStatus + 1).setValue(CONFIG.STATUS.DNC);
        sheet.getRange(i + 2, idxNotes + 1).setValue("Opted out (DNC Sheet)");
        logEvent_(runId, 'INFO', 'WhatsApp Check', `Lead ${leadId} skipped because phone is on DNC list`);
        continue;
      }

      // Convert row array to object for template variables mapping
      const lead = {};
      headers.forEach((h, k) => lead[h] = row[k]);
      
      // 3. Dry Run Mode Logic
      if (config.dry_run) {
        sheet.getRange(i + 2, idxStatus + 1).setValue(CONFIG.STATUS.CONTACTED);
        sheet.getRange(i + 2, idxLastContacted + 1).setValue(new Date());
        sheet.getRange(i + 2, idxNotes + 1).setValue("[DRY RUN] Simulated message sent successfully");
        logEvent_(runId, 'INFO', 'WhatsApp DryRun', `[DRY RUN] Would send template "${config.whatsapp_template_name}" to ${phone}. Vars: ${lead.name}, ${lead.category}, ${lead.area}`);
        sentCount++;
        continue;
      }
      
      // 4. Real Outreach API Dispatch
      try {
        const msgId = sendWhatsAppMessage_(lead, config);
        if (msgId) {
          sheet.getRange(i + 2, idxStatus + 1).setValue(CONFIG.STATUS.CONTACTED);
          sheet.getRange(i + 2, idxLastContacted + 1).setValue(new Date());
          sheet.getRange(i + 2, idxNotes + 1).setValue("Sent msg ID: " + msgId);
          sentCount++;
          Utilities.sleep(1000); // Thread throttling delay
        }
      } catch (e) {
        sheet.getRange(i + 2, idxStatus + 1).setValue(CONFIG.STATUS.ERROR);
        sheet.getRange(i + 2, idxNotes + 1).setValue("Send failed: " + e.message);
        logEvent_(runId, 'ERROR', 'WhatsApp Send', `Lead ${lead.lead_id}: ${e.message}`);
      }
    }
  }
}

function sendWhatsAppMessage_(lead, config) {
  const url = `https://graph.facebook.com/v19.0/${config.whatsapp_phone_number_id}/messages`;
  
  // Construct Template Payload
  const payload = {
    "messaging_product": "whatsapp",
    "to": lead.phone_e164,
    "type": "template",
    "template": {
      "name": config.whatsapp_template_name,
      "language": { "code": config.whatsapp_template_language_code },
      "components": [
        {
          "type": "body",
          "parameters": [
            { "type": "text", "text": lead.name || "Business Owner" },     // {{1}}
            { "type": "text", "text": lead.category || "Business" },        // {{2}}
            { "type": "text", "text": lead.area || "Lagos" },               // {{3}}
            { "type": "text", "text": lead.business_summary || "" },        // {{4}}
            { "type": "text", "text": config.business_signature }           // {{5}}
          ]
        }
      ]
    }
  };
  
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'Authorization': `Bearer ${getScriptProperty_(config.whatsapp_access_token_key)}`
    },
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };
  
  const resp = UrlFetchApp.fetch(url, options);
  const content = JSON.parse(resp.getContentText());
  
  if (resp.getResponseCode() === 200) {
    return content.messages[0].id;
  } else {
    throw new Error(JSON.stringify(content));
  }
}

// ==========================================
// 5. UTILS
// ==========================================

function loadConfig_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.CONFIG);
  
  // Read Global Settings (Col A-B)
  const globals = {};
  const globalData = sheet.getRange("A2:B20").getValues();
  globalData.forEach(r => { if(r[0]) globals[r[0]] = r[1]; });
  
  // Read WhatsApp Settings (Col D-E)
  const whatsapp = {};
  const waData = sheet.getRange("D2:E20").getValues();
  waData.forEach(r => { if(r[0]) whatsapp[r[0]] = r[1]; });
  
  // Read Maps Queries (Col P-U)
  const mapsQueries = [];
  const mapRows = sheet.getRange("P2:U").getValues();
  mapRows.forEach(r => {
    if (r[0]) {
      mapsQueries.push({
        query: r[0],
        min_rating: r[1],
        min_reviews: r[2],
        include_types: r[3],
        exclude_types: r[4],
        max_results: r[5]
      });
    }
  });

  // Read Jiji Seeds (Col G-N)
  const jijiSeeds = [];
  const jijiRows = sheet.getRange("G2:N").getValues();
  jijiRows.forEach(r => {
    if (r[0]) {
      jijiSeeds.push({
        url: r[0],
        max_pages: r[1],
        verified_only: r[4]
      });
    }
  });

  return {
    ...globals,
    ...whatsapp,
    maps_queries: mapsQueries,
    jiji_seeds: jijiSeeds,
    api_key: globals.google_places_api_key
  };
}

function getScriptProperty_(key) {
  return PropertiesService.getScriptProperties().getProperty(key) || 'MISSING_TOKEN';
}

function logEvent_(runId, status, step, msg) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.LOGS);
  sheet.appendRow([runId, new Date(), step, '', status, msg]);
  Logger.log(`[${status}] ${step}: ${msg}`);
}

function extractArea_(addr) {
  if (!addr) return 'Lagos';
  const parts = addr.split(',');
  return parts.length > 2 ? parts[parts.length - 3].trim() : 'Lagos';
}

function extractCity_(addr) {
  if (!addr) return 'Lagos';
  return addr.includes('Lagos') ? 'Lagos' : 'Nigeria';
}

function formatCategory_(types) {
  if (!types || types.length === 0) return 'Business';
  // Return first formatted type (e.g., "car_dealer" -> "Car Dealer")
  return types[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Checks if a normalized phone is present on the DNC tab.
 * Loads and caches DNC data once per run.
 */
function isDNC_(phone, config) {
  if (!phone) return false;
  
  if (!globalDncCache_) {
    globalDncCache_ = new Set();
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.DNC);
      if (sheet) {
        const data = sheet.getDataRange().getValues();
        data.shift(); // Remove headers
        data.forEach(row => {
          const dncPhone = normalizePhoneE164_(row[0]);
          if (dncPhone) {
            globalDncCache_.add(dncPhone);
          }
        });
      }
    } catch (e) {
      Logger.log("Error loading DNC list: " + e.message);
    }
  }
  
  return globalDncCache_.has(phone);
}

/**
 * Generates a short, deterministic hex string of the input text
 */
function generateDeterministicHash_(input) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_1, input, Utilities.Charset.UTF_8);
  let output = '';
  // Convert first 6 bytes of SHA-1 (48 bits) to hex
  for (let i = 0; i < Math.min(6, rawHash.length); i++) {
    let byteVal = rawHash[i];
    if (byteVal < 0) byteVal += 256;
    let byteString = byteVal.toString(16);
    if (byteString.length == 1) byteString = '0' + byteString;
    output += byteString;
  }
  return output;
}

/**
 * Option 1: Import Leads from Apify Dataset (No Timeout Issue)
 */
function importApifyLeads() {
  const runId = 'APIFY_' + new Date().getTime();
  logEvent_(runId, 'START', 'importApifyLeads', 'Starting Apify import');
  
  try {
    const config = loadConfig_();
    if (!config) throw new Error("Config load failed");
    
    const apifyToken = config.apify_token;
    const datasetId = config.apify_dataset_id;
    
    if (!apifyToken || !datasetId || apifyToken === 'YOUR_APIFY_API_TOKEN' || datasetId === 'YOUR_DATASET_ID') {
      throw new Error("Please configure valid apify_token and apify_dataset_id in Config sheet");
    }
    
    // Reset DNC Cache
    globalDncCache_ = null;
    
    const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}`;
    const options = { 'muteHttpExceptions': true };
    const resp = UrlFetchApp.fetch(url, options);
    
    if (resp.getResponseCode() !== 200) {
      throw new Error(`Apify API returned HTTP status ${resp.getResponseCode()}: ${resp.getContentText()}`);
    }
    
    const items = JSON.parse(resp.getContentText());
    logEvent_(runId, 'INFO', 'Apify Import', `Fetched ${items.length} items from dataset`);
    
    const newLeads = [];
    
    items.forEach(item => {
      // Unify phone mapping from various Apify Scrapers
      const rawPhone = item.phone || item.phoneNumber || item.formattedPhoneNumber || item.phone_raw || '';
      const phoneE164 = normalizePhoneE164_(rawPhone);
      
      // Skip if phone number is empty/invalid
      if (!phoneE164 || phoneE164 === '+' || phoneE164.length < 10) return;
      
      const name = item.title || item.name || 'Apify Lead';
      const website = item.website || '';
      const profileUrl = item.url || item.profile_url || item.placeUrl || '';
      const address = item.address || item.formattedAddress || 'Lagos';
      
      // Generate deterministic lead ID
      let leadId = '';
      if (item.placeId) {
        leadId = 'GMP_' + item.placeId;
      } else if (profileUrl) {
        leadId = 'APF_' + generateDeterministicHash_(profileUrl);
      } else {
        leadId = 'APF_' + generateDeterministicHash_(name + rawPhone);
      }
      
      const lead = {
        lead_id: leadId,
        source: (item.placeId || (profileUrl && profileUrl.includes('google.com'))) ? 'GOOGLE' : 'JIJI',
        name: name,
        category: item.categoryName || item.primaryCategory || 'Business',
        address: address,
        area: extractArea_(address),
        city: extractCity_(address),
        phone_raw: rawPhone,
        phone_e164: phoneE164,
        email: item.email || item.emailAddress || '',
        website: website,
        rating: item.stars || item.rating || 0,
        reviews_count: item.reviewsCount || item.reviews_count || 0,
        verified: (item.isVerified || item.verified) ? true : false,
        listings_count: item.listingsCount || 0,
        profile_url: profileUrl,
        source_query_or_seed: 'Apify Dataset ' + datasetId,
        collected_at: new Date(),
        status: CONFIG.STATUS.NEW
      };
      
      lead.business_summary = buildBusinessSummary_(lead);
      newLeads.push(lead);
    });
    
    if (newLeads.length > 0) {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const leadsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.LEADS);
      const existingData = leadsSheet.getDataRange().getValues();
      existingData.shift(); // Remove headers
      
      const processedLeads = dedupeLeads_(newLeads, existingData, runId);
      
      if (processedLeads.length > 0) {
        writeLeadsToSheet_(processedLeads, leadsSheet);
        logEvent_(runId, 'INFO', 'Apify Import', `Successfully imported ${processedLeads.length} unique leads`);
      } else {
        logEvent_(runId, 'INFO', 'Apify Import', 'All fetched leads were duplicates, skipped write');
      }
    } else {
      logEvent_(runId, 'INFO', 'Apify Import', 'No valid items with phone numbers found in dataset');
    }
    
  } catch (e) {
    logEvent_(runId, 'ERROR', 'importApifyLeads', e.message);
  }
  
  logEvent_(runId, 'END', 'importApifyLeads', 'Finished Apify import');
}

/**
 * Cleans up log rows older than 14 days to prevent spreadsheet bloat
 */
function cleanupOldLogs_() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.LOGS);
    if (!sheet) return;
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return; // Only headers
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 14); // 14 days ago
    
    let deleteCount = 0;
    // Traverse backwards to delete rows safely
    for (let i = data.length - 1; i >= 1; i--) {
      const logTs = new Date(data[i][1]); // Timestamp in Col B (idx 1)
      if (logTs < cutoffDate) {
        sheet.deleteRow(i + 1);
        deleteCount++;
      }
    }
    
    if (deleteCount > 0) {
      Logger.log(`Cleaned up ${deleteCount} old log rows.`);
    }
  } catch (e) {
    Logger.log("Failed to clean up logs: " + e.message);
  }
}
