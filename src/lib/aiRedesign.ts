import { getRuntimeConfig } from './localConfig';
import { getValidAccessToken } from './googleAuth';

export async function generateRedesignWithProviders(aiPrompt: string): Promise<string> {
  const config = getRuntimeConfig();
  
  // 1. Gather Gemini keys
  const geminiKeys: string[] = [];
  if (Array.isArray(config.geminiApiKeys) && config.geminiApiKeys.length) {
    geminiKeys.push(...config.geminiApiKeys);
  }
  if (config.geminiApiKey) {
    const splitKeys = config.geminiApiKey.split(',').map(k => k.trim()).filter(Boolean);
    geminiKeys.push(...splitKeys);
  }

  // Try Gemini keys first
  for (const key of geminiKeys) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: aiPrompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const errText = await resp.text();
        console.warn(`Gemini key failed: ${errText}`);
      }
    } catch (err: any) {
      console.warn(`Gemini key request failed:`, err.message);
    }
  }

  // 2. Try Google Vertex AI
  const hasVertex = !!(config.googleProjectId && config.googleRefreshToken);
  if (hasVertex) {
    try {
      const accessToken = await getValidAccessToken();
      const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${config.googleProjectId}/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent`;
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: aiPrompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (err: any) {
      console.warn(`Vertex AI redesign generation failed:`, err.message);
    }
  }

  // 3. Try Antigravity API keys & models
  const antigravityKeys: string[] = [];
  if (Array.isArray(config.antigravityApiKeys) && config.antigravityApiKeys.length) {
    antigravityKeys.push(...config.antigravityApiKeys);
  }
  if (config.antigravityApiKey) {
    const splitKeys = config.antigravityApiKey.split(',').map(k => k.trim()).filter(Boolean);
    antigravityKeys.push(...splitKeys);
  }

  if (antigravityKeys.length && Array.isArray(config.antigravityModels) && config.antigravityModels.length) {
    for (const key of antigravityKeys) {
      for (const model of config.antigravityModels) {
        try {
          const response = await fetch('https://api.antigravity.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`,
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: 'user', content: aiPrompt }
              ],
              temperature: 0.3,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            const text = data.choices?.[0]?.message?.content;
            if (text) return text;
          }
        } catch (err: any) {
          console.warn(`Antigravity redesign model ${model} failed with key ${key.slice(0, 6)}...:`, err.message);
        }
      }
    }
  }

  throw new Error('All configured LLM providers (Gemini, Vertex AI, Antigravity) failed to handle redesign request.');
}
