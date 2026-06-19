import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone, extractPhonesFromText } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import * as cheerio from 'cheerio';

// ============================================================================
// Sandbox Mock Lead Generator
// ============================================================================

function generateMockDDGLeads(query: string, limit: number): Partial<Lead>[] {
  const businesses = [
    { name: "Surulere Dental Hub", phone: "08055667788", category: "Dental Clinic", area: "Surulere", desc: "Premium dental implants, whitening, and cleaning services in Surulere." },
    { name: "Lekki Autotech Solutions", phone: "09011223344", category: "Car Repair", area: "Lekki", desc: "Computer diagnostics, wheel alignment, and engine overhaul." },
    { name: "Ikeja Beauty Palace", phone: "08122334455", category: "Salon", area: "Ikeja", desc: "Expert hair styling, nails, pedicure, and bridal makeup." },
    { name: "Yaba Gourmet Bakery", phone: "07088990011", category: "Bakery", area: "Yaba", desc: "Fresh bread, customized birthday cakes, and pastries." },
    { name: "Victoria Island Fashion House", phone: "09155667788", category: "Boutique", area: "Victoria Island", desc: "African prints, ready-to-wear dresses, and bespoke men's suits." }
  ];

  const results: Partial<Lead>[] = [];
  const count = limit || 10;

  for (let i = 0; i < count; i++) {
    const template = businesses[i % businesses.length];
    const name = count > businesses.length ? `${template.name} #${Math.floor(i / businesses.length) + 1}` : template.name;
    const phoneNum = template.phone.substring(0, template.phone.length - 2) + String(i).padStart(2, '0');
    const cleanPhone = normalizePhone(phoneNum, 'NG') || phoneNum;

    results.push({
      lead_id: `mock_ddg_${Date.now()}_${i}`,
      source: 'DUCKDUCKGO',
      name: name,
      category: template.category,
      address: `${template.area}, Lagos, Nigeria`,
      area: template.area,
      city: 'Lagos',
      phone_e164: cleanPhone,
      phone_raw: phoneNum,
      email: '',
      website: '', // Qualify criteria
      rating: Number((4.1 + Math.random() * 0.8).toFixed(1)),
      reviews_count: Math.floor(Math.random() * 25) + 1,
      verified: true,
      listings_count: 1,
      profile_url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}&index=${i}`,
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `${name} is a local business providing ${template.category.toLowerCase()} services in ${template.area}.`,
      notes: 'Imported via DuckDuckGo Scraper Sandbox.'
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
      return NextResponse.json({ error: "Missing required query parameter." }, { status: 400 });
    }

    const config = getRuntimeConfig();
    const isSandbox = config.storageMode === 'local' || query.includes('sandbox') || query.includes('mock');

    if (isSandbox) {
      await addLog('DuckDuckGo Scraper', 'START', `Launching DuckDuckGo Sandbox for query: "${query}" (limit: ${limit})`);
      const mockLeads = generateMockDDGLeads(query, limit);
      const dbResult = await saveLeads(mockLeads);
      await addLog('DuckDuckGo Scraper', 'SUCCESS', `Sandbox simulation complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'sandbox',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: mockLeads
      });
    }

    await addLog('DuckDuckGo Scraper', 'START', `Starting DuckDuckGo search crawl for query: "${query}"`);

    // Fetch the html version of DuckDuckGo results directly (no JavaScript required!)
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    let htmlText = '';
    try {
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      if (!resp.ok) {
        throw new Error(`HTTP Error: ${resp.status} - ${resp.statusText}`);
      }

      htmlText = await resp.text();
    } catch (fetchErr: any) {
      console.error("DDG fetch error:", fetchErr);
      await addLog('DuckDuckGo Scraper', 'WARN', `Fetch failed: ${fetchErr.message}. Falling back to sandbox.`);
      
      const mockLeads = generateMockDDGLeads(query, limit);
      const dbResult = await saveLeads(mockLeads);
      return NextResponse.json({
        success: true,
        mode: 'sandbox_fallback',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: mockLeads
      });
    }

    // Parse DDG HTML output
    const $ = cheerio.load(htmlText);
    const scrapedLeads: Partial<Lead>[] = [];

    $('.web-result').each((idx, elem) => {
      if (scrapedLeads.length >= limit) return false;

      const titleNode = $(elem).find('.result__title a');
      const snippetNode = $(elem).find('.result__snippet');

      const title = titleNode.text() || '';
      const link = titleNode.attr('href') || '';
      const snippet = snippetNode.text() || '';

      // Clean title from common suffixes
      let name = title.split(' - ')[0]?.trim() || title;
      name = name.split(' | ')[0]?.trim() || name;

      // Extract phone number from title or snippet
      const combinedText = `${name} ${snippet}`;
      const phones = extractPhonesFromText(combinedText);
      
      if (phones && phones.length > 0) {
        const cleanPhone = phones[0];

        // Ensure we don't save duplicates or leads that obviously have website domains
        const hasOwnWebsite = !/facebook|instagram|jiji|linkedin|youtube|twitter|tiktok|vconnect|finelib|yellowpages/.test(link);

        if (!hasOwnWebsite) {
          scrapedLeads.push({
            lead_id: `ddg_${Date.now()}_${idx}_${Math.floor(Math.random() * 100)}`,
            source: 'DUCKDUCKGO',
            name: name,
            category: query.split('in')[0]?.trim() || 'Business',
            address: 'Lagos, Nigeria',
            area: 'Lagos',
            city: 'Lagos',
            phone_e164: cleanPhone,
            phone_raw: cleanPhone,
            email: '',
            website: '', // Empty because it's a directory link
            rating: 4.0, // Default for search listings
            reviews_count: 1,
            verified: false,
            listings_count: 1,
            profile_url: link,
            source_query_or_seed: query,
            collected_at: new Date().toISOString(),
            status: 'NEW',
            last_contacted_at: '',
            duplicate_of_lead_id: '',
            business_summary: snippet.trim() || `${name} details extracted from DuckDuckGo results.`,
            notes: `Extracted from search result pointing to listing/social directory: ${link}`
          });
        }
      }
    });

    if (scrapedLeads.length > 0) {
      const dbResult = await saveLeads(scrapedLeads);
      await addLog('DuckDuckGo Scraper', 'SUCCESS', `Crawl complete. Found ${scrapedLeads.length} leads. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'live',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: scrapedLeads
      });
    } else {
      await addLog('DuckDuckGo Scraper', 'INFO', `Crawl completed but found 0 leads matching criteria.`);
      return NextResponse.json({
        success: true,
        mode: 'live',
        added: 0,
        skipped: 0,
        leads: []
      });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
