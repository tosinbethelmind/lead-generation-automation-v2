import crypto from 'crypto';

export interface OPayInitParams {
  publicKey: string;
  merchantId: string;
  amountNgn: number;
  email: string;
  name: string;
  txRef: string;
  callbackUrl: string;
  returnUrl: string;
  leadId: string;
}

/**
 * Initiates an OPay cashier checkout payment.
 * Requests a cashierUrl redirect from OPay.
 */
export const initiateOPay = async (
  params: OPayInitParams
): Promise<{ reference: string; cashierUrl: string }> => {
  const { publicKey, merchantId, amountNgn, email, name, txRef, callbackUrl, returnUrl, leadId } = params;

  if (publicKey === 'mock' || !publicKey || merchantId === 'mock' || !merchantId) {
    console.log('Using mock OPay initialization fallback');
    return {
      reference: txRef,
      cashierUrl: returnUrl,
    };
  }

  const isTest = publicKey.toLowerCase().includes('test') || publicKey.toLowerCase().includes('sandbox');
  const baseUrl = isTest ? 'https://testapi.opaycheckout.com' : 'https://api.opaycheckout.com';
  const url = `${baseUrl}/api/v1/international/cashier/create`;

  const payload = {
    country: 'NG',
    reference: txRef,
    amount: {
      total: Math.round(amountNgn),
      currency: 'NGN',
    },
    returnUrl,
    callbackUrl,
    product: {
      name: 'Website Setup & Claim Fee',
      description: `Claiming lead website ${leadId}`,
    },
    userInfo: {
      userEmail: email,
      userId: leadId,
      userName: name,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${publicKey}`,
      MerchantId: merchantId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || result.code !== '00000') {
    throw new Error(result.message || 'OPay checkout creation failed');
  }

  return {
    reference: result.data.reference,
    cashierUrl: result.data.cashierUrl,
  };
};

/**
 * Verifies an OPay cashier transaction status using HMAC-SHA512 signature authentication.
 */
export const verifyOPay = async (
  reference: string,
  secretKey: string,
  merchantId: string
): Promise<any> => {
  const isTest = secretKey.toLowerCase().includes('test') || secretKey.toLowerCase().includes('sandbox');
  const baseUrl = isTest ? 'https://testapi.opaycheckout.com' : 'https://api.opaycheckout.com';
  const url = `${baseUrl}/api/v1/international/cashier/status`;

  const payload = { reference };
  // Keys sorted alphabetically; since there is only one key ('reference'), stringify is already sorted.
  const message = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha512', secretKey)
    .update(message)
    .digest('hex');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${signature}`,
      MerchantId: merchantId,
      'Content-Type': 'application/json',
    },
    body: message,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? 'OPay status verification request failed');
  }

  return response.json();
};
