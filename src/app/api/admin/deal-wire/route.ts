/**
 * @file src/app/api/admin/deal-wire/route.ts
 * 
 * 🏛️ DEAL WIRE EXECUTIVE API
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
 */

import { NextResponse } from 'next/server';
import { highTicketDealWireEngine, DealWireBrief } from '@/lib/dealWire/highTicketDealWireEngine';
import { executeDealWireHarvest } from '@/lib/dealWire/highIntentPortalHarvester';
import { fetchBusinessListLeads } from '@/lib/directoryScrapers';

export async function GET() {
  try {
    const briefs = highTicketDealWireEngine.getStoredBriefs();

    let totalDealFlowVal = 0;
    let totalAgencyFeePool = 0;
    let totalBethelmindPool = 0;

    briefs.forEach((b: DealWireBrief) => {
      totalDealFlowVal += b.budget_amount_ngn;
      totalAgencyFeePool += b.estimated_commission_pool_ngn;
      totalBethelmindPool += b.bethelmind_origination_fee_ngn;
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      cac_registration: 'Reg: 9912717',
      settlement_account: '6805375225 (Moniepoint MFB - Bethelmind Digital Solutions)',
      metrics: {
        total_briefs: briefs.length,
        total_deal_flow_val_ngn: totalDealFlowVal,
        total_agency_fee_pool_ngn: totalAgencyFeePool,
        total_bethelmind_pool_ngn: totalBethelmindPool
      },
      briefs
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'harvest') {
      const harvestResult = await executeDealWireHarvest();
      const updatedBriefs = highTicketDealWireEngine.getStoredBriefs();
      return NextResponse.json({
        success: true,
        harvestedCount: harvestResult.harvestedCount,
        totalBriefs: updatedBriefs.length,
        briefs: updatedBriefs
      });
    }

    if (action === 'update_status') {
      const { deal_id, status } = body;
      const briefs = highTicketDealWireEngine.getStoredBriefs();
      const target = briefs.find(b => b.deal_id === deal_id);
      if (!target) {
        return NextResponse.json({ success: false, error: 'Deal not found' }, { status: 404 });
      }
      target.qualification_status = status;
      if (status === 'VERIFIED_CASH_READY') {
        target.timestamps.verified_at = new Date().toISOString();
      } else if (status === 'CLOSED_SETTLED') {
        target.timestamps.closed_at = new Date().toISOString();
      }
      highTicketDealWireEngine.saveBriefs(briefs);
      return NextResponse.json({ success: true, updated: target });
    }

    if (action === 'fetch_partners') {
      const { sector = 'realtors' } = body;
      const leads = await fetchBusinessListLeads(sector, 'lagos_wire', 10);
      const partners = leads
        .filter(l => Boolean(l.phone_e164 || l.phone_raw))
        .map(l => ({
          name: l.name,
          phone: l.phone_e164 || l.phone_raw,
          area: l.area || 'Lagos'
        }));
      return NextResponse.json({ success: true, partners });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
