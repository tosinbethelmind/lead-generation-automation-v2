/**
 * Paystack payment integration wrapper.
 * Server-side verification ONLY — zero mock success stubs.
 */
export const initializePaystack = (publicKey: string): void => {
  if (typeof window === 'undefined') return;
  if (document.getElementById('paystack-js')) return;
  const script = document.createElement('script');
  script.id = 'paystack-js';
  script.src = 'https://js.paystack.co/v1/inline.js';
  script.async = true;
  script.onload = () => {
    (window as any).PaystackPop?.setup({ key: publicKey });
  };
  document.body.appendChild(script);
};

export const verifyTransaction = async (
  reference: string,
  secretKey: string
): Promise<any> => {
  if (!secretKey || !secretKey.startsWith('sk_')) {
    throw new Error('Valid Paystack secretKey is required');
  }
  const url = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message ?? 'Paystack verification failed');
  }
  return data;
};
