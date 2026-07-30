/**
 * @file scripts/solar_company_hybrid_outreach.js
 * Track A Outreach Engine for Solar Companies & Installers identified in 10k Lagos Scraper & Nationwide lists.
 * Dispatches the 4-in-1 Power Package:
 * 1. Customized Solar Website Preview
 * 2. Official Directory Enlistment on SolarQuotePro.ng
 * 3. 60-Second Instant PDF Proposal Builder
 * 4. Direct Access to Platform Solar Leads
 */

const fs = require('fs');
const path = require('path');
const { classifyLead } = require('./lead_classifier');

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

function generateSolarCompanyMessage(lead) {
  const companyName = lead.company_name || lead.name || 'Your Solar Enterprise';
  const city = lead.city || 'Lagos';
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const websitePreviewUrl = `https://solarquotepro.ng/preview/${slug}?src=10k_lagos`;
  const enlistUrl = `https://solarquotepro.ng/installers/enlist?biz=${encodeURIComponent(companyName)}&city=${encodeURIComponent(city)}`;
  const proposalUrl = `https://solarquotepro.ng/proposals/instant-builder`;
  const leadsUrl = `https://solarquotepro.ng/marketplace/leads`;

  let template = `{Hi|Hello|Good day} [COMPANY_NAME],

We {noticed|saw} your solar and energy installation work in [CITY]. We have generated a {customized|tailored} solar website preview specifically for your brand:

🌐 View your Custom Solar Website Preview:
${websitePreviewUrl}

⚡ BONUS: Full Access to the SolarQuotePro.ng Platform:
When you claim your website, [COMPANY_NAME] automatically gets:

1. 📍 Official Enlistment as a Verified Solar Installer on SolarQuotePro.ng
   ${enlistUrl}

2. 📄 60-Second PDF Proposal Builder for your field sales team
   ${proposalUrl}

3. 🎯 Direct Access to qualified commercial & residential solar leads in [CITY]
   ${leadsUrl}

{Best regards|Warm regards|To your growth},
The SolarQuotePro Installer Desk
(Reply STOP to unsubscribe)`;

  template = template.replace(/\[COMPANY_NAME\]/g, companyName);
  template = template.replace(/\[CITY\]/g, city);
  const result = parseSpintax(template);

  return {
    lead_id: lead.id || `SOLAR_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    company_name: companyName,
    phone: lead.phone || null,
    email: lead.email || null,
    preview_url: websitePreviewUrl,
    enlist_url: enlistUrl,
    proposal_url: proposalUrl,
    leads_url: leadsUrl,
    message_body: result
  };
}

async function runSolarCompanyHybridOutreach() {
  console.log('\x1b[36m============================================================\x1b[0m');
  console.log('\x1b[36m ⚡ TRACK A: SOLAR COMPANY 4-IN-1 HYBRID OUTREACH ENGINE     \x1b[0m');
  console.log('\x1b[36m============================================================\x1b[0m\n');

  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const countIdx = args.indexOf('--count');
  const limit = countIdx !== -1 && args[countIdx + 1] ? parseInt(args[countIdx + 1], 10) : 5;

  if (isDryRun) {
    console.log('\x1b[33m[Mode] DRY-RUN enabled. Generating outreach payloads without sending.\x1b[0m\n');
  }

  // Demo / Local leads for processing
  const sampleLeads = [
    {
      company_name: 'Apex Solar Energy Solutions',
      category: 'Solar Inverter Installer',
      city: 'Ikeja',
      state: 'Lagos',
      phone: '+2348011112222',
      email: 'contact@apexsolar.ng'
    },
    {
      company_name: 'Solarking Technologies Ltd',
      category: 'Renewable Power Systems',
      city: 'Lekki',
      state: 'Lagos',
      phone: '+2348033334444',
      email: 'info@solarking.ng'
    },
    {
      company_name: 'Greenlight Lithium & Solar Hub',
      category: 'Solar Energy Vendor',
      city: 'Victoria Island',
      state: 'Lagos',
      phone: '+2348055556666',
      email: 'sales@greenlightsolar.ng'
    }
  ];

  const processed = [];
  for (const rawLead of sampleLeads.slice(0, limit)) {
    const classified = classifyLead(rawLead);
    if (classified.campaign_track === 'SOLAR_COMPANY_HYBRID') {
      const payload = generateSolarCompanyMessage(classified);
      processed.push(payload);
      console.log(`\n\x1b[32m[Track A Matched] ${payload.company_name} (${classified.classification_reason})\x1b[0m`);
      console.log(`------------------------------------------------------------`);
      console.log(payload.message_body);
      console.log(`------------------------------------------------------------`);
    }
  }

  console.log(`\n✅ Track A Execution Finished: Processed ${processed.length} Solar Company Outreach payloads.`);
  return processed;
}

if (require.main === module) {
  runSolarCompanyHybridOutreach().catch(console.error);
}

module.exports = {
  generateSolarCompanyMessage,
  runSolarCompanyHybridOutreach
};
