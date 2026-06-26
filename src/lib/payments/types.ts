export type PaymentProvider = 'paystack' | 'flutterwave' | 'moniepoint' | 'opay' | 'manual';

export interface PaymentConfig {
  publicKey?: string;
  secretKey?: string;
}

export interface ProcessPaymentParams {
  amountNgn: number;
  email: string;
  provider?: PaymentProvider;
  reference: string;
  config?: PaymentConfig;
}

export interface PaymentResult {
  provider: PaymentProvider;
  transactionId: string;
  status: 'pending' | 'succeeded' | 'failed';
  raw: any;
}

export interface PromotionalCopy {
  leadId: string;
  templateId: string;
  copy: string;
  createdAt: Date;
}
