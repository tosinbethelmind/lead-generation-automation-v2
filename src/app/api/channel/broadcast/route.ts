import { NextRequest, NextResponse } from 'next/server';
import {
  PREBUILT_CHANNEL_OFFERS,
  getNextChannelPost,
  broadcastToWhatsAppChannel,
  ChannelPostCategory
} from '@/lib/whatsappChannelEngine';
import { getRuntimeConfig } from '@/lib/localConfig';

export const dynamic = 'force-dynamic';

/**
 * GET /api/channel/broadcast
 * Returns current WhatsApp Channel configuration, rotational offers, and preview of today's post.
 */
export async function GET(req: NextRequest) {
  try {
    const config = getRuntimeConfig();
    const url = new URL(req.url);
    const category = (url.searchParams.get('category') as ChannelPostCategory) || undefined;

    const todaysPost = getNextChannelPost(category);

    return NextResponse.json({
      success: true,
      channelUrl: config.whatsappChannelUrl || 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
      businessSignature: config.businessSignature,
      currentSchedule: {
        monday: 'Offer & Flash Promo (₦185k Setup)',
        wednesday: 'Lagos SME Case Study & Results Breakdown',
        friday: 'Website Speed & Growth Hacks',
        weekend: 'Live Tech & Payment Demo'
      },
      todaysPostPreview: todaysPost,
      availableThemes: PREBUILT_CHANNEL_OFFERS.map(p => ({
        category: p.category,
        title: p.title
      }))
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch channel broadcast status' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/channel/broadcast
 * Triggers a broadcast generation, logs to CRM, and outputs formatted payload + 1-click dispatch link.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const category = body.category as ChannelPostCategory | undefined;
    const customText = body.customText as string | undefined;

    const result = await broadcastToWhatsAppChannel({
      category,
      customText
    });

    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute channel broadcast' },
      { status: 500 }
    );
  }
}
