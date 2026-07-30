/**
 * @file leadJourneyTracker.ts
 * End-to-End Lead Journey Tracking Engine
 * 
 * Tracks the complete 7-stage lifecycle of every B2B lead:
 * 1. SCRAPED: Lead harvested from Google Places / Jiji / Overpass
 * 2. ENRICHED: Scored by Gemini AI + Dynamic Preview Generated (/preview/[leadId])
 * 3. OUTREACH_DISPATCHED: Form / Email (Strategy Alpha) or WhatsApp / SMS (Strategy Beta)
 * 4. PREVIEW_VIEWED: Prospect clicked and opened their live custom landing page preview
 * 5. INBOUND_REPLY: Prospect clicked WhatsApp CTA or submitted contact form reply
 * 6. PILOT_ACTIVATED: 5-Day Done-For-You Lead Pilot started
 * 7. DEAL_WON: Converted to paid SaaS subscription (NGN Revenue attributed)
 */

import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient';
import { addLog, updateLeadStatus } from './googleSheets';

export type JourneyStage = 
  | 'SCRAPED'
  | 'ENRICHED'
  | 'OUTREACH_DISPATCHED'
  | 'PREVIEW_VIEWED'
  | 'INBOUND_REPLY'
  | 'PILOT_ACTIVATED'
  | 'DEAL_WON'
  | 'DEAL_LOST';

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

export interface LeadJourneyRecord {
  leadId: string;
  leadName: string;
  category: string;
  phone?: string;
  email?: string;
  currentStage: JourneyStage;
  score: number;
  previewUrl: string;
  createdAt: string;
  lastUpdatedWat: string;
  events: JourneyEvent[];
}

const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');
const JOURNEY_DB_FILE = path.join(LOCAL_DB_DIR, 'lead_journeys.json');

function getLagosWatTimestamp(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-NG', { 
    timeZone: 'Africa/Lagos', 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  }) + ' WAT (' + date.toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos', month: 'short', day: 'numeric' }) + ')';
}

function ensureLocalDbExists() {
  if (!fs.existsSync(LOCAL_DB_DIR)) {
    try {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    } catch (_) {}
  }
  if (!fs.existsSync(JOURNEY_DB_FILE)) {
    try {
      fs.writeFileSync(JOURNEY_DB_FILE, JSON.stringify({}), 'utf8');
    } catch (_) {}
  }
}

/**
 * Loads all lead journey records from local JSON database.
 */
export function getAllLocalLeadJourneys(): Record<string, LeadJourneyRecord> {
  ensureLocalDbExists();
  try {
    const raw = fs.readFileSync(JOURNEY_DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (_) {
    return {};
  }
}

/**
 * Saves lead journeys to local JSON database.
 */
function saveLocalLeadJourneys(journeys: Record<string, LeadJourneyRecord>) {
  ensureLocalDbExists();
  try {
    fs.writeFileSync(JOURNEY_DB_FILE, JSON.stringify(journeys, null, 2), 'utf8');
  } catch (_) {}
}

/**
 * Records a new journey milestone event for a specific lead.
 */
export async function trackLeadJourneyEvent(params: {
  leadId: string;
  leadName: string;
  category?: string;
  phone?: string;
  email?: string;
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
    stage,
    title,
    description,
    channelUsed = 'Automation',
    score = 75,
    previewUrl = `https://lead-generation-automation-e0oitxcsi.vercel.app/preview/${leadId}`,
    metadata = {}
  } = params;

  const now = new Date();
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
    timestamp: now.toISOString(),
    timestampWat,
    metadata
  };

  // 1. Update Local JSON Database
  const journeys = getAllLocalLeadJourneys();
  let record = journeys[leadId];

  if (!record) {
    record = {
      leadId,
      leadName,
      category,
      phone,
      email,
      currentStage: stage,
      score,
      previewUrl,
      createdAt: now.toISOString(),
      lastUpdatedWat: timestampWat,
      events: []
    };
  }

  record.currentStage = stage;
  record.lastUpdatedWat = timestampWat;
  if (phone) record.phone = phone;
  if (email) record.email = email;
  if (score) record.score = score;
  if (previewUrl) record.previewUrl = previewUrl;

  // Append new event (prevent exact duplicates)
  const isDuplicate = record.events.some(e => e.stage === stage && e.title === title && (Date.now() - new Date(e.timestamp).getTime()) < 5000);
  if (!isDuplicate) {
    record.events.unshift(event);
  }

  journeys[leadId] = record;
  saveLocalLeadJourneys(journeys);

  // 2. Sync to Supabase Cloud logs & lead_journey table
  try {
    const supabase = getSupabaseClient();
    await (supabase as any)
      .from('logs')
      .insert([{
        run_id: `journey_${leadId}`,
        timestamp: now.toISOString(),
        step: `JOURNEY_${stage}`,
        status: 'SUCCESS',
        message: `📍 [JOURNEY] [${leadName}] ➔ ${title}: ${description} (${timestampWat})`
      }]);
  } catch (_) {}

  // 3. Update Google Sheets & Activity Logs
  try {
    await updateLeadStatus(leadId, stage as any, `Journey: ${title} (${timestampWat})`);
    await addLog('Lead Journey Tracker', 'INFO', `Lead [${leadName}] advanced to ${stage}: ${title}`);
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
export function getRecentLeadJourneys(limit = 20): LeadJourneyRecord[] {
  const journeys = getAllLocalLeadJourneys();
  return Object.values(journeys)
    .sort((a, b) => new Date(b.events[0]?.timestamp || b.createdAt).getTime() - new Date(a.events[0]?.timestamp || a.createdAt).getTime())
    .slice(0, limit);
}
