// src/app/api/config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';

/**
 * GET returns the current runtime configuration (excluding sensitive fields).
 * POST expects a JSON body with any subset of RuntimeConfig fields to merge and persist.
 */
export async function GET(_req: NextRequest) {
  const config = getRuntimeConfig();
  // Omit sensitive API keys before sending to client
  const { geminiApiKey, geminiApiKeys, claudeApiKey, openaiApiKey, antigravityApiKey, interswitchAccount, interswitchApiKey, ...publicConfig } = config as any;
  return NextResponse.json(publicConfig);
}

export async function POST(req: NextRequest) {
  try {
    const updates = await req.json();
    // Allow updating of gemini keys and interswitch credentials explicitly
    const newConfig = saveLocalConfig(updates);
    return NextResponse.json({ success: true, config: newConfig });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
