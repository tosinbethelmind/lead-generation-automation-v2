'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Check, 
  Loader2, 
  AlertTriangle, 
  RefreshCw, 
  Terminal,
  ExternalLink
} from 'lucide-react';

interface DbHealthResponse {
  success: boolean;
  connected: boolean;
  storageMode?: string;
  tables: Record<string, boolean>;
  missingTables: string[];
  error?: string;
}

export default function DbHealthCheck() {
  const [health, setHealth] = useState<DbHealthResponse | null>(null);
  const [checking, setChecking] = useState(true);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/db-health');
      if (res.ok) {
        const data: DbHealthResponse = await res.json();
        setHealth(data);
        // Only show setup modal if storageMode is 'supabase' and db check failed
        setVisible(data.storageMode === 'supabase' && !data.success);
      } else {
        const data: DbHealthResponse = await res.json();
        setHealth(data);
        setVisible(data.storageMode === 'supabase');
      }
    } catch (e: any) {
      setHealth({
        success: false,
        connected: false,
        storageMode: 'supabase',
        tables: {
          leads: false,
          dnc: false,
          logs: false,
          scrape_jobs: false,
          sync_logs: false,
          outreach_campaigns: false
        },
        missingTables: ['leads', 'dnc', 'logs', 'scrape_jobs', 'sync_logs', 'outreach_campaigns'],
        error: e.message || 'Failed to fetch database health endpoint.'
      });
      // We assume supabase mode might be desired if fetch failed completely, but keep modal hidden unless verified
      setVisible(true);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(MIGRATION_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible || !health) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md bg-black/75 transition-all duration-300">
      <div className="relative w-full max-w-2xl my-8 overflow-hidden transition-all transform border bg-slate-950 border-slate-800 rounded-2xl shadow-2xl">
        
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-amber-500 to-red-500 animate-pulse" />
        
        <div className="p-6 md:p-8">
          
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 shrink-0">
              <Database className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                Supabase Schema Setup Required
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {health.connected 
                  ? "The database connection is active, but required tables are missing from the schema cache." 
                  : "The Supabase client could not be initialized. Please configure your Supabase URL and Key in settings or environment."}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {health.error && (
            <div className="flex gap-2 p-3.5 mb-6 text-sm text-red-400 bg-red-950/20 border border-red-950 rounded-lg">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{health.error}</span>
            </div>
          )}

          {/* Checklist of Tables */}
          {health.connected && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Required Table Schema Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(health.tables).map(([tableName, exists]) => (
                  <div 
                    key={tableName} 
                    className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-colors ${
                      exists 
                        ? 'bg-emerald-950/15 border-emerald-500/20 text-emerald-300' 
                        : 'bg-red-950/15 border-red-500/20 text-red-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Database className={`w-4 h-4 ${exists ? 'text-emerald-400' : 'text-red-400'}`} />
                      <span className="font-mono font-medium">{tableName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider">
                      {exists ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Ready</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span>Missing</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Setup Instructions */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">How to resolve this</h3>
            <ol className="text-sm text-slate-300 space-y-3 list-decimal list-inside pl-1 bg-slate-900/50 p-4 border border-slate-900 rounded-lg">
              <li>
                Open the <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline font-medium inline-flex items-center gap-1">Supabase Dashboard <ExternalLink className="w-3 h-3" /></a> and navigate to your project.
              </li>
              <li>
                Click on the <span className="text-amber-400 font-medium">SQL Editor</span> in the left sidebar.
              </li>
              <li>
                Create a <span className="text-amber-400 font-medium">New Query</span> and paste the SQL script below.
              </li>
              <li>
                Click <span className="text-emerald-400 font-medium">Run</span> to execute the migrations.
              </li>
            </ol>
          </div>

          {/* Copyable SQL Editor */}
          <div className="border border-slate-800 rounded-xl bg-slate-950 overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-amber-500" />
                <span>001_init.sql</span>
              </div>
              <button 
                onClick={handleCopySql}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <div className="p-4 max-h-[160px] overflow-y-auto font-mono text-xs text-slate-400 select-all whitespace-pre">
              {MIGRATION_SQL}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900">
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Go to Supabase Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            
            <button 
              onClick={checkHealth}
              disabled={checking}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-lg font-medium text-sm transition-all shadow-lg hover:shadow-amber-900/20 disabled:opacity-50"
            >
              {checking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Re-check Connection</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// SQL Script to be displayed and copied
const MIGRATION_SQL = `-- ============================================================================
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
CREATE POLICY "Allow public access to outreach_campaigns" ON public.outreach_campaigns FOR ALL USING (true) WITH CHECK (true);`;
