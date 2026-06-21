import { sendMarketingEmail } from '@/lib/email';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body } = await req.json();
    if (!to) {
      return new Response(JSON.stringify({ error: 'Missing "to" address' }), { status: 400 });
    }
    const ok = await sendMarketingEmail(to, subject, body);
    return new Response(JSON.stringify({ success: ok }), { status: ok ? 200 : 500 });
  } catch (err: any) {
    console.error('[marketing/send] error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), { status: 500 });
  }
}
