/**
 * @file scripts/dispatch_hot_openers_followup.ts
 * BETHELMIND DIGITAL SOLUTIONS (RC 7034297)
 * High-Intent Follow-Up Dispatcher for Verified Leads Who Opened Today's Proposal
 * Delivers the 2026 Alaba Direct Wholesale Directory + Custom Live Preview Link
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import fs from 'fs';
import path from 'path';
import { multiSmtpPooler } from '../src/lib/email/multiSmtpPooler';

const ROOT_DIR = process.cwd();
const JOURNEYS_PATH = path.join(ROOT_DIR, 'local_db/lead_journeys.json');
const LEADS_PATH = path.join(ROOT_DIR, 'local_db/leads_db.json');
const FOLLOWUP_LOG = path.join(ROOT_DIR, 'local_db/hot_openers_followup_log.json');

async function main() {
  console.log('========================================================================');
  console.log('🔥 BETHELMIND HIGH-INTENT OPENERS FOLLOW-UP DISPATCHER');
  console.log('   Targeting Verified Nigerian SMEs Who Opened Today\'s Proposal');
  console.log('========================================================================\n');

  if (!fs.existsSync(JOURNEYS_PATH) || !fs.existsSync(LEADS_PATH)) {
    console.error('Lead databases missing.');
    return;
  }

  const journeys = JSON.parse(fs.readFileSync(JOURNEYS_PATH, 'utf8'));
  const leads = JSON.parse(fs.readFileSync(LEADS_PATH, 'utf8'));
  const leadsById: Record<string, any> = {};
  leads.forEach((l: any) => { leadsById[l.id || l.lead_id] = l; });

  let sentLog: Record<string, string> = {};
  if (fs.existsSync(FOLLOWUP_LOG)) {
    try { sentLog = JSON.parse(fs.readFileSync(FOLLOWUP_LOG, 'utf8')); } catch (_) {}
  }

  const hotTargets: any[] = [];

  for (const [id, j] of Object.entries(journeys) as [string, any][]) {
    const hasOpen = (j.events || []).some((e: any) => e.stage === 'EMAIL_OPENED');
    if (hasOpen && j.email && !sentLog[j.email]) {
      const orig = leadsById[id] || {};
      const cleanEmail = multiSmtpPooler.sanitizeEmail(j.email);
      if (cleanEmail) {
        hotTargets.push({
          id,
          email: cleanEmail,
          business_name: orig.business_name || orig.name || j.business_name || 'Business Owner',
          phone: j.phone || orig.phone || '',
          category: orig.category || 'Commercial Enterprise',
          area: orig.area || orig.city || 'Lagos',
          slug: orig.previewSlug || id
        });
      }
    }
  }

  console.log(`Found ${hotTargets.length} hot openers pending high-value follow-up.`);
  if (hotTargets.length === 0) {
    console.log('All hot openers have already been followed up. Standing by.');
    return;
  }

  // Bounded safe batch of 15 to respect rate limits
  const batch = hotTargets.slice(0, 15);
  console.log(`Dispatching high-value follow-up batch of ${batch.length} leads...\n`);

  for (const target of batch) {
    const previewUrl = `https://www.bethelmindanalytics.com/preview/${target.slug}`;
    const subject = `Following up on ${target.business_name}: 2026 Alaba Wholesale Price Sheet & Custom Prototype`;

    const htmlBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
  <div style="background: linear-gradient(135deg, #0f172a, #1e1b4b); padding: 24px; border-radius: 16px; color: #ffffff;">
    <span style="background: rgba(6, 182, 212, 0.2); color: #22d3ee; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Direct Executive Follow-Up</span>
    <h2 style="color: #ffffff; margin-top: 12px; margin-bottom: 8px; font-size: 20px;">Hello Boss / Management at ${target.business_name},</h2>
    <p style="color: #cbd5e1; font-size: 13px; margin: 0;">We noticed your team opened our earlier note regarding the missing official website for ${target.business_name}.</p>
  </div>

  <div style="padding: 20px 0;">
    <p style="font-size: 14px;">Rather than asking you to wait weeks or spend millions on web agencies, we already set up your <strong>Official Mobile Website & 24/7 WhatsApp AI Closer</strong> ready to test free on your phone:</p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${previewUrl}" style="background: #059669; color: #ffffff; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 14px; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4);">
        👉 Check ${target.business_name} Prototype Free (₦0)
      </a>
    </div>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
      <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;">🎁 Bonus Confidential Asset Delivered to Your Desk:</h4>
      <p style="font-size: 13px; color: #475569; margin: 0;">
        If your business does solar, construction, or auto imports, we also compiled the <strong>2026 Alaba & Trade Fair Wholesale Importer Directory</strong> with direct phone numbers of verified CATL cell & Tier-1 Growatt distributors. You can request it free on WhatsApp below.
      </p>
    </div>

    <h4 style="color: #0f172a; font-size: 14px; margin-bottom: 8px;">2 Simple Ways to Activate Your Page:</h4>
    <ul style="font-size: 13px; color: #334155; padding-left: 20px;">
      <li><strong>Option 1 (Starter Go-Live):</strong> ₦35,000 one-time (or ₦25,000/mo) — Launches your mobile site + WhatsApp AI closer today.</li>
      <li><strong>Option 2 (Full Turnkey Suite):</strong> ₦75,000 deposit (₦150,000 total) — Dedicated .com or .com.ng custom domain ready in 48 hours.</li>
    </ul>

    <p style="font-size: 13px; color: #64748b; margin-top: 16px;">
      All corporate settlements route strictly to our CAC Certified corporate account: <strong>Moniepoint Microfinance Bank · 6805375225 · Bethelmind Digital Solutions</strong>.
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <a href="https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Tosin! I reviewed the sample website for ${target.business_name} and would like to activate it.`)}" style="background: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 13px; text-decoration: none; display: inline-block;">
        💬 Chat on WhatsApp with Closer Desk (0802 279 1227)
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

    <p style="font-size: 12px; color: #94a3b8; margin: 0;">
      <strong>Tosin Oyelakin</strong><br />
      Bethelmind Digital Solutions (CAC Certified Enterprise RC 7034297)<br />
      Victoria Island Commercial Corridor, Lagos<br />
      WhatsApp / Phone Hotline: 0802 279 1227
    </p>
  </div>
</div>
`;

    try {
      const res = await multiSmtpPooler.dispatch({
        email: target.email,
        name: target.business_name,
        business_name: target.business_name,
        category: target.category,
        area: target.area,
        lead_id: target.slug
      });

      if (res.success) {
        console.log(`✓ Follow-up delivered to: ${target.business_name} (${target.email}) via ${res.provider}`);
        sentLog[target.email] = new Date().toISOString();
      } else {
        console.warn(`✗ Failed sending to: ${target.business_name} (${target.email}): ${res.error}`);
      }
    } catch (err: any) {
      console.error(`Error sending to ${target.email}:`, err.message);
    }

    // Gentle 1.5s jitter between dispatches
    await new Promise(r => setTimeout(r, 1500));
  }

  fs.writeFileSync(FOLLOWUP_LOG, JSON.stringify(sentLog, null, 2), 'utf8');
  console.log('\nFollow-up batch completed and recorded in local_db/hot_openers_followup_log.json.');
}

if (require.main === module) {
  main().catch(console.error);
}
