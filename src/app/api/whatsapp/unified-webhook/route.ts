import { NextRequest, NextResponse } from 'next/server';
import { routeIncomingWhatsAppMessage } from '@/lib/unifiedMessageRouter';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support both Evolution API payload format and standard webhook JSON
    let fromPhone = '';
    let messageText = '';
    let senderName = '';

    // Evolution API format
    if (body?.data?.key?.remoteJid) {
      fromPhone = body.data.key.remoteJid.replace('@s.whatsapp.net', '').replace('@lid', '');
      messageText = body.data.message?.conversation || body.data.message?.extendedTextMessage?.text || '';
      senderName = body.data.pushName || 'Client';
    } 
    // Direct / Generic webhook format
    else if (body?.senderPhone || body?.from) {
      fromPhone = body.senderPhone || body.from || '';
      messageText = body.messageText || body.text || '';
      senderName = body.senderName || 'Client';
    }
    // Meta Cloud webhook format
    else if (body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const msgObj = body.entry[0].changes[0].value.messages[0];
      fromPhone = msgObj.from || '';
      messageText = msgObj.text?.body || '';
      senderName = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || 'Client';
    }

    if (!messageText) {
      return NextResponse.json({ status: 'ACK_EMPTY', message: 'No message content detected' });
    }

    // Run the Unified Multi-Business Intent Router
    const routingResult = routeIncomingWhatsAppMessage(messageText, fromPhone, senderName);

    let dispatchResult = 'NOT_APPLICABLE';

    // Auto-reply only if it is a verified business domain (Pillar 1 or Pillar 2)
    if (routingResult.shouldAutoReply && routingResult.replyText && fromPhone) {
      const cleanPhone = fromPhone.replace(/\D/g, '');
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
            textMessage: { text: routingResult.replyText }
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        dispatchResult = res.ok ? 'DELIVERED_VIA_VPS' : 'VPS_DISPATCH_FAILED';
      } catch (err: any) {
        dispatchResult = `DISPATCH_ERROR: ${err?.message}`;
      }
    }

    return NextResponse.json({
      success: true,
      routing: routingResult,
      dispatch: dispatchResult
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
    service: 'Bethelmind Unified Multi-Business WhatsApp Router',
    phoneDesk: '0802 279 1227',
    supportedDomains: [
      'PILLAR_1_SME (Websites, Fake Alert Shields, Closers)',
      'PILLAR_2_LUXURY_REAL_ESTATE (Ikoyi, Lekki, Banana Island, Alausa Search, 80/20)',
      'PERSONAL_OR_UNKNOWN (Silenced to protect personal chats)'
    ]
  });
}
