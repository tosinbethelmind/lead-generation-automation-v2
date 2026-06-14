async function testOSMScraper() {
  console.log('\n--- TESTING OSM SCRAPER ---');
  
  // Test 1: Sandbox
  console.log('Testing OSM Scraper Sandbox...');
  try {
    const res = await fetch('http://localhost:3005/api/scrape/osm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'mock dentists', limit: 1 })
    });
    console.log('Sandbox Status:', res.status);
    const data = await res.json();
    console.log('Sandbox Added:', data.added, 'Skipped:', data.skipped);
    console.log('Sandbox Leads:', JSON.stringify(data.leads, null, 2));
  } catch (err) {
    console.error('OSM Sandbox Error:', err);
  }

  // Test 2: Live
  console.log('\nTesting OSM Scraper Live...');
  try {
    const res = await fetch('http://localhost:3005/api/scrape/osm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Dentists Ikeja', limit: 2 })
    });
    console.log('Live Status:', res.status);
    const data = await res.json();
    console.log('Live Added:', data.added, 'Skipped:', data.skipped);
    if (data.leads && data.leads.length > 0) {
      console.log('Live Lead Sample:', JSON.stringify(data.leads[0], null, 2));
    } else {
      console.log('No leads found (maybe they all have websites or none match).');
    }
  } catch (err) {
    console.error('OSM Live Error:', err);
  }
}

async function testJijiScraper() {
  console.log('\n--- TESTING JIJI SCRAPER ---');
  
  // Test 1: Sandbox
  console.log('Testing Jiji Scraper Sandbox...');
  try {
    const res = await fetch('http://localhost:3005/api/scrape/jiji', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'mock_cars', limit: 1 })
    });
    console.log('Sandbox Status:', res.status);
    const data = await res.json();
    console.log('Sandbox Added:', data.added, 'Skipped:', data.skipped);
    console.log('Sandbox Leads:', JSON.stringify(data.leads, null, 2));
  } catch (err) {
    console.error('Jiji Sandbox Error:', err);
  }

  // Test 2: Live
  console.log('\nTesting Jiji Scraper Live...');
  try {
    const res = await fetch('http://localhost:3005/api/scrape/jiji', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://jiji.ng/lagos/cars', limit: 1 })
    });
    console.log('Live Status:', res.status);
    const data = await res.json();
    console.log('Live Added:', data.added, 'Skipped:', data.skipped);
    if (data.leads && data.leads.length > 0) {
      console.log('Live Lead Sample:', JSON.stringify(data.leads[0], null, 2));
    } else {
      console.log('No leads found or blocked by Cloudflare (check logs).');
    }
  } catch (err) {
    console.error('Jiji Live Error:', err);
  }
}

async function runAll() {
  await testOSMScraper();
  await testJijiScraper();
  console.log('\nTests completed.');
}

runAll();
