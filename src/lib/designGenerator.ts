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

export function sanitizeGeneratedContent(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

export function hashString(str: string): number {
  let hash = 0;
  if (!str || str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

const HERO_IMAGE_BANKS: Record<string, string[]> = {
  solar: [
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1400&q=80',
    'https://images.unsplash.com/photo-1508873696983-2df515122519?w=1400&q=80',
    'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=1400&q=80',
    'https://images.unsplash.com/photo-1545208942-e1c9c916524b?w=1400&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1400&q=80',
  ],
  realestate: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1400&q=80',
  ],
  automotive: [
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1400&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1400&q=80',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1400&q=80',
  ],
  medical: [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1400&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1400&q=80',
  ]
};

const FONT_PAIRINGS = [
  { headingFont: 'Space Grotesk', bodyFont: 'Outfit' },
  { headingFont: 'Playfair Display', bodyFont: 'Plus Jakarta Sans' },
  { headingFont: 'Syne', bodyFont: 'Inter' },
  { headingFont: 'Outfit', bodyFont: 'Plus Jakarta Sans' },
  { headingFont: 'DM Serif Display', bodyFont: 'Cabin' },
  { headingFont: 'Plus Jakarta Sans', bodyFont: 'Inter' }
];

export function getDesignTheme(category: string, leadIdSeed?: string): DesignTheme {
  const cat = category.toLowerCase();
  const seed = hashString((leadIdSeed || '') + category);

  let categoryKey = 'default';
  if (/solar|inverter|energy|battery/.test(cat)) categoryKey = 'solar';
  else if (/estate|property|home|realty|housing/.test(cat)) categoryKey = 'realestate';
  else if (/car|auto|motor|vehicle|tokunbo/.test(cat)) categoryKey = 'automotive';
  else if (/medical|clinic|doctor|health/.test(cat)) categoryKey = 'medical';

  // Generate unique primary & accent hues per lead seed
  const primaryHue = (seed * 47) % 360;
  const accentHue = (primaryHue + 150 + (seed % 60)) % 360;

  const primaryColor = `hsl(${primaryHue}, 85%, 52%)`;
  const accentColor = `hsl(${accentHue}, 90%, 60%)`;
  const bgDarkColor = `hsl(${(primaryHue + 25) % 360}, 50%, 4%)`; // Deep obsidian space with subtle hue tint

  const gradientAngle = 110 + (seed % 60);
  const gradient = `linear-gradient(${gradientAngle}deg, ${primaryColor} 0%, hsl(${(primaryHue + 35) % 360}, 80%, 48%) 50%, ${accentColor} 100%)`;

  const imageBank = HERO_IMAGE_BANKS[categoryKey] || HERO_IMAGE_BANKS['default'];
  const heroImage = imageBank[seed % imageBank.length];

  const fontPairing = FONT_PAIRINGS[seed % FONT_PAIRINGS.length];

  return {
    primary: primaryColor,
    accent: accentColor,
    bg: bgDarkColor,
    text: '#ffffff',
    font: fontPairing.headingFont,
    headingFont: fontPairing.headingFont,
    bodyFont: fontPairing.bodyFont,
    heroImage,
    gradient,
  };
}

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
    heroImage?: string;
  };
}

export function buildGenerationPrompt(lead: any): string {
  return `You are a professional web copywriter and UX designer. Generate compelling marketing copy and a highly tailored visual design theme specifically matching this business's name, specialty, location, and description.

Business Details:
- Name: ${lead.name}
- Industry/Category: ${lead.category}
- Location: ${lead.area}, ${lead.city}, Nigeria
- Google Rating: ${lead.rating} stars out of 5
- Number of Google Reviews: ${lead.reviews_count}
- Brief: ${lead.business_summary}
- Operating Hours: ${lead.business_hours || 'Not Available'}
- Actual Google Reviews (JSON): ${lead.reviews_data || '[]'}
- Business Photos (JSON array): ${lead.photos_data || '[]'}
- Social Media Links (JSON object): ${lead.social_links || '{}'}
- Services Offered (JSON array): ${lead.services_data || '[]'}
- Existing Website URL: ${lead.website || 'None'}
- Existing Website Title: ${lead.websiteTitle || 'None'}
- Existing Website Meta Description: ${lead.websiteMeta || 'None'}
- Existing Website Dominant Color: ${lead.websiteColor || 'None'}
- Detected Website Platform/CMS: ${lead.cmsPlatform || 'Unknown'}
- Platform Detection Confidence: ${lead.cmsConfidence || 'low'}
- Recommended Upgrade Strategy: ${lead.upgradeStrategy || 'script_embed'}
- Available Upgrade Tools/Plugins: ${Array.isArray(lead.pluginSuggestions) ? lead.pluginSuggestions.join(', ') : (lead.pluginSuggestions || 'JS Widget Embeds')}
- Upgrade Method Note: ${lead.embedNote || ''}

Guidelines:
1. Choose design tokens (primary color, accent color, background, text color, font, headingFont, bodyFont, CSS gradient) that match the mood and premium/luxurious vibe of this specific business. If the business has an existing website dominant color (and it's a valid hex code), prioritize using or adapting that color as the primary theme color.
2. Under "testimonials", use or adapt the real Google reviews provided in "Actual Google Reviews (JSON)" to populate the testimonials list (up to 3 items) instead of fabricating completely random names/reviews.
3. Under "services", incorporate the actual services from "Services Offered (JSON array)" if present, or expand upon them matching the category. Make sure there are exactly 3 services.
4. Try to select a "heroImage" URL from the "Business Photos (JSON array)" if there are any valid URLs. If none, do not specify it (it will default to a high-quality Unsplash category image).
5. CRITICAL UPGRADE & MODERNIZATION PIPELINE RULES:
   If the business has an existing website (i.e. Existing Website URL is not 'None' and is not empty), you MUST generate copy specifically pitching a "website upgrade" and "automation modernization" rather than pitching a "new website" or "getting online". Use the platform-specific context below:
   
   UPGRADE STRATEGY = "${lead.upgradeStrategy || 'script_embed'}" — adapt your pitch accordingly:
    - If strategy is "plugin": mention that features will be added by installing plugins directly onto their existing ${lead.cmsPlatform || 'website'} — no migration or redesign needed.
    - If strategy is "script_embed": mention that features are added via a simple embed code on their existing site — zero rebuild required.
    - If strategy is "basic_presence": pitch a fast, modern landing page to establish an online presence, get found on Google, and start collecting bookings.
    - If strategy is "full_rebuild": acknowledge that their current platform (${lead.cmsPlatform || 'website'}) limits what is possible, and pitch a full modernization/migration to an upgraded platform with all features built in.

    - The heroTitle MUST be a high-conversion modernization/upgrade headline referencing their platform or setup (e.g. "Power Up Your ${lead.cmsPlatform || 'Website'} with Automated Bookings & Paystack Payments" or "Claim Your Custom Lead Generation Website").
    - The heroSubtitle MUST refer to upgrading their existing website at ${lead.website || ''} (if they have one) or getting a new fast presence.
    - The services MUST list the specific tools from Available Upgrade Tools: ${Array.isArray(lead.pluginSuggestions) ? lead.pluginSuggestions.slice(0, 3).join(', ') : 'automation integrations'}.
    - The aboutText should reference their operations, reputation, and local presence in ${lead.area}.
    - The ctaText MUST use upgrade/claim-focused language matching the strategy (e.g., "Install My Upgrade Plugins", "Add My Automation Widgets", "Deploy My Website", or "Claim My Rebuilt Platform").

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
    "gradient": "linear-gradient(135deg, primary_color 0%, accent_color 100%)",
    "heroImage": "URL from Business Photos if available, otherwise omit this field"
  }
}`;
}

export function buildFallbackCopy(lead: any): GeneratedCopy {
  const hasWebsite = !!(lead.website && lead.website.trim() && lead.website.toLowerCase() !== 'none');
  if (hasWebsite) {
    return {
      heroTitle: `Upgrade & Automate ${lead.name} Today`,
      heroSubtitle: `Modernize your existing website at ${lead.website} with automated scheduling, WhatsApp notification routing, and Paystack payments.`,
      services: [
        { title: 'Interactive Booking & Scheduling', description: 'Integrate real-time appointment bookings directly into your website so customers can reserve spots 24/7.', icon: '📅' },
        { title: 'Automated WhatsApp Notifications', description: 'Receive instant notifications on WhatsApp for new bookings, inquiries, and customer estimates automatically.', icon: '💬' },
        { title: 'Paystack Checkout System', description: 'Enable secure online payments directly from your website to automate invoicing and improve cash flow.', icon: '💳' },
      ],
      aboutText: `Upgrade your current business operations in ${lead.area}. By adding interactive automation and payment integrations to your website, we help ${lead.name} streamline local customer interactions and increase bookings without the overhead.`,
      testimonials: [
        { name: 'Chukwuemeka A.', text: 'The scheduling and WhatsApp integration saved us hours of back-and-forth calling. Highly recommended upgrade!', rating: 5 },
        { name: 'Adaeze O.', text: `Adding Paystack checkout to our existing site has doubled our reservation rate. Smooth and reliable.`, rating: 5 },
      ],
      ctaText: 'Claim My Website Upgrade',
    };
  }

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

export async function generateCopyWithVertexAI(
  lead: any,
  accessToken: string,
  projectId: string
): Promise<GeneratedSiteResponse> {
  const prompt = buildGenerationPrompt(lead);

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
  const prompt = buildGenerationPrompt(lead);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
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
  } catch (err: any) {
    console.error('Failed to parse Gemini response:', err.message, 'Raw text:', rawText);
    return { copy: buildFallbackCopy(lead) };
  }
}

import {
  renderRelumeNavbar,
  renderRelumeHero,
  renderRelumeFeatureGrid,
  renderRelumeStats,
  renderRelumeCTA,
  renderRelumeFooter
} from './relumeComponents';

/**
 * Generates a full, responsive Relume UI Page HTML for any lead (existing or generated)
 */
export function renderFullRelumeSitePage(lead: any): string {
  const params = {
    businessName: lead.business_name || lead.name || 'Business',
    category: lead.category,
    tagline: lead.business_summary || lead.notes,
    phone: lead.phone || lead.rawPhone || '2348022791227',
    email: lead.email,
    address: lead.address,
    heroImageUrl: lead.photos_data?.heroImageUrl || lead.maps_images?.[0],
    logoUrl: lead.photos_data?.logoUrl,
    speedScore: lead.photos_data?.pageSpeed?.score
  };

  const nav = renderRelumeNavbar(params);
  const hero = renderRelumeHero(params);
  const features = renderRelumeFeatureGrid(params);
  const stats = renderRelumeStats();
  const cta = renderRelumeCTA(params);
  const footer = renderRelumeFooter(params);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.businessName} — Modern Digital Experience</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #0f172a; font-family: 'Segoe UI', Roboto, sans-serif; color: #f8fafc; line-height: 1.5; }
  </style>
</head>
<body>
  ${nav}
  ${hero}
  ${features}
  ${stats}
  ${cta}
  ${footer}
</body>
</html>`;
}

