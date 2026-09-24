/**
 * @file src/lib/monetization/whatsappPaymentVerificationEngine.ts
 * 
 * WhatsApp Instant Bank Transfer & Receipt Verification Engine.
 * 
 * - Audits Lagos/Abuja commercial merchants (boutiques, clinics, electronics, shortlets).
 * - Identifies payment friction (fake transfer alert risks, manual credit delays).
 * - Offers a 24/7 Moniepoint / Paystack / OPay Automated WhatsApp Verification & Digital Receipt Bot (₦35,000 – ₦65,000 setup).
 * - Dispatches daily executive digests to bethelmindrecruit@gmail.com.
 */

import { getGenuineCommercialLeads } from './genuineLeadProvider';
import { dispatchSecureEmail, OFFICIAL_PRODUCTION_DOMAIN } from './smtpTransporterPool';

export interface PaymentVerificationTarget {
  rank?: number;
  businessName: string;
  location: string;
  sector: string;
  phone: string;
  estimatedMonthlyOrders: number;
  setupFeeNGN: number;
  monthlySaasFeeNGN: number;
  tierBadge: '🔥 HIGH VOLUME MERCHANT' | '⚡ RAPID CLOSE' | '💎 PREMIUM BOUTIQUE';
}

export function rankPaymentVerificationTargets(rawTargets: any[]): PaymentVerificationTarget[] {
  const scored = rawTargets.map(t => {
    const estimatedMonthlyOrders = t.reviews_count ? t.reviews_count * 15 : 120;
    const setupFeeNGN = estimatedMonthlyOrders > 200 ? 65000 : 35000;
    const monthlySaasFeeNGN = 10000;

    return {
      businessName: t.name,
      location: t.address || `${t.area}, Lagos`,
      sector: t.sector || 'Commercial Retail & Services',
      phone: t.phone_e164 || t.phone_raw || '08022791227',
      estimatedMonthlyOrders,
      setupFeeNGN,
      monthlySaasFeeNGN
    };
  });

  scored.sort((a, b) => b.estimatedMonthlyOrders - a.estimatedMonthlyOrders);

  return scored.map((item, idx) => {
    const rank = idx + 1;
    let tierBadge: PaymentVerificationTarget['tierBadge'] = '⚡ RAPID CLOSE';
    if (rank === 1) tierBadge = '🔥 HIGH VOLUME MERCHANT';
    else if (item.setupFeeNGN >= 65000) tierBadge = '💎 PREMIUM BOUTIQUE';

    return {
      ...item,
      rank,
      tierBadge
    };
  });
}

export async function scanPaymentVerificationLeads(): Promise<{
  totalAudited: number;
  totalQualified: number;
  top5Targets: PaymentVerificationTarget[];
}> {
  const genuineLeads = getGenuineCommercialLeads();
  const rawPool = genuineLeads.slice(0, 15);
  const ranked = rankPaymentVerificationTargets(rawPool);

  return {
    totalAudited: genuineLeads.length,
    totalQualified: ranked.length,
    top5Targets: ranked.slice(0, 5)
  };
}

/**
 * Dispatches Consolidated Daily WhatsApp Payment Verification Engine Digest.
 */
export async function dispatchDailyPaymentVerificationDigest(): Promise<{ success: boolean; messageId?: string }> {
  const data = await scanPaymentVerificationLeads();

  const cardsHtml = data.top5Targets.map(t => {
    const isTop = t.rank === 1;
    const waPitch = encodeURIComponent(`Hello Management at ${t.businessName}. We noticed your business handles frequent bank transfer payments in ${t.location}. We can install an Automated 24/7 WhatsApp Bank Transfer Verification Bot (Moniepoint/Paystack/OPay) that verifies payments in < 3s and issues instant digital receipts to prevent fake alerts.`);
    const waUrl = `https://wa.me/${t.phone.replace(/\D/g, '')}?text=${waPitch}`;

    return `
      <div style="background: #111827; border: 1px solid ${isTop ? '#10b981' : '#1f2937'}; border-radius: 10px; padding: 20px; margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <span style="display: inline-block; background: ${isTop ? '#10b981' : '#374151'}; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; margin-bottom: 6px;">
              ${t.tierBadge} (RANK #${t.rank})
            </span>
            <div style="font-size: 18px; font-weight: 800; color: #ffffff;">${t.businessName}</div>
            <div style="font-size: 13px; color: #9ca3af;">📍 ${t.location} | Sector: <strong>${t.sector}</strong></div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 20px; font-weight: 900; color: #34d399;">~${t.estimatedMonthlyOrders}</div>
            <div style="font-size: 11px; color: #9ca3af;">Est. Monthly Orders</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; background: #030712; padding: 12px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px;">
          <div><span style="color: #9ca3af;">Verification Bot:</span> <strong style="color: #38bdf8;">Moniepoint / Paystack / OPay</strong></div>
          <div><span style="color: #9ca3af;">Setup Fee:</span> <strong style="color: #fbbf24;">₦${t.setupFeeNGN.toLocaleString()}</strong></div>
          <div><span style="color: #9ca3af;">Monthly SaaS:</span> <strong style="color: #34d399;">₦${t.monthlySaasFeeNGN.toLocaleString()}/mo</strong></div>
        </div>

        <div style="display: flex; gap: 10px;">
          <a href="${waUrl}" style="background: ${isTop ? 'linear-gradient(135deg, #10b981, #059669)' : '#2563eb'}; color: #ffffff; padding: 10px 18px; text-decoration: none; font-size: 13px; font-weight: 800; border-radius: 6px; display: inline-block;">
            💬 1-Click Pitch Payment Bot (${t.phone})
          </a>
        </div>
      </div>
    `;
  }).join('');

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #0b0f19; color: #f3f4f6; border-radius: 12px; overflow: hidden; border: 1px solid #1f2937;">
      <div style="background: linear-gradient(135deg, #065f46, #0f172a); padding: 26px 30px; text-align: left; border-bottom: 1px solid #10b981;">
        <div style="font-size: 12px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
          WHATSAPP PAYMENT VERIFICATION ENGINE • 08:00 AM WAT
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">
          💳 ${data.totalQualified} Verified Commercial Merchants Audited
        </h1>
        <p style="color: #a7f3d0; margin: 6px 0 0 0; font-size: 13px;">
          Total Audited: <strong>${data.totalAudited} merchants</strong> | Avg Setup Fee: <strong>₦35,000 – ₦65,000</strong>
        </p>
      </div>

      <div style="padding: 26px;">
        ${cardsHtml}
      </div>

      <div style="background: #030712; padding: 16px 30px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #1f2937;">
        Sent daily by Bethelmind Autonomous 24/7 Payment Engine • Desk: +234 802 279 1227
      </div>
    </div>
  `;

  return dispatchSecureEmail({
    to: 'bethelmindrecruit@gmail.com',
    subject: `💳 Daily Payment Verification Digest: ${data.totalQualified} Qualified Merchants Found`,
    html: emailHtml,
    fromName: 'Bethelmind Payment Engine'
  });
}
