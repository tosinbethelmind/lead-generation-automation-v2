import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { generateBiExcelBuffer, generateBiPdfBuffer, type BiProspectRow } from '@/lib/commerce/biReportGenerator';
import { getActiveLeadRepository } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim() || req.cookies.get('admin_token')?.value;
    const admin = getAdminUser(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      reportTitle = 'Nigerian Market & Competitor Snapshot',
      sector = 'All Sectors',
      location = 'Lagos',
      format = 'xlsx',
      limit = 50,
    } = body;

    const repo = getActiveLeadRepository();
    const allLeads = await repo.getLeads(500);
    const today = new Date().toISOString().split('T')[0];

    const filtered = allLeads
      .filter((l: any) => {
        const matchLoc = !location || location === 'All' || `${l.city || ''} ${l.area || ''}`.toLowerCase().includes(location.toLowerCase());
        const matchSec = !sector || sector === 'All Sectors' || (l.category || '').toLowerCase().includes(sector.toLowerCase());
        return matchLoc && matchSec;
      })
      .slice(0, Math.min(200, Number(limit) || 50));

    const rows: BiProspectRow[] = filtered.map((l: any) => ({
      businessName: l.name,
      sector: l.category || sector,
      city: l.city || location,
      area: l.area || '',
      phone: l.phone_raw || l.phone_e164 || '',
      website: l.website || '',
      source: l.source || 'Public Directory',
      collectedDate: (l.collected_at || today).slice(0, 10),
    }));

    const reportInput = {
      reportTitle,
      sector,
      location,
      dataSources: 'Verified public business directory listings and repository records.',
      limitations: 'Includes only publicly observed listings currently stored in the verified repository; private revenue is not estimated.',
      rows,
    };

    if (format === 'pdf') {
      const pdfBuf = await generateBiPdfBuffer(reportInput);
      return new NextResponse(new Uint8Array(pdfBuf), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="bethelmind_bi_report.pdf"',
        },
      });
    }

    const xlsxBuf = generateBiExcelBuffer(reportInput);
    return new NextResponse(new Uint8Array(xlsxBuf), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="bethelmind_bi_report.xlsx"',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'BI report generation failed' }, { status: 500 });
  }
}
