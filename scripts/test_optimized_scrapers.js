async function run() {
  const BASE_URL = 'http://localhost:3006';
  
  const scrapers = [
    {
      name: 'Google Maps Places API (Sandbox)',
      url: `${BASE_URL}/api/scrape/maps`,
      body: { query: 'dentist lagos sandbox', limit: 2 }
    },
    {
      name: 'Google Maps Free - Puppeteer (Sandbox)',
      url: `${BASE_URL}/api/scrape/maps-free`,
      body: { query: 'dentist lagos sandbox', limit: 2 }
    },
    {
      name: 'Jiji Scraper (Sandbox)',
      url: `${BASE_URL}/api/scrape/jiji`,
      body: { query: 'dentist lagos sandbox', url: 'https://jiji.ng/lagos/dentist?mode=sandbox', limit: 2 }
    },
    {
      name: 'Apify Importer (Sandbox)',
      url: `${BASE_URL}/api/apify`,
      body: { query: 'dentist lagos sandbox', limit: 2 }
    }
  ];

  for (const scraper of scrapers) {
    console.log(`\nTesting ${scraper.name}...`);
    try {
      const resp = await fetch(scraper.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scraper.body)
      });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status} - ${resp.statusText}`);
      }
      const data = await resp.json();
      console.log(`✓ Response: success=${data.success}, mode=${data.mode}, added=${data.added}, leads=${data.leads?.length || 0}`);
      if (data.leads && data.leads.length > 0) {
        console.log(`  First lead sample: name="${data.leads[0].name}", phone="${data.leads[0].phone_e164}", website="${data.leads[0].website}"`);
      }
    } catch (err) {
      console.error(`✗ Failed to run ${scraper.name}: ${err.message}`);
    }
  }
}

run();
