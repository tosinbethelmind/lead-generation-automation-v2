/**
 * @file scripts/autonomous_pillar2_approval_copilot.js
 * 
 * 🏢 AUTONOMOUS PILLAR 2 (HIGH-TICKET DEAL WIRE) CO-PILOT APPROVAL ENGINE
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement Vault: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
 * 
 * 100% AUTOMATION WITH HUMAN APPROVAL GATE:
 * 1. Automatically intercepts prime real estate & commercial solar listings.
 * 2. Calculates exact 5% agency commission pool & Bethelmind 20% origination cut.
 * 3. Pre-drafts the LASRERA 80/20 Co-Brokerage Mandate Inquiry (Script A).
 * 4. Generates HMAC-signed 1-Tap Approval links.
 * 5. Prepares the WhatsApp Co-Pilot Card for Admin (0802 279 1227).
 * 6. User merely clicks "APPROVE" on their phone to fire the outreach!
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HMAC_SECRET = process.env.APPROVAL_HMAC_SECRET || 'bethelmind_copilot_secret_2026_lagos';
const APPROVAL_FILE = path.join(__dirname, '..', 'local_db', 'one_tap_copilot_tickets.json');
const JIJI_INTEL_FILE = path.join(__dirname, '..', 'scripts', 'jiji_search_intel_results.json');
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.bethelmindanalytics.com';
const ADMIN_PHONE = '08022791227';

function generateHmacSignature(ticketId, engineType, revenue, expiresAt) {
  return crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${ticketId}:${engineType}:${revenue}:${expiresAt}`)
    .digest('hex')
    .substring(0, 32);
}

function generateStatelessToken(payload) {
  const jsonStr = JSON.stringify(payload);
  const data = Buffer.from(jsonStr).toString('base64url');
  const sig = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(data)
    .digest('hex')
    .substring(0, 32);
  return { data, sig };
}

function loadTickets() {
  try {
    if (fs.existsSync(APPROVAL_FILE)) {
      return JSON.parse(fs.readFileSync(APPROVAL_FILE, 'utf8'));
    }
  } catch (_) {}
  return {};
}

function saveTickets(tickets) {
  const dir = path.dirname(APPROVAL_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(APPROVAL_FILE, JSON.stringify(tickets, null, 2));
}

function parsePriceToNumber(priceStr) {
  if (!priceStr) return 0;
  const digits = priceStr.replace(/[^0-9]/g, '');
  return parseInt(digits, 10) || 0;
}

function runAutonomousPillar2CoPilot() {
  console.log('🏛️ [PILLAR 2 CO-PILOT] Initializing autonomous high-ticket mandate discovery...');

  if (!fs.existsSync(JIJI_INTEL_FILE)) {
    console.error('❌ Intel results file not found at:', JIJI_INTEL_FILE);
    return;
  }

  const intelData = JSON.parse(fs.readFileSync(JIJI_INTEL_FILE, 'utf8'));
  const tickets = loadTickets();
  const stagedApprovals = [];

  // 1. Process Prime Real Estate listings
  const realEstateCategory = intelData.categories.find(c => c.category === 'PRIME_REAL_ESTATE');
  if (realEstateCategory && realEstateCategory.sampleListings) {
    for (const listing of realEstateCategory.sampleListings) {
      const priceNgn = parsePriceToNumber(listing.price);
      if (priceNgn < 300000000) continue; // Only luxury assets >= ₦300M

      const ticketId = `DEAL-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const expiresAt = Date.now() + 48 * 3600 * 1000; // 48-hour SLA
      
      const agencyCommissionPool = Math.round(priceNgn * 0.05); // Standard 5%
      const bethelmindOriginationCut = Math.round(agencyCommissionPool * 0.20); // 20% co-brokerage cut
      
      const tokenPayload = {
        id: ticketId,
        type: 'ENGINE_4_BUNDLE',
        title: listing.title,
        target: `Listing Broker - ${listing.title.slice(0, 30)}`,
        loc: listing.location || 'Lekki Phase 1, Lagos',
        phone: listing.url ? `Listing URL: ${listing.url}` : 'Direct Mandate',
        rev: bethelmindOriginationCut,
        val: priceNgn,
        exp: expiresAt
      };
      const { data: encodedData, sig } = generateStatelessToken(tokenPayload);

      const approveUrl = `${BASE_URL}/api/admin/one-tap-approval?data=${encodedData}&action=approve&sig=${sig}`;
      const rejectUrl = `${BASE_URL}/api/admin/one-tap-approval?data=${encodedData}&action=reject&sig=${sig}`;

      const preDraftedScript = `Good day,
My name is Tosin Oyelakin from Bethelmind Digital Solutions (CAC Certified: Reg 9912717).

I am contacting you regarding your verified listing: "${listing.title}" listed at ${listing.price.trim()}.

We operate an institutional mandate desk matching verified diaspora and corporate buyers with vetted Lagos properties. We have an active, pre-qualified buyer brief seeking a property in this exact category and budget in Lekki Phase 1.

Before we schedule inspection with the principal buyer:
1. Is this property still directly available under your mandate?
2. Are you open to our standard 80/20 agency fee-sharing arrangement (you retain 80% of the agency commission, Bethelmind retains 20% origination fee) under LASRERA guidelines?

If confirmed, please let me know so we can execute our brief Joint Inspection Memorandum (JIM) and proceed with inspection scheduling. Thank you.`;

      const ticketObj = {
        ticketId,
        engineType: 'ENGINE_4_BUNDLE',
        title: `Pillar 2 Mandate: ${listing.title}`,
        targetBusinessName: `Listing Broker - ${listing.title.slice(0, 30)}`,
        targetLocation: listing.location || 'Lekki Phase 1, Lagos',
        targetContactPhone: listing.url ? `Listing URL: ${listing.url}` : 'Pending Unmask',
        propertyValueNGN: priceNgn,
        projectedRevenueNGN: bethelmindOriginationCut,
        totalAgencyPoolNGN: agencyCommissionPool,
        dealSummary: `${listing.title} | Listed: ${listing.price.trim()} | Projected 20% Cut: ₦${bethelmindOriginationCut.toLocaleString()}`,
        preDraftedScript,
        listingUrl: listing.url,
        actionPayload: {
          channel: 'WHATSAPP_LASRERA_MANDATE',
          listingTitle: listing.title,
          listingPrice: listing.price.trim(),
          bethelmindCut: bethelmindOriginationCut,
          agencyPool: agencyCommissionPool
        },
        status: 'PENDING_APPROVAL',
        signature: sig,
        expiresAt,
        createdAt: new Date().toISOString()
      };

      tickets[ticketId] = ticketObj;
      stagedApprovals.push({
        ticketId,
        title: listing.title,
        price: listing.price.trim(),
        bethelmindCutFormatted: `₦${bethelmindOriginationCut.toLocaleString()}`,
        approveUrl,
        rejectUrl,
        preDraftedScript
      });

      if (stagedApprovals.length >= 3) break; // Stage top 3 deals for review
    }
  }

  saveTickets(tickets);

  console.log(`\n✅ [SUCCESS] Staged ${stagedApprovals.length} High-Ticket Co-Pilot Approval Tickets.`);
  console.log('📱 Formatted WhatsApp Co-Pilot Cards for Admin (0802 279 1227):\n');

  stagedApprovals.forEach((deal, idx) => {
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`CARD #${idx + 1}: [BETHELMIND DEAL WIRE CO-PILOT]`);
    console.log(`🏡 Opportunity: ${deal.title}`);
    console.log(`💰 Asset Value: ${deal.price}`);
    console.log(`💼 Bethelmind 20% Origination Share: ${deal.bethelmindCutFormatted}`);
    console.log(`📜 Legal Basis: LASRERA 80/20 Joint Inspection Memo (JIM)`);
    console.log(`\n👉 1-TAP APPROVAL (DISPATCH INQUIRY):`);
    console.log(`${deal.approveUrl}`);
    console.log(`\n❌ REJECT / ARCHIVE:`);
    console.log(`${deal.rejectUrl}`);
    console.log(`--------------------------------------------------------------------------------\n`);
  });

  return stagedApprovals;
}

if (require.main === module) {
  runAutonomousPillar2CoPilot();
}

module.exports = { runAutonomousPillar2CoPilot };
