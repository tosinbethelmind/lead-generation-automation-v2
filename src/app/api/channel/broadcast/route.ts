import { NextRequest, NextResponse } from 'next/server';
import {
  VIRAL_CHANNEL_ROTATION,
  getTodaysViralPost,
  broadcastViralChannelUpdate,
  ChannelPostCategory
} from '@/lib/whatsappChannelEngine';
import { getRuntimeConfig } from '@/lib/localConfig';

export const dynamic = 'force-dynamic';

/**
 * GET /api/channel/broadcast
 * Returns current WhatsApp Channel configuration, 7-day viral rotation, and preview of today's post.
 */
export async function GET(req: NextRequest) {
  try {
    const config = getRuntimeConfig();
    const url = new URL(req.url);
    const category = (url.searchParams.get('category') as ChannelPostCategory) || undefined;

    const todaysPost = getTodaysViralPost(category);

    return NextResponse.json({
      success: true,
      channelUrl: config.whatsappChannelUrl || 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
      businessSignature: config.businessSignature || '*Bethelmind Analytics Lagos Team*',
      adminDeskPhone: config.adminWhatsAppPhone || '08022791227',
      currentSchedule: {
        monday: 'Industry Teardown & Leak Audit (High Group Forwards)',
        tuesday: 'Plug-and-Play Swipe File & Script (Saves & Shares)',
        wednesday: 'Live Case Study & Revenue Breakdown (Proof & Authority)',
        thursday: 'Interactive Poll & Reaction Spike (Boosts Directory Rank)',
        friday: '1-Tap DM Conversion Offer (3 Slots ₦0 Upfront Preview)',
        saturday: 'Build In Public & Tech Architecture',
        sunday: 'Weekly Master Asset Pack & Strategy Recap'
      },
      todaysPostPreview: todaysPost,
      availableThemes: VIRAL_CHANNEL_ROTATION.map(p => ({
        category: p.category,
        dayOfWeek: p.dayOfWeek,
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
 * Triggers a broadcast generation, logs to CRM, and outputs formatted payload + 1-click dispatch links.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const category = body.category as ChannelPostCategory | undefined;
    const customText = body.customText as string | undefined;
    const dispatchDirectBaileys = body.dispatchDirectBaileys as boolean | undefined;

    const result = await broadcastViralChannelUpdate({
      category,
      customText,
      dispatchDirectBaileys
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
