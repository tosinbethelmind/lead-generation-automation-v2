import * as XLSX from 'xlsx';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { BRAND_IDENTITY } from '@/lib/commerce/catalog';

export interface BiProspectRow {
  businessName: string;
  sector: string;
  city: string;
  area?: string;
  phone?: string;
  website?: string;
  source: string;
  collectedDate: string;
}

export interface BiReportInput {
  reportTitle: string;
  sector: string;
  location: string;
  dataSources: string;
  limitations: string;
  rows: BiProspectRow[];
}

export function generateBiExcelBuffer(input: BiReportInput): Buffer {
  const wb = XLSX.utils.book_new();

  const summaryRows = [
    ['Report Title', input.reportTitle],
    ['Prepared By', `${BRAND_IDENTITY.companyName} (${BRAND_IDENTITY.cacReg})`],
    ['Target Sector', input.sector],
    ['Target Location', input.location],
    ['Collection Date', new Date().toISOString().split('T')[0]],
    ['Verified Records Count', input.rows.length],
    ['Data Sources', input.dataSources],
    ['Limitations', input.limitations],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Executive Summary');

  const dataRows = input.rows.map((r, i) => ({
    '#': i + 1,
    'Business Name': r.businessName,
    Sector: r.sector,
    City: r.city,
    Area: r.area || '',
    Phone: r.phone || '',
    Website: r.website || 'None Listed',
    Source: r.source,
    'Collected Date': r.collectedDate,
  }));

  const dataSheet = XLSX.utils.json_to_sheet(dataRows);
  XLSX.utils.book_append_sheet(wb, dataSheet, 'Verified Businesses');

  return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
}

export async function generateBiPdfBuffer(input: BiReportInput): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 790;
  page.drawText(BRAND_IDENTITY.companyName, { x: 50, y, size: 12, font: fontBold, color: rgb(0.12, 0.16, 0.28) });
  y -= 26;
  page.drawText(input.reportTitle, { x: 50, y, size: 18, font: fontBold, color: rgb(0.05, 0.05, 0.08) });
  y -= 22;
  page.drawText(`Sector: ${input.sector}  |  Location: ${input.location}  |  Date: ${new Date().toISOString().split('T')[0]}`, {
    x: 50,
    y,
    size: 10,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.4),
  });
  y -= 24;
  page.drawText(`Verified Records Observed: ${input.rows.length}`, { x: 50, y, size: 11, font: fontBold });
  y -= 18;
  page.drawText(`Data Sources: ${input.dataSources.slice(0, 95)}`, { x: 50, y, size: 9, font: fontRegular });
  y -= 14;
  page.drawText(`Limitations: ${input.limitations.slice(0, 95)}`, { x: 50, y, size: 9, font: fontRegular });
  y -= 28;

  page.drawText('Sample Verified Listings (Publicly Observed):', { x: 50, y, size: 11, font: fontBold });
  y -= 18;

  for (const row of input.rows.slice(0, 22)) {
    const line = `• ${row.businessName} (${row.area || row.city}) — ${row.website || 'No standalone website'} [${row.source}]`;
    page.drawText(line.slice(0, 95), { x: 55, y, size: 9, font: fontRegular });
    y -= 15;
    if (y < 60) break;
  }

  return Buffer.from(await pdfDoc.save());
}
