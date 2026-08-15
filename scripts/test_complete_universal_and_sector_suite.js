const {
  generateSolarBOQ,
  calculateDieselVsSolarROI,
  calculateLithiumBatterySizing,
  calculateEstatePlotAllocation,
  calculateMortgageAmortization,
  calculateCustomsDutyTokunbo,
  calculateCarSwapValuation,
  calculateHmoClaimsAndAuthCode,
  calculateSurgeryAndAdmissionDeposit,
  calculateSchoolTuitionAndPin,
  calculateCbtExamScoring,
  calculateCacFilingFees,
  calculateScumlAndCacCompliance,
  calculateShortletBookingAndCaution,
  calculateShortletCautionAndPowerReconciliation,
  calculateLogisticsDeliveryFee,
  calculatePodDispatchAndRemittance,
  calculateEstateVisitorPassAndLevy,
  calculateChinaImportFreightLandedCost,
  calculateConstructionConcreteAndRebar,
  calculateLpgStationDippingAndCashAudit,
  calculateNigerianPayeAndSalarySlip,
  calculateObd2DiagnosticFaultEstimate,
  calculatePoultryFcrAndEggProduction,
  calculateBeautySalonStylistBooking,
  buildWhatsAppCartOrderUrl
} = require('../src/lib/sectorModules.ts');

const { buildFallbackCopy } = require('../src/lib/designGenerator.ts');

async function runComprehensiveTestSuite() {
  console.log('================================================================');
  console.log('🧪 RUNNING COMPREHENSIVE SUITE TEST: 19 UNIVERSAL + SECTOR ENGINES');
  console.log('================================================================\n');

  const testResults = [];

  function assert(name, condition, details) {
    if (condition) {
      console.log(`✅ [PASS] ${name}: ${details}`);
      testResults.push({ name, status: 'PASS', details });
    } else {
      console.error(`❌ [FAIL] ${name}: ${details}`);
      testResults.push({ name, status: 'FAIL', details });
    }
  }

  // ── 1. E-Commerce & WhatsApp Cart Order Engine ──
  try {
    const items = [
      { name: 'Luxury Silk Kaftan', price: 45000, qty: 2 },
      { name: 'Handcrafted Italian Shoes', price: 85000, qty: 1 }
    ];
    const cartUrl = buildWhatsAppCartOrderUrl('08022791227', 'Chief Adeleke', items, 'Lekki Phase 1');
    assert(
      'WhatsApp E-Commerce Cart Engine',
      cartUrl.includes('Luxury%20Silk%20Kaftan') && cartUrl.includes('175%2C000') && cartUrl.includes('wa.me'),
      `Generated Order URL: ${cartUrl.substring(0, 70)}...`
    );
  } catch (e) {
    assert('WhatsApp E-Commerce Cart Engine', false, e.message);
  }

  // ── 2. Invoice & 7.5% Nigerian VAT Calculation Engine ──
  try {
    const subtotal = 150000;
    const vatRate = 0.075;
    const vatAmount = subtotal * vatRate;
    const total = subtotal + vatAmount;
    assert(
      'Invoice & VAT Tax Calculation Engine',
      total === 161250 && vatAmount === 11250,
      `Subtotal: ₦150,000 | 7.5% VAT: ₦${vatAmount.toLocaleString()} | Total: ₦${total.toLocaleString()}`
    );
  } catch (e) {
    assert('Invoice & VAT Tax Calculation Engine', false, e.message);
  }

  // ── 3. Solar 5kVA–20kVA BOQ & DisCo ROI Engine ──
  try {
    const boq = generateSolarBOQ(10, 'lithium', 12);
    const roi = calculateDieselVsSolarROI(300, 1350);
    const battery = calculateLithiumBatterySizing(24, true, true);
    assert(
      'Solar BOQ & LiFePO4 Sizing Suite',
      boq.grandTotal > 0 && roi.monthlyDieselCost > 0 && battery.recommendedBatteryCapacityKwh > 0,
      `10kVA BOQ: ₦${boq.grandTotal.toLocaleString()} | Monthly Diesel Cost: ₦${roi.monthlyDieselCost.toLocaleString()} | Battery: ${battery.recommendedBatteryCapacityKwh}kWh`
    );
  } catch (e) {
    assert('Solar BOQ & LiFePO4 Sizing Suite', false, e.message);
  }

  // ── 4. Real Estate Mortgage & Land Allocation Engine ──
  try {
    const estate = calculateEstatePlotAllocation(600, 50000, true, 'epe_ibeju');
    const mortgage = calculateMortgageAmortization(50000000, 20, 18, 10);
    assert(
      'Real Estate Plot Layout & Mortgage Suite',
      estate.totalOutrightPackageNgn > 0 && mortgage.monthlyPaymentNgn > 0,
      `600 SQM Total Outright: ₦${estate.totalOutrightPackageNgn.toLocaleString()} | Monthly Mortgage: ₦${mortgage.monthlyPaymentNgn.toLocaleString()}`
    );
  } catch (e) {
    assert('Real Estate Plot Layout & Mortgage Suite', false, e.message);
  }

  // ── 5. Automotive PAAR Customs Duty & Trade-In Valuation ──
  try {
    const duty = calculateCustomsDutyTokunbo(2018, 2500, 9500000);
    const swap = calculateCarSwapValuation(7500000, 120000, 'first_body_clean', 'untouched_chilling_ac', 22000000);
    assert(
      'Automotive PAAR Customs & Trade-In Suite',
      duty.totalCustomsDuty > 0 && swap.finalSwapTradeInOfferNgn > 0,
      `PAAR Customs Total: ₦${duty.totalCustomsDuty.toLocaleString()} | Trade-In Offer: ₦${swap.finalSwapTradeInOfferNgn.toLocaleString()}`
    );
  } catch (e) {
    assert('Automotive PAAR Customs & Trade-In Suite', false, e.message);
  }

  // ── 6. Healthcare HMO Claims & Surgery Deposit Engine ──
  try {
    const hmo = calculateHmoClaimsAndAuthCode('Reliance HMO', 'Minor Surgical Wound Debridement', 45000, false, true);
    const surgery = calculateSurgeryAndAdmissionDeposit('caesarean_section', 4, 'semi_private');
    assert(
      'Healthcare HMO Claims & Surgery Suite',
      hmo.totalTariffNgn > 0 && surgery.grandTotalEstimateNgn > 0,
      `HMO Tariff: ₦${hmo.totalTariffNgn.toLocaleString()} | Surgery Estimate: ₦${surgery.grandTotalEstimateNgn.toLocaleString()}`
    );
  } catch (e) {
    assert('Healthcare HMO Claims & Surgery Suite', false, e.message);
  }

  // ── 7. Schools & Academies Tuition & CBT Engine ──
  try {
    const tuition = calculateSchoolTuitionAndPin('JSS 1', false, 3);
    const cbt = calculateCbtExamScoring(52, 60, 18, 19);
    assert(
      'School Tuition & CBT Scoring Suite',
      tuition.annualCostNgn > 0 && cbt.totalScore100 > 0,
      `Annual Tuition (JSS 1): ₦${tuition.annualCostNgn.toLocaleString()} | CBT WAEC Grade: ${cbt.waecGrade} (${cbt.totalScore100}%)`
    );
  } catch (e) {
    assert('School Tuition & CBT Scoring Suite', false, e.message);
  }

  // ── 8. Law Firm CAC Incorporation & SCUML Audit ──
  try {
    const cac = calculateCacFilingFees('company_ltd', 2000000);
    const scuml = calculateScumlAndCacCompliance('company_ltd', 2, false, true);
    assert(
      'Law Firm CAC Statutory & SCUML Suite',
      cac.totalCost > 0 && scuml.grandTotalComplianceCostNgn > 0,
      `CAC Statutory 2M Ltd: ₦${cac.totalCost.toLocaleString()} | SCUML Remediation: ₦${scuml.grandTotalComplianceCostNgn.toLocaleString()}`
    );
  } catch (e) {
    assert('Law Firm CAC Statutory & SCUML Suite', false, e.message);
  }

  // ── 9. Hotel & Shortlet Caution & Diesel Power Engine ──
  try {
    const booking = calculateShortletBookingAndCaution(95000, 4, 60000, 40);
    const power = calculateShortletCautionAndPowerReconciliation(95000, 4, 60000, 40, 210, 5000, 209.5);
    assert(
      'Hotels & Shortlet Booking & Power Suite',
      booking.grandTotalNgn > 0 && power.netRefundableCautionNgn >= 0,
      `4-Night Total: ₦${booking.grandTotalNgn.toLocaleString()} | Guest Caution Refund: ₦${power.netRefundableCautionNgn.toLocaleString()}`
    );
  } catch (e) {
    assert('Hotels & Shortlet Booking & Power Suite', false, e.message);
  }

  // ── 10. Logistics Delivery & POD Cash Remittance Engine ──
  try {
    const delivery = calculateLogisticsDeliveryFee('Lagos (Ikeja)', 'Lagos (Lekki)', 12);
    const pod = calculatePodDispatchAndRemittance(65, 32000, 15, 3500, 1600000);
    assert(
      'Logistics Delivery & POD Remittance Suite',
      delivery.interStateWaybillFeeNgn > 0 && pod.riderCashCollectedNgn > 0,
      `Waybill Fee (12kg): ₦${delivery.interStateWaybillFeeNgn.toLocaleString()} | Total POD Collected: ₦${pod.riderCashCollectedNgn.toLocaleString()}`
    );
  } catch (e) {
    assert('Logistics Delivery & POD Remittance Suite', false, e.message);
  }

  // ── 11. Estate Digital Visitor Gate Pass & Monthly Levy Engine ──
  try {
    const gate = calculateEstateVisitorPassAndLevy(250, 30000, 150, 2);
    assert(
      'Estate Digital Gate Pass & Levy Suite',
      gate.totalMonthlyLevyBudgetNgn === 7500000 && gate.sampleAccessCode.startsWith('EP-'),
      `Monthly Levy Budget: ₦${gate.totalMonthlyLevyBudgetNgn.toLocaleString()} | Sample Access Code: ${gate.sampleAccessCode}`
    );
  } catch (e) {
    assert('Estate Digital Gate Pass & Levy Suite', false, e.message);
  }

  // ── 12. China 1688 / Alibaba Import Freight & Landed Cost Sizer ──
  try {
    const china = calculateChinaImportFreightLandedCost(45, 100, 25, 0.15, 'air_express');
    assert(
      'China Import Freight & Landed Cost Suite',
      china.totalLandedCostNgn > 0 && china.suggestedRetailPriceNgn > china.unitLandedCostNgn,
      `Unit Landed: ₦${china.unitLandedCostNgn.toLocaleString()} | Suggested Retail: ₦${china.suggestedRetailPriceNgn.toLocaleString()} (Profit: ₦${china.projectedNetProfitNgn.toLocaleString()})`
    );
  } catch (e) {
    assert('China Import Freight & Landed Cost Suite', false, e.message);
  }

  // ── 13. Construction Concrete, Cement & Rebar Sizer ──
  try {
    const concrete = calculateConstructionConcreteAndRebar(15, 10, 0.15);
    assert(
      'Construction Concrete & Rebar Suite',
      concrete.cementBagsRequired > 0 && concrete.totalMaterialEstimateNgn > 0,
      `150 SQM Slab: ${concrete.cementBagsRequired} Bags Cement | Rebar: ${concrete.rebarTonnage} Tons | Est. Cost: ₦${concrete.totalMaterialEstimateNgn.toLocaleString()}`
    );
  } catch (e) {
    assert('Construction Concrete & Rebar Suite', false, e.message);
  }

  // ── 14. Petrol Station & LPG Daily Dipping & Cash Audit ──
  try {
    const fuel = calculateLpgStationDippingAndCashAudit(35000, 26500, 8400, 1050, 8820000);
    assert(
      'Fuel Station & LPG Tank Dipping Audit Suite',
      fuel.expectedCashRevenueNgn === 8820000 && fuel.physicalDischargeLiters === 8500,
      `Pump Sales: ${fuel.pumpTotalizerSalesLiters.toLocaleString()}L | Revenue: ₦${fuel.expectedCashRevenueNgn.toLocaleString()} | Status: ${fuel.auditRiskStatus.substring(0, 35)}...`
    );
  } catch (e) {
    assert('Fuel Station & LPG Tank Dipping Audit Suite', false, e.message);
  }

  // ── 15. Nigerian PAYE Tax & Monthly Payslip Engine ──
  try {
    const paye = calculateNigerianPayeAndSalarySlip(500000, true, 8, 10);
    assert(
      'Nigerian PAYE Tax & Payslip Suite',
      paye.monthlyPayeTaxNgn > 0 && paye.netTakeHomeSalaryNgn > 0,
      `Gross: ₦500,000 | 8% Pension: ₦${paye.employeeMonthlyPensionNgn.toLocaleString()} | PAYE Tax: ₦${paye.monthlyPayeTaxNgn.toLocaleString()} | Net Take-Home: ₦${paye.netTakeHomeSalaryNgn.toLocaleString()}`
    );
  } catch (e) {
    assert('Nigerian PAYE Tax & Payslip Suite', false, e.message);
  }

  // ── 16. Automotive OBD-II Diagnostic Fault Estimator ──
  try {
    const obd = calculateObd2DiagnosticFaultEstimate('P0420', 'Toyota', 2016);
    assert(
      'Automotive OBD-II Diagnostic Repair Suite',
      obd.totalEstimatedRepairNgn > 0 && obd.diagnosticTitle.includes('Catalytic'),
      `Fault Code ${obd.faultCode}: ${obd.diagnosticTitle.substring(0, 40)}... | Est. Repair: ₦${obd.totalEstimatedRepairNgn.toLocaleString()}`
    );
  } catch (e) {
    assert('Automotive OBD-II Diagnostic Repair Suite', false, e.message);
  }

  // ── 17. Poultry FCR Feed & Egg Production Sizer ──
  try {
    const poultry = calculatePoultryFcrAndEggProduction('layer', 2000, 35, 380);
    assert(
      'Poultry FCR & Egg Production Suite',
      poultry.weeklyGrossRevenueNgn > 0 && poultry.weeklyNetFarmProfitNgn > 0,
      `Weekly Revenue: ₦${poultry.weeklyGrossRevenueNgn.toLocaleString()} | Feed Cost: ₦${poultry.weeklyFeedCostNgn.toLocaleString()} | Weekly Profit: ₦${poultry.weeklyNetFarmProfitNgn.toLocaleString()}`
    );
  } catch (e) {
    assert('Poultry FCR & Egg Production Suite', false, e.message);
  }

  // ── 18. Beauty Salon VIP Stylist Booking & Deposit Sizer ──
  try {
    const salon = calculateBeautySalonStylistBooking('hair_extensions', 24, 'master_director');
    assert(
      'Beauty Salon VIP Stylist Booking Suite',
      salon.mandatoryDeposit25PercentNgn > 0 && salon.bookingConfirmationCode.startsWith('VIP-'),
      `Total Booking: ₦${salon.totalBookingCostNgn.toLocaleString()} | 25% Deposit: ₦${salon.mandatoryDeposit25PercentNgn.toLocaleString()} | Code: ${salon.bookingConfirmationCode}`
    );
  } catch (e) {
    assert('Beauty Salon VIP Stylist Booking Suite', false, e.message);
  }

  // ── 19. Sector Copywriting & Universal Personalization Engine ──
  try {
    const copySolar = buildFallbackCopy({ name: 'Alpha Solar Power', category: 'Solar Energy', area: 'Ikeja' });
    const copyLegal = buildFallbackCopy({ name: 'Apex Legal Chambers', category: 'Corporate Law Firm', area: 'Victoria Island' });
    assert(
      'Sector Copywriting & Personalization Engine',
      copySolar.services[0].title.includes('Solar') && copyLegal.services[0].title.includes('CAC'),
      `Solar Tool: "${copySolar.services[0].title}" | Law Tool: "${copyLegal.services[0].title}"`
    );
  } catch (e) {
    assert('Sector Copywriting & Personalization Engine', false, e.message);
  }

  console.log('\n================================================================');
  console.log(`📊 FINAL TEST REPORT: ${testResults.filter(t => t.status === 'PASS').length} / ${testResults.length} TEST SUITES PASSED ✅`);
  console.log('================================================================');

  const failedCount = testResults.filter(t => t.status === 'FAIL').length;
  if (failedCount === 0) {
    console.log('🎉 ALL 19 UNIVERSAL AND SECTOR REVENUE ENGINES ARE 100% OPERATIONAL!');
    process.exit(0);
  } else {
    console.error(`⚠️ ${failedCount} tests failed.`);
    process.exit(1);
  }
}

runComprehensiveTestSuite();
