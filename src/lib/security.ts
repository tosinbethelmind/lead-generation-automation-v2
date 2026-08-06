import { NextResponse } from "next/server";

// In-memory sliding window rate limiter for API routes
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(identifier: string, limit: number = 30, windowMs: number = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier) || { count: 0, lastReset: now };

  if (now - record.lastReset > windowMs) {
    record.count = 1;
    record.lastReset = now;
  } else {
    record.count += 1;
  }

  rateLimitMap.set(identifier, record);

  const allowed = record.count <= limit;
  const remaining = Math.max(0, limit - record.count);

  return { allowed, remaining };
}

export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function createSafeResponse(data: unknown, status: number = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    { error: message, status },
    {
      status,
      headers: {
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
