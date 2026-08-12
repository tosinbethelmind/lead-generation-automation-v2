import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const adAccountId = searchParams.get('adAccountId') || 'act_981230491823';

    // Simulated real-time performance insights from Meta Marketing API
    const analyticsData = {
      adAccountId,
      currency: 'NGN',
      totalSpend: 145000,
      impressions: 48200,
      clicks: 1840,
      ctrPercent: 3.81,
      cpc: 78.8,
      leadsGenerated: 94,
      costPerLead: 1542,
      roasRatio: 4.85, // Return On Ad Spend multiplier
      guardrailAlerts: [
        { campaign: 'Lagos Solar Lead Generation', status: 'WINNING', message: 'ROAS is 5.2x - Recommendation: Increase daily budget by 20%' },
        { campaign: 'Retargeting - Site Visitors', status: 'ALERT', message: 'CPL spiked above ₦2,500 - Recommendation: Refresh video ad creative' },
      ],
      topCreatives: [
        { name: 'Video A: 24h Solar Inverter Demo', thumbStopRate: '42%', hookRate: '58%', cpl: 1200 },
        { name: 'Image B: Carousel Pricing Sheet', thumbStopRate: '31%', hookRate: '41%', cpl: 1850 },
      ]
    };

    return NextResponse.json({ success: true, data: analyticsData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
