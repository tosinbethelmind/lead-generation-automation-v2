/**
 * @file scripts/dispatch_sample_outreach_test.ts
 * 
 * DISPATCHES A COMPLETE LIVE SAMPLE TO ADMIN EMAIL & SMS FOR REVIEW.
 * - Admin Email: bethelmindrecruit@gmail.com
 * - Admin SMS / Phone: +234 802 279 1227 (0802 279 1227)
 */

import { dispatchSecureEmail } from '../src/lib/monetization/smtpTransporterPool';
import { sendAdminWhatsAppNotification, ADMIN_PHONE_E164 } from '../src/lib/monetization/adminWhatsAppNotifier';
import { SECTOR_CAMPAIGN_MATRIX } from './generate_category_matched_outreach_matrix';

async function dispatchSampleOutreach() {
  console.log('========================================================================');
  console.log('🚀 DISPATCHING LIVE SAMPLE OUTREACH TO ADMIN EMAIL & SMS');
  console.log('========================================================================\n');

  // Sample Lead Representation
  const sampleLead = {
    name: 'Macmed Integrated Commercial Hub',
    area: 'Satellite Town, Lagos',
    previewUrl: 'https://www.bethelmindanalytics.com/preview/macmed-integrated-lagos',
    category: 'Commercial Enterprise & Logistics'
  };

  const campaign = SECTOR_CAMPAIGN_MATRIX.SOLAR;
  const sampleSmsText = `Good day Management at ${sampleLead.name}! We pre-built a 24/7 AI WhatsApp quote & booking portal for your ${sampleLead.area} business. Test drive free: ${sampleLead.previewUrl} (08022791227)`;

  console.log(`1. Dispatching Sample SMS to Admin Phone (${ADMIN_PHONE_E164})...`);
  const smsResult = await sendAdminWhatsAppNotification(sampleSmsText);
  console.log(`   📲 SMS Dispatch Result: ${smsResult.channel} (Success: ${smsResult.success})`);

  console.log(`\n2. Dispatching Rich HTML Sample Email to bethelmindrecruit@gmail.com...`);
  const emailHtml = campaign.emailBodyHtml(sampleLead);
  
  const emailResult = await dispatchSecureEmail({
    to: 'bethelmindrecruit@gmail.com',
    subject: `[SAMPLE OUTREACH] Automating 24/7 AI Quotes & Booking for ${sampleLead.name}`,
    htmlContent: emailHtml
  });
  console.log(`   📧 Email Dispatch Result: Success: ${emailResult.success}`);

  console.log('\n========================================================================');
  console.log('🎉 SAMPLE DISPATCH COMPLETED!');
  console.log('• Admin Email: bethelmindrecruit@gmail.com');
  console.log('• Admin Phone/SMS: 0802 279 1227 (+234 802 279 1227)');
  console.log('• Preview URL: https://www.bethelmindanalytics.com/preview/macmed-integrated-lagos');
  console.log('========================================================================\n');
}

dispatchSampleOutreach().catch(console.error);
