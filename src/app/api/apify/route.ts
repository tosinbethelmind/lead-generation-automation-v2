import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { enrichFromWebsite } from '@/lib/leadEnricher';

// ============================================================================
// Sandbox Lagos Apify Dataset Generator
// ============================================================================

function generateMockApifyLeads(query: string, limit: number): Partial<Lead>[] {
  const config = getRuntimeConfig();
  const areas = ["Ikeja", "Lekki Phase 1", "Yaba", "Victoria Island", "Surulere", "Ikoyi"];
  const businesses = [
    { name: "Apify Lagos Logistics", phone: "08039876543", cat: "Logistics", website: "https://apifylogistics.com.ng", cms: "wordpress", strat: "plugin" },
    { name: "Apify Tech Hub", phone: "07068765432", cat: "Coworking Space", website: "https://apifytech.ng", cms: "custom", strat: "script_embed" },
    { name: "Apex Dental Clinic Ikeja", phone: "08157654321", cat: "Dental Clinic", website: "", cms: "", strat: "" },
    { name: `${config.businessSignature} Services`, phone: "09086543210", cat: "Consulting", website: "https://apexreach-consulting.com", cms: "wix", strat: "script_embed" },
    { name: "Eko Jollof Diner VI", phone: "08095432109", cat: "Restaurant", website: "", cms: "", strat: "" }
  ];

  const results: Partial<Lead>[] = [];
  const numToGen = Math.min(limit || 5, businesses.length);
  
  for (let i = 0; i < numToGen; i++) {
    const biz = businesses[i];
    const area = areas[i % areas.length];
    const cleanPhone = normalizePhone(biz.phone, 'NG') || biz.phone;
    
    results.push({
      lead_id: `apify_mock_${Date.now()}_${i}`,
      source: 'GOOGLE',
      name: biz.name,
      category: biz.cat,
      address: `${Math.floor(Math.random() * 50) + 1} Adeniran Ogunsanya St, ${area}, Lagos, Nigeria`,
      area: area,
      city: 'Lagos',
      phone_e164: cleanPhone,
      phone_raw: biz.phone,
      email: `${biz.name.toLowerCase().replace(/\s+/g, '')}@outlook.com`,
      website: biz.website,
      rating: Number((4.2 + Math.random() * 0.7).toFixed(1)),
      reviews_count: Math.floor(Math.random() * 50) + 1,
      verified: Math.random() > 0.5,
      listings_count: 1,
      profile_url: `https://apify.com/dataset/${Date.now()}`,
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `${biz.name} is a leading enterprise specializing in ${biz.cat.toLowerCase()} based in ${area}, Lagos.`,
      notes: 'Imported via Apify Local Sandbox.',
      cms_platform: biz.cms || '',
      upgrade_strategy: biz.strat || '',
      cms_confidence: biz.cms ? 'high' : '',
      plugin_suggestions: biz.cms === 'wordpress' ? JSON.stringify(['wp-sms', 'resend-integration']) : '[]',
      embed_note: biz.strat === 'script_embed' ? 'Add script tag to site head.' : ''
    });
  }
  return results;
}

// ============================================================================
// Next.js Route Handler
// ============================================================================

async function performApifyImport(query: string, limit: number) {
  const config = getRuntimeConfig();
  const apifyToken = config.apifyToken;
  let activeToken = apifyToken;
  if (apifyToken && apifyToken.includes(',')) {
    const tokens = apifyToken.split(',').map(t => t.trim()).filter(Boolean);
    if (tokens.length > 0) {
      activeToken = tokens[Math.floor(Math.random() * tokens.length)];
    }
  }
  const datasetId = config.apifyDatasetId;
  
  const isSandbox = !activeToken || activeToken === '' || activeToken === 'local-sandbox' || config.storageMode === 'local';
  
  if (isSandbox) {
    await addLog('Apify Importer', 'START', `Triggering Apify sandbox import for query: "${query}" (limit: ${limit})`);
    
    const mockLeads = generateMockApifyLeads(query, limit);
    const dbResult = await saveLeads(mockLeads);
    
    await addLog('Apify Importer', 'SUCCESS', `Apify sandbox sync complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
    return {
      success: true,
      mode: 'sandbox',
      added: dbResult.added,
      skipped: dbResult.skipped,
      leads: mockLeads
    };
  }
  
  // Fetch live dataset from Apify Platform API
  await addLog('Apify Importer', 'START', `Triggering live Apify dataset import (ID: ${datasetId})`);
  
  const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${activeToken}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Apify REST API returned error status: ${resp.status}`);
  }
  
  const rawItems = await resp.json();
  const newLeads: Partial<Lead>[] = [];
  
  for (const item of rawItems) {
    const rawPhone = item.phone || item.phoneNumber || item.internationalPhoneNumber || '';
    const normPhone = rawPhone ? normalizePhone(rawPhone, 'NG') : null;
    
    newLeads.push({
      lead_id: `apify_${item.id || Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      source: 'GOOGLE',
      name: item.title || item.name || 'Apify Local Business',
      category: item.categoryName || item.category || 'Retail',
      address: item.address || item.street || '',
      area: item.neighborhood || item.city || 'Lagos',
      city: 'Lagos',
      phone_e164: normPhone || '',
      phone_raw: rawPhone,
      email: item.email || '',
      website: item.website || '',
      rating: Number(item.stars || item.rating) || 0,
      reviews_count: Number(item.reviewsCount) || 0,
      verified: !!item.isVerified,
      listings_count: 1,
      profile_url: item.url || '',
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: item.description || `Scraped listing from Apify in ${item.city || 'Lagos'}.`,
      notes: 'Imported via Apify Google Maps Actor.'
    });
  }
  
  const slicedLeads = newLeads.slice(0, limit);
  
  // Perform parallel website enrichment for qualified candidates
  const leadsToEnrich = slicedLeads.filter(lead => lead.website);
  
  if (leadsToEnrich.length > 0) {
    await Promise.allSettled(
      leadsToEnrich.map(async (lead) => {
        try {
          const enriched = await enrichFromWebsite(lead.website || '');
          if (!lead.email && enriched.email) lead.email = enriched.email;
          if (!lead.phone_e164 && enriched.phone) {
            lead.phone_e164 = enriched.phone;
            lead.phone_raw = enriched.phone;
          }
          // Attach website modernization properties
          lead.cms_platform = enriched.cmsPlatform;
          lead.upgrade_strategy = enriched.upgradeStrategy;
          lead.cms_confidence = enriched.cmsConfidence;
          lead.plugin_suggestions = enriched.pluginSuggestions ? JSON.stringify(enriched.pluginSuggestions) : '[]';
          lead.embed_note = enriched.embedNote;
        } catch (_) {}
      })
    );
  }

  const dbResult = await saveLeads(slicedLeads);
  
  await addLog('Apify Importer', 'SUCCESS', `Live Apify import complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
  return {
    success: true,
    mode: 'cloud',
    added: dbResult.added,
    skipped: dbResult.skipped,
    leads: slicedLeads
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || 'Lagos Businesses';
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const result = await performApifyImport(query, limit);
    return NextResponse.json(result);
  } catch (e: any) {
    await addLog('Apify Importer', 'ERROR', `Apify sync failure: ${e.message}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = body.query || 'Lagos Businesses';
    const limit = parseInt(body.limit || '5', 10);
    const result = await performApifyImport(query, limit);
    return NextResponse.json(result);
  } catch (e: any) {
    await addLog('Apify Importer', 'ERROR', `Apify sync failure: ${e.message}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
