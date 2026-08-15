/**
 * @file src/app/api/outreach/regular-business/route.ts
 * API Route for Track B: Regular Business Website Pitch + Post-Payment Solar Referral
 * Runs on Vercel cron (10:00 WAT daily) or via manual POST trigger.
 */

import { NextRequest, NextResponse } from 'next/server';
import { classifyLead } from '../../../../lib/leadClassifier';

const SOLAR_CALCULATOR_BASE = 'https://solarquotepro.ng/calculator';

function buildRegularBusinessPayload(lead: {
  company_name?: string;
  name?: string;
  city?: string;
  category?: string;
  email?: string;
  phone?: string;
  id?: string;
}) {
  const companyName = lead.company_name || lead.name || 'Your Business';
  const city = lead.city || 'Lagos';
  const category = lead.category || 'Business';
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const leadId = lead.id || `REGULAR_${Date.now()}`;

  return {
    lead_id: leadId,
    company_name: companyName,
    city,
    category,
    pitch_type: 'REGULAR_WEBSITE_AI_PORTAL',
    pre_payment: {
      website_preview_url: `https://www.bethelmindanalytics.com/preview/${slug}?src=10k_lagos`,
      claim_url: `https://www.bethelmindanalytics.com/claim?biz=${encodeURIComponent(companyName)}&id=${leadId}`
    },
    post_payment: {
      dashboard_url: `https://www.bethelmindanalytics.com/client/dashboard?biz=${encodeURIComponent(companyName)}`,
      message: `🎉 Your website for ${companyName} is now LIVE! Access your 24/7 AI lead and booking dashboard at https://www.bethelmindanalytics.com/client/dashboard.`
    },
    generated_at: new Date().toISOString()
  };
}

// GET: Status + health check
export async function GET(req: NextRequest) {
  const isCron = req.nextUrl.searchParams.get('cron') === 'true';
  return NextResponse.json({
    engine: 'regular-business-outreach',
    description: 'Track B: Regular Business Website Pitch + Post-Payment Solar Referral',
    status: 'active',
    trigger: isCron ? 'cron' : 'manual',
    schedule: '10:00 WAT daily',
    pitch_phases: [
      'Phase 1 (Pre-Payment): Custom Business Website Preview & Claim',
      'Phase 2 (Post-Payment): SolarQuotePro.ng Free Energy Audit & Installer Matching Referral'
    ]
  });
}

// POST: Trigger outreach for a specific lead
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lead, phase } = body;

    if (!lead) {
      return NextResponse.json({ error: 'Missing lead object in request body' }, { status: 400 });
    }

    const classified = classifyLead(lead);

    if (classified.campaign_track !== 'REGULAR_BUSINESS_WEBSITE') {
      return NextResponse.json({
        success: false,
        message: 'Lead classified as solar company. Use /api/outreach/solar-hybrid instead.',
        campaign_track: classified.campaign_track
      }, { status: 422 });
    }

    const payload = buildRegularBusinessPayload(lead);

    // Return only the relevant phase payload if specified
    if (phase === 'post_payment') {
      return NextResponse.json({
        success: true,
        message: 'Post-Payment Solar Referral payload generated.',
        phase: 'post_payment',
        payload: payload.post_payment
      });
    }

    console.log(`[Regular Business Outreach] Generated payload for: ${payload.company_name}`);

    return NextResponse.json({
      success: true,
      message: 'Regular Business Website + Post-Payment Solar Referral payload generated.',
      payload,
      classification: {
        track: classified.campaign_track,
        reason: classified.classification_reason,
        confidence: classified.classification_confidence
      }
    });
  } catch (error: any) {
    console.error('[Regular Business Outreach Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
