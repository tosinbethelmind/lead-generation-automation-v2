import { NextRequest, NextResponse } from 'next/server';
import { sendMetaCloudTextMessage } from '@/lib/whatsapp/metaCloudClient';
import { handleInboundLeadMessage } from '@/lib/monetization/postContactCloserEngine';

const VERIFY_TOKEN = process.env.META_WA_VERIFY_TOKEN || process.env.WHATSAPP_CLOUD_VERIFY_TOKEN || 'bethelmind_meta_webhook_2026';

/**
 * GET: Meta Webhook Verification Challenge
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[Meta WhatsApp Webhook] Challenge verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden. Invalid verification token.' }, { status: 403 });
}

/**
 * POST: Incoming WhatsApp Message & Status Events
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate payload structure
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0]?.value;

    // 1. Process Status Updates (delivered, read, sent)
    if (changes?.statuses?.length) {
      const status = changes.statuses[0];
      // Log status if needed
      return NextResponse.json({ status: 'ok', event: 'status_ack', messageId: status.id });
    }

    // 2. Process Inbound Messages
    if (changes?.messages?.length) {
      const messageObj = changes.messages[0];
      const fromPhone = messageObj.from; // e.g. 2348022791227
      const messageId = messageObj.id;

      let inboundText = '';
      if (messageObj.type === 'text') {
        inboundText = messageObj.text?.body || '';
      } else if (messageObj.type === 'button') {
        inboundText = messageObj.button?.text || '';
      } else if (messageObj.type === 'interactive') {
        inboundText = messageObj.interactive?.button_reply?.title || messageObj.interactive?.list_reply?.title || '';
      }

      console.log(`[Meta WhatsApp Inbound] From: ${fromPhone} | Text: "${inboundText}"`);

      if (inboundText && fromPhone) {
        // Trigger Inbound AI Closer Engine in background (<3s response)
        handleInboundLeadMessage({
          senderPhone: fromPhone,
          messageBody: inboundText,
          channel: 'WHATSAPP_META_CLOUD'
        }).then(async (aiReply: any) => {
          if (aiReply && aiReply.replyText) {
            await sendMetaCloudTextMessage(fromPhone, aiReply.replyText);
            console.log(`[Meta WhatsApp Inbound] AI Closer replied to ${fromPhone}`);
          }
        }).catch((err: any) => {
          console.error(`[Meta WhatsApp Inbound] Error in AI closer reply:`, err);
        });
      }

      return NextResponse.json({ status: 'ok', event: 'message_received', id: messageId });
    }

    return NextResponse.json({ status: 'ok', event: 'unhandled_event' });
  } catch (error: any) {
    console.error('[Meta WhatsApp Webhook Error]:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
