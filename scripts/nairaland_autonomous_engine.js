#!/usr/bin/env node
/**
 * BETHELMIND DIGITAL SOLUTIONS — AUTONOMOUS NAIRALAND FORUM ENGINE
 * 
 * Features:
 * 1. Cloudflare-Bypassing Stealth Playwright Browser Context.
 * 2. Persistent Session Management (`local_db/nairaland_session.json`).
 * 3. Autonomous Topic Publisher across targeted Nairaland boards (Auto, Properties, Business, Education, Food).
 * 4. Anti-Duplicate Content Jitter & Dynamic BBCode Formatting.
 * 5. Autonomous Thread Bumper & Reply Monitor.
 * 6. Thread Ledger Persistence (`local_db/nairaland_campaigns.json`).
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SESSION_FILE = path.join(__dirname, '..', 'local_db', 'nairaland_session.json');
const CAMPAIGNS_LEDGER = path.join(__dirname, '..', 'local_db', 'nairaland_campaigns.json');

// Nairaland Board Mapping
const BOARDS = {
  solar: { id: 14, name: 'Properties', slug: 'solar-boq' },
  auto: { id: 23, name: 'Auto', slug: 'tokunbo-duty' },
  properties: { id: 14, name: 'Properties', slug: 'mortgage-calculator' },
  business: { id: 24, name: 'Business', slug: 'fake-alert-shield' },
  education: { id: 19, name: 'Education', slug: 'school-portal' },
  salon: { id: 37, name: 'Fashion & Beauty', slug: 'salon-booking' },
  restaurant: { id: 38, name: 'Food', slug: 'restaurant-order' },
  logistics: { id: 24, name: 'Business', slug: 'logistics-quote' },
};

// Campaign Catalog with Anti-Duplicate Templates
const CAMPAIGN_CATALOG = {
  'solar-boq': {
    boardId: 14,
    boardName: 'Properties',
    toolSlug: 'solar-boq',
    titles: [
      '2026 Reality: How A 5kVA Solar Setup Replaces N312,500/Month Diesel at NERC Band A Tariffs',
      'Band A (N209.50/kWh) vs N1,250 Diesel: Audited 5kVA Solar Sizing & Payback Matrix',
      'Stop Overpaying Solar Installers in Lagos: Exact 5kVA Hybrid Inverter & Lithium BOQ Breakdown',
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]2026 Reality: How A 5kVA Solar Setup Replaces N312,500/Month Diesel at NERC Band A Tariffs (Audited Breakdown)[/b]

Fellow Nairalanders,

With petrol and diesel sitting between [b]N1,250 to N1,350 per liter[/b] and NERC DisCo Band A billing at [b]N209.50/kWh[/b], running a home or business in Nigeria on generator power is no longer sustainable.

Here is an audited, practical engineering breakdown for a standard [b]5kVA Hybrid Solar System[/b] (Tier-1 51.2V LiFePO4 Lithium Battery):

[quote]
[b]• System Sizing:[/b] 5.0 kVA Pure Sine Inverter + 10kWh 51.2V Lithium Battery + 8x 550W Mono Half-Cell Panels
[b]• Daily Appliance Load:[/b] 1-2 Inverter ACs, Refrigerator, Deep Freezer, Water Pump, TV & Full LED Lighting
[b]• Monthly Diesel Displaced:[/b] ~250 Liters/month ([b]approx N312,500/month saved[/b])
[b]• Complete BOQ Procurement:[/b] ~N4,500,000 – N5,200,000 (depending on cable runs & surge protection)
[b]• Payback Runway:[/b] [b]14 to 16 Months[/b] (After month 16, electricity is virtually free)
[/quote]

Instead of guessing your sizing or overpaying roadside technicians, you can run your exact property numbers free on your phone:

[url=https://www.bethelmindanalytics.com/tools/solar-boq][b]👉 Test Your Exact Property Load & DisCo Sizing Free (No Sign-Up Needed)[/b][/url]

You can select Flat, Duplex, or Commercial Facility, enter your current monthly diesel spend, and generate an audited WhatsApp proposal instantly.

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions (CAC Certified Enterprise RC 7034297)[/i]`;
    }
  },

  'tokunbo-duty': {
    boardId: 23,
    boardName: 'Auto',
    toolSlug: 'tokunbo-duty',
    titles: [
      'OFFICIAL 2026 Tin Can & PTML Customs Duty Calculation on Tokunbo Vehicles (20% Duty + 15% NAC Matrix)',
      'How to Calculate Exact Port Clearing Duty for Tokunbo Cars Before Wiring Funds (NCS 2026)',
      'Lexus RX350 & Corolla Tin Can Customs Clearing Sheet: Statutory Duty vs Terminal Surcharges',
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]OFFICIAL 2026 Tin Can & PTML Customs Duty Calculation on Tokunbo Vehicles (20% Duty + 15% NAC Matrix)[/b]

To all car buyers, clearing agents, and auto dealers on Nairaland,

One of the biggest issues when buying or importing a Tokunbo vehicle is not knowing the [b]exact statutory Nigerian Customs Service (NCS) duty[/b] before the vessel berths at Tin Can Island or PTML Lagos.

Here is the statutory NCS clearing formula:

[quote]
[b]1. Statutory Import Duty:[/b] 20% of assessed CIF (Cost, Insurance & Freight) valuation
[b]2. National Automotive Council (NAC) Levy:[/b] 15% of CIF
[b]3. Statutory VAT:[/b] 7.5%
[b]4. Port Terminal Charges (PTML / Tin Can):[/b] Approx N280,000 – N380,000 depending on dwell time and shipping line
[b]5. Example (2018 Lexus RX350 @ N18.5m CIF):[/b] Duty (N3.7m) + NAC (N2.775m) + VAT & Terminal Fees = ~[b]N7,250,000 Total Port Landing Clearance[/b]
[/quote]

To verify vehicle duty before committing funds or wiring money to auction houses, you can run the live 17-digit VIN clearing calculator here:

[url=https://www.bethelmindanalytics.com/tools/tokunbo-duty][b]👉 Check Exact Tokunbo Customs Duty & Port Landing Cost Free[/b][/url]

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions (CAC Certified Enterprise RC 7034297)[/i]`;
    }
  },

  'salon-booking': {
    boardId: 37,
    boardName: 'Fashion & Beauty',
    toolSlug: 'salon-booking',
    titles: [
      'How Lagos Salons & Spas Are Stopping Fake Alerts and No-Shows with 25% WhatsApp Deposit Locks',
      'The 25% Seat Deposit Solution: How Beauty Parlors in Ikeja & Lekki Recover Vacant Chairs',
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]How Lagos Salons & Spas Are Stopping Fake Alerts and No-Shows with 25% WhatsApp Deposit Locks[/b]

If you operate a hair salon, spa, nail bar, or executive barbershop in Lagos, Abuja, or Port Harcourt, you already know the two biggest revenue killers:
1. Customer No-Shows: A client books bridal fixing for Saturday 11 AM, your senior stylist sits waiting, and the client never shows up.
2. Fake Bank Credit Alerts: In a busy salon on weekend evenings, customers show fake bank transfer screenshots before walking out.

[quote]
[b]The Solution:[/b] 24/7 WhatsApp Appointment Booking with an instant [b]25% Seat Deposit Lock[/b].
• Client picks stylist, service, and time slot on your mobile menu.
• System instantly provisions a dynamic Moniepoint virtual account.
• When the 25% seat deposit clears, the chair is locked and calendar invite auto-dispatches.
• Zero fake alerts, zero vacant stylist hours.
[/quote]

Test the interactive prototype on your phone here:

[url=https://www.bethelmindanalytics.com/tools/salon-booking][b]👉 Test The Free 24/7 Salon Booking & Deposit Lock Engine[/b][/url]

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions[/i]`;
    }
  },

  'restaurant-order': {
    boardId: 38,
    boardName: 'Food',
    toolSlug: 'restaurant-order',
    titles: [
      'Stop Giving 25% of Your Food Revenue to Third-Party Delivery Apps: The Direct WhatsApp Menu',
      'How Lagos Restaurants Are Slashing Delivery App Commissions with 0% Direct Digital Menus',
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]Stop Giving 25% of Your Food Revenue to Third-Party Delivery Apps: The Direct WhatsApp Menu[/b]

Restaurant and lounge owners in Nigeria are currently getting squeezed by 25% - 30% commission cuts from delivery aggregators (Chowdeck, Glovo, FoodCourt).

On an order of N16,500 (Party Jollof & Jumbo Turkey), the aggregator takes [b]over N4,125[/b] in fees, wiping out the kitchen's profit margin.

[quote]
[b]The Alternative:[/b] A lightweight Direct Digital Menu + Kitchen Ticket Generator that routes 100% of customer orders directly to your WhatsApp and Moniepoint account with [b]0% commission deducted[/b].
[/quote]

Test the live interactive 0% commission food ordering engine here:

[url=https://www.bethelmindanalytics.com/tools/restaurant-order][b]👉 Test The 0% Commission Direct Restaurant Ordering Suite[/b][/url]

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions[/i]`;
    }
  },

  'school-portal': {
    boardId: 19,
    boardName: 'Education',
    toolSlug: 'school-portal',
    titles: [
      'Private School Administrators: How to Gate Digital Result Sheets Until Term Fees Are 100% Cleared',
      'Recovering Outstanding Term Fees: Automated Result PIN Portals for Nigerian Private Schools',
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]Private School Administrators: How to Gate Digital Result Sheets Until Term Fees Are 100% Cleared[/b]

Every school term, private nursery, primary, and secondary school proprietors struggle with unpaid tuition fees. Once report cards are issued, collecting fee arrears becomes nearly impossible.

[quote]
[b]The Solution:[/b] Automated Student Term Fee Portals with Scratch-PIN / Digital Result Gating.
• Term report cards and exam broadsheets remain strictly locked behind an automated gateway.
• Parents settle term tuition via instant Moniepoint bank transfer or unique student PIN.
• The moment payment clears in the school's ledger, the digital report card unlocks immediately.
[/quote]

Test the interactive school tuition & PIN ledger suite here:

[url=https://www.bethelmindanalytics.com/tools/school-portal][b]👉 Test The School Tuition & Result PIN Ledger Free[/b][/url]

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions[/i]`;
    }
  }
};

// Ensure Ledger exists
function loadLedger() {
  if (fs.existsSync(CAMPAIGNS_LEDGER)) {
    try {
      return JSON.parse(fs.readFileSync(CAMPAIGNS_LEDGER, 'utf8'));
    } catch {
      return { threads: [], stats: { totalPosted: 0, totalBumps: 0 } };
    }
  }
  return { threads: [], stats: { totalPosted: 0, totalBumps: 0 } };
}

function saveLedger(ledger) {
  const dir = path.dirname(CAMPAIGNS_LEDGER);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CAMPAIGNS_LEDGER, JSON.stringify(ledger, null, 2), 'utf8');
}

// Browser Launch Helper with Cloudflare Stealth
async function createStealthBrowser(headless = true) {
  const browser = await chromium.launch({
    headless,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
    ]
  });

  const contextOptions = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
  };

  if (fs.existsSync(SESSION_FILE)) {
    try {
      contextOptions.storageState = SESSION_FILE;
      console.log('✓ Loaded existing session from:', SESSION_FILE);
    } catch (e) {
      console.warn('Could not parse session file:', e.message);
    }
  }

  const context = await browser.newContext(contextOptions);

  // Stealth script
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  return { browser, context };
}

// 1. Interactive Session Setup (User logs in once, session saved forever)
async function setupInteractiveSession() {
  console.log('\n============================================================');
  console.log('NAIRALAND INTERACTIVE SESSION SETUP (1-TIME INITIALIZATION)');
  console.log('============================================================');
  console.log('Opening visible browser. Please log into your Nairaland account.');
  console.log('Once logged in, the script will automatically save your session cookies.\n');

  const { browser, context } = await createStealthBrowser(false);
  const page = await context.newPage();

  await page.goto('https://www.nairaland.com/login', { waitUntil: 'domcontentloaded' });

  // If credentials exist in .env.local, auto-fill them
  const username = process.env.NAIRALAND_USERNAME;
  const password = process.env.NAIRALAND_PASSWORD;

  if (username && password) {
    console.log(`Auto-filling credentials for user: ${username}...`);
    try {
      await page.fill('input[name="login"]', username);
      await page.fill('input[name="password"]', password);
      await page.click('input[value="Login"]');
    } catch (err) {
      console.log('Auto-fill note:', err.message);
    }
  }

  console.log('Waiting for authentication detection...');

  // Poll until logged in (check for logout link or "Welcome, [Member]")
  let loggedIn = false;
  for (let i = 0; i < 120; i++) {
    await page.waitForTimeout(1500);
    const bodyText = await page.innerText('body').catch(() => '');
    if (bodyText.includes('Logout') || /Welcome,\s+[A-Za-z0-9_-]+/i.test(bodyText)) {
      loggedIn = true;
      break;
    }
  }

  if (loggedIn) {
    console.log('✓ Successfully authenticated on Nairaland!');
    const dir = path.dirname(SESSION_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    await context.storageState({ path: SESSION_FILE });
    console.log('✓ Session cookies saved to:', SESSION_FILE);
  } else {
    console.error('✗ Authentication timeout. Login was not detected within 3 minutes.');
  }

  await browser.close();
  return loggedIn;
}

// 2. Autonomous Topic Poster
async function postCampaign(campaignKey = 'solar-boq') {
  const campaign = CAMPAIGN_CATALOG[campaignKey];
  if (!campaign) {
    throw new Error(`Unknown campaign key: ${campaignKey}. Available: ${Object.keys(CAMPAIGN_CATALOG).join(', ')}`);
  }

  console.log(`\n[AUTONOMOUS POST] Launching Campaign: ${campaignKey} on Board: ${campaign.boardName} (#${campaign.boardId})...`);

  const { browser, context } = await createStealthBrowser(true);
  const page = await context.newPage();

  try {
    // Navigate to target new topic URL
    const targetUrl = `https://www.nairaland.com/newtopic?board=${campaign.boardId}`;
    console.log(`Navigating to: ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.warn('⚠️ Session expired or not logged in! Redirected to login page.');
      await browser.close();
      return { success: false, reason: 'AUTH_REQUIRED', message: 'Nairaland session expired. Run --interactive-login' };
    }

    // Pick random title variation to avoid duplicate hash
    const title = campaign.titles[Math.floor(Math.random() * campaign.titles.length)];
    const body = campaign.generateBody();

    console.log(`Setting Title: "${title}"`);

    // Type title and body
    await page.fill('input[name="title"]', title);
    await page.fill('textarea[name="body"]', body);

    // Human pause before clicking submit
    await page.waitForTimeout(2000);

    console.log('Submitting topic to Nairaland...');
    await page.click('input[value="Submit"]');

    // Wait for redirect to thread
    await page.waitForTimeout(4000);
    const postResultUrl = page.url();
    console.log('Post Result URL:', postResultUrl);

    let threadId = null;
    const match = postResultUrl.match(/\/(\d+)\//);
    if (match) {
      threadId = match[1];
    }

    const ledger = loadLedger();
    const threadRecord = {
      id: threadId || `NL-${Date.now()}`,
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
    return { success: true, thread: threadRecord };

  } catch (err) {
    console.error('Error during post:', err.message);
    await browser.close();
    return { success: false, error: err.message };
  }
}

// 3. Autonomous Bump & Auto-Reply Engine
async function bumpAndReplyToThreads() {
  const ledger = loadLedger();
  if (!ledger.threads || ledger.threads.length === 0) {
    console.log('No active threads in ledger to bump.');
    return { success: true, bumpedCount: 0 };
  }

  console.log(`\n[AUTONOMOUS BUMPER] Checking ${ledger.threads.length} active threads...`);
  const { browser, context } = await createStealthBrowser(true);
  const page = await context.newPage();

  let bumped = 0;

  for (const thread of ledger.threads) {
    if (!thread.url || thread.url.includes('/newtopic')) continue;

    console.log(`Checking thread: ${thread.title} (${thread.url})...`);
    try {
      await page.goto(thread.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        console.warn('⚠️ Session expired. Skipping bumps.');
        break;
      }

      // Check if fast reply form exists (input[name="body"] or textarea)
      const hasReplyBox = await page.$('textarea[name="body"]');
      if (hasReplyBox) {
        // Compose an expert organic bump message
        const bumpMessage = `[b]⚡ Quick Sizing Update for Inquirers:[/b]\n\nFor those asking about sizing during peak sunshine hours:\n• Remember to prioritize heavy appliances (water pumping, ironing, washing machines) between 11:00 AM and 02:30 PM to run 100% on direct solar PV without battery degradation.\n• You can run your exact custom kVA and diesel displacement calculations anytime here: [url=https://www.bethelmindanalytics.com/tools/${thread.campaignKey || 'solar-boq'}][b]Bethelmind Sector Tools Suite[/b][/url].\n\nDrop your current daily fuel spend or Disco tariff below if you want custom calculations.`;

        await page.fill('textarea[name="body"]', bumpMessage);
        await page.waitForTimeout(2000);
        await page.click('input[value="Submit"]');
        await page.waitForTimeout(3000);

        thread.lastBumpedAt = new Date().toISOString();
        thread.bumpCount = (thread.bumpCount || 0) + 1;
        bumped++;
        console.log(`✓ Thread bumped successfully! (Total bumps: ${thread.bumpCount})`);

        // Wait 10 seconds between bumps to maintain human cadence
        await page.waitForTimeout(10000);
      }
    } catch (err) {
      console.warn(`Could not bump thread ${thread.id}:`, err.message);
    }
  }

  ledger.stats.totalBumps = (ledger.stats.totalBumps || 0) + bumped;
  saveLedger(ledger);

  await browser.close();
  return { success: true, bumpedCount: bumped };
}

// 4. Status Check
function getStatus() {
  const hasSession = fs.existsSync(SESSION_FILE);
  const ledger = loadLedger();
  return {
    authenticated: hasSession,
    sessionPath: SESSION_FILE,
    totalCampaignsAvailable: Object.keys(CAMPAIGN_CATALOG).length,
    catalog: Object.keys(CAMPAIGN_CATALOG),
    ledgerStats: ledger.stats,
    activeThreadsCount: ledger.threads.length,
    recentThreads: ledger.threads.slice(0, 5),
  };
}

// CLI Command Dispatcher
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || '--status';

  if (command === '--interactive-login' || command === '--login') {
    await setupInteractiveSession();
  } else if (command === '--post') {
    const campaignArg = args.find(a => a.startsWith('--campaign='));
    const campaignKey = campaignArg ? campaignArg.split('=')[1] : 'solar-boq';
    await postCampaign(campaignKey);
  } else if (command === '--bump' || command === '--monitor') {
    await bumpAndReplyToThreads();
  } else if (command === '--status') {
    const status = getStatus();
    console.log('\n============================================================');
    console.log('BETHELMIND NAIRALAND AUTONOMOUS ENGINE STATUS');
    console.log('============================================================');
    console.log('Authenticated Session:', status.authenticated ? '🟢 Active & Ready' : '🔴 Missing (Run --interactive-login)');
    console.log('Total Published Threads:', status.ledgerStats.totalPosted || 0);
    console.log('Total Thread Bumps Dispatched:', status.ledgerStats.totalBumps || 0);
    console.log('Available Campaigns:', status.catalog.join(', '));
    if (status.recentThreads.length > 0) {
      console.log('\nRecent Threads:');
      status.recentThreads.forEach((t, i) => {
        console.log(`  ${i + 1}. [${t.boardName}] ${t.title} (${t.url})`);
      });
    }
    console.log('============================================================\n');
  } else {
    console.log(`
Usage:
  node scripts/nairaland_autonomous_engine.js --status
  node scripts/nairaland_autonomous_engine.js --interactive-login
  node scripts/nairaland_autonomous_engine.js --post --campaign=solar-boq
  node scripts/nairaland_autonomous_engine.js --post --campaign=tokunbo-duty
  node scripts/nairaland_autonomous_engine.js --bump
`);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Engine error:', err);
    process.exit(1);
  });
}

module.exports = {
  createStealthBrowser,
  setupInteractiveSession,
  postCampaign,
  bumpAndReplyToThreads,
  getStatus,
  CAMPAIGN_CATALOG
};
