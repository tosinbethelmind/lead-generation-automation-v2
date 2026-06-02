require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
  // CONFIGURATION: Add your seeds/queries here manually for the local version
  JIJI_SEEDS: [
    { url: 'https://jiji.ng/lekki/cars', max_pages: 2 }
  ],
  MAPS_QUERIES: [
    { query: 'Car Dealers in Ikeja', max_results: 10 }
  ],
  WHATSAPP: {
    ENABLED: false, // Set to true to enable sending
    TEMPLATE_NAME: 'lead_intro_v1',
    LANG_CODE: 'en_US',
    DAILY_CAP: 1000,
    SIGNATURE: 'Bethelmind Analytics & Strategy'
  },
  OUTPUT_FILE: 'leads_output.csv'
};

// ==========================================
// MAIN EXECUTION
// ==========================================
async function main() {
  console.log('🚀 Starting Local Lead Gen Pipeline...');
  
  let allLeads = [];

  // 1. Fetch Jiji Leads
  console.log('📦 Scraping Jiji...');
  for (const seed of CONFIG.JIJI_SEEDS) {
    const leads = await fetchJijiLeads(seed);
    allLeads = allLeads.concat(leads);
  }

  // 2. Fetch Google Maps Leads
  console.log('🗺️  Fetching Google Maps...');
  if (process.env.GOOGLE_PLACES_API_KEY) {
    for (const q of CONFIG.MAPS_QUERIES) {
      const leads = await fetchMapsLeads(q);
      allLeads = allLeads.concat(leads);
    }
  } else {
    console.warn('⚠️  Skipping Google Maps: GOOGLE_PLACES_API_KEY not found in .env');
  }

  // 3. Save to CSV
  if (allLeads.length > 0) {
    await saveToCsv(allLeads);
    console.log(`✅ Saved ${allLeads.length} leads to ${CONFIG.OUTPUT_FILE}`);
  } else {
    console.log('⚠️  No leads found.');
  }

  // 4. WhatsApp Outreach (Optional)
  if (CONFIG.WHATSAPP.ENABLED && process.env.WHATSAPP_ACCESS_TOKEN) {
    await sendWhatsAppBlast(allLeads);
  }
}

// ==========================================
// FUNCTIONS
// ==========================================

async function fetchJijiLeads(seed) {
  const leads = [];
  try {
    // Jiji blocks standard axios User-Agent. Mimic Chrome.
    const response = await axios.get(seed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });

    const $ = cheerio.load(response.data);
    const runId = Date.now();

    // Use Cheerio to find items
    // Note: Selectors must be updated if Jiji changes them.
    // Looking for generic product card wrappers
    const items = $('.b-list-advert__item-wrapper, .qa-advert-list-item');
    
    console.log(`   Found ${items.length} items on ${seed.url}`);

    items.each((i, el) => {
      if (leads.length >= 10) return; // Limit for demo

      const $el = $(el);
      const title = $el.find('.qa-advert-title, .b-list-advert__item-title').text().trim();
      const link = $el.find('a').attr('href');
      const region = $el.find('.qa-advert-region, .b-list-advert__item-region').text().trim();
      
      if (title && link) {
        const lead = {
          lead_id: `JIJI_${runId}_${i}`,
          source: 'JIJI',
          name: title, // Often the title is the product, vendor name is inside
          category: 'Seller',
          area: region || 'Lagos',
          phone_e164: '', // Hidden
          business_summary: `${title} listed in ${region} on Jiji.`,
          profile_url: link.startsWith('http') ? link : `https://jiji.ng${link}`
        };
        leads.push(lead);
      }
    });

  } catch (e) {
    console.error(`❌ Jiji Error (${seed.url}):`, e.message);
  }
  return leads;
}

async function fetchMapsLeads(q) {
  const leads = [];
  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
    const resp = await axios.get(searchUrl, {
      params: {
        query: q.query,
        key: process.env.GOOGLE_PLACES_API_KEY
      }
    });

    const results = resp.data.results.slice(0, q.max_results);
    
    for (const place of results) {
      // Get Details
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json`;
      const detResp = await axios.get(detailsUrl, {
        params: {
          place_id: place.place_id,
          fields: 'name,formatted_address,formatted_phone_number,types,rating,user_ratings_total,website',
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      });
      
      const det = detResp.data.result;
      if (det && det.formatted_phone_number) {
        const lead = {
          lead_id: `GMP_${place.place_id}`,
          source: 'GOOGLE',
          name: det.name,
          category: det.types ? det.types[0] : 'Business',
          area: det.formatted_address ? det.formatted_address.split(',').slice(-2)[0].trim() : 'Lagos',
          phone_e164: det.formatted_phone_number, // Needs normalization
          business_summary: `${det.name} is a ${det.rating}-star business in Lagos.`,
          profile_url: det.website || ''
        };
        leads.push(lead);
      }
      // Sleep to respect rate limits
      await new Promise(r => setTimeout(r, 200));
    }
  } catch (e) {
    console.error(`❌ Maps Error:`, e.message);
  }
  return leads;
}

async function saveToCsv(leads) {
  const csvWriter = createCsvWriter({
    path: CONFIG.OUTPUT_FILE,
    header: [
      {id: 'lead_id', title: 'LEAD_ID'},
      {id: 'source', title: 'SOURCE'},
      {id: 'name', title: 'NAME'},
      {id: 'category', title: 'CATEGORY'},
      {id: 'area', title: 'AREA'},
      {id: 'phone_e164', title: 'PHONE'},
      {id: 'business_summary', title: 'SUMMARY'},
      {id: 'profile_url', title: 'URL'}
    ]
  });
  
  await csvWriter.writeRecords(leads);
}

async function sendWhatsAppBlast(leads) {
  console.log('📨 Sending WhatsApp Messages...');
  // Implementation similar to GAS but using Axios
  // ...
}

main();
