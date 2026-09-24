import { NextRequest, NextResponse } from 'next/server';
import { chatwootClient } from '@/lib/integrations/chatwootClient';

export const dynamic = 'force-dynamic';

/**
 * POST /api/chatwoot/inbound
 * Receives an inbound prospect event and synchronizes it into Chatwoot
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.businessName && !body.name) {
      return NextResponse.json({
        success: false,
        error: 'businessName or name is required'
      }, { status: 400 });
    }

    const result = await chatwootClient.syncInboundLeadAction({
      businessName: body.businessName || body.name,
      phone: body.phone,
      email: body.email,
      area: body.area,
      sector: body.sector || body.category,
      messageText: body.messageText || body.message || 'Inbound prospect inquiry received.',
      previewUrl: body.previewUrl,
      channel: body.channel || 'whatsapp'
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
