// src/app/api/domain/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { DomainRegisterPayload } from '@/lib/hosting-types';

// Namecheap XML API – simple success check (for demo purposes)
async function registerWithNamecheap(payload: DomainRegisterPayload) {
  const url = new URL('https://api.namecheap.com/xml.response');
  url.searchParams.set('ApiUser', process.env.NAMECHEAP_API_USER ?? '');
  url.searchParams.set('ApiKey', process.env.NAMECHEAP_API_KEY ?? '');
  url.searchParams.set('UserName', process.env.NAMECHEAP_USER ?? '');
  url.searchParams.set('Command', 'namecheap.domains.create');
  url.searchParams.set('ClientIp', '0.0.0.0');
  url.searchParams.set('DomainName', payload.domain);
  url.searchParams.set('RegistrantEmail', payload.contactEmail);

  const resp = await fetch(url.toString());
  const txt = await resp.text();
  // A real implementation would parse XML; we just look for Success="true"
  return txt.includes('DomainCreateResult Success="true"');
}

export async function POST(req: NextRequest) {
  // Check authorization cookie
  const adminToken = process.env.ADMIN_TOKEN || 'admin_secret_token_123';
  const tokenCookie = req.cookies.get('admin-token')?.value;

  if (tokenCookie !== adminToken) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const payload: DomainRegisterPayload = await req.json();
    if (payload.provider !== 'namecheap') {
      return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
    }

    const success = await registerWithNamecheap(payload);
    return NextResponse.json({ success, domain: payload.domain });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
