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
} from '@/lib/sectorModules';

export const dynamic = 'force-dynamic';

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

    if (action === 'recruitment_sourcing_help') {
      const { generateSourcingRecommendations } = await import('@/lib/recruitmentEngine');
      const { roleTitle, location, experienceLevel } = body;
      const result = generateSourcingRecommendations(roleTitle || 'Senior Solar Engineer', location || 'Lagos', experienceLevel || 'Senior');
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ success: false, error: 'Unknown action parameter' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

