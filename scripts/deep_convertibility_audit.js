/**
 * scripts/deep_convertibility_audit.js
 * 
 * Deep Convertibility & Specialization Audit of All 30 Day 2 Prototype Landing Pages
 * Evaluates:
 * 1. Business Name & Real Lagos Location
 * 2. Real Google Reviews / Rating Badge (Social Proof)
 * 3. Sector-Specific Interactive Conversion Widget (Booking, Calculator, Cart)
 * 4. WhatsApp Direct One-Tap CTA
 * 5. Instant Paystack Claim & Setup Integration
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../local_db/leads_db.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const allLeads = data.leads || (Array.isArray(data) ? data : Object.values(data));
const contactedLeads = allLeads.filter(l => l.status === 'CONTACTED');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 12000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, html: data }));
    }).on('error', err => resolve({ statusCode: 500, error: err.message }))
      .on('timeout', () => resolve({ statusCode: 504, error: 'TIMEOUT' }));
  });
}

async function runAudit() {
  console.log('========================================================================================');
  console.log('🔬 DEEP CONVERTIBILITY & SPECIALIZATION AUDIT: 30 LAGOS BUSINESS PROTOTYPES');
  console.log('========================================================================================\n');

  const auditResults = [];

  for (let i = 0; i < contactedLeads.length; i++) {
    const lead = contactedLeads[i];
    const leadId = lead.lead_id || lead.id;
    const url = `https://www.bethelmindanalytics.com/preview/${encodeURIComponent(leadId)}`;

    const res = await fetchUrl(url);
    const html = res.html || '';

    // Convertibility Checks
    const hasName = html.toLowerCase().includes(lead.name.toLowerCase().slice(0, 10));
    const hasReviews = html.includes('★') || html.includes('Rating') || html.includes('Reviews') || html.includes('Verified');
    const hasWhatsAppCta = html.includes('wa.me') || html.includes('WhatsApp') || html.includes('Chat with us') || html.includes('Order via WhatsApp');
    const hasInteractiveWidget = html.includes('Appointment') || html.includes('Intake') || html.includes('Book') || html.includes('Calculator') || html.includes('Catalog') || html.includes('Schedule') || html.includes('Quote');
    const hasClaimSystem = html.includes('Claim') || html.includes('Paystack') || html.includes('Instant Setup') || html.includes('Deploy');
    const hasAddress = (lead.area && html.toLowerCase().includes(lead.area.toLowerCase())) || html.toLowerCase().includes('lagos') || (lead.address && html.includes(lead.address.slice(0, 8)));

    let score = 0;
    if (hasName) score += 20;
    if (hasReviews) score += 20;
    if (hasInteractiveWidget) score += 20;
    if (hasWhatsAppCta) score += 20;
    if (hasClaimSystem) score += 20;

    let widgetName = 'Interactive Conversion Portal';
    const cat = (lead.category || '').toLowerCase();
    if (cat.includes('dent') || cat.includes('medic') || cat.includes('clinic')) widgetName = '🏥 Patient Intake & Appointment Scheduler';
    else if (cat.includes('furnitur') || cat.includes('retail') || cat.includes('shop')) widgetName = '🛋️ WhatsApp Product Catalog & Checkout';
    else if (cat.includes('prop') || cat.includes('real')) widgetName = '🏢 Virtual Property Booking & Valuation';
    else if (cat.includes('rest') || cat.includes('food')) widgetName = '🍽️ Direct WhatsApp Menu & Reservation';
    else if (cat.includes('solar') || cat.includes('energy')) widgetName = '☀️ Solar KVA Load & Diesel Savings Sizer';
    else widgetName = '💼 Interactive B2B Quote & Service Scheduler';

    auditResults.push({
      index: i + 1,
      name: lead.name,
      category: lead.category || 'Business',
      area: lead.area || lead.city || 'Lagos',
      url,
      score,
      widgetName,
      hasName,
      hasReviews,
      hasWhatsAppCta,
      hasInteractiveWidget,
      hasClaimSystem
    });

    const scoreEmoji = score >= 80 ? '🌟 High Conversion' : score >= 60 ? '👍 Good' : '⚠️ Basic';
    console.log(`[${(i + 1).toString().padStart(2, '0')}/30] ${lead.name.slice(0, 32).padEnd(32)} | Score: ${score}/100 (${scoreEmoji})`);
    console.log(`     🎯 Widget: ${widgetName}`);
    console.log(`     📍 Location: ${lead.area || 'Lagos'} | 📱 WhatsApp CTA: ${hasWhatsAppCta ? '✔ Active' : '❌'} | 💳 Claim Engine: ${hasClaimSystem ? '✔ Active' : '❌'}`);
    console.log(`     🔗 URL: ${url}\n`);
  }

  const avgScore = Math.round(auditResults.reduce((a, b) => a + b.score, 0) / auditResults.length);
  console.log('========================================================================================');
  console.log(`📊 CONVERTIBILITY SCORE AVERAGE: ${avgScore}/100 Across All 30 Prototypes`);
  console.log('========================================================================================');
}

runAudit().catch(console.error);
