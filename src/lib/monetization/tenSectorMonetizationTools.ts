/**
 * @file src/lib/monetization/tenSectorMonetizationTools.ts
 * 
 * BETHELMIND ANALYTICS: 10 HIGH-CONVERSION SECTOR MONETIZATION TOOLS
 * 
 * Ready-to-Pitch B2B Revenue Engines for Nigerian Commercial Enterprises:
 * 1.  Instant WhatsApp Speed-to-Lead & Catalog Closer (₦15k–₦30k/mo)
 * 2.  Solar & Inverter System Sizing & Instant Quotation Engine (₦25k–₦50k/mo or ₦100k setup)
 * 3.  "Fake Alert Proof" Automated Bank Transfer Reconciliation (₦10k/mo + 0.5% cap)
 * 4.  Hyperlocal Dispatch Aggregator & Waybill Tracker (₦20k–₦45k/mo)
 * 5.  Multi-Location Real-Time Stock & Theft-Prevention Ledger (₦30k–₦60k/mo)
 * 6.  Automated Service Booking & Deposit Lock Engine (₦15k–₦35k/mo)
 * 7.  Tenant Service Charge & Rent Escrow Manager (₦50k–₦150k/mo)
 * 8.  Construction & Interior Finishing Material Estimator (₦20k–₦40k/mo)
 * 9.  Private School Term Fee Portal with Result Gating (₦50k–₦100k/term)
 * 10. Bulk Agribusiness Feed & Input Order Consolidator (₦30k–₦70k/mo)
 */

export interface SectorToolDefinition {
  id: string;
  name: string;
  shortTag: string;
  icon: string;
  targetAudience: string;
  painPoint: string;
  solutionSummary: string;
  monetizationPitch: {
    monthlyRetainerNgn: string;
    setupFeeNgn: string;
    headline: string;
    coreHook: string;
    zeroMonthlySubscription?: string;
    failSafeGuarantee?: string;
  };
  sampleCalculation: (inputs: any) => any;
  buildWhatsAppPitchUrl: (businessName: string, area?: string, adminPhone?: string) => string;
}

export const TEN_SECTOR_MONETIZATION_TOOLS: Record<string, SectorToolDefinition> = {
  // ── 1. WhatsApp Speed-to-Lead & Catalog Closer ──────────────────────────────
  whatsapp_speed_lead: {
    id: 'whatsapp_speed_lead',
    name: 'Instant WhatsApp Speed-to-Lead & Catalog Closer',
    shortTag: 'Speed-to-Lead AI',
    icon: '⚡',
    targetAudience: 'Instagram & TikTok vendors, boutique retailers, auto spare parts dealers, fabric merchants.',
    painPoint: 'Customers drop inquiries on social media or websites, wait 30 minutes for a response, and move directly to a competitor.',
    solutionSummary: 'A dynamic conversion widget on their claimed website that converts form submissions or clicks into an instant WhatsApp conversation. An automated assistant sends product pictures, prices, and answers FAQs 24/7, routing warm leads directly to the owner.',
    monetizationPitch: {
      monthlyRetainerNgn: '₦0 / month (Zero Monthly Fees • 100% Lifetime Setup)',
      setupFeeNgn: '₦45,000 One-Time Setup (₦25,000 Deposit to Start)',
      headline: 'Never lose an 11 PM buyer again. 100% Lifetime Setup.',
      coreHook: 'Replies in < 3 seconds on WhatsApp with product pictures & prices, booking the sale before the buyer checks another page.',
      zeroMonthlySubscription: '₦0 / month (Zero recurring subscriptions forever)',
      failSafeGuarantee: '100% Fail-Safe: Instant SMS carrier fallback ensures zero lost customer inquiries'
    },
    sampleCalculation: (inputs: { monthlyInquiries?: number; averageOrderNgn?: number; lossRatePercent?: number }) => {
      const inquiries = inputs.monthlyInquiries || 180;
      const aov = inputs.averageOrderNgn || 25000;
      const lossRate = (inputs.lossRatePercent || 35) / 100;
      const lostSalesCount = Math.round(inquiries * lossRate);
      const recoveredSalesCount = Math.round(lostSalesCount * 0.45); // 45% recovery rate
      const recoveredRevenueNgn = recoveredSalesCount * aov;
      return {
        monthlyInquiries: inquiries,
        estimatedLostSalesCount: lostSalesCount,
        recoveredSalesCount,
        recoveredRevenueNgn,
        roiMultiplier: Math.round(recoveredRevenueNgn / 25000)
      };
    },
    buildWhatsAppPitchUrl: (businessName, area = 'Lagos', adminPhone = '2348022791227') => {
      const msg = `Hello ${businessName} Team!\n\nWe noticed after-hours buyers on Instagram/web in ${area} wait before getting quotes. We pre-built a 24/7 WhatsApp Speed-to-Lead Catalog Closer for your firm:\n\n👉 Test Demo: https://www.bethelmindanalytics.com/tools/whatsapp-speed-lead\n\n100% One-Time Setup (₦0 Monthly Subscription • Fail-Safe Redundancy). May I show you a 60-second preview?`;
      return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    }
  },

  // ── 2. Solar & Inverter System Sizing & Instant Quotation Engine ─────────────
  solar_sizing_boq: {
    id: 'solar_sizing_boq',
    name: 'Solar & Inverter System Sizing & Instant Quotation Engine',
    shortTag: 'Solar BOQ Quoter',
    icon: '☀️',
    targetAudience: 'Solar EPC contractors, inverter installers, electrical engineers.',
    painPoint: 'Customers constantly ask, "How much to power my 3-bedroom flat?" Installers waste hours on site visits and manual Excel calculations for tire-kickers who cannot afford the quote.',
    solutionSummary: 'An interactive appliance load calculator (TVs, fridges, ACs, pumping machines) that instantly generates a recommended system tier (e.g. 3kVA/24V or 5kVA/48V), estimated battery bank sizing, and a downloadable PDF estimate.',
    monetizationPitch: {
      monthlyRetainerNgn: '₦0 / month (Zero Monthly Fees • 100% Lifetime Setup)',
      setupFeeNgn: '₦95,000 One-Time Setup (₦45,000 Deposit to Start)',
      headline: 'Turn your website into an automated sales engineer with ₦0 monthly subscriptions.',
      coreHook: 'Screens out tire-kickers, calculates appliance loads in 30 seconds, and delivers bankable PDF quotes with 50% deposit requests.',
      zeroMonthlySubscription: '₦0 / month (Zero ongoing subscription lock-ins)',
      failSafeGuarantee: '100% Fail-Safe: Instant WhatsApp & PDF dual-quote delivery with zero calculation failure'
    },
    sampleCalculation: (inputs: { tvCount?: number; fridgeCount?: number; acCount?: number; pumpCount?: number }) => {
      const tv = (inputs.tvCount || 2) * 150;
      const fridge = (inputs.fridgeCount || 1) * 350;
      const ac = (inputs.acCount || 1) * 1200;
      const pump = (inputs.pumpCount || 0) * 1000;
      const totalWatts = tv + fridge + ac + pump + 300; // 300W lighting buffer
      const kva = totalWatts <= 1500 ? 2.5 : totalWatts <= 3500 ? 5.0 : totalWatts <= 7000 ? 7.5 : 10.0;
      const batteryCount = kva <= 3.5 ? 2 : kva <= 5.5 ? 4 : 8;
      const estimatedSystemCostNgn = Math.round(kva * 620000);
      const monthlyDieselSavingsNgn = Math.round((kva * 1.2) * 8 * 30 * 1100); // 1.2L/hr, 8h/day, ₦1100/L
      return {
        totalWatts,
        recommendedKva: kva,
        recommendedBatteryCount: batteryCount,
        estimatedSystemCostNgn,
        monthlyDieselSavingsNgn,
        paybackPeriodMonths: Math.max(4, Math.round(estimatedSystemCostNgn / monthlyDieselSavingsNgn))
      };
    },
    buildWhatsAppPitchUrl: (businessName, area = 'Lagos', adminPhone = '2348022791227') => {
      const msg = `Hello ${businessName} Solar Team!\n\nTire-kickers asking "how much for 3-bedroom flat" waste hours of manual Excel work. We built a 24/7 Appliance BOQ Sizer for your firm:\n\n👉 Test Demo: https://www.bethelmindanalytics.com/tools/solar-boq\n\n1-Time Setup Fee, ₦0 Monthly Subscriptions, 100% fail-safe PDF quotation engine. Let's discuss activating on your domain.`;
      return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    }
  },

  // ── 3. "Fake Alert Proof" Automated Bank Transfer Reconciliation ─────────────
  fake_alert_proof: {
    id: 'fake_alert_proof',
    name: '"Fake Alert Proof" Automated Bank Transfer Reconciliation',
    shortTag: 'Fake-Alert Shield',
    icon: '🛡️',
    targetAudience: 'Supermarkets, restaurants, lounges, pharmacies, trade wholesalers.',
    painPoint: 'Staff spending 10 minutes verifying whether a customer bank transfer actually dropped or falling victim to photoshopped credit alerts.',
    solutionSummary: 'A dynamic checkout module embedded in the merchant site and mobile portal that generates a dedicated virtual account number (via Paystack, Moniepoint, or OPay) for each invoice, confirming payment within 5 seconds on the screen.',
    monetizationPitch: {
      monthlyRetainerNgn: '₦0 / month (Zero Monthly Fees • 100% Lifetime Setup)',
      setupFeeNgn: '₦35,000 One-Time Setup (Direct Bank Webhook Auto-Reconciliation)',
      headline: 'Eliminate transfer verification queues and fake alerts forever.',
      coreHook: 'Generates dynamic virtual bank accounts per customer bill. Screen updates to green CHECKED in 5 seconds flat.',
      zeroMonthlySubscription: '₦0 / month (Pay once, own the verification portal for life)',
      failSafeGuarantee: '100% Fail-Safe: Multi-bank NIBSS & Paystack/Moniepoint webhook dual redundancy'
    },
    sampleCalculation: (inputs: { dailyTransactions?: number; avgTicketNgn?: number; staffWageHourlyNgn?: number }) => {
      const dailyTx = inputs.dailyTransactions || 65;
      const avgTicket = inputs.avgTicketNgn || 14500;
      const minutesSavedDaily = dailyTx * 6; // 6 mins saved per transfer check
      const hoursSavedMonthly = Math.round((minutesSavedDaily * 30) / 60);
      const fakeAlertLossesPreventedNgn = Math.round(avgTicket * 2); // 2 fake alerts caught per month
      return {
        dailyTransactions: dailyTx,
        hoursSavedMonthly,
        fakeAlertLossesPreventedNgn,
        monthlyGrossReconciledNgn: dailyTx * avgTicket * 30
      };
    },
    buildWhatsAppPitchUrl: (businessName, area = 'Lagos', adminPhone = '2348022791227') => {
      const msg = `Hello ${businessName} Management!\n\nStaff waiting 10 minutes to verify customer bank transfers creates queues and risks fake alert fraud. We built a 5-Second Virtual Account Reconciliation Box for your cash desk:\n\n👉 Test Demo: https://www.bethelmindanalytics.com/tools/fake-alert-shield\n\n1-Time Setup, ₦0 Monthly Retainer, 100% Fail-Safe verification. May I share a 60-second video demo?`;
      return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    }
  },

  // ── 4. Hyperlocal Dispatch Aggregator & Waybill Tracker ──────────────────────
  hyperlocal_dispatch: {
    id: 'hyperlocal_dispatch',
    name: 'Hyperlocal Dispatch Aggregator & Waybill Tracker',
    shortTag: 'Waybill Tracker',
    icon: '📦',
    targetAudience: 'Local courier companies, interstate parcel handlers, market delivery services.',
    painPoint: 'Customers calling ten times a day asking, "Where is my driver?" while dispatchers juggle rider coordinates on WhatsApp groups.',
    solutionSummary: 'A customer-facing booking form on their claimed website that auto-assigns zones, calculates delivery fees based on LGA/neighborhood distance, issues an SMS tracking link to the recipient, and alerts riders.',
    monetizationPitch: {
      monthlyRetainerNgn: '₦0 / month (Zero Monthly Fees • 100% Lifetime Setup)',
      setupFeeNgn: '₦65,000 One-Time Setup (₦35,000 Deposit to Start)',
      headline: 'Compete with Chowdeck and Gokada infrastructure in your local zone with ₦0 subscriptions.',
      coreHook: 'Instant distance fee calculation, automated waybill SMS tracking, and direct rider dispatch alerts.',
      zeroMonthlySubscription: '₦0 / month (Zero recurring charges)',
      failSafeGuarantee: '100% Fail-Safe: Dual SMS + WhatsApp waybill dispatch so riders and recipients never miss updates'
    },
    sampleCalculation: (inputs: { originLga?: string; destinationLga?: string; packageWeightKg?: number }) => {
      const weight = inputs.packageWeightKg || 3.5;
      const baseFee = 2500;
      const weightSurcharge = Math.max(0, Math.round((weight - 2) * 450));
      const totalDeliveryFeeNgn = baseFee + weightSurcharge;
      return {
        originLga: inputs.originLga || 'Ikeja',
        destinationLga: inputs.destinationLga || 'Lekki Phase 1',
        weightKg: weight,
        totalDeliveryFeeNgn,
        estimatedTransitMinutes: 45,
        trackingCode: `WAY-${Math.floor(100000 + Math.random() * 900000)}`
      };
    },
    buildWhatsAppPitchUrl: (businessName, area = 'Lagos', adminPhone = '2348022791227') => {
      const msg = `Hello ${businessName} Logistics Team!\n\nCustomers calling repeatedly to ask "where is my rider" ties down your phones. We pre-built an automated Waybill & Distance Calculator with live SMS tracking for your dispatch operations:\n\n👉 Test Demo: https://www.bethelmindanalytics.com/tools/waybill-tracker\n\n1-Time Setup Fee, ₦0 Monthly Subscriptions. Let us connect your riders in under 24 hours.`;
      return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    }
  },

  // ── 5. Multi-Location Real-Time Stock & Theft-Prevention Ledger ──────────────
  stock_theft_prevention: {
    id: 'stock_theft_prevention',
    name: 'Multi-Location Real-Time Stock & Theft-Prevention Ledger',
    shortTag: 'Anti-Theft Stock',
    icon: '📊',
    targetAudience: 'Building material dealers, electronics/phone shops, pharmacy chains.',
    painPoint: 'Shop boys selling stock off the books or claiming goods were "damaged" while owners are away from the shop.',
    solutionSummary: 'A lightweight mobile-first inventory tracker paired with their site product catalog. Every time an item is marked as sold or ordered online, inventory auto-decrements, and daily discrepancy alerts are sent directly to the owner.',
    monetizationPitch: {
      monthlyRetainerNgn: '₦0 / month (Zero Monthly Fees • 100% Lifetime Setup)',
      setupFeeNgn: '₦85,000 One-Time Setup (₦45,000 Deposit to Start)',
      headline: 'Monitor your shops from your phone and catch inventory leaks before month-end.',
      coreHook: 'Real-time stock decrements on sale, low-inventory triggers, and instant WhatsApp discrepancy alerts to the owner.',
      zeroMonthlySubscription: '₦0 / month (100% Lifetime Setup • Zero ongoing bills)',
      failSafeGuarantee: '100% Fail-Safe: Offline-first local SQLite sync protects stock data during network drops'
    },
    sampleCalculation: (inputs: { totalSkus?: number; branchesCount?: number; monthlyTurnoverNgn?: number }) => {
      const skus = inputs.totalSkus || 140;
      const branches = inputs.branchesCount || 2;
      const turnover = inputs.monthlyTurnoverNgn || 8500000;
      const typicalShrinkagePercent = 0.04; // 4% inventory leakage in retail
      const savedShrinkageNgn = Math.round(turnover * typicalShrinkagePercent * 0.75); // 75% eliminated
      return {
        totalSkus: skus,
        branchesCount: branches,
        estimatedLeakagePreventedNgn: savedShrinkageNgn,
        dailyAuditTimeSavedMinutes: 90
      };
    },
    buildWhatsAppPitchUrl: (businessName, area = 'Lagos', adminPhone = '2348022791227') => {
      const msg = `Hello Executive Management at ${businessName}!\n\nManaging store inventory across locations without off-the-books shrinkage is tough. We pre-built a real-time Anti-Theft Mobile Inventory Ledger tailored for ${businessName}:\n\n👉 Test Demo: https://www.bethelmindanalytics.com/tools/stock-ledger\n\n1-Time Setup Fee, ₦0 Monthly Fees, 100% fail-safe variance alerts straight to your phone.`;
      return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    }
  },

  // ── 6. Automated Service Booking & Deposit Lock Engine ───────────────────────
  service_booking_deposit: {
    id: 'service_booking_deposit',
    name: 'Automated Service Booking & Deposit Lock Engine',
    shortTag: 'Deposit Booking',
    icon: '📅',
    targetAudience: 'High-end beauty salons, barbershops, auto mechanics, event centers.',
    painPoint: 'No-shows. Customers book appointments, tie up equipment or slots, and fail to turn up without consequence.',
    solutionSummary: 'A calendar scheduling widget that requires a mandatory non-refundable booking deposit (e.g. ₦5,000 via local card/transfer) before confirming the slot, followed by automated SMS/WhatsApp calendar reminders.',
    monetizationPitch: {
      monthlyRetainerNgn: '₦0 / month (Zero Monthly Fees • 100% Lifetime Setup)',
      setupFeeNgn: '₦55,000 One-Time Setup (₦25,000 Deposit to Start)',
      headline: 'Cut no-shows to zero and collect upfront commitments automatically.',
      coreHook: 'Locks appointment slots only upon verified ₦5k deposit, syncing to Google Calendar and dispatching reminder notes.',
      zeroMonthlySubscription: '₦0 / month (Zero monthly software subscriptions)',
      failSafeGuarantee: '100% Fail-Safe: Instant automated reminder SMS sent 3 hours ahead ensures 96%+ arrival rate'
    },
    sampleCalculation: (inputs: { monthlyBookings?: number; avgServiceFeeNgn?: number; noShowRatePercent?: number }) => {
      const bookings = inputs.monthlyBookings || 90;
      const avgFee = inputs.avgServiceFeeNgn || 18000;
      const noShowRate = (inputs.noShowRatePercent || 25) / 100;
      const monthlyNoShows = Math.round(bookings * noShowRate);
      const lostRevenueNgn = monthlyNoShows * avgFee;
      const recoveredRevenueNgn = Math.round(lostRevenueNgn * 0.85); // 85% reduced no-shows
      return {
        monthlyBookings: bookings,
        monthlyNoShowsPrevented: monthlyNoShows,
        recoveredRevenueNgn,
        depositPerSlotNgn: 5000
      };
    },
    buildWhatsAppPitchUrl: (businessName, area = 'Lagos', adminPhone = '2348022791227') => {
      const msg = `Hello ${businessName} Salon & Studio Team!\n\nNo-shows who book chairs and disappear cost salons hundreds of thousands monthly. We built an Automated Calendar & Deposit Lock Widget for your salon:\n\n👉 Test Demo: https://www.bethelmindanalytics.com/tools/deposit-booking\n\n1-Time Setup, ₦0 Monthly Subscriptions. Locks reservations with ₦5k deposits automatically. May I show you a demo?`;
      return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    }
  },

  // ── 7. Tenant Service Charge & Rent Escrow Manager ───────────────────────────
  tenant_escrow_manager: {
    id: 'tenant_escrow_manager',
    name: 'Tenant Service Charge & Rent Escrow Manager',
    shortTag: 'Estate Levy Portal',
    icon: '🏢',
    targetAudience: 'Private estate CDAs, facility managers, commercial plaza operators.',
    painPoint: 'Chasing 30 different tenants across an estate or shopping plaza for diesel levies, security dues, and water maintenance fees via scattered paper receipts.',
    solutionSummary: 'A resident/tenant portal on the estate website that automatically generates monthly levy invoices, accepts bank transfers, issues instant digital clearance receipts, and sends automated reminder notices to defaulters.',
    monetizationPitch: {
      monthlyRetainerNgn: '₦0 / month (Zero Monthly Fees • 100% Lifetime Setup)',
      setupFeeNgn: '₦120,000 One-Time Setup (₦60,000 Deposit to Start)',
      headline: 'Automate your entire estate levy collection and end audit disputes forever.',
      coreHook: 'Generates automated monthly tenant bills, verifies transfer receipts, and issues gate pass digital codes.',
      zeroMonthlySubscription: '₦0 / month (Zero monthly platform fees)',
      failSafeGuarantee: '100% Fail-Safe: Dual digital receipts + gate code clearance ensures zero billing disputes'
    },
    sampleCalculation: (inputs: { unitsCount?: number; monthlyLevyPerUnitNgn?: number; defaultRatePercent?: number }) => {
      const units = inputs.unitsCount || 48;
      const levy = inputs.monthlyLevyPerUnitNgn || 35000;
      const monthlyBilledNgn = units * levy;
      const defaultRate = (inputs.defaultRatePercent || 30) / 100;
      const recoveredArrearsNgn = Math.round(monthlyBilledNgn * defaultRate * 0.70); // 70% recovered
      return {
        totalUnits: units,
        monthlyBilledNgn,
        recoveredArrearsNgn,
        annualLevyYieldNgn: monthlyBilledNgn * 12
      };
    },
    buildWhatsAppPitchUrl: (businessName, area = 'Lagos', adminPhone = '2348022791227') => {
      const msg = `Hello Facility Management at ${businessName}!\n\nChasing tenants across your property for diesel and security levies via manual receipts is stressful. We pre-built an Estate Service Charge & Gate Pass Clearance Portal tailored for ${businessName}:\n\n👉 Test Demo: https://www.bethelmindanalytics.com/tools/estate-levy\n\n1-Time Setup Fee, ₦0 Monthly Subscriptions. Reconciles transfers and ends disputes. Let's activate this for your estate.`;
      return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    }
  },

  // ── 8. Construction & Interior Finishing Material Estimator ─────────────────
  construction_material_estimator: {
    id: 'construction_material_estimator',
    name: 'Construction & Interior Finishing Material Estimator',
    shortTag: 'Artisan BOQ Estimator',
    icon: '🏗️',
    targetAudience: 'Tilers, POP plasterers, painters, block makers, roofing contractors.',
    painPoint: 'Clients suspecting artisans of over-billing them for materials, creating long arguments before projects start.',
    solutionSummary: 'A standardized quote builder where clients input floor space (in square meters) or wall perimeter to receive an exact bill of quantities (bags of cement, bundles of zinc, square meters of tiles, paint buckets).',
    monetizationPitch: {
      monthlyRetainerNgn: '₦0 / month (Zero Monthly Fees • 100% Lifetime Setup)',
      setupFeeNgn: '₦65,000 One-Time Setup (₦35,000 Deposit to Start)',
      headline: 'Win high-budget clients by presenting corporate, transparent quotes in 2 minutes.',
      coreHook: 'Standardized m² load calculators generating transparent material bills that eliminate client distrust.',
      zeroMonthlySubscription: '₦0 / month (One-time setup • 100% permanent ownership)',
      failSafeGuarantee: '100% Fail-Safe: Instant WhatsApp shareable BOQ breakdown with locked material formulas'
    },
    sampleCalculation: (inputs: { projectType?: 'tiling' | 'painting' | 'pop_ceiling'; squareMeters?: number }) => {
      const type = inputs.projectType || 'tiling';
      const areaM2 = inputs.squareMeters || 120;
      let materialsSummary = '';
      let estimatedCostNgn = 0;

      if (type === 'tiling') {
        const cartons = Math.ceil(areaM2 / 1.44);
        const cementBags = Math.ceil(areaM2 / 4.5);
        estimatedCostNgn = (cartons * 8500) + (cementBags * 10500) + (areaM2 * 2200); // tiles + cement + labor
        materialsSummary = `${cartons} cartons of tiles (60x60), ${cementBags} bags of Dangote 42.5R cement`;
      } else if (type === 'painting') {
        const buckets = Math.ceil(areaM2 / 40);
        estimatedCostNgn = (buckets * 32000) + (areaM2 * 800);
        materialsSummary = `${buckets} drums of acrylic emulsion paint, primer & rollers`;
      } else {
        const sheets = Math.ceil(areaM2 / 2.88);
        estimatedCostNgn = (sheets * 6500) + (areaM2 * 3000);
        materialsSummary = `${sheets} sheets of POP board, fiber mesh, cornice molds & binding wire`;
      }

      return {
        projectType: type,
        squareMeters: areaM2,
        materialsSummary,
        estimatedTotalCostNgn: estimatedCostNgn,
        depositRequired50Ngn: Math.round(estimatedCostNgn * 0.5)
      };
    },
    buildWhatsAppPitchUrl: (businessName, area = 'Lagos', adminPhone = '2348022791227') => {
      const msg = `Hello ${businessName} Engineering Team!\n\nClients arguing over material estimates delays projects and causes distrust. We built an Interactive Square Meter Material & BOQ Quoter for your construction firm:\n\n👉 Test Demo: https://www.bethelmindanalytics.com/tools/construction-estimator\n\n1-Time Setup, ₦0 Monthly Subscriptions. Delivers professional estimates in 2 minutes. Let's activate this on your website.`;
      return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    }
  },

  // ── 9. Private School Term Fee Portal with Result Gating ────────────────────
  school_fee_result_gating: {
    id: 'school_fee_result_gating',
    name: 'Private School Term Fee Portal with Result Gating',
    shortTag: 'School Fee Gate',
    icon: '🎓',
    targetAudience: 'Private nursery, primary, and secondary schools.',
    painPoint: 'Parents owing tuition well past midterm exams, making it impossible for proprietors to pay teacher salaries on time.',
    solutionSummary: 'A school management widget integrated into the school claimed site that hosts end-of-term student report cards behind a fee-clearance gate (students cannot view or download term results until school fees show as reconciled).',
    monetizationPitch: {
      monthlyRetainerNgn: '₦0 / term (Zero Term Retainers • 100% Lifetime Portal Setup)',
      setupFeeNgn: '₦85,000 One-Time Setup (₦45,000 Deposit to Start)',
      headline: 'Collect 95% of school fees before midterm without arguing with parents.',
      coreHook: 'Locks digital student report cards behind a verified fee-clearance portal with instant receipt generation.',
      zeroMonthlySubscription: '₦0 / term (Zero recurring portal fees forever)',
      failSafeGuarantee: '100% Fail-Safe: Instant Paystack/OPay reconciliation with PIN-protected digital report card unlocks'
    },
    sampleCalculation: (inputs: { studentCount?: number; termFeePerChildNgn?: number; defaultRatePercent?: number }) => {
      const students = inputs.studentCount || 220;
      const termFee = inputs.termFeePerChildNgn || 85000;
      const totalExpectedTermNgn = students * termFee;
      const defaultRate = (inputs.defaultRatePercent || 25) / 100;
      const acceleratedCollectionNgn = Math.round(totalExpectedTermNgn * defaultRate * 0.85); // 85% recovered before report card day
      return {
        studentCount: students,
        termFeePerChildNgn: termFee,
        totalExpectedTermNgn,
        acceleratedCollectionNgn,
        reconciledPercentageProjected: 95
      };
    },
    buildWhatsAppPitchUrl: (businessName, area = 'Lagos', adminPhone = '2348022791227') => {
      const msg = `Good day Proprietor & Management at ${businessName}!\n\nChasing parents for term fees causes friction and delays teacher salaries. We built an Automated Term Fee & Result Clearance Portal tailored for ${businessName}:\n\n👉 Test Demo: https://www.bethelmindanalytics.com/tools/school-fee-gate\n\n1-Time Setup Fee, ₦0 Term Fees. Report cards unlock instantly upon verified clearance. May I show you a demo?`;
      return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    }
  },

  // ── 10. Bulk Agribusiness Feed & Input Order Consolidator ───────────────────
  agribusiness_order_consolidator: {
    id: 'agribusiness_order_consolidator',
    name: 'Bulk Agribusiness Feed & Input Order Consolidator',
    shortTag: 'Agro Batch Order',
    icon: '🌾',
    targetAudience: 'Poultry, catfish, and livestock feed millers, agro-allied chemical distributors.',
    painPoint: 'Smallholder farmers ordering feed and day-old chicks in chaotic batches across phone calls, leading to delivery mix-ups and stockouts.',
    solutionSummary: 'A batch-order aggregation portal on the miller site where local farmers lock in their weekly feed/medication bags, select scheduled delivery or pickup dates, and settle via invoice.',
    monetizationPitch: {
      monthlyRetainerNgn: '₦0 / month (Zero Monthly Fees • 100% Lifetime Setup)',
      setupFeeNgn: '₦85,000 One-Time Setup (₦45,000 Deposit to Start)',
      headline: 'Automate smallholder order batches and eliminate farm dispatch chaos.',
      coreHook: 'Farmers group orders by batch, select delivery routes, and pay online, giving millers predictable weekly volume.',
      zeroMonthlySubscription: '₦0 / month (Zero recurring platform fees)',
      failSafeGuarantee: '100% Fail-Safe: Instant SMS order confirmations + live supplier pickup batches'
    },
    sampleCalculation: (inputs: { weeklyFarmersCount?: number; avgBagsPerOrder?: number; bagPriceNgn?: number }) => {
      const farmers = inputs.weeklyFarmersCount || 35;
      const bags = inputs.avgBagsPerOrder || 25;
      const pricePerBag = inputs.bagPriceNgn || 18500;
      const weeklyTurnoverNgn = farmers * bags * pricePerBag;
      const monthlyTurnoverNgn = weeklyTurnoverNgn * 4;
      return {
        weeklyFarmersCount: farmers,
        totalBagsWeekly: farmers * bags,
        weeklyTurnoverNgn,
        monthlyTurnoverNgn,
        routeOptimizationSavedHours: 18
      };
    },
    buildWhatsAppPitchUrl: (businessName, area = 'Lagos', adminPhone = '2348022791227') => {
      const msg = `Hello ${businessName} Feed & Agro Mill Team!\n\nManaging weekly farmer feed orders across phone calls causes delivery confusion and stockouts. We built an Automated Batch Order & Pickup Scheduler for your mill:\n\n👉 Test Demo: https://www.bethelmindanalytics.com/tools/agri-order\n\n1-Time Setup Fee, ₦0 Monthly Subscriptions. Farmers lock orders weekly and settle via verified invoices. Let us connect your distributors this week.`;
      return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    }
  }
};
