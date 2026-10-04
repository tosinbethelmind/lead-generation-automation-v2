/**
 * @file src/lib/scraping/breakthroughTrioHarvester.ts
 * 
 * 🇳🇬 ACCELERATED BREAKTHROUGH TRIO HARVESTER (2026 EDITION)
 * Bethelmind Analytics Lagos Desk · Commercial B2B Revenue Growth Engine
 * 
 * Exclusively focused on the 3 Highest-Breakthrough Sectors in Nigeria:
 * 1. ⚡ Commercial Solar & Inverter Showrooms / Contractors (Fastest 24-48h cash close)
 * 2. 🏢 Boutique Real Estate Brokerages & Off-Plan Teams (Highest ticket size, 5-20 agents)
 * 3. 🏖️ High-Yield Serviced Apartments & Shortlet Portfolios (5-20 units, daily booking flow)
 * 
 * Target Major Cities:
 * - Lagos (Ikeja Allen/Toyin, Lekki Phase 1, Victoria Island, Ajah, Surulere, Trade Fair)
 * - Abuja FCT (Maitama, Wuse 2, Utako, Jabi, Garki, Guzape)
 * - Port Harcourt (Trans-Amadi, Peter Odili, New GRA)
 * - Ibadan (Bodija, Ring Road, Dugbe, Oluyole)
 * - Onitsha & Enugu (Bridgehead, Main Market, Independence Layout)
 * - Kano & Kaduna (Commercial Trade Corridors)
 */

import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');
} catch (_) {}

import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import pLimit from 'p-limit';
import { validateNigerianCarrier } from './masterNigeria10kHarvester';
import { extractEmailsFromText } from '../leadEnricher';
import { getSupabaseClient } from '../supabaseClient';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from '../atomicIo';

const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');
const LEADS_DB_PATH = path.join(LOCAL_DB_DIR, 'leads_db.json');

const keepAliveHttp = new http.Agent({ keepAlive: true, maxSockets: 50 });
const keepAliveHttps = new https.Agent({ keepAlive: true, maxSockets: 50 });

const httpClient = axios.create({
  httpAgent: keepAliveHttp,
  httpsAgent: keepAliveHttps,
  timeout: 6000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br'
  }
});

export interface BreakthroughLead {
  lead_id: string;
  id?: string;
  source: 'BUSINESSLIST' | 'FINELIB' | 'JIJI' | 'GOOGLE_DORK' | 'BING_SERP';
  name: string;
  business_name: string;
  sector_pillar: 'SOLAR' | 'REAL_ESTATE' | 'SHORTLET';
  category: string;
  address: string;
  area: string;
  city: string;
  state: string;
  phone_raw: string;
  phone_e164: string;
  phone: string;
  carrier: string;
  email: string;
  website: string;
  has_website: boolean;
  preview_slug: string;
  preview_url: string;
  trojan_hook_sms: string;
  trojan_hook_wa: string;
  status: string;
  collected_at: string;
  verified: boolean;
}

export const TRIO_SECTOR_TAXONOMY = {
  SOLAR: {
    key: 'SOLAR',
    label: 'Solar & Renewable Energy',
    bizlistPaths: ['category/solar-energy', 'category/alternative-energy'],
    finelibPaths: ['business/energy/alternative-energy/solar-energy'],
    dorkQueries: [
      'solar inverter installation lagos phone',
      'solar panel showroom ikeja contact',
      'solar energy company abuja phone',
      'inverter lithium battery port harcourt phone',
      'solar installer ibadan contact'
    ],
    toolName: 'Solar & Inverter System Sizing & Instant Quotation Engine',
    smsTemplate: (name: string) => `Good day ${name} team. After-hours solar clients wait hours for quotes. We built a 24/7 WhatsApp BOQ quoter for your firm. May I send a quick demo?`
  },
  REAL_ESTATE: {
    key: 'REAL_ESTATE',
    label: 'Real Estate & Luxury Homes',
    bizlistPaths: ['category/real-estate', 'category/estate-agents'],
    finelibPaths: ['business/real-estate/estate-surveyors-and-valuers', 'business/real-estate'],
    dorkQueries: [
      'real estate agency lekki phase 1 phone',
      'off plan properties developer ajah contact',
      'real estate brokerage abuja wuse 2 phone',
      'luxury property developer ikoyi lagos phone',
      'estate surveying port harcourt phone'
    ],
    toolName: 'Automated Real Estate Speed-to-Lead & Inspection Booking Locker',
    smsTemplate: (name: string) => `Good day ${name} team. Over 50% of ad leads go cold before agents respond. We built a sub-3s WhatsApp speed-to-lead quoter. May I send a demo?`
  },
  SHORTLET: {
    key: 'SHORTLET',
    label: 'Hotels & Shortlet Apartments',
    bizlistPaths: ['category/hotels', 'category/guest-houses'],
    finelibPaths: ['business/hotels-and-lodging/hotels', 'business/hotels-and-lodging/guest-houses'],
    dorkQueries: [
      'shortlet apartment lekki phase 1 whatsapp phone',
      'serviced apartments victoria island lagos contact',
      'luxury shortlet maitama abuja phone',
      'boutique hotel suites wuse 2 abuja phone',
      'serviced apartments new gra port harcourt'
    ],
    toolName: 'Direct WhatsApp Booking & Caution Fee Lock Engine',
    smsTemplate: (name: string) => `Good day ${name} team. Guests checking rooms at night often book elsewhere or cost 18% on Airbnb. We built a direct WhatsApp booking tool. May I share a demo?`
  }
};

export class BreakthroughTrioHarvester {
  private seenPhones = new Set<string>();

  constructor() {
    this.initExistingPhones();
  }

  private initExistingPhones() {
    if (fs.existsSync(LEADS_DB_PATH)) {
      try {
        const raw = readJsonFileSyncWithRetry(LEADS_DB_PATH);
        if (Array.isArray(raw)) {
          for (const l of raw) {
            const p = l.phone_e164 || l.phone;
            if (p) this.seenPhones.add(p.replace(/\D/g, ''));
          }
        }
      } catch (_) {}
    }
  }

  /**
   * Entity Resolution & Cleaning: Rejects raw classified items ("300watts", "1kwh", "inches", "self contain")
   */
  public cleanBusinessEntityName(rawTitle: string, sector: 'SOLAR' | 'REAL_ESTATE' | 'SHORTLET'): { isValid: boolean; cleanName: string } {
    if (!rawTitle) return { isValid: false, cleanName: '' };

    let cleaned = rawTitle
      .split('||')[0]
      .split('|')[0]
      .split(' - ')[0]
      .replace(/\(.*?\)/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/https?:\/\/\S+/gi, '')
      .trim();

    // Check for classified item titles that are NOT businesses
    const isClassifiedItem = /^\d+(\.\d+)?\s*(watts|w|kva|kwh|hp|inches|in|ah|v|bed|room)\b/i.test(cleaned) ||
      /\b(with panel|rechargeable fan|brand new|fairly used|tokunbo for sale|promo price|per carton|per night|self contain|for rent|shared apartment)\b/i.test(cleaned);

    if (isClassifiedItem) {
      return { isValid: false, cleanName: '' };
    }

    if (cleaned.length < 3) return { isValid: false, cleanName: '' };

    if (cleaned.length > 32) {
      cleaned = cleaned.slice(0, 30).trim();
    }

    return { isValid: true, cleanName: cleaned };
  }

  /**
   * Scrapes BusinessList.com.ng for targeted high-ticket sectors
   */
  public async scrapeBusinessList(sector: 'SOLAR' | 'REAL_ESTATE' | 'SHORTLET', city = 'Lagos'): Promise<BreakthroughLead[]> {
    const config = TRIO_SECTOR_TAXONOMY[sector];
    const results: BreakthroughLead[] = [];
    const limit = pLimit(5);

    for (const catPath of config.bizlistPaths) {
      try {
        const url = `https://www.businesslist.com.ng/${catPath}`;
        const resp = await httpClient.get(url, { timeout: 4500 });
        if (!resp.data) continue;

        const $ = cheerio.load(typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data));
        const cards: { name: string; href: string; cardText: string; address: string }[] = [];

        $('.company, .company_header, div[class*="company"]').each((_, el) => {
          if (cards.length >= 25) return;
          const a = $(el).find('h4 a, h3 a, a.company_name, a[href*="/company/"]').first();
          let name = a.text().trim();
          const href = a.attr('href') || '';
          const address = $(el).find('.address, .location, [class*="address"]').first().text().trim();
          const cardText = $(el).text();

          if (name.includes('View Profile')) name = name.replace(/View Profile/gi, '').trim();
          if (name && href) {
            cards.push({ name, href, cardText, address });
          }
        });

        const cardTasks = cards.map(c => limit(async () => {
          const { isValid, cleanName } = this.cleanBusinessEntityName(c.name, sector);
          if (!isValid) return;

          let rawPhone = '';
          let email = '';
          const inlinePhones = c.cardText.match(/(?:(?:\+?234)|0)\s*[789][01](?:[\s.-]?\d){8}/g) || [];
          if (inlinePhones.length > 0) rawPhone = inlinePhones[0];

          const profileUrl = c.href.startsWith('http') ? c.href : `https://www.businesslist.com.ng${c.href.startsWith('/') ? '' : '/'}${c.href}`;

          if (!rawPhone) {
            try {
              const pResp = await httpClient.get(profileUrl, { timeout: 2500 });
              if (pResp.data) {
                const pHtml = typeof pResp.data === 'string' ? pResp.data : JSON.stringify(pResp.data);
                const pMatches = pHtml.match(/(?:(?:\+?234)|0)\s*[789][01](?:[\s.-]?\d){8}/g) || [];
                if (pMatches.length > 0) rawPhone = pMatches[0];
                const pEmails = extractEmailsFromText(pHtml);
                if (pEmails.length > 0) email = pEmails[0];
              }
            } catch (_) {}
          }

          if (!rawPhone) return;

          const carrierCheck = validateNigerianCarrier(rawPhone);
          if (!carrierCheck.isValid) return;

          const phoneDigits = carrierCheck.phoneE164.replace(/\D/g, '');
          if (this.seenPhones.has(phoneDigits)) return;
          this.seenPhones.add(phoneDigits);

          const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 20);
          const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
          const leadId = `trio_${sector.toLowerCase()}_${crypto.createHash('md5').update(phoneDigits).digest('hex').substring(0, 10)}`;

          results.push({
            lead_id: leadId,
            id: leadId,
            source: 'BUSINESSLIST',
            name: cleanName,
            business_name: cleanName,
            sector_pillar: sector,
            category: config.label,
            address: c.address || `${city}, Nigeria`,
            area: city,
            city: city,
            state: city === 'Abuja' ? 'Abuja FCT' : city,
            phone_raw: rawPhone,
            phone_e164: carrierCheck.phoneE164,
            phone: carrierCheck.phoneE164,
            carrier: carrierCheck.carrier,
            email: email,
            website: profileUrl,
            has_website: true,
            preview_slug: slug,
            preview_url: previewUrl,
            trojan_hook_sms: config.smsTemplate(cleanName.slice(0, 14)).slice(0, 158),
            trojan_hook_wa: `Hello ${cleanName}! We built a 24/7 prototype quoter for your brand: ${previewUrl} (Tap link to test)`,
            status: 'NEW',
            collected_at: new Date().toISOString(),
            verified: true
          });
        }));

        await Promise.allSettled(cardTasks);
      } catch (_) {}
    }

    return results;
  }

  /**
   * Scrapes Finelib.com for targeted high-ticket sectors
   */
  public async scrapeFinelib(sector: 'SOLAR' | 'REAL_ESTATE' | 'SHORTLET', city = 'Lagos'): Promise<BreakthroughLead[]> {
    const config = TRIO_SECTOR_TAXONOMY[sector];
    const results: BreakthroughLead[] = [];
    const limit = pLimit(5);

    for (const fPath of config.finelibPaths) {
      try {
        const url = `https://www.finelib.com/${fPath}`;
        const resp = await httpClient.get(url, { timeout: 4500 });
        if (!resp.data) continue;

        const $ = cheerio.load(typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data));
        const items: { name: string; link: string; summary: string }[] = [];

        $('dl dt').each((_, dt) => {
          if (items.length >= 20) return;
          const a = $(dt).find('a').first();
          let name = a.text().trim().replace(/^\d+\)\.?\s*/, '').trim();
          const link = a.attr('href') || '';
          const dd = $(dt).next('dd').text().trim();
          if (name && link) items.push({ name, link, summary: dd });
        });

        const detailTasks = items.map(item => limit(async () => {
          const { isValid, cleanName } = this.cleanBusinessEntityName(item.name, sector);
          if (!isValid) return;

          const fullUrl = item.link.startsWith('http') ? item.link : `https://www.finelib.com${item.link.startsWith('/') ? '' : '/'}${item.link}`;
          let rawPhone = '';
          let email = '';

          try {
            const pResp = await httpClient.get(fullUrl, { timeout: 2500 });
            if (pResp.data) {
              const pHtml = typeof pResp.data === 'string' ? pResp.data : JSON.stringify(pResp.data);
              const pMatches = pHtml.match(/(?:(?:\+?234)|0)\s*[789][01](?:[\s.-]?\d){8}/g) || [];
              if (pMatches.length > 0) rawPhone = pMatches[0];
              const pEmails = extractEmailsFromText(pHtml);
              if (pEmails.length > 0) email = pEmails[0];
            }
          } catch (_) {}

          if (!rawPhone) return;

          const carrierCheck = validateNigerianCarrier(rawPhone);
          if (!carrierCheck.isValid) return;

          const phoneDigits = carrierCheck.phoneE164.replace(/\D/g, '');
          if (this.seenPhones.has(phoneDigits)) return;
          this.seenPhones.add(phoneDigits);

          const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 20);
          const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
          const leadId = `trio_${sector.toLowerCase()}_${crypto.createHash('md5').update(phoneDigits).digest('hex').substring(0, 10)}`;

          results.push({
            lead_id: leadId,
            id: leadId,
            source: 'FINELIB',
            name: cleanName,
            business_name: cleanName,
            sector_pillar: sector,
            category: config.label,
            address: `${city}, Nigeria`,
            area: city,
            city: city,
            state: city === 'Abuja' ? 'Abuja FCT' : city,
            phone_raw: rawPhone,
            phone_e164: carrierCheck.phoneE164,
            phone: carrierCheck.phoneE164,
            carrier: carrierCheck.carrier,
            email: email,
            website: fullUrl,
            has_website: true,
            preview_slug: slug,
            preview_url: previewUrl,
            trojan_hook_sms: config.smsTemplate(cleanName.slice(0, 14)).slice(0, 158),
            trojan_hook_wa: `Hello ${cleanName}! We built a 24/7 prototype quoter for your brand: ${previewUrl} (Tap link to test)`,
            status: 'NEW',
            collected_at: new Date().toISOString(),
            verified: true
          });
        }));

        await Promise.allSettled(detailTasks);
      } catch (_) {}
    }

    return results;
  }

  /**
   * Scrapes Bing SERP for Targeted Social & Verified Enterprise Profiles with phone prefixes
   */
  public async scrapeBingDorks(sector: 'SOLAR' | 'REAL_ESTATE' | 'SHORTLET'): Promise<BreakthroughLead[]> {
    const config = TRIO_SECTOR_TAXONOMY[sector];
    const results: BreakthroughLead[] = [];

    for (const query of config.dorkQueries) {
      try {
        const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        const resp = await httpClient.get(searchUrl, { timeout: 4000 });
        if (!resp.data) continue;

        const $ = cheerio.load(typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data));

        $('#b_results .b_algo').each((_, el) => {
          if (results.length >= 10) return;
          const title = $(el).find('h2 a').text().trim();
          const snippet = $(el).find('.b_caption p, .b_algoSlug').text().trim();
          const href = $(el).find('h2 a').attr('href') || '';

          const { isValid, cleanName } = this.cleanBusinessEntityName(title, sector);
          if (!isValid) return;

          const combined = `${title} ${snippet}`;
          const pMatches = combined.match(/(?:(?:\+?234)|0)\s*[789][01](?:[\s.-]?\d){8}/g) || [];
          if (pMatches.length === 0) return;

          const carrierCheck = validateNigerianCarrier(pMatches[0]);
          if (!carrierCheck.isValid) return;

          const phoneDigits = carrierCheck.phoneE164.replace(/\D/g, '');
          if (this.seenPhones.has(phoneDigits)) return;
          this.seenPhones.add(phoneDigits);

          const emails = extractEmailsFromText(combined);
          const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 20);
          const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
          const leadId = `trio_${sector.toLowerCase()}_${crypto.createHash('md5').update(phoneDigits).digest('hex').substring(0, 10)}`;

          results.push({
            lead_id: leadId,
            id: leadId,
            source: 'BING_SERP',
            name: cleanName,
            business_name: cleanName,
            sector_pillar: sector,
            category: config.label,
            address: 'Lagos / Abuja Corridor, Nigeria',
            area: 'Commercial Hub',
            city: query.includes('abuja') ? 'Abuja' : (query.includes('port harcourt') ? 'Port Harcourt' : 'Lagos'),
            state: query.includes('abuja') ? 'Abuja FCT' : (query.includes('port harcourt') ? 'Rivers' : 'Lagos'),
            phone_raw: pMatches[0],
            phone_e164: carrierCheck.phoneE164,
            phone: carrierCheck.phoneE164,
            carrier: carrierCheck.carrier,
            email: emails[0] || '',
            website: href,
            has_website: true,
            preview_slug: slug,
            preview_url: previewUrl,
            trojan_hook_sms: config.smsTemplate(cleanName.slice(0, 14)).slice(0, 158),
            trojan_hook_wa: `Hello ${cleanName}! We built a 24/7 prototype quoter for your brand: ${previewUrl} (Tap link to test)`,
            status: 'NEW',
            collected_at: new Date().toISOString(),
            verified: true
          });
        });
      } catch (_) {}
    }

    return results;
  }

  /**
   * Master execution pass across all 3 sectors and cities
   */
  public async executeTrioHarvest(options: { targetLeads?: number; syncCloud?: boolean } = {}): Promise<{
    harvestedTotal: number;
    solarCount: number;
    realEstateCount: number;
    shortletCount: number;
    persistedToLocal: number;
    syncedToCloud: number;
  }> {
    const target = options.targetLeads || 150;
    const allHarvested: BreakthroughLead[] = [];

    console.log(`\n========================================================================`);
    console.log(`🚀 STARTING BREAKTHROUGH TRIO HARVESTER`);
    console.log(`🎯 Target Yield : ${target} High-Ticket Verified Commercial Leads`);
    console.log(`⚡ Track 1      : Solar & Inverter Showrooms / Engineering Firms`);
    console.log(`🏢 Track 2      : Boutique Real Estate Brokerages & Off-Plan Teams`);
    console.log(`🏖️ Track 3      : Serviced Apartments & High-Yield Shortlet Portfolios`);
    console.log(`📍 Cities Focus : Lagos, Abuja FCT, Port Harcourt, Ibadan`);
    console.log(`========================================================================\n`);

    const sectors: ('SOLAR' | 'REAL_ESTATE' | 'SHORTLET')[] = ['SOLAR', 'REAL_ESTATE', 'SHORTLET'];
    const cities = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan'];

    for (const sec of sectors) {
      console.log(`[HARVESTING PILLAR: ${sec}] Fetching verified listings...`);
      for (const city of cities) {
        if (allHarvested.length >= target) break;

        // 1. BusinessList
        const bLeads = await this.scrapeBusinessList(sec, city);
        allHarvested.push(...bLeads);
        if (bLeads.length > 0) console.log(`  ✓ BusinessList (${sec} | ${city}): +${bLeads.length} leads`);

        // 2. Finelib
        const fLeads = await this.scrapeFinelib(sec, city);
        allHarvested.push(...fLeads);
        if (fLeads.length > 0) console.log(`  ✓ Finelib (${sec} | ${city}): +${fLeads.length} leads`);
      }

      // 3. Search Engine Dorks
      const dLeads = await this.scrapeBingDorks(sec);
      allHarvested.push(...dLeads);
      if (dLeads.length > 0) console.log(`  ✓ Search Dorks (${sec}): +${dLeads.length} leads`);
    }

    const solarCount = allHarvested.filter(l => l.sector_pillar === 'SOLAR').length;
    const realEstateCount = allHarvested.filter(l => l.sector_pillar === 'REAL_ESTATE').length;
    const shortletCount = allHarvested.filter(l => l.sector_pillar === 'SHORTLET').length;

    // Persist to local_db/leads_db.json
    let persistedCount = 0;
    if (allHarvested.length > 0) {
      let existingLeads: any[] = [];
      if (fs.existsSync(LEADS_DB_PATH)) {
        try {
          const raw = readJsonFileSyncWithRetry(LEADS_DB_PATH);
          if (Array.isArray(raw)) existingLeads = raw;
        } catch (_) {}
      }

      const existingPhoneSet = new Set(existingLeads.map(l => (l.phone_e164 || l.phone || '').replace(/\D/g, '')));
      for (const fresh of allHarvested) {
        const pDigits = fresh.phone_e164.replace(/\D/g, '');
        if (!existingPhoneSet.has(pDigits)) {
          existingLeads.unshift(fresh);
          existingPhoneSet.add(pDigits);
          persistedCount++;
        }
      }

      writeJsonFileSyncAtomic(LEADS_DB_PATH, existingLeads);
      console.log(`\n💾 Persisted +${persistedCount} fresh leads into local_db/leads_db.json (Total now: ${existingLeads.length})`);
    }

    // Optional Supabase Cloud Sync
    let syncedCloud = 0;
    if (options.syncCloud && allHarvested.length > 0) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const payload = allHarvested.map(l => ({
            id: l.lead_id,
            name: l.name,
            business_name: l.business_name,
            category: l.category,
            phone: l.phone_e164,
            email: l.email || null,
            city: l.city,
            state: l.state,
            website: l.website,
            verified: true,
            status: 'NEW',
            created_at: new Date().toISOString()
          }));
          const { error } = await supabase.from('leads').upsert(payload, { onConflict: 'phone' });
          if (!error) syncedCloud = payload.length;
        }
      } catch (_) {}
    }

    return {
      harvestedTotal: allHarvested.length,
      solarCount,
      realEstateCount,
      shortletCount,
      persistedToLocal: persistedCount,
      syncedToCloud: syncedCloud
    };
  }
}

export const breakthroughTrioHarvester = new BreakthroughTrioHarvester();
