/**
 * GET /api/tenants/list
 * Super-admin only: list all tenants with stats.
 *
 * GET /api/tenants/me
 * Tenant: get their own record by token.
 */

import { NextRequest, NextResponse } from 'next/server';
import { listAllTenants, getTenantByToken, getTenantFeatures, getDaysRemaining, isTenantActive } from '@/lib/tenantContext';
import { getAdminUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('mode') || 'list';

  // ── Mode: me (tenant resolves their own record) ──────────────────────
  if (mode === 'me') {
    const token = req.cookies.get('tenant-token')?.value || req.headers.get('x-tenant-token');
    if (!token) {
      return NextResponse.json({ success: false, error: 'No tenant token provided' }, { status: 401 });
    }
    const tenant = await getTenantByToken(token);
    if (!tenant) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
    }
    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        business_name: tenant.business_name,
        package_tier: tenant.package_tier,
        plan_type: tenant.plan_type,
        status: tenant.status,
        is_active: isTenantActive(tenant),
        days_remaining: getDaysRemaining(tenant),
        subscription_expiry_iso: tenant.subscription_expiry_iso,
        features: getTenantFeatures(tenant),
        site_url: tenant.site_url,
        monthly_renewal_ngn: tenant.monthly_renewal_ngn,
        created_at: tenant.created_at,
      }
    });
  }

  // ── Mode: list (super-admin only) ────────────────────────────────────
  const adminToken = req.cookies.get('admin-token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  const adminUser = getAdminUser(adminToken);

  if (!adminUser || adminUser.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Super admin access required' }, { status: 403 });
  }

  const tenants = await listAllTenants();

  const enriched = tenants.map(t => ({
    id: t.id,
    business_name: t.business_name,
    owner_name: t.owner_name,
    owner_email: t.owner_email,
    owner_phone: t.owner_phone,
    package_tier: t.package_tier,
    plan_type: t.plan_type,
    status: t.status,
    is_active: isTenantActive(t),
    days_remaining: getDaysRemaining(t),
    subscription_expiry_iso: t.subscription_expiry_iso,
    monthly_renewal_ngn: t.monthly_renewal_ngn,
    features: getTenantFeatures(t),
    site_url: t.site_url,
    created_at: t.created_at,
    portal_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com'}/portal/${t.id}`,
  }));

  const stats = {
    total: enriched.length,
    active: enriched.filter(t => t.is_active).length,
    expired: enriched.filter(t => !t.is_active && t.status === 'expired').length,
    suspended: enriched.filter(t => t.status === 'suspended').length,
    by_tier: {
      starter: enriched.filter(t => t.package_tier === 'starter').length,
      pro: enriched.filter(t => t.package_tier === 'pro').length,
      vip: enriched.filter(t => t.package_tier === 'vip').length,
      luxury: enriched.filter(t => t.package_tier === 'luxury').length,
    },
    mrr_ngn: enriched.filter(t => t.is_active && t.plan_type === 'subscription').reduce((sum, t) => sum + t.monthly_renewal_ngn, 0),
  };

  return NextResponse.json({ success: true, tenants: enriched, stats });
}

/**
 * POST /api/tenants/list  (with action)
 * Super-admin actions: suspend | renew | delete
 */
export async function POST(req: NextRequest) {
  const adminToken = req.cookies.get('admin-token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  const adminUser = getAdminUser(adminToken);

  if (!adminUser || adminUser.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Super admin access required' }, { status: 403 });
  }

  const { action, tenant_id, reason, days } = await req.json();

  if (!tenant_id || !action) {
    return NextResponse.json({ success: false, error: 'tenant_id and action required' }, { status: 400 });
  }

  const { suspendTenant, renewTenant } = await import('@/lib/tenantContext');

  if (action === 'suspend') {
    await suspendTenant(tenant_id, reason);
    return NextResponse.json({ success: true, message: `Tenant ${tenant_id} suspended` });
  }

  if (action === 'renew') {
    await renewTenant(tenant_id, { days: days || 30 });
    return NextResponse.json({ success: true, message: `Tenant ${tenant_id} renewed for ${days || 30} days` });
  }

  return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
}
