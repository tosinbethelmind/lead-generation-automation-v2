import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig } from '@/lib/localConfig';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import { calculateLeadClaimFee } from '@/lib/pricing';
import { initiateOPay } from '@/lib/payments/opay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      leadId,
      email,
      name,
      theme,
      copy,
      selectedFeatures,
      customInstructions,
      publicKey,
      upgradeStrategy,
    } = body;

    if (!leadId || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, email, or name' },
        { status: 400 }
      );
    }

    const config = getRuntimeConfig();

    const opayPublic = config.opayPublicKey || '';
    const publicKeys = opayPublic.split(',').map((k) => k.trim()).filter(Boolean);
    const opaySecret = config.opaySecretKey || '';
    const secretKeys = opaySecret.split(',').map((k) => k.trim()).filter(Boolean);
    const opayMerchant = config.opayMerchantId || '';
    const merchantIds = opayMerchant.split(',').map((id) => id.trim()).filter(Boolean);

    const index = publicKey === 'mock' ? -1 : publicKeys.indexOf(publicKey);
    const secretKey = index !== -1 ? secretKeys[index] : (publicKey === 'mock' ? 'mock' : (secretKeys[0] || 'mock'));
    const merchantId = index !== -1 ? merchantIds[index] : (publicKey === 'mock' ? 'mock' : (merchantIds[0] || 'mock'));

    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(leadId);
    if (!lead) {
      return NextResponse.json({ error: `Lead with ID ${leadId} not found` }, { status: 404 });
    }

    // Assign chosen strategy and features in-memory for correct pricing
    if (upgradeStrategy) {
      lead.upgrade_strategy = upgradeStrategy;
      lead.upgradeStrategy = upgradeStrategy;
    }
    if (selectedFeatures) {
      lead.plugin_suggestions = selectedFeatures;
      lead.pluginSuggestions = selectedFeatures;
    }

    const feeNGN = calculateLeadClaimFee(lead, config);

    if (feeNGN <= 0) {
      return NextResponse.json(
        { error: 'Setup Claim Fee is set to 0 or not configured. Payment not required.' },
        { status: 400 }
      );
    }

    const origin = new URL(req.url).origin;
    const reference = `OPAY-${Math.floor(100000 + Math.random() * 900000)}-${Date.now()}`;
    const returnUrl = `${origin}/preview/${leadId}?payment=verifying&gateway=opay&reference=${reference}`;
    const callbackUrl = returnUrl;

    const opayResult = await initiateOPay({
      publicKey: publicKey || 'mock',
      merchantId,
      amountNgn: feeNGN,
      email,
      name,
      txRef: reference,
      callbackUrl,
      returnUrl,
      leadId,
    });

    return NextResponse.json({
      success: true,
      authorization_url: opayResult.cashierUrl,
      reference: opayResult.reference,
    });
  } catch (err: any) {
    console.error('OPay initialization error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
