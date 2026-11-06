import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_path = os.path.join('src', 'components', 'admin', 'Pillar2ControlView.tsx')

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update stats extraction to include daily outreach
old_stats_def = """  const stats = pillar2Data?.stats || {
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalAssetPoolNGN: 0,
    totalOriginationPoolNGN: 0,
    queuedOutboundCount: 0,
    dispatchedCount: 0
  };"""

new_stats_def = """  const stats = pillar2Data?.stats || {
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
  };"""

if old_stats_def in content:
    content = content.replace(old_stats_def, new_stats_def, 1)
    print("✅ Successfully patched stats defaults")
else:
    print("❌ old_stats_def not found")

# 2. Add Paced Outreach Banner right after Settlement Account Badge
old_settlement_badge = """          <button
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
      </div>"""

new_settlement_badge = """          <button
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
      </div>"""

if old_settlement_badge in content:
    content = content.replace(old_settlement_badge, new_settlement_badge, 1)
    print("✅ Successfully added Paced Outreach Banner to overview")
else:
    print("❌ old_settlement_badge not found")

# 3. Update the Outbound Queue button in subTab === 'queue'
old_queue_btn = """              <button
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
              </button>"""

new_queue_btn = """              <button
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
              </button>"""

if old_queue_btn in content:
    content = content.replace(old_queue_btn, new_queue_btn, 1)
    print("✅ Successfully updated queue action button with pacing states")
else:
    print("❌ old_queue_btn not found")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("🎉 Pillar2ControlView.tsx patch complete.")
