// src/app/dashboard/components/ScraperCard.tsx
import React from 'react';
import { Compass, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

interface ScraperCardProps {
  id: string;
  name: string;
  description: string;
  status: 'free' | 'api-required' | 'premium';
  isConfigured: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ScraperCard({
  id,
  name,
  description,
  status,
  isConfigured,
  isSelected,
  onSelect
}: ScraperCardProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 22, 36, 0.7) 100%)'
          : 'rgba(15, 22, 36, 0.4)',
        backdropFilter: 'blur(16px)',
        border: '1px solid',
        borderColor: isSelected ? 'var(--primary)' : 'var(--panel-border)',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'var(--transition-smooth)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--panel-border)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{name}</h4>
        
        {/* Status badges */}
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 600,
          padding: '2px 6px',
          borderRadius: '4px',
          background: status === 'free' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
          color: status === 'free' ? 'var(--success)' : 'var(--warning)',
          border: '1px solid',
          borderColor: status === 'free' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'
        }}>
          {status === 'free' ? 'Free' : 'API Required'}
        </span>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', flexGrow: 1 }}>
        {description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem' }}>
        {status === 'free' || isConfigured ? (
          <>
            <CheckCircle size={12} color="var(--success)" />
            <span style={{ color: 'var(--text-secondary)' }}>Ready to Run</span>
          </>
        ) : (
          <>
            <AlertTriangle size={12} color="var(--warning)" />
            <span style={{ color: 'var(--text-muted)' }}>Sandbox Mode Only</span>
          </>
        )}
      </div>
    </div>
  );
}
