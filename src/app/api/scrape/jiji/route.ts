import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createScrapeJob, updateScrapeJobStatus, handleQueueDelegation } from '@/app/api/scrape/queue';
import { saveLeads, addLog, normalizePhone, extractPhonesFromText, Lead } from '@/lib/googleSheets';
import { extractEmailsFromText, enrichLeadContacts } from '@/lib/leadEnricher';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { proxyFetch } from '@/lib/proxyRotator';
import { buildStealthHeaders, humanDelay } from '@/lib/scraperHeaders';

// Configure execution timeout for Vercel serverless execution
export const maxDuration = 60;

/**
 * POST /api/scrape/jiji
 * Body: { url: string, options?: any, userId?: string }
 *
 * Strategy: HTTP fetch + Nuxt __NUXT_DATA__ JSON blob parsing.
 * Jiji is a Nuxt SSR app — phone numbers (as wa.me URLs) are embedded
 * in the server-rendered HTML script tag and accessible via plain HTTP
 * without any browser automation.
 */
export async function POST(req: NextRequest) {
  let job: any = null;

  try {
    const body = await req.json();
    const { url, options = {}, userId } = body;

    const queueResp = await handleQueueDelegation(req, 'jiji', body);
    if (queueResp) return queueResp;

    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    const isSandbox =
      (url && (url.toLowerCase().includes('sandbox') || url.toLowerCase().includes('mock'))) ||
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

    // ── Live scraping: HTTP Fetch + Nuxt __NUXT_DATA__ blob parsing ──────────
    job = await createScrapeJob('jiji', { url, options }, userId);
    await updateScrapeJobStatus(job.id, 'running');
    await addLog('Jiji Scraper', 'START', `Launching Jiji Nuxt-data crawl for URL: "${url}"`);

    // ── Stealth fetch wrapper ─────────────────────────────────────────────────
    // Reuses Cloudflare clearance cookies extracted by a background stealth browser session.
    // If a request returns 403/429, we invalidate the session cookies and re-extract them.
    const { getCloudflareCookieHeader, invalidateCfSession } = await import('@/lib/cloudflareSession');

    async function fetchJijiHtml(fetchUrl: string): Promise<string> {
      const attempt = async () => {
        const { cookieHeader, userAgent } = await getCloudflareCookieHeader();
        const baseHeaders = buildStealthHeaders('https://jiji.ng/');
        const hdrs: Record<string, string> = {
          ...baseHeaders,
        };

        if (cookieHeader) {
          hdrs['Cookie'] = cookieHeader;
        }
        if (userAgent) {
          hdrs['User-Agent'] = userAgent;
        }

        const res = await proxyFetch('jiji', fetchUrl, hdrs, AbortSignal.timeout(20000));
        if (res.status === 404) throw new Error(`404 at ${fetchUrl}`);
        if (res.status === 403 || res.status === 429) {
          invalidateCfSession(); // drop invalid credentials
          throw new Error(`BLOCKED:${res.status} at ${fetchUrl}`);
        }
        if (!res.ok) throw new Error(`HTTP ${res.status} at ${fetchUrl}`);
        return res.text();
      };

      try {
        return await attempt();
      } catch (e: any) {
        if (e.message.startsWith('BLOCKED:')) {
          await addLog('Jiji Scraper', 'WARN', `${e.message} — waiting 3s then retrying with fresh UA and CF session...`);
          await humanDelay(3000, 5000);
          return await attempt(); // one final retry (attempts to solve CF again)
        }
        throw e;
      }
    }

    // 1. Resolve & fetch the listing/search page
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http')) {
      targetUrl = `https://jiji.ng/lagos/search?query=${encodeURIComponent(targetUrl)}`;
    }

    let listingHtml = '';
    try {
      listingHtml = await fetchJijiHtml(targetUrl);
    } catch (err: any) {
      // Category page may 404 — fall back to search query
      if (err.message.includes('404') || err.message.includes('HTTP 4')) {
        const slug = url.split('/').pop() || url;
        const fallbackUrl = `https://jiji.ng/lagos/search?query=${encodeURIComponent(slug.replace(/-/g, ' '))}`;
        await addLog('Jiji Scraper', 'WARN', `${err.message}. Falling back to: ${fallbackUrl}`);
        listingHtml = await fetchJijiHtml(fallbackUrl);
        targetUrl = fallbackUrl;
      } else {
        throw err;
      }
    }

    // 2. Extract listing card links from SSR HTML
    const $ = cheerio.load(listingHtml);
    const cardData: { title: string; area: string; url: string }[] = [];

    $('a.b-list-advert-base, a[class*="advert-base"]').each((_i, el) => {
      const href = $(el).attr('href') || '';
      const cardTitle =
        $(el).find('.b-advert-title-inner, .qa-advert-title span, [class*="title"]').first().text().trim() ||
        $(el).attr('title') || '';
      const area = $(el).find('.b-list-advert__region, [class*="region"]').first().text().trim().split(',')[0] || '';
      if (!href) return;
      const absoluteUrl = href.startsWith('http') ? href : `https://jiji.ng${href.startsWith('/') ? '' : '/'}${href}`;
      if (absoluteUrl.includes('jiji.ng')) {
        cardData.push({ title: cardTitle, area, url: absoluteUrl });
      }
    });

    // Fallback: any /ad/ links if selectors above found nothing
    if (cardData.length === 0) {
      $('a[href*="/ad/"], a[href*="/lagos/"]').each((_i, el) => {
        const href = $(el).attr('href') || '';
        const text = $(el).text().trim();
        if (!href || !text || href.includes('/search') || href === '/') return;
        const absoluteUrl = href.startsWith('http') ? href : `https://jiji.ng${href}`;
        if (absoluteUrl.includes('jiji.ng') && !cardData.find(c => c.url === absoluteUrl)) {
          cardData.push({ title: text.substring(0, 60), area: '', url: absoluteUrl });
        }
      });
    }

    const limit = Number(options.limit) || 5;
    const targets = cardData.slice(0, limit);
    const scrapedLeads: Partial<Lead>[] = [];

    await addLog('Jiji Scraper', 'INFO', `Found ${cardData.length} listings. Processing top ${targets.length}...`);

    // 3. Fetch each detail page and extract phone from Nuxt __NUXT_DATA__ blob
    // 3. Fetch each detail page and extract phone from Nuxt __NUXT_DATA__ blob in parallel
    const detailPromises = targets.map(async (target) => {
      try {
        // Jitter: stagger parallel requests 1–4s apart to avoid rate-limit patterns
        await humanDelay(1000, 4000);

        const detailHtml = await fetchJijiHtml(target.url).catch((e: any) => {
          console.warn(`Jiji detail fetch failed for ${target.url}: ${e.message}`);
          return null;
        });
        if (!detailHtml) return null;

        let phoneVal = '';
        let sellerName = '';
        let description = '';

        // Strategy A: parse __NUXT_DATA__ JSON blob (most reliable)
        const nuxtDataMatch = detailHtml.match(/<script[^>]+id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
        if (nuxtDataMatch) {
          const blob = nuxtDataMatch[1];
          const waMatch = blob.match(/wa\.me\/(\d+)/) || blob.match(/wa\.me%2F(\d+)/);
          if (waMatch) phoneVal = waMatch[1];
          if (!phoneVal) {
            const phMatch = blob.match(/"phone"\s*:\s*"(\+?\d[\d\s\-\.]{6,})"/);
            if (phMatch) phoneVal = phMatch[1];
          }
          if (!phoneVal) {
            const wuMatch = blob.match(/whatsapp_url[",:\s]+https[^"]*wa\.me\/(\d+)/);
            if (wuMatch) phoneVal = wuMatch[1];
          }
        }

        // Strategy B: wa.me link anywhere in raw HTML
        if (!phoneVal) {
          const waHref = detailHtml.match(/href="[^"]*wa\.me\/(\d+)[^"]*"/);
          if (waHref) phoneVal = waHref[1];
        }

        // Strategy C: Nigerian number pattern inside script tags
        if (!phoneVal) {
          const scriptBlocks = detailHtml.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
          const ngRegex = /(?:234\d{10}|0[789]\d{9})/;
          for (const block of scriptBlocks) {
            const m = block.match(ngRegex);
            if (m) { phoneVal = m[0]; break; }
          }
        }

        // Extract seller name & description from HTML
        const $d = cheerio.load(detailHtml);
        sellerName = $d('.b-seller-block__name, .qa-seller-name').first().text().trim() || 'Jiji Seller';
        description = $d('.qa-description-text, .b-advert-description-text').first().text().trim();

        // Strategy D: phone in description text
        if (!phoneVal && description) {
          const descPhones = extractPhonesFromText(description);
          if (descPhones.length > 0) {
            phoneVal = descPhones[0];
          }
        }

        // Strategy E: phone anywhere in detail page HTML
        if (!phoneVal) {
          const htmlPhones = extractPhonesFromText(detailHtml);
          if (htmlPhones.length > 0) {
            phoneVal = htmlPhones[0];
          }
        }

        let finalPhone = phoneVal ? (normalizePhone(phoneVal, 'NG') || phoneVal) : '';
        const emails = extractEmailsFromText(description);
        let email = emails[0] || '';

        const websiteRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,6})(?:\/[^\s]*)?/i;
        const webMatch = description.match(websiteRegex);
        let website = '';
        if (webMatch) {
          const dom = webMatch[1].toLowerCase();
          if (!dom.includes('jiji')) {
            website = webMatch[0].startsWith('http') ? webMatch[0] : `http://${webMatch[0]}`;
          }
        }

        const category =
          target.url.split('/')[4]?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Seller';
        const hash = crypto.createHash('sha256').update(target.url).digest('hex').substring(0, 16);

        const leadObj: Partial<Lead> = {
          lead_id: `jiji_${hash}`,
          source: 'JIJI',
          name: sellerName,
          category,
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
          notes: 'Scraped via Nuxt __NUXT_DATA__ HTTP extraction.'
        };

        const hasWebsite = !!(website && (!email || !finalPhone));
        return { leadObj, hasWebsite };
      } catch (itemErr: any) {
        console.error(`Error scraping Jiji detail ${target.url}:`, itemErr.message);
        return null;
      }
    });
    const parsedResults = await Promise.all(detailPromises);

    // Run unified enrichment on all parsed results to get maximum contact info (emails, phones, socials)
    const validParsed = parsedResults.filter((item): item is Exclude<typeof item, null> => item !== null);
    if (validParsed.length > 0) {
      await addLog('Jiji Scraper', 'INFO', `Enriching contact info for ${validParsed.length} Jiji listings using website/search fallbacks...`);
      await Promise.allSettled(
        validParsed.map(async (item) => {
          const lead = item.leadObj;
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
          } catch (err: any) {
            console.error(`Failed to enrich contacts for ${lead.name}:`, err.message);
          }

          if (lead.phone_e164) {
            scrapedLeads.push(lead);
          } else {
            await addLog('Jiji Scraper', 'INFO', `Skipped "${lead.name}" — no phone number found even after enrichment.`);
          }
        })
      );
    }

    // 4. Save leads to database
    if (scrapedLeads.length > 0) {
      const dbResult = await saveLeads(scrapedLeads);
      await updateScrapeJobStatus(job.id, 'completed', {
        result: { leads: scrapedLeads, added: dbResult.added, skipped: dbResult.skipped }
      });
      await addLog('Jiji Scraper', 'SUCCESS',
        `Crawl complete. Scraped: ${scrapedLeads.length}, Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true, mode: 'live', jobId: job.id, status: 'completed',
        added: dbResult.added, skipped: dbResult.skipped, leads: scrapedLeads
      }, { status: 200 });
    } else {
      await updateScrapeJobStatus(job.id, 'completed', { result: { leads: [], added: 0, skipped: 0 } });
      await addLog('Jiji Scraper', 'INFO', `Crawl complete. 0 leads had extractable phone numbers.`);
      return NextResponse.json({
        success: true, mode: 'live', jobId: job.id, status: 'completed',
        added: 0, skipped: 0, leads: []
      }, { status: 200 });
    }

  } catch (err: any) {
    console.error('Jiji scrape error:', err);
    try {
      await addLog('Jiji Scraper', 'ERROR', `Scraper error: ${err.message}`);
    } catch (_) {}

    if (job) {
      try {
        await updateScrapeJobStatus(job.id, 'failed', { error_message: err.message || 'Internal error' });
      } catch (_) {}
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
