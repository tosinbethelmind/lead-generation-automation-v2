import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone, extractPhonesFromText } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import * as cheerio from 'cheerio';

// ============================================================================
// Sandbox Mock Lead Generator for Social Platforms
// ============================================================================

function generateMockSocialLeads(platform: 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'LINKEDIN', query: string, limit: number): Partial<Lead>[] {
  const templates: Record<string, Array<{ name: string; handle: string; category: string; area: string; desc: string; followers: string; rating: number }>> = {
    INSTAGRAM: [
      { name: "Luxe Couture Lagos", handle: "@luxecouture_lagos", category: "Fashion & Clothing", area: "Lekki Phase 1", desc: "Premium designer wear, bespoke wedding dress styling, and ready-to-wear corporate outfits.", followers: "15.4K", rating: 4.8 },
      { name: "Yaba Tech & Gadgets Store", handle: "@yabagadgets", category: "Electronics Store", area: "Yaba", desc: "Best prices on UK/US used iPhones, MacBooks, and high-quality accessories in Lagos.", followers: "24.2K", rating: 4.7 },
      { name: "Glitz Beauty Studio", handle: "@glitz_beautysalon", category: "Cosmetics & Makeup", area: "Surulere", desc: "Professional bridal makeup, organic skincare products, and hair extensions supplier.", followers: "8.9K", rating: 4.9 },
      { name: "Healthy Bites Bakery", handle: "@healthybites_ng", category: "Food & Cakes", area: "Ikeja", desc: "Organic sugar-free snacks, customized birthday cakes, and freshly baked pastries.", followers: "12.1K", rating: 4.6 }
    ],
    FACEBOOK: [
      { name: "Zaron Cosmetics Lagos Distributor", handle: "fb/zaronlagosdistributor", category: "Cosmetics Shop", area: "Ikeja", desc: "Official retail store and wholesaler for premium Zaron beauty products in Nigeria.", followers: "45K likes", rating: 4.9 },
      { name: "Smart Autocare Center", handle: "fb/smartautocareng", category: "Car Dealership & Repair", area: "Gbagada", desc: "Imported certified foreign-used cars and expert mechanical diagnostic servicing.", followers: "32K likes", rating: 4.8 },
      { name: "Decor & Home Accents Nigeria", handle: "fb/decoraccentsng", category: "Home Goods Store", area: "Victoria Island", desc: "High-end luxury furniture, custom throw pillows, curtains, and home styling items.", followers: "18K likes", rating: 4.7 }
    ],
    TIKTOK: [
      { name: "Trend & Style Nigeria", handle: "@trendystyleng", category: "Clothing Store", area: "Lagos Mainland", desc: "Viral fashion fits, styling ideas, and worldwide delivery on wholesale clothing.", followers: "120K", rating: 4.9 },
      { name: "Cakes by Divine Lagos", handle: "@cakesbydivinelagos", category: "Pastry Shop", area: "Festac Town", desc: "ASMR baking videos, wedding cake tutorials, and Lagos cake orders delivery.", followers: "88K", rating: 4.7 },
      { name: "HypeFootwear Nigeria", handle: "@hypefootwear_ng", category: "Shoe Store", area: "Surulere", desc: "Authentic sneakers, Yeezys, Jordans, and designer slides. Next-day delivery.", followers: "55K", rating: 4.8 }
    ],
    LINKEDIN: [
      { name: "Bethel Trading B2B E-Commerce", handle: "company/betheltrading", category: "Wholesale Trade Agency", area: "Victoria Island", desc: "Providing manufacturing supplies, B2B wholesale electronics distribution, and logistics across West Africa.", followers: "8.2K followers", rating: 4.6 },
      { name: "Lagos Crafts and Exports Co.", handle: "company/lagoscrafts", category: "E-Commerce Supplier", area: "Ikeja", desc: "Exporters of premium African leather crafts, handmade home decor items, and textiles worldwide.", followers: "3.4K followers", rating: 4.5 },
      { name: "SwiftTech Logistics Solutions", handle: "company/swifttechlogistics", category: "Logistics and Supply Chain", area: "Apapa", desc: "Reliable B2B warehousing, e-commerce dropshipping fulfillment services, and freight clearing.", followers: "12.8K followers", rating: 4.7 }
    ]
  };

  const pool = templates[platform] || templates.INSTAGRAM;
  const results: Partial<Lead>[] = [];
  const count = limit || 10;

  for (let i = 0; i < count; i++) {
    const item = pool[i % pool.length];
    const name = count > pool.length ? `${item.name} #${Math.floor(i / pool.length) + 1}` : item.name;
    const handle = count > pool.length ? `${item.handle}${i}` : item.handle;
    const generatedId = `mock_social_${platform.toLowerCase()}_${Date.now()}_${i}`;
    let profileUrl = '';
    if (platform === 'INSTAGRAM') {
      profileUrl = `https://www.instagram.com/${handle.replace('@', '')}/`;
    } else if (platform === 'FACEBOOK') {
      profileUrl = `https://www.facebook.com/${handle.replace('fb/', '')}/`;
    } else if (platform === 'TIKTOK') {
      profileUrl = `https://www.tiktok.com/${handle}/`;
    } else {
      profileUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(name)}`;
    }

    const platformSuffix = platform === 'INSTAGRAM' ? '1' : platform === 'FACEBOOK' ? '2' : platform === 'TIKTOK' ? '3' : '4';
    const tsStr = String(Date.now());
    const randPart = tsStr.substring(tsStr.length - 4);
    const uniquePhone = `0801234${platformSuffix}${randPart}`;

    results.push({
      lead_id: generatedId,
      source: platform,
      name: name,
      category: item.category,
      address: `${item.area}, Lagos, Nigeria`,
      area: item.area,
      city: 'Lagos',
      phone_e164: normalizePhone(uniquePhone, 'NG') || '',
      phone_raw: uniquePhone,
      email: `${handle.replace('@', '').replace('fb/', '').replace('company/', '')}@gmail.com`,
      website: '', // Social sellers rarely have standalone websites, making them prime targets!
      rating: item.rating,
      reviews_count: Math.floor(Math.random() * 200) + 15,
      verified: true,
      listings_count: 1,
      profile_url: profileUrl + `?ts=${Date.now()}_${i}`,
      source_query_or_seed: query,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `${name} is an active e-commerce account on ${platform} with ${item.followers}. Bios: "${item.desc}"`,
      notes: `Imported via ${platform} Scraper Sandbox. Target Criteria: High Quality E-Commerce Business.`
    });
  }

  return results;
}

// ============================================================================
// Next.js Route Handler
// ============================================================================

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

    const config = getRuntimeConfig();
    const isSandbox = config.storageMode === 'local' || query.includes('sandbox') || query.includes('mock');

    if (isSandbox) {
      await addLog('Social Scraper', 'START', `Launching ${platUpper} Sandbox for query: "${query}" (limit: ${limit})`);
      const mockLeads = generateMockSocialLeads(platUpper, query, limit);
      const dbResult = await saveLeads(mockLeads);
      await addLog('Social Scraper', 'SUCCESS', `${platUpper} Sandbox simulation complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'sandbox',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: mockLeads
      });
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
      
      if (isSandbox) {
        await addLog('Social Scraper', 'WARN', `Falling back to sandbox.`);
        const mockLeads = generateMockSocialLeads(platUpper, query, limit);
        const dbResult = await saveLeads(mockLeads);
        return NextResponse.json({
          success: true,
          mode: 'sandbox_fallback',
          added: dbResult.added,
          skipped: dbResult.skipped,
          leads: mockLeads
        });
      }
      
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
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
      
      if (phones && phones.length > 0) {
        const cleanPhone = phones[0];

        scrapedLeads.push({
          lead_id: `social_${platUpper.toLowerCase()}_${Date.now()}_${idx}`,
          source: platUpper,
          name: name || `E-commerce ${platUpper}`,
          category: 'E-Commerce Business',
          address: 'Lagos, Nigeria',
          area: 'Lagos',
          city: 'Lagos',
          phone_e164: cleanPhone,
          phone_raw: cleanPhone,
          email: '',
          website: '', // Social accounts are our primary targets
          rating: 4.5,
          reviews_count: 50,
          verified: false,
          listings_count: 1,
          profile_url: platUpper === 'LINKEDIN' ? `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(name)}` : link,
          source_query_or_seed: query,
          collected_at: new Date().toISOString(),
          status: 'NEW',
          last_contacted_at: '',
          duplicate_of_lead_id: '',
          business_summary: snippet.trim() || `${name} social commerce seller listing.`,
          notes: `Social seller page extracted: ${link}`
        });
      }
    });

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
      if (isSandbox) {
        // Fallback to sandbox if no matches found
        await addLog('Social Scraper', 'INFO', `Scraped 0 leads from live index. Loading sandbox fallback.`);
        const mockLeads = generateMockSocialLeads(platUpper, query, limit);
        const dbResult = await saveLeads(mockLeads);
        return NextResponse.json({
          success: true,
          mode: 'sandbox_fallback',
          added: dbResult.added,
          skipped: dbResult.skipped,
          leads: mockLeads
        });
      }
      
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
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
