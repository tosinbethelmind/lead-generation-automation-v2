'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Palette, Globe, LogOut, ShieldAlert, Users, Sun, Bot, Zap, Briefcase, Building2, CreditCard, Crown, Send, Settings as SettingsIcon, FileText, Layers, UserCheck } from 'lucide-react';
import { WebappToolActionBar } from '@/components/WebappToolActionBar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<{ name: string; email: string; role: string; permissions: string[] } | null>(null);
  const [tenantInfo, setTenantInfo] = React.useState<{ business_name: string; package_tier: string; days_remaining: number; is_active: boolean } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // Also load tenant context if logged in as a tenant
    const tenantTokenCookie = document.cookie.split(';').find(c => c.trim().startsWith('tenant-token='))?.split('=')[1];
    if (tenantTokenCookie) {
      fetch('/api/tenants/list?mode=me', { headers: { 'x-tenant-token': tenantTokenCookie } })
        .then(r => r.json())
        .then(d => { if (d.success && d.tenant) setTenantInfo(d.tenant); })
        .catch(() => {});
    }
  }, [pathname]);

  // Simple client-side logout
  const handleLogout = () => {
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/admin/login');
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.role === 'super_admin' || user.permissions.includes('*') || user.permissions.includes(permission);
  };

  const navCategories = [
    {
      title: 'LEAD GENERATION & SCRAPERS',
      items: [
        {
          name: 'Dashboard Overview',
          path: '/admin',
          icon: LayoutDashboard,
          visible: true,
        },
        {
          name: 'Multi-Engine Lead CRM Hub',
          path: '/admin/crm',
          icon: Layers,
          visible: true,
          badge: '4 Engines',
        },
        {
          name: 'Solar Scraper Engine',
          path: '/admin/solar-pipeline',
          icon: Sun,
          visible: true,
        },
      ],
    },
    {
      title: 'SEPARATE ENTITIES',
      items: [
        {
          name: 'Recruitment & HR Suite',
          path: '/admin/recruitment',
          icon: Briefcase,
          visible: true,
          badge: 'Standalone',
        },
      ],
    },
    {
      title: 'AUTOMATION & OUTREACH',
      items: [
        {
          name: 'Admin Assistant Desk',
          path: '/assistant',
          icon: UserCheck,
          visible: true,
          badge: 'Workstation',
        },
        {
          name: 'AI Approvals & Outreach',
          path: '/admin/approvals',
          icon: Send,
          visible: true,
        },
        {
          name: 'Customer AI Agent',
          path: '/admin/ai-agent',
          icon: Bot,
          visible: true,
        },
        {
          name: 'Autoresponders',
          path: '/admin/autoresponders',
          icon: Zap,
          visible: true,
        },
      ],
    },
    {
      title: 'PLATFORM MANAGEMENT',
      items: [
        {
          name: 'Settings & Integrations',
          path: '/admin/settings',
          icon: SettingsIcon,
          visible: true,
        },
        {
          name: 'Onboarding & Claim Studio',
          path: '/admin/onboarding',
          icon: Briefcase,
          visible: true,
        },
        {
          name: 'Design & Prompt Studio',
          path: '/admin/design',
          icon: Palette,
          visible: loading || hasPermission('edit_design'),
        },
        {
          name: 'Domain & Hosting',
          path: '/admin/domain',
          icon: Globe,
          visible: loading || hasPermission('manage_domains'),
        },
        {
          name: 'Docs & Software Handover',
          path: '/admin/handover',
          icon: FileText,
          visible: true,
        },
        {
          name: 'Team & Security',
          path: '/admin/team',
          icon: Users,
          visible: loading || hasPermission('manage_team'),
        },
        {
          name: 'All Tenants',
          path: '/admin/tenants',
          icon: Building2,
          visible: loading || hasPermission('manage_team'),
        },
        {
          name: 'My Subscription',
          path: '/admin/subscription',
          icon: CreditCard,
          visible: true,
        },
      ],
    },
  ];

  // Flattened nav items for lookup
  const navItems = navCategories.flatMap((cat) => cat.items).filter((item) => item.visible);

  const hasPageAccess = () => {
    if (pathname === '/admin' || pathname === '/admin/crm' || pathname === '/admin/recruitment' || pathname === '/admin/login' || loading) return true;
    if (pathname === '/admin/ai-agent' || pathname === '/admin/autoresponders') return true;
    if (pathname === '/admin/solar-pipeline') return true;
    if (pathname === '/admin/design') return hasPermission('edit_design');
    if (pathname === '/admin/domain') return hasPermission('manage_domains');
    if (pathname === '/admin/team') return hasPermission('manage_team');
    return true;
  };

  // If we are on the login page, don't show the layout frame
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-frame">
      <aside className="admin-sidebar glass-panel">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <ShieldAlert />
          </div>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>ApexReach Suite</h3>
            <span className="brand-badge">Executive Console</span>
          </div>
        </div>

        {/* Live Scraper Engine Status Card */}
        <div className="p-3 mb-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Scraper Engines</div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse"></span>
              Solar Scraper
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">READY</span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse"></span>
              Lagos 10K B2B
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">24/7 LOOP</span>
          </div>
        </div>

        {/* Tenant subscription badge */}
        {tenantInfo && (
          <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 10, background: tenantInfo.is_active ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${tenantInfo.is_active ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Crown style={{ width: 14, height: 14, color: tenantInfo.is_active ? '#10b981' : '#ef4444' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: tenantInfo.is_active ? '#10b981' : '#ef4444', textTransform: 'capitalize' }}>
                {tenantInfo.package_tier} Plan
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: '#64748b' }}>
              {tenantInfo.is_active
                ? tenantInfo.days_remaining > 9000
                  ? '♾️ Lifetime Access'
                  : `${tenantInfo.days_remaining}d remaining`
                : '⚠️ Subscription expired'}
            </p>
          </div>
        )}

        {user && (
          <div className="user-profile-badge">
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="info">
              <span className="name">{user.name}</span>
              <span className="role">{user.role.replace('_', ' ')}</span>
            </div>
          </div>
        )}

        <nav className="sidebar-nav space-y-4" style={{ overflowY: 'auto' }}>
          {navCategories.map((cat) => {
            const visibleCategoryItems = cat.items.filter((item) => item.visible);
            if (visibleCategoryItems.length === 0) return null;
            return (
              <div key={cat.title} className="space-y-1">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 py-1">
                  {cat.title}
                </div>
                {visibleCategoryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      style={{
                        justifyContent: 'space-between',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="nav-icon" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn btn-secondary">
            <LogOut className="nav-icon" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      <main className="admin-content">
        {pathname !== '/admin/solar-pipeline' && pathname !== '/admin/crm' && (
          <>
            <header className="admin-header">
              <div className="header-title">
                <h1>
                  {navItems.find((n) => n.path === pathname)?.name || 'Admin Dashboard'}
                </h1>
                <p>Seamless management center for lead scrapers, CRM, AI outreach, and deployment.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/crm"
                  className="accessible-btn accessible-btn-cyan text-xs"
                >
                  <Sun className="w-4 h-4" /> Open Dual CRM Hub
                </Link>
                <div className="header-status">
                  <span className="status-indicator"></span>
                  <span>Secure Console</span>
                </div>
              </div>
            </header>

            <div className="px-8 pt-4">
              <WebappToolActionBar currentTool={navItems.find((n) => n.path === pathname)?.name || 'Admin Tool'} />
            </div>
          </>
        )}

        <div className="content-body" style={{ padding: (pathname === '/admin/solar-pipeline' || pathname === '/admin/crm') ? '0' : '40px', flex: 1, overflow: 'hidden' }}>
          {!hasPageAccess() ? (
            <div className="access-denied-container glass-panel">
              <ShieldAlert className="denied-icon" />
              <h2>Access Denied</h2>
              <p>Your team member account does not have permission to access this panel.</p>
              <Link href="/admin" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                Return to Dashboard
              </Link>
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      <style jsx global>{`
        /* Global styles for admin panel */
        .admin-frame {
          display: flex;
          min-height: 100vh;
          background-color: #07090e;
          color: #f8fafc;
          font-family: var(--font-sans, 'Inter', sans-serif);
        }

        .admin-sidebar {
          width: 260px;
          display: flex;
          flex-direction: column;
          border-radius: 0;
          border-width: 0 1px 0 0;
          border-color: rgba(255, 255, 255, 0.05);
          background: rgba(10, 15, 26, 0.7);
          height: 100vh;
          position: sticky;
          top: 0;
          padding: 24px 16px;
          z-index: 100;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 24px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.2);
          color: var(--primary, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .sidebar-brand h3 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
        }

        .brand-badge {
          font-size: 0.65rem;
          background: rgba(6, 182, 212, 0.15);
          color: var(--primary, #06b6d4);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #94a3b8;
          border-radius: 10px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }

        .nav-link.active {
          color: #fff;
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.15);
        }

        .nav-icon {
          width: 18px;
          height: 18px;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logout-btn {
          width: 100%;
          justify-content: center;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
          color: #fff;
        }

        .admin-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0; /* Prevents flex children from stretching */
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(7, 9, 14, 0.5);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .header-title h1 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .header-title p {
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .header-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: #10b981;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.15);
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          background-color: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .content-body {
          padding: 40px;
          flex: 1;
          overflow-y: auto;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .admin-frame {
            flex-direction: column;
          }

          .admin-sidebar {
            width: 100%;
            height: auto;
            border-width: 0 0 1px 0;
            position: relative;
            padding: 16px;
          }

          .sidebar-brand {
            margin-bottom: 12px;
            padding-bottom: 12px;
          }

          .sidebar-nav {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 8px;
          }

          .nav-link {
            padding: 8px 12px;
            white-space: nowrap;
          }

          .sidebar-footer {
            margin-top: 12px;
            padding-top: 12px;
          }

          .admin-header {
            padding: 16px 20px;
          }

          .content-body {
            padding: 20px;
          }
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .user-profile-badge .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary, #06b6d4);
          color: #07090e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .user-profile-badge .info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .user-profile-badge .info .name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f8fafc;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .user-profile-badge .info .role {
          font-size: 0.7rem;
          color: #94a3b8;
          text-transform: capitalize;
        }

        .access-denied-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          text-align: center;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.1);
          border-radius: 16px;
          max-width: 500px;
          margin: 60px auto;
        }
        .denied-icon {
          width: 64px;
          height: 64px;
          color: #ef4444;
          margin-bottom: 20px;
        }
        .access-denied-container h2 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: #f8fafc;
        }
        .access-denied-container p {
          color: #94a3b8;
          margin-bottom: 24px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
