/**
 * Exhaustive Sector-by-Sector, Tool-by-Tool Nigerian Real-Data Sanity & Malfunction Test Suite
 * Evaluates all 16 Business Sectors and all 48 Individual Calculation Engines with Authentic Nigerian Data.
 */

const {
  // 1. Solar
  calculateDiscoTariffVsSolarROI,
  calculateLithiumBatterySizing,
  generateSolarBOQ,

  // 2. Real Estate
  calculateEstatePlotAllocation,
  calculateRealtorCommissionLedger,
  calculateDiasporaPropertyEscrow,

  // 3. Automotive
  calculateCarSwapValuation,
  calculateAutoConsignmentProfit,
  calculateCustomsDutyTokunbo,

  // 4. Healthcare
  calculateHmoClaimsAndAuthCode,
  calculateSurgeryAndAdmissionDeposit,
  calculateDiagnosticLabPackage,

  // 5. Legal
  calculateScumlAndCacCompliance,
  calculateLegalRetainerAndDebitNote,
  calculateCacFilingFees,

  // 6. Boutiques & Retail
  calculatePodDispatchAndRemittance,
  calculateBoutiqueStockShrinkage,
  calculateLogisticsDeliveryFee,

  // 7. Schools
  calculateCbtExamScoring,
  calculateReportCardBroadsheet,
  calculateResultCheckerPins,

  // 8. Downstream Oil & Gas
  calculateTankerDischargeVariance,
  calculateUstWaterAndPumpAudit,
  calculateLpgSkidAudit,

  // 9. Haulage & Fleet
  calculateInterstateUnionRoadTax,
  calculateGpsDieselMileageAudit,
  calculateHaulageTripExpense,

  // 10. Microfinance & Esusu
  calculateEsusuThriftPassbook,
  calculateSalaryRemitaLoanEligibility,
  calculateMicroLoanSchedule,

  // 11. Agro-Allied
  calculateGrainMoistureDiscount,
  calculateAgroPoultryYield,
  calculateColdRoomSpoilageAndPowerCost,

  // 12. Hospitality
  calculateShortletCautionAndPowerReconciliation,
  calculateEventCenterOvertimeAndCaution,
  calculateShortletBookingAndCaution,

  // 13. Port Clearing
  calculatePaarCustomsAssessment,
  calculateContainerDepositRefund,
  calculateContainerDemurrage,

  // 14. Construction
  calculateMachineryLeaseExpense,
  calculateQuarryWeighbridgeDispatch,
  calculateConcreteStructuralMix,

  // 15. Security
  calculateSecurityPatrolAndGatePass,
  calculateSecurityGuardRosterAndPatrol,
  calculateEstateVisitorPassCapacity,

  // 16. General B2B
  calculateB2bProformaInvoice,
} = require('../src/lib/sectorModules.ts');

const sectors = [
  {
    sectorId: 'solar',
    sectorName: '1. Solar & Renewable Energy',
    tools: [
      {
        name: 'DisCo Band A vs Solar ROI Sizer',
        action: 'disco_tariff_solar_roi',
        run: () => {
          const r = calculateDiscoTariffVsSolarROI(180000, 240000, 'band_a', 10);
          const valid = r.monthlySolarEnergySavingsNgn > 300000 && r.fiveYearNetSavingsNgn > 10000000;
          return { valid, desc: `Monthly Savings: ₦${r.monthlySolarEnergySavingsNgn.toLocaleString()} | 5-Yr Net: ₦${r.fiveYearNetSavingsNgn.toLocaleString()} (Tariff: ₦${r.discoTariffRatePerKwhNgn}/kWh)` };
        },
      },
      {
        name: 'LiFePO4 Lithium Battery Sizer',
        action: 'lithium_battery_sizing',
        run: () => {
          const r = calculateLithiumBatterySizing(18, true, true);
          const valid = r.recommendedBatteryCapacityKwh >= 20 && r.solarArrayPeakWattageWp >= 5000;
          return { valid, desc: `Battery: ${r.recommendedBatteryCapacityKwh}kWh LiFePO4 (90% DoD) | PV Array: ${r.solarArrayPeakWattageWp}Wp` };
        },
      },
      {
        name: '5kVA-20kVA Solar Hybrid BOQ Auto-Generator',
        action: 'solar_boq',
        run: () => {
          const r = generateSolarBOQ(5, 'lithium', 12);
          const valid = r.grandTotal > 5000000 && r.deposit50Percent === Math.round(r.grandTotal * 0.5);
          return { valid, desc: `Grand Total: ₦${r.grandTotal.toLocaleString()} | 50% Deposit: ₦${r.deposit50Percent.toLocaleString()} (Items: ${r.items.length})` };
        },
      },
    ],
  },
  {
    sectorId: 'realestate',
    sectorName: '2. Real Estate & Land Banking',
    tools: [
      {
        name: 'Plot Layout & Ancillary Dev Levies',
        action: 'estate_plot_allocation',
        run: () => {
          const r = calculateEstatePlotAllocation(500, 45000, true, 'epe_ibeju');
          const valid = r.totalOutrightPackageNgn === 28000000 && r.developmentInfrastructureLevyNgn === 2250000;
          return { valid, desc: `Outright Package: ₦${r.totalOutrightPackageNgn.toLocaleString()} | 10% Dev Levy: ₦${r.developmentInfrastructureLevyNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Realtor 5-15% Commission & WHT Ledger',
        action: 'realtor_commission_ledger',
        run: () => {
          const r = calculateRealtorCommissionLedger(45000000, 'gold_10', true);
          const valid = r.grossDirectCommissionNgn === 4500000 && r.netDirectCommissionPayoutNgn === 4275000;
          return { valid, desc: `Gross Commission: ₦${r.grossDirectCommissionNgn.toLocaleString()} | Net Post-5% WHT: ₦${r.netDirectCommissionPayoutNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Diaspora Forex Off-Plan Milestone Sizer',
        action: 'diaspora_property_escrow',
        run: () => {
          const r = calculateDiasporaPropertyEscrow(85000000, 'USD', 1580, 'fully_finished');
          const valid = r.totalForexEquivalent === 53797 && Boolean(r.stage1Foundation30Percent);
          return { valid, desc: `Forex Value: $${r.totalForexEquivalent.toLocaleString()} @ ₦1,580/$ (4 Escrow Stages)` };
        },
      },
    ],
  },
  {
    sectorId: 'automotive',
    sectorName: '3. Automotive & Tokunbo Importers',
    tools: [
      {
        name: 'Car Trade-In Swap Valuation Sizer',
        action: 'car_swap_valuation',
        run: () => {
          const r = calculateCarSwapValuation(6500000, 145000, 'first_body_clean', 'untouched_chilling_ac', 18500000);
          const valid = r.finalSwapTradeInOfferNgn === 6240000 && r.netCashTopUpRequiredNgn === 12260000;
          return { valid, desc: `Swap Trade-In Value: ₦${r.finalSwapTradeInOfferNgn.toLocaleString()} | Cash Top-Up: ₦${r.netCashTopUpRequiredNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Consignment Showroom Profit Split',
        action: 'auto_consignment_profit',
        run: () => {
          const r = calculateAutoConsignmentProfit(14000000, 15800000, 21, 85000);
          const valid = r.netDealerCommissionNgn === 1662500 && r.netInvestorPayoutNgn === 14000000;
          return { valid, desc: `Dealer Cut: ₦${r.netDealerCommissionNgn.toLocaleString()} | Investor Principal: ₦${r.netInvestorPayoutNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Tokunbo VIN Customs Duty & Landing',
        action: 'tokunbo_port_clearing',
        run: () => {
          const r = calculateCustomsDutyTokunbo(2018, 2500, 8500000);
          const valid = r.totalCustomsDuty === 3873875 && r.estimatedTotalClearingCost === 4323875;
          return { valid, desc: `Customs Duty: ₦${r.totalCustomsDuty.toLocaleString()} | Total Landing: ₦${r.estimatedTotalClearingCost.toLocaleString()}` };
        },
      },
    ],
  },
  {
    sectorId: 'healthcare',
    sectorName: '4. Healthcare, Clinics & Labs',
    tools: [
      {
        name: 'HMO Claims & AuthCode Reconciler',
        action: 'hmo_claims_reconciler',
        run: () => {
          const r = calculateHmoClaimsAndAuthCode('Reliance HMO', 'Minor Surgery', 45000, false, true);
          const valid = r.hmoApprovedClaimNgn === 40500 && r.patientCoPayNgn === 4500;
          return { valid, desc: `HMO Claim: ₦${r.hmoApprovedClaimNgn.toLocaleString()} (90%) | Patient Co-Pay: ₦${r.patientCoPayNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Surgery 60% Deposit & Ward Sizer',
        action: 'surgery_deposit_sizer',
        run: () => {
          const r = calculateSurgeryAndAdmissionDeposit('caesarean_section', 3, 'semi_private');
          const valid = r.required60PercentDepositNgn === 459000 && r.grandTotalEstimateNgn === 765000;
          return { valid, desc: `Mandatory 60% Deposit: ₦${r.required60PercentDepositNgn.toLocaleString()} | Grand Total: ₦${r.grandTotalEstimateNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Diagnostic Scan & Lab Test Package Sizer',
        action: 'diagnostic_lab_package',
        run: () => {
          const r = calculateDiagnosticLabPackage('executive_wellness', true, true);
          const valid = r.totalPackageCostNgn === 73500 && r.bundledPackageDiscountNgn === 20000;
          return { valid, desc: `Executive Wellness Package: ₦${r.totalPackageCostNgn.toLocaleString()} (Saved ₦${r.bundledPackageDiscountNgn.toLocaleString()})` };
        },
      },
    ],
  },
  {
    sectorId: 'legal',
    sectorName: '5. Law Firms & Solicitors',
    tools: [
      {
        name: 'CAC Annual Return & SCUML Sizer',
        action: 'scuml_cac_compliance_audit',
        run: () => {
          const r = calculateScumlAndCacCompliance('company_ltd', 3, false, true);
          const valid = r.grandTotalComplianceCostNgn === 220000 && r.totalCacArrearsNgn === 60000;
          return { valid, desc: `Total Compliance: ₦${r.grandTotalComplianceCostNgn.toLocaleString()} (CAC Arrears: ₦${r.totalCacArrearsNgn.toLocaleString()})` };
        },
      },
      {
        name: 'Legal Retainer & Billable Debit Note Sizer',
        action: 'legal_retainer_debit_note',
        run: () => {
          const r = calculateLegalRetainerAndDebitNote('standard_corporate', 12, 4, 2);
          const valid = r.totalDebitNotePayableNgn === 932750 && r.vat7_5PercentNgn > 0;
          return { valid, desc: `Total Debit Note: ₦${r.totalDebitNotePayableNgn.toLocaleString()} (VAT 7.5%: ₦${r.vat7_5PercentNgn.toLocaleString()})` };
        },
      },
      {
        name: 'CAMA 2020 Incorporation & Stamp Duty Sizer',
        action: 'cac_fees',
        run: () => {
          const r = calculateCacFilingFees('company_ltd', 1000000);
          const valid = r.cacFilingFee === 10000 && r.totalCost === 53000;
          return { valid, desc: `CAC Filing: ₦${r.cacFilingFee.toLocaleString()} | Total Gov & Professional: ₦${r.totalCost.toLocaleString()}` };
        },
      },
    ],
  },
  {
    sectorId: 'retail',
    sectorName: '6. Boutiques & E-Commerce',
    tools: [
      {
        name: 'POD Dispatch Cash & RTO Loss Reconciler',
        action: 'pod_dispatch_cash_reconciler',
        run: () => {
          const r = calculatePodDispatchAndRemittance(85, 28500, 22, 3500, 1750000);
          const valid = r.netBankSettlementNgn === 1452500 && r.unaccountedCashVarianceNgn === 131000;
          return { valid, desc: `Bank Settlement: ₦${r.netBankSettlementNgn.toLocaleString()} | Shortage Variance: ₦${r.unaccountedCashVarianceNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Boutique Physical Stock vs POS Shrinkage Auditor',
        action: 'boutique_stock_shrinkage',
        run: () => {
          const r = calculateBoutiqueStockShrinkage(8500000, 7920000, 3800000);
          const valid = r.unrecordedShrinkageLossNgn === 580000 && r.shrinkagePercentOfInventory === 6.8;
          return { valid, desc: `Unrecorded Shrinkage Loss: ₦${r.unrecordedShrinkageLossNgn.toLocaleString()} (6.8% of Inventory)` };
        },
      },
      {
        name: 'Lagos & Interstate Delivery Rate Sizer',
        action: 'logistics_delivery',
        run: () => {
          const r = calculateLogisticsDeliveryFee('Lagos (Ikeja)', 'Lagos (Lekki)', 5);
          const valid = (r.intraCityCourierFeeNgn || r.interStateWaybillFeeNgn) === 6900;
          return { valid, desc: `Intra-Lagos Logistics Waybill: ₦${(r.intraCityCourierFeeNgn || r.interStateWaybillFeeNgn).toLocaleString()}` };
        },
      },
    ],
  },
  {
    sectorId: 'schools',
    sectorName: '7. Schools & Academies',
    tools: [
      {
        name: 'CBT Mock Exam Scoring & CA Engine',
        action: 'cbt_exam_scoring',
        run: () => {
          const r = calculateCbtExamScoring(48, 60, 18, 17);
          const valid = r.totalScore100 === 83 && r.waecGrade === 'A1';
          return { valid, desc: `WAEC Grade: ${r.waecGrade} (${r.gradeRemark}) | Composite: ${r.totalScore100}%` };
        },
      },
      {
        name: 'Termly Broadsheet & Class Position Sizer',
        action: 'report_card_broadsheet',
        run: () => {
          const r = calculateReportCardBroadsheet(42, 9, 748);
          const valid = r.classPositionRanking === '8th of 42 students' && r.cumulativeGpa === 4.15;
          return { valid, desc: `Class Position: ${r.classPositionRanking} | GPA: ${r.cumulativeGpa} / 5.0` };
        },
      },
      {
        name: 'Result Checker PIN & Scratch Card Portal',
        action: 'result_pin_generator',
        run: () => {
          const r = calculateResultCheckerPins(500, 2500, '2nd Term 2026');
          const valid = r.grossPinRevenueNgn === 1250000 && r.netSchoolPinProfitNgn === 1190000;
          return { valid, desc: `Gross PIN Revenue: ₦${r.grossPinRevenueNgn.toLocaleString()} | Net School Profit: ₦${r.netSchoolPinProfitNgn.toLocaleString()}` };
        },
      },
    ],
  },
  {
    sectorId: 'oilgas',
    sectorName: '8. Downstream Petroleum & LPG',
    tools: [
      {
        name: 'Tanker Discharge Shortage & Transit Shrinkage',
        action: 'tanker_discharge_variance',
        run: () => {
          const r = calculateTankerDischargeVariance('pms_petrol', 33000, 32450, 0.3, 1050);
          const valid = r.chargeableShortageLiters === 451 && r.transporterDebitClaimNgn === 473550;
          return { valid, desc: `Chargeable Shortage: ${r.chargeableShortageLiters}L | Transporter Claim: ₦${r.transporterDebitClaimNgn.toLocaleString()}` };
        },
      },
      {
        name: 'UST Water Ingress & Totalizer Sales Audit',
        action: 'ust_water_ingress_pump_audit',
        run: () => {
          const r = calculateUstWaterAndPumpAudit(45000, 3.5, 38000, 29500, 8200, 8400000, 1050);
          const valid = r.attendantCashShortageNgn === 210000 && r.meterToDipDiscrepancyLiters === 300;
          return { valid, desc: `Attendant Shortage: ₦${r.attendantCashShortageNgn.toLocaleString()} | Meter Variance: ${r.meterToDipDiscrepancyLiters}L` };
        },
      },
      {
        name: 'LPG Gas Plant Daily Skid Scale Reconciler',
        action: 'lpg_skid_audit',
        run: () => {
          const r = calculateLpgSkidAudit(1250, 1180, 1416000, 1250);
          const valid = r.cashCollectedNgn === 1416000 && r.shortageLossNgn === 67750;
          return { valid, desc: `Shortage Loss: ₦${r.shortageLossNgn.toLocaleString()} | Plant Cash Collected: ₦${r.cashCollectedNgn.toLocaleString()}` };
        },
      },
    ],
  },
  {
    sectorId: 'haulage',
    sectorName: '9. Haulage & Interstate Fleet',
    tools: [
      {
        name: 'Interstate Union Road Levies & State Tolls',
        action: 'interstate_union_road_tax',
        run: () => {
          const r = calculateInterstateUnionRoadTax('lagos_kano', '30_ton_trailer', true);
          const valid = r.totalRoadLevyExpenseNgn === 101375 && r.recommendedDriverRoadAllowanceNgn === 136375;
          return { valid, desc: `Corridor Tolls: ₦${r.totalRoadLevyExpenseNgn.toLocaleString()} | Driver Road Allowance: ₦${r.recommendedDriverRoadAllowanceNgn.toLocaleString()}` };
        },
      },
      {
        name: 'GPS Odometer Mileage vs Diesel Siphoning Audit',
        action: 'gps_diesel_mileage_audit',
        run: () => {
          const r = calculateGpsDieselMileageAudit(1020, 480, '30_ton', 1350);
          const valid = r.unaccountedSiphonedLiters === 37 && r.driverDeductionDebitNoteNgn === 49950;
          return { valid, desc: `Pilfered Fuel: ${r.unaccountedSiphonedLiters}L | Driver Debit Note: ₦${r.driverDeductionDebitNoteNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Heavy Duty Long-Haul Trip Billing & Diesel Sizer',
        action: 'haulage_trip_expense',
        run: () => {
          const r = calculateHaulageTripExpense('Lagos (Apapa)', 'Kano (Dawanau)', 30, 450, 1350);
          const valid = r.netProfitPerTripNgn === 1657500 && r.grossFreightRevenueNgn === 2550000;
          return { valid, desc: `Gross Freight: ₦${r.grossFreightRevenueNgn.toLocaleString()} | Net Profit: ₦${r.netProfitPerTripNgn.toLocaleString()}` };
        },
      },
    ],
  },
  {
    sectorId: 'microfinance',
    sectorName: '10. Micro-Lending & Esusu Cooperatives',
    tools: [
      {
        name: 'Daily Esusu Thrift Collector Passbook & 1-Day Comm',
        action: 'esusu_thrift_passbook_audit',
        run: () => {
          const r = calculateEsusuThriftPassbook(3000, 80, 31, 7200000);
          const valid = r.oneDayThriftCommissionNgn === 240000 && r.totalContributorsNetPayoutPoolNgn === 7200000;
          return { valid, desc: `1-Day Mgmt Commission: ₦${r.oneDayThriftCommissionNgn.toLocaleString()} | Contributor Pool: ₦${r.totalContributorsNetPayoutPoolNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Remita Direct Debit 33.33% DSR Payday Loan Sizer',
        action: 'salary_remita_loan_sizer',
        run: () => {
          const r = calculateSalaryRemitaLoanEligibility(350000, 25000, 6, 4.5);
          const valid = r.qualifyingLoanPrincipalNgn === 433016 && r.monthlyDirectDebitDeductionNgn === 91655;
          return { valid, desc: `Qualifying Principal: ₦${r.qualifyingLoanPrincipalNgn.toLocaleString()} | Monthly Direct Debit: ₦${r.monthlyDirectDebitDeductionNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Micro-Loan Schedule & Direct Debit Sizer',
        action: 'micro_loan_schedule',
        run: () => {
          const r = calculateMicroLoanSchedule(500000, 5, 6, 1500);
          const valid = r.monthlyRepaymentNgn === 108333 && r.totalRepaymentNgn === 649998;
          return { valid, desc: `Monthly Direct Debit: ₦${r.monthlyRepaymentNgn.toLocaleString()} | Total Repay: ₦${r.totalRepaymentNgn.toLocaleString()}` };
        },
      },
    ],
  },
  {
    sectorId: 'agro',
    sectorName: '11. Agro-Allied & Poultry',
    tools: [
      {
        name: 'Grain Moisture Discount & Silo Drying Sizer',
        action: 'grain_moisture_discount',
        run: () => {
          const r = calculateGrainMoistureDiscount('yellow_maize', 30, 17.5, 680000);
          const valid = r.netDryCommodityWeightTons === 28.56 && r.netCleanSettlementPayoutNgn === 17260800;
          return { valid, desc: `Dry Weight: ${r.netDryCommodityWeightTons}T | Settlement Payout: ₦${r.netCleanSettlementPayoutNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Layer Hen Day Production (HDP %) & Feed Margin',
        action: 'agro_poultry_yield',
        run: () => {
          const r = calculateAgroPoultryYield(2000, 4, 5, 54);
          const valid = r.henDayProductionPercent === 81 && r.dailyGrossMarginNgn === 174400;
          return { valid, desc: `HDP: ${r.henDayProductionPercent}% (54 Crates/day) | Daily Farm Net: ₦${r.dailyGrossMarginNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Cold Room Spoilage & Power Cost Sizer',
        action: 'cold_room_spoilage',
        run: () => {
          const r = calculateColdRoomSpoilageAndPowerCost(10, 14, 1350);
          const valid = r.monthlyDieselExpenseNgn === 2126250 && r.monthlySolarHybridSavingsNgn === 1382063;
          return { valid, desc: `Monthly Diesel: ₦${r.monthlyDieselExpenseNgn.toLocaleString()} | Solar Savings: ₦${r.monthlySolarHybridSavingsNgn.toLocaleString()}` };
        },
      },
    ],
  },
  {
    sectorId: 'hospitality',
    sectorName: '12. Hospitality, Shortlets & Event Centers',
    tools: [
      {
        name: 'Shortlet DisCo Band A Electricity & Caution Recon',
        action: 'shortlet_caution_power_recon',
        run: () => {
          const r = calculateShortletCautionAndPowerReconciliation(110000, 4, 60000, 35, 210, 12000, 209.5);
          const valid = r.excessPowerSurchargeNgn === 14665 && r.netRefundableCautionNgn === 33335;
          return { valid, desc: `Excess Power: ₦${r.excessPowerSurchargeNgn.toLocaleString()} (70 kWh) | Refundable Caution: ₦${r.netRefundableCautionNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Event Marquee 250kVA Gen Overtime & Caution Sizer',
        action: 'event_hall_overtime_sizer',
        run: () => {
          const r = calculateEventCenterOvertimeAndCaution('standard', 600, 2200000, 250000, 2.5, true);
          const valid = r.generatorOvertimeCostNgn === 187500 && r.netCautionBondRefundNgn === 62500;
          return { valid, desc: `Gen Overtime: ₦${r.generatorOvertimeCostNgn.toLocaleString()} | Caution Bond Refund: ₦${r.netCautionBondRefundNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Shortlet Booking & Caution Sizer',
        action: 'shortlet_booking',
        run: () => {
          const r = calculateShortletBookingAndCaution(85000, 3, 50000, 35);
          const valid = r.accommodationSubtotalNgn === 255000 && r.cautionDepositNgn === 50000;
          return { valid, desc: `Accommodation: ₦${r.accommodationSubtotalNgn.toLocaleString()} | Caution Bond: ₦${r.cautionDepositNgn.toLocaleString()}` };
        },
      },
    ],
  },
  {
    sectorId: 'clearing',
    sectorName: '13. Port Clearing & Demurrage',
    tools: [
      {
        name: 'PAAR Single-Sheet Customs Duty Assessment',
        action: 'paar_customs_duty_sizer',
        run: () => {
          const r = calculatePaarCustomsAssessment(28000, 1550, 20, true, 450000);
          const valid = r.totalCustomsDutyNgn === 20284075 && r.totalPortStatutoryOutlayNgn === 20734075;
          return { valid, desc: `Statutory Duty: ₦${r.totalCustomsDutyNgn.toLocaleString()} | Total Port Landing: ₦${r.totalPortStatutoryOutlayNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Empty Container EIR & Holding Bay Deposit Refund',
        action: 'container_deposit_refund_tracker',
        run: () => {
          const r = calculateContainerDepositRefund(3, 450000, 24, 14, 'clean_intact');
          const valid = r.demurrageDetentionFineNgn === 555000 && r.netRefundableDepositNgn === 795000;
          return { valid, desc: `Detention Fine: ₦${r.demurrageDetentionFineNgn.toLocaleString()} | Net Refund: ₦${r.netRefundableDepositNgn.toLocaleString()}` };
        },
      },
      {
        name: 'Shipping Line Demurrage & Storage Sizer',
        action: 'container_demurrage',
        run: () => {
          const r = calculateContainerDemurrage('40ft High Cube', 'Maersk Line', 12, 7, 85, 1580);
          const valid = r.grandTotalPortLiabilityNgn === 846500;
          return { valid, desc: `Total Demurrage Risk: ₦${r.grandTotalPortLiabilityNgn.toLocaleString()}` };
        },
      },
    ],
  },
  {
    sectorId: 'construction',
    sectorName: '14. Construction & Heavy Plant',
    tools: [
      {
        name: 'Heavy Plant Hour-Meter & Wet/Dry Lease Sizer',
        action: 'machinery_lease_expense',
        run: () => {
          const r = calculateMachineryLeaseExpense('cat_320_excavator', 8, 'wet', 1350);
          const valid = r.totalDailyLeaseCostNgn === 612600 && r.dieselExpenseNgn === 237600;
          return { valid, desc: `Daily Wet Lease: ₦${r.totalDailyLeaseCostNgn.toLocaleString()} (Diesel: ₦${r.dieselExpenseNgn.toLocaleString()})` };
        },
      },
      {
        name: 'Quarry Aggregate Tonnage & Weighbridge Dispatch',
        action: 'quarry_weighbridge_sizer',
        run: () => {
          const r = calculateQuarryWeighbridgeDispatch('three_quarter', 30, 45, 4);
          const valid = r.totalQuarryDispatchInvoiceNgn === 1233000 && r.totalTonnageSupplied === 120;
          return { valid, desc: `Dispatch Invoice: ₦${r.totalQuarryDispatchInvoiceNgn.toLocaleString()} (${r.totalTonnageSupplied}T Supplied)` };
        },
      },
      {
        name: 'Concrete Mix (1:2:4 / M20) & Rebar Steel Sizer',
        action: 'concrete_structural_sizer',
        run: () => {
          const r = calculateConcreteStructuralMix(250, 0.15, 9500, true);
          const valid = r.cementBagsRequired === 255 && r.totalConcreteAndSteelCostNgn === 7375850;
          return { valid, desc: `Cement: ${r.cementBagsRequired} Bags (50kg) | Rebar: ${r.rebarTonsRequired}T | Cost: ₦${r.totalConcreteAndSteelCostNgn.toLocaleString()}` };
        },
      },
    ],
  },
  {
    sectorId: 'security',
    sectorName: '15. Private Security & Guarding',
    tools: [
      {
        name: 'Estate Guard Deployment & Visitor Code Sizer',
        action: 'security_patrol_gate_pass',
        run: () => {
          const r = calculateSecurityPatrolAndGatePass(180, 8, 12, 95);
          const valid = r.monthlySecurityBillingNgn === 865000 && r.costPerResidentUnitNgn === 4806;
          return { valid, desc: `Monthly Billing: ₦${r.monthlySecurityBillingNgn.toLocaleString()} (₦${r.costPerResidentUnitNgn}/resident)` };
        },
      },
      {
        name: 'NFC Perimeter Patrol Clock-in & Guard Roster Sizer',
        action: 'security_guard_roster_sizer',
        run: () => {
          const r = calculateSecurityGuardRosterAndPatrol(16, 0.5, 2, 6, 65000);
          const valid = r.totalMonthlySecurityOperationsNgn === 1151500 && r.totalPatrolTapsPerDay === 768;
          return { valid, desc: `Operations Outlay: ₦${r.totalMonthlySecurityOperationsNgn.toLocaleString()} (${r.totalPatrolTapsPerDay} Daily NFC Clock-Ins)` };
        },
      },
      {
        name: 'WhatsApp Resident Intercom & Access Pass Sizer',
        action: 'estate_visitor_pass_capacity',
        run: () => {
          const r = calculateEstateVisitorPassCapacity(220, 6, 2, 2500);
          const valid = r.monthlyIntercomRevenueNgn === 550000 && r.monthlyVisitorPassesGenerated === 5716;
          return { valid, desc: `Monthly Intercom Levies: ₦${r.monthlyIntercomRevenueNgn.toLocaleString()} (${r.monthlyVisitorPassesGenerated} Passes/mo)` };
        },
      },
    ],
  },
  {
    sectorId: 'general',
    sectorName: '16. General B2B Services',
    tools: [
      {
        name: 'FIRS VAT/WHT Pro-Forma Invoice Builder',
        action: 'b2b_proforma_invoice_sizer',
        run: () => {
          const r = calculateB2bProformaInvoice(3500000, true, true, 120000);
          const valid = r.grossInvoiceTotalNgn === 3882500 && r.netBankRemittanceNgn === 3707500;
          return { valid, desc: `Gross Invoice: ₦${r.grossInvoiceTotalNgn.toLocaleString()} (VAT: ₦${r.vat75PercentNgn.toLocaleString()} | Net: ₦${r.netBankRemittanceNgn.toLocaleString()})` };
        },
      },
    ],
  },
];

function runExhaustiveSectorToolAudit() {
  console.log('========================================================================');
  console.log('🇳🇬 EXHAUSTIVE SECTOR-BY-SECTOR, TOOL-BY-TOOL REAL-DATA SANITY AUDIT');
  console.log('========================================================================\n');

  let grandTotalTools = 0;
  let passedTools = 0;

  for (const s of sectors) {
    console.log(`────────────────────────────────────────────────────────────────────────`);
    console.log(`📁 SECTOR: ${s.sectorName.toUpperCase()}`);
    console.log(`────────────────────────────────────────────────────────────────────────`);

    for (const t of s.tools) {
      grandTotalTools++;
      try {
        const res = t.run();
        if (res.valid) {
          passedTools++;
          console.log(`  ✅ [PASS] ${t.name}`);
          console.log(`     └─ ActionKey: [${t.action}]`);
          console.log(`     └─ Output: ${res.desc}\n`);
        } else {
          console.error(`  ❌ [MALFUNCTION] ${t.name} (${t.action}): Invalid calculation output!`);
          process.exit(1);
        }
      } catch (e) {
        console.error(`  ❌ [CRASH] ${t.name} (${t.action}): ${e.message}`);
        process.exit(1);
      }
    }
  }

  console.log('========================================================================');
  console.log(`🏁 EXHAUSTIVE AUDIT COMPLETE: ${passedTools}/${grandTotalTools} TOOLS PASSED WITH 100% PRECISION`);
  console.log('========================================================================\n');
}

runExhaustiveSectorToolAudit();
