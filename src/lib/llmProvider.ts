import { RuntimeConfig, getRuntimeConfig } from '@/lib/localConfig';
import { generateCopyWithGeminiApiKey, generateCopyWithVertexAI, buildFallbackCopy, GeneratedSiteResponse } from '@/app/api/preview/generate/route';

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
 * Placeholder for Antigravity generation. Replace with actual Antigravity API call when needed.
 */
export async function generateCopyWithAntigravityModel(lead: any, model: string, apiKey: string): Promise<GeneratedSiteResponse> {
  console.warn(`Antigravity model ${model} generation not implemented, using fallback copy`);
  return { copy: buildFallbackCopy(lead) };
}

/**
 * Main entry point attempting multiple LLM providers in order of preference.
 * Tries each Gemini API key sequentially, falls back to Claude, then OpenAI,
 * and finally deterministic fallback.
 */
export async function generateCopyWithProviders(lead: any): Promise<GeneratedSiteResponse> {
  const config: RuntimeConfig = getRuntimeConfig();
  // If on‑ground mode is enabled, skip all remote LLM calls and use deterministic fallback.
  if (config.onGroundMode ?? true) {
    console.info('On‑ground mode enabled – using deterministic fallback copy');
    return { copy: buildFallbackCopy(lead) };
  }
  // Gather Gemini keys (array), include single key for backward compatibility.
  const geminiKeys: string[] = [];
  if (Array.isArray(config.geminiApiKeys) && config.geminiApiKeys.length) {
    geminiKeys.push(...config.geminiApiKeys);
  } else if (config.geminiApiKey) {
    geminiKeys.push(config.geminiApiKey);
  }

  // Try Gemini keys first.
  for (const key of geminiKeys) {
    try {
      const resp = await generateCopyWithGeminiApiKey(lead, key);
      return resp;
    } catch (err: any) {
      // Detect quota errors heuristically.
      const msg = err.message?.toLowerCase() ?? '';
      if (msg.includes('quota') || msg.includes('exceeded') || msg.includes('daily limit')) {
        console.warn(`Gemini key quota exhausted, trying next key. Key: ${key.slice(0, 6)}...`);
        continue; // try next key
      }
      console.warn('Gemini generation failed, aborting Gemini attempts:', err.message);
      break; // other error, stop trying Gemini
    }
  }

  // Claude fallback if configured.
  if (config.claudeApiKey) {
    try {
      return await generateCopyWithClaude(lead, config.claudeApiKey);
    } catch (err: any) {
      console.warn('Claude generation failed:', err.message);
    }
  }

  // OpenAI fallback if configured.
  if (config.openaiApiKey) {
    try {
      return await generateCopyWithOpenAI(lead, config.openaiApiKey);
    } catch (err: any) {
      console.warn('OpenAI generation failed:', err.message);
    }
  }

  // Anthropic fallback if configured.
  if (config.anthropicApiKey) {
    try {
      return await generateCopyWithAnthropic(lead, config.anthropicApiKey);
    } catch (err: any) {
      console.warn('Anthropic generation failed:', err.message);
    }
  }

  // Cohere fallback if configured.
  if (config.cohereApiKey) {
    try {
      return await generateCopyWithCohere(lead, config.cohereApiKey);
    } catch (err: any) {
      console.warn('Cohere generation failed:', err.message);
    }
  }

  // Mistral fallback if configured.
  if (config.mistralApiKey) {
    try {
      return await generateCopyWithMistral(lead, config.mistralApiKey);
    } catch (err: any) {
      console.warn('Mistral generation failed:', err.message);
    }
  }

  // Extend provider chain to include Antigravity models after other providers.
  // Ensure config contains antigravityApiKey and antigravityModels array.
  if (config.antigravityApiKey && Array.isArray(config.antigravityModels) && config.antigravityModels.length) {
    for (const model of config.antigravityModels) {
      try {
        return await generateCopyWithAntigravityModel(lead, model, config.antigravityApiKey);
      } catch (err: any) {
        console.warn(`Antigravity model ${model} failed:`, err.message);
        // continue to next model
      }
    }
  }

  // Final deterministic fallback.
  return { copy: buildFallbackCopy(lead) };
}
