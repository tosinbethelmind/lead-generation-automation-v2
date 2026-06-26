import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${origin}/?auth=error&reason=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/?auth=error&reason=missing_code`);
  }

  const config = getRuntimeConfig();
  const clientId = config.googleClientId;
  const clientSecret = config.googleClientSecret;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/?auth=error&reason=missing_credentials`);
  }

  const redirectUri = `${origin}/api/auth/callback`;

  try {
    // Exchange authorization code for tokens
    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResp.json();

    if (!tokenResp.ok || !tokenData.access_token) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(`${origin}/?auth=error&reason=token_exchange_failed`);
    }

    // Fetch user email from Google userinfo
    const userResp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResp.json();

    // Persist OAuth tokens to config.json
    const projectId = searchParams.get('state') || ''; // state param can carry project ID
    
    // Exchange Google token for Antigravity API key
    const { exchangeGoogleForAntigravityToken } = await import('@/lib/antigravity');
    const antigravityKey = await exchangeGoogleForAntigravityToken(tokenData.access_token);
    // Persist Antigravity key alongside Google tokens
    saveLocalConfig({
      googleAccessToken: tokenData.access_token,
      googleRefreshToken: tokenData.refresh_token || config.googleRefreshToken,
      googleTokenExpiry: tokenData.expires_in ? Date.now() + tokenData.expires_in * 1000 : 0,
      googleUserEmail: userData.email || '',
      antigravityApiKey: antigravityKey,
      ...(projectId ? { googleProjectId: projectId } : {}),
    });

    return NextResponse.redirect(`${origin}/?auth=success&email=${encodeURIComponent(userData.email || 'Connected')}`);
  } catch (err: any) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(`${origin}/?auth=error&reason=${encodeURIComponent(err.message)}`);
  }
}
