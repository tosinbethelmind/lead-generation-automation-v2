import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig } from '@/lib/localConfig';
import { MASK_VALUE } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    let { apiKey, model } = await req.json();
    
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API Key (or Refresh Token) is required." }, { status: 400 });
    }

    // Resolve masked keys from server-side config
    if (apiKey === MASK_VALUE || apiKey.includes('••')) {
      const config = getRuntimeConfig();
      if (model === 'gemini-1.5-flash' || model === 'gemini-1.5-pro' || model === 'gemini-1.0-pro') {
        apiKey = config.geminiApiKeys?.[0] || config.geminiApiKey || '';
      } else {
        apiKey = config.antigravityApiKeys?.[0] || config.antigravityApiKey || '';
      }
    }

    // 1. Detect if it is a standard Gemini API key
    if (apiKey.startsWith('AIzaSy')) {
      const geminiModel = model || 'gemini-1.5-flash';
      const geminiEp = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
      const geminiResp = await fetch(geminiEp, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say OK' }] }],
          generationConfig: { maxOutputTokens: 10 }
        })
      });

      if (!geminiResp.ok) {
        const errText = await geminiResp.text();
        let parsedError = errText;
        try {
          const errObj = JSON.parse(errText);
          parsedError = errObj.error?.message || errObj.message || errText;
        } catch (_) {}
        return NextResponse.json({
          success: false,
          error: `Gemini API returned status ${geminiResp.status}: ${parsedError}`
        });
      }

      const data = await geminiResp.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return NextResponse.json({
        success: true,
        message: `Connection successful! Gemini API response: "${content?.trim() || 'None'}"`
      });
    }

    // 2. Otherwise treat it as an Antigravity Google Cloud Assist refresh token
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

    // Refresh Google access token
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
      return NextResponse.json({
        success: false,
        error: `OAuth refresh failed: ${errText}`
      });
    }

    const tokenData = await refreshResp.json();
    const accessToken = tokenData.access_token;

    // Query loadCodeAssist to retrieve projectId
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
      return NextResponse.json({
        success: false,
        error: `loadCodeAssist failed: ${errText}`
      });
    }

    const assistData = await assistResp.json();
    const projectId = assistData.cloudaicompanionProject || 'cloudaicompanion-enterprise';

    // Test generateContent
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
              parts: [{ text: 'Say OK' }]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10
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
      return NextResponse.json({
        success: false,
        error: `generateContent failed for model ${targetModel}: ${parsedError}`
      });
    }

    const generateData = await generateResp.json();
    const content = generateData.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({
      success: true,
      message: `Connection successful! Project: ${projectId}. Model (${targetModel}) response: "${content?.trim() || 'None'}"`
    });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
