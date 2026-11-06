with open('src/components/admin/Pillar2ControlView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# 1. Update Outbound Queue header
old_queue_header = '''      {/* ── SUB-TAB 2: OUTBOUND QUEUE ──────────────────────────────────────── */}
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
          </div>'''

new_queue_header = '''      {/* ── SUB-TAB 2: OUTBOUND QUEUE ──────────────────────────────────────── */}
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
                disabled={triggerLoading === 'process_queue' || outboundQueue.length === 0}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #059669 100%)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                  opacity: (triggerLoading === 'process_queue' || outboundQueue.length === 0) ? 0.6 : 1
                }}
              >
                <Send size={12} />
                <span>{triggerLoading === 'process_queue' ? 'Dispatching Queue...' : '🚀 Dispatch Entire Queue (All 3)'}</span>
              </button>
            </div>
          </div>'''

text = text.replace(old_queue_header, new_queue_header)

# 2. Upgrade each queue item card with Tri-Platform Live Badges and 1-tap dispatch
old_relay_block = '''                {/* Tri-Channel Outbound Relay Bar */}
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
                      href={item.directChatLink || `https://wa.me/${String(item.recipientPhone || '').replace(/\\D/g, '')}?text=${encodeURIComponent(item.scriptText || '')}`}
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
                      href={item.smsLink || `sms:+${String(item.recipientPhone || '').replace(/\\D/g, '')}?body=${encodeURIComponent(item.smsText || '')}`}
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
                </div>'''

new_relay_block = '''                {/* Live Tri-Platform Delivery Status Dashboard */}
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
                          href={item.directChatLink || `https://wa.me/${String(item.recipientPhone || '').replace(/\\D/g, '')}?text=${encodeURIComponent(item.scriptText || '')}`}
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
                          href={item.smsLink || `sms:+${String(item.recipientPhone || '').replace(/\\D/g, '')}?body=${encodeURIComponent(item.smsText || '')}`}
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
                })()}'''

text = text.replace(old_relay_block, new_relay_block)

with open('src/components/admin/Pillar2ControlView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated Outbound Queue Tri-Platform UI in Pillar2ControlView.tsx!')
