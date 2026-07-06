// src/app/api/hosting/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { HostingCreatePayload } from '@/lib/hosting-types';

// ----- Helper functions for each provider -----
async function createVercelProject(payload: HostingCreatePayload) {
  const resp = await fetch('https://api.vercel.com/v9/projects', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN || ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.projectName,
      gitRepository: {
        type: 'github',
        repo: payload.repoUrl.split('github.com/')[1],
      },
    }),
  });
  const data = await resp.json();
  return data;
}

async function createCloudflareProject(payload: HostingCreatePayload) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
  const resp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN || ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.projectName,
      production_branch: 'main',
      source: {
        type: 'github',
        config: {
          owner: payload.repoUrl.split('github.com/')[1].split('/')[0],
          repository_name: payload.repoUrl.split('github.com/')[1].split('/')[1],
          production_branch: 'main',
        },
      },
    }),
  });
  const data = await resp.json();
  return data;
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
    const payload: HostingCreatePayload = await req.json();
    let result: any;
    switch (payload.provider) {
      case 'vercel':
        result = await createVercelProject(payload);
        break;
      case 'cloudflare':
        result = await createCloudflareProject(payload);
        break;
      default:
        return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
