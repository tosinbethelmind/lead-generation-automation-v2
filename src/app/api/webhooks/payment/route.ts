import { NextRequest, NextResponse } from 'next/server';
import { generatePostPaymentSolarReferralMessage } from '../../../../../scripts/regular_business_outreach';
import { createHmac } from 'crypto';
import { safeCompareStrings } from '@/lib/security';

/**
 * Payment Webhook Handler
 * Triggers post-payment onboarding when a regular business lead purchases/claims a website.
 * Dispatches the SolarQuotePro.ng Free Energy Audit & Installer Matching referral.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY || process.env.PAYMENT_WEBHOOK_SECRET;
    const signatureHeader = req.headers.get('x-paystack-signature');

    if (paystackSecret) {
      if (!signatureHeader) {
        console.error('❌ [Payment Webhook Error]: Missing x-paystack-signature header');
        return NextResponse.json({ error: 'Missing signature header' }, { status: 401 });
      }

      const expectedSignature = createHmac('sha512', paystackSecret).update(rawBody).digest('hex');
      if (!safeCompareStrings(signatureHeader, expectedSignature)) {
        console.error('❌ [Payment Webhook Error]: Invalid signature verification');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
      console.log('✅ [Payment Webhook]: HMAC Signature verified successfully.');
    }

    const body = JSON.parse(rawBody);

    const {
      event,
      data
    } = body;

    // Support Paystack / Flutterwave / Custom payment events
    const companyName = data?.metadata?.company_name || data?.customer?.name || 'Valued Client';
    const email = data?.customer?.email || data?.email || '';
    const phone = data?.customer?.phone || data?.phone || '';
    const city = data?.metadata?.city || 'Lagos';

    console.log(`💳 [Payment Webhook] Payment received for: ${companyName} (${email})`);

    // Generate post-payment solar referral message
    const solarReferral = generatePostPaymentSolarReferralMessage({
      company_name: companyName,
      city: city,
      email: email,
      phone: phone
    });

    console.log(`⚡ [Post-Payment Trigger] Solar Referral Generated:`, solarReferral.calculator_url);

    return NextResponse.json({
      success: true,
      message: 'Payment recorded and Post-Payment Solar Referral onboarding dispatched.',
      company_name: companyName,
      post_payment_referral_url: solarReferral.calculator_url
    });
  } catch (error: any) {
    console.error('❌ [Payment Webhook Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
