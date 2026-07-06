const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const configPath = path.join(__dirname, '../config.json');
const leadsDbPath = path.join(__dirname, '../local_db/leads_db.json');

const mockLeads = [
  {
    lead_id: 'mock_upgrade_lead_1',
    source: 'GOOGLE',
    name: 'Luxe Couture Lagos Upgrade',
    category: 'fashion',
    phone_e164: '+2348000000001',
    phone_raw: '08000000001',
    email: 'luxe-upgrade@example.com',
    website: 'https://luxe-existing-site.com',
    status: 'NEW',
    collected_at: new Date().toISOString(),
    rating: 4.5,
    reviews_count: 23,
    area: 'Lekki Phase 1',
    city: 'Lagos'
  },
  {
    lead_id: 'mock_new_build_lead_1',
    source: 'GOOGLE',
    name: 'New Couture Lagos Build',
    category: 'fashion',
    phone_e164: '+2348000000002',
    phone_raw: '08000000002',
    email: 'new-build@example.com',
    website: 'None',
    status: 'NEW',
    collected_at: new Date().toISOString(),
    rating: 4.2,
    reviews_count: 12,
    area: 'Ikeja',
    city: 'Lagos'
  }
];

function testFetch(leadId) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3006/api/preview/generate?leadId=${leadId}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: data
          });
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    // 1. Seed local JSON
    console.log('Seeding local DB at:', leadsDbPath);
    const dbDir = path.dirname(leadsDbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    fs.writeFileSync(leadsDbPath, JSON.stringify(mockLeads, null, 2));

    // 2. Seed Supabase
    const parsedConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const supabaseUrl = parsedConfig.supabaseUrl;
    const supabaseKey = parsedConfig.supabaseKey;
    if (supabaseUrl && supabaseKey) {
      console.log('Seeding Supabase...');
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Delete first
      await supabase.from('leads').delete().in('lead_id', ['mock_upgrade_lead_1', 'mock_new_build_lead_1']);
      
      const toInsert = mockLeads.map(l => ({
        lead_id: l.lead_id,
        source: l.source,
        name: l.name,
        category: l.category,
        address: '',
        area: l.area,
        city: l.city,
        phone_e164: l.phone_e164,
        phone_raw: l.phone_raw,
        email: l.email,
        website: l.website,
        rating: l.rating,
        reviews_count: l.reviews_count,
        status: l.status,
        collected_at: l.collected_at,
        notes: '[source:GOOGLE]Mock Lead for diagnostic validation',
        generated_copy: null,
        design_theme: null
      }));
      const { error } = await supabase.from('leads').insert(toInsert);
      if (error) {
        console.error('Supabase seeding error:', error);
      } else {
        console.log('Supabase seeded successfully!');
      }
    }

    console.log('\nFetching mock_upgrade_lead_1...');
    const resUpgrade = await testFetch('mock_upgrade_lead_1');
    console.log('Status:', resUpgrade.statusCode);
    if (resUpgrade.statusCode === 200) {
      console.log('Copy Hero Title:', resUpgrade.body.copy?.heroTitle);
      console.log('Copy Hero Subtitle:', resUpgrade.body.copy?.heroSubtitle);
      console.log('Copy services[0]:', resUpgrade.body.copy?.services?.[0]);
      console.log('Pitch Widget Title:', resUpgrade.body.pitch?.widgetTitle);
      console.log('Pitch Widget Description:', resUpgrade.body.pitch?.widgetDescription);
      console.log('Pitch benefitsList:', resUpgrade.body.pitch?.benefitsList);
    } else {
      console.log('Error Body:', resUpgrade.body);
    }

    console.log('\nFetching mock_new_build_lead_1...');
    const resNew = await testFetch('mock_new_build_lead_1');
    console.log('Status:', resNew.statusCode);
    if (resNew.statusCode === 200) {
      console.log('Copy Hero Title:', resNew.body.copy?.heroTitle);
      console.log('Copy Hero Subtitle:', resNew.body.copy?.heroSubtitle);
      console.log('Copy services[0]:', resNew.body.copy?.services?.[0]);
      console.log('Pitch Widget Title:', resNew.body.pitch?.widgetTitle);
      console.log('Pitch Widget Description:', resNew.body.pitch?.widgetDescription);
      console.log('Pitch benefitsList:', resNew.body.pitch?.benefitsList);
    } else {
      console.log('Error Body:', resNew.body);
    }

    // Cleanup
    console.log('\nCleaning up local DB and Supabase...');
    if (fs.existsSync(leadsDbPath)) {
      fs.unlinkSync(leadsDbPath);
    }
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('leads').delete().in('lead_id', ['mock_upgrade_lead_1', 'mock_new_build_lead_1']);
    }
    console.log('Cleanup complete.');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
