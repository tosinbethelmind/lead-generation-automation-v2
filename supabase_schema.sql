-- ============================================================================
-- Supabase Schema DDL for ApexReach B2B Lead Engine
-- Copy and paste these statements into the SQL Editor in your Supabase Dashboard.
-- ============================================================================

-- 1. Create LEADS table
CREATE TABLE IF NOT EXISTS leads (
    lead_id TEXT PRIMARY KEY,
    source TEXT NOT NULL CHECK (source IN ('GOOGLE', 'JIJI')),
    name TEXT NOT NULL,
    category TEXT,
    address TEXT,
    area TEXT,
    city TEXT,
    phone_e164 TEXT,
    phone_raw TEXT,
    email TEXT,
    website TEXT,
    rating NUMERIC DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    listings_count INTEGER DEFAULT 1,
    profile_url TEXT,
    source_query_or_seed TEXT,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'DO_NOT_CONTACT', 'ERROR')),
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    duplicate_of_lead_id TEXT,
    business_summary TEXT,
    notes TEXT
);

-- Indexing for high-performance lead lookups
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone_e164);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_collected_at ON leads(collected_at DESC);

-- 2. Create DO NOT CONTACT (DNC) table
CREATE TABLE IF NOT EXISTS dnc (
    phone_e164 TEXT PRIMARY KEY,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    reason TEXT
);

-- Indexing for fast E.164 verification checks
CREATE INDEX IF NOT EXISTS idx_dnc_phone ON dnc(phone_e164);

-- 3. Create LOGS table
CREATE TABLE IF NOT EXISTS logs (
    id BIGSERIAL PRIMARY KEY,
    run_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    step TEXT NOT NULL,
    status TEXT CHECK (status IN ('START', 'INFO', 'WARN', 'SUCCESS', 'ERROR')),
    message TEXT NOT NULL
);

-- Indexing for logs streams
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_run_id ON logs(run_id);

-- 4. Create SCRAPE JOBS table for tracking background scraping tasks
CREATE TABLE IF NOT EXISTS scrape_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
    payload JSONB NOT NULL,
    result JSONB,
    error_message TEXT,
    user_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for fast status lookups and job history query performance
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_status ON scrape_jobs(status);
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_created_at ON scrape_jobs(created_at DESC);

-- 5. Create APP_SETTINGS table for durable runtime configuration
-- This allows API keys (Gemini, Paystack, etc.) saved via the UI to survive
-- Vercel / serverless cold starts, where /tmp is ephemeral.
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

