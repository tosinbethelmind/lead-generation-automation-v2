import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';

// ============================================================================
// OSM Overpass Scraper Endpoint
// ============================================================================

interface OSMElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
}

function parseOSMAddress(tags: Record<string, string>): string {
  const street = tags['addr:street'] || '';
  const num = tags['addr:housenumber'] || '';
  const city = tags['addr:city'] || '';
  const suburb = tags['addr:suburb'] || '';
  
  const parts = [];
  if (num && street) parts.push(`${num} ${street}`);
  else if (street) parts.push(street);
  
  if (suburb) parts.push(suburb);
  if (city) parts.push(city);
  
  return parts.join(', ') || tags['addr:full'] || '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, limit = 10 } = body;
    
    if (!query) {
      return NextResponse.json({ error: "Missing required query parameter." }, { status: 400 });
    }
    
    const config = getRuntimeConfig();
    const isSandbox = config.storageMode === 'local' || query.includes('sandbox') || query.includes('mock');
    
    if (isSandbox) {
      await addLog('OSM Scraper', 'START', `OSM local sandbox triggered for query: "${query}"`);
      // Return a set of mock leads matching OSM format
      const mockLeads: Partial<Lead>[] = [
        {
          lead_id: `osm_mock_${Date.now()}_1`,
          source: 'OSM',
          name: 'Ikeja Dental Clinic (OSM)',
          category: 'dentist',
          address: '22 Allen Ave, Ikeja, Lagos',
          area: 'Ikeja',
          city: 'Lagos',
          phone_e164: '+2348030000001',
          phone_raw: '08030000001',
          email: '',
          website: '',
          rating: 4.5,
          reviews_count: 8,
          verified: false,
          listings_count: 1,
          profile_url: 'https://www.openstreetmap.org/node/1',
          source_query_or_seed: query,
          collected_at: new Date().toISOString(),
          status: 'NEW',
          last_contacted_at: '',
          duplicate_of_lead_id: '',
          business_summary: 'Dental clinic located in Ikeja, Lagos. Retrieved via OpenStreetMap.',
          notes: 'Imported via OSM Local Sandbox.'
        }
      ];
      const dbResult = await saveLeads(mockLeads);
      return NextResponse.json({
        success: true,
        mode: 'sandbox',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: mockLeads
      });
    }

    await addLog('OSM Scraper', 'START', `Executing Overpass API query for: "${query}"`);

    // Parse area and keywords
    let areaName = 'Lagos'; // default
    let keyword = query;
    
    const areaMatches = query.match(/(Ikeja|Lekki|Yaba|Victoria Island|VI|Surulere|Ikoyi|Apapa|Maryland|Festac|Ebute Metta|Gbagada|Lagos)/i);
    if (areaMatches) {
      areaName = areaMatches[0];
      // remove area from search keyword
      keyword = query.replace(new RegExp(areaName, 'gi'), '').trim();
    }
    if (!keyword) {
      keyword = 'business';
    }

    // Map keywords to standard OSM tags if possible
    let osmTagQuery = '';
    const kwLower = keyword.toLowerCase();
    
    if (kwLower.includes('dentist')) {
      osmTagQuery = 'node["amenity"="dentist"](area.searchArea); way["amenity"="dentist"](area.searchArea);';
    } else if (kwLower.includes('car') || kwLower.includes('auto') || kwLower.includes('dealer')) {
      osmTagQuery = 'node["shop"="car"](area.searchArea); way["shop"="car"](area.searchArea);';
    } else if (kwLower.includes('pharmacy') || kwLower.includes('chemist') || kwLower.includes('drug')) {
      osmTagQuery = 'node["amenity"="pharmacy"](area.searchArea); way["amenity"="pharmacy"](area.searchArea);';
    } else if (kwLower.includes('restaurant') || kwLower.includes('food') || kwLower.includes('cafe') || kwLower.includes('diner')) {
      osmTagQuery = 'node["amenity"~"restaurant|cafe|fast_food"](area.searchArea); way["amenity"~"restaurant|cafe|fast_food"](area.searchArea);';
    } else if (kwLower.includes('clinic') || kwLower.includes('hospital') || kwLower.includes('doctor') || kwLower.includes('medical')) {
      osmTagQuery = 'node["amenity"~"clinic|hospital|doctors"](area.searchArea); way["amenity"~"clinic|hospital|doctors"](area.searchArea);';
    } else {
      // Generic case-insensitive name match
      osmTagQuery = `node["name"~"${keyword}",i](area.searchArea); way["name"~"${keyword}",i](area.searchArea);`;
    }

    const overpassQuery = `
      [out:json][timeout:25];
      area["name"~"${areaName}",i]->.searchArea;
      (
        ${osmTagQuery}
      );
      out tags center;
    `.trim();

    const url = 'https://overpass-api.de/api/interpreter';
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'ApexReachLeadGen/1.0 (contact@apexreach.net)'
      },
      body: `data=${encodeURIComponent(overpassQuery)}`
    });

    if (!resp.ok) {
      throw new Error(`Overpass API returned status: ${resp.status}`);
    }

    const data = await resp.json();
    const elements: OSMElement[] = data.elements || [];
    const newLeads: Partial<Lead>[] = [];
    
    for (const el of elements) {
      const tags = el.tags || {};
      const name = tags.name || tags.operator || tags.brand || '';
      if (!name) continue;
      
      const website = tags.website || tags['contact:website'] || tags['url'] || '';
      // CORE FILTER: Only lead if NO website exists
      if (website) continue;
      
      const phone = tags.phone || tags['contact:phone'] || tags.mobile || tags['contact:mobile'] || '';
      const normPhone = phone ? normalizePhone(phone, 'NG') : null;
      
      const address = parseOSMAddress(tags) || `${areaName}, Lagos, Nigeria`;
      const category = tags.amenity || tags.shop || tags.office || tags.craft || 'Business';
      
      newLeads.push({
        lead_id: `osm_${el.type}_${el.id}`,
        source: 'OSM',
        name,
        category,
        address,
        area: tags['addr:suburb'] || areaName,
        city: tags['addr:city'] || 'Lagos',
        phone_e164: normPhone || '',
        phone_raw: phone,
        email: tags.email || tags['contact:email'] || '',
        website: '',
        rating: 4.3, // OSM has no ratings; default to positive score
        reviews_count: 3,
        verified: false,
        listings_count: 1,
        profile_url: `https://www.openstreetmap.org/${el.type}/${el.id}`,
        source_query_or_seed: query,
        collected_at: new Date().toISOString(),
        status: 'NEW',
        last_contacted_at: '',
        duplicate_of_lead_id: '',
        business_summary: `${name} is a ${category} located in ${areaName}. Retrieved via OpenStreetMap tags.`,
        notes: 'Imported via OpenStreetMap Overpass API.'
      });
    }

    // Slice to target limit and save
    const sliced = newLeads.slice(0, limit);
    const dbResult = await saveLeads(sliced);
    
    await addLog('OSM Scraper', 'SUCCESS', `OSM scraping complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
    
    return NextResponse.json({
      success: true,
      mode: 'live',
      added: dbResult.added,
      skipped: dbResult.skipped,
      leads: sliced
    });
    
  } catch (e: any) {
    await addLog('OSM Scraper', 'ERROR', `OSM scraping failed: ${e.message}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
