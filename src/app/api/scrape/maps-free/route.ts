import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { extractMapsLeadData, validateLeadWithAI } from '@/lib/leadEnricher';
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

    await addLog('Maps-Free Scraper', 'START', `Starting Google Maps Free Puppeteer crawl for query: "${query}"`);

    let browser: any;
    let scrapedLeads: Partial<Lead>[] = [];

    try {
      const { launchBrowser } = await import('@/lib/browserLauncher');
      browser = await launchBrowser();
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1280, height: 800 });

      // Navigate directly to Google Maps search URL
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch((e: any) => {
        console.log(`Main search page.goto promise timed out/interrupted: ${e.message}, proceeding...`);
      });
      await new Promise(r => setTimeout(r, 4000));

      // Click on Reject All if GDPR banner pops up
      try {
        const clickedReject = await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const rejectBtn = btns.find(btn => {
            const label = btn.getAttribute('aria-label')?.toLowerCase() || '';
            const text = btn.textContent?.toLowerCase() || '';
            return label.includes('reject all') || label.includes('reject') || text.includes('reject all') || text.includes('reject');
          });
          if (rejectBtn) {
            rejectBtn.click();
            return true;
          }
          return false;
        });
        if (clickedReject) {
          await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {});
          await new Promise(r => setTimeout(r, 2000));
        }
      } catch (e) {
        // No GDPR overlay, ignore
      }

      // Wait for either results feed or a direct single place detail page to load
      try {
        await page.waitForFunction(() => {
          return !!(document.querySelector('[role="feed"]') || document.querySelector('h1') || window.location.href.includes('/maps/place/'));
        }, { timeout: 15000 });
      } catch (e) {
        console.log("Timeout waiting for feed or detail page elements");
      }

      // Check if we ended up directly on a business detail page
      const currentUrl = page.url();
      const isSinglePlace = currentUrl.includes('/maps/place/') || (await page.$('h1') && !(await page.$('[role="feed"]')));

      if (isSinglePlace) {
        try {
          await page.waitForSelector('h1', { timeout: 8000 });
        } catch (e) {}
        // Extract single lead using shared enricher (3-strategy phone + email + website)
        const data = await extractMapsLeadData(page, query);
        if (data) {
          const lead = buildLead(data, page.url(), query);
          if (lead) scrapedLeads.push(lead);
        }
      } else {
        // We are on a results list feed. Scroll to load items.
        const feedSelector = '[role="feed"]';
        const feedEl = await page.$(feedSelector);
        if (feedEl) {
          // Scroll the feed container down several times
          for (let i = 0; i < 5; i++) {
            await page.evaluate((el: any) => el.scrollBy(0, 1200), feedEl);
            await new Promise(r => setTimeout(r, 1000));
          }
        }

        // Get place anchor links
        const links = await page.evaluate(() => {
          const anchors = Array.from(document.querySelectorAll('a[href*="/maps/place/"]'));
          return anchors.map(a => (a as HTMLAnchorElement).href);
        });

        // Deduplicate URLs and slice to limit to keep crawl time fast
        const uniqueLinks = Array.from(new Set(links)).slice(0, Math.min(limit, 10));

        const pagePromises = uniqueLinks.map(async (link) => {
          let detailPage;
          try {
            detailPage = await browser.newPage();
            await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await detailPage.setViewport({ width: 1280, height: 800 });
            await detailPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 8000 }).catch((err: any) => {
              console.log(`Detail page.goto timed out or was interrupted for ${link}, checking for h1 anyway...`);
            });
            await detailPage.waitForSelector('h1', { timeout: 8000 }).catch(() => {});
            const data = await extractMapsLeadData(detailPage, query);
            if (data) {
              return buildLead(data, detailPage.url(), query);
            }
          } catch (err: any) {
            console.error(`Error loading place details for ${link}:`, err.message);
          } finally {
            if (detailPage) {
              await detailPage.close().catch(() => {});
            }
          }
          return null;
        });

        const results = await Promise.all(pagePromises);
        for (const lead of results) {
          if (lead) scrapedLeads.push(lead);
        }
      }
    } catch (browserErr: any) {
      console.error("[Maps-Free] Real scrape failed:", browserErr.message);
      await addLog('Maps-Free Scraper', 'WARNING', `Puppeteer failed: ${browserErr.message}. Attempting DuckDuckGo fallback...`);
      let useFallback = true;
      let fallbackReason = `Puppeteer error: ${browserErr.message}`;
      
      const ddgUrl = `${new URL(req.url).origin}/api/scrape/duckduckgo`;
      try {
        const ddgResp = await fetch(ddgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, limit, bypassQueue: true })
        });
        if (ddgResp.ok) {
          const ddgResult = await ddgResp.json();
          if (ddgResult.success && ddgResult.leads && ddgResult.leads.length > 0) {
            await addLog('Maps-Free Scraper', 'SUCCESS', `Fallback to DuckDuckGo succeeded. Reason for fallback: ${fallbackReason}. Found ${ddgResult.leads.length} leads.`);
            return NextResponse.json({
              ...ddgResult,
              mode: 'fallback-duckduckgo'
            });
          }
        }
      } catch (ddgErr: any) {
        console.error("DuckDuckGo fallback failed:", ddgErr.message);
        await addLog('Maps-Free Scraper', 'ERROR', `Fallback to DuckDuckGo failed: ${ddgErr.message}`);
      }

      return NextResponse.json({
        success: false,
        error: `Google Maps scrape failed (${fallbackReason}) and DuckDuckGo fallback failed.`
      }, { status: 500 });
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          console.error("Error closing browser:", e);
        }
      }
    }

    if (scrapedLeads.length === 0) {
      console.log(`[Maps-Free] Google Maps returned 0 leads. Attempting DuckDuckGo fallback...`);
      await addLog('Maps-Free Scraper', 'WARNING', `Live Maps scrape returned 0 leads. Attempting DuckDuckGo fallback...`);
      
      const ddgUrl = `${new URL(req.url).origin}/api/scrape/duckduckgo`;
      try {
        const ddgResp = await fetch(ddgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, limit, bypassQueue: true })
        });
        if (ddgResp.ok) {
          const ddgResult = await ddgResp.json();
          if (ddgResult.success && ddgResult.leads && ddgResult.leads.length > 0) {
            await addLog('Maps-Free Scraper', 'SUCCESS', `Fallback to DuckDuckGo succeeded after Google Maps returned 0 leads. Found ${ddgResult.leads.length} leads.`);
            return NextResponse.json({
              ...ddgResult,
              mode: 'fallback-duckduckgo'
            });
          }
        }
      } catch (ddgErr: any) {
        console.error("DuckDuckGo fallback failed:", ddgErr.message);
        await addLog('Maps-Free Scraper', 'ERROR', `Fallback to DuckDuckGo failed: ${ddgErr.message}`);
      }

      return NextResponse.json({
        success: false,
        error: 'Live scrape returned 0 leads. Google Maps may have blocked access, and DuckDuckGo fallback returned 0 results.'
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

    const apiKey = config.geminiApiKey;
    if (apiKey && candidates.length > 0) {
      console.log(`[Maps-Free] Performing parallel AI relevance check for ${candidates.length} leads...`);
      const aiChecks = await Promise.all(
        candidates.map(async (lead) => {
          try {
            const aiCheck = await validateLeadWithAI(lead, apiKey);
            return { lead, aiCheck };
          } catch (err: any) {
            console.error(`AI check failed for lead ${lead.name}:`, err.message);
            return { lead, aiCheck: { isRelevant: true, score: 10, reason: 'AI check failed' } };
          }
        })
      );

      for (const { lead, aiCheck } of aiChecks) {
        if (!aiCheck.isRelevant) {
          console.log(`[Maps-Free] Filtering out lead "${lead.name}" due to AI scoring: ${aiCheck.score}/10. Reason: ${aiCheck.reason}`);
          continue;
        }
        lead.notes = `${lead.notes || ''} AI Relevance Score: ${aiCheck.score}/10 (${aiCheck.reason})`;
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
