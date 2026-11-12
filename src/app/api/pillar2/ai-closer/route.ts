import { NextRequest, NextResponse } from 'next/server';
import { processConversationalMessage } from '@/lib/pillar2/pillar2ConversationalAI';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderPhone, senderName, messageText, dealContext, autoReply } = body;

    if (!messageText) {
      return NextResponse.json(
        { success: false, error: 'messageText is required' },
        { status: 400 }
      );
    }

    const aiResult = processConversationalMessage({
      senderPhone: senderPhone || '',
      senderName: senderName || 'Valued Client',
      messageText,
      dealContext
    });

    // If autoReply is requested and senderPhone is provided, dispatch via Evolution API on Contabo VPS
    let dispatchStatus = 'NOT_REQUESTED';
    if (autoReply && senderPhone) {
      const cleanPhone = senderPhone.replace(/\D/g, '');
      const e164 = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : (cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone);
      const vpsUrl = process.env.EVOLUTION_SEND_URL || 'http://169.58.182.92:8080/send';
      const apiKey = process.env.EVOLUTION_API_KEY || 'evolution_bethelmind_secret_2026';

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(vpsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey
          },
          body: JSON.stringify({
            number: e164,
            textMessage: { text: aiResult.replyText }
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        dispatchStatus = res.ok ? 'DELIVERED_VIA_VPS' : 'VPS_DISPATCH_FAILED';
      } catch (e: any) {
        dispatchStatus = `DISPATCH_ERROR: ${e?.message}`;
      }
    }

    return NextResponse.json({
      success: true,
      data: aiResult,
      dispatchStatus
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    service: 'Bethelmind Pillar 2 Conversational AI Closer',
    cacReg: 'BN 9912717',
    bank: 'Moniepoint MFB 6805375225',
    activeIntents: [
      'TITLE_INQUIRY',
      'INSPECTION_REQUEST',
      'PRICE_NEGOTIATION',
      'COMMISSION_SPLIT',
      'ESCROW_SECURITY',
      'GENERAL_INQUIRY'
    ]
  });
}
