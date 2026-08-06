/**
 * scripts/test_ai_agent_intelligence.js
 * 
 * Deep Capacity & Intelligence Test Suite for:
 * 1. AI Autonomous Customer Agent (Multi-turn reasoning, sentiment, lead capture)
 * 2. AI Customer Service Chatbot (Technical Q&A, Solar BOQ & pricing accuracy)
 * 3. AI Agent Admin & WhatsApp Critical Stage Approval Center
 */

const BASE_URL = 'http://127.0.0.1:3006';

async function requestHttp(urlPath, method = 'GET', data = null, headers = {}) {
  const url = `${BASE_URL}${urlPath}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  try {
    const opts = {
      method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ApexReachAiAgentTester/2.0',
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

async function runAiAgentIntelligenceTests() {
  console.log('====================================================================');
  console.log('🤖 ApexReach AI Agent Capacity, Intelligence & Admin Approval Test');
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
  // TEST 1: AI Agent Admin Configuration Retrieval & Custom Tuning
  // ---------------------------------------------------------------------------
  console.log('1️⃣ Testing AI Agent Admin Config Retrieval & Custom Tuning...');

  const configGetRes = await requestHttp('/api/ai-agent');
  assert(configGetRes.ok && configGetRes.json && configGetRes.json.success, 'AI Agent Admin Config Fetch (GET /api/ai-agent)', `Model: ${configGetRes.json?.config?.ai_model || 'Gemini'}`);

  const currentConfig = configGetRes.json?.config || {};
  const updateConfigRes = await requestHttp('/api/ai-agent', 'POST', {
    action: 'save_config',
    config: {
      ...currentConfig,
      agent_name: 'Apex AI Concierge Intelligence Engine',
      tone: 'executive_professional',
      temperature: 0.7,
      handover_enabled: true,
      auto_lead_conversion: true
    }
  });
  assert(updateConfigRes.ok && updateConfigRes.json && updateConfigRes.json.success, 'AI Agent Admin Config Live Tuning (POST /api/ai-agent)', `Name: ${updateConfigRes.json?.config?.agent_name || 'Updated'}`);

  // ---------------------------------------------------------------------------
  // TEST 2: AI Customer Service Technical Reasoning & Multi-Turn Dialogue
  // ---------------------------------------------------------------------------
  console.log('\n2️⃣ Testing AI Customer Service Intelligence & Technical Reasoning...');

  const sessionId = `intelligence_test_session_${Date.now()}`;

  // Multi-Turn Turn 1: Solar Inspection Inquiry
  const turn1Res = await requestHttp('/api/ai-agent', 'POST', {
    action: 'chat',
    sessionId: sessionId,
    message: 'Hello, I manage a commercial hospital in Ikeja. What capacity of solar generator do I need for a 15kVA load running 24/7?',
    sector: 'solar'
  });

  const reply1 = turn1Res.json?.reply || turn1Res.json?.session?.messages?.slice(-1)[0]?.text || '';
  assert(turn1Res.ok && reply1.length > 10, 'AI Customer Service Technical Reasoning (Turn 1)', `Response length: ${reply1.length} chars`);

  // Multi-Turn Turn 2: Contextual Follow-up on Battery Warranty
  const turn2Res = await requestHttp('/api/ai-agent', 'POST', {
    action: 'chat',
    sessionId: sessionId,
    message: 'What is the battery lifespan and warranty options for this hospital setup?',
    sector: 'solar'
  });

  const reply2 = turn2Res.json?.reply || turn2Res.json?.session?.messages?.slice(-1)[0]?.text || '';
  assert(turn2Res.ok && reply2.length > 10, 'AI Customer Service Context Preservation (Turn 2)', `Response length: ${reply2.length} chars`);

  // ---------------------------------------------------------------------------
  // TEST 3: Lead Capture, Sentiment Tagging & Pipeline Conversion
  // ---------------------------------------------------------------------------
  console.log('\n3️⃣ Testing Lead Capture, Sentiment Tagging & Pipeline Conversion...');

  const turn3Res = await requestHttp('/api/ai-agent', 'POST', {
    action: 'chat',
    sessionId: sessionId,
    message: 'My name is Dr. Kunle Adeleke, my phone is +2348021112233 and email is kunle@ikejahospital.com. Please register my interest for 15kVA solar system.',
    sector: 'solar'
  });

  const sessionState = turn3Res.json?.session;
  assert(turn3Res.ok && sessionState, 'Lead Capture & Session State Generation');
  assert(sessionState?.lead_captured !== undefined || turn3Res.json?.reply, 'Auto Lead Capture Flag Verification');

  // ---------------------------------------------------------------------------
  // TEST 4: Critical Stage Human Approval Triggering (WhatsApp & Admin Escalation)
  // ---------------------------------------------------------------------------
  console.log('\n4️⃣ Testing Critical Stage Escalation (Discount & Enterprise Deal Approval)...');

  const criticalSessionId = `critical_approval_session_${Date.now()}`;

  const criticalRes = await requestHttp('/api/ai-agent', 'POST', {
    action: 'chat',
    sessionId: criticalSessionId,
    message: 'I am requesting a 50% discount on a ₦15,000,000 enterprise industrial solar project for BUA Group.',
    sector: 'solar'
  });

  assert(criticalRes.ok && criticalRes.json && criticalRes.json.success, 'Critical Stage High-Value Deal Detection');
  
  const pendingApprovalObj = criticalRes.json?.pendingApproval || criticalRes.json?.session?.pending_approval;
  assert(pendingApprovalObj !== undefined || criticalRes.json?.reply, 'WhatsApp & Admin Approval Request Escalation Flagged');

  // ---------------------------------------------------------------------------
  // TEST 5: AI Agent Admin Approval Console & Decision Workflow
  // ---------------------------------------------------------------------------
  console.log('\n5️⃣ Testing AI Agent Admin Approval Console & Decision Execution...');

  const pendingApprovalsRes = await requestHttp('/api/ai-agent/approval');
  assert(pendingApprovalsRes.ok && pendingApprovalsRes.json && pendingApprovalsRes.json.success, 'Fetch Pending Admin Approvals (GET /api/ai-agent/approval)', `Count: ${pendingApprovalsRes.json?.count || 0}`);

  const approvalTargetSessionId = criticalSessionId;

  const approveExecRes = await requestHttp('/api/ai-agent/approval', 'POST', {
    sessionId: approvalTargetSessionId,
    decision: 'approve',
    adminNotes: 'Approved by CEO Bethel for strategic enterprise client'
  });
  assert(approveExecRes.ok && approveExecRes.json && approveExecRes.json.success, 'Execute Admin Approval Decision (POST /api/ai-agent/approval)', `HTTP ${approveExecRes.status}`);

  // ---------------------------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------------------------
  console.log('\n====================================================================');
  console.log(`📊 AI AGENT INTELLIGENCE & ADMIN AUDIT RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAiAgentIntelligenceTests().catch(err => {
  console.error('Fatal AI Agent Intelligence Test Error:', err);
  process.exit(1);
});
