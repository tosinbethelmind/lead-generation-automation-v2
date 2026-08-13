/**
 * @file leadImageScraper.ts
 * Lead Online Image Extractor & Visual Beautifier
 * Extracts high-res photos from Google Maps listings, OpenGraph tags, website logos,
 * AND social media profiles (Instagram, Facebook, LinkedIn, Twitter/X).
 */

export interface LeadVisualAssets {
  logoUrl?: string;
  heroImageUrl?: string;
  galleryImages: string[];
  socialImages?: string[];
  source: 'google_maps' | 'social_media' | 'website_og' | 'curated_sector';
}

const CATEGORY_FALLBACK_IMAGES: Record<string, { hero: string; gallery: string[] }> = {
  solar: {
    hero: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80'
    ]
  },
  dentist: {
    hero: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80'
    ]
  },
  health: {
    hero: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80'
    ]
  },
  realestate: {
    hero: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'
    ]
  },
  beauty: {
    hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80'
    ]
  },
  general: {
    hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
    ]
  }
};

/**
 * Extracts and prepares visual assets from Google Maps, website OpenGraph, AND Social Media (Instagram, Facebook, LinkedIn, Twitter)
 */
export async function extractLeadVisualAssets(lead: {
  name: string;
  category?: string;
  website?: string;
  rawHtml?: string;
  mapsImages?: string[];
  socialLinks?: Record<string, string> | string;
}): Promise<LeadVisualAssets> {
  const galleryImages: string[] = [];
  const socialImages: string[] = [];
  let heroImageUrl: string | undefined;
  let logoUrl: string | undefined;
  let source: 'google_maps' | 'social_media' | 'website_og' | 'curated_sector' = 'curated_sector';

  // 1. Social Media Image Extraction (Instagram, Facebook, LinkedIn, Twitter CDN links)
  if (lead.rawHtml) {
    try {
      // Regex for CDN images hosted on Instagram (cdninstagram.com / fbcdn.net / pbs.twimg.com / media.licdn.com)
      const socialCdnRegex = /https:\/\/(scontent[^"'\s\>]+|cdninstagram\.com[^"'\s\>]+|fbcdn\.net[^"'\s\>]+|pbs\.twimg\.com\/media[^"'\s\>]+|media\.licdn\.com\/dms\/image[^"'\s\>]+)/gi;
      const matches = lead.rawHtml.match(socialCdnRegex);
      if (matches && matches.length > 0) {
        const cleanSocial = Array.from(new Set(matches.map(m => m.replace(/&amp;/g, '&')))).filter(Boolean);
        if (cleanSocial.length > 0) {
          socialImages.push(...cleanSocial.slice(0, 6));
          if (!heroImageUrl) {
            heroImageUrl = cleanSocial[0];
            source = 'social_media';
          }
        }
      }
    } catch (_) {}
  }

  // 2. Google Maps Photos (if available from scraping)
  if (!heroImageUrl && lead.mapsImages && lead.mapsImages.length > 0) {
    const validMaps = lead.mapsImages.filter(img => img && img.startsWith('http'));
    if (validMaps.length > 0) {
      heroImageUrl = validMaps[0];
      galleryImages.push(...validMaps.slice(1, 5));
      source = 'google_maps';
    }
  }

  // 3. OpenGraph / Meta image extraction from raw HTML if website exists
  if (!heroImageUrl && lead.rawHtml) {
    try {
      const ogMatch = lead.rawHtml.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      const logoMatch = lead.rawHtml.match(/<link\s+rel=["'](shortcut )?icon["']\s+href=["']([^"']+)["']/i);

      if (ogMatch && ogMatch[1] && ogMatch[1].startsWith('http')) {
        heroImageUrl = ogMatch[1];
        source = 'website_og';
      }

      if (logoMatch && logoMatch[2]) {
        logoUrl = logoMatch[2].startsWith('http') 
          ? logoMatch[2] 
          : (lead.website ? new URL(logoMatch[2], lead.website).toString() : undefined);
      }
    } catch (_) {}
  }

  // 4. Fallback to sector category curated images
  const catKey = (lead.category || '').toLowerCase();
  let matchedSector = 'general';
  if (catKey.includes('solar') || catKey.includes('energy') || catKey.includes('inverter')) matchedSector = 'solar';
  else if (catKey.includes('dent') || catKey.includes('tooth')) matchedSector = 'dentist';
  else if (catKey.includes('health') || catKey.includes('clinic') || catKey.includes('hosp')) matchedSector = 'health';
  else if (catKey.includes('estate') || catKey.includes('property') || catKey.includes('home')) matchedSector = 'realestate';
  else if (catKey.includes('beauty') || catKey.includes('spa') || catKey.includes('salon')) matchedSector = 'beauty';

  const sectorFallback = CATEGORY_FALLBACK_IMAGES[matchedSector];
  if (!heroImageUrl) heroImageUrl = sectorFallback.hero;
  if (galleryImages.length === 0) galleryImages.push(...sectorFallback.gallery);

  return {
    logoUrl,
    heroImageUrl,
    galleryImages,
    socialImages: socialImages.length > 0 ? socialImages : undefined,
    source
  };
}
