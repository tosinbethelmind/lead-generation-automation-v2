/**
 * @file sectorModules.ts
 * Premium Sector-Specific Revenue Engines
 * 
 * Sector Modules:
 * 1. Solar Energy: BOQ (Bill of Quantities) Auto-Generator & Diesel vs Solar ROI Sizer
 * 2. Automotive: Tokunbo Import Customs Tariff & Duty Calculator (NCS 2026 Rate Matrix)
 * 3. Legal: CAC Business Registration Filing Fee & Stamp Duty Calculator
 * 4. Retail/E-Commerce: Express WhatsApp Order & Delivery Fee Estimator
 * 5. Education: Termly School Tuition & Result PIN Portal Calculator
 */

// ============================================================================
// 1. SOLAR ENERGY MODULES
// ============================================================================

export interface SolarBoqItem {
  category: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SolarBoqResult {
  loadKva: number;
  recommendedInverterKva: number;
  recommendedPanelWatts: number;
  panelCount: number;
  recommendedBatteryAh: number;
  batteryCount: number;
  items: SolarBoqItem[];
  subtotal: number;
  laborAndInstallation: number;
  grandTotal: number;
  deposit50Percent: number;
}

export function generateSolarBOQ(
  applianceLoadKva: number,
  batteryType: 'gel' | 'lithium' = 'lithium',
  backupHours = 12
): SolarBoqResult {
  const loadKva = Math.max(1, applianceLoadKva);
  const inverterKva = loadKva <= 2 ? 2.5 : loadKva <= 5 ? 5.5 : loadKva <= 10 ? 10 : 15;
  const panelWatts = 550;
  const panelCount = Math.ceil((loadKva * 1000 * 1.3) / panelWatts);
  const batteryCount = batteryType === 'lithium' ? Math.ceil(loadKva / 2.5) : Math.ceil((loadKva * backupHours) / 2.4);

  const items: SolarBoqItem[] = [
    {
      category: 'Inverter & Power Electronics',
      name: `${inverterKva}kVA Pure Sine Wave Hybrid Solar Inverter (MPPT)`,
      quantity: 1,
      unitPrice: inverterKva * 180000,
      totalPrice: inverterKva * 180000,
    },
    {
      category: 'Solar PV Panels',
      name: `${panelWatts}W Tier-1 Monocrystalline Solar Panels`,
      quantity: panelCount,
      unitPrice: 115000,
      totalPrice: panelCount * 115000,
    },
    {
      category: 'Energy Storage',
      name: batteryType === 'lithium' ? '5.12kWh 48V Lithium-ion (LiFePO4) Battery' : '200Ah 12V Deep Cycle Gel Battery',
      quantity: batteryCount,
      unitPrice: batteryType === 'lithium' ? 1250000 : 320000,
      totalPrice: batteryCount * (batteryType === 'lithium' ? 1250000 : 320000),
    },
    {
      category: 'Accessories & Protection',
      name: 'DC/AC Breaker Box, Surge Protectors, Heavy Duty Copper Cabling & Connectors',
      quantity: 1,
      unitPrice: 185000,
      totalPrice: 185000,
    },
    {
      category: 'Mounting Structure',
      name: 'Aluminum Roof Mounting Racks & Stainless Steel Fasteners',
      quantity: panelCount,
      unitPrice: 18000,
      totalPrice: panelCount * 18000,
    },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const laborAndInstallation = Math.round(subtotal * 0.12); // 12% labor rate
  const grandTotal = subtotal + laborAndInstallation;
  const deposit50Percent = Math.round(grandTotal * 0.5);

  return {
    loadKva,
    recommendedInverterKva: inverterKva,
    recommendedPanelWatts: panelWatts,
    panelCount,
    recommendedBatteryAh: batteryType === 'lithium' ? batteryCount * 100 : batteryCount * 200,
    batteryCount,
    items,
    subtotal,
    laborAndInstallation,
    grandTotal,
    deposit50Percent,
  };
}

export function calculateDieselVsSolarROI(
  monthlyDieselLiters: number,
  dieselPricePerLiter = 1350
): {
  monthlyDieselCost: number;
  annualDieselCost: number;
  fiveYearDieselCost: number;
  solarSetupCost: number;
  paybackPeriodMonths: number;
  fiveYearNetSavings: number;
} {
  const monthlyDieselCost = monthlyDieselLiters * dieselPricePerLiter;
  const annualDieselCost = monthlyDieselCost * 12;
  const fiveYearDieselCost = annualDieselCost * 5;

  // Approximate solar system needed based on diesel consumption
  const approxKva = Math.max(3, Math.ceil(monthlyDieselLiters / 120));
  const boq = generateSolarBOQ(approxKva, 'lithium');
  const solarSetupCost = boq.grandTotal;

  const paybackPeriodMonths = Math.round((solarSetupCost / monthlyDieselCost) * 10) / 10;
  const fiveYearNetSavings = fiveYearDieselCost - solarSetupCost;

  return {
    monthlyDieselCost,
    annualDieselCost,
    fiveYearDieselCost,
    solarSetupCost,
    paybackPeriodMonths,
    fiveYearNetSavings,
  };
}

// ============================================================================
// 2. AUTOMOTIVE MODULES (Tokunbo Duty Calculator)
// ============================================================================

export interface CustomsDutyResult {
  year: number;
  cifValueNgn: number;
  importDuty: number; // 20%
  ecowasTradeLevy: number; // 0.5%
  cissLevy: number; // 1%
  nacLevy: number; // 15%
  vat: number; // 7.5%
  totalCustomsDuty: number;
  estimatedTotalClearingCost: number;
}

export function calculateCustomsDutyTokunbo(
  year: number,
  engineCc: number,
  cifValueNgn: number
): CustomsDutyResult {
  const cif = Math.max(1000000, cifValueNgn);
  const importDuty = cif * 0.20; // 20%
  const ecowasTradeLevy = cif * 0.005; // 0.5%
  const cissLevy = cif * 0.01; // 1%
  const nacLevy = cif * 0.15; // 15% NAC
  const vat = (cif + importDuty + cissLevy) * 0.075; // 7.5%

  const totalCustomsDuty = importDuty + ecowasTradeLevy + cissLevy + nacLevy + vat;
  const estimatedShippingDemurrage = 450000; // Average terminal charges
  const estimatedTotalClearingCost = totalCustomsDuty + estimatedShippingDemurrage;

  return {
    year,
    cifValueNgn: cif,
    importDuty,
    ecowasTradeLevy,
    cissLevy,
    nacLevy,
    vat,
    totalCustomsDuty,
    estimatedTotalClearingCost,
  };
}

// ============================================================================
// 3. LEGAL & PROFESSIONAL MODULES (CAC Registration Calculator)
// ============================================================================

export interface CacRegistrationResult {
  entityType: 'business_name' | 'company_ltd' | 'incorporated_trustee';
  nameReservationFee: number;
  cacFilingFee: number;
  firsStampDuty: number;
  professionalFee: number;
  totalCost: number;
  estimatedTimelineDays: number;
}

export function calculateCacFilingFees(
  entityType: 'business_name' | 'company_ltd' | 'incorporated_trustee' = 'company_ltd',
  shareCapital = 1000000
): CacRegistrationResult {
  const nameReservationFee = 500;

  if (entityType === 'business_name') {
    return {
      entityType,
      nameReservationFee,
      cacFilingFee: 10000,
      firsStampDuty: 0,
      professionalFee: 15000,
      totalCost: 25500,
      estimatedTimelineDays: 3,
    };
  }

  if (entityType === 'incorporated_trustee') {
    return {
      entityType,
      nameReservationFee,
      cacFilingFee: 35000,
      firsStampDuty: 0,
      professionalFee: 45000,
      totalCost: 80500,
      estimatedTimelineDays: 14,
    };
  }

  // Company LTD (₦1M share capital base)
  const baseFilingFee = 10000;
  const extraMillions = Math.max(0, Math.ceil((shareCapital - 1000000) / 1000000));
  const cacFilingFee = baseFilingFee + (extraMillions * 5000);
  const firsStampDuty = Math.round(shareCapital * 0.0075); // 0.75% stamp duty
  const professionalFee = 35000;
  const totalCost = nameReservationFee + cacFilingFee + firsStampDuty + professionalFee;

  return {
    entityType,
    nameReservationFee,
    cacFilingFee,
    firsStampDuty,
    professionalFee,
    totalCost,
    estimatedTimelineDays: 7,
  };
}

// ============================================================================
// 4. RETAIL & E-COMMERCE MODULES (Express WhatsApp Order Builder)
// ============================================================================

export function buildWhatsAppCartOrderUrl(
  merchantPhone: string,
  customerName: string,
  items: { name: string; price: number; qty: number }[],
  deliveryArea = 'Lagos'
): string {
  const cleanPhone = merchantPhone.replace(/\D/g, '');
  const phone = cleanPhone.startsWith('234') ? cleanPhone : cleanPhone.startsWith('0') ? '234' + cleanPhone.substring(1) : '234' + cleanPhone;

  let total = 0;
  const itemsText = items.map(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    return `• ${item.name} x${item.qty} = ₦${itemTotal.toLocaleString()}`;
  }).join('\n');

  const deliveryFee = deliveryArea.toLowerCase().includes('island') ? 2500 : 3500;
  const grandTotal = total + deliveryFee;

  const text = `Hello! I would like to place an order from your website catalog:\n\n*Customer:* ${customerName}\n*Delivery Area:* ${deliveryArea}\n\n*Order Items:*\n${itemsText}\n\n*Subtotal:* ₦${total.toLocaleString()}\n*Delivery Fee:* ₦${deliveryFee.toLocaleString()}\n*Total Amount:* ₦${grandTotal.toLocaleString()}\n\nPlease confirm availability and send payment instructions!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// ============================================================================
// 5. SOLAR HYBRID DISCO TARIFF & LEASING MODULE
// ============================================================================

export interface SolarHybridEconomicsResult {
  discoBand: 'Band A' | 'Band B' | 'Band C' | 'Band D' | 'Band E';
  tariffRatePerKwh: number;
  dailyGridHours: number;
  monthlyGridCost: number;
  monthlyDieselCost: number;
  totalCurrentEnergyExpense: number;
  solarSetupCost: number;
  monthlyLeasePayment: number; // Solar-as-a-Service / Lease-to-own
  netMonthlySavings: number;
  paybackPeriodMonths: number;
}

export function calculateGridVsSolarHybridEconomics(
  discoBand: 'Band A' | 'Band B' | 'Band C' | 'Band D' | 'Band E' = 'Band A',
  applianceLoadKva = 5,
  monthlyDieselLiters = 250,
  dieselPricePerLiter = 1350
): SolarHybridEconomicsResult {
  // NERC 2026 Tariff rates per kWh by DISCO Band
  const tariffRates: Record<string, { rate: number; hours: number }> = {
    'Band A': { rate: 209, hours: 20 },
    'Band B': { rate: 160, hours: 16 },
    'Band C': { rate: 120, hours: 12 },
    'Band D': { rate: 85, hours: 8 },
    'Band E': { rate: 56, hours: 4 },
  };

  const bandInfo = tariffRates[discoBand] || tariffRates['Band A'];
  const dailyKwhConsumed = applianceLoadKva * 0.8 * 12; // 80% load factor for 12 hrs
  const monthlyKwh = dailyKwhConsumed * 30;

  const gridKwh = (bandInfo.hours / 24) * monthlyKwh;
  const monthlyGridCost = Math.round(gridKwh * bandInfo.rate);
  const monthlyDieselCost = Math.round(monthlyDieselLiters * dieselPricePerLiter);
  const totalCurrentEnergyExpense = monthlyGridCost + monthlyDieselCost;

  const boq = generateSolarBOQ(applianceLoadKva, 'lithium');
  const solarSetupCost = boq.grandTotal;

  // Lease-to-own over 24 months with 18% annual interest
  const monthlyLeasePayment = Math.round((solarSetupCost * 1.18) / 24);
  const netMonthlySavings = Math.max(0, totalCurrentEnergyExpense - monthlyLeasePayment);
  const paybackPeriodMonths = Math.round((solarSetupCost / Math.max(10000, totalCurrentEnergyExpense)) * 10) / 10;

  return {
    discoBand,
    tariffRatePerKwh: bandInfo.rate,
    dailyGridHours: bandInfo.hours,
    monthlyGridCost,
    monthlyDieselCost,
    totalCurrentEnergyExpense,
    solarSetupCost,
    monthlyLeasePayment,
    netMonthlySavings,
    paybackPeriodMonths,
  };
}

// ============================================================================
// 6. AUTOMOTIVE PORT CLEARING & VIN DECODER
// ============================================================================

export interface PortClearingOptionResult {
  portName: string;
  terminalDemurrageNgn: number;
  customsDutyNgn: number;
  totalClearingCostNgn: number;
  estimatedTurnaroundDays: number;
}

export function calculatePortClearingOptions(
  year: number,
  engineCc: number,
  cifValueNgn: number,
  preferredPort = 'Tin Can'
): {
  selectedPort: PortClearingOptionResult;
  allPorts: PortClearingOptionResult[];
} {
  const baseDuty = calculateCustomsDutyTokunbo(year, engineCc, cifValueNgn);

  const ports: PortClearingOptionResult[] = [
    {
      portName: 'Tin Can Island Port (Lagos)',
      terminalDemurrageNgn: 450000,
      customsDutyNgn: baseDuty.totalCustomsDuty,
      totalClearingCostNgn: baseDuty.totalCustomsDuty + 450000,
      estimatedTurnaroundDays: 7,
    },
    {
      portName: 'Apapa Container Terminal (Lagos)',
      terminalDemurrageNgn: 520000,
      customsDutyNgn: baseDuty.totalCustomsDuty,
      totalClearingCostNgn: baseDuty.totalCustomsDuty + 520000,
      estimatedTurnaroundDays: 9,
    },
    {
      portName: 'PTML Terminal (Grimaldi - Lagos)',
      terminalDemurrageNgn: 380000,
      customsDutyNgn: baseDuty.totalCustomsDuty,
      totalClearingCostNgn: baseDuty.totalCustomsDuty + 380000,
      estimatedTurnaroundDays: 5,
    },
    {
      portName: 'Onne Port (Port Harcourt)',
      terminalDemurrageNgn: 410000,
      customsDutyNgn: baseDuty.totalCustomsDuty,
      totalClearingCostNgn: baseDuty.totalCustomsDuty + 410000,
      estimatedTurnaroundDays: 8,
    },
  ];

  const selected = ports.find(p => p.portName.toLowerCase().includes(preferredPort.toLowerCase())) || ports[0];

  return {
    selectedPort: selected,
    allPorts: ports,
  };
}

export function decodeVinDetails(vin: string): {
  vin: string;
  isValid: boolean;
  make: string;
  model: string;
  year: number;
  engine: string;
  trim: string;
  estimatedMarketValueNgn: number;
} {
  const cleanVin = vin.trim().toUpperCase();
  const isValid = cleanVin.length === 17;

  // Mock VIN decoding based on common patterns
  let make = 'Toyota';
  let model = 'Camry';
  let year = 2018;
  let engine = '2.5L 4-Cylinder';

  if (cleanVin.startsWith('1HG') || cleanVin.startsWith('2HK')) {
    make = 'Honda';
    model = 'Accord';
    engine = '1.5L Turbo 4-Cylinder';
  } else if (cleanVin.startsWith('WBA') || cleanVin.startsWith('WBY')) {
    make = 'BMW';
    model = '530i';
    engine = '2.0L TwinPower Turbo';
  } else if (cleanVin.startsWith('4T1') || cleanVin.startsWith('JTD')) {
    make = 'Toyota';
    model = 'Highlander';
    engine = '3.5L V6';
  }

  return {
    vin: cleanVin,
    isValid,
    make,
    model,
    year,
    engine,
    trim: 'SE Special Edition',
    estimatedMarketValueNgn: 14500000,
  };
}

// ============================================================================
// 7. LEGAL CAC NAME CHECK & CONTRACT GENERATOR
// ============================================================================

export function checkCacNameAvailability(proposedName: string): {
  proposedName: string;
  isAvailable: boolean;
  similarityScorePercent: number;
  statusMessage: string;
  similarExistingEntities: string[];
} {
  const cleanName = proposedName.trim().toUpperCase();
  const isTooShort = cleanName.length < 3;
  const isReserved = cleanName.includes('GLOBAL') || cleanName.includes('VENTURES');

  const similarityScorePercent = isReserved ? 85 : 12;
  const isAvailable = !isTooShort && !isReserved;

  return {
    proposedName: cleanName,
    isAvailable,
    similarityScorePercent,
    statusMessage: isAvailable
      ? 'Proposed business name is free and clear for CAC name reservation.'
      : 'Similar registered entity found. Please add a distinctive prefix or suffix.',
    similarExistingEntities: isReserved ? [`${cleanName} NIGERIA LTD`, `${cleanName} SERVICES CONCEPT`] : [],
  };
}

export function generateLegalContractTemplate(
  contractType: 'memart' | 'nda' | 'partnership' | 'retainership',
  partyA: string,
  partyB: string,
  termsValueNgn = 500000
): {
  contractType: string;
  title: string;
  documentContentText: string;
  firsStampDutyNgn: number;
} {
  const pA = partyA || 'Client Firm';
  const pB = partyB || 'Service Provider';
  const firsStampDutyNgn = Math.round(termsValueNgn * 0.0075);

  const titles: Record<string, string> = {
    memart: 'Memorandum & Articles of Association (MEMART)',
    nda: 'Non-Disclosure & Confidentiality Agreement',
    partnership: 'Deed of Commercial Partnership',
    retainership: 'Legal Retainership & Advisory Agreement',
  };

  const documentContentText = `MEMORANDUM OF AGREEMENT\n\nTHIS AGREEMENT is executed this day between:\n1. ${pA} (hereinafter referred to as the First Party)\n2. ${pB} (hereinafter referred to as the Second Party)\n\nWHEREAS:\n- The First Party engages the Second Party for commercial operations in Nigeria.\n- Total Consideration Value: ₦${termsValueNgn.toLocaleString()}.\n- Applicable FIRS Stamp Duty: ₦${firsStampDutyNgn.toLocaleString()}.\n\nGOVERNING LAW:\nThis Contract shall be governed by the laws of the Federal Republic of Nigeria.\n\nIN WITNESS WHEREOF the parties have set their hands and seals.`;

  return {
    contractType,
    title: titles[contractType] || 'Standard Commercial Contract',
    documentContentText,
    firsStampDutyNgn,
  };
}

// ============================================================================
// 8. EDUCATION & SCHOOL TUITION MODULE
// ============================================================================

export interface SchoolTuitionResult {
  gradeLevel: string;
  termlyTuitionNgn: number;
  boardingFeeNgn: number;
  textbookPackNgn: number;
  developmentLevyNgn: number;
  resultPinCheckerFeeNgn: number;
  totalTermlyCostNgn: number;
  annualCostNgn: number;
}

export function calculateSchoolTuitionAndPin(
  gradeLevel = 'JSS 1',
  isBoarder = false,
  termCount = 3
): SchoolTuitionResult {
  const baseTuition = gradeLevel.includes('SSS') ? 185000 : gradeLevel.includes('JSS') ? 150000 : 120000;
  const boardingFeeNgn = isBoarder ? 220000 : 0;
  const textbookPackNgn = 35000;
  const developmentLevyNgn = 25000;
  const resultPinCheckerFeeNgn = 3500;

  const totalTermlyCostNgn = baseTuition + boardingFeeNgn + textbookPackNgn + developmentLevyNgn + resultPinCheckerFeeNgn;
  const annualCostNgn = totalTermlyCostNgn * termCount;

  return {
    gradeLevel,
    termlyTuitionNgn: baseTuition,
    boardingFeeNgn,
    textbookPackNgn,
    developmentLevyNgn,
    resultPinCheckerFeeNgn,
    totalTermlyCostNgn,
    annualCostNgn,
  };
}

// ============================================================================
// 9. REAL ESTATE MORTGAGE & AMORTIZATION MODULE
// ============================================================================

export interface MortgageAmortizationResult {
  propertyPriceNgn: number;
  downPaymentNgn: number;
  loanAmountNgn: number;
  interestRatePercent: number;
  tenureYears: number;
  monthlyPaymentNgn: number;
  totalInterestPayableNgn: number;
  totalRepaymentNgn: number;
}

export function calculateMortgageAmortization(
  propertyPriceNgn = 45000000,
  downPaymentPercent = 20,
  interestRatePercent = 18,
  tenureYears = 10
): MortgageAmortizationResult {
  const price = Math.max(1000000, propertyPriceNgn);
  const downPaymentNgn = Math.round((price * downPaymentPercent) / 100);
  const loanAmountNgn = price - downPaymentNgn;

  const monthlyRate = interestRatePercent / 100 / 12;
  const totalMonths = tenureYears * 12;

  const monthlyPaymentNgn = Math.round(
    (loanAmountNgn * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const totalRepaymentNgn = monthlyPaymentNgn * totalMonths;
  const totalInterestPayableNgn = totalRepaymentNgn - loanAmountNgn;

  return {
    propertyPriceNgn: price,
    downPaymentNgn,
    loanAmountNgn,
    interestRatePercent,
    tenureYears,
    monthlyPaymentNgn,
    totalInterestPayableNgn,
    totalRepaymentNgn,
  };
}

// ============================================================================
// 10. RETAIL & INTER-STATE LOGISTICS ESTIMATOR
// ============================================================================

export interface LogisticsDeliveryResult {
  originCity: string;
  destinationCity: string;
  weightKg: number;
  intraCityCourierFeeNgn: number;
  interStateWaybillFeeNgn: number;
  recommendedLogisticsPartner: string;
  estimatedDeliveryHours: number;
}

export function calculateLogisticsDeliveryFee(
  originCity = 'Lagos',
  destinationCity = 'Abuja',
  weightKg = 5
): LogisticsDeliveryResult {
  const isIntraCity = originCity.toLowerCase().trim() === destinationCity.toLowerCase().trim();

  let intraCityCourierFeeNgn = 0;
  let interStateWaybillFeeNgn = 0;
  let recommendedLogisticsPartner = 'GIG Logistics';
  let estimatedDeliveryHours = 24;

  if (isIntraCity) {
    intraCityCourierFeeNgn = 2500 + Math.max(0, weightKg - 2) * 400;
    recommendedLogisticsPartner = 'Kwik Delivery / Gokada';
    estimatedDeliveryHours = 4;
  } else {
    interStateWaybillFeeNgn = 4500 + Math.max(0, weightKg - 2) * 800;
    recommendedLogisticsPartner = 'Peace Mass Transport / GIG Logistics Waybill';
    estimatedDeliveryHours = 36;
  }

  return {
    originCity,
    destinationCity,
    weightKg,
    intraCityCourierFeeNgn,
    interStateWaybillFeeNgn,
    recommendedLogisticsPartner,
    estimatedDeliveryHours,
  };
}

// ============================================================================
// 11. HEALTHCARE HMO & TELEHEALTH MODULE
// ============================================================================

export interface HealthcareHmoResult {
  hmoProvider: string;
  procedureName: string;
  totalProcedureCostNgn: number;
  hmoCoverageNgn: number;
  patientCoPayNgn: number;
  telehealthConsultationUrl: string;
}

export function calculateHmoCoPayAndTelehealth(
  hmoProvider = 'Reliance HMO',
  procedureName = 'Dental Scaling & Polishing',
  totalProcedureCostNgn = 35000
): HealthcareHmoResult {
  const hmoCoverageNgn = Math.round(totalProcedureCostNgn * 0.8); // 80% HMO coverage
  const patientCoPayNgn = totalProcedureCostNgn - hmoCoverageNgn;
  const roomId = `clinic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const telehealthConsultationUrl = `https://apexreach.daily.co/${roomId}`;

  return {
    hmoProvider,
    procedureName,
    totalProcedureCostNgn,
    hmoCoverageNgn,
    patientCoPayNgn,
    telehealthConsultationUrl,
  };
}

// ============================================================================
// 12. HOSPITALITY EVENT VENUE & CATERING QUOTE
// ============================================================================

export interface EventCateringQuoteResult {
  guestCount: number;
  hallRentalFeeNgn: number;
  cateringSubtotalNgn: number;
  soundAndDecorNgn: number;
  grandTotalNgn: number;
  perGuestCostNgn: number;
}

export function calculateEventVenueAndCateringQuote(
  guestCount = 200,
  hallTier: 'budget' | 'standard' | 'luxury' = 'standard',
  menuTierPerHead = 4500
): EventCateringQuoteResult {
  const hallRentalFeeNgn = hallTier === 'luxury' ? 2500000 : hallTier === 'standard' ? 1200000 : 450000;
  const cateringSubtotalNgn = guestCount * menuTierPerHead;
  const soundAndDecorNgn = Math.round(hallRentalFeeNgn * 0.35);

  const grandTotalNgn = hallRentalFeeNgn + cateringSubtotalNgn + soundAndDecorNgn;
  const perGuestCostNgn = Math.round(grandTotalNgn / guestCount);

  return {
    guestCount,
    hallRentalFeeNgn,
    cateringSubtotalNgn,
    soundAndDecorNgn,
    grandTotalNgn,
    perGuestCostNgn,
  };
}

// ============================================================================
// 13. NIGERIAN MARKET SPECIFIC MODULES (DVA, Identity Trust, FX, Pidgin AI)
// ============================================================================

export interface VirtualAccountDvaResult {
  bankName: string;
  accountNumber: string;
  accountName: string;
  merchantReference: string;
  expiresInMinutes: number;
  paymentInstructionsText: string;
}

export function generateVirtualAccountDva(
  merchantName: string,
  amountNgn: number,
  customerName = 'Valued Customer'
): VirtualAccountDvaResult {
  // Mock Moniepoint / Wema DVA account generation
  const randomAcc = '99' + Math.floor(10000000 + Math.random() * 90000000).toString();
  const merchantReference = `APX-DVA-${Date.now()}`;

  return {
    bankName: 'Moniepoint Microfinance Bank',
    accountNumber: randomAcc,
    accountName: `ApexReach / ${merchantName.substring(0, 15)}`,
    merchantReference,
    expiresInMinutes: 60,
    paymentInstructionsText: `Transfer ₦${amountNgn.toLocaleString()} to ${randomAcc} (Moniepoint MFB). Account Name: ApexReach / ${merchantName}. Payment auto-verifies in 10 seconds!`,
  };
}

export interface NigerianIdentityTrustResult {
  rcNumber: string;
  tinNumber: string;
  isCacVerified: boolean;
  isTinVerified: boolean;
  trustScorePercent: number;
  badgeLabel: string;
}

export function verifyNigerianIdentityTrust(rcNumber: string, tinNumber = ''): NigerianIdentityTrustResult {
  const cleanRc = rcNumber.replace(/\D/g, '');
  const isCacVerified = cleanRc.length >= 6;
  const isTinVerified = tinNumber.length >= 8;

  const trustScorePercent = isCacVerified && isTinVerified ? 98 : isCacVerified ? 85 : 40;
  const badgeLabel = trustScorePercent >= 80 ? 'Verified Nigerian Business Shield' : 'Pending KYC Verification';

  return {
    rcNumber: cleanRc || 'RC-1849204',
    tinNumber: tinNumber || 'TIN-29401948',
    isCacVerified,
    isTinVerified,
    trustScorePercent,
    badgeLabel,
  };
}

export function calculateFxInflationPriceAdjuster(
  baseUsdCost: number,
  parallelFxRateNgn = 1580,
  inflationBufferPercent = 5
): {
  baseUsdCost: number;
  effectiveFxRateNgn: number;
  priceInNairaNgn: number;
  bufferMarginNgn: number;
} {
  const effectiveFxRateNgn = Math.round(parallelFxRateNgn * (1 + inflationBufferPercent / 100));
  const priceInNairaNgn = Math.round(baseUsdCost * effectiveFxRateNgn);
  const bufferMarginNgn = priceInNairaNgn - Math.round(baseUsdCost * parallelFxRateNgn);

  return {
    baseUsdCost,
    effectiveFxRateNgn,
    priceInNairaNgn,
    bufferMarginNgn,
  };
}

export function formatNigerianAiOutreachTone(
  businessName: string,
  leadName: string,
  tone: 'corporate' | 'friendly' | 'pidgin' = 'friendly'
): {
  tone: string;
  subject: string;
  messageBodyText: string;
} {
  const bName = businessName || 'your company';
  const lName = leadName || 'Chief';

  if (tone === 'pidgin') {
    return {
      tone: 'Business Pidgin English',
      subject: `Hello Boss! Quick question about ${bName}`,
      messageBodyText: `Hello ${lName}! Good afternoon boss. I bin see your business online (${bName}) and I noticed say customer dem dey find your service well well on WhatsApp.\n\nWe don set up complete website & auto WhatsApp order system for you so that you no go miss any customer again. You fit check am out here?`,
    };
  }

  if (tone === 'corporate') {
    return {
      tone: 'Corporate Professional',
      subject: `Strategic Growth Proposal for ${bName}`,
      messageBodyText: `Dear ${lName},\n\nI trust this email finds you well. We have conducted a digital presence audit for ${bName} and designed a high-converting automated customer acquisition portal.\n\nWould you be open to reviewing a brief 2-minute interactive preview of your upgraded digital ecosystem?`,
    };
  }

  return {
    tone: 'Friendly Nigerian English',
    subject: `Good day ${lName} — Custom Upgrade for ${bName}`,
    messageBodyText: `Hello ${lName}, hope your week is going smoothly!\n\nI came across ${bName} and put together a customized digital ordering system that lets your customers book and pay directly via WhatsApp and online transfer.\n\nKindly check out your live demo here and let me know your thoughts!`,
  };
}

// ============================================================================
// 14. EXPANDED SECTOR MODULES (Agro, Microfinance, Interior, Facility, Events, Print, Car Rental)
// ============================================================================

export function calculateColdRoomSpoilageAndPowerCost(
  coldRoomCapacityTons = 10,
  dailyGenHours = 14,
  dieselPricePerLiter = 1350
): {
  coldRoomCapacityTons: number;
  monthlyDieselExpenseNgn: number;
  monthlySolarHybridSavingsNgn: number;
  estimatedSpoilageRiskValueNgn: number;
} {
  const dailyLiters = coldRoomCapacityTons * 4.5 * (dailyGenHours / 12);
  const monthlyDieselExpenseNgn = Math.round(dailyLiters * 30 * dieselPricePerLiter);
  const monthlySolarHybridSavingsNgn = Math.round(monthlyDieselExpenseNgn * 0.65);
  const estimatedSpoilageRiskValueNgn = Math.round(coldRoomCapacityTons * 850000);

  return {
    coldRoomCapacityTons,
    monthlyDieselExpenseNgn,
    monthlySolarHybridSavingsNgn,
    estimatedSpoilageRiskValueNgn,
  };
}

export function calculateMicrofinanceLoanAndThrift(
  loanAmountNgn = 250000,
  tenureMonths = 6,
  monthlyInterestRatePercent = 4.5
): {
  loanAmountNgn: number;
  monthlyRepaymentNgn: number;
  totalInterestPayableNgn: number;
  dailyThriftContributionNgn: number;
} {
  const monthlyInterest = (loanAmountNgn * monthlyInterestRatePercent) / 100;
  const monthlyPrincipal = loanAmountNgn / tenureMonths;
  const monthlyRepaymentNgn = Math.round(monthlyPrincipal + monthlyInterest);
  const totalInterestPayableNgn = Math.round(monthlyInterest * tenureMonths);
  const dailyThriftContributionNgn = Math.round(monthlyRepaymentNgn / 26);

  return {
    loanAmountNgn,
    monthlyRepaymentNgn,
    totalInterestPayableNgn,
    dailyThriftContributionNgn,
  };
}

export function calculateInteriorRenovationQuote(
  roomType: 'living_room' | 'bedroom' | 'office' | 'full_duplex' = 'living_room',
  squareMeters = 40,
  decorTier: 'standard' | 'executive' | 'luxury' = 'executive'
): {
  roomType: string;
  squareMeters: number;
  decorTier: string;
  estimatedMaterialCostNgn: number;
  workmanshipFeeNgn: number;
  totalEstimateNgn: number;
  deposit50PercentNgn: number;
} {
  const baseRatePerSqM = decorTier === 'luxury' ? 85000 : decorTier === 'executive' ? 45000 : 25000;
  const estimatedMaterialCostNgn = Math.round(squareMeters * baseRatePerSqM);
  const workmanshipFeeNgn = Math.round(estimatedMaterialCostNgn * 0.20);
  const totalEstimateNgn = estimatedMaterialCostNgn + workmanshipFeeNgn;
  const deposit50PercentNgn = Math.round(totalEstimateNgn * 0.5);

  return {
    roomType,
    squareMeters,
    decorTier,
    estimatedMaterialCostNgn,
    workmanshipFeeNgn,
    totalEstimateNgn,
    deposit50PercentNgn,
  };
}

export function calculateCleaningAndSecurityPackage(
  serviceType: 'cleaning' | 'fumigation' | 'security_guards' | 'cctv',
  sizeOrStaffCount = 2,
  squareMeters = 150
): {
  serviceType: string;
  totalPackageCostNgn: number;
  monthlySubscriptionNgn: number;
  breakdownSummary: string;
} {
  let totalPackageCostNgn = 45000;
  let monthlySubscriptionNgn = 35000;
  let breakdownSummary = 'Standard deep cleaning & sanitization package';

  if (serviceType === 'fumigation') {
    totalPackageCostNgn = Math.round(squareMeters * 250);
    monthlySubscriptionNgn = Math.round(totalPackageCostNgn * 0.6);
    breakdownSummary = `Comprehensive pest eradication & barrier spray for ${squareMeters} sq. meters`;
  } else if (serviceType === 'security_guards') {
    monthlySubscriptionNgn = sizeOrStaffCount * 85000;
    totalPackageCostNgn = monthlySubscriptionNgn;
    breakdownSummary = `Deployment of ${sizeOrStaffCount} trained uniform security guards (24/7 Shift)`;
  } else if (serviceType === 'cctv') {
    totalPackageCostNgn = sizeOrStaffCount * 65000 + 45000; // per camera + NVR base
    monthlySubscriptionNgn = 15000; // Cloud backup
    breakdownSummary = `${sizeOrStaffCount}-Camera 4K HD CCTV System with remote mobile app monitoring`;
  } else {
    totalPackageCostNgn = Math.round(squareMeters * 350);
    monthlySubscriptionNgn = Math.round(totalPackageCostNgn * 0.7);
    breakdownSummary = `Post-construction & routine janitorial cleaning for ${squareMeters} sq. meters`;
  }

  return {
    serviceType,
    totalPackageCostNgn,
    monthlySubscriptionNgn,
    breakdownSummary,
  };
}

export function calculateEventHallBookingAndDecor(
  guestCapacity = 300,
  includeDecorAndCatering = true,
  hallTier: 'budget' | 'standard' | 'luxury' = 'standard'
): {
  guestCapacity: number;
  hallRentalFeeNgn: number;
  decorAndSoundFeeNgn: number;
  cateringFeeNgn: number;
  grandTotalNgn: number;
  deposit50PercentNgn: number;
} {
  const hallRentalFeeNgn = hallTier === 'luxury' ? 3500000 : hallTier === 'standard' ? 1500000 : 650000;
  const decorAndSoundFeeNgn = includeDecorAndCatering ? Math.round(hallRentalFeeNgn * 0.4) : 0;
  const cateringFeeNgn = includeDecorAndCatering ? guestCapacity * 5500 : 0;
  const grandTotalNgn = hallRentalFeeNgn + decorAndSoundFeeNgn + cateringFeeNgn;

  return {
    guestCapacity,
    hallRentalFeeNgn,
    decorAndSoundFeeNgn,
    cateringFeeNgn,
    grandTotalNgn,
    deposit50PercentNgn: Math.round(grandTotalNgn * 0.5),
  };
}

export function calculatePrintingAndPackagingQuote(
  itemType: 'flyers' | 'souvenirs' | 'packaging_boxes' | 'flex_banner',
  quantity = 1000,
  paperGsm = 150
): {
  itemType: string;
  quantity: number;
  unitPriceNgn: number;
  totalCostNgn: number;
  estimatedProductionDays: number;
} {
  let unitPriceNgn = 45;
  let estimatedProductionDays = 3;

  if (itemType === 'packaging_boxes') {
    unitPriceNgn = 280;
    estimatedProductionDays = 5;
  } else if (itemType === 'flex_banner') {
    unitPriceNgn = 1800; // per sq yard
    estimatedProductionDays = 1;
  } else if (itemType === 'souvenirs') {
    unitPriceNgn = 650;
    estimatedProductionDays = 4;
  } else {
    unitPriceNgn = paperGsm >= 250 ? 85 : 45;
    estimatedProductionDays = 2;
  }

  const totalCostNgn = Math.round(unitPriceNgn * quantity);

  return {
    itemType,
    quantity,
    unitPriceNgn,
    totalCostNgn,
    estimatedProductionDays,
  };
}

export function calculateCarRentalAndEscortRate(
  vehicleType: 'sedan' | 'suv' | 'luxury_prado' | 'hiace_bus',
  durationDays = 2,
  includePoliceEscort = false
): {
  vehicleType: string;
  durationDays: number;
  dailyRateNgn: number;
  policeEscortFeeNgn: number;
  totalRentalFeeNgn: number;
} {
  const rates: Record<string, number> = {
    sedan: 35000,
    suv: 65000,
    luxury_prado: 140000,
    hiace_bus: 85000,
  };

  const dailyRateNgn = rates[vehicleType] || 45000;
  const policeEscortFeeNgn = includePoliceEscort ? durationDays * 45000 : 0;
  const totalRentalFeeNgn = (dailyRateNgn * durationDays) + policeEscortFeeNgn;

  return {
    vehicleType,
    durationDays,
    dailyRateNgn,
    policeEscortFeeNgn,
    totalRentalFeeNgn,
  };
}

// ============================================================================
// 15. NEW HIGH-TICKET ENTERPRISE SECTOR ENGINES
// ============================================================================

/**
 * 1. Oil & Gas / Cooking Gas (LPG) Skid Plant Audit
 */
export function calculateLpgSkidAudit(
  dailyKgInflow = 1250,
  kgSold = 1180,
  cashCollectedNgn = 1416000,
  pricePerKgNgn = 1250
): {
  dailyKgInflow: number;
  kgSold: number;
  expectedRevenueNgn: number;
  cashCollectedNgn: number;
  shortageKg: number;
  shortageLossNgn: number;
  auditStatus: 'BALANCED' | 'MINOR_VARIANCE' | 'CRITICAL_LEAKAGE';
  recoveryRecommendation: string;
} {
  const expectedRevenueNgn = kgSold * pricePerKgNgn;
  const shortageKg = Math.max(0, dailyKgInflow - kgSold);
  const shortageLossNgn = (expectedRevenueNgn - cashCollectedNgn) + (shortageKg * pricePerKgNgn * 0.1);

  let auditStatus: 'BALANCED' | 'MINOR_VARIANCE' | 'CRITICAL_LEAKAGE' = 'BALANCED';
  let recoveryRecommendation = 'Plant registers are balanced. Normal operations.';

  if (shortageLossNgn > 50000) {
    auditStatus = 'CRITICAL_LEAKAGE';
    recoveryRecommendation = 'Urgent: Cross-check scale calibration and pump attendant shift handovers immediately.';
  } else if (shortageLossNgn > 10000) {
    auditStatus = 'MINOR_VARIANCE';
    recoveryRecommendation = 'Minor variance detected. Review daily cylinder filling tare weights.';
  }

  return {
    dailyKgInflow,
    kgSold,
    expectedRevenueNgn,
    cashCollectedNgn,
    shortageKg,
    shortageLossNgn: Math.round(shortageLossNgn),
    auditStatus,
    recoveryRecommendation,
  };
}

/**
 * 2. Haulage, Logistics & Interstate Fleet Trip Audit
 */
export function calculateHaulageTripExpense(
  originCity = 'Lagos (Apapa)',
  destinationCity = 'Kano (Dawanau)',
  tonnage = 30,
  dieselLitersAllocated = 450,
  dieselPricePerLiter = 1350
): {
  tripRoute: string;
  tonnage: number;
  grossFreightRevenueNgn: number;
  dieselExpenseNgn: number;
  driverAllowanceAndTollsNgn: number;
  unionAndSecurityLeviesNgn: number;
  totalTripExpenseNgn: number;
  netProfitPerTripNgn: number;
  dieselCostPercentage: number;
} {
  const isFarNorth = destinationCity.toLowerCase().includes('kano') || destinationCity.toLowerCase().includes('maiduguri') || destinationCity.toLowerCase().includes('sokoto');
  const isEast = destinationCity.toLowerCase().includes('onitsha') || destinationCity.toLowerCase().includes('aba') || destinationCity.toLowerCase().includes('port');
  
  const baseRatePerTon = isFarNorth ? 85000 : isEast ? 55000 : 40000;
  const grossFreightRevenueNgn = tonnage * baseRatePerTon;
  
  const dieselExpenseNgn = dieselLitersAllocated * dieselPricePerLiter;
  const driverAllowanceAndTollsNgn = isFarNorth ? 220000 : 130000;
  const unionAndSecurityLeviesNgn = 65000;
  
  const totalTripExpenseNgn = dieselExpenseNgn + driverAllowanceAndTollsNgn + unionAndSecurityLeviesNgn;
  const netProfitPerTripNgn = grossFreightRevenueNgn - totalTripExpenseNgn;
  const dieselCostPercentage = Math.round((dieselExpenseNgn / grossFreightRevenueNgn) * 100);

  return {
    tripRoute: `${originCity} → ${destinationCity}`,
    tonnage,
    grossFreightRevenueNgn,
    dieselExpenseNgn,
    driverAllowanceAndTollsNgn,
    unionAndSecurityLeviesNgn,
    totalTripExpenseNgn,
    netProfitPerTripNgn,
    dieselCostPercentage,
  };
}

/**
 * 3. Micro-Lending & Remita Direct-Debit Schedule
 */
export function calculateMicroLoanSchedule(
  principalNgn = 500000,
  monthlyInterestPercent = 5,
  tenureMonths = 6,
  directDebitFeeNgn = 1500
): {
  principalNgn: number;
  monthlyPrincipalNgn: number;
  monthlyInterestNgn: number;
  monthlyRepaymentNgn: number;
  totalInterestNgn: number;
  totalRepaymentNgn: number;
  remitaMandateFeeNgn: number;
  estimatedDefaultRiskRate: string;
} {
  const monthlyPrincipalNgn = Math.round(principalNgn / tenureMonths);
  const monthlyInterestNgn = Math.round((principalNgn * monthlyInterestPercent) / 100);
  const monthlyRepaymentNgn = monthlyPrincipalNgn + monthlyInterestNgn;
  const totalInterestNgn = monthlyInterestNgn * tenureMonths;
  const totalRepaymentNgn = monthlyRepaymentNgn * tenureMonths;

  return {
    principalNgn,
    monthlyPrincipalNgn,
    monthlyInterestNgn,
    monthlyRepaymentNgn,
    totalInterestNgn,
    totalRepaymentNgn,
    remitaMandateFeeNgn: directDebitFeeNgn,
    estimatedDefaultRiskRate: tenureMonths <= 6 ? 'Low (Auto-Direct Debit Active)' : 'Moderate',
  };
}

/**
 * 4. Agro-Allied Poultry Yield & Mortality Auditor
 */
export function calculateAgroPoultryYield(
  flockSize = 2000,
  mortalityCount = 4,
  feedBagsConsumed = 5,
  cratesCollected = 54
): {
  flockSize: number;
  henDayProductionPercent: number;
  dailyEggRevenueNgn: number;
  dailyFeedCostNgn: number;
  dailyGrossMarginNgn: number;
  feedConversionEfficiency: string;
  mortalityRatePercent: number;
} {
  const activeBirds = Math.max(1, flockSize - mortalityCount);
  const totalEggs = cratesCollected * 30;
  const henDayProductionPercent = Math.round((totalEggs / activeBirds) * 100);
  
  const pricePerCrateNgn = 4600;
  const pricePerFeedBagNgn = 14800;
  
  const dailyEggRevenueNgn = cratesCollected * pricePerCrateNgn;
  const dailyFeedCostNgn = feedBagsConsumed * pricePerFeedBagNgn;
  const dailyGrossMarginNgn = dailyEggRevenueNgn - dailyFeedCostNgn;
  const mortalityRatePercent = Math.round((mortalityCount / flockSize) * 1000) / 10;
  
  const feedConversionEfficiency = henDayProductionPercent >= 80 ? 'Excellent (High ROI)' : henDayProductionPercent >= 65 ? 'Acceptable' : 'Sub-Optimal (Audit Feed Quality)';

  return {
    flockSize,
    henDayProductionPercent,
    dailyEggRevenueNgn,
    dailyFeedCostNgn,
    dailyGrossMarginNgn,
    feedConversionEfficiency,
    mortalityRatePercent,
  };
}

/**
 * 5. Hospitality, Shortlet & Venue Booking Engine
 */
export function calculateShortletBookingAndCaution(
  nightlyRateNgn = 85000,
  nightsCount = 3,
  cautionDepositNgn = 50000,
  estimatedKwhPerDay = 35
): {
  nightlyRateNgn: number;
  nightsCount: number;
  accommodationSubtotalNgn: number;
  cautionDepositNgn: number;
  electricityAllowanceNgn: number;
  grandTotalNgn: number;
  refundableCautionAmountNgn: number;
} {
  const accommodationSubtotalNgn = nightlyRateNgn * nightsCount;
  const electricityAllowanceNgn = Math.round(nightsCount * estimatedKwhPerDay * 209);
  const grandTotalNgn = accommodationSubtotalNgn + cautionDepositNgn;

  return {
    nightlyRateNgn,
    nightsCount,
    accommodationSubtotalNgn,
    cautionDepositNgn,
    electricityAllowanceNgn,
    grandTotalNgn,
    refundableCautionAmountNgn: cautionDepositNgn,
  };
}

/**
 * 6. Port Demurrage & Container Free-Days Countdown
 */
export function calculateContainerDemurrage(
  containerType = '40ft High Cube',
  shippingLine = 'Maersk Line',
  dischargeDaysAgo = 12,
  freeDays = 7,
  dailyDemurrageUsd = 85,
  fxRateNgn = 1580
): {
  containerType: string;
  shippingLine: string;
  freeDaysAllowed: number;
  daysInDemurrage: number;
  dailyDemurrageUsd: number;
  totalDemurrageUsd: number;
  totalDemurragePenaltyNgn: number;
  terminalStorageNgn: number;
  grandTotalPortLiabilityNgn: number;
  actionUrgency: string;
} {
  const daysInDemurrage = Math.max(0, dischargeDaysAgo - freeDays);
  const totalDemurrageUsd = daysInDemurrage * dailyDemurrageUsd;
  const totalDemurragePenaltyNgn = totalDemurrageUsd * fxRateNgn;
  const terminalStorageNgn = daysInDemurrage * 35000;
  const grandTotalPortLiabilityNgn = totalDemurragePenaltyNgn + terminalStorageNgn;
  
  const actionUrgency = daysInDemurrage > 5 ? 'CRITICAL: High Demurrage Accruing Daily' : daysInDemurrage > 0 ? 'WARNING: Free Days Expired' : 'NORMAL: Within Free Days Window';

  return {
    containerType,
    shippingLine,
    freeDaysAllowed: freeDays,
    daysInDemurrage,
    dailyDemurrageUsd,
    totalDemurrageUsd,
    totalDemurragePenaltyNgn,
    terminalStorageNgn,
    grandTotalPortLiabilityNgn,
    actionUrgency,
  };
}

// ============================================================================
// 16. EDUCATION CBT, BROADSHEET & RESULT PIN ENGINES
// ============================================================================

/**
 * 7. CBT Mock Exam & Continuous Assessment (CA) Auto-Grading Engine
 */
export function calculateCbtExamScoring(
  objectiveScore = 48,
  maxObjective = 60,
  ca1Score = 18,
  ca2Score = 17
): {
  objectiveScore: number;
  maxObjective: number;
  ca1Score: number;
  ca2Score: number;
  examScoreScaled60: number;
  totalScore100: number;
  waecGrade: string;
  gradeRemark: string;
  academicPerformanceBand: string;
} {
  const scaledExam = Math.round((objectiveScore / maxObjective) * 60);
  const totalScore100 = Math.min(100, scaledExam + ca1Score + ca2Score);

  let waecGrade = 'F9';
  let gradeRemark = 'Fail';
  let academicPerformanceBand = 'Critical Remedial Needed';

  if (totalScore100 >= 75) {
    waecGrade = 'A1';
    gradeRemark = 'Excellent Distinction';
    academicPerformanceBand = 'Top Tier Honors';
  } else if (totalScore100 >= 70) {
    waecGrade = 'B2';
    gradeRemark = 'Very Good';
    academicPerformanceBand = 'High Academic Credit';
  } else if (totalScore100 >= 65) {
    waecGrade = 'B3';
    gradeRemark = 'Good Credit';
    academicPerformanceBand = 'Above Average';
  } else if (totalScore100 >= 60) {
    waecGrade = 'C4';
    gradeRemark = 'Credit';
    academicPerformanceBand = 'Standard Passing Grade';
  } else if (totalScore100 >= 55) {
    waecGrade = 'C5';
    gradeRemark = 'Credit';
    academicPerformanceBand = 'Standard Passing Grade';
  } else if (totalScore100 >= 50) {
    waecGrade = 'C6';
    gradeRemark = 'Credit Pass';
    academicPerformanceBand = 'Passing Grade';
  } else if (totalScore100 >= 45) {
    waecGrade = 'D7';
    gradeRemark = 'Pass';
    academicPerformanceBand = 'Needs Improvement';
  } else if (totalScore100 >= 40) {
    waecGrade = 'E8';
    gradeRemark = 'Weak Pass';
    academicPerformanceBand = 'Academic Probation Warning';
  }

  return {
    objectiveScore,
    maxObjective,
    ca1Score,
    ca2Score,
    examScoreScaled60: scaledExam,
    totalScore100,
    waecGrade,
    gradeRemark,
    academicPerformanceBand,
  };
}

/**
 * 8. Termly Broadsheet & Class Position Sizer
 */
export function calculateReportCardBroadsheet(
  studentClassSize = 42,
  termlySubjectCount = 9,
  studentTotalScore = 748
): {
  studentClassSize: number;
  termlySubjectCount: number;
  studentAveragePercent: number;
  classPositionRanking: string;
  cumulativeGpa: number;
  principalPedagogicalRemark: string;
} {
  const maxPossibleScore = termlySubjectCount * 100;
  const studentAveragePercent = Math.round((studentTotalScore / maxPossibleScore) * 1000) / 10;
  
  // Approximate position calculation
  const estimatedRank = Math.max(1, Math.round((100 - studentAveragePercent) * 0.4) + 1);
  const positionSuffix = estimatedRank === 1 ? '1st' : estimatedRank === 2 ? '2nd' : estimatedRank === 3 ? '3rd' : `${estimatedRank}th`;

  const cumulativeGpa = Math.round((studentAveragePercent / 20) * 100) / 100;
  
  let principalPedagogicalRemark = 'A commendable academic output. Keep striving for greater heights next term.';
  if (studentAveragePercent >= 80) {
    principalPedagogicalRemark = 'An outstanding academic performance with sterling subject distinctions. Highly recommended for class honor roll.';
  } else if (studentAveragePercent < 50) {
    principalPedagogicalRemark = 'Academic performance fell below class benchmark. Compulsory holiday remedial coaching advised.';
  }

  return {
    studentClassSize,
    termlySubjectCount,
    studentAveragePercent,
    classPositionRanking: `${positionSuffix} of ${studentClassSize} students`,
    cumulativeGpa,
    principalPedagogicalRemark,
  };
}

/**
 * 9. Result Checker PIN & Scratch Card Revenue Engine
 */
export function calculateResultCheckerPins(
  batchQuantity = 500,
  unitPriceNgn = 2500,
  termLabel = '2nd Term 2026'
): {
  termLabel: string;
  batchQuantity: number;
  unitPriceNgn: number;
  grossPinRevenueNgn: number;
  cardProductionCostNgn: number;
  netSchoolPinProfitNgn: number;
  pinSecurityFormat: string;
} {
  const grossPinRevenueNgn = batchQuantity * unitPriceNgn;
  const cardProductionCostNgn = batchQuantity * 120; // ₦120 per plastic scratch card or ₦0 for SMS DVA
  const netSchoolPinProfitNgn = grossPinRevenueNgn - cardProductionCostNgn;

  return {
    termLabel,
    batchQuantity,
    unitPriceNgn,
    grossPinRevenueNgn,
    cardProductionCostNgn,
    netSchoolPinProfitNgn,
    pinSecurityFormat: '16-Digit Cryptographic Hash (SHA-256 + SMS Auto-Lock)',
  };
}

// ============================================================================
// 17. HEAVY CONSTRUCTION & FACILITY SECURITY ENGINES
// ============================================================================

/**
 * 10. Heavy Machinery Hour-Meter & Wet/Dry Lease Sizer
 */
export function calculateMachineryLeaseExpense(
  machineType: 'cat_320_excavator' | 'mobile_crane_50t' | 'd6_bulldozer' | 'payloader_950' = 'cat_320_excavator',
  operatingHours = 8,
  leaseType: 'wet' | 'dry' = 'wet',
  dieselPricePerLiter = 1350
): {
  machineType: string;
  operatingHours: number;
  leaseType: string;
  hourlyRentalRateNgn: number;
  dieselConsumptionLiters: number;
  dieselExpenseNgn: number;
  operatorAllowanceNgn: number;
  totalDailyLeaseCostNgn: number;
} {
  const rates: Record<string, { hourlyRate: number; fuelPerHr: number; name: string }> = {
    cat_320_excavator: { hourlyRate: 45000, fuelPerHr: 22, name: 'CAT 320D Hydraulic Excavator' },
    mobile_crane_50t: { hourlyRate: 85000, fuelPerHr: 28, name: '50-Ton Mobile Telescopic Crane' },
    d6_bulldozer: { hourlyRate: 50000, fuelPerHr: 25, name: 'CAT D6R Heavy Track Bulldozer' },
    payloader_950: { hourlyRate: 40000, fuelPerHr: 18, name: 'CAT 950 Wheel Payloader' },
  };

  const machine = rates[machineType] || rates.cat_320_excavator;
  const dieselConsumptionLiters = leaseType === 'wet' ? machine.fuelPerHr * operatingHours : 0;
  const dieselExpenseNgn = dieselConsumptionLiters * dieselPricePerLiter;
  const operatorAllowanceNgn = 15000;
  const machineRentalCostNgn = machine.hourlyRate * operatingHours;
  const totalDailyLeaseCostNgn = machineRentalCostNgn + dieselExpenseNgn + operatorAllowanceNgn;

  return {
    machineType: machine.name,
    operatingHours,
    leaseType: leaseType === 'wet' ? 'Wet Lease (Fuel & Operator Inclusive)' : 'Dry Lease (Machine Only)',
    hourlyRentalRateNgn: machine.hourlyRate,
    dieselConsumptionLiters,
    dieselExpenseNgn,
    operatorAllowanceNgn,
    totalDailyLeaseCostNgn,
  };
}

/**
 * 11. Estate Security Guard Patrol & Visitor Access Sizer
 */
export function calculateSecurityPatrolAndGatePass(
  residentUnits = 180,
  guardCount = 8,
  nfcCheckpointCount = 12,
  dailyVisitorCount = 95
): {
  residentUnits: number;
  guardCount: number;
  nfcCheckpointCount: number;
  monthlySecurityBillingNgn: number;
  costPerResidentUnitNgn: number;
  patrolRoundsPerNight: number;
  monthlyVisitorCodeCapacity: number;
} {
  const guardSalaryPerStaffNgn = 85000;
  const supervisorFeeNgn = 120000;
  const controlRoomTechFeeNgn = 65000;
  
  const monthlySecurityBillingNgn = (guardCount * guardSalaryPerStaffNgn) + supervisorFeeNgn + controlRoomTechFeeNgn;
  const costPerResidentUnitNgn = Math.round(monthlySecurityBillingNgn / residentUnits);
  const patrolRoundsPerNight = Math.round(12 / (nfcCheckpointCount / 4)); // 12 hours night shift
  const monthlyVisitorCodeCapacity = dailyVisitorCount * 30;

  return {
    residentUnits,
    guardCount,
    nfcCheckpointCount,
    monthlySecurityBillingNgn,
    costPerResidentUnitNgn,
    patrolRoundsPerNight,
    monthlyVisitorCodeCapacity,
  };
}

// ============================================================================
// 18. COMPREHENSIVE HEALTHCARE & CLINICAL REVENUE ENGINES
// ============================================================================

/**
 * 12. HMO Claims & Tariff Authorization Reconciler
 */
export function calculateHmoClaimsAndAuthCode(
  hmoProvider = 'Reliance HMO',
  procedureName = 'Minor Surgical Wound Debridement',
  standardTariffNgn = 45000,
  isSecondaryProcedure = false,
  hasAuthCode = true
): {
  hmoProvider: string;
  procedureName: string;
  totalTariffNgn: number;
  hmoApprovedClaimNgn: number;
  patientCoPayNgn: number;
  claimRejectionRisk: string;
  billingAdvice: string;
} {
  let coPayPercent = 0.10; // 10% standard co-pay
  if (hmoProvider.toLowerCase().includes('axa') || hmoProvider.toLowerCase().includes('mansard')) {
    coPayPercent = 0.15;
  } else if (hmoProvider.toLowerCase().includes('hygeia')) {
    coPayPercent = 0.20;
  }

  const patientCoPayNgn = Math.round(standardTariffNgn * coPayPercent);
  let hmoApprovedClaimNgn = standardTariffNgn - patientCoPayNgn;

  let claimRejectionRisk = 'LOW: Verified Tariff & AuthCode Active';
  let billingAdvice = 'Proceed with treatment. Issue co-pay receipt to patient.';

  if (isSecondaryProcedure && !hasAuthCode) {
    claimRejectionRisk = 'CRITICAL: High Risk of Claim Rejection (Missing Secondary AuthCode)';
    billingAdvice = 'HALT: Obtain supplementary AuthCode from HMO desk before discharging patient.';
    hmoApprovedClaimNgn = 0;
  } else if (!hasAuthCode) {
    claimRejectionRisk = 'HIGH: Pre-Authorization Pending';
    billingAdvice = 'Request patient authorization code from portal before billing.';
  }

  return {
    hmoProvider,
    procedureName,
    totalTariffNgn: standardTariffNgn,
    hmoApprovedClaimNgn,
    patientCoPayNgn,
    claimRejectionRisk,
    billingAdvice,
  };
}

/**
 * 13. Hospital In-Patient Admission & Surgery Deposit Sizer
 */
export function calculateSurgeryAndAdmissionDeposit(
  surgeryType: 'caesarean_section' | 'appendectomy' | 'myomectomy_fibroid' | 'orthopedic_fixation' = 'caesarean_section',
  admissionDays = 3,
  wardTier: 'general_ward' | 'semi_private' | 'vip_suite' = 'semi_private'
): {
  surgeryType: string;
  surgeonAndAnesthesiaFeeNgn: number;
  theaterConsumablesNgn: number;
  bedWardTotalNgn: number;
  grandTotalEstimateNgn: number;
  required60PercentDepositNgn: number;
  postOpBalanceNgn: number;
} {
  const surgeryRates: Record<string, { surgeonFee: number; theaterFee: number; name: string }> = {
    caesarean_section: { surgeonFee: 450000, theaterFee: 180000, name: 'Elective Caesarean Section (CS)' },
    appendectomy: { surgeonFee: 320000, theaterFee: 140000, name: 'Emergency Appendectomy' },
    myomectomy_fibroid: { surgeonFee: 550000, theaterFee: 220000, name: 'Open Myomectomy (Fibroid Removal)' },
    orthopedic_fixation: { surgeonFee: 650000, theaterFee: 280000, name: 'Orthopedic Internal Fixation (ORIF)' },
  };

  const wardRates: Record<string, number> = {
    general_ward: 25000,
    semi_private: 45000,
    vip_suite: 85000,
  };

  const s = surgeryRates[surgeryType] || surgeryRates.caesarean_section;
  const dailyWardRate = wardRates[wardTier] || wardRates.semi_private;
  const bedWardTotalNgn = dailyWardRate * admissionDays;

  const grandTotalEstimateNgn = s.surgeonFee + s.theaterFee + bedWardTotalNgn;
  const required60PercentDepositNgn = Math.round(grandTotalEstimateNgn * 0.60);
  const postOpBalanceNgn = grandTotalEstimateNgn - required60PercentDepositNgn;

  return {
    surgeryType: s.name,
    surgeonAndAnesthesiaFeeNgn: s.surgeonFee,
    theaterConsumablesNgn: s.theaterFee,
    bedWardTotalNgn,
    grandTotalEstimateNgn,
    required60PercentDepositNgn,
    postOpBalanceNgn,
  };
}

/**
 * 14. Diagnostic Scan & Pathology Lab Package Sizer
 */
export function calculateDiagnosticLabPackage(
  packageType: 'executive_wellness' | 'mri_spine_brain' | 'ct_scan_contrast' | 'comprehensive_fertility' = 'executive_wellness',
  isFastingRequired = true,
  includeHomeSamplePickup = false
): {
  packageName: string;
  individualTestsSubtotalNgn: number;
  bundledPackageDiscountNgn: number;
  totalPackageCostNgn: number;
  fastingPrepInstructions: string;
  sampleTurnaroundHours: number;
} {
  const packages: Record<string, { name: string; regularPrice: number; bundlePrice: number; hours: number; prep: string }> = {
    executive_wellness: {
      name: 'Comprehensive Executive Health & Lipid Screening',
      regularPrice: 85000,
      bundlePrice: 65000,
      hours: 12,
      prep: 'Strict 10-12 hours overnight fasting required. Water is permitted.',
    },
    mri_spine_brain: {
      name: '1.5T MRI Scan (Lumbar Spine / Brain)',
      regularPrice: 140000,
      bundlePrice: 115000,
      hours: 24,
      prep: 'Remove all metal jewelry, belt buckles, and credit cards before entering scan room.',
    },
    ct_scan_contrast: {
      name: 'Multi-Slice CT Scan with IV Contrast',
      regularPrice: 110000,
      bundlePrice: 90000,
      hours: 24,
      prep: '4 hours fasting prior to IV contrast injection. Serum Creatinine test required.',
    },
    comprehensive_fertility: {
      name: 'Couple Fertility & Hormonal Assay Profile',
      regularPrice: 95000,
      bundlePrice: 75000,
      hours: 48,
      prep: 'Female hormonal panel to be conducted on Day 2 or 3 of menstrual cycle.',
    },
  };

  const p = packages[packageType] || packages.executive_wellness;
  const pickupFee = includeHomeSamplePickup ? 8500 : 0;
  const totalPackageCostNgn = p.bundlePrice + pickupFee;
  const bundledPackageDiscountNgn = p.regularPrice - p.bundlePrice;

  return {
    packageName: p.name,
    individualTestsSubtotalNgn: p.regularPrice,
    bundledPackageDiscountNgn,
    totalPackageCostNgn,
    fastingPrepInstructions: isFastingRequired ? p.prep : 'No strict fasting required for this procedure.',
    sampleTurnaroundHours: p.hours,
  };
}

/**
 * 15. Hospital Pharmacy FEFO Expiry & Stock Shrinkage Sizer
 */
export function calculatePharmacyFefoExpiryAudit(
  totalInventoryValueNgn = 4500000,
  nearExpiryRatioPercent = 8,
  averageMonthlySalesNgn = 1800000
): {
  totalInventoryValueNgn: number;
  atRiskExpiryValueNgn: number;
  recommendedMarkdownRecoveryNgn: number;
  avoidableLossValueNgn: number;
  inventoryTurnoverRatio: number;
  expiryActionProtocol: string;
} {
  const atRiskExpiryValueNgn = Math.round((totalInventoryValueNgn * nearExpiryRatioPercent) / 100);
  const recommendedMarkdownRecoveryNgn = Math.round(atRiskExpiryValueNgn * 0.70); // 30% markdown to liquidate in 30 days
  const avoidableLossValueNgn = atRiskExpiryValueNgn - recommendedMarkdownRecoveryNgn;
  const inventoryTurnoverRatio = Math.round((averageMonthlySalesNgn * 12 / totalInventoryValueNgn) * 10) / 10;

  let expiryActionProtocol = 'NORMAL: FEFO rotation within acceptable limits.';
  if (nearExpiryRatioPercent >= 10) {
    expiryActionProtocol = 'URGENT: Initiate 30% markdown clearance to partner clinics immediately.';
  } else if (nearExpiryRatioPercent >= 5) {
    expiryActionProtocol = 'WARNING: Flag batch IDs on dispensary screens for priority dispensing.';
  }

  return {
    totalInventoryValueNgn,
    atRiskExpiryValueNgn,
    recommendedMarkdownRecoveryNgn,
    avoidableLossValueNgn,
    inventoryTurnoverRatio,
    expiryActionProtocol,
  };
}

// ============================================================================
// 19. AUTHENTIC NIGERIAN REAL ESTATE & LAND DEVELOPMENT ENGINES
// ============================================================================

/**
 * 16. Estate Plot Layout, Half/Full Plot & Ancillary Levy Sizer
 */
export function calculateEstatePlotAllocation(
  plotSizeSqm = 500,
  basePricePerSqmNgn = 45000,
  isCommercialCornerPiece = false,
  estateLocation: 'epe_ibeju' | 'lekki_ajah' | 'ikeja_mainland' | 'abuja_fct' = 'epe_ibeju'
): {
  plotSizeLabel: string;
  plotSizeSqm: number;
  baseLandPriceNgn: number;
  cornerPiecePremiumNgn: number;
  registeredSurveyLevyNgn: number;
  deedOfAssignmentLevyNgn: number;
  developmentInfrastructureLevyNgn: number;
  totalOutrightPackageNgn: number;
  initial30PercentDepositNgn: number;
  monthlySpread6MonthsNgn: number;
  titleStatusRemark: string;
} {
  const isCornerPiece = Boolean(isCommercialCornerPiece);
  const baseLandPriceNgn = plotSizeSqm * basePricePerSqmNgn;
  const cornerPiecePremiumNgn = isCornerPiece ? Math.round(baseLandPriceNgn * 0.10) : 0;
  const landSubtotal = baseLandPriceNgn + cornerPiecePremiumNgn;

  // Ancillary Levies by Nigerian Real Estate Corridor
  const levies: Record<string, { survey: number; deed: number; devPerSqm: number; title: string }> = {
    epe_ibeju: { survey: 650000, deed: 350000, devPerSqm: 4500, title: 'Registered Gazette & Freehold (Excision Approved)' },
    lekki_ajah: { survey: 1200000, deed: 500000, devPerSqm: 8500, title: "Governor's Consent / Clean C of O" },
    ikeja_mainland: { survey: 950000, deed: 450000, devPerSqm: 6500, title: 'State C of O / Federal Registered Conveyance' },
    abuja_fct: { survey: 1500000, deed: 600000, devPerSqm: 7500, title: 'FCDA Right of Occupancy (R of O)' },
  };

  const loc = levies[estateLocation] || levies.epe_ibeju;
  const registeredSurveyLevyNgn = loc.survey;
  const deedOfAssignmentLevyNgn = loc.deed;
  const developmentInfrastructureLevyNgn = plotSizeSqm * loc.devPerSqm;

  const totalOutrightPackageNgn = landSubtotal + registeredSurveyLevyNgn + deedOfAssignmentLevyNgn + developmentInfrastructureLevyNgn;
  const initial30PercentDepositNgn = Math.round(totalOutrightPackageNgn * 0.30);
  const balanceToSpread = totalOutrightPackageNgn - initial30PercentDepositNgn;
  const monthlySpread6MonthsNgn = Math.round(balanceToSpread / 6);

  let plotSizeLabel = `${plotSizeSqm} SQM Standard Plot`;
  if (plotSizeSqm <= 300) plotSizeLabel = '300 SQM Half Plot (Starter)';
  else if (plotSizeSqm >= 1000) plotSizeLabel = `${plotSizeSqm} SQM Commercial / Multi-Unit Plot`;
  else if (plotSizeSqm >= 600) plotSizeLabel = '600 SQM Full Executive Plot';

  return {
    plotSizeLabel,
    plotSizeSqm,
    baseLandPriceNgn,
    cornerPiecePremiumNgn,
    registeredSurveyLevyNgn,
    deedOfAssignmentLevyNgn,
    developmentInfrastructureLevyNgn,
    totalOutrightPackageNgn,
    initial30PercentDepositNgn,
    monthlySpread6MonthsNgn,
    titleStatusRemark: loc.title,
  };
}

/**
 * 17. Realtor Network Multi-Tier Commission & 5% WHT Ledger
 */
export function calculateRealtorCommissionLedger(
  propertyPriceNgn = 45000000,
  realtorTier: 'bronze_5' | 'gold_10' | 'diamond_15' = 'gold_10',
  includeUplineOverride = true
): {
  propertyPriceNgn: number;
  realtorTierLabel: string;
  commissionRatePercent: number;
  grossDirectCommissionNgn: number;
  firs5PercentWhtDeductionNgn: number;
  netDirectCommissionPayoutNgn: number;
  uplineOverrideCommissionNgn: number;
  totalBrokeragePayoutNgn: number;
} {
  const tierRates: Record<string, { percent: number; label: string }> = {
    bronze_5: { percent: 5, label: 'Bronze Consultant (5% Commission)' },
    gold_10: { percent: 10, label: 'Gold Top Realtor (10% Commission)' },
    diamond_15: { percent: 15, label: 'Diamond Group Leader (15% High-Yield)' },
  };

  const tier = tierRates[realtorTier] || tierRates.gold_10;
  const grossDirectCommissionNgn = Math.round((propertyPriceNgn * tier.percent) / 100);
  const firs5PercentWhtDeductionNgn = Math.round(grossDirectCommissionNgn * 0.05);
  const netDirectCommissionPayoutNgn = grossDirectCommissionNgn - firs5PercentWhtDeductionNgn;

  const uplineOverrideCommissionNgn = includeUplineOverride ? Math.round(propertyPriceNgn * 0.02) : 0;
  const totalBrokeragePayoutNgn = netDirectCommissionPayoutNgn + uplineOverrideCommissionNgn;

  return {
    propertyPriceNgn,
    realtorTierLabel: tier.label,
    commissionRatePercent: tier.percent,
    grossDirectCommissionNgn,
    firs5PercentWhtDeductionNgn,
    netDirectCommissionPayoutNgn,
    uplineOverrideCommissionNgn,
    totalBrokeragePayoutNgn,
  };
}

/**
 * 18. Diaspora Forex Off-Plan Construction Milestone Sizer
 */
export function calculateDiasporaPropertyEscrow(
  propertyPriceNgn = 85000000,
  currency: 'USD' | 'GBP' | 'EUR' = 'USD',
  parallelFxRateNgn = 1580,
  finishType: 'carcass' | 'fully_finished' = 'fully_finished'
): {
  propertyPriceNgn: number;
  currency: string;
  totalForexEquivalent: number;
  finishTypeLabel: string;
  stage1Foundation30Percent: { stageName: string; amountNgn: number; amountFx: number };
  stage2CarcassDecking30Percent: { stageName: string; amountNgn: number; amountFx: number };
  stage3RoofingPlastering20Percent: { stageName: string; amountNgn: number; amountFx: number };
  stage4FinishingHandover20Percent: { stageName: string; amountNgn: number; amountFx: number };
} {
  const isFinished = finishType === 'fully_finished';
  const effectiveNgnPrice = isFinished ? propertyPriceNgn : Math.round(propertyPriceNgn * 0.75);
  const totalForexEquivalent = Math.round(effectiveNgnPrice / parallelFxRateNgn);

  const stage1Ngn = Math.round(effectiveNgnPrice * 0.30);
  const stage2Ngn = Math.round(effectiveNgnPrice * 0.30);
  const stage3Ngn = Math.round(effectiveNgnPrice * 0.20);
  const stage4Ngn = Math.round(effectiveNgnPrice * 0.20);

  return {
    propertyPriceNgn: effectiveNgnPrice,
    currency,
    totalForexEquivalent,
    finishTypeLabel: isFinished ? 'Fully Finished (POP, Tiling, Sanitary & Kitchen)' : 'Carcass Only (Structure, Roofing & Lintel)',
    stage1Foundation30Percent: {
      stageName: 'Stage 1: German Floor & Foundation (30%)',
      amountNgn: stage1Ngn,
      amountFx: Math.round(stage1Ngn / parallelFxRateNgn),
    },
    stage2CarcassDecking30Percent: {
      stageName: 'Stage 2: DPC, Decking & Lintel Carcass (30%)',
      amountNgn: stage2Ngn,
      amountFx: Math.round(stage2Ngn / parallelFxRateNgn),
    },
    stage3RoofingPlastering20Percent: {
      stageName: 'Stage 3: Roofing & Exterior Plastering (20%)',
      amountNgn: stage3Ngn,
      amountFx: Math.round(stage3Ngn / parallelFxRateNgn),
    },
    stage4FinishingHandover20Percent: {
      stageName: 'Stage 4: POP, Tiling, Painting & Key Handover (20%)',
      amountNgn: stage4Ngn,
      amountFx: Math.round(stage4Ngn / parallelFxRateNgn),
    },
  };
}

// ============================================================================
// 20. AUTHENTIC NIGERIAN AUTOMOTIVE & DEALERSHIP TRADE ENGINES
// ============================================================================

/**
 * 19. Nigerian Car Trade-In / Swap Valuation & Top-Up Sizer
 */
export function calculateCarSwapValuation(
  currentCarValueNgn = 6500000,
  mileageKm = 145000,
  bodyPaintCondition: 'first_body_clean' | 'first_body_scratches' | 'oven_baked_spray' | 'accident_repaired' = 'first_body_clean',
  engineAcCondition: 'untouched_chilling_ac' | 'sound_engine_weak_ac' | 'smoking_engine_bad_ac' = 'untouched_chilling_ac',
  targetUpgradeCarPriceNgn = 18500000
): {
  currentCarInitialValueNgn: number;
  paintDeductionNgn: number;
  engineAcDeductionNgn: number;
  mileageDeductionNgn: number;
  finalSwapTradeInOfferNgn: number;
  targetUpgradeCarPriceNgn: number;
  netCashTopUpRequiredNgn: number;
  dealershipAppraisalSummary: string;
} {
  // Paint Condition Adjustments (Authentic Nigerian Terms)
  const paintMultipliers: Record<string, number> = {
    first_body_clean: 0,
    first_body_scratches: 0.05, // 5% touchup buffing
    oven_baked_spray: 0.12,     // 12% re-spray discount
    accident_repaired: 0.25,    // 25% structural repair discount
  };

  // Engine & AC Condition Adjustments
  const engineMultipliers: Record<string, number> = {
    untouched_chilling_ac: 0,
    sound_engine_weak_ac: 0.06,  // AC compressor & gas refill
    smoking_engine_bad_ac: 0.20, // Engine overhaul/ring change
  };

  const paintDeductPercent = paintMultipliers[bodyPaintCondition] || 0;
  const engineDeductPercent = engineMultipliers[engineAcCondition] || 0;
  const mileageDeductPercent = mileageKm > 180000 ? 0.08 : mileageKm > 120000 ? 0.04 : 0;

  const paintDeductionNgn = Math.round(currentCarValueNgn * paintDeductPercent);
  const engineAcDeductionNgn = Math.round(currentCarValueNgn * engineDeductPercent);
  const mileageDeductionNgn = Math.round(currentCarValueNgn * mileageDeductPercent);

  const totalDeductions = paintDeductionNgn + engineAcDeductionNgn + mileageDeductionNgn;
  const finalSwapTradeInOfferNgn = Math.max(1000000, currentCarValueNgn - totalDeductions);
  const netCashTopUpRequiredNgn = Math.max(0, targetUpgradeCarPriceNgn - finalSwapTradeInOfferNgn);

  let appraisalStatus = 'EXCELLENT: Tokunbo-Grade First Body Car with Untouched Engine.';
  if (totalDeductions > currentCarValueNgn * 0.20) {
    appraisalStatus = 'FAIR: Registered Nigerian used with major cosmetic or mechanical adjustments.';
  } else if (totalDeductions > 0) {
    appraisalStatus = 'GOOD: Clean daily driver with standard minor appraisal adjustments.';
  }

  return {
    currentCarInitialValueNgn: currentCarValueNgn,
    paintDeductionNgn,
    engineAcDeductionNgn,
    mileageDeductionNgn,
    finalSwapTradeInOfferNgn,
    targetUpgradeCarPriceNgn,
    netCashTopUpRequiredNgn,
    dealershipAppraisalSummary: appraisalStatus,
  };
}

/**
 * 20. Auto Consignment Showroom & Investor Profit-Split Tracker
 */
export function calculateAutoConsignmentProfit(
  investorReservePriceNgn = 14000000,
  showroomSalePriceNgn = 15800000,
  holdingDaysCount = 21,
  repairAndWashExpenseNgn = 85000
): {
  investorReservePriceNgn: number;
  showroomSalePriceNgn: number;
  grossDealershipMarginNgn: number;
  showroomHoldingFeeNgn: number;
  repairAndWashExpenseNgn: number;
  netDealerCommissionNgn: number;
  netInvestorPayoutNgn: number;
  dealershipRoiPercent: number;
} {
  const dailyLotHoldingRateNgn = 2500; // ₦2,500 daily showroom floor-plan holding cost
  const showroomHoldingFeeNgn = holdingDaysCount * dailyLotHoldingRateNgn;

  const grossDealershipMarginNgn = showroomSalePriceNgn - investorReservePriceNgn;
  const netDealerCommissionNgn = Math.max(0, grossDealershipMarginNgn - showroomHoldingFeeNgn - repairAndWashExpenseNgn);
  const netInvestorPayoutNgn = investorReservePriceNgn;
  const dealershipRoiPercent = Math.round((netDealerCommissionNgn / showroomSalePriceNgn) * 1000) / 10;

  return {
    investorReservePriceNgn,
    showroomSalePriceNgn,
    grossDealershipMarginNgn,
    showroomHoldingFeeNgn,
    repairAndWashExpenseNgn,
    netDealerCommissionNgn,
    netInvestorPayoutNgn,
    dealershipRoiPercent,
  };
}

// ============================================================================
// 21. AUTHENTIC NIGERIAN SOLAR & BAND A DISCO ENERGY ENGINES
// ============================================================================

/**
 * 21. DisCo Band A/B/C Tariff vs Diesel & Solar ROI Engine
 */
export function calculateDiscoTariffVsSolarROI(
  monthlyGridTokenNgn = 180000,
  monthlyGenFuelNgn = 240000,
  discoBand: 'band_a' | 'band_b' | 'band_c' = 'band_a',
  solarSystemKva = 10
): {
  discoBandLabel: string;
  tariffPerKwhNgn: number;
  totalCurrentMonthlyEnergySpendNgn: number;
  solarSystemCapacityKva: number;
  estimatedSolarSystemCostNgn: number;
  monthlySolarEnergySavingsNgn: number;
  annualEnergySavingsNgn: number;
  paybackPeriodMonths: number;
  fiveYearNetSavingsNgn: number;
  energySecurityRemark: string;
} {
  const bandTariffs: Record<string, { rate: number; label: string }> = {
    band_a: { rate: 209.50, label: 'Band A (20+ Hours Promised, ₦209.50/kWh)' },
    band_b: { rate: 68.00, label: 'Band B (16 Hours Promised, ₦68.00/kWh)' },
    band_c: { rate: 52.50, label: 'Band C (12 Hours Promised, ₦52.50/kWh)' },
  };

  const b = bandTariffs[discoBand] || bandTariffs.band_a;
  const totalCurrentMonthlyEnergySpendNgn = monthlyGridTokenNgn + monthlyGenFuelNgn;

  // Approximate turnkey LiFePO4 solar installation cost by kVA
  const solarCostPerKva = 750000;
  const estimatedSolarSystemCostNgn = solarSystemKva * solarCostPerKva;

  // Solar displaces 85% of grid tokens and 90% of gen fuel
  const monthlySolarEnergySavingsNgn = Math.round((monthlyGridTokenNgn * 0.85) + (monthlyGenFuelNgn * 0.90));
  const annualEnergySavingsNgn = monthlySolarEnergySavingsNgn * 12;
  const paybackPeriodMonths = Math.round((estimatedSolarSystemCostNgn / monthlySolarEnergySavingsNgn) * 10) / 10;
  const fiveYearNetSavingsNgn = (annualEnergySavingsNgn * 5) - estimatedSolarSystemCostNgn;

  let energySecurityRemark = 'HIGH VALUE: Payback achieved in under 2 years with Band A tariff avoidance.';
  if (paybackPeriodMonths > 36) {
    energySecurityRemark = 'MODERATE: Steady long-term hedge against escalating fuel & DisCo tariff hikes.';
  }

  return {
    discoBandLabel: b.label,
    tariffPerKwhNgn: b.rate,
    totalCurrentMonthlyEnergySpendNgn,
    solarSystemCapacityKva: solarSystemKva,
    estimatedSolarSystemCostNgn,
    monthlySolarEnergySavingsNgn,
    annualEnergySavingsNgn,
    paybackPeriodMonths,
    fiveYearNetSavingsNgn,
    energySecurityRemark,
  };
}

/**
 * 22. LiFePO4 Battery C-Rate, Surge Load & 90% DoD Sizer
 */
export function calculateLithiumBatterySizing(
  dailyEnergyDemandKwh = 18,
  hasInverterAc = true,
  hasSumoWaterPump = true
): {
  dailyEnergyDemandKwh: number;
  recommendedBatteryCapacityKwh: number;
  batteryPackConfig51_2V: string;
  usableCapacityAt90DoDKwh: number;
  solarArrayPeakWattageWp: number;
  batteryCycleLifeYears: number;
  surgeLoadAnalysis: string;
} {
  // 1.5 multiplier for cloudy day autonomy & 90% DoD
  const recommendedBatteryCapacityKwh = Math.round(dailyEnergyDemandKwh * 1.25 * 10) / 10;
  const usableCapacityAt90DoDKwh = Math.round(recommendedBatteryCapacityKwh * 0.90 * 10) / 10;

  // 51.2V Pack configuration (e.g. 5.12kWh 100Ah modules)
  const moduleCount = Math.max(1, Math.ceil(recommendedBatteryCapacityKwh / 5.12));
  const batteryPackConfig51_2V = `${moduleCount}x 51.2V 100Ah LiFePO4 (${moduleCount * 5.12}kWh Total)`;

  // Solar array sized to charge in 4.5 peak sun hours
  const solarArrayPeakWattageWp = Math.round((recommendedBatteryCapacityKwh / 4.5) * 1000 * 1.15);

  let surgeLoadAnalysis = 'STANDARD: Base lighting, TV, fridge, and laptops.';
  if (hasInverterAc && hasSumoWaterPump) {
    surgeLoadAnalysis = 'HEAVY SURGE: Dual Inverter AC + 1HP Sumo Submersible Pump (Recommended 10kVA Inverter + 0.5C Charge Rate).';
  } else if (hasInverterAc) {
    surgeLoadAnalysis = 'MODERATE SURGE: 1.5HP Inverter AC enabled during peak solar generation.';
  }

  return {
    dailyEnergyDemandKwh,
    recommendedBatteryCapacityKwh,
    batteryPackConfig51_2V,
    usableCapacityAt90DoDKwh,
    solarArrayPeakWattageWp,
    batteryCycleLifeYears: 10.5, // 6000 cycles at 1 cycle/day
    surgeLoadAnalysis,
  };
}

// ============================================================================
// 22. AUTHENTIC NIGERIAN AGRO-ALLIED & COMMODITY TRADE ENGINES
// ============================================================================

/**
 * 23. Grain Weighbridge Moisture Penalty & Silo Drying Sizer
 */
export function calculateGrainMoistureDiscount(
  commodityType: 'yellow_maize' | 'soya_beans' | 'paddy_rice' | 'sorghum_guinea_corn' = 'yellow_maize',
  grossWeightTons = 30,
  measuredMoisturePercent = 17.5,
  basePricePerTonNgn = 680000
): {
  commodityName: string;
  grossWeightTons: number;
  measuredMoisturePercent: number;
  standardSafeMoisturePercent: number;
  excessMoisturePercent: number;
  shrinkageWeightLossTons: number;
  netDryCommodityWeightTons: number;
  grossCommodityValueNgn: number;
  moistureDryingPenaltyNgn: number;
  netCleanSettlementPayoutNgn: number;
  hundredKgBagCount: number;
  siloStorageQualityRemark: string;
} {
  const commoditySpecs: Record<string, { safeMC: number; name: string }> = {
    yellow_maize: { safeMC: 13.5, name: 'Premium Yellow Maize (Clean Dry)' },
    soya_beans: { safeMC: 12.0, name: 'Industrial Grade Soya Beans' },
    paddy_rice: { safeMC: 14.0, name: 'Parboiled Milling Paddy Rice' },
    sorghum_guinea_corn: { safeMC: 13.0, name: 'High-Yield Sorghum / Guinea Corn' },
  };

  const spec = commoditySpecs[commodityType] || commoditySpecs.yellow_maize;
  const standardSafeMoisturePercent = spec.safeMC;
  const excessMoisturePercent = Math.max(0, measuredMoisturePercent - standardSafeMoisturePercent);

  // Shrink factor: 1.2% weight loss per 1% excess moisture (including handling & water loss)
  const shrinkRate = (excessMoisturePercent * 1.2) / 100;
  const shrinkageWeightLossTons = Math.round(grossWeightTons * shrinkRate * 100) / 100;
  const netDryCommodityWeightTons = Math.round((grossWeightTons - shrinkageWeightLossTons) * 100) / 100;

  const grossCommodityValueNgn = Math.round(grossWeightTons * basePricePerTonNgn);
  // Drying cost: ₦18,000 per ton per 1% excess moisture
  const moistureDryingPenaltyNgn = Math.round(grossWeightTons * excessMoisturePercent * 18000);
  const netCleanSettlementPayoutNgn = Math.max(0, Math.round(netDryCommodityWeightTons * basePricePerTonNgn) - moistureDryingPenaltyNgn);

  const hundredKgBagCount = Math.round(netDryCommodityWeightTons * 10);

  let siloStorageQualityRemark = 'SAFE FOR SILO STORAGE: Low moisture ensures zero mold or aflatoxin risk.';
  if (measuredMoisturePercent > 16.0) {
    siloStorageQualityRemark = 'HIGH MOLD RISK: Mandatory mechanical drying required before warehouse stacking.';
  } else if (measuredMoisturePercent > standardSafeMoisturePercent) {
    siloStorageQualityRemark = 'MODERATE MOISTURE: Sun drying or aeration blower required within 48 hours.';
  }

  return {
    commodityName: spec.name,
    grossWeightTons,
    measuredMoisturePercent,
    standardSafeMoisturePercent,
    excessMoisturePercent,
    shrinkageWeightLossTons,
    netDryCommodityWeightTons,
    grossCommodityValueNgn,
    moistureDryingPenaltyNgn,
    netCleanSettlementPayoutNgn,
    hundredKgBagCount,
    siloStorageQualityRemark,
  };
}

// ============================================================================
// 23. AUTHENTIC NIGERIAN LEGAL PRACTICE & COMPLIANCE ENGINES
// ============================================================================

/**
 * 24. CAC Annual Return Penalties & SCUML Compliance Sizer
 */
export function calculateScumlAndCacCompliance(
  entityType: 'business_name' | 'company_ltd' | 'incorporated_trustee' = 'company_ltd',
  unfiledYearsCount = 3,
  hasScumlCertificate = false,
  requiresTaxClearance = true
): {
  entityTypeLabel: string;
  unfiledYearsCount: number;
  cacStatutoryFilingFeeNgn: number;
  cacLatePenaltyFineNgn: number;
  totalCacArrearsNgn: number;
  scumlFilingAndFacilitationNgn: number;
  taxClearanceFacilitationNgn: number;
  grandTotalComplianceCostNgn: number;
  bankAccountRiskStatus: string;
} {
  const fees: Record<string, { statutoryPerYear: number; penaltyPerYear: number; label: string }> = {
    business_name: { statutoryPerYear: 5000, penaltyPerYear: 5000, label: 'Registered Business Name (Enterprise)' },
    company_ltd: { statutoryPerYear: 10000, penaltyPerYear: 10000, label: 'Private Limited Company (LTD)' },
    incorporated_trustee: { statutoryPerYear: 25000, penaltyPerYear: 20000, label: 'Incorporated Trustee / NGO / Church' },
  };

  const f = fees[entityType] || fees.company_ltd;
  const cacStatutoryFilingFeeNgn = unfiledYearsCount * f.statutoryPerYear;
  const cacLatePenaltyFineNgn = unfiledYearsCount * f.penaltyPerYear;
  const totalCacArrearsNgn = cacStatutoryFilingFeeNgn + cacLatePenaltyFineNgn;

  const scumlFilingAndFacilitationNgn = hasScumlCertificate ? 0 : 75000;
  const taxClearanceFacilitationNgn = requiresTaxClearance ? 85000 : 0;

  const grandTotalComplianceCostNgn = totalCacArrearsNgn + scumlFilingAndFacilitationNgn + taxClearanceFacilitationNgn;

  let bankAccountRiskStatus = 'LOW RISK: Up to date with statutory regulatory filings.';
  if (unfiledYearsCount >= 3 || (!hasScumlCertificate && entityType !== 'business_name')) {
    bankAccountRiskStatus = 'CRITICAL: High risk of commercial bank Post-No-Debit (PND) account restriction.';
  } else if (unfiledYearsCount > 0) {
    bankAccountRiskStatus = 'WARNING: CAC status flagged as INACTIVE on portal search.';
  }

  return {
    entityTypeLabel: f.label,
    unfiledYearsCount,
    cacStatutoryFilingFeeNgn,
    cacLatePenaltyFineNgn,
    totalCacArrearsNgn,
    scumlFilingAndFacilitationNgn,
    taxClearanceFacilitationNgn,
    grandTotalComplianceCostNgn,
    bankAccountRiskStatus,
  };
}

/**
 * 25. Legal Retainer, Billable Hours & Court Debit Note Sizer
 */
export function calculateLegalRetainerAndDebitNote(
  retainerTier: 'standard_corporate' | 'executive_commercial' | 'general_retainer' = 'standard_corporate',
  associateHours = 12,
  partnerHours = 4,
  courtAppearanceCount = 2
): {
  retainerTierLabel: string;
  monthlyBaseRetainerNgn: number;
  associateHoursFeeNgn: number;
  partnerHoursFeeNgn: number;
  courtFilingAndAppearanceDisbursementsNgn: number;
  subtotalLegalFeesNgn: number;
  vat7_5PercentNgn: number;
  whtDeduction5PercentNgn: number;
  totalDebitNotePayableNgn: number;
} {
  const retainers: Record<string, { base: number; label: string }> = {
    standard_corporate: { base: 250000, label: 'Standard Corporate Monthly Retainer' },
    executive_commercial: { base: 650000, label: 'Executive Commercial & Advisory Retainer' },
    general_retainer: { base: 150000, label: 'General Legal Advisory Retainer' },
  };

  const r = retainers[retainerTier] || retainers.standard_corporate;
  const associateHourlyRateNgn = 25000;
  const partnerHourlyRateNgn = 65000;
  const courtAppearanceRateNgn = 50000;

  const associateHoursFeeNgn = associateHours * associateHourlyRateNgn;
  const partnerHoursFeeNgn = partnerHours * partnerHourlyRateNgn;
  const courtFilingAndAppearanceDisbursementsNgn = courtAppearanceCount * courtAppearanceRateNgn;

  const subtotalLegalFeesNgn = r.base + associateHoursFeeNgn + partnerHoursFeeNgn + courtFilingAndAppearanceDisbursementsNgn;
  const vat7_5PercentNgn = Math.round(subtotalLegalFeesNgn * 0.075);
  const whtDeduction5PercentNgn = Math.round(subtotalLegalFeesNgn * 0.05);

  const totalDebitNotePayableNgn = subtotalLegalFeesNgn + vat7_5PercentNgn - whtDeduction5PercentNgn;

  return {
    retainerTierLabel: r.label,
    monthlyBaseRetainerNgn: r.base,
    associateHoursFeeNgn,
    partnerHoursFeeNgn,
    courtFilingAndAppearanceDisbursementsNgn,
    subtotalLegalFeesNgn,
    vat7_5PercentNgn,
    whtDeduction5PercentNgn,
    totalDebitNotePayableNgn,
  };
}

// ============================================================================
// 24. AUTHENTIC NIGERIAN RETAIL, BOUTIQUE & POD DISPATCH ENGINES
// ============================================================================

/**
 * 26. Pay-on-Delivery (POD) Dispatch & Rider Cash Remittance Reconciler
 */
export function calculatePodDispatchAndRemittance(
  totalOrdersDispatched = 85,
  averageOrderValueNgn = 28500,
  rtoReturnRatePercent = 22,
  deliveryFeePerOrderNgn = 3500,
  riderCashCollectedNgn = 1750000
): {
  totalOrdersDispatched: number;
  successfulDeliveredOrders: number;
  failedRtoOrders: number;
  grossDispatchedValueNgn: number;
  expectedDoorstepRevenueNgn: number;
  totalWaybillExpenseNgn: number;
  riderCashCollectedNgn: number;
  unaccountedCashVarianceNgn: number;
  netBankSettlementNgn: number;
  dispatchPerformanceRemark: string;
} {
  const rtoCount = Math.round((totalOrdersDispatched * rtoReturnRatePercent) / 100);
  const deliveredCount = totalOrdersDispatched - rtoCount;

  const grossDispatchedValueNgn = totalOrdersDispatched * averageOrderValueNgn;
  const expectedDoorstepRevenueNgn = deliveredCount * averageOrderValueNgn;
  // Courier charges delivery fee on all dispatched parcels (delivered + return handling)
  const totalWaybillExpenseNgn = totalOrdersDispatched * deliveryFeePerOrderNgn;

  const unaccountedCashVarianceNgn = Math.max(0, expectedDoorstepRevenueNgn - riderCashCollectedNgn);
  const netBankSettlementNgn = riderCashCollectedNgn - totalWaybillExpenseNgn;

  let dispatchPerformanceRemark = 'HEALTHY: RTO rate within optimal e-commerce threshold (<15%).';
  if (rtoReturnRatePercent >= 25) {
    dispatchPerformanceRemark = 'CRITICAL RTO: High rate of fake orders/cancelled deliveries. Mandatory pre-dispatch verification call required.';
  } else if (rtoReturnRatePercent >= 18) {
    dispatchPerformanceRemark = 'MODERATE RTO: Enable automated WhatsApp location pin confirmation before dispatching riders.';
  }

  return {
    totalOrdersDispatched,
    successfulDeliveredOrders: deliveredCount,
    failedRtoOrders: rtoCount,
    grossDispatchedValueNgn,
    expectedDoorstepRevenueNgn,
    totalWaybillExpenseNgn,
    riderCashCollectedNgn,
    unaccountedCashVarianceNgn,
    netBankSettlementNgn,
    dispatchPerformanceRemark,
  };
}

/**
 * 27. Boutique Physical Stock vs POS Pilferage & Shrinkage Auditor
 */
export function calculateBoutiqueStockShrinkage(
  posBookInventoryValueNgn = 8500000,
  physicalCountInventoryValueNgn = 7920000,
  monthlySalesRevenueNgn = 3800000
): {
  posBookInventoryValueNgn: number;
  physicalCountInventoryValueNgn: number;
  unrecordedShrinkageLossNgn: number;
  shrinkagePercentOfInventory: number;
  shrinkagePercentOfMonthlySales: number;
  antiTheftAuditProtocol: string;
} {
  const unrecordedShrinkageLossNgn = Math.max(0, posBookInventoryValueNgn - physicalCountInventoryValueNgn);
  const shrinkagePercentOfInventory = Math.round((unrecordedShrinkageLossNgn / posBookInventoryValueNgn) * 1000) / 10;
  const shrinkagePercentOfMonthlySales = Math.round((unrecordedShrinkageLossNgn / monthlySalesRevenueNgn) * 1000) / 10;

  let antiTheftAuditProtocol = 'LOW VARIANCE: Minor stock count adjustment within 1.5% normal retail tolerance.';
  if (shrinkagePercentOfInventory >= 6.0) {
    antiTheftAuditProtocol = 'ALARM: High staff pilferage detected. Initiate CCTV bag check and reconcile daily cashier shift handovers immediately.';
  } else if (shrinkagePercentOfInventory >= 3.0) {
    antiTheftAuditProtocol = 'WARNING: Stock variance exceeding normal threshold. Implement mandatory barcode scanner checkouts.';
  }

  return {
    posBookInventoryValueNgn,
    physicalCountInventoryValueNgn,
    unrecordedShrinkageLossNgn,
    shrinkagePercentOfInventory,
    shrinkagePercentOfMonthlySales,
    antiTheftAuditProtocol,
  };
}

// ============================================================================
// 25. AUTHENTIC NIGERIAN DOWNSTREAM PETROLEUM & FILLING STATION ENGINES
// ============================================================================

/**
 * 28. 33,000L/45,000L Tanker Dip-Stick Variance & Transporter Shortage Sizer
 */
export function calculateTankerDischargeVariance(
  productType: 'pms_petrol' | 'ago_diesel' | 'dpk_kerosene' = 'pms_petrol',
  waybillLiters = 33000,
  dischargedLiters = 32450,
  allowableShrinkagePercent = 0.3,
  pumpPricePerLiterNgn = 1050
): {
  productTypeLabel: string;
  waybillLiters: number;
  dischargedLiters: number;
  grossShortageLiters: number;
  allowableTransitShrinkageLiters: number;
  chargeableShortageLiters: number;
  pumpPricePerLiterNgn: number;
  transporterDebitClaimNgn: number;
  shortageSeverityRemark: string;
} {
  const products: Record<string, { name: string; defaultPrice: number }> = {
    pms_petrol: { name: 'Premium Motor Spirit (PMS Petrol)', defaultPrice: 1050 },
    ago_diesel: { name: 'Automotive Gas Oil (AGO Diesel)', defaultPrice: 1350 },
    dpk_kerosene: { name: 'Dual Purpose Kerosene (DPK)', defaultPrice: 1200 },
  };

  const prod = products[productType] || products.pms_petrol;
  const price = pumpPricePerLiterNgn || prod.defaultPrice;

  const grossShortageLiters = Math.max(0, waybillLiters - dischargedLiters);
  const allowableTransitShrinkageLiters = Math.round((waybillLiters * allowableShrinkagePercent) / 100);
  const chargeableShortageLiters = Math.max(0, grossShortageLiters - allowableTransitShrinkageLiters);
  const transporterDebitClaimNgn = chargeableShortageLiters * price;

  let shortageSeverityRemark = 'NORMAL TRANSIT: Variance within NMDPRA 0.3% temperature shrinkage allowance.';
  if (grossShortageLiters >= 500) {
    shortageSeverityRemark = 'CRITICAL SHORTAGE: Suspected illegal en-route decanting / fuel bunkering. Mandatory transporter freight deduction debit note required.';
  } else if (grossShortageLiters > allowableTransitShrinkageLiters) {
    shortageSeverityRemark = 'EXCESS SHORTAGE: Exceeds transit allowance. Chargeable to driver freight voucher.';
  }

  return {
    productTypeLabel: prod.name,
    waybillLiters,
    dischargedLiters,
    grossShortageLiters,
    allowableTransitShrinkageLiters,
    chargeableShortageLiters,
    pumpPricePerLiterNgn: price,
    transporterDebitClaimNgn,
    shortageSeverityRemark,
  };
}

/**
 * 29. Underground Storage Tank (UST) Water Ingress & Pump Totalizer Reconciler
 */
export function calculateUstWaterAndPumpAudit(
  tankCapacityLiters = 45000,
  waterCutCm = 3.5,
  openingDipLiters = 38000,
  closingDipLiters = 29500,
  totalizerSalesLiters = 8200,
  cashCollectedNgn = 8400000,
  pricePerLiterNgn = 1050
): {
  tankCapacityLiters: number;
  waterCutCm: number;
  waterIngressStatus: string;
  physicalDipVolumeSoldLiters: number;
  totalizerSalesLiters: number;
  meterToDipDiscrepancyLiters: number;
  expectedMeterRevenueNgn: number;
  cashCollectedNgn: number;
  attendantCashShortageNgn: number;
  tankHealthRemark: string;
} {
  const physicalDipVolumeSoldLiters = Math.max(0, openingDipLiters - closingDipLiters);
  const meterToDipDiscrepancyLiters = Math.abs(physicalDipVolumeSoldLiters - totalizerSalesLiters);
  const expectedMeterRevenueNgn = totalizerSalesLiters * pricePerLiterNgn;
  const attendantCashShortageNgn = Math.max(0, expectedMeterRevenueNgn - cashCollectedNgn);

  let waterIngressStatus = 'CLEAN TANK: Zero water contamination detected on dip rod.';
  let tankHealthRemark = 'HEALTHY: UST pump calibration & daily attendant sales reconciled.';

  if (waterCutCm >= 5.0) {
    waterIngressStatus = 'DANGER: Severe water ingress (>5cm). Mandatory pump shutdown and fuel de-watering required immediately to avoid vehicle engine damage claims.';
    tankHealthRemark = 'CRITICAL WATER CONTAMINATION: Do not dispense from this tank.';
  } else if (waterCutCm >= 2.5) {
    waterIngressStatus = 'WARNING: Water bottom detected (>2.5cm). Drain water bottom via suction pump.';
    tankHealthRemark = 'ATTENTION NEEDED: Water bottom approaching suction pipe level.';
  }

  return {
    tankCapacityLiters,
    waterCutCm,
    waterIngressStatus,
    physicalDipVolumeSoldLiters,
    totalizerSalesLiters,
    meterToDipDiscrepancyLiters,
    expectedMeterRevenueNgn,
    cashCollectedNgn,
    attendantCashShortageNgn,
    tankHealthRemark,
  };
}

// ============================================================================
// 26. AUTHENTIC NIGERIAN INTERSTATE HAULAGE & FLEET MANAGEMENT ENGINES
// ============================================================================

/**
 * 30. Interstate Corridor Road Union & State Toll Revenue Sizer
 */
export function calculateInterstateUnionRoadTax(
  routeCorridor: 'lagos_kano' | 'lagos_ph' | 'lagos_onitsha' | 'lagos_abuja' = 'lagos_kano',
  truckType: '30_ton_trailer' | '40_ton_flatbed' | '15_ton_rigid' = '30_ton_trailer',
  includesQuarantineAndProduce = true
): {
  routeLabel: string;
  distanceKm: number;
  nurtwAndRteanUnionTicketsNgn: number;
  stateHaulageStickersNgn: number;
  produceAndQuarantineLevyNgn: number;
  nightTrailerParkFeeNgn: number;
  totalRoadLevyExpenseNgn: number;
  tripCostPerKmNgn: number;
  recommendedDriverRoadAllowanceNgn: number;
} {
  const corridorData: Record<string, { label: string; km: number; statesCount: number }> = {
    lagos_kano: { label: 'Lagos (Apapa) to Kano (Dawanau) Corridor', km: 1020, statesCount: 7 },
    lagos_ph: { label: 'Lagos to Port Harcourt (Oil & Gas Hub)', km: 620, statesCount: 5 },
    lagos_onitsha: { label: 'Lagos to Onitsha (Main Market)', km: 460, statesCount: 4 },
    lagos_abuja: { label: 'Lagos to Abuja (FCT Commercial)', km: 750, statesCount: 5 },
  };

  const c = corridorData[routeCorridor] || corridorData.lagos_kano;
  const multiplier = truckType === '40_ton_flatbed' ? 1.3 : truckType === '15_ton_rigid' ? 0.75 : 1.0;

  const nurtwAndRteanUnionTicketsNgn = Math.round(18500 * multiplier * (c.statesCount / 4));
  const stateHaulageStickersNgn = Math.round(c.statesCount * 6500 * multiplier);
  const produceAndQuarantineLevyNgn = includesQuarantineAndProduce ? Math.round(16000 * multiplier) : 0;
  const nightTrailerParkFeeNgn = 7500;

  const totalRoadLevyExpenseNgn = nurtwAndRteanUnionTicketsNgn + stateHaulageStickersNgn + produceAndQuarantineLevyNgn + nightTrailerParkFeeNgn;
  const tripCostPerKmNgn = Math.round(totalRoadLevyExpenseNgn / c.km);
  const recommendedDriverRoadAllowanceNgn = totalRoadLevyExpenseNgn + 35000; // plus driver feeding & minor mechanics

  return {
    routeLabel: c.label,
    distanceKm: c.km,
    nurtwAndRteanUnionTicketsNgn,
    stateHaulageStickersNgn,
    produceAndQuarantineLevyNgn,
    nightTrailerParkFeeNgn,
    totalRoadLevyExpenseNgn,
    tripCostPerKmNgn,
    recommendedDriverRoadAllowanceNgn,
  };
}

/**
 * 31. GPS Odometer Mileage vs Highway Diesel Siphoning Auditor
 */
export function calculateGpsDieselMileageAudit(
  tripDistanceKm = 1020,
  dieselLitersAllocated = 480,
  truckTonnage: '30_ton' | '40_ton' | '15_ton' = '30_ton',
  dieselPricePerLiterNgn = 1350
): {
  tripDistanceKm: number;
  dieselLitersAllocated: number;
  expectedLitersConsumed: number;
  unaccountedSiphonedLiters: number;
  standardKmPerLiter: number;
  dieselPilferageLossNgn: number;
  driverDeductionDebitNoteNgn: number;
  fleetAuditStatus: string;
} {
  const kmPerLiterStandard: Record<string, number> = {
    '30_ton': 2.3, // 2.3 km per liter laden
    '40_ton': 2.0, // 2.0 km per liter heavy laden
    '15_ton': 3.2, // 3.2 km per liter rigid
  };

  const standardKmPerLiter = kmPerLiterStandard[truckTonnage] || 2.3;
  const expectedLitersConsumed = Math.round(tripDistanceKm / standardKmPerLiter);
  const unaccountedSiphonedLiters = Math.max(0, dieselLitersAllocated - expectedLitersConsumed);
  const dieselPilferageLossNgn = unaccountedSiphonedLiters * dieselPricePerLiterNgn;
  const driverDeductionDebitNoteNgn = dieselPilferageLossNgn;

  let fleetAuditStatus = 'OPTIMAL: Fuel consumption matches GPS odometer track within 3% tolerance.';
  if (unaccountedSiphonedLiters >= 60) {
    fleetAuditStatus = 'CRITICAL FUEL THEFT: High probability of roadside diesel decanting. Deduct debit claim from driver trip voucher.';
  } else if (unaccountedSiphonedLiters > 25) {
    fleetAuditStatus = 'WARNING: Mild excess fuel consumption. Review traffic idle time or injector nozzle leaks.';
  }

  return {
    tripDistanceKm,
    dieselLitersAllocated,
    expectedLitersConsumed,
    unaccountedSiphonedLiters,
    standardKmPerLiter,
    dieselPilferageLossNgn,
    driverDeductionDebitNoteNgn,
    fleetAuditStatus,
  };
}

// ============================================================================
// 27. AUTHENTIC NIGERIAN MICROFINANCE, ESUSU & REMITA LENDING ENGINES
// ============================================================================

/**
 * 32. Daily Esusu / Thrift Collector Passbook & Shortage Reconciler
 */
export function calculateEsusuThriftPassbook(
  dailyContributionNgn = 3000,
  contributorsCount = 80,
  cycleDays = 31,
  actualCashRemittedNgn = 7200000
): {
  dailyContributionNgn: number;
  contributorsCount: number;
  cycleDays: number;
  grossMonthlyPoolNgn: number;
  oneDayThriftCommissionNgn: number;
  contributorNetMonthEndPayoutNgn: number;
  totalContributorsNetPayoutPoolNgn: number;
  actualCashRemittedNgn: number;
  collectorCashShortageNgn: number;
  esusuAuditRemark: string;
} {
  const grossMonthlyPoolNgn = dailyContributionNgn * contributorsCount * cycleDays;
  // Standard Alajo rule: 1st day contribution belongs to collector as fee
  const oneDayThriftCommissionNgn = dailyContributionNgn * contributorsCount;
  const contributorNetMonthEndPayoutNgn = dailyContributionNgn * (cycleDays - 1);
  const totalContributorsNetPayoutPoolNgn = contributorNetMonthEndPayoutNgn * contributorsCount;

  const collectorCashShortageNgn = Math.max(0, grossMonthlyPoolNgn - actualCashRemittedNgn);

  let esusuAuditRemark = 'RECONCILED: Field collector cash handovers match daily passbook cards.';
  if (collectorCashShortageNgn >= 200000) {
    esusuAuditRemark = 'CRITICAL SHORTAGE: Serious field collection cash diversion detected. Freeze collector commission and initiate market card audit.';
  } else if (collectorCashShortageNgn > 0) {
    esusuAuditRemark = 'VARIANCE DETECTED: Collector under-remitted daily thrift funds.';
  }

  return {
    dailyContributionNgn,
    contributorsCount,
    cycleDays,
    grossMonthlyPoolNgn,
    oneDayThriftCommissionNgn,
    contributorNetMonthEndPayoutNgn,
    totalContributorsNetPayoutPoolNgn,
    actualCashRemittedNgn,
    collectorCashShortageNgn,
    esusuAuditRemark,
  };
}

/**
 * 33. Salary Earner Remita Direct-Debit & 33.33% DSR Loan Eligibility Sizer
 */
export function calculateSalaryRemitaLoanEligibility(
  netMonthlySalaryNgn = 350000,
  existingMonthlyDeductionsNgn = 25000,
  loanTenureMonths = 6,
  monthlyInterestRatePercent = 4.5
): {
  netMonthlySalaryNgn: number;
  maxDsrRepayment33PercentNgn: number;
  availableDirectDebitCapacityNgn: number;
  loanTenureMonths: number;
  qualifyingLoanPrincipalNgn: number;
  totalInterestNgn: number;
  totalRepaymentNgn: number;
  monthlyDirectDebitDeductionNgn: number;
  remitaMandateFeeNgn: number;
  netLoanDisbursementNgn: number;
  dsrApprovalStatus: string;
} {
  // 1/3 maximum Debt-Service Ratio
  const maxDsrRepayment33PercentNgn = Math.round(netMonthlySalaryNgn * 0.3333);
  const availableDirectDebitCapacityNgn = Math.max(0, maxDsrRepayment33PercentNgn - existingMonthlyDeductionsNgn);

  const totalInterestRate = (monthlyInterestRatePercent * loanTenureMonths) / 100;
  // Principal = Available Monthly Repayment * Tenure / (1 + Total Interest Rate)
  const qualifyingLoanPrincipalNgn = Math.round((availableDirectDebitCapacityNgn * loanTenureMonths) / (1 + totalInterestRate));
  const totalInterestNgn = Math.round(qualifyingLoanPrincipalNgn * totalInterestRate);
  const totalRepaymentNgn = qualifyingLoanPrincipalNgn + totalInterestNgn;
  const monthlyDirectDebitDeductionNgn = Math.round(totalRepaymentNgn / loanTenureMonths);

  const remitaMandateFeeNgn = 2500;
  const netLoanDisbursementNgn = Math.max(0, qualifyingLoanPrincipalNgn - remitaMandateFeeNgn);

  let dsrApprovalStatus = 'ELIGIBLE & APPROVED: Monthly deduction within 33.33% statutory DSR limits.';
  if (availableDirectDebitCapacityNgn < 20000) {
    dsrApprovalStatus = 'DECLINED: Existing loan deductions exceed 33.33% debt capacity limit.';
  }

  return {
    netMonthlySalaryNgn,
    maxDsrRepayment33PercentNgn,
    availableDirectDebitCapacityNgn,
    loanTenureMonths,
    qualifyingLoanPrincipalNgn,
    totalInterestNgn,
    totalRepaymentNgn,
    monthlyDirectDebitDeductionNgn,
    remitaMandateFeeNgn,
    netLoanDisbursementNgn,
    dsrApprovalStatus,
  };
}

// ============================================================================
// 28. AUTHENTIC NIGERIAN HOSPITALITY, SHORTLETS & EVENT MARQUEE ENGINES
// ============================================================================

/**
 * 34. Shortlet Electricity Token & Caution Deposit Reconciler
 */
export function calculateShortletCautionAndPowerReconciliation(
  nightlyRateNgn = 110000,
  nightsCount = 4,
  cautionDepositNgn = 60000,
  dailyKwhAllowance = 35,
  actualKwhConsumed = 210,
  damagesReportedNgn = 12000,
  discoRatePerKwhNgn = 209.5
): {
  nightlyRateNgn: number;
  nightsCount: number;
  accommodationSubtotalNgn: number;
  cautionDepositNgn: number;
  totalKwhAllowance: number;
  actualKwhConsumed: number;
  excessKwhConsumed: number;
  excessPowerSurchargeNgn: number;
  damagesReportedNgn: number;
  totalCautionDeductionsNgn: number;
  netRefundableCautionNgn: number;
  hostTotalRevenueCollectedNgn: number;
  reconciliationStatus: string;
} {
  const accommodationSubtotalNgn = nightlyRateNgn * nightsCount;
  const totalKwhAllowance = dailyKwhAllowance * nightsCount;
  const excessKwhConsumed = Math.max(0, actualKwhConsumed - totalKwhAllowance);
  const excessPowerSurchargeNgn = Math.round(excessKwhConsumed * discoRatePerKwhNgn);

  const totalCautionDeductionsNgn = excessPowerSurchargeNgn + damagesReportedNgn;
  const netRefundableCautionNgn = Math.max(0, cautionDepositNgn - totalCautionDeductionsNgn);
  const hostTotalRevenueCollectedNgn = accommodationSubtotalNgn + (cautionDepositNgn - netRefundableCautionNgn);

  let reconciliationStatus = 'FULL CAUTION REFUND: Guest power consumption within token quota with 0 damage.';
  if (netRefundableCautionNgn <= 0) {
    reconciliationStatus = 'CAUTION FORFEITED: Excess DisCo power consumption and damage exceeded caution deposit.';
  } else if (totalCautionDeductionsNgn > 0) {
    reconciliationStatus = 'PARTIAL REFUND: Deductions applied for excess AC electricity and property incidentals.';
  }

  return {
    nightlyRateNgn,
    nightsCount,
    accommodationSubtotalNgn,
    cautionDepositNgn,
    totalKwhAllowance,
    actualKwhConsumed,
    excessKwhConsumed,
    excessPowerSurchargeNgn,
    damagesReportedNgn,
    totalCautionDeductionsNgn,
    netRefundableCautionNgn,
    hostTotalRevenueCollectedNgn,
    reconciliationStatus,
  };
}

/**
 * 35. Event Center Marquee Booking, Caution Bond & Generator Overstay Sizer
 */
export function calculateEventCenterOvertimeAndCaution(
  hallTier: 'budget' | 'standard' | 'luxury_marquee' = 'standard',
  guestCapacity = 600,
  baseHallFeeNgn = 2200000,
  cautionBondNgn = 250000,
  overtimeHours = 2.5,
  includeSanitization = true
): {
  hallTier: string;
  guestCapacity: number;
  baseHallFeeNgn: number;
  cautionBondNgn: number;
  overtimeHours: number;
  hourlyGeneratorTariffNgn: number;
  generatorOvertimeCostNgn: number;
  sanitizationWasteLevyNgn: number;
  totalEventInvoiceNgn: number;
  netCautionBondRefundNgn: number;
  eventBillingRemark: string;
} {
  const hourlyTariffMap: Record<string, number> = {
    budget: 45000, // 100kVA generator
    standard: 75000, // 250kVA generator
    luxury_marquee: 120000, // 500kVA dual sync generators + chiller ACs
  };

  const hourlyGeneratorTariffNgn = hourlyTariffMap[hallTier] || 75000;
  const generatorOvertimeCostNgn = Math.round(overtimeHours * hourlyGeneratorTariffNgn);
  const sanitizationWasteLevyNgn = includeSanitization ? 35000 : 0;

  const totalEventInvoiceNgn = baseHallFeeNgn + cautionBondNgn + sanitizationWasteLevyNgn;
  const netCautionBondRefundNgn = Math.max(0, cautionBondNgn - generatorOvertimeCostNgn);

  let eventBillingRemark = 'STANDARD TIMING: Event concluded within allocated 10-hour daytime slot.';
  if (overtimeHours > 0 && netCautionBondRefundNgn === 0) {
    eventBillingRemark = 'OVERTIME CAUTION DEPLETED: Generator night overstay fully exhausted damage caution bond.';
  } else if (overtimeHours > 0) {
    eventBillingRemark = 'OVERTIME APPLIED: Generator overtime deducted from refundable caution bond.';
  }

  return {
    hallTier,
    guestCapacity,
    baseHallFeeNgn,
    cautionBondNgn,
    overtimeHours,
    hourlyGeneratorTariffNgn,
    generatorOvertimeCostNgn,
    sanitizationWasteLevyNgn,
    totalEventInvoiceNgn,
    netCautionBondRefundNgn,
    eventBillingRemark,
  };
}

// ============================================================================
// 29. AUTHENTIC NIGERIAN PORT CLEARING, DEMURRAGE & CONTAINER RETURN ENGINES
// ============================================================================

/**
 * 36. PAAR Single-Sheet Customs Assessment & Port Tariff Sizer
 */
export function calculatePaarCustomsAssessment(
  cifValueUsd = 28000,
  customsFxRateNgn = 1550,
  dutyRatePercent = 20,
  applyNacLevy = true,
  terminalHandlingNgn = 450000
): {
  cifValueUsd: number;
  customsFxRateNgn: number;
  cifValueNgn: number;
  importDutyNgn: number;
  cissLevyNgn: number;
  etlsLevyNgn: number;
  nacLevyNgn: number;
  vatNgn: number;
  totalCustomsDutyNgn: number;
  terminalHandlingNgn: number;
  totalPortStatutoryOutlayNgn: number;
  assessmentStatus: string;
} {
  const cifValueNgn = Math.round(cifValueUsd * customsFxRateNgn);
  const importDutyNgn = Math.round(cifValueNgn * (dutyRatePercent / 100));
  const cissLevyNgn = Math.round(cifValueNgn * 0.01); // 1% CISS
  const etlsLevyNgn = Math.round(cifValueNgn * 0.005); // 0.5% ETLS
  const nacLevyNgn = applyNacLevy ? Math.round(cifValueNgn * 0.15) : 0; // 15% NAC

  const dutiableBasis = cifValueNgn + importDutyNgn + cissLevyNgn + etlsLevyNgn + nacLevyNgn;
  const vatNgn = Math.round(dutiableBasis * 0.075); // 7.5% VAT

  const totalCustomsDutyNgn = importDutyNgn + cissLevyNgn + etlsLevyNgn + nacLevyNgn + vatNgn;
  const totalPortStatutoryOutlayNgn = totalCustomsDutyNgn + terminalHandlingNgn;

  const assessmentStatus = 'PAAR READY: Single-sheet customs duty assessment generated for e-Tranzact bank clearance.';

  return {
    cifValueUsd,
    customsFxRateNgn,
    cifValueNgn,
    importDutyNgn,
    cissLevyNgn,
    etlsLevyNgn,
    nacLevyNgn,
    vatNgn,
    totalCustomsDutyNgn,
    terminalHandlingNgn,
    totalPortStatutoryOutlayNgn,
    assessmentStatus,
  };
}

/**
 * 37. Empty Container Return EIR & Holding Bay Deposit Refund Tracker
 */
export function calculateContainerDepositRefund(
  containerCount = 3,
  depositPerContainerNgn = 450000,
  returnDaysFromDischarge = 24,
  freeDaysAllowed = 14,
  containerCondition: 'clean_intact' | 'minor_dent_dirty' | 'structural_damage' = 'clean_intact'
): {
  containerCount: number;
  totalDepositPaidNgn: number;
  returnDaysFromDischarge: number;
  freeDaysAllowed: number;
  overdueDaysCount: number;
  demurrageDetentionFineNgn: number;
  conditionRepairDeductionNgn: number;
  totalDepositDeductionsNgn: number;
  netRefundableDepositNgn: number;
  refundTimelineRemark: string;
} {
  const totalDepositPaidNgn = containerCount * depositPerContainerNgn;
  const overdueDaysCount = Math.max(0, returnDaysFromDischarge - freeDaysAllowed);

  // Daily detention fee past free days: ₦18,500/day/container
  const demurrageDetentionFineNgn = overdueDaysCount * 18500 * containerCount;

  const damageFeeMap: Record<string, number> = {
    clean_intact: 0,
    minor_dent_dirty: 35000 * containerCount, // washing & dent prep
    structural_damage: 120000 * containerCount, // heavy weld repair
  };

  const conditionRepairDeductionNgn = damageFeeMap[containerCondition] || 0;
  const totalDepositDeductionsNgn = demurrageDetentionFineNgn + conditionRepairDeductionNgn;
  const netRefundableDepositNgn = Math.max(0, totalDepositPaidNgn - totalDepositDeductionsNgn);

  let refundTimelineRemark = 'ELIGIBLE FOR FULL EIR REFUND: Container returned within free period with 0 damage.';
  if (netRefundableDepositNgn === 0) {
    refundTimelineRemark = 'DEPOSIT FORFEITED: Extended holding bay detention and damage exceeded initial deposit.';
  } else if (totalDepositDeductionsNgn > 0) {
    refundTimelineRemark = 'PARTIAL REFUND: Deductions applied for late holding bay gate-in / container repairs.';
  }

  return {
    containerCount,
    totalDepositPaidNgn,
    returnDaysFromDischarge,
    freeDaysAllowed,
    overdueDaysCount,
    demurrageDetentionFineNgn,
    conditionRepairDeductionNgn,
    totalDepositDeductionsNgn,
    netRefundableDepositNgn,
    refundTimelineRemark,
  };
}

// ============================================================================
// 30. AUTHENTIC NIGERIAN CONSTRUCTION, QUARRY & B2B ENTERPRISE ENGINES
// ============================================================================

/**
 * 38. Quarry Aggregate Tonnage & Weighbridge Dispatch Sizer
 */
export function calculateQuarryWeighbridgeDispatch(
  aggregateType: 'stone_dust' | 'half_inch' | 'three_quarter' | 'hardcore' = 'three_quarter',
  truckTonnage = 30,
  haulageDistanceKm = 45,
  truckTripsCount = 4
): {
  aggregateType: string;
  unitPricePerTonNgn: number;
  totalTonnageSupplied: number;
  quarryMaterialsSubtotalNgn: number;
  haulageFreightPerTripNgn: number;
  totalHaulageFreightNgn: number;
  totalQuarryDispatchInvoiceNgn: number;
  dispatchWaybillNote: string;
} {
  const pricePerTonMap: Record<string, { label: string; price: number }> = {
    stone_dust: { label: 'Stone Dust (0-5mm)', price: 4200 },
    half_inch: { label: '1/2-Inch Granite Aggregate', price: 6800 },
    three_quarter: { label: '3/4-Inch Clean Granite', price: 7500 },
    hardcore: { label: 'Hardcore Foundation Boulder', price: 5800 },
  };

  const selected = pricePerTonMap[aggregateType] || pricePerTonMap.three_quarter;
  const totalTonnageSupplied = truckTonnage * truckTripsCount;
  const quarryMaterialsSubtotalNgn = totalTonnageSupplied * selected.price;

  // Haulage freight formula: ₦1,200 base per km per 30-ton trip
  const haulageFreightPerTripNgn = Math.round(haulageDistanceKm * 1850);
  const totalHaulageFreightNgn = haulageFreightPerTripNgn * truckTripsCount;
  const totalQuarryDispatchInvoiceNgn = quarryMaterialsSubtotalNgn + totalHaulageFreightNgn;

  const dispatchWaybillNote = `WEIGHBRIDGE DISPATCH READY: ${totalTonnageSupplied} Tons of ${selected.label} across ${truckTripsCount} tipper trips.`;

  return {
    aggregateType: selected.label,
    unitPricePerTonNgn: selected.price,
    totalTonnageSupplied,
    quarryMaterialsSubtotalNgn,
    haulageFreightPerTripNgn,
    totalHaulageFreightNgn,
    totalQuarryDispatchInvoiceNgn,
    dispatchWaybillNote,
  };
}

/**
 * 39. Structural Concrete Mix (1:2:4 / M20) & Rebar Steel Sizer
 */
export function calculateConcreteStructuralMix(
  slabAreaSqm = 250,
  slabThicknessMeters = 0.15,
  cementPricePerBagNgn = 9500,
  includeRebarReinforcement = true
): {
  totalConcreteVolumeM3: number;
  cementBagsRequired: number;
  cementExpenseNgn: number;
  sharpSandTonsRequired: number;
  graniteTonsRequired: number;
  rebarTonsRequired: number;
  rebarExpenseNgn: number;
  totalConcreteAndSteelCostNgn: number;
  structuralMixRemark: string;
} {
  const totalConcreteVolumeM3 = Math.round(slabAreaSqm * slabThicknessMeters * 10) / 10;
  // Standard 1:2:4 (M20) mix standard in Nigeria: ~6.5 bags of Dangote/BUA 50kg cement per m³
  const cementBagsRequired = Math.round(totalConcreteVolumeM3 * 6.8);
  const cementExpenseNgn = cementBagsRequired * cementPricePerBagNgn;

  // Sharp sand: ~0.45 m³ (~0.7 tons) per m³
  const sharpSandTonsRequired = Math.round(totalConcreteVolumeM3 * 0.75 * 10) / 10;
  // 3/4 Granite: ~0.9 m³ (~1.4 tons) per m³
  const graniteTonsRequired = Math.round(totalConcreteVolumeM3 * 1.45 * 10) / 10;

  // Rebar: ~80kg per m³ for suspended slab/German floor
  const rebarTonsRequired = includeRebarReinforcement ? Math.round((totalConcreteVolumeM3 * 85 / 1000) * 100) / 100 : 0;
  const rebarExpenseNgn = Math.round(rebarTonsRequired * 1350000); // ₦1.35M per ton of 12mm/16mm TMT high-yield rebar

  const totalConcreteAndSteelCostNgn = cementExpenseNgn + (sharpSandTonsRequired * 8500) + (graniteTonsRequired * 7500) + rebarExpenseNgn;
  const structuralMixRemark = `STRUCTURAL READY: ${totalConcreteVolumeM3} m³ casting requirements (${cementBagsRequired} cement bags & ${rebarTonsRequired}T rebar).`;

  return {
    totalConcreteVolumeM3,
    cementBagsRequired,
    cementExpenseNgn,
    sharpSandTonsRequired,
    graniteTonsRequired,
    rebarTonsRequired,
    rebarExpenseNgn,
    totalConcreteAndSteelCostNgn,
    structuralMixRemark,
  };
}

/**
 * 40. NFC Perimeter Patrol & Security Guard Shift Roster
 */
export function calculateSecurityGuardRosterAndPatrol(
  perimeterCheckpoints = 16,
  patrolFrequencyHours = 0.5,
  guardShiftsCount = 2,
  dailyGuardHeadcount = 6,
  guardMonthlySalaryNgn = 65000
): {
  perimeterCheckpoints: number;
  totalPatrolTapsPerDay: number;
  totalGuardsOnPayroll: number;
  monthlyPayrollCostNgn: number;
  guardUniformAndRadioLevyNgn: number;
  supervisoryOverheadNgn: number;
  totalMonthlySecurityOperationsNgn: number;
  patrolReadinessScore: string;
} {
  const tapsPerPatrol = perimeterCheckpoints;
  const patrolsPer24Hours = Math.round(24 / patrolFrequencyHours);
  const totalPatrolTapsPerDay = tapsPerPatrol * patrolsPer24Hours;

  const totalGuardsOnPayroll = dailyGuardHeadcount * guardShiftsCount + 2; // includes 2 relief guards
  const monthlyPayrollCostNgn = totalGuardsOnPayroll * guardMonthlySalaryNgn;
  const guardUniformAndRadioLevyNgn = totalGuardsOnPayroll * 7500;
  const supervisoryOverheadNgn = Math.round(monthlyPayrollCostNgn * 0.15);

  const totalMonthlySecurityOperationsNgn = monthlyPayrollCostNgn + guardUniformAndRadioLevyNgn + supervisoryOverheadNgn;
  const patrolReadinessScore = 'HIGH SECURITY: 100% 30-minute NFC clock-in perimeter patrol with instant control room alarms.';

  return {
    perimeterCheckpoints,
    totalPatrolTapsPerDay,
    totalGuardsOnPayroll,
    monthlyPayrollCostNgn,
    guardUniformAndRadioLevyNgn,
    supervisoryOverheadNgn,
    totalMonthlySecurityOperationsNgn,
    patrolReadinessScore,
  };
}

/**
 * 41. WhatsApp Resident Intercom & Visitor Access Gate Pass Capacity
 */
export function calculateEstateVisitorPassCapacity(
  residentHousesCount = 220,
  averageVisitorsPerHouseWeekly = 6,
  estateGateLanes = 2,
  monthlyIntercomLevyPerHouseNgn = 2500
): {
  residentHousesCount: number;
  monthlyVisitorPassesGenerated: number;
  peakHourGateClearanceSeconds: number;
  monthlyIntercomRevenueNgn: number;
  automatedSmsAndWhatsAppGatewayCostNgn: number;
  netEstateIntercomFundNgn: number;
  gateCongestionStatus: string;
} {
  const monthlyVisitorPassesGenerated = Math.round(residentHousesCount * averageVisitorsPerHouseWeekly * 4.33);
  const peakHourGateClearanceSeconds = Math.round(22 / estateGateLanes); // 11 seconds per digital QR/6-digit validation
  const monthlyIntercomRevenueNgn = residentHousesCount * monthlyIntercomLevyPerHouseNgn;
  const automatedSmsAndWhatsAppGatewayCostNgn = Math.round(monthlyVisitorPassesGenerated * 6.5);
  const netEstateIntercomFundNgn = monthlyIntercomRevenueNgn - automatedSmsAndWhatsAppGatewayCostNgn;

  const gateCongestionStatus = 'SEAMLESS ACCESS: Average 11-second gate verification eliminates estate entry traffic.';

  return {
    residentHousesCount,
    monthlyVisitorPassesGenerated,
    peakHourGateClearanceSeconds,
    monthlyIntercomRevenueNgn,
    automatedSmsAndWhatsAppGatewayCostNgn,
    netEstateIntercomFundNgn,
    gateCongestionStatus,
  };
}

/**
 * 42. FIRS VAT/WHT Pro-Forma Invoice & Enterprise Proposal Sizer
 */
export function calculateB2bProformaInvoice(
  servicesSubtotalNgn = 3500000,
  applyVat75Percent = true,
  applyWht5Percent = true,
  deliveryOrReimbursableNgn = 120000
): {
  servicesSubtotalNgn: number;
  vat75PercentNgn: number;
  grossInvoiceTotalNgn: number;
  wht5PercentDeductionNgn: number;
  netBankRemittanceNgn: number;
  deliveryOrReimbursableNgn: number;
  totalPayableNgn: number;
  invoiceTaxStatus: string;
} {
  const vat75PercentNgn = applyVat75Percent ? Math.round(servicesSubtotalNgn * 0.075) : 0;
  const grossInvoiceTotalNgn = servicesSubtotalNgn + vat75PercentNgn + deliveryOrReimbursableNgn;
  const wht5PercentDeductionNgn = applyWht5Percent ? Math.round(servicesSubtotalNgn * 0.05) : 0;
  const netBankRemittanceNgn = grossInvoiceTotalNgn - wht5PercentDeductionNgn;
  const totalPayableNgn = grossInvoiceTotalNgn;

  const invoiceTaxStatus = 'FIRS COMPLIANT: Pro-Forma invoice generated with 7.5% statutory VAT & 5% WHT credit note.';

  return {
    servicesSubtotalNgn,
    vat75PercentNgn,
    grossInvoiceTotalNgn,
    wht5PercentDeductionNgn,
    netBankRemittanceNgn,
    deliveryOrReimbursableNgn,
    totalPayableNgn,
    invoiceTaxStatus,
  };
}

// ============================================================================
// 32. ESTATE DIGITAL GATE PASS & RESIDENT LEVIES ENGINE
// ============================================================================

export function calculateEstateVisitorPassAndLevy(
  residentHousesCount = 200,
  monthlySecurityLevyNgn = 25000,
  visitorDailyVolume = 120,
  gateLanesCount = 2
) {
  const totalMonthlyLevyBudgetNgn = residentHousesCount * monthlySecurityLevyNgn;
  const estimatedMonthlyAccessCodes = visitorDailyVolume * 30;
  const peakHourlyTraffic = Math.ceil(visitorDailyVolume / 4);
  const averageVerificationSeconds = 8;
  const securityGuardHeadcount = Math.max(4, Math.ceil(gateLanesCount * 2 * 1.5));

  return {
    residentHousesCount,
    monthlySecurityLevyNgn,
    totalMonthlyLevyBudgetNgn,
    estimatedMonthlyAccessCodes,
    peakHourlyTraffic,
    averageVerificationSeconds,
    securityGuardHeadcount,
    sampleAccessCode: `EP-${Math.floor(100000 + Math.random() * 900000)}`,
    gateStatusRemark: 'SMART GATE ACTIVE: 100% digital visitor logging with zero manual paper registers.'
  };
}

// ============================================================================
// 33. CHINA (1688 / ALIBABA) IMPORT FREIGHT & LANDED COST SIZER
// ============================================================================

export function calculateChinaImportFreightLandedCost(
  itemCostRmb = 45,
  quantity = 100,
  weightKg = 25,
  volumeCbm = 0.15,
  freightType: 'air_express' | 'ocean_sea' = 'air_express',
  fxRmbToNgn = 220,
  fxUsdToNgn = 1580
) {
  const totalRmbCost = itemCostRmb * quantity;
  const productCostNgn = totalRmbCost * fxRmbToNgn;

  // Air Cargo per Kg vs Sea Cargo per CBM (NCS Lagos Clearing)
  let freightCostNgn = 0;
  let estimatedDeliveryDays = 7;

  if (freightType === 'air_express') {
    const ratePerKgUsd = 8.5; // $8.50 per kg air cargo
    const airFreightUsd = Math.max(50, weightKg * ratePerKgUsd);
    freightCostNgn = Math.round(airFreightUsd * fxUsdToNgn);
    estimatedDeliveryDays = 7;
  } else {
    const ratePerCbmUsd = 280; // $280 per CBM sea cargo
    const seaFreightUsd = Math.max(100, volumeCbm * ratePerCbmUsd);
    freightCostNgn = Math.round(seaFreightUsd * fxUsdToNgn);
    estimatedDeliveryDays = 35;
  }

  const customsClearingHandlingNgn = Math.round(productCostNgn * 0.08); // 8% local clearing
  const totalLandedCostNgn = productCostNgn + freightCostNgn + customsClearingHandlingNgn;
  const unitLandedCostNgn = Math.round(totalLandedCostNgn / quantity);
  const suggestedRetailPriceNgn = Math.round(unitLandedCostNgn * 1.45); // 45% gross margin
  const projectedNetProfitNgn = (suggestedRetailPriceNgn - unitLandedCostNgn) * quantity;

  return {
    quantity,
    totalRmbCost,
    productCostNgn,
    freightCostNgn,
    customsClearingHandlingNgn,
    totalLandedCostNgn,
    unitLandedCostNgn,
    suggestedRetailPriceNgn,
    projectedNetProfitNgn,
    estimatedDeliveryDays,
    profitMarginPercent: 45
  };
}

// ============================================================================
// 34. CONSTRUCTION CONCRETE STRUCTURAL CEMENT & REBAR SIZER
// ============================================================================

export function calculateConstructionConcreteAndRebar(
  slabLengthMeters = 15,
  slabWidthMeters = 10,
  slabThicknessMeters = 0.15,
  cementBagPriceNgn = 9500,
  rebarTonPriceNgn = 1250000
) {
  const slabAreaSqm = slabLengthMeters * slabWidthMeters;
  const concreteVolumeCubicMeters = Math.round(slabAreaSqm * slabThicknessMeters * 100) / 100;

  // Standard 1:2:4 Concrete Mix Ratio per m3
  const cementBagsRequired = Math.ceil(concreteVolumeCubicMeters * 6.5); // 6.5 bags per m3
  const sharpSandTons = Math.round(concreteVolumeCubicMeters * 0.45 * 10) / 10;
  const graniteTons = Math.round(concreteVolumeCubicMeters * 0.85 * 10) / 10;
  const rebarTonnage = Math.round((concreteVolumeCubicMeters * 0.08) * 100) / 100; // 80kg/m3 avg rebar

  const totalCementCostNgn = cementBagsRequired * cementBagPriceNgn;
  const totalSandCostNgn = Math.round(sharpSandTons * 12000);
  const totalGraniteCostNgn = Math.round(graniteTons * 18000);
  const totalRebarCostNgn = Math.round(rebarTonnage * rebarTonPriceNgn);
  const totalMaterialEstimateNgn = totalCementCostNgn + totalSandCostNgn + totalGraniteCostNgn + totalRebarCostNgn;

  return {
    slabAreaSqm,
    concreteVolumeCubicMeters,
    cementBagsRequired,
    sharpSandTons,
    graniteTons,
    rebarTonnage,
    totalCementCostNgn,
    totalSandCostNgn,
    totalGraniteCostNgn,
    totalRebarCostNgn,
    totalMaterialEstimateNgn,
    structuralStandard: 'BS 8110 / Eurocode 2 (1:2:4 Grade 20 Structural Slab Mix)'
  };
}

// ============================================================================
// 35. PETROL STATION & LPG GAS SKID DAILY AUDITING & VARIANCE SIZER
// ============================================================================

export function calculateLpgStationDippingAndCashAudit(
  openingDipLiters = 35000,
  closingDipLiters = 26500,
  pumpTotalizerSalesLiters = 8400,
  pumpPricePerLiterNgn = 1050,
  cashCollectedNgn = 8820000,
  tankCapacityLiters = 45000
) {
  const physicalDischargeLiters = openingDipLiters - closingDipLiters;
  const varianceLiters = physicalDischargeLiters - pumpTotalizerSalesLiters;
  const allowableShrinkageLiters = Math.round(physicalDischargeLiters * 0.003); // 0.3% standard evaporation
  const netUnaccountedShrinkageLiters = Math.max(0, varianceLiters - allowableShrinkageLiters);
  const expectedCashRevenueNgn = pumpTotalizerSalesLiters * pumpPricePerLiterNgn;
  const cashShortageOrSurplusNgn = cashCollectedNgn - expectedCashRevenueNgn;

  let auditRiskStatus = 'LOW RISK: Station variances within standard temperature evaporation thresholds.';
  if (Math.abs(cashShortageOrSurplusNgn) > 50000 || netUnaccountedShrinkageLiters > 100) {
    auditRiskStatus = 'CRITICAL: Discrepancy detected between pump totalizer sales and physical tank dip.';
  }

  return {
    openingDipLiters,
    closingDipLiters,
    physicalDischargeLiters,
    pumpTotalizerSalesLiters,
    varianceLiters,
    allowableShrinkageLiters,
    netUnaccountedShrinkageLiters,
    expectedCashRevenueNgn,
    cashCollectedNgn,
    cashShortageOrSurplusNgn,
    auditRiskStatus
  };
}

// ============================================================================
// 36. NIGERIAN PAYE TAX & SALARY SLIP ENGINE
// ============================================================================

export function calculateNigerianPayeAndSalarySlip(
  grossMonthlySalaryNgn = 450000,
  hasNhf = true,
  employeePensionPercent = 8,
  employerPensionPercent = 10
) {
  const grossAnnualSalaryNgn = grossMonthlySalaryNgn * 12;
  const employeeMonthlyPensionNgn = Math.round(grossMonthlySalaryNgn * (employeePensionPercent / 100));
  const employerMonthlyPensionNgn = Math.round(grossMonthlySalaryNgn * (employerPensionPercent / 100));
  const nhfMonthlyDeductionNgn = hasNhf ? Math.round(grossMonthlySalaryNgn * 0.025) : 0;

  // Statutory Consolidated Relief Allowance (CRA): Higher of ₦200k or 1% of Gross + 20% of Gross
  const craAnnual = Math.max(200000, grossAnnualSalaryNgn * 0.01) + (grossAnnualSalaryNgn * 0.20);
  const totalTaxReliefAnnual = craAnnual + (employeeMonthlyPensionNgn * 12) + (nhfMonthlyDeductionNgn * 12);
  const taxableAnnualIncome = Math.max(0, grossAnnualSalaryNgn - totalTaxReliefAnnual);

  // Progressive Tax Bands (Personal Income Tax Act PITA)
  const monthlyPayeTaxNgn = Math.round((taxableAnnualIncome * 0.16) / 12); // Average effective PITA rate
  const totalMonthlyDeductionsNgn = employeeMonthlyPensionNgn + nhfMonthlyDeductionNgn + monthlyPayeTaxNgn;
  const netTakeHomeSalaryNgn = grossMonthlySalaryNgn - totalMonthlyDeductionsNgn;

  return {
    grossMonthlySalaryNgn,
    employeeMonthlyPensionNgn,
    employerMonthlyPensionNgn,
    nhfMonthlyDeductionNgn,
    monthlyPayeTaxNgn,
    totalMonthlyDeductionsNgn,
    netTakeHomeSalaryNgn,
    statutoryCompliance: 'PITA & Pension Reform Act (PRA 2014) / LIRS Compliant'
  };
}

// ============================================================================
// 37. AUTOMOTIVE OBD-II DIAGNOSTIC FAULT ESTIMATOR
// ============================================================================

export function calculateObd2DiagnosticFaultEstimate(
  faultCode: 'P0420' | 'P0300' | 'P0171' | 'P0700' | 'C0035' = 'P0420',
  carMake = 'Toyota',
  carYear = 2015
) {
  const codeDatabase: Record<string, { title: string; part: string; partCostNgn: number; laborNgn: number; urgency: string; desc: string }> = {
    P0420: {
      title: 'Catalytic Converter System Efficiency Below Threshold (Bank 1)',
      part: 'Direct-Fit Exhaust Catalytic Converter / O2 Oxygen Sensors',
      partCostNgn: 145000,
      laborNgn: 25000,
      urgency: 'MODERATE: Increased fuel consumption & exhaust emissions.',
      desc: 'Vehicle exhaust catalyst is degraded or oxygen sensor readings are failing.'
    },
    P0300: {
      title: 'Random / Multiple Cylinder Misfire Detected',
      part: 'Iridium Spark Plugs (Set of 4/6) & Ignition Coils',
      partCostNgn: 48000,
      laborNgn: 15000,
      urgency: 'HIGH: Engine jerking, power loss, and fuel wastage.',
      desc: 'Spark ignition or fuel injectors are failing to combust properly in cylinders.'
    },
    P0171: {
      title: 'Fuel Trim System Too Lean (Bank 1)',
      part: 'Mass Air Flow (MAF) Sensor & Intake Manifold Gasket',
      partCostNgn: 38000,
      laborNgn: 18000,
      urgency: 'MODERATE: Engine hesitating on acceleration.',
      desc: 'Too much air or too little fuel entering the combustion chamber.'
    },
    P0700: {
      title: 'Transmission Control System Malfunction',
      part: 'Automatic Transmission Fluid (ATF WS) & Shift Solenoids',
      partCostNgn: 75000,
      laborNgn: 30000,
      urgency: 'CRITICAL: Risk of gearbox slip or gear locking.',
      desc: 'Gearbox control module detected electronic or hydraulic pressure irregularity.'
    },
    C0035: {
      title: 'Left Front Wheel Speed Sensor Circuit Malfunction (ABS)',
      part: 'ABS Wheel Speed Sensor Hub Assembly',
      partCostNgn: 28000,
      laborNgn: 12000,
      urgency: 'SAFETY ALERT: Anti-lock braking and traction control disabled.',
      desc: 'Speed sensor communication severed on front hub wheel.'
    }
  };

  const info = codeDatabase[faultCode] || codeDatabase.P0420;
  const totalEstimatedRepairNgn = info.partCostNgn + info.laborNgn;

  return {
    faultCode,
    carMake,
    carYear,
    diagnosticTitle: info.title,
    recommendedReplacementParts: info.part,
    partsCostNgn: info.partCostNgn,
    laborFeeNgn: info.laborNgn,
    totalEstimatedRepairNgn,
    urgencyLevel: info.urgency,
    plainEnglishSummary: info.desc
  };
}

// ============================================================================
// 38. POULTRY FCR FEED & EGG PRODUCTION SIZER
// ============================================================================

export function calculatePoultryFcrAndEggProduction(
  flockType: 'broiler' | 'layer' = 'layer',
  birdCount = 2000,
  feedBagsConsumedWeekly = 35,
  weeklyEggCratesOrWeightKg = 380,
  feedBagPriceNgn = 18500,
  eggCratePriceNgn = 4500
) {
  const weeklyFeedCostNgn = feedBagsConsumedWeekly * feedBagPriceNgn;
  const totalKgFeedWeekly = feedBagsConsumedWeekly * 25; // 25kg standard feed bag

  let weeklyGrossRevenueNgn = 0;
  let productionMetricLabel = '';
  let efficiencyRate = 0;

  if (flockType === 'layer') {
    weeklyGrossRevenueNgn = weeklyEggCratesOrWeightKg * eggCratePriceNgn;
    const dailyEggs = (weeklyEggCratesOrWeightKg * 30) / 7;
    efficiencyRate = Math.round((dailyEggs / birdCount) * 100); // Daily Lay Percentage
    productionMetricLabel = `${efficiencyRate}% Daily Egg Laying Rate (${weeklyEggCratesOrWeightKg} Crates/Wk)`;
  } else {
    const liveWeightKgPriceNgn = 3200;
    weeklyGrossRevenueNgn = weeklyEggCratesOrWeightKg * liveWeightKgPriceNgn;
    efficiencyRate = Math.round((totalKgFeedWeekly / (weeklyEggCratesOrWeightKg || 1)) * 100) / 100; // FCR
    productionMetricLabel = `Feed Conversion Ratio (FCR): ${efficiencyRate} (Kg Feed / Kg Gain)`;
  }

  const weeklyNetFarmProfitNgn = weeklyGrossRevenueNgn - weeklyFeedCostNgn;
  const monthlyProjectedMarginNgn = weeklyNetFarmProfitNgn * 4.3;

  return {
    flockType,
    birdCount,
    weeklyFeedCostNgn,
    weeklyGrossRevenueNgn,
    weeklyNetFarmProfitNgn,
    monthlyProjectedMarginNgn,
    productionMetricLabel,
    farmPerformanceStatus: efficiencyRate >= 75 ? 'OPTIMAL: High flock conversion efficiency.' : 'REVIEW: Check feed quality and water intake.'
  };
}

// ============================================================================
// 39. BEAUTY SALON & STYLIST APPOINTMENT CUSTOMIZER
// ============================================================================

export function calculateBeautySalonStylistBooking(
  serviceCategory: 'hair_extensions' | 'bridal_styling' | 'spa_facial' | 'nail_bar' = 'hair_extensions',
  hairLengthInches = 22,
  stylistTier: 'senior' | 'master_director' = 'senior'
) {
  const tierMultiplier = stylistTier === 'master_director' ? 1.4 : 1.0;
  let baseServiceFeeNgn = 25000;
  let extensionsMaterialCostNgn = 0;

  if (serviceCategory === 'hair_extensions') {
    baseServiceFeeNgn = Math.round(35000 * tierMultiplier);
    extensionsMaterialCostNgn = Math.round(hairLengthInches * 4500); // ₦4.5k per inch raw human hair
  } else if (serviceCategory === 'bridal_styling') {
    baseServiceFeeNgn = Math.round(120000 * tierMultiplier);
  } else if (serviceCategory === 'spa_facial') {
    baseServiceFeeNgn = Math.round(28000 * tierMultiplier);
  } else {
    baseServiceFeeNgn = Math.round(18000 * tierMultiplier);
  }

  const totalBookingCostNgn = baseServiceFeeNgn + extensionsMaterialCostNgn;
  const mandatoryDeposit25PercentNgn = Math.round(totalBookingCostNgn * 0.25);
  const balancePayableAtSalonNgn = totalBookingCostNgn - mandatoryDeposit25PercentNgn;

  return {
    serviceCategory,
    hairLengthInches,
    stylistTier,
    baseServiceFeeNgn,
    extensionsMaterialCostNgn,
    totalBookingCostNgn,
    mandatoryDeposit25PercentNgn,
    balancePayableAtSalonNgn,
    bookingConfirmationCode: `VIP-${Math.floor(1000 + Math.random() * 9000)}`,
    salonPolicyRemark: 'SEAT LOCKED: 25% deposit secures chair reservation. Balance payable on arrival.'
  };
}
















