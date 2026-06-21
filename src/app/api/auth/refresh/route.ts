// src/app/api/auth/refresh/route.ts
import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/googleAuth';
import { getRuntimeConfig } from '@/lib/localConfig';

export async function POST() {
  try {
    const token = await getValidAccessToken();
    const config = getRuntimeConfig();
    return NextResponse.json({
      success: true,
      accessToken: token,
      expiry: config.googleTokenExpiry
    });
  } catch (err: any) {
    console.error('Google token refresh route error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  // Support GET checks if needed
  try {
    const token = await getValidAccessToken();
    const config = getRuntimeConfig();
    return NextResponse.json({
      success: true,
      accessToken: token,
      expiry: config.googleTokenExpiry
    });
  } catch (err: any) {
    console.error('Google token refresh route error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
