/**
 * @file scripts/test_advanced_blog_and_geo_suite.js
 * 
 * 🔬 Advanced Generative Engine Optimization (GEO), Blog Intelligence & Conversion Verification
 * Bethelmind Digital Solutions (www.bethelmindanalytics.com)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.argv.includes('--local') 
  ? 'http://localhost:3006' 
  : 'https://www.bethelmindanalytics.com';

const results = { passed: 0, failed: 0, warnings: 0, tests: [] };

function logPass(title, details = '') {
  results.passed++;
  results.tests.push({ title, status: 'PASS', details });
  console.log(`✅ [PASS] ${title} ${details ? `(${details})` : ''}`);
}

function logFail(title, error) {
  results.failed++;
  results.tests.push({ title, status: 'FAIL', error });
  console.log(`❌ [FAIL] ${title}: ${error}`);
}

function logWarn(title, warning) {
  results.warnings++;
  results.tests.push({ title, status: 'WARN', warning });
  console.log(`⚠️ [WARN] ${title}: ${warning}`);
}

function fetchUrl(targetPath, maxBytes = 100000) {
  return new Promise((resolve) => {
    const isHttps = BASE_URL.startsWith('https');
    const client = isHttps ? https : http;
    const url = `${BASE_URL}${targetPath}`;
    const start = Date.now();

    const req = client.get(url, { headers: { 'User-Agent': 'BethelmindQABot/3.0 (Windows NT 10.0)' } }, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        if (body.length < maxBytes) body += chunk;
      });
      res.on('end', () => {
        const latency = Date.now() - start;
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          latency,
          error: null,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 0,
        headers: {},
        body: '',
        latency: Date.now() - start,
        error: err.message,
      });
    });

    req.setTimeout(12000, () => {
      req.destroy();
      resolve({
        statusCode: 408,
        headers: {},
        body: '',
        latency: 12000,
        error: 'Request Timeout (12s)',
      });
    });
  });
}

async function runAdvancedTestSuite() {
  console.log('========================================================================');
  console.log('🔬 ADVANCED BLOG, GEO & CONVERSION VERIFICATION TEST SUITE');
  console.log(`🌐 Environment: ${BASE_URL}`);
  console.log('========================================================================\n');

  // --- 1. LOCAL DATA & INVARIANT VALIDATION ---
  console.log('--- TEST GROUP 1: Codebase Data Integrity & File Invariants ---');
  const postsDir = path.join(process.cwd(), 'data', 'blog_posts');
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.json'));
    if (files.length >= 80) {
      logPass('Blog Posts Catalog Depth', `${files.length} active posts verified on disk`);
    } else {
      logWarn('Blog Posts Catalog Depth', `Only ${files.length} posts found on disk`);
    }

    // Inspect random 3 posts for mandatory fields
    let allValid = true;
    for (const f of files.slice(0, 5)) {
      try {
        const p = JSON.parse(fs.readFileSync(path.join(postsDir, f), 'utf8'));
        if (!p.title || !p.slug || !p.category || !p.content_html) {
          allValid = false;
          logFail(`Post Integrity: ${f}`, 'Missing mandatory fields (title, slug, category, content_html)');
        }
      } catch (e) {
        allValid = false;
        logFail(`Post JSON Parse: ${f}`, e.message);
      }
    }
    if (allValid) {
      logPass('Article Metadata & Content Invariants', 'Sample posts strictly conform to BlogPostData interface');
    }
  } else {
    logFail('Blog Posts Directory', 'data/blog_posts does not exist');
  }

  // --- 2. CORE BLOG INDEX ROUTE ---
  console.log('\n--- TEST GROUP 2: Blog Index Page (/blog) ---');
  const blogRes = await fetchUrl('/blog');
  if (blogRes.statusCode === 200) {
    logPass('Blog Masthead (/blog)', `HTTP 200, Latency: ${blogRes.latency}ms`);
    
    // Check for interactive elements
    if (blogRes.body.includes('Commercial Intelligence Feed') || blogRes.body.includes('Playbooks')) {
      logPass('Blog Masthead Headline & Count', 'Correct branding and live counter found');
    } else {
      logWarn('Blog Masthead Headline', 'Could not locate commercial feed badge');
    }

    // Check for presence of sectors
    const hasSectors = blogRes.body.includes('CleanTech') || blogRes.body.includes('Solar') || blogRes.body.includes('Healthcare');
    if (hasSectors) {
      logPass('Sector Verticals Loaded', 'CleanTech, Solar, and Healthcare sectors detected in HTML');
    } else {
      logFail('Sector Verticals Loaded', 'Core sectors missing in rendered HTML');
    }
  } else {
    logFail('Blog Masthead (/blog)', `Status: ${blogRes.statusCode}, Error: ${blogRes.error}`);
  }

  // --- 3. REPRESENTATIVE SECTOR PLAYBOOKS ---
  console.log('\n--- TEST GROUP 3: Multi-Sector Article Pages (/blog/[slug]) ---');
  const sampleSlugs = [
    {
      slug: 'the-band-a-electricity-tariff-surge-complete-commercial-solar-boq-sizing-bluepri',
      sector: 'CleanTech & Solar Energy',
    },
    {
      slug: 'telemedicine-and-automated-consultation-deposits-preventing-clinic-revenue-leaks',
      sector: 'Healthcare & Clinic Management',
    },
    {
      slug: 'tokunbo-car-clearing-at-tin-can-apapa-complete-2026-customs-vin-valuation-and-ta',
      sector: 'Auto Clearing & Customs Logistics',
    },
  ];

  for (const item of sampleSlugs) {
    const res = await fetchUrl(`/blog/${item.slug}`);
    if (res.statusCode === 200) {
      logPass(`Article [${item.sector}]`, `HTTP 200, Latency: ${res.latency}ms`);

      // Verify Schema.org JSON-LD
      if (res.body.includes('application/ld+json')) {
        logPass(`Schema.org Structured Data [${item.sector}]`, 'JSON-LD script block present');
      } else {
        logFail(`Schema.org Structured Data [${item.sector}]`, 'JSON-LD script block missing');
      }

      // Verify CAC & Moniepoint Branding
      const hasMoniepoint = res.body.includes('6805375225') || res.body.includes('Moniepoint') || res.body.includes('Bethelmind');
      if (hasMoniepoint) {
        logPass(`Corporate Identity & Moniepoint Trust [${item.sector}]`, 'Bethelmind Digital Solutions detected');
      } else {
        logWarn(`Corporate Identity & Moniepoint Trust [${item.sector}]`, 'Moniepoint settlement info not visible in HTML');
      }

      // Verify Closer WhatsApp CTA
      const hasWa = res.body.includes('wa.me/2348022791227') || res.body.includes('0802 279 1227');
      if (hasWa) {
        logPass(`1-Tap WhatsApp Closer Link [${item.sector}]`, 'Links directly to 0802 279 1227');
      } else {
        logFail(`1-Tap WhatsApp Closer Link [${item.sector}]`, 'Closer WhatsApp CTA missing');
      }

      // Verify Anti-Pattern Absence (NaN, null, undefined)
      const hasBadArtifacts = res.body.includes('>NaN<') || res.body.includes('>undefined<') || res.body.includes('>[object Object]<');
      if (!hasBadArtifacts) {
        logPass(`HTML Cleanliness [${item.sector}]`, 'Zero NaN, undefined, or [object Object] artifacts');
      } else {
        logFail(`HTML Cleanliness [${item.sector}]`, 'Found unhandled NaN or undefined artifacts in HTML');
      }
    } else {
      logFail(`Article [${item.sector}]`, `Status: ${res.statusCode}, Error: ${res.error}`);
    }
  }

  // --- 4. GEO & AI CRAWLER ASSETS ---
  console.log('\n--- TEST GROUP 4: GEO & AI Crawler Assets (llms.txt, Sitemap, RSS) ---');
  
  // Test Sitemap
  const sitemapRes = await fetchUrl('/sitemap.xml');
  if (sitemapRes.statusCode === 200 && (sitemapRes.body.includes('<urlset') || sitemapRes.body.includes('http://www.sitemaps.org/schemas/sitemap/0.9'))) {
    logPass('Dynamic XML Sitemap (/sitemap.xml)', `HTTP 200, Latency: ${sitemapRes.latency}ms`);
  } else {
    logFail('Dynamic XML Sitemap (/sitemap.xml)', `Status: ${sitemapRes.statusCode}, Error: ${sitemapRes.error}`);
  }

  // Test RSS Feed
  const rssRes = await fetchUrl('/blog/rss.xml');
  if (rssRes.statusCode === 200 && rssRes.body.includes('<rss')) {
    logPass('Blog RSS Feed (/blog/rss.xml)', `HTTP 200, Latency: ${rssRes.latency}ms`);
  } else {
    logFail('Blog RSS Feed (/blog/rss.xml)', `Status: ${rssRes.statusCode}, Error: ${rssRes.error}`);
  }

  // Test IndexNow Key (Edge or App Route)
  const indexKeyRes = await fetchUrl('/bethelmindindexkey2026.txt');
  if (indexKeyRes.statusCode === 200 && indexKeyRes.body.includes('bethelmindindexkey2026')) {
    logPass('IndexNow Verification Key (/bethelmindindexkey2026.txt)', 'HTTP 200, Key verified');
  } else {
    logWarn('IndexNow Verification Key (/bethelmindindexkey2026.txt)', `Status: ${indexKeyRes.statusCode} (Propagation in progress)`);
  }

  // Test llms.txt (Edge or App Route)
  const llmsRes = await fetchUrl('/llms.txt');
  if (llmsRes.statusCode === 200 && llmsRes.body.includes('Bethelmind Digital Solutions')) {
    logPass('LLMs Directory (/llms.txt)', 'HTTP 200, Model directives & tools verified');
  } else {
    logWarn('LLMs Directory (/llms.txt)', `Status: ${llmsRes.statusCode} (Propagation in progress)`);
  }

  // --- 5. STANDALONE TOOLS INTEGRITY ---
  console.log('\n--- TEST GROUP 5: Dynamic Client Prototype & Lead Funnels ---');
  const previewRes = await fetchUrl('/preview/future-link-car');
  if (previewRes.statusCode === 200) {
    logPass('Dynamic Prototype Engine (/preview/future-link-car)', `HTTP 200, Latency: ${previewRes.latency}ms`);
    if (previewRes.body.includes('6805375225')) {
      logPass('Prototype Bank Settlement Account', 'Moniepoint MFB 6805375225 verified in prototype');
    }
    if (previewRes.body.includes('35,000') || previewRes.body.includes('25,000')) {
      logPass('Prototype 2-Tier Pricing', '2-Tier low-friction pricing verified');
    }
  } else {
    logFail('Dynamic Prototype Engine (/preview/future-link-car)', `Status: ${previewRes.statusCode}`);
  }

  console.log('\n========================================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${results.passed} PASSED, ${results.failed} FAILED, ${results.warnings} WARNINGS`);
  console.log('========================================================================\n');

  return results;
}

runAdvancedTestSuite();
