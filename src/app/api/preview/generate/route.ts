import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import { getPitchDetails } from '@/lib/pitchHelper';

// ============================================================================
// Google Cloud Vertex AI Token Refresher
// ============================================================================

export async function getValidAccessToken(): Promise<string> {
  const config = getRuntimeConfig();
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5 minute buffer before expiry

  // Token still valid
  if (config.googleAccessToken && config.googleTokenExpiry && config.googleTokenExpiry - bufferMs > now) {
    return config.googleAccessToken;
  }

  // Attempt refresh
  if (!config.googleRefreshToken || !config.googleClientId || !config.googleClientSecret) {
    throw new Error('Google session expired. Please sign in again.');
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
    throw new Error('Failed to refresh Google token. Please sign in again.');
  }

  // Persist refreshed token
  saveLocalConfig({
    googleAccessToken: data.access_token,
    googleTokenExpiry: Date.now() + (data.expires_in || 3600) * 1000,
  });

  return data.access_token;
}

// ============================================================================
// Category → Design Theme Mapper
// ============================================================================

export interface DesignTheme {
  primary: string;
  accent: string;
  bg: string;
  text: string;
  font: string;
  headingFont?: string;
  bodyFont?: string;
  heroImage: string;
  gradient: string;
}

export function getDesignTheme(category: string): DesignTheme {
  const cat = category.toLowerCase();

  if (/dental|medical|clinic|hospital|doctor|health|pharma|wellness/.test(cat)) {
    return {
      primary: '#0284c7',
      accent: '#14b8a6',
      bg: '#f0f9ff',
      text: '#0c4a6e',
      font: 'Inter',
      headingFont: 'Outfit',
      bodyFont: 'Inter',
      heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400&q=80',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #14b8a6 100%)',
    };
  }
  if (/car|auto|motor|vehicle|transport|logistic/.test(cat)) {
    return {
      primary: '#1f2937',
      accent: '#f59e0b',
      bg: '#111827',
      text: '#f9fafb',
      font: 'Space Grotesk',
      headingFont: 'Space Grotesk',
      bodyFont: 'Inter',
      heroImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1400&q=80',
      gradient: 'linear-gradient(135deg, #1f2937 0%, #f59e0b 100%)',
    };
  }
  if (/boutique|fashion|cloth|salon|beauty|hair|spa|style/.test(cat)) {
    return {
      primary: '#db2777',
      accent: '#f9a8d4',
      bg: '#fff1f2',
      text: '#881337',
      font: 'Playfair Display',
      headingFont: 'Playfair Display',
      bodyFont: 'Plus Jakarta Sans',
      heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&q=80',
      gradient: 'linear-gradient(135deg, #db2777 0%, #f9a8d4 100%)',
    };
  }
  if (/restaurant|food|cafe|cuisine|catering|bakery|eatery/.test(cat)) {
    return {
      primary: '#c2410c',
      accent: '#fed7aa',
      bg: '#fff7ed',
      text: '#7c2d12',
      font: 'DM Serif Display',
      headingFont: 'DM Serif Display',
      bodyFont: 'Cabin',
      heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=80',
      gradient: 'linear-gradient(135deg, #c2410c 0%, #f59e0b 100%)',
    };
  }
  // Default: Professional Services
  return {
    primary: '#1e3a8a',
    accent: '#60a5fa',
    bg: '#eff6ff',
    text: '#1e3a8a',
    font: 'Outfit',
    headingFont: 'Outfit',
    bodyFont: 'Inter',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)',
  };
}

// ============================================================================

export interface GeneratedCopy {
  heroTitle: string;
  heroSubtitle: string;
  services: { title: string; description: string; icon: string }[];
  aboutText: string;
  testimonials: { name: string; text: string; rating: number }[];
  ctaText: string;
}

export interface GeneratedSiteResponse {
  copy: GeneratedCopy;
  theme?: {
    primary: string;
    accent: string;
    bg: string;
    text: string;
    font: string;
    headingFont?: string;
    bodyFont?: string;
    gradient: string;
  };
}

async function generateCopyWithVertexAI(
  lead: any,
  accessToken: string,
  projectId: string
): Promise<GeneratedSiteResponse> {
  const prompt = `You are a professional web copywriter and UX designer. Generate compelling marketing copy and a highly tailored visual design theme specifically matching this business's name, specialty, location, and description.

Business Details:
- Name: ${lead.name}
- Industry/Category: ${lead.category}
- Location: ${lead.area}, ${lead.city}, Nigeria
- Google Rating: ${lead.rating} stars out of 5
- Number of Google Reviews: ${lead.reviews_count}
- Brief: ${lead.business_summary}

Choose design tokens (primary color, accent color, background, text color, font, headingFont, bodyFont, CSS gradient) that match the mood and premium/luxurious vibe of this specific business. 
Font options should be premium pairings:
- Elegant/Luxury: headingFont='Playfair Display' + bodyFont='Plus Jakarta Sans' (or Inter)
- Technical/Modern: headingFont='Space Grotesk' + bodyFont='Inter'
- Warm Hospitality: headingFont='DM Serif Display' + bodyFont='Cabin' (or Inter)
- Wellness/Corporate: headingFont='Outfit' + bodyFont='Inter'

Generate a JSON object with exactly this structure (respond ONLY with valid JSON, no markdown):
{
  "copy": {
    "heroTitle": "A powerful 6-10 word tagline for the business",
    "heroSubtitle": "A compelling 1-2 sentence value proposition that mentions their location and specialty",
    "services": [
      {"title": "Service Name", "description": "2-3 sentence description of this service", "icon": "🔧"},
      {"title": "Service Name", "description": "2-3 sentence description of this service", "icon": "⭐"},
      {"title": "Service Name", "description": "2-3 sentence description of this service", "icon": "🎯"}
    ],
    "aboutText": "3-4 sentence paragraph about the business, mentioning their excellent Google reputation and local presence in ${lead.area}",
    "testimonials": [
      {"name": "Customer Name", "text": "A realistic positive review of 2-3 sentences", "rating": 5},
      {"name": "Customer Name", "text": "A realistic positive review of 2-3 sentences", "rating": 5}
    ],
    "ctaText": "A strong 3-6 word call-to-action button text (e.g. 'Book a Free Consultation')"
  },
  "theme": {
    "primary": "#hex_primary_color",
    "accent": "#hex_accent_color",
    "bg": "#hex_page_bg_color (should be soft or dark matching the vibe)",
    "text": "#hex_body_text_color (must have high contrast with bg)",
    "font": "Font Name (main/default font)",
    "headingFont": "Heading Font Name (selected from options above)",
    "bodyFont": "Body Font Name (selected from options above)",
    "gradient": "linear-gradient(135deg, primary_color 0%, accent_color 100%)"
  }
}`;

  const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent`;

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(`Vertex AI error: ${err.error?.message || resp.statusText}`);
  }

  const data = await resp.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Parse JSON from response
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in Vertex AI response');
    return JSON.parse(jsonMatch[0]) as GeneratedSiteResponse;
  } catch {
    return { copy: buildFallbackCopy(lead) };
  }
}

export async function generateCopyWithGeminiApiKey(
  lead: any,
  apiKey: string
): Promise<GeneratedSiteResponse> {
  const prompt = `You are a professional web copywriter and UX designer. Generate compelling marketing copy and a highly tailored visual design theme specifically matching this business's name, specialty, location, and description.

Business Details:
- Name: ${lead.name}
- Industry/Category: ${lead.category}
- Location: ${lead.area}, ${lead.city}, Nigeria
- Google Rating: ${lead.rating} stars out of 5
- Number of Google Reviews: ${lead.reviews_count}
- Brief: ${lead.business_summary}

Choose design tokens (primary color, accent color, background, text color, font, headingFont, bodyFont, CSS gradient) that match the mood and premium/luxurious vibe of this specific business. 
Font options should be premium pairings:
- Elegant/Luxury: headingFont='Playfair Display' + bodyFont='Plus Jakarta Sans' (or Inter)
- Technical/Modern: headingFont='Space Grotesk' + bodyFont='Inter'
- Warm Hospitality: headingFont='DM Serif Display' + bodyFont='Cabin' (or Inter)
- Wellness/Corporate: headingFont='Outfit' + bodyFont='Inter'

Generate a JSON object with exactly this structure (respond ONLY with valid JSON, no markdown):
{
  "copy": {
    "heroTitle": "A powerful 6-10 word tagline for the business",
    "heroSubtitle": "A compelling 1-2 sentence value proposition that mentions their location and specialty",
    "services": [
      {"title": "Service Name", "description": "2-3 sentence description of this service", "icon": "🔧"},
      {"title": "Service Name", "description": "2-3 sentence description of this service", "icon": "⭐"},
      {"title": "Service Name", "description": "2-3 sentence description of this service", "icon": "🎯"}
    ],
    "aboutText": "3-4 sentence paragraph about the business, mentioning their excellent Google reputation and local presence in ${lead.area}",
    "testimonials": [
      {"name": "Customer Name", "text": "A realistic positive review of 2-3 sentences", "rating": 5},
      {"name": "Customer Name", "text": "A realistic positive review of 2-3 sentences", "rating": 5}
    ],
    "ctaText": "A strong 3-6 word call-to-action button text (e.g. 'Book a Free Consultation')"
  },
  "theme": {
    "primary": "#hex_primary_color",
    "accent": "#hex_accent_color",
    "bg": "#hex_page_bg_color (should be soft or dark matching the vibe)",
    "text": "#hex_body_text_color (must have high contrast with bg)",
    "font": "Font Name (main/default font)",
    "headingFont": "Heading Font Name (selected from options above)",
    "bodyFont": "Body Font Name (selected from options above)",
    "gradient": "linear-gradient(135deg, primary_color 0%, accent_color 100%)"
  }
}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(`Gemini AI Studio error: ${err.error?.message || resp.statusText}`);
  }

  const data = await resp.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Parse JSON from response
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in Gemini AI Studio response');
    return JSON.parse(jsonMatch[0]) as GeneratedSiteResponse;
  } catch {
    return { copy: buildFallbackCopy(lead) };
  }
}

// Deterministic fallback when Gemini is unavailable (no project ID configured yet)
export function buildFallbackCopy(lead: any): GeneratedCopy {
  return {
    heroTitle: `${lead.name} — Trusted in ${lead.area}`,
    heroSubtitle: `Proudly serving ${lead.city} with excellence and dedication. Rated ${lead.rating} stars by ${lead.reviews_count} happy customers.`,
    services: [
      { title: 'Quality Service', description: `We take pride in delivering top-tier ${lead.category.toLowerCase()} services to every client. Our team is trained to exceed your expectations every time.`, icon: '⭐' },
      { title: 'Expert Team', description: `Our experienced professionals bring years of expertise in the ${lead.category.toLowerCase()} industry. We stay updated with the latest practices to serve you better.`, icon: '👥' },
      { title: 'Customer First', description: `Your satisfaction is our highest priority. We listen, we respond, and we deliver. That is why we have earned ${lead.reviews_count} positive reviews from our community.`, icon: '❤️' },
    ],
    aboutText: `${lead.name} has been proudly serving the ${lead.area} community in ${lead.city}. We are a trusted local business with a ${lead.rating}-star rating on Google Maps, backed by ${lead.reviews_count} genuine customer reviews. Our commitment to quality and community makes us the go-to destination for ${lead.category.toLowerCase()} services.`,
    testimonials: [
      { name: 'Chukwuemeka A.', text: 'Absolutely fantastic service! The team was professional, courteous, and got the job done perfectly. Highly recommend.', rating: 5 },
      { name: 'Adaeze O.', text: `Best ${lead.category.toLowerCase()} experience I've had in ${lead.area}. Clean, efficient, and great value for money.`, rating: 5 },
    ],
    ctaText: 'Get in Touch Today',
  };
}

import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const { searchParams, origin } = new URL(req.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId parameter' }, { status: 400 });
    }

    // Load lead from database
    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(leadId);

    if (!lead) {
      return NextResponse.json({ error: `Lead ${leadId} not found` }, { status: 404 });
    }

    const config = getRuntimeConfig();
    let theme = getDesignTheme(lead.category);

    // Attempt Gemini or Vertex AI generation if credentials are set
    let copy: GeneratedCopy;
    let generatedResponse: GeneratedSiteResponse | null = null;
    if (config.geminiApiKey) {
      try {
        generatedResponse = await generateCopyWithGeminiApiKey(lead, config.geminiApiKey);
      } catch (err: any) {
        console.warn('Gemini AI Studio generation failed, attempting Vertex AI or fallback:', err.message);
        if (config.googleProjectId && config.googleRefreshToken) {
          try {
            const accessToken = await getValidAccessToken();
            generatedResponse = await generateCopyWithVertexAI(lead, accessToken, config.googleProjectId);
          } catch (vErr: any) {
            console.warn('Vertex AI generation also failed, using fallback copy:', vErr.message);
          }
        }
      }
    } else if (config.googleProjectId && config.googleRefreshToken) {
      try {
        const accessToken = await getValidAccessToken();
        generatedResponse = await generateCopyWithVertexAI(lead, accessToken, config.googleProjectId);
      } catch (err: any) {
        console.warn('Vertex AI generation failed, using fallback copy:', err.message);
      }
    }

    if (generatedResponse) {
      copy = generatedResponse.copy;
      if (generatedResponse.theme) {
        theme = {
          ...theme,
          primary: generatedResponse.theme.primary || theme.primary,
          accent: generatedResponse.theme.accent || theme.accent,
          bg: generatedResponse.theme.bg || theme.bg,
          text: generatedResponse.theme.text || theme.text,
          font: generatedResponse.theme.font || theme.font,
          headingFont: generatedResponse.theme.headingFont || theme.headingFont || generatedResponse.theme.font,
          bodyFont: generatedResponse.theme.bodyFont || theme.bodyFont || generatedResponse.theme.font,
          gradient: generatedResponse.theme.gradient || theme.gradient
        };
      }
    } else {
      copy = buildFallbackCopy(lead);
    }

    // Merge overrides
    const overridesPath = path.join(process.cwd(), 'src', 'data', 'overrides', `${leadId}.json`);
    let overrides: any = {};
    if (fs.existsSync(overridesPath)) {
      try {
        overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
        if (overrides.theme) {
          theme = { ...theme, ...overrides.theme };
        }
        if (overrides.copy) {
          copy = { ...copy, ...overrides.copy };
        }
      } catch (err) {
        console.warn('Failed to merge overrides in generator:', err);
      }
    }

    const pitch = getPitchDetails(lead, origin, config.businessSignature || 'ApexReach');

    return NextResponse.json({
      lead,
      theme,
      copy,
      pitch,
      overrides,
      generatedAt: new Date().toISOString(),
      paymentConfig: {
        paystackPublicKey: config.paystackPublicKey || '',
        claimFeeNGN: config.claimFeeNGN || 0,
        moniepointBankName: config.moniepointBankName || '',
        moniepointAccountNumber: config.moniepointAccountNumber || '',
        moniepointAccountName: config.moniepointAccountName || '',
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
