'use client';

import React, { useState, useEffect } from 'react';
import { Route, CheckCircle, Clock, Zap, MessageSquare, Send, PhoneCall, ShieldCheck, Award, Eye, Search, RefreshCw, ExternalLink, TrendingUp, BarChart3, Filter } from 'lucide-react';
import { JourneyStage, LeadJourneyRecord } from '@/lib/leadJourneyTracker';

const STAGE_ORDER: { stage: JourneyStage; label: string; icon: any; color: string }[] = [
  { stage: 'SCRAPED', label: '1. Scraped', icon: Route, color: '#60a5fa' },
  { stage: 'ENRICHED', label: '2. AI Scored', icon: Zap, color: '#a855f7' },
  { stage: 'OUTREACH_DISPATCHED', label: '3. Form/Email Sent', icon: Send, color: '#38bdf8' },
  { stage: 'PREVIEW_VIEWED', label: '4. Preview Viewed', icon: Eye, color: '#eab308' },
  { stage: 'INBOUND_REPLY', label: '5. WA Inbound', icon: MessageSquare, color: '#10b981' },
  { stage: 'PILOT_ACTIVATED', label: '6. 5-Day Pilot', icon: ShieldCheck, color: '#f59e0b' },
  { stage: 'DEAL_WON', label: '7. Paid Client! 🎉', icon: Award, color: '#ec4899' },
];

export default function LeadJourneyTrackerCard() {
  const [journeys, setJourneys] = useState<LeadJourneyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [advancingStage, setAdvancingStage] = useState(false);

  const fetchJourneys = async () => {
    try {
      const res = await fetch('/api/lead-journey?limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data.journeys) {
          setJourneys(data.journeys);
          if (!selectedLeadId && data.journeys.length > 0) {
            setSelectedLeadId(data.journeys[0].leadId);
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch lead journeys:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneys();
    const interval = setInterval(fetchJourneys, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvanceStage = async (lead: LeadJourneyRecord, nextStage: JourneyStage, stageTitle: string) => {
    setAdvancingStage(true);
    try {
      await fetch('/api/lead-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.leadId,
          leadName: lead.leadName,
          category: lead.category,
          phone: lead.phone,
          email: lead.email,
          stage: nextStage,
          title: stageTitle,
          description: `Lead advanced to ${nextStage} via Dashboard Action`,
          channelUsed: 'Dashboard Journey Tracker'
        })
      });
      fetchJourneys();
    } catch (e) {
      console.error('Failed to advance lead journey stage:', e);
    } finally {
      setAdvancingStage(false);
    }
  };

  // Funnel Analytics Calculations
  const totalJourneys = journeys.length;
  const stageCounts: Record<JourneyStage, number> = {
    SCRAPED: 0,
    ENRICHED: 0,
    OUTREACH_DISPATCHED: 0,
    PREVIEW_VIEWED: 0,
    CALCULATOR_USED: 0,
    VIDEO_WATCHED: 0,
    CHAT_OPENED: 0,
    CHECKOUT_CLICKED: 0,
    INBOUND_REPLY: 0,
    PILOT_ACTIVATED: 0,
    DEAL_WON: 0,
    DEAL_LOST: 0
  };

  journeys.forEach(j => {
    if (stageCounts[j.currentStage] !== undefined) {
      stageCounts[j.currentStage]++;
    }
  });

  const totalOutreached = stageCounts.OUTREACH_DISPATCHED + stageCounts.PREVIEW_VIEWED + stageCounts.INBOUND_REPLY + stageCounts.PILOT_ACTIVATED + stageCounts.DEAL_WON;
  const totalViewed = stageCounts.PREVIEW_VIEWED + stageCounts.INBOUND_REPLY + stageCounts.PILOT_ACTIVATED + stageCounts.DEAL_WON;
  const totalDeals = stageCounts.DEAL_WON;

  const viewRate = totalOutreached > 0 ? ((totalViewed / totalOutreached) * 100).toFixed(1) : '0.0';
  const conversionRate = totalJourneys > 0 ? ((totalDeals / totalJourneys) * 100).toFixed(1) : '0.0';

  const filteredJourneys = journeys.filter(j => {
    const matchesSearch = j.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.phone && j.phone.includes(searchQuery));
    const matchesStage = stageFilter === 'ALL' || j.currentStage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const activeRecord = journeys.find(j => j.leadId === selectedLeadId) || filteredJourneys[0] || journeys[0];

  const getStageIndex = (stage: JourneyStage) => {
    const idx = STAGE_ORDER.findIndex(s => s.stage === stage);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      padding: '24px',
      color: '#fff',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(12px)',
      marginBottom: '24px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)'
          }}>
            <BarChart3 size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#f8fafc', letterSpacing: '-0.01em' }}>
              📍 Detailed Total Lead Journey Analytics & Funnel Engine
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              End-to-End Conversion Funnel & Milestone Touchpoint Analytics
            </p>
          </div>
        </div>

        <button
          onClick={fetchJourneys}
          disabled={loading}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#cbd5e1',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600
          }}
        >
          <RefreshCw size={14} className={loading ? 'spin-anim' : ''} /> Sync Analytics
        </button>
      </div>

      {/* TOTAL LEAD JOURNEY ANALYTICS BANNER & CONVERSION FUNNEL STATS */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '12px',
        padding: '16px 20px',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        marginBottom: '20px'
      }}>
        {/* KPI Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.25)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#93c5fd', fontWeight: 700, letterSpacing: '0.05em' }}>Total Ingested</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>{totalJourneys}</div>
          </div>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#7dd3fc', fontWeight: 700, letterSpacing: '0.05em' }}>Dispatched</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>{totalOutreached}</div>
          </div>
          <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.25)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#fde047', fontWeight: 700, letterSpacing: '0.05em' }}>Preview Views</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>{totalViewed} <span style={{ fontSize: '0.72rem', color: '#eab308' }}>({viewRate}%)</span></div>
          </div>
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.25)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#f472b6', fontWeight: 700, letterSpacing: '0.05em' }}>Paid Deals Won</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ec4899', marginTop: '2px' }}>{totalDeals} <span style={{ fontSize: '0.72rem', color: '#f472b6' }}>({conversionRate}%)</span></div>
          </div>
        </div>

        {/* Visual 7-Stage Conversion Funnel Bar */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={14} color="#a855f7" /> Live Funnel Distribution Across 7 Stages:
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {STAGE_ORDER.map(s => {
              const count = stageCounts[s.stage] || 0;
              const pct = totalJourneys > 0 ? ((count / totalJourneys) * 100).toFixed(0) : 0;
              const isFilterActive = stageFilter === s.stage;

              return (
                <button
                  key={s.stage}
                  onClick={() => setStageFilter(isFilterActive ? 'ALL' : s.stage)}
                  style={{
                    background: isFilterActive ? s.color : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isFilterActive ? '#fff' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px',
                    padding: '8px 4px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: isFilterActive ? '#000' : '#fff'
                  }}
                  title={`Filter by ${s.label}`}
                >
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, opacity: isFilterActive ? 1 : 0.8, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {s.label.split('.')[1].trim()}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '2px', color: isFilterActive ? '#000' : s.color }}>
                    {count}
                  </div>
                  <div style={{ fontSize: '0.6rem', opacity: isFilterActive ? 0.9 : 0.6 }}>
                    {pct}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Filter Switcher Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={12} /> Filter Journey List:
          </span>
          <button
            onClick={() => setStageFilter('ALL')}
            style={{
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: stageFilter === 'ALL' ? '#a855f7' : 'rgba(255,255,255,0.06)',
              color: stageFilter === 'ALL' ? '#fff' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            All Journeys ({totalJourneys})
          </button>
          {STAGE_ORDER.map(s => (
            <button
              key={s.stage}
              onClick={() => setStageFilter(s.stage)}
              style={{
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: stageFilter === s.stage ? s.color : 'rgba(255,255,255,0.04)',
                color: stageFilter === s.stage ? '#000' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {s.label.split('.')[1].trim()} ({stageCounts[s.stage] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left = Lead Selector, Right = Visual Journey Stepper */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '20px' }}>
        
        {/* Left Column: Lead List Search */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search lead by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.8rem'
              }}
            />
          </div>

          <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredJourneys.length === 0 ? (
              <div style={{ padding: '16px', textOverflow: 'ellipsis', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                No active journeys match your search filter.
              </div>
            ) : (
              filteredJourneys.map(j => {
                const isSelected = j.leadId === selectedLeadId;
                const currentStageObj = STAGE_ORDER.find(s => s.stage === j.currentStage) || STAGE_ORDER[0];
                return (
                  <div
                    key={j.leadId}
                    onClick={() => setSelectedLeadId(j.leadId)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isSelected ? '#a855f7' : 'rgba(255,255,255,0.05)'}`,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? '#e9d5ff' : '#f1f5f9' }}>
                        {j.leadName}
                      </span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: currentStageObj.color, background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px' }}>
                        {currentStageObj.label.split('.')[1]}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{j.category}</span>
                      <span>Score: {j.score}/100</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Visual Journey Stepper & Event Timeline */}
        {activeRecord ? (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            
            {/* Active Lead Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                  {activeRecord.leadName}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {activeRecord.category} • Scored {activeRecord.score}/100 • Updated {activeRecord.lastUpdatedWat}
                </span>
              </div>

              <a
                href={activeRecord.previewUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#c084fc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  background: 'rgba(168, 85, 247, 0.15)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(168, 85, 247, 0.3)'
                }}
              >
                View Live Preview <ExternalLink size={12} />
              </a>
            </div>

            {/* 7-Stage Milestone Stepper */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                7-Stage Milestone Progression:
              </span>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', flexWrap: 'wrap', gap: '8px' }}>
                {STAGE_ORDER.map((s, idx) => {
                  const activeIdx = getStageIndex(activeRecord.currentStage);
                  const isCompleted = idx <= activeIdx;
                  const isCurrent = idx === activeIdx;
                  const Icon = s.icon;

                  return (
                    <div
                      key={s.stage}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        flex: 1,
                        minWidth: '60px',
                        opacity: isCompleted ? 1 : 0.4
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isCurrent ? s.color : isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: `2px solid ${isCurrent ? '#fff' : isCompleted ? s.color : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isCurrent ? `0 0 12px ${s.color}` : 'none'
                      }}>
                        <Icon size={14} color={isCurrent ? '#000' : isCompleted ? s.color : '#94a3b8'} />
                      </div>
                      <span style={{ fontSize: '0.65rem', fontWeight: isCurrent ? 800 : 500, color: isCurrent ? s.color : '#cbd5e1', textAlign: 'center' }}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Stage Advancer */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                Advance Journey Stage:
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleAdvanceStage(activeRecord, 'OUTREACH_DISPATCHED', 'Form/Email Sent')}
                  disabled={advancingStage}
                  style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38bdf8', color: '#38bdf8', cursor: 'pointer' }}
                >
                  ✓ Mark Form Sent
                </button>
                <button
                  onClick={() => handleAdvanceStage(activeRecord, 'INBOUND_REPLY', 'Inbound WhatsApp Inquiry')}
                  disabled={advancingStage}
                  style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', cursor: 'pointer' }}
                >
                  💬 Inbound Reply
                </button>
                <button
                  onClick={() => handleAdvanceStage(activeRecord, 'PILOT_ACTIVATED', '5-Day Pilot Started')}
                  disabled={advancingStage}
                  style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#f59e0b', cursor: 'pointer' }}
                >
                  ⚡ Start 5-Day Pilot
                </button>
                <button
                  onClick={() => handleAdvanceStage(activeRecord, 'DEAL_WON', 'Closed Paid Client 🎉')}
                  disabled={advancingStage}
                  style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.2)', border: '1px solid #ec4899', color: '#ec4899', cursor: 'pointer', fontWeight: 700 }}
                >
                  🎉 Close Paid Deal
                </button>
              </div>
            </div>

            {/* Event Log Timeline */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                Chronological Touchpoint History:
              </span>

              <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeRecord.events && activeRecord.events.map((evt, idx) => (
                  <div
                    key={evt.id || idx}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.03)',
                      borderLeft: `3px solid ${STAGE_ORDER.find(s => s.stage === evt.stage)?.color || '#3b82f6'}`,
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{evt.title}</span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{evt.timestampWat}</span>
                    </div>
                    <p style={{ margin: '2px 0 0 0', color: '#cbd5e1', fontSize: '0.72rem' }}>
                      {evt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div style={{ padding: '40px', textOverflow: 'ellipsis', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
            Select a lead on the left to inspect complete 7-stage journey history.
          </div>
        )}
      </div>
    </div>
  );
}
