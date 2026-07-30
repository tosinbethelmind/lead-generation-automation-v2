import { NextResponse } from 'next/server';
import { getRecentLeadJourneys, getLeadJourney, trackLeadJourneyEvent, JourneyStage } from '@/lib/leadJourneyTracker';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('leadId');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    if (leadId) {
      const journey = getLeadJourney(leadId);
      if (!journey) {
        return NextResponse.json({ success: false, error: 'Lead journey not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, journey });
    }

    const recentJourneys = getRecentLeadJourneys(limit);
    return NextResponse.json({
      success: true,
      totalTracked: recentJourneys.length,
      journeys: recentJourneys
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      leadId,
      leadName,
      category,
      phone,
      email,
      stage,
      title,
      description,
      channelUsed,
      score,
      previewUrl,
      metadata
    } = body;

    if (!leadId || !leadName || !stage || !title) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: leadId, leadName, stage, title'
      }, { status: 400 });
    }

    const event = await trackLeadJourneyEvent({
      leadId,
      leadName,
      category,
      phone,
      email,
      stage: stage as JourneyStage,
      title,
      description: description || `Advanced to stage ${stage}`,
      channelUsed,
      score,
      previewUrl,
      metadata
    });

    return NextResponse.json({
      success: true,
      message: `Lead journey updated for ${leadName}`,
      event
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
