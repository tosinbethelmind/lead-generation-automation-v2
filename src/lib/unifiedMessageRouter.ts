/**
 * @file src/lib/unifiedMessageRouter.ts
 * 
 * 🔀 BETHELMIND MULTI-BUSINESS INTENT ROUTER & CONTEXT DISPATCHER
 * Bethelmind Digital Solutions (CAC BN: 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225)
 * 
 * Solves the Shared WhatsApp Problem:
 * Seamlessly routes incoming messages on a single phone line (0802 279 1227) between:
 * 1. Pillar 1: SME Automation & Sector Tools (Websites, Fake Alert Shields, WhatsApp Closers)
 * 2. Pillar 2: Luxury Real Estate Deal Wire (Ikoyi, Lekki, Banana Island, LASRERA 80/20, Alausa)
 * 3. Personal / Family / Unrelated: Automatically silences AI to allow normal personal conversation!
 */

import { processConversationalMessage, AIResponsePayload } from './pillar2/pillar2ConversationalAI';
import { handlePostContactInquiry, CloserResponse } from './monetization/postContactCloserEngine';

export type BusinessDomain = 'PILLAR_1_SME' | 'PILLAR_2_LUXURY_REAL_ESTATE' | 'PERSONAL_OR_UNKNOWN';

export interface UnifiedRoutingResult {
  domain: BusinessDomain;
  shouldAutoReply: boolean;
  replyText?: string;
  sourceModule: string;
  detectedKeywords: string[];
  intent: string;
  ctaLink?: string;
}

// Vocabulary Signatures
const REAL_ESTATE_KEYWORDS = [
  'property', 'estate', 'villa', 'duplex', 'penthouse', 'mansion', 'terrace',
  'ikoyi', 'banana island', 'lekki', 'victoria island', 'epe', 'amen estate',
  'governor', 'consent', 'c of o', 'certificate of occupancy', 'gazette', 'excision',
  'alausa', 'lands bureau', 'survey plan', 'beacons', 'deed of assignment',
  'lasrera', 'co-brokerage', '80/20', 'agency fee', 'jim', 'joint inspection',
  'walkthrough', 'zoom inspection', 'lis pendens', 'buyer mandate', 'harv-', 'deal-'
];

const SME_KEYWORDS = [
  'website', 'mobile site', 'online store', 'catalog', 'software', 'prototype',
  'fake alert', 'bank transfer reconciliation', 'moniepoint shield', 'opay shield',
  'solar calculator', 'boq', 'load sizer', 'salon booking', 'appointment deposit',
  'school fee', 'result gating', 'waybill', 'dispatch tracker', 'stock theft',
  'inventory ledger', 'dfy', 'turnkey', '₦80,000', '₦150,000', '₦80k', '₦150k', 'bm-web'
];

export function routeIncomingWhatsAppMessage(
  messageText: string,
  senderPhone?: string,
  senderName?: string
): UnifiedRoutingResult {
  const text = (messageText || '').toLowerCase().trim();

  // 1. Check for Pillar 2 (Luxury Real Estate) Signatures
  const matchedRealEstate = REAL_ESTATE_KEYWORDS.filter(kw => text.includes(kw));
  if (matchedRealEstate.length >= 1 || text.includes('harv-') || text.includes('deal-') || text.includes('lasrera')) {
    const p2Response = processConversationalMessage({
      senderPhone: senderPhone || '',
      senderName: senderName || 'Valued Client',
      messageText,
      dealContext: {
        propertyTitle: 'Prime Lagos Luxury Asset',
        propertyPrice: 'Market Valuation'
      }
    });

    return {
      domain: 'PILLAR_2_LUXURY_REAL_ESTATE',
      shouldAutoReply: true,
      replyText: p2Response.replyText,
      sourceModule: 'pillar2ConversationalAI',
      detectedKeywords: matchedRealEstate,
      intent: p2Response.intent,
      ctaLink: p2Response.ctaLink
    };
  }

  // 2. Check for Pillar 1 (SME Automation & Sector Tools) Signatures
  const matchedSme = SME_KEYWORDS.filter(kw => text.includes(kw));
  if (matchedSme.length >= 1 || text.includes('bm-web') || text.includes('preview')) {
    const p1Response = handlePostContactInquiry(messageText, {
      businessName: senderName || 'Your Business',
      phone: senderPhone || '',
      hasWebsite: false
    });

    return {
      domain: 'PILLAR_1_SME',
      shouldAutoReply: true,
      replyText: p1Response.messageText,
      sourceModule: 'postContactCloserEngine',
      detectedKeywords: matchedSme,
      intent: p1Response.intent,
      ctaLink: `https://www.bethelmindanalytics.com/preview/${senderPhone || 'demo'}`
    };
  }

  // 3. Personal, Casual, or Unclassified Messages (SILENCE AI TO PREVENT CONFUSION)
  // If a friend, family member, or unrelated contact texts "Hey bro how are you" or "Good morning"
  // the AI will NOT reply with a business pitch!
  return {
    domain: 'PERSONAL_OR_UNKNOWN',
    shouldAutoReply: false,
    sourceModule: 'HUMAN_PASS_THROUGH',
    detectedKeywords: [],
    intent: 'PERSONAL_OR_MANUAL_REVIEW'
  };
}
