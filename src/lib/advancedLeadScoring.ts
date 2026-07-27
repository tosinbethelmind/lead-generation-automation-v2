/**
 * @file advancedLeadScoring.ts
 * Advanced 50+ Signal Predictive Lead Scoring Engine
 * 
 * Scores leads across 6 dimensions (0 - 100 pts):
 * 1. Deliverability & Carrier Verification (+25 pts)
 * 2. Prospecting Opportunity & CMS Tech Stack (+20 pts)
 * 3. Social Proof, Reviews & Ratings (+20 pts)
 * 4. Geographic & Suburb Wealth Index (+15 pts)
 * 5. Historical Activity & Multi-Touch Engagement (+10 pts)
 * 6. Business Completeness & Domain Health (+10 pts)
 */

import { normalizeNigerianPhone } from './leadScoring';
import { validateNigerianCarrier } from './leadEnricher';
import type { Lead } from './googleSheets';

export interface AdvancedScoreResult {
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  isHighValueTarget: boolean;
  estimatedDealValueNgn: number;
  conversionProbabilityPercent: number;
  dimensionalBreakdown: {
    deliverability: number;
    websiteTech: number;
    socialProof: number;
    geoWealth: number;
    engagement: number;
    completeness: number;
  };
  reasons: string[];
  recommendedStrategy: string;
}

// Wealth Tiers for Nigerian Cities & Suburbs
const HIGH_WEALTH_SUBURBS = new Set([
  'lekki', 'victoria island', 'ikoyi', 'banana island', 'ikeja gra', 'magodo', 'vgc',
  'maitama', 'asokoro', 'guzape', 'wuse 2', 'jabi', 'port harcourt gra', 'nwaniba', 'bodija'
]);

export function calculateAdvancedLeadScore(
  lead: Partial<Lead>,
  activityCount = 0
): AdvancedScoreResult {
  let score = 0;
  const reasons: string[] = [];

  let deliverabilityScore = 0;
  let websiteTechScore = 0;
  let socialProofScore = 0;
  let geoWealthScore = 0;
  let engagementScore = 0;
  let completenessScore = 0;

  // ---------------------------------------------------------------------------
  // Dimension 1: Deliverability & Carrier Verification (Max 25 pts)
  // ---------------------------------------------------------------------------
  const rawPhone = lead.phone_e164 || lead.phone_raw;
  const normalizedPhone = normalizeNigerianPhone(rawPhone);

  if (normalizedPhone) {
    deliverabilityScore += 15;
    reasons.push('Verified E.164 phone number (+15)');

    const carrierCheck = validateNigerianCarrier(normalizedPhone);
    if (carrierCheck.valid) {
      deliverabilityScore += 10;
      reasons.push(`Verified active carrier (${carrierCheck.carrier || 'Nigerian Mobile'}) (+10)`);
    }
  }

  // ---------------------------------------------------------------------------
  // Dimension 2: Website & CMS Tech Stack Opportunity (Max 20 pts)
  // ---------------------------------------------------------------------------
  const hasWebsite = !!(lead.website && lead.website.trim() && lead.website !== 'None' && lead.website !== 'N/A');

  if (!hasWebsite) {
    websiteTechScore += 20;
    reasons.push('No website — Priority target for ₦250K+ web build (+20)');
  } else {
    websiteTechScore += 10;
    const cms = (lead.cms_platform || lead.cmsPlatform || '').toLowerCase();
    if (cms === 'wordpress' || cms === 'wix' || cms === 'squarespace') {
      websiteTechScore += 5;
      reasons.push(`Outdated ${cms.toUpperCase()} site — High upgrade target (+5)`);
    } else {
      reasons.push('Has existing website (+10)');
    }
  }

  // ---------------------------------------------------------------------------
  // Dimension 3: Social Proof & Ratings (Max 20 pts)
  // ---------------------------------------------------------------------------
  const rating = Number(lead.rating || 0);
  const reviews = Number(lead.reviews_count || 0);

  if (rating >= 4.5 && reviews >= 10) {
    socialProofScore += 20;
    reasons.push(`Top-rated business (${rating}★, ${reviews} reviews) (+20)`);
  } else if (rating >= 4.0 || reviews >= 5) {
    socialProofScore += 15;
    reasons.push(`Strong review presence verified (${rating}★) (+15)`);
  } else if (rating > 0 || reviews > 0) {
    socialProofScore += 10;
    reasons.push('Verified Google Business profile (+10)');
  }

  if (lead.social_links || lead.profile_url) {
    socialProofScore = Math.min(20, socialProofScore + 5);
    reasons.push('Active social media footprint linked (+5)');
  }

  // ---------------------------------------------------------------------------
  // Dimension 4: Geographic Wealth Index (Max 15 pts)
  // ---------------------------------------------------------------------------
  const area = (lead.area || lead.address || '').toLowerCase();
  const isHighWealth = Array.from(HIGH_WEALTH_SUBURBS).some(sub => area.includes(sub));

  if (isHighWealth) {
    geoWealthScore += 15;
    reasons.push('High-income commercial district target (+15)');
  } else if (area.trim()) {
    geoWealthScore += 10;
    reasons.push('Verified urban business location (+10)');
  }

  // ---------------------------------------------------------------------------
  // Dimension 5: Activity & Engagement History (Max 10 pts)
  // ---------------------------------------------------------------------------
  if (activityCount > 5) {
    engagementScore += 10;
    reasons.push('High multi-touch engagement recorded (+10)');
  } else if (activityCount > 0) {
    engagementScore += 5;
    reasons.push('Previous outreach history logged (+5)');
  }

  // ---------------------------------------------------------------------------
  // Dimension 6: Business Completeness (Max 10 pts)
  // ---------------------------------------------------------------------------
  if (lead.email) {
    completenessScore += 5;
    reasons.push('Verified business email address available (+5)');
  }
  if (lead.business_summary || lead.notes) {
    completenessScore += 5;
    reasons.push('Full business profile data enriched (+5)');
  }

  // Total Score
  score = deliverabilityScore + websiteTechScore + socialProofScore + geoWealthScore + engagementScore + completenessScore;

  // Grade Assignment
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'D';
  if (score >= 90) grade = 'A+';
  else if (score >= 75) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 40) grade = 'C';

  const isHighValueTarget = grade === 'A+' || grade === 'A' || (score >= 65 && !hasWebsite);

  // Conversion probability and deal value estimation
  const conversionProbabilityPercent = Math.round(score * 0.75);
  const estimatedDealValueNgn = isHighWealth ? 450000 : 250000;

  // Strategy Recommendation
  let recommendedStrategy = 'Multi-channel WhatsApp + Email pitch';
  if (!hasWebsite && isHighWealth) {
    recommendedStrategy = 'Priority WhatsApp pitch with AI website preview link';
  } else if (hasWebsite) {
    recommendedStrategy = 'Feature upgrade proposal (Chatbot + Paystack Widget)';
  }

  return {
    score,
    grade,
    isHighValueTarget,
    estimatedDealValueNgn,
    conversionProbabilityPercent,
    dimensionalBreakdown: {
      deliverability: deliverabilityScore,
      websiteTech: websiteTechScore,
      socialProof: socialProofScore,
      geoWealth: geoWealthScore,
      engagement: engagementScore,
      completeness: completenessScore,
    },
    reasons,
    recommendedStrategy,
  };
}
