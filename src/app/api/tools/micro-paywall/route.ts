/**
 * @file src/app/api/tools/micro-paywall/route.ts
 * 
 * Programmatic Micro-SaaS Instant Paywall Gatekeeper (₦2,500 Impulse Unlocks).
 * 
 * Handles micro-payments for browser tools:
 * 1. Solar Inverter & Battery Load Calculator PDF
 * 2. Lekki Land Cadastral Coordinate Audit PDF
 * 3. SCUML Bank Compliance Error Auditor
 * 4. Customs Duty VIN SGD Sizer
 */

import { NextRequest, NextResponse } from 'next/server';

export interface MicroToolConfig {
  toolId: string;
  name: string;
  priceNGN: number;
  selarUrl: string;
  deliverable: string;
}

const MICRO_TOOLS: Record<string, MicroToolConfig> = {
  'solar-calculator-pdf': {
    toolId: 'solar-calculator-pdf',
    name: 'Certified Solar Load & Inverter Sizing Engineering Report (PDF)',
    priceNGN: 2500,
    selarUrl: 'https://selar.com/showlove/bethelmind?currency=NGN&item=solar-calculator-pdf&amount=2500',
    deliverable: 'Instant 4-page timestamped engineering calculation certificate.'
  },
  'land-cadastral-pdf': {
    toolId: 'land-cadastral-pdf',
    name: 'Lagos Coastal Highway Cadastral Beacon GPS Satellite Plot (PDF)',
    priceNGN: 3500,
    selarUrl: 'https://selar.com/showlove/bethelmind?currency=NGN&item=land-cadastral-pdf&amount=3500',
    deliverable: 'GPS coordinate overlay report verifying demolition right-of-way buffer.'
  },
  'scuml-audit-pass': {
    toolId: 'scuml-audit-pass',
    name: 'SCUML Document Rejection Diagnostic & Auto-Formatter Pass',
    priceNGN: 2500,
    selarUrl: 'https://selar.com/showlove/bethelmind?currency=NGN&item=scuml-audit-pass&amount=2500',
    deliverable: 'Pre-check compliance score before uploading to EFCC SCUML portal.'
  }
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const toolId = searchParams.get('tool') || 'solar-calculator-pdf';
  const config = MICRO_TOOLS[toolId] || MICRO_TOOLS['solar-calculator-pdf'];

  return NextResponse.json({
    success: true,
    tool: config,
    checkoutLink: config.selarUrl,
    instantUnlock: true
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolId, customerPhone, customerEmail } = body;
    const tool = MICRO_TOOLS[toolId] || MICRO_TOOLS['solar-calculator-pdf'];

    return NextResponse.json({
      success: true,
      message: `Micro-paywall initialized for ${tool.name}`,
      checkoutUrl: tool.selarUrl,
      priceNGN: tool.priceNGN
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
