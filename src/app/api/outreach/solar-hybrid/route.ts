/**
 * @file src/app/api/outreach/solar-hybrid/route.ts
 * API Route for Track A: Solar Company 4-in-1 Hybrid Outreach
 * Runs on Vercel cron (09:00 WAT daily) or via manual POST trigger.
 */

import { NextRequest, NextResponse } from 'next/server';
import { classifyLead } from '../../../../lib/leadClassifier';

const ENLIST_BASE = 'https://solarquotepro.ng/installers/enlist';
const PROPOSAL_URL = 'https://solarquotepro.ng/proposals/instant-builder';
const LEADS_URL = 'https://solarquotepro.ng/marketplace/leads';
const PREVIEW_BASE = 'https://solarquotepro.ng/preview';

function buildSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildSolarHybridPayload(lead: {
  company_name?: string;
  name?: string;
  city?: string;
  email?: string;
  phone?: string;
  id?: string;
}) {
  const companyName = lead.company_name || lead.name || 'Solar Company';
  const city = lead.city || 'Lagos';
  const slug = buildSlug(companyName);

  return {
    lead_id: lead.id || `SOLAR_${Date.now()}`,
    company_name: companyName,
    city,
    preview_url: `${PREVIEW_BASE}/${slug}?src=10k_ng`,
    enlist_url: `${ENLIST_BASE}?biz=${encodeURIComponent(companyName)}&city=${encodeURIComponent(city)}`,
    proposal_url: PROPOSAL_URL,
    leads_url: LEADS_URL,
    pitch_type: 'SOLAR_4IN1_HYBRID',
    generated_at: new Date().toISOString()
  };
}

// GET: Status + health check
export async function GET(req: NextRequest) {
  const isCron = req.nextUrl.searchParams.get('cron') === 'true';
  return NextResponse.json({
    engine: 'solar-hybrid-outreach',
    description: 'Track A: Solar Company 4-in-1 Hybrid Outreach (Website + Enlistment + Proposal + Leads)',
    status: 'active',
    trigger: isCron ? 'cron' : 'manual',
    schedule: '09:00 WAT daily',
    pitch_includes: [
      'Custom Solar Website Preview',
      'SolarQuotePro.ng Directory Enlistment',
      '60-Second PDF Proposal Builder',
      'Direct Lead Marketplace Access'
    ]
  });
}

// POST: Trigger outreach for a specific lead
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lead } = body;

    if (!lead) {
      return NextResponse.json({ error: 'Missing lead object in request body' }, { status: 400 });
    }

    const classified = classifyLead(lead);

    if (classified.campaign_track !== 'SOLAR_COMPANY_HYBRID') {
      return NextResponse.json({
        success: false,
        message: 'Lead not classified as SOLAR_COMPANY_HYBRID. Use /api/outreach/regular-business instead.',
        campaign_track: classified.campaign_track
      }, { status: 422 });
    }

    const payload = buildSolarHybridPayload(lead);

    console.log(`[Solar Hybrid Outreach] Generated payload for: ${payload.company_name}`);

    return NextResponse.json({
      success: true,
      message: 'Solar Company 4-in-1 Hybrid outreach payload generated.',
      payload,
      classification: {
        track: classified.campaign_track,
        reason: classified.classification_reason,
        confidence: classified.classification_confidence
      }
    });
  } catch (error: any) {
    console.error('[Solar Hybrid Outreach Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
