import { NextRequest, NextResponse } from 'next/server';

const CLOUDFLARE_API = 'https://api.cloudflare.com/client/v4/zones';

function verifyPassword(req: NextRequest): boolean {
  const password = req.headers.get('x-admin-password');
  const expected = process.env.ADMIN_PASSWORD || 'admin123';
  return password === expected;
}

export async function POST(req: NextRequest, context: any) {
  if (!verifyPassword(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = typeof context?.params?.then === 'function'
    ? await context.params
    : context?.params;
  const siteId = resolvedParams?.siteId;

  if (!siteId) {
    return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { domain, proxied = true } = body;

    if (!domain) {
      return NextResponse.json({ error: 'domain is required' }, { status: 400 });
    }

    const cfToken = process.env.CLOUDFLARE_TOKEN || '';
    const cfZoneId = process.env.CLOUDFLARE_ZONE_ID || '';

    const isSandbox = cfToken.startsWith('cf_placeholder') || !cfToken;

    if (isSandbox) {
      console.log(`[Cloudflare Hosting Sandbox] Simulated CNAME record registration for site ${siteId} -> ${domain}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json({
        success: true,
        sandbox: true,
        message: `[Sandbox] DNS configured for site ${siteId} -> ${domain}.`
      });
    }

    const dnsBody = {
      type: 'CNAME',
      name: domain,
      content: 'cname.vercel-dns.com',
      ttl: 1,
      proxied: !!proxied
    };

    console.log(`[Cloudflare Hosting API] Creating DNS CNAME record for site ${siteId} (${domain})`);
    const dnsRes = await fetch(`${CLOUDFLARE_API}/${cfZoneId}/dns_records`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dnsBody)
    });

    const dnsData = await dnsRes.json();
    if (!dnsRes.ok || !dnsData.success) {
      const errorMsg = dnsData?.errors?.[0]?.message || 'Cloudflare DNS provisioning error';
      throw new Error(`Cloudflare: ${errorMsg}`);
    }

    return NextResponse.json({
      success: true,
      message: `Cloudflare DNS successfully configured for site ${siteId} -> ${domain}.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
