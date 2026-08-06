/**
 * @file src/lib/tenantContext.ts
 * Multi-Tenant Context Engine — Resolves tenant identity from every request
 * and enforces per-subscription feature gating across all tools.
 */

import { NextRequest } from 'next/server';
import { getSupabaseClient } from './supabaseClient';

// ─── Types ───────────────────────────────────────────────────────────────────

export type PackageTier = 'starter' | 'pro' | 'vip' | 'luxury';
export type TenantStatus = 'active' | 'expired' | 'suspended' | 'pending';
export type PlanType = 'standalone' | 'subscription';

export interface TenantFeatures {
  lead_harvester: boolean;
  ai_customer_agent: boolean;
  whatsapp_voice_notes: boolean;
  ai_voice_caller: boolean;
  solar_pipeline: boolean;
  recruitment_engine: boolean;
}

export interface TenantRecord {
  id: string;
  business_name: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  package_tier: PackageTier;
  status: TenantStatus;
  access_token: string;
  setup_fee_paid: boolean;
  subscription_start_iso?: string;
  subscription_expiry_iso?: string;
  last_payment_reference?: string;
  monthly_renewal_ngn: number;
  features_enabled: TenantFeatures;
  site_url?: string;
  custom_domain?: string;
  notes?: string;
  payment_method?: string;
  plan_type: PlanType;
  created_at?: string;
  updated_at?: string;
}

// ─── Feature Maps Per Tier ────────────────────────────────────────────────────

export const TIER_FEATURES: Record<PackageTier, TenantFeatures> = {
  starter: {
    lead_harvester: false,
    ai_customer_agent: true,
    whatsapp_voice_notes: false,
    ai_voice_caller: false,
    solar_pipeline: false,
    recruitment_engine: false,
  },
  pro: {
    lead_harvester: true,
    ai_customer_agent: true,
    whatsapp_voice_notes: true,
    ai_voice_caller: false,
    solar_pipeline: true,
    recruitment_engine: false,
  },
  vip: {
    lead_harvester: true,
    ai_customer_agent: true,
    whatsapp_voice_notes: true,
    ai_voice_caller: true,
    solar_pipeline: true,
    recruitment_engine: false,
  },
  luxury: {
    lead_harvester: true,
    ai_customer_agent: true,
    whatsapp_voice_notes: true,
    ai_voice_caller: true,
    solar_pipeline: true,
    recruitment_engine: true,
  },
};

// ─── Tenant Resolution ────────────────────────────────────────────────────────

/**
 * Resolve the tenant from an incoming API request.
 * Priority: X-Tenant-Token header → Cookie → Query param → Default ('default')
 */
export function getTenantTokenFromRequest(req: NextRequest): string | null {
  // 1. Header (API calls)
  const headerToken = req.headers.get('x-tenant-token') || req.headers.get('authorization')?.replace('Bearer ', '');
  if (headerToken && headerToken !== 'bethelmind_admin_2026' && !headerToken.startsWith('admin_')) {
    const possibleTenantToken = headerToken;
    if (possibleTenantToken.startsWith('tenant_tok_')) return possibleTenantToken;
  }

  // 2. Cookie (browser sessions)
  const cookieToken = req.cookies.get('tenant-token')?.value;
  if (cookieToken) return cookieToken;

  // 3. Query param (shareable links)
  const url = new URL(req.url);
  const qToken = url.searchParams.get('token');
  if (qToken) return qToken;

  return null;
}

/**
 * Fetch a full TenantRecord by access token from Supabase.
 * Returns null if not found or token invalid.
 */
export async function getTenantByToken(token: string): Promise<TenantRecord | null> {
  if (!token) return null;
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('access_token', token)
      .single();
    if (error || !data) return null;
    return data as TenantRecord;
  } catch (_) {
    return null;
  }
}

/**
 * Fetch a full TenantRecord by tenant ID from Supabase.
 */
export async function getTenantById(tenantId: string): Promise<TenantRecord | null> {
  if (!tenantId || tenantId === 'default') return null;
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single();
    if (error || !data) return null;
    return data as TenantRecord;
  } catch (_) {
    return null;
  }
}

/**
 * Check if a tenant's subscription is currently active (not expired, not suspended).
 */
export function isTenantActive(tenant: TenantRecord): boolean {
  if (tenant.status === 'suspended') return false;
  if (!tenant.subscription_expiry_iso) return tenant.status === 'active';
  return new Date(tenant.subscription_expiry_iso) > new Date();
}

/**
 * Get effective features for a tenant (tier defaults merged with any custom overrides).
 */
export function getTenantFeatures(tenant: TenantRecord): TenantFeatures {
  const tierDefaults = TIER_FEATURES[tenant.package_tier] || TIER_FEATURES.starter;
  // Allow per-tenant overrides stored in features_enabled
  return { ...tierDefaults, ...tenant.features_enabled };
}

/**
 * Feature gating check — throws a structured error if tenant lacks the feature.
 */
export function requireFeature(tenant: TenantRecord | null, feature: keyof TenantFeatures): void {
  if (!tenant) {
    throw { status: 401, message: 'Authentication required. Please provide a valid tenant token.' };
  }
  if (!isTenantActive(tenant)) {
    throw { status: 402, message: `Subscription expired for ${tenant.business_name}. Please renew to continue.`, tenant_id: tenant.id };
  }
  const features = getTenantFeatures(tenant);
  if (!features[feature]) {
    const tierNeeded = Object.entries(TIER_FEATURES).find(([, f]) => f[feature])?.[0] || 'pro';
    throw {
      status: 403,
      message: `Your ${tenant.package_tier} plan does not include "${feature.replace(/_/g, ' ')}". Upgrade to ${tierNeeded} or above to unlock this feature.`,
      upgrade_url: `/marketplace?upgrade=true&feature=${feature}&tenant_id=${tenant.id}`
    };
  }
}

// ─── Tenant Management ─────────────────────────────────────────────────────────

/**
 * Generate a unique tenant ID and access token.
 */
export function generateTenantCredentials(): { tenant_id: string; access_token: string } {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const rand = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return {
    tenant_id: `tenant_${rand(12)}`,
    access_token: `tenant_tok_${rand(24)}`,
  };
}

/**
 * Create a new tenant in Supabase on successful payment.
 */
export async function createTenant(params: {
  business_name: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  package_tier: PackageTier;
  plan_type: PlanType;
  payment_method?: string;
  payment_reference?: string;
  monthly_renewal_ngn?: number;
  setup_fee_paid?: boolean;
  notes?: string;
}): Promise<TenantRecord> {
  const supabase = getSupabaseClient();
  const { tenant_id, access_token } = generateTenantCredentials();

  const now = new Date();
  // Standalone = no expiry; Subscription = 30 days
  const expiryDate = params.plan_type === 'standalone' ? null : (() => {
    const d = new Date(now);
    d.setDate(d.getDate() + 30);
    return d.toISOString();
  })();

  const features = TIER_FEATURES[params.package_tier];
  const monthlyRenewal = params.monthly_renewal_ngn ?? 0;

  const newTenant: Omit<TenantRecord, 'created_at' | 'updated_at'> = {
    id: tenant_id,
    business_name: params.business_name,
    owner_name: params.owner_name,
    owner_email: params.owner_email,
    owner_phone: params.owner_phone,
    package_tier: params.package_tier,
    status: 'active',
    access_token,
    setup_fee_paid: params.setup_fee_paid ?? true,
    subscription_start_iso: now.toISOString(),
    subscription_expiry_iso: expiryDate ?? undefined,
    last_payment_reference: params.payment_reference,
    monthly_renewal_ngn: monthlyRenewal,
    features_enabled: features,
    plan_type: params.plan_type,
    payment_method: params.payment_method,
    notes: params.notes,
    site_url: undefined,
    custom_domain: undefined,
  };

  const { data, error } = await supabase.from('tenants').insert(newTenant).select().single();
  if (error) throw new Error(`[createTenant] Supabase error: ${error.message}`);

  console.log(`[TenantContext] ✅ New tenant created: ${tenant_id} (${params.business_name}, ${params.package_tier})`);
  return data as TenantRecord;
}

/**
 * Renew/reactivate a tenant subscription (adds 30 days from now).
 */
export async function renewTenant(tenantId: string, options?: { days?: number; paymentReference?: string }): Promise<void> {
  const supabase = getSupabaseClient();
  const days = options?.days ?? 30;
  const newExpiry = new Date();
  newExpiry.setDate(newExpiry.getDate() + days);

  await supabase.from('tenants').update({
    status: 'active',
    subscription_expiry_iso: newExpiry.toISOString(),
    last_payment_reference: options?.paymentReference,
    updated_at: new Date().toISOString(),
  }).eq('id', tenantId);
}

/**
 * List all tenants (super-admin only).
 */
export async function listAllTenants(): Promise<TenantRecord[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data ?? []) as TenantRecord[];
  } catch (_) {
    return [];
  }
}

/**
 * Suspend a tenant immediately (e.g. for fraud or non-payment).
 */
export async function suspendTenant(tenantId: string, reason?: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.from('tenants').update({
    status: 'suspended',
    notes: reason ? `SUSPENDED: ${reason}` : 'Suspended by admin',
    updated_at: new Date().toISOString(),
  }).eq('id', tenantId);
}

/**
 * Get days remaining on subscription (negative = expired).
 */
export function getDaysRemaining(tenant: TenantRecord): number {
  if (!tenant.subscription_expiry_iso) return tenant.plan_type === 'standalone' ? 9999 : 0;
  const diff = new Date(tenant.subscription_expiry_iso).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
