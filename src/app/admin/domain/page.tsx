'use client';

import React, { useState } from 'react';
import { Globe, Server, Link2, CheckCircle2, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';

export default function AdminDomainPage() {
  const [domain, setDomain] = useState('');
  const [provisioning, setProvisioning] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSandbox, setIsSandbox] = useState(false);

  const handleProvision = async (action: 'cloudflare' | 'vercel' | 'all') => {
    if (!domain.trim()) {
      setError('Please enter a valid domain name first.');
      return;
    }

    setProvisioning(true);
    setActiveAction(action);
    setMessage('');
    setError('');
    setIsSandbox(false);

    try {
      const res = await fetch('/api/admin/domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, action }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message || 'Provisioning completed successfully!');
        if (data.sandbox) {
          setIsSandbox(true);
        }
      } else {
        setError(data.error || 'An error occurred during domain provisioning.');
      }
    } catch (err: any) {
      setError('Network communication failed. Please try again.');
    } finally {
      setProvisioning(false);
      setActiveAction(null);
    }
  };

  return (
    <div className="domain-settings">
      <div className="domain-grid">
        {/* Provisioning Form */}
        <div className="domain-card glass-panel">
          <div className="card-header">
            <Globe className="header-icon" />
            <h3>Custom Domain Mapping</h3>
          </div>

          <div className="card-body">
            <p className="description">
              Enter your branding domain below to map it to the Vercel app alias and automatically register Cloudflare CNAME routing records.
            </p>

            <div className="form-group">
              <label htmlFor="domain">Domain Alias</label>
              <div className="input-wrapper">
                <input
                  id="domain"
                  type="text"
                  placeholder="e.g. leadgen.yourbrand.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={provisioning}
                />
              </div>
              <span className="help-text">Can be a root domain or a subdomain (e.g. outreach.bethelmind.com).</span>
            </div>

            {message && (
              <div className={`status-banner success ${isSandbox ? 'sandbox' : ''}`}>
                <CheckCircle2 className="status-icon" />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="status-banner error">
                <ShieldAlert className="status-icon" />
                <span>{error}</span>
              </div>
            )}

            <div className="actions-stack">
              <button
                onClick={() => handleProvision('all')}
                disabled={provisioning}
                className="btn-primary all-in-one-btn"
              >
                {provisioning && activeAction === 'all' ? (
                  <>
                    <Loader2 className="spin-anim" /> Provisioning Both...
                  </>
                ) : (
                  <>
                    Auto-Configure Cloudflare & Vercel <ArrowRight />
                  </>
                )}
              </button>

              <div className="split-actions">
                <button
                  onClick={() => handleProvision('cloudflare')}
                  disabled={provisioning}
                  className="btn-secondary"
                >
                  {provisioning && activeAction === 'cloudflare' ? (
                    <Loader2 className="spin-anim" />
                  ) : (
                    <>
                      <Server className="inline-icon" /> Cloudflare CNAME
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleProvision('vercel')}
                  disabled={provisioning}
                  className="btn-secondary"
                >
                  {provisioning && activeAction === 'vercel' ? (
                    <Loader2 className="spin-anim" />
                  ) : (
                    <>
                      <Link2 className="inline-icon" /> Map to Vercel
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DNS Guide Box */}
        <div className="domain-card dns-guide glass-panel">
          <div className="card-header">
            <Server className="header-icon" />
            <h3>Manual DNS Setup Instructions</h3>
          </div>
          <div className="card-body">
            <p className="description">
              If you manage your DNS records outside of Cloudflare, you must manually create the following CNAME record in your registrar's dashboard:
            </p>

            <div className="dns-record-table">
              <div className="dns-row header">
                <span>Record Type</span>
                <span>Name / Host</span>
                <span>Value / Destination</span>
              </div>
              <div className="dns-row">
                <span className="type">CNAME</span>
                <span className="name">{domain ? domain.split('.')[0] : '@ or subdomain'}</span>
                <span className="value">cname.vercel-dns.com</span>
              </div>
            </div>

            <div className="instruction-box">
              <h4>Verification Steps:</h4>
              <ol>
                <li>Add the CNAME record to your DNS host.</li>
                <li>Wait 1-5 minutes for propagation (TTL).</li>
                <li>Verify SSL status in Vercel project console.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .domain-settings {
          max-width: 1200px;
          margin: 0 auto;
        }

        .domain-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
        }

        .domain-card {
          display: flex;
          flex-direction: column;
        }

        .card-header {
          padding: 24px 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          color: var(--primary, #06b6d4);
          width: 22px;
          height: 22px;
        }

        .card-header h3 {
          font-size: 1.15rem;
          font-weight: 700;
        }

        .card-body {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .description {
          color: #94a3b8;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f8fafc;
        }

        .input-wrapper input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 8px;
          color: #fff !important;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-wrapper input:focus {
          border-color: var(--primary, #06b6d4) !important;
        }

        .help-text {
          font-size: 0.72rem;
          color: #64748b;
        }

        .actions-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }

        .all-in-one-btn {
          padding: 12px;
          justify-content: center;
          font-size: 0.95rem;
        }

        .split-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .split-actions button {
          justify-content: center;
          padding: 10px;
        }

        .inline-icon {
          width: 16px;
          height: 16px;
        }

        .status-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.825rem;
          line-height: 1.4;
        }

        .status-banner.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .status-banner.success.sandbox {
          background: rgba(6, 182, 212, 0.1);
          border-color: rgba(6, 182, 212, 0.2);
          color: #67e8f9;
        }

        .status-banner.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        .status-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        /* DNS Guide specific */
        .dns-record-table {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          overflow: hidden;
          margin-top: 10px;
        }

        .dns-row {
          display: grid;
          grid-template-columns: 80px 100px 1fr;
          padding: 12px 16px;
          font-size: 0.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .dns-row:last-child {
          border-bottom: none;
        }

        .dns-row.header {
          background: rgba(255, 255, 255, 0.02);
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
        }

        .dns-row .type {
          font-weight: 700;
          color: var(--primary, #06b6d4);
        }

        .dns-row .name {
          color: #fff;
          font-family: monospace;
        }

        .dns-row .value {
          color: #94a3b8;
          font-family: monospace;
          word-break: break-all;
        }

        .instruction-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 16px 20px;
          margin-top: 10px;
        }

        .instruction-box h4 {
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }

        .instruction-box ol {
          padding-left: 20px;
          font-size: 0.78rem;
          color: #94a3b8;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .domain-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
