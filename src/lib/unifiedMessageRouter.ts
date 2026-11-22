/**
 * @file src/lib/unifiedMessageRouter.ts
 * 
 * 🔀 BETHELMIND MULTI-BUSINESS INTENT ROUTER & CONTEXT DISPATCHER
 * Bethelmind Digital Solutions (CAC BN: 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225)
 * 
 * Focus: 100% Zero-Crypto B2B Commercial Growth Engine (SME Automation & Sector Tools)
 * 1. Pillar 1: SME Automation & Sector Tools (Websites, Fake Alert Shields, WhatsApp Closers)
 * 2. Personal / Family / Unrelated / Other Businesses (StarkTV): Automatically silences AI to allow normal human conversation!
 */

import { handlePostContactInquiry, CloserResponse } from './monetization/postContactCloserEngine';

export type BusinessDomain = 'PILLAR_1_SME' | 'PERSONAL_OR_UNKNOWN';

export interface UnifiedRoutingResult {
  domain: BusinessDomain;
  shouldAutoReply: boolean;
  replyText?: string;
  sourceModule: string;
  detectedKeywords: string[];
  intent: string;
  ctaLink?: string;
}

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

  // 1. Check for Pillar 1 (SME Automation & Sector Tools) Signatures
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

  // 2. Personal, Casual, StarkTV, or Unclassified Messages (SILENCE AI TO PREVENT CONFUSION)
  // If a friend, family member, StarkTV client, or unrelated contact texts,
  // the AI will NOT reply with a business pitch!
  return {
    domain: 'PERSONAL_OR_UNKNOWN',
    shouldAutoReply: false,
    sourceModule: 'HUMAN_PASS_THROUGH',
    detectedKeywords: [],
    intent: 'PERSONAL_OR_MANUAL_REVIEW'
  };
}
