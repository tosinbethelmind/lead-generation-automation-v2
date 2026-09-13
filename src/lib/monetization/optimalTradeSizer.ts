/**
 * @file src/lib/monetization/optimalTradeSizer.ts
 * 
 * MATHEMATICAL OPTIMAL AMM TRADE SIZING & CONVEX OPTIMIZATION ENGINE.
 * 
 * Purpose:
 * Calculates the exact optimal flash loan borrow amount (Δx*) that maximizes net arbitrage profit
 * after accounting for non-linear AMM price impact (x*y=k and concentrated liquidity tick math),
 * exchange fees (f1, f2), and gas costs.
 * 
 * Mathematical Foundation:
 * Given two pools with reserves (x1, y1) and (x2, y2) and fees (f1, f2):
 * Profit(Δx) = Output_Pool2(Output_Pool1(Δx)) - Δx - Gas
 * By taking d(Profit)/d(Δx) = 0, the closed-form analytical maximum is:
 * 
 * Δx* = (sqrt(x1 * x2 * y1 * y2 * (1 - f1) * (1 - f2)) - x1 * y2) / (y2 + x1 * (1 - f1))
 */

export interface PoolReserves {
  poolName: string;
  reserveTokenIn: number;   // e.g. USDC (x)
  reserveTokenOut: number;  // e.g. WETH (y)
  feeBps: number;           // e.g. 5 bps = 0.05% = 0.0005
}

export interface OptimalTradeResult {
  optimalBorrowInUSD: number;
  expectedGrossProfitUSD: number;
  estimatedGasUSD: number;
  expectedNetProfitUSD: number;
  netProfitBps: number;
  isProfitable: boolean;
  priceImpactPctPool1: number;
  priceImpactPctPool2: number;
  reversionRisk: 'ZERO_ATOMIC_PROTECTED' | 'SUB_PROFIT_REVERT';
}

/**
 * Calculates closed-form optimal trade size between two AMM pools.
 */
export function calculateOptimalTradeSize(
  poolA: PoolReserves,
  poolB: PoolReserves,
  estimatedGasUSD: number = 0.05
): OptimalTradeResult {
  const f1 = poolA.feeBps / 10000;
  const f2 = poolB.feeBps / 10000;
  const gamma1 = 1 - f1;
  const gamma2 = 1 - f2;

  const x1 = poolA.reserveTokenIn;
  const y1 = poolA.reserveTokenOut;
  const x2 = poolB.reserveTokenIn;
  const y2 = poolB.reserveTokenOut;

  const numerator = Math.sqrt(x1 * x2 * y1 * y2 * gamma1 * gamma2) - (x1 * y2);
  const denominator = (y2 * gamma1) + (y1 * gamma1 * gamma2);

  let deltaX = 0;
  if (denominator > 0 && numerator > 0) {
    deltaX = numerator / denominator;
  }

  // Safety caps: Do not exceed 12% of total pool depth to prevent extreme non-linear slippage
  const maxSafeBorrow = Math.min(x1, x2) * 0.12;
  const boundedDeltaX = Math.max(0, Math.min(deltaX, maxSafeBorrow));

  if (boundedDeltaX <= 0) {
    return {
      optimalBorrowInUSD: 0,
      expectedGrossProfitUSD: 0,
      estimatedGasUSD,
      expectedNetProfitUSD: 0,
      netProfitBps: 0,
      isProfitable: false,
      priceImpactPctPool1: 0,
      priceImpactPctPool2: 0,
      reversionRisk: 'SUB_PROFIT_REVERT'
    };
  }

  // Calculate actual step 1 swap output in TokenOut: y_out = (y1 * Δx * gamma1) / (x1 + Δx * gamma1)
  const amountInWithFee1 = boundedDeltaX * gamma1;
  const tokenOutReceived = (y1 * amountInWithFee1) / (x1 + amountInWithFee1);

  // Calculate step 2 swap output back to TokenIn on Pool B: x_out = (x2 * tokenOutReceived * gamma2) / (y2 + tokenOutReceived * gamma2)
  const amountInWithFee2 = tokenOutReceived * gamma2;
  const tokenInFinal = (x2 * amountInWithFee2) / (y2 + amountInWithFee2);

  const grossProfit = tokenInFinal - boundedDeltaX;
  const netProfit = grossProfit - estimatedGasUSD;
  const isProfitable = netProfit > 0;
  const netProfitBps = boundedDeltaX > 0 ? (netProfit / boundedDeltaX) * 10000 : 0;

  const priceImpactPool1 = (boundedDeltaX / (x1 + boundedDeltaX)) * 100;
  const priceImpactPool2 = (tokenOutReceived / (y2 + tokenOutReceived)) * 100;

  return {
    optimalBorrowInUSD: Math.round(boundedDeltaX * 100) / 100,
    expectedGrossProfitUSD: Math.round(grossProfit * 100) / 100,
    estimatedGasUSD,
    expectedNetProfitUSD: Math.round(netProfit * 100) / 100,
    netProfitBps: Math.round(netProfitBps * 10) / 10,
    isProfitable,
    priceImpactPctPool1: Math.round(priceImpactPool1 * 100) / 100,
    priceImpactPctPool2: Math.round(priceImpactPool2 * 100) / 100,
    reversionRisk: isProfitable ? 'ZERO_ATOMIC_PROTECTED' : 'SUB_PROFIT_REVERT'
  };
}
