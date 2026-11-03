import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Patch src/app/admin/mobile/page.tsx
mobile_path = os.path.join('src', 'app', 'admin', 'mobile', 'page.tsx')
with open(mobile_path, 'r', encoding='utf-8') as f:
    mobile_content = f.read()

old_mobile_feedback = """      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(`✅ Deal #${ticketId} automated & dispatched across all 3 platforms!`);
        if (data.pillar2) setPillar2Data(data.pillar2);
        fetchTelemetry();
        return data;"""

new_mobile_feedback = """      const data = await res.json();
      if (data.success) {
        const waOk = data.waResult?.dispatched;
        const emailOk = data.emailResult?.dispatched;
        const smsOk = data.smsResult?.dispatched;
        const sentList: string[] = [];
        if (waOk) sentList.push('WhatsApp');
        if (emailOk) sentList.push('Email');
        if (smsOk) sentList.push('SMS');

        if (sentList.length === 3) {
          setFeedbackMsg(`✅ Deal #${ticketId}: Confirmed delivered on all 3 platforms!`);
        } else if (sentList.length > 0) {
          setFeedbackMsg(`⚡ Deal #${ticketId}: Confirmed sent via ${sentList.join(' + ')}. Remaining channels queued for Pacer / 1-Tap.`);
        } else {
          setFeedbackMsg(`📋 Deal #${ticketId}: Approved & placed in Outbound Queue. (Paced / 1-Tap Ready - 0 sent via API yet).`);
        }

        if (data.pillar2) setPillar2Data(data.pillar2);
        fetchTelemetry();
        return data;"""

if old_mobile_feedback in mobile_content:
    mobile_content = mobile_content.replace(old_mobile_feedback, new_mobile_feedback, 1)
    with open(mobile_path, 'w', encoding='utf-8') as f:
        f.write(mobile_content)
    print("✅ Fixed truth-in-reporting toast in src/app/admin/mobile/page.tsx")
else:
    print("❌ old_mobile_feedback not found in mobile page")

# Patch src/components/admin/Pillar2ControlView.tsx
view_path = os.path.join('src', 'components', 'admin', 'Pillar2ControlView.tsx')
with open(view_path, 'r', encoding='utf-8') as f:
    view_content = f.read()

# Fix step 5 detail in handleApproveWithLiveProgress
old_modal_step5 = """      setApprovalProgressModal(prev => {
        if (!prev) return null;
        const steps = [...prev.steps];
        steps[4].status = 'success';
        steps[4].detail = 'Recorded in Dispatched Ledger • Moniepoint MFB 6805375225 lock confirmed.';
        return { ...prev, step: 5, isDone: true, result: res, steps };
      });"""

new_modal_step5 = """      setApprovalProgressModal(prev => {
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
      });"""

if old_modal_step5 in view_content:
    view_content = view_content.replace(old_modal_step5, new_modal_step5, 1)
    print("✅ Fixed modal step 5 truthful reporting")
else:
    print("❌ old_modal_step5 not found")

# Fix badge on deal card so "In Outbound Queue" is clearly labeled unsent/pending
old_card_badges = """              {isDispatched ? (
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
              )}"""

new_card_badges = """              {isDispatched ? (
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
              )}"""

if old_card_badges in view_content:
    view_content = view_content.replace(old_card_badges, new_card_badges, 1)
    print("✅ Fixed deal card badges to distinguish Verified Sent vs Queued / Unsent")
else:
    print("❌ old_card_badges not found")

with open(view_path, 'w', encoding='utf-8') as f:
    f.write(view_content)

print("🎉 Truth-in-reporting patches applied successfully.")
