import { NextRequest, NextResponse } from 'next/server';
import {
  generateSolarBOQ,
  calculateDieselVsSolarROI,
  calculateCustomsDutyTokunbo,
  calculateCacFilingFees,
  buildWhatsAppCartOrderUrl,
  calculateGridVsSolarHybridEconomics,
  calculatePortClearingOptions,
  decodeVinDetails,
  checkCacNameAvailability,
  generateLegalContractTemplate,
  calculateSchoolTuitionAndPin,
  calculateMortgageAmortization,
  calculateLogisticsDeliveryFee,
  calculateHmoCoPayAndTelehealth,
  calculateEventVenueAndCateringQuote,
  generateVirtualAccountDva,
  verifyNigerianIdentityTrust,
  calculateFxInflationPriceAdjuster,
  formatNigerianAiOutreachTone,
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
} from '@/lib/sectorModules';
import { SECTOR_PROFILES } from '@/config/sectors';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-API-Key',
};

/** OPTIONS /api/sector-tools — CORS preflight handler for external websites */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

/** GET /api/sector-tools — Returns comprehensive catalog of all 16 sectors and 48 tool engines */
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      service: 'Bethelmind Analytics / ApexReach Sector Engines API',
      version: '2026.1',
      totalSectors: Object.keys(SECTOR_PROFILES).length,
      sectors: SECTOR_PROFILES,
    },
    { headers: CORS_HEADERS }
  );
}

/** POST /api/sector-tools — Execute sector calculation engine */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'solar_boq') {
      const { kva, batteryType, backupHours } = body;
      const result = generateSolarBOQ(Number(kva || 5), batteryType || 'lithium', Number(backupHours || 12));
      return NextResponse.json({ success: true, result });
    }

    if (action === 'diesel_roi') {
      const { monthlyDieselLiters, pricePerLiter } = body;
      const result = calculateDieselVsSolarROI(Number(monthlyDieselLiters || 200), Number(pricePerLiter || 1350));
      return NextResponse.json({ success: true, result });
    }

    if (action === 'solar_hybrid_economics') {
      const { discoBand, kva, monthlyDieselLiters, pricePerLiter } = body;
      const result = calculateGridVsSolarHybridEconomics(
        discoBand || 'Band A',
        Number(kva || 5),
        Number(monthlyDieselLiters || 250),
        Number(pricePerLiter || 1350)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'tokunbo_duty') {
      const { year, engineCc, cifNgn } = body;
      const result = calculateCustomsDutyTokunbo(Number(year || 2018), Number(engineCc || 2500), Number(cifNgn || 8500000));
      return NextResponse.json({ success: true, result });
    }

    if (action === 'tokunbo_port_clearing') {
      const { year, engineCc, cifNgn, preferredPort } = body;
      const result = calculatePortClearingOptions(
        Number(year || 2018),
        Number(engineCc || 2500),
        Number(cifNgn || 8500000),
        preferredPort || 'Tin Can'
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'vin_decoder') {
      const { vin } = body;
      const result = decodeVinDetails(vin || '1HGCR2F83JA000000');
      return NextResponse.json({ success: true, result });
    }

    if (action === 'cac_fees') {
      const { entityType, shareCapital } = body;
      const result = calculateCacFilingFees(entityType || 'company_ltd', Number(shareCapital || 1000000));
      return NextResponse.json({ success: true, result });
    }

    if (action === 'cac_name_check') {
      const { proposedName } = body;
      const result = checkCacNameAvailability(proposedName || 'APEXREACH TECHNOLOGIES');
      return NextResponse.json({ success: true, result });
    }

    if (action === 'legal_contract_template') {
      const { contractType, partyA, partyB, termsValueNgn } = body;
      const result = generateLegalContractTemplate(
        contractType || 'memart',
        partyA || 'ApexReach Client',
        partyB || 'Partner Enterprise',
        Number(termsValueNgn || 500000)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'school_tuition') {
      const { gradeLevel, isBoarder, termCount } = body;
      const result = calculateSchoolTuitionAndPin(gradeLevel || 'JSS 1', Boolean(isBoarder), Number(termCount || 3));
      return NextResponse.json({ success: true, result });
    }

    if (action === 'mortgage_amortization') {
      const { propertyPriceNgn, downPaymentPercent, interestRatePercent, tenureYears } = body;
      const result = calculateMortgageAmortization(
        Number(propertyPriceNgn || 45000000),
        Number(downPaymentPercent || 20),
        Number(interestRatePercent || 18),
        Number(tenureYears || 10)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'logistics_delivery') {
      const { originCity, destinationCity, weightKg } = body;
      const result = calculateLogisticsDeliveryFee(originCity || 'Lagos', destinationCity || 'Abuja', Number(weightKg || 5));
      return NextResponse.json({ success: true, result });
    }

    if (action === 'healthcare_hmo') {
      const { hmoProvider, procedureName, totalProcedureCostNgn } = body;
      const result = calculateHmoCoPayAndTelehealth(
        hmoProvider || 'Reliance HMO',
        procedureName || 'Dental Scaling & Polishing',
        Number(totalProcedureCostNgn || 35000)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'event_catering_quote') {
      const { guestCount, hallTier, menuTierPerHead } = body;
      const result = calculateEventVenueAndCateringQuote(
        Number(guestCount || 200),
        hallTier || 'standard',
        Number(menuTierPerHead || 4500)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'virtual_account_dva') {
      const { merchantName, amountNgn, customerName } = body;
      const result = generateVirtualAccountDva(merchantName || 'ApexReach Store', Number(amountNgn || 25000), customerName || 'Customer');
      return NextResponse.json({ success: true, result });
    }

    if (action === 'nigerian_identity_trust') {
      const { rcNumber, tinNumber } = body;
      const result = verifyNigerianIdentityTrust(rcNumber || 'RC-1849204', tinNumber || 'TIN-29401948');
      return NextResponse.json({ success: true, result });
    }

    if (action === 'fx_inflation_adjuster') {
      const { baseUsdCost, parallelFxRateNgn, inflationBufferPercent } = body;
      const result = calculateFxInflationPriceAdjuster(
        Number(baseUsdCost || 100),
        Number(parallelFxRateNgn || 1580),
        Number(inflationBufferPercent || 5)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'nigerian_ai_tone') {
      const { businessName, leadName, tone } = body;
      const result = formatNigerianAiOutreachTone(businessName || 'ApexReach', leadName || 'Chief', tone || 'friendly');
      return NextResponse.json({ success: true, result });
    }

    if (action === 'whatsapp_cart') {
      const { merchantPhone, customerName, items, deliveryArea } = body;
      const url = buildWhatsAppCartOrderUrl(merchantPhone || '08012345678', customerName || 'Valued Customer', items || [], deliveryArea || 'Lagos');
      return NextResponse.json({ success: true, url });
    }

    if (action === 'recruitment_grade_cv') {
      const { evaluateCvGrade } = await import('@/lib/recruitmentEngine');
      const { jobRequirements, candidate } = body;
      const result = evaluateCvGrade(
        jobRequirements || { requiredSkills: ['Solar Inverter Sizing', 'Lithium Battery Storage'], minYearsExp: 3, title: 'Senior Solar Installer' },
        candidate || { yearsExperience: 4, skills: ['Solar Inverter Sizing', 'Lithium Battery Storage', 'High Voltage Wiring'], cvText: '5 years managing 10kVA solar inverter systems in Lekki Lagos.' }
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'social_ad_creator') {
      const { businessName, industry, targetDistrict } = body;
      const bName = businessName || 'Apex Business';
      const ind = industry || 'Solar';
      const dist = targetDistrict || 'Lekki Phase 1';

      const result = {
        platform: 'Meta Ads (Instagram & Facebook Lead Ads)',
        adHeadline: `⚡ Get Instant ${ind} Quote in ${dist} — 24/7 AI Automation`,
        primaryAdText: `🚨 Attention ${dist} Business Owners & Residents!\nStop losing customers to slow replies. ${bName} provides premium ${ind} solutions with instant WhatsApp quotes & 24-hr installation.`,
        hookLine: `Looking for reliable ${ind} in ${dist}? Get an instant quote on WhatsApp now! 📲`,
        callToAction: 'Send WhatsApp Message',
        targetAudience: {
          location: `Lagos, Nigeria (${dist} + 15km radius)`,
          ageRange: '25 - 55',
          interests: [ind, 'Small Business Owners', 'Lagos Property', 'Corporate Procurement'],
          deviceTargeting: 'Mobile (Android & iOS)'
        },
        automationWorkflow: [
          '1. Prospect clicks Instagram/Facebook Ad CTA button',
          '2. Meta Lead Form captures Name, Phone & WhatsApp details',
          '3. Webhook triggers instant 3-second WhatsApp greeting with recipient name',
          '4. Lead automatically added to Simple CRM Kanban Board'
        ]
      };
      return NextResponse.json({ success: true, result });
    }

    if (action === 'lpg_skid_audit') {
      const { dailyKgInflow, kgSold, cashCollectedNgn, pricePerKgNgn } = body;
      const result = calculateLpgSkidAudit(
        Number(dailyKgInflow || 1250),
        Number(kgSold || 1180),
        Number(cashCollectedNgn || 1416000),
        Number(pricePerKgNgn || 1250)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'haulage_trip_expense') {
      const { originCity, destinationCity, tonnage, dieselLitersAllocated, dieselPricePerLiter } = body;
      const result = calculateHaulageTripExpense(
        originCity || 'Lagos (Apapa)',
        destinationCity || 'Kano (Dawanau)',
        Number(tonnage || 30),
        Number(dieselLitersAllocated || 450),
        Number(dieselPricePerLiter || 1350)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'micro_loan_schedule') {
      const { principalNgn, monthlyInterestPercent, tenureMonths, directDebitFeeNgn } = body;
      const result = calculateMicroLoanSchedule(
        Number(principalNgn || 500000),
        Number(monthlyInterestPercent || 5),
        Number(tenureMonths || 6),
        Number(directDebitFeeNgn || 1500)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'agro_poultry_yield') {
      const { flockSize, mortalityCount, feedBagsConsumed, cratesCollected } = body;
      const result = calculateAgroPoultryYield(
        Number(flockSize || 2000),
        Number(mortalityCount || 4),
        Number(feedBagsConsumed || 5),
        Number(cratesCollected || 54)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'cold_room_spoilage') {
      const { coldRoomCapacityTons, dailyGenHours, dieselPricePerLiter } = body;
      const result = calculateColdRoomSpoilageAndPowerCost(
        Number(coldRoomCapacityTons || 10),
        Number(dailyGenHours || 14),
        Number(dieselPricePerLiter || 1350)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'shortlet_booking') {
      const { nightlyRateNgn, nightsCount, cautionDepositNgn, estimatedKwhPerDay } = body;
      const result = calculateShortletBookingAndCaution(
        Number(nightlyRateNgn || 85000),
        Number(nightsCount || 3),
        Number(cautionDepositNgn || 50000),
        Number(estimatedKwhPerDay || 35)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'event_hall_booking') {
      const { guestCapacity, includeDecorAndCatering, hallTier } = body;
      const result = calculateEventHallBookingAndDecor(
        Number(guestCapacity || 300),
        Boolean(includeDecorAndCatering ?? true),
        hallTier || 'standard'
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'container_demurrage') {
      const { containerType, shippingLine, dischargeDaysAgo, freeDays, dailyDemurrageUsd, fxRateNgn } = body;
      const result = calculateContainerDemurrage(
        containerType || '40ft High Cube',
        shippingLine || 'Maersk Line',
        Number(dischargeDaysAgo || 12),
        Number(freeDays || 7),
        Number(dailyDemurrageUsd || 85),
        Number(fxRateNgn || 1580)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'cbt_exam_scoring') {
      const { objectiveScore, maxObjective, ca1Score, ca2Score } = body;
      const result = calculateCbtExamScoring(
        Number(objectiveScore || 48),
        Number(maxObjective || 60),
        Number(ca1Score || 18),
        Number(ca2Score || 17)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'report_card_broadsheet') {
      const { studentClassSize, termlySubjectCount, studentTotalScore } = body;
      const result = calculateReportCardBroadsheet(
        Number(studentClassSize || 42),
        Number(termlySubjectCount || 9),
        Number(studentTotalScore || 748)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'result_pin_generator') {
      const { batchQuantity, unitPriceNgn, termLabel } = body;
      const result = calculateResultCheckerPins(
        Number(batchQuantity || 500),
        Number(unitPriceNgn || 2500),
        termLabel || '2nd Term 2026'
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'machinery_lease_expense') {
      const { machineType, operatingHours, leaseType, dieselPricePerLiter } = body;
      const result = calculateMachineryLeaseExpense(
        machineType || 'cat_320_excavator',
        Number(operatingHours || 8),
        leaseType || 'wet',
        Number(dieselPricePerLiter || 1350)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'security_patrol_gate_pass') {
      const { residentUnits, guardCount, nfcCheckpointCount, dailyVisitorCount } = body;
      const result = calculateSecurityPatrolAndGatePass(
        Number(residentUnits || 180),
        Number(guardCount || 8),
        Number(nfcCheckpointCount || 12),
        Number(dailyVisitorCount || 95)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'hmo_claims_reconciler') {
      const { hmoProvider, procedureName, standardTariffNgn, isSecondaryProcedure, hasAuthCode } = body;
      const result = calculateHmoClaimsAndAuthCode(
        hmoProvider || 'Reliance HMO',
        procedureName || 'Minor Surgical Wound Debridement',
        Number(standardTariffNgn || 45000),
        Boolean(isSecondaryProcedure),
        Boolean(hasAuthCode ?? true)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'surgery_deposit_sizer') {
      const { surgeryType, admissionDays, wardTier } = body;
      const result = calculateSurgeryAndAdmissionDeposit(
        surgeryType || 'caesarean_section',
        Number(admissionDays || 3),
        wardTier || 'semi_private'
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'diagnostic_lab_package') {
      const { packageType, isFastingRequired, includeHomeSamplePickup } = body;
      const result = calculateDiagnosticLabPackage(
        packageType || 'executive_wellness',
        Boolean(isFastingRequired ?? true),
        Boolean(includeHomeSamplePickup)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'pharmacy_fefo_audit') {
      const { totalInventoryValueNgn, nearExpiryRatioPercent, averageMonthlySalesNgn } = body;
      const result = calculatePharmacyFefoExpiryAudit(
        Number(totalInventoryValueNgn || 4500000),
        Number(nearExpiryRatioPercent || 8),
        Number(averageMonthlySalesNgn || 1800000)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'estate_plot_allocation') {
      const { plotSizeSqm, basePricePerSqmNgn, isCommercialCornerPiece, estateLocation } = body;
      const result = calculateEstatePlotAllocation(
        Number(plotSizeSqm || 500),
        Number(basePricePerSqmNgn || 45000),
        Boolean(isCommercialCornerPiece),
        estateLocation || 'epe_ibeju'
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'realtor_commission_ledger') {
      const { propertyPriceNgn, realtorTier, includeUplineOverride } = body;
      const result = calculateRealtorCommissionLedger(
        Number(propertyPriceNgn || 45000000),
        realtorTier || 'gold_10',
        Boolean(includeUplineOverride ?? true)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'diaspora_property_escrow') {
      const { propertyPriceNgn, currency, parallelFxRateNgn, finishType } = body;
      const result = calculateDiasporaPropertyEscrow(
        Number(propertyPriceNgn || 85000000),
        currency || 'USD',
        Number(parallelFxRateNgn || 1580),
        finishType || 'fully_finished'
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'car_swap_valuation') {
      const { currentCarValueNgn, mileageKm, bodyPaintCondition, engineAcCondition, targetUpgradeCarPriceNgn } = body;
      const result = calculateCarSwapValuation(
        Number(currentCarValueNgn || 6500000),
        Number(mileageKm || 145000),
        bodyPaintCondition || 'first_body_clean',
        engineAcCondition || 'untouched_chilling_ac',
        Number(targetUpgradeCarPriceNgn || 18500000)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'auto_consignment_profit') {
      const { investorReservePriceNgn, showroomSalePriceNgn, holdingDaysCount, repairAndWashExpenseNgn } = body;
      const result = calculateAutoConsignmentProfit(
        Number(investorReservePriceNgn || 14000000),
        Number(showroomSalePriceNgn || 15800000),
        Number(holdingDaysCount || 21),
        Number(repairAndWashExpenseNgn || 85000)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'disco_tariff_solar_roi') {
      const { monthlyGridTokenNgn, monthlyGenFuelNgn, discoBand, solarSystemKva } = body;
      const result = calculateDiscoTariffVsSolarROI(
        Number(monthlyGridTokenNgn || 180000),
        Number(monthlyGenFuelNgn || 240000),
        discoBand || 'band_a',
        Number(solarSystemKva || 10)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'lithium_battery_sizing') {
      const { dailyEnergyDemandKwh, hasInverterAc, hasSumoWaterPump } = body;
      const result = calculateLithiumBatterySizing(
        Number(dailyEnergyDemandKwh || 18),
        Boolean(hasInverterAc ?? true),
        Boolean(hasSumoWaterPump ?? true)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'grain_moisture_discount') {
      const { commodityType, grossWeightTons, measuredMoisturePercent, basePricePerTonNgn } = body;
      const result = calculateGrainMoistureDiscount(
        commodityType || 'yellow_maize',
        Number(grossWeightTons || 30),
        Number(measuredMoisturePercent || 17.5),
        Number(basePricePerTonNgn || 680000)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'scuml_cac_compliance_audit') {
      const { entityType, unfiledYearsCount, hasScumlCertificate, requiresTaxClearance } = body;
      const result = calculateScumlAndCacCompliance(
        entityType || 'company_ltd',
        Number(unfiledYearsCount || 3),
        Boolean(hasScumlCertificate),
        Boolean(requiresTaxClearance ?? true)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'legal_retainer_debit_note') {
      const { retainerTier, associateHours, partnerHours, courtAppearanceCount } = body;
      const result = calculateLegalRetainerAndDebitNote(
        retainerTier || 'standard_corporate',
        Number(associateHours || 12),
        Number(partnerHours || 4),
        Number(courtAppearanceCount || 2)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'pod_dispatch_cash_reconciler') {
      const { totalOrdersDispatched, averageOrderValueNgn, rtoReturnRatePercent, deliveryFeePerOrderNgn, riderCashCollectedNgn } = body;
      const result = calculatePodDispatchAndRemittance(
        Number(totalOrdersDispatched || 85),
        Number(averageOrderValueNgn || 28500),
        Number(rtoReturnRatePercent || 22),
        Number(deliveryFeePerOrderNgn || 3500),
        Number(riderCashCollectedNgn || 1750000)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'boutique_stock_shrinkage') {
      const { posBookInventoryValueNgn, physicalCountInventoryValueNgn, monthlySalesRevenueNgn } = body;
      const result = calculateBoutiqueStockShrinkage(
        Number(posBookInventoryValueNgn || 8500000),
        Number(physicalCountInventoryValueNgn || 7920000),
        Number(monthlySalesRevenueNgn || 3800000)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'tanker_discharge_variance') {
      const { productType, waybillLiters, dischargedLiters, allowableShrinkagePercent, pumpPricePerLiterNgn } = body;
      const result = calculateTankerDischargeVariance(
        productType || 'pms_petrol',
        Number(waybillLiters || 33000),
        Number(dischargedLiters || 32450),
        Number(allowableShrinkagePercent || 0.3),
        Number(pumpPricePerLiterNgn || 1050)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'ust_water_ingress_pump_audit') {
      const { tankCapacityLiters, waterCutCm, openingDipLiters, closingDipLiters, totalizerSalesLiters, cashCollectedNgn, pricePerLiterNgn } = body;
      const result = calculateUstWaterAndPumpAudit(
        Number(tankCapacityLiters || 45000),
        Number(waterCutCm || 3.5),
        Number(openingDipLiters || 38000),
        Number(closingDipLiters || 29500),
        Number(totalizerSalesLiters || 8200),
        Number(cashCollectedNgn || 8400000),
        Number(pricePerLiterNgn || 1050)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'interstate_union_road_tax') {
      const { routeCorridor, truckType, includesQuarantineAndProduce } = body;
      const result = calculateInterstateUnionRoadTax(
        routeCorridor || 'lagos_kano',
        truckType || '30_ton_trailer',
        Boolean(includesQuarantineAndProduce ?? true)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'gps_diesel_mileage_audit') {
      const { tripDistanceKm, dieselLitersAllocated, truckTonnage, dieselPricePerLiterNgn } = body;
      const result = calculateGpsDieselMileageAudit(
        Number(tripDistanceKm || 1020),
        Number(dieselLitersAllocated || 480),
        truckTonnage || '30_ton',
        Number(dieselPricePerLiterNgn || 1350)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'esusu_thrift_passbook_audit') {
      const { dailyContributionNgn, contributorsCount, cycleDays, actualCashRemittedNgn } = body;
      const result = calculateEsusuThriftPassbook(
        Number(dailyContributionNgn || 3000),
        Number(contributorsCount || 80),
        Number(cycleDays || 31),
        Number(actualCashRemittedNgn || 7200000)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'salary_remita_loan_sizer') {
      const { netMonthlySalaryNgn, existingMonthlyDeductionsNgn, loanTenureMonths, monthlyInterestRatePercent } = body;
      const result = calculateSalaryRemitaLoanEligibility(
        Number(netMonthlySalaryNgn || 350000),
        Number(existingMonthlyDeductionsNgn || 25000),
        Number(loanTenureMonths || 6),
        Number(monthlyInterestRatePercent || 4.5)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'shortlet_caution_power_recon') {
      const { nightlyRateNgn, nightsCount, cautionDepositNgn, dailyKwhAllowance, actualKwhConsumed, damagesReportedNgn, discoRatePerKwhNgn } = body;
      const result = calculateShortletCautionAndPowerReconciliation(
        Number(nightlyRateNgn || 110000),
        Number(nightsCount || 4),
        Number(cautionDepositNgn || 60000),
        Number(dailyKwhAllowance || 35),
        Number(actualKwhConsumed || 210),
        Number(damagesReportedNgn || 12000),
        Number(discoRatePerKwhNgn || 209.5)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'event_hall_overtime_sizer') {
      const { hallTier, guestCapacity, baseHallFeeNgn, cautionBondNgn, overtimeHours, includeSanitization } = body;
      const result = calculateEventCenterOvertimeAndCaution(
        hallTier || 'standard',
        Number(guestCapacity || 600),
        Number(baseHallFeeNgn || 2200000),
        Number(cautionBondNgn || 250000),
        Number(overtimeHours || 2.5),
        Boolean(includeSanitization ?? true)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'paar_customs_duty_sizer') {
      const { cifValueUsd, customsFxRateNgn, dutyRatePercent, applyNacLevy, terminalHandlingNgn } = body;
      const result = calculatePaarCustomsAssessment(
        Number(cifValueUsd || 28000),
        Number(customsFxRateNgn || 1550),
        Number(dutyRatePercent || 20),
        Boolean(applyNacLevy ?? true),
        Number(terminalHandlingNgn || 450000)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'container_deposit_refund_tracker') {
      const { containerCount, depositPerContainerNgn, returnDaysFromDischarge, freeDaysAllowed, containerCondition } = body;
      const result = calculateContainerDepositRefund(
        Number(containerCount || 3),
        Number(depositPerContainerNgn || 450000),
        Number(returnDaysFromDischarge || 24),
        Number(freeDaysAllowed || 14),
        containerCondition || 'clean_intact'
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'quarry_weighbridge_sizer') {
      const { aggregateType, truckTonnage, haulageDistanceKm, truckTripsCount } = body;
      const result = calculateQuarryWeighbridgeDispatch(
        aggregateType || 'three_quarter',
        Number(truckTonnage || 30),
        Number(haulageDistanceKm || 45),
        Number(truckTripsCount || 4)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'concrete_structural_sizer') {
      const { slabAreaSqm, slabThicknessMeters, cementPricePerBagNgn, includeRebarReinforcement } = body;
      const result = calculateConcreteStructuralMix(
        Number(slabAreaSqm || 250),
        Number(slabThicknessMeters || 0.15),
        Number(cementPricePerBagNgn || 9500),
        Boolean(includeRebarReinforcement ?? true)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'security_guard_roster_sizer') {
      const { perimeterCheckpoints, patrolFrequencyHours, guardShiftsCount, dailyGuardHeadcount, guardMonthlySalaryNgn } = body;
      const result = calculateSecurityGuardRosterAndPatrol(
        Number(perimeterCheckpoints || 16),
        Number(patrolFrequencyHours || 0.5),
        Number(guardShiftsCount || 2),
        Number(dailyGuardHeadcount || 6),
        Number(guardMonthlySalaryNgn || 65000)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'estate_visitor_pass_capacity') {
      const { residentHousesCount, averageVisitorsPerHouseWeekly, estateGateLanes, monthlyIntercomLevyPerHouseNgn } = body;
      const result = calculateEstateVisitorPassCapacity(
        Number(residentHousesCount || 220),
        Number(averageVisitorsPerHouseWeekly || 6),
        Number(estateGateLanes || 2),
        Number(monthlyIntercomLevyPerHouseNgn || 2500)
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'b2b_proforma_invoice_sizer') {
      const { servicesSubtotalNgn, applyVat75Percent, applyWht5Percent, deliveryOrReimbursableNgn } = body;
      const result = calculateB2bProformaInvoice(
        Number(servicesSubtotalNgn || 3500000),
        Boolean(applyVat75Percent ?? true),
        Boolean(applyWht5Percent ?? true),
        Number(deliveryOrReimbursableNgn || 120000)
      );
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ success: false, error: 'Unknown action parameter' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

