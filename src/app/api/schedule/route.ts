import { NextRequest, NextResponse } from 'next/server';
import { getMonthlySchedule, saveMonthlySchedule, generateAISchedule, queueNextPendingQuery } from '@/lib/queryScheduler';

export async function GET() {
  try {
    const schedule = await getMonthlySchedule();
    return NextResponse.json({ success: true, schedule });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, nicheFocus, locationFocus, force } = body;

    if (action === 'generate') {
      console.log('[API Schedule] Triggering AI schedule generation...');
      const schedule = await generateAISchedule(nicheFocus, locationFocus);
      return NextResponse.json({ success: true, message: 'AI schedule generated successfully', schedule });
    }

    if (action === 'trigger-next') {
      console.log(`[API Schedule] Triggering next pending query (force=${!!force})...`);
      const queued = await queueNextPendingQuery(!!force);
      if (queued) {
        return NextResponse.json({ success: true, message: 'Dispatched campaign query', queued });
      } else {
        return NextResponse.json({ success: true, message: 'No pending queries or pacing limit active', queued: null });
      }
    }

    // Default action: save/update full schedule
    if (body.schedule) {
      await saveMonthlySchedule(body.schedule);
      return NextResponse.json({ success: true, message: 'Schedule saved successfully', schedule: body.schedule });
    }

    return NextResponse.json({ success: false, error: 'Invalid action or request body' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
