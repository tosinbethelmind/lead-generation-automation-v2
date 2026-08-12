'use client';

import React from 'react';
import { FileText, CheckCircle, MessageCircle, Globe, ExternalLink } from 'lucide-react';

const LOG_ENTRIES = [
  { time: 'Real-time log entries will appear here', action: 'Session Started', detail: 'Your duty session is active.', icon: <CheckCircle style={{ width: 14, height: 14, color: '#10b981' }} />, color: '#10b981' }
];

export default function AssistantLogPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        background: 'rgba(4,20,12,0.8)', border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 16, padding: '20px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <FileText style={{ width: 15, height: 15, color: '#10b981' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Activity Log
          </span>
        </div>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f0fdf4', margin: 0 }}>My Duty Activity Log</h1>
        <p style={{ fontSize: '0.72rem', color: '#4b5563', margin: '4px 0 0' }}>
          A record of all administrative actions you've completed during your duty sessions.
        </p>
      </div>

      {/* Quick reference guide */}
      <div style={{
        background: 'rgba(4,20,12,0.8)', border: '1px solid rgba(16,185,129,0.12)',
        borderRadius: 16, padding: '20px 24px'
      }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f0fdf4', margin: '0 0 16px' }}>
          📋 Quick Reference — Your Duty Guide
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: <CheckCircle style={{ width: 14, height: 14, color: '#10b981' }} />, color: '#10b981', title: 'When manager sends alert for a website claim:', detail: 'Go to Claim & Duty Desk → Find the lead → Click ✅ Verify & Activate → Confirm.' },
            { icon: <MessageCircle style={{ width: 14, height: 14, color: '#25d366' }} />, color: '#25d366', title: 'When you need to contact a client:', detail: 'Go to WhatsApp Outreach → Select a template → Enter phone → Click Open in WhatsApp.' },
            { icon: <Globe style={{ width: 14, height: 14, color: '#6366f1' }} />, color: '#6366f1', title: 'When a client has a custom domain to bind:', detail: 'Go to Domain Binding → Enter Lead ID + domain name → Click Bind Domain.' },
            { icon: <ExternalLink style={{ width: 14, height: 14, color: '#06b6d4' }} />, color: '#06b6d4', title: 'When you need to send a client their claim link:', detail: 'Go to Claim & Duty Desk → Click 🔗 icon on their row → Generate & Copy their personalized link.' },
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '14px 16px',
              background: 'rgba(0,0,0,0.3)', borderRadius: 12,
              border: `1px solid ${step.color}15`
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: `${step.color}12`, border: `1px solid ${step.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {step.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', lineHeight: 1.5 }}>{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log entries placeholder */}
      <div style={{
        background: 'rgba(4,20,12,0.8)', border: '1px solid rgba(16,185,129,0.12)',
        borderRadius: 16, padding: '20px 24px'
      }}>
        <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f0fdf4', margin: '0 0 14px' }}>
          Recent Actions
        </h3>
        <div style={{
          border: '1px dashed rgba(16,185,129,0.15)', borderRadius: 12, padding: '40px 20px',
          textAlign: 'center', color: '#374151'
        }}>
          <FileText style={{ width: 32, height: 32, margin: '0 auto 10px', opacity: 0.3, color: '#10b981' }} />
          <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>No actions logged yet this session.</p>
          <p style={{ fontSize: '0.7rem', margin: '4px 0 0' }}>Actions from the Duty Desk will appear here as you complete them.</p>
        </div>
      </div>
    </div>
  );
}
