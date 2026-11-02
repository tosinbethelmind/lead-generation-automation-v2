'use client';

/**
 * @file src/components/admin/Pillar2ControlView.tsx
 * 
 * 🏛️ PILLAR 2: HIGH-TICKET BROKERAGE & LUXURY DEAL WIRE CONTROL CENTER
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
 * 
 * Mobile-First Execution Dashboard:
 * 1. Financial Pipeline Metrics (₦24.96B+ Asset Pool, ₦249.6M+ 20% Co-Brokerage Pool)
 * 2. 1-Tap Co-Pilot Mandate Approvals & Real-Time Outbound Queue Consumer
 * 3. Fresh Mandate Discovery Trigger (Jiji / Search Dorks / Verified Brokers)
 * 4. Transparent LASRERA 80/20 Co-Brokerage Joint Inspection Memo (JIM) Tracking
 */

import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  FileText, 
  X, 
  Clock, 
  ShieldCheck, 
  Building, 
  ArrowUpRight,
  TrendingUp,
  ChevronRight,
  PhoneCall
} from 'lucide-react';

interface Pillar2ControlViewProps {
  pillar2Data: any;
  triggerLoading: string | null;
  onApproveTicket: (ticketId: string) => Promise<void>;
  onRejectTicket: (ticketId: string) => Promise<void>;
  onRunDiscovery: () => Promise<void>;
  onProcessQueue: () => Promise<void>;
  onRefresh: () => void;
  onCopyText: (text: string, label?: string) => void;
}

export default function Pillar2ControlView({
  pillar2Data,
  triggerLoading,
  onApproveTicket,
  onRejectTicket,
  onRunDiscovery,
  onProcessQueue,
  onRefresh,
  onCopyText
}: Pillar2ControlViewProps) {
  const [subTab, setSubTab] = useState<'pending' | 'queue' | 'dispatched'>('pending');
  const [scriptModalTicket, setScriptModalTicket] = useState<any | null>(null);
  const [scriptModalTab, setScriptModalTab] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [callBriefModalTicket, setCallBriefModalTicket] = useState<any | null>(null);

  const handleApproveAndSwitch = async (ticketId: string) => {
    await onApproveTicket(ticketId);
    // Automatically switch to Outbound Queue / Dispatched tab so the user sees their deal immediately
    setSubTab('queue');
  };

  const stats = pillar2Data?.stats || {
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalAssetPoolNGN: 0,
    totalOriginationPoolNGN: 0,
    queuedOutboundCount: 0,
    dispatchedCount: 0
  };

  const pendingTickets = pillar2Data?.pendingTickets || [];
  const outboundQueue = pillar2Data?.outboundQueue || [];
  const dispatchedLedger = pillar2Data?.dispatchedLedger || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── 1. FINANCIAL PIPELINE & SETTLEMENT HEADER ─────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '14px',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pillar 2 Sovereign Deal Wire
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>
              High-Ticket Mandates & Co-Brokerage
            </h2>
          </div>
          <span style={{
            background: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '999px',
            padding: '3px 8px',
            fontSize: '10px',
            fontWeight: 800
          }}>
            LASRERA 80/20
          </span>
        </div>

        {/* Financial Stat Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            background: '#090e1a',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '12px'
          }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>Total Luxury Asset Value</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
              ₦{(stats.totalAssetPoolNGN || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>Prime Lekki / VI Assets</div>
          </div>

          <div style={{
            background: '#090e1a',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '10px',
            padding: '12px'
          }}>
            <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>Est. 20% Co-Brokerage Pool</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
              ₦{(stats.totalOriginationPoolNGN || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>Contingent on closing</div>
          </div>
        </div>

        {/* Corporate Settlement Account Badge */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid #1e293b',
          borderRadius: '8px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span style={{ color: '#cbd5e1' }}>Settlement: <b>Moniepoint MFB (6805375225)</b></span>
          </div>
          <button
            onClick={() => onCopyText('6805375225', 'Moniepoint Account')}
            style={{
              background: '#1e293b',
              border: 'none',
              color: '#38bdf8',
              borderRadius: '6px',
              padding: '3px 6px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Copy
          </button>
        </div>
      </div>

      {/* ── 2. QUICK ACTION COMMAND TOOLBAR ───────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button
          onClick={onRunDiscovery}
          disabled={triggerLoading === 'discovery'}
          style={{
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            border: 'none',
            color: '#ffffff',
            borderRadius: '10px',
            padding: '12px 10px',
            fontSize: '12px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)',
            opacity: triggerLoading === 'discovery' ? 0.7 : 1
          }}
        >
          <Search size={14} />
          <span>{triggerLoading === 'discovery' ? 'Scanning Jiji & Dorks...' : '🔍 Discover Deals'}</span>
        </button>

        <button
          onClick={onProcessQueue}
          disabled={triggerLoading === 'process_queue'}
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            border: 'none',
            color: '#ffffff',
            borderRadius: '10px',
            padding: '12px 10px',
            fontSize: '12px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
            opacity: triggerLoading === 'process_queue' ? 0.7 : 1
          }}
        >
          <Send size={14} />
          <span>{triggerLoading === 'process_queue' ? 'Draining Queue...' : '⚡ Process Queue'}</span>
        </button>
      </div>

      {/* ── 3. SUB-NAVIGATION TABS ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        background: '#090e1a',
        borderRadius: '10px',
        padding: '4px',
        border: '1px solid #1e293b'
      }}>
        {[
          { key: 'pending', label: 'Staged Deals', count: stats.pendingCount },
          { key: 'queue', label: 'Outbound Queue', count: stats.queuedOutboundCount },
          { key: 'dispatched', label: 'Dispatched Ledger', count: stats.dispatchedCount }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key as any)}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '8px',
              border: 'none',
              background: subTab === t.key ? '#1e293b' : 'transparent',
              color: subTab === t.key ? '#fbbf24' : '#94a3b8',
              fontSize: '11px',
              fontWeight: subTab === t.key ? 800 : 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span>{t.label}</span>
            <span style={{
              background: subTab === t.key ? 'rgba(245, 158, 11, 0.25)' : '#0f172a',
              color: subTab === t.key ? '#fbbf24' : '#64748b',
              padding: '1px 5px',
              borderRadius: '999px',
              fontSize: '9px',
              fontWeight: 800
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── SUB-TAB 1: STAGED DEALS (PENDING 1-TAP APPROVAL) ───────────────── */}
      {subTab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
              Pending Co-Pilot Approvals ({pendingTickets.length})
            </span>
            <button
              onClick={onRefresh}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#38bdf8',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <RefreshCw size={11} />
              <span>Refresh</span>
            </button>
          </div>

          {pendingTickets.length === 0 ? (
            <div style={{
              background: '#090e1a',
              border: '1px dashed #334155',
              borderRadius: '12px',
              padding: '32px 16px',
              textAlign: 'center',
              color: '#94a3b8'
            }}>
              <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontWeight: 800, color: '#f1f5f9', fontSize: '14px' }}>All Staged Deals Approved!</div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 16px 0' }}>
                No deals currently waiting for review. Tap below to scan and stage new high-ticket luxury assets.
              </p>
              <button
                onClick={onRunDiscovery}
                style={{
                  background: '#d97706',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Scan Fresh Deals Now
              </button>
            </div>
          ) : (
            pendingTickets.map((ticket: any) => {
              const isApproving = triggerLoading === ticket.ticketId;
              const formattedPrice = `₦${(ticket.propertyValueNGN || 0).toLocaleString()}`;
              const formattedCut = `₦${(ticket.projectedRevenueNGN || 0).toLocaleString()}`;

              return (
                <div
                  key={ticket.ticketId}
                  style={{
                    background: '#090e1a',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  {/* Top Bar: Opportunity & Price */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{
                        background: 'rgba(217, 119, 6, 0.2)',
                        color: '#fbbf24',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: 800
                      }}>
                        #{ticket.ticketId}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 900, color: '#38bdf8' }}>
                        {formattedPrice}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', margin: '6px 0 2px 0', lineHeight: '1.3' }}>
                      {ticket.title?.replace('Pillar 2 Mandate: ', '') || 'Luxury Asset Mandate'}
                    </h3>

                    <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
                      <span>👤 Partner: <b>{ticket.targetBusinessName}</b></span>
                      <span>·</span>
                      <span>📞 {ticket.targetContactPhone}</span>
                      {ticket.targetContactEmail && (
                        <>
                          <span>·</span>
                          <span style={{ color: '#c084fc' }}>✉️ {ticket.targetContactEmail}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Financial Settlement & Legal Memo Highlight */}
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700 }}>Est. 20% Co-Brokerage Pool</div>
                      <div style={{ fontSize: '13px', fontWeight: 900, color: '#10b981' }}>{formattedCut} NGN</div>
                    </div>
                    <span style={{ fontSize: '9px', color: '#64748b', textAlign: 'right' }}>
                      LASRERA 80/20 JIM<br />Moniepoint 6805375225
                    </span>
                  </div>

                  {/* Tri-Channel Outbound Relay Bar */}
                  <div>
                    <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      ⚡ Tri-Channel Direct Outbound
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
                      <a
                        href={ticket.directChatLink || `https://wa.me/${String(ticket.targetContactPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(ticket.preDraftedScript || '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: '#064e3b',
                          border: '1px solid #059669',
                          color: '#34d399',
                          borderRadius: '6px',
                          padding: '6px 2px',
                          fontSize: '10px',
                          fontWeight: 800,
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px'
                        }}
                      >
                        <span>💬 WhatsApp</span>
                      </a>

                      <a
                        href={ticket.smsLink || `sms:+${String(ticket.targetContactPhone || '').replace(/\D/g, '')}?body=${encodeURIComponent(ticket.smsText || '')}`}
                        style={{
                          background: '#0c4a6e',
                          border: '1px solid #0284c7',
                          color: '#38bdf8',
                          borderRadius: '6px',
                          padding: '6px 2px',
                          fontSize: '10px',
                          fontWeight: 800,
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px'
                        }}
                      >
                        <span>📱 GSM SMS</span>
                      </a>

                      <a
                        href={ticket.emailLink || `mailto:${ticket.targetContactEmail || ''}`}
                        style={{
                          background: '#4a044e',
                          border: '1px solid #a21caf',
                          color: '#e879f9',
                          borderRadius: '6px',
                          padding: '6px 2px',
                          fontSize: '10px',
                          fontWeight: 800,
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px'
                        }}
                      >
                        <span>✉️ Email</span>
                      </a>
                    </div>
                  </div>

                  {/* Action Buttons: 1-Tap Approve, View Script */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6px' }}>
                    <button
                      onClick={() => handleApproveAndSwitch(ticket.ticketId)}
                      disabled={isApproving}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        color: '#ffffff',
                        borderRadius: '8px',
                        padding: '10px 8px',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        opacity: isApproving ? 0.7 : 1
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>{isApproving ? 'Approving...' : '🚀 1-Tap Approve'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setScriptModalTab('whatsapp');
                        setScriptModalTicket(ticket);
                      }}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#38bdf8',
                        borderRadius: '8px',
                        padding: '10px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <FileText size={13} />
                      <span>📜 View Brief</span>
                    </button>
                  </div>

                  {/* Inbound Call Crib Sheet Trigger */}
                  <button
                    onClick={() => setCallBriefModalTicket(ticket)}
                    style={{
                      background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.2) 0%, rgba(180, 83, 9, 0.1) 100%)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#fbbf24',
                      borderRadius: '8px',
                      padding: '9px 10px',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    <PhoneCall size={13} />
                    <span>📞 Inbound Call Crib Sheet (If Partner Calls You)</span>
                  </button>

                  {/* Secondary Line: Dismiss and Listing link */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                    {ticket.listingUrl && (
                      <a
                        href={ticket.listingUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '10px',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          textDecoration: 'none'
                        }}
                      >
                        <span>View Jiji Listing</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                    <button
                      onClick={() => onRejectTicket(ticket.ticketId)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '10px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '2px 4px'
                      }}
                    >
                      Dismiss / Archive
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── SUB-TAB 2: OUTBOUND QUEUE ──────────────────────────────────────── */}
      {subTab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
              Pending Outbound Gateways ({outboundQueue.length})
            </span>
            <button
              onClick={onProcessQueue}
              disabled={triggerLoading === 'process_queue'}
              style={{
                background: '#0284c7',
                border: 'none',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Dispatch Now
            </button>
          </div>

          {outboundQueue.length === 0 ? (
            <div style={{
              background: '#090e1a',
              border: '1px dashed #334155',
              borderRadius: '10px',
              padding: '24px 16px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '12px'
            }}>
              Outbound queue is currently empty. Approving a staged deal will immediately queue it here.
            </div>
          ) : (
            outboundQueue.map((item: any, idx: number) => (
              <div
                key={idx}
                style={{
                  background: '#090e1a',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>
                    #{item.ticketId}
                  </span>
                  <span style={{
                    background: item.status === 'QUEUED_FOR_OUTBOUND' ? 'rgba(217, 119, 6, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: item.status === 'QUEUED_FOR_OUTBOUND' ? '#fbbf24' : '#10b981',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '9px',
                    fontWeight: 800
                  }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                  {item.opportunityTitle || 'High-Ticket Mandate'}
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                  <span>Recipient: <b>{item.recipientName}</b></span>
                  <span>·</span>
                  <span>📞 {item.recipientPhone}</span>
                  {item.recipientEmail && (
                    <>
                      <span>·</span>
                      <span style={{ color: '#c084fc' }}>✉️ {item.recipientEmail}</span>
                    </>
                  )}
                </div>

                {/* Tri-Channel Outbound Relay Bar */}
                <div style={{
                  background: '#070a12',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Multi-Channel Relay Gateways
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
                    <a
                      href={item.directChatLink || `https://wa.me/${String(item.recipientPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(item.scriptText || '')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#064e3b',
                        border: '1px solid #059669',
                        color: '#34d399',
                        padding: '6px 4px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px'
                      }}
                    >
                      <span>💬 WhatsApp</span>
                    </a>

                    <a
                      href={item.smsLink || `sms:+${String(item.recipientPhone || '').replace(/\D/g, '')}?body=${encodeURIComponent(item.smsText || '')}`}
                      style={{
                        background: '#0c4a6e',
                        border: '1px solid #0284c7',
                        color: '#38bdf8',
                        padding: '6px 4px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px'
                      }}
                    >
                      <span>📱 GSM SMS</span>
                    </a>

                    <a
                      href={item.emailLink || `mailto:${item.recipientEmail || ''}`}
                      style={{
                        background: '#4a044e',
                        border: '1px solid #a21caf',
                        color: '#e879f9',
                        padding: '6px 4px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px'
                      }}
                    >
                      <span>✉️ Email</span>
                    </a>
                  </div>
                </div>

                {/* Quick Call Crib Sheet for Outbound Queue */}
                <button
                  onClick={() => setCallBriefModalTicket({
                    ticketId: item.ticketId,
                    title: item.opportunityTitle,
                    targetBusinessName: item.recipientName,
                    targetContactPhone: item.recipientPhone,
                    propertyValueNGN: item.projectedSettlementNGN ? Math.round(item.projectedSettlementNGN / 0.01) : 500000000,
                    actionPayload: { listingPrice: `₦${((item.projectedSettlementNGN ? Math.round(item.projectedSettlementNGN / 0.01) : 500000000)).toLocaleString()}` }
                  })}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#fbbf24',
                    borderRadius: '6px',
                    padding: '6px 8px',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    marginTop: '6px',
                    width: '100%'
                  }}
                >
                  <PhoneCall size={11} />
                  <span>📞 Open Inbound Call Crib Sheet</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── SUB-TAB 3: DISPATCHED LEDGER ───────────────────────────────────── */}
      {subTab === 'dispatched' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
            Confirmed Outbound Dispatches ({dispatchedLedger.length})
          </span>

          {dispatchedLedger.length === 0 ? (
            <div style={{
              background: '#090e1a',
              border: '1px dashed #334155',
              borderRadius: '10px',
              padding: '24px 16px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '12px'
            }}>
              No dispatches recorded in ledger yet. Once mandates are delivered via WhatsApp API or Direct Gateway, confirmed records appear here.
            </div>
          ) : (
            dispatchedLedger.map((item: any, idx: number) => (
              <div
                key={idx}
                style={{
                  background: '#090e1a',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981' }}>
                    ✓ DISPATCHED #{item.ticketId}
                  </span>
                  <span style={{ fontSize: '9px', color: '#64748b' }}>
                    {item.dispatchedAt ? new Date(item.dispatchedAt).toLocaleTimeString() : 'Recently'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>
                  {item.opportunityTitle}
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                  Delivered to <b>{item.recipientName}</b> ({item.recipientPhone})
                </div>
                <div style={{ fontSize: '9px', color: '#64748b', marginTop: '4px' }}>
                  Gateway: {item.gateway || 'VPS Evolution WhatsApp'} · Settlement: Moniepoint 6805375225
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── FLOATING SCRIPT MODAL ──────────────────────────────────────────── */}
      {scriptModalTicket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#0b1120',
            border: '1px solid #334155',
            borderRadius: '14px',
            padding: '18px',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} color="#fbbf24" />
                <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  LASRERA Mandate Outbound Brief
                </h3>
              </div>
              <button
                onClick={() => setScriptModalTicket(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Tri-Channel Channel Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
              <button
                onClick={() => setScriptModalTab('whatsapp')}
                style={{
                  background: scriptModalTab === 'whatsapp' ? '#064e3b' : '#1e293b',
                  border: `1px solid ${scriptModalTab === 'whatsapp' ? '#059669' : '#334155'}`,
                  color: scriptModalTab === 'whatsapp' ? '#34d399' : '#94a3b8',
                  padding: '7px 4px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                💬 WhatsApp
              </button>
              <button
                onClick={() => setScriptModalTab('sms')}
                style={{
                  background: scriptModalTab === 'sms' ? '#0c4a6e' : '#1e293b',
                  border: `1px solid ${scriptModalTab === 'sms' ? '#0284c7' : '#334155'}`,
                  color: scriptModalTab === 'sms' ? '#38bdf8' : '#94a3b8',
                  padding: '7px 4px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                📱 GSM SMS
              </button>
              <button
                onClick={() => setScriptModalTab('email')}
                style={{
                  background: scriptModalTab === 'email' ? '#4a044e' : '#1e293b',
                  border: `1px solid ${scriptModalTab === 'email' ? '#a21caf' : '#334155'}`,
                  color: scriptModalTab === 'email' ? '#e879f9' : '#94a3b8',
                  padding: '7px 4px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                ✉️ Email Memo
              </button>
            </div>

            {/* Text Preview Display */}
            {(() => {
              const activeText = scriptModalTab === 'whatsapp'
                ? scriptModalTicket.preDraftedScript
                : (scriptModalTab === 'sms'
                    ? (scriptModalTicket.smsText || `LASRERA: Bethelmind (CAC 9912717) requests 80/20 co-brokerage for ${scriptModalTicket.title?.replace('Pillar 2 Mandate: ', '').slice(0, 35)}. Review brief / chat Desk: wa.me/2348022791227 or call.`)
                    : (scriptModalTicket.emailBody || scriptModalTicket.preDraftedScript));
              const activeLabel = scriptModalTab === 'whatsapp' ? 'WhatsApp Script' : (scriptModalTab === 'sms' ? 'GSM SMS' : 'Email Memo');
              const charCount = activeText.length;

              return (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                      Channel: <b style={{ color: '#ffffff' }}>{activeLabel}</b>
                    </span>
                    <span style={{ fontSize: '10px', color: scriptModalTab === 'sms' && charCount <= 158 ? '#10b981' : '#64748b' }}>
                      {charCount} chars {scriptModalTab === 'sms' ? '(1 GSM credit)' : ''}
                    </span>
                  </div>

                  <div style={{
                    background: '#070a12',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '11px',
                    color: '#cbd5e1',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    maxHeight: '260px',
                    overflowY: 'auto'
                  }}>
                    {activeText}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                    <button
                      onClick={() => onCopyText(activeText, activeLabel)}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#f8fafc',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Copy size={13} />
                      <span>Copy {activeLabel}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleApproveAndSwitch(scriptModalTicket.ticketId);
                        setScriptModalTicket(null);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        color: '#ffffff',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>Approve & Queue</span>
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── FLOATING INBOUND CALL BRIEF & NEGOTIATION MODAL ────────────────── */}
      {callBriefModalTicket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px'
        }}>
          <div style={{
            background: '#0b1120',
            border: '1px solid #d97706',
            borderRadius: '14px',
            padding: '16px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PhoneCall size={16} color="#fbbf24" />
                <h3 style={{ fontSize: '14px', fontWeight: 900, margin: 0, color: '#ffffff' }}>
                  Inbound Call Crib Sheet & Negotiation Brief
                </h3>
              </div>
              <button
                onClick={() => setCallBriefModalTicket(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Property & Partner Banner */}
            <div style={{
              background: '#070a12',
              border: '1px solid #1e293b',
              borderRadius: '10px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ fontSize: '10px', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase' }}>
                Target Mandate: #{callBriefModalTicket.ticketId}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', lineHeight: '1.3' }}>
                {callBriefModalTicket.title?.replace('Pillar 2 Mandate: ', '')}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                <span>Caller: <b>{callBriefModalTicket.targetBusinessName}</b></span>
                <span>·</span>
                <span>📞 {callBriefModalTicket.targetContactPhone}</span>
                <span>·</span>
                <span>💰 <b>{callBriefModalTicket.actionPayload?.listingPrice || `₦${(callBriefModalTicket.propertyValueNGN || 0).toLocaleString()}`}</b></span>
              </div>
            </div>

            {/* Financial Numbers Card (Remind them of the 80% split immediately) */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.2) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '10px',
              padding: '12px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <div>
                <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Their 80% Commission</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#10b981' }}>
                  ₦{Math.round((callBriefModalTicket.propertyValueNGN || 500000000) * 0.05 * 0.8).toLocaleString()}
                </div>
                <div style={{ fontSize: '8px', color: '#64748b' }}>Retained by Partner Firm</div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Bethelmind 20% Cut</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#38bdf8' }}>
                  ₦{Math.round((callBriefModalTicket.propertyValueNGN || 500000000) * 0.05 * 0.2).toLocaleString()}
                </div>
                <div style={{ fontSize: '8px', color: '#64748b' }}>Moniepoint 6805375225</div>
              </div>
            </div>

            {/* Word-for-Word Phone Talking Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🗣️ Word-for-Word Telephone Scripts
              </div>

              {/* Script 1: Opening Greeting */}
              <div style={{ background: '#090e1a', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#38bdf8' }}>1. How to Open the Call</span>
                  <button
                    onClick={() => onCopyText(
                      `Good day, thank you for returning our call/message. My name is Tosin Oyelakin from the Bethelmind Property Desk (CAC: 9912717). I understand you are calling regarding the ${callBriefModalTicket.title?.replace('Pillar 2 Mandate: ', '')}. Is this property still directly available under your primary mandate?`,
                      'Opening Greeting Script'
                    )}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <Copy size={10} />
                    <span>Copy</span>
                  </button>
                </div>
                <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, lineHeight: '1.5' }}>
                  "Good day, thank you for returning our call/message. My name is Tosin Oyelakin from the Bethelmind Property Desk (CAC: 9912717). I understand you are calling regarding the <b>{callBriefModalTicket.title?.replace('Pillar 2 Mandate: ', '')}</b>. Is this property still directly available under your primary mandate?"
                </p>
              </div>

              {/* Script 2: When They Ask "Who is your buyer?" */}
              <div style={{ background: '#090e1a', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b' }}>2. When Asked: "Who is your buyer?"</span>
                  <button
                    onClick={() => onCopyText(
                      `Our buyer is represented under our corporate diaspora acquisition brief (Client Ref: BM-DIASPORA-701), an executive client looking to conclude a verified acquisition in Lagos this quarter with pre-allocated capital. Under our corporate Non-Circumvention protocol, all inspections and documentation are coordinated through Bethelmind Desk.`,
                      'Buyer Profile Script'
                    )}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <Copy size={10} />
                    <span>Copy</span>
                  </button>
                </div>
                <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, lineHeight: '1.5' }}>
                  "Our buyer is represented under our corporate diaspora acquisition brief (<b>Client Ref: BM-DIASPORA-701</b>), an executive client looking to conclude a verified acquisition in Lagos this quarter with pre-allocated capital. Under our corporate Non-Circumvention protocol, all inspections and documentation are coordinated through Bethelmind Desk."
                </p>
              </div>

              {/* Script 3: Inspection Protocol & Locking the 80/20 Fee */}
              <div style={{ background: '#090e1a', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#10b981' }}>3. How to Lock Inspection & 80/20 Fee</span>
                  <button
                    onClick={() => onCopyText(
                      `Under our LASRERA compliance process, before we schedule the on-site walkthrough with our buyer's representative, we exchange our standard 1-page Joint Inspection Memorandum (JIM). This document legally guarantees your 80% agency commission and our 20% origination fee. Once counter-signed, we schedule the walkthrough immediately.`,
                      'Inspection Protocol Script'
                    )}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <Copy size={10} />
                    <span>Copy</span>
                  </button>
                </div>
                <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, lineHeight: '1.5' }}>
                  "Under our LASRERA compliance process, before we schedule the on-site walkthrough with our buyer's representative, we exchange our standard 1-page Joint Inspection Memorandum (JIM). This document legally guarantees your 80% agency commission and our 20% origination fee. Once counter-signed, we schedule the walkthrough immediately."
                </p>
              </div>
            </div>

            {/* Top 3 Objections Cheat-Sheet */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🛡️ Handling Top Objections
              </div>

              <div style={{ background: '#070a12', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#ef4444' }}>• "Can you take 10% instead of 20%?"</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>
                  <b>Answer:</b> "Our 20% origination fee is our fixed institutional standard under LASRERA guidelines. You retain 80%, which is significantly higher than the usual 50/50 co-brokerage demand in Lagos."
                </div>
              </div>

              <div style={{ background: '#070a12', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#ef4444' }}>• "Can I speak directly with your buyer?"</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>
                  <b>Answer:</b> "All communications are managed through Bethelmind Desk until the Joint Inspection Memorandum is executed to protect both parties under LASRERA guidelines."
                </div>
              </div>

              <div style={{ background: '#070a12', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#ef4444' }}>• "How will closing payment be made?"</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>
                  <b>Answer:</b> "Official commercial bank wire directly to the seller, with agency fees deducted and split at closing: 80% to your account and 20% to Bethelmind Digital Solutions (Moniepoint MFB: 6805375225)."
                </div>
              </div>
            </div>

            <button
              onClick={() => setCallBriefModalTicket(null)}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              Close Crib Sheet
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
