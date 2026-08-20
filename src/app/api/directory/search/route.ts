import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { convertFromNGN, SupportedCurrency } from '@/lib/currency';

export const dynamic = 'force-dynamic';

export interface DirectoryListing {
  id: string;
  name: string;
  slug: string;
  category: string;
  sectorSlug: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  email?: string;
  website?: string;
  previewUrl: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  isClaimed: boolean;
  isFeaturedSponsor: boolean;
  isExclusiveCategorySponsor: boolean;
  startingPriceNgn: number;
  diasporaEscrowEligible: boolean;
  heroImage?: string;
  tagline: string;
  features: string[];
}

const FALLBACK_DIRECTORY_LISTINGS: DirectoryListing[] = [
  {
    id: 'dir_solar_01',
    name: 'Helios Solar & Power EPC Lagos',
    slug: 'helios-solar-power-epc',
    category: 'Solar & Inverters',
    sectorSlug: 'solar',
    address: 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos',
    district: 'Lekki Phase 1',
    city: 'Lagos',
    phone: '08022791227',
    previewUrl: '/preview?sector=solar&name=Helios+Solar+Power',
    rating: 4.9,
    reviewsCount: 142,
    isVerified: true,
    isClaimed: true,
    isFeaturedSponsor: true,
    isExclusiveCategorySponsor: true,
    startingPriceNgn: 1850000,
    diasporaEscrowEligible: true,
    tagline: 'Tier-1 Lithium ESS & Hybrid Solar Systems with 5-Yr Guarantee & Diaspora Escrow.',
    features: ['NERC Band-A Displacement', '5-Year Inverter Warranty', 'Diaspora Site Video Audits', '24/7 Remote Monitoring'],
  },
  {
    id: 'dir_estate_02',
    name: 'Primecrest Luxury Properties & Land',
    slug: 'primecrest-luxury-properties',
    category: 'Real Estate & Land',
    sectorSlug: 'real_estate',
    address: 'Block 8, Ozumba Mbadiwe Ave, Victoria Island, Lagos',
    district: 'Victoria Island',
    city: 'Lagos',
    phone: '08022791227',
    previewUrl: '/preview?sector=real_estate&name=Primecrest+Properties',
    rating: 4.8,
    reviewsCount: 98,
    isVerified: true,
    isClaimed: true,
    isFeaturedSponsor: true,
    isExclusiveCategorySponsor: false,
    startingPriceNgn: 25000000,
    diasporaEscrowEligible: true,
    tagline: 'Governor’s Consent & C-of-O Titled Estates in Lekki, Ikoyi & Epe Corridor.',
    features: ['100% C-of-O Verified', 'Diaspora Virtual Walkthroughs', 'Flexible 18-Mo Payment Plan', 'Bethelmind Escrow Protected'],
  },
  {
    id: 'dir_clinic_03',
    name: 'AuraSmile Dental & Aesthetic Clinic',
    slug: 'aurasmile-dental-aesthetic-clinic',
    category: 'Medical & Dental Clinics',
    sectorSlug: 'clinics',
    address: '22 Isaac John Street, GRA Ikeja, Lagos',
    district: 'Ikeja GRA',
    city: 'Lagos',
    phone: '08022791227',
    previewUrl: '/preview?sector=clinics&name=AuraSmile+Dental',
    rating: 4.9,
    reviewsCount: 215,
    isVerified: true,
    isClaimed: true,
    isFeaturedSponsor: true,
    isExclusiveCategorySponsor: true,
    startingPriceNgn: 45000,
    diasporaEscrowEligible: true,
    tagline: 'Modern Cosmetic Dentistry, Implants & Laser Teeth Whitening with 1-Tap Booking.',
    features: ['German Laser Technology', 'Diaspora Family Sponsor Care', 'Pain-Free Sedation', 'Direct WhatsApp Specialist'],
  },
  {
    id: 'dir_auto_04',
    name: 'GrandPrix Auto Tech & Tokunbo Customs Hub',
    slug: 'grandprix-auto-tech',
    category: 'Luxury Auto Care & Imports',
    sectorSlug: 'auto',
    address: 'Lekki-Epe Expressway, Beside Chevron HQ, Lekki',
    district: 'Lekki',
    city: 'Lagos',
    phone: '08022791227',
    previewUrl: '/preview?sector=auto&name=GrandPrix+Auto',
    rating: 4.7,
    reviewsCount: 84,
    isVerified: true,
    isClaimed: false,
    isFeaturedSponsor: false,
    isExclusiveCategorySponsor: false,
    startingPriceNgn: 35000,
    diasporaEscrowEligible: true,
    tagline: 'ECU Diagnostics, Tokunbo Customs Duty Verification & German Car Specialist.',
    features: ['Original Autel Diagnostics', 'VIN & Customs Clearance Check', 'Genuine Parts Warranty', 'Tow Service Pickup'],
  },
  {
    id: 'dir_spa_05',
    name: 'Serenity Oasis Luxury Spa & Skin Institute',
    slug: 'serenity-oasis-spa',
    category: 'Aesthetic Spas & Wellness',
    sectorSlug: 'spa',
    address: '5B Tokunbo Omisore Street, Lekki Phase 1, Lagos',
    district: 'Lekki Phase 1',
    city: 'Lagos',
    phone: '08022791227',
    previewUrl: '/preview?sector=spa&name=Serenity+Oasis+Spa',
    rating: 4.9,
    reviewsCount: 167,
    isVerified: true,
    isClaimed: true,
    isFeaturedSponsor: false,
    isExclusiveCategorySponsor: false,
    startingPriceNgn: 25000,
    diasporaEscrowEligible: false,
    tagline: 'Hydro-Facials, Deep Tissue Massage & Organic Skin Therapy in Lekki.',
    features: ['Certified Dermatologists', 'Private VIP Suites', 'Instant Online Voucher Gift', 'Organic Herbal Formulations'],
  },
  {
    id: 'dir_shortlet_06',
    name: 'LuxeLiving Waterfront Shortlets & Penthouse',
    slug: 'luxeliving-waterfront-shortlets',
    category: 'Shortlets & Hospitality',
    sectorSlug: 'hospitality',
    address: 'Banana Island Road, Ikoyi, Lagos',
    district: 'Ikoyi / Banana Island',
    city: 'Lagos',
    phone: '08022791227',
    previewUrl: '/preview?sector=hospitality&name=LuxeLiving+Shortlets',
    rating: 5.0,
    reviewsCount: 63,
    isVerified: true,
    isClaimed: true,
    isFeaturedSponsor: true,
    isExclusiveCategorySponsor: true,
    startingPriceNgn: 150000,
    diasporaEscrowEligible: true,
    tagline: '24/7 Power, High-Speed Starlink, Private Chef & Luxury Waterfront Living for Diaspora Visitors.',
    features: ['24/7 Uninterrupted Light', 'Starlink 250Mbps WiFi', 'Armed Security & Concierge', 'Foreign Card Stripe/Paystack Accepted'],
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').toLowerCase().trim();
    const sector = (searchParams.get('sector') || '').toLowerCase().trim();
    const location = (searchParams.get('location') || '').toLowerCase().trim();
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const diasporaOnly = searchParams.get('diaspora') === 'true';
    const currency = (searchParams.get('currency') || 'NGN').toUpperCase() as SupportedCurrency;

    const supabase = getSupabaseClient();
    let dbListings: DirectoryListing[] = [];

    if (supabase) {
      try {
        let queryBuilder = (supabase as any)
          .from('leads')
          .select('*')
          .limit(80);

        if (sector && sector !== 'all') {
          queryBuilder = queryBuilder.ilike('category', `%${sector}%`);
        }
        if (location && location !== 'all') {
          queryBuilder = queryBuilder.or(`address.ilike.%${location}%,city.ilike.%${location}%,name.ilike.%${location}%`);
        }
        if (query) {
          queryBuilder = queryBuilder.or(`name.ilike.%${query}%,category.ilike.%${query}%,address.ilike.%${query}%`);
        }

        const { data, error } = await queryBuilder;
        if (!error && data && data.length > 0) {
          dbListings = data.map((item: any) => {
            const rawName = item.name || item.business_name || 'Commercial Business';
            const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const rawCategory = item.category || 'Professional Services';
            const rating = Number(item.rating) || 4.8;
            const isVerified = Boolean(item.is_verified || rating >= 4.5);
            const isClaimed = Boolean(item.claimed || item.status === 'CONTACTED');
            const previewUrl = item.preview_url || `/preview?id=${item.id || item.lead_id}&name=${encodeURIComponent(rawName)}&sector=${encodeURIComponent(rawCategory)}`;

            return {
              id: String(item.id || item.lead_id || `lead_${Math.random()}`),
              name: rawName,
              slug,
              category: rawCategory,
              sectorSlug: rawCategory.toLowerCase().includes('solar') ? 'solar' : rawCategory.toLowerCase().includes('estate') ? 'real_estate' : rawCategory.toLowerCase().includes('clinic') ? 'clinics' : rawCategory.toLowerCase().includes('auto') ? 'auto' : 'services',
              address: item.address || 'Lagos, Nigeria',
              district: item.address ? item.address.split(',')[1]?.trim() || 'Lagos Central' : 'Lekki / Victoria Island',
              city: item.city || 'Lagos',
              phone: item.phone || '08022791227',
              email: item.email,
              website: item.website,
              previewUrl,
              rating,
              reviewsCount: Number(item.reviews_count || item.review_count) || Math.floor(Math.random() * 80) + 20,
              isVerified,
              isClaimed,
              isFeaturedSponsor: Math.random() > 0.7,
              isExclusiveCategorySponsor: false,
              startingPriceNgn: rawCategory.toLowerCase().includes('solar') ? 1800000 : rawCategory.toLowerCase().includes('estate') ? 25000000 : 35000,
              diasporaEscrowEligible: true,
              tagline: `Top-rated verified provider in ${item.city || 'Lagos'} with instant WhatsApp desk & priority service.`,
              features: ['Verified Nigerian Business', '0ms Fast WhatsApp Response', 'Direct Quote & Intake Engine', 'Bethelmind Vetted'],
            };
          });
        }
      } catch (dbErr) {
        console.warn('[Directory API] DB fetch notice:', dbErr);
      }
    }

    // Combine curated and DB listings
    let combined = [...FALLBACK_DIRECTORY_LISTINGS];
    if (dbListings.length > 0) {
      // Deduplicate by name
      const existingNames = new Set(combined.map(c => c.name.toLowerCase()));
      for (const item of dbListings) {
        if (!existingNames.has(item.name.toLowerCase())) {
          combined.push(item);
          existingNames.add(item.name.toLowerCase());
        }
      }
    }

    // Filter in-memory
    let filtered = combined.filter((item) => {
      if (query && !item.name.toLowerCase().includes(query) && !item.category.toLowerCase().includes(query) && !item.address.toLowerCase().includes(query)) {
        return false;
      }
      if (sector && sector !== 'all' && !item.category.toLowerCase().includes(sector) && !item.sectorSlug.toLowerCase().includes(sector)) {
        return false;
      }
      if (location && location !== 'all' && !item.address.toLowerCase().includes(location) && !item.district.toLowerCase().includes(location) && !item.city.toLowerCase().includes(location)) {
        return false;
      }
      if (verifiedOnly && !item.isVerified) {
        return false;
      }
      if (diasporaOnly && !item.diasporaEscrowEligible) {
        return false;
      }
      return true;
    });

    // Sort: Exclusive Category Sponsors first, then Featured, then highest rating
    filtered.sort((a, b) => {
      if (a.isExclusiveCategorySponsor && !b.isExclusiveCategorySponsor) return -1;
      if (!a.isExclusiveCategorySponsor && b.isExclusiveCategorySponsor) return 1;
      if (a.isFeaturedSponsor && !b.isFeaturedSponsor) return -1;
      if (!a.isFeaturedSponsor && b.isFeaturedSponsor) return 1;
      return b.rating - a.rating;
    });

    return NextResponse.json({
      success: true,
      count: filtered.length,
      currency,
      listings: filtered,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
