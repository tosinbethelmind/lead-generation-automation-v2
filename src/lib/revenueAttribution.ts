/**
 * @file revenueAttribution.ts
 * Revenue Attribution & Campaign ROI Analytics Engine
 * 
 * Computes:
 * - Total Revenue Generated vs Total Campaign Cost
 * - Return on Investment (ROI %)
 * - Cost Per Lead (CPL) & Customer Acquisition Cost (CAC)
 * - Conversion Rate per Outreach Channel (WhatsApp, Email, SMS, Chatbot)
 * - Revenue Breakdown per Sector
 */

import { getDeals, PipelineStats } from './pipelineManager';
import { getRecentActivities } from './activityLogger';

export interface ChannelAttribution {
  channel: string;
  totalOutreach: number;
  conversions: number;
  conversionRatePercent: number;
  revenueGeneratedNgn: number;
}

export interface SectorAttribution {
  sector: string;
  dealCount: number;
  wonValueNgn: number;
  pipelineValueNgn: number;
}

export interface RevenueAttributionReport {
  totalRevenueNgn: number;
  totalPipelineNgn: number;
  totalLeadsContacted: number;
  totalDealsWon: number;
  overallConversionRate: number;
  estimatedCampaignCostNgn: number;
  netProfitNgn: number;
  roiPercent: number;
  costPerLeadNgn: number;
  customerAcquisitionCostNgn: number;
  channelPerformance: ChannelAttribution[];
  sectorBreakdown: SectorAttribution[];
}

export async function generateRevenueAttributionReport(
  estimatedMonthlyOpExNgn = 75000 // Estimated proxy/infra cost
): Promise<RevenueAttributionReport> {
  const [deals, activities] = await Promise.all([
    getDeals(),
    getRecentActivities(2000),
  ]);

  const wonDeals = deals.filter(d => d.won_at || d.stage_id === 'won' || d.stage_id === 'completed');
  const totalRevenueNgn = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const totalPipelineNgn = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const totalDealsWon = wonDeals.length;

  // Outreach counts per channel
  const channelCounts: Record<string, { outreach: number; conversions: number; revenue: number }> = {
    whatsapp: { outreach: 0, conversions: 0, revenue: 0 },
    email: { outreach: 0, conversions: 0, revenue: 0 },
    sms: { outreach: 0, conversions: 0, revenue: 0 },
    chatbot: { outreach: 0, conversions: 0, revenue: 0 },
    contact_form: { outreach: 0, conversions: 0, revenue: 0 },
  };

  let totalOutreachEvents = 0;

  for (const act of activities) {
    if (act.type.startsWith('outreach_') || act.type.startsWith('chatbot_')) {
      totalOutreachEvents++;
      const ch = act.channel || 'whatsapp';
      if (!channelCounts[ch]) {
        channelCounts[ch] = { outreach: 0, conversions: 0, revenue: 0 };
      }
      channelCounts[ch].outreach++;
    }
  }

  // Sector breakdown
  const sectorMap: Record<string, { dealCount: number; wonValue: number; pipelineValue: number }> = {};

  for (const d of deals) {
    const sec = d.sector || 'general';
    if (!sectorMap[sec]) {
      sectorMap[sec] = { dealCount: 0, wonValue: 0, pipelineValue: 0 };
    }
    sectorMap[sec].dealCount++;
    sectorMap[sec].pipelineValue += d.value || 0;
    if (d.won_at || d.stage_id === 'won' || d.stage_id === 'completed') {
      sectorMap[sec].wonValue += d.value || 0;
    }
  }

  const sectorBreakdown: SectorAttribution[] = Object.entries(sectorMap).map(([sector, data]) => ({
    sector,
    dealCount: data.dealCount,
    wonValueNgn: data.wonValue,
    pipelineValueNgn: data.pipelineValue,
  }));

  const channelPerformance: ChannelAttribution[] = Object.entries(channelCounts).map(([channel, data]) => {
    const rate = data.outreach > 0 ? (data.conversions / data.outreach) * 100 : 0;
    return {
      channel,
      totalOutreach: data.outreach,
      conversions: data.conversions,
      conversionRatePercent: Math.round(rate * 10) / 10,
      revenueGeneratedNgn: data.revenue,
    };
  });

  const totalLeadsContacted = Math.max(1, totalOutreachEvents);
  const overallConversionRate = (totalDealsWon / totalLeadsContacted) * 100;
  const netProfitNgn = totalRevenueNgn - estimatedMonthlyOpExNgn;
  const roiPercent = estimatedMonthlyOpExNgn > 0 ? (netProfitNgn / estimatedMonthlyOpExNgn) * 100 : 0;
  const costPerLeadNgn = Math.round(estimatedMonthlyOpExNgn / totalLeadsContacted);
  const customerAcquisitionCostNgn = totalDealsWon > 0 ? Math.round(estimatedMonthlyOpExNgn / totalDealsWon) : 0;

  return {
    totalRevenueNgn,
    totalPipelineNgn,
    totalLeadsContacted,
    totalDealsWon,
    overallConversionRate: Math.round(overallConversionRate * 10) / 10,
    estimatedCampaignCostNgn: estimatedMonthlyOpExNgn,
    netProfitNgn,
    roiPercent: Math.round(roiPercent),
    costPerLeadNgn,
    customerAcquisitionCostNgn,
    channelPerformance,
    sectorBreakdown,
  };
}
