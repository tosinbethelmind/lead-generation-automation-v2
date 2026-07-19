/**
 * @file social_group_hunter.js
 * Scrapes DuckDuckGo for public WhatsApp group invite links related to solar energy & electricity in Nigeria.
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
];

const SEARCH_QUERIES = [
  'site:facebook.com "chat.whatsapp.com" solar inverter Nigeria',
  'site:facebook.com "chat.whatsapp.com" electricity generator Nigeria',
  'site:facebook.com "chat.whatsapp.com" solar installers Nigeria',
  'site:t.co "chat.whatsapp.com" solar Nigeria',
  'site:nairaland.com "chat.whatsapp.com" solar inverter',
  'site:instagram.com "chat.whatsapp.com" solar Nigeria'
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runGroupHunter() {
  console.log('\n\x1b[36m============================================================\x1b[0m');
  console.log('\x1b[36m   SOLARQUOTEPRO SOCIAL GROUP HUNTER (WhatsApp & Social)     \x1b[0m');
  console.log('\x1b[36m============================================================\x1b[0m\n');

  const scrapedGroups = [];
  const seenUrls = new Set();

  for (const query of SEARCH_QUERIES) {
    console.log(`\x1b[33m[Search] Querying: "${query}"...\x1b[0m`);
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    // Random delay to simulate human browsing
    const delay = 2500 + Math.random() * 1500;
    await sleep(delay);

    try {
      const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Referer': 'https://duckduckgo.com/'
        }
      });

      if (!response.ok) {
        console.error(`\x1b[31m[Error] DuckDuckGo returned status ${response.status}: ${response.statusText}\x1b[0m`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      $('.web-result').each((_, elem) => {
        const titleNode = $(elem).find('.result__title a');
        const snippetNode = $(elem).find('.result__snippet');

        const title = titleNode.text() || '';
        const snippet = snippetNode.text() || '';
        const rawLink = titleNode.attr('href') || '';
        const cleanLink = cleanDdgUrl(rawLink);

        // Find any chat.whatsapp.com patterns in snippets or titles
        const waRegex = /chat\.whatsapp\.com\/[a-zA-Z0-9]{15,25}/g;
        const matches = (title + ' ' + snippet).match(waRegex) || [];

        for (const match of matches) {
          const inviteUrl = `https://${match}`;
          if (!seenUrls.has(inviteUrl)) {
            seenUrls.add(inviteUrl);
            scrapedGroups.push({
              source_url: cleanLink || 'Search Snippet',
              source_title: title.trim(),
              invite_url: inviteUrl,
              found_at: new Date().toISOString(),
              snippet_context: snippet.trim()
            });
            console.log(`  \x1b[32m[Found Group] ${inviteUrl} (from: "${title.trim().substring(0, 40)}...")\x1b[0m`);
          }
        }
      });

    } catch (err) {
      console.error(`\x1b[31m[Error] Failed to process query: ${err.message}\x1b[0m`);
    }
  }

  // Ensure local_db folder exists
  const dbDir = path.join(__dirname, '..', 'local_db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const outputFilePath = path.join(dbDir, 'scraped_group_links.json');
  fs.writeFileSync(outputFilePath, JSON.stringify(scrapedGroups, null, 2));

  console.log('\n\x1b[36m------------------------------------------------------------\x1b[0m');
  console.log(`\x1b[32m[Success] Group Hunter completed!\x1b[0m`);
  console.log(`\x1b[32m[Success] Found ${scrapedGroups.length} unique WhatsApp group links.\x1b[0m`);
  console.log(`\x1b[32m[Success] Results saved to: ${outputFilePath}\x1b[0m`);
  console.log('\x1b[36m============================================================\x1b[0m\n');
}

function cleanDdgUrl(urlStr) {
  if (!urlStr) return '';
  if (urlStr.includes('uddg=')) {
    try {
      const parts = urlStr.split('uddg=');
      if (parts[1]) {
        const encodedUrl = parts[1].split('&')[0];
        const decoded = decodeURIComponent(encodedUrl);
        if (decoded.startsWith('http')) {
          return decoded;
        }
      }
    } catch (_) {}
  }
  return urlStr;
}

runGroupHunter().catch(console.error);
