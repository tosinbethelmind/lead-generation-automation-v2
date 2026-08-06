/**
 * batch_lead_enricher.js
 * 
 * High-performance batch contact enrichment engine.
 * Concurrently crawls website URLs for leads missing phone/email details,
 * extracts tel:, mailto:, wa.me/ links, and updates master database local_db/leads_db.json.
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Phone extraction regexes for Nigerian & International formats
const NG_PHONE_REGEX = /(?:\+?234|0)\s*(?:[789][01]\d|\d{2})\s*\d{3}\s*\d{4}/g;
const INT_PHONE_REGEX = /\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

const DISPOSABLE_DOMAINS = new Set([
  'example.com', 'test.com', 'domain.com', 'none.com', 'tempmail.com', 
  'yopmail.com', 'dispostable.com', 'wixpress.com', 'squarespace.com'
]);

function cleanPhone(raw) {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return '';
  if (digits.startsWith('234')) return `+${digits}`;
  if (digits.startsWith('0') && digits.length === 11) return `+234${digits.substring(1)}`;
  if (digits.length === 10) return `+234${digits}`;
  return `+${digits}`;
}

function cleanEmail(raw) {
  if (!raw) return '';
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned.includes('@') || cleaned.length < 6) return '';
  const domain = cleaned.split('@')[1];
  if (!domain || DISPOSABLE_DOMAINS.has(domain)) return '';
  return cleaned;
}

async function fetchWebsiteContact(url, timeoutMs = 4000) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return { phone: null, email: null };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: controller.signal
    });

    clearTimeout(timer);
    if (!res.ok) return { phone: null, email: null };

    const html = await res.text();
    const $ = cheerio.load(html);

    let extractedPhone = null;
    let extractedEmail = null;

    // 1. Search href links for tel:, mailto:, wa.me/
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href.startsWith('tel:') && !extractedPhone) {
        extractedPhone = cleanPhone(href.replace('tel:', ''));
      }
      if (href.startsWith('mailto:') && !extractedEmail) {
        extractedEmail = cleanEmail(href.replace('mailto:', '').split('?')[0]);
      }
      if ((href.includes('wa.me/') || href.includes('api.whatsapp.com/send')) && !extractedPhone) {
        const waMatch = href.match(/(?:wa\.me\/|phone=)(\+?\d+)/);
        if (waMatch && waMatch[1]) {
          extractedPhone = cleanPhone(waMatch[1]);
        }
      }
    });

    // 2. Fallback regex over body text if not found in links
    if (!extractedPhone) {
      const bodyText = $('body').text() || '';
      const phoneMatches = bodyText.match(NG_PHONE_REGEX) || bodyText.match(INT_PHONE_REGEX);
      if (phoneMatches && phoneMatches.length > 0) {
        for (const p of phoneMatches) {
          const cleaned = cleanPhone(p);
          if (cleaned) {
            extractedPhone = cleaned;
            break;
          }
        }
      }
    }

    if (!extractedEmail) {
      const bodyText = $('body').text() || '';
      const emailMatches = bodyText.match(EMAIL_REGEX);
      if (emailMatches && emailMatches.length > 0) {
        for (const e of emailMatches) {
          const cleaned = cleanEmail(e);
          if (cleaned) {
            extractedEmail = cleaned;
            break;
          }
        }
      }
    }

    return { phone: extractedPhone, email: extractedEmail };
  } catch (_) {
    clearTimeout(timer);
    return { phone: null, email: null };
  }
}

async function runBatchEnrichment() {
  console.log('====================================================');
  console.log('⚡ APEXREACH HIGH-SPEED CONTACT ENRICHMENT PIPELINE');
  console.log('====================================================\n');

  const filePath = path.join(process.cwd(), 'local_db', 'leads_db.json');
  if (!fs.existsSync(filePath)) {
    console.error('❌ local_db/leads_db.json not found!');
    return;
  }

  const leads = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`📊 Loaded ${leads.length} total master leads.`);

  // Find leads missing phone or email that have valid website URLs
  const targetLeads = leads.filter(l => {
    const missingPhone = !l.phone || l.phone.trim().length < 6;
    const missingEmail = !l.email || !l.email.includes('@');
    const hasWebsite = l.website && typeof l.website === 'string' && l.website.startsWith('http');
    return (missingPhone || missingEmail) && hasWebsite;
  });

  console.log(`🎯 Found ${targetLeads.length} leads with valid website URLs ready for contact enrichment.\n`);

  if (targetLeads.length === 0) {
    console.log('✨ All leads with websites are already enriched!');
    return;
  }

  let enrichedCount = 0;
  let newPhonesCount = 0;
  let newEmailsCount = 0;

  // Process in concurrent pools of 20
  const CONCURRENCY_POOL = 20;
  const maxToProcess = Math.min(targetLeads.length, 500); // Enrich up to 500 leads per batch run

  console.log(`🚀 Starting parallel crawler pool (${CONCURRENCY_POOL} worker connections)...`);

  for (let i = 0; i < maxToProcess; i += CONCURRENCY_POOL) {
    const chunk = targetLeads.slice(i, i + CONCURRENCY_POOL);
    const promises = chunk.map(async (lead) => {
      const res = await fetchWebsiteContact(lead.website);
      let leadUpdated = false;

      if (res.phone && (!lead.phone || lead.phone.length < 6)) {
        lead.phone = res.phone;
        lead.phone_e164 = res.phone;
        newPhonesCount++;
        leadUpdated = true;
      }
      if (res.email && (!lead.email || !lead.email.includes('@'))) {
        lead.email = res.email;
        newEmailsCount++;
        leadUpdated = true;
      }
      if (leadUpdated) {
        lead.updated_at = new Date().toISOString();
        enrichedCount++;
      }
    });

    await Promise.all(promises);
    console.log(`   Processed batch ${Math.min(i + CONCURRENCY_POOL, maxToProcess)}/${maxToProcess} (Enriched: +${enrichedCount} leads)...`);
  }

  // Save updated master database
  fs.writeFileSync(filePath, JSON.stringify(leads, null, 2), 'utf8');

  console.log('\n====================================================');
  console.log('✨ ENRICHMENT PIPELINE BATCH COMPLETE!');
  console.log('----------------------------------------------------');
  console.log(`📱 New Verified Phone Numbers Harvested: +${newPhonesCount}`);
  console.log(`📧 New Verified Email Addresses Harvested: +${newEmailsCount}`);
  console.log(`⭐ Total Leads Contact-Enriched:           +${enrichedCount}`);
  console.log('====================================================\n');
}

runBatchEnrichment();
