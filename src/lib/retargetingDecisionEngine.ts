/**
 * @file retargetingDecisionEngine.ts
 * Automated AI Retargeting Decision Engine
 * 
 * Analyzes real-time customer journey statistics and generates intelligent retargeting decisions:
 * - High-Intent Calculator Abandonment (WhatsApp / SMS technical review offer)
 * - Video Walkthrough Watcher Drop-Off (Case study / social proof follow-up)
 * - 48h Unopened Preview Link Nudge (Alternative hook / SMS push)
 * - Stalled Deal Re-engagement (5-Day Pilot Activation Offer)
 * 
 * Supports both Autonomous Automated Dispatch and 1-Click Manual Admin UI Execution.
 */

import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import {
  getAllLocalLeadJourneys,
  LeadJourneyRecord,
  trackLeadJourneyEvent
} from './leadJourneyTracker';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';
import { sendWhatsAppMessage } from './whatsapp';
import { sendSmsMessage } from './sms';
import { sendNotificationEmail } from './email';
import { logActivity } from './activityLogger';

function parseSpintaxHelper(text: string): string {
  const spintaxRegex = /\{([^{}]+)\}/g;
  let matches = text.match(spintaxRegex);
  while (matches) {
    for (const match of matches) {
      const choices = match.slice(1, -1).split('|');
      const randomChoice = choices[Math.floor(Math.random() * choices.length)];
      text = text.replace(match, randomChoice);
    }
    matches = text.match(spintaxRegex);
  }
  return text;
}

export type RetargetingRuleType = 
  | 'CALCULATOR_ABANDON'
  | 'VIDEO_ENGAGED_DROP'
  | 'UNOPENED_48H_NUDGE'
  | 'STALLED_DAY5_OFFER'
  | 'CRITICAL_HIGH_INTENT';

export type DecisionStatus = 'PENDING' | 'DISPATCHED' | 'DISMISSED' | 'FAILED';

export interface RetargetingDecision {
  id: string;
  leadId: string;
  leadName: string;
  category: string;
  phone?: string;
  email?: string;
  area?: string;
  ruleType: RetargetingRuleType;
  title: string;
  reason: string;
  recommendedChannel: 'whatsapp' | 'sms' | 'email';
  recommendedMessage: string;
  heatScore: number;
  intentLevel: string;
  previewUrl: string;
  status: DecisionStatus;
  createdAt: string;
  dispatchedAt?: string;
  error?: string;
}

const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getDecisionsFilePath(): string {
  return isServerless
    ? path.join('/tmp', 'retargeting_decisions.json')
    : path.join(process.cwd(), 'local_db', 'retargeting_decisions.json');
}

export function getAllRetargetingDecisions(): Record<string, RetargetingDecision> {
  const filePath = getDecisionsFilePath();
  try {
    return readJsonFileSyncWithRetry<Record<string, RetargetingDecision>>(filePath, {});
  } catch (_) {
    return {};
  }
}

export function saveRetargetingDecisions(decisions: Record<string, RetargetingDecision>): void {
  const filePath = getDecisionsFilePath();
  writeJsonFileSyncAtomic(filePath, decisions);
}

/**
 * Evaluates all tracked leads and generates intelligent retargeting decisions.
 */
export async function runRetargetingDecisionAudit(): Promise<RetargetingDecision[]> {
  const journeys = getAllLocalLeadJourneys();
  const existingDecisions = getAllRetargetingDecisions();
  const now = Date.now();
  const newDecisions: RetargetingDecision[] = [];

  for (const journey of Object.values(journeys)) {
    const { leadId, leadName, category, phone, email, area, heatScore = 20, intentLevel = 'COLD', previewUrl, lastActiveIso, currentStage } = journey;

    const metrics = journey.metrics || {
      pageViews: 0,
      calculatorInteractions: 0,
      videoWatchSec: 0,
      chatMessages: 0,
      checkoutAttempts: 0,
      totalTimeSec: 0,
      rageClicks: 0
    };

    // Skip leads that have already converted or lost
    if (currentStage === 'DEAL_WON' || currentStage === 'DEAL_LOST') continue;

    // Check existing decisions for this lead in the last 24h (prevent duplicate spam)
    const recentDecision = Object.values(existingDecisions).find(
      d => d.leadId === leadId && (now - new Date(d.createdAt).getTime()) < 24 * 60 * 60 * 1000
    );
    if (recentDecision) continue;

    const hoursSinceActive = lastActiveIso ? (now - new Date(lastActiveIso).getTime()) / (1000 * 60 * 60) : 999;

    // ── RULE 1: High Intent Calculator Abandonment ──
    if (metrics.calculatorInteractions > 0 && metrics.checkoutAttempts === 0 && hoursSinceActive >= 0.5) {
      const decision: RetargetingDecision = {
        id: `retarget_${randomUUID().substring(0, 8)}`,
        leadId,
        leadName,
        category,
        phone,
        email,
        area,
        ruleType: 'CALCULATOR_ABANDON',
        title: 'Calculator Abandonment Retarget',
        reason: `Prospect calculated a custom quote (${metrics.calculatorInteractions} adjustments) on the portal but dropped off before commitment checkout.`,
        recommendedChannel: phone ? 'whatsapp' : 'email',
        recommendedMessage: `{Good day|Hello} ${leadName} Team 🙏, we noticed you tested the interactive load/quote estimator on your portal (${previewUrl}). Would you like our senior technical team in ${area || 'Lagos'} to review your calculation breakdown with you today? (Reply STOP to opt out)`,
        heatScore,
        intentLevel,
        previewUrl,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      existingDecisions[decision.id] = decision;
      newDecisions.push(decision);
      continue;
    }

    // ── RULE 2: Video Walkthrough Watcher Drop-Off ──
    if (metrics.videoWatchSec >= 20 && metrics.calculatorInteractions === 0 && metrics.checkoutAttempts === 0 && hoursSinceActive >= 2) {
      const decision: RetargetingDecision = {
        id: `retarget_${randomUUID().substring(0, 8)}`,
        leadId,
        leadName,
        category,
        phone,
        email,
        area,
        ruleType: 'VIDEO_ENGAGED_DROP',
        title: 'Video Watcher Social Proof Follow-Up',
        reason: `Prospect watched the walkthrough video for ${metrics.videoWatchSec}s but did not claim. Ready for social proof follow-up.`,
        recommendedChannel: phone ? 'whatsapp' : 'email',
        recommendedMessage: `{Good day|Hello} ${leadName} Team 👋, wanted to share a quick update! We just launched a similar automated portal for a business in ${area || 'Lagos'} that captured 14 new paying clients in week 1. Take another look at your live prototype: ${previewUrl} (STOP to end)`,
        heatScore,
        intentLevel,
        previewUrl,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      existingDecisions[decision.id] = decision;
      newDecisions.push(decision);
      continue;
    }

    // ── RULE 3: Unopened Link 24h Nudge ──
    if (currentStage === 'OUTREACH_DISPATCHED' && metrics.pageViews === 0 && hoursSinceActive >= 24) {
      const decision: RetargetingDecision = {
        id: `retarget_${randomUUID().substring(0, 8)}`,
        leadId,
        leadName,
        category,
        phone,
        email,
        area,
        ruleType: 'UNOPENED_48H_NUDGE',
        title: '24h Unopened Preview Nudge',
        reason: 'Outreach was dispatched over 24 hours ago, but the prospect has not yet clicked their preview link.',
        recommendedChannel: phone ? 'sms' : 'email',
        recommendedMessage: `Good day ${leadName}. Quick reminder that your custom 24/7 quote & customer portal demo is ready: ${previewUrl} - Bethelmind Lagos (STOP to end)`,
        heatScore,
        intentLevel,
        previewUrl,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      existingDecisions[decision.id] = decision;
      newDecisions.push(decision);
      continue;
    }

    // ── RULE 4: Stalled Deal Re-engagement (Day 5 Offer) ──
    if (metrics.pageViews > 0 && hoursSinceActive >= 96) {
      const decision: RetargetingDecision = {
        id: `retarget_${randomUUID().substring(0, 8)}`,
        leadId,
        leadName,
        category,
        phone,
        email,
        area,
        ruleType: 'STALLED_DAY5_OFFER',
        title: '5-Day Pilot Activation Offer',
        reason: 'Prospect showed interest but stalled over 4 days ago. Trigger pilot activation re-engagement.',
        recommendedChannel: phone ? 'whatsapp' : 'email',
        recommendedMessage: `{Good day|Hello} ${leadName} Team, we are finalizing this week's deployment slots in ${area || 'Lagos'}. We can set up a 5-day risk-free pilot on your domain with zero upfront risk: ${previewUrl} (STOP to opt out)`,
        heatScore,
        intentLevel,
        previewUrl,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      existingDecisions[decision.id] = decision;
      newDecisions.push(decision);
    }
  }

  saveRetargetingDecisions(existingDecisions);
  return newDecisions;
}

/**
 * Executes a retargeting decision via its recommended channel.
 */
export async function executeRetargetingDecision(decisionId: string): Promise<{ success: boolean; message: string }> {
  const decisions = getAllRetargetingDecisions();
  const decision = decisions[decisionId];
  if (!decision) throw new Error(`Retargeting decision not found: ${decisionId}`);

  const lead = {
    lead_id: decision.leadId,
    name: decision.leadName,
    phone: decision.phone,
    phone_e164: decision.phone,
    email: decision.email,
    area: decision.area,
    category: decision.category
  };

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';
  const customMessage = parseSpintaxHelper(decision.recommendedMessage);

  try {
    if (decision.recommendedChannel === 'whatsapp' && decision.phone) {
      await sendWhatsAppMessage(lead, decision.previewUrl, origin, customMessage, { bypassHoursCheck: false });
    } else if (decision.recommendedChannel === 'sms' && decision.phone) {
      await sendSmsMessage(lead, decision.previewUrl, customMessage);
    } else if (decision.recommendedChannel === 'email' && decision.email) {
      await sendNotificationEmail(
        decision.email,
        `Follow-up on ${decision.leadName} Quote Portal`,
        customMessage
      );
    } else if (decision.phone) {
      await sendSmsMessage(lead, decision.previewUrl, customMessage);
    } else {
      throw new Error('No valid contact channel (phone or email) found for this lead.');
    }

    decision.status = 'DISPATCHED';
    decision.dispatchedAt = new Date().toISOString();
    decisions[decisionId] = decision;
    saveRetargetingDecisions(decisions);

    // Track the retargeting event in the lead journey
    await trackLeadJourneyEvent({
      leadId: decision.leadId,
      leadName: decision.leadName,
      category: decision.category,
      phone: decision.phone,
      email: decision.email,
      area: decision.area,
      stage: 'OUTREACH_DISPATCHED',
      title: `AI Retargeting: ${decision.title}`,
      description: `Dispatched ${decision.recommendedChannel.toUpperCase()} retarget: "${decision.reason}"`,
      channelUsed: decision.recommendedChannel.toUpperCase(),
      previewUrl: decision.previewUrl
    });

    await logActivity({
      type: 'campaign_step_executed',
      lead_id: decision.leadId,
      description: `AI Retargeting executed for "${decision.leadName}" via ${decision.recommendedChannel.toUpperCase()}`,
      metadata: { decision_id: decision.id, rule_type: decision.ruleType },
    });

    return { success: true, message: `Retargeting dispatched via ${decision.recommendedChannel.toUpperCase()} successfully!` };
  } catch (err: any) {
    decision.status = 'FAILED';
    decision.error = err.message;
    decisions[decisionId] = decision;
    saveRetargetingDecisions(decisions);
    throw err;
  }
}

/**
 * Dismisses a retargeting decision without sending.
 */
export function dismissRetargetingDecision(decisionId: string): boolean {
  const decisions = getAllRetargetingDecisions();
  if (decisions[decisionId]) {
    decisions[decisionId].status = 'DISMISSED';
    saveRetargetingDecisions(decisions);
    return true;
  }
  return false;
}
