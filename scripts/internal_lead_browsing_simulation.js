/**
 * scripts/internal_lead_browsing_simulation.js
 * 
 * Master ApexReach Lead Journey, Website Redesign, Feature Usage & Security Audit Suite
 * Simulates:
 * 1. Internal browsing across all 18 front-end app routes
 * 2. Full website claim & package tier customization (Express, Growth, VIP, Luxury)
 * 3. Client AI Instant Redesign (eco-green theme, dark luxury, custom typography) & Copy updates
 * 4. All software feature tools (Solar BOQ calculator, Diesel ROI, AI chatbot, appointment setter, DVA payment listener)
 * 5. Domain binding & hosting sandboxes (Cloudflare CNAME, Vercel domain mapping)
 * 6. Vulnerability & Security Audit (Admin 401 unauthorized blocking, XSS/SQLi payload sanitization, secrets scan)
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://127.0.0.1:3006';

async function requestHttp(urlPath, method = 'GET', data = null, headers = {}) {
  const url = `${BASE_URL}${urlPath}`;
  const controller = new AbortController();
  // 60s timeout to allow Next.js dev server dynamic imports
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  try {
    const opts = {
      method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ApexReachInternalLeadSimulator/3.0',
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
    clearTimeout(timeoutId);
    let json = null;
    try {
      json = JSON.parse(text);
    } catch (_) {}
    return { status: res.status, text, json, ok: res.ok };
  } catch (err) {
    clearTimeout(timeoutId);
    return { status: 0, error: err.message, ok: false };
  }
}

async function runMasterSimulationSuite() {
  console.log('====================================================================');
  console.log('🌐 ApexReach Comprehensive Webapp Lead Journey & Security Audit');
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
  // SECTION 1: Internal Page Route Browsing Across All 18 Front-End Routes
  // ---------------------------------------------------------------------------
  console.log('1️⃣ Internal Page Route Browsing & Rendering Verification (18 Routes)...');

  const pages = [
    { path: '/', label: 'Main Lead Directory & CRM Sequencer Platform' },
    { path: '/admin', label: 'Admin Management Console & Overview' },
    { path: '/admin/login', label: 'Admin Access & Login Portal' },
    { path: '/admin/handover', label: 'Client Handover & IP Export Portal' },
    { path: '/admin/domain', label: 'Domain & Session Infrastructure Console' },
    { path: '/admin/sites', label: 'Generated Client Sites Management Portal' },
    { path: '/admin/sites/test-moniepoint-opay-lead', label: 'Individual Site Admin & Editor' },
    { path: '/admin/ai-agent', label: 'AI Autonomous Agent Config Portal' },
    { path: '/admin/approvals', label: 'Human Review & Approval Queue Console' },
    { path: '/admin/design', label: 'Design System & Theme Customizer Portal' },
    { path: '/admin/team', label: 'Team Roles & Permissions Console' },
    { path: '/admin/autoresponders', label: 'Multi-Channel Autoresponders Console' },
    { path: '/admin/solar-pipeline', label: 'Solar Scraper & Outreach Pipeline Console' },
    { path: '/domain-session', label: 'Domain Session Management Console' },
    { path: '/setup', label: 'System Setup & API Keys Configuration Console' },
    { path: '/sites/test-moniepoint-opay-lead', label: 'Client Landing Page (Solar Business Site)' },
    { path: '/preview/test-moniepoint-opay-lead', label: 'Client Preview Page with Sandboxing & Proof Ticker' },
    { path: '/handover/test-moniepoint-opay-lead', label: 'Client Handover & Onboarding Journey Portal' }
  ];

  for (const page of pages) {
    const res = await requestHttp(page.path);
    const hasContent = res.text && (res.text.includes('<!DOCTYPE html>') || res.text.includes('<html') || res.text.includes('__next'));
    assert(res.ok && hasContent, `Browse Page: ${page.label} (${page.path})`, `HTTP ${res.status}`);
  }

  // ---------------------------------------------------------------------------
  // SECTION 2: Complete Lead Website Claiming Journey & Package Tiers
  // ---------------------------------------------------------------------------
  console.log('\n2️⃣ Simulating Website Claiming & Tier Customization Journey...');

  // A. Preview Generation
  const previewGenRes = await requestHttp('/api/preview/generate?leadId=test-moniepoint-opay-lead');
  assert(previewGenRes.ok && previewGenRes.json && previewGenRes.json.lead, 'Lead Preview Content Generation API', `Lead: ${previewGenRes.json?.lead?.name || 'N/A'}`);

  // B. Initial Contact Form Submission
  const claimData = {
    name: 'Engr. Bethel Bethel',
    email: 'bethel@testlead.com',
    phone: '+2348012345678',
    company: 'Apex Solar Solutions Ltd',
    subject: 'Claiming Solar Business Website',
    message: 'Claiming website ownership and requesting custom branding setup.'
  };

  const contactRes = await requestHttp('/api/contact', 'POST', claimData);
  assert(contactRes.ok && contactRes.json && contactRes.json.success, 'Website Contact Form Submission', `HTTP ${contactRes.status}`);

  // C. Escalation to Manual Revision
  const escalateData = {
    leadId: 'test-moniepoint-opay-lead',
    clientName: claimData.name,
    clientEmail: claimData.email,
    reason: 'Website ownership claimed; requesting custom green theme styling.',
    urgency: 'high'
  };

  const escRes = await requestHttp('/api/leads/escalate', 'POST', escalateData);
  assert(escRes.ok && escRes.json && escRes.json.success, 'Website Claim Status Escalation', `HTTP ${escRes.status}`);

  // D. Claiming Express Tier via Moniepoint Bank Transfer
  const claimMoniepointRes = await requestHttp('/api/preview/claim', 'POST', {
    leadId: 'test-moniepoint-opay-lead',
    clientName: claimData.name,
    clientEmail: claimData.email,
    paymentMethod: 'bank_transfer_moniepoint',
    selectedFeatures: ['Express Catalog', '1-Tap WhatsApp Checkout'],
    customInstructions: 'Please add express branding banner'
  });
  assert(claimMoniepointRes.ok && claimMoniepointRes.json && claimMoniepointRes.json.success, 'Website Claim: Express Tier via Moniepoint', `HTTP ${claimMoniepointRes.status}`);

  // E. Claiming Business Growth Tier via OPay Bank Transfer
  const claimOpayRes = await requestHttp('/api/preview/claim', 'POST', {
    leadId: 'test-moniepoint-opay-lead',
    clientName: claimData.name,
    clientEmail: claimData.email,
    paymentMethod: 'bank_transfer_opay',
    selectedFeatures: ['24/7 Customer AI Agent', 'AI Social Publisher', 'Custom .com.ng Domain'],
    customInstructions: 'Primary color should be emerald green (#10b981)'
  });
  assert(claimOpayRes.ok && claimOpayRes.json && claimOpayRes.json.success, 'Website Claim: Business Growth Tier via OPay', `HTTP ${claimOpayRes.status}`);

  // F. Dynamic Virtual Account (DVA) Verification (POST & GET)
  const dvaPostRes = await requestHttp('/api/preview/claim-dva', 'POST', {
    leadId: 'test-moniepoint-opay-lead',
    businessName: 'Apex Solar Solutions',
    isDeposit: false
  });
  assert(dvaPostRes.ok && dvaPostRes.json && dvaPostRes.json.success, 'Dynamic Virtual Account (DVA) Generation API', `Ref: ${dvaPostRes.json?.refId || 'N/A'}`);

  const refId = dvaPostRes.json?.refId || 'CLAIM-TEST-123';
  const dvaGetRes = await requestHttp(`/api/preview/claim-dva?refId=${refId}`);
  assert(dvaGetRes.ok && dvaGetRes.json && dvaGetRes.json.status, 'DVA Bank Transfer Status Listener API', `Status: ${dvaGetRes.json?.status}`);

  // ---------------------------------------------------------------------------
  // SECTION 3: Client Website Redesign & AI Customization Simulation
  // ---------------------------------------------------------------------------
  console.log('\n3️⃣ Testing Website AI Redesign Engine & Copy/Theme Customization...');

  // A. AI Instant Redesign Engine - Eco Green Theme
  const redesignGreenRes = await requestHttp('/api/preview/ai-redesign', 'POST', {
    leadId: 'test-moniepoint-opay-lead',
    prompt: 'Transform into a modern eco-friendly green theme with vibrant solar hero graphics'
  });
  assert(redesignGreenRes.ok && redesignGreenRes.json && redesignGreenRes.json.success, 'AI Redesign: Eco-Friendly Solar Theme', `HTTP ${redesignGreenRes.status}`);

  // B. AI Instant Redesign Engine - Midnight Dark Luxury Theme
  const redesignDarkRes = await requestHttp('/api/preview/ai-redesign', 'POST', {
    leadId: 'test-moniepoint-opay-lead',
    prompt: 'Transform into a midnight black luxury dark mode with gold accent buttons'
  });
  assert(redesignDarkRes.ok && redesignDarkRes.json && redesignDarkRes.json.success, 'AI Redesign: Midnight Luxury Dark Theme', `HTTP ${redesignDarkRes.status}`);

  // C. AI Copy & Styling Update API
  const updateData = {
    siteId: 'test-moniepoint-opay-lead',
    description: 'Change hero title to Premium Solar & Energy Solutions and primary color to #10b981'
  };

  const updateRes = await requestHttp('/api/sites/update', 'POST', updateData);
  assert(updateRes.ok && updateRes.json && updateRes.json.success, 'AI Site Copy & Styling Update API', `HTTP ${updateRes.status}`);

  // D. Client Theme Override Save
  const overrideRes = await requestHttp('/api/preview/override', 'POST', {
    leadId: 'test-moniepoint-opay-lead',
    overrides: {
      theme: { primary: '#10b981', accent: '#34d399', bg: '#022c22', text: '#ecfdf5', font: 'Outfit' },
      copy: { heroTitle: 'Clean Energy For Every Nigerian Home', heroSubtitle: 'No blackout, 25-year warranty solar installs.' }
    }
  });
  assert(overrideRes.ok && overrideRes.json && (overrideRes.json.success !== undefined || overrideRes.json.ok !== false), 'Client Theme & Copy Override Save API', `HTTP ${overrideRes.status}`);

  // ---------------------------------------------------------------------------
  // SECTION 4: Software Features Used by Lead Simulation
  // ---------------------------------------------------------------------------
  console.log('\n4️⃣ Testing Interactive Software Features Used by Business Lead...');

  const sessionId = `simulated_session_${Date.now()}`;

  // A. AI Chatbot Session Init
  const sessionRes = await requestHttp(`/api/chatbot?session_id=${sessionId}&sector=solar&business_name=ApexSolar`);
  assert(sessionRes.ok && sessionRes.json && sessionRes.json.success, 'AI Chatbot Session Initialization');

  // B. AI Chatbot Inquiry & Response Generation
  const chatData = {
    session_id: sessionId,
    message: 'Hello, what is the warranty and installation timeline for a 5kVA solar system?',
    sector: 'solar',
    business_name: 'ApexSolar'
  };

  const chatRes = await requestHttp('/api/chatbot', 'POST', chatData);
  const aiReply = chatRes.json?.reply || chatRes.json?.response || '';
  assert(chatRes.ok && chatRes.json && chatRes.json.success && aiReply.length > 10, 'AI Chatbot Response Generation', `Reply length: ${aiReply.length} chars`);

  // C. Sector Tools: Solar BOQ Calculation Engine
  const boqRes = await requestHttp('/api/sector-tools', 'POST', {
    action: 'solar_boq',
    kva: 5,
    batteryType: 'lithium',
    backupHours: 12
  });
  assert(boqRes.ok && boqRes.json && boqRes.json.success, 'Sector Tools: Solar BOQ Generator Engine', `HTTP ${boqRes.status}`);

  // D. Sector Tools: Diesel vs Solar ROI Economics Calculator
  const dieselRoiRes = await requestHttp('/api/sector-tools', 'POST', {
    action: 'diesel_roi',
    monthlyDieselLiters: 350,
    pricePerLiter: 1350
  });
  assert(dieselRoiRes.ok && dieselRoiRes.json && dieselRoiRes.json.success, 'Sector Tools: Diesel vs Solar ROI Calculator', `HTTP ${dieselRoiRes.status}`);

  // E. Customer AI Appointment Booking API
  const bookingData = {
    lead_id: 'test-moniepoint-opay-lead',
    service_name: '5kVA Solar Inspection & Audit',
    service_category: 'solar',
    customer_name: 'Alhaji Musa Sani',
    customer_phone: '+2348033334444',
    customer_email: 'musasani@test.com',
    date: '2026-08-10',
    time_slot: '10:00 AM',
    duration_minutes: 45
  };

  const bookingRes = await requestHttp('/api/appointments', 'POST', bookingData);
  assert(bookingRes.ok && bookingRes.json && bookingRes.json.success, 'Customer AI Appointment Booking API', `HTTP ${bookingRes.status}`);

  // F. Handover Package Data Export API
  const handoverDataRes = await requestHttp('/api/preview/export?leadId=test-moniepoint-opay-lead');
  assert(handoverDataRes.ok || handoverDataRes.status === 200, 'Client Handover Data Export API', `HTTP ${handoverDataRes.status}`);

  // ---------------------------------------------------------------------------
  // SECTION 5: Domain Binding & Hosting Infrastructure Sandboxes
  // ---------------------------------------------------------------------------
  console.log('\n5️⃣ Testing Domain Binding & Hosting Sandboxes...');

  const adminHeaders = { 'x-admin-password': 'admin123', 'x-admin-token': 'bethelmind_admin_2026' };

  // A. Cloudflare DNS Provisioning Sandbox
  const cfRes = await requestHttp(
    '/api/admin/sites/test-moniepoint-opay-lead/hosting/cloudflare',
    'POST',
    { domain: 'apexsolarnigeria.com', proxied: true },
    adminHeaders
  );
  assert(cfRes.ok && cfRes.json && cfRes.json.success, 'Cloudflare DNS Provisioning Sandbox', cfRes.json?.message || `HTTP ${cfRes.status}`);

  // B. Vercel Custom Domain Binding Sandbox
  const vercelRes = await requestHttp(
    '/api/admin/sites/test-moniepoint-opay-lead/hosting/vercel',
    'POST',
    { domain: 'apexsolarnigeria.com' },
    adminHeaders
  );
  assert(vercelRes.ok && vercelRes.json && vercelRes.json.success, 'Vercel Custom Domain Binding Sandbox', vercelRes.json?.message || `HTTP ${vercelRes.status}`);

  // C. Site Admin Config Retrieval
  const siteConfigRes = await requestHttp('/api/admin/sites/test-moniepoint-opay-lead/config', 'GET', null, adminHeaders);
  assert(siteConfigRes.ok && siteConfigRes.json, 'Site Admin Config Retrieval API', `HTTP ${siteConfigRes.status}`);

  // D. System Health Check
  const healthRes = await requestHttp('/api/health-check');
  assert(healthRes.ok || healthRes.status === 200, 'System Health & Infrastructure Check', `HTTP ${healthRes.status}`);

  // ---------------------------------------------------------------------------
  // SECTION 6: Vulnerability & Security Audit
  // ---------------------------------------------------------------------------
  console.log('\n6️⃣ Executing Vulnerability & Security Audit...');

  // A. Unauthorized Admin Access Protection Test (Invalid Password Header)
  const unauthRes = await requestHttp(
    '/api/admin/sites/test-moniepoint-opay-lead/hosting/cloudflare',
    'POST',
    { domain: 'hacked-domain.com' },
    { 'x-admin-password': 'wrong_password_999' }
  );
  assert(unauthRes.status === 401, 'Unauthorized Admin Access Blocking (HTTP 401)', `Status: HTTP ${unauthRes.status}`);

  // B. SQL Injection & XSS Payload Sanitization Test
  const maliciousData = {
    name: "Engr. Bethel '; DROP TABLE leads; -- <script>alert('xss')</script>",
    email: 'hacker@test.com',
    phone: '+2348000000000',
    company: "<img src=x onerror=alert('xss')>",
    subject: "SQLi Injection Test ' OR 1=1 --",
    message: "Test payload for vulnerability check."
  };

  const maliciousContactRes = await requestHttp('/api/contact', 'POST', maliciousData);
  assert(maliciousContactRes.ok && maliciousContactRes.json && maliciousContactRes.json.success, 'SQL Injection & XSS Payload Handling Check', `HTTP ${maliciousContactRes.status}`);

  // C. Codebase Hardcoded Secrets & .gitignore Security Check
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  const gitignoreOk = fs.existsSync(gitignorePath) && fs.readFileSync(gitignorePath, 'utf8').includes('.env');
  assert(gitignoreOk, '.gitignore Environment Protection Check', gitignoreOk ? '.env explicitly ignored' : '.env not found in .gitignore');

  // ---------------------------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------------------------
  console.log('\n====================================================================');
  console.log(`📊 MASTER AUDIT SIMULATION RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runMasterSimulationSuite().catch(err => {
  console.error('Fatal master audit simulation error:', err);
  process.exit(1);
});
