/**
 * POST /api/tenants/provision
 * Called on successful payment (Paystack webhook / manual OPay confirmation).
 * Creates a new tenant, provisions their site, and sends login credentials.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createTenant, PackageTier, PlanType, getTenantById } from '@/lib/tenantContext';
import { getAdminUser } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { NIGERIAN_MARKET_TIERS } from '@/lib/pricing';

function getMonthlyRenewal(tier: PackageTier): number {
  const t = NIGERIAN_MARKET_TIERS.find(t => t.id === tier);
  return t?.monthlyRenewalNGN ?? 0;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      business_name,
      owner_name,
      owner_email,
      owner_phone,
      package_tier = 'pro',
      plan_type = 'subscription',
      payment_method = 'paystack',
      payment_reference,
      order_reference,
      // Admin bypass — super_admin can provision manually
      admin_token,
    } = body;

    if (!business_name || !owner_email) {
      return NextResponse.json({ success: false, error: 'business_name and owner_email are required' }, { status: 400 });
    }

    // Log the order in marketplace_orders first
    const supabase = getSupabaseClient();
    const orderRef = order_reference || `ORD_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const tier = NIGERIAN_MARKET_TIERS.find(t => t.id === package_tier);
    const amountNgn = plan_type === 'standalone' ? (tier?.priceNGN ?? 0) : (tier?.monthlyRenewalNGN ?? 0);

    // Check for duplicate order
    const { data: existingOrder } = await (supabase as any)
      .from('marketplace_orders')
      .select('id, tenant_id')
      .eq('order_reference', orderRef)
      .single();

    const orderObj = existingOrder as any;
    if (orderObj?.tenant_id) {
      const existingTenant = await getTenantById(orderObj.tenant_id);

      if (existingTenant) {
        return NextResponse.json({
          success: true,
          already_provisioned: true,
          tenant_id: existingTenant.id,
          access_token: existingTenant.access_token,
          portal_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://lead-generation-automation-ecru.vercel.app'}/portal/${existingTenant.id}`,
          dashboard_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://lead-generation-automation-ecru.vercel.app'}/admin`,
        });
      }
    }

    // Create the tenant
    const tenant = await createTenant({
      business_name,
      owner_name,
      owner_email,
      owner_phone,
      package_tier: package_tier as PackageTier,
      plan_type: plan_type as PlanType,
      payment_method,
      payment_reference,
      monthly_renewal_ngn: getMonthlyRenewal(package_tier as PackageTier),
      setup_fee_paid: true,
    });

    // Save marketplace order with tenant linkage
    await (supabase as any).from('marketplace_orders').upsert({

      order_reference: orderRef,
      tenant_id: tenant.id,
      business_name,
      buyer_name: owner_name,
      buyer_email: owner_email,
      buyer_phone: owner_phone,
      package_tier,
      plan_type,
      amount_ngn: amountNgn,
      payment_method,
      payment_status: 'paid',
      payment_reference,
      provisioned: true,
      provisioned_at: new Date().toISOString(),
    }, { onConflict: 'order_reference' });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lead-generation-automation-ecru.vercel.app';
    const portalUrl = `${baseUrl}/portal/${tenant.id}`;
    const dashboardUrl = `${baseUrl}/admin`;

    // Send onboarding credentials via email if configured
    try {
      const { sendNotificationEmail } = await import('@/lib/email');
      const tierDetails = NIGERIAN_MARKET_TIERS.find(t => t.id === package_tier);
      const subject = `🚀 Welcome to ApexReach! Your ${tierDetails?.name || package_tier} is Ready`;
      const emailBody = `Welcome, ${owner_name || business_name}!\n\nYour ${tierDetails?.badge || package_tier.toUpperCase()} is fully provisioned.\n\nPortal URL: ${portalUrl}\nAccess Token: ${tenant.access_token}\n\nKeep this token private as it grants access to your workspace.`;
      await sendNotificationEmail(owner_email, subject, emailBody);

    } catch (emailErr: any) {
      console.warn('[Provision] Email delivery failed (non-critical):', emailErr?.message);
    }

    console.log(`[Provision] ✅ Tenant ${tenant.id} (${business_name}) provisioned. Portal: ${portalUrl}`);

    return NextResponse.json({
      success: true,
      tenant_id: tenant.id,
      access_token: tenant.access_token,
      package_tier: tenant.package_tier,
      plan_type: tenant.plan_type,
      portal_url: portalUrl,
      dashboard_url: dashboardUrl,
      features: tenant.features_enabled,
      expiry: tenant.subscription_expiry_iso,
      message: `✅ ${business_name} successfully provisioned on the ${package_tier} plan. Login credentials sent to ${owner_email}.`
    });

  } catch (err: any) {
    console.error('[Provision] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Provisioning failed' }, { status: 500 });
  }
}
