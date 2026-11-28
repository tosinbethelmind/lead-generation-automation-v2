import crypto from 'crypto';
import { safeCompareStrings } from '@/lib/security';
import { getRuntimeConfig, getMatchingSecretKey } from '@/lib/localConfig';
import {
  getCommercialProduct,
  calculateOrderAmounts,
  BRAND_IDENTITY,
} from '@/lib/commerce/catalog';
import {
  upsertCustomer,
  createOrder,
  getOrderByReference,
  updateOrder,
  hasProcessedWebhookEvent,
  recordTransaction,
  createProject,
  recordFulfilmentException,
  createMaintenanceSubscription,
  getOpenFulfilmentExceptions,
  markExceptionAttempt,
  type OrderRecord,
} from '@/lib/commerce/ledger';
import { generateBiExcelBuffer, generateBiPdfBuffer } from '@/lib/commerce/biReportGenerator';
import fs from 'fs';
import path from 'path';

export interface CheckoutInitInput {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp?: string;
  companyName?: string;
  leadId?: string;
  paymentStage?: 'deposit' | 'balance' | 'full';
  paymentProvider?: 'paystack' | 'moniepoint';
  selectedAddOnIds?: string[];
  affiliateCode?: string;
  callbackOrigin: string;
  publicKey?: string;
  metadata?: Record<string, any>;
}

export function verifyPaystackSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const config = getRuntimeConfig();
  const envSecret = process.env.PAYSTACK_SECRET_KEY || '';
  const rawKeys = `${config.paystackSecretKey || ''},${envSecret}`;
  const secretKeys = Array.from(new Set(rawKeys.split(',').map((k) => k.trim()).filter(Boolean)));
  if (secretKeys.length === 0) return false;

  for (const key of secretKeys) {
    const expected = crypto.createHmac('sha512', key).update(rawBody).digest('hex');
    if (safeCompareStrings(signatureHeader, expected)) {
      return true;
    }
  }
  return false;
}

export function verifySelarSignature(rawBody: string, reqHeaders: Headers): { valid: boolean; reason?: string } {
  const secret = process.env.SELAR_WEBHOOK_SECRET || '';
  if (!secret) {
    // Reject unconfigured secret in production to prevent spoofed downloads
    return { valid: false, reason: 'SELAR_WEBHOOK_SECRET is not configured on the server' };
  }
  const sig = reqHeaders.get('x-selar-signature') || reqHeaders.get('x-webhook-secret') || '';
  if (!sig) {
    return { valid: false, reason: 'Missing Selar webhook signature header' };
  }
  const expectedHmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  if (safeCompareStrings(sig, expectedHmac) || safeCompareStrings(sig, secret)) {
    return { valid: true };
  }
  return { valid: false, reason: 'Invalid Selar webhook signature' };
}

export async function initializeCheckout(input: CheckoutInitInput) {
  const product = await getCommercialProduct(input.productId);
  if (!product || !product.active) {
    throw new Error(`Product "${input.productId}" not found or inactive`);
  }

  if (product.pricingMode === 'custom_quote') {
    throw new Error('This service requires an assessment and custom quotation. Please submit an enquiry first.');
  }

  const stage = input.paymentStage || (product.depositPercent === 100 ? 'full' : 'deposit');
  const amounts = calculateOrderAmounts(product, stage, input.selectedAddOnIds || []);

  if (amounts.dueNowNgn <= 0) {
    throw new Error('Calculated payment amount must be greater than ₦0');
  }

  const customer = await upsertCustomer({
    name: input.customerName,
    email: input.customerEmail,
    whatsappNumber: input.customerWhatsapp,
    companyName: input.companyName,
    leadId: input.leadId,
  });

  const orderReference = `BMA-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const provider = input.paymentProvider || 'paystack';

  const order = await createOrder({
    orderReference,
    customerId: customer.id,
    productId: product.id,
    leadId: input.leadId,
    division: product.division,
    packageName: product.name,
    totalAmountNgn: amounts.totalAmountNgn,
    depositAmountNgn: amounts.depositAmountNgn,
    balanceAmountNgn: amounts.balanceAmountNgn,
    amountPaidNgn: 0,
    currency: 'NGN',
    paymentStage: stage,
    paymentStatus: provider === 'moniepoint' ? 'pending_manual_verification' : 'pending',
    fulfilmentStatus: 'pending',
    paymentProvider: provider,
    transactionReference: orderReference,
    affiliateCode: input.affiliateCode,
    metadata: {
      customerName: customer.name,
      customerEmail: customer.email,
      customerWhatsapp: customer.whatsappNumber,
      companyName: customer.companyName,
      fulfilmentType: product.fulfilmentType,
      selectedAddOns: amounts.selectedAddOns.map((a) => a.name),
      recurringMonthlyNgn: amounts.recurringMonthlyNgn,
      ...(input.metadata || {}),
    },
  });

  if (provider === 'moniepoint') {
    return {
      success: true,
      provider: 'moniepoint' as const,
      orderReference: order.orderReference,
      packageName: product.name,
      totalAmountNgn: amounts.totalAmountNgn,
      amountDueNgn: amounts.dueNowNgn,
      balanceAmountNgn: amounts.balanceAmountNgn,
      recurringMonthlyNgn: amounts.recurringMonthlyNgn,
      recurringCostNotes: product.recurringCostNotes,
      turnaroundTime: product.turnaroundTime,
      deliverables: product.deliverables,
      exclusions: product.exclusions || [],
      bankDetails: {
        bankName: BRAND_IDENTITY.settlementBank,
        accountNumber: BRAND_IDENTITY.settlementAccountNumber,
        accountName: BRAND_IDENTITY.settlementAccountName,
      },
      manualVerificationRequired: true,
      message:
        'Order created. Transfer the exact amount to Moniepoint and submit your reference for admin verification (never auto-fulfilled on screenshot).',
    };
  }

  const secretKey = getMatchingSecretKey(input.publicKey);
  if (!secretKey || !secretKey.startsWith('sk_')) {
    throw new Error(
      'Paystack Secret Key is not configured on the server. Use Moniepoint bank transfer fallback or configure PAYSTACK_SECRET_KEY.'
    );
  }

  const callbackUrl = input.leadId
    ? `${input.callbackOrigin}/preview/${encodeURIComponent(input.leadId)}?payment=verifying&ref=${encodeURIComponent(orderReference)}`
    : `${input.callbackOrigin}/pricing?payment=verifying&ref=${encodeURIComponent(orderReference)}`;

  const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.customerEmail,
      amount: Math.round(amounts.dueNowNgn * 100),
      currency: 'NGN',
      reference: orderReference,
      callback_url: callbackUrl,
      metadata: {
        orderReference,
        orderId: order.id,
        productId: product.id,
        division: product.division,
        paymentStage: stage,
        leadId: input.leadId || '',
        clientName: customer.name,
        clientEmail: customer.email,
      },
    }),
  });

  const data = await paystackRes.json();
  if (!paystackRes.ok || !data.status) {
    throw new Error(data.message || 'Paystack initialization failed');
  }

  return {
    success: true,
    provider: 'paystack' as const,
    orderReference,
    amountDueNgn: amounts.dueNowNgn,
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
  };
}

export async function verifyAndProcessPaystackTransaction(params: {
  reference: string;
  webhookEventId?: string;
  rawWebhookPayload?: Record<string, any>;
}) {
  const eventKey = params.webhookEventId || `paystack-verify-${params.reference}`;
  if (await hasProcessedWebhookEvent(eventKey)) {
    const existingOrder = await getOrderByReference(params.reference);
    return { alreadyProcessed: true, verified: true, order: existingOrder };
  }

  const secretKey = getMatchingSecretKey();
  if (!secretKey || !secretKey.startsWith('sk_')) {
    throw new Error('Paystack Secret Key is not configured for server-side verification');
  }

  const verifyResp = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(params.reference)}`,
    {
      headers: { Authorization: `Bearer ${secretKey}` },
    }
  );
  const verifyData = await verifyResp.json();
  if (!verifyResp.ok || !verifyData.status || verifyData.data?.status !== 'success') {
    return {
      alreadyProcessed: false,
      verified: false,
      error: verifyData.data?.gateway_response || verifyData.message || 'Transaction not successful',
    };
  }

  const txData = verifyData.data;
  const paidNgn = Math.round(Number(txData.amount || 0) / 100);
  const currency = String(txData.currency || '').toUpperCase();
  const meta = txData.metadata || {};
  const orderRef = meta.orderReference || params.reference;

  let order = await getOrderByReference(orderRef);
  if (!order) {
    const customer = await upsertCustomer({
      name: meta.clientName || txData.customer?.first_name || 'Client',
      email: meta.clientEmail || txData.customer?.email,
      leadId: meta.leadId,
    });
    order = await createOrder({
      orderReference: orderRef,
      customerId: customer.id,
      productId: meta.productId || undefined,
      leadId: meta.leadId || undefined,
      division: meta.division || 'digital_business_solutions',
      packageName: meta.packageName || 'Bethelmind Service',
      totalAmountNgn: paidNgn,
      depositAmountNgn: paidNgn,
      balanceAmountNgn: 0,
      amountPaidNgn: 0,
      currency: 'NGN',
      paymentStage: meta.paymentStage || 'deposit',
      paymentStatus: 'pending',
      fulfilmentStatus: 'pending',
      paymentProvider: 'paystack',
      transactionReference: params.reference,
      metadata: meta,
    });
  }

  const expectedNgn =
    order.paymentStage === 'full'
      ? order.totalAmountNgn
      : order.paymentStage === 'balance'
        ? order.balanceAmountNgn
        : order.depositAmountNgn;

  if (currency !== 'NGN') {
    await recordTransaction({
      orderId: order.id,
      provider: 'paystack',
      providerReference: params.reference,
      expectedAmountNgn: expectedNgn,
      verifiedAmountNgn: paidNgn,
      currency,
      verificationStatus: 'currency_mismatch',
      webhookEventId: eventKey,
      rawPayload: params.rawWebhookPayload || txData,
    });
    return { alreadyProcessed: false, verified: false, error: `Currency mismatch: expected NGN, got ${currency}` };
  }

  if (paidNgn < expectedNgn) {
    await recordTransaction({
      orderId: order.id,
      provider: 'paystack',
      providerReference: params.reference,
      expectedAmountNgn: expectedNgn,
      verifiedAmountNgn: paidNgn,
      currency,
      verificationStatus: 'amount_mismatch',
      webhookEventId: eventKey,
      rawPayload: params.rawWebhookPayload || txData,
    });
    return {
      alreadyProcessed: false,
      verified: false,
      error: `Amount mismatch: expected ₦${expectedNgn.toLocaleString()}, got ₦${paidNgn.toLocaleString()}`,
    };
  }

  const txRecord = await recordTransaction({
    orderId: order.id,
    provider: 'paystack',
    providerReference: params.reference,
    expectedAmountNgn: expectedNgn,
    verifiedAmountNgn: paidNgn,
    currency: 'NGN',
    verificationStatus: 'verified',
    webhookEventId: eventKey,
    rawPayload: params.rawWebhookPayload || txData,
    verifiedAt: new Date().toISOString(),
  });

  const newPaidTotal = (order.amountPaidNgn || 0) + paidNgn;
  const isFullyPaid = newPaidTotal >= order.totalAmountNgn;

  const updatedOrder = await updateOrder(order.id, {
    amountPaidNgn: newPaidTotal,
    paymentStatus: isFullyPaid ? 'paid' : 'deposit_paid',
    fulfilmentStatus: 'queued',
    transactionReference: params.reference,
  });

  // Trigger post-payment fulfilment with exception queue protection
  try {
    await triggerOrderFulfilment(updatedOrder || order);
  } catch (err: any) {
    await recordFulfilmentException({
      orderId: order.id,
      transactionId: txRecord.id,
      workflowType: String(order.metadata?.fulfilmentType || order.division),
      errorMessage: err?.message || 'Fulfilment workflow failed',
    });
    await updateOrder(order.id, { fulfilmentStatus: 'exception' });
  }

  return {
    alreadyProcessed: false,
    verified: true,
    order: updatedOrder || order,
    transaction: txRecord,
  };
}

export async function triggerOrderFulfilment(order: OrderRecord) {
  const deadline = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
  const product = order.productId ? await getCommercialProduct(order.productId) : null;
  const fulfilmentType = String(order.metadata?.fulfilmentType || product?.fulfilmentType || '');

  let deliverableUrl: string | undefined;
  if (order.leadId) {
    deliverableUrl = `/preview/${order.leadId}`;
  }

  // Division 3: Auto-stage initial Excel + PDF research pack
  if (fulfilmentType === 'research_project' || order.division === 'business_intelligence') {
    const outDir = path.join(process.cwd(), 'local_db', 'bi_reports', order.orderReference);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const biInput = {
      reportTitle: `${order.packageName} — ${order.metadata?.companyName || order.metadata?.customerName || 'Client'}`,
      sector: String(order.metadata?.sector || 'General SME'),
      location: String(order.metadata?.location || 'Lagos'),
      dataSources: product?.dataSources || 'Verified public business directory listings.',
      limitations: product?.limitations || 'Publicly observed data as of collection date; private revenue excluded.',
      rows: [],
    };
    fs.writeFileSync(path.join(outDir, 'report.xlsx'), generateBiExcelBuffer(biInput));
    fs.writeFileSync(path.join(outDir, 'report.pdf'), await generateBiPdfBuffer(biInput));
    deliverableUrl = `/api/commerce/bi-report?order=${encodeURIComponent(order.orderReference)}`;
  }

  const project = await createProject({
    customerId: order.customerId,
    orderId: order.id,
    leadId: order.leadId,
    division: order.division,
    serviceType: order.packageName,
    projectStatus: 'onboarding',
    deliveryDeadline: deadline,
    assignedPerson: 'Bethelmind Delivery Desk',
    qualityApprovalStatus: 'pending',
    deliverableUrl,
    notes: `Auto-created from verified ${order.paymentProvider} payment (${order.orderReference}).`,
  });

  // Division 2: Auto-create recurring maintenance subscription record
  if (
    (fulfilmentType === 'automation_project' || order.division === 'business_automation') &&
    product &&
    product.monthlyMaintenanceNgn > 0
  ) {
    await createMaintenanceSubscription({
      customerId: order.customerId,
      projectId: project.id,
      orderId: order.id,
      monthlyFeeNgn: product.monthlyMaintenanceNgn,
    });
  }

  await updateOrder(order.id, { fulfilmentStatus: 'in_progress' });
}

export async function retryOpenFulfilmentExceptions() {
  const open = getOpenFulfilmentExceptions();
  let resolvedCount = 0;
  let failedCount = 0;

  for (const ex of open) {
    try {
      const order = await getOrderByReference(ex.orderId);
      if (!order) {
        markExceptionAttempt(ex.id, true, 'Order no longer exists');
        resolvedCount++;
        continue;
      }
      await triggerOrderFulfilment(order);
      markExceptionAttempt(ex.id, true);
      resolvedCount++;
    } catch (err: any) {
      markExceptionAttempt(ex.id, false, err?.message || 'Retry failed');
      failedCount++;
    }
  }
  return { attempted: open.length, resolvedCount, failedCount };
}

export async function approveManualTransferOrder(orderReference: string, verifiedAmountNgn: number, adminNote?: string) {
  const order = await getOrderByReference(orderReference);
  if (!order) throw new Error('Order not found');

  const expectedNgn =
    order.paymentStage === 'full'
      ? order.totalAmountNgn
      : order.paymentStage === 'balance'
        ? order.balanceAmountNgn
        : order.depositAmountNgn;

  if (verifiedAmountNgn < expectedNgn) {
    throw new Error(`Verified transfer ₦${verifiedAmountNgn.toLocaleString()} is below expected ₦${expectedNgn.toLocaleString()}`);
  }

  const tx = await recordTransaction({
    orderId: order.id,
    provider: 'moniepoint',
    providerReference: order.transactionReference || order.orderReference,
    expectedAmountNgn: expectedNgn,
    verifiedAmountNgn,
    currency: 'NGN',
    verificationStatus: 'verified',
    webhookEventId: `manual-approve-${order.orderReference}-${Date.now()}`,
    rawPayload: { adminNote: adminNote || 'Verified by Admin' },
    verifiedAt: new Date().toISOString(),
  });

  const newPaid = (order.amountPaidNgn || 0) + verifiedAmountNgn;
  const isFullyPaid = newPaid >= order.totalAmountNgn;

  const updated = await updateOrder(order.id, {
    amountPaidNgn: newPaid,
    paymentStatus: isFullyPaid ? 'paid' : 'deposit_paid',
    fulfilmentStatus: 'queued',
  });

  await triggerOrderFulfilment(updated || order);
  return { order: updated, transaction: tx };
}
