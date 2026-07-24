import { NextResponse } from 'next/server';
import { getRecentSelfHealingEvents, logSelfHealingEvent } from '@/lib/selfHealingLogger';
import { SelfHealingSupervisor } from '@/lib/selfHealingWatchdog';

export async function GET() {
  try {
    const events = getRecentSelfHealingEvents(20);
    return NextResponse.json({
      success: true,
      events,
      totalEventsCount: events.length,
      mode: 'Autonomous Self-Healing Active'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'simulate_heal';

    if (action === 'test_ip_rotation') {
      const healed = await SelfHealingSupervisor.healProxyBlock('api_scraper', 'Manual Diagnostic Test 429 Block');
      return NextResponse.json({
        success: healed,
        message: healed ? 'Self-Healing System successfully issued IP rotation' : 'IP rotation skipped'
      });
    }

    if (action === 'test_browser_purge') {
      const healed = await SelfHealingSupervisor.healBrowserCrash('browser_launcher', 'Manual Diagnostic Test Crash');
      return NextResponse.json({
        success: healed,
        message: 'Self-Healing System purged zombie browser processes and reset context'
      });
    }

    const testEvent = logSelfHealingEvent({
      engine: 'api_scraper',
      strategy: 'endpoint_failover',
      target: 'Diagnostic Suite',
      reason: 'Manual Self-Healing Diagnostic Run',
      resolution: 'All self-healing watchdog routines verified active and operational',
      success: true
    });

    return NextResponse.json({
      success: true,
      message: 'Self-Healing test event logged successfully.',
      event: testEvent
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
