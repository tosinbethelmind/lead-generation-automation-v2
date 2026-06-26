// src/app/components/HeroSection.tsx
'use client';

import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  previewUrl?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, ctaText, previewUrl }) => {
  return (
    <section className="hero-section" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{title}</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>{subtitle}</p>
      {previewUrl && (
        <a href={previewUrl} className="cta-button" style={{
          display: 'inline-block',
          backgroundColor: 'var(--primary)',
          color: 'var(--text)',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}>
          {ctaText}
        </a>
      )}
    </section>
  );
};
