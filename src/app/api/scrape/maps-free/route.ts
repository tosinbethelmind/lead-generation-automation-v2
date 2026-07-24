import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { extractMapsLeadData, validateLeadWithAI, enrichLeadContacts } from '@/lib/leadEnricher';
import crypto from 'crypto';
import { handleQueueDelegation } from '@/app/api/scrape/queue';

// Configure execution timeout for Vercel serverless execution
export const maxDuration = 60;

/**
 * POST /api/scrape/maps-free
 * Body: { query: string, limit?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, limit = 5 } = body;

    const queueResp = await handleQueueDelegation(req, 'maps-free', body);
    if (queueResp) return queueResp;

    if (!query) {
      return NextResponse.json({ error: "Missing required query parameter." }, { status: 400 });
    }

    const isSandbox = query.toLowerCase().includes('sandbox') || query.toLowerCase().includes('mock');
    if (isSandbox) {
      await addLog('Maps-Free Scraper', 'START', `Starting Google Maps Free sandbox run for query: "${query}"`);
      const mockLeads = getMockMapsFreeLeads(query);
      const dbResult = await saveLeads(mockLeads);
      await addLog('Maps-Free Scraper', 'SUCCESS', `Sandbox complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'sandbox',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: mockLeads
      });
    }

    await addLog('Maps-Free Scraper', 'START', `Starting Maps-Free multi-source crawl for query: "${query}"`);

    const origin = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (process.env.NEXT_PUBLIC_APP_URL || (req.url.startsWith('http') ? new URL(req.url).origin : 'http://localhost:3000'));

    // ── Phase 1: Fast parallel fallback sources (OSM + DuckDuckGo) ──────────
    // These reliably return results in < 30s. Run them in parallel immediately.
    await addLog('Maps-Free Scraper', 'INFO', `Running parallel OSM + DuckDuckGo crawl for: "${query}"`);

    const [osmResult, ddgResult] = await Promise.allSettled([
      fetch(`${origin}/api/scrape/osm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit, bypassQueue: true }),
        signal: AbortSignal.timeout(35000)
      }).then(r => r.json()).catch(() => null),
      fetch(`${origin}/api/scrape/duckduckgo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit, bypassQueue: true }),
        signal: AbortSignal.timeout(35000)
      }).then(r => r.json()).catch(() => null)
    ]);

    const osmData = osmResult.status === 'fulfilled' ? osmResult.value : null;
    const ddgData = ddgResult.status === 'fulfilled' ? ddgResult.value : null;

    const fastLeads: Partial<Lead>[] = [
      ...(osmData?.leads ?? []),
      ...(ddgData?.leads ?? [])
    ];

    if (fastLeads.length >= limit) {
      // Enough leads from fast sources — return immediately without browser
      const trimmed = fastLeads.slice(0, limit);
      
      // Enrich contacts for the fast path leads
      await addLog('Maps-Free Scraper', 'INFO', `Enriching contact info for ${trimmed.length} fast-path candidates in parallel...`);
      await Promise.allSettled(
        trimmed.map(async (lead) => {
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
            console.error(`Failed to enrich fast-path lead ${lead.name}:`, err.message);
          }
        })
      );

      const dbResult = await saveLeads(trimmed);
      await addLog('Maps-Free Scraper', 'SUCCESS',
        `Multi-source crawl complete (no browser needed). Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'multi-source',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: trimmed
      });
    }

    // ── Phase 2: Optional Google Maps browser enhancement ───────────────────
    // Only attempt if fast sources returned fewer leads than requested.
    await addLog('Maps-Free Scraper', 'INFO',
      `Fast sources returned ${fastLeads.length}/${limit} leads. Attempting Google Maps browser enhancement...`);

    let browser: any;
    let scrapedLeads: Partial<Lead>[] = [...fastLeads];

    // Hard 40 s cap: browser either succeeds quickly or we skip it
    const BROWSER_TIMEOUT_MS = 40_000;

    let timeoutId: NodeJS.Timeout | undefined;

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`Browser session timed out after ${BROWSER_TIMEOUT_MS / 1000}s`)), BROWSER_TIMEOUT_MS);
      });

      const browserResult = await Promise.race([
        (async () => {
          const { launchBrowser } = await import('@/lib/browserLauncher');
          browser = await launchBrowser();
          const page = await browser.newPage();

          await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          await page.setViewport({ width: 1280, height: 800 });

          // Navigate to Google Maps
          const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
          await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch((e: any) => {
            console.log(`Main search page.goto timed out: ${e.message}, proceeding...`);
          });
          await new Promise(r => setTimeout(r, 3000));

          // Dismiss GDPR / cookie banner if present
          try {
            const clickedReject = await page.evaluate(() => {
              const btns = Array.from(document.querySelectorAll('button'));
              const rejectBtn = (btns as HTMLButtonElement[]).find(btn => {
                const label = btn.getAttribute('aria-label')?.toLowerCase() || '';
                const text = btn.textContent?.toLowerCase() || '';
                return label.includes('reject all') || label.includes('reject') ||
                       text.includes('reject all') || text.includes('reject');
              });
              if (rejectBtn) { rejectBtn.click(); return true; }
              return false;
            });
            if (clickedReject) {
              await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {});
              await new Promise(r => setTimeout(r, 1500));
            }
          } catch (_) {}

          // Wait for feed or detail page
          try {
            await page.waitForFunction(() =>
              !!(document.querySelector('[role="feed"]') ||
                 document.querySelector('h1') ||
                 window.location.href.includes('/maps/place/')),
              { timeout: 12000 }
            );
          } catch (_) {
            console.log('[Maps-Free] Timeout waiting for feed/detail elements');
          }

          const currentUrl = page.url();
          const isSinglePlace =
            currentUrl.includes('/maps/place/') ||
            (await page.$('h1') && !(await page.$('[role="feed"]')));

          if (isSinglePlace) {
            await page.waitForSelector('h1', { timeout: 6000 }).catch(() => {});
            const data = await Promise.race([
              extractMapsLeadData(page, query, true).catch(err => {
                console.warn(`[Maps-Free] Background extractMapsLeadData error:`, err.message);
                return null;
              }),
              new Promise<null>(r => setTimeout(() => r(null), 12000))
            ]);
            if (data) {
              const lead = buildLead(data, page.url(), query);
              if (lead) scrapedLeads.push(lead);
            }
          } else {
            const feedEl = await page.$('[role="feed"]');
            if (feedEl) {
              const scrollSteps = limit <= 5 ? 2 : 4;
              for (let i = 0; i < scrollSteps; i++) {
                await page.evaluate((el: any) => el.scrollBy(0, 1200), feedEl);
                await new Promise(r => setTimeout(r, 900));
              }
            }

            const links = await page.evaluate(() =>
              Array.from(document.querySelectorAll('a[href*="/maps/place/"]'))
                .map(a => (a as HTMLAnchorElement).href)
            );
            const uniqueLinks = Array.from(new Set(links)).slice(0, Math.min(limit, 8)) as string[];

            const chunks: string[][] = [];
            const chunkSize = 3;
            for (let i = 0; i < uniqueLinks.length; i += chunkSize) {
              chunks.push(uniqueLinks.slice(i, i + chunkSize));
            }

            for (const chunk of chunks) {
              const detailPromises = chunk.map(async (link) => {
                let detailPage;
                try {
                  detailPage = await browser.newPage();
                  await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
                  await detailPage.setViewport({ width: 1280, height: 800 });
                  await detailPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
                  await detailPage.waitForSelector('h1', { timeout: 6000 }).catch(() => {});
                  const data = await Promise.race([
                    extractMapsLeadData(detailPage, query, true).catch(err => {
                      console.warn(`[Maps-Free] Background chunk extractMapsLeadData error:`, err.message);
                      return null;
                    }),
                    new Promise<null>(r => setTimeout(() => r(null), 12000))
                  ]);
                  if (data) {
                    return buildLead(data, detailPage.url(), query);
                  }
                } catch (err: any) {
                  console.error(`Error loading place details for ${link}:`, err.message);
                } finally {
                  if (detailPage) await detailPage.close().catch(() => {});
                }
                return null;
              });

              const results = await Promise.all(detailPromises);
              for (const lead of results) {
                if (lead) scrapedLeads.push(lead);
              }
            }
          }
          return scrapedLeads;
        })(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Browser session timed out after ${BROWSER_TIMEOUT_MS / 1000}s`)), BROWSER_TIMEOUT_MS)
        )
      ]);

      scrapedLeads = browserResult as Partial<Lead>[];

    } catch (browserErr: any) {
      console.error('[Maps-Free] Browser scrape failed:', browserErr.message);
      await addLog('Maps-Free Scraper', 'WARNING',
        `Puppeteer failed: ${browserErr.message}. Fast sources already returned ${fastLeads.length} leads. Returning those...`);

      // If we already have some leads from Phase 1, return them rather than trying more fallbacks
      if (fastLeads.length > 0) {
        const dbResult = await saveLeads(fastLeads);
        return NextResponse.json({
          success: true,
          mode: 'multi-source',
          added: dbResult.added,
          skipped: dbResult.skipped,
          leads: fastLeads
        });
      }

      // Fallback 1: DuckDuckGo
      try {
        const ddgResp = await fetch(`${origin}/api/scrape/duckduckgo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, limit, bypassQueue: true })
        });
        if (ddgResp.ok) {
          const ddgResult = await ddgResp.json();
          if (ddgResult.success && ddgResult.leads && ddgResult.leads.length > 0) {
            await addLog('Maps-Free Scraper', 'SUCCESS',
              `DuckDuckGo fallback succeeded. Found ${ddgResult.leads.length} leads.`);
            return NextResponse.json({ ...ddgResult, mode: 'fallback-duckduckgo' });
          }
        }
      } catch (ddgErr: any) {
        console.error('DuckDuckGo fallback failed:', ddgErr.message);
      }

      // Fallback 2: OpenStreetMap (always reliable)
      await addLog('Maps-Free Scraper', 'WARNING', `DuckDuckGo fallback returned 0. Trying OSM fallback...`);
      try {
        const osmResp = await fetch(`${origin}/api/scrape/osm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, limit, bypassQueue: true })
        });
        if (osmResp.ok) {
          const osmResult = await osmResp.json();
          if (osmResult.success && osmResult.leads && osmResult.leads.length > 0) {
            await addLog('Maps-Free Scraper', 'SUCCESS',
              `OSM fallback succeeded. Found ${osmResult.leads.length} leads.`);
            return NextResponse.json({ ...osmResult, mode: 'fallback-osm' });
          }
        }
      } catch (osmErr: any) {
        console.error('OSM fallback also failed:', osmErr.message);
        await addLog('Maps-Free Scraper', 'ERROR', `OSM fallback failed: ${osmErr.message}`);
      }

      return NextResponse.json({
        success: false,
        error: `All fallbacks exhausted: Google Maps timed out, DuckDuckGo and OSM returned 0 results.`
      }, { status: 500 });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      if (browser) {
        try { await browser.close(); } catch (_) {}
      }
    }

    if (scrapedLeads.length === 0) {
      await addLog('Maps-Free Scraper', 'WARNING', `All sources returned 0 leads for query: "${query}"`);
      return NextResponse.json({
        success: false,
        error: 'No leads found from any source (OSM, DuckDuckGo, or Google Maps). The query may be too specific.'
      }, { status: 500 });
    }

    // Apply quality and AI filters to the scraped leads
    const finalLeads: Partial<Lead>[] = [];
    const config = getRuntimeConfig();
    const minReviews = config.minReviews ?? 1;
    const minRating = config.minRating ?? 3.0;

    // Filter first by basic rating and review criteria to avoid calling Gemini API on unqualified leads
    const candidates = scrapedLeads.filter(lead => {
      const reviews = lead.reviews_count ?? 0;
      const rating = lead.rating ?? 0;

      if (reviews < minReviews) {
        console.log(`[Maps-Free] Filtering out lead "${lead.name}" due to low reviews count (${reviews} < ${minReviews})`);
        return false;
      }
      if (rating < minRating) {
        console.log(`[Maps-Free] Filtering out lead "${lead.name}" due to low rating (${rating} < ${minRating})`);
        return false;
      }
      return true;
    });

    // ── Website enrichment: fetch direct business websites missing contacts ─
    const toEnrich = candidates.filter(l => !l.email || !l.phone_e164);
    if (toEnrich.length > 0) {
      await addLog('Maps-Free Scraper', 'INFO', `Enriching contact info for ${toEnrich.length} candidates in parallel using browser/search fallbacks...`);
      await Promise.allSettled(
        toEnrich.map(async (lead) => {
          try {
            const enriched = await enrichLeadContacts(lead, browser);
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

    const apiKey = config.geminiApiKey || config.antigravityApiKey || (config.antigravityApiKeys && config.antigravityApiKeys[0]) || '';
    if (apiKey && candidates.length > 0) {
      console.log(`[Maps-Free] Performing parallel AI relevance check for ${candidates.length} leads...`);
      const aiChecks = await Promise.all(
        candidates.map(async (lead) => {
          try {
            const aiCheck = await validateLeadWithAI(lead, apiKey);
            return { lead, aiCheck };
          } catch (err: any) {
            console.error(`AI check failed for lead ${lead.name}:`, err.message);
            return { lead, aiCheck: { isRelevant: true, score: 10, reason: 'AI check failed', pitchAngle: lead.website ? 'CRM Integration & WhatsApp Automation' : 'New Website Design' } };
          }
        })
      );

      for (const { lead, aiCheck } of aiChecks) {
        if (!aiCheck.isRelevant) {
          console.log(`[Maps-Free] Filtering out lead "${lead.name}" due to AI scoring: ${aiCheck.score}/10. Reason: ${aiCheck.reason}`);
          continue;
        }
        lead.notes = `${lead.notes || ''} AI Relevance Score: ${aiCheck.score}/10 (${aiCheck.reason})${(aiCheck as any).pitchAngle ? ` [pitch: ${(aiCheck as any).pitchAngle}]` : ''}`;
        finalLeads.push(lead);
      }
    } else {
      finalLeads.push(...candidates);
    }

    if (finalLeads.length > 0) {
      const dbResult = await saveLeads(finalLeads);
      await addLog('Maps-Free Scraper', 'SUCCESS', `Scraped ${scrapedLeads.length} leads. ${finalLeads.length} passed quality filters. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'live',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: finalLeads
      });
    } else {
      await addLog('Maps-Free Scraper', 'SUCCESS', `Scraped ${scrapedLeads.length} leads, but 0 passed quality filters (min reviews: ${minReviews}, min rating: ${minRating}, AI validation).`);
      return NextResponse.json({
        success: true,
        mode: 'live',
        added: 0,
        skipped: 0,
        leads: [],
        message: 'No leads passed the quality or AI validation filters.'
      });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ── Build a Lead record from enriched data ─────────────────────────────────
function buildLead(
  data: Awaited<ReturnType<typeof extractMapsLeadData>> & {},
  profileUrl: string,
  query: string
): Partial<Lead> | null {
  if (!data || !data.name) return null;
  const cleanPhone = data.rawPhone ? normalizePhone(data.rawPhone, 'NG') : null;
  const parts = data.address.split(',');
  const area = parts[1] ? parts[1].trim() : parts[0] || 'Lagos';
  const hash = crypto.createHash('sha256').update(profileUrl).digest('hex').substring(0, 16);
  return {
    lead_id: `mapsfree_${hash}`,
    source: 'MAPS_FREE',
    name: data.name,
    category: data.category || query.split('in')[0]?.trim() || 'Business',
    address: data.address,
    area,
    city: 'Lagos',
    phone_e164: cleanPhone || '',
    phone_raw: data.rawPhone || '',
    email: data.email || '',
    website: data.website,
    rating: data.rating,
    reviews_count: data.reviewsCount,
    verified: !!cleanPhone,
    listings_count: 1,
    profile_url: profileUrl,
    source_query_or_seed: query,
    collected_at: new Date().toISOString(),
    status: 'NEW',
    last_contacted_at: '',
    duplicate_of_lead_id: '',
    business_summary: `${data.name} is a local business in ${area}. Maps rating: ${data.rating} stars with ${data.reviewsCount} reviews.${cleanPhone ? ` Phone: ${data.rawPhone}` : ''}${data.email ? ` Email: ${data.email}` : ''}`,
    notes: `Scraped via Puppeteer Google Maps Free. Phone: ${data.phoneStrategy}. Email: ${data.email ? 'found' : 'none'}.`,
    business_hours: data.business_hours || '',
    reviews_data: data.reviews_data || '',
    photos_data: data.photos_data || '',
    social_links: data.social_links || '',
    services_data: data.services_data || ''
  };
}

// Kept for sandbox mock data
async function _unused(page: any, query: string): Promise<Partial<Lead> | null> {
  try {
    // ── PHONE STRATEGY 1: Read from data-item-id attribute ──────────────────
    // Google always encodes the number in the attribute even before clicking,
    // e.g. data-item-id="phone:tel:+2348012345678"
    const phoneFromAttr: string = await page.evaluate(() => {
      const btn = document.querySelector('button[data-item-id^="phone:tel:"]');
      if (!btn) return '';
      const itemId = (btn as HTMLElement).getAttribute('data-item-id') || '';
      return itemId.replace('phone:tel:', '').trim();
    });

    // ── PHONE STRATEGY 2: Click the phone button to reveal hidden number ─────
    let phoneFromClick = '';
    let phoneStrategy = 'none';
    try {
      const phoneBtn = await page.$('button[data-item-id^="phone:tel:"]');
      if (phoneBtn) {
        await phoneBtn.click();
        await new Promise(r => setTimeout(r, 1200)); // wait for reveal animation
        phoneFromClick = await page.evaluate(() => {
          const btn = document.querySelector('button[data-item-id^="phone:tel:"]');
          if (!btn) return '';
          // Check sibling spans — Google sometimes injects revealed number nearby
          const parent = btn.closest('[data-section-id]') || btn.parentElement;
          if (parent) {
            const spans = Array.from((parent as HTMLElement).querySelectorAll('span'));
            for (const s of spans) {
              const t = (s as HTMLElement).textContent?.trim() || '';
              if (/^[\+0][\d\s\-\.]{6,}/.test(t)) return t;
            }
          }
          return (btn as HTMLElement).textContent?.trim() || '';
        });
      }
    } catch (_) {
      // Click silently failed — strategy 3 will handle
    }

    // ── PHONE STRATEGY 3: Plain textContent fallback ─────────────────────────
    const phoneFromText: string = await page.evaluate(() => {
      const btn = document.querySelector('button[data-item-id^="phone:tel:"]');
      return btn ? (btn as HTMLElement).textContent?.trim() || '' : '';
    });

    // Pick best available value
    let rawPhone = '';
    if (phoneFromAttr) { rawPhone = phoneFromAttr; phoneStrategy = 'attr'; }
    else if (phoneFromClick) { rawPhone = phoneFromClick; phoneStrategy = 'click'; }
    else if (phoneFromText) { rawPhone = phoneFromText; phoneStrategy = 'text'; }

    console.log(`[Maps-Free] Phone — attr:"${phoneFromAttr}" click:"${phoneFromClick}" text:"${phoneFromText}" → "${rawPhone}" (${phoneStrategy})`);

    // ── Extract all other fields ─────────────────────────────────────────────
    const details = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const name = h1 ? (h1 as HTMLElement).textContent?.trim() || '' : '';

      let rating = 0;
      let reviewsCount = 0;

      const ratingEl = document.querySelector('div.F7nice span[aria-hidden="true"]');
      if (ratingEl) {
        const val = parseFloat((ratingEl as HTMLElement).textContent?.trim() || '0');
        if (!isNaN(val)) rating = val;
      }

      const reviewsEl = document.querySelector('div.F7nice span[aria-label*="reviews"]');
      if (reviewsEl) {
        const cleaned = (reviewsEl as HTMLElement).textContent?.replace(/\D/g, '') || '';
        if (cleaned) reviewsCount = parseInt(cleaned, 10);
      }

      const addressBtn = document.querySelector('button[data-item-id="address"]');
      const address = addressBtn ? (addressBtn as HTMLElement).textContent?.trim() || '' : '';

      const webBtn = document.querySelector('a[data-item-id="authority"]');
      const website = webBtn ? (webBtn as HTMLElement).getAttribute('href')?.trim() || '' : '';

      // Business category (displayed under the name on the panel)
      const catEl = document.querySelector('button[jsaction*="category"]') ||
                    document.querySelector('span.DkEaL');
      const category = catEl ? (catEl as HTMLElement).textContent?.trim() || '' : '';

      return { name, rating, reviewsCount, address, website, category };
    });

    // Drop only truly empty pages
    if (!details.name) return null;

    const cleanPhone = rawPhone ? normalizePhone(rawPhone, 'NG') : null;
    const parts = details.address.split(',');
    const area = parts[1] ? parts[1].trim() : parts[0] || 'Lagos';

    const profileUrl = page.url();
    const hash = crypto.createHash('sha256').update(profileUrl).digest('hex').substring(0, 16);

    return {
      lead_id: `mapsfree_${hash}`,
      source: 'MAPS_FREE',
      name: details.name,
      category: details.category || query.split('in')[0]?.trim() || 'Business',
      address: details.address,
      area,
      city: 'Lagos',
      phone_e164: cleanPhone || '',
      phone_raw: rawPhone || '',
      email: '',
      website: details.website,
      rating: details.rating,
      reviews_count: details.reviewsCount,
      verified: !!cleanPhone,
      listings_count: 1,
      profile_url: profileUrl,
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `${details.name} is a local business in ${area}. Maps rating: ${details.rating} stars with ${details.reviewsCount} reviews.${cleanPhone ? ` Phone: ${rawPhone}` : ''}`,
      notes: `Scraped via Puppeteer Google Maps Free. Phone extraction: ${phoneStrategy}.`
    };
  } catch (err) {
    console.error('[Maps-Free] Error extracting details:', err);
    return null;
  }
}

function getMockMapsFreeLeads(query: string): Partial<Lead>[] {
  return [
    {
      lead_id: `mock_mapsfree_1`,
      source: 'MAPS_FREE',
      name: 'Lagos Island Dental Care',
      category: 'dentist',
      address: '22 Marina Road, Lagos Island, Lagos',
      area: 'Lagos Island',
      city: 'Lagos',
      phone_e164: '+2348055566677',
      phone_raw: '08055566677',
      email: '',
      website: 'https://lagosislanddental.com',
      rating: 4.8,
      reviews_count: 120,
      verified: true,
      listings_count: 1,
      profile_url: 'https://www.google.com/maps/place/mock_mapsfree_1',
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: 'Lagos Island Dental Care is a premier dental service on Lagos Island. They provide state-of-the-art teeth whitening, cleaning, and dental implants.',
      notes: 'Sandbox mode lead.',
      business_hours: JSON.stringify([
        "Monday: 8:00 AM – 5:00 PM",
        "Tuesday: 8:00 AM – 5:00 PM",
        "Wednesday: 8:00 AM – 5:00 PM",
        "Thursday: 8:00 AM – 5:00 PM",
        "Friday: 8:00 AM – 5:00 PM",
        "Saturday: 9:00 AM – 2:00 PM",
        "Sunday: Closed"
      ]),
      reviews_data: JSON.stringify([
        { author_name: "Yinka Davies", rating: 5, text: "Best dentist in Lagos! Extremely clean and advanced setup." },
        { author_name: "Emeka Okafor", rating: 4, text: "Excellent customer service and very detailed diagnosis." }
      ]),
      photos_data: JSON.stringify([
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800"
      ]),
      social_links: JSON.stringify({
        facebook: "https://facebook.com/lagosislanddental",
        instagram: "https://instagram.com/lagosislanddental"
      }),
      services_data: JSON.stringify([
        "Dental Checkup",
        "Scaling and Polishing",
        "Laser Teeth Whitening",
        "Crowns and Bridges"
      ])
    },
    {
      lead_id: `mock_mapsfree_2`,
      source: 'MAPS_FREE',
      name: 'Victoria Island Dental Suite',
      category: 'dentist',
      address: '88 Adeola Odeku Street, Victoria Island, Lagos',
      area: 'Victoria Island',
      city: 'Lagos',
      phone_e164: '+2348099988877',
      phone_raw: '08099988877',
      email: '',
      website: '',
      rating: 4.3,
      reviews_count: 45,
      verified: true,
      listings_count: 1,
      profile_url: 'https://www.google.com/maps/place/mock_mapsfree_2',
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: 'Victoria Island Dental Suite is a top-rated local business in Victoria Island. Maps rating: 4.3 stars with 45 reviews.',
      notes: 'Sandbox mode lead.',
      business_hours: JSON.stringify([
        "Monday: 9:00 AM – 6:00 PM",
        "Tuesday: 9:00 AM – 6:00 PM",
        "Wednesday: 9:00 AM – 6:00 PM",
        "Thursday: 9:00 AM – 6:00 PM",
        "Friday: 9:00 AM – 6:00 PM",
        "Saturday: 10:00 AM – 4:00 PM",
        "Sunday: Closed"
      ]),
      reviews_data: JSON.stringify([
        { author_name: "Kemi Balogun", rating: 4, text: "Clean office and friendly dentist. Highly recommended." },
        { author_name: "Chidi Nze", rating: 5, text: "Fast and painless extraction. Thank you!" }
      ]),
      photos_data: JSON.stringify([
        "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=800"
      ]),
      social_links: JSON.stringify({
        instagram: "https://instagram.com/videntalsuite"
      }),
      services_data: JSON.stringify([
        "Tooth Extraction",
        "Dental Restoration",
        "Pediatric Dentistry"
      ])
    }
  ];
}
