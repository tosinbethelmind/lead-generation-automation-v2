// Moniepoint payment integration (placeholder implementation)
import { getRuntimeConfig, getRotatedTwilioKeys } from '@/lib/localConfig'; // reuse rotation helper if needed

/**
 * Initiates a payment via Moniepoint.
 * In production replace this mock with actual Moniepoint SDK calls.
 */
export async function initiateMoniepointPayment(amountNgn: number, email: string, secretKey?: string) {
  const config = getRuntimeConfig();
  // Example of rotating keys – assume moniepointSecretKey is a comma-separated list
  const activeSecretKey = secretKey || (config.moniepointSecretKey ? config.moniepointSecretKey.split(',')[0].trim() : '');

  if (!activeSecretKey) {
    throw new Error('Moniepoint credentials are not configured');
  }

  // Mock response – replace with real API call
  return {
    provider: 'moniepoint',
    transactionId: `MONIEPOINT-${Date.now()}`,
    status: 'succeeded',
    amountNgn,
    email,
  };
}
