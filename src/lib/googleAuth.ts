// src/lib/googleAuth.ts
import { getRuntimeConfig, saveLocalConfig } from './localConfig';

/**
 * Validates and returns a fresh Google OAuth access token.
 * If the current token is expired or close to expiry, it refreshes it using the refresh token.
 */
export async function getValidAccessToken(): Promise<string> {
  const config = getRuntimeConfig();
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5-minute buffer

  if (config.googleAccessToken && config.googleTokenExpiry && config.googleTokenExpiry - bufferMs > now) {
    return config.googleAccessToken;
  }

  if (!config.googleRefreshToken || !config.googleClientId || !config.googleClientSecret) {
    throw new Error('Google OAuth credentials not configured. Please sign in again in settings.');
  }

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
    throw new Error(data.error_description || 'Google refresh token validation failed.');
  }

  // Update token details in config
  saveLocalConfig({
    googleAccessToken: data.access_token,
    googleTokenExpiry: Date.now() + (data.expires_in || 3600) * 1000,
  });

  return data.access_token;
}
