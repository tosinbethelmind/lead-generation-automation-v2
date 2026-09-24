/**
 * @file src/lib/monetization/aiVoiceBookingEngine.ts
 * 
 * AI Nigerian Voice Note & Consultation Booking Engine.
 * 
 * - Audits high-ticket Lagos/Abuja businesses (Solar, Dental Clinics, Shortlets, Real Estate, Logistics).
 * - Identifies after-hours lead drop-off and manual consultation booking bottlenecks.
 * - Installs an Instant 15s Nigerian Voice Note & Consultation Booking Bot (en-NG-EzinneNeural).
 * - Charges ₦50,000 – ₦120,000 DFY setup fee or ₦10,000 per qualified appointment booked.
 */

import { getGenuineCommercialLeads } from './genuineLeadProvider';
import { dispatchSecureEmail, OFFICIAL_PRODUCTION_DOMAIN } from './smtpTransporterPool';

export interface VoiceBookingTarget {
  rank?: number;
  businessName: string;
  location: string;
  sector: string;
  phone: string;
  averageDealValueNGN: number;
  setupFeeNGN: number;
  tierBadge: '🔥 HIGH-TICKET VIP' | '⚡ RAPID CLOSE' | '💎 PREMIUM CLINIC';
}

export function rankVoiceBookingTargets(rawTargets: any[]): VoiceBookingTarget[] {
  const scored = rawTargets.map(t => {
    const isSolarOrEstate = /solar|inverter|estate|property|clinic|dental/i.test(t.name + ' ' + (t.sector || ''));
    const averageDealValueNGN = isSolarOrEstate ? 1500000 : 450000;
    const setupFeeNGN = averageDealValueNGN >= 1000000 ? 120000 : 50000;

    return {
      businessName: t.name,
      location: t.address || `${t.area}, Lagos`,
      sector: t.sector || 'High-Ticket Commercial Services',
      phone: t.phone_e164 || t.phone_raw || '08022791227',
      averageDealValueNGN,
      setupFeeNGN
    };
  });

  scored.sort((a, b) => b.averageDealValueNGN - a.averageDealValueNGN);

  return scored.map((item, idx) => {
    const rank = idx + 1;
    let tierBadge: VoiceBookingTarget['tierBadge'] = '⚡ RAPID CLOSE';
    if (rank === 1) tierBadge = '🔥 HIGH-TICKET VIP';
    else if (item.setupFeeNGN >= 120000) tierBadge = '💎 PREMIUM CLINIC';

    return {
      ...item,
      rank,
      tierBadge
    };
  });
}

export async function scanVoiceBookingLeads(): Promise<{
  totalAudited: number;
  totalQualified: number;
  top5Targets: VoiceBookingTarget[];
}> {
  const genuineLeads = getGenuineCommercialLeads();
  const rawPool = genuineLeads.filter(l => l.rating && l.rating >= 4.5).slice(0, 15);
  const ranked = rankVoiceBookingTargets(rawPool.length > 0 ? rawPool : genuineLeads.slice(0, 15));

  return {
    totalAudited: genuineLeads.length,
    totalQualified: ranked.length,
    top5Targets: ranked.slice(0, 5)
  };
}

/**
 * Dispatches Consolidated Daily AI Voice Booking Engine Digest.
 */
export async function dispatchDailyVoiceBookingDigest(): Promise<{ success: boolean; messageId?: string }> {
  const data = await scanVoiceBookingLeads();

  const cardsHtml = data.top5Targets.map(t => {
    const isTop = t.rank === 1;
    const waPitch = encodeURIComponent(`Hello Management at ${t.businessName}. High-ticket inquiries in ${t.location} sent after 6 PM often go unanswered until the next morning. We can deploy a 24/7 AI Nigerian Voice Note & Consultation Booking Assistant that replies in < 3s with a natural voice note and locks in appointments directly into your schedule.`);
    const waUrl = `https://wa.me/${t.phone.replace(/\D/g, '')}?text=${waPitch}`;

    return `
      <div style="background: #111827; border: 1px solid ${isTop ? '#8b5cf6' : '#1f2937'}; border-radius: 10px; padding: 20px; margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <span style="display: inline-block; background: ${isTop ? '#8b5cf6' : '#374151'}; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; margin-bottom: 6px;">
              ${t.tierBadge} (RANK #${t.rank})
            </span>
            <div style="font-size: 18px; font-weight: 800; color: #ffffff;">${t.businessName}</div>
            <div style="font-size: 13px; color: #9ca3af;">📍 ${t.location} | Sector: <strong>${t.sector}</strong></div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 20px; font-weight: 900; color: #c084fc;">₦${(t.averageDealValueNGN / 1000).toFixed(0)}k</div>
            <div style="font-size: 11px; color: #9ca3af;">Avg Deal Size</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; background: #030712; padding: 12px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px;">
          <div><span style="color: #9ca3af;">Voice Engine:</span> <strong style="color: #a78bfa;">en-NG-EzinneNeural (15s Audio)</strong></div>
          <div><span style="color: #9ca3af;">Setup Deposit:</span> <strong style="color: #fbbf24;">₦${t.setupFeeNGN.toLocaleString()}</strong></div>
          <div><span style="color: #9ca3af;">Pay-Per-Booking:</span> <strong style="color: #34d399;">₦10,000/lead</strong></div>
        </div>

        <div style="display: flex; gap: 10px;">
          <a href="${waUrl}" style="background: ${isTop ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : '#2563eb'}; color: #ffffff; padding: 10px 18px; text-decoration: none; font-size: 13px; font-weight: 800; border-radius: 6px; display: inline-block;">
            🎙️ 1-Click Pitch AI Voice Closer (${t.phone})
          </a>
        </div>
      </div>
    `;
  }).join('');

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #0b0f19; color: #f3f4f6; border-radius: 12px; overflow: hidden; border: 1px solid #1f2937;">
      <div style="background: linear-gradient(135deg, #4c1d95, #0f172a); padding: 26px 30px; text-align: left; border-bottom: 1px solid #8b5cf6;">
        <div style="font-size: 12px; font-weight: 800; color: #c084fc; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
          AI NIGERIAN VOICE NOTE BOOKING ENGINE • 08:00 AM WAT
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">
          🎙️ ${data.totalQualified} High-Ticket Service Leads Audited
        </h1>
        <p style="color: #ddd6fe; margin: 6px 0 0 0; font-size: 13px;">
          Total Audited: <strong>${data.totalAudited} prospects</strong> | Setup Range: <strong>₦50,000 – ₦120,000</strong>
        </p>
      </div>

      <div style="padding: 26px;">
        ${cardsHtml}
      </div>

      <div style="background: #030712; padding: 16px 30px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #1f2937;">
        Sent daily by Bethelmind Autonomous 24/7 Voice Booking Watchdog • Desk: +234 802 279 1227
      </div>
    </div>
  `;

  return dispatchSecureEmail({
    to: 'bethelmindrecruit@gmail.com',
    subject: `🎙️ Daily AI Voice Booking Digest: ${data.totalQualified} High-Ticket Leads Audited`,
    html: emailHtml,
    fromName: 'Bethelmind Voice Booking Engine'
  });
}
