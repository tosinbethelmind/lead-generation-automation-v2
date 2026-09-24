/**
 * @file scripts/intelligence/opennews_harvester.js
 * 
 * 📰 OpenNews B2B Commercial & Regulatory News Harvester
 * 
 * MONETIZATION IMPACT:
 * Automatically harvests high-impact Nigerian economic, regulatory, and tariff news:
 * - Electricity Band A & diesel price spikes -> Instant Solar BOQ conversion angle
 * - Customs import duty FX benchmark shifts -> Auto & Spare parts importer angle
 * - CAC annual returns & compliance alerts -> SME website & legal setup angle
 * - Real estate inflation & off-plan remittance trends -> High-ticket property booking angle
 * 
 * Embeds contextual real-time hooks into outbound SMS, emails, and WhatsApp closer scripts.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../lib/logger');

// Curated Nigerian B2B News & Regulatory Feeds (BusinessDay, Nairametrics, Punch, CAC, Customs)
const NEWS_SOURCES = [
  {
    name: 'Nairametrics B2B',
    url: 'https://nairametrics.com/feed/',
    type: 'rss',
    primarySectors: ['solar', 'real_estate', 'auto', 'finance']
  },
  {
    name: 'BusinessDay Nigeria',
    url: 'https://businessday.ng/feed/',
    type: 'rss',
    primarySectors: ['corporate', 'logistics', 'sme', 'solar']
  }
];

// Fallback high-impact Nigerian commercial angles if network is offline
const DEFAULT_COMMERCIAL_ANGLES = {
  solar: {
    headline: 'Electricity Tariff Hikes & Rising Diesel Costs Drive Nigerian Commercial Demand',
    painHook: 'With Band A grid tariffs and diesel above ₦1,200/liter, businesses are losing millions monthly to generator overhead.',
    pitchAngle: 'We built a 24/7 WhatsApp Solar BOQ Load Sizer that calculates exact battery/inverter payback in 10 seconds for your clients.',
    urgencyText: 'Lock in solar quoting automation before upcoming tariff reviews.'
  },
  auto: {
    headline: 'Customs Duty FX Benchmark & Tokunbo Import Valuation Updates',
    painHook: 'Car buyers and spare parts wholesalers require instant VIN duty estimations to make buying decisions.',
    pitchAngle: 'Our 24/7 WhatsApp Auto Assistant calculates Tokunbo clearing duties and arranges vehicle inspections instantly.',
    urgencyText: 'Provide instant transparent pricing before buyers message competitors.'
  },
  real_estate: {
    headline: 'Diaspora Inflows & Naira Hedge Propel Lagos Property Off-Plan Sales',
    painHook: 'Off-plan buyers and diaspora investors demand 24/7 payment installment calculators without waiting hours for agents.',
    pitchAngle: 'We pre-built an off-plan mortgage and payment schedule tool embedded right into your digital portal.',
    urgencyText: 'Capture high-net-worth diaspora leads while they are actively searching.'
  },
  healthcare: {
    headline: 'Private Health Facilities Automate Appointment Booking to Prevent No-Shows',
    painHook: 'Clinics lose up to 35% of daily revenue to appointment no-shows and after-hours call abandonment.',
    pitchAngle: 'Our 24/7 AI Patient Booking Assistant collects consultation deposits upfront and sends automated WhatsApp reminders.',
    urgencyText: 'Eliminate patient no-shows with automated WhatsApp intake.'
  },
  logistics: {
    headline: 'Interstate Haulage & E-Commerce Delivery Tracking in High Demand',
    painHook: 'Cargo shippers demand instant automated haulage quotes and waybill tracking without calling dispatchers.',
    pitchAngle: 'Our 24/7 Haulage Multi-Router calculates interstate freight rates and dispatches automated waybill receipts.',
    urgencyText: 'Automate dispatch inquiries 24/7 on WhatsApp.'
  },
  general: {
    headline: 'Corporate Affairs Commission (CAC) Strict SME Compliance & Digital Search',
    painHook: 'Over 60% of Nigerian commercial buyers verify corporate online footprint before making bank transfers.',
    pitchAngle: 'We provide a 100% Done-For-You Turnkey Business Portal with domain, Google Maps verification, and 24/7 WhatsApp AI closer.',
    urgencyText: 'Claim your official digital operations portal in 48 hours.'
  }
};

/**
 * Harvests latest commercial news items and maps them to B2B pitch angles
 */
async function harvestCommercialNews() {
  logger.info('OPENNEWS_START', 'Initiating Nigerian B2B news harvest for commercial pitch angles');
  
  const harvestedItems = [];
  const sectorAngles = { ...DEFAULT_COMMERCIAL_ANGLES };

  for (const src of NEWS_SOURCES) {
    try {
      const response = await axios.get(src.url, {
        timeout: 6000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BethelmindCommercialNewsBot/2.0'
        }
      });

      if (response.status === 200 && response.data) {
        const $ = cheerio.load(response.data, { xmlMode: true });
        $('item').slice(0, 5).each((_, el) => {
          const title = $(el).find('title').text().trim();
          const link = $(el).find('link').text().trim();
          const pubDate = $(el).find('pubDate').text().trim();
          const description = $(el).find('description').text().replace(/<[^>]+>/g, '').trim().substring(0, 180);

          if (title) {
            harvestedItems.push({
              source: src.name,
              title,
              link,
              pubDate,
              summary: description
            });

            // Dynamically match headlines to sectors
            const lower = title.toLowerCase();
            if (/solar|diesel|grid|power|electricity|tariff|energy/.test(lower)) {
              sectorAngles.solar.headline = title;
              sectorAngles.solar.sourceUrl = link;
            } else if (/car|auto|duty|customs|tokunbo|vehicle|import/.test(lower)) {
              sectorAngles.auto.headline = title;
              sectorAngles.auto.sourceUrl = link;
            } else if (/estate|property|house|land|rent|building/.test(lower)) {
              sectorAngles.real_estate.headline = title;
              sectorAngles.real_estate.sourceUrl = link;
            } else if (/health|hospital|clinic|doctor|drug|medical/.test(lower)) {
              sectorAngles.healthcare.headline = title;
              sectorAngles.healthcare.sourceUrl = link;
            }
          }
        });
      }
    } catch (err) {
      logger.warn('OPENNEWS_FEED_TIMEOUT', `Failed to fetch live RSS from ${src.name}, utilizing cached sector intelligence`, { error: err.message });
    }
  }

  const newsData = {
    updatedAt: new Date().toISOString(),
    totalHarvested: harvestedItems.length,
    recentNews: harvestedItems,
    commercialAngles: sectorAngles
  };

  // Persist news data
  const dataDir = path.join(__dirname, '..', '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outPath = path.join(dataDir, 'news_intelligence.json');
  fs.writeFileSync(outPath, JSON.stringify(newsData, null, 2));

  logger.info('OPENNEWS_COMPLETE', `Successfully compiled commercial news angles. Saved to ${outPath}`, {
    sectorsCovered: Object.keys(sectorAngles).length,
    liveItems: harvestedItems.length
  });

  return newsData;
}

/**
 * Returns the best timely pitch angle for a specific commercial category
 */
function getLatestCommercialAngle(category = '') {
  let angleKey = 'general';
  const cat = String(category).toLowerCase();

  if (/solar|inverter|energy|power|battery/.test(cat)) {
    angleKey = 'solar';
  } else if (/car|auto|motor|dealership|mechanic|spare/.test(cat)) {
    angleKey = 'auto';
  } else if (/estate|property|housing|realt|developer|land/.test(cat)) {
    angleKey = 'real_estate';
  } else if (/clinic|health|hospital|dental|medical|pharmacy/.test(cat)) {
    angleKey = 'healthcare';
  } else if (/logistics|haulage|courier|delivery|freight/.test(cat)) {
    angleKey = 'logistics';
  }

  // Load from persisted data if available
  const dataPath = path.join(__dirname, '..', '..', 'data', 'news_intelligence.json');
  if (fs.existsSync(dataPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      if (data.commercialAngles && data.commercialAngles[angleKey]) {
        return data.commercialAngles[angleKey];
      }
    } catch (_) {}
  }

  return DEFAULT_COMMERCIAL_ANGLES[angleKey] || DEFAULT_COMMERCIAL_ANGLES.general;
}

// Test runner
if (require.main === module) {
  harvestCommercialNews().then(res => {
    console.log('\n======================================================');
    console.log('📰 OPENNEWS COMMERCIAL INTELLIGENCE HARVEST REPORT');
    console.log('======================================================');
    console.log(`Updated: ${res.updatedAt}`);
    console.log(`Live News Items: ${res.totalHarvested}`);
    console.log('\nSample Sector Angles:');
    ['solar', 'auto', 'real_estate', 'healthcare'].forEach(s => {
      const a = res.commercialAngles[s];
      console.log(`\n• [${s.toUpperCase()}]: ${a.headline}`);
      console.log(`  Hook: ${a.painHook}`);
      console.log(`  Pitch: ${a.pitchAngle}`);
    });
    console.log('======================================================\n');
  });
}

module.exports = {
  harvestCommercialNews,
  getLatestCommercialAngle,
  DEFAULT_COMMERCIAL_ANGLES
};
