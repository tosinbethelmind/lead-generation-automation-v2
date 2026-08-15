/**
 * @file src/config/sectors.ts
 * Sector profile data for the Bethelmind Analytics homepage.
 *
 * IMPORTANT — Demo Data Notice:
 * Tool descriptions, recommended workflows, and sector names are
 * illustrative. Lead counts and tool availability vary by plan
 * and business configuration.
 *
 * Do not add "verified lead count" claims without a real,
 * documented, and defensible data source.
 */

export interface SectorTool {
  id: string;
  name: string;
  /** Short description of what the tool does */
  desc: string;
  /** Tag label shown on the tool card */
  tag: string;
  /** Maps to /api/sector-tools action key — null if no live demo */
  actionKey: string | null;
}

export interface SectorProfile {
  id: string;
  name: string;
  emoji: string;
  /** Short badge label, e.g. "Solar Industry Stack" */
  badge: string;
  /** Name of the headline tool for this sector */
  topToolName: string;
  /** What the tool does — honest, no guaranteed outcomes */
  topToolDesc: string;
  /** Sample business types served — not real client data */
  sampleBusinessTypes: string[];
  /** Three recommended tools for this sector */
  tools: SectorTool[];
  /** Recommended plan for this sector */
  recommendedPlan: 'starter' | 'pro' | 'vip';
  /** Accent colour for this sector card */
  color: string;
}

export const SECTOR_PROFILES: Record<string, SectorProfile> = {
  solar: {
    id: 'solar',
    name: 'Solar & Renewable Energy',
    emoji: '☀️',
    badge: 'Solar Industry Stack',
    topToolName: 'Band A DisCo Tariff ROI & LiFePO4 Sizing Suite',
    topToolDesc:
      'Calculates DisCo Band A/B/C tariff avoidance vs generator fuel savings, sizes 51.2V LiFePO4 battery packs for Inverter ACs and pumps, and generates complete 5kVA–20kVA BOQs.',
    sampleBusinessTypes: [
      '5kVA–20kVA Commercial & Residential Solar EPCs',
      'LiFePO4 Lithium Battery Distributors & Integrators',
      'Industrial Solar Diesel-Displacement Contractors',
    ],
    tools: [
      {
        id: 'disco_tariff_roi',
        name: 'DisCo Band A/B/C Tariff vs Solar ROI Engine',
        desc: 'Compares Band A (₦209.50/kWh) electricity bills and monthly generator fuel against 5kVA–20kVA solar hybrid payback timelines.',
        tag: 'Tariff ROI',
        actionKey: 'disco_tariff_solar_roi',
      },
      {
        id: 'lithium_battery',
        name: 'LiFePO4 Battery Surge Load & 90% DoD Sizer',
        desc: 'Sizes 51.2V lithium battery packs, solar array peak wattage (Wp), and surge capacity for 1.5HP Inverter ACs and Sumo pumps.',
        tag: 'Battery Sizer',
        actionKey: 'lithium_battery_sizing',
      },
      {
        id: 'solar_boq',
        name: 'WhatsApp 5kVA–20kVA Solar Hybrid BOQ Sizer',
        desc: 'Generates structured Bills of Quantities with tier-1 mono panels, MPPT inverters, mounting rails, and DC breaker protection.',
        tag: 'Solar BOQ',
        actionKey: 'solar_boq',
      },
    ],
    recommendedPlan: 'pro',
    color: '#06b6d4',
  },
  realestate: {
    id: 'realestate',
    name: 'Real Estate & Land Banking',
    emoji: '🏠',
    badge: 'Real Estate Stack',
    topToolName: 'Plot Layout, Ancillary Levies & Realtor Commission Suite',
    topToolDesc:
      'Calculates Half/Full plot land packages with Registered Survey (Red Copy), Deed, and Dev levies, sizes multi-tier realtor commissions with 5% WHT, and computes Diaspora forex off-plan build milestones.',
    sampleBusinessTypes: [
      'Lekki, Epe & Abuja Off-Plan Estate Developers',
      'Commercial Land Banking & Joint Venture (JV) Firms',
      'Realtor Brokerages & Consultant Networks (PWAN/BRG)',
    ],
    tools: [
      {
        id: 'estate_plot_alloc',
        name: 'Plot Layout, Half/Full Plot & Ancillary Levy Sizer',
        desc: 'Calculates 300 sqm Half Plot vs 500/600 sqm Full Plot total costs with Registered Survey (Red Copy), Deed, and Dev infrastructure levies.',
        tag: 'Land Package',
        actionKey: 'estate_plot_allocation',
      },
      {
        id: 'realtor_comm',
        name: 'Realtor Multi-Tier Commission & 5% WHT Ledger',
        desc: 'Computes direct 5%–15% realtor commissions, upline overrides, and statutory FIRS 5% Withholding Tax net bank payouts.',
        tag: 'Commission',
        actionKey: 'realtor_commission_ledger',
      },
      {
        id: 'diaspora_escrow',
        name: 'Diaspora Forex Off-Plan Construction Milestone Sizer',
        desc: 'Converts off-plan duplex/terrace costs into USD/GBP with 4-stage construction milestones (German Floor, Carcass, Roofing, Finishing).',
        tag: 'Diaspora Tool',
        actionKey: 'diaspora_property_escrow',
      },
    ],
    recommendedPlan: 'vip',
    color: '#8b5cf6',
  },
  automotive: {
    id: 'automotive',
    name: 'Car Dealers & Tokunbo Importers',
    emoji: '🚗',
    badge: 'Auto Sales Stack',
    topToolName: 'Trade-In Swap Valuation & Consignment Profit Suite',
    topToolDesc:
      'Calculates car swap/trade-in values based on "First Body" paint, untouched engine, and AC condition, computes showroom consignment profit-splits, and sizes VIN customs duty.',
    sampleBusinessTypes: [
      'Berger Yard & Festac Tokunbo Dealerships',
      'Abuja Central & Ikeja Car Showrooms',
      'Direct USA/Canada Auto Auction Importers',
    ],
    tools: [
      {
        id: 'car_swap',
        name: 'Nigerian Car Trade-In / Swap Valuation Sizer',
        desc: 'Appraises Nigerian used cars on mileage, "First Body" paint, and AC condition to calculate the exact cash top-up for a Tokunbo upgrade.',
        tag: 'Swap Sizer',
        actionKey: 'car_swap_valuation',
      },
      {
        id: 'consignment_profit',
        name: 'Consignment Showroom & Investor Profit Tracker',
        desc: 'Tracks showroom lot holding fees, wash/mechanic prep expenses, investor reserve price payouts, and net dealer commissions.',
        tag: 'Consignment',
        actionKey: 'auto_consignment_profit',
      },
      {
        id: 'tokunbo_duty',
        name: 'Tokunbo VIN Customs Duty & Landing Cost Sizer',
        desc: 'Computes 20% import duty, 15% NAC levy, 7.5% VAT, and PTML/Tin Can terminal charges at current customs benchmark rates.',
        tag: 'Port Landing',
        actionKey: 'tokunbo_port_clearing',
      },
    ],
    recommendedPlan: 'pro',
    color: '#3b82f6',
  },
  medical: {
    id: 'medical',
    name: 'Clinics & Hospitals',
    emoji: '🏥',
    badge: 'Healthcare Stack',
    topToolName: 'HMO Claims Reconciler & Surgery Deposit Sizer',
    topToolDesc:
      'Reconciles HMO tariff co-pays and AuthCode claim risks, sizes surgery admission deposits, and configures bundled diagnostic lab test packages.',
    sampleBusinessTypes: [
      'General Practice & Specialist Surgical Clinics',
      'Diagnostic Ultrasound, CT & MRI Scan Centres',
      'Dental, Eye & Fertility Specialist Centres',
    ],
    tools: [
      {
        id: 'hmo_claims',
        name: 'HMO Claims & Tariff AuthCode Reconciler',
        desc: 'Reconciles procedure tariffs, co-pay deductions, and secondary AuthCode validation to prevent 60-day HMO claim rejections.',
        tag: 'HMO Tool',
        actionKey: 'hmo_claims_reconciler',
      },
      {
        id: 'surgery_deposit',
        name: 'Surgery & In-Patient Ward Deposit Sizer',
        desc: 'Computes surgeon fees, theater consumables, and bed ward rates to generate mandatory 60% upfront admission deposits.',
        tag: 'Deposit Sizer',
        actionKey: 'surgery_deposit_sizer',
      },
      {
        id: 'diagnostic_lab',
        name: 'Diagnostic Scan & Lab Test Package Sizer',
        desc: 'Calculates bundled discounts for Executive Wellness, MRI, CT, and Fertility panels with automated fasting guidelines.',
        tag: 'Lab Package',
        actionKey: 'diagnostic_lab_package',
      },
    ],
    recommendedPlan: 'pro',
    color: '#10b981',
  },
  legal: {
    id: 'legal',
    name: 'Law Firms & Solicitors',
    emoji: '⚖️',
    badge: 'Legal Practice Stack',
    topToolName: 'SCUML, CAC Penalty & Legal Retainer Suite',
    topToolDesc:
      'Calculates unfiled CAC Annual Return penalties and EFCC/SCUML compliance budgets, sizes hourly billable rates and court debit notes, and computes incorporation stamp duty.',
    sampleBusinessTypes: [
      'Commercial & Corporate Law Firms (Victoria Island/Ikoyi)',
      'Litigation, Property & Conveyancing Solicitors',
      'Corporate Affairs Commission (CAC) Accredited Agents',
    ],
    tools: [
      {
        id: 'scuml_cac_audit',
        name: 'CAC Annual Return Penalties & SCUML Sizer',
        desc: 'Calculates accumulated statutory late filing penalties, reactivation surcharges, and SCUML compliance fees to prevent bank account restrictions.',
        tag: 'Compliance',
        actionKey: 'scuml_cac_compliance_audit',
      },
      {
        id: 'legal_retainer',
        name: 'Legal Retainer & Billable Hours Debit Note Sizer',
        desc: 'Computes Senior Partner / Associate hourly rates, court filing disbursements, 7.5% VAT, and 5% WHT to generate formal legal fee debit notes.',
        tag: 'Debit Note',
        actionKey: 'legal_retainer_debit_note',
      },
      {
        id: 'cac_fees',
        name: 'CAMA 2020 Incorporation & Stamp Duty Sizer',
        desc: 'Calculates statutory CAC incorporation fees and FIRS stamp duties for Business Names, Ltd Companies, and Incorporated Trustees.',
        tag: 'CAC Sizer',
        actionKey: 'cac_fees',
      },
    ],
    recommendedPlan: 'pro',
    color: '#ec4899',
  },
  retail: {
    id: 'retail',
    name: 'Boutiques & E-Commerce',
    emoji: '🛍️',
    badge: 'Retail Commerce Stack',
    topToolName: 'Pay-on-Delivery (POD) Cash & Stock Shrinkage Suite',
    topToolDesc:
      'Reconciles rider doorstep cash collections vs RTO failed delivery losses, audits boutique physical stock vs POS pilferage, and generates instant WhatsApp order carts.',
    sampleBusinessTypes: [
      'Fashion, Shoes, Hair & Perfume Boutiques',
      'Instagram / TikTok / Social Commerce Vendors',
      'Electronics, Phones & Computer Village Wholesalers',
    ],
    tools: [
      {
        id: 'pod_dispatch',
        name: 'POD Dispatch & Rider Cash Remittance Reconciler',
        desc: 'Computes doorstep delivery cash collections, courier waybill charges, and 20%–35% RTO failed order losses to stop rider cash leakages.',
        tag: 'POD Reconcile',
        actionKey: 'pod_dispatch_cash_reconciler',
      },
      {
        id: 'boutique_shrinkage',
        name: 'Boutique Physical Stock vs POS Shrinkage Auditor',
        desc: 'Compares physical shelf counts against POS book balances to detect staff pilferage, missing designer items, and unrecorded sales.',
        tag: 'Stock Auditor',
        actionKey: 'boutique_stock_shrinkage',
      },
      {
        id: 'logistics_delivery',
        name: 'Lagos & Interstate Delivery Rate Sizer',
        desc: 'Calculates dispatch waybill rates across Lagos Island/Mainland, Abuja, Port Harcourt, and Kano for instant checkout.',
        tag: 'Waybill Sizer',
        actionKey: 'logistics_delivery',
      },
    ],
    recommendedPlan: 'pro',
    color: '#f97316',
  },
  schools: {
    id: 'schools',
    name: 'Schools & Business Academies',
    emoji: '📚',
    badge: 'Education Admin Stack',
    topToolName: 'CBT Exam Auto-Grading & Broadsheet Engine',
    topToolDesc:
      'Runs JAMB/WAEC simulated mock CBT tests, auto-grades objective questions, and computes WAEC-compliant A1-F9 termly report broadsheets.',
    sampleBusinessTypes: [
      'Nursery, Primary & Secondary Colleges',
      'JAMB/WAEC CBT Exam Centres & Tutorials',
      'Professional Institutes & Business Academies',
    ],
    tools: [
      {
        id: 'cbt_exam',
        name: 'CBT Mock Exam & CA Auto-Grading Engine',
        desc: 'Calculates objective scores, CA1/CA2 weighted continuous assessment, and generates WAEC A1–F9 grade classifications.',
        tag: 'CBT Tool',
        actionKey: 'cbt_exam_scoring',
      },
      {
        id: 'report_broadsheet',
        name: 'Termly Broadsheet & Class Position Sizer',
        desc: 'Computes termly cumulative student average, class position ranking (1st–50th), GPA, and principal pedagogical remarks.',
        tag: 'Broadsheet',
        actionKey: 'report_card_broadsheet',
      },
      {
        id: 'result_pin',
        name: 'Result Checker PIN & Scratch Card Portal',
        desc: 'Generates cryptographic 16-digit result PIN batches and calculates cardless monetization yields.',
        tag: 'PIN Portal',
        actionKey: 'result_pin_generator',
      },
    ],
    recommendedPlan: 'pro',
    color: '#06b6d4',
  },
  oilgas: {
    id: 'oilgas',
    name: 'Downstream Petroleum & LPG',
    emoji: '⛽',
    badge: 'Petroleum & LPG Stack',
    topToolName: 'Tanker Discharge Variance & UST Wet-Stock Suite',
    topToolDesc:
      'Calculates 33,000L/45,000L tanker dip-stick discharge shortages and NMDPRA transit shrinkage debit notes, detects UST water ingress with Kolor Kut, and audits LPG skid attendant cash.',
    sampleBusinessTypes: [
      'Independent Petroleum Filling Stations (PMS/AGO/DPK)',
      'Apapa & Ibafon Bulk Fuel Depot Transporters',
      'Retail Cooking Gas (LPG) Skid Plants & Mini-Gas Hubs',
    ],
    tools: [
      {
        id: 'tanker_discharge',
        name: 'Tanker Dip-Stick Variance & Shortage Sizer',
        desc: 'Calculates physical ullage shortages vs Bill of Lading, deducts NMDPRA transit shrinkage allowance, and generates driver debit claim notes.',
        tag: 'Tanker Sizer',
        actionKey: 'tanker_discharge_variance',
      },
      {
        id: 'ust_water_audit',
        name: 'UST Water Ingress & Pump Totalizer Reconciler',
        desc: 'Detects water bottoms with Kolor Kut paste in cm and reconciles physical dip rod volume against mechanical dispenser pump meters.',
        tag: 'Wet-Stock',
        actionKey: 'ust_water_ingress_pump_audit',
      },
      {
        id: 'lpg_audit',
        name: 'LPG Skid Scale & Attendant Cash Auditor',
        desc: 'Reconciles daily kg cylinder sales against cash collected and tank dip readings to detect cashier shortage leakages.',
        tag: 'LPG Sizer',
        actionKey: 'lpg_skid_audit',
      },
    ],
    recommendedPlan: 'vip',
    color: '#ef4444',
  },
  haulage: {
    id: 'haulage',
    name: 'Haulage, Logistics & Fleet',
    emoji: '🚚',
    badge: 'Logistics & Fleet Stack',
    topToolName: 'Interstate Road Union Tax & Diesel Siphoning Suite',
    topToolDesc:
      'Calculates corridor union tickets & state haulage stickers across Lagos–Kano/PH corridors, audits GPS mileage vs driver diesel siphoning, and models 30-ton trip net margins.',
    sampleBusinessTypes: [
      'Interstate 30-Ton & 40-Ton Articulated Truck Haulage',
      'Apapa & Tin Can Port Container Drayage Fleets',
      'FMCG & Agricultural Produce Interstate Fleet',
    ],
    tools: [
      {
        id: 'road_union_tax',
        name: 'Interstate Corridor Union & State Toll Sizer',
        desc: 'Calculates NURTW/RTEAN union tickets, state haulage stickers, produce/quarantine levies, and trailer park security fees per trip.',
        tag: 'Road Levies',
        actionKey: 'interstate_union_road_tax',
      },
      {
        id: 'gps_diesel_audit',
        name: 'GPS Mileage vs Diesel Siphoning Auditor',
        desc: 'Audits GPS traveled km against truck fuel efficiency (km/L) to detect roadside diesel siphoning and generate driver debit claims.',
        tag: 'Fuel Anti-Theft',
        actionKey: 'gps_diesel_mileage_audit',
      },
      {
        id: 'trip_expense',
        name: '30-Ton / 40-Ton Freight Waybill & Margin Sizer',
        desc: 'Computes freight billing, diesel consumption cost, driver road allowances, and net margins per round trip.',
        tag: 'Profit Tool',
        actionKey: 'haulage_trip_expense',
      },
    ],
    recommendedPlan: 'vip',
    color: '#3b82f6',
  },
  microfinance: {
    id: 'microfinance',
    name: 'Micro-Lending & Esusu Cooperatives',
    emoji: '💰',
    badge: 'Fintech & Lending Stack',
    topToolName: 'Daily Esusu Thrift & Remita 33.33% DSR Loan Suite',
    topToolDesc:
      'Reconciles daily market Esusu/Ajo thrift collections and 1-day commission deductions, sizes civil servant Remita direct-debit salary loans within 33.33% DSR, and audits micro-loan schedules.',
    sampleBusinessTypes: [
      'State-Licensed Money Lenders & Payday Loan Apps',
      'Market Trader Daily Esusu / Ajo Thrift Cooperatives',
      'Cooperative Thrift & Credit Societies (CTCS)',
    ],
    tools: [
      {
        id: 'esusu_passbook',
        name: 'Daily Esusu Thrift Collector & Shortage Reconciler',
        desc: 'Calculates daily market savings pools, 1-day thrift management commission, month-end contributor payouts, and catches agent cash shortages.',
        tag: 'Esusu / Ajo',
        actionKey: 'esusu_thrift_passbook_audit',
      },
      {
        id: 'salary_remita_loan',
        name: 'Salary Remita 33.33% DSR Loan Eligibility Sizer',
        desc: 'Enforces the 1/3 net salary Debt-Service Ratio limit to calculate maximum qualifiable payday loan principal and monthly deductions.',
        tag: 'DSR Sizer',
        actionKey: 'salary_remita_loan_sizer',
      },
      {
        id: 'micro_loan_calc',
        name: 'Auto-Debit Loan Schedule & Risk Sizer',
        desc: 'Calculates monthly repayments, interest margins, and direct-debit mandate fees to secure payday collections.',
        tag: 'Lending Tool',
        actionKey: 'micro_loan_schedule',
      },
    ],
    recommendedPlan: 'vip',
    color: '#10b981',
  },
  agro: {
    id: 'agro',
    name: 'Agro-Allied, Poultry & Grains',
    emoji: '🌾',
    badge: 'Agribusiness Stack',
    topToolName: 'Grain Moisture Penalty & Layer HDP Yield Suite',
    topToolDesc:
      'Calculates grain weighbridge moisture discounts and silo shrinkage for Maize/Soya/Paddy, tracks poultry Layer Hen Day Production (HDP %), and audits cold storage diesel spoilage costs.',
    sampleBusinessTypes: [
      'Dawanau & Bodija Grain Aggregators & Silo Operators',
      'Commercial Layer & Broiler Poultry Farms',
      'Frozen Fish & Meat Cold Storage Warehouses',
    ],
    tools: [
      {
        id: 'grain_moisture',
        name: 'Grain Weighbridge Moisture Penalty & Silo Sizer',
        desc: 'Calculates weight shrinkage loss %, drying penalty per 100kg bag, and net clean commodity settlement value for Maize and Soya.',
        tag: 'Weighbridge',
        actionKey: 'grain_moisture_discount',
      },
      {
        id: 'poultry_yield',
        name: 'Layer Hen Day Production (HDP %) & Feed Sizer',
        desc: 'Calculates daily egg crate income vs feed costs to benchmark flock productivity and stop egg crate staff diversion.',
        tag: 'Poultry Yield',
        actionKey: 'agro_poultry_yield',
      },
      {
        id: 'cold_room_spoilage',
        name: 'Cold Storage Diesel vs Power Spoilage Auditor',
        desc: 'Tracks generator runtime against cold room capacity to protect perishable frozen fish/meat inventory from spoilage write-offs.',
        tag: 'Cold Storage',
        actionKey: 'cold_room_spoilage',
      },
    ],
    recommendedPlan: 'pro',
    color: '#84cc16',
  },
  hospitality: {
    id: 'hospitality',
    name: 'Hospitality, Shortlets & Event Centers',
    emoji: '🏨',
    badge: 'Hospitality Stack',
    topToolName: 'Shortlet Power Token & Marquee Event Overstay Suite',
    topToolDesc:
      'Reconciles guest DisCo AC electricity meter usage vs caution deposits, calculates wedding marquee rentals, 250kVA generator overtime fees, and damage caution bond refunds.',
    sampleBusinessTypes: [
      'Luxury Shortlet Apartments (Lekki, VI, Ikoyi, Maitama)',
      'Event Marquees & Wedding Banquet Halls',
      'Boutique Hotels & Serviced Residencies',
    ],
    tools: [
      {
        id: 'shortlet_power_caution',
        name: 'Shortlet Electricity Token & Caution Reconciler',
        desc: 'Audits guest AC prepaid meter kWh vs daily allowance at ₦209.50/kWh DisCo Band A tariffs, deducts property damages, and computes net caution refunds.',
        tag: 'Caution & Power',
        actionKey: 'shortlet_caution_power_recon',
      },
      {
        id: 'event_hall_overtime',
        name: 'Event Marquee Booking & Overtime Tariff Sizer',
        desc: 'Calculates event marquee venue rental, refundable damage caution bonds, 250kVA generator overtime per hour, and post-event waste levies.',
        tag: 'Marquee / Hall',
        actionKey: 'event_hall_overtime_sizer',
      },
      {
        id: 'shortlet_booking',
        name: 'Direct Booking & Stay Package Sizer',
        desc: 'Calculates stay totals, electricity allowance, and caution deposit requirements for direct WhatsApp reservations.',
        tag: 'Booking Tool',
        actionKey: 'shortlet_booking',
      },
    ],
    recommendedPlan: 'pro',
    color: '#f59e0b',
  },
  clearing: {
    id: 'clearing',
    name: 'Port Clearing & Demurrage',
    emoji: '⚓',
    badge: 'Maritime & Port Stack',
    topToolName: 'PAAR Customs Assessment & Demurrage Penalty Suite',
    topToolDesc:
      'Generates single-sheet PAAR customs duties (Duty, CISS 1%, ETLS 0.5%, NAC 15%, VAT 7.5%), calculates escalating demurrage penalties past free days, and audits empty container EIR deposit refunds.',
    sampleBusinessTypes: [
      'Apapa & Tin Can Licensed Customs Clearing Agents',
      'International Maritime Freight Forwarders',
      'Raw Material, Machinery & General Cargo Importers',
    ],
    tools: [
      {
        id: 'paar_customs_assessment',
        name: 'PAAR Single-Sheet Customs Duty Assessment',
        desc: 'Calculates CIF conversion, Import Duty, CISS, ETLS, NAC, and 7.5% VAT single-sheet totals for bank customs payment.',
        tag: 'Customs Duty',
        actionKey: 'paar_customs_duty_sizer',
      },
      {
        id: 'demurrage_calc',
        name: 'Shipping Line Demurrage & Terminal Storage Sizer',
        desc: 'Calculates daily dollar and Naira demurrage charges accrued beyond free days across escalating penalty tiers.',
        tag: 'Demurrage',
        actionKey: 'container_demurrage',
      },
      {
        id: 'container_refund',
        name: 'Empty Container EIR & Holding Bay Refund Tracker',
        desc: 'Audits holding bay container gate-in dates against shipping line deposit receipts to calculate net caution refunds.',
        tag: 'EIR Refund',
        actionKey: 'container_deposit_refund_tracker',
      },
    ],
    recommendedPlan: 'vip',
    color: '#0284c7',
  },
  construction: {
    id: 'construction',
    name: 'Construction & Heavy Plant Hire',
    emoji: '🚜',
    badge: 'Civil & Machinery Stack',
    topToolName: 'Heavy Plant Lease, Quarry & Concrete Structural Suite',
    topToolDesc:
      'Calculates Cat excavator/crane hourly wet vs dry lease rates, sizes granite quarry truck weighbridge dispatch waybills, and computes structural concrete mix bags and rebar steel.',
    sampleBusinessTypes: [
      'Heavy Earthmoving Equipment Rental & Wet Lease',
      'Granite Quarrying & Tipper Truck Fleet Aggregators',
      'Civil Engineering & Building Contractors',
    ],
    tools: [
      {
        id: 'machinery_lease',
        name: 'Heavy Plant Hour-Meter & Lease Cost Sizer',
        desc: 'Calculates hourly rental billing, diesel consumption, and operator per diems for wet vs dry leases.',
        tag: 'Lease Tool',
        actionKey: 'machinery_lease_expense',
      },
      {
        id: 'quarry_dispatch',
        name: 'Quarry Aggregate Tonnage & Weighbridge Dispatch Sizer',
        desc: 'Sizes 30-ton tipper trips for stone dust, 1/2-inch, 3/4-inch granite, and haulage transport freight per trip.',
        tag: 'Quarry Sizer',
        actionKey: 'quarry_weighbridge_sizer',
      },
      {
        id: 'concrete_mix',
        name: 'Concrete Mix (1:2:4 / M20) & Rebar Steel Sizer',
        desc: 'Calculates cement bags, sharp sand tons, 3/4 granite tons, and high-yield rebar steel per cubic meter of slab.',
        tag: 'Concrete Sizer',
        actionKey: 'concrete_structural_sizer',
      },
    ],
    recommendedPlan: 'vip',
    color: '#d97706',
  },
  security: {
    id: 'security',
    name: 'Private Security & Estate Guarding',
    emoji: '🛡️',
    badge: 'Security & Access Stack',
    topToolName: 'Estate Security Roster & WhatsApp Gate Pass Suite',
    topToolDesc:
      'Computes estate security guard shift deployments, 30-minute NFC perimeter patrol rounds, and 6-digit WhatsApp visitor gate pass entry clearance.',
    sampleBusinessTypes: [
      'Residential Estate Facility Managers (CDAs)',
      'Licensed Private Guard Companies (PGCs)',
      'Corporate Commercial Facility Security',
    ],
    tools: [
      {
        id: 'security_patrol',
        name: 'Estate Guard Deployment & Visitor Code Sizer',
        desc: 'Computes monthly resident security levies, guard shifts, and visitor access code capacity.',
        tag: 'Security Tool',
        actionKey: 'security_patrol_gate_pass',
      },
      {
        id: 'nfc_patrol_log',
        name: 'NFC Perimeter Patrol Clock-in & Guard Roster Sizer',
        desc: 'Calculates 24/7 Day/Night 12-hr guard shift coverage, overtime allowances, NFC perimeter patrol round checkpoints, and monthly guard relief rosters.',
        tag: 'NFC Patrol',
        actionKey: 'security_guard_roster_sizer',
      },
      {
        id: 'resident_intercom',
        name: 'WhatsApp Resident Intercom & Access Pass Sizer',
        desc: 'Calculates daily 6-digit WhatsApp gate pass volumes, peak traffic entry hours, barrier gate security validation speed, and resident monthly access maintenance charges.',
        tag: 'Gate Pass',
        actionKey: 'estate_visitor_pass_capacity',
      },
    ],
    recommendedPlan: 'pro',
    color: '#475569',
  },
  general: {
    id: 'general',
    name: 'General B2B Services',
    emoji: '🏢',
    badge: 'B2B Services Stack',
    topToolName: 'FIRS VAT/WHT Pro-Forma Invoice & Proposal Engine',
    topToolDesc:
      'Auto-generates FIRS VAT/WHT-compliant pro-forma invoices with 7.5% VAT and 5% WHT credit notes, and sizes B2B enterprise proposals.',
    sampleBusinessTypes: [
      'Corporate Consulting & Logistics',
      'IT Services & Enterprise Software',
      'Industrial Equipment & Contractors',
    ],
    tools: [
      {
        id: 'follow_up',
        name: 'FIRS VAT/WHT Pro-Forma Invoice Builder',
        desc: 'Instantly builds professional PDF quotes with CAC registration numbers, TIN, 7.5% VAT, and 5% WHT line items.',
        tag: 'Invoice Tool',
        actionKey: 'b2b_proforma_invoice_sizer',
      },
      {
        id: 'enquiry_handler',
        name: 'B2B Services Proposal & Retainer Sizer',
        desc: 'Computes enterprise service fee structures with VAT, WHT deductions, and net bank settlements.',
        tag: 'Proposal Tool',
        actionKey: 'b2b_proforma_invoice_sizer',
      },
      {
        id: 'quote_workflow',
        name: 'Corporate Contract Retainer & Tax Note Sizer',
        desc: 'Calculates recurring retainer invoices, statutory tax compliance withholding, and net receivable cash flow.',
        tag: 'Tax Note',
        actionKey: 'b2b_proforma_invoice_sizer',
      },
    ],
    recommendedPlan: 'pro',
    color: '#06b6d4',
  },
};

/** Returns an ordered list of sector profiles for UI rendering. */
export const ORDERED_SECTORS: SectorProfile[] = Object.values(SECTOR_PROFILES);

/** Returns a sector profile by ID, defaulting to 'general'. */
export function getSectorById(id: string): SectorProfile {
  return SECTOR_PROFILES[id] ?? SECTOR_PROFILES.general;
}

/** Lagos districts for the profiler dropdown */
export const LAGOS_DISTRICTS: string[] = [
  'Ikeja',
  'Lekki Phase 1',
  'Victoria Island',
  'Ikoyi',
  'Yaba',
  'Surulere',
  'Ikorodu',
  'Alimosho',
  'Festac & Amuwo-Odofin',
  'Apapa',
  'Ajah & Sangotedo',
  'Gbagada & Maryland',
  'All Lagos Areas',
];
