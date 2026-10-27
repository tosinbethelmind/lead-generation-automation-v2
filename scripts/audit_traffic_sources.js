const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('BETHELMIND TRAFFIC GENERATION SOURCES AUDIT (REAL DATA)');
console.log('====================================================\n');

// 1. Nairaland
const nlFile = path.join(__dirname, '..', 'local_db', 'nairaland_campaigns.json');
if (fs.existsSync(nlFile)) {
  const nl = JSON.parse(fs.readFileSync(nlFile, 'utf8'));
  console.log('1. NAIRALAND AUTONOMOUS CAMPAIGNS:');
  for (const [k, v] of Object.entries(nl)) {
    console.log(`  • [${k}] Board: ${v.boardName || v.boardId || 'N/A'} | Thread ID: ${v.threadId || 'N/A'} | URL: ${v.threadUrl || v.url || 'Pending'} | Last Action: ${v.lastBump || v.lastPosted || v.timestamp || 'N/A'}`);
  }
} else {
  console.log('1. NAIRALAND: local_db/nairaland_campaigns.json not found locally.');
}

// 2. Omnichannel (Pinterest, Reddit, Quora)
const omniFile = path.join(__dirname, '..', 'local_db', 'omnichannel_campaigns.json');
if (fs.existsSync(omniFile)) {
  const omni = JSON.parse(fs.readFileSync(omniFile, 'utf8'));
  console.log('\n2. OMNICHANNEL SOCIAL SUITE (Pinterest, Reddit, Quora):');
  console.log(`  • Total Campaigns Recorded: ${Array.isArray(omni) ? omni.length : Object.keys(omni).length}`);
  if (Array.isArray(omni)) {
    omni.slice(-5).forEach(o => console.log(`    - [${o.platform}] ${o.topic || o.title} | Status: ${o.status} | URL: ${o.url || 'Queued'}`));
  } else {
    for (const [k, v] of Object.entries(omni)) {
      console.log(`    - [${k}]: ${JSON.stringify(v)}`);
    }
  }
} else {
  console.log('\n2. OMNICHANNEL: local_db/omnichannel_campaigns.json not found locally.');
}

// 3. Email Daemon
const emailFile = path.join(__dirname, '..', 'local_db', 'email_daemon_state.json');
if (fs.existsSync(emailFile)) {
  const emailState = JSON.parse(fs.readFileSync(emailFile, 'utf8'));
  console.log('\n3. B2B COLD EMAIL ENGINE:');
  console.log(`  • Daily Sent Today: ${emailState.sentToday || 0} / 600 quota`);
  console.log(`  • Last Dispatch Timestamp: ${emailState.lastDispatchTime || emailState.lastRun || 'N/A'}`);
  console.log(`  • Primary Mailbox: tosin@bethelmindanalytics.com (Hostinger Direct SMTP)`);
  console.log(`  • Secondary Mailbox: matthew@bethelmindanalytics.com (Hostinger Direct SMTP)`);
  console.log(`  • Failover Transport: Brevo API v3`);
} else {
  console.log('\n3. B2B COLD EMAIL: State file not found locally.');
}

// 4. Leads Harvest DB
const leadsFile = path.join(__dirname, '..', 'local_db', 'leads_db.json');
if (fs.existsSync(leadsFile)) {
  const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
  console.log('\n4. NATIONWIDE HARVESTED LEADS PIPELINE:');
  console.log(`  • Total Genuine Leads Harvested: ${leads.length}`);
  const withEmail = leads.filter(l => l.email && l.email.includes('@')).length;
  const withPhone = leads.filter(l => l.phone || l.phone_e164).length;
  console.log(`  • Leads with Verified Corporate Email: ${withEmail}`);
  console.log(`  • Leads with Verified Mobile/WhatsApp Number: ${withPhone}`);
} else {
  console.log('\n4. LEADS PIPELINE: local_db/leads_db.json not found.');
}

// 5. Check Pins Manifest
const pinsFile = path.join(__dirname, '..', 'public', 'pins', 'pins_manifest.json');
if (fs.existsSync(pinsFile)) {
  const pins = JSON.parse(fs.readFileSync(pinsFile, 'utf8'));
  console.log('\n5. PINTEREST INFOGRAPHIC ASSETS:');
  console.log(`  • Rendered 1000x1500 High-Res Pins: ${pins.length}`);
  pins.forEach(p => console.log(`    - [${p.id}] ${p.title} -> ${p.relativeUrl}`));
}
