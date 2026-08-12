'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell, Globe, LogOut, MessageCircle, CheckCircle,
  Eye, Layers, UserCheck, ShieldCheck, FileText
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Claim & Duty Desk', path: '/assistant', icon: Bell, badge: 'Live Alerts' },
  { name: 'My Assigned Leads', path: '/assistant/leads', icon: Layers },
  { name: 'WhatsApp Outreach', path: '/assistant/outreach', icon: MessageCircle },
  { name: 'Domain Binding', path: '/assistant/domains', icon: Globe },
  { name: 'My Activity Log', path: '/assistant/log', icon: FileText },
];

export default function AssistantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<{ name: string; role: string } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/assistant/me')
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        if (data.success) setUser(data.user);
        else router.replace('/assistant/login');
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        if (pathname !== '/assistant/login') router.replace('/assistant/login');
      });
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = 'assistant-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/assistant/login');
  };

  if (pathname === '/assistant/login') return <>{children}</>;

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#020c07',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#10b981' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid rgba(16,185,129,0.2)',
            borderTopColor: '#10b981', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ fontSize: '0.85rem', color: '#4ade80' }}>Verifying session...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#020c07', color: '#f0fdf4',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* ─── SIDEBAR ─── */}
      <aside style={{
        width: 250, flexShrink: 0,
        background: 'rgba(4,20,12,0.95)',
        borderRight: '1px solid rgba(16,185,129,0.1)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 14px',
        height: '100vh', position: 'sticky', top: 0,
        backdropFilter: 'blur(12px)'
      }}>
        {/* Brand */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          paddingBottom: 20, marginBottom: 20,
          borderBottom: '1px solid rgba(16,185,129,0.1)'
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <UserCheck style={{ width: 18, height: 18, color: '#10b981' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f0fdf4', lineHeight: 1.2 }}>
              Assistant Desk
            </div>
            <div style={{
              fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.05em', color: '#10b981',
              background: 'rgba(16,185,129,0.1)', padding: '1px 6px',
              borderRadius: 4, marginTop: 2, display: 'inline-block'
            }}>
              Duty Workstation
            </div>
          </div>
        </div>

        {/* User badge */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            background: 'rgba(16,185,129,0.05)',
            border: '1px solid rgba(16,185,129,0.1)',
            marginBottom: 20
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', fontWeight: 700, color: '#fff'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f0fdf4' }}>{user.name}</div>
              <div style={{ fontSize: '0.68rem', color: '#10b981', textTransform: 'capitalize' }}>
                Admin Assistant
              </div>
            </div>
          </div>
        )}

        {/* Alert badge */}
        <div style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 10, padding: '8px 12px', marginBottom: 20
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Your Scope
          </div>
          <div style={{ fontSize: '0.72rem', color: '#86efac', marginTop: 4, lineHeight: 1.5 }}>
            ✅ Claimed leads awaiting activation<br />
            🎨 Redesign requests<br />
            🔧 Tool integration tasks
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 10, padding: '10px 12px', borderRadius: 10,
                  textDecoration: 'none',
                  color: isActive ? '#f0fdf4' : '#6b7280',
                  background: isActive ? 'rgba(16,185,129,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
                  fontSize: '0.82rem', fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon style={{ width: 16, height: 16, color: isActive ? '#10b981' : '#6b7280' }} />
                  {item.name}
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 700,
                    background: 'rgba(16,185,129,0.15)',
                    color: '#4ade80', padding: '2px 6px', borderRadius: 20,
                    border: '1px solid rgba(16,185,129,0.25)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Security notice */}
        <div style={{
          margin: '16px 0', padding: '8px 12px',
          background: 'rgba(16,185,129,0.04)',
          border: '1px solid rgba(16,185,129,0.1)',
          borderRadius: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck style={{ width: 12, height: 12, color: '#10b981' }} />
            <span style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 600 }}>Restricted Access Mode</span>
          </div>
          <p style={{ fontSize: '0.62rem', color: '#374151', margin: '4px 0 0', lineHeight: 1.4 }}>
            You can only view and action leads assigned to your duty queue.
          </p>
        </div>

        {/* Logout */}
        <button
          id="assistant-logout-btn"
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px', borderRadius: 10, width: '100%',
            background: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.15)',
            color: '#ef4444', fontSize: '0.8rem', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s ease'
          }}
        >
          <LogOut style={{ width: 14, height: 14 }} /> End Duty Session
        </button>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        {/* Header bar */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 28px',
          background: 'rgba(4,20,12,0.6)',
          borderBottom: '1px solid rgba(16,185,129,0.08)',
          backdropFilter: 'blur(8px)',
          position: 'sticky', top: 0, zIndex: 50
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#86efac' }}>
            {NAV_ITEMS.find(n => n.path === pathname)?.name || 'Duty Workstation'}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: '0.72rem', color: '#10b981', fontWeight: 600,
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.15)',
            padding: '5px 12px', borderRadius: 20
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#10b981', boxShadow: '0 0 8px #10b981',
              display: 'inline-block', animation: 'pulse 2s infinite'
            }} />
            Duty Session Active
          </div>
        </header>

        <div style={{ padding: '28px 28px' }}>
          {children}
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.7); }
          70% { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        a:hover { color: #f0fdf4 !important; background: rgba(16,185,129,0.06) !important; }
      `}</style>
    </div>
  );
}
