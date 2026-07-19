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
