import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/contact
 * Web contact form endpoint.
 * Receives form data and forwards it to the Unified WhatsApp Command Center
 * which generates an AI draft and alerts the admin on WhatsApp for approval.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, phone, subject, message, source } = body;

    if (!message || message.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    if (!email && !phone) {
      return NextResponse.json({ success: false, error: 'Either email or phone is required' }, { status: 400 });
    }

    // Forward to Unified WhatsApp Command Center
    const COMMAND_CENTER_URL = process.env.COMMAND_CENTER_URL || 'http://127.0.0.1:3008';

    try {
      const resp = await fetch(`${COMMAND_CENTER_URL}/web-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    name    || 'Website Visitor',
          email:   email   || '',
          phone:   phone   || '',
          subject: subject || `Website Inquiry — ${source || 'Contact Form'}`,
          message: message.trim()
        }),
        signal: AbortSignal.timeout(2000)
      });

      if (resp.ok) {
        const data = await resp.json();
        return NextResponse.json({
          success: true,
          message: 'Your message has been received! We will get back to you shortly.',
          ticketId: data.ticketId
        });
      } else {
        // Command center unreachable but still acknowledge the user
        console.warn('[Contact API] Command center unreachable — logging inquiry locally.');
        console.log('[Contact API] Inquiry:', { name, email, phone, message });
        return NextResponse.json({
          success: true,
          message: 'Your message has been received! We will get back to you shortly.',
          fallback: true
        });
      }
    } catch (fetchErr: any) {
      // Still return success to the user — log internally
      console.error('[Contact API] Command center fetch error:', fetchErr.message);
      console.log('[Contact API] Fallback log — Inquiry:', { name, email, phone, message });
      return NextResponse.json({
        success: true,
        message: 'Your message has been received! We will get back to you shortly.',
        fallback: true
      });
    }
  } catch (error: any) {
    console.error('[Contact API] Unexpected error:', error.message);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/contact
 * Health check for the contact API
 */
export async function GET() {
  const COMMAND_CENTER_URL = process.env.COMMAND_CENTER_URL || 'http://localhost:3008';
  let commandCenterOnline = false;

  try {
    const resp = await fetch(`${COMMAND_CENTER_URL}/health`, {
      signal: AbortSignal.timeout(3000)
    });
    commandCenterOnline = resp.ok;
  } catch (_) {}

  return NextResponse.json({
    success: true,
    service: 'Contact Form API',
    commandCenterOnline,
    commandCenterUrl: COMMAND_CENTER_URL
  });
}
