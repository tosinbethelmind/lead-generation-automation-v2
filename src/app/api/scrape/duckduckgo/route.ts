import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone, extractPhonesFromText } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { extractEmailsFromText, enrichLeadContacts } from '@/lib/leadEnricher';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { handleQueueDelegation } from '@/app/api/scrape/queue';

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

    const queueResp = await handleQueueDelegation(req, 'duckduckgo', body);
    if (queueResp) return queueResp;

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
    let lastError: any = null;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
            throw new Error("⚠️ DuckDuckGo has blocked/rate-limited this request. Try again later.");
          }
          throw new Error(`HTTP Error: ${resp.status} - ${resp.statusText}`);
        }

        htmlText = await resp.text();
        lastError = null;
        break; // Success!
      } catch (err: any) {
        lastError = err;
        console.warn(`[DuckDuckGo Scraper] Search attempt ${attempt} failed: ${err.message}`);
        if (attempt < maxRetries) {
          const delay = 3000 + attempt * 2000;
          console.log(`[DuckDuckGo Scraper] Sleeping ${delay}ms before retry...`);
          await sleep(delay);
        }
      }
    }

    if (lastError) {
      console.error("DDG fetch error after all attempts:", lastError);
      await addLog('DuckDuckGo Scraper', 'ERROR', `Fetch failed after ${maxRetries} retries: ${lastError.message}`);
      return NextResponse.json({
        success: false,
        error: lastError.message || 'Fetch failed during live DuckDuckGo scraping'
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
      const rawLink = titleNode.attr('href') || '';
      const link = cleanDdgUrl(rawLink);
      const snippet = snippetNode.text() || '';

      // Clean title from common suffixes
      let name = title.split(' - ')[0]?.trim() || title;
      name = name.split(' | ')[0]?.trim() || name;

      // Extract phone from title+snippet text
      const combinedText = `${name} ${snippet}`;
      const phones = extractPhonesFromText(combinedText);

      // Extract email from the snippet text
      const emails = extractEmailsFromText(combinedText);

      // Determine if this result is a directory/social site
      const isDirectorySite = /facebook|instagram|jiji|linkedin|youtube|twitter|tiktok|vconnect|finelib|yellowpages/.test(link);
      const extractedWebsite = !isDirectorySite ? link : '';

      // We want leads with a phone OR an email OR a website — not empty contacts
      const hasPhone = phones.length > 0;
      const hasEmail = emails.length > 0;
      if (!hasPhone && !hasEmail && !extractedWebsite) return; // skip results with no contact info and no website

      let cleanPhone = hasPhone ? phones[0] : null;
      let email = hasEmail ? emails[0] : '';

      // If a direct business website found and we're still missing contacts,
      // fetch the website to try to get email/phone from it.
      // (async inside .each is not awaitable, so we collect and enrich after)
      const hash = crypto.createHash('sha256').update(link).digest('hex').substring(0, 16);
      scrapedLeads.push({
        lead_id: `ddg_${hash}`,
        source: 'DUCKDUCKGO',
        name,
        category: query.split('in')[0]?.trim() || 'Business',
        address: 'Lagos, Nigeria',
        area: 'Lagos',
        city: 'Lagos',
        phone_e164: cleanPhone || '',
        phone_raw: cleanPhone || '',
        email,
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
          ? `Directory/social listing: ${link}. Email: ${email || 'none'}.`
          : `Business website result: ${link}. Email: ${email || 'none'}.`
      });
    });

    // ── Website/Search enrichment: fetch direct business websites and fall back to searches ─
    const toEnrich = scrapedLeads.filter(l => !l.email || !l.phone_e164);
    if (toEnrich.length > 0) {
      await Promise.allSettled(
        toEnrich.map(async (lead) => {
          try {
            const enriched = await enrichLeadContacts(lead);
            if (enriched.email) lead.email = enriched.email;
            if (enriched.phone) {
              lead.phone_e164 = enriched.phone;
              lead.phone_raw = enriched.phone;
            }
            if (Object.keys(enriched.socials).length > 0) {
              lead.social_links = JSON.stringify(enriched.socials);
            }
            if (enriched.enriched) {
              lead.notes = (lead.notes || '') + ` | Enriched: phone=${enriched.phone || 'none'}, email=${enriched.email || 'none'}`;
            }
          } catch (err: any) {
            console.error(`Failed to enrich contacts for ${lead.name}:`, err.message);
          }
        })
      );
    }

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

function cleanDdgUrl(urlStr: string): string {
  if (!urlStr) return '';
  if (urlStr.includes('uddg=')) {
    try {
      const parts = urlStr.split('uddg=');
      if (parts[1]) {
        const encodedUrl = parts[1].split('&')[0];
        const decoded = decodeURIComponent(encodedUrl);
        if (decoded.startsWith('http')) {
          return decoded;
        }
      }
    } catch (e) {
      console.error('Error cleaning DDG URL:', e);
    }
  }
  if (urlStr.startsWith('//')) {
    return 'https:' + urlStr;
  }
  return urlStr;
}

