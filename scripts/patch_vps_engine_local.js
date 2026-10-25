const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'nairaland_autonomous_engine_vps.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace target block
const target = `    const ledger = loadLedger();
    const threadRecord = {
      id: threadId || \`NL-\${Date.now()}\`,
      campaignKey,
      title,
      boardId: campaign.boardId,
      boardName: campaign.boardName,
      url: postResultUrl,
      postedAt: new Date().toISOString(),
      lastBumpedAt: new Date().toISOString(),
      bumpCount: 0,
      repliesCount: 0,
    };

    ledger.threads.unshift(threadRecord);
    ledger.stats.totalPosted = (ledger.stats.totalPosted || 0) + 1;
    saveLedger(ledger);

    console.log('✓ Topic successfully posted and recorded in ledger!');
    await browser.close();
    return { success: true, thread: threadRecord };`;

const replacement = `    if (threadId && !postResultUrl.includes('/do_newtopic') && !postResultUrl.includes('/newtopic')) {
      const ledger = loadLedger();
      const threadRecord = {
        id: threadId,
        campaignKey,
        title,
        boardId: campaign.boardId,
        boardName: campaign.boardName,
        url: postResultUrl,
        postedAt: new Date().toISOString(),
        lastBumpedAt: new Date().toISOString(),
        bumpCount: 0,
        repliesCount: 0,
      };

      const exists = (ledger.threads || []).some(t => t.id === threadId);
      if (!exists) {
        ledger.threads.unshift(threadRecord);
        ledger.stats.totalPosted = (ledger.stats.totalPosted || 0) + 1;
        saveLedger(ledger);
      }

      console.log('✓ Topic successfully posted and recorded in ledger:', threadRecord.url);
      await browser.close();
      return { success: true, thread: threadRecord };
    } else {
      console.warn('⚠️ Topic publication did not redirect to a live topic URL. Current URL:', postResultUrl);
      await browser.close();
      return { success: false, reason: 'NOT_REDIRECTED', url: postResultUrl };
    }`;

// Try direct or normalized
if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ Successfully patched postCampaign directly!');
} else {
  const normContent = content.replace(/\r\n/g, '\n');
  const normTarget = target.replace(/\r\n/g, '\n');
  const normReplacement = replacement.replace(/\r\n/g, '\n');
  if (normContent.includes(normTarget)) {
    const updated = normContent.replace(normTarget, normReplacement);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('✓ Successfully patched postCampaign after normalizing newlines!');
  } else {
    console.error('Target block not found');
  }
}
