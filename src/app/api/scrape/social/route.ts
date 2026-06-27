import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone, extractPhonesFromText } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { extractEmailsFromText, enrichFromWebsite } from '@/lib/leadEnricher';
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
    const { platform = 'instagram', query, limit = 5 } = body;

    const platUpper = platform.toUpperCase() as 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'LINKEDIN';
    if (!['INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'LINKEDIN'].includes(platUpper)) {
      return NextResponse.json({ error: "Invalid platform. Supported: instagram, facebook, tiktok, linkedin." }, { status: 400 });
    }

    if (!query) {
      return NextResponse.json({ error: "Missing required query parameter." }, { status: 400 });
    }

    const isSandbox = query.toLowerCase().includes('sandbox') || query.toLowerCase().includes('mock');
    if (isSandbox) {
      await addLog('Social Scraper', 'START', `Searching ${platUpper} sandbox profiles for query: "${query}"`);
      const mockLeads = getMockSocialLeads(platUpper, query);
      const dbResult = await saveLeads(mockLeads);
      await addLog('Social Scraper', 'SUCCESS', `Scraped ${mockLeads.length} sandbox ${platUpper} accounts. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'sandbox',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: mockLeads
      });
    }

    // LinkedIn requires a dedicated API (RapidAPI, Proxycurl, etc.) — DuckDuckGo scraping returns 403
    if (platUpper === 'LINKEDIN') {
      await addLog('Social Scraper', 'WARN', `LinkedIn scraping requires a dedicated API integration. DuckDuckGo proxy returns 403.`);
      return NextResponse.json({
        error: '⚠️ LinkedIn requires a dedicated API integration (e.g. Proxycurl, RapidAPI). Browser scraping is blocked by LinkedIn. Configure an API key in Settings → Integrations to enable LinkedIn lead scraping.',
        requiresApi: true,
        platform: 'linkedin'
      }, { status: 422 });
    }

    await addLog('Social Scraper', 'START', `Searching ${platUpper} business profiles for query: "${query}"`);

    // Build platform site query targeting e-commerce sellers
    let siteDomain = '';
    if (platUpper === 'INSTAGRAM') siteDomain = 'instagram.com';
    else if (platUpper === 'FACEBOOK') siteDomain = 'facebook.com';
    else if (platUpper === 'TIKTOK') siteDomain = 'tiktok.com';
    else siteDomain = 'linkedin.com/company';

    const searchQuery = `site:${siteDomain} ${query} (ecommerce OR shop OR boutique OR store OR brand OR wholesale OR supplier OR trading)`;
    
    // Add a 2-3 second delay to avoid rate limiting
    await sleep(2000 + Math.random() * 1000);
    
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`;

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
      console.error(`${platUpper} fetch error:`, fetchErr);
      await addLog('Social Scraper', 'ERROR', `Fetch failed: ${fetchErr.message}`);
      return NextResponse.json({
        success: false,
        error: fetchErr.message || `Fetch failed during live ${platUpper} scraping`
      }, { status: 500 });
    }

    const $ = cheerio.load(htmlText);
    const scrapedLeads: Partial<Lead>[] = [];

    $('.web-result').each((idx, elem) => {
      if (scrapedLeads.length >= limit) return false;

      const titleNode = $(elem).find('.result__title a');
      const snippetNode = $(elem).find('.result__snippet');

      const title = titleNode.text() || '';
      const link = titleNode.attr('href') || '';
      const snippet = snippetNode.text() || '';

      // Skip non-profile links
      let isProfileUrl = false;
      if (platUpper === 'INSTAGRAM') {
        isProfileUrl = /\/instagram\.com\/[a-zA-Z0-9_\.]+\/?$/.test(link) || (link.includes('instagram.com') && !link.includes('/p/') && !link.includes('/explore/'));
      } else if (platUpper === 'FACEBOOK') {
        isProfileUrl = link.includes('facebook.com') && !link.includes('/sharer') && !link.includes('/pages/');
      } else if (platUpper === 'TIKTOK') {
        isProfileUrl = link.includes('tiktok.com') && link.includes('/@');
      } else {
        isProfileUrl = link.includes('linkedin.com/company/') || link.includes('linkedin.com/in/');
      }

      if (!isProfileUrl) return;

      // Extract Name and Handle
      let name = title.split(' • ')[0] || title;
      name = name.split(' - ')[0] || name;
      name = name.split(' | ')[0] || name;
      name = name.replace('Instagram photos and videos', '').trim();
      name = name.replace('Facebook', '').trim();
      name = name.replace('| TikTok', '').trim();
      name = name.replace('| LinkedIn', '').trim();

      // Extract phone number from snippet if available
      const phones = extractPhonesFromText(snippet);
      const emails = extractEmailsFromText(snippet);

      // Accept leads with phone OR email (don't require both)
      const hasPhone = phones && phones.length > 0;
      const hasEmail = emails.length > 0;
      if (!hasPhone && !hasEmail) return;

      const cleanPhone = hasPhone ? phones[0] : null;
      const email = hasEmail ? emails[0] : '';

      const hash = crypto.createHash('sha256').update(link).digest('hex').substring(0, 16);
      scrapedLeads.push({
        lead_id: `social_${platUpper.toLowerCase()}_${hash}`,
        source: platUpper,
        name: name || `E-commerce ${platUpper}`,
        category: 'E-Commerce Business',
        address: 'Lagos, Nigeria',
        area: 'Lagos',
        city: 'Lagos',
        phone_e164: cleanPhone || '',
        phone_raw: cleanPhone || '',
        email,
        website: '',
        rating: 4.5,
        reviews_count: 50,
        verified: false,
        listings_count: 1,
        profile_url: (platUpper as string) === 'LINKEDIN' ? `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(name)}` : link,
        source_query_or_seed: query,
        collected_at: new Date().toISOString(),
        status: 'NEW',
        last_contacted_at: '',
        duplicate_of_lead_id: '',
        business_summary: snippet.trim() || `${name} social commerce seller listing.`,
        notes: `Social ${platUpper} page: ${link}. Email: ${email || 'none'}.`
      });
    });

    // ── Website enrichment: if any lead has a website, fetch for more contacts
    const toEnrich = scrapedLeads.filter(l => l.website && (!l.email || !l.phone_e164));
    if (toEnrich.length > 0) {
      await Promise.allSettled(
        toEnrich.map(async (lead) => {
          const enriched = await enrichFromWebsite(lead.website || '');
          if (!lead.email && enriched.email) lead.email = enriched.email;
          if (!lead.phone_e164 && enriched.phone) {
            lead.phone_e164 = enriched.phone;
            lead.phone_raw = enriched.phone;
          }
        })
      );
    }

    if (scrapedLeads.length > 0) {
      const dbResult = await saveLeads(scrapedLeads);
      await addLog('Social Scraper', 'SUCCESS', `Scraped ${scrapedLeads.length} ${platUpper} accounts. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'live',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: scrapedLeads
      });
    } else {
      await addLog('Social Scraper', 'INFO', `Search completed but found 0 leads matching criteria.`);
      return NextResponse.json({
        success: true,
        mode: 'live',
        added: 0,
        skipped: 0,
        leads: []
      });
    }
  } catch (e: any) {
    console.error("Social general error:", e);
    await addLog('Social Scraper', 'ERROR', `Scraper error: ${e.message}`);
    return NextResponse.json({
      success: false,
      error: e.message || 'Internal error during live social scraping'
    }, { status: 500 });
  }
}

function getMockSocialLeads(platform: string, query: string): Partial<Lead>[] {
  const platUpper = platform.toUpperCase();
  return [
    {
      lead_id: `mock_social_${platUpper.toLowerCase()}_1`,
      source: platUpper as any,
      name: `Lagos ${platUpper} Merchant`,
      category: 'E-Commerce Business',
      address: 'Lagos, Nigeria',
      area: 'Lagos',
      city: 'Lagos',
      phone_e164: '+2348055566677',
      phone_raw: '08055566677',
      email: `contact@lagos${platUpper.toLowerCase()}merchant.com`,
      website: `https://lagos${platUpper.toLowerCase()}merchant.com`,
      rating: 4.5,
      reviews_count: 50,
      verified: false,
      listings_count: 1,
      profile_url: `https://www.${platUpper.toLowerCase()}.com/lagos_merchant`,
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `Lagos ${platUpper} Merchant specializes in e-commerce products. Reach out to them.`,
      notes: 'Sandbox mode lead.'
    },
    {
      lead_id: `mock_social_${platUpper.toLowerCase()}_2`,
      source: platUpper as any,
      name: `Ikeja ${platUpper} Brand`,
      category: 'E-Commerce Business',
      address: 'Ikeja, Lagos, Nigeria',
      area: 'Ikeja',
      city: 'Lagos',
      phone_e164: '+2348066677788',
      phone_raw: '08066677788',
      email: '',
      website: '',
      rating: 4.5,
      reviews_count: 50,
      verified: false,
      listings_count: 1,
      profile_url: `https://www.${platUpper.toLowerCase()}.com/ikeja_brand`,
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `Ikeja ${platUpper} Brand offers premium wholesale products.`,
      notes: 'Sandbox mode lead.'
    }
  ];
}
