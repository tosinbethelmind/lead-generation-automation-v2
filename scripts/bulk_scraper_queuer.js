/**
 * scripts/bulk_scraper_queuer.js
 * Programmatically queues bulk leads queries in the database to fetch 2,000+ leads per month.
 */

const BASE_URL = 'http://localhost:3006';

// List of target niches
const NICHES = [
  'dentist',
  'pharmacy',
  'restaurant',
  'boutique',
  'salon',
  'solar installer',
  'gym',
  'lawyer',
  'hotel',
  'car dealer',
  'mechanic',
  'school'
];

// List of major target areas in Lagos
const LOCATIONS = [
  'ikeja',
  'lekki',
  'yaba',
  'surulere',
  'ikoyi',
  'victoria island',
  'gbagada',
  'maryland',
  'festac',
  'apapa'
];

// Scraper strategy per niche
function getScraperType(niche) {
  const retailNiches = ['boutique', 'salon', 'restaurant', 'gym'];
  if (retailNiches.includes(niche)) {
    return 'social'; // Social commerce scraper (Instagram/Facebook) is best
  }
  return 'maps-free'; // Google Maps free scraper is best for physical services
}

async function queueJobs() {
  console.log('==================================================');
  console.log('🚀 BULK SCRAPER QUEUEING ENGINE STARTING');
  console.log(`Target Niches: ${NICHES.length}`);
  console.log(`Target Locations: ${LOCATIONS.length}`);
  console.log('==================================================\n');

  let jobsQueued = 0;

  for (const niche of NICHES) {
    for (const location of LOCATIONS) {
      const query = `${niche} ${location}`;
      const scraper = getScraperType(niche);
      
      let payload = { query, limit: 25 };
      let endpoint = `${BASE_URL}/api/scrape/${scraper}`;

      // Customize social platform payload
      if (scraper === 'social') {
        payload.platform = 'instagram';
      }

      console.log(`Queueing: "${query}" using [${scraper}]...`);

      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data.success) {
            console.log(`  ✓ Queued: Job ID = ${data.jobId}`);
            jobsQueued++;
          } else {
            console.warn(`  ✗ Failed: ${data.error}`);
          }
        } else {
          console.warn(`  ✗ HTTP Error: ${resp.status}`);
        }
      } catch (err) {
        console.error(`  ✗ Request Error: ${err.message}`);
      }

      // Small delay between calls to avoid overloading Next.js queue dispatcher
      await new Promise(r => setTimeout(r, 400));
    }
  }

  console.log('\n==================================================');
  console.log(`🎉 BULK QUEUE COMPLETE!`);
  console.log(`Queued: ${jobsQueued} scraping jobs in the queue database.`);
  console.log(`The background local runner will process these sequentially.`);
  console.log('==================================================');
}

queueJobs();
