/**
 * @file src/lib/monetization/appointmentLeadRouter.ts
 * 
 * Shadow B2B Pay-Per-Appointment Lead Arbitrage Marketplace Router.
 * 
 * Captures high-budget consumer requests and routes them to 3 pre-vetted contractors
 * charging ₦25,000–₦50,000 per qualified meeting / on-site inspection.
 */

export interface AppointmentLead {
  leadId: string;
  customerName: string;
  customerPhone: string;
  sector: 'SOLAR_INSTALLATION' | 'DENTAL_AESTHETICS' | 'SHORTLET_PROPERTY' | 'COMMERCIAL_CONSTRUCTION';
  estimatedProjectBudgetNGN: number;
  location: string;
  buyerIntentScore: number;
  monetizationFeeNGN: number;
  matchedBuyersCount: number;
}

export const APPOINTMENT_FEE_RATES: Record<string, number> = {
  'SOLAR_INSTALLATION': 45000,
  'DENTAL_AESTHETICS': 25000,
  'SHORTLET_PROPERTY': 35000,
  'COMMERCIAL_CONSTRUCTION': 50000
};

export function routeAppointmentLeadToContractors(lead: Partial<AppointmentLead>): {
  routedLead: AppointmentLead;
  estimatedArbitrageRevenueNGN: number;
} {
  const sector = lead.sector || 'SOLAR_INSTALLATION';
  const fee = APPOINTMENT_FEE_RATES[sector] || 35000;

  const fullLead: AppointmentLead = {
    leadId: lead.leadId || `LEAD-${Date.now()}`,
    customerName: lead.customerName || 'High-Intent Buyer',
    customerPhone: lead.customerPhone || '0800000000',
    sector,
    estimatedProjectBudgetNGN: lead.estimatedProjectBudgetNGN || 5000000,
    location: lead.location || 'Lekki Phase 1, Lagos',
    buyerIntentScore: 92,
    monetizationFeeNGN: fee,
    matchedBuyersCount: 3
  };

  const estimatedArbitrageRevenueNGN = fullLead.monetizationFeeNGN * fullLead.matchedBuyersCount;

  return {
    routedLead: fullLead,
    estimatedArbitrageRevenueNGN
  };
}
