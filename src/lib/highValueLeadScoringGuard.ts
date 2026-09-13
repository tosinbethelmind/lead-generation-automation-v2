/**
 * @file src/lib/highValueLeadScoringGuard.ts
 * 
 * BETHELMIND HIGH-VALUE LEAD VERIFICATION & QUALITY SCORING GUARD
 * 
 * Multi-Signal Verification Architecture:
 * 1. Physical Hub Validation (Alaba, ASPAMDA, Computer Village, Lekki, VI, Ikeja, Apapa)
 * 2. High-Ticket B2B Category Weighting (Solar, Machinery, Freight, Medical, Legal, Luxury Spas)
 * 3. Strict Nigerian E.164 Carrier Deliverability (+234 active prefixes, 0% synthetic rejection)
 * 4. Purchasing Power & Transaction Volume Tiering ($10,000 to $100,000+ USD)
 * 5. Conversion & Digital Upgrade Readiness
 */

import { isValidNigerianCommercialPhone, isGenuineCommercialIdentity } from './monetization/genuineLeadProvider';

export type LeadValueTier = 'TIER_1_WHALE' | 'TIER_2_HIGH_TICKET' | 'TIER_3_STANDARD' | 'DISQUALIFIED';

export interface HighValueVerificationResult {
  isHighValue: boolean;
  score: number; // 0 to 100
  tier: LeadValueTier;
  estimatedDealSizeNgn: number;
  estMonthlyVolumeUSD: number;
  verifiedHub: string;
  reasons: string[];
  flags: string[];
}

// 1. High-Value Commercial Physical Hubs
const HIGH_VALUE_HUBS: Record<string, { name: string; weight: number; baseVolumeUSD: number }> = {
  'alaba': { name: 'Alaba International Market', weight: 25, baseVolumeUSD: 45000 },
  'aspamda': { name: 'ASPAMDA Trade Fair Complex', weight: 25, baseVolumeUSD: 55000 },
  'trade fair': { name: 'Trade Fair Industrial Zone', weight: 25, baseVolumeUSD: 50000 },
  'computer village': { name: 'Computer Village Ikeja', weight: 25, baseVolumeUSD: 35000 },
  'apapa': { name: 'Apapa / Tin Can Port Corridor', weight: 25, baseVolumeUSD: 65000 },
  'tin can': { name: 'Tin Can Port Logistics Corridor', weight: 25, baseVolumeUSD: 60000 },
  'victoria island': { name: 'Victoria Island Commercial Core', weight: 25, baseVolumeUSD: 40000 },
  'lekki': { name: 'Lekki Phase 1 Prime Corridor', weight: 22, baseVolumeUSD: 30000 },
  'ikoyi': { name: 'Ikoyi Executive District', weight: 25, baseVolumeUSD: 50000 },
  'ikeja gra': { name: 'Ikeja GRA Corporate Hub', weight: 22, baseVolumeUSD: 35000 },
  'oregun': { name: 'Oregun Industrial Estate', weight: 20, baseVolumeUSD: 30000 },
  'ikeja': { name: 'Ikeja Commercial District', weight: 18, baseVolumeUSD: 25000 },
  'coker': { name: 'Coker / Orile Building Market', weight: 20, baseVolumeUSD: 35000 },
  'orile': { name: 'Orile Building Supplies Hub', weight: 20, baseVolumeUSD: 30000 },
  'marina': { name: 'Marina Financial Corridor', weight: 22, baseVolumeUSD: 40000 },
  'oshodi': { name: 'Oshodi / Airport Logistics Zone', weight: 18, baseVolumeUSD: 25000 }
};

// 2. High-Ticket B2B Categories
const HIGH_TICKET_CATEGORIES: Record<string, { weight: number; estDealNgn: number }> = {
  'machinery': { weight: 25, estDealNgn: 450000 },
  'equipment': { weight: 25, estDealNgn: 350000 },
  'solar': { weight: 25, estDealNgn: 300000 },
  'inverter': { weight: 25, estDealNgn: 250000 },
  'battery': { weight: 25, estDealNgn: 250000 },
  'auto parts': { weight: 25, estDealNgn: 280000 },
  'freight': { weight: 25, estDealNgn: 500000 },
  'cargo': { weight: 25, estDealNgn: 500000 },
  'clearing': { weight: 25, estDealNgn: 400000 },
  'medical': { weight: 25, estDealNgn: 400000 },
  'hospital': { weight: 25, estDealNgn: 450000 },
  'legal': { weight: 22, estDealNgn: 250000 },
  'law': { weight: 22, estDealNgn: 250000 },
  'accounting': { weight: 20, estDealNgn: 200000 },
  'real estate': { weight: 25, estDealNgn: 350000 },
  'spa': { weight: 20, estDealNgn: 180000 },
  'aesthetic': { weight: 22, estDealNgn: 220000 },
  'dental': { weight: 22, estDealNgn: 250000 },
  'construction': { weight: 25, estDealNgn: 450000 },
  'building': { weight: 22, estDealNgn: 300000 },
  'logistics': { weight: 20, estDealNgn: 220000 },
  'tools': { weight: 20, estDealNgn: 200000 },
  'surveillance': { weight: 20, estDealNgn: 200000 },
  'cctv': { weight: 20, estDealNgn: 180000 }
};

/**
 * Evaluates and scores a lead across all high-value dimensions.
 */
export function verifyAndScoreHighValueLead(lead: {
  name: string;
  phone_e164?: string;
  phone_raw?: string;
  category?: string;
  address?: string;
  area?: string;
  city?: string;
  website?: string;
  notes?: string;
}): HighValueVerificationResult {
  const reasons: string[] = [];
  const flags: string[] = [];
  let score = 0;

  // ── A. Anti-Synthetic Preflight Filter ──
  const phone = lead.phone_e164 || lead.phone_raw || '';
  const isPhoneValid = isValidNigerianCommercialPhone(phone);
  const isIdentityValid = isGenuineCommercialIdentity(lead);

  if (!isPhoneValid) {
    flags.push('DISQUALIFIED: Invalid or synthetic Nigerian phone pattern');
    return {
      isHighValue: false,
      score: 0,
      tier: 'DISQUALIFIED',
      estimatedDealSizeNgn: 0,
      estMonthlyVolumeUSD: 0,
      verifiedHub: 'Unverified',
      reasons: [],
      flags
    };
  }

  if (!isIdentityValid) {
    flags.push('DISQUALIFIED: Template, placeholder or mock identity rejected');
    return {
      isHighValue: false,
      score: 0,
      tier: 'DISQUALIFIED',
      estimatedDealSizeNgn: 0,
      estMonthlyVolumeUSD: 0,
      verifiedHub: 'Unverified',
      reasons: [],
      flags
    };
  }

  score += 20; // Base verified contact score
  reasons.push('Verified genuine Nigerian commercial phone (+20 pts)');

  // ── B. Physical Commercial Hub Verification ──
  const searchStr = `${lead.address || ''} ${lead.area || ''} ${lead.city || ''} ${lead.notes || ''}`.toLowerCase();
  let matchedHubName = 'Greater Lagos Commercial Area';
  let hubScore = 10;
  let estimatedVolumeUSD = 15000;

  for (const [key, hub] of Object.entries(HIGH_VALUE_HUBS)) {
    if (searchStr.includes(key)) {
      hubScore = hub.weight;
      matchedHubName = hub.name;
      estimatedVolumeUSD = hub.baseVolumeUSD;
      reasons.push(`Verified in prime commercial corridor: ${hub.name} (+${hubScore} pts)`);
      break;
    }
  }
  score += hubScore;

  // ── C. High-Ticket Sector Analysis ──
  const categoryStr = `${lead.category || ''} ${lead.name || ''}`.toLowerCase();
  let sectorScore = 10;
  let estimatedDealSizeNgn = 150000;

  for (const [key, cat] of Object.entries(HIGH_TICKET_CATEGORIES)) {
    if (categoryStr.includes(key)) {
      sectorScore = cat.weight;
      estimatedDealSizeNgn = cat.estDealNgn;
      reasons.push(`High-ticket B2B sector match [${key.toUpperCase()}]: Est deal ₦${cat.estDealNgn.toLocaleString()} (+${sectorScore} pts)`);
      break;
    }
  }
  score += sectorScore;

  // ── D. Business Title & Scale Signals ──
  const nameLower = (lead.name || '').toLowerCase();
  if (nameLower.includes('ltd') || nameLower.includes('limited') || nameLower.includes('enterprises') || nameLower.includes('group') || nameLower.includes('global') || nameLower.includes('services') || nameLower.includes('motors') || nameLower.includes('engineering') || nameLower.includes('investments')) {
    score += 15;
    reasons.push('Incorporated commercial entity / established trader title (+15 pts)');
  } else {
    score += 8;
  }

  // ── E. Digital Upgrade Readiness ──
  const hasWebsite = !!(lead.website && lead.website.trim() && !lead.website.includes('jiji.ng') && !lead.website.includes('example'));
  if (!hasWebsite) {
    score += 15;
    reasons.push('No proprietary website — Prime turnkey B2B website build candidate (+15 pts)');
  } else {
    score += 10;
    reasons.push('Has existing web presence — Prime 1-click AI closer upgrade candidate (+10 pts)');
  }

  // Cap score to 100
  score = Math.min(100, Math.max(0, score));

  // Determine Tier
  let tier: LeadValueTier = 'TIER_3_STANDARD';
  if (score >= 85) {
    tier = 'TIER_1_WHALE';
    estimatedVolumeUSD = Math.max(estimatedVolumeUSD, 50000);
  } else if (score >= 70) {
    tier = 'TIER_2_HIGH_TICKET';
    estimatedVolumeUSD = Math.max(estimatedVolumeUSD, 25000);
  }

  return {
    isHighValue: score >= 70,
    score,
    tier,
    estimatedDealSizeNgn,
    estMonthlyVolumeUSD: estimatedVolumeUSD,
    verifiedHub: matchedHubName,
    reasons,
    flags
  };
}

export const scoreHighValueLead = verifyAndScoreHighValueLead;

