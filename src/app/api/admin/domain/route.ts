import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/session';
import { getAdminUser, checkPermission } from '@/lib/auth';

const CLOUDFLARE_API = 'https://api.cloudflare.com/client/v4/zones';
const VERCEL_API = 'https://api.vercel.com/v10/projects';

export async function POST(req: NextRequest) {
  try {
    // Verify admin token and permission
    const tokenCookie = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(tokenCookie);
    const adminUser = getAdminUser(session?.token);

    if (!adminUser || !checkPermission(adminUser, 'manage_domains')) {
      return NextResponse.json({ error: 'Forbidden. manage_domains permission required.' }, { status: 403 });
    }

    const { domain, action } = await req.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain name is required' }, { status: 400 });
    }

    const cfToken = process.env.CLOUDFLARE_TOKEN || '';
    const cfZoneId = process.env.CLOUDFLARE_ZONE_ID || '';
    const vercelToken = process.env.VERCEL_TOKEN || '';
    const projectId = process.env.VERCEL_PROJECT_ID || 'prj_xh9RFVPAaJWRbDzL2exOHWwjMD1p';
    
    // Parse teamId if orgId in project settings represents a team
    // orgId is team_wazv1qGXcoYV8evkITxITCon based on .vercel/project.json
    const teamId = 'team_wazv1qGXcoYV8evkITxITCon';

    // Sandbox check: if tokens are placeholders, run in simulated/dev mode
    const isSandbox = 
      cfToken.startsWith('cf_placeholder') || 
      vercelToken.startsWith('vc_placeholder') ||
      !cfToken || 
      !vercelToken;

    if (isSandbox) {
      console.log(`[Domain API Sandbox] Simulated action "${action}" for domain "${domain}"`);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate latency
      return NextResponse.json({
        success: true,
        sandbox: true,
        message: `[Sandbox Mode] Successfully processed "${action}" for ${domain}`
      });
    }

    // 1. Add DNS Record (CNAME) pointing to Vercel CNAME
    if (action === 'cloudflare' || action === 'all') {
      const dnsBody = {
        type: 'CNAME',
        name: domain,
        content: 'cname.vercel-dns.com',
        ttl: 1, // Automatic
        proxied: true
      };

      console.log(`[Domain API] Creating DNS CNAME record for ${domain} on Cloudflare zone ${cfZoneId}`);
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
    }

    // 2. Add Domain to Vercel Project
    if (action === 'vercel' || action === 'all') {
      console.log(`[Domain API] Attaching domain ${domain} to Vercel project ${projectId}`);
      
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
    }

    return NextResponse.json({
      success: true,
      message: `Domain ${domain} successfully configured on Cloudflare & Vercel.`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
