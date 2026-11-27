-- ============================================================================
-- Phase 3: Authoritative Three-Division Commercial Infrastructure
-- Bethelmind Analytics & Digital Solutions (CAC Reg: 9912717)
-- Preserves all existing tables (leads, tenants, marketplace_orders, etc.)
-- ============================================================================

-- 1. CUSTOMERS (Authoritative Customer Identity & Consent Registry)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_ref TEXT UNIQUE,
    lead_id TEXT,
    name TEXT NOT NULL,
    email TEXT,
    whatsapp_number TEXT,
    company_name TEXT,
    consent_status TEXT NOT NULL DEFAULT 'pending' CHECK (consent_status IN ('opted_in', 'opted_out', 'pending')),
    consent_updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_whatsapp ON public.customers(whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_customers_lead_id ON public.customers(lead_id);

-- 2. PRODUCTS (Editable 3-Division Commercial Catalogue)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    division TEXT NOT NULL CHECK (division IN (
        'digital_business_solutions',
        'business_automation',
        'business_intelligence',
        'digital_asset'
    )),
    price_ngn INTEGER NOT NULL,
    price_max_ngn INTEGER,
    monthly_maintenance_ngn INTEGER DEFAULT 0,
    deposit_percent INTEGER NOT NULL DEFAULT 60 CHECK (deposit_percent BETWEEN 10 AND 100),
    description TEXT NOT NULL,
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
    data_sources TEXT,
    limitations TEXT,
    turnaround_time TEXT,
    fulfilment_type TEXT NOT NULL CHECK (fulfilment_type IN (
        'website_project',
        'automation_project',
        'research_project',
        'digital_product',
        'business_audit'
    )),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_division ON public.products(division);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);

-- 3. ORDERS (Authoritative Order Ledger across All 3 Divisions)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_reference TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    lead_id TEXT,
    division TEXT NOT NULL,
    package_name TEXT NOT NULL,
    total_amount_ngn INTEGER NOT NULL,
    deposit_amount_ngn INTEGER NOT NULL,
    balance_amount_ngn INTEGER NOT NULL DEFAULT 0,
    amount_paid_ngn INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'NGN',
    payment_stage TEXT NOT NULL DEFAULT 'deposit' CHECK (payment_stage IN ('deposit', 'balance', 'full')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN (
        'pending',
        'pending_manual_verification',
        'deposit_paid',
        'paid',
        'failed',
        'refunded',
        'disputed'
    )),
    fulfilment_status TEXT NOT NULL DEFAULT 'pending' CHECK (fulfilment_status IN (
        'pending',
        'queued',
        'in_progress',
        'awaiting_approval',
        'completed',
        'exception'
    )),
    payment_provider TEXT NOT NULL DEFAULT 'paystack',
    transaction_reference TEXT,
    affiliate_code TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfilment_status ON public.orders(fulfilment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 4. TRANSACTIONS (Idempotent Payment Verification & Audit Ledger)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('paystack', 'selar', 'moniepoint', 'opay', 'manual')),
    provider_reference TEXT NOT NULL,
    expected_amount_ngn INTEGER NOT NULL,
    verified_amount_ngn INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'NGN',
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN (
        'pending',
        'verified',
        'failed',
        'amount_mismatch',
        'currency_mismatch',
        'refunded',
        'reversed'
    )),
    webhook_event_id TEXT UNIQUE,
    raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON public.transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_provider_ref ON public.transactions(provider, provider_reference);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(verification_status);

-- 5. PROJECTS (Fulfilment Tracking for Websites, Automation & Research)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    lead_id TEXT,
    division TEXT NOT NULL,
    service_type TEXT NOT NULL,
    project_status TEXT NOT NULL DEFAULT 'onboarding' CHECK (project_status IN (
        'onboarding',
        'in_progress',
        'preview_ready',
        'client_approved',
        'final_payment_pending',
        'handed_over',
        'active_maintenance',
        'paused'
    )),
    delivery_deadline TIMESTAMP WITH TIME ZONE,
    assigned_person TEXT DEFAULT 'Delivery Desk',
    quality_approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (quality_approval_status IN (
        'pending',
        'approved',
        'revision_requested'
    )),
    client_approval_at TIMESTAMP WITH TIME ZONE,
    deliverable_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_order_id ON public.projects(order_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(project_status);

-- 6. FULFILMENT_EXCEPTIONS (Retry & Exception Queue — Never Silently Lose an Order)
CREATE TABLE IF NOT EXISTS public.fulfilment_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    workflow_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'retrying', 'resolved')),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fulfilment_exceptions_status ON public.fulfilment_exceptions(status);

-- 7. WHATSAPP_MESSAGE_AUDIT (Compliant Opt-In / Opt-Out & Audit Records)
CREATE TABLE IF NOT EXISTS public.whatsapp_message_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    phone_e164 TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    provider TEXT NOT NULL DEFAULT 'meta_cloud' CHECK (provider IN ('meta_cloud', 'evolution', 'manual')),
    message_type TEXT NOT NULL DEFAULT 'text',
    template_name TEXT,
    content_summary TEXT,
    opt_in_verified BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'queued',
    provider_message_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wa_audit_phone ON public.whatsapp_message_audit(phone_e164);
CREATE INDEX IF NOT EXISTS idx_wa_audit_created ON public.whatsapp_message_audit(created_at DESC);

-- 8. MAINTENANCE_SUBSCRIPTIONS (Division 2 Monthly Retainer Tracking)
CREATE TABLE IF NOT EXISTS public.maintenance_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    monthly_fee_ngn INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'paused', 'cancelled')),
    next_billing_date TIMESTAMP WITH TIME ZONE,
    last_renewal_notified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS across all new commercial tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fulfilment_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_message_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_subscriptions ENABLE ROW LEVEL SECURITY;

-- Service Role full access policies
CREATE POLICY "Service role full access on customers" ON public.customers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on products" ON public.products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (active = TRUE);
CREATE POLICY "Service role full access on orders" ON public.orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on transactions" ON public.transactions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on projects" ON public.projects FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on fulfilment_exceptions" ON public.fulfilment_exceptions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on whatsapp_message_audit" ON public.whatsapp_message_audit FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on maintenance_subscriptions" ON public.maintenance_subscriptions FOR ALL USING (auth.role() = 'service_role');

-- Tighten legacy multitenancy RLS policies safely if those tables exist
DO $$
BEGIN
  IF to_regclass('public.tenants') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Service role full access to tenants" ON public.tenants;
    CREATE POLICY "Service role full access to tenants" ON public.tenants FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;
  IF to_regclass('public.client_subscriptions') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Service role full access to client_subscriptions" ON public.client_subscriptions;
    CREATE POLICY "Service role full access to client_subscriptions" ON public.client_subscriptions FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;
  IF to_regclass('public.marketplace_orders') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Service role full access to marketplace_orders" ON public.marketplace_orders;
    CREATE POLICY "Service role full access to marketplace_orders" ON public.marketplace_orders FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;


-- 9. ENQUIRIES (Google Ads & Website Consultation Pipeline)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    business_name TEXT,
    email TEXT,
    selected_service TEXT NOT NULL,
    selected_package TEXT,
    agreed_price_ngn INTEGER,
    message TEXT,
    source TEXT NOT NULL DEFAULT 'website',
    gclid TEXT,
    gbraid TEXT,
    wbraid TEXT,
    utm_campaign TEXT,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN (
        'NEW', 'CONTACTED', 'QUOTE SENT', 'AWAITING PAYMENT', 'PAID', 'IN PROGRESS', 'COMPLETED', 'LOST'
    )),
    follow_up_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);

-- 10. PORTFOLIO_ITEMS (Genuine Client & Demonstration Showcases)
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    project_type TEXT NOT NULL DEFAULT 'demonstration' CHECK (project_type IN ('demonstration', 'completed_client')),
    live_url TEXT NOT NULL,
    screenshot_url TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on enquiries" ON public.enquiries FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on portfolio_items" ON public.portfolio_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public read portfolio_items" ON public.portfolio_items FOR SELECT USING (true);
