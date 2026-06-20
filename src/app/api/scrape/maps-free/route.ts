import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';

// ============================================================================
// Sandbox Mock Lead Generator
// ============================================================================

function generateMockMapsFreeLeads(query: string, limit: number): Partial<Lead>[] {
  const businesses = [
    { name: "Ikeja Auto Care", phone: "08012345678", category: "Car Repair", area: "Ikeja", desc: "Professional automobile servicing and repairs in Ikeja." },
    { name: "Lekki Dental Clinic", phone: "09098765432", category: "Dental Clinic", area: "Lekki Phase 2", desc: "Family-friendly dental hygiene and surgery clinic in Lekki." },
    { name: "Yaba Tech Cafe", phone: "08034567890", category: "Cafe", area: "Yaba", desc: "Co-working space and cafe for freelancers and engineers in Yaba." },
    { name: "Surulere Fashion Studio", phone: "07065678901", category: "Boutique", area: "Surulere", desc: "Tailoring and ready-to-wear boutique in the heart of Surulere." },
    { name: "Maryland Event Caterers", phone: "08156789012", category: "Catering Services", area: "Maryland", desc: "Corporate event and party catering services." },
    { name: "Victoria Island Spa", phone: "08022334455", category: "Spa", area: "Victoria Island", desc: "Luxury massage, facial, and wellness treatments." }
  ];

  const results: Partial<Lead>[] = [];
  const count = limit || 10;

  for (let i = 0; i < count; i++) {
    const template = businesses[i % businesses.length];
    const name = count > businesses.length ? `${template.name} #${Math.floor(i / businesses.length) + 1}` : template.name;
    const tsStr = String(Date.now());
    const randPart = tsStr.substring(tsStr.length - 5);
    const phoneNum = template.phone.substring(0, 5) + randPart + String(i % 10);
    const cleanPhone = normalizePhone(phoneNum, 'NG') || phoneNum;

    results.push({
      lead_id: `mock_mapsfree_${Date.now()}_${i}`,
      source: 'MAPS_FREE',
      name: name,
      category: template.category,
      address: `${template.area}, Lagos, Nigeria`,
      area: template.area,
      city: 'Lagos',
      phone_e164: cleanPhone,
      phone_raw: phoneNum,
      email: '',
      website: '', // Key qualify criteria: no website
      rating: Number((4.2 + Math.random() * 0.7).toFixed(1)),
      reviews_count: Math.floor(Math.random() * 30) + 2,
      verified: Math.random() > 0.5,
      listings_count: 1,
      profile_url: `https://www.google.com/maps/search/${encodeURIComponent(query)}?index=${i}&ts=${Date.now()}`,
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `${name} offers premium ${template.category.toLowerCase()} services in ${template.area}. Rated highly on Maps.`,
      notes: 'Imported via Playwright Google Maps Free Sandbox.'
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
      await addLog('Maps-Free Scraper', 'START', `Launching Google Maps Free Sandbox for query: "${query}" (limit: ${limit})`);
      const mockLeads = generateMockMapsFreeLeads(query, limit);
      const dbResult = await saveLeads(mockLeads);
      await addLog('Maps-Free Scraper', 'SUCCESS', `Sandbox simulation complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'sandbox',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: mockLeads
      });
    }

    await addLog('Maps-Free Scraper', 'START', `Starting Google Maps Free Playwright crawl for query: "${query}"`);

    let browser;
    let scrapedLeads: Partial<Lead>[] = [];

    try {
      const { launchBrowser } = await import('@/lib/playwrightLauncher');
      browser = await launchBrowser();
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 800 }
      });
      const page = await context.newPage();

      // Navigate directly to Google Maps search URL
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Click on Reject All or Accept All if GDPR banner pops up
      try {
        const rejectBtn = page.locator('button[aria-label*="Reject all"], button[aria-label*="reject"], button:has-text("Reject")').first();
        if (await rejectBtn.isVisible({ timeout: 2000 })) {
          await rejectBtn.click();
        }
      } catch (e) {
        // No GDPR overlay, ignore
      }

      // Wait for listing feed container to appear
      const feedSelector = '[role="feed"]';
      try {
        await page.waitForSelector(feedSelector, { timeout: 8000 });
      } catch (e) {
        // If not found, search might have resolved to a single business page directly!
      }

      // Check if we ended up directly on a business detail page
      const currentUrl = page.url();
      if (currentUrl.includes('/maps/place/')) {
        // Extract single lead directly
        const lead = await extractCurrentPlaceDetails(page, query);
        if (lead) scrapedLeads.push(lead);
      } else {
        // We are on a results list feed. Scroll to load items.
        const feed = page.locator(feedSelector);
        if (await feed.count() > 0) {
          // Scroll the feed container down several times
          for (let i = 0; i < 5; i++) {
            await page.mouse.wheel(0, 1500);
            await feed.evaluate(el => el.scrollBy(0, 1200));
            await page.waitForTimeout(1000);
          }
        }

        // Get place anchor links
        const links = await page.$$eval('a[href*="/maps/place/"]', anchors => 
          anchors.map(a => (a as HTMLAnchorElement).href)
        );

        // Deduplicate URLs
        const uniqueLinks = Array.from(new Set(links)).slice(0, Math.min(limit * 2, 12));

        for (const link of uniqueLinks) {
          if (scrapedLeads.length >= limit) break;
          try {
            await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 20000 });
            await page.waitForTimeout(800);
            const lead = await extractCurrentPlaceDetails(page, query);
            if (lead) {
              // We only want leads without a website
              if (!lead.website) {
                scrapedLeads.push(lead);
              }
            }
          } catch (err) {
            console.error(`Error loading place details for ${link}:`, err);
          }
        }
      }
    } catch (browserErr: any) {
      console.error("Playwright browser error:", browserErr);
      await addLog('Maps-Free Scraper', 'ERROR', `Playwright failed: ${browserErr.message}`);
      return NextResponse.json({
        success: false,
        error: `Playwright failed: ${browserErr.message}`
      }, { status: 500 });
    } finally {
      if (browser) await browser.close();
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
      await addLog('Maps-Free Scraper', 'INFO', `Search returned 0 valid qualified leads (without websites).`);
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
    // 1. Name
    const nameElem = page.locator('h1');
    const name = await nameElem.innerText() || 'Unknown Business';

    // 2. Rating & Reviews count
    let rating = 0;
    let reviewsCount = 0;
    try {
      // Look for rating value (e.g. "4.7")
      const ratingText = await page.locator('div.F7nice span[aria-hidden="true"]').first().innerText();
      if (ratingText) rating = parseFloat(ratingText.trim());
      
      // Look for reviews count text (e.g. "(35)")
      const reviewsText = await page.locator('div.F7nice span[aria-label*="reviews"]').first().innerText();
      if (reviewsText) {
        const cleaned = reviewsText.replace(/\D/g, '');
        if (cleaned) reviewsCount = parseInt(cleaned, 10);
      }
    } catch (e) {
      // Keep defaults
    }

    // 3. Address
    let address = '';
    try {
      const addressBtn = page.locator('button[data-item-id="address"]');
      if (await addressBtn.count() > 0) {
        address = await addressBtn.innerText();
      }
    } catch (e) {
      // Fallback selector
    }

    // 4. Phone
    let phone = '';
    try {
      const phoneBtn = page.locator('button[data-item-id^="phone:tel:"]');
      if (await phoneBtn.count() > 0) {
        phone = await phoneBtn.innerText();
      }
    } catch (e) {
      // Ignore
    }

    // 5. Website
    let website = '';
    try {
      const webBtn = page.locator('a[data-item-id="authority"]');
      if (await webBtn.count() > 0) {
        website = await webBtn.getAttribute('href') || '';
      }
    } catch (e) {
      // Ignore
    }

    const cleanPhone = phone ? normalizePhone(phone, 'NG') : null;
    if (!cleanPhone) return null;
    const parts = address.split(',');
    const area = parts[1] ? parts[1].trim() : parts[0] || 'Lagos';

    return {
      lead_id: `mapsfree_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      source: 'MAPS_FREE',
      name: name.trim(),
      category: query.split('in')[0]?.trim() || 'Business',
      address: address.trim(),
      area: area,
      city: 'Lagos',
      phone_e164: cleanPhone,
      phone_raw: phone.trim(),
      email: '',
      website: website.trim(),
      rating: rating,
      reviews_count: reviewsCount,
      verified: true,
      listings_count: 1,
      profile_url: page.url(),
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `${name.trim()} is a top-rated local business in ${area}. Maps rating: ${rating} stars with ${reviewsCount} reviews. Phone: ${phone}`,
      notes: 'Scraped using Playwright Google Maps Free crawler.'
    };
  } catch (err) {
    console.error("Error extracting details:", err);
    return null;
  }
}
