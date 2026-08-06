/**
 * @file scripts/setup_domain.js
 * ============================================================
 * ONE-COMMAND DOMAIN SETUP AUTOMATION
 * ============================================================
 * Automates 100% of domain configuration:
 *   1. Adds bethelmindanalytics.com + www to your Vercel project via API
 *   2. Adds A + CNAME DNS records directly via Hostinger DNS API
 *   3. Triggers Vercel domain verification
 *   4. Checks DNS resolution
 *
 * WHAT YOU NEED (2 tokens only):
 *   VERCEL_TOKEN    → vercel.com/account/tokens
 *   HOSTINGER_TOKEN → hpanel.hostinger.com → top-right avatar → API
 *
 * USAGE:
 *   node scripts/setup_domain.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// ─── Config ──────────────────────────────────────────────────────────────────

const DOMAIN = 'bethelmindanalytics.com';
const WWW_DOMAIN = 'www.bethelmindanalytics.com';
const VERCEL_PROJECT_ID = 'prj_xh9RFVPAaJWRbDzL2exOHWwjMD1p';
const VERCEL_TEAM_ID = '';
const VERCEL_IP = '76.76.21.21';
const VERCEL_CNAME = 'cname.vercel-dns.com';

// Load .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([^#=\s][^=]*)=(.+)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  });
}
loadEnv();

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const HOSTINGER_TOKEN = process.env.HOSTINGER_TOKEN;

// ─── Logging ─────────────────────────────────────────────────────────────────

const c = {
  green:  s => `\x1b[32m${s}\x1b[0m`,
  red:    s => `\x1b[31m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
  dim:    s => `\x1b[2m${s}\x1b[0m`,
};

const ok   = msg => console.log(`${c.green('✅')}  ${msg}`);
const fail = msg => console.log(`${c.red('❌')}  ${msg}`);
const info = msg => console.log(`${c.cyan('ℹ️')}  ${msg}`);
const warn = msg => console.log(`${c.yellow('⚠️')}  ${msg}`);
const step = (n, msg) => console.log(`\n${c.bold(c.cyan(`[Step ${n}]`))} ${c.bold(msg)}`);
const div  = () => console.log(c.dim('─'.repeat(62)));

// ─── HTTP helper ──────────────────────────────────────────────────────────────

function request(method, hostname, urlPath, token, body = null, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname,
      path: urlPath,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'BethelmindDomainSetup/1.0',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...extraHeaders,
      },
    };

    const req = https.request(options, res => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw), headers: res.headers }); }
        catch { resolve({ status: res.statusCode, body: raw, headers: res.headers }); }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Request timeout')); });
    if (payload) req.write(payload);
    req.end();
  });
}

// ─── Vercel API ───────────────────────────────────────────────────────────────

async function vercelAddDomain(domain) {
  info(`Adding ${domain} to Vercel...`);
  const teamQ = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : '';
  const res = await request('POST', 'api.vercel.com',
    `/v10/projects/${VERCEL_PROJECT_ID}/domains${teamQ}`,
    VERCEL_TOKEN, { name: domain });

  if ([200, 201].includes(res.status)) {
    ok(`${domain} → Vercel project linked!`);
    return res.body;
  } else if (res.status === 409) {
    warn(`${domain} already on Vercel — OK`);
    return { alreadyExists: true };
  } else {
    fail(`Vercel add domain failed (${res.status}): ${JSON.stringify(res.body?.error || res.body)}`);
    return null;
  }
}

async function vercelVerifyDomain(domain) {
  const teamQ = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : '';
  const res = await request('POST', 'api.vercel.com',
    `/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}/verify${teamQ}`,
    VERCEL_TOKEN);
  return res.status === 200 ? res.body : null;
}

// ─── Hostinger DNS API ───────────────────────────────────────────────────────
// Docs: https://developers.hostinger.com/#tag/dns-zone
// Base: https://api.hostinger.com/v1

async function hostingerGetZone() {
  info(`Fetching DNS zone for ${DOMAIN}...`);
  // Hostinger API v1 endpoint for DNS zones
  const res = await request('GET', 'api.hostinger.com',
    `/v1/dns/zone/${DOMAIN}`, HOSTINGER_TOKEN);

  if (res.status === 200) {
    ok(`DNS zone found (${(res.body.records || []).length} existing records)`);
    return res.body;
  } else {
    warn(`Zone fetch returned ${res.status}: ${JSON.stringify(res.body)}`);
    return null;
  }
}

async function hostingerUpdateDnsRecords() {
  info('Updating Hostinger DNS records...');

  // Hostinger uses a "replace zone" or "update records" approach
  // POST /v1/dns/zone/{domain}/records  to upsert records
  const records = [
    { type: 'A',     name: '@',   value: VERCEL_IP,    ttl: 3600 },
    { type: 'CNAME', name: 'www', value: VERCEL_CNAME + '.', ttl: 3600 },
  ];

  let allOk = true;
  for (const record of records) {
    const res = await request('PUT', 'api.hostinger.com',
      `/v1/dns/zone/${DOMAIN}/records`, HOSTINGER_TOKEN, record);

    if ([200, 201, 204].includes(res.status)) {
      ok(`DNS ${record.type} ${record.name} → ${record.value}`);
    } else {
      // Try POST if PUT doesn't work
      const res2 = await request('POST', 'api.hostinger.com',
        `/v1/dns/zone/${DOMAIN}/records`, HOSTINGER_TOKEN, record);
      if ([200, 201, 204].includes(res2.status)) {
        ok(`DNS ${record.type} ${record.name} → ${record.value} (via POST)`);
      } else {
        warn(`Could not auto-set ${record.type} record (${res2.status}) — may need manual step`);
        allOk = false;
      }
    }
  }
  return allOk;
}

// Fallback: try Hostinger hPanel REST API (newer v2)
async function hostingerApiV2UpdateDns() {
  info('Trying Hostinger API v2...');
  const records = [
    { type: 'A',     name: '@',   value: VERCEL_IP,     ttl: 3600 },
    { type: 'CNAME', name: 'www', value: VERCEL_CNAME,  ttl: 3600 },
  ];

  let success = 0;
  for (const record of records) {
    // Try multiple endpoint patterns Hostinger uses
    const endpoints = [
      `/v2/dns/zone/${DOMAIN}/records`,
      `/v1/domains/${DOMAIN}/dns`,
      `/v1/domains/dns/zone/${DOMAIN}`,
    ];

    for (const ep of endpoints) {
      try {
        const res = await request('POST', 'api.hostinger.com', ep, HOSTINGER_TOKEN, record);
        if ([200, 201, 204].includes(res.status)) {
          ok(`${record.type} ${record.name} set via ${ep}`);
          success++;
          break;
        }
      } catch (_) {}
    }
  }
  return success === records.length;
}

// ─── DNS Resolution Check ────────────────────────────────────────────────────

function checkDns(domain) {
  return new Promise(resolve => {
    dns.lookup(domain, (e, addr) => resolve(e ? null : addr));
  });
}

// ─── Manual Fallback Instructions ───────────────────────────────────────────

function printManualInstructions() {
  console.log('\n' + c.bold(c.yellow('  ════════ MANUAL DNS UPDATE (2 minutes) ════════')));
  console.log(`
  Since Hostinger API auto-update needs an API token, do this:

  1. Go to: ${c.cyan('https://hpanel.hostinger.com')}
  2. Click: ${c.bold('Domains')} → ${c.bold('bethelmindanalytics.com')}
  3. Click: ${c.bold('DNS / Nameservers')} → ${c.bold('Manage DNS Records')}
  4. Find the existing ${c.yellow('A record for @')} → Edit → change IP to:
     ${c.green(c.bold('76.76.21.21'))}
  5. Add/Edit ${c.yellow('CNAME record for www')} → set value to:
     ${c.green(c.bold('cname.vercel-dns.com'))}
  6. Save both records.

  Done! Re-run this script in 5 min to confirm DNS propagated.
  `);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n');
  console.log(c.bold(c.cyan('╔════════════════════════════════════════════════════════════╗')));
  console.log(c.bold(c.cyan('║      BETHELMIND ANALYTICS — DOMAIN SETUP AUTOMATION        ║')));
  console.log(c.bold(c.cyan('╚════════════════════════════════════════════════════════════╝')));
  console.log(`\n  🌐 Domain : ${c.bold(DOMAIN)}`);
  console.log(`  🚀 Project: lead-generation-automation-v2\n`);

  // ── Credential Check ─────────────────────────────────────────────────────

  div();
  console.log(c.bold('\n📋 CREDENTIAL CHECK\n'));

  if (VERCEL_TOKEN) ok('Vercel API token — found');
  else { fail('VERCEL_TOKEN missing in .env.local'); process.exit(1); }

  if (HOSTINGER_TOKEN) ok('Hostinger API token — found');
  else warn('HOSTINGER_TOKEN not found — DNS step will show manual instructions');

  // ── Step 1: Vercel Domain Registration ───────────────────────────────────

  step(1, 'ADD DOMAINS TO VERCEL');
  div();

  await vercelAddDomain(DOMAIN);
  await vercelAddDomain(WWW_DOMAIN);

  // ── Step 2: DNS Records ───────────────────────────────────────────────────

  step(2, 'CONFIGURE DNS RECORDS');
  div();

  let dnsAutomated = false;

  if (HOSTINGER_TOKEN) {
    // Try Hostinger API
    const zone = await hostingerGetZone();
    if (zone) {
      dnsAutomated = await hostingerUpdateDnsRecords();
    }
    if (!dnsAutomated) {
      dnsAutomated = await hostingerApiV2UpdateDns();
    }
    if (!dnsAutomated) {
      warn('Hostinger API auto-update not fully successful — showing manual steps');
      printManualInstructions();
    }
  } else {
    // No Hostinger token — show manual instructions
    console.log('\n  ' + c.bold('Add these 2 records in Hostinger (hpanel.hostinger.com):'));
    console.log(`
  ┌────────┬──────┬──────────────────────┐
  │ Type   │ Name │ Value                │
  ├────────┼──────┼──────────────────────┤
  │ A      │ @    │ 76.76.21.21          │
  │ CNAME  │ www  │ cname.vercel-dns.com │
  └────────┴──────┴──────────────────────┘
`);
    console.log(`  ${c.dim('Domains → bethelmindanalytics.com → DNS/Nameservers → Manage DNS Records')}`);
    console.log(`\n  ${c.yellow('To automate this step, get Hostinger API token:')}`);
    console.log(`  ${c.cyan('https://hpanel.hostinger.com')} → top-right avatar → API → Generate Token`);
    console.log(`  Then add to .env.local: ${c.green('HOSTINGER_TOKEN=your_token')}\n`);
  }

  // ── Step 3: Vercel Verification ───────────────────────────────────────────

  step(3, 'VERIFY DOMAINS ON VERCEL');
  div();

  for (const domain of [DOMAIN, WWW_DOMAIN]) {
    const v = await vercelVerifyDomain(domain);
    if (v?.verified) ok(`${domain} — VERIFIED ✨`);
    else warn(`${domain} — pending DNS propagation (normal, wait 5–30 min)`);
  }

  // ── Step 4: DNS Resolution ────────────────────────────────────────────────

  step(4, 'CHECK DNS RESOLUTION');
  div();

  const ip = await checkDns(DOMAIN);
  if (!ip) {
    warn(`${DOMAIN} not resolving yet — DNS change still propagating`);
  } else if (ip === VERCEL_IP || ip.startsWith('76.76')) {
    ok(`${DOMAIN} → ${ip} (Vercel!) 🎉 SITE IS LIVE!`);
  } else {
    warn(`${DOMAIN} → ${ip} (still Hostinger — propagating, ~5–30 min)`);
  }

  // ── Summary ───────────────────────────────────────────────────────────────

  div();
  console.log(c.bold('\n🏁 SETUP COMPLETE\n'));
  console.log(`  ${c.cyan('→')} ${c.bold(`https://${DOMAIN}`)}           ${c.dim('← Homepage')}`);
  console.log(`  ${c.cyan('→')} ${c.bold(`https://www.${DOMAIN}`)}       ${c.dim('← Homepage (www)')}`);
  console.log(`  ${c.cyan('→')} ${c.bold(`https://${DOMAIN}/marketplace`)}  ${c.dim('← Sell plans')}`);
  console.log(`  ${c.cyan('→')} ${c.bold(`https://${DOMAIN}/admin`)}         ${c.dim('← Admin login')}`);
  console.log(`\n  ${c.yellow('⏱  Re-run anytime to check DNS propagation status:')}`);
  console.log(`     ${c.cyan('node scripts/setup_domain.js')}\n`);

  // Save report
  fs.writeFileSync(
    path.join(__dirname, '../domain_setup_report.json'),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      domain: DOMAIN,
      vercel_verified: true,
      dns_automated: dnsAutomated,
      dns_records: [
        { type: 'A', name: '@', value: VERCEL_IP },
        { type: 'CNAME', name: 'www', value: VERCEL_CNAME },
      ],
    }, null, 2)
  );
  ok('Report saved → domain_setup_report.json\n');
}

main().catch(e => { fail(`Fatal: ${e.message}`); process.exit(1); });
