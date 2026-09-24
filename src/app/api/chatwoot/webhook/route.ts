import { NextRequest, NextResponse } from 'next/server';
import { BaileysGatewayClient } from '@/lib/whatsapp/baileys_gateway_client';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * POST /api/chatwoot/webhook
 * Receives events from Chatwoot:
 * - Outgoing messages sent by Human Closer (Tosin) -> Dispatches to prospect's WhatsApp
 * - Conversation status updates & tags -> Updates CRM deal pipeline
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.event;

    const logPath = path.join(process.cwd(), 'local_db', 'chatwoot_webhook.log');
    try {
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] Event: ${event}\n`, 'utf8');
    } catch (_) {}

    // Handle outgoing message from Agent/Closer -> Dispatch to WhatsApp
    if (event === 'message_created' && body.message_type === 'outgoing' && !body.private) {
      const recipientPhone = body.conversation?.meta?.sender?.phone_number || body.sender?.phone_number;
      const content = body.content;

      if (recipientPhone && content) {
        const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');

        try {
          const baileysClient = new BaileysGatewayClient();
          await baileysClient.sendMessage({
            phone: cleanPhone,
            message: content,
            simulateTyping: true
          });

          return NextResponse.json({
            success: true,
            dispatched: true,
            channel: 'whatsapp',
            recipient: cleanPhone
          });
        } catch (dispatchErr: any) {
          console.warn('WhatsApp gateway dispatch notice:', dispatchErr.message);
        }
      }
    }

    // Handle status / tag updates
    if (event === 'conversation_status_changed' || event === 'conversation_updated') {
      const contactName = body.meta?.sender?.name || 'Prospect';
      const status = body.status;

      // Update lead journey status if lead matches
      const journeysPath = path.join(process.cwd(), 'local_db', 'lead_journeys.json');
      if (fs.existsSync(journeysPath)) {
        try {
          const journeys = JSON.parse(fs.readFileSync(journeysPath, 'utf8'));
          const match = Object.values(journeys).find((j: any) => 
            j.leadName && j.leadName.toLowerCase() === contactName.toLowerCase()
          ) as any;

          if (match && match.events) {
            match.events.push({
              title: `Chatwoot Status Updated: ${status.toUpperCase()}`,
              channelUsed: 'Chatwoot Closer Hub',
              timestamp: new Date().toISOString(),
              eventType: 'status_change',
              metadata: { chatwootId: body.id, status }
            });
            fs.writeFileSync(journeysPath, JSON.stringify(journeys, null, 2), 'utf8');
          }
        } catch (_) {}
      }
    }

    return NextResponse.json({ success: true, processedEvent: event });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * GET /api/chatwoot/webhook - Health check for Chatwoot webhook verification
 */
export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'Bethelmind Chatwoot Closer Webhook Bridge',
    timestamp: new Date().toISOString()
  });
}
