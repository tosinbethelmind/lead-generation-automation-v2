import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';

// ============================================================================
// Sandbox Lagos Jiji Listing Generator
// ============================================================================

function generateMockJijiLeads(seedUrl: string, limit: number): Partial<Lead>[] {
  const listings = [
    { title: "Toyota Camry 2015 Silver", phone: "08193456789", category: "Cars", price: "₦6,500,000", area: "Ikeja", desc: "Super clean Toyota Camry 2015, foreign used, low mileage, buy and drive." },
    { title: "Serviced 3 Bedroom Apartment Lekki", phone: "09099456789", category: "Real Estate", price: "₦4,500,000/year", area: "Lekki Phase 1", desc: "Luxury 3 bedroom serviced flat in Lekki Phase 1, fully fitted kitchen, 24/7 power." },
    { title: "HP EliteBook 840 G5 Core i7", phone: "08099567890", category: "Computers", price: "₦380,000", area: "Yaba", desc: "Hp Elitebook 840 G5 Intel Core i7 8GB RAM 256GB SSD, pristine condition." },
    { title: "Bespoke Italian Leather Shoes", phone: "07099678901", category: "Fashion", price: "₦45,000", area: "Surulere", desc: "Premium quality hand-crafted bespoke Italian leather shoes, all sizes available." },
    { title: "Commercial Generator 20KVA", phone: "08199789012", category: "Machinery", price: "₦2,800,000", area: "Oshodi", desc: "Soundproof diesel generator 20KVA, perfect working order, serviced regularly." },
    { title: "Professional Event Catering Services", phone: "08099890123", category: "Services", price: "₦150,000", area: "Maryland", desc: "Get professional catering service for weddings, birthdays, and corporate events." }
  ];

  const results: Partial<Lead>[] = [];
  const numToGen = limit || 10;
  
  for (let i = 0; i < numToGen; i++) {
    const list = listings[i % listings.length];
    const title = numToGen > listings.length ? `${list.title} #${Math.floor(i / listings.length) + 1}` : list.title;
    const tsStr = String(Date.now());
    const randPart = tsStr.substring(tsStr.length - 5);
    const phoneNum = list.phone.substring(0, 5) + randPart + String(i % 10);
    const cleanPhone = normalizePhone(phoneNum, 'NG') || phoneNum;
    
    results.push({
      lead_id: `mock_jiji_${Date.now()}_${i}`,
      source: 'JIJI',
      name: `Vendor (${title.split(' ')[0]})`,
      category: list.category,
      address: `${list.area}, Lagos, Nigeria`,
      area: list.area,
      city: 'Lagos',
      phone_e164: cleanPhone,
      phone_raw: phoneNum,
      email: '',
      website: '',
      rating: Number((4.0 + Math.random() * 0.9).toFixed(1)),
      reviews_count: Math.floor(Math.random() * 40) + 1,
      verified: Math.random() > 0.4,
      listings_count: Math.floor(Math.random() * 15) + 1,
      profile_url: (seedUrl || 'https://jiji.ng/lagos') + ((seedUrl || 'https://jiji.ng/lagos').includes('?') ? '&' : '?') + `item=${i}_${Date.now()}`,
      source_query_or_seed: seedUrl || 'https://jiji.ng/lagos',
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `Jiji vendor listing for ${title} in ${list.area}. Price: ${list.price}. Description: ${list.desc}`,
      notes: 'Imported via Playwright Jiji Local Sandbox.'
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
    const { url, limit = 5 } = body;
    
    if (!url) {
      return NextResponse.json({ error: "Missing required url parameter." }, { status: 400 });
    }
    
    const config = getRuntimeConfig();
    const isSandbox = config.storageMode === 'local' || url.includes('sandbox') || url.includes('mock');
    
    if (isSandbox) {
      await addLog('Jiji Scraper', 'START', `Launching Jiji local sandbox for url: "${url}" (limit: ${limit})`);
      
      const mockLeads = generateMockJijiLeads(url, limit);
      const dbResult = await saveLeads(mockLeads);
      
      await addLog('Jiji Scraper', 'SUCCESS', `Sandbox crawling complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'sandbox',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: mockLeads
      });
    }
    
    // Live Playwright crawling (requires Chromium and headless browser environment)
    await addLog('Jiji Scraper', 'START', `Launching Playwright browser crawl for: "${url}"`);
    
    let browser;
    let newLeads: Partial<Lead>[] = [];
    try {
      const { launchBrowser } = await import('@/lib/playwrightLauncher');
      browser = await launchBrowser();
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });
      const page = await context.newPage();
      
      await page.goto(url, { waitUntil: 'commit', timeout: 30000 });
      await page.waitForTimeout(5000);
      
      // Extract listing items
      const items = await page.$$eval('.b-list-advert-base', (els: any[]) => {
        return els.slice(0, 10).map(el => {
          const titleEl = el.querySelector('.b-advert-title-inner, .qa-advert-list-item-title, .qa-advert-title span');
          const priceEl = el.querySelector('.b-list-advert__price, .qa-advert-list-item-price, .b-list-advert-base__item-price');
          const areaEl = el.querySelector('.b-list-advert__region, .qa-advert-list-item-region, .b-list-advert-base__region');
          const href = el.getAttribute('href') || el.querySelector('a')?.getAttribute('href') || '';
          
          // Resolve absolute URL if relative
          let absoluteUrl = href;
          if (href && !href.startsWith('http')) {
            absoluteUrl = 'https://jiji.ng' + (href.startsWith('/') ? '' : '/') + href;
          }
          
          return {
            title: titleEl ? titleEl.textContent.trim() : '',
            price: priceEl ? priceEl.textContent.trim() : '',
            area: areaEl ? areaEl.textContent.trim().split(',')[0] : 'Lagos',
            url: absoluteUrl
          };
        });
      });
      
      const leadLimit = Math.min(limit, items.length);
      
      for (let i = 0; i < leadLimit; i++) {
        const item = items[i];
        if (!item.url) continue;
        
        try {
          const detailPage = await context.newPage();
          await detailPage.goto(item.url, { waitUntil: 'commit', timeout: 30000 });
          await detailPage.waitForTimeout(5000);
          
          // Advanced evaluator to extract details from Nuxt State / WhatsApp Links
          const extracted = await detailPage.evaluate(() => {
            let phone = '';
            let sellerName = '';

            // 1. Scan script tags for NUXT state containing phone or wa.me links
            const scripts = Array.from(document.querySelectorAll('script'));
            for (const s of scripts) {
              const content = s.textContent || '';
              const id = s.id || '';
              const type = s.getAttribute('type') || '';
              if (
                id === '__NUXT_DATA__' ||
                type === 'application/json' ||
                content.includes('__NUXT__') ||
                content.includes('whatsapp_url') ||
                content.includes('wa.me/') ||
                content.includes('phone')
              ) {
                // Extract from wa.me
                const waMatch = content.match(/wa\.me\/(\d+)/) || content.match(/wa\.me%2F(\d+)/);
                if (waMatch && waMatch[1]) {
                  phone = waMatch[1];
                  break;
                }
                // Extract from "phone":"..."
                const phoneMatch = content.match(/"phone"\s*:\s*"(\+?\d+)"/);
                if (phoneMatch && phoneMatch[1]) {
                  phone = phoneMatch[1];
                  break;
                }
                // Extract from "whatsapp_url":"..."
                const waUrlMatch = content.match(/"whatsapp_url"\s*:\s*"([^"]+)"/);
                if (waUrlMatch && waUrlMatch[1]) {
                  const decoded = decodeURIComponent(waUrlMatch[1]);
                  const waMatch2 = decoded.match(/wa\.me\/(\d+)/);
                  if (waMatch2 && waMatch2[1]) {
                     phone = waMatch2[1];
                     break;
                  }
                }
              }
            }

            // 2. Fallback to WhatsApp DOM element link
            if (!phone) {
              const waEl = document.querySelector('a[href*="wa.me"], a[href*="whatsapp.com"]');
              if (waEl) {
                const href = waEl.getAttribute('href') || '';
                const match = href.match(/phone=(\d+)|wa\.me\/(\d+)/);
                if (match) {
                  phone = match[1] || match[2];
                }
              }
            }

            // 3. Fallback to tel: link
            if (!phone) {
              const telEl = document.querySelector('a[href^="tel:"]');
              if (telEl) {
                phone = telEl.getAttribute('href')?.replace('tel:', '') || '';
              }
            }

            // 4. Seller name extraction
            const sellerEl = document.querySelector('.b-seller-block__name, .qa-seller-name, [class*="seller-name"]');
            if (sellerEl) {
              sellerName = sellerEl.textContent.trim();
            }

            return { phone, sellerName };
          });

          let phone = extracted.phone || '';
          let vendorName = extracted.sellerName || 'Jiji Vendor';

          // 5. Interactive Button Reveal Fallback (only if phone is still empty)
          if (!phone) {
            try {
              const revealButton = await detailPage.$('.qa-show-contact, [class*="phone"], [class*="show-contact"]');
              if (revealButton) {
                await revealButton.click({ force: true, timeout: 5000 });
                await detailPage.waitForTimeout(1000);
                phone = await detailPage.$eval('[class*="phone-number"], [href^="tel:"], .qa-phone-number', (el: any) => el.textContent.trim()).catch(() => '');
              }
            } catch (clickErr) {
              console.log(`[Jiji Crawler] Interactive reveal click failed: ${clickErr instanceof Error ? clickErr.message : String(clickErr)}`);
            }
          }

          const normPhone = phone ? normalizePhone(phone, 'NG') : null;
          
          if (normPhone) {
            newLeads.push({
              lead_id: `jiji_${item.url.split('/').pop()?.split('.')[0] || Date.now()}_${i}`,
              source: 'JIJI',
              name: vendorName,
              category: 'Retail Vendor',
              address: `${item.area}, Lagos, Nigeria`,
              area: item.area,
              city: 'Lagos',
              phone_e164: normPhone,
              phone_raw: phone,
              email: '',
              website: '',
              rating: 4.5,
              reviews_count: 5,
              verified: true,
              listings_count: 3,
              profile_url: item.url,
              source_query_or_seed: url,
              collected_at: new Date().toISOString(),
              status: 'NEW',
              last_contacted_at: '',
              duplicate_of_lead_id: '',
              business_summary: `Jiji vendor listing: ${item.title}. Price: ${item.price}.`,
              notes: 'Imported via Playwright Chromium crawler.'
            });
          }
          
          await detailPage.close();
        } catch (err) {
          console.error('Failed to parse Jiji listing details for URL:', item.url, err);
        }
      }
      
      await browser.close();
    } catch (e: any) {
      if (browser) {
        try { await browser.close(); } catch (cbErr) {}
      }
      await addLog('Jiji Scraper', 'ERROR', `Playwright crawl failed: ${e.message}`);
      return NextResponse.json({
        success: false,
        error: `Playwright crawl failed: ${e.message}`
      }, { status: 500 });
    }
    
    const dbResult = await saveLeads(newLeads);
    await addLog('Jiji Scraper', 'SUCCESS', `Crawl complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
    
    return NextResponse.json({
      success: true,
      mode: 'cloud',
      added: dbResult.added,
      skipped: dbResult.skipped,
      leads: newLeads
    });
    
  } catch (e: any) {
    await addLog('Jiji Scraper', 'ERROR', `Jiji Playwright crawl failed: ${e.message}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
