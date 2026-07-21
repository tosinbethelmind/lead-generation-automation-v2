// src/app/api/whatsapp/test/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig } from '@/lib/localConfig';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Recipient phone number is required.' }, { status: 400 });
    }

    const config = getRuntimeConfig();

    if (!config.whatsappPhoneNumberId || !config.whatsappAccessToken) {
      return NextResponse.json({
        error: 'WhatsApp Meta credentials are not fully configured. Please auto-link your account first.'
      }, { status: 400 });
    }

    // Mock a minimal lead structure for the sender
    const mockLead = {
      name: 'Test Recipient',
      phone: phone,
      lead_id: 'test_lead_id'
    };

    const previewUrl = 'https://lead-generation-automation-e0oitxcsi.vercel.app/demo-proposal';
    const testMessage = `Hello from Bethelmind Analytics & Strategy! Your WhatsApp Meta Cloud API integration is successfully linked and verified.`;

    // Send using standard utility (handles template vs free-form message)
    await sendWhatsAppMessage(mockLead as any, previewUrl, 'http://localhost:3006', testMessage);

    return NextResponse.json({
      success: true,
      message: 'Test message sent successfully!'
    });
  } catch (err: any) {
    console.error('[WhatsApp Test] Failed:', err);
    return NextResponse.json({
      error: err.message || 'Unknown error occurred while sending test message.'
    }, { status: 500 });
  }
}
