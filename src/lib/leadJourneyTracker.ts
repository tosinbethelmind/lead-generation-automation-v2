/**
 * @file leadJourneyTracker.ts
 * End-to-End Intelligent Lead Journey & Behavioral Analytics Engine
 * 
 * Tracks the complete lifecycle & micro-interactions of every B2B lead:
 * - Macro Stages: SCRAPED -> ENRICHED -> OUTREACH_DISPATCHED -> PREVIEW_VIEWED -> INBOUND_REPLY -> PILOT_ACTIVATED -> DEAL_WON
 * - Micro Interactions: CALCULATOR_USED, VIDEO_WATCHED, CHAT_OPENED, CHECKOUT_CLICKED, RAGE_CLICK
 * - Real-time Heat Scoring (0-100) and Behavioral Intent Profiling (COLD, WARM, HOT, CRITICAL).
 */

import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient';
import { addLog, updateLeadStatus } from './googleSheets';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';

export type JourneyStage = 
  | 'SCRAPED'
  | 'ENRICHED'
  | 'OUTREACH_DISPATCHED'
  | 'PREVIEW_VIEWED'
  | 'CALCULATOR_USED'
  | 'VIDEO_WATCHED'
  | 'CHAT_OPENED'
  | 'CHECKOUT_CLICKED'
  | 'INBOUND_REPLY'
  | 'PILOT_ACTIVATED'
  | 'DEAL_WON'
  | 'DEAL_LOST';

export type IntentLevel = 'COLD' | 'WARM' | 'HOT' | 'CRITICAL';

export interface JourneyEvent {
  id: string;
  leadId: string;
  leadName: string;
  businessCategory: string;
  phone?: string;
  email?: string;
  stage: JourneyStage;
  title: string;
  description: string;
  channelUsed?: string;
  timestamp: string; // ISO String
  timestampWat: string; // Lagos WAT Formatted
  metadata?: Record<string, any>;
}

export interface JourneyMetrics {
  pageViews: number;
  calculatorInteractions: number;
  videoWatchSec: number;
  chatMessages: number;
  checkoutAttempts: number;
  totalTimeSec: number;
  rageClicks: number;
  lastCalculationSummary?: string;
}

export interface LeadJourneyRecord {
  leadId: string;
  leadName: string;
  category: string;
  phone?: string;
  email?: string;
  area?: string;
  currentStage: JourneyStage;
  score: number;
  heatScore: number; // Dynamic 0 - 100
  intentLevel: IntentLevel;
  previewUrl: string;
  createdAt: string;
  lastActiveIso: string;
  lastUpdatedWat: string;
  metrics: JourneyMetrics;
  events: JourneyEvent[];
}

export interface FunnelStatistics {
  totalTracked: number;
  outreachDispatched: number;
  previewOpened: number;
  calculatorUsed: number;
  videoWatched: number;
  checkoutInitiated: number;
  convertedWon: number;
  hotLeadsCount: number;
  criticalLeadsCount: number;
  activeTodayCount: number;
}

const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getJourneyDbFilePath(): string {
  return isServerless
    ? path.join('/tmp', 'lead_journeys.json')
    : path.join(process.cwd(), 'local_db', 'lead_journeys.json');
}

export function getLagosWatTimestamp(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-NG', { 
    timeZone: 'Africa/Lagos', 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  }) + ' WAT (' + date.toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos', month: 'short', day: 'numeric' }) + ')';
}

/**
 * Loads all lead journey records.
 */
export function getAllLocalLeadJourneys(): Record<string, LeadJourneyRecord> {
  const filePath = getJourneyDbFilePath();
  try {
    return readJsonFileSyncWithRetry<Record<string, LeadJourneyRecord>>(filePath, {});
  } catch (_) {
    return {};
  }
}

/**
 * Saves lead journeys to storage.
 */
export function saveLocalLeadJourneys(journeys: Record<string, LeadJourneyRecord>): void {
  const filePath = getJourneyDbFilePath();
  writeJsonFileSyncAtomic(filePath, journeys);
}

/**
 * Dynamically computes a lead's Heat Score (0 - 100) and Intent Level.
 */
export function calculateHeatScore(metrics: JourneyMetrics, stage: JourneyStage, lastActiveIso: string): { heatScore: number; intentLevel: IntentLevel } {
  let score = 20; // Base score for scraped & enriched lead

  if (stage === 'OUTREACH_DISPATCHED' || metrics.pageViews > 0) score += 15;
  if (stage === 'CALCULATOR_USED' || metrics.calculatorInteractions > 0) score += 30;
  if (metrics.pageViews > 0) score += Math.min(20, metrics.pageViews * 10);
  if (metrics.calculatorInteractions > 1) score += Math.min(20, (metrics.calculatorInteractions - 1) * 10);
  if (stage === 'VIDEO_WATCHED' || metrics.videoWatchSec >= 20) score += 20;
  if (stage === 'CHAT_OPENED' || metrics.chatMessages > 0) score += Math.min(25, Math.max(1, metrics.chatMessages) * 10);
  if (stage === 'CHECKOUT_CLICKED' || metrics.checkoutAttempts > 0) score += 35;
  if (stage === 'PILOT_ACTIVATED') score += 40;
  if (stage === 'DEAL_WON') score = 100;

  // Recency Decay: If inactive for > 48h, decay score slightly
  if (lastActiveIso) {
    const hoursSinceActive = (Date.now() - new Date(lastActiveIso).getTime()) / (1000 * 60 * 60);
    if (hoursSinceActive > 48) {
      score = Math.max(10, Math.round(score * 0.75));
    }
  }

  const heatScore = Math.min(100, Math.max(0, score));

  let intentLevel: IntentLevel = 'COLD';
  if (heatScore >= 80 || metrics.checkoutAttempts > 0) intentLevel = 'CRITICAL';
  else if (heatScore >= 60 || metrics.calculatorInteractions > 0) intentLevel = 'HOT';
  else if (heatScore >= 35 || metrics.pageViews > 0) intentLevel = 'WARM';

  return { heatScore, intentLevel };
}

/**
 * Records a new journey milestone or micro-interaction event.
 */
export async function trackLeadJourneyEvent(params: {
  leadId: string;
  leadName: string;
  category?: string;
  phone?: string;
  email?: string;
  area?: string;
  stage: JourneyStage;
  title: string;
  description: string;
  channelUsed?: string;
  score?: number;
  previewUrl?: string;
  metadata?: Record<string, any>;
}): Promise<JourneyEvent> {
  const {
    leadId,
    leadName,
    category = 'General',
    phone = '',
    email = '',
    area = '',
    stage,
    title,
    description,
    channelUsed = 'Automation',
    score = 75,
    previewUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com'}/preview/${leadId}`,
    metadata = {}
  } = params;

  const now = new Date();
  const timestampIso = now.toISOString();
  const timestampWat = getLagosWatTimestamp(now);
  const eventId = `j_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const event: JourneyEvent = {
    id: eventId,
    leadId,
    leadName,
    businessCategory: category,
    phone,
    email,
    stage,
    title,
    description,
    channelUsed,
    timestamp: timestampIso,
    timestampWat,
    metadata
  };

  const journeys = getAllLocalLeadJourneys();
  let record = journeys[leadId];

  const initialMetrics: JourneyMetrics = {
    pageViews: 0,
    calculatorInteractions: 0,
    videoWatchSec: 0,
    chatMessages: 0,
    checkoutAttempts: 0,
    totalTimeSec: 0,
    rageClicks: 0,
  };

  if (!record) {
    record = {
      leadId,
      leadName,
      category,
      phone,
      email,
      area,
      currentStage: stage,
      score,
      heatScore: 20,
      intentLevel: 'COLD',
      previewUrl,
      createdAt: timestampIso,
      lastActiveIso: timestampIso,
      lastUpdatedWat: timestampWat,
      metrics: initialMetrics,
      events: []
    };
  }

  // Update Metrics based on Event Type
  if (!record.metrics) record.metrics = initialMetrics;

  if (stage === 'PREVIEW_VIEWED') record.metrics.pageViews = (record.metrics.pageViews || 0) + 1;
  if (stage === 'CALCULATOR_USED') {
    record.metrics.calculatorInteractions = (record.metrics.calculatorInteractions || 0) + 1;
    if (metadata.calculationSummary) record.metrics.lastCalculationSummary = metadata.calculationSummary;
  }
  if (stage === 'VIDEO_WATCHED') {
    record.metrics.videoWatchSec = (record.metrics.videoWatchSec || 0) + (metadata.durationSec || 30);
  }
  if (stage === 'CHAT_OPENED') record.metrics.chatMessages = (record.metrics.chatMessages || 0) + 1;
  if (stage === 'CHECKOUT_CLICKED') record.metrics.checkoutAttempts = (record.metrics.checkoutAttempts || 0) + 1;
  if (metadata.timeOnPageSec) record.metrics.totalTimeSec = (record.metrics.totalTimeSec || 0) + metadata.timeOnPageSec;
  if (metadata.rageClick) record.metrics.rageClicks = (record.metrics.rageClicks || 0) + 1;

  // Advance stage if newer / higher intent
  record.currentStage = stage;
  record.lastActiveIso = timestampIso;
  record.lastUpdatedWat = timestampWat;
  if (phone) record.phone = phone;
  if (email) record.email = email;
  if (area) record.area = area;
  if (score) record.score = score;
  if (previewUrl) record.previewUrl = previewUrl;

  // Calculate dynamic heat score
  const { heatScore, intentLevel } = calculateHeatScore(record.metrics, stage, timestampIso);
  record.heatScore = heatScore;
  record.intentLevel = intentLevel;

  // Append new event
  const isDuplicate = record.events.some(
    e => e.stage === stage && e.title === title && (Date.now() - new Date(e.timestamp).getTime()) < 3000
  );
  if (!isDuplicate) {
    record.events.unshift(event);
  }

  journeys[leadId] = record;
  saveLocalLeadJourneys(journeys);

  // Sync to Supabase logs asynchronously (fire-and-forget)
  try {
    const supabase = getSupabaseClient();
    (supabase as any)
      .from('logs')
      .insert([{
        run_id: `journey_${leadId}`,
        timestamp: timestampIso,
        step: `JOURNEY_${stage}`,
        status: 'SUCCESS',
        message: `📍 [JOURNEY] [${leadName}] ➔ ${title} (Heat: ${heatScore}★) (${timestampWat})`
      }])
      .then(() => {})
      .catch(() => {});
  } catch (_) {}

  return event;
}

/**
 * Retrieves the complete journey history for a lead.
 */
export function getLeadJourney(leadId: string): LeadJourneyRecord | null {
  const journeys = getAllLocalLeadJourneys();
  return journeys[leadId] || null;
}

/**
 * Returns a list of recently active lead journeys sorted by last update.
 */
export function getRecentLeadJourneys(limit = 50): LeadJourneyRecord[] {
  const journeys = getAllLocalLeadJourneys();
  return Object.values(journeys)
    .sort((a, b) => new Date(b.lastActiveIso || b.createdAt).getTime() - new Date(a.lastActiveIso || a.createdAt).getTime())
    .slice(0, limit);
}

/**
 * Computes live conversion funnel and aggregated journey statistics.
 */
export function getJourneyFunnelMetrics(): FunnelStatistics {
  const journeys = Object.values(getAllLocalLeadJourneys());
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const totalTracked = journeys.length;
  let outreachDispatched = 0;
  let previewOpened = 0;
  let calculatorUsed = 0;
  let videoWatched = 0;
  let checkoutInitiated = 0;
  let convertedWon = 0;
  let hotLeadsCount = 0;
  let criticalLeadsCount = 0;
  let activeTodayCount = 0;

  for (const j of journeys) {
    if (j.currentStage !== 'SCRAPED' && j.currentStage !== 'ENRICHED') outreachDispatched++;
    if (j.metrics?.pageViews > 0) previewOpened++;
    if (j.metrics?.calculatorInteractions > 0) calculatorUsed++;
    if (j.metrics?.videoWatchSec > 0) videoWatched++;
    if (j.metrics?.checkoutAttempts > 0) checkoutInitiated++;
    if (j.currentStage === 'DEAL_WON' || j.currentStage === 'PILOT_ACTIVATED') convertedWon++;

    if (j.intentLevel === 'CRITICAL') criticalLeadsCount++;
    else if (j.intentLevel === 'HOT') hotLeadsCount++;

    if (j.lastActiveIso && (now - new Date(j.lastActiveIso).getTime()) < oneDayMs) {
      activeTodayCount++;
    }
  }

  return {
    totalTracked: Math.max(totalTracked, 1),
    outreachDispatched,
    previewOpened,
    calculatorUsed,
    videoWatched,
    checkoutInitiated,
    convertedWon,
    hotLeadsCount,
    criticalLeadsCount,
    activeTodayCount
  };
}
