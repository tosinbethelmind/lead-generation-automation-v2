import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig } from '@/lib/localConfig';

export async function GET(req: NextRequest) {
  const config = getRuntimeConfig();
  const clientId = config.googleClientId;

  if (!clientId) {
    return NextResponse.json(
      { error: "Google OAuth Client ID is not configured. Go to the Settings tab to set your Google Client ID and Client Secret." },
      { status: 400 }
    );
  }

  const redirectUri = `${new URL(req.url).origin}/api/auth/callback`;
  const scopes = [
    // Sheets DB
    'https://www.googleapis.com/auth/spreadsheets',
    // Gmail outreach
    'https://www.googleapis.com/auth/gmail.send',
    // Google Places scraping (for API key reuse via OAuth)
    'https://www.googleapis.com/auth/cloud-platform',
    // Vertex AI Gemini (no API key needed)
    'https://www.googleapis.com/auth/cloud-platform.read-only',
    // User identity
    'https://www.googleapis.com/auth/userinfo.email',
    'openid',
    'profile',
  ];

  const state = new URL(req.url).searchParams.get('state') || '';

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scopes.join(' '))}&` +
    `access_type=offline&` +
    `prompt=${config.googleRefreshToken ? 'select_account' : 'consent'}` +
    (state ? `&state=${encodeURIComponent(state)}` : '');

  return NextResponse.redirect(authUrl);
}
