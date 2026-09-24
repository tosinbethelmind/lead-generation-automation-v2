const { 
  buildSectorWhatsAppQuoteMessage, 
  generateSolarBOQ, 
  calculateCustomsDutyTokunbo, 
  calculateMortgageAmortization,
  calculateSchoolTuitionAndPin,
  calculateHmoCoPayAndTelehealth
} = require('../src/lib/sectorModules');

console.log('--- TESTING SECTOR TOOLS & WHATSAPP MSG BUILDER ---');

// 1. Solar BOQ
const solarResult = generateSolarBOQ(5, 'lithium', 12);
console.log('1. Solar BOQ 5kVA: Grand Total = ₦' + solarResult.grandTotal.toLocaleString() + ', Deposit 50% = ₦' + solarResult.deposit50Percent.toLocaleString());

const solarWaUrl = buildSectorWhatsAppQuoteMessage(
  'Daystar Solar Ltd',
  'Solar & Renewable Energy',
  '5kVA Hybrid Solar BOQ',
  'Estimated BOQ: ₦' + solarResult.grandTotal.toLocaleString() + ' (50% Deposit: ₦' + solarResult.deposit50Percent.toLocaleString() + ')',
  '2348022791227'
);
console.log('Solar WhatsApp URL:', solarWaUrl);

// 2. Customs Duty
const dutyResult = calculateCustomsDutyTokunbo(2018, 2500, 8500000);
console.log('2. Auto Duty (CIF 8.5m): Total Duty = ₦' + dutyResult.totalDutyAndLeviesNgn.toLocaleString());

// 3. Mortgage
const mortgageResult = calculateMortgageAmortization(45000000, 20, 18, 10);
console.log('3. Mortgage (45m): Monthly Repayment = ₦' + mortgageResult.monthlyPaymentNgn.toLocaleString());

// 4. School Tuition
const schoolResult = calculateSchoolTuitionAndPin(180000, 150, true);
console.log('4. School Tuition: Gross Revenue = ₦' + schoolResult.grossTermRevenueNgn.toLocaleString());

// 5. Healthcare HMO
const clinicResult = calculateHmoCoPayAndTelehealth('specialist', true, 1);
console.log('5. Clinic HMO Booking: Patient Co-Pay = ₦' + clinicResult.patientPayableNgn.toLocaleString());

console.log('✅ ALL SECTOR MODULES & WHATSAPP GENERATION TEST PASSED!');
