import { NextRequest, NextResponse } from 'next/server';
import { HighTicketDealWireEngine } from '@/lib/dealWire/highTicketDealWireEngine';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ deal_id: string }> }
) {
  try {
    const { deal_id } = await context.params;
    const engine = HighTicketDealWireEngine.getInstance();
    const briefs = engine.getStoredBriefs();
    const brief = briefs.find(b => b.deal_id.toLowerCase() === deal_id.toLowerCase());

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
    const index = briefs.findIndex(b => b.deal_id.toLowerCase() === deal_id.toLowerCase());

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
