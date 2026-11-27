import { NextRequest, NextResponse } from 'next/server';
import { resolveAdminRequest } from '@/lib/commerce/adminAuth';
import { retryOpenFulfilmentExceptions } from '@/lib/commerce/paymentOrchestrator';
import { getDueMaintenanceSubscriptions } from '@/lib/commerce/ledger';
import { safeCompareStrings } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const cronSecret = (process.env.CRON_SECRET || '').trim();
  const authHeader = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  const isCronAuthorized = Boolean(cronSecret && authHeader && safeCompareStrings(authHeader, cronSecret));

  if (!isCronAuthorized) {
    const admin = await resolveAdminRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  const retryResult = await retryOpenFulfilmentExceptions();
  const dueSubscriptions = getDueMaintenanceSubscriptions(3);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    exceptionsRetried: retryResult,
    dueMaintenanceRenewalsCount: dueSubscriptions.length,
    dueSubscriptions: dueSubscriptions.map((s) => ({
      id: s.id,
      orderId: s.orderId,
      monthlyFeeNgn: s.monthlyFeeNgn,
      nextBillingDate: s.nextBillingDate,
    })),
  });
}
