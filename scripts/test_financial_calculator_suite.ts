/**
 * @file scripts/test_financial_calculator_suite.ts
 * 
 * COMPREHENSIVE FINANCIAL CALCULATOR SUITE AUDIT & TEST RUNNER.
 * 
 * Tests across 5 container trade tiers to assert 0.00 kobo error:
 * 1. 20ft Small Hardware Container ($35k)
 * 2. 40ft Electronics Container ($50k)
 * 3. 40ft Standard Auto Parts Container ($65k)
 * 4. Dual Container Raw Materials ($90k)
 * 5. Industrial Heavy Equipment / Fleet ($120k)
 */

import { calculateTradeFinancials } from '../src/lib/monetization/financialCalculationGuard';

console.log('========================================================================');
console.log('🧮 RUNNING FINANCIAL CALCULATOR SUITE AUDIT & STRESS TEST');
console.log('========================================================================\n');

const testCases = [
  { label: '20ft Small Hardware Container', volumeUSD: 35000, quoteRate: 1375, wholesaleRate: 1350 },
  { label: '40ft Electronics Container', volumeUSD: 50000, quoteRate: 1375, wholesaleRate: 1350 },
  { label: '40ft Standard Auto Parts Container', volumeUSD: 65000, quoteRate: 1375, wholesaleRate: 1350 },
  { label: 'Dual Container Raw Materials', volumeUSD: 90000, quoteRate: 1375, wholesaleRate: 1350 },
  { label: 'Industrial Heavy Fleet', volumeUSD: 120000, quoteRate: 1375, wholesaleRate: 1350 }
];

let allPassed = true;

for (const t of testCases) {
  const result = calculateTradeFinancials(t.volumeUSD, t.quoteRate, t.wholesaleRate);
  
  // Mathematical Invariant Assertion: wholesaleCost + netProfit === totalNairaDeposit
  const isInvariantValid = (result.wholesaleCostNGN + result.netProfitNGN) === result.totalNairaDepositNGN;
  const isProfitExact = result.netProfitNGN === (t.volumeUSD * (t.quoteRate - t.wholesaleRate));

  if (!isInvariantValid || !isProfitExact) {
    allPassed = false;
    console.error(`❌ FAILED: ${t.label}`);
  } else {
    console.log(`✅ [PASSED]: ${t.label}`);
    console.log(`   📦 Order Volume: $${t.volumeUSD.toLocaleString()} USD`);
    console.log(`   💵 Client Pays (@ ₦${t.quoteRate}/$): ${result.formattedDeposit}`);
    console.log(`   🏦 Wholesale Cost (@ ₦${t.wholesaleRate}/$): ₦${result.wholesaleCostNGN.toLocaleString()} NGN`);
    console.log(`   💰 YOUR SPREAD PROFIT (@ +₦25/$): ${result.formattedProfit}`);
    console.log(`   🛡️ Invariant Check: ${result.wholesaleCostNGN.toLocaleString()} + ${result.netProfitNGN.toLocaleString()} === ${result.totalNairaDepositNGN.toLocaleString()} (0.00 Kobo Error)\n`);
  }
}

if (allPassed) {
  console.log('🏆 ALL 5 FINANCIAL TEST TIERS PASSED WITH 100% DETERMINISTIC PRECISION!');
} else {
  console.error('⚠️ Some calculation tests failed invariant assertions.');
}
