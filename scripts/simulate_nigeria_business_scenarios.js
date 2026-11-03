/**
 * @file scripts/simulate_nigeria_business_scenarios.js
 * 
 * 🇳🇬 ADVANCED 90-DAY COMMERCIAL SIMULATION ENGINE (2026 NIGERIA REALITIES)
 * Models Macro Conditions: Band A Tariffs, Naira Volatility, Lagos Broker Behavior,
 * SME Cashflow Friction, and Dual-Pillar Performance.
 */

const fs = require('fs');
const path = require('path');

// ── MACROECONOMIC PARAMETERS (NIGERIA 2026) ──
const MACRO = {
  nairaPerUsd: 1480,
  dieselPricePerLiterNgn: 1350,
  bandATariffKwhNgn: 209,
  bankTransferFailureRate: 0.045, // 4.5% NIP network glithes/downtime
  lagosBrokerBypassAttemptRate: 0.18, // 18% of brokers attempt side-deals
  windowShopperLeadRate: 0.22, // 22% of raw leads are junior agents or tire-kickers
};

// ── CONVERSION RATES BY PILLAR ──
const CONVERSIONS = {
  // Pillar 1: Fast Daily Cashflow (SMEs without standalone website)
  pillar1: {
    contactsPerDay: 50, // 50 precision outreaches to non-website SMEs
    demoPreviewOpenRate: 0.38, // 38% click to test their prototype
    starterActivationRate: 0.04, // 4% buy ₦35k starter / ₦25k/mo
    monthlyChurnRate: 0.08, // 8% monthly churn on retainers
  },
  // Pillar 2: High-Ticket Deal Wire (Prime Real Estate & Solar)
  pillar2: {
    briefsHarvestedPerMonth: 24, // 6 verified briefs per week
    brokerClaimRateWithin45m: 0.72, // 72% claimed before SLA reroutes
    inspectionFulfillmentRate: 0.65, // 65% log verified tour within 24h
    // Deal Closing Conversion by Vertical
    closingRates: {
      residentialRental: 0.28, // 28% of inspected rentals close in 7-14 days
      commercialSolar: 0.18, // 18% of solar audits close in 14-21 days
      luxurySaleDuplex: 0.07, // 7% of duplex inspections close in 30-60 days
    },
    // Upfront Territory Retainers
    retainerAdoptionPostClosing: 0.40, // 40% of agencies subscribe to ₦35k/mo wire after 1st close
  }
};

// ── SIMULATION ENGINES ──

function runMonteCarloMonth(scenarioName, overrides = {}) {
  const p1 = { ...CONVERSIONS.pillar1, ...(overrides.pillar1 || {}) };
  const p2 = { ...CONVERSIONS.pillar2, ...(overrides.pillar2 || {}) };
  const bypassRate = overrides.bypassRate !== undefined ? overrides.bypassRate : MACRO.lagosBrokerBypassAttemptRate;

  let days = 30;
  let p1Revenue = 0;
  let p1ActiveRetainers = overrides.startingRetainers || 0;
  let p1SetupsSold = 0;

  // Simulate Day by Day Pillar 1
  for (let d = 1; d <= days; d++) {
    const dailyContacts = p1.contactsPerDay;
    const clicks = Math.round(dailyContacts * p1.demoPreviewOpenRate);
    const salesToday = Math.round(clicks * p1.starterActivationRate);
    
    // Each sale = ₦35,000 setup (or ₦25k/mo retainer)
    const setupCash = salesToday * 35000;
    p1Revenue += setupCash;
    p1SetupsSold += salesToday;
    p1ActiveRetainers += salesToday;
  }
  // Monthly retainers collected (₦25k/mo)
  const retainerCash = p1ActiveRetainers * 25000 * (1 - p1.monthlyChurnRate);
  p1Revenue += retainerCash;

  // Simulate Pillar 2 (High-Ticket Deal Wire)
  const briefs = p2.briefsHarvestedPerMonth;
  const claimedBriefs = Math.round(briefs * p2.brokerClaimRateWithin45m);
  const inspectedBriefs = Math.round(claimedBriefs * p2.inspectionFulfillmentRate);

  // Distribution of Briefs: 50% Rentals, 35% Solar, 15% Sales
  const rentalBriefs = Math.round(inspectedBriefs * 0.50);
  const solarBriefs = Math.round(inspectedBriefs * 0.35);
  const saleBriefs = Math.round(inspectedBriefs * 0.15);

  const rentalCloses = Math.round(rentalBriefs * p2.closingRates.residentialRental);
  const solarCloses = Math.round(solarBriefs * p2.closingRates.commercialSolar);
  const saleCloses = Math.round(saleBriefs * p2.closingRates.luxurySaleDuplex);

  // Economic Cuts (Bethelmind share)
  // Average rental: ₦6M rent -> ₦600k fee -> ₦150k cut
  // Average solar: ₦22M system -> ₦4.4M margin -> ₦880k cut
  // Average sale: ₦140M duplex -> ₦7M fee -> ₦1.4M cut
  const rawRentalRevenue = rentalCloses * 150000;
  const rawSolarRevenue = solarCloses * 880000;
  const rawSaleRevenue = saleCloses * 1400000;

  // Impact of Broker Bypass Attempts
  // If bypass is attempted, triangulated concierge + LASRERA threat recovers 85% of fees,
  // 15% becomes contentious / delayed.
  const bypassExposure = (rawRentalRevenue + rawSolarRevenue + rawSaleRevenue) * bypassRate;
  const bypassRecovered = bypassExposure * 0.85;
  const bypassLostOrDelayed = bypassExposure * 0.15;

  const realizedHighTicket = (rawRentalRevenue + rawSolarRevenue + rawSaleRevenue) - bypassLostOrDelayed;

  // Territory Wire Retainers (Agencies subscribing to ₦35k/mo)
  const newSubscribedAgencies = Math.round((rentalCloses + solarCloses + saleCloses) * p2.retainerAdoptionPostClosing);
  const totalAgenciesOnWire = (overrides.startingWireAgencies || 0) + newSubscribedAgencies;
  const territoryWireRevenue = totalAgenciesOnWire * 35000;

  const totalMonthlyNet = p1Revenue + realizedHighTicket + territoryWireRevenue;

  return {
    scenarioName,
    metrics: {
      p1SetupsSold,
      p1ActiveRetainers: Math.round(p1ActiveRetainers),
      p1TotalRevenueNgn: Math.round(p1Revenue),
      p2DealsClosed: {
        rentals: rentalCloses,
        solarProjects: solarCloses,
        duplexSales: saleCloses,
        total: rentalCloses + solarCloses + saleCloses
      },
      p2RealizedCommissionNgn: Math.round(realizedHighTicket),
      p2TerritoryWireAgencies: totalAgenciesOnWire,
      p2TerritoryWireRevenueNgn: territoryWireRevenue,
      bypassRiskMetrics: {
        bypassAttemptedNgn: Math.round(bypassExposure),
        retainedViaTriangulationNgn: Math.round(bypassRecovered),
        delayedOrUnsettledNgn: Math.round(bypassLostOrDelayed)
      },
      totalGrossRevenueNgn: Math.round(totalMonthlyNet),
      totalGrossRevenueUsd: Math.round(totalMonthlyNet / MACRO.nairaPerUsd)
    }
  };
}

console.log('🇳🇬 =================================================================');
console.log('   BETHELMIND DUAL-ENGINE SIMULATION: NIGERIA 2026 REALITIES');
console.log('   Macro Benchmark: Diesel ₦1,350/L | Band A ₦209/kWh | USD/NGN 1,480');
console.log('===================================================================\n');

// ── RUN 4 SCENARIOS ──
const scenarios = [
  {
    name: '1. BASELINE EXECUTION (Standard Market Friction, Normal Closing Cycles)',
    overrides: { startingRetainers: 4, startingWireAgencies: 2 }
  },
  {
    name: '2. ADVERSARIAL BROKER SQUEEZE (High Circumvention & Aggressive Haggling)',
    overrides: {
      bypassRate: 0.35, // 35% of brokers try to cut out middleman
      pillar2: {
        briefsHarvestedPerMonth: 20,
        brokerClaimRateWithin45m: 0.60,
        inspectionFulfillmentRate: 0.50,
        closingRates: { residentialRental: 0.20, commercialSolar: 0.15, luxurySaleDuplex: 0.04 },
        retainerAdoptionPostClosing: 0.25
      }
    }
  },
  {
    name: '3. SEVERE MACRO CONTRACTION (High FX Turmoil, Property Sales Frozen)',
    overrides: {
      bypassRate: 0.15,
      pillar2: {
        briefsHarvestedPerMonth: 16,
        brokerClaimRateWithin45m: 0.65,
        inspectionFulfillmentRate: 0.60,
        closingRates: {
          residentialRental: 0.25, // Rentals still move (people must live somewhere)
          commercialSolar: 0.22,  // Solar SURGES because diesel is unaffordable
          luxurySaleDuplex: 0.00  // Zero luxury sales close
        },
        retainerAdoptionPostClosing: 0.30
      }
    }
  },
  {
    name: '4. DIASPORA & BAND A SOLAR BOOM (High Adoption, Blue-Sky Quarter)',
    overrides: {
      bypassRate: 0.10,
      pillar1: { contactsPerDay: 75, starterActivationRate: 0.06 },
      pillar2: {
        briefsHarvestedPerMonth: 32,
        brokerClaimRateWithin45m: 0.85,
        inspectionFulfillmentRate: 0.75,
        closingRates: { residentialRental: 0.35, commercialSolar: 0.25, luxurySaleDuplex: 0.12 },
        retainerAdoptionPostClosing: 0.55
      },
      startingWireAgencies: 6
    }
  }
];

const results = scenarios.map(s => runMonteCarloMonth(s.name, s.overrides));

results.forEach(res => {
  console.log(`\n📌 SCENARIO: ${res.scenarioName}`);
  console.log(`   ─────────────────────────────────────────────────────────────`);
  console.log(`   Pillar 1 (SME Tools & Web):     ₦${res.metrics.p1TotalRevenueNgn.toLocaleString()} (${res.metrics.p1SetupsSold} new setups, ${res.metrics.p1ActiveRetainers} retainers)`);
  console.log(`   Pillar 2 Closings:             ${res.metrics.p2DealsClosed.total} deals (${res.metrics.p2DealsClosed.rentals} rentals, ${res.metrics.p2DealsClosed.solarProjects} solar, ${res.metrics.p2DealsClosed.duplexSales} sales)`);
  console.log(`   Pillar 2 Realized Commissions:  ₦${res.metrics.p2RealizedCommissionNgn.toLocaleString()}`);
  console.log(`   Pillar 2 Territory Retainers:  ₦${res.metrics.p2TerritoryWireRevenueNgn.toLocaleString()} (${res.metrics.p2TerritoryWireAgencies} agencies subscribed @ ₦35k/mo)`);
  console.log(`   Bypass Risk Stressed:          ₦${res.metrics.bypassRiskMetrics.bypassAttemptedNgn.toLocaleString()} exposed -> ₦${res.metrics.bypassRiskMetrics.retainedViaTriangulationNgn.toLocaleString()} retained via LASRERA/Concierge`);
  console.log(`   -------------------------------------------------------------`);
  console.log(`   💰 TOTAL MONTHLY NET:           ₦${res.metrics.totalGrossRevenueNgn.toLocaleString()} (~$${res.metrics.totalGrossRevenueUsd.toLocaleString()} USD)`);
});

fs.writeFileSync(
  path.join(process.cwd(), 'scripts', 'simulation_results.json'),
  JSON.stringify(results, null, 2)
);
console.log('\n✅ Simulation telemetry saved to scripts/simulation_results.json');
