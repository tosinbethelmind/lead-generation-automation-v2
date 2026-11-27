import { NextRequest, NextResponse } from 'next/server';
import { initializeCheckout } from '@/lib/commerce/paymentOrchestrator';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import { findBundledLead, sanitizeDisplayName } from '@/lib/leadsBundle';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      leadId,
      productId,
      email,
      name,
      whatsapp,
      paymentStage,
      selectedFeatures,
      customInstructions,
      publicKey,
      upgradeStrategy,
    } = body;

    if (!email || !name || (!leadId && !productId)) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, and leadId or productId' },
        { status: 400 }
      );
    }

    let companyName = name;
    if (leadId) {
      let lead: any = findBundledLead(leadId);
      if (!lead) {
        try {
          const repo = getActiveLeadRepository();
          lead = await repo.getLeadById(leadId);
        } catch {}
      }
      if (lead) {
        companyName = sanitizeDisplayName(lead.name, lead.category);
      }
    }

    // Map legacy upgradeStrategy to Division 1 catalog product if productId not explicitly passed
    const resolvedProductId =
      productId ||
      (upgradeStrategy === 'full_turnkey' ? 'dbs-professional-website' : 'dbs-business-launch');

    const origin = new URL(req.url).origin;
    const result = await initializeCheckout({
      productId: resolvedProductId,
      customerName: name,
      customerEmail: email,
      customerWhatsapp: whatsapp,
      companyName,
      leadId,
      paymentStage: paymentStage || 'deposit',
      paymentProvider: 'paystack',
      callbackOrigin: origin,
      publicKey,
      metadata: {
        selectedFeatures: selectedFeatures || [],
        customInstructions: customInstructions || '',
        upgradeStrategy: upgradeStrategy || 'business_launch',
      },
    });

    return NextResponse.json({
      success: true,
      authorization_url: result.authorizationUrl,
      reference: result.orderReference,
      amountDueNgn: result.amountDueNgn,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Paystack initialization failed' },
      { status: 400 }
    );
  }
}
