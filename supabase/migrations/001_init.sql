-- ============================================================================
-- Supabase Schema DDL Migration for ApexReach B2B Lead Engine
-- Creates all tables with id (uuid primary key), created_at (timestamptz) and RLS.
-- ============================================================================

-- 1. Create SCRAPE JOBS table
CREATE TABLE IF NOT EXISTS public.scrape_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
    payload JSONB NOT NULL,
    result JSONB,
    error_message TEXT,
    user_id TEXT,
    scrape_provider TEXT,
    query TEXT,
    result_count INTEGER DEFAULT 0
);

-- Indexing for scrape_jobs
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_status ON public.scrape_jobs(status);
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_created_at ON public.scrape_jobs(created_at DESC);

-- Enable RLS and create policy for scrape_jobs
ALTER TABLE public.scrape_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to scrape_jobs" ON public.scrape_jobs;
CREATE POLICY "Allow public access to scrape_jobs" ON public.scrape_jobs FOR ALL USING (true) WITH CHECK (true);


-- 2. Create LEADS table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    lead_id TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    name TEXT NOT NULL,
    business_name TEXT,
    category TEXT,
    address TEXT,
    area TEXT,
    city TEXT,
    phone TEXT,
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
    query TEXT,
    scrape_provider TEXT,
    status TEXT DEFAULT 'NEW',
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    duplicate_of_lead_id TEXT,
    business_summary TEXT,
    notes TEXT,
    lifecycle_stage TEXT DEFAULT 'lead',
    outreach_sent BOOLEAN DEFAULT FALSE
);

-- Indexing for leads
CREATE INDEX IF NOT EXISTS idx_leads_lead_id ON public.leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone_e164);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_collected_at ON public.leads(collected_at DESC);

-- Enable RLS and create policy for leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to leads" ON public.leads;
CREATE POLICY "Allow public access to leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);


-- 3. Create DO NOT CONTACT (DNC) table
CREATE TABLE IF NOT EXISTS public.dnc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    phone_e164 TEXT UNIQUE NOT NULL,
    reason TEXT
);

-- Indexing for dnc
CREATE INDEX IF NOT EXISTS idx_dnc_phone ON public.dnc(phone_e164);
CREATE INDEX IF NOT EXISTS idx_dnc_added_at ON public.dnc(added_at DESC);

-- Enable RLS and create policy for dnc
ALTER TABLE public.dnc ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to dnc" ON public.dnc;
CREATE POLICY "Allow public access to dnc" ON public.dnc FOR ALL USING (true) WITH CHECK (true);


-- 4. Create LOGS table
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    run_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    step TEXT NOT NULL,
    status TEXT CHECK (status IN ('START', 'INFO', 'WARN', 'SUCCESS', 'ERROR')),
    message TEXT NOT NULL
);

-- Indexing for logs
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON public.logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_run_id ON public.logs(run_id);

-- Enable RLS and create policy for logs
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to logs" ON public.logs;
CREATE POLICY "Allow public access to logs" ON public.logs FOR ALL USING (true) WITH CHECK (true);


-- 5. Create SYNC LOGS table
CREATE TABLE IF NOT EXISTS public.sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    job_id UUID,
    status TEXT NOT NULL,
    message TEXT,
    result_count INTEGER DEFAULT 0
);

-- Indexing for sync_logs
CREATE INDEX IF NOT EXISTS idx_sync_logs_job_id ON public.sync_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON public.sync_logs(created_at DESC);

-- Enable RLS and create policy for sync_logs
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to sync_logs" ON public.sync_logs;
CREATE POLICY "Allow public access to sync_logs" ON public.sync_logs FOR ALL USING (true) WITH CHECK (true);


-- 6. Create OUTREACH CAMPAIGNS table
CREATE TABLE IF NOT EXISTS public.outreach_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    scrape_provider TEXT,
    query TEXT,
    lifecycle_stage TEXT,
    outreach_sent INTEGER DEFAULT 0
);

-- Indexing for outreach_campaigns
CREATE INDEX IF NOT EXISTS idx_outreach_campaigns_created_at ON public.outreach_campaigns(created_at DESC);

-- Enable RLS and create policy for outreach_campaigns
ALTER TABLE public.outreach_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to outreach_campaigns" ON public.outreach_campaigns;
CREATE POLICY "Allow public access to outreach_campaigns" ON public.outreach_campaigns FOR ALL USING (true) WITH CHECK (true);
