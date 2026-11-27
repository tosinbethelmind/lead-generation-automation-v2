import { NextResponse } from 'next/server';
import { createEnquiry, validateNigerianPhone } from '@/lib/commerce/enquiries';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      name,
      email,
      phone,
      whatsapp,
      businessName,
      selectedService,
      selectedPackage,
      agreedPriceNgn,
      subject,
      message,
      source,
      gclid,
      gbraid,
      wbraid,
      utmCampaign,
    } = body;

    const cleanName = String(name || '').trim();
    if (cleanName.length < 2) {
      return NextResponse.json({ success: false, error: 'Please enter your full name.' }, { status: 400 });
    }

    const rawPhone = String(whatsapp || phone || '').trim();
    if (rawPhone) {
      const phoneCheck = validateNigerianPhone(rawPhone);
      if (!phoneCheck.valid) {
        return NextResponse.json({ success: false, error: phoneCheck.error }, { status: 400 });
      }
    } else if (!email) {
      return NextResponse.json(
        { success: false, error: 'Please provide your WhatsApp number or email address.' },
        { status: 400 }
      );
    }

    const serviceLabel = String(selectedService || subject || 'Business Website Development');
    const enquiry = await createEnquiry({
      name: cleanName,
      whatsapp: rawPhone,
      businessName,
      email,
      selectedService: serviceLabel,
      selectedPackage,
      agreedPriceNgn: typeof agreedPriceNgn === 'number' ? agreedPriceNgn : undefined,
      message: message || `Enquiry for ${serviceLabel}${selectedPackage ? ` (${selectedPackage})` : ''}`,
      source: source || 'website_enquiry',
      gclid,
      gbraid,
      wbraid,
      utmCampaign,
    });

    // Optional forward to local WhatsApp Command Center if running
    const targetUrls = [process.env.COMMAND_CENTER_URL].filter(Boolean) as string[];
    for (const url of targetUrls) {
      try {
        await fetch(`${url}/web-inquiry`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: enquiry.name,
            email: enquiry.email || '',
            phone: enquiry.whatsapp,
            subject: `${enquiry.selectedService}${enquiry.selectedPackage ? ` — ${enquiry.selectedPackage}` : ''}`,
            message: enquiry.message || '',
          }),
          signal: AbortSignal.timeout(2000),
        });
      } catch {}
    }

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      ticketId: enquiry.id,
      enquiry,
      message: 'Your enquiry has been recorded. Speak directly with our team on WhatsApp.',
    });
  } catch (error: any) {
    console.error('[Contact API] Unexpected error:', error.message);
    return NextResponse.json({ success: false, error: 'Unable to submit enquiry right now.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, service: 'Bethelmind Enquiry & Contact API' });
}
