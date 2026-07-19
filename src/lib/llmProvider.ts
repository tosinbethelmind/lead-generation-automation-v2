import { RuntimeConfig, getRuntimeConfig } from '@/lib/localConfig';
import { getValidAccessToken } from '@/lib/googleAuth';
import {
  generateCopyWithGeminiApiKey,
  generateCopyWithVertexAI,
  buildFallbackCopy,
  GeneratedSiteResponse,
  buildGenerationPrompt
} from './designGenerator';

/**
 * Placeholder for Claude generation. Replace with actual Claude endpoint when needed.
 */
export async function generateCopyWithClaude(lead: any, apiKey: string): Promise<GeneratedSiteResponse> {
  // For now, just return fallback copy. In production, call Claude API.
  console.warn('Claude generation not implemented, using fallback copy');
  return { copy: buildFallbackCopy(lead) };
}

/**
 * Placeholder for OpenAI GPT generation. Replace with actual OpenAI endpoint when needed.
 */
export async function generateCopyWithOpenAI(lead: any, apiKey: string): Promise<GeneratedSiteResponse> {
  console.warn('OpenAI generation not implemented, using fallback copy');
  return { copy: buildFallbackCopy(lead) };
}

/**
 * Placeholder for Anthropic generation. Replace with actual Anthropic API call when needed.
 */
export async function generateCopyWithAnthropic(lead: any, apiKey: string): Promise<GeneratedSiteResponse> {
  console.warn('Anthropic generation not implemented, using fallback copy');
  return { copy: buildFallbackCopy(lead) };
}

/**
 * Placeholder for Cohere generation. Replace with actual Cohere API call when needed.
 */
export async function generateCopyWithCohere(lead: any, apiKey: string): Promise<GeneratedSiteResponse> {
  console.warn('Cohere generation not implemented, using fallback copy');
  return { copy: buildFallbackCopy(lead) };
}

/**
 * Placeholder for Mistral generation. Replace with actual Mistral API call when needed.
 */
export async function generateCopyWithMistral(lead: any, apiKey: string): Promise<GeneratedSiteResponse> {
  console.warn('Mistral generation not implemented, using fallback copy');
  return { copy: buildFallbackCopy(lead) };
}

/**
 * Call Antigravity/Google Cloud Assist API via cloudcode-pa.googleapis.com using OAuth credentials.
 */
export async function generateCopyWithAntigravityModel(lead: any, model: string, apiKey: string): Promise<GeneratedSiteResponse> {
  const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID || '';
  const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET || '';

  // Normalize model
  let targetModel = model || 'gemini-2.5-flash';
  const m = targetModel.toLowerCase().replace(/_/g, '-');
  if (m === 'gemini-flash-high') targetModel = 'gemini-2.5-flash';
  else if (m === 'gemini-pro-low') targetModel = 'gemini-2.5-pro';
  else if (m === 'gpt-oss') targetModel = 'gpt-oss-120b-medium';
  else if (m === 'claude' || m === 'sonneta') targetModel = 'claude-sonnet-4-6';
  else if (m === 'opus') targetModel = 'claude-opus-4-6-thinking';

  // 1. Refresh Google access token using the key as refresh token
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const refreshResp = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: apiKey,
      grant_type: 'refresh_token',
    }),
  });

  if (!refreshResp.ok) {
    const errText = await refreshResp.text();
    throw new Error(`Antigravity OAuth refresh failed for key ${apiKey.slice(0, 10)}...: ${errText}`);
  }

  const tokenData = await refreshResp.json();
  const accessToken = tokenData.access_token;

  // 2. Query loadCodeAssist to retrieve projectId dynamically
  const codeAssistEp = 'https://cloudcode-pa.googleapis.com/v1internal:loadCodeAssist';
  const assistResp = await fetch(codeAssistEp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'Antigravity/4.1.29'
    },
    body: JSON.stringify({ metadata: { ideType: 'ANTIGRAVITY' } }),
  });

  if (!assistResp.ok) {
    const errText = await assistResp.text();
    throw new Error(`loadCodeAssist failed: ${errText}`);
  }

  const assistData = await assistResp.json();
  const projectId = assistData.cloudaicompanionProject || 'cloudaicompanion-enterprise';

  // 3. Prepare Vertex-style prompt contents
  const prompt = buildGenerationPrompt(lead);

  // 4. Call generateContent
  const generateEp = 'https://cloudcode-pa.googleapis.com/v1internal:generateContent';
  const generateResp = await fetch(generateEp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'Antigravity/4.1.29'
    },
    body: JSON.stringify({
      project: projectId,
      model: targetModel,
      request: {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
        }
      }
    }),
  });

  if (!generateResp.ok) {
    const errText = await generateResp.text();
    let parsedError = errText;
    try {
      const errObj = JSON.parse(errText);
      parsedError = errObj.error?.message || errObj.message || errText;
    } catch (_) {}
    throw new Error(`generateContent failed for model ${targetModel}: ${parsedError}`);
  }

  const generateData = await generateResp.json();
  const content = generateData.response?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error('Antigravity API returned an empty completion response.');
  }

  // Try parsing content as JSON
  let parsedContent;
  try {
    const cleaned = content.replace(/```json\s*|```/g, '').trim();
    parsedContent = JSON.parse(cleaned);
  } catch (parseErr: any) {
    throw new Error(`Failed to parse Antigravity completion as JSON: ${parseErr.message}. Content was: ${content}`);
  }

  if (!parsedContent.copy) {
    throw new Error('Parsed Antigravity response is missing the "copy" field.');
  }

  return parsedContent;
}

/**
 * Main entry point attempting multiple LLM providers in order of preference.
 * Tries each Antigravity key/model pool, then Gemini, Vertex, Claude, etc.,
 * and finally deterministic fallback.
 */
export async function generateCopyWithProviders(lead: any): Promise<GeneratedSiteResponse> {
  const config: RuntimeConfig = getRuntimeConfig();
  
  // If on‑ground mode is enabled, skip all remote LLM calls and use deterministic fallback.
  if (config.onGroundMode ?? false) {
    console.info('On‑ground mode enabled – using deterministic fallback copy');
    return { copy: buildFallbackCopy(lead) };
  }

  // 1. Gather Antigravity keys (array), include single key for backward compatibility.
  const antigravityKeys: string[] = [];
  if (Array.isArray(config.antigravityApiKeys) && config.antigravityApiKeys.length) {
    antigravityKeys.push(...config.antigravityApiKeys);
  }
  if (config.antigravityApiKey) {
    const splitKeys = config.antigravityApiKey.split(',').map(k => k.trim()).filter(Boolean);
    antigravityKeys.push(...splitKeys);
  }

  // Try Antigravity first!
  if (antigravityKeys.length && Array.isArray(config.antigravityModels) && config.antigravityModels.length) {
    for (const key of antigravityKeys) {
      for (const model of config.antigravityModels) {
        try {
          console.info(`Attempting Antigravity generation: model=${model}, key=${key.slice(0, 10)}...`);
          const resp = await generateCopyWithAntigravityModel(lead, model, key);
          return resp;
        } catch (err: any) {
          console.warn(`Antigravity model ${model} with key ${key.slice(0, 10)}... failed:`, err.message);
          if (
            err.message.includes('429') ||
            err.message.toLowerCase().includes('exhausted') ||
            err.message.toLowerCase().includes('refresh failed') ||
            err.message.toLowerCase().includes('loadcodeassist')
          ) {
            console.warn(`Account-level issue detected on key ${key.slice(0, 10)}..., skipping remaining models for this account.`);
            break; // Try next account/key
          }
        }
      }
    }
  }

  // 2. Gather Gemini keys (array), include single key for backward compatibility.
  const geminiKeys: string[] = [];
  if (Array.isArray(config.geminiApiKeys) && config.geminiApiKeys.length) {
    geminiKeys.push(...config.geminiApiKeys);
  }
  if (config.geminiApiKey) {
    const splitKeys = config.geminiApiKey.split(',').map(k => k.trim()).filter(Boolean);
    geminiKeys.push(...splitKeys);
  }

  for (const key of geminiKeys) {
    try {
      const resp = await generateCopyWithGeminiApiKey(lead, key);
      return resp;
    } catch (err: any) {
      console.warn(`Gemini key error, trying next key. Key prefix: ${key.slice(0, 6)}... Error: ${err.message}`);
    }
  }

  // 3. Google Vertex AI fallback if configured.
  if (config.googleProjectId && config.googleRefreshToken) {
    try {
      const accessToken = await getValidAccessToken();
      return await generateCopyWithVertexAI(lead, accessToken, config.googleProjectId);
    } catch (err: any) {
      console.warn('Vertex AI generation failed:', err.message);
    }
  }

  // 4. Claude fallback if configured.
  if (config.claudeApiKey) {
    try {
      return await generateCopyWithClaude(lead, config.claudeApiKey);
    } catch (err: any) {
      console.warn('Claude generation failed:', err.message);
    }
  }

  // 5. OpenAI fallback if configured.
  if (config.openaiApiKey) {
    try {
      return await generateCopyWithOpenAI(lead, config.openaiApiKey);
    } catch (err: any) {
      console.warn('OpenAI generation failed:', err.message);
    }
  }

  // 6. Anthropic fallback if configured.
  if (config.anthropicApiKey) {
    try {
      return await generateCopyWithAnthropic(lead, config.anthropicApiKey);
    } catch (err: any) {
      console.warn('Anthropic generation failed:', err.message);
    }
  }

  // 7. Cohere fallback if configured.
  if (config.cohereApiKey) {
    try {
      return await generateCopyWithCohere(lead, config.cohereApiKey);
    } catch (err: any) {
      console.warn('Cohere generation failed:', err.message);
    }
  }

  // 8. Mistral fallback if configured.
  if (config.mistralApiKey) {
    try {
      return await generateCopyWithMistral(lead, config.mistralApiKey);
    } catch (err: any) {
      console.warn('Mistral generation failed:', err.message);
    }
  }

  // Final deterministic fallback.
  return { copy: buildFallbackCopy(lead) };
}
