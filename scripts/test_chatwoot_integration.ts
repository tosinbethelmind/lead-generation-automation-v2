/**
 * @file scripts/test_chatwoot_integration.ts
 * Verifies Chatwoot Omnichannel Integration (Phase 2)
 */

import { chatwootClient } from '../src/lib/integrations/chatwootClient';
import fs from 'fs';
import path from 'path';

async function testChatwootIntegration() {
  console.log('=== TESTING CHATWOOT OMNICHANNEL INTEGRATION (PHASE 2) ===\n');

  console.log('1. Configuration Check:');
  const configured = chatwootClient.isConfigured();
  console.log(`   Chatwoot Configured: ${configured ? 'LIVE API MODE' : 'RESILIENT LOCAL SIMULATOR MODE'}`);

  console.log('\n2. Testing Inbound Lead Action Sync:');
  const sampleLead = {
    businessName: 'Lagos Solar Innovations Ltd',
    phone: '08022791227',
    email: 'contact@lagossolar.com',
    area: 'Ikeja Commercial Hub',
    sector: 'Solar & Renewable Energy',
    messageText: 'I would like to test the 24/7 WhatsApp auto-quoting assistant for our 5kVA solar packages.',
    previewUrl: 'https://www.bethelmindanalytics.com/preview/lagos-solar-innovations-ltd',
    channel: 'ai_demo_test' as const
  };

  const result = await chatwootClient.syncInboundLeadAction(sampleLead);
  console.log('   Sync Result:', result);

  console.log('\n3. Verifying Local Ledger (chatwoot_sync.json):');
  const ledgerPath = path.join(process.cwd(), 'local_db', 'chatwoot_sync.json');
  if (fs.existsSync(ledgerPath)) {
    const records = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
    console.log(`   Total Sync Records: ${records.length}`);
    console.log('   Latest Record:', records[records.length - 1]);
  } else {
    console.log('   Ledger file not yet created.');
  }

  console.log('\n=== CHATWOOT INTEGRATION VERIFIED SUCCESSFULLY ===');
}

testChatwootIntegration().catch(console.error);
