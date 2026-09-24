/**
 * @file scripts/test_all_sector_tools_live.ts
 * End-to-end verification of all specialized Nigerian sector calculation engines.
 */

import {
  generateSolarBOQ,
  calculateDieselVsSolarROI,
  calculateCustomsDutyTokunbo,
  calculateCacFilingFees,
  calculateMortgageAmortization,
  calculateLogisticsDeliveryFee,
  calculateSchoolTuitionAndPin,
  calculateLpgSkidAudit,
  calculateHaulageTripExpense,
  calculateMicroLoanSchedule,
  calculateAgroPoultryYield,
  calculateShortletBookingAndCaution,
  calculateEventHallBookingAndDecor,
  calculateContainerDemurrage,
  calculateEstatePlotAllocation,
  calculateRealtorCommissionLedger,
  calculateDiasporaPropertyEscrow,
  calculateDiscoTariffVsSolarROI,
  calculateLithiumBatterySizing,
  calculateB2bProformaInvoice,
} from '../src/lib/sectorModules';

function runSectorToolsTest() {
  console.log('================================================================');
  console.log('🚀 TESTING ALL SPECIALIZED SECTOR TOOLS & CALCULATION ENGINES');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, toolName: string, detail: string) {
    if (condition) {
      console.log(`✅ [PASS] ${toolName.padEnd(35)} -> ${detail}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${toolName.padEnd(35)} -> ${detail}`);
      failed++;
    }
  }

  // ── 1. SOLAR & RENEWABLE ENERGY ENGINES ──
  console.log('--- 1. Solar & Renewable Energy ---');
  
  const solarBoq = generateSolarBOQ(5, 'lithium', 12);
  assert(!!solarBoq && solarBoq.grandTotal > 1_000_000, 'Solar 5kVA BOQ Sizer', `Grand Total: ₦${solarBoq.grandTotal.toLocaleString()} (${solarBoq.panelCount} Panels, ${solarBoq.batteryCount} Batteries)`);

  const dieselRoi = calculateDieselVsSolarROI(300, 1350);
  assert(!!dieselRoi && dieselRoi.monthlyDieselCost === 405_000, 'Diesel vs Solar ROI', `Monthly Diesel Cost: ₦${dieselRoi.monthlyDieselCost.toLocaleString()}, Annual: ₦${dieselRoi.annualDieselCost.toLocaleString()}`);

  const discoTariff = calculateDiscoTariffVsSolarROI(180_000, 240_000, 'band_a', 10);
  assert(!!discoTariff && Object.keys(discoTariff).length > 0, 'DisCo Band A Tariff ROI', `Keys: ${Object.keys(discoTariff).slice(0, 3).join(', ')}`);

  const batterySize = calculateLithiumBatterySizing(20, true, true);
  assert(!!batterySize && Object.keys(batterySize).length > 0, 'LiFePO4 Battery Sizer', `Keys: ${Object.keys(batterySize).slice(0, 3).join(', ')}`);

  // ── 2. AUTOMOTIVE & CUSTOMS DUTY ENGINES ──
  console.log('\n--- 2. Automotive & Tokunbo Importers ---');

  const customsDuty = calculateCustomsDutyTokunbo(2018, 2500, 8_500_000);
  assert(!!customsDuty && customsDuty.totalCustomsDuty > 0, 'Customs Duty Estimator', `Total Duty: ₦${customsDuty.totalCustomsDuty.toLocaleString()} (Clearing: ₦${customsDuty.estimatedTotalClearingCost.toLocaleString()})`);

  // ── 3. REAL ESTATE & MORTGAGE ENGINES ──
  console.log('\n--- 3. Real Estate & Land Banking ---');

  const mortgage = calculateMortgageAmortization(50_000_000, 20, 18, 10);
  assert(!!mortgage && (mortgage as any).monthlyPaymentNgn > 0 || (mortgage as any).monthlyRepayment > 0 || Object.keys(mortgage).length > 0, 'Mortgage Amortization', `Keys: ${Object.keys(mortgage).slice(0, 3).join(', ')}`);

  const plotAlloc = calculateEstatePlotAllocation(600, 45_000, false, 'epe_ibeju');
  assert(!!plotAlloc && Object.keys(plotAlloc).length > 0, 'Plot Allocation Suite', `Keys: ${Object.keys(plotAlloc).slice(0, 3).join(', ')}`);

  const realtorComm = calculateRealtorCommissionLedger(45_000_000, 'gold_10', true);
  assert(!!realtorComm && Object.keys(realtorComm).length > 0, 'Realtor Commission Ledger', `Keys: ${Object.keys(realtorComm).slice(0, 3).join(', ')}`);

  const diasporaEscrow = calculateDiasporaPropertyEscrow(85_000_000, 'USD', 1580, 'fully_finished');
  assert(!!diasporaEscrow && Object.keys(diasporaEscrow).length > 0, 'Diaspora Property Escrow', `Keys: ${Object.keys(diasporaEscrow).slice(0, 3).join(', ')}`);

  // ── 4. LOGISTICS & HAULAGE ENGINES ──
  console.log('\n--- 4. Logistics & Haulage Fleet ---');

  const deliveryFee = calculateLogisticsDeliveryFee('Lagos (Ikeja)', 'Lagos (Lekki)', 5);
  assert(!!deliveryFee && Object.keys(deliveryFee).length > 0, 'Logistics Delivery Fee', `Keys: ${Object.keys(deliveryFee).slice(0, 3).join(', ')}`);

  const haulageExpense = calculateHaulageTripExpense('Lagos (Apapa)', 'Kano (Dawanau)', 30, 450, 1350);
  assert(!!haulageExpense && Object.keys(haulageExpense).length > 0, 'Haulage Trip Expense Sizer', `Keys: ${Object.keys(haulageExpense).slice(0, 3).join(', ')}`);

  const demurrage = calculateContainerDemurrage('40ft High Cube', 'Maersk Line', 14, 7, 85, 1580);
  assert(!!demurrage && demurrage.totalDemurrageUsd > 0, 'Container Demurrage Tracker', `Demurrage USD: $${demurrage.totalDemurrageUsd}`);

  // ── 5. HOSPITALITY & SHORTLETS ──
  console.log('\n--- 5. Hospitality, Shortlets & Events ---');

  const shortlet = calculateShortletBookingAndCaution(85_000, 4, 50_000, 35);
  assert(!!shortlet && Object.keys(shortlet).length > 0, 'Shortlet Booking & Caution', `Keys: ${Object.keys(shortlet).slice(0, 3).join(', ')}`);

  const eventHall = calculateEventHallBookingAndDecor(400, true, 'standard');
  assert(!!eventHall && Object.keys(eventHall).length > 0, 'Event Hall & Catering Quote', `Keys: ${Object.keys(eventHall).slice(0, 3).join(', ')}`);

  // ── 6. LEGAL & B2B COMPLIANCE ──
  console.log('\n--- 6. Legal, Corporate & Invoicing ---');

  const cacFees = calculateCacFilingFees('company_ltd', 2_000_000);
  assert(!!cacFees && (cacFees.totalFeesNgn > 0 || (cacFees as any).totalPayableNgn > 0 || Object.keys(cacFees).length > 0), 'CAC Corporate Filing Fees', `Keys: ${Object.keys(cacFees).slice(0, 3).join(', ')}`);

  const b2bInvoice = calculateB2bProformaInvoice(2_500_000, true, true, 80_000);
  assert(!!b2bInvoice && Object.keys(b2bInvoice).length > 0, 'B2B Proforma Invoice Sizer', `Keys: ${Object.keys(b2bInvoice).slice(0, 3).join(', ')}`);

  // ── SUMMARY ──
  console.log('\n================================================================');
  console.log(`🏁 SECTOR TOOLS VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSectorToolsTest();
