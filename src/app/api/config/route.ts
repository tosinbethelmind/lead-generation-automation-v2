// src/app/api/config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';
import { validateSecret, maskConfig, SECRET_KEYS, MASK_VALUE } from '@/lib/validation';
import { setWorkerIndex } from '@/lib/requestContext';

/**
 * GET returns the current runtime configuration (excluding sensitive fields).
 * POST expects a JSON body with any subset of RuntimeConfig fields to merge and persist.
 */
export async function GET(req: NextRequest) {
  const workerIndex = req.headers.get('x-test-worker-index') || '';
  return setWorkerIndex(workerIndex, () => {
    const config = getRuntimeConfig();
    const masked = maskConfig(config);
    return NextResponse.json(masked);
  });
}

export async function POST(req: NextRequest) {
  const workerIndex = req.headers.get('x-test-worker-index') || '';
  return setWorkerIndex(workerIndex, async () => {
    try {
      const updates = await req.json();

      // ─── Smart normalizer helpers ───────────────────────────────────────────

      /** Strip known shell/CLI wrapper text and return the raw secret value */
      function normalizeApiKey(raw: string): string {
        let v = raw.trim();
        // Strip export KEY="..." shell assignment
        v = v.replace(/^export\s+\w+=["']?/, '').replace(/["']$/, '');
        // Strip "Bearer " or "Token " prefix
        v = v.replace(/^(Bearer|Token)\s+/i, '');
        // Strip 'Authorization: ...' header label
        v = v.replace(/^Authorization:\s*/i, '');
        // Strip "AIzaSy..." from a URL like ?key=AIzaSy... (Google)
        const keyParam = v.match(/[?&]key=([^&\s]+)/);
        if (keyParam) v = keyParam[1];
        return v.trim();
      }

      /** Parse a proxy string in any common format into http://user:pass@host:port */
      function normalizeProxy(raw: string): string {
        let proxy = raw.trim();
        // Strip trailing slashes
        proxy = proxy.replace(/\/+$/, '');
        // Full curl command  e.g. curl --proxy "http://user:pass@host:port/" ...
        const curlMatch = proxy.match(/--proxy\s+"?([^"\s]+)"?/i);
        if (curlMatch) return curlMatch[1].replace(/\/+$/, '');
        // host:port:user:pass  (common ProxyScrape / HydraProxy format)
        const colonFour = proxy.match(/^([\w.-]+):(\d+):([^:]+):(.+)$/);
        if (colonFour) return `http://${colonFour[3]}:${colonFour[4]}@${colonFour[1]}:${colonFour[2]}`;
        // Already has a protocol prefix — return as-is (trimmed)
        if (/^(http|https|socks5?):\/\//i.test(proxy)) return proxy;
        // Plain host:port (no credentials) — prefix with http://
        const colonTwo = proxy.match(/^([\w.-]+):(\d+)$/);
        if (colonTwo) return `http://${colonTwo[1]}:${colonTwo[2]}`;
        return proxy;
      }

      // ────────────────────────────────────────────────────────────────────────

      // Split string keys into arrays for rotation & backward compatibility
      if (typeof updates.geminiApiKey === 'string' && updates.geminiApiKey !== MASK_VALUE) {
        updates.geminiApiKeys = updates.geminiApiKey
          .split(/[,\n]+/)
          .map((k: string) => normalizeApiKey(k))
          .filter(Boolean);
      }
      if (typeof updates.antigravityApiKey === 'string' && updates.antigravityApiKey !== MASK_VALUE) {
        updates.antigravityApiKeys = updates.antigravityApiKey
          .split(/[,\n]+/)
          .map((k: string) => normalizeApiKey(k))
          .filter(Boolean);
      }
      if (typeof updates.antigravityModels === 'string') {
        updates.antigravityModels = updates.antigravityModels.split(/[,\n]+/).map((m: string) => m.trim()).filter(Boolean);
      }
      if (typeof updates.browserlessApiKey === 'string' && updates.browserlessApiKey !== MASK_VALUE) {
        updates.browserlessApiKeys = updates.browserlessApiKey
          .split(/[,\n]+/)
          .map((k: string) => {
            let v = k.trim();
            // Strip full WSS URL — extract token param: wss://chrome.browserless.io?token=TOKEN
            const wsToken = v.match(/[?&]token=([^&\s]+)/i);
            if (wsToken) return wsToken[1];
            // Strip Bearer/Authorization headers
            return normalizeApiKey(v);
          })
          .filter(Boolean);
      }
      if (typeof updates.browserbaseApiKey === 'string' && updates.browserbaseApiKey !== MASK_VALUE) {
        updates.browserbaseApiKeys = updates.browserbaseApiKey
          .split(/[,\n]+/)
          .map((k: string) => {
            let v = k.trim();
            // Strip full WSS URL — extract apiKey param: wss://connect.browserbase.com?apiKey=KEY
            const wsKey = v.match(/[?&]apiKey=([^&\s]+)/i);
            if (wsKey) return wsKey[1];
            return normalizeApiKey(v);
          })
          .filter(Boolean);
      }
      if (typeof updates.googlePlacesApiKey === 'string' && updates.googlePlacesApiKey !== MASK_VALUE) {
        // Users might paste a Google Maps URL — extract the key param
        const keyInUrl = updates.googlePlacesApiKey.match(/[?&]key=([^&\s]+)/);
        if (keyInUrl) updates.googlePlacesApiKey = keyInUrl[1];
        else updates.googlePlacesApiKey = normalizeApiKey(updates.googlePlacesApiKey);
      }
      if (typeof updates.webshareProxies === 'string' && updates.webshareProxies !== MASK_VALUE) {
        updates.webshareProxies = updates.webshareProxies
          .split(/[,\n]+/)
          .map((p: string) => normalizeProxy(p))
          .filter(Boolean);
      }
      if (typeof updates.proxyPool === 'string' && updates.proxyPool !== MASK_VALUE) {
        updates.proxyPool = updates.proxyPool
          .split(/[,\n]+/)
          .map((p: string) => normalizeProxy(p))
          .filter(Boolean)
          .join(',');
      }

      // Validate Antigravity API keys array (max 10)
      if (Array.isArray(updates.antigravityApiKeys)) {
        if (updates.antigravityApiKeys.length > 10) {
          return NextResponse.json({ error: 'Maximum of 10 Antigravity API keys allowed' }, { status: 400 });
        }
      }

      // Validate Gemini API keys array (max 10)
      if (Array.isArray(updates.geminiApiKeys)) {
        if (updates.geminiApiKeys.length > 10) {
          return NextResponse.json({ error: 'Maximum of 10 Gemini API keys allowed' }, { status: 400 });
        }
      }

      // Validate Browserless API keys array (max 10)
      if (Array.isArray(updates.browserlessApiKeys)) {
        if (updates.browserlessApiKeys.length > 10) {
          return NextResponse.json({ error: 'Maximum of 10 Browserless API keys allowed' }, { status: 400 });
        }
      }

      // Validate Browserbase API keys array (max 10)
      if (Array.isArray(updates.browserbaseApiKeys)) {
        if (updates.browserbaseApiKeys.length > 10) {
          return NextResponse.json({ error: 'Maximum of 10 Browserbase API keys allowed' }, { status: 400 });
        }
      }

      // Validate Webshare proxies array (max 20)
      if (Array.isArray(updates.webshareProxies)) {
        if (updates.webshareProxies.length > 20) {
          return NextResponse.json({ error: 'Maximum of 20 Webshare proxies allowed' }, { status: 400 });
        }
      }


      // Validate updates
      for (const [key, value] of Object.entries(updates)) {
        if (SECRET_KEYS.includes(key)) {
          // If the value is the mask value, or an array containing it, retain the existing secrets
          if (value === MASK_VALUE) {
            delete updates[key];
            continue;
          }

          if (Array.isArray(value) && value.some(val => val === MASK_VALUE)) {
            const currentConfig = getRuntimeConfig();
            const currentArray = currentConfig[key as keyof typeof currentConfig];
            if (Array.isArray(currentArray)) {
              // Reconstruct array by replacing MASK_VALUE with original secret from current configuration
              const mergedArray = value.map((item, idx) => {
                if (item === MASK_VALUE) {
                  return currentArray[idx] || '';
                }
                return item;
              }).filter(Boolean);
              updates[key] = mergedArray;
            } else {
              delete updates[key];
              continue;
            }
          }

          // Validate the merged/new value
          const updatedValue = updates[key];
          if (typeof updatedValue === 'string') {
            const validationError = validateSecret(key, updatedValue);
            if (validationError) {
              return NextResponse.json({ error: validationError }, { status: 400 });
            }
          } else if (Array.isArray(updatedValue)) {
            for (const item of updatedValue) {
              if (typeof item === 'string' && item !== MASK_VALUE) {
                const singularKey = key.endsWith('s') ? key.slice(0, -1) : key;
                const validationError = validateSecret(singularKey, item);
                if (validationError) {
                  return NextResponse.json({ error: validationError }, { status: 400 });
                }
              }
            }
          }
        }
      }

      const newConfig = saveLocalConfig(updates);
      return NextResponse.json({ success: true, config: maskConfig(newConfig) });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  });
}
