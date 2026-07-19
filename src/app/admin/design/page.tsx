'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Save, Loader2, RefreshCw, Type, Eye } from 'lucide-react';

export default function AdminDesignPage() {
  const [primary, setPrimary] = useState('#06b6d4');
  const [secondary, setSecondary] = useState('#8b5cf6');
  const [accent, setAccent] = useState('#f59e0b');
  const [font, setFont] = useState('Inter');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch current design settings
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/design-settings');
        if (res.ok) {
          const data = await res.json();
          if (data.primary) setPrimary(data.primary);
          if (data.secondary) setSecondary(data.secondary);
          if (data.accent) setAccent(data.accent);
          if (data.font) setFont(data.font);
        }
      } catch (err) {
        console.error('Failed to load design settings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/design-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ primary, secondary, accent, font }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage('Design system tokens updated successfully!');
        // Update local css variables for instant dashboard feedback if applicable
        document.documentElement.style.setProperty('--color-primary', primary);
        document.documentElement.style.setProperty('--color-secondary', secondary);
        document.documentElement.style.setProperty('--color-accent', accent);
        document.documentElement.style.setProperty('--font-base', `'${font}', system-ui`);
      } else {
        setError(data.error || 'Failed to save design settings.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const fonts = [
    { name: 'Inter (Sans-serif)', value: 'Inter' },
    { name: 'Outfit (Modern Title)', value: 'Outfit' },
    { name: 'Roboto (Clean)', value: 'Roboto' },
    { name: 'Poppins (Playful)', value: 'Poppins' },
    { name: 'System (Default UI)', value: 'system-ui' },
  ];

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="spin-anim loading-icon" />
        <p>Loading brand config...</p>
        <style jsx>{`
          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            color: #94a3b8;
          }
          .loading-icon {
            width: 40px;
            height: 40px;
            margin-bottom: 12px;
            color: var(--primary, #06b6d4);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="design-customizer">
      <div className="design-grid">
        {/* Token Form */}
        <form onSubmit={handleSave} className="design-form glass-panel">
          <div className="form-header">
            <Palette className="header-icon" />
            <h3>Branding & Styling tokens</h3>
          </div>

          <div className="form-body">
            {message && <div className="status-banner success">{message}</div>}
            {error && <div className="status-banner error">{error}</div>}

            <div className="form-group">
              <label>Primary Brand Colour</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                />
                <input
                  type="text"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                />
              </div>
              <span className="help-text">Used for primary buttons, highlights and neon glow indicators.</span>
            </div>

            <div className="form-group">
              <label>Secondary Brand Colour</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={secondary}
                  onChange={(e) => setSecondary(e.target.value)}
                />
                <input
                  type="text"
                  value={secondary}
                  onChange={(e) => setSecondary(e.target.value)}
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                />
              </div>
              <span className="help-text">Used for secondary active items, linear gradients and borders.</span>
            </div>

            <div className="form-group">
              <label>Accent Highlights</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                />
                <input
                  type="text"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                />
              </div>
              <span className="help-text">Used for warning statuses, badges, and attention-grabbing chips.</span>
            </div>

            <div className="form-group">
              <label>Font Family</label>
              <div className="select-wrapper">
                <Type className="select-icon" />
                <select value={font} onChange={(e) => setFont(e.target.value)}>
                  {fonts.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <span className="help-text">Selects the default system font family used across layout components.</span>
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" disabled={saving} className="btn-primary save-btn">
              {saving ? (
                <>
                  <Loader2 className="spin-anim" /> Saving...
                </>
              ) : (
                <>
                  Save Changes <Save />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Preview Panel */}
        <div className="preview-panel glass-panel">
          <div className="form-header">
            <Eye className="header-icon" />
            <h3>Live Theme Preview</h3>
          </div>
          <div className="preview-container">
            <div className="preview-card-mock">
              {/* Fake UI component */}
              <div className="mock-navbar">
                <span className="logo" style={{ color: primary }}>
                  Bethelmind Analytics & Strategy
                </span>
                <span className="badge" style={{ backgroundColor: `${accent}20`, color: accent, borderColor: `${accent}40`, border: '1px solid' }}>
                  Live Mode
                </span>
              </div>

              <div className="mock-hero">
                <h1 style={{ fontFamily: font }}>
                  Automate Your{' '}
                  <span
                    style={{
                      background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    B2B Outreach
                  </span>
                </h1>
                <p>
                  High-fidelity CRM and automated lead generation sequencer. Expand your reach dynamically.
                </p>
              </div>

              <div className="mock-actions">
                <button
                  type="button"
                  className="mock-btn-primary"
                  style={{
                    background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
                    boxShadow: `0 0 15px ${primary}40`,
                  }}
                >
                  Get Started
                </button>
                <button type="button" className="mock-btn-secondary">
                  Learn More
                </button>
              </div>

              <div className="mock-stats">
                <div className="mock-stat-item">
                  <span className="label">Leads Saved</span>
                  <span className="val" style={{ color: primary }}>
                    1,248
                  </span>
                </div>
                <div className="mock-stat-item">
                  <span className="label">Conversion</span>
                  <span className="val" style={{ color: secondary }}>
                    14.2%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .design-customizer {
          max-width: 1200px;
          margin: 0 auto;
        }

        .design-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
        }

        .design-form {
          display: flex;
          flex-direction: column;
        }

        .form-header {
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

        .form-header h3 {
          font-size: 1.15rem;
          font-weight: 700;
        }

        .form-body {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1;
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

        .color-input-wrapper {
          display: flex;
          gap: 10px;
        }

        .color-input-wrapper input[type='color'] {
          -webkit-appearance: none;
          border: none;
          width: 48px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          background: none;
          padding: 0;
        }

        .color-input-wrapper input[type='color']::-webkit-color-swatch-wrapper {
          padding: 0;
        }

        .color-input-wrapper input[type='color']::-webkit-color-swatch {
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
        }

        .color-input-wrapper input[type='text'] {
          flex: 1;
          background: rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 8px;
          color: #fff !important;
          padding: 10px 14px;
          font-family: monospace;
          outline: none;
        }

        .color-input-wrapper input[type='text']:focus {
          border-color: var(--primary, #06b6d4) !important;
        }

        .select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .select-icon {
          position: absolute;
          left: 14px;
          color: #64748b;
          width: 18px;
          height: 18px;
          pointer-events: none;
        }

        .select-wrapper select {
          width: 100%;
          padding: 10px 14px 10px 42px !important;
          background: rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 8px;
          color: #fff !important;
          outline: none;
          cursor: pointer;
          -webkit-appearance: none;
        }

        .help-text {
          font-size: 0.72rem;
          color: #64748b;
        }

        .form-footer {
          padding: 20px 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(0, 0, 0, 0.15);
          display: flex;
          justify-content: flex-end;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
        }

        .save-btn {
          padding: 12px 24px;
        }

        .status-banner {
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.825rem;
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

        /* Preview Panel */
        .preview-panel {
          display: flex;
          flex-direction: column;
        }

        .preview-container {
          padding: 30px;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.2);
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
        }

        .preview-card-mock {
          width: 100%;
          max-width: 380px;
          padding: 24px;
          border-radius: 16px;
          background: rgba(15, 22, 36, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .mock-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mock-navbar .logo {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-weight: 800;
          font-size: 1.1rem;
        }

        .mock-navbar .badge {
          font-size: 0.65rem;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 600;
        }

        .mock-hero {
          text-align: center;
        }

        .mock-hero h1 {
          font-size: 1.5rem;
          font-weight: 750;
          line-height: 1.3;
          margin-bottom: 8px;
          color: #fff;
        }

        .mock-hero p {
          color: #94a3b8;
          font-size: 0.78rem;
          line-height: 1.4;
        }

        .mock-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .mock-actions button {
          border: none;
          padding: 8px 16px;
          font-size: 0.78rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          font-family: var(--font-sans, 'Inter', sans-serif);
        }

        .mock-btn-primary {
          color: #fff;
        }

        .mock-btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #f8fafc;
        }

        .mock-stats {
          display: flex;
          justify-content: space-around;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 16px;
        }

        .mock-stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .mock-stat-item .label {
          font-size: 0.65rem;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 600;
        }

        .mock-stat-item .val {
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 2px;
        }

        @media (max-width: 900px) {
          .design-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
