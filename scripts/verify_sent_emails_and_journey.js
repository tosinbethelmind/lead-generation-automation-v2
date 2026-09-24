const https = require('https');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

async function checkBrevoEvents() {
  console.log('========================================================================');
  console.log('📡 1. DIRECT BREVO SERVER VERIFICATION (CONFIRMING LIVE DELIVERIES)');
  console.log('========================================================================\n');

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/statistics/events?limit=50&sort=desc',
      method: 'GET',
      headers: {
        'api-key': config.brevoApiKey,
        'accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log('Brevo Events API Status Code:', res.statusCode);
        try {
          const data = JSON.parse(body);
          const events = data.events || [];
          console.log(`Total live events fetched from Brevo: ${events.length}`);
          
          const delivered = events.filter(e => e.event === 'delivered' || e.event === 'requests');
          const opens = events.filter(e => e.event === 'opened' || e.event === 'clicks');
          console.log(`Delivered / Request events: ${delivered.length}`);
          console.log(`Opens / Clicks: ${opens.length}`);

          console.log('\n--- SAMPLE RECENT CONFIRMED DISPATCHES ON BREVO SERVERS ---');
          events.slice(0, 10).forEach((e, idx) => {
            console.log(`[${idx + 1}] Recipient: ${e.email} | Event: ${e.event} | Date: ${e.date} | Subject: ${e.subject}`);
          });
        } catch (e) {
          console.error('Parse error:', e.message, body.substring(0, 200));
        }
        resolve();
      });
    });

    req.on('error', err => {
      console.error('Network error querying Brevo:', err.message);
      resolve();
    });
    req.end();
  });
}

function checkLocalDbAndJourneys() {
  console.log('\n========================================================================');
  console.log('📊 2. LOCAL DATABASE & CUSTOMER JOURNEY AUDIT');
  console.log('========================================================================\n');

  const leadsDbPath = path.join(__dirname, '../local_db/leads_db.json');
  const journeysPath = path.join(__dirname, '../local_db/lead_journeys.json');

  let leads = [];
  if (fs.existsSync(leadsDbPath)) {
    leads = JSON.parse(fs.readFileSync(leadsDbPath, 'utf8'));
  }

  const emailsSentInLeadsDb = leads.filter(l => l.email_sent || l.email_dispatched);
  console.log(`Total leads in leads_db.json: ${leads.length}`);
  console.log(`Confirmed emails marked SENT in leads_db.json: ${emailsSentInLeadsDb.length}`);

  // Inspect recent sent leads
  const recentlySent = emailsSentInLeadsDb.filter(l => l.email_sent_at && l.email_sent_at.startsWith('2026-09-04'));
  console.log(`Confirmed emails sent TODAY (2026-09-04): ${recentlySent.length}`);

  console.log('\nSample 5 leads dispatched today:');
  recentlySent.slice(0, 5).forEach(l => {
    console.log(`• Business: ${l.name} | Email: ${l.email} | Provider: ${l.email_provider} | SentAt: ${l.email_sent_at} | MsgID: ${l.email_message_id}`);
  });

  let journeys = {};
  if (fs.existsSync(journeysPath)) {
    journeys = JSON.parse(fs.readFileSync(journeysPath, 'utf8'));
  }

  console.log(`\nTotal customer journeys tracked: ${Object.keys(journeys).length}`);
  const journeyStages = {};
  const journeyHeat = {};

  for (const k in journeys) {
    const j = journeys[k];
    const stage = j.current_stage || j.stage || 'SCRAPED';
    const heat = j.intent_heat || j.heat || 'COLD';
    journeyStages[stage] = (journeyStages[stage] || 0) + 1;
    journeyHeat[heat] = (journeyHeat[heat] || 0) + 1;
  }

  console.log('Customer Journey Stages breakdown:');
  console.table(journeyStages);
  console.log('Customer Journey Heat breakdown:');
  console.table(journeyHeat);
}

async function run() {
  await checkBrevoEvents();
  checkLocalDbAndJourneys();
}

run();
