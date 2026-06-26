import fetch from 'node-fetch';

/**
 * Exchange a Google OAuth access token for an Antigravity API key.
 * This is a placeholder – replace the URL and payload with the real Antigravity endpoint.
 */
export async function exchangeGoogleForAntigravityToken(googleAccessToken: string): Promise<string> {
  // Example endpoint – adjust according to Antigravity docs
  const endpoint = 'https://api.antigravity.ai/v1/token/exchange';
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${googleAccessToken}`,
    },
    body: JSON.stringify({ grant_type: 'google', token: googleAccessToken }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Antigravity token exchange failed: ${resp.status} ${err}`);
  }

  const data = (await resp.json()) as { antigravityApiKey: string };
  if (!data.antigravityApiKey) {
    throw new Error('Antigravity response missing antigravityApiKey');
  }
  return data.antigravityApiKey;
}
