/**
 * @file src/app/marketplace/checkout/page.tsx
 * Public Marketplace Checkout Page — OPay / Moniepoint & Paystack Payment Processing
 */
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Zap, Star, Crown, Rocket, CheckCircle, ArrowRight, Shield, CreditCard,
  Building2, User, Mail, Phone, RefreshCw, Check, Sparkles, AlertCircle
} from 'lucide-react';
import { NIGERIAN_MARKET_TIERS } from '@/lib/pricing';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tierId = searchParams.get('tier') || 'pro';
  const initialPlan = (searchParams.get('plan') as 'subscription' | 'standalone') || 'subscription';

  const [planType, setPlanType] = useState<'subscription' | 'standalone'>(initialPlan);
  const [formData, setFormData] = useState({
    business_name: '',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    payment_method: 'opay', // 'opay' | 'paystack'
    payment_reference: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const tier = NIGERIAN_MARKET_TIERS.find(t => t.id === tierId) || NIGERIAN_MARKET_TIERS[1];
  const price = planType === 'standalone' ? tier.priceNGN : tier.monthlyRenewalNGN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.business_name || !formData.owner_email) {
      setError('Please provide your Business Name and Email Address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/tenants/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: formData.business_name,
          owner_name: formData.owner_name,
          owner_email: formData.owner_email,
          owner_phone: formData.owner_phone,
          package_tier: tier.id,
          plan_type: planType,
          payment_method: formData.payment_method,
          payment_reference: formData.payment_reference || `PAY_${Date.now()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessResult(data);
        // Set tenant token cookie so user is logged in
        document.cookie = `tenant-token=${data.access_token}; path=/; max-age=2592000`;
      } else {
        setError(data.error || 'Provisioning failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during provisioning.');
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (successResult?.access_token) {
      navigator.clipboard.writeText(successResult.access_token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  if (successResult) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: 32, background: 'rgba(7,9,14,0.95)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 24, textDecoration: 'none' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle style={{ width: 36, height: 36, color: '#10b981' }} />
          </div>
          <h2 style={{ color: '#f8fafc', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px' }}>🎉 Workspace Provisioned!</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Welcome to Bethelmind Analytics! Your account is active and ready.</p>
        </div>

        <div style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 16, padding: 24, marginBottom: 28 }}>
          <h3 style={{ color: '#06b6d4', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px', fontWeight: 700 }}>Your Credentials</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.78rem', marginBottom: 4 }}>Business Name</label>
            <p style={{ color: '#f8fafc', fontWeight: 600, margin: 0 }}>{formData.business_name}</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.78rem', marginBottom: 4 }}>Access Token (Keep Private)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <code style={{ flex: 1, padding: '8px 12px', background: 'rgba(0,0,0,0.4)', borderRadius: 8, color: '#10b981', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                {successResult.access_token}
              </code>
              <button onClick={copyToken} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {copiedToken ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.78rem', marginBottom: 4 }}>Portal Link</label>
            <a href={successResult.portal_url} style={{ color: '#06b6d4', fontSize: '0.85rem', wordBreak: 'break-all' }}>{successResult.portal_url}</a>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/admin" style={{ flex: 1, padding: '14px 0', textAlign: 'center', borderRadius: 12, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', fontWeight: 800, textDecoration: 'none', fontSize: '0.95rem' }}>
            Open Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <Link href="/marketplace" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
        ← Back to Marketplace
      </Link>

      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>Checkout</h1>
      <p style={{ color: '#94a3b8', marginBottom: 36 }}>Complete your order to provision your Bethelmind Analytics workspace instantly.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }} className="checkout-grid">
        {/* Left Form */}
        <div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="glass-panel" style={{ padding: 24, borderRadius: 18 }}>
              <h3 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building2 style={{ width: 18, height: 18, color: '#06b6d4' }} /> Business Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 6 }}>Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.business_name}
                    onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="e.g. Lagos Solar Solutions Ltd"
                    style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 6 }}>Owner / Contact Name</label>
                  <input
                    type="text"
                    value={formData.owner_name}
                    onChange={e => setFormData({ ...formData, owner_name: e.target.value })}
                    placeholder="e.g. Chukwuemeka Obi"
                    style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 6 }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.owner_email}
                      onChange={e => setFormData({ ...formData, owner_email: e.target.value })}
                      placeholder="owner@business.com"
                      style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 6 }}>Phone (WhatsApp)</label>
                    <input
                      type="tel"
                      value={formData.owner_phone}
                      onChange={e => setFormData({ ...formData, owner_phone: e.target.value })}
                      placeholder="+234 801 234 5678"
                      style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-panel" style={{ padding: 24, borderRadius: 18 }}>
              <h3 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard style={{ width: 18, height: 18, color: '#10b981' }} /> Payment Method
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, background: formData.payment_method === 'opay' ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${formData.payment_method === 'opay' ? '#06b6d4' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="opay"
                    checked={formData.payment_method === 'opay'}
                    onChange={() => setFormData({ ...formData, payment_method: 'opay' })}
                    style={{ marginTop: 3 }}
                  />
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.9rem', display: 'block' }}>🏦 Direct Bank Transfer (OPay / Moniepoint)</strong>
                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Fastest activation — transfer to account 7034297995 (OPay / Moniepoint)</span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, background: formData.payment_method === 'paystack' ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${formData.payment_method === 'paystack' ? '#8b5cf6' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="paystack"
                    checked={formData.payment_method === 'paystack'}
                    onChange={() => setFormData({ ...formData, payment_method: 'paystack' })}
                    style={{ marginTop: 3 }}
                  />
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.9rem', display: 'block' }}>💳 Card / Paystack Online Payment</strong>
                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Pay instantly via debit card, USSD, or transfer</span>
                  </div>
                </label>
              </div>

              {formData.payment_method === 'opay' && (
                <div style={{ marginTop: 16, padding: 16, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12 }}>
                  <p style={{ color: '#10b981', fontWeight: 700, margin: '0 0 8px', fontSize: '0.85rem' }}>Bank Transfer Details:</p>
                  <p style={{ color: '#f8fafc', margin: '0 0 4px', fontSize: '0.85rem' }}>Bank: <strong>OPay Digital Services / Moniepoint</strong></p>
                  <p style={{ color: '#06b6d4', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 4px' }}>Account: 7034297995</p>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Name: Oyelakin Tosin Matthew</p>

                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.78rem', marginBottom: 4 }}>Transaction Reference / Receipt ID (Optional)</label>
                    <input
                      type="text"
                      value={formData.payment_reference}
                      onChange={e => setFormData({ ...formData, payment_reference: e.target.value })}
                      placeholder="e.g. OPY12345678"
                      style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#f8fafc', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div style={{ padding: 14, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle style={{ width: 16, height: 16 }} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ padding: '16px 0', borderRadius: 14, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 0 30px rgba(6,182,212,0.3)' }}
            >
              {loading ? <><RefreshCw style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> Provisioning Workspace...</> : '🚀 Complete Order & Provision Workspace'}
            </button>
          </form>
        </div>

        {/* Right Summary */}
        <div>
          <div className="glass-panel" style={{ padding: 24, borderRadius: 18, position: 'sticky', top: 100 }}>
            <h3 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, margin: '0 0 16px' }}>Order Summary</h3>

            {/* Plan toggle */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', padding: 3, borderRadius: 10, marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => setPlanType('subscription')}
                style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, background: planType === 'subscription' ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'transparent', color: planType === 'subscription' ? '#fff' : '#64748b', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}
              >
                🔄 Monthly Plan
              </button>
              <button
                type="button"
                onClick={() => setPlanType('standalone')}
                style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, background: planType === 'standalone' ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'transparent', color: planType === 'standalone' ? '#fff' : '#64748b', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}
              >
                ♾️ One-Time
              </button>
            </div>

            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ color: '#f8fafc', fontWeight: 700 }}>{tier.name}</span>
                <span style={{ color: '#06b6d4', fontWeight: 800 }}>₦{price.toLocaleString()}</span>
              </div>
              <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{planType === 'subscription' ? 'Renews monthly at ₦' + tier.monthlyRenewalNGN.toLocaleString() : 'One-time setup fee (Lifetime)'}</span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Included Features:</p>
              {tier.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <CheckCircle style={{ width: 14, height: 14, color: '#10b981' }} />
                  <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{f}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.05rem' }}>Total Due Now</span>
              <span style={{ color: '#10b981', fontWeight: 900, fontSize: '1.4rem' }}>₦{price.toLocaleString()}</span>
            </div>

            <div style={{ marginTop: 20, textAlign: 'center', color: '#475569', fontSize: '0.75rem' }}>
              <Shield style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} /> 30-day money-back guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
