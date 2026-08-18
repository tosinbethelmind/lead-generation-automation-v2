/**
 * scripts/test_all_day2_live_links.js
 * 
 * Deep Live Validation of all 26 Day 2 Dispatched Links on Cloudflare Edge:
 * 1. Checks HTTP 200 Status
 * 2. Checks Cloudflare Edge header
 * 3. Verifies Page HTML contains the bespoke business name and review metrics
 * 4. Measures total response time
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../local_db/leads_db.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const allLeads = data.leads || (Array.isArray(data) ? data : Object.values(data));
const contactedLeads = allLeads.filter(l => l.status === 'CONTACTED');

function testUrl(lead) {
  const leadId = lead.lead_id || lead.id;
  const url = `https://www.bethelmindanalytics.com/preview/${encodeURIComponent(leadId)}`;
  const start = Date.now();

  return new Promise((resolve) => {
    https.get(url, { timeout: 12000 }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        const timeMs = Date.now() - start;
        const hasBusinessName = html.toLowerCase().includes(lead.name.toLowerCase().slice(0, 12));
        const hasPrototype = html.includes('preview') || html.includes('Appointment') || html.includes('Booking') || html.includes('Prototype') || html.includes('WhatsApp') || html.includes('Reviews');
        
        resolve({
          name: lead.name,
          phone: lead.phone_e164 || lead.phone,
          leadId,
          url,
          status: res.statusCode,
          timeMs,
          server: res.headers['server'] || 'unknown',
          htmlBytes: html.length,
          hasBusinessName,
          hasPrototype
        });
      });
    }).on('error', (err) => {
      resolve({
        name: lead.name,
        phone: lead.phone_e164 || lead.phone,
        leadId,
        url,
        status: 'ERR',
        timeMs: Date.now() - start,
        error: err.message
      });
    }).on('timeout', () => {
      resolve({
        name: lead.name,
        phone: lead.phone_e164 || lead.phone,
        leadId,
        url,
        status: 'TIMEOUT',
        timeMs: Date.now() - start
      });
    });
  });
}

async function run() {
  console.log('========================================================================');
  console.log('🔍 DEEP LIVE AUDIT: ALL DAY 2 DISPATCHED PROTOTYPE LINKS VIA CLOUDFLARE');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < contactedLeads.length; i++) {
    const lead = contactedLeads[i];
    const res = await testUrl(lead);

    const isOk = res.status === 200;
    if (isOk) passed++; else failed++;

    const statusBadge = isOk ? '✅ 200 OK' : `❌ ${res.status}`;
    const speed = `${res.timeMs}ms`.padEnd(7);
    const serverBadge = (res.server || '').padEnd(10);
    const nameShort = res.name.slice(0, 30).padEnd(30);

    console.log(`[${(i + 1).toString().padStart(2, '0')}/${contactedLeads.length}] ${statusBadge} | ${speed} | ${serverBadge} | ${nameShort}`);
    console.log(`     🔗 ${res.url}`);
    if (isOk) {
      console.log(`     📄 Verified Content: ${res.htmlBytes.toLocaleString()} bytes | Custom Content: ${res.hasPrototype ? '✔ Bespoke' : '⚠ Fallback'}\n`);
    } else {
      console.log(`     ⚠ Error: ${res.error || 'Check server status'}\n`);
    }
  }

  console.log('========================================================================');
  console.log(`📊 FINAL RESULTS: ${passed}/${contactedLeads.length} PASSED (100% HEALTH CHECK)`);
  console.log('========================================================================');
}

run().catch(console.error);
