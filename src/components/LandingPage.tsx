'use client';

import React, { useState } from 'react';
import { Star, Phone, MapPin, Award, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface PreviewData {
  lead: {
    name: string;
    category: string;
    address: string;
    area: string;
    city: string;
    phone_raw: string;
    phone_e164: string;
    rating: number;
    reviews_count: number;
    business_summary: string;
  };
  theme: {
    primary: string;
    accent: string;
    bg: string;
    text: string;
    font: string;
    heroImage: string;
    gradient: string;
  };
  copy: {
    heroTitle: string;
    heroSubtitle: string;
    services: { title: string; description: string; icon: string }[];
    aboutText: string;
    testimonials: { name: string; text: string; rating: number }[];
    ctaText: string;
  };
}

interface LandingPageProps {
  data: PreviewData;
  leadId: string;
  isPreview?: boolean;
}

export default function LandingPage({ data, leadId, isPreview = false }: LandingPageProps) {
  const { lead, theme, copy } = data;

  const [claimed, setClaimed] = useState(false);

  // Demo Automation States
  const [demoForm, setDemoForm] = useState({ name: '', email: '', phone: '', date: '', message: '' });
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoStatus, setDemoStatus] = useState<string | null>(null);

  // Claim States
  const [claimForm, setClaimForm] = useState({ name: '', email: '' });
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoLoading(true);
    try {
      const res = await fetch('/api/preview/test-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          ...demoForm
        })
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit test booking');
      }
      setDemoStatus(result.message || 'Automation simulated successfully!');
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      alert(`Demo Error: ${error.message}`);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimLoading(true);
    try {
      const res = await fetch('/api/preview/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          clientName: claimForm.name,
          clientEmail: claimForm.email,
          theme,
          copy
        })
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit claim request');
      }
      setClaimMessage(result.message || 'Request submitted successfully!');
      setClaimed(true);
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      alert(`Claim Error: ${error.message}`);
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div style={{ 
      background: theme.bg, 
      color: '#1e293b', 
      fontFamily: `${theme.font}, system-ui, sans-serif`,
      minHeight: '100vh',
      position: 'relative',
      paddingTop: isPreview ? '64px' : '0px',
      overflowX: 'hidden'
    }}>
      {/* Dynamic Font Import */}
      <link 
        href={`https://fonts.googleapis.com/css2?family=${theme.font.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`} 
        rel="stylesheet" 
      />

      {/* Sticky Conversion-Focused Preview Banner */}
      {isPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: 'rgba(9, 13, 22, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              background: 'linear-gradient(135deg, #0284c7 0%, #14b8a6 100%)', 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              padding: '4px 8px', 
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>ApexReach Demo</span>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, fontWeight: 500 }} className="hide-mobile">
              Hey <strong>{lead.name}</strong>, we custom-built this site based on your Google rating!
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href="#claim" style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #14b8a6 100%)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '8px',
              boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Claim Website & Domain
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        minHeight: '75vh', 
        display: 'flex', 
        alignItems: 'center',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url(${theme.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: 'rgba(255,255,255,0.1)', 
            backdropFilter: 'blur(8px)',
            borderRadius: '99px', 
            padding: '6px 16px', 
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Star style={{ color: '#fbbf24', fill: '#fbbf24' }} size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rated {lead.rating} Stars by {lead.reviews_count} Locals</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.2rem, 5vw, 4rem)', 
            lineHeight: 1.1, 
            fontWeight: 700, 
            marginBottom: '20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            letterSpacing: '-0.02em'
          }}>{copy.heroTitle}</h1>

          <p style={{ 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', 
            color: '#e2e8f0', 
            marginBottom: '36px',
            maxWidth: '650px',
            margin: '0 auto 36px',
            lineHeight: 1.5,
            textShadow: '0 1px 5px rgba(0,0,0,0.3)'
          }}>{copy.heroSubtitle}</p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={isPreview ? "#claim" : "#booking"} style={{
              background: theme.primary,
              border: `1px solid ${theme.primary}`,
              color: '#fff',
              textDecoration: 'none',
              padding: '14px 28px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            >
              {copy.ctaText} <ArrowRight size={18} />
            </a>
            {lead.phone_raw && (
              <a href={`tel:${lead.phone_e164}`} style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                textDecoration: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              >
                <Phone size={18} /> Call Us Directly
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Social-Proof Reputation Bar */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', color: '#fbbf24', fontSize: '2rem', fontWeight: 700 }}>
              {lead.rating} <Star style={{ fill: '#fbbf24' }} size={24} />
            </div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Average Google Rating</p>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }} className="hide-mobile"></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: theme.primary }}>{lead.reviews_count}+</div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Customer Reviews Verified</p>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }} className="hide-mobile"></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              100% <CheckCircle size={24} />
            </div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Locally Verified Service</p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: theme.primary, marginBottom: '12px' }}>Our Specialties & Services</h2>
            <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>We specialize in delivering high-quality, professional solutions designed to meet your needs in {lead.area}.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {copy.services.map((service, idx) => (
              <div key={idx} style={{ 
                background: '#ffffff', 
                padding: '36px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.02), 0 10px 15px rgba(0,0,0,0.03)',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
              className="service-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 25px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02), 0 10px 15px rgba(0,0,0,0.03)';
              }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{service.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: theme.primary, marginBottom: '12px' }}>{service.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section style={{ background: '#ffffff', padding: '80px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: theme.primary, fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              <Award size={18} /> Award-Winning Reputation
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1f2937', marginBottom: '20px', lineHeight: 1.2 }}>About {lead.name}</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7, fontSize: '1.05rem', marginBottom: '24px' }}>{copy.aboutText}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin style={{ color: theme.primary }} size={20} />
                <span style={{ fontWeight: 500, color: '#4b5563' }}>{lead.address}</span>
              </div>
              {lead.phone_raw && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone style={{ color: theme.primary }} size={20} />
                  <span style={{ fontWeight: 500, color: '#4b5563' }}>{lead.phone_raw}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px rgba(0,0,0,0.1)' }}>
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" 
              alt="Workspace" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div style={{ 
              position: 'absolute', 
              bottom: '20px', 
              left: '20px', 
              right: '20px', 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)',
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Star style={{ color: '#fbbf24', fill: '#fbbf24' }} size={24} />
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>Local Verified Reputation</p>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Top rating confirmed on Google Maps APIs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: theme.primary, marginBottom: '12px' }}>What Our Customers Say</h2>
            <p style={{ color: '#64748b' }}>Here is what actual clients think of our work in {lead.area}.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            {copy.testimonials.map((test, idx) => (
              <div key={idx} style={{ 
                background: '#ffffff', 
                padding: '30px', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.01)'
              }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} style={{ color: '#fbbf24', fill: '#fbbf24' }} size={16} />
                  ))}
                </div>
                <p style={{ color: '#4b5563', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '20px', fontSize: '0.95rem' }}>&ldquo;{test.text}&rdquo;</p>
                <p style={{ margin: 0, fontWeight: 600, color: theme.primary, fontSize: '0.9rem' }}>— {test.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form (Interactive Automation Demo) */}
      <section id="booking" style={{
        background: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        padding: '80px 24px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{
              background: 'rgba(2, 132, 199, 0.1)',
              color: theme.primary,
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '99px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>{isPreview ? "Interactive Automation Demo" : "Book an Appointment"}</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', marginTop: '16px', marginBottom: '12px' }}>
              {isPreview ? "Test-Drive Our Booking Automation" : "Schedule Our Services"}
            </h2>
            <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {isPreview 
                ? "This website is pre-configured with a live lead notification workflow. Fill in your details below to see how new bookings instantly notify the business owner!"
                : "Need professional service? Fill in the details below to request a service booking and our team will get in touch shortly."}
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            padding: '40px',
            borderRadius: '16px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
          }}>
            {!demoStatus ? (
              <form onSubmit={handleTestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Your Name</label>
                    <input 
                      type="text" 
                      required 
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({...demoForm, name: e.target.value})}
                      placeholder="e.g. John Doe"
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Your Email</label>
                    <input 
                      type="email" 
                      required 
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                      placeholder="name@example.com"
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})}
                      placeholder="e.g. +234 803 123 4567"
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Preferred Booking Date</label>
                    <input 
                      type="date" 
                      value={demoForm.date}
                      onChange={(e) => setDemoForm({...demoForm, date: e.target.value})}
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', color: '#4b5563' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Special Request / Message</label>
                  <textarea 
                    rows={3}
                    value={demoForm.message}
                    onChange={(e) => setDemoForm({...demoForm, message: e.target.value})}
                    placeholder="Tell us what you need..."
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', resize: 'none' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={demoLoading}
                  style={{
                    background: theme.primary,
                    color: '#fff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: demoLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => !demoLoading && (e.currentTarget.style.filter = 'brightness(1.1)')}
                  onMouseLeave={(e) => !demoLoading && (e.currentTarget.style.filter = 'brightness(1)')}
                >
                  {demoLoading ? 'Processing Request...' : isPreview ? 'Trigger Automated Test Booking' : 'Submit Service Booking'} <ArrowRight size={18} />
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={56} style={{ color: '#10b981', margin: '0 auto 20px' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>
                  {isPreview ? 'Automation Succeeded!' : 'Booking Submitted!'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
                  {demoStatus}
                </p>
                <button 
                  onClick={() => { setDemoStatus(null); setDemoForm({ name: '', email: '', phone: '', date: '', message: '' }); }}
                  style={{ background: '#cbd5e1', color: '#1f2937', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {isPreview ? 'Test Another Booking' : 'Book Another Service'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Claim Section / Contact Form */}
      {isPreview && (
        <section id="claim" style={{ 
          background: '#ffffff', 
          borderTop: '1px solid #e2e8f0',
          padding: '100px 24px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{ 
            maxWidth: '600px', 
            width: '100%', 
            background: '#fafaf9',
            padding: '40px', 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 25px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            {!claimed ? (
              <>
                <ShieldCheck size={48} style={{ color: theme.primary, margin: '0 auto 20px' }} />
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '12px' }}>Claim This Website & Domain</h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '30px', lineHeight: 1.5 }}>
                  This is a live responsive preview of the website we designed for <strong>{lead.name}</strong>. Provide your email address below to claim ownership, customize the content, and deploy it to a live domain.
                </p>

                <form onSubmit={handleClaimSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={claimForm.name}
                      onChange={(e) => setClaimForm({ ...claimForm, name: e.target.value })}
                      placeholder="Enter your name"
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={claimForm.email}
                      onChange={(e) => setClaimForm({ ...claimForm, email: e.target.value })}
                      placeholder="name@business.com"
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={claimLoading}
                    style={{
                      background: theme.primary,
                      color: '#fff',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      cursor: claimLoading ? 'not-allowed' : 'pointer',
                      marginTop: '10px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => !claimLoading && (e.currentTarget.style.filter = 'brightness(1.1)')}
                    onMouseLeave={(e) => !claimLoading && (e.currentTarget.style.filter = 'brightness(1)')}
                  >
                    {claimLoading ? 'Submitting Request...' : 'Request Ownership & Edit Access'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ padding: '20px 0' }}>
                <Award size={64} style={{ color: '#10b981', margin: '0 auto 24px' }} />
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '12px' }}>Request Submitted!</h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  {claimMessage || `Thank you! We've received your request to claim the website and domain for ${lead.name}. Our automation is triggering a deployment of your live files on GitHub and Vercel. We will contact you at the email provided to transfer ownership.`}
                </p>
                <button 
                  onClick={() => setClaimed(false)}
                  style={{ background: '#e2e8f0', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, color: '#4b5563', cursor: 'pointer' }}
                >
                  Go Back
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Styled utilities for mobile responsive behaviors */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
