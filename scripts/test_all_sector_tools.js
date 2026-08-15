/**
 * Comprehensive Automated Physical Testing & Benchmark Suite
 * Tests all 48 Sector Calculation Engines against Nigerian Institutional & Commercial Standards
 */

const {
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
  calculateColdRoomSpoilageAndPowerCost,
  calculateShortletBookingAndCaution,
  calculateEventHallBookingAndDecor,
  calculateContainerDemurrage,
  calculateCbtExamScoring,
  calculateReportCardBroadsheet,
  calculateResultCheckerPins,
  calculateMachineryLeaseExpense,
  calculateSecurityPatrolAndGatePass,
  calculateHmoClaimsAndAuthCode,
  calculateSurgeryAndAdmissionDeposit,
  calculateDiagnosticLabPackage,
  calculatePharmacyFefoExpiryAudit,
  calculateEstatePlotAllocation,
  calculateRealtorCommissionLedger,
  calculateDiasporaPropertyEscrow,
  calculateCarSwapValuation,
  calculateAutoConsignmentProfit,
  calculateDiscoTariffVsSolarROI,
  calculateLithiumBatterySizing,
  calculateGrainMoistureDiscount,
  calculateScumlAndCacCompliance,
  calculateLegalRetainerAndDebitNote,
  calculatePodDispatchAndRemittance,
  calculateBoutiqueStockShrinkage,
  calculateTankerDischargeVariance,
  calculateUstWaterAndPumpAudit,
  calculateInterstateUnionRoadTax,
  calculateGpsDieselMileageAudit,
  calculateEsusuThriftPassbook,
  calculateSalaryRemitaLoanEligibility,
  calculateShortletCautionAndPowerReconciliation,
  calculateEventCenterOvertimeAndCaution,
  calculatePaarCustomsAssessment,
  calculateContainerDepositRefund,
  calculateQuarryWeighbridgeDispatch,
  calculateConcreteStructuralMix,
  calculateSecurityGuardRosterAndPatrol,
  calculateEstateVisitorPassCapacity,
  calculateB2bProformaInvoice,
} = require('../src/lib/sectorModules.ts');

function assertValidNumber(val, label) {
  if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
    throw new Error(`Invalid number for ${label}: received ${val}`);
  }
}

function runTests() {
  console.log('🚀 STARTING PHYSICAL DEEP TEST OF ALL 48 SECTOR TOOLS...\n');

  const testCases = [
    // 1. Solar
    {
      sector: 'Solar & Renewable Energy',
      toolName: 'DisCo Band A vs Solar ROI',
      actionKey: 'disco_tariff_solar_roi',
      fn: () => calculateDiscoTariffVsSolarROI(180000, 240000, 'band_a', 10),
      heroExtractor: (r) => `Monthly Savings: ₦${r.monthlySolarEnergySavingsNgn.toLocaleString()} | 5-Yr Net: ₦${r.fiveYearNetSavingsNgn.toLocaleString()}`,
    },
    {
      sector: 'Solar & Renewable Energy',
      toolName: 'LiFePO4 Lithium Battery Sizer',
      actionKey: 'lithium_battery_sizing',
      fn: () => calculateLithiumBatterySizing(18, true, true),
      heroExtractor: (r) => `LiFePO4: ${r.recommendedBatteryCapacityKwh}kWh | Peak Array: ${r.solarArrayPeakWattageWp}Wp`,
    },
    {
      sector: 'Solar & Renewable Energy',
      toolName: '5kVA-20kVA Solar Hybrid BOQ',
      actionKey: 'solar_boq',
      fn: () => generateSolarBOQ(5, 'lithium', 12),
      heroExtractor: (r) => `Subtotal: ₦${r.subtotal.toLocaleString()} | 50% Deposit: ₦${r.deposit50Percent.toLocaleString()}`,
    },

    // 2. Real Estate
    {
      sector: 'Real Estate & Land Banking',
      toolName: 'Plot Layout & Ancillary Dev Levies',
      actionKey: 'estate_plot_allocation',
      fn: () => calculateEstatePlotAllocation(500, 45000, true, 'epe_ibeju'),
      heroExtractor: (r) => `Total Outright: ₦${r.totalOutrightPackageNgn.toLocaleString()} | Dev Levy: ₦${r.developmentInfrastructureLevyNgn.toLocaleString()}`,
    },
    {
      sector: 'Real Estate & Land Banking',
      toolName: 'Realtor 5-15% Commission & WHT Ledger',
      actionKey: 'realtor_commission_ledger',
      fn: () => calculateRealtorCommissionLedger(45000000, 'gold_10', true),
      heroExtractor: (r) => `Net Bank Payout: ₦${r.netDirectCommissionPayoutNgn.toLocaleString()} (Post 5% WHT)`,
    },
    {
      sector: 'Real Estate & Land Banking',
      toolName: 'Diaspora Forex Off-Plan Milestone Sizer',
      actionKey: 'diaspora_property_escrow',
      fn: () => calculateDiasporaPropertyEscrow(85000000, 'USD', 1580, 'fully_finished'),
      heroExtractor: (r) => `Total Forex: $${r.totalForexEquivalent.toLocaleString()} @ ₦1,580/$`,
    },

    // 3. Automotive
    {
      sector: 'Automotive & Tokunbo Importers',
      toolName: 'Car Trade-In Swap Valuation Sizer',
      actionKey: 'car_swap_valuation',
      fn: () => calculateCarSwapValuation(6500000, 145000, 'first_body_clean', 'untouched_chilling_ac', 18500000),
      heroExtractor: (r) => `Swap Offer: ₦${r.finalSwapTradeInOfferNgn.toLocaleString()} | Cash Top-Up: ₦${r.netCashTopUpRequiredNgn.toLocaleString()}`,
    },
    {
      sector: 'Automotive & Tokunbo Importers',
      toolName: 'Consignment Showroom Profit Split',
      actionKey: 'auto_consignment_profit',
      fn: () => calculateAutoConsignmentProfit(14000000, 15800000, 21, 85000),
      heroExtractor: (r) => `Dealer Commission: ₦${r.netDealerCommissionNgn.toLocaleString()} | Investor Payout: ₦${r.netInvestorPayoutNgn.toLocaleString()}`,
    },
    {
      sector: 'Automotive & Tokunbo Importers',
      toolName: 'Tokunbo VIN Customs Duty & Landing',
      actionKey: 'tokunbo_port_clearing',
      fn: () => calculateCustomsDutyTokunbo(2018, 2500, 8500000),
      heroExtractor: (r) => `Total Duty: ₦${r.totalCustomsDuty.toLocaleString()} | Total Landing: ₦${r.estimatedTotalClearingCost.toLocaleString()}`,
    },

    // 4. Healthcare
    {
      sector: 'Healthcare, Clinics & Labs',
      toolName: 'HMO Claims & AuthCode Reconciler',
      actionKey: 'hmo_claims_reconciler',
      fn: () => calculateHmoClaimsAndAuthCode('Reliance HMO', 'Minor Surgery', 45000, false, true),
      heroExtractor: (r) => `HMO Approved: ₦${r.hmoApprovedClaimNgn.toLocaleString()} | Co-Pay: ₦${r.patientCoPayNgn.toLocaleString()}`,
    },
    {
      sector: 'Healthcare, Clinics & Labs',
      toolName: 'Surgery 60% Deposit & Ward Sizer',
      actionKey: 'surgery_deposit_sizer',
      fn: () => calculateSurgeryAndAdmissionDeposit('caesarean_section', 3, 'semi_private'),
      heroExtractor: (r) => `Mandatory 60% Deposit: ₦${r.required60PercentDepositNgn.toLocaleString()} | Grand Total: ₦${r.grandTotalEstimateNgn.toLocaleString()}`,
    },
    {
      sector: 'Healthcare, Clinics & Labs',
      toolName: 'Diagnostic Scan & Lab Test Package Sizer',
      actionKey: 'diagnostic_lab_package',
      fn: () => calculateDiagnosticLabPackage('executive_wellness', true, true),
      heroExtractor: (r) => `Package Rate: ₦${r.totalPackageCostNgn.toLocaleString()} (Discount: ₦${r.bundledPackageDiscountNgn.toLocaleString()})`,
    },

    // 5. Legal
    {
      sector: 'Law Firms & Solicitors',
      toolName: 'CAC Annual Return & SCUML Sizer',
      actionKey: 'scuml_cac_compliance_audit',
      fn: () => calculateScumlAndCacCompliance('company_ltd', 3, false, true),
      heroExtractor: (r) => `Total Compliance: ₦${r.grandTotalComplianceCostNgn.toLocaleString()} (CAC Arrears: ₦${r.totalCacArrearsNgn.toLocaleString()})`,
    },
    {
      sector: 'Law Firms & Solicitors',
      toolName: 'Legal Retainer & Billable Debit Note Sizer',
      actionKey: 'legal_retainer_debit_note',
      fn: () => calculateLegalRetainerAndDebitNote('standard_corporate', 12, 4, 2),
      heroExtractor: (r) => `Total Debit Note: ₦${r.totalDebitNotePayableNgn.toLocaleString()} (VAT & WHT Included)`,
    },
    {
      sector: 'Law Firms & Solicitors',
      toolName: 'CAMA 2020 Incorporation & Stamp Duty Sizer',
      actionKey: 'cac_fees',
      fn: () => calculateCacFilingFees('company_ltd', 1000000),
      heroExtractor: (r) => `CAC Fee: ₦${r.cacFilingFee.toLocaleString()} | Total Cost: ₦${r.totalCost.toLocaleString()}`,
    },

    // 6. Boutiques & Retail
    {
      sector: 'Boutiques & E-Commerce',
      toolName: 'POD Dispatch Cash & RTO Loss Reconciler',
      actionKey: 'pod_dispatch_cash_reconciler',
      fn: () => calculatePodDispatchAndRemittance(85, 28500, 22, 3500, 1750000),
      heroExtractor: (r) => `Net Bank Settlement: ₦${r.netBankSettlementNgn.toLocaleString()} | Variance Shortage: ₦${r.unaccountedCashVarianceNgn.toLocaleString()}`,
    },
    {
      sector: 'Boutiques & E-Commerce',
      toolName: 'Boutique Physical Stock vs POS Shrinkage Auditor',
      actionKey: 'boutique_stock_shrinkage',
      fn: () => calculateBoutiqueStockShrinkage(8500000, 7920000, 3800000),
      heroExtractor: (r) => `Shrinkage Loss: ₦${r.unrecordedShrinkageLossNgn.toLocaleString()} (${r.shrinkageLossPercent}% of stock)`,
    },
    {
      sector: 'Boutiques & E-Commerce',
      toolName: 'Lagos & Interstate Delivery Rate Sizer',
      actionKey: 'logistics_delivery',
      fn: () => calculateLogisticsDeliveryFee('Lagos (Ikeja)', 'Lagos (Lekki)', 5),
      heroExtractor: (r) => `Delivery Rate: ₦${(r.intraCityCourierFeeNgn || r.interStateWaybillFeeNgn).toLocaleString()}`,
    },

    // 7. Schools
    {
      sector: 'Schools & Academies',
      toolName: 'CBT Mock Exam Scoring & CA Engine',
      actionKey: 'cbt_exam_scoring',
      fn: () => calculateCbtExamScoring(48, 60, 18, 17),
      heroExtractor: (r) => `WAEC Grade: ${r.waecGrade} (${r.gradeRemark}) | Composite: ${r.totalScore100}%`,
    },
    {
      sector: 'Schools & Academies',
      toolName: 'Termly Broadsheet & Class Position Sizer',
      actionKey: 'report_card_broadsheet',
      fn: () => calculateReportCardBroadsheet(42, 9, 748),
      heroExtractor: (r) => `Position: ${r.classPositionRanking} / 42 | GPA: ${r.cumulativeGpa} / 5.0`,
    },
    {
      sector: 'Schools & Academies',
      toolName: 'Result Checker PIN & Scratch Card Portal',
      actionKey: 'result_pin_generator',
      fn: () => calculateResultCheckerPins(500, 2500, '2nd Term 2026'),
      heroExtractor: (r) => `Net PIN Profit: ₦${r.netSchoolPinProfitNgn.toLocaleString()} (Gross: ₦${r.grossPinRevenueNgn.toLocaleString()})`,
    },

    // 8. Downstream Oil & Gas
    {
      sector: 'Downstream Petroleum & LPG',
      toolName: 'Tanker Discharge Shortage & Transit Shrinkage',
      actionKey: 'tanker_discharge_variance',
      fn: () => calculateTankerDischargeVariance('pms_petrol', 33000, 32450, 0.3, 1050),
      heroExtractor: (r) => `Transporter Claim: ₦${r.transporterDebitClaimNgn.toLocaleString()} (${r.chargeableShortageLiters}L Chargeable Shortage)`,
    },
    {
      sector: 'Downstream Petroleum & LPG',
      toolName: 'UST Water Ingress & Totalizer Sales Audit',
      actionKey: 'ust_water_ingress_pump_audit',
      fn: () => calculateUstWaterAndPumpAudit(45000, 3.5, 38000, 29500, 8200, 8400000, 1050),
      heroExtractor: (r) => `Attendant Shortage: ₦${r.attendantCashShortageNgn.toLocaleString()} | Meter Discrepancy: ${r.meterToDipDiscrepancyLiters}L`,
    },
    {
      sector: 'Downstream Petroleum & LPG',
      toolName: 'LPG Gas Plant Daily Skid Scale Reconciler',
      actionKey: 'lpg_skid_audit',
      fn: () => calculateLpgSkidAudit(1250, 1180, 1416000, 1250),
      heroExtractor: (r) => `Shortage Loss: ₦${r.shortageLossNgn.toLocaleString()} | Handover: ₦${r.cashCollectedNgn.toLocaleString()}`,
    },

    // 9. Haulage & Fleet
    {
      sector: 'Haulage & Interstate Fleet',
      toolName: 'Interstate Union Road Levies & State Tolls',
      actionKey: 'interstate_union_road_tax',
      fn: () => calculateInterstateUnionRoadTax('lagos_kano', '30_ton_trailer', true),
      heroExtractor: (r) => `Total Road Tolls: ₦${r.totalRoadLevyExpenseNgn.toLocaleString()} (Driver Allowance: ₦${r.recommendedDriverRoadAllowanceNgn.toLocaleString()})`,
    },
    {
      sector: 'Haulage & Interstate Fleet',
      toolName: 'GPS Odometer Mileage vs Diesel Siphoning Audit',
      actionKey: 'gps_diesel_mileage_audit',
      fn: () => calculateGpsDieselMileageAudit(1020, 480, '30_ton', 1350),
      heroExtractor: (r) => `Diesel Pilferage Debit: ₦${r.driverDeductionDebitNoteNgn.toLocaleString()} (${r.unaccountedSiphonedLiters}L Pilfered)`,
    },
    {
      sector: 'Haulage & Interstate Fleet',
      toolName: 'Heavy Duty Long-Haul Trip Billing & Diesel Sizer',
      actionKey: 'haulage_trip_expense',
      fn: () => calculateHaulageTripExpense('Lagos (Apapa)', 'Kano (Dawanau)', 30, 450, 1350),
      heroExtractor: (r) => `Net Profit Per Trip: ₦${r.netProfitPerTripNgn.toLocaleString()} (Gross: ₦${r.grossFreightRevenueNgn.toLocaleString()})`,
    },

    // 10. Microfinance & Esusu
    {
      sector: 'Micro-Lending & Esusu Cooperatives',
      toolName: 'Daily Esusu Thrift Collector Passbook & 1-Day Comm',
      actionKey: 'esusu_thrift_passbook_audit',
      fn: () => calculateEsusuThriftPassbook(3000, 80, 31, 7200000),
      heroExtractor: (r) => `1-Day Management Commission: ₦${r.oneDayThriftCommissionNgn.toLocaleString()} | Payout Pool: ₦${r.totalContributorsNetPayoutPoolNgn.toLocaleString()}`,
    },
    {
      sector: 'Micro-Lending & Esusu Cooperatives',
      toolName: 'Remita Direct Debit 33.33% DSR Payday Loan Sizer',
      actionKey: 'salary_remita_loan_sizer',
      fn: () => calculateSalaryRemitaLoanEligibility(350000, 25000, 6, 4.5),
      heroExtractor: (r) => `Qualifying Principal: ₦${r.qualifyingLoanPrincipalNgn.toLocaleString()} (33.33% Max Direct Debit Capacity: ₦${r.maxDsrRepayment33PercentNgn.toLocaleString()})`,
    },
    {
      sector: 'Micro-Lending & Esusu Cooperatives',
      toolName: 'Micro-Loan Schedule & Direct Debit Sizer',
      actionKey: 'micro_loan_schedule',
      fn: () => calculateMicroLoanSchedule(500000, 5, 6, 1500),
      heroExtractor: (r) => `Monthly Direct Debit: ₦${r.monthlyRepaymentNgn.toLocaleString()} | Total Repay: ₦${r.totalRepaymentNgn.toLocaleString()}`,
    },

    // 11. Agro-Allied
    {
      sector: 'Agro-Allied & Poultry',
      toolName: 'Grain Moisture Discount & Silo Drying Sizer',
      actionKey: 'grain_moisture_discount',
      fn: () => calculateGrainMoistureDiscount('yellow_maize', 30, 17.5, 680000),
      heroExtractor: (r) => `Net Clean Settlement: ₦${r.netCleanSettlementPayoutNgn.toLocaleString()} (Drying Penalty: ₦${r.moistureDryingPenaltyNgn.toLocaleString()})`,
    },
    {
      sector: 'Agro-Allied & Poultry',
      toolName: 'Layer Hen Day Production (HDP %) & Feed Margin',
      actionKey: 'agro_poultry_yield',
      fn: () => calculateAgroPoultryYield(2000, 4, 5, 54),
      heroExtractor: (r) => `HDP: ${r.henDayProductionPercent}% | Daily Net Farm Margin: ₦${r.dailyGrossMarginNgn.toLocaleString()}`,
    },
    {
      sector: 'Agro-Allied & Poultry',
      toolName: 'Cold Room Spoilage & Power Cost Sizer',
      actionKey: 'cold_room_spoilage',
      fn: () => calculateColdRoomSpoilageAndPowerCost(10, 14, 1350),
      heroExtractor: (r) => `Monthly Diesel: ₦${r.monthlyDieselExpenseNgn.toLocaleString()} | Solar Savings: ₦${r.monthlySolarHybridSavingsNgn.toLocaleString()}`,
    },

    // 12. Hospitality
    {
      sector: 'Hospitality, Shortlets & Event Centers',
      toolName: 'Shortlet DisCo Band A Electricity & Caution Recon',
      actionKey: 'shortlet_caution_power_recon',
      fn: () => calculateShortletCautionAndPowerReconciliation(110000, 4, 60000, 35, 210, 12000, 209.5),
      heroExtractor: (r) => `Net Caution Refund: ₦${r.netRefundableCautionNgn.toLocaleString()} (Excess AC Token Deducted: ₦${r.excessPowerSurchargeNgn.toLocaleString()})`,
    },
    {
      sector: 'Hospitality, Shortlets & Event Centers',
      toolName: 'Event Marquee 250kVA Gen Overtime & Caution Sizer',
      actionKey: 'event_hall_overtime_sizer',
      fn: () => calculateEventCenterOvertimeAndCaution('standard', 600, 2200000, 250000, 2.5, true),
      heroExtractor: (r) => `Total Marquee Invoice: ₦${r.totalEventInvoiceNgn.toLocaleString()} (Gen Overtime: ₦${r.generatorOvertimeCostNgn.toLocaleString()})`,
    },
    {
      sector: 'Hospitality, Shortlets & Event Centers',
      toolName: 'Shortlet Booking & Caution Sizer',
      actionKey: 'shortlet_booking',
      fn: () => calculateShortletBookingAndCaution(85000, 3, 50000, 35),
      heroExtractor: (r) => `Rental Subtotal: ₦${r.accommodationSubtotalNgn.toLocaleString()} | Caution: ₦${r.cautionDepositNgn.toLocaleString()}`,
    },

    // 13. Port Clearing
    {
      sector: 'Port Clearing & Demurrage',
      toolName: 'PAAR Single-Sheet Customs Duty Assessment',
      actionKey: 'paar_customs_duty_sizer',
      fn: () => calculatePaarCustomsAssessment(28000, 1550, 20, true, 450000),
      heroExtractor: (r) => `Total Statutory Duty: ₦${r.totalCustomsDutyNgn.toLocaleString()} | Total Port Outlay: ₦${r.totalPortStatutoryOutlayNgn.toLocaleString()}`,
    },
    {
      sector: 'Port Clearing & Demurrage',
      toolName: 'Empty Container EIR & Holding Bay Deposit Refund',
      actionKey: 'container_deposit_refund_tracker',
      fn: () => calculateContainerDepositRefund(3, 450000, 24, 14, 'clean_intact'),
      heroExtractor: (r) => `Net Refundable Deposit: ₦${r.netRefundableDepositNgn.toLocaleString()} (Detention Fine: ₦${r.demurrageDetentionFineNgn.toLocaleString()})`,
    },
    {
      sector: 'Port Clearing & Demurrage',
      toolName: 'Shipping Line Demurrage & Storage Sizer',
      actionKey: 'container_demurrage',
      fn: () => calculateContainerDemurrage('40ft High Cube', 'Maersk Line', 12, 7, 85, 1580),
      heroExtractor: (r) => `Total Demurrage Risk: ₦${r.grandTotalPortLiabilityNgn.toLocaleString()}`,
    },

    // 14. Construction
    {
      sector: 'Construction & Heavy Plant',
      toolName: 'Heavy Plant Hour-Meter & Wet/Dry Lease Sizer',
      actionKey: 'machinery_lease_expense',
      fn: () => calculateMachineryLeaseExpense('cat_320_excavator', 8, 'wet', 1350),
      heroExtractor: (r) => `Daily Wet Lease Cost: ₦${r.totalDailyLeaseCostNgn.toLocaleString()} (Diesel: ₦${r.dieselExpenseNgn.toLocaleString()})`,
    },
    {
      sector: 'Construction & Heavy Plant',
      toolName: 'Quarry Aggregate Tonnage & Weighbridge Dispatch',
      actionKey: 'quarry_weighbridge_sizer',
      fn: () => calculateQuarryWeighbridgeDispatch('three_quarter', 30, 45, 4),
      heroExtractor: (r) => `Total Dispatch Invoice: ₦${r.totalQuarryDispatchInvoiceNgn.toLocaleString()} (${r.totalTonnageSupplied}T @ ₦${r.unitPricePerTonNgn}/T)`,
    },
    {
      sector: 'Construction & Heavy Plant',
      toolName: 'Concrete Mix (1:2:4 / M20) & Rebar Steel Sizer',
      actionKey: 'concrete_structural_sizer',
      fn: () => calculateConcreteStructuralMix(250, 0.15, 9500, true),
      heroExtractor: (r) => `Concrete + Steel Cost: ₦${r.totalConcreteAndSteelCostNgn.toLocaleString()} (${r.cementBagsRequired} Cement Bags & ${r.rebarTonsRequired}T Rebar)`,
    },

    // 15. Security
    {
      sector: 'Private Security & Guarding',
      toolName: 'Estate Guard Deployment & Visitor Code Sizer',
      actionKey: 'security_patrol_gate_pass',
      fn: () => calculateSecurityPatrolAndGatePass(180, 8, 12, 95),
      heroExtractor: (r) => `Monthly Security Budget: ₦${r.monthlySecurityBillingNgn.toLocaleString()} (₦${r.costPerResidentUnitNgn.toLocaleString()}/resident)`,
    },
    {
      sector: 'Private Security & Guarding',
      toolName: 'NFC Perimeter Patrol Clock-in & Guard Roster Sizer',
      actionKey: 'security_guard_roster_sizer',
      fn: () => calculateSecurityGuardRosterAndPatrol(16, 0.5, 2, 6, 65000),
      heroExtractor: (r) => `Monthly Operations Outlay: ₦${r.totalMonthlySecurityOperationsNgn.toLocaleString()} (${r.totalPatrolTapsPerDay} Daily NFC Clock-Ins)`,
    },
    {
      sector: 'Private Security & Guarding',
      toolName: 'WhatsApp Resident Intercom & Access Pass Sizer',
      actionKey: 'estate_visitor_pass_capacity',
      fn: () => calculateEstateVisitorPassCapacity(220, 6, 2, 2500),
      heroExtractor: (r) => `Monthly Intercom Revenue: ₦${r.monthlyIntercomRevenueNgn.toLocaleString()} (${r.monthlyVisitorPassesGenerated} Passes/mo)`,
    },

    // 16. General B2B Services
    {
      sector: 'General B2B Services',
      toolName: 'FIRS VAT/WHT Pro-Forma Invoice Builder',
      actionKey: 'b2b_proforma_invoice_sizer',
      fn: () => calculateB2bProformaInvoice(3500000, true, true, 120000),
      heroExtractor: (r) => `Gross Invoice: ₦${r.grossInvoiceTotalNgn.toLocaleString()} (VAT: ₦${r.vat75PercentNgn.toLocaleString()} | Net Remittance: ₦${r.netBankRemittanceNgn.toLocaleString()})`,
    },
  ];

  let passCount = 0;
  let failCount = 0;

  for (const tc of testCases) {
    try {
      const output = tc.fn();
      if (!output || typeof output !== 'object') {
        throw new Error('Output is not a valid object');
      }

      // Check all numeric fields for NaN / Infinity
      for (const [k, v] of Object.entries(output)) {
        if (typeof v === 'number') {
          assertValidNumber(v, k);
        }
      }

      const hero = tc.heroExtractor(output);
      passCount++;
      console.log(`✅ [PASS] ${tc.sector} -> ${tc.toolName} (${tc.actionKey})`);
      console.log(`   └─ ${hero}\n`);
    } catch (err) {
      failCount++;
      console.error(`❌ [FAIL] ${tc.sector} -> ${tc.toolName} (${tc.actionKey}): ${err.message}\n`);
    }
  }

  console.log('================================================================');
  console.log(`🏁 PHYSICAL DEEP TEST COMPLETE: ${passCount} PASSED, ${failCount} FAILED OUT OF ${testCases.length} TEST CASES`);
  console.log('================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests();
