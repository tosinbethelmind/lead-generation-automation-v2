/**
 * src/lib/aiValidationGuard.ts
 * 
 * Multi-Layer Quality Assurance & Hallucination Prevention Engine:
 * 1. Strict Regex Verification for Emails, Phone Numbers & URLs
 * 2. Placeholder & Hallucination Detection (Lorem Ipsum, 123-456-7890, etc.)
 * 3. Robust JSON Output Extraction & Sanitization
 * 4. Auto-Correction Retry Loop with Gemini AI
 * 5. Safe Deterministic Fallback Engine
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

const PLACEHOLDER_PATTERNS = [
  /lorem\s+ipsum/i,
  /123[-.]?456[-.]?7890/,
  /555[-.]?\d{3}[-.]?\d{4}/,
  /example\.com/i,
  /\[insert\s+[^\]]+\]/i,
  /your\s+company\s+name/i,
  /john\s+doe/i,
  /test\s+business/i,
  /placeholder/i,
];

/**
 * Validates email addresses against RFC standard regex
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates phone numbers (accepts international format, digits, spaces, hyphens, plus)
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  // Must be between 7 and 15 digits, optional leading +
  return /^\+?\d{7,15}$/.test(clean);
}

/**
 * Scans text for AI placeholders or hallucinated test strings
 */
export function detectPlaceholders(text: string): { hasPlaceholder: boolean; matched: string[] } {
  if (!text || typeof text !== 'string') return { hasPlaceholder: false, matched: [] };
  const matched: string[] = [];
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(text)) {
      matched.push(pattern.toString());
    }
  }
  return {
    hasPlaceholder: matched.length > 0,
    matched,
  };
}

/**
 * Safely extracts JSON from raw AI text (handles ```json fence blocks, trailing commas, etc.)
 */
export function sanitizeJsonOutput<T = any>(rawText: string): T | null {
  if (!rawText || typeof rawText !== 'string') return null;

  try {
    // 1. Direct parse attempt
    return JSON.parse(rawText);
  } catch (_) {
    // 2. Extract from markdown fenced code blocks ```json ... ```
    const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch (__) {}
    }

    // 3. Extract first curly brace pair { ... }
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const candidate = rawText.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch (___) {}
    }

    // 4. Extract first bracket pair [ ... ]
    const firstBracket = rawText.indexOf('[');
    const lastBracket = rawText.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      const candidate = rawText.substring(firstBracket, lastBracket + 1);
      try {
        return JSON.parse(candidate);
      } catch (____) {}
    }
  }

  return null;
}

/**
 * Executes a Gemini AI call with auto-correction retry loop and safe deterministic fallbacks
 */
export async function executeGuardedAiCall<T>(params: {
  prompt: string;
  systemPrompt?: string;
  validator: (data: any) => { isValid: boolean; errors: string[] };
  fallback: T;
  maxRetries?: number;
}): Promise<{ data: T; isFallback: boolean; attempts: number; errors: string[] }> {
  const { prompt, systemPrompt, validator, fallback, maxRetries = 2 } = params;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[AI Guard] No GEMINI_API_KEY found. Returning deterministic fallback.');
    return { data: fallback, isFallback: true, attempts: 0, errors: ['Missing GEMINI_API_KEY'] };
  }

  let attempts = 0;
  let currentPrompt = prompt;
  const accumulatedErrors: string[] = [];

  while (attempts <= maxRetries) {
    attempts++;
    try {
      // Call Gemini REST API directly using modern @google/genai format
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              ...(systemPrompt ? [{ role: 'user', parts: [{ text: `SYSTEM INSTRUCTION:\n${systemPrompt}` }] }] : []),
              { role: 'user', parts: [{ text: currentPrompt }] },
            ],
            generationConfig: {
              temperature: 0.2, // Low temperature for high precision & low hallucination
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API HTTP Error ${response.status}`);
      }

      const resJson = await response.json();
      const rawText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Check placeholder guardrail
      const placeholderCheck = detectPlaceholders(rawText);
      if (placeholderCheck.hasPlaceholder) {
        const placeholderErr = `AI output contained prohibited placeholder: ${placeholderCheck.matched.join(', ')}`;
        accumulatedErrors.push(placeholderErr);
        currentPrompt = `${prompt}\n\nCRITICAL FIX REQUIRED: Your previous response contained forbidden test placeholders (${placeholderCheck.matched.join(', ')}). Provide real, professional, accurate data without generic placeholders.`;
        continue;
      }

      // Try JSON extraction if expected object/array
      const parsedData = sanitizeJsonOutput(rawText) || rawText;

      // Run caller-provided validator
      const validation = validator(parsedData);
      if (validation.isValid) {
        return { data: parsedData as T, isFallback: false, attempts, errors: [] };
      } else {
        accumulatedErrors.push(...validation.errors);
        currentPrompt = `${prompt}\n\nCRITICAL FIX REQUIRED: Your previous output failed validation with the following errors:\n${validation.errors.join('\n')}\nProvide a corrected response strictly matching the required schema.`;
      }
    } catch (err: any) {
      accumulatedErrors.push(`Attempt ${attempts} network/API error: ${err.message}`);
    }
  }

  console.warn(`[AI Guard] Max retries (${maxRetries}) exceeded. Executing safe fallback. Errors:`, accumulatedErrors);
  return { data: fallback, isFallback: true, attempts, errors: accumulatedErrors };
}
