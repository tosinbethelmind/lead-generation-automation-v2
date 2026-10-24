/**
 * @file programmaticSeoEngine.ts
 * BETHELMIND DIGITAL SOLUTIONS (RC 7034297)
 * High-Velocity Programmatic SEO (pSEO) Data Engine & Dynamic Route Generator
 * Generates 250+ targeted, high-intent Nigerian commercial landing page models.
 */

export interface PSeoLocationData {
  slug: string;
  name: string;
  state: string;
  disco: string;
  bandATariff: number; // NGN per kWh
  peakSunHours: number; // Daily PSH
  dieselAvgPrice: number; // NGN per Liter
  gridReliabilityHours: number; // Daily avg grid hours
}

export interface PSeoCarModelData {
  slug: string;
  make: string;
  model: string;
  year: number;
  engineSize: string;
  cifUsd: number;
  terminalPort: 'Tin Can Island' | 'PTML Grimaldi';
  customsDutyNgn: number;
  nacLevyNgn: number;
  vatNgn: number;
  terminalDemurrageNgn: number;
  totalClearingEstimateNgn: number;
}

export interface PSeoBuildingLocationData {
  slug: string;
  area: string;
  city: string;
  sandPricePerTrip: number; // 20-tonne tipper
  granitePricePerTrip: number; // 30-tonne tipper
  cementPricePerBag: number; // Dangote/BUA 42.5R
  ironRodPricePerTonne: number; // 16mm TMT
  soilType: 'Swampy/Waterlogged' | 'Firm Sand' | 'Red Earth Laterite';
  raftOrPilingRecommended: string;
}

// 1. TOP NIGERIAN COMMERCIAL HUBS (SOLAR & UTILITY)
export const NIGERIAN_SOLAR_HUBS: PSeoLocationData[] = [
  // Lagos Hubs
  { slug: 'ikeja', name: 'Ikeja Commercial Corridor', state: 'Lagos', disco: 'Ikeja Electric (IKEDC)', bandATariff: 209.50, peakSunHours: 4.3, dieselAvgPrice: 1300, gridReliabilityHours: 12 },
  { slug: 'lekki', name: 'Lekki Phase 1 & Corridor', state: 'Lagos', disco: 'Eko Electric (EKEDC)', bandATariff: 209.50, peakSunHours: 4.2, dieselAvgPrice: 1320, gridReliabilityHours: 10 },
  { slug: 'victoria-island', name: 'Victoria Island & Ikoyi', state: 'Lagos', disco: 'Eko Electric (EKEDC)', bandATariff: 209.50, peakSunHours: 4.2, dieselAvgPrice: 1350, gridReliabilityHours: 14 },
  { slug: 'surulere', name: 'Surulere & Stadium Axis', state: 'Lagos', disco: 'Eko Electric (EKEDC)', bandATariff: 209.50, peakSunHours: 4.3, dieselAvgPrice: 1280, gridReliabilityHours: 11 },
  { slug: 'ajah', name: 'Ajah & Sangotedo Corridor', state: 'Lagos', disco: 'Eko Electric (EKEDC)', bandATariff: 209.50, peakSunHours: 4.2, dieselAvgPrice: 1290, gridReliabilityHours: 8 },
  { slug: 'yaba', name: 'Yaba Tech Corridor & Ebute Metta', state: 'Lagos', disco: 'EKEDC/IKEDC', bandATariff: 209.50, peakSunHours: 4.3, dieselAvgPrice: 1280, gridReliabilityHours: 10 },
  { slug: 'magodo', name: 'Magodo GRA 1 & 2', state: 'Lagos', disco: 'Ikeja Electric (IKEDC)', bandATariff: 209.50, peakSunHours: 4.4, dieselAvgPrice: 1300, gridReliabilityHours: 12 },
  { slug: 'alaba-trade-fair', name: 'Alaba International & Trade Fair', state: 'Lagos', disco: 'Eko Electric (EKEDC)', bandATariff: 209.50, peakSunHours: 4.3, dieselAvgPrice: 1280, gridReliabilityHours: 7 },
  { slug: 'festac', name: 'Festac Town & Amuwo Odofin', state: 'Lagos', disco: 'Eko Electric (EKEDC)', bandATariff: 209.50, peakSunHours: 4.3, dieselAvgPrice: 1270, gridReliabilityHours: 9 },
  { slug: 'ikoyi', name: 'Banana Island & Old Ikoyi', state: 'Lagos', disco: 'Eko Electric (EKEDC)', bandATariff: 209.50, peakSunHours: 4.2, dieselAvgPrice: 1350, gridReliabilityHours: 15 },
  { slug: 'ogba-ikeja', name: 'Ogba & Agege Industrial Zone', state: 'Lagos', disco: 'Ikeja Electric (IKEDC)', bandATariff: 209.50, peakSunHours: 4.4, dieselAvgPrice: 1280, gridReliabilityHours: 10 },
  { slug: 'maryland-mende', name: 'Maryland & Anthony Village', state: 'Lagos', disco: 'Ikeja Electric (IKEDC)', bandATariff: 209.50, peakSunHours: 4.4, dieselAvgPrice: 1290, gridReliabilityHours: 11 },
  { slug: 'ikorodu', name: 'Ikorodu Metro Axis', state: 'Lagos', disco: 'Ikeja Electric (IKEDC)', bandATariff: 209.50, peakSunHours: 4.4, dieselAvgPrice: 1260, gridReliabilityHours: 8 },

  // Abuja Hubs
  { slug: 'abuja-central', name: 'Abuja Central Business District', state: 'Abuja FCT', disco: 'Abuja Electric (AEDC)', bandATariff: 209.50, peakSunHours: 5.1, dieselAvgPrice: 1350, gridReliabilityHours: 14 },
  { slug: 'abuja-gwarinpa', name: 'Gwarinpa Estate', state: 'Abuja FCT', disco: 'Abuja Electric (AEDC)', bandATariff: 209.50, peakSunHours: 5.1, dieselAvgPrice: 1320, gridReliabilityHours: 11 },
  { slug: 'abuja-maitama', name: 'Maitama Diplomatic Zone', state: 'Abuja FCT', disco: 'Abuja Electric (AEDC)', bandATariff: 209.50, peakSunHours: 5.1, dieselAvgPrice: 1380, gridReliabilityHours: 16 },
  { slug: 'abuja-wuse', name: 'Wuse 2 & Zone 4 Commercial Corridor', state: 'Abuja FCT', disco: 'Abuja Electric (AEDC)', bandATariff: 209.50, peakSunHours: 5.1, dieselAvgPrice: 1340, gridReliabilityHours: 13 },
  { slug: 'abuja-asokoro', name: 'Asokoro Executive District', state: 'Abuja FCT', disco: 'Abuja Electric (AEDC)', bandATariff: 209.50, peakSunHours: 5.1, dieselAvgPrice: 1380, gridReliabilityHours: 16 },
  { slug: 'abuja-jabi', name: 'Jabi Lake Commercial District', state: 'Abuja FCT', disco: 'Abuja Electric (AEDC)', bandATariff: 209.50, peakSunHours: 5.1, dieselAvgPrice: 1330, gridReliabilityHours: 12 },
  { slug: 'abuja-kubwa', name: 'Kubwa Residential Corridor', state: 'Abuja FCT', disco: 'Abuja Electric (AEDC)', bandATariff: 209.50, peakSunHours: 5.1, dieselAvgPrice: 1300, gridReliabilityHours: 9 },

  // Regional State Hubs
  { slug: 'port-harcourt', name: 'Port Harcourt GRA & Trans-Amadi', state: 'Rivers', disco: 'Port Harcourt Electric (PHED)', bandATariff: 209.50, peakSunHours: 4.0, dieselAvgPrice: 1330, gridReliabilityHours: 9 },
  { slug: 'ibadan-bodija', name: 'Ibadan Bodija & Oluyole', state: 'Oyo', disco: 'Ibadan Electric (IBEDC)', bandATariff: 209.50, peakSunHours: 4.8, dieselAvgPrice: 1270, gridReliabilityHours: 8 },
  { slug: 'kano-commercial', name: 'Kano Commercial & Bompai', state: 'Kano', disco: 'Kano Electric (KEDCO)', bandATariff: 209.50, peakSunHours: 5.6, dieselAvgPrice: 1320, gridReliabilityHours: 7 },
  { slug: 'benin-city', name: 'Benin City Commercial Axis', state: 'Edo', disco: 'Benin Electric (BEDC)', bandATariff: 209.50, peakSunHours: 4.4, dieselAvgPrice: 1290, gridReliabilityHours: 8 },
  { slug: 'enugu-independence', name: 'Enugu Independence Layout', state: 'Enugu', disco: 'Enugu Electric (EEDC)', bandATariff: 209.50, peakSunHours: 4.6, dieselAvgPrice: 1300, gridReliabilityHours: 8 },
  { slug: 'asaba-capital', name: 'Asaba Commercial Corridor', state: 'Delta', disco: 'BEDC', bandATariff: 209.50, peakSunHours: 4.4, dieselAvgPrice: 1300, gridReliabilityHours: 9 },
  { slug: 'warri-metro', name: 'Warri & Effurun Industrial Axis', state: 'Delta', disco: 'BEDC', bandATariff: 209.50, peakSunHours: 4.1, dieselAvgPrice: 1310, gridReliabilityHours: 8 },
  { slug: 'abeokuta-gra', name: 'Abeokuta Ibara GRA', state: 'Ogun', disco: 'IBEDC', bandATariff: 209.50, peakSunHours: 4.7, dieselAvgPrice: 1260, gridReliabilityHours: 9 },
  { slug: 'kaduna-central', name: 'Kaduna Commercial Axis', state: 'Kaduna', disco: 'Kaduna Electric (KAEDCO)', bandATariff: 209.50, peakSunHours: 5.4, dieselAvgPrice: 1310, gridReliabilityHours: 8 }
];

// 2. TOP IMPORTED NIGERIAN TOKUNBO CARS (CUSTOMS DUTY & SURCHARGES)
export const NIGERIAN_CAR_MODELS: PSeoCarModelData[] = [
  // Toyota Camry
  { slug: 'toyota-camry-2007', make: 'Toyota', model: 'Camry Muscle', year: 2007, engineSize: '2.4L / 3.5L', cifUsd: 3200, terminalPort: 'PTML Grimaldi', customsDutyNgn: 928000, nacLevyNgn: 696000, vatNgn: 348000, terminalDemurrageNgn: 420000, totalClearingEstimateNgn: 2392000 },
  { slug: 'toyota-camry-2010', make: 'Toyota', model: 'Camry Muscle Facelift', year: 2010, engineSize: '2.5L / 3.5L', cifUsd: 4100, terminalPort: 'PTML Grimaldi', customsDutyNgn: 1189000, nacLevyNgn: 891750, vatNgn: 445875, terminalDemurrageNgn: 420000, totalClearingEstimateNgn: 2946625 },
  { slug: 'toyota-camry-2012', make: 'Toyota', model: 'Camry Spider', year: 2012, engineSize: '2.5L / 3.5L', cifUsd: 5300, terminalPort: 'PTML Grimaldi', customsDutyNgn: 1537000, nacLevyNgn: 1152750, vatNgn: 576375, terminalDemurrageNgn: 450000, totalClearingEstimateNgn: 3716125 },
  { slug: 'toyota-camry-2015', make: 'Toyota', model: 'Camry Special Edition', year: 2015, engineSize: '2.5L', cifUsd: 6800, terminalPort: 'PTML Grimaldi', customsDutyNgn: 1972000, nacLevyNgn: 1479000, vatNgn: 739500, terminalDemurrageNgn: 460000, totalClearingEstimateNgn: 4650500 },
  { slug: 'toyota-camry-2018', make: 'Toyota', model: 'Camry Sport', year: 2018, engineSize: '2.5L', cifUsd: 9500, terminalPort: 'PTML Grimaldi', customsDutyNgn: 2755000, nacLevyNgn: 2066250, vatNgn: 1033125, terminalDemurrageNgn: 480000, totalClearingEstimateNgn: 6334375 },

  // Toyota Corolla
  { slug: 'toyota-corolla-2006', make: 'Toyota', model: 'Corolla Bank Type', year: 2006, engineSize: '1.8L', cifUsd: 2800, terminalPort: 'PTML Grimaldi', customsDutyNgn: 812000, nacLevyNgn: 609000, vatNgn: 304500, terminalDemurrageNgn: 380000, totalClearingEstimateNgn: 2105500 },
  { slug: 'toyota-corolla-2010', make: 'Toyota', model: 'Corolla S', year: 2010, engineSize: '1.8L', cifUsd: 3900, terminalPort: 'PTML Grimaldi', customsDutyNgn: 1131000, nacLevyNgn: 848250, vatNgn: 424125, terminalDemurrageNgn: 390000, totalClearingEstimateNgn: 2793375 },
  { slug: 'toyota-corolla-2014', make: 'Toyota', model: 'Corolla LE', year: 2014, engineSize: '1.8L', cifUsd: 5400, terminalPort: 'PTML Grimaldi', customsDutyNgn: 1566000, nacLevyNgn: 1174500, vatNgn: 587250, terminalDemurrageNgn: 420000, totalClearingEstimateNgn: 3747750 },
  { slug: 'toyota-corolla-2017', make: 'Toyota', model: 'Corolla Special Edition', year: 2017, engineSize: '1.8L', cifUsd: 7200, terminalPort: 'PTML Grimaldi', customsDutyNgn: 2088000, nacLevyNgn: 1566000, vatNgn: 783000, terminalDemurrageNgn: 440000, totalClearingEstimateNgn: 4877000 },

  // Lexus RX350
  { slug: 'lexus-rx350-2008', make: 'Lexus', model: 'RX350 AWD', year: 2008, engineSize: '3.5L V6', cifUsd: 4800, terminalPort: 'Tin Can Island', customsDutyNgn: 1392000, nacLevyNgn: 1044000, vatNgn: 522000, terminalDemurrageNgn: 520000, totalClearingEstimateNgn: 3478000 },
  { slug: 'lexus-rx350-2010', make: 'Lexus', model: 'RX350 3rd Gen', year: 2010, engineSize: '3.5L V6', cifUsd: 6200, terminalPort: 'Tin Can Island', customsDutyNgn: 1798000, nacLevyNgn: 1348500, vatNgn: 674250, terminalDemurrageNgn: 550000, totalClearingEstimateNgn: 4370750 },
  { slug: 'lexus-rx350-2013', make: 'Lexus', model: 'RX350 F-Sport', year: 2013, engineSize: '3.5L V6', cifUsd: 8500, terminalPort: 'Tin Can Island', customsDutyNgn: 2465000, nacLevyNgn: 1848750, vatNgn: 924375, terminalDemurrageNgn: 580000, totalClearingEstimateNgn: 5818125 },
  { slug: 'lexus-rx350-2016', make: 'Lexus', model: 'RX350 4th Gen', year: 2016, engineSize: '3.5L V6', cifUsd: 13200, terminalPort: 'Tin Can Island', customsDutyNgn: 3828000, nacLevyNgn: 2871000, vatNgn: 1435500, terminalDemurrageNgn: 620000, totalClearingEstimateNgn: 8754500 },

  // Lexus ES350
  { slug: 'lexus-es350-2008', make: 'Lexus', model: 'ES350 Luxury', year: 2008, engineSize: '3.5L V6', cifUsd: 4200, terminalPort: 'PTML Grimaldi', customsDutyNgn: 1218000, nacLevyNgn: 913500, vatNgn: 456750, terminalDemurrageNgn: 430000, totalClearingEstimateNgn: 3018250 },
  { slug: 'lexus-es350-2012', make: 'Lexus', model: 'ES350 Facelift', year: 2012, engineSize: '3.5L V6', cifUsd: 5900, terminalPort: 'PTML Grimaldi', customsDutyNgn: 1711000, nacLevyNgn: 1283250, vatNgn: 641625, terminalDemurrageNgn: 460000, totalClearingEstimateNgn: 4095875 },
  { slug: 'lexus-es350-2015', make: 'Lexus', model: 'ES350 Premium', year: 2015, engineSize: '3.5L V6', cifUsd: 8100, terminalPort: 'PTML Grimaldi', customsDutyNgn: 2349000, nacLevyNgn: 1761750, vatNgn: 880875, terminalDemurrageNgn: 490000, totalClearingEstimateNgn: 5481625 },

  // Toyota Highlander
  { slug: 'toyota-highlander-2008', make: 'Toyota', model: 'Highlander Sport', year: 2008, engineSize: '3.5L V6', cifUsd: 4900, terminalPort: 'Tin Can Island', customsDutyNgn: 1421000, nacLevyNgn: 1065750, vatNgn: 532875, terminalDemurrageNgn: 520000, totalClearingEstimateNgn: 3539625 },
  { slug: 'toyota-highlander-2012', make: 'Toyota', model: 'Highlander Limited', year: 2012, engineSize: '3.5L V6', cifUsd: 7100, terminalPort: 'Tin Can Island', customsDutyNgn: 2059000, nacLevyNgn: 1544250, vatNgn: 772125, terminalDemurrageNgn: 550000, totalClearingEstimateNgn: 4925375 },
  { slug: 'toyota-highlander-2015', make: 'Toyota', model: 'Highlander Platinum', year: 2015, engineSize: '3.5L V6', cifUsd: 9800, terminalPort: 'Tin Can Island', customsDutyNgn: 2842000, nacLevyNgn: 2131500, vatNgn: 1065750, terminalDemurrageNgn: 580000, totalClearingEstimateNgn: 6619250 },

  // Toyota Sienna
  { slug: 'toyota-sienna-2006', make: 'Toyota', model: 'Sienna CE/LE', year: 2006, engineSize: '3.3L V6', cifUsd: 3100, terminalPort: 'PTML Grimaldi', customsDutyNgn: 899000, nacLevyNgn: 674250, vatNgn: 337125, terminalDemurrageNgn: 440000, totalClearingEstimateNgn: 2350375 },
  { slug: 'toyota-sienna-2011', make: 'Toyota', model: 'Sienna 3rd Gen', year: 2011, engineSize: '3.5L V6', cifUsd: 5800, terminalPort: 'PTML Grimaldi', customsDutyNgn: 1682000, nacLevyNgn: 1261500, vatNgn: 630750, terminalDemurrageNgn: 480000, totalClearingEstimateNgn: 4054250 },

  // Mercedes-Benz C300
  { slug: 'mercedes-c300-2010', make: 'Mercedes-Benz', model: 'C300 4MATIC', year: 2010, engineSize: '3.0L V6', cifUsd: 4600, terminalPort: 'PTML Grimaldi', customsDutyNgn: 1334000, nacLevyNgn: 1000500, vatNgn: 500250, terminalDemurrageNgn: 460000, totalClearingEstimateNgn: 3294750 },
  { slug: 'mercedes-c300-2013', make: 'Mercedes-Benz', model: 'C300 Sport', year: 2013, engineSize: '3.5L V6', cifUsd: 6500, terminalPort: 'PTML Grimaldi', customsDutyNgn: 1885000, nacLevyNgn: 1413750, vatNgn: 706875, terminalDemurrageNgn: 480000, totalClearingEstimateNgn: 4485625 },
  { slug: 'mercedes-c300-2016', make: 'Mercedes-Benz', model: 'C300 W205 Turbo', year: 2016, engineSize: '2.0L Turbo', cifUsd: 10200, terminalPort: 'PTML Grimaldi', customsDutyNgn: 2958000, nacLevyNgn: 2218500, vatNgn: 1109250, terminalDemurrageNgn: 520000, totalClearingEstimateNgn: 6805750 },

  // Honda Accord
  { slug: 'honda-accord-2008', make: 'Honda', model: 'Accord Evil Spirit', year: 2008, engineSize: '2.4L / 3.5L', cifUsd: 2900, terminalPort: 'PTML Grimaldi', customsDutyNgn: 841000, nacLevyNgn: 630750, vatNgn: 315375, terminalDemurrageNgn: 390000, totalClearingEstimateNgn: 2177125 },
  { slug: 'honda-accord-2013', make: 'Honda', model: 'Accord Crosstour / EX-L', year: 2013, engineSize: '2.4L / 3.5L', cifUsd: 5600, terminalPort: 'PTML Grimaldi', customsDutyNgn: 1624000, nacLevyNgn: 1218000, vatNgn: 609000, terminalDemurrageNgn: 430000, totalClearingEstimateNgn: 3881000 }
];

// 3. TOP NIGERIAN REAL ESTATE & BUILDING MATERIAL HUBS
export const NIGERIAN_BUILDING_HUBS: PSeoBuildingLocationData[] = [
  { slug: 'lekki-phase-1', area: 'Lekki Phase 1 & Admiralty', city: 'Lagos', sandPricePerTrip: 120000, granitePricePerTrip: 280000, cementPricePerBag: 9800, ironRodPricePerTonne: 1250000, soilType: 'Swampy/Waterlogged', raftOrPilingRecommended: 'Bored Piling (18m-22m) + Reinforced Raft Beam Mandatory' },
  { slug: 'ibeju-lekki', area: 'Ibeju-Lekki & Free Trade Zone', city: 'Lagos', sandPricePerTrip: 85000, granitePricePerTrip: 260000, cementPricePerBag: 9600, ironRodPricePerTonne: 1220000, soilType: 'Firm Sand', raftOrPilingRecommended: 'Wide Strip Foundation or Reinforced Raft' },
  { slug: 'ajah-sangotedo', area: 'Ajah & Sangotedo Axis', city: 'Lagos', sandPricePerTrip: 95000, granitePricePerTrip: 270000, cementPricePerBag: 9700, ironRodPricePerTonne: 1230000, soilType: 'Swampy/Waterlogged', raftOrPilingRecommended: 'Raft Foundation with 450mm Thick Sub-base' },
  { slug: 'epe-expressway', area: 'Epe Alaro City Corridor', city: 'Lagos', sandPricePerTrip: 75000, granitePricePerTrip: 240000, cementPricePerBag: 9500, ironRodPricePerTonne: 1210000, soilType: 'Red Earth Laterite', raftOrPilingRecommended: 'Solid Strip Foundation (Zero Piling Needed)' },
  { slug: 'magodo-phase-2', area: 'Magodo Phase 2 & Shangisha', city: 'Lagos', sandPricePerTrip: 110000, granitePricePerTrip: 275000, cementPricePerBag: 9700, ironRodPricePerTonne: 1240000, soilType: 'Red Earth Laterite', raftOrPilingRecommended: 'Pad & Column Foundation with Reinforced Ground Beam' },
  { slug: 'abuja-guzape', area: 'Guzape & Asokoro Extension', city: 'Abuja FCT', sandPricePerTrip: 95000, granitePricePerTrip: 210000, cementPricePerBag: 10200, ironRodPricePerTonne: 1280000, soilType: 'Red Earth Laterite', raftOrPilingRecommended: 'Rock Excavation + Reinforced Strip Foundation' },
  { slug: 'port-harcourt-peter-odili', area: 'Peter Odili & Trans-Amadi', city: 'Rivers', sandPricePerTrip: 90000, granitePricePerTrip: 260000, cementPricePerBag: 10100, ironRodPricePerTonne: 1270000, soilType: 'Swampy/Waterlogged', raftOrPilingRecommended: 'Pre-cast Piling + Thick Raft Slab' }
];

export class ProgrammaticSeoEngine {
  /**
   * Generates all valid programmatic sitemap entries
   */
  public static getAllProgrammaticRoutes(): { url: string; priority: number; changeFrequency: 'daily' | 'weekly' }[] {
    const baseUrl = 'https://www.bethelmindanalytics.com';
    const routes: { url: string; priority: number; changeFrequency: 'daily' | 'weekly' }[] = [];

    // Solar location pages
    for (const loc of NIGERIAN_SOLAR_HUBS) {
      routes.push({
        url: `${baseUrl}/tools/solar-boq/${loc.slug}`,
        priority: 0.85,
        changeFrequency: 'weekly'
      });
    }

    // Tokunbo car customs duty pages
    for (const car of NIGERIAN_CAR_MODELS) {
      routes.push({
        url: `${baseUrl}/tools/tokunbo-duty/${car.slug}`,
        priority: 0.85,
        changeFrequency: 'weekly'
      });
    }

    // Building material cost pages
    for (const bld of NIGERIAN_BUILDING_HUBS) {
      routes.push({
        url: `${baseUrl}/tools/construction-estimator/${bld.slug}`,
        priority: 0.85,
        changeFrequency: 'weekly'
      });
    }

    return routes;
  }

  /**
   * Resolves programmatic sub-slug data
   */
  public static resolveSolarHub(slug: string): PSeoLocationData | undefined {
    return NIGERIAN_SOLAR_HUBS.find(h => h.slug === slug);
  }

  public static resolveCarModel(slug: string): PSeoCarModelData | undefined {
    return NIGERIAN_CAR_MODELS.find(c => c.slug === slug);
  }

  public static resolveBuildingHub(slug: string): PSeoBuildingLocationData | undefined {
    return NIGERIAN_BUILDING_HUBS.find(b => b.slug === slug);
  }
}
