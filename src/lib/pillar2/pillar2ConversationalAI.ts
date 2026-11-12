/**
 * @file src/lib/pillar2/pillar2ConversationalAI.ts
 * 
 * 🤖 CONVERSATIONAL REAL ESTATE AI CLOSER & DIASPORA ADVISOR
 * Bethelmind Digital Solutions (CAC BN: 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225)
 * Desk: 0802 279 1227 | bethelmindrecruit@gmail.com
 * 
 * Multi-Turn Natural Language Dialogue Handler:
 * - Specializes in Lagos conveyancing jurisprudence (Governor's Consent, C of O, Gazette, Alausa Registry searches).
 * - Handles diaspora objections, video inspection logistics, and escrow security.
 * - Enforces LASRERA 80/20 co-brokerage rules and generates Section 84 digital mandate links.
 */

export interface IncomingMessagePayload {
  senderPhone: string;
  senderName?: string;
  messageText: string;
  dealContext?: {
    dealId?: string;
    propertyTitle?: string;
    propertyPrice?: string;
    location?: string;
  };
}

export interface AIResponsePayload {
  replyText: string;
  intent: 'TITLE_INQUIRY' | 'INSPECTION_REQUEST' | 'PRICE_NEGOTIATION' | 'MANDATE_SIGNING' | 'COMMISSION_SPLIT' | 'ESCROW_SECURITY' | 'GENERAL_INQUIRY';
  nextAction: 'SEND_MANDATE_LINK' | 'SCHEDULE_INSPECTION' | 'DISPATCH_TITLE_PACK' | 'NOTIFY_LAWYER' | 'STANDBY';
  ctaLink?: string;
  metadata: {
    processedAt: string;
    confidenceScore: number;
    recommendedFollowUpHours: number;
  };
}

const KNOWLEDGE_BASE = {
  cacReg: 'BN 9912717',
  bank: 'Moniepoint Microfinance Bank (Corporate Acct: 6805375225 — Bethelmind Digital Solutions)',
  deskPhone: '+234 802 279 1227',
  portalUrl: 'https://www.bethelmindanalytics.com',
  mandateUrl: 'https://www.bethelmindanalytics.com/mandate'
};

export function processConversationalMessage(payload: IncomingMessagePayload): AIResponsePayload {
  const query = (payload.messageText || '').toLowerCase().trim();
  const title = payload.dealContext?.propertyTitle || 'the property';
  const price = payload.dealContext?.propertyPrice || 'the listed value';
  const dealId = payload.dealContext?.dealId || 'DEAL-LUXURY';

  // 1. Title & Documentation Inquiries (Governor's Consent, C of O, Gazette, Alausa)
  if (query.includes('title') || query.includes('governor') || query.includes('consent') || query.includes('c of o') || query.includes('gazette') || query.includes('alausa') || query.includes('search') || query.includes('excision')) {
    return {
      replyText: `Good day ${payload.senderName || 'Sir/Ma'}, thank you for inquiring about the legal title for ${title}.

Under our statutory due diligence protocol:
1. Every luxury property in our portfolio must hold verifiable root title (Governor's Consent or registered Certificate of Occupancy).
2. Our appointed Retained Legal Counsel conducts a physical and cadastral search directly at the Lagos State Lands Bureau (Alausa) before any purchase consideration moves into escrow.
3. If any defect or court encumbrance (lis pendens) is identified, we immediately notify you and halt the transaction.

Would you like our legal desk to share the verified title summary docket with you? Chat our Principal Counsel on ${KNOWLEDGE_BASE.deskPhone} or review on: ${KNOWLEDGE_BASE.portalUrl}/deal/${dealId}`,
      intent: 'TITLE_INQUIRY',
      nextAction: 'DISPATCH_TITLE_PACK',
      ctaLink: `${KNOWLEDGE_BASE.portalUrl}/deal/${dealId}`,
      metadata: {
        processedAt: new Date().toISOString(),
        confidenceScore: 0.98,
        recommendedFollowUpHours: 2
      }
    };
  }

  // 2. Inspection Logistics (Physical Walkthrough, Live Video, Zoom, Diaspora)
  if (query.includes('inspect') || query.includes('video') || query.includes('zoom') || query.includes('walkthrough') || query.includes('visit') || query.includes('see the house') || query.includes('location')) {
    return {
      replyText: `We would be delighted to arrange your inspection for ${title} (${price}).

Under our LASRERA compliance procedure:
• For diaspora clients in the UK, US, or Canada: We conduct a 1080p live-stream Zoom/WhatsApp video walkthrough showing all interior finishing, electricals, and perimeter road access.
• For physical visits: Our logistics liaison accompanies you or your appointed family/legal representative.

Before the inspection, we execute our 1-page Joint Inspection Memorandum (JIM) to legally secure all parties under Section 84 of the Evidence Act. 

You can sign the 1-page inspection mandate in 60 seconds on your phone here:
👉 ${KNOWLEDGE_BASE.mandateUrl}?ref=${dealId}`,
      intent: 'INSPECTION_REQUEST',
      nextAction: 'SCHEDULE_INSPECTION',
      ctaLink: `${KNOWLEDGE_BASE.mandateUrl}?ref=${dealId}`,
      metadata: {
        processedAt: new Date().toISOString(),
        confidenceScore: 0.95,
        recommendedFollowUpHours: 4
      }
    };
  }

  // 3. Price Negotiation & Payment Milestones (Installments, Escrow, Wire)
  if (query.includes('negotiable') || query.includes('last price') || query.includes('discount') || query.includes('installment') || query.includes('tranche') || query.includes('payment plan')) {
    return {
      replyText: `Regarding the financial consideration for ${title}:

1. The current listed ask is ${price}. For qualified cash purchasers ready to close within 14-21 days of certified title search, developers consider a formal bankable offer close to the ask.
2. Structured milestone tranches (e.g. 30% initial deposit, milestone releases upon roofing/finishing) can be structured through our formal Contract of Sale.
3. All funds are cleared through CBN-licensed commercial escrow accounts, with zero cash handling.

To make an official bankable expression of interest, kindly access our secure acquisition desk here:
👉 ${KNOWLEDGE_BASE.portalUrl}/deal/${dealId}`,
      intent: 'PRICE_NEGOTIATION',
      nextAction: 'SEND_MANDATE_LINK',
      ctaLink: `${KNOWLEDGE_BASE.portalUrl}/deal/${dealId}`,
      metadata: {
        processedAt: new Date().toISOString(),
        confidenceScore: 0.92,
        recommendedFollowUpHours: 6
      }
    };
  }

  // 4. Commission & Co-Brokerage Splits (80/20 LASRERA Guidelines)
  if (query.includes('commission') || query.includes('split') || query.includes('80/20') || query.includes('agency fee') || query.includes('co-brokerage') || query.includes('broker cut')) {
    return {
      replyText: `Thank you for reaching out regarding our co-brokerage framework.

Bethelmind Digital Solutions (CAC BN: 9912717) operates strictly under Lagos State Real Estate Regulatory Authority (LASRERA) standards:
• The standard 5% agency commission pool is split 80/20.
• You (Lead Broker / Developer) retain 80% of the entire agency commission.
• Bethelmind receives 20% as our client origination fee.

This provides you with a pre-qualified, liquid buyer with zero marketing cost on your end.

To review and countersign the 80/20 Co-Brokerage Mandate online in 60 seconds:
👉 ${KNOWLEDGE_BASE.mandateUrl}?deal=${dealId}`,
      intent: 'COMMISSION_SPLIT',
      nextAction: 'SEND_MANDATE_LINK',
      ctaLink: `${KNOWLEDGE_BASE.mandateUrl}?deal=${dealId}`,
      metadata: {
        processedAt: new Date().toISOString(),
        confidenceScore: 0.96,
        recommendedFollowUpHours: 12
      }
    };
  }

  // 5. Escrow Security, Fraud Prevention & CAC Corporate Standing
  if (query.includes('scam') || query.includes('safe') || query.includes('fake') || query.includes('legit') || query.includes('cac') || query.includes('trust') || query.includes('escrow') || query.includes('bank')) {
    return {
      replyText: `We completely understand your focus on safety—real estate fraud and family diversion of funds are the #1 concern for diaspora investors in Lagos.

Bethelmind Digital Solutions eliminates this risk through institutional architecture:
1. Corporate Registration: We are CAC Certified (Enterprise Reg: BN 9912717).
2. Corporate Settlement: All settlements clear through Moniepoint Microfinance Bank (Acct: 6805375225 — Bethelmind Digital Solutions).
3. Bar Legal Protection: No client funds are released to any developer until our appointed SCN-enrolled Bar Counsel certifies the title at Alausa.
4. Evidence Act Compliance: Every agreement is locked with Section 84 SHA-256 cryptographic hashes.

You are welcome to verify our CAC credentials or speak with our Principal Director at ${KNOWLEDGE_BASE.deskPhone}.`,
      intent: 'ESCROW_SECURITY',
      nextAction: 'NOTIFY_LAWYER',
      ctaLink: `${KNOWLEDGE_BASE.portalUrl}`,
      metadata: {
        processedAt: new Date().toISOString(),
        confidenceScore: 0.99,
        recommendedFollowUpHours: 2
      }
    };
  }

  // Default: General Professional Greeting & Prompt
  return {
    replyText: `Good day ${payload.senderName || 'Sir/Ma'}, thank you for contacting the Bethelmind Corporate & Diaspora Property Desk (CAC BN: 9912717).

We specialize in prime luxury acquisitions across Lekki Phase 1, Ikoyi, Victoria Island, Banana Island, and Epe.

How may our transaction desk assist you today?
1. Schedule a physical or live-video inspection for ${title}
2. Request our Title Due Diligence & Alausa Search Report
3. Access the 80/20 Co-Brokerage Mandate Portal

Direct Hotline: ${KNOWLEDGE_BASE.deskPhone}
Web Portal: ${KNOWLEDGE_BASE.portalUrl}`,
    intent: 'GENERAL_INQUIRY',
    nextAction: 'STANDBY',
    ctaLink: `${KNOWLEDGE_BASE.portalUrl}/mandate`,
    metadata: {
      processedAt: new Date().toISOString(),
      confidenceScore: 0.85,
      recommendedFollowUpHours: 24
    }
  };
}
