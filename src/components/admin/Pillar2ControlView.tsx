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
  ChevronRight
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

                    <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>👤 Partner: <b>{ticket.targetBusinessName}</b></span>
                      <span>·</span>
                      <span>📍 {ticket.targetLocation || 'Lagos'}</span>
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

                  {/* Action Buttons: 1-Tap Approve, View Script, Reject */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button
                      onClick={() => onApproveTicket(ticket.ticketId)}
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
                      onClick={() => setScriptModalTicket(ticket)}
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
                      <span>📜 View Script</span>
                    </button>
                  </div>

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
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                  Recipient: <b>{item.recipientName}</b> ({item.recipientPhone})
                </div>
                {item.directChatLink && (
                  <div style={{ marginTop: '8px' }}>
                    <a
                      href={item.directChatLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#25D366',
                        color: '#ffffff',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Open WhatsApp Chat Directly</span>
                      <ArrowUpRight size={10} />
                    </a>
                  </div>
                )}
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
                  LASRERA Mandate Inquiry Script
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

            <div style={{
              background: '#070a12',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '11px',
              color: '#cbd5e1',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace'
            }}>
              {scriptModalTicket.preDraftedScript}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={() => onCopyText(scriptModalTicket.preDraftedScript, 'Mandate Script')}
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
                <span>Copy Script</span>
              </button>

              <button
                onClick={() => {
                  onApproveTicket(scriptModalTicket.ticketId);
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
          </div>
        </div>
      )}

    </div>
  );
}
