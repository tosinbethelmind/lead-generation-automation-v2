'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface LeadData {
  name: string;
  category: string;
  city: string;
  address?: string;
  phone_raw?: string;
}

function WalkthroughContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('lead') || searchParams.get('id') || '';
  const paramName = searchParams.get('name') || '';

  const [lead, setLead] = useState<LeadData>({
    name: paramName || 'Your Business',
    category: 'Commercial SME',
    city: 'Lagos'
  });
  const [loading, setLoading] = useState(false);

  // Behavioral Journey Tracking Dispatcher
  const trackJourney = (eventType: string, metadata: Record<string, any> = {}) => {
    if (!leadId && !paramName) return;
    try {
      fetch('/api/tracking/journey-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: leadId || paramName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          leadName: lead.name,
          category: lead.category,
          phone: lead.phone_raw || '',
          area: lead.city || 'Lagos',
          eventType,
          metadata
        })
      }).catch(() => {});
    } catch (_) {}
  };

  // Sector Calculator State for Simulator
  const [solarKva, setSolarKva] = useState<'3.5kVA' | '5kVA' | '10kVA'>('5kVA');
  const [propertyType, setPropertyType] = useState<'2-Bed' | '3-Bed' | 'Duplex'>('3-Bed');
  const [healthSlot, setHealthSlot] = useState<'General Doctor' | 'Dental Specialist' | 'Pediatric Care'>('General Doctor');
  const [roomType, setRoomType] = useState<'Executive Room' | 'Deluxe Suite' | 'VIP Penthouse'>('Executive Room');
  const [haulageTonnage, setHaulageTonnage] = useState<'5-Ton Truck' | '15-Ton Haulage' | '30-Ton Container'>('15-Ton Haulage');
  const [activeTab, setActiveTab] = useState<'simulator' | 'prototype'>('simulator');
  const [simStep, setSimStep] = useState<number>(3); // steps completed

  useEffect(() => {
    if (!leadId) return;
    setLoading(true);
    fetch(`/api/preview/generate?leadId=${encodeURIComponent(leadId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.lead) {
          setLead({
            name: paramName || data.lead.name || 'Your Business',
            category: data.lead.category || 'Commercial SME',
            city: data.lead.city || 'Lagos',
            address: data.lead.address,
            phone_raw: data.lead.phone_raw
          });
          trackJourney('page_view', { path: `/walkthrough?lead=${leadId}` });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [leadId, paramName]);

  const cat = ((lead.category || '') + ' ' + (lead.name || '')).toLowerCase();
  const isSolar = cat.includes('solar') || cat.includes('energy') || cat.includes('inverter');
  const isRealEstate = cat.includes('real') || cat.includes('propert') || cat.includes('estate');
  const isHealth = cat.includes('health') || cat.includes('clinic') || cat.includes('hospital') || cat.includes('dental');
  const isLogistics = cat.includes('logistics') || cat.includes('freight') || cat.includes('shipping') || cat.includes('haulage');
  const isHospitality = cat.includes('hotel') || cat.includes('shortlet') || cat.includes('beach') || cat.includes('restaurant');

  let sectorToolName = '24/7 WhatsApp AI Sales & Quoting Assistant';
  let sectorBadge = 'Instant Quoting Engine';
  if (isSolar) {
    sectorToolName = '24/7 WhatsApp Solar BOQ & Band A Avoidance Quoter';
    sectorBadge = 'Solar EPC Tool';
  } else if (isRealEstate) {
    sectorToolName = '24/7 WhatsApp Property Mortgage & Inspection Quoter';
    sectorBadge = 'Real Estate Tool';
  } else if (isHealth) {
    sectorToolName = '24/7 WhatsApp Patient Triage & HMO Pre-Booking Tool';
    sectorBadge = 'Healthcare Tool';
  } else if (isLogistics) {
    sectorToolName = '24/7 WhatsApp Haulage Rate & Duty Estimator';
    sectorBadge = 'Logistics Tool';
  } else if (isHospitality) {
    sectorToolName = '24/7 Direct WhatsApp Room Booking & VIP Reservation Engine';
    sectorBadge = 'Hospitality Tool';
  }

  const previewUrl = leadId ? `/preview/${leadId}` : null;
  const whatsappCta = `https://wa.me/2348022791227?text=${encodeURIComponent(
    `Hello Bethelmind Lagos Desk! I tested the 24/7 AI WhatsApp Quoting Tool demo for ${lead.name} and would like to connect this tool to our official business line.`
  )}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #090d16 0%, #0f172a 100%)',
      color: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      padding: '0 16px 80px 16px'
    }}>
      {/* Top Header */}
      <header style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
            color: '#fff'
          }}>
            B
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              Bethelmind Analytics
            </div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
              Lagos Commercial Growth Desk
            </div>
          </div>
        </div>

        <a
          href={whatsappCta}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#25D366',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            padding: '10px 18px',
            borderRadius: '999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(37,211,102,0.35)',
            transition: 'transform 0.15s ease'
          }}
        >
          <span>💬</span> Chat with Closer
        </a>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '960px', margin: '36px auto 0 auto' }}>
        {/* Dynamic Business Greeting Banner */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '14px',
          padding: '16px 22px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Interactive Tool Demonstration Prepared For:
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
              {lead.name}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '3px' }}>
              Category: <span style={{ color: '#fff', fontWeight: 600 }}>{lead.category}</span> • Location: <span style={{ color: '#fff', fontWeight: 600 }}>{lead.city}</span>
            </div>
          </div>
          {previewUrl && (
            <Link
              href={previewUrl}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 12px rgba(2,132,199,0.35)'
              }}
            >
              Open Your Full Prototype ➔
            </Link>
          )}
        </div>

        {/* Hero Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(56, 189, 248, 0.14)',
            color: '#38bdf8',
            fontSize: '0.8rem',
            fontWeight: 700,
            padding: '6px 14px',
            borderRadius: '99px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '14px'
          }}>
            ⚡ {sectorBadge}
          </div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.4rem)',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: '14px',
            letterSpacing: '-0.02em'
          }}>
            {sectorToolName}
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '1.02rem',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Test the live interactive tool pre-built for <b>{lead.name}</b>. In Nigerian business today, after-hours clients wait hours for manual pricing. This tool responds in under 3 seconds on WhatsApp with accurate, itemized calculations and instant closing steps.
          </p>
        </div>

        {/* View Toggle (Interactive Tool vs Full Prototype) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => {
              setActiveTab('simulator');
              trackJourney('chat_opened', { view: 'simulator' });
            }}
            style={{
              padding: '10px 22px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'simulator' ? '#38bdf8' : 'rgba(255,255,255,0.08)',
              color: activeTab === 'simulator' ? '#090d16' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            📱 24/7 WhatsApp AI Simulator
          </button>
          {previewUrl && (
            <button
              onClick={() => {
                setActiveTab('prototype');
                trackJourney('page_view', { view: 'prototype_iframe' });
              }}
              style={{
                padding: '10px 22px',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                border: 'none',
                background: activeTab === 'prototype' ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                color: activeTab === 'prototype' ? '#090d16' : '#94a3b8',
                transition: 'all 0.2s ease'
              }}
            >
              🌐 Interactive Prototype Portal View
            </button>
          )}
        </div>

        {/* TAB 1: WhatsApp Smartphone Simulator */}
        {activeTab === 'simulator' && (
          <div style={{
            maxWidth: '520px',
            margin: '0 auto 40px auto',
            background: '#0b141a',
            borderRadius: '32px',
            border: '8px solid #1f2937',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(56,189,248,0.15)',
            overflow: 'hidden'
          }}>
            {/* Phone Top Notch / Header */}
            <div style={{
              background: '#1f2c34',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff',
                fontSize: '1rem'
              }}>
                {lead.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: '#e9edef',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {lead.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#25D366', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#25D366' }}></span>
                  24/7 AI Sales Assistant • online
                </div>
              </div>
              <a
                href={whatsappCta}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25D366',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '6px 12px',
                  borderRadius: '99px',
                  textDecoration: 'none'
                }}
              >
                Connect Line
              </a>
            </div>

            {/* Chat Body */}
            <div style={{
              padding: '18px 14px',
              minHeight: '440px',
              background: 'radial-gradient(circle at center, #111b21 0%, #0b141a 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {/* Message 1: Inbound Customer */}
              <div style={{
                alignSelf: 'flex-start',
                maxWidth: '85%',
                background: '#202c33',
                color: '#e9edef',
                padding: '10px 14px',
                borderRadius: '12px 12px 12px 2px',
                fontSize: '0.88rem',
                lineHeight: 1.45,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {isSolar
                  ? 'Good day! How much is your complete 5kVA Solar Inverter installation in Lekki? Diesel prices are crushing our business.'
                  : isRealEstate
                  ? 'Hello! Is the 3-bedroom property in Lekki Phase 1 still available? Can I inspect this Saturday?'
                  : isHealth
                  ? 'Good day! Can I book an appointment with your dental specialist for tomorrow afternoon? Do you accept Reliance HMO?'
                  : `Good day! We need an urgent price quote and service availability for ${lead.name}. Are you available today?`}
                <div style={{ fontSize: '0.65rem', color: '#8696a0', textAlign: 'right', marginTop: '4px' }}>08:42 PM ✓✓</div>
              </div>

              {/* Message 2: Instant AI Response */}
              <div style={{
                alignSelf: 'flex-end',
                maxWidth: '88%',
                background: '#005c4b',
                color: '#e9edef',
                padding: '10px 14px',
                borderRadius: '12px 12px 2px 12px',
                fontSize: '0.88rem',
                lineHeight: 1.45,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {isSolar ? (
                  <>
                    Good day Chief! 🙏 Thank you for contacting <b>{lead.name}</b>.<br /><br />
                    We install complete Tier-1 Lithium Solar solutions across Lagos. A <b>5kVA Hybrid Solar System</b> eliminates 85% of your generator running cost and avoids DisCo Band A tariffs (₦209.50/kWh).<br /><br />
                    Select your system sizing below for your instant itemized bill:
                  </>
                ) : isRealEstate ? (
                  <>
                    Good day! 🙏 Thank you for reaching <b>{lead.name}</b>.<br /><br />
                    Yes! The 3-bedroom unit is available. Our private inspection schedule for Saturday is open between 10:00 AM and 3:00 PM.<br /><br />
                    Select your preferred unit below for the instant payment plan:
                  </>
                ) : isHealth ? (
                  <>
                    Good day! 🙏 Welcome to <b>{lead.name}</b> patient concierge.<br /><br />
                    Yes, we accept Reliance HMO, Hygeia, and Leadway. Our specialist clinic has 2 afternoon slots available tomorrow (02:00 PM and 04:30 PM).<br /><br />
                    Select your consultation type below to reserve your slot:
                  </>
                ) : (
                  <>
                    Good day! 🙏 Thank you for reaching <b>{lead.name}</b>.<br /><br />
                    We are available 24/7 to process your inquiry. Here is our instant interactive pricing sheet pre-calculated for your request:
                  </>
                )}
                <div style={{ fontSize: '0.65rem', color: '#aebac1', textAlign: 'right', marginTop: '6px' }}>08:42 PM (0.8s reply) ✓✓</div>
              </div>

              {/* Interactive Tool Card Inside WhatsApp */}
              <div style={{
                alignSelf: 'center',
                width: '100%',
                background: '#1f2c34',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '14px',
                padding: '14px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                  📊 Live Interactive Quoter
                </div>

                {isSolar ? (
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '8px' }}>Select Inverter Capacity:</div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                      {(['3.5kVA', '5kVA', '10kVA'] as const).map((k) => (
                        <button
                          key={k}
                          onClick={() => {
                            setSolarKva(k);
                            trackJourney('calculator_used', { calculationSummary: `Solar Sizing: ${k}` });
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 4px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: solarKva === k ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                            color: solarKva === k ? '#090d16' : '#fff'
                          }}
                        >
                          {k}
                        </button>
                      ))}
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', lineHeight: 1.6 }}>
                      <div>🔋 <b>Battery:</b> {solarKva === '3.5kVA' ? '2.5kWh Lithium' : solarKva === '5kVA' ? '5.12kWh 48V Lithium' : '10.24kWh High-Voltage'}</div>
                      <div>☀️ <b>Panels:</b> {solarKva === '3.5kVA' ? '4x 550W Mono' : solarKva === '5kVA' ? '8x 550W Tier-1 Mono' : '16x 550W Bi-Facial'}</div>
                      <div>💰 <b>Estimated Price:</b> <span style={{ color: '#4ade80', fontWeight: 700 }}>{solarKva === '3.5kVA' ? '₦2,450,000' : solarKva === '5kVA' ? '₦3,850,000' : '₦7,600,000'}</span></div>
                      <div>📉 <b>Diesel Savings:</b> <span style={{ color: '#38bdf8', fontWeight: 700 }}>{solarKva === '3.5kVA' ? '₦180,000/mo' : solarKva === '5kVA' ? '₦340,000/mo' : '₦720,000/mo'}</span></div>
                    </div>
                  </div>
                ) : isRealEstate ? (
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '8px' }}>Select Property Type:</div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                      {(['2-Bed', '3-Bed', 'Duplex'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            setPropertyType(p);
                            trackJourney('calculator_used', { calculationSummary: `Property Type: ${p}` });
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 4px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: propertyType === p ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                            color: propertyType === p ? '#090d16' : '#fff'
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', lineHeight: 1.6 }}>
                      <div>🏠 <b>Unit:</b> {propertyType} Luxury Apartment</div>
                      <div>💳 <b>Price:</b> <span style={{ color: '#4ade80', fontWeight: 700 }}>{propertyType === '2-Bed' ? '₦65,000,000' : propertyType === '3-Bed' ? '₦95,000,000' : '₦170,000,000'}</span></div>
                      <div>📅 <b>Initial Deposit (30%):</b> {propertyType === '2-Bed' ? '₦19,500,000' : propertyType === '3-Bed' ? '₦28,500,000' : '₦51,000,000'}</div>
                      <div>📍 <b>Location:</b> Lekki Phase 1, Lagos</div>
                    </div>
                  </div>
                ) : isHealth ? (
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '8px' }}>Select Consultation Type:</div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                      {(['General Doctor', 'Dental Specialist', 'Pediatric Care'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setHealthSlot(s);
                            trackJourney('calculator_used', { calculationSummary: `Health Consultation: ${s}` });
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 4px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: healthSlot === s ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                            color: healthSlot === s ? '#090d16' : '#fff'
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', lineHeight: 1.6 }}>
                      <div>🩺 <b>Triage Service:</b> {healthSlot}</div>
                      <div>💳 <b>Consultation Fee:</b> <span style={{ color: '#4ade80', fontWeight: 700 }}>{healthSlot === 'General Doctor' ? '₦15,000' : healthSlot === 'Dental Specialist' ? '₦35,000' : '₦25,000'}</span></div>
                      <div>🛡️ <b>HMO Coverage:</b> Reliance, Hygeia, Leadway &amp; AXA Mansard Verified</div>
                      <div>⏱️ <b>Next Slot Available:</b> Today, 02:30 PM WAT</div>
                    </div>
                  </div>
                ) : isHospitality ? (
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '8px' }}>Select Room Category:</div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                      {(['Executive Room', 'Deluxe Suite', 'VIP Penthouse'] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            setRoomType(r);
                            trackJourney('calculator_used', { calculationSummary: `Room Category: ${r}` });
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 4px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: roomType === r ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                            color: roomType === r ? '#090d16' : '#fff'
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', lineHeight: 1.6 }}>
                      <div>🛏️ <b>Room Type:</b> {roomType}</div>
                      <div>💳 <b>Nightly Rate:</b> <span style={{ color: '#4ade80', fontWeight: 700 }}>{roomType === 'Executive Room' ? '₦45,000/night' : roomType === 'Deluxe Suite' ? '₦85,000/night' : '₦220,000/night'}</span></div>
                      <div>🎁 <b>Direct WhatsApp Perk:</b> Free Breakfast &amp; 15% Savings vs Booking.com</div>
                      <div>⚡ <b>Instant Confirmation:</b> Room held on WhatsApp in 3 seconds</div>
                    </div>
                  </div>
                ) : isLogistics ? (
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '8px' }}>Select Cargo Haulage Tonnage:</div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                      {(['5-Ton Truck', '15-Ton Haulage', '30-Ton Container'] as const).map((h) => (
                        <button
                          key={h}
                          onClick={() => {
                            setHaulageTonnage(h);
                            trackJourney('calculator_used', { calculationSummary: `Haulage Tonnage: ${h}` });
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 4px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: haulageTonnage === h ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                            color: haulageTonnage === h ? '#090d16' : '#fff'
                          }}
                        >
                          {h}
                        </button>
                      ))}
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', lineHeight: 1.6 }}>
                      <div>🚛 <b>Vehicle Class:</b> {haulageTonnage} (Interstate Transit)</div>
                      <div>💳 <b>Estimated Rate:</b> <span style={{ color: '#4ade80', fontWeight: 700 }}>{haulageTonnage === '5-Ton Truck' ? '₦185,000' : haulageTonnage === '15-Ton Haulage' ? '₦380,000' : '₦750,000'}</span></div>
                      <div>📦 <b>Route Corridor:</b> Apapa / Tin Can Island ➔ Nationwide Delivery</div>
                      <div>⏱️ <b>Dispatch SLA:</b> Dedicated driver assigned in &lt; 2 hours</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', lineHeight: 1.6 }}>
                      <div>⚡ <b>Service:</b> 24/7 Automated Quoting & Appointment Booking</div>
                      <div>⏱️ <b>Response Time:</b> &lt; 3 seconds on WhatsApp</div>
                      <div>💳 <b>Direct Settlement:</b> Instant Paystack &amp; Moniepoint Bank Verification</div>
                      <div>📈 <b>Lead Conversion Rate:</b> +42% after-hours recovery</div>
                    </div>
                  </div>
                )}

                {/* Simulated Action Buttons */}
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a
                    href={whatsappCta}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#25D366',
                      color: '#fff',
                      padding: '9px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'block'
                    }}
                  >
                    💬 Lock Quote &amp; Chat on WhatsApp
                  </a>
                  {previewUrl && (
                    <Link
                      href={previewUrl}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: '#38bdf8',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        textDecoration: 'none',
                        display: 'block'
                      }}
                    >
                      🌐 Test Full Website Prototype
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Embedded Prototype Portal View */}
        {activeTab === 'prototype' && previewUrl && (
          <div style={{
            background: '#111827',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
            marginBottom: '40px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#1f2937',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Live Prototype: <span style={{ color: '#38bdf8', fontWeight: 600 }}>{lead.name}</span>
              </div>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.78rem',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Open in Full Screen ↗
              </a>
            </div>
            <iframe
              src={previewUrl}
              style={{
                width: '100%',
                height: '750px',
                border: 'none',
                background: '#fff'
              }}
              title={`${lead.name} Live Prototype`}
            />
          </div>
        )}

        {/* Call To Action Banner */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '50px'
        }}>
          <a
            href={whatsappCta}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 800,
              padding: '18px 36px',
              borderRadius: '14px',
              boxShadow: '0 10px 25px rgba(37,211,102,0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              maxWidth: '100%',
              textAlign: 'center',
              transition: 'transform 0.2s ease'
            }}
          >
            <span>💬</span> Connect 24/7 AI Assistant to Your Official WhatsApp Line
          </a>

          {previewUrl && (
            <Link
              href={previewUrl}
              style={{
                color: '#38bdf8',
                fontSize: '0.95rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              View Your Live Customized Website Prototype ➔
            </Link>
          )}
        </div>

        {/* Commercial Monetization Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Option 1: DFY Turnkey */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              right: '20px',
              background: '#38bdf8',
              color: '#090d16',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '99px',
              textTransform: 'uppercase'
            }}>
              Most Popular
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              100% Done-For-You Turnkey Deployment
            </h3>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>
              ₦75,000 <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>50% Milestone Deposit (₦150k Complete)</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '18px', lineHeight: 1.5 }}>
              Complete standalone commercial web portal deployed in 48 hours for firms with no website.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '0.85rem', lineHeight: 1.8, color: '#cbd5e1' }}>
              <li>✔ Custom <b>.com.ng</b> Domain Registered</li>
              <li>✔ 24/7 Ultra-Fast Cloud Hosting (0ms Lag)</li>
              <li>✔ Google Maps &amp; Lagos SEO Listing</li>
              <li>✔ Pre-Installed 24/7 AI WhatsApp Quoter</li>
              <li>✔ Automated Paystack &amp; Moniepoint Payment Verification</li>
              <li>✔ 48-Hour Full Handover SLA</li>
            </ul>

            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent(
                `Hello Bethelmind Lagos Desk! I want to proceed with the 100% Turnkey DFY Website Deployment (₦75k deposit) for ${lead.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                background: '#38bdf8',
                color: '#090d16',
                textAlign: 'center',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
            >
              Order 100% Turnkey Deployment
            </a>
          </div>

          {/* Option 2: 1-Line Embed */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              10-Minute 1-Line Embed Script Upgrade
            </h3>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4ade80', marginBottom: '4px' }}>
              ₦35,000 <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>One-Time Setup (₦65k VIP)</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '18px', lineHeight: 1.5 }}>
              For companies that already have an active website. Zero migration hassle.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '0.85rem', lineHeight: 1.8, color: '#cbd5e1' }}>
              <li>✔ 1-Line JavaScript Embed Tag</li>
              <li>✔ 100% Safe (Current Hosting &amp; Domain Untouched)</li>
              <li>✔ Pre-Trained on Your Pricing &amp; Service Catalog</li>
              <li>✔ 24/7 Nigerian Tone WhatsApp Quotation &amp; Booking</li>
              <li>✔ Works with WordPress, Wix, Shopify &amp; Custom Sites</li>
              <li>✔ Setup Completed in Under 10 Minutes</li>
            </ul>

            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent(
                `Hello Bethelmind Lagos Desk! We already have a website for ${lead.name} and want the ₦35,000 1-Line Script Embed upgrade.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                textAlign: 'center',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              Get 1-Line Embed Upgrade
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: '60px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.8rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px'
        }}>
          <div>Bethelmind Analytics Lagos Desk • Plot 12, Commercial Corridor, Lagos, Nigeria</div>
          <div style={{ marginTop: '4px' }}>Direct Support &amp; Closer Desk: 0802 279 1227 • bethelmindrecruit@gmail.com</div>
        </footer>
      </main>
    </div>
  );
}

export default function WalkthroughPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#090d16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading interactive tool demonstration...
      </div>
    }>
      <WalkthroughContent />
    </Suspense>
  );
}
