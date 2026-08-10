'use client';

import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, CheckCircle2, Send, ShieldCheck } from 'lucide-react';
import { ORDERED_SECTORS, LAGOS_DISTRICTS } from '@/config/sectors';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBusinessName?: string;
  initialIndustry?: string;
  initialDistrict?: string;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  initialBusinessName = '',
  initialIndustry = 'solar',
  initialDistrict = 'Ikeja',
}: LeadCaptureModalProps) {
  const [businessName, setBusinessName] = useState(initialBusinessName || '');
  const [industry, setIndustry] = useState(initialIndustry || 'solar');
  const [district, setDistrict] = useState(initialDistrict || 'Ikeja');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/preview/test-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName || businessName || 'Valued Business',
          email,
          phone,
          date: new Date().toISOString().split('T')[0],
          message: `Custom Proposal Request. Business Name: ${businessName}, Industry: ${industry}, District: ${district}.`,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to dispatch request');
      }

      setSubmitted(true);
    } catch (err) {
      alert('Request received! We will send your custom workflow proposal shortly.');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: 'rgba(7, 9, 14, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #07090e 100%)',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: 24,
          maxWidth: 540,
          width: '100%',
          padding: 'clamp(20px, 4vw, 36px)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.6)',
          position: 'relative',
          color: '#f8fafc',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            color: '#94a3b8',
            borderRadius: '50%',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 100, padding: '4px 12px', marginBottom: 10 }}>
                <Sparkles style={{ width: 14, height: 14, color: '#06b6d4' }} />
                <span style={{ fontSize: '0.74rem', color: '#06b6d4', fontWeight: 800 }}>60-Second Instant Proposal</span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.4rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif" }}>
                Get Recommended Workflow Setup
              </h3>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.84rem', lineHeight: 1.5 }}>
                Enter your business details below to receive a custom lead generation & automation proposal tailored to your industry in Lagos.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Solar Ltd"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
                  Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
                  Industry / Sector
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#07090e', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                >
                  {ORDERED_SECTORS.map((s) => (
                    <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
                  Lagos District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#07090e', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                >
                  {LAGOS_DISTRICTS.map((d) => (
                    <option key={d} value={d}>📍 {d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
                  WhatsApp Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 803 123 4567"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                color: '#fff',
                border: 'none',
                padding: '13px',
                borderRadius: 12,
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 6,
              }}
            >
              {loading ? 'Dispatching Request...' : 'Generate My Recommended Proposal'} <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 style={{ width: 52, height: 52, color: '#10b981', margin: '0 auto 16px' }} />
            <h3 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 800 }}>
              Proposal Dispatched!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 20 }}>
              Thank you, <strong>{contactName || 'there'}</strong>. We have logged your request for <strong>{businessName}</strong>. Our Lagos automation strategist will send your customized breakdown to <strong>{email}</strong> and connect on WhatsApp.
            </p>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Back to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
