/**
 * @file src/lib/trafficAutomationMaster.ts
 * 
 * Bethelmind Analytics Autonomous Multi-Channel Traffic Generation Master Engine.
 * 
 * Automates high-converting traffic funnels across:
 * 1. Google Search & Programmatic SEO (Exact-match keyword sets & landing pages)
 * 2. Diaspora Channels (Nairaland BBCode threads, UK/US/CA Nigerian Facebook groups)
 * 3. Viral Short-Form Video Breakdown Scripts (YouTube Shorts / TikTok / Reels)
 * 4. LinkedIn & Twitter B2B Growth Case Studies
 * 5. Daily WhatsApp Channel & Community Broadcast Swipes
 */

import { ALL_PRODUCTS_DATA, ProductItem } from './productsData';
import { submitUrlToGoogleIndexing } from './googleIndexing';
import { getRuntimeConfig } from './localConfig';

export interface GeneratedTrafficPackage {
  productId: string;
  productTitle: string;
  category: string;
  targetAudience: string;
  selarUrl: string;
  whatsappDeskUrl: string;
  directStoreUrl: string;
  nairalandPost: {
    section: string;
    threadTitle: string;
    bbcodeContent: string;
  };
  diasporaFacebookPost: {
    targetGroups: string[];
    headline: string;
    body: string;
  };
  twitterThread: {
    tweetCount: number;
    tweets: string[];
  };
  shortFormVideoScript: {
    duration: string;
    hook0to3s: string;
    bRollVisuals: string;
    problemDemo: string;
    solutionBreakdown: string;
    ctaAndPinnedComment: string;
  };
  b2bLinkedInPost: {
    hook: string;
    content: string;
    hashtags: string[];
  };
  googleAdsCampaign: {
    campaignName: string;
    targetLocations: string[];
    headlines: string[];
    descriptions: string[];
    exactMatchKeywords: string[];
    phraseMatchKeywords: string[];
    negativeKeywords: string[];
  };
  whatsappBroadcast: {
    broadcastTime: string;
    messageText: string;
  };
}

export const DIASPORA_FACEBOOK_GROUPS = [
  'Nigerians in the UK (London, Manchester, Birmingham)',
  'Nigerians in the US (Texas, Atlanta, Maryland, New York)',
  'Nigerians in Canada (Toronto, Calgary, Edmonton Japa Network)',
  'Nigerian Real Estate & Diaspora Investors Forum',
  'Lagos Business Owners & Entrepreneurs Hub'
];

export const NAIRALAND_SECTIONS = [
  { id: 'properties', name: 'Properties & Real Estate' },
  { id: 'investments', name: 'Investments & Business' },
  { id: 'car-talk', name: 'Car Talk & Auto Imports' },
  { id: 'travel', name: 'Travel & Relocation (Japa)' },
  { id: 'tech', name: 'Webmasters & Tech Startups' }
];

/**
 * Generate a complete, ready-to-dispatch traffic generation package for any digital product.
 */
export function generateTrafficPackageForProduct(product: ProductItem, baseUrl: string = 'https://www.bethelmindanalytics.com'): GeneratedTrafficPackage {
  const storeUrl = `${baseUrl}/store?product=${product.id}&utm_source=traffic_engine`;
  const selarUrl = `https://selar.com/showlove/bethelmind?currency=NGN&item=${product.id}&amount=${product.prices.NGN}`;
  const prefilledWaMsg = encodeURIComponent(`Hello Bethelmind Desk, I saw your post on "${product.title}" and would like to claim my copy / speak with a specialist.`);
  const whatsappDeskUrl = `https://wa.me/2348022791227?text=${prefilledWaMsg}`;

  // 1. Nairaland BBCode Post Generator
  let nlSection = 'investments';
  if (product.category === 'land' || product.category === 'diaspora') nlSection = 'properties';
  else if (product.category === 'trade' && product.id.includes('auto')) nlSection = 'car-talk';
  else if (product.category === 'fintech' && product.id.includes('relocation')) nlSection = 'travel';
  else if (product.category === 'ai' || product.category === 'fintech') nlSection = 'tech';

  const nairalandPost = {
    section: nlSection,
    threadTitle: `[URGENT GUIDE 2026] ${product.title} (How to Avoid Costly Mistakes)`,
    bbcodeContent: `[b][size=14pt]⚠️ CRITICAL UPDATE FOR LAGOS & DIASPORA BUSINESS INVESTORS (2026)[/size][/b]

[b]Topic:[/b] ${product.title}
[b]Targeted At:[/b] ${product.whoIsThisFor}

${product.longDesc}

[b][size=12pt]📌 WHAT MOST PEOPLE GET WRONG IN NIGERIA:[/size][/b]
• Making major financial commitments without institutional verification.
• Relying on third-party middlemen who inflate bills by 40%–70%.
• Lacking legal retention agreements and indemnities before transferring money.

[b][size=12pt]🛡️ KEY ACTIONABLE DELIVERABLES INCLUDED IN THIS DOSSIER:[/size][/b]
${product.deliverablesList.map(d => `✔ ${d}`).join('\n')}

[b]Financial Impact / ROI:[/b] ${product.roiHook}

[b][size=12pt]🚀 HOW TO GET INSTANT ACCESS TO THE FULL PACK:[/size][/b]
👉 [b]Official Direct Access:[/b] [url=${storeUrl}]${storeUrl}[/url]
👉 [b]Instant Checkout on Selar:[/b] [url=${selarUrl}]${selarUrl}[/url]
👉 [b]1-Tap WhatsApp Desk (0802 279 1227):[/b] [url=${whatsappDeskUrl}]Chat With Our Verification Team On WhatsApp[/url]

[i]Dispatched by Bethelmind Analytics Lagos Due-Diligence Desk.[/i]`
  };

  // 2. Diaspora Facebook & Community Post Generator
  const diasporaFacebookPost = {
    targetGroups: DIASPORA_FACEBOOK_GROUPS,
    headline: `🚨 ATTENTION UK, US & CANADA NIGERIANS: Before you send money for ${product.title.split(' ')[0]} in Lagos, read this.`,
    body: `If you are in the Diaspora building, investing, or running a business back home in Nigeria, here is the harsh reality:

${product.longDesc}

Here is what our field and legal audit team compiled for you:
${product.highlights.map(h => `✅ ${h}`).join('\n')}

💡 Financial Impact: ${product.roiHook}

Get instant access to the verified toolkit and contracts below:
🔗 Official Store: ${storeUrl}
💳 Instant Card/Transfer on Selar: ${selarUrl}
💬 Speak directly with our Lagos Closer & Due-Diligence Desk on WhatsApp: https://wa.me/2348022791227

#Diaspora #NigeriansInUK #NigeriansInUSA #LagosRealEstate #BethelmindAnalytics #SmartInvesting`
  };

  // 3. Twitter / X Mega-Thread Generator (5 Tweets)
  const twitterThread = {
    tweetCount: 5,
    tweets: [
      `1/5 🧵 70% of business and property investors lose millions in Nigeria due to simple due-diligence blindspots.\n\nHere is the exact breakdown for ${product.title} (and how to protect your capital in 2026): 👇`,
      `2/5 The Problem:\n${product.shortDesc}\n\nMiddlemen and unverified vendors exploit the lack of transparent contracts and engineering data to overcharge by 40%-70%.`,
      `3/5 What our Lagos field & legal due-diligence audit verified:\n${product.highlights.map(h => `• ${h}`).join('\n')}`,
      `4/5 💡 The Real ROI:\n${product.roiHook}\n\nHaving the right statutory documents and spreadsheets before transferring money saves months of frustration.`,
      `5/5 📥 Get the full deployment toolkit, verified contracts & spreadsheets:\n\n👉 Official Direct Store: ${storeUrl}\n👉 Instant Checkout on Selar: ${selarUrl}\n👉 Direct WhatsApp Inquiries: ${whatsappDeskUrl}\n\n#BethelmindAnalytics #NigeriaBusiness #DiasporaInvestments`
    ]
  };

  // 4. Short-Form Video Script (YouTube Shorts / TikTok / Reels)
  const shortFormVideoScript = {
    duration: '35 - 45 Seconds',
    hook0to3s: `🎬 [POINTING TO PHONE SCREEN - TEXT ON SCREEN: "DO NOT PAY BEFORE WATCHING THIS"]\n"If you are about to pay for ${product.title.split(' ')[0]} in Lagos, stop scrolling right now."`,
    bRollVisuals: `• 0-3s: Fast zoom-in on red warning banner / smartphone invoice.\n• 4-15s: B-roll of Lagos traffic / construction site / spreadsheet calculations.\n• 16-30s: Screen recording scrolling through the verified PDF contract and dynamic calculator.\n• 31-45s: 1-tap WhatsApp DM screen and instant Selar download button.`,
    problemDemo: `[4-18s PROBLEM DEMONSTRATION]\n"${product.shortDesc} Most people lose millions because they don't know the exact verification parameters."`,
    solutionBreakdown: `[19-35s THE PROVEN SOLUTION]\n"Here is how we solve it: ${product.highlights.slice(0, 2).join('. ')}. It protects your money 100%."`,
    ctaAndPinnedComment: `[36-45s CALL TO ACTION]\n"Download the complete verified pack in my bio or comment 'SEND' and I'll DM you the direct download link right now!"\n\n📌 PINNED COMMENT:\n🎁 Claim your verified ${product.title} here:\n👉 Direct Store: ${storeUrl}\n👉 WhatsApp Desk: ${whatsappDeskUrl}`
  };

  // 5. B2B LinkedIn Post
  const b2bLinkedInPost = {
    hook: `Most commercial investment losses in Nigeria aren't bad luck — they are due-diligence blindspots. 📊`,
    content: `When assessing ${product.title.toLowerCase()}, the cost of assumptions is devastating.

${product.longDesc}

Our institutional framework solves this through 4 critical layers:
${product.deliverablesList.map((d, i) => `${i + 1}. ${d}`).join('\n')}

📈 ROI Benchmark: ${product.roiHook}

We've packaged this into an instant deployment toolkit for founders, investors, and operations leaders.

Explore the complete due-diligence package here: ${storeUrl}

How does your team handle due-diligence and risk mitigation for Nigerian operations? Let's discuss in the comments. 👇`,
    hashtags: ['#NigeriaBusiness', '#DueDiligence', '#BethelmindAnalytics', '#RiskManagement', '#SMEGrowth', '#InvestmentSecurity']
  };

  // 6. Google Ads Campaign Kit
  const googleAdsCampaign = {
    campaignName: `Bethelmind_Search_${product.id.toUpperCase()}_HighIntent`,
    targetLocations: ['Lagos, Nigeria', 'Abuja, Nigeria', 'United Kingdom', 'United States', 'Canada'],
    headlines: [
      product.title.length > 30 ? product.title.substring(0, 27) + '...' : product.title,
      'Verified Due-Diligence Kit',
      'Download Instantly Today',
      '100% Safe & Tested Blueprint',
      'Bethelmind Analytics Lagos'
    ],
    descriptions: [
      product.shortDesc.length > 90 ? product.shortDesc.substring(0, 87) + '...' : product.shortDesc,
      `Instant download with templates & checklists. Protect your investments. Claim now!`,
      `Verified contracts, ROI models, and direct contacts. 24/7 Lagos WhatsApp support.`
    ],
    exactMatchKeywords: [
      `[${product.title.toLowerCase()}]`,
      `[buy ${product.id.replace('-', ' ')} nigeria]`,
      `[best ${product.id.replace('-', ' ')} guide 2026]`
    ],
    phraseMatchKeywords: [
      `"${product.id.replace('-', ' ')} lagos"`,
      `"how to get ${product.id.replace('-', ' ')} nigeria"`,
      `"verified ${product.id.replace('-', ' ')} blueprint"`
    ],
    negativeKeywords: ['free torrent', 'crack download', 'job vacancy', 'salary', 'wikipedia']
  };

  // 7. WhatsApp Channel & Community Broadcast Swipes
  const whatsappBroadcast = {
    broadcastTime: '10:00 AM WAT (Prime Engagement Window)',
    messageText: `⚡ *BETHELMIND DAILY VALUE DROP: ${product.title.toUpperCase()}* ⚡

Are you tired of losing money or guessing your numbers in Nigeria?

Here is our battle-tested due-diligence checklist:
${product.highlights.map(h => `▫️ ${h}`).join('\n')}

💰 *Financial Impact:* ${product.roiHook}

📥 *Claim your complete pack with editable contracts & spreadsheets:*
👉 *Direct Link:* ${storeUrl}
👉 *Instant Selar Checkout:* ${selarUrl}

Need assistance? Reply directly to this message or chat with our Closer Desk at *0802 279 1227*.`
  };

  return {
    productId: product.id,
    productTitle: product.title,
    category: product.category,
    targetAudience: product.whoIsThisFor,
    selarUrl,
    whatsappDeskUrl,
    directStoreUrl: storeUrl,
    nairalandPost,
    diasporaFacebookPost,
    twitterThread,
    shortFormVideoScript,
    b2bLinkedInPost,
    googleAdsCampaign,
    whatsappBroadcast
  };
}

/**
 * Generate traffic packages for all 16 digital products.
 */
export function generateAllTrafficPackages(baseUrl?: string): GeneratedTrafficPackage[] {
  return ALL_PRODUCTS_DATA.map(prod => generateTrafficPackageForProduct(prod, baseUrl));
}

/**
 * Execute automated Google Indexing submission for all 16 digital asset URLs.
 */
export async function submitAllStoreProductsToGoogle(baseUrl: string = 'https://www.bethelmindanalytics.com'): Promise<{
  submittedCount: number;
  urls: string[];
}> {
  const submitted: string[] = [];
  const mainStoreUrl = `${baseUrl}/store`;
  try {
    await submitUrlToGoogleIndexing(mainStoreUrl, 'URL_UPDATED');
    submitted.push(mainStoreUrl);
  } catch (_) {}

  for (const prod of ALL_PRODUCTS_DATA) {
    const prodUrl = `${baseUrl}/store?product=${prod.id}`;
    try {
      await submitUrlToGoogleIndexing(prodUrl, 'URL_UPDATED');
      submitted.push(prodUrl);
    } catch (_) {}
  }

  return {
    submittedCount: submitted.length,
    urls: submitted
  };
}
