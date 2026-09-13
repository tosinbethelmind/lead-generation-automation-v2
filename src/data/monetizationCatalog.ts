/**
 * @file src/data/monetizationCatalog.ts
 * 
 * Centralized Monetization & Product Catalog for Bethelmind Analytics Lagos Desk
 * Consolidates VidRush Selar products, Gumroad vaults, YouTube channels, 
 * affiliate partners, and turnkey DFY prototype conversion funnels.
 */

export interface ProductOffer {
  id: string;
  niche: string;
  title: string;
  tagline: string;
  summary: string;
  priceNgn: string;
  priceUsd: string;
  checkoutUrl: string;
  type: 'selar_digital' | 'gumroad' | 'turnkey_prototype' | 'affiliate';
  badge?: string;
  features: string[];
}

export interface YouTubeEmbedChannel {
  channelName: string;
  niche: string;
  embedVideoId: string;
  watchUrl: string;
  channelUrl: string;
}

export const MASTER_PAYOUT = {
  bankName: 'OPay Digital Services',
  accountNumber: '7034297995',
  accountName: 'Oyelakin Tosin Matthew',
  whatsappCloser: 'https://wa.me/2348022791227',
  whatsappPhone: '+234 802 279 1227',
  adminEmail: 'bethelmindrecruit@gmail.com',
  website: 'https://www.bethelmindanalytics.com',
};

export const SELAR_DIGITAL_PRODUCTS: ProductOffer[] = [
  {
    id: 'da-b2bleadgen',
    niche: 'B2B Lead Generation & WhatsApp Automation',
    title: 'Bethelmind B2B LeadGen & WhatsApp Sales OS',
    tagline: 'Automate WhatsApp Sales & Scrape 5,000+ Verified Lagos B2B Business Leads!',
    summary: 'Interactive Lead ROI Web App, 5,000+ Verified Lagos B2B Business Directory, and Make.com 1-Click WhatsApp Bot Blueprint.',
    priceNgn: '₦44,000',
    priceUsd: '$29',
    checkoutUrl: 'https://selar.com/showlove/bethelmind?product=da-b2bleadgen',
    type: 'selar_digital',
    badge: 'BESTSELLER',
    features: [
      '5,000+ Verified Lagos Commercial Decision-Maker Leads',
      'Make.com 1-Click WhatsApp Bot & Webhook Blueprint',
      'Interactive HTML5 Lead ROI Calculator Web App',
      '100% Instant Digital Delivery via Selar',
    ]
  },
  {
    id: 'da-cleantech-vault',
    niche: 'CleanTech & Solar Energy Datasets',
    title: '500+ Verified CleanTech & Energy Decision Makers Vault',
    tagline: 'Audited, 100% SMTP-Verified Commercial Solar and Clean Energy Leaders Database',
    summary: 'Direct executive emails with 0% bounce guarantee, VP/C-level phone numbers, and revenue-sorted company profiles across Nigeria, US, and Europe.',
    priceNgn: '₦650,000',
    priceUsd: '$499',
    checkoutUrl: 'https://selar.com/7f767345z8',
    type: 'selar_digital',
    badge: 'ENTERPRISE ASSET',
    features: [
      '500+ Verified Solar EPC Developers, CleanTech VPs & CEOs',
      '100% Active SMTP Mailbox Handshake Verification (0% Bounce)',
      'Direct Mobile & WhatsApp Reachability Numbers',
      'Global Gumroad ($499) + Nigerian Selar (₦650,000) Checkout',
    ]
  },
  {
    id: 'da-aitools',
    niche: 'AI Tools & Tech',
    title: '2026 AI Video Automation & 500+ FLUX Prompt Matrix',
    tagline: 'Automate Content Distribution Across 5 Platforms With 1-Click Blueprints!',
    summary: '1-Click Make.com Scenario JSON Automation Blueprint, 500 FLUX 4K Prompts JSON Dataset, and CapCut Video Presets.',
    priceNgn: '₦14,000',
    priceUsd: '$9',
    checkoutUrl: 'https://selar.com/showlove/bethelmind?product=da-aitools',
    type: 'selar_digital',
    badge: 'POPULAR',
    features: [
      '1-Click Make.com Scenario JSON Automation Blueprint',
      '500 FLUX 4K High-Resolution Prompts JSON Dataset',
      'Top 20 Secret AI Tools Cheat Sheet PDF Freebie',
      'Multi-Currency Payment (USD, NGN, GBP, EUR)',
    ]
  },
  {
    id: 'da-solar',
    niche: 'Solar & Clean Energy',
    title: '2026 Solar ROI & Home Battery Savings Calculator OS',
    tagline: 'Calculate Exact Solar Panel & Battery ROI in 60 Seconds!',
    summary: 'Interactive Solar Savings Web App, Battery Storage Spreadsheet, and High-Converting Sales Script Pack.',
    priceNgn: '₦11,000',
    priceUsd: '$7',
    checkoutUrl: 'https://selar.com/showlove/bethelmind?product=da-solar',
    type: 'selar_digital',
    features: [
      'Interactive HTML5 Solar Savings Web App',
      'Battery Storage & Inverter Payback Spreadsheet',
      'Solar Installer Pitch Deck & Proposal Template',
      'High-Converting Outbound Sales Script Pack',
    ]
  },
  {
    id: 'da-finance',
    niche: 'Finance & Investing',
    title: '2026 Compound Growth & Dividend Operating System',
    tagline: 'Calculate Wealth Milestones, Automate Index Allocations & Monetize Finance Channels!',
    summary: 'Interactive HTML5 Compound Growth Calculator, Index Fund CSV Allocation Model, and 50 High-CPM Video Script Hooks.',
    priceNgn: '₦14,000',
    priceUsd: '$9',
    checkoutUrl: 'https://selar.com/showlove/bethelmind?product=da-finance',
    type: 'selar_digital',
    features: [
      'Interactive HTML5 Compound Growth Calculator Web App',
      'Index Fund CSV Allocation Financial Model',
      '50 High-CPM Finance Shorts Script Hooks',
      '1-Page Financial Freedom Roadmap PDF',
    ]
  },
  {
    id: 'da-realestate',
    niche: 'Real Estate Investing',
    title: '2026 Rental Property Cashflow & Cap-Rate Analyzer OS',
    tagline: 'Analyze Real Estate Deal Profitability & Cap Rates in Seconds!',
    summary: 'Interactive Property Yield Web App, Rental Valuation Spreadsheet, and Investor Pitch Deck.',
    priceNgn: '₦14,000',
    priceUsd: '$9',
    checkoutUrl: 'https://selar.com/showlove/bethelmind?product=da-realestate',
    type: 'selar_digital',
    features: [
      'Interactive Property Yield Web App',
      'Rental Valuation & Cap-Rate Model Spreadsheet',
      'Property Management SOP Checklist',
      'First Rental Property Buying Checklist PDF',
    ]
  },
  {
    id: 'da-faceless',
    niche: 'Faceless Content Creation',
    title: '2026 Ultimate Faceless Creator Viral Shorts Vault & B-Roll Engine',
    tagline: 'Publish High-Converting Faceless Videos 10x Faster with 4K Overlays & Script Hooks!',
    summary: '4K Stock Video Overlays, 100+ Viral SFX & Hooks, Motion Loop Graphics, CapCut Video Presets.',
    priceNgn: '₦22,000',
    priceUsd: '$15',
    checkoutUrl: 'https://selar.com/showlove/bethelmind?product=da-faceless',
    type: 'selar_digital',
    badge: 'VIRAL ASSET',
    features: [
      '4K Stock Video B-Roll Overlays & SFX Library',
      '100+ High-Retention Script Hooks & Transitions',
      'Motion Loop Graphics & CapCut Presets',
      'Faceless Creator Channel Monetization Blueprint',
    ]
  },
  {
    id: 'da-leadgen',
    niche: 'B2B Sales & High-Ticket Client Acquisition',
    title: '2026 B2B High-Ticket Lead Gen & Client Acquisition OS',
    tagline: 'Close $2,000 - $10,000 High-Ticket Clients With Plug-and-Play Outreach Systems!',
    summary: 'Cold Email Sequences, Client Closing Calculator Web App, Proposal Pitch Deck Template, CRM Pipeline Sheet.',
    priceNgn: '₦29,000',
    priceUsd: '$19',
    checkoutUrl: 'https://selar.com/showlove/bethelmind?product=da-leadgen',
    type: 'selar_digital',
    features: [
      'Battle-Tested Cold Email Sequence & Follow-Up Templates',
      'Client Closing Calculator Web App',
      'Proposal Pitch Deck Template & CRM Pipeline Sheet',
      '7-Step High-Ticket Client Closing Script PDF',
    ]
  }
];

export const GUMROAD_PRODUCTS = [
  {
    title: '500+ Verified CleanTech Decision Makers Vault (USD)',
    price: '$499.00 USD',
    url: 'https://bethelmind.gumroad.com/l/cleantech-leads-2026',
    description: 'Instant global download for international firms and enterprise outbound teams.',
  }
];

export const DFY_PROTOTYPE_OFFERS = [
  {
    id: 'dfu-turnkey-website',
    title: '100% Turnkey DFY Commercial Business Portal',
    priceDeposit: '₦75,000',
    priceFull: '₦150,000',
    turnaround: '48-Hour Guarantee',
    description: 'Custom domain, Google Maps SEO discovery, 24/7 AI WhatsApp Closer Bot, and Vercel cloud hosting.',
    ctaUrl: 'https://www.bethelmindanalytics.com/preview/claim',
    whatsappCta: 'https://wa.me/2348022791227?text=Hi+Bethelmind,+I+want+to+claim+a+100%+Turnkey+Business+Portal+Prototype'
  },
  {
    id: 'embed-upgrade',
    title: '1-Line Script Embed / Sector Tool Upgrade',
    priceDeposit: '₦35,000',
    priceFull: '₦65,000',
    turnaround: '10-Minute Installation',
    description: 'Embed 24/7 WhatsApp quote and booking widgets onto existing WordPress, Wix, or custom websites with zero server changes.',
    ctaUrl: 'https://www.bethelmindanalytics.com/embed/demo',
    whatsappCta: 'https://wa.me/2348022791227?text=Hi+Bethelmind,+I+want+the+1-Line+Script+Embed+Upgrade'
  }
];

export const YOUTUBE_CHANNELS: YouTubeEmbedChannel[] = [
  {
    channelName: 'Daily Wealth Pulse',
    niche: 'Finance & Investing',
    embedVideoId: 'cEEM6ZpODew',
    watchUrl: 'https://www.youtube.com/watch?v=cEEM6ZpODew',
    channelUrl: 'https://www.youtube.com/channel/UCTCMr1U6V4rAsZttCCsbhbQ'
  },
  {
    channelName: 'Tiny Learners 3D Cartoons',
    niche: 'Kids Educational Cartoons',
    embedVideoId: 'RvNphM3FVtA',
    watchUrl: 'https://www.youtube.com/watch?v=RvNphM3FVtA',
    channelUrl: 'https://www.youtube.com/channel/UCmHXUGoKfnYNiQBjClCTDXQ'
  },
  {
    channelName: 'AI Tool Genius',
    niche: 'AI Tools & Tech',
    embedVideoId: 'cEEM6ZpODew',
    watchUrl: 'https://www.youtube.com/channel/UCTrta7we_2gAI3eAaaYDqCA',
    channelUrl: 'https://www.youtube.com/channel/UCTrta7we_2gAI3eAaaYDqCA'
  }
];

export const AFFILIATE_OFFERS = [
  {
    partnerName: 'TradingView Pro',
    niche: 'finance',
    deal: '$30 Trading Bonus Credit',
    url: 'https://www.tradingview.com/?aff_id=vidrush_finance'
  },
  {
    partnerName: 'Make.com Automation Suite',
    niche: 'aitools',
    deal: '1,000 Free Operations Monthly',
    url: 'https://www.make.com/?fpr=vidrush_aitools'
  },
  {
    partnerName: 'SunPower Solar System',
    niche: 'solar',
    deal: '$1,000 Installation Cash Back',
    url: 'https://www.sunpower.com/?ref=vidrush_solar'
  },
  {
    partnerName: 'DealMachine Real Estate App',
    niche: 'realestate',
    deal: '7-Day Free Trial + 100 Free Property Leads',
    url: 'https://www.dealmachine.com/?ref=vidrush_realestate'
  }
];
