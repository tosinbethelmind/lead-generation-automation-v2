/**
 * @file src/lib/monetization/agentReachLeadPackager.ts
 * 
 * Agent-Reach Enhanced B2B Lead Packager & Selar Monetization Engine
 * Bethelmind Analytics Commercial Growth System
 * 
 * - Generates high-value Selar digital lead packs enriched with Agent-Reach data
 *   (Verified Instagram/LinkedIn/Facebook social handles, active catalogs, and direct WhatsApp CTAs).
 * - Generates structured CSV/JSON data bundles for instant client delivery.
 * - Computes pricing models (Instant Buy NGN 15k-35k, Data Protection Addon NGN 3,500).
 */

import fs from 'fs';
import path from 'path';
import { LeadBundle } from './leadBundlePackager';

export interface EnrichedSectorBundle {
  bundleId: string;
  sector: string;
  targetAudience: string;
  leadCount: number;
  priceNGN: number;
  sampleCatalogHighlights: string[];
  selarCheckoutUrl: string;
  tierBadge: '👑 #1 BEST-SELLING BUNDLE' | '💎 HIGH DEMAND SECTOR' | '⚡ RAPID TURNOVER';
  dataCompletenessScore: number; // e.g. 98%
}

export const AGENT_REACH_SECTOR_BUNDLES: EnrichedSectorBundle[] = [
  {
    bundleId: 'AR-SOLAR-LAGOS-500',
    sector: 'Solar & Inverter Contractors (Lagos & Ogun Corridor)',
    targetAudience: 'Solar Wholesalers, Battery Importers, Inverter Engineers',
    leadCount: 500,
    priceNGN: 25000,
    sampleCatalogHighlights: ['5kVA - 10kVA Hybrid Inverters', 'LiFePO4 Lithium Banks', 'Commercial BOQ Sizers'],
    selarCheckoutUrl: 'https://selar.co/m/bethelmind-solar-pack',
    tierBadge: '👑 #1 BEST-SELLING BUNDLE',
    dataCompletenessScore: 99
  },
  {
    bundleId: 'AR-ESTATE-LEKKI-400',
    sector: 'Real Estate Developers & Shortlet Agencies (Lekki / Ikoyi / VI)',
    targetAudience: 'Interior Decorators, Facility Managers, Mortgages',
    leadCount: 400,
    priceNGN: 35000,
    sampleCatalogHighlights: ['Off-plan 4-Bed Duplexes', 'Governor Consent Plots', 'Luxury Shortlet Apartments'],
    selarCheckoutUrl: 'https://selar.co/m/bethelmind-realestate-pack',
    tierBadge: '💎 HIGH DEMAND SECTOR',
    dataCompletenessScore: 97
  },
  {
    bundleId: 'AR-CLINIC-HEALTH-350',
    sector: 'Private Healthcare Clinics, Dental & Diagnostics (Lagos & Abuja)',
    targetAudience: 'Medical Equipment Suppliers, HMOs, Diagnostic Labs',
    leadCount: 350,
    priceNGN: 20000,
    sampleCatalogHighlights: ['Specialist Outpatient Booking', 'Dental Scaling', 'HMO Consultation Retainers'],
    selarCheckoutUrl: 'https://selar.co/m/bethelmind-health-pack',
    tierBadge: '⚡ RAPID TURNOVER',
    dataCompletenessScore: 96
  },
  {
    bundleId: 'AR-AUTO-TOKUNBO-450',
    sector: 'Automotive Dealerships & Tokunbo Importers (Berger / Festac / Ikeja)',
    targetAudience: 'Car Trackers, Auto Insurance, Customs Duty Agents',
    leadCount: 450,
    priceNGN: 25000,
    sampleCatalogHighlights: ['Foreign Used SUVs', 'Customs Duty Cleared Cars', 'Installment Auto Finance'],
    selarCheckoutUrl: 'https://selar.co/m/bethelmind-auto-pack',
    tierBadge: '💎 HIGH DEMAND SECTOR',
    dataCompletenessScore: 98
  },
  {
    bundleId: 'AR-LOGISTICS-HAULAGE-300',
    sector: 'Logistics, Haulage & Dispatch Couriers (Nationwide)',
    targetAudience: 'E-commerce Merchants, Fleet Maintenance, GPS Tracking',
    leadCount: 300,
    priceNGN: 18000,
    sampleCatalogHighlights: ['Interstate Cargo Freight', 'Same-Day Dispatch Bikes', 'Cold-Chain Transport'],
    selarCheckoutUrl: 'https://selar.co/m/bethelmind-logistics-pack',
    tierBadge: '⚡ RAPID TURNOVER',
    dataCompletenessScore: 95
  }
];

/**
 * Generate a downloadable CSV data sample for a bundle
 */
export function generateBundleCsvData(bundleId: string, leads: any[]): string {
  const headers = ['Business Name', 'Sector', 'Phone (E.164)', 'Email', 'WhatsApp Link', 'Location', 'Catalog Highlights', 'Social Profiles'];
  const rows = leads.map(l => [
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.category || '').replace(/"/g, '""')}"`,
    `"${l.phone_e164 || l.phone || ''}"`,
    `"${l.email || ''}"`,
    `"${l.website || l.profile_url || ''}"`,
    `"${(l.address || l.area || 'Lagos, Nigeria').replace(/"/g, '""')}"`,
    `"${(l.catalog_items ? l.catalog_items.join('; ') : '').replace(/"/g, '""')}"`,
    `"${(l.social_handles ? Object.entries(l.social_handles).map(([k, v]) => `${k}:${v}`).join('; ') : '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Get active Agent-Reach sector bundles
 */
export function getAgentReachSectorBundles(): EnrichedSectorBundle[] {
  return AGENT_REACH_SECTOR_BUNDLES;
}
