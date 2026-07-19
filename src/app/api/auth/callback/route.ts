import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const useClaspRedirect = searchParams.get('use_clasp_redirect') === 'true';

  const handleError = (reason: string) => {
    if (useClaspRedirect) {
      return NextResponse.json({ error: reason }, { status: 400 });
    }
    return NextResponse.redirect(`${origin}/?auth=error&reason=${encodeURIComponent(reason)}`);
  };

  if (error) {
    return handleError(error);
  }

  if (!code) {
    return handleError('missing_code');
  }

  const config = getRuntimeConfig();
  const clientId = config.googleClientId;
  const clientSecret = config.googleClientSecret;

  if (!clientId || !clientSecret) {
    return handleError('missing_credentials');
  }

  const redirectUri = useClaspRedirect ? 'http://localhost:9005' : `${origin}/api/auth/callback`;

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
      return handleError('token_exchange_failed');
    }

    // Fetch user email from Google userinfo
    const userResp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResp.json();

    // Persist OAuth tokens to config.json
    const projectId = searchParams.get('state') || ''; // state param can carry project ID
    
    // Exchange Google token for Antigravity API key (non-blocking)
    let antigravityKey = '';
    try {
      const { exchangeGoogleForAntigravityToken } = await import('@/lib/antigravity');
      antigravityKey = await exchangeGoogleForAntigravityToken(tokenData.access_token) || '';
    } catch (antigravityErr) {
      console.error('Antigravity token exchange failed (non-blocking):', antigravityErr);
    }

    // Persist Antigravity key alongside Google tokens
    const isNewAccount = !!(config.googleUserEmail && userData.email && userData.email !== config.googleUserEmail);
    const finalRefreshToken = tokenData.refresh_token || (isNewAccount ? '' : config.googleRefreshToken);

    if (!finalRefreshToken) {
      console.error('[OAuth Callback] Missing refresh token for account:', userData.email);
      return handleError('missing_refresh_token_reauth_required');
    }

    saveLocalConfig({
      googleAccessToken: tokenData.access_token,
      googleRefreshToken: finalRefreshToken,
      googleTokenExpiry: tokenData.expires_in ? Date.now() + tokenData.expires_in * 1000 : 0,
      googleUserEmail: userData.email || '',
      antigravityApiKey: antigravityKey || config.antigravityApiKey,
      ...(projectId ? { googleProjectId: projectId } : {}),
    });

    if (useClaspRedirect) {
      return NextResponse.json({ success: true, email: userData.email });
    }

    return NextResponse.redirect(`${origin}/?auth=success&email=${encodeURIComponent(userData.email || 'Connected')}`);
  } catch (err: any) {
    console.error('OAuth callback error:', err);
    return handleError(err.message);
  }
}
