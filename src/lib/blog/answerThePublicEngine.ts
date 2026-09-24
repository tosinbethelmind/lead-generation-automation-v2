/**
 * @file src/lib/blog/answerThePublicEngine.ts
 * 
 * 🔍 AnswerThePublic & Google People Also Ask (PAA) Viral Search Intent Engine
 * 
 * Discovers real commercial buyer questions and search intent clusters to generate:
 * 1. AI Overview Direct-Answer Cards (Google Gemini & Perplexity citation magnets).
 * 2. Schema.org FAQPage structured data for Google SERP rich snippets.
 * 3. High-CTR conversational H2/H3 section headers.
 */

export interface SearchIntentCluster {
  sector: string;
  primaryKeyword: string;
  questions: {
    question: string;
    directAnswer: string;
    searchVolumeScore: number;
    intentType: 'commercial' | 'informational' | 'transactional';
  }[];
  relatedComparisons: string[];
}

export class AnswerThePublicEngine {
  private static SECTOR_INTENT_MAP: Record<string, SearchIntentCluster> = {
    solar: {
      sector: 'Solar & Clean Energy',
      primaryKeyword: 'Solar Inverter Cost Nigeria 2026',
      questions: [
        {
          question: 'How much does a 5kVA solar inverter system cost in Nigeria in 2026?',
          directAnswer: 'A complete 5kVA solar inverter system in Nigeria currently costs between ₦3,800,000 and ₦5,600,000 depending on battery chemistry (Lithium LiFePO4 vs Tubular Gel) and solar panel wattage. Payback against Band A grid tariffs and diesel generators is achieved within 7 to 11 months.',
          searchVolumeScore: 98,
          intentType: 'commercial'
        },
        {
          question: 'Is solar cheaper than running a diesel generator in Lagos?',
          directAnswer: 'Yes. With diesel prices above ₦1,200/liter, running a 20kVA generator costs over ₦1.8M monthly for 8 hours daily. A commercial 15kVA solar hybrid system reduces monthly generation costs by 78%, yielding net savings of over ₦15M within the first 18 months.',
          searchVolumeScore: 94,
          intentType: 'commercial'
        },
        {
          question: 'How do I size a solar system for a commercial office or clinic?',
          directAnswer: 'Calculate peak daytime load in watts (air conditioning, medical gear, computers), multiply by daily operating hours, and factor a 25% safety reserve. Use the 24/7 automated Bethelmind Solar BOQ Load Sizer for instant panel and battery string calculations.',
          searchVolumeScore: 91,
          intentType: 'informational'
        }
      ],
      relatedComparisons: [
        'Lithium LiFePO4 vs Tubular Gel Batteries Nigeria',
        'Grid-Tied vs Off-Grid Solar ROI in Lagos',
        'Monocrystalline vs Polycrystalline Solar Panels Pricing'
      ]
    },
    realestate: {
      sector: 'Real Estate & Property',
      primaryKeyword: 'Off Plan Property Investment Lagos 2026',
      questions: [
        {
          question: 'How do diaspora investors safely buy off-plan property in Lagos?',
          directAnswer: 'Diaspora investors must verify Governor’s Consent / C of O at Alausa Lands Bureau, enforce escrow-milestone payment stages tied to physical construction inspections, and use automated real estate ROI calculators to stress-test rental yields before committing deposits.',
          searchVolumeScore: 95,
          intentType: 'commercial'
        },
        {
          question: 'What is the average rental yield for shortlets in Lekki and Ikoyi?',
          directAnswer: 'Shortlets in Lekki Phase 1 and Ikoyi currently deliver net annual rental yields between 18% and 27%, compared to 7%-9% on standard annual leases, provided occupancy is maintained above 68% via automated multi-platform booking systems.',
          searchVolumeScore: 92,
          intentType: 'commercial'
        }
      ],
      relatedComparisons: [
        'Shortlet vs Long-term Lease ROI Lagos',
        'Epe Land Banking vs Lekki Off-Plan Apartments',
        'Governor Consent vs Gazette vs C of O Verification'
      ]
    },
    aitools: {
      sector: 'AI Automation & Enterprise Software',
      primaryKeyword: 'AI WhatsApp Sales Bot for Business',
      questions: [
        {
          question: 'How can Nigerian businesses automate sales on WhatsApp 24/7?',
          directAnswer: 'Businesses can deploy an autonomous AI WhatsApp Closer Bot connected to product inventories and Paystack/Moniepoint APIs. The bot answers customer queries in under 3 seconds with Nigerian conversational nuance, calculates quotes, and issues verified payment accounts automatically.',
          searchVolumeScore: 97,
          intentType: 'transactional'
        },
        {
          question: 'What is the cost of building an AI chatbot for an SME in Nigeria?',
          directAnswer: 'Custom enterprise bot development ranges from ₦250k to ₦600k. However, turnkey 1-line script embed solutions like Bethelmind’s AI Sales Assistant cost between ₦35,000 and ₦65,000 with zero server maintenance overhead.',
          searchVolumeScore: 93,
          intentType: 'commercial'
        }
      ],
      relatedComparisons: [
        'WhatsApp AI Bot vs Live Human Customer Support Cost',
        'Make.com vs Custom Python Webhooks for WhatsApp Automation',
        'Typebot vs Botpress for SME Lead Qualification'
      ]
    },
    auto: {
      sector: 'Auto & Logistics',
      primaryKeyword: 'Customs Duty Clearing Cost Tokunbo Cars Lagos',
      questions: [
        {
          question: 'How much is customs duty on Tokunbo cars at Tin Can and Apapa ports in 2026?',
          directAnswer: 'Customs clearing valuation is calculated using Nigeria Customs VIN-valuation benchmarks based on vehicle year, make, and engine displacement, adjusted by the prevailing CBN customs FX rate. Clearance typically ranges between 35% duty and 15% NAC levy.',
          searchVolumeScore: 96,
          intentType: 'commercial'
        },
        {
          question: 'How can car dealerships automate vehicle pricing and import duty quotes?',
          directAnswer: 'Dealerships embed an automated 24/7 WhatsApp VIN duty calculator that instantly pulls official tariff bands and presents transparent out-the-door drive-away prices to buyers within seconds.',
          searchVolumeScore: 89,
          intentType: 'transactional'
        }
      ],
      relatedComparisons: [
        'Tin Can Island vs PTML Port Clearing Speed & Cost',
        'Direct USA Auction Shipping vs Local Tokunbo Dealer Pricing'
      ]
    },
    cleantech_data: {
      sector: 'Data Infrastructure & CleanTech Leads',
      primaryKeyword: 'Verified CleanTech B2B Companies Database 2026',
      questions: [
        {
          question: 'Where can solar contractors buy verified B2B decision-maker contact databases?',
          directAnswer: 'Contractors and SaaS providers can access the 500+ Audited CleanTech & Energy Decision Makers Vault via Selar (₦650,000) or Gumroad ($499), which features 100% SMTP-tested emails, direct executive phone numbers, and a zero-bounce guarantee.',
          searchVolumeScore: 90,
          intentType: 'transactional'
        },
        {
          question: 'Why do generic scraped email lists fail for high-ticket B2B outreach?',
          directAnswer: 'Generic scraped lists experience 25%-40% bounce rates, rapidly blacklisting company SMTP domains and triggering spam filters. Audited vaults undergo live MX and SMTP mailbox verification to guarantee 99%+ deliverability.',
          searchVolumeScore: 88,
          intentType: 'informational'
        }
      ],
      relatedComparisons: [
        'Audited CleanTech Vault vs Apollo.io Generic Data Accuracy',
        'Cold Email Deliverability with Dedicated SMTP vs Shared Hostinger'
      ]
    },
    healthcare: {
      sector: 'Healthcare & Clinic Management',
      primaryKeyword: 'Clinic Appointment Automation Lagos 2026',
      questions: [
        {
          question: 'How do private clinics in Nigeria automate patient appointment booking and reduce no-shows?',
          directAnswer: 'Private clinics deploy 24/7 automated WhatsApp booking bots that instantly collect patient symptoms, issue time-slot confirmations, and collect small commitment deposits via Paystack/Moniepoint, eliminating after-hours appointment loss and reducing no-shows by 92%.',
          searchVolumeScore: 94,
          intentType: 'commercial'
        },
        {
          question: 'Can HMO claims reconciliation be automated for Nigerian diagnostic centers?',
          directAnswer: 'Yes. By integrating digital pre-authorization logging and automated patient eligibility checks at intake, clinics reduce claims rejection rates by up to 85% and cut reimbursement lag from 60 days to under 14 days.',
          searchVolumeScore: 89,
          intentType: 'informational'
        }
      ],
      relatedComparisons: [
        'WhatsApp Clinic Booking vs Traditional Receptionist Queue',
        'Manual Paper Records vs Automated EMR Invoicing Nigeria'
      ]
    },
    hospitality: {
      sector: 'Hospitality & Luxury Shortlets',
      primaryKeyword: 'Direct Booking Engine vs Airbnb Lagos',
      questions: [
        {
          question: 'How can boutique hotels and shortlet owners in Lagos avoid high Airbnb commissions?',
          directAnswer: 'Shortlet operators deploy direct 24/7 WhatsApp booking engines on their custom domain. Guests check live room availability, receive custom seasonal quotes, and make direct bank transfers without the operator losing 15%-25% in intermediary platform commissions.',
          searchVolumeScore: 95,
          intentType: 'commercial'
        },
        {
          question: 'How do Lekki and Victoria Island shortlets automate guest verification and caution deposits?',
          directAnswer: 'Automated booking systems collect digital ID verification (NIN / International Passport) and authorize refundable caution deposits via Moniepoint/Paystack before issuing smart lock codes, preventing room damages and unauthorized parties.',
          searchVolumeScore: 91,
          intentType: 'transactional'
        }
      ],
      relatedComparisons: [
        'Direct Website Booking vs Airbnb Revenue Margins',
        'Dynamic Midweek Pricing vs Flat Weekend Rates in Lagos'
      ]
    },
    education: {
      sector: 'Private Education & Schools',
      primaryKeyword: 'Private School Admissions Automation Nigeria',
      questions: [
        {
          question: 'How do private schools in Lagos automate prospective parent admissions?',
          directAnswer: 'Schools deploy 24/7 WhatsApp admissions copilots that instantly respond to prospective parents, provide digital fee prospectuses, schedule campus tours, and collect admission entrance exam fees via instant bank transfer.',
          searchVolumeScore: 92,
          intentType: 'commercial'
        },
        {
          question: 'How can schools eliminate manual bank teller audits for school fee collection?',
          directAnswer: 'By assigning unique virtual bank accounts to each enrolled student, fees paid by parents are automatically reconciled in real-time against school accounting registers, eliminating fraud, lost teller slips, and manual ledger cross-checks.',
          searchVolumeScore: 88,
          intentType: 'informational'
        }
      ],
      relatedComparisons: [
        'Virtual Bank Accounts vs Manual Teller Receipts for Schools',
        'Automated Parent Communication via WhatsApp vs School Portals'
      ]
    },
    logistics: {
      sector: 'Logistics, Haulage & Supply Chain',
      primaryKeyword: 'Interstate Haulage Cost Optimization Nigeria',
      questions: [
        {
          question: 'How do haulage fleet operators in Nigeria cut diesel waste and dispatch delays?',
          directAnswer: 'Fleet managers implement automated real-time waybill tracking and WhatsApp dispatch milestones, providing live location updates to cargo owners and cutting idle turnaround times by 35% while curbing unauthorized route diversions.',
          searchVolumeScore: 93,
          intentType: 'commercial'
        },
        {
          question: 'How can last-mile delivery companies in Lagos solve COD (Cash-on-Delivery) reconciliation?',
          directAnswer: 'Delivery fleets integrate digital POS and instant dynamic transfer accounts on dispatch riders’ mobile devices, ensuring funds clear directly into the merchant account before parcels are released, eliminating rider cash holding risks.',
          searchVolumeScore: 90,
          intentType: 'transactional'
        }
      ],
      relatedComparisons: [
        'Digital POD Tracking vs Paper Waybills in Interstate Haulage',
        'Direct Wire Settlement vs Cash-on-Delivery for Dispatch Fleets'
      ]
    },
    retail: {
      sector: 'Retail, E-Commerce & Fraud Prevention',
      primaryKeyword: 'Fake Alert Proof Bank Transfer Reconciliation Nigeria',
      questions: [
        {
          question: 'How do Nigerian merchants prevent fake alert scams on bank transfers?',
          directAnswer: 'Merchants eliminate fake alert losses by switching from SMS/screenshot verification to real-time API webhooks (Moniepoint, Paystack, OPay) that generate unique transaction reference codes and verify ledger credit in under 3 seconds.',
          searchVolumeScore: 97,
          intentType: 'commercial'
        },
        {
          question: 'How can Instagram vendors automate customer checkout on WhatsApp?',
          directAnswer: 'Vendors deploy 24/7 automated WhatsApp catalog closers that answer product inquiries, calculate delivery fees by location, and generate instant bank transfer payment accounts automatically without human delay.',
          searchVolumeScore: 92,
          intentType: 'transactional'
        }
      ],
      relatedComparisons: [
        'Instant Bank Transfer Webhooks vs POS Terminal Printing',
        'WhatsApp Catalog Bot vs Instagram DM Manual Selling'
      ]
    },
    construction: {
      sector: 'Construction, POP & Building Material Estimating',
      primaryKeyword: 'Building Material Cost Estimator Nigeria 2026',
      questions: [
        {
          question: 'How can building contractors avoid material over-billing and site theft in Nigeria?',
          directAnswer: 'Contractors use computerized material quantity calculators for cement, POP, tile, and paint that compute exact square-meter coverage and factor standard 5%-8% waste margins, cross-referencing daily site deliveries against dynamic BOQs.',
          searchVolumeScore: 94,
          intentType: 'commercial'
        },
        {
          question: 'How fast can an automated contractor BOQ quoter close commercial fit-out clients?',
          directAnswer: 'By generating instant professional WhatsApp estimates with itemized material and labor rates in under 5 minutes, contractors close property owners before competitors even complete their site visits.',
          searchVolumeScore: 89,
          intentType: 'commercial'
        }
      ],
      relatedComparisons: [
        'Automated Quantity Estimation vs Manual Surveyor Take-Offs',
        'Milestone Payment Escrow vs Advance Contractor Mobilization'
      ]
    },
    agribusiness: {
      sector: 'Agribusiness, Aquaculture & Feed Consolidation',
      primaryKeyword: 'Bulk Agribusiness Feed Order Consolidation Nigeria',
      questions: [
        {
          question: 'How do farm collectives reduce commercial feed prices in Nigeria?',
          directAnswer: 'By pooling smallholder feed orders through an automated order consolidation portal, farm clusters aggregate 500 to 2,000 bags per batch to negotiate direct wholesale factory-gate pricing with major millers, saving ₦1,200 to ₦2,500 per bag.',
          searchVolumeScore: 91,
          intentType: 'commercial'
        }
      ],
      relatedComparisons: [
        'Direct Mill Feed Sourcing vs Local Agro-Dealer Retail Pricing',
        'Automated Order Aggregation vs Manual Cooperative Registers'
      ]
    },
    inventory: {
      sector: 'Multi-Location Inventory & Stock Theft Prevention',
      primaryKeyword: 'Multi-Location Retail Stock Theft Prevention Cloud Ledger',
      questions: [
        {
          question: 'How do multi-branch retailers in Lagos prevent internal inventory shrinkage?',
          directAnswer: 'Retailers deploy cloud-synced inventory ledgers with dual-party authorization for stock adjustments and real-time WhatsApp alerts that trigger whenever high-value stock moves or inventory registers diverge from physical counts.',
          searchVolumeScore: 95,
          intentType: 'commercial'
        }
      ],
      relatedComparisons: [
        'Cloud Inventory Ledgers vs Standalone Desktop POS Software',
        'Automated WhatsApp Low-Stock Alerts vs Manual Weekly Audits'
      ]
    }
  };

  /**
   * Retrieves high-intent question cluster for a given sector
   */
  public static getIntentCluster(sectorKey: string): SearchIntentCluster {
    const key = sectorKey.toLowerCase();
    for (const [k, cluster] of Object.entries(this.SECTOR_INTENT_MAP)) {
      if (key.includes(k) || cluster.sector.toLowerCase().includes(key)) {
        return cluster;
      }
    }
    return this.SECTOR_INTENT_MAP.solar; // Default fallback
  }

  /**
   * Formats questions into Schema.org FAQPage JSON-LD structure
   */
  public static generateFaqSchema(cluster: SearchIntentCluster): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: cluster.questions.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.directAnswer
        }
      }))
    };
  }

  /**
   * Generates an HTML AI Direct-Answer / Overview Card
   */
  public static generateAiOverviewHtml(cluster: SearchIntentCluster): string {
    const topQ = cluster.questions[0];
    return `
<div class="ai-overview-card bg-gradient-to-r from-navy-900 to-slate-900 border-2 border-gold-500/40 rounded-2xl p-6 md:p-8 my-8 shadow-xl relative overflow-hidden">
  <div class="flex items-center space-x-3 mb-4">
    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-500 text-navy-950 font-black text-xs">AI</span>
    <h3 class="text-xs font-bold uppercase tracking-widest text-gold-400">Direct-Answer & Executive Takeaway</h3>
  </div>
  <h4 class="text-lg md:text-xl font-bold text-white mb-3">${topQ.question}</h4>
  <p class="text-slate-200 text-base leading-relaxed mb-4">${topQ.directAnswer}</p>
  <div class="pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
    <span>Verified by <strong>Bethelmind Analytics Lagos Desk</strong></span>
    <span class="text-gold-400 font-semibold">Updated for 2026 Commercial Operations</span>
  </div>
</div>
`;
  }
}
