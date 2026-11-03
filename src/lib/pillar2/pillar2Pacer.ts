/**
 * @file src/lib/pillar2/pillar2Pacer.ts
 * 
 * 🏛️ BETHELMIND DEAL WIRE: PACED OUTREACH ENGINE & DAILY QUOTA GUARD
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
 * 
 * CORE POLICY:
 * 1. Daily Quota: Strictly <= 15 outbound messages per day for Pillar 2.
 * 2. Well-Spaced Pacing: Exactly 1 dispatch every 25-35 minutes (default 30m) during Lagos business hours (08:30 - 17:30 WAT).
 * 3. Zero-Spam / Executive Protection: High-ticket mandates targeting senior real estate partners
 *    and managing directors must never be blasted in rapid succession or outside business hours.
 * 4. Dual Persistence: Synchronizes with Supabase Cloud + resilient local fallback.
 */

import fs from 'fs';
import path from 'path';

export const MAX_DAILY_PILLAR2_MESSAGES = 15;
export const MIN_SPACING_MINUTES = 30; // 30 mins between automated messages
export const BUSINESS_HOURS_START_MINUTES = 8 * 60 + 30; // 08:30 WAT
export const BUSINESS_HOURS_END_MINUTES = 17 * 60 + 30;  // 17:30 WAT

export interface PacerState {
  currentDateWat: string;
  sentTodayCount: number;
  maxDailyLimit: number;
  minSpacingMinutes: number;
  lastDispatchedAt: string | null;
  nextEligibleAt: string | null;
  dispatchLogToday: Array<{
    ticketId: string;
    recipient: string;
    channel: string;
    timestamp: string;
  }>;
}

export interface PacerEligibility {
  allowed: boolean;
  reason: string;
  sentToday: number;
  maxDaily: number;
  remainingToday: number;
  spacingMinutes: number;
  lastSentAt: string | null;
  nextEligibleAt: string | null;
  minutesUntilNextEligible: number;
  currentWatTime: string;
  isBusinessHours: boolean;
}

// In-Memory cache for serverless environments
let inMemoryPacerState: PacerState = {
  currentDateWat: getWatDateString(),
  sentTodayCount: 0,
  maxDailyLimit: MAX_DAILY_PILLAR2_MESSAGES,
  minSpacingMinutes: MIN_SPACING_MINUTES,
  lastDispatchedAt: null,
  nextEligibleAt: null,
  dispatchLogToday: []
};

function getWatDate(d: Date = new Date()): Date {
  // Lagos is UTC+1 year-round (no daylight saving)
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 1));
}

export function getWatDateString(d: Date = new Date()): string {
  const wat = getWatDate(d);
  const yyyy = wat.getFullYear();
  const mm = String(wat.getMonth() + 1).padStart(2, '0');
  const dd = String(wat.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getWatTimeString(d: Date = new Date()): string {
  const wat = getWatDate(d);
  const hh = String(wat.getHours()).padStart(2, '0');
  const mm = String(wat.getMinutes()).padStart(2, '0');
  return `${hh}:${mm} WAT`;
}

export function checkLagosBusinessHours(d: Date = new Date()): { inHours: boolean; currentWatTime: string; reason?: string } {
  const wat = getWatDate(d);
  const minutesSinceMidnight = wat.getHours() * 60 + wat.getMinutes();
  const currentWatTime = getWatTimeString(d);

  // Sunday check (optional grace, Sunday closed or restricted)
  const dayOfWeek = wat.getDay(); // 0 = Sunday
  if (dayOfWeek === 0) {
    return {
      inHours: false,
      currentWatTime,
      reason: `Sunday Commercial Rest: Real estate offices closed (${currentWatTime}). Resumes Monday 08:30 WAT.`
    };
  }

  if (minutesSinceMidnight < BUSINESS_HOURS_START_MINUTES) {
    return {
      inHours: false,
      currentWatTime,
      reason: `Before Lagos business hours (opens at 08:30 WAT, current: ${currentWatTime}). Resumes at 08:30 WAT.`
    };
  }

  if (minutesSinceMidnight > BUSINESS_HOURS_END_MINUTES) {
    return {
      inHours: false,
      currentWatTime,
      reason: `After Lagos business hours (closed at 17:30 WAT, current: ${currentWatTime}). Resumes tomorrow at 08:30 WAT.`
    };
  }

  return { inHours: true, currentWatTime };
}

function resolveDbFilePath(): string {
  try {
    const dir = path.join(process.cwd(), 'local_db');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return path.join(dir, 'pillar2_pacer_state.json');
  } catch (_) {
    return path.join('/tmp', 'pillar2_pacer_state.json');
  }
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key);
  } catch (_) {
    return null;
  }
}

export async function loadPacerState(): Promise<PacerState> {
  const todayWat = getWatDateString();

  // 1. Try reading local file
  const filePath = resolveDbFilePath();
  let fileState: PacerState | null = null;
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      fileState = JSON.parse(raw);
    }
  } catch (_) {}

  // 2. Try fetching from Supabase Cloud logs
  const supabase = getSupabaseClient();
  let cloudState: PacerState | null = null;
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .eq('step', 'PILLAR2_DAILY_PACER')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        cloudState = JSON.parse(data[0].message);
      }
    } catch (_) {}
  }

  // Determine latest state
  let state = cloudState || fileState || inMemoryPacerState;

  // Handle midnight date rollover
  if (state.currentDateWat !== todayWat) {
    state = {
      currentDateWat: todayWat,
      sentTodayCount: 0,
      maxDailyLimit: MAX_DAILY_PILLAR2_MESSAGES,
      minSpacingMinutes: MIN_SPACING_MINUTES,
      lastDispatchedAt: null,
      nextEligibleAt: null,
      dispatchLogToday: []
    };
    await persistPacerState(state);
  }

  inMemoryPacerState = state;
  return inMemoryPacerState;
}

export async function persistPacerState(state: PacerState): Promise<void> {
  inMemoryPacerState = state;

  // Save to file
  try {
    const filePath = resolveDbFilePath();
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');
  } catch (_) {}

  // Save to Supabase Cloud
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('logs').insert({
        run_id: 'pillar2_pacer',
        step: 'PILLAR2_DAILY_PACER',
        status: 'SUCCESS',
        message: JSON.stringify(state),
        tenant_id: 'default'
      });
    } catch (_) {}
  }
}

/**
 * Evaluates whether an automated Pillar 2 outreach message is eligible to be dispatched right now.
 * Enforces:
 * 1. Strict daily limit of <= 15 messages.
 * 2. Strict spacing of >= 30 minutes between automated dispatches.
 * 3. Strict business hours guard (08:30 - 17:30 WAT).
 */
export async function checkPillar2PacingEligibility(ignoreBusinessHoursForManual = false): Promise<PacerEligibility> {
  const state = await loadPacerState();
  const now = Date.now();
  const todayWat = getWatDateString();
  const watTime = getWatTimeString();
  const businessHours = checkLagosBusinessHours();

  const sentToday = state.sentTodayCount || 0;
  const remainingToday = Math.max(0, MAX_DAILY_PILLAR2_MESSAGES - sentToday);
  const minSpacingMs = MIN_SPACING_MINUTES * 60 * 1000;

  // Check 1: Daily Quota Cap (Strict <= 15)
  if (sentToday >= MAX_DAILY_PILLAR2_MESSAGES) {
    return {
      allowed: false,
      reason: `🎯 Daily outreach goal reached (${sentToday}/${MAX_DAILY_PILLAR2_MESSAGES} messages sent today). Next batch resumes tomorrow at 08:30 WAT.`,
      sentToday,
      maxDaily: MAX_DAILY_PILLAR2_MESSAGES,
      remainingToday: 0,
      spacingMinutes: MIN_SPACING_MINUTES,
      lastSentAt: state.lastDispatchedAt,
      nextEligibleAt: null,
      minutesUntilNextEligible: 0,
      currentWatTime: watTime,
      isBusinessHours: businessHours.inHours
    };
  }

  // Check 2: Business Hours (unless explicitly bypassed for manual user testing)
  if (!businessHours.inHours && !ignoreBusinessHoursForManual) {
    return {
      allowed: false,
      reason: businessHours.reason || `Outside commercial hours (${watTime}). Paced to resume at 08:30 WAT.`,
      sentToday,
      maxDaily: MAX_DAILY_PILLAR2_MESSAGES,
      remainingToday,
      spacingMinutes: MIN_SPACING_MINUTES,
      lastSentAt: state.lastDispatchedAt,
      nextEligibleAt: null,
      minutesUntilNextEligible: 0,
      currentWatTime: watTime,
      isBusinessHours: false
    };
  }

  // Check 3: Spacing between consecutive automated messages (>= 30 mins)
  if (state.lastDispatchedAt) {
    const lastSentTime = new Date(state.lastDispatchedAt).getTime();
    const elapsedMs = now - lastSentTime;

    if (elapsedMs < minSpacingMs) {
      const remainingMs = minSpacingMs - elapsedMs;
      const minutesUntilNext = Math.ceil(remainingMs / 60000);
      const nextEligibleTime = new Date(lastSentTime + minSpacingMs);

      return {
        allowed: false,
        reason: `⏳ Paced Outreach Active: ${sentToday}/${MAX_DAILY_PILLAR2_MESSAGES} sent today. Next message eligible in ${minutesUntilNext}m (${getWatTimeString(nextEligibleTime)}) to ensure well-spaced delivery.`,
        sentToday,
        maxDaily: MAX_DAILY_PILLAR2_MESSAGES,
        remainingToday,
        spacingMinutes: MIN_SPACING_MINUTES,
        lastSentAt: state.lastDispatchedAt,
        nextEligibleAt: nextEligibleTime.toISOString(),
        minutesUntilNextEligible: minutesUntilNext,
        currentWatTime: watTime,
        isBusinessHours: businessHours.inHours
      };
    }
  }

  // All checks passed!
  return {
    allowed: true,
    reason: `✅ Ready for spaced dispatch (${sentToday}/${MAX_DAILY_PILLAR2_MESSAGES} sent today · ${remainingToday} remaining).`,
    sentToday,
    maxDaily: MAX_DAILY_PILLAR2_MESSAGES,
    remainingToday,
    spacingMinutes: MIN_SPACING_MINUTES,
    lastSentAt: state.lastDispatchedAt,
    nextEligibleAt: new Date(now).toISOString(),
    minutesUntilNextEligible: 0,
    currentWatTime: watTime,
    isBusinessHours: businessHours.inHours
  };
}

/**
 * Records a successful Pillar 2 outreach dispatch, incrementing the daily counter (up to 15)
 * and establishing the next 30-minute pacing timestamp.
 */
export async function recordPillar2Dispatch(entry: {
  ticketId: string;
  recipient: string;
  channel: string;
}): Promise<PacerEligibility> {
  const state = await loadPacerState();
  const now = new Date();
  const nowIso = now.toISOString();
  const nextEligibleIso = new Date(now.getTime() + MIN_SPACING_MINUTES * 60 * 1000).toISOString();

  state.sentTodayCount = (state.sentTodayCount || 0) + 1;
  state.lastDispatchedAt = nowIso;
  state.nextEligibleAt = nextEligibleIso;
  state.dispatchLogToday = state.dispatchLogToday || [];
  state.dispatchLogToday.push({
    ticketId: entry.ticketId,
    recipient: entry.recipient,
    channel: entry.channel,
    timestamp: nowIso
  });

  await persistPacerState(state);

  return checkPillar2PacingEligibility();
}
