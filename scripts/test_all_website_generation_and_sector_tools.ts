import { 
  buildSectorWhatsAppQuoteMessage, 
  generateSolarBOQ, 
  calculateDieselVsSolarROI,
  calculateCustomsDutyTokunbo, 
  calculateMortgageAmortization,
  calculateSchoolTuitionAndPin,
  calculateHmoCoPayAndTelehealth,
  calculateLogisticsDeliveryFee,
  calculateCacFilingFees,
  calculateShortletBookingAndCaution,
  calculateGridVsSolarHybridEconomics,
  decodeVinDetails
} from '../src/lib/sectorModules';

import { detectCategoryTab } from '../src/components/SectorToolsWidget';
import { getDesignTheme, buildFallbackCopy } from '../src/lib/designGenerator';

console.log('================================================================');
console.log('🏁 COMPREHENSIVE END-TO-END TEST: WEBSITE GENERATION & SECTOR SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, details?: any) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] ${testName}`, details || '');
    failCount++;
  }
}

// ----------------------------------------------------------------------------
// TEST SUITE 1: CATEGORY AUTO-DETECTION IN SECTOR TOOLS WIDGET
// ----------------------------------------------------------------------------
console.log('--- TEST SUITE 1: Category Auto-Detection ---');
assert(detectCategoryTab('Solar & Renewable Energy') === 'solar', 'Detects Solar from Category');
assert(detectCategoryTab('Inverter & Battery Systems') === 'solar', 'Detects Solar from Inverter keyword');
assert(detectCategoryTab('Tokunbo Automobile Dealership') === 'auto', 'Detects Auto from Tokunbo');
assert(detectCategoryTab('Car Sales & Mechanic Garage') === 'auto', 'Detects Auto from Car Sales');
assert(detectCategoryTab('Real Estate & Luxury Homes') === 'mortgage', 'Detects Mortgage from Real Estate');
assert(detectCategoryTab('Property Developer & Land Banking') === 'mortgage', 'Detects Mortgage from Property Developer');
assert(detectCategoryTab('Dental Clinic & Healthcare') === 'healthcare', 'Detects Healthcare from Clinic');
assert(detectCategoryTab('Medical Hospital & Pharmacy') === 'healthcare', 'Detects Healthcare from Medical');
assert(detectCategoryTab('High School & International Academy') === 'education', 'Detects Education from School');
assert(detectCategoryTab('Interstate Logistics & Haulage') === 'logistics', 'Detects Logistics from Haulage');
assert(detectCategoryTab('Corporate Law Firm & Legal Chambers') === 'legal', 'Detects Legal from Law Firm');
assert(detectCategoryTab('Luxury Shortlet Apartments & Hospitality') === 'hospitality', 'Detects Hospitality from Shortlet');
assert(detectCategoryTab('Unknown SME Services') === 'solar', 'Fallback default to solar for unknown SME');

// ----------------------------------------------------------------------------
// TEST SUITE 2: SECTOR CALCULATION ENGINES (DETERMINISTIC NUMBERS)
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 2: Sector Calculation Engines ---');

// 1. Solar BOQ & ROI
const solar = generateSolarBOQ(7.5, 'lithium', 12);
assert(solar.loadKva === 7.5, 'Solar BOQ: Correct load kVA recorded');
assert(solar.recommendedInverterKva >= 7.5, 'Solar BOQ: Inverter sized appropriately for load');
assert(solar.grandTotal > 0 && solar.deposit50Percent === Math.round(solar.grandTotal * 0.5), 'Solar BOQ: 50% deposit equals half grand total');

const dieselRoi = calculateDieselVsSolarROI(300, 1350);
assert(dieselRoi.monthlyDieselCost === 300 * 1350, 'Diesel ROI: Monthly diesel cost math is correct');
assert(dieselRoi.paybackPeriodMonths > 0, 'Diesel ROI: Valid payback period calculated');

// 2. Automotive Duty & VIN
const autoDuty = calculateCustomsDutyTokunbo(2019, 2500, 9000000);
assert(autoDuty.cifValueNgn === 9000000, 'Auto Duty: CIF recorded correctly');
assert(autoDuty.importDuty === 9000000 * 0.20, 'Auto Duty: 20% import duty calculated exactly');
assert(autoDuty.totalCustomsDuty > 0, 'Auto Duty: Total customs duty calculated');
assert(autoDuty.estimatedTotalClearingCost > autoDuty.totalCustomsDuty, 'Auto Duty: Terminal demurrage added to clearance');

const vinDetails = decodeVinDetails('1HGCR2F83JA000000');
assert(Boolean(vinDetails.make && vinDetails.year), 'VIN Decoder: Returns make and year');

// 3. Real Estate Mortgage
const mortgage = calculateMortgageAmortization(50000000, 20, 18, 15);
assert(mortgage.downPaymentNgn === 10000000, 'Mortgage: 20% down payment on ₦50M is exactly ₦10M');
assert(mortgage.monthlyPaymentNgn > 0, 'Mortgage: Monthly installment calculated');

// 4. Healthcare HMO & Telehealth
const health = calculateHmoCoPayAndTelehealth('Reliance HMO', 'Specialist Doctor Consultation', 40000);
assert(health.patientCoPayNgn === 8000, 'Health HMO: 20% co-pay on ₦40k procedure is ₦8,000');
assert(health.hmoCoverageNgn === 32000, 'Health HMO: 80% coverage is ₦32,000');
assert(health.telehealthConsultationUrl.startsWith('https://'), 'Health HMO: Valid Telehealth URL generated');

// 5. Education Tuition & Result PIN
const school = calculateSchoolTuitionAndPin('SSS 3', true, 3);
assert(school.termlyTuitionNgn === 185000, 'School Tuition: SSS tuition is ₦185,000');
assert(school.boardingFeeNgn === 220000, 'School Tuition: Boarding fee included when isBoarder=true');
assert(school.annualCostNgn === school.totalTermlyCostNgn * 3, 'School Tuition: Annual cost is 3x termly total');

// 6. Logistics & Freight
const logistics = calculateLogisticsDeliveryFee('Lagos', 'Abuja', 15);
assert(logistics.interStateWaybillFeeNgn > logistics.intraCityCourierFeeNgn, 'Logistics: Interstate waybill cost exceeds local courier');

// 7. Legal CAC & Stamp Duty
const legal = calculateCacFilingFees('company_ltd', 2000000);
assert(legal.cacFilingFee >= 10000, 'Legal CAC: Statutory filing fee calculated');
assert(legal.totalCost > legal.cacFilingFee, 'Legal CAC: Total statutory cost includes stamp duty');

// 8. Hospitality Shortlet
const shortlet = calculateShortletBookingAndCaution(80000, 4, 35000);
assert(shortlet.accommodationSubtotalNgn === 320000, 'Shortlet: 4 nights @ ₦80k = ₦320,000');
assert(shortlet.grandTotalNgn === 320000 + 35000, 'Shortlet: Grand total includes caution deposit');


// ----------------------------------------------------------------------------
// TEST SUITE 3: WHATSAPP QUOTE MESSAGE BUILDER
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 3: WhatsApp Pre-filled Quote Links ---');
const waUrl = buildSectorWhatsAppQuoteMessage(
  'Alpha Solar Energy',
  'Solar & Renewable Energy',
  '5kVA Hybrid Solar BOQ',
  'Total: ₦4,500,000 (Deposit: ₦2,250,000)',
  '2348022791227'
);
assert(waUrl.startsWith('https://wa.me/2348022791227?text='), 'WhatsApp URL points to Admin desk 2348022791227');
assert(waUrl.includes(encodeURIComponent('Alpha Solar Energy')), 'WhatsApp URL encodes Business Name');
assert(waUrl.includes(encodeURIComponent('5kVA Hybrid Solar BOQ')), 'WhatsApp URL encodes Tool Name');
assert(waUrl.includes(encodeURIComponent('4,500,000')), 'WhatsApp URL encodes calculated quotation figures');
assert(!waUrl.toLowerCase().includes('crypto') && !waUrl.toLowerCase().includes('usdt'), 'WhatsApp URL is 100% Zero-Crypto compliant');

// ----------------------------------------------------------------------------
// TEST SUITE 4: DUAL-AUDIENCE OFFER COPYWRITING IN DESIGN GENERATOR
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 4: Dual-Audience Offer Copywriting ---');

// Test Case A: No-Website Lead (Tier A DFY Website ₦75k/₦150k)
const noWebLead = { name: 'Ikeja Solar Dynamics', category: 'Solar Energy', area: 'Ikeja', website: '' };
const noWebCopy = buildFallbackCopy(noWebLead);
assert(noWebCopy.ctaText.includes('₦75k Deposit'), 'No-website lead receives ₦75k DFY Deposit CTA');
assert(noWebCopy.services.length >= 3, 'Generated 3 tailored high-conversion services');

// Test Case B: Existing Website Lead (Tier B 1-Line Embed Upgrade ₦35k/₦65k)
const hasWebLead = { name: 'Victoria Island Motors', category: 'Automotive & Cars', area: 'Victoria Island', website: 'https://vimotors.com.ng' };
const hasWebCopy = buildFallbackCopy(hasWebLead);
assert(hasWebCopy.ctaText.includes('1-Line Embed Upgrade (₦35,000)'), 'Existing website lead receives ₦35k Embed Upgrade CTA');

// Test Case C: Real Estate Themes & Visual Styling
const realEstateTheme = getDesignTheme('Real Estate & Luxury Homes', 'lekki-homes-99');
assert(Boolean(realEstateTheme.primary && realEstateTheme.heroImage), 'Real estate design theme has luxury palette and hero image');

// ----------------------------------------------------------------------------
// TEST SUMMARY REPORT
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`🏁 TEST EXECUTION COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL INTEGRATED TESTS PASSED WITH 100% DETERMINISTIC FIDELITY!');
}
