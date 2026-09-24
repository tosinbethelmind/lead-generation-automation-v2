/**
 * @file src/lib/monetization/autonomousOpenSourceCloserDaemon.ts
 * Autonomous Open-Source Closer & Pipeline Synchronizer
 *
 * Automates:
 * 1. Chatwoot Omnichannel Inbound / Outbound Conversations
 * 2. Twenty CRM Visual Deal Pipeline & Stage Progression
 * 3. Cal.com & 1-Tap Walkthrough Appointment Confirmations
 * 4. Post-Contact AI Closer Qualification (< 2s Nigerian Business Tone)
 * 5. Digital Proforma Invoicing & Direct-to-OPay Settlement Handover
 *
 * 100% Free & Open-Source. Runs 24/7 autonomously.
 */

import fs from 'fs';
import path from 'path';
import { chatwootClient } from '../integrations/chatwootClient';
import { twentyCrmClient, TwentyDealStage } from '../integrations/twentyCrmClient';
import { handlePostContactInquiry } from './postContactCloserEngine';
import { generateBankableInvoiceCard } from './postContactInvoiceEngine';
import { BaileysGatewayClient } from '../whatsapp/baileys_gateway_client';

export interface CloserHealthStatus {
  lastRun: string;
  status: 'ACTIVE' | 'IDLE';
  activeConversationsTracked: number;
  dealsAdvancedToday: number;
  appointmentsProcessedToday: number;
  chatwootMode: 'live' | 'local_simulated';
  twentyMode: 'live' | 'local_simulated';
}

export class AutonomousOpenSourceCloserDaemon {
  private healthFilePath: string;
  private appointmentsFilePath: string;
  private journeysFilePath: string;
  private processedAppointments: Set<string>;

  constructor() {
    this.healthFilePath = path.join(process.cwd(), 'local_db', 'opensource_closer_health.json');
    this.appointmentsFilePath = path.join(process.cwd(), 'local_db', 'appointments.json');
    this.journeysFilePath = path.join(process.cwd(), 'local_db', 'lead_journeys.json');
    this.processedAppointments = new Set();
  }

  /**
   * Run one cycle of autonomous pipeline checks and auto-closing
   */
  public async executeCycle(): Promise<CloserHealthStatus> {
    const timestamp = new Date().toISOString();
    let dealsAdvancedToday = 0;
    let appointmentsProcessedToday = 0;

    // 1. Process New Appointments & Walkthrough Bookings
    if (fs.existsSync(this.appointmentsFilePath)) {
      try {
        const raw = fs.readFileSync(this.appointmentsFilePath, 'utf8');
        const appointmentsObj = JSON.parse(raw);
        const list = Array.isArray(appointmentsObj) ? appointmentsObj : Object.values(appointmentsObj);

        for (const appt of list as any[]) {
          const apptId = appt.id || `${appt.customer_name}_${appt.date}`;
          if (!this.processedAppointments.has(apptId)) {
            this.processedAppointments.add(apptId);
            appointmentsProcessedToday++;

            // Auto-advance Twenty CRM deal stage to WALKTHROUGH_BOOKED
            await twentyCrmClient.syncOpportunity({
              leadId: appt.lead_id || apptId,
              businessName: appt.customer_name,
              phone: appt.customer_phone,
              email: appt.customer_email,
              stage: 'WALKTHROUGH_BOOKED',
              dealAmountNGN: 150000,
              notes: `Live Walkthrough Booked: ${appt.time_slot || '10-Min Demo'} on ${appt.date}`
            });

            // Auto-sync into Chatwoot as high-priority hot lead conversation
            await chatwootClient.syncInboundLeadAction({
              businessName: appt.customer_name,
              phone: appt.customer_phone,
              email: appt.customer_email,
              sector: appt.sector || 'Commercial Business',
              messageText: `📅 New 10-Min Walkthrough Booked for ${appt.date} (${appt.time_slot}). Mode: ${appt.notes || 'WhatsApp Call'}`,
              channel: 'walkthrough_booking'
            });

            // Generate official digital proforma invoice ready for handover
            const invoiceCard = generateBankableInvoiceCard({
              businessName: appt.customer_name,
              phone: appt.customer_phone,
              email: appt.customer_email,
              category: appt.sector,
              packageTier: 'TURNKEY_DFY'
            });

            // Notify Admin WhatsApp Desk (0802 279 1227) asynchronously
            const baileys = new BaileysGatewayClient();
            baileys.sendMessage({
              phone: '2348022791227',
              message: `🔔 *NEW 10-MIN DEMO BOOKED*\n\n🏢 Business: *${appt.customer_name}*\n📱 Phone: ${appt.customer_phone}\n📅 Slot: ${appt.date} (${appt.time_slot})\n📂 Sector: ${appt.sector || 'SME'}\n\n*Proforma Invoice Generated:*\n₦75,000 Milestone Deposit (OPay: 7034297995)\nBalance on live approval.\n\nTap to chat lead: wa.me/${(appt.customer_phone || '').replace(/[^0-9]/g, '')}`,
              simulateTyping: false
            }).catch(() => {});
          }
        }
      } catch (err: any) {
        console.warn('[CloserDaemon] Appointment processing notice:', err.message);
      }
    }

    // 2. Scan Journey Telemetry & Advance Deals
    if (fs.existsSync(this.journeysFilePath)) {
      try {
        const raw = fs.readFileSync(this.journeysFilePath, 'utf8');
        const journeys = JSON.parse(raw);
        const records = Object.values(journeys) as any[];
        const todayStr = new Date().toISOString().split('T')[0];

        for (const rec of records.slice(-25)) {
          if (rec.events && Array.isArray(rec.events)) {
            const hasRecentActivity = rec.events.some((e: any) => e.timestamp && e.timestamp.startsWith(todayStr));
            if (!hasRecentActivity && rec.events.length < 2) continue;

            const hasTestedWa = rec.events.some((e: any) => 
              e.title?.includes('WhatsApp') || e.eventType === 'chat_opened' || e.channelUsed?.includes('WhatsApp')
            );
            const hasViewed = rec.events.some((e: any) => 
              e.eventType === 'page_view' || e.title?.includes('Preview')
            );

            let targetStage: TwentyDealStage = 'PROTOTYPE_VIEWED';
            if (hasTestedWa) targetStage = 'WHATSAPP_TESTED';
            else if (hasViewed) targetStage = 'PROTOTYPE_VIEWED';

            await twentyCrmClient.syncOpportunity({
              leadId: rec.leadId || rec.id,
              businessName: rec.leadName || rec.businessName || 'Lagos SME',
              phone: rec.phone,
              email: rec.email,
              area: rec.area,
              sector: rec.category,
              stage: targetStage,
              dealAmountNGN: 150000
            });
            dealsAdvancedToday++;
          }
        }
      } catch (err: any) {
        console.warn('[CloserDaemon] Journey scanning notice:', err.message);
      }
    }

    const status: CloserHealthStatus = {
      lastRun: timestamp,
      status: 'ACTIVE',
      activeConversationsTracked: this.processedAppointments.size,
      dealsAdvancedToday,
      appointmentsProcessedToday,
      chatwootMode: chatwootClient.isConfigured() ? 'live' : 'local_simulated',
      twentyMode: twentyCrmClient.isConfigured() ? 'live' : 'local_simulated'
    };

    try {
      fs.writeFileSync(this.healthFilePath, JSON.stringify(status, null, 2), 'utf8');
    } catch (_) {}

    return status;
  }
}

export const autonomousOpenSourceCloserDaemon = new AutonomousOpenSourceCloserDaemon();
