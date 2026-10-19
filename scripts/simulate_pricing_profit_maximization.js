/**
 * @file simulate_pricing_profit_maximization.js
 * Comprehensive Pricing Strategy & Profit Maximization Simulation
 * Modeling 1,000 Nigerian Commercial SMEs across 10 sectors & 5 pricing models.
 * 
 * Objectives:
 * 1. Find the exact price points that maximize Net Owner Profit (not just conversion volume).
 * 2. Analyze Nigerian commercial psychology & price elasticity by sector.
 * 3. Compare 5 distinct pricing architectures:
 *    - Model 1: Flat Low-Ticket (₦35,000 flat across all sectors)
 *    - Model 2: Flat High-Ticket (₦150,000 flat across all sectors)
 *    - Model 3: 2-Tier Universal (₦35k Starter vs ₦150k Full Suite)
 *    - Model 4: Sector-Tiered Value-Based Pricing (Low-ticket for food/retail, High-ticket for solar/real-estate)
 *    - Model 5: The "Cash Engine": Sector-Tiered Setup + Monthly Automation Retainer (₦25k-₦75k setup + ₦15k-₦35k/mo)
 * 4. Factor in hard delivery costs (Domain registration ₦8.5k, Hosting ₦2k/mo, SMS/API ₦1.5k).
 */

const fs = require('fs');
const path = require('path');

// 1. Definition of Sectors and their Real-World Transaction Sizes in Nigeria
const SECTOR_PROFILES = [
  {
    sector: 'Solar & Renewable Energy',
    tier: 'High-Ticket B2B',
    avgClientDealSizeNgn: 4500000, // ₦4.5m average install
    monthlyRevenueNgn: 12000000,
    willingnessToInvestMaxNgn: 250000,
    priceSensitivity: 0.35, // Low sensitivity (spending ₦75k-₦150k is 1% of a single sale)
    recurringAppetite: 0.75  // Very willing to pay monthly for lead engine
  },
  {
    sector: 'Real Estate & Property Developers',
    tier: 'High-Ticket B2B',
    avgClientDealSizeNgn: 65000000, // ₦65m property
    monthlyRevenueNgn: 25000000,
    willingnessToInvestMaxNgn: 350000,
    priceSensitivity: 0.30,
    recurringAppetite: 0.70
  },
  {
    sector: 'Automotive & Tokunbo Importers',
    tier: 'High-Ticket B2B',
    avgClientDealSizeNgn: 14000000, // ₦14m car
    monthlyRevenueNgn: 18000000,
    willingnessToInvestMaxNgn: 200000,
    priceSensitivity: 0.40,
    recurringAppetite: 0.65
  },
  {
    sector: 'Private Schools & Academies',
    tier: 'Mid-Ticket Institutional',
    avgClientDealSizeNgn: 180000, // Term fee per student (x150 students = ₦27m/term)
    monthlyRevenueNgn: 9000000,
    willingnessToInvestMaxNgn: 150000,
    priceSensitivity: 0.50,
    recurringAppetite: 0.80 // Loves termly/monthly retainers
  },
  {
    sector: 'Healthcare & Private Clinics',
    tier: 'Mid-Ticket Institutional',
    avgClientDealSizeNgn: 35000,
    monthlyRevenueNgn: 7500000,
    willingnessToInvestMaxNgn: 150000,
    priceSensitivity: 0.48,
    recurringAppetite: 0.75
  },
  {
    sector: 'Legal & Corporate Services',
    tier: 'Mid-Ticket Professional',
    avgClientDealSizeNgn: 85000,
    monthlyRevenueNgn: 5500000,
    willingnessToInvestMaxNgn: 120000,
    priceSensitivity: 0.52,
    recurringAppetite: 0.60
  },
  {
    sector: 'Hospitality & Shortlet Apartments',
    tier: 'Mid-Ticket Commercial',
    avgClientDealSizeNgn: 150000, // ₦75k/night x 2 nights
    monthlyRevenueNgn: 4500000,
    willingnessToInvestMaxNgn: 100000,
    priceSensitivity: 0.55,
    recurringAppetite: 0.85 // Willing to pay monthly to bypass Airbnb 15%
  },
  {
    sector: 'Interstate Logistics & Haulage',
    tier: 'Mid-Ticket Commercial',
    avgClientDealSizeNgn: 25000,
    monthlyRevenueNgn: 6000000,
    willingnessToInvestMaxNgn: 100000,
    priceSensitivity: 0.58,
    recurringAppetite: 0.70
  },
  {
    sector: 'Beauty, Hair Salon & Spa',
    tier: 'Fast-Cash SME',
    avgClientDealSizeNgn: 45000,
    monthlyRevenueNgn: 3200000,
    willingnessToInvestMaxNgn: 65000,
    priceSensitivity: 0.72, // High sensitivity; prefers ₦25k-₦35k
    recurringAppetite: 0.80 // Loves ₦15k-₦20k/mo "seat protection"
  },
  {
    sector: 'Restaurants, Cafes & Lounges',
    tier: 'Fast-Cash SME',
    avgClientDealSizeNgn: 12000,
    monthlyRevenueNgn: 3800000,
    willingnessToInvestMaxNgn: 60000,
    priceSensitivity: 0.75, // High sensitivity; prefers ₦25k-₦35k
    recurringAppetite: 0.85 // Loves ₦15k-₦25k/mo to save Chowdeck 25%
  },
  {
    sector: 'Retail Boutiques & Supermarkets',
    tier: 'Fast-Cash SME',
    avgClientDealSizeNgn: 28000,
    monthlyRevenueNgn: 3000000,
    willingnessToInvestMaxNgn: 50000,
    priceSensitivity: 0.78,
    recurringAppetite: 0.75
  }
];

// Delivery & Operating Costs per Client
const COSTS = {
  domainDotComNg: 8500, // One-time custom domain registration
  vpsHostingSharePerClientMo: 1000,
  smsNotificationCostPerClientMo: 1200,
  supportAndMaintenancePerClientMo: 2000
};

// 2. Definition of the 5 Pricing Models
const MODELS = {
  // Model 1: Flat Low-Ticket (Current entry level)
  model1_flat_low: {
    name: 'Model 1: Flat Low-Ticket (₦35k One-Time)',
    description: 'Flat ₦35,000 for every business regardless of sector. Zero recurring retainers.',
    getPrice: (sector) => ({ upfront: 35000, monthly: 0, hasCustomDomain: false }),
    costUpfront: 2000, // Subdomain hosting setup
    costMonthly: 500
  },

  // Model 2: Flat High-Ticket (Traditional Agency)
  model2_flat_high: {
    name: 'Model 2: Flat High-Ticket (₦150k Full Suite)',
    description: 'Flat ₦150,000 (₦75k deposit) for everyone. High price resistance.',
    getPrice: (sector) => ({ upfront: 150000, monthly: 0, hasCustomDomain: true }),
    costUpfront: COSTS.domainDotComNg + 2000,
    costMonthly: 1500
  },

  // Model 3: Current 2-Tier Universal (₦35k Starter vs ₦150k Custom Suite)
  model3_two_tier_universal: {
    name: 'Model 3: 2-Tier Universal (₦35k Starter / ₦150k Full Suite)',
    description: 'Client chooses: ₦35,000 starter on subdomain OR ₦150,000 full custom domain.',
    getPrice: (sector, preference) => {
      if (preference === 'premium') {
        return { upfront: 150000, monthly: 0, hasCustomDomain: true };
      }
      return { upfront: 35000, monthly: 0, hasCustomDomain: false };
    },
    costUpfront: (isPrem) => isPrem ? COSTS.domainDotComNg + 2000 : 2000,
    costMonthly: 1000
  },

  // Model 4: Value-Based Sector-Tiered Pricing (Max profit upfront)
  model4_sector_tiered: {
    name: 'Model 4: Value-Based Sector-Tiered Pricing',
    description: 'Fast-Cash SMEs: ₦35k / Mid-Ticket: ₦65k / High-Ticket B2B: ₦120k upfront.',
    getPrice: (sector) => {
      if (sector.tier === 'High-Ticket B2B') {
        return { upfront: 120000, monthly: 0, hasCustomDomain: true };
      } else if (sector.tier === 'Mid-Ticket Institutional' || sector.tier === 'Mid-Ticket Commercial' || sector.tier === 'Mid-Ticket Professional') {
        return { upfront: 65000, monthly: 0, hasCustomDomain: true };
      } else {
        return { upfront: 35000, monthly: 0, hasCustomDomain: false };
      }
    },
    costUpfront: (hasDomain) => hasDomain ? COSTS.domainDotComNg + 2000 : 2000,
    costMonthly: 1000
  },

  // Model 5: The "Cash Engine": Value-Based Setup + Monthly Automation Retainer (RECOMMENDED)
  model5_setup_plus_retainer: {
    name: 'Model 5: Setup Deposit + Monthly Automation Retainer',
    description: 'Low Setup (₦25k-₦50k) to eliminate price resistance + Monthly Retainer (₦15k-₦35k/mo) for 24/7 WhatsApp AI & Server Hosting.',
    getPrice: (sector) => {
      if (sector.tier === 'High-Ticket B2B') {
        return { upfront: 65000, monthly: 35000, hasCustomDomain: true, label: '₦65k Setup + ₦35k/mo' };
      } else if (sector.tier.includes('Mid-Ticket')) {
        return { upfront: 45000, monthly: 25000, hasCustomDomain: true, label: '₦45k Setup + ₦25k/mo' };
      } else {
        return { upfront: 25000, monthly: 15000, hasCustomDomain: false, label: '₦25k Setup + ₦15k/mo' };
      }
    },
    costUpfront: (hasDomain) => hasDomain ? COSTS.domainDotComNg + 2000 : 2000,
    costMonthly: COSTS.vpsHostingSharePerClientMo + COSTS.smsNotificationCostPerClientMo
  }
};

// 3. Monte Carlo Simulation Engine
function simulateSmePurchases(smeCount = 1000) {
  const results = {
    model1: { dealsClosed: 0, grossRevenue: 0, totalCosts: 0, netProfit: 0, annualLtv: 0 },
    model2: { dealsClosed: 0, grossRevenue: 0, totalCosts: 0, netProfit: 0, annualLtv: 0 },
    model3: { dealsClosed: 0, grossRevenue: 0, totalCosts: 0, netProfit: 0, annualLtv: 0 },
    model4: { dealsClosed: 0, grossRevenue: 0, totalCosts: 0, netProfit: 0, annualLtv: 0 },
    model5: { dealsClosed: 0, grossRevenue: 0, totalCosts: 0, netProfit: 0, annualLtv: 0 }
  };

  for (let i = 0; i < smeCount; i++) {
    const sector = SECTOR_PROFILES[i % SECTOR_PROFILES.length];

    // MODEL 1: Flat Low-Ticket (₦35,000)
    // High conversion (~42%), but leaves massive profit on table from Solar/Real Estate
    const m1ConversionProb = 0.42 * (1 - sector.priceSensitivity * 0.2);
    if (Math.random() < m1ConversionProb) {
      results.model1.dealsClosed++;
      const rev = 35000;
      const cost = 2000;
      results.model1.grossRevenue += rev;
      results.model1.totalCosts += cost;
      results.model1.netProfit += (rev - cost);
      results.model1.annualLtv += (rev - cost); // No recurring
    }

    // MODEL 2: Flat High-Ticket (₦150,000)
    // Low conversion (~6.5%), severe price resistance from salons, restaurants, retail
    const m2ConversionProb = 0.08 * (1 - sector.priceSensitivity * 0.8);
    if (Math.random() < m2ConversionProb) {
      results.model2.dealsClosed++;
      const rev = 150000;
      const cost = COSTS.domainDotComNg + 2000;
      results.model2.grossRevenue += rev;
      results.model2.totalCosts += cost;
      results.model2.netProfit += (rev - cost);
      results.model2.annualLtv += (rev - cost);
    }

    // MODEL 3: 2-Tier Universal (₦35k vs ₦150k)
    // Good conversion (~38%). 82% take ₦35k, 18% take ₦150k
    const m3ConversionProb = 0.38 * (1 - sector.priceSensitivity * 0.25);
    if (Math.random() < m3ConversionProb) {
      results.model3.dealsClosed++;
      const isPremium = Math.random() < (sector.tier === 'High-Ticket B2B' ? 0.35 : 0.08);
      const rev = isPremium ? 150000 : 35000;
      const cost = isPremium ? COSTS.domainDotComNg + 2000 : 2000;
      results.model3.grossRevenue += rev;
      results.model3.totalCosts += cost;
      results.model3.netProfit += (rev - cost);
      results.model3.annualLtv += (rev - cost);
    }

    // MODEL 4: Value-Based Sector-Tiered Pricing (₦35k / ₦65k / ₦120k)
    // Strong conversion (~34%). Matches price to sector capacity.
    const m4Price = MODELS.model4_sector_tiered.getPrice(sector);
    const m4ConversionProb = 0.34 * (1 - sector.priceSensitivity * 0.3);
    if (Math.random() < m4ConversionProb) {
      results.model4.dealsClosed++;
      const rev = m4Price.upfront;
      const cost = MODELS.model4_sector_tiered.costUpfront(m4Price.hasCustomDomain);
      results.model4.grossRevenue += rev;
      results.model4.totalCosts += cost;
      results.model4.netProfit += (rev - cost);
      results.model4.annualLtv += (rev - cost);
    }

    // MODEL 5: The "Cash Engine": Low Setup + Monthly Automation Retainer
    // Very high conversion (~46%) because upfront barrier is low (₦25k-₦65k).
    // Generates recurring revenue for 12 months (assuming 75% 6-month retention).
    const m5Price = MODELS.model5_setup_plus_retainer.getPrice(sector);
    const m5ConversionProb = 0.46 * (1 - sector.priceSensitivity * 0.15);
    if (Math.random() < m5ConversionProb) {
      results.model5.dealsClosed++;
      const upfrontRev = m5Price.upfront;
      const upfrontCost = MODELS.model5_setup_plus_retainer.costUpfront(m5Price.hasCustomDomain);
      
      // Average 8 months client retention
      const avgMonths = 8;
      const recurringRev = m5Price.monthly * avgMonths;
      const recurringCost = MODELS.model5_setup_plus_retainer.costMonthly * avgMonths;

      const totalClientRev = upfrontRev + recurringRev;
      const totalClientCost = upfrontCost + recurringCost;

      results.model5.grossRevenue += totalClientRev;
      results.model5.totalCosts += totalClientCost;
      results.model5.netProfit += (totalClientRev - totalClientCost);
      results.model5.annualLtv += (totalClientRev - totalClientCost);
    }
  }

  return results;
}

// Execute 10 Monte Carlo Iterations (10,000 simulated SMEs)
console.log('Running 10 Monte Carlo simulations (10,000 total simulated Nigerian SME purchase decisions)...');
const iterations = 10;
const agg = {
  model1: { dealsClosed: 0, grossRevenue: 0, totalCosts: 0, netProfit: 0, annualLtv: 0 },
  model2: { dealsClosed: 0, grossRevenue: 0, totalCosts: 0, netProfit: 0, annualLtv: 0 },
  model3: { dealsClosed: 0, grossRevenue: 0, totalCosts: 0, netProfit: 0, annualLtv: 0 },
  model4: { dealsClosed: 0, grossRevenue: 0, totalCosts: 0, netProfit: 0, annualLtv: 0 },
  model5: { dealsClosed: 0, grossRevenue: 0, totalCosts: 0, netProfit: 0, annualLtv: 0 }
};

for (let i = 0; i < iterations; i++) {
  const r = simulateSmePurchases(1000);
  Object.keys(agg).forEach(m => {
    agg[m].dealsClosed += r[m].dealsClosed;
    agg[m].grossRevenue += r[m].grossRevenue;
    agg[m].totalCosts += r[m].totalCosts;
    agg[m].netProfit += r[m].netProfit;
    agg[m].annualLtv += r[m].annualLtv;
  });
}

// Compute Averages per 1,000 SMEs contacted
const finalStats = {};
Object.keys(agg).forEach(m => {
  finalStats[m] = {
    dealsClosed: Math.round(agg[m].dealsClosed / iterations),
    conversionRate: `${((agg[m].dealsClosed / (1000 * iterations)) * 100).toFixed(1)}%`,
    grossRevenue: Math.round(agg[m].grossRevenue / iterations),
    totalCosts: Math.round(agg[m].totalCosts / iterations),
    netProfit: Math.round(agg[m].netProfit / iterations),
    netProfitPerClient: Math.round(agg[m].netProfit / agg[m].dealsClosed),
    profitMargin: `${((agg[m].netProfit / agg[m].grossRevenue) * 100).toFixed(1)}%`
  };
});

console.log('\n===============================================================');
console.log('💰 PRICING PROFIT MAXIMIZATION SIMULATION (PER 1,000 LEADS)');
console.log('===============================================================');

console.log(`\n1. MODEL 1: Flat Low-Ticket (₦35,000 One-Time)`);
console.log(`   Deals: ${finalStats.model1.dealsClosed} (${finalStats.model1.conversionRate}) | Revenue: ₦${finalStats.model1.grossRevenue.toLocaleString()} | NET PROFIT: ₦${finalStats.model1.netProfit.toLocaleString()}`);

console.log(`\n2. MODEL 2: Flat High-Ticket (₦150,000 One-Time)`);
console.log(`   Deals: ${finalStats.model2.dealsClosed} (${finalStats.model2.conversionRate}) | Revenue: ₦${finalStats.model2.grossRevenue.toLocaleString()} | NET PROFIT: ₦${finalStats.model2.netProfit.toLocaleString()}`);

console.log(`\n3. MODEL 3: 2-Tier Universal (₦35k Starter / ₦150k Full Suite)`);
console.log(`   Deals: ${finalStats.model3.dealsClosed} (${finalStats.model3.conversionRate}) | Revenue: ₦${finalStats.model3.grossRevenue.toLocaleString()} | NET PROFIT: ₦${finalStats.model3.netProfit.toLocaleString()}`);

console.log(`\n4. MODEL 4: Value-Based Sector-Tiered Pricing (₦35k / ₦65k / ₦120k)`);
console.log(`   Deals: ${finalStats.model4.dealsClosed} (${finalStats.model4.conversionRate}) | Revenue: ₦${finalStats.model4.grossRevenue.toLocaleString()} | NET PROFIT: ₦${finalStats.model4.netProfit.toLocaleString()}`);

console.log(`\n5. MODEL 5: The "Cash Engine": Setup Deposit + Monthly Automation Retainer 🏆`);
console.log(`   Deals: ${finalStats.model5.dealsClosed} (${finalStats.model5.conversionRate}) | Revenue: ₦${finalStats.model5.grossRevenue.toLocaleString()} | NET PROFIT: ₦${finalStats.model5.netProfit.toLocaleString()}`);
console.log(`   -> PROFIT MULTIPLIER VS MODEL 1: ${(finalStats.model5.netProfit / finalStats.model1.netProfit).toFixed(2)}x MORE NET PROFIT`);

// Write detailed simulation results to local_db
const outPath = path.join(__dirname, '../local_db/pricing_profit_maximization_results.json');
fs.writeFileSync(outPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  iterations,
  totalSimulations: 1000 * iterations,
  finalStats,
  sectorProfiles: SECTOR_PROFILES,
  recommendations: {
    recommendedModel: 'Model 5: Setup Deposit + Monthly Automation Retainer',
    highTicketSectors: { setup: 65000, monthly: 35000, sectors: ['Solar & Renewable Energy', 'Real Estate & Properties', 'Tokunbo Automotive'] },
    midTicketSectors: { setup: 45000, monthly: 25000, sectors: ['Schools & Academies', 'Healthcare & Clinics', 'Logistics & Haulage', 'Hospitality & Shortlets'] },
    fastCashSmes: { setup: 25000, monthly: 15000, sectors: ['Beauty & Salons', 'Restaurants & Lounges', 'Retail & Boutiques'] }
  }
}, null, 2));

console.log(`\nDetailed pricing data written to ${outPath}`);
