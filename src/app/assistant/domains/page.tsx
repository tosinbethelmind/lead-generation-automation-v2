'use client';

import React, { useState } from 'react';
import { Globe, RefreshCw, CheckCircle } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

export default function AssistantDomainsPage() {
  const [leadId, setLeadId] = useState('');
  const [domainName, setDomainName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleBind = async () => {
    if (!leadId.trim() || !domainName.trim()) {
      setError('Please enter both a Lead ID and a domain name.');
      return;
    }
    setProcessing(true);
    setError('');
    setResult('');
    try {
      const res = await fetch('/api/admin/assistant-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bind_domain', leadId: leadId.trim(), customDomain: domainName.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.message);
        setLeadId('');
        setDomainName('');
      } else {
        setError(data.error || 'Failed to bind domain.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        background: 'rgba(4,20,12,0.8)', border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 16, padding: '20px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Globe style={{ width: 15, height: 15, color: '#10b981' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Domain Binding Tool
          </span>
        </div>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f0fdf4', margin: 0 }}>
          Bind a Custom Domain for a Client
        </h1>
        <p style={{ fontSize: '0.72rem', color: '#4b5563', margin: '4px 0 0' }}>
          Enter the client's Lead ID and the custom domain they registered. This updates the CRM record immediately.
        </p>
      </div>

      <div style={{
        background: 'rgba(4,20,12,0.8)', border: '1px solid rgba(16,185,129,0.12)',
        borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500
      }}>
        <div>
          <label style={labelStyle}>Lead ID</label>
          <input
            id="domain-lead-id"
            value={leadId}
            onChange={e => setLeadId(e.target.value)}
            placeholder="e.g. LEKKI_SOLAR_001"
            style={inputStyle}
          />
          <p style={{ fontSize: '0.67rem', color: '#374151', margin: '4px 0 0' }}>
            Copy the Lead ID from the &quot;My Assigned Leads&quot; page.
          </p>
        </div>

        <div>
          <label style={labelStyle}>Custom Domain Name</label>
          <input
            id="domain-name"
            value={domainName}
            onChange={e => setDomainName(e.target.value)}
            placeholder="e.g. lekkisolar.com"
            style={inputStyle}
          />
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: '0.78rem', color: '#fca5a5'
          }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: '0.78rem', color: '#4ade80',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <CheckCircle style={{ width: 14, height: 14, flexShrink: 0 }} /> {result}
          </div>
        )}

        <button
          id="bind-domain-btn"
          onClick={handleBind}
          disabled={processing}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '13px', borderRadius: 10,
            background: processing ? 'rgba(99,102,241,0.2)' : '#6366f1',
            border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 700,
            cursor: processing ? 'not-allowed' : 'pointer',
            boxShadow: processing ? 'none' : '0 4px 20px rgba(99,102,241,0.3)'
          }}
        >
          {processing
            ? <><RefreshCw style={{ width: 15, height: 15, animation: 'spin 0.8s linear infinite' }} /> Binding Domain...</>
            : <><Globe style={{ width: 15, height: 15 }} /> Bind Domain & Update Records</>
          }
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.7rem', fontWeight: 700,
  color: '#86efac', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em'
};

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(16,185,129,0.15)',
  borderRadius: 10, padding: '10px 14px', color: '#f0fdf4', fontSize: '0.84rem'
};
