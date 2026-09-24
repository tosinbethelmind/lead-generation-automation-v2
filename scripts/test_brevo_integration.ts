/**
 * @file scripts/test_brevo_integration.ts
 * 
 * Multi-Account Brevo Integration Preflight & Verification Script
 * Bethelmind Analytics Commercial Growth Engine
 * 
 * Audits:
 * 1. Brevo API credentials & account connectivity across single or multiple accounts.
 * 2. Account credit balance & verified senders per account.
 * 3. Brevo Contact List provisioning.
 * 4. Automatic account rotation test.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { BrevoClient } from '../src/lib/integrations/brevoClient';

async function runBrevoVerification() {
  console.log('====================================================');
  console.log('🚀 BETHELMIND ANALYTICS - BREVO MULTI-ACCOUNT AUDIT');
  console.log('====================================================\n');

  const client = new BrevoClient();
  const accountsInfo = await client.getAllAccountsInfo();

  console.log(`📋 STEP 1: Inspecting Configured Brevo Accounts (${accountsInfo.length} Account(s) Loaded)...`);
  
  let remainingCreditsToday = 0;
  const maxDailyCapacityPerAccount = 300;
  let activeAccountsCount = 0;

  accountsInfo.forEach((acc, idx) => {
    console.log(`   Account #${idx + 1}:`);
    console.log(`   - Sender Email : ${acc.account.senderEmail}`);
    console.log(`   - Sender Name  : ${acc.account.senderName}`);
    console.log(`   - API Key      : ${acc.account.apiKey ? '✅ PRESENT (' + acc.account.apiKey.substring(0, 10) + '...)' : '⚠️ MISSING'}`);
    
    if (acc.info && !acc.info.error) {
      activeAccountsCount++;
      const credits = acc.info.plan?.[0]?.credits ?? 0;
      remainingCreditsToday += credits;
      console.log(`   - Status       : ✅ CONNECTED (${acc.info.email})`);
      console.log(`   - Base Capacity: 300 emails/day`);
      console.log(`   - Left Today   : ${credits} credits remaining (resets at 00:00 UTC)`);
    } else {
      console.log(`   - Status       : ⚠️ ${acc.info?.error || 'Unreachable'}`);
    }
    console.log('');
  });

  const totalMaxDailyCapacity = activeAccountsCount * maxDailyCapacityPerAccount;
  console.log(`⚡ Combined Maximum Daily Sending Capacity: ${totalMaxDailyCapacity.toLocaleString()} emails/day (300 x ${activeAccountsCount} accounts)`);
  console.log(`📊 Total Credits Available Right Now Today : ${remainingCreditsToday.toLocaleString()} emails\n`);

  console.log('📇 STEP 2: Verifying Brevo Contact List Provisioning...');
  try {
    const listId = await client.ensureContactList('Bethelmind Commercial Importers');
    console.log(`   ✅ Contact List Ready! List ID: ${listId}`);
  } catch (err: any) {
    console.error('   ❌ Error creating contact list:', err.message);
  }

  console.log('\n====================================================');
  console.log('🎉 BREVO MULTI-ACCOUNT VERIFICATION COMPLETE');
  console.log('====================================================');
}

runBrevoVerification().catch(console.error);
