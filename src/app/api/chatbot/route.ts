import { NextRequest, NextResponse } from 'next/server';
import { processChatMessage, getOrCreateChatSession } from '@/lib/chatbotEngine';

export const dynamic = 'force-dynamic';

/** GET /api/chatbot — Get chat session status */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    const sector = url.searchParams.get('sector') || 'general';
    const businessName = url.searchParams.get('business_name') || 'Bethelmind Solutions';

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'session_id is required' }, { status: 400 });
    }

    const session = await getOrCreateChatSession(sessionId, sector, businessName);
    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** POST /api/chatbot — Send message to chatbot */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, message, sector, business_name } = body;

    if (!session_id || !message) {
      return NextResponse.json({ success: false, error: 'session_id and message are required' }, { status: 400 });
    }

    const result = await processChatMessage(session_id, message, sector || 'general', business_name || 'Bethelmind Solutions');
    return NextResponse.json({ success: true, reply: result.reply, session: result.session });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
