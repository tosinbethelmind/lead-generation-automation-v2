'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, Zap, Crown, Star, Rocket, CreditCard, RefreshCw, Phone, Mail, ExternalLink } from 'lucide-react';

interface TenantInfo {
  id: string;
  business_name: string;
  package_tier: string;
  plan_type: string;
  status: string;
  is_active: boolean;
  days_remaining: number;
  subscription_expiry_iso?: string;
  features: Record<string, boolean>;
  site_url?: string;
  monthly_renewal_ngn: number;
  created_at?: string;
}

const TIER_ICONS: Record<string, any> = {
  starter: Zap,
  pro: Star,
  vip: Crown,
  luxury: Rocket,
};

const TIER_COLORS: Record<string, { gradient: string; border: string; badge: string }> = {
  starter: { gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)', border: '#0ea5e9', badge: '#0ea5e9' },
  pro: { gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: '#8b5cf6', badge: '#8b5cf6' },
  vip: { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '#f59e0b', badge: '#f59e0b' },
  luxury: { gradient: 'linear-gradient(135deg, #ec4899, #be185d)', border: '#ec4899', badge: '#ec4899' },
};

const TIER_MONTHLY_PRICE: Record<string, number> = {
  starter: 15000,
  pro: 35000,
  vip: 75000,
  luxury: 150000,
};

export default function SubscriptionPage() {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [opayDetails, setOpayDetails] = useState<{ accountNumber: string; accountName: string; bankName: string } | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [renewalStatus, setRenewalStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [paymentRef, setPaymentRef] = useState('');

  useEffect(() => {
    const tokenCookie = document.cookie.split(';').find(c => c.trim().startsWith('tenant-token='))?.split('=')[1];
    if (!tokenCookie) { setLoading(false); return; }

    fetch('/api/tenants/list?mode=me', { headers: { 'x-tenant-token': tokenCookie } })
      .then(r => r.json())
      .then(d => { if (d.success) setTenant(d.tenant); })
      .finally(() => setLoading(false));

    fetch('/api/settings/payment-details')
      .then(r => r.json())
      .then(d => { if (d.opay) setOpayDetails(d.opay); })
      .catch(() => {});
  }, []);

  const handleRenew = async () => {
    if (!paymentRef.trim()) return;
    setRenewalStatus('submitting');
    try {
      const res = await fetch('/api/tenants/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'renew', tenant_id: tenant?.id, days: 30 }),
      });
      const data = await res.json();
      if (data.success) {
        setRenewalStatus('success');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setRenewalStatus('error');
      }
    } catch (_) {
      setRenewalStatus('error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div className="spinner" /><span style={{ marginLeft: 12, color: '#94a3b8' }}>Loading subscription...</span>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 40px' }}>
        <AlertTriangle style={{ width: 48, height: 48, color: '#f59e0b', margin: '0 auto 16px' }} />
        <h2 style={{ color: '#f8fafc', marginBottom: 8 }}>No Subscription Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>You are not logged in as a tenant. Please log in via your portal link.</p>
        <a href="/marketplace" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <ExternalLink style={{ width: 16, height: 16 }} /> View Plans
        </a>
      </div>
    );
  }

  const TierIcon = TIER_ICONS[tenant.package_tier] || Star;
  const tierColor = TIER_COLORS[tenant.package_tier] || TIER_COLORS.pro;
  const isExpiringSoon = tenant.days_remaining > 0 && tenant.days_remaining <= 7;
  const isExpired = !tenant.is_active;

  const featureLabels: Record<string, string> = {
    lead_harvester: '🎯 10K Lagos B2B Lead Harvester',
    ai_customer_agent: '🤖 24/7 Customer AI Agent',
    whatsapp_voice_notes: '🎙️ WhatsApp Voice Note Generator',
    ai_voice_caller: '📞 AI Voice Caller (Outbound)',
    solar_pipeline: '☀️ Solar Quote Pro Pipeline',
    recruitment_engine: '👥 Recruitment Engine',
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header Status Banner */}
      {isExpired && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle style={{ color: '#ef4444', flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#ef4444' }}>Subscription Expired</strong>
            <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '0.875rem' }}>Your tools have been paused. Renew now to restore full access instantly.</p>
          </div>
          <button onClick={() => setShowPaymentModal(true)} className="btn-primary" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
            Renew Now
          </button>
        </div>
      )}

      {isExpiringSoon && !isExpired && (
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Clock style={{ color: '#f59e0b', flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#f59e0b' }}>Expires in {tenant.days_remaining} day{tenant.days_remaining !== 1 ? 's' : ''}</strong>
            <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '0.875rem' }}>Renew before expiry to avoid interruption.</p>
          </div>
          <button onClick={() => setShowPaymentModal(true)} className="btn-secondary" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
            Renew Early
          </button>
        </div>
      )}

      {/* Subscription Card */}
      <div className="glass-panel" style={{ padding: 32, borderRadius: 20, border: `1px solid ${tierColor.border}30`, background: `linear-gradient(135deg, rgba(7,9,14,0.9), rgba(7,9,14,0.7))`, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: `${tierColor.border}15`, border: `1px solid ${tierColor.border}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TierIcon style={{ width: 32, height: 32, color: tierColor.badge }} />
            </div>
            <div>
              <h2 style={{ color: '#f8fafc', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{tenant.business_name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span style={{ background: `${tierColor.badge}20`, color: tierColor.badge, border: `1px solid ${tierColor.badge}40`, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {tenant.package_tier} plan
                </span>
                <span style={{ background: tenant.plan_type === 'standalone' ? 'rgba(16,185,129,0.15)' : 'rgba(6,182,212,0.15)', color: tenant.plan_type === 'standalone' ? '#10b981' : '#06b6d4', border: `1px solid ${tenant.plan_type === 'standalone' ? '#10b98130' : '#06b6d430'}`, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
                  {tenant.plan_type === 'standalone' ? '♾️ Lifetime' : '🔄 Monthly'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginBottom: 8 }}>
              {tenant.is_active ? (
                <><CheckCircle style={{ color: '#10b981', width: 18 }} /><span style={{ color: '#10b981', fontWeight: 600 }}>Active</span></>
              ) : (
                <><AlertTriangle style={{ color: '#ef4444', width: 18 }} /><span style={{ color: '#ef4444', fontWeight: 600 }}>Expired</span></>
              )}
            </div>
            {tenant.plan_type === 'subscription' && (
              <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>
                {isExpired ? 'Expired' : `${tenant.days_remaining} days remaining`}
                {tenant.subscription_expiry_iso && (
                  <><br /><span>Renews: {new Date(tenant.subscription_expiry_iso).toLocaleDateString('en-NG')}</span></>
                )}
              </p>
            )}
            {tenant.plan_type === 'standalone' && (
              <p style={{ color: '#10b981', fontSize: '0.8rem' }}>✅ Lifetime Access — No Renewal Needed</p>
            )}
          </div>
        </div>

        {/* Progress bar for subscription countdown */}
        {tenant.plan_type === 'subscription' && tenant.is_active && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: 6 }}>
              <span>Subscription Period</span>
              <span>{Math.max(0, tenant.days_remaining)}/30 days remaining</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 3, background: tenant.days_remaining > 10 ? '#10b981' : tenant.days_remaining > 5 ? '#f59e0b' : '#ef4444', width: `${Math.max(0, Math.min(100, (tenant.days_remaining / 30) * 100))}%`, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Your Tools & Features</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {Object.entries(featureLabels).map(([key, label]) => {
            const enabled = tenant.features[key];
            return (
              <div key={key} style={{ background: enabled ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${enabled ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: enabled ? '#10b981' : '#334155', flexShrink: 0 }} />
                <span style={{ color: enabled ? '#f8fafc' : '#475569', fontSize: '0.875rem' }}>{label}</span>
                {!enabled && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>Upgrade</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Renewal Section */}
      {tenant.plan_type === 'subscription' && (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ color: '#f8fafc', margin: '0 0 4px', fontWeight: 600 }}>Monthly Renewal</h3>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>
                ₦{(tenant.monthly_renewal_ngn || TIER_MONTHLY_PRICE[tenant.package_tier] || 0).toLocaleString()}/month — OPay / Moniepoint bank transfer
              </p>
            </div>
            <button onClick={() => setShowPaymentModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard style={{ width: 16, height: 16 }} /> Renew Subscription
            </button>
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <a href="/marketplace?upgrade=true" style={{ color: '#8b5cf6', fontSize: '0.875rem', textDecoration: 'none' }}>
          ⬆️ Upgrade Plan to unlock more features →
        </a>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && opayDetails && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="glass-panel" style={{ maxWidth: 480, width: '100%', padding: 32, borderRadius: 20 }}>
            <h2 style={{ color: '#f8fafc', marginBottom: 8, fontWeight: 700 }}>💳 Renew Subscription</h2>
            <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: '0.875rem' }}>
              Make a bank transfer of <strong style={{ color: '#10b981' }}>₦{(tenant.monthly_renewal_ngn || TIER_MONTHLY_PRICE[tenant.package_tier] || 0).toLocaleString()}</strong> to:
            </p>

            <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: '0.8rem' }}>Bank Name</p>
              <p style={{ margin: '0 0 16px', color: '#f8fafc', fontWeight: 600 }}>{opayDetails.bankName}</p>
              <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: '0.8rem' }}>Account Number</p>
              <p style={{ margin: '0 0 16px', color: '#06b6d4', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.05em' }}>{opayDetails.accountNumber}</p>
              <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: '0.8rem' }}>Account Name</p>
              <p style={{ margin: 0, color: '#f8fafc', fontWeight: 600 }}>{opayDetails.accountName}</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', marginBottom: 8 }}>Payment Reference / Receipt Number</label>
              <input
                type="text"
                value={paymentRef}
                onChange={e => setPaymentRef(e.target.value)}
                placeholder="e.g. OPY12345678 or receipt screenshot ID"
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowPaymentModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleRenew} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} disabled={renewalStatus === 'submitting'}>
                {renewalStatus === 'submitting' ? (<><RefreshCw style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Processing...</>) : renewalStatus === 'success' ? '✅ Done!' : '✅ Submit for Verification'}
              </button>
            </div>
            {renewalStatus === 'error' && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: 8, textAlign: 'center' }}>⚠️ Error submitting. Please contact admin on WhatsApp.</p>}
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 12, textAlign: 'center' }}>Admin will verify and reactivate within minutes.</p>
          </div>
        </div>
      )}
    </div>
  );
}
