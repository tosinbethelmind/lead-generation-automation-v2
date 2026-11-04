const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Client } = require('ssh2');
const { createClient } = require('@supabase/supabase-js');

async function verifyAllSystems() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔍 FULL COMPREHENSIVE END-TO-END SYSTEM HEALTH AUDIT');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results = {};

  // ── 1. SUPABASE CLOUD CONNECTIVITY & TELEMETRY ────────────────────────────
  console.log('▶ [1/5] Checking Supabase Cloud Connectivity...');
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      results.supabase = { status: 'FAIL', reason: 'Missing Supabase credentials in env' };
    } else {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.from('logs').select('count', { count: 'exact', head: true });
      if (error) {
        results.supabase = { status: 'FAIL', error: error.message };
      } else {
        results.supabase = { status: 'PASS', url: supabaseUrl, reachable: true };
      }
    }
  } catch (err) {
    results.supabase = { status: 'FAIL', error: err.message };
  }
  console.log('  Result:', results.supabase);

  // ── 2. CONTABO VPS HEALTH & EVOLUTION API INSTANCE CHECK ──────────────────
  console.log('\n▶ [2/5] Checking Contabo VPS (169.58.182.92) & Evolution API Port 8080...');
  results.vps = await new Promise((resolve) => {
    const c = new Client();
    c.on('ready', () => {
      c.exec('curl -s -H "apikey: evolution_bethelmind_secret_2026" http://localhost:8080/status', (err, stream) => {
        if (err) {
          c.end();
          return resolve({ status: 'FAIL', error: err.message });
        }
        let output = '';
        stream.on('data', d => output += d);
        stream.on('close', () => {
          c.end();
          try {
            const data = JSON.parse(output);
            const line1 = (data.instances || []).find(i => i.id === 1);
            if (line1 && line1.state === 'open') {
              resolve({
                status: 'PASS',
                line1Status: line1.state,
                line1Phone: line1.phone,
                totalLines: data.totalLines,
                onlineLines: data.onlineLines
              });
            } else {
              resolve({ status: 'WARN', data, message: 'Line 1 is not in open state' });
            }
          } catch (e) {
            resolve({ status: 'FAIL', rawOutput: output, parseError: e.message });
          }
        });
      });
    }).on('error', (err) => {
      resolve({ status: 'FAIL', sshError: err.message });
    }).connect({
      host: '169.58.182.92',
      port: 22,
      username: 'root',
      password: 'bethelmind2026',
      readyTimeout: 10000
    });
  });
  console.log('  Result:', results.vps);

  // ── 3. VPS DUAL-PILLAR AI CLOSER TEST (PILLAR 1 VS PILLAR 2) ──────────────
  console.log('\n▶ [3/5] Testing Live Dual-Pillar Closer Engine on VPS via Node...');
  results.dualPillarVps = await new Promise((resolve) => {
    const c = new Client();
    c.on('ready', () => {
      const remoteCmd = `node -e "
        const { handlePostContactInquiryAsync, lookupLeadForWhatsApp } = require('/root/lead-generation-automation-v2/scripts/lib/closer_engine');
        async function run() {
          const p2Info = lookupLeadForWhatsApp('08035678912', 'Yes, the land on Lekki-Epe is available.');
          const p2Res = await handlePostContactInquiryAsync('Yes, available', { phone: '08035678912', businessName: p2Info.businessName });
          const p1Info = lookupLeadForWhatsApp('08031112222', 'How much for website?');
          const p1Res = await handlePostContactInquiryAsync('How much for website?', { phone: '08031112222', businessName: 'Ikeja Boutique' });
          console.log(JSON.stringify({ p2Intent: p2Res.intent, p2Sample: p2Res.messageText.substring(0, 80), p1Intent: p1Res.intent, p1Sample: p1Res.messageText.substring(0, 80) }));
        }
        run();
      "`;
      c.exec(remoteCmd, (err, stream) => {
        if (err) {
          c.end();
          return resolve({ status: 'FAIL', error: err.message });
        }
        let output = '';
        stream.on('data', d => output += d);
        stream.on('close', () => {
          c.end();
          try {
            const data = JSON.parse(output.trim());
            const p2Valid = data.p2Intent.startsWith('PILLAR2_') && !data.p2Sample.includes('₦35,000');
            const p1Valid = !data.p1Intent.startsWith('PILLAR2_');
            resolve({
              status: p2Valid && p1Valid ? 'PASS' : 'FAIL',
              p2Intent: data.p2Intent,
              p1Intent: data.p1Intent,
              p2Verified: p2Valid,
              p1Verified: p1Valid
            });
          } catch (e) {
            resolve({ status: 'FAIL', rawOutput: output, error: e.message });
          }
        });
      });
    }).on('error', (err) => {
      resolve({ status: 'FAIL', sshError: err.message });
    }).connect({
      host: '169.58.182.92',
      port: 22,
      username: 'root',
      password: 'bethelmind2026',
      readyTimeout: 10000
    });
  });
  console.log('  Result:', results.dualPillarVps);

  // ── 4. EMAIL DISPATCH GATEWAY (BREVO API V3 & HOSTINGER) ───────────────────
  console.log('\n▶ [4/5] Checking Email Delivery Gateway (Brevo Cloud API v3)...');
  try {
    const brevoKey = process.env.BREVO_API_KEY;
    if (!brevoKey) {
      results.email = { status: 'WARN', message: 'BREVO_API_KEY not found in local env' };
    } else {
      const res = await fetch('https://api.brevo.com/v3/account', {
        headers: { 'api-key': brevoKey, 'accept': 'application/json' }
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        results.email = {
          status: 'PASS',
          gateway: 'Brevo Cloud API v3 (tosin@bethelmindanalytics.com)',
          companyName: data.companyName || 'Bethelmind',
          planType: data.plan?.[0]?.type || 'Standard',
          creditsRemaining: data.plan?.[0]?.credits || 'Unlimited/Active'
        };
      } else {
        results.email = { status: 'FAIL', error: data };
      }
    }
  } catch (err) {
    results.email = { status: 'FAIL', error: err.message };
  }
  console.log('  Result:', results.email);

  // ── 5. LOCAL DEV SERVER ROUTES (PORT 3006) ────────────────────────────────
  console.log('\n▶ [5/5] Checking Local Next.js App Routes on Port 3006...');
  try {
    const routesToTest = [
      { path: '/mandate', method: 'GET', headers: {} },
      { path: '/admin/mobile?token=bethelmind_admin_2026', method: 'GET', headers: { 'x-admin-token': 'bethelmind_admin_2026' } },
      { path: '/api/admin/mobile-control', method: 'GET', headers: { 'x-admin-token': 'bethelmind_admin_2026' } }
    ];
    const routeResults = {};
    for (const r of routesToTest) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);
        const res = await fetch(`http://localhost:3006${r.path}`, {
          method: r.method,
          headers: { ...r.headers },
          signal: controller.signal
        });
        clearTimeout(timeout);
        routeResults[r.path.split('?')[0]] = { status: res.status, ok: res.ok || res.status === 200 };
      } catch (e) {
        routeResults[r.path.split('?')[0]] = { status: 'TIMEOUT_OR_ERROR', error: e.message };
      }
    }
    const allRoutesOk = Object.values(routeResults).every(v => v.ok);
    results.webApp = {
      status: allRoutesOk ? 'PASS' : 'WARN',
      routes: routeResults
    };
  } catch (err) {
    results.webApp = { status: 'FAIL', error: err.message };
  }
  console.log('  Result:', results.webApp);

  // ── FINAL SUMMARY ────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🏁 AUDIT SUMMARY RESULT:');
  console.log('═══════════════════════════════════════════════════════════════');
  const allPass = results.supabase?.status === 'PASS' &&
    results.vps?.status === 'PASS' &&
    results.dualPillarVps?.status === 'PASS' &&
    results.email?.status === 'PASS' &&
    results.webApp?.status === 'PASS';

  console.log(`ALL SYSTEMS OPERATIONAL: ${allPass ? '✅ 100% CONFIRMED FUNCTIONAL' : '⚠️ ATTENTION NEEDED'}`);
  console.log(JSON.stringify(results, null, 2));

  return results;
}

verifyAllSystems().catch(console.error);
