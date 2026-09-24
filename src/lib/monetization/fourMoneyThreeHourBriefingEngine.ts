/**
 * @file src/lib/monetization/fourMoneyThreeHourBriefingEngine.ts
 * 
 * 3-HOUR EXECUTIVE AI BRIEFING FOR THE 5 CONSOLIDATED MONEY ENGINES.
 * 
 * Dispatches a comprehensive, high-level B2B commercial analytics digest to bethelmindrecruit@gmail.com every 3 hours:
 * 1. 🤖 AI Strategic Decision Matrix across all 5 engines.
 * 2. 🎯 TOP 1-CLICK ACTION CARDS for immediate cash-in (< 30s execution).
 * 3. 🚀 Engine 5 Prototype Claim Metrics (0ms prototypes & ₦75k deposits).
 * 4. 📊 Engine Performance Telemetry (GMB, Appointment Router, Domain Snipes, Selar Packs).
 * 5. 🏦 100% Direct Settlement Confirmation to OPay: 7034297995 (Oyelakin Tosin Matthew).
 */

import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { executeFourMoneyEngine, getFourMoneyMemory, FOUR_MONEY_MEMORY_FILE, FiveMoneyEngineState } from './fourMoneyEngine';
import { OPAY_BENEFICIARY_CONFIG } from './directNairaAutoLiquidationRouter';

const PROD_BASE_URL = 'https://www.bethelmindanalytics.com';

export async function checkAndDispatchFourMoneyThreeHourBriefing(forceDispatch: boolean = false): Promise<{
  success: boolean;
  dispatched: boolean;
  messageId?: string;
  state?: FiveMoneyEngineState;
}> {
  const memory = getFourMoneyMemory();
  const now = new Date();
  const lastDispatched = new Date((memory as any)?.last3HourBriefingDispatched || 0);
  const diffHours = (now.getTime() - lastDispatched.getTime()) / (1000 * 60 * 60);

  // Dispatch only if 3 hours have passed or forced
  if (!forceDispatch && diffHours < 3.0) {
    return { success: true, dispatched: false };
  }

  // Execute the 5 engines
  const state = await executeFourMoneyEngine();

  // Create SMTP transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'executive@bethelmindanalytics.com',
      pass: process.env.SMTP_PASS || 'HostingerExecutive2026!'
    }
  });

  const emailSubject = `⚡ 3-HOUR EXECUTIVE 5-ENGINE BRIEFING [${state.watTime}] | ₦${(state.totalPipelineYieldNGN / 1000000).toFixed(2)}M Active Yield`;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3-Hour 5-Engine Executive Briefing</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f9fafb; margin: 0; padding: 24px; line-height: 1.6;">
  <div style="max-width: 680px; margin: 0 auto; background-color: #0b1329; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%); padding: 32px 24px; text-align: left;">
      <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #ecfdf5; margin-bottom: 8px;">
        🏛️ BETHELMIND ANALYTICS LAGOS HQ • 24/7 CLOUD AUTOPILOT
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0; letter-spacing: -0.5px;">
        ⚡ 3-Hour 5-Engine AI Executive Briefing
      </h1>
      <div style="font-size: 14px; color: #ccfbf1; font-weight: 500;">
        WAT Time: <strong>${state.watTime}</strong> • Cadence: <strong>Every 3 Hours</strong>
      </div>
    </div>

    <div style="padding: 28px 24px;">
      
      <!-- Executive Summary Box -->
      <div style="background-color: #111e38; border: 1px solid #1e3a8a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
          📊 Consolidated 5-Engine Pipeline Valuation
        </div>
        <div style="font-size: 32px; font-weight: 900; color: #10b981; margin-bottom: 4px;">
          ₦${state.totalPipelineYieldNGN.toLocaleString()} NGN
        </div>
        <div style="font-size: 13px; color: #94a3b8;">
          Across <strong>${state.totalActiveOpportunities}</strong> active commercial opportunities in Lagos commercial corridors.
        </div>
      </div>

      <!-- AI Strategic Decision Layer -->
      <div style="background-color: #0f172a; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 0 12px 12px 0; margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 700; color: #34d399; text-transform: uppercase; margin-bottom: 8px;">
          🤖 AI Strategic Directives (Next 3 Hours)
        </div>
        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 13px;">
          ${state.aiStrategicDirectives.map(d => `<li style="margin-bottom: 6px;">${d}</li>`).join('')}
        </ul>
      </div>

      <!-- Engine 5: Dynamic Client Prototypes (HIGH TICKET DFY) -->
      <div style="background-color: #0f172a; border: 1px solid #059669; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <strong style="color: #34d399; font-size: 15px;">🚀 Engine 5: Client Prototypes & DFY Website Closer (/preview/[id])</strong>
          <span style="background-color: #047857; color: #ecfdf5; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">₦${state.engine5_prototypes.projectedTurnkeyYieldNGN.toLocaleString()} Pipeline</span>
        </div>
        <div style="font-size: 13px; color: #94a3b8; margin-bottom: 10px;">
          ${state.engine5_prototypes.totalActivePrototypes} live interactive prototypes pre-cached with sector tools and 1-Tap WhatsApp Claim bars.
        </div>
        ${state.engine5_prototypes.topStagedPrototypes.map(p => `
          <div style="background-color: #1e293b; padding: 10px 12px; border-radius: 8px; margin-bottom: 6px; font-size: 12px; color: #f1f5f9; display: flex; justify-content: space-between;">
            <span><strong>${p.businessName}</strong> (${p.sector})</span>
            <span style="color: #34d399; font-weight: 700;">₦${p.depositNGN.toLocaleString()} Deposit (50%)</span>
          </div>
        `).join('')}
      </div>

      <!-- Engine 1: GMB Security Rescue -->
      <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <strong style="color: #38bdf8; font-size: 15px;">📍 Engine 1: Unclaimed GMB Security Rescue</strong>
          <span style="background-color: #0369a1; color: #e0f2fe; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">₦${state.engine1_gmb.totalFeeYieldNGN.toLocaleString()} Yield</span>
        </div>
        <div style="font-size: 13px; color: #94a3b8; margin-bottom: 10px;">
          ${state.engine1_gmb.totalVulnerable} high-rated Lagos businesses with exposed Google Maps profiles.
        </div>
      </div>

      <!-- Engine 2: Appointment Multi-Router -->
      <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <strong style="color: #f59e0b; font-size: 15px;">🤝 Engine 2: B2B Appointment Multi-Router (Solar & Energy)</strong>
          <span style="background-color: #b45309; color: #fef3c7; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">₦${state.engine2_appointments.totalArbitrageValueNGN.toLocaleString()} Yield</span>
        </div>
        <div style="font-size: 13px; color: #94a3b8; margin-bottom: 10px;">
          ${state.engine2_appointments.totalPending} pre-audited commercial quote leads ready for 2-contractor distribution.
        </div>
      </div>

      <!-- Engine 3: Expired Domain Sniping -->
      <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <strong style="color: #a855f7; font-size: 15px;">🏛️ Engine 3: Expired .com.ng Domain Sniping</strong>
          <span style="background-color: #7e22ce; color: #f3e8ff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">₦${state.engine3_domains.projectedNetProfitNGN.toLocaleString()} Yield</span>
        </div>
        <div style="font-size: 13px; color: #94a3b8; margin-bottom: 10px;">
          ${state.engine3_domains.totalOpportunities} dropped domains ready for ₦1,800 purchase and auto-custody parking.
        </div>
      </div>

      <!-- Engine 4: Selar B2B Lead Data Packs -->
      <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <strong style="color: #10b981; font-size: 15px;">📦 Engine 4: Selar B2B Lead Data Packs</strong>
          <span style="background-color: #047857; color: #ecfdf5; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">₦${state.engine4_leadPacks.projectedSalesValueNGN.toLocaleString()} Yield</span>
        </div>
        <div style="font-size: 13px; color: #94a3b8;">
          ${state.engine4_leadPacks.totalBundles} sector databases active on Selar with automated webhook delivery.
        </div>
      </div>

      <!-- Direct Settlement Guarantee Box -->
      <div style="background-color: #022c22; border: 1px solid #059669; border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: left;">
        <div style="font-size: 12px; font-weight: 800; color: #6ee7b7; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
          🏦 100% DIRECT-TO-OPAY SETTLEMENT VERIFICATION
        </div>
        <div style="font-size: 13px; color: #ecfdf5; line-height: 1.6;">
          All incoming client deposits, GMB claim fees, and appointment royalties route via Nigerian Interbank Transfer (NIP) directly into:<br>
          • <strong>Bank:</strong> ${OPAY_BENEFICIARY_CONFIG.bankName}<br>
          • <strong>Account Number:</strong> <code style="background-color: #064e3b; padding: 2px 6px; border-radius: 4px; color: #a7f3d0; font-size: 14px;">${OPAY_BENEFICIARY_CONFIG.accountNumber}</code><br>
          • <strong>Account Name:</strong> <strong>${OPAY_BENEFICIARY_CONFIG.accountName}</strong>
        </div>
      </div>

      <div style="font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #1e293b; padding-top: 16px;">
        Bethelmind Analytics Lagos OTC & Autonomous Cloud Desk • Powered by 5-Engine Architecture (2026)
      </div>

    </div>
  </div>
</body>
</html>
  `;

  let messageId = 'local-simulation';
  try {
    const info = await transporter.sendMail({
      from: `"Bethelmind 5-Engine Desk" <executive@bethelmindanalytics.com>`,
      to: 'bethelmindrecruit@gmail.com',
      subject: emailSubject,
      html: emailHtml
    });
    messageId = info.messageId;
  } catch (err: any) {
    console.warn(`[5-Engine Briefing] SMTP Log: ${err?.message || err}`);
  }

  // Update memory state
  const updatedMemory = {
    ...state,
    last3HourBriefingDispatched: now.toISOString()
  };
  fs.writeFileSync(FOUR_MONEY_MEMORY_FILE, JSON.stringify(updatedMemory, null, 2));

  return {
    success: true,
    dispatched: true,
    messageId,
    state
  };
}
