import { NextResponse } from 'next/server';
import { createEnquiry } from '@/lib/commerce/enquiries';
import { sendAdminWhatsAppNotification, ADMIN_PHONE_CLEAN } from '@/lib/monetization/adminWhatsAppNotifier';

export const dynamic = 'force-dynamic';

function validateInternationalOrNigerianWhatsApp(raw: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const trimmed = String(raw || '').trim();
  const digits = trimmed.replace(/\D/g, '');

  if (digits.length < 8 || digits.length > 15) {
    return {
      valid: false,
      normalized: digits,
      error: 'Please enter a valid WhatsApp phone number (e.g. 0803 482 9105 or +44 7700 900123).',
    };
  }

  if (/00000|11111|22222|88888|99999|123456|654321/.test(digits)) {
    return {
      valid: false,
      normalized: digits,
      error: 'Please enter a genuine WhatsApp phone number so our research team can reach you.',
    };
  }

  const normalized = digits.startsWith('0') && digits.length === 11 ? `234${digits.slice(1)}` : digits;
  return { valid: true, normalized };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      fullName,
      whatsapp,
      email,
      academicLevel,
      supportNeeded,
      researchStage,
      submissionDeadline,
      description,
      gclid,
      gbraid,
      wbraid,
      utmCampaign,
    } = body;

    const cleanName = String(fullName || '').trim();
    if (cleanName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your full name.' },
        { status: 400 }
      );
    }

    const phoneCheck = validateInternationalOrNigerianWhatsApp(String(whatsapp || ''));
    if (!phoneCheck.valid) {
      return NextResponse.json(
        { success: false, error: phoneCheck.error },
        { status: 400 }
      );
    }

    const cleanEmail = String(email || '').trim();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address or leave it blank.' },
        { status: 400 }
      );
    }

    const level = String(academicLevel || 'MSc').trim();
    const support = String(supportNeeded || 'Thesis support').trim();
    const stage = String(researchStage || 'Not specified').trim();
    const deadline = String(submissionDeadline || 'Flexible / To be discussed').trim();
    const notes = String(description || '').trim();

    const structuredMessage = [
      `Academic Level: ${level}`,
      `Support Needed: ${support}`,
      `Current Stage: ${stage}`,
      `Submission Deadline: ${deadline}`,
      notes ? `Project Notes: ${notes}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    const enquiry = await createEnquiry({
      name: cleanName,
      whatsapp: phoneCheck.normalized,
      businessName: `${level} Postgraduate Research`,
      email: cleanEmail || undefined,
      selectedService: `Postgraduate Research Support — ${support}`,
      selectedPackage: `${level} (${stage})`,
      message: structuredMessage,
      source: 'academic_research_landing',
      gclid: gclid ? String(gclid) : undefined,
      gbraid: gbraid ? String(gbraid) : undefined,
      wbraid: wbraid ? String(wbraid) : undefined,
      utmCampaign: utmCampaign ? String(utmCampaign) : undefined,
    });

    const whatsappSummaryText = [
      `Hello Bethelmind, I just submitted a research consultation request (Ref: ${enquiry.id}).`,
      `Name: ${cleanName}`,
      `Academic Level: ${level}`,
      `Support Needed: ${support}`,
      `Current Stage: ${stage}`,
      `Deadline: ${deadline}`,
      notes ? `Details: ${notes.slice(0, 220)}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappFollowUpUrl = `https://wa.me/${ADMIN_PHONE_CLEAN}?text=${encodeURIComponent(whatsappSummaryText)}`;

    const adminAlert = [
      `🎓 *NEW POSTGRADUATE RESEARCH ENQUIRY (${enquiry.id})*`,
      `👤 *Name:* ${cleanName}`,
      `📱 *WhatsApp:* +${phoneCheck.normalized}`,
      cleanEmail ? `✉️ *Email:* ${cleanEmail}` : null,
      `🎓 *Level:* ${level}`,
      `🔬 *Support Needed:* ${support}`,
      `📍 *Current Stage:* ${stage}`,
      `⏳ *Deadline:* ${deadline}`,
      notes ? `📝 *Notes:* ${notes.slice(0, 300)}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    await Promise.race([
      sendAdminWhatsAppNotification(adminAlert).catch(() => null),
      new Promise((resolve) => setTimeout(resolve, 1800)),
    ]);

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      whatsappFollowUpUrl,
      message:
        'Your research consultation request has been received. A specialist will review your project details and reach out on WhatsApp.',
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[Academic Enquiry API] Error:', errMsg);
    return NextResponse.json(
      { success: false, error: 'Unable to submit your consultation request right now. Please try WhatsApp directly.' },
      { status: 500 }
    );
  }
}
