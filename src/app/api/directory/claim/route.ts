import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type = 'claim_listing', // 'claim_listing' | 'diaspora_concierge' | 'sponsor_upgrade'
      businessName,
      listingId,
      ownerName,
      phone,
      email,
      notes,
      diasporaLocation,
      serviceNeeded,
      budgetCurrency = 'NGN',
      budgetAmount = 0,
    } = body;

    if (!phone || (!businessName && !ownerName)) {
      return NextResponse.json({ success: false, error: 'Phone number and Name are required.' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const claimRecord = {
      id: `claim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      listing_id: listingId || null,
      business_name: businessName || null,
      owner_name: ownerName || null,
      phone,
      email: email || null,
      notes: notes || null,
      diaspora_location: diasporaLocation || null,
      service_needed: serviceNeeded || null,
      budget_currency: budgetCurrency,
      budget_amount: budgetAmount,
      status: 'PENDING_ADMIN_DESK',
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        await (supabase as any).from('portal_claims').insert([claimRecord]);
      } catch (dbErr) {
        console.warn('[Directory Claim API] DB sync note:', dbErr);
      }
    }

    // Build immediate WhatsApp notification payload for Admin Desk (08022791227)
    let adminSummary = '';
    if (type === 'diaspora_concierge') {
      adminSummary = `🌍 *NEW DIASPORA ESCROW INQUIRY!*\n• Customer: ${ownerName}\n• Location: ${diasporaLocation || 'Overseas'}\n• Service: ${serviceNeeded || 'General'}\n• Budget: ${budgetCurrency} ${budgetAmount.toLocaleString()}\n• Phone: ${phone}\n• Notes: ${notes || 'None'}`;
    } else if (type === 'sponsor_upgrade') {
      adminSummary = `👑 *NEW EXCLUSIVE SPONSOR APPLICATION!*\n• Business: ${businessName}\n• Contact: ${ownerName} (${phone})\n• Tier: Sovereign Category Monopoly\n• Email: ${email || 'N/A'}`;
    } else {
      adminSummary = `🏆 *NEW PROFILE CLAIM SUBMISSION!*\n• Business: ${businessName}\n• Claimant: ${ownerName} (${phone})\n• Listing ID: ${listingId || 'N/A'}\n• Action: Deploy Custom Prototype & WhatsApp Bot`;
    }

    return NextResponse.json({
      success: true,
      claimId: claimRecord.id,
      message: 'Your request has been prioritized by Bethelmind Analytics Concierge Desk.',
      adminSummary,
      deskPhone: '08022791227',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
