import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone, extractPhonesFromText } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

// Configure execution timeout for Vercel serverless execution
export const maxDuration = 60;

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, limit = 5 } = body;

    if (!query) {
      return NextResponse.json({ error: "Missing required query parameter." }, { status: 400 });
    }

    const isSandbox = query.toLowerCase().includes('sandbox') || query.toLowerCase().includes('mock');
    if (isSandbox) {
      await addLog('DuckDuckGo Scraper', 'START', `Starting DuckDuckGo sandbox run for query: "${query}"`);
      const mockLeads = getMockDuckDuckGoLeads(query);
      const dbResult = await saveLeads(mockLeads);
      await addLog('DuckDuckGo Scraper', 'SUCCESS', `Sandbox complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'sandbox',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: mockLeads
      });
    }

    await addLog('DuckDuckGo Scraper', 'START', `Starting DuckDuckGo search crawl for query: "${query}"`);

    // Add a 2-3 second delay to avoid rate limiting
    await sleep(2000 + Math.random() * 1000);

    // Fetch the html version of DuckDuckGo results directly (no JavaScript required!)
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    let htmlText = '';
    try {
      const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
      const resp = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
          'Referer': 'https://duckduckgo.com/',
          'Cache-Control': 'max-age=0'
        }
      });

      if (!resp.ok) {
        if (resp.status === 403 || resp.status === 429) {
          throw new Error("⚠️ This provider is currently blocked by the platform. Try again later or use an alternative.");
        }
        throw new Error(`HTTP Error: ${resp.status} - ${resp.statusText}`);
      }

      htmlText = await resp.text();
    } catch (fetchErr: any) {
      console.error("DDG fetch error:", fetchErr);
      await addLog('DuckDuckGo Scraper', 'ERROR', `Fetch failed: ${fetchErr.message}`);
      return NextResponse.json({
        success: false,
        error: fetchErr.message || 'Fetch failed during live DuckDuckGo scraping'
      }, { status: 500 });
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

        // Detect whether this is a direct business site or a directory/social listing
        const isDirectorySite = /facebook|instagram|jiji|linkedin|youtube|twitter|tiktok|vconnect|finelib|yellowpages/.test(link);
        const extractedWebsite = !isDirectorySite ? link : '';

        // Save ALL leads — direct business sites AND directory listings.
        // Pitch engine will use extracted website to suggest upgrades/automations.
        const hash = crypto.createHash('sha256').update(link).digest('hex').substring(0, 16);
        scrapedLeads.push({
          lead_id: `ddg_${hash}`,
          source: 'DUCKDUCKGO',
          name: name,
          category: query.split('in')[0]?.trim() || 'Business',
          address: 'Lagos, Nigeria',
          area: 'Lagos',
          city: 'Lagos',
          phone_e164: cleanPhone,
          phone_raw: cleanPhone,
          email: '',
          website: extractedWebsite,
          rating: 4.0,
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
          notes: isDirectorySite
            ? `Extracted from directory/social listing: ${link}`
            : `Extracted from business website result: ${link}`
        });
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
    console.error("DDG general error:", e);
    await addLog('DuckDuckGo Scraper', 'ERROR', `Scraper error: ${e.message}`);
    return NextResponse.json({
      success: false,
      error: e.message || 'Internal error during live DuckDuckGo scraping'
    }, { status: 500 });
  }
}

function getMockDuckDuckGoLeads(query: string): Partial<Lead>[] {
  return [
    {
      lead_id: `mock_ddg_1`,
      source: 'DUCKDUCKGO',
      name: 'Lagos Medical Center',
      category: 'dentist',
      address: 'Lagos, Nigeria',
      area: 'Lagos',
      city: 'Lagos',
      phone_e164: '+2348033344455',
      phone_raw: '08033344455',
      email: '',
      website: 'https://lagosmedicalcenter.com',
      rating: 4.0,
      reviews_count: 1,
      verified: false,
      listings_count: 1,
      profile_url: 'https://lagosmedicalcenter.com',
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: 'Lagos Medical Center provides quality healthcare services in Lagos. Contact them at 08033344455.',
      notes: 'Sandbox mode lead.'
    },
    {
      lead_id: `mock_ddg_2`,
      source: 'DUCKDUCKGO',
      name: 'Ikeja Dental Clinic',
      category: 'dentist',
      address: 'Lagos, Nigeria',
      area: 'Lagos',
      city: 'Lagos',
      phone_e164: '+2348044455566',
      phone_raw: '08044455566',
      email: '',
      website: '',
      rating: 4.0,
      reviews_count: 1,
      verified: false,
      listings_count: 1,
      profile_url: 'https://www.facebook.com/ikejadentalclinic',
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: 'Ikeja Dental Clinic is on Facebook. Reach out to them on Facebook.',
      notes: 'Sandbox mode lead.'
    }
  ];
}
