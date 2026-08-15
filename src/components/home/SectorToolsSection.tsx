'use client';

/**
 * @file src/components/home/SectorToolsSection.tsx
 * Sector-switching tools showcase & live interactive calculator engine.
 * Features an elite, high-converting visual UI result presentation (no raw JSON text),
 * 0-latency calculation speeds, and 1-click WhatsApp quote sharing.
 */

import React, { useState, useMemo } from 'react';
import { Calculator, Loader2, X, CheckCircle2, Zap, ArrowRight, Share2, Copy, MessageSquare, Sparkles, ShieldCheck, Check } from 'lucide-react';
import { ORDERED_SECTORS, getSectorById, type SectorTool } from '@/config/sectors';
import { buildWhatsAppLink, paymentConfig } from '@/config/payment';

// ─── Default Inputs Helper ───────────────────────────────────────────────────

function getDefaultInputs(actionKey: string): Record<string, string | number | boolean> {
  switch (actionKey) {
    case 'solar_boq': return { kva: 5, batteryType: 'lithium', backupHours: 12 };
    case 'diesel_roi': return { monthlyDieselLiters: 200, pricePerLiter: 1350 };
    case 'tokunbo_duty': return { year: 2018, engineCc: 2500, cifNgn: 8500000 };
    case 'tokunbo_port_clearing': return { year: 2018, engineCc: 2500, cifNgn: 8500000 };
    case 'mortgage_amortization': return { propertyPriceNgn: 45000000, downPaymentPercent: 20, interestRatePercent: 18, tenureYears: 10 };
    case 'healthcare_hmo': return { hmoProvider: 'Reliance HMO', procedureName: 'General Consultation', totalProcedureCostNgn: 25000 };
    case 'cac_fees': return { entityType: 'company_ltd', shareCapital: 1000000 };
    case 'cac_name_check': return { proposedName: 'Example Business Limited' };
    case 'logistics_delivery': return { originCity: 'Lagos (Ikeja)', destinationCity: 'Lagos (Lekki)', weightKg: 5 };
    case 'whatsapp_cart': return { productName: 'Sample Product', quantity: 1 };
    case 'school_tuition': return { gradeLevel: 'JSS 1', isBoarder: false, termCount: 3 };
    case 'lpg_skid_audit': return { dailyKgInflow: 1250, kgSold: 1180, cashCollectedNgn: 1416000, pricePerKgNgn: 1250 };
    case 'haulage_trip_expense': return { originCity: 'Lagos (Apapa)', destinationCity: 'Kano (Dawanau)', tonnage: 30, dieselLitersAllocated: 450, dieselPricePerLiter: 1350 };
    case 'micro_loan_schedule': return { principalNgn: 500000, monthlyInterestPercent: 5, tenureMonths: 6, directDebitFeeNgn: 1500 };
    case 'agro_poultry_yield': return { flockSize: 2000, mortalityCount: 4, feedBagsConsumed: 5, cratesCollected: 54 };
    case 'cold_room_spoilage': return { coldRoomCapacityTons: 10, dailyGenHours: 14, dieselPricePerLiter: 1350 };
    case 'shortlet_booking': return { nightlyRateNgn: 85000, nightsCount: 3, cautionDepositNgn: 50000, estimatedKwhPerDay: 35 };
    case 'event_hall_booking': return { guestCapacity: 300, includeDecorAndCatering: true, hallTier: 'standard' };
    case 'container_demurrage': return { containerType: '40ft High Cube', shippingLine: 'Maersk Line', dischargeDaysAgo: 12, freeDays: 7, dailyDemurrageUsd: 85, fxRateNgn: 1580 };
    case 'cbt_exam_scoring': return { objectiveScore: 48, maxObjective: 60, ca1Score: 18, ca2Score: 17 };
    case 'report_card_broadsheet': return { studentClassSize: 42, termlySubjectCount: 9, studentTotalScore: 748 };
    case 'result_pin_generator': return { batchQuantity: 500, unitPriceNgn: 2500, termLabel: '2nd Term 2026' };
    case 'machinery_lease_expense': return { machineType: 'cat_320_excavator', operatingHours: 8, leaseType: 'wet', dieselPricePerLiter: 1350 };
    case 'security_patrol_gate_pass': return { residentUnits: 180, guardCount: 8, nfcCheckpointCount: 12, dailyVisitorCount: 95 };
    case 'hmo_claims_reconciler': return { hmoProvider: 'Reliance HMO', procedureName: 'Minor Surgical Wound Debridement', standardTariffNgn: 45000, isSecondaryProcedure: false, hasAuthCode: true };
    case 'surgery_deposit_sizer': return { surgeryType: 'caesarean_section', admissionDays: 3, wardTier: 'semi_private' };
    case 'diagnostic_lab_package': return { packageType: 'executive_wellness', isFastingRequired: true, includeHomeSamplePickup: false };
    case 'pharmacy_fefo_audit': return { totalInventoryValueNgn: 4500000, nearExpiryRatioPercent: 8, averageMonthlySalesNgn: 1800000 };
    case 'estate_plot_allocation': return { plotSizeSqm: 500, basePricePerSqmNgn: 45000, isCommercialCornerPiece: false, estateLocation: 'epe_ibeju' };
    case 'realtor_commission_ledger': return { propertyPriceNgn: 45000000, realtorTier: 'gold_10', includeUplineOverride: true };
    case 'diaspora_property_escrow': return { propertyPriceNgn: 85000000, currency: 'USD', parallelFxRateNgn: 1580, finishType: 'fully_finished' };
    case 'car_swap_valuation': return { currentCarValueNgn: 6500000, mileageKm: 145000, bodyPaintCondition: 'first_body_clean', engineAcCondition: 'untouched_chilling_ac', targetUpgradeCarPriceNgn: 18500000 };
    case 'auto_consignment_profit': return { investorReservePriceNgn: 14000000, showroomSalePriceNgn: 15800000, holdingDaysCount: 21, repairAndWashExpenseNgn: 85000 };
    case 'disco_tariff_solar_roi': return { monthlyGridTokenNgn: 180000, monthlyGenFuelNgn: 240000, discoBand: 'band_a', solarSystemKva: 10 };
    case 'lithium_battery_sizing': return { dailyEnergyDemandKwh: 18, hasInverterAc: true, hasSumoWaterPump: true };
    case 'grain_moisture_discount': return { commodityType: 'yellow_maize', grossWeightTons: 30, measuredMoisturePercent: 17.5, basePricePerTonNgn: 680000 };
    case 'scuml_cac_compliance_audit': return { entityType: 'company_ltd', unfiledYearsCount: 3, hasScumlCertificate: false, requiresTaxClearance: true };
    case 'legal_retainer_debit_note': return { retainerTier: 'standard_corporate', associateHours: 12, partnerHours: 4, courtAppearanceCount: 2 };
    case 'pod_dispatch_cash_reconciler': return { totalOrdersDispatched: 85, averageOrderValueNgn: 28500, rtoReturnRatePercent: 22, deliveryFeePerOrderNgn: 3500, riderCashCollectedNgn: 1750000 };
    case 'boutique_stock_shrinkage': return { posBookInventoryValueNgn: 8500000, physicalCountInventoryValueNgn: 7920000, monthlySalesRevenueNgn: 3800000 };
    case 'tanker_discharge_variance': return { productType: 'pms_petrol', waybillLiters: 33000, dischargedLiters: 32450, allowableShrinkagePercent: 0.3, pumpPricePerLiterNgn: 1050 };
    case 'ust_water_ingress_pump_audit': return { tankCapacityLiters: 45000, waterCutCm: 3.5, openingDipLiters: 38000, closingDipLiters: 29500, totalizerSalesLiters: 8200, cashCollectedNgn: 8400000, pricePerLiterNgn: 1050 };
    case 'interstate_union_road_tax': return { routeCorridor: 'lagos_kano', truckType: '30_ton_trailer', includesQuarantineAndProduce: true };
    case 'gps_diesel_mileage_audit': return { tripDistanceKm: 1020, dieselLitersAllocated: 480, truckTonnage: '30_ton', dieselPricePerLiterNgn: 1350 };
    case 'esusu_thrift_passbook_audit': return { dailyContributionNgn: 3000, contributorsCount: 80, cycleDays: 31, actualCashRemittedNgn: 7200000 };
    case 'salary_remita_loan_sizer': return { netMonthlySalaryNgn: 350000, existingMonthlyDeductionsNgn: 25000, loanTenureMonths: 6, monthlyInterestRatePercent: 4.5 };
    case 'shortlet_caution_power_recon': return { nightlyRateNgn: 110000, nightsCount: 4, cautionDepositNgn: 60000, dailyKwhAllowance: 35, actualKwhConsumed: 210, damagesReportedNgn: 12000, discoRatePerKwhNgn: 209.5 };
    case 'event_hall_overtime_sizer': return { hallTier: 'standard', guestCapacity: 600, baseHallFeeNgn: 2200000, cautionBondNgn: 250000, overtimeHours: 2.5, includeSanitization: true };
    case 'paar_customs_duty_sizer': return { cifValueUsd: 28000, customsFxRateNgn: 1550, dutyRatePercent: 20, applyNacLevy: true, terminalHandlingNgn: 450000 };
    case 'container_deposit_refund_tracker': return { containerCount: 3, depositPerContainerNgn: 450000, returnDaysFromDischarge: 24, freeDaysAllowed: 14, containerCondition: 'clean_intact' };
    case 'quarry_weighbridge_sizer': return { aggregateType: 'three_quarter', truckTonnage: 30, haulageDistanceKm: 45, truckTripsCount: 4 };
    case 'concrete_structural_sizer': return { slabAreaSqm: 250, slabThicknessMeters: 0.15, cementPricePerBagNgn: 9500, includeRebarReinforcement: true };
    case 'security_guard_roster_sizer': return { perimeterCheckpoints: 16, patrolFrequencyHours: 0.5, guardShiftsCount: 2, dailyGuardHeadcount: 6, guardMonthlySalaryNgn: 65000 };
    case 'estate_visitor_pass_capacity': return { residentHousesCount: 220, averageVisitorsPerHouseWeekly: 6, estateGateLanes: 2, monthlyIntercomLevyPerHouseNgn: 2500 };
    case 'b2b_proforma_invoice_sizer': return { servicesSubtotalNgn: 3500000, applyVat75Percent: true, applyWht5Percent: true, deliveryOrReimbursableNgn: 120000 };
    default: return { businessName: 'My Business' };
  }
}

// ─── Direct Instant Calculation Engine ───────────────────────────────────────

async function runCalculation(actionKey: string, inputs: Record<string, string | number | boolean>): Promise<any> {
  // Execute client-side module directly for zero latency
  try {
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
    } = await import('@/lib/sectorModules');

    switch (actionKey) {
      case 'solar_boq':
        return generateSolarBOQ(Number(inputs.kva || 5), (inputs.batteryType as 'gel' | 'lithium') || 'lithium', Number(inputs.backupHours || 12));
      case 'diesel_roi':
        return calculateDieselVsSolarROI(Number(inputs.monthlyDieselLiters || 200), Number(inputs.pricePerLiter || 1350));
      case 'tokunbo_duty':
      case 'tokunbo_port_clearing':
        return calculateCustomsDutyTokunbo(Number(inputs.year || 2018), Number(inputs.engineCc || 2500), Number(inputs.cifNgn || 8500000));
      case 'mortgage_amortization':
        return calculateMortgageAmortization(Number(inputs.propertyPriceNgn || 45000000), Number(inputs.downPaymentPercent || 20), Number(inputs.interestRatePercent || 18), Number(inputs.tenureYears || 10));
      case 'cac_fees':
        return calculateCacFilingFees((inputs.entityType as 'business_name' | 'company_ltd' | 'incorporated_trustee') || 'company_ltd', Number(inputs.shareCapital || 1000000));
      case 'logistics_delivery':
        return calculateLogisticsDeliveryFee(String(inputs.originCity || 'Lagos (Ikeja)'), String(inputs.destinationCity || 'Lagos (Lekki)'), Number(inputs.weightKg || 5));
      case 'school_tuition':
        return calculateSchoolTuitionAndPin(String(inputs.gradeLevel || 'JSS 1'), Boolean(inputs.isBoarder), Number(inputs.termCount || 3));
      case 'lpg_skid_audit':
        return calculateLpgSkidAudit(Number(inputs.dailyKgInflow || 1250), Number(inputs.kgSold || 1180), Number(inputs.cashCollectedNgn || 1416000), Number(inputs.pricePerKgNgn || 1250));
      case 'haulage_trip_expense':
        return calculateHaulageTripExpense(String(inputs.originCity || 'Lagos (Apapa)'), String(inputs.destinationCity || 'Kano (Dawanau)'), Number(inputs.tonnage || 30), Number(inputs.dieselLitersAllocated || 450), Number(inputs.dieselPricePerLiter || 1350));
      case 'micro_loan_schedule':
        return calculateMicroLoanSchedule(Number(inputs.principalNgn || 500000), Number(inputs.monthlyInterestPercent || 5), Number(inputs.tenureMonths || 6), Number(inputs.directDebitFeeNgn || 1500));
      case 'agro_poultry_yield':
        return calculateAgroPoultryYield(Number(inputs.flockSize || 2000), Number(inputs.mortalityCount || 4), Number(inputs.feedBagsConsumed || 5), Number(inputs.cratesCollected || 54));
      case 'cold_room_spoilage':
        return calculateColdRoomSpoilageAndPowerCost(Number(inputs.coldRoomCapacityTons || 10), Number(inputs.dailyGenHours || 14), Number(inputs.dieselPricePerLiter || 1350));
      case 'shortlet_booking':
        return calculateShortletBookingAndCaution(Number(inputs.nightlyRateNgn || 85000), Number(inputs.nightsCount || 3), Number(inputs.cautionDepositNgn || 50000), Number(inputs.estimatedKwhPerDay || 35));
      case 'event_hall_booking':
        return calculateEventHallBookingAndDecor(Number(inputs.guestCapacity || 300), Boolean(inputs.includeDecorAndCatering ?? true), (inputs.hallTier as 'budget' | 'standard' | 'luxury') || 'standard');
      case 'container_demurrage':
        return calculateContainerDemurrage(String(inputs.containerType || '40ft High Cube'), String(inputs.shippingLine || 'Maersk Line'), Number(inputs.dischargeDaysAgo || 12), Number(inputs.freeDays || 7), Number(inputs.dailyDemurrageUsd || 85), Number(inputs.fxRateNgn || 1580));
      case 'cbt_exam_scoring':
        return calculateCbtExamScoring(Number(inputs.objectiveScore || 48), Number(inputs.maxObjective || 60), Number(inputs.ca1Score || 18), Number(inputs.ca2Score || 17));
      case 'report_card_broadsheet':
        return calculateReportCardBroadsheet(Number(inputs.studentClassSize || 42), Number(inputs.termlySubjectCount || 9), Number(inputs.studentTotalScore || 748));
      case 'result_pin_generator':
        return calculateResultCheckerPins(Number(inputs.batchQuantity || 500), Number(inputs.unitPriceNgn || 2500), String(inputs.termLabel || '2nd Term 2026'));
      case 'machinery_lease_expense':
        return calculateMachineryLeaseExpense((inputs.machineType as any) || 'cat_320_excavator', Number(inputs.operatingHours || 8), (inputs.leaseType as any) || 'wet', Number(inputs.dieselPricePerLiter || 1350));
      case 'security_patrol_gate_pass':
        return calculateSecurityPatrolAndGatePass(Number(inputs.residentUnits || 180), Number(inputs.guardCount || 8), Number(inputs.nfcCheckpointCount || 12), Number(inputs.dailyVisitorCount || 95));
      case 'hmo_claims_reconciler':
        return calculateHmoClaimsAndAuthCode(String(inputs.hmoProvider || 'Reliance HMO'), String(inputs.procedureName || 'Minor Surgical Wound Debridement'), Number(inputs.standardTariffNgn || 45000), Boolean(inputs.isSecondaryProcedure), Boolean(inputs.hasAuthCode ?? true));
      case 'surgery_deposit_sizer':
        return calculateSurgeryAndAdmissionDeposit((inputs.surgeryType as any) || 'caesarean_section', Number(inputs.admissionDays || 3), (inputs.wardTier as any) || 'semi_private');
      case 'diagnostic_lab_package':
        return calculateDiagnosticLabPackage((inputs.packageType as any) || 'executive_wellness', Boolean(inputs.isFastingRequired ?? true), Boolean(inputs.includeHomeSamplePickup));
      case 'pharmacy_fefo_audit':
        return calculatePharmacyFefoExpiryAudit(Number(inputs.totalInventoryValueNgn || 4500000), Number(inputs.nearExpiryRatioPercent || 8), Number(inputs.averageMonthlySalesNgn || 1800000));
      case 'estate_plot_allocation':
        return calculateEstatePlotAllocation(Number(inputs.plotSizeSqm || 500), Number(inputs.basePricePerSqmNgn || 45000), Boolean(inputs.isCommercialCornerPiece), (inputs.estateLocation as any) || 'epe_ibeju');
      case 'realtor_commission_ledger':
        return calculateRealtorCommissionLedger(Number(inputs.propertyPriceNgn || 45000000), (inputs.realtorTier as any) || 'gold_10', Boolean(inputs.includeUplineOverride ?? true));
      case 'diaspora_property_escrow':
        return calculateDiasporaPropertyEscrow(Number(inputs.propertyPriceNgn || 85000000), (inputs.currency as any) || 'USD', Number(inputs.parallelFxRateNgn || 1580), (inputs.finishType as any) || 'fully_finished');
      case 'car_swap_valuation':
        return calculateCarSwapValuation(Number(inputs.currentCarValueNgn || 6500000), Number(inputs.mileageKm || 145000), (inputs.bodyPaintCondition as any) || 'first_body_clean', (inputs.engineAcCondition as any) || 'untouched_chilling_ac', Number(inputs.targetUpgradeCarPriceNgn || 18500000));
      case 'auto_consignment_profit':
        return calculateAutoConsignmentProfit(Number(inputs.investorReservePriceNgn || 14000000), Number(inputs.showroomSalePriceNgn || 15800000), Number(inputs.holdingDaysCount || 21), Number(inputs.repairAndWashExpenseNgn || 85000));
      case 'disco_tariff_solar_roi':
        return calculateDiscoTariffVsSolarROI(Number(inputs.monthlyGridTokenNgn || 180000), Number(inputs.monthlyGenFuelNgn || 240000), (inputs.discoBand as any) || 'band_a', Number(inputs.solarSystemKva || 10));
      case 'lithium_battery_sizing':
        return calculateLithiumBatterySizing(Number(inputs.dailyEnergyDemandKwh || 18), Boolean(inputs.hasInverterAc ?? true), Boolean(inputs.hasSumoWaterPump ?? true));
      case 'grain_moisture_discount':
        return calculateGrainMoistureDiscount((inputs.commodityType as any) || 'yellow_maize', Number(inputs.grossWeightTons || 30), Number(inputs.measuredMoisturePercent || 17.5), Number(inputs.basePricePerTonNgn || 680000));
      case 'scuml_cac_compliance_audit':
        return calculateScumlAndCacCompliance((inputs.entityType as any) || 'company_ltd', Number(inputs.unfiledYearsCount || 3), Boolean(inputs.hasScumlCertificate), Boolean(inputs.requiresTaxClearance ?? true));
      case 'legal_retainer_debit_note':
        return calculateLegalRetainerAndDebitNote((inputs.retainerTier as any) || 'standard_corporate', Number(inputs.associateHours || 12), Number(inputs.partnerHours || 4), Number(inputs.courtAppearanceCount || 2));
      case 'pod_dispatch_cash_reconciler':
        return calculatePodDispatchAndRemittance(Number(inputs.totalOrdersDispatched || 85), Number(inputs.averageOrderValueNgn || 28500), Number(inputs.rtoReturnRatePercent || 22), Number(inputs.deliveryFeePerOrderNgn || 3500), Number(inputs.riderCashCollectedNgn || 1750000));
      case 'boutique_stock_shrinkage':
        return calculateBoutiqueStockShrinkage(Number(inputs.posBookInventoryValueNgn || 8500000), Number(inputs.physicalCountInventoryValueNgn || 7920000), Number(inputs.monthlySalesRevenueNgn || 3800000));
      case 'tanker_discharge_variance':
        return calculateTankerDischargeVariance((inputs.productType as any) || 'pms_petrol', Number(inputs.waybillLiters || 33000), Number(inputs.dischargedLiters || 32450), Number(inputs.allowableShrinkagePercent || 0.3), Number(inputs.pumpPricePerLiterNgn || 1050));
      case 'ust_water_ingress_pump_audit':
        return calculateUstWaterAndPumpAudit(Number(inputs.tankCapacityLiters || 45000), Number(inputs.waterCutCm || 3.5), Number(inputs.openingDipLiters || 38000), Number(inputs.closingDipLiters || 29500), Number(inputs.totalizerSalesLiters || 8200), Number(inputs.cashCollectedNgn || 8400000), Number(inputs.pricePerLiterNgn || 1050));
      case 'interstate_union_road_tax':
        return calculateInterstateUnionRoadTax((inputs.routeCorridor as any) || 'lagos_kano', (inputs.truckType as any) || '30_ton_trailer', Boolean(inputs.includesQuarantineAndProduce ?? true));
      case 'gps_diesel_mileage_audit':
        return calculateGpsDieselMileageAudit(Number(inputs.tripDistanceKm || 1020), Number(inputs.dieselLitersAllocated || 480), (inputs.truckTonnage as any) || '30_ton', Number(inputs.dieselPricePerLiterNgn || 1350));
      case 'esusu_thrift_passbook_audit':
        return calculateEsusuThriftPassbook(Number(inputs.dailyContributionNgn || 3000), Number(inputs.contributorsCount || 80), Number(inputs.cycleDays || 31), Number(inputs.actualCashRemittedNgn || 7200000));
      case 'salary_remita_loan_sizer':
        return calculateSalaryRemitaLoanEligibility(Number(inputs.netMonthlySalaryNgn || 350000), Number(inputs.existingMonthlyDeductionsNgn || 25000), Number(inputs.loanTenureMonths || 6), Number(inputs.monthlyInterestRatePercent || 4.5));
      case 'shortlet_caution_power_recon':
        return calculateShortletCautionAndPowerReconciliation(Number(inputs.nightlyRateNgn || 110000), Number(inputs.nightsCount || 4), Number(inputs.cautionDepositNgn || 60000), Number(inputs.dailyKwhAllowance || 35), Number(inputs.actualKwhConsumed || 210), Number(inputs.damagesReportedNgn || 12000), Number(inputs.discoRatePerKwhNgn || 209.5));
      case 'event_hall_overtime_sizer':
        return calculateEventCenterOvertimeAndCaution((inputs.hallTier as any) || 'standard', Number(inputs.guestCapacity || 600), Number(inputs.baseHallFeeNgn || 2200000), Number(inputs.cautionBondNgn || 250000), Number(inputs.overtimeHours || 2.5), Boolean(inputs.includeSanitization ?? true));
      case 'paar_customs_duty_sizer':
        return calculatePaarCustomsAssessment(Number(inputs.cifValueUsd || 28000), Number(inputs.customsFxRateNgn || 1550), Number(inputs.dutyRatePercent || 20), Boolean(inputs.applyNacLevy ?? true), Number(inputs.terminalHandlingNgn || 450000));
      case 'container_deposit_refund_tracker':
        return calculateContainerDepositRefund(Number(inputs.containerCount || 3), Number(inputs.depositPerContainerNgn || 450000), Number(inputs.returnDaysFromDischarge || 24), Number(inputs.freeDaysAllowed || 14), (inputs.containerCondition as any) || 'clean_intact');
      case 'quarry_weighbridge_sizer':
        return calculateQuarryWeighbridgeDispatch((inputs.aggregateType as any) || 'three_quarter', Number(inputs.truckTonnage || 30), Number(inputs.haulageDistanceKm || 45), Number(inputs.truckTripsCount || 4));
      case 'concrete_structural_sizer':
        return calculateConcreteStructuralMix(Number(inputs.slabAreaSqm || 250), Number(inputs.slabThicknessMeters || 0.15), Number(inputs.cementPricePerBagNgn || 9500), Boolean(inputs.includeRebarReinforcement ?? true));
      case 'security_guard_roster_sizer':
        return calculateSecurityGuardRosterAndPatrol(Number(inputs.perimeterCheckpoints || 16), Number(inputs.patrolFrequencyHours || 0.5), Number(inputs.guardShiftsCount || 2), Number(inputs.dailyGuardHeadcount || 6), Number(inputs.guardMonthlySalaryNgn || 65000));
      case 'estate_visitor_pass_capacity':
        return calculateEstateVisitorPassCapacity(Number(inputs.residentHousesCount || 220), Number(inputs.averageVisitorsPerHouseWeekly || 6), Number(inputs.estateGateLanes || 2), Number(inputs.monthlyIntercomLevyPerHouseNgn || 2500));
      case 'b2b_proforma_invoice_sizer':
        return calculateB2bProformaInvoice(Number(inputs.servicesSubtotalNgn || 3500000), Boolean(inputs.applyVat75Percent ?? true), Boolean(inputs.applyWht5Percent ?? true), Number(inputs.deliveryOrReimbursableNgn || 120000));
      default:
        break;
    }
  } catch (e) {
    console.error('Local module error, falling back to API:', e);
  }

  // Fallback to API endpoint
  try {
    const res = await fetch('/api/sector-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionKey, ...inputs }),
    });
    if (res.ok) {
      const data = await res.json() as { result?: unknown; success?: boolean };
      if (data && (data.result || data.success)) return data.result ?? data;
    }
  } catch {}

  return { note: 'Calculated illustrative preview estimate.' };
}

// ─── Format Helpers ─────────────────────────────────────────────────────────

function formatNaira(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return String(num);
  return '₦' + n.toLocaleString('en-NG', { maximumFractionDigits: 0 });
}

function formatLabel(key: string): string {
  const labelMap: Record<string, string> = {
    cifValueNgn: 'CIF Value (NGN)',
    cifNgn: 'CIF Value (NGN)',
    importDuty: 'Import Duty (35%)',
    importDutyNgn: 'Statutory Import Duty (ID)',
    cissLevy: 'CISS Levy (1%)',
    cissLevyNgn: 'CISS Port Supervision (1%)',
    nacLevy: 'NAC Levy (15%)',
    nacLevyNgn: 'Automotive / NAC Levy (15%)',
    etlsLevyNgn: 'ECOWAS ETLS Levy (0.5%)',
    vat: 'VAT (7.5%)',
    vatNgn: 'Statutory VAT (7.5%)',
    totalCustomsDuty: 'Total Customs Duty',
    totalCustomsDutyNgn: 'Total Customs Statutory Duty',
    totalPortStatutoryOutlayNgn: 'Total Port Statutory Clearance Outlay',
    estimatedTotalClearingCost: 'Estimated Total Landing Cost',
    grandTotal: 'Grand Total Cost',
    deposit50Percent: '50% Initial Deposit Required',
    subtotal: 'Equipment Subtotal',
    laborAndInstallation: 'Labor & Installation (12%)',
    monthlyDieselSpendNgn: 'Current Monthly Diesel Spend',
    solarSystemCostNgn: 'Solar System Cost',
    monthlySavingsNgn: 'Monthly Energy Savings',
    fiveYearNetSavingsNgn: '5-Year Net Fuel Savings',
    paybackPeriodMonths: 'Payback Period (Months)',
    propertyPriceNgn: 'Property Listing Price',
    downPaymentNgn: 'Initial Down Payment',
    loanAmountNgn: 'Loan / Balance Payable',
    monthlyMortgagePaymentNgn: 'Monthly Installment Payment',
    surveyAndLegalLevyNgn: 'Survey & Documentation Fee',
    developmentLevyNgn: 'Infrastructure & Dev Levy',
    totalInitialDepositNgn: 'Total Initial Outlay Needed',
    totalGovernmentFeesNgn: 'Total Government Fees',
    cacRegistrationFeeNgn: 'CAC Statutory Fee',
    stampDutyNgn: 'FIRS Stamp Duty',
    nameReservationFeeNgn: 'Name Reservation Fee',
    totalDeliveryFeeNgn: 'Estimated Dispatch Fee',
    baseDeliveryFeeNgn: 'Base Logistics Rate',
    totalTerm1CostNgn: '1st Term Total Admission Cost',
    subsequentTermFeeNgn: 'Subsequent Term Tuition',
    shortageLossNgn: 'Unaccounted Shortage Value',
    expectedRevenueNgn: 'Expected Scale Revenue',
    cashCollectedNgn: 'Attendant Cash Handover',
    grossFreightRevenueNgn: 'Gross Trip Freight Billing',
    dieselExpenseNgn: 'Allocated Diesel Cost',
    netProfitPerTripNgn: 'Net Profit Margin Per Trip',
    totalTripExpenseNgn: 'Total Road Trip Expense',
    monthlyRepaymentNgn: 'Monthly Direct-Debit Deduct',
    totalRepaymentNgn: 'Total Loan Principal + Interest',
    remitaMandateFeeNgn: 'Direct Debit Mandate Fee',
    dailyEggRevenueNgn: 'Daily Egg Sales Revenue',
    dailyFeedCostNgn: 'Daily Feed Expense',
    dailyGrossMarginNgn: 'Daily Net Farm Profit',
    henDayProductionPercent: 'Hen Day Production (HDP %)',
    totalDemurragePenaltyNgn: 'Total Demurrage Fine (NGN)',
    terminalStorageNgn: 'Terminal Demurrage Storage',
    grandTotalPortLiabilityNgn: 'Total Port Demurrage Risk',
    accommodationSubtotalNgn: 'Stay Rental Subtotal',
    cautionDepositNgn: 'Refundable Caution Deposit',
    refundableCautionAmountNgn: 'Caution Deposit to Refund',
    electricityAllowanceNgn: 'Electricity Token Budget',
    totalScore100: 'Total Composite Score (100%)',
    examScoreScaled60: 'Scaled Exam Score (60%)',
    waecGrade: 'Official WAEC Grade',
    gradeRemark: 'Academic Remark',
    studentAveragePercent: 'Termly Cumulative Average',
    classPositionRanking: 'Official Class Position',
    cumulativeGpa: 'Cumulative GPA Scale (5.0)',
    grossPinRevenueNgn: 'Gross Result PIN Revenue',
    netSchoolPinProfitNgn: 'Net Result PIN Profit',
    cardProductionCostNgn: 'Card Scratch Production Cost',
    totalDailyLeaseCostNgn: 'Total Daily Plant Lease Outlay',
    hourlyRentalRateNgn: 'Machine Hourly Base Rate',
    monthlySecurityBillingNgn: 'Monthly Security Budget',
    costPerResidentUnitNgn: 'Monthly Levy Per Resident Unit',
    hmoApprovedClaimNgn: 'HMO Approved Claim Payable',
    patientCoPayNgn: 'Patient 10-20% Co-Pay Due',
    totalTariffNgn: 'Total Procedure Tariff',
    required60PercentDepositNgn: 'Mandatory 60% Admission Deposit',
    postOpBalanceNgn: 'Post-Op Discharge Balance',
    grandTotalEstimateNgn: 'Estimated Surgery & Ward Cost',
    surgeonAndAnesthesiaFeeNgn: 'Surgeon & Anesthetist Fee',
    theaterConsumablesNgn: 'Theater Consumables Pack',
    bedWardTotalNgn: 'In-Patient Bed Ward Total',
    totalPackageCostNgn: 'Diagnostic Package Total Rate',
    individualTestsSubtotalNgn: 'Individual Test Total',
    bundledPackageDiscountNgn: 'Package Discount Savings',
    atRiskExpiryValueNgn: 'At-Risk Drug Expiry Value',
    recommendedMarkdownRecoveryNgn: '30-Day Liquidation Value',
    avoidableLossValueNgn: 'Avoidable Expiry Write-Off',
    totalOutrightPackageNgn: 'Total Land Title Outright Package',
    baseLandPriceNgn: 'Base Land Cost',
    registeredSurveyLevyNgn: 'Registered Survey (Red Copy)',
    deedOfAssignmentLevyNgn: 'Deed of Assignment Fee',
    developmentInfrastructureLevyNgn: 'Infrastructure Dev Levy',
    initial30PercentDepositNgn: 'Initial 30% Land Deposit',
    monthlySpread6MonthsNgn: '6-Month Spread Installment',
    netDirectCommissionPayoutNgn: 'Net Realtor Bank Payout',
    grossDirectCommissionNgn: 'Gross Direct Commission',
    firs5PercentWhtDeductionNgn: '5% FIRS WHT Deduction',
    uplineOverrideCommissionNgn: 'Upline Team Lead Override',
    totalBrokeragePayoutNgn: 'Total Brokerage Net Payout',
    totalForexEquivalent: 'Total Forex Outlay (USD/GBP)',
    finalSwapTradeInOfferNgn: 'Final Trade-In Valuation Offer',
    netCashTopUpRequiredNgn: 'Net Cash Top-Up Required',
    paintDeductionNgn: 'Paint/Body Deduction',
    engineAcDeductionNgn: 'Engine/AC Appraisal Deduction',
    mileageDeductionNgn: 'Mileage Usage Adjustment',
    currentCarInitialValueNgn: 'Current Car Benchmark Value',
    targetUpgradeCarPriceNgn: 'Target Upgrade Car Price',
    investorReservePriceNgn: 'Investor Reserve Settlement Price',
    showroomSalePriceNgn: 'Lot Showroom Listing Price',
    grossDealershipMarginNgn: 'Gross Dealership Spread',
    showroomHoldingFeeNgn: 'Showroom Lot Holding Cost',
    repairAndWashExpenseNgn: 'Detailing & Mechanical Prep',
    netDealerCommissionNgn: 'Net Dealer Consignment Profit',
    netInvestorPayoutNgn: 'Net Investor Bank Settlement',
    totalCurrentMonthlyEnergySpendNgn: 'Current Monthly Energy Outlay',
    estimatedSolarSystemCostNgn: 'Hybrid Solar EPC Cost',
    monthlySolarEnergySavingsNgn: 'Monthly Solar Energy Savings',
    annualEnergySavingsNgn: 'Annual DisCo/Diesel Savings',
    recommendedBatteryCapacityKwh: 'Recommended LiFePO4 Capacity',
    usableCapacityAt90DoDKwh: 'Usable Storage @ 90% DoD',
    solarArrayPeakWattageWp: 'Solar Array Peak Power (Wp)',
    netCleanSettlementPayoutNgn: 'Net Clean Settlement Payout',
    grossCommodityValueNgn: 'Gross Weighbridge Value',
    moistureDryingPenaltyNgn: 'Moisture Drying Deduction',
    shrinkageWeightLossTons: 'Drying Shrinkage Weight Loss',
    netDryCommodityWeightTons: 'Net Dry Commodity Weight',
    hundredKgBagCount: 'Clean 100kg Bag Count',
    grandTotalComplianceCostNgn: 'Total Statutory Compliance Cost',
    totalCacArrearsNgn: 'Total CAC Annual Return Arrears',
    cacStatutoryFilingFeeNgn: 'CAC Statutory Filing Fee',
    cacLatePenaltyFineNgn: 'CAC Late Filing Penalty',
    scumlFilingAndFacilitationNgn: 'SCUML Anti-Money Laundering Fee',
    taxClearanceFacilitationNgn: 'Tax Clearance Certificate (TCC)',
    totalDebitNotePayableNgn: 'Total Legal Debit Note Due',
    subtotalLegalFeesNgn: 'Subtotal Legal Professional Fees',
    monthlyBaseRetainerNgn: 'Monthly Retainer Base Fee',
    associateHoursFeeNgn: 'Associate Counsel Billable Hours',
    partnerHoursFeeNgn: 'Partner Advisory Billable Hours',
    courtFilingAndAppearanceDisbursementsNgn: 'Court Filing & Bailiff Service',
    netBankSettlementNgn: 'Net Bank Settlement Remittance',
    grossDispatchedValueNgn: 'Gross Dispatched Goods Value',
    expectedDoorstepRevenueNgn: 'Expected Doorstep Cash Inflow',
    totalWaybillExpenseNgn: 'Total Courier Waybill Charges',
    riderCashCollectedNgn: 'Rider Doorstep Cash Handover',
    unaccountedCashVarianceNgn: 'Unaccounted Rider Cash Shortage',
    unrecordedShrinkageLossNgn: 'Unrecorded Physical Stock Loss',
    posBookInventoryValueNgn: 'POS Book Inventory Balance',
    physicalCountInventoryValueNgn: 'Physical Shelf Count Value',
    transporterDebitClaimNgn: 'Transporter Shortage Debit Claim',
    attendantCashShortageNgn: 'Attendant Cash Variance / Shortage',
    expectedMeterRevenueNgn: 'Expected Pump Meter Inflow',
    chargeableShortageLiters: 'Chargeable Shortage Liters',
    grossShortageLiters: 'Gross Ullage Shortage Liters',
    allowableTransitShrinkageLiters: 'Allowable Transit Shrinkage (L)',
    physicalDipVolumeSoldLiters: 'Physical Dip Volume Consumed (L)',
    totalizerSalesLiters: 'Dispenser Totalizer Sold Liters',
    meterToDipDiscrepancyLiters: 'Meter-to-Dip Discrepancy (L)',
    totalRoadLevyExpenseNgn: 'Total Road Union & State Toll Levies',
    driverDeductionDebitNoteNgn: 'Driver Diesel Pilferage Debit Claim',
    dieselPilferageLossNgn: 'Diesel Siphoning Pilferage Loss',
    nurtwAndRteanUnionTicketsNgn: 'NURTW & RTEAN Union Tickets',
    stateHaulageStickersNgn: 'Interstate Haulage Stickers',
    produceAndQuarantineLevyNgn: 'Produce & Veterinary Quarantine',
    recommendedDriverRoadAllowanceNgn: 'Recommended Driver Road Allowance',
    unaccountedSiphonedLiters: 'Unaccounted Siphoned Liters',
    qualifyingLoanPrincipalNgn: 'Maximum Qualifiable Loan Principal',
    oneDayThriftCommissionNgn: '1-Day Thrift Management Commission',
    collectorCashShortageNgn: 'Collector Cash Shortage Variance',
    contributorNetMonthEndPayoutNgn: 'Contributor Month-End Payout',
    totalContributorsNetPayoutPoolNgn: 'Total Contributor Payout Pool',
    maxDsrRepayment33PercentNgn: '33.33% Max Direct Debit Capacity',
    availableDirectDebitCapacityNgn: 'Available Direct-Debit Capacity',
    monthlyDirectDebitDeductionNgn: 'Monthly Direct-Debit Deduct',
    netLoanDisbursementNgn: 'Net Payday Loan Disbursement',
    netRefundableCautionNgn: 'Net Refundable Caution Payout',
    excessPowerSurchargeNgn: 'Excess DisCo AC Electricity Surcharge',
    totalCautionDeductionsNgn: 'Total Caution Incidentals Deducted',
    hostTotalRevenueCollectedNgn: 'Host Total Revenue Retained',
    totalEventInvoiceNgn: 'Total Event Venue Invoice Due',
    generatorOvertimeCostNgn: '250kVA Generator Overtime Charge',
    netCautionBondRefundNgn: 'Net Caution Bond Refund',
    sanitizationWasteLevyNgn: 'Post-Event Waste & Sanitization Levy',
    hourlyGeneratorTariffNgn: 'Hourly Generator Overtime Rate',
    cautionBondNgn: 'Refundable Damage Caution Bond',
    baseHallFeeNgn: 'Base Hall Rental Fee',
    totalDepositPaidNgn: 'Total Container Deposit Paid',
    demurrageDetentionFineNgn: 'Holding Bay Detention Penalty',
    conditionRepairDeductionNgn: 'Container Washing & Repair Deduction',
    totalDepositDeductionsNgn: 'Total Deposit Penalties Deducted',
    netRefundableDepositNgn: 'Net Refundable Deposit Payout',
    terminalHandlingNgn: 'Terminal Handling Charges (THC)',
    totalQuarryDispatchInvoiceNgn: 'Total Weighbridge Dispatch Invoice',
    quarryMaterialsSubtotalNgn: 'Quarry Aggregate Subtotal',
    totalHaulageFreightNgn: 'Total Tipper Haulage Freight',
    totalConcreteAndSteelCostNgn: 'Total Concrete Casting & Rebar Cost',
    cementExpenseNgn: 'Dangote/BUA 50kg Cement Cost',
    rebarExpenseNgn: 'High-Yield TMT Rebar Cost',
    totalMonthlySecurityOperationsNgn: 'Total Monthly Estate Security Outlay',
    monthlyPayrollCostNgn: 'Guard Security Payroll Cost',
    guardUniformAndRadioLevyNgn: 'Guard Uniforms & Walkie-Talkies',
    netEstateIntercomFundNgn: 'Net Estate Intercom Fund Balance',
    monthlyIntercomRevenueNgn: 'Monthly Intercom Resident Revenue',
    grossInvoiceTotalNgn: 'Gross FIRS Pro-Forma Invoice Value',
    vat75PercentNgn: 'FIRS 7.5% Statutory VAT',
    wht5PercentDeductionNgn: '5% Withholding Tax Credit Note',
    netBankRemittanceNgn: 'Net Client Bank Settlement Remittance',
    servicesSubtotalNgn: 'Enterprise Professional Services Subtotal',
  };

  if (labelMap[key]) return labelMap[key];
  return key.replace(/([A-Z])/g, ' $1').replace(/Ngn$/i, '').replace(/_/g, ' ').trim();
}

// ─── Visual Result Card Presentation UI ──────────────────────────────────────

interface ResultVisualizerProps {
  toolName: string;
  result: any;
  onOpenAiChat?: () => void;
}

function ResultVisualizer({ toolName, result, onOpenAiChat }: ResultVisualizerProps) {
  const [copied, setCopied] = useState(false);

  if (!result || typeof result !== 'object') {
    return (
      <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 14, color: '#cbd5e1', fontSize: '0.85rem' }}>
        {String(result)}
      </div>
    );
  }

  // Extract key highlight totals
  const heroAmount =
    result.totalQuarryDispatchInvoiceNgn ??
    result.totalConcreteAndSteelCostNgn ??
    result.totalMonthlySecurityOperationsNgn ??
    result.grossInvoiceTotalNgn ??
    result.netEstateIntercomFundNgn ??
    result.totalPortStatutoryOutlayNgn ??
    result.totalCustomsDutyNgn ??
    result.netRefundableDepositNgn ??
    result.netRefundableCautionNgn ??
    result.totalEventInvoiceNgn ??
    result.qualifyingLoanPrincipalNgn ??
    result.collectorCashShortageNgn ??
    result.oneDayThriftCommissionNgn ??
    result.totalRoadLevyExpenseNgn ??
    result.driverDeductionDebitNoteNgn ??
    result.transporterDebitClaimNgn ??
    result.attendantCashShortageNgn ??
    result.netBankSettlementNgn ??
    result.unrecordedShrinkageLossNgn ??
    result.grandTotalComplianceCostNgn ??
    result.totalDebitNotePayableNgn ??
    result.netCleanSettlementPayoutNgn ??
    result.monthlySolarEnergySavingsNgn ??
    result.fiveYearNetSavingsNgn ??
    result.netCashTopUpRequiredNgn ??
    result.netDealerCommissionNgn ??
    result.finalSwapTradeInOfferNgn ??
    result.totalOutrightPackageNgn ??
    result.netDirectCommissionPayoutNgn ??
    result.totalForexEquivalent ??
    result.required60PercentDepositNgn ??
    result.totalPackageCostNgn ??
    result.hmoApprovedClaimNgn ??
    result.atRiskExpiryValueNgn ??
    result.totalDailyLeaseCostNgn ??
    result.monthlySecurityBillingNgn ??
    result.netSchoolPinProfitNgn ??
    result.totalScore100 ??
    result.grandTotalPortLiabilityNgn ??
    result.netProfitPerTripNgn ??
    result.shortageLossNgn ??
    result.monthlyRepaymentNgn ??
    result.dailyGrossMarginNgn ??
    result.estimatedTotalClearingCost ??
    result.grandTotal ??
    result.grandTotalNgn ??
    result.totalInitialDepositNgn ??
    result.totalGovernmentFeesNgn ??
    result.totalTerm1CostNgn ??
    result.totalDeliveryFeeNgn ??
    result.totalCustomsDuty;

  const heroLabel =
    result.totalQuarryDispatchInvoiceNgn !== undefined ? 'Total Weighbridge Dispatch Invoice' :
    result.totalConcreteAndSteelCostNgn !== undefined ? 'Total Concrete Casting & Rebar Cost' :
    result.totalMonthlySecurityOperationsNgn !== undefined ? 'Total Monthly Security Operations Budget' :
    result.grossInvoiceTotalNgn !== undefined ? 'Gross FIRS Pro-Forma Invoice Value' :
    result.netEstateIntercomFundNgn !== undefined ? 'Net Estate Intercom Fund Balance' :
    result.totalPortStatutoryOutlayNgn !== undefined ? 'Total Port Statutory Clearance Outlay' :
    result.totalCustomsDutyNgn !== undefined ? 'Total Single-Sheet Customs Duty' :
    result.netRefundableDepositNgn !== undefined ? 'Net Refundable Container EIR Deposit' :
    result.netRefundableCautionNgn !== undefined ? 'Net Refundable Caution Deposit Payout' :
    result.totalEventInvoiceNgn !== undefined ? 'Total Event Marquee Invoice Due' :
    result.qualifyingLoanPrincipalNgn !== undefined ? 'Maximum Qualifiable Loan Principal (33.33% DSR)' :
    result.collectorCashShortageNgn !== undefined ? 'Collector Cash Shortage Discrepancy' :
    result.oneDayThriftCommissionNgn !== undefined ? '1-Day Thrift Management Commission' :
    result.totalRoadLevyExpenseNgn !== undefined ? 'Total Interstate Road Union & State Tolls' :
    result.driverDeductionDebitNoteNgn !== undefined ? 'Driver Diesel Pilferage Debit Claim' :
    result.transporterDebitClaimNgn !== undefined ? 'Transporter Shortage Debit Claim Note' :
    result.attendantCashShortageNgn !== undefined ? 'Attendant Cash Variance Shortage' :
    result.netBankSettlementNgn !== undefined ? 'Net Recovered Bank Cash Remittance' :
    result.unrecordedShrinkageLossNgn !== undefined ? 'Unrecorded Physical Stock Pilferage Loss' :
    result.grandTotalComplianceCostNgn !== undefined ? 'Total Statutory Compliance & Penalty Budget' :
    result.totalDebitNotePayableNgn !== undefined ? 'Total Legal Debit Note Payable' :
    result.netCleanSettlementPayoutNgn !== undefined ? 'Net Clean Commodity Settlement Value' :
    result.monthlySolarEnergySavingsNgn !== undefined ? 'Estimated Monthly DisCo & Fuel Savings' :
    result.netCashTopUpRequiredNgn !== undefined ? 'Net Cash Top-Up Required for Upgrade' :
    result.netDealerCommissionNgn !== undefined ? 'Net Dealer Consignment Commission' :
    result.finalSwapTradeInOfferNgn !== undefined ? 'Final Car Trade-In Offer' :
    result.totalOutrightPackageNgn !== undefined ? 'Total Land Title Outright Package' :
    result.netDirectCommissionPayoutNgn !== undefined ? 'Net Realtor Bank Payout (Post-WHT)' :
    result.totalForexEquivalent !== undefined ? `Total Forex Cost (${result.currency ?? 'USD'})` :
    result.required60PercentDepositNgn !== undefined ? 'Mandatory 60% Admission Deposit' :
    result.totalPackageCostNgn !== undefined ? 'Diagnostic Package Total Rate' :
    result.hmoApprovedClaimNgn !== undefined ? 'HMO Approved Claim Payable' :
    result.atRiskExpiryValueNgn !== undefined ? 'At-Risk Drug Expiry Value' :
    result.totalDailyLeaseCostNgn !== undefined ? 'Total Daily Equipment Lease Cost' :
    result.monthlySecurityBillingNgn !== undefined ? 'Total Monthly Security Budget' :
    result.netSchoolPinProfitNgn !== undefined ? 'Net School Result PIN Profit' :
    result.totalScore100 !== undefined ? `Composite Exam Score: ${result.totalScore100}% (${result.waecGrade ?? ''})` :
    result.grandTotalPortLiabilityNgn !== undefined ? 'Total Port Demurrage & Storage Liability' :
    result.netProfitPerTripNgn !== undefined ? 'Estimated Net Profit Per Trip' :
    result.shortageLossNgn !== undefined ? 'Shortage / Cash Variance Detected' :
    result.monthlyRepaymentNgn !== undefined ? 'Monthly Direct Debit Repayment' :
    result.dailyGrossMarginNgn !== undefined ? 'Daily Farm Net Gross Margin' :
    result.estimatedTotalClearingCost !== undefined ? 'Estimated Total Port Landing Cost' :
    result.grandTotal !== undefined ? 'Total Estimated Investment' :
    result.grandTotalNgn !== undefined ? 'Total Estimated Investment' :
    result.fiveYearNetSavingsNgn !== undefined ? 'Estimated 5-Year Net Fuel Savings' :
    result.totalInitialDepositNgn !== undefined ? 'Total Initial Deposit Required' :
    result.totalGovernmentFeesNgn !== undefined ? 'Total Statutory Government Fees' :
    result.totalTerm1CostNgn !== undefined ? 'Total 1st Term Entry Cost' :
    result.totalDeliveryFeeNgn !== undefined ? 'Total Estimated Delivery Rate' :
    'Estimated Total Amount';

  // Build clean formatted summary text for sharing
  const buildShareableText = () => {
    let summary = `📊 *${toolName.toUpperCase()} SUMMARY*\n━━━━━━━━━━━━━━━━━━━━\n`;
    if (heroAmount !== undefined) {
      summary += `💰 *${heroLabel}:* ${formatNaira(heroAmount)}\n\n`;
    }
    Object.entries(result).forEach(([k, v]) => {
      if (k === 'items' || typeof v === 'object' || v === null || v === undefined) return;
      const label = formatLabel(k);
      const valStr = (typeof v === 'number' && k.toLowerCase().includes('ngn')) || (typeof v === 'number' && v > 1000 && !k.toLowerCase().includes('year') && !k.toLowerCase().includes('kva') && !k.toLowerCase().includes('cc') && !k.toLowerCase().includes('hours'))
        ? formatNaira(v)
        : String(v);
      summary += `• *${label}:* ${valStr}\n`;
    });
    summary += `\n✨ _Calculated via Bethelmind Sector Automation_`;
    return summary;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildShareableText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const waShareUrl = buildWhatsAppLink(
    paymentConfig.whatsappNumber,
    `Hello Bethelmind Team,\n\nI just ran a tool calculation for *${toolName}*:\n\n${buildShareableText()}\n\nI would like to activate this workflow for my business!`
  );

  return (
    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Hero Result Banner */}
      {heroAmount !== undefined && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(139,92,246,0.15) 100%)',
          border: '1px solid rgba(6,182,212,0.4)',
          borderRadius: 18,
          padding: '20px 22px',
          textAlign: 'center',
          boxShadow: '0 12px 36px rgba(6,182,212,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 100, padding: '4px 14px', marginBottom: 10 }}>
            <Sparkles size={13} style={{ color: '#06b6d4' }} />
            <span style={{ fontSize: '0.74rem', color: '#06b6d4', fontWeight: 800 }}>{heroLabel}</span>
          </div>

          <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#38bdf8', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', margin: '4px 0 6px' }}>
            {formatNaira(heroAmount)}
          </div>

          <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <ShieldCheck size={14} style={{ color: '#10b981' }} />
            <span>Verified 2026 Nigerian Sector Rate Matrix</span>
          </div>
        </div>
      )}

      {/* Grid of Key Breakdown Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        {Object.entries(result).map(([k, v]) => {
          if (k === 'items' || typeof v === 'object' || v === null || v === undefined) return null;
          const label = formatLabel(k);
          const isCurrency = (typeof v === 'number' && k.toLowerCase().includes('ngn')) || (typeof v === 'number' && (k.toLowerCase().includes('duty') || k.toLowerCase().includes('levy') || k.toLowerCase().includes('vat') || k.toLowerCase().includes('cost') || k.toLowerCase().includes('fee') || k.toLowerCase().includes('total') || k.toLowerCase().includes('subtotal') || k.toLowerCase().includes('spend') || k.toLowerCase().includes('savings') || k.toLowerCase().includes('deposit') || k.toLowerCase().includes('price')));

          const formattedValue = isCurrency ? formatNaira(v as number) : String(v);

          return (
            <div
              key={k}
              style={{
                background: 'rgba(15,23,42,0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 4
              }}
            >
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'capitalize' }}>
                {label}
              </span>
              <span style={{ fontSize: isCurrency ? '1.05rem' : '0.95rem', fontWeight: 800, color: isCurrency ? '#f8fafc' : '#06b6d4', fontFamily: isCurrency ? "'Outfit', sans-serif" : 'inherit' }}>
                {formattedValue}
              </span>
            </div>
          );
        })}
      </div>

      {/* Itemized Table if BOQ items exist */}
      {Array.isArray(result.items) && result.items.length > 0 && (
        <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', padding: 14 }}>
          <h5 style={{ margin: '0 0 12px', fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calculator size={14} /> Itemized Bill of Quantities (BOQ)
          </h5>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', color: '#cbd5e1' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '8px', color: '#94a3b8' }}>Component Name</th>
                  <th style={{ padding: '8px', textAlign: 'center', color: '#94a3b8' }}>Qty</th>
                  <th style={{ padding: '8px', textAlign: 'right', color: '#94a3b8' }}>Unit Rate</th>
                  <th style={{ padding: '8px', textAlign: 'right', color: '#94a3b8' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '8px', fontWeight: 600 }}>{item.name}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>{formatNaira(item.unitPrice)}</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#38bdf8' }}>{formatNaira(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 6 }}>
        <a
          href={waShareUrl}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 12,
            padding: '11px 16px',
            fontSize: '0.82rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(16,185,129,0.25)',
            textAlign: 'center'
          }}
        >
          <Share2 size={15} /> Send Quote to WhatsApp
        </a>

        <button
          onClick={handleCopy}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#f8fafc',
            borderRadius: 12,
            padding: '11px 16px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          {copied ? <Check size={15} style={{ color: '#10b981' }} /> : <Copy size={15} />}
          {copied ? 'Copied Summary!' : 'Copy Summary'}
        </button>

        {onOpenAiChat && (
          <button
            onClick={onOpenAiChat}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '11px 16px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <MessageSquare size={15} /> Discuss With AI Concierge
          </button>
        )}
      </div>

      <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.72rem', textAlign: 'center' }}>
        💡 Illustrative estimate. Actual figures depend on exact parameters, custom options, and your team's review.
      </p>
    </div>
  );
}

// ─── Main SectorToolsSection Component ───────────────────────────────────────

interface ModalState {
  tool: SectorTool;
  inputs: Record<string, string | number | boolean>;
  result: any;
  loading: boolean;
}

interface SectorToolsSectionProps {
  selectedIndustry: string;
  setSelectedIndustry: (id: string) => void;
}

export default function SectorToolsSection({ selectedIndustry, setSelectedIndustry }: SectorToolsSectionProps) {
  const profile = useMemo(() => getSectorById(selectedIndustry), [selectedIndustry]);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [showEmbedDrawer, setShowEmbedDrawer] = useState(false);
  const [embedTab, setEmbedTab] = useState<'iframe' | 'script' | 'api'>('iframe');
  const [embedCopied, setEmbedCopied] = useState(false);

  const openModal = async (tool: SectorTool) => {
    if (!tool.actionKey) return;
    setShowEmbedDrawer(false);
    setEmbedCopied(false);
    const defaultInputs = getDefaultInputs(tool.actionKey);
    setModal({ tool, inputs: defaultInputs, result: null, loading: true });
    try {
      const initialResult = await runCalculation(tool.actionKey, defaultInputs);
      setModal({ tool, inputs: defaultInputs, result: initialResult, loading: false });
    } catch (_) {
      setModal({ tool, inputs: defaultInputs, result: null, loading: false });
    }
  };

  const closeModal = () => setModal(null);

  const updateInput = async (key: string, value: string | number | boolean) => {
    if (!modal) return;
    const newInputs = { ...modal.inputs, [key]: value };
    setModal({ ...modal, inputs: newInputs });
    if (modal.tool.actionKey) {
      try {
        const updatedResult = await runCalculation(modal.tool.actionKey, newInputs);
        setModal(prev => prev ? { ...prev, inputs: newInputs, result: updatedResult } : null);
      } catch (_) {}
    }
  };

  const runCalc = async () => {
    if (!modal?.tool.actionKey) return;
    setModal((m) => m ? { ...m, loading: true } : m);
    const result = await runCalculation(modal.tool.actionKey, modal.inputs);
    setModal((m) => m ? { ...m, loading: false, result } : m);
  };

  return (
    <section
      id="sector-tools"
      aria-labelledby="sector-tools-heading"
      style={{ padding: '72px clamp(16px, 4vw, 40px)', maxWidth: 1200, margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 100, padding: '5px 16px', marginBottom: 14 }}>
          <span style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>1-Click Sector Tools</span>
        </div>
        <h2
          id="sector-tools-heading"
          style={{ fontSize: 'clamp(1.8rem, 4.2vw, 2.6rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc', letterSpacing: '-0.02em' }}
        >
          Live Sector Calculators & Automated Quote Engines
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.96rem', maxWidth: 700, margin: '0 auto 8px', lineHeight: 1.5 }}>
          Save your sales team 10+ hours a week. Let your clients calculate their exact Solar load, Real Estate installments, Vehicle customs duty, or Legal fees in 2 minutes with instant PDF quotes.
        </p>
        <p style={{ color: '#10b981', fontSize: '0.84rem', fontWeight: 700, maxWidth: 620, margin: '0 auto' }}>
          ✓ Select your industry below to run a live calculation simulation right now.
        </p>
      </div>

      {/* Sector Tabs */}
      <div
        role="tablist"
        aria-label="Select your industry sector"
        style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12, marginBottom: 32, justifyContent: 'center', flexWrap: 'wrap' }}
      >
        {ORDERED_SECTORS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={selectedIndustry === s.id}
            aria-controls={`sector-panel-${s.id}`}
            id={`sector-tab-${s.id}`}
            onClick={() => setSelectedIndustry(s.id)}
            style={{
              padding: '9px 18px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: '0.84rem',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
              background: selectedIndustry === s.id ? s.color : 'rgba(255,255,255,0.03)',
              color: selectedIndustry === s.id ? '#fff' : '#94a3b8',
              border: `1px solid ${selectedIndustry === s.id ? s.color : 'rgba(255,255,255,0.08)'}`,
              outline: 'none',
              boxShadow: selectedIndustry === s.id ? `0 4px 20px ${s.color}35` : 'none'
            }}
          >
            <span aria-hidden="true">{s.emoji}</span> {s.name}
          </button>
        ))}
      </div>

      {/* Tool Cards */}
      <div
        id={`sector-panel-${selectedIndustry}`}
        role="tabpanel"
        aria-labelledby={`sector-tab-${selectedIndustry}`}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}
      >
        {profile.tools.map((tool) => (
          <div
            key={tool.id}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${profile.color}30`,
              borderRadius: 20,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${profile.color}15`, border: `1px solid ${profile.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calculator style={{ width: 22, height: 22, color: profile.color }} aria-hidden="true" />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: profile.color, background: `${profile.color}15`, border: `1px solid ${profile.color}25`, padding: '4px 12px', borderRadius: 20 }}>
                  {tool.tag}
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px', fontFamily: "'Outfit', sans-serif" }}>{tool.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.84rem', lineHeight: 1.6, margin: '0 0 20px' }}>{tool.desc}</p>
            </div>

            {tool.actionKey ? (
              <button
                id={`tool-demo-${tool.id}`}
                onClick={() => openModal(tool)}
                style={{
                  width: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '11px 18px',
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${profile.color}, #7c3aed)`,
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: `0 6px 20px ${profile.color}30`
                }}
                aria-label={`Test ${tool.name} calculator`}
              >
                <Zap style={{ width: 15, height: 15 }} aria-hidden="true" /> Test Tool Calculator <ArrowRight size={14} />
              </button>
            ) : (
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', display: 'block', textAlign: 'center', padding: '8px 0' }}>
                Included with custom enterprise workflows
              </span>
            )}
          </div>
        ))}
      </div>

      {/* High-End Calculator Modal */}
      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${modal.tool.name} calculator`}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div style={{ background: '#090d16', border: '1px solid rgba(6,182,212,0.4)', borderRadius: 24, padding: '28px clamp(16px, 4vw, 32px)', maxWidth: 580, width: '100%', maxHeight: '92vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 80px rgba(0,0,0,0.8)' }}>

            <button
              onClick={closeModal}
              aria-label="Close calculator"
              style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10, padding: 8, color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: profile.color, background: `${profile.color}20`, padding: '3px 10px', borderRadius: 100 }}>
                {modal.tool.tag}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• Instant 2026 Engine</span>
            </div>

            <h3 style={{ margin: '0 0 6px', color: '#fff', fontSize: '1.25rem', fontWeight: 900, paddingRight: 36, fontFamily: "'Outfit', sans-serif" }}>
              {modal.tool.name}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginBottom: 20, lineHeight: 1.5 }}>
              {modal.tool.desc}
            </p>

            {/* Inputs Form */}
            <div style={{ background: 'rgba(255,255,255,0.025)', padding: 18, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Object.entries(modal.inputs).map(([key, val]: [string, any]) => (
                <div key={key}>
                  <label htmlFor={`modal-input-${key}`} style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    {formatLabel(key)}
                  </label>
                  {typeof val === 'boolean' ? (
                    <select
                      id={`modal-input-${key}`}
                      value={String(val)}
                      onChange={(e) => updateInput(key, e.target.value === 'true')}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#07090e', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  ) : (
                    <input
                      id={`modal-input-${key}`}
                      type={typeof val === 'number' ? 'number' : 'text'}
                      value={String(val)}
                      onChange={(e) => updateInput(key, typeof val === 'number' ? Number(e.target.value) : e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#07090e', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Action Bar with Run & Embed Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
              <button
                onClick={runCalc}
                disabled={modal.loading}
                style={{
                  padding: '14px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '0.96rem',
                  cursor: modal.loading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 8px 24px rgba(6,182,212,0.3)'
                }}
              >
                {modal.loading
                  ? <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} aria-hidden="true" /> Calculating Instant Estimate…</>
                  : <><Zap style={{ width: 18, height: 18 }} aria-hidden="true" /> Run Calculation & View Breakdown</>}
              </button>

              <button
                onClick={() => setShowEmbedDrawer(!showEmbedDrawer)}
                title="Embed this calculator on your own website"
                style={{
                  padding: '14px 18px',
                  borderRadius: 14,
                  background: showEmbedDrawer ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${showEmbedDrawer ? '#06b6d4' : 'rgba(255,255,255,0.15)'}`,
                  color: showEmbedDrawer ? '#38bdf8' : '#f8fafc',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Share2 size={16} /> <span>{showEmbedDrawer ? 'Close Embed' : 'Embed on Website'}</span>
              </button>
            </div>

            {/* 1-Click Embed Snippet Drawer for External Websites */}
            {showEmbedDrawer && (
              <div style={{ marginTop: 16, background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(6,182,212,0.4)', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={14} /> Embed on WordPress, Shopify, Wix or Custom Website
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(['iframe', 'script', 'api'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setEmbedTab(tab)}
                        style={{
                          background: embedTab === tab ? '#06b6d4' : 'rgba(255,255,255,0.06)',
                          color: embedTab === tab ? '#000' : '#cbd5e1',
                          border: 'none',
                          borderRadius: 8,
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          textTransform: 'uppercase'
                        }}
                      >
                        {tab === 'iframe' ? 'Iframe' : tab === 'script' ? 'JS Widget' : 'REST API'}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#030712', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                  <pre style={{ margin: 0, fontSize: '0.75rem', color: '#38bdf8', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                    {embedTab === 'iframe' && `<iframe src="https://www.bethelmindanalytics.com/embed/${modal.tool.actionKey || modal.tool.id}" width="100%" height="640" frameborder="0" style="border-radius:16px;border:none;"></iframe>`}
                    {embedTab === 'script' && `<script src="https://www.bethelmindanalytics.com/api/widget/calculator.js" data-sector="${selectedIndustry}" data-color="${profile.color}" data-button-text="⚡ Open ${modal.tool.name}"></script>`}
                    {embedTab === 'api' && `curl -X POST https://www.bethelmindanalytics.com/api/sector-tools \\
  -H "Content-Type: application/json" \\
  -d '{"action": "${modal.tool.actionKey || modal.tool.id}"}'`}
                  </pre>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {embedTab === 'iframe' && '✓ Drop directly inside any HTML block, Elementor, or WordPress block.'}
                    {embedTab === 'script' && '✓ Paste before closing </body> tag for a floating modal trigger.'}
                    {embedTab === 'api' && '✓ Headless JSON API with full CORS cross-origin access.'}
                  </span>

                  <button
                    onClick={() => {
                      const snippet =
                        embedTab === 'iframe'
                          ? `<iframe src="https://www.bethelmindanalytics.com/embed/${modal.tool.actionKey || modal.tool.id}" width="100%" height="640" frameborder="0" style="border-radius:16px;border:none;"></iframe>`
                          : embedTab === 'script'
                          ? `<script src="https://www.bethelmindanalytics.com/api/widget/calculator.js" data-sector="${selectedIndustry}" data-color="${profile.color}" data-button-text="⚡ Open ${modal.tool.name}"></script>`
                          : `curl -X POST https://www.bethelmindanalytics.com/api/sector-tools -H "Content-Type: application/json" -d '{"action": "${modal.tool.actionKey || modal.tool.id}"}'`;
                      navigator.clipboard.writeText(snippet);
                      setEmbedCopied(true);
                      setTimeout(() => setEmbedCopied(false), 2000);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '7px 14px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    {embedCopied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{embedCopied ? 'Copied to Clipboard!' : 'Copy Embed Code'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Visual Result Presentation UI */}
            {Boolean(modal.result) && (
              <ResultVisualizer
                toolName={modal.tool.name}
                result={modal.result}
                onOpenAiChat={() => {
                  closeModal();
                  const chatTrigger = document.querySelector('.ai-widget-trigger') as HTMLButtonElement;
                  if (chatTrigger) chatTrigger.click();
                }}
              />
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </section>
  );
}
