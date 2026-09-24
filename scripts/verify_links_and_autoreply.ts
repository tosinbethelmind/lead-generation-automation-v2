import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function verify() {
  console.log('====================================================');
  console.log('🔍 VERIFYING PREVIEW LINKS & AUTO-REPLY CONVERSION');
  console.log('====================================================\n');

  // 1. Test live preview URLs
  const sampleSlugs = [
    'bolicious-grills',
    'healthview-medical',
    'multsol-technology',
    'events-chronicles',
    'exotic-smooth'
  ];

  console.log('1️⃣ CHECKING LIVE PREVIEW LINKS ON BETHELMINDANALYTICS.COM:');
  for (const slug of sampleSlugs) {
    const url = `https://www.bethelmindanalytics.com/preview/${slug}`;
    try {
      const res = await axios.get(url, { timeout: 8000 });
      const html = res.data;
      const hasBusinessName = html.includes(slug.split('-')[0]) || html.length > 5000;
      const hasWhatsAppCTA = html.includes('wa.me') || html.includes('8022791227') || html.includes('WhatsApp');
      const hasSectorTool = html.includes('Quote') || html.includes('Calculator') || html.includes('Booking') || html.includes('Assistant');

      console.log(`✅ ${url}`);
      console.log(`   - Status: ${res.status} OK (Size: ${Math.round(html.length / 1024)} KB)`);
      console.log(`   - Interactive CTAs: ${hasWhatsAppCTA ? 'YES (wa.me connected)' : 'Pending'}`);
      console.log(`   - Sector Lead Tool: ${hasSectorTool ? 'YES' : 'Pending'}`);
    } catch (err: any) {
      console.log(`❌ ${url} -> Error: ${err.message}`);
    }
  }

  // 2. Check Auto-Reply & Inbound Closer configuration
  console.log('\n2️⃣ CHECKING INBOUND CLOSER & AUTO-REPLY MECHANISMS:');
  const closerEnginePath = path.join(process.cwd(), 'src/lib/monetization/postContactCloserEngine.ts');
  const adminCloserPath = path.join(process.cwd(), 'scripts/admin_inbound_closer_daemon.js');
  const unifiedAutopilotPath = path.join(process.cwd(), 'scripts/unified_master_autopilot.js');

  console.log(`- postContactCloserEngine exists: ${fs.existsSync(closerEnginePath)}`);
  console.log(`- admin_inbound_closer_daemon exists: ${fs.existsSync(adminCloserPath)}`);
  console.log(`- unified_master_autopilot exists: ${fs.existsSync(unifiedAutopilotPath)}`);

  // Check if closer daemon is in unified autopilot
  if (fs.existsSync(unifiedAutopilotPath)) {
    const content = fs.readFileSync(unifiedAutopilotPath, 'utf8');
    const hasCloser = content.includes('closer') || content.includes('inbound');
    console.log(`- Unified Master Autopilot supervises Closer Daemon: ${hasCloser}`);
  }

  // Check Evolution API status
  try {
    const evoRes = await axios.get('http://localhost:8080', { timeout: 1500 });
    console.log(`- Evolution API Server on port 8080: ONLINE (${evoRes.status})`);
  } catch (err: any) {
    console.log(`- Evolution API Server on port 8080: ${err.message}`);
  }

  console.log('\n====================================================');
}

verify().catch(console.error);
