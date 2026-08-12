'use client';

import React, { useState, useEffect } from 'react';
import { Layers, RefreshCw, Phone, Mail, CheckCircle, Sparkles, Wrench } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  notes: string;
  taskType: string;
}

const taskBadge = (type: string) => {
  if (type === 'redesign') return { label: '🎨 Redesign', color: '#f59e0b' };
  if (type === 'tool_integration') return { label: '🔧 Tool Setup', color: '#6366f1' };
  return { label: '✅ Claim', color: '#10b981' };
};

export default function AssistantLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/assistant-tasks');
      const data = await res.json();
      if (res.ok && data.success) {
        const mapped = (data.alerts || []).map((l: any) => {
          const notes = (l.notes || '').toLowerCase();
          let taskType = 'claim';
          if (notes.includes('[redesign_pending: true]') || notes.includes('custom instructions')) taskType = 'redesign';
          else if (notes.includes('tool') || notes.includes('widget')) taskType = 'tool_integration';
          return { ...l, taskType };
        });
        setLeads(mapped);
      }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  const filtered = leads.filter(l =>
    !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        background: 'rgba(4,20,12,0.8)', border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 16, padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Layers style={{ width: 15, height: 15, color: '#10b981' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              My Assigned Leads
            </span>
          </div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f0fdf4', margin: 0 }}>
            Leads Requiring Your Assistance
          </h1>
          <p style={{ fontSize: '0.72rem', color: '#4b5563', margin: '4px 0 0' }}>
            Only shows leads flagged for claim verification, AI redesign, or tool integration setup.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            style={{
              background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(16,185,129,0.15)',
              borderRadius: 8, padding: '8px 12px', color: '#f0fdf4', fontSize: '0.78rem'
            }}
          />
          <button onClick={fetchLeads} disabled={loading} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            color: '#10b981', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer'
          }}>
            <RefreshCw style={{ width: 13, height: 13, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Leads grid */}
      {filtered.length === 0 ? (
        <div style={{
          background: 'rgba(4,20,12,0.7)', border: '1px dashed rgba(16,185,129,0.15)',
          borderRadius: 16, padding: '60px 20px', textAlign: 'center', color: '#374151'
        }}>
          <CheckCircle style={{ width: 40, height: 40, color: '#10b981', margin: '0 auto 14px', opacity: 0.4 }} />
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>No assigned leads found.</p>
          <p style={{ fontSize: '0.72rem', marginTop: 4 }}>Your manager will assign leads to your queue when action is needed.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(lead => {
            const badge = taskBadge(lead.taskType);
            return (
              <div key={lead.id} style={{
                background: 'rgba(4,20,12,0.8)', border: '1px solid rgba(16,185,129,0.1)',
                borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#f0fdf4', fontSize: '0.9rem' }}>{lead.name}</div>
                    <div style={{ fontSize: '0.65rem', color: '#374151', fontFamily: 'monospace', marginTop: 2 }}>{lead.id}</div>
                  </div>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    padding: '3px 8px', borderRadius: 20,
                    background: `${badge.color}15`, border: `1px solid ${badge.color}30`,
                    color: badge.color, whiteSpace: 'nowrap'
                  }}>
                    {badge.label}
                  </span>
                </div>

                {lead.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#4ade80' }}>
                    <Phone style={{ width: 12, height: 12 }} /> {lead.phone}
                  </div>
                )}

                {lead.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#6b7280' }}>
                    <Mail style={{ width: 12, height: 12 }} /> {lead.email}
                  </div>
                )}

                <div style={{
                  fontSize: '0.68rem', color: '#4b5563', fontFamily: 'monospace',
                  background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: 8,
                  maxHeight: 52, overflow: 'hidden', lineHeight: 1.5
                }}>
                  {lead.notes || 'No notes available.'}
                </div>

                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#10b981' }}>
                  Status: <span style={{ color: '#4ade80' }}>{lead.status || 'PENDING'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
