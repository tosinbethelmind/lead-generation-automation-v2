import { NextRequest, NextResponse } from 'next/server';
import { saveLeads } from '@/lib/googleSheets';
import { validateEmail, validatePhone } from '@/lib/aiValidationGuard';
import { sanitizeInputString } from '@/lib/validation';

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

    const cleanBusinessName = sanitizeInputString(businessName);
    const cleanContactName = sanitizeInputString(contactName);
    const cleanEmail = sanitizeInputString(email);
    const cleanPhone = sanitizeInputString(phone);
    const cleanIndustry = sanitizeInputString(industry);
    const cleanNotes = sanitizeInputString(notes);
    const cleanReferrerClient = sanitizeInputString(referrerClient);

    if (!cleanBusinessName) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }

    // Validate email if provided
    if (cleanEmail && !validateEmail(cleanEmail)) {
      return NextResponse.json({ error: 'Invalid email address provided' }, { status: 400 });
    }

    // Validate phone if provided
    if (cleanPhone && !validatePhone(cleanPhone)) {
      return NextResponse.json({ error: 'Invalid phone number format. Please check digits.' }, { status: 400 });
    }

    const leadId = `REF-${Date.now()}`;
    const newLead = {
      lead_id: leadId,
      name: cleanBusinessName,
      contact_name: cleanContactName || 'Business Owner',
      email: cleanEmail,
      phone_raw: cleanPhone,
      phone_e164: cleanPhone,
      industry: cleanIndustry || 'General B2B',
      category: cleanIndustry || 'General B2B',
      status: 'NEW' as const,
      notes: `[REFERRAL] Referred by client: ${cleanReferrerClient || 'Existing Client'}. Notes: ${cleanNotes || 'Requested new website build via handover portal.'}`,
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
