import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';

// ============================================================================
// Sandbox Lagos Google Maps Dataset Generator
// ============================================================================

function generateMockLagosLeads(query: string, limit: number): Partial<Lead>[] {
  const areas = ["Ikeja", "Lekki Phase 1", "Yaba", "Victoria Island", "Surulere", "Ikoyi"];
  
  // Businesses with and without websites
  const businesses = [
    { name: "Lagos Executive Motors", phone: "08031234567", cat: "Car Dealer", rating: 4.7, reviews: 142, website: "http://lagosexecutivemotors.com" },
    { name: "Eko Family Dental Clinic", phone: "07062345678", cat: "Dental Clinic", rating: 4.9, reviews: 89, website: "http://ekofamilydental.ng" },
    { name: "Lekki Elite Fashion Hub", phone: "08153456789", cat: "Boutique", rating: 4.3, reviews: 54, website: "https://lekkielitefashion.com" },
    { name: "Yaba Pharmacy & Wellness Center", phone: "09084567890", cat: "Pharmacy", rating: 4.6, reviews: 213, website: "" },
    { name: "Silicon Lagoon Tech Space", phone: "08095678901", cat: "Tech Hub", rating: 4.8, reviews: 76, website: "https://siliconlagoon.tech" },
    { name: "Jollof Express Cuisine Lekki", phone: "07026789012", cat: "Restaurant", rating: 4.5, reviews: 310, website: "" },
    { name: "Alaba Appliance Hub", phone: "08057890123", cat: "Appliance Dealer", rating: 4.1, reviews: 45, website: "" },
    { name: "V.I. Spa & Wellness Oasis", phone: "08188901234", cat: "Spa", rating: 4.8, reviews: 110, website: "http://vispa-oasis.ng" },
    { name: "Surulere Modern Supermarket", phone: "09019012345", cat: "Supermarket", rating: 4.4, reviews: 250, website: "" },
    { name: "Festac Medical Centre", phone: "08020123456", cat: "Hospital", rating: 4.2, reviews: 67, website: "" }
  ].filter(b => b.rating >= 4.0); // enforce rating floor

  const results: Partial<Lead>[] = [];
  const numToGen = limit || 10;
  
  for (let i = 0; i < numToGen; i++) {
    const biz = businesses[i % businesses.length];
    const name = numToGen > businesses.length ? `${biz.name} #${Math.floor(i / businesses.length) + 1}` : biz.name;
    const tsStr = String(Date.now());
    const randPart = tsStr.substring(tsStr.length - 5);
    const phoneNum = biz.phone.substring(0, 5) + randPart + String(i % 10);
    const area = areas[i % areas.length];
    const cleanPhone = normalizePhone(phoneNum, 'NG') || phoneNum;
    const hasWebsite = !!biz.website;
    
    results.push({
      lead_id: `mock_maps_${Date.now()}_${i}`,
      source: 'GOOGLE',
      name: name,
      category: biz.cat,
      address: `${Math.floor(Math.random() * 80) + 1} Herbert Macaulay Way, ${area}, Lagos, Nigeria`,
      area: area,
      city: 'Lagos',
      phone_e164: cleanPhone,
      phone_raw: phoneNum,
      email: `${biz.name.toLowerCase().replace(/\s+/g, '')}${i}@gmail.com`,
      website: biz.website || '',
      rating: biz.rating,
      reviews_count: biz.reviews,
      verified: Math.random() > 0.3,
      listings_count: 1,
      profile_url: `https://google.com/maps/place/${name.replace(/\s+/g, '+')}?ts=${Date.now()}_${i}`,
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: hasWebsite
        ? `${biz.name} is a highly-rated ${biz.cat.toLowerCase()} in ${area}, Lagos. They have a basic website: ${biz.website} but lack online booking or payment gateway automation.`
        : `${biz.name} is a highly-rated ${biz.cat.toLowerCase()} in ${area}, Lagos with ${biz.rating} stars and ${biz.reviews} Google reviews — but no website yet.`,
      notes: hasWebsite
        ? `Imported via Google Places Sandbox. Has basic website: ${biz.website}. Pitch: Automation & Premium Feature Upgrade.`
        : 'Imported via Google Places Sandbox. No website detected.'
    });
  }
  return results;
}

// ============================================================================
// Next.js Route Handler
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, limit = 5 } = body;
    
    if (!query) {
      return NextResponse.json({ error: "Missing required query string parameter." }, { status: 400 });
    }
    
    const config = getRuntimeConfig();
    const apiKey = config.googlePlacesApiKey;
    
    // Check if we should override with local sandbox
    const isSandbox = !apiKey || apiKey === '' || apiKey === 'local-sandbox' || config.storageMode === 'local';
    
    if (isSandbox) {
      await addLog('Google Maps Scraper', 'START', `Launching Google Maps local sandbox for query: "${query}" (limit: ${limit})`);
      
      const mockLeads = generateMockLagosLeads(query, limit);
      const dbResult = await saveLeads(mockLeads);
      
      await addLog('Google Maps Scraper', 'SUCCESS', `Sandbox scraping complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'sandbox',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: mockLeads
      });
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
