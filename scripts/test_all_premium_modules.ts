/**
 * Comprehensive Automated Test Suite for All Premium Modules
 * Run with: npx tsx scripts/test_all_premium_modules.ts
 */

import { createDeal, getDeals, moveDealToStage, getPipelineStats, convertLeadToDeal } from '../src/lib/pipelineManager';
import { logActivity, getLeadActivities, getActivityStats } from '../src/lib/activityLogger';
import { createCampaignFromTemplate, getCampaigns, enrollLeadInCampaign, getDueCampaignSteps } from '../src/lib/dripCampaignEngine';
import { processChatMessage, getOrCreateChatSession } from '../src/lib/chatbotEngine';
import { createAppointment, getAppointments, updateAppointment, SECTOR_SERVICES } from '../src/lib/appointmentManager';
import { generateSolarBOQ, calculateDieselVsSolarROI, calculateCustomsDutyTokunbo, calculateCacFilingFees, buildWhatsAppCartOrderUrl } from '../src/lib/sectorModules';
import { calculateAdvancedLeadScore } from '../src/lib/advancedLeadScoring';
import { generateRevenueAttributionReport } from '../src/lib/revenueAttribution';

async function runAllTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING COMPLETE END-TO-END AUTOMATED TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASSED: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${testName}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // TEST 1: Pipeline & Kanban Engine
  // ---------------------------------------------------------------------------
  console.log('1️⃣ Testing Visual Pipeline & Deal Management...');
  try {
    const testDeal = await createDeal({
      title: 'Test Solar System Purchase',
      sector: 'solar',
      value: 1250000,
      contact_name: 'Test Client Ltd',
      contact_phone: '+2348012345678',
    });
    assert(!!testDeal.id, 'Deal Creation');
    assert(testDeal.stage_id === 'new_lead', 'Initial Deal Stage Assignment');

    const movedDeal = await moveDealToStage(testDeal.id, 'site_survey');
    assert(movedDeal.stage_id === 'site_survey', 'Deal Stage Transition (site_survey)');

    const stats = await getPipelineStats('solar');
    assert(stats.totalDeals > 0, 'Pipeline Stats Calculation');
  } catch (e: any) {
    console.error('  ❌ Pipeline error:', e.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Activity Logger Engine
  // ---------------------------------------------------------------------------
  console.log('\n2️⃣ Testing Real-Time Activity Timeline...');
  try {
    const act = await logActivity({
      type: 'outreach_whatsapp_sent',
      lead_id: 'test_lead_123',
      description: 'Sent WhatsApp proposal to client',
    });
    assert(!!act.id, 'Activity Logging');

    const leadActs = await getLeadActivities('test_lead_123');
    assert(leadActs.length > 0, 'Lead Activity History Fetch');

    const stats = await getActivityStats();
    assert(stats.total > 0, 'Activity Statistics Aggregation');
  } catch (e: any) {
    console.error('  ❌ Activity Logger error:', e.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Drip Campaign Engine
  // ---------------------------------------------------------------------------
  console.log('\n3️⃣ Testing Drip Campaign Engine & Templates...');
  try {
    const campaign = await createCampaignFromTemplate('solar_nurture');
    assert(!!campaign.id, 'Campaign Creation from Template');

    const enrollment = await enrollLeadInCampaign(campaign.id, {
      lead_id: 'test_lead_456',
      name: 'Dr. Chukwuemeka',
    });
    assert(enrollment.status === 'active', 'Lead Campaign Enrollment');

    const campaigns = await getCampaigns({ sector: 'solar' });
    assert(campaigns.length > 0, 'Campaign Retrieval by Sector');
  } catch (e: any) {
    console.error('  ❌ Drip Campaign error:', e.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 4: AI Chatbot Engine
  // ---------------------------------------------------------------------------
  console.log('\n4️⃣ Testing AI Chatbot & Automatic Lead Capture...');
  try {
    const sessionId = `test_session_${Date.now()}`;
    const session = await getOrCreateChatSession(sessionId, 'solar', 'Apex Solar');
    assert(session.messages.length > 0, 'Chat Session Initialization & Welcome Message');

    const chatRes = await processChatMessage(sessionId, 'My name is Alhaji Hassan, my phone is 08033334444. I want a 5kVA system.', 'solar', 'Apex Solar');
    assert(!!chatRes.reply, 'Chat Response Generation');
    assert(chatRes.session.lead_captured === true, 'Automated Contact Extraction & Lead Capture');
    assert(!!chatRes.session.visitor_phone, 'Phone Number Extracted (+234 / 080...)');
  } catch (e: any) {
    console.error('  ❌ Chatbot error:', e.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Appointment Booking Engine
  // ---------------------------------------------------------------------------
  console.log('\n5️⃣ Testing Appointment Booking & Services...');
  try {
    const appt = await createAppointment({
      service_name: 'On-Site Technical Survey',
      customer_name: 'Chief Lawson',
      customer_phone: '+2348099998888',
      date: '2026-08-01',
      time_slot: '11:00 AM',
      deposit_amount: 10000,
      sector: 'solar',
    });
    assert(!!appt.id, 'Appointment Booking');
    assert(appt.status === 'pending', 'Appointment Status Initialized');

    const updated = await updateAppointment(appt.id, { status: 'confirmed' });
    assert(updated.status === 'confirmed', 'Appointment Status Update');
  } catch (e: any) {
    console.error('  ❌ Appointment error:', e.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Sector Calculators (Solar BOQ, Tokunbo Duty, CAC Filing)
  // ---------------------------------------------------------------------------
  console.log('\n6️⃣ Testing Sector Calculators (BOQ, Duty, CAC)...');
  try {
    const boq = generateSolarBOQ(5, 'lithium');
    assert(boq.grandTotal > 0, 'Solar BOQ Generation (5kVA System)');
    assert(boq.panelCount > 0, 'Panel Count Calculated');

    const roi = calculateDieselVsSolarROI(250, 1350);
    assert(roi.fiveYearNetSavings > 0, 'Diesel vs Solar 5-Year Savings Calculated');

    const duty = calculateCustomsDutyTokunbo(2018, 2500, 8500000);
    assert(duty.totalCustomsDuty > 0, 'Tokunbo Customs Duty Calculated (NCS Matrix)');

    const cac = calculateCacFilingFees('company_ltd', 1000000);
    assert(cac.totalCost > 0, 'CAC Registration Filing Fee Calculated');

    const waUrl = buildWhatsAppCartOrderUrl('08012345678', 'Bisi', [{ name: 'Item 1', price: 5000, qty: 2 }]);
    assert(waUrl.includes('wa.me'), 'Express WhatsApp Order Link Generated');
  } catch (e: any) {
    console.error('  ❌ Sector Calculators error:', e.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Advanced 50+ Signal Predictive Lead Scoring
  // ---------------------------------------------------------------------------
  console.log('\n7️⃣ Testing Advanced Predictive Lead Scoring...');
  try {
    const scoreResult = calculateAdvancedLeadScore({
      name: 'Lekki Solar Client',
      phone_e164: '+2348031234567',
      rating: 4.8,
      reviews_count: 25,
      area: 'Lekki Phase 1, Lagos',
    });
    assert(scoreResult.score > 70, '50+ Signal Scoring Calculation');
    assert(scoreResult.grade === 'A+' || scoreResult.grade === 'A', 'Predictive Grade Assignment');
    assert(scoreResult.reasons.length > 0, 'Scoring Reasons & Strategy Generated');
  } catch (e: any) {
    console.error('  ❌ Lead Scoring error:', e.message);
    failed++;
  }

  // ---------------------------------------------------------------------------
  // TEST 8: Revenue Attribution Engine
  // ---------------------------------------------------------------------------
  console.log('\n8️⃣ Testing Revenue Attribution & ROI Dashboard...');
  try {
    const report = await generateRevenueAttributionReport(75000);
    assert(typeof report.totalRevenueNgn === 'number', 'Revenue Attribution Calculation');
    assert(typeof report.roiPercent === 'number', 'ROI Percentage Calculation');
  } catch (e: any) {
    console.error('  ❌ Revenue Attribution error:', e.message);
    failed++;
  }

  // Summary
  console.log('\n================================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch(console.error);
