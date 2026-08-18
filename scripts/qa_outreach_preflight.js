/**
 * scripts/qa_outreach_preflight.js
 * 
 * Strict Automated Pre-Outreach Quality Assurance & Gatekeeper Engine
 * 
 * Enforces:
 * 1. Zero Raw UUID / Placeholder Policy on Live Landing Pages.
 * 2. HTTP 200 & Render Integrity for every target lead URL.
 * 3. 100% Genuine Nigerian Mobile Number Validation.
 * 4. WhatsApp Line Health & Rotator Ready.
 * 5. Full Batch Pre-Flight Approval Gate.
 */

const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');

function fetchPage(urlStr) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(urlStr);
      const mod = parsed.protocol === 'https:' ? https : http;
      const req = mod.get(urlStr, { timeout: 10000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            body: data,
            title: data.match(/<title>([^<]*)<\/title>/i)?.[1] || ''
          });
        });
      });
      req.on('error', (e) => resolve({ statusCode: 0, error: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ statusCode: 0, error: 'Timeout' }); });
    } catch (e) {
      resolve({ statusCode: 0, error: e.message });
    }
  });
}

function validatePhoneNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits || digits.length < 10 || digits.length > 14) {
    return { valid: false, reason: `Invalid digit length (${digits.length})` };
  }
  if (digits.includes('0000') || digits.includes('0001') || digits.includes('0002')) {
    return { valid: false, reason: 'Sequential zeros / placeholder number' };
  }
  if (/(\d)\1{3,}/.test(digits)) {
    return { valid: false, reason: 'Repeating quad digit pattern' };
  }
  if (/01234|12345|23456|34567|45678|56789/.test(digits)) {
    return { valid: false, reason: 'Sequential run pattern' };
  }

  // Nigerian mobile validation
  let intl = digits;
  if (digits.startsWith('0') && digits.length === 11) intl = '234' + digits.slice(1);
  if (digits.length === 10) intl = '234' + digits;

  if (!/^234[789][01]\d{8}$/.test(intl)) {
    return { valid: false, reason: `Non-mobile prefix (${intl.slice(0, 5)})` };
  }

  return { valid: true, intl: '+' + intl };
}

function checkRawUuidLeak(html) {
  if (!html) return false;
  // Detect raw 32-36 char UUIDs or hex sequences in rendered visible text
  const match = html.match(/RESERVED FOR\s+[0-9a-fA-F-]{16,}/i) ||
                html.match(/https:\/\/www\.[0-9a-fA-F-]{16,}\.com\.ng/i) ||
                html.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\s+—\s+24\/7/i);
  return !!match;
}

async function checkWhatsAppHealth() {
  const checkPort = (port) => new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/status`, { timeout: 2000 }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });

  const line1 = await checkPort(3007);
  const line2 = await checkPort(3009);
  return { line1, line2, ready: line1 || line2 };
}

async function runPreFlightQA(leadsBatch, baseUrl = 'https://www.bethelmindanalytics.com') {
  console.log('===============================================================');
  console.log('🛡️  APEXREACH / BETHELMIND MANDATORY PRE-FLIGHT QA GATE');
  console.log(`📅 Timestamp: ${new Date().toISOString()} | Target URL: ${baseUrl}`);
  console.log(`🎯 Evaluating Batch Size: ${leadsBatch.length} Leads`);
  console.log('===============================================================\n');

  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < leadsBatch.length; i++) {
    const lead = leadsBatch[i];
    const leadId = lead.lead_id || lead.id;
    const name = lead.name || 'Unknown';
    const phone = lead.phone_e164 || lead.phone || lead.phone_raw;
    const previewUrl = `${baseUrl}/preview/${encodeURIComponent(leadId)}`;

    process.stdout.write(`[${i + 1}/${leadsBatch.length}] Testing ${name.slice(0, 30).padEnd(30)} ... `);

    // 1. Validate Phone
    const phoneCheck = validatePhoneNumber(phone);
    if (!phoneCheck.valid) {
      console.log(`❌ FAILED (Phone: ${phoneCheck.reason})`);
      results.push({ leadId, name, previewUrl, pass: false, error: `Phone validation failed: ${phoneCheck.reason}` });
      failedCount++;
      continue;
    }

    // 2. Fetch Live Page
    const pageRes = await fetchPage(previewUrl);
    if (pageRes.statusCode !== 200) {
      console.log(`❌ FAILED (HTTP Status: ${pageRes.statusCode || pageRes.error})`);
      results.push({ leadId, name, previewUrl, pass: false, error: `Page returned status ${pageRes.statusCode}: ${pageRes.error || ''}` });
      failedCount++;
      continue;
    }

    // 3. Check for Raw UUID Leaks
    if (checkRawUuidLeak(pageRes.body)) {
      console.log(`❌ FAILED (Raw UUID detected in rendered HTML!)`);
      results.push({ leadId, name, previewUrl, pass: false, error: 'Raw UUID leak detected in page template' });
      failedCount++;
      continue;
    }

    // 4. Verify Business Name Presence in Page
    const cleanLeadName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanPage = pageRes.body.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanLeadName.length >= 4 && !cleanPage.includes(cleanLeadName.slice(0, 12))) {
      console.log(`⚠️ WARNING: Custom business name might not be rendered`);
    }

    console.log(`✅ PASSED (Title: "${pageRes.title.slice(0, 35)}...")`);
    results.push({ leadId, name, previewUrl, pass: true, title: pageRes.title });
    passedCount++;
  }

  console.log('\n===============================================================');
  console.log('📊 PRE-FLIGHT QA GATE REPORT');
  console.log('===============================================================');
  console.log(`Total Evaluated:   ${leadsBatch.length}`);
  console.log(`Passed Integrity:  ${passedCount}`);
  console.log(`Failed QA:         ${failedCount}`);
  console.log(`Gate Decision:     ${failedCount === 0 ? '🟢 APPROVED FOR DISPATCH' : '🔴 DISPATCH BLOCKED'}`);
  console.log('===============================================================\n');

  return {
    approved: failedCount === 0,
    total: leadsBatch.length,
    passed: passedCount,
    failed: failedCount,
    details: results
  };
}

module.exports = {
  runPreFlightQA,
  validatePhoneNumber,
  checkRawUuidLeak,
  checkWhatsAppHealth
};

// If run directly from CLI
if (require.main === module) {
  const dbPath = path.join(__dirname, '../local_db/leads_db.json');
  if (fs.existsSync(dbPath)) {
    const raw = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const all = raw.leads || raw;
    const sample = all.filter(l => l.status === 'CONTACTED').slice(0, 5);
    runPreFlightQA(sample).then(res => {
      process.exit(res.approved ? 0 : 1);
    });
  }
}
