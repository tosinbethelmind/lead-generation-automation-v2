import type { ServiceCategoryKey } from './brandIdentity';

export interface ServiceDetailDefinition {
  slug: string;
  serviceKey: ServiceCategoryKey;
  title: string;
  shortTitle: string;
  headline: string;
  problemSolved: string;
  summary: string;
  features: string[];
  howItWorks: { step: string; title: string; detail: string }[];
  faqs: { q: string; a: string }[];
  complianceNote?: string;
  ctaLabel: string;
}

export const SERVICE_DEFINITIONS: ServiceDetailDefinition[] = [
  {
    slug: 'business-website-development',
    serviceKey: 'website',
    title: 'Business Website Development',
    shortTitle: 'Business Websites',
    headline: 'Turn Google Searches and Ad Clicks Into Qualified Business Enquiries',
    problemSolved:
      'Many Nigerian businesses rely only on social media pages or directory listings, losing customers who search Google for a credible, official company website with clear pricing and instant contact options.',
    summary:
      'Mobile-first business landing pages, corporate websites, and e-commerce platforms built for fast loading on Nigerian Android networks with WhatsApp integration, enquiry capture, and SEO foundations.',
    features: [
      'Professional mobile-friendly websites & business landing pages',
      'Multi-page corporate websites & e-commerce stores',
      'Direct WhatsApp click-to-chat & structured enquiry forms',
      'On-page SEO foundations & Google Search indexing setup',
      'Optional website maintenance & content update plans',
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Scope & Package Selection',
        detail: 'Choose a package or request a custom quote based on your business pages, features, and timeline.',
      },
      {
        step: '02',
        title: 'Deposit & Build',
        detail: 'Pay the agreed initial deposit and share your business profile, logo, and service list.',
      },
      {
        step: '03',
        title: 'Staging Review & Launch',
        detail: 'Test your live staging website on your phone, request agreed revisions, and complete balance before final handover.',
      },
    ],
    faqs: [
      {
        q: 'How long does it take to build a business website?',
        a: 'Typical turnaround ranges from 3–5 business days for a Business Launch page to 7–14 business days for advanced builds, depending on prompt receipt of your business content and agreed scope.',
      },
      {
        q: 'Are domain and hosting charges included?',
        a: 'Domain registration and hosting terms are stated clearly in your package deliverables or quotation before you pay any deposit.',
      },
      {
        q: 'Can I update prices or request maintenance later?',
        a: 'Yes. Optional monthly maintenance plans are available and billed separately from your one-time setup fee.',
      },
    ],
    ctaLabel: 'Get a Business Website',
  },
  {
    slug: 'whatsapp-sales-automation',
    serviceKey: 'whatsapp',
    title: 'WhatsApp Sales Automation',
    shortTitle: 'WhatsApp Automation',
    headline: 'Respond to Customer Enquiries Faster and Capture Every Sales Lead',
    problemSolved:
      'Slow manual replies on WhatsApp cause prospective buyers to move on to competitors. Businesses also lose track of who asked for prices, who needs follow-up, and which enquiries converted.',
    summary:
      'Structured WhatsApp Business enquiry handling with automated FAQs, product/service information, lead qualification, human-agent handover, follow-up workflows, and enquiry records.',
    features: [
      'Automated FAQs & instant product/service information',
      'Customer enquiry capture & structured lead qualification',
      'Seamless human-agent handover for complex negotiations',
      'Scheduled follow-up workflows & sales enquiry records',
      'Opt-in and opt-out compliance logging',
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Workflow Mapping',
        detail: 'We document your top customer questions, pricing tiers, and qualification rules.',
      },
      {
        step: '02',
        title: 'Compliant Setup & Testing',
        detail: 'We configure your WhatsApp routing, FAQ flows, human handover triggers, and enquiry database.',
      },
      {
        step: '03',
        title: 'Go-Live & Usage Monitoring',
        detail: 'Your team monitors qualified enquiries while automated responses handle routine questions within agreed usage limits.',
      },
    ],
    faqs: [
      {
        q: 'Are there recurring costs for WhatsApp automation?',
        a: 'Yes. In addition to the one-time setup fee, WhatsApp Business API messaging fees, cloud hosting, and optional AI token usage incur recurring monthly costs. Usage limits and monthly maintenance fees are clearly stated before setup.',
      },
      {
        q: 'Is automation unlimited?',
        a: 'No. Every plan specifies clear monthly conversation, messaging, and AI usage limits so your operating costs remain predictable.',
      },
      {
        q: 'Can my staff take over a chat at any time?',
        a: 'Yes. Human-agent handover is built in so your sales team can step into any conversation seamlessly.',
      },
    ],
    complianceNote:
      'Recurring API, hosting, messaging, and AI usage fees apply based on your selected plan and message volume. We do not offer unlimited messaging without defined usage limits.',
    ctaLabel: 'Automate WhatsApp Enquiries',
  },
  {
    slug: 'google-business-profile',
    serviceKey: 'gbp',
    title: 'Google Business Profile Services',
    shortTitle: 'Google Business Profile',
    headline: 'Help Local Customers Find and Contact Your Business on Google',
    problemSolved:
      'Incomplete, unverified, or poorly structured Google Business Profiles make legitimate Nigerian businesses invisible or untrustworthy when nearby customers search on Google Search and Google Maps.',
    summary:
      'Complete Google Business Profile setup, optimisation, accurate business information updates, service/product listings, review management guidance, and local visibility improvements.',
    features: [
      'Business profile setup & verification guidance',
      'Category, service area, and business description optimisation',
      'Structured product and service catalogue listings',
      'Business hours, phone, WhatsApp, and website link updates',
      'Practical customer review request & response guidance',
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Profile Audit & Info Gathering',
        detail: 'We review your existing listing (or prepare a new one) and collect verified address, categories, and service details.',
      },
      {
        step: '02',
        title: 'Profile Optimisation',
        detail: 'We structure your services, products, business attributes, and local keywords in line with Google guidelines.',
      },
      {
        step: '03',
        title: 'Handover & Review Playbook',
        detail: 'You receive full ownership plus a practical guide for gathering genuine customer reviews and keeping details current.',
      },
    ],
    faqs: [
      {
        q: 'Do you guarantee #1 ranking on Google?',
        a: 'No. Google search rankings depend on many factors including proximity, competition, and genuine customer activity. We follow best-practice optimisation to improve your local visibility without making unrealistic ranking guarantees.',
      },
      {
        q: 'Will I own my Google Business Profile?',
        a: 'Yes. Your business retains primary ownership and full administrative control of the profile.',
      },
    ],
    complianceNote:
      'We improve profile completeness and local search readiness following Google Business Profile guidelines. Specific ranking positions are never guaranteed.',
    ctaLabel: 'Optimise My Google Profile',
  },
  {
    slug: 'b2b-lead-generation',
    serviceKey: 'lead_gen',
    title: 'B2B Lead Generation',
    shortTitle: 'B2B Lead Generation',
    headline: 'Reach Verified Nigerian Businesses in Your Target Industry and Location',
    problemSolved:
      'Sales teams waste weeks manually searching directories and social media for business contacts, often ending up with outdated phone numbers and unverified prospects.',
    summary:
      'Target-market identification, industry-specific business research, public business contact discovery, phone/email verification, and structured spreadsheets delivered in agreed quantities.',
    features: [
      'Target-market & ideal customer profile definition',
      'Industry-specific Nigerian business research',
      'Public business contact discovery (phone, email, location)',
      'Verification checks to filter inactive or invalid numbers',
      'Clean Excel/CSV spreadsheets delivered in agreed lead volumes',
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Define Target Criteria',
        detail: 'Specify your target industry, Nigerian states/cities, and required lead volume.',
      },
      {
        step: '02',
        title: 'Research & Verification',
        detail: 'We compile publicly listed commercial business contacts and run format and reachability checks.',
      },
      {
        step: '03',
        title: 'Structured Delivery',
        detail: 'Receive your verified B2B spreadsheet ready for your sales outreach team.',
      },
    ],
    faqs: [
      {
        q: 'Where do the business contacts come from?',
        a: 'We research publicly available business directories, corporate listings, and commercial profiles in compliance with applicable Nigerian data privacy and direct-marketing standards.',
      },
      {
        q: 'Can I choose specific states and industries?',
        a: 'Yes. Pricing and delivery timelines are configured by lead volume, target industry, and geographical coverage.',
      },
    ],
    complianceNote:
      'All B2B lead research uses publicly available commercial business information in line with applicable privacy and direct-marketing requirements. We never sell illegally obtained personal data.',
    ctaLabel: 'Order Verified B2B Leads',
  },
  {
    slug: 'business-intelligence-analytics',
    serviceKey: 'bi_analytics',
    title: 'Business Intelligence & Analytics',
    shortTitle: 'BI & Analytics',
    headline: 'Make Confident Decisions With Clear Sales, Expense and Market Data',
    problemSolved:
      'Business owners often make pricing, inventory, and expansion decisions based on guesswork because sales records, expenses, and competitor data are scattered across notebooks and spreadsheets.',
    summary:
      'Actionable sales performance dashboards, expense analysis, competitor benchmarking, structured business reporting, data visualisation, and decision-support reports.',
    features: [
      'Sales performance & revenue trend dashboards',
      'Operating expense & margin breakdown analysis',
      'Competitor pricing & positioning research',
      'Clear Excel/PDF executive reports & visualisations',
      'Practical decision-support walkthroughs',
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Data & Objective Review',
        detail: 'We review your business questions and available sales/expense records or market scope.',
      },
      {
        step: '02',
        title: 'Cleaning & Analysis',
        detail: 'We structure your data, build visual dashboards or competitor matrices, and document key findings.',
      },
      {
        step: '03',
        title: 'Report Delivery & Walkthrough',
        detail: 'Receive your dashboard or executive report with clear, practical next steps for your management team.',
      },
    ],
    faqs: [
      {
        q: 'What if my business records are messy spreadsheets?',
        a: 'That is common. We clean and structure your existing Excel, POS, or bank export records as part of the engagement.',
      },
      {
        q: 'Is my financial data kept confidential?',
        a: 'Yes. Client data is treated as strictly confidential and used solely to prepare your agreed reports.',
      },
    ],
    ctaLabel: 'Request Analytics & BI',
  },
  {
    slug: 'strategy-business-consulting',
    serviceKey: 'strategy',
    title: 'Strategy & Business Consulting',
    shortTitle: 'Strategy & Consulting',
    headline: 'Strengthen Your Pricing, Business Model and Growth Plan',
    problemSolved:
      'Growing SMEs and startups frequently struggle with under-pricing, unclear unit economics, weak investment proposals, or expansion plans without market validation.',
    summary:
      'Practical pricing strategy, business model review, structured business plans and investment proposals, growth roadmaps, and market research tailored to Nigerian operating realities.',
    features: [
      'Pricing strategy & margin structure review',
      'Business model evaluation & operational bottleneck review',
      'Structured business plans & investment/bank proposals',
      'Practical market research & go-to-market planning',
      '1-on-1 executive strategy sessions',
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Discovery Session',
        detail: 'We assess your current business model, pricing, cost structure, and growth objectives.',
      },
      {
        step: '02',
        title: 'Research & Financial Modelling',
        detail: 'We benchmark local market conditions and structure realistic financial projections and strategy options.',
      },
      {
        step: '03',
        title: 'Documented Plan & Review',
        detail: 'Receive your tailored strategy document or proposal and review implementation milestones with our team.',
      },
    ],
    faqs: [
      {
        q: 'Do you guarantee bank loan or investor funding approval?',
        a: 'No. Funding decisions rest solely with lenders and investors. We prepare rigorous, realistic, well-structured business plans and financial models that strengthen your presentation.',
      },
      {
        q: 'Why is pricing listed as "Request a Custom Quote"?',
        a: 'Consulting scope varies significantly between a single pricing review and a full multi-year investment proposal. We assess your exact needs first so you only pay for what you require.',
      },
    ],
    complianceNote:
      'We provide evidence-based strategy, financial modelling, and advisory support. We do not guarantee funding approval, investment, or specific percentage sales growth.',
    ctaLabel: 'Book Strategy Consultation',
  },
];

export function getServiceDefinitionBySlug(slug: string): ServiceDetailDefinition | undefined {
  return SERVICE_DEFINITIONS.find((s) => s.slug === slug);
}
