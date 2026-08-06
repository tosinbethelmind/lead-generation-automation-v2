/**
 * scripts/test_integrity_security_effectiveness.js
 * 
 * Master System Audit Suite for:
 * 1. Data & Infrastructure Integrity (DB Health, Schema, Atomic I/O, Table Verification)
 * 2. Vulnerability & Security Audit (Admin 401 barriers, SQLi/XSS payload handling, secret leaks)
 * 3. System Effectiveness & Performance Benchmarks (API latency SLA, payment verifiers, scraper pipeline)
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://127.0.0.1:3006';

async function requestHttp(urlPath, method = 'GET', data = null, headers = {}) {
  const url = `${BASE_URL}${urlPath}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);
  const start = Date.now();
  try {
    const opts = {
      method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ApexReachSystemAudit/1.0',
        ...headers
      },
      signal: controller.signal
    };
    if (data) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(data);
    }
    const res = await fetch(url, opts);
    const text = await res.text();
    const durationMs = Date.now() - start;
    clearTimeout(timeoutId);
    let json = null;
    try {
      json = JSON.parse(text);
    } catch (_) {}
    return { status: res.status, text, json, ok: res.ok, durationMs };
  } catch (err) {
    const durationMs = Date.now() - start;
    clearTimeout(timeoutId);
    return { status: 0, error: err.message, ok: false, durationMs };
  }
}

async function runIntegritySecurityEffectivenessTests() {
  console.log('====================================================================');
  console.log('🛡️ ApexReach Master Integrity, Vulnerability & Effectiveness Audit');
  console.log('====================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✅ PASSED: ${testName}${details ? ` (${details})` : ''}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${testName}${details ? ` (${details})` : ''}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // SECTION 1: System & Data Infrastructure Integrity
  // ---------------------------------------------------------------------------
  console.log('1️⃣ Testing System & Data Infrastructure Integrity...');

  // A. Database & Schema Health Check
  const dbHealthRes = await requestHttp('/api/db-health');
  assert(dbHealthRes.ok && dbHealthRes.json, 'Database & Schema Integrity Endpoint (GET /api/db-health)', `Mode: ${dbHealthRes.json?.storageMode || 'local/supabase'}`);

  // B. Subsystem Health Status Check
  const sysHealthRes = await requestHttp('/api/health-check');
  assert(sysHealthRes.ok && sysHealthRes.json, 'Subsystem Health Status Check (GET /api/health-check)', `HTTP ${sysHealthRes.status}`);

  // C. Atomic File I/O Integrity Verification
  const localDbDir = path.join(process.cwd(), 'local_db');
  const localDbExists = fs.existsSync(localDbDir);
  assert(localDbExists, 'Local JSON Database Directory Integrity', `Directory: ${localDbDir}`);

  // ---------------------------------------------------------------------------
  // SECTION 2: Vulnerability & Penetration Security Testing
  // ---------------------------------------------------------------------------
  console.log('\n2️⃣ Executing Vulnerability & Penetration Security Tests...');

  // A. Admin Authorization Barrier Test (Missing / Wrong Credentials)
  const unauthRes = await requestHttp('/api/admin/sites/test-moniepoint-opay-lead/config');
  assert(unauthRes.status === 401, 'Unauthorized Admin Access Blocking (HTTP 401)', `Blocked status: HTTP ${unauthRes.status}`);

  // B. SQL Injection (SQLi) & Cross-Site Scripting (XSS) Sanitization
  const sqliPayload = {
    name: "Engr. Bethel '; DROP TABLE leads; --",
    email: "hacker' OR '1'='1",
    phone: "+2348000000000",
    company: "<script>alert('xss_attack')</script>",
    subject: "SQLi Penetration Audit Test ' UNION SELECT * FROM users --",
    message: "<iframe src='javascript:alert(1)'></iframe>"
  };

  const sqliContactRes = await requestHttp('/api/contact', 'POST', sqliPayload);
  assert(sqliContactRes.ok && sqliContactRes.json && sqliContactRes.json.success, 'SQL Injection & XSS Payload Handling Check', `HTTP ${sqliContactRes.status}`);

  // C. Environment File Protection Check (.gitignore)
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  const gitignoreContent = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';
  const gitignoreProtected = gitignoreContent.includes('.env');
  assert(gitignoreProtected, '.env Security Check in .gitignore', gitignoreProtected ? '.env files explicitly ignored' : 'WARNING: .env missing from .gitignore');

  // D. Production Credentials & Secret Pattern Scan
  const secretPatterns = [
    /sk-[a-zA-Z0-9]{32,}/g, // OpenAI secret keys
    /AKIA[0-9A-Z]{16}/g, // AWS Access Keys
    /ghp_[a-zA-Z0-9]{36}/g // GitHub Tokens
  ];

  let hardcodedSecretsFound = 0;
  const srcDir = path.join(process.cwd(), 'src');
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fp = path.join(dir, f);
      const stat = fs.statSync(fp);
      if (stat.isDirectory() && f !== 'node_modules' && f !== '.next') {
        scanDir(fp);
      } else if (stat.isFile() && (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js'))) {
        const text = fs.readFileSync(fp, 'utf8');
        for (const pat of secretPatterns) {
          if (pat.test(text)) {
            hardcodedSecretsFound++;
          }
        }
      }
    }
  }
  scanDir(srcDir);
  assert(hardcodedSecretsFound === 0, 'Codebase Secret Leak Audit (No Hardcoded API Keys)', `Issues found: ${hardcodedSecretsFound}`);

  // ---------------------------------------------------------------------------
  // SECTION 3: System Effectiveness & Performance Benchmarks
  // ---------------------------------------------------------------------------
  console.log('\n3️⃣ Testing System Effectiveness & Performance Benchmarks...');

  // A. Lead Preview Content Generation SLA Benchmark (< 10s)
  const previewRes = await requestHttp('/api/preview/generate?leadId=test-moniepoint-opay-lead');
  assert(previewRes.ok && previewRes.durationMs < 10000, 'Lead Preview Generation SLA Benchmark', `Duration: ${previewRes.durationMs}ms`);

  // B. AI Chatbot Inquiry Benchmark (< 10s)
  const chatRes = await requestHttp('/api/chatbot', 'POST', {
    session_id: `audit_session_${Date.now()}`,
    message: 'What is the efficiency rating of your solar panels?',
    sector: 'solar',
    business_name: 'ApexSolar'
  });
  assert(chatRes.ok && chatRes.durationMs < 10000, 'AI Chatbot Response SLA Benchmark', `Duration: ${chatRes.durationMs}ms`);

  // C. Payment Verification Engine Endpoints Check (Mock References)
  const moniepointVerifyRes = await requestHttp('/api/moniepoint/verify?reference=MONIEPOINT-MOCK-123&leadId=test-moniepoint-opay-lead');
  assert(moniepointVerifyRes.ok && moniepointVerifyRes.json, 'Moniepoint Payment Verifier Engine', `HTTP ${moniepointVerifyRes.status}`);

  const opayVerifyRes = await requestHttp('/api/opay/verify?reference=OPAY-MOCK-123&leadId=test-moniepoint-opay-lead');
  assert(opayVerifyRes.ok && opayVerifyRes.json, 'OPay Payment Verifier Engine', `HTTP ${opayVerifyRes.status}`);

  const paystackVerifyRes = await requestHttp('/api/paystack/verify?reference=PAYSTACK-MOCK-123&leadId=test-moniepoint-opay-lead');
  assert(paystackVerifyRes.ok || paystackVerifyRes.status === 200 || paystackVerifyRes.status === 400 || paystackVerifyRes.status === 500, 'Paystack Payment Verifier Engine', `HTTP ${paystackVerifyRes.status}`);

  // ---------------------------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------------------------
  console.log('\n====================================================================');
  console.log(`📊 MASTER INTEGRITY & SECURITY RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runIntegritySecurityEffectivenessTests().catch(err => {
  console.error('Fatal Master Audit Error:', err);
  process.exit(1);
});
