/**
 * @file src/app/api/agent-reach/route.ts
 * 
 * REST API Interface for Agent-Reach No-API Multi-Platform Intelligence Layer
 * Bethelmind Analytics Commercial Growth System
 */

import { NextRequest, NextResponse } from 'next/server';
import { agentReachEngine } from '@/lib/scraping/agentReachEngine';
import { getAgentReachSectorBundles, generateBundleCsvData } from '@/lib/monetization/agentReachLeadPackager';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'doctor';

    if (action === 'bundles') {
      const bundles = getAgentReachSectorBundles();
      return NextResponse.json({
        success: true,
        data: bundles,
        total_bundles: bundles.length
      });
    }

    // Default: Run Doctor diagnostic
    const report = await agentReachEngine.runDoctor();
    return NextResponse.json({
      success: true,
      data: report
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Agent-Reach execution error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'doctor';

    if (action === 'doctor') {
      const report = await agentReachEngine.runDoctor();
      return NextResponse.json({
        success: true,
        data: report
      });
    }

    if (action === 'extract') {
      const targetUrl = body.url;
      if (!targetUrl) {
        return NextResponse.json({ success: false, error: 'url parameter is required' }, { status: 400 });
      }

      const result = await agentReachEngine.extract(targetUrl);
      return NextResponse.json({
        success: true,
        data: result
      });
    }

    if (action === 'enrich') {
      const { name, category, area, phone, website } = body;
      if (!name) {
        return NextResponse.json({ success: false, error: 'name parameter is required' }, { status: 400 });
      }

      const enriched = await agentReachEngine.enrichLeadWithAgentReach({
        name,
        category,
        area,
        phone,
        website
      });

      return NextResponse.json({
        success: true,
        data: enriched
      });
    }

    if (action === 'bundles') {
      const bundles = getAgentReachSectorBundles();
      return NextResponse.json({
        success: true,
        data: bundles,
        total_bundles: bundles.length
      });
    }

    return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Agent-Reach API processing error' },
      { status: 500 }
    );
  }
}
