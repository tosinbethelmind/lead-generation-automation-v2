import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getAdminUser } from '../src/lib/auth';
import {
  initializeCheckout,
  approveManualTransferOrder,
  retryOpenFulfilmentExceptions,
  verifyPaystackSignature,
  verifySelarSignature,
} from '../src/lib/commerce/paymentOrchestrator';
import { getLedgerSummary, getOrderByReference } from '../src/lib/commerce/ledger';
import { createEnquiry, validateNigerianPhone, updateEnquiryStatus } from '../src/lib/commerce/enquiries';
import { canSendCompliantWhatsApp, recordWhatsAppConsent } from '../src/lib/commerce/whatsappCompliance';

async function main() {
  // 1. Auth hardening
  process.env.ADMIN_TOKEN = 'verify_secure_token';
  assert.equal(getAdminUser('bethelmind_admin_2026'), null);
  assert.equal(getAdminUser('verify_secure_token')?.role, 'super_admin');

  // 2. Signature guards
  process.env.PAYSTACK_SECRET_KEY = 'sk_test_verify_key';
  const body = JSON.stringify({ event: 'charge.success' });
  const sig = crypto.createHmac('sha512', 'sk_test_verify_key').update(body).digest('hex');
  assert.equal(verifyPaystackSignature(body, sig), true);
  assert.equal(verifyPaystackSignature(body, 'bad'), false);
  assert.equal(verifySelarSignature(body, new Headers()).valid, false);

  // 3. Google Ads Enquiry -> Validation -> Lead Pipeline
  const phone = validateNigerianPhone('0803 555 0199');
  assert.equal(phone.valid, true);
  const enq = await createEnquiry({
    name: 'Automation Test Client',
    whatsapp: phone.normalized,
    selectedService: 'Business Website Development',
    selectedPackage: 'BUSINESS LAUNCH',
    agreedPriceNgn: 80000,
    gclid: 'GCLID_AUTO_TEST',
  });
  const updatedEnq = await updateEnquiryStatus(enq.id, 'PAID');
  assert.equal(updatedEnq?.status, 'PAID');

  // 4. Division 1 Website Order -> Manual Approval -> Project Created
  const d1 = await initializeCheckout({
    productId: 'dbs-business-launch',
    customerName: 'D1 Client',
    customerEmail: 'd1@example.com',
    paymentProvider: 'moniepoint',
    callbackOrigin: 'http://localhost:3006',
  });
  await approveManualTransferOrder(d1.orderReference, 48000, 'Verified');
  assert.equal((await getOrderByReference(d1.orderReference))?.fulfilmentStatus, 'in_progress');

  // 5. Division 2 Automation Order -> Project + Monthly Maintenance Subscription Created
  const d2 = await initializeCheckout({
    productId: 'ba-basic-setup',
    customerName: 'D2 Client',
    customerEmail: 'd2@example.com',
    paymentProvider: 'moniepoint',
    callbackOrigin: 'http://localhost:3006',
  });
  await approveManualTransferOrder(d2.orderReference, 60000, 'Verified');
  assert.ok(getLedgerSummary().activeSubscriptionsCount >= 1, 'Monthly subscription created');

  // 6. Division 3 BI Research Order -> Auto-generates Excel + PDF Drafts
  const d3 = await initializeCheckout({
    productId: 'bi-market-snapshot',
    customerName: 'D3 Client',
    customerEmail: 'd3@example.com',
    paymentProvider: 'moniepoint',
    callbackOrigin: 'http://localhost:3006',
  });
  await approveManualTransferOrder(d3.orderReference, 25000, 'Verified');
  const biDir = path.join(process.cwd(), 'local_db', 'bi_reports', d3.orderReference);
  assert.ok(fs.existsSync(path.join(biDir, 'report.xlsx')), 'BI Excel draft generated');
  assert.ok(fs.existsSync(path.join(biDir, 'report.pdf')), 'BI PDF draft generated');

  // 7. WhatsApp Opt-Out Compliance & Exception Retry Runner
  await recordWhatsAppConsent('08035550199', 'opted_out');
  assert.equal(canSendCompliantWhatsApp('08035550199').allowed, false);
  const retryRes = await retryOpenFulfilmentExceptions();
  assert.equal(typeof retryRes.attempted, 'number');

  console.log('FULL_COMMERCE_AUTOMATION_VERIFIED');
}

main().catch((err) => {
  console.error('AUTOMATION_VERIFY_FAILED:', err);
  process.exit(1);
});
