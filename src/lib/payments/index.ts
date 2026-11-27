// Central payment processing wrapper — delegates to consolidated orchestrator (no mock auto-success)
import { verifyTransaction } from './paystack';

export type PaymentMethod = 'paystack' | 'selar' | 'moniepoint' | 'opay' | 'manual';

interface ProcessPaymentParams {
  method?: PaymentMethod;
  reference: string;
  secretKey?: string;
}

export async function processPayment({ method = 'paystack', reference, secretKey }: ProcessPaymentParams) {
  if (method === 'paystack') {
    if (!secretKey) throw new Error('Paystack secretKey is required for server-side verification');
    return verifyTransaction(reference, secretKey);
  }
  throw new Error(`Use /api/commerce/checkout or /api/commerce/orders for ${method} verification.`);
}
