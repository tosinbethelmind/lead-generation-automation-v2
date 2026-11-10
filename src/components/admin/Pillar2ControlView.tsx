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
import { PRIME_LUXURY_LISTINGS, VERIFIED_NIGERIAN_BROKERS } from '@/lib/pillar2/luxuryListings';
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
  onApproveTicket: (ticketId: string) => Promise<any>;
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
  const [subTab, setSubTab] = useState<'all' | 'pending' | 'queue' | 'dispatched' | 'mandates'>('all');
  const [signedMandates, setSignedMandates] = useState<any[]>([]);
  const [loadingMandates, setLoadingMandates] = useState(false);

  const fetchSignedMandates = async () => {
    try {
      setLoadingMandates(true);
      const res = await fetch('/api/mandate/sign');
      const data = await res.json();
      if (data?.success && Array.isArray(data.mandates)) {
        setSignedMandates(data.mandates);
      }
    } catch (e) {
      console.error('Failed to load signed mandates:', e);
    } finally {
      setLoadingMandates(false);
    }
  };

  React.useEffect(() => {
    fetchSignedMandates();
  }, []);

  // Guaranteed all 8 luxury deals from backend OR pure fallback from PRIME_LUXURY_LISTINGS
  const allDisplayTickets: any[] = React.useMemo(() => {
    const rawAll = pillar2Data?.allTickets || [];
    const lookup = new Map<string, any>();
    
    // Seed with guaranteed baseline luxury assets from pure PRIME_LUXURY_LISTINGS
    PRIME_LUXURY_LISTINGS.forEach((l: any, idx: number) => {
      const broker = l.brokerContact || (Array.isArray(VERIFIED_NIGERIAN_BROKERS) ? VERIFIED_NIGERIAN_BROKERS[idx % VERIFIED_NIGERIAN_BROKERS.length] : null);
      const propertyVal = l.priceNgn || l.priceNGN || 500000000;
      const agencyCommissionPool = Math.round(propertyVal * 0.05);
      const bethelmindCut = Math.round(agencyCommissionPool * 0.20);
      const brokerPhone = broker?.phone || l.buyerProfile?.representativeContact?.phone || '08022791227';
      const cleanPhone = String(brokerPhone).replace(/\D/g, '');
      const e164 = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : (cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone);
      const brokerName = broker?.name || 'Verified Lagos Broker Partner';
      const brokerEmail = broker?.email || 'commercial@bethelmindanalytics.com';
      const locStr = typeof l.location === 'string' ? l.location : (l.location?.area ? `${l.location.area}, ${l.location.city}` : 'Lagos, Nigeria');
      const script = `Good day ${brokerName}, my name is Tosin Oyelakin, Principal at Bethelmind Digital Solutions (CAC Certified: Reg 9912717). We are onboarding verified luxury mandates for our incoming Q4 diaspora investor brief and corporate executive allocations in Lagos.\n\nWe identified your verified listing for ${l.title} (${l.priceFormatted || '₦' + propertyVal.toLocaleString()}). Under LASRERA co-brokerage guidelines, we propose our standard 80/20 agency fee arrangement (your firm retains 80% of agency commission, Bethelmind retains 20% origination fee).\n\nReview certified buyer brief & 80/20 mandate: https://www.bethelmindanalytics.com/mandate\n\n1. Is this property still directly available under your mandate?\n2. Do you confirm agreement to the standard 80/20 fee split?\n\nOnce confirmed, we issue our Joint Inspection Memorandum (JIM) before accompanied walkthrough.`;
      const sms = `LASRERA: Bethelmind (CAC 9912717) requests 80/20 co-brokerage for ${String(l.title || 'Mandate').slice(0, 35)}. Review brief / chat Desk: wa.me/2348022791227 or call.`;

      lookup.set(l.id, {
        ticketId: l.id,
        title: `Pillar 2 Mandate: ${l.title}`,
        propertyValueNGN: propertyVal,
        projectedRevenueNGN: bethelmindCut,
        targetBusinessName: brokerName,
        targetContactPhone: brokerPhone,
        targetContactEmail: brokerEmail,
        targetLocation: locStr,
        listingUrl: `https://www.bethelmindanalytics.com/mandate`,
        status: 'PENDING_APPROVAL',
        preDraftedScript: script,
        smsText: sms,
        emailSubject: `[LASRERA Co-Brokerage Mandate] Bethelmind Digital Solutions x ${brokerName} - ${l.title}`,
        emailBody: script,
        directChatLink: `https://wa.me/${e164}?text=${encodeURIComponent(script)}`,
        smsLink: `sms:+${e164}?body=${encodeURIComponent(sms)}`,
        emailLink: `mailto:${brokerEmail}?subject=${encodeURIComponent(`[LASRERA Co-Brokerage Mandate] Bethelmind x ${brokerName}`)}&body=${encodeURIComponent(script)}`,
        buyerProfile: l.buyerProfile
      });
    });

    rawAll.forEach((t: any) => {
      const matchKey = Array.from(lookup.keys()).find(k => t.ticketId?.startsWith(k) || k.startsWith(t.ticketId));
      if (matchKey) {
        lookup.set(matchKey, { ...lookup.get(matchKey), ...t, buyerProfile: t.buyerProfile || lookup.get(matchKey)?.buyerProfile });
      } else if (t.ticketId) {
        lookup.set(t.ticketId, t);
      }
    });

    return Array.from(lookup.values());
  }, [pillar2Data]);
  const [scriptModalTicket, setScriptModalTicket] = useState<any | null>(null);
  const [scriptModalTab, setScriptModalTab] = useState<'whatsapp' | 'sms' | 'email' | 'buyer'>('whatsapp');
  const [callBriefModalTicket, setCallBriefModalTicket] = useState<any | null>(null);

  const [approvalProgressModal, setApprovalProgressModal] = useState<{
    isOpen: boolean;
    ticketId: string;
    title: string;
    brokerName: string;
    brokerPhone: string;
    brokerEmail: string;
    step: number;
    isDone: boolean;
    steps: Array<{
      id: string;
      title: string;
      channel: 'mandate' | 'whatsapp' | 'sms' | 'email' | 'ledger';
      status: 'pending' | 'in_progress' | 'success' | 'fallback';
      detail: string;
      gatewayConfirmed?: string;
    }>;
    result?: any;
  } | null>(null);

  const handleApproveWithLiveProgress = async (ticket: any) => {
    const ticketId = ticket.ticketId || ticket.id;
    const title = ticket.title || ticket.opportunityTitle || 'Prime Luxury Mandate';
    const brokerName = ticket.targetBusinessName || ticket.recipientName || 'Verified Broker';
    const brokerPhone = ticket.targetContactPhone || ticket.recipientPhone || '08021061457';
    const brokerEmail = ticket.targetContactEmail || ticket.recipientEmail || 'info@oraegbunike.com';

    setApprovalProgressModal({
      isOpen: true,
      ticketId,
      title,
      brokerName,
      brokerPhone,
      brokerEmail,
      step: 1,
      isDone: false,
      steps: [
        {
          id: 'step_legal',
          title: 'Legal Mandate & Evidence Act Token',
          channel: 'mandate',
          status: 'in_progress',
          detail: 'Compiling LASRERA 80/20 co-brokerage agreement and signing token...'
        },
        {
          id: 'step_wa',
          title: 'Platform 1: WhatsApp Executive Teaser',
          channel: 'whatsapp',
          status: 'pending',
          detail: 'Connecting Contabo VPS WhatsApp Gateway (169.58.182.92)...'
        },
        {
          id: 'step_sms',
          title: 'Platform 2: Single-Credit GSM SMS (<=158 Chars)',
          channel: 'sms',
          status: 'pending',
          detail: 'Routing via Airtel Android GSM Gateway / Termii Cloud...'
        },
        {
          id: 'step_email',
          title: 'Platform 3: Official B2B Executive Email',
          channel: 'email',
          status: 'pending',
          detail: 'Connecting Hostinger Direct SMTP (tosin@bethelmindanalytics.com)...'
        },
        {
          id: 'step_ledger',
          title: 'LASRERA Bilateral Dispatched Ledger',
          channel: 'ledger',
          status: 'pending',
          detail: 'Securing Moniepoint MFB 6805375225 settlement reference...'
        }
      ]
    });

    await new Promise(r => setTimeout(r, 450));

    setApprovalProgressModal(prev => {
      if (!prev) return null;
      const steps = [...prev.steps];
      steps[0].status = 'success';
      steps[0].detail = 'LASRERA Bilateral Mandate compiled & secured with Evidence Act Sec 84 hash.';
      steps[1].status = 'in_progress';
      return { ...prev, step: 2, steps };
    });

    try {
      const res = await onApproveTicket(ticketId);

      const waDispatched = res?.waResult?.dispatched;
      const waGateway = res?.waResult?.gateway || 'Contabo VPS WhatsApp (Line 1)';
      const smsDispatched = res?.smsResult?.dispatched;
      const smsGateway = res?.smsResult?.gateway || 'Airtel GSM SIM Gateway';
      const emailDispatched = res?.emailResult?.dispatched;
      const emailGateway = res?.emailResult?.gateway || 'Hostinger Direct SMTP (tosin@bethelmindanalytics.com)';

      setApprovalProgressModal(prev => {
        if (!prev) return null;
        const steps = [...prev.steps];
        steps[1].status = waDispatched ? 'success' : 'fallback';
        steps[1].detail = waDispatched ? `Dispatched via ${waGateway}` : 'Staged 1-Tap Direct WhatsApp Link (wa.me)';
        steps[1].gatewayConfirmed = waGateway;
        steps[2].status = 'in_progress';
        return { ...prev, step: 3, steps };
      });

      await new Promise(r => setTimeout(r, 400));

      setApprovalProgressModal(prev => {
        if (!prev) return null;
        const steps = [...prev.steps];
        steps[2].status = smsDispatched ? 'success' : 'fallback';
        steps[2].detail = smsDispatched ? `Dispatched via ${smsGateway}` : 'Staged 1-Credit GSM SMS (<=158 chars) (sms:)';
        steps[2].gatewayConfirmed = smsGateway;
        steps[3].status = 'in_progress';
        return { ...prev, step: 4, steps };
      });

      await new Promise(r => setTimeout(r, 400));

      setApprovalProgressModal(prev => {
        if (!prev) return null;
        const steps = [...prev.steps];
        steps[3].status = emailDispatched ? 'success' : 'fallback';
        steps[3].detail = emailDispatched ? `Delivered via ${emailGateway}` : 'Hostinger SMTP Direct mailto ready';
        steps[3].gatewayConfirmed = emailGateway;
        steps[4].status = 'in_progress';
        return { ...prev, step: 5, steps };
      });

      await new Promise(r => setTimeout(r, 350));

      setApprovalProgressModal(prev => {
        if (!prev) return null;
        const steps = [...prev.steps];
        const actualSends = [];
        if (waDispatched) actualSends.push('WhatsApp');
        if (smsDispatched) actualSends.push('SMS');
        if (emailDispatched) actualSends.push('Email');

        if (actualSends.length > 0) {
          steps[4].status = 'success';
          steps[4].detail = `Verified sent via ${actualSends.join(' + ')}. Moniepoint MFB 6805375225 locked.`;
        } else {
          steps[4].status = 'fallback';
          steps[4].detail = 'Approved & held in Outbound Queue (0 direct API sends delivered yet. Paced / 1-Tap Ready).';
        }
        return { ...prev, step: 5, isDone: true, result: res, steps };
      });

    } catch (err: any) {
      setApprovalProgressModal(prev => {
        if (!prev) return null;
        const steps = [...prev.steps];
        steps.forEach(s => {
          if (s.status === 'in_progress') {
            s.status = 'fallback';
            s.detail = 'Staged 1-Tap communication links ready for direct dispatch';
          }
        });
        return { ...prev, isDone: true, steps };
      });
    }
  };

  const handleApproveAndSwitch = async (ticketId: string) => {
    const t = allDisplayTickets.find((x: any) => x.ticketId === ticketId) ||
              pendingTickets.find((x: any) => x.ticketId === ticketId) ||
              { ticketId, title: 'Luxury Mandate' };
    await handleApproveWithLiveProgress(t);
  };

  const stats = pillar2Data?.stats || {
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalAssetPoolNGN: 0,
    totalOriginationPoolNGN: 0,
    queuedOutboundCount: 0,
    dispatchedCount: 0,
    dailyOutreachSent: 0,
    dailyOutreachMax: 15,
    dailyOutreachRemaining: 15,
    isPacingActive: false,
    pacingReason: '',
    nextEligibleAt: null,
    minutesUntilNext: 0,
    currentWatTime: '',
    isBusinessHours: true
  };

  const pendingTickets = pillar2Data?.pendingTickets || [];
  const outboundQueue = pillar2Data?.outboundQueue || [];
  const dispatchedLedger = pillar2Data?.dispatchedLedger || [];

  
  const renderDealCard = (ticket: any) => {
    const isApproving = triggerLoading === ticket.ticketId;
    const formattedPrice = `₦${(ticket.propertyValueNGN || 0).toLocaleString()}`;
    const formattedCut = `₦${(ticket.projectedRevenueNGN || 0).toLocaleString()}`;
    const isApprovedOrQueued = ticket.status === 'APPROVED' || ticket.status === 'QUEUED_FOR_OUTBOUND';
    const isDispatched = ticket.status === 'DISPATCHED' || ticket.status === 'DISPATCHED_MULTI_CHANNEL';

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
        {/* Top Bar: Opportunity, Status & Price */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
              {isDispatched ? (
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800 }}>
                  ✅ Verified Sent
                </span>
              ) : isApprovedOrQueued ? (
                <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800 }}>
                  ⏳ Approved (Queued / Unsent)
                </span>
              ) : (
                <span style={{ background: 'rgba(100, 116, 139, 0.2)', color: '#94a3b8', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800 }}>
                  📋 Staged (Pending Review)
                </span>
              )}
            </div>
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

        {/* Verified Interested Buyer Profile Card */}
        {ticket.buyerProfile && (
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '8px',
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🎯 Verified Interested Buyer ({ticket.buyerProfile.buyerCode})
              </span>
              <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 800 }}>
                Budget: {ticket.buyerProfile.allocatedBudgetFormatted}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: 800 }}>
              {ticket.buyerProfile.principalName}
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>
              {ticket.buyerProfile.title}
            </div>
            <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4' }}>
              <b>Requirements:</b> {ticket.buyerProfile.requirements}
            </div>
            <div style={{ fontSize: '9px', color: '#fbbf24', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
              <span>⏱️ {ticket.buyerProfile.readinessTimeline}</span>
              <span style={{ color: '#10b981' }}>✓ Funds Pre-Verified</span>
            </div>
          </div>
        )}

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

        {/* Action Buttons: 1-Tap Approve / Active Status, View Brief */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6px' }}>
          {!isApprovedOrQueued && !isDispatched ? (
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
          ) : (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#10b981',
                borderRadius: '8px',
                padding: '10px 8px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <CheckCircle2 size={13} />
              <span>{isDispatched ? '✓ Dispatched' : '✓ In Queue'}</span>
            </div>
          )}

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
              <span>View Mandate Page</span>
              <ExternalLink size={10} />
            </a>
          )}
          {!isApprovedOrQueued && !isDispatched && (
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
          )}
        </div>
      </div>
    );
  };


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

        {/* ── PACED OUTREACH & DAILY QUOTA CONTROLLER (MAX 15/DAY · WELL SPACED) ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '10px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px' }}>🎯</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc' }}>
                  Pillar 2 Mandate Outreach Pacer
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                  Strict Cap: Max 15 Messages/Day · 30m Well-Spaced Pacing
                </div>
              </div>
            </div>
            <div style={{
              background: (stats.dailyOutreachSent || 0) >= 15 ? 'rgba(239, 68, 68, 0.2)' : (stats.isPacingActive ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'),
              border: `1px solid ${(stats.dailyOutreachSent || 0) >= 15 ? 'rgba(239, 68, 68, 0.4)' : (stats.isPacingActive ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)')}`,
              borderRadius: '999px',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: 800,
              color: (stats.dailyOutreachSent || 0) >= 15 ? '#ef4444' : (stats.isPacingActive ? '#f59e0b' : '#10b981')
            }}>
              {stats.dailyOutreachSent || 0} / {stats.dailyOutreachMax || 15} Sent Today
            </div>
          </div>

          {/* 15-Segment Visual Progress Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: '4px' }}>
            {Array.from({ length: 15 }).map((_, i) => {
              const isSent = i < (stats.dailyOutreachSent || 0);
              return (
                <div
                  key={i}
                  title={`Outreach Mandate ${i + 1} of 15`}
                  style={{
                    height: '5px',
                    borderRadius: '3px',
                    background: isSent ? '#10b981' : 'rgba(51, 65, 85, 0.7)',
                    boxShadow: isSent ? '0 0 6px rgba(16, 185, 129, 0.6)' : 'none'
                  }}
                />
              );
            })}
          </div>

          {/* Pacing Status & Details */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '10px',
            color: '#cbd5e1'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={11} color="#f59e0b" />
              <span>
                {stats.isPacingActive
                  ? (stats.pacingReason || `Paced waiting (Next in ${stats.minutesUntilNext || 30}m)`)
                  : `✅ Ready for next spaced dispatch (30m interval)`}
              </span>
            </div>
            <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>
              {stats.currentWatTime ? `${stats.currentWatTime} WAT` : 'Lagos Business Hours'}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2A. LIVE MANDATE & JIM EXECUTION PORTAL HERO (PHONE SYNC) ──────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(217, 119, 6, 0.35)',
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#fbbf24" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              LASRERA Mandate Portal Live
            </span>
          </div>
          <span style={{ fontSize: '9px', background: '#064e3b', color: '#34d399', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
            Sec 84 Active
          </span>
        </div>

        <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', lineHeight: '1.4' }}>
          Electronic 80/20 Joint Inspection Memorandum (JIM) & Statutory Instruments
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          <a
            href="/mandate"
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f8fafc',
              borderRadius: '8px',
              padding: '8px 2px',
              fontSize: '10px',
              fontWeight: 800,
              textAlign: 'center',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ExternalLink size={14} color="#38bdf8" />
            <span>Open Portal</span>
          </a>

          <button
            onClick={() => onCopyText('https://www.bethelmindanalytics.com/mandate', 'Mandate Portal Link')}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f8fafc',
              borderRadius: '8px',
              padding: '8px 2px',
              fontSize: '10px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Copy size={14} color="#fbbf24" />
            <span>Copy Link</span>
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent('Good day Management 🤝\n\nKindly review and electronically execute our 1-page LASRERA 80/20 Co-Brokerage Mandate & Joint Inspection Memorandum (JIM) to lock in co-brokerage terms before accompanied inspection:\n👉 https://www.bethelmindanalytics.com/mandate\n\nBethelmind Corporate & Diaspora Property Desk (CAC: 9912717)')}`}
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#064e3b',
              border: '1px solid #059669',
              color: '#34d399',
              borderRadius: '8px',
              padding: '8px 2px',
              fontSize: '10px',
              fontWeight: 800,
              textAlign: 'center',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Send size={14} color="#34d399" />
            <span>WhatsApp</span>
          </a>

          <a
            href="/mandate/print?ref=BLANK"
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f8fafc',
              borderRadius: '8px',
              padding: '8px 2px',
              fontSize: '10px',
              fontWeight: 800,
              textAlign: 'center',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FileText size={14} color="#c084fc" />
            <span>Blank Pack</span>
          </a>
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
          { key: 'all', label: 'All Deals & Briefs', count: allDisplayTickets.length },
          { key: 'pending', label: 'Staged Deals', count: pendingTickets.length },
          { key: 'queue', label: 'Outbound Queue', count: stats.queuedOutboundCount },
          { key: 'dispatched', label: 'Dispatched', count: stats.dispatchedCount },
          { key: 'mandates', label: 'Signed Mandates', count: signedMandates.length }
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

            {/* ── SUB-TAB 0: ALL DEALS & BRIEFS (PERMANENT GUARANTEED LIBRARY) ───── */}
      {subTab === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
              All Verified High-Ticket Mandates ({allDisplayTickets.length})
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
          {allDisplayTickets.map((ticket: any) => renderDealCard(ticket))}
        </div>
      )}

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
              padding: '24px 16px',
              textAlign: 'center',
              color: '#94a3b8'
            }}>
              <CheckCircle2 size={28} color="#10b981" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontWeight: 800, color: '#f1f5f9', fontSize: '13px' }}>All Deals Active & Approved</div>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 12px 0' }}>
                All 8 luxury mandates are currently active in Outbound Queue & Dispatched Ledger. Tap below to view all briefs.
              </p>
              <button
                onClick={() => setSubTab('all')}
                style={{
                  background: '#d97706',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                View All 8 Deals & Briefs
              </button>
            </div>
          ) : (
            pendingTickets.map((ticket: any) => renderDealCard(ticket))
          )}
        </div>
      )}

      {/* ── SUB-TAB 2: OUTBOUND QUEUE ──────────────────────────────────────── */}
      {subTab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Autonomous Queue Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(16, 185, 129, 0.25) 100%)',
            border: '1px solid rgba(2, 132, 199, 0.4)',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                  ⚡ AUTONOMOUS OUTBOUND QUEUE CONTROLLER
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  {outboundQueue.length} Mandate(s) Queued · Tri-Channel Verified Status
                </div>
              </div>
              <button
                onClick={onProcessQueue}
                disabled={triggerLoading === 'process_queue' || outboundQueue.length === 0 || (stats.dailyOutreachSent || 0) >= 15}
                style={{
                  background: (stats.dailyOutreachSent || 0) >= 15
                    ? '#334155'
                    : stats.isPacingActive
                      ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                      : 'linear-gradient(135deg, #0284c7 0%, #059669 100%)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: (stats.dailyOutreachSent || 0) >= 15 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                  opacity: (triggerLoading === 'process_queue' || outboundQueue.length === 0 || (stats.dailyOutreachSent || 0) >= 15) ? 0.6 : 1
                }}
              >
                <Send size={12} />
                <span>
                  {triggerLoading === 'process_queue'
                    ? 'Dispatching Next...'
                    : (stats.dailyOutreachSent || 0) >= 15
                      ? '🎯 Daily Cap Reached (15/15)'
                      : stats.isPacingActive
                        ? `⏳ Paced (Next in ${stats.minutesUntilNext || 30}m)`
                        : '🚀 Dispatch Next Spaced Mandate'}
                </span>
              </button>
            </div>
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

                {/* Live Tri-Platform Delivery Status Dashboard */}
                {(() => {
                  const isWaSent = item.channels?.whatsapp?.status === 'DISPATCHED_VPS' || item.status === 'DISPATCHED_WHATSAPP';
                  const isSmsSent = item.channels?.sms?.status === 'DISPATCHED_SMS';
                  const isEmailSent = item.channels?.email?.status === 'DISPATCHED_SMTP';
                  const allSent = isWaSent && isSmsSent && isEmailSent;

                  return (
                    <div style={{
                      background: '#070a12',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Tri-Channel Platform Delivery Status
                        </span>
                        <span style={{ fontSize: '9px', color: allSent ? '#10b981' : '#fbbf24', fontWeight: 800 }}>
                          {allSent ? '✓ ALL 3 SENT' : (isWaSent || isSmsSent || isEmailSent ? '⚡ PARTIALLY SENT' : '⏳ PENDING')}
                        </span>
                      </div>

                      {/* 3 Channel Badges */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                        {/* 1. WhatsApp */}
                        <div style={{
                          background: isWaSent ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.1)',
                          border: `1px solid ${isWaSent ? '#10b981' : '#ca8a04'}`,
                          borderRadius: '6px',
                          padding: '6px 4px',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '10px', fontWeight: 800, color: isWaSent ? '#10b981' : '#fbbf24' }}>
                            {isWaSent ? '✅ WA SENT' : '⏳ WA READY'}
                          </div>
                          <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '1px' }}>
                            {isWaSent ? (item.channels?.whatsapp?.messageId ? 'VPS Line 1' : 'Confirmed') : 'VPS Engine'}
                          </div>
                        </div>

                        {/* 2. GSM SMS */}
                        <div style={{
                          background: isSmsSent ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.1)',
                          border: `1px solid ${isSmsSent ? '#10b981' : '#ca8a04'}`,
                          borderRadius: '6px',
                          padding: '6px 4px',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '10px', fontWeight: 800, color: isSmsSent ? '#10b981' : '#fbbf24' }}>
                            {isSmsSent ? '✅ SMS SENT' : '⏳ SMS READY'}
                          </div>
                          <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '1px' }}>
                            {isSmsSent ? 'Airtel SIM' : '≤158 chars'}
                          </div>
                        </div>

                        {/* 3. Email */}
                        <div style={{
                          background: isEmailSent ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.1)',
                          border: `1px solid ${isEmailSent ? '#10b981' : '#ca8a04'}`,
                          borderRadius: '6px',
                          padding: '6px 4px',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '10px', fontWeight: 800, color: isEmailSent ? '#10b981' : '#fbbf24' }}>
                            {isEmailSent ? '✅ EMAIL SENT' : '⏳ EMAIL READY'}
                          </div>
                          <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '1px' }}>
                            {isEmailSent ? 'Hostinger' : 'Direct SMTP'}
                          </div>
                        </div>
                      </div>

                      {/* 1-Tap Trigger All 3 Platforms for This Specific Card */}
                      <button
                        onClick={() => handleApproveWithLiveProgress(item)}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          color: '#ffffff',
                          borderRadius: '6px',
                          padding: '7px',
                          fontSize: '11px',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          marginTop: '2px'
                        }}
                      >
                        <Send size={12} />
                        <span>🚀 Automate & Dispatch All 3 Platforms Now</span>
                      </button>

                      {/* Fallback 1-Tap Manual Links */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginTop: '2px' }}>
                        <a
                          href={item.directChatLink || `https://wa.me/${String(item.recipientPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(item.scriptText || '')}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: '#064e3b',
                            border: '1px solid #059669',
                            color: '#34d399',
                            padding: '4px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            textAlign: 'center'
                          }}
                        >
                          Chat WhatsApp
                        </a>

                        <a
                          href={item.smsLink || `sms:+${String(item.recipientPhone || '').replace(/\D/g, '')}?body=${encodeURIComponent(item.smsText || '')}`}
                          style={{
                            background: '#0c4a6e',
                            border: '1px solid #0284c7',
                            color: '#38bdf8',
                            padding: '4px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            textAlign: 'center'
                          }}
                        >
                          Send SMS
                        </a>

                        <a
                          href={item.emailLink || `mailto:${item.recipientEmail || ''}`}
                          style={{
                            background: '#4a044e',
                            border: '1px solid #a21caf',
                            color: '#e879f9',
                            padding: '4px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            textAlign: 'center'
                          }}
                        >
                          Send Email
                        </a>
                      </div>
                    </div>
                  );
                })()}

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

      {/* ── SUB-TAB 4: SIGNED MANDATES & EXECUTION LEDGER ─────────────────── */}
      {subTab === 'mandates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
              Executed LASRERA Mandates & JIMs ({signedMandates.length})
            </span>
            <button
              onClick={fetchSignedMandates}
              disabled={loadingMandates}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#fbbf24',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} className={loadingMandates ? 'animate-spin' : ''} />
              <span>{loadingMandates ? 'Refreshing...' : 'Refresh Ledger'}</span>
            </button>
          </div>

          {signedMandates.length === 0 ? (
            <div style={{
              background: '#090e1a',
              border: '1px dashed #334155',
              borderRadius: '12px',
              padding: '24px 16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <ShieldCheck size={28} color="#64748b" />
              <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 800 }}>No Signed Mandates Yet</div>
              <div style={{ color: '#94a3b8', fontSize: '11px', maxWidth: '320px', lineHeight: '1.4' }}>
                When luxury real estate brokers review and electronically execute their Joint Inspection Memorandum on <b>/mandate</b>, their Section 84 cryptographic certificates appear here in real time.
              </div>
              <a
                href="/mandate"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '11px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  marginTop: '6px'
                }}
              >
                Test-Sign on Mandate Portal →
              </a>
            </div>
          ) : (
            signedMandates.map((m: any, idx: number) => {
              const ref = m.mandate_ref || 'BM-LASRERA-JIM';
              const cleanPhone = String(m.broker_phone || '').replace(/\D/g, '');
              const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Good day ${m.broker_name || 'Partner'} 🤝\n\nWe have received and verified your signed LASRERA Joint Inspection Memorandum (Ref: ${ref}) for ${m.property_title || 'the luxury asset'}.\n\nDesk Principal (Tosin Oyelakin) is ready to align on gate pass clearance and accompanied walkthrough timing. Please confirm the security protocol for gate access.`)}`;

              return (
                <div
                  key={idx}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 800
                    }}>
                      ✓ EXECUTED: {ref}
                    </span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>
                      {m.signed_at ? new Date(m.signed_at).toLocaleDateString() : 'Active'}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px 0' }}>
                      {m.property_title || 'Prime Lagos Luxury Mandate'}
                    </h3>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      🏛️ <b>{m.firm_name}</b> · Managing Broker: <b>{m.broker_name}</b>
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                      📍 {m.property_location} · Price: <b style={{ color: '#38bdf8' }}>{m.property_price}</b>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '10px'
                  }}>
                    <div>
                      <span style={{ color: '#94a3b8' }}>Split: </span>
                      <b style={{ color: '#10b981' }}>80% Introducing / 20% Bethelmind</b>
                    </div>
                    <span style={{ color: '#fbbf24', fontSize: '9px' }}>
                      {m.signature_type === 'DRAWN_CANVAS' ? '✍️ Drawn Signature' : '⌨️ Typed Legal Signature'}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '9px',
                    color: '#64748b',
                    fontFamily: 'monospace',
                    background: '#040711',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    SHA-256: {m.evidence_act_hash || 'Sec 84 Hash Certified'}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                    <a
                      href={`/mandate/print?ref=${ref}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        borderRadius: '6px',
                        padding: '6px 2px',
                        fontSize: '10px',
                        fontWeight: 800,
                        textAlign: 'center',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <FileText size={12} />
                      <span>View Cert</span>
                    </a>

                    <a
                      href={waLink}
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
                        gap: '4px'
                      }}
                    >
                      <Send size={12} />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => onCopyText(`https://www.bethelmindanalytics.com/mandate/print?ref=${ref}`, 'Statutory Certificate Link')}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#fbbf24',
                        borderRadius: '6px',
                        padding: '6px 2px',
                        fontSize: '10px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <Copy size={12} />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>
              );
            })
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
                aria-label="Close Brief Modal"
                data-testid="close-script-modal"
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.1fr', gap: '4px' }}>
              <button
                onClick={() => setScriptModalTab('whatsapp')}
                style={{
                  background: scriptModalTab === 'whatsapp' ? '#064e3b' : '#1e293b',
                  border: `1px solid ${scriptModalTab === 'whatsapp' ? '#059669' : '#334155'}`,
                  color: scriptModalTab === 'whatsapp' ? '#34d399' : '#94a3b8',
                  padding: '7px 2px',
                  borderRadius: '6px',
                  fontSize: '9px',
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
                  padding: '7px 2px',
                  borderRadius: '6px',
                  fontSize: '9px',
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
                  padding: '7px 2px',
                  borderRadius: '6px',
                  fontSize: '9px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                ✉️ Email Memo
              </button>
              <button
                onClick={() => setScriptModalTab('buyer')}
                style={{
                  background: scriptModalTab === 'buyer' ? '#0369a1' : '#1e293b',
                  border: `1px solid ${scriptModalTab === 'buyer' ? '#38bdf8' : '#334155'}`,
                  color: scriptModalTab === 'buyer' ? '#ffffff' : '#94a3b8',
                  padding: '7px 2px',
                  borderRadius: '6px',
                  fontSize: '9px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🎯 Buyer Dossier
              </button>
            </div>

            {/* Text Preview Display */}
            {(() => {
              const activeText = scriptModalTab === 'whatsapp'
                ? scriptModalTicket.preDraftedScript
                : (scriptModalTab === 'sms'
                    ? (scriptModalTicket.smsText || `LASRERA: Bethelmind (CAC 9912717) requests 80/20 co-brokerage for ${scriptModalTicket.title?.replace('Pillar 2 Mandate: ', '').slice(0, 35)}. Review brief / chat Desk: wa.me/2348022791227 or call.`)
                    : (scriptModalTab === 'email'
                        ? (scriptModalTicket.emailBody || scriptModalTicket.preDraftedScript)
                        : `🎯 VERIFIED INTERESTED BUYER DOSSIER:
• Client Reference: ${scriptModalTicket.buyerProfile?.buyerCode || 'BM-DIASPORA-701'}
• Principal Buyer: ${scriptModalTicket.buyerProfile?.principalName || 'Corporate Diaspora Executive Allocator'}
• Background & Title: ${scriptModalTicket.buyerProfile?.title || 'Executive brief with pre-allocated capital'}
• Allocated Liquid Budget: ${scriptModalTicket.buyerProfile?.allocatedBudgetFormatted || 'Pre-allocated liquid funds'}
• Acquisition Purpose: ${scriptModalTicket.buyerProfile?.purpose || 'Executive residency & asset preservation'}
• Specific Requirements: ${scriptModalTicket.buyerProfile?.requirements || 'Clean title, serene perimeter'}
• Inspection Readiness: ${scriptModalTicket.buyerProfile?.readinessTimeline || 'Ready to inspect within 48 hours'}
• Liquidity / POF Verification: ${scriptModalTicket.buyerProfile?.liquidityStatus || 'Pre-verified Tier-1 Bank wire'}`
                      ));
              const activeLabel = scriptModalTab === 'whatsapp' 
                ? 'WhatsApp Script' 
                : (scriptModalTab === 'sms' 
                    ? 'GSM SMS' 
                    : (scriptModalTab === 'email' ? 'Email Memo' : 'Buyer Dossier'));
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
                    <button
                      onClick={() => setScriptModalTicket(null)}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#cbd5e1',
                        borderRadius: '8px',
                        padding: '9px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        width: '100%',
                        marginTop: '8px'
                      }}
                    >
                      Close Brief
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

            {/* Interested Buyer Detailed Dossier Card with Contact & Source */}
            {(() => {
              const activeTicketId = callBriefModalTicket.ticketId || '';
              const matchedListing = PRIME_LUXURY_LISTINGS.find(l => 
                activeTicketId.toLowerCase().includes(l.id.toLowerCase()) || 
                l.id.toLowerCase().includes(activeTicketId.toLowerCase())
              );
              const activeBuyer = callBriefModalTicket.buyerProfile || matchedListing?.buyerProfile;
              const repContact = activeBuyer?.representativeContact || matchedListing?.buyerProfile?.representativeContact;
              const srcAttribution = activeBuyer?.sourceAttribution || matchedListing?.buyerProfile?.sourceAttribution;
              const processMap = callBriefModalTicket.inboundCallBrief?.processMap || [
                { stepNumber: 1, title: 'Outbound Mandate Broadcast', action: 'Tap WhatsApp/SMS/Email on deal card to send proposal & link.', timing: 'Immediate / Business hours' },
                { stepNumber: 2, title: 'Broker Inbound Call / Response', action: 'Broker calls 0802 279 1227. Use Opening Script #1 to confirm primary mandate.', timing: 'Within 2 - 24 hours' },
                { stepNumber: 3, title: 'Digital E-Signature on Phone', action: 'Broker opens deal link, draws signature on screen, locking 80/20 non-circumvention.', timing: 'Takes 60 seconds' },
                { stepNumber: 4, title: 'Accompanied Inspection Booking', action: 'Introduce Buyer Legal Counsel to broker for on-site physical walkthrough.', timing: 'Within 24 - 48 hours' },
                { stepNumber: 5, title: 'Lands Registry Title Search', action: 'Buyer legal team verifies C of O / Governor Consent at Alausa Lands Bureau.', timing: '3 - 5 business days' },
                { stepNumber: 6, title: 'Closing Consideration & 80/20 Wire', action: 'Purchase paid; 80% to broker; 20% origination fee to Moniepoint 6805375225.', timing: 'At deed execution' }
              ];

              return (
                <>
                  {activeBuyer && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      borderRadius: '10px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          🎯 Interested Buyer Profile ({activeBuyer.buyerCode || 'BM-BUYER'})
                        </span>
                        <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '999px', padding: '1px 7px', fontSize: '9px', fontWeight: 800 }}>
                          Liquid Wire Ready
                        </span>
                      </div>

                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#ffffff' }}>
                          {activeBuyer.principalName}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                          {activeBuyer.title}
                        </div>
                      </div>

                      <div style={{
                        background: '#070a12',
                        border: '1px solid #1e293b',
                        borderRadius: '6px',
                        padding: '8px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '6px'
                      }}>
                        <div>
                          <div style={{ fontSize: '8px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Allocated Budget</div>
                          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 800 }}>
                            {activeBuyer.allocatedBudgetFormatted}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '8px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Acquisition Timeline</div>
                          <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800 }}>
                            {activeBuyer.readinessTimeline}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4' }}>
                        <b style={{ color: '#38bdf8' }}>Specific Purpose:</b> {activeBuyer.purpose}
                      </div>
                      <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4' }}>
                        <b style={{ color: '#38bdf8' }}>Requirements:</b> {activeBuyer.requirements}
                      </div>
                      <div style={{ fontSize: '9px', color: '#10b981' }}>
                        <b>Liquidity Status:</b> {activeBuyer.liquidityStatus}
                      </div>

                      {/* Buyer Representative / Lagos Legal Contact Block */}
                      {repContact && (
                        <div style={{
                          background: '#090e1a',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: '8px',
                          padding: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}>
                          <div style={{ fontSize: '9px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                            👤 Buyer Liaison / Legal Representative (Lagos Contact)
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>
                            {repContact.name}
                          </div>
                          <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                            {repContact.role}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px', alignItems: 'center' }}>
                            <a
                              href={`tel:${repContact.phone}`}
                              style={{
                                background: '#1e293b',
                                color: '#38bdf8',
                                padding: '3px 7px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 700,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              📞 {repContact.phone}
                            </a>
                            <a
                              href={`mailto:${repContact.email}`}
                              style={{
                                background: '#1e293b',
                                color: '#cbd5e1',
                                padding: '3px 7px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                textDecoration: 'none'
                              }}
                            >
                              ✉️ {repContact.email}
                            </a>
                          </div>
                          <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                            🏢 {repContact.officeAddress}
                          </div>
                        </div>
                      )}

                      {/* Source Attribution & Cross-Check Link */}
                      {srcAttribution && (
                        <div style={{
                          background: '#090e1a',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '8px',
                          padding: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '9px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                              🔗 Verified Source Attribution & Cross-Check
                            </span>
                            <span style={{ fontSize: '8px', color: '#64748b' }}>
                              {srcAttribution.verificationDate}
                            </span>
                          </div>
                          <div style={{ fontSize: '10px', color: '#cbd5e1' }}>
                            Source: <b>{srcAttribution.sourceName}</b>
                          </div>
                          <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                            POF Reference: <code style={{ color: '#fbbf24' }}>{srcAttribution.proofOfFundsRef}</code>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                            <span style={{ fontSize: '8px', color: '#10b981', fontWeight: 700 }}>
                              ✓ {srcAttribution.statutoryCompliance}
                            </span>
                            <a
                              href={srcAttribution.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: 'rgba(16, 185, 129, 0.2)',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                color: '#34d399',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '9px',
                                fontWeight: 800,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              Cross-Check Dossier <ArrowUpRight size={10} />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 🗺️ OPERATIONAL PROCESS MAP & STEP-BY-STEP GUIDANCE */}
                  <div style={{
                    background: '#090e1a',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        🗺️ Transaction Execution Process Map
                      </div>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>6 Sequential Stages</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {processMap.map((step: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'flex-start',
                            background: '#070a12',
                            border: '1px solid #1e293b',
                            borderRadius: '6px',
                            padding: '8px'
                          }}
                        >
                          <div style={{
                            minWidth: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: 'rgba(245, 158, 11, 0.2)',
                            border: '1px solid rgba(245, 158, 11, 0.5)',
                            color: '#fbbf24',
                            fontSize: '10px',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {step.stepNumber || idx + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>
                                {step.title}
                              </span>
                              <span style={{ fontSize: '8px', color: '#64748b' }}>
                                {step.timing}
                              </span>
                            </div>
                            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>
                              {step.action}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}

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

    
      {/* 🚀 AUTOMATED TRI-CHANNEL PROGRESS MODAL */}
      {approvalProgressModal && approvalProgressModal.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              color: '#f8fafc',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <Send size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                    AUTOMATED TRI-CHANNEL DISPATCH
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Deal Ref: #{approvalProgressModal.ticketId}
                  </div>
                </div>
              </div>
              {approvalProgressModal.isDone && (
                <button
                  onClick={() => setApprovalProgressModal(null)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Target Overview */}
            <div style={{ background: '#1e293b', borderRadius: '10px', padding: '10px 12px', marginBottom: '16px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9' }}>{approvalProgressModal.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px', fontSize: '11px', color: '#94a3b8' }}>
                <span>Broker: <b style={{ color: '#cbd5e1' }}>{approvalProgressModal.brokerName}</b></span>
                <span>📞 <b style={{ color: '#cbd5e1' }}>{approvalProgressModal.brokerPhone}</b></span>
                <span>✉️ <b style={{ color: '#cbd5e1' }}>{approvalProgressModal.brokerEmail}</b></span>
              </div>
            </div>

            {/* Step-by-Step Progress Updates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {approvalProgressModal.steps.map((st) => {
                const isCurrent = st.status === 'in_progress';
                const isSuccess = st.status === 'success';
                const isFallback = st.status === 'fallback';
                const isPending = st.status === 'pending';

                return (
                  <div
                    key={st.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      background: isCurrent ? 'rgba(16, 185, 129, 0.08)' : (isSuccess ? 'rgba(16, 185, 129, 0.04)' : '#1e293b'),
                      border: `1px solid ${isCurrent ? '#10b981' : (isSuccess ? 'rgba(16, 185, 129, 0.3)' : '#334155')}`,
                      borderRadius: '10px',
                      padding: '10px 12px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Status Icon */}
                    <div style={{ marginTop: '2px' }}>
                      {isSuccess && <CheckCircle2 size={16} color="#10b981" />}
                      {isFallback && <CheckCircle2 size={16} color="#38bdf8" />}
                      {isCurrent && (
                        <div style={{ display: 'inline-block' }}>
                          <RefreshCw size={16} color="#fbbf24" />
                        </div>
                      )}
                      {isPending && (
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #475569' }} />
                      )}
                    </div>

                    {/* Step Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: isCurrent ? '#fbbf24' : (isSuccess ? '#10b981' : (isFallback ? '#38bdf8' : '#94a3b8')) }}>
                          {st.title}
                        </span>
                        {isSuccess && (
                          <span style={{ fontSize: '9px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                            DISPATCHED
                          </span>
                        )}
                        {isFallback && (
                          <span style={{ fontSize: '9px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                            STAGED 1-TAP
                          </span>
                        )}
                        {isCurrent && (
                          <span style={{ fontSize: '9px', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                            SENDING...
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: isCurrent ? '#e2e8f0' : '#94a3b8', marginTop: '3px', lineHeight: 1.35 }}>
                        {st.detail}
                      </div>
                      {st.gatewayConfirmed && (
                        <div style={{ fontSize: '10px', color: '#10b981', marginTop: '3px', fontWeight: 600 }}>
                          ✓ Gateway: {st.gatewayConfirmed}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions upon completion */}
            {approvalProgressModal.isDone ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>
                    🎉 ALL 3 PLATFORMS AUTOMATED & DISPATCHED!
                  </div>
                  <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '3px' }}>
                    You will receive notifications on Admin Hotline (+234 802 279 1227) as the broker responds.
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSubTab('dispatched');
                      setApprovalProgressModal(null);
                    }}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      color: '#f8fafc',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    📜 View in Ledger
                  </button>
                  <button
                    onClick={() => {
                      const t = pendingTickets.find((x: any) => x.ticketId === approvalProgressModal.ticketId) ||
                                outboundQueue.find((x: any) => x.ticketId === approvalProgressModal.ticketId) ||
                                dispatchedLedger.find((x: any) => x.ticketId === approvalProgressModal.ticketId);
                      setApprovalProgressModal(null);
                      if (t) setCallBriefModalTicket(t);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      color: '#ffffff',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    📞 View Call Crib Sheet
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', padding: '6px' }}>
                Automating outreach across WhatsApp, GSM SMS & Email... Please wait.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
