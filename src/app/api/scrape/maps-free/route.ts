import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import crypto from 'crypto';

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

    let browser;
    let scrapedLeads: Partial<Lead>[] = [];

    try {
      const { launchBrowser } = await import('@/lib/browserLauncher');
      browser = await launchBrowser();
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1280, height: 800 });

      // Navigate directly to Google Maps search URL
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(e => {
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
        // Extract single lead directly
        const lead = await extractCurrentPlaceDetails(page, query);
        if (lead) scrapedLeads.push(lead);
      } else {
        // We are on a results list feed. Scroll to load items.
        const feedSelector = '[role="feed"]';
        const feedEl = await page.$(feedSelector);
        if (feedEl) {
          // Scroll the feed container down several times
          for (let i = 0; i < 5; i++) {
            await page.evaluate((el) => el.scrollBy(0, 1200), feedEl);
            await new Promise(r => setTimeout(r, 1000));
          }
        }

        // Get place anchor links
        const links = await page.evaluate(() => {
          const anchors = Array.from(document.querySelectorAll('a[href*="/maps/place/"]'));
          return anchors.map(a => (a as HTMLAnchorElement).href);
        });

        // Deduplicate URLs
        const uniqueLinks = Array.from(new Set(links)).slice(0, Math.min(limit * 2, 12));

        for (const link of uniqueLinks) {
          if (scrapedLeads.length >= limit) break;
          try {
            await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(err => {
              console.log(`Detail page.goto timed out or was interrupted for ${link}, checking for h1 anyway...`);
            });
            await page.waitForSelector('h1', { timeout: 8000 });
            const lead = await extractCurrentPlaceDetails(page, query);
            if (lead) {
              scrapedLeads.push(lead);
            }
          } catch (err: any) {
            console.error(`Error loading place details for ${link}:`, err.message);
          }
        }
      }
    } catch (browserErr: any) {
      console.error("[Maps-Free] Real scrape failed:", browserErr.message);
      await addLog('Maps-Free Scraper', 'ERROR', `Puppeteer failed: ${browserErr.message}`);
      return NextResponse.json({
        success: false,
        error: browserErr.message || 'Browser execution failed during live Google Maps Free scraping'
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

    // Save actual scraped results
    if (scrapedLeads.length > 0) {
      const dbResult = await saveLeads(scrapedLeads);
      await addLog('Maps-Free Scraper', 'SUCCESS', `Scraped ${scrapedLeads.length} leads. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'live',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: scrapedLeads
      });
    } else {
      await addLog('Maps-Free Scraper', 'INFO', `Search returned 0 valid leads.`);
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

// Helper: Extract business details from Google Maps detail panel
async function extractCurrentPlaceDetails(page: any, query: string): Promise<Partial<Lead> | null> {
  try {
    const details = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const name = h1 ? h1.textContent?.trim() || 'Unknown Business' : 'Unknown Business';

      let rating = 0;
      let reviewsCount = 0;
      
      const ratingEl = document.querySelector('div.F7nice span[aria-hidden="true"]');
      if (ratingEl) {
        const val = parseFloat(ratingEl.textContent?.trim() || '0');
        if (!isNaN(val)) rating = val;
      }
      
      const reviewsEl = document.querySelector('div.F7nice span[aria-label*="reviews"]');
      if (reviewsEl) {
        const cleaned = reviewsEl.textContent?.replace(/\D/g, '') || '';
        if (cleaned) reviewsCount = parseInt(cleaned, 10);
      }

      const addressBtn = document.querySelector('button[data-item-id="address"]');
      const address = addressBtn ? addressBtn.textContent?.trim() || '' : '';

      const phoneBtn = document.querySelector('button[data-item-id^="phone:tel:"]');
      const phone = phoneBtn ? phoneBtn.textContent?.trim() || '' : '';

      const webBtn = document.querySelector('a[data-item-id="authority"]');
      const website = webBtn ? webBtn.getAttribute('href')?.trim() || '' : '';

      return {
        name,
        rating,
        reviewsCount,
        address,
        phone,
        website
      };
    });

    const cleanPhone = details.phone ? normalizePhone(details.phone, 'NG') : null;
    if (!cleanPhone) return null;
    const parts = details.address.split(',');
    const area = parts[1] ? parts[1].trim() : parts[0] || 'Lagos';

    const profileUrl = page.url();
    const hash = crypto.createHash('sha256').update(profileUrl).digest('hex').substring(0, 16);
    return {
      lead_id: `mapsfree_${hash}`,
      source: 'MAPS_FREE',
      name: details.name,
      category: query.split('in')[0]?.trim() || 'Business',
      address: details.address,
      area: area,
      city: 'Lagos',
      phone_e164: cleanPhone,
      phone_raw: details.phone,
      email: '',
      website: details.website,
      rating: details.rating,
      reviews_count: details.reviewsCount,
      verified: true,
      listings_count: 1,
      profile_url: profileUrl,
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `${details.name} is a top-rated local business in ${area}. Maps rating: ${details.rating} stars with ${details.reviewsCount} reviews. Phone: ${details.phone}`,
      notes: 'Scraped using Puppeteer Google Maps Free crawler.'
    };
  } catch (err) {
    console.error("Error extracting details:", err);
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
      business_summary: 'Lagos Island Dental Care is a top-rated local business in Lagos Island. Maps rating: 4.8 stars with 120 reviews.',
      notes: 'Sandbox mode lead.'
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
      notes: 'Sandbox mode lead.'
    }
  ];
}
