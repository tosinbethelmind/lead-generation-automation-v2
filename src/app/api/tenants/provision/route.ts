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
      await sendNotificationEmail({
        to: owner_email,
        subject: `🚀 Welcome to ApexReach! Your ${tierDetails?.name || package_tier} is Ready`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #07090e; color: #f8fafc; padding: 40px; border-radius: 16px;">
            <h1 style="color: #06b6d4; margin-bottom: 8px;">Welcome, ${owner_name || business_name}! 🎉</h1>
            <p style="color: #94a3b8; margin-bottom: 24px;">Your <strong style="color: #f8fafc;">${tierDetails?.badge || package_tier.toUpperCase()}</strong> is fully provisioned and ready to use.</p>
            
            <div style="background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.2); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #06b6d4; margin: 0 0 16px;">Your Login Credentials</h2>
              <p><strong>Portal URL:</strong> <a href="${portalUrl}" style="color: #06b6d4;">${portalUrl}</a></p>
              <p><strong>Access Token:</strong> <code style="background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 6px; color: #10b981;">${tenant.access_token}</code></p>
              <p style="color: #94a3b8; font-size: 0.85em;">⚠️ Keep this token private. It grants full access to your dashboard.</p>
            </div>

            <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #10b981; margin: 0 0 12px;">What You Can Do Now</h2>
              <ul style="color: #94a3b8; padding-left: 20px;">
                ${tenant.features_enabled.lead_harvester ? '<li>🎯 10K Lagos B2B Lead Harvester Engine</li>' : ''}
                ${tenant.features_enabled.ai_customer_agent ? '<li>🤖 24/7 Customer AI Agent</li>' : ''}
                ${tenant.features_enabled.whatsapp_voice_notes ? '<li>🎙️ Nigerian Accent WhatsApp Voice Notes</li>' : ''}
                ${tenant.features_enabled.ai_voice_caller ? '<li>📞 AI Voice Caller (Outbound)</li>' : ''}
                ${tenant.features_enabled.solar_pipeline ? '<li>☀️ Solar Quote Pro Pipeline</li>' : ''}
                ${tenant.features_enabled.recruitment_engine ? '<li>👥 Recruitment Engine</li>' : ''}
              </ul>
            </div>

            <p style="color: #94a3b8;">Need help? Reply to this email or contact us on WhatsApp.</p>
          </div>
        `
      });
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
