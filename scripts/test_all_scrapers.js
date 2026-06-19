const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

const LEADS_FILE = path.join(__dirname, '..', 'local_db', 'leads_db.json');
const EXPORT_FILE = path.join(__dirname, '..', 'leads.xlsx');
const CONFIG_FILE = path.join(__dirname, '..', 'config.json');

async function runScrapers() {
  console.log('--- starting scrapers test ---');
  
  // Load config
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));

  // 1. Clear database
  if (config.storageMode === 'supabase' && config.supabaseUrl && config.supabaseKey) {
    console.log('clearing existing leads database in Supabase...');
    try {
      const supabase = createClient(config.supabaseUrl, config.supabaseKey);
      const { error } = await supabase.from('leads').delete().neq('lead_id', 'keep_none');
      if (error) {
        console.error('Error clearing Supabase leads:', error.message);
      } else {
        console.log('Supabase leads table cleared successfully.');
      }
    } catch (err) {
      console.error('Failed to clear Supabase:', err.message);
    }
  }
  
  if (fs.existsSync(LEADS_FILE)) {
    console.log('clearing existing leads database file...');
    fs.unlinkSync(LEADS_FILE);
  }
  
  const scrapers = [
    {
      name: 'Google Maps Places API',
      url: 'http://localhost:3005/api/scrape/maps',
      body: { query: 'dentist lagos sandbox', limit: 10 }
    },
    {
      name: 'Google Maps Free (Playwright)',
      url: 'http://localhost:3005/api/scrape/maps-free',
      body: { query: 'dentist lagos sandbox', limit: 10 }
    },
    {
      name: 'DuckDuckGo Scraper',
      url: 'http://localhost:3005/api/scrape/duckduckgo',
      body: { query: 'dentist lagos sandbox', limit: 10 }
    },
    {
      name: 'OpenStreetMap Scraper',
      url: 'http://localhost:3005/api/scrape/osm',
      body: { query: 'dentist lagos sandbox', limit: 10 }
    },
    {
      name: 'Jiji.ng Scraper',
      url: 'http://localhost:3005/api/scrape/jiji',
      body: { query: 'dentist lagos sandbox', url: 'https://jiji.ng/lagos/dentist?mode=sandbox', limit: 10 }
    },
    {
      name: 'Instagram (Social)',
      url: 'http://localhost:3005/api/scrape/social',
      body: { platform: 'INSTAGRAM', query: 'dentist lagos sandbox', limit: 10 }
    },
    {
      name: 'Facebook (Social)',
      url: 'http://localhost:3005/api/scrape/social',
      body: { platform: 'FACEBOOK', query: 'dentist lagos sandbox', limit: 10 }
    },
    {
      name: 'TikTok (Social)',
      url: 'http://localhost:3005/api/scrape/social',
      body: { platform: 'TIKTOK', query: 'dentist lagos sandbox', limit: 10 }
    },
    {
      name: 'LinkedIn (Social)',
      url: 'http://localhost:3005/api/scrape/social',
      body: { platform: 'LINKEDIN', query: 'dentist lagos sandbox', limit: 10 }
    }
  ];

  for (const scraper of scrapers) {
    console.log(`\nTriggering: ${scraper.name}...`);
    try {
      const response = await fetch(scraper.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scraper.body)
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Success: ${data.success}, Mode: ${data.mode || 'normal'}, Added: ${data.added}, Skipped: ${data.skipped}, Leads count: ${data.leads ? data.leads.length : 0}`);
    } catch (err) {
      console.error(`Error running ${scraper.name}:`, err.message);
    }
  }

  // 2. Download leads excel
  console.log('\nDownloading Excel workbook...');
  try {
    const response = await fetch('http://localhost:3005/api/export/leads');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(EXPORT_FILE, Buffer.from(buffer));
    console.log(`Excel file downloaded successfully and saved to: ${EXPORT_FILE}`);

    // 3. Verify excel structure & counts
    if (fs.existsSync(EXPORT_FILE)) {
      const workbook = XLSX.readFile(EXPORT_FILE);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      console.log(`\nVerification Results:`);
      console.log(`- Sheet Name: ${sheetName}`);
      console.log(`- Total Row Count: ${data.length}`);
      if (data.length > 0) {
        console.log(`- Sample Lead Name: "${data[0].name}"`);
        console.log(`- Sample Lead Phone: "${data[0].phone_e164}"`);
        console.log(`- Sample Lead Source: "${data[0].source}"`);
      } else {
        console.warn('Warning: Leads workbook is empty!');
      }
    }
  } catch (err) {
    console.error('Error downloading/verifying leads:', err.message);
  }
}

runScrapers();
