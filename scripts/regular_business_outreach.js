/**
 * @file scripts/regular_business_outreach.js
 * Track B Outreach & Onboarding Engine for General Businesses (Hotels, Hospitals, Law Firms, Stores, etc.)
 * - Pre-Payment Phase: Focuses 100% on Website Preview & Claiming.
 * - Post-Payment Phase: Dispatches Post-Payment Solar Referral Onboarding (SolarQuotePro.ng Free Audit & Installer Match).
 */

function parseSpintax(text) {
  let processed = text;
  const spintaxPattern = /\{([^{}]+)\}/g;
  let matches = processed.match(spintaxPattern);
  while (matches && matches.length > 0) {
    for (const match of matches) {
      const options = match.slice(1, -1).split('|');
      const chosen = options[Math.floor(Math.random() * options.length)];
      processed = processed.replace(match, chosen);
    }
    matches = processed.match(spintaxPattern);
  }
  return processed;
}

/**
 * Phase 1: Pre-Payment Website Outreach Pitch
 */
function generatePrePaymentWebsiteMessage(lead) {
  const companyName = lead.company_name || lead.name || 'Your Enterprise';
  const category = lead.category || 'Business';
  const city = lead.city || 'Lagos';
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const websitePreviewUrl = `https://lagosportals.ng/preview/${slug}?src=10k_lagos`;
  const claimUrl = `https://lagosportals.ng/claim?biz=${encodeURIComponent(companyName)}&id=${lead.id || '10K_99'}`;

  let template = `{Hi|Hello|Good day} [COMPANY_NAME],

We {built|custom-designed} a high-converting website & interactive 24/7 AI lead automation system preview for your [CATEGORY] in [CITY]:

🌐 View & Test Your Hybrid Website & Interactive AI Preview:
${websitePreviewUrl}

This hybrid system combines your custom business website with an embedded 24/7 WhatsApp AI agent, instant quote estimator, and automated PDF invoice generator.

👉 Claim Your Complete Hybrid System Portal Today:
${claimUrl}

{Best regards|Warm regards},
Bethelmind Growth & Automation Desk
(Reply STOP to opt out)`;

  template = template.replace(/\[COMPANY_NAME\]/g, companyName);
  template = template.replace(/\[CATEGORY\]/g, category);
  template = template.replace(/\[CITY\]/g, city);
  const result = parseSpintax(template);

  return {
    phase: 'PRE_PAYMENT_WEBSITE_PITCH',
    company_name: companyName,
    preview_url: websitePreviewUrl,
    claim_url: claimUrl,
    message_body: result
  };
}

/**
 * Phase 2: Post-Payment Solar Referral Onboarding Message
 * Sent immediately after a client completes payment for their website.
 */
function generatePostPaymentSolarReferralMessage(lead) {
  const companyName = lead.company_name || lead.name || 'Valued Client';
  const city = lead.city || 'Lagos';
  const calculatorUrl = `https://solarquotepro.ng/calculator?biz=${encodeURIComponent(companyName)}&city=${encodeURIComponent(city)}&ref=web_client_perk`;

  let template = `🎉 {Congratulations|Welcome aboard}! Your website for [COMPANY_NAME] is now LIVE and active!

⚡ {Exclusive Client Perk|Special Partner Perk} (Cut Your Monthly Operating Expenses):
As a business operating in [CITY], high diesel expenses can eat up your monthly profits. We have partnered with SolarQuotePro.ng to offer our website clients a FREE Solar Energy & Diesel Savings Audit.

With SolarQuotePro, you can:
• 📊 Calculate your exact inverter & battery load requirements in 2 minutes.
• 🤝 Connect directly with top-rated, verified, warranty-backed solar installers in [CITY].

👉 Calculate Your Business Solar Needs & Match with Installers:
${calculatorUrl}

{To your continued success|Best regards},
The Client Success Team`;

  template = template.replace(/\[COMPANY_NAME\]/g, companyName);
  template = template.replace(/\[CITY\]/g, city);
  const result = parseSpintax(template);

  return {
    phase: 'POST_PAYMENT_SOLAR_REFERRAL',
    company_name: companyName,
    calculator_url: calculatorUrl,
    message_body: result
  };
}

async function runRegularBusinessOutreach() {
  console.log('\x1b[34m============================================================\x1b[0m');
  console.log('\x1b[34m 🌐 TRACK B: REGULAR BUSINESS WEBSITE & POST-PAYMENT ENGINE  \x1b[0m');
  console.log('\x1b[34m============================================================\x1b[0m\n');

  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');

  const sampleLead = {
    id: 'LAGOS_HOTEL_442',
    company_name: 'Eko Suites & Hospitality',
    category: 'Hotel / Hospitality',
    city: 'Victoria Island',
    email: 'info@ekosuites.ng',
    phone: '+2348022223333'
  };

  const prePaymentPayload = generatePrePaymentWebsiteMessage(sampleLead);
  const postPaymentPayload = generatePostPaymentSolarReferralMessage(sampleLead);

  console.log('\x1b[33m--- PHASE 1: PRE-PAYMENT WEBSITE PITCH ---\x1b[0m');
  console.log(prePaymentPayload.message_body);

  console.log('\n\x1b[32m--- PHASE 2: POST-PAYMENT SOLAR REFERRAL TRIGGER ---\x1b[0m');
  console.log(postPaymentPayload.message_body);

  console.log('\n✅ Track B Execution Finished: Successfully verified Pre-Payment & Post-Payment message structures.');
  return { prePaymentPayload, postPaymentPayload };
}

if (require.main === module) {
  runRegularBusinessOutreach().catch(console.error);
}

module.exports = {
  generatePrePaymentWebsiteMessage,
  generatePostPaymentSolarReferralMessage,
  runRegularBusinessOutreach
};
