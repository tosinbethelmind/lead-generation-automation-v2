'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sun, 
  Search, 
  Building, 
  Database, 
  Zap, 
  ShieldAlert, 
  ArrowLeft,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

export default function AdvancedSolarPipelinePage() {
  const [loading, setLoading] = useState(false);
  const [harvesting, setHarvesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleAction = async (action: string, payload: any = {}) => {
    setLoading(true);
    setStatusMsg('Executing action...');
    try {
      const res = await fetch('/api/admin/solar-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg(data.message || 'Action completed successfully!');
      } else {
        setStatusMsg(`Error: ${data.error || 'Action failed'}`);
      }
    } catch (err: any) {
      setStatusMsg(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: 'calc(100vh - 30px)',
      maxHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '16px',
      gap: '16px',
      boxSizing: 'border-box'
    }}>
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link 
            href="/admin/solar-pipeline"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: 'rgba(255, 255, 255, 0.08)', 
              border: '1px solid var(--panel-border)', 
              borderRadius: '8px', 
              padding: '8px 14px', 
              color: 'var(--text-primary)', 
              textDecoration: 'none', 
              fontWeight: '600', 
              fontSize: '13px' 
            }}
          >
            <ArrowLeft size={16} /> Back to 10K Solar Pipeline
          </Link>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Advanced Engine & Harvest Tools</h1>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Secondary Scraper Controls & Estimator Harvesting Tools</span>
          </div>
        </div>
      </div>

      {/* Main Grid Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', flex: 1, overflowY: 'auto' }}>
        
        {/* Card 1: Harvest Scraped Leads */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building style={{ color: '#06b6d4' }} size={24} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Harvest Scraped Solar Leads</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>
            Sync and harvest pending enterprise leads scraped from commercial registries and directory endpoints into main outreach queue.
          </p>
          <button 
            onClick={() => handleAction('harvest')}
            disabled={loading}
            className="btn-primary"
            style={{ padding: '10px 16px', fontSize: '13px' }}
          >
            <Building size={16} /> Harvest Scraped Leads
          </button>
        </div>

        {/* Card 2: Scrape Solar Companies */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap style={{ color: '#f59e0b' }} size={24} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Secondary Solar Scraper</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>
            Trigger auxiliary solar company directory extraction for commercial B2B power contractors.
          </p>
          <button 
            onClick={() => handleAction('scrape', { mode: 'live-solar' })}
            disabled={loading}
            className="btn-secondary"
            style={{ padding: '10px 16px', fontSize: '13px', background: 'linear-gradient(135deg, #FF9900 0%, #FF5E00 100%)', border: 'none', color: '#fff', fontWeight: '700' }}
          >
            <Zap size={16} /> Scrape Solar Companies
          </button>
        </div>

        {/* Card 3: Dry Run Check */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search style={{ color: '#8b5cf6' }} size={24} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Dry Run Validation</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>
            Run a diagnostic dry run across OpenStreetMap and directory nodes without writing to database.
          </p>
          <button 
            onClick={() => handleAction('scrape', { mode: 'dry-run' })}
            disabled={loading}
            className="btn-secondary"
            style={{ padding: '10px 16px', fontSize: '13px' }}
          >
            <Search size={16} /> Execute Dry Run Check
          </button>
        </div>

        {/* Card 4: Synthetic Lead Generator */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database style={{ color: '#10b981' }} size={24} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Generate 1K Test Leads</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>
            Generate 1,000 synthetic NDPA-compliant leads for system testing and load validation.
          </p>
          <button 
            onClick={() => handleAction('scrape', { mode: 'synthetic', count: 1000 })}
            disabled={loading}
            className="btn-secondary"
            style={{ padding: '10px 16px', fontSize: '13px' }}
          >
            <Database size={16} /> Generate 1K Synthetic Leads
          </button>
        </div>

      </div>

      {/* Status Output Notification */}
      {statusMsg && (
        <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#06b6d4', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} /> {statusMsg}
        </div>
      )}
    </div>
  );
}
