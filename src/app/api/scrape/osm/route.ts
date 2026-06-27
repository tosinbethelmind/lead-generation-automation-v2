import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { enrichFromWebsite } from '@/lib/leadEnricher';

// Configure execution timeout for Vercel serverless execution
export const maxDuration = 60;

interface OSMElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
}

interface NominatimItem {
  place_id: number;
  osm_type: 'node' | 'way' | 'relation';
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  address?: Record<string, string>;
  extratags?: Record<string, string>;
}

// 1. Keyword-to-OSM-tag mapping object
const KEYWORD_TO_OSM_TAGS: Record<string, string[]> = {
  dentist: ['"amenity"="dentist"'],
  pharmacy: ['"amenity"="pharmacy"'],
  restaurant: ['"amenity"="restaurant"', '"amenity"="cafe"', '"amenity"="fast_food"'],
  'car dealer': ['"shop"="car"'],
  'solar installer': ['"craft"="solar_energy"', '"shop"="solar"', '"amenity"="solar_installer"', '"amenity"="solar_energy"'],
  'clothing store': ['"shop"="clothes"'],
  bakery: ['"shop"="bakery"'],
  hotel: ['"tourism"="hotel"', '"tourism"="guest_house"', '"tourism"="hostel"']
};

function getOSMTagsForKeyword(keyword: string): string[] | null {
  const kwLower = keyword.toLowerCase().trim();
  
  // Try exact or inclusion match first
  for (const [key, tags] of Object.entries(KEYWORD_TO_OSM_TAGS)) {
    if (kwLower === key || kwLower.includes(key) || key.includes(kwLower)) {
      return tags;
    }
  }
  
  // Word-based match (e.g. "solar panel installer" matching "solar installer")
  const kwWords = kwLower.split(/\s+/);
  for (const [key, tags] of Object.entries(KEYWORD_TO_OSM_TAGS)) {
    const keyWords = key.split(/\s+/);
    const allKeyWordsInKw = keyWords.every(w => kwWords.includes(w));
    if (allKeyWordsInKw) {
      return tags;
    }
  }
  
  return null;
}

// 2. Overpass API query builder function using proper bounding box
function buildOverpassQuery(osmTags: string[], bbox: string): string {
  const parts: string[] = [];
  for (const tag of osmTags) {
    parts.push(`  node[${tag}](${bbox});`);
    parts.push(`  way[${tag}](${bbox});`);
    parts.push(`  relation[${tag}](${bbox});`);
  }
  return `
[out:json][timeout:25];
(
${parts.join('\n')}
);
out tags center;
  `.trim();
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

function parseNominatimAddress(item: NominatimItem): string {
  const addr = item.address || {};
  const street = addr.road || '';
  const num = addr.house_number || '';
  const suburb = addr.suburb || addr.neighbourhood || '';
  const city = addr.city || addr.town || addr.village || '';
  
  const parts = [];
  if (num && street) parts.push(`${num} ${street}`);
  else if (street) parts.push(street);
  
  if (suburb) parts.push(suburb);
  if (city) parts.push(city);
  
  return parts.join(', ') || item.display_name || '';
}

function parseOSMElementsToLeads(elements: OSMElement[], areaName: string, query: string): Partial<Lead>[] {
  const leads: Partial<Lead>[] = [];
  for (const el of elements) {
    const tags = el.tags || {};
    const name = tags.name || tags.operator || tags.brand || '';
    if (!name) continue;
    
    const website = tags.website || tags['contact:website'] || tags['url'] || '';
    const phone = tags.phone || tags['contact:phone'] || tags.mobile || tags['contact:mobile'] || '';
    const normPhone = phone ? normalizePhone(phone, 'NG') : null;
    const email = tags.email || tags['contact:email'] || '';
    
    const address = parseOSMAddress(tags) || `${areaName}, Lagos, Nigeria`;
    const category = tags.amenity || tags.shop || tags.office || tags.craft || tags.healthcare || tags.tourism || 'Business';
    
    leads.push({
      lead_id: `osm_${el.type}_${el.id}`,
      source: 'OSM',
      name,
      category,
      address,
      area: tags['addr:suburb'] || areaName,
      city: tags['addr:city'] || 'Lagos',
      phone_e164: normPhone || '',
      phone_raw: phone,
      email,
      website: website || '',
      rating: 4.3,
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
  return leads;
}

function parseNominatimItemsToLeads(items: NominatimItem[], areaName: string, query: string): Partial<Lead>[] {
  const leads: Partial<Lead>[] = [];
  for (const item of items) {
    const tags = item.extratags || {};
    const name = tags.name || tags.operator || tags.brand || item.address?.amenity || item.address?.shop || item.address?.office || item.address?.craft || item.display_name.split(',')[0] || '';
    if (!name) continue;
    
    const website = tags.website || tags['contact:website'] || tags.url || '';
    const phone = tags.phone || tags['contact:phone'] || tags.mobile || tags['contact:mobile'] || item.address?.phone || '';
    const normPhone = phone ? normalizePhone(phone, 'NG') : null;
    const email = tags.email || tags['contact:email'] || '';
    
    const address = parseNominatimAddress(item);
    const category = item.address?.amenity || item.address?.shop || item.address?.office || item.address?.craft || item.class || 'Business';
    
    leads.push({
      lead_id: `osm_${item.osm_type}_${item.osm_id}`,
      source: 'OSM',
      name,
      category,
      address,
      area: item.address?.suburb || item.address?.neighbourhood || areaName,
      city: item.address?.city || item.address?.town || item.address?.village || 'Lagos',
      phone_e164: normPhone || '',
      phone_raw: phone,
      email,
      website: website || '',
      rating: 4.3,
      reviews_count: 3,
      verified: false,
      listings_count: 1,
      profile_url: `https://www.openstreetmap.org/${item.osm_type}/${item.osm_id}`,
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `${name} is a ${category} located in ${areaName}. Retrieved via Nominatim search.`,
      notes: 'Imported via Nominatim Search API.'
    });
  }
  return leads;
}

async function fetchFromNominatim(keyword: string, bbox: string, limit: number): Promise<NominatimItem[]> {
  const [south, west, north, east] = bbox.split(',');
  const viewbox = `${west},${north},${east},${south}`;
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(keyword)}&format=json&addressdetails=1&extratags=1&bounded=1&viewbox=${viewbox}&limit=${limit}`;
  
  await addLog('OSM Scraper', 'INFO', `Executing Nominatim search fallback for: "${keyword}"`);
  
  const resp = await fetch(nominatimUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'ApexReachLeadGen/1.0 (contact@apexreach.net)',
      'Accept-Language': 'en'
    }
  });

  if (!resp.ok) {
    throw new Error(`Nominatim API returned status: ${resp.status}`);
  }

  return await resp.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, limit = 10 } = body;
    
    if (!query) {
      return NextResponse.json({ error: "Missing required query parameter." }, { status: 400 });
    }
    
    const config = getRuntimeConfig();

    const isSandbox = query.toLowerCase().includes('sandbox') || query.toLowerCase().includes('mock');
    if (isSandbox) {
      await addLog('OSM Scraper', 'START', `Executing OSM sandbox run for: "${query}"`);
      const mockLeads = getMockOsmLeads(query);
      const dbResult = await saveLeads(mockLeads);
      await addLog('OSM Scraper', 'SUCCESS', `OSM sandbox scraping complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'sandbox',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: mockLeads
      });
    }

    await addLog('OSM Scraper', 'START', `Executing OSM lead generation pipeline for: "${query}"`);

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

    // Config & BBox setup
    const requestBbox = body.bbox; // allow override via request body
    const bbox = requestBbox || process.env.OSM_BBOX || (config as any).osmBbox || '6.3932,3.0982,6.7023,3.7034';

    // Map keywords to standard OSM tags if possible
    const osmTags = getOSMTagsForKeyword(keyword);
    
    let leadsToSave: Partial<Lead>[] = [];
    let methodUsed = 'Overpass';

    if (osmTags && osmTags.length > 0) {
      // 1. Build and run Overpass query
      const overpassQuery = buildOverpassQuery(osmTags, bbox);
      await addLog('OSM Scraper', 'INFO', `Overpass QL Query:\n${overpassQuery}`);
      
      try {
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
        
        leadsToSave = parseOSMElementsToLeads(elements, areaName, query);
        
        if (leadsToSave.length === 0) {
          await addLog('OSM Scraper', 'INFO', `Overpass query returned 0 valid leads. Trying Nominatim fallback.`);
          methodUsed = 'Nominatim Fallback';
          const nominatimItems = await fetchFromNominatim(keyword, bbox, limit);
          leadsToSave = parseNominatimItemsToLeads(nominatimItems, areaName, query);
        }
      } catch (err: any) {
        await addLog('OSM Scraper', 'WARN', `Overpass query failed: ${err.message}. Trying Nominatim fallback.`);
        methodUsed = 'Nominatim Fallback';
        try {
          const nominatimItems = await fetchFromNominatim(keyword, bbox, limit);
          leadsToSave = parseNominatimItemsToLeads(nominatimItems, areaName, query);
        } catch (nomErr: any) {
          await addLog('OSM Scraper', 'ERROR', `Nominatim fallback search failed: ${nomErr.message}`);
          throw new Error(`OSM Scraper failed. Overpass: ${err.message}. Nominatim: ${nomErr.message}`);
        }
      }
    } else {
      // 2. No OSM tags matched the keyword, fall back directly to Nominatim
      methodUsed = 'Nominatim Direct';
      try {
        const nominatimItems = await fetchFromNominatim(keyword, bbox, limit);
        leadsToSave = parseNominatimItemsToLeads(nominatimItems, areaName, query);
      } catch (nomErr: any) {
        await addLog('OSM Scraper', 'ERROR', `Nominatim direct search failed: ${nomErr.message}`);
        throw nomErr;
      }
    }

    // ── Website enrichment: fetch contact info from OSM-listed websites ────
    const toEnrich = leadsToSave.filter(l => l.website && (!l.email || !l.phone_e164));
    if (toEnrich.length > 0) {
      await addLog('OSM Scraper', 'INFO', `Enriching ${toEnrich.length} leads from their websites...`);
      await Promise.allSettled(
        toEnrich.map(async (lead) => {
          const enriched = await enrichFromWebsite(lead.website || '');
          if (!lead.email && enriched.email) lead.email = enriched.email;
          if (!lead.phone_e164 && enriched.phone) {
            lead.phone_e164 = enriched.phone;
            lead.phone_raw = enriched.phone;
          }
          if (enriched.email || enriched.phone) {
            lead.notes = (lead.notes || '') + ` | Website enriched: phone=${enriched.phone || 'none'}, email=${enriched.email || 'none'}`;
          }
        })
      );
    }

    // Slice to target limit and save
    const sliced = leadsToSave.slice(0, limit);
    const dbResult = await saveLeads(sliced);
    
    await addLog('OSM Scraper', 'SUCCESS', `OSM scraping complete using ${methodUsed}. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
    
    return NextResponse.json({
      success: true,
      mode: 'live',
      method: methodUsed,
      added: dbResult.added,
      skipped: dbResult.skipped,
      leads: sliced
    });
    
  } catch (e: any) {
    console.error("OSM general error:", e);
    await addLog('OSM Scraper', 'ERROR', `OSM scraping failed: ${e.message}`);
    return NextResponse.json({
      success: false,
      error: e.message || 'Internal error during live OSM scraping'
    }, { status: 500 });
  }
}

function getMockOsmLeads(query: string): Partial<Lead>[] {
  return [
    {
      lead_id: `mock_osm_node_1`,
      source: 'OSM',
      name: 'Yaba Dental Suite',
      category: 'dentist',
      address: '23 Herbert Macaulay Way, Yaba, Lagos',
      area: 'Yaba',
      city: 'Lagos',
      phone_e164: '+2348077788899',
      phone_raw: '08077788899',
      email: 'contact@yabadental.com',
      website: 'https://yabadental.com',
      rating: 4.3,
      reviews_count: 3,
      verified: false,
      listings_count: 1,
      profile_url: 'https://www.openstreetmap.org/node/mock_1',
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: 'Yaba Dental Suite is a dentist located in Yaba. Retrieved via OpenStreetMap tags.',
      notes: 'Sandbox mode lead.'
    },
    {
      lead_id: `mock_osm_way_2`,
      source: 'OSM',
      name: 'Lekki Dental Clinic',
      category: 'dentist',
      address: '15 Admiralty Way, Lekki, Lagos',
      area: 'Lekki',
      city: 'Lagos',
      phone_e164: '+2348088899900',
      phone_raw: '08088899900',
      email: '',
      website: '',
      rating: 4.3,
      reviews_count: 3,
      verified: false,
      listings_count: 1,
      profile_url: 'https://www.openstreetmap.org/way/mock_2',
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: 'Lekki Dental Clinic is a dentist located in Lekki. Retrieved via Nominatim search.',
      notes: 'Sandbox mode lead.'
    }
  ];
}
