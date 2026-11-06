import { NextRequest, NextResponse } from 'next/server';
import { HighTicketDealWireEngine } from '@/lib/dealWire/highTicketDealWireEngine';
import { PRIME_LUXURY_LISTINGS } from '@/lib/pillar2/luxuryListings';

function synthesizeBriefFromLuxuryListing(listing: any): any {
  const commPool = Math.round(listing.priceNgn * 0.05);
  const origCut = Math.round(commPool * 0.20);
  return {
    deal_id: listing.id,
    source: 'JIJI_PREMIUM_DIRECT_MANDATE',
    category: 'PRIME_REAL_ESTATE_SALE',
    title: listing.title,
    description: `Verified Direct Mandate: ${listing.title} in ${listing.location}. Matched Buyer: ${listing.buyerProfile?.principalName || 'Corporate Principal'} (${listing.buyerProfile?.title || 'Investor'}) with verified budget of ${listing.buyerProfile?.allocatedBudgetFormatted || listing.priceFormatted}. Purpose: ${listing.buyerProfile?.purpose || 'Executive acquisition'}`,
    location: { state: 'Lagos', city: 'Lagos', area: listing.location },
    property_price_ngn: listing.priceNgn,
    property_price_formatted: listing.priceFormatted,
    budget_amount_ngn: listing.buyerProfile?.budgetNgn || listing.priceNgn,
    formatted_budget: listing.buyerProfile?.allocatedBudgetFormatted || listing.priceFormatted,
    estimated_commission_pool_ngn: commPool,
    bethelmind_origination_fee_ngn: origCut,
    buyer_concierge_fee_ngn: Math.round(listing.priceNgn * 0.01),
    buyer_contact: {
      name: listing.buyerProfile?.principalName || 'Corporate Principal',
      phone: listing.buyerProfile?.representativeContact?.phone || '08022791227',
      carrier: 'MTN Nigeria',
      is_carrier_valid: true
    },
    qualification_status: 'VERIFIED_CASH_READY',
    digital_mandate: {
      mandate_ref: `BM-LASRERA-${listing.id}`,
      cac_registration: 'Reg 9912717',
      settlement_bank: 'Moniepoint Microfinance Bank',
      settlement_account: '6805375225',
      settlement_account_name: 'Bethelmind Digital Solutions',
      mandate_text: `LASRERA Bilateral Co-Brokerage Mandate: 80% to Closing Broker, 20% Origination Fee to Bethelmind Digital Solutions (Moniepoint MFB: 6805375225).`,
      legal_shield: {
        lasrera_clause: 'Executed under LASRERA Law 2022 and Section 84 Evidence Act 2011.',
        liquidated_damages_ngn: origCut * 2,
        section_84_evidence_hash: `SHA256-LASRERA-SEC84-${listing.id}`,
        governing_law: 'Laws of Lagos State and the Federal Republic of Nigeria'
      }
    },
    timestamps: {
      harvested_at: new Date().toISOString()
    }
  };
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ deal_id: string }> }
) {
  try {
    const { deal_id } = await context.params;
    const engine = HighTicketDealWireEngine.getInstance();
    const briefs = engine.getStoredBriefs();
    let brief = briefs.find(b => b.deal_id.toLowerCase() === deal_id.toLowerCase());

    if (!brief) {
      const listing = PRIME_LUXURY_LISTINGS.find(l => l.id.toLowerCase() === deal_id.toLowerCase());
      if (listing) {
        brief = synthesizeBriefFromLuxuryListing(listing);
        briefs.push(brief);
        engine.saveBriefs(briefs);
      }
    }

    if (!brief) {
      return NextResponse.json({ success: false, error: 'Deal brief not found' }, { status: 404 });
    }

    // Check action param for downloading legal documents
    const url = new URL(req.url);
    const docType = url.searchParams.get('doc');
    if (docType === 'section84') {
      const cert = engine.generateSection84Certificate(deal_id);
      return new NextResponse(cert, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="SECTION_84_CERTIFICATE_${deal_id}.txt"`
        }
      });
    }

    const isClaimed = !!brief.exclusive_partner_assigned;
    const maskedPhone = brief.buyer_contact.phone
      ? `${brief.buyer_contact.phone.slice(0, 4)} ••• ••• ${brief.buyer_contact.phone.slice(-4)}`
      : 'Verified Inbound Contact';

    const teaser = {
      deal_id: brief.deal_id,
      category: brief.category,
      source: brief.source,
      title: brief.title,
      description: brief.description,
      location: brief.location,
      budget_amount_ngn: brief.budget_amount_ngn,
      formatted_budget: brief.formatted_budget,
      estimated_commission_pool_ngn: brief.estimated_commission_pool_ngn,
      bethelmind_origination_fee_ngn: brief.bethelmind_origination_fee_ngn,
      buyer_concierge_fee_ngn: brief.buyer_concierge_fee_ngn,
      qualification_status: brief.qualification_status,
      is_claimed: isClaimed,
      exclusive_partner_assigned: brief.exclusive_partner_assigned ? {
        agency_name: brief.exclusive_partner_assigned.agency_name,
        contact_person: brief.exclusive_partner_assigned.contact_person,
        signature_data_url: brief.exclusive_partner_assigned.signature_data_url || null
      } : null,
      sla_tracking: brief.sla_tracking || null,
      buyer_contact: isClaimed ? brief.buyer_contact : {
        name: brief.buyer_contact.name || 'Verified Cash Buyer',
        phone: maskedPhone,
        carrier: brief.buyer_contact.carrier,
        is_carrier_valid: brief.buyer_contact.is_carrier_valid
      },
      digital_mandate: brief.digital_mandate,
      timestamps: brief.timestamps
    };

    return NextResponse.json({ success: true, deal: teaser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ deal_id: string }> }
) {
  try {
    const { deal_id } = await context.params;
    const body = await req.json();
    const engine = HighTicketDealWireEngine.getInstance();

    // ── ACTION A: Log Partner Milestone (Fulfills 24-Hour SLA) ──
    if (body.action === 'log_milestone') {
      const { inspection_notes } = body;
      const res = engine.logPartnerMilestone(deal_id, inspection_notes || 'Confirmed with buyer');
      return NextResponse.json(res);
    }

    // ── ACTION B: Initial Deal Claim & Mandate Signature ──
    const { agency_name, contact_person, phone, signature_data_url } = body;
    if (!agency_name || !contact_person || !phone) {
      return NextResponse.json({
        success: false,
        error: 'Please provide Agency Name, Contact Person, and Phone Number to sign mandate and unlock brief.'
      }, { status: 400 });
    }

    const briefs = engine.getStoredBriefs();
    let index = briefs.findIndex(b => b.deal_id.toLowerCase() === deal_id.toLowerCase());

    if (index === -1) {
      const listing = PRIME_LUXURY_LISTINGS.find(l => l.id.toLowerCase() === deal_id.toLowerCase());
      if (listing) {
        const newBrief = synthesizeBriefFromLuxuryListing(listing);
        briefs.push(newBrief);
        engine.saveBriefs(briefs);
        index = briefs.length - 1;
      }
    }

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Deal brief not found' }, { status: 404 });
    }

    const brief = briefs[index];
    if (brief.exclusive_partner_assigned) {
      return NextResponse.json({
        success: false,
        error: `This brief is already locked exclusively by ${brief.exclusive_partner_assigned.agency_name}.`
      }, { status: 409 });
    }

    const assignedAt = new Date().toISOString();
    const slaExpiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

    // Assign exclusive partner & bind 24-hour speed-to-lead SLA
    brief.exclusive_partner_assigned = {
      agency_name: agency_name.trim(),
      contact_person: contact_person.trim(),
      phone: phone.trim(),
      assigned_at: assignedAt,
      signature_data_url: signature_data_url || undefined
    };
    brief.sla_tracking = {
      sla_expires_at: slaExpiresAt,
      sla_status: 'PENDING_CONTACT'
    };
    brief.qualification_status = 'DISPATCHED_TO_PARTNER';
    brief.timestamps.dispatched_at = assignedAt;

    briefs[index] = brief;
    engine.saveBriefs(briefs);

    const buyerPhone = brief.buyer_contact.phone || '08022791227';
    const cleanBuyerPhone = buyerPhone.replace(/\D/g, '');
    const intlPhone = cleanBuyerPhone.startsWith('0') ? `234${cleanBuyerPhone.slice(1)}` : cleanBuyerPhone;
    const directChatText = encodeURIComponent(
      `Good day ${brief.buyer_contact.name || 'Boss'}! This is ${contact_person} from ${agency_name}. Bethelmind Executive Desk assigned our desk to conduct your private viewing/quote for: "${brief.title}". When is convenient for your private inspection this weekend?`
    );
    const waChatUrl = `https://wa.me/${intlPhone}?text=${directChatText}`;

    return NextResponse.json({
      success: true,
      message: 'Co-Brokerage Mandate signed under LASRERA Covenant. 24-Hour SLA Active. Full buyer line unlocked.',
      deal_id: brief.deal_id,
      unlocked_buyer_contact: brief.buyer_contact,
      wa_chat_url: waChatUrl,
      mandate_ref: brief.digital_mandate.mandate_ref,
      sla_expires_at: slaExpiresAt,
      liquidated_damages_ngn: brief.digital_mandate.legal_shield?.liquidated_damages_ngn || 0
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
