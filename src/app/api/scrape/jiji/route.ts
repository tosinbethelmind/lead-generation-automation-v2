import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createScrapeJob, updateScrapeJobStatus } from '@/app/api/scrape/queue';
import { saveLeads, addLog, normalizePhone, Lead } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { extractEmailsFromText, enrichFromWebsite } from '@/lib/leadEnricher';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

// Configure execution timeout for Vercel serverless execution
export const maxDuration = 60;

/**
 * POST /api/scrape/jiji
 * Body: { url: string, options?: any, userId?: string }
 */
export async function POST(req: NextRequest) {
  let job: any = null;
  
  try {
    const body = await req.json();
    const { url, options = {}, userId } = body;
    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    const config = getRuntimeConfig();

    const isSandbox = (url && (url.toLowerCase().includes('sandbox') || url.toLowerCase().includes('mock'))) || 
                      (body.query && (body.query.toLowerCase().includes('sandbox') || body.query.toLowerCase().includes('mock'))) ||
                      (options.query && (options.query.toLowerCase().includes('sandbox') || options.query.toLowerCase().includes('mock')));

    if (isSandbox) {
      await addLog('Jiji Scraper', 'START', `Launching Jiji sandbox crawl for URL/Query: "${url}"`);
      const mockLeads = getMockJijiLeads(url);
      
      let jobId = 'mock_job';
      try {
        job = await createScrapeJob('jiji', { url, options }, userId);
        if (job) {
          jobId = job.id;
          await updateScrapeJobStatus(job.id, 'running');
        }
      } catch (err) {
        console.warn('Queue job creation failed in sandbox mode:', err);
      }

      let added = 0;
      let skipped = 0;
      try {
        const dbResult = await saveLeads(mockLeads);
        added = dbResult.added;
        skipped = dbResult.skipped;
      } catch (saveErr) {
        console.warn('Failed to save mock leads to database:', saveErr);
      }
      
      if (job) {
        try {
          await updateScrapeJobStatus(job.id, 'completed', { result: { leads: mockLeads, added, skipped } });
        } catch (err) {
          console.warn('Queue job update failed in sandbox mode:', err);
        }
      }
      
      await addLog('Jiji Scraper', 'SUCCESS', `Sandbox complete. Added: ${added}, Skipped: ${skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'sandbox',
        jobId,
        status: 'completed',
        added,
        skipped,
        leads: mockLeads
      }, { status: 200 });
    }

    // Create a job entry in database
    job = await createScrapeJob('jiji', { url, options }, userId);

    // Live scraping using HTTP Fetch + Cheerio
    await updateScrapeJobStatus(job.id, 'running');
    await addLog('Jiji Scraper', 'START', `Launching Jiji high-performance Cheerio crawl for URL: "${url}"`);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Referer': 'https://jiji.ng/'
    };

    // 1. Resolve URL format
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http')) {
      targetUrl = `https://jiji.ng/lagos/search?query=${encodeURIComponent(targetUrl)}`;
    }

    let responseHtml = '';
    try {
      await addLog('Jiji Scraper', 'INFO', `Fetching search page: ${targetUrl}`);
      const res = await fetch(targetUrl, { headers });
      
      // If we get a 404, try search query fallback
      if (res.status === 404 && !targetUrl.includes('/search')) {
        await addLog('Jiji Scraper', 'WARN', `Category page returned 404. Falling back to search query...`);
        const slug = url.split('/').pop() || '';
        const fallbackUrl = `https://jiji.ng/lagos/search?query=${encodeURIComponent(slug.replace(/-/g, ' '))}`;
        const fbRes = await fetch(fallbackUrl, { headers });
        if (fbRes.ok) {
          responseHtml = await fbRes.text();
        } else {
          throw new Error(`Fallback search page returned status ${fbRes.status}`);
        }
      } else if (res.ok) {
        responseHtml = await res.text();
      } else {
        throw new Error(`Jiji page returned status ${res.status}`);
      }
    } catch (fetchErr: any) {
      console.error('Fetch error:', fetchErr);
      throw fetchErr;
    }

    const $ = cheerio.load(responseHtml);
    const cardData: any[] = [];
    
    $('.b-list-advert-base').each((i, el) => {
      const href = $(el).attr('href') || $(el).find('a').attr('href') || '';
      const cardTitle = $(el).find('.b-advert-title-inner, .qa-advert-list-item-title, .qa-advert-title span').text().trim();
      const price = $(el).find('.b-list-advert__price, .qa-advert-list-item-price, .b-list-advert-base__item-price').text().trim();
      const area = $(el).find('.b-list-advert__region, .qa-advert-list-item-region, .b-list-advert-base__region').text().trim().split(',')[0] || '';
      
      let absoluteUrl = href;
      if (href && !href.startsWith('http')) {
        absoluteUrl = 'https://jiji.ng' + (href.startsWith('/') ? '' : '/') + href;
      }
      
      if (cardTitle && absoluteUrl) {
        cardData.push({ title: cardTitle, price, area, url: absoluteUrl });
      }
    });

    const limit = Number(options.limit) || 5;
    const targets = cardData.slice(0, limit);
    const scrapedLeads: Partial<Lead>[] = [];

    await addLog('Jiji Scraper', 'INFO', `Found ${cardData.length} items. Scraping details for top ${targets.length} listings...`);

    // 2. Scrape details page for phone number and seller info
    for (const target of targets) {
      try {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000)); // Be polite
        const detailRes = await fetch(target.url, { headers });
        if (!detailRes.ok) {
          await addLog('Jiji Scraper', 'WARN', `Failed to fetch detail page ${target.url}: status ${detailRes.status}`);
          continue;
        }
        
        const detailHtml = await detailRes.text();
        const $detail = cheerio.load(detailHtml);
        
        // Extract description
        const description = $detail('.qa-description-text, .qa-advert-description-text, .b-advert-description-text').text().trim();
        
        // Extract seller name
        let sellerName = $detail('.b-seller-block__name').text().trim();
        if (!sellerName) {
          const pageTitle = $detail('title').text();
          if (pageTitle.includes(' - ')) {
            const rightPart = pageTitle.split(' - ')[1] || '';
            if (rightPart.includes(' ▷ Price:')) {
              sellerName = rightPart.split(' ▷ Price:')[0]?.trim() || '';
            } else if (rightPart.includes(' on Jiji.ng')) {
              sellerName = rightPart.split(' on Jiji.ng')[0]?.trim() || '';
            }
          }
        }
        if (!sellerName) {
          sellerName = 'Jiji Seller';
        }

        // Extract phone number from different sources
        let phoneVal = '';
        
        // Method A: Check for tel links
        const telLink = $detail('a[href^="tel:"]').attr('href');
        if (telLink) {
          phoneVal = telLink.replace('tel:', '').trim();
        }
        
        // Method B: Match wa.me URL
        if (!phoneVal) {
          const waMatches = detailHtml.match(/wa\.me\/(\d+)/);
          if (waMatches && waMatches[1]) {
            phoneVal = waMatches[1];
          }
        }
        
        // Method C: Regex scan on script tags and HTML body
        if (!phoneVal) {
          const phoneRegex = /(?:234\d{10}|0[789]\d{9})/g;
          
          // Scan scripts
          $detail('script').each((i, el) => {
            const scriptText = $detail(el).text();
            if (scriptText.includes('phone') || scriptText.includes('advert')) {
              const matches = scriptText.match(phoneRegex);
              if (matches && matches[0]) {
                phoneVal = matches[0];
                return false; // break loop
              }
            }
          });
          
          // Scan entire body if still not found
          if (!phoneVal) {
            const matches = detailHtml.match(phoneRegex);
            if (matches && matches[0]) {
              phoneVal = matches[0];
            }
          }
        }

        let finalPhone = phoneVal ? (normalizePhone(phoneVal, 'NG') || phoneVal) : '';
        
        const emails = extractEmailsFromText(description);
        let email = emails[0] || '';

        const websiteRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,6})(?:\/[^\s]*)?/i;
        const webMatch = description.match(websiteRegex);
        let website = '';
        if (webMatch) {
          const matchedDomain = webMatch[1].toLowerCase();
          if (!matchedDomain.includes('jiji')) {
            website = webMatch[0];
            if (!website.startsWith('http')) {
              website = 'http://' + website;
            }
          }
        }

        if (website && (!email || !finalPhone)) {
          try {
            const enriched = await enrichFromWebsite(website);
            if (!email && enriched.email) email = enriched.email;
            if (!finalPhone && enriched.phone) {
              finalPhone = enriched.phone;
              phoneVal = enriched.phone;
            }
          } catch (enrichErr) {
            console.warn(`Failed to enrich Jiji lead website ${website}:`, enrichErr);
          }
        }

        // Skip leads with no phone number
        if (!finalPhone) {
          await addLog('Jiji Scraper', 'INFO', `Skipped listing "${target.title}" - no phone number found.`);
          continue;
        }

        const category = target.url.split('/')[4]?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Solar Seller';
        const hash = crypto.createHash('sha256').update(target.url).digest('hex').substring(0, 16);

        scrapedLeads.push({
          lead_id: `jiji_${hash}`,
          source: 'JIJI',
          name: sellerName,
          category: category,
          address: target.area ? `${target.area}, Lagos, Nigeria` : 'Lagos, Nigeria',
          area: target.area || 'Lagos',
          city: 'Lagos',
          phone_e164: finalPhone,
          phone_raw: phoneVal,
          email: email || '',
          website: website || '', 
          rating: 4.0, 
          reviews_count: 1,
          verified: true,
          listings_count: 1,
          profile_url: target.url,
          source_query_or_seed: url,
          collected_at: new Date().toISOString(),
          status: 'NEW',
          last_contacted_at: '',
          duplicate_of_lead_id: '',
          business_summary: description || `${target.title} listed on Jiji in ${target.area}.`,
          notes: 'Scraped using high-performance Cheerio crawler.'
        });

      } catch (itemErr: any) {
        console.error(`Error scraping detail page ${target.url}:`, itemErr);
      }
    }

    // 3. Save leads to database
    if (scrapedLeads.length > 0) {
      const dbResult = await saveLeads(scrapedLeads);
      await updateScrapeJobStatus(job.id, 'completed', { result: { leads: scrapedLeads, added: dbResult.added, skipped: dbResult.skipped } });
      await addLog('Jiji Scraper', 'SUCCESS', `Crawl complete. Scraped: ${scrapedLeads.length}, Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({ success: true, mode: 'live', jobId: job.id, status: 'completed', added: dbResult.added, skipped: dbResult.skipped, leads: scrapedLeads }, { status: 200 });
    } else {
      await updateScrapeJobStatus(job.id, 'completed', { result: { leads: [], added: 0, skipped: 0 } });
      await addLog('Jiji Scraper', 'INFO', `Crawl completed but found 0 valid qualified leads (without phone numbers).`);
      return NextResponse.json({ success: true, mode: 'live', jobId: job.id, status: 'completed', added: 0, skipped: 0, leads: [] }, { status: 200 });
    }

  } catch (err: any) {
    console.error('Jiji scrape error:', err);
    try {
      await addLog('Jiji Scraper', 'ERROR', `Scraper error: ${err.message}`);
    } catch (logErr) {}
    
    if (job) {
      try {
        await updateScrapeJobStatus(job.id, 'failed', { error_message: err.message || 'Internal error' });
      } catch (jobErr) {}
    }

    return NextResponse.json({
      success: false,
      error: err.message || 'Internal error during live Jiji scraping',
      jobId: job ? job.id : 'unknown'
    }, { status: 500 });
  }
}

function getMockJijiLeads(urlOrQuery: string): Partial<Lead>[] {
  return [
    {
      lead_id: `mock_jiji_1`,
      source: 'JIJI',
      name: 'Chinedu Dental Supplies',
      category: 'dentist',
      address: 'Ikeja, Lagos, Nigeria',
      area: 'Ikeja',
      city: 'Lagos',
      phone_e164: '+2348100223344',
      phone_raw: '08100223344',
      email: '',
      website: '',
      rating: 4.0,
      reviews_count: 1,
      verified: true,
      listings_count: 1,
      profile_url: 'https://jiji.ng/lagos/mock_jiji_1',
      source_query_or_seed: urlOrQuery,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: 'Chinedu Dental Supplies listed on Jiji. Quality equipment.',
      notes: 'Sandbox mode lead.'
    },
    {
      lead_id: `mock_jiji_2`,
      source: 'JIJI',
      name: 'Amina Dental Practice',
      category: 'dentist',
      address: 'Surulere, Lagos, Nigeria',
      area: 'Surulere',
      city: 'Lagos',
      phone_e164: '+2348111222333',
      phone_raw: '08111222333',
      email: '',
      website: '',
      rating: 4.0,
      reviews_count: 1,
      verified: true,
      listings_count: 1,
      profile_url: 'https://jiji.ng/lagos/mock_jiji_2',
      source_query_or_seed: urlOrQuery,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: 'Amina Dental Practice listed on Jiji. Expert services.',
      notes: 'Sandbox mode lead.'
    }
  ];
}
