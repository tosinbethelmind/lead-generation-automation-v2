// src/lib/payments/moniepoint.ts
/**
 * Moniepoint payment integration placeholder.
 * Provides functions to initialize Moniepoint (if needed) and verify a transaction.
 */

export interface MoniepointInitParams {
  publicKey: string; // Moniepoint public key (if applicable)
  amountNgn: number;
  email: string;
  txRef: string; // transaction reference
}

/**
 * Initiates a Moniepoint payment (placeholder).
 * In a real implementation this would load Moniepoint's SDK or redirect to checkout.
 */
export const initiateMoniepoint = async (params: MoniepointInitParams): Promise<{ reference: string }> => {
  const reference = `MP-${Math.floor(100000 + Math.random() * 900000)}`;
  console.log('Moniepoint payment initiated', { ...params, reference });
  // Simulate async delay
  await new Promise((res) => setTimeout(res, 500));
  return { reference };
};

/**
 * Verifies a Moniepoint transaction on the server side.
 */
export const verifyMoniepoint = async (reference: string, secretKey: string): Promise<any> => {
  const url = `https://sandbox.moniepoint.com/api/v1/transactions/verify/${encodeURIComponent(reference)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? 'Moniepoint verification failed');
  }
  return response.json();
};
