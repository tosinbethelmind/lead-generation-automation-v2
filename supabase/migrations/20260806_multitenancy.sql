-- ============================================================================
-- Multi-Tenancy Migration: Tenants Table + Tenant Isolation
-- ApexReach B2B Lead Generation Platform
-- ============================================================================

-- 1. Create TENANTS master table
CREATE TABLE IF NOT EXISTS public.tenants (
    id TEXT PRIMARY KEY,                          -- e.g. 'tenant_abc123'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    business_name TEXT NOT NULL,
    owner_name TEXT,
    owner_email TEXT,
    owner_phone TEXT,
    package_tier TEXT NOT NULL DEFAULT 'starter' CHECK (package_tier IN ('starter','pro','vip','luxury')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','suspended','pending')),
    access_token TEXT UNIQUE NOT NULL,            -- unique login token for this tenant
    setup_fee_paid BOOLEAN DEFAULT FALSE,
    subscription_start_iso TIMESTAMP WITH TIME ZONE,
    subscription_expiry_iso TIMESTAMP WITH TIME ZONE,
    last_payment_reference TEXT,
    monthly_renewal_ngn INTEGER DEFAULT 0,
    features_enabled JSONB DEFAULT '{"lead_harvester":false,"ai_customer_agent":false,"whatsapp_voice_notes":false,"ai_voice_caller":false,"solar_pipeline":false,"recruitment_engine":false}'::jsonb,
    site_url TEXT,
    custom_domain TEXT,
    notes TEXT,
    payment_method TEXT DEFAULT 'opay',
    plan_type TEXT DEFAULT 'subscription' CHECK (plan_type IN ('standalone','subscription'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenants_status ON public.tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_access_token ON public.tenants(access_token);
CREATE INDEX IF NOT EXISTS idx_tenants_owner_email ON public.tenants(owner_email);
CREATE INDEX IF NOT EXISTS idx_tenants_package_tier ON public.tenants(package_tier);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access to tenants" ON public.tenants;
CREATE POLICY "Service role full access to tenants" ON public.tenants FOR ALL USING (true) WITH CHECK (true);


-- 2. Add tenant_id to LEADS table (with safe default for existing rows)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT 'default';
CREATE INDEX IF NOT EXISTS idx_leads_tenant_id ON public.leads(tenant_id);


-- 3. Add tenant_id to SCRAPE_JOBS table
ALTER TABLE public.scrape_jobs ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT 'default';
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_tenant_id ON public.scrape_jobs(tenant_id);


-- 4. Add tenant_id to OUTREACH_CAMPAIGNS table
ALTER TABLE public.outreach_campaigns ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT 'default';
CREATE INDEX IF NOT EXISTS idx_outreach_campaigns_tenant_id ON public.outreach_campaigns(tenant_id);


-- 5. Add tenant_id to LOGS table
ALTER TABLE public.logs ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT 'default';
CREATE INDEX IF NOT EXISTS idx_logs_tenant_id ON public.logs(tenant_id);


-- 6. Create CLIENT_SUBSCRIPTIONS table in Supabase (mirrors local_db/client_subscriptions.json)
CREATE TABLE IF NOT EXISTS public.client_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id TEXT UNIQUE NOT NULL,
    business_name TEXT NOT NULL,
    contact_phone TEXT,
    contact_email TEXT,
    package_tier TEXT NOT NULL DEFAULT 'pro' CHECK (package_tier IN ('starter','pro','vip','luxury')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','pending_opay_verification','suspended')),
    setup_fee_paid BOOLEAN DEFAULT FALSE,
    opay_account_number TEXT,
    opay_account_name TEXT,
    subscription_start_iso TIMESTAMP WITH TIME ZONE,
    subscription_expiry_iso TIMESTAMP WITH TIME ZONE,
    last_payment_reference TEXT,
    features_enabled JSONB DEFAULT '{}'::jsonb,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_client_subscriptions_tenant_id ON public.client_subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_client_subscriptions_client_id ON public.client_subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_client_subscriptions_status ON public.client_subscriptions(status);

ALTER TABLE public.client_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access to client_subscriptions" ON public.client_subscriptions;
CREATE POLICY "Service role full access to client_subscriptions" ON public.client_subscriptions FOR ALL USING (true) WITH CHECK (true);


-- 7. Create MARKETPLACE_ORDERS table to track all sales
CREATE TABLE IF NOT EXISTS public.marketplace_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    tenant_id TEXT REFERENCES public.tenants(id),
    order_reference TEXT UNIQUE NOT NULL,
    business_name TEXT NOT NULL,
    buyer_name TEXT,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT,
    package_tier TEXT NOT NULL,
    plan_type TEXT NOT NULL DEFAULT 'subscription',
    amount_ngn INTEGER NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'paystack',
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
    payment_reference TEXT,
    provisioned BOOLEAN DEFAULT FALSE,
    provisioned_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_buyer_email ON public.marketplace_orders(buyer_email);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_payment_status ON public.marketplace_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_created_at ON public.marketplace_orders(created_at DESC);

ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access to marketplace_orders" ON public.marketplace_orders;
CREATE POLICY "Service role full access to marketplace_orders" ON public.marketplace_orders FOR ALL USING (true) WITH CHECK (true);
