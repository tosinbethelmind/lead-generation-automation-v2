import { NextRequest, NextResponse } from 'next/server';
import { createScrapeJob } from '@/lib/supabaseClient';

// Default target niches
const DEFAULT_NICHES = [
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

// Default target areas in Lagos
const DEFAULT_LOCATIONS = [
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

function getScraperType(niche: string): 'jiji' | 'osm' | 'maps-free' | 'social' | 'duckduckgo' | 'maps' {
  const retailNiches = ['boutique', 'salon', 'restaurant', 'gym'];
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
    const limit = typeof body.limit === 'number' ? body.limit : 25; // 25 leads per run

    console.log(`[Bulk Queue API] Starting generation: ${niches.length} niches x ${locations.length} locations (limit: ${limit})`);

    const jobsCreated: { id: string; query: string; scraper: string }[] = [];

    // Limit generating combinations to avoid extreme database inserts (max 60 jobs per click, which is ~1500 leads)
    let jobsQueuedCount = 0;
    const maxJobsToQueue = 50; 

    // Shuffle the lists to make sure consecutive runs get different mixes of queries
    const shuffledNiches = [...niches].sort(() => Math.random() - 0.5);
    const shuffledLocations = [...locations].sort(() => Math.random() - 0.5);

    for (const niche of shuffledNiches) {
      for (const location of shuffledLocations) {
        if (jobsQueuedCount >= maxJobsToQueue) break;

        const query = `${niche} ${location}`;
        const scraper = getScraperType(niche);
        
        let payload: any = { query, limit, bypassQueue: true };
        if (scraper === 'social') {
          payload.platform = 'instagram';
        }

        try {
          const job = await createScrapeJob(scraper, payload);
          jobsCreated.push({
            id: job.id,
            query,
            scraper
          });
          jobsQueuedCount++;
        } catch (err: any) {
          console.error(`[Bulk Queue API] Failed to queue job for "${query}":`, err.message);
        }
      }
      if (jobsQueuedCount >= maxJobsToQueue) break;
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
