export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getLeads } from '@/lib/googleSheets';
import * as XLSX from 'xlsx';

export async function GET() {
  const leads = await getLeads();
  // Convert leads array of objects to worksheet
  const ws = XLSX.utils.json_to_sheet(leads);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Leads');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  const filename = 'leads.xlsx';
  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
