-- ============================================================================
-- Bethelmind Business Solutions — Flagship Products A, B, C Schema Extension
-- Non-destructive migration: preserves all existing tables and data.
-- ============================================================================

-- 1. QUOTATIONS (Product A: SME Revenue & Payment Management)
CREATE TABLE IF NOT EXISTS public.quotations (
    id TEXT PRIMARY KEY,
    quote_reference TEXT UNIQUE NOT NULL,
    tenant_id TEXT NOT NULL DEFAULT 'bethelmind_internal',
    customer_id TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_whatsapp TEXT,
    title TEXT NOT NULL,
    line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal_ngn INTEGER NOT NULL DEFAULT 0,
    discount_ngn INTEGER NOT NULL DEFAULT 0,
    total_ngn INTEGER NOT NULL DEFAULT 0,
    valid_until TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'expired', 'converted')),
    converted_order_id TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quotations_tenant ON public.quotations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);

-- 2. BRANCHES & SUPPLIERS (Product B: Operations & Inventory Control)
CREATE TABLE IF NOT EXISTS public.branches (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'bethelmind_internal',
    name TEXT NOT NULL,
    location TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.suppliers (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'bethelmind_internal',
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.inventory_items (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'bethelmind_internal',
    branch_id TEXT NOT NULL DEFAULT 'main',
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'unit',
    cost_price_ngn INTEGER NOT NULL DEFAULT 0,
    selling_price_ngn INTEGER NOT NULL DEFAULT 0,
    stock_qty INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER NOT NULL DEFAULT 5,
    supplier_id TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inventory_tenant ON public.inventory_items(tenant_id);

CREATE TABLE IF NOT EXISTS public.stock_movements (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'bethelmind_internal',
    item_id TEXT NOT NULL,
    branch_id TEXT NOT NULL DEFAULT 'main',
    movement_type TEXT NOT NULL CHECK (movement_type IN ('purchase', 'sale', 'adjustment', 'transfer')),
    quantity_delta INTEGER NOT NULL,
    unit_cost_ngn INTEGER NOT NULL DEFAULT 0,
    unit_price_ngn INTEGER NOT NULL DEFAULT 0,
    reference TEXT,
    performed_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_tenant ON public.stock_movements(tenant_id);

-- 3. TENANT USERS & RBAC (Strict Tenant Data Isolation)
CREATE TABLE IF NOT EXISTS public.tenant_users (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'sales_agent', 'inventory_clerk', 'accountant')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant ON public.tenant_users(tenant_id);

-- 4. ENQUIRY CRM EXTENSIONS (Product C: Customer Acquisition & Sales Recovery)
ALTER TABLE IF EXISTS public.enquiries
    ADD COLUMN IF NOT EXISTS tenant_id TEXT DEFAULT 'bethelmind_internal',
    ADD COLUMN IF NOT EXISTS assigned_agent TEXT,
    ADD COLUMN IF NOT EXISTS qualification_status TEXT DEFAULT 'new',
    ADD COLUMN IF NOT EXISTS lost_reason TEXT,
    ADD COLUMN IF NOT EXISTS next_follow_up_at TIMESTAMP WITH TIME ZONE;
