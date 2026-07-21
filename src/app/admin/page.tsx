'use client';

import React, { useState } from 'react';
import { Rocket, ExternalLink, Server, Settings, Shield, RefreshCw } from 'lucide-react';

export default function AdminDashboardHome() {
  const [deploying, setDeploying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const triggerDeploy = async () => {
    setDeploying(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/deploy', {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message || 'Deployment initiated successfully!');
      } else {
        setError(data.error || 'Failed to trigger deployment.');
      }
    } catch (err: any) {
      setError('Network error occurred. Please try again.');
    } finally {
      setDeploying(false);
    }
  };

  const systemStats = [
    { name: 'Database Status', value: 'Connected', status: 'ready', icon: Server },
    { name: 'Storage Provider', value: 'Supabase Buckets', status: 'ready', icon: Shield },
    { name: 'Active Domain', value: 'lead-generation-automation-e0oitxcsi.vercel.app', status: 'ready', icon: ExternalLink },
  ];

  return (
    <div className="dashboard-overview">
      <div className="bento-grid">
        {/* Welcome Box */}
        <div className="bento-card welcome-card glass-panel col-span-2">
          <div className="card-header">
            <h2>Welcome to Bethelmind Analytics & Strategy Admin</h2>
            <p>You have full client ownership. Authenticated as secure administrator.</p>
          </div>
          <div className="live-link-box">
            <span className="label">Live URL:</span>
            <a
              href="https://lead-generation-automation-e0oitxcsi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="live-url"
            >
              https://lead-generation-automation-e0oitxcsi.vercel.app/
              <ExternalLink className="inline-icon" />
            </a>
          </div>
        </div>

        {/* Deploy Actions Card */}
        <div className="bento-card deploy-card glass-panel">
          <div className="card-header">
            <div className="header-icon-wrapper">
              <Rocket />
            </div>
            <h3>Production Deploy</h3>
          </div>
          <div className="card-body">
            <p>Push local customisations, design tweaks, and domain updates live to Vercel production servers.</p>
            
            {message && <div className="status-banner success">{message}</div>}
            {error && <div className="status-banner error">{error}</div>}

            <button
              onClick={triggerDeploy}
              disabled={deploying}
              className="btn-primary deploy-btn"
            >
              {deploying ? (
                <>
                  <RefreshCw className="spin-anim" /> Redeploying...
                </>
              ) : (
                <>
                  Deploy Production <Rocket />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick System Stats */}
        {systemStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bento-card stat-card glass-panel">
              <div className="card-header">
                <div className="icon-wrapper">
                  <Icon />
                </div>
                <h4>{stat.name}</h4>
              </div>
              <div className="card-body stat-val">
                <span className="value">{stat.value}</span>
                <span className="status-chip green">Active</span>
              </div>
            </div>
          );
        })}

        {/* Quick Shortcuts */}
        <div className="bento-card shortcuts-card glass-panel col-span-2">
          <div className="card-header">
            <div className="icon-wrapper">
              <Settings />
            </div>
            <h3>Quick Settings Configuration</h3>
          </div>
          <div className="card-body shortcuts-grid">
            <a href="/admin/design" className="shortcut-item">
              <h4>Design Palette Settings</h4>
              <p>Fine-tune primary, secondary, and accent colors to customize your branding.</p>
            </a>
            <a href="/admin/domain" className="shortcut-item">
              <h4>Domain & DNS Configuration</h4>
              <p>Attach custom domain aliases and configure Cloudflare DNS proxy records.</p>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-overview {
          max-width: 1200px;
          margin: 0 auto;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .col-span-2 {
          grid-column: span 2;
        }

        .bento-card {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .welcome-card {
          background: linear-gradient(135deg, rgba(15, 22, 36, 0.8) 0%, rgba(10, 15, 26, 0.6) 100%);
          border-left: 4px solid var(--primary, #06b6d4);
        }

        .welcome-card h2 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(90deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .welcome-card p {
          color: #94a3b8;
          font-size: 0.95rem;
        }

        .live-link-box {
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.2);
          padding: 12px 20px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          width: fit-content;
        }

        .live-link-box .label {
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .live-url {
          color: var(--primary, #06b6d4);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }

        .live-url:hover {
          color: #22d3ee;
          text-decoration: underline;
        }

        .inline-icon {
          width: 14px;
          height: 14px;
        }

        .header-icon-wrapper {
          color: var(--primary, #06b6d4);
          margin-bottom: 8px;
        }

        .deploy-card {
          justify-content: space-between;
        }

        .deploy-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .deploy-card p {
          color: #94a3b8;
          font-size: 0.85rem;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .deploy-btn {
          width: 100%;
          justify-content: center;
          padding: 12px;
        }

        .stat-card {
          padding: 24px;
        }

        .stat-card h4 {
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .icon-wrapper {
          color: #64748b;
          margin-bottom: 8px;
        }

        .stat-val {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }

        .stat-val .value {
          font-size: 1.15rem;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 70%;
        }

        .status-banner {
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          line-height: 1.4;
          margin-bottom: 14px;
        }

        .status-banner.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .status-banner.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        .shortcuts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .shortcut-item {
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
        }

        .shortcut-item:hover {
          background: rgba(6, 182, 212, 0.05);
          border-color: rgba(6, 182, 212, 0.2);
          transform: translateY(-2px);
        }

        .shortcut-item h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 6px;
          color: #fff;
        }

        .shortcut-item p {
          color: #94a3b8;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        @media (max-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .col-span-2 {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
          .col-span-2 {
            grid-column: span 1;
          }
          .shortcuts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
