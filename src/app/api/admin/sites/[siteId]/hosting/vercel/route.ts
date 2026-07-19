import { NextRequest, NextResponse } from 'next/server';

const VERCEL_API = 'https://api.vercel.com/v10/projects';

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
    const { domain } = body;

    if (!domain) {
      return NextResponse.json({ error: 'domain is required' }, { status: 400 });
    }

    const vercelToken = process.env.VERCEL_TOKEN || '';
    const projectId = process.env.VERCEL_PROJECT_ID || 'prj_xh9RFVPAaJWRbDzL2exOHWwjMD1p';
    const teamId = 'team_wazv1qGXcoYV8evkITxITCon';

    const isSandbox = vercelToken.startsWith('vc_placeholder') || !vercelToken;

    if (isSandbox) {
      console.log(`[Vercel Hosting Sandbox] Simulated binding for site ${siteId} -> ${domain}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json({
        success: true,
        sandbox: true,
        message: `[Sandbox] Domain ${domain} bound to Vercel project for site ${siteId}.`
      });
    }

    console.log(`[Vercel Hosting API] Attaching domain ${domain} to Vercel project ${projectId} for site ${siteId}`);
    
    const vercelUrl = `${VERCEL_API}/${projectId}/domains${teamId ? `?teamId=${teamId}` : ''}`;
    const vercelRes = await fetch(vercelUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: domain })
    });

    const vercelData = await vercelRes.json();
    if (!vercelRes.ok || vercelData.error) {
      const errorMsg = vercelData?.error?.message || 'Vercel domain mapping error';
      throw new Error(`Vercel: ${errorMsg}`);
    }

    return NextResponse.json({
      success: true,
      message: `Domain ${domain} successfully bound to Vercel project for site ${siteId}.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
