'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sun, Shield, ShieldCheck, FileText, MessageSquare, HeartPulse,
  Sparkles, CheckCircle2, ArrowRight, Download, ExternalLink,
  Globe, DollarSign, Zap, Lock, Star, ChevronRight, Check,
  Share2, Copy, HelpCircle, PhoneCall, AlertTriangle, Truck,
  Plane, ShoppingCart, Building, CreditCard, Ship, TrendingUp
} from 'lucide-react';

export interface ProductItem {
  id: string;
  category: 'solar' | 'land' | 'diaspora' | 'ai' | 'legal' | 'health' | 'trade' | 'fintech';
  title: string;
  badge: string;
  badgeColor: string;
  icon: any;
  shortDesc: string;
  longDesc: string;
  prices: { NGN: number; USD: number; GBP: number };
  originalPrices: { NGN: number; USD: number; GBP: number };
  highlights: string[];
  deliverablesList: string[];
  deliverableType: string;
  whoIsThisFor: string;
  roiHook: string;
  previewSnippet: string;
}

export const ALL_PRODUCTS: ProductItem[] = [
  {
    id: 'solar-buster',
    category: 'solar',
    title: 'The 2026 Nigerian Solar Sizer & Anti-Fake Buying Kit',
    badge: '🔥 #1 Most Trending',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: Sun,
    shortDesc: 'Stop wasting ₦400k/mo on fuel. Load sizing matrix, Diesel ROI model & 10-Point Fake Lithium detector.',
    longDesc: 'With Band A tariffs at ₦209/kWh and petrol above ₦1,000/litre, 70% of solar buyers in Nigeria get scammed with refurbished fake lithium cells or undersized inverters. This kit gives you institutional sizing math and legal warranty contracts so you never get cheated.',
    prices: { NGN: 10000, USD: 12, GBP: 10 },
    originalPrices: { NGN: 25000, USD: 30, GBP: 25 },
    highlights: [
      'Interactive 30-Appliance Load Sizing Matrix (kVA & Battery Ah)',
      'Diesel Generator vs. Solar 12-Month Cash-Savings Model',
      '10-Point "Spot Fake Lithium Batteries" Visual Guide',
      'Vetted Alaba & Trade Fair Direct Importers Blackbook'
    ],
    deliverablesList: [
      'Appliance Surge & Continuous Wattage Formula Spreadsheet',
      'Bluetooth Smart BMS Cell Balance Inspection Protocol',
      'Inverter Error Code Diagnostic Cheat Sheet (Growatt/Deye/Felicity)',
      'Solar Supply Contract with 10% Retention Clause'
    ],
    deliverableType: 'Instant PDF + Spreadsheet Toolkit',
    whoIsThisFor: 'Homeowners, Landlords, Business Managers & Diaspora Building Family Homes.',
    roiHook: 'Saves ₦3,500,000+ in generator fuel and prevents buying ₦1.8M counterfeit batteries.',
    previewSnippet: 'Includes formulas for 1.5HP Inverter ACs, LiFePO4 Depth-of-Discharge, and smart BMS Bluetooth cell balance verification.'
  },
  {
    id: 'land-dossier',
    category: 'land',
    title: 'Lekki-Epe Land Risk, Demolition Buffer & Title Dossier',
    badge: '⚡ High Urgency (Demolitions)',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: Shield,
    shortDesc: 'Coastal Highway demolition corridors, Title hierarchy (C of O vs Gazette) & Google Earth coordinate guide.',
    longDesc: 'Demolitions along the Lagos-Calabar Coastal Highway and excision cancellations have put billions at risk. This cadastral dossier reveals exact statutory buffer zones and teaches you to plot survey beacon coordinates directly on satellite maps before paying a kobo.',
    prices: { NGN: 25000, USD: 29, GBP: 22 },
    originalPrices: { NGN: 60000, USD: 70, GBP: 55 },
    highlights: [
      '2026 Coastal Highway & 4th Mainland Bridge Demolition Buffer Zones',
      'Land Title Security Matrix (C of O vs. Gazette vs. Excision)',
      'Step-by-Step GPS Beacon Coordinate Plotting on Google Earth',
      'Standard Land Purchase Deed Indemnity Clause Template'
    ],
    deliverablesList: [
      '100m–250m Right-of-Way Buffer Map Breakdown',
      'Alausa Land Registry Form 1C Legal Search Blueprint',
      'Omo-Onile Community Double-Selling Scam Defense Checklist',
      'Unconditional Vendor Title Warranty & Refund Clause'
    ],
    deliverableType: 'Cadastral PDF Dossier + Satellite Guides',
    whoIsThisFor: 'Diaspora Property Buyers, Real Estate Investors, Land Syndicate Groups.',
    roiHook: 'Protects ₦15M–₦80M land investments from government demolition or family fraud.',
    previewSnippet: 'Analyzes statutory 100m–250m Right-of-Way buffer zones along Okun Ajah, Lafiaji, and Eleko T-Junction corridors.'
  },
  {
    id: 'diaspora-audit',
    category: 'diaspora',
    title: 'Diaspora Lagos Site Inspection & 4K Video Audit Pass',
    badge: '🌍 VIP High-Ticket Service',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: Globe,
    shortDesc: 'For UK/US/CA Nigerians building or buying in Lagos. Independent 4K video walkthrough, beacon check & engineer audit.',
    longDesc: 'Tired of sending building money to relatives who divert funds or unverified contractors who cut corners? Our certified Lagos field engineers physically inspect your site within 48 hours, record 4K timestamped video, verify corner beacons, and deliver a formal due-diligence report.',
    prices: { NGN: 220000, USD: 199, GBP: 155 },
    originalPrices: { NGN: 350000, USD: 300, GBP: 240 },
    highlights: [
      '4K Ultra-HD Timestamped & Geo-Tagged Video Walkthrough',
      'GPS Corner Beacon & Property Boundary Confirmation',
      'Physical Materials Inventory (Cement quality, Rod gauge)',
      'Signed Bethelmind Due-Diligence Certificate (PDF)'
    ],
    deliverablesList: [
      '20-Minute Continuous 4K Unedited Site Video Walkthrough',
      'Corner Beacon GPS Coordinates & Boundary Audit',
      'Site Engineer Recorded Audio/Video Progress Interrogation',
      '5%–7.5% Milestone Escrow Protection Recommendation'
    ],
    deliverableType: '48h Physical Field Service + Formal Dossier',
    whoIsThisFor: 'UK, US, Canada & European Diaspora Building or Buying in Nigeria.',
    roiHook: 'Prevents ₦10M–₦50M construction fraud, structural defects, and abandoned building projects.',
    previewSnippet: 'Dispatched by certified field engineers within 48 to 72 hours across Lekki, VI, Ikoyi, Ikeja, and Epe.'
  },
  {
    id: 'whatsapp-closer',
    category: 'ai',
    title: 'The 2026 WhatsApp Sales Closer & Auto-Responder Kit',
    badge: '🤖 Top B2B Seller',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: MessageSquare,
    shortDesc: 'Stop losing 60% of leads to slow DMs. 50+ closing scripts, objection handlers & audio voice notes.',
    longDesc: 'Nigerian customers buy from who replies first with confidence. This battle-tested swipe file gives you 50+ high-converting opening icebreakers, objection crushers for "e too cost", and 35-second voice note scripts that trigger instant bank transfers.',
    prices: { NGN: 15000, USD: 18, GBP: 14 },
    originalPrices: { NGN: 35000, USD: 40, GBP: 32 },
    highlights: [
      '50+ High-Conversion WhatsApp Sales Scripts by Sector',
      '15 Lethal Price Objection Handlers ("E Too Cost", "I Will Revert")',
      '35-Second Voice Note Audio Scripts that Trigger Transfers',
      'Visual Chatbot Auto-Responder Logic Flowcharts'
    ],
    deliverablesList: [
      'The 3-Second Nigerian Conversational Conversion Framework',
      'Sector-Specific Scripts (Real Estate, Solar, Clinics, Salons, Retail)',
      'Dead-Lead Revival 3-Touch Follow-Up Sequence',
      'Draw.io / Mermaid.js Auto-Responder Flow Diagrams'
    ],
    deliverableType: 'Digital Swipe File + Logic Diagrams',
    whoIsThisFor: 'Business Owners, Sales Teams, WhatsApp Vendors & Growth Agencies.',
    roiHook: 'Instantly increases WhatsApp DM inquiry-to-bank-transfer conversion rate by 2.5x.',
    previewSnippet: 'Includes the exact 3-second Nigerian closing framework and voice note templates tested across 500+ B2B leads.'
  },
  {
    id: 'sme-legal',
    category: 'legal',
    title: 'Nigerian SME Legal, SCUML Blueprint & Contract Vault',
    badge: '📜 Business Essential',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    icon: FileText,
    shortDesc: 'Save ₦80k in agent fees. Guaranteed SCUML self-application guide + 10 editable legal contract templates.',
    longDesc: 'Opening corporate bank accounts in Nigeria requires a SCUML Certificate from the EFCC. Avoid paying lawyers and agents ₦80,000+ with our step-by-step self-application blueprint, and protect your company with 10 ironclad Nigerian contract templates.',
    prices: { NGN: 12500, USD: 15, GBP: 12 },
    originalPrices: { NGN: 30000, USD: 35, GBP: 28 },
    highlights: [
      'Step-by-Step SCUML & Bank Compliance Self-Application Blueprint',
      '10 Ready-to-Use Contract Templates (NDA, SLA, Contractor, MoU)',
      'Intellectual Property Work-for-Hire Assignment Clauses',
      'Automated Professional B2B Invoice & Receipt Generator'
    ],
    deliverablesList: [
      'SCUML Portal Upload Guide & Document Rejection Defense',
      'Mutual Non-Disclosure Agreement (with ₦2.5M Liquidated Damages)',
      'Independent Contractor & Developer Services Agreement',
      'Partnership Profit-Sharing Memorandum of Understanding'
    ],
    deliverableType: 'Editable Word / Google Docs & PDFs',
    whoIsThisFor: 'Startup Founders, Small Business Owners, Freelancers & Consultants.',
    roiHook: 'Saves ₦150,000+ in legal drafting fees and guarantees zero-delay corporate bank onboarding.',
    previewSnippet: 'Avoid common EFCC/NFIU rejection pitfalls and protect your intellectual property with ironclad Nigerian contract terms.'
  },
  {
    id: 'luxury-health',
    category: 'health',
    title: 'Lagos Luxury Aesthetics & Dental Procedure Transparency Index',
    badge: '💎 70% Diaspora Savings',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    icon: HeartPulse,
    shortDesc: 'Compare verified costs for veneers, orthodontics, and skin treatments across Lekki & VI. Vetted doctor directory.',
    longDesc: 'Dental veneers and cosmetic medical procedures in Lagos are 70% cheaper than in London or Atlanta, but pricing is opaque and quality varies. This guide benchmarks realistic costs, provides MDCN safety checklists, and links to vetted doctors.',
    prices: { NGN: 8000, USD: 10, GBP: 8 },
    originalPrices: { NGN: 20000, USD: 25, GBP: 20 },
    highlights: [
      '2026 Realistic Cost Benchmark Index (Veneers, Aligners, Spas)',
      'MDCN Doctor Safety & License Verification Protocol',
      'Vetted Clinic Directory in Lekki Phase 1, VI, and Ikoyi',
      'WhatsApp VIP Fast-Track Booking Numbers'
    ],
    deliverablesList: [
      'Composite vs Porcelain E-Max Veneer Cost Comparison Matrix',
      'Class-B Autoclave & Sterilization Clinical Safety Audit Checklist',
      'Top 10 Vetted Clinics on Admiralty Way, VI & Ikoyi',
      'Direct WhatsApp Booking Fast-Track Contacts'
    ],
    deliverableType: 'Curated Guide + VIP Directory',
    whoIsThisFor: 'Holiday Visitors, Expats, Diaspora & Health-Conscious Individuals.',
    roiHook: 'Saves £2,000–£5,000 on dental cosmetics while ensuring 100% medical safety compliance.',
    previewSnippet: 'Save thousands of Pounds/Dollars on top-tier dental and aesthetic procedures with transparent local pricing benchmarks.'
  },
  {
    id: 'china-1688',
    category: 'trade',
    title: 'The 2026 China 1688 & Guangzhou Direct Sourcing Blueprint',
    badge: '🚢 High Margin Sourcing',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: Ship,
    shortDesc: 'Direct factory buying without middle agents. WeChat negotiation scripts in Chinese, RMB Alipay funding & forwarders.',
    longDesc: 'Stop paying 35% markups to middlemen. This blueprint teaches you to procure goods directly from Guangzhou & Yiwu factories on 1688.com, fund RMB Yuan securely in Nigeria, and ship via verified Lagos air and sea freight forwarders.',
    prices: { NGN: 15000, USD: 18, GBP: 14 },
    originalPrices: { NGN: 35000, USD: 40, GBP: 32 },
    highlights: [
      '1688 Account Setup & RMB Alipay Procurement Guide',
      'WeChat & Aliwangwang Copy-Paste Chinese Negotiation Scripts',
      'Vetted China-to-Nigeria Air & Sea Freight Forwarders Blackbook',
      'Master Supplier Quality & Defective Goods Refund Agreement'
    ],
    deliverablesList: [
      'Factory Price vs. Nigerian Retail Comparison Sheet',
      'Guangzhou Receiving Warehouse Packing Protocol',
      'Customs Clearance & Single Goods Declaration (SGD) Tracker',
      'Direct WhatsApp Contacts of Ikeja/Alaba Clearing Agents'
    ],
    deliverableType: 'Step-by-Step Guide + Freight Contacts',
    whoIsThisFor: 'E-Commerce Sellers, Mini-Importers, Physical Retailers & Wholesalers.',
    roiHook: 'Cuts procurement costs by 30%–45%, boosting net retail margins to over 200%.',
    previewSnippet: 'Includes copy-paste Chinese negotiation scripts for requesting sample batches and enforcing defect warranties.'
  },
  {
    id: 'shortlet-os',
    category: 'land',
    title: 'The Lekki & Ikeja Shortlet Operating OS & Agreement Vault',
    badge: '🏠 Cashflow Asset',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: Building,
    shortDesc: 'Landlord lease agreements, guest caution deposit contracts, automated check-in WhatsApp scripts & tariff control.',
    longDesc: 'Run a profitable Airbnb or Shortlet business without guest damage or astronomical electricity bills. Includes ironclad sublease contracts, damage penalty agreements, and automated WhatsApp guest check-in scripts.',
    prices: { NGN: 20000, USD: 25, GBP: 20 },
    originalPrices: { NGN: 45000, USD: 55, GBP: 45 },
    highlights: [
      '2026 Shortlet Yield Benchmark (Lekki Phase 1, VI, Ikeja GRA)',
      'Guest Caution Deposit & Damage Penalty Contract',
      'Automated 24/7 WhatsApp Check-In & House Rules Script',
      'Electricity & Generator Tariff Optimization Blueprint'
    ],
    deliverablesList: [
      'Shortlet Sublease Agreement Protecting Against Tenant Fraud',
      'Late Check-out & Indoor Smoking Penalty Clauses',
      'Lekki & Ikeja Vetted Cleaning & Laundry Blackbook',
      'Smart Door Lock & Inverter Remote Setup Protocol'
    ],
    deliverableType: 'Operating Templates + Bot Scripts',
    whoIsThisFor: 'Shortlet Landlords, Property Managers, Airbnb Hosts & Investors.',
    roiHook: 'Protects furniture and electronic assets while optimizing power costs to save ₦150k/mo.',
    previewSnippet: 'Includes the exact guest caution deposit forfeiture contract used across top luxury apartments in Lekki.'
  },
  {
    id: 'remote-usd',
    category: 'fintech',
    title: 'Remote Tech & Freelancer Multi-Currency Banking & Tax Vault',
    badge: '💳 FinTech & Taxes',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    icon: CreditCard,
    shortDesc: 'Wyoming US LLC setup for non-residents, Stripe/Mercury account approval blueprint & FIRS export tax rules.',
    longDesc: 'Eliminate account bans, high FX conversion spreads, and client payment restrictions. Form a 100% legal US LLC from Nigeria, open a real Mercury Bank US account, and integrate Stripe to collect global USD payments.',
    prices: { NGN: 12500, USD: 15, GBP: 12 },
    originalPrices: { NGN: 30000, USD: 35, GBP: 28 },
    highlights: [
      'Step-by-Step Wyoming LLC Formation Guide (Total Cost ~$150)',
      'IRS Form SS-4 EIN Application Blueprint for Non-Residents',
      'Mercury Bank & Stripe US Corporate Account Approval Checklist',
      'Master International Remote Contractor Services Agreement'
    ],
    deliverablesList: [
      'Wyoming Articles of Organization & Operating Agreement Template',
      'Zero US Corporate Income Tax Legal Structure Overview',
      'FIRS Personal Income Tax (PIT) & Forex Remittance Guidelines',
      'US Domestic Wire / ACH Invoicing Structure'
    ],
    deliverableType: 'Legal Blueprint + Contract Templates',
    whoIsThisFor: 'Remote Software Engineers, Digital Nomads, Agency Owners & Consultants.',
    roiHook: 'Unlocks direct USD client billing, saving thousands in conversion spreads and middleman fees.',
    previewSnippet: 'Step-by-step walkthrough of obtaining a US Employer Identification Number (EIN) without an SSN.'
  },
  {
    id: 'relocation-pof',
    category: 'fintech',
    title: 'UK, Canada & US Relocation & Proof of Funds (POF) Defense Vault',
    badge: '✈️ Visa Approval Shield',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: Plane,
    shortDesc: 'Lump-sum deposit explanation letters, Deed of Gift templates & 28-day/6-month bank statement audit blueprint.',
    longDesc: 'Unexplained lump-sum deposits are the #1 reason for Nigerian visa refusals by UKVI and IRCC. This vault provides legally notarized Deed of Gift templates, Source of Wealth letters, and bank statement audit protocols.',
    prices: { NGN: 25000, USD: 30, GBP: 24 },
    originalPrices: { NGN: 55000, USD: 65, GBP: 50 },
    highlights: [
      'The 28-Day (UKVI) & 6-Month (IRCC) Bank Statement Audit Rules',
      'Legally Binding Deed of Gift Template (Family Financial Sponsor)',
      'Source of Wealth & Lump-Sum Deposit Explanation Cover Letter',
      'Asset Liquidation Documentation Checklist (Property / Stocks)'
    ],
    deliverablesList: [
      'Notary Public Execution Protocol for Financial Sponsorship',
      'Tier-1 Commercial Bank QR Verification Requirements',
      'Third-Party Fund Transfer Risk Mitigation Checklist',
      'Pre-Submission Red-Flag Audit Checklist'
    ],
    deliverableType: 'Legal Letter Templates + Audit Guides',
    whoIsThisFor: 'Students, Professionals, Families & Japa Relocation Applicants.',
    roiHook: 'Eliminates sudden lump-sum visa refusals, protecting millions spent on visa fees and tuition deposits.',
    previewSnippet: 'Includes the exact Deed of Gift and Source of Funds explanation letter format accepted by UKVI and IRCC.'
  },
  {
    id: 'auto-customs',
    category: 'trade',
    title: 'Nigerian Auto Import & Customs Duty / VIN Verification Vault',
    badge: '🚗 Vehicle Protection',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    icon: ShieldCheck,
    shortDesc: 'Single Goods Declaration (SGD) verification on Customs Trade Hub, Carfax decoding & vehicle indemnity contract.',
    longDesc: 'Avoid buying cars with fraudulent customs papers or hidden salvage/flood damage that lead to Federal Customs impoundment. Verify genuine duty C-numbers and enforce seller refund agreements before paying.',
    prices: { NGN: 18000, USD: 22, GBP: 18 },
    originalPrices: { NGN: 40000, USD: 48, GBP: 38 },
    highlights: [
      'Single Goods Declaration (SGD) & C-Number Verification Blueprint',
      'Carfax & AutoCheck Damage History Decoding Guide',
      'On-Site Pre-Purchase Mechanical & Chassis Inspection Checklist',
      'Motor Vehicle Bill of Sale & Customs Indemnity Contract'
    ],
    deliverablesList: [
      'Nigeria Customs Service Trade Hub Query Protocol',
      'Bank PAAR Payment Receipt Validation Checklist',
      'Unconditional Dealer Duty Fraud Full Refund Clause',
      'Odometer Tampering & VIN Cloning Detection Guide'
    ],
    deliverableType: 'Verification Blueprint + Legal Contract',
    whoIsThisFor: 'Car Buyers, Auto Dealers, Fleet Operators & Logistics Companies.',
    roiHook: 'Prevents vehicle seizure by Customs and eliminates buying ₦10M+ flood-damaged cars.',
    previewSnippet: 'Step-by-step guide to querying C-Numbers and chassis records on the official Nigeria Customs Trade Hub.'
  },
  {
    id: 'agro-export',
    category: 'trade',
    title: 'Non-Oil Agro-Commodity Export Master Dossier (Cashew/Ginger)',
    badge: '🌾 FX Earning Asset',
    badgeColor: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
    icon: TrendingUp,
    shortDesc: 'Raw Cashew Nuts, Dried Split Ginger & Sesame export blueprint. NEPC registration, quality specs & LC contracts.',
    longDesc: 'Earn foreign exchange ($ USD) exporting Nigerian agricultural commodities to Europe, Asia, and the Middle East. Covers sourcing states, moisture content testing, NEPC export documentation, and Letter of Credit (LC) payment terms.',
    prices: { NGN: 30000, USD: 35, GBP: 28 },
    originalPrices: { NGN: 75000, USD: 90, GBP: 70 },
    highlights: [
      'Export Economics & Profit Margins across Cashew, Ginger & Sesame',
      'NEPC Registration, Form NXP & NESS Inspection Walkthrough',
      'Quality Benchmarks (Moisture Content & Foreign Matter Matrix)',
      'Master International Commodity Export Sales Contract (FOB/CIF)'
    ],
    deliverablesList: [
      '100% Irrevocable Confirmed Letter of Credit (LC) Terms Template',
      'Clean Bill of Lading & Phytosanitary Certificate Checklist',
      'Verified Sourcing Centers in Kaduna, Oyo, Kogi & Benue',
      'SGS Quality Inspection Pre-Shipment Audit Protocol'
    ],
    deliverableType: 'Institutional Export Dossier + Contracts',
    whoIsThisFor: 'Commodity Exporters, Agro-Investors, Forex Earners & Trading Firms.',
    roiHook: 'Generates 25%–45% gross profit margins in USD on agricultural commodity export shipments.',
    previewSnippet: 'Contains export quality benchmark tables and standard international FOB/CIF commodity contracts.'
  },
  {
    id: 'logistics-fleet',
    category: 'trade',
    title: 'Commercial Logistics & Dispatch Rider Fleet Operating OS',
    badge: '🛵 Fleet Management',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    icon: Truck,
    shortDesc: 'Rider 2-guarantor employment contracts, daily remittance spreadsheets, GPS tracking & Lagos permit vault.',
    longDesc: 'Run a profitable dispatch and haulage company without rider theft or bike abandonment. Includes ironclad 2-guarantor agreements, daily target remittance trackers, and Lagos State statutory compliance guides (MOT, VIS, LG).',
    prices: { NGN: 15000, USD: 18, GBP: 14 },
    originalPrices: { NGN: 35000, USD: 40, GBP: 32 },
    highlights: [
      'Ironclad Dispatch Rider Employment & 2-Guarantor Contract',
      'Daily Fuel, Mileage & Remittance Tracker (Google Sheets)',
      'Lagos State Statutory Compliance Guide (LASAA, MOT, VIS, Tickets)',
      'GPS Tracker Calibration & Fuel Theft Prevention Protocol'
    ],
    deliverablesList: [
      'Joint & Several Guarantor Liability Asset Recovery Terms',
      'Daily Gross Cash Remittance Reconciliation Spreadsheet',
      'Vetted Motorcycle Parts & Wholesale Fleet Maintenance Blackbook',
      'Rider Onboarding & Code of Conduct Agreement'
    ],
    deliverableType: 'Fleet Templates + Tracker Spreadsheets',
    whoIsThisFor: 'Logistics Owners, Dispatch Companies, Delivery Startups & Fleet Managers.',
    roiHook: 'Eliminates rider cash diversion and guarantees full asset recovery from vetted guarantors.',
    previewSnippet: 'Includes the exact 2-guarantor asset recovery contract used by leading logistics fleets in Lagos.'
  },
  {
    id: 'fmcg-placement',
    category: 'trade',
    title: 'Nigerian Supermarket & FMCG Retail Placement Blackbook',
    badge: '🛒 Retail Expansion',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    icon: ShoppingCart,
    shortDesc: 'NAFDAC listing guide, GS1 barcodes & pitch decks to get products into Spar, Shoprite, Hubmart & Ebeano.',
    longDesc: 'Get your food, beverage, or cosmetic products listed on shelves in Nigeria’s largest supermarket chains. Includes NAFDAC registration walkthroughs, GS1 barcode acquisition, and supermarket category manager pitch deck templates.',
    prices: { NGN: 15000, USD: 18, GBP: 14 },
    originalPrices: { NGN: 35000, USD: 40, GBP: 32 },
    highlights: [
      'Step-by-Step NAFDAC Product Registration & Food Safety Blueprint',
      'GS1 Nigeria Barcode Acquisition Walkthrough (EAN-13 Standard)',
      'Supermarket Vendor Listing Pitch Deck Template (Spar / Shoprite)',
      'Consignment vs. Outright Purchase Agreement & Rebate Terms'
    ],
    deliverablesList: [
      'Category Manager Proposal & Margin Presentation Deck',
      'Tamper-Evident Packaging & Barrier Labeling Standards',
      'Vetted Flexible Packaging & Label Printers in Lagos',
      '30-Day Payment Terms & Merchandising Agreement'
    ],
    deliverableType: 'Retail Pitch Decks + Regulatory Guides',
    whoIsThisFor: 'Food Processors, Cosmetic Makers, FMCG Brands & Product Manufacturers.',
    roiHook: 'Unlocks nationwide retail shelf distribution across premium supermarket chains in Nigeria.',
    previewSnippet: 'Contains the complete supermarket category manager vendor proposal deck and barcode acquisition guide.'
  },
  {
    id: 'building-boq',
    category: 'land',
    title: 'Lagos Construction Material Price Index & Structural BOQ Sizer',
    badge: '🏗️ Building Estimator',
    badgeColor: 'bg-stone-500/20 text-stone-300 border-stone-500/40',
    icon: Building,
    shortDesc: 'Cement, granite, sand & steel rod Bill of Quantities generator. Prevent contractor inflation on foundation & slabs.',
    longDesc: 'Never accept inflated building estimates from contractors or quantity surveyors. Compute exact cement bags, granite tonnes, sharp sand tippers, and high-yield TMT steel rods required per 100m² foundation, column, and slab.',
    prices: { NGN: 20000, USD: 25, GBP: 20 },
    originalPrices: { NGN: 45000, USD: 55, GBP: 45 },
    highlights: [
      '2026 Lagos Building Material Benchmark Table (Cement/Steel/Sand)',
      'Dynamic Structural BOQ Calculation Matrix (Per 100m² Slab)',
      'High-Yield TMT Steel Rod Sizing Guide (16mm, 12mm, 10mm)',
      'Master Bricklayer, Carpenter & Iron-Bender Daily Labour Rates'
    ],
    deliverablesList: [
      'Concrete Volume (1:2:4 Mix) Automated Estimation Spreadsheet',
      'Quality Inspection Guide for Sharp Sand, Plaster Sand & Granite',
      'Vetted Building Material Distributors in Lagos (Dangote/BUA/TMT)',
      'Structural Lintel, Column & Decking Material Consumption Formula'
    ],
    deliverableType: 'BOQ Spreadsheet Calculator + Price Index',
    whoIsThisFor: 'Home Builders, Real Estate Developers, Engineers & Diaspora Homeowners.',
    roiHook: 'Saves ₦2,000,000–₦5,000,000 by eliminating inflated material estimates and fake contractor billing.',
    previewSnippet: 'Includes mathematical formulas for calculating exact bags of cement, sand, and granite per cubic meter.'
  },
  {
    id: 'b2b-proposal',
    category: 'ai',
    title: 'Corporate & Government Nigeria B2B Proposal & Tender Vault',
    badge: '💼 Tender Winning Kit',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    icon: FileText,
    shortDesc: 'Executive capability statements, commercial quotation decks & RFP win blueprints for corporate Nigeria.',
    longDesc: 'Win multi-million Naira corporate and government contracts in Nigeria. Includes executive capability statements, formal RFP tender bid structures, commercial quotation templates with 5% WHT and 7.5% VAT, and Master Services Agreements.',
    prices: { NGN: 25000, USD: 30, GBP: 24 },
    originalPrices: { NGN: 60000, USD: 70, GBP: 55 },
    highlights: [
      'Executive Capability Statement Template (Ready-to-Edit Deck)',
      'Formal Request for Proposal (RFP) Response & Technical Bid Structure',
      'Commercial Financial Quotation Matrix with WHT & VAT Schedules',
      'Standard Corporate Master Services Agreement (MSA) Template'
    ],
    deliverablesList: [
      'Executive B2B Proposal Cover Letter to Procurement Boards',
      'Needs Assessment & Technical Milestone Breakdown',
      'Standard Corporate Vendor Onboarding Questionnaire',
      'Mobilization & Staged Payment Sign-Off Schedules'
    ],
    deliverableType: 'Executive Decks + Proposal Templates',
    whoIsThisFor: 'B2B Companies, Tech Agencies, Engineering Firms & Corporate Consultants.',
    roiHook: 'Dramatically improves corporate procurement win rates for ₦5M–₦50M commercial tenders.',
    previewSnippet: 'Contains the complete executive proposal cover letter and financial milestone matrix for corporate RFPs.'
  }
];

export default function DigitalProductsStorePage() {
  const [selectedCurrency, setSelectedCurrency] = useState<'NGN' | 'USD' | 'GBP'>('NGN');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePreview, setActivePreview] = useState<ProductItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-detect URL anchor/query e.g. /store?product=solar-buster
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product') || params.get('item');
      if (prodId) {
        const found = ALL_PRODUCTS.find(p => p.id === prodId);
        if (found) setActivePreview(found);
      }
    }
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter(p => p.category === selectedCategory);

  const formatPrice = (prices: { NGN: number; USD: number; GBP: number }) => {
    if (selectedCurrency === 'USD') return `$${prices.USD.toLocaleString()}`;
    if (selectedCurrency === 'GBP') return `£${prices.GBP.toLocaleString()}`;
    return `₦${prices.NGN.toLocaleString()}`;
  };

  const getSelarLink = (product: ProductItem) => {
    return `https://selar.com/showlove/bethelmind?currency=${selectedCurrency}&item=${product.id}&amount=${product.prices[selectedCurrency]}`;
  };

  const getWhatsAppOrderLink = (product: ProductItem) => {
    const text = encodeURIComponent(`Hello Bethelmind Desk, I would like to order "${product.title}" (${selectedCurrency} ${product.prices[selectedCurrency].toLocaleString()}). Please send instant bank payment details / invoice.`);
    return `https://wa.me/2348022791227?text=${text}`;
  };

  const handleShareProduct = async (product: ProductItem) => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.bethelmindanalytics.com';
      const shareUrl = `${origin}/store?product=${product.id}&utm_source=share`;
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl).catch(() => {});
      }
    } catch (_) {}
    setCopiedId(product.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* ─── Top Header & Value Proposition ───────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase shadow-lg shadow-emerald-950/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Institutional Due-Diligence & Growth Asset Hub (16 Master Toolkits)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Verified Digital Assets & <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Due-Diligence Kits</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Battle-tested toolkits, legal contracts, import blueprints, and cadastral intelligence designed to protect high-ticket investments and automate revenue in Nigeria and the Diaspora.
        </p>

        {/* Currency Switcher & Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <div className="bg-slate-900/90 border border-slate-800 p-1 rounded-2xl flex items-center shadow-xl backdrop-blur-md">
            {(['NGN', 'USD', 'GBP'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  selectedCurrency === curr
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-105'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {curr === 'NGN' ? '🇳🇬 NGN (₦)' : curr === 'USD' ? '🇺🇸 USD ($)' : '🇬🇧 GBP (£)'}
              </button>
            ))}
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-1 rounded-2xl flex flex-wrap gap-1 shadow-xl backdrop-blur-md">
            {[
              { id: 'all', label: `All Kits (${ALL_PRODUCTS.length})` },
              { id: 'solar', label: '⚡ Energy & Solar' },
              { id: 'land', label: '🗺️ Land & Real Estate' },
              { id: 'diaspora', label: '🌍 Diaspora Audit' },
              { id: 'trade', label: '🚢 Trade & Logistics' },
              { id: 'fintech', label: '💳 FinTech & Relocation' },
              { id: 'ai', label: '🤖 AI & Corporate B2B' },
              { id: 'legal', label: '📜 Legal & SME' },
              { id: 'health', label: '💎 Aesthetics' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-inner'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Product Grid (All 16 Products) ───────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const IconComponent = product.icon;
          return (
            <div
              key={product.id}
              id={product.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/40 relative group overflow-hidden backdrop-blur-xl"
            >
              {/* Top Row: Badge, Share, & Icon */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${product.badgeColor}`}>
                    {product.badge}
                  </span>
                  
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleShareProduct(product)}
                      className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700/60 transition-all text-xs flex items-center space-x-1"
                      title="Copy Direct Product Link"
                    >
                      {copiedId === product.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                    <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/60 text-emerald-400 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug mb-2">
                  {product.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                  {product.shortDesc}
                </p>

                {/* Highlights List */}
                <ul className="space-y-2 border-t border-slate-800/80 pt-4 mb-6">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Row: Pricing & Actions */}
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-black text-white">
                        {formatPrice(product.prices)}
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        {formatPrice(product.originalPrices)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">Instant Delivery</span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium bg-slate-800 px-2 py-1 rounded-lg border border-slate-700/80">
                    {product.deliverableType.split('+')[0]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePreview(product)}
                    className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-all text-center cursor-pointer"
                  >
                    View Details
                  </button>

                  <a
                    href={getSelarLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Get Access</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Expanded Product Detail Modal ──────────────────────────────────────── */}
      {activePreview && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActivePreview(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Asset Specification</span>
              </div>
              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-all text-sm font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${activePreview.badgeColor}`}>
                {activePreview.badge}
              </span>
              <h3 className="text-2xl font-extrabold text-white">
                {activePreview.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activePreview.longDesc}
              </p>
            </div>

            {/* ROI / Target Audience Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Target Audience:</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">{activePreview.whoIsThisFor}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Financial Impact / ROI:</span>
                <p className="text-xs font-semibold text-emerald-300 mt-0.5">{activePreview.roiHook}</p>
              </div>
            </div>

            {/* What's in the Box checklist */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">What You Receive in the Pack:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activePreview.deliverablesList.map((d, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200 bg-slate-800/40 p-2 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Checkout Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Price ({selectedCurrency})</span>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-black text-white">{formatPrice(activePreview.prices)}</span>
                  <span className="text-xs text-slate-500 line-through">{formatPrice(activePreview.originalPrices)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={getWhatsAppOrderLink(activePreview)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-700/60 transition-all flex items-center space-x-1.5"
                  title="Direct Bank Transfer via WhatsApp Desk"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Transfer / WhatsApp</span>
                </a>

                <a
                  href={`/api/store/download/${activePreview.id}`}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5"
                  title="Direct Download Deliverable"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download File</span>
                </a>

                <a
                  href={getSelarLink(activePreview)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center space-x-1.5"
                >
                  <span>Checkout on Selar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Frequently Asked Questions (Trust Section) ────────────────────────── */}
      <div className="max-w-4xl mx-auto mt-20 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-bold uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>Buyer Assurance & FAQs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="font-bold text-sm text-white">How are the digital kits delivered?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upon checkout on Selar, your file download is triggered automatically on your screen, sent to your email, and dispatched via SMS with your secure access link.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="font-bold text-sm text-white">Can I pay using foreign cards (GBP £ / USD $)?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes! Selar natively accepts UK, US, European, and Canadian Visa/Mastercard/Amex cards with 0% remittance friction.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="font-bold text-sm text-white">How does the Diaspora Site Video Audit work?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our certified Lagos field engineers visit your property within 48 to 72 hours, conduct GPS beacon verification, record 4K unedited video, and deliver a formal due-diligence dossier.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="font-bold text-sm text-white">Can I speak with a human before paying?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Absolutely. Our WhatsApp Closer & Verification Desk is live 24/7 at <strong className="text-emerald-400">+234 802 279 1227</strong> to assist with custom orders.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Bottom Encrypted Guarantee Banner ──────────────────────────────────── */}
      <div className="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/20 rounded-3xl p-8 text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 mb-1">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white">100% Encrypted Multi-Currency Delivery</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          All transactions are processed securely via Selar and Bethelmind Analytics supporting Nigerian bank transfers and international cards (USD, GBP, EUR).
        </p>
      </div>
    </div>
  );
}
