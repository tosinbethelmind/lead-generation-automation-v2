/**
 * Jiji.ng Crawler API Route
 * 
 * VERCEL DEPLOYMENT LIMITATION NOTE:
 * Vercel serverless environments have severe size and dependency restrictions. They do not
 * support full, heavyweight Playwright/Puppeteer browser binaries due to storage limits and
 * missing shared libraries. To run scrapers successfully in serverless functions on Vercel or
 * AWS Lambda, we use a lightweight Chromium binary via `@sparticuz/chromium` paired with
 * `puppeteer-core`. This adapter dynamically loads chromium in serverless mode, and searches
 * for local Google Chrome or Microsoft Edge installations during local development.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createScrapeJob, updateScrapeJobStatus } from '@/app/api/scrape/queue';
import { saveLeads, addLog, normalizePhone, Lead } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import os from 'os';
import fs from 'fs';

function getLocalChromePath(): string {
  const platform = os.platform();
  if (platform === 'win32') {
    const paths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) return p;
    }
  } else if (platform === 'darwin') {
    const paths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) return p;
    }
  } else {
    const paths = [
      '/usr/bin/google-chrome',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser'
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) return p;
    }
  }
  return '';
}

async function getBrowser() {
  const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);
  if (isServerless) {
    const executablePath = await chromium.executablePath();
    return await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless === 'shell' ? 'shell' : chromium.headless,
    });
  } else {
    const localPath = getLocalChromePath();
    if (localPath) {
      return await puppeteer.launch({
        executablePath: localPath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
}

// ============================================================================
// Sandbox Mock Jiji Lead Generator
// ============================================================================

function generateMockJijiLeads(url: string, limit: number): Partial<Lead>[] {
  const businesses = [
    { name: "Apex Solar Systems Lagos", phone: "08031122334", category: "Solar Installer", area: "Ikeja", desc: "Premium solar panel installations, inverter setup, and lithium battery supply in Ikeja." },
    { name: "Lekki Solar Pro", phone: "09088776655", category: "Solar Installer", area: "Lekki Phase 1", desc: "Residential and commercial solar energy power solutions in Lekki." },
    { name: "Yaba Solar Tech", phone: "08055667788", category: "Solar Installer", area: "Yaba", desc: "Affordable solar inverter systems and clean energy consulting for startups." },
    { name: "Surulere Renewable Energy", phone: "07033445566", category: "Solar Installer", area: "Surulere", desc: "Solar panel sales, installation, maintenance and power system design." },
    { name: "Gbagada Inverter Solutions", phone: "08122334455", category: "Inverter Supplier", area: "Gbagada", desc: "High quality deep cycle batteries, hybrid inverters, and solar installation services." }
  ];

  const results: Partial<Lead>[] = [];
  const count = limit || 5;

  for (let i = 0; i < count; i++) {
    const template = businesses[i % businesses.length];
    const name = count > businesses.length ? `${template.name} #${Math.floor(i / businesses.length) + 1}` : template.name;
    const tsStr = String(Date.now());
    const randPart = tsStr.substring(tsStr.length - 5);
    const phoneNum = template.phone.substring(0, 5) + randPart + String(i % 10);
    const cleanPhone = normalizePhone(phoneNum, 'NG') || phoneNum;

    results.push({
      lead_id: `mock_jiji_${Date.now()}_${i}`,
      source: 'JIJI',
      name: name,
      category: template.category,
      address: `${template.area}, Lagos, Nigeria`,
      area: template.area,
      city: 'Lagos',
      phone_e164: cleanPhone,
      phone_raw: phoneNum,
      email: '',
      website: '', // Key qualify criteria: no website
      rating: Number((4.1 + Math.random() * 0.8).toFixed(1)),
      reviews_count: Math.floor(Math.random() * 15) + 1,
      verified: Math.random() > 0.5,
      listings_count: 1,
      profile_url: `${url}?item=${i}&ts=${Date.now()}`,
      source_query_or_seed: url,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `${name} listed on Jiji offering ${template.category.toLowerCase()} services. Description: "${template.desc}"`,
      notes: 'REAL SCRAPER FAILED - Showing Mock Data (Sandbox fallback)'
    });
  }

  return results;
}

/**
 * POST /api/scrape/jiji
 * Body: { url: string, options?: any, userId?: string }
 */
export async function POST(req: NextRequest) {
  let browser: any = null;
  let job: any = null;
  
  try {
    const { url, options = {}, userId } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    const config = getRuntimeConfig();
    const isSandbox = config.storageMode === 'local' || url.includes('sandbox') || url.includes('mock');

    // Create a job entry in database
    job = await createScrapeJob('jiji', { url, options }, userId);

    if (isSandbox) {
      // Direct sandbox execution
      await updateScrapeJobStatus(job.id, 'running');
      await addLog('Jiji Scraper', 'START', `Launching Jiji Sandbox for URL: "${url}"`);
      
      const limit = Number(options.limit) || 5;
      const mockLeads = generateMockJijiLeads(url, limit);
      const dbResult = await saveLeads(mockLeads);
      
      await updateScrapeJobStatus(job.id, 'completed', { result: { leads: mockLeads, added: dbResult.added, skipped: dbResult.skipped } });
      await addLog('Jiji Scraper', 'SUCCESS', `Jiji Sandbox simulation complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      
      return NextResponse.json({ jobId: job.id, status: 'completed', added: dbResult.added, skipped: dbResult.skipped, leads: mockLeads }, { status: 200 });
    }

    // Live scraping using Puppeteer
    await updateScrapeJobStatus(job.id, 'running');
    await addLog('Jiji Scraper', 'START', `Launching Jiji Puppeteer crawl for URL: "${url}"`);

    // 1. Launch Browser
    try {
      browser = await getBrowser();
    } catch (launchErr: any) {
      console.error('Failed to launch Puppeteer:', launchErr);
      await addLog('Jiji Scraper', 'ERROR', `Browser launch failed: ${launchErr.message}`);
      
      await updateScrapeJobStatus(job.id, 'failed', { error_message: 'browser_launch_failed' });
      return NextResponse.json({ success: false, error: 'browser_launch_failed', fallback: true }, { status: 500 });
    }

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    // 2. Navigate to search / category URL
    let targetUrl = url;
    if (!targetUrl.startsWith('http')) {
      const searchSlug = targetUrl.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      targetUrl = `https://jiji.ng/lagos/${searchSlug}`;
    }

    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Wait a brief moment to bypass loaders / CF check
    await new Promise(r => setTimeout(r, 5000));

    const title = await page.title();
    if (title.includes('Cloudflare') || title.includes('Attention Required')) {
      throw new Error('Blocked by Cloudflare protection page.');
    }

    // Scroll to trigger lazy loading
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await new Promise(r => setTimeout(r, 1000));
    }

    // 3. Extract listing cards
    const cardData = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.b-list-advert-base'));
      return els.map(el => {
        const titleEl = el.querySelector('.b-advert-title-inner, .qa-advert-list-item-title, .qa-advert-title span');
        const priceEl = el.querySelector('.b-list-advert__price, .qa-advert-list-item-price, .b-list-advert-base__item-price');
        const areaEl = el.querySelector('.b-list-advert__region, .qa-advert-list-item-region, .b-list-advert-base__region');
        const href = el.getAttribute('href') || el.querySelector('a')?.getAttribute('href') || '';
        
        let absoluteUrl = href;
        if (href && !href.startsWith('http')) {
          absoluteUrl = 'https://jiji.ng' + (href.startsWith('/') ? '' : '/') + href;
        }
        
        return {
          title: titleEl ? titleEl.textContent?.trim() || '' : '',
          price: priceEl ? priceEl.textContent?.trim() || '' : '',
          area: areaEl ? areaEl.textContent?.trim().split(',')[0] || '' : '',
          url: absoluteUrl
        };
      }).filter(item => item.title && item.url);
    });

    const limit = Number(options.limit) || 5;
    const targets = cardData.slice(0, limit);
    const scrapedLeads: Partial<Lead>[] = [];

    await addLog('Jiji Scraper', 'INFO', `Found ${cardData.length} items. Scraping details for top ${targets.length} listings...`);

    // 4. Scrape details page for phone number
    for (const target of targets) {
      try {
        await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await new Promise(r => setTimeout(r, 3000));

        // Click "Show contact" or "Show phone" button
        const clicked = await page.evaluate(async () => {
          const btn = Array.from(document.querySelectorAll('button, a, div, span')).find(el => {
            const text = el.textContent?.toLowerCase() || '';
            return text.includes('show contact') || text.includes('show phone') || text.includes('reveal contact');
          });
          if (btn) {
            (btn as HTMLElement).click();
            return true;
          }
          return false;
        });

        if (clicked) {
          await new Promise(r => setTimeout(r, 2000));
        }

        // Extract phone number, description, and review info
        const details = await page.evaluate(() => {
          const telLink = document.querySelector('a[href^="tel:"]');
          let phoneVal = '';
          if (telLink) {
            phoneVal = telLink.getAttribute('href')?.replace('tel:', '').trim() || '';
          } else {
            // RegEx search in elements
            const allElements = Array.from(document.querySelectorAll('span, div, p, button, a'));
            for (const el of allElements) {
              const text = el.textContent?.trim() || '';
              if (/^[+]?[0-9\s-]{7,15}$/.test(text) && (text.includes('080') || text.includes('081') || text.includes('090') || text.includes('070'))) {
                phoneVal = text;
                break;
              }
            }
          }

          const descEl = document.querySelector('.qa-advert-description-text, .b-advert-description-text');
          const desc = descEl ? descEl.textContent?.trim() || '' : '';

          return {
            phone: phoneVal,
            description: desc
          };
        });

        const cleanPhone = details.phone ? (normalizePhone(details.phone, 'NG') || details.phone) : '';
        
        // Skip leads with no phone number
        if (!cleanPhone) {
          continue;
        }

        const category = target.url.split('/')[4]?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Seller';

        scrapedLeads.push({
          lead_id: `jiji_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          source: 'JIJI',
          name: target.title,
          category: category,
          address: target.area ? `${target.area}, Lagos, Nigeria` : 'Lagos, Nigeria',
          area: target.area || 'Lagos',
          city: 'Lagos',
          phone_e164: cleanPhone,
          phone_raw: details.phone,
          email: '',
          website: '', // Jiji listings don't have websites
          rating: 4.0, // Default rating representation
          reviews_count: 1,
          verified: true,
          listings_count: 1,
          profile_url: target.url,
          source_query_or_seed: url,
          collected_at: new Date().toISOString(),
          status: 'NEW',
          last_contacted_at: '',
          duplicate_of_lead_id: '',
          business_summary: details.description || `${target.title} listed on Jiji in ${target.area}.`,
          notes: 'Scraped using Puppeteer Jiji crawler.'
        });

      } catch (itemErr: any) {
        console.error(`Error scraping detail page ${target.url}:`, itemErr);
      }
    }

    // 5. Save leads to database
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
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
  }
}
