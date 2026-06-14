import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';
import { getActiveLeadRepository } from '@/lib/googleSheets';

// ============================================================================
// Google Cloud Vertex AI Token Refresher
// ============================================================================

async function getValidAccessToken(): Promise<string> {
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

interface DesignTheme {
  primary: string;
  accent: string;
  bg: string;
  text: string;
  font: string;
  heroImage: string;
  gradient: string;
}

function getDesignTheme(category: string): DesignTheme {
  const cat = category.toLowerCase();

  if (/dental|medical|clinic|hospital|doctor|health|pharma|wellness/.test(cat)) {
    return {
      primary: '#0284c7',
      accent: '#14b8a6',
      bg: '#f0f9ff',
      text: '#0c4a6e',
      font: 'Inter',
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
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)',
  };
}

// ============================================================================
// Vertex AI Gemini Copywriter
// ============================================================================

interface GeneratedCopy {
  heroTitle: string;
  heroSubtitle: string;
  services: { title: string; description: string; icon: string }[];
  aboutText: string;
  testimonials: { name: string; text: string; rating: number }[];
  ctaText: string;
}

async function generateCopyWithVertexAI(
  lead: any,
  accessToken: string,
  projectId: string
): Promise<GeneratedCopy> {
  const prompt = `You are a professional web copywriter. Generate compelling marketing copy for a small business that currently has NO WEBSITE. This copy will be used to create a preview website to show the business owner.

Business Details:
- Name: ${lead.name}
- Industry/Category: ${lead.category}
- Location: ${lead.area}, ${lead.city}, Nigeria
- Google Rating: ${lead.rating} stars out of 5
- Number of Google Reviews: ${lead.reviews_count}
- Brief: ${lead.business_summary}

Generate a JSON object with exactly this structure (respond ONLY with valid JSON, no markdown):
{
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
    return JSON.parse(jsonMatch[0]) as GeneratedCopy;
  } catch {
    // Fallback copy if parsing fails
    return buildFallbackCopy(lead);
  }
}

// Deterministic fallback when Gemini is unavailable (no project ID configured yet)
function buildFallbackCopy(lead: any): GeneratedCopy {
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

// ============================================================================
// Next.js Route Handler
// ============================================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
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
    const theme = getDesignTheme(lead.category);

    // Attempt Vertex AI generation if project ID is set
    let copy: GeneratedCopy;
    if (config.googleProjectId && config.googleRefreshToken) {
      try {
        const accessToken = await getValidAccessToken();
        copy = await generateCopyWithVertexAI(lead, accessToken, config.googleProjectId);
      } catch (err: any) {
        console.warn('Vertex AI generation failed, using fallback copy:', err.message);
        copy = buildFallbackCopy(lead);
      }
    } else {
      // Graceful degradation — no project ID yet
      copy = buildFallbackCopy(lead);
    }

    return NextResponse.json({
      lead,
      theme,
      copy,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
