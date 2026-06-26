// Central payment processing wrapper
import { verifyPaystackPayment } from './paystack';
// Placeholder imports for other providers (to be implemented later)
// import { initiateFlutterwave, verifyFlutterwave } from './flutterwave';
// import { initiateMoniepoint, verifyMoniepoint } from './moniepoint';

type PaymentMethod = 'paystack' | 'flutterwave' | 'moniepoint' | 'opay' | 'manual';

interface ProcessPaymentParams {
  method?: PaymentMethod; // defaults to paystack
  amountNgn: number;
  email: string;
  publicKey?: string; // for Paystack or Opay
  secretKey?: string; // for server verification if needed
}

export async function processPayment({ method = 'paystack', amountNgn, email, publicKey, secretKey }: ProcessPaymentParams) {
  if (method === 'paystack') {
    if (!publicKey) throw new Error('Paystack publicKey is required');
    // Simulate Paystack verification (replace with real SDK call in production)
    const result = await verifyPaystackPayment({ publicKey, email, amountNgn });
    return result;
  }
  if (method === 'opay') {
    // Mock Opay processing - in production replace with actual Opay SDK integration
    if (!publicKey) throw new Error('Opay publicKey is required');
    // Simulate a successful transaction result
    return {
      provider: 'opay',
      transactionId: `OPAY-${Date.now()}`,
      status: 'succeeded',
      raw: { amount: amountNgn, email }
    };
  }
  // Future implementations:
  // if (method === 'flutterwave') { /* ... */ }
  // if (method === 'moniepoint') { /* ... */ }
  throw new Error(`Payment method ${method} not implemented yet`);
}

export type { PaymentMethod };
