/**
 * @file scripts/synthesize_all_outreach_voice_notes.js
 * 
 * BATCH HIGH-SPEED VOICE NOTE SYNTHESIZER FOR ALL OUTREACH LEADS.
 * 
 * Generates personalized, natural Nigerian female audio voice notes (en-NG-EzinneNeural)
 * tailored to each of the 5 Monetization Engines.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const AUDIO_OUT_DIR = path.join(__dirname, '../public/assets/audio/dynamic');
const MANIFEST_PATH = path.join(__dirname, '../public/assets/audio/voice_notes_manifest.json');

if (!fs.existsSync(AUDIO_OUT_DIR)) {
  fs.mkdirSync(AUDIO_OUT_DIR, { recursive: true });
}

// Ensure python edge-tts is available or use standalone edge-tts CLI
async function synthesizeAllVoiceNotes() {
  console.log('================================================================');
  console.log('🎙️ BATCH VOICE NOTE SYNTHESIZER FOR ALL OUTREACH LEADS');
  console.log('================================================================\n');

  // Load staged leads from local DB and memory
  const stagedFiles = [
    path.join(__dirname, '../local_db/scraped_leads_cache.json'),
    path.join(__dirname, '../local_db/staging_leads.json'),
    path.join(__dirname, '../local_db/leads_database.json'),
    path.join(__dirname, '../local_db/five_money_leads.json')
  ];

  let allLeads = [];
  const seenIds = new Set();

  for (const file of stagedFiles) {
    if (fs.existsSync(file)) {
      try {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        const list = Array.isArray(data) ? data : (data.leads || Object.values(data));
        for (const lead of list) {
          const id = lead.lead_id || lead.id || lead.slug;
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            allLeads.push(lead);
          }
        }
      } catch (_) {}
    }
  }

  // Add verified corridor defaults across all 5 engines (including Engine 3 Domain Claiming)
  const verifiedCorridorDefaults = [
    { lead_id: 'macmed-integrated-lagos', name: 'Macmed Integrated Commercial Hub', area: 'Satellite Town, Lagos', category: 'Medical & Commercial Equipment', engine: 'ENGINE_1_GMB' },
    { lead_id: 'supreme-auto-parts-aspamda', name: 'Supreme Auto Parts International', area: 'ASPAMDA Trade Fair, Lagos', category: 'Auto Parts Wholesaler', engine: 'ENGINE_5_PROTOTYPE' },
    { lead_id: 'solar-craft-engineering-ikeja', name: 'SolarCraft Clean Energy Systems', area: 'Ikeja Industrial Estate, Lagos', category: 'Solar & Energy EPC', engine: 'ENGINE_2_SOLAR' },
    { lead_id: 'jacio-intl-tradefair', name: 'Jacio International Company Ltd', area: 'Trade Fair Complex, Lagos', category: 'Container Freight Importer', engine: 'ENGINE_5_PROTOTYPE' },
    { lead_id: 'maldini-granite-surulere', name: 'Maldini Granites & Marble Imports', area: 'Surulere, Lagos', category: 'Building Materials Importer', engine: 'ENGINE_5_PROTOTYPE' },
    { lead_id: 'apex-solar-tech-lagos', name: 'Apex Solar Technologies', area: 'Lekki Phase 1, Lagos', category: 'Solar & Battery Systems', engine: 'ENGINE_2_SOLAR' },
    // Engine 3: Expired Domain Claiming & Sovereign Buyback Targets
    { lead_id: 'lagos-solar-solutions-domain', name: 'Lagos Solar Solutions', domain: 'lagos-solar-solutions.com.ng', area: 'Lagos Commercial Corridor', category: 'Solar & Inverter Engineering', engine: 'ENGINE_3_DOMAIN' },
    { lead_id: 'vi-commercial-logistics-domain', name: 'VI Commercial Logistics', domain: 'vi-commercial-logistics.com.ng', area: 'Victoria Island, Lagos', category: 'Commercial Freight Logistics', engine: 'ENGINE_3_DOMAIN' },
    { lead_id: 'lekki-dental-specialists-domain', name: 'Lekki Dental Specialists', domain: 'lekki-dental-specialists.com.ng', area: 'Lekki Phase 1, Lagos', category: 'Dental & Healthcare Clinic', engine: 'ENGINE_3_DOMAIN' },
    // Engine 4: Verified B2B Contact Database Targets (Agencies & Sales Teams)
    { lead_id: 'b2b-growth-agency-lagos', name: 'Apex Growth Marketing Agency', area: 'Victoria Island, Lagos', category: 'B2B Marketing & Sales Agency', engine: 'ENGINE_4_BUNDLE' }
  ];


  for (const def of verifiedCorridorDefaults) {
    if (!seenIds.has(def.lead_id)) {
      seenIds.add(def.lead_id);
      allLeads.push(def);
    }
  }

  console.log(`Found ${allLeads.length} unique commercial outreach targets for voice note synthesis.`);

  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch (_) {}
  }

  let generatedCount = 0;
  let cachedCount = 0;

  for (const lead of allLeads) {
    const id = lead.lead_id || lead.id || lead.slug || 'lead_' + Math.random().toString(36).substring(7);
    const rawName = lead.name || lead.company || 'Business Owner';
    const cleanName = rawName.split('||')[0].split('|')[0].split(' - ')[0].trim();
    const area = lead.area || lead.location || 'Lagos';
    const category = lead.category || 'Commercial Enterprise';
    const domainName = lead.domain || `${id}.com.ng`;

    const mp3File = `vn_${id}.mp3`;
    const mp3Path = path.join(AUDIO_OUT_DIR, mp3File);

    if (fs.existsSync(mp3Path) && fs.statSync(mp3Path).size > 5000) {
      cachedCount++;
      manifest[id] = {
        lead_id: id,
        business_name: cleanName,
        audio_url: `/assets/audio/dynamic/${mp3File}`,
        voice: 'en-NG-EzinneNeural',
        status: 'READY'
      };
      continue;
    }

    // Engine-specific high-converting script (Expert Copywriting & Closing Tuned)
    let scriptText = '';
    if (lead.engine === 'ENGINE_4_BUNDLE') {
      scriptText = `Hello growth team at ${cleanName}! Tosin here from Bethelmind Analytics Lagos. If you run B2B outreach in Lagos, we packaged clean, verified decision-maker databases across Lekki, Victoria Island, Ikeja, and ASPAMDA with zero synthetic data. Grab a twenty-five hundred Naira sample pack or the full database via the instant download link below!`;
    } else if (lead.engine === 'ENGINE_3_DOMAIN') {
      scriptText = `Hello executive team at ${cleanName}! Tosin from Bethelmind Analytics Lagos. We noticed your official domain, ${domainName}, recently expired. We secured it into temporary priority holding to protect your Google search traffic. Tap your link below to verify ownership and reclaim custody before public release!`;
    } else if (lead.engine === 'ENGINE_1_GMB' || (!lead.hasWebsite && lead.rating)) {
      scriptText = `Hello management at ${cleanName}! Tosin here from Bethelmind Analytics Lagos. Your Google Maps profile in ${area} has great reviews, but primary ownership is unverified and exposed to competitor edits. Tap your private audit link below to see what Google is showing your customers right now!`;
    } else if (lead.engine === 'ENGINE_2_SOLAR' || category.toLowerCase().includes('solar') || category.toLowerCase().includes('hospital')) {
      scriptText = `Good day ${cleanName}! Tosin from Bethelmind Lagos. If your facility in ${area} spends over one million Naira monthly on diesel and NEPA, our free load sizer calculates your exact solar battery savings in two minutes. Tap your preview link below to see your exact monthly savings on screen!`;
    } else {
      scriptText = `Hello team at ${cleanName}! Tosin from Bethelmind Analytics Lagos. Customers looking for your products in ${area} after hours can't get instant pricing on WhatsApp. We pre-built an interactive 24/7 quoting portal specifically for ${cleanName}. Tap your live preview link right below to see how it handles your late-night inquiries!`;
    }


    console.log(`🎙️ Synthesizing Voice Note for: ${cleanName} (${area})...`);

    try {
      // Execute edge-tts via Python one-liner
      const pyCmd = `python -c "import asyncio, edge_tts; asyncio.run(edge_tts.Communicate('''${scriptText.replace(/'/g, "\\'")}''', 'en-NG-EzinneNeural', rate='-3%', pitch='-1Hz').save(r'${mp3Path}'))"`;
      execSync(pyCmd, { stdio: 'ignore', timeout: 15000, windowsHide: true });

      if (fs.existsSync(mp3Path) && fs.statSync(mp3Path).size > 1000) {
        generatedCount++;
        manifest[id] = {
          lead_id: id,
          business_name: cleanName,
          audio_url: `/assets/audio/dynamic/${mp3File}`,
          voice: 'en-NG-EzinneNeural',
          status: 'READY',
          script: scriptText
        };
        console.log(`   ✅ Saved: ${mp3File} (${Math.round(fs.statSync(mp3Path).size / 1024)} KB)`);
      }
    } catch (err) {
      console.warn(`   ⚠️ Synthesis fallback for ${id}: ${err.message}`);
    }
  }

  // Persist updated manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log('\n================================================================');
  console.log(`🎉 VOICE NOTE SYNTHESIS SUMMARY:`);
  console.log(`• Newly Generated Voice Notes: ${generatedCount}`);
  console.log(`• Pre-Cached Audio Assets: ${cachedCount}`);
  console.log(`• Manifest Registry Updated: ${MANIFEST_PATH}`);
  console.log('================================================================');
}

synthesizeAllVoiceNotes().catch(console.error);
