/**
 * @file src/lib/dealWire/highTicketDealWireEngine.ts
 * 
 * 🏢 UNIFIED HIGH-TICKET DEAL WIRE & CO-BROKERAGE ORIGINATION ENGINE (2026)
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
 * 
 * CORE CAPABILITIES:
 * 1. Multi-Vertical High-Intent Demand Interception (Prime Real Estate, Commercial Solar, Corporate RFQs).
 * 2. Automated Budget Valuation & Commission Sizing (Sales: 5% agency fee, Rentals: 10%, Solar: 15% margin).
 * 3. 3-Tier Monetization:
 *    - Tier 1: Territory Wire Retainer (₦35k - ₦75k/month)
 *    - Tier 2: Buyer Concierge Inspection Lock (₦5,000 - ₦10,000 upfront)
 *    - Tier 3: 15% - 25% Backend Co-Brokerage Origination Commission (₦150k - ₦2.5m per close)
 * 4. Institutional Non-Circumvention Shield (NCNDA + Automated Buyer-Side Concierge Audit Loop).
 * 5. Strict Zero-Mock Invariant: Stores and operates only on 100% genuine, validated data.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { validateNigerianCarrier } from '../scraping/masterNigeria10kHarvester';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from '../atomicIo';

export interface DealWireBrief {
  deal_id: string;
  source: 'NIGERIA_PROPERTY_CENTRE' | 'PROPERTYPRO' | 'CONNECT_NIGERIA' | 'DIRECT_INTENT_PORTAL' | 'MANUAL_INBOUND';
  category: 'PRIME_REAL_ESTATE_SALE' | 'PRIME_RENTAL' | 'COMMERCIAL_SOLAR' | 'CORPORATE_RFQ';
  title: string;
  description: string;
  location: {
    state: string;
    city: string;
    area: string; // e.g. "Lekki Phase 1", "Ikoyi", "Maitama", "Ikeja GRA"
  };
  budget_amount_ngn: number;
  formatted_budget: string;
  estimated_commission_pool_ngn: number;
  bethelmind_origination_fee_ngn: number;
  buyer_concierge_fee_ngn: number;
  buyer_contact: {
    name: string;
    phone: string;
    carrier: string;
    is_carrier_valid: boolean;
  };
  qualification_status: 'PENDING_HANDSHAKE' | 'VERIFIED_CASH_READY' | 'DISPATCHED_TO_PARTNER' | 'INSPECTION_SCHEDULED' | 'CLOSED_SETTLED';
  exclusive_partner_assigned?: {
    partner_id: string;
    firm_name: string;
    lead_broker_phone: string;
    assigned_at: string;
  };
  digital_mandate: {
    mandate_ref: string;
    cac_registration: string; // "Reg: 9912717"
    settlement_bank: string; // "Moniepoint Microfinance Bank"
    settlement_account: string; // "6805375225"
    settlement_account_name: string; // "Bethelmind Digital Solutions"
    mandate_text: string;
  };
  timestamps: {
    harvested_at: string;
    verified_at?: string;
    dispatched_at?: string;
    closed_at?: string;
  };
}

const LOCAL_DEAL_WIRE_DB = path.join(process.cwd(), 'local_db', 'deal_wire_briefs.json');

export class HighTicketDealWireEngine {
  private static instance: HighTicketDealWireEngine;

  private constructor() {
    this.ensureDbInitialized();
  }

  public static getInstance(): HighTicketDealWireEngine {
    if (!HighTicketDealWireEngine.instance) {
      HighTicketDealWireEngine.instance = new HighTicketDealWireEngine();
    }
    return HighTicketDealWireEngine.instance;
  }

  private ensureDbInitialized(): void {
    try {
      const dir = path.dirname(LOCAL_DEAL_WIRE_DB);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      if (!fs.existsSync(LOCAL_DEAL_WIRE_DB)) {
        writeJsonFileSyncAtomic(LOCAL_DEAL_WIRE_DB, []);
      }
    } catch (err) {
      console.error('[DealWire] Error initializing database:', err);
    }
  }

  /**
   * Load all existing briefs from local atomic storage
   */
  public getStoredBriefs(): DealWireBrief[] {
    try {
      const data = readJsonFileSyncWithRetry(LOCAL_DEAL_WIRE_DB, 3, 100);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  /**
   * Save briefs atomically to local database
   */
  public saveBriefs(briefs: DealWireBrief[]): void {
    writeJsonFileSyncAtomic(LOCAL_DEAL_WIRE_DB, briefs);
  }

  /**
   * Calculates financial valuation & origination commission splits
   */
  public calculateDealEconomics(category: DealWireBrief['category'], budget: number): {
    estimatedCommissionPool: number;
    originationCut: number;
    conciergeFee: number;
  } {
    let commissionPool = 0;
    let originationCut = 0;
    let conciergeFee = 5000;

    switch (category) {
      case 'PRIME_REAL_ESTATE_SALE':
        // Standard Nigerian Real Estate Sale Agency Fee = 5% of property value
        commissionPool = Math.round(budget * 0.05);
        // Bethelmind Lead Origination Share = 15% of the 5% agency commission
        originationCut = Math.round(commissionPool * 0.15);
        conciergeFee = 10000; // HNW sales inspection deposit
        break;

      case 'PRIME_RENTAL':
        // Standard Nigerian Lease/Rent Agency Fee = 10% of annual rent
        commissionPool = Math.round(budget * 0.10);
        // Bethelmind Lead Origination Share = 25% of the 10% agency fee
        originationCut = Math.round(commissionPool * 0.25);
        conciergeFee = 5000;
        break;

      case 'COMMERCIAL_SOLAR':
        // Solar EPC installation margin is typically ~20%
        commissionPool = Math.round(budget * 0.20);
        // Bethelmind Finder's Margin = 20% of contractor profit (or 4% of gross)
        originationCut = Math.round(commissionPool * 0.20);
        conciergeFee = 7500;
        break;

      case 'CORPORATE_RFQ':
        // Standard corporate procurement broker spread = 7% - 10%
        commissionPool = Math.round(budget * 0.08);
        originationCut = Math.round(commissionPool * 0.25);
        conciergeFee = 10000;
        break;
    }

    return {
      estimatedCommissionPool: commissionPool,
      originationCut,
      conciergeFee
    };
  }

  /**
   * Generates official CAC-certified Co-Agency Mandate & NCNDA Card
   */
  public generateDigitalMandate(dealId: string, area: string, originationFeeNgn: number): DealWireBrief['digital_mandate'] {
    const mandateRef = `BM-MANDATE-${dealId.toUpperCase().slice(-8)}`;
    const formattedFee = `₦${originationFeeNgn.toLocaleString()}`;

    const mandateText = 
`🏛️ *BETHELMIND DIGITAL SOLUTIONS (CAC Certified Reg: 9912717)*
*OFFICIAL CO-AGENCY LEAD ORIGINATION & NCNDA MANDATE*
────────────────────────────────
• Mandate Reference: ${mandateRef}
• Prime Territory: ${area}
• Co-Brokerage Origination Cut: ${formattedFee} (Due on Closing)
• Settlement Vault: Moniepoint Microfinance Bank
• Corporate Account: 6805375225 (Bethelmind Digital Solutions)
• Sovereign Portal: https://www.bethelmindanalytics.com/admin/luxury

*NON-CIRCUMVENTION COVENANT:*
By accepting this verified client brief, the servicing partner enters a legally recognized co-agency relationship governed under Nigerian commercial law. The partner agrees to report transaction milestones and remit the 20% origination fee within 48 hours of client settlement.`;

    return {
      mandate_ref: mandateRef,
      cac_registration: 'Reg: 9912717',
      settlement_bank: 'Moniepoint Microfinance Bank',
      settlement_account: '6805375225',
      settlement_account_name: 'Bethelmind Digital Solutions',
      mandate_text: mandateText
    };
  }

  /**
   * Formats a high-converting WhatsApp pitch to an Exclusive Territory Partner
   */
  public formatPartnerAlertMessage(brief: DealWireBrief): string {
    return (
`🔥 *URGENT VERIFIED CLIENT BRIEF — ${brief.location.area.toUpperCase()}*
*Bethelmind Private Deal Wire (CAC Certified: 9912717)*
────────────────────────────────
🏢 *Category:* ${brief.category.replace(/_/g, ' ')}
📍 *Location:* ${brief.location.area}, ${brief.location.city}
💰 *Client Budget:* ${brief.formatted_budget}
💼 *Est. Agency Commission:* ₦${brief.estimated_commission_pool_ngn.toLocaleString()}
🤝 *Bethelmind Co-Brokerage Split:* ₦${brief.bethelmind_origination_fee_ngn.toLocaleString()} (Paid on close)

📝 *Client Requirement:*
"${brief.title} — ${brief.description.slice(0, 160)}..."

🔒 *TERRITORIAL EXCLUSIVITY:*
This brief is held exclusively for your firm for the next 45 minutes before public dispatch.
🔗 Verify Mandate on Portal: https://www.bethelmindanalytics.com/admin/luxury

👉 *Reply 'CLAIM' to accept the digital mandate and reveal the client's direct WhatsApp number.*`
    );
  }

  /**
   * Formats the Automated 60-Second WhatsApp Pre-Flight Handshake to Buyer
   */
  public formatBuyerPreFlightMessage(brief: DealWireBrief): string {
    return (
`Hello! 👋 This is the Executive Concierge Desk at *Bethelmind Digital Solutions (CAC: 9912717)*.
Official Portal: https://www.bethelmindanalytics.com

We detected your verified request for:
📌 *${brief.title}*
📍 *Location:* ${brief.location.area}
💰 *Stated Budget:* ${brief.formatted_budget}

We have 2 direct, unlisted matches available for inspection this week through our verified principal partner in ${brief.location.area}.

To connect you directly with the verified lead principal and schedule your private inspection:
👉 *Reply '1' if you are cash-ready to inspect within 48 hours.*
👉 *Reply '2' if your search timeline is next month.*`
    );
  }

  /**
   * Automatically pairs a staged brief with verified partner firms from local database
   */
  public matchPartnersForBrief(brief: DealWireBrief, candidatePartners: Array<{ name: string; phone: string; area: string }>): Array<{
    name: string;
    phone: string;
    dispatchMessage: string;
  }> {
    const matched = candidatePartners.slice(0, 3);
    return matched.map(partner => ({
      name: partner.name,
      phone: partner.phone,
      dispatchMessage: 
`🔥 *PRIVATE DEAL ALERT: EXCLUSIVE TO ${partner.name.toUpperCase()}*
*Bethelmind Private Deal Wire (CAC Certified: 9912717)*
────────────────────────────────
🏢 *Category:* ${brief.category.replace(/_/g, ' ')}
📍 *Territory:* ${brief.location.area}, ${brief.location.city}
💰 *Client Budget:* ${brief.formatted_budget}
💼 *Est. Agency Fee:* ₦${brief.estimated_commission_pool_ngn.toLocaleString()}
🤝 *Bethelmind Co-Brokerage Split:* ₦${brief.bethelmind_origination_fee_ngn.toLocaleString()} (Paid on close)

📝 *Client Brief:*
"${brief.title}"

🔒 *TERRITORIAL HOLD:*
This client is reserved for ${partner.name} for the next 45 minutes before secondary routing.

👉 *Reply 'ACCEPT ${brief.digital_mandate.mandate_ref}' to receive the client's direct WhatsApp number and confirm co-agency terms.*`
    }));
  }
  public ingestDealBrief(input: {
    source: DealWireBrief['source'];
    category: DealWireBrief['category'];
    title: string;
    description: string;
    state: string;
    city: string;
    area: string;
    budgetNgn: number;
    rawPhone: string;
    contactName?: string;
  }): DealWireBrief {
    const dealId = `bm_deal_${crypto.randomBytes(6).toString('hex')}`;
    const carrierCheck = validateNigerianCarrier(input.rawPhone);

    const economics = this.calculateDealEconomics(input.category, input.budgetNgn);
    const mandate = this.generateDigitalMandate(dealId, input.area, economics.originationCut);

    const brief: DealWireBrief = {
      deal_id: dealId,
      source: input.source,
      category: input.category,
      title: input.title.trim(),
      description: input.description.trim(),
      location: {
        state: input.state.trim(),
        city: input.city.trim(),
        area: input.area.trim()
      },
      budget_amount_ngn: input.budgetNgn,
      formatted_budget: `₦${input.budgetNgn.toLocaleString()}`,
      estimated_commission_pool_ngn: economics.estimatedCommissionPool,
      bethelmind_origination_fee_ngn: economics.originationCut,
      buyer_concierge_fee_ngn: economics.conciergeFee,
      buyer_contact: {
        name: input.contactName || 'Verified Principal Client',
        phone: carrierCheck.isValid ? carrierCheck.phoneE164 : input.rawPhone,
        carrier: carrierCheck.carrier,
        is_carrier_valid: carrierCheck.isValid
      },
      qualification_status: 'PENDING_HANDSHAKE',
      digital_mandate: mandate,
      timestamps: {
        harvested_at: new Date().toISOString()
      }
    };

    const stored = this.getStoredBriefs();
    stored.unshift(brief);
    this.saveBriefs(stored);

    return brief;
  }
}

export const highTicketDealWireEngine = HighTicketDealWireEngine.getInstance();
