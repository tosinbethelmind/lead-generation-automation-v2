/**
 * Paystack payment integration wrapper.
 * This module abstracts Paystack SDK usage for the lead generation platform.
 * It exposes two main functions:
 *  - `initializePaystack(publicKey: string)`: loads the Paystack inline script and configures the public key.
 *  - `verifyTransaction(reference: string, secretKey: string)`: server‑side verification of a transaction using Paystack's REST API.
 */

/**
 * Dynamically load the Paystack inline script.
 * The script is only added once per page.
 */
export const initializePaystack = (publicKey: string): void => {
  if (typeof window === 'undefined') return;
  // Avoid loading script multiple times
  if (document.getElementById('paystack-js')) return;
  const script = document.createElement('script');
  script.id = 'paystack-js';
  script.src = 'https://js.paystack.co/v1/inline.js';
  script.async = true;
  script.onload = () => {
    // @ts-ignore – Paystack injects a global `PaystackPop` object
    (window as any).PaystackPop.setup({ key: publicKey });
  };
  document.body.appendChild(script);
};

/**
 * Verify a Paystack transaction on the server side.
 * It calls Paystack's `/transaction/verify/:reference` endpoint.
 *
 * @param reference The transaction reference returned by Paystack after checkout.
 * @param secretKey Your Paystack secret key (keep server‑side!).
 * @returns The JSON response from Paystack containing transaction details.
 */
export const verifyTransaction = async (
  reference: string,
  secretKey: string
): Promise<any> => {
  const url = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? 'Paystack verification failed');
  }
  return response.json();
};

/**
 * Simulate or mock Paystack payment verification.
 */
export const verifyPaystackPayment = async (params: {
  publicKey: string;
  email: string;
  amountNgn: number;
}): Promise<any> => {
  return {
    provider: 'paystack',
    transactionId: `PAYSTACK-${Date.now()}`,
    status: 'succeeded',
    raw: params
  };
};
