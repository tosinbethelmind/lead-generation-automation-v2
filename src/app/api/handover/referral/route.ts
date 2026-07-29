import { NextRequest, NextResponse } from 'next/server';
import { saveLeads } from '@/lib/googleSheets';
import { validateEmail, validatePhone } from '@/lib/aiValidationGuard';

export const dynamic = 'force-dynamic';

/**
 * POST /api/handover/referral
 * Accepts client referral or secondary business website requests and inserts them directly into the lead pipeline
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName,
      contactName,
      email,
      phone,
      industry,
      notes,
      referrerClient,
    } = body;

    if (!businessName || typeof businessName !== 'string') {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }

    // Validate email if provided
    if (email && !validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address provided' }, { status: 400 });
    }

    // Validate phone if provided
    if (phone && !validatePhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format. Please check digits.' }, { status: 400 });
    }

    const leadId = `REF-${Date.now()}`;
    const newLead = {
      lead_id: leadId,
      name: businessName.trim(),
      contact_name: contactName || 'Business Owner',
      email: email ? email.trim() : '',
      phone_raw: phone ? phone.trim() : '',
      phone_e164: phone ? phone.trim() : '',
      industry: industry || 'General B2B',
      category: industry || 'General B2B',
      status: 'NEW' as const,
      notes: `[REFERRAL] Referred by client: ${referrerClient || 'Existing Client'}. Notes: ${notes || 'Requested new website build via handover portal.'}`,
      source: 'FACEBOOK' as const,
      collected_at: new Date().toISOString(),
    };

    // Save directly to the system's leads repository/database
    await saveLeads([newLead]);

    return NextResponse.json({
      success: true,
      message: 'Referral lead successfully injected into the lead pipeline!',
      leadId,
      lead: newLead,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
