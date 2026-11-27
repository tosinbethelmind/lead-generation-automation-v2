import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getSupabaseClient } from '@/lib/supabaseClient';

export interface CustomerRecord {
  id: string;
  name: string;
  email?: string;
  whatsappNumber?: string;
  companyName?: string;
  leadId?: string;
  consentStatus: 'opted_in' | 'opted_out' | 'pending';
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  orderReference: string;
  customerId?: string;
  productId?: string;
  leadId?: string;
  division: string;
  packageName: string;
  totalAmountNgn: number;
  depositAmountNgn: number;
  balanceAmountNgn: number;
  amountPaidNgn: number;
  currency: string;
  paymentStage: 'deposit' | 'balance' | 'full';
  paymentStatus:
    | 'pending'
    | 'pending_manual_verification'
    | 'deposit_paid'
    | 'paid'
    | 'failed'
    | 'refunded'
    | 'disputed';
  fulfilmentStatus: 'pending' | 'queued' | 'in_progress' | 'awaiting_approval' | 'completed' | 'exception';
  paymentProvider: string;
  transactionReference?: string;
  affiliateCode?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRecord {
  id: string;
  orderId: string;
  provider: 'paystack' | 'selar' | 'moniepoint' | 'opay' | 'manual';
  providerReference: string;
  expectedAmountNgn: number;
  verifiedAmountNgn: number;
  currency: string;
  verificationStatus:
    | 'pending'
    | 'verified'
    | 'failed'
    | 'amount_mismatch'
    | 'currency_mismatch'
    | 'refunded'
    | 'reversed';
  webhookEventId?: string;
  rawPayload?: Record<string, any>;
  verifiedAt?: string;
  createdAt: string;
}

export interface ProjectRecord {
  id: string;
  customerId?: string;
  orderId: string;
  leadId?: string;
  division: string;
  serviceType: string;
  projectStatus:
    | 'onboarding'
    | 'in_progress'
    | 'preview_ready'
    | 'client_approved'
    | 'final_payment_pending'
    | 'handed_over'
    | 'active_maintenance'
    | 'paused';
  deliveryDeadline?: string;
  assignedPerson: string;
  qualityApprovalStatus: 'pending' | 'approved' | 'revision_requested';
  deliverableUrl?: string;
  notes?: string;
  createdAt: string;
}

interface MaintenanceSubscriptionRecord {
  id: string;
  customerId?: string;
  projectId?: string;
  orderId: string;
  monthlyFeeNgn: number;
  status: 'active' | 'past_due' | 'paused' | 'cancelled';
  nextBillingDate: string;
  lastRenewalNotifiedAt?: string;
  createdAt: string;
}

interface LocalLedgerState {
  customers: CustomerRecord[];
  orders: OrderRecord[];
  transactions: TransactionRecord[];
  projects: ProjectRecord[];
  subscriptions: MaintenanceSubscriptionRecord[];
  exceptions: Array<{
    id: string;
    orderId: string;
    transactionId?: string;
    workflowType: string;
    errorMessage: string;
    retryCount: number;
    status: 'open' | 'retrying' | 'resolved';
    createdAt: string;
  }>;
}

const LOCAL_LEDGER_PATH = path.join(process.cwd(), 'local_db', 'commerce_ledger.json');

function readLocalLedger(): LocalLedgerState {
  try {
    if (fs.existsSync(LOCAL_LEDGER_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(LOCAL_LEDGER_PATH, 'utf8'));
      return {
        customers: Array.isArray(parsed.customers) ? parsed.customers : [],
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
        exceptions: Array.isArray(parsed.exceptions) ? parsed.exceptions : [],
      };
    }
  } catch {}
  return { customers: [], orders: [], transactions: [], projects: [], subscriptions: [], exceptions: [] };
}

function writeLocalLedger(state: LocalLedgerState): void {
  try {
    const dir = path.dirname(LOCAL_LEDGER_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_LEDGER_PATH, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.warn('[Ledger] Local write failed:', err);
  }
}

export async function upsertCustomer(input: {
  name: string;
  email?: string;
  whatsappNumber?: string;
  companyName?: string;
  leadId?: string;
  consentStatus?: 'opted_in' | 'opted_out' | 'pending';
}): Promise<CustomerRecord> {
  const ledger = readLocalLedger();
  const cleanEmail = input.email?.trim().toLowerCase();
  const cleanWa = input.whatsappNumber?.replace(/\D/g, '');

  let existing = ledger.customers.find(
    (c) =>
      (cleanEmail && c.email?.toLowerCase() === cleanEmail) ||
      (cleanWa && c.whatsappNumber === cleanWa) ||
      (input.leadId && c.leadId === input.leadId)
  );

  const now = new Date().toISOString();
  if (existing) {
    existing.name = input.name || existing.name;
    existing.email = cleanEmail || existing.email;
    existing.whatsappNumber = cleanWa || existing.whatsappNumber;
    existing.companyName = input.companyName || existing.companyName;
    if (input.consentStatus) existing.consentStatus = input.consentStatus;
  } else {
    existing = {
      id: crypto.randomUUID(),
      name: input.name || 'Valued Client',
      email: cleanEmail,
      whatsappNumber: cleanWa,
      companyName: input.companyName,
      leadId: input.leadId,
      consentStatus: input.consentStatus || 'pending',
      createdAt: now,
    };
    ledger.customers.push(existing);
  }
  writeLocalLedger(ledger);

  try {
    const supabase = getSupabaseClient();
    await (supabase.from('customers') as any).upsert({
      id: existing.id,
      name: existing.name,
      email: existing.email || null,
      whatsapp_number: existing.whatsappNumber || null,
      company_name: existing.companyName || null,
      lead_id: existing.leadId || null,
      consent_status: existing.consentStatus,
      updated_at: now,
    });
  } catch {}

  return existing;
}

export async function createOrder(
  input: Omit<OrderRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<OrderRecord> {
  const ledger = readLocalLedger();
  const existing = ledger.orders.find((o) => o.orderReference === input.orderReference);
  if (existing) return existing;

  const now = new Date().toISOString();
  const order: OrderRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  ledger.orders.push(order);
  writeLocalLedger(ledger);

  try {
    const supabase = getSupabaseClient();
    await (supabase.from('orders') as any).insert({
      id: order.id,
      order_reference: order.orderReference,
      customer_id: order.customerId || null,
      product_id: order.productId || null,
      lead_id: order.leadId || null,
      division: order.division,
      package_name: order.packageName,
      total_amount_ngn: order.totalAmountNgn,
      deposit_amount_ngn: order.depositAmountNgn,
      balance_amount_ngn: order.balanceAmountNgn,
      amount_paid_ngn: order.amountPaidNgn,
      currency: order.currency,
      payment_stage: order.paymentStage,
      payment_status: order.paymentStatus,
      fulfilment_status: order.fulfilmentStatus,
      payment_provider: order.paymentProvider,
      transaction_reference: order.transactionReference || null,
      affiliate_code: order.affiliateCode || null,
      metadata: order.metadata,
      created_at: now,
      updated_at: now,
    });
  } catch {}

  return order;
}

export async function getOrderByReference(ref: string): Promise<OrderRecord | null> {
  const ledger = readLocalLedger();
  const local = ledger.orders.find(
    (o) => o.orderReference === ref || o.transactionReference === ref || o.id === ref
  );
  if (local) return local;

  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('orders')
      .select('*')
      .or(`order_reference.eq.${ref},transaction_reference.eq.${ref}`)
      .limit(1)
      .maybeSingle();
    if (data) {
      const r: any = data;
      return {
        id: r.id,
        orderReference: r.order_reference,
        customerId: r.customer_id,
        productId: r.product_id,
        leadId: r.lead_id,
        division: r.division,
        packageName: r.package_name,
        totalAmountNgn: r.total_amount_ngn,
        depositAmountNgn: r.deposit_amount_ngn,
        balanceAmountNgn: r.balance_amount_ngn,
        amountPaidNgn: r.amount_paid_ngn,
        currency: r.currency,
        paymentStage: r.payment_stage,
        paymentStatus: r.payment_status,
        fulfilmentStatus: r.fulfilment_status,
        paymentProvider: r.payment_provider,
        transactionReference: r.transaction_reference,
        affiliateCode: r.affiliate_code,
        metadata: r.metadata || {},
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    }
  } catch {}
  return null;
}

export async function updateOrder(
  orderId: string,
  patch: Partial<
    Pick<
      OrderRecord,
      'amountPaidNgn' | 'paymentStatus' | 'fulfilmentStatus' | 'transactionReference' | 'metadata'
    >
  >
): Promise<OrderRecord | null> {
  const ledger = readLocalLedger();
  const idx = ledger.orders.findIndex((o) => o.id === orderId || o.orderReference === orderId);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  ledger.orders[idx] = {
    ...ledger.orders[idx],
    ...patch,
    updatedAt: now,
  };
  writeLocalLedger(ledger);

  try {
    const supabase = getSupabaseClient();
    await (supabase.from('orders') as any)
      .update({
        ...(patch.amountPaidNgn !== undefined ? { amount_paid_ngn: patch.amountPaidNgn } : {}),
        ...(patch.paymentStatus !== undefined ? { payment_status: patch.paymentStatus } : {}),
        ...(patch.fulfilmentStatus !== undefined ? { fulfilment_status: patch.fulfilmentStatus } : {}),
        ...(patch.transactionReference !== undefined
          ? { transaction_reference: patch.transactionReference }
          : {}),
        ...(patch.metadata !== undefined ? { metadata: patch.metadata } : {}),
        updated_at: now,
      })
      .eq('id', ledger.orders[idx].id);
  } catch {}

  return ledger.orders[idx];
}

export async function hasProcessedWebhookEvent(webhookEventId: string): Promise<boolean> {
  if (!webhookEventId) return false;
  const ledger = readLocalLedger();
  if (ledger.transactions.some((t) => t.webhookEventId === webhookEventId)) return true;

  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('transactions')
      .select('id')
      .eq('webhook_event_id', webhookEventId)
      .limit(1)
      .maybeSingle();
    if (data) return true;
  } catch {}
  return false;
}

export async function recordTransaction(
  input: Omit<TransactionRecord, 'id' | 'createdAt'>
): Promise<TransactionRecord> {
  const ledger = readLocalLedger();
  if (input.webhookEventId) {
    const dup = ledger.transactions.find((t) => t.webhookEventId === input.webhookEventId);
    if (dup) return dup;
  }

  const now = new Date().toISOString();
  const tx: TransactionRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
  };
  ledger.transactions.push(tx);
  writeLocalLedger(ledger);

  try {
    const supabase = getSupabaseClient();
    await (supabase.from('transactions') as any).insert({
      id: tx.id,
      order_id: tx.orderId,
      provider: tx.provider,
      provider_reference: tx.providerReference,
      expected_amount_ngn: tx.expectedAmountNgn,
      verified_amount_ngn: tx.verifiedAmountNgn,
      currency: tx.currency,
      verification_status: tx.verificationStatus,
      webhook_event_id: tx.webhookEventId || null,
      raw_payload: tx.rawPayload || {},
      verified_at: tx.verifiedAt || null,
      created_at: now,
    });
  } catch {}

  return tx;
}

export async function createProject(
  input: Omit<ProjectRecord, 'id' | 'createdAt'>
): Promise<ProjectRecord> {
  const ledger = readLocalLedger();
  const existing = ledger.projects.find((p) => p.orderId === input.orderId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const project: ProjectRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
  };
  ledger.projects.push(project);
  writeLocalLedger(ledger);

  try {
    const supabase = getSupabaseClient();
    await (supabase.from('projects') as any).insert({
      id: project.id,
      customer_id: project.customerId || null,
      order_id: project.orderId,
      lead_id: project.leadId || null,
      division: project.division,
      service_type: project.serviceType,
      project_status: project.projectStatus,
      delivery_deadline: project.deliveryDeadline || null,
      assigned_person: project.assignedPerson,
      quality_approval_status: project.qualityApprovalStatus,
      deliverable_url: project.deliverableUrl || null,
      notes: project.notes || null,
      created_at: now,
      updated_at: now,
    });
  } catch {}

  return project;
}

export async function recordFulfilmentException(input: {
  orderId: string;
  transactionId?: string;
  workflowType: string;
  errorMessage: string;
}): Promise<void> {
  const ledger = readLocalLedger();
  const now = new Date().toISOString();
  ledger.exceptions.push({
    id: crypto.randomUUID(),
    orderId: input.orderId,
    transactionId: input.transactionId,
    workflowType: input.workflowType,
    errorMessage: input.errorMessage,
    retryCount: 0,
    status: 'open',
    createdAt: now,
  });
  writeLocalLedger(ledger);

  try {
    const supabase = getSupabaseClient();
    await (supabase.from('fulfilment_exceptions') as any).insert({
      order_id: input.orderId,
      transaction_id: input.transactionId || null,
      workflow_type: input.workflowType,
      error_message: input.errorMessage,
      status: 'open',
      created_at: now,
      updated_at: now,
    });
  } catch {}
}

export function getLedgerSummary() {
  const ledger = readLocalLedger();
  const paidOrders = ledger.orders.filter(
    (o) => o.paymentStatus === 'paid' || o.paymentStatus === 'deposit_paid'
  );
  const totalRevenueNgn = paidOrders.reduce((sum, o) => sum + (o.amountPaidNgn || 0), 0);
  const pendingManual = ledger.orders.filter((o) => o.paymentStatus === 'pending_manual_verification');

  return {
    totalCustomers: ledger.customers.length,
    totalOrders: ledger.orders.length,
    paidOrdersCount: paidOrders.length,
    totalRevenueNgn,
    pendingManualCount: pendingManual.length,
    activeProjectsCount: ledger.projects.length,
    activeSubscriptionsCount: ledger.subscriptions.filter((s) => s.status === 'active').length,
    openExceptionsCount: ledger.exceptions.filter((e) => e.status === 'open').length,
    recentOrders: ledger.orders.slice(-20).reverse(),
    recentProjects: ledger.projects.slice(-20).reverse(),
  };
}

export async function createMaintenanceSubscription(input: {
  customerId?: string;
  projectId?: string;
  orderId: string;
  monthlyFeeNgn: number;
}): Promise<MaintenanceSubscriptionRecord> {
  const ledger = readLocalLedger();
  const existing = ledger.subscriptions.find((s) => s.orderId === input.orderId);
  if (existing) return existing;

  const now = new Date();
  const nextBilling = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const sub: MaintenanceSubscriptionRecord = {
    id: crypto.randomUUID(),
    customerId: input.customerId,
    projectId: input.projectId,
    orderId: input.orderId,
    monthlyFeeNgn: input.monthlyFeeNgn,
    status: 'active',
    nextBillingDate: nextBilling,
    createdAt: now.toISOString(),
  };
  ledger.subscriptions.push(sub);
  writeLocalLedger(ledger);

  try {
    const supabase = getSupabaseClient();
    await (supabase.from('maintenance_subscriptions') as any).insert({
      id: sub.id,
      customer_id: sub.customerId || null,
      project_id: sub.projectId || null,
      order_id: sub.orderId,
      monthly_fee_ngn: sub.monthlyFeeNgn,
      status: sub.status,
      next_billing_date: sub.nextBillingDate,
      created_at: sub.createdAt,
      updated_at: sub.createdAt,
    });
  } catch {}

  return sub;
}

export function getDueMaintenanceSubscriptions(withinDays = 3): MaintenanceSubscriptionRecord[] {
  const ledger = readLocalLedger();
  const cutoff = Date.now() + withinDays * 24 * 60 * 60 * 1000;
  return ledger.subscriptions.filter(
    (s) => s.status === 'active' && new Date(s.nextBillingDate).getTime() <= cutoff
  );
}

export function getOpenFulfilmentExceptions() {
  const ledger = readLocalLedger();
  return ledger.exceptions.filter((e) => e.status === 'open' && e.retryCount < 3);
}

export function markExceptionAttempt(exceptionId: string, resolved: boolean, errorMessage?: string) {
  const ledger = readLocalLedger();
  const ex = ledger.exceptions.find((e) => e.id === exceptionId);
  if (!ex) return;
  ex.retryCount += 1;
  ex.status = resolved ? 'resolved' : 'open';
  if (errorMessage) ex.errorMessage = errorMessage;
  writeLocalLedger(ledger);
}
