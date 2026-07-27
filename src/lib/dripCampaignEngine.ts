/**
 * @file dripCampaignEngine.ts
 * Drip Campaign & Nurture Sequence Engine
 * 
 * Automated multi-touch follow-up sequences:
 * - Day 0: WhatsApp → Day 3: Email → Day 7: SMS → Day 14: Follow-up
 * - Sector-specific campaign templates
 * - Step execution with delay scheduling
 * - Campaign analytics (open rates, reply rates)
 * - Pause/resume/cancel controls
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
export type StepChannel = 'email' | 'whatsapp' | 'sms' | 'social_dm' | 'contact_form' | 'wait';
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
  current_step: number; // index into steps array
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
    description: 'Multi-touch sequence for solar energy prospects — from initial contact to site survey booking.',
    sector: 'solar',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 0, subject: 'Initial Contact', message: 'Hi {{name}} 👋, I noticed {{business}} in {{area}}. We help businesses like yours cut electricity costs by 60-80% with solar. Would you like a free energy audit? Check this out: {{preview_url}}', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 24, subject: '{{name}}, Your Free Solar Savings Report', message: 'Hi {{name}},\n\nI reached out via WhatsApp — just wanted to follow up with more details.\n\nBusinesses in {{area}} typically spend ₦150K-₦500K monthly on diesel. Our solar solutions cut that by 60-80%.\n\nSee your personalized calculator: {{preview_url}}\n\nBest,\n{{signature}}', conditions: '{"if_not_replied": true}' },
      { order: 2, channel: 'sms', delay_hours: 72, subject: 'SMS Follow-up', message: '{{name}}, quick reminder — your FREE solar savings analysis is ready at {{preview_url}}. Most businesses save ₦3M+ yearly. Reply YES for a callback.', conditions: '{"if_not_replied": true}' },
      { order: 3, channel: 'whatsapp', delay_hours: 168, subject: 'Case Study Share', message: 'Hi {{name}}, wanted to share a quick success story 📊 — we installed a 10KVA system for a business similar to {{business}} in {{area}} and they now save ₦250K/month on diesel. Would a free site survey work for you this week?', conditions: '{"if_not_replied": true}' },
      { order: 4, channel: 'email', delay_hours: 336, subject: 'Last Chance: Free Site Survey This Month', message: 'Hi {{name}},\n\nThis is my final follow-up. We have limited site survey slots this month.\n\nIf you\'re still interested in cutting your electricity costs, reply to this email or call us.\n\nBest regards,\n{{signature}}', conditions: '{"if_not_replied": true}' },
    ],
  },
  real_estate_nurture: {
    name: 'Property Inquiry Follow-Up',
    description: 'Nurture real estate prospects from inquiry to inspection booking.',
    sector: 'real_estate',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 0, subject: 'Initial Response', message: 'Hi {{name}} 👋, thank you for your interest in our properties! I\'m your dedicated agent. What type of property are you looking for? 🏠', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 24, subject: 'Properties Matching Your Interest in {{area}}', message: 'Hi {{name}},\n\nThank you for your inquiry. I\'ve curated some properties that might interest you in {{area}}.\n\nView our listings: {{preview_url}}\n\nWould you like to schedule a viewing?\n\nBest,\n{{signature}}', conditions: '{"if_not_replied": true}' },
      { order: 2, channel: 'whatsapp', delay_hours: 72, subject: 'Price Drop Alert', message: '{{name}}, prices on some units in {{area}} just dropped 📉. Limited availability. Shall I book a viewing for you this weekend?', conditions: '{"if_not_replied": true}' },
      { order: 3, channel: 'sms', delay_hours: 168, subject: 'Inspection Reminder', message: 'Hi {{name}}, free inspection tours happening this Saturday in {{area}}. Limited slots — reply YES to reserve yours. {{signature}}', conditions: '{"if_not_replied": true}' },
    ],
  },
  school_enrollment: {
    name: 'School Enrollment Campaign',
    description: 'Guide parents from inquiry to admission application.',
    sector: 'school',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 0, subject: 'Welcome', message: 'Hello {{name}} 🎓! Thank you for your interest in {{business}}. What class/level are you looking to enroll your child in?', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 24, subject: 'Admission Guide for {{business}}', message: 'Dear {{name}},\n\nThank you for considering {{business}} for your child\'s education.\n\nPlease find our admission requirements and fee structure: {{preview_url}}\n\nApplications are now open for next term.\n\nWarm regards,\n{{signature}}', conditions: '{}' },
      { order: 2, channel: 'whatsapp', delay_hours: 72, subject: 'Tour Invitation', message: '{{name}}, we\'d love to show you our facilities! Can we schedule a campus tour this week? 🏫 Our students achieve 95%+ in WAEC/JAMB.', conditions: '{"if_not_replied": true}' },
      { order: 3, channel: 'sms', delay_hours: 168, subject: 'Deadline Reminder', message: 'Reminder: {{business}} admission closes soon. Apply online at {{preview_url}} or call us. Early bird discount available! {{signature}}', conditions: '{"if_not_replied": true}' },
    ],
  },
  medical_patient: {
    name: 'Patient Engagement Sequence',
    description: 'Follow up with potential patients to book appointments.',
    sector: 'medical',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 0, subject: 'Initial Contact', message: 'Hello {{name}} 🏥, thank you for reaching out to {{business}}. How can we help? You can book a consultation directly: {{preview_url}}', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 48, subject: 'Your Health Matters — Book a Consultation', message: 'Dear {{name}},\n\nWe received your inquiry. Our specialist team is ready to help.\n\nBook your consultation: {{preview_url}}\n\nNew patients enjoy 20% off their first visit.\n\n{{signature}}', conditions: '{"if_not_replied": true}' },
      { order: 2, channel: 'sms', delay_hours: 120, subject: 'Appointment Reminder', message: '{{name}}, don\'t forget your health! Book a consultation at {{business}} today. Call us or visit {{preview_url}}. {{signature}}', conditions: '{"if_not_replied": true}' },
    ],
  },
  general_b2b: {
    name: 'General B2B Follow-Up',
    description: 'Universal multi-channel nurture for any business type.',
    sector: 'general',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 0, subject: 'Initial Contact', message: 'Hi {{name}} 👋, I came across {{business}} and I think we can help you grow. Check out what we prepared for you: {{preview_url}}', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 48, subject: 'A Special Offer for {{business}}', message: 'Hi {{name}},\n\nI reached out earlier about an opportunity for {{business}}.\n\nHere\'s what we can do for you: {{preview_url}}\n\nLet me know if you\'d like to discuss.\n\nBest,\n{{signature}}', conditions: '{"if_not_replied": true}' },
      { order: 2, channel: 'sms', delay_hours: 120, subject: 'Quick Follow-up', message: '{{name}}, just checking in about {{business}}. Reply YES if you\'d like more info, or NO to opt out. {{signature}}', conditions: '{"if_not_replied": true}' },
      { order: 3, channel: 'whatsapp', delay_hours: 240, subject: 'Final Check-in', message: 'Hi {{name}}, this is my last follow-up. If you\'re ever interested in growing {{business}} online, the offer at {{preview_url}} will be available. Wishing you success! 🙏', conditions: '{"if_not_replied": true}' },
    ],
  },
  auto_dealer: {
    name: 'Auto Dealer Lead Nurture',
    description: 'Follow up with potential car buyers from inquiry to test drive.',
    sector: 'auto',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 0, subject: 'Vehicle Inquiry', message: 'Hi {{name}} 🚗, thank you for your interest! What type of vehicle are you looking for? We have fresh arrivals this week. Check our inventory: {{preview_url}}', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 24, subject: 'New Arrivals at {{business}}', message: 'Hi {{name}},\n\nWe have exciting new vehicles that match your interest.\n\nBrowse our inventory: {{preview_url}}\n\nWe also offer competitive financing options.\n\n{{signature}}', conditions: '{"if_not_replied": true}' },
      { order: 2, channel: 'whatsapp', delay_hours: 72, subject: 'Test Drive', message: '{{name}}, would you like to schedule a test drive? We can arrange a time that works for you. Just say the word 🚙', conditions: '{"if_not_replied": true}' },
    ],
  },
  restaurant_event: {
    name: 'Restaurant/Event Booking',
    description: 'Convert inquiries into reservations and catering bookings.',
    sector: 'restaurant',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 0, subject: 'Reservation Inquiry', message: 'Hello {{name}} 🍽️! Thank you for your interest in {{business}}. When would you like to visit? Check our menu: {{preview_url}}', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 24, subject: 'Special Menu & Reservation at {{business}}', message: 'Hi {{name}},\n\nThank you for considering {{business}}.\n\nSee our menu and make a reservation: {{preview_url}}\n\nWe also handle private events and catering!\n\n{{signature}}', conditions: '{"if_not_replied": true}' },
      { order: 2, channel: 'sms', delay_hours: 72, subject: 'Special Offer', message: '{{name}}, enjoy 15% off your first visit to {{business}}! Reserve now at {{preview_url}} or reply YES. {{signature}}', conditions: '{"if_not_replied": true}' },
    ],
  },
  legal_intake: {
    name: 'Legal Client Intake',
    description: 'Follow up with legal service inquiries.',
    sector: 'legal',
    steps: [
      { order: 0, channel: 'email', delay_hours: 0, subject: 'Thank You for Contacting {{business}}', message: 'Dear {{name}},\n\nThank you for reaching out to {{business}}.\n\nWe understand that legal matters require prompt attention. Please book a confidential consultation: {{preview_url}}\n\nAll communications are privileged and confidential.\n\n{{signature}}', conditions: '{}' },
      { order: 1, channel: 'whatsapp', delay_hours: 24, subject: 'Consultation Follow-up', message: 'Hi {{name}}, I sent you an email about booking a consultation with {{business}}. Would you prefer to schedule a call? Our initial consultation helps us understand your needs.', conditions: '{"if_not_replied": true}' },
      { order: 2, channel: 'sms', delay_hours: 120, subject: 'Consultation Reminder', message: '{{name}}, {{business}} is ready to assist with your legal needs. Book a confidential consultation at {{preview_url}}. {{signature}}', conditions: '{"if_not_replied": true}' },
    ],
  },
  retail_cart_recovery: {
    name: 'Retail Cart Recovery',
    description: 'Re-engage customers who showed interest but didn\'t purchase.',
    sector: 'retail',
    steps: [
      { order: 0, channel: 'whatsapp', delay_hours: 1, subject: 'Cart Reminder', message: 'Hi {{name}} 🛍️, we noticed you were browsing {{business}}! Need help deciding? We\'re here to assist. Shop now: {{preview_url}}', conditions: '{}' },
      { order: 1, channel: 'email', delay_hours: 24, subject: 'Your Items Are Waiting at {{business}}', message: 'Hi {{name}},\n\nYou left some great items behind!\n\nComplete your purchase: {{preview_url}}\n\nUse code WELCOME10 for 10% off.\n\n{{signature}}', conditions: '{"if_not_replied": true}' },
      { order: 2, channel: 'sms', delay_hours: 72, subject: 'Last Chance', message: '{{name}}, last chance! Your items at {{business}} are selling fast. Shop now: {{preview_url}} Code: WELCOME10', conditions: '{"if_not_replied": true}' },
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
// Campaign CRUD
// ============================================================================

/** Create a new campaign */
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
  } else {
    try {
      const supabase = getSupabaseClient();
      const { error } = await (supabase as any).from('campaigns').insert([campaign]);
      if (error) {
        if (isTableMissingError(error)) {
          const campaigns = readLocalCampaigns();
          campaigns[id] = campaign;
          writeLocalCampaigns(campaigns);
        } else {
          throw error;
        }
      }
    } catch (err: any) {
      if (isTableMissingError(err)) {
        const campaigns = readLocalCampaigns();
        campaigns[id] = campaign;
        writeLocalCampaigns(campaigns);
      } else {
        throw err;
      }
    }
  }

  return campaign;
}

/** Create a campaign from a template */
export async function createCampaignFromTemplate(templateKey: string, overrides?: Partial<CampaignCreateInput>): Promise<Campaign> {
  const template = CAMPAIGN_TEMPLATES[templateKey];
  if (!template) throw new Error(`Template not found: ${templateKey}`);

  return createCampaign({
    name: overrides?.name || template.name,
    description: overrides?.description || template.description,
    sector: overrides?.sector || template.sector,
    steps: (overrides?.steps || template.steps).map((s, i) => ({
      ...s,
      id: randomUUID(),
      order: s.order ?? i,
    })) as CampaignStep[],
    tags: overrides?.tags,
  });
}

/** Get all campaigns */
export async function getCampaigns(filters?: { sector?: string; status?: CampaignStatus }): Promise<Campaign[]> {
  const config = getRuntimeConfig();
  let campaigns: Campaign[] = [];

  if (config.storageMode === 'local') {
    campaigns = Object.values(readLocalCampaigns());
  } else {
    try {
      const supabase = getSupabaseClient();
      let query = (supabase as any).from('campaigns').select('*').order('updated_at', { ascending: false });
      if (filters?.sector) query = query.eq('sector', filters.sector);
      if (filters?.status) query = query.eq('status', filters.status);
      const { data, error } = await query;
      if (error) {
        if (isTableMissingError(error)) {
          campaigns = Object.values(readLocalCampaigns());
        } else {
          throw error;
        }
      } else {
        campaigns = (data || []) as Campaign[];
      }
    } catch (err: any) {
      if (isTableMissingError(err)) {
        campaigns = Object.values(readLocalCampaigns());
      } else {
        throw err;
      }
    }
  }

  if (filters?.sector) campaigns = campaigns.filter(c => c.sector === filters.sector);
  if (filters?.status) campaigns = campaigns.filter(c => c.status === filters.status);

  return campaigns.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

/** Get a single campaign */
export async function getCampaign(id: string): Promise<Campaign | null> {
  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    return readLocalCampaigns()[id] || null;
  }
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any).from('campaigns').select('*').eq('id', id).single();
    if (error) {
      if (isTableMissingError(error)) return readLocalCampaigns()[id] || null;
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as Campaign;
  } catch (err: any) {
    if (isTableMissingError(err)) return readLocalCampaigns()[id] || null;
    throw err;
  }
}

/** Update a campaign */
export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
  const now = new Date().toISOString();
  const updatePayload = { ...updates, updated_at: now };
  delete (updatePayload as any).id;

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
    const { data, error } = await (supabase as any).from('campaigns').update(updatePayload).eq('id', id).select().single();
    if (error) {
      if (isTableMissingError(error)) {
        const campaigns = readLocalCampaigns();
        if (!campaigns[id]) throw new Error(`Campaign not found: ${id}`);
        campaigns[id] = { ...campaigns[id], ...updatePayload };
        writeLocalCampaigns(campaigns);
        return campaigns[id];
      }
      throw error;
    }
    return data as Campaign;
  } catch (err: any) {
    if (isTableMissingError(err)) {
      const campaigns = readLocalCampaigns();
      if (!campaigns[id]) throw new Error(`Campaign not found: ${id}`);
      campaigns[id] = { ...campaigns[id], ...updatePayload };
      writeLocalCampaigns(campaigns);
      return campaigns[id];
    }
    throw err;
  }
}

/** Enroll a lead into a campaign */
export async function enrollLeadInCampaign(
  campaignId: string,
  lead: { lead_id: string; deal_id?: string; name: string }
): Promise<LeadEnrollment> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) throw new Error(`Campaign not found: ${campaignId}`);

  const enrollments: LeadEnrollment[] = JSON.parse(campaign.enrolled_leads || '[]');

  // Check if already enrolled
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

  await logActivity({
    type: 'campaign_started',
    lead_id: lead.lead_id,
    deal_id: lead.deal_id,
    description: `Lead "${lead.name}" enrolled in campaign "${campaign.name}"`,
    metadata: { campaign_id: campaignId, campaign_name: campaign.name },
  });

  return enrollment;
}

/** Get next due campaign steps (for the cron/runner to execute) */
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

/** Record the result of executing a campaign step */
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

  // Check if campaign is complete for this lead
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

  await logActivity({
    type: 'campaign_step_executed',
    lead_id: leadId,
    description: `Campaign "${campaign.name}" step ${stepResult.step_order + 1} (${stepResult.channel}) — ${stepResult.status}`,
    metadata: { campaign_id: campaignId, step_id: stepResult.step_id, channel: stepResult.channel },
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

/** Replace template variables in message */
export function resolveTemplateVariables(
  template: string,
  lead: { name?: string; business?: string; area?: string; category?: string },
  previewUrl: string,
  signature: string
): string {
  return template
    .replace(/\{\{name\}\}/g, lead.name || 'there')
    .replace(/\{\{business\}\}/g, lead.business || lead.name || 'your business')
    .replace(/\{\{area\}\}/g, lead.area || 'your area')
    .replace(/\{\{category\}\}/g, lead.category || 'business')
    .replace(/\{\{preview_url\}\}/g, previewUrl)
    .replace(/\{\{signature\}\}/g, signature);
}
