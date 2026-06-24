// src/components/TopReviewedLeads.tsx
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Tag, Award, Sparkles, Building, Phone, Mail, Globe, ExternalLink, RefreshCw } from 'lucide-react';
import { Lead } from '@/lib/googleSheets';

export default function TopReviewedLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/leads/topReviewed?limit=20');
      if (!res.ok) {
        throw new Error('Failed to fetch top reviewed leads');
      }
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopLeads();
  }, []);

  return (
    <section className="glass-panel" style={{ padding: '32px', marginTop: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Luxurious Background glow */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-title)',
            fontSize: '1.75rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FFE07D 0%, #F59E0B 50%, #D97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            letterSpacing: '-0.03em'
          }}>
            <Award size={28} color="#F59E0B" style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))' }} />
            Elite 20 Top Reviewed Leads
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            High-authority prospects sorted by rating and review count. Ideal candidates for high-ticket website proposal outreach.
          </p>
        </div>
        <button
          onClick={fetchTopLeads}
          disabled={loading}
          className="btn-secondary"
          style={{
            padding: '8px 16px',
            fontSize: '0.85rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderColor: 'rgba(245, 158, 11, 0.2)'
          }}
        >
          <RefreshCw size={14} className={loading ? 'spin-anim' : ''} color="#F59E0B" />
          Refresh Elite List
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          padding: '16px',
          color: 'var(--error)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          {error}
        </div>
      )}

      {/* Grid of Leads */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="loading-shimmer"
                style={{
                  height: '200px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '12px',
                  animation: 'pulse-glow 2s ease-in-out infinite'
                }}
              />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div style={{
            padding: '48px 16px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            border: '1px dashed var(--panel-border)',
            color: 'var(--text-secondary)'
          }}>
            <Sparkles size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '0.95rem' }}>No scraped B2B leads found yet.</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Run Google Maps or Jiji Scraper to fetch prospects.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {leads.map((lead, idx) => {
              const isPremiumTier = lead.rating >= 4.5 && lead.reviews_count >= 10;
              return (
                <div
                  key={lead.lead_id}
                  style={{
                    background: isPremiumTier
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(15, 22, 36, 0.7) 100%)'
                      : 'rgba(15, 22, 36, 0.5)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid',
                    borderColor: isPremiumTier ? 'rgba(245, 158, 11, 0.25)' : 'var(--panel-border)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    transition: 'var(--transition-smooth)',
                    boxShadow: isPremiumTier
                      ? '0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 0 15px rgba(245, 158, 11, 0.05)'
                      : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = isPremiumTier ? 'var(--warning)' : 'var(--primary)';
                    e.currentTarget.style.boxShadow = isPremiumTier
                      ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(245, 158, 11, 0.2)'
                      : '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 20px var(--primary-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = isPremiumTier ? 'rgba(245, 158, 11, 0.25)' : 'var(--panel-border)';
                    e.currentTarget.style.boxShadow = isPremiumTier
                      ? '0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 0 15px rgba(245, 158, 11, 0.05)'
                      : '0 8px 32px 0 rgba(0, 0, 0, 0.3)';
                  }}
                >
                  {lead.isMock && (
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(249, 115, 22, 0.2)',
                      color: '#F97316',
                      border: '1px solid rgba(249, 115, 22, 0.4)',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      boxShadow: '0 0 8px rgba(249, 115, 22, 0.1)',
                      zIndex: 3
                    }}>
                      SIMULATED
                    </span>
                  )}

                  {/* Lead index & Premium Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: lead.isMock ? '90px' : '0px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: isPremiumTier ? 'var(--warning)' : 'var(--text-muted)',
                      background: 'rgba(0,0,0,0.2)',
                      padding: '3px 8px',
                      borderRadius: '12px'
                    }}>
                      RANK #{idx + 1}
                    </span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {isPremiumTier ? (
                        <span style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: 'var(--warning)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          letterSpacing: '0.05em'
                        }}>
                          ELITE PARTNER
                        </span>
                      ) : null}
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {lead.source}
                      </span>
                    </div>
                  </div>

                  {/* Name and Rating */}
                  <div>
                    <h4 style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      lineHeight: '1.3',
                      marginBottom: '6px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '2.6em'
                    }}>
                      {lead.name}
                    </h4>
                    
                    {/* Rating details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {Array.from({ length: 5 }).map((_, i) => {
                          const starRating = lead.rating || 0;
                          return (
                            <Star
                              key={i}
                              size={12}
                              fill={i < Math.floor(starRating) ? '#F59E0B' : 'transparent'}
                              color={i < Math.floor(starRating) ? '#F59E0B' : 'rgba(255,255,255,0.2)'}
                            />
                          );
                        })}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {lead.rating?.toFixed(1) || '0.0'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        ({lead.reviews_count || 0} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }} />

                  {/* Meta Details: Category & Address */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <Tag size={13} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        textTransform: 'capitalize',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {lead.category || 'Uncategorized'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <MapPin size={13} color="var(--secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '2.8em'
                      }} title={lead.address}>
                        {lead.address || 'No Address Available'}
                      </span>
                    </div>
                  </div>

                  {/* Action items/Buttons inside card */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', zIndex: 2 }}>
                    <a
                      href={`/preview/${lead.lead_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        justifyContent: 'center',
                        textDecoration: 'none',
                        boxShadow: 'none',
                        background: 'var(--btn-secondary-bg, linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%))',
                        border: '1px solid var(--panel-border)',
                        color: 'var(--text-primary)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--primary-glow)';
                        e.currentTarget.style.borderColor = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe size={12} />
                      Preview Site
                    </a>

                    {(lead.phone_e164 || lead.email) && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {lead.phone_e164 && (
                          <a
                            href={`tel:${lead.phone_e164}`}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.05)',
                              color: 'var(--text-secondary)'
                            }}
                            title={`Call: ${lead.phone_e164}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone size={12} />
                          </a>
                        )}
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.05)',
                              color: 'var(--text-secondary)'
                            }}
                            title={`Email: ${lead.email}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail size={12} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
