import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, getRotatedPaystackKeys } from '@/lib/localConfig';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import { getPitchDetails } from '@/lib/pitchHelper';
import { getOverridesDir } from '@/lib/overrides';
import { calculateLeadClaimFee } from '@/lib/pricing';
import { getDesignTheme, buildFallbackCopy, DesignTheme, GeneratedCopy } from '@/lib/designGenerator';
import fs from 'fs';
import path from 'path';

// Ultra-Fast In-Memory Cache for Sub-Second Preview Page Loads (<15ms)
const _previewCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour Cache

export async function GET(req: NextRequest) {
  try {
    const { searchParams, origin } = new URL(req.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId parameter' }, { status: 400 });
    }

    // Return instant cached response if available
    const cached = _previewCache.get(leadId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data, {
        headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' }
      });
    }

    const repo = getActiveLeadRepository();
    let lead = (await repo.getLeadById(leadId)) as any;

    if (!lead) {
      const formattedName = leadId.replace(/[^a-zA-Z0-9]+/g, ' ').toUpperCase();
      let category = 'Professional Services';
      const lowerId = leadId.toLowerCase();
      if (/solar|inverter|energy|battery/.test(lowerId)) category = 'Solar Energy & Inverter Dealer';
      else if (/estate|property|home|realty|housing/.test(lowerId)) category = 'Real Estate & Luxury Property';
      else if (/car|auto|motor|vehicle|tokunbo/.test(lowerId)) category = 'Automotive & Tokunbo Importer';
      else if (/medical|clinic|doctor|health/.test(lowerId)) category = 'Medical & Clinics';
      else if (/school|academy|education/.test(lowerId)) category = 'Schools & Education';
      else if (/boutique|fashion|style|beauty/.test(lowerId)) category = 'Boutique & Fashion';

      lead = {
        lead_id: leadId,
        source: 'GOOGLE',
        name: formattedName || 'VALUED BUSINESS',
        category,
        address: 'Commercial Hub, Lagos',
        area: 'Lekki Phase 1',
        city: 'Lagos',
        phone_e164: '+2348022791227',
        phone_raw: '0802 279 1227',
        email: 'info@client.com',
        website: '',
        rating: 4.9,
        reviews_count: 38,
        verified: true,
        listings_count: 1,
        profile_url: '',
        source_query_or_seed: 'demo',
        collected_at: new Date().toISOString(),
        status: 'NEW',
        last_contacted_at: '',
        duplicate_of_lead_id: '',
        business_summary: `Verified ${category} Enterprise in Lagos`,
        notes: '[PREVIEW_DEMO] Synthetic lead created during interactive claim preview.'
      };
    }

    // If lead has a website, fetch analysis + CMS fingerprint data to enrich AI prompt
    let websiteInfo = null;
    if (lead.website) {
      // Pre-populate from stored DB fields first as fallback
      lead.cmsPlatform = lead.cms_platform || lead.cmsPlatform || 'custom';
      lead.cmsConfidence = lead.cms_confidence || lead.cmsConfidence || 'low';
      lead.upgradeStrategy = lead.upgrade_strategy || lead.upgradeStrategy || 'script_embed';
      
      let storedPlugins: string[] = [];
      if (lead.plugin_suggestions) {
        try {
          storedPlugins = typeof lead.plugin_suggestions === 'string' ? JSON.parse(lead.plugin_suggestions) : lead.plugin_suggestions;
        } catch (_) {
          storedPlugins = String(lead.plugin_suggestions).split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      } else if (lead.pluginSuggestions) {
        storedPlugins = lead.pluginSuggestions;
      }
      lead.pluginSuggestions = storedPlugins;
      lead.embedNote = lead.embed_note || lead.embedNote || '';

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200); // Ultra-fast 1.2s timeout
        const analysisResp = await fetch(`${origin}/api/analysis/website`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: lead.website }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (analysisResp.ok) {
          websiteInfo = await analysisResp.json();
          // Attach basic metadata
          lead.websiteTitle = websiteInfo.title;
          lead.websiteMeta = websiteInfo.metaDescription;
          lead.websiteColor = websiteInfo.dominantColor;
          // Attach CMS platform intelligence
          lead.cmsPlatform = websiteInfo.cms || lead.cmsPlatform || 'custom';
          lead.cmsConfidence = websiteInfo.confidence || lead.cmsConfidence || 'low';
          lead.upgradeStrategy = websiteInfo.upgradeStrategy || lead.upgradeStrategy || 'script_embed';
          lead.pluginSuggestions = websiteInfo.pluginSuggestions || lead.pluginSuggestions || [];
          lead.embedNote = websiteInfo.embedNote || lead.embedNote || '';
        }
      } catch (e) {
        console.warn('Website analysis timed out or failed:', e);
      }
    } else {
      lead.upgradeStrategy = lead.upgrade_strategy || lead.upgradeStrategy || 'basic_presence';
    }

    const config = getRuntimeConfig();
    let copy: GeneratedCopy = {} as any;
    let theme: DesignTheme = {} as any;
    let cacheHit = false;

    if (lead.generated_copy && lead.design_theme) {
      try {
        copy = typeof lead.generated_copy === 'string' ? JSON.parse(lead.generated_copy) : lead.generated_copy;
        theme = typeof lead.design_theme === 'string' ? JSON.parse(lead.design_theme) : lead.design_theme;
        if (copy && theme && copy.heroTitle) {
          cacheHit = true;
          console.log(`[Cache Hit] Using pre-generated copy and theme for lead: ${leadId}`);
        }
      } catch (e) {
        console.warn('Failed to parse cached copy/theme from db, generating fresh:', e);
      }
    }

    if (!cacheHit) {
      theme = getDesignTheme(lead.category, leadId);
      let generatedResponse: any = null;
      try {
        const { generateCopyWithProviders } = await import('@/lib/llmProvider');
        generatedResponse = await generateCopyWithProviders(lead);
      } catch (err: any) {
        console.warn('Copy generation via providers failed:', err.message);
      }

      let photoFallback = '';
      if (lead.photos_data) {
        try {
          const photos = typeof lead.photos_data === 'string' ? JSON.parse(lead.photos_data) : lead.photos_data;
          if (Array.isArray(photos) && photos.length > 0) {
            photoFallback = photos[0];
          }
        } catch (_) {}
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
            gradient: generatedResponse.theme.gradient || theme.gradient,
            heroImage: generatedResponse.theme.heroImage || photoFallback || theme.heroImage
          };
        } else if (photoFallback) {
          theme.heroImage = photoFallback;
        }
      } else {
        copy = buildFallbackCopy(lead);
        if (photoFallback) {
          theme.heroImage = photoFallback;
        }
      }

      // Save generated copy and theme to database for caching
      try {
        await repo.updateLeadFields(leadId, {
          generated_copy: copy,
          design_theme: theme
        });
        console.log(`[Cache Write] Persisted generated copy and theme for lead: ${leadId}`);
      } catch (err) {
        console.warn('Failed to cache copy/theme to db:', err);
      }
    }

    // Merge overrides
    let overrides: any = {};
    if (lead.overrides) {
      try {
        overrides = typeof lead.overrides === 'string' ? JSON.parse(lead.overrides) : lead.overrides;
      } catch (err) {
        console.warn('Failed to parse database overrides:', err);
      }
    } else {
      const overridesPath = path.join(getOverridesDir(), `${leadId}.json`);
      if (fs.existsSync(overridesPath)) {
        try {
          overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
        } catch (err) {
          console.warn('Failed to merge local overrides in generator:', err);
        }
      }
    }

    if (overrides) {
      if (overrides.theme) {
        theme = { ...theme, ...overrides.theme };
      }
      if (overrides.copy) {
        copy = { ...copy, ...overrides.copy };
      }
    }

    let pitch = getPitchDetails(lead, origin, config.businessSignature || 'Bethelmind Analytics & Strategy');
    if (overrides.pitch) {
      pitch = {
        ...pitch,
        ...overrides.pitch
      };
    }

    const keys = getRotatedPaystackKeys(config.paystackPublicKey, config.paystackSecretKey);

    const responsePayload = {
      lead,
      theme,
      copy,
      pitch,
      overrides,
      generatedAt: new Date().toISOString(),
      paymentConfig: {
        paystackPublicKey: keys.publicKey,
        claimFeeNGN: calculateLeadClaimFee(lead, config),
        moniepointBankName: config.moniepointBankName || '',
        moniepointAccountNumber: config.moniepointAccountNumber || '',
        moniepointAccountName: config.moniepointAccountName || '',
        opayBankName: config.opayBankName || '',
        opayAccountNumber: config.opayAccountNumber || '',
        opayAccountName: config.opayAccountName || '',
        opayMerchantId: config.opayMerchantId || '',
        opayPublicKey: config.opayPublicKey || ''
      }
    };

    // Store in cache for sub-second repeat loads
    _previewCache.set(leadId, { data: responsePayload, timestamp: Date.now() });

    return NextResponse.json(responsePayload, {
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' }
    });
  } catch (err: any) {
    console.error('Preview Generation API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
