import { BRAND_IDENTITY } from '@/lib/commerce/catalog';

/**
 * Moniepoint corporate bank transfer fallback details.
 * Manual transfers are NEVER auto-fulfilled; they require admin confirmation via /api/commerce/orders.
 */
export function getMoniepointFallbackDetails(orderReference: string, amountNgn: number) {
  return {
    provider: 'moniepoint' as const,
    bankName: BRAND_IDENTITY.settlementBank,
    accountNumber: BRAND_IDENTITY.settlementAccountNumber,
    accountName: BRAND_IDENTITY.settlementAccountName,
    narration: orderReference,
    amountNgn,
    requiresManualVerification: true,
  };
}
