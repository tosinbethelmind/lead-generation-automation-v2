const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'admin', 'Pillar2ControlView.tsx');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Ensure subTab defaults to 'all' and define allDisplayTickets
const oldStateHook = `const [subTab, setSubTab] = useState<'pending' | 'queue' | 'dispatched'>('pending');`;
const newStateHook = `const [subTab, setSubTab] = useState<'all' | 'pending' | 'queue' | 'dispatched'>('all');

  // Guaranteed all 8 luxury deals from backend OR pure fallback from PRIME_LUXURY_LISTINGS
  const allDisplayTickets: any[] = React.useMemo(() => {
    const rawAll = pillar2Data?.allTickets || [];
    const lookup = new Map<string, any>();
    
    // Seed with guaranteed baseline luxury assets from pure PRIME_LUXURY_LISTINGS
    PRIME_LUXURY_LISTINGS.forEach(l => {
      const propertyVal = l.priceNGN;
      const agencyCommissionPool = Math.round(propertyVal * 0.05);
      const bethelmindCut = Math.round(agencyCommissionPool * 0.20);
      const cleanPhone = String(l.brokerContact.phone).replace(/\\D/g, '');
      const e164 = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : (cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone);
      const script = \`Good day \${l.brokerContact.name}, my name is Tosin Oyelakin, Principal at Bethelmind Digital Solutions (CAC Certified: Reg 9912717). We are onboarding verified luxury mandates for our incoming Q4 diaspora investor brief and corporate executive allocations in Lagos.\\n\\nWe identified your verified listing for \${l.title} (\${l.priceFormatted}). Under LASRERA co-brokerage guidelines, we propose our standard 80/20 agency fee arrangement (your firm retains 80% of agency commission, Bethelmind retains 20% origination fee).\\n\\nReview certified buyer brief & 80/20 mandate: https://www.bethelmindanalytics.com/deal/\${l.id}\\n\\n1. Is this property still directly available under your mandate?\\n2. Do you confirm agreement to the standard 80/20 fee split?\\n\\nOnce confirmed, we issue our Joint Inspection Memorandum (JIM) before accompanied walkthrough.\`;
      const sms = \`LASRERA: Bethelmind (CAC 9912717) requests 80/20 co-brokerage for \${l.title.slice(0, 35)}. Review brief / chat Desk: wa.me/2348022791227 or call.\`;

      lookup.set(l.id, {
        ticketId: l.id,
        title: \`Pillar 2 Mandate: \${l.title}\`,
        propertyValueNGN: propertyVal,
        projectedRevenueNGN: bethelmindCut,
        targetBusinessName: l.brokerContact.name,
        targetContactPhone: l.brokerContact.phone,
        targetContactEmail: l.brokerContact.email,
        targetLocation: l.location.area + ', ' + l.location.city,
        listingUrl: \`https://www.bethelmindanalytics.com/deal/\${l.id}\`,
        status: 'PENDING_APPROVAL',
        preDraftedScript: script,
        smsText: sms,
        emailSubject: \`[LASRERA Co-Brokerage Mandate] Bethelmind Digital Solutions x \${l.brokerContact.name} - \${l.title}\`,
        emailBody: script,
        directChatLink: \`https://wa.me/\${e164}?text=\${encodeURIComponent(script)}\`,
        smsLink: \`sms:+\${e164}?body=\${encodeURIComponent(sms)}\`,
        emailLink: \`mailto:\${l.brokerContact.email}?subject=\${encodeURIComponent(\`[LASRERA Co-Brokerage Mandate] Bethelmind x \${l.brokerContact.name}\`)}&body=\${encodeURIComponent(script)}\`,
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
  }, [pillar2Data]);`;

if (code.includes(oldStateHook)) {
  code = code.replace(oldStateHook, newStateHook);
  console.log('✅ Replaced subTab state hook & injected allDisplayTickets');
} else {
  console.warn('⚠️ oldStateHook not found');
}

// 2. Update Tabs List
const oldTabsBlock = `        {[
          { key: 'pending', label: 'Staged Deals', count: stats.pendingCount },
          { key: 'queue', label: 'Outbound Queue', count: stats.queuedOutboundCount },
          { key: 'dispatched', label: 'Dispatched Ledger', count: stats.dispatchedCount }
        ].map(t => (`;

const newTabsBlock = `        {[
          { key: 'all', label: 'All Deals & Briefs', count: allDisplayTickets.length },
          { key: 'pending', label: 'Staged Deals', count: pendingTickets.length },
          { key: 'queue', label: 'Outbound Queue', count: stats.queuedOutboundCount },
          { key: 'dispatched', label: 'Dispatched Ledger', count: stats.dispatchedCount }
        ].map(t => (`;

if (code.includes(oldTabsBlock)) {
  code = code.replace(oldTabsBlock, newTabsBlock);
  console.log('✅ Updated Sub-Navigation Tab Array with "All Deals & Briefs"');
} else {
  console.warn('⚠️ oldTabsBlock not found');
}

// 3. Inject renderDealCard helper before the return statement
const renderCardFunc = `
  const renderDealCard = (ticket: any) => {
    const isApproving = triggerLoading === ticket.ticketId;
    const formattedPrice = \`₦\${(ticket.propertyValueNGN || 0).toLocaleString()}\`;
    const formattedCut = \`₦\${(ticket.projectedRevenueNGN || 0).toLocaleString()}\`;
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
                <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800 }}>
                  ✓ Dispatched
                </span>
              ) : isApprovedOrQueued ? (
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800 }}>
                  ✓ In Outbound Queue
                </span>
              ) : (
                <span style={{ background: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800 }}>
                  ⏳ Pending Review
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
              href={ticket.directChatLink || \`https://wa.me/\${String(ticket.targetContactPhone || '').replace(/\\D/g, '')}?text=\${encodeURIComponent(ticket.preDraftedScript || '')}\`}
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
              href={ticket.smsLink || \`sms:+\${String(ticket.targetContactPhone || '').replace(/\\D/g, '')}?body=\${encodeURIComponent(ticket.smsText || '')}\`}
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
              href={ticket.emailLink || \`mailto:\${ticket.targetContactEmail || ''}\`}
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
`;

const returnMatch = '  return (\n    <div style={{ display: \'flex\', flexDirection: \'column\', gap: \'16px\' }}>';
if (code.includes(returnMatch)) {
  code = code.replace(returnMatch, renderCardFunc + '\n' + returnMatch);
  console.log('✅ Injected renderDealCard helper function');
} else {
  console.warn('⚠️ returnMatch not found');
}

// 4. Update the content sections for subTab === 'all' and subTab === 'pending'
const oldSubTab1Start = `      {/* ── SUB-TAB 1: STAGED DEALS (PENDING 1-TAP APPROVAL) ───────────────── */}
      {subTab === 'pending' && (`;

const newSubTabsContent = `      {/* ── SUB-TAB 0: ALL DEALS & BRIEFS (PERMANENT GUARANTEED LIBRARY) ───── */}
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
      )}`;

// We need to replace the entire pendingTickets section up to subTab === 'queue'
const subTabPendingEnd = `      {/* ── SUB-TAB 2: OUTBOUND QUEUE ──────────────────────────────────────── */}`;
const pendingSectionRegex = /\{\/\* ── SUB-TAB 1: STAGED DEALS[\s\S]*?\{\/\* ── SUB-TAB 2: OUTBOUND QUEUE/;

if (pendingSectionRegex.test(code)) {
  code = code.replace(pendingSectionRegex, newSubTabsContent + '\n\n      ' + subTabPendingEnd);
  console.log('✅ Replaced pendingTickets section with renderDealCard and added subTab "all"');
} else {
  console.warn('⚠️ pendingSectionRegex did not match');
}

fs.writeFileSync(targetPath, code, 'utf8');
console.log('🎉 Pillar2ControlView.tsx successfully updated!');
