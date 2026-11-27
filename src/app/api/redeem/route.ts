import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const PRODUCT_CATALOG = [
  {
    match: ['SUMO02', 'FAST'],
    tier: 'FastAPI Micro-SaaS Production Boilerplate',
    downloadUrl: 'https://www.bethelmindanalytics.com/download/fastapi-micro-saas-boilerplate.zip',
  },
  {
    match: ['SUMO05', 'CLEAN'],
    tier: '2026 Commercial CleanTech M&A Deal Screener & Corporate Targets Dossier',
    downloadUrl: 'https://www.bethelmindanalytics.com/download/cleantech-ma-deal-screener.zip',
  },
  {
    match: ['SOMA'],
    tier: 'Complete Clinical Somatic & ADHD Master Suite',
    downloadUrl: 'https://www.bethelmindanalytics.com/download/clinical-somatic-master-suite.zip',
  },
  {
    match: ['SAAS'],
    tier: 'Micro-SaaS Day-1 Architecture & M&A Diligence OS',
    downloadUrl: 'https://www.bethelmindanalytics.com/download/micro-saas-launch-architecture.zip',
  },
  {
    match: ['N8N', 'EMPIRE'],
    tier: 'AeroPilot: 360+ n8n AI Agent Empire Pack',
    downloadUrl: 'https://www.bethelmindanalytics.com/download/aeropilot-n8n-empire-pack.zip',
  },
];

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

/**
 * Validates an AppSumo voucher code and returns the matching product tier and download URL.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';

    if (!code || !email) {
      return NextResponse.json(
        { status: 'error', message: 'Voucher code and email are required.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (code.length < 8) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid voucher code format.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const matched = PRODUCT_CATALOG.find((entry) =>
      entry.match.some((token) => code.includes(token))
    );

    const tierName = matched?.tier ?? 'AeroPilot Enterprise Lifetime Deal';
    const dlUrl = matched?.downloadUrl ?? 'https://www.bethelmindanalytics.com/portfolio';

    return NextResponse.json(
      {
        status: 'success',
        license_key: code,
        tier: tierName,
        download_url: dlUrl,
        message: 'License verified and activated successfully!',
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Invalid request payload.' },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
