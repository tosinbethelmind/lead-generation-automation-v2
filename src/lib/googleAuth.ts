// src/lib/googleAuth.ts
import { getRuntimeConfig, saveLocalConfig } from './localConfig';
import { exec } from 'child_process';

/**
 * Automatically launches the Google Auth consent flow in the user's default web browser
 * if running in a local environment (development or local runner).
 */
export function triggerLocalAuthOpen(prompt: string = 'select_account consent') {
  // If we are on Vercel or in a non-local production environment, do nothing
  if (process.env.VERCEL || (process.env.NODE_ENV === 'production' && !process.env.IS_LOCAL_RUNNER)) {
    console.log('[Google Auth] Skipping browser launch in non-local production environment.');
    return;
  }

  const port = process.env.PORT || '3006';
  const url = `http://localhost:${port}/api/auth/google?prompt=${encodeURIComponent(prompt)}`;

  console.log(`[Google Auth] Authentication required. Automatically launching auth URL in browser: ${url}`);

  try {
    const startCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open';
    exec(`${startCmd} "${url.replace(/"/g, '\\"')}"`, (err) => {
      if (err) {
        console.error('[Google Auth] Failed to automatically open browser:', err);
      }
    });
  } catch (err) {
    console.error('[Google Auth] Exception when trying to open browser:', err);
  }
}

/**
 * Validates and returns a fresh Google OAuth access token.
 * If the current token is expired or close to expiry, it refreshes it using the refresh token.
 * If the refresh fails or credentials are missing, it triggers local browser authentication.
 */
export async function getValidAccessToken(): Promise<string> {
  const config = getRuntimeConfig();
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5-minute buffer

  if (config.googleAccessToken && config.googleTokenExpiry && config.googleTokenExpiry - bufferMs > now) {
    return config.googleAccessToken;
  }

  if (!config.googleRefreshToken || !config.googleClientId || !config.googleClientSecret) {
    console.warn('[Google Auth] Credentials missing. Triggering local browser sign-in...');
    triggerLocalAuthOpen('select_account consent');
    throw new Error('Google OAuth credentials not configured. A browser window has been opened to sign in.');
  }

  try {
    const resp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.googleClientId,
        client_secret: config.googleClientSecret,
        refresh_token: config.googleRefreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const data = await resp.json();
    if (!resp.ok || !data.access_token) {
      console.warn('[Google Auth] Token refresh failed. Triggering local browser re-authentication...', data);
      triggerLocalAuthOpen('select_account consent');
      throw new Error(data.error_description || 'Google refresh token validation failed. A browser window has been opened to re-authenticate.');
    }

    // Update token details in config
    saveLocalConfig({
      googleAccessToken: data.access_token,
      googleTokenExpiry: Date.now() + (data.expires_in || 3600) * 1000,
    });

    return data.access_token;
  } catch (err: any) {
    // If it's an authentication error (like invalid_grant), open browser
    if (err.message && (err.message.includes('validation failed') || err.message.includes('invalid_grant') || err.message.includes('expired'))) {
      triggerLocalAuthOpen('select_account consent');
    }
    throw err;
  }
}
