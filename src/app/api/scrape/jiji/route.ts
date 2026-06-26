import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createScrapeJob, updateScrapeJobStatus } from '@/app/api/scrape/queue';
import { saveLeads, addLog, normalizePhone, Lead } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import * as cheerio from 'cheerio';

// Configure execution timeout for Vercel serverless execution
export const maxDuration = 60;

/**
 * POST /api/scrape/jiji
 * Body: { url: string, options?: any, userId?: string }
 */
export async function POST(req: NextRequest) {
  let job: any = null;
  
  try {
    const { url, options = {}, userId } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    const config = getRuntimeConfig();

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
        await addLog('Jiji Scraper', 'WARNING', `Category page returned 404. Falling back to search query...`);
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
      await addLog('Jiji Scraper', 'ERROR', `HTTP fetch failed: ${fetchErr.message}`);
      await updateScrapeJobStatus(job.id, 'failed', { error_message: `HTTP fetch failed: ${fetchErr.message}` });
      return NextResponse.json({ success: false, error: fetchErr.message }, { status: 500 });
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
          await addLog('Jiji Scraper', 'WARNING', `Failed to fetch detail page ${target.url}: status ${detailRes.status}`);
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

        const cleanPhone = phoneVal ? (normalizePhone(phoneVal, 'NG') || phoneVal) : '';
        
        // Skip leads with no phone number
        if (!cleanPhone) {
          await addLog('Jiji Scraper', 'INFO', `Skipped listing "${target.title}" - no phone number found.`);
          continue;
        }

        const category = target.url.split('/')[4]?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Solar Seller';

        scrapedLeads.push({
          lead_id: `jiji_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          source: 'JIJI',
          name: sellerName,
          category: category,
          address: target.area ? `${target.area}, Lagos, Nigeria` : 'Lagos, Nigeria',
          area: target.area || 'Lagos',
          city: 'Lagos',
          phone_e164: cleanPhone,
          phone_raw: phoneVal,
          email: '',
          website: '', 
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
      return NextResponse.json({ jobId: job.id, status: 'completed', added: dbResult.added, skipped: dbResult.skipped, leads: scrapedLeads }, { status: 200 });
    } else {
      await updateScrapeJobStatus(job.id, 'completed', { result: { leads: [], added: 0, skipped: 0 } });
      await addLog('Jiji Scraper', 'INFO', `Crawl completed but found 0 valid qualified leads (without phone numbers).`);
      return NextResponse.json({ jobId: job.id, status: 'completed', added: 0, skipped: 0, leads: [] }, { status: 200 });
    }

  } catch (err: any) {
    console.error('Jiji scrape error:', err);
    if (job) {
      await updateScrapeJobStatus(job.id, 'failed', { error_message: err.message || 'Internal error' });
    }
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
