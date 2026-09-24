/**
 * @file src/lib/monetization/turnkeyWebsiteEngine.ts
 * 
 * ENGINE 1: Turnkey DFY Commercial Prototype & Website Deployment Engine.
 * 
 * - Scans genuine Nigerian commercial leads across Lagos, Abuja, PH, Ibadan.
 * - Categorizes into No-Website (₦75k deposit / ₦150k DFY build) vs Existing Website (₦35k / ₦65k 1-Line Embed).
 * - Dispatches daily executive digests to bethelmindrecruit@gmail.com.
 */

import { getGenuineCommercialLeads } from './genuineLeadProvider';
import { dispatchSecureEmail, OFFICIAL_PRODUCTION_DOMAIN } from './smtpTransporterPool';

export interface TurnkeyWebsiteTarget {
  rank?: number;
  businessName: string;
  location: string;
  sector: string;
  phone: string;
  hasWebsite: boolean;
  previewUrl: string;
  offerType: 'DFY_TURNKEY_BUILD' | 'ONE_LINE_EMBED_UPGRADE';
  depositFeeNGN: number;
  totalValueNGN: number;
  tierBadge: '👑 ₦150K DFY TURNKEY' | '⚡ ₦35K RAPID EMBED' | '💎 HIGH-RATED PROSPECT';
}

export function rankTurnkeyWebsiteTargets(rawTargets: any[]): TurnkeyWebsiteTarget[] {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || OFFICIAL_PRODUCTION_DOMAIN;

  const scored = rawTargets.map(t => {
    const hasWebsite = Boolean(t.website);
    const slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const previewUrl = `${baseUrl}/preview/${slug}?phone=${encodeURIComponent(t.phone_e164 || t.phone_raw || '')}`;

    if (!hasWebsite) {
      return {
        businessName: t.name,
        location: t.address || `${t.area}, Lagos`,
        sector: t.sector || 'Commercial Business',
        phone: t.phone_e164 || t.phone_raw || '08022791227',
        hasWebsite: false,
        previewUrl,
        offerType: 'DFY_TURNKEY_BUILD' as const,
        depositFeeNGN: 75000,
        totalValueNGN: 150000
      };
    } else {
      return {
        businessName: t.name,
        location: t.address || `${t.area}, Lagos`,
        sector: t.sector || 'Commercial Business',
        phone: t.phone_e164 || t.phone_raw || '08022791227',
        hasWebsite: true,
        previewUrl,
        offerType: 'ONE_LINE_EMBED_UPGRADE' as const,
        depositFeeNGN: 35000,
        totalValueNGN: 65000
      };
    }
  });

  scored.sort((a, b) => b.totalValueNGN - a.totalValueNGN);

  return scored.map((item, idx) => {
    const rank = idx + 1;
    let tierBadge: TurnkeyWebsiteTarget['tierBadge'] = '💎 HIGH-RATED PROSPECT';
    if (!item.hasWebsite && rank === 1) tierBadge = '👑 ₦150K DFY TURNKEY';
    else if (item.hasWebsite) tierBadge = '⚡ ₦35K RAPID EMBED';

    return {
      ...item,
      rank,
      tierBadge
    };
  });
}

export async function scanTurnkeyWebsiteLeads(): Promise<{
  totalAudited: number;
  totalQualified: number;
  top5Targets: TurnkeyWebsiteTarget[];
}> {
  const genuineLeads = getGenuineCommercialLeads();
  const rawPool = genuineLeads.slice(0, 15);
  const ranked = rankTurnkeyWebsiteTargets(rawPool);

  return {
    totalAudited: genuineLeads.length,
    totalQualified: ranked.length,
    top5Targets: ranked.slice(0, 5)
  };
}

/**
 * Dispatches Consolidated Daily Turnkey Website Engine Digest.
 */
export async function dispatchDailyTurnkeyWebsiteDigest(): Promise<{ success: boolean; messageId?: string }> {
  const data = await scanTurnkeyWebsiteLeads();

  const cardsHtml = data.top5Targets.map(t => {
    const isTop = t.rank === 1;
    const pitchText = t.hasWebsite
      ? `Hello Management at ${t.businessName}. We can upgrade your website with a 1-Line AI Sales Assistant widget (₦35,000 / ₦65,000) without touching your hosting or SEO. View demo: ${t.previewUrl}`
      : `Hello Management at ${t.businessName}. We created a 100% Done-For-You Commercial Website Prototype for your business in ${t.location} (₦75,000 50% deposit / ₦150,000). Claim prototype: ${t.previewUrl}`;
    const waUrl = `https://wa.me/${t.phone.replace(/\D/g, '')}?text=${encodeURIComponent(pitchText)}`;

    return `
      <div style="background: #111827; border: 1px solid ${isTop ? '#3b82f6' : '#1f2937'}; border-radius: 10px; padding: 20px; margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <span style="display: inline-block; background: ${isTop ? '#2563eb' : '#374151'}; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; margin-bottom: 6px;">
              ${t.tierBadge} (RANK #${t.rank})
            </span>
            <div style="font-size: 18px; font-weight: 800; color: #ffffff;">${t.businessName}</div>
            <div style="font-size: 13px; color: #9ca3af;">📍 ${t.location} | Status: <strong>${t.hasWebsite ? 'Has Website (Embed Offer)' : 'No Website (Turnkey DFY Offer)'}</strong></div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 20px; font-weight: 900; color: #60a5fa;">₦${t.depositFeeNGN.toLocaleString()}</div>
            <div style="font-size: 11px; color: #9ca3af;">Deposit Required</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; background: #030712; padding: 12px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px;">
          <div><span style="color: #9ca3af;">Package:</span> <strong style="color: #38bdf8;">${t.offerType.replace(/_/g, ' ')}</strong></div>
          <div><span style="color: #9ca3af;">Full Price:</span> <strong style="color: #fbbf24;">₦${t.totalValueNGN.toLocaleString()}</strong></div>
          <div><span style="color: #9ca3af;">Preview:</span> <a href="${t.previewUrl}" target="_blank" style="color: #34d399; text-decoration: underline;">Open Staging Page &rarr;</a></div>
        </div>

        <div style="display: flex; gap: 10px;">
          <a href="${waUrl}" style="background: ${isTop ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#374151'}; color: #ffffff; padding: 10px 18px; text-decoration: none; font-size: 13px; font-weight: 800; border-radius: 6px; display: inline-block;">
            🌐 1-Click Send Prototype Pitch (${t.phone})
          </a>
        </div>
      </div>
    `;
  }).join('');

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #0b0f19; color: #f3f4f6; border-radius: 12px; overflow: hidden; border: 1px solid #1f2937;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #0f172a); padding: 26px 30px; text-align: left; border-bottom: 1px solid #3b82f6;">
        <div style="font-size: 12px; font-weight: 800; color: #60a5fa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
          ENGINE 1: TURNKEY DFY PROTOTYPE & WEBSITE ENGINE • 08:00 AM WAT
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">
          🌐 ${data.totalQualified} Commercial Prototypes Staged & Ready
        </h1>
        <p style="color: #93c5fd; margin: 6px 0 0 0; font-size: 13px;">
          Audited: <strong>${data.totalAudited} businesses</strong> | Value Range: <strong>₦35,000 – ₦150,000</strong>
        </p>
      </div>

      <div style="padding: 26px;">
        ${cardsHtml}
      </div>

      <div style="background: #030712; padding: 16px 30px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #1f2937;">
        Sent daily by Bethelmind Autonomous Engine 1 Supervisor • Desk: +234 802 279 1227
      </div>
    </div>
  `;

  return dispatchSecureEmail({
    to: 'bethelmindrecruit@gmail.com',
    subject: `🌐 Daily Prototype Digest: ${data.totalQualified} Commercial Prototypes Staged & Ready`,
    html: emailHtml,
    fromName: 'Bethelmind Engine 1 Supervisor'
  });
}
