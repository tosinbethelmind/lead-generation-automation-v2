import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';

// Configure execution timeout for Vercel serverless execution
export const maxDuration = 60;

/**
 * POST /api/scrape/maps
 * Body: { query: string, limit?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, limit = 5 } = body;
    
    if (!query) {
      return NextResponse.json({ error: "Missing required query string parameter." }, { status: 400 });
    }
    
    const config = getRuntimeConfig();
    const apiKey = config.googlePlacesApiKey;
    
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json({ error: "Google Places API key is missing. Please configure it in Settings." }, { status: 400 });
    }
    
    // Cloud Execution
    await addLog('Google Maps Scraper', 'START', `Triggering live Google Places API for query: "${query}"`);
    
    // Text search request
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    const searchResp = await fetch(textSearchUrl);
    const searchData = await searchResp.json();
    
    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      throw new Error(`Google API returned status: ${searchData.status} - ${searchData.error_message || ''}`);
    }
    
    const placeRecords = (searchData.results || []).slice(0, limit);
    const newLeads: Partial<Lead>[] = [];
    
    for (const record of placeRecords) {
      const placeId = record.place_id;
      let rawPhone = '';
      let website = '';
      let address = record.formatted_address || '';
      
      // Fetch deep Place details to get contact and website information
      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=international_phone_number,formatted_phone_number,website&key=${apiKey}`;
        const detailsResp = await fetch(detailsUrl);
        const detailsData = await detailsResp.json();
        if (detailsData.status === 'OK' && detailsData.result) {
          rawPhone = detailsData.result.international_phone_number || detailsData.result.formatted_phone_number || '';
          website = detailsData.result.website || '';
        }
      } catch (err) {
        console.error('Failed to load deep details for place_id:', placeId, err);
      }
      
      // ── CORE FILTER: Only include businesses with rating >= 4.0 ──
      if ((record.rating || 0) < 4.0) {
        // Rating too low — skip
        continue;
      }

      const normPhone = rawPhone ? normalizePhone(rawPhone, 'NG') : null;
      if (!normPhone) continue;
      const hasWebsite = !!(website && website.trim());
      
      // Parse Lagos area/neighborhood if possible
      let area = 'Lagos';
      const areaMatches = address.match(/(Ikeja|Lekki|Yaba|Victoria Island|VI|Surulere|Ikoyi|Apapa|Maryland|Festac|Ebute Metta|Gbagada)/i);
      if (areaMatches) {
        area = areaMatches[0];
      }
      
      newLeads.push({
        lead_id: `places_${placeId}`,
        source: 'GOOGLE',
        name: record.name || 'Local Business',
        category: (record.types && record.types[0]) || 'Business',
        address,
        area,
        city: 'Lagos',
        phone_e164: normPhone || '',
        phone_raw: rawPhone,
        email: '',
        website: website || '',
        rating: record.rating || 0,
        reviews_count: record.user_ratings_total || 0,
        verified: !!record.opening_hours,
        listings_count: 1,
        profile_url: `https://www.google.com/maps/place/?q=place_id:${placeId}`,
        source_query_or_seed: query,
        collected_at: new Date().toISOString(),
        status: 'NEW',
        last_contacted_at: '',
        duplicate_of_lead_id: '',
        business_summary: hasWebsite
          ? `${record.name} is a local business in ${area}, Lagos. They have a basic website: ${website} but lack online booking or payment gateway automation.`
          : `${record.name} is a local business in ${area}, Lagos with a strong Google rating of ${record.rating || 'N/A'} stars (${record.user_ratings_total || 0} reviews) — but no website yet.`,
        notes: hasWebsite
          ? `Imported via Google Places API. Has basic website: ${website}. Pitch: Automation & Premium Feature Upgrade.`
          : `Imported via Google Places API. No website detected on place details.`
      });
    }
    
    const dbResult = await saveLeads(newLeads);
    await addLog('Google Maps Scraper', 'SUCCESS', `Places scraping complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
    
    return NextResponse.json({
      success: true,
      mode: 'cloud',
      added: dbResult.added,
      skipped: dbResult.skipped,
      leads: newLeads
    });
    
  } catch (e: any) {
    await addLog('Google Maps Scraper', 'ERROR', `Places scraping failed: ${e.message}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
