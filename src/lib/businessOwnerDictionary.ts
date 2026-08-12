/**
 * Business Owner Plain-English Dictionary & Selling Narrative
 * Translates technical marketing & tracking terms into clear business value copy and highlights zero-code app compatibility.
 */

export interface ToolExplanation {
  id: string;
  techName: string;
  businessName: string;
  salesPitchHook: string; // Core sales narrative hook
  category: 'growth' | 'conversion' | 'automation';
  shortSummary: string;
  roiBadge: string;
  compatibleApps: string[]; // Common tools business owners already use
  explanation: string;
  beforeVsAfter: {
    before: string;
    after: string;
  };
  addonPriceNGN: number;
}

export const BUSINESS_OWNER_TOOL_DICTIONARY: Record<string, ToolExplanation> = {
  meta_capi: {
    id: 'meta_capi',
    techName: 'Meta Conversions API (CAPI) & GA4 Proxy',
    businessName: '🛡️ Anti-Adblock Buyer Tracker',
    salesPitchHook: 'Plugs directly into your Facebook & Instagram Ad Account in 60 seconds.',
    category: 'growth',
    shortSummary: 'Captures 100% of buyers that Safari, iPhones, and ad-blockers hide from your Facebook Ads.',
    roiBadge: '+25% Ad Attribution Accuracy',
    compatibleApps: ['Facebook Ads Manager', 'Instagram Ads', 'Google Analytics 4', 'Shopify'],
    explanation: 'Modern smartphones and web browsers block normal Facebook Pixels. This tool sends purchase signals directly from your web server to Facebook, ensuring every single lead and sale is credited so your ads get smarter faster.',
    beforeVsAfter: {
      before: 'Facebook misses up to 40% of sales made on iPhones, wasting your ad budget.',
      after: '100% of buyer conversions are reported to Meta so your cost per lead drops.'
    },
    addonPriceNGN: 45000,
  },

  journey_analytics: {
    id: 'journey_analytics',
    techName: 'Customer Journey DOM Mutation Analytics',
    businessName: '👁️ Visitor Screen Replay & Heatmap',
    salesPitchHook: 'Works instantly on any website (WordPress, Shopify, Wix, or Custom HTML).',
    category: 'conversion',
    shortSummary: 'Watch video-style replays of how buyers navigate your site and where they get confused.',
    roiBadge: 'Fix Hidden Conversion Leaks',
    compatibleApps: ['WordPress', 'Elementor', 'Shopify', 'Wix', 'Google Chrome'],
    explanation: 'Ever wonder why people visit your site but leave without buying? This tool records mouse movements, button clicks, and scroll depth so you can pinpoint exact spots where customers hesitate.',
    beforeVsAfter: {
      before: 'You guess why visitors bounce without buying.',
      after: 'You see exact video recordings of user confusion and fix friction points in minutes.'
    },
    addonPriceNGN: 35000,
  },

  facebook_ads_dashboard: {
    id: 'facebook_ads_dashboard',
    techName: 'Meta Marketing API Insights Connector',
    businessName: '📊 Ad Spend & Profit Dashboard',
    salesPitchHook: 'Zero migration! Replaces complex ad manager tables with 1-click WhatsApp profit alerts.',
    category: 'growth',
    shortSummary: 'Shows exactly how much money you spend on ads vs. how much net profit each ad campaign makes.',
    roiBadge: 'Stop Wasting Ad Money',
    compatibleApps: ['Facebook Ads', 'WhatsApp', 'Google Sheets', 'Paystack'],
    explanation: 'Calculates your Cost Per Lead (CPL) and Return On Ad Spend (ROAS) in real time. It automatically alerts you when an ad is underperforming so you can pause losing campaigns.',
    beforeVsAfter: {
      before: 'Confusing Facebook Ads Manager dashboards with complicated metrics.',
      after: 'Clear green/red indicators showing which ads generate profit vs. loss.'
    },
    addonPriceNGN: 45000,
  },

  email_drip: {
    id: 'email_drip',
    techName: 'Behavioral Transactional & Marketing Drip Engine',
    businessName: '✉️ Hands-Free Auto Follow-Up Emailer',
    salesPitchHook: 'Syncs 1-click with Mailchimp, SendGrid, Gmail, or your custom business email.',
    category: 'automation',
    shortSummary: 'Automatically emails new leads welcome offers, testimonials, and reminders while you sleep.',
    roiBadge: '+35% Lead Conversion',
    compatibleApps: ['Mailchimp', 'SendGrid', 'Resend', 'Gmail', 'Outlook'],
    explanation: '80% of sales require 5 follow-up contacts. This engine automatically sends timed, personalized emails to prospects after they submit a form, nurturing them into paying clients without manual work.',
    beforeVsAfter: {
      before: 'Manual emailing or forgotten leads after initial contact.',
      after: 'Automated 7-day follow-up sequence running 24/7 in the background.'
    },
    addonPriceNGN: 75000,
  },

  ai_lead_scoring: {
    id: 'ai_lead_scoring',
    techName: 'Predictive Machine Learning Lead Qualifier',
    businessName: '🎯 Hot Buyer Radar',
    salesPitchHook: 'Pushes high-priority VIP buyers straight to your Google Sheets & WhatsApp phone.',
    category: 'conversion',
    shortSummary: 'Ranks your leads 0–100 so your sales team calls high-spending VIP customers first.',
    roiBadge: 'Double Sales Team Efficiency',
    compatibleApps: ['Google Sheets', 'HubSpot', 'Zoho CRM', 'WhatsApp'],
    explanation: 'Uses AI to evaluate lead responses, company size, and urgency. It highlights high-ticket buyers so your team focuses energy on prospects ready to pay immediately.',
    beforeVsAfter: {
      before: 'Sales reps waste hours calling low-budget tire kickers.',
      after: 'Sales reps call 90+ score VIP buyers first, closing deals twice as fast.'
    },
    addonPriceNGN: 55000,
  },

  whatsapp_bot: {
    id: 'whatsapp_bot',
    techName: 'Baileys / Twilio WhatsApp Webhook Automation',
    businessName: '🤖 24/7 WhatsApp Auto-Responder Bot',
    salesPitchHook: 'Connects to your personal or business WhatsApp number in 1 tap.',
    category: 'automation',
    shortSummary: 'Instantly answers customer inquiries and books appointments inside WhatsApp 24/7.',
    roiBadge: 'Instant Customer Reply',
    compatibleApps: ['WhatsApp Business', 'Google Calendar', 'Paystack', 'Moniepoint DVA'],
    explanation: 'Connects your website directly to WhatsApp. When a lead submits an inquiry, the bot instantly replies, provides quotes, and collects details straight to your phone.',
    beforeVsAfter: {
      before: 'Leads wait hours for a reply and leave for competitors.',
      after: 'Instant sub-second WhatsApp responses with interactive buttons.'
    },
    addonPriceNGN: 95000,
  },
};
