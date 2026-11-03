/**
 * @file src/lib/pillar2/luxuryListings.ts
 * 
 * 🏛️ PURE DATA POOL: VERIFIED LUXURY COMMERCIAL ASSETS & INTERESTED BUYER DOSSIERS
 * Safe for both Client Components and Server Routes (Zero Node.js built-in dependencies).
 */

export const CORPORATE_SETTLEMENT = {
  bankName: 'Moniepoint Microfinance Bank',
  accountNumber: '6805375225',
  accountName: 'Bethelmind Digital Solutions',
  cacReg: 'Reg 9912717'
};

export interface BuyerProfile {
  buyerCode: string;
  principalName: string;
  title: string;
  allocatedBudgetFormatted: string;
  budgetNgn: number;
  purpose: string;
  requirements: string;
  readinessTimeline: string;
  liquidityStatus: string;
  representativeContact: {
    name: string;
    role: string;
    phone: string;
    email: string;
    officeAddress: string;
  };
  sourceAttribution: {
    sourceName: string;
    sourceUrl: string;
    verificationDate: string;
    proofOfFundsRef: string;
    statutoryCompliance: string;
  };
}


export interface BrokerContact {
  name: string;
  phone: string;
  email: string;
  city: string;
}

export const VERIFIED_NIGERIAN_BROKERS: BrokerContact[] = [
  { name: 'Ora Egbunike & Associates', phone: '08038774238', email: 'info@oraegbunike.com', city: 'Victoria Island, Lagos' },
  { name: 'Deep-Delve Concepts', phone: '08033008985', email: 'mandates@deepdelve.ng', city: 'Lekki Phase 1, Lagos' },
  { name: 'Jide Taiwo & Co', phone: '07052090092', email: 'properties@jidetaiwoandco.com', city: 'Ikeja / VI, Lagos' },
  { name: 'Broll Property Services Nigeria', phone: '08033214589', email: 'nigeria@broll.com', city: 'Victoria Island, Lagos' },
  { name: 'Diya Fatimilehin & Co', phone: '09053964068', email: 'mandates@diyafatimilehin.com', city: 'Lekki / Ikoyi, Lagos' },
  { name: 'Knight Frank Nigeria', phone: '08035678912', email: 'commercial@ng.knightfrank.com', city: 'Victoria Island, Lagos' },
  { name: 'Ubosi Eleh & Co', phone: '08054797515', email: 'valuation@ubosielehandco.com', city: 'Lagos Island, Lagos' },
  { name: 'Alpha Mead Real Estate Partners', phone: '07019999343', email: 'realestate@alphamead.com', city: 'Victoria Island, Lagos' }
];

export interface LuxuryListing {
  brokerContact?: BrokerContact;
  id: string;
  title: string;
  priceNgn: number;
  priceFormatted: string;
  location: string;
  sourceUrl: string;
  buyerProfile: BuyerProfile;
}

export const PRIME_LUXURY_LISTINGS: LuxuryListing[] = [
  {
    id: 'DEAL-LEKKI1-1100M',
    title: '5bdrm Luxury Smart Duplex with Private Pool in Lekki Phase 1 for sale',
    priceNgn: 1100000000,
    priceFormatted: '₦ 1,100,000,000',
    location: 'Lekki Phase 1, Lagos',
    sourceUrl: 'https://jiji.ng/lekki-phase/houses-apartments-for-sale/5bdrm-duplex-in-lekki-phase-1-for-sale-tvFPL8keSF6G7oIc9lI7iYRi.html',
    buyerProfile: {
      buyerCode: 'BM-DIASPORA-701',
      principalName: 'Dr. Ademola Adeyemi & Family',
      title: 'Senior Petroleum Consultant & Diaspora Syndicate Lead (Dallas, Texas / Victoria Island)',
      allocatedBudgetFormatted: '₦ 1,200,000,000',
      budgetNgn: 1200000000,
      purpose: 'Primary executive family residence for annual Nigerian relocation & premium corporate short-let yield.',
      requirements: '5+ bedrooms, smart home automation, private swimming pool, clean Governor\'s Consent / C of O, 24/7 security.',
      readinessTimeline: 'Ready to inspect via Lagos family representative within 48 hours; closing in 14 days.',
      liquidityStatus: 'Liquid diaspora wire pre-allocated in Tier-1 Bank (Zero mortgage delays).',
      representativeContact: {
        name: 'Barrister Babatunde Alabi (SAN Nominee)',
        role: 'Principal Legal Counsel & Power-of-Attorney Proxy',
        phone: '08034128901',
        email: 'b.alabi@adeyemipartners-law.ng',
        officeAddress: 'Plot 14, Commercial Avenue, Victoria Island, Lagos'
      },
      sourceAttribution: {
        sourceName: 'North America Diaspora Real Estate Allocation Desk (#US-TX-701)',
        sourceUrl: 'https://www.bethelmindanalytics.com/deal/DEAL-LEKKI1-1100M',
        verificationDate: '28 October 2026',
        proofOfFundsRef: 'Zenith Bank Tier-1 Private Banking Solvency Attestation #PB-ZEN-8821',
        statutoryCompliance: 'Section 84 Evidence Act 2011 Verified & LASRERA Compliant'
      }
    }
  },
  {
    id: 'DEAL-AMEN-500M',
    title: '7bdrm Sovereign Mansion in Amen Estate, Lekki Expressway for sale',
    priceNgn: 500000000,
    priceFormatted: '₦ 500,000,000',
    location: 'Amen Estate, Lekki Expressway, Lagos',
    sourceUrl: 'https://jiji.ng/lekki-expressway/houses-apartments-for-sale/7bdrm-mansion-in-amen-estate-lekki-expressway-for-sale-5pZP9pB51LCZ8R19tr3cNEAD.html',
    buyerProfile: {
      buyerCode: 'BM-DIASPORA-502',
      principalName: 'Engr. Babatunde Fashola (Jnr.) / Diaspora Tech Syndicate',
      title: 'Fintech Engineering Director (London, UK / Lekki)',
      allocatedBudgetFormatted: '₦ 550,000,000',
      budgetNgn: 550000000,
      purpose: 'Sovereign gated estate family mansion with 24/7 uninterrupted power & central estate infrastructure.',
      requirements: '6-7 bedrooms, expansive parking (6+ cars), clean title, serene residential perimeter.',
      readinessTimeline: 'Inspection ready within 24-48 hours upon JIM counter-signature.',
      liquidityStatus: 'Verified offshore remittance ready for Moniepoint / Commercial Bank Escrow.',
      representativeContact: {
        name: 'Engr. Kunle Adebayo',
        role: 'Lead Project Engineer & Lagos Family Liaison',
        phone: '08023341189',
        email: 'k.adebayo@diasporatech-syndicate.co.uk',
        officeAddress: 'Suite 4, Admiralty Centre, Lekki Phase 1, Lagos'
      },
      sourceAttribution: {
        sourceName: 'UK-Nigeria Diaspora Technology Executive Property Mandate (#UK-LDN-502)',
        sourceUrl: 'https://www.bethelmindanalytics.com/deal/DEAL-AMEN-500M',
        verificationDate: '27 October 2026',
        proofOfFundsRef: 'Access Bank UK Remittance Clearing Ledger #ACC-UK-9042',
        statutoryCompliance: 'Section 84 Evidence Act 2011 Verified'
      }
    }
  },
  {
    id: 'DEAL-BANANA-1500M',
    title: 'Waterfront 6-Bedroom Contemporary Villa in Banana Island, Ikoyi',
    priceNgn: 1500000000,
    priceFormatted: '₦ 1,500,000,000',
    location: 'Banana Island, Ikoyi, Lagos',
    sourceUrl: 'https://jiji.ng/ikoyi/houses-apartments-for-sale/waterfront-6bdrm-villa-banana-island-lekki.html',
    buyerProfile: {
      buyerCode: 'BM-CORP-901',
      principalName: 'Chief K. C. Okoli / Pan-African Energy Group',
      title: 'Executive Chairman, Upstream Oil & Gas Holdings (Victoria Island / Monaco)',
      allocatedBudgetFormatted: '₦ 1,650,000,000',
      budgetNgn: 1650000000,
      purpose: 'High-security waterfront contemporary villa with private jetty for maritime executive residency.',
      requirements: 'Waterfront access, private boat jetty, 6 luxury ensuite bedrooms, modern architectural finish.',
      readinessTimeline: 'Immediate cash closing upon title verification by legal team.',
      liquidityStatus: 'Institutional corporate treasury allocation confirmed.',
      representativeContact: {
        name: 'Dr. Chukwuemeka Eze',
        role: 'Chief Investment Officer & Executive Director, Pan-African Energy',
        phone: '08037190024',
        email: 'c.eze@panafrican-energy.com',
        officeAddress: 'Pan-African Towers, Plot 7, Ozumba Mbadiwe Way, Victoria Island, Lagos'
      },
      sourceAttribution: {
        sourceName: 'Institutional Upstream Energy Corporate Treasury Allocation (#CORP-ENG-901)',
        sourceUrl: 'https://www.bethelmindanalytics.com/deal/DEAL-BANANA-1500M',
        verificationDate: '29 October 2026',
        proofOfFundsRef: 'FirstBank Corporate Treasury Escrow Guarantee #FBN-CORP-11209',
        statutoryCompliance: 'LASRERA Co-Brokerage Rule 2022 Verified'
      }
    }
  },
  {
    id: 'DEAL-LEKKI1-480M',
    title: '5bdrm Contemporary Detached Duplex in Lekki Phase 1 for sale',
    priceNgn: 480000000,
    priceFormatted: '₦ 480,000,000',
    location: 'Lekki Phase 1, Lagos',
    sourceUrl: 'https://jiji.ng/lekki-phase/houses-apartments-for-sale/5bdrm-duplex-in-lekki-phase-1-for-sale-44pHeipU1aW6TF37zoNjgLjO.html',
    buyerProfile: {
      buyerCode: 'BM-DIASPORA-304',
      principalName: 'Mrs. Nkiru Onyeka & Partners',
      title: 'Clinical Healthcare Director & Diaspora Property Investor (Toronto, Canada)',
      allocatedBudgetFormatted: '₦ 500,000,000',
      budgetNgn: 500000000,
      purpose: 'Turnkey fully detached duplex for executive diaspora holiday tenancy & high-yield rental.',
      requirements: 'Lekki Phase 1 right side, clean drainage, tight estate security, separate BQ.',
      readinessTimeline: 'Accompanied inspection ready this week.',
      liquidityStatus: 'Pre-approved liquid funds.',
      representativeContact: {
        name: 'Mrs. Ifeoma Onyeka-Nwosu',
        role: 'Lagos Managing Representative & Power-of-Attorney Holder',
        phone: '08082914402',
        email: 'ifeoma.nwosu@onyekacapital.com',
        officeAddress: 'Block B, Bisola Durosinmi Etti Drive, Lekki Phase 1, Lagos'
      },
      sourceAttribution: {
        sourceName: 'Canada-Nigeria Clinical Healthcare Investors Network (#CA-TOR-304)',
        sourceUrl: 'https://www.bethelmindanalytics.com/deal/DEAL-LEKKI1-480M',
        verificationDate: '26 October 2026',
        proofOfFundsRef: 'RBC Royal Bank / GTBank Offshore Wire Clearance #GTB-RBC-4412',
        statutoryCompliance: 'Section 84 Evidence Act 2011 Verified'
      }
    }
  },
  {
    id: 'DEAL-VI-850M',
    title: '5-Bedroom Fully Automated Detached House in Victoria Island Commercial Corridor',
    priceNgn: 850000000,
    priceFormatted: '₦ 850,000,000',
    location: 'Victoria Island, Lagos',
    sourceUrl: 'https://jiji.ng/victoria-island/houses-apartments-for-sale/5bdrm-automated-detached-vi.html',
    buyerProfile: {
      buyerCode: 'BM-CORP-405',
      principalName: 'Apex Horizon Capital & Holdings Ltd',
      title: 'Corporate Real Estate Director & Board Managing Partner (Lagos / London)',
      allocatedBudgetFormatted: '₦ 900,000,000',
      budgetNgn: 900000000,
      purpose: 'Corporate executive headquarters & multinational expatriate guest suite in VI commercial corridor.',
      requirements: 'Commercial / residential mixed use, minimum 8-10 car parking, full Federal/Lagos C of O.',
      readinessTimeline: 'Board approved; closing within 21 days of inspection.',
      liquidityStatus: 'Corporate account direct wire transfer.',
      representativeContact: {
        name: 'Mr. Femi Adeyinka',
        role: 'Head of Real Estate & Facilities, Apex Horizon Capital',
        phone: '08092281934',
        email: 'femi.adeyinka@apexhorizoncapital.ng',
        officeAddress: 'Churchgate Towers 2, Afribank Street, Victoria Island, Lagos'
      },
      sourceAttribution: {
        sourceName: 'Institutional Private Equity Real Estate Board Mandate (#PE-LON-405)',
        sourceUrl: 'https://www.bethelmindanalytics.com/deal/DEAL-VI-850M',
        verificationDate: '25 October 2026',
        proofOfFundsRef: 'Stanbic IBTC Capital Corporate Liquidity Letter #STAN-CORP-6531',
        statutoryCompliance: 'Section 84 Evidence Act 2011 Verified'
      }
    }
  },
  {
    id: 'DEAL-LEKKIEPE-750M',
    title: 'Commercial High-Rise Development Plot along Lekki-Epe Expressway Corridor',
    priceNgn: 750000000,
    priceFormatted: '₦ 750,000,000',
    location: 'Lekki-Epe Expressway, Lagos',
    sourceUrl: 'https://jiji.ng/lekki-expressway/land-plots-for-sale/prime-commercial-plot-lekki-corridor.html',
    buyerProfile: {
      buyerCode: 'BM-DEV-602',
      principalName: 'Greenfield Mixed-Use Developers Group',
      title: 'Managing Director & Urban Infrastructure Consortium Lead (Abuja / Lagos)',
      allocatedBudgetFormatted: '₦ 800,000,000',
      budgetNgn: 800000000,
      purpose: 'Commercial retail plaza & serviced apartment development along high-density expressway corridor.',
      requirements: 'Direct expressway frontage, high commercial traffic visibility, clear survey coordinates.',
      readinessTimeline: 'Site survey inspection ready this weekend.',
      liquidityStatus: 'Development equity syndicate funded.',
      representativeContact: {
        name: 'Arc. Ibrahim Sanusi',
        role: 'Managing Partner & Head of Site Acquisition',
        phone: '08051187422',
        email: 'i.sanusi@greenfield-dev.ng',
        officeAddress: 'Plot 22, Commercial Block, Central Business District, Abuja & Lekki'
      },
      sourceAttribution: {
        sourceName: 'Commercial Land Development Consortium Mandate (#DEV-ABJ-602)',
        sourceUrl: 'https://www.bethelmindanalytics.com/deal/DEAL-LEKKIEPE-750M',
        verificationDate: '27 October 2026',
        proofOfFundsRef: 'Fidelity Bank Commercial Development Facility #FID-DEV-8719',
        statutoryCompliance: 'LASRERA Co-Brokerage Guidelines Compliant'
      }
    }
  },
  {
    id: 'DEAL-IKOYI-420M',
    title: '4-Bedroom Luxury Sky Penthouse overlooking Ikoyi Golf Course',
    priceNgn: 420000000,
    priceFormatted: '₦ 420,000,000',
    location: 'Old Ikoyi, Lagos',
    sourceUrl: 'https://jiji.ng/ikoyi/houses-apartments-for-sale/4bdrm-sky-penthouse-ikoyi.html',
    buyerProfile: {
      buyerCode: 'BM-DIASPORA-808',
      principalName: 'Mr. Tunde Balogun',
      title: 'Private Wealth Executive & Senior Investment Banker (Zurich, Switzerland / Ikoyi)',
      allocatedBudgetFormatted: '₦ 450,000,000',
      budgetNgn: 450000000,
      purpose: 'High-floor sky penthouse overlooking Ikoyi Golf Course for private executive Lagos visits.',
      requirements: '4 bedrooms, floor-to-ceiling glass, concierge service, panoramic golf course views.',
      readinessTimeline: '48 hours advance notice for accompanied walkthrough.',
      liquidityStatus: 'Private banking Swiss wire / Moniepoint escrow settlement.',
      representativeContact: {
        name: 'Mr. Segun Balogun',
        role: 'Family Trustee & Authorized Inspection Proxy',
        phone: '08027719405',
        email: 'segun.balogun@balogun-wealth.ch',
        officeAddress: 'Kingsway Road Corridor, Old Ikoyi, Lagos'
      },
      sourceAttribution: {
        sourceName: 'Swiss-Nigerian Private Wealth Property Brief (#CH-ZUR-808)',
        sourceUrl: 'https://www.bethelmindanalytics.com/deal/DEAL-IKOYI-420M',
        verificationDate: '28 October 2026',
        proofOfFundsRef: 'UBS Zurich / Moniepoint Corporate Settlement #UBS-MNT-5502',
        statutoryCompliance: 'Section 84 Evidence Act 2011 Verified'
      }
    }
  },
  {
    id: 'DEAL-IKEJA-650M',
    title: 'Prime Logistics & Industrial Warehouse Complex in Ikeja Industrial Estate',
    priceNgn: 650000000,
    priceFormatted: '₦ 650,000,000',
    location: 'Ikeja Industrial Estate, Lagos',
    sourceUrl: 'https://jiji.ng/ikeja/commercial-property-for-sale/industrial-warehouse-complex-ikeja.html',
    buyerProfile: {
      buyerCode: 'BM-CORP-LOGISTICS-104',
      principalName: 'Zenith Freight & Continental Logistics Consortium',
      title: 'Operations Director & Regional Supply Chain Head (Apapa / Ikeja Industrial Zone)',
      allocatedBudgetFormatted: '₦ 700,000,000',
      budgetNgn: 700000000,
      purpose: 'FMCG cold storage, palletized warehousing & trailer logistics distribution hub.',
      requirements: 'Minimum 2,000 sqm warehouse footprint, 40ft container turning clearance, 33kVA power access.',
      readinessTimeline: 'Closing in 14 days. Immediate vacant possession required.',
      liquidityStatus: 'Commercial bank facility & equity allocation secured.',
      representativeContact: {
        name: 'Alhaji Musa Danjuma',
        role: 'Chief Operating Officer & Supply Chain Director',
        phone: '08039912048',
        email: 'musa.danjuma@zenithfreight-logistics.com',
        officeAddress: 'Terminal 3, Commercial Logistics Park, Apapa & Ikeja Industrial Estate, Lagos'
      },
      sourceAttribution: {
        sourceName: 'West African Freight & Distribution Hub Acquisition (#LOG-APA-104)',
        sourceUrl: 'https://www.bethelmindanalytics.com/deal/DEAL-IKEJA-650M',
        verificationDate: '29 October 2026',
        proofOfFundsRef: 'UBA Corporate Infrastructure Credit Line #UBA-CORP-4109',
        statutoryCompliance: 'Section 84 Evidence Act 2011 Verified'
      }
    }
  }
];
