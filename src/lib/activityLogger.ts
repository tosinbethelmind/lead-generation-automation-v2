/**
 * @file activityLogger.ts
 * Activity Timeline Engine — Records every touchpoint for every lead/deal
 * 
 * Provides a complete chronological history:
 * - Outreach attempts (email, WhatsApp, SMS, etc.)
 * - Deal stage transitions
 * - Lead conversions
 * - Notes and manual actions
 * - Campaign steps executed
 * - Chatbot conversations
 * - Appointments booked
 */

import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient';
import { getRuntimeConfig } from './localConfig';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';

// ============================================================================
// Activity Types
// ============================================================================

export type ActivityType =
  | 'lead_created'
  | 'lead_converted'
  | 'lead_enriched'
  | 'deal_created'
  | 'deal_stage_changed'
  | 'deal_value_changed'
  | 'deal_won'
  | 'deal_lost'
  | 'outreach_email_sent'
  | 'outreach_email_opened'
  | 'outreach_email_clicked'
  | 'outreach_email_bounced'
  | 'outreach_whatsapp_sent'
  | 'outreach_whatsapp_delivered'
  | 'outreach_whatsapp_read'
  | 'outreach_sms_sent'
  | 'outreach_call_made'
  | 'outreach_contact_form'
  | 'outreach_social_dm'
  | 'outreach_jiji_chat'
  | 'campaign_step_executed'
  | 'campaign_started'
  | 'campaign_completed'
  | 'campaign_paused'
  | 'chatbot_conversation'
  | 'chatbot_lead_captured'
  | 'appointment_booked'
  | 'appointment_completed'
  | 'appointment_cancelled'
  | 'payment_received'
  | 'subscription_renewed_opay'
  | 'voice_ai_call_dispatched'
  | 'note_added'

  | 'tag_added'
  | 'tag_removed'
  | 'assigned'
  | 'unassigned'
  | 'autoresponder_rule_updated'
  | 'autoresponder_triggered'
  | 'ai_agent_config_updated'
  | 'ai_agent_handover_requested'
  | 'ai_agent_lead_converted'
  | 'ai_agent_whatsapp_approval_requested'
  | 'ai_agent_approval_resolved'
  | 'website_visit'
  | 'link_clicked'
  | 'form_submitted'
  | 'document_shared'
  | 'custom';

export interface Activity {
  id: string;
  type: ActivityType;
  lead_id: string;
  deal_id: string;
  description: string;
  metadata: string; // JSON string
  channel: string; // email, whatsapp, sms, chatbot, manual, system
  actor: string; // user email or 'system'
  created_at: string;
}

export interface ActivityInput {
  type: ActivityType;
  lead_id?: string;
  deal_id?: string;
  description: string;
  metadata?: Record<string, any>;
  channel?: string;
  actor?: string;
}

// ============================================================================
// Activity Icon & Color Mapping
// ============================================================================

export const ACTIVITY_ICONS: Record<string, { icon: string; color: string; label: string }> = {
  lead_created:              { icon: '📥', color: '#6366f1', label: 'Lead Created' },
  lead_converted:            { icon: '🔄', color: '#8b5cf6', label: 'Lead Converted' },
  lead_enriched:             { icon: '🔍', color: '#06b6d4', label: 'Lead Enriched' },
  deal_created:              { icon: '💼', color: '#6366f1', label: 'Deal Created' },
  deal_stage_changed:        { icon: '➡️', color: '#f59e0b', label: 'Stage Changed' },
  deal_value_changed:        { icon: '💰', color: '#10b981', label: 'Value Updated' },
  deal_won:                  { icon: '🏆', color: '#22c55e', label: 'Deal Won' },
  deal_lost:                 { icon: '❌', color: '#ef4444', label: 'Deal Lost' },
  outreach_email_sent:       { icon: '📧', color: '#3b82f6', label: 'Email Sent' },
  outreach_email_opened:     { icon: '👁️', color: '#06b6d4', label: 'Email Opened' },
  outreach_email_clicked:    { icon: '🔗', color: '#10b981', label: 'Email Link Clicked' },
  outreach_email_bounced:    { icon: '⚠️', color: '#f97316', label: 'Email Bounced' },
  outreach_whatsapp_sent:    { icon: '💬', color: '#22c55e', label: 'WhatsApp Sent' },
  outreach_whatsapp_delivered: { icon: '✓✓', color: '#22c55e', label: 'WhatsApp Delivered' },
  outreach_whatsapp_read:    { icon: '👀', color: '#06b6d4', label: 'WhatsApp Read' },
  outreach_sms_sent:         { icon: '📱', color: '#8b5cf6', label: 'SMS Sent' },
  outreach_call_made:        { icon: '📞', color: '#f59e0b', label: 'Call Made' },
  outreach_contact_form:     { icon: '📝', color: '#6366f1', label: 'Contact Form Submitted' },
  outreach_social_dm:        { icon: '💬', color: '#ec4899', label: 'Social DM' },
  outreach_jiji_chat:        { icon: '🏷️', color: '#f97316', label: 'Jiji Chat' },
  campaign_step_executed:    { icon: '⚡', color: '#8b5cf6', label: 'Campaign Step' },
  campaign_started:          { icon: '🚀', color: '#6366f1', label: 'Campaign Started' },
  campaign_completed:        { icon: '✅', color: '#22c55e', label: 'Campaign Completed' },
  campaign_paused:           { icon: '⏸️', color: '#f59e0b', label: 'Campaign Paused' },
  chatbot_conversation:      { icon: '🤖', color: '#8b5cf6', label: 'Chatbot Chat' },
  chatbot_lead_captured:     { icon: '🎯', color: '#22c55e', label: 'Chatbot Lead Captured' },
  appointment_booked:        { icon: '📅', color: '#3b82f6', label: 'Appointment Booked' },
  appointment_completed:     { icon: '✅', color: '#22c55e', label: 'Appointment Completed' },
  appointment_cancelled:     { icon: '🚫', color: '#ef4444', label: 'Appointment Cancelled' },
  payment_received:          { icon: '💳', color: '#22c55e', label: 'Payment Received' },
  note_added:                { icon: '📝', color: '#94a3b8', label: 'Note Added' },
  tag_added:                 { icon: '🏷️', color: '#06b6d4', label: 'Tag Added' },
  tag_removed:               { icon: '🏷️', color: '#94a3b8', label: 'Tag Removed' },
  assigned:                  { icon: '👤', color: '#6366f1', label: 'Assigned' },
  website_visit:             { icon: '🌐', color: '#06b6d4', label: 'Website Visit' },
  link_clicked:              { icon: '🔗', color: '#10b981', label: 'Link Clicked' },
  form_submitted:            { icon: '📋', color: '#8b5cf6', label: 'Form Submitted' },
  document_shared:           { icon: '📄', color: '#3b82f6', label: 'Document Shared' },
  custom:                    { icon: '📌', color: '#94a3b8', label: 'Custom Activity' },
};

// ============================================================================
// Local Fallback Storage
// ============================================================================

const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getActivitiesFilePath(): string {
  return isServerless
    ? path.join('/tmp', 'activities.json')
    : path.join(process.cwd(), 'local_db', 'activities.json');
}

function readLocalActivities(): Activity[] {
  try {
    const filePath = getActivitiesFilePath();
    return readJsonFileSyncWithRetry<Activity[]>(filePath, []);
  } catch {
    return [];
  }
}

function writeLocalActivities(activities: Activity[]): void {
  try {
    const filePath = getActivitiesFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    // Keep only last 5000 activities locally to prevent file bloat
    const trimmed = activities.slice(0, 5000);
    writeJsonFileSyncAtomic(filePath, trimmed);
  } catch (e) {
    console.error('[ActivityLogger] Error writing local activities:', e);
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
// Activity CRUD
// ============================================================================

/** Log a new activity event */
export async function logActivity(input: ActivityInput): Promise<Activity> {
  const activity: Activity = {
    id: randomUUID(),
    type: input.type,
    lead_id: input.lead_id || '',
    deal_id: input.deal_id || '',
    description: input.description,
    metadata: JSON.stringify(input.metadata || {}),
    channel: input.channel || deriveChannel(input.type),
    actor: input.actor || 'system',
    created_at: new Date().toISOString(),
  };

  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    const activities = readLocalActivities();
    activities.unshift(activity);
    writeLocalActivities(activities);
    return activity;
  }

  try {
    const supabase = getSupabaseClient();
    const { error } = await (supabase as any).from('activities').insert([activity]);
    if (error) {
      if (isTableMissingError(error)) {
        const activities = readLocalActivities();
        activities.unshift(activity);
        writeLocalActivities(activities);
      } else {
        // Non-critical: log but don't fail the caller
        console.error('[ActivityLogger] Supabase insert error:', error.message);
        const activities = readLocalActivities();
        activities.unshift(activity);
        writeLocalActivities(activities);
      }
    }
  } catch (err: any) {
    // Non-critical: activity logging should never break the main flow
    console.error('[ActivityLogger] Error:', err.message);
    const activities = readLocalActivities();
    activities.unshift(activity);
    writeLocalActivities(activities);
  }

  return activity;
}

/** Get activities for a specific lead */
export async function getLeadActivities(leadId: string, limit = 100): Promise<Activity[]> {
  const config = getRuntimeConfig();

  if (config.storageMode === 'local') {
    const all = readLocalActivities();
    return all.filter(a => a.lead_id === leadId).slice(0, limit);
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      if (isTableMissingError(error)) {
        return readLocalActivities().filter(a => a.lead_id === leadId).slice(0, limit);
      }
      throw error;
    }
    return (data || []) as Activity[];
  } catch (err: any) {
    if (isTableMissingError(err)) {
      return readLocalActivities().filter(a => a.lead_id === leadId).slice(0, limit);
    }
    throw err;
  }
}

/** Get activities for a specific deal */
export async function getDealActivities(dealId: string, limit = 100): Promise<Activity[]> {
  const config = getRuntimeConfig();

  if (config.storageMode === 'local') {
    const all = readLocalActivities();
    return all.filter(a => a.deal_id === dealId).slice(0, limit);
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      if (isTableMissingError(error)) {
        return readLocalActivities().filter(a => a.deal_id === dealId).slice(0, limit);
      }
      throw error;
    }
    return (data || []) as Activity[];
  } catch (err: any) {
    if (isTableMissingError(err)) {
      return readLocalActivities().filter(a => a.deal_id === dealId).slice(0, limit);
    }
    throw err;
  }
}

/** Get all recent activities (global feed) */
export async function getRecentActivities(limit = 200): Promise<Activity[]> {
  const config = getRuntimeConfig();

  if (config.storageMode === 'local') {
    return readLocalActivities().slice(0, limit);
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      if (isTableMissingError(error)) {
        return readLocalActivities().slice(0, limit);
      }
      throw error;
    }
    return (data || []) as Activity[];
  } catch (err: any) {
    if (isTableMissingError(err)) {
      return readLocalActivities().slice(0, limit);
    }
    throw err;
  }
}

/** Get activity stats for dashboard */
export async function getActivityStats(): Promise<{
  total: number;
  today: number;
  thisWeek: number;
  byType: Record<string, number>;
  byChannel: Record<string, number>;
}> {
  const activities = await getRecentActivities(5000);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const byType: Record<string, number> = {};
  const byChannel: Record<string, number> = {};
  let today = 0;
  let thisWeek = 0;

  for (const a of activities) {
    byType[a.type] = (byType[a.type] || 0) + 1;
    byChannel[a.channel] = (byChannel[a.channel] || 0) + 1;
    if (a.created_at >= todayStart) today++;
    if (a.created_at >= weekAgo) thisWeek++;
  }

  return { total: activities.length, today, thisWeek, byType, byChannel };
}

// ============================================================================
// Helper
// ============================================================================

function deriveChannel(type: ActivityType): string {
  if (type.startsWith('outreach_email')) return 'email';
  if (type.startsWith('outreach_whatsapp')) return 'whatsapp';
  if (type.startsWith('outreach_sms')) return 'sms';
  if (type.startsWith('outreach_call')) return 'phone';
  if (type.startsWith('outreach_contact_form')) return 'contact_form';
  if (type.startsWith('outreach_social')) return 'social';
  if (type.startsWith('outreach_jiji')) return 'jiji';
  if (type.startsWith('campaign')) return 'campaign';
  if (type.startsWith('chatbot')) return 'chatbot';
  if (type.startsWith('appointment')) return 'appointment';
  if (type.startsWith('payment')) return 'payment';
  if (type.startsWith('deal')) return 'pipeline';
  if (type.startsWith('lead')) return 'system';
  return 'manual';
}
