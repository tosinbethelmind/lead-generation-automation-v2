import { NextRequest, NextResponse } from 'next/server';
import {
  recordWhatsAppConsent,
  getWhatsAppConsentStatus,
  logWhatsAppAudit,
} from '@/lib/commerce/whatsappCompliance';

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone') || '';
  if (!phone) {
    return NextResponse.json({ success: false, error: 'phone parameter required' }, { status: 400 });
  }
  return NextResponse.json({
    success: true,
    phone,
    consentStatus: getWhatsAppConsentStatus(phone),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, action, name } = body;

    if (!phone || !['opt_in', 'opt_out'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'phone and action (opt_in | opt_out) are required' },
        { status: 400 }
      );
    }

    const status = action === 'opt_in' ? 'opted_in' : 'opted_out';
    const result = await recordWhatsAppConsent(phone, status, name);

    await logWhatsAppAudit({
      phoneE164: phone,
      direction: 'inbound',
      provider: 'meta_cloud',
      messageType: 'consent_update',
      contentSummary: `Customer ${status} via compliance endpoint`,
      optInVerified: status === 'opted_in',
      status: 'recorded',
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Compliance update failed' }, { status: 500 });
  }
}
