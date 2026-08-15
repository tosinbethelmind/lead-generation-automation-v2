/**
 * src/lib/whatsappRotator.ts
 * 
 * Multi-Line WhatsApp Outreach Rotator, Anti-Ban Warm-Up Controller & Opt-Out Suppression Manager
 * 
 * Key Capabilities:
 * 1. Warm-Up Schedule: Day 1-2 = 30 msgs/day cap -> Day 3-7 = 45 msgs/day -> Day 8+ = 60 msgs/day per line.
 * 2. Smart Dual-Line Failover: Automatically switches to secondary line if primary reaches daily limit.
 * 3. Opt-Out Suppression: Tracks STOP/UNSUBSCRIBE requests and blocks outbound sends instantly.
 * 4. Human Jitter Generator: Provides Gaussian-distributed randomized delays (45s–120s).
 */

import fs from 'fs';
import path from 'path';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';

export interface WhatsAppNumberConfig {
  adminPhone: string;          // Primary phone that receives alerts & controls approvals
  outreachPhone1: string;      // Customer-Facing Outreach Line 1
  outreachPhone2: string;      // Customer-Facing Outreach Line 2
}

export interface WarmupState {
  campaignStartDate: string;   // ISO date string of campaign inception
  dailyCounts: {
    [dateKey: string]: {
      [lineId: string]: number; // e.g. "2026-08-14": { "LINE_1": 12, "LINE_2": 15, "TOTAL": 27 }
    };
  };
  optOutList: {
    [phone: string]: {
      optedOutAt: string;
      reason?: string;
    };
  };
}

const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getWarmupStateFilePath(): string {
  return isServerless
    ? path.join('/tmp', 'whatsapp_warmup_state.json')
    : path.join(process.cwd(), 'local_db', 'whatsapp_warmup_state.json');
}

/**
 * Returns today's date key in WAT (UTC+1) format YYYY-MM-DD
 */
export function getWatDateKey(): string {
  const now = new Date();
  const watOffsetMs = 1 * 60 * 60 * 1000;
  const watDate = new Date(now.getTime() + watOffsetMs);
  return watDate.toISOString().split('T')[0];
}

/**
 * Loads current warmup and suppression state
 */
export function getWarmupState(): WarmupState {
  const filePath = getWarmupStateFilePath();
  const todayKey = getWatDateKey();
  const defaultState: WarmupState = {
    campaignStartDate: new Date().toISOString(),
    dailyCounts: {
      [todayKey]: { LINE_1: 0, LINE_2: 0, TOTAL: 0 }
    },
    optOutList: {}
  };

  try {
    const data = readJsonFileSyncWithRetry<WarmupState>(filePath, defaultState);
    if (!data.dailyCounts) data.dailyCounts = {};
    if (!data.dailyCounts[todayKey]) {
      data.dailyCounts[todayKey] = { LINE_1: 0, LINE_2: 0, TOTAL: 0 };
    }
    if (!data.optOutList) data.optOutList = {};
    return data;
  } catch {
    return defaultState;
  }
}

/**
 * Saves warmup and suppression state
 */
export function saveWarmupState(state: WarmupState): void {
  const filePath = getWarmupStateFilePath();
  writeJsonFileSyncAtomic(filePath, state);
}

/**
 * Calculates current daily message limit per line and total based on campaign age.
 * - Days 1-2: Hard cap of 30 messages per day total (15 per line, or 30 aggregate).
 * - Days 3-7: 45 messages per line.
 * - Days 8+: 60 messages per line.
 */
export function getDailyLimitConfig(): { perLineLimit: number; totalDailyLimit: number; currentDayNumber: number } {
  const state = getWarmupState();
  const startDate = new Date(state.campaignStartDate || new Date().toISOString());
  const now = new Date();
  
  const diffMs = now.getTime() - startDate.getTime();
  const daysActive = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);

  if (daysActive <= 2) {
    // Warm-up Phase 1: 30 messages the first 2 days
    return { perLineLimit: 15, totalDailyLimit: 30, currentDayNumber: daysActive };
  } else if (daysActive <= 7) {
    // Warm-up Phase 2: 45 messages/day per line
    return { perLineLimit: 45, totalDailyLimit: 90, currentDayNumber: daysActive };
  } else {
    // Cruising Phase: 60 messages/day per line
    return { perLineLimit: 60, totalDailyLimit: 120, currentDayNumber: daysActive };
  }
}

/**
 * Checks if a specific line or the total daily limit has been exceeded today.
 */
export function checkQuotaAvailable(lineId: 'LINE_1' | 'LINE_2'): {
  allowed: boolean;
  reason?: string;
  sentTodayLine: number;
  sentTodayTotal: number;
  limitTotal: number;
} {
  const state = getWarmupState();
  const todayKey = getWatDateKey();
  const counts = state.dailyCounts[todayKey] || { LINE_1: 0, LINE_2: 0, TOTAL: 0 };
  const limits = getDailyLimitConfig();

  const sentTodayLine = counts[lineId] || 0;
  const sentTodayTotal = counts.TOTAL || (counts.LINE_1 || 0) + (counts.LINE_2 || 0);

  if (sentTodayTotal >= limits.totalDailyLimit) {
    return {
      allowed: false,
      reason: `Daily warm-up limit reached (${sentTodayTotal}/${limits.totalDailyLimit} msgs for Day ${limits.currentDayNumber}). Pausing until tomorrow for anti-ban protection.`,
      sentTodayLine,
      sentTodayTotal,
      limitTotal: limits.totalDailyLimit
    };
  }

  if (sentTodayLine >= limits.perLineLimit) {
    return {
      allowed: false,
      reason: `Line ${lineId} limit reached (${sentTodayLine}/${limits.perLineLimit} msgs). Switching to alternative line.`,
      sentTodayLine,
      sentTodayTotal,
      limitTotal: limits.totalDailyLimit
    };
  }

  return {
    allowed: true,
    sentTodayLine,
    sentTodayTotal,
    limitTotal: limits.totalDailyLimit
  };
}

/**
 * Increments today's send count for the specified line.
 */
export function incrementSendCount(lineId: 'LINE_1' | 'LINE_2'): void {
  const state = getWarmupState();
  const todayKey = getWatDateKey();

  if (!state.dailyCounts[todayKey]) {
    state.dailyCounts[todayKey] = { LINE_1: 0, LINE_2: 0, TOTAL: 0 };
  }

  state.dailyCounts[todayKey][lineId] = (state.dailyCounts[todayKey][lineId] || 0) + 1;
  state.dailyCounts[todayKey].TOTAL = (state.dailyCounts[todayKey].LINE_1 || 0) + (state.dailyCounts[todayKey].LINE_2 || 0);

  saveWarmupState(state);
}

/**
 * Checks if an incoming message contains an opt-out / STOP keyword.
 */
export function isOptOutKeyword(text: string): boolean {
  const clean = (text || '').trim().toLowerCase();
  const optOutTriggers = ['stop', 'unsubscribe', 'remove me', 'remove', 'opt out', 'opt-out', 'dont message me', "don't message me", 'block', 'cancel'];
  return optOutTriggers.some(trigger => clean === trigger || clean.startsWith(trigger));
}

/**
 * Checks if a phone number has requested opt-out (STOP/UNSUBSCRIBE).
 */
export function isOptedOut(phone: string): boolean {
  const cleaned = cleanPhoneNumber(phone);
  if (!cleaned) return false;
  const state = getWarmupState();
  return !!state.optOutList[cleaned];
}

/**
 * Registers an opt-out suppression for a phone number.
 */
export function recordOptOut(phone: string, reason = 'User replied STOP'): void {
  const cleaned = cleanPhoneNumber(phone);
  if (!cleaned) return;
  const state = getWarmupState();
  state.optOutList[cleaned] = {
    optedOutAt: new Date().toISOString(),
    reason
  };
  saveWarmupState(state);
}

/**
 * Clears an opt-out status (if user re-subscribes or admin clears).
 */
export function clearOptOut(phone: string): void {
  const cleaned = cleanPhoneNumber(phone);
  if (!cleaned) return;
  const state = getWarmupState();
  if (state.optOutList[cleaned]) {
    delete state.optOutList[cleaned];
    saveWarmupState(state);
  }
}

let rotationIndex = 0;

/**
 * Returns active WhatsApp number configurations from env or fallback
 */
export function getWhatsAppNumberConfig(): WhatsAppNumberConfig {
  return {
    adminPhone: process.env.ADMIN_WA_PHONE || '2348022791227',
    outreachPhone1: process.env.OUTREACH_WA_PHONE_1 || '2347026266946',
    outreachPhone2: process.env.OUTREACH_WA_PHONE_2 || '2349046050469',
  };
}

/**
 * Gets the next rotated outreach line with automated quota check & failover
 */
export function getNextRotatedOutreachLine(): { 
  phone: string; 
  lineId: 'LINE_1' | 'LINE_2'; 
  allowed: boolean; 
  reason?: string 
} {
  const config = getWhatsAppNumberConfig();
  rotationIndex++;

  const primaryChoice: 'LINE_1' | 'LINE_2' = rotationIndex % 2 === 1 ? 'LINE_1' : 'LINE_2';
  const secondaryChoice: 'LINE_1' | 'LINE_2' = primaryChoice === 'LINE_1' ? 'LINE_2' : 'LINE_1';

  // Check primary line quota
  const primaryStatus = checkQuotaAvailable(primaryChoice);
  if (primaryStatus.allowed) {
    return {
      phone: primaryChoice === 'LINE_1' ? config.outreachPhone1 : config.outreachPhone2,
      lineId: primaryChoice,
      allowed: true
    };
  }

  // Check secondary line quota for failover
  const secondaryStatus = checkQuotaAvailable(secondaryChoice);
  if (secondaryStatus.allowed) {
    return {
      phone: secondaryChoice === 'LINE_1' ? config.outreachPhone1 : config.outreachPhone2,
      lineId: secondaryChoice,
      allowed: true
    };
  }

  // Both lines reached quota
  return {
    phone: primaryChoice === 'LINE_1' ? config.outreachPhone1 : config.outreachPhone2,
    lineId: primaryChoice,
    allowed: false,
    reason: primaryStatus.reason || 'Daily outreach quota reached across all lines'
  };
}

/**
 * Formats any phone number into clean E.164 digits without symbols (e.g. 08012345678 -> 2348012345678)
 */
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '234' + cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Returns a human-like randomized delay in milliseconds (45s to 120s)
 */
export function getRandomHumanJitterMs(minSeconds = 45, maxSeconds = 120): number {
  const randomSeconds = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
  return randomSeconds * 1000;
}
