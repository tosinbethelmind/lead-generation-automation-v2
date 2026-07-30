/**
 * @file scripts/lead_classifier.js
 * Standalone Node.js lead classifier for 10k Lagos Scraper & Nationwide Lead Pipelines.
 * Categorizes leads into SOLAR_COMPANY_HYBRID vs REGULAR_BUSINESS_WEBSITE.
 */

const SOLAR_KEYWORDS = [
  'solar',
  'inverter',
  'renewable',
  'photovoltaic',
  'clean energy',
  'green energy',
  'solar power',
  'solar panel',
  'solar energy',
  'lithium battery',
  'solar technology',
  'solar solution',
  'solar systems',
  'solar quote',
  'solar installer',
  'renewable energy'
];

function classifyLead(lead) {
  const nameText = `${lead.name || ''} ${lead.company_name || ''} ${lead.title || ''}`.toLowerCase();
  const categoryText = (lead.category || '').toLowerCase();
  const descText = (lead.description || '').toLowerCase();
  const webText = (lead.website || '').toLowerCase();
  const combinedText = `${nameText} ${categoryText} ${descText} ${webText}`;

  const matchedKeywords = [];

  for (const keyword of SOLAR_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      matchedKeywords.push(keyword);
    }
  }

  const isSolar = matchedKeywords.length > 0;
  const existingTags = Array.isArray(lead.tags) ? lead.tags : [];

  if (isSolar) {
    const confidence = Math.min(1.0, 0.7 + matchedKeywords.length * 0.1);
    return {
      ...lead,
      campaign_track: 'SOLAR_COMPANY_HYBRID',
      classification_reason: `Matched solar keywords: ${matchedKeywords.join(', ')}`,
      classification_confidence: Number(confidence.toFixed(2)),
      tags: Array.from(new Set([...existingTags, 'SOLAR_COMPANY_HYBRID', ...matchedKeywords]))
    };
  }

  return {
    ...lead,
    campaign_track: 'REGULAR_BUSINESS_WEBSITE',
    classification_reason: 'No solar/inverter keywords found. Categorized as general business website prospect.',
    classification_confidence: 0.95,
    tags: Array.from(new Set([...existingTags, 'REGULAR_BUSINESS_WEBSITE']))
  };
}

function classifyLeadBatch(leads) {
  return leads.map(classifyLead);
}

// CLI Execution Mode for testing
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--test')) {
    console.log('🧪 Running Lead Classifier Test Suite...');
    const testLeads = [
      {
        company_name: 'Solarking Technologies Nigeria Ltd',
        category: 'Solar Power Solutions',
        city: 'Ikeja',
        phone: '+2348012345678'
      },
      {
        company_name: 'Eko Grand Hotel & Suites',
        category: 'Hospitality / Hotel',
        city: 'Victoria Island',
        phone: '+2348023456789'
      },
      {
        company_name: 'Lagos Inverter & Lithium Battery Hub',
        category: 'Renewable Energy Systems',
        city: 'Lekki',
        phone: '+2348034567890'
      },
      {
        company_name: 'Apex Law Chambers',
        category: 'Legal Services',
        city: 'Surulere',
        phone: '+2348045678901'
      }
    ];

    const results = classifyLeadBatch(testLeads);
    console.log(JSON.stringify(results, null, 2));
    
    const solarCount = results.filter(r => r.campaign_track === 'SOLAR_COMPANY_HYBRID').length;
    const regularCount = results.filter(r => r.campaign_track === 'REGULAR_BUSINESS_WEBSITE').length;
    
    console.log(`\n✅ Classification Summary:`);
    console.log(`- SOLAR_COMPANY_HYBRID Leads Identified: ${solarCount}`);
    console.log(`- REGULAR_BUSINESS_WEBSITE Leads Identified: ${regularCount}`);
  }
}

module.exports = {
  classifyLead,
  classifyLeadBatch,
  SOLAR_KEYWORDS
};
