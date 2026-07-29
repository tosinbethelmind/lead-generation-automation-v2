import { NextRequest, NextResponse } from 'next/server';
import { processTelegramWebhookUpdate } from '@/lib/telegramApprovalBot';

export const dynamic = 'force-dynamic';

/**
 * POST /api/telegram/webhook
 * Listens for Telegram Bot callback button clicks and text prompt replies
 */
export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const result = await processTelegramWebhookUpdate(update);

    return NextResponse.json({
      success: true,
      handled: result.handled,
      action: result.action || null,
      ticketId: result.ticketId || null,
    });
  } catch (err: any) {
    console.error('[Telegram Webhook Error]:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * GET /api/telegram/webhook
 * Health check endpoint for Telegram Webhook
 */
export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE',
    botService: 'Telegram Human Approval Gate',
    timestamp: new Date().toISOString(),
  });
}
