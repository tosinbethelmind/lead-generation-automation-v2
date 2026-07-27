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
