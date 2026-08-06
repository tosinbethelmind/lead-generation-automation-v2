'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, CheckCircle, AlertTriangle, Clock, Shield, TrendingUp,
  Copy, Check, RefreshCw, XCircle, ExternalLink, Search, Filter,
  Zap, Star, Crown, Rocket, DollarSign
} from 'lucide-react';

interface TenantRow {
  id: string;
  business_name: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  package_tier: string;
  plan_type: string;
  status: string;
  is_active: boolean;
  days_remaining: number;
  subscription_expiry_iso?: string;
  monthly_renewal_ngn: number;
  features: Record<string, boolean>;
  site_url?: string;
  created_at?: string;
  portal_url: string;
}

interface Stats {
  total: number;
  active: number;
  expired: number;
  suspended: number;
  by_tier: Record<string, number>;
  mrr_ngn: number;
}

const TIER_COLORS: Record<string, string> = {
  starter: '#0ea5e9', pro: '#8b5cf6', vip: '#f59e0b', luxury: '#ec4899'
};

const TIER_ICONS: Record<string, any> = { starter: Zap, pro: Star, vip: Crown, luxury: Rocket };

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'suspended'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [provisionForm, setProvisionForm] = useState({
    business_name: '', owner_name: '', owner_email: '', owner_phone: '',
    package_tier: 'pro', plan_type: 'subscription',
  });
  const [provisionLoading, setProvisionLoading] = useState(false);
  const [provisionResult, setProvisionResult] = useState<any>(null);

  const fetchTenants = async () => {
    try {
      const r = await fetch('/api/tenants/list');
      const d = await r.json();
      if (d.success) { setTenants(d.tenants); setStats(d.stats); }
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchTenants(); }, []);

  const handleAction = async (tenant_id: string, action: 'suspend' | 'renew') => {
    setActionLoading(`${tenant_id}_${action}`);
    await fetch('/api/tenants/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, tenant_id, days: 30 }),
    });
    await fetchTenants();
    setActionLoading(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); });
  };

  const handleProvision = async () => {
    setProvisionLoading(true);
    try {
      const r = await fetch('/api/tenants/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...provisionForm, payment_method: 'admin_manual', payment_reference: `ADMIN_${Date.now()}` }),
      });
      const d = await r.json();
      setProvisionResult(d);
      if (d.success) await fetchTenants();
    } catch (_) {}
    setProvisionLoading(false);
  };

  const filtered = tenants.filter(t => {
    const matchSearch = !search || t.business_name.toLowerCase().includes(search.toLowerCase()) || t.owner_email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus || (filterStatus === 'active' && t.is_active) || (filterStatus === 'expired' && !t.is_active);
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Tenants', value: stats.total, icon: Users, color: '#06b6d4' },
            { label: 'Active', value: stats.active, icon: CheckCircle, color: '#10b981' },
            { label: 'Expired', value: stats.expired, icon: AlertTriangle, color: '#f59e0b' },
            { label: 'MRR (₦)', value: `₦${(stats.mrr_ngn || 0).toLocaleString()}`, icon: TrendingUp, color: '#8b5cf6', small: true },
          ].map(({ label, value, icon: Icon, color, small }) => (
            <div key={label} className="glass-panel" style={{ padding: 20, borderRadius: 14, border: `1px solid ${color}20` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Icon style={{ color, width: 20, height: 20 }} />
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{label}</span>
              </div>
              <p style={{ color, fontSize: small ? '1.2rem' : '1.8rem', fontWeight: 700, margin: 0 }}>{value}</p>
            </div>
          ))}

          {/* Tier breakdown */}
          {Object.entries(stats.by_tier).map(([tier, count]) => {
            const Icon = TIER_ICONS[tier] || Zap;
            const color = TIER_COLORS[tier] || '#06b6d4';
            return (
              <div key={tier} className="glass-panel" style={{ padding: 20, borderRadius: 14, border: `1px solid ${color}20` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Icon style={{ color, width: 20, height: 20 }} />
                  <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'capitalize' }}>{tier}</span>
                </div>
                <p style={{ color, fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>{count}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: 16, height: 16 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenants..."
            style={{ width: '100%', paddingLeft: 36, padding: '10px 14px 10px 36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f8fafc', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all','active','expired','suspended'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                background: filterStatus === s ? 'rgba(6,182,212,0.15)' : 'transparent',
                borderColor: filterStatus === s ? '#06b6d4' : 'rgba(255,255,255,0.08)',
                color: filterStatus === s ? '#06b6d4' : '#64748b' }}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => setShowProvisionModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <Users style={{ width: 16, height: 16 }} /> + Add Tenant
        </button>
        <button onClick={fetchTenants} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RefreshCw style={{ width: 16, height: 16 }} /> Refresh
        </button>
      </div>

      {/* Tenants Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading tenants...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: 60, textAlign: 'center', borderRadius: 16 }}>
          <Users style={{ width: 48, height: 48, color: '#334155', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>No tenants found. Add your first client above.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(tenant => {
            const TierIcon = TIER_ICONS[tenant.package_tier] || Zap;
            const color = TIER_COLORS[tenant.package_tier] || '#06b6d4';
            const isExpiringSoon = tenant.is_active && tenant.days_remaining <= 7;
            return (
              <div key={tenant.id} className="glass-panel" style={{ padding: '16px 20px', borderRadius: 14, border: `1px solid ${tenant.is_active ? 'rgba(255,255,255,0.06)' : 'rgba(239,68,68,0.15)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {/* Tier badge */}
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TierIcon style={{ color, width: 20, height: 20 }} />
                  </div>

                  {/* Business info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h4 style={{ color: '#f8fafc', margin: '0 0 4px', fontWeight: 600 }}>{tenant.business_name}</h4>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      {tenant.owner_email && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{tenant.owner_email}</span>}
                      {tenant.owner_phone && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>📱 {tenant.owner_phone}</span>}
                    </div>
                  </div>

                  {/* Tier + plan */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ background: `${color}20`, color, border: `1px solid ${color}40`, padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                      {tenant.package_tier}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{tenant.plan_type}</span>
                  </div>

                  {/* Status */}
                  <div style={{ textAlign: 'center', minWidth: 100 }}>
                    {tenant.is_active ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
                          <CheckCircle style={{ width: 14 }} /> Active
                        </div>
                        <span style={{ color: isExpiringSoon ? '#f59e0b' : '#64748b', fontSize: '0.75rem' }}>
                          {tenant.plan_type === 'standalone' ? '♾️ Lifetime' : `${tenant.days_remaining}d left`}
                        </span>
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', color: '#ef4444', fontWeight: 600, fontSize: '0.85rem' }}>
                        <XCircle style={{ width: 14 }} /> {tenant.status}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                    {/* Copy portal link */}
                    <button onClick={() => copyToClipboard(tenant.portal_url, tenant.id + '_portal')} title="Copy portal link"
                      style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                      {copiedId === tenant.id + '_portal' ? <><Check style={{ width: 14 }} /> Copied!</> : <><Copy style={{ width: 14 }} /> Portal Link</>}
                    </button>

                    {/* Renew */}
                    <button onClick={() => handleAction(tenant.id, 'renew')} disabled={actionLoading === `${tenant.id}_renew`}
                      style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                      {actionLoading === `${tenant.id}_renew` ? <RefreshCw style={{ width: 14, animation: 'spin 1s linear infinite' }} /> : <RefreshCw style={{ width: 14 }} />}
                      Renew 30d
                    </button>

                    {/* Suspend */}
                    {tenant.status !== 'suspended' && (
                      <button onClick={() => handleAction(tenant.id, 'suspend')} disabled={actionLoading === `${tenant.id}_suspend`}
                        style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                        <XCircle style={{ width: 14 }} /> Suspend
                      </button>
                    )}
                  </div>
                </div>

                {/* Tenant ID row */}
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ color: '#334155', fontSize: '0.7rem' }}>ID: <code style={{ color: '#64748b' }}>{tenant.id}</code></span>
                  <span style={{ color: '#334155', fontSize: '0.7rem' }}>MRR: <strong style={{ color: '#8b5cf6' }}>₦{tenant.monthly_renewal_ngn.toLocaleString()}</strong></span>
                  {tenant.created_at && <span style={{ color: '#334155', fontSize: '0.7rem' }}>Joined: {new Date(tenant.created_at).toLocaleDateString('en-NG')}</span>}
                  <a href={tenant.portal_url} target="_blank" rel="noreferrer" style={{ color: '#06b6d4', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                    <ExternalLink style={{ width: 12 }} /> Open Portal
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Provision Modal */}
      {showProvisionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="glass-panel" style={{ maxWidth: 520, width: '100%', padding: 32, borderRadius: 20 }}>
            {provisionResult?.success ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
                <h2 style={{ color: '#10b981', marginBottom: 8 }}>Tenant Provisioned!</h2>
                <p style={{ color: '#94a3b8', marginBottom: 20 }}>{provisionResult.message}</p>
                <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12, padding: 16, textAlign: 'left', marginBottom: 20 }}>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 6px' }}>Portal URL</p>
                  <p style={{ color: '#06b6d4', fontSize: '0.9rem', margin: '0 0 12px', wordBreak: 'break-all' }}>{provisionResult.portal_url}</p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 6px' }}>Access Token</p>
                  <code style={{ color: '#10b981', fontSize: '0.85rem', wordBreak: 'break-all' }}>{provisionResult.access_token}</code>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => copyToClipboard(provisionResult.portal_url, 'new_portal')} className="btn-secondary" style={{ flex: 1 }}>
                    {copiedId === 'new_portal' ? '✅ Copied!' : '📋 Copy Portal Link'}
                  </button>
                  <button onClick={() => { setShowProvisionModal(false); setProvisionResult(null); setProvisionForm({ business_name:'',owner_name:'',owner_email:'',owner_phone:'',package_tier:'pro',plan_type:'subscription' }); }} className="btn-primary" style={{ flex: 1 }}>
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 style={{ color: '#f8fafc', marginBottom: 24, fontWeight: 700 }}>➕ Provision New Tenant</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { key: 'business_name', label: 'Business Name *', placeholder: 'e.g. Lagos Solar Tech Ltd', required: true },
                    { key: 'owner_name', label: 'Owner Name', placeholder: 'e.g. Chukwuemeka Obi' },
                    { key: 'owner_email', label: 'Email Address *', placeholder: 'e.g. owner@business.com', required: true },
                    { key: 'owner_phone', label: 'Phone (WhatsApp)', placeholder: 'e.g. +2348012345678' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 6 }}>{label}</label>
                      <input value={(provisionForm as any)[key]} onChange={e => setProvisionForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 6 }}>Package Tier</label>
                      <select value={provisionForm.package_tier} onChange={e => setProvisionForm(f => ({ ...f, package_tier: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', outline: 'none' }}>
                        <option value="starter">Starter</option>
                        <option value="pro">Pro (Recommended)</option>
                        <option value="vip">VIP</option>
                        <option value="luxury">Luxury</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 6 }}>Plan Type</label>
                      <select value={provisionForm.plan_type} onChange={e => setProvisionForm(f => ({ ...f, plan_type: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', outline: 'none' }}>
                        <option value="subscription">Subscription (Monthly)</option>
                        <option value="standalone">Standalone (One-Time)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={() => { setShowProvisionModal(false); setProvisionResult(null); }} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                  <button onClick={handleProvision} disabled={provisionLoading || !provisionForm.business_name || !provisionForm.owner_email} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {provisionLoading ? <><RefreshCw style={{ width: 16, animation: 'spin 1s linear infinite' }} /> Creating...</> : '🚀 Provision Tenant'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
