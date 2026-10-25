const fs = require('fs');
const path = require('path');

const enginePath = path.join(__dirname, 'nairaland_autonomous_engine.js');
let code = fs.readFileSync(enginePath, 'utf8');

// 1. Update Session resolution and accounts registry
const oldSessionHeader = `const SESSION_FILE = path.join(__dirname, '..', 'local_db', 'nairaland_session.json');
const CAMPAIGNS_LEDGER = path.join(__dirname, '..', 'local_db', 'nairaland_campaigns.json');`;

const newSessionHeader = `const ACCOUNTS_REGISTRY = path.join(__dirname, '..', 'local_db', 'nairaland_accounts.json');

function getActiveAccountName() {
  const accountArg = process.argv.find(a => a.startsWith('--account=') || a.startsWith('--user='));
  if (accountArg) return accountArg.split('=')[1].trim();
  return null;
}

function resolveSessionFile(accountOverride = null) {
  const acc = accountOverride || getActiveAccountName();
  if (acc) {
    if (acc.toLowerCase().includes('kenetwork')) {
      return path.join(__dirname, '..', 'local_db', 'nairaland_session_kenetwork2026.json');
    }
    if (acc.toLowerCase().includes('bethelsolution')) {
      return path.join(__dirname, '..', 'local_db', 'nairaland_session.json');
    }
  }
  return path.join(__dirname, '..', 'local_db', 'nairaland_session.json');
}

let SESSION_FILE = resolveSessionFile();
const CAMPAIGNS_LEDGER = path.join(__dirname, '..', 'local_db', 'nairaland_campaigns.json');`;

code = code.replace(oldSessionHeader.replace(/\r?\n/g, '\r\n'), newSessionHeader.replace(/\n/g, '\r\n'));
if (!code.includes('resolveSessionFile')) {
  code = code.replace(oldSessionHeader.replace(/\r?\n/g, '\n'), newSessionHeader.replace(/\r?\n/g, '\n'));
}

// 2. Add 'sports' to BOARDS
if (!code.includes("sports: { id: 22, name: 'Sports', slug: 'footy-wordle' }")) {
  code = code.replace(
    "logistics: { id: 24, name: 'Business', slug: 'logistics-quote' },",
    "logistics: { id: 24, name: 'Business', slug: 'logistics-quote' },\r\n  sports: { id: 22, name: 'Sports', slug: 'footy-wordle' },"
  );
}

// 3. Add 'footy-wordle' campaign to CAMPAIGN_CATALOG
const footyCampaign = `
  'footy-wordle': {
    boardId: 22,
    boardName: 'Sports',
    toolSlug: 'footy-wordle',
    titles: [
      'FootyWordle AI: Daily 5-Letter Football Star Mystery & Transfer Value Guessing Game',
      'Free Daily Football Wordle For Nigerian Fans (Test Your Premier League & UCL Knowledge)',
      'How Many Tries To Guess Today 5-Letter Mystery Player? (Naija Football Fans Challenge)'
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return \`[b]⚽ Daily Football Mystery Player & Transfer Value Game (Play Free in Browser)[/b]

Naija Football Fans & Premier League Analysts,

We built a free, lightweight [b]daily 5-letter football Wordle game[/b] tailored for African sports enthusiasts. 

[quote]
[b]How to Play:[/b]
• Guess today's 5-letter football superstar or iconic club in 6 tries.
• Each guess gives you instant green/yellow letter clues.
• Once solved, view current transfer market valuations, league stats & historical trophies.
• Share your emoji score grid on WhatsApp or right here on Nairaland to challenge your friends!
[/quote]

Test today's mystery puzzle directly on your phone:

[url=https://www.bethelmindanalytics.com/tools/footy-wordle][b]👉 Play Today's Daily FootyWordle Free Here[/b][/url]

[b]Challenge:[/b] How many tries did it take you to crack today's player? Share your emoji grid results in the comments below!

[i]Updated: \${dateStr} · Source: Bethelmind Digital Solutions[/i]\`;
    }
  },`;

if (!code.includes("'footy-wordle':")) {
  code = code.replace(
    "const CAMPAIGN_CATALOG = {",
    "const CAMPAIGN_CATALOG = {" + footyCampaign.replace(/\n/g, '\r\n')
  );
}

// 4. Update postCampaign to support Turnstile frame handling
const oldPostWait = `    // Wait for Cloudflare verification challenge to complete & redirect to thread (up to 25s)
    console.log('Waiting for Cloudflare security verification and thread redirect...');
    let postResultUrl = page.url();
    for (let w = 0; w < 12; w++) {
      await page.waitForTimeout(2000);
      postResultUrl = page.url();
      if (!postResultUrl.includes('/do_newtopic') && postResultUrl.match(/\\/(\\d+)\\//)) {
        console.log('✓ Redirect confirmed to live thread!');
        break;
      }
    }`;

const newPostWait = `    // Wait for Cloudflare verification challenge to complete & redirect to thread (up to 30s)
    console.log('Waiting for Cloudflare security verification and thread redirect...');
    let postResultUrl = page.url();
    for (let w = 0; w < 15; w++) {
      await page.waitForTimeout(2000);
      postResultUrl = page.url();
      if (!postResultUrl.includes('/do_newtopic') && postResultUrl.match(/\\/(\\d+)\\//)) {
        console.log('✓ Redirect confirmed to live thread!');
        break;
      }
      // Check for Turnstile frame
      const frames = page.frames();
      for (const frame of frames) {
        if (frame.url().includes('cloudflare') || frame.url().includes('turnstile') || frame.url().includes('challenge')) {
          const box = await frame.$('input[type="checkbox"], .ctp-checkbox-label, #cf-stage, #challenge-stage');
          if (box) {
            await box.click().catch(() => {});
            console.log('Detected Turnstile frame: clicked checkbox.');
          }
        }
      }
    }`;

code = code.replace(oldPostWait.replace(/\n/g, '\r\n'), newPostWait.replace(/\n/g, '\r\n'));
if (!code.includes('Detected Turnstile frame')) {
  code = code.replace(oldPostWait, newPostWait);
}

fs.writeFileSync(enginePath, code, 'utf8');
console.log('Successfully patched scripts/nairaland_autonomous_engine.js with multi-account, footy-wordle, and Turnstile handling!');
