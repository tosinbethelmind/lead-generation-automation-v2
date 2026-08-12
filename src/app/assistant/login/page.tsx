'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Loader2, UserCheck, AlertCircle } from 'lucide-react';

export default function AssistantLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saved_assistant_token');
      if (saved) setToken(saved);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) { setError('Please enter your assistant access token.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/assistant/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (remember) {
          localStorage.setItem('saved_assistant_token', token.trim());
        }
        router.push('/assistant');
      } else {
        setError(data.error || 'Invalid token. Please check and try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020c07 0%, #041a0e 40%, #061f10 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '24px'
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(4, 20, 12, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '20px',
        padding: '48px 44px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 0 60px rgba(16,185,129,0.08), 0 20px 60px rgba(0,0,0,0.5)'
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: 56, height: 56,
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(16,185,129,0.15)'
          }}>
            <UserCheck style={{ width: 28, height: 28, color: '#10b981' }} />
          </div>
          <h1 style={{
            fontSize: '1.6rem', fontWeight: 800, color: '#f0fdf4',
            margin: '0 0 6px', letterSpacing: '-0.02em'
          }}>
            Assistant Workstation
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#4ade80', fontWeight: 600, margin: 0 }}>
            Bethelmind Analytics — Claim & Support Desk
          </p>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '8px 0 0' }}>
            Enter your assigned assistant access token below
          </p>
        </div>

        {/* Access Scope Notice */}
        <div style={{
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.15)',
          borderRadius: '10px',
          padding: '10px 14px',
          marginBottom: '24px',
          display: 'flex', alignItems: 'flex-start', gap: 10
        }}>
          <ShieldCheck style={{ width: 15, height: 15, color: '#10b981', marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: '0.72rem', color: '#86efac', margin: 0, lineHeight: 1.5 }}>
            Your workstation only shows <strong>leads assigned for your action</strong>: website claims, redesigns, and tool integrations.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} method="POST" action="/api/assistant/login" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Hidden username input to trigger browser Password Manager save prompt */}
          <input type="text" name="username" value="assistant@bethelmind.com" readOnly style={{ display: 'none' }} autoComplete="username" />
          
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#86efac', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Assistant Access Token
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="assistant-token-input"
                name="password"
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your token..."
                autoComplete="current-password"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(0,0,0,0.4)',
                  border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.2)'}`,
                  borderRadius: '10px',
                  padding: '12px 44px 12px 14px',
                  color: '#f0fdf4',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#4ade80', padding: 0
                }}
              >
                {showToken ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: '#86efac' }}>
            <input
              type="checkbox"
              id="assistant-remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: '#10b981', cursor: 'pointer' }}
            />
            <label htmlFor="assistant-remember" style={{ cursor: 'pointer', userSelect: 'none' }}>
              Remember me on this browser (30 days persistent login)
            </label>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: '0.78rem', color: '#fca5a5'
            }}>
              <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <button
            id="assistant-login-btn"
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '10px',
              padding: '13px',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(16,185,129,0.25)'
            }}
          >
            {loading ? (
              <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Verifying Token...</>
            ) : (
              <><ShieldCheck style={{ width: 16, height: 16 }} /> Access Duty Workstation</>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#334155', marginTop: 24, marginBottom: 0 }}>
          Contact your manager if you haven&apos;t received your access token.
        </p>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          input::placeholder { color: #334155; }
          input:focus { border-color: rgba(16,185,129,0.5) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.08); }
        `}</style>
      </div>
    </div>
  );
}
