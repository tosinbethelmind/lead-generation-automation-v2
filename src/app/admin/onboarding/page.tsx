'use client';

import React, { useState } from 'react';
import { Sparkles, Check, Copy, Globe, Send, ShieldCheck, Zap, Code, ExternalLink, Bot, CheckCircle2 } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

export default function AdminOnboardingStudioPage() {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Solar & Renewable Energy');
  const [clientPhone, setClientPhone] = useState('');
  const [websiteOption, setWebsiteOption] = useState<'hosted' | 'embed' | 'custom_domain'>('hosted');
  const [customDomain, setCustomDomain] = useState('');

  const [provisioned, setProvisioned] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Computed values
  const slug = businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'sample-business';

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.bethelmindanalytics.com';
  const hostedUrl = `${origin}/preview/${slug}`;
  const scriptTag = `<script src="${origin}/api/widget/${slug}.js" async></script>`;
  const domainUrl = customDomain ? `https://${customDomain.replace(/^https?:\/\//, '')}` : hostedUrl;

  const handleProvision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    setProvisioned(true);
  };

  const welcomeMessage = `🎉 CONGRATULATIONS! Your Bethelmind AI Website & Sales Engine is LIVE!

We have successfully provisioned your 24/7 AI-powered platform!

---

🌐 YOUR OFFICIAL WEBSITE & DOMAIN DETAILS:
🏢 Business Name: ${businessName || '[Business Name]'}
📂 Industry Sector: ${category}
🔗 Live Web Link: ${websiteOption === 'custom_domain' ? domainUrl : hostedUrl}
🤖 AI Lead Specialist: ACTIVE & ONLINE 24/7

---

⚡ WHAT IS INCLUDED ON YOUR WEBSITE:
✅ 24/7 WhatsApp AI Chatbot & Lead Qualifier
✅ Interactive Sector Calculators & Quote Estimators
✅ Direct WhatsApp Lead Routing to ${clientPhone || '[Your WhatsApp Number]'}
✅ Mobile & Desktop Optimized Responsive Design

---

📲 3 EASY STEPS TO CLAIM & START GETTING LEADS:

1️⃣ TEST YOUR CHATBOT:
Visit your live link above and click "🤖 Chat with AI". Try asking for pricing or a quote!

2️⃣ ADD LINK TO YOUR SOCIAL MEDIA:
Copy your link and add it to your WhatsApp Business Profile, Instagram Bio, and Facebook Page.

3️⃣ RECEIVE YOUR LEADS:
Every customer who requests a quote or site survey will instantly be routed to your WhatsApp!

Our technical support team is here to assist you anytime! Welcome aboard! 🚀`;

  const copyWelcomeMessage = async () => {
    const success = await copyToClipboard(welcomeMessage);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyScriptCode = async () => {
    const success = await copyToClipboard(scriptTag);
    if (success) {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  return (
    <div className="onboarding-studio">
      <div className="header-card glass-panel">
        <div className="header-content">
          <div className="icon-wrapper">
            <Sparkles size={28} className="primary-color" />
          </div>
          <div>
            <h2>1-Click Client Onboarding & Claiming Studio</h2>
            <p>Provision turnkey AI websites, sector calculators, widget scripts, and client welcome kits in 30 seconds.</p>
          </div>
        </div>
      </div>

      <div className="studio-grid">
        {/* Form Section */}
        <div className="studio-card glass-panel">
          <div className="card-title">
            <Zap size={20} className="accent-color" />
            <h3>Provision New Client</h3>
          </div>

          <form onSubmit={handleProvision} className="onboarding-form">
            <div className="form-group">
              <label>Client Business Name</label>
              <input
                type="text"
                placeholder="e.g. Apex Solar Solutions"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Industry Sector</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Solar & Renewable Energy">☀️ Solar & Renewable Energy</option>
                <option value="Real Estate & Property">🏠 Real Estate & Property</option>
                <option value="Car Dealers & Auto Importers">🚗 Car Dealers & Auto Importers</option>
                <option value="Law Firms & Legal Services">⚖️ Law Firms & Legal Services</option>
                <option value="Boutiques & E-Commerce">🛍️ Boutiques & E-Commerce</option>
                <option value="Clinics & Healthcare">🏥 Clinics & Healthcare</option>
                <option value="Schools & Education">📚 Schools & Education</option>
                <option value="General B2B Services">🏢 General B2B Services</option>
              </select>
            </div>

            <div className="form-group">
              <label>Client WhatsApp Phone (For Lead Delivery)</label>
              <input
                type="text"
                placeholder="e.g. +2348022791227"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Website & Domain Hosting Setup</label>
              <div className="radio-options">
                <label className={`radio-card ${websiteOption === 'hosted' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="site_option"
                    checked={websiteOption === 'hosted'}
                    onChange={() => setWebsiteOption('hosted')}
                  />
                  <div>
                    <strong>Option 1: Instant Hosted Webpage</strong>
                    <span>No client website needed. Generates instant hosted link with SSL.</span>
                  </div>
                </label>

                <label className={`radio-card ${websiteOption === 'embed' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="site_option"
                    checked={websiteOption === 'embed'}
                    onChange={() => setWebsiteOption('embed')}
                  />
                  <div>
                    <strong>Option 2: Embed Code (WordPress / Wix / Shopify)</strong>
                    <span>Client has an existing site. Generates 1-line script tag.</span>
                  </div>
                </label>

                <label className={`radio-card ${websiteOption === 'custom_domain' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="site_option"
                    checked={websiteOption === 'custom_domain'}
                    onChange={() => setWebsiteOption('custom_domain')}
                  />
                  <div>
                    <strong>Option 3: Custom Domain Mapping</strong>
                    <span>Map custom domain (e.g. www.clientbrand.com) via Cloudflare & Vercel.</span>
                  </div>
                </label>
              </div>
            </div>

            {websiteOption === 'custom_domain' && (
              <div className="form-group">
                <label>Custom Domain Name</label>
                <input
                  type="text"
                  placeholder="e.g. www.apexsolarnigeria.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" className="btn-primary provision-btn">
              <Sparkles size={18} />
              <span>Generate Turnkey Website & Claim Package</span>
            </button>
          </form>
        </div>

        {/* Output & Welcome Kit Section */}
        <div className="studio-card glass-panel output-card">
          <div className="card-title">
            <ShieldCheck size={20} className="success-color" />
            <h3>Generated Turnkey Assets & Welcome Kit</h3>
          </div>

          {!provisioned ? (
            <div className="empty-state">
              <Bot size={48} className="primary-color" />
              <h4>Ready to Onboard New Lead</h4>
              <p>Enter the business details on the left and click <strong>Generate Turnkey Website</strong> to produce your client claim kit.</p>
            </div>
          ) : (
            <div className="output-content">
              {/* Asset Box 1: Live Web Link */}
              <div className="asset-box">
                <div className="asset-header">
                  <Globe size={16} className="primary-color" />
                  <span>Hosted Website URL:</span>
                </div>
                <div className="asset-val">
                  <a href={hostedUrl} target="_blank" rel="noopener noreferrer">
                    {hostedUrl} <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Asset Box 2: Script Tag (If Embed option chosen) */}
              {websiteOption === 'embed' && (
                <div className="asset-box">
                  <div className="asset-header">
                    <Code size={16} className="accent-color" />
                    <span>WordPress / Wix 1-Line Embed Script:</span>
                  </div>
                  <div className="code-snippet-box">
                    <code>{scriptTag}</code>
                    <button onClick={copyScriptCode} className="btn-secondary copy-sm-btn">
                      {copiedScript ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Asset Box 3: Formatted WhatsApp Welcome Message */}
              <div className="welcome-kit-box">
                <div className="kit-header">
                  <Send size={16} className="success-color" />
                  <h4>WhatsApp Welcome & Claim Message for Client</h4>
                </div>
                <textarea readOnly value={welcomeMessage} rows={12} className="welcome-textarea" />
                <button onClick={copyWelcomeMessage} className="btn-primary copy-kit-btn">
                  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Claim Message'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .onboarding-studio {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .primary-color { color: var(--primary, #06b6d4); }
        .accent-color { color: #f59e0b; }
        .success-color { color: #10b981; }

        .header-card {
          padding: 24px 30px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-content h2 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .header-content p {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .studio-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .studio-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .card-title h3 {
          font-size: 1.15rem;
          font-weight: 700;
        }

        .onboarding-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.825rem;
          font-weight: 600;
          color: #94a3b8;
        }

        .form-group input, .form-group select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 11px 14px;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
        }

        .form-group input:focus, .form-group select:focus {
          border-color: var(--primary, #06b6d4);
        }

        .form-group select option {
          background: #0d1220;
          color: #fff;
        }

        .radio-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .radio-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .radio-card.active {
          background: rgba(6, 182, 212, 0.08);
          border-color: rgba(6, 182, 212, 0.3);
        }

        .radio-card div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .radio-card strong {
          font-size: 0.85rem;
          color: #fff;
        }

        .radio-card span {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .provision-btn {
          width: 100%;
          justify-content: center;
          padding: 14px;
          font-size: 0.95rem;
          margin-top: 10px;
          gap: 8px;
        }

        /* Output Card Styling */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 20px;
          gap: 12px;
        }

        .empty-state h4 {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .empty-state p {
          font-size: 0.85rem;
          color: #94a3b8;
          max-width: 320px;
        }

        .output-content {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .asset-box {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .asset-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
        }

        .asset-val a {
          color: var(--primary, #06b6d4);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .code-snippet-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #090d16;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .code-snippet-box code {
          font-size: 0.78rem;
          color: #34d399;
          word-break: break-all;
        }

        .copy-sm-btn {
          padding: 4px 8px;
        }

        .welcome-kit-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .kit-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .kit-header h4 {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .welcome-textarea {
          width: 100%;
          background: #090d16;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px;
          color: #f8fafc;
          font-family: inherit;
          font-size: 0.8rem;
          line-height: 1.5;
          resize: none;
        }

        .copy-kit-btn {
          width: 100%;
          justify-content: center;
          padding: 12px;
          gap: 8px;
        }

        @media (max-width: 900px) {
          .studio-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
