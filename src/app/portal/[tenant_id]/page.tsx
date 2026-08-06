/**
 * @file src/app/portal/[tenant_id]/page.tsx
 * Client Portal Page — Allows tenant users to log in directly into their isolated workspace
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Key, ArrowRight, ShieldCheck, AlertCircle, Building2, CheckCircle } from 'lucide-react';

export default function TenantPortalPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = (params?.tenant_id as string) || '';

  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tenantData, setTenantData] = useState<any>(null);

  useEffect(() => {
    // Check if cookie already holds token
    const tokenCookie = document.cookie.split(';').find(c => c.trim().startsWith('tenant-token='))?.split('=')[1];
    if (tokenCookie) {
      setAccessToken(tokenCookie);
      verifyAndLogin(tokenCookie);
    }
  }, []);

  const verifyAndLogin = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tenants/list?mode=me', {
        headers: { 'x-tenant-token': token },
      });
      const data = await res.json();
      if (data.success && data.tenant) {
        setTenantData(data.tenant);
        // Save cookie
        document.cookie = `tenant-token=${token}; path=/; max-age=2592000`;
        // Redirect to admin dashboard after brief pause
        setTimeout(() => {
          router.push('/admin');
        }, 1200);
      } else {
        setError('Invalid access token or subscription expired.');
      }
    } catch (_) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken.trim()) {
      setError('Please enter your tenant access token.');
      return;
    }
    verifyAndLogin(accessToken.trim());
  };

  return (
    <div style={{ minHeight: '100vh', background: '#07090e', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Inter', sans-serif" }}>
      <div className="glass-panel" style={{ maxWidth: 440, width: '100%', padding: 36, borderRadius: 24, background: 'rgba(7,9,14,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
        
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Sparkles style={{ width: 24, height: 24, color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px', fontFamily: "'Outfit', sans-serif" }}>Client Portal Access</h1>
          <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
            Workspace: <code style={{ color: '#06b6d4' }}>{tenantId || 'Default'}</code>
          </p>
        </div>

        {tenantData ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle style={{ width: 48, height: 48, color: '#10b981', margin: '0 auto 12px' }} />
            <h3 style={{ color: '#f8fafc', fontWeight: 700, margin: '0 0 4px' }}>Welcome, {tenantData.business_name}!</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Logging you into your workspace dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 6 }}>Tenant Access Token</label>
              <div style={{ position: 'relative' }}>
                <Key style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', width: 16, height: 16 }} />
                <input
                  type="password"
                  value={accessToken}
                  onChange={e => setAccessToken(e.target.value)}
                  placeholder="tenant_tok_xxxxxxxxxxxx"
                  style={{ width: '100%', padding: '12px 14px 12px 38px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f8fafc', outline: 'none', boxSizing: 'border-box', fontSize: '0.85rem' }}
                />
              </div>
              <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: 6, marginBotton: 0 }}>
                Sent to your email upon subscription provisioning.
              </p>
            </div>

            {error && (
              <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? 'Authenticating...' : <>Enter Workspace <ArrowRight style={{ width: 16, height: 16 }} /></>}
            </button>

            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <Link href="/marketplace" style={{ color: '#64748b', fontSize: '0.8rem', textDecoration: 'none' }}>
                Don't have a token? View Pricing & Plans →
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
