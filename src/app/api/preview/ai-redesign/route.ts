import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, rotateKey } from '@/lib/localConfig';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import { getValidAccessToken, getDesignTheme, buildFallbackCopy } from '../generate/route';
import fs from 'fs';
import path from 'path';
import { getOverridesDir } from '@/lib/overrides';

const OVERRIDES_DIR = getOverridesDir();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, prompt } = body;

    if (!leadId || !prompt) {
      return NextResponse.json({ error: 'leadId and prompt are required' }, { status: 400 });
    }

    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(leadId);

    if (!lead) {
      return NextResponse.json({ error: `Lead ${leadId} not found` }, { status: 404 });
    }

    const config = getRuntimeConfig();
    const hasGeminiKey = !!config.geminiApiKey;
    const hasVertex = !!(config.googleProjectId && config.googleRefreshToken);

    if (!hasGeminiKey && !hasVertex) {
      return NextResponse.json({ error: 'Neither Gemini AI API Key nor Google Vertex AI is configured. Please go to Settings and enter a key.' }, { status: 400 });
    }

    // Load current baseline or existing overrides to let AI perform delta updates
    const themeDefault = getDesignTheme(lead.category);
    const copyDefault = buildFallbackCopy(lead);
    
    const overridesPath = path.join(OVERRIDES_DIR, `${leadId}.json`);
    let currentOverrides: any = {};
    if (fs.existsSync(overridesPath)) {
      try {
        currentOverrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
      } catch (err) {
        console.warn('Failed to parse existing overrides:', err);
      }
    }

    const currentTheme = { ...themeDefault, ...currentOverrides.theme };
    const currentCopy = { ...copyDefault, ...currentOverrides.copy };
    const currentVisibility = {
      showTestimonials: true,
      showServices: true,
      showEstimator: true,
      showAbout: true,
      ...currentOverrides.visibility
    };

    const aiPrompt = `You are an expert web designer. Your task is to update a business landing page design based on the user request.
  
User Request: "${prompt}"

Current Site Details:
- Business Name: ${lead.name}
- Category: ${lead.category}
- Area: ${lead.area}, ${lead.city}

Current Design/Colors:
- Primary Color: ${currentTheme.primary}
- Accent Color: ${currentTheme.accent}
- Background Color: ${currentTheme.bg}
- Gradient: ${currentTheme.gradient}

Current Copy:
- Hero Title: "${currentCopy.heroTitle}"
- Hero Subtitle: "${currentCopy.heroSubtitle}"
- About Text: "${currentCopy.aboutText}"
- CTA Text: "${currentCopy.ctaText}"

Current Section Visibility:
- Show Testimonials: ${currentVisibility.showTestimonials}
- Show Services: ${currentVisibility.showServices}
- Show Estimator: ${currentVisibility.showEstimator}
- Show About: ${currentVisibility.showAbout}

Generate a JSON object containing the modified design overrides. Only modify what is requested or what is logical to change (e.g. if colors change, make sure text color and background contrast remains excellent). Return exactly this JSON structure (respond ONLY with JSON, no markdown formatting):
{
  "theme": {
    "primary": "hex code or CSS color",
    "accent": "hex code or CSS color",
    "bg": "hex code or CSS color",
    "text": "hex code or CSS color for contrast",
    "gradient": "linear-gradient css value"
  },
  "copy": {
    "heroTitle": "updated hero title",
    "heroSubtitle": "updated value proposition subtitle",
    "aboutText": "updated about us text",
    "ctaText": "updated call to action button label"
  },
  "visibility": {
    "showTestimonials": true/false,
    "showServices": true/false,
    "showEstimator": true/false,
    "showAbout": true/false
  },
  "services": [
    { "title": "Service Title", "description": "Short description", "icon": "emoji or icon identifier" }
  ]
}`;

    let resp;
    if (hasGeminiKey) {
      const activeKey = rotateKey(config.geminiApiKey);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;
      resp = await fetch(endpoint, {
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
    } else {
      const accessToken = await getValidAccessToken();
      const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${config.googleProjectId}/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent`;
      resp = await fetch(endpoint, {
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
    }

    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(`Gemini generation error: ${err.error?.message || resp.statusText}`);
    }

    const data = await resp.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON output returned from Gemini');
    }

    const overrides = JSON.parse(jsonMatch[0]);
    
    // Write output overrides to local JSON file
    fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2), 'utf8');

    return NextResponse.json({ success: true, overrides });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
