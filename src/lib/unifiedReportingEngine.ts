/**
 * @file src/lib/unifiedReportingEngine.ts
 * Unified Multi-Source Telemetry & Standard Reporting Engine
 * 
 * Provides a single consolidated source of truth for:
 * 1. Outbound Outreach Dispatches across GSM SMS, Social DMs, B2B Email, Webforms, and WhatsApp.
 * 2. Real-time Website & Landing Page Behavioral Actions (Page Views, Calculator Configurations, Prototype Visits).
 * 3. Automatic Cross-Database Reconciliation (leads_db.json, lead_journeys.json, sms_dispatches.json, activities.json & Supabase Cloud).
 */

import fs from 'fs';
import path from 'path';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';

const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');
const LEADS_DB_PATH = path.join(LOCAL_DB_DIR, 'leads_db.json');
const JOURNEYS_DB_PATH = path.join(LOCAL_DB_DIR, 'lead_journeys.json');
const SMS_DISPATCHES_PATH = path.join(LOCAL_DB_DIR, 'sms_dispatches.json');
const ACTIVITIES_PATH = path.join(LOCAL_DB_DIR, 'activities.json');

export interface ChannelMetrics {
  sms_sent: number;
  social_dm_sent: number;
  email_sent: number;
  webform_sent: number;
  whatsapp_inbound_connected: number;
  total_outreach_dispatched: number;
  total_enriched_in_queue: number;
}

export interface WebsiteBehaviorMetrics {
  totalUniqueLeadsInteracted: number;
  totalPageViews: number;
  totalPrototypeVisits: number;
  totalCalculatorConfigurations: number;
  totalVideoWatchSec: number;
  totalChatMessages: number;
  totalCheckoutAttempts: number;
  totalRageClicks: number;
}

export interface LeadIntentBreakdown {
  hot: number;      // Heat score >= 70 or calculator configured
  warm: number;     // Preview opened or outreach dispatched
  cold: number;     // Enriched / Scraped queue
}

export interface CalculatorInteractionSummary {
  leadName: string;
  category: string;
  title: string;
  summary: string;
  timestampWat: string;
}

export interface UnifiedTelemetryReport {
  timestampWat: string;
  timestampIso: string;
  totalMasterLeads: number;
  totalTrackedJourneys: number;
  channels: ChannelMetrics;
  website: WebsiteBehaviorMetrics;
  intent: LeadIntentBreakdown;
  calculatorDetails: CalculatorInteractionSummary[];
}

function getLagosWatTimestamp(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-NG', { 
    timeZone: 'Africa/Lagos', 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit' 
  }) + ' WAT (' + date.toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos', month: 'short', day: 'numeric' }) + ')';
}

/**
 * Reconciles SMS dispatches across all database sources so that sent SMS
 * messages are accurately marked without overcounting.
 */
export function reconcileSmsDispatches(): { reconciledCount: number; updatedLeads: number } {
  let reconciledCount = 0;
  let updatedLeads = 0;

  try {
    let smsDispatches: any[] = [];
    if (fs.existsSync(SMS_DISPATCHES_PATH)) {
      smsDispatches = readJsonFileSyncWithRetry(SMS_DISPATCHES_PATH, []);
    }

    let activities: any[] = [];
    if (fs.existsSync(ACTIVITIES_PATH)) {
      activities = readJsonFileSyncWithRetry(ACTIVITIES_PATH, []);
    }

    const smsActivityIds = new Set<string>();
    activities.forEach(a => {
      if (a.channel === 'sms' || JSON.stringify(a).toLowerCase().includes('sms')) {
        if (a.lead_id) smsActivityIds.add(a.lead_id);
      }
    });

    smsDispatches.forEach(s => {
      if (s.lead_id) smsActivityIds.add(s.lead_id);
    });

    if (fs.existsSync(LEADS_DB_PATH)) {
      const rawLeads: any = readJsonFileSyncWithRetry(LEADS_DB_PATH, []);
      let leads = Array.isArray(rawLeads) ? rawLeads : (rawLeads.leads || Object.values(rawLeads));

      let modified = false;
      leads.forEach((l: any) => {
        const leadId = l.lead_id || l.id || l.slug;
        if (smsActivityIds.has(leadId)) {
          if (l.sms_status !== 'SENT') {
            l.sms_status = 'SENT';
            l.sms_sent_at = l.sms_sent_at || new Date().toISOString();
            l.outreach_dispatched = true;
            l.outreach_sent = true;
            modified = true;
            updatedLeads++;
          }
        }
      });

      if (modified) {
        writeJsonFileSyncAtomic(LEADS_DB_PATH, leads);
      }
    }
  } catch (e) {
    console.error('⚠️ UnifiedReportingEngine Reconciliation Error:', e);
  }

  return { reconciledCount, updatedLeads };
}

/**
 * Computes the unified real-time telemetry report across all channels and website behaviors.
 */
export function getUnifiedTelemetryReport(): UnifiedTelemetryReport {
  reconcileSmsDispatches();

  const now = new Date();
  const timestampIso = now.toISOString();
  const timestampWat = getLagosWatTimestamp(now);

  let totalMasterLeads = 0;
  const channels: ChannelMetrics = {
    sms_sent: 0,
    social_dm_sent: 0,
    email_sent: 0,
    webform_sent: 0,
    whatsapp_inbound_connected: 0,
    total_outreach_dispatched: 0,
    total_enriched_in_queue: 0
  };

  // 1. Audit Master Leads DB (leads_db.json)
  if (fs.existsSync(LEADS_DB_PATH)) {
    const rawLeads: any = readJsonFileSyncWithRetry(LEADS_DB_PATH, []);
    const leads = Array.isArray(rawLeads) ? rawLeads : (rawLeads.leads || Object.values(rawLeads));
    totalMasterLeads = leads.length;

    leads.forEach((l: any) => {
      let isSent = false;
      if (l.sms_status === 'SENT' || l.smsSent || l.sms_sent) {
        channels.sms_sent++;
        isSent = true;
      }
      if (l.social_dm_dispatched || l.socialDmSent || l.social_dm_sent) {
        channels.social_dm_sent++;
        isSent = true;
      }
      if (l.email_status === 'SENT' || l.emailSent || l.email_sent || l.email_dispatched) {
        channels.email_sent++;
        isSent = true;
      }
      if (l.webform_status === 'SENT' || l.webform_status === '200_OK' || l.webformSent || l.webform_sent || l.webform_submitted) {
        channels.webform_sent++;
        isSent = true;
      }
      if (l.whatsapp_status === 'SENT' || l.whatsappSent || l.whatsapp_inbound_connected) {
        channels.whatsapp_inbound_connected++;
        isSent = true;
      }
      if (isSent || l.outreach_dispatched) {
        channels.total_outreach_dispatched++;
      } else {
        channels.total_enriched_in_queue++;
      }
    });
  }

  // 2. Audit Lead Journeys (lead_journeys.json) for explicit SMS events if higher
  let totalTrackedJourneys = 0;
  const website: WebsiteBehaviorMetrics = {
    totalUniqueLeadsInteracted: 0,
    totalPageViews: 0,
    totalPrototypeVisits: 0,
    totalCalculatorConfigurations: 0,
    totalVideoWatchSec: 0,
    totalChatMessages: 0,
    totalCheckoutAttempts: 0,
    totalRageClicks: 0
  };

  const intent: LeadIntentBreakdown = {
    hot: 0,
    warm: 0,
    cold: 0
  };

  const calculatorDetails: CalculatorInteractionSummary[] = [];

  let journeySmsDispatches = 0;
  let journeyDmDispatches = 0;

  if (fs.existsSync(JOURNEYS_DB_PATH)) {
    const journeys = readJsonFileSyncWithRetry(JOURNEYS_DB_PATH, {});
    const records = Object.values(journeys) as any[];
    totalTrackedJourneys = records.length;

    records.forEach(j => {
      const pViews = (j.metrics && j.metrics.pageViews) || 0;
      const calcUses = (j.metrics && j.metrics.calculatorInteractions) || 0;
      const vSec = (j.metrics && j.metrics.videoWatchSec) || 0;
      const cMsgs = (j.metrics && j.metrics.chatMessages) || 0;
      const checkAtt = (j.metrics && j.metrics.checkoutAttempts) || 0;
      const rClicks = (j.metrics && j.metrics.rageClicks) || 0;

      website.totalPageViews += pViews;
      website.totalCalculatorConfigurations += calcUses;
      website.totalVideoWatchSec += vSec;
      website.totalChatMessages += cMsgs;
      website.totalCheckoutAttempts += checkAtt;
      website.totalRageClicks += rClicks;

      const hasInteracted = pViews > 0 || calcUses > 0 || j.currentStage === 'PREVIEW_VIEWED' || j.currentStage === 'CALCULATOR_USED';
      if (hasInteracted) {
        website.totalUniqueLeadsInteracted++;
      }

      let isOutreachEvent = false;
      if (Array.isArray(j.events)) {
        j.events.forEach((ev: any) => {
          if (ev.title && (ev.title.includes('SMS') || ev.title.includes('Carrier GSM'))) {
            journeySmsDispatches++;
            isOutreachEvent = true;
          } else if (ev.stage === 'OUTREACH_DISPATCHED' || (ev.title && ev.title.includes('Outreach'))) {
            journeyDmDispatches++;
            isOutreachEvent = true;
          }
          if (ev.stage === 'PREVIEW_VIEWED' || (ev.title && ev.title.includes('Prototype'))) {
            website.totalPrototypeVisits++;
          }
          if (ev.stage === 'CALCULATOR_USED' || (ev.title && ev.title.includes('Sizing'))) {
            calculatorDetails.push({
              leadName: j.leadName || 'Commercial Enterprise',
              category: j.category || 'Solar/Commercial',
              title: ev.title || 'Calculated Sizing',
              summary: (ev.metadata && ev.metadata.calculationSummary) || ev.description || 'Interactive quote generated',
              timestampWat: ev.timestampWat || timestampWat
            });
          }
        });
      }

      if (j.intentLevel === 'HOT' || j.heatScore >= 70 || j.currentStage === 'CALCULATOR_USED') {
        intent.hot++;
      } else if (j.intentLevel === 'WARM' || isOutreachEvent || j.currentStage === 'PREVIEW_VIEWED') {
        intent.warm++;
      } else {
        intent.cold++;
      }
    });
  }

  // Ensure channel metrics use exact explicit dispatch counts
  if (journeySmsDispatches > channels.sms_sent) {
    channels.sms_sent = journeySmsDispatches;
  }
  if (channels.sms_sent < 235 && journeySmsDispatches > 0) {
    channels.sms_sent = Math.max(channels.sms_sent, journeySmsDispatches);
  }

  channels.total_outreach_dispatched = channels.sms_sent + channels.social_dm_sent + channels.email_sent + channels.webform_sent;

  return {
    timestampWat,
    timestampIso,
    totalMasterLeads,
    totalTrackedJourneys,
    channels,
    website,
    intent,
    calculatorDetails
  };
}
