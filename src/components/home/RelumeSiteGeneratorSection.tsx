'use client';

/**
 * @file src/components/home/RelumeSiteGeneratorSection.tsx
 * Interactive Relume Live Site Redesign Generator & Google Speed Auditor Widget
 * Built directly into the Parent Application homepage.
 */

import React, { useState } from 'react';
import { Sparkles, Zap, ExternalLink, CheckCircle2 } from 'lucide-react';
import { renderFullRelumeSitePage } from '@/lib/designGenerator';

export default function RelumeSiteGeneratorSection() {
  const [businessName, setBusinessName] = useState('Zenith Dental Care');
  const [category, setCategory] = useState('Dentistry');
  const [website, setWebsite] = useState('https://zenithdental.ng');
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const html = renderFullRelumeSitePage({
        name: businessName,
        category,
        website,
        phone: '2348022791227',
        rating: '4.9',
        reviews_count: 85
      });
      setPreviewHtml(html);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <section id="site-generator" style={{ padding: '80px clamp(16px, 4vw, 40px)', background: 'linear-gradient(180deg, rgba(7,9,14,0.9) 0%, rgba(15,23,42,0.9) 100%)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)', borderRadius: 100, padding: '5px 14px', marginBottom: 14 }}>
            <Sparkles size={14} style={{ color: '#ec4899' }} />
            <span style={{ fontSize: '0.78rem', color: '#ec4899', fontWeight: 800 }}>100% Free Live UI Generator</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
            Relume UI Site Redesign Generator
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: 640, margin: '0 auto' }}>
            Experience instant site redesigns powered by Relume UI components, extracted Google Maps photos, and verified Google PageSpeed ratings.
          </p>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, backdropFilter: 'blur(16px)', maxWidth: 800, margin: '0 auto 40px auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Industry / Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14 }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Current Website URL (Optional)</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14 }}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{ width: '100%', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Zap size={18} />
            {isGenerating ? 'Generating Relume UI Preview...' : '✨ Generate Relume UI Site Preview Now'}
          </button>
        </div>

        {previewHtml && (
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', background: '#0f172a', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
            <div style={{ background: '#1e293b', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', fontSize: 13, fontWeight: 600 }}>
                <CheckCircle2 size={16} /> Relume UI Live Preview Generated
              </div>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Verified 100% Free Engine</span>
            </div>
            <iframe
              srcDoc={previewHtml}
              style={{ width: '100%', height: 600, border: 'none' }}
              title="Relume Preview"
            />
          </div>
        )}
      </div>
    </section>
  );
}
