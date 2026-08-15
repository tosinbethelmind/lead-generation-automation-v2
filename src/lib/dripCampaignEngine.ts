/**
 * @file dripCampaignEngine.ts
 * Drip Campaign & Nurture Sequence Engine with Adaptive Multi-Channel Routing
 * 
 * Automated multi-touch follow-up sequences:
 * - Dynamic Channel Waterfall: adapts automatically if lead is Phone-Only, Email-Only, or Phone+Email.
 * - Dynamic Cross-Referencing: injects email/WhatsApp cross-notices only when relevant contact info exists.
 * - Automated Opt-Out Suppression across all channels.
 */

import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient';
import { getRuntimeConfig } from './localConfig';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';
import { logActivity } from './activityLogger';

// ============================================================================
// Campaign Types
// ============================================================================

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
export type StepChannel = 'email' | 'whatsapp' | 'sms' | 'social_dm' | 'contact_form' | 'wait' | 'skip';
export type StepStatus = 'pending' | 'scheduled' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'failed' | 'skipped';

export interface CampaignStep {
  id: string;
  order: number;
  channel: StepChannel;
  delay_hours: number; // hours after previous step
  subject: string; // email subject or step title
  message: string; // message template with {{variables}}
  conditions: string; // JSON: conditions to execute (e.g., "if_not_replied")
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  sector: string;
  status: CampaignStatus;
  steps: string; // JSON array of CampaignStep
  enrolled_leads: string; // JSON array of lead enrollment records
  total_enrolled: number;
  total_completed: number;
  total_replied: number;
  created_at: string;
  updated_at: string;
  started_at: string;
  completed_at: string;
  tags: string; // JSON array
}

export interface LeadEnrollment {
  lead_id: string;
  deal_id: string;
  lead_name: string;
  current_step: number;
  status: 'active' | 'completed' | 'paused' | 'unsubscribed' | 'replied';
  enrolled_at: string;
  last_step_at: string;
  next_step_at: string;
  step_results: StepResult[];
}

export interface StepResult {
  step_id: string;
  step_order: number;
  channel: StepChannel;
  status: StepStatus;
  sent_at: string;
  error: string;
}

export interface CampaignCreateInput {
  name: string;
  description?: string;
  sector?: string;
  steps: CampaignStep[];
  tags?: string[];
}

// ============================================================================
// Pre-built Campaign Templates
// ============================================================================

export const CAMPAIGN_TEMPLATES: Record<string, { name: string; description: string; sector: string; steps: Omit<CampaignStep, 'id'>[] }> = {
  solar_nurture: {
    name: 'Solar Installation Nurture',
    description: 'Multi-touch sequence for solar energy prospects — adapts to phone-only or email leads.',
    sector: 'solar',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 0, subject: 'Initial Contact', message: 'Good day {{name}} 👋, I noticed {{business}} in {{area}}. We help businesses cut diesel costs by 60-80% with solar. Check out your custom quote portal: {{preview_url}}{{cross_channel_note}} (Reply STOP to opt out)', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 24, subject: '{{name}}, Your Free Solar Savings Report', message: 'Dear {{name}},\n\nFollowing up on our review of {{business}} in {{area}}.\n\nBusinesses in your sector spend ₦200K-₦800K monthly on diesel. Our solar setups cut that significantly.\n\nSee your personalized calculator: {{preview_url}}\n\nBest regards,\n{{signature}}\n\n(Reply STOP to unsubscribe)', conditions: '{"if_not_replied": true}' },
      { order: 2, channel: 'sms', delay_hours: 72, subject: 'SMS Follow-up', message: '{{name}}, your solar savings analysis for {{business}} is ready at {{preview_url}}. Most save ₦3M+ yearly. Reply YES for a callback. {{signature}} (STOP to end)', conditions: '{"if_not_replied": true}' },
      { order: 3, channel: 'whatsapp', delay_hours: 168, subject: 'Case Study Share', message: 'Good day {{name}}, wanted to share a quick update 📊 — we deployed a 10KVA solar system for a business in {{area}} that now saves ₦250K/month on diesel. Would a free site survey work for you this week? View demo: {{preview_url}} (STOP to end)', conditions: '{"if_not_replied": true}' },
    ],
  },
  real_estate_nurture: {
    name: 'Property Inquiry Follow-Up',
    description: 'Nurture real estate prospects from inquiry to inspection booking.',
    sector: 'real_estate',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 0, subject: 'Initial Response', message: 'Good day {{name}} 👋, we designed an Off-Plan Payment & Tour Booking preview for {{business}} in {{area}}: {{preview_url}}{{cross_channel_note}} (Reply STOP to opt out)', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 24, subject: 'Property Showcase & Tour Scheduler for {{business}}', message: 'Dear {{name}},\n\nWe designed an interactive property showcase & installment calculator for {{business}} in {{area}}.\n\nView the live preview: {{preview_url}}\n\nBest regards,\n{{signature}}\n\n(Reply STOP to unsubscribe)', conditions: '{"if_not_replied": true}' },
      { order: 2, channel: 'sms', delay_hours: 72, subject: 'Inspection Reminder', message: 'Good day {{name}}, property tour booking demo for {{business}} is live: {{preview_url}} - {{signature}} (STOP to end)', conditions: '{"if_not_replied": true}' },
    ],
  },
  school_enrollment: {
    name: 'School Enrollment Campaign',
    description: 'Guide parents from inquiry to admission application.',
    sector: 'school',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 0, subject: 'Welcome', message: 'Good day {{name}} 🎓! We built a digital admissions portal & termly tuition fee calculator for {{business}} in {{area}}: {{preview_url}}{{cross_channel_note}} (Reply STOP to opt out)', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 24, subject: 'Admission Guide & Fee Portal for {{business}}', message: 'Dear {{name}},\n\nWe built an online admission portal preview for {{business}} in {{area}}.\n\nTest the fee breakdown calculator here: {{preview_url}}\n\nWarm regards,\n{{signature}}\n\n(Reply STOP to unsubscribe)', conditions: '{}' },
      { order: 2, channel: 'sms', delay_hours: 72, subject: 'Deadline Reminder', message: 'Reminder: Digital admission portal demo for {{business}} ready at {{preview_url}} - {{signature}} (STOP to end)', conditions: '{"if_not_replied": true}' },
    ],
  },
  lagos_10k_multichannel: {
    name: 'Lagos 10K Multi-Sector 5-Touch Blitz',
    description: 'High-conversion multi-touch sequence for Lagos B2B businesses — 2-step WhatsApp handshake, web form, email, social DMs, and FOMO follow-ups.',
    sector: 'general',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 0, subject: 'Step 1A: Conversational Warm Hook', message: '{Good morning|Hello|Good afternoon} {{name}} 👋, please is this the management desk for {{business}} in {{area}}?', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 4, subject: 'Follow-up to WhatsApp note regarding {{business}} growth portal', message: 'Dear {{name}},\n\nI sent a brief message to your WhatsApp line earlier regarding {{business}} in {{area}}.\n\nWe designed an interactive 24/7 AI Customer Booking & Quoting portal preview specifically for your brand:\n{{preview_url}}\n\nTest the live interactive preview to see how it automatically quotes customers and collects verified bank transfers.\n\nBest regards,\n{{signature}}\n\n(Reply STOP to unsubscribe)', conditions: '{"if_not_replied": true}' },
      { order: 2, channel: 'social_dm', delay_hours: 24, subject: 'Social DM Follow-up', message: 'Hello {{business}} team! We sent a WhatsApp note and email to management regarding your live 24/7 AI portal demo. Here is your private preview link: {{preview_url}}', conditions: '{"if_not_replied": true}' },
      { order: 3, channel: 'whatsapp', delay_hours: 72, subject: 'Step 3: Competitor Reallocation Notice (FOMO)', message: 'Good day {{name}}, since we have not received your feedback on the custom portal build for {{business}}, we will reallocate the verified {{area}} district spot by tomorrow 5:00 PM unless your team claims it today: {{preview_url}} (Reply STOP to opt out)', conditions: '{"if_not_replied": true}' },
      { order: 4, channel: 'sms', delay_hours: 120, subject: 'Step 4: Flash SMS Expiry Notice', message: '{{name}}, final notice: your reserved domain & business portal preview for {{business}} expires in 24h. Claim here: {{preview_url}} - {{signature}} (STOP to end)', conditions: '{"if_not_replied": true}' },
    ],
  },
  general_b2b: {
    name: 'General B2B Follow-Up',
    description: 'Universal multi-channel nurture for any Nigerian business.',
    sector: 'general',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 0, subject: 'Initial Contact', message: 'Good day {{name}} 👋, we custom-built a 24/7 AI quote & customer portal preview for {{business}} in {{area}}: {{preview_url}}{{cross_channel_note}} (Reply STOP to opt out)', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 48, subject: 'Interactive Portal & Growth Proposal for {{business}}', message: 'Dear {{name}},\n\nFollowing up on our review of {{business}} in {{area}}.\n\nWe built a 24/7 automated quote & client intake portal for your brand:\n{{preview_url}}\n\nBest regards,\n{{signature}}\n\n(Reply STOP to unsubscribe)', conditions: '{"if_not_replied": true}' },
      { order: 2, channel: 'sms', delay_hours: 120, subject: 'Quick Follow-up', message: 'Good day {{name}}, just checking in regarding {{business}}. View your custom portal preview: {{preview_url}} - {{signature}} (STOP to end)', conditions: '{"if_not_replied": true}' },
    ],
  },
};

// ============================================================================
// Local Fallback Storage
// ============================================================================

const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getCampaignsFilePath(): string {
  return isServerless
    ? path.join('/tmp', 'drip_campaigns.json')
    : path.join(process.cwd(), 'local_db', 'drip_campaigns.json');
}

function readLocalCampaigns(): Record<string, Campaign> {
  try {
    return readJsonFileSyncWithRetry<Record<string, Campaign>>(getCampaignsFilePath(), {});
  } catch {
    return {};
  }
}

function writeLocalCampaigns(campaigns: Record<string, Campaign>): void {
  try {
    const filePath = getCampaignsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    writeJsonFileSyncAtomic(filePath, campaigns);
  } catch (e) {
    console.error('[DripCampaign] Error writing local campaigns:', e);
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
// Adaptive Multi-Channel Waterfall Helpers
// ============================================================================

/**
 * Determines the best delivery channel for a lead based on available contact fields.
 * Gracefully falls back (e.g. Email -> SMS if email missing; WA -> Email if phone missing).
 */
export function getAdaptiveChannelForLead(
  desiredChannel: StepChannel,
  lead: { phone?: string; email?: string }
): { channel: StepChannel; skipped: boolean; reason?: string } {
  const hasPhone = !!(lead.phone && lead.phone.trim().length > 6);
  const hasEmail = !!(lead.email && lead.email.trim().includes('@'));

  if (desiredChannel === 'email') {
    if (hasEmail) return { channel: 'email', skipped: false };
    if (hasPhone) return { channel: 'sms', skipped: false, reason: 'FALLBACK_SMS_NO_EMAIL' };
    return { channel: 'skip', skipped: true, reason: 'NO_EMAIL_OR_PHONE' };
  }

  if (desiredChannel === 'whatsapp') {
    if (hasPhone) return { channel: 'whatsapp', skipped: false };
    if (hasEmail) return { channel: 'email', skipped: false, reason: 'FALLBACK_EMAIL_NO_PHONE' };
    return { channel: 'skip', skipped: true, reason: 'NO_PHONE_OR_EMAIL' };
  }

  if (desiredChannel === 'sms') {
    if (hasPhone) return { channel: 'sms', skipped: false };
    if (hasEmail) return { channel: 'email', skipped: false, reason: 'FALLBACK_EMAIL_NO_PHONE' };
    return { channel: 'skip', skipped: true, reason: 'NO_PHONE_OR_EMAIL' };
  }

  return { channel: desiredChannel, skipped: false };
}

/** Replace template variables with dynamic cross-referencing */
export function resolveTemplateVariables(
  template: string,
  lead: { name?: string; business?: string; area?: string; category?: string; email?: string; phone?: string },
  previewUrl: string,
  signature: string
): string {
  const emailText = lead.email ? lead.email.trim() : '';
  const crossChannelNote = emailText ? ` (Details also sent to ${emailText})` : '';

  return template
    .replace(/\{\{name\}\}/g, lead.name || 'Valued Business')
    .replace(/\{\{business\}\}/g, lead.business || lead.name || 'your business')
    .replace(/\{\{area\}\}/g, lead.area || 'your area')
    .replace(/\{\{category\}\}/g, lead.category || 'business')
    .replace(/\{\{email\}\}/g, emailText)
    .replace(/\{\{phone\}\}/g, lead.phone || '')
    .replace(/\{\{cross_channel_note\}\}/g, crossChannelNote)
    .replace(/\{\{preview_url\}\}/g, previewUrl)
    .replace(/\{\{previewUrl\}\}/g, previewUrl)
    .replace(/\{\{signature\}\}/g, signature);
}

// ============================================================================
// Campaign CRUD
// ============================================================================

export async function createCampaign(input: CampaignCreateInput): Promise<Campaign> {
  const id = randomUUID();
  const now = new Date().toISOString();

  const stepsWithIds: CampaignStep[] = input.steps.map((s, i) => ({
    ...s,
    id: s.id || randomUUID(),
    order: s.order ?? i,
  }));

  const campaign: Campaign = {
    id,
    name: input.name,
    description: input.description || '',
    sector: input.sector || 'general',
    status: 'draft',
    steps: JSON.stringify(stepsWithIds),
    enrolled_leads: JSON.stringify([]),
    total_enrolled: 0,
    total_completed: 0,
    total_replied: 0,
    created_at: now,
    updated_at: now,
    started_at: '',
    completed_at: '',
    tags: JSON.stringify(input.tags || []),
  };

  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    const campaigns = readLocalCampaigns();
    campaigns[id] = campaign;
    writeLocalCampaigns(campaigns);
    return campaign;
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any)
      .from('campaigns')
      .insert([campaign])
      .select()
      .single();

    if (error && !isTableMissingError(error)) throw error;
    if (data) return data;
  } catch (err: any) {
    if (!isTableMissingError(err)) throw err;
  }

  const campaigns = readLocalCampaigns();
  campaigns[id] = campaign;
  writeLocalCampaigns(campaigns);
  return campaign;
}

export async function getCampaigns(filters?: { status?: CampaignStatus; sector?: string }): Promise<Campaign[]> {
  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    let list = Object.values(readLocalCampaigns());
    if (filters?.status) list = list.filter(c => c.status === filters.status);
    if (filters?.sector) list = list.filter(c => c.sector === filters.sector);
    return list;
  }

  try {
    const supabase = getSupabaseClient();
    let query = (supabase as any).from('campaigns').select('*').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.sector) query = query.eq('sector', filters.sector);
    const { data, error } = await query;
    if (!error && data) return data;
  } catch {}

  let list = Object.values(readLocalCampaigns());
  if (filters?.status) list = list.filter(c => c.status === filters.status);
  if (filters?.sector) list = list.filter(c => c.sector === filters.sector);
  return list;
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    return readLocalCampaigns()[id] || null;
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any)
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();
    if (!error && data) return data;
  } catch {}

  return readLocalCampaigns()[id] || null;
}

export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
  const now = new Date().toISOString();
  const updatePayload = { ...updates, updated_at: now };

  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    const campaigns = readLocalCampaigns();
    if (!campaigns[id]) throw new Error(`Campaign not found: ${id}`);
    campaigns[id] = { ...campaigns[id], ...updatePayload };
    writeLocalCampaigns(campaigns);
    return campaigns[id];
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any)
      .from('campaigns')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) return data;
  } catch {}

  const campaigns = readLocalCampaigns();
  if (!campaigns[id]) throw new Error(`Campaign not found: ${id}`);
  campaigns[id] = { ...campaigns[id], ...updatePayload };
  writeLocalCampaigns(campaigns);
  return campaigns[id];
}

export async function enrollLeadInCampaign(
  campaignId: string,
  lead: { lead_id: string; deal_id?: string; name: string }
): Promise<LeadEnrollment> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) throw new Error(`Campaign not found: ${campaignId}`);

  const enrollments: LeadEnrollment[] = JSON.parse(campaign.enrolled_leads || '[]');

  if (enrollments.some(e => e.lead_id === lead.lead_id && e.status === 'active')) {
    throw new Error(`Lead ${lead.lead_id} is already enrolled in this campaign`);
  }

  const now = new Date().toISOString();
  const steps: CampaignStep[] = JSON.parse(campaign.steps || '[]');
  const firstStep = steps[0];
  const nextStepAt = firstStep
    ? new Date(Date.now() + firstStep.delay_hours * 60 * 60 * 1000).toISOString()
    : '';

  const enrollment: LeadEnrollment = {
    lead_id: lead.lead_id,
    deal_id: lead.deal_id || '',
    lead_name: lead.name,
    current_step: 0,
    status: 'active',
    enrolled_at: now,
    last_step_at: '',
    next_step_at: nextStepAt,
    step_results: [],
  };

  enrollments.push(enrollment);

  await updateCampaign(campaignId, {
    enrolled_leads: JSON.stringify(enrollments),
    total_enrolled: enrollments.length,
    status: campaign.status === 'draft' ? 'active' : campaign.status,
    started_at: campaign.started_at || now,
  });

  return enrollment;
}

export async function getDueCampaignSteps(): Promise<{
  campaign: Campaign;
  enrollment: LeadEnrollment;
  step: CampaignStep;
}[]> {
  const campaigns = await getCampaigns({ status: 'active' });
  const now = new Date().toISOString();
  const dueSteps: { campaign: Campaign; enrollment: LeadEnrollment; step: CampaignStep }[] = [];

  for (const campaign of campaigns) {
    const enrollments: LeadEnrollment[] = JSON.parse(campaign.enrolled_leads || '[]');
    const steps: CampaignStep[] = JSON.parse(campaign.steps || '[]');

    for (const enrollment of enrollments) {
      if (enrollment.status !== 'active') continue;
      if (!enrollment.next_step_at || enrollment.next_step_at > now) continue;
      if (enrollment.current_step >= steps.length) continue;

      const step = steps[enrollment.current_step];
      if (step) {
        dueSteps.push({ campaign, enrollment, step });
      }
    }
  }

  return dueSteps;
}

export async function recordStepExecution(
  campaignId: string,
  leadId: string,
  stepResult: StepResult
): Promise<void> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return;

  const enrollments: LeadEnrollment[] = JSON.parse(campaign.enrolled_leads || '[]');
  const steps: CampaignStep[] = JSON.parse(campaign.steps || '[]');
  const enrollment = enrollments.find(e => e.lead_id === leadId);
  if (!enrollment) return;

  enrollment.step_results.push(stepResult);
  enrollment.last_step_at = new Date().toISOString();
  enrollment.current_step += 1;

  if (enrollment.current_step >= steps.length) {
    enrollment.status = 'completed';
    enrollment.next_step_at = '';
  } else {
    const nextStep = steps[enrollment.current_step];
    enrollment.next_step_at = new Date(
      Date.now() + nextStep.delay_hours * 60 * 60 * 1000
    ).toISOString();
  }

  const totalCompleted = enrollments.filter(e => e.status === 'completed').length;
  const totalReplied = enrollments.filter(e => e.status === 'replied').length;

  await updateCampaign(campaignId, {
    enrolled_leads: JSON.stringify(enrollments),
    total_completed: totalCompleted,
    total_replied: totalReplied,
  });
}

/** Create a campaign from a predefined template */
export async function createCampaignFromTemplate(templateKey: string, customName?: string): Promise<Campaign> {
  const template = CAMPAIGN_TEMPLATES[templateKey];
  if (!template) throw new Error(`Template not found: ${templateKey}`);
  return createCampaign({
    name: customName || template.name,
    description: template.description,
    sector: template.sector,
    steps: template.steps as any,
  });
}

/** Delete a campaign */
export async function deleteCampaign(id: string): Promise<void> {
  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    const campaigns = readLocalCampaigns();
    delete campaigns[id];
    writeLocalCampaigns(campaigns);
    return;
  }
  try {
    const supabase = getSupabaseClient();
    const { error } = await (supabase as any).from('campaigns').delete().eq('id', id);
    if (error && !isTableMissingError(error)) throw error;
    if (error && isTableMissingError(error)) {
      const campaigns = readLocalCampaigns();
      delete campaigns[id];
      writeLocalCampaigns(campaigns);
    }
  } catch (err: any) {
    if (isTableMissingError(err)) {
      const campaigns = readLocalCampaigns();
      delete campaigns[id];
      writeLocalCampaigns(campaigns);
    } else {
      throw err;
    }
  }
}

