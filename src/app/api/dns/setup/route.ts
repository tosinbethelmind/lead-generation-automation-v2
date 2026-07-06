// src/app/api/dns/setup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { DnsSetupPayload } from '@/lib/hosting-types';

/**
 * Cloudflare DNS record creator – works for free tier.
 * Expects `zoneId` that matches the domain's zone in Cloudflare.
 */
async function createCnameRecord(payload: DnsSetupPayload) {
  const resp = await fetch(`https://api.cloudflare.com/client/v4/zones/${payload.zoneId}/dns_records`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_TOKEN || ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'CNAME',
      name: payload.domain,
      content: new URL(payload.targetUrl).hostname,
      ttl: 1,
      proxied: true,
    }),
  });
  const data = await resp.json();
  return data.success;
}

export async function POST(req: NextRequest) {
  // Check authorization cookie
  const adminToken = process.env.ADMIN_TOKEN || 'admin_secret_token_123';
  const tokenCookie = req.cookies.get('admin-token')?.value;

  if (tokenCookie !== adminToken) {
    // Return unauthorized only if not running locally in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const payload: DnsSetupPayload = await req.json();
    const success = await createCnameRecord(payload);
    return NextResponse.json({ success, domain: payload.domain });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 550 });
  }
}
