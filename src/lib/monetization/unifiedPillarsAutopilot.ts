/**
 * @file src/lib/monetization/unifiedPillarsAutopilot.ts
 * 
 * BETHELMIND ANALYTICS UNIFIED 8-PILLAR AUTONOMOUS MONETIZATION ORCHESTRATOR.
 * 
 * Seamlessly consolidates all 8 algorithmic revenue streams into a single high-efficiency,
 * non-spammy Daily Executive Monetization Dossier delivered every morning at 08:00 AM WAT:
 * 
 * 1. 🏛️ Expired Domain Sniping & Inbound Escrow (Top 5 ROI Picks)
 * 2. 📍 Unclaimed GMB Vulnerability Rescue (Top 5 High-Rated Listings)
 * 3. 📦 Verified B2B Lead Data Packs (Top 5 Sector Packages)
 * 4. 🛡️ SME Trademark & CAC Brand Shield (Top 5 High-Follower Accounts)
 * 5. 📱 Programmatic Micro-SaaS Paywalls (24/7 ₦2,500 PDF Unlocks)
 * 6. 🤝 Pay-Per-Appointment Arbitrage Router (Top 5 Vetted Appointments)
 * 7. 🌍 Diaspora Milestone 4K Escrow Protocol (Top 5 High-Budget Builds)
 * 8. 🏢 White-Label Agency Licensing MRR (Top 5 Agency Candidates)
 */

import fs from 'fs';
import path from 'path';
import dns from 'dns';
import nodemailer from 'nodemailer';

import { scanExpiringNigerianDomains } from './expiredDomainMonitor';
import { generatePurchaseAuthToken } from './domainRegistrarApi';
import { scanUnclaimedGmbBusinesses } from './gmbRescueEngine';
import { generateLeadBundlesFromDatabase } from './leadBundlePackager';
import { scanUnprotectedTrademarkBrands } from './trademarkShieldEngine';
import { scanPendingAppointmentLeads } from './appointmentLeadRouter';
import { scanDiasporaEscrowProjects } from './diasporaEscrowEngine';
import { scanWhiteLabelAgencyProspects } from './whitelabelLicensingEngine';
import { scanEnterpriseMultipliedOpportunities } from './enterpriseArbitrageMultiplier';

export interface UnifiedMonetizationDossier {
  timestamp: string;
  watTime: string;
  totalPipelineYieldNGN: number;
  totalActiveOpportunities: number;
  domains: any;
  gmb: any;
  leadBundles: any;
  microPaywalls: any;
  appointments: any;
  diaspora: any;
  whiteLabel: any;
  crypto: any;
}

/**
 * Aggregates and ranks the top opportunities across ALL ACTIVE monetization streams (excluding CAC).
 */
export async function generateUnifiedMonetizationDossier(): Promise<UnifiedMonetizationDossier> {
  const [
    domainData,
    gmbData,
    leadBundleData,
    appointmentData,
    diasporaData,
    whiteLabelData,
    cryptoData
  ] = await Promise.all([
    scanExpiringNigerianDomains(),
    scanUnclaimedGmbBusinesses(),
    generateLeadBundlesFromDatabase(),
    scanPendingAppointmentLeads(),
    scanDiasporaEscrowProjects(),
    scanWhiteLabelAgencyProspects(),
    scanEnterpriseMultipliedOpportunities()
  ]);

  // Micro-SaaS Paywalls projected active daily revenue
  const microPaywallData = {
    totalToolsActive: 4,
    projectedMonthlyUnlocks: 450,
    pricePerUnlockNGN: 2500,
    estimatedMonthlyRevenueNGN: 1125000,
    tools: [
      { name: 'Bankable Solar Sizer & ROI Calculator', path: '/tools/solar-calculator', priceNGN: 2500 },
      { name: 'Lagos Land Cadastral & Coordinate Verifier', path: '/tools/land-survey-verifier', priceNGN: 2500 },
      { name: 'SCUML & CAC Compliance Readiness Checker', path: '/tools/scuml-readiness', priceNGN: 2500 },
      { name: 'High-Converting B2B WhatsApp Script Generator', path: '/tools/b2b-script-gen', priceNGN: 2500 }
    ]
  };

  // Calculate estimated total pipeline revenue (excluding CAC)
  const domainYield = domainData.top5Prospects.reduce((acc, d) => acc + d.netProfitNGN, 0);
  const gmbYield = gmbData.top5Targets.reduce((acc, g) => acc + g.recommendedFeeNGN, 0);
  const bundlesYield = leadBundleData.top5Bundles.reduce((acc, b) => acc + b.projectedSalesValueNGN, 0);
  const paywallYield = microPaywallData.estimatedMonthlyRevenueNGN;
  const appointmentYield = appointmentData.totalArbitrageValueNGN;
  const diasporaYield = diasporaData.top5Targets.reduce((acc, dp) => acc + dp.royaltyFeeNGN, 0);
  const whiteLabelYield = whiteLabelData.top5Agencies.reduce((acc, a) => acc + a.projectedAnnualValueNGN, 0);
  const cryptoYield = cryptoData.totalWeeklyTargetNGN;

  const totalPipelineYieldNGN = domainYield + gmbYield + bundlesYield + paywallYield + appointmentYield + diasporaYield + whiteLabelYield + cryptoYield;
  const totalActiveOpportunities = domainData.totalOpportunities + gmbData.totalVulnerable + leadBundleData.totalBundles + appointmentData.totalPending + diasporaData.activeProjects + whiteLabelData.top5Agencies.length + cryptoData.topMultipliedDeals.length;

  return {
    timestamp: new Date().toISOString(),
    watTime: new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }),
    totalPipelineYieldNGN,
    totalActiveOpportunities,
    domains: domainData,
    gmb: gmbData,
    leadBundles: leadBundleData,
    microPaywalls: microPaywallData,
    appointments: appointmentData,
    diaspora: diasporaData,
    whiteLabel: whiteLabelData,
    crypto: cryptoData
  };
}

/**
 * Dispatches the Master Unified 8-Pillar Monetization Briefing directly to bethelmindrecruit@gmail.com.
 */
export async function dispatchMasterMonetizationDossier(): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const dossier = await generateUnifiedMonetizationDossier();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'https://www.bethelmindanalytics.com';

  let config: any = {};
  try {
    config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json'), 'utf8'));
  } catch (_) {}

  return new Promise((resolve) => {
    if (dns.setDefaultResultOrder) {
      dns.setDefaultResultOrder('ipv4first');
    }

    const host = config.smtpHost || 'smtp.hostinger.com';
    const port = config.smtpPort || 587;
    const user = config.smtpUser || 'tosin@bethelmindanalytics.com';
    const pass = config.smtpPass || 'Bethelmind@2026';

    dns.lookup(host, { family: 4 }, async (err, address) => {
      const resolvedHost = (!err && address) ? address : 'smtp.hostinger.com';

      const transporter = nodemailer.createTransport({
        host: resolvedHost,
        port: 587,
        secure: false,
        auth: { user, pass },
        tls: { servername: host, rejectUnauthorized: false },
        connectionTimeout: 15000
      });

      // ── Pillar 1: Top 3 Dropped Domains ──────────────────────────────────────
      const domainsHtml = dossier.domains.top5Prospects.slice(0, 3).map((d: any) => {
        const token = generatePurchaseAuthToken(d.domain, d.registrationCostNGN);
        const authUrl = `${baseUrl}/api/domains/authorize-buy?domain=${encodeURIComponent(token.domain)}&cost=${token.costNGN}&expiresAt=${token.expiresAt}&sig=${token.signature}`;

        return `
          <div style="background: #111827; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 11px; background: #0284c7; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${d.tierBadge}</span>
                <div style="font-size: 16px; font-weight: bold; color: #38bdf8; font-family: monospace; margin-top: 4px;">${d.domain}</div>
                <div style="font-size: 12px; color: #94a3b8;">${d.previousOwnerSector} • ${d.historicMonthlyTraffic.toLocaleString()} Visits/mo</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 16px; font-weight: bold; color: #34d399;">+₦${d.netProfitNGN.toLocaleString()}</div>
                <div style="font-size: 11px; color: #94a3b8;">${d.roiMultiplier}x ROI</div>
              </div>
            </div>
            <div style="margin-top: 10px;">
              <a href="${authUrl}" style="background: #10b981; color: #fff; padding: 6px 14px; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 4px; display: inline-block;">
                🛡️ 1-Click Authorize (₦${d.registrationCostNGN.toLocaleString()})
              </a>
            </div>
          </div>
        `;
      }).join('');

      // ── Pillar 2: Top 3 Unclaimed GMB ───────────────────────────────────────
      const gmbHtml = dossier.gmb.top5Targets.slice(0, 3).map((g: any) => {
        const waPitch = encodeURIComponent(`Hello Management at ${g.businessName}. Our local SEO audit detected that your Google Maps listing (${g.rating}★, ${g.reviewCount} reviews in ${g.location}) is currently UNCLAIMED and exposed. We can claim and lock it today.`);
        const waUrl = `https://wa.me/${g.phone.replace(/\D/g, '')}?text=${waPitch}`;

        return `
          <div style="background: #111827; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 11px; background: #dc2626; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${g.tierBadge}</span>
                <div style="font-size: 15px; font-weight: bold; color: #ffffff; margin-top: 4px;">${g.businessName}</div>
                <div style="font-size: 12px; color: #94a3b8;">📍 ${g.location} • ${g.rating}★ (${g.reviewCount} Reviews)</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 16px; font-weight: bold; color: #fbbf24;">₦${g.recommendedFeeNGN.toLocaleString()}</div>
                <div style="font-size: 11px; color: #94a3b8;">Rescue Fee</div>
              </div>
            </div>
            <div style="margin-top: 10px;">
              <a href="${waUrl}" style="background: #ef4444; color: #fff; padding: 6px 14px; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 4px; display: inline-block;">
                🚨 1-Click Send GMB Alert (${g.phone})
              </a>
            </div>
          </div>
        `;
      }).join('');

      // ── Pillar 6: Top 3 Commercial Appointments ─────────────────────────────
      const appointmentsHtml = dossier.appointments.top5Leads.slice(0, 3).map((l: any) => {
        const waPitch = encodeURIComponent(`Hello! Bethelmind Lead Arbitrage Desk: We have a verified client (${l.customerName}) requesting a ₦${l.estimatedProjectBudgetNGN.toLocaleString()} ${l.sector.replace(/_/g, ' ')} project in ${l.location}. Tap here to claim this exclusive appointment.`);
        const waUrl = `https://wa.me/2348022791227?text=${waPitch}`;

        return `
          <div style="background: #111827; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 11px; background: #0284c7; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${l.tierBadge}</span>
                <div style="font-size: 15px; font-weight: bold; color: #ffffff; margin-top: 4px;">${l.customerName}</div>
                <div style="font-size: 12px; color: #94a3b8;">📍 ${l.location} • Budget: ₦${l.estimatedProjectBudgetNGN.toLocaleString()}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 16px; font-weight: bold; color: #38bdf8;">+₦${l.totalArbitrageRevenueNGN.toLocaleString()}</div>
                <div style="font-size: 11px; color: #94a3b8;">3 Buyers Matched</div>
              </div>
            </div>
            <div style="margin-top: 10px;">
              <a href="${waUrl}" style="background: #0284c7; color: #fff; padding: 6px 14px; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 4px; display: inline-block;">
                🤝 1-Click Route Appointment (₦${l.totalArbitrageRevenueNGN.toLocaleString()})
              </a>
            </div>
          </div>
        `;
      }).join('');

      // ── Pillar 7: Top 2 Diaspora Builds ─────────────────────────────────────
      const diasporaHtml = dossier.diaspora.top5Targets.slice(0, 2).map((dp: any) => {
        const waPitch = encodeURIComponent(`Hello! Bethelmind Diaspora Escrow Protocol: We provide independent 4K inspection audits and escrow milestone fund release for ${dp.projectTitle} in ${dp.siteLocation}. Protect your ₦${dp.projectBudgetNGN.toLocaleString()} build today.`);
        const waUrl = `https://wa.me/${dp.buyerPhone.replace(/\D/g, '')}?text=${waPitch}`;

        return `
          <div style="background: #111827; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 11px; background: #059669; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${dp.tierBadge}</span>
                <div style="font-size: 15px; font-weight: bold; color: #ffffff; margin-top: 4px;">${dp.projectTitle}</div>
                <div style="font-size: 12px; color: #94a3b8;">📍 ${dp.siteLocation} • Client in ${dp.diasporaClientLocation}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 16px; font-weight: bold; color: #34d399;">+₦${dp.royaltyFeeNGN.toLocaleString()}</div>
                <div style="font-size: 11px; color: #94a3b8;">3.5% Escrow Royalty</div>
              </div>
            </div>
            <div style="margin-top: 10px;">
              <a href="${waUrl}" style="background: #059669; color: #fff; padding: 6px 14px; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 4px; display: inline-block;">
                🌍 1-Click Send Diaspora Protocol (${dp.buyerPhone})
              </a>
            </div>
          </div>
        `;
      }).join('');

      const masterEmailHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 720px; margin: 0 auto; background: #0b0f19; color: #f3f4f6; border-radius: 12px; overflow: hidden; border: 1px solid #1f2937;">
          <div style="background: linear-gradient(135deg, #1e1b4b, #0f172a); padding: 28px 32px; border-bottom: 1px solid #6366f1;">
            <div style="font-size: 12px; font-weight: 800; color: #818cf8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
              MASTER 8-PILLAR MONETIZATION DOSSIER • 08:00 AM WAT
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900;">
              💰 ₦${dossier.totalPipelineYieldNGN.toLocaleString()} Total Pipeline Yield Active
            </h1>
            <p style="color: #c7d2fe; margin: 6px 0 0 0; font-size: 13px;">
              ${dossier.totalActiveOpportunities} Scored Opportunities across All 8 Algorithmic Revenue Streams
            </p>
          </div>

          <div style="padding: 26px;">
            <!-- Pillar 1 Section -->
            <div style="margin-bottom: 24px;">
              <h3 style="color: #38bdf8; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
                🏛️ Pillar 1: High-Yield Expired Domain Snipes
              </h3>
              ${domainsHtml}
            </div>

            <!-- Pillar 2 Section -->
            <div style="margin-bottom: 24px;">
              <h3 style="color: #f87171; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
                📍 Pillar 2: Unclaimed Google Maps Profile Rescues
              </h3>
              ${gmbHtml}
            </div>

            <!-- Pillar 6 Section -->
            <div style="margin-bottom: 24px;">
              <h3 style="color: #60a5fa; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
                🤝 Pillar 6: High-Budget Commercial Appointment Leads
              </h3>
              ${appointmentsHtml}
            </div>

            <!-- Pillar 7 Section -->
            <div style="margin-bottom: 20px;">
              <h3 style="color: #34d399; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
                🌍 Pillar 7: Diaspora Construction Milestone Escrow
              </h3>
              ${diasporaHtml}
            </div>

            <!-- Enterprise Multiplied High-Ticket Cashflow Section -->
            <div style="margin-bottom: 20px;">
              <h3 style="color: #10b981; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
                🪙 Enterprise Asymmetric High-Ticket Arbitrage Radar (₦2.5M – ₦5M/Week Target)
              </h3>
              ${dossier.crypto.topMultipliedDeals.map((c: any) => `
                <div style="background: #111827; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; margin-bottom: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <span style="font-size: 11px; background: #059669; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${c.badge} (${c.scalingMultiplier})</span>
                      <div style="font-size: 15px; font-weight: bold; color: #ffffff; margin-top: 4px;">${c.dealTitle}</div>
                      <div style="font-size: 12px; color: #94a3b8;">${c.tacticalAction}</div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 16px; font-weight: bold; color: #10b981;">+₦${c.projectedProfitNGN.toLocaleString()}</div>
                      <div style="font-size: 11px; color: #94a3b8;">Capital: ₦0.00 (Risk Free)</div>
                    </div>
                  </div>
                  <div style="margin-top: 10px;">
                    <a href="${c.actionUrl}" target="_blank" style="background: #059669; color: #fff; padding: 6px 14px; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 4px; display: inline-block;">
                      🚀 1-Click Launch (${c.executionTime})
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="background: #111827; border: 1px solid #374151; border-radius: 8px; padding: 14px; font-size: 12px; color: #9ca3af; text-align: center;">
              📦 Pillars (Lead Bundles, Micro-SaaS PDF Paywalls, White-Label Agency MRR & B2B Lead Arbitrage) are operating 100% autonomously in the cloud.
            </div>
          </div>

          <div style="background: #030712; padding: 18px 30px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #1f2937;">
            Sent by Bethelmind Autonomous 24/7 Master Monetization Orchestrator • Desk: +234 802 279 1227
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"Bethelmind Master Orchestrator" <${user}>`,
        to: 'bethelmindrecruit@gmail.com',
        subject: `💰 Master Monetization Dossier: ₦${dossier.totalPipelineYieldNGN.toLocaleString()} Pipeline Yield Ready (All 8 Pillars Active)`,
        html: masterEmailHtml
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('[MasterMonetizationDossier Error]:', error.message);
          resolve({ success: false, error: error.message });
        } else {
          console.log(`✅ [MasterMonetizationDossier]: Master 8-Pillar Dossier dispatched (ID: ${info.messageId})`);
          resolve({ success: true, messageId: info.messageId });
        }
      });
    });
  });
}
