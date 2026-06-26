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
  ExternalLink,
  X
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
    const hasBypass = typeof window !== 'undefined' && sessionStorage.getItem('bypass-db-check') === 'true';
    if (hasBypass) {
      setVisible(false);
      setChecking(false);
      return;
    }
    setChecking(true);
    try {
      const res = await fetch('/api/db-health');
      if (res.ok) {
        const data: DbHealthResponse = await res.json();
        setHealth(data);
        // Only show setup modal if storageMode is 'supabase' and db check failed
        const isBypassed = typeof window !== 'undefined' && sessionStorage.getItem('bypass-db-check') === 'true';
        setVisible(data.storageMode === 'supabase' && !data.success && !isBypassed);
      } else {
        const data: DbHealthResponse = await res.json();
        setHealth(data);
        const isBypassed = typeof window !== 'undefined' && sessionStorage.getItem('bypass-db-check') === 'true';
        setVisible(data.storageMode === 'supabase' && !isBypassed);
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
      const isBypassed = typeof window !== 'undefined' && sessionStorage.getItem('bypass-db-check') === 'true';
      setVisible(!isBypassed);
    } finally {
      setChecking(false);
    }
  };

  const handleBypass = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('bypass-db-check', 'true');
    }
    setVisible(false);
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
    <div className="db-health-overlay">
      <div className="db-health-card">
        
        {/* Glow Header */}
        <div className="db-health-glow-bar" />
        
        {/* Close Button */}
        <button
          onClick={handleBypass}
          className="db-health-close-btn"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <div className="db-health-content">
          
          {/* Header */}
          <div className="db-health-header">
            <div className="db-health-icon-wrapper">
              <Database size={24} className="spin-anim" />
            </div>
            <div>
              <h2 className="db-health-title">
                Supabase Schema Setup Required
              </h2>
              <p className="db-health-subtitle">
                {health.connected 
                  ? "The database connection is active, but required tables are missing from the schema cache." 
                  : "The Supabase client could not be initialized. Please configure your Supabase URL and Key in settings or environment."}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {health.error && (
            <div className="db-health-error-alert">
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{health.error}</span>
            </div>
          )}

          {/* Checklist of Tables */}
          {health.connected && (
            <div style={{ marginBottom: '24px' }}>
              <h3 className="db-health-section-title">Required Table Schema Status</h3>
              <div className="db-health-table-grid">
                {Object.entries(health.tables).map(([tableName, exists]) => (
                  <div 
                    key={tableName} 
                    className={`db-health-table-item ${exists ? 'ready' : 'missing'}`}
                  >
                    <div className="db-health-table-info">
                      <Database size={16} />
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{tableName}</span>
                    </div>
                    <div className="db-health-table-status">
                      {exists ? (
                        <>
                          <CheckCircle size={16} />
                          <span>Ready</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} />
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
          <div style={{ marginBottom: '24px' }}>
            <h3 className="db-health-section-title">How to resolve this</h3>
            <ol className="db-health-instructions-list">
              <li>
                Open the <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}>Supabase Dashboard</a> and navigate to your project.
              </li>
              <li>
                Click on the <span style={{ color: 'var(--warning)', fontWeight: 600 }}>SQL Editor</span> in the left sidebar.
              </li>
              <li>
                Create a <span style={{ color: 'var(--warning)', fontWeight: 600 }}>New Query</span> and paste the SQL script below.
              </li>
              <li>
                Click <span style={{ color: 'var(--success)', fontWeight: 600 }}>Run</span> to execute the migrations.
              </li>
            </ol>
          </div>

          {/* Copyable SQL Editor */}
          <div className="db-health-code-panel">
            <div className="db-health-code-header">
              <div className="db-health-code-title">
                <Terminal size={14} style={{ color: 'var(--warning)' }} />
                <span>001_init.sql</span>
              </div>
              <button 
                onClick={handleCopySql}
                className="db-health-copy-btn"
              >
                {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <div className="db-health-code-body">
              {MIGRATION_SQL}
            </div>
          </div>

          {/* Actions */}
          <div className="db-health-footer">
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank" 
              rel="noreferrer" 
              className="db-health-dashboard-link"
            >
              <span>Go to Supabase Dashboard</span>
              <ExternalLink size={12} />
            </a>
            
            <div className="db-health-actions">
              <button
                onClick={handleBypass}
                className="db-health-btn-bypass"
              >
                Dismiss & Bypass (Use Fallbacks)
              </button>

              <button 
                onClick={checkHealth}
                disabled={checking}
                className="db-health-btn-recheck"
              >
                {checking ? (
                  <>
                    <Loader2 size={16} className="spin-anim" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    <span>Re-check Connection</span>
                  </>
                )}
              </button>
            </div>
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
