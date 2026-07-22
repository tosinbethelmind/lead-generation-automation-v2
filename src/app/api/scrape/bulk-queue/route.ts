import { NextRequest, NextResponse } from 'next/server';
import { createScrapeJob } from '@/lib/supabaseClient';
import { triggerCloudRunnerIfNeeded } from '@/lib/cloudRunnerTrigger';


// 50 High-Yield Target Niches for B2B Web Build & Agency Prospecting in Nigeria
const DEFAULT_NICHES = [
  'solar installer',
  'dentist',
  'private clinic',
  'pharmacy',
  'restaurant',
  'boutique',
  'beauty salon',
  'gym & fitness',
  'law firm',
  'hotel & suites',
  'car dealership',
  'auto mechanic',
  'private school',
  'luxury spa',
  'business consultancy',
  'real estate developer',
  'supermarket',
  'travel agency',
  'event catering',
  'laundry service',
  'security company',
  'furniture showroom',
  'logistics company',
  'interior designer',
  'cold room supplier',
  'aluminum fabricator',
  'cleaning company',
  'barbing salon',
  'cake bakery',
  'pest control',
  'printing press',
  'event planner',
  'accounting firm',
  'optical clinic',
  'diagnostic center',
  'solar inverter repair',
  'architectural firm',
  'cctv installer',
  'freight forwarding',
  'plumbing contractor',
  'electrical contractor',
  'car rental service',
  'photography studio',
  'makeup artist',
  'tailoring shop',
  'building contractor',
  'veterinary clinic',
  'hardware store',
  'water factory',
  'sound engineer'
];

// 45 High-Density Commercial Suburbs & Markets across Lagos
const DEFAULT_LOCATIONS = [
  'ikeja gra',
  'computer village ikeja',
  'allen avenue ikeja',
  'opebi ikeja',
  'toyin street ikeja',
  'lekki phase 1',
  'chevron lekki',
  'ikota lekki',
  'sangotedo',
  'victoria island',
  'ikoyi',
  'yaba tech hub',
  'surulere',
  'gbagada gra',
  'maryland',
  'festac town',
  'apapa port zone',
  'ajah',
  'ikorodu central',
  'alimosho',
  'agege',
  'oshodi',
  'isolo industrial estate',
  'ipaja',
  'ojodu berger',
  'magodo phase 1',
  'magodo phase 2',
  'omole phase 1',
  'omole phase 2',
  'ogudu gra',
  'epe',
  'alaba international market',
  'balogun market island',
  'trade fair complex',
  'amuwo odofin',
  'ebute metta',
  'mushin commercial',
  'anthony village',
  'ilupeju industrial',
  'ikotun',
  'egbeda',
  'akowonjo',
  'ijora',
  'badagry',
  'ibeju lekki'
];

function getScraperType(niche: string): 'jiji' | 'osm' | 'maps-free' | 'social' | 'duckduckgo' | 'maps' {
  const retailNiches = ['boutique', 'salon', 'restaurant', 'gym', 'spa', 'catering'];
  if (retailNiches.includes(niche.toLowerCase())) {
    return 'social';
  }
  return 'maps-free';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    
    // Allow overriding niches/locations/limit via body
    const niches = Array.isArray(body.niches) && body.niches.length > 0 ? body.niches : DEFAULT_NICHES;
    const locations = Array.isArray(body.locations) && body.locations.length > 0 ? body.locations : DEFAULT_LOCATIONS;
    
    // Support Lagos 10k daily mode overrides
    const isLagosDaily10k = !!body.targetLagosDaily10k;
    const defaultLimit = isLagosDaily10k ? 100 : 25;
    const defaultMaxJobs = isLagosDaily10k ? 100 : 50;

    const limit = typeof body.limit === 'number' ? body.limit : defaultLimit; 
    const maxJobsToQueue = typeof body.maxJobsToQueue === 'number' ? body.maxJobsToQueue : defaultMaxJobs;

    // Supported scraper engines for Lagos 10k execution
    const defaultScrapers = ['maps-free', 'jiji', 'osm', 'social', 'duckduckgo'];
    const scrapers: string[] = Array.isArray(body.scrapers) && body.scrapers.length > 0 
      ? body.scrapers 
      : defaultScrapers;

    console.log(`[Bulk Queue API] Starting bulk generation: ${niches.length} niches x ${locations.length} locations. Using scrapers: [${scrapers.join(', ')}] (limit: ${limit}, maxJobs: ${maxJobsToQueue})`);

    const jobsCreated: { id: string; query: string; scraper: string }[] = [];

    // Limit generating combinations to avoid extreme database inserts
    let jobsQueuedCount = 0;

    // Shuffle the lists to make sure consecutive runs get different mixes of queries
    const shuffledNiches = [...niches].sort(() => Math.random() - 0.5);
    const shuffledLocations = [...locations].sort(() => Math.random() - 0.5);

    for (const niche of shuffledNiches) {
      for (const location of shuffledLocations) {
        if (jobsQueuedCount >= maxJobsToQueue) break;

        const query = `${niche} ${location}`;

        for (const scraper of scrapers) {
          if (jobsQueuedCount >= maxJobsToQueue) break;

          let payload: any = { limit, bypassQueue: true };

          if (scraper === 'social') {
            payload.query = query;
            payload.platform = 'instagram';
          } else if (scraper === 'jiji') {
            // Jiji crawler expects 'url'. If query is not a URL, the route formats it automatically,
            // but we'll format a clean, organic target slug here.
            const searchSlug = query.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            payload.url = `https://jiji.ng/lagos/${searchSlug}`;
          } else {
            payload.query = query;
          }

          try {
            const job = await createScrapeJob(scraper, payload);
            jobsCreated.push({
              id: job.id,
              query: scraper === 'jiji' ? payload.url : query,
              scraper
            });
            jobsQueuedCount++;
          } catch (err: any) {
            console.error(`[Bulk Queue API] Failed to queue job for "${query}" on ${scraper}:`, err.message);
          }
        }
      }
      if (jobsQueuedCount >= maxJobsToQueue) break;
    }

    if (jobsCreated.length > 0) {
      triggerCloudRunnerIfNeeded().catch((err) => {
        console.error('[BulkQueueTrigger] Failed to auto-trigger cloud runner:', err.message);
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully queued ${jobsCreated.length} scraper jobs (equivalent to up to ${jobsCreated.length * limit} target leads this week).`,
      jobsCount: jobsCreated.length,
      estimatedLeads: jobsCreated.length * limit,
      jobs: jobsCreated
    });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Internal server error during bulk queueing'
    }, { status: 500 });
  }
}
