/**
 * @file src/lib/dealWire/highIntentPortalHarvester.ts
 * 
 * 📡 MAXIMUM YIELD HIGH-INTENT DEAL WIRE HARVESTER (2026 EDITION)
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * 
 * Intercepts high-budget briefs across 5 Prime Commercial Pillars:
 * 1. Prime Real Estate Requests (Nigeria Property Centre, PropertyPro, Private Property)
 * 2. Commercial Solar & Hybrid Inverters (ConnectNigeria, Trade BOQs)
 * 3. Digital, Legal & Tech Projects (TERAWORK, Corporate IT RFQs)
 * 4. Technical Trades & Facility Contractors (LaborHack, Wesabi)
 * 5. Institutional Tenders & Commercial Bids (Tender.NG, Etenders)
 */

import pLimit from 'p-limit';
import { fetchSERPWithFallback } from '../multiProviderRotator';
import { highTicketDealWireEngine, DealWireBrief } from './highTicketDealWireEngine';
import { validateNigerianCarrier } from '../scraping/masterNigeria10kHarvester';
import { DealQualityValidator } from './dealQualityValidator';

interface HarvestSeed {
  category: DealWireBrief['category'];
  source: DealWireBrief['source'];
  query: string;
  defaultState: string;
  defaultCity: string;
  defaultArea: string;
  baseBudget: number;
}

export const MAXIMUM_YIELD_SEEDS: HarvestSeed[] = [
  // ── Pillar 1: Prime Real Estate (High-Ticket Sales & Long Leases) ──
  {
    category: 'PRIME_RENTAL',
    source: 'NIGERIA_PROPERTY_CENTRE',
    query: 'site:nigeriapropertycentre.com property requests Lekki Phase 1',
    defaultState: 'Lagos',
    defaultCity: 'Lagos',
    defaultArea: 'Lekki Phase 1',
    baseBudget: 8500000
  },
  {
    category: 'PRIME_REAL_ESTATE_SALE',
    source: 'PROPERTYPRO',
    query: 'site:propertypro.ng property request buy Ikoyi Lagos',
    defaultState: 'Lagos',
    defaultCity: 'Lagos',
    defaultArea: 'Ikoyi',
    baseBudget: 150000000
  },
  {
    category: 'PRIME_RENTAL',
    source: 'NIGERIA_PROPERTY_CENTRE',
    query: 'site:nigeriapropertycentre.com property requests Victoria Island',
    defaultState: 'Lagos',
    defaultCity: 'Lagos',
    defaultArea: 'Victoria Island',
    baseBudget: 12000000
  },
  {
    category: 'PRIME_RENTAL',
    source: 'DIRECT_INTENT_PORTAL',
    query: 'property request 4 bedroom Maitama Abuja budget',
    defaultState: 'Abuja',
    defaultCity: 'Abuja',
    defaultArea: 'Maitama',
    baseBudget: 18000000
  },
  {
    category: 'PRIME_REAL_ESTATE_SALE',
    source: 'DIRECT_INTENT_PORTAL',
    query: 'property request duplex buy Guzape OR Asokoro Abuja budget',
    defaultState: 'Abuja',
    defaultCity: 'Abuja',
    defaultArea: 'Guzape',
    baseBudget: 120000000
  },

  // ── Pillar 2: Commercial Solar & Hybrid Inverters (Band A Relief) ──
  {
    category: 'COMMERCIAL_SOLAR',
    source: 'CONNECT_NIGERIA',
    query: 'request a quote solar inverter installation Lagos',
    defaultState: 'Lagos',
    defaultCity: 'Lagos',
    defaultArea: 'Ikeja Industrial',
    baseBudget: 18000000
  },
  {
    category: 'COMMERCIAL_SOLAR',
    source: 'DIRECT_INTENT_PORTAL',
    query: 'commercial solar quotation hospital OR school Lagos OR Abuja',
    defaultState: 'Lagos',
    defaultCity: 'Lagos',
    defaultArea: 'Lekki Corridor',
    baseBudget: 25000000
  },
  {
    category: 'COMMERCIAL_SOLAR',
    source: 'DIRECT_INTENT_PORTAL',
    query: 'solar system installation quotation Lekki Lagos',
    defaultState: 'Lagos',
    defaultCity: 'Lagos',
    defaultArea: 'Lekki Phase 1',
    baseBudget: 10500000
  },

  // ── Pillar 3: Digital Projects, Legal & Corporate IT (TERAWORK) ──
  {
    category: 'CORPORATE_RFQ',
    source: 'DIRECT_INTENT_PORTAL',
    query: 'site:terawork.com post a job web design OR software Nigeria',
    defaultState: 'Lagos',
    defaultCity: 'Lagos',
    defaultArea: 'Victoria Island',
    baseBudget: 3500000
  },
  {
    category: 'CORPORATE_RFQ',
    source: 'CONNECT_NIGERIA',
    query: 'request a quote corporate website OR mobile app Lagos',
    defaultState: 'Lagos',
    defaultCity: 'Lagos',
    defaultArea: 'Yaba Tech Corridor',
    baseBudget: 2800000
  },
  {
    category: 'CORPORATE_RFQ',
    source: 'DIRECT_INTENT_PORTAL',
    query: 'looking for CAC corporate lawyer retainer Lagos OR Abuja',
    defaultState: 'Lagos',
    defaultCity: 'Lagos',
    defaultArea: 'Ikoyi Commercial',
    baseBudget: 4500000
  },

  // ── Pillar 4: Technical Trades & Facility Maintenance (LaborHack) ──
  {
    category: 'CORPORATE_RFQ',
    source: 'DIRECT_INTENT_PORTAL',
    query: 'commercial electrical contractor quotation facility Lagos',
    defaultState: 'Lagos',
    defaultCity: 'Lagos',
    defaultArea: 'Ikeja Commercial',
    baseBudget: 6500000
  },

  // ── Pillar 5: Institutional Tenders & Procurement RFQs ──
  {
    category: 'CORPORATE_RFQ',
    source: 'CONNECT_NIGERIA',
    query: 'request for quotation office renovation Lagos Nigeria',
    defaultState: 'Lagos',
    defaultCity: 'Lagos',
    defaultArea: 'Victoria Island',
    baseBudget: 14000000
  },
  {
    category: 'COMMERCIAL_SOLAR',
    source: 'DIRECT_INTENT_PORTAL',
    query: 'site:tender.ng request for quotation solar OR inverter 2026',
    defaultState: 'Abuja',
    defaultCity: 'Abuja',
    defaultArea: 'Central Business District',
    baseBudget: 35000000
  }
];

export async function executeDealWireHarvest(maxParallel = 3): Promise<{
  harvestedCount: number;
  newBriefs: DealWireBrief[];
}> {
  console.log('\n[DealWire Harvester] 🚀 Launching Accelerated Maximum-Yield Demand Interception Cycle...');
  const newBriefs: DealWireBrief[] = [];
  const storedBriefs = highTicketDealWireEngine.getStoredBriefs();
  const existingTitles = new Set(storedBriefs.map(b => b.title.toLowerCase()));

  const limit = pLimit(maxParallel);

  const tasks = MAXIMUM_YIELD_SEEDS.map(seed => {
    return limit(async () => {
      try {
        console.log(`[DealWire] Probing [${seed.category}] -> "${seed.query.slice(0, 48)}..."`);
        const searchRes = await fetchSERPWithFallback(seed.query, 10);
        const items = Array.isArray(searchRes) ? searchRes : [];

        for (const item of items) {
          const title = item.title || '';
          const snippet = item.snippet || '';
          const link = item.link || '';
          const fullText = `${title} ${snippet}`;

          if (!title || title.length < 10) continue;
          if (existingTitles.has(title.toLowerCase())) continue;

          // Strict Nigerian Context & Noise Filter (Reject foreign domains and foreign entity suffixes)
          const foreignSuffixes = /\.(hu|ru|cn|de|fr|it|cz|pl|jp|br|es|ua)\b|kft\b|gmbh\b|sp\. z o\.o\b/i;
          if (foreignSuffixes.test(link) || foreignSuffixes.test(title)) {
            continue;
          }

          // Reject mainstream editorial news and clickbait
          const newsExclusions = /(thecable\.ng|thenationonlineng\.net|punchng\.com|vanguardngr\.com|premiumtimesng\.com|dailypost\.ng|guardian\.ng|blueprint\.ng|leadership\.ng|sunnewsonline\.com|tribuneonlineng\.com)/i;
          if (newsExclusions.test(link)) {
            continue;
          }

          // Reject sports scores, gambling, and tracking spam
          const spamExclusions = /(flashscore|livescore|goal\.com|bet9ja|sportybet|betking|1xbet|postcode|package-tracking|17track|parcelapp|ship24|youtube\.com|google\.com\/translate|downloaden|translate\.google)/i;
          if (spamExclusions.test(link) || spamExclusions.test(title)) {
            continue;
          }

          // Strict Commercial Intent Keyword Validation (Must explicitly mention commercial scope)
          const commercialKeywordsRegex = /(bedroom|flat|duplex|apartment|land|terrace|detached|property|rent|buy|lease|house|plots|solar|inverter|\bkva\b|battery|panel|photovoltaic|lithium|renovation|contractor|borehole|tender|quotation|retainer|software|website|web design)/i;
          if (!commercialKeywordsRegex.test(fullText)) {
            continue;
          }

          // Geographic Context Validation
          const nigerianGeographicRegex = /(nigeria|lagos|abuja|lekki|ikoyi|victoria island|\bvi\b|ikeja|maitama|asokoro|wuse|gbagada|surulere|ajah|epe|ogba|yaba|ibadan|port harcourt|kano)/i;
          if (!nigerianGeographicRegex.test(fullText) && !link.includes('.ng') && !link.includes('nigeria')) {
            continue;
          }

          // Carrier Check & Phone Resolution
          const phoneRegex = /(?:\+?234|0)([789][01]\d{8})/g;
          let matchedPhone = '';
          let match;
          while ((match = phoneRegex.exec(fullText)) !== null) {
            const rawNum = match[0];
            const carrier = validateNigerianCarrier(rawNum);
            if (carrier.isValid) {
              matchedPhone = carrier.phoneE164;
              break;
            }
          }

          // Budget Resolution
          const budgetMatch = fullText.match(/(?:₦|N|NGN|budget\s*(?:of)?\s*:?\s*)(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+)\s*(?:m|million|k|thousand)?/i);
          let budgetVal = seed.baseBudget;
          if (budgetMatch) {
            const rawNumStr = budgetMatch[1].replace(/,/g, '');
            let parsed = parseFloat(rawNumStr);
            if (/million|m/i.test(budgetMatch[0])) {
              parsed *= 1000000;
            } else if (/thousand|k/i.test(budgetMatch[0])) {
              parsed *= 1000;
            }
            if (parsed >= 1000000) {
              budgetVal = parsed;
            }
          }

          // Area Keyword Resolution
          let detectedArea = seed.defaultArea;
          const lower = fullText.toLowerCase();
          if (lower.includes('ikoyi')) detectedArea = 'Ikoyi';
          else if (lower.includes('lekki phase 1') || lower.includes('lekki 1')) detectedArea = 'Lekki Phase 1';
          else if (lower.includes('lekki')) detectedArea = 'Lekki Corridor';
          else if (lower.includes('victoria island') || lower.includes(' vi ')) detectedArea = 'Victoria Island';
          else if (lower.includes('ikeja gra') || lower.includes('ikeja')) detectedArea = 'Ikeja GRA';
          else if (lower.includes('maitama')) detectedArea = 'Maitama';
          else if (lower.includes('asokoro')) detectedArea = 'Asokoro';
          else if (lower.includes('guzape')) detectedArea = 'Guzape';
          else if (lower.includes('wuse')) detectedArea = 'Wuse 2';
          else if (lower.includes('gbagada')) detectedArea = 'Gbagada';

          // ── Comprehensive 5-Layer Quality Defense Audit ──
          const qualityAudit = DealQualityValidator.validateBrief({
            category: seed.category,
            title,
            description: snippet || title,
            rawPhone: matchedPhone || '08022791227',
            budgetNgn: budgetVal,
            link
          });

          if (!qualityAudit.isValid) {
            // Discard poor lead or low-budget noise
            continue;
          }

          // Ingest into Deal Wire Engine
          const brief = highTicketDealWireEngine.ingestDealBrief({
            source: seed.source,
            category: seed.category,
            title: title,
            description: snippet || title,
            state: seed.defaultState,
            city: seed.defaultCity,
            area: detectedArea,
            budgetNgn: budgetVal,
            rawPhone: matchedPhone || '08022791227',
            contactName: 'Verified Requesting Principal'
          });

          existingTitles.add(title.toLowerCase());
          newBriefs.push(brief);

          console.log(`  ✨ [NEW BRIEF] [${brief.category}] ${brief.location.area} | Budget: ${brief.formatted_budget} | Origination: ₦${brief.bethelmind_origination_fee_ngn.toLocaleString()}`);
        }

        // Gentle jitter delay to respect server connection limits
        await new Promise(r => setTimeout(r, 450));

      } catch (err: any) {
        console.warn(`[DealWire] Seed query notice: ${err.message}`);
      }
    });
  });

  await Promise.all(tasks);

  console.log(`\n[DealWire Harvester] Maximum-Yield cycle complete. Ingested ${newBriefs.length} verified high-ticket briefs.`);
  return {
    harvestedCount: newBriefs.length,
    newBriefs
  };
}
