import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createOrder, getOrderById } from './ledger';

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'expired' | 'converted';

export interface QuotationLineItem {
  description: string;
  quantity: number;
  unitPriceNgn: number;
  lineTotalNgn: number;
}

export interface QuotationRecord {
  id: string;
  quoteReference: string;
  tenantId: string;
  customerName: string;
  customerEmail?: string;
  customerWhatsapp?: string;
  title: string;
  lineItems: QuotationLineItem[];
  subtotalNgn: number;
  discountNgn: number;
  totalNgn: number;
  validUntil: string;
  status: QuotationStatus;
  convertedOrderId?: string;
  convertedOrderReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const QUOTES_PATH = path.join(process.cwd(), 'local_db', 'commerce_quotations.json');

function readQuotes(): QuotationRecord[] {
  try {
    if (fs.existsSync(QUOTES_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(QUOTES_PATH, 'utf8'));
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {}
  return [];
}

function writeQuotes(quotes: QuotationRecord[]): void {
  try {
    const dir = path.dirname(QUOTES_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(QUOTES_PATH, JSON.stringify(quotes, null, 2), 'utf8');
  } catch {}
}

export function listQuotations(tenantId?: string): QuotationRecord[] {
  const all = readQuotes();
  if (!tenantId) return all;
  return all.filter((q) => q.tenantId === tenantId);
}

export function createQuotation(input: {
  tenantId?: string;
  customerName: string;
  customerEmail?: string;
  customerWhatsapp?: string;
  title: string;
  lineItems: Array<{ description: string; quantity: number; unitPriceNgn: number }>;
  discountNgn?: number;
  validDays?: number;
  notes?: string;
}): QuotationRecord {
  const lineItems: QuotationLineItem[] = input.lineItems.map((li) => {
    const qty = Math.max(1, Math.floor(Number(li.quantity) || 1));
    const unitPriceNgn = Math.max(0, Math.round(Number(li.unitPriceNgn) || 0));
    return {
      description: String(li.description || 'Service Item').trim(),
      quantity: qty,
      unitPriceNgn,
      lineTotalNgn: qty * unitPriceNgn,
    };
  });

  const subtotalNgn = lineItems.reduce((sum, li) => sum + li.lineTotalNgn, 0);
  const discountNgn = Math.max(0, Math.min(subtotalNgn, Math.round(Number(input.discountNgn) || 0)));
  const totalNgn = Math.max(0, subtotalNgn - discountNgn);
  const validDays = Math.max(1, Math.floor(Number(input.validDays) || 14));
  const now = new Date();
  const validUntil = new Date(now.getTime() + validDays * 24 * 60 * 60 * 1000).toISOString();

  const record: QuotationRecord = {
    id: crypto.randomUUID(),
    quoteReference: `QT-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
    tenantId: input.tenantId || 'bethelmind_internal',
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail?.trim(),
    customerWhatsapp: input.customerWhatsapp?.trim(),
    title: input.title.trim(),
    lineItems,
    subtotalNgn,
    discountNgn,
    totalNgn,
    validUntil,
    status: 'sent',
    notes: input.notes?.trim(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  const list = readQuotes();
  list.unshift(record);
  writeQuotes(list.slice(0, 500));
  return record;
}

export async function convertQuotationToOrder(quoteId: string, tenantId?: string) {
  const list = readQuotes();
  const idx = list.findIndex((q) => q.id === quoteId && (!tenantId || q.tenantId === tenantId));
  if (idx === -1) return null;

  const quote = list[idx];
  if (quote.convertedOrderId) {
    const existingOrder = getOrderById(quote.convertedOrderId);
    return { quotation: quote, order: existingOrder };
  }

  const depositAmountNgn = Math.round(quote.totalNgn * 0.6);
  const balanceAmountNgn = Math.max(0, quote.totalNgn - depositAmountNgn);
  const orderReference = `BM-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

  const order = await createOrder({
    orderReference,
    division: 'digital_business_solutions',
    packageName: quote.title,
    totalAmountNgn: quote.totalNgn,
    depositAmountNgn,
    balanceAmountNgn,
    amountPaidNgn: 0,
    currency: 'NGN',
    paymentStage: 'deposit',
    paymentStatus: 'pending',
    fulfilmentStatus: 'pending',
    paymentProvider: 'moniepoint',
    metadata: {
      tenantId: quote.tenantId,
      quoteReference: quote.quoteReference,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerWhatsapp: quote.customerWhatsapp,
      lineItems: quote.lineItems,
    },
  });

  quote.status = 'converted';
  quote.convertedOrderId = order.id;
  quote.convertedOrderReference = order.orderReference;
  quote.updatedAt = new Date().toISOString();
  writeQuotes(list);

  return { quotation: quote, order };
}

export function buildPaymentReminderMessage(params: {
  customerName: string;
  orderReference: string;
  outstandingNgn: number;
}): string {
  return `Hello ${params.customerName}, friendly reminder regarding Order ${params.orderReference}: your outstanding balance is ₦${Math.round(params.outstandingNgn).toLocaleString('en-NG')}. You can complete settlement via Paystack or Moniepoint (6805375225 — Bethelmind Digital Solutions). Reply here with your receipt once done.`;
}
