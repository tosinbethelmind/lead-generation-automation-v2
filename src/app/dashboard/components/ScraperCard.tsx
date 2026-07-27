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
      id={`scraper-card-${id}`}
      data-testid={`scraper-card-${id}`}
      onClick={onSelect}
      className={isSelected ? 'animate-pulse-glow' : ''}
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)'
          : 'rgba(13, 19, 33, 0.5)',
        backdropFilter: 'blur(16px)',
        border: '1px solid',
        borderColor: isSelected ? '#06b6d4' : 'rgba(99, 102, 241, 0.2)',
        boxShadow: isSelected ? '0 0 25px rgba(6, 182, 212, 0.3)' : '0 4px 20px rgba(0,0,0,0.2)',
        borderRadius: '14px',
        padding: '18px',
        cursor: 'pointer',
        transition: 'var(--transition-smooth)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{name}</h4>
        
        {/* Status badges */}
        <span className={status === 'free' ? 'badge-luxury-emerald' : 'badge-luxury-amber'} style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: '6px'
        }}>
          {status === 'free' ? 'FREE 🟢' : 'API REQUIRED 🔑'}
        </span>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.45', flexGrow: 1 }}>
        {description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem' }}>
        {status === 'free' || isConfigured ? (
          <>
            <CheckCircle size={14} color="var(--success)" />
            <span style={{ color: '#10b981', fontWeight: 600 }}>Ready to Run</span>
          </>
        ) : (
          <>
            <AlertTriangle size={14} color="var(--warning)" />
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>Sandbox Mode Only</span>
          </>
        )}
      </div>
    </div>
  );
}
