/**
 * @file pipelineManager.ts
 * Visual Pipeline & Deal Management Engine
 * 
 * Provides CRM-grade deal pipeline with:
 * - Customizable stages per sector (solar, real_estate, etc.)
 * - Deal CRUD with Supabase + local JSON fallback
 * - Stage transitions with activity logging
 * - Deal value tracking and pipeline analytics
 * - Lead-to-Deal conversion
 */

import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient';
import { getRuntimeConfig } from './localConfig';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';
import { logActivity, ActivityType } from './activityLogger';
import type { CategoryKey } from './pitchHelper';

// ============================================================================
// Pipeline Stage Definitions per Sector
// ============================================================================

export interface PipelineStage {
  id: string;
  label: string;
  color: string;
  icon: string;
  order: number;
}

export const DEFAULT_STAGES: PipelineStage[] = [
  { id: 'new_lead',      label: 'New Lead',       color: '#6366f1', icon: '📥', order: 0 },
  { id: 'contacted',     label: 'Contacted',      color: '#3b82f6', icon: '📤', order: 1 },
  { id: 'qualified',     label: 'Qualified',      color: '#06b6d4', icon: '✅', order: 2 },
  { id: 'proposal_sent', label: 'Proposal Sent',  color: '#f59e0b', icon: '📋', order: 3 },
  { id: 'negotiation',   label: 'Negotiation',    color: '#f97316', icon: '🤝', order: 4 },
  { id: 'won',           label: 'Won',            color: '#22c55e', icon: '🏆', order: 5 },
  { id: 'lost',          label: 'Lost',           color: '#ef4444', icon: '❌', order: 6 },
];

export const SECTOR_STAGES: Record<string, PipelineStage[]> = {
  solar: [
    { id: 'new_lead',       label: 'New Inquiry',         color: '#6366f1', icon: '📥', order: 0 },
    { id: 'contacted',      label: 'Contacted',           color: '#3b82f6', icon: '📤', order: 1 },
    { id: 'site_survey',    label: 'Site Survey',         color: '#06b6d4', icon: '📍', order: 2 },
    { id: 'design_quote',   label: 'Design & BOQ',        color: '#8b5cf6', icon: '📐', order: 3 },
    { id: 'proposal_sent',  label: 'Proposal Sent',       color: '#f59e0b', icon: '📋', order: 4 },
    { id: 'negotiation',    label: 'Negotiation',         color: '#f97316', icon: '🤝', order: 5 },
    { id: 'deposit_paid',   label: 'Deposit Paid',        color: '#10b981', icon: '💰', order: 6 },
    { id: 'installation',   label: 'Installation',        color: '#14b8a6', icon: '🔧', order: 7 },
    { id: 'commissioning',  label: 'Commissioning',       color: '#22c55e', icon: '⚡', order: 8 },
    { id: 'won',            label: 'Completed',           color: '#22c55e', icon: '🏆', order: 9 },
    { id: 'lost',           label: 'Lost',                color: '#ef4444', icon: '❌', order: 10 },
  ],
  real_estate: [
    { id: 'new_lead',       label: 'New Inquiry',         color: '#6366f1', icon: '📥', order: 0 },
    { id: 'contacted',      label: 'Contacted',           color: '#3b82f6', icon: '📤', order: 1 },
    { id: 'qualified',      label: 'Qualified',           color: '#06b6d4', icon: '✅', order: 2 },
    { id: 'inspection',     label: 'Inspection Booked',   color: '#8b5cf6', icon: '🏠', order: 3 },
    { id: 'offer_made',     label: 'Offer Made',          color: '#f59e0b', icon: '📋', order: 4 },
    { id: 'negotiation',    label: 'Negotiation',         color: '#f97316', icon: '🤝', order: 5 },
    { id: 'payment_plan',   label: 'Payment Plan',        color: '#10b981', icon: '💰', order: 6 },
    { id: 'documentation',  label: 'Documentation',       color: '#14b8a6', icon: '📄', order: 7 },
    { id: 'won',            label: 'Closed',              color: '#22c55e', icon: '🏆', order: 8 },
    { id: 'lost',           label: 'Lost',                color: '#ef4444', icon: '❌', order: 9 },
  ],
  school: [
    { id: 'new_lead',       label: 'Inquiry',             color: '#6366f1', icon: '📥', order: 0 },
    { id: 'contacted',      label: 'Contacted',           color: '#3b82f6', icon: '📤', order: 1 },
    { id: 'application',    label: 'Application',         color: '#06b6d4', icon: '📝', order: 2 },
    { id: 'entrance_exam',  label: 'Entrance Exam',       color: '#8b5cf6', icon: '📖', order: 3 },
    { id: 'interview',      label: 'Interview',           color: '#f59e0b', icon: '🎤', order: 4 },
    { id: 'admitted',       label: 'Admitted',            color: '#10b981', icon: '🎓', order: 5 },
    { id: 'enrolled',       label: 'Enrolled & Paid',     color: '#22c55e', icon: '🏆', order: 6 },
    { id: 'lost',           label: 'Declined',            color: '#ef4444', icon: '❌', order: 7 },
  ],
  medical: [
    { id: 'new_lead',       label: 'New Patient',         color: '#6366f1', icon: '📥', order: 0 },
    { id: 'contacted',      label: 'Contacted',           color: '#3b82f6', icon: '📤', order: 1 },
    { id: 'appointment',    label: 'Appointment Set',     color: '#06b6d4', icon: '📅', order: 2 },
    { id: 'consultation',   label: 'Consultation',        color: '#8b5cf6', icon: '🩺', order: 3 },
    { id: 'treatment',      label: 'Treatment Plan',      color: '#f59e0b', icon: '💊', order: 4 },
    { id: 'follow_up',      label: 'Follow-Up',           color: '#10b981', icon: '🔄', order: 5 },
    { id: 'won',            label: 'Retained Patient',    color: '#22c55e', icon: '🏆', order: 6 },
    { id: 'lost',           label: 'Lost',                color: '#ef4444', icon: '❌', order: 7 },
  ],
  auto: [
    { id: 'new_lead',       label: 'New Inquiry',         color: '#6366f1', icon: '📥', order: 0 },
    { id: 'contacted',      label: 'Contacted',           color: '#3b82f6', icon: '📤', order: 1 },
    { id: 'test_drive',     label: 'Test Drive',          color: '#06b6d4', icon: '🚗', order: 2 },
    { id: 'valuation',      label: 'Valuation/Quote',     color: '#8b5cf6', icon: '💎', order: 3 },
    { id: 'negotiation',    label: 'Negotiation',         color: '#f59e0b', icon: '🤝', order: 4 },
    { id: 'financing',      label: 'Financing',           color: '#f97316', icon: '🏦', order: 5 },
    { id: 'won',            label: 'Sold',                color: '#22c55e', icon: '🏆', order: 6 },
    { id: 'lost',           label: 'Lost',                color: '#ef4444', icon: '❌', order: 7 },
  ],
  retail: [
    { id: 'new_lead',       label: 'New Visitor',         color: '#6366f1', icon: '📥', order: 0 },
    { id: 'contacted',      label: 'Contacted',           color: '#3b82f6', icon: '📤', order: 1 },
    { id: 'browsing',       label: 'Browsing',            color: '#06b6d4', icon: '👁️', order: 2 },
    { id: 'cart',           label: 'Added to Cart',       color: '#f59e0b', icon: '🛒', order: 3 },
    { id: 'checkout',       label: 'Checkout',            color: '#f97316', icon: '💳', order: 4 },
    { id: 'won',            label: 'Purchased',           color: '#22c55e', icon: '🏆', order: 5 },
    { id: 'lost',           label: 'Abandoned',           color: '#ef4444', icon: '❌', order: 6 },
  ],
  restaurant: [
    { id: 'new_lead',       label: 'New Inquiry',         color: '#6366f1', icon: '📥', order: 0 },
    { id: 'contacted',      label: 'Contacted',           color: '#3b82f6', icon: '📤', order: 1 },
    { id: 'reservation',    label: 'Reserved',            color: '#06b6d4', icon: '📅', order: 2 },
    { id: 'catering_quote', label: 'Catering Quote',      color: '#f59e0b', icon: '🍽️', order: 3 },
    { id: 'deposit_paid',   label: 'Deposit Paid',        color: '#10b981', icon: '💰', order: 4 },
    { id: 'won',            label: 'Fulfilled',           color: '#22c55e', icon: '🏆', order: 5 },
    { id: 'lost',           label: 'Cancelled',           color: '#ef4444', icon: '❌', order: 6 },
  ],
  legal: [
    { id: 'new_lead',       label: 'New Inquiry',         color: '#6366f1', icon: '📥', order: 0 },
    { id: 'contacted',      label: 'Contacted',           color: '#3b82f6', icon: '📤', order: 1 },
    { id: 'consultation',   label: 'Consultation',        color: '#06b6d4', icon: '⚖️', order: 2 },
    { id: 'engaged',        label: 'Engaged',             color: '#8b5cf6', icon: '📝', order: 3 },
    { id: 'active_case',    label: 'Active Case',         color: '#f59e0b', icon: '📂', order: 4 },
    { id: 'in_court',       label: 'In Court',            color: '#f97316', icon: '🏛️', order: 5 },
    { id: 'won',            label: 'Settled/Won',         color: '#22c55e', icon: '🏆', order: 6 },
    { id: 'lost',           label: 'Lost/Closed',         color: '#ef4444', icon: '❌', order: 7 },
  ],
};

// ============================================================================
// Deal Interface
// ============================================================================

export interface Deal {
  id: string;
  lead_id: string;
  title: string;
  stage_id: string;
  sector: string;
  value: number;
  currency: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  category: string;
  area: string;
  city: string;
  assigned_to: string;
  notes: string;
  probability: number;
  expected_close_date: string;
  actual_close_date: string;
  created_at: string;
  updated_at: string;
  won_at: string;
  lost_at: string;
  lost_reason: string;
  tags: string; // JSON array string
  custom_fields: string; // JSON object string
}

export interface DealCreateInput {
  lead_id?: string;
  title: string;
  stage_id?: string;
  sector?: string;
  value?: number;
  currency?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  category?: string;
  area?: string;
  city?: string;
  assigned_to?: string;
  notes?: string;
  probability?: number;
  expected_close_date?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

export interface PipelineStats {
  totalDeals: number;
  totalValue: number;
  wonValue: number;
  lostCount: number;
  avgDealValue: number;
  stageBreakdown: { stage_id: string; label: string; count: number; value: number }[];
  conversionRate: number;
}

// ============================================================================
// Local Fallback Storage (mirrors existing codebase pattern)
// ============================================================================

const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getDealsFilePath(): string {
  return isServerless
    ? path.join('/tmp', 'pipeline_deals.json')
    : path.join(process.cwd(), 'local_db', 'pipeline_deals.json');
}

function readLocalDeals(): Record<string, Deal> {
  try {
    const filePath = getDealsFilePath();
    return readJsonFileSyncWithRetry<Record<string, Deal>>(filePath, {});
  } catch {
    return {};
  }
}

function writeLocalDeals(deals: Record<string, Deal>): void {
  try {
    const filePath = getDealsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    writeJsonFileSyncAtomic(filePath, deals);
  } catch (e) {
    console.error('[PipelineManager] Error writing local deals:', e);
  }
}

function isTableMissingError(error: any): boolean {
  if (!error) return false;
  const msg = String(error.message || '').toLowerCase();
  const code = String(error.code || '');
  return code === '42P01' || msg.includes('does not exist') || msg.includes('schema cache') ||
    msg.includes('api key') || msg.includes('unauthorized') || msg.includes('apikey');
}

// ============================================================================
// Pipeline Stage Helpers
// ============================================================================

export function getStagesForSector(sector: string): PipelineStage[] {
  return SECTOR_STAGES[sector] || DEFAULT_STAGES;
}

export function getAllSectorOptions(): { key: string; label: string }[] {
  return [
    { key: 'general',    label: 'General Business' },
    { key: 'solar',      label: 'Solar & Energy' },
    { key: 'real_estate', label: 'Real Estate' },
    { key: 'school',     label: 'Education' },
    { key: 'medical',    label: 'Healthcare' },
    { key: 'auto',       label: 'Automotive' },
    { key: 'retail',     label: 'Retail & E-Commerce' },
    { key: 'restaurant', label: 'Restaurant & Hospitality' },
    { key: 'legal',      label: 'Legal & Professional' },
  ];
}

// ============================================================================
// Deal CRUD Operations
// ============================================================================

/** Create a new deal, optionally linked to a lead */
export async function createDeal(input: DealCreateInput): Promise<Deal> {
  const id = randomUUID();
  const now = new Date().toISOString();
  const sector = input.sector || 'general';
  const stages = getStagesForSector(sector);
  const firstStage = stages[0]?.id || 'new_lead';

  const deal: Deal = {
    id,
    lead_id: input.lead_id || '',
    title: input.title,
    stage_id: input.stage_id || firstStage,
    sector,
    value: input.value || 0,
    currency: input.currency || 'NGN',
    contact_name: input.contact_name || '',
    contact_phone: input.contact_phone || '',
    contact_email: input.contact_email || '',
    category: input.category || '',
    area: input.area || '',
    city: input.city || '',
    assigned_to: input.assigned_to || '',
    notes: input.notes || '',
    probability: input.probability ?? 10,
    expected_close_date: input.expected_close_date || '',
    actual_close_date: '',
    created_at: now,
    updated_at: now,
    won_at: '',
    lost_at: '',
    lost_reason: '',
    tags: JSON.stringify(input.tags || []),
    custom_fields: JSON.stringify(input.custom_fields || {}),
  };

  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    const deals = readLocalDeals();
    deals[id] = deal;
    writeLocalDeals(deals);
  } else {
    try {
      const supabase = getSupabaseClient();
      const { error } = await (supabase as any).from('deals').insert([deal]);
      if (error) {
        const deals = readLocalDeals();
        deals[id] = deal;
        writeLocalDeals(deals);
      }
    } catch (err: any) {
      const deals = readLocalDeals();
      deals[id] = deal;
      writeLocalDeals(deals);
    }
  }

  // Log activity
  await logActivity({
    type: 'deal_created',
    lead_id: deal.lead_id,
    deal_id: deal.id,
    description: `Deal "${deal.title}" created in ${sector} pipeline`,
    metadata: { stage: deal.stage_id, value: deal.value },
  });

  return deal;
}

/** Get all deals, optionally filtered by sector */
export async function getDeals(filters?: { sector?: string; stage_id?: string; search?: string }): Promise<Deal[]> {
  const config = getRuntimeConfig();
  let deals: Deal[] = [];

  if (config.storageMode === 'local') {
    deals = Object.values(readLocalDeals());
  } else {
    try {
      const supabase = getSupabaseClient();
      let query = (supabase as any).from('deals').select('*').order('updated_at', { ascending: false });
      if (filters?.sector) query = query.eq('sector', filters.sector);
      if (filters?.stage_id) query = query.eq('stage_id', filters.stage_id);
      const { data, error } = await query;
      if (error) {
        deals = Object.values(readLocalDeals());
      } else {
        deals = (data || []) as Deal[];
      }
    } catch (err: any) {
      deals = Object.values(readLocalDeals());
    }
  }

  // Apply client-side filters
  if (filters?.sector) {
    deals = deals.filter(d => d.sector === filters.sector);
  }
  if (filters?.stage_id) {
    deals = deals.filter(d => d.stage_id === filters.stage_id);
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    deals = deals.filter(d =>
      d.title.toLowerCase().includes(s) ||
      d.contact_name.toLowerCase().includes(s) ||
      d.contact_email.toLowerCase().includes(s) ||
      d.contact_phone.includes(s)
    );
  }

  return deals.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

/** Get a single deal by ID */
export async function getDeal(id: string): Promise<Deal | null> {
  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    const deals = readLocalDeals();
    return deals[id] || null;
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any).from('deals').select('*').eq('id', id).single();
    if (error) {
      if (isTableMissingError(error)) {
        return readLocalDeals()[id] || null;
      }
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as Deal;
  } catch (err: any) {
    if (isTableMissingError(err)) return readLocalDeals()[id] || null;
    throw err;
  }
}

/** Update deal fields */
export async function updateDeal(id: string, updates: Partial<Deal>): Promise<Deal> {
  const now = new Date().toISOString();
  const updatePayload = { ...updates, updated_at: now };
  delete (updatePayload as any).id; // Don't update primary key

  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    const deals = readLocalDeals();
    if (!deals[id]) throw new Error(`Deal not found: ${id}`);
    deals[id] = { ...deals[id], ...updatePayload };
    writeLocalDeals(deals);
    return deals[id];
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any).from('deals').update(updatePayload).eq('id', id).select().single();
    if (error) {
      if (isTableMissingError(error)) {
        const deals = readLocalDeals();
        if (!deals[id]) throw new Error(`Deal not found: ${id}`);
        deals[id] = { ...deals[id], ...updatePayload };
        writeLocalDeals(deals);
        return deals[id];
      }
      throw error;
    }
    return data as Deal;
  } catch (err: any) {
    if (isTableMissingError(err)) {
      const deals = readLocalDeals();
      if (!deals[id]) throw new Error(`Deal not found: ${id}`);
      deals[id] = { ...deals[id], ...updatePayload };
      writeLocalDeals(deals);
      return deals[id];
    }
    throw err;
  }
}

/** Move deal to a new stage (with activity logging) */
export async function moveDealToStage(id: string, newStageId: string, notes?: string): Promise<Deal> {
  const existing = await getDeal(id);
  if (!existing) throw new Error(`Deal not found: ${id}`);

  const oldStage = existing.stage_id;
  const stages = getStagesForSector(existing.sector);
  const newStage = stages.find(s => s.id === newStageId);

  const updates: Partial<Deal> = { stage_id: newStageId };

  // Auto-set probability based on stage position
  if (newStage) {
    const nonLostStages = stages.filter(s => s.id !== 'lost');
    const idx = nonLostStages.findIndex(s => s.id === newStageId);
    if (idx >= 0) {
      updates.probability = Math.round((idx / (nonLostStages.length - 1)) * 100);
    }
  }

  // Handle won/lost special stages
  if (newStageId === 'won' || newStageId === 'completed' || newStageId === 'enrolled') {
    updates.won_at = new Date().toISOString();
    updates.actual_close_date = new Date().toISOString();
    updates.probability = 100;
  } else if (newStageId === 'lost') {
    updates.lost_at = new Date().toISOString();
    updates.lost_reason = notes || '';
    updates.probability = 0;
  }

  const deal = await updateDeal(id, updates);

  await logActivity({
    type: 'deal_stage_changed',
    lead_id: deal.lead_id,
    deal_id: deal.id,
    description: `Deal "${deal.title}" moved from ${oldStage} → ${newStageId}`,
    metadata: { from_stage: oldStage, to_stage: newStageId, notes },
  });

  return deal;
}

/** Delete a deal */
export async function deleteDeal(id: string): Promise<void> {
  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    const deals = readLocalDeals();
    delete deals[id];
    writeLocalDeals(deals);
    return;
  }

  try {
    const supabase = getSupabaseClient();
    const { error } = await (supabase as any).from('deals').delete().eq('id', id);
    if (error) {
      if (isTableMissingError(error)) {
        const deals = readLocalDeals();
        delete deals[id];
        writeLocalDeals(deals);
        return;
      }
      throw error;
    }
  } catch (err: any) {
    if (isTableMissingError(err)) {
      const deals = readLocalDeals();
      delete deals[id];
      writeLocalDeals(deals);
      return;
    }
    throw err;
  }
}

/** Convert a lead into a deal */
export async function convertLeadToDeal(lead: {
  lead_id: string;
  name: string;
  category: string;
  phone_e164?: string;
  email?: string;
  area?: string;
  city?: string;
  website?: string;
}, estimatedValue?: number): Promise<Deal> {
  const { getCategoryType } = await import('./pitchHelper');
  const sector = getCategoryType(lead.category);

  const deal = await createDeal({
    lead_id: lead.lead_id,
    title: `${lead.name} — ${lead.category || 'Business'}`,
    sector,
    value: estimatedValue || 0,
    contact_name: lead.name,
    contact_phone: lead.phone_e164 || '',
    contact_email: lead.email || '',
    category: lead.category,
    area: lead.area || '',
    city: lead.city || '',
    stage_id: 'contacted',
  });

  await logActivity({
    type: 'lead_converted',
    lead_id: lead.lead_id,
    deal_id: deal.id,
    description: `Lead "${lead.name}" converted to deal in ${sector} pipeline`,
    metadata: { category: lead.category, value: estimatedValue },
  });

  return deal;
}

// ============================================================================
// Pipeline Analytics
// ============================================================================

export async function getPipelineStats(sector?: string): Promise<PipelineStats> {
  const deals = await getDeals(sector ? { sector } : undefined);
  const stages = getStagesForSector(sector || 'general');

  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const wonDeals = deals.filter(d => d.won_at);
  const wonValue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const lostCount = deals.filter(d => d.lost_at).length;
  const avgDealValue = totalDeals > 0 ? totalValue / totalDeals : 0;

  const stageBreakdown = stages.map(stage => {
    const stageDeals = deals.filter(d => d.stage_id === stage.id);
    return {
      stage_id: stage.id,
      label: stage.label,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + (d.value || 0), 0),
    };
  });

  const closedDeals = wonDeals.length + lostCount;
  const conversionRate = closedDeals > 0 ? (wonDeals.length / closedDeals) * 100 : 0;

  return {
    totalDeals,
    totalValue,
    wonValue,
    lostCount,
    avgDealValue,
    stageBreakdown,
    conversionRate,
  };
}
