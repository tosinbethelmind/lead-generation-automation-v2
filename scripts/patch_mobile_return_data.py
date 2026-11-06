with open('src/app/admin/mobile/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_block = '''      if (data.success) {
        setFeedbackMsg(`✅ Deal #${ticketId} approved! View in Outbound Queue or Dispatched Ledger.`);
        if (data.pillar2) setPillar2Data(data.pillar2);
        fetchTelemetry();
      } else {
        setFeedbackMsg(`❌ ${data.error || 'Failed to approve deal'}`);
      }'''

new_block = '''      if (data.success) {
        setFeedbackMsg(`✅ Deal #${ticketId} automated & dispatched across all 3 platforms!`);
        if (data.pillar2) setPillar2Data(data.pillar2);
        fetchTelemetry();
        return data;
      } else {
        setFeedbackMsg(`❌ ${data.error || 'Failed to approve deal'}`);
        return data;
      }'''

if old_block in text:
    text = text.replace(old_block, new_block)
    with open('src/app/admin/mobile/page.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated handleApprovePillar2 return in mobile/page.tsx!')
else:
    print('old_block not found in mobile/page.tsx')
