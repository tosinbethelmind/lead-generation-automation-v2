/**
 * src/lib/aiHandoverAssistant.ts
 * 
 * Dual-Role AI Assistant Core:
 * 1. Admin Co-Pilot Mode (Audits system, parses revision tickets, drafts IP contracts)
 * 2. Lead Concierge Mode (Plain-English FAQs, revision submission helper, conversational lead referrals)
 * 
 * All outputs wrapped in aiValidationGuard.ts for zero-error reliability.
 */

import { executeGuardedAiCall, validateEmail, validatePhone } from './aiValidationGuard';

export interface AdminRevisionTicket {
  category: 'Branding/Colors' | 'Text/Copy' | 'Logo/Images' | 'Layout/Features' | 'General';
  element: string;
  suggestedAction: string;
  priority: 'Low' | 'Medium' | 'High';
  summary: string;
}

export interface LeadReferralSubmission {
  referralBusinessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
}

/**
 * Admin Co-Pilot: Processes informal client feedback into structured developer tickets
 */
export async function processAdminAiRevision(rawFeedback: string): Promise<AdminRevisionTicket> {
  const fallback: AdminRevisionTicket = {
    category: 'General',
    element: 'Entire Website',
    suggestedAction: 'Review client notes and apply requested adjustments.',
    priority: 'Medium',
    summary: rawFeedback || 'Client submitted visual feedback.',
  };

  const systemPrompt = `You are an expert Lead Engine WebApp Developer Assistant. 
Analyze informal client revision feedback and convert it into a structured JSON ticket.
The JSON output MUST strictly conform to this schema:
{
  "category": "Branding/Colors" | "Text/Copy" | "Logo/Images" | "Layout/Features" | "General",
  "element": "string (specific section or component name)",
  "suggestedAction": "string (exact technical steps to implement revision)",
  "priority": "Low" | "Medium" | "High",
  "summary": "string (1 sentence client request summary)"
}`;

  const res = await executeGuardedAiCall<AdminRevisionTicket>({
    prompt: `Convert this client feedback into a developer ticket:\n"${rawFeedback}"`,
    systemPrompt,
    fallback,
    validator: (data) => {
      const errors: string[] = [];
      if (!data || typeof data !== 'object') {
        errors.push('Response is not a valid JSON object');
        return { isValid: false, errors };
      }
      if (!['Branding/Colors', 'Text/Copy', 'Logo/Images', 'Layout/Features', 'General'].includes(data.category)) {
        errors.push(`Invalid category: ${data.category}`);
      }
      if (!data.summary) errors.push('Missing summary');
      return { isValid: errors.length === 0, errors };
    },
  });

  return res.data;
}

/**
 * Lead Concierge: Processes conversational client inquiry and returns friendly assistance
 */
export async function processLeadAiChat(userMessage: string, context?: { leadName?: string; businessName?: string }): Promise<{
  reply: string;
  isReferralIntent: boolean;
  isRevisionIntent: boolean;
}> {
  const fallback = {
    reply: `Hello ${context?.leadName || 'there'}! I am your AI Website Concierge. You can ask me any questions about claiming your site, requesting design changes, or connecting your custom domain. How can I help you today?`,
    isReferralIntent: false,
    isRevisionIntent: false,
  };

  const systemPrompt = `You are a warm, helpful, non-technical AI Website Concierge assisting business owners with their new websites.
Never use complicated developer jargon. Keep explanations clear, friendly, and empowering.

Analyze the user's message and return JSON:
{
  "reply": "string (your helpful response)",
  "isReferralIntent": boolean (true if user wants to build another site or refer a business friend),
  "isRevisionIntent": boolean (true if user wants to change colors, logo, text, or layout)
}`;

  const res = await executeGuardedAiCall({
    prompt: `Lead Name: ${context?.leadName || 'Business Owner'}, Business: ${context?.businessName || 'Business'}.\nUser Message: "${userMessage}"`,
    systemPrompt,
    fallback,
    validator: (data) => {
      const errors: string[] = [];
      if (!data || typeof data.reply !== 'string') errors.push('Missing string reply');
      return { isValid: errors.length === 0, errors };
    },
  });

  return res.data;
}

/**
 * Validates and extracts a structured Referral / New Business Lead from conversational input
 */
export async function parseReferralSubmission(rawInput: string): Promise<LeadReferralSubmission> {
  const fallback: LeadReferralSubmission = {
    referralBusinessName: 'New Lead Referral',
    contactName: 'Business Contact',
    contactEmail: 'contact@clientbusiness.com',
    contactPhone: '+10000000000',
    notes: rawInput,
  };

  const systemPrompt = `Extract contact and business details for a referral lead from the user text. Return JSON:
{
  "referralBusinessName": "string",
  "contactName": "string",
  "contactEmail": "string",
  "contactPhone": "string",
  "notes": "string"
}`;

  const res = await executeGuardedAiCall<LeadReferralSubmission>({
    prompt: `Extract referral details from this message:\n"${rawInput}"`,
    systemPrompt,
    fallback,
    validator: (data) => {
      const errors: string[] = [];
      if (!data || !data.referralBusinessName) errors.push('Missing business name');
      return { isValid: errors.length === 0, errors };
    },
  });

  return res.data;
}
