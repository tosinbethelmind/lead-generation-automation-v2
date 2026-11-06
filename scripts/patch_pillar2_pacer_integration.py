import os
import sys

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

file_path = os.path.join('src', 'lib', 'pillar2', 'pillar2Engine.ts')

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update getPillar2Telemetry stats
old_stats = """  const totalAssetPoolNGN = pendingTickets.reduce((sum, t) => sum + (t.propertyValueNGN || 0), 0);
  const totalOriginationPoolNGN = pendingTickets.reduce((sum, t) => sum + (t.projectedRevenueNGN || 0), 0);

  return {
    stats: {
      pendingCount: pendingTickets.length,
      approvedCount: approvedTickets.length,
      rejectedCount: rejectedTickets.length,
      totalAssetPoolNGN,
      totalOriginationPoolNGN,
      queuedOutboundCount: queueList.filter(q => q.status === 'QUEUED_FOR_OUTBOUND' || q.status === 'DIRECT_CHAT_READY').length,
      dispatchedCount: dispatchedList.length
    },"""

new_stats = """  const totalAssetPoolNGN = pendingTickets.reduce((sum, t) => sum + (t.propertyValueNGN || 0), 0);
  const totalOriginationPoolNGN = pendingTickets.reduce((sum, t) => sum + (t.projectedRevenueNGN || 0), 0);

  // Retrieve current real-time outreach pacing & daily quota status (Max 15/day, well-spaced)
  const pacer = await checkPillar2PacingEligibility();

  return {
    stats: {
      pendingCount: pendingTickets.length,
      approvedCount: approvedTickets.length,
      rejectedCount: rejectedTickets.length,
      totalAssetPoolNGN,
      totalOriginationPoolNGN,
      queuedOutboundCount: queueList.filter(q => q.status === 'QUEUED_FOR_OUTBOUND' || q.status === 'DIRECT_CHAT_READY').length,
      dispatchedCount: dispatchedList.length,
      // Paced Outreach Metrics (Max 15/day, 30m spacing)
      dailyOutreachSent: pacer.sentToday,
      dailyOutreachMax: pacer.maxDaily,
      dailyOutreachRemaining: pacer.remainingToday,
      isPacingActive: !pacer.allowed,
      pacingReason: pacer.reason,
      nextEligibleAt: pacer.nextEligibleAt,
      minutesUntilNext: pacer.minutesUntilNextEligible,
      isBusinessHours: pacer.isBusinessHours,
      currentWatTime: pacer.currentWatTime
    },
    pacer,"""

if old_stats in content:
    content = content.replace(old_stats, new_stats, 1)
    print("✅ Successfully patched getPillar2Telemetry")
else:
    print("❌ old_stats not found")

# 2. Update approveTicket to record dispatch to pacer
old_approve_dispatch = """  if (activeGateways.length > 0) {
    queueItem.status = 'DISPATCHED_MULTI_CHANNEL';
    queueItem.dispatchedAt = new Date().toISOString();
    queueItem.gateway = activeGateways.join(' + ');
    inMemoryDispatched.push(queueItem);
  } else {"""

new_approve_dispatch = """  if (activeGateways.length > 0) {
    queueItem.status = 'DISPATCHED_MULTI_CHANNEL';
    queueItem.dispatchedAt = new Date().toISOString();
    queueItem.gateway = activeGateways.join(' + ');
    inMemoryDispatched.push(queueItem);
    try {
      await recordPillar2Dispatch({
        ticketId,
        recipient: recipientEmail || e164,
        channel: activeGateways.join(' + ')
      });
    } catch (_) {}
  } else {"""

if old_approve_dispatch in content:
    content = content.replace(old_approve_dispatch, new_approve_dispatch, 1)
    print("✅ Successfully patched approveTicket dispatch recording")
else:
    print("❌ old_approve_dispatch not found")

# 3. Update processOutboundQueue to enforce pacing & 15/day quota
old_process_queue = """export async function processOutboundQueue() {
  ensureBaselineTickets();
  const supabase = getSupabaseClient();
  let dispatchedCount = 0;
  let waCount = 0;
  let smsCount = 0;
  let emailCount = 0;

  for (const item of inMemoryQueue) {
    if (item.status === 'QUEUED_FOR_OUTBOUND' || item.status === 'DIRECT_CHAT_READY') {"""

new_process_queue = """export async function processOutboundQueue(options?: { forceSingleSend?: boolean }) {
  ensureBaselineTickets();
  const supabase = getSupabaseClient();
  let dispatchedCount = 0;
  let waCount = 0;
  let smsCount = 0;
  let emailCount = 0;

  // 1. Enforce Outreach Pacer (Max 15 messages/day, >= 30m spacing during Lagos business hours)
  const force = !!options?.forceSingleSend;
  const pacer = await checkPillar2PacingEligibility(force);
  if (!pacer.allowed && !force) {
    const updatedTelemetry = await getPillar2Telemetry();
    return {
      success: true,
      paced: true,
      message: pacer.reason,
      pacer,
      stats: { dispatchedCount: 0, waCount: 0, smsCount: 0, emailCount: 0 },
      pillar2: updatedTelemetry
    };
  }

  // 2. Fetch queued items from Supabase if in-memory queue is empty (serverless fallback)
  if (inMemoryQueue.length === 0 && supabase) {
    try {
      const { data } = await supabase
        .from('logs')
        .select('*')
        .eq('step', 'PILLAR2_MANDATE_OUTBOUND')
        .order('created_at', { ascending: true })
        .limit(10);
      if (data && data.length > 0) {
        data.forEach((row: any) => {
          try {
            const parsed = JSON.parse(row.message);
            if (parsed && (parsed.status === 'QUEUED_FOR_OUTBOUND' || parsed.status === 'DIRECT_CHAT_READY')) {
              inMemoryQueue.push(parsed);
            }
          } catch (_) {}
        });
      }
    } catch (_) {}
  }

  // 3. Process exactly ONE queued mandate to maintain strict well-spaced delivery (30m apart)
  const candidateIndex = inMemoryQueue.findIndex(
    item => item.status === 'QUEUED_FOR_OUTBOUND' || item.status === 'DIRECT_CHAT_READY'
  );

  if (candidateIndex === -1) {
    const updatedTelemetry = await getPillar2Telemetry();
    return {
      success: true,
      message: 'Outbound queue is clear. No pending mandates awaiting dispatch.',
      stats: { dispatchedCount: 0, waCount: 0, smsCount: 0, emailCount: 0 },
      pillar2: updatedTelemetry
    };
  }

  const itemsToProcess = [inMemoryQueue[candidateIndex]];

  for (const item of itemsToProcess) {
    if (item.status === 'QUEUED_FOR_OUTBOUND' || item.status === 'DIRECT_CHAT_READY') {"""

if old_process_queue in content:
    content = content.replace(old_process_queue, new_process_queue, 1)
    print("✅ Successfully patched processOutboundQueue start")
else:
    print("❌ old_process_queue not found")

# 4. In processOutboundQueue loop, record dispatch to pacer
old_loop_record = """      // If any of the 3 channels succeeded or were previously dispatched
      if (activeGateways.length > 0) {
        item.status = 'DISPATCHED_MULTI_CHANNEL';
        item.dispatchedAt = new Date().toISOString();
        item.gateway = activeGateways.join(' + ');
        inMemoryDispatched.push({ ...item });
        dispatchedCount++;"""

new_loop_record = """      // If any of the 3 channels succeeded or were previously dispatched
      if (activeGateways.length > 0) {
        item.status = 'DISPATCHED_MULTI_CHANNEL';
        item.dispatchedAt = new Date().toISOString();
        item.gateway = activeGateways.join(' + ');
        inMemoryDispatched.push({ ...item });
        dispatchedCount++;

        try {
          await recordPillar2Dispatch({
            ticketId: item.ticketId,
            recipient: item.recipientEmail || item.recipientPhone,
            channel: activeGateways.join(' + ')
          });
        } catch (_) {}"""

if old_loop_record in content:
    content = content.replace(old_loop_record, new_loop_record, 1)
    print("✅ Successfully patched processOutboundQueue loop recording")
else:
    print("❌ old_loop_record not found")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("🎉 File write complete.")
